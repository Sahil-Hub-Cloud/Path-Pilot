'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { 
    FiUploadCloud, FiFile, FiCheckCircle, FiAlertCircle, 
    FiArrowLeft, FiLoader, FiCalendar, FiBook, FiMap
} from 'react-icons/fi';

interface Week {
    weekNumber: number;
    title: string;
    topics: string[];
    learningGoals: string[];
    estimatedHours: number;
}

interface ExamDate {
    examName: string;
    date: string;
    topics: string[];
}

interface Curriculum {
    courseName: string;
    totalWeeks: number;
    weeks: Week[];
    examDates: ExamDate[];
}

export default function SyllabusUploadPage() {
    const router = useRouter();
    const { user } = useAuth();
    
    // Form State
    const [collegeName, setCollegeName] = useState('');
    const [semester, setSemester] = useState('1');
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [courseName, setCourseName] = useState('');
    
    // Upload State
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === 'application/pdf') {
                setFile(selectedFile);
                setError(null);
            } else {
                setError('Please upload a valid PDF file.');
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedFile = e.dataTransfer.files[0];
            if (selectedFile.type === 'application/pdf') {
                setFile(selectedFile);
                setError(null);
            } else {
                setError('Please upload a valid PDF file.');
            }
        }
    };

    const handleUploadAndParse = async () => {
        if (!file || !collegeName || !courseName) {
            setError('Please fill all fields and select a PDF file.');
            return;
        }

        setIsProcessing(true);
        setError(null);
        setCurriculum(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/admin/syllabus/parse', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setCurriculum(data.curriculum);
            } else {
                setError(data.error || 'Failed to parse syllabus.');
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError('An error occurred during syllabus processing.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConfirmAndSave = async () => {
        if (!curriculum || !user) return;

        setIsSaving(true);
        setError(null);

        try {
            const collegeId = collegeName.toLowerCase().replace(/\s+/g, '_');
            const syllabusId = `${courseName.toLowerCase().replace(/\s+/g, '_')}_${year}_sem${semester}`;
            
            // Save to Firestore: college_syllabi/{collegeId}/syllabi/{syllabusId}
            const syllabusRef = doc(db, 'college_syllabi', collegeId, 'syllabi', syllabusId);
            
            await setDoc(syllabusRef, {
                ...curriculum,
                collegeName,
                semester,
                year,
                courseName,
                uploadedBy: user.uid,
                createdAt: serverTimestamp(),
            });

            setSuccessMessage('Syllabus uploaded successfully. Students from this college will now follow this custom roadmap.');
            
            // Clear state after short delay
            setTimeout(() => {
                setCurriculum(null);
                setFile(null);
                setCourseName('');
            }, 3000);

        } catch (err) {
            console.error('Save error:', err);
            setError('Failed to save curriculum to database.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => router.back()}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                        >
                            <FiArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">Syllabus Engine</h1>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">B2B Institutional Console</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex flex-col items-end mr-4">
                            <span className="text-xs font-bold text-slate-900">{user?.email}</span>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">Academic Administrator</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                            {user?.email?.[0].toUpperCase()}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">
                    
                    {/* Left Column: Form & Upload */}
                    <div className="space-y-8">
                        <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <FiUploadCloud size={20} />
                                </div>
                                <h2 className="text-lg font-bold text-slate-900">Upload Academic Protocol</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">College/Institution Name</label>
                                    <input 
                                        type="text"
                                        value={collegeName}
                                        onChange={e => setCollegeName(e.target.value)}
                                        placeholder="e.g. Stanford University"
                                        className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Course/Subject Title</label>
                                    <input 
                                        type="text"
                                        value={courseName}
                                        onChange={e => setCourseName(e.target.value)}
                                        placeholder="e.g. Distributed Systems CS244B"
                                        className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Semester</label>
                                    <select 
                                        value={semester}
                                        onChange={e => setSemester(e.target.value)}
                                        className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none appearance-none"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                            <option key={s} value={s}>Semester {s}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Academic Year</label>
                                    <input 
                                        type="number"
                                        value={year}
                                        onChange={e => setYear(e.target.value)}
                                        className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {/* Dropzone */}
                            <div 
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`
                                    relative border-2 border-dashed rounded-[32px] p-12 text-center cursor-pointer transition-all duration-300
                                    ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100/50'}
                                    ${file ? 'border-emerald-500/50 bg-emerald-50/30' : ''}
                                `}
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept=".pdf"
                                />
                                
                                {file ? (
                                    <div className="space-y-4">
                                        <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
                                            <FiFile size={32} />
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-slate-900">{file.name}</p>
                                            <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mt-1">Ready for Neural Ingestion</p>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                            className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                                        >
                                            Remove File
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto shadow-sm">
                                            <FiUploadCloud size={32} />
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-slate-900">Drag and drop syllabus PDF</p>
                                            <p className="text-sm text-slate-500 font-medium">or click to browse your system files</p>
                                        </div>
                                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] bg-indigo-50 px-4 py-1.5 rounded-full inline-block">
                                            AI-Ready Parser v2.0
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="mt-8">
                                <button
                                    onClick={handleUploadAndParse}
                                    disabled={isProcessing || !file}
                                    className={`
                                        w-full py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3
                                        ${isProcessing || !file 
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                            : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-xl shadow-indigo-100 active:scale-[0.98]'}
                                    `}
                                >
                                    {isProcessing ? (
                                        <>
                                            <FiLoader className="animate-spin" /> Analyzing Document...
                                        </>
                                    ) : (
                                        <>
                                            <FiMap /> Initialize Roadmap Extraction
                                        </>
                                    )}
                                </button>
                            </div>

                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600"
                                >
                                    <FiAlertCircle size={20} />
                                    <p className="text-sm font-bold">{error}</p>
                                </motion.div>
                            )}

                            {successMessage && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 p-6 rounded-2xl bg-emerald-500 text-white shadow-xl shadow-emerald-100 flex items-center gap-4"
                                >
                                    <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800/20 flex items-center justify-center">
                                        <FiCheckCircle size={24} />
                                    </div>
                                    <p className="text-sm font-black leading-tight">{successMessage}</p>
                                </motion.div>
                            )}
                        </section>

                        {/* Curriculum Preview */}
                        <AnimatePresence>
                            {curriculum && (
                                <motion.section 
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="bg-white dark:bg-gray-800 rounded-[40px] p-10 shadow-2xl border border-slate-100 overflow-hidden relative"
                                >
                                    {/* Decorative mesh */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[100px] opacity-60 -mr-20 -mt-20" />
                                    
                                    <div className="relative z-10">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                                            <div>
                                                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2">Neural Extraction Preview</p>
                                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{curriculum.courseName}</h2>
                                                <p className="text-slate-500 font-bold mt-1 uppercase text-xs tracking-widest">
                                                    Structured Training Sequence · {curriculum.totalWeeks} Weeks
                                                </p>
                                            </div>
                                            <button 
                                                onClick={handleConfirmAndSave}
                                                disabled={isSaving}
                                                className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all flex items-center gap-3 disabled:bg-slate-200 disabled:shadow-none"
                                            >
                                                {isSaving ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
                                                Confirm and Deploy
                                            </button>
                                        </div>

                                        <div className="space-y-6">
                                            {curriculum.weeks.map((week, idx) => (
                                                <div key={idx} className="group p-6 rounded-[32px] bg-slate-50 border border-slate-100 hover:bg-white dark:bg-gray-800 hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
                                                    <div className="flex items-start gap-6">
                                                        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 border border-slate-200 flex flex-col items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-colors shadow-sm">
                                                            <span className="text-[10px] font-black uppercase leading-none mb-1 opacity-60">Week</span>
                                                            <span className="text-xl font-black leading-none">{week.weekNumber}</span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="text-lg font-black text-slate-900 mb-4 tracking-tight group-hover:text-indigo-600 transition-colors">{week.title}</h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                                <div>
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                                                                        <FiBook size={10} /> Core Modules
                                                                    </p>
                                                                    <ul className="space-y-2">
                                                                        {week.topics.map((t, i) => (
                                                                            <li key={i} className="flex items-start gap-2">
                                                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                                                                                <span className="text-sm font-bold text-slate-600 leading-tight">{t}</span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                                <div className="bg-white dark:bg-gray-800/50 p-5 rounded-2xl border border-slate-100">
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Learning Objectives</p>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {week.learningGoals.map((g, i) => (
                                                                            <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 text-[11px] font-bold">
                                                                                {g}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
                                                                        <FiLoader className="text-indigo-500" size={14} />
                                                                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Est. workload: {week.estimatedHours}h / week</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {curriculum.examDates && curriculum.examDates.length > 0 && (
                                            <div className="mt-12">
                                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-1">Institutional Milestones</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {curriculum.examDates.map((exam, i) => (
                                                        <div key={i} className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-indigo-100 flex items-center justify-center text-indigo-600 text-lg">
                                                                    <FiCalendar />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-black text-slate-900">{exam.examName}</p>
                                                                    <p className="text-xs font-bold text-indigo-600">{exam.date}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.section>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Column: Tips & Info */}
                    <aside className="space-y-6 sticky top-28">
                        <div className="p-8 rounded-[32px] bg-slate-900 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                                Smart Parsing Engine
                            </h3>
                            <p className="text-sm font-medium leading-relaxed text-slate-400 mb-6">
                                Our AI extracts deep structural data from your syllabus PDF, including week-by-week breakdowns, learning objectives, and institutional milestones.
                            </p>
                            <div className="space-y-4">
                                {[
                                    { title: 'Auto-Weeks', desc: 'Converts unstructured text into weekly modules.' },
                                    { title: 'Goal Extraction', desc: 'Identifies core competencies for students.' },
                                    { title: 'Exam Detection', desc: 'Finds and flags midterms/finals.' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <FiCheckCircle size={12} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white">{item.title}</p>
                                            <p className="text-[10px] text-slate-500 font-bold">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 rounded-[32px] bg-white dark:bg-gray-800 border border-slate-100 shadow-sm">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">Guidelines</h3>
                            <ul className="space-y-4">
                                <li className="text-[11px] font-bold text-slate-500 leading-relaxed">
                                    <span className="text-indigo-600 mr-1">01</span> Ensure the PDF contains a clear course structure or weekly schedule.
                                </li>
                                <li className="text-[11px] font-bold text-slate-500 leading-relaxed">
                                    <span className="text-indigo-600 mr-1">02</span> For best results, use standard academic fonts and layouts.
                                </li>
                                <li className="text-[11px] font-bold text-slate-500 leading-relaxed">
                                    <span className="text-indigo-600 mr-1">03</span> Max file size: 10MB. Text must be selectable (non-scanned).
                                </li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
