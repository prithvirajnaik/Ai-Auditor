/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Brain, Coins, TrendingUp, Check } from 'lucide-react';
import { FAQS, TESTIMONIALS } from '../../data/mockData';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onSelectDemoReport: () => void;
}

export default function LandingPage({ onNavigate, onSelectDemoReport }: LandingPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [quickAuditInput, setQuickAuditInput] = useState('');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('audit-form');
  };

  return (
    <div className="bg-black text-[#e5e2e1] min-h-screen selection:bg-purple-500/30 selection:text-white">
      {/* Background glow meshes */}
      <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none -translate-x-1/2"></div>
      <div className="absolute top-[35%] right-[10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-950/40 backdrop-blur-md rounded-full border border-purple-500/20 mb-8 shadow-[0_0_15px_rgba(139,92,246,0.15)] animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="font-mono text-xs uppercase tracking-wider text-purple-300">Auto Audit MVP 1.0</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-extrabold tracking-tighter leading-tight max-w-4xl mx-auto">
          Prune AI Spend Overlap <span className="bg-gradient-to-r from-purple-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent">Dynamically</span>
        </h1>

        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mt-6 font-sans leading-relaxed">
          Instantly evaluate duplicate user seats across Cursor, Windsurf, ChatGPT, and Copilot. Clean, metadata-level financial audit for modern teams.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 w-full max-w-md mx-auto">
          <button
            onClick={() => onNavigate('audit-form')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer font-sans"
          >
            Run Stack Audit
            <Sparkles className="w-4 h-4 text-cyan-200" />
          </button>
          <button
            onClick={onSelectDemoReport}
            className="bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-sm border border-white/10 text-white px-8 py-4 rounded-xl font-bold transition-all cursor-pointer font-sans"
          >
            See Demo Report
          </button>
        </div>

        {/* Hero Preview Section */}
        <div className="mt-16 w-full max-w-4xl relative">
          <div className="p-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-2xl">
            <div className="bg-[#090909] rounded-2xl overflow-hidden p-6 sm:p-8 flex flex-col lg:flex-row gap-8 text-left border border-white/5">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <Brain className="w-4 h-4 text-purple-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Audit Metrics</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">ESTIMATED WASTE</p>
                    <p className="text-xl sm:text-2xl font-bold text-rose-400 mt-1 font-mono tracking-tight">$4,200/yr</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">POTENTIAL SAVINGS</p>
                    <p className="text-xl sm:text-2xl font-bold text-cyan-400 mt-1 font-mono tracking-tight">$350/mo</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 w-2/3"></div>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-gray-500">
                    <span>Unoptimized Stack</span>
                    <span className="text-white">Deduplication: Available</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 relative flex items-center justify-center min-h-[160px]">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                <img
                  className="rounded-xl border border-white/5 shadow-2xl w-full h-[180px] object-cover brightness-[0.8] contrast-[1.05]"
                  alt="Neon dashboard graphics of modern metrics"
                  referrerPolicy="no-referrer"
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Startup Badges */}
      <section className="py-12 border-y border-white/5 bg-[#050505]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-mono text-[11px] text-purple-400 uppercase tracking-widest text-center md:text-left">DEDUPING PLATFORMS ACROSS THE ECOSYSTEM</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-gray-500 font-bold tracking-tight text-base">
            <span className="hover:text-purple-400 transition-colors">TechCrunch</span>
            <span className="hover:text-purple-400 transition-colors">Y Combinator</span>
            <span className="hover:text-purple-400 transition-colors">Product Hunt</span>
            <span className="hover:text-purple-400 transition-colors">Wired</span>
          </div>
        </div>
      </section>

      {/* Input section of workspace url */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-[#070707] border border-white/5 p-8 sm:p-10 rounded-2xl text-center space-y-8 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <div className="max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">Run Your First Audit</h2>
            <p className="text-gray-400 text-xs">
              Calculate overlap of Cursor, Windsurf, Claude, ChatGPT, Gemini, OpenAI and Anthropic API. Provide domain name on the next screen to start.
            </p>
          </div>

          <form onSubmit={handleQuickSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-black border border-white/10 focus-within:border-purple-500 transition-colors rounded-xl px-4 py-1 flex items-center">
              <span className="text-gray-500 font-mono text-xs mr-1">https://</span>
              <input
                required
                type="text"
                placeholder="domain.com"
                value={quickAuditInput}
                onChange={(e) => setQuickAuditInput(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-white placeholder-gray-600 font-sans w-full py-2.5 focus:outline-none text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] text-white px-6 py-3 rounded-xl font-bold transition-all cursor-pointer font-sans text-sm"
            >
              Analyze Stack
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="p-5 bg-white/[0.01] border border-white/5 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-300">
                  <Coins className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-mono tracking-widest text-purple-400 uppercase font-bold">RECLAIM COMPUTE EXPENSE</h4>
              </div>
              <p className="text-xs text-gray-500 leading-normal">
                Pruning double-billing patterns usually unlocks up to 35% in direct tooling capital reclamation.
              </p>
            </div>

            <div className="p-5 bg-white/[0.01] border border-white/5 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-300">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-bold">DEDUP LIBRARIES</h4>
              </div>
              <p className="text-xs text-gray-500 leading-normal">
                Determine if developers use multiple competing IDEs concurrently on different cards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-[#040404]/80 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">Believable Startup Governance</h2>
            <p className="text-gray-400 max-w-lg mx-auto text-xs">Modern teams trimming AI seat overhead while keeping development pacing lightning fast.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="bg-[#090909]/40 border border-white/5 p-6 rounded-xl text-left flex flex-col justify-between hover:border-purple-500/10 transition-colors">
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 mt-4">
                  <img
                    className="w-8 h-8 rounded-full border border-white/10 object-cover"
                    src={t.avatar}
                    alt={t.author}
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h5 className="font-bold text-white text-xs">{t.author}</h5>
                    <p className="text-[9px] text-gray-500 font-mono uppercase">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-center mb-8 font-sans">Common Questions</h2>
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpened = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-[#090909] border border-white/5 rounded-xl p-4 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpened ? null : idx)}
                  className="w-full flex justify-between items-center text-left font-bold text-white text-sm cursor-pointer focus:outline-none"
                >
                  <span>{faq.question}</span>
                  <span className="w-5 h-5 rounded bg-white/5 flex items-center justify-center text-gray-400 text-xs">
                    {isOpened ? '−' : '+'}
                  </span>
                </button>
                {isOpened && (
                  <p className="mt-3 text-xs text-gray-400 leading-relaxed pl-1">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
