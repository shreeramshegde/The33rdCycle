import React, { useState, useEffect, useCallback } from 'react';
import { api, getStoredToken, getStoredTeam, getStoredRole, clearAuthSession } from './services/api';
import LoginPage from './components/LoginPage';
import AdminHintDesk from './components/AdminHintDesk';
import Navbar from './components/Navbar';
import ProgressBar from './components/ProgressBar';
import CheckpointCard from './components/CheckpointCard';
import ActivityLog from './components/ActivityLog';
import RulesModal from './components/RulesModal';
import SurveillanceHUD, { SurveillanceBar } from './components/SurveillanceHUD';
import { AlertTriangle, Lock, ShieldAlert } from 'lucide-react';
import { startAmbientDrone, isSoundMuted } from './services/soundFx';

export default function App() {
  const [token, setToken] = useState(getStoredToken());
  const [role, setRole] = useState(getStoredRole());
  const [team, setTeam] = useState(getStoredTeam());
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);
  const [showRules, setShowRules] = useState(false);

  // Auto-start ambient drone if unmuted on first interaction
  useEffect(() => {
    const handleFirstGesture = () => {
      if (!isSoundMuted()) {
        startAmbientDrone();
      }
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
    window.addEventListener('click', handleFirstGesture);
    window.addEventListener('keydown', handleFirstGesture);
    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  // Fetch live team progress from backend
  const loadProgress = useCallback(async (isBackground = false) => {
    if (!token || role === 'ROLE_ADMIN') return;
    if (isBackground) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await api.getProgress();
      setProgress(data);
      setError('');

      // Restore submission logs from database so refresh never wipes out history
      if (data.recentSubmissions && Array.isArray(data.recentSubmissions)) {
        const mappedLogs = data.recentSubmissions.map((s) => ({
          checkpointId: s.checkpointId,
          isCorrect: s.isCorrect,
          pointsAwarded: s.pointsAwarded,
          attemptNumber: s.attemptNumber,
          submittedValue: s.submittedValue,
          time: s.submittedAt ? new Date(s.submittedAt).toLocaleTimeString() : '',
        }));
        setLogs(mappedLogs);
      }
    } catch (err) {
      setError(err.message || 'Failed to sync with CHRONOS engine.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, role]);

  // Initial load on mount or login
  useEffect(() => {
    if (token && role !== 'ROLE_ADMIN') {
      loadProgress(false);
    }
  }, [token, role, loadProgress]);

  // Periodic polling every 12 seconds to auto-detect portal freeze or score adjustments
  useEffect(() => {
    if (!token || role === 'ROLE_ADMIN') return;
    const interval = setInterval(() => {
      loadProgress(true);
    }, 12000);
    return () => clearInterval(interval);
  }, [token, role, loadProgress]);

  const handleLoginSuccess = (loginData) => {
    const userRole = loginData.role || (loginData.identifier === 'admin' ? 'ROLE_ADMIN' : 'ROLE_TEAM');
    setToken(loginData.token);
    setRole(userRole);
    setTeam({
      identifier: loginData.identifier || loginData.teamCode,
      displayName: loginData.displayName || loginData.teamName,
      teamCode: loginData.teamCode || loginData.identifier,
      teamName: loginData.teamName || loginData.displayName,
      role: userRole,
    });
  };

  const handleLogout = () => {
    clearAuthSession();
    setToken(null);
    setRole(null);
    setTeam(null);
    setProgress(null);
    setLogs([]);
  };

  const handleSubmitAnswer = async (checkpointId, answer) => {
    try {
      const result = await api.submitAnswer(checkpointId, answer);

      // Optimistically prepend to telemetry activity log
      const newLog = {
        checkpointId,
        isCorrect: result.isCorrect,
        pointsAwarded: result.pointsAwarded,
        attemptNumber: result.attemptNumber,
        time: new Date().toLocaleTimeString(),
      };
      setLogs((prev) => [newLog, ...prev]);

      // Optimistically update total score in state
      if (result.updatedTotalScore !== undefined) {
        setProgress((prev) => prev ? { ...prev, totalScore: result.updatedTotalScore } : prev);
      }

      // Refresh progress to sync complete state from DB
      await loadProgress(true);

      return result;
    } catch (err) {
      throw err;
    }
  };

  // If not authenticated, render maximalist LoginPage
  if (!token) {
    return (
      <div className="relative min-h-screen">
        <SurveillanceHUD />
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // If authenticated as Admin, render dedicated AdminHintDesk
  if (role === 'ROLE_ADMIN') {
    return <AdminHintDesk onLogout={handleLogout} />;
  }

  const checkpoints = progress?.checkpoints || [];
  const totalScore = progress?.totalScore ?? 100;
  const isPortalFrozen = progress?.isPortalFrozen ?? false;

  return (
    <div className="min-h-screen bg-[#0d0f14] chronos-grid text-[#dbd4cb] flex flex-col relative overflow-x-hidden">
      {/* Background Cinematic Atmosphere Engine (Zero interference with layout) */}
      <SurveillanceHUD />

      {/* Desktop Atmospheric Archive Room Background */}
      <div
        className="hidden md:block fixed inset-0 bg-cover bg-center opacity-[0.16] pointer-events-none filter blur-[1px] scale-105 z-0"
        style={{ backgroundImage: `url('/archive-room.png')` }}
      />
      <div className="hidden md:block fixed inset-0 bg-gradient-to-b from-[#0d0f14]/85 via-transparent to-[#0d0f14]/90 pointer-events-none z-0" />

      {/* Mobile Portrait Atmosphere: Clean amber top glow to prevent awkward 3x zooming */}
      <div className="md:hidden fixed inset-0 bg-[#0d0f14] bg-[radial-gradient(circle_at_top,rgba(217,119,6,0.10)_0%,transparent_50%)] pointer-events-none z-0" />

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
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-6 space-y-3.5 sm:space-y-5 relative z-10">
        {/* Surveillance Telemetry Ribbon (Sits neatly in layout flow - NO overlapping) */}
        <SurveillanceBar />

        {/* Portal Frozen Critical Banner */}
        {isPortalFrozen && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/60 text-rose-200 flex items-center justify-between gap-3 shadow-lg shadow-rose-950/40 animate-pulse">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <span className="font-bold text-xs uppercase tracking-wide block">
                  TEMPORAL LOCKOUT ACTIVE • PORTAL FROZEN
                </span>
                <span className="text-xs text-rose-300">
                  Submissions are temporarily suspended by NISB Control. Scoring is halted.
                </span>
              </div>
            </div>
            <Lock className="w-5 h-5 text-rose-400 shrink-0 hidden sm:block" />
          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Spinner during initial fetch */}
        {loading && !progress ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3 text-amber-400">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm tracking-widest uppercase">Synchronizing Investigation Dossier...</span>
          </div>
        ) : (
          <>
            {/* Top Stepper Progress Track */}
            <ProgressBar checkpoints={checkpoints} />

            {/* Checkpoint Cards Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between font-dossier">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#dbd4cb]">
                  EVIDENCE DOSSIER REPOSITORY ({checkpoints.length} CHECKPOINTS)
                </span>
                <span className="text-xs text-amber-400/90 tracking-wide font-medium">
                  Open Investigation • Solve in any order
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch">
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

      {/* Noir Minimal Footer */}
      <footer className="border-t border-[#282d3b] bg-[#10131a]/95 py-4 text-center text-xs text-[#8b92a2] relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>THE 33RD CYCLE • NISB PORTAL</span>
          <span className="text-slate-600">CHRONOS Anomaly Engine</span>
        </div>
      </footer>
    </div>
  );
}
