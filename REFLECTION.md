# Auto Audit — Engineering Reflections

This document contains reflections on the development of the Auto Audit platform, covering technical hurdles, design decisions that got reversed, what I'd build next, and an honest self-assessment.

---

## 1. Hardest Bug

### The Problem: Potential Savings Always Showed $0 on First Load

After wiring up the dashboard, every newly generated audit showed **$0/mo in potential savings** and **100% spend efficiency** — even when the recommendations section was fully populated with items like "consolidate GitHub Copilot and Cursor" showing individual savings of $50, $30, etc.

This was confusing because the recommendations were clearly there. The dashboard was just failing to total them up.

### Root Cause

The `calculateOptimizedSpend` function in `calculations.ts` computed savings by filtering recommendations with `status === 'applied'`. The idea was that the dashboard had interactive buttons where users could "apply" or "dismiss" each recommendation, and the savings counter would update dynamically.

The bug: all recommendations are initialized with `status: 'pending'`. So on first load, the filter returns zero items, the applied savings sum to `$0`, and the dashboard reports perfect efficiency — which is mathematically correct given the filter logic, but completely wrong from a user perspective.

### Fix

I refactored `runAuditAnalysis()` in `auditEngine.ts` to compute `potentialMonthlySavings` as the sum of *all* recommendation savings, regardless of status. The optimized spend is `currentSpend - totalPotentialSavings`. The interactive "apply/dismiss" buttons on individual recommendations still work — they decrement from the potential savings figure — but the initial state now shows the full potential correctly.

The fix was about 10 lines of code. Finding the root cause took longer than it should have because I kept looking at the React components and re-reading the dashboard render logic, assuming the problem was in prop passing. It was purely a server-side calculation issue.

---

## 2. Decision I Reversed: Keeping Calculations in React Components

### Initial Design

When I started building, the audit rules and math ran inside the React component that rendered the dashboard. The form would collect subscriptions, pass them to the dashboard component as props, and the component would run the calculations inline on mount.

This felt natural — the calculations are "for display purposes," so they live near the UI.

### Why I Changed It

Three days in, I needed to:
1. Run the same calculations on the Express server to persist correct results to Supabase
2. Write unit tests without mounting React components (Vitest + jsdom for a math engine is painful and unnecessary)
3. Use the calculation output to generate OpenGraph metadata server-side before the client loads

All three were blocked by the calculations being inside the component tree. The audit logic was tightly coupled to React's render lifecycle, which meant it couldn't run headlessly.

### What I Did Instead

Extracted everything into `src/lib/auditEngine.ts` and `src/lib/calculations.ts` — pure TypeScript functions with no React imports, no side effects, no DOM dependencies. The same `runAuditAnalysis()` function now runs in:
- The browser (client-side fallback for guest users)
- The Express server (`POST /api/audits` handler)
- Vitest tests (`npm run test`)

This was the right call. It made testing trivial and decoupled the display logic from the business logic cleanly.

---

## 3. Week 2 Roadmap

If I had another week, here's what I'd prioritize — in rough order:

**1. Real Ghost Seat Detection via IdP APIs**

The current ghost seat detection is a heuristic: if `totalSeats > teamSize × 1.3`, flag the surplus. This is a guess. Real ghost seat detection means querying Okta, Google Workspace, or Azure AD for users who haven't logged into a tool in the last 30 days. Integrating with even one IdP (Google Workspace is most common for startups) would make the recommendations dramatically more credible.

**2. Stripe / QuickBooks Billing Import**

Right now users manually enter their subscription costs. That's a friction point and an accuracy risk — people round numbers, forget annual-to-monthly conversion, misremember seat counts. An OAuth flow with Stripe or a QuickBooks integration that parses actual invoices would make the audit much more accurate and would also dramatically lower the time-to-value in onboarding.

**3. Scheduled Audit Emails**

Set up a cron job that re-runs the audit monthly, diffs the new recommendations against the previous report, and emails the delta. "Since your last audit, you've saved $X by following these recommendations. We also found 2 new optimization opportunities." This turns a one-time tool into a recurring retention loop.

**4. Slack Bot Integration**

Post weekly spend summaries to a designated Slack channel. More importantly: when a ghost seat is detected, DM the employee directly — "Hey, it looks like you have a Claude Pro license but haven't used it in 3 weeks. Want me to flag it for recycling?" That interactive loop is where the real value is.

**5. Cleaner Test Coverage**

The current test suite covers the core audit rules well, but there are no tests for the API route handlers, the anonymization logic in the public reports endpoint, or the email module. I'd add integration tests for those and increase confidence in the Supabase service layer.

---

## 4. AI Tooling Usage

I used AI tools throughout this project, mostly for three things:

**Generating edge case test inputs**

Writing realistic subscription combinations for the Vitest tests was tedious. I used Gemini to generate mock `SubscriptionItem` arrays that matched specific edge cases — like a company with Claude Team at 3 seats (triggering the 5-seat minimum bug), or overlapping Cursor and Copilot in the same Engineering department with mismatched seat counts. The tests I wrote from these were then manually checked against the engine output.

**TypeScript error debugging**

When I was wiring the Express server with ES module imports and `dotenv/config`, there was an import hoisting issue where `process.env` was being read before the env file was loaded. I described the error to an AI assistant and it identified the root cause quickly. I still had to understand the fix and apply it in context, but the initial diagnosis was faster with assistance.

**Initial HTML email template**

The email HTML in `email.ts` was drafted with AI assistance. I described the layout I wanted (metrics box, executive summary, CTA button, footer) and got a reasonable HTML string to start from. I then adjusted the styling, colors, and content to match the rest of the product.

**What I didn't use AI for**: the audit engine rules themselves. The pricing logic (Claude's 5-seat minimum, ChatGPT's 2-seat minimum, the Cursor/Copilot overlap pattern) required reading actual vendor pricing pages and thinking about where the real inefficiencies live. That part needed original judgment, not generation.

---

## 5. Self-Ratings

### Security & Privacy: 8/10

The public report anonymization is solid — company names, domains, and department names are scrubbed before any public exposure. The honeypot + rate limiter combination handles basic abuse well. 

What I'd improve: the rate limiter is in-memory and won't work if the server scales horizontally. And the RLS policies on Supabase are permissive (any authenticated user can read any audit by public_id, which is intentional for sharing, but a stricter design would check ownership for the private dashboard view). I'd give it 8 rather than 9 because those are real gaps, not theoretical ones.

### Code Quality & Test Coverage: 8/10

The audit engine is clean, well-typed, and has zero TypeScript compiler warnings. The 5 unit tests cover all the major rules and have precise numerical assertions. 

The gap is coverage breadth — the API routes, anonymization logic, and email module aren't tested. If I were shipping this to production with real users, I'd want 70%+ line coverage across the whole codebase, not just the engine. Also the `App.tsx` file is doing a lot of routing and state management that could be cleaner with React Router or a proper state manager.

### Documentation: 9/10

The documentation covers the architecture, pricing sources, testing, reflections, and the full development log. The Mermaid diagrams in `ARCHITECTURE.md` accurately represent the system. The self-rating isn't 10 because a few sections in the README have placeholder screenshots that I didn't get to fill in before submission.
