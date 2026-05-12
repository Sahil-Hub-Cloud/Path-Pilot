'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import QRCode from 'qrcode';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Maps the learningPath stored by onboarding → a display-friendly course title
const LEARNING_PATH_LABELS: Record<string, string> = {
    // Onboarding free-text values
    'Frontend Dev':          'Frontend Developer (React)',
    'Frontend Development':  'Frontend Developer (React)',
    'Backend Dev':           'Backend Developer (Node.js)',
    'Backend Development':   'Backend Developer (Node.js)',
    'Cloud & DevOps':        'Cloud & DevOps Engineering',
    'DevOps':                'Cloud & DevOps Engineering',
    'Full Stack':            'Full Stack (MERN)',
    'MERN Stack':            'Full Stack (MERN)',
    'Data Science':          'Data Science with Python',
    'Machine Learning':      'Machine Learning Engineer',
    'AI Engineering':        'AI & NLP Engineering',
    'DSA & Interviews':      'DSA for Interviews',
    'Mobile Dev':            'Mobile Development',
    'Android':               'Android Developer (Kotlin)',
    'iOS':                   'iOS Developer (Swift)',
    'Flutter':               'Flutter Developer',
    'Cybersecurity':         'Cybersecurity Fundamentals',
    'Blockchain':            'Blockchain Development',
    'Game Dev':              'Game Development (Unity)',
    'JavaScript Mastery':    'JavaScript Mastery',
    'Python Beginner':       'Python for Beginners',
    // Roadmap ID fallbacks
    frontend_react:          'Frontend Developer (React)',
    backend_node:            'Backend Developer (Node.js)',
    fullstack_mern:          'Full Stack (MERN)',
    mobile_react_native:     'React Native Developer',
    mobile_flutter:          'Flutter Developer',
    data_science_python:     'Data Science with Python',
    machine_learning:        'Machine Learning Engineer',
    dsa_interview:           'DSA for Interviews',
    python_beginner:         'Python for Beginners',
    javascript_mastery:      'JavaScript Mastery',
    devops_docker:           'Docker & Kubernetes',
    devops_aws:              'DevOps with AWS',
    blockchain:              'Blockchain Development',
    game_dev_unity:          'Game Development (Unity)',
    cybersecurity:           'Cybersecurity Fundamentals',
    ai_nlp:                  'Natural Language Processing',
};

export default function CertificatePage() {
    const router = useRouter();
    const { user } = useAuth();

    const [studentName, setStudentName] = useState('');
    const [courseName, setCourseName]   = useState('');
    const [certId, setCertId]           = useState('');
    const [certDate, setCertDate]       = useState('');
    const [qrCodeUrl, setQrCodeUrl]     = useState('');

    useEffect(() => {
        if (!user) return;

        let name = '';
        let pathName = '';

        const raw = localStorage.getItem('pp_profile_' + user.uid);
        if (raw) {
            try {
                const profile = JSON.parse(raw);
                name = profile.displayName || user.displayName || user.email?.split('@')[0] || 'Student';
                const path = profile.learningPath || '';
                pathName = LEARNING_PATH_LABELS[path] || path || 'Path Pilot Course';
            } catch { /* fall through to Firebase auth fallback */ }
        }

        if (!name) {
            name = user.displayName || user.email?.split('@')[0] || 'Student';
            pathName = 'Path Pilot Course';
        }

        setStudentName(name);
        setCourseName(pathName);

        const generateCert = async () => {
            if (!db) return;
            const uniqueCertId = `PP-${user.uid.slice(0,6).toUpperCase()}-${pathName.replace(/[^a-zA-Z]/g, '').slice(0,4).toUpperCase()}`;
            setCertId(uniqueCertId);
            
            try {
                const url = await QRCode.toDataURL(`https://pathpilot.app/api/certificate/${uniqueCertId}`);
                setQrCodeUrl(url);
            } catch (e) {
                console.error("QR Generate Error", e);
            }

            try {
                const certRef = doc(db, 'certificates', uniqueCertId);
                const snap = await getDoc(certRef);

                if (!snap.exists()) {
                   let empScore = 0;
                   const userDoc = await getDoc(doc(db, 'users', user.uid));
                   if (userDoc.exists()) {
                      empScore = userDoc.data().employabilityScore || 0;
                   }
                   
                   const dateString = new Date().toISOString();
                   await setDoc(certRef, {
                      certId: uniqueCertId,
                      studentName: name,
                      courseName: pathName,
                      trackName: pathName,
                      completionDate: dateString,
                      employabilityScore: empScore,
                      userId: user.uid
                   });
                   setCertDate(new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
                } else {
                   setCertDate(new Date(snap.data().completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
                }
            } catch (e) {
                console.error("Firestore error", e);
                setCertDate(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
            }
        };

        generateCert();
    }, [user]);

    const certRef = useRef<HTMLDivElement>(null);

    const handleDownloadPDF = () => {
        if (typeof window !== 'undefined') {
            window.print();
        }
    };

    const handleShareLinkedIn = () => {
        const url = encodeURIComponent('https://PathPilot.dev');
        const title = encodeURIComponent(`I completed the ${courseName} course on Path Pilot! 🎓`);
        const summary = encodeURIComponent(`Proud to share that I've completed the "${courseName}" learning path on Path Pilot — a hands-on, project-based coding platform.`);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`, '_blank');
    };

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
            {/* Navbar */}
            <nav className="skeu-navbar px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo.webp" alt="Path Pilot" className="w-9 h-9 rounded-xl object-cover" />
                        <div>
                            <span className="font-bold tracking-tight text-sm">Path<span className="gradient-text">Pilot</span></span>
                            <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Certificate</p>
                        </div>
                    </div>
                    <button onClick={() => router.push('/library')} className="clay-btn clay-btn-secondary clay-btn-sm">
                        ← Back to Library
                    </button>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Certificate Card */}
                <motion.div
                    ref={certRef}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, type: 'spring' }}
                    className="cert-card"
                >
                    {/* Decorative Corner Ornaments */}
                    <div className="cert-ornament cert-ornament-tl">❖</div>
                    <div className="cert-ornament cert-ornament-tr">❖</div>
                    <div className="cert-ornament cert-ornament-bl">❖</div>
                    <div className="cert-ornament cert-ornament-br">❖</div>

                    {/* Header */}
                    <div className="text-center mb-10">
                        <img src="/logo.webp" alt="Path Pilot" className="w-16 h-16 rounded-2xl mx-auto mb-4 object-cover" />
                        <h2 className="text-sm font-bold uppercase tracking-[0.3em] mb-2" style={{ color: 'var(--accent-primary)' }}>
                            Path Pilot Academy
                        </h2>
                        <h1 className="text-4xl font-black mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                            Certificate of Completion
                        </h1>
                        <div className="w-24 h-1 mx-auto mt-4 rounded-full" style={{ background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))' }} />
                    </div>

                    {/* Body */}
                    <div className="text-center mb-10">
                        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>This is to certify that</p>
                        <h2 className="text-3xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>{studentName}</h2>
                        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>has successfully completed the course</p>
                        <div className="skeu-inset inline-block px-8 py-4 rounded-2xl mb-6">
                            <h3 className="text-xl font-black" style={{ color: 'var(--accent-primary)' }}>{courseName}</h3>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            with all projects and assessments completed through hands-on, project-based learning.
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-8" style={{ borderTop: '1px solid var(--border-light)' }}>
                        <div className="text-left">
                            <p className="text-xs font-bold" style={{ color: 'var(--text-tertiary)' }}>Date of Completion</p>
                            <p className="text-sm font-bold">{certDate}</p>
                        </div>
                        <div className="text-center flex flex-col items-center">
                            {qrCodeUrl && (
                                <img src={qrCodeUrl} alt="Verification QR Code" className="w-14 h-14 mb-2 rounded-lg border border-[var(--border-light)] p-1 object-cover" />
                            )}
                            <div className="skeu-badge px-3 py-1.5">
                                <span className="text-[9px] font-bold" style={{ color: 'var(--text-tertiary)' }}>ID: {certId || '...'}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold" style={{ color: 'var(--text-tertiary)' }}>Issued By</p>
                            <p className="text-sm font-bold">Path Pilot Academy</p>
                        </div>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-center gap-4 mt-10 flex-wrap"
                >
                    <button onClick={handleDownloadPDF} className="clay-btn clay-btn-primary">
                        📄 Download as PDF
                    </button>
                    <button onClick={handleShareLinkedIn} className="clay-btn clay-btn-secondary">
                        🔗 Share on LinkedIn
                    </button>
                    <button onClick={() => router.push('/library')} className="clay-btn clay-btn-secondary">
                        📚 Continue Learning
                    </button>
                </motion.div>

                {/* Congratulations */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-12"
                >
                    <p className="text-5xl mb-4">🎉</p>
                    <h3 className="text-xl font-black mb-2">Congratulations!</h3>
                    <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
                        You&apos;ve proven your skills through real projects and hands-on coding.
                        Share this achievement with the world!
                    </p>
                </motion.div>
            </main>
        </div>
    );
}
