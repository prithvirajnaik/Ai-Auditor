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