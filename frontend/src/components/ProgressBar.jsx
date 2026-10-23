import React from 'react';
import { CheckCircle2, Lock, Radio } from 'lucide-react';

export default function ProgressBar({ checkpoints = [] }) {
  const total = checkpoints.length || 6;
  const completedCount = checkpoints.filter((cp) => cp.isCompleted).length;
  const percent = Math.round((completedCount / total) * 100);

  // Find the current active checkpoint (first non-completed one)
  const activeCheckpointId = checkpoints.find((cp) => !cp.isCompleted)?.id;

  return (
    <div className="bg-[#0b0f19]/80 border border-slate-800 rounded-xl p-4 sm:p-5 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            CHRONOS Anomaly Resolution Track
          </span>
          <h2 className="text-sm sm:text-base font-bold font-mono text-white">
            Investigation Progress: {completedCount} / {total} Checkpoints ({percent}%)
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

      {/* Stepper Grid / Track */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
        {checkpoints.map((cp, idx) => {
          const isCompleted = cp.isCompleted;
          const isActive = cp.id === activeCheckpointId;
          const isLocked = !isCompleted && !isActive;

          return (
            <div
              key={cp.id}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                isCompleted
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : isActive
                  ? 'bg-cyan-950/30 border-cyan-500/60 text-cyan-200 shadow-sm shadow-cyan-950 ring-1 ring-cyan-500/30'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-mono tracking-wider uppercase font-semibold">
                  Stage {idx}
                </span>
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : isActive ? (
                  <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                )}
              </div>
              <div className="text-xs font-mono font-medium truncate">
                {cp.stageLabel || `CP ${idx}`}
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                {isCompleted ? 'VERIFIED' : isActive ? 'ACTIVE' : 'LOCKED'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
