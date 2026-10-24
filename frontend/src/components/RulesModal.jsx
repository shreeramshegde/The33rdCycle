import React from 'react';
import { X, ShieldAlert, Award, FileText, CheckCircle2, AlertOctagon, KeyRound } from 'lucide-react';

export default function RulesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#141720] border border-[#282d3b] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        {/* Top Accent Line */}
        <div className="h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-400 w-full" />

        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#282d3b] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-[#dbd4cb] tracking-wider uppercase font-dossier">
              CHRONOS PROTOCOL DIRECTIVES
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1f2432] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 text-sm text-[#dbd4cb] leading-relaxed max-h-[75vh] overflow-y-auto">
          {/* Directive 1 */}
          <div className="p-3.5 rounded-xl bg-[#0b0d12]/80 border border-[#282d3b] flex items-start gap-3">
            <FileText className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white uppercase block mb-0.5 text-xs sm:text-sm">
                1. Physical Dossiers Only
              </span>
              <span className="text-[#8b92a2]">
                No puzzle questions exist on this website. All encoded clues, audio logs, and data sheets are contained inside your physical team envelopes.
              </span>
            </div>
          </div>

          {/* Directive 2 */}
          <div className="p-3.5 rounded-xl bg-[#0b0d12]/80 border border-[#282d3b] flex items-start gap-3">
            <Award className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white uppercase block mb-0.5 text-xs sm:text-sm">
                2. Scoring Matrix
              </span>
              <ul className="list-disc list-inside space-y-1 text-[#8b92a2] mt-1 text-xs sm:text-sm">
                <li>Initial Allocation: <strong className="text-white font-mono">100 Points</strong></li>
                <li>Verified Checkpoint: <strong className="text-emerald-400 font-mono">+20 Points</strong></li>
                <li>Incorrect Attempt Penalty: <strong className="text-rose-400 font-mono">-5 Points</strong> per wrong submission</li>
              </ul>
            </div>
          </div>

          {/* Directive 3 */}
          <div className="p-3.5 rounded-xl bg-[#0b0d12]/80 border border-[#282d3b] flex items-start gap-3">
            <KeyRound className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white uppercase block mb-0.5 text-xs sm:text-sm">
                3. Unique Team Login
              </span>
              <span className="text-[#8b92a2]">
                Your team sets its own unique password on first login. If locked out during the event, request NISB Admin for a password reset without losing your score or checkpoint progress.
              </span>
            </div>
          </div>

          {/* Directive 4 */}
          <div className="p-3.5 rounded-xl bg-[#0b0d12]/80 border border-[#282d3b] flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white uppercase block mb-0.5 text-xs sm:text-sm">
                4. Free Investigation Sequence
              </span>
              <span className="text-[#8b92a2]">
                Checkpoints do not require linear order. Your team may inspect any physical envelope and submit answers in any order.
              </span>
            </div>
          </div>

          {/* Directive 5 */}
          <div className="p-3.5 rounded-xl bg-[#0b0d12]/80 border border-[#282d3b] flex items-start gap-3">
            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white uppercase block mb-0.5 text-xs sm:text-sm">
                5. Portal Freeze
              </span>
              <span className="text-[#8b92a2]">
                NISB Event Control reserves the right to freeze the portal at critical milestones. When frozen, submissions are locked.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0b0d12] border-t border-[#282d3b] flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-dossier font-bold text-sm rounded-lg uppercase tracking-wider transition-colors cursor-pointer"
          >
            ACKNOWLEDGE & RETURN
          </button>
        </div>
      </div>
    </div>
  );
}
