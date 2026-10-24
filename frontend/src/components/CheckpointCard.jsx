import React, { useState } from 'react';
import { CheckCircle2, Send, AlertTriangle, FolderOpen, Info } from 'lucide-react';
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
  const isStageZero = checkpoint.id === 'ROUND_0' || checkpoint.orderIndex === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim() || submitting || isPortalFrozen || isCompleted) return;

    setSubmitting(true);
    setFeedback(null);

    try {
      const result = await onSubmit(checkpoint.id, answer.trim());
      if (result.isCorrect) {
        // Celebratory confetti with noir/amber/emerald palette
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#d97706', '#10b981', '#f59e0b', '#dbd4cb'],
        });
        setFeedback({
          type: 'success',
          message: result.message || 'Anomaly verified successfully! +20 Points.',
        });
        setAnswer('');
      } else {
        setFeedback({
          type: 'error',
          message: result.message || 'Incorrect answer. -5 Points Penalty deducted.',
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
          ? 'bg-[#0f1713]/90 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
          : 'bg-[#141720]/95 border-[#282d3b] hover:border-amber-500/50 shadow-xl shadow-black/40 ring-1 ring-[#282d3b]/80 hover:ring-amber-500/20'
      }`}
    >
      {/* Top Accent Ribbon */}
      {isCompleted ? (
        <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-400 w-full" />
      ) : (
        <div className="h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-slate-700 w-full opacity-70" />
      )}

      <div className="p-4 sm:p-6">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2.5 mb-3.5">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <span
                className={`text-[9px] sm:text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-bold ${
                  isCompleted
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                    : 'bg-[#1e2330] text-amber-300 border border-amber-600/30'
                }`}
              >
                {checkpoint.stageLabel || `Stage ${checkpoint.orderIndex}`}
              </span>

              {/* Checkpoint ID tag */}
              <span className="text-[10px] font-mono text-slate-500">
                [{checkpoint.id}]
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold font-mono text-[#dbd4cb] tracking-tight leading-snug">
              {checkpoint.title}
            </h3>
          </div>

          {/* Status Icon Badge */}
          <div className="shrink-0">
            {isCompleted ? (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-950">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            ) : (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1b1f2b] border border-[#282d3b] flex items-center justify-center text-amber-400 shadow-sm">
                <FolderOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            )}
          </div>
        </div>

        {/* Explicit Case Dossier 0 Physical Envelope Clarification */}
        {isStageZero && !isCompleted && (
          <div className="mb-3 p-2.5 rounded-lg bg-[#1a1f2b] border border-amber-500/30 text-amber-200 text-[11px] font-mono flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Clues are inside physical Envelope 0 in your team dossier. Enter the calculated time code below.
            </span>
          </div>
        )}

        {/* Dynamic Card Content */}
        {isCompleted ? (
          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 text-xs font-mono flex items-center justify-between">
              <span className="font-semibold tracking-wide">
                ANOMALY SOLVED & VERIFIED
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 font-bold border border-emerald-500/30">
                +{checkpoint.pointsAwarded || 20} PTS
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#8b92a2] px-1">
              <span>Attempts: {checkpoint.attemptsCount || 1}</span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Solved
              </span>
            </div>
          </div>
        ) : (
          /* Open State: Form Input */
          <div className="space-y-3">
            {feedback && (
              <div
                className={`p-2.5 sm:p-3 rounded-lg text-xs font-mono flex items-start gap-2 border ${
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

            <form onSubmit={handleSubmit} className="space-y-2.5">
              <div>
                <label className="block text-[10px] sm:text-[11px] font-mono text-[#8b92a2] uppercase tracking-wider mb-1">
                  Enter Checkpoint Solution
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={submitting || isPortalFrozen}
                    placeholder="Enter code or answer..."
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="characters"
                    spellCheck="false"
                    className="w-full px-3.5 py-2.5 bg-[#0b0d12] border border-[#282d3b] rounded-lg text-[#dbd4cb] placeholder-[#575e6d] font-mono text-base sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors uppercase disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-0.5">
                <div className="text-[10px] font-mono text-slate-400">
                  <span className="text-amber-400 font-semibold">Rule:</span> -5 PTS per wrong attempt
                </div>

                <button
                  type="submit"
                  disabled={submitting || !answer.trim() || isPortalFrozen}
                  className="w-full sm:w-auto py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase rounded-lg shadow-md shadow-amber-950/50 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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

            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-500 pt-1 border-t border-[#282d3b]">
              <span>Attempts: {checkpoint.attemptsCount || 0}</span>
              <span className="text-amber-400 font-medium">Ready</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
