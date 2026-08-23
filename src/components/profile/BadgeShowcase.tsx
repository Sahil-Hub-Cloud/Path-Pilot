'use client';

import { motion } from 'framer-motion';
import { Lock, Check } from 'lucide-react';
import { BADGES, BADGE_MAP, type GamificationStats } from '@/lib/gamification';

interface BadgeShowcaseProps {
  earnedBadgeIds: string[];
  stats: GamificationStats;
  className?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  streak: 'Consistency',
  labs: 'Hands-on',
  skills: 'Technical',
  career: 'Career',
};

const CATEGORY_COLORS: Record<string, string> = {
  streak: '#D95F2B',
  labs: '#2E7D52',
  skills: '#006B7A',
  career: '#6366F1',
};

export default function BadgeShowcase({ earnedBadgeIds, stats, className = '' }: BadgeShowcaseProps) {
  const earned = new Set(earnedBadgeIds);
  const total = BADGES.length;
  const earnedCount = earned.size;

  const grouped = BADGES.reduce(
    (acc, badge) => {
      acc[badge.category] = acc[badge.category] || [];
      acc[badge.category].push(badge);
      return acc;
    },
    {} as Record<string, typeof BADGES>
  );

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-[11px] font-bold text-[var(--text-muted)]">
          {earnedCount}/{total} badges earned
        </div>
        <div className="flex gap-1">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <span
              key={key}
              className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{
                background: `${CATEGORY_COLORS[key]}12`,
                color: CATEGORY_COLORS[key],
                border: `1px solid ${CATEGORY_COLORS[key]}30`,
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {Object.entries(grouped).map(([category, badges]) => (
        <div key={category} className="mb-4">
          <h4
            className="text-[10px] font-black uppercase tracking-widest mb-2"
            style={{ color: CATEGORY_COLORS[category] }}
          >
            {CATEGORY_LABELS[category]}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {badges.map((badge, index) => {
              const isEarned = earned.has(badge.id);
              const statsForTest = {
                streakDays: stats.streakDays ?? 0,
                labsCompleted: stats.labsCompleted ?? 0,
                skillScore: stats.skillScore ?? 0,
                employabilityScore: stats.employabilityScore ?? 0,
              };
              const wouldEarn = badge.test(statsForTest);

              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  title={badge.description}
                  className={`relative flex flex-col items-center p-3 rounded-xl border transition-all ${
                    isEarned
                      ? 'border-[rgba(0,107,122,0.3)] bg-[rgba(0,107,122,0.06)] shadow-sm'
                      : wouldEarn
                      ? 'border-[var(--amber)] bg-[rgba(232,160,32,0.06)] animate-pulse'
                      : 'border-[var(--border-clay)] bg-[var(--surface)] opacity-50'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg mb-1.5"
                    style={{
                      background: isEarned
                        ? `linear-gradient(135deg, ${CATEGORY_COLORS[category]}20, ${CATEGORY_COLORS[category]}40)`
                        : 'var(--surface-sunken)',
                    }}
                  >
                    {isEarned ? (
                      <Check size={18} style={{ color: CATEGORY_COLORS[category] }} />
                    ) : (
                      <Lock size={14} className="text-[var(--text-light)]" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-bold text-center leading-tight ${
                      isEarned ? 'text-[var(--text-dark)]' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {badge.label}
                  </span>
                  {wouldEarn && !isEarned && (
                    <span className="text-[8px] font-black text-[var(--amber)] mt-0.5">ALMOST!</span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
