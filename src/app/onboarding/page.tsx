'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { FiCpu, FiUser, FiCheck, FiChevronRight, FiArrowRight, FiPhone, FiHash, FiBookOpen } from 'react-icons/fi';
import { toast } from '@/lib/toast';

// ─── TRACKS ───────────────────────────────────────────────────────────────────
const TRACKS = [
  { id: 'frontend',    emoji: '⚛️', label: 'Frontend Dev',             desc: 'React · Next.js · TypeScript · CSS' },
  { id: 'backend',     emoji: '🚀', label: 'Backend Dev',              desc: 'Node.js · Express · Databases · APIs' },
  { id: 'mern',        emoji: '📚', label: 'MERN Stack',               desc: 'MongoDB · Express · React · Node' },
  { id: 'dsa',         emoji: '🧠', label: 'DSA & Interviews',         desc: 'Algorithms · Data Structures · LeetCode' },
  { id: 'ai',          emoji: '💬', label: 'AI Engineering NLP',       desc: 'NLP · LLMs · RAG · Transformers' },
  { id: 'ml',          emoji: '🤖', label: 'Machine Learning Engineer',desc: 'Scikit-learn · PyTorch · Model Deployment' },
  { id: 'data-science',emoji: '📊', label: 'Data Science Python',      desc: 'Pandas · NumPy · Matplotlib · SQL' },
  { id: 'python',      emoji: '🐍', label: 'Python Beginners',         desc: 'Variables · Loops · Functions · Projects' },
  { id: 'flutter',     emoji: '🦋', label: 'Flutter / Cross-Platform', desc: 'Dart · Flutter · Android + iOS' },
  { id: 'ios',         emoji: '📱', label: 'React Native Dev',         desc: 'React Native · Expo · Navigation · Hooks' },
  { id: 'android',     emoji: '🤖', label: 'Android Dev Kotlin',       desc: 'Kotlin · Jetpack Compose · Firebase' },
  { id: 'django',      emoji: '🐍', label: 'Backend Django Python',    desc: 'Python · Django · DRF · PostgreSQL' },
  { id: 'vue',         emoji: '🟢', label: 'Frontend Vue Dev',         desc: 'Vue 3 · Composition API · Pinia · Vite' },
  { id: 'cloud',       emoji: '🐳', label: 'Docker Kubernetes DevOps', desc: 'Docker · Kubernetes · CI/CD · YAML' },
  { id: 'cyber',       emoji: '🔐', label: 'Cybersecurity Ethical Hacking', desc: 'Pentesting · OWASP · CTFs · Security+' },
  { id: 'blockchain',  emoji: '⛓️', label: 'Blockchain Dev',           desc: 'Solidity · Web3.js · Ethereum · DeFi' },
  { id: 'javascript',  emoji: '🟨', label: 'JavaScript Mastery',       desc: 'V8 Engine · Closures · Async · Patterns' },
  { id: 'aws',         emoji: '☁️', label: 'DevOps with AWS Cloud',    desc: 'EC2 · S3 · Lambda · Terraform · CI/CD' },
  { id: 'ai-ml',       emoji: '🧠', label: 'AI/ML Engineer',           desc: 'PyTorch · Transformers · MLOps · LLM Fine-tuning' },
  { id: 'data-eng',    emoji: '🗄️', label: 'Data Engineering',         desc: 'SQL · Spark · Airflow · Kafka · Data Lakes · ETL' },
  { id: 'web3',        emoji: '⛓️', label: 'Web3/Blockchain Pro',      desc: 'Solidity · DeFi · Auditing · IPFS · DAO · Bridges' },
  { id: 'cloud-native',emoji: '☁️', label: 'Cloud Native Developer',   desc: 'Docker · K8s Operators · Terraform · Prometheus · CI/CD' },
];

const LEVELS = [
  { id: 'beginner',     label: 'Beginner',     sub: '0 – 1 year',  emoji: '🌱', desc: 'Just starting out, building foundations' },
  { id: 'intermediate', label: 'Intermediate', sub: '2 – 4 years', emoji: '⚡', desc: 'Know the basics, ready to go deeper' },
  { id: 'veteran',      label: 'Veteran',      sub: '5+ years',    emoji: '🔥', desc: 'Experienced, mastering & specialising' },
];

const trendingTopics = [
  { text: '🔥 Zero-Day Vulnerability in Linux Kernel', category: 'Security' },
  { text: '🚀 Rust Programming Rising in 2024', category: 'Development' },
  { text: '🛡️ New OWASP Top 10 Released', category: 'Web Security' },
  { text: '🤖 AI-Powered Cyber Attacks Increase 300%', category: 'AI Security' },
  { text: '💻 Splunk SIEM Demand Growing', category: 'SOC' },
  { text: '🔐 Multi-Factor Authentication Now Mandatory', category: 'Security' },
  { text: '⚡ Python 3.13 Performance Boost', category: 'Development' },
  { text: '🌐 IPv6 Adoption Reaches 50%', category: 'Networking' },
];

const catColors: Record<string, string> = {
  'Security': '#B04A1E',
  'Development': '#006B7A',
  'Web Security': '#2E7D52',
  'AI Security': '#8B3A15',
  'SOC': '#5C3D1E',
  'Networking': '#2E7D52'
};

const S = {
  bg:     '#FDF6EC',
  card:   '#FFFFFF',
  border: 'rgba(180,140,90,0.25)',
  text:   '#2C1A0E',
  sub:    '#8B6E52',
  muted:  '#B89A7E',
  teal:   '#006B7A',
  green:  '#2E7D52',
  dot:    'rgba(0,107,122,0.10)',
  input:  '#F9F2E8',
};

interface StudentDetails {
  fullName: string;
  college: string;
  collegeCode: string;
  regNumber: string;
  mobile: string;
}

const inputStyle = (focused: boolean): React.CSSProperties => ({
  width: '100%', background: S.input,
  border: `1.5px solid ${focused ? S.teal : S.border}`,
  borderRadius: 12, padding: '13px 16px 13px 44px',
  fontSize: 14, fontWeight: 600, color: S.text,
  outline: 'none', boxSizing: 'border-box',
  transition: 'all 0.2s',
  boxShadow: focused ? `0 0 0 3px rgba(0,107,122,0.1)` : 'inset 0 2px 4px rgba(100,60,20,0.04)',
});

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { isReady } = useAuthGuard();

  const [step, setStep] = useState<0 | 1 | 2 | 3>(0); // 0=intro, 1=details, 2=track, 3=level
  const [details, setDetails] = useState<StudentDetails>({ fullName: '', college: '', collegeCode: '', regNumber: '', mobile: '' });

  useEffect(() => {
    if (!user || !db) return;
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setDetails(prev => ({
            ...prev,
            fullName: userData.displayName || prev.fullName,
            college: userData.collegeName || prev.college
          }));
        }
      } catch (err) {
        console.error('Error fetching user data in onboarding:', err);
      }
    };
    fetchUserData();
  }, [user]);
  const [focus, setFocus] = useState('');
  const [selectedTrack, setTrack] = useState('');
  const [selectedLevel, setLevel] = useState('');
  const [finishing, setFinishing] = useState(false);
  const [detailsError, setDetailsError] = useState('');

  if (!isReady) return (
    <div style={{ minHeight: '100vh', background: S.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontWeight: 700, color: S.sub, fontSize: 14 }}>Loading...</div>
    </div>
  );

  // Validate details step
  const validateDetails = () => {
    if (!details.fullName.trim()) return 'Full name is required.';
    if (!details.college.trim()) return 'College / institution name is required.';
    if (!details.mobile.trim() || !/^\d{10}$/.test(details.mobile.replace(/\s/g, '')))
      return 'Enter a valid 10-digit mobile number.';
    return '';
  };

  const handleDetailsNext = async () => {
    const err = validateDetails();
    if (err) { setDetailsError(err); return; }
    
    // Check college code if provided
    if (details.collegeCode.trim()) {
      try {
        const res = await fetch(`/api/college/check-code?code=${details.collegeCode.trim()}`);
        const data = await res.json();
        if (data.exists) {
          // If college name is empty, auto-fill it
          if (!details.college.trim()) {
            setDetails(p => ({ ...p, college: data.collegeName }));
          }
          setDetailsError('');
          setStep(2);
        } else {
          setDetailsError('Invalid college code. Please check and try again.');
          return;
        }
      } catch (error) {
        console.error('Error checking college code:', error);
        setDetailsError('Error validating college code.');
        return;
      }
    } else {
      setDetailsError('');
      setStep(2);
    }
  };

  const handleTrackSelect = (id: string) => {
    setTrack(id);
    setTimeout(() => setStep(3), 350);
  };

  const handleLevelSelect = async (id: string) => {
    setLevel(id);
    setFinishing(true);

    const track = TRACKS.find(t => t.id === selectedTrack);
    const level = LEVELS.find(l => l.id === id);

    const profileData = {
      displayName: details.fullName.trim(),
      college: details.college.trim(),
      collegeCode: details.collegeCode.trim() || null,
      regNumber: details.regNumber.trim(),
      mobile: details.mobile.trim(),
      learningPath: track?.label || selectedTrack,
      proficiencyLevel: level?.label || id,
      onboardingComplete: true,
      role: 'student',
      isPublicProfile: true,
      updatedAt: new Date().toISOString(),
    };

    const profileKey = user ? 'pp_profile_' + user.uid : 'pp_profile_guest';
    localStorage.setItem(profileKey, JSON.stringify(profileData));

    if (user) {
      try {
        await Promise.race([
          updateDoc(doc(db, 'users', user.uid), profileData),
          new Promise<void>((_, rej) => setTimeout(() => rej(), 4000))
        ]);

        // Also link profile in Supabase
        await fetch('/api/college/link-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.uid,
            email: user.email,
            fullName: details.fullName.trim(),
            collegeCode: details.collegeCode.trim(),
            collegeName: details.college.trim(),
            yearOfStudy: null, // User can update later in profile settings
            profileImageUrl: null,
            showProfileToAdmins: true
          })
        });

        toast.success('Profile saved!');
      } catch {
        toast.success('Saved locally — will sync when online.');
      }
    }
    setTimeout(() => router.push('/dashboard'), 1600);
  };

  const track = TRACKS.find(t => t.id === selectedTrack);
  const level = LEVELS.find(l => l.id === selectedLevel);
  const totalSteps = 3;
  const currentStep = step === 0 ? 0 : step === 1 ? 1 : step === 2 ? 2 : 3;

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: S.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {/* Dot bg */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, backgroundImage: `radial-gradient(circle, ${S.dot} 1.5px, transparent 1.5px)`, backgroundSize: '32px 32px' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: step === 2 ? 860 : 640 }}>
        <motion.div layout transition={{ type: 'spring', stiffness: 200, damping: 28 }}
          style={{ background: S.card, borderRadius: 28, border: `2px solid ${S.border}`, boxShadow: '0 4px 0 rgba(255,255,255,0.9) inset, 0 24px 64px rgba(140,90,40,0.13)', overflow: 'hidden' }}>

          {/* ── HEADER ── */}
          <div style={{ padding: '18px 28px', borderBottom: `1.5px solid ${S.border}`, background: S.bg, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Logo */}
              <div style={{ width: 38, height: 38, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image src="/logo.webp" alt="Path Pilot" width={38} height={38} style={{ objectFit: 'contain' }} onError={() => {}} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: S.text, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Skill Calibration</div>
                <div style={{ fontSize: 11, color: S.muted, fontWeight: 600 }}>Path Pilot · 3 quick steps</div>
              </div>
            </div>
            {/* Step dots */}
            {step > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {[1, 2, 3].map(n => {
                  const done = currentStep > n;
                  const active = currentStep === n;
                  return (
                    <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, transition: 'all 0.3s', background: done ? S.green : active ? S.teal : 'rgba(180,140,90,0.12)', color: (done || active) ? '#fff' : S.muted, border: `2px solid ${done ? S.green : active ? S.teal : S.border}` }}>
                        {done ? <FiCheck size={11} /> : n}
                      </div>
                      {n < 3 && <div style={{ width: 22, height: 2, background: currentStep > n ? S.green : S.border, borderRadius: 1, transition: 'all 0.4s' }} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── BODY ── */}
          <div style={{ overflowY: 'auto', maxHeight: '76vh' }}>
            <AnimatePresence mode="wait">

              {/* STEP 0 — Intro */}
              {step === 0 && (
                <motion.div key="intro" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <div style={{ padding: '48px 40px', textAlign: 'center' }}>
                    <div style={{ width: 80, height: 80, margin: '0 auto 24px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Image src="/logo.webp" alt="Path Pilot" width={80} height={80} style={{ objectFit: 'contain' }} />
                    </div>
                    <h2 style={{ fontSize: 26, fontWeight: 900, color: S.text, letterSpacing: '-0.03em', margin: '0 0 12px' }}>Welcome to Path Pilot</h2>
                    <p style={{ fontSize: 15, color: S.sub, lineHeight: 1.7, maxWidth: 400, margin: '0 auto 36px', fontWeight: 500 }}>
                      In 3 quick steps, I'll build your personalized learning roadmap. Let's start with your details.
                    </p>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setStep(1)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 32px', background: `linear-gradient(135deg, ${S.teal}, ${S.green})`, border: 'none', borderRadius: 14, cursor: 'pointer', fontWeight: 900, fontSize: 14, color: '#fff', boxShadow: `0 6px 24px rgba(0,107,122,0.35), 0 2px 0 rgba(255,255,255,0.2) inset` }}>
                      Get Started <FiArrowRight size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* STEP 1 — Student Details */}
              {step === 1 && (
                <motion.div key="details" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <div style={{ padding: '32px 32px 36px' }}>
                    {/* AI bubble */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 28 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${S.teal}, ${S.green})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                        <FiCpu size={16} />
                      </div>
                      <div style={{ background: '#EDE4D3', border: `1px solid ${S.border}`, borderRadius: '4px 20px 20px 20px', padding: '14px 18px', fontSize: 14, color: S.text, fontWeight: 600, lineHeight: 1.6, boxShadow: '0 2px 0 rgba(255,255,255,0.9) inset' }}>
                        First, let me know who you are! Fill in your details below so your roadmap and certificate feel personal.
                      </div>
                    </div>

                    {/* Form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                      {/* Full name */}
                      <div style={{ position: 'relative' }}>
                        <FiUser size={15} color={focus === 'name' ? S.teal : S.muted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input value={details.fullName} onChange={e => setDetails(p => ({ ...p, fullName: e.target.value }))}
                          onFocus={() => setFocus('name')} onBlur={() => setFocus('')}
                          placeholder="Full Name *"
                          style={inputStyle(focus === 'name')} />
                      </div>

                      {/* College Code */}
                      <div style={{ position: 'relative' }}>
                        <FiBookOpen size={15} color={focus === 'collegeCode' ? S.teal : S.muted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input value={details.collegeCode} onChange={e => setDetails(p => ({ ...p, collegeCode: e.target.value.toUpperCase() }))}
                          onFocus={() => setFocus('collegeCode')} onBlur={() => setFocus('')}
                          placeholder="College Code (If provided by institution)"
                          style={inputStyle(focus === 'collegeCode')} />
                      </div>

                      {/* College */}
                      <div style={{ position: 'relative' }}>
                        <FiBookOpen size={15} color={focus === 'college' ? S.teal : S.muted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input value={details.college} onChange={e => setDetails(p => ({ ...p, college: e.target.value }))}
                          onFocus={() => setFocus('college')} onBlur={() => setFocus('')}
                          placeholder="College / Institution Name *"
                          style={inputStyle(focus === 'college')} />
                      </div>

                      {/* Reg number & mobile in a row */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div style={{ position: 'relative' }}>
                          <FiHash size={15} color={focus === 'reg' ? S.teal : S.muted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                          <input value={details.regNumber} onChange={e => setDetails(p => ({ ...p, regNumber: e.target.value }))}
                            onFocus={() => setFocus('reg')} onBlur={() => setFocus('')}
                            placeholder="Reg / Roll Number"
                            style={inputStyle(focus === 'reg')} />
                        </div>
                        <div style={{ position: 'relative' }}>
                          <FiPhone size={15} color={focus === 'mobile' ? S.teal : S.muted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                          <input value={details.mobile} onChange={e => setDetails(p => ({ ...p, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                            onFocus={() => setFocus('mobile')} onBlur={() => setFocus('')}
                            placeholder="Mobile Number *" maxLength={10} inputMode="tel"
                            style={inputStyle(focus === 'mobile')} />
                        </div>
                      </div>

                      {detailsError && (
                        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                          style={{ fontSize: 12, color: '#B04A1E', fontWeight: 700, padding: '8px 14px', background: 'rgba(176,74,30,0.08)', border: '1px solid rgba(176,74,30,0.2)', borderRadius: 8 }}>
                          ⚠️ {detailsError}
                        </motion.div>
                      )}

                      <div style={{ fontSize: 11, color: S.muted, fontWeight: 500 }}>
                        * Required. Your data is private and only used for your roadmap & certificates.
                      </div>

                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleDetailsNext}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', background: `linear-gradient(135deg, ${S.teal}, ${S.green})`, border: 'none', borderRadius: 14, cursor: 'pointer', fontWeight: 900, fontSize: 14, color: '#fff', boxShadow: `0 6px 20px rgba(0,107,122,0.3)` }}>
                        Continue <FiArrowRight size={15} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 — Choose Track */}
              {step === 2 && (
                <motion.div key="track" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <div style={{ padding: '28px 28px 36px' }}>
                    {/* User echo */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: `linear-gradient(135deg, ${S.teal}, ${S.green})`, borderRadius: '20px 4px 20px 20px', padding: '10px 16px', fontSize: 13, color: '#fff', fontWeight: 700, boxShadow: '0 4px 12px rgba(0,107,122,0.25)' }}>
                        👋 {details.fullName.split(' ')[0] || 'Hello'} · {details.college.split(' ').slice(0, 3).join(' ')}
                        <FiUser size={13} style={{ opacity: 0.7 }} />
                      </div>
                    </div>
                    {/* AI bubble */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 24 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${S.teal}, ${S.green})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                        <FiCpu size={16} />
                      </div>
                      <div style={{ background: '#EDE4D3', border: `1px solid ${S.border}`, borderRadius: '4px 20px 20px 20px', padding: '14px 18px', fontSize: 14, color: S.text, fontWeight: 600, lineHeight: 1.6, boxShadow: '0 2px 0 rgba(255,255,255,0.9) inset' }}>
                        Great to meet you, <strong style={{ color: S.teal }}>{details.fullName.split(' ')[0] || 'there'}</strong>! Which area excites you most? Your roadmap will be built around this.
                      </div>
                    </div>

                    {/* Trending Marquee */}
                    <div className="marquee-container" style={{ margin: '0 -28px 24px -28px', background: 'linear-gradient(90deg, rgba(237, 228, 211, 0) 0%, rgba(237, 228, 211, 0.4) 50%, rgba(237, 228, 211, 0) 100%)', padding: '12px 0', borderTop: `1px solid ${S.border}`, borderBottom: `1px solid ${S.border}` }}>
                      <div className="marquee-content">
                        {[...trendingTopics, ...trendingTopics, ...trendingTopics].map((topic, i) => (
                          <div key={i} className="marquee-item" style={{ 
                            display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 16px', margin: '0 10px', 
                            background: '#fff', borderRadius: 20, border: `1.5px solid ${S.border}`,
                            boxShadow: '0 2px 8px rgba(140,90,40,0.06)'
                          }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: S.text }}>{topic.text}</span>
                            <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: catColors[topic.category] || S.teal, backgroundColor: `${catColors[topic.category] || S.teal}15`, padding: '3px 8px', borderRadius: 12 }}>{topic.category}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Track grid — responsive: 1 col mobile, 2 col tablet, 3 col desktop */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5" style={{ display: 'grid', gap: 10 }}>
                      {TRACKS.map((t, i) => (
                        <motion.button key={t.id} onClick={() => handleTrackSelect(t.id)}
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                          whileHover={{ y: -3, boxShadow: `0 8px 24px rgba(0,107,122,0.18)` }} whileTap={{ scale: 0.97 }}
                          style={{ padding: '15px 13px', background: S.card, border: `2px solid ${S.border}`, borderRadius: 15, cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s', boxShadow: '0 2px 0 rgba(255,255,255,0.8) inset, 0 4px 12px rgba(140,90,40,0.06)', position: 'relative' }}>
                          <div style={{ fontSize: 22, marginBottom: 8 }}>{t.emoji}</div>
                          <div style={{ fontSize: 12, fontWeight: 800, color: S.text, marginBottom: 3 }}>{t.label}</div>
                          <div style={{ fontSize: 10, fontWeight: 600, color: S.muted, lineHeight: 1.4 }}>{t.desc}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 — Choose Level */}
              {step === 3 && (
                <motion.div key="level" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <div style={{ padding: '28px 32px 36px' }}>
                    {/* Track echo */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: `linear-gradient(135deg, ${S.teal}, ${S.green})`, borderRadius: '20px 4px 20px 20px', padding: '10px 16px', fontSize: 13, color: '#fff', fontWeight: 700, boxShadow: '0 4px 12px rgba(0,107,122,0.25)' }}>
                        {track?.emoji} {track?.label}
                        <FiUser size={13} style={{ opacity: 0.7 }} />
                      </div>
                    </div>
                    {/* AI bubble */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 24 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${S.teal}, ${S.green})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                        <FiCpu size={16} />
                      </div>
                      <div style={{ background: '#EDE4D3', border: `1px solid ${S.border}`, borderRadius: '4px 20px 20px 20px', padding: '14px 18px', fontSize: 14, color: S.text, fontWeight: 600, lineHeight: 1.6, boxShadow: '0 2px 0 rgba(255,255,255,0.9) inset' }}>
                        Excellent! <strong style={{ color: S.teal }}>{track?.label}</strong> is a great pick. Last step — how experienced are you?
                      </div>
                    </div>
                    {/* Level cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {LEVELS.map((l, i) => (
                        <motion.button key={l.id} onClick={() => handleLevelSelect(l.id)}
                          initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                          whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                          style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '17px 20px', background: S.card, border: `2px solid ${S.border}`, borderRadius: 16, cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s', boxShadow: '0 2px 0 rgba(255,255,255,0.8) inset, 0 4px 12px rgba(140,90,40,0.07)' }}>
                          <div style={{ fontSize: 28, flexShrink: 0 }}>{l.emoji}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                              <span style={{ fontSize: 14, fontWeight: 800, color: S.text }}>{l.label}</span>
                              <span style={{ fontSize: 11, fontWeight: 700, color: S.muted, background: 'rgba(180,140,90,0.1)', padding: '2px 8px', borderRadius: 99, border: `1px solid ${S.border}` }}>{l.sub}</span>
                            </div>
                            <div style={{ fontSize: 12, color: S.sub, fontWeight: 500 }}>{l.desc}</div>
                          </div>
                          <FiChevronRight size={18} color={S.muted} />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Finish overlay */}
            <AnimatePresence>
              {finishing && (
                <motion.div key="finish" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ position: 'absolute', inset: 0, background: S.card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, borderRadius: 28, zIndex: 10 }}>
                  <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 1.2, repeat: 1 }} style={{ fontSize: 52 }}>🎉</motion.div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: S.text, letterSpacing: '-0.02em', marginBottom: 6 }}>Roadmap Ready, {details.fullName.split(' ')[0]}!</div>
                    <div style={{ fontSize: 14, color: S.sub, fontWeight: 500 }}>
                      <span style={{ color: S.teal, fontWeight: 800 }}>{track?.label}</span> · <span style={{ color: S.green, fontWeight: 800 }}>{level?.label}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: S.muted, fontWeight: 600 }}>Heading to your dashboard...</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.2 }}
                        style={{ width: 8, height: 8, borderRadius: '50%', background: S.teal }} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <p style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: S.muted, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Path Pilot · Your journey, your pace
        </p>
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(180,140,90,0.25); border-radius: 10px; }
        
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
          width: calc(100% + 56px);
        }
        .marquee-content {
          display: inline-flex;
          animation: scroll 40s linear infinite;
        }
        .marquee-content:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-content { animation: none; }
        }
        @media (max-width: 640px) {
          .marquee-container { width: 100%; }
        }
      `}</style>
    </div>
  );
}
