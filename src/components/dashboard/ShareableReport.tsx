/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Share2, FileDown, Copy, CheckCircle, ArrowLeft } from 'lucide-react';
import { AuditReport } from '../../types';

interface ShareableReportProps {
  report: AuditReport;
  onNavigateBack: () => void;
}

export default function ShareableReport({ report, onNavigateBack }: ShareableReportProps) {
  const [copied, setCopied] = useState(false);
  const { companyName, domainName, auditDate, currentSpendMonthly, potentialMonthlySavings, duplicateToolsCount, inactiveSeatsCount } = report;

  const publicLink = `https://autoaudit.ai/reports/public-${report.id || 'acme-rockets'}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="bg-black text-[#e5e2e1] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 selection:bg-purple-500/30">
      
      {/* Navigation Headers */}
      <div className="flex justify-between items-center">
        <button
          onClick={onNavigateBack}
          className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1.5 font-mono uppercase tracking-widest cursor-pointer focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </button>
        <span className="text-xs text-purple-400 font-mono">STATUS: PREVIEW SOCIAL EMBED</span>
      </div>

      {/* Main card box */}
      <div className="bg-[#090909] border border-white/5 p-6 sm:p-10 rounded-2xl space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400"></div>

        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">{companyName} Shared Review</h1>
            <p className="text-[11px] text-gray-500 font-mono tracking-wide mt-1 uppercase">domain: {domainName} | audited: {auditDate}</p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-950/30 border border-cyan-500/20 text-cyan-300 font-mono text-[10px] rounded-full uppercase tracking-wider">
              Audit Active
            </span>
          </div>
        </div>

        {/* Sharing logic panel */}
        <div className="bg-black border border-white/5 p-5 rounded-xl space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Public Shareable Link Config</h3>
          <p className="text-xs text-gray-400">
            This secure URL presents an anonymous, metadata-only scorecard viewable by team leads, investors, or board members without exposing internal employee lists.
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="flex-grow bg-[#090909] border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-purple-300 flex items-center justify-between select-all leading-none overflow-hidden text-ellipsis whitespace-nowrap">
              <span>{publicLink}</span>
            </div>
            <button
              onClick={copyToClipboard}
              className="bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 px-5 py-3 rounded-xl text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Copied Link</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-cyan-400" />
                  <span>Copy URL</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Financial Highlights Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-5 bg-white/[0.01] border border-white/5 rounded-xl">
            <p className="text-[9px] text-gray-500 font-mono tracking-widest uppercase">COMBINED ANNUAL WASTE</p>
            <p className="text-2xl font-extrabold font-mono text-rose-400 mt-1.5">${(potentialMonthlySavings * 12).toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              Based on duplicate general-purpose reasoning tools and code editors.
            </p>
          </div>

          <div className="p-5 bg-white/[0.01] border border-white/5 rounded-xl">
            <p className="text-[9px] text-gray-500 font-mono tracking-widest uppercase">POTENTIAL SAVINGS</p>
            <p className="text-2xl font-extrabold font-mono text-cyan-400 mt-1.5">${potentialMonthlySavings}/mo</p>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              Estimated instant cash reclaimed by standardizing workspace seat configurations.
            </p>
          </div>
        </div>

        {/* OpenGraph preview card representing Fig 3 logic */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Social Feed OpenGraph Card Embed</h4>
          <div className="bg-[#060606] border border-white/10 rounded-xl overflow-hidden shadow-md max-w-sm">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
              alt="Analytics visual"
              className="w-full h-32 object-cover border-b border-white/5 filter brightness-[0.7]"
              referrerPolicy="no-referrer"
            />
            <div className="p-4 space-y-1">
              <span className="text-[9px] text-purple-400 font-mono tracking-wider uppercase font-bold">autoaudit.ai/scorecard</span>
              <h5 className="font-bold text-white text-xs leading-tight">AI Stack Audit for {companyName}</h5>
              <p className="text-[11px] text-gray-400 leading-normal line-clamp-2">
                Monthly Spend: ${currentSpendMonthly.toLocaleString()} | Potential Savings: ${potentialMonthlySavings.toLocaleString()}/mo. Overlapping tools: {duplicateToolsCount}. Ghost seats: {inactiveSeatsCount}.
              </p>
            </div>
          </div>
        </div>

        {/* Action controls */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-[11px] text-gray-500">
            Verified workspace domain {domainName}. Public links use secure CORS encryption.
          </span>
          <button
            onClick={() => alert('Downloading PDF Audit Record...')}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-500 text-white px-5 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-shadow"
          >
            <FileDown className="w-3.5 h-3.5" />
            Download PDF Report
          </button>
        </div>

      </div>

    </div>
  );
}
