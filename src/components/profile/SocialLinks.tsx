'use client';

import { useState, useEffect } from 'react';
import { Link2, Edit3, Check, ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from '@/lib/toast';

interface SocialLinksData {
  linkedin?: string;
  portfolio?: string;
  twitter?: string;
  github?: string;
}

interface SocialLinksProps {
  className?: string;
}

const LINK_CONFIG = [
  { key: 'linkedin' as const, label: 'LinkedIn', placeholder: 'linkedin.com/in/yourname', color: '#0A66C2' },
  { key: 'portfolio' as const, label: 'Portfolio', placeholder: 'yoursite.com', color: '#006B7A' },
  { key: 'twitter' as const, label: 'Twitter / X', placeholder: '@yourhandle', color: '#1DA1F2' },
  { key: 'github' as const, label: 'GitHub', placeholder: 'github.com/yourname', color: '#333' },
];

export default function SocialLinks({ className = '' }: SocialLinksProps) {
  const { user } = useAuth();
  const [links, setLinks] = useState<SocialLinksData>({});
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<SocialLinksData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setLinks({
            linkedin: data.linkedin || '',
            portfolio: data.portfolio || '',
            twitter: data.twitter || '',
            github: data.githubUsername || '',
          });
        }
      } catch {
        console.warn('Failed to load social links');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const startEditing = () => {
    setDraft({ ...links });
    setEditing(true);
  };

  const save = async () => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), {
        linkedin: draft.linkedin || null,
        portfolio: draft.portfolio || null,
        twitter: draft.twitter || null,
        githubUsername: draft.github || null,
      }, { merge: true });
      setLinks({ ...draft });
      setEditing(false);
      toast.success('Social links updated');
    } catch {
      toast.error('Failed to save');
    }
  };

  const activeLinks = Object.entries(links).filter(([, v]) => v);

  if (loading) {
    return <div className={`clay-card p-6 ${className}`}><div className="animate-pulse h-8 rounded bg-[var(--surface-sunken)]" /></div>;
  }

  if (!editing && activeLinks.length === 0) {
    return (
      <div className={`clay-card p-5 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 size={14} className="text-[var(--peacock-blue)]" />
            <span className="text-xs font-bold text-[var(--text-muted)]">Social Links</span>
          </div>
          <button onClick={startEditing} className="text-[11px] font-bold text-[var(--peacock-blue)] hover:underline">
            + Add Links
          </button>
        </div>
      </div>
    );
  }

  if (editing) {
    return (
      <div className={`clay-card p-5 space-y-3 ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Edit Social Links</span>
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="text-xs font-bold text-[var(--text-muted)]">Cancel</button>
            <button onClick={save} className="btn-peacock-blue text-xs px-3 py-1.5">
              <Check size={12} /> Save
            </button>
          </div>
        </div>
        {LINK_CONFIG.map(cfg => (
          <div key={cfg.key}>
            <label className="text-[10px] font-bold text-[var(--text-muted)] mb-1 block">{cfg.label}</label>
            <input
              value={draft[cfg.key] || ''}
              onChange={e => setDraft(prev => ({ ...prev, [cfg.key]: e.target.value }))}
              placeholder={cfg.placeholder}
              className="w-full text-sm px-3 py-2 rounded-lg border border-[var(--border-clay)] bg-[var(--surface-raised)]"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`clay-card p-5 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Link2 size={14} className="text-[var(--peacock-blue)]" />
          <span className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Social Links</span>
        </div>
        <button onClick={startEditing} className="text-[10px] font-bold text-[var(--peacock-blue)] hover:underline flex items-center gap-1">
          <Edit3 size={10} /> Edit
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {activeLinks.map(([key, value]) => {
          const cfg = LINK_CONFIG.find(c => c.key === key);
          if (!cfg || !value) return null;
          const href = key === 'twitter'
            ? `https://twitter.com/${value.replace('@', '')}`
            : key === 'github'
            ? `https://github.com/${value}`
            : value.startsWith('http') ? value : `https://${value}`;
          return (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors hover:opacity-80"
              style={{
                borderColor: `${cfg.color}40`,
                background: `${cfg.color}10`,
                color: cfg.color,
              }}
            >
              {cfg.label} <ExternalLink size={10} />
            </a>
          );
        })}
      </div>
    </div>
  );
}
