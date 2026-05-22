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

**Hours worked:** 2

**What I did:**  
Focused on converting the prototype into a functional SaaS MVP. Implemented the dynamic spend input workflow with tool cards, pricing selection, department allocation, and localStorage persistence. Expanded the deterministic audit engine with additional recommendation rules for duplicate subscriptions, idle seats, API overspending, and plan downgrade detection.

Integrated Supabase for storing audit reports and lead submissions. Added shareable public reports with anonymized data handling, integrated Gemini-powered executive summaries with fallback handling, and added transactional email support using Resend.

Also improved dashboard calculations, recommendation flows, analytics views, and public report rendering while keeping the architecture modular and maintainable.

- Implemented dynamic AI tool audit workflow  
- Added Supabase database integration  
- Added public shareable reports  
- Integrated AI-generated summaries  
- Added lead capture and email flow  
- Improved audit engine heuristics  
- Added abuse protection and persistence handling  

**What I learned:**  
Learned more about structuring frontend and backend logic together in a SaaS-style application while keeping the architecture modular. Improved my understanding of deterministic recommendation systems, database-driven report flows, and integrating third-party services like Supabase, Gemini, and Resend into a production-style workflow.

- Improved understanding of service-layer architecture  
- Better understanding of audit calculation flows  
- Learned how public report systems can securely expose anonymized data  

**Blockers / what I'm stuck on:**  
Need to improve testing coverage and start validating pricing data against official vendor pricing pages. Also need to ensure the deployment flow and public report rendering work reliably across environments.

**Plan for tomorrow:**  
Start writing automated tests for the audit engine, setup GitHub Actions CI workflow, deploy the application, and begin filling out required documentation files like PRICING_DATA.md, TESTS.md, and ARCHITECTURE.md.