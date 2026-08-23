'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiClipboard, FiAlertTriangle } from 'react-icons/fi';

interface PasteIndicatorProps {
  pasteCount: number;
  totalXPLost: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastPasteMessage: string;
  visible: boolean;
}

export default function PasteIndicator({ pasteCount, totalXPLost, riskLevel, lastPasteMessage, visible }: PasteIndicatorProps) {
  if (!visible || pasteCount === 0) return null;

  const riskColors = {
    low: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#10B981' },
    medium: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#F59E0B' },
    high: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', text: '#EF4444' },
  };

  const colors = riskColors[riskLevel];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold"
          style={{
            background: colors.bg,
            border: `1px solid ${colors.border}`,
            color: colors.text,
          }}
        >
          {riskLevel === 'high' ? (
            <FiAlertTriangle size={12} />
          ) : (
            <FiClipboard size={12} />
          )}
          <span>{pasteCount} paste{pasteCount !== 1 ? 's' : ''}</span>
          {totalXPLost > 0 && (
            <span className="opacity-70">· −{totalXPLost} XP</span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface PasteToastProps {
  message: string;
  visible: boolean;
  isSuspicious: boolean;
}

export function PasteToast({ message, visible, isSuspicious }: PasteToastProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xl pointer-events-none"
          style={{
            background: isSuspicious ? 'rgba(239,68,68,0.95)' : 'rgba(245,158,11,0.95)',
            color: '#fff',
            border: `1px solid ${isSuspicious ? 'rgba(239,68,68,0.5)' : 'rgba(245,158,11,0.5)'}`,
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
