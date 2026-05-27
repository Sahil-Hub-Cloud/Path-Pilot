'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiLock } from 'react-icons/fi';

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

const ZIGZAG = [12, 50, 88] as const;

function PathConnector({ completed }: { completed: boolean }) {
  return (
    <div
      style={{
        width: 4,
        height: 36,
        margin: '4px auto',
        borderLeft: `3px dotted ${completed ? '#22C55E' : '#D1D5DB'}`,
        opacity: completed ? 1 : 0.7,
      }}
    />
  );
}

function MapNode({
  status,
  isActive,
  title,
  onClick,
  bounce,
}: {
  status: NodeStatus;
  isActive: boolean;
  title: string;
  onClick: () => void;
  bounce?: boolean;
}) {
  const locked = status === 'locked';
  const done = status === 'completed';
  const current = status === 'current' || isActive;

  const size = current ? 72 : 64;
  const bg = done ? '#22C55E' : current ? '#0D8C7A' : '#E5E7EB';
  const shadow = done
    ? '0 0 0 6px rgba(34,197,94,0.2), 0 8px 20px rgba(34,197,94,0.35)'
    : current
      ? '0 0 0 8px rgba(13,140,122,0.25), 0 8px 24px rgba(13,140,122,0.35)'
      : 'none';

  return (
    <motion.button
      type="button"
      disabled={locked}
      onClick={locked ? undefined : onClick}
      animate={bounce ? { scale: [1, 1.15, 1], y: [0, -6, 0] } : {}}
      transition={{ duration: 0.6 }}
      whileHover={!locked ? { scale: 1.05 } : {}}
      whileTap={!locked ? { scale: 0.96 } : {}}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: 'none',
        background: 'transparent',
        cursor: locked ? 'not-allowed' : 'pointer',
        opacity: locked ? 0.6 : 1,
        padding: 0,
        position: 'relative',
      }}
    >
      {current && (
        <motion.span
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.15, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            position: 'absolute',
            width: size + 16,
            height: size + 16,
            borderRadius: '50%',
            border: '3px solid #0D8C7A',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />
      )}
      <div
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
          fontSize: done ? 28 : locked ? 22 : 26,
          fontWeight: 900,
          transition: 'all 0.25s ease',
        }}
      >
        {done ? <FiCheck size={32} strokeWidth={3} /> : locked ? <FiLock size={24} /> : '▶'}
      </div>
      <div
        style={{
          marginTop: 8,
          maxWidth: 100,
          fontSize: 11,
          fontWeight: 700,
          color: locked ? '#9CA3AF' : '#2C1A0E',
          textAlign: 'center',
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {title}
      </div>
    </motion.button>
  );
}

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

  return (
    <div
      className="h-full overflow-y-auto no-scrollbar px-3 py-4"
      style={{ background: 'linear-gradient(180deg, #FDF6EC 0%, #F5EDE0 100%)' }}
    >
      {chapters.map((chapter) => (
        <div key={chapter.id} style={{ marginBottom: 28 }}>
          <div
            style={{
              width: '100%',
              marginBottom: 20,
              padding: '10px 14px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, #0D8C7A, #006B7A)',
              color: '#fff',
              fontSize: 12,
              fontWeight: 800,
              textAlign: 'center',
              boxShadow: '0 4px 14px rgba(13,140,122,0.25)',
            }}
          >
            {courseIcon} Chapter {chapter.chapterNumber} — {chapter.title}
          </div>

          {chapter.topics.map((topic) => {
            const status = getStatus(topic.id, topic.globalIndex);
            const globalIdx = flatTopics.findIndex((t) => t.id === topic.id);
            const prevTopic = globalIdx > 0 ? flatTopics[globalIdx - 1] : null;
            const pathDone =
              prevTopic &&
              completedIds.has(prevTopic.id) &&
              (completedIds.has(topic.id) || status !== 'locked');

            const align = ZIGZAG[topic.globalIndex % 3];

            return (
              <div key={topic.id} style={{ width: '100%', marginBottom: 4 }}>
                {globalIdx > 0 && <PathConnector completed={!!pathDone} />}
                <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: `${align}%`, transform: 'translateX(-32px)' }}>
                  <MapNode
                    status={status}
                    isActive={activeTopicId === topic.id}
                    title={topic.title}
                    onClick={() => onSelectTopic(topic.id)}
                    bounce={recentlyUnlockedId === topic.id}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
