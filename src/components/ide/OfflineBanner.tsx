'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiWifi, FiWifiOff, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

interface OfflineBannerProps {
  isOffline: boolean;
  showReconnectToast: boolean;
}

export default function OfflineBanner({ isOffline, showReconnectToast }: OfflineBannerProps) {
  return (
    <>
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-500/10 border-b border-amber-500/20 overflow-hidden"
          >
            <div className="flex items-center justify-center gap-3 px-4 py-2">
              <FiWifiOff size={14} className="text-amber-500" />
              <span className="text-[10px] md:text-xs font-bold text-amber-200 tracking-wide">
                Offline Mode — Code saved locally. Execution paused until reconnected.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReconnectToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-3 shadow-xl"
            style={{ background: '#10B981', color: '#fff', boxShadow: '0 10px 25px -5px rgba(16,185,129,0.4)' }}
          >
            <FiCheckCircle size={18} />
            <span>Back online! Syncing your work...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
