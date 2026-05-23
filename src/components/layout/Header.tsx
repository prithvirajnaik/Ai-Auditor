import React from 'react';

interface HeaderProps {
  currentUser: string | null;
  activePage: string;
  setActivePage: (page: string) => void;
  onNavigateHome: () => void;
}

export default function Header({ currentUser, activePage, setActivePage, onNavigateHome }: HeaderProps) {
  // If we are on dashboard pages, the sidebar handles it, so we don't render this public header
  const isDashboardPage = [
    'results-dashboard',
    'analytics',
    'shareable-report',
    'settings'
  ].includes(activePage);

  if (isDashboardPage) return null;

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 py-4 px-6 sm:px-12 flex items-center justify-between">
      <div
        onClick={onNavigateHome}
        className="flex items-center gap-2.5 cursor-pointer focus:outline-none"
      >
        <span className="text-2xl animate-pulse">🧠</span>
        <span className="text-xl font-black tracking-tighter text-white">Auto Audit</span>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-400">
        <button
          onClick={onNavigateHome}
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
          onClick={onNavigateHome}
        >
          Succeed Stories
        </a>
        <a
          href="#faq"
          className="hover:text-white transition-colors focus:outline-none"
          onClick={onNavigateHome}
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
            onClick={() => setActivePage('login')}
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
  );
}
