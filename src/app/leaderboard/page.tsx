'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiAward, FiFilter, FiUser, FiZap, FiTarget,
  FiHome, FiTrendingUp, FiSettings
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, where, getDocs, doc } from 'firebase/firestore';
import { fetchResilient } from '@/lib/firestore-resilience';
import Leaderboard from '@/components/Leaderboard';
import NotificationBell from '@/components/NotificationBell';

type Tab = 'overall' | 'college' | 'track';

const S = {
  bg: '#FDF6EC',
  card: '#FFFFFF',
  text: '#2C1A0E',
  sub: '#5C3D1E',
  border: 'rgba(180,140,90,0.2)',
  accent: '#D95F2B',
  teal: '#006B7A',
};

export default function LeaderboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState<Tab>('overall');
  const [pilots, setPilots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  // 1. Fetch current user profile to get filtering metadata
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
      return;
    }

    if (user) {
      const loadProfile = async () => {
        const snap = await fetchResilient(doc(db, 'users', user.uid));
        if (snap?.exists()) {
          setUserProfile(snap.data());
        }
      };
      // Need 'doc' import
      loadProfile();
    }
  }, [user, authLoading, router]);

  // 2. Fetch leaderboard data based on active tab
  useEffect(() => {
    if (authLoading || !user) return;

    const fetchPilots = async () => {
      setLoading(true);
      try {
        let q;
        const usersRef = collection(db, 'users');

        if (activeTab === 'college' && userProfile?.college) {
          q = query(
            usersRef, 
            where('college', '==', userProfile.college),
            orderBy('xp', 'desc'),
            limit(50)
          );
        } else if (activeTab === 'track' && userProfile?.learningPath) {
          q = query(
            usersRef, 
            where('learningPath', '==', userProfile.learningPath),
            orderBy('xp', 'desc'),
            limit(50)
          );
        } else {
          // Default: Overall
          q = query(usersRef, orderBy('xp', 'desc'), limit(50));
        }

        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
        setPilots(data);
      } catch (err) {
        console.error('Leaderboard fetch failed:', err);
        // Fallback or empty state
        setPilots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPilots();
  }, [activeTab, user, authLoading, userProfile]);

  const handleMyRankScroll = () => {
    window.dispatchEvent(new CustomEvent('scroll-to-my-rank'));
  };

  if (authLoading) return null;

  const sidebarNavItems = [
    { id: 'home',     label: 'Home',     icon: <FiHome />,      action: () => router.push('/dashboard') },
    { id: 'progress', label: 'Progress', icon: <FiTrendingUp />, action: () => router.push('/progress') },
    { id: 'profile',  label: 'Profile',  icon: <FiUser />,      action: () => router.push('/profile') },
    { id: 'leaderboard', label: 'Leaderboard', icon: <FiAward />, action: () => {} },
    { id: 'settings', label: 'Settings', icon: <FiSettings />,  action: () => router.push('/settings') },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: S.bg, display: 'flex' }}>
      
      {/* ─── SIDEBAR ─── */}
      <aside style={{
        position: 'fixed', left: 0, top: 0, height: '100%', width: 240,
        background: 'linear-gradient(180deg, #FFF8EE 0%, #F5E8D4 100%)',
        borderRight: `2px solid ${S.border}`,
        display: 'flex', flexDirection: 'column', zIndex: 100
      }}>
        <div style={{ padding: '28px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #006B7A, #2E7D52)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 900, fontSize: 18,
            boxShadow: '0 4px 12px rgba(0,107,122,0.35)'
          }}>P</div>
          <span style={{ fontWeight: 900, fontSize: 16, color: S.text }}>Path Pilot</span>
        </div>

        <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {sidebarNavItems.map(item => (
            <button key={item.id} onClick={item.action} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: 14, textAlign: 'left',
              transition: 'all 0.2s ease',
              background: item.id === 'leaderboard' ? 'linear-gradient(135deg, #006B7A, #2E7D52)' : 'transparent',
              color: item.id === 'leaderboard' ? '#fff' : S.sub,
              boxShadow: item.id === 'leaderboard' ? '0 4px 14px rgba(0,107,122,0.35), inset 0 1px 0 rgba(255,255,255,0.2)' : 'none'
            }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main style={{ flex: 1, marginLeft: 240, padding: '48px 64px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          
          <header style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: S.text, letterSpacing: '-0.04em', marginBottom: 8 }}>Hierarchy & Ranks</h1>
              <p style={{ color: S.sub, fontWeight: 500 }}>Compare your terminal output against the top pilots in the sector.</p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {user && <NotificationBell uid={user.uid} />}
              <button 
                onClick={handleMyRankScroll}
                className="clay-btn"
                style={{
                  background: 'linear-gradient(180deg, #F07A3E 0%, #D95F2B 50%, #B04A1E 100%)',
                  color: '#fff', padding: '12px 24px', borderRadius: 14, fontSize: 13,
                  fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em',
                  boxShadow: '0 6px 20px rgba(217,95,43,0.3)', cursor: 'pointer', border: 'none'
                }}
              >
                <FiTarget style={{ marginRight: 8 }} /> My Rank Point
              </button>
            </div>
          </header>

          {/* TAB BAR */}
          <div style={{ 
            display: 'flex', gap: 12, marginBottom: 32, padding: 6, 
            background: 'rgba(180,140,90,0.05)', borderRadius: 16, border: `1.5px solid ${S.border}`,
            width: 'fit-content'
          }}>
            {[
              { id: 'overall', label: 'Overall', icon: <FiZap /> },
              { id: 'college', label: 'My College', icon: <FiHome /> },
              { id: 'track',   label: 'My Track',   icon: <FiTarget /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 800, transition: 'all 0.2s',
                  background: activeTab === tab.id ? '#FFF' : 'transparent',
                  color: activeTab === tab.id ? S.teal : S.sub,
                  boxShadow: activeTab === tab.id ? '0 4px 12px rgba(140,90,40,0.1)' : 'none'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* DATA SOURCE INDICATOR */}
          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
             <span className="clay-badge" style={{ background: 'rgba(0,107,122,0.1)', color: S.teal, fontSize: 10 }}>
               LIVE SYNC ACTIVE
             </span>
             {activeTab === 'college' && (
               <span style={{ fontSize: 12, fontWeight: 700, color: S.sub }}>
                 Filtering for: <span style={{ color: S.accent }}>{userProfile?.college || 'Institution'}</span>
               </span>
             )}
             {activeTab === 'track' && (
               <span style={{ fontSize: 12, fontWeight: 700, color: S.sub }}>
                 Sector: <span style={{ color: S.accent }}>{userProfile?.learningPath || 'Track'}</span>
               </span>
             )}
          </div>

          {/* LEADERBOARD TABLE */}
          <Leaderboard 
            users={pilots} 
            currentUserId={user?.uid} 
            isLoading={loading} 
          />

          <p style={{ marginTop: 32, fontSize: 11, color: S.sub, textAlign: 'center', fontWeight: 600 }}>
            Rankings are updated every time a lab is submitted or XP is earned.
          </p>

        </div>
      </main>

      <style jsx global>{`
        .clay-btn:active { transform: translateY(2px); }
        .clay-card {
            background: #FFFFFF;
            border: 2px solid rgba(180,140,90,0.25);
            box-shadow: 0 8px 24px rgba(140,90,40,0.08);
        }
      `}</style>

    </div>
  );
}
