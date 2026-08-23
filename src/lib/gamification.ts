export interface GamificationStats {
  streakDays?: number;
  labsCompleted?: number;
  skillScore?: number;
  employabilityScore?: number;
}

export interface BadgeDefinition {
  id: string;
  label: string;
  description: string;
  category: 'streak' | 'labs' | 'skills' | 'career';
  test: (stats: GamificationStats) => boolean;
}

export const BADGES: BadgeDefinition[] = [
  {
    id: 'first-login',
    label: 'Ignition',
    description: 'Start your Path Pilot journey',
    category: 'streak',
    test: stats => (stats.streakDays ?? 0) >= 1,
  },
  {
    id: 'streak-3',
    label: 'Momentum',
    description: 'Maintain a 3-day streak',
    category: 'streak',
    test: stats => (stats.streakDays ?? 0) >= 3,
  },
  {
    id: 'streak-7',
    label: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    category: 'streak',
    test: stats => (stats.streakDays ?? 0) >= 7,
  },
  {
    id: 'streak-30',
    label: 'Unstoppable',
    description: 'Maintain a 30-day streak',
    category: 'streak',
    test: stats => (stats.streakDays ?? 0) >= 30,
  },
  {
    id: 'lab-1',
    label: 'First Experiment',
    description: 'Complete your first lab',
    category: 'labs',
    test: stats => (stats.labsCompleted ?? 0) >= 1,
  },
  {
    id: 'lab-5',
    label: 'Lab Explorer',
    description: 'Complete five hands-on labs',
    category: 'labs',
    test: stats => (stats.labsCompleted ?? 0) >= 5,
  },
  {
    id: 'lab-10',
    label: 'Lab Specialist',
    description: 'Complete ten hands-on labs',
    category: 'labs',
    test: stats => (stats.labsCompleted ?? 0) >= 10,
  },
  {
    id: 'skill-50',
    label: 'Skill Builder',
    description: 'Reach an AI skill score of 50',
    category: 'skills',
    test: stats => (stats.skillScore ?? 0) >= 50,
  },
  {
    id: 'skill-75',
    label: 'Technical Edge',
    description: 'Reach an AI skill score of 75',
    category: 'skills',
    test: stats => (stats.skillScore ?? 0) >= 75,
  },
  {
    id: 'career-ready',
    label: 'Career Ready',
    description: 'Earn an employability score of 70+',
    category: 'career',
    test: stats => (stats.employabilityScore ?? 0) >= 70,
  },
];

export const BADGE_MAP = Object.fromEntries(BADGES.map(badge => [badge.id, badge]));

export function evaluateBadges(stats: GamificationStats): string[] {
  return BADGES.filter(badge => badge.test(stats)).map(badge => badge.id);
}

export function computeXP(stats: GamificationStats): number {
  return Math.round(
    (stats.streakDays ?? 0) * 8 +
      (stats.labsCompleted ?? 0) * 60 +
      (stats.skillScore ?? 0) * 4 +
      (stats.employabilityScore ?? 0) * 3
  );
}

export const LEVELS = [
  { name: 'Explorer', minXp: 0 },
  { name: 'Builder', minXp: 200 },
  { name: 'Achiever', minXp: 500 },
  { name: 'Specialist', minXp: 900 },
  { name: 'Expert', minXp: 1400 },
] as const;

export function computeLevel(xp: number): string {
  return [...LEVELS].reverse().find(level => xp >= level.minXp)?.name ?? 'Explorer';
}

export function nextLevelProgress(xp: number): { percent: number; nextLevel: string | null; remaining: number } {
  const currentLevelIndex = LEVELS.reduce((lastIndex, level, index) => (xp >= level.minXp ? index : lastIndex), 0);
  const nextLevel = LEVELS[currentLevelIndex + 1];

  if (!nextLevel) return { percent: 100, nextLevel: null, remaining: 0 };

  const current = LEVELS[currentLevelIndex];
  const progress = (xp - current.minXp) / (nextLevel.minXp - current.minXp);

  return {
    percent: Math.max(0, Math.min(100, Math.round(progress * 100))),
    nextLevel: nextLevel.name,
    remaining: Math.max(0, nextLevel.minXp - xp),
  };
}
