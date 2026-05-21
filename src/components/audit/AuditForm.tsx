/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Trash2, PlusCircle, LayoutGrid, RotateCcw } from 'lucide-react';
import { SubscriptionItem } from '../../types';
import { AI_TOOLS_PRICING, INITIAL_SPRAWL_SUBSCRIPTIONS } from '../../data/mockData';
import { runAuditAnalysis } from '../../lib/auditEngine';

interface AuditFormProps {
  onAuditCompleted: (report: any) => void;
  onNavigateHome: () => void;
}

export default function AuditForm({ onAuditCompleted, onNavigateHome }: AuditFormProps) {
  // Global fields with LocalStorage integration
  const [companyName, setCompanyName] = useState(() => {
    return localStorage.getItem('autoaudit_company_name') || 'Acme Rockets Inc.';
  });
  const [domainName, setDomainName] = useState(() => {
    return localStorage.getItem('autoaudit_domain_name') || 'acme-rockets.com';
  });
  const [teamSize, setTeamSize] = useState(() => {
    return Number(localStorage.getItem('autoaudit_team_size') || '25');
  });
  const [primaryUseCase, setPrimaryUseCase] = useState(() => {
    return localStorage.getItem('autoaudit_primary_use_case') || 'Product Development';
  });

  // Subscriptions with LocalStorage integration
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(() => {
    const stored = localStorage.getItem('autoaudit_subscriptions');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored subscriptions', e);
      }
    }
    return INITIAL_SPRAWL_SUBSCRIPTIONS;
  });

  // Current selected tool form states
  const [selectedToolId, setSelectedToolId] = useState('chatgpt');
  const [selectedPlanName, setSelectedPlanName] = useState('Plus (Individual)');
  const [seats, setSeats] = useState(10);
  const [customMonthlySpend, setCustomMonthlySpend] = useState<number>(20); // Unit rate per month

  // Loader state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingLogs, setLoadingLogs] = useState<string[]>([]);

  // Storing fields on change inside localStorage
  useEffect(() => {
    localStorage.setItem('autoaudit_company_name', companyName);
  }, [companyName]);

  useEffect(() => {
    localStorage.setItem('autoaudit_domain_name', domainName);
  }, [domainName]);

  useEffect(() => {
    localStorage.setItem('autoaudit_team_size', String(teamSize));
  }, [teamSize]);

  useEffect(() => {
    localStorage.setItem('autoaudit_primary_use_case', primaryUseCase);
  }, [primaryUseCase]);

  useEffect(() => {
    localStorage.setItem('autoaudit_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  const loadingSteps = [
    'Analyzing subscriptions in organization pool...',
    'Checking duplicate seat assignments and vendor overlap...',
    'Comparing pricing tiers block-by-block with standard team packages...',
    'Generating dynamic optimization audit report...'
  ];

  // Auto-sync price based on selected tool/plan
  const handleToolChange = (toolId: string) => {
    setSelectedToolId(toolId);
    const tool = AI_TOOLS_PRICING.find(t => t.id === toolId);
    if (tool && tool.plans.length > 0) {
      setSelectedPlanName(tool.plans[0].name);
      setCustomMonthlySpend(tool.plans[0].price);
    }
  };

  const handlePlanChange = (planName: string) => {
    setSelectedPlanName(planName);
    const tool = AI_TOOLS_PRICING.find(t => t.id === selectedToolId);
    if (tool) {
      const plan = tool.plans.find(p => p.name === planName);
      if (plan) {
        setCustomMonthlySpend(plan.price);
      }
    }
  };

  // Reset or preset configurations
  const handlePresetSelect = (presetType: 'sprawl' | 'empty') => {
    if (presetType === 'sprawl') {
      setCompanyName('Acme Rockets Inc.');
      setDomainName('acme-rockets.com');
      setTeamSize(22);
      setPrimaryUseCase('Product Development');
      setSubscriptions(INITIAL_SPRAWL_SUBSCRIPTIONS);
    } else {
      setCompanyName('');
      setDomainName('');
      setTeamSize(10);
      setPrimaryUseCase('General Operations');
      setSubscriptions([]);
    }
  };

  const handleAddSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    const tool = AI_TOOLS_PRICING.find(t => t.id === selectedToolId);
    if (!tool) return;

    const newSub: SubscriptionItem = {
      id: `sub-${Math.random().toString(36).substr(2, 9)}`,
      toolId: selectedToolId,
      toolName: tool.name,
      planName: selectedPlanName,
      department: 'Engineering', // defaulted list mapping, customizable if needed
      seats,
      costPerSeat: customMonthlySpend,
      totalCost: seats * customMonthlySpend,
      billingCycle: 'monthly',
      status: 'active'
    };

    setSubscriptions([...subscriptions, newSub]);
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter(s => s.id !== id));
  };

  const triggerAuditSubmit = () => {
    setIsLoading(true);
    setLoadingStep(0);
    setLoadingLogs(['[system] Initializing SaaS budget parser engine...']);

    let currentStepIndex = 0;
    const interval = setInterval(() => {
      if (currentStepIndex < loadingSteps.length) {
        setLoadingLogs(logs => [
          ...logs,
          `[audit-log] -> ${loadingSteps[currentStepIndex]}`,
          `[telemetry] SUCCESS: parsed process ${currentStepIndex + 1}/${loadingSteps.length}`
        ]);
        currentStepIndex++;
        setLoadingStep(currentStepIndex);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          const finishedReport = runAuditAnalysis(
            companyName,
            domainName,
            teamSize,
            primaryUseCase,
            subscriptions
          );
          onAuditCompleted(finishedReport);
          setIsLoading(false);
        }, 500);
      }
    }, 600);
  };

  return (
    <div className="bg-black text-[#e5e2e1] min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative selection:bg-purple-500/30">
      <div className="absolute top-[10%] right-[10%] w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {isLoading ? (
        /* Dynamic Terminal Scan Loader */
        <div className="max-w-lg mx-auto mt-24 text-center space-y-8 animate-fade-in">
          <div className="relative inline-flex items-center justify-center p-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 rounded-full animate-spin">
            <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-300" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white tracking-tight">Compiling Overlap Diagnostics</h3>
            <p className="text-[10px] text-purple-400 tracking-widest uppercase font-mono">Running precision metrics...</p>
          </div>

          <div className="bg-[#090909] border border-white/5 p-5 rounded-xl text-left font-mono text-[10px] text-gray-400 space-y-2.5 max-w-md mx-auto shadow-inner">
            {loadingLogs.map((log, idx) => (
              <p
                key={idx}
                className={idx === loadingLogs.length - 1 ? 'text-cyan-400 animate-pulse' : 'text-gray-400'}
              >
                {log}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
            <div>
              <button
                onClick={onNavigateHome}
                className="text-xs text-gray-500 hover:text-purple-300 font-mono uppercase tracking-wider mb-1 focus:outline-none"
              >
                ← Return to Platform
              </button>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">Analyze Tooling Overlap</h1>
            </div>

            <div className="flex gap-2 bg-[#090909] border border-white/5 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => handlePresetSelect('sprawl')}
                className="px-3 py-1.5 bg-purple-950/40 border border-purple-500/20 text-purple-300 rounded-md text-xs font-semibold hover:bg-purple-900/30"
              >
                Load AI Sprawl Preset
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect('empty')}
                className="px-3 py-1.5 rounded-md text-xs text-gray-400 font-semibold hover:bg-white/5 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          </div>

          {/* Core Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LHS Profile & Add Subscription */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Profile fields */}
              <div className="bg-[#090909] border border-white/5 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-white tracking-widest uppercase font-mono border-b border-white/5 pb-2">1. Profile Profile</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Company Name</label>
                    <input
                      type="text"
                      className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-700 focus:border-purple-500 focus:outline-none text-xs"
                      placeholder="My Startup"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Corporate Domain</label>
                    <input
                      type="text"
                      className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-700 focus:border-purple-500 focus:outline-none text-xs"
                      placeholder="domain.com"
                      value={domainName}
                      onChange={(e) => setDomainName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Team Size</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white focus:border-purple-500 focus:outline-none text-xs font-mono"
                      value={teamSize}
                      onChange={(e) => setTeamSize(Math.max(1, parseInt(e.target.value) || 1))}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Primary Use Case</label>
                    <select
                      className="w-full bg-black border border-white/10 rounded-xl px-2 py-2 text-white focus:border-purple-500 focus:outline-none text-xs"
                      value={primaryUseCase}
                      onChange={(e) => setPrimaryUseCase(e.target.value)}
                    >
                      <option value="Product Development">Product Dev</option>
                      <option value="Marketing & Copywriting">Marketing</option>
                      <option value="Data Analytics">Data Analysis</option>
                      <option value="General Administration">General Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Add Tool Form */}
              <div className="bg-[#090909] border border-white/5 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-white tracking-widest uppercase font-mono border-b border-white/5 pb-2">2. Append AI Subscriptions</h3>
                
                <form onSubmit={handleAddSubscription} className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Select Tool</label>
                    <select
                      className="w-full bg-black border border-white/10 rounded-xl px-2 py-2 text-white focus:border-purple-500 focus:outline-none text-xs"
                      value={selectedToolId}
                      onChange={(e) => handleToolChange(e.target.value)}
                    >
                      {AI_TOOLS_PRICING.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Plan Tier</label>
                      <select
                        className="w-full bg-black border border-white/10 rounded-xl px-2 py-2 text-white focus:border-purple-500 focus:outline-none text-xs"
                        value={selectedPlanName}
                        onChange={(e) => handlePlanChange(e.target.value)}
                      >
                        {AI_TOOLS_PRICING.find(t => t.id === selectedToolId)?.plans.map(p => (
                          <option key={p.name} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 text-right">Cost Per Seat /mo</label>
                      <input
                        type="number"
                        min="1"
                        className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white text-right font-mono text-xs"
                        value={customMonthlySpend}
                        onChange={(e) => setCustomMonthlySpend(Math.max(1, parseInt(e.target.value) || 1))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Allocated Seat Count</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-xs"
                      value={seats}
                      onChange={(e) => setSeats(Math.max(1, parseInt(e.target.value) || 1))}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/10 py-3 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 text-cyan-300" />
                    Add subscription seat
                  </button>
                </form>
              </div>

            </div>

            {/* RHS Active Sprawl List Map */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-[#090909] border border-white/5 rounded-2xl p-5 sm:p-6 space-y-6 shadow-2xl">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <h3 className="text-xs font-bold text-purple-300 tracking-widest uppercase font-mono">Mapped Core Sprawl List</h3>
                  <span className="font-mono text-[10px] text-gray-500">{subscriptions.length} records registered</span>
                </div>

                {subscriptions.length === 0 ? (
                  <div className="text-center py-16 text-gray-600 space-y-3 font-sans border border-dashed border-white/5 rounded-xl">
                    <LayoutGrid className="w-8 h-8 mx-auto text-gray-700" />
                    <p className="text-xs">No subscriptions registered. Load a preset or configure seats above to proceed.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11px] text-gray-400 font-sans">
                        <thead>
                          <tr className="border-b border-white/5 text-[9px] text-gray-500 uppercase tracking-wider font-mono">
                            <th className="pb-2">Tool &amp; Plan</th>
                            <th className="pb-2 text-center">Seats</th>
                            <th className="pb-2 text-right">Rate</th>
                            <th className="pb-2 text-right">Combined /mo</th>
                            <th className="pb-2 text-center">Prune</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {subscriptions.map(sub => (
                            <tr key={sub.id} className="hover:bg-white/[0.01]">
                               <td className="py-3">
                                 <div className="flex items-center gap-2">
                                   <span className="text-sm">
                                     {AI_TOOLS_PRICING.find(t => t.id === sub.toolId)?.logo || '💡'}
                                   </span>
                                   <div>
                                     <p className="font-bold text-white text-xs">{sub.toolName}</p>
                                     <p className="text-[10px] text-purple-300 font-mono">{sub.planName}</p>
                                   </div>
                                 </div>
                               </td>
                               <td className="py-3 text-center font-mono text-white font-bold">{sub.seats}</td>
                               <td className="py-3 text-right font-mono">${sub.costPerSeat}</td>
                               <td className="py-3 text-right font-mono font-bold text-cyan-400">${sub.totalCost}</td>
                               <td className="py-3 text-center">
                                 <button
                                   type="button"
                                   onClick={() => handleDeleteSubscription(sub.id)}
                                   className="text-gray-500 hover:text-rose-400 p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
                                 >
                                   <Trash2 className="w-3.5 h-3.5" />
                                 </button>
                               </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <p className="text-[9px] text-gray-500 font-mono tracking-wider uppercase">AGGREGATE MONTHLY OVERHEAD</p>
                        <p className="text-2xl font-bold font-mono text-rose-400">
                          ${subscriptions.reduce((sum, s) => sum + s.totalCost, 0).toLocaleString()}
                          <span className="text-xs font-normal text-gray-500 font-sans">/mo</span>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={triggerAuditSubmit}
                        className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-cyan-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.25)] text-white px-6 py-3.5 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer text-xs"
                      >
                        Evaluate Stack Integrity
                        <Sparkles className="w-4 h-4 text-cyan-300" />
                      </button>
                    </div>

                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
