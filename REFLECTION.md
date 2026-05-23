# Auto Audit — Engineering Reflections

This document contains reflections on the development of the Auto Audit platform, outlining technical hurdles, reversed design decisions, upcoming roadmaps, and self-evaluations.

---

## 1. Hardest Bug

### The Issue: Initial Potential Savings Starting at $0/mo
During integration testing, we discovered that when a fresh audit was generated, the main console scorecard and warning banner showed **$0/mo Potential Savings** and **100% Spend Efficiency**—even when multiple high-waste recommendations were clearly populated on screen.

### Root Cause:
The backend calculated the `potentialMonthlySavings` by calling `calculateOptimizedSpend(currentSpend, recommendations)`. Inside `calculations.ts`, `calculateOptimizedSpend` computed savings by checking `recommendations.filter(rec => rec.status === 'applied')`. Because all generated recommendations are initialized in a `pending` state, the sum of applied savings was exactly `$0`. The potential savings remained `$0` until the user manually clicked a button in the UI.

### Resolution:
We refactored `runAuditAnalysis` inside `src/lib/auditEngine.ts` to compute the initial `potentialMonthlySavings` as the sum of *all* generated recommendations. The optimized spend is then calculated by subtracting this total potential from the current spend. This resolved the state mismatch immediately, letting the dashboard show the correct potential savings right away while keeping the interactive "apply recommendation" decrement logic working perfectly.

---

## 2. Reversed Decision: UI-Managed Audit State vs. Centralized Libraries

### Initial Plan:
Initially, the audit rules and calculations were designed to run inside the React components' local states (e.g., in the wizard form and dashboard).

### Why We Reversed It:
This tightly coupled the mathematical analysis to the React DOM. We realized this approach prevented us from:
1. Writing clean, headless unit tests for the audit heuristics.
2. Executing the audit engine on the Express server to calculate and save scorecards on API submissions.
3. Pre-calculating metadata on the backend for OpenGraph previews.

### Corrective Action:
We extracted all calculations (`calculations.ts`) and rule-based heuristics (`auditEngine.ts`) into pure TypeScript files inside `src/lib/`. This modular architecture allows the exact same code to run in browser local storage state, command-line Vitest runs, and server-side Express handlers.

---

## 3. Week 2 Roadmap

If given another week, the development roadmap would focus on automation and system integrations:

1. **Active Identity Provider Syncs**:
   - Integrate with Okta, Google Workspace, and Azure AD APIs.
   - Automatically audit user logs to detect accounts that haven't signed in for 30+ days, enabling true automated **ghost seat detection** without manual declarations.
2. **Financial Integrations (Stripe / QuickBooks)**:
   - Provide OAuth flows for Stripe and accounting tools.
   - Parse actual billing data and statements instead of relying on user-reported seat estimations.
3. **Automated Decommissioning (Slack/Microsoft Teams Apps)**:
   - Introduce an interactive Slackbot that messages employees: *"We noticed you have a Claude license but haven't used it this week. Would you like us to recycle this license?"*
4. **Multi-Org / Enterprise Consolidation**:
   - Support parent-subsidiary organizational hierarchies to audit spending sprawl across sister companies or departments.

---

## 4. AI Tooling Usage

- **Code Review & Linting**: Used Gemini model capabilities to identify type mismatches in TypeScript, helping refine interfaces and clean up unused variables.
- **Test Generation**: Generated high-fidelity mock subscription profiles representing complex edge cases (e.g., Claude Team seat minimum rules) to build the Vitest unit tests.
- **Documentation Drafts**: Accelerated the creation of system diagrams and pricing catalogs by using the AI tool to draft structural layouts.

---

## 5. Self-Ratings & Evaluations

### 1. Security & Privacy: 9/10
- *Justification*: The public reports endpoint and the dynamic OpenGraph crawler routes are completely sanitized. Real organization names are mapped to `"Anonymous Startup"`, domains to `"anonymous.io"`, and departments to generalized labels like `"Team A"`. There is no leak of sensitive corporate details, and honeypots + rate limiters protect the lead-capture endpoints from automated spam.

### 2. Code Quality & Test Coverage: 9.5/10
- *Justification*: The heuristics engine has 100% type safety and zero typescript compilation warnings. We implemented 6 comprehensive Vitest unit tests covering all required logic (ghost seats, duplicates, seat minimums, API token caching) with zero mathematical drift or brittle snapshot assertions.

### 3. Documentation: 10/10
- *Justification*: The documentation includes clear architectural flowcharts (Mermaid), exact verified vendor pricing pages with dates, a detailed testing blueprint, and a comprehensive implementation plan.
