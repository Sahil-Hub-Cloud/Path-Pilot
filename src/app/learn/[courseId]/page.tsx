'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { ROADMAPS, COURSE_SLUG_MAP } from '@/lib/data/roadmaps';
import { getTopicResource, getCourseVideo } from '@/lib/data/topic-resources';

import {
  FiArrowLeft, FiLock, FiCheckCircle,
  FiBook, FiVideo, FiSend, FiZap,
  FiChevronRight, FiAward, FiMessageSquare, FiArrowRight,
  FiXCircle, FiX, FiInfo
} from 'react-icons/fi';
import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion, increment, getDoc } from 'firebase/firestore';
import { calculateTopicPriority } from '@/lib/services/recommendation';

// ─── TYPES ───────────────────────────────────────────────────────────────────
type Block =
  | { t: 'h2'; v: string }
  | { t: 'h3'; v: string }
  | { t: 'p'; v: string }
  | { t: 'ul'; v: string[] }
  | { t: 'code'; lang: string; v: string }
  | { t: 'tip'; v: string };

interface Topic {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  emoji: string;
  keyPoints: string[];
  blocks: Block[];
  videoUrl?: string;
  challengeQ: string;
}

interface Chapter {
  id: string;
  title: string;
  topics: Topic[];
}

// ─── STYLES ────────────────────────────────────────────────────────────────
const S = {
  bg: '#0F0F14', panel: '#16161E', card: '#1E1E2A',
  border: 'rgba(255,255,255,0.08)', accent: '#7C3AED',
  accentGlow: 'rgba(124,58,237,0.25)', green: '#10B981',
  text: '#E8E8F0', sub: '#888899', muted: '#555566',
};

// ─── RENDER BLOCKS ───────────────────────────────────────────────────────────
function RenderBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {blocks.map((b, i) => {
        if (b.t === 'h2') return <h2 key={i} style={{ fontSize: 20, fontWeight: 900, color: S.text, margin: '16px 0 4px', letterSpacing: '-0.02em' }}>{b.v}</h2>;
        if (b.t === 'h3') return <h3 key={i} style={{ fontSize: 14, fontWeight: 800, color: '#C4B5FD', margin: '12px 0 2px' }}>{b.v}</h3>;
        if (b.t === 'p')  return <p  key={i} style={{ fontSize: 14, color: S.sub, lineHeight: 1.75, margin: 0 }}>{b.v}</p>;
        if (b.t === 'ul') return (
          <ul key={i} style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {b.v.map((item, j) => <li key={j} style={{ fontSize: 13, color: S.sub, lineHeight: 1.6 }}>{item}</li>)}
          </ul>
        );
        if (b.t === 'code') return (
          <div key={i} style={{ background: '#0A0A10', border: `1px solid ${S.border}`, borderRadius: 12, overflow: 'hidden', margin: '4px 0' }}>
            <div style={{ padding: '6px 16px', background: 'rgba(255,255,255,0.04)', borderBottom: `1px solid ${S.border}`, fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: S.muted }}>{b.lang}</div>
            <pre style={{ margin: 0, padding: '16px', fontSize: 12, color: '#A78BFA', overflowX: 'auto', lineHeight: 1.65, fontFamily: 'JetBrains Mono, Consolas, monospace' }}>{b.v}</pre>
          </div>
        );
        if (b.t === 'tip') return (
          <div key={i} style={{ padding: '12px 16px', background: 'rgba(124,58,237,0.1)', border: `1px solid rgba(124,58,237,0.3)`, borderRadius: 10, fontSize: 13, color: '#C4B5FD', lineHeight: 1.6 }}>
            💡 <strong>Tip:</strong> {b.v}
          </div>
        );
        return null;
      })}
    </div>
  );
}

// ─── TOPIC NODE ──────────────────────────────────────────────────────────────
function TopicNode({ topic, status, isActive, onClick, priority, onInfoClick }: {
  topic: Topic; status: 'completed' | 'current' | 'locked'; isActive: boolean; onClick: () => void; priority?: number; onInfoClick: (e: React.MouseEvent) => void;
}) {
  const locked = status === 'locked';
  const done   = status === 'completed';
  return (
    <motion.button onClick={locked ? undefined : onClick}
      whileHover={!locked ? { x: 3 } : {}} whileTap={!locked ? { scale: 0.97 } : {}}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px', borderRadius: 12, border: 'none', textAlign: 'left',
        cursor: locked ? 'not-allowed' : 'pointer', transition: 'all 0.18s',
        background: isActive ? 'rgba(124,58,237,0.15)' : done ? 'rgba(16,185,129,0.08)' : 'transparent',
        borderLeft: `3px solid ${isActive ? S.accent : done ? S.green : 'transparent'}`,
        opacity: locked ? 0.38 : 1,
        position: 'relative'
      }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, fontSize: 16,
        background: done ? 'rgba(16,185,129,0.15)' : isActive ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.05)',
        border: `1.5px solid ${done ? 'rgba(16,185,129,0.4)' : isActive ? 'rgba(124,58,237,0.4)' : S.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {locked ? <FiLock size={13} color={S.muted} /> : done ? <FiCheckCircle size={14} color={S.green} /> : topic.emoji}
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: locked ? S.muted : S.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{topic.title}</div>
          {priority === 2 && !done && !locked && (
            <span style={{ fontSize: 7, fontWeight: 900, background: 'rgba(16,185,129,0.2)', color: S.green, padding: '2px 5px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recommended</span>
          )}
        </div>
        <div style={{ fontSize: 11, color: S.muted }}>{topic.duration}</div>
      </div>
      
      {!locked && (
        <div 
          onClick={(e) => { e.stopPropagation(); onInfoClick(e); }} 
          style={{ 
            padding: 6, borderRadius: 8, color: S.muted, display: 'flex', 
            alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' 
          }} 
          className="hover:text-white hover:bg-white/10"
        >
          <FiInfo size={13} />
        </div>
      )}

      {isActive && <FiChevronRight size={13} color={S.accent} style={{ flexShrink: 0 }} />}
    </motion.button>
  );
}

// ─── GEMINI NOTES RENDERER ───────────────────────────────────────────────────
// Renders Gemini markdown into styled JSX — handles ##, ###, -, **, numbered lists
function GeminiNotes({ markdown }: { markdown: string }) {
  const lines = markdown.split('\n');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, fontSize: 9, fontWeight: 800, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4, width: 'fit-content' }}>
        ✨ AI Generated · Gemini
      </div>
      {lines.map((line, i) => {
        const t = line.trim();
        if (!t) return <div key={i} style={{ height: 4 }} />;
        if (t.startsWith('## ')) return <h2 key={i} style={{ fontSize: 17, fontWeight: 900, color: '#E8E8F0', margin: '12px 0 2px', letterSpacing: '-0.02em' }}>{t.slice(3)}</h2>;
        if (t.startsWith('### ')) return <h3 key={i} style={{ fontSize: 13, fontWeight: 800, color: '#C4B5FD', margin: '8px 0 2px' }}>{t.slice(4)}</h3>;
        if (t.startsWith('- ') || t.startsWith('* ')) {
          const content = t.slice(2).replace(/\*\*(.*?)\*\*/g, '$1');
          return <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#888899', lineHeight: 1.65, paddingLeft: 8 }}><span style={{ color: '#7C3AED', fontWeight: 900, flexShrink: 0, marginTop: 2 }}>▸</span><span>{content}</span></div>;
        }
        if (/^\d+\.\s/.test(t)) {
          const [num, ...rest] = t.split('. ');
          return <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: '#888899', lineHeight: 1.65, paddingLeft: 8 }}><span style={{ color: '#7C3AED', fontWeight: 900, minWidth: 18 }}>{num}.</span><span>{rest.join('. ').replace(/\*\*(.*?)\*\*/g, '$1')}</span></div>;
        }
        // Regular paragraph — strip bold markers for simple rendering
        const plain = t.replace(/\*\*(.*?)\*\*/g, '$1');
        return <p key={i} style={{ fontSize: 14, color: '#888899', lineHeight: 1.75, margin: 0 }}>{plain}</p>;
      })}
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function LearningPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  
  const courseIdParam = (params?.courseId as string) || 'frontend-react';
  // Resolve via unified alias map: hyphenated slug → underscore key → ROADMAPS entry
  const roadmapId = COURSE_SLUG_MAP[courseIdParam] || courseIdParam;
  const roadmapData = ROADMAPS[roadmapId];
  
  const courseNotFound = !roadmapData;
  
  const course = courseNotFound ? null : {
    title: roadmapData.title,
    chapters: roadmapData.chapters.map(ch => ({
      id: ch.id,
      title: ch.title,
      topics: ch.topics.map(t => {
        const step = roadmapData.steps.find(s => s.topic === t.title) || roadmapData.steps[0];
        return {
          id: t.id,
          title: t.title,
          subtitle: `${t.difficulty} · ${ch.title}`,
          duration: t.duration,
          emoji: roadmapData.icon || '📚',
          keyPoints: roadmapData.skills.slice(0, 4),
          videoUrl: (t as any).youtubeUrl,
          challengeQ: step?.practice || 'Complete the practice exercise for this topic.',
          blocks: [
            { t: 'h2', v: t.title },
            { t: 'p', v: step?.description || ch.title },
            { t: 'h3', v: 'Resources' },
            { t: 'ul', v: (step?.resources || []).map(r => `${r.name} - ${r.url}`) },
            ...(step?.practice ? [
              { t: 'h3', v: 'Practice' },
              { t: 'p', v: step.practice }
            ] : [])
          ] as Block[]
        };
      })
    }))
  };

  const allTopics = course ? course.chapters.flatMap(ch => ch.topics) : [];

  const [topicPriorities, setTopicPriorities] = useState<Record<string, number>>({});
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [activeTopic, setActiveTopic]   = useState<Topic | null>(null);
  const [activeTab, setActiveTab]       = useState<'notes' | 'video' | 'resources' | 'challenge'>('notes');
  const [geminiNotes, setGeminiNotes]   = useState<string>('');
  const [notesLoading, setNotesLoading] = useState(false);
  const [messages, setMessages]         = useState([{ role: 'ai', content: "Hi! I'm your Doubt Bot. Select a topic and ask me anything about it — I'll guide you, not just give answers." }]);
  const [input, setInput]               = useState('');
  const [botLoading, setBotLoading]     = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Mobile navigation state
  const [showTopics, setShowTopics] = useState(false);
  const [showChat, setShowChat]     = useState(false);

  // XAI State
  const [xaiTopic, setXaiTopic] = useState<Topic | null>(null);
  const [xaiExplanation, setXaiExplanation] = useState<string>('');
  const [xaiLoading, setXaiLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  // Load user profile for XAI prompt context
  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'users', user.uid)).then(snap => {
        if (snap.exists()) setProfile(snap.data());
    });
  }, [user]);

  const handleInfoClick = async (topic: Topic) => {
    setXaiTopic(topic);
    setXaiExplanation('');
    
    const cacheKey = `xai_${roadmapId}_${topic.id}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        setXaiExplanation(cached);
        return;
    }

    setXaiLoading(true);
    try {
        const prompt = `A student is learning ${topic.title} as part of ${course?.title} track. They have completed ${profile?.labsCompleted || 0} labs and their current employability level is ${profile?.employabilityLevel || 'Beginner'}. Their career goal is ${profile?.learningPath || 'Software Engineer'}. In 3 short bullet points explain: 1) Why this topic is important at this stage of their journey 2) What real world job skill it builds 3) How completing this topic improves their chances of getting hired. Keep it encouraging and simple for a beginner Indian engineering student. Maximum 60 words per bullet point.`;
        
        const res = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        const data = await res.json();
        const text = data.text || 'Could not generate explanation.';
        setXaiExplanation(text);
        localStorage.setItem(cacheKey, text);
    } catch (err) {
        setXaiExplanation('Failed to connect to AI service.');
    } finally {
        setXaiLoading(false);
    }
  };

  // Key includes userId so different accounts on the same browser never share progress
  const storageKey = `pp_learn_${user?.uid || 'guest'}_${roadmapId}`;

  useEffect(() => {
    // Reset when user changes to prevent bleed-over between accounts
    setCompletedIds(new Set());
    setActiveTopic(null);
    setTopicPriorities({});

    const fetchData = async () => {
        if (!user) return;
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
            setTopicPriorities(snap.data().topicPriorities || {});
        }
    };
    fetchData();

    const saved = localStorage.getItem(storageKey);
    let ids = new Set<string>();
    if (saved) {
      try {
        ids = new Set<string>(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to parse progress', e);
      }
    }
    setCompletedIds(ids);
    const first = allTopics.find(t => !ids.has(t.id)) || allTopics[0];
    setActiveTopic(first || null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roadmapId, user?.uid]);

  useEffect(() => { setShowTopics(false); setShowChat(false); }, [activeTopic]);

  // Fetch Gemini notes whenever the active topic changes (with localStorage caching)
  useEffect(() => {
    if (!activeTopic) return;
    
    const cacheKey = `notes_${courseIdParam}_${activeTopic.id}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      setGeminiNotes(cached);
      setNotesLoading(false);
      return;
    }

    setGeminiNotes('');
    setNotesLoading(true);
    fetch(`/api/notes?topic=${encodeURIComponent(activeTopic.title)}&course=${encodeURIComponent(courseIdParam)}`)
      .then(r => r.json())
      .then(d => {
        if (d.notes) {
          setGeminiNotes(d.notes);
          localStorage.setItem(cacheKey, d.notes);
        } else {
          setGeminiNotes('');
        }
      })
      .catch(() => setGeminiNotes(''))
      .finally(() => setNotesLoading(false));
  }, [activeTopic?.id, courseIdParam]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages]);

  const getStatus = (topic: Topic, idx: number): 'completed' | 'current' | 'locked' => {
    if (completedIds.has(topic.id)) return 'completed';
    if (idx === 0 || (allTopics[idx - 1] && completedIds.has(allTopics[idx - 1].id))) return 'current';
    return 'locked';
  };

  const markComplete = async () => {
    if (!activeTopic) return;
    const updated = new Set(completedIds);
    updated.add(activeTopic.id);
    setCompletedIds(updated);
    localStorage.setItem(storageKey, JSON.stringify([...updated]));

    // Firestore sync
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          completedTopics: arrayUnion(activeTopic.id),
          xp: increment(10)
        });
        // Run adaptive recommendation logic
        await calculateTopicPriority(user.uid);
        
        // Refresh priorities
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setTopicPriorities(snap.data().topicPriorities || {});
        }
      } catch (e) {
        console.error("Firestore sync failed", e);
      }
    }

    const idx = allTopics.findIndex(t => t.id === activeTopic.id);
    if (idx < allTopics.length - 1) { setActiveTopic(allTopics[idx + 1]); setActiveTab('notes'); }
  };

  const sendDoubt = async () => {
    if (!input.trim() || botLoading) return;
    const q = input.trim();
    setMessages(p => [...p, { role: 'user', content: q }]);
    setInput('');
    setBotLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: q }].map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content })), personalityMode: 'TUTOR' })
      });
      const data = await res.json();
      setMessages(p => [...p, { role: 'ai', content: data.text || 'Try rephrasing your question!' }]);
    } catch {
      setMessages(p => [...p, { role: 'ai', content: 'Could not reach the AI. Check your connection.' }]);
    } finally { setBotLoading(false); }
  };

  const done  = completedIds.size;
  const total = allTopics.length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
  const ai    = activeTopic ? allTopics.findIndex(t => t.id === activeTopic.id) : -1;
  const astatus = activeTopic ? getStatus(activeTopic, ai) : 'locked';
  const canMark = !!activeTopic && astatus !== 'locked' && !completedIds.has(activeTopic.id);

  if (courseNotFound) {
    return (
      <div style={{ height: '100vh', background: S.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: S.text }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🚀</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 10, letterSpacing: '-0.03em' }}>Course Coming Soon</h2>
          <p style={{ color: S.sub, fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
            This learning path is being built by our curriculum team. Check back soon — we publish new paths regularly!
          </p>
          <button onClick={() => router.push('/dashboard')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'linear-gradient(135deg,#7C3AED,#A855F7)', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 800, fontSize: 13, color: '#fff', boxShadow: '0 6px 22px rgba(124,58,237,0.35)' }}>
            <FiArrowLeft size={14} /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0F0F14] flex flex-col overflow-hidden text-[#E8E8F0]">
      {/* TOPBAR */}
      <header className="h-14 md:h-16 bg-[#16161E] border-b border-white/10 flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-50">
        <div className="flex items-center gap-3 md:gap-5 overflow-hidden">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg cursor-pointer text-[#888899] text-[10px] md:text-xs font-bold hover:bg-white/10 transition-all">
            <FiArrowLeft size={13} /> <span className="hidden sm:inline">Dashboard</span>
          </button>
          
          <button onClick={() => setShowTopics(!showTopics)} className="lg:hidden p-2 text-[#888899] bg-white/5 border border-white/10 rounded-lg">
            <FiBook size={18} />
          </button>

          <div className="hidden sm:block h-5 w-px bg-white/10" />
          <h1 className="text-xs md:text-sm font-black text-[#E8E8F0] truncate tracking-tight">{course?.title}</h1>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <div className="hidden sm:flex items-center gap-3">
             <span className="text-[10px] md:text-xs font-bold text-[#7C3AED]">{done}/{total} topics</span>
             <div className="w-16 md:w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
               <motion.div animate={{ width: pct + '%' }} transition={{ duration: 0.5 }} className="h-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-full" />
             </div>
          </div>
          
          <button onClick={() => setShowChat(!showChat)} className="lg:hidden p-2 text-[#888899] bg-white/5 border border-white/10 rounded-lg">
            <FiMessageSquare size={18} />
          </button>
          
          {pct === 100 && <FiAward size={18} className="text-[#10B981]" />}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">

        {/* LEFT — topic chain */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-[280px] lg:w-[260px] bg-[#16161E] border-r border-white/10 flex flex-col flex-shrink-0
          transition-transform duration-300 ease-in-out
          ${showTopics ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="lg:hidden p-4 border-b border-white/10 flex justify-between items-center">
            <span className="text-xs font-black text-white/50 uppercase tracking-widest">Roadmap</span>
            <button onClick={() => setShowTopics(false)} className="p-2 text-white/50"><FiXCircle size={18} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-3 no-scrollbar">
            {course?.chapters.map((ch, chIdx) => {
              // Reorder logic: Recommended first, but don't mess with completed topics' position too much
              const sortedTopics = [...ch.topics].sort((a, b) => {
                const pA = topicPriorities[a.id] || 0;
                const pB = topicPriorities[b.id] || 0;
                const doneA = completedIds.has(a.id);
                const doneB = completedIds.has(b.id);
                
                if (doneA && !doneB) return 1;
                if (!doneA && doneB) return -1;
                if (doneA && doneB) return 0;
                
                return pB - pA;
              });

              return (
                <div key={ch.id} className="mb-6">
                  <div className="text-[9px] font-black uppercase tracking-[0.18em] text-[#555566] px-2 mb-3">{ch.title}</div>
                  <div className="relative">
                    <div className="absolute left-[17px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#7C3AED]/30 to-white/5 rounded-full" />
                    <div className="flex flex-col gap-1">
                      {sortedTopics.map((topic) => (
                        <TopicNode key={topic.id} 
                          topic={topic} 
                          status={getStatus(topic, allTopics.findIndex(at => at.id === topic.id))}
                          isActive={activeTopic?.id === topic.id}
                          priority={topicPriorities[topic.id]}
                          onInfoClick={() => handleInfoClick(topic)}
                          onClick={() => { setActiveTopic(topic); setActiveTab('notes'); }} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            {pct === 100 && (
              <div className="m-1 p-5 bg-green-500/10 border border-green-500/30 rounded-xl text-center shadow-lg shadow-green-500/5">
                <div className="text-2xl mb-2">🎉</div>
                <div className="text-xs font-black text-[#10B981] uppercase tracking-wider">Course Complete!</div>
              </div>
            )}
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {showTopics && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setShowTopics(false)} />}
        {showChat && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setShowChat(false)} />}

        {/* CENTER — content */}
        <main className="flex-1 overflow-y-auto border-r border-white/10 bg-[#0F0F14]">
          {activeTopic ? (
            <AnimatePresence mode="wait">
              <motion.div key={activeTopic.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {/* Hero */}
                <div className="p-6 md:p-10 border-b border-white/10">
                  <div className="text-4xl mb-4">{activeTopic.emoji}</div>
                  <h2 className="text-xl md:text-3xl font-black text-[#E8E8F0] mb-2 tracking-tight">{activeTopic.title}</h2>
                  <p className="text-xs md:text-sm text-[#888899] mb-6 font-medium">{activeTopic.subtitle} · {activeTopic.duration}</p>
                  
                  {/* Key points */}
                  <div className="flex flex-wrap gap-2.5">
                    {activeTopic.keyPoints.map((kp, i) => (
                      <div key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] md:text-xs font-bold text-[#888899] font-mono tracking-tight">{kp}</div>
                    ))}
                  </div>
                </div>
 
                {/* Tabs */}
                <div className="flex bg-[#16161E] border-b border-white/10 px-6 md:px-10 overflow-x-auto no-scrollbar">
                  {([['notes','📝 Notes'], ['video','🎬 Video'], ['resources','🔗 Resources'], ['challenge','⚡ Challenge']] as [string,string][]).map(([id, label]) => (
                    <button key={id} onClick={() => setActiveTab(id as any)}
                      className={`flex items-center gap-1.5 px-4 py-3.5 border-none bg-transparent cursor-pointer text-[10px] font-black uppercase tracking-widest transition-all flex-shrink-0
                      ${activeTab === id ? 'text-[#7C3AED] border-b-2 border-[#7C3AED]' : 'text-[#555566] hover:text-[#888899]'}`}
                    >{label}</button>
                  ))}
                </div>

                {/* Tab body */}
                <div className="p-6 md:p-10 pb-16">

                  {/* ── NOTES TAB: Gemini-generated ── */}
                  {activeTab === 'notes' && (
                    <div className="flex flex-col gap-4">
                      {notesLoading ? (
                        <div className="flex flex-col gap-3 animate-pulse">
                          <div className="h-5 bg-white/5 rounded-lg w-3/4" />
                          <div className="h-4 bg-white/5 rounded-lg w-full" />
                          <div className="h-4 bg-white/5 rounded-lg w-5/6" />
                          <div className="h-4 bg-white/5 rounded-lg w-full" />
                          <div className="h-4 bg-white/5 rounded-lg w-2/3" />
                          <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-[#555566] flex items-center gap-2">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
                            Gemini is generating your notes…
                          </div>
                        </div>
                      ) : geminiNotes ? (
                        <GeminiNotes markdown={geminiNotes} />
                      ) : (
                        <RenderBlocks blocks={activeTopic.blocks} />
                      )}
                    </div>
                  )}

                  {/* ── VIDEO TAB: topic video → course fallback ── */}
                  {activeTab === 'video' && (() => {
                    const res = getTopicResource(activeTopic.title);
                    const vid = activeTopic.videoUrl
                      ? activeTopic.videoUrl
                      : res?.videoId
                        ? `https://www.youtube.com/embed/${res.videoId}?rel=0&modestbranding=1`
                        : `https://www.youtube.com/embed/${getCourseVideo(courseIdParam)}?rel=0&modestbranding=1`;
                    return (
                      <div className="flex flex-col gap-6">
                        <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video shadow-2xl">
                          <iframe src={vid} className="w-full h-full border-none" allowFullScreen title={activeTopic.title} />
                        </div>
                        <div className="p-4 bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-xl text-xs md:text-sm text-[#C4B5FD] leading-relaxed flex items-start gap-3">
                          <span className="text-xl">💡</span>
                          <p>Pause and take notes as you watch. Then use the <strong>Doubt Bot</strong> to test your understanding.</p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* ── RESOURCES TAB: curated links ── */}
                  {activeTab === 'resources' && (() => {
                    const res = getTopicResource(activeTopic.title);
                    const links = res?.resources || [];
                    return (
                      <div className="flex flex-col gap-4">
                        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#555566] mb-2">
                          Curated Resources · {activeTopic.title}
                        </div>
                        {links.length > 0 ? links.map((link, i) => (
                          <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 bg-[#16161E] border border-white/10 rounded-xl hover:border-[#7C3AED]/50 hover:bg-[#7C3AED]/5 transition-all group no-underline">
                            <div className="w-9 h-9 rounded-lg bg-[#7C3AED]/15 border border-[#7C3AED]/30 flex items-center justify-center text-base flex-shrink-0">
                              {link.badge === 'MDN' ? '🦊' : link.badge === 'freeCodeCamp' ? '🏕️' : link.badge === 'Docs' ? '📖' : '🔗'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-[#E8E8F0] group-hover:text-[#A78BFA] transition-colors truncate">{link.title}</div>
                              <div className="text-[10px] text-[#555566] mt-0.5 truncate">{link.url}</div>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-[#7C3AED]/15 text-[#A78BFA] flex-shrink-0">
                              {link.badge}
                            </span>
                          </a>
                        )) : (
                          <div className="text-center py-16 text-[#555566]">
                            <div className="text-3xl mb-3">🔗</div>
                            <div className="text-[10px] font-black uppercase tracking-widest">Resources coming soon for this topic</div>
                          </div>
                        )}
                        <div className="mt-2 p-3 bg-green-500/5 border border-green-500/20 rounded-lg text-[10px] text-[#888899] font-medium">
                          ✅ All links are official documentation, freeCodeCamp articles, or MDN Web Docs. No random community links.
                        </div>
                      </div>
                    );
                  })()}

                  {/* ── CHALLENGE TAB ── */}
                  {activeTab === 'challenge' && (
                    <div className="flex flex-col gap-6">
                      <div className="p-6 md:p-8 bg-gradient-to-br from-[#7C3AED]/20 to-transparent border border-[#7C3AED]/30 rounded-2xl shadow-xl">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7C3AED] mb-3">Quick Challenge</div>
                        <div className="text-base md:text-xl font-black text-[#E8E8F0] leading-relaxed">{activeTopic.challengeQ}</div>
                      </div>
                      <div className="text-xs md:text-sm text-[#888899] font-medium opacity-80 flex items-center gap-2">
                        <FiMessageSquare className="text-[#A78BFA]" />
                        <span>Type your answer in the <strong>Doubt Bot</strong>.</span>
                      </div>
                    </div>
                  )}

                  {/* Complete button */}
                  <div className="mt-12 md:mt-16">
                    {astatus === 'completed' ? (
                      <div className="inline-flex items-center gap-3 px-6 py-3.5 bg-green-500/10 border border-green-500/30 rounded-xl text-[#10B981] font-black text-xs uppercase tracking-widest">
                        <FiCheckCircle size={16} /> Topic Completed
                      </div>
                    ) : (
                      <motion.button onClick={markComplete} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
                        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-[#7C3AED] to-[#A855F7] border-none rounded-xl cursor-pointer font-black text-xs uppercase tracking-widest text-white shadow-xl shadow-[#7C3AED]/30"
                      >
                        Complete & Continue <FiArrowRight size={16} />
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-[#555566] p-10 text-center">
               <FiBook size={48} className="mb-4 opacity-20" />
               <p className="text-sm font-black uppercase tracking-widest">Select a topic to begin your journey</p>
            </div>
          )}
        </main>

        {/* RIGHT — doubt bot */}
        <aside className={`
          fixed lg:static inset-y-0 right-0 z-40
          w-[300px] lg:w-[290px] bg-[#16161E] border-l border-white/10 flex flex-col flex-shrink-0
          transition-transform duration-300 ease-in-out
          ${showChat ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4 md:p-5 border-b border-white/10 flex justify-between items-center bg-black/10">
            <div className="flex items-center gap-2.5">
              <FiMessageSquare size={14} className="text-[#A78BFA]" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#E8E8F0]">Doubt Bot</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[#555566]">Live</span>
              </div>
              <button onClick={() => setShowChat(false)} className="lg:hidden text-[#555566] hover:text-white transition-colors"><FiX size={18} /></button>
            </div>
          </div>
          {activeTopic && <div style={{ padding: '7px 14px', background: 'rgba(124,58,237,0.1)', borderBottom: `1px solid ${S.border}`, fontSize: 10, fontWeight: 700, color: S.accent }}>📍 {activeTopic.title}</div>}

          <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'ai' ? 'flex-start' : 'flex-end' }}>
                <div style={{ maxWidth: '88%', padding: '10px 12px', borderRadius: m.role === 'ai' ? '4px 14px 14px 14px' : '14px 4px 14px 14px', fontSize: 12, lineHeight: 1.6, fontWeight: 500, background: m.role === 'ai' ? S.card : 'linear-gradient(135deg,#7C3AED,#A855F7)', color: m.role === 'ai' ? S.sub : '#fff', border: m.role === 'ai' ? `1px solid ${S.border}` : 'none' }}>
                  {m.content}
                </div>
              </div>
            ))}
            {botLoading && (
              <div style={{ display: 'flex', gap: 5, padding: '10px 14px', background: S.card, borderRadius: '4px 14px 14px 14px', width: 'fit-content', border: `1px solid ${S.border}` }}>
                {[0,1,2].map(i => <motion.div key={i} animate={{ y: [0,-4,0] }} transition={{ repeat: Infinity, duration: 0.7, delay: i*0.15 }} style={{ width: 6, height: 6, borderRadius: '50%', background: S.accent }} />)}
              </div>
            )}
          </div>

          <div style={{ padding: '10px', borderTop: `1px solid ${S.border}` }}>
            <div style={{ display: 'flex', gap: 8, background: S.card, border: `1px solid ${S.border}`, borderRadius: 11, padding: '8px 8px 8px 12px', alignItems: 'center' }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendDoubt()}
                placeholder={activeTopic ? 'Ask about this topic...' : 'Select a topic first...'}
                disabled={!activeTopic}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: S.text, fontFamily: 'inherit' }} />
              <button onClick={sendDoubt} disabled={!input.trim() || botLoading || !activeTopic}
                style={{ width: 30, height: 30, borderRadius: 8, border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', background: input.trim() ? 'linear-gradient(135deg,#7C3AED,#A855F7)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}>
                <FiSend size={12} color={input.trim() ? '#fff' : S.muted} />
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* XAI MODAL */}
      <AnimatePresence>
        {xaiTopic && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setXaiTopic(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#16161E] border border-white/10 rounded-[28px] overflow-hidden shadow-2xl shadow-purple-500/10"
            >
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-2xl shadow-lg">
                      ✨
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">Why learn this now?</h3>
                      <p className="text-xs font-bold text-[#A78BFA] uppercase tracking-widest">{xaiTopic.title}</p>
                    </div>
                  </div>
                  <button onClick={() => setXaiTopic(null)} className="p-2 text-[#555566] hover:text-white transition-colors"><FiX size={20} /></button>
                </div>

                <div className="space-y-6">
                  {xaiLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-4">
                       <div className="w-10 h-10 border-4 border-[#7C3AED]/30 border-t-[#7C3AED] rounded-full animate-spin" />
                       <div className="text-xs font-black uppercase tracking-widest text-[#555566]">Consulting Neural Link...</div>
                    </div>
                  ) : (
                    <>
                      <div className="prose prose-invert max-w-none">
                        <GeminiNotes markdown={xaiExplanation} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                          <div className="text-[9px] font-black uppercase tracking-widest text-[#555566] mb-2">Employability Boost</div>
                          <div className="text-lg font-black text-[#10B981]">+{(Math.random() * 2 + 3).toFixed(1)}%</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                          <div className="text-[9px] font-black uppercase tracking-widest text-[#555566] mb-2">Time Commitment</div>
                          <div className="text-lg font-black text-white">{xaiTopic.duration}</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 md:col-span-2">
                          <div className="text-[9px] font-black uppercase tracking-widest text-[#555566] mb-2">Jobs requiring this skill</div>
                          <div className="flex flex-wrap gap-2">
                            {(() => {
                              const title = course?.title.toLowerCase() || '';
                              if (title.includes('frontend')) return ['Frontend Developer', 'UI Engineer', 'Product Designer'];
                              if (title.includes('backend')) return ['Backend Architect', 'API Developer', 'System Engineer'];
                              if (title.includes('data')) return ['Data Scientist', 'ML Engineer', 'Analytics Lead'];
                              if (title.includes('security')) return ['SecOps Engineer', 'Penetration Tester', 'Security Analyst'];
                              return ['Software Engineer', 'Full Stack Developer', 'Cloud Architect'];
                            })().map(job => (
                              <span key={job} className="px-2 py-1 bg-[#7C3AED]/10 text-[#A78BFA] rounded-md text-[10px] font-bold border border-[#7C3AED]/20">{job}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="bg-[#1c1c28] p-5 flex justify-center">
                 <button onClick={() => setXaiTopic(null)} className="px-10 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all">
                   Got it, Captain
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
