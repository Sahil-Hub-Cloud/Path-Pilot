'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiClock, FiCheckCircle, FiSend, FiChevronLeft, FiChevronRight, FiRefreshCw, FiGitMerge } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function SubjectMaterialPage() {
  const router = useRouter();
  const params = useParams();
  const subjectId = params.subjectId as string;
  const { user } = useAuth();
  const { isReady } = useAuthGuard();

  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'flashcards' | 'flowcharts' | 'formulas' | 'quiz' | 'doubt'>('flashcards');

  // ISSUE 3 FIX: Load subject from isolated colleges/{collegeId}/materials path
  useEffect(() => {
    if (!isReady || !user) return;
    const fetchSubject = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) return;
        const collegeId = userDoc.data()?.collegeId;
        if (!collegeId) {
          router.push('/dashboard');
          return;
        }

        // Fetch from the isolated subcollection — students can ONLY read their own college's data
        const subDoc = await getDoc(doc(db, 'colleges', collegeId, 'materials', subjectId));
        if (subDoc.exists()) {
          setSubject(subDoc.data());
        } else {
          router.push('/materials');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubject();
  }, [isReady, user, subjectId, router]);

  if (!isReady || loading) {
    return <div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center font-bold text-gray-600 dark:text-gray-400">Loading…</div>;
  }
  if (!subject) return null;

  const tabs = [
    { id: 'flashcards', label: '📚 Flashcards' },
    { id: 'flowcharts', label: '🔀 Flowcharts' },
    { id: 'formulas', label: '📐 Formulas' },
    { id: 'quiz', label: '📝 Auto Quiz' },
    { id: 'doubt', label: '🤖 Doubt Bot' },
  ];

  return (
    <div className="min-h-screen bg-[#FDF6EC]">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b-2 border-[#B48C5A]/20 dark:border-gray-700 py-6 px-8 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => router.push('/materials')} className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 font-bold hover:text-gray-900 dark:text-gray-100 transition-colors">
            <FiArrowLeft /> Back to Materials
          </button>
          <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-2">{subject.subjectName}</h1>
          <div className="flex items-center gap-4 text-sm font-bold text-gray-600 dark:text-gray-400">
            <span className="bg-[#F5E8D4] px-3 py-1.5 rounded-lg">Semester {subject.semester}</span>
            <span className="bg-[#F5E8D4] px-3 py-1.5 rounded-lg">{subject.branch}</span>
            <span className="bg-[#F5E8D4] px-3 py-1.5 rounded-lg">{subject.totalTopics} Topics Generated</span>
          </div>

          <div className="flex gap-3 mt-8 overflow-x-auto pb-2">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id as any)}
                className={`px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                  activeTab === t.id
                  ? 'bg-gradient-to-r from-[#006B7A] to-[#2E7D52] text-white shadow-lg shadow-[#006B7A]/20'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-2 border-[#B48C5A]/20 dark:border-gray-700 hover:border-[#B48C5A]/40 hover:bg-[#FDF6EC]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'flashcards' && <FlashcardsView key="flashcards" subject={subject} />}
          {activeTab === 'flowcharts' && <FlowchartsView key="flowcharts" subject={subject} />}
          {activeTab === 'formulas' && <FormulasView key="formulas" subject={subject} />}
          {activeTab === 'quiz' && <QuizView key="quiz" subject={subject} user={user} subjectId={subjectId} />}
          {activeTab === 'doubt' && <DoubtBotView key="doubt" subject={subject} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ─── VIEWS ───────────────────────────────────────────────────────────────────

function FlashcardsView({ subject }: { subject: any }) {
  const cards = useMemo(() => {
    return subject.topics?.flatMap((t: any) => t.flashcards || []) || [];
  }, [subject]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!cards.length) return <div className="text-center p-12 text-gray-600 dark:text-gray-400 font-bold">No flashcards found for this subject.</div>;

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex(prev => Math.min(cards.length - 1, prev + 1)), 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex(prev => Math.max(0, prev - 1)), 150);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-gray-900 dark:text-gray-100">Smart Flashcards</h2>
          <span className="font-bold text-gray-600 dark:text-gray-400 bg-[#F5E8D4] px-4 py-1.5 rounded-full text-sm">
            {currentIndex + 1} of {cards.length}
          </span>
        </div>

        <div className="relative w-full h-80 perspective-1000 mb-8 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
          <motion.div
            className="w-full h-full relative preserve-3d"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front */}
            <div className="absolute inset-0 w-full h-full bg-white dark:bg-gray-800 border-2 border-[#B48C5A]/25 dark:border-gray-700 rounded-3xl shadow-xl p-8 flex flex-col justify-center items-center text-center backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
              <div className="text-xs font-black uppercase text-gray-600 dark:text-gray-400 tracking-widest absolute top-6">Question</div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 leading-relaxed">{cards[currentIndex]?.question}</h3>
              <div className="absolute bottom-6 text-gray-600 dark:text-gray-400/50 text-sm font-bold flex items-center gap-2"><FiRefreshCw /> Tap to flip</div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#006B7A] to-[#2E7D52] rounded-3xl shadow-xl p-8 flex flex-col justify-center items-center text-center backface-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
              <div className="text-xs font-black uppercase text-white/70 tracking-widest absolute top-6">Answer</div>
              <h3 className="text-xl font-bold text-white leading-relaxed">{cards[currentIndex]?.answer}</h3>
            </div>
          </motion.div>
        </div>

        <div className="flex justify-between gap-4">
          <button onClick={handlePrev} disabled={currentIndex === 0} className="flex-1 bg-white dark:bg-gray-800 border-2 border-[#B48C5A]/20 dark:border-gray-700 py-4 rounded-xl font-black text-gray-900 dark:text-gray-100 flex items-center justify-center gap-2 disabled:opacity-50 transition-transform active:scale-95">
            <FiChevronLeft /> Previous
          </button>
          <button onClick={handleNext} disabled={currentIndex === cards.length - 1} className="flex-1 bg-[#2C1A0E] text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 disabled:opacity-50 transition-transform active:scale-95 shadow-lg shadow-[#2C1A0E]/30">
            Next <FiChevronRight />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── ISSUE 5: Flowchart renderer — pure CSS, no external library ──────────────
function FlowchartsView({ subject }: { subject: any }) {
  const flowcharts: any[] = subject.flowcharts || [];

  if (!flowcharts.length) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        className="bg-white dark:bg-gray-800 border-2 border-[#B48C5A]/20 dark:border-gray-700 rounded-3xl p-12 text-center">
        <div className="text-4xl mb-4">🔀</div>
        <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-2">No Flowcharts Generated</h3>
        <p className="text-gray-600 dark:text-gray-400 font-semibold">
          This subject's PDF did not contain identifiable processes or algorithms. Flowcharts are auto-generated when procedures are detected.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="flex flex-col gap-10">
      {flowcharts.map((fc: any, idx: number) => (
        <FlowchartDiagram key={idx} flowchart={fc} index={idx} />
      ))}
    </motion.div>
  );
}

function FlowchartDiagram({ flowchart, index }: { flowchart: any; index: number }) {
  const steps: any[] = flowchart.steps || [];

  // Build an ordered list of steps for vertical display
  const getStepStyle = (type: string) => {
    switch (type) {
      case 'start':
        return { background: 'linear-gradient(135deg, #006B7A, #2E7D52)', color: '#fff', borderRadius: 40, border: 'none' };
      case 'end':
        return { background: 'linear-gradient(135deg, #D95F2B, #B04A1E)', color: '#fff', borderRadius: 40, border: 'none' };
      case 'decision':
        return { background: '#FFF8EE', color: '#2C1A0E', borderRadius: 8, border: '2px solid #F59E0B', transform: 'rotate(0deg)' };
      default: // process
        return { background: '#FFFFFF', color: '#2C1A0E', borderRadius: 12, border: '2px solid rgba(180,140,90,0.3)' };
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'start': return '▶';
      case 'end': return '⏹';
      case 'decision': return '◆';
      default: return '⬜';
    }
  };

  // Traverse in order starting from start node
  const orderedSteps: any[] = [];
  const stepMap: Record<string, any> = {};
  steps.forEach(s => { stepMap[s.id] = s; });

  const startStep = steps.find(s => s.type === 'start');
  const visited = new Set<string>();
  let current = startStep;

  while (current && !visited.has(current.id)) {
    visited.add(current.id);
    orderedSteps.push(current);
    const nextId = current.nextStep || current.yesStep;
    current = nextId ? stepMap[nextId] : null;
  }

  // Add any unvisited steps
  steps.forEach(s => {
    if (!visited.has(s.id)) orderedSteps.push(s);
  });

  return (
    <div style={{ background: '#FFFFFF', border: '2px solid rgba(180,140,90,0.2)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 4px 20px rgba(140,90,40,0.08)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #006B7A15, #2E7D5215)', borderBottom: '2px solid rgba(180,140,90,0.15)', padding: '20px 28px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #006B7A, #2E7D52)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FiGitMerge color="white" size={18} />
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8B6E52', marginBottom: 2 }}>Flowchart {index + 1}</div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#2C1A0E' }}>{flowchart.title}</h3>
        </div>
      </div>

      {/* Flowchart Body */}
      <div style={{ padding: '32px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        {orderedSteps.map((step: any, i: number) => (
          <React.Fragment key={step.id}>
            {/* Step Node */}
            <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
              <div style={{
                ...getStepStyle(step.type),
                padding: step.type === 'decision' ? '16px 20px' : '14px 24px',
                textAlign: 'center',
                fontWeight: 700,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                position: 'relative',
              }}>
                <span style={{ fontSize: 10, opacity: 0.7 }}>{getIcon(step.type)}</span>
                <span>{step.text}</span>
              </div>

              {/* Yes/No labels for decisions */}
              {step.type === 'decision' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4 }}>
                  {step.yesStep && (
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#2E7D52', background: '#ECFDF5', padding: '2px 8px', borderRadius: 6 }}>✓ YES</span>
                  )}
                  {step.noStep && (
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#D95F2B', background: '#FEF3C7', padding: '2px 8px', borderRadius: 6 }}>✗ NO</span>
                  )}
                </div>
              )}
            </div>

            {/* Connector arrow (not after last step) */}
            {i < orderedSteps.length - 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, margin: '2px 0' }}>
                <div style={{ width: 2, height: 24, background: 'linear-gradient(to bottom, rgba(0,107,122,0.4), rgba(0,107,122,0.8))' }} />
                <div style={{ width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '10px solid rgba(0,107,122,0.8)' }} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Legend */}
      <div style={{ borderTop: '1.5px solid rgba(180,140,90,0.15)', padding: '16px 28px', background: '#FDF6EC', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {[
          { icon: '▶', label: 'Start/End', color: '#006B7A' },
          { icon: '⬜', label: 'Process', color: '#5C3D1E' },
          { icon: '◆', label: 'Decision', color: '#D97706' },
        ].map(l => (
          <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: l.color }}>
            <span>{l.icon}</span> {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function FormulasView({ subject }: { subject: any }) {
  const formulas = useMemo(() => {
    return subject.topics?.flatMap((t: any) => t.formulas || []) || [];
  }, [subject]);

  if (!formulas.length) return <div className="text-center p-12 text-gray-600 dark:text-gray-400 font-bold">No formulas extracted for this subject.</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {formulas.map((f: any, i: number) => (
        <div key={i} className="bg-white dark:bg-gray-800 border-2 border-[#B48C5A]/20 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <h3 className="font-black text-lg text-gray-900 dark:text-gray-100 mb-4">{f.formulaName}</h3>
          <div className="bg-[#FDF6EC] p-4 rounded-xl border border-[#B48C5A]/10 mb-4 font-mono text-[#006B7A] font-bold text-center text-xl overflow-x-auto">
            {f.formula}
          </div>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{f.explanation}</p>
          {f.example && (
            <div className="bg-[#F5E8D4] p-4 rounded-xl text-sm text-gray-800 dark:text-gray-300">
              <span className="font-black block mb-1">Example:</span> {f.example}
            </div>
          )}
        </div>
      ))}
    </motion.div>
  );
}

function QuizView({ subject, user, subjectId }: { subject: any; user: any; subjectId: string }) {
  const allQs = useMemo(() => subject.topics?.flatMap((t: any) => t.mcqQuestions || []) || [], [subject]);

  const [questions, setQuestions] = useState<any[]>([]);
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    if (started && timeLeft > 0 && !finished) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && started && !finished) {
      handleFinish();
    }
  }, [started, timeLeft, finished]);

  const startQuiz = () => {
    const shuffled = [...allQs].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
    setStarted(true);
    setTimeLeft(15 * 60);
  };

  const handleFinish = async () => {
    setFinished(true);
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });

    try {
      await setDoc(doc(db, 'users', user.uid, 'college_quizzes', subjectId), {
        subjectName: subject.subjectName,
        score: correct,
        total: questions.length,
        timestamp: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error(err);
    }
  };

  if (!allQs.length) return <div className="text-center p-12 text-gray-600 dark:text-gray-400 font-bold">No questions available.</div>;

  if (!started) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-800 border-2 border-[#B48C5A]/20 dark:border-gray-700 rounded-3xl p-10 max-w-2xl mx-auto text-center shadow-lg">
        <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-4">Subject Assessment</h2>
        <p className="text-gray-600 dark:text-gray-400 font-semibold mb-8">10 Multiple Choice Questions • 15 Minutes Timer • Auto-saved</p>
        <button onClick={startQuiz} className="bg-gradient-to-r from-[#D95F2B] to-[#B04A1E] text-white px-8 py-4 rounded-xl font-black text-lg hover:scale-105 transition-transform shadow-lg shadow-[#D95F2B]/30">
          Start Quiz Now
        </button>
      </motion.div>
    );
  }

  if (finished) {
    let correct = 0;
    questions.forEach((q, i) => { if (answers[i] === q.correctAnswer) correct++; });
    const pct = Math.round((correct / questions.length) * 100);

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 border-2 border-[#B48C5A]/20 dark:border-gray-700 rounded-3xl p-10 max-w-2xl mx-auto text-center shadow-lg">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#10B981] to-[#047857] rounded-full flex items-center justify-center text-white mb-6 shadow-xl">
          <FiCheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-2">Quiz Completed!</h2>
        <div className="text-5xl font-black text-[#006B7A] my-6">{pct}%</div>
        <p className="text-gray-600 dark:text-gray-400 font-bold mb-8">You got {correct} out of {questions.length} correct.</p>
        <button onClick={() => { setStarted(false); setFinished(false); setAnswers({}); }} className="bg-[#2C1A0E] text-white px-8 py-4 rounded-xl font-black hover:bg-black transition-colors">
          Retake Quiz
        </button>
      </motion.div>
    );
  }

  const q = questions[currentQ];
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 p-4 rounded-2xl border-2 border-[#B48C5A]/20 dark:border-gray-700 shadow-sm">
        <div className="font-black text-gray-900 dark:text-gray-100">Question {currentQ + 1} of {questions.length}</div>
        <div className="font-bold text-[#D95F2B] flex items-center gap-2 bg-[#FDF6EC] px-4 py-2 rounded-lg">
          <FiClock /> {mins}:{secs.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border-2 border-[#B48C5A]/20 dark:border-gray-700 rounded-3xl p-8 shadow-md mb-8">
        <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-8 leading-relaxed">{q.question}</h3>
        <div className="flex flex-col gap-4">
          {q.options.map((opt: string, i: number) => (
            <button
              key={i} onClick={() => setAnswers(prev => ({ ...prev, [currentQ]: opt }))}
              className={`p-4 rounded-xl border-2 text-left font-bold transition-all ${
                answers[currentQ] === opt
                ? 'border-[#006B7A] bg-[#E0F2F1] text-[#006B7A]'
                : 'border-[#B48C5A]/20 dark:border-gray-700 bg-[#FDF6EC] text-gray-800 dark:text-gray-300 hover:border-[#B48C5A]/50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))} disabled={currentQ === 0} className="bg-white dark:bg-gray-800 border-2 border-[#B48C5A]/20 dark:border-gray-700 px-8 py-4 rounded-xl font-black text-gray-900 dark:text-gray-100 disabled:opacity-50">Previous</button>
        {currentQ === questions.length - 1 ? (
          <button onClick={handleFinish} className="bg-gradient-to-r from-[#D95F2B] to-[#B04A1E] text-white px-8 py-4 rounded-xl font-black shadow-lg shadow-[#D95F2B]/30">Submit Quiz</button>
        ) : (
          <button onClick={() => setCurrentQ(prev => Math.min(questions.length - 1, prev + 1))} className="bg-[#2C1A0E] text-white px-8 py-4 rounded-xl font-black shadow-lg">Next Question</button>
        )}
      </div>
    </motion.div>
  );
}

function DoubtBotView({ subject }: { subject: any }) {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: 'bot', text: `Hi! I am your AI Doubt Bot for **${subject.subjectName}**. I have analyzed the syllabus and materials. What would you like to ask?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(p => [...p, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const prompt = `You are a helpful AI Doubt Tutor for an engineering subject named "${subject.subjectName}". 
      You MUST ONLY answer using the context provided below. If the student asks something outside of this context, politely tell them that you can only answer questions related to the uploaded PDF.
      Explain things simply for a college student.
      
      CONTEXT (Syllabus/PDF Text):
      ${subject.rawText?.substring(0, 15000) || JSON.stringify(subject.topics)}
      
      STUDENT QUESTION:
      ${userMsg}`;

      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      setMessages(p => [...p, { role: 'bot', text: data.text || "I'm having trouble analyzing the text right now." }]);
    } catch (err) {
      setMessages(p => [...p, { role: 'bot', text: 'Sorry, network error.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto bg-white dark:bg-gray-800 border-2 border-[#B48C5A]/20 dark:border-gray-700 rounded-3xl overflow-hidden shadow-lg flex flex-col h-[600px]">
      <div className="bg-gradient-to-r from-[#006B7A] to-[#2E7D52] p-5 flex items-center gap-4 text-white">
        <div className="w-10 h-10 bg-white dark:bg-gray-800/20 rounded-full flex items-center justify-center text-xl shadow-inner backdrop-blur-md">🤖</div>
        <div>
          <h3 className="font-black text-lg m-0 leading-tight">Doubt Bot</h3>
          <p className="text-white/80 font-semibold text-xs m-0">Trained on {subject.subjectName} materials</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-[#FDF6EC]" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] p-4 rounded-2xl text-sm font-semibold leading-relaxed shadow-sm ${
              m.role === 'user'
              ? 'bg-[#2C1A0E] text-white rounded-tr-sm'
              : 'bg-white dark:bg-gray-800 border-2 border-[#B48C5A]/20 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border-2 border-[#B48C5A]/20 dark:border-gray-700 text-gray-900 dark:text-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex gap-2 items-center">
              <div className="w-2 h-2 bg-[#8B6E52] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-[#8B6E52] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-[#8B6E52] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 border-t-2 border-[#B48C5A]/10 flex gap-4 items-center">
        <input
          type="text" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question about this subject..."
          className="flex-1 bg-[#FDF6EC] border-2 border-[#B48C5A]/20 dark:border-gray-700 rounded-xl px-4 py-3 outline-none font-semibold text-gray-900 dark:text-gray-100 focus:border-[#006B7A] transition-colors"
        />
        <button onClick={handleSend} disabled={isTyping || !input.trim()} className="bg-[#006B7A] text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-[#00525E] transition-colors disabled:opacity-50">
          <FiSend />
        </button>
      </div>
    </motion.div>
  );
}
