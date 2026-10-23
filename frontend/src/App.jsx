import React, { useState, useEffect, useCallback } from 'react';
import { api, getStoredToken, getStoredTeam, clearAuthSession } from './services/api';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';
import ProgressBar from './components/ProgressBar';
import CheckpointCard from './components/CheckpointCard';
import ActivityLog from './components/ActivityLog';
import RulesModal from './components/RulesModal';
import { AlertTriangle, Lock, ShieldAlert } from 'lucide-react';

export default function App() {
  const [token, setToken] = useState(getStoredToken());
  const [team, setTeam] = useState(getStoredTeam());
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);
  const [showRules, setShowRules] = useState(false);

  // Fetch live team progress from backend
  const loadProgress = useCallback(async (isBackground = false) => {
    if (!token) return;
    if (isBackground) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await api.getProgress();
      setProgress(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to sync with CHRONOS engine.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  // Initial load on login / mount
  useEffect(() => {
    if (token) {
      loadProgress(false);
    }
  }, [token, loadProgress]);

  // Periodic polling every 12 seconds to auto-detect portal freeze or score adjustments
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      loadProgress(true);
    }, 12000);
    return () => clearInterval(interval);
  }, [token, loadProgress]);

  const handleLoginSuccess = (loginData) => {
    setToken(loginData.token);
    setTeam(loginData);
  };

  const handleLogout = () => {
    clearAuthSession();
    setToken(null);
    setTeam(null);
    setProgress(null);
    setLogs([]);
  };

  const handleSubmitAnswer = async (checkpointId, answer) => {
    try {
      const result = await api.submitAnswer(checkpointId, answer);

      // Add to telemetry activity log
      const newLog = {
        checkpointId,
        isCorrect: result.isCorrect,
        pointsAwarded: result.pointsAwarded,
        attemptNumber: result.attemptNumber,
        time: new Date().toLocaleTimeString(),
      };
      setLogs((prev) => [newLog, ...prev]);

      // Refresh progress to update checkpoint states
      await loadProgress(true);

      return result;
    } catch (err) {
      throw err;
    }
  };

  // If not authenticated, show sleek LoginPage
  if (!token) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const checkpoints = progress?.checkpoints || [];
  const totalScore = progress?.totalScore ?? team?.totalScore ?? 100;
  const isPortalFrozen = progress?.isPortalFrozen ?? false;

  return (
    <div className="min-h-screen bg-[#07090e] chronos-grid text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        teamData={team}
        totalScore={totalScore}
        isPortalFrozen={isPortalFrozen}
        onRefresh={() => loadProgress(true)}
        refreshing={refreshing}
        onOpenRules={() => setShowRules(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-6 space-y-3.5 sm:space-y-6">
        {/* Portal Frozen Critical Banner */}
        {isPortalFrozen && (
          <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/50 text-rose-200 flex items-center justify-between gap-3 shadow-lg shadow-rose-950/30 animate-pulse">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <span className="font-mono font-bold text-xs uppercase tracking-wide block">
                  TEMPORAL LOCKOUT ACTIVE (PORTAL FROZEN)
                </span>
                <span className="text-xs text-rose-300 font-mono">
                  Submissions are temporarily suspended by NISB Control. Scoring is halted.
                </span>
              </div>
            </div>
            <Lock className="w-5 h-5 text-rose-400 shrink-0 hidden sm:block" />
          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs font-mono flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Spinner during initial fetch */}
        {loading && !progress ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 font-mono text-cyan-400">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs tracking-widest uppercase">Synchronizing CHRONOS Neural Link...</span>
          </div>
        ) : (
          <>
            {/* Top Stepper Progress Track */}
            <ProgressBar checkpoints={checkpoints} />

            {/* Checkpoint Cards Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  INVESTIGATION SEQUENCE (6 CHECKPOINTS)
                </span>
                <span className="text-[11px] font-mono text-cyan-400/90">
                  Open Investigation • Attend any checkpoint in any order
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {checkpoints.map((cp) => (
                  <CheckpointCard
                    key={cp.id}
                    checkpoint={cp}
                    isPortalFrozen={isPortalFrozen}
                    onSubmit={handleSubmitAnswer}
                  />
                ))}
              </div>
            </div>

            {/* Live Submissions Activity Log */}
            <ActivityLog logs={logs} />
          </>
        )}
      </main>

      {/* Rules Modal */}
      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />

      {/* Sleek Minimal Footer */}
      <footer className="border-t border-slate-800/80 bg-[#07090e]/80 py-4 text-center text-[11px] font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>THE 33RD CYCLE // NISB PORTAL</span>
          <span className="text-slate-600">CHRONOS Anomaly Engine</span>
        </div>
      </footer>
    </div>
  );
}
