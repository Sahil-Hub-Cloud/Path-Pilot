'use client';

import { useState, useEffect, useRef, Component, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { db, storage } from '@/lib/firebase';
import NotificationBell from '@/components/NotificationBell';
import { FiCamera } from 'react-icons/fi';
import { fetchResilient } from '@/lib/firestore-resilience';
import { evaluateBadges, computeXP, computeLevel, BADGES } from '@/lib/gamification';
import SkillRadar from '@/components/profile/SkillRadar';
import ActivityHeatmap from '@/components/profile/ActivityHeatmap';
import BadgeShowcase from '@/components/profile/BadgeShowcase';
import LearningGoals from '@/components/profile/LearningGoals';
import SocialLinks from '@/components/profile/SocialLinks';
import PeerEndorsements from '@/components/profile/PeerEndorsements';
import ExportResume from '@/components/profile/ExportResume';

class ProfileErrorBoundary extends Component<
    { children: ReactNode },
    { hasError: boolean; errorMsg: string }
> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false, errorMsg: '' };
    }
    static getDerivedStateFromError(error: Error) {
        return { hasError: true, errorMsg: error?.message || 'Unknown error' };
    }
    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error('[ProfileErrorBoundary]', error, info);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
                    <div className="skeu-card p-10 text-center max-w-md">
                        <span className="text-4xl block mb-3">⚠️</span>
                        <h2 className="font-bold text-lg mb-2">Something went wrong</h2>
                        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                            {this.state.errorMsg}
                        </p>
                        <button
                            onClick={() => { this.setState({ hasError: false, errorMsg: '' }); window.location.reload(); }}
                            className="clay-btn clay-btn-primary clay-btn-sm"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

function ProfilePageInner() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);

    const [studentName, setStudentName] = useState('');
    const [courseName, setCourseName] = useState('');
    const [githubUsernameInput, setGithubUsernameInput] = useState('');
    const [githubUsername, setGithubUsername] = useState('');
    const [githubData, setGithubData] = useState<Record<string, unknown> | null>(null);
    const [githubRepos, setGithubRepos] = useState<Record<string, unknown>[]>([]);
    const [loadingGithub, setLoadingGithub] = useState(false);
    const [employabilityLevel, setEmployabilityLevel] = useState('Unrated');

    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [yearOfStudy, setYearOfStudy] = useState('');
    const [collegeName, setCollegeName] = useState('');
    const [skillScore, setSkillScore] = useState(0);
    const [labsCompleted, setLabsCompleted] = useState(0);
    const [streakDays, setStreakDays] = useState(0);
    const [recentActivity, setRecentActivity] = useState<string[]>([]);
    const [activityData, setActivityData] = useState<Record<string, number>>({});
    const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>([]);

    const [uploadingImage, setUploadingImage] = useState(false);
    const [imageError, setImageError] = useState(false);
    const fileInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMounted(true);
        if (!loading && !user) router.push('/auth');
        if (!user) return;

        const fetchGithubData = async (username: string) => {
            try {
                setLoadingGithub(true);
                const userRes = await fetch(`https://api.github.com/users/${username}`);
                if (userRes.ok) setGithubData(await userRes.json());
                const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=3`);
                if (reposRes.ok) setGithubRepos(await reposRes.json());
            } catch (e) {
                console.error('[Profile] GitHub fetch error:', e);
            } finally {
                setLoadingGithub(false);
            }
        };

        const fetchData = async () => {
            try {
                const profileKey = 'pp_profile_' + user.uid;
                const d = localStorage.getItem(profileKey);
                if (d) {
                    try {
                        const p = JSON.parse(d);
                        if (p?.displayName) setStudentName(p.displayName);
                        if (p?.learningPath) setCourseName(p.learningPath);
                    } catch { /* ignore */ }
                }

                if (db) {
                    const snap = await fetchResilient(doc(db, 'users', user.uid));
                    if (snap && snap.exists()) {
                        const data = snap.data() || {};
                        if (data.displayName) setStudentName(data.displayName);
                        if (data.learningPath) setCourseName(data.learningPath);
                        if (data.employabilityLevel) setEmployabilityLevel(data.employabilityLevel);

                        setSkillScore(Number(data.skillScore || data.stats?.score) || 0);
                        setLabsCompleted(Number(data.labsCompleted || data.stats?.labsCompleted) || 0);
                        setStreakDays(Number(data.streakDays || data.stats?.streak) || 0);
                        setProfileImageUrl(data.profileImageUrl || '');
                        setYearOfStudy(String(data.yearOfStudy || ''));
                        setCollegeName(String(data.collegeName || ''));

                        const recent: string[] = [];
                        if (Array.isArray(data.completedLabsList)) recent.push(...data.completedLabsList);
                        if (Array.isArray(data.completedTopics)) recent.push(...data.completedTopics);
                        setRecentActivity(recent.slice(-5));

                        const actData: Record<string, number> = {};
                        if (Array.isArray(data.activityDates)) {
                            data.activityDates.forEach((dateStr: string) => {
                                actData[dateStr] = (actData[dateStr] || 0) + 1;
                            });
                        }
                        if (data.lastActiveDate) {
                            actData[data.lastActiveDate] = (actData[data.lastActiveDate] || 0) + 1;
                        }
                        setActivityData(actData);

                        const stats = {
                            streakDays: Number(data.streakDays || 0),
                            labsCompleted: Number(data.labsCompleted || 0),
                            skillScore: Number(data.skillScore || 0),
                            employabilityScore: Number(data.employabilityScore || 0),
                        };
                        setEarnedBadgeIds(evaluateBadges(stats));

                        if (data.githubUsername) {
                            setGithubUsername(data.githubUsername);
                            fetchGithubData(data.githubUsername);
                        }
                    }
                }
            } catch (err) {
                console.error('[Profile] Data fetch error:', err);
            } finally {
                setDataLoaded(true);
            }
        };

        fetchData();
    }, [user, loading, router]);

    if (!mounted || loading) return null;
    if (!user) return null;

    if (!dataLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
                <div className="skeu-card p-10 text-center">
                    <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Loading profile…</p>
                </div>
            </div>
        );
    }

    const handleConnectGithub = async () => {
        if (!githubUsernameInput.trim() || !user) return;
        try {
            setLoadingGithub(true);
            await updateDoc(doc(db, 'users', user.uid), {
                githubUsername: githubUsernameInput.trim()
            });
            setGithubUsername(githubUsernameInput.trim());
            const userRes = await fetch(`https://api.github.com/users/${githubUsernameInput.trim()}`);
            if (userRes.ok) setGithubData(await userRes.json());
            const reposRes = await fetch(`https://api.github.com/users/${githubUsernameInput.trim()}/repos?sort=updated&per_page=3`);
            if (reposRes.ok) setGithubRepos(await reposRes.json());
        } catch (e) {
            console.error('[Profile] GitHub connect error:', e);
        } finally {
            setLoadingGithub(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;
        if (!file.type.startsWith('image/jpeg') && !file.type.startsWith('image/png')) {
            alert('Please select a JPG or PNG image file');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert('Image size must be less than 2MB');
            return;
        }
        setUploadingImage(true);
        try {
            const storageRef = ref(storage, `profiles/${user.uid}.jpg`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed', () => {}, (err) => {
                console.error('[Profile] Upload error:', err);
                setUploadingImage(false);
                setImageError(true);
                alert('Failed to upload image');
            }, async () => {
                try {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    setProfileImageUrl(url);
                    setImageError(false);
                    await updateDoc(doc(db, 'users', user.uid), { profileImageUrl: url, photoURL: url });
                    await updateProfile(user, { photoURL: url });
                } catch (err) {
                    console.error('[Profile] Post-upload error:', err);
                } finally {
                    setUploadingImage(false);
                }
            });
        } catch (err) {
            console.error('[Profile] Image processing error:', err);
            setUploadingImage(false);
            setImageError(true);
            alert('Failed to process image');
        }
    };

    let skills = { syntax: 0, logic: 0, debug: 0 };
    try {
        const metricsKey = `skill_metrics_${user?.uid || 'guest'}`;
        const saved = localStorage.getItem(metricsKey);
        if (saved) {
            const m = JSON.parse(saved);
            skills = { syntax: Math.round((m.syntax || 0) * 100), logic: Math.round((m.logic || 0) * 100), debug: Math.round((m.debugging || 0) * 100) };
        }
    } catch { /* ignore */ }

    const displayName = studentName || user?.displayName || 'Pilot';
    const avatarUrl = profileImageUrl || user?.photoURL || '/default-avatar.png';
    const finalCollegeName = collegeName || 'Not specified';

    const xp = computeXP({
        streakDays,
        labsCompleted,
        skillScore,
        employabilityScore: Number(employabilityLevel === 'High' ? 85 : employabilityLevel === 'Medium' ? 50 : 20),
    });
    const levelName = computeLevel(xp);

    const radarSkills = [
        { label: 'Syntax', value: skills.syntax, color: '#006B7A' },
        { label: 'Logic', value: skills.logic, color: '#6366f1' },
        { label: 'Debug', value: skills.debug, color: '#F59E0B' },
    ].filter(s => s.value > 0);

    const resumeProfile = {
        displayName,
        email: user?.email || '',
        learningPath: courseName,
        collegeName: finalCollegeName,
        yearOfStudy,
        skillScore,
        labsCompleted,
        employabilityLevel,
        githubUsername,
        badges: earnedBadgeIds.map(id => BADGES.find(b => b.id === id)?.label || id),
        skills: radarSkills.length > 0 ? radarSkills : [{ label: 'Syntax', value: 0 }, { label: 'Logic', value: 0 }, { label: 'Debug', value: 0 }],
    };

    try {
        return (
            <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
                <nav className="skeu-navbar px-6 py-4">
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button onClick={() => router.push('/dashboard')} className="clay-btn clay-btn-secondary clay-btn-sm">← Dashboard</button>
                            <div className="h-4 w-px" style={{ background: 'var(--border-medium)' }} />
                            <span className="font-bold text-sm">👤 Profile</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ExportResume profile={resumeProfile} />
                            <NotificationBell uid={user.uid} />
                        </div>
                    </div>
                </nav>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                    {/* Profile Header */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="skeu-card-teal p-6 sm:p-8 mb-6 sm:mb-8">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-5">
                                <div
                                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white relative overflow-hidden cursor-pointer group shrink-0"
                                    style={{ background: 'linear-gradient(145deg, #14B8A6, #0D9488)', boxShadow: '6px 6px 14px rgba(13,148,136,0.2), inset 0 2px 0 rgba(255,255,255,0.2)' }}
                                    onClick={() => fileInput.current?.click()}
                                >
                                    {avatarUrl && avatarUrl !== '/default-avatar.png' && !imageError ? (
                                        <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" onError={() => setImageError(true)} />
                                    ) : (
                                        (displayName?.[0] || 'P').toUpperCase()
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <FiCamera className="text-white" size={24} />
                                    </div>
                                    {uploadingImage && (
                                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    )}
                                </div>
                                <input type="file" accept="image/jpeg, image/png" ref={fileInput} className="hidden" onChange={handleImageUpload} />

                                <div>
                                    <h1 className="font-black text-2xl flex items-center gap-3 flex-wrap" style={{ fontFamily: 'var(--font-display)' }}>
                                        {displayName}
                                        <span className="text-xs font-bold px-2 py-1 rounded" style={{
                                            background: 'rgba(0,107,122,0.12)',
                                            color: 'var(--peacock-blue)',
                                            border: '1px solid rgba(0,107,122,0.25)'
                                        }}>
                                            {levelName}
                                        </span>
                                        {employabilityLevel !== 'Unrated' && (
                                            <span className="text-xs font-bold px-2 py-1 rounded" style={{
                                                background: employabilityLevel.includes('High') ? 'rgba(16,185,129,0.15)' : employabilityLevel === 'Medium' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                                                color: employabilityLevel.includes('High') ? '#10B981' : employabilityLevel === 'Medium' ? '#F59E0B' : '#EF4444',
                                                border: `1px solid ${employabilityLevel.includes('High') ? 'rgba(16,185,129,0.3)' : employabilityLevel === 'Medium' ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`
                                            }}>
                                                {employabilityLevel}
                                            </span>
                                        )}
                                    </h1>
                                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user?.email || ''}</p>
                                    {(yearOfStudy || finalCollegeName !== 'Not specified') ? (
                                        <p className="text-xs mt-1 font-bold" style={{ color: 'var(--text-tertiary)' }}>
                                            {yearOfStudy ? `Year ${yearOfStudy}` : ''}{yearOfStudy && finalCollegeName !== 'Not specified' ? ' • ' : ''}{finalCollegeName !== 'Not specified' ? finalCollegeName : ''}
                                        </p>
                                    ) : (
                                        <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                                            {courseName ? `Learning: ${courseName}` : 'No college info yet'}
                                        </p>
                                    )}
                                    <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                                        Joined {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        <span className="mx-1.5">•</span>
                                        <span style={{ color: 'var(--peacock-blue)', fontWeight: 800 }}>{xp} XP</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {!githubUsername ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="GitHub Username"
                                            className="clay-input w-36 sm:w-40 text-sm"
                                            value={githubUsernameInput}
                                            onChange={(e) => setGithubUsernameInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleConnectGithub()}
                                        />
                                        <button onClick={handleConnectGithub} disabled={loadingGithub}
                                            className="clay-btn clay-btn-sm clay-btn-primary">
                                            {loadingGithub ? '...' : '🔗 Connect'}
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => window.open(`https://github.com/${githubUsername}`, '_blank')}
                                        className="clay-btn clay-btn-sm clay-btn-success">
                                        ✓ GitHub Connected
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Row */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <div className="skeu-card p-4 sm:p-5 text-center">
                            <p className="font-black text-2xl sm:text-3xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--peacock-blue)' }}>
                                {skillScore || <span className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>—</span>}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-tertiary)' }}>AI Skill Score</p>
                        </div>
                        <div className="skeu-card p-4 sm:p-5 text-center">
                            <p className="font-black text-2xl sm:text-3xl" style={{ fontFamily: 'var(--font-display)', color: '#6366f1' }}>
                                {labsCompleted || <span className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>—</span>}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-tertiary)' }}>Labs Done</p>
                        </div>
                        <div className="skeu-card p-4 sm:p-5 text-center">
                            <p className="font-black text-2xl sm:text-3xl" style={{ fontFamily: 'var(--font-display)', color: '#F59E0B' }}>
                                {streakDays ? <>{streakDays} <span className="text-lg ml-0.5">🔥</span></> : <span className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>—</span>}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-tertiary)' }}>Day Streak</p>
                        </div>
                        <div className="skeu-card p-4 sm:p-5 text-center">
                            <p className="font-black text-lg sm:text-xl" style={{ fontFamily: 'var(--font-display)', color: '#10B981' }}>
                                {courseName || <span style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>No path</span>}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-tertiary)' }}>Active Path</p>
                        </div>
                    </motion.div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        {/* Left Column: Skill Radar + Activity Heatmap */}
                        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                            {radarSkills.length > 0 ? (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="skeu-card p-5 sm:p-6">
                                    <h2 className="text-xs font-extrabold uppercase tracking-widest mb-4" style={{ color: 'var(--text-tertiary)' }}>Skill Radar</h2>
                                    <SkillRadar skills={radarSkills} />
                                </motion.div>
                            ) : (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="skeu-card p-5 sm:p-6">
                                    <h2 className="text-xs font-extrabold uppercase tracking-widest mb-4" style={{ color: 'var(--text-tertiary)' }}>Skill Radar</h2>
                                    <div className="text-center py-8">
                                        <span className="text-3xl block mb-2">📊</span>
                                        <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>No skill data yet</p>
                                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Run code in a lab to start tracking skills</p>
                                    </div>
                                </motion.div>
                            )}

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="skeu-card p-5 sm:p-6">
                                <h2 className="text-xs font-extrabold uppercase tracking-widest mb-4" style={{ color: 'var(--text-tertiary)' }}>Activity Heatmap</h2>
                                <ActivityHeatmap activityData={activityData} />
                            </motion.div>
                        </div>

                        {/* Right Column: Badges + Endorsements */}
                        <div className="space-y-4 sm:space-y-6">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="skeu-card p-5 sm:p-6">
                                <h2 className="text-xs font-extrabold uppercase tracking-widest mb-4" style={{ color: 'var(--text-tertiary)' }}>Badges</h2>
                                <BadgeShowcase
                                    earnedBadgeIds={earnedBadgeIds}
                                    stats={{ streakDays, labsCompleted, skillScore, employabilityScore: Number(employabilityLevel === 'High' ? 85 : employabilityLevel === 'Medium' ? 50 : 20) }}
                                />
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                                <PeerEndorsements profileUid={user.uid} />
                            </motion.div>
                        </div>
                    </div>

                    {/* Learning Goals + Social Links */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <LearningGoals />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                            <SocialLinks />
                        </motion.div>
                    </div>

                    {/* Recent Activity */}
                    {recentActivity.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-6 sm:mb-8">
                            <h2 className="text-xs font-extrabold uppercase tracking-widest mb-4" style={{ color: 'var(--text-tertiary)' }}>Recent Activity</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {recentActivity.map((activity, i) => (
                                    <div key={i} className="skeu-card p-4 border-l-4" style={{ borderLeftColor: 'var(--peacock-blue)' }}>
                                        <h3 className="font-bold text-sm truncate">{String(activity || '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                                        <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Completed</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* GitHub Integration */}
                    {githubUsername && githubData && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mb-6 sm:mb-8">
                            <h2 className="text-xs font-extrabold uppercase tracking-widest mb-4" style={{ color: 'var(--text-tertiary)' }}>GitHub Profile</h2>
                            <div className="skeu-card p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex flex-col items-center text-center md:w-1/3 border-b md:border-b-0 md:border-r border-gray-700/30 pb-6 md:pb-0 md:pr-6">
                                        <img src={(githubData as Record<string, string>)?.avatar_url || ''} alt={githubUsername} className="w-24 h-24 rounded-full shadow-lg mb-4" />
                                        <h3 className="font-bold text-lg">{(githubData as Record<string, string>)?.name || githubUsername}</h3>
                                        <p className="text-sm mb-3 text-gray-400">{(githubData as Record<string, string>)?.bio || 'No bio available.'}</p>
                                        <div className="flex gap-4 mb-4 text-xs">
                                            <div><span className="font-bold">{(githubData as Record<string, number>)?.public_repos ?? 0}</span> Repos</div>
                                            <div><span className="font-bold">{(githubData as Record<string, number>)?.followers ?? 0}</span> Followers</div>
                                            <div><span className="font-bold">{(githubData as Record<string, number>)?.following ?? 0}</span> Following</div>
                                        </div>
                                        <button onClick={() => window.open((githubData as Record<string, string>)?.html_url || `https://github.com/${githubUsername}`, '_blank')} className="clay-btn clay-btn-secondary clay-btn-sm w-full">
                                            View Profile
                                        </button>
                                    </div>
                                    <div className="md:w-2/3">
                                        <h3 className="font-bold text-sm mb-4 text-gray-300">Recent Repositories</h3>
                                        {githubRepos.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {githubRepos.map(repo => (
                                                    <div key={(repo as Record<string, string>)?.id || (repo as Record<string, string>)?.name} className="p-4 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)' }}>
                                                        <a href={(repo as Record<string, string>)?.html_url || '#'} target="_blank" rel="noopener noreferrer" className="font-bold text-sm text-teal-400 hover:underline block mb-1 truncate">
                                                            {(repo as Record<string, string>)?.name || 'Untitled'}
                                                        </a>
                                                        <p className="text-xs text-gray-400 mb-3 line-clamp-2" style={{ minHeight: '2rem' }}>
                                                            {(repo as Record<string, string>)?.description || 'No description'}
                                                        </p>
                                                        <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                                                            <span>{(repo as Record<string, string>)?.language || 'Unknown'}</span>
                                                            <span className="flex items-center gap-1">⭐ {(repo as Record<string, number>)?.stargazers_count ?? 0}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400">No public repositories found.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        );
    } catch (renderError) {
        console.error('[ProfilePageInner] Render Crash:', renderError);
        throw renderError;
    }
}

export default function ProfilePage() {
    return (
        <ProfileErrorBoundary>
            <ProfilePageInner />
        </ProfileErrorBoundary>
    );
}
