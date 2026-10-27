import React, { useState } from 'react';
import { Shield, KeyRound, ArrowRight, AlertCircle, FileText, Lock, Radio, Settings, UserCheck } from 'lucide-react';
import { api, setAuthSession } from '../services/api';
import { playKeyClick, playRelayClick, playSuccessChime, playErrorBuzz } from '../services/soundFx';

const QUICK_TEAMS = [
  'TEAM_01', 'TEAM_02', 'TEAM_03', 'TEAM_04', 'TEAM_05',
  'TEAM_06', 'TEAM_07', 'TEAM_08', 'TEAM_09', 'TEAM_10',
];

export default function LoginPage({ onLoginSuccess }) {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [teamCode, setTeamCode] = useState('');
  const [password, setPassword] = useState('');
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('');
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

  const handleTeamSubmit = async (e) => {
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

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (!adminUsername.trim() || !adminPassword) {
      setError('Please provide Admin Username and Password.');
      playErrorBuzz();
      return;
    }

    playRelayClick();
    setLoading(true);
    setError('');

    try {
      const data = await api.adminLogin(adminUsername, adminPassword);
      playSuccessChime();
      setAuthSession(data.token, data);
      onLoginSuccess(data);
    } catch (err) {
      playErrorBuzz();
      setError(err.message || 'Admin authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen chronos-grid flex items-center justify-center p-3 sm:p-4 relative overflow-hidden bg-[#0d0f14]">
      {/* Desktop Landscape Background Video (Plays cleanly on landscape/laptop screens) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/archive-room.png"
        className="hidden md:block absolute inset-0 w-full h-full object-cover filter brightness-[0.75] pointer-events-none"
      >
        <source src="/archive-feed.mp4" type="video/mp4" />
      </video>

      {/* Desktop Layered noir gradients: preserves room details at edges while keeping center login card perfectly readable */}
      <div className="hidden md:block absolute inset-0 bg-[#0d0f14]/40 pointer-events-none" />
      <div className="hidden md:block absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,15,20,0.65)_0%,rgba(13,15,20,0.92)_100%)] pointer-events-none" />

      {/* Mobile Portrait Atmosphere: Ambient warm amber top spotlight & clean noir gradient */}
      <div className="md:hidden absolute inset-0 bg-[#0d0f14] bg-[radial-gradient(circle_at_top,rgba(217,119,6,0.14)_0%,transparent_65%)] pointer-events-none" />

      <div className="w-full max-w-md z-10 my-auto py-3 sm:py-6">
        {/* Header Badge with Official NISB Logo (First thing visible on both Mobile and Desktop) */}
        <div className="text-center mb-5 sm:mb-7">
          <div className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-[#141720]/90 border border-[#282d3b] mb-3 shadow-xl backdrop-blur-md">
            <img
              src="/nisb-logo-white.png"
              alt="NISB Logo"
              className="h-10 sm:h-12 w-auto object-contain drop-shadow"
            />
          </div>
          <div className="text-xs font-bold tracking-wider uppercase text-amber-400 mb-1 flex items-center justify-center gap-1.5 font-dossier">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>NISB • INVESTIGATION DOSSIER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-[#dbd4cb] font-dossier">
            THE 33RD CYCLE
          </h1>
          <p className="text-xs text-[#8b92a2] tracking-widest uppercase mt-1 font-semibold font-dossier">
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
            <div className="border-4 border-amber-500 text-amber-400 font-dossier font-black text-2xl tracking-[0.25em] px-3 py-1 uppercase rounded-md border-dashed">
              EVIDENCE DESK
            </div>
          </div>

          {/* Top amber accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/50 border border-rose-500/50 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Mode Switcher: Participant Team vs Admin Control */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-[#0b0d12] border border-[#282d3b] mb-4 relative z-10">
            <button
              type="button"
              onClick={() => {
                playKeyClick();
                setIsAdminMode(false);
                setError('');
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider font-dossier flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                !isAdminMode
                  ? 'bg-[#1b1f2b] text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-[#8b92a2] hover:text-[#dbd4cb]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Team Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playKeyClick();
                setIsAdminMode(true);
                setError('');
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider font-dossier flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isAdminMode
                  ? 'bg-rose-950/60 text-rose-300 border border-rose-500/50 shadow-sm'
                  : 'text-[#8b92a2] hover:text-[#dbd4cb]'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin Control</span>
            </button>
          </div>

          {!isAdminMode ? (
            <form onSubmit={handleTeamSubmit} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#dbd4cb] mb-1.5 font-dossier">
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
                  <span className="text-[10px] text-slate-500 font-medium mr-1">Quick:</span>
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
                <div className="flex items-center justify-between mb-1.5 font-dossier">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#dbd4cb]">
                    Access Password
                  </label>
                  <span className="text-[11px] text-amber-400/90 flex items-center gap-1 font-semibold">
                    <Lock className="w-3 h-3" /> SET ON 1ST LOGIN
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
                <p className="mt-1.5 text-xs text-[#8b92a2] leading-normal">
                  First login binds your team password permanently. Memorize it for subsequent logins.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 active:scale-98 text-slate-950 font-dossier font-bold text-sm tracking-widest uppercase rounded-lg shadow-lg shadow-amber-950/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
          ) : (
            <form onSubmit={handleAdminSubmit} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#dbd4cb] mb-1.5 font-dossier">
                  Administrator Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => {
                      playKeyClick();
                      setAdminUsername(e.target.value);
                    }}
                    placeholder="e.g. admin"
                    autoComplete="username"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0b0d12] border border-[#282d3b] rounded-lg text-[#dbd4cb] placeholder-[#575e6d] font-mono text-base sm:text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#dbd4cb] mb-1.5 font-dossier">
                  Administrator Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => {
                      playKeyClick();
                      setAdminPassword(e.target.value);
                    }}
                    placeholder="Enter IEEE admin password"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0b0d12] border border-[#282d3b] rounded-lg text-[#dbd4cb] placeholder-[#575e6d] font-mono text-base sm:text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                    required
                  />
                </div>
                <p className="mt-1.5 text-xs text-[#8b92a2] leading-normal">
                  Restricted to NISB Core Organizers. Manages official hints and score deductions.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 hover:from-rose-600 hover:to-rose-500 active:scale-98 text-white font-dossier font-bold text-sm tracking-widest uppercase rounded-lg shadow-lg shadow-rose-950/60 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating Control Key...</span>
                  </>
                ) : (
                  <>
                    <span>ACCESS HINT CONTROL DESK</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Physical Envelope Directive Notice */}
          <div className="mt-5 pt-4 border-t border-[#282d3b] text-center">
            <p className="text-xs text-[#8b92a2] flex items-center justify-center gap-1.5 leading-relaxed">
              <FileText className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {isAdminMode
                  ? 'IEEE NISB Control Panel • Official hint dispatch & penalty desk.'
                  : 'Questions are in physical dossiers. Use this portal for answer verification.'}
              </span>
            </p>
          </div>

          {/* Barcode Footer Accent */}
          <div className="mt-3 pt-2 border-t border-[#282d3b]/50 flex items-center justify-between text-[10px] font-mono text-slate-600 select-none">
            <span>||| | |||| | || |||||</span>
            <span className="tracking-widest">CHRONOS ARCHIVES • 2026</span>
          </div>
        </div>

        {/* Mobile-Only 16:9 Landscape Surveillance Feed Monitor at the Bottom */}
        {/* Placed below the login card so the official logo and credentials are the primary focal point */}
        <div className="md:hidden mt-4 rounded-xl overflow-hidden border border-[#282d3b] bg-black shadow-2xl relative aspect-video">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/archive-room.png"
            className="w-full h-full object-cover"
          >
            <source src="/archive-feed.mp4" type="video/mp4" />
          </video>
          {/* Subtle CRT scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.30)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />
          {/* Top Live Badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/75 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10 font-dossier text-[10px] text-amber-300 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span>CAM-03 • LIVE ARCHIVE FEED</span>
          </div>
          <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-[#dbd4cb]/80 bg-black/60 px-1.5 py-0.5 rounded">
            SIGNAL: 99.4%
          </div>
        </div>

        {/* Footer Credit */}
        <div className="text-center mt-4 text-slate-600 text-xs">
          <span>NISB © 2026 • The 33rd Cycle</span>
        </div>
      </div>

      {/* Desktop Ambient NISB Watermark Bug (Anchored on bottom-right over video watermark) */}
      <div className="hidden md:flex absolute bottom-5 right-6 z-10 items-center gap-2.5 pointer-events-none select-none">
        <div className="w-8 h-8 rounded-full bg-black/70 border border-white/20 backdrop-blur-md p-1.5 shadow-xl flex items-center justify-center">
          <img
            src="/nisb-logo-white.png"
            alt="NISB"
            className="w-full h-full object-contain filter drop-shadow blur-[0.2px] opacity-90"
          />
        </div>
        <span className="font-dossier text-xs text-amber-400/80 tracking-widest font-bold uppercase drop-shadow">
          NISB ARCHIVES
        </span>
      </div>
    </div>
  );
}
