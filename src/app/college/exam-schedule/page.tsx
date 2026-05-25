'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FiHome, FiUsers, FiSettings, FiLogOut, FiFileText, 
  FiLayers, FiCalendar, FiPieChart, FiArrowLeft, FiClock, FiCheckSquare, FiAlertCircle
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { toast } from '@/lib/toast';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs, addDoc, query, where } from 'firebase/firestore';

export default function ExamSchedulePage() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const { isReady } = useAuthGuard();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  // Data
  const [subjects, setSubjects] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [studentEmails, setStudentEmails] = useState<string[]>([]);
  
  // Form State
  const [examName, setExamName] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [examDate, setExamDate] = useState('');
  const [batch, setBatch] = useState('All Students');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isReady || !user) return;
    const init = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const data = userDoc.data();
        if (!userDoc.exists() || data?.role !== 'college') {
           const role = data?.role || 'student';
           if (role === 'student') router.push('/dashboard');
           else if (role === 'company') router.push('/company/dashboard');
           else if (role === 'admin') router.push('/admin/dashboard');
           else router.push('/dashboard');
           return;
        }
        setProfile(data);

        const collegeId = data.collegeId;
        const collegeCode = data.collegeCode;

        // Fetch Subjects from isolated college materials path
        if (collegeId) {
          const subsSnap = await getDocs(collection(db, 'colleges', collegeId, 'materials'));
          setSubjects(subsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
          
          // Fetch Exams from isolated college exams path
          const examsSnap = await getDocs(collection(db, 'colleges', collegeId, 'exams'));
          const examsList = examsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
          examsList.sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());
          setExams(examsList);
        }

        // Fetch Student Emails
        if (collegeCode) {
          const studentsQ = query(collection(db, 'users'), where('collegeCode', '==', collegeCode));
          const studentsSnap = await getDocs(studentsQ);
          const emails = studentsSnap.docs.map(d => d.data().email).filter(Boolean);
          setStudentEmails(emails);
        }

      } catch (err) {
        console.error(err);
        toast.error("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [isReady, user, router]);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubjectId(e.target.value);
    setSelectedTopics([]);
  };

  const toggleTopic = (topicName: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicName) 
        ? prev.filter(t => t !== topicName)
        : [...prev, topicName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName || !selectedSubjectId || !examDate || selectedTopics.length === 0) {
      toast.error('Please fill all required fields and select at least one topic.');
      return;
    }

    setIsSubmitting(true);
    try {
      const targetSubject = subjects.find(s => s.id === selectedSubjectId);
      const eDate = new Date(examDate);

      // Create Exam Doc
      const newExam = {
        collegeId: profile.collegeId,
        examName,
        subjectId: selectedSubjectId,
        subjectName: targetSubject?.subjectName || '',
        examDate: eDate.toISOString(),
        batch,
        topics: selectedTopics,
        createdAt: new Date().toISOString()
      };

      // Write exam to isolated subcollection under this college
      const examRef = await addDoc(collection(db, 'colleges', profile.collegeId, 'exams'), newExam);
      setExams(prev => [...prev, { id: examRef.id, ...newExam }].sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime()));

      // Schedule Reminders
      if (studentEmails.length > 0) {
        const remindersToSchedule = [];
        const now = new Date();
        
        const schedule = [
          { days: 7, msg: `Your exam "${examName}" is in 1 week. Start reviewing!` },
          { days: 3, msg: `Your exam "${examName}" is in 3 days. Focus on these topics: ${selectedTopics.join(', ')}` },
          { days: 1, msg: `Your exam "${examName}" is tomorrow! Last minute tips: complete the quiz for each topic.` },
          { days: 0, msg: `Good luck today on "${examName}"! You've got this.` }
        ];

        for (const item of schedule) {
          const sendD = new Date(eDate.getTime() - (item.days * 24 * 60 * 60 * 1000));
          // If the send date is in the future, schedule it (or if it's 0 days and today is the day)
          if (sendD > now || item.days === 0) {
            remindersToSchedule.push({
              examId: examRef.id,
              studentEmails,
              sendDate: sendD.toISOString(),
              status: 'pending',
              subject: `Reminder: ${examName} is approaching`,
              messageHtml: `<div style="font-family:sans-serif;color:#333;"><h2>Exam Reminder</h2><p>${item.msg}</p><p>Study well!</p></div>`
            });
          }
        }

        // Batch write or loop (looping for simplicity)
        for (const rem of remindersToSchedule) {
          await addDoc(collection(db, 'exam_reminders'), rem);
        }
      }

      toast.success('Exam scheduled and automatic reminders queued!');
      setExamName('');
      setSelectedSubjectId('');
      setExamDate('');
      setSelectedTopics([]);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to schedule exam.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  // Status calculation
  const getExamStatus = (isoDate: string) => {
    const eDate = new Date(isoDate);
    const today = new Date();
    const diffTime = eDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { label: 'Past', color: '#9CA3AF', days: diffDays };
    if (diffDays < 3) return { label: 'Urgent', color: '#EF4444', days: diffDays };
    if (diffDays <= 7) return { label: 'Soon', color: '#F59E0B', days: diffDays };
    return { label: 'Upcoming', color: '#10B981', days: diffDays };
  };

  if (!isReady || loading) {
    return <div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center font-bold text-gray-600 dark:text-gray-400">Loading...</div>;
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
          borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
          boxShadow: '0 4px 12px rgba(0,107,122,0.35)'
        }}>
          <span style={{ fontWeight: 900, fontSize: 18, marginLeft: 11 }}>P</span>
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
            background: item.id === 'exams' ? 'linear-gradient(135deg, #006B7A, #2E7D52)' : 'transparent',
            color: item.id === 'exams' ? '#fff' : '#5C3D1E',
            boxShadow: item.id === 'exams' ? '0 4px 14px rgba(0,107,122,0.35)' : 'none'
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
      <main style={{ marginLeft: 240, flex: 1, padding: '40px 40px 80px', maxWidth: 1200 }}>
         
         <div style={{ marginBottom: 40, display: 'flex', alignItems: 'center', gap: 16 }}>
           <button onClick={() => router.push('/college/dashboard')} style={{ backgroundColor: 'var(--surface-raised)', border: '2px solid rgba(180,140,90,0.2)', width: 44, height: 44, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8B6E52', transition: 'all 0.2s' }}>
             <FiArrowLeft size={20} />
           </button>
           <div>
             <h1 style={{ fontSize: 28, fontWeight: 900, color: '#2C1A0E', letterSpacing: '-0.03em', marginBottom: 4 }}>Exam Schedule</h1>
             <p style={{ color: '#8B6E52', fontSize: 14, fontWeight: 500 }}>Create exams, select topics, and automatically schedule email reminders for your students.</p>
           </div>
         </div>

         <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.2fr] gap-8">
           {/* CREATE EXAM FORM */}
           <div className="bg-white dark:bg-gray-800 border-2 border-[#B48C5A]/25 dark:border-gray-700 rounded-[24px] p-8 shadow-sm h-fit">
             <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-6">Schedule New Exam</h2>
             <form onSubmit={handleSubmit} className="flex flex-col gap-5">
               <div>
                 <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-2">Exam Name</label>
                 <input type="text" placeholder="e.g. Mid Term 1 - Data Structures" required
                   value={examName} onChange={e => setExamName(e.target.value)}
                   className="w-full bg-[#FDF6EC] border-2 border-[#B48C5A]/20 dark:border-gray-700 p-3.5 rounded-xl outline-none font-semibold text-gray-900 dark:text-gray-100 focus:border-[#006B7A] transition-colors"
                 />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-2">Subject Material</label>
                   <select required value={selectedSubjectId} onChange={handleSubjectChange} className="w-full bg-[#FDF6EC] border-2 border-[#B48C5A]/20 dark:border-gray-700 p-3.5 rounded-xl outline-none font-semibold text-gray-900 dark:text-gray-100 cursor-pointer">
                     <option value="" disabled>Select PDF Subject...</option>
                     {subjects.map(s => <option key={s.id} value={s.id}>{s.subjectName}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-2">Target Batch</label>
                   <input type="text" required
                     value={batch} onChange={e => setBatch(e.target.value)}
                     className="w-full bg-[#FDF6EC] border-2 border-[#B48C5A]/20 dark:border-gray-700 p-3.5 rounded-xl outline-none font-semibold text-gray-900 dark:text-gray-100"
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-2">Exam Date & Time</label>
                 <input type="datetime-local" required
                   value={examDate} onChange={e => setExamDate(e.target.value)}
                   className="w-full bg-[#FDF6EC] border-2 border-[#B48C5A]/20 dark:border-gray-700 p-3.5 rounded-xl outline-none font-semibold text-gray-900 dark:text-gray-100"
                 />
               </div>

               {selectedSubject && (
                 <div className="mt-2">
                   <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-3">Topics Covered (Select to include)</label>
                   <div className="bg-[#FDF6EC] border-2 border-[#B48C5A]/20 dark:border-gray-700 rounded-xl p-4 max-h-60 overflow-y-auto flex flex-col gap-2">
                     {selectedSubject.topics?.map((t: any, i: number) => (
                       <label key={i} className="flex items-center gap-3 cursor-pointer group">
                         <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${selectedTopics.includes(t.topicName) ? 'bg-[#006B7A] border-[#006B7A]' : 'border-[#B48C5A]/40 bg-white dark:bg-gray-800 group-hover:border-[#006B7A]/50'}`}>
                           {selectedTopics.includes(t.topicName) && <FiCheckSquare color="white" size={12} />}
                         </div>
                         <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t.topicName}</span>
                       </label>
                     ))}
                   </div>
                 </div>
               )}

               <button type="submit" disabled={isSubmitting} className="mt-4 bg-gradient-to-r from-[#006B7A] to-[#2E7D52] text-white py-4 rounded-xl font-black shadow-lg shadow-[#006B7A]/30 hover:-translate-y-0.5 transition-transform disabled:opacity-50">
                 {isSubmitting ? 'Scheduling...' : 'Schedule Exam & Reminders'}
               </button>
             </form>
           </div>

           {/* EXAM LIST */}
           <div className="bg-white dark:bg-gray-800 border-2 border-[#B48C5A]/25 dark:border-gray-700 rounded-[24px] p-8 shadow-sm flex flex-col h-full">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-black text-gray-900 dark:text-gray-100">Scheduled Exams</h2>
               <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                 <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> {'>'} 7 Days</span>
                 <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> 3-7 Days</span>
                 <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> {'<'} 3 Days</span>
               </div>
             </div>

             <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-2">
               {exams.length === 0 ? (
                 <div className="text-center py-12 text-gray-600 dark:text-gray-400 font-semibold">No exams scheduled yet.</div>
               ) : (
                 exams.map(exam => {
                   const status = getExamStatus(exam.examDate);
                   const dateObj = new Date(exam.examDate);
                   return (
                     <div key={exam.id} className="border-2 border-[#B48C5A]/15 rounded-2xl p-5 flex items-start justify-between bg-gradient-to-r from-transparent to-[#FDF6EC]/30">
                       <div>
                         <h3 className="font-black text-gray-900 dark:text-gray-100 text-lg mb-1">{exam.examName}</h3>
                         <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-3">
                           <FiFileText /> {exam.subjectName} • {exam.batch}
                         </div>
                         <div className="flex flex-wrap gap-2">
                           {exam.topics?.slice(0, 3).map((t: string) => (
                             <span key={t} className="bg-[#F5E8D4] text-gray-800 dark:text-gray-300 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider truncate max-w-[120px]">{t}</span>
                           ))}
                           {exam.topics?.length > 3 && <span className="text-xs font-bold text-gray-600 dark:text-gray-400">+{exam.topics.length - 3} more</span>}
                         </div>
                       </div>
                       <div className="flex flex-col items-end gap-2">
                         <div className="text-sm font-black text-gray-900 dark:text-gray-100">
                           {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                         </div>
                         <div className="text-xs font-bold text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-[#B48C5A]/20 dark:border-gray-700 px-2 py-1 rounded-md shadow-sm">
                           {dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                         </div>
                         {status.days >= 0 && (
                           <div className="flex items-center gap-1.5 text-xs font-black mt-2" style={{ color: status.color }}>
                             <div className="w-2 h-2 rounded-full" style={{ background: status.color }} />
                             {status.days === 0 ? 'Today' : `${status.days} Days Left`}
                           </div>
                         )}
                       </div>
                     </div>
                   );
                 })
               )}
             </div>
           </div>
         </div>
      </main>
    </div>
  );
}
