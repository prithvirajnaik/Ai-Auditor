/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Brain, ShieldCheck, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

interface AuthPagesProps {
  onLoginCompleted: (userEmail: string) => void;
  onNavigateHome: () => void;
}

export default function AuthPages({ onLoginCompleted, onNavigateHome }: AuthPagesProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('Email registration is required');
      return;
    }
    onLoginCompleted(email);
  };

  const handleQuickDemo = (demoType: 'seed' | 'seriesA') => {
    onLoginCompleted(`demo-${demoType}@autoaudit.ai`);
  };

  return (
    <div className="bg-[#000000] text-[#e5e2e1] min-h-screen py-16 px-4 flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* Visual background glows */}
      <div className="absolute top-[30%] left-[30%] w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[30%] right-[30%] w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        
        {/* Branding header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 cursor-pointer focus:outline-none" onClick={onNavigateHome}>
            <span className="text-2xl">🧠</span>
            <span className="text-2xl font-extrabold tracking-tighter text-white">Auto Audit</span>
          </div>
          <p className="text-xs text-gray-500 font-mono tracking-widest uppercase">
            {isLogin ? 'Centralize & Optimize AI Budgets' : 'Establish Corporate Financial Guardrails'}
          </p>
        </div>

        {/* Central Card */}
        <div className="bg-[#090909] border border-white/5 p-8 rounded-3xl space-y-6 shadow-2xl relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-[80px]"></div>

          <h3 className="text-lg font-bold text-white text-center">
            {isLogin ? 'Sign-in to Workspace' : 'Request Enterprise Provision'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Company Name</label>
                <input
                  required
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Rockets Inc."
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-700 focus:border-purple-500 focus:outline-none text-sm font-sans"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Corporate Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-600" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="finance@acme-rockets.com"
                  className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-700 focus:border-purple-500 focus:outline-none text-sm font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Security Token / Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-600" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-700 focus:border-purple-500 focus:outline-none text-sm font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] text-white py-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer pt-4"
            >
              <span>{isLogin ? 'Access Workspace' : 'Provison Accounts'}</span>
              <ArrowRight className="w-4 h-4 text-cyan-300" />
            </button>
          </form>

          <div className="flex justify-between items-center text-xs text-gray-500 font-sans border-t border-white/5 pt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="hover:text-purple-300 cursor-pointer focus:outline-none"
            >
              {isLogin ? "Don't have a login? Create account" : 'Already have accounts? Sign-in'}
            </button>
            <button
              onClick={onNavigateHome}
              className="hover:text-purple-300 flex items-center gap-1 cursor-pointer focus:outline-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back Home</span>
            </button>
          </div>
        </div>

        {/* Quick Demo entry row (Fig 4 optimization) */}
        <div className="bg-[#070707] border border-white/5 p-6 rounded-2xl text-center space-y-3.5">
          <p className="text-xs text-gray-500 font-sans">
            Want to test-drive immediately? Choose a sandbox preset:
          </p>
          <div className="grid grid-cols-2 gap-3 justify-center">
            <button
              onClick={() => handleQuickDemo('seed')}
              className="bg-white/[0.02] border border-white/10 hover:border-purple-500/20 hover:bg-white/[0.04] text-white px-3 py-2.5 rounded-xl font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Seed Sprawl Mock
            </button>
            <button
              onClick={() => handleQuickDemo('seriesA')}
              className="bg-white/[0.02] border border-white/10 hover:border-cyan-500/20 hover:bg-white/[0.04] text-white px-3 py-2.5 rounded-xl font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Series A Heavy
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
