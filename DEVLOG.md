## Day 1 — 2026-05-22

**Hours worked:** 3

**What I did:**  
- Spent most of the day planning the project structure, understanding the assignment requirements, and designing the product flow .

- Researched AI tool pricing models and planned the audit engine logic for detecting duplicate subscriptions, idle seats, and unnecessary plans. 

- Also worked on the initial frontend design direction and folder structure. Created a basic prototype using AI to serve as base

**What I learned:**  
- Learned how pricing-based audit systems work  
- Learned how deterministic recommendation engines are designed 

**Blockers / what I'm stuck on:**  
Still refining the audit recommendation logic and deciding how detailed the pricing comparison system should be.

**Plan for tomorrow:**  
Start building the frontend MVP including the landing page, spend input form, and dynamic audit recommendation flow.

## Day 2 — 2026-05-23

**Hours worked:** 5

**What I did:**  
Focused on converting the prototype into a functional SaaS MVP. Implemented the dynamic spend input workflow with tool cards, pricing selection, department allocation, and localStorage persistence. Expanded the deterministic audit engine with additional recommendation rules for duplicate subscriptions, idle seats, API overspending, and plan downgrade detection.

Integrated Supabase for storing audit reports and lead submissions. Added shareable public reports with anonymized data handling, integrated Gemini-powered executive summaries with fallback handling, and added transactional email support using Resend.

Also improved dashboard calculations, recommendation flows, analytics views, and public report rendering while keeping the architecture modular and maintainable.

Later in the day, designed and implemented a production-ready SaaS authentication layer using Supabase Auth. Created custom profiles schema and linked audit ownership directly to authenticated users. Added route-guards, dynamic path-based routing, and a workspace saved audit history console for returning users. Also debugged and resolved a silent server-side DB connection failure caused by ES module import hoisting.

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
Need to improve testing coverage and start validating pricing data against official vendor pricing pages. Also need to ensure the deployment flow and public report rendering work reliably across environments.

**Plan for tomorrow:**  
- Set up GitHub Actions CI workflow for linting, type-checking, and running test suites.
- Deploy the application to a staging/production hosting provider.
- Write integration tests for the new Supabase Auth contexts, session hook transitions, and route guards.
- Finalize documentation files: PRICING_DATA.md, TESTS.md, and ARCHITECTURE.md.
- Finalize MVP features

## Day 3 — 2026-05-24

**Hours worked:** 4

**What I did:**  
- Solved database report serialization issues by saving `aiSummary`, `duplicateToolsCount`, and `inactiveSeatsCount` in the `audit_results` JSONB column upon creation.
- Fixed the public report dashboard data rendering and user history scorecard view by reconstructing metric states directly from database results instead of failing client-side heuristics.
- Resolved a critical Supabase auth registration hazard. Established a PostgreSQL database trigger to automate profile provisioning upon user sign-up, ensuring registration succeeds even when email confirmation is enabled.
- Configured the application for zero-cost hosting on Vercel: mapped routing and static SPA builds in `vercel.json`, created serverless wrapper `api/index.ts`, and updated `server.ts` to export the Express app for module loaders.
- Ran local Vite production build and Vitest suite successfully to confirm zero type compiler or test failures.

**What I learned:**  
- Learned to structure monorepo-style Express + Vite applications for Vercel Serverless environments.
- Gained understanding of secure database-driven user profile provisioning using Postgres triggers to circumvent client-side RLS limitations.

**Blockers / what I'm stuck on:**  
Trying to figure out a better way of handling calculations.


**Plan for tomorrow:**  
- End to End testing and cleanup
- Add more deterministic metrics and tool categories
- improve the UX and UI