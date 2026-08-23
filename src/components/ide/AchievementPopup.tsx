'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiAward, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';

interface AchievementPopupProps {
  title: string;
  description: string;
  badge?: string;
  xpEarned?: number;
  visible: boolean;
  onClose: () => void;
  autoCloseMs?: number;
}

export default function AchievementPopup({ title, description, badge, xpEarned, visible, onClose, autoCloseMs = 5000 }: AchievementPopupProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300);
      }, autoCloseMs);
      return () => clearTimeout(timer);
    }
  }, [visible, autoCloseMs, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center"
          onClick={() => { setShow(false); onClose(); }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={e => e.stopPropagation()}
            className="relative bg-[#13131A] border border-white/10 rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl"
          >
            <button
              onClick={() => { setShow(false); onClose(); }}
              className="absolute top-4 right-4 p-1 hover:bg-white/5 rounded-lg transition-colors"
            >
              <FiX size={16} className="text-[#555566]" />
            </button>

            {/* Animated badge */}
            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
                boxShadow: '0 0 40px rgba(124,58,237,0.4)',
              }}
            >
              {badge ? (
                <span className="text-3xl">{badge}</span>
              ) : (
                <FiAward size={36} className="text-white" />
              )}
            </motion.div>

            {/* Sparkle effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute top-20 left-1/2 -translate-x-1/2"
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0.5],
                    x: [0, (i % 2 === 0 ? 1 : -1) * (20 + i * 10)],
                    y: [0, -(15 + i * 8)],
                  }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                  className="absolute"
                >
                  <FiStar size={8} className="text-amber-400" />
                </motion.div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h3 className="text-lg font-black text-[#E2E2EE] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                {title}
              </h3>
              <p className="text-sm text-[#888899] mb-4">{description}</p>
              {xpEarned && xpEarned > 0 && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-[#A78BFA] text-sm font-bold">
                  +{xpEarned} XP earned
                </div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface LabCompletePopupProps {
  visible: boolean;
  labTitle: string;
  xpEarned: number;
  passed: number;
  total: number;
  timeSpent: string;
  onClose: () => void;
}

export function LabCompletePopup({ visible, labTitle, xpEarned, passed, total, timeSpent, onClose }: LabCompletePopupProps) {
  const allPass = passed === total;
  const tier = allPass ? 'Excellent' : passed / total >= 0.7 ? 'Good Work' : 'Getting There';
  const tierColor = allPass ? '#10B981' : passed / total >= 0.7 ? '#3B82F6' : '#F59E0B';

  return (
    <AchievementPopup
      visible={visible}
      title={allPass ? 'Lab Complete!' : `${tier}!`}
      description={`${passed}/${total} tests passed · ${timeSpent}`}
      badge={allPass ? '🏆' : passed / total >= 0.7 ? '⭐' : '💪'}
      xpEarned={xpEarned}
      onClose={onClose}
      autoCloseMs={8000}
    />
  );
}
