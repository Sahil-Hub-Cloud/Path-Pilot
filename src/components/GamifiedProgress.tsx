'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Lock, Trophy, Zap } from 'lucide-react';
import { BADGES, computeLevel, computeXP, nextLevelProgress } from '@/lib/gamification';

interface GamifiedProgressProps {
  streak: number;
  labsCompleted: number;
  skillScore: number;
  employabilityScore: number;
  badges?: string[];
  isLoading?: boolean;
  className?: string;
}

export default function GamifiedProgress({
  streak,
  labsCompleted,
  skillScore,
  employabilityScore,
  badges = [],
  isLoading = false,
  className = '',
}: GamifiedProgressProps) {
  const stats = { streakDays: streak, labsCompleted, skillScore, employabilityScore };
  const xp = computeXP(stats);
  const level = computeLevel(xp);
  const progress = nextLevelProgress(xp);
  const earnedBadgeIds = new Set(badges);

  if (isLoading) {
    return (
      <section aria-busy="true" className={`clay-card p-5 sm:p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-40 rounded-full bg-[var(--surface-sunken)]" />
          <div className="h-3 w-full rounded-full bg-[var(--surface-sunken)]" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-24 rounded-2xl bg-[var(--surface-sunken)]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="Gamified learning progress"
      className={`clay-card p-5 sm:p-6 ${className}`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#008FA3] to-[#1F5C3A] text-white shadow-lg">
            <Trophy size={24} aria-hidden />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.15em] text-[var(--text-muted)]">
              Learning Rank
            </p>
            <h2 className="text-xl font-black tracking-tight text-[var(--text-dark)] sm:text-2xl">
              {level}
            </h2>
            <p className="mt-1 flex items-center gap-2 text-xs font-bold text-[var(--text-medium)]">
              <Zap size={13} className="text-[#E8A020]" aria-hidden />
              {xp.toLocaleString()} XP · {badges.length}/{BADGES.length} badges
            </p>
          </div>
        </div>

        <div className="w-full lg:max-w-sm">
          <div className="mb-2 flex items-center justify-between text-xs font-bold text-[var(--text-muted)]">
            <span>{progress.nextLevel ? `Next: ${progress.nextLevel}` : 'Max level reached'}</span>
            <span>{progress.percent}%</span>
          </div>
          <div
            className="h-3 overflow-hidden rounded-full border border-[var(--border-clay)] bg-[var(--surface-sunken)]"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress.percent}
            aria-label="Progress to next learning rank"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress.percent}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-[#008FA3] via-[#006B7A] to-[#2E7D52]"
            />
          </div>
          {progress.nextLevel && progress.remaining > 0 && (
            <p className="mt-2 text-[11px] font-semibold text-[var(--text-light)]">
              {progress.remaining.toLocaleString()} XP remaining
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {BADGES.map((badge, index) => {
          const earned = earnedBadgeIds.has(badge.id);
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.03, 0.25), duration: 0.35 }}
              title={badge.description}
              className={`flex min-h-[104px] flex-col justify-between rounded-2xl border p-3 transition-all ${
                earned
                  ? 'border-[rgba(0,107,122,0.28)] bg-[rgba(0,107,122,0.08)] shadow-sm hover:-translate-y-1'
                  : 'border-[var(--border-clay)] bg-[var(--surface)] opacity-65'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`line-clamp-2 text-[13px] font-black leading-tight ${
                    earned ? 'text-[#006B7A]' : 'text-[var(--text-muted)]'
                  }`}
                >
                  {badge.label}
                </span>
                {earned ? (
                  <Flame size={16} className="shrink-0 text-[#D95F2B]" aria-hidden />
                ) : (
                  <Lock size={14} className="shrink-0 text-[var(--text-light)]" aria-hidden />
                )}
              </div>
              <p className="mt-2 line-clamp-2 text-[11px] font-semibold leading-snug text-[var(--text-muted)]">
                {badge.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {!earnedBadgeIds.has('first-login') && (
        <p className="mt-4 rounded-xl bg-[rgba(217,95,43,0.08)] px-4 py-3 text-xs font-bold text-[#B04A1E]">
          Log in again tomorrow and complete a lab to unlock your first badge.
        </p>
      )}
    </section>
  );
}
