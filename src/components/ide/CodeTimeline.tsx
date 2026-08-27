'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiX, FiRotateCcw } from 'react-icons/fi';
import CodeEditor from '@/components/ide/CodeEditor';

interface CodeSnapshot {
  timestamp: number;
  content: string;
  label: string;
}

interface CodeTimelineProps {
  snapshots: CodeSnapshot[];
  visible: boolean;
  onClose: () => void;
  onRestore: (content: string) => void;
}

export default function CodeTimeline({ snapshots, visible, onClose, onRestore }: CodeTimelineProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const sortedSnapshots = useMemo(() =>
    [...snapshots].sort((a, b) => b.timestamp - a.timestamp),
    [snapshots]
  );

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatRelative = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] flex"
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          className="relative w-80 h-full bg-[#13131A] border-r border-white/10 flex flex-col shadow-2xl"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <FiClock size={16} className="text-[#7C3AED]" />
              <h3 className="text-sm font-bold text-[#E2E2EE]">Code Timeline</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <FiX size={16} className="text-[#888899]" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {sortedSnapshots.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-[#555566] text-sm">
                <FiClock size={24} className="mb-2 opacity-40" />
                <p>No snapshots yet</p>
                <p className="text-[10px] mt-1">Code versions are saved as you type</p>
              </div>
            ) : (
              <div className="p-4">
                {sortedSnapshots.map((snap, i) => (
                  <div key={i} className="mb-3 last:mb-0">
                    <button
                      onClick={() => setSelected(selected === i ? null : i)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        selected === i
                          ? 'border-[#7C3AED]/40 bg-[#7C3AED]/10'
                          : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#E2E2EE]">{snap.label}</span>
                        <span className="text-[10px] text-[#555566]">{formatRelative(snap.timestamp)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#888899]">{formatTime(snap.timestamp)}</span>
                        <span className="text-[10px] text-[#888899]">{snap.content.split('\n').length} lines</span>
                      </div>
                    </button>

                    <AnimatePresence>
                      {selected === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 200, opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-2 rounded-xl border border-white/10 overflow-hidden"
                        >
                          <CodeEditor
                            height="100%"
                            language="python"
                            value={snap.content}
                            readOnly
                            fontSize={11}
                          />
                          <div className="flex gap-2 p-2 bg-[#0D0D0F] border-t border-white/10">
                            <button
                              onClick={() => { onRestore(snap.content); onClose(); }}
                              className="flex-1 flex items-center justify-center gap-2 py-1.5 bg-[#7C3AED]/20 border border-[#7C3AED]/30 rounded-lg text-[10px] font-bold text-[#A78BFA] hover:bg-[#7C3AED]/30 transition-colors"
                            >
                              <FiRotateCcw size={10} /> Restore
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-5 py-3 border-t border-white/10 text-[10px] text-[#555566]">
            {sortedSnapshots.length} snapshot{sortedSnapshots.length !== 1 ? 's' : ''} saved
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
