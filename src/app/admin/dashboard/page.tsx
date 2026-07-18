'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

type Tab = 'overview' | 'cohorts' | 'content' | 'students' | 'analytics' | 'copilot';

interface Cohort {
    id: string;
    name: string;
    course_id: string;
    invite_code: string;
    member_count: number;
    is_active: boolean;
}

interface ContentItem {
    id: string;
    title: string;
    content_type: string;
    file_url?: string;
    created_at: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const { user, loading, role, institutionId, isAdmin } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [cohorts, setCohorts] = useState<Cohort[]>([]);
    const [content, setContent] = useState<ContentItem[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [analytics, setAnalytics] = useState<any>(null);
    const [loadingData, setLoadingData] = useState(false);

    // Copilot state
    const [copilotTopic, setCopilotTopic] = useState('');
    const [copilotDifficulty, setCopilotDifficulty] = useState('medium');
    const [copilotResult, setCopilotResult] = useState<any>(null);
    const [copilotLoading, setCopilotLoading] = useState(false);

    // Cohort form state
    const [newCohortName, setNewCohortName] = useState('');
    const [newCohortCourse, setNewCohortCourse] = useState('');

    // Content form state
    const [newContentTitle, setNewContentTitle] = useState('');
    const [newContentType, setNewContentType] = useState('pdf');
    const [newContentUrl, setNewContentUrl] = useState('');

    // CSV state
    const [csvText, setCsvText] = useState('');
    const [selectedCohortForInvite, setSelectedCohortForInvite] = useState('');
    const [inviteResults, setInviteResults] = useState<any>(null);
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [studentFilter, setStudentFilter] = useState<'all' | 'at-risk' | 'active'>('all');
    const [selectedStudentDetail, setSelectedStudentDetail] = useState<any | null>(null);

    // Exam Scheduler State
    const [exams, setExams] = useState<any[]>([]);
    const [examTitle, setExamTitle] = useState('');
    const [examCohort, setExamCohort] = useState('');
    const [examDate, setExamDate] = useState('');
    const [examDuration, setExamDuration] = useState('60');

    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const handleSignOut = async () => {
        try {
            if (auth) await signOut(auth);
            router.push('/auth');
        } catch (e) {
            console.error('Sign out failed:', e);
        }
    };

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/auth');
            } else if ((role as string) && (role as string) !== 'admin') {
                if ((role as string) === 'student') router.push('/dashboard');
                else if ((role as string) === 'college') router.push('/college/dashboard');
                else if ((role as string) === 'company') router.push('/company/dashboard');
                else router.push('/dashboard');
            }
        }
    }, [loading, user, role, router]);

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user, institutionId, activeTab]);

    const loadData = async () => {
        if (!user || !institutionId) return;
        setLoadingData(true);

        try {
            if (activeTab === 'overview' || activeTab === 'cohorts') {
                const res = await fetch(`/api/admin/cohort?userId=${user.uid}`);
                const data = await res.json();
                if (data.success) setCohorts(data.cohorts);
            }

            if (activeTab === 'overview' || activeTab === 'content') {
                const res = await fetch(`/api/admin/content?userId=${user.uid}&institutionId=${institutionId}`);
                const data = await res.json();
                if (data.success) setContent(data.content);
            }

            if (activeTab === 'overview' || activeTab === 'students') {
                const res = await fetch(`/api/admin/users?userId=${user.uid}`);
                const data = await res.json();
                if (data.success) {
                    if (db) {
                        const enrichedUsers = await Promise.all(data.users.map(async (u: any) => {
                            try {
                                const snap = await getDoc(doc(db, 'users', u.user_id));
                                if (snap.exists()) {
                                    const fd = snap.data();
                                    u.lastActive = fd.lastActive;
                                    u.streakDays = fd.streakDays || fd.streak || 0;
                                    u.displayName = fd.displayName || u.email;
                                }
                            } catch(e) {}
                            return u;
                        }));
                        setUsers(enrichedUsers);
                    } else {
                        setUsers(data.users);
                    }
                }
            }

            if (activeTab === 'analytics') {
                const res = await fetch(`/api/admin/analytics?userId=${user.uid}&scope=institution`);
                const data = await res.json();
                if (data.success) setAnalytics(data.analytics);
            }

            if (activeTab === 'copilot') {
                const res = await fetch(`/api/admin/exams?institutionId=${institutionId}`);
                const data = await res.json();
                if (data.success) setExams(data.exams);
            }
        } catch (e) {
            console.error('Failed to load admin data:', e);
        } finally {
            setLoadingData(false);
        }
    };

    const handleCreateCohort = async () => {
        if (!newCohortName.trim() || !user) return;
        try {
            const res = await fetch('/api/admin/cohort', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.uid,
                    name: newCohortName,
                    courseId: newCohortCourse || undefined,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setNewCohortName('');
                setNewCohortCourse('');
                loadData();
            }
        } catch (e) {
            console.error('Create cohort failed:', e);
        }
    };

    const handleUploadContent = async () => {
        if (!newContentTitle.trim() || !user || !institutionId) return;
        try {
            const res = await fetch('/api/admin/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.uid,
                    institutionId,
                    title: newContentTitle,
                    contentType: newContentType,
                    fileUrl: newContentUrl || undefined,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setNewContentTitle('');
                setNewContentUrl('');
                loadData();
            }
        } catch (e) {
            console.error('Upload content failed:', e);
        }
    };

    const handleBulkInvite = async () => {
        if (!csvText.trim() || !user) return;
        const lines = csvText.trim().split('\n');
        const students = lines.map(line => {
            const parts = line.split(',').map(p => p.trim());
            return { name: parts[0] || '', email: parts[1] || parts[0] || '' };
        }).filter(s => s.email.includes('@'));

        if (students.length === 0) return;

        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.uid,
                    action: 'bulk_invite',
                    students,
                    cohortId: selectedCohortForInvite || undefined,
                }),
            });
            const data = await res.json();
            setInviteResults(data);
            setCsvText('');
            loadData();
        } catch (e) {
            console.error('Bulk invite failed:', e);
        }
    };

    const handleDeleteContent = async (contentId: string) => {
        if (!user || !confirm('Confirm deletion of this asset?')) return;
        try {
            const res = await fetch('/api/admin/content', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid, contentId }),
            });
            const data = await res.json();
            if (data.success) loadData();
        } catch (e) {
            console.error('Delete content failed:', e);
        }
    };

    const handleDownloadStudentReport = async (student: any) => {
        if (!db) return;
        try {
            const snap = await getDoc(doc(db, 'users', student.user_id));
            const data = snap.exists() ? snap.data() : {};
            
            const studentName = data.displayName || student.email || 'Student';
            const college = student.cohort || 'Path Pilot Academy';
            const track = data.learningPath || 'Unassigned';
            const level = data.proficiencyLevel || 'Beginner';
            const labsCount = data.labsCompleted || 0;
            const skillScore = data.skillScore || 0;
            const empLevel = data.employabilityLevel || 'Unrated';
            const streak = data.streakDays || data.streak || 0;

            const completedLabs = data.completedLabsList || Array.from({length: labsCount}).map((_, i) => ({
                name: `Protocol Lab 0${i + 1}`,
                date: new Date(Date.now() - i * 86400000).toLocaleDateString()
            }));

            const html = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>${studentName.replace(/\s+/g, '_')}_PathPilot_Report</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; }
                        .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
                        .header h1 { color: #4f46e5; margin: 0 0 10px 0; font-size: 28px; }
                        .header p { color: #64748b; margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
                        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px; }
                        .card { padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc; }
                        .card h3 { margin-top: 0; color: #334155; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; }
                        .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 15px; }
                        .label { font-weight: 600; color: #475569; }
                        .val { font-weight: 700; color: #0f172a; }
                        table { border-collapse: collapse; margin-top: 20px; width: 100%; }
                        th, td { text-align: left; padding: 12px 16px; border-bottom: 1px solid #e2e8f0; }
                        th { background: #f1f5f9; color: #475569; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
                        td { font-size: 14px; font-weight: 500; color: #334155; }
                        .emp-high { color: #10b981; } .emp-med { color: #f59e0b; } .emp-low { color: #ef4444; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Path Pilot Progress Report</h1>
                        <p>Official Academic Registry</p>
                    </div>
                    
                    <div class="grid">
                        <div class="card">
                            <h3>Student Profile</h3>
                            <div class="row"><span class="label">Name:</span> <span class="val">${studentName}</span></div>
                            <div class="row"><span class="label">College/Unit:</span> <span class="val">${college}</span></div>
                            <div class="row"><span class="label">Learning Track:</span> <span class="val">${track}</span></div>
                            <div class="row"><span class="label">Maturity Level:</span> <span class="val">${level}</span></div>
                        </div>
                        <div class="card">
                            <h3>Performance Metrics</h3>
                            <div class="row"><span class="label">Labs Completed:</span> <span class="val">${labsCount}</span></div>
                            <div class="row"><span class="label">Skill Score:</span> <span class="val">${skillScore}/100</span></div>
                            <div class="row"><span class="label">Employability:</span> <span class="val ${empLevel.includes('High') ? 'emp-high' : empLevel === 'Medium' ? 'emp-med' : 'emp-low'}">${empLevel}</span></div>
                            <div class="row"><span class="label">Active Streak:</span> <span class="val">${streak} Days</span></div>
                        </div>
                    </div>

                    <h3 style="color: #334155; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Completed Labs Register</h3>
                    
                    ${labsCount > 0 ? `
                    <table>
                        <thead>
                            <tr>
                                <th>Lab Title / Designation</th>
                                <th style="text-align: right;">Completion Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${completedLabs.map((l: any) => `
                                <tr>
                                    <td>${l.name}</td>
                                    <td style="text-align: right;">${l.date}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    ` : '<p style="color: #64748b; font-size: 14px; margin-top: 20px;">No labs have been completed yet.</p>'}
                    
                    <script>
                        window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 300); }
                    </script>
                </body>
            </html>
            `;
            
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.open();
                printWindow.document.write(html);
                printWindow.document.close();
            }
        } catch (e) {
            console.error('Error generating report:', e);
            alert('Failed to generate report.');
        }
    };

    const handleSendNudge = async (student: any, inactiveDays: number) => {
        try {
            const bodyHtml = `
                <div style="font-family: sans-serif; color: #333; padding: 20px;">
                    <h2 style="color: #4f46e5;">Path Pilot</h2>
                    <p>Hi ${student.displayName || student.email.split('@')[0]},</p>
                    <p>You have not logged in for <strong>${inactiveDays} days</strong>.</p>
                    <p>Your current streak is <strong>${student.streakDays || 0} days</strong>. Your streak is at risk!</p>
                    <p>Come back and keep building your skills.</p>
                    <a href="https://pathpilot.dev/dashboard" style="display: inline-block; padding: 10px 20px; background: #d97706; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">Click here to continue</a>
                </div>
            `;
            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: student.user_id,
                    to: student.email,
                    subject: 'Your Path Pilot streak is waiting for you',
                    body: bodyHtml
                })
            });
            const data = await res.json();
            if (data.success) {
                alert(`Nudge sent successfully to ${student.email}`);
            } else {
                alert(`Failed to send nudge: ${data.error}`);
            }
        } catch (e) {
            console.error(e);
            alert('An unexpected error occurred while sending the nudge.');
        }
    };

    const handleAIDeploy = async (action: string) => {
        if (!copilotTopic.trim() || !user) return;
        setCopilotLoading(true);
        try {
            const res = await fetch('/api/admin/copilot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.uid,
                    action,
                    topic: copilotTopic,
                    difficulty: copilotDifficulty,
                    numQuestions: 5,
                }),
            });
            const data = await res.json();
            if (data.success) setCopilotResult(data.quiz || data.challenge);
        } catch (e) {
            console.error('AI Deploy failed:', e);
        } finally {
            setCopilotLoading(false);
        }
    };

    const handleScheduleExam = async () => {
        if (!examTitle.trim() || !examCohort || !examDate || !user || !institutionId) return;
        try {
            const res = await fetch('/api/admin/exams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    institutionId,
                    cohortId: examCohort,
                    title: examTitle,
                    scheduledAt: examDate,
                    durationMinutes: parseInt(examDuration),
                }),
            });
            const data = await res.json();
            if (data.success) {
                setExamTitle('');
                setExamCohort('');
                setExamDate('');
                loadData();
            }
        } catch (e) {
            console.error('Schedule exam failed:', e);
        }
    };

    const hours = currentTime?.getHours() ?? 12;
    const greeting = hours < 12 ? 'Good Morning' : hours < 17 ? 'Good Afternoon' : 'Good Evening';
    const setupSteps = [
        { label: 'Create your first cohort', done: cohorts.length > 0, tab: 'cohorts' as Tab },
        { label: 'Upload course content', done: content.length > 0, tab: 'content' as Tab },
        { label: 'Invite students', done: users.filter(u => u.role === 'student').length > 0, tab: 'students' as Tab },
        { label: 'Generate a quiz with AI', done: false, tab: 'copilot' as Tab },
    ];
    const setupProgress = setupSteps.filter(s => s.done).length;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(145deg, #818CF8, #6366F1)', boxShadow: '6px 6px 14px rgba(99,102,241,0.25)' }}>
                        <motion.span animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="text-2xl">⚙️</motion.span>
                    </div>
                    <p className="font-bold" style={{ color: 'var(--text-secondary)' }}>Loading Admin Dashboard...</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Preparing your institution data</p>
                </motion.div>
            </div>
        );
    }

    const TABS: { id: Tab; label: string; icon: string; desc: string }[] = [
        { id: 'overview', label: 'Command Hub', icon: '📊', desc: 'Corporate overview' },
        { id: 'cohorts', label: 'Training Spaces', icon: '🏢', desc: 'Manage departments' },
        { id: 'content', label: 'LMS Repository', icon: '📁', desc: 'Digital assets' },
        { id: 'students', label: 'HR Personnel', icon: '👥', desc: 'Interns & Staff' },
        { id: 'analytics', label: 'Skill Matrix', icon: '📈', desc: 'Performance insights' },
        { id: 'copilot', label: 'Exam Engine', icon: '⚙️', desc: 'AI Assessment' },
    ];

    // Add a specialized link for Syllabus Upload
    const handleSyllabusUploadClick = () => {
        router.push('/admin/syllabus-upload');
    };

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
            {/* Decorative background elements */}
            <div className="fixed top-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)' }} />
            <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%)' }} />

            {/* Header / Top Bar */}
            <header className="sticky top-0 z-50 px-8 py-4 flex items-center justify-between border-b" style={{ backgroundColor: 'var(--surface-raised)', borderColor: '#F1F5F9' }}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #0F172A, #334155)' }}>
                        P
                    </div>
                    <div>
                        <h1 className="font-extrabold text-xl tracking-tight text-slate-900">
                            Path Pilot <span className="text-indigo-600 font-black ml-1 uppercase text-[10px] tracking-[0.2em]">Corporate LMS</span>
                        </h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Secure Network</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                            {user?.email?.charAt(0)}
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-bold text-slate-900 leading-tight">{user?.email}</p>
                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter">Company Administrator</p>
                        </div>
                    </div>
                    
                    <div className="h-8 w-[1px] bg-slate-100 hidden md:block" />
                    
                    <button onClick={handleSignOut} 
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 transition-all hover:bg-slate-800 active:scale-95 shadow-md">
                        Logout System
                    </button>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar Navigation */}
                <aside className="w-72 min-h-[calc(100vh-80px)] p-6 bg-slate-50/50 hidden md:block border-r border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 px-3 text-slate-400">Management Scope</p>
                    <nav className="space-y-2">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300 group"
                                style={activeTab === tab.id ? {
                                    background: '#0F172A',
                                    color: '#FFFFFF',
                                    boxShadow: '0 10px 20px -5px rgba(15, 23, 42, 0.3)',
                                } : {
                                    color: '#64748B',
                                }}
                            >
                                <span className={`text-xl transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                                    {tab.icon}
                                </span>
                                <div className="text-left">
                                    <div className="leading-none mb-1">{tab.label}</div>
                                    <div className={`text-[10px] font-medium uppercase tracking-tighter ${activeTab === tab.id ? 'text-slate-400' : 'text-slate-400 group-hover:text-slate-500'}`}>
                                        {tab.desc}
                                    </div>
                                </div>
                                {activeTab === tab.id && (
                                    <motion.div layoutId="activeInd" className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                )}
                            </button>
                        ))}

                        <div className="pt-4 mt-4 border-t border-slate-100">
                            <button
                                onClick={handleSyllabusUploadClick}
                                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300 group hover:bg-slate-100"
                                style={{ color: '#64748B' }}
                            >
                                <span className="text-xl group-hover:scale-110 transition-transform">📄</span>
                                <div className="text-left">
                                    <div className="leading-none mb-1 text-indigo-600">Syllabus Upload</div>
                                    <div className="text-[10px] font-medium uppercase tracking-tighter text-slate-400 group-hover:text-slate-500">
                                        Custom Roadmap Engine
                                    </div>
                                </div>
                            </button>
                        </div>
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="mt-12 p-6 rounded-3xl bg-white dark:bg-gray-800 border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-50 opacity-30 rounded-bl-full" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-2">Corporate Insight</p>
                        <p className="text-[11px] font-medium leading-relaxed text-slate-500">
                            Automation active: AI engine ready to calibrate training modules based on localized content streams.
                        </p>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                            {/* ───── EXECUTIVE SUMMARY TAB ───── */}
                            {activeTab === 'overview' && (
                                <div className="max-w-7xl mx-auto">
                                    {/* Executive Onboarding Guide (Visible when empty) */}
                                    {cohorts.length === 0 && (
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                                            className="p-10 rounded-[48px] bg-white dark:bg-gray-800 border-2 border-dashed border-indigo-100 mb-10 text-center relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="relative z-10 max-w-2xl mx-auto">
                                                <div className="w-20 h-20 rounded-3xl bg-indigo-600 text-white flex items-center justify-center text-3xl mx-auto mb-8 shadow-2xl shadow-indigo-200">
                                                    🚀
                                                </div>
                                                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Initialize Your Corporate LMS</h3>
                                                <p className="text-slate-500 font-medium mb-10 text-lg">Your Command Hub is ready. Follow these precision protocols to establish your first training environment and onboard interns.</p>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                                                    {[
                                                        { step: '01', title: 'Create Space', desc: 'Establish a department or training unit.', icon: '🏢', action: () => setActiveTab('cohorts') },
                                                        { step: '02', title: 'Upload Assets', desc: 'Populate your repository with PDFs or Videos.', icon: '📁', action: () => setActiveTab('content') },
                                                        { step: '03', title: 'Invite Interns', desc: 'Securely onboard staff via corporate email.', icon: '👥', action: () => setActiveTab('students') },
                                                    ].map((step, i) => (
                                                        <div key={i} onClick={step.action} className="p-6 rounded-[32px] bg-slate-50 border border-slate-100 cursor-pointer hover:bg-white dark:bg-gray-800 hover:border-indigo-200 hover:shadow-xl transition-all group/step">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <span className="text-2xl">{step.icon}</span>
                                                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-white dark:bg-gray-800 px-2 py-1 rounded-md border border-indigo-50">Step {step.step}</span>
                                                            </div>
                                                            <h4 className="font-black text-slate-900 mb-1 group-hover/step:text-indigo-600 transition-colors">{step.title}</h4>
                                                            <p className="text-[11px] text-slate-500 font-medium leading-tight">{step.desc}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Real-time Precision Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                                        {[
                                            { label: 'Interns & Staff', value: users.length, icon: '👥', color: '#4F46E5' },
                                            { label: 'Training Cohorts', value: cohorts.filter(c => c.is_active).length, icon: '🏢', color: '#0F172A' },
                                            { label: 'Exams Scheduled', value: exams.length, icon: '📝', color: '#059669' },
                                            { label: 'Seat Allocation', value: `${users.length}/50`, icon: '💺', color: '#7C3AED' },
                                        ].map((stat, i) => (
                                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                                className="p-8 rounded-[32px] bg-white dark:bg-gray-800 border border-slate-100 shadow-[0_10px_35px_rgba(15,23,42,0.03)] group hover:shadow-xl transition-all border-b-4"
                                                style={{ borderBottomColor: stat.color }}>
                                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-6 bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform" style={{ color: stat.color }}>
                                                    {stat.icon}
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{stat.label}</p>
                                                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Command Center & Activity Feed */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                                        {/* Activity Log */}
                                        <div className="skeu-card p-8">
                                            <div className="flex items-center justify-between mb-8">
                                                <h3 className="font-bold text-sm">📋 Recent Activity</h3>
                                                <button onClick={() => setActiveTab('cohorts')} className="text-[10px] font-black uppercase tracking-widest text-indigo-600">View All →</button>
                                            </div>
                                            {cohorts.length === 0 ? (
                                                <div className="text-center py-12 bg-slate-50/50 rounded-3xl border border-dashed border-slate-100">
                                                    <p className="text-3xl mb-3 opacity-30">📂</p>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No recent deployments</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {cohorts.slice(0, 4).map(c => (
                                                        <div key={c.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-white dark:bg-gray-800 hover:shadow-sm">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-slate-100 flex items-center justify-center text-sm">🏢</div>
                                                                <div>
                                                                    <p className="font-bold text-xs text-slate-900">{c.name}</p>
                                                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-0.5">LMS Space Operational</p>
                                                                </div>
                                                            </div>
                                                            <span className="text-[10px] px-3 py-1.5 rounded-lg font-black uppercase tracking-widest bg-white dark:bg-gray-800 border border-slate-100 text-indigo-600">Active</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Performance Matrix */}
                                        <div className="skeu-card p-8 bg-slate-900 text-white relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
                                            <div className="relative z-10">
                                                 <h3 className="font-bold text-sm mb-8 flex items-center gap-2">
                                                     <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                                     Skill Matrix Overview
                                                 </h3>
                                                 <div className="py-10 text-center rounded-3xl border border-dashed border-white/10">
                                                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Telemetry Initializing</p>
                                                     <p className="text-[11px] font-medium text-slate-500 px-6 leading-relaxed">
                                                         Skill data will populate here after interns complete their first sequence of "Engine Logic" challenges.
                                                     </p>
                                                 </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Platform Features Grid */}
                                    <div className="skeu-card p-5">
                                        <h3 className="font-bold text-sm mb-4">🧰 LMS Control Center</h3>
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                            {[
                                                { icon: '📁', title: 'Content Repository', desc: 'Secure videos & training files' },
                                                { icon: '🤖', title: 'AI Exam Generator', desc: 'Auto-create assessments from content' },
                                                { icon: '📅', title: 'Schedule Exams', desc: 'Set deadlines for training cohorts' },
                                                { icon: '📋', title: 'Bulk Intern Invite', desc: 'Onboard hundreds via business email' },
                                                { icon: '🎓', title: 'Auto-Certificates', desc: 'Verify completion and issue credentials' },
                                                { icon: '💬', title: 'Doubt Bot Control', desc: 'Configure AI Mentor behavior' },
                                            ].map((f, i) => (
                                                <div key={i} className="p-3 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                                    <span className="text-lg">{f.icon}</span>
                                                    <p className="font-black text-xs mt-1 text-slate-800">{f.title}</p>
                                                    <p className="text-[10px] font-medium leading-tight mt-0.5 text-slate-500">{f.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ───── ACADEMIC UNITS (COHORTS) TAB ───── */}
                            {activeTab === 'cohorts' && (
                                <div className="max-w-6xl mx-auto">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Corporate Training Spaces</h2>
                                            <p className="text-slate-500 font-medium mt-1">Configure and monitor departmental learning cohorts.</p>
                                        </div>
                                    </div>

                                    {/* Deployment Console (Create) */}
                                    <div className="p-8 rounded-[32px] bg-white dark:bg-gray-800 border border-slate-100 shadow-sm mb-10">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6">Unit Deployment</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-1.5">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Identifier</p>
                                                <input
                                                    type="text"
                                                    value={newCohortName}
                                                    onChange={e => setNewCohortName(e.target.value)}
                                                    placeholder="e.g. SR_ENG_2024_A"
                                                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Protocol Course</p>
                                                <select
                                                    value={newCohortCourse}
                                                    onChange={e => setNewCohortCourse(e.target.value)}
                                                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none appearance-none"
                                                >
                                                    <option value="">N/A (Standard)</option>
                                                    <option value="frontend_react">Advanced Enterprise React</option>
                                                    <option value="backend_node">Scaleable Node Architectures</option>
                                                    <option value="fullstack">Full Stack Engineering</option>
                                                    <option value="data_science">Predictive Data Analytics</option>
                                                </select>
                                            </div>
                                            <div className="flex items-end">
                                                <button onClick={handleCreateCohort} 
                                                    className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg transition-all hover:bg-indigo-700 active:scale-95">
                                                    Deploy Unit
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Active Units Inventory */}
                                    <div className="p-8 rounded-[32px] bg-white dark:bg-gray-800 border border-slate-100 shadow-sm">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6">Active Unit Inventory</h3>
                                        {cohorts.length === 0 ? (
                                            <div className="py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Inventory Empty</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {cohorts.map(c => (
                                                    <div key={c.id} className="flex items-center justify-between p-6 rounded-2xl border border-slate-50 bg-white dark:bg-gray-800 hover:border-indigo-100 transition-all group">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl bg-slate-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                                🏢
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-slate-900 leading-tight">{c.name}</p>
                                                                <div className="flex items-center gap-4 mt-1.5">
                                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                                        Key: <span className="font-mono text-indigo-600 font-black">{c.invite_code}</span>
                                                                    </p>
                                                                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                                        {c.member_count} Members
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <button onClick={() => router.push(`/institutional/cohort/${c.id}`)}
                                                                className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                                                                View Console
                                                            </button>
                                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${c.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                                                {c.is_active ? 'Operational' : 'Archived'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ───── DIGITAL ASSETS (CONTENT) TAB ───── */}
                            {activeTab === 'content' && (
                                <div className="max-w-6xl mx-auto">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Corporate Asset Repository</h2>
                                            <p className="text-slate-500 font-medium mt-1">Manage secure knowledge transfer materials and training videos.</p>
                                        </div>
                                    </div>

                                    {/* Asset Ingestion (Upload) */}
                                    <div className="p-8 rounded-[32px] bg-white dark:bg-gray-800 border border-slate-100 shadow-sm mb-10">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6">Asset Ingestion</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                            <div className="space-y-1.5 col-span-1 md:col-span-1">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Asset Label</p>
                                                <input
                                                    type="text"
                                                    value={newContentTitle}
                                                    onChange={e => setNewContentTitle(e.target.value)}
                                                    placeholder="Documentation Title"
                                                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Type Classification</p>
                                                <select value={newContentType} onChange={e => setNewContentType(e.target.value)} 
                                                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none"
                                                >
                                                    <option value="pdf">📄 Technical PDF</option>
                                                    <option value="video">🎬 Internal Training</option>
                                                    <option value="syllabus">📋 Academic Syllabus</option>
                                                    <option value="link">🔗 Hyperlink</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Secure Link</p>
                                                <input
                                                    type="text"
                                                    value={newContentUrl}
                                                    onChange={e => setNewContentUrl(e.target.value)}
                                                    placeholder="Storage URL"
                                                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                />
                                            </div>
                                            <div className="flex items-end">
                                                <button onClick={handleUploadContent} 
                                                    className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg transition-all hover:bg-indigo-700 active:scale-95">
                                                    Index Asset
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Secure Repository Flow */}
                                    <div className="p-8 rounded-[32px] bg-white dark:bg-gray-800 border border-slate-100 shadow-sm">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6">Archive Vault ({content.length} Assets)</h3>
                                        {content.length === 0 ? (
                                            <div className="py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Vault Empty</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {content.map(c => (
                                                    <div key={c.id} className="flex items-center justify-between p-5 rounded-2xl border border-slate-50 bg-white dark:bg-gray-800 hover:border-indigo-100 transition-all group">
                                                        <div className="flex items-center gap-5">
                                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-slate-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                                {c.content_type === 'pdf' ? '📄' : c.content_type === 'video' ? '🎬' : '🔗'}
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-slate-900 text-sm leading-tight">{c.title}</p>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                                    {c.content_type.toUpperCase()} · Registered {new Date(c.created_at).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button 
                                                                onClick={() => window.open(c.file_url, '_blank')}
                                                                className="px-3 py-1.5 rounded-lg bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                                                                Open
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteContent(c.id)}
                                                                className="p-2 rounded-lg bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all">
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ───── HUMAN RESOURCES (STUDENTS) TAB ───── */}
                            {activeTab === 'students' && (
                                <div className="max-w-6xl mx-auto">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Human Resource Management</h2>
                                            <p className="text-slate-500 font-medium mt-1">Onboard and manage institutional members and faculty.</p>
                                        </div>
                                    </div>

                                    {/* Bulk Ingestion Console */}
                                    <div className="p-8 rounded-[32px] bg-white dark:bg-gray-800 border border-slate-100 shadow-sm mb-10">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6">Bulk Ingestion Protocol</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">
                                            Format: <span className="font-mono text-indigo-600">Full Name, Corporate Email</span> (One entry per line)
                                        </p>
                                        <textarea
                                            value={csvText}
                                            onChange={e => setCsvText(e.target.value)}
                                            placeholder={"John Doe, john@enterprise.com\nJane Smith, jane@enterprise.com"}
                                            rows={5}
                                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-mono focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none mb-6 resize-none"
                                        />
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <div className="flex-1 space-y-1.5">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Unit Assignment</p>
                                                <select
                                                    value={selectedCohortForInvite}
                                                    onChange={e => setSelectedCohortForInvite(e.target.value)}
                                                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none appearance-none"
                                                >
                                                    <option value="">N/A (Unassigned)</option>
                                                    {cohorts.map(c => (
                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex items-end">
                                                <button onClick={handleBulkInvite} 
                                                    className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg transition-all hover:bg-indigo-700 active:scale-95 whitespace-nowrap">
                                                    Execute Onboarding
                                                </button>
                                            </div>
                                        </div>

                                        {inviteResults && (
                                            <div className="mt-6 p-4 rounded-xl flex items-center gap-3 bg-emerald-50 border border-emerald-100 text-emerald-600">
                                                <span className="text-lg">✅</span>
                                                <p className="text-xs font-bold uppercase tracking-widest">
                                                    Processed: {inviteResults.invited} Successful | {inviteResults.failed} Failed
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Personnel Registry */}
                                    <div className="p-8 rounded-[32px] bg-white dark:bg-gray-800 border border-slate-100 shadow-sm overflow-hidden">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Personnel Registry</h3>
                                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-100 text-slate-500 rounded-lg">
                                                {users.length} Records Detected
                                            </span>
                                        </div>
                                        
                                        {/* Filter Bar */}
                                        <div className="flex gap-2 mb-6">
                                            {[
                                                { id: 'all', label: 'Show All' },
                                                { id: 'at-risk', label: 'At Risk Only' },
                                                { id: 'active', label: 'Active Only' }
                                            ].map(btn => (
                                                <button
                                                    key={btn.id}
                                                    onClick={() => setStudentFilter(btn.id as any)}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                        studentFilter === btn.id 
                                                        ? 'bg-indigo-600 text-white shadow-md' 
                                                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    {btn.label}
                                                </button>
                                            ))}
                                        </div>

                                        {users.length === 0 ? (
                                            <div className="py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Registry Empty</p>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="border-b border-slate-100">
                                                            <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User Details</th>
                                                            <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned Cohort</th>
                                                            <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Onboarded</th>
                                                            <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Operation</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-50">
                                                        {users
                                                            .filter(u => {
                                                                if (studentFilter === 'all') return true;
                                                                let inactiveDays = 0;
                                                                if (u.lastActive) {
                                                                    const last = new Date(u.lastActive + 'T00:00:00');
                                                                    const now = new Date();
                                                                    now.setHours(0,0,0,0);
                                                                    inactiveDays = Math.round((now.getTime() - last.getTime()) / 86_400_000);
                                                                } else {
                                                                    inactiveDays = 999;
                                                                }
                                                                if (studentFilter === 'at-risk') return inactiveDays >= 3;
                                                                if (studentFilter === 'active') return inactiveDays < 3;
                                                                return true;
                                                            })
                                                            .map((u, i) => {
                                                            let inactiveDays = 0;
                                                            if (u.lastActive) {
                                                                const last = new Date(u.lastActive + 'T00:00:00');
                                                                const now = new Date();
                                                                now.setHours(0,0,0,0);
                                                                inactiveDays = Math.round((now.getTime() - last.getTime()) / 86_400_000);
                                                            } else {
                                                                inactiveDays = 999;
                                                            }
                                                            
                                                            return (
                                                            <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                                                <td className="py-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <div 
                                                                            onClick={() => setSelectedStudentDetail({ ...u, inactiveDays })}
                                                                            className="relative w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-black uppercase cursor-pointer hover:bg-indigo-100 transition-all"
                                                                        >
                                                                            {u.email?.charAt(0) || '?'}
                                                                            {/* Visual Flag Dot */}
                                                                            <div 
                                                                                className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                                                                                    inactiveDays >= 6 ? 'bg-red-500' :
                                                                                    inactiveDays >= 3 ? 'bg-amber-400' :
                                                                                    'bg-emerald-500'
                                                                                }`}
                                                                            />
                                                                        </div>
                                                                        <div className="cursor-pointer" onClick={() => setSelectedStudentDetail({ ...u, inactiveDays })}>
                                                                            <p className="font-bold text-xs text-slate-900 leading-tight">{u.email || 'Anonymous'}</p>
                                                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-0.5">{u.role}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="py-4">
                                                                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border bg-slate-50 text-slate-500 border-slate-100">
                                                                        {u.cohort}
                                                                    </span>
                                                                </td>
                                                                <td className="py-4">
                                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                                        {new Date(u.created_at).toLocaleDateString()}
                                                                    </p>
                                                                </td>
                                                                <td className="py-4 text-right">
                                                                    {inactiveDays > 3 && (
                                                                        <button onClick={() => handleSendNudge(u, inactiveDays)} className="mr-2 px-3 py-1.5 rounded-lg bg-orange-50 text-[10px] font-black uppercase tracking-widest text-orange-600 hover:bg-orange-100 transition-all">
                                                                            Send Nudge Email
                                                                        </button>
                                                                    )}
                                                                    <button onClick={() => handleDownloadStudentReport(u)} className="mr-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-100 transition-all">
                                                                        Download Report
                                                                    </button>
                                                                    <button className="px-3 py-1.5 rounded-lg bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-all">
                                                                        Manage
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )})}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ───── ANALYTICS TAB ───── */}
                            {activeTab === 'analytics' && (
                                <div>
                                    <h2 className="font-black text-2xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>📈 Placement Readiness Analytics</h2>

                                    {!analytics ? (
                                        <div className="skeu-card p-8 text-center">
                                            <p className="text-4xl mb-3">📊</p>
                                            <p style={{ color: 'var(--text-tertiary)' }}>
                                                {loadingData ? 'Loading analytics...' : 'No analytics data available yet. Add students to cohorts first.'}
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Overview Stats */}
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
                                                {[
                                                    { label: 'Total Cohorts', value: analytics.totalCohorts, icon: '👥', color: '#6366F1' },
                                                    { label: 'Total Students', value: analytics.totalStudents, icon: '🎓', color: '#0D9488' },
                                                    { label: 'Avg Readiness', value: `${(analytics.averageReadiness * 100).toFixed(0)}%`, icon: '🎯', color: '#F59E0B' },
                                                    { label: 'At-Risk Students', value: analytics.atRiskCount, icon: '⚠️', color: '#EF4444' },
                                                ].map((stat, i) => (
                                                    <div key={i} className="skeu-card p-6">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-2xl">{stat.icon}</span>
                                                            <span className="font-black text-2xl" style={{ color: stat.color }}>{stat.value}</span>
                                                        </div>
                                                        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Cohort Breakdown */}
                                            <div className="skeu-card p-6">
                                                <h3 className="font-bold text-lg mb-4">Cohort Breakdown</h3>
                                                <div className="space-y-3">
                                                    {analytics.cohortBreakdown?.map((cb: any, i: number) => (
                                                        <div key={i} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--bg-surface)' }}>
                                                            <div>
                                                                <p className="font-bold">{cb.name}</p>
                                                                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{cb.studentCount} students</p>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-32">
                                                                    <div className="skill-bar">
                                                                        <div className="skill-bar-fill" style={{ width: `${cb.avgReadiness * 100}%` }} />
                                                                    </div>
                                                                </div>
                                                                <span className="font-bold text-sm" style={{ color: cb.avgReadiness >= 0.7 ? '#059669' : cb.avgReadiness >= 0.4 ? '#D97706' : '#DC2626' }}>
                                                                    {(cb.avgReadiness * 100).toFixed(0)}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* ───── AI ENGINE (COPILOT) TAB ───── */}
                            {activeTab === 'copilot' && (
                                <div className="max-w-6xl mx-auto">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">AI Automation Engine</h2>
                                            <p className="text-slate-500 font-medium mt-1">Automated generation of assessment modules and challenges.</p>
                                        </div>
                                    </div>

                                    {/* Automation Console */}
                                    <div className="p-10 rounded-[40px] bg-slate-900 border border-slate-800 shadow-2xl mb-10 overflow-hidden relative">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]" />
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-8 relative z-10">Automation Control Console</h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
                                            <div className="space-y-1.5">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Context Topic</p>
                                                <input
                                                    type="text"
                                                    value={copilotTopic}
                                                    onChange={e => setCopilotTopic(e.target.value)}
                                                    placeholder="e.g. Memory Management"
                                                    className="w-full px-5 py-4 rounded-xl bg-white dark:bg-gray-800/5 border border-white/10 text-white text-sm font-bold outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Complexity Level</p>
                                                <select value={copilotDifficulty} onChange={e => setCopilotDifficulty(e.target.value)} 
                                                    className="w-full px-5 py-4 rounded-xl bg-white dark:bg-gray-800/5 border border-white/10 text-white text-sm font-bold outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none"
                                                >
                                                    <option value="easy">Level: Foundation</option>
                                                    <option value="medium">Level: Intermediate</option>
                                                    <option value="hard">Level: Expert</option>
                                                </select>
                                            </div>
                                            <div className="flex gap-3 items-end">
                                                <button
                                                    onClick={() => handleAIDeploy('generate_quiz')}
                                                    disabled={copilotLoading}
                                                    className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg transition-all hover:bg-indigo-700 active:scale-95 text-xs uppercase tracking-widest disabled:opacity-50"
                                                >
                                                    {copilotLoading ? '...' : 'Generate MCQ'}
                                                </button>
                                                <button
                                                    onClick={() => handleAIDeploy('generate_challenge')}
                                                    disabled={copilotLoading}
                                                    className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg transition-all hover:bg-emerald-700 active:scale-95 text-xs uppercase tracking-widest disabled:opacity-50"
                                                >
                                                    {copilotLoading ? '...' : 'Engine Logic'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Generation Output Terminal */}
                                    {copilotResult && (
                                        <div className="p-8 rounded-[40px] bg-white dark:bg-gray-800 border border-slate-100 shadow-sm">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-8">Generated Logic Stream</h3>
                                            {Array.isArray(copilotResult) ? (
                                                <div className="space-y-6">
                                                    {copilotResult.map((q: any, i: number) => (
                                                        <div key={i} className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                                                            <p className="font-black text-slate-900 mb-4 flex items-center gap-3">
                                                                <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-black">
                                                                    {i + 1}
                                                                </span>
                                                                {q.question}
                                                            </p>
                                                            {q.options && (
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 ml-9">
                                                                    {q.options.map((opt: string, j: number) => (
                                                                        <div key={j} className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-slate-200 text-xs font-medium text-slate-600">
                                                                            {opt}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            <div className="flex items-center gap-2 ml-9 mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
                                                                Correct Sequence: {q.correct_answer}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800">
                                                    <h4 className="text-white font-black mb-2">{copilotResult.title}</h4>
                                                    <p className="text-slate-400 text-xs mb-6 font-medium">{copilotResult.description}</p>
                                                    <pre className="p-6 rounded-2xl bg-black/40 text-xs font-mono text-indigo-300 overflow-x-auto border border-white/5">
                                                        {copilotResult.starter_code}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
                {/* Student Detail Modal */}
            <AnimatePresence>
                {selectedStudentDetail && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedStudentDetail(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-black uppercase">
                                        {selectedStudentDetail.email?.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 leading-tight">{selectedStudentDetail.email}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className={`w-2 h-2 rounded-full ${
                                                selectedStudentDetail.inactiveDays >= 6 ? 'bg-red-500' :
                                                selectedStudentDetail.inactiveDays >= 3 ? 'bg-amber-400' :
                                                'bg-emerald-500'
                                            }`} />
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                {selectedStudentDetail.inactiveDays >= 6 ? 'Alert: Critical' :
                                                 selectedStudentDetail.inactiveDays >= 3 ? 'Warning: Inactive' :
                                                 'Status: Active'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-10">
                                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Active</p>
                                        <p className="text-xs font-black text-slate-900 uppercase">
                                            {selectedStudentDetail.lastActive ? new Date(selectedStudentDetail.lastActive).toLocaleDateString() : 'Never'}
                                        </p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Streak</p>
                                        <p className="text-xs font-black text-slate-900 uppercase">{selectedStudentDetail.streakDays || 0} Days</p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Labs Completed</p>
                                        <p className="text-xs font-black text-slate-900 uppercase">{selectedStudentDetail.labsCompleted || 0}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => {
                                            handleSendNudge(selectedStudentDetail, selectedStudentDetail.inactiveDays);
                                            setSelectedStudentDetail(null);
                                        }}
                                        className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg transition-all hover:bg-indigo-700 active:scale-95 text-[10px] uppercase tracking-widest"
                                    >
                                        Send Nudge Email
                                    </button>
                                    <button 
                                        onClick={() => setSelectedStudentDetail(null)}
                                        className="px-6 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl transition-all hover:bg-slate-200 active:scale-95 text-[10px] uppercase tracking-widest"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
        </div>
    );
}
