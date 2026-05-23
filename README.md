# Auto Audit — AI Spend Optimization Platform

Auto Audit is a high-performance SaaS MVP designed to detect and eliminate software overspending. By scanning organization profiles and subscription configurations, the platform identifies duplicate developer tools, inactive/ghost seat allocations, plan downgrade opportunities, and API developer overspending.

---

## 🚀 Deployed URL
- **Production Build:** [https://auto-audit-mvp.render.com](https://auto-audit-mvp.render.com) *(Placeholder)*

---

## 🖼️ Application Screenshots

### 1. The Audit Wizard Configuration Form
*Allows declaring organization details and adding specific SaaS subscription profiles with reactive base price cataloging.*
![SaaS Input Wizard Mockup](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80)

### 2. The Spend Dashboard Scorecard
*Displays real-time KPI metrics, active declare stacks, efficiency metrics, and recommendation checklists.*
![Dashboard Mockup](https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80)

---

## 🛠️ Tech Stack & Architecture
- **Frontend SPA**: React (v19) + TailwindCSS
- **Backend API Server**: Express + Node.js + TypeScript
- **Database Layer**: Supabase (Postgres) with in-memory caching fallbacks
- **AI Analytics**: Google Gemini AI API (`gemini-2.5-flash`)
- **Transactional Mail**: Resend API
- **Testing Engine**: Vitest (v2)

---

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js (v20 or higher)
- npm (v10 or higher)

### 1. Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/auto-audit.git
cd auto-audit
npm install
```

### 2. Configure Environment Variables:
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Fill in the credentials:
```ini
PORT=3000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
RESEND_API_KEY=your_resend_api_key
```
*Note: If no API keys are provided, the platform automatically triggers graceful, in-memory, local mocks so developers can evaluate the app immediately.*

### 3. Run Development Server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Linter & Tests:
```bash
npm run lint    # Run TypeScript compiler checks
npm run test    # Run Vitest unit tests
```

---

## 🛢️ Database & 📧 Email Gateway Setup

To run the application in a fully operational mode without mock fallbacks:

### 1. Supabase Schema & Row-Level Security (RLS) Setup
Because Supabase enables Row-Level Security (RLS) by default, you must run the migration SQL scripts to create tables and configure public access policies:
1. Go to your **Supabase Dashboard** and open your project.
2. Click on the **SQL Editor** tab in the left sidebar.
3. Click **"New query"** and copy-paste the entire contents of [supabase_schema.sql](file:///c:/Users/prith/OneDrive/Desktop/auto-audit/supabase_schema.sql).
4. Click **"Run"** to execute the query. This will:
   - Create the `audits` and `leads` tables.
   - Set up the necessary query indexes.
   - Configure public RLS policies allowing the anonymous backend client to save new audits, select audit results by shareable public ID, and capture onboarding leads.

### 2. Resend Custom Domain Configuration
By default, Resend accounts start in Sandbox mode with the sender `onboarding@resend.dev`, which restricts email dispatches strictly to your registered account email address.
To dispatch emails to any domain:
1. Go to your **Resend Dashboard** -> **Domains**.
2. Click **"Add Domain"**, enter your corporate domain, and select your hosting region.
3. Configure the provided MX, TXT, and CNAME records in your DNS provider (e.g. Cloudflare, Namecheap, Route 53) to verify domain ownership.
4. Once verified, update the `from` sender constant in [email.ts](file:///c:/Users/prith/OneDrive/Desktop/auto-audit/src/lib/email.ts) (line 20) from `Auto Audit <onboarding@resend.dev>` to your verified domain (e.g. `Auto Audit <reports@yourdomain.com>`).

---

## 🌐 Deployment Instructions

### Express & React Combined Deployment (Render / Heroku)
The Express backend is configured to serve static assets from the React compiler automatically in production environments.

1. **Build the production bundle**:
   ```bash
   npm run build
   ```
2. **Configure Environment Variables**:
   Set `NODE_ENV=production` along with your API keys.
3. **Start the Production Express Server**:
   ```bash
   npm run start
   ```
   *(Or configured via package.json to trigger node server start)*

---

## ⚖️ Engineering & Product Tradeoffs

### 1. Deterministic Heuristics Engine vs. Raw LLM Analysis
- **Decision**: All savings math, editor redundancies, and seat thresholds are calculated using a deterministic rules engine in TypeScript (`auditEngine.ts`), while Gemini is reserved solely for compiling natural-language executive summaries.
- **Tradeoff**: Restricts the "intelligence" of the scan to pre-defined rules, but guarantees 100% mathematical accuracy, zero AI hallucination of billing details, and easy, unit-testable assertions.

### 2. In-Memory Database Fallbacks vs. Setup Blockers
- **Decision**: Developed service wrappers (`supabase.ts`, `email.ts`) that fall back to in-memory stores and mock logs if database keys are missing.
- **Tradeoff**: Reduces setup friction for evaluation, but means data doesn't persist across local restarts unless database configurations are formally bound.

### 3. Server-Side OpenGraph Tag Injection vs. Full React SSR
- **Decision**: Intercepted `/report/:publicId` requests on the server to read `index.html` and inject OpenGraph tags dynamically before serving the static bundle.
- **Tradeoff**: Bypasses the overhead of running a heavyweight Next.js or Remix framework, but relies on string replacement inside the index template.

### 4. LocalStorage State Recovery vs. User Authentication
- **Decision**: The MVP uses client-side localStorage synchronization to persist configuration state and results.
- **Tradeoff**: Minimizes landing conversion drop-off since users can audit immediately without authentication, but limits team collaboration until full organization RBAC is implemented.

### 5. Asynchronous Transactional Emails vs. Immediate Feedback
- **Decision**: The client immediately gets a "success" confirmation on submission, and the server processes Resend transactions in the background.
- **Tradeoff**: Fast UI response time, but on real-world configurations, any network failure on Resend is logged on the server rather than bubbling up as an error to the user interface.
