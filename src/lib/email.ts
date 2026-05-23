import { Resend } from 'resend';

/**
 * Dynamically retrieves the Resend client based on the current environment variables.
 */
export function getResendClient() {
  const resendApiKey = process.env.RESEND_API_KEY || '';
  const isConfigured = !!(resendApiKey && resendApiKey !== 'MY_RESEND_API_KEY');
  return isConfigured ? new Resend(resendApiKey) : null;
}

/**
 * Dispatches an audit notification email to the captured lead.
 */
export async function sendLeadConfirmationEmail(
  toEmail: string,
  companyName: string,
  monthlySavings: number,
  annualSavings: number,
  aiSummary: string,
  reportUrl: string
): Promise<boolean> {
  const client = getResendClient();
  const from = 'Auto Audit <onboarding@resend.dev>';
  const subject = `AI Spend Audit Report for ${companyName}`;
  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #ffffff; color: #1f2937;">
      <h2 style="color: #6d28d9; margin-bottom: 5px;">🧠 Auto Audit</h2>
      <p style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; margin-bottom: 20px;">SaaS Spend Optimization Report</p>
      
      <p>Hi there,</p>
      <p>Your SaaS stack audit for <strong>${companyName}</strong> has been processed successfully.</p>
      
      <div style="background-color: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 6px; padding: 15px; margin: 20px 0;">
        <h4 style="color: #5b21b6; margin-top: 0; margin-bottom: 10px;">📈 Financial Summary Highlights</h4>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
          <li><strong>Estimated Monthly Savings:</strong> $${monthlySavings.toLocaleString()}/mo</li>
          <li><strong>Estimated Annual Savings:</strong> $${annualSavings.toLocaleString()}/yr</li>
        </ul>
      </div>

      <div style="margin: 20px 0;">
        <h4 style="color: #1f2937; margin-bottom: 8px;">📋 Executive Summary</h4>
        <p style="color: #4b5563; font-style: italic; line-height: 1.6; margin: 0;">"${aiSummary}"</p>
      </div>

      <div style="margin-top: 30px; text-align: center;">
        <a href="${reportUrl}" style="background-color: #6d28d9; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
          View Public Shareable Report
        </a>
      </div>

      <p style="font-size: 11px; color: #9ca3af; margin-top: 40px; border-top: 1px solid #eaeaea; padding-top: 20px;">
        Auto Audit, Inc. | Real-time AI Spend Optimizations.
      </p>
    </div>
  `;

  if (!client) {
    console.log('\n[Email Logger Fallback] Resend API Key is missing. Printing transactional email:');
    console.log('--------------------------------------------------');
    console.log(`TO:      ${toEmail}`);
    console.log(`FROM:    ${from}`);
    console.log(`SUBJECT: ${subject}`);
    console.log('--------------------------------------------------');
    console.log(`BODY:\n${htmlContent}`);
    console.log('--------------------------------------------------\n');
    return true;
  }

  try {
    const { data, error } = await client.emails.send({
      from,
      to: [toEmail],
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error('[Resend API Error]', error);
      return false;
    }
    console.log('[Resend Email Sent Successfully]', data);
    return true;
  } catch (err) {
    console.error('[Resend System Exception]', err);
    return false;
  }
}
