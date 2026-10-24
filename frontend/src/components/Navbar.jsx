import React, { useState } from 'react';
import { Shield, LogOut, RefreshCw, HelpCircle, Award, Volume2, VolumeX } from 'lucide-react';
import { isSoundMuted, toggleSound, playRelayClick } from '../services/soundFx';

export default function Navbar({
  teamData,
  totalScore,
  isPortalFrozen,
  onRefresh,
  refreshing,
  onOpenRules,
  onLogout,
}) {
  const [muted, setMuted] = useState(isSoundMuted());

  const handleToggleSound = () => {
    const newState = toggleSound();
    setMuted(newState);
    if (!newState) playRelayClick();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#10131a]/95 backdrop-blur-md border-b border-[#282d3b] shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: NISB Logo & Event Title */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <div className="h-8 sm:h-9 px-2 rounded-lg bg-[#181c26] border border-[#2d3444] flex items-center justify-center shrink-0 shadow-sm">
            <img
              src="/nisb-logo-white.png"
              alt="NISB"
              className="h-5 sm:h-6 w-auto object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-mono font-bold text-xs sm:text-base tracking-wider text-[#dbd4cb] truncate">
                THE 33RD CYCLE
              </span>
              <span className="hidden md:inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1f2430] text-[#a4adbf] border border-[#2d3444]">
                NISB
              </span>
            </div>

            {/* Subtitle / Status / Mobile Team Label */}
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono">
              {/* On mobile: display active team code */}
              <span className="sm:hidden text-amber-400 font-bold truncate max-w-[95px]">
                {teamData?.identifier || teamData?.teamCode}
              </span>
              <span className="sm:hidden text-slate-600">•</span>

              {isPortalFrozen ? (
                <span className="text-rose-400 font-semibold tracking-wide flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                  <span className="hidden xs:inline">PORTAL FROZEN</span>
                  <span className="xs:hidden">FROZEN</span>
                </span>
              ) : (
                <span className="text-emerald-400 font-medium tracking-wide flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="hidden sm:inline">EVIDENCE ENGINE ACTIVE</span>
                  <span className="sm:hidden text-emerald-400/90">ONLINE</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Team Info, Score & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Desktop Team Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#181c26] border border-[#282d3b] font-mono text-xs text-[#dbd4cb]">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">{teamData?.identifier || teamData?.teamCode}</span>
            <span className="text-slate-600">•</span>
            <span className="text-[#9ba4b4] truncate max-w-[120px]">{teamData?.displayName || teamData?.teamName}</span>
          </div>

          {/* Warm Amber Dossier Total Score Badge */}
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#241c12] border border-amber-600/50 text-amber-300 font-mono font-bold text-xs sm:text-sm shadow-sm shadow-amber-950/40">
            <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{totalScore} <span className="text-[10px] font-normal text-amber-400/80">PTS</span></span>
          </div>

          {/* Sound Audio FX Toggle */}
          <button
            onClick={handleToggleSound}
            title={muted ? 'Enable Terminal Audio' : 'Mute Audio'}
            className="p-1.5 sm:p-2 rounded-lg bg-[#181c26] active:bg-[#202533] border border-[#282d3b] text-[#9ba4b4] hover:text-amber-300 transition-colors cursor-pointer"
          >
            {muted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            )}
          </button>

          {/* Quick Refresh */}
          <button
            onClick={() => {
              playRelayClick();
              onRefresh();
            }}
            disabled={refreshing}
            title="Refresh Progress"
            className="p-1.5 sm:p-2 rounded-lg bg-[#181c26] active:bg-[#202533] border border-[#282d3b] text-[#9ba4b4] hover:text-amber-300 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${refreshing ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {/* Rules / Directives */}
          <button
            onClick={() => {
              playRelayClick();
              onOpenRules();
            }}
            title="Investigation Directives"
            className="p-1.5 sm:p-2 rounded-lg bg-[#181c26] active:bg-[#202533] border border-[#282d3b] text-[#9ba4b4] hover:text-amber-300 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              playRelayClick();
              onLogout();
            }}
            title="Exit Session"
            className="p-1.5 sm:p-2 rounded-lg bg-[#181c26] active:bg-rose-950/60 border border-[#282d3b] hover:border-rose-500/40 text-[#9ba4b4] hover:text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
