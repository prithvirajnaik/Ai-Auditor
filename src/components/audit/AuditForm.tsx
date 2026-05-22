import React, { useState, useEffect } from 'react';
import { Sparkles, PlusCircle, RotateCcw } from 'lucide-react';
import { SubscriptionItem } from '../../types';
import { AI_TOOLS_PRICING } from '../../lib/pricing';
import { runAuditAnalysis } from '../../lib/auditEngine';
import ProfileForm from './ProfileForm';
import SubscriptionCard from './SubscriptionCard';

interface AuditFormProps {
  onAuditCompleted: (report: any) => void;
  onNavigateHome: () => void;
}

const DEFAULT_PRESET_SUBSCRIPTIONS: SubscriptionItem[] = [
  { id: 'sub-preset-1', toolId: 'chatgpt', toolName: 'ChatGPT', planName: 'Plus (Individual)', department: 'Engineering', seats: 12, costPerSeat: 20, totalCost: 240, billingCycle: 'monthly', status: 'active' },
  { id: 'sub-preset-2', toolId: 'claude', toolName: 'Claude', planName: 'Pro (Individual)', department: 'Engineering', seats: 8, costPerSeat: 20, totalCost: 160, billingCycle: 'monthly', status: 'active' },
  { id: 'sub-preset-3', toolId: 'cursor', toolName: 'Cursor', planName: 'Pro', department: 'Engineering', seats: 10, costPerSeat: 20, totalCost: 200, billingCycle: 'monthly', status: 'active' },
  { id: 'sub-preset-4', toolId: 'copilot', toolName: 'GitHub Copilot', planName: 'Business', department: 'Engineering', seats: 10, costPerSeat: 19, totalCost: 190, billingCycle: 'monthly', status: 'active' },
  { id: 'sub-preset-5', toolId: 'openai_api', toolName: 'OpenAI API', planName: 'Tier 1 API Usage', department: 'Engineering', seats: 1, costPerSeat: 100, totalCost: 100, billingCycle: 'monthly', status: 'active' },
  { id: 'sub-preset-6', toolId: 'v0', toolName: 'v0', planName: 'Pro', department: 'Product', seats: 4, costPerSeat: 20, totalCost: 80, billingCycle: 'monthly', status: 'active' }
];

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
    return DEFAULT_PRESET_SUBSCRIPTIONS;
  });

  // Validation errors
  const [errors, setErrors] = useState<{ companyName?: string; domainName?: string; teamSize?: string }>({});

  // Loader state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState<string[]>([]);

  // LocalStorage syncing on updates
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
    'Initializing SaaS budget parser engine...',
    'Scanning domain registry records and active seat telemetry...',
    'Evaluating duplicate AI code editor configurations (Cursor vs Copilot)...',
    'Checking chatbot capability duplication across departments...',
    'Comparing API usage tiers against optimized semantic caching proxy profiles...',
    'Verifying team sizing limits against total software seat counts...',
    'Generating dynamic financial optimization audit report...'
  ];

  const handleAddCard = () => {
    const defaultTool = AI_TOOLS_PRICING[0]; // ChatGPT
    const defaultPlan = defaultTool.plans[0]; // Plus
    const newSub: SubscriptionItem = {
      id: `sub-${Math.random().toString(36).substr(2, 9)}`,
      toolId: defaultTool.id,
      toolName: defaultTool.name,
      planName: defaultPlan.name,
      department: 'Engineering',
      seats: 5,
      costPerSeat: defaultPlan.price,
      totalCost: 5 * defaultPlan.price,
      billingCycle: 'monthly',
      status: 'active'
    };
    setSubscriptions([...subscriptions, newSub]);
  };

  const handleCardChange = (idx: number, updated: SubscriptionItem) => {
    const next = [...subscriptions];
    next[idx] = updated;
    setSubscriptions(next);
  };

  const handleRemoveCard = (idx: number) => {
    setSubscriptions(subscriptions.filter((_, i) => i !== idx));
  };

  const handlePresetSelect = (presetType: 'sprawl' | 'empty') => {
    if (presetType === 'sprawl') {
      setCompanyName('Acme Rockets Inc.');
      setDomainName('acme-rockets.com');
      setTeamSize(22);
      setPrimaryUseCase('Product Development');
      setSubscriptions(DEFAULT_PRESET_SUBSCRIPTIONS);
      setErrors({});
    } else {
      setCompanyName('');
      setDomainName('');
      setTeamSize(10);
      setPrimaryUseCase('Mixed Usage');
      setSubscriptions([]);
      setErrors({});
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    if (!companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!domainName.trim()) {
      newErrors.domainName = 'Domain name is required';
    } else if (!domainRegex.test(domainName.trim())) {
      newErrors.domainName = 'Enter a valid corporate domain (e.g. startup.com)';
    }

    if (teamSize <= 0 || isNaN(teamSize)) {
      newErrors.teamSize = 'Team size must be at least 1 employee';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const triggerAuditSubmit = () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setLoadingLogs(['[system] Initializing SaaS budget parser engine...']);

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < loadingSteps.length) {
        setLoadingLogs(logs => [
          ...logs,
          `[audit-log] -> ${loadingSteps[stepIndex]}`,
          `[telemetry] SUCCESS: Process completed [${stepIndex + 1}/${loadingSteps.length}]`
        ]);
        stepIndex++;
      } else {
        clearInterval(interval);
        setTimeout(async () => {
          try {
            const response = await fetch('/api/audits', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                company_name: companyName.trim(),
                domain_name: domainName.trim(),
                team_size: teamSize,
                use_case: primaryUseCase,
                subscriptions
              })
            });

            if (!response.ok) {
              throw new Error(`Server returned status ${response.status}`);
            }

            const result = await response.json();
            if (result.success && result.report) {
              onAuditCompleted(result.report);
              setIsLoading(false);
              return;
            }
            throw new Error('Malformed server response');
          } catch (error) {
            console.warn('[Backend Integration Fallback] Using local calculations engine:', error);
            const report = runAuditAnalysis(
              companyName.trim(),
              domainName.trim(),
              teamSize,
              primaryUseCase,
              subscriptions
            );
            // Inject a mock publicId for fallback compatibility
            report.publicId = `mock-${Math.random().toString(36).substr(2, 9)}`;
            onAuditCompleted(report);
            setIsLoading(false);
          }
        }, 500);
      }
    }, 450);
  };

  const totalMonthlySpend = subscriptions.reduce((sum, s) => sum + s.totalCost, 0);

  return (
    <div className="bg-black text-[#e5e2e1] min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative selection:bg-purple-500/30">
      <div className="absolute top-[10%] right-[10%] w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {isLoading ? (
        /* Terminal scan log view */
        <div className="max-w-xl mx-auto mt-20 text-center space-y-8 animate-fade-in">
          <div className="relative inline-flex items-center justify-center p-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 rounded-full animate-spin">
            <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-300" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white tracking-tight">Compiling Overlap Diagnostics</h3>
            <p className="text-[10px] text-purple-400 tracking-widest uppercase font-mono">Running precision heuristics...</p>
          </div>

          <div className="bg-[#090909] border border-white/5 p-5 rounded-xl text-left font-mono text-[10px] text-gray-400 space-y-2.5 shadow-inner max-h-[350px] overflow-y-auto">
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
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Analyze Tooling Overlap
              </h1>
            </div>

            <div className="flex gap-2 bg-[#090909] border border-white/5 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => handlePresetSelect('sprawl')}
                className="px-3 py-1.5 bg-purple-950/40 border border-purple-500/20 text-purple-300 rounded-md text-xs font-semibold hover:bg-purple-900/30 cursor-pointer"
              >
                Load AI Sprawl Preset
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect('empty')}
                className="px-3 py-1.5 rounded-md text-xs text-gray-400 font-semibold hover:bg-white/5 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column Profile */}
            <div className="lg:col-span-4">
              <ProfileForm
                companyName={companyName}
                setCompanyName={setCompanyName}
                domainName={domainName}
                setDomainName={setDomainName}
                teamSize={teamSize}
                setTeamSize={setTeamSize}
                primaryUseCase={primaryUseCase}
                setPrimaryUseCase={setPrimaryUseCase}
                errors={errors}
              />
            </div>

            {/* Right Column Subscriptions */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-[#090909] border border-white/5 p-5 sm:p-6 rounded-2xl space-y-6 shadow-2xl">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <h3 className="text-xs font-bold text-purple-300 tracking-widest uppercase font-mono">
                    Active AI Tool Cards
                  </h3>
                  <span className="font-mono text-[10px] text-gray-500">
                    {subscriptions.length} items declared
                  </span>
                </div>

                {subscriptions.length === 0 ? (
                  <div className="text-center py-16 text-gray-600 space-y-3 font-sans border border-dashed border-white/5 rounded-xl">
                    <p className="text-xs">No active tool subscriptions declared. Add a tool card below to start.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subscriptions.map((sub, idx) => (
                      <SubscriptionCard
                        key={sub.id}
                        subscription={sub}
                        onChange={(updated) => handleCardChange(idx, updated)}
                        onRemove={() => handleRemoveCard(idx)}
                      />
                    ))}
                  </div>
                )}

                {/* Card controls */}
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <button
                    type="button"
                    onClick={handleAddCard}
                    className="w-full sm:w-auto bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/10 px-5 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 text-cyan-300" />
                    Add Subscription Card
                  </button>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <p className="text-[9px] text-gray-500 font-mono tracking-wider uppercase">combined monthly spend</p>
                      <p className="text-xl font-bold font-mono text-rose-400">
                        ${totalMonthlySpend.toLocaleString()}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={triggerAuditSubmit}
                      className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.25)] text-white px-6 py-3.5 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer text-xs"
                    >
                      Run Precision Audit
                      <Sparkles className="w-4 h-4 text-cyan-300" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
