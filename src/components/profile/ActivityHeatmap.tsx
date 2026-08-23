'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ActivityHeatmapProps {
  activityData: Record<string, number>;
  className?: string;
}

const LEVELS = [
  { min: 0, max: 0, color: 'var(--surface-sunken)' },
  { min: 1, max: 2, color: 'rgba(0,107,122,0.2)' },
  { min: 3, max: 5, color: 'rgba(0,107,122,0.4)' },
  { min: 6, max: 9, color: 'rgba(0,107,122,0.65)' },
  { min: 10, max: Infinity, color: 'rgba(0,107,122,0.9)' },
];

const WEEKDAYS = ['Mon', '', 'Wed', '', 'Fri', '', ''];

function getColor(count: number): string {
  return LEVELS.find(l => count >= l.min && count <= l.max)?.color ?? LEVELS[0].color;
}

export default function ActivityHeatmap({ activityData, className = '' }: ActivityHeatmapProps) {
  const weeks = useMemo(() => {
    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7;
    const totalWeeks = 20;
    const result: { date: Date; count: number; dateStr: string }[][] = [];

    for (let w = totalWeeks - 1; w >= 0; w--) {
      const week: { date: Date; count: number; dateStr: string }[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (w * 7 + (dayOfWeek - d)));
        const key = date.toISOString().split('T')[0];
        week.push({ date, count: activityData[key] || 0, dateStr: key });
      }
      result.push(week);
    }
    return result;
  }, [activityData]);

  const totalDays = Object.values(activityData).reduce((a, b) => a + b, 0);
  const activeDays = Object.values(activityData).filter(v => v > 0).length;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4 text-[11px] font-bold text-[var(--text-muted)]">
          <span>{activeDays} active days</span>
          <span>{totalDays} total activities</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
          <span>Less</span>
          {LEVELS.map((level, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-sm"
              style={{ background: level.color, border: '1px solid var(--border-clay)' }}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-[3px]">
          <div className="flex flex-col gap-[3px] mr-1">
            {WEEKDAYS.map((day, i) => (
              <div key={i} className="h-[13px] text-[9px] font-bold text-[var(--text-muted)] flex items-center">
                {day}
              </div>
            ))}
          </div>

          {weeks.map((week, wi) => (
            <motion.div
              key={wi}
              className="flex flex-col gap-[3px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: wi * 0.02 }}
            >
              {week.map((day, di) => (
                <div
                  key={di}
                  className="w-[13px] h-[13px] rounded-sm transition-colors"
                  style={{
                    background: getColor(day.count),
                    border: '1px solid var(--border-clay)',
                  }}
                  title={`${day.dateStr}: ${day.count} activities`}
                />
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-2 text-[10px] font-bold text-[var(--text-muted)]">
        Showing last {weeks.length} weeks
      </div>
    </div>
  );
}
