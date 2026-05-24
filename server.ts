import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

// Imports from services and libraries
import { runAuditAnalysis } from './src/lib/auditEngine';
import { generateAISummary } from './src/lib/aiSummary';
import { sendLeadConfirmationEmail } from './src/lib/email';
import { saveAudit, getAuditByPublicId } from './src/services/auditService';
import { saveLead } from './src/services/leadService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // In-memory rate limiting map for IP throttling
  const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();
  const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
  const RATE_LIMIT_MAX_REQUESTS = 15;

  function rateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
    const ip = req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown';
    const now = Date.now();
    
    const record = ipRequestCounts.get(ip);
    if (!record || now > record.resetTime) {
      ipRequestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
      return next();
    }
    
    record.count++;
    if (record.count > RATE_LIMIT_MAX_REQUESTS) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
    
    next();
  }

  // API Endpoints

  /**
   * POST /api/audits
   * Calculates audit metrics, generates AI summary, and stores audit report.
   */
  app.post('/api/audits', async (req, res) => {
    try {
      const { company_name, domain_name, team_size, use_case, subscriptions, user_id } = req.body;

      if (!company_name || !domain_name || !team_size || !use_case) {
        return res.status(400).json({ error: 'Missing required parameters.' });
      }

      // Compute calculations using deterministic heuristics audit engine
      const calculatedReport = runAuditAnalysis(
        company_name.trim(),
        domain_name.trim(),
        Number(team_size),
        use_case,
        subscriptions || []
      );

      // Invoke Gemini API for summary (falls back to template automatically if key missing)
      const aiSummary = await generateAISummary(
        calculatedReport.companyName,
        calculatedReport.potentialMonthlySavings,
        calculatedReport.potentialAnnualSavings,
        calculatedReport.duplicateToolsCount,
        calculatedReport.inactiveSeatsCount,
        calculatedReport.primaryUseCase,
        calculatedReport.recommendations.length
      );

      calculatedReport.aiSummary = aiSummary;

      // Generate a random unique public ID
      const publicId = `audit-${crypto.randomBytes(6).toString('hex')}`;

      // Save to Supabase (or fallback in-memory)
      const savedReport = await saveAudit({
        public_id: publicId,
        company_name: calculatedReport.companyName,
        domain_name: calculatedReport.domainName,
        team_size: calculatedReport.teamSize,
        use_case: calculatedReport.primaryUseCase,
        subscriptions: calculatedReport.subscriptionsAnalyzed,
        audit_results: {
          recommendations: calculatedReport.recommendations,
          teamMetrics: calculatedReport.teamMetrics,
          optimizedSpendMonthly: calculatedReport.optimizedSpendMonthly,
          aiSummary: aiSummary,
          duplicateToolsCount: calculatedReport.duplicateToolsCount,
          inactiveSeatsCount: calculatedReport.inactiveSeatsCount,
        },
        monthly_savings: calculatedReport.potentialMonthlySavings,
        annual_savings: calculatedReport.potentialAnnualSavings,
        user_id: user_id || null,
      });

      const reportWithId: any = {
        ...calculatedReport,
        id: savedReport.id,
        publicId: publicId,
        aiSummary: aiSummary
      };

      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const shareableUrl = `${protocol}://${req.headers.host}/report/${publicId}`;

      return res.status(200).json({
        success: true,
        report: reportWithId,
        shareableUrl
      });
    } catch (error: any) {
      console.error('[API Audit Error]', error);
      return res.status(500).json({ error: 'Failed to run and save audit.' });
    }
  });

  /**
   * GET /api/public-reports/:publicId
   * Retrieves an audit report by public ID and anonymizes company details for compliance.
   */
  app.get('/api/public-reports/:publicId', async (req, res) => {
    try {
      const { publicId } = req.params;
      const audit = await getAuditByPublicId(publicId);

      if (!audit) {
        return res.status(404).json({ error: 'Audit report not found.' });
      }

      // Anonymize/Sanitize fields
      const sanitizedCompanyName = 'Anonymous Startup';
      const sanitizedDomainName = 'anonymous.io';

      // Map departments to generalized identifiers (e.g. Engineering -> Dept A) to prevent revealing layout
      const deptMap: { [key: string]: string } = {};
      let deptCounter = 65; // 'A' in ASCII

      const anonymizeDept = (deptName: string) => {
        if (!deptName) return 'Undisclosed';
        if (!deptMap[deptName]) {
          deptMap[deptName] = `Team ${String.fromCharCode(deptCounter++)}`;
        }
        return deptMap[deptName];
      };

      const sanitizedSubscriptions = (audit.subscriptions || []).map((sub: any) => ({
        ...sub,
        department: anonymizeDept(sub.department),
      }));

      const results = audit.audit_results || {};
      const sanitizedRecommendations = (results.recommendations || []).map((rec: any) => ({
        ...rec,
        description: rec.description ? rec.description.replace(new RegExp(audit.company_name, 'gi'), sanitizedCompanyName) : rec.description,
        reasoning: rec.reasoning ? rec.reasoning.replace(new RegExp(audit.company_name, 'gi'), sanitizedCompanyName) : rec.reasoning,
      }));

      const sanitizedTeamMetrics = (results.teamMetrics || []).map((metric: any) => ({
        ...metric,
        department: anonymizeDept(metric.department),
      }));

      const sanitizedSummary = audit.audit_results?.aiSummary || audit.company_name
        ? (audit.audit_results?.aiSummary || '').replace(new RegExp(audit.company_name, 'gi'), sanitizedCompanyName)
        : '';

      const sanitizedReport = {
        id: audit.id,
        publicId: audit.public_id,
        companyName: sanitizedCompanyName,
        domainName: sanitizedDomainName,
        teamSize: audit.team_size,
        primaryUseCase: audit.use_case,
        currentSpendMonthly: Number(audit.monthly_savings) + Number(results.optimizedSpendMonthly || 0),
        optimizedSpendMonthly: Number(results.optimizedSpendMonthly || 0),
        potentialMonthlySavings: Number(audit.monthly_savings),
        potentialAnnualSavings: Number(audit.annual_savings),
        duplicateToolsCount: results.duplicateToolsCount ?? 0,
        inactiveSeatsCount: results.inactiveSeatsCount ?? 0,
        subscriptionsAnalyzed: sanitizedSubscriptions,
        recommendations: sanitizedRecommendations,
        teamMetrics: sanitizedTeamMetrics,
        aiSummary: sanitizedSummary || `Our SaaS stack audit for Anonymous Startup highlights an optimization opportunity of $${Number(audit.monthly_savings).toLocaleString()}/mo ($${Number(audit.annual_savings).toLocaleString()}/yr) in recurring licensing fees.`
      };

      return res.status(200).json({
        success: true,
        report: sanitizedReport
      });
    } catch (error: any) {
      console.error('[API Fetch Public Report Error]', error);
      return res.status(500).json({ error: 'Failed to fetch public report.' });
    }
  });

  /**
   * POST /api/leads
   * Implements honeypots, rate limiting, saves captured leads, and dispatches confirmation email.
   */
  app.post('/api/leads', rateLimiter, async (req, res) => {
    try {
      const { email, company_name, role, team_size, audit_id, honeypot } = req.body;

      // 1. Honeypot check (anti-spam)
      if (honeypot) {
        console.warn('[Honeypot Warning] Blocked automated bot spam submission.');
        return res.status(400).json({ error: 'Spam validation failed.' });
      }

      if (!email) {
        return res.status(400).json({ error: 'Email address is required.' });
      }

      // 2. Save lead record
      const savedLead = await saveLead({
        email,
        company_name,
        role,
        team_size: team_size ? Number(team_size) : undefined,
        audit_id,
      });

      // 3. Dispatch transactional confirmation email via Resend
      let emailSuccess = false;
      if (audit_id) {
        // Attempt to find associated audit to send personalized metrics
        const audit = await getAuditByPublicId(audit_id);

        const monthlySavings = audit ? Number(audit.monthly_savings) : 0;
        const annualSavings = audit ? Number(audit.annual_savings) : 0;
        const aiSummary = audit?.audit_results?.aiSummary || 'Save on duplicate software seats.';
        
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const publicId = audit ? audit.public_id : 'unknown';
        const reportUrl = `${protocol}://${req.headers.host}/report/${publicId}`;

        emailSuccess = await sendLeadConfirmationEmail(
          email,
          company_name || audit?.company_name || 'Your Startup',
          monthlySavings,
          annualSavings,
          aiSummary,
          reportUrl
        );
      } else {
        // Direct subscription lead email
        emailSuccess = await sendLeadConfirmationEmail(
          email,
          company_name || 'Your Startup',
          0,
          0,
          'Your Auto Audit report is ready for scanning.',
          `${req.protocol}://${req.headers.host}`
        );
      }

      return res.status(200).json({
        success: true,
        lead: savedLead,
        emailSent: emailSuccess
      });
    } catch (error: any) {
      console.error('[API Lead Error]', error);
      return res.status(500).json({ error: 'Failed to record lead.' });
    }
  });

  // Helper for dynamic OpenGraph metadata injection in shared reports
  function injectMetaTags(template: string, audit: any, url: string): string {
    const companyName = 'Anonymous Startup';
    const monthlySavings = Number(audit.monthly_savings || 0);
    const annualSavings = Number(audit.annual_savings || 0);
    
    const results = audit.audit_results || {};
    const recs = results.recommendations || [];
    const monthlySpendOpt = Number(results.optimizedSpendMonthly || 0);
    const currentSpend = monthlySavings + monthlySpendOpt;
    
    const duplicateTools = recs.filter((r: any) => r.type === 'remove_redundant' || r.type === 'consolidate').length;
    const ghostSeats = recs.filter((r: any) => r.title.toLowerCase().includes('ghost') || r.title.toLowerCase().includes('idle')).reduce((sum: number, r: any) => {
      const match = r.description.match(/(\d+)\s+idle/i) || r.description.match(/(\d+)\s+inactive/i) || r.description.match(/estimate\s+at\s+least\s+(\d+)\s+inactive/i);
      return sum + (match ? parseInt(match[1]) : 0);
    }, 0) || Number(audit.team_size > 0 ? Math.max(0, Math.round(audit.team_size * 0.3)) : 0);

    const title = `AI Spend Audit for ${companyName}`;
    const description = `Monthly Spend: $${currentSpend.toLocaleString()} | Potential Savings: $${monthlySavings.toLocaleString()}/mo ($${annualSavings.toLocaleString()}/yr). Duplicate Tools: ${duplicateTools}. Ghost Seats: ${ghostSeats}.`;
    const imageUrl = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80";

    const metaTags = `
      <title>${title}</title>
      <meta name="description" content="${description}" />
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:url" content="${url}" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${description}" />
      <meta name="twitter:image" content="${imageUrl}" />
    `;

    // Remove existing title tag if present
    const cleanTemplate = template.replace(/<title>.*?<\/title>/gi, '');
    
    // Inject tags right after <head>
    return cleanTemplate.replace(/<head>/i, `<head>${metaTags}`);
  }

  let viteInstance: any = null;

  // Intercept public report requests for social crawlers and previews
  app.get('/report/:publicId', async (req, res, next) => {
    try {
      const { publicId } = req.params;
      const audit = await getAuditByPublicId(publicId);
      
      if (!audit) {
        return next(); // Fall through to standard client-side routing and 404
      }

      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const requestUrl = `${protocol}://${req.headers.host}${req.originalUrl}`;

      let templatePath = '';
      if (process.env.NODE_ENV === 'production') {
        templatePath = path.resolve(__dirname, 'dist', 'index.html');
      } else {
        templatePath = path.resolve(__dirname, 'index.html');
      }

      if (!fs.existsSync(templatePath)) {
        return next();
      }

      let html = fs.readFileSync(templatePath, 'utf-8');

      // Inject custom OpenGraph tags
      html = injectMetaTags(html, audit, requestUrl);

      // If in development mode, apply Vite HTML transformation
      if (process.env.NODE_ENV !== 'production' && viteInstance) {
        html = await viteInstance.transformIndexHtml(req.originalUrl, html);
      }

      return res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (err) {
      console.error('[OpenGraph Meta Injection Error]', err);
      next(err);
    }
  });

  // Serve Frontend Bundle with Vite in development, or Express.static in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Dynamic import to avoid dev dependencies compiling in production
    const { createServer: createViteServer } = await import('vite');
    viteInstance = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    
    app.use(viteInstance.middlewares);
    
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(
          path.resolve(__dirname, 'index.html'),
          'utf-8'
        );
        template = await viteInstance.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        if (viteInstance) viteInstance.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  if (process.env.VERCEL) {
    return app;
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 Auto Audit MVP Server initialized on http://localhost:${PORT}`);
    console.log(`==================================================\n`);
  });
  return app;
}

export const appPromise = startServer();
