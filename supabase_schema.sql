-- Auto Audit Supabase Database Schema

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Audits table: Stores audit data, deterministic metrics, and AI summary
CREATE TABLE IF NOT EXISTS audits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  public_id VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  company_name VARCHAR(255) NOT NULL,
  domain_name VARCHAR(255) NOT NULL,
  team_size INT NOT NULL,
  use_case VARCHAR(255) NOT NULL,
  subscriptions JSONB NOT NULL,
  audit_results JSONB NOT NULL,
  monthly_savings NUMERIC(10, 2) NOT NULL,
  annual_savings NUMERIC(10, 2) NOT NULL
);

-- Leads table: Stores captured emails, roles, and links them back to their audit
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  email VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  role VARCHAR(255),
  team_size INT,
  audit_id UUID REFERENCES audits(id) ON DELETE SET NULL
);

-- Indexing for speed optimization on public lookups
CREATE INDEX IF NOT EXISTS idx_audits_public_id ON audits(public_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable Row Level Security
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they already exist
DROP POLICY IF EXISTS "Allow public insert to audits" ON audits;
DROP POLICY IF EXISTS "Allow public select from audits" ON audits;
DROP POLICY IF EXISTS "Allow public insert to leads" ON leads;
DROP POLICY IF EXISTS "Allow public select from leads" ON leads;

-- Audits Table RLS Policies
-- Allow anyone (including anonymous clients) to run audits and save them
CREATE POLICY "Allow public insert to audits" ON audits
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to fetch audits by their public_id (for shared reports)
CREATE POLICY "Allow public select from audits" ON audits
  FOR SELECT TO anon, authenticated
  USING (true);

-- Leads Table RLS Policies
-- Allow anyone to submit leads
CREATE POLICY "Allow public insert to leads" ON leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Allow public selection of leads for the onboarding flow
CREATE POLICY "Allow public select from leads" ON leads
  FOR SELECT TO anon, authenticated
  USING (true);

-- ==========================================
-- PROFILES TABLE AND AUDIT OWNERSHIP
-- ==========================================

-- Profiles table: Stores custom company metadata linked to Supabase Auth
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for profiles if they already exist
DROP POLICY IF EXISTS "Allow user to insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow user to select their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow user to update their own profile" ON profiles;

-- Profiles Table RLS Policies
CREATE POLICY "Allow user to insert their own profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow user to select their own profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Allow user to update their own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Link audits to authenticated users (allow public free runs, or saved history tracking)
ALTER TABLE audits ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

