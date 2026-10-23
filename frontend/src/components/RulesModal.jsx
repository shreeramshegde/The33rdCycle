import React from 'react';
import { X, ShieldAlert, Award, FileText, CheckCircle2, AlertOctagon } from 'lucide-react';

export default function RulesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative font-mono">
        {/* Top Accent Line */}
        <div className="h-1 bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 w-full" />

        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-wide uppercase">
              CHRONOS PROTOCOL DIRECTIVES
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 text-xs text-slate-300 leading-relaxed max-h-[75vh] overflow-y-auto">
          {/* Directive 1 */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3">
            <FileText className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white uppercase block mb-0.5">
                1. Physical Dossier Only
              </span>
              <span>
                No puzzle questions exist on this website. All encoded clues, audio logs, and data sheets are contained in your physical team envelopes.
              </span>
            </div>
          </div>

          {/* Directive 2 */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3">
            <Award className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white uppercase block mb-0.5">
                2. Scoring Matrix
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-400 mt-1">
                <li>Initial Allocation: <strong className="text-white">100 Points</strong></li>
                <li>Verified Checkpoint: <strong className="text-emerald-400">+20 Points</strong></li>
                <li>Incorrect Attempt Penalty: <strong className="text-rose-400">-5 Points</strong> per wrong submission</li>
              </ul>
            </div>
          </div>

          {/* Directive 3 */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white uppercase block mb-0.5">
                3. Free Investigation Sequence
              </span>
              <span>
                Stages do NOT require sequential completion. Your team may investigate any envelope and submit answers for any checkpoint in any order.
              </span>
            </div>
          </div>

          {/* Directive 4 */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3">
            <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white uppercase block mb-0.5">
                4. Temporal Freeze
              </span>
              <span>
                NISB Event Control reserves the right to freeze the portal at critical milestones. When frozen, submissions are locked.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg uppercase tracking-wider transition-colors cursor-pointer"
          >
            ACKNOWLEDGE & RETURN
          </button>
        </div>
      </div>
    </div>
  );
}
