'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowRight,
  FiCheckCircle,
  FiCpu,
  FiTerminal,
  FiChevronDown,
  FiChevronUp,
  FiExternalLink,
  FiGithub,
  FiBookOpen,
  FiPlayCircle,
} from 'react-icons/fi';
import { GeminiNotes } from './GeminiNotes';
import { TheoryMCQ } from './TheoryMCQ';
import { getTopicResource } from '@/lib/data/topic-resources';
import { getTopicVideoId, type VideoLanguage } from '@/lib/data/videos';
import { getTopicResourcesForId, type ResourceLink } from '@/lib/data/resources';
import { getLabForTopic } from '@/lib/data/labs';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { ChallengePayload } from '@/app/api/challenge/route';
import type { User } from 'firebase/auth';
import { ROADMAPS } from '@/lib/data/roadmaps';

export interface TopicPanelTopic {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  difficulty: string;
  keyPoints: string[];
  videoUrl?: string;
}

interface TopicPanelProps {
  topic: TopicPanelTopic | null;
  courseTitle: string;
  courseIdParam: string;
  courseSkills: string[];
  user: User | null;
  roadmapId: string;
  status: 'completed' | 'current' | 'locked';
  canMark: boolean;
  defaultLabId: string;
  onMarkComplete: () => void;
  onAskTutor: () => void;
  compact?: boolean;
}

type TabId = 'notes' | 'video' | 'resources' | 'challenge';

const DIFF_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  Beginner:     { color: '#16A34A', bg: 'rgba(34,197,94,0.1)',   label: 'Beginner' },
  Intermediate: { color: '#D97706', bg: 'rgba(245,158,11,0.1)', label: 'Intermediate' },
  Hard:         { color: '#DC2626', bg: 'rgba(239,68,68,0.1)',   label: 'Hard' },
};

const BADGE_ICONS: Record<string, string> = {
  MDN:          '🦊',
  Docs:         '📄',
  freeCodeCamp: '🏕️',
  Guide:        '📖',
  Tutorial:     '🎥',
  GFG:          '📗',
  GitHub:       '🐙',
};

function getCourseChannel(courseId: string, language: string): string {
  const l = language.toLowerCase();
  if (courseId === 'python-beginners') {
    return l === 'hindi' ? 'CodeWithHarry' : 'freeCodeCamp';
  }
  if (courseId === 'backend-django') {
    return l === 'hindi' ? 'Dennis Ivy DRF' : 'Traversy Media';
  }
  if (courseId === 'frontend-react') {
    return l === 'hindi' ? 'Codevolution' : 'Traversy Media';
  }
  if (courseId === 'dsa-interviews') {
    return l === 'hindi' ? 'Striver takeUforward' : 'NeetCode';
  }
  if (courseId === 'flutter') {
    return l === 'hindi' ? 'Rivaan Ranawat' : 'Flutter Official';
  }
  if (courseId === 'machine-learning') {
    return l === 'hindi' ? 'CampusX' : 'StatQuest';
  }
  return '';
}

// ── Skeleton Loader ──────────────────────────────────────────────────────────
function Skeleton({ lines = 4 }: { lines?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.12 }}
          style={{
            height: 14,
            borderRadius: 8,
            background: 'linear-gradient(90deg, #F5E6CC, #EDD6AA, #F5E6CC)',
            backgroundSize: '200% 100%',
            width: i % 3 === 0 ? '75%' : i % 3 === 1 ? '100%' : '88%',
          }}
        />
      ))}
      <p style={{ fontSize: 12, fontWeight: 700, color: '#0D8C7A', marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            width: 14,
            height: 14,
            border: '2px solid rgba(13,140,122,0.3)',
            borderTopColor: '#0D8C7A',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        AI is preparing your notes…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Hints Accordion ──────────────────────────────────────────────────────────
function HintsAccordion({ hints }: { hints: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderRadius: 12,
        border: '1.5px solid rgba(180,140,90,0.25)',
        overflow: 'hidden',
        marginBottom: 20,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: '#FFF8EE',
          border: 'none',
          cursor: 'pointer',
          fontSize: 12,
          fontWeight: 800,
          color: '#8B6E52',
        }}
      >
        <span>💡 Hints ({hints.length})</span>
        {open ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <ul
              style={{
                margin: 0,
                padding: '12px 16px 14px 32px',
                background: '#FFFBF5',
                listStyle: 'disc',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {hints.map((h, i) => (
                <li key={i} style={{ fontSize: 13, color: '#5C3D1E', lineHeight: 1.6 }}>
                  {h}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main TopicPanel ──────────────────────────────────────────────────────────
export default function TopicPanel({
  topic,
  courseTitle,
  courseIdParam,
  courseSkills,
  user,
  roadmapId,
  status,
  canMark,
  defaultLabId,
  onMarkComplete,
  onAskTutor,
  compact,
}: TopicPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('notes');
  const [geminiNotes, setGeminiNotes] = useState('');
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<ChallengePayload | null>(null);
  const [challengeLoading, setChallengeLoading] = useState(false);
  const [generatedChallenges, setGeneratedChallenges] = useState<any[] | null>(null);
  const [generatingChallenges, setGeneratingChallenges] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'telugu' | 'hindi' | 'english'>('english');

  // Load preferred language from localStorage first, then Firestore user profile
  useEffect(() => {
    // Load from localStorage
    const storedLang = localStorage.getItem('pathpilot_notes_language');
    if (storedLang && ['telugu', 'hindi', 'english'].includes(storedLang)) {
      setSelectedLanguage(storedLang as 'telugu' | 'hindi' | 'english');
    }
    
    // Then load from Firestore user profile
    if (!user || !db) return;
    const fetchProfile = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          const lang = data.preferredLanguage || (data.preferredLanguages && data.preferredLanguages[0]) || 'english';
          const lowerLang = lang.toLowerCase();
          if (['telugu', 'hindi', 'english'].includes(lowerLang)) {
            setSelectedLanguage(lowerLang as 'telugu' | 'hindi' | 'english');
          }
        }
      } catch (err) {
        console.warn("Failed to fetch user language preference:", err);
      }
    };
    fetchProfile();
  }, [user]);

  // Save language preference to localStorage when changed
  useEffect(() => {
    localStorage.setItem('pathpilot_notes_language', selectedLanguage);
  }, [selectedLanguage]);

  // When language changes, clear displayed notes so the right-language cache is loaded
  useEffect(() => {
    if (topic) {
      setGeminiNotes('');
      if (activeTab === 'notes') {
        setNotesLoading(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage]);

  // Reset when topic changes
  useEffect(() => {
    setActiveTab('notes');
    setChallenge(null);
    setGeneratedChallenges(null);
    setGeminiNotes('');
    setNotesError(null);
  }, [topic?.id]);

  // Fetch Gemini notes — localStorage first for instant load, then Firestore/Gemini
  useEffect(() => {
    if (activeTab !== 'notes' || !topic) return;

    // Unique key per course + topic + language — prevents cross-language cache collisions
    const localKey = `pp_notes_${courseIdParam}_${topic.id}_${selectedLanguage}`;
    const cachedRaw = localStorage.getItem(localKey);
    const isStaleCache =
      !!cachedRaw &&
      /temporarily unavailable|AI notes are temporarily|Notes unavailable right now|Gemini API error|Error details:/i.test(cachedRaw);

    const fetchNotes = async (background: boolean) => {
      console.log('[Notes] fetch start', { background, topic: topic.title, language: selectedLanguage });
      if (!background) {
        setNotesLoading(true);
        setNotesError(null);
      }

      try {
        const token = user ? await user.getIdToken() : '';
        const res = await fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            topicName: topic.title,
            courseName: courseTitle || courseIdParam,
            language:   selectedLanguage,
            courseId:   courseIdParam,
            topicId:    topic.id,
          }),
        });

        const d = await res.json();

        if (!res.ok) {
          const errMsg = d.error || 'Failed to load notes. Try again.';
          if (!background || !cachedRaw || isStaleCache) {
            setNotesError(errMsg);
            setGeminiNotes('');
          }
          return;
        }

        const text = (d.notes || d.content || '').trim();
        if (!text) {
          if (!background || !cachedRaw || isStaleCache) {
            setNotesError('Failed to load notes. Try again.');
            setGeminiNotes('');
          }
          return;
        }

        console.log(`[Notes] ${d.cached ? 'Firestore cache hit' : 'Gemini generated'} | chars=${text.length}`);
        setGeminiNotes(text);
        setNotesError(null);
        // Save to localStorage for instant access next visit
        localStorage.setItem(localKey, text);
      } catch (err) {
        console.error('[Notes] fetch failed', err);
        if (!background || !cachedRaw || isStaleCache) {
          setNotesError('Failed to load notes. Try again.');
          if (!cachedRaw || isStaleCache) setGeminiNotes('');
        }
      } finally {
        if (!background) setNotesLoading(false);
      }
    };

    // Instant load from localStorage — then background-refresh only if stale
    if (cachedRaw && !isStaleCache) {
      console.log('[Notes] localStorage HIT', localKey);
      setGeminiNotes(cachedRaw);
      setNotesLoading(false);
      setNotesError(null);
      // No background refresh needed — Firestore is the source of truth
      return;
    }

    if (isStaleCache) {
      localStorage.removeItem(localKey);
    }

    setGeminiNotes('');
    fetchNotes(false);
  }, [activeTab, topic, courseTitle, courseIdParam, selectedLanguage, user]);

  // Fetch Gemini challenge
  useEffect(() => {
    if (activeTab !== 'challenge' || !topic) return;

    const cacheKey = `pp_challenge_${courseIdParam}_${topic.id}`;
    // Remove legacy keys that caused cross-topic/course collisions
    try {
      const legacyKey = `pp_challenge_${user?.uid || 'guest'}_${topic.id}`;
      if (legacyKey !== cacheKey) localStorage.removeItem(legacyKey);
    } catch {
      /* ignore */
    }

    setChallenge(null);
    setChallengeLoading(true);

    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        setChallenge(JSON.parse(cached));
        setChallengeLoading(false);
        // Still refresh from server in background for updated prompts
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }

    const fetchChallenge = async () => {
      try {
        const token = user ? await user.getIdToken() : '';
        const res = await fetch('/api/challenge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            topicId: topic.id,
            topicName: topic.title,
            courseId: courseIdParam,
            courseName: courseTitle || courseIdParam,
          }),
        });
        const d = await res.json();
        if (d.challenge) {
          setChallenge(d.challenge);
          localStorage.setItem(cacheKey, JSON.stringify(d.challenge));
        } else if (!cached) {
          setChallenge(null);
        }
      } catch {
        if (!cached) setChallenge(null);
      } finally {
        setChallengeLoading(false);
      }
    };

    fetchChallenge();
  }, [activeTab, topic, courseTitle, courseIdParam, user]);

  const langLabels: { id: VideoLanguage; label: string; flag: string }[] = [
    { id: 'telugu', label: 'Telugu', flag: '🇮🇳' },
    { id: 'hindi', label: 'Hindi', flag: '🇮🇳' },
    { id: 'english', label: 'English', flag: '🌐' },
  ];

  // ── Empty state ────────────────────────────────────────────────────────────
  if (!topic) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
          textAlign: 'center',
          background: '#FDF6EC',
        }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          style={{ fontSize: 56, marginBottom: 16 }}
        >
          🗺️
        </motion.div>
        <p style={{ fontSize: 15, fontWeight: 800, color: '#8B6E52', marginBottom: 6 }}>
          Tap a node on the map to start
        </p>
        <p style={{ fontSize: 12, color: '#B8996E' }}>
          Select any unlocked topic to view notes, videos, and challenges
        </p>
      </div>
    );
  }

  const roadmap = ROADMAPS[roadmapId];
  const labType = roadmap?.labType || 'judge0';

  // ── Resource data ──────────────────────────────────────────────────────────
  const res = getTopicResource(topic.title);
  const pipelineResources = getTopicResourcesForId(topic.id);
  const combinedResources: ResourceLink[] = [
    ...pipelineResources,
    ...(res?.resources || []).filter(
      (r) => !pipelineResources.some((p) => p.url === r.url)
    ),
  ];

  const selectedVideoId = getTopicVideoId(
    topic.id,
    courseIdParam,
    selectedLanguage,
    topic.videoUrl
  );
  
  const buildVideoUrl = (topicName: string, courseName: string, language: string) => {
    let query = ''
    if (language === 'telugu') {
      query = `${topicName} programming tutorial Telugu`
    } else if (language === 'hindi') {
      query = `${topicName} programming tutorial Hindi`
    } else {
      query = `${topicName} ${courseName} tutorial beginners`
    }
    const encoded = encodeURIComponent(query)
    return `https://www.youtube.com/embed?listType=search&list=${encoded}`
  }

  const videoUrl = selectedVideoId 
    ? `https://www.youtube.com/embed/${selectedVideoId}?rel=0&modestbranding=1` 
    : buildVideoUrl(topic.title, courseTitle || courseIdParam, selectedLanguage);

  const challengeLabId = getLabForTopic(courseIdParam, topic.id);

  // Function to generate AI challenges
  const handleGenerateChallenges = async () => {
    if (!topic) return;
    setGeneratingChallenges(true);
    
    // Check cache first
    const cacheKey = `pp_generated_challenges_${courseIdParam}_${topic.id}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        setGeneratedChallenges(JSON.parse(cached));
        setGeneratingChallenges(false);
        return;
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }

    try {
      const token = user ? await user.getIdToken() : '';
      const res = await fetch('/api/challenges/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          topicName: topic.title,
          courseName: courseTitle || courseIdParam,
        }),
      });
      
      const data = await res.json();
      if (data.challenges) {
        setGeneratedChallenges(data.challenges);
        localStorage.setItem(cacheKey, JSON.stringify(data.challenges));
      }
    } catch (err) {
      console.error('Failed to generate challenges:', err);
    } finally {
      setGeneratingChallenges(false);
    }
  };

  const diffCfg = DIFF_CONFIG[topic.difficulty] ?? DIFF_CONFIG['Beginner'];

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'notes',     label: 'Notes',     icon: '📝' },
    { id: 'video',     label: 'Video',     icon: '🎬' },
    { id: 'resources', label: 'Resources', icon: '🔗' },
    { id: 'challenge', label: 'Challenge', icon: '⚡' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: compact ? 'auto' : '100%', minHeight: compact ? '70vh' : undefined }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: compact ? '16px 16px 14px' : '22px 26px 16px',
          borderBottom: '1px solid rgba(180,140,90,0.18)',
          background: '#fff',
        }}
      >
        <h2
          style={{
            fontSize: compact ? 19 : 23,
            fontWeight: 900,
            color: '#2C1A0E',
            margin: '0 0 10px',
            letterSpacing: '-0.03em',
            lineHeight: 1.25,
          }}
        >
          {topic.title}
        </h2>

        {/* Difficulty + Duration row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 12 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: 999,
              background: diffCfg.bg,
              color: diffCfg.color,
              border: `1.5px solid ${diffCfg.color}40`,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {diffCfg.label}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#8B6E52',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            ⏱ {topic.duration}
          </span>
          {status === 'completed' && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: 999,
                background: 'rgba(34,197,94,0.1)',
                color: '#16A34A',
                border: '1.5px solid rgba(34,197,94,0.3)',
                letterSpacing: '0.06em',
              }}
            >
              ✓ Completed
            </span>
          )}
        </div>

        {/* Skill tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {(topic.keyPoints.length ? topic.keyPoints : courseSkills.slice(0, 5)).map((kp) => (
            <span
              key={kp}
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 8,
                background: 'rgba(13,140,122,0.07)',
                color: '#0D8C7A',
                border: '1px solid rgba(13,140,122,0.2)',
                letterSpacing: '0.02em',
              }}
            >
              {kp}
            </span>
          ))}
        </div>
      </div>

      {/* ── Tab Bar ────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid rgba(180,140,90,0.18)',
          background: '#FFF8EE',
          overflowX: 'auto',
          flexShrink: 0,
          scrollbarWidth: 'none',
        }}
      >
        {tabs.map(({ id, label, icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            style={{
              flex: 1,
              flexShrink: 0,
              padding: '13px 8px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              color: activeTab === id ? '#0D8C7A' : '#B8996E',
              borderBottom: activeTab === id ? '2.5px solid #0D8C7A' : '2.5px solid transparent',
              transition: 'color 0.18s, border-color 0.18s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <span style={{ fontSize: 16 }}>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab Content ────────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: compact ? 16 : 24,
          background: '#FDF6EC',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(180,140,90,0.3) transparent',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >

            {/* NOTES TAB */}
            {activeTab === 'notes' && (
              <>
                {/* Language Selector */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                  {[
                    { id: 'english' as const, label: 'English', flag: '🌐' },
                    { id: 'hindi' as const, label: 'Hindi', flag: '🇮🇳' },
                    { id: 'telugu' as const, label: 'Telugu', flag: '🇮🇳' },
                  ].map(({ id, label, flag }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedLanguage(id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 20,
                        border: selectedLanguage === id ? '1.5px solid #0D8C7A' : '1.5px solid rgba(180,140,90,0.2)',
                        background: selectedLanguage === id ? 'rgba(13,140,122,0.1)' : '#fff',
                        color: selectedLanguage === id ? '#0D8C7A' : '#8B6E52',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <span>{flag}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>

                {notesLoading && !geminiNotes ? (
                  <Skeleton lines={6} />
                ) : notesError && !geminiNotes ? (
                  <div style={{ textAlign: 'center', padding: '24px 12px' }}>
                    <p style={{ color: '#DC2626', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>{notesError}</p>
                    <button
                      type="button"
                      onClick={async () => {
                        const localKey = `pp_notes_${courseIdParam}_${topic.id}_${selectedLanguage}`;
                        localStorage.removeItem(localKey);
                        setGeminiNotes('');
                        setNotesError(null);
                        setNotesLoading(true);
                        const token = user ? await user.getIdToken() : '';
                        fetch('/api/notes', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            ...(token ? { Authorization: `Bearer ${token}` } : {}),
                          },
                          body: JSON.stringify({
                            topicName: topic.title,
                            courseName: courseTitle || courseIdParam,
                            language:   selectedLanguage,
                            courseId:   courseIdParam,
                            topicId:    topic.id,
                          }),
                        })
                          .then(async (res) => {
                            const d = await res.json();
                            if (res.ok && (d.notes || d.content)) {
                              const text = (d.notes || d.content).trim();
                              setGeminiNotes(text);
                              setNotesError(null);
                              localStorage.setItem(localKey, text);
                            } else {
                              setNotesError(d.error || 'Failed to load notes. Try again.');
                            }
                          })
                          .catch(() => setNotesError('Failed to load notes. Try again.'))
                          .finally(() => setNotesLoading(false));
                      }}
                      style={{
                        padding: '10px 18px',
                        background: '#0D8C7A',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 10,
                        fontWeight: 800,
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      Retry
                    </button>
                  </div>
                ) : geminiNotes ? (
                  <>
                    {notesLoading && (
                      <p style={{ fontSize: 11, color: '#8B6E52', fontWeight: 600, marginBottom: 8 }}>
                        Refreshing notes…
                      </p>
                    )}
                    <GeminiNotes markdown={geminiNotes} />
                  </>
                ) : (
                  <p style={{ color: '#8B6E52', fontSize: 14 }}>Select this topic to load AI notes.</p>
                )}
              </>
            )}

            {/* VIDEO TAB */}
            {activeTab === 'video' && (
              <div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                  {langLabels.map(({ id, label, flag }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedLanguage(id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 20,
                        border: selectedLanguage === id ? '1.5px solid #0D8C7A' : '1.5px solid rgba(180,140,90,0.2)',
                        background: selectedLanguage === id ? 'rgba(13,140,122,0.1)' : '#fff',
                        color: selectedLanguage === id ? '#0D8C7A' : '#8B6E52',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <span>{flag}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
                <div>
                  <iframe
                    key={videoUrl}
                    src={videoUrl}
                    width="100%"
                    height="380"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ borderRadius: '12px', border: 'none' }}
                  />
                  <p style={{ fontSize: '12px', color: '#888', marginTop: '8px', textAlign: 'center' }}>
                    Showing YouTube results for: {topic.title} in {selectedLanguage}
                  </p>
                </div>
              </div>
            )}

            {/* RESOURCES TAB */}
            {activeTab === 'resources' && (
              <div>
                {combinedResources.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {combinedResources.map((link, i) => (
                      <motion.a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.01, y: -1 }}
                        whileTap={{ scale: 0.99 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '14px 16px',
                          background: '#fff',
                          border: '1.5px solid rgba(180,140,90,0.22)',
                          borderRadius: 14,
                          textDecoration: 'none',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        }}
                      >
                        <span style={{ fontSize: 22, flexShrink: 0 }}>
                          {BADGE_ICONS[link.badge] || '🔗'}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 800,
                              color: '#2C1A0E',
                              marginBottom: 2,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {link.title}
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: '#0D8C7A',
                              background: 'rgba(13,140,122,0.08)',
                              border: '1px solid rgba(13,140,122,0.2)',
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: 6,
                            }}
                          >
                            {link.badge}
                          </div>
                        </div>
                        <FiExternalLink size={14} style={{ color: '#B8996E', flexShrink: 0 }} />
                      </motion.a>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: 48,
                      color: '#8B6E52',
                      background: '#fff',
                      borderRadius: 16,
                      border: '2px dashed rgba(180,140,90,0.3)',
                    }}
                  >
                    <div style={{ fontSize: 40, marginBottom: 10 }}>🔗</div>
                    <p style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>Resources coming soon</p>
                    <p style={{ fontSize: 12, color: '#B8996E' }}>Curated links will appear here</p>
                  </div>
                )}
              </div>
            )}

            {/* CHALLENGE TAB */}
            {activeTab === 'challenge' && (
              <div>
                {labType === 'colab' && (
                  <div style={{ padding: 48, textAlign: 'center', background: '#fff', borderRadius: 16 }}>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>📊</div>
                    <h3 style={{ marginBottom: 8, color: '#2C1A0E' }}>Data Science Environment</h3>
                    <p style={{ marginBottom: 20, color: '#8B6E52', fontSize: 14 }}>Practice this topic using Google Colab's cloud notebooks.</p>
                    <a href={"https://colab.research.google.com/search?q=" + encodeURIComponent(topic.title)} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '12px 24px', background: '#F9AB00', color: '#fff', borderRadius: 8, fontWeight: 'bold', textDecoration: 'none' }}>
                      Open in Google Colab →
                    </a>
                  </div>
                )}
                {labType === 'tryhackme' && (
                  <div style={{ padding: 48, textAlign: 'center', background: '#fff', borderRadius: 16 }}>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>🔐</div>
                    <h3 style={{ marginBottom: 8, color: '#2C1A0E' }}>Cybersecurity Practice</h3>
                    <p style={{ marginBottom: 20, color: '#8B6E52', fontSize: 14 }}>Get hands-on experience in a real vulnerable environment.</p>
                    <a href={"https://tryhackme.com/search?q=" + encodeURIComponent(topic.title)} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '12px 24px', background: '#212C42', color: '#fff', borderRadius: 8, fontWeight: 'bold', textDecoration: 'none' }}>
                      Practice on TryHackMe (Free) →
                    </a>
                  </div>
                )}
                {labType === 'dartpad' && (
                  <div style={{ width: '100%', height: 600, borderRadius: 12, overflow: 'hidden' }}>
                    <iframe src="https://dartpad.dev/embed-flutter.html?theme=dark" width="100%" height="100%" style={{ border: 'none' }} />
                  </div>
                )}
                {labType === 'remix' && (
                  <div style={{ width: '100%', height: 600, borderRadius: 12, overflow: 'hidden' }}>
                    <iframe src="https://remix.ethereum.org" width="100%" height="100%" style={{ border: 'none' }} />
                  </div>
                )}
                {labType === 'codesandbox' && (
                  <div style={{ width: '100%', height: 600, borderRadius: 12, overflow: 'hidden' }}>
                    <iframe src="https://codesandbox.io/embed/new?template=react&theme=dark" width="100%" height="100%" style={{ border: 'none' }} />
                  </div>
                )}
                {labType === 'theory' && (
                  <div style={{ padding: 24, background: '#fff', borderRadius: 16 }}>
                    <h3 style={{ marginBottom: 8, color: '#2C1A0E' }}>Theory Check</h3>
                    <p style={{ marginBottom: 20, color: '#8B6E52', fontSize: 14 }}>Complete these 5 MCQs to pass this topic (Requires 3/5).</p>
                    <TheoryMCQ topicName={topic.title} courseName={courseTitle || courseIdParam} onPass={onMarkComplete} />
                  </div>
                )}
                {labType === 'judge0' && (
<>
                {challengeLoading ? (
                  <Skeleton lines={5} />
                ) : challenge ? (
                  <div>
                    {/* Challenge card */}
                    <div
                      style={{
                        padding: 20,
                        background: '#fff',
                        borderRadius: 16,
                        border: '2px solid rgba(13,140,122,0.18)',
                        boxShadow: '0 4px 16px rgba(13,140,122,0.07)',
                        marginBottom: 12,
                      }}
                    >
                      {/* Difficulty + label row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            padding: '3px 10px',
                            borderRadius: 999,
                            background:
                              challenge.difficulty === 'Hard'
                                ? 'rgba(239,68,68,0.1)'
                                : challenge.difficulty === 'Medium'
                                  ? 'rgba(245,158,11,0.1)'
                                  : 'rgba(34,197,94,0.1)',
                            color:
                              challenge.difficulty === 'Hard'
                                ? '#DC2626'
                                : challenge.difficulty === 'Medium'
                                  ? '#D97706'
                                  : '#16A34A',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                          }}
                        >
                          {challenge.difficulty}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#8B6E52', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          ⚡ Coding Challenge
                        </span>
                      </div>

                      <h3
                        style={{
                          fontSize: 18,
                          fontWeight: 900,
                          color: '#2C1A0E',
                          margin: '0 0 10px',
                          lineHeight: 1.3,
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {challenge.title}
                      </h3>

                      <p style={{ fontSize: 14, color: '#5C3D1E', lineHeight: 1.7, marginBottom: 14 }}>
                        {challenge.description}
                      </p>

                      {/* Expected output box */}
                      <div
                        style={{
                          padding: '12px 14px',
                          background: '#FDF6EC',
                          borderRadius: 10,
                          border: '1px solid rgba(180,140,90,0.25)',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#5C3D1E',
                          marginBottom: 16,
                          fontFamily: 'monospace',
                        }}
                      >
                        <span style={{ fontWeight: 800, fontFamily: 'inherit' }}>Expected output: </span>
                        {(challenge as any).expectedOutput || (challenge.examples && challenge.examples[0] ? challenge.examples[0].output : 'N/A')}
                      </div>

                      {/* Hints accordion */}
                      {challenge.hints.length > 0 && (
                        <HintsAccordion hints={challenge.hints} />
                      )}

                      {/* Open in Lab button */}
                      <motion.a
                        href={`/labs/${challengeLabId}?challenge=true&courseId=${encodeURIComponent(courseIdParam)}&topicId=${encodeURIComponent(topic.id)}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '13px 22px',
                          background: 'linear-gradient(135deg, #0D8C7A, #006B7A)',
                          color: '#fff',
                          borderRadius: 12,
                          fontWeight: 800,
                          fontSize: 13,
                          textDecoration: 'none',
                          boxShadow: '0 4px 14px rgba(13,140,122,0.3)',
                          letterSpacing: '0.01em',
                        }}
                      >
                        <FiTerminal size={16} />
                        Open in Lab
                        <FiArrowRight size={14} />
                      </motion.a>
                    </div>
                  </div>
                ) : user ? (
                  <div>
                    {generatingChallenges ? (
                      <div style={{ textAlign: 'center', padding: 48 }}>
                        <Skeleton lines={5} />
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#0D8C7A', marginTop: 16 }}>
                          Generating AI challenges...
                        </p>
                      </div>
                    ) : generatedChallenges && generatedChallenges.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <p style={{ fontSize: 13, fontWeight: 800, color: '#2C1A0E', marginBottom: 8 }}>
                          AI-Generated Challenges for {topic.title}
                        </p>
                        {generatedChallenges.map((c: any, idx: number) => (
                          <div
                            key={idx}
                            style={{
                              padding: 20,
                              background: '#fff',
                              borderRadius: 16,
                              border: '2px solid rgba(13,140,122,0.18)',
                              boxShadow: '0 4px 16px rgba(13,140,122,0.07)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 800,
                                  padding: '3px 10px',
                                  borderRadius: 999,
                                  background:
                                    c.difficulty === 'Hard'
                                      ? 'rgba(239,68,68,0.1)'
                                      : c.difficulty === 'Medium'
                                        ? 'rgba(245,158,11,0.1)'
                                        : 'rgba(34,197,94,0.1)',
                                  color:
                                    c.difficulty === 'Hard'
                                      ? '#DC2626'
                                      : c.difficulty === 'Medium'
                                        ? '#D97706'
                                        : '#16A34A',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.08em',
                                }}
                              >
                                {c.difficulty}
                              </span>
                              <span style={{ fontSize: 10, fontWeight: 700, color: '#8B6E52', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                ⚡ Challenge {idx + 1}
                              </span>
                            </div>

                            <h3
                              style={{
                                fontSize: 16,
                                fontWeight: 900,
                                color: '#2C1A0E',
                                margin: '0 0 8px',
                                lineHeight: 1.3,
                                letterSpacing: '-0.02em',
                              }}
                            >
                              {c.title}
                            </h3>

                            <p style={{ fontSize: 13, color: '#5C3D1E', lineHeight: 1.6, marginBottom: 12 }}>
                              {c.description}
                            </p>

                            <pre
                              style={{
                                padding: '12px',
                                background: '#FDF6EC',
                                borderRadius: 8,
                                border: '1px solid rgba(180,140,90,0.25)',
                                fontSize: 11,
                                color: '#5C3D1E',
                                marginBottom: 12,
                                overflowX: 'auto',
                                fontFamily: 'ui-monospace, monospace',
                              }}
                            >
                              {c.starterCode}
                            </pre>
                          </div>
                        ))}
                        <motion.button
                          type="button"
                          onClick={() => {
                            const cacheKey = `pp_generated_challenges_${courseIdParam}_${topic.id}`;
                            localStorage.removeItem(cacheKey);
                            setGeneratedChallenges(null);
                            handleGenerateChallenges();
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          style={{
                            padding: '10px 20px',
                            background: 'rgba(13,140,122,0.1)',
                            color: '#0D8C7A',
                            border: '1.5px solid rgba(13,140,122,0.3)',
                            borderRadius: 10,
                            fontWeight: 700,
                            fontSize: 12,
                            cursor: 'pointer',
                            alignSelf: 'center',
                          }}
                        >
                          Regenerate Challenges
                        </motion.button>
                      </div>
                    ) : (
                      <div
                        style={{
                          textAlign: 'center',
                          padding: 48,
                          color: '#8B6E52',
                          background: '#fff',
                          borderRadius: 16,
                          border: '2px dashed rgba(180,140,90,0.3)',
                        }}
                      >
                        <div style={{ fontSize: 40, marginBottom: 10 }}>⚡</div>
                        <p style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>Generate AI Challenges</p>
                        <p style={{ fontSize: 12, color: '#B8996E', marginBottom: 16 }}>Get 3 personalized coding challenges for this topic</p>
                        <motion.button
                          type="button"
                          onClick={handleGenerateChallenges}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          style={{
                            padding: '12px 24px',
                            background: '#0D8C7A',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 10,
                            fontWeight: 800,
                            fontSize: 13,
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(13,140,122,0.3)',
                          }}
                        >
                          Generate Challenges
                        </motion.button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: 48,
                      color: '#8B6E52',
                      background: '#fff',
                      borderRadius: 16,
                      border: '2px dashed rgba(180,140,90,0.3)',
                    }}
                  >
                    <div style={{ fontSize: 40, marginBottom: 10 }}>⚡</div>
                    <p style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>Please sign in to generate AI-powered coding challenges</p>
                    <p style={{ fontSize: 12, color: '#B8996E' }}>Sign in to unlock interactive coding challenges for this topic</p>
                  </div>
                )}
              </>
            )}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: '14px 16px',
          borderTop: '1px solid rgba(180,140,90,0.18)',
          background: '#fff',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          flexShrink: 0,
        }}
      >
        {/* Ask AI Tutor */}
        <motion.button
          type="button"
          onClick={onAskTutor}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{
            flex: 1,
            minWidth: 140,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '13px 16px',
            background: 'rgba(13,140,122,0.08)',
            border: '1.5px solid rgba(13,140,122,0.28)',
            borderRadius: 12,
            color: '#0D8C7A',
            fontWeight: 800,
            fontSize: 12,
            cursor: 'pointer',
            letterSpacing: '0.01em',
          }}
        >
          <FiCpu size={16} />
          Ask AI Tutor
        </motion.button>

        {/* Mark Complete / Completed */}
        {status === 'completed' ? (
          <div
            style={{
              flex: 1,
              minWidth: 140,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '13px 16px',
              background: 'rgba(34,197,94,0.08)',
              border: '1.5px solid rgba(34,197,94,0.28)',
              borderRadius: 12,
              color: '#16A34A',
              fontWeight: 800,
              fontSize: 12,
            }}
          >
            <FiCheckCircle size={16} />
            Completed
          </div>
        ) : (
          <motion.button
            type="button"
            disabled={!canMark}
            onClick={onMarkComplete}
            whileHover={canMark ? { scale: 1.02 } : {}}
            whileTap={canMark ? { scale: 0.97 } : {}}
            style={{
              flex: 1,
              minWidth: 140,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '13px 16px',
              background: canMark
                ? 'linear-gradient(135deg, #22C55E, #16A34A)'
                : '#E5E7EB',
              border: 'none',
              borderRadius: 12,
              color: canMark ? '#fff' : '#9CA3AF',
              fontWeight: 800,
              fontSize: 12,
              cursor: canMark ? 'pointer' : 'not-allowed',
              boxShadow: canMark ? '0 4px 14px rgba(34,197,94,0.28)' : 'none',
              letterSpacing: '0.01em',
            }}
          >
            Mark Complete
            <FiArrowRight size={15} />
          </motion.button>
        )}
      </div>
    </div>
  );
}
