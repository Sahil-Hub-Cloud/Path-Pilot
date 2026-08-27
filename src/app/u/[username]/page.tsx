'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { evaluateBadges, computeXP, computeLevel, BADGES } from '@/lib/gamification';
import SkillRadar from '@/components/profile/SkillRadar';
import BadgeShowcase from '@/components/profile/BadgeShowcase';
import SocialLinks from '@/components/profile/SocialLinks';
import PeerEndorsements from '@/components/profile/PeerEndorsements';
import { ArrowLeft, ExternalLink, MapPin, GraduationCap, Calendar, Award } from 'lucide-react';

interface PortfolioData {
  uid: string;
  displayName: string;
  email: string;
  profileImageUrl: string;
  learningPath: string;
  collegeName: string;
  yearOfStudy: string;
  skillScore: number;
  labsCompleted: number;
  streakDays: number;
  employabilityLevel: string;
  githubUsername: string;
  linkedin: string;
  portfolio: string;
  twitter: string;
  bio: string;
  joinedDate: string;
}

export default function PublicPortfolioPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [profile, setProfile] = useState<PortfolioData | null>(null);
  const [skills, setSkills] = useState<{ label: string; value: number; color: string }[]>([]);
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!username) return;

    const loadProfile = async () => {
      try {
        const usersRef = collection(db, 'users');

        let uid: string | null = null;

        const usernameQuery = query(usersRef, where('username', '==', username));
        const usernameSnap = await getDocs(usernameQuery);
        if (!usernameSnap.empty) {
          uid = usernameSnap.docs[0].id;
        } else {
          const ghQuery = query(usersRef, where('githubUsername', '==', username));
          const ghSnap = await getDocs(ghQuery);
          if (!ghSnap.empty) {
            uid = ghSnap.docs[0].id;
          }
        }

        if (!uid) {
          const userDoc = await getDoc(doc(db, 'users', username));
          if (userDoc.exists()) {
            uid = username;
          }
        }

        if (!uid) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', uid));
        if (!userDoc.exists()) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const data = userDoc.data();
        const profileData: PortfolioData = {
          uid,
          displayName: data.displayName || 'Path Pilot User',
          email: data.email || '',
          profileImageUrl: data.profileImageUrl || '',
          learningPath: data.learningPath || '',
          collegeName: data.collegeName || '',
          yearOfStudy: data.yearOfStudy || '',
          skillScore: Number(data.skillScore || data.stats?.score) || 0,
          labsCompleted: Number(data.labsCompleted || data.stats?.labsCompleted) || 0,
          streakDays: Number(data.streakDays || data.stats?.streak) || 0,
          employabilityLevel: data.employabilityLevel || 'Unrated',
          githubUsername: data.githubUsername || '',
          linkedin: data.linkedin || '',
          portfolio: data.portfolio || '',
          twitter: data.twitter || '',
          bio: data.bio || '',
          joinedDate: data.createdAt || userDoc.id,
        };
        setProfile(profileData);

        let metrics = { syntax: 0, logic: 0, debug: 0 };
        try {
          const metricsKey = `skill_metrics_${uid}`;
          const saved = typeof window !== 'undefined' ? localStorage.getItem(metricsKey) : null;
          if (saved) {
            const m = JSON.parse(saved);
            metrics = { syntax: Math.round((m.syntax || 0) * 100), logic: Math.round((m.logic || 0) * 100), debug: Math.round((m.debugging || 0) * 100) };
          }
        } catch { /* ignore */ }

        const radarSkills = [
          { label: 'Syntax', value: metrics.syntax, color: '#006B7A' },
          { label: 'Logic', value: metrics.logic, color: '#6366f1' },
          { label: 'Debug', value: metrics.debug, color: '#F59E0B' },
        ].filter(s => s.value > 0);
        setSkills(radarSkills);

        const stats = {
          streakDays: profileData.streakDays,
          labsCompleted: profileData.labsCompleted,
          skillScore: profileData.skillScore,
          employabilityScore: Number(profileData.employabilityLevel === 'High' ? 85 : profileData.employabilityLevel === 'Medium' ? 50 : 20),
        };
        setEarnedBadgeIds(evaluateBadges(stats));
      } catch (err) {
        console.error('[PublicPortfolio] Error loading profile:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <div className="skeu-card p-10 text-center">
          <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Loading portfolio…</p>
        </div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <div className="skeu-card p-10 text-center max-w-md">
          <span className="text-4xl block mb-3">🔍</span>
          <h2 className="font-bold text-lg mb-2">Profile Not Found</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            No user found with username &quot;{username}&quot;.
          </p>
          <button onClick={() => router.push('/')} className="clay-btn clay-btn-primary clay-btn-sm">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const xp = computeXP({
    streakDays: profile.streakDays,
    labsCompleted: profile.labsCompleted,
    skillScore: profile.skillScore,
    employabilityScore: Number(profile.employabilityLevel === 'High' ? 85 : profile.employabilityLevel === 'Medium' ? 50 : 20),
  });
  const levelName = computeLevel(xp);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* Top Bar */}
      <nav className="skeu-navbar px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="clay-btn clay-btn-secondary clay-btn-sm">
              <ArrowLeft size={14} />
            </button>
            <span className="font-bold text-sm">Public Portfolio</span>
          </div>
          <Link
            href="/"
            className="text-xs font-bold"
            style={{ color: 'var(--peacock-blue)' }}
          >
            Path Pilot
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="skeu-card-teal p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black text-white shrink-0"
              style={{ background: 'linear-gradient(145deg, #14B8A6, #0D9488)', boxShadow: '6px 6px 14px rgba(13,148,136,0.2), inset 0 2px 0 rgba(255,255,255,0.2)' }}
            >
              {profile.profileImageUrl ? (
                <img src={profile.profileImageUrl} alt={profile.displayName} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                (profile.displayName?.[0] || 'P').toUpperCase()
              )}
            </div>

            <div className="text-center sm:text-left flex-1">
              <h1 className="font-black text-3xl sm:text-4xl flex items-center gap-3 justify-center sm:justify-start flex-wrap" style={{ fontFamily: 'var(--font-display)' }}>
                {profile.displayName}
                <span className="text-xs font-bold px-2.5 py-1 rounded" style={{
                  background: 'rgba(0,107,122,0.12)',
                  color: 'var(--peacock-blue)',
                  border: '1px solid rgba(0,107,122,0.25)'
                }}>
                  {levelName}
                </span>
                {profile.employabilityLevel !== 'Unrated' && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded" style={{
                    background: profile.employabilityLevel.includes('High') ? 'rgba(16,185,129,0.15)' : profile.employabilityLevel === 'Medium' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                    color: profile.employabilityLevel.includes('High') ? '#10B981' : profile.employabilityLevel === 'Medium' ? '#F59E0B' : '#EF4444',
                    border: `1px solid ${profile.employabilityLevel.includes('High') ? 'rgba(16,185,129,0.3)' : profile.employabilityLevel === 'Medium' ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`
                  }}>
                    {profile.employabilityLevel}
                  </span>
                )}
              </h1>

              {profile.bio && (
                <p className="text-sm mt-2 max-w-lg" style={{ color: 'var(--text-secondary)' }}>{profile.bio}</p>
              )}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 justify-center sm:justify-start">
                {profile.learningPath && (
                  <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                    <GraduationCap size={14} /> {profile.learningPath}
                  </span>
                )}
                {(profile.collegeName || profile.yearOfStudy) && (
                  <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                    <MapPin size={14} />
                    {profile.yearOfStudy ? `Year ${profile.yearOfStudy}` : ''}{profile.yearOfStudy && profile.collegeName ? ' • ' : ''}{profile.collegeName}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                  <Calendar size={14} /> Joined {new Date(profile.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-3 justify-center sm:justify-start">
                <span className="text-sm font-black" style={{ color: 'var(--peacock-blue)' }}>{xp} XP</span>
                {profile.githubUsername && (
                  <a href={`https://github.com/${profile.githubUsername}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-colors hover:opacity-80"
                    style={{ borderColor: 'rgba(0,107,122,0.3)', background: 'rgba(0,107,122,0.06)', color: 'var(--peacock-blue)' }}
                  >
                    GitHub <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="skeu-card p-4 sm:p-5 text-center">
            <p className="font-black text-2xl sm:text-3xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--peacock-blue)' }}>
              {profile.skillScore || '—'}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-tertiary)' }}>AI Skill Score</p>
          </div>
          <div className="skeu-card p-4 sm:p-5 text-center">
            <p className="font-black text-2xl sm:text-3xl" style={{ fontFamily: 'var(--font-display)', color: '#6366f1' }}>
              {profile.labsCompleted || '—'}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-tertiary)' }}>Labs Done</p>
          </div>
          <div className="skeu-card p-4 sm:p-5 text-center">
            <p className="font-black text-2xl sm:text-3xl" style={{ fontFamily: 'var(--font-display)', color: '#F59E0B' }}>
              {profile.streakDays ? <>{profile.streakDays} <span className="text-lg ml-0.5">🔥</span></> : '—'}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-tertiary)' }}>Day Streak</p>
          </div>
          <div className="skeu-card p-4 sm:p-5 text-center">
            <p className="font-black text-2xl sm:text-3xl" style={{ fontFamily: 'var(--font-display)', color: '#10B981' }}>
              {earnedBadgeIds.length}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-tertiary)' }}>Badges Earned</p>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Left: Skills */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="skeu-card p-5 sm:p-6">
              <h2 className="text-xs font-extrabold uppercase tracking-widest mb-4" style={{ color: 'var(--text-tertiary)' }}>Skills</h2>
              {skills.length > 0 ? (
                <SkillRadar skills={skills} />
              ) : (
                <div className="text-center py-8">
                  <span className="text-3xl block mb-2">📊</span>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>No skill data available</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right: Badges */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="skeu-card p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award size={14} className="text-[var(--peacock-blue)]" />
                <h2 className="text-xs font-extrabold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Badges</h2>
              </div>
              <BadgeShowcase
                earnedBadgeIds={earnedBadgeIds}
                stats={{
                  streakDays: profile.streakDays,
                  labsCompleted: profile.labsCompleted,
                  skillScore: profile.skillScore,
                  employabilityScore: Number(profile.employabilityLevel === 'High' ? 85 : profile.employabilityLevel === 'Medium' ? 50 : 20),
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Social + Endorsements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <div className="skeu-card p-5 sm:p-6">
              <h2 className="text-xs font-extrabold uppercase tracking-widest mb-4" style={{ color: 'var(--text-tertiary)' }}>Links</h2>
              <div className="flex flex-wrap gap-2">
                {profile.linkedin && (
                  <a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors hover:opacity-80"
                    style={{ borderColor: 'rgba(10,102,194,0.3)', background: 'rgba(10,102,194,0.06)', color: '#0A66C2' }}
                  >LinkedIn <ExternalLink size={10} /></a>
                )}
                {profile.portfolio && (
                  <a href={profile.portfolio.startsWith('http') ? profile.portfolio : `https://${profile.portfolio}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors hover:opacity-80"
                    style={{ borderColor: 'rgba(0,107,122,0.3)', background: 'rgba(0,107,122,0.06)', color: '#006B7A' }}
                  >Portfolio <ExternalLink size={10} /></a>
                )}
                {profile.twitter && (
                  <a href={`https://twitter.com/${profile.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors hover:opacity-80"
                    style={{ borderColor: 'rgba(29,161,242,0.3)', background: 'rgba(29,161,242,0.06)', color: '#1DA1F2' }}
                  >Twitter <ExternalLink size={10} /></a>
                )}
                {profile.githubUsername && (
                  <a href={`https://github.com/${profile.githubUsername}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors hover:opacity-80"
                    style={{ borderColor: 'rgba(51,51,51,0.3)', background: 'rgba(51,51,51,0.06)', color: '#333' }}
                  >GitHub <ExternalLink size={10} /></a>
                )}
                {!profile.linkedin && !profile.portfolio && !profile.twitter && !profile.githubUsername && (
                  <p className="text-sm text-[var(--text-muted)]">No links added yet.</p>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <PeerEndorsements profileUid={profile.uid} />
          </motion.div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 border-t" style={{ borderColor: 'var(--border-medium)' }}>
          <p className="text-xs font-bold" style={{ color: 'var(--text-tertiary)' }}>
            Built with Path Pilot • <Link href="/" className="hover:underline" style={{ color: 'var(--peacock-blue)' }}>path-pilot.vercel.app</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
