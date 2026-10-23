import React from 'react';
import { Terminal, Shield, LogOut, RefreshCw, HelpCircle, Award } from 'lucide-react';

export default function Navbar({
  teamData,
  totalScore,
  isPortalFrozen,
  onRefresh,
  refreshing,
  onOpenRules,
  onLogout,
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#080c14]/90 backdrop-blur-lg border-b border-slate-800/90 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Branding & Team */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-sm shadow-cyan-950">
            <Terminal className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-mono font-bold text-xs sm:text-base tracking-wider text-white truncate">
                THE 33RD CYCLE
              </span>
              <span className="hidden md:inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                NISB
              </span>
            </div>

            {/* Subtitle / Status / Mobile Team Label */}
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono">
              {/* On mobile: display active team code */}
              <span className="sm:hidden text-cyan-400 font-bold truncate max-w-[90px]">
                {teamData?.identifier || teamData?.teamCode}
              </span>
              <span className="sm:hidden text-slate-600">•</span>

              {isPortalFrozen ? (
                <span className="text-rose-400 font-semibold tracking-wide flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                  <span className="hidden xs:inline">FROZEN</span>
                  <span className="xs:hidden">LOCKED</span>
                </span>
              ) : (
                <span className="text-emerald-400 font-medium tracking-wide flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="hidden sm:inline">ENGINE ACTIVE</span>
                  <span className="sm:hidden text-emerald-400/90">ONLINE</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Score & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Desktop Team Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-xs">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300 font-bold">{teamData?.identifier || teamData?.teamCode}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 truncate max-w-[100px]">{teamData?.displayName || teamData?.teamName}</span>
          </div>

          {/* Glowing Total Score Badge */}
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-gradient-to-r from-cyan-950/80 to-slate-900 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs sm:text-sm shadow-sm shadow-cyan-950/40">
            <Award className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{totalScore} <span className="text-[10px] font-normal text-cyan-400/80">PTS</span></span>
          </div>

          {/* Quick Refresh */}
          <button
            onClick={onRefresh}
            disabled={refreshing}
            title="Refresh Progress"
            className="p-1.5 sm:p-2 rounded-lg bg-slate-900/80 active:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Rules / Guide */}
          <button
            onClick={onOpenRules}
            title="Rules & Guidelines"
            className="p-1.5 sm:p-2 rounded-lg bg-slate-900/80 active:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            title="Logout"
            className="p-1.5 sm:p-2 rounded-lg bg-slate-900/80 active:bg-rose-950/60 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
