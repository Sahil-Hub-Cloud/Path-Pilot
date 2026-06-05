'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiBook, FiTerminal, FiCpu,
  FiTrendingUp, FiUser, FiLogOut, FiZap,
  FiAward, FiExternalLink, FiActivity, FiArrowRight, FiSettings,
  FiMenu, FiX, FiBriefcase, FiGrid, FiCalendar, FiClock
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';
import { fetchResilient } from '@/lib/firestore-resilience';
import { addNotification } from '@/lib/notifications';
import SkillGraph from '@/components/dashboard/SkillGraph';
import NotificationBell from '@/components/NotificationBell';
import { TRACK_DEFAULT_LAB } from '@/lib/data/labs';
import { ROADMAPS, COURSE_SLUG_MAP } from '@/lib/data/roadmaps';
import { getCourseIdFromLabel } from '@/lib/data/course-map';

interface UserProfile {
  displayName?: string;
  email?: string;
  role?: string;
  learningPath?: string;
  proficiencyLevel?: string;
  onboardingComplete?: boolean;
  createdAt?: string;
  streak?: number;
  labsCompleted?: number;
  skillScore?: number;
  employabilityScore?: number;
  employabilityLevel?: string;
  nextRecommendedTopic?: string;
  recommendationReason?: string;
  collegeId?: string;
  collegeCode?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user: authUser, isReady } = useAuthGuard();
  const { user, signOut } = useAuth();
  const [activeNav, setActiveNav] = useState('home');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [streakDays, setStreakDays] = useState(0);
  const [inactiveGap, setInactiveGap] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [exams, setExams] = useState<any[]>([]);

  useEffect(() => {
    if (!profile?.collegeId || !db) return;
    const fetchExams = async () => {
      try {
        // ISSUE 2 FIX: Fetch exams from isolated colleges/{collegeId}/exams subcollection
        const snap = await getDocs(collection(db, 'colleges', profile.collegeId!, 'exams'));
        const examList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        examList.sort((a: any, b: any) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());
        setExams(examList.filter((e: any) => new Date(e.examDate).getTime() > Date.now() - 24 * 60 * 60 * 1000));
      } catch (err) {
        console.error("Failed to load exams", err);
      }
    };
    fetchExams();
  }, [profile?.collegeId]);

  // ── Streak sync helper ────────────────────────────────────────────────────
  // Returns today's date as a YYYY-MM-DD string in IST (UTC+5:30)
  const getTodayIST = () => {
    // Current time in IST (UTC+5:30)
    const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' } as const;
    const parts = new Intl.DateTimeFormat('en-IN', options).formatToParts(new Date());
    const day = parts.find(p => p.type === 'day')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const year = parts.find(p => p.type === 'year')?.value;
    return `${year}-${month}-${day}`;
  };

  const sendEmail = async (to: string, subject: string, html: string) => {
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, html })
      });
    } catch (err) {
      console.warn('Email send failed:', err);
    }
  };

  const syncStreak = async (uid: string, currentStreak: number, lastActive: string | undefined) => {
    const todayStr = getTodayIST();
    let newStreak = currentStreak;

    if (!lastActive) {
      // 1. If lastActive is null or undefined: set streakDays to 1, set lastActiveDate to today
      newStreak = 1;
    } else {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const lastActiveDate = new Date(lastActive)
      lastActiveDate.setHours(0, 0, 0, 0)

      const diffTime = today.getTime() - lastActiveDate.getTime()
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        // Already logged in today — keep streak
        newStreak = currentStreak
      } else if (diffDays === 1) {
        // Logged in yesterday — increment
        newStreak = currentStreak + 1
        
        // Milestone notifications
        if ([3, 7, 14, 30, 50, 100].includes(newStreak)) {
          const msg = `🔥 Outstanding! You've hit a ${newStreak}-day streak. The sector is watching.`;
          await addNotification(uid, 'streak', 'Streak Milestone', msg);
        }
      } else {
        // Missed days — reset
        newStreak = 1
        await addNotification(uid, 'inactivity', 'Sector Offline', `You were offline for ${diffDays} days. Streak has been reset, but your progress is safe.`);
        
        if (user?.email) {
          sendEmail(user.email, 'Welcome back to Path Pilot! 🚀', `
            <div style="font-family: sans-serif; color: #2C1A0E;">
              <h2>The Cockpit is Active!</h2>
              <p>It's been <b>${diffDays} days</b> since your last session. Your streak has reset to 1, but your hard-earned progress remains intact.</p>
              <p>Ready to resume your mission?</p>
              <a href="https://pathpilot.dev/dashboard" style="background: #006B7A; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 12px; display: inline-block; font-weight: 700;">Resume Training</a>
            </div>
          `);
        }
      }
    }

    setStreakDays(newStreak);

    // Update Firestore with new streak and today's date
    try {
      if (db) {
        await updateDoc(doc(db, 'users', uid), {
          streakDays:      newStreak,
          lastActiveDate:  today,           // YYYY-MM-DD in IST
          lastActiveTs:    serverTimestamp(),
        });
      }
    } catch (err) {
      console.warn('Dashboard: streak update failed:', err);
    }
  };

  // Load real user profile from Firestore (with localStorage fallback for offline)
  useEffect(() => {
    if (!user) return;
    setProfileLoading(true);

    const loadProfile = async () => {
      // First, check localStorage for profile data saved during onboarding (offline fallback)
      const profileKey = 'pp_profile_' + user.uid;
      const localProfile = localStorage.getItem(profileKey);
      if (localProfile) {
        try {
          setProfile(prev => ({ ...prev, ...JSON.parse(localProfile) }));
        } catch {}
      }

      try {
        if (db) {
          const docResult = await fetchResilient(doc(db, 'users', user.uid), 4000);
          if (docResult && docResult.exists()) {
            const data = docResult.data() as UserProfile;
            setProfile(data);
            
            if (data.role && data.role !== 'student') {
              if (data.role === 'company') router.push('/company/dashboard');
              else if (data.role === 'college') router.push('/college/dashboard');
              else if (data.role === 'admin') router.push('/admin/dashboard');
              return;
            }

            // Clear the UID-scoped localStorage cache once Firestore is available
            localStorage.removeItem('pp_profile_' + user.uid);

            // streakDays / lastActiveDate handle migration
            const existingStreak = (data as any).streakDays ?? (data as any).streak ?? 0;
            const lastActiveDate = (data as any).lastActiveDate ?? (data as any).lastActive;
            await syncStreak(user.uid, existingStreak, lastActiveDate);
          } else {
            // Doc doesn't exist yet — first load after sign-up
            setStreakDays(1);
            await syncStreak(user.uid, 0, undefined);
          }
        }
      } catch (err) {
        console.warn('Dashboard: Could not load profile from Firestore:', err);
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps


  // Show loading skeleton while auth resolves or redirect is pending
  if (!isReady) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #006B7A, #2E7D52)', borderRadius: 10, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <Image src="/logo.webp" alt="Path Pilot" width={40} height={40} style={{ objectFit: 'contain' }} />
          </div>
          <div style={{ fontWeight: 700, color: '#8B6E52', fontSize: 14 }}>Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  // Real data from Firebase Auth + Firestore
  const displayName = profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Scholar';
  const firstName = displayName.split(' ')[0];
  const learningPath = profile?.learningPath || null;
  const proficiencyLevel = profile?.proficiencyLevel || null;
  const labsCompleted = profile?.labsCompleted ?? 0;
  const skillScore = profile?.skillScore ?? 0;
  // Use locally-computed streakDays (already synced to Firestore above)
  // Fallback to profile fields while sync is in-flight
  const streak = streakDays > 0 ? streakDays : ((profile as any)?.streakDays ?? profile?.streak ?? 0);
  const employabilityScore = profile?.employabilityScore ?? 0;
  const employabilityLevel = profile?.employabilityLevel ?? 'Unrated';
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Recently joined';

  const empColor = employabilityLevel.includes('High') ? '#10B981' : employabilityLevel === 'Medium' ? '#F59E0B' : '#EF4444';

  const courseId = getCourseIdFromLabel(learningPath);

  // Resolve the first lab for this student's track
  const firstLabId = TRACK_DEFAULT_LAB[learningPath || ''] ?? 'lab-001';

  // Greeting based on time of day
  const getGreeting = () => {
    if (typeof window === 'undefined') return 'Welcome';
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const userRole = profile?.role || 'student';

  // Base nav items visible to all students
  const baseNavItems = [
    { id: 'home',        label: 'Home',        icon: <FiHome />,       action: () => {} },
    { id: 'learn',       label: 'Learn',       icon: <FiBook />,       action: () => router.push(`/learn/${courseId}`) },
    { id: 'labs',        label: 'Labs',        icon: <FiTerminal />,   action: () => router.push('/labs') },
    ...(profile?.collegeId || profile?.collegeCode ? [{ id: 'materials', label: 'College Materials', icon: <FiBook />, action: () => router.push('/materials') }] : []),
    { id: 'tutor',       label: 'AI Tutor',    icon: <FiCpu />,        action: () => router.push('/chat') },
    { id: 'progress',    label: 'Progress',    icon: <FiTrendingUp />, action: () => router.push('/progress') },
    { id: 'profile',     label: 'Profile',     icon: <FiUser />,       action: () => router.push('/profile') },
    { id: 'leaderboard', label: 'Leaderboard', icon: <FiAward />,      action: () => router.push('/leaderboard') },
    { id: 'settings',    label: 'Settings',    icon: <FiSettings />,   action: () => router.push('/settings') },
  ];

  const navItems = baseNavItems;

  return (
    <div className="min-h-screen bg-[var(--bg-cream)] text-[var(--text-dark)] flex flex-col md:flex-row relative transition-colors duration-300">
      
      {/* ─── MOBILE TOP BAR ─── */}
      <header className="md:hidden sticky top-0 z-[110] bg-[var(--bg-cream-light)]/90 backdrop-blur-md border-b-2 border-[var(--border-clay)] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center overflow-hidden">
             <Image src="/logo.webp" alt="Path Pilot" width={32} height={32} className="object-contain" />
          </div>
          <span className="font-black text-lg text-gray-900 dark:text-white tracking-tight">Path Pilot</span>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-800 dark:text-gray-300 hover:bg-[#B48C5A]/10 rounded-lg transition-colors">
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </header>

      {/* Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-[#2C1A0E]/40 backdrop-blur-sm z-[100] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* ─── SIDEBAR ─── */}
      <aside 
        className={`
          fixed md:sticky left-0 top-0 h-full w-[260px] 
          bg-gradient-to-b from-[#FFF8EE] to-[#F5E8D4] 
          border-r-2 border-[#B48C5A]/25 dark:border-gray-700 
          flex flex-col z-[105] 
          transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          shadow-xl md:shadow-none
        `}
      >
        <div className="hidden md:flex p-7 px-6 items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center overflow-hidden">
            <Image src="/logo.webp" alt="Path Pilot" width={36} height={36} className="object-contain" />
          </div>
          <span className="font-black text-base text-gray-900 dark:text-white tracking-tight">Path Pilot</span>
        </div>

        {/* User avatar */}
        <div className="px-4 pb-5 border-b-1.5 border-[#B48C5A]/20 dark:border-gray-700 mx-3 mb-3">
          <div className="flex items-center gap-3 p-2.5 bg-[var(--surface-raised)]/60 rounded-xl border-1.5 border-[var(--border-clay)] shadow-sm">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#006B7A] to-[#2E7D52] flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0">
              {firstName[0]?.toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="font-bold text-sm text-gray-900 dark:text-white truncate">{firstName}</div>
              <div className="text-[10px] text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wider">{profile?.role || 'Student'}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 flex flex-col gap-1 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setActiveNav(item.id); setIsMenuOpen(false); item.action(); }} 
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl border-none cursor-pointer
                font-bold text-sm text-left transition-all duration-200
                ${activeNav === item.id 
                  ? 'bg-gradient-to-br from-[#006B7A] to-[#2E7D52] text-white shadow-lg shadow-[#006B7A]/30' 
                  : 'text-gray-800 dark:text-gray-300 hover:bg-[#B48C5A]/10'}
              `}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 px-3">
          <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-none cursor-pointer font-bold text-sm text-[#D95F2B] hover:bg-[#D95F2B]/10 transition-colors">
            <FiLogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-x-hidden min-w-0">
        
        {/* GREETING */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
              {getGreeting()}, {firstName}!
            </h1>
            <p style={{ color: '#8B6E52', fontSize: 14, fontWeight: 500 }}>
              {learningPath
                ? `You're learning ${learningPath}${proficiencyLevel ? ` · ${proficiencyLevel} level` : ''}. Keep the momentum going.`
                : 'Welcome to Path Pilot. Complete onboarding to get your personalized roadmap.'}
            </p>
            {memberSince && <p style={{ color: '#B89A7E', fontSize: 12, fontWeight: 500, marginTop: 2 }}>Member since {memberSince}</p>}
          </div>
          {user && <NotificationBell uid={user.uid} />}
        </div>

        {/* YOUR NEXT MISSION */}
        {profile?.nextRecommendedTopic && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => router.push(`/learn/${courseId}`)}
            className="group relative overflow-hidden bg-gradient-to-br from-[#006B7A] to-[#2E7D52] rounded-[24px] p-8 mb-8 cursor-pointer shadow-xl shadow-[#006B7A]/25"
          >
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 dark:bg-gray-800/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white dark:bg-gray-800/15 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-white/20 dark:border-gray-700">
                  🚀
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mb-2">Your Next Mission</div>
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight mb-2">
                    {(() => {
                      const roadmap = ROADMAPS[courseId];
                      const topic = roadmap?.chapters.flatMap(ch => ch.topics).find(t => t.id === profile.nextRecommendedTopic);
                      return topic?.title || 'Next Module';
                    })()}
                  </h2>
                  <p className="text-white/80 font-bold text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                    {profile.recommendationReason}
                  </p>
                </div>
              </div>
              <button className="bg-white dark:bg-gray-800 text-[#006B7A] dark:text-white px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg group-hover:scale-105 transition-all">
                Launch Mission
              </button>
            </div>
          </motion.div>
        )}

        {/* NUDGE CARD */}
        {inactiveGap > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between bg-[var(--surface-raised)] border-2 border-[var(--border-clay)] rounded-[20px] p-6 md:p-7 mb-8 gap-6 shadow-md shadow-amber-500/10"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#fef9c3] border-2 border-[#fde047] rounded-full flex items-center justify-center text-2xl shadow-md shadow-yellow-400/25 flex-shrink-0">
                ⚠️
              </div>
              <div>
                <h3 className="m-0 text-lg md:text-xl font-black text-[#92400e] tracking-tight leading-tight">
                  You have not practiced in {inactiveGap} days. Your streak is at risk!
                </h3>
                <p className="m-0 mt-1 text-sm text-[#b45309] font-semibold">
                  Pick up where you left off.
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push(`/learn/${courseId}`)}
              className="w-full md:w-auto bg-gradient-to-br from-[#d97706] to-[#b45309] text-white border-none py-3 px-6 rounded-xl font-extrabold cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-transform active:scale-95"
            >
              Resume Path <FiArrowRight />
            </button>
          </motion.div>
        )}

        {/* MY EXAMS (COLLEGE STUDENTS ONLY) */}
        {profile?.collegeId && exams.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiCalendar /> Upcoming Exams
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {exams.map(exam => {
                const eDate = new Date(exam.examDate);
                const diffDays = Math.ceil((eDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                const color = diffDays < 3 ? '#EF4444' : diffDays <= 7 ? '#F59E0B' : '#10B981';
                
                return (
                  <div key={exam.id} className="bg-white dark:bg-gray-800 rounded-[20px] border-2 border-[#B48C5A]/25 dark:border-gray-700 p-6 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-[10px] font-black uppercase tracking-wider bg-[#FDF6EC] text-gray-600 dark:text-gray-400 px-2 py-1 rounded-md border border-[#B48C5A]/20 dark:border-gray-700">
                          {exam.subjectName}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-black px-2 py-1 rounded-md bg-opacity-10" style={{ color, backgroundColor: `${color}15` }}>
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                          {diffDays <= 0 ? 'Today' : `${diffDays} Days`}
                        </div>
                      </div>
                      <h3 className="font-black text-gray-900 dark:text-white text-lg leading-tight mb-2">{exam.examName}</h3>
                      <div className="text-gray-600 dark:text-gray-400 font-semibold text-xs flex items-center gap-2 mb-4">
                        <FiClock /> {eDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {eDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <button 
                      onClick={() => router.push(`/materials/${exam.subjectId}`)} 
                      className="w-full bg-[#FDF6EC] hover:bg-[#F5E8D4] text-gray-800 dark:text-gray-300 border-2 border-[#B48C5A]/20 dark:border-gray-700 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      Start Revision <FiArrowRight />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { 
              label: 'AI Skill Score', 
              value: skillScore > 0 ? skillScore.toString() : '—', 
              sub: skillScore > 0 ? 'Based on your performance' : 'Complete labs to earn a score', 
              icon: <FiAward />, color: '#006B7A' 
            },
            { 
              label: 'Labs Completed', 
              value: labsCompleted.toString(), 
              sub: labsCompleted > 0 ? 'Great progress!' : 'Start your first lab', 
              icon: <FiTerminal />, color: '#2E7D52' 
            },
            { 
              label: 'Streak', 
              value: streak > 0 ? `${streak} days` : '0 days', 
              sub: streak > 0 ? 'Keep it going!' : 'Log in daily to build a streak', 
              icon: <FiZap />, color: '#D95F2B' 
            },
            {
              label: 'Employability',
              value: employabilityLevel,
              sub: employabilityScore > 0 ? `Score: ${employabilityScore}/100` : 'Complete labs to get rated',
              icon: <FiActivity />, color: empColor
            },
          ].map((s, i) => (
            <motion.div key={i} whileHover={{ y: -4 }} style={{
              background: 'var(--surface-raised)', borderRadius: 20,
              border: '2px solid var(--border-clay)', padding: '24px 22px',
              boxShadow: '0 2px 0 rgba(255,255,255,0.1) inset, 0 8px 24px var(--shadow-clay)',
            }}>
              <div style={{
                width: 40, height: 40,
                background: `${s.color}15`,
                border: `2px solid ${s.color}30`,
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: s.color, fontSize: 18, marginBottom: 14
              }}>
                {s.icon}
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-dark)', letterSpacing: '-0.04em', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-light)', fontWeight: 500, marginTop: 2 }}>{s.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* WEEKLY SUMMARY BANNER */}
        <motion.div
           onClick={() => router.push('/progress/weekly')}
           className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-gray-800/70 border-1.5 border-[#B48C5A]/20 dark:border-gray-700 rounded-[20px] p-5 md:p-6 mb-8 cursor-pointer shadow-sm shadow-stone-800/5 backdrop-blur-md hover:bg-white dark:hover:bg-gray-800/90 hover:-translate-y-0.5 transition-all gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#006B7A15] rounded-xl flex items-center justify-center text-[#006B7A] flex-shrink-0">
               <FiTrendingUp size={24} />
            </div>
            <div>
              <h2 className="m-0 text-lg font-extrabold text-gray-900 dark:text-white tracking-tight">Weekly Summary</h2>
              <p className="m-0 mt-1 text-[13px] text-gray-600 dark:text-gray-400 font-semibold">See your 7-day progress and streak insights.</p>
            </div>
          </div>
          <div className="text-[#006B7A] font-bold text-sm flex items-center gap-2 self-end sm:self-auto">
            View Report <FiArrowRight />
          </div>
        </motion.div>

        {/* MIDDLE ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5 mb-8">
          {/* Learning Path / CTA */}
          <div style={{
            backgroundColor: 'var(--surface-raised)', borderRadius: 20, border: '2px solid var(--border-clay)',
            padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            boxShadow: '0 2px 0 rgba(255,255,255,0.05) inset, 0 8px 24px var(--shadow-clay)',
          }}>
            {learningPath ? (
              <>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--peacock-blue)', marginBottom: 16 }}>Continue Learning</div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-dark)', letterSpacing: '-0.03em', marginBottom: 12, lineHeight: 1.2 }}>
                    {learningPath} Path
                  </h3>
                  <p style={{ color: 'var(--text-medium)', fontSize: 14, fontWeight: 500, lineHeight: 1.6, marginBottom: 24 }}>
                    {proficiencyLevel === 'Beginner (0-1 yrs)'
                      ? 'Building foundational skills. Each lesson gets you closer to your first role.'
                      : proficiencyLevel === 'Intermediate (2-4 yrs)'
                      ? 'Leveling up your skills to tackle real-world engineering challenges.'
                      : 'Advanced track — mastering the craft to lead and architect systems.'}
                  </p>
                </div>
                <button onClick={() => router.push(`/learn/${courseId}`)} className="btn-peacock-blue" style={{ width: 'fit-content', padding: '12px 24px', fontSize: 13 }}>
                  Resume Mission <FiArrowRight />
                </button>
              </>
            ) : (
              <>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--orange)', marginBottom: 16 }}>Get Started</div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-dark)', letterSpacing: '-0.03em', marginBottom: 12, lineHeight: 1.2 }}>
                    Set up your learning path
                  </h3>
                  <p style={{ color: 'var(--text-medium)', fontSize: 14, fontWeight: 500, lineHeight: 1.6, marginBottom: 24 }}>
                    Complete your skill calibration to get a personalized roadmap tailored to your goals.
                  </p>
                </div>
                <button onClick={() => router.push('/onboarding')} style={{
                  width: 'fit-content', padding: '12px 24px', fontSize: 13,
                  background: 'linear-gradient(135deg, #D95F2B, #B04A1E)',
                  color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer',
                  fontWeight: 800, letterSpacing: '0.03em', display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 4px 14px rgba(217,95,43,0.35)'
                }}>
                  Start Calibration <FiArrowRight />
                </button>
              </>
            )}
          </div>

          {/* Skill Graph */}
          <div style={{
            backgroundColor: 'var(--surface-raised)', borderRadius: 20, border: '2px solid var(--border-clay)',
            padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center',
            boxShadow: '0 2px 0 rgba(255,255,255,0.05) inset, 0 8px 24px var(--shadow-clay)',
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: 16, alignSelf: 'flex-start' }}>Proficiency Spectrum</div>
            {skillScore > 0 ? (
              <SkillGraph />
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="text-3xl mb-2">📊</div>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-300 mb-1">No skill data yet</p>
                <p className="text-xs text-[#B89A7E]">Complete labs to unlock your spectrum</p>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Account Info */}
          <div className="bg-white dark:bg-gray-800 rounded-[20px] border-2 border-[#B48C5A]/25 dark:border-gray-700 p-7 shadow-sm shadow-stone-800/5">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-gray-600 dark:text-gray-400 mb-5">Your Profile</div>
            <div className="flex flex-col gap-3.5">
              {[
                { label: 'Full Name', value: displayName, icon: <FiUser size={14} /> },
                { label: 'Email', value: user?.email || '—', icon: <FiActivity size={14} /> },
                { label: 'Learning Path', value: learningPath || 'Not set yet', icon: <FiBook size={14} /> },
                { label: 'Level', value: proficiencyLevel || 'Not set yet', icon: <FiTrendingUp size={14} /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 bg-[#FDF6EC] rounded-xl border-1.5 border-[#B48C5A]/20 dark:border-gray-700">
                  <div className="flex items-center gap-2.5">
                    <span className="text-gray-600 dark:text-gray-400">{item.icon}</span>
                    <span className="text-[12px] font-bold text-gray-600 dark:text-gray-400">{item.label}</span>
                  </div>
                  <span className="text-[13px] font-bold text-gray-900 dark:text-gray-100 max-w-[55%] text-right truncate">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-[20px] border-2 border-[#B48C5A]/25 dark:border-gray-700 p-7 shadow-sm shadow-stone-800/5">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-gray-600 dark:text-gray-400 mb-5">Quick Actions</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Open IDE', icon: <FiTerminal />, color: '#2E7D52', action: () => router.push(`/labs/${firstLabId}`) },
                { label: 'Ask AI Tutor', icon: <FiCpu />, color: '#006B7A', action: () => router.push('/chat') },
                { label: 'My Certificate', icon: <FiAward />, color: '#D95F2B', action: () => router.push('/certificate/cert-001') },
                { label: 'GitHub', icon: <FiExternalLink />, color: '#7A4B2A', action: () => window.open('https://github.com', '_blank') },
              ].map((action, i) => (
                <button key={i} onClick={action.action} 
                  className="p-4 px-4 rounded-2xl border-2 cursor-pointer flex flex-col items-center gap-2 transition-all hover:-translate-y-0.5 active:scale-95"
                  style={{
                    borderColor: `${action.color}20`,
                    background: `${action.color}08`,
                    color: action.color,
                  }}
                >
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-800 dark:text-gray-300">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
