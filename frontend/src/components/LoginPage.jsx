import React, { useState } from 'react';
import { Shield, KeyRound, ArrowRight, Terminal, AlertCircle, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen chronos-grid flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      {/* Ambient background glow circles */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10 my-auto">
        {/* Terminal Header Badge */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-[10px] sm:text-xs font-mono tracking-wider uppercase mb-3 shadow-sm shadow-cyan-950">
            <Terminal className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>NISB // IEEE CORE SELECTION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5 font-mono">
            THE 33RD CYCLE
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 tracking-wider uppercase font-mono">
            CHRONOS Submission Portal
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-[#0b0f19]/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Top border accent light */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

          {error && (
            <div className="mb-4 sm:mb-6 p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 font-mono animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
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
                  className="w-full pl-10 pr-4 py-2.5 sm:py-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 font-mono text-base sm:text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors uppercase"
                  required
                />
              </div>

              {/* Quick Select Chips */}
              <div className="mt-2 flex flex-wrap gap-1 items-center">
                <span className="text-[10px] text-slate-500 font-mono mr-1">Quick:</span>
                {QUICK_TEAMS.slice(0, 5).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setTeamCode(code);
                      setPassword('team123');
                    }}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 active:bg-slate-800 transition-colors cursor-pointer"
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Access Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 font-mono text-base sm:text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 active:scale-98 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase rounded-lg shadow-lg shadow-cyan-950/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <span>INITIALIZE PORTAL</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Envelope Notice */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono flex items-center justify-center gap-1.5 leading-relaxed">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
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
