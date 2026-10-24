import React, { useState } from 'react';
import { Shield, KeyRound, ArrowRight, AlertCircle, FileText, Lock, Radio } from 'lucide-react';
import { api, setAuthSession } from '../services/api';
import { playKeyClick, playRelayClick, playSuccessChime, playErrorBuzz } from '../services/soundFx';

const QUICK_TEAMS = [
  'TEAM_01', 'TEAM_02', 'TEAM_03', 'TEAM_04', 'TEAM_05',
  'TEAM_06', 'TEAM_07', 'TEAM_08', 'TEAM_09', 'TEAM_10',
];

export default function LoginPage({ onLoginSuccess }) {
  const [teamCode, setTeamCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTeamCodeChange = (e) => {
    playKeyClick();
    setTeamCode(e.target.value.toUpperCase());
  };

  const handlePasswordChange = (e) => {
    playKeyClick();
    setPassword(e.target.value);
  };

  const handleQuickSelect = (code) => {
    playKeyClick();
    setTeamCode(code);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamCode.trim() || !password) {
      setError('Please provide both Team Code and Password.');
      playErrorBuzz();
      return;
    }

    playRelayClick();
    setLoading(true);
    setError('');

    try {
      const data = await api.teamLogin(teamCode, password);
      playSuccessChime();
      setAuthSession(data.token, data);
      onLoginSuccess(data);
    } catch (err) {
      playErrorBuzz();
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen chronos-grid flex items-center justify-center p-3 sm:p-4 relative overflow-hidden bg-[#0d0f14]">
      {/* Background Poster Ambience (Noir Vignette Layer) */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none scale-105 filter blur-sm"
        style={{ backgroundImage: `url('/poster.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f14] via-[#0d0f14]/85 to-[#0d0f14]/90 pointer-events-none" />

      {/* Retro Surveillance Top HUD */}
      <div className="absolute top-3 left-3 sm:top-5 sm:left-6 flex items-center gap-2 text-[10px] sm:text-xs font-mono text-amber-500/60 z-20">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="tracking-widest">FEED 01 • NISB TEMPORAL ARCHIVES</span>
      </div>

      <div className="w-full max-w-md z-10 my-auto py-6">
        {/* Header Badge with Official NISB Logo */}
        <div className="text-center mb-5 sm:mb-7">
          <div className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-[#141720]/90 border border-[#282d3b] mb-3 shadow-xl backdrop-blur-md">
            <img
              src="/nisb-logo-white.png"
              alt="NISB Logo"
              className="h-10 sm:h-12 w-auto object-contain drop-shadow"
            />
          </div>
          <div className="text-[10px] sm:text-xs font-mono tracking-widest uppercase text-amber-400 mb-1 flex items-center justify-center gap-1.5">
            <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>NISB • INVESTIGATION DOSSIER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#dbd4cb] font-mono">
            THE 33RD CYCLE
          </h1>
          <p className="text-[11px] sm:text-xs text-[#8b92a2] tracking-wider uppercase font-mono mt-1">
            Physical Evidence Anomaly Portal
          </p>
        </div>

        {/* Classified Terminal Container */}
        <div className="bg-[#141720]/95 backdrop-blur-xl border border-[#282d3b] rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
          {/* Top Brass Clip Accent */}
          <div className="absolute top-0 right-8 w-4 h-9 pointer-events-none z-20">
            <svg viewBox="0 0 16 36" fill="none" className="w-full h-full drop-shadow">
              <path
                d="M5 2C2.79086 2 1 3.79086 1 6V28C1 31.866 4.13401 35 8 35C11.866 35 15 31.866 15 28V9C15 6.23858 12.7614 4 10 4C7.23858 4 5 6.23858 5 9V26C5 27.6569 6.34315 29 8 29C9.65685 29 11 27.6569 11 26V10"
                stroke="#d97706"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Rubber Stamp Watermark */}
          <div className="absolute right-4 top-14 pointer-events-none select-none opacity-10 rotate-[-15deg] z-0">
            <div className="border-4 border-amber-500 text-amber-400 font-mono font-black text-2xl tracking-widest px-3 py-1 uppercase rounded-md border-dashed">
              EVIDENCE DESK
            </div>
          </div>

          {/* Top amber accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/50 border border-rose-500/50 text-rose-300 text-xs flex items-start gap-2.5 font-mono animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div>
              <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#dbd4cb] mb-1.5">
                Team Code Identifier
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Shield className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={teamCode}
                  onChange={handleTeamCodeChange}
                  placeholder="e.g. TEAM_01"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="characters"
                  spellCheck="false"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0b0d12] border border-[#282d3b] rounded-lg text-[#dbd4cb] placeholder-[#575e6d] font-mono text-base sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors uppercase"
                  required
                />
              </div>

              {/* Quick Select Chips */}
              <div className="mt-2 flex flex-wrap gap-1 items-center">
                <span className="text-[10px] text-slate-500 font-mono mr-1">Quick:</span>
                {QUICK_TEAMS.slice(0, 6).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleQuickSelect(code)}
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
                <span className="text-[10px] font-mono text-amber-400/90 flex items-center gap-1 font-semibold">
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
                  onChange={handlePasswordChange}
                  placeholder="Choose or enter your team password"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0b0d12] border border-[#282d3b] rounded-lg text-[#dbd4cb] placeholder-[#575e6d] font-mono text-base sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  required
                />
              </div>
              <p className="mt-1.5 text-[10px] text-[#8b92a2] font-mono leading-normal">
                First login binds your team password permanently. Memorize it for subsequent logins.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 active:scale-98 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase rounded-lg shadow-lg shadow-amber-950/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to Evidence Engine...</span>
                </>
              ) : (
                <>
                  <span>INITIALIZE EVIDENCE DESK</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Physical Envelope Directive Notice */}
          <div className="mt-5 pt-4 border-t border-[#282d3b] text-center">
            <p className="text-[10px] sm:text-[11px] text-[#8b92a2] font-mono flex items-center justify-center gap-1.5 leading-relaxed">
              <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Questions are in physical dossiers. Use this portal for answer verification.</span>
            </p>
          </div>

          {/* Barcode Footer Accent */}
          <div className="mt-3 pt-2 border-t border-[#282d3b]/50 flex items-center justify-between text-[9px] font-mono text-slate-600 select-none">
            <span>||| | |||| | || |||||</span>
            <span>CHRONOS ARCHIVES // 2026</span>
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
