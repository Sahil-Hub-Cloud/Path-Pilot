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
import SkillGraph from '@/components/SkillGraph';

interface UserProfile {
  displayName?: string;
  learningPath?: string;
  proficiencyLevel?: string;
  onboardingComplete?: boolean;
  skillScore?: number;
  labsCompleted?: number;
  streakDays?: number;
  streak?: number;
  xp?: number;
  employabilityScore?: number;
  employabilityLevel?: string;
  createdAt?: string;
}

const ROADMAP_STAGES: Record<string, { title: string; modules: string[] }[]> = {
  'Frontend': [
    { title: 'HTML & CSS',        modules: ['Semantic HTML', 'Flexbox & Grid', 'Responsive Design', 'CSS Animations'] },
    { title: 'JavaScript Core',   modules: ['ES6+ Syntax', 'DOM Manipulation', 'Async/Await', 'Closures & Scope'] },
    { title: 'React & Next.js',   modules: ['Components & Props', 'State & Hooks', 'Routing', 'Server Components'] },
    { title: 'Production Skills', modules: ['Testing (Vitest)', 'Performance', 'Deployment', 'CI/CD Basics'] },
  ],
  'Backend': [
    { title: 'Node.js Basics',   modules: ['Modules & npm', 'HTTP Servers', 'Express.js', 'Middleware'] },
    { title: 'Databases',        modules: ['SQL Fundamentals', 'PostgreSQL', 'MongoDB', 'ORMs (Prisma)'] },
    { title: 'APIs & Auth',      modules: ['REST Design', 'JWT & OAuth', 'Rate Limiting', 'WebSockets'] },
    { title: 'DevOps & Scale',   modules: ['Docker Basics', 'Redis Caching', 'AWS/GCP Intro', 'System Design'] },
  ],
  'MERN': [
    { title: 'MongoDB Basics',   modules: ['Documents & Collections', 'CRUD Operations', 'Indexing', 'Aggregation Pipeline'] },
    { title: 'Express APIs',     modules: ['Routing & Middleware', 'REST Conventions', 'Error Handling', 'Auth (JWT)'] },
    { title: 'React Frontend',   modules: ['Component Architecture', 'useState & useEffect', 'React Query', 'Form Handling'] },
    { title: 'Node Backend',     modules: ['Event Loop', 'Streams & Buffers', 'WebSockets', 'Deployment (Railway)'] },
  ],
  'DSA': [
    { title: 'Arrays & Strings',  modules: ['Two Pointers', 'Sliding Window', 'Prefix Sums', 'String Manipulation'] },
    { title: 'Recursion & Trees', modules: ['Recursion Patterns', 'Binary Trees', 'BST Operations', 'Tree Traversals'] },
    { title: 'Graphs & DP',       modules: ['BFS & DFS', 'Shortest Paths', 'Memoisation', 'Tabulation'] },
    { title: 'Mock Interviews',   modules: ['Timed LeetCode', 'Communication Skills', 'Whiteboard Practice', 'Offer Negotiation'] },
  ],
  'NLP': [
    { title: 'Python & Text',    modules: ['Python for Data', 'Tokenization', 'Regex & NLP', 'spaCy Basics'] },
    { title: 'Embeddings & NN',  modules: ['Word2Vec / GloVe', 'RNNs & LSTMs', 'Attention Mechanism', 'Seq2Seq'] },
    { title: 'Transformers',     modules: ['BERT Architecture', 'HuggingFace', 'Fine-tuning', 'Sentiment & NER'] },
    { title: 'LLMs & GenAI',     modules: ['GPT Architecture', 'Prompt Engineering', 'RAG Systems', 'RLHF'] },
  ],
  'MachineLearning': [
    { title: 'Supervised Learning', modules: ['Linear Regression', 'Logistic Regression', 'Decision Trees', 'Random Forests'] },
    { title: 'Unsupervised & CV',   modules: ['K-Means Clustering', 'PCA', 'SVMs', 'Model Evaluation'] },
    { title: 'Deep Learning',       modules: ['Neural Networks', 'CNNs', 'Transfer Learning', 'PyTorch Basics'] },
    { title: 'MLOps & Deploy',      modules: ['Experiment Tracking', 'Model Serving', 'Docker for ML', 'CI/CD Pipelines'] },
  ],
  'DataScience': [
    { title: 'Data Foundations',  modules: ['Python for DS', 'NumPy Computation', 'Pandas Deep Dive', 'Data Cleaning'] },
    { title: 'Viz & Statistics',  modules: ['Matplotlib & Seaborn', 'Descriptive Stats', 'Inferential Stats', 'A/B Testing'] },
    { title: 'SQL & Databases',   modules: ['SQL Queries', 'Joins & Aggregations', 'Window Functions', 'Database Design'] },
    { title: 'ML for DS',         modules: ['Regression Models', 'Classification', 'Feature Engineering', 'Dashboards'] },
  ],
  'PythonBeginners': [
    { title: 'Coding Foundations', modules: ['Variables & Types', 'Control Flow', 'Loops & Iteration', 'Functions'] },
    { title: 'Data & Files',       modules: ['Lists & Dicts', 'File I/O', 'Error Handling', 'Modules & Packages'] },
    { title: 'Mini Projects',      modules: ['Calculator', 'To-Do App', 'Quiz Game', 'Web Scraper Intro'] },
    { title: 'AI Fluency',         modules: ['Prompt Engineering 101', 'Reading AI Code', 'AI Ethics', 'Tools Overview'] },
  ],
  'Flutter': [
    { title: 'Dart Basics',      modules: ['Types & Null Safety', 'Functions & Closures', 'async/await', 'Collections'] },
    { title: 'Widget Tree',      modules: ['Stateless vs Stateful', 'Material Widgets', 'Custom Painting', 'Animations'] },
    { title: 'State Management', modules: ['setState', 'Provider', 'Riverpod', 'Bloc Pattern'] },
    { title: 'App Deployment',   modules: ['Build Config', 'iOS & Android Signing', 'Play Store & App Store', 'CI/CD with Codemagic'] },
  ],
  'ReactNative': [
    { title: 'RN Essentials',    modules: ['Core Components', 'Flexbox & Styling', 'React Navigation', 'Expo Workflow'] },
    { title: 'Native Features',  modules: ['Camera & Location', 'Push Notifications', 'Async Storage', 'Native Modules'] },
    { title: 'State & Data',     modules: ['Redux Toolkit', 'React Query', 'Firebase Integration', 'REST APIs'] },
    { title: 'Publishing',       modules: ['App Signing', 'Play Store Release', 'App Store Review', 'OTA Updates'] },
  ],
  'Android': [
    { title: 'Kotlin Basics',        modules: ['Variables & Null Safety', 'Functions & Lambdas', 'Classes & Data Classes', 'Coroutines'] },
    { title: 'UI & Layouts',         modules: ['Jetpack Compose', 'Layouts & Modifiers', 'Navigation', 'Material Design 3'] },
    { title: 'Firebase Integration', modules: ['Auth (Google Sign-In)', 'Firestore Realtime', 'Cloud Storage', 'Push Notifications'] },
    { title: 'Play Store',           modules: ['App Signing', 'Build Variants', 'Store Listing', 'Release Tracks'] },
  ],
  'Django': [
    { title: 'Django Foundations', modules: ['MTV Architecture', 'Models & Admin', 'Views & Templates', 'URL Routing'] },
    { title: 'Django REST',        modules: ['Serializers', 'ViewSets & Routers', 'Authentication (JWT)', 'Permissions'] },
    { title: 'Databases & ORM',    modules: ['PostgreSQL Setup', 'Migrations', 'Querysets', 'Indexes & Performance'] },
    { title: 'Production Deploy',  modules: ['Gunicorn & Nginx', 'Docker Compose', 'AWS EC2 / Railway', 'CI/CD'] },
  ],
  'Vue': [
    { title: 'Vue Foundations',  modules: ['Template Syntax', 'Reactivity System', 'Composition API', 'ref & reactive'] },
    { title: 'Ecosystem',        modules: ['Vue Router', 'Pinia State', 'Vite Build', 'Component Libraries'] },
    { title: 'Advanced Vue',     modules: ['Custom Directives', 'Composables', 'Teleport', 'Server-Side Rendering'] },
    { title: 'Production',       modules: ['Testing (Vitest)', 'Deployment (Vercel)', 'Performance', 'Accessibility'] },
  ],
  'Cloud': [
    { title: 'Linux & Shell',    modules: ['Shell Commands', 'File Permissions', 'Bash Scripting', 'Cron Jobs'] },
    { title: 'Docker',           modules: ['Images & Containers', 'Dockerfile', 'Docker Compose', 'Networking'] },
    { title: 'Kubernetes',       modules: ['Pods & Deployments', 'Services & Ingress', 'ConfigMaps', 'Helm Charts'] },
    { title: 'CI/CD Pipelines',  modules: ['GitHub Actions', 'Build & Test Stages', 'Deployment Gates', 'Rollback Strategies'] },
  ],
  'Cybersecurity': [
    { title: 'Security Foundations', modules: ['CIA Triad', 'Network Security', 'Cryptography Basics', 'OWASP Top 10'] },
    { title: 'Ethical Hacking',      modules: ['Reconnaissance', 'Vulnerability Scanning', 'Exploitation (Metasploit)', 'Web App Pentesting'] },
    { title: 'Defensive Security',   modules: ['Firewalls & IDS/IPS', 'SOC & SIEM', 'Incident Response', 'Log Analysis'] },
    { title: 'Certifications',       modules: ['CompTIA Security+', 'CEH Prep', 'CTF Practice', 'Report Writing'] },
  ],
  'Blockchain': [
    { title: 'Web3 Foundations', modules: ['How Blockchain Works', 'Consensus Mechanisms', 'Wallets & Keys', 'Ethereum Basics'] },
    { title: 'Solidity',         modules: ['Syntax & Variables', 'Functions & Modifiers', 'Events & Errors', 'Inheritance'] },
    { title: 'dApp Development', modules: ['Hardhat & Foundry', 'Web3.js / Ethers.js', 'IPFS & Storage', 'DeFi Protocols'] },
    { title: 'Deployment',       modules: ['Testnet Deploy', 'Security Auditing', 'Mainnet Launch', 'NFT & Token Standards'] },
  ],
  'JavaScript': [
    { title: 'Engine Room',       modules: ['Execution Context', 'Scope & Closures', 'Event Loop', 'V8 Internals'] },
    { title: 'Advanced Patterns', modules: ['Prototypes & Classes', 'Functional Programming', 'Design Patterns', 'Metaprogramming'] },
    { title: 'Async Mastery',     modules: ['Promises Deep Dive', 'Async Generators', 'Observable Streams', 'Web Workers'] },
    { title: 'Tooling & Build',   modules: ['Module Bundlers', 'TypeScript Integration', 'Testing Strategies', 'Custom Framework'] },
  ],
  'AWS': [
    { title: 'AWS Core',         modules: ['EC2 & VPC', 'S3 & IAM', 'Lambda (Serverless)', 'CloudWatch & Logging'] },
    { title: 'Containers',       modules: ['ECS & EKS', 'Fargate', 'ECR Registry', 'Load Balancing'] },
    { title: 'IaC & Automation', modules: ['Terraform Basics', 'CloudFormation', 'AWS CDK', 'Parameter Store'] },
    { title: 'CI/CD on AWS',     modules: ['CodePipeline', 'CodeBuild', 'Blue/Green Deploy', 'Cost Optimisation'] },
  ],
};

const S = {
  bg:      'var(--bg-cream)',
  card:    'var(--surface-raised)',
  border:  'var(--border-clay)',
  primary: 'var(--text-dark)',
  sub:     'var(--text-muted)',
  teal:    '#006B7A',
  green:   '#2E7D52',
  orange:  '#D95F2B',
};

export default function ProgressPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { isReady } = useAuthGuard();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!user) return;
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
  const skillScore = profile?.skillScore ?? 0;
  const labsCompleted = profile?.labsCompleted ?? 0;
  const streak =
    (profile?.streakDays ?? profile?.streak ?? 0) > 0
      ? (profile?.streakDays ?? profile?.streak ?? 0)
      : 0;
  const xp = profile?.xp ?? 0;
  const employabilityScore = profile?.employabilityScore ?? 0;
  const employabilityLevel = profile?.employabilityLevel ?? 'Unrated';
  const onboardingComplete = profile?.onboardingComplete ?? false;
  const memberSince = (() => {
    if (!profile?.createdAt) return 'Recently joined';
    try {
      const date = (profile.createdAt as any).toDate ? (profile.createdAt as any).toDate() : new Date(profile.createdAt);
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return 'Recently joined';
    }
  })();

  // Map learningPath label (Firestore) → ROADMAP_STAGES key
  const getLearningPathKey = (path: string | null): string | null => {
    if (!path) return null;
    const p = path.toLowerCase();
    if (p.includes('flutter'))                                                        return 'Flutter';
    if (p.includes('react native'))                                                   return 'ReactNative';
    if (p.includes('android') || p.includes('kotlin'))                               return 'Android';
    if (p.includes('django'))                                                         return 'Django';
    if (p.includes('vue'))                                                            return 'Vue';
    if (p.includes('mern') || p.includes('full stack') || p.includes('fullstack'))   return 'MERN';
    if (p.includes('docker') || p.includes('kubernetes'))                            return 'Cloud';
    if (p.includes('devops') || p.includes('aws'))                                   return 'AWS';
    if (p.includes('cybersecurity') || p.includes('cyber') || p.includes('security')) return 'Cybersecurity';
    if (p.includes('blockchain'))                                                     return 'Blockchain';
    if (p.includes('machine learning') || p.includes('ml engineer'))                 return 'MachineLearning';
    if (p.includes('data science'))                                                   return 'DataScience';
    if (p.includes('nlp') || p.includes('natural language') || p.includes('ai engineering')) return 'NLP';
    if (p.includes('dsa') || p.includes('algorithm') || p.includes('interview'))     return 'DSA';
    if (p.includes('javascript mastery'))                                             return 'JavaScript';
    if (p.includes('python beginner'))                                                return 'PythonBeginners';
    if (p.includes('backend') || p.includes('node'))                                 return 'Backend';
    if (p.includes('frontend') || p.includes('react'))                               return 'Frontend';
    return null;
  };

  const roadmapKey = getLearningPathKey(learningPath);
  const roadmap = roadmapKey ? ROADMAP_STAGES[roadmapKey] : null;

  const stats = [
    { label: 'Skill Score', value: skillScore > 0 ? skillScore.toString() : '—', icon: <FiAward size={20} />, color: S.teal, sub: skillScore > 0 ? 'Based on lab performance' : 'Complete labs to earn score' },
    { label: 'Labs Done', value: labsCompleted.toString(), icon: <FiTerminal size={20} />, color: S.green, sub: labsCompleted > 0 ? `${labsCompleted} lab${labsCompleted !== 1 ? 's' : ''} completed` : 'Start your first lab' },
    { label: 'Day Streak', value: String(streak), icon: <FiZap size={20} />, color: S.orange, sub: streak > 0 ? 'Keep it going!' : 'Log in daily to build streak' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: S.bg, color: S.primary }} className="transition-colors duration-300">

      {/* HEADER */}
      <div style={{ padding: '20px 32px', borderBottom: `2px solid ${S.border}`, background: 'var(--bg-cream-deep)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 16px var(--shadow-clay)' }}>
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
              {onboardingComplete
                ? `Employability: ${employabilityLevel}${employabilityScore > 0 ? ` (${employabilityScore}/100)` : ''}${xp > 0 ? ` · ${xp} XP` : ''}`
                : 'Run the onboarding calibration to get your personalized learning path.'}
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

        {/* SKILL GRAPH */}
        <div style={{ marginBottom: 32 }}>
           <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: S.teal, marginBottom: 16 }}>Skill Architecture</div>
           <SkillGraph modules={[
              { id: 1, title: 'Concept Mastery', energy_cost: 20, difficulty: 'Beginner' },
              { id: 2, title: 'Neural Logic', energy_cost: 35, difficulty: 'Intermediate' },
              { id: 3, title: 'Scale Architect', energy_cost: 50, difficulty: 'Hard' }
           ]} />
        </div>

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
