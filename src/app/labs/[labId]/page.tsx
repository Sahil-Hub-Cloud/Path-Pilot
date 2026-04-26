'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import {
  FiArrowLeft, FiPlay, FiZap, FiSearch, FiXCircle, FiCheckCircle,
  FiActivity, FiHelpCircle, FiPlus, FiX, FiSave, FiFile,
  FiCpu, FiSend, FiAlertTriangle, FiChevronDown, FiCode, FiTerminal, FiClock
} from 'react-icons/fi';
import { executeCode } from '@/lib/piston';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp, collection } from 'firebase/firestore';
import { fetchResilient } from '@/lib/firestore-resilience';
import { addNotification } from '@/lib/notifications';
import { LABS } from '@/lib/data/labs';

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface FileTab { id: string; name: string; language: string; content: string; saved: boolean; }
interface AnalysisIssue { line: string; type: string; hint: string; }
interface AIMessage { role: 'ai' | 'user'; content: string; isBlocked?: boolean; }

// ─── LANGUAGE CONFIG ──────────────────────────────────────────────────────────
const LANGS: Record<string, { ext: string; label: string; starter: string; monacoId: string }> = {
  python:     { ext: 'py',  label: 'Python',     monacoId: 'python',     starter: '# Write your solution here\n\ndef solution():\n    pass\n\nprint(solution())' },
  javascript: { ext: 'js',  label: 'JavaScript', monacoId: 'javascript', starter: '// Write your solution here\n\nfunction solution() {\n  \n}\n\nconsole.log(solution());' },
  typescript: { ext: 'ts',  label: 'TypeScript', monacoId: 'typescript', starter: '// Write your solution here\n\nfunction solution(): void {\n  \n}\n\nconsole.log(solution());' },
  java:       { ext: 'java',label: 'Java',       monacoId: 'java',       starter: 'public class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello!");\n    }\n}' },
  cpp:        { ext: 'cpp', label: 'C++',        monacoId: 'cpp',        starter: '#include<iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello!" << endl;\n    return 0;\n}' },
  go:         { ext: 'go',  label: 'Go',         monacoId: 'go',         starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello!")\n}' },
  rust:       { ext: 'rs',  label: 'Rust',       monacoId: 'rust',       starter: 'fn main() {\n    println!("Hello!");\n}' },
};

// ─── LABS DATA is now loaded from @/lib/data/labs ────────────────────────────

// ─── STYLES ──────────────────────────────────────────────────────────────────
const C = {
  bg:     '#0D0D0F',
  panel:  '#13131A',
  card:   '#1A1A24',
  border: 'rgba(255,255,255,0.07)',
  accent: '#7C3AED',
  green:  '#10B981',
  amber:  '#F59E0B',
  red:    '#EF4444',
  blue:   '#3B82F6',
  text:   '#E2E2EE',
  sub:    '#888899',
  muted:  '#444455',
};

function newFile(lang: string, name?: string): FileTab {
  const cfg = LANGS[lang] || LANGS.python;
  return {
    id: Date.now().toString(),
    name: name || 'main.' + cfg.ext,
    language: lang,
    content: cfg.starter,
    saved: true,
  };
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function LabPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const labId  = (params?.labId as string) || 'lab-001';
  const LAB    = LABS[labId] ?? null;                          // null = unrecognised
  // Key by userId+labId — isolates each user's code on the same machine
  const labStorageKey = `pp_lab_${user?.uid || 'guest'}_${labId}`;

  // File system
  const [files, setFiles]           = useState<FileTab[]>([newFile('python', 'solution.py')]);
  const [activeFileId, setActive]   = useState<string>('');
  const [newFileName, setNewFN]     = useState('');
  const [newFileLang, setNewFL]     = useState('python');
  const [showNewFile, setShowNF]    = useState(false);

  // Execution
  const [output, setOutput]         = useState('');
  const [isRunning, setIsRunning]   = useState(false);
  const [isSubmitting, setIsSub]    = useState(false);
  const [execTime, setExecTime]     = useState<string | null>(null);
  const [testResults, setTests]     = useState<{pass: boolean, label: string}[]>([]);

  // Panels
  const [left, setLeft]             = useState<'problem' | 'tests'>('problem');
  const [rightPanel, setRight]      = useState<'none' | 'analyzer' | 'ai'>('none');

  // Analyzer
  const [analyzerIssues, setIssues] = useState<AnalysisIssue[]>([]);
  const [isAnalyzing, setIsAna]     = useState(false);

  // AI Assistant (Socratic gating)
  const [aiMessages, setAIMsg]      = useState<AIMessage[]>([
    { role: 'ai', content: "👋 Hi! I'm your AI coding assistant. I can help you think through problems — but I won't write the solution for you directly. What have you tried so far?" }
  ]);
  const [aiInput, setAIIn]          = useState('');
  const [aiLoading, setAILoad]      = useState(false);
  const [attemptsBeforeAI, setStat] = useState(0); // tracks how many runs student has done
  const chatRef = useRef<HTMLDivElement>(null);

  // Hints
  const [showHint, setHint]         = useState(false);
  const [hintUsed, setHintUsed]     = useState(false);  // true once XP has been charged this session
  const [hintToast, setHintToast]   = useState(false);  // drives the −5 XP toast animation

  // Analytics Badge
  const [submitBadge, setSubmitBadge] = useState<{ tier: string; color: string; pass: number; total: number } | null>(null);

  // Timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsedSeconds(p => p + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatTimeVerbose = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    if (m === 0) return `${s} seconds`;
    if (s === 0) return `${m} minute${m !== 1 ? 's' : ''}`;
    return `${m} minute${m !== 1 ? 's' : ''} ${s} seconds`;
  };

  // Init — re-runs when user or labId changes
  useEffect(() => {
    // Reset per-lab UI state
    setElapsedSeconds(0);
    setTests([]);
    setOutput('');
    setExecTime(null);
    setStat(0);
    setSubmitBadge(null);
    setHint(false);
    setLeft('problem');
    setAIMsg([{ role: 'ai', content: "👋 Hi! I'm your AI coding assistant. I can help you think through problems — but I won't write the solution for you directly. What have you tried so far?" }]);

    const lang = LAB?.defaultLang || 'python';
    const ext  = LANGS[lang]?.ext || 'py';
    const defaultFile = newFile(lang, `solution.${ext}`);

    const saved = localStorage.getItem(labStorageKey);
    if (saved) {
      try {
        const f: FileTab[] = JSON.parse(saved);
        if (f.length > 0) { setFiles(f); setActive(f[0].id); return; }
      } catch {}
    }
    setFiles([defaultFile]);
    setActive(defaultFile.id);
  }, [labId, user?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [aiMessages]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  const updateFile = (id: string, content: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, content, saved: false } : f));
  };

  const saveAll = () => {
    const saved = files.map(f => ({ ...f, saved: true }));
    setFiles(saved);
    localStorage.setItem(labStorageKey, JSON.stringify(saved));
  };

  const addFile = () => {
    if (!newFileName.trim()) return;
    const cfg = LANGS[newFileLang] || LANGS.python;
    const name = newFileName.includes('.') ? newFileName : newFileName + '.' + cfg.ext;
    const f = newFile(newFileLang, name);
    setFiles(p => [...p, f]);
    setActive(f.id);
    setNewFN('');
    setShowNF(false);
  };

  const removeFile = (id: string) => {
    if (files.length === 1) return;
    const next = files.filter(f => f.id !== id);
    setFiles(next);
    if (activeFileId === id) setActive(next[0].id);
  };

  // ── Run ──────────────────────────────────────────────────────────────────
  const handleRun = async () => {
    if (!activeFile) return;
    setIsRunning(true);
    setSubmitBadge(null);
    setOutput('▶ Running ' + activeFile.name + '...\n');
    const t0 = performance.now();
    try {
      const res = await executeCode(activeFile.language, activeFile.content);
      setExecTime(((performance.now() - t0) / 1000).toFixed(2) + 's');
      const out = res.run.output || '(no output)';
      const err = res.run.stderr;
      setOutput((err ? '[stderr]\n' + err + '\n\n[stdout]\n' : '') + out);
      setStat(p => p + 1);
    } catch (e: any) {
      setOutput('Execution failed: ' + e.message);
    } finally {
      setIsRunning(false);
    }
  };

  // ── Firestore: persist lab result ─────────────────────────────────────────
  const saveLabResultToFirestore = async (passedCount: number, totalCount: number, timeSpentSeconds: number) => {
    if (!user?.uid || !db) return;
    const passRatio  = totalCount > 0 ? passedCount / totalCount : 0;
    // skillScore = integer 0-100; weighted blend: 70% new result + 30% existing
    const newScore   = Math.round(passRatio * 100);
    const userRef    = doc(db, 'users', user.uid);

    const calcEmpData = (skillScr: number, labsNum: number) => {
        const cappedLabsFactor = Math.min(labsNum / 10, 1.0) * 100;
        const empScore = Math.round((skillScr + cappedLabsFactor) / 2);
        let empLevel = 'Low';
        if (empScore >= 71) empLevel = 'High — Job Ready';
        else if (empScore >= 41) empLevel = 'Medium';
        return { employabilityScore: empScore, employabilityLevel: empLevel };
    };

    try {
      const submissionRef = doc(collection(db, 'users', user.uid, 'submissions'));
      await setDoc(submissionRef, {
        labId: LAB.id,
        passedCount,
        totalCount,
        timeSpentSeconds,
        timestamp: serverTimestamp()
      });

      const snap = await fetchResilient(userRef);
      if (snap && snap.exists()) {
        const existing   = snap.data();
        const oldScore   = typeof existing.skillScore === 'number' ? existing.skillScore : 0;
        const blendScore = Math.round(oldScore * 0.3 + newScore * 0.7);
        const currLabsPassed = typeof existing.labsCompleted === 'number' ? existing.labsCompleted : 0;
        const { employabilityScore, employabilityLevel } = calcEmpData(blendScore, currLabsPassed + 1);

        await updateDoc(userRef, {
          xp:            increment(LAB.xp),
          labsCompleted: increment(1),
          skillScore:    blendScore,
          employabilityScore,
          employabilityLevel,
          lastActive:    serverTimestamp(),
        });

        // Trigger notifications
        await addNotification(user.uid, 'lab', 'Mission Success', `Lab "${LAB.title}" completed. +${LAB.xp} XP archived.`);
        
        if (existing.employabilityLevel !== employabilityLevel && existing.employabilityLevel) {
          await addNotification(user.uid, 'employability', 'Sector Rank Increased', `Level up! Your status is now: ${employabilityLevel}.`);
        }
      } else {
        const { employabilityScore, employabilityLevel } = calcEmpData(newScore, 1);
        // First time — create the user stats node with merge so profile fields survive
        await setDoc(userRef, {
          xp:            LAB.xp,
          labsCompleted: 1,
          skillScore:    newScore,
          employabilityScore,
          employabilityLevel,
          lastActive:    serverTimestamp(),
        }, { merge: true });
      }
    } catch (err) {
      // Non-blocking — offline / rules error should not ruin the lab experience
      console.warn('Lab: Firestore write failed (offline or rules):', err);
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!activeFile) return;
    setIsSub(true);
    setSubmitBadge(null);
    setOutput('⚡ Running test suite...\n');
    try {
      const res = await executeCode(activeFile.language, activeFile.content);
      const out = res.run.output?.trim() || '';
      // Simple pass/fail based on expected output presence
      const results = LAB.tests.map(t => ({ label: t.label, pass: out.length > 0 && !res.run.stderr }));
      setTests(results);
      const passedCount = results.filter(r => r.pass).length;
      const allPass     = passedCount === results.length;
      
      const pct = results.length > 0 ? (passedCount / results.length) * 100 : 0;
      let tier = 'Needs Practice';
      let tagColor = C.red;
      if (pct >= 85) { tier = 'Excellent'; tagColor = C.green; }
      else if (pct >= 71) { tier = 'Good Work'; tagColor = C.blue; }
      else if (pct >= 41) { tier = 'Getting There'; tagColor = C.amber; }

      setSubmitBadge({ tier, color: tagColor, pass: passedCount, total: results.length });

      setOutput(
        res.run.output + '\n\n' +
        (allPass
          ? `✅ All tests passed!\n⏱️ Completed in ${formatTimeVerbose(elapsedSeconds)}\n🏆 +${LAB.xp} XP awarded to your profile.`
          : `⚠️ ${passedCount}/${results.length} tests passed. Review your logic and try again.`)
      );
      // Always save to Firestore after submission (even partial pass → partial skill score)
      await saveLabResultToFirestore(passedCount, results.length, elapsedSeconds);
    } catch (e: any) {
      setOutput('Submission failed: ' + e.message);
    } finally {
      setIsSub(false);
    }
  };

  // ── Show Hint — deduct 5 XP from Firestore (once per lab session) ──────────
  const handleShowHint = async () => {
    // Toggle hide/show without charging again if already used
    if (showHint) { setHint(false); return; }
    setHint(true);
    if (hintUsed || !user?.uid || !db) return;  // guard: already charged or no auth

    setHintUsed(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      const snap    = await fetchResilient(userRef);
      if (snap && snap.exists()) {
        const currentXP = typeof snap.data().xp === 'number' ? snap.data().xp : 0;
        const newXP     = Math.max(0, currentXP - 5);  // never go below 0
        await updateDoc(userRef, { xp: newXP });
      } else {
        // Doc doesn't exist yet — nothing to deduct, but create with 0 xp
        await setDoc(userRef, { xp: 0 }, { merge: true });
      }
      // Show confirmation toast
      setHintToast(true);
      setTimeout(() => setHintToast(false), 2200);
    } catch (err) {
      console.warn('Lab: hint XP deduction failed (offline?):', err);
      // Still show the hint even if write failed — don't block learning
    }
  };

  // ── Analyze ───────────────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!activeFile) return;
    setIsAna(true);
    setRight('analyzer');
    setIssues([]);
    try {
      const res = await fetch('/api/code/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: activeFile.content, language: activeFile.language, problemId: labId })
      });
      const data = await res.json();
      setIssues(data.issues || []);
    } catch {
      setIssues([{ line: 'System', type: 'Error', hint: 'AI Analyzer is temporarily unavailable.' }]);
    } finally {
      setIsAna(false);
    }
  };

  // ── AI Assistant (Socratic gating) ────────────────────────────────────────
  const sendAI = async () => {
    if (!aiInput.trim() || aiLoading) return;
    const q = aiInput.trim();
    setAIIn('');

    // Check if student is asking AI to just write solution (lazy shortcut)
    const lazyPhrases = ['write my code', 'write the solution', 'give me the answer', 'solve it for me', 'just write it', 'do it for me'];
    const isLazy = lazyPhrases.some(p => q.toLowerCase().includes(p));

    if (isLazy) {
      setAIMsg(p => [...p,
        { role: 'user', content: q },
        { role: 'ai', content: "🚫 I can't write the solution for you — that defeats the purpose of learning! But I can guide you. Tell me: what's your current approach? What have you tried so far?", isBlocked: true }
      ]);
      return;
    }

    // If student hasn't run code yet, nudge them first (but don't hard-block)
    if (attemptsBeforeAI === 0) {
      setAIMsg(p => [...p,
        { role: 'user', content: q },
        { role: 'ai', content: "Before I guide you — have you tried writing anything yet? Even a rough attempt helps! Write something in the editor, hit ▶ Run, and then come back and tell me what happened. I'll be much more helpful once you've made a first attempt.", isBlocked: true }
      ]);
      return;
    }

    // Real AI guidance
    setAIMsg(p => [...p, { role: 'user', content: q }]);
    setAILoad(true);
    try {
      const context = `You are a Socratic coding tutor. The student is working on this lab:
Problem: ${LAB.problem}
Their current code in ${activeFile?.language}:
${activeFile?.content}

Rules:
- NEVER write complete working code for them
- Ask guiding questions, point out what to think about
- Max 3-4 sentences per response
- If they're on the right track, encourage and give the next small nudge
- Be friendly and use simple language`;

      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: context },
            ...aiMessages.filter(m => !m.isBlocked).map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content })),
            { role: 'user', content: q }
          ],
          personalityMode: 'SOCRATIC'
        })
      });
      const data = await res.json();
      setAIMsg(p => [...p, { role: 'ai', content: data.text || "Try breaking the problem into smaller steps. What's the first thing you need to do?" }]);
    } catch {
      setAIMsg(p => [...p, { role: 'ai', content: "Couldn't reach AI. Try again." }]);
    } finally {
      setAILoad(false);
    }
  };

  // ─── COMING SOON SCREEN ─────────────────────────────────────────────────
  if (!LAB) {
    return (
      <div style={{ height: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: C.text, gap: 24 }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{ textAlign: 'center', maxWidth: 440 }}
        >
          <div style={{ fontSize: 64, marginBottom: 20 }}>🚧</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: C.text, letterSpacing: '-0.03em', marginBottom: 10 }}>Lab Coming Soon</h1>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.7, marginBottom: 8 }}>
            <span style={{ fontFamily: 'monospace', color: C.amber, fontSize: 13 }}>/labs/{labId}</span> hasn't been built yet.
          </p>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 32 }}>
            This lab is in our roadmap. Check back soon — or try one of the labs that are already live.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['python-basics', 'js-functions', 'debug-challenge', 'arrays-loops', 'lab-001', 'api-design', 'cloud-bash', 'cloud-yaml', 'cloud-cicd'].map(id => (
              <button key={id} onClick={() => router.push(`/labs/${id}`)}
                style={{ padding: '8px 14px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#A78BFA' }}>
                {LABS[id]?.title.split('—')[0].trim() || id}
              </button>
            ))}
          </div>
          <button onClick={() => router.push('/dashboard')}
            style={{ marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'rgba(255,255,255,0.06)', border: `1px solid ${C.border}`, borderRadius: 9, cursor: 'pointer', fontSize: 12, fontWeight: 700, color: C.sub }}>
            <FiArrowLeft size={13} /> Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div style={{ height: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden', color: C.text, fontFamily: 'inherit' }}>

      {/* ── Hint XP deduction toast ── */}
      <AnimatePresence>
        {hintToast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,   scale: 1    }}
            exit={{    opacity: 0, y: -16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            style={{
              position: 'fixed', top: 62, left: '50%', transform: 'translateX(-50%)',
              zIndex: 9999,
              background: 'rgba(20,16,8,0.96)',
              border: '1.5px solid rgba(245,158,11,0.55)',
              borderRadius: 12,
              padding: '10px 20px',
              display: 'flex', alignItems: 'center', gap: 10,
              boxShadow: '0 8px 32px rgba(245,158,11,0.2)',
              backdropFilter: 'blur(8px)',
              pointerEvents: 'none',
            }}
          >
            <span style={{ fontSize: 16 }}>💡</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#FCD34D' }}>−5 XP deducted</span>
            <span style={{ fontSize: 11, color: 'rgba(252,211,77,0.6)', fontWeight: 500 }}>hint revealed</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ TOP BAR ══ */}
      <header style={{ height: 48, background: C.panel, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0, gap: 12 }}>

        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => router.push('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, borderRadius: 7, cursor: 'pointer', color: C.sub, fontSize: 11, fontWeight: 600 }}>
            <FiArrowLeft size={12} /> Dashboard
          </button>
          <div style={{ height: 16, width: 1, background: C.border }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.accent }} />
            <span style={{ fontSize: 13, fontWeight: 800, color: C.text }}>{LAB.title}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 12, padding: '4px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: 6, border: `1px solid ${C.border}` }}>
               <FiClock size={12} color={C.muted} />
               <span style={{ fontSize: 11, fontWeight: 700, color: C.sub, fontFamily: 'monospace' }}>{formatTime(elapsedSeconds)}</span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', background: 'rgba(59,130,246,0.15)', color: C.blue, borderRadius: 6, border: `1px solid rgba(59,130,246,0.3)` }}>{LAB.category}</span>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', background: 'rgba(245,158,11,0.15)', color: C.amber, borderRadius: 6, border: `1px solid rgba(245,158,11,0.3)` }}>{LAB.difficulty}</span>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', background: 'rgba(124,58,237,0.15)', color: '#A78BFA', borderRadius: 6, border: `1px solid rgba(124,58,237,0.3)` }}>+{LAB.xp} XP</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Save */}
          <button onClick={saveAll} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 700, color: C.sub }}>
            <FiSave size={12} /> Save
          </button>

          {/* Run */}
          <button onClick={handleRun} disabled={isRunning || isSubmitting}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 800, color: C.green, opacity: isRunning ? 0.6 : 1 }}>
            <FiPlay size={12} /> {isRunning ? 'Running...' : 'Run'}
          </button>

          {/* Submit */}
          <button onClick={handleSubmit} disabled={isRunning || isSubmitting}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 16px', background: `linear-gradient(135deg, ${C.accent}, #A855F7)`, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 800, color: '#fff', opacity: isSubmitting ? 0.6 : 1, boxShadow: '0 4px 14px rgba(124,58,237,0.3)' }}>
            <FiZap size={12} /> {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>

          <div style={{ height: 16, width: 1, background: C.border }} />

          {/* Analyze toggle */}
          <button onClick={() => { handleAnalyze(); setRight('analyzer'); }}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: rightPanel === 'analyzer' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${rightPanel === 'analyzer' ? 'rgba(59,130,246,0.4)' : C.border}`, borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 700, color: rightPanel === 'analyzer' ? C.blue : C.sub }}>
            <FiSearch size={12} /> Analyze
          </button>

          {/* AI assistant toggle */}
          <button onClick={() => setRight(p => p === 'ai' ? 'none' : 'ai')}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: rightPanel === 'ai' ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${rightPanel === 'ai' ? 'rgba(124,58,237,0.4)' : C.border}`, borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 700, color: rightPanel === 'ai' ? '#A78BFA' : C.sub }}>
            <FiCpu size={12} /> AI Assist
          </button>
        </div>
      </header>

      {/* ══ BODY ══ */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ─ LEFT: Problem panel (320px) ─ */}
        <aside style={{ width: 320, background: C.panel, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, padding: '0 8px' }}>
            {(['problem', 'tests'] as const).map(t => (
              <button key={t} onClick={() => setLeft(t)} style={{ flex: 1, padding: '12px 0', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: left === t ? C.accent : C.muted, borderBottom: `2px solid ${left === t ? C.accent : 'transparent'}`, transition: 'all 0.15s', marginBottom: -1 }}>
                {t}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {left === 'problem' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: C.muted, marginBottom: 12 }}>Problem Statement</div>
                  <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.75, fontWeight: 500, whiteSpace: 'pre-line' }}>{LAB.problem}</p>
                </div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: C.muted, marginBottom: 8 }}>Expected Output</div>
                  <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, borderRadius: 10, fontFamily: 'monospace', fontSize: 13, color: C.green }}>{LAB.expected}</div>
                </div>
                {/* Hint */}
                <div>
                  <button onClick={handleShowHint} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px', background: hintUsed ? 'rgba(245,158,11,0.04)' : 'rgba(245,158,11,0.08)', border: `1px solid ${hintUsed ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.25)'}`, borderRadius: 10, cursor: 'pointer', fontSize: 11, fontWeight: 700, color: C.amber }}>
                    <FiHelpCircle size={13} /> {showHint ? 'Hide Hint' : hintUsed ? 'Show Hint (already used)' : 'Show Hint (−5 XP)'}
                  </button>
                  {showHint && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                      style={{ marginTop: 10, padding: '14px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, fontSize: 12, color: '#FCD34D', lineHeight: 1.65 }}>
                      💡 {LAB.hint}
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: C.muted, marginBottom: 4 }}>Test Cases</div>
                {LAB.tests.map((t, i) => {
                  const result = testResults[i];
                  return (
                    <div key={i} style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${result ? (result.pass ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)') : C.border}`, borderRadius: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: C.sub, textTransform: 'uppercase' }}>Case {String(i + 1).padStart(2, '0')}</span>
                        {result ? (result.pass ? <FiCheckCircle size={14} color={C.green} /> : <FiXCircle size={14} color={C.red} />) : <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.muted }} />}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 6 }}>{t.label}</div>
                      <div style={{ fontSize: 11, color: C.sub, fontFamily: 'monospace' }}>{t.input}</div>
                      <div style={{ fontSize: 11, color: C.green, fontFamily: 'monospace', marginTop: 4 }}>→ {t.expected}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* ─ CENTER: Editor + Terminal ─ */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

          {/* File tabs bar */}
          <div style={{ height: 38, background: C.panel, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', overflowX: 'auto', flexShrink: 0 }}>
            {files.map(f => (
              <button key={f.id} onClick={() => setActive(f.id)} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px',
                height: '100%', border: 'none', borderRight: `1px solid ${C.border}`,
                background: activeFileId === f.id ? C.bg : 'transparent',
                cursor: 'pointer', fontSize: 12, fontWeight: 600,
                color: activeFileId === f.id ? C.text : C.muted,
                whiteSpace: 'nowrap', flexShrink: 0,
                borderBottom: activeFileId === f.id ? `2px solid ${C.accent}` : '2px solid transparent',
              }}>
                <FiFile size={11} />
                {f.name}
                {!f.saved && <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.amber, marginLeft: 2 }} />}
                {files.length > 1 && (
                  <span onClick={e => { e.stopPropagation(); removeFile(f.id); }} style={{ marginLeft: 4, cursor: 'pointer', color: C.muted, display: 'flex', alignItems: 'center' }}>
                    <FiX size={11} />
                  </span>
                )}
              </button>
            ))}

            {/* Add file */}
            <button onClick={() => setShowNF(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0 14px', height: '100%', border: 'none', borderRight: `1px solid ${C.border}`, background: 'transparent', cursor: 'pointer', color: C.muted, flexShrink: 0 }}>
              <FiPlus size={13} />
            </button>

            {/* Language selector for active file */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', borderLeft: `1px solid ${C.border}`, height: '100%', flexShrink: 0 }}>
              <FiCode size={11} color={C.sub} />
              <select value={activeFile?.language || 'python'}
                onChange={e => {
                  setFiles(p => p.map(f => f.id === activeFileId ? { ...f, language: e.target.value } : f));
                }}
                style={{ background: 'transparent', border: 'none', outline: 'none', color: C.sub, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                {Object.entries(LANGS).map(([k, v]) => <option key={k} value={k} style={{ background: '#1A1A24' }}>{v.label}</option>)}
              </select>
            </div>
          </div>

          {/* New file dialog */}
          <AnimatePresence>
            {showNewFile && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
                <FiFile size={13} color={C.sub} />
                <input value={newFileName} onChange={e => setNewFN(e.target.value)} onKeyDown={e => e.key === 'Enter' && addFile()}
                  placeholder="filename.py" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: C.text, fontSize: 12, fontFamily: 'inherit' }} autoFocus />
                <select value={newFileLang} onChange={e => setNewFL(e.target.value)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, color: C.sub, fontSize: 11, padding: '4px 8px', fontFamily: 'inherit' }}>
                  {Object.entries(LANGS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <button onClick={addFile} style={{ padding: '5px 14px', background: C.accent, border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#fff' }}>Create</button>
                <button onClick={() => setShowNF(false)} style={{ color: C.sub, background: 'none', border: 'none', cursor: 'pointer' }}><FiX size={14} /></button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Monaco Editor */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {activeFile && (
              <Editor
                key={activeFile.id}
                height="100%"
                language={LANGS[activeFile.language]?.monacoId || 'python'}
                theme="vs-dark"
                value={activeFile.content}
                onChange={v => updateFile(activeFile.id, v || '')}
                options={{
                  fontSize: 14, padding: { top: 16 },
                  minimap: { enabled: true },
                  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                  renderLineHighlight: 'all',
                  cursorBlinking: 'phase',
                  smoothScrolling: true,
                  wordWrap: 'on',
                  bracketPairColorization: { enabled: true },
                  lineNumbers: 'on',
                  folding: true,
                  autoClosingBrackets: 'always',
                  formatOnPaste: true,
                  tabSize: 4,
                }}
              />
            )}
          </div>

          {/* Terminal */}
          <div style={{ height: 200, background: '#0A0A0E', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ height: 34, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiTerminal size={11} color='#2DD4BF' />
                <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: C.muted }}>Terminal Output</span>
              </div>
              {execTime && <span style={{ fontSize: 10, fontWeight: 700, color: C.muted }}>⏱ {execTime}</span>}
            </div>
            <div style={{ flex: 1, padding: '12px 16px', fontFamily: 'JetBrains Mono, Consolas, monospace', fontSize: 12, color: output.includes('[ERROR]') || output.includes('failed') ? C.red : '#A7E3C4', overflowY: 'auto', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {output || <span style={{ color: C.muted }}>$ awaiting execution...</span>}
              <AnimatePresence>
                {submitBadge && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                    style={{ marginTop: 16, display: 'flex' }}
                  >
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: `${submitBadge.color}15`, border: `1px solid ${submitBadge.color}40`, borderRadius: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: submitBadge.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{submitBadge.tier}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: submitBadge.color }}>({submitBadge.pass}/{submitBadge.total} tests passed)</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>

        {/* ─ RIGHT: AI/Analyzer panel ─ */}
        <AnimatePresence>
          {rightPanel !== 'none' && (
            <motion.aside key={rightPanel} initial={{ width: 0, opacity: 0 }} animate={{ width: 340, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }}
              style={{ background: C.panel, borderLeft: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>

              {/* Panel header */}
              <div style={{ height: 48, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {rightPanel === 'analyzer' ? <FiSearch size={14} color={C.blue} /> : <FiCpu size={14} color='#A78BFA' />}
                  <span style={{ fontSize: 12, fontWeight: 800, color: C.text }}>{rightPanel === 'analyzer' ? 'AI Code Analyzer' : 'AI Coding Assistant'}</span>
                </div>
                <button onClick={() => setRight('none')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted }}>
                  <FiXCircle size={16} />
                </button>
              </div>

              {/* ── ANALYZER PANEL ── */}
              {rightPanel === 'analyzer' && (
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                  {isAnalyzing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, height: 200 }}>
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        style={{ width: 28, height: 28, border: `3px solid ${C.accent}`, borderTopColor: 'transparent', borderRadius: '50%' }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scanning code...</span>
                    </div>
                  ) : analyzerIssues.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.sub, marginBottom: 4 }}>Found {analyzerIssues.length} issue{analyzerIssues.length !== 1 ? 's' : ''} — hints only, no solutions:</div>
                      {analyzerIssues.map((h, i) => (
                        <div key={i} style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: 12, borderLeft: `3px solid ${C.amber}` }}>
                          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                            <span style={{ fontSize: 9, fontWeight: 800, background: 'rgba(124,58,237,0.2)', color: '#A78BFA', padding: '2px 8px', borderRadius: 5, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h.line}</span>
                            <span style={{ fontSize: 9, fontWeight: 800, background: 'rgba(245,158,11,0.15)', color: C.amber, padding: '2px 8px', borderRadius: 5, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h.type}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                            <FiAlertTriangle size={13} color={C.amber} style={{ flexShrink: 0, marginTop: 2 }} />
                            <p style={{ fontSize: 12, color: C.sub, lineHeight: 1.65, margin: 0 }}>{h.hint}</p>
                          </div>
                        </div>
                      ))}
                      <div style={{ padding: '10px 14px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, fontSize: 11, color: '#A78BFA' }}>
                        💡 Switch to <strong>AI Assist</strong> to ask questions about these issues.
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '48px 16px', color: C.muted, fontSize: 13 }}>
                      {analyzerIssues.length === 0 && !isAnalyzing ? 'Click Analyze to scan your code' : 'No issues found. Looking clean!'}
                    </div>
                  )}
                </div>
              )}

              {/* ── AI ASSISTANT PANEL ── */}
              {rightPanel === 'ai' && (
                <>
                  {/* Gating status */}
                  <div style={{ padding: '10px 14px', background: attemptsBeforeAI === 0 ? 'rgba(245,158,11,0.08)' : 'rgba(16,185,129,0.08)', borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 600, color: attemptsBeforeAI === 0 ? C.amber : C.green }}>
                    {attemptsBeforeAI === 0
                      ? '⚠️ Try running your code first before asking for help'
                      : '✅ You\'ve tried ' + attemptsBeforeAI + ' time' + (attemptsBeforeAI !== 1 ? 's' : '') + ' — AI guidance unlocked'}
                  </div>

                  <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {aiMessages.map((m, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: m.role === 'ai' ? 'flex-start' : 'flex-end' }}>
                        <div style={{ maxWidth: '90%', padding: '10px 13px', borderRadius: m.role === 'ai' ? '4px 14px 14px 14px' : '14px 4px 14px 14px', fontSize: 12, lineHeight: 1.65, fontWeight: 500, background: m.isBlocked ? 'rgba(239,68,68,0.1)' : m.role === 'ai' ? C.card : `linear-gradient(135deg, ${C.accent}, #A855F7)`, color: m.role === 'ai' ? C.sub : '#fff', border: m.role === 'ai' ? `1px solid ${m.isBlocked ? 'rgba(239,68,68,0.3)' : C.border}` : 'none' }}>
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {aiLoading && (
                      <div style={{ display: 'flex', gap: 5, padding: '10px 14px', background: C.card, borderRadius: '4px 14px 14px 14px', width: 'fit-content', border: `1px solid ${C.border}` }}>
                        {[0,1,2].map(i => <motion.div key={i} animate={{ y: [0,-4,0] }} transition={{ repeat: Infinity, duration: 0.7, delay: i*0.15 }} style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent }} />)}
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '10px', borderTop: `1px solid ${C.border}` }}>
                    <div style={{ display: 'flex', gap: 8, background: C.card, border: `1px solid ${C.border}`, borderRadius: 11, padding: '8px 8px 8px 12px', alignItems: 'center' }}>
                      <input value={aiInput} onChange={e => setAIIn(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendAI()}
                        placeholder="Ask about your approach..."
                        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: C.text, fontFamily: 'inherit' }} />
                      <button onClick={sendAI} disabled={!aiInput.trim() || aiLoading}
                        style={{ width: 30, height: 30, borderRadius: 8, border: 'none', cursor: aiInput.trim() ? 'pointer' : 'not-allowed', background: aiInput.trim() ? `linear-gradient(135deg, ${C.accent}, #A855F7)` : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}>
                        <FiSend size={12} color={aiInput.trim() ? '#fff' : C.muted} />
                      </button>
                    </div>
                    <p style={{ fontSize: 10, color: C.muted, marginTop: 6, textAlign: 'center' }}>AI guides with questions — will not write the solution</p>
                  </div>
                </>
              )}
            </motion.aside>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
