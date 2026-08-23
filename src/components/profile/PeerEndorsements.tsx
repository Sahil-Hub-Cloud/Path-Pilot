'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { toast } from '@/lib/toast';

interface Endorsement {
  skill: string;
  fromUid: string;
  fromName: string;
  timestamp: string;
}

interface PeerEndorsementsProps {
  profileUid: string;
  className?: string;
}

const SKILL_OPTIONS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript',
  'Data Structures', 'Algorithms', 'Problem Solving',
  'Teamwork', 'Communication', 'Leadership',
];

export default function PeerEndorsements({ profileUid, className = '' }: PeerEndorsementsProps) {
  const { user } = useAuth();
  const [endorsements, setEndorsements] = useState<Endorsement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [loading, setLoading] = useState(true);

  const isOwnProfile = user?.uid === profileUid;

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, 'users', profileUid, 'endorsements'));
        setEndorsements(snap.docs.map(d => d.data() as Endorsement));
      } catch {
        console.warn('Failed to load endorsements');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [profileUid]);

  const endorse = async () => {
    if (!user || !selectedSkill) return;
    if (user.uid === profileUid) {
      toast.error("You can't endorse yourself");
      return;
    }

    const existing = endorsements.find(e => e.skill === selectedSkill && e.fromUid === user.uid);
    if (existing) {
      toast.error('You already endorsed this skill');
      return;
    }

    const endorsement: Endorsement = {
      skill: selectedSkill,
      fromUid: user.uid,
      fromName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
      timestamp: new Date().toISOString(),
    };

    try {
      await setDoc(
        doc(db, 'users', profileUid, 'endorsements', `${user.uid}_${selectedSkill}`),
        endorsement
      );
      setEndorsements(prev => [...prev, endorsement]);
      setSelectedSkill('');
      setShowForm(false);
      toast.success('Endorsement added!');
    } catch {
      toast.error('Failed to endorse');
    }
  };

  const removeEndorsement = async (skill: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', profileUid, 'endorsements', `${user.uid}_${skill}`));
      setEndorsements(prev => prev.filter(e => !(e.skill === skill && e.fromUid === user.uid)));
      toast.success('Endorsement removed');
    } catch {
      toast.error('Failed to remove');
    }
  };

  const skillCounts = endorsements.reduce(
    (acc, e) => {
      acc[e.skill] = (acc[e.skill] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const sorted = Object.entries(skillCounts).sort((a, b) => b[1] - a[1]);

  if (loading) {
    return <div className={`clay-card p-6 ${className}`}><div className="animate-pulse h-8 rounded bg-[var(--surface-sunken)]" /></div>;
  }

  return (
    <div className={`clay-card p-5 sm:p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ThumbsUp size={14} className="text-[var(--peacock-blue)]" />
          <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
            Skill Endorsements
          </h3>
          <span className="text-[10px] font-bold text-[var(--text-light)] bg-[var(--surface-sunken)] px-2 py-0.5 rounded-full">
            {endorsements.length}
          </span>
        </div>
        {user && !isOwnProfile && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-[11px] font-bold text-[var(--peacock-blue)] hover:underline"
          >
            {showForm ? 'Cancel' : '+ Endorse'}
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="p-3 rounded-xl border border-[var(--border-clay)] bg-[var(--surface)]">
              <div className="flex gap-2">
                <select
                  value={selectedSkill}
                  onChange={e => setSelectedSkill(e.target.value)}
                  className="flex-1 text-sm px-3 py-2 rounded-lg border border-[var(--border-clay)] bg-[var(--surface-raised)]"
                >
                  <option value="">Select a skill</option>
                  {SKILL_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  onClick={endorse}
                  disabled={!selectedSkill}
                  className="btn-peacock-blue text-xs px-4 py-2"
                >
                  Endorse
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {sorted.length === 0 ? (
        <div className="text-center py-6 text-sm text-[var(--text-muted)]">
          <MessageCircle size={20} className="mx-auto mb-2 opacity-40" />
          <p>No endorsements yet. Be the first!</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {sorted.map(([skill, count], i) => {
            const userEndorsed = endorsements.some(e => e.skill === skill && e.fromUid === user?.uid);
            return (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-bold ${
                  userEndorsed
                    ? 'border-[var(--peacock-blue)] bg-[rgba(0,107,122,0.1)] text-[var(--peacock-blue)]'
                    : 'border-[var(--border-clay)] bg-[var(--surface)] text-[var(--text-medium)]'
                }`}
              >
                {skill}
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white"
                  style={{
                    background: userEndorsed ? 'var(--peacock-blue)' : 'var(--text-muted)',
                  }}
                >
                  {count}
                </span>
                {userEndorsed && !isOwnProfile && (
                  <button
                    onClick={() => removeEndorsement(skill)}
                    className="ml-1 text-[9px] text-red-400 hover:text-red-600"
                  >
                    x
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
