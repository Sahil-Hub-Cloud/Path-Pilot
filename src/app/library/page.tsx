'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';
import { ROADMAPS } from '@/lib/data/roadmaps';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
interface LevelData {
    id: string; title: string; description: string; difficulty: string;
    duration: string; chapterTitle: string; status: 'completed' | 'current' | 'locked'; index: number;
    youtubeUrl?: string; pdfs?: {name: string; url: string}[];
}

export default function RoadmapPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [levels, setLevels] = useState<LevelData[]>([]);
    const [courseName, setCourseName] = useState('');
    const [courseIcon, setCourseIcon] = useState('📚');
    const [selectedLevel, setSelectedLevel] = useState<LevelData | null>(null);
    const [completedLevels, setCompletedLevels] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'summary' | 'pdfs'>('summary');

    useEffect(() => {
        if (!loading && !user) { router.push('/auth'); return; }
        if (!loading && user && typeof window !== 'undefined') {
            const savedStudent = localStorage.getItem('pathpilot_student');
            let courseId = 'frontend_react';
            if (savedStudent) { try { const d = JSON.parse(savedStudent); if (d.selectedCourse) courseId = d.selectedCourse; } catch { } }
            const roadmap = ROADMAPS[courseId as keyof typeof ROADMAPS] || ROADMAPS.frontend_react;
            setCourseName(roadmap.title); setCourseIcon(roadmap.icon);
            
            const loadProgress = async () => {
                let completed: string[] = [];
                const saved = localStorage.getItem('pathpilot_completed_levels');
                if (saved) { try { completed = JSON.parse(saved); } catch { } }

                try {
                    const docRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists() && docSnap.data().libraryCompleted) {
                        completed = docSnap.data().libraryCompleted;
                        // Keep localStorage in sync
                        localStorage.setItem('pathpilot_completed_levels', JSON.stringify(completed));
                    } else if (completed.length > 0) {
                        // Migrate existing localStorage to Firestore
                        await setDoc(docRef, { libraryCompleted: completed }, { merge: true });
                    }
                } catch (err) {
                    console.warn('Firestore unavailable, using localStorage for library progress');
                }

                setCompletedLevels(completed);
                let allLevels: LevelData[] = []; let idx = 0;
                roadmap.chapters.forEach(chapter => {
                    chapter.topics.forEach((topic: any) => {
                        const isCompleted = completed.includes(topic.id);
                        const prevCompleted = idx === 0 || completed.includes(allLevels[idx - 1]?.id);
                        allLevels.push({
                            id: topic.id, title: topic.title, description: `Master ${topic.title} through hands-on practice.`,
                            difficulty: topic.difficulty, duration: topic.duration, chapterTitle: chapter.title,
                            youtubeUrl: topic.youtubeUrl, pdfs: topic.pdfs || [],
                            status: isCompleted ? 'completed' : prevCompleted ? 'current' : 'locked', index: idx,
                        }); idx++;
                    });
                });
                setLevels(allLevels);
                const firstCurrent = allLevels.find(l => l.status === 'current');
                if (firstCurrent) setSelectedLevel(firstCurrent);
                else if (allLevels.length) setSelectedLevel(allLevels[0]);
            };

            loadProgress();
        }
    }, [user, loading, router]);

    const handleCompleteLevel = async (levelId: string) => {
        const updated = [...completedLevels, levelId];
        setCompletedLevels(updated);
        localStorage.setItem('pathpilot_completed_levels', JSON.stringify(updated));
        
        if (user) {
            try {
                const docRef = doc(db, 'users', user.uid);
                await setDoc(docRef, { libraryCompleted: updated }, { merge: true });
            } catch (err) {
                console.warn('Failed to save library progress to Firestore', err);
            }
        }

        setLevels(prev => prev.map((lvl, i) => {
            const isCompleted = updated.includes(lvl.id);
            const prevCompleted = i === 0 || updated.includes(prev[i - 1]?.id);
            return { ...lvl, status: isCompleted ? 'completed' : prevCompleted ? 'current' : 'locked' };
        }));
    };

    const difficultyColors: Record<string, string> = { Easy: '#10b981', Medium: '#F59E0B', Hard: '#EF4444' };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
            <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--bg-inset)', borderTopColor: 'var(--accent-primary)' }} />
        </div>
    );

    return (
        <div className="h-screen flex flex-col" style={{ background: 'var(--bg-base)' }}>
            {/* Navbar */}
            <nav className="skeu-navbar px-6 py-3 flex-shrink-0 z-20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.push('/dashboard')} className="clay-btn clay-btn-secondary clay-btn-sm">← Dashboard</button>
                        <div className="h-4 w-px" style={{ background: 'var(--border-medium)' }} />
                        <span className="text-sm font-bold">{courseIcon} {courseName}</span>
                        <span className="skeu-badge" style={{ padding: '4px 10px', fontSize: '0.7rem' }}>
                            {completedLevels.length}/{levels.length}
                        </span>
                    </div>
                    <button onClick={() => router.push('/chat')} className="clay-btn clay-btn-secondary clay-btn-sm">🧠 AI Tutor</button>
                </div>
            </nav>

            {/* Split View */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left (60%): Content Area */}
                <div className="w-[60%] flex flex-col border-r overflow-y-auto" style={{ borderColor: 'var(--border-light)' }}>
                    {selectedLevel ? (
                        <div className="p-6 flex-1">
                            {/* Video Player */}
                            <div className="video-container mb-6 overflow-hidden relative" style={{ paddingTop: '56.25%', borderRadius: '16px' }}>
                                {selectedLevel.youtubeUrl ? (
                                    <iframe 
                                        className="absolute top-0 left-0 w-full h-full"
                                        src={selectedLevel.youtubeUrl}
                                        title={selectedLevel.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'var(--bg-inset)' }}>
                                        <span className="text-4xl mb-3">🎥</span>
                                        <p className="font-bold text-sm">{selectedLevel.title}</p>
                                        <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Video coming soon</p>
                                    </div>
                                )}
                            </div>

                            {/* Content Tabs */}
                            <div className="flex items-center gap-1 mb-5 p-1 rounded-xl" style={{ background: 'var(--bg-inset)', boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.04)' }}>
                                {(['summary', 'pdfs'] as const).map(tab => (
                                    <button key={tab} onClick={() => setActiveTab(tab)}
                                        className="flex-1 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                                        style={{
                                            background: activeTab === tab ? 'var(--bg-card)' : 'transparent',
                                            color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-tertiary)',
                                            boxShadow: activeTab === tab ? 'var(--clay-shadow-sm)' : 'none',
                                        }}>
                                        {tab === 'summary' ? '📝 Summary' : '📄 PDFs'}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="skeu-card p-6">
                                {activeTab === 'summary' ? (
                                    <div>
                                        <h3 className="font-bold text-base mb-3">{selectedLevel.title}</h3>
                                        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                                            {selectedLevel.description} This module covers core concepts with practical exercises and real-world examples.
                                        </p>
                                        <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                            <p>• Key concepts and theory</p>
                                            <p>• Code examples and walkthroughs</p>
                                            <p>• Practice exercises</p>
                                            <p>• Common pitfalls and best practices</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {(selectedLevel.pdfs && selectedLevel.pdfs.length > 0 ? selectedLevel.pdfs : [{name: 'Module Notes.pdf', url: '#'}, {name: 'Cheat Sheet.pdf', url: '#'}, {name: 'Practice Problems.pdf', url: '#'}]).map((pdf: any, i: number) => (
                                            <a key={i} href={pdf.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--accent-bg)] cursor-pointer transition-colors"
                                                style={{ border: '1px solid var(--border-light)' }}>
                                                <span className="text-lg">📄</span>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold">{pdf.name}</p>
                                                    <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>PDF Resource</p>
                                                </div>
                                                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>↗</span>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>← Select a module</p>
                        </div>
                    )}

                    {/* Sticky Open Lab Button */}
                    {selectedLevel && selectedLevel.status !== 'locked' && (
                        <div className="sticky bottom-0 p-4 border-t" style={{ borderColor: 'var(--border-light)', background: 'rgba(251,247,240,0.95)', backdropFilter: 'blur(8px)' }}>
                            <button onClick={() => router.push('/labs')} className="clay-btn clay-btn-primary w-full">
                                🔬 Open Lab
                            </button>
                        </div>
                    )}
                </div>

                {/* Right (40%): Module Checklist */}
                <div className="w-[40%] overflow-y-auto p-5" style={{ background: 'var(--bg-surface)' }}>
                    <h3 className="text-xs font-extrabold uppercase tracking-widest mb-4" style={{ color: 'var(--text-tertiary)' }}>
                        Module Checklist
                    </h3>
                    <div className="mb-5">
                        <div className="skill-bar" style={{ height: 6 }}>
                            <motion.div className="skill-bar-fill" initial={{ width: 0 }}
                                animate={{ width: `${levels.length ? (completedLevels.length / levels.length) * 100 : 0}%` }}
                                transition={{ duration: 1 }} />
                        </div>
                        <p className="text-[10px] mt-1 font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                            {levels.length ? Math.round((completedLevels.length / levels.length) * 100) : 0}% complete
                        </p>
                    </div>
                    <div className="space-y-1">
                        {levels.map((level, i) => {
                            const isNewChapter = i === 0 || level.chapterTitle !== levels[i - 1]?.chapterTitle;
                            return (
                                <div key={level.id}>
                                    {isNewChapter && (
                                        <div className="pt-4 pb-2">
                                            <p className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: 'var(--accent-primary)' }}>
                                                📖 {level.chapterTitle}
                                            </p>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => level.status !== 'locked' && setSelectedLevel(level)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all
                                            ${selectedLevel?.id === level.id ? 'bg-[var(--accent-bg-strong)]' : 'hover:bg-[var(--accent-bg)]'}
                                            ${level.status === 'locked' ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                                        style={selectedLevel?.id === level.id ? { boxShadow: 'var(--clay-shadow-sm)', border: '1px solid var(--border-accent)' } : {}}>
                                        <div className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-bold"
                                            style={{
                                                background: level.status === 'completed' ? 'var(--accent-primary)' : 'var(--bg-card)',
                                                border: level.status === 'completed' ? 'none' : '1.5px solid var(--border-medium)',
                                                color: level.status === 'completed' ? '#fff' : 'var(--text-tertiary)',
                                                boxShadow: 'var(--clay-shadow-sm)',
                                            }}
                                            onClick={(e) => { e.stopPropagation(); if (level.status !== 'locked' && level.status !== 'completed') handleCompleteLevel(level.id); }}>
                                            {level.status === 'completed' ? '✓' : level.status === 'locked' ? '🔒' : ''}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-semibold truncate ${level.status === 'completed' ? 'line-through' : ''}`}
                                                style={{ color: level.status === 'completed' ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>
                                                {level.title}
                                            </p>
                                        </div>
                                        <span className="text-[8px] font-bold px-2 py-0.5 rounded-full"
                                            style={{ background: `${difficultyColors[level.difficulty]}15`, color: difficultyColors[level.difficulty] }}>
                                            {level.difficulty[0]}
                                        </span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
