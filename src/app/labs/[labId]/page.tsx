'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
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
import { doc, getDoc, updateDoc, increment, collection, addDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { calculateTopicPriority } from '@/lib/services/recommendation';
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
  const STATIC_LAB = LABS[labId] ?? null;                          // null = unrecognised
  const searchParams = useSearchParams();
  const isChallenge = searchParams?.get('challenge') === 'true';
  const courseIdParam = searchParams?.get('courseId');
  const topicIdParam = searchParams?.get('topicId');
  const [dynamicLab, setDynamicLab] = useState<any>(null);
  const [isLoadingChallenge, setIsLoadingChallenge] = useState(isChallenge);
  
  const LAB = dynamicLab || STATIC_LAB;
  // Key by userId+labId — isolates each user's code on the same machine
  const labStorageKey = `pp_lab_code_${user?.uid || 'guest'}_${labId}`;

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
  const [runCount, setRunCount]     = useState(0);
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

  // Mobile state
  const [activeMobileTab, setActiveMobileTab] = useState<'problem' | 'code'>('problem');
  const [isMobile, setIsMobile] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [showOnlineToast, setShowOnlineToast] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Online/Offline detection
    const handleOnline = () => {
      setIsOffline(false);
      setShowOnlineToast(true);
      setTimeout(() => setShowOnlineToast(false), 3000);
    };
    const handleOffline = () => {
      setIsOffline(true);
    };

    setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isChallenge || !courseIdParam || !topicIdParam) return;

    const loadChallenge = async () => {
      setIsLoadingChallenge(true);
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (user) {
          const token = await user.getIdToken();
          headers.Authorization = `Bearer ${token}`;
        }
        const res = await fetch('/api/challenge', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            courseId: courseIdParam,
            topicId: topicIdParam,
            courseName: courseIdParam,
          }),
        });
        const data = await res.json();
        const c = data.challenge;
        if (!res.ok || !c) throw new Error(data.error || 'Challenge load failed');

        const lang =
          courseIdParam.includes('python') ||
          courseIdParam.includes('ml') ||
          courseIdParam.includes('data') ||
          courseIdParam.includes('django')
            ? 'python'
            : courseIdParam.includes('web3') ||
                courseIdParam.includes('blockchain') ||
                courseIdParam.includes('javascript') ||
                courseIdParam.includes('react') ||
                courseIdParam.includes('node') ||
                courseIdParam.includes('vue') ||
                courseIdParam.includes('mern') ||
                courseIdParam.includes('flutter')
              ? 'javascript'
              : 'python';

        setDynamicLab({
          id: `challenge-${courseIdParam}-${topicIdParam}`,
          title: c.title || 'Topic Challenge',
          xp: c.difficulty === 'Hard' ? 30 : c.difficulty === 'Medium' ? 20 : 10,
          problem: c.description || 'Solve the problem.',
          expected: c.testCases?.[0]?.expectedOutput || c.examples?.[0]?.output || 'Output as expected',
          hint: c.hints?.[0] || 'Think carefully about the requirements.',
          tests: (c.testCases || []).map((t: { input: string; expectedOutput: string }, i: number) => ({
            label: `Test ${i + 1}: ${t.input}`,
            input: t.input,
            expected: t.expectedOutput,
          })),
          defaultLang: lang,
        });
        if (c.starterCode) {
          setFiles([{ ...newFile(lang, lang === 'python' ? 'solution.py' : 'solution.js'), content: c.starterCode }]);
        }
      } catch (err) {
        console.error('Failed to load dynamic challenge', err);
      } finally {
        setIsLoadingChallenge(false);
      }
    };

    loadChallenge();
  }, [isChallenge, courseIdParam, topicIdParam, user]);

  // 30s Auto-save
  useEffect(() => {
    const saver = setInterval(() => {
      if (files.length > 0) {
        localStorage.setItem(labStorageKey, JSON.stringify(files));
      }
    }, 30000);
    return () => clearInterval(saver);
  }, [files, labStorageKey]);

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
    setRunCount(0);
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
    setRunCount(p => p + 1);
    setIsRunning(true);
    setSubmitBadge(null);
    setExecTime(null);
    setOutput('▶ Running ' + activeFile.name + '...\n');
    const t0 = performance.now();
    try {
      const res = await executeCode(activeFile.language, activeFile.content);
      const duration = ((performance.now() - t0) / 1000).toFixed(2);
      setExecTime(duration + 's');
      
      if (res.run.code !== 0) {
        setOutput(`[ERROR] Execution failed with status: ${res.run.signal}\n\n${res.run.output}`);
      } else {
        const out = res.run.output || '(no output)';
        setOutput(out + `\n\n[SUCCESS] Executed in ${duration}s`);
      }
      setStat(p => p + 1);
    } catch (e: any) {
      setOutput(`[ERROR] Execution timeout. Try again or simplify your code.\n\n${e.message}`);
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

        // Trigger adaptive recommendation logic
        await calculateTopicPriority(user.uid);

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

  const showError = (msg: string) => {
    setOutput(`[ERROR] Submission Failed\n\n${msg}`);
    setIsSub(false);
  };

  const handleSubmit = async () => {
    if (!activeFile) return;
    
    if (activeFile.content.trim().length < 10) {
      return showError("Code must be at least 10 characters long.");
    }
    const cfg = LANGS[activeFile.language];
    if (cfg && activeFile.content.trim() === cfg.starter.trim()) {
      return showError("Code is unchanged from starter code. Please write your solution before submitting.");
    }
    if (runCount === 0) {
      return showError("You must run your code at least once to verify it works before submitting.");
    }

    setIsSub(true);
    setSubmitBadge(null);
    setExecTime(null);
    setOutput('⚡ Running test suite...\n');
    const t0 = performance.now();
    try {
      const res = await executeCode(activeFile.language, activeFile.content);
      const duration = ((performance.now() - t0) / 1000).toFixed(2);
      setExecTime(duration + 's');
      
      if (res.run.code !== 0) {
        setOutput(`[ERROR] Tests failed to run.\nStatus: ${res.run.signal}\n\n${res.run.output}`);
        setIsSub(false);
        return;
      }

      const out = res.run.output?.trim() || '';
      // Compare normalized outputs for pass/fail
      const normalizedOut = out.replace(/\s+/g, '').toLowerCase();
      const results = LAB.tests.map((t: any) => {
        const normalizedExpected = t.expected.replace(/\s+/g, '').toLowerCase();
        const pass = normalizedOut.includes(normalizedExpected) && !res.run.stderr;
        return { label: t.label, pass };
      });
      
      console.log('--- Test Results ---');
      results.forEach((r: any) => console.log(`${r.pass ? '✅ PASS' : '❌ FAIL'}: ${r.label}`));
      
      setTests(results);
      const passedCount = results.filter((r: any) => r.pass).length;
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
          ? `✅ All tests passed!\n⏱️ Completed in ${formatTimeVerbose(elapsedSeconds)}\n🚀 Executed in ${duration}s\n🏆 +${LAB.xp} XP awarded to your profile.`
          : `⚠️ ${passedCount}/${results.length} tests passed. Executed in ${duration}s. Review your logic and try again.`)
      );
      // Always save to Firestore after submission (even partial pass → partial skill score)
      await saveLabResultToFirestore(passedCount, results.length, elapsedSeconds);
    } catch (e: any) {
      setOutput('[ERROR] Submission Failed\n' + e.message);
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

  // ─── COMING SOON / LOADING SCREEN ─────────────────────────────────────────────────
  if (isLoadingChallenge) {
    return (
      <div style={{ height: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: C.text }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C3AED] mx-auto mb-4"></div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text }}>Loading Challenge...</h1>
        </motion.div>
      </div>
    );
  }

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

      {/* ── Online Toast ── */}
      <AnimatePresence>
        {showOnlineToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
              zIndex: 9999, background: '#10B981', color: '#fff',
              padding: '12px 24px', borderRadius: '12px', fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)'
            }}
          >
            <FiCheckCircle size={18} />
            <span>Back online! You can now run your code.</span>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ── Offline Banner ── */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-center gap-3 overflow-hidden"
          >
            <FiAlertTriangle className="text-amber-500" size={14} />
            <span className="text-[10px] md:text-xs font-bold text-amber-200 tracking-wide">
              You are offline. Your code is being saved locally. Connect to internet to run and submit.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ HEADER ══ */}
      <header className="h-14 bg-[#13131A] border-b border-white/10 flex items-center justify-between px-3 md:px-6 flex-shrink-0 z-50">
        <div className="flex items-center gap-2 md:gap-5 overflow-hidden flex-1">
          <button onClick={() => router.push('/labs')} className="flex items-center justify-center w-8 h-8 md:w-auto md:h-auto md:px-3 md:py-1.5 bg-white dark:bg-gray-800/5 border border-white/10 dark:border-gray-700 rounded-lg cursor-pointer text-[#888899] dark:text-gray-300 hover:bg-white dark:bg-gray-800/10 transition-all flex-shrink-0">
            <FiArrowLeft size={14} />
          </button>
          
          <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
            <h1 className="text-[11px] md:text-sm font-black text-[#E2E2EE] truncate tracking-tight uppercase max-w-[100px] md:max-w-none">{LAB.title.split('—')[0]}</h1>
            <div className="flex items-center gap-2 text-[10px] font-extrabold tracking-widest">
              <span className="text-[#10B981] whitespace-nowrap">{LAB.xp} XP</span>
              <span className="text-[#444455]">|</span>
              <span className="text-[#888899] flex items-center gap-1 whitespace-nowrap"><FiClock size={10} /> {formatTime(elapsedSeconds)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 ml-2">
          {/* Desktop actions (Run/Submit) */}
          <div className="hidden md:flex items-center gap-2">
            <button onClick={handleRun} disabled={isRunning || isSubmitting || isOffline}
              className="flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-gray-800/5 border border-white/15 dark:border-gray-700 rounded-lg cursor-pointer text-xs font-extrabold text-[#E2E2EE] dark:text-white hover:bg-white dark:bg-gray-800/10 disabled:opacity-50 shadow-lg shadow-black/20"
            >
              <FiPlay size={12} className={isRunning ? 'animate-pulse' : ''} /> <span>{isRunning ? 'Running...' : 'Run'}</span>
            </button>
            
            <button onClick={handleSubmit} disabled={isRunning || isSubmitting || isOffline}
              className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-br from-[#7C3AED] to-[#A855F7] border-none rounded-lg cursor-pointer text-xs font-extrabold text-white opacity-100 hover:opacity-90 disabled:opacity-50 shadow-lg shadow-[#7C3AED]/30"
            >
              <FiZap size={12} /> <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
            </button>
          </div>

          {/* Panel toggles */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => { handleAnalyze(); setRight('analyzer'); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer text-[11px] font-bold transition-all ${rightPanel === 'analyzer' ? 'bg-blue-500/15 border border-blue-500/40 text-blue-400' : 'bg-white dark:bg-gray-800/5 border border-white/10 dark:border-gray-700 text-[#888899] dark:text-gray-300 hover:bg-white dark:bg-gray-800/10'}`}
            >
              <FiSearch size={12} /> Analyze
            </button>

            <button onClick={() => setRight(p => p === 'ai' ? 'none' : 'ai')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer text-[11px] font-bold transition-all ${rightPanel === 'ai' ? 'bg-[#7C3AED]/15 border border-[#7C3AED]/40 text-[#A78BFA]' : 'bg-white dark:bg-gray-800/5 border border-white/10 dark:border-gray-700 text-[#888899] dark:text-gray-300 hover:bg-white dark:bg-gray-800/10'}`}
            >
              <FiCpu size={12} /> AI Assist
            </button>
          </div>
          
          {/* Mobile AI Toggle */}
          <button className="md:hidden p-2 text-[#888899] dark:text-gray-300 bg-white dark:bg-gray-800/5 border border-white/10 dark:border-gray-700 rounded-lg" onClick={() => setRight(p => p === 'ai' ? 'none' : 'ai')}>
             <FiCpu size={16} />
          </button>
        </div>
      </header>

      {/* ── MOBILE TABS ── */}
      <div className="md:hidden flex bg-[#13131A] border-b border-white/10 h-11 flex-shrink-0 z-40">
        <button 
          onClick={() => setActiveMobileTab('problem')}
          className={`flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeMobileTab === 'problem' ? 'text-[#7C3AED] border-b-2 border-[#7C3AED] bg-white dark:bg-gray-800/[0.02]' : 'text-[#555566]'}`}
        >
          <FiFile size={12} /> Problem
        </button>
        <button 
          onClick={() => setActiveMobileTab('code')}
          className={`flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeMobileTab === 'code' ? 'text-[#7C3AED] border-b-2 border-[#7C3AED] bg-white dark:bg-gray-800/[0.02]' : 'text-[#555566]'}`}
        >
          <FiCode size={12} /> Code
        </button>
      </div>

      {/* ══ BODY ══ */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

        {/* ─ LEFT: Problem panel ─ */}
        <aside className={`
          ${isMobile ? (activeMobileTab === 'problem' ? 'flex' : 'hidden') : 'flex'}
          w-full md:w-[320px] bg-[#13131A] md:border-r border-white/10 flex-col flex-shrink-0
          overflow-hidden h-full
        `}>
          <div className="flex-1 overflow-y-auto p-5 md:p-6 no-scrollbar pb-16 md:pb-6">
            <div className="flex flex-col gap-8 mb-10">
              <section>
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#444455] mb-3">01. Problem Statement</div>
                <p className="text-sm text-[#888899] leading-relaxed font-medium whitespace-pre-line">{LAB.problem}</p>
              </section>
              
              <section>
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#444455] mb-3">02. Expected Output</div>
                <div className="p-4 bg-white dark:bg-gray-800/[0.03] border border-white/10 rounded-xl font-mono text-xs text-[#10B981] shadow-inner">{LAB.expected}</div>
              </section>

              <section>
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#444455] mb-3">03. Support & Hints</div>
                <button onClick={handleShowHint} className={`w-full flex items-center justify-center gap-2.5 p-3.5 rounded-xl cursor-pointer text-[10px] font-bold transition-all shadow-lg
                  ${hintUsed ? 'bg-amber-500/5 border border-amber-500/20 text-amber-500/70' : 'bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500/15'}`}>
                  <FiHelpCircle size={14} /> {showHint ? 'Hide Hint' : hintUsed ? 'Show Hint' : 'Show Hint (−5 XP)'}
                </button>
                <AnimatePresence>
                  {showHint && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      className="mt-4 p-5 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-amber-200/80 leading-relaxed shadow-xl backdrop-blur-sm">
                      <span className="font-black text-amber-500 mr-2">HINT:</span> {LAB.hint}
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            </div>

            <div className="flex flex-col gap-4 pb-12">
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#444455] mb-2">04. Verification Cases</div>
              {LAB.tests.map((t: any, i: number) => {
                const result = testResults[i];
                return (
                  <div key={i} className={`p-4 bg-white dark:bg-gray-800/[0.02] border rounded-xl transition-all duration-300 ${result ? (result.pass ? 'border-green-500/30 bg-green-500/[0.03]' : 'border-red-500/30 bg-red-500/[0.03]') : 'border-white/10'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[9px] font-black text-[#555566] uppercase tracking-wider">Scenario {String(i + 1).padStart(2, '0')}</span>
                      {result ? (result.pass ? <FiCheckCircle size={14} className="text-[#10B981]" /> : <FiXCircle size={14} className="text-[#EF4444]" />) : <div className="w-1.5 h-1.5 rounded-full bg-[#444455]" />}
                    </div>
                    <div className="text-[13px] font-bold text-[#E2E2EE] mb-2">{t.label}</div>
                    <div className="bg-black/20 p-2.5 rounded-lg border border-white/5 font-mono">
                      <div className="text-[10px] text-[#888899] opacity-70 mb-1 flex justify-between"><span>Input:</span> <span className="text-[#3B82F6]">{t.input}</span></div>
                      <div className="text-[10px] text-[#10B981] flex justify-between"><span>Expect:</span> <span>{t.expected}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ─ CENTER: Editor + Terminal ─ */}
        <main className={`
          ${isMobile ? (activeMobileTab === 'code' ? 'flex' : 'hidden') : 'flex'}
          flex-1 flex-col overflow-hidden min-w-0 bg-[#0D0D0F] pb-[52px] md:pb-0
        `}>

          {/* File tabs bar */}
          <div className="h-10 bg-[#13131A] border-b border-white/10 flex items-center overflow-x-auto flex-shrink-0 no-scrollbar">
            {files.map(f => (
              <button key={f.id} onClick={() => setActive(f.id)} 
                className={`flex items-center gap-2.5 px-4 h-full border-none border-r border-white/10 cursor-pointer text-xs font-bold transition-all flex-shrink-0
                ${activeFileId === f.id ? 'bg-[#0D0D0F] text-[#E2E2EE] border-b-2 border-[#7C3AED]' : 'bg-transparent text-[#444455] hover:text-[#888899]'}`}
              >
                <FiFile size={11} className="opacity-70" />
                {f.name}
                {!f.saved && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 ml-1 shadow-sm shadow-amber-500/50" />}
                {files.length > 1 && (
                  <span onClick={e => { e.stopPropagation(); removeFile(f.id); }} className="ml-2 hover:text-[#EF4444] transition-colors"><FiX size={11} /></span>
                )}
              </button>
            ))}

            {/* Add file */}
            <button onClick={() => setShowNF(p => !p)} className="flex items-center gap-1 px-4 h-full border-none border-r border-white/10 bg-transparent cursor-pointer text-[#444455] hover:text-[#888899] transition-colors flex-shrink-0">
              <FiPlus size={14} />
            </button>

            {/* Language selector for active file - hidden on very small screens */}
            <div className="hidden sm:flex ml-auto items-center gap-2 px-4 border-l border-white/10 h-full flex-shrink-0 bg-white dark:bg-gray-800/5">
              <FiCode size={11} className="text-[#888899]" />
              <select value={activeFile?.language || 'python'}
                onChange={e => setFiles(p => p.map(f => f.id === activeFileId ? { ...f, language: e.target.value } : f))}
                className="bg-transparent border-none outline-none text-[#888899] text-[10px] font-black uppercase tracking-wider cursor-pointer"
              >
                {Object.entries(LANGS).map(([k, v]) => <option key={k} value={k} className="bg-[#1A1A24]">{v.label}</option>)}
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
          <div className={`${isMobile ? 'h-[60vh]' : 'flex-1'} relative overflow-hidden bg-[#0D0D0F]`}>
            {activeFile && (
              <Editor
                key={activeFile.id}
                height="100%"
                language={LANGS[activeFile.language]?.monacoId || 'python'}
                theme="vs-dark"
                value={activeFile.content}
                onChange={v => updateFile(activeFile.id, v || '')}
                options={{
                  fontSize: 14,
                  padding: { top: 16 },
                  minimap: { enabled: false },
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
                  scrollbar: {
                    vertical: 'hidden',
                    horizontal: 'hidden'
                  }
                }}
              />
            )}
          </div>

          {/* Terminal */}
          <div className={`${isMobile ? 'h-[30vh]' : 'h-48 md:h-64'} bg-[#0A0A0E] border-t border-white/10 flex flex-col flex-shrink-0 shadow-[0_-8px_30px_rgb(0,0,0,0.5)]`}>
            <div className="h-9 border-b border-white/10 flex items-center justify-between px-4 flex-shrink-0 bg-black/40">
              <div className="flex items-center gap-2.5">
                <FiTerminal size={11} className="text-[#2DD4BF]" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#444455]">Terminal Output</span>
              </div>
              {execTime && <span className="text-[9px] font-bold text-[#444455] bg-white dark:bg-gray-800/5 px-2 py-0.5 rounded-full">⏱ {execTime}</span>}
            </div>
            <div className={`flex-1 p-4 font-mono text-[11px] md:text-xs overflow-y-auto whitespace-pre-wrap leading-relaxed ${(output.includes('[ERROR]') || output.includes('failed')) ? 'text-[#EF4444]' : 'text-[#A7E3C4]'}`}>
              {(isRunning || isSubmitting) ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[#444455]">
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      $
                    </motion.div>
                    <span className="flex items-center gap-1">
                      Running
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1, times: [0, 0.5, 1] }}
                      >.</motion.span>
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.2, times: [0, 0.5, 1] }}
                      >.</motion.span>
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.4, times: [0, 0.5, 1] }}
                      >.</motion.span>
                    </span>
                  </div>
                  <div className="text-[#888899] text-[10px]">Processing via Judge0 cluster...</div>
                </div>
              ) : (
                output || <span className="text-[#444455]">$ awaiting execution...</span>
              )}
              <AnimatePresence>
                {submitBadge && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="mt-5 flex"
                  >
                    <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-black/40 border-2 rounded-xl backdrop-blur-md shadow-xl" style={{ borderColor: `${submitBadge.color}40` }}>
                      <span className="text-xs font-black uppercase tracking-widest" style={{ color: submitBadge.color }}>{submitBadge.tier}</span>
                      <div className="w-px h-3 bg-white dark:bg-gray-800/10" />
                      <span className="text-[10px] font-bold opacity-80" style={{ color: submitBadge.color }}>{submitBadge.pass}/{submitBadge.total} PASSED</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>

        {/* ─ MOBILE BOTTOM BAR ─ */}
        {isMobile && activeMobileTab === 'code' && (
          <div className="fixed bottom-0 left-0 right-0 h-[52px] bg-[#13131A] border-t border-white/10 flex z-[100]">
            <button 
              onClick={handleRun}
              disabled={isRunning || isSubmitting || isOffline}
              className="flex-1 flex items-center justify-center gap-2 bg-transparent text-[#E2E2EE] text-xs font-black uppercase tracking-widest disabled:opacity-50 border-r border-white/10"
            >
              <FiPlay size={14} className={isRunning ? 'animate-pulse' : ''} />
              {isRunning ? '...' : 'Run'}
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isRunning || isSubmitting || isOffline}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white text-xs font-black uppercase tracking-widest disabled:opacity-50"
            >
              <FiZap size={14} />
              {isSubmitting ? '...' : 'Submit'}
            </button>
          </div>
        )}

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
