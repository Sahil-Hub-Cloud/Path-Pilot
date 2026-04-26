'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiCheckCircle, FiAlertTriangle, FiZap, FiAward, FiClock, FiX } from 'react-icons/fi';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, where, getDocs, writeBatch } from 'firebase/firestore';
import { AppNotification, markAllAsRead } from '@/lib/notifications';

interface NotificationBellProps {
  uid: string;
}

const TYPE_ICONS: Record<string, React.ReactElement> = {
  streak: <FiZap style={{ color: '#D95F2B' }} />,
  lab: <FiCheckCircle style={{ color: '#10B981' }} />,
  employability: <FiAward style={{ color: '#F59E0B' }} />,
  inactivity: <FiClock style={{ color: '#8B6E52' }} />,
  system: <FiAlertTriangle style={{ color: '#3B82F6' }} />,
};

export default function NotificationBell({ uid }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  // 1. Real-time subscription to notifications
  useEffect(() => {
    if (!db || !uid) return;

    const q = query(
      collection(db, 'users', uid, 'notifications'),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as AppNotification));
      setNotifications(data);
      const unread = snap.docs.filter(d => !d.data().read).length;
      setUnreadCount(unread);
    });

    return () => unsubscribe();
  }, [uid]);

  // 2. Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const togglePanel = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      // Mark as read when opening
      await markAllAsRead(uid);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      
      {/* Bell Button */}
      <button 
        onClick={togglePanel}
        className="skeu-inset"
        style={{
          width: 44, height: 44, borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: unreadCount > 0 ? '#006B7A' : '#8B6E52',
          cursor: 'pointer', border: 'none', position: 'relative',
          background: 'rgba(255,255,255,0.7)', transition: 'all 0.2s',
        }}
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            style={{
              position: 'absolute', top: 10, right: 10,
              width: 18, height: 18, borderRadius: '50%',
              background: '#D95F2B', border: '2px solid #fff',
              color: '#fff', fontSize: 9, fontWeight: 900,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="clay-card"
            style={{
              position: 'absolute', top: 56, right: 0,
              width: 320, maxHeight: 440, overflow: 'hidden',
              display: 'flex', flexDirection: 'column', zIndex: 1000,
              background: '#fff', border: '2.5px solid rgba(180,140,90,0.2)'
            }}
          >
            <div style={{ padding: '20px 24px', borderBottom: '1.5px solid rgba(180,140,90,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#2C1A0E' }}>Notifications</h3>
              <button onClick={() => setIsOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#8B6E52' }}>
                <FiX />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 12 }}>🔔</div>
                  <p style={{ fontSize: 13, color: '#8B6E52', fontWeight: 600 }}>All systems nominal.<br/>No new alerts.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className="notif-item"
                    style={{
                      padding: '16px 24px',
                      borderBottom: '1px solid rgba(180,140,90,0.05)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 14 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(180,140,90,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {TYPE_ICONS[notif.type] || <FiBell />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 13, color: '#2C1A0E', marginBottom: 2 }}>{notif.title}</div>
                        <div style={{ fontSize: 11, color: '#5C3D1E', fontWeight: 500, lineHeight: 1.5 }}>{notif.message}</div>
                        {notif.timestamp && (
                          <div style={{ fontSize: 9, color: '#8B6E52', fontWeight: 700, marginTop: 6, textTransform: 'uppercase' }}>
                            {notif.timestamp.toDate ? new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(notif.timestamp.toDate()) : 'Now'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ padding: '14px', background: '#FDF6EC', textAlign: 'center', borderTop: '1.5px solid rgba(180,140,90,0.1)' }}>
              <button onClick={() => setIsOpen(false)} style={{ fontSize: 11, fontWeight: 800, color: '#006B7A', border: 'none', background: 'none', cursor: 'pointer' }}>
                DISMISS COMMAND CENTER
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .notif-item:hover {
          background: rgba(180,140,90,0.03);
        }
      `}</style>

    </div>
  );
}
