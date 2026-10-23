import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function ProgressBar({ checkpoints = [] }) {
  const total = checkpoints.length || 6;
  const completedCount = checkpoints.filter((cp) => cp.isCompleted).length;
  const percent = Math.round((completedCount / total) * 100);

  return (
    <div className="bg-[#0b0f19]/80 border border-slate-800 rounded-xl p-3 sm:p-5 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 block">
            Investigation Progress (Free Order)
          </span>
          <h2 className="text-xs sm:text-base font-bold font-mono text-white">
            {completedCount} of {total} Checkpoints Solved ({percent}%)
          </h2>
        </div>

        {/* Mini progress line indicator */}
        <div className="w-full sm:w-48 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-700 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Mobile-Friendly Stepper Strip (Pills) */}
      <div className="grid grid-cols-6 gap-1 sm:hidden pt-0.5">
        {checkpoints.map((cp, idx) => {
          const isCompleted = cp.isCompleted;
          return (
            <div
              key={cp.id}
              className={`py-1.5 px-0.5 rounded text-center border transition-all ${
                isCompleted
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-[9px] font-mono font-bold">
                {idx === 0 ? 'OPEN' : `CP${idx}`}
              </div>
              <div className="flex justify-center mt-0.5">
                {isCompleted ? (
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/60" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tablet & Desktop Stepper Grid */}
      <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
        {checkpoints.map((cp, idx) => {
          const isCompleted = cp.isCompleted;

          return (
            <div
              key={cp.id}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                isCompleted
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-cyan-950/20 border-cyan-800/40 text-cyan-200 hover:border-cyan-500/50'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-mono tracking-wider uppercase font-semibold">
                  Stage {idx}
                </span>
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                )}
              </div>
              <div className="text-xs font-mono font-medium truncate">
                {cp.stageLabel || `CP ${idx}`}
              </div>
              <div className="text-[10px] font-mono mt-0.5">
                {isCompleted ? (
                  <span className="text-emerald-400 font-semibold">VERIFIED</span>
                ) : (
                  <span className="text-cyan-400/80">OPEN</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
