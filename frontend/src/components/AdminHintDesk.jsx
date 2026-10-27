import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  HelpCircle,
  LogOut,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  MinusCircle,
  Radio,
  Building2,
  Clock,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { api, clearAuthSession } from '../services/api';
import {
  playKeyClick,
  playRelayClick,
  playSuccessChime,
  playErrorBuzz,
  isSoundMuted,
  toggleSound,
} from '../services/soundFx';

const CHECKPOINTS = [
  { id: 'CP_1', title: 'The Last Transmission', label: 'Checkpoint 1' },
  { id: 'CP_2', title: 'The Unreliable Witness', label: 'Checkpoint 2' },
  { id: 'CP_3', title: 'The CHRONOS Terminal', label: 'Checkpoint 3' },
  { id: 'CP_4', title: 'The Secondary Override', label: 'Checkpoint 4' },
  { id: 'CP_5', title: 'The Archival Grid', label: 'Checkpoint 5' },
];

export default function AdminHintDesk({ onLogout }) {
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [selectedTeamCode, setSelectedTeamCode] = useState('TEAM_01');
  const [selectedCheckpoint, setSelectedCheckpoint] = useState('CP_1');
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState('');
  const [hintHistory, setHintHistory] = useState([]);
  const [muted, setMuted] = useState(isSoundMuted());

  const handleToggleSound = () => {
    const newState = toggleSound();
    setMuted(newState);
    if (!newState) playRelayClick();
  };

  const loadTeams = useCallback(async () => {
    try {
      const data = await api.getAdminTeams();
      if (Array.isArray(data)) {
        setTeams(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch team statuses.');
    } finally {
      setLoadingTeams(false);
    }
  }, []);

  useEffect(() => {
    loadTeams();
    const interval = setInterval(loadTeams, 8000);
    return () => clearInterval(interval);
  }, [loadTeams]);

  const handleIssueHint = async (e) => {
    e.preventDefault();
    if (!selectedTeamCode || !selectedCheckpoint || submitting) return;

    playRelayClick();
    setSubmitting(true);
    setNotification(null);
    setError('');

    try {
      const result = await api.issueHint(selectedTeamCode, selectedCheckpoint);
      playSuccessChime();

      setNotification({
        type: 'success',
        message: `Deducted 2 points from ${result.teamCode} (${result.teamName}) for ${result.checkpointId}. Updated Score: ${result.updatedTotalScore} PTS`,
      });

      const newHistoryItem = {
        id: Date.now(),
        teamCode: result.teamCode,
        teamName: result.teamName,
        checkpointId: result.checkpointId,
        scoreAfter: result.updatedTotalScore,
        time: new Date().toLocaleTimeString(),
      };
      setHintHistory((prev) => [newHistoryItem, ...prev]);

      // Refresh team balances immediately
      await loadTeams();
    } catch (err) {
      playErrorBuzz();
      setError(err.message || 'Failed to register hint penalty.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickSelectTeam = (code) => {
    playKeyClick();
    setSelectedTeamCode(code);
    setNotification(null);
  };

  const selectedTeamObj = teams.find((t) => t.teamCode === selectedTeamCode);

  return (
    <div className="min-h-screen bg-[#0d0f14] chronos-grid text-[#dbd4cb] flex flex-col relative overflow-x-hidden">
      {/* Ambient background */}
      <div
        className="hidden md:block fixed inset-0 bg-cover bg-center opacity-[0.12] pointer-events-none filter blur-[1px] scale-105 z-0"
        style={{ backgroundImage: `url('/archive-room.png')` }}
      />
      <div className="hidden md:block fixed inset-0 bg-gradient-to-b from-[#0d0f14]/85 via-transparent to-[#0d0f14]/90 pointer-events-none z-0" />

      {/* Control Header */}
      <header className="sticky top-0 z-40 bg-[#10131a]/95 backdrop-blur-md border-b border-[#282d3b] shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
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
                <span className="font-extrabold text-xs sm:text-base tracking-wider text-[#dbd4cb] truncate font-dossier">
                  THE 33RD CYCLE
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-600/50 tracking-widest font-dossier">
                  ADMIN CONTROL
                </span>
              </div>
              <div className="text-[11px] text-amber-400/90 font-mono flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>HINT PENALTY DESK • LIVE</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              title={muted ? 'Enable Audio' : 'Mute Audio'}
              className="p-1.5 sm:p-2 rounded-lg bg-[#181c26] active:bg-[#202533] border border-[#282d3b] text-[#9ba4b4] hover:text-amber-300 transition-colors cursor-pointer"
            >
              {muted ? (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              )}
            </button>

            {/* Refresh */}
            <button
              onClick={() => {
                playRelayClick();
                loadTeams();
              }}
              title="Refresh Team Statuses"
              className="p-1.5 sm:p-2 rounded-lg bg-[#181c26] active:bg-[#202533] border border-[#282d3b] text-[#9ba4b4] hover:text-amber-300 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                playRelayClick();
                clearAuthSession();
                onLogout();
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#241c12] border border-amber-600/50 text-amber-300 hover:text-white hover:border-amber-500 text-xs font-bold transition-all cursor-pointer font-dossier"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">EXIT CONTROL</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 relative z-10">
        {/* Protocol Banner */}
        <div className="p-4 rounded-xl bg-[#141720]/95 border border-[#282d3b] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#dbd4cb] font-dossier">
                Official Hint Protocol Console
              </h2>
              <p className="text-xs text-[#8b92a2] mt-0.5 leading-relaxed">
                When a team requests an official clue from the NISB core committee, select the team and checkpoint below to register the hint. Exactly <strong className="text-rose-400">-2 Points</strong> are deducted immediately from their ledger. Scores can proceed into <strong className="text-amber-300">negative numbers</strong> without capping.
              </p>
            </div>
          </div>
        </div>

        {/* Feedback alerts */}
        {notification && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-200 text-xs flex items-center gap-2.5 animate-fadeIn shadow-lg shadow-emerald-950/40">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/60 text-rose-200 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* The Single Dedicated Hint Dispatch Box */}
        <div className="bg-[#141720]/95 backdrop-blur-xl border border-[#282d3b] rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

          <div className="flex items-center justify-between pb-4 border-b border-[#282d3b] mb-5">
            <div className="flex items-center gap-2">
              <MinusCircle className="w-5 h-5 text-rose-400" />
              <h3 className="text-base font-bold uppercase tracking-wider text-[#dbd4cb] font-dossier">
                Dispatch Team Hint (-2 Points)
              </h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-950/70 border border-rose-500/50 text-rose-300 font-bold">
              PENALTY: -2 PTS
            </span>
          </div>

          <form onSubmit={handleIssueHint} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Team Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#dbd4cb] mb-1.5 font-dossier">
                  Select Target Team
                </label>
                <select
                  value={selectedTeamCode}
                  onChange={(e) => {
                    playKeyClick();
                    setSelectedTeamCode(e.target.value);
                    setNotification(null);
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#0b0d12] border border-[#282d3b] rounded-lg text-[#dbd4cb] font-mono text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                >
                  {teams.map((t) => (
                    <option key={t.teamCode} value={t.teamCode}>
                      {t.teamCode} — {t.teamName} (Current: {t.totalScore} PTS)
                    </option>
                  ))}
                </select>

                {selectedTeamObj && (
                  <div className="mt-2 text-xs flex items-center gap-2">
                    <span className="text-[#8b92a2]">Current Ledger:</span>
                    <span
                      className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                        selectedTeamObj.totalScore < 0
                          ? 'bg-rose-950/70 border border-rose-500/50 text-rose-300'
                          : 'bg-[#1b1f2b] border border-[#282d3b] text-amber-300'
                      }`}
                    >
                      {selectedTeamObj.totalScore} PTS
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-[#8b92a2]">
                      Solved: {selectedTeamObj.completedCheckpoints} / 5
                    </span>
                  </div>
                )}
              </div>

              {/* Checkpoint Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#dbd4cb] mb-1.5 font-dossier">
                  Target Checkpoint for Hint
                </label>
                <select
                  value={selectedCheckpoint}
                  onChange={(e) => {
                    playKeyClick();
                    setSelectedCheckpoint(e.target.value);
                    setNotification(null);
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#0b0d12] border border-[#282d3b] rounded-lg text-[#dbd4cb] font-mono text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                >
                  {CHECKPOINTS.map((cp) => (
                    <option key={cp.id} value={cp.id}>
                      {cp.id} — {cp.label}: {cp.title}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-[#8b92a2]">
                  Hint deduction is logged against this specific stage.
                </p>
              </div>
            </div>

            {/* Quick Team Chips */}
            <div>
              <span className="text-[11px] text-[#8b92a2] font-semibold uppercase tracking-wider block mb-1.5 font-dossier">
                Quick Select Competition Teams:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {teams.slice(0, 10).map((t) => (
                  <button
                    key={t.teamCode}
                    type="button"
                    onClick={() => handleQuickSelectTeam(t.teamCode)}
                    className={`text-xs font-mono px-2.5 py-1 rounded border transition-all cursor-pointer ${
                      selectedTeamCode === t.teamCode
                        ? 'bg-amber-600/30 border-amber-500 text-amber-300 font-bold shadow-sm'
                        : 'bg-[#0b0d12] border-[#282d3b] text-[#8b92a2] hover:text-[#dbd4cb] hover:border-slate-600'
                    }`}
                  >
                    {t.teamCode}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 hover:from-rose-600 hover:to-rose-500 active:scale-98 text-white font-dossier font-bold text-sm tracking-widest uppercase rounded-lg shadow-lg shadow-rose-950/60 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Deducting Points from Team Ledger...</span>
                </>
              ) : (
                <>
                  <MinusCircle className="w-4 h-4" />
                  <span>DEDUCT 2 POINTS & ISSUE HINT TO {selectedTeamCode}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Team Ledger Grid (Real-time score overview with negative score highlight) */}
        <div className="bg-[#141720]/95 border border-[#282d3b] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#282d3b] mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#dbd4cb] font-dossier">
                Active Teams & Ledger Balances ({teams.length} Teams)
              </h3>
            </div>
            <span className="text-xs text-[#8b92a2]">Auto-syncing every 8s</span>
          </div>

          {loadingTeams && teams.length === 0 ? (
            <div className="py-8 text-center text-amber-400 text-xs">
              <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading team ledgers...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {teams.map((t) => {
                const isSelected = selectedTeamCode === t.teamCode;
                const isNegative = t.totalScore < 0;

                return (
                  <div
                    key={t.teamCode}
                    onClick={() => handleQuickSelectTeam(t.teamCode)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-950/30 border-amber-500/60 shadow-md shadow-amber-950/30'
                        : 'bg-[#0b0d12]/80 border-[#282d3b] hover:border-slate-600'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs text-amber-400">
                          {t.teamCode}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          • {t.completedCheckpoints}/5 solved
                        </span>
                      </div>
                      <div className="text-xs text-[#dbd4cb] truncate font-medium">
                        {t.teamName}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`font-mono font-bold text-xs px-2 py-0.5 rounded border inline-block ${
                          isNegative
                            ? 'bg-rose-950/80 border-rose-500/70 text-rose-300 font-extrabold shadow-sm'
                            : 'bg-[#181c26] border-[#282d3b] text-amber-300'
                        }`}
                      >
                        {t.totalScore} PTS
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Session Hint Audit Log */}
        {hintHistory.length > 0 && (
          <div className="bg-[#141720]/95 border border-[#282d3b] rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-[#282d3b] mb-3">
              <Clock className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#dbd4cb] font-dossier">
                Hints Issued This Session ({hintHistory.length})
              </h3>
            </div>
            <div className="space-y-2">
              {hintHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg bg-[#0b0d12]/80 border border-[#282d3b] text-xs flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="font-mono font-bold text-amber-400">{item.teamCode}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-[#dbd4cb] font-mono">{item.checkpointId}</span>
                    <span className="text-[#8b92a2]">({item.teamName})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-rose-400 font-mono font-bold">-2 PTS</span>
                    <span className="text-[#8b92a2] font-mono text-[11px]">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
