/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users, ShieldCheck } from 'lucide-react';
import { AuditReport } from '../../types';

interface AnalyticsProps {
  report: AuditReport;
  onNavigateBack: () => void;
}

export default function Analytics({ report, onNavigateBack }: AnalyticsProps) {
  const { companyName, domainName, teamMetrics, currentSpendMonthly } = report;

  // Find max spend dept to scale progress bars relative to it
  const maxSpend = Math.max(...teamMetrics.map(m => m.spend), 1);

  return (
    <div className="bg-black text-[#e5e2e1] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 selection:bg-purple-500/30">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button
            onClick={onNavigateBack}
            className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1.5 font-mono uppercase tracking-widest cursor-pointer focus:outline-none mb-1 shadow-none"
          >
            ← Navigate Back to Dashboard
          </button>
          <h2 className="text-2xl font-extrabold tracking-tight text-white leading-tight">Departmental Capital Allocation</h2>
        </div>
        <span className="text-xs text-purple-400 font-mono">DOMAIN: {domainName.toUpperCase()}</span>
      </div>

      {/* Grid summarizing departments */}
      <div className="bg-[#090909] border border-white/5 p-6 sm:p-8 rounded-2xl space-y-6 shadow-2xl">
        <h3 className="text-xs font-bold text-white tracking-widest uppercase font-mono border-b border-white/5 pb-2">Department Allocation Stack</h3>

        <div className="space-y-5">
          {teamMetrics.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No department data mapped yet.</p>
          ) : (
            teamMetrics.map((metric, idx) => {
              const pct = (metric.spend / maxSpend) * 100;
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-end text-xs font-mono">
                    <div className="space-y-0.5">
                      <p className="font-bold text-white uppercase text-xs">{metric.department}</p>
                      <p className="text-[10px] text-gray-500 font-sans">
                        SaaS: {metric.toolsUsed.join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-300 font-bold">${metric.spend}</span>
                      <span className="text-gray-500 font-sans text-[10px]"> /mo ({metric.seats} seats)</span>
                    </div>
                  </div>

                  <div className="h-3 w-full bg-black border border-white/5 rounded-full overflow-hidden flex items-center px-0.5">
                    <div
                      className="h-1.5 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Detailed metrics per department table */}
      <div className="bg-[#090909] border border-white/5 p-6 sm:p-8 rounded-2xl space-y-6 shadow-2xl">
        <h3 className="text-xs font-bold text-cyan-300 tracking-widest uppercase font-mono border-b border-white/5 pb-2">SaaS Utilization Ledger</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-400 font-sans">
            <thead>
              <tr className="border-b border-white/5 text-[9px] text-gray-500 uppercase tracking-widest font-mono">
                <th className="pb-3 text-left">Department</th>
                <th className="pb-3 text-center">Active Seats</th>
                <th className="pb-3 text-right">Raw Spend /mo</th>
                <th className="pb-3 text-right">Cost Per Seat /mo</th>
                <th className="pb-3 text-right">Platform Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {teamMetrics.map((m, idx) => (
                <tr key={idx} className="hover:bg-white/[0.01]">
                  <td className="py-4 font-bold text-white uppercase font-mono">{m.department}</td>
                  <td className="py-4 text-center font-mono">{m.seats}</td>
                  <td className="py-4 text-right font-mono font-bold text-purple-300">${m.spend}</td>
                  <td className="py-4 text-right font-mono font-bold text-cyan-300">${m.costPerEmployee}</td>
                  <td className="py-4 text-right text-[10px] text-gray-500 font-mono">
                    {Math.round((m.spend / (currentSpendMonthly || 1)) * 100)}% of startup total
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security note */}
      <div className="p-5 bg-purple-950/15 border border-purple-500/15 rounded-xl flex gap-4">
        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-300 flex-shrink-0 self-start">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-white text-xs uppercase font-mono">SaaS Governance Recommendation</h4>
          <p className="text-xs text-gray-400 leading-relaxed font-sans">
            Unmanaged seats represent significant shadow billing overhead that lacks centralized compliance limits. Grouping logins and invoice routing into managed departments cuts expenditure with zero system friction.
          </p>
        </div>
      </div>

    </div>
  );
}
