'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { db, storage } from '@/lib/firebase';
import { FiCamera } from 'react-icons/fi';
import { fetchResilient } from '@/lib/firestore-resilience';

export default function ProfilePage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [studentName, setStudentName] = useState('');
    const [courseName, setCourseName] = useState('');
    const [completedLevels, setCompletedLevels] = useState<string[]>([]);
    const [githubUsernameInput, setGithubUsernameInput] = useState('');
    const [githubUsername, setGithubUsername] = useState('');
    const [githubData, setGithubData] = useState<any>(null);
    const [githubRepos, setGithubRepos] = useState<any[]>([]);
    const [loadingGithub, setLoadingGithub] = useState(false);
    const [employabilityLevel, setEmployabilityLevel] = useState<string>('Unrated');

    // New State for Real Data
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [yearOfStudy, setYearOfStudy] = useState('');
    const [collegeName, setCollegeName] = useState('');
    const [skillScore, setSkillScore] = useState(0);
    const [labsCompleted, setLabsCompleted] = useState(0);
    const [streakDays, setStreakDays] = useState(0);
    const [recentActivity, setRecentActivity] = useState<string[]>([]);
    
    // Upload state
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMounted(true);
        if (!loading && !user) router.push('/auth');
        if (!user) return;
        
        const fetchData = async () => {
            try {
                // Read profile written by onboarding: key = 'pp_profile_' + user.uid
                const profileKey = 'pp_profile_' + user.uid;
                const d = localStorage.getItem(profileKey);
                if (d) {
                    const p = JSON.parse(d);
                    // Onboarding writes 'displayName' and 'learningPath'
                    if (p.displayName) setStudentName(p.displayName);
                    if (p.learningPath) setCourseName(p.learningPath);
                }
                // 'pathpilot_completed_levels' is written by the library page
                const saved = localStorage.getItem('pathpilot_completed_levels');
                if (saved) setCompletedLevels(JSON.parse(saved));

                // Fetch real data from firestore
                if (db) {
                    const snap = await fetchResilient(doc(db, 'users', user.uid));
                    if (snap && snap.exists()) {
                        const data = snap.data();
                        if (data.displayName) setStudentName(data.displayName);
                        if (data.learningPath) setCourseName(data.learningPath);
                        if (data.employabilityLevel) setEmployabilityLevel(data.employabilityLevel);
                        
                        if (data.skillScore) setSkillScore(data.skillScore);
                        if (data.labsCompleted) setLabsCompleted(data.labsCompleted);
                        if (data.streakDays) setStreakDays(data.streakDays);
                        if (data.profileImageUrl) setProfileImageUrl(data.profileImageUrl);
                        if (data.yearOfStudy) setYearOfStudy(data.yearOfStudy);
                        if (data.collegeName) setCollegeName(data.collegeName);
                        
                        const recent = [];
                        if (Array.isArray(data.completedLabsList)) recent.push(...data.completedLabsList);
                        if (Array.isArray(data.completedTopics)) recent.push(...data.completedTopics);
                        setRecentActivity(recent.slice(-3));

                        if (data.githubUsername) {
                            setGithubUsername(data.githubUsername);
                            fetchGithubData(data.githubUsername);
                        }
                    }
                }
            } catch { }
        };

        const fetchGithubData = async (username: string) => {
            try {
                setLoadingGithub(true);
                const userRes = await fetch(`https://api.github.com/users/${username}`);
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setGithubData(userData);
                }
                const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=3`);
                if (reposRes.ok) {
                    const reposData = await reposRes.json();
                    setGithubRepos(reposData);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingGithub(false);
            }
        };

        fetchData();
    }, [user, loading, router]);

    if (!mounted || loading) return null;

    const handleConnectGithub = async () => {
        if (!githubUsernameInput.trim() || !user) return;
        try {
            setLoadingGithub(true);
            await updateDoc(doc(db, 'users', user.uid), {
                githubUsername: githubUsernameInput.trim()
            });
            setGithubUsername(githubUsernameInput.trim());
            // Fetch github data
            const userRes = await fetch(`https://api.github.com/users/${githubUsernameInput.trim()}`);
            if (userRes.ok) {
                setGithubData(await userRes.json());
            }
            const reposRes = await fetch(`https://api.github.com/users/${githubUsernameInput.trim()}/repos?sort=updated&per_page=3`);
            if (reposRes.ok) {
                setGithubRepos(await reposRes.json());
            }
        } catch (e) {
            console.error(e);
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
            
            uploadTask.on(
                'state_changed',
                () => {},
                (err) => {
                    console.error(err);
                    setUploadingImage(false);
                    alert('Failed to upload image');
                },
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    setProfileImageUrl(url);
                    
                    await updateDoc(doc(db, 'users', user.uid), { profileImageUrl: url });
                    await updateProfile(user, { photoURL: url });
                    
                    setUploadingImage(false);
                }
            );
        } catch (err) {
            console.error('Image processing error:', err);
            setUploadingImage(false);
            alert('Failed to process image');
        }
    };

    // Read real skill metrics
    let skills = { syntax: 0, logic: 0, debug: 0 };
    try {
        const metricsKey = `skill_metrics_${user?.uid || 'guest'}`;
        const saved = localStorage.getItem(metricsKey);
        if (saved) {
            const m = JSON.parse(saved);
            skills = { syntax: Math.round((m.syntax || 0) * 100), logic: Math.round((m.logic || 0) * 100), debug: Math.round((m.debugging || 0) * 100) };
        }
    } catch { }
    const hasSkillData = skills.syntax > 0 || skills.logic > 0 || skills.debug > 0;

    const displayName = studentName || user?.displayName || 'Pilot';

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
            <nav className="skeu-navbar px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.push('/dashboard')} className="clay-btn clay-btn-secondary clay-btn-sm">← Dashboard</button>
                        <div className="h-4 w-px" style={{ background: 'var(--border-medium)' }} />
                        <span className="font-bold text-sm">👤 Profile</span>
                    </div>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-6 py-10">
                {/* Profile Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="skeu-card-teal p-8 mb-8">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-5">
                            <div 
                                className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white relative overflow-hidden cursor-pointer group"
                                style={{ background: 'linear-gradient(145deg, #14B8A6, #0D9488)', boxShadow: '6px 6px 14px rgba(13,148,136,0.2), inset 0 2px 0 rgba(255,255,255,0.2)' }}
                                onClick={() => fileInput.current?.click()}
                            >
                                {profileImageUrl ? (
                                    <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    displayName[0]?.toUpperCase()
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
                                <h1 className="font-black text-2xl flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
                                    {displayName}
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
                                {(yearOfStudy || collegeName) && (
                                    <p className="text-xs mt-1 font-bold" style={{ color: 'var(--text-tertiary)' }}>
                                        {yearOfStudy ? `Year ${yearOfStudy}` : ''} {yearOfStudy && collegeName ? '•' : ''} {collegeName}
                                    </p>
                                )}
                                <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                                    Joined {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {user && <NotificationBell uid={user.uid} />}
                            {!githubUsername ? (
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="GitHub Username" 
                                        className="clay-input w-40 text-sm"
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

                {/* Stats */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="skeu-card p-5 text-center">
                        <p className="font-black text-3xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-primary)' }}>
                            {skillScore}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-tertiary)' }}>AI Skill Score</p>
                    </div>
                    <div className="skeu-card p-5 text-center">
                        <p className="font-black text-3xl" style={{ fontFamily: 'var(--font-display)', color: '#6366f1' }}>
                            {labsCompleted}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-tertiary)' }}>Labs Completed</p>
                    </div>
                    <div className="skeu-card p-5 text-center">
                        <p className="font-black text-3xl" style={{ fontFamily: 'var(--font-display)', color: '#F59E0B' }}>
                            {streakDays} <span className="text-xl">🔥</span>
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-tertiary)' }}>Day Streak</p>
                    </div>
                    <div className="skeu-card p-5 text-center">
                        <p className="font-black text-xl flex items-center justify-center h-[36px]" style={{ fontFamily: 'var(--font-display)', color: '#10B981' }}>
                            {courseName || 'None'}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-tertiary)' }}>Active Path</p>
                    </div>
                </motion.div>

                {/* Skills & Badges Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8 skeu-card p-6">
                    <h2 className="text-xs font-extrabold uppercase tracking-widest mb-4" style={{ color: 'var(--text-tertiary)' }}>Skills & Badges</h2>
                    <div className="flex gap-4 flex-wrap">
                        {labsCompleted > 10 && (
                            <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-xl">
                                <span className="text-2xl">🏆</span>
                                <div>
                                    <p className="text-xs font-black text-amber-600">Pro Coder</p>
                                    <p className="text-[10px] text-amber-600/70">10+ Labs Completed</p>
                                </div>
                            </div>
                        )}
                        {streakDays > 3 && (
                            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-xl">
                                <span className="text-2xl">🔥</span>
                                <div>
                                    <p className="text-xs font-black text-red-600">Consistency</p>
                                    <p className="text-[10px] text-red-600/70">3+ Day Streak</p>
                                </div>
                            </div>
                        )}
                        {labsCompleted <= 10 && streakDays <= 3 && (
                            <div className="text-sm text-gray-500 w-full text-center py-4">
                                Complete more labs and maintain your streak to earn badges!
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Portfolio */}
                {/* Recent Activity */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
                    <h2 className="text-xs font-extrabold uppercase tracking-widest mb-4" style={{ color: 'var(--text-tertiary)' }}>Recent Activity</h2>
                    {recentActivity.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {recentActivity.map((activity, i) => (
                                <div key={i} className="skeu-card p-6 border-l-4" style={{ borderLeftColor: 'var(--accent-primary)' }}>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold text-sm truncate pr-2">{activity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                                        <span className="badge-low text-[10px] shrink-0">Done</span>
                                    </div>
                                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Completed</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="skeu-card p-10 text-center">
                            <span className="text-4xl block mb-3">🚀</span>
                            <h3 className="font-bold text-base mb-2">No activity yet</h3>
                            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                                Complete labs or topics to see them here.
                            </p>
                            <button onClick={() => router.push('/labs')} className="clay-btn clay-btn-primary clay-btn-sm">
                                Start Learning
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* GitHub Integration Section */}
                {githubUsername && githubData && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-8">
                        <h2 className="text-xs font-extrabold uppercase tracking-widest mb-4" style={{ color: 'var(--text-tertiary)' }}>GitHub Profile</h2>
                        <div className="skeu-card p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Github User Info */}
                                <div className="flex flex-col items-center text-center md:w-1/3 border-b md:border-b-0 md:border-r border-gray-700/30 pb-6 md:pb-0 md:pr-6">
                                    <img src={githubData.avatar_url} alt={githubUsername} className="w-24 h-24 rounded-full shadow-lg mb-4" />
                                    <h3 className="font-bold text-lg">{githubData.name || githubUsername}</h3>
                                    <p className="text-sm mb-3 text-gray-400">{githubData.bio || 'No bio available.'}</p>
                                    
                                    <div className="flex gap-4 mb-4 text-xs">
                                        <div><span className="font-bold">{githubData.public_repos}</span> Repos</div>
                                        <div><span className="font-bold">{githubData.followers}</span> Followers</div>
                                        <div><span className="font-bold">{githubData.following}</span> Following</div>
                                    </div>
                                    <button onClick={() => window.open(githubData.html_url, '_blank')} className="clay-btn clay-btn-secondary clay-btn-sm w-full">
                                        View Profile
                                    </button>
                                </div>
                                
                                {/* Recent Repos */}
                                <div className="md:w-2/3">
                                    <h3 className="font-bold text-sm mb-4 text-gray-300">Recently Updated Repositories</h3>
                                    {githubRepos.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {githubRepos.map(repo => (
                                                <div key={repo.id} className="p-4 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)' }}>
                                                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="font-bold text-sm text-teal-400 hover:underline block mb-1 truncate">
                                                        {repo.name}
                                                    </a>
                                                    <p className="text-xs text-gray-400 mb-3 line-clamp-2" style={{ minHeight: '2rem' }}>
                                                        {repo.description || 'No description'}
                                                    </p>
                                                    <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                                                        <span>{repo.language || 'Unknown'}</span>
                                                        <span className="flex items-center gap-1">⭐ {repo.stargazers_count}</span>
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

                {/* Skill History */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="skeu-card p-8">
                    <h2 className="text-xs font-extrabold uppercase tracking-widest mb-6" style={{ color: 'var(--text-tertiary)' }}>Skills</h2>
                    {hasSkillData ? (
                        <div className="space-y-5">
                            {[
                                { label: 'Syntax', value: skills.syntax, color: '#0D9488' },
                                { label: 'Logic', value: skills.logic, color: '#6366f1' },
                                { label: 'Debugging', value: skills.debug, color: '#F59E0B' },
                            ].map((skill, i) => (
                                <div key={i}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ background: skill.color, boxShadow: 'var(--clay-shadow-sm)' }} />
                                            <span className="text-xs font-bold">{skill.label}</span>
                                        </div>
                                        <span className="text-xs font-bold" style={{ color: skill.color }}>{skill.value}%</span>
                                    </div>
                                    <div className="skill-bar">
                                        <motion.div className="skill-bar-fill" initial={{ width: 0 }}
                                            animate={{ width: `${skill.value}%` }}
                                            transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                                            style={{ background: `linear-gradient(90deg, ${skill.color}, ${skill.color}aa)` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <span className="text-3xl block mb-3">📊</span>
                            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>No skill data yet</p>
                            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Run code in a lab to start tracking your skills</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
