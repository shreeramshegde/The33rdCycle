import React, { useState } from 'react';
import { CheckCircle2, Send, AlertTriangle, FolderOpen, Info, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playKeyClick, playRelayClick, playSuccessChime, playErrorBuzz } from '../services/soundFx';

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

  const handleInputChange = (e) => {
    playKeyClick();
    setAnswer(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim() || submitting || isPortalFrozen || isCompleted) return;

    playRelayClick();
    setSubmitting(true);
    setFeedback(null);

    try {
      const result = await onSubmit(checkpoint.id, answer.trim());
      if (result.isCorrect) {
        playSuccessChime();
        confetti({
          particleCount: 85,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#d97706', '#10b981', '#f59e0b', '#dbd4cb', '#ef4444'],
        });
        setFeedback({
          type: 'success',
          message: result.message || 'Anomaly verified successfully! +20 Points.',
        });
        setAnswer('');
      } else {
        playErrorBuzz();
        setFeedback({
          type: 'error',
          message: result.message || 'Incorrect answer. -5 Points Penalty deducted.',
        });
      }
    } catch (err) {
      playErrorBuzz();
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
      className={`rounded-xl border transition-all duration-300 relative overflow-hidden backdrop-blur-md shadow-2xl flex flex-col justify-between h-full min-h-[380px] sm:min-h-[400px] w-full ${
        isCompleted
          ? 'bg-[#121a16]/95 border-emerald-500/50 shadow-emerald-950/20'
          : 'bg-[#141720]/95 border-[#282d3b] hover:border-amber-500/60 shadow-black/50 hover:shadow-amber-950/20'
      }`}
    >
      {/* Brass Paperclip Decorative Accent */}
      <div className="absolute top-0 right-7 w-4 h-9 pointer-events-none z-20">
        <svg viewBox="0 0 16 36" fill="none" className="w-full h-full drop-shadow-md">
          <path
            d="M5 2C2.79086 2 1 3.79086 1 6V28C1 31.866 4.13401 35 8 35C11.866 35 15 31.866 15 28V9C15 6.23858 12.7614 4 10 4C7.23858 4 5 6.23858 5 9V26C5 27.6569 6.34315 29 8 29C9.65685 29 11 27.6569 11 26V10"
            stroke="#d97706"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Tactile Manila Dossier Tab Header */}
      <div className="flex items-center justify-between border-b border-[#282d3b] bg-[#1a1f2c]/90 px-3.5 py-1.5 font-mono text-[10px] tracking-wider shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500/80 shrink-0" />
          <span className="font-bold text-[#dbd4cb] uppercase">
            DOSSIER FILE #{String(checkpoint.orderIndex).padStart(2, '0')}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-[#8b92a2]">REF: NISB-33</span>
        </div>

        {/* Meaningful Checkpoint Reward Badge */}
        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-600/50 mr-8 tracking-wider">
          VALUE: +20 PTS
        </span>
      </div>

      <div className="p-4 sm:p-5 relative flex-1 flex flex-col justify-between">
        {/* Rubber Stamp Watermark (Reverted to classic subtle stamp) */}
        <div className="absolute right-3 bottom-14 pointer-events-none select-none opacity-15 rotate-[-12deg] z-0">
          {isCompleted ? (
            <div className="border-4 border-emerald-500 text-emerald-400 font-mono font-black text-2xl tracking-widest px-4 py-1 uppercase rounded-md border-dashed">
              VERIFIED
            </div>
          ) : (
            <div className="border-4 border-amber-500 text-amber-400 font-mono font-black text-2xl tracking-widest px-4 py-1 uppercase rounded-md border-dashed">
              CLASSIFIED
            </div>
          )}
        </div>

        {/* Card Header & Anomaly Title (Fixed uniform min-height for row alignment) */}
        <div className="relative z-10 mb-3 shrink-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span
              className={`text-[9px] sm:text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-bold ${
                isCompleted
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                  : 'bg-[#221c13] text-amber-300 border border-amber-600/40'
              }`}
            >
              {checkpoint.stageLabel || `Stage ${checkpoint.orderIndex}`}
            </span>

            {/* Redacted Investigation Tag */}
            <span className="text-[10px] font-mono text-[#8b92a2] flex items-center gap-1">
              LOC: <span className="bg-amber-400/10 text-amber-500/70 px-1 rounded select-none">██████</span>
            </span>
          </div>

          <div className="min-h-[44px] flex items-center">
            <h3 className="text-sm sm:text-base font-bold font-mono text-[#dbd4cb] tracking-tight leading-snug">
              {checkpoint.title}
            </h3>
          </div>
        </div>

        {/* Explicit Case Dossier 0 Physical Envelope Clarification */}
        {isStageZero && !isCompleted && (
          <div className="relative z-10 mb-3 p-2 rounded-lg bg-[#241c12]/90 border border-amber-500/40 text-amber-200 text-[10.5px] font-mono flex items-start gap-2 shadow-sm shrink-0">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-snug">
              <strong className="text-white uppercase block text-[9.5px] tracking-wide mb-0.5">
                Physical Envelope 0 in Team Dossier
              </strong>
              <span>
                Clues are in physical Envelope 0. Compute the time code and submit below.
              </span>
            </div>
          </div>
        )}

        {/* Dynamic Card Content (Fills remaining height evenly across all cards) */}
        <div className="relative z-10 flex-1 flex flex-col justify-between">
          {isCompleted ? (
            <div className="my-auto space-y-3 py-4">
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold tracking-wide">
                    DECLASSIFIED & SOLVED
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-emerald-900/80 text-emerald-200 font-bold border border-emerald-500/40 shadow-sm">
                  +{checkpoint.pointsAwarded || 20} PTS
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#8b92a2] px-1">
                <span>Attempt Log: #{checkpoint.attemptsCount || 1}</span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified in Record
                </span>
              </div>
            </div>
          ) : (
            /* Open State: Form Input */
            <div className="space-y-3 flex-1 flex flex-col justify-between">
              {feedback && (
                <div
                  className={`p-2.5 rounded-lg text-xs font-mono flex items-start gap-2 border animate-fadeIn ${
                    feedback.type === 'success'
                      ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                      : 'bg-rose-950/50 border-rose-500/50 text-rose-300'
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

              <form onSubmit={handleSubmit} className="space-y-2.5 mt-auto">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] sm:text-[11px] font-mono text-[#8b92a2] uppercase tracking-wider">
                      Enter Solution Key
                    </label>
                    <span className="text-[10px] font-mono text-rose-400/90 font-medium">
                      -5 PTS per mismatch
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={answer}
                      onChange={handleInputChange}
                      disabled={submitting || isPortalFrozen}
                      placeholder="ENTER CIPHER / TIME / HASH..."
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="characters"
                      spellCheck="false"
                      className="w-full px-3.5 py-2.5 bg-[#0b0d12] border border-[#282d3b] rounded-lg text-[#dbd4cb] placeholder-[#575e6d] font-mono text-base sm:text-sm tracking-wider focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors uppercase disabled:opacity-50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !answer.trim() || isPortalFrozen}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase rounded-lg shadow-md shadow-amber-950/60 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Cryptographic Signal...</span>
                    </>
                  ) : (
                    <>
                      <span>VERIFY SIGNAL</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-500 pt-1 border-t border-[#282d3b]/80">
                <span>Attempts: {checkpoint.attemptsCount || 0}</span>
                <span className="text-amber-400 flex items-center gap-1 font-medium">
                  <FolderOpen className="w-3 h-3" /> Awaiting Solution
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Vintage Barcode Decorative Strip at bottom of dossier */}
        <div className="relative z-10 pt-3 mt-3 border-t border-[#282d3b]/60 flex items-center justify-between font-mono text-[9px] text-slate-600 select-none shrink-0">
          <div className="flex items-center gap-0.5 tracking-tighter">
            <span className="text-slate-500">||| | |||| | || ||||| | |||</span>
          </div>
          <span className="tracking-widest">33-CYCLE // CHRONOS</span>
        </div>
      </div>
    </div>
  );
}
