'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiAward, FiTerminal, FiZap, FiTrendingUp, FiBook, FiCpu, FiCheckCircle, FiCircle, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { fetchResilient } from '@/lib/firestore-resilience';

interface UserProfile {
  displayName?: string;
  learningPath?: string;
  proficiencyLevel?: string;
  onboardingComplete?: boolean;
  skillScore?: number;
  labsCompleted?: number;
  streak?: number;
  createdAt?: string;
}

const ROADMAP_STAGES: Record<string, { title: string; modules: string[] }[]> = {
  // ── AI / Machine Learning ────────────────────────────────────────────────────────────────
  'AI': [
    { title: 'Python Foundations',  modules: ['Variables & Types', 'Functions & Loops', 'Lists & Dicts', 'File I/O'] },
    { title: 'Data & ML Basics',    modules: ['NumPy & Pandas', 'Data Visualization', 'Scikit-learn Intro', 'Train/Test Split'] },
    { title: 'Deep Learning',       modules: ['Neural Networks', 'CNNs & RNNs', 'Transformers', 'Fine-tuning LLMs'] },
    { title: 'AI Engineering',      modules: ['Prompt Engineering', 'RAG Systems', 'LLM APIs', 'Vector Databases'] },
  ],

  // ── Frontend ──────────────────────────────────────────────────────────────────────
  'Frontend': [
    { title: 'HTML & CSS',          modules: ['Semantic HTML', 'Flexbox & Grid', 'Responsive Design', 'CSS Animations'] },
    { title: 'JavaScript Core',     modules: ['ES6+ Syntax', 'DOM Manipulation', 'Async/Await', 'Closures & Scope'] },
    { title: 'React & Next.js',     modules: ['Components & Props', 'State & Hooks', 'Routing', 'Server Components'] },
    { title: 'Production Skills',   modules: ['Testing (Vitest)', 'Performance', 'Deployment', 'CI/CD Basics'] },
  ],

  // ── Backend ───────────────────────────────────────────────────────────────────────
  'Backend': [
    { title: 'Node.js Basics',      modules: ['Modules & npm', 'HTTP Servers', 'Express.js', 'Middleware'] },
    { title: 'Databases',           modules: ['SQL Fundamentals', 'PostgreSQL', 'MongoDB', 'ORMs (Prisma)'] },
    { title: 'APIs & Auth',         modules: ['REST Design', 'JWT & OAuth', 'Rate Limiting', 'WebSockets'] },
    { title: 'DevOps & Scale',      modules: ['Docker Basics', 'Redis Caching', 'AWS/GCP Intro', 'System Design'] },
  ],

  // ── Cloud & DevOps ────────────────────────────────────────────────────────────────
  'Cloud': [
    { title: 'Linux Basics',        modules: ['Shell Commands', 'File Permissions', 'Bash Scripting', 'Cron Jobs'] },
    { title: 'Docker & Containers', modules: ['Images & Containers', 'Dockerfile', 'Docker Compose', 'Networking'] },
    { title: 'CI/CD Pipelines',     modules: ['GitHub Actions', 'Build & Test Stages', 'Deployment Gates', 'Rollback Strategies'] },
    { title: 'AWS Cloud Fundamentals', modules: ['EC2 & VPC', 'S3 & IAM', 'Lambda (Serverless)', 'CloudWatch & Logging'] },
  ],

  // ── DSA & Interviews ───────────────────────────────────────────────────────────────
  'DSA': [
    { title: 'Arrays & Strings',    modules: ['Two Pointers', 'Sliding Window', 'Prefix Sums', 'String Manipulation'] },
    { title: 'Recursion & Trees',   modules: ['Recursion Patterns', 'Binary Trees', 'BST Operations', 'Tree Traversals'] },
    { title: 'Graphs & DP',         modules: ['BFS & DFS', 'Shortest Paths', 'Memoisation', 'Tabulation'] },
    { title: 'Mock Interviews',     modules: ['Timed LeetCode', 'Communication Skills', 'Whiteboard Practice', 'Offer Negotiation'] },
  ],

  // ── MERN Stack (Full Stack) ──────────────────────────────────────────────────────────
  'MERN': [
    { title: 'MongoDB Basics',      modules: ['Documents & Collections', 'CRUD Operations', 'Indexing', 'Aggregation Pipeline'] },
    { title: 'Express APIs',        modules: ['Routing & Middleware', 'REST Conventions', 'Error Handling', 'Auth (JWT)'] },
    { title: 'React Frontend',      modules: ['Component Architecture', 'useState & useEffect', 'React Query', 'Form Handling'] },
    { title: 'Node Backend',        modules: ['Event Loop', 'Streams & Buffers', 'WebSockets', 'Deployment (Railway)'] },
  ],

  // ── Mobile — Android ────────────────────────────────────────────────────────────────
  'Android': [
    { title: 'Kotlin Basics',       modules: ['Variables & Null Safety', 'Functions & Lambdas', 'Classes & Data Classes', 'Coroutines'] },
    { title: 'UI & Layouts',        modules: ['Jetpack Compose', 'Layouts & Modifiers', 'Navigation', 'Material Design 3'] },
    { title: 'Firebase Integration',modules: ['Auth (Google Sign-In)', 'Firestore Realtime', 'Cloud Storage', 'Push Notifications'] },
    { title: 'Play Store Publishing', modules: ['App Signing', 'Build Variants', 'Store Listing', 'Release Tracks'] },
  ],

  // ── Mobile — Flutter ─────────────────────────────────────────────────────────────────
  'Flutter': [
    { title: 'Dart Basics',         modules: ['Types & Null Safety', 'Functions & Closures', 'async/await & Futures', 'Collections'] },
    { title: 'Widget Tree',         modules: ['Stateless vs Stateful', 'Material Widgets', 'Custom Painting', 'Animations'] },
    { title: 'State Management',    modules: ['setState', 'Provider', 'Riverpod', 'Bloc Pattern'] },
    { title: 'App Deployment',      modules: ['Build Config', 'iOS & Android Signing', 'Play Store & App Store', 'CI/CD with Codemagic'] },
  ],
};

const S = {
  bg:      '#FDF6EC',
  card:    '#FFFFFF',
  border:  'rgba(180,140,90,0.25)',
  primary: '#2C1A0E',
  sub:     '#8B6E52',
  teal:    '#006B7A',
  green:   '#2E7D52',
  orange:  '#D95F2B',
};

export default function ProgressPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { isReady } = useAuthGuard();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [localStats, setLocalStats] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    // Load local stats
    const saved = localStorage.getItem('pathpilot_user_stats');
    if (saved) {
      try { setLocalStats(JSON.parse(saved)); } catch {}
    }
    // Load profile from localStorage fallback first — keyed by UID to prevent cross-account leaks
    const localProfile = localStorage.getItem('pp_profile_' + user.uid);
    if (localProfile) {
      try { setProfile(prev => ({ ...prev, ...JSON.parse(localProfile) })); } catch {}
    }
    // Then try Firestore
    const fetchProfile = async () => {
      try {
        if (db) {
          const snap = await fetchResilient(doc(db, 'users', user.uid), 4000);
          if (snap && snap.exists()) {
            setProfile(snap.data() as UserProfile);
          }
        }
      } catch {}
    };
    fetchProfile();
  }, [user]);

  if (!isReady) return (
    <div style={{ minHeight: '100vh', background: S.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, background: `linear-gradient(135deg, ${S.teal}, ${S.green})`, borderRadius: 10, margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 18 }}>P</div>
        <div style={{ fontWeight: 700, color: S.sub, fontSize: 14 }}>Loading progress...</div>
      </div>
    </div>
  );

  const displayName = profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Scholar';
  const firstName = displayName.split(' ')[0];
  const learningPath = profile?.learningPath || null;
  const proficiencyLevel = profile?.proficiencyLevel || null;
  const skillScore = profile?.skillScore ?? localStats?.credits ?? 0;
  const labsCompleted = profile?.labsCompleted ?? localStats?.labsCompleted ?? 0;
  const streak = profile?.streak ?? localStats?.streak ?? 0;
  const onboardingComplete = profile?.onboardingComplete ?? false;
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Recently joined';

  // Map learningPath (whatever onboarding saved) → a ROADMAP_STAGES key
  const getLearningPathKey = (path: string | null): string | null => {
    if (!path) return null;
    const p = path.toLowerCase();
    // Order matters: check most-specific first to avoid false positives
    if (p.includes('flutter'))                                           return 'Flutter';
    if (p.includes('android') || p.includes('kotlin'))                  return 'Android';
    if (p.includes('mern') || p.includes('full stack') || p.includes('fullstack')) return 'MERN';
    if (p.includes('cloud') || p.includes('devops') || p.includes('aws') || p.includes('docker')) return 'Cloud';
    if (p.includes('dsa') || p.includes('algorithm') || p.includes('interview'))   return 'DSA';
    if (p.includes('ai') || p.includes('machine learning') || p.includes('nlp'))   return 'AI';
    if (p.includes('backend') || p.includes('back-end') || p.includes('node') || p.includes('django')) return 'Backend';
    if (p.includes('frontend') || p.includes('front-end') || p.includes('react') || p.includes('vue'))  return 'Frontend';
    return null;
  };

  const roadmapKey = getLearningPathKey(learningPath);
  const roadmap = roadmapKey ? ROADMAP_STAGES[roadmapKey] : null;

  const stats = [
    { label: 'Skill Score', value: skillScore > 0 ? skillScore.toString() : '—', icon: <FiAward size={20} />, color: S.teal, sub: skillScore > 0 ? 'Based on performance' : 'Complete labs to earn score' },
    { label: 'Labs Done', value: labsCompleted.toString(), icon: <FiTerminal size={20} />, color: S.green, sub: labsCompleted > 0 ? `${labsCompleted} lab${labsCompleted !== 1 ? 's' : ''} completed` : 'Start your first lab' },
    { label: 'Day Streak', value: streak > 0 ? `${streak}` : '0', icon: <FiZap size={20} />, color: S.orange, sub: streak > 0 ? 'Keep it going!' : 'Log in daily to build streak' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: S.bg }}>

      {/* HEADER */}
      <div style={{ padding: '20px 32px', borderBottom: `2px solid ${S.border}`, background: '#FFF8EE', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 16px rgba(140,90,40,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => router.push('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(0,107,122,0.08)', border: `1.5px solid ${S.border}`, borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 13, color: S.teal }}>
            <FiArrowLeft size={14} /> Dashboard
          </button>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: S.primary, letterSpacing: '-0.03em', margin: 0 }}>Your Progress</h1>
            <p style={{ fontSize: 12, color: S.sub, fontWeight: 500, margin: 0 }}>{firstName}'s learning journey · Member since {memberSince}</p>
          </div>
        </div>
        <button onClick={() => router.push('/chat')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: `linear-gradient(135deg, ${S.teal}, ${S.green})`, border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: 13, color: '#fff', boxShadow: `0 4px 14px rgba(0,107,122,0.3)` }}>
          <FiCpu size={14} /> Ask AI Tutor
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>

        {/* STAT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          {stats.map((s, i) => (
            <motion.div key={i} whileHover={{ y: -3 }} style={{ background: S.card, borderRadius: 18, border: `2px solid ${S.border}`, padding: '22px 20px', boxShadow: '0 2px 0 rgba(255,255,255,0.9) inset, 0 6px 20px rgba(140,90,40,0.08)' }}>
              <div style={{ width: 40, height: 40, background: `${s.color}15`, border: `2px solid ${s.color}30`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: 14 }}>
                {s.icon}
              </div>
              <div style={{ fontSize: 30, fontWeight: 900, color: S.primary, letterSpacing: '-0.04em', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: S.sub, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: '#B89A7E', fontWeight: 500, marginTop: 3 }}>{s.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* STATUS CARD */}
        <div style={{ background: S.card, borderRadius: 18, border: `2px solid ${S.border}`, padding: '24px 28px', marginBottom: 24, boxShadow: '0 2px 0 rgba(255,255,255,0.9) inset, 0 6px 20px rgba(140,90,40,0.08)', display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: onboardingComplete ? `linear-gradient(135deg, ${S.teal}, ${S.green})` : `linear-gradient(135deg, ${S.orange}, #B04A1E)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, flexShrink: 0 }}>
            {onboardingComplete ? '🎯' : '⚡'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: onboardingComplete ? S.teal : S.orange, marginBottom: 4 }}>
              {onboardingComplete ? 'Calibrated & Active' : 'Setup Required'}
            </div>
            <div style={{ fontSize: 16, fontWeight: 900, color: S.primary, letterSpacing: '-0.02em' }}>
              {onboardingComplete && learningPath ? `${learningPath} — ${proficiencyLevel || 'Calibrated'}` : 'Complete your skill calibration'}
            </div>
            <div style={{ fontSize: 13, color: S.sub, fontWeight: 500, marginTop: 4 }}>
              {onboardingComplete ? 'Your personalized roadmap is active below.' : 'Run the onboarding calibration to get your personalized learning path.'}
            </div>
          </div>
          {!onboardingComplete && (
            <button onClick={() => router.push('/onboarding')} style={{ padding: '10px 20px', background: `linear-gradient(135deg, ${S.orange}, #B04A1E)`, border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 800, fontSize: 13, color: '#fff', whiteSpace: 'nowrap', boxShadow: `0 4px 14px rgba(217,95,43,0.35)` }}>
              Start Calibration →
            </button>
          )}
        </div>

        {/* WEEKLY SUMMARY BANNER */}
        <motion.div
           onClick={() => router.push('/progress/weekly')}
           style={{
             background: 'rgba(255,255,255,0.7)',
             border: `1.5px solid ${S.border}`,
             borderRadius: 18,
             padding: '16px 20px',
             marginBottom: 24,
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'space-between',
             cursor: 'pointer',
             boxShadow: '0 2px 8px rgba(140,90,40,0.05)',
             backdropFilter: 'blur(12px)'
           }}
           whileHover={{ y: -2, background: 'rgba(255,255,255,0.95)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 42, height: 42, background: '#006B7A15', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.teal }}>
               <FiTrendingUp size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: S.primary, letterSpacing: '-0.01em' }}>Weekly Summary</h2>
              <p style={{ margin: '2px 0 0 0', fontSize: 12, color: S.sub, fontWeight: 600 }}>See your rolling 7-day progress and streak insights.</p>
            </div>
          </div>
          <div style={{ color: S.teal, fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            View Report <FiArrowRight />
          </div>
        </motion.div>

        {/* ROADMAP */}
        {roadmap ? (
          <div style={{ background: S.card, borderRadius: 18, border: `2px solid ${S.border}`, padding: '28px', boxShadow: '0 2px 0 rgba(255,255,255,0.9) inset, 0 6px 20px rgba(140,90,40,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <FiTrendingUp size={18} color={S.teal} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: S.sub }}>Your Roadmap</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: S.primary }}>{learningPath} Path — {proficiencyLevel}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {roadmap.map((stage, stageIdx) => {
                const isFirst = stageIdx === 0;
                const isActive = stageIdx === 0 && labsCompleted === 0;
                return (
                  <div key={stageIdx} style={{ position: 'relative', paddingLeft: 28 }}>
                    {/* Connector line */}
                    {stageIdx < roadmap.length - 1 && (
                      <div style={{ position: 'absolute', left: 9, top: 28, width: 2, height: 'calc(100% + 4px)', background: isFirst ? `linear-gradient(to bottom, ${S.teal}, ${S.border})` : S.border }} />
                    )}
                    {/* Stage dot */}
                    <div style={{ position: 'absolute', left: 0, top: 6, width: 20, height: 20, borderRadius: '50%', background: isFirst ? `linear-gradient(135deg, ${S.teal}, ${S.green})` : S.card, border: `2px solid ${isFirst ? S.teal : S.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isFirst ? <FiCheckCircle size={10} color="#fff" /> : <FiCircle size={10} color={S.sub} />}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: isFirst ? S.teal : S.sub }}>{stage.title}</span>
                        {isFirst && <span style={{ fontSize: 10, fontWeight: 800, background: `${S.teal}15`, color: S.teal, padding: '2px 8px', borderRadius: 999, border: `1px solid ${S.teal}30` }}>IN PROGRESS</span>}
                        {isActive && <span style={{ fontSize: 10, fontWeight: 800, background: `${S.orange}15`, color: S.orange, padding: '2px 8px', borderRadius: 999, border: `1px solid ${S.orange}30` }}>START HERE</span>}
                        {stageIdx > 0 && <span style={{ fontSize: 10, fontWeight: 700, color: '#B89A7E' }}>UPCOMING</span>}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {stage.modules.map((mod, modIdx) => (
                          <div key={modIdx} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: isFirst ? `${S.teal}08` : '#FDF6EC', borderRadius: 8, border: `1.5px solid ${isFirst ? S.teal + '20' : S.border}`, fontSize: 12, fontWeight: 600, color: isFirst ? S.primary : S.sub }}>
                            <FiBook size={11} color={isFirst ? S.teal : S.sub} /> {mod}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ background: S.card, borderRadius: 18, border: `2px solid ${S.border}`, padding: '48px 28px', textAlign: 'center', boxShadow: '0 2px 0 rgba(255,255,255,0.9) inset, 0 6px 20px rgba(140,90,40,0.08)' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🗺️</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: S.primary, marginBottom: 8 }}>No roadmap yet</div>
            <div style={{ fontSize: 14, color: S.sub, fontWeight: 500, marginBottom: 24, maxWidth: 360, margin: '0 auto 24px' }}>Complete the skill calibration to get your personalized learning roadmap based on your goals and experience level.</div>
            <button onClick={() => router.push('/onboarding')} style={{ padding: '12px 28px', background: `linear-gradient(135deg, ${S.teal}, ${S.green})`, border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 800, fontSize: 14, color: '#fff', boxShadow: `0 4px 14px rgba(0,107,122,0.3)` }}>
              Start Calibration →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
