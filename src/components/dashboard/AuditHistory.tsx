import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Sparkles, Calendar, TrendingDown, LayoutGrid, Share2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { AuditReport } from '../../types';

interface AuditHistoryProps {
  onLoadReport: (report: AuditReport) => void;
  onNavigateBack: () => void;
}

export default function AuditHistory({ onLoadReport, onNavigateBack }: AuditHistoryProps) {
  const { user } = useAuth();
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserAudits() {
      if (!user) {
        setLoading(false);
        return;
      }

      if (!isSupabaseConfigured) {
        // Mock fallback audits for sandbox testing
        const mockAudits = [
          {
            id: 'mock-audit-1',
            public_id: 'mock-sprawl-share',
            created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            company_name: 'Mock Seed Startup',
            domain_name: 'mockseed.io',
            team_size: 18,
            monthly_savings: 180.00,
            annual_savings: 2160.00,
            use_case: 'Product Development',
            audit_results: {
              optimizedSpendMonthly: 410,
              recommendations: [
                { id: 'rec-1', title: 'Ghost Seats', type: 'ghost_seats', estimatedMonthlySavings: 60 },
                { id: 'rec-2', title: 'Editor Redundancy', type: 'remove_redundant', estimatedMonthlySavings: 120 }
              ],
              teamMetrics: []
            },
            subscriptions: [
              { toolName: 'Cursor', planName: 'Pro', seats: 10, totalCost: 200 },
              { toolName: 'Claude', planName: 'Team', seats: 5, totalCost: 150 }
            ]
          }
        ];
        setAudits(mockAudits);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('audits')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAudits(data || []);
      } catch (err: any) {
        console.error('[AuditHistory Fetch Error]:', err);
        setErrorMsg(err.message || 'Failed to fetch saved audit history.');
      } finally {
        setLoading(false);
      }
    }

    fetchUserAudits();
  }, [user]);

  const handleSelectAudit = (audit: any) => {
    // Reconstruct the AuditReport structure expected by Dashboard console
    const reconstructedReport: AuditReport = {
      id: audit.id,
      publicId: audit.public_id,
      companyName: audit.company_name,
      domainName: audit.domain_name,
      teamSize: audit.team_size,
      primaryUseCase: audit.use_case,
      auditDate: new Date(audit.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }),
      currentSpendMonthly: Number(audit.monthly_savings) + Number(audit.audit_results?.optimizedSpendMonthly || 0),
      optimizedSpendMonthly: Number(audit.audit_results?.optimizedSpendMonthly || 0),
      potentialMonthlySavings: Number(audit.monthly_savings),
      potentialAnnualSavings: Number(audit.annual_savings),
      duplicateToolsCount: audit.audit_results?.recommendations?.filter((r: any) => r.type === 'remove_redundant' || r.type === 'consolidate').length || 0,
      inactiveSeatsCount: audit.audit_results?.recommendations?.filter((r: any) => r.type === 'ghost_seats').length * 2 || 0, // simple heuristic
      subscriptionsAnalyzed: audit.subscriptions || [],
      recommendations: audit.audit_results?.recommendations || [],
      teamMetrics: audit.audit_results?.teamMetrics || [],
      aiSummary: audit.audit_results?.aiSummary || 'AI Overspend Analysis report saved in workspace history.'
    };
    onLoadReport(reconstructedReport);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-[#e5e2e1] flex flex-col items-center justify-center space-y-6">
        <div className="relative inline-flex items-center justify-center p-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 rounded-full animate-spin">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-cyan-300" />
          </div>
        </div>
        <p className="font-mono text-xs text-purple-400 uppercase tracking-widest animate-pulse">
          Loading Saved History...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#000000] text-[#e5e2e1] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div className="space-y-1">
          <button
            onClick={onNavigateBack}
            className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 font-mono uppercase tracking-widest cursor-pointer focus:outline-none mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Workspace
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">Saved Audit Reports</h1>
          <p className="text-xs text-gray-500 font-mono uppercase">Workspace History Logs ({audits.length})</p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-rose-950/20 border border-rose-500/20 text-rose-400 p-4 rounded-2xl text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {audits.length === 0 ? (
        <div className="text-center py-20 bg-[#090909] border border-white/5 rounded-3xl space-y-4">
          <p className="text-xs text-gray-500 italic">No saved audits found for your profile.</p>
          <button
            onClick={onNavigateBack}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl text-xs font-bold transition-all hover:scale-[1.01] cursor-pointer"
          >
            Run Your First Audit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {audits.map((audit) => (
            <div
              key={audit.id}
              className="bg-[#090909] border border-white/5 hover:border-white/10 p-5 rounded-2xl space-y-4 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-bold text-white text-base">{audit.company_name}</h3>
                    <p className="text-xs text-purple-300 font-mono">{audit.domain_name}</p>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(audit.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-black border border-white/5 p-3 rounded-xl font-mono text-xs">
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase tracking-wider">MONTHLY SAVINGS</p>
                    <p className="text-sm font-bold text-rose-400">${Number(audit.monthly_savings).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase tracking-wider">ANNUAL SAVINGS</p>
                    <p className="text-sm font-bold text-green-400">${Number(audit.annual_savings).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <button
                  onClick={() => handleSelectAudit(audit)}
                  className="flex-1 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-purple-400" />
                  View Scorecard
                </button>
                <button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/report/${audit.public_id}`;
                    navigator.clipboard.writeText(shareUrl);
                    alert('Share link copied to clipboard!');
                  }}
                  className="px-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-gray-400 hover:text-white py-2 rounded-xl text-xs flex items-center justify-center transition-colors cursor-pointer"
                  title="Copy Shareable Link"
                >
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
