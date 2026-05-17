'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiUsers, FiSettings, FiLogOut, FiUploadCloud, 
  FiFileText, FiLayers, FiCalendar, FiPieChart, FiArrowLeft, FiCheckCircle
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { toast } from '@/lib/toast';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';

export default function PdfLibraryPage() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const { isReady } = useAuthGuard();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  // Upload States
  const [file, setFile] = useState<File | null>(null);
  const [subjectName, setSubjectName] = useState('');
  const [semester, setSemester] = useState('1st');
  const [branch, setBranch] = useState('CSE');
  const [isUploading, setIsUploading] = useState(false);
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
          router.push('/dashboard');
          return;
        }
        setProfile(userDoc.data());
      } catch (err) {
        toast.error("Failed to authenticate.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [isReady, user, router]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
      } else {
        toast.error('Please upload a PDF file.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !subjectName || !profile?.collegeId) {
      toast.error('Please fill in all fields and select a PDF.');
      return;
    }

    setIsUploading(true);
    setIsSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('subjectName', subjectName);

      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to process PDF');
      }

      // Save to Firestore
      const aiData = result.data;
      
      const pdfsRef = collection(db, 'college_pdfs', profile.collegeId, 'subjects');
      await addDoc(pdfsRef, {
        subjectName,
        semester,
        branch,
        totalTopics: aiData.totalTopics || aiData.topics?.length || 0,
        topics: aiData.topics || [],
        rawText: result.rawText || '',
        uploadedAt: new Date().toISOString(),
        uploadedBy: user?.uid,
      });

      setIsSuccess(true);
      setFile(null);
      setSubjectName('');
      
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);

    } catch (err: any) {
      console.error("Upload Error:", err);
      toast.error(err.message || 'An error occurred during processing.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isReady || loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FDF6EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#8B6E52', fontWeight: 700 }}>Loading Studio...</div>
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
          { id: 'students', label: 'My Students', icon: <FiUsers />, path: '/college/dashboard' },
          { id: 'batches', label: 'Batches', icon: <FiLayers />, path: '/college/dashboard' },
          { id: 'library', label: 'PDF Library', icon: <FiFileText />, path: '/college/pdf-library' },
          { id: 'exams', label: 'Exam Schedule', icon: <FiCalendar />, path: '/college/dashboard' },
          { id: 'reports', label: 'Reports', icon: <FiPieChart />, path: '/college/dashboard' },
          { id: 'settings', label: 'Settings', icon: <FiSettings />, path: '/college/dashboard' },
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
           <button onClick={() => router.push('/college/dashboard')} style={{ background: '#FFFFFF', border: '2px solid rgba(180,140,90,0.2)', width: 44, height: 44, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8B6E52', transition: 'all 0.2s' }}>
             <FiArrowLeft size={20} />
           </button>
           <div>
             <h1 style={{ fontSize: 28, fontWeight: 900, color: '#2C1A0E', letterSpacing: '-0.03em', marginBottom: 4 }}>PDF Library Studio</h1>
             <p style={{ color: '#8B6E52', fontSize: 14, fontWeight: 500 }}>Upload syllabus and course PDFs. Our AI will automatically generate flashcards, quizzes, and formulas.</p>
           </div>
         </div>

         <AnimatePresence>
           {isSuccess && (
             <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ background: '#ECFDF5', border: '2px solid #34D399', borderRadius: 16, padding: '20px 24px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
               <FiCheckCircle size={32} color="#10B981" />
               <div>
                 <h3 style={{ fontSize: 16, fontWeight: 900, color: '#065F46', margin: '0 0 4px' }}>Study materials created successfully!</h3>
                 <p style={{ margin: 0, fontSize: 14, color: '#047857', fontWeight: 500 }}>Your students can now access flashcards, formulas, and quizzes for this subject in their dashboard.</p>
               </div>
             </motion.div>
           )}
         </AnimatePresence>

         <div style={{ background: '#FFFFFF', borderRadius: 24, border: '2px solid rgba(180,140,90,0.25)', boxShadow: '0 12px 30px rgba(140,90,40,0.08)', overflow: 'hidden' }}>
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
                 <input 
                   type="file" accept="application/pdf"
                   ref={fileInputRef} onChange={handleFileChange}
                   style={{ display: 'none' }}
                 />
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
                     style={{ width: '100%', background: '#FDF6EC', border: '1.5px solid rgba(180,140,90,0.2)', padding: '14px 16px', borderRadius: 12, outline: 'none', color: '#2C1A0E', fontWeight: 600, fontSize: 14 }}
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
               {isUploading ? (
                 <>
                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                   AI is analyzing your PDF and creating study materials...
                 </>
               ) : (
                 'Process Subject Material'
               )}
             </button>
           </form>
         </div>
      </main>
    </div>
  );
}
