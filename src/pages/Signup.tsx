import React, { useState } from 'react';
import { Mail, Lock, Briefcase, ArrowRight, ArrowLeft, Building2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface SignupProps {
  onSignupCompleted: () => void;
  onNavigateHome: () => void;
  onNavigateLogin: () => void;
}

export default function Signup({ onSignupCompleted, onNavigateHome, onNavigateLogin }: SignupProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    if (!email || !password || !companyName) {
      setErrorMsg('Corporate email, password, and company name are required.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Security password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      // Mock Signup Fallback
      console.log('[Supabase Auth Mock] Signing up as:', email);
      const mockUser = { id: 'mock-user-uuid', email };
      const mockProfile = { id: 'mock-user-uuid', company_name: companyName, role: role || 'Member' };
      localStorage.setItem(
        'autoaudit_mock_session',
        JSON.stringify({ user: mockUser, profile: mockProfile })
      );
      setLoading(false);
      onSignupCompleted();
      window.location.reload();
      return;
    }

    try {
      // 1. Sign up the user via Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      if (!data?.user) {
        throw new Error('Failed to retrieve user session during creation.');
      }

      // 2. Create the associated profile record linked via user.id
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: data.user.id,
          company_name: companyName.trim(),
          role: role.trim() || null,
        },
      ]);

      if (profileError) {
        throw profileError;
      }

      onSignupCompleted();
    } catch (err: any) {
      console.error('[Supabase Signup Error]:', err);
      let msg = err.message || 'Failed to establish corporate account.';
      if (msg.toLowerCase().includes('rate limit')) {
        msg = 'Signup rate limit exceeded (default is 3 signups/hour per IP). To bypass this for testing, please use the "Mock Sandbox Presets" on the Sign-in screen, or increase/disable Rate Limits in your Supabase Dashboard under Project Settings -> Auth -> Rate Limits.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#000000] text-[#e5e2e1] min-h-screen py-16 px-4 flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background neon glows */}
      <div className="absolute top-[30%] left-[30%] w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[30%] right-[30%] w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 relative z-10 animate-fade-in">
        {/* Branding header */}
        <div className="text-center space-y-3">
          <div
            className="inline-flex items-center gap-2 cursor-pointer focus:outline-none"
            onClick={onNavigateHome}
          >
            <span className="text-2xl">🧠</span>
            <span className="text-2xl font-extrabold tracking-tighter text-white">Auto Audit</span>
          </div>
          <p className="text-xs text-gray-500 font-mono tracking-widest uppercase">
            Establish Corporate SaaS Guardrails
          </p>
        </div>

        {/* Central Card */}
        <div className="bg-[#090909]/90 border border-white/5 p-8 rounded-3xl space-y-6 shadow-2xl relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-[80px]"></div>

          <h3 className="text-lg font-bold text-white text-center">Establish Account</h3>

          {errorMsg && (
            <div className="bg-rose-950/20 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs font-mono">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-3.5 w-4 h-4 text-gray-600" />
                <input
                  required
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Rockets Inc."
                  className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-700 focus:border-purple-500 focus:outline-none text-sm font-sans"
                />
              </div>
            </div>

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
              <label className="block text-xs font-semibold text-gray-500 mb-1">Security Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-600" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-700 focus:border-purple-500 focus:outline-none text-sm font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Corporate Role (Optional)</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-3.5 w-4 h-4 text-gray-600" />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Finance Director, VP Operations"
                  className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-700 focus:border-purple-500 focus:outline-none text-sm font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] text-white py-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all pt-4"
            >
              <span>{loading ? 'Creating Account...' : 'Provision Account'}</span>
              <ArrowRight className="w-4 h-4 text-cyan-300" />
            </button>
          </form>

          <div className="flex justify-between items-center text-xs text-gray-500 font-sans border-t border-white/5 pt-4">
            <button
              onClick={onNavigateLogin}
              className="hover:text-purple-300 cursor-pointer focus:outline-none text-left"
            >
              Already have account? Sign-in
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
      </div>
    </div>
  );
}
