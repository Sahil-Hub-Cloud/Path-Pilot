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
} from 'react-icons/fi';
import { GeminiNotes } from './GeminiNotes';
import { getTopicResource, getCourseVideo } from '@/lib/data/topic-resources';
import type { ChallengePayload } from '@/app/api/challenge/route';
import type { User } from 'firebase/auth';

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
};

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
      <p style={{ fontSize: 11, fontWeight: 700, color: '#B8996E', marginTop: 6 }}>
        ✨ Generating with Gemini…
      </p>
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
  const [challenge, setChallenge] = useState<ChallengePayload | null>(null);
  const [challengeLoading, setChallengeLoading] = useState(false);

  // Reset when topic changes
  useEffect(() => {
    setActiveTab('notes');
    setChallenge(null);
    setGeminiNotes('');
  }, [topic?.id]);

  // Fetch Gemini notes
  useEffect(() => {
    if (activeTab !== 'notes' || !topic) return;

    const cacheKey = `pp_notes_${user?.uid || 'guest'}_${topic.id}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setGeminiNotes(cached);
      setNotesLoading(false);
      return;
    }

    setGeminiNotes('');
    setNotesLoading(true);

    const fetchNotes = async () => {
      try {
        const token = user ? await user.getIdToken() : '';
        const res = await fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ topicName: topic.title, courseName: courseTitle }),
        });
        const d = await res.json();
        if (d.notes) {
          setGeminiNotes(d.notes);
          localStorage.setItem(cacheKey, d.notes);
        } else {
          setGeminiNotes('Could not load notes at this time.');
        }
      } catch {
        setGeminiNotes('Failed to connect to the notes service.');
      } finally {
        setNotesLoading(false);
      }
    };

    fetchNotes();
  }, [activeTab, topic, courseTitle, user]);

  // Fetch Gemini challenge
  useEffect(() => {
    if (activeTab !== 'challenge' || !topic) return;

    const cacheKey = `pp_challenge_${user?.uid || 'guest'}_${topic.id}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        setChallenge(JSON.parse(cached));
        setChallengeLoading(false);
        return;
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }

    setChallenge(null);
    setChallengeLoading(true);

    const fetchChallenge = async () => {
      try {
        const token = user ? await user.getIdToken() : '';
        if (!token) {
          setChallenge({
            title: `${topic.title} Practice`,
            description: 'Sign in to generate AI-powered challenges.',
            expectedOutput: 'N/A',
            hints: [],
            difficulty: 'Medium',
          });
          return;
        }
        const res = await fetch('/api/challenge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ topicName: topic.title, courseName: courseTitle }),
        });
        const d = await res.json();
        if (d.challenge) {
          setChallenge(d.challenge);
          localStorage.setItem(cacheKey, JSON.stringify(d.challenge));
        } else {
          setChallenge(null);
        }
      } catch {
        setChallenge(null);
      } finally {
        setChallengeLoading(false);
      }
    };

    fetchChallenge();
  }, [activeTab, topic, courseTitle, user]);

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

  // ── Resource data ──────────────────────────────────────────────────────────
  const res = getTopicResource(topic.title);
  const videoEmbed = topic.videoUrl
    ? topic.videoUrl
    : res?.videoId
      ? `https://www.youtube.com/embed/${res.videoId}?rel=0&modestbranding=1`
      : `https://www.youtube.com/embed/${getCourseVideo(courseIdParam)}?rel=0&modestbranding=1`;

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
                {notesLoading ? (
                  <Skeleton lines={6} />
                ) : geminiNotes ? (
                  <GeminiNotes markdown={geminiNotes} />
                ) : (
                  <p style={{ color: '#8B6E52', fontSize: 14 }}>Notes will appear here.</p>
                )}
              </>
            )}

            {/* VIDEO TAB */}
            {activeTab === 'video' && (
              <div>
                {videoEmbed ? (
                  <>
                    <div
                      style={{
                        borderRadius: 16,
                        overflow: 'hidden',
                        border: '2px solid rgba(180,140,90,0.2)',
                        aspectRatio: '16/9',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      }}
                    >
                      <iframe
                        src={videoEmbed}
                        title={topic.title}
                        allowFullScreen
                        style={{ width: '100%', height: '100%', border: 'none' }}
                      />
                    </div>
                    <div
                      style={{
                        marginTop: 12,
                        padding: '10px 14px',
                        background: '#fff',
                        borderRadius: 10,
                        border: '1px solid rgba(180,140,90,0.18)',
                      }}
                    >
                      <p style={{ fontSize: 13, fontWeight: 800, color: '#2C1A0E', margin: '0 0 2px' }}>
                        {topic.title}
                      </p>
                      <p style={{ fontSize: 11, color: '#8B6E52', margin: 0 }}>
                        YouTube · Educational Video
                      </p>
                    </div>
                  </>
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
                    <div style={{ fontSize: 40, marginBottom: 10 }}>🎬</div>
                    <p style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>Video coming soon</p>
                    <p style={{ fontSize: 12, color: '#B8996E' }}>Check back later for video content</p>
                  </div>
                )}
              </div>
            )}

            {/* RESOURCES TAB */}
            {activeTab === 'resources' && (
              <div>
                {(res?.resources || []).length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {res!.resources.map((link, i) => (
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
                        {challenge.expectedOutput}
                      </div>

                      {/* Hints accordion */}
                      {challenge.hints.length > 0 && (
                        <HintsAccordion hints={challenge.hints} />
                      )}

                      {/* Open in Lab button */}
                      <motion.a
                        href={`/labs/${defaultLabId}`}
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
                    <p style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>Challenge coming soon</p>
                    <p style={{ fontSize: 12, color: '#B8996E' }}>Sign in to generate AI challenges</p>
                  </div>
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
