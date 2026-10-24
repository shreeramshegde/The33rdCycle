import React, { useState } from 'react';
import { Shield, KeyRound, ArrowRight, AlertCircle, FileText, Lock } from 'lucide-react';
import { api, setAuthSession } from '../services/api';

const QUICK_TEAMS = [
  'TEAM_01', 'TEAM_02', 'TEAM_03', 'TEAM_04', 'TEAM_05',
  'TEAM_06', 'TEAM_07', 'TEAM_08', 'TEAM_09', 'TEAM_10',
];

export default function LoginPage({ onLoginSuccess }) {
  const [teamCode, setTeamCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamCode.trim() || !password) {
      setError('Please provide both Team Code and Password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await api.teamLogin(teamCode, password);
      setAuthSession(data.token, data);
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen chronos-grid flex items-center justify-center p-3 sm:p-4 relative overflow-hidden bg-[#0d0f14]">
      {/* Ambient background noir glows */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-[#a65043]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10 my-auto">
        {/* Header Badge with Official NISB Logo */}
        <div className="text-center mb-5 sm:mb-7">
          <div className="inline-flex items-center justify-center p-2 rounded-xl bg-[#141720] border border-[#282d3b] mb-3 shadow-md">
            <img
              src="/nisb-logo-white.png"
              alt="NISB Logo"
              className="h-9 sm:h-11 w-auto object-contain"
            />
          </div>
          <div className="text-[10px] sm:text-xs font-mono tracking-widest uppercase text-amber-400 mb-1">
            NISB • INVESTIGATION DOSSIER
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#dbd4cb] font-mono">
            THE 33RD CYCLE
          </h1>
          <p className="text-[11px] sm:text-xs text-[#8b92a2] tracking-wider uppercase font-mono mt-1">
            Anomaly Submission Engine
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-[#141720]/95 backdrop-blur-xl border border-[#282d3b] rounded-2xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Top border amber accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

          {error && (
            <div className="mb-4 sm:mb-5 p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 font-mono">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#dbd4cb] mb-1.5">
                Team Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Shield className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                  placeholder="e.g. TEAM_01"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="characters"
                  spellCheck="false"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0b0d12] border border-[#282d3b] rounded-lg text-[#dbd4cb] placeholder-[#575e6d] font-mono text-base sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors uppercase"
                  required
                />
              </div>

              {/* Quick Select Chips - Sets only Team Code, never pre-fills password */}
              <div className="mt-2 flex flex-wrap gap-1 items-center">
                <span className="text-[10px] text-slate-500 font-mono mr-1">Quick:</span>
                {QUICK_TEAMS.slice(0, 6).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setTeamCode(code)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1b1f2b] border border-[#282d3b] text-[#9ba4b4] hover:text-amber-300 hover:border-amber-500/50 active:bg-[#252b3b] transition-colors cursor-pointer"
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#dbd4cb]">
                  Access Password
                </label>
                <span className="text-[10px] font-mono text-amber-400/90 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Set on 1st login
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose or enter your team password"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0b0d12] border border-[#282d3b] rounded-lg text-[#dbd4cb] placeholder-[#575e6d] font-mono text-base sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  required
                />
              </div>
              <p className="mt-1.5 text-[10px] text-[#8b92a2] font-mono leading-normal">
                First login sets your team's permanent password. Remember it for subsequent logins.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 active:scale-98 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase rounded-lg shadow-lg shadow-amber-950/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Accessing Dossier...</span>
                </>
              ) : (
                <>
                  <span>ENTER INVESTIGATION PORTAL</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Envelope Notice */}
          <div className="mt-5 pt-4 border-t border-[#282d3b] text-center">
            <p className="text-[10px] sm:text-[11px] text-[#8b92a2] font-mono flex items-center justify-center gap-1.5 leading-relaxed">
              <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Questions are in physical dossiers. Use this portal for answer verification.</span>
            </p>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="text-center mt-5 text-slate-600 text-[10px] sm:text-[11px] font-mono">
          <span>NISB © 2026 • The 33rd Cycle</span>
        </div>
      </div>
    </div>
  );
}
