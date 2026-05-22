import { supabase, isSupabaseConfigured } from '../lib/supabase';

// In-memory fallback database for captured leads
const mockLeadsDb: any[] = [];

export interface LeadRecord {
  id?: string;
  created_at?: string;
  email: string;
  company_name?: string;
  role?: string;
  team_size?: number;
  audit_id?: string;
}

/**
 * Saves a captured lead to the database.
 */
export async function saveLead(record: LeadRecord): Promise<LeadRecord> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([
          {
            email: record.email,
            company_name: record.company_name,
            role: record.role,
            team_size: record.team_size,
            audit_id: record.audit_id,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data;
    } catch (err) {
      console.error('[Supabase Save Lead Error] Falling back to mock database:', err);
    }
  }

  // Fallback to in-memory store
  const mockRecord = {
    id: `mock-lead-uuid-${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
    ...record,
  };
  mockLeadsDb.push(mockRecord);
  return mockRecord;
}
