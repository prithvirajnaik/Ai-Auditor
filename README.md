# Auto Audit

An AI-powered SaaS spend audit platform that analyzes your team's AI tool subscriptions and surfaces concrete cost-saving recommendations. Built as a production-style MVP for the Credex Web Development Internship.

---

## What It Does

Teams accumulate AI subscriptions fast. Cursor for the engineers, ChatGPT Team for everyone, Claude Pro for a few people, GitHub Copilot because the previous CTO set it up two years ago — and nobody's looked at it since.

Auto Audit takes your subscription list, runs a deterministic heuristics engine over it, and tells you exactly what to cut, consolidate, or downgrade. The output includes estimated monthly/annual savings, ghost seat detection, duplicate tool flags, and an AI-generated executive summary. Reports are shareable via a public URL — useful for forwarding to a finance lead or department manager.

---

## Deployed URL

> **https://auto-audit.vercel.app** *(placeholder — update post-deployment)*

---

## Screenshots

| Landing Page | Audit Form | Results Dashboard |
|---|---|---|
| *(screenshot)* | *(screenshot)* | *(screenshot)* |

| Public Shareable Report | Team Analytics | Audit History |
|---|---|---|
| *(screenshot)* | *(screenshot)* | *(screenshot)* |

---

## Features

- **Subscription Input Wizard** — Add tools by name (Cursor, Claude, ChatGPT, Copilot, etc.), select plan tier, assign to a department, and enter seat/cost data
- **Deterministic Audit Engine** — 7 rule-based heuristics covering duplicate code editors, chatbot overlap, ghost seat detection, plan seat minimums, inactive subscriptions, API overspending, and orphan individual accounts
- **AI-Generated Executive Summary** — Calls Gemini 2.5 Flash to write a ~100-word financial summary; falls back to a structured template if the key is missing
- **Shareable Public Reports** — Each audit gets a `crypto.randomBytes`-generated public ID (`audit-xxxxxxxx`). Reports are fully anonymized before exposure
- **OpenGraph Meta Injection** — The server intercepts `/report/:publicId` requests and injects dynamic OG tags so link previews show real savings numbers
- **Lead Capture + Transactional Email** — Captures email/role post-audit, dispatches a personalized confirmation email via Resend with savings highlights and a report link
- **Abuse Protection** — Honeypot field on the leads form, IP-based in-memory rate limiter (15 req/min), input validation on all API routes
- **Supabase Auth** — Signup, login, session persistence, route guards. Profiles table auto-provisioned via PostgreSQL trigger on `auth.users` insert
- **Audit History** — Authenticated users see all their past audits; returning users are routed directly to their latest report on login
- **Local Persistence** — `useLocalStorage` hook persists active report and current page across reloads, no login required to view results
- **CI Pipeline** — GitHub Actions runs TypeScript type-check and Vitest unit tests on every push to `main`

---

## Local Setup

### Prerequisites

- Node.js 20+
- npm
- A Supabase project (optional but recommended)
- Gemini API key (optional — summary falls back gracefully)
- Resend API key (optional — email falls back to console logger)

### Steps

```bash
# Clone the repo
git clone https://github.com/your-username/auto-audit.git
cd auto-audit

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

Edit `.env` with your credentials:

```env
GEMINI_API_KEY=your_gemini_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_key
NODE_ENV=development
```

```bash
# Start the dev server (Express + Vite unified)
npm run dev
```

The app runs at `http://localhost:3000`. Vite's HMR is active in dev mode.

### Without External Services

The app is built to degrade gracefully. If `SUPABASE_URL` is missing, audits save to in-memory fallback. If `GEMINI_API_KEY` is missing, the summary uses a template. If `RESEND_API_KEY` is missing, emails print to the terminal.

---

## Running Tests

```bash
npm run test
```

Runs the Vitest suite in `tests/auditEngine.test.ts`. 5 test cases covering all major audit rules.

```bash
npm run lint
```

Runs TypeScript type-check (`tsc --noEmit`). Zero warnings or errors expected.

---

## Deployment (Vercel)

The project is structured for Vercel serverless deployment:

```bash
# Build the frontend bundle
npm run build

# Deploy via Vercel CLI
npx vercel --prod
```

Or connect the GitHub repo to Vercel and it auto-deploys on push.

The `vercel.json` routes all API requests to `api/index.ts` (Express serverless wrapper) and all other routes to `dist/index.html` for client-side SPA routing.

Set the following environment variables in Vercel dashboard:
- `GEMINI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `RESEND_API_KEY`
- `NODE_ENV=production`

---

## Architecture Overview

```
Browser (React/Vite SPA)
    │
    ▼
Express Server (server.ts)
    ├── POST /api/audits       → runAuditAnalysis() → generateAISummary() → saveAudit()
    ├── GET  /api/public-reports/:id → getAuditByPublicId() → anonymize → return
    ├── POST /api/leads        → honeypot check → saveLead() → sendLeadConfirmationEmail()
    └── GET  /report/:id       → injectMetaTags() → serve HTML with OG tags
    
src/lib/
    ├── auditEngine.ts         → 7 deterministic heuristic rules, pure TypeScript
    ├── calculations.ts        → helper math (totals, grouping, seat math)
    ├── aiSummary.ts           → Gemini API call + fallback template
    ├── email.ts               → Resend client + HTML email builder
    ├── pricing.ts             → canonical pricing catalog (9 AI tools)
    └── supabase.ts            → Supabase client initialization

Database (Supabase PostgreSQL)
    ├── audits                 → uuid, public_id, JSONB subscriptions + results, savings metrics
    ├── leads                  → email, company_name, role, FK → audits
    └── profiles               → user_id FK → auth.users, company_name, role
```

---

## Engineering Tradeoffs

**1. Deterministic engine vs. LLM-generated recommendations**

The audit rules (ghost seats, duplicate editors, plan minimums) are hardcoded heuristics, not LLM-generated. I considered having Gemini generate recommendations from raw subscription data, but that introduces non-determinism — the recommendations change on every run, which makes unit testing impossible and makes the output unreliable for financial decisions. The LLM is only used for the executive *summary*, where slight variation is acceptable. The math is always deterministic.

**2. Single Express server serving both API and SPA**

Rather than deploying a separate API server and a static CDN for the frontend, I combined them into a single Express instance that handles both. In dev, Vite runs as middleware. In prod, it serves the `dist/` bundle statically. This simplifies deployment (one Vercel project, one set of env vars) but means the API and frontend are coupled. For a real product at scale, you'd want to separate them.

**3. Public report anonymization on the server side**

I anonymize company names on the *server* at fetch time, not at write time. This means the real company name is stored in the DB but never exposed through the public endpoint. The trade-off: if I wanted to batch-process all reports for analytics, I'd have access to real names — which is both a feature and a risk. A stricter approach would hash names at write time, but that would break the owner's dashboard view.

**4. In-memory rate limiter vs. Redis**

The rate limiter uses a `Map<string, { count, resetTime }>` in process memory. This is fine for a single-instance deployment but fails if you scale horizontally (multiple workers don't share memory). A Redis-backed rate limiter (e.g., `express-rate-limit` + `rate-limit-redis`) would be the right call for production. This was a time tradeoff — implementing Redis for a MVP internship project wasn't worth the added complexity.

**5. `useLocalStorage` for report state vs. server-side session**

The current report state is persisted in `localStorage` and passed as props through the React component tree. No global state manager (Redux, Zustand, etc.) is used. This was intentional for scope — localStorage + prop drilling is simple, debuggable, and works without a backend session. The downside is that state can get out of sync if the user opens the app in two tabs. For a real product, you'd fetch the report from the database on every page load instead of relying on client-side cache.

---

## Future Improvements

- **IdP integrations**: Okta, Google Workspace APIs to automatically detect ghost accounts from actual login activity, rather than relying on seat count heuristics
- **Financial data import**: Stripe or QuickBooks OAuth to parse real billing statements
- **Slack bot**: Post weekly spend reports and ask about unused licenses interactively
- **Benchmark comparisons**: "Your Cursor spend per developer is 2.3x the median startup" — needs a dataset, but would make the recommendations much more persuasive
- **Scheduled audits**: Cron job that re-runs the audit monthly and emails the delta
- **Webhook integrations**: Direct cancellation links to Stripe billing portals via Zapier/Make
- **Multi-org support**: Parent company viewing subsidiary spend across departments
