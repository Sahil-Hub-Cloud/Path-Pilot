'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { ROADMAPS, COURSE_SLUG_MAP } from '@/lib/data/roadmaps';
import { TRACK_DEFAULT_LAB, getLabForTopic } from '@/lib/data/labs';
import GameMap, { type MapChapter, type NodeStatus } from '@/components/learn/GameMap';
import TopicPanel, { type TopicPanelTopic } from '@/components/learn/TopicPanel';
import {
  FiArrowLeft,
  FiMessageSquare,
  FiSend,
  FiX,
} from 'react-icons/fi';
import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion, increment, getDoc } from 'firebase/firestore';
import { calculateTopicPriority } from '@/lib/services/recommendation';

const CHAT_S = {
  bg: '#16161E',
  card: '#1E1E2A',
  border: 'rgba(255,255,255,0.08)',
  accent: '#0D8C7A',
  text: '#E8E8F0',
  sub: '#888899',
  muted: '#555566',
};

function playSuccessChime() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    /* optional */
  }
}

export default function LearningPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();

  const courseIdParam = (params?.courseId as string) || 'frontend-react';
  const roadmapId = COURSE_SLUG_MAP[courseIdParam] || courseIdParam;
  const roadmapData = ROADMAPS[roadmapId];
  const courseNotFound = !roadmapData;

  const course = useMemo(() => {
    if (!roadmapData) return null;
    return {
      title: roadmapData.title,
      icon: roadmapData.icon || '📚',
      skills: roadmapData.skills.slice(0, 6),
      chapters: roadmapData.chapters.map((ch, chIdx) => ({
        id: ch.id,
        title: ch.title,
        chapterNumber: chIdx + 1,
        topics: ch.topics.map((t, tIdx) => {
          const globalIndex =
            roadmapData.chapters.slice(0, chIdx).reduce((acc, c) => acc + c.topics.length, 0) + tIdx;
          return {
            id: t.id,
            title: t.title,
            duration: t.duration,
            difficulty: t.difficulty,
            globalIndex,
            panel: {
              id: t.id,
              title: t.title,
              subtitle: `${t.difficulty} · ${ch.title}`,
              duration: t.duration,
              difficulty: t.difficulty,
              keyPoints: roadmapData.skills.slice(0, 4),
              videoUrl: t.videoUrl,
            } as TopicPanelTopic,
          };
        }),
      })),
    };
  }, [roadmapData]);

  const mapChapters: MapChapter[] = useMemo(
    () =>
      course?.chapters.map((ch) => ({
        id: ch.id,
        title: ch.title,
        chapterNumber: ch.chapterNumber,
        topics: ch.topics.map((t) => ({
          id: t.id,
          title: t.title,
          duration: t.duration,
          difficulty: t.difficulty,
          globalIndex: t.globalIndex,
        })),
      })) ?? [],
    [course]
  );

  const allTopics = useMemo(
    () => course?.chapters.flatMap((ch) => ch.topics) ?? [],
    [course]
  );

  const storageKey = `pp_learn_${user?.uid || 'guest'}_${roadmapId}`;

  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [showMobilePanel, setShowMobilePanel] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [recentlyUnlockedId, setRecentlyUnlockedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string }[]>([
    { role: 'ai', content: "Hi! I'm your Doubt Bot. Select a topic and ask me anything — I'll guide you, not just give answers." },
  ]);
  const [input, setInput] = useState('');
  const [botLoading, setBotLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (allTopics.length === 0) return;

    const saved = localStorage.getItem(storageKey);
    let ids = new Set<string>();
    if (saved) {
      try {
        ids = new Set<string>(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
    setCompletedIds(ids);
    const first = allTopics.find((t) => !ids.has(t.id)) || allTopics[0];
    setActiveTopicId((prev) => {
      if (prev && allTopics.some((t) => t.id === prev)) return prev;
      return first?.id ?? null;
    });
  }, [roadmapId, user?.uid, storageKey, allTopics.length]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const getStatus = useCallback(
    (topicId: string, globalIndex: number): NodeStatus => {
      if (completedIds.has(topicId)) return 'completed';
      if (globalIndex === 0) return 'current';
      const prev = allTopics[globalIndex - 1];
      if (prev && completedIds.has(prev.id)) return 'current';
      return 'locked';
    },
    [completedIds, allTopics]
  );

  const activeTopic = allTopics.find((t) => t.id === activeTopicId);
  const defaultLabId =
    (activeTopicId ? getLabForTopic(courseIdParam, activeTopicId) : null) ||
    TRACK_DEFAULT_LAB[roadmapId] ||
    TRACK_DEFAULT_LAB[courseIdParam] ||
    TRACK_DEFAULT_LAB[course?.title || ''] ||
    `${courseIdParam}-lab-1`;
  const activeGlobalIndex = activeTopic?.globalIndex ?? -1;
  const activeStatus = activeTopic ? getStatus(activeTopic.id, activeGlobalIndex) : 'locked';
  const canMark =
    !!activeTopic && activeStatus !== 'locked' && !completedIds.has(activeTopic.id);

  const done = completedIds.size;
  const total = allTopics.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const markComplete = async () => {
    if (!activeTopic) return;

    const updated = new Set(completedIds);
    updated.add(activeTopic.id);
    setCompletedIds(updated);
    localStorage.setItem(storageKey, JSON.stringify([...updated]));

    setCelebrating(true);
    playSuccessChime();

    const next = allTopics[activeGlobalIndex + 1];
    if (next) {
      setTimeout(() => {
        setRecentlyUnlockedId(next.id);
        setTimeout(() => setRecentlyUnlockedId(null), 1200);
      }, 400);
    }

    setTimeout(() => setCelebrating(false), 2200);

    if (user && db) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          completedTopics: arrayUnion(activeTopic.id),
          xp: increment(10),
        });
        await calculateTopicPriority(user.uid);
      } catch (e) {
        console.error('Firestore sync failed', e);
      }
    }

    if (next) {
      setActiveTopicId(next.id);
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setShowMobilePanel(true);
      }
    }
  };

  const sendDoubt = async () => {
    if (!input.trim() || botLoading) return;
    const q = input.trim();
    const topicCtx = activeTopic ? `Context: learning "${activeTopic.panel.title}" in ${course?.title}. ` : '';
    setMessages((p) => [...p, { role: 'user', content: q }]);
    setInput('');
    setBotLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: topicCtx + q }].map((m) => ({
            role: m.role === 'ai' ? 'assistant' : 'user',
            content: m.content,
          })),
          personalityMode: 'TUTOR',
        }),
      });
      const data = await res.json();
      setMessages((p) => [...p, { role: 'ai', content: data.text || 'Try rephrasing your question!' }]);
    } catch {
      setMessages((p) => [...p, { role: 'ai', content: 'Could not reach the AI. Check your connection.' }]);
    } finally {
      setBotLoading(false);
    }
  };

  const handleSelectTopic = (topicId: string) => {
    const idx = allTopics.findIndex((t) => t.id === topicId);
    const status = getStatus(topicId, idx);
    if (status === 'locked') return;
    setActiveTopicId(topicId);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setShowMobilePanel(true);
    }
  };

  if (courseNotFound) {
    return (
      <div style={{ height: '100vh', background: '#FDF6EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 400, padding: 24 }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🚀</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#2C1A0E', marginBottom: 10 }}>Course Coming Soon</h2>
          <p style={{ color: '#8B6E52', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
            This learning path is being built. Check back soon!
          </p>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #0D8C7A, #006B7A)',
              border: 'none',
              borderRadius: 12,
              color: '#fff',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            <FiArrowLeft style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: '#FDF6EC' }}>
      {/* Sticky progress header */}
      <header
        className="flex-shrink-0 z-50 px-4 md:px-6 py-3 border-b"
        style={{ background: '#fff', borderColor: 'rgba(180,140,90,0.25)', boxShadow: '0 2px 12px rgba(140,90,40,0.06)' }}
      >
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="flex-shrink-0 p-2 rounded-lg border"
              style={{ borderColor: 'rgba(180,140,90,0.3)', background: '#FDF6EC', color: '#0D8C7A' }}
            >
              <FiArrowLeft size={16} />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm md:text-base font-black text-[#2C1A0E] truncate">
                {course?.icon && <span className="mr-1.5">{course.icon}</span>}
                {course?.title}
              </h1>
              <p className="text-[11px] font-bold text-[#8B6E52]">
                {done}/{total} topics completed · {pct}%
              </p>
            </div>
          </div>
          <button
            type="button"
            className="lg:hidden p-2 rounded-full shadow-md"
            style={{ background: '#0D8C7A', color: '#fff' }}
            onClick={() => setShowChat(true)}
            aria-label="Open Doubt Bot"
          >
            <FiMessageSquare size={20} />
          </button>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(180,140,90,0.2)' }}>
          <motion.div
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #22C55E, #0D8C7A)' }}
          />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Game map — 300px desktop */}
        <aside
          className="w-full lg:w-[300px] flex-shrink-0 border-r flex flex-col"
          style={{ borderColor: 'rgba(180,140,90,0.25)' }}
        >
          <GameMap
            chapters={mapChapters}
            courseIcon={course?.icon || '📚'}
            activeTopicId={activeTopicId}
            completedIds={completedIds}
            getStatus={getStatus}
            onSelectTopic={handleSelectTopic}
            recentlyUnlockedId={recentlyUnlockedId}
          />
        </aside>

        {/* Topic panel — desktop inline */}
        <main className="hidden lg:flex flex-1 flex-col min-w-0 overflow-hidden bg-[#FDF6EC]">
          <TopicPanel
            topic={activeTopic?.panel ?? null}
            courseTitle={course?.title || ''}
            courseIdParam={courseIdParam}
            courseSkills={course?.skills || []}
            user={user}
            roadmapId={roadmapId}
            status={activeStatus}
            canMark={canMark}
            defaultLabId={defaultLabId}
            onMarkComplete={markComplete}
            onAskTutor={() => setShowChat(true)}
          />
        </main>

        {/* Doubt bot — 300px desktop */}
        <aside
          className={`hidden lg:flex w-[300px] flex-shrink-0 flex-col ${CHAT_S.bg} border-l`}
          style={{ borderColor: CHAT_S.border }}
        >
          <DoubtBotPanel
            activeTitle={activeTopic?.panel.title}
            messages={messages}
            input={input}
            setInput={setInput}
            botLoading={botLoading}
            sendDoubt={sendDoubt}
            chatRef={chatRef}
            onClose={() => {}}
            showClose={false}
          />
        </aside>
      </div>

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {showMobilePanel && activeTopic && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowMobilePanel(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="lg:hidden fixed inset-x-0 bottom-0 z-50 rounded-t-[24px] overflow-hidden flex flex-col"
              style={{ height: '92vh', background: '#FDF6EC', boxShadow: '0 -8px 40px rgba(0,0,0,0.15)' }}
            >
              <div className="flex justify-center py-2 flex-shrink-0">
                <div className="w-10 h-1 rounded-full bg-amber-300" />
              </div>
              <button
                type="button"
                onClick={() => setShowMobilePanel(false)}
                className="absolute top-3 right-4 p-2 rounded-full bg-white/80 z-10"
                style={{ color: '#8B6E52' }}
              >
                <FiX size={20} />
              </button>
              <div className="flex-1 overflow-hidden flex flex-col">
                <TopicPanel
                  topic={activeTopic.panel}
                  courseTitle={course?.title || ''}
                  courseIdParam={courseIdParam}
                  courseSkills={course?.skills || []}
                  user={user}
                  roadmapId={roadmapId}
                  status={activeStatus}
                  canMark={canMark}
                  defaultLabId={defaultLabId}
                  onMarkComplete={markComplete}
                  onAskTutor={() => {
                    setShowMobilePanel(false);
                    setShowChat(true);
                  }}
                  compact
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile doubt bot sheet */}
      <AnimatePresence>
        {showChat && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-[60]"
              onClick={() => setShowChat(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="lg:hidden fixed inset-x-0 bottom-0 z-[70] rounded-t-2xl overflow-hidden flex flex-col"
              style={{ height: '70vh', background: CHAT_S.bg }}
            >
              <DoubtBotPanel
                activeTitle={activeTopic?.panel.title}
                messages={messages}
                input={input}
                setInput={setInput}
                botLoading={botLoading}
                sendDoubt={sendDoubt}
                chatRef={chatRef}
                onClose={() => setShowChat(false)}
                showClose
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Celebration burst */}
      <AnimatePresence>
        {celebrating && (
          <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
            {['⭐', '🌟', '✨', '🎉', '💫', '🏆', '🎊', '⚡', '🔥', '🎯'].map((emoji, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 1, scale: 0.5, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: [0.5, 2.2, 1.8],
                  x: (Math.cos((i / 10) * Math.PI * 2) * (120 + Math.random() * 120)),
                  y: (Math.sin((i / 10) * Math.PI * 2) * (100 + Math.random() * 100)) - 40,
                }}
                transition={{ duration: 1.6, delay: i * 0.04, ease: 'easeOut' }}
                style={{ position: 'absolute', fontSize: 32 }}
              >
                {emoji}
              </motion.span>
            ))}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{
                background: '#fff',
                padding: '18px 32px',
                borderRadius: 20,
                fontWeight: 900,
                color: '#16A34A',
                fontSize: 18,
                boxShadow: '0 8px 40px rgba(34,197,94,0.35), 0 0 0 4px rgba(34,197,94,0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              🎉 Topic complete!
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DoubtBotPanel({
  activeTitle,
  messages,
  input,
  setInput,
  botLoading,
  sendDoubt,
  chatRef,
  onClose,
  showClose,
}: {
  activeTitle?: string;
  messages: { role: 'ai' | 'user'; content: string }[];
  input: string;
  setInput: (v: string) => void;
  botLoading: boolean;
  sendDoubt: () => void;
  chatRef: React.RefObject<HTMLDivElement>;
  onClose: () => void;
  showClose: boolean;
}) {
  return (
    <>
      <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: CHAT_S.border }}>
        <div className="flex items-center gap-2">
          <FiMessageSquare size={14} style={{ color: '#6EE7B7' }} />
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: CHAT_S.text }}>
            Doubt Bot
          </span>
        </div>
        {showClose && (
          <button type="button" onClick={onClose} style={{ color: CHAT_S.muted }}>
            <FiX size={18} />
          </button>
        )}
      </div>
      {activeTitle && (
        <div style={{ padding: '8px 14px', background: 'rgba(13,140,122,0.15)', fontSize: 10, fontWeight: 700, color: '#6EE7B7' }}>
          📍 {activeTitle}
        </div>
      )}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'ai' ? 'flex-start' : 'flex-end' }}>
            <div
              style={{
                maxWidth: '88%',
                padding: '10px 12px',
                borderRadius: m.role === 'ai' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                fontSize: 12,
                lineHeight: 1.6,
                background: m.role === 'ai' ? CHAT_S.card : 'linear-gradient(135deg, #0D8C7A, #006B7A)',
                color: m.role === 'ai' ? CHAT_S.sub : '#fff',
                border: m.role === 'ai' ? `1px solid ${CHAT_S.border}` : 'none',
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
        {botLoading && (
          <div style={{ display: 'flex', gap: 4, padding: 10 }}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.12 }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: CHAT_S.accent }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-3 border-t" style={{ borderColor: CHAT_S.border }}>
        <div className="flex gap-2 items-center rounded-xl p-2" style={{ background: CHAT_S.card, border: `1px solid ${CHAT_S.border}` }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendDoubt()}
            placeholder={activeTitle ? 'Ask about this topic…' : 'Select a topic first…'}
            disabled={!activeTitle}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: CHAT_S.text }}
          />
          <button
            type="button"
            onClick={sendDoubt}
            disabled={!input.trim() || botLoading}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: 'none',
              background: input.trim() ? 'linear-gradient(135deg, #0D8C7A, #006B7A)' : 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: input.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            <FiSend size={12} color={input.trim() ? '#fff' : CHAT_S.muted} />
          </button>
        </div>
      </div>
    </>
  );
}
