import React, { useState } from 'react';
import { CheckCircle2, Send, AlertTriangle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckpointCard({
  checkpoint,
  isPortalFrozen,
  onSubmit,
}) {
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const isCompleted = checkpoint.isCompleted;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim() || submitting || isPortalFrozen || isCompleted) return;

    setSubmitting(true);
    setFeedback(null);

    try {
      const result = await onSubmit(checkpoint.id, answer.trim());
      if (result.isCorrect) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#10b981', '#38bdf8', '#fbbf24'],
        });
        setFeedback({
          type: 'success',
          message: result.message || 'Anomaly verified successfully! +20 Points.',
        });
        setAnswer('');
      } else {
        setFeedback({
          type: 'error',
          message: result.message || 'Incorrect answer. Please check your dossier and retry.',
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Submission error. Please retry.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 relative overflow-hidden backdrop-blur-sm ${
        isCompleted
          ? 'bg-[#0a1510]/85 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
          : 'bg-[#0a1220]/90 border-slate-800 hover:border-cyan-500/50 shadow-xl shadow-cyan-950/20 ring-1 ring-slate-800/80 hover:ring-cyan-500/20'
      }`}
    >
      {/* Top Accent Ribbon */}
      {isCompleted ? (
        <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-400 w-full" />
      ) : (
        <div className="h-1 bg-gradient-to-r from-cyan-500 via-sky-400 to-slate-700 w-full opacity-60" />
      )}

      <div className="p-5 sm:p-6">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded font-bold ${
                  isCompleted
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                    : 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60'
                }`}
              >
                {checkpoint.stageLabel || `Stage ${checkpoint.orderIndex}`}
              </span>

              {/* Checkpoint ID tag */}
              <span className="text-[10px] font-mono text-slate-500">
                [{checkpoint.id}]
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold font-mono text-white tracking-tight leading-snug">
              {checkpoint.title}
            </h3>
          </div>

          {/* Status Icon Badge */}
          <div className="shrink-0">
            {isCompleted ? (
              <div className="w-9 h-9 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-950">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-950">
                <Sparkles className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Card Content */}
        {isCompleted ? (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 text-xs font-mono flex items-center justify-between">
              <span className="font-semibold tracking-wide">
                STATUS: SEQUENCE VERIFIED
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 font-bold border border-emerald-500/30">
                +{checkpoint.pointsAwarded || 20} PTS
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
              <span>Attempts logged: {checkpoint.attemptsCount || 1}</span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Solved
              </span>
            </div>
          </div>
        ) : (
          /* Open State: Form Input */
          <div className="space-y-4">
            {feedback && (
              <div
                className={`p-3 rounded-lg text-xs font-mono flex items-start gap-2 border ${
                  feedback.type === 'success'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Enter Anomaly Solution Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={submitting || isPortalFrozen}
                    placeholder="Enter final code or phrase..."
                    className="w-full px-3.5 py-2.5 bg-slate-950/90 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 text-sm font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors uppercase disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
                <div className="text-[10px] font-mono text-slate-500">
                  <span className="text-amber-400">Rule:</span> -5 PTS per incorrect submission
                </div>

                <button
                  type="submit"
                  disabled={submitting || !answer.trim() || isPortalFrozen}
                  className="py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase rounded-lg shadow-md shadow-cyan-950/60 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>SUBMIT ANSWER</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
              <span>Attempts recorded: {checkpoint.attemptsCount || 0}</span>
              <span className="text-cyan-400 font-medium">Open for Submission</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
