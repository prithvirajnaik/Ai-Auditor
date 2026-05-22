import React, { useState } from 'react';
import { Mail, Briefcase, Sparkles, X, CheckCircle, Loader2 } from 'lucide-react';

interface LeadCaptureFormProps {
  auditId: string;
  companyName: string;
  teamSize: number;
  onClose: () => void;
}

export default function LeadCaptureForm({
  auditId,
  companyName,
  teamSize,
  onClose
}: LeadCaptureFormProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Founder / Exec');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot field
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          company_name: companyName,
          role,
          team_size: teamSize,
          audit_id: auditId,
          honeypot: honeypot.trim() // Honeypot field for bot filtering
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit lead.');
      }

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#090909] border border-white/10 rounded-2xl p-6 shadow-[0_0_50px_rgba(109,40,217,0.15)] overflow-hidden">
        
        {/* Decorative corner glows */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-purple-500/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-cyan-500/10 rounded-full blur-xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer focus:outline-none"
        >
          <X className="w-4 h-4" />
        </button>

        {success ? (
          /* Success view */
          <div className="text-center py-8 space-y-4 animate-scale-in">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <CheckCircle className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white tracking-tight">Audit Report Dispatched!</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                We've stored your credentials safely and sent an executive PDF dashboard preview directly to <span className="text-purple-300 font-medium font-mono">{email}</span>.
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-4 px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-xs font-mono font-bold tracking-wider uppercase cursor-pointer"
            >
              Continue to Console
            </button>
          </div>
        ) : (
          /* Capture Form view */
          <div className="space-y-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1 bg-purple-950/40 border border-purple-500/30 text-purple-300 px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-widest font-black">
                <Sparkles className="w-2.5 h-2.5" /> LOCK IN SAVINGS
              </div>
              <h3 className="text-lg font-extrabold text-white tracking-tight">
                Download Detailed Spend Audit
              </h3>
              <p className="text-xs text-gray-400 leading-normal">
                Submit your corporate email to receive a structured PDF breakdown and lock in savings for {companyName}.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-950/20 border border-rose-500/15 rounded-lg text-xs text-rose-400 font-mono">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* HONEYPOT SPAM PROTECTION FIELD (Hidden from normal users) */}
              <input
                type="text"
                name="honeypot"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="absolute w-0 h-0 p-0 border-0 opacity-0 -z-50 pointer-events-none"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block">
                  Your Role
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="Founder / Exec">Founder / Executive</option>
                    <option value="Finance / CFO">Finance / CFO</option>
                    <option value="Engineering Lead">Engineering Lead</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="Operations / IT">Operations / IT</option>
                    <option value="Other">Other Role</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-white hover:bg-gray-100 text-black text-xs font-mono font-black uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Dispatched...
                    </>
                  ) : (
                    <>
                      Generate PDF Report
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
