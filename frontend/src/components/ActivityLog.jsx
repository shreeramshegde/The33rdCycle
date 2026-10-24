import React, { useState } from 'react';
import { History, ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react';

export default function ActivityLog({ logs = [] }) {
  // Collapsed by default on mobile, openable with toggle
  const [isOpen, setIsOpen] = useState(false);

  if (!logs || logs.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#141720]/90 border border-[#282d3b] rounded-xl overflow-hidden backdrop-blur-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#181c26]/80 hover:bg-[#1e2330] border-b border-[#282d3b] flex items-center justify-between text-left transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <History className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#dbd4cb]">
            Submission Activity Log (<span className="font-mono">{logs.length}</span>)
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {isOpen && (
        <div className="p-2.5 sm:p-4 max-h-56 overflow-y-auto space-y-1.5 text-xs">
          {logs.map((log, idx) => (
            <div
              key={idx}
              className={`p-2 sm:p-2.5 rounded-lg border flex items-center justify-between gap-2 ${
                log.isCorrect
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {log.isCorrect ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                )}
                <div className="truncate">
                  <span className="font-bold text-[#dbd4cb]">[{log.checkpointId}]</span>{' '}
                  <span className="text-slate-400 font-mono">#{log.attemptNumber}:</span>{' '}
                  <span className={log.isCorrect ? 'text-emerald-300 font-semibold' : 'text-rose-300'}>
                    {log.isCorrect ? 'VERIFIED' : 'MISMATCH'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-bold font-mono ${
                    log.pointsAwarded > 0
                      ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-900/60 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {log.pointsAwarded > 0 ? `+${log.pointsAwarded}` : log.pointsAwarded} PTS
                </span>
                <span className="text-[10px] text-slate-500 hidden sm:inline font-mono">
                  {log.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
