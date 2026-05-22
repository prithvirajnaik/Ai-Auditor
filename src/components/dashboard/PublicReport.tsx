import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingDown,
  Layers,
  Users,
  Brain,
  AlertTriangle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { AuditReport } from '../../types';

interface PublicReportProps {
  publicId: string;
  onNavigateHome: () => void;
}

export default function PublicReport({ publicId, onNavigateHome }: PublicReportProps) {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        setLoading(true);
        const response = await fetch(`/api/public-reports/${publicId}`);
        if (!response.ok) {
          throw new Error('Failed to retrieve the requested public audit report.');
        }
        const data = await response.json();
        if (data.success && data.report) {
          setReport(data.report);
        } else {
          throw new Error('Invalid public report structure.');
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load report.');
      } finally {
        setLoading(false);
      }
    }

    if (publicId) {
      fetchReport();
    }
  }, [publicId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-[#e5e2e1] flex flex-col items-center justify-center space-y-6">
        <div className="relative inline-flex items-center justify-center p-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 rounded-full animate-spin">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-cyan-300" />
          </div>
        </div>
        <p className="font-mono text-xs text-purple-400 uppercase tracking-widest animate-pulse">
          Fetching Anonymous Audit data...
        </p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-black text-[#e5e2e1] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-xl font-bold text-white tracking-tight">Report Retrieval Failed</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            {error || 'This report may have been deleted, or the shareable link is invalid.'}
          </p>
        </div>
        <button
          onClick={onNavigateHome}
          className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.01]"
        >
          Create New Audit
        </button>
      </div>
    );
  }

  const healthPercent = Math.max(
    0,
    Math.round(((report.currentSpendMonthly - report.potentialMonthlySavings) / (report.currentSpendMonthly || 1)) * 100)
  );

  return (
    <div className="bg-black text-[#e5e2e1] min-h-screen flex flex-col font-sans selection:bg-purple-500/30 pb-20">
      
      {/* Promotional Top Callout Bar */}
      <div className="bg-gradient-to-r from-purple-950/40 via-black to-blue-950/40 border-b border-white/5 py-3 px-6 text-xs text-center text-gray-300 flex flex-col sm:flex-row items-center justify-center gap-2">
        <span className="flex items-center gap-1.5 font-semibold text-purple-300">
          <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
          This is a public, anonymized SaaS spend report.
        </span>
        <button
          onClick={onNavigateHome}
          className="text-cyan-400 hover:text-cyan-300 transition-colors font-bold uppercase tracking-wider text-[10px] flex items-center gap-1 focus:outline-none"
        >
          Audit Your Own Stack <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-8 min-w-0">
        
        {/* Public Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
          <div className="space-y-1">
            <span className="font-mono text-[9px] text-purple-400 uppercase tracking-widest font-black">
              SECURE PUBLIC REPORT
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              📊 {report.companyName} Scorecard
            </h2>
            <p className="text-xs text-gray-400">
              Verified Headcount: <span className="text-purple-300 font-mono">{report.teamSize} seats</span> | Primary Goal: <span className="text-purple-300">{report.primaryUseCase}</span>
            </p>
          </div>

          <button
            onClick={onNavigateHome}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl text-xs font-bold transition-all hover:scale-[1.01] shadow-[0_0_20px_rgba(109,40,217,0.2)] flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            Optimize Your Budget
          </button>
        </div>

        {/* 1. Metrics Scorecard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#090909]/80 border border-white/5 p-4 rounded-xl">
            <p className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">Current Spend</p>
            <p className="text-2xl font-extrabold font-mono text-white mt-2">
              ${report.currentSpendMonthly.toLocaleString()}<span className="text-xs text-gray-500">/mo</span>
            </p>
            <p className="text-[10px] text-gray-500 mt-1">Based on {report.subscriptionsAnalyzed.length} active platforms</p>
          </div>

          <div className="bg-[#090909]/80 border border-rose-500/10 p-4 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 bg-rose-500/5 rounded-full blur-xl pointer-events-none"></div>
            <p className="text-[10px] font-mono tracking-widest text-rose-400 uppercase font-black">
              Potential Savings
            </p>
            <p className="text-2xl font-extrabold font-mono text-rose-400 mt-2">
              ${report.potentialMonthlySavings.toLocaleString()}<span className="text-xs text-rose-500 font-normal">/mo</span>
            </p>
            <p className="text-[10px] text-green-400 font-mono mt-1">
              -${report.potentialAnnualSavings.toLocaleString()}/yr target
            </p>
          </div>

          <div className="bg-[#090909]/80 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
            <p className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">Duplicate Vendors</p>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <p className="text-2xl font-extrabold font-mono text-white">
                  {report.duplicateToolsCount}
                </p>
                <p className="text-[10px] text-gray-500 mt-1">Overlapping products</p>
              </div>
              <Layers className="w-5 h-5 text-purple-400 opacity-60 mb-1" />
            </div>
          </div>

          <div className="bg-[#090909]/80 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
            <p className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">Ghost Seats</p>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <p className="text-2xl font-extrabold font-mono text-white">
                  {report.inactiveSeatsCount}
                </p>
                <p className="text-[10px] text-gray-500 mt-1">Idle/surplus licenses</p>
              </div>
              <Users className="w-5 h-5 text-cyan-400 opacity-60 mb-1" />
            </div>
          </div>
        </div>

        {/* Efficiency Bar */}
        <div className="bg-[#090909]/80 border border-white/5 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-gray-400 uppercase tracking-widest">SaaS Stack Efficiency</span>
            <span className="text-cyan-300 font-bold">{healthPercent}% Efficiency Rate</span>
          </div>
          <div className="h-2 w-full bg-black border border-white/5 rounded-full overflow-hidden flex items-center p-0.5">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 rounded-full transition-all duration-700"
              style={{ width: `${healthPercent}%` }}
            ></div>
          </div>
        </div>

        {/* 2. Content Layout split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Recommendations list */}
          <div className="lg:col-span-8 bg-[#090909]/80 border border-white/5 p-5 rounded-2xl space-y-5">
            <div className="border-b border-white/5 pb-3">
              <h3 className="text-xs font-bold text-white tracking-widest uppercase font-mono">
                Optimization Recommendations
              </h3>
            </div>

            {report.recommendations.length === 0 ? (
              <p className="text-xs text-gray-500 italic py-4">No audit recommendations generated.</p>
            ) : (
              <div className="space-y-4">
                {report.recommendations.map(rec => (
                  <div
                    key={rec.id}
                    className="p-4 bg-[#0d0d0d] border border-white/5 rounded-xl space-y-3 transition-colors hover:border-white/10"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded">
                          {rec.type.replace('_', ' ')}
                        </span>
                        <h4 className="font-bold text-white text-sm mt-1">{rec.title}</h4>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xs font-mono font-bold text-rose-400">
                          -${rec.estimatedMonthlySavings}/mo
                        </p>
                        <p className="text-[9px] text-gray-500 font-mono">
                          -${rec.estimatedAnnualSavings}/yr target
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed font-sans">{rec.description}</p>

                    <div className="bg-[#121212] border border-white/[0.03] p-3 rounded-lg text-xs space-y-1.5 font-sans">
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-cyan-300 block">
                        Recommended Action:
                      </span>
                      <p className="text-gray-300 font-medium leading-relaxed">{rec.recommendedAction}</p>
                    </div>

                    <div className="text-[10px] font-mono text-gray-500">
                      <span className="text-gray-400 font-bold">REASONING:</span> {rec.reasoning}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI summaries Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* AI Generated summary block */}
            <div className="bg-gradient-to-br from-[#0c0c0c] to-black border border-cyan-500/20 p-5 rounded-2xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/5 rounded-full blur-xl pointer-events-none"></div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-cyan-400 text-black text-[9px] font-mono uppercase font-black rounded tracking-widest">
                  AI SUMMARY
                </span>
                <h3 className="text-xs font-bold text-white tracking-widest uppercase font-mono">
                  Executive Briefing
                </h3>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed font-sans font-medium">
                "{report.aiSummary}"
              </p>
            </div>

            {/* Platform statistics summary */}
            <div className="bg-[#090909]/80 border border-white/5 p-5 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-white tracking-widest uppercase font-mono">
                Anonymized Stack Distribution
              </h3>
              
              <div className="space-y-3.5">
                {report.subscriptionsAnalyzed.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No allocations declared</p>
                ) : (
                  report.subscriptionsAnalyzed.map(sub => (
                    <div key={sub.id} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-semibold ${sub.status === 'inactive' ? 'text-gray-600 line-through' : 'text-white'}`}>
                          {sub.toolName}
                        </span>
                        <span className="text-[10px] text-purple-300 font-mono">
                          {sub.status === 'inactive' ? 'Decommissioned' : `${sub.planName} (${sub.seats} seats)`}
                        </span>
                      </div>
                      <span className="font-mono text-gray-400 font-bold">
                        {sub.status === 'inactive' ? '$0' : `$${sub.totalCost}`}/mo
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Marketing CTA Box */}
            <div className="bg-gradient-to-br from-purple-950/20 via-black to-blue-950/10 border border-purple-500/20 rounded-2xl p-5 space-y-4 text-center">
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">Create Your Own Audit Report</h4>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Run a secure, confidential scan of your startup's AI spend to detect software sprawl and claim back thousands in wasted seats.
                </p>
              </div>
              <button
                onClick={onNavigateHome}
                className="w-full bg-white text-black hover:bg-gray-200 text-xs font-bold font-mono uppercase tracking-wider py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                Scan My Stack Now
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
