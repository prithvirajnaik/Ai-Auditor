/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  TrendingDown,
  Layers,
  Users,
  Eye,
  Settings as SettingsIcon,
  Share2
} from 'lucide-react';
import { AuditReport, Recommendation } from '../../types';
import { AI_TOOLS_PRICING } from '../../data/mockData';

interface DashboardProps {
  report: AuditReport;
  onNavigate: (page: string) => void;
  onUpdateReport: (updatedReport: AuditReport) => void;
}

export default function Dashboard({ report, onNavigate, onUpdateReport }: DashboardProps) {
  const [fixedAllApplied, setFixedAllApplied] = useState(false);

  const {
    companyName,
    domainName,
    auditDate,
    teamSize,
    primaryUseCase,
    currentSpendMonthly,
    optimizedSpendMonthly,
    potentialMonthlySavings,
    potentialAnnualSavings,
    duplicateToolsCount,
    inactiveSeatsCount,
    subscriptionsAnalyzed,
    recommendations,
    aiSummary
  } = report;

  // Handles applying a recommendation, correcting calculations dynamically
  const handleApplyRecommendation = (recId: string) => {
    const updatedRecommendations = recommendations.map(rec => {
      if (rec.id === recId) {
        return { ...rec, status: 'applied' as const };
      }
      return rec;
    });

    const targetRec = recommendations.find(r => r.id === recId);
    if (!targetRec || targetRec.status === 'applied') return;

    // Deduct savings from current spend
    const newOptimizedSpend = Math.max(100, optimizedSpendMonthly - targetRec.estimatedMonthlySavings);
    const newMonthlySavings = currentSpendMonthly - newOptimizedSpend;
    const newAnnualSavings = newMonthlySavings * 12;

    onUpdateReport({
      ...report,
      optimizedSpendMonthly: newOptimizedSpend,
      potentialMonthlySavings: newMonthlySavings,
      potentialAnnualSavings: newAnnualSavings,
      recommendations: updatedRecommendations
    });
  };

  const handleFixAllAutomagically = () => {
    if (fixedAllApplied) return;
    setFixedAllApplied(true);

    const updatedRecommendations = recommendations.map(rec => ({
      ...rec,
      status: 'applied' as const
    }));

    const unsolvedSavings = recommendations
      .filter(r => r.status === 'pending')
      .reduce((sum, r) => sum + r.estimatedMonthlySavings, 0);

    const newOptimizedSpend = Math.max(100, optimizedSpendMonthly - unsolvedSavings);
    const newMonthlySavings = currentSpendMonthly - newOptimizedSpend;
    const newAnnualSavings = newMonthlySavings * 12;

    onUpdateReport({
      ...report,
      optimizedSpendMonthly: newOptimizedSpend,
      potentialMonthlySavings: newMonthlySavings,
      potentialAnnualSavings: newAnnualSavings,
      recommendations: updatedRecommendations
    });
  };

  return (
    <div className="bg-black text-[#e5e2e1] min-h-screen flex flex-col font-sans selection:bg-purple-500/30">
      
      {/* Top Warning banner if overspending exists */}
      {potentialMonthlySavings > 0 && (
        <div className="bg-rose-950/20 border-b border-rose-500/15 px-6 py-2.5 text-xs tracking-wide text-rose-400 md:flex items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
            <span>BUDGET LEAK REPORT: {companyName.toUpperCase()} IS OVERSPENDING BY {Math.round((potentialMonthlySavings / currentSpendMonthly) * 100)}%</span>
          </div>
          <span className="hidden md:inline text-gray-500">POTENTIAL RECLAIM: ${potentialMonthlySavings}/MO</span>
        </div>
      )}

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 min-w-0">
        
        {/* Dashboard Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="space-y-1">
            <span className="font-mono text-[10px] text-purple-400 uppercase tracking-widest font-bold">WORKSPACE PROFILE</span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">{companyName} Scorecard</h2>
            <p className="text-xs text-gray-400">
              Domain: <span className="text-purple-300 font-mono">{domainName}</span> | Size: <span className="text-purple-300 font-mono">{teamSize} seats</span> | Use Case: <span className="text-purple-300 font-sans">{primaryUseCase}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('analytics')}
              className="px-4 py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-gray-300 rounded-xl text-xs font-semibold tracking-wider font-mono flex items-center gap-1.5 cursor-pointer leading-5"
            >
              <Users className="w-3.5 h-3.5 text-purple-400" />
              Department Split
            </button>
            <button
              onClick={() => onNavigate('shareable-report')}
              className="px-4 py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-gray-300 rounded-xl text-xs font-semibold tracking-wider font-mono flex items-center gap-1.5 cursor-pointer leading-5"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              Public Share
            </button>
            <button
              onClick={handleFixAllAutomagically}
              disabled={fixedAllApplied}
              className={`px-4 py-2 text-black rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                fixedAllApplied
                  ? 'bg-emerald-400 cursor-not-allowed shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'bg-gradient-to-r from-purple-300 to-cyan-300 hover:scale-[1.01]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {fixedAllApplied ? '✓ Fixed' : 'Auto Fix All'}
            </button>
          </div>
        </div>

        {/* 1. Realistic metrics cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Monthly Spend */}
          <div className="bg-[#090909]/85 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
            <p className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">MONTHLY SPEND</p>
            <div className="mt-3">
              <p className="text-2xl font-extrabold font-mono text-white">${currentSpendMonthly.toLocaleString()}</p>
              <p className="text-[10px] text-gray-500 font-sans mt-0.5">Based on {subscriptionsAnalyzed.length} active platforms</p>
            </div>
          </div>

          {/* Annual Spend */}
          <div className="bg-[#090909]/85 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
            <p className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">ANNUAL SPEND</p>
            <div className="mt-3">
              <p className="text-2xl font-extrabold font-mono text-white">${(currentSpendMonthly * 12).toLocaleString()}</p>
              <p className="text-[10px] text-gray-500 font-sans mt-0.5">Unoptimized forecast mapping</p>
            </div>
          </div>

          {/* Potential Savings */}
          <div className="bg-[#090909]/85 border border-rose-500/15 p-4 rounded-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-full blur-xl pointer-events-none"></div>
            <p className="text-[10px] font-mono tracking-widest text-rose-400 uppercase font-black">POTENTIAL SAVINGS</p>
            <div className="mt-3">
              <p className="text-2xl font-extrabold font-mono text-rose-400">${potentialMonthlySavings.toLocaleString()}<span className="text-xs text-gray-500 font-sans font-normal"> /mo</span></p>
              <p className="text-[10px] text-green-400 font-mono mt-0.5">-${potentialAnnualSavings.toLocaleString()}/yr target</p>
            </div>
          </div>

          {/* Duplicate Tools Detected */}
          <div className="bg-[#090909]/85 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
            <p className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">DUPLICATE TOOLS DETECTED</p>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="text-2xl font-extrabold font-mono text-white">{duplicateToolsCount}</p>
                <p className="text-[10px] text-gray-500 font-sans mt-0.5">Overlapping capabilities</p>
              </div>
              <Layers className="w-5 h-5 text-purple-400 opacity-60 mb-1" />
            </div>
          </div>

          {/* Inactive Seats Detected */}
          <div className="bg-[#090909]/85 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
            <p className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">INACTIVE SEATS DETECTED</p>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="text-2xl font-extrabold font-mono text-white">{inactiveSeatsCount}</p>
                <p className="text-[10px] text-gray-500 font-sans mt-0.5">Ghost / idle allocations</p>
              </div>
              <Users className="w-5 h-5 text-cyan-400 opacity-60 mb-1" />
            </div>
          </div>

        </div>

        {/* 2. Audit recommendations list & AI summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Dynamic Recommendations Container */}
          <div className="lg:col-span-8 bg-[#090909] border border-white/5 p-5 rounded-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-xs font-bold text-white tracking-widest uppercase font-mono">MVP Audit Recommendations</h3>
              <span className="text-[10px] text-gray-500">
                {recommendations.filter(r => r.status === 'pending').length} pending actions
              </span>
            </div>

            <div className="space-y-4">
              {recommendations.map(rec => {
                const isApplied = rec.status === 'applied';
                return (
                  <div
                    key={rec.id}
                    className={`border rounded-xl p-5 space-y-4 transition-all ${
                      isApplied
                        ? 'bg-[#040906] border-emerald-500/10 opacity-75'
                        : 'bg-black border-white/5 hover:border-purple-500/20'
                    }`}
                  >
                    {/* Header line of Card */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div className="space-y-1 py-0.5">
                        <span className={`inline-block px-1.5 py-0.5 font-mono text-[9px] uppercase font-bold rounded ${
                          isApplied ? 'bg-emerald-500/10 text-emerald-400' : 'bg-purple-500/10 text-purple-300'
                        }`}>
                          {rec.type.replace('_', ' ')}
                        </span>
                        <h4 className="font-extrabold text-white text-sm sm:text-base tracking-tight">{rec.title}</h4>
                      </div>

                      <div className="text-left sm:text-right font-mono text-xs whitespace-nowrap">
                        <p className={`${isApplied ? 'text-emerald-400 font-bold' : 'text-rose-400 font-semibold'}`}>
                          {isApplied ? '✓ Applied Savings' : `+ $${rec.estimatedMonthlySavings}/mo saved`}
                        </p>
                        {!isApplied && (
                          <p className="text-[10px] text-gray-500">Estimated ${rec.estimatedAnnualSavings}/yr savings</p>
                        )}
                      </div>
                    </div>

                    {/* Detailed Properties */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-white/5 py-3 text-xs leading-normal">
                      <div>
                        <p className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">CURRENT SPEND</p>
                        <p className="font-mono text-white mt-0.5">${rec.currentSpend}/mo</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">RECOMMENDED ACTION</p>
                        <p className="text-gray-300 mt-0.5">{rec.recommendedAction}</p>
                      </div>
                    </div>

                    {/* Reasoning Description */}
                    <div className="space-y-2">
                      <p className="text-xs text-gray-400 leading-relaxed font-sans">{rec.description}</p>
                      
                      <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg text-[11px] leading-relaxed text-gray-500">
                        <span className="font-mono text-[9px] text-purple-400 uppercase tracking-wider font-bold block mb-1">FINANCE REASONING</span>
                        {rec.reasoning}
                      </div>
                    </div>

                    {/* Action button */}
                    {!isApplied && (
                      <div className="pt-2 flex justify-start">
                        <button
                          type="button"
                          onClick={() => handleApplyRecommendation(rec.id)}
                          className="bg-purple-950/45 hover:bg-purple-900/40 border border-purple-500/20 hover:border-purple-500/50 text-purple-300 px-4 py-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none"
                        >
                          <Zap className="w-3 h-3 text-cyan-300" />
                          Apply Recommendation
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI summaries Column */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* AI Generated summary block */}
            <div className="bg-gradient-to-br from-[#0c0c0c] to-black border-2 border-cyan-500/20 p-5 rounded-2xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/5 rounded-full blur-xl pointer-events-none"></div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-cyan-400 text-black text-[9px] font-mono uppercase font-black rounded tracking-widest">LIVE AI ASSISTANT</span>
                <h3 className="text-xs font-bold text-white tracking-widest uppercase font-mono">Audit Summary</h3>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                {aiSummary}
              </p>

              <div className="bg-[#101010]/95 border border-white/10 p-4 rounded-xl space-y-3">
                <p className="text-xs text-purple-300 italic font-medium leading-relaxed">
                  "Streamlining duplicate software subscriptions and standardizing ad-hoc expense accounts allows modern startups to increase runway and improve budget governance immediately."
                </p>
                <div className="flex gap-4 border-t border-white/5 pt-3 text-xs leading-none">
                  <div>
                    <h5 className="text-[9px] text-gray-500 font-mono tracking-wider uppercase">DEDUPLICATION STATE</h5>
                    <p className="text-[11px] font-semibold text-white mt-1">Available</p>
                  </div>
                  <div>
                    <h5 className="text-[9px] text-gray-500 font-mono tracking-wider uppercase">SECURITY RISK</h5>
                    <p className="text-[11px] font-semibold text-rose-400 mt-1">Fragmented SaaS</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform statistics summary */}
            <div className="bg-[#090909] border border-white/5 p-5 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-white tracking-widest uppercase font-mono">Platform Allocations</h3>
              
              <div className="space-y-3.5">
                {subscriptionsAnalyzed.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No allocations mapped yet</p>
                ) : (
                  subscriptionsAnalyzed.slice(0, 5).map(sub => (
                    <div key={sub.id} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-white">{sub.toolName}</span>
                        <span className="text-[10px] text-purple-300 font-mono">{sub.planName}</span>
                      </div>
                      <span className="font-mono text-gray-400 font-bold">${sub.totalCost}/mo</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
