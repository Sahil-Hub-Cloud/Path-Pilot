'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiLock, FiPlay } from 'react-icons/fi';

export type NodeStatus = 'completed' | 'current' | 'locked';

export interface MapTopic {
  id: string;
  title: string;
  duration: string;
  difficulty: string;
  globalIndex: number;
}

export interface MapChapter {
  id: string;
  title: string;
  chapterNumber: number;
  topics: MapTopic[];
}

interface GameMapProps {
  chapters: MapChapter[];
  courseIcon: string;
  activeTopicId: string | null;
  completedIds: Set<string>;
  getStatus: (topicId: string, globalIndex: number) => NodeStatus;
  onSelectTopic: (topicId: string) => void;
  recentlyUnlockedId?: string | null;
}

// Cycling emojis for chapter banners — gives each chapter a unique feel
const CHAPTER_EMOJIS = ['🎯', '🚀', '📦', '🔥', '💡', '⚡', '🌟', '🏆', '🧠', '🎓', '🔮', '🛠️'];

// Zigzag positions as % from left
const ZIGZAG = [14, 50, 86] as const;

// ── Path Connector ──────────────────────────────────────────────────────────
function PathConnector({ completed, fromAlign, toAlign }: { completed: boolean; fromAlign: number; toAlign: number }) {
  const color = completed ? '#22C55E' : '#D1D5DB';
  const opacity = completed ? 1 : 0.55;

  // If nodes are on different sides, draw a diagonal-ish connector
  // using a thin SVG so it feels more like a game map path
  const isDiagonal = fromAlign !== toAlign;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: isDiagonal ? 48 : 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
      }}
    >
      {/* Dots drawn as a series of small circles */}
      {Array.from({ length: 5 }).map((_, i) => {
        const pct = i / 4;
        // Interpolate x from fromAlign% to toAlign% of 260px panel
        const x = fromAlign + (toAlign - fromAlign) * pct;
        const y = (isDiagonal ? 48 : 40) * pct;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: y,
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: color,
              transform: 'translate(-50%, 0)',
              transition: 'background 0.4s ease',
            }}
          />
        );
      })}
    </div>
  );
}

// ── Map Node ────────────────────────────────────────────────────────────────
function MapNode({
  status,
  isActive,
  title,
  onClick,
  bounce,
  nodeRef,
}: {
  status: NodeStatus;
  isActive: boolean;
  title: string;
  onClick: () => void;
  bounce?: boolean;
  nodeRef?: React.RefObject<HTMLButtonElement | null>;
}) {
  const locked = status === 'locked';
  const done = status === 'completed';
  const current = status === 'current' || isActive;

  const size = current ? 72 : 64;

  const bg = done
    ? 'linear-gradient(135deg, #22C55E, #16A34A)'
    : current
      ? 'linear-gradient(135deg, #0D8C7A, #006B7A)'
      : '#E5E7EB';

  const shadow = done
    ? '0 0 0 5px rgba(34,197,94,0.18), 0 8px 24px rgba(34,197,94,0.30)'
    : current
      ? '0 0 0 6px rgba(13,140,122,0.22), 0 8px 28px rgba(13,140,122,0.32)'
      : '0 2px 8px rgba(0,0,0,0.08)';

  return (
    <motion.button
      ref={nodeRef as React.RefObject<HTMLButtonElement>}
      type="button"
      disabled={locked}
      onClick={locked ? undefined : onClick}
      animate={bounce ? { scale: [1, 1.18, 0.95, 1.05, 1], y: [0, -8, 2, -4, 0] } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      whileHover={!locked ? { scale: 1.06, y: -2 } : {}}
      whileTap={!locked ? { scale: 0.94 } : {}}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: 'none',
        background: 'transparent',
        cursor: locked ? 'not-allowed' : 'pointer',
        opacity: locked ? 0.55 : 1,
        padding: 0,
        position: 'relative',
        outline: 'none',
      }}
    >
      {/* Outer pulsing ring for active/current node */}
      {current && (
        <motion.span
          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: size + 18,
            height: size + 18,
            borderRadius: '50%',
            border: '3px solid #0D8C7A',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Inner second ring for active node */}
      {current && (
        <motion.span
          animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.05, 0.4] }}
          transition={{ repeat: Infinity, duration: 2.2, delay: 0.5, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: size + 32,
            height: size + 32,
            borderRadius: '50%',
            border: '2px solid #0D8C7A',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Node circle */}
      <motion.div
        initial={false}
        animate={{ scale: 1 }}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: bg,
          boxShadow: shadow,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: locked ? '#9CA3AF' : '#fff',
          fontSize: done ? 28 : locked ? 20 : 24,
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {done ? (
          <FiCheck size={30} strokeWidth={3} />
        ) : locked ? (
          <FiLock size={22} />
        ) : (
          <FiPlay size={22} style={{ marginLeft: 3 }} />
        )}
      </motion.div>

      {/* Topic label */}
      <div
        style={{
          marginTop: 9,
          maxWidth: 96,
          fontSize: 11,
          fontWeight: 700,
          color: locked ? '#9CA3AF' : done ? '#16A34A' : '#2C1A0E',
          textAlign: 'center',
          lineHeight: 1.35,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </div>
    </motion.button>
  );
}

// ── GameMap ─────────────────────────────────────────────────────────────────
export default function GameMap({
  chapters,
  courseIcon,
  activeTopicId,
  completedIds,
  getStatus,
  onSelectTopic,
  recentlyUnlockedId,
}: GameMapProps) {
  const flatTopics = chapters.flatMap((ch) => ch.topics);
  const activeNodeRef = useRef<HTMLButtonElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Scroll active node into view on mount and when it changes
  useEffect(() => {
    if (activeNodeRef.current && scrollContainerRef.current) {
      setTimeout(() => {
        activeNodeRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 300);
    }
  }, [activeTopicId]);

  return (
    <div
      ref={scrollContainerRef}
      className="h-full overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #FDF6EC 0%, #F5EDE0 60%, #EDE4D4 100%)',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        paddingBottom: 32,
      }}
    >
      {chapters.map((chapter, chapterIdx) => (
        <div key={chapter.id} style={{ marginBottom: 8 }}>
          {/* Chapter Banner */}
          <div style={{ padding: '16px 12px 8px' }}>
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: chapterIdx * 0.05 }}
              style={{
                width: '100%',
                padding: '11px 16px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #0D8C7A 0%, #006B7A 100%)',
                color: '#fff',
                fontSize: 12,
                fontWeight: 800,
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(13,140,122,0.28)',
                letterSpacing: '0.01em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <span style={{ fontSize: 16 }}>
                {CHAPTER_EMOJIS[chapterIdx % CHAPTER_EMOJIS.length]}
              </span>
              <span>
                Chapter {chapter.chapterNumber} — {chapter.title}
              </span>
            </motion.div>
          </div>

          {/* Topic nodes */}
          <div style={{ padding: '0 8px' }}>
            {chapter.topics.map((topic) => {
              const status = getStatus(topic.id, topic.globalIndex);
              const globalIdx = flatTopics.findIndex((t) => t.id === topic.id);
              const prevTopic = globalIdx > 0 ? flatTopics[globalIdx - 1] : null;
              const pathDone =
                prevTopic &&
                completedIds.has(prevTopic.id) &&
                (completedIds.has(topic.id) || status !== 'locked');

              const alignPct = ZIGZAG[topic.globalIndex % 3];
              const prevAlignPct =
                globalIdx > 0 ? ZIGZAG[flatTopics[globalIdx - 1].globalIndex % 3] : alignPct;

              const isActive = activeTopicId === topic.id;
              const isBouncing = recentlyUnlockedId === topic.id;

              return (
                <div key={topic.id} style={{ width: '100%' }}>
                  {/* Path connector between nodes */}
                  {globalIdx > 0 && (
                    <PathConnector
                      completed={!!pathDone}
                      fromAlign={prevAlignPct}
                      toAlign={alignPct}
                    />
                  )}

                  {/* Node positioned at zigzag offset */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      paddingLeft: `calc(${alignPct}% - 44px)`,
                      paddingBottom: 4,
                    }}
                  >
                    <MapNode
                      nodeRef={isActive ? activeNodeRef : undefined}
                      status={status}
                      isActive={isActive}
                      title={topic.title}
                      onClick={() => onSelectTopic(topic.id)}
                      bounce={isBouncing}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
