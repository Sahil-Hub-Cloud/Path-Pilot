'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Trash2, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from '@/lib/toast';

export interface LearningGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  createdAt: string;
}

interface LearningGoalsProps {
  className?: string;
}

const GOAL_TEMPLATES = [
  { title: 'Complete labs', target: 10, unit: 'labs' },
  { title: 'Maintain streak', target: 14, unit: 'days' },
  { title: 'Earn skill points', target: 500, unit: 'XP' },
  { title: 'Solve challenges', target: 20, unit: 'problems' },
];

export default function LearningGoals({ className = '' }: LearningGoalsProps) {
  const { user } = useAuth();
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newUnit, setNewUnit] = useState('labs');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const loadGoals = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid, 'gaming', 'goals'));
        if (snap.exists()) {
          setGoals(snap.data().goals || []);
        }
      } catch {
        console.warn('Failed to load goals');
      } finally {
        setLoading(false);
      }
    };
    loadGoals();
  }, [user]);

  const saveGoals = async (updated: LearningGoal[]) => {
    if (!user) return;
    setGoals(updated);
    try {
      await setDoc(doc(db, 'users', user.uid, 'gaming', 'goals'), { goals: updated }, { merge: true });
    } catch {
      toast.error('Failed to save goals');
    }
  };

  const addGoal = (title?: string, target?: number, unit?: string) => {
    const goal: LearningGoal = {
      id: Date.now().toString(),
      title: title || newTitle || 'My Goal',
      target: target || parseInt(newTarget) || 10,
      current: 0,
      unit: unit || newUnit,
      createdAt: new Date().toISOString(),
    };
    saveGoals([...goals, goal]);
    setNewTitle('');
    setNewTarget('');
    setShowAdd(false);
  };

  const updateProgress = (id: string, delta: number) => {
    const updated = goals.map(g =>
      g.id === id ? { ...g, current: Math.max(0, Math.min(g.target, g.current + delta)) } : g
    );
    saveGoals(updated);
  };

  const removeGoal = (id: string) => {
    saveGoals(goals.filter(g => g.id !== id));
  };

  if (loading) {
    return (
      <div className={`clay-card p-6 ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-32 rounded bg-[var(--surface-sunken)]" />
          <div className="h-16 rounded-xl bg-[var(--surface-sunken)]" />
        </div>
      </div>
    );
  }

  return (
    <div className={`clay-card p-5 sm:p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-[var(--peacock-blue)]" />
          <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
            Learning Goals
          </h3>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1 text-[11px] font-bold text-[var(--peacock-blue)] hover:underline"
        >
          <Plus size={14} /> Add Goal
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="p-3 rounded-xl border border-[var(--border-clay)] bg-[var(--surface)] space-y-2">
              <div className="flex gap-2">
                <input
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Goal name"
                  className="flex-1 text-sm px-3 py-2 rounded-lg border border-[var(--border-clay)] bg-[var(--surface-raised)]"
                />
                <input
                  value={newTarget}
                  onChange={e => setNewTarget(e.target.value)}
                  placeholder="Target"
                  type="number"
                  className="w-20 text-sm px-3 py-2 rounded-lg border border-[var(--border-clay)] bg-[var(--surface-raised)]"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={newUnit}
                  onChange={e => setNewUnit(e.target.value)}
                  className="text-sm px-3 py-2 rounded-lg border border-[var(--border-clay)] bg-[var(--surface-raised)]"
                >
                  <option value="labs">labs</option>
                  <option value="days">days</option>
                  <option value="XP">XP</option>
                  <option value="problems">problems</option>
                  <option value="hours">hours</option>
                </select>
                <button onClick={() => addGoal()} className="btn-peacock-blue text-xs px-4 py-2">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {GOAL_TEMPLATES.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => addGoal(t.title, t.target, t.unit)}
                    className="text-[10px] font-bold px-2 py-1 rounded-full border border-[var(--border-clay)] bg-[var(--surface-raised)] hover:bg-[var(--peacock-blue)] hover:text-white transition-colors"
                  >
                    + {t.title}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {goals.length === 0 ? (
        <div className="text-center py-6 text-sm text-[var(--text-muted)]">
          <Target size={24} className="mx-auto mb-2 opacity-40" />
          <p>No goals yet. Set your first learning goal!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal, i) => {
            const percent = Math.round((goal.current / goal.target) * 100);
            const isComplete = percent >= 100;
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-3 rounded-xl border ${
                  isComplete
                    ? 'border-[rgba(46,125,82,0.3)] bg-[rgba(46,125,82,0.06)]'
                    : 'border-[var(--border-clay)] bg-[var(--surface)]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isComplete && <Check size={14} className="text-[var(--peacock-green)]" />}
                    <span className="text-sm font-bold">{goal.title}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateProgress(goal.id, -1)}
                      className="w-6 h-6 rounded text-xs font-bold bg-[var(--surface-sunken)] hover:bg-[var(--surface-raised)]"
                    >
                      -
                    </button>
                    <button
                      onClick={() => updateProgress(goal.id, 1)}
                      className="w-6 h-6 rounded text-xs font-bold bg-[var(--peacock-blue)] text-white hover:opacity-80"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeGoal(goal.id)}
                      className="w-6 h-6 rounded text-xs text-[var(--text-muted)] hover:text-red-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-[var(--surface-sunken)] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percent, 100)}%` }}
                      transition={{ duration: 0.5 }}
                      style={{
                        background: isComplete
                          ? 'var(--peacock-green)'
                          : 'linear-gradient(90deg, var(--peacock-blue), var(--peacock-blue-light))',
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[var(--text-muted)] whitespace-nowrap">
                    {goal.current}/{goal.target} {goal.unit}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
