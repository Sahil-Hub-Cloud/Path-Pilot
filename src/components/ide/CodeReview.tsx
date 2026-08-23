'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { FiX, FiGitBranch, FiClock, FiCheck, FiX as FiXIcon } from 'react-icons/fi';

interface CodeVersion {
  id: string;
  timestamp: number;
  label: string;
  content: string;
}

interface CodeReviewProps {
  visible: boolean;
  onClose: () => void;
  currentCode: string;
  referenceCode?: string;
  labTitle: string;
}

export default function CodeReview({ visible, onClose, currentCode, referenceCode, labTitle }: CodeReviewProps) {
  const [showReference, setShowReference] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'diff' | 'reference'>('split');

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] flex"
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 50, opacity: 0 }}
          className="relative ml-auto w-full max-w-3xl h-full bg-[#13131A] border-l border-white/10 flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <FiGitBranch size={16} className="text-[#7C3AED]" />
              <div>
                <h3 className="text-sm font-bold text-[#E2E2EE]">Code Review</h3>
                <p className="text-[10px] text-[#888899]">{labTitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-white/5 rounded-lg p-0.5">
                {(['split', 'reference', 'diff'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-colors ${
                      viewMode === mode ? 'bg-[#7C3AED] text-white' : 'text-[#888899] hover:text-[#E2E2EE]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <FiX size={16} className="text-[#888899]" />
              </button>
            </div>
          </div>

          {/* Editor area */}
          <div className="flex-1 flex overflow-hidden">
            {viewMode === 'split' && (
              <>
                <div className="flex-1 flex flex-col border-r border-white/10">
                  <div className="px-4 py-2 border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#888899] flex items-center gap-2">
                    <FiCheck size={10} className="text-[#10B981]" /> Your Code
                  </div>
                  <div className="flex-1">
                    <Editor
                      height="100%"
                      language="python"
                      theme="vs-dark"
                      value={currentCode}
                      options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, padding: { top: 12 } }}
                    />
                  </div>
                </div>
                {referenceCode && (
                  <div className="flex-1 flex flex-col">
                    <div className="px-4 py-2 border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#888899] flex items-center gap-2">
                      <FiGitBranch size={10} className="text-[#7C3AED]" /> Reference Solution
                    </div>
                    <div className="flex-1">
                      <Editor
                        height="100%"
                        language="python"
                        theme="vs-dark"
                        value={referenceCode}
                        options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, padding: { top: 12 } }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {viewMode === 'reference' && referenceCode && (
              <div className="flex-1">
                <Editor
                  height="100%"
                  language="python"
                  theme="vs-dark"
                  value={referenceCode}
                  options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, padding: { top: 12 } }}
                />
              </div>
            )}

            {viewMode === 'diff' && referenceCode && (
              <div className="flex-1">
                <Editor
                  height="100%"
                  language="python"
                  theme="vs-dark"
                  value={currentCode}
                  options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, padding: { top: 12 } }}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/10 text-[10px] text-[#555566]">
            <span>Code review mode — study the reference approach</span>
            <div className="flex items-center gap-2">
              <FiClock size={10} />
              <span>Lines: {currentCode.split('\n').length}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
