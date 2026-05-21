/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  LayoutGrid,
  BarChart3,
  Share2,
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  ShieldAlert,
  Sliders,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import { AuditReport } from './types';
import { DEFAULT_MOCK_REPORT } from './data/mockData';
import LandingPage from './components/landing/LandingPage';
import AuditForm from './components/audit/AuditForm';
import Dashboard from './components/dashboard/Dashboard';
import ShareableReport from './components/dashboard/ShareableReport';
import Analytics from './components/dashboard/Analytics';
import Settings from './components/Settings';
import AuthPages from './components/AuthPages';

export default function App() {
  const [activePage, setActivePage] = useState<string>('landing');
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [report, setReport] = useState<AuditReport>(DEFAULT_MOCK_REPORT);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-scroll to top on screen transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
    setMobileMenuOpen(false);
  }, [activePage]);

  const handleLoginCompleted = (email: string) => {
    setCurrentUser(email);
    setActivePage('results-dashboard');
  };

  const handleAuditCompleted = (newReport: AuditReport) => {
    setReport(newReport);
    setActivePage('results-dashboard');
  };

  const handleSelectDemoReport = () => {
    setReport(DEFAULT_MOCK_REPORT);
    setActivePage('results-dashboard');
  };

  const logout = () => {
    setCurrentUser(null);
    setActivePage('landing');
  };

  // Helper determining whether to display the persistence sidebar
  const showDashboardSidebar = [
    'results-dashboard',
    'analytics',
    'shareable-report',
    'settings'
  ].includes(activePage);

  return (
    <div className="bg-black text-[#e5e2e1] min-h-screen flex flex-col font-sans select-none antialiased">
      
      {/* Top Header Row for Public Pages */}
      {!showDashboardSidebar && (
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 py-4 px-6 sm:px-12 flex items-center justify-between">
          <div
            onClick={() => setActivePage('landing')}
            className="flex items-center gap-2.5 cursor-pointer focus:outline-none"
          >
            <span className="text-2xl animate-pulse">🧠</span>
            <span className="text-xl font-black tracking-tighter text-white">Auto Audit</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-400">
            <button
              onClick={() => setActivePage('landing')}
              className="hover:text-white transition-colors cursor-pointer focus:outline-none"
            >
              Platform
            </button>
            <button
              onClick={() => setActivePage('audit-form')}
              className="hover:text-white transition-colors cursor-pointer focus:outline-none"
            >
              Analyze Stack
            </button>
            <a
              href="#testimonials"
              className="hover:text-white transition-colors focus:outline-none"
              onClick={() => setActivePage('landing')}
            >
              Succeed Stories
            </a>
            <a
              href="#faq"
              className="hover:text-white transition-colors focus:outline-none"
              onClick={() => setActivePage('landing')}
            >
              Technical FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <button
                onClick={() => setActivePage('results-dashboard')}
                className="bg-purple-950/40 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer focus:outline-none"
              >
                Go to Console
              </button>
            ) : (
              <button
                onClick={() => setActivePage('auth')}
                className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 border border-white/10 rounded-xl text-xs font-semibold transition-colors cursor-pointer focus:outline-none"
              >
                Access Portal
              </button>
            )}
            <button
              onClick={() => setActivePage('audit-form')}
              className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition-shadow cursor-pointer focus:outline-none"
            >
              Run Audit
            </button>
          </div>
        </header>
      )}

      {/* Main Screen Layout Container */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* Persistent Workspace Sidebar */}
        {showDashboardSidebar && (
          <aside className="w-full md:w-64 bg-[#070707] border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between flex-shrink-0 relative z-40">
            <div className="p-6 space-y-8">
              
              {/* Workspace Badge brand */}
              <div
                onClick={() => setActivePage('landing')}
                className="flex items-center gap-2.5 cursor-pointer focus:outline-none group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:border-purple-500/50 transition-colors">
                  <Brain className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm leading-tight">Auto Audit</h4>
                  <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Enterprise Mode</p>
                </div>
              </div>

              {/* Navigation lists */}
              <nav className="space-y-1.5">
                <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest pl-2 mb-2">Workspace</p>
                
                <button
                  onClick={() => setActivePage('results-dashboard')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer focus:outline-none ${
                    activePage === 'results-dashboard'
                      ? 'bg-purple-950/35 border border-purple-500/20 text-purple-300'
                      : 'text-gray-400 hover:bg-white/[0.02] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutGrid className="w-4 h-4" />
                    <span>Audit Scorecard</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-full font-bold">
                    -{Math.round((report.potentialMonthlySavings / report.currentSpendMonthly) * 100) || 35}%
                  </span>
                </button>

                <button
                  onClick={() => setActivePage('audit-form')}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-gray-400 hover:bg-white/[0.02] hover:text-white cursor-pointer focus:outline-none"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400 fill-cyan-400/10" />
                  <span>Update Stack</span>
                </button>

                <button
                  onClick={() => setActivePage('analytics')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer focus:outline-none ${
                    activePage === 'analytics'
                      ? 'bg-purple-950/35 border border-purple-500/20 text-purple-300'
                      : 'text-gray-400 hover:bg-white/[0.02] hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <span>Team Analytics</span>
                </button>

                <button
                  onClick={() => setActivePage('shareable-report')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer focus:outline-none ${
                    activePage === 'shareable-report'
                      ? 'bg-purple-950/35 border border-purple-500/20 text-purple-300'
                      : 'text-gray-400 hover:bg-white/[0.02] hover:text-white'
                  }`}
                >
                  <Share2 className="w-4 h-4 text-blue-400" />
                  <span>Shareable Links</span>
                </button>

                <button
                  onClick={() => setActivePage('settings')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer focus:outline-none ${
                    activePage === 'settings'
                      ? 'bg-purple-950/35 border border-purple-500/20 text-purple-300'
                      : 'text-gray-400 hover:bg-white/[0.02] hover:text-white'
                  }`}
                >
                  <SettingsIcon className="w-4 h-4 text-gray-400" />
                  <span>Preferences</span>
                </button>
              </nav>

              {/* Upgrade Promo Box representation */}
              <div className="bg-gradient-to-br from-purple-950/25 to-black border border-purple-500/20 rounded-xl p-4 space-y-3.5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full blur-xl pointer-events-none"></div>
                <div className="space-y-1">
                  <span className="text-[9px] text-cyan-300 font-mono uppercase tracking-widest font-black">STRIKE WASTE</span>
                  <h5 className="text-[11px] font-bold text-white tracking-tight">Auto Audit Pro Plan</h5>
                  <p className="text-[10px] text-gray-500 leading-normal">
                    Get crowdsourced contractor contract benches &amp; priority API optimizations.
                  </p>
                </div>
                <button
                  onClick={() => alert('Launching Secure Pro Billing upgrade...')}
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[9px] uppercase tracking-wider py-2 rounded-lg font-bold transition-all cursor-pointer"
                >
                  Upgrade Active Tier
                </button>
              </div>

            </div>

            {/* Bottom Footer block inside sidebar */}
            <div className="p-6 border-t border-white/5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-center font-bold text-xs text-cyan-300">
                  {currentUser ? currentUser.substring(0, 2).toUpperCase() : 'GS'}
                </div>
                <div className="leading-tight overflow-hidden text-ellipsis whitespace-nowrap flex-1">
                  <h5 className="font-bold text-white text-xs">{report.companyName}</h5>
                  <p className="text-[9px] text-gray-500 truncate">{currentUser || 'guest@autoaudit.ai'}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full flex items-center justify-between text-xs text-gray-500 hover:text-rose-400 px-3 py-2 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer focus:outline-none font-mono uppercase tracking-wider"
              >
                <span>Disconnect</span>
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </aside>
        )}

        {/* Dynamic Route Handler Page Rendering */}
        <main className="flex-1 overflow-x-hidden relative">
          {activePage === 'landing' && (
            <LandingPage
              onNavigate={setActivePage}
              onSelectDemoReport={handleSelectDemoReport}
            />
          )}

          {activePage === 'audit-form' && (
            <AuditForm
              onAuditCompleted={handleAuditCompleted}
              onNavigateHome={() => setActivePage('landing')}
            />
          )}

          {activePage === 'results-dashboard' && (
            <Dashboard
              report={report}
              onNavigate={setActivePage}
              onUpdateReport={setReport}
            />
          )}

          {activePage === 'shareable-report' && (
            <ShareableReport
              report={report}
              onNavigateBack={() => setActivePage('results-dashboard')}
            />
          )}

          {activePage === 'analytics' && (
            <Analytics
              report={report}
              onNavigateBack={() => setActivePage('results-dashboard')}
            />
          )}

          {activePage === 'settings' && (
            <Settings
              onNavigateBack={() => setActivePage('results-dashboard')}
            />
          )}

          {activePage === 'auth' && (
            <AuthPages
              onLoginCompleted={handleLoginCompleted}
              onNavigateHome={() => setActivePage('landing')}
            />
          )}
        </main>

      </div>
    </div>
  );
}
