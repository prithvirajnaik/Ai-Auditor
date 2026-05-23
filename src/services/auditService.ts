import { supabase, isSupabaseConfigured } from '../lib/supabase';

// In-memory fallback database for development/offline mode
const mockAuditsDb = new Map<string, any>();

export interface AuditRecord {
  id?: string;
  public_id: string;
  created_at?: string;
  company_name: string;
  domain_name: string;
  team_size: number;
  use_case: string;
  subscriptions: any;
  audit_results: any;
  monthly_savings: number;
  annual_savings: number;
  user_id?: string | null;
}

/**
 * Saves a calculated SaaS audit to the database.
 */
export async function saveAudit(record: AuditRecord): Promise<AuditRecord> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('audits')
        .insert([
          {
            public_id: record.public_id,
            company_name: record.company_name,
            domain_name: record.domain_name,
            team_size: record.team_size,
            use_case: record.use_case,
            subscriptions: record.subscriptions,
            audit_results: record.audit_results,
            monthly_savings: record.monthly_savings,
            annual_savings: record.annual_savings,
            user_id: record.user_id || null,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data;
    } catch (err) {
      console.error('[Supabase Save Audit Error] Falling back to mock database:', err);
    }
  }

  // Fallback to in-memory store
  const mockRecord = {
    id: `mock-uuid-${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
    ...record,
  };
  mockAuditsDb.set(mockRecord.public_id, mockRecord);
  return mockRecord;
}

/**
 * Fetches an audit record by its unique public shareable ID.
 */
export async function getAuditByPublicId(publicId: string): Promise<AuditRecord | null> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .eq('public_id', publicId)
        .maybeSingle();

      if (error) {
        throw error;
      }
      return data;
    } catch (err) {
      console.error('[Supabase Fetch Audit Error] Falling back to mock database lookup:', err);
    }
  }

  // Fallback lookup
  return mockAuditsDb.get(publicId) || null;
}
