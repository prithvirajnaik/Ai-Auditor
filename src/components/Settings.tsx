/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Key, Sliders, ArrowLeft, CheckCircle } from 'lucide-react';

interface SettingsProps {
  onNavigateBack: () => void;
}

export default function Settings({ onNavigateBack }: SettingsProps) {
  const [ssoProvider, setSsoProvider] = useState('gsuite');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  return (
    <div className="bg-[#000000] text-[#e5e2e1] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={onNavigateBack}
          className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 font-mono uppercase tracking-widest cursor-pointer focus:outline-none"
        >
          ← Back to Dashboard
        </button>
        <span className="text-xs text-purple-400 font-mono">WORKSPACE ID: SEC-ACME-90</span>
      </div>

      <div className="bg-[#090909] border border-white/5 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-[90px] pointer-events-none"></div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">Workspace Preferences</h1>
          <p className="text-xs text-gray-500 font-mono uppercase mt-1">Audit Policy Controls &amp; Credentials</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* SSO configuration section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <Shield className="w-5 h-5 text-purple-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Central SSO Policies</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setSsoProvider('gsuite')}
                className={`p-4 border rounded-xl font-sans text-xs flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors focus:outline-none ${
                  ssoProvider === 'gsuite'
                    ? 'border-purple-500 bg-purple-500/10 text-white'
                    : 'border-white/5 bg-black text-gray-400 hover:border-white/10'
                }`}
              >
                <span className="text-base">💼</span>
                <span className="font-bold">Google Workspace</span>
              </button>

              <button
                type="button"
                onClick={() => setSsoProvider('okta')}
                className={`p-4 border rounded-xl font-sans text-xs flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors focus:outline-none ${
                  ssoProvider === 'okta'
                    ? 'border-purple-500 bg-purple-500/10 text-white'
                    : 'border-white/5 bg-black text-gray-400 hover:border-white/10'
                }`}
              >
                <span className="text-base">🛡️</span>
                <span className="font-bold">Okta Directory</span>
              </button>

              <button
                type="button"
                onClick={() => setSsoProvider('none')}
                className={`p-4 border rounded-xl font-sans text-xs flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors focus:outline-none ${
                  ssoProvider === 'none'
                    ? 'border-purple-500 bg-purple-500/10 text-white'
                    : 'border-white/5 bg-black text-gray-400 hover:border-white/10'
                }`}
              >
                <span className="text-base">❌</span>
                <span className="font-bold">No SSO Policy</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 pl-1 leading-relaxed">
              When SSO is active, Auto Audit can dynamically read seat assignment logs automatically, crosschecking active emails on Okta or Google workspace systems.
            </p>
          </div>

          {/* API credentials mock */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <Key className="w-5 h-5 text-purple-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Gemini API Key Proxy</h3>
            </div>
            
            <div className="p-4 bg-black border border-white/5 rounded-2xl space-y-2">
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Gemini API calls are managed securely from the application server side. You don't need to specify custom keys here; AI Studio automatically injects your credentials at runtime.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-mono text-xs text-emerald-300 font-bold uppercase">SECURE SECRET INJECTED</span>
              </div>
            </div>
          </div>

          {/* Audit parameters */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <Sliders className="w-5 h-5 text-purple-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Audit Sensitivity Rules</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-sans">Deduplication Overlap Threshold</label>
                <select className="w-full bg-black border border-white/10 rounded-xl px-3 py-3 text-white focus:border-purple-500 focus:outline-none font-sans text-sm">
                  <option value="strict">Strict (Flag any concurrent seat)</option>
                  <option value="lax">Lax (Allow dual roles in Eng)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1 font-sans">Idle Trigger Sensitivity</label>
                <select className="w-full bg-black border border-white/10 rounded-xl px-3 py-3 text-white focus:border-purple-500 focus:outline-none font-sans text-sm">
                  <option value="30">30 Days without Prompt telemetries</option>
                  <option value="60">60 Days without Prompt telemetries</option>
                  <option value="90">90 Days without Prompt telemetries</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {saveSuccess && (
                <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Preferences updated securely
                </span>
              )}
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] text-white px-8 py-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
            >
              Save Configuration
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
