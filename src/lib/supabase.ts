import { createClient } from '@supabase/supabase-js';

// Dynamically extract Supabase URL and Anon key based on Node vs Vite environments
const supabaseUrl = 
  (typeof process !== 'undefined' && process.env?.SUPABASE_URL) || 
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) || 
  '';

const supabaseAnonKey = 
  (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) || 
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) || 
  '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase Warning] Supabase environment variables are missing. Using in-memory and localStorage fallback databases.'
  );
}
