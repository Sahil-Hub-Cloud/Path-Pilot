'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiAward, FiFilter, FiUser, FiZap, FiTarget,
  FiHome, FiTrendingUp, FiSettings, FiXCircle, FiBook
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    ...(userProfile?.collegeCode || userProfile?.collegeId ? [{ id: 'materials', label: 'College Materials', icon: <FiBook />, action: () => router.push('/materials') }] : []),
    { id: 'profile',  label: 'Profile',  icon: <FiUser />,      action: () => router.push('/profile') },
    { id: 'leaderboard', label: 'Leaderboard', icon: <FiAward />, action: () => {} },
    { id: 'settings', label: 'Settings', icon: <FiSettings />,  action: () => router.push('/settings') },
  ];

  return (
    <div className="min-h-screen bg-[#FDF6EC] flex flex-col md:flex-row">
      
      {/* ─── SIDEBAR ─── */}
      <AnimatePresence>
        {(isMenuOpen || typeof window !== 'undefined' && window.innerWidth >= 768) && (
          <motion.aside 
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            className="fixed md:sticky top-0 left-0 h-full w-[240px] bg-gradient-to-b from-[#FFF8EE] to-[#F5E8D4] border-r-2 border-[#B48C5A]/20 dark:border-gray-700 flex flex-col z-[100] shadow-2xl md:shadow-none"
          >
            <div className="p-7 flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[#006B7A] to-[#2E7D52] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#006B7A]/30">P</div>
              <span className="font-black text-[17px] text-gray-900 dark:text-gray-100 tracking-tight">Path Pilot</span>
              <button className="md:hidden ml-auto p-1.5 text-gray-800 dark:text-gray-300/50" onClick={() => setIsMenuOpen(false)}><FiXCircle size={20} /></button>
            </div>

            <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
              {sidebarNavItems.map(item => (
                <button key={item.id} onClick={() => { item.action(); setIsMenuOpen(false); }} className={`
                  w-full flex items-center gap-3.5 px-4 py-3 rounded-xl border-none cursor-pointer font-bold text-sm text-left transition-all
                  ${item.id === 'leaderboard' 
                    ? 'bg-gradient-to-br from-[#006B7A] to-[#2E7D52] text-white shadow-lg shadow-[#006B7A]/25 ring-1 ring-white/10' 
                    : 'bg-transparent text-gray-800 dark:text-gray-300 hover:bg-[#B48C5A]/10'}
                `}>
                  <span className="text-xl">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile */}
      {isMenuOpen && <div className="fixed inset-0 bg-[#2C1A0E]/40 backdrop-blur-[2px] z-[90] md:hidden" onClick={() => setIsMenuOpen(false)} />}

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 p-5 md:p-12 lg:p-16 overflow-x-hidden">
        <div className="max-w-[1100px] mx-auto">
          
          <header className="mb-10 flex flex-col md:flex-row justify-between items-start gap-6 md:items-center">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button className="md:hidden p-2 text-gray-800 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-[#B48C5A]/20 dark:border-gray-700 rounded-xl shadow-sm" onClick={() => setIsMenuOpen(true)}>
                <FiFilter size={20} />
              </button>
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight mb-1.5 md:mb-2">Hierarchy & Ranks</h1>
                <p className="text-sm md:text-base text-gray-800 dark:text-gray-300 font-medium opacity-80">Compare your performance against the top pilots.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 md:gap-5 w-full md:w-auto justify-between md:justify-end">
              {user && <NotificationBell uid={user.uid} />}
              <button onClick={handleMyRankScroll} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-b from-[#F07A3E] to-[#D95F2B] text-white rounded-2xl text-[11px] md:text-xs font-black uppercase tracking-widest shadow-xl shadow-[#D95F2B]/30 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                <FiTarget size={16} /> <span className="whitespace-nowrap">My Rank Point</span>
              </button>
            </div>
          </header>

          {/* TAB BAR */}
          <div className="flex flex-wrap gap-2 md:gap-3 mb-8 p-1.5 bg-[#B48C5A]/5 rounded-[18px] border-2 border-[#B48C5A]/15 w-full md:w-fit">
            {[
              { id: 'overall', label: 'Overall', icon: <FiZap /> },
              { id: 'college', label: 'My College', icon: <FiHome /> },
              { id: 'track',   label: 'My Track',   icon: <FiTarget /> },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl border-none cursor-pointer text-xs font-black transition-all
                  ${activeTab === tab.id ? 'bg-white dark:bg-gray-800 text-[#006B7A] shadow-md' : 'bg-transparent text-gray-800 dark:text-gray-300 opacity-70 hover:opacity-100'}`}
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
