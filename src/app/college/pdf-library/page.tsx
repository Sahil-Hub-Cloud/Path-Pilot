'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiUsers, FiSettings, FiLogOut, FiUploadCloud, 
  FiFileText, FiCalendar, FiPieChart, FiArrowLeft, FiCheckCircle, FiGitMerge
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { toast } from '@/lib/toast';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, addDoc, getDocs } from 'firebase/firestore';

export default function PdfLibraryPage() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const { isReady } = useAuthGuard();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [existingMaterials, setExistingMaterials] = useState<any[]>([]);

  // Upload States
  const [file, setFile] = useState<File | null>(null);
  const [subjectName, setSubjectName] = useState('');
  const [semester, setSemester] = useState('1st');
  const [branch, setBranch] = useState('CSE');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
  const BRANCHES = ['CSE', 'ECE', 'Mechanical', 'Civil', 'EEE', 'IT'];

  useEffect(() => {
    if (!isReady || !user) return;
    const init = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists() || userDoc.data()?.role !== 'college') {
          const role = userDoc.exists() ? userDoc.data().role : 'student';
          if (role === 'student') router.push('/dashboard');
          else if (role === 'company') router.push('/company/dashboard');
          else if (role === 'admin') router.push('/admin/dashboard');
          else router.push('/dashboard');
          return;
        }
        const profileData = userDoc.data();
        setProfile(profileData);

        // Fetch existing materials for this college
        if (profileData.collegeId) {
          const matSnap = await getDocs(collection(db, 'colleges', profileData.collegeId, 'materials'));
          setExistingMaterials(matSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (err) {
        toast.error('Failed to authenticate.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [isReady, user, router]);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
      } else {
        toast.error('Please upload a PDF file.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !subjectName || !profile?.collegeId) {
      toast.error('Please fill in all fields and select a PDF.');
      return;
    }

    setIsUploading(true);
    setIsSuccess(false);
    setUploadProgress('Extracting PDF text…');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('subjectName', subjectName);

      setUploadProgress('Gemini AI is generating flashcards, formulas, flowcharts & quiz…');
      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to process PDF');
      }

      setUploadProgress("Saving to your college's secure storage…");

      // ── ISSUE 4 FIX: Save ONLY to colleges/{collegeId}/materials ─────────────
      const aiData = result.data;
      const materialsRef = collection(db, 'colleges', profile.collegeId, 'materials');
      const newDoc = await addDoc(materialsRef, {
        subjectName,
        semester,
        branch,
        totalTopics: aiData.totalTopics || aiData.topics?.length || 0,
        topics: aiData.topics || [],
        flowcharts: result.flowcharts || [],   // Issue 5: flowchart data
        rawText: result.rawText || '',
        uploadedAt: new Date().toISOString(),
        uploadedBy: user?.uid,
        collegeId: profile.collegeId,          // Denormalized for easier querying
      });

      // Update local list
      setExistingMaterials(prev => [{
        id: newDoc.id,
        subjectName,
        semester,
        branch,
        totalTopics: aiData.totalTopics || aiData.topics?.length || 0,
        uploadedAt: new Date().toISOString(),
      }, ...prev]);

      setIsSuccess(true);
      setFile(null);
      setSubjectName('');
      setUploadProgress('');

      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err: any) {
      console.error('Upload Error:', err);
      toast.error(err.message || 'An error occurred during processing.');
      setUploadProgress('');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isReady || loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FDF6EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#8B6E52', fontWeight: 700 }}>Loading Studio…</div>
      </div>
    );
  }

  const Sidebar = () => (
    <aside style={{
      position: 'fixed', left: 0, top: 0, height: '100%', width: 240,
      background: 'linear-gradient(180deg, #FFF8EE 0%, #F5E8D4 100%)',
      borderRight: '2px solid rgba(180,140,90,0.25)',
      display: 'flex', flexDirection: 'column', zIndex: 100,
      boxShadow: '4px 0 24px rgba(140,90,40,0.08)'
    }}>
      <div style={{ padding: '28px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, background: 'linear-gradient(135deg, #006B7A, #2E7D52)',
          borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,107,122,0.35)'
        }}>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>P</span>
        </div>
        <span style={{ fontWeight: 900, fontSize: 16, color: '#2C1A0E', letterSpacing: '-0.02em' }}>Admin Portal</span>
      </div>

      <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[
          { id: 'overview', label: 'Overview', icon: <FiHome />, path: '/college/dashboard' },
          { id: 'students', label: 'My Students', icon: <FiUsers />, path: '/college/dashboard?tab=students' },
          { id: 'library', label: 'PDF Library', icon: <FiFileText />, path: '/college/pdf-library' },
          { id: 'exams', label: 'Exam Schedule', icon: <FiCalendar />, path: '/college/exam-schedule' },
          { id: 'reports', label: 'Reports', icon: <FiPieChart />, path: '/college/dashboard?tab=reports' },
          { id: 'settings', label: 'Settings', icon: <FiSettings />, path: '/college/dashboard?tab=settings' },
        ].map(item => (
          <button key={item.id} onClick={() => router.push(item.path)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
            fontWeight: 700, fontSize: 14, textAlign: 'left', transition: 'all 0.2s',
            background: item.id === 'library' ? 'linear-gradient(135deg, #006B7A, #2E7D52)' : 'transparent',
            color: item.id === 'library' ? '#fff' : '#5C3D1E',
            boxShadow: item.id === 'library' ? '0 4px 14px rgba(0,107,122,0.35)' : 'none'
          }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span> {item.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: '16px 12px' }}>
        <button onClick={() => signOut()} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
          fontWeight: 700, fontSize: 14, background: 'transparent', color: '#D95F2B', transition: 'all 0.2s'
        }}>
          <FiLogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF6EC', display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: '40px 40px 80px', maxWidth: 1000 }}>

        <div style={{ marginBottom: 40, display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => router.push('/college/dashboard')} style={{ backgroundColor: 'var(--surface-raised)', border: '2px solid rgba(180,140,90,0.2)', width: 44, height: 44, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8B6E52', transition: 'all 0.2s' }}>
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#2C1A0E', letterSpacing: '-0.03em', marginBottom: 4 }}>PDF Library Studio</h1>
            <p style={{ color: '#8B6E52', fontSize: 14, fontWeight: 500 }}>Upload course PDFs. AI generates flashcards, formulas, flowcharts &amp; quizzes — private to your college only.</p>
          </div>
        </div>

        {/* Isolation Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#ECFDF5', border: '1.5px solid #34D399', borderRadius: 10, padding: '8px 16px', marginBottom: 28, fontSize: 13, fontWeight: 700, color: '#065F46' }}>
          🔒 Materials are private to <strong style={{ color: '#047857' }}>{profile?.collegeName || profile?.collegeCode || 'your college'}</strong> only
        </div>

        <AnimatePresence>
          {isSuccess && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ background: '#ECFDF5', border: '2px solid #34D399', borderRadius: 16, padding: '20px 24px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
              <FiCheckCircle size={32} color="#10B981" />
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: '#065F46', margin: '0 0 4px' }}>Study materials created successfully!</h3>
                <p style={{ margin: 0, fontSize: 14, color: '#047857', fontWeight: 500 }}>Your students can now access flashcards, formulas, flowcharts, and quizzes in their dashboard.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ backgroundColor: 'var(--surface-raised)', borderRadius: 24, border: '2px solid rgba(180,140,90,0.25)', boxShadow: '0 12px 30px rgba(140,90,40,0.08)', overflow: 'hidden' }}>
          <form onSubmit={handleUpload} style={{ padding: 40, display: 'flex', flexDirection: 'column', gap: 32 }}>

            {/* Drag and Drop Zone */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#2C1A0E', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>1. Upload Material</div>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${file ? '#006B7A' : 'rgba(180,140,90,0.4)'}`,
                  background: file ? '#E0F2F1' : '#FDF6EC',
                  borderRadius: 20, padding: 40, textAlign: 'center', cursor: 'pointer',
                  transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12
                }}
              >
                <FiUploadCloud size={48} color={file ? '#006B7A' : '#B89A7E'} />
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: file ? '#006B7A' : '#5C3D1E', margin: '0 0 4px' }}>
                    {file ? file.name : 'Drag & drop PDF here'}
                  </h3>
                  <p style={{ margin: 0, fontSize: 13, color: '#8B6E52', fontWeight: 500 }}>
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'or click to browse from your computer'}
                  </p>
                </div>
                <input type="file" accept="application/pdf" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
              </div>
            </div>

            {/* Form Fields */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#2C1A0E', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>2. Subject Details</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#5C3D1E', marginBottom: 8 }}>Subject Name</label>
                  <input type="text" placeholder="e.g. Engineering Mathematics II" required
                    value={subjectName} onChange={e => setSubjectName(e.target.value)}
                    style={{ width: '100%', background: '#FDF6EC', border: '1.5px solid rgba(180,140,90,0.2)', padding: '14px 16px', borderRadius: 12, outline: 'none', color: '#2C1A0E', fontWeight: 600, fontSize: 14, boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#5C3D1E', marginBottom: 8 }}>Semester</label>
                    <select value={semester} onChange={e => setSemester(e.target.value)} style={{ width: '100%', background: '#FDF6EC', border: '1.5px solid rgba(180,140,90,0.2)', padding: '14px 16px', borderRadius: 12, outline: 'none', color: '#2C1A0E', fontWeight: 600, fontSize: 14, appearance: 'none', cursor: 'pointer' }}>
                      {SEMESTERS.map(s => <option key={s} value={s}>{s} Semester</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#5C3D1E', marginBottom: 8 }}>Branch</label>
                    <select value={branch} onChange={e => setBranch(e.target.value)} style={{ width: '100%', background: '#FDF6EC', border: '1.5px solid rgba(180,140,90,0.2)', padding: '14px 16px', borderRadius: 12, outline: 'none', color: '#2C1A0E', fontWeight: 600, fontSize: 14, appearance: 'none', cursor: 'pointer' }}>
                      {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* What AI will generate */}
            <div style={{ background: '#F0FDF4', border: '1.5px solid rgba(46,125,82,0.2)', borderRadius: 16, padding: '16px 20px' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#2E7D52', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>AI will auto-generate</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {['📚 Flashcards', '📐 Formulas', '🔀 Flowcharts', '📝 MCQ Quiz', '🤖 Doubt Bot'].map(label => (
                  <span key={label} style={{ background: 'white', border: '1.5px solid rgba(46,125,82,0.2)', borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 700, color: '#065F46' }}>{label}</span>
                ))}
              </div>
            </div>

            {/* Progress indicator */}
            <AnimatePresence>
              {isUploading && uploadProgress && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: '#FFF8EE', border: '1.5px solid rgba(180,140,90,0.3)', borderRadius: 12 }}>
                  <div style={{ width: 20, height: 20, border: '2px solid #006B7A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#5C3D1E' }}>{uploadProgress}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button type="submit" disabled={isUploading || !file} style={{
              width: '100%', padding: '18px 0', fontSize: 15, marginTop: 10,
              background: isUploading ? '#8B6E52' : 'linear-gradient(135deg, #006B7A, #2E7D52)',
              color: '#fff', border: 'none', borderRadius: 16, cursor: isUploading || !file ? 'not-allowed' : 'pointer',
              fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase',
              boxShadow: isUploading ? 'none' : '0 10px 24px rgba(0,107,122,0.3)',
              transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12
            }}>
              {isUploading ? 'AI is processing your PDF…' : '🚀 Process & Save to College Library'}
            </button>
          </form>
        </div>

        {/* Existing Materials List */}
        {existingMaterials.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#2C1A0E', marginBottom: 20 }}>
              Uploaded Materials ({existingMaterials.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {existingMaterials.map(mat => (
                <div key={mat.id} style={{ backgroundColor: 'var(--surface-raised)', border: '1.5px solid rgba(180,140,90,0.2)', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #006B7A, #2E7D52)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiFileText color="white" size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: '#2C1A0E' }}>{mat.subjectName}</div>
                      <div style={{ fontSize: 12, color: '#8B6E52', fontWeight: 600 }}>{mat.semester} Sem · {mat.branch} · {mat.totalTopics} topics</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FiGitMerge size={14} color="#8B6E52" />
                    <span style={{ fontSize: 12, color: '#8B6E52', fontWeight: 600 }}>
                      {mat.uploadedAt ? new Date(mat.uploadedAt).toLocaleDateString('en-IN') : '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
