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
    <header className="sticky top-0 z-40 bg-[#090d16]/85 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-sm shadow-cyan-950">
            <Terminal className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm sm:text-base tracking-wider text-white truncate">
                THE 33RD CYCLE
              </span>
              <span className="hidden md:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                NISB IEEE
              </span>
            </div>
            {/* Live Operational Status */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              {isPortalFrozen ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                  <span className="text-rose-400 font-semibold tracking-wide">
                    SYSTEM FROZEN (SUBMISSIONS LOCKED)
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-emerald-400 font-medium tracking-wide">
                    CHRONOS ENGINE ACTIVE
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Team Profile, Score & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Team Identifier */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-xs">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300 font-bold">{teamData?.identifier || teamData?.teamCode}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 truncate max-w-[120px]">{teamData?.displayName || teamData?.teamName}</span>
          </div>

          {/* Glowing Total Score Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-950/70 to-slate-900 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs sm:text-sm shadow-md shadow-cyan-950/40">
            <Award className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{totalScore} PTS</span>
          </div>

          {/* Quick Refresh Progress */}
          <button
            onClick={onRefresh}
            disabled={refreshing}
            title="Refresh Checkpoint Status"
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-300 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Event Rules Modal */}
          <button
            onClick={onOpenRules}
            title="Investigation Rules & Scoring"
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            title="Logout Session"
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
