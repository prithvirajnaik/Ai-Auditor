# Auto Audit — Development Log

## Day 1 — 2026-05-22

**Hours worked:** 3

**What I did:**  
Spent most of the day planning the project structure, understanding the assignment requirements, and designing the product flow.

Researched AI tool pricing models and planned the audit engine logic for detecting duplicate subscriptions, idle seats, and unnecessary plans. 

Also worked on the initial frontend design direction and folder structure. Created a basic prototype using AI to serve as base.

**What I learned:**  
- Learned how pricing-based audit systems work  
- Learned how deterministic recommendation engines are designed

**Blockers / what I'm stuck on:**  
Still refining the audit recommendation logic and deciding how detailed the pricing comparison system should be.

**Plan for tomorrow:**  
Start building the frontend MVP including the landing page, spend input form, and dynamic audit recommendation flow.

---

## Day 2 — 2026-05-23

**Hours worked:** 5

**What I did:**  
Focused on converting the prototype into a functional SaaS MVP. Implemented the dynamic spend input workflow with tool cards, pricing selection, department allocation, and localStorage persistence. Expanded the deterministic audit engine with additional recommendation rules for duplicate subscriptions, idle seats, API overspending, and plan downgrade detection.

Integrated Supabase for storing audit reports and lead submissions. Added shareable public reports with anonymized data handling, integrated Gemini-powered executive summaries with fallback handling, and added transactional email support using Resend.

Also improved dashboard calculations, recommendation flows, analytics views, and public report rendering while keeping the architecture modular and maintainable.

Later in the day, designed and implemented a production-ready SaaS authentication layer using Supabase Auth. Created custom profiles schema and linked audit ownership directly to authenticated users. Added route-guards, dynamic path-based routing, and a workspace saved audit history console for returning users. Also debugged and resolved a silent server-side DB connection failure caused by ES module import hoisting.

Key things built today:
- Implemented dynamic AI tool audit workflow  
- Added Supabase database integration  
- Added public shareable reports  
- Integrated AI-generated summaries  
- Added lead capture and email flow  
- Improved audit engine heuristics  
- Added abuse protection and persistence handling  
- Fixed ES Module import hoisting env loading bug in `server.ts`
- Implemented Supabase Auth (Signup, Login, Logout, Session Persistence)
- Added `profiles` database table schema and RLS policies
- Enabled Audit Ownership (`user_id` mapping) and user history logging
- Implemented client-side pathname routing and login redirect logic in `App.tsx`
- Handled Supabase Auth email rate limits gracefully with user notifications

**What I learned:**  
Learned more about structuring frontend and backend logic together in a SaaS-style application while keeping the architecture modular. Improved my understanding of deterministic recommendation systems, database-driven report flows, and integrating third-party services like Supabase, Gemini, and Resend into a production-style workflow.

- Improved understanding of service-layer architecture  
- Better understanding of audit calculation flows  
- Learned how public report systems can securely expose anonymized data  
- Resolved ES Module dependency hoisting issues
- Gained experience with Supabase Auth schema relationships and RLS policies

**Blockers / what I'm stuck on:**  
The biggest time sink today was the ES module hoisting bug. When `server.ts` imports from `src/lib/auditEngine.ts`, the module graph is resolved before `dotenv/config` runs, so `process.env.GEMINI_API_KEY` was always `undefined` even with a valid `.env` file. The fix was moving `import 'dotenv/config'` to the very first line of `server.ts` before any other imports. Obvious in hindsight, painful to find.

Also: Supabase Auth email confirmation has rate limits that are pretty aggressive in development — I kept hitting "Email rate limit exceeded" while testing signup flows. Added error handling for that specific case.

**Plan for tomorrow:**  
- Set up GitHub Actions CI workflow for linting, type-checking, and running test suites.
- Deploy the application to a staging/production hosting provider.
- Write integration tests for the new Supabase Auth contexts, session hook transitions, and route guards.
- Finalize documentation files: PRICING_DATA.md, TESTS.md, and ARCHITECTURE.md.
- Finalize MVP features

---

## Day 3 — 2026-05-24

**Hours worked:** 4

**What I did:**  
Today was mostly fixing things that looked correct but weren't.

**Database serialization issue:** When loading a saved audit for a returning user, the dashboard was showing $0 in savings because the fields `aiSummary`, `duplicateToolsCount`, and `inactiveSeatsCount` weren't being stored in the `audit_results` JSONB column — they were calculated server-side but only attached to the response, not persisted. Fixed by explicitly including them in the `saveAudit()` payload.

**Returning user history flow:** After logging in, the app was always routing to the audit form even for users who had existing audits. The issue was in `handleLoginCompleted()` in `App.tsx` — the Supabase query to check for existing audits was running but the `data.length > 0` check was comparing against data that hadn't been awaited correctly. Fixed the async flow and added explicit error handling.

**Supabase Auth trigger:** Discovered that when email confirmation is enabled in Supabase, the `auth.users` row is created immediately but the `on_auth_user_created` trigger fires only after confirmation. This meant new users who confirmed their email had no profile row when they first logged in, causing dashboard crashes. Resolved by adding a UPSERT in the signup flow and updating the PostgreSQL trigger to fire on `INSERT` regardless of confirmation status.

**Vercel deployment configuration:**
- Created `api/index.ts` as a serverless wrapper that exports the Express app
- Added `vercel.json` with route rewrites: API routes → `/api/index`, everything else → SPA
- Built and tested the production bundle locally (`npm run build && npm run preview`)
- CI pipeline confirmed passing: lint (0 errors) and test suite (5/5 passing)

**What I learned:**  
Vercel's serverless functions have a cold start penalty. For the audit endpoint which runs the engine + Gemini API call, the first request after a cold start can take 3–4 seconds. Not great UX but acceptable for an MVP. The fix is to use Vercel's fluid compute or a dedicated server if this ever gets real traffic.

Also learned that Postgres trigger timing matters more than I expected. The gap between `INSERT INTO auth.users` and trigger execution in Supabase is normally milliseconds, but under load or with email confirmation flows, the window can be longer. The trigger-based profile provisioning is still the right pattern — just needs graceful handling on the client side if the profile isn't ready yet.

**Blockers / what I'm stuck on:**  
Trying to figure out a better way of handling the savings calculation state. Currently `potentialMonthlySavings` is computed once at audit creation and stored. If a user applies/dismisses recommendations in the UI, the live savings figure changes but the stored value doesn't update. For a proper implementation, the recommendation status updates should persist to the database and the savings recalculate from applied recommendations. That's a non-trivial backend change for V1 so it's scoped out.

**Plan for tomorrow:**  
- End to end testing and cleanup
- Add more deterministic metrics and tool categories
- Improve the UX and UI

---

## Day 4–5 — 2026-05-25 to 2026-05-26

**Hours worked:** ~2 (interrupted by exam schedule)

**What I did:**  
Got occupied with my minor project review and semester exams, so development was limited. Used the available time to:

- Write documentation: `README.md`, `ARCHITECTURE.md`, `TESTS.md`, `REFLECTION.md`, `PRICING_DATA.md`
- Review and clean up existing documentation files
- Run the final test suite and lint check to confirm zero failures before submission
- Manually test the full user flow: landing → audit form → results dashboard → shareable report → email capture

The test suite passed clean. TypeScript compilation had zero errors. The full user journey worked end-to-end in both dev mode and production build.

**Notes on what I'd have done with more time:**

The analytics dashboard shows spend breakdowns by department but the visualizations are minimal — just simple bar charts. With another day I'd have added trend lines, comparison views (before/after recommendations), and a cleaner data visualization library than the current custom CSS approach.

The UI in a few places feels slightly rushed — the audit form's multi-step wizard could use better progress indicators and the mobile layout has a few rough edges on smaller screens. These are polish items, not bugs.

The lead capture flow works but the email template is basic. A properly designed HTML email (with actual logos, a CTA button that looks good on mobile, etc.) would improve the conversion rate on that step.

**Honest reflection:**  
This project ended up being more ambitious than I initially scoped. Getting the deterministic engine, Supabase auth, public reports, email, and OpenGraph injection all working together in 3 active development days was a stretch. Some pieces (the analytics tab, the settings page) are functional but not fully polished. If this were a real product submission, I'd want 2 more days to clean up the UX and add more comprehensive testing.

That said, the core mechanics work: you can enter subscriptions, get a savings estimate, see recommendations, and share the report URL. That's the product. Everything else is iteration.