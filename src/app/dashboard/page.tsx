'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FiHome, FiBook, FiTerminal, FiCpu,
  FiTrendingUp, FiUser, FiLogOut, FiZap,
  FiAward, FiExternalLink, FiActivity, FiArrowRight, FiSettings
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { fetchResilient } from '@/lib/firestore-resilience';
import { addNotification } from '@/lib/notifications';
import SkillGraph from '@/components/dashboard/SkillGraph';
import NotificationBell from '@/components/NotificationBell';
import { TRACK_DEFAULT_LAB } from '@/lib/data/labs';

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

  // ── Streak sync helper ────────────────────────────────────────────────────
  // Returns today's date as a YYYY-MM-DD string (local timezone, consistent)
  const todayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const syncStreak = async (uid: string, existingStreak: number, lastActive: string | undefined) => {
    const today = todayStr();
    let newStreak = existingStreak;
    let milestoneMessage = '';

    if (!lastActive) {
      // First ever visit — start streak at 1
      newStreak = 1;
    } else if (lastActive === today) {
      // Already logged in today — do nothing, keep current streak
      setStreakDays(existingStreak);
      return;
    } else {
      // Calculate how many calendar days ago lastActive was
      const last = new Date(lastActive + 'T00:00:00');  // force midnight local
      const now  = new Date(today   + 'T00:00:00');
      const diffDays = Math.round((now.getTime() - last.getTime()) / 86_400_000);
      setInactiveGap(diffDays);

      if (diffDays === 1) {
        // Visited yesterday → extend streak
        newStreak = existingStreak + 1;
        // Check for milestones
        if ([3, 7, 14, 30].includes(newStreak)) {
          milestoneMessage = `🔥 Outstanding! You've hit a ${newStreak}-day streak. The sector is watching.`;
        }
      } else {
        // Gap of 2+ days → reset
        newStreak = 1;
        if (diffDays >= 2) {
          await addNotification(uid, 'inactivity', 'Sector Offline', `You were offline for ${diffDays} days. Data synchronization resumed.`);
        }
      }
    }
    
    if (milestoneMessage) {
      await addNotification(uid, 'streak', 'Streak Milestone', milestoneMessage);
    }

    setStreakDays(newStreak);

    // Write back to Firestore — non-blocking, never breaks the dashboard
    try {
      if (db) {
        await updateDoc(doc(db, 'users', uid), {
          streakDays:  newStreak,
          lastActive:  today,           // ISO date string YYYY-MM-DD
          lastActiveTs: serverTimestamp(), // server timestamp for admin queries
        });
      }
    } catch (err) {
      console.warn('Dashboard: streak write failed (offline?):', err);
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
            // Clear the UID-scoped localStorage cache once Firestore is available
            localStorage.removeItem('pp_profile_' + user.uid);

            // ── Sync streak on every dashboard load ──
            // streakDays / lastActive may use legacy field name 'streak' — handle both
            const existingStreak = (data as any).streakDays ?? (data as any).streak ?? 0;
            const lastActive     = (data as any).lastActive as string | undefined;
            await syncStreak(user.uid, existingStreak, lastActive);
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
      <div style={{ minHeight: '100vh', backgroundColor: '#FDF6EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #006B7A, #2E7D52)', borderRadius: 10, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <Image src="/logo.png" alt="Path Pilot" width={40} height={40} style={{ objectFit: 'contain' }} />
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
  const memberSince = profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : null;

  const empColor = employabilityLevel.includes('High') ? '#10B981' : employabilityLevel === 'Medium' ? '#F59E0B' : '#EF4444';

  // Map the human-readable learningPath to a valid courseId URL slug
  const getCourseId = (path: string | null): string => {
    if (!path) return 'frontend-basics';
    const normalized = path.toLowerCase();
    if (normalized.includes('cloud') || normalized.includes('devops')) return 'cloud-devops';
    if (normalized.includes('frontend') || normalized.includes('front-end')) return 'frontend-basics';
    if (normalized.includes('fullstack') || normalized.includes('full stack') || normalized.includes('full-stack') || normalized.includes('mern')) return 'fullstack';
    if (normalized.includes('data science') || normalized.includes('data-science') || normalized.includes('machine learning') || normalized.includes('ml')) return 'data-science';
    if (normalized.includes('mobile') || normalized.includes('android') || normalized.includes('ios') || normalized.includes('flutter')) return 'mobile-dev';
    if (normalized.includes('backend') || normalized.includes('back-end')) return 'backend';
    if (normalized.includes('dsa') || normalized.includes('algorithm') || normalized.includes('interview')) return 'dsa';
    if (normalized.includes('ai') || normalized.includes('nlp')) return 'ai';
    return 'frontend-basics';
  };
  const courseId = getCourseId(learningPath);

  // Resolve the first lab for this student's track
  const firstLabId = TRACK_DEFAULT_LAB[learningPath || ''] ?? 'lab-001';

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const navItems = [
    { id: 'home',     label: 'Home',     icon: <FiHome />,      action: () => {} },
    { id: 'learn',    label: 'Learn',    icon: <FiBook />,      action: () => router.push(`/learn/${courseId}`) },
    { id: 'labs',     label: 'Labs',     icon: <FiTerminal />,  action: () => router.push(`/labs/${firstLabId}`) },
    { id: 'tutor',    label: 'AI Tutor', icon: <FiCpu />,       action: () => router.push('/chat') },
    { id: 'progress', label: 'Progress', icon: <FiTrendingUp />, action: () => router.push('/progress') },
    { id: 'profile',  label: 'Profile',  icon: <FiUser />,      action: () => router.push('/profile') },
    { id: 'leaderboard', label: 'Leaderboard', icon: <FiAward />, action: () => router.push('/leaderboard') },
    { id: 'settings', label: 'Settings', icon: <FiSettings />,  action: () => router.push('/settings') },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF6EC', display: 'flex' }}>
      
      {/* ─── SIDEBAR ─── */}
      <aside style={{
        position: 'fixed', left: 0, top: 0, height: '100%', width: 240,
        background: 'linear-gradient(180deg, #FFF8EE 0%, #F5E8D4 100%)',
        borderRight: '2px solid rgba(180,140,90,0.25)',
        display: 'flex', flexDirection: 'column', zIndex: 100,
        boxShadow: '4px 0 24px rgba(140,90,40,0.08)'
      }}>
        <div style={{ padding: '28px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #006B7A, #2E7D52)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,107,122,0.35)'
          }}>
            <Image src="/logo.png" alt="Path Pilot" width={36} height={36} style={{ objectFit: 'contain' }} />
          </div>
          <span style={{ fontWeight: 900, fontSize: 16, color: '#2C1A0E', letterSpacing: '-0.02em' }}>Path Pilot</span>
        </div>

        {/* User avatar */}
        <div style={{ padding: '0 16px 20px', borderBottom: '1.5px solid rgba(180,140,90,0.2)', margin: '0 12px', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', background: 'rgba(255,255,255,0.6)', borderRadius: 12, border: '1.5px solid rgba(180,140,90,0.15)' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #006B7A, #2E7D52)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
              {firstName[0]?.toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#2C1A0E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{firstName}</div>
              <div style={{ fontSize: 10, color: '#8B6E52', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{profile?.role || 'Student'}</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setActiveNav(item.id); item.action(); }} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: 14, textAlign: 'left',
              transition: 'all 0.2s ease',
              background: activeNav === item.id ? 'linear-gradient(135deg, #006B7A, #2E7D52)' : 'transparent',
              color: activeNav === item.id ? '#fff' : '#5C3D1E',
              boxShadow: activeNav === item.id ? '0 4px 14px rgba(0,107,122,0.35), inset 0 1px 0 rgba(255,255,255,0.2)' : 'none'
            }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '16px 12px' }}>
          <button onClick={() => signOut()} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
            fontWeight: 700, fontSize: 14, background: 'transparent',
            color: '#D95F2B', transition: 'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(217,95,43,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <FiLogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main style={{ marginLeft: 240, flex: 1, padding: '40px 40px 80px' }}>
        
        {/* GREETING */}
        <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#2C1A0E', letterSpacing: '-0.03em', marginBottom: 4 }}>
              {greeting}, {firstName} 👋
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

        {/* NUDGE CARD */}
        {inactiveGap > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
              border: '2px solid #FDE68A',
              borderRadius: 20,
              padding: '24px 28px',
              marginBottom: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 20px rgba(245,158,11,0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{
                width: 54, height: 54, background: '#fef9c3', border: '2px solid #fde047',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, boxShadow: '0 4px 12px rgba(250,204,21,0.25)'
              }}>
                ⚠️
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#92400e', letterSpacing: '-0.02em' }}>
                  You have not practiced in {inactiveGap} days. Your streak is at risk!
                </h3>
                <p style={{ margin: '6px 0 0 0', fontSize: 14, color: '#b45309', fontWeight: 600 }}>
                  Pick up where you left off.
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push(`/learn/${courseId}`)}
              style={{
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 12,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: '0 4px 14px rgba(217,119,6,0.3)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Resume Path <FiArrowRight />
            </button>
          </motion.div>
        )}

        {/* STAT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 28 }}>
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
              background: '#FFFFFF', borderRadius: 20,
              border: '2px solid rgba(180,140,90,0.25)', padding: '24px 22px',
              boxShadow: '0 2px 0 rgba(255,255,255,0.9) inset, 0 8px 24px rgba(140,90,40,0.1)',
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
              <div style={{ fontSize: 28, fontWeight: 900, color: '#2C1A0E', letterSpacing: '-0.04em', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#8B6E52', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: '#B89A7E', fontWeight: 500, marginTop: 2 }}>{s.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* WEEKLY SUMMARY BANNER */}
        <motion.div
           onClick={() => router.push('/progress/weekly')}
           style={{
             background: 'rgba(255,255,255,0.7)',
             border: '1.5px solid rgba(180,140,90,0.2)',
             borderRadius: 20,
             padding: '20px 24px',
             marginBottom: 28,
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'space-between',
             cursor: 'pointer',
             boxShadow: '0 4px 14px rgba(140,90,40,0.05)',
             backdropFilter: 'blur(12px)'
           }}
           whileHover={{ y: -2, background: 'rgba(255,255,255,0.9)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, background: '#006B7A15', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#006B7A' }}>
               <FiTrendingUp size={24} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#2C1A0E', letterSpacing: '-0.02em' }}>Weekly Summary</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#8B6E52', fontWeight: 600 }}>See your 7-day progress and streak insights.</p>
            </div>
          </div>
          <div style={{ color: '#006B7A', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            View Report <FiArrowRight />
          </div>
        </motion.div>

        {/* MIDDLE ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, marginBottom: 28 }}>
          {/* Learning Path / CTA */}
          <div style={{
            background: '#FFFFFF', borderRadius: 20, border: '2px solid rgba(180,140,90,0.25)',
            padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            boxShadow: '0 2px 0 rgba(255,255,255,0.9) inset, 0 8px 24px rgba(140,90,40,0.1)',
          }}>
            {learningPath ? (
              <>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#006B7A', marginBottom: 16 }}>Continue Learning</div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: '#2C1A0E', letterSpacing: '-0.03em', marginBottom: 12, lineHeight: 1.2 }}>
                    {learningPath} Path
                  </h3>
                  <p style={{ color: '#5C3D1E', fontSize: 14, fontWeight: 500, lineHeight: 1.6, marginBottom: 24 }}>
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
                  <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#D95F2B', marginBottom: 16 }}>Get Started</div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: '#2C1A0E', letterSpacing: '-0.03em', marginBottom: 12, lineHeight: 1.2 }}>
                    Set up your learning path
                  </h3>
                  <p style={{ color: '#5C3D1E', fontSize: 14, fontWeight: 500, lineHeight: 1.6, marginBottom: 24 }}>
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
            background: '#FFFFFF', borderRadius: 20, border: '2px solid rgba(180,140,90,0.25)',
            padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center',
            boxShadow: '0 2px 0 rgba(255,255,255,0.9) inset, 0 8px 24px rgba(140,90,40,0.1)',
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8B6E52', marginBottom: 16, alignSelf: 'flex-start' }}>Proficiency Spectrum</div>
            {skillScore > 0 ? (
              <SkillGraph />
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📊</div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#5C3D1E', marginBottom: 6 }}>No skill data yet</p>
                <p style={{ fontSize: 12, color: '#B89A7E', fontWeight: 500, lineHeight: 1.5 }}>Complete your first lab to see your skills breakdown here.</p>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Account Info */}
          <div style={{
            background: '#FFFFFF', borderRadius: 20, border: '2px solid rgba(180,140,90,0.25)',
            padding: '28px', boxShadow: '0 2px 0 rgba(255,255,255,0.9) inset, 0 8px 24px rgba(140,90,40,0.1)',
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8B6E52', marginBottom: 20 }}>Your Profile</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Full Name', value: displayName, icon: <FiUser size={14} /> },
                { label: 'Email', value: user?.email || '—', icon: <FiActivity size={14} /> },
                { label: 'Learning Path', value: learningPath || 'Not set yet', icon: <FiBook size={14} /> },
                { label: 'Level', value: proficiencyLevel || 'Not set yet', icon: <FiTrendingUp size={14} /> },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#FDF6EC', borderRadius: 12, border: '1.5px solid rgba(180,140,90,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: '#8B6E52' }}>{item.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#8B6E52' }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#2C1A0E', maxWidth: '55%', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            background: '#FFFFFF', borderRadius: 20, border: '2px solid rgba(180,140,90,0.25)',
            padding: '28px', boxShadow: '0 2px 0 rgba(255,255,255,0.9) inset, 0 8px 24px rgba(140,90,40,0.1)',
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8B6E52', marginBottom: 20 }}>Quick Actions</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Open IDE', icon: <FiTerminal />, color: '#2E7D52', action: () => router.push(`/labs/${firstLabId}`) },
                { label: 'Ask AI Tutor', icon: <FiCpu />, color: '#006B7A', action: () => router.push('/chat') },
                { label: 'My Certificate', icon: <FiAward />, color: '#D95F2B', action: () => router.push('/certificate/cert-001') },
                { label: 'GitHub', icon: <FiExternalLink />, color: '#7A4B2A', action: () => window.open('https://github.com', '_blank') },
              ].map((action, i) => (
                <button key={i} onClick={action.action} style={{
                  padding: '18px 16px', borderRadius: 14, border: `2px solid ${action.color}20`,
                  background: `${action.color}08`,
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  transition: 'all 0.2s ease', color: action.color,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${action.color}15`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${action.color}08`; e.currentTarget.style.transform = 'none'; }}
                >
                  <span style={{ fontSize: 22 }}>{action.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C3D1E' }}>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
