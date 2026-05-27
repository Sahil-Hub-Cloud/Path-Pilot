'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle, FiCpu, FiTerminal } from 'react-icons/fi';
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

  useEffect(() => {
    setActiveTab('notes');
    setChallenge(null);
    setGeminiNotes('');
  }, [topic?.id]);

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
            description: 'Sign in to generate AI challenges.',
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

  if (!topic) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#8B6E52',
          padding: 32,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 12 }}>🗺️</div>
        <p style={{ fontSize: 14, fontWeight: 800 }}>Tap a node on the map to start learning</p>
      </div>
    );
  }

  const res = getTopicResource(topic.title);
  const videoEmbed = topic.videoUrl
    ? topic.videoUrl
    : res?.videoId
      ? `https://www.youtube.com/embed/${res.videoId}?rel=0&modestbranding=1`
      : `https://www.youtube.com/embed/${getCourseVideo(courseIdParam)}?rel=0&modestbranding=1`;

  const diffColor =
    topic.difficulty === 'Hard' ? '#EF4444' : topic.difficulty === 'Intermediate' ? '#F59E0B' : '#22C55E';

  const tabs: [TabId, string][] = [
    ['notes', '📝 Notes'],
    ['video', '🎬 Video'],
    ['resources', '🔗 Resources'],
    ['challenge', '⚡ Challenge'],
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: compact ? 'auto' : '100%', minHeight: compact ? '70vh' : undefined }}>
      <div style={{ padding: compact ? '16px 16px 12px' : '20px 24px 16px', borderBottom: '1px solid rgba(180,140,90,0.2)', background: '#fff' }}>
        <h2 style={{ fontSize: compact ? 18 : 22, fontWeight: 900, color: '#2C1A0E', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          {topic.title}
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: 999,
              background: `${diffColor}18`,
              color: diffColor,
              textTransform: 'uppercase',
            }}
          >
            {topic.difficulty}
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#8B6E52' }}>⏱ {topic.duration}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
          {(topic.keyPoints.length ? topic.keyPoints : courseSkills.slice(0, 4)).map((kp) => (
            <span
              key={kp}
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 8,
                background: 'rgba(13,140,122,0.08)',
                color: '#0D8C7A',
                border: '1px solid rgba(13,140,122,0.2)',
              }}
            >
              {kp}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 4,
          padding: '0 12px',
          borderBottom: '1px solid rgba(180,140,90,0.2)',
          background: '#FFF8EE',
          overflowX: 'auto',
        }}
      >
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            style={{
              flexShrink: 0,
              padding: '12px 14px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 10,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: activeTab === id ? '#0D8C7A' : '#8B6E52',
              borderBottom: activeTab === id ? '2px solid #0D8C7A' : '2px solid transparent',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: compact ? 16 : 24, background: '#FDF6EC' }}>
        {activeTab === 'notes' && (
          <>
            {notesLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-amber-100 rounded w-3/4" />
                <div className="h-4 bg-amber-100 rounded w-full" />
                <div className="h-4 bg-amber-100 rounded w-5/6" />
                <p style={{ fontSize: 11, fontWeight: 700, color: '#8B6E52', marginTop: 12 }}>Generating notes…</p>
              </div>
            ) : geminiNotes ? (
              <GeminiNotes markdown={geminiNotes} />
            ) : (
              <p style={{ color: '#8B6E52', fontSize: 14 }}>Notes will appear here.</p>
            )}
          </>
        )}

        {activeTab === 'video' && (
          <div>
            {videoEmbed ? (
              <>
                <div style={{ borderRadius: 16, overflow: 'hidden', border: '2px solid rgba(180,140,90,0.2)', aspectRatio: '16/9' }}>
                  <iframe src={videoEmbed} title={topic.title} allowFullScreen style={{ width: '100%', height: '100%', border: 'none' }} />
                </div>
                <p style={{ marginTop: 12, fontSize: 12, fontWeight: 600, color: '#8B6E52' }}>
                  {topic.title} · YouTube
                </p>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: 40, color: '#8B6E52' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🎬</div>
                <p style={{ fontWeight: 800, fontSize: 13 }}>Video coming soon</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'resources' && (
          <div>
            {(res?.resources || []).length > 0 ? (
              res!.resources.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: 14,
                    marginBottom: 10,
                    background: '#fff',
                    border: '1.5px solid rgba(180,140,90,0.25)',
                    borderRadius: 12,
                    textDecoration: 'none',
                  }}
                >
                  <span style={{ fontSize: 20 }}>🔗</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#2C1A0E' }}>{link.title}</div>
                    <div style={{ fontSize: 10, color: '#8B6E52', marginTop: 2 }}>{link.badge}</div>
                  </div>
                </a>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: 40, color: '#8B6E52' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🔗</div>
                <p style={{ fontWeight: 800, fontSize: 13 }}>Resources coming soon</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'challenge' && (
          <div>
            {challengeLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-5 bg-amber-100 rounded w-2/3" />
                <div className="h-20 bg-amber-100 rounded" />
                <p style={{ fontSize: 11, fontWeight: 700, color: '#8B6E52' }}>Generating challenge…</p>
              </div>
            ) : challenge ? (
              <div
                style={{
                  padding: 20,
                  background: '#fff',
                  borderRadius: 16,
                  border: '2px solid rgba(13,140,122,0.2)',
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 800, color: '#0D8C7A', textTransform: 'uppercase', marginBottom: 8 }}>
                  {challenge.difficulty} · Coding Challenge
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#2C1A0E', marginBottom: 12 }}>{challenge.title}</h3>
                <p style={{ fontSize: 14, color: '#5C3D1E', lineHeight: 1.65, marginBottom: 16 }}>{challenge.description}</p>
                <div
                  style={{
                    padding: 12,
                    background: '#FDF6EC',
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#5C3D1E',
                    marginBottom: 16,
                  }}
                >
                  <strong>Expected output:</strong> {challenge.expectedOutput}
                </div>
                {challenge.hints.length > 0 && (
                  <ul style={{ margin: '0 0 20px', paddingLeft: 18, fontSize: 13, color: '#8B6E52' }}>
                    {challenge.hints.map((h, i) => (
                      <li key={i} style={{ marginBottom: 6 }}>
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                <a
                  href={`/labs/${defaultLabId}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #0D8C7A, #006B7A)',
                    color: '#fff',
                    borderRadius: 12,
                    fontWeight: 800,
                    fontSize: 13,
                    textDecoration: 'none',
                  }}
                >
                  <FiTerminal size={16} /> Open in Lab
                </a>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 40, color: '#8B6E52' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>⚡</div>
                <p style={{ fontWeight: 800, fontSize: 13 }}>Challenge coming soon</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div
        style={{
          padding: 16,
          borderTop: '1px solid rgba(180,140,90,0.2)',
          background: '#fff',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <button
          type="button"
          onClick={onAskTutor}
          style={{
            flex: 1,
            minWidth: 140,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '12px 16px',
            background: 'rgba(13,140,122,0.1)',
            border: '1.5px solid rgba(13,140,122,0.3)',
            borderRadius: 12,
            color: '#0D8C7A',
            fontWeight: 800,
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          <FiCpu size={16} /> Ask AI Tutor
        </button>
        {status === 'completed' ? (
          <div
            style={{
              flex: 1,
              minWidth: 140,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 16px',
              background: 'rgba(34,197,94,0.1)',
              border: '1.5px solid rgba(34,197,94,0.3)',
              borderRadius: 12,
              color: '#16A34A',
              fontWeight: 800,
              fontSize: 12,
            }}
          >
            <FiCheckCircle size={16} /> Completed
          </div>
        ) : (
          <motion.button
            type="button"
            disabled={!canMark}
            onClick={onMarkComplete}
            whileHover={canMark ? { scale: 1.02 } : {}}
            whileTap={canMark ? { scale: 0.98 } : {}}
            style={{
              flex: 1,
              minWidth: 140,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 16px',
              background: canMark ? 'linear-gradient(135deg, #22C55E, #16A34A)' : '#E5E7EB',
              border: 'none',
              borderRadius: 12,
              color: canMark ? '#fff' : '#9CA3AF',
              fontWeight: 800,
              fontSize: 12,
              cursor: canMark ? 'pointer' : 'not-allowed',
            }}
          >
            Mark Complete <FiArrowRight size={16} />
          </motion.button>
        )}
      </div>
    </div>
  );
}
