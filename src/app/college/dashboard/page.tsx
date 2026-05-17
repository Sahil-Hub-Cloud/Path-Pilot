'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiUsers, FiSettings, FiLogOut, FiSearch, 
  FiXCircle, FiActivity, FiUser, FiMapPin, 
  FiAward, FiCheckCircle, FiChevronRight, FiCopy, FiMail, FiBook, FiLayers, FiFileText, FiCalendar, FiPieChart, FiTrendingUp
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { toast } from '@/lib/toast';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export default function CollegeAdminDashboard() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const { isReady } = useAuthGuard();
  
  const [activeNav, setActiveNav] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);

  // Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrack, setFilterTrack] = useState('All Tracks');
  const [filterLevel, setFilterLevel] = useState('All Levels');
  const [filterStatus, setFilterStatus] = useState('All Statuses');

  // Modal State
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isNudging, setIsNudging] = useState(false);

  // Constants
  const TRACKS = ["MERN Stack", "Frontend Dev", "Backend Dev", "AI Engineering", "Cybersecurity", "Cloud & DevOps", "Android Dev", "DSA & Interviews"];
  const LEVELS = ["High — Job Ready", "Medium", "Unrated"];
  const STATUSES = ["Active", "Idle", "At Risk"];

  // 1. Initial Load & Access Control
  useEffect(() => {
    if (!isReady || !user) return;
    
    const initDashboard = async () => {
      try {
        setLoading(true);
        // Check Admin Profile
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists() || userDoc.data()?.role !== 'college') {
          router.push('/dashboard');
          return;
        }
        
        const data = userDoc.data();
        setProfile(data);

        // Fetch Students
        if (data.collegeCode) {
          const q = query(collection(db, 'users'), where('collegeCode', '==', data.collegeCode));
          const snapshot = await getDocs(q);
          
          const now = new Date();
          const studentList = snapshot.docs.map(doc => {
            const sd = doc.data();
            
            // Calculate Status
            let lastDate = new Date();
            let hasDate = false;
            if (sd.lastActiveTs?.seconds) {
              lastDate = new Date(sd.lastActiveTs.seconds * 1000);
              hasDate = true;
            } else if (sd.lastActiveDate) {
              lastDate = new Date(sd.lastActiveDate);
              hasDate = true;
            }

            let status = 'At Risk';
            let diffDays = 999;
            if (hasDate) {
              const diffTime = Math.abs(now.getTime() - lastDate.getTime());
              diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              if (diffDays <= 2) status = 'Active';
              else if (diffDays <= 4) status = 'Idle';
            }

            let empLevel = sd.employabilityLevel || 'Unrated';
            if (empLevel.includes('High') || empLevel.includes('Elite')) empLevel = 'High — Job Ready';
            else if (empLevel.includes('Medium') || empLevel.includes('Advanced')) empLevel = 'Medium';
            else empLevel = 'Unrated';

            return {
              id: doc.id,
              name: sd.displayName || sd.fullName || 'Unknown Student',
              email: sd.email || '',
              track: sd.learningPath || sd.track || 'Frontend Dev',
              labs: sd.labsCompleted || 0,
              score: sd.skillScore || 0,
              empScore: sd.employabilityScore || 0,
              empLevel: empLevel,
              lastActive: hasDate ? lastDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Never',
              diffDays,
              status,
              completedTopics: sd.completedTopics || [],
              labSubmissions: sd.completedLabsList || [],
            };
          });
          setStudents(studentList.sort((a, b) => b.score - a.score));
        }
      } catch (err) {
        console.error("Dashboard init error:", err);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    
    initDashboard();
  }, [isReady, user, router]);

  // 2. Stats Calculation
  const stats = useMemo(() => {
    const total = students.length;
    const avgEmp = total > 0 ? Math.round(students.reduce((a, b) => a + b.empScore, 0) / total) : 0;
    const jobReady = students.filter(s => s.empLevel === 'High — Job Ready').length;
    const atRisk = students.filter(s => s.status === 'At Risk').length;
    return { total, avgEmp, jobReady, atRisk };
  }, [students]);

  // 3. Filtering
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTrack = filterTrack === 'All Tracks' || s.track === filterTrack;
      const matchLevel = filterLevel === 'All Levels' || s.empLevel === filterLevel;
      const matchStatus = filterStatus === 'All Statuses' || s.status === filterStatus;
      
      return matchSearch && matchTrack && matchLevel && matchStatus;
    });
  }, [students, searchQuery, filterTrack, filterLevel, filterStatus]);

  // 4. Generate AI Summary
  useEffect(() => {
    if (showProfile && selectedStudent && !aiSummary) {
      const generateSummary = async () => {
        setIsGeneratingAi(true);
        try {
          const prompt = `You are an AI career advisor. Write a short, highly professional 3-sentence progress summary for a student named ${selectedStudent.name}.
          They are studying ${selectedStudent.track}. They have completed ${selectedStudent.labs} labs and their skill score is ${selectedStudent.score}/100.
          Format the output strictly as: 'This student has completed X topics in Y track. Their strongest area is Z. They need improvement in W. Estimated time to job readiness: N weeks.'`;
          
          const res = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
          });
          const data = await res.json();
          if (data.text) {
            setAiSummary(data.text);
          } else {
            setAiSummary("AI summary currently unavailable.");
          }
        } catch (e) {
          setAiSummary("AI summary currently unavailable due to network error.");
        }
        setIsGeneratingAi(false);
      };
      generateSummary();
    }
  }, [showProfile, selectedStudent, aiSummary]);

  const handleOpenProfile = (student: any) => {
    setSelectedStudent(student);
    setAiSummary('');
    setShowProfile(true);
  };

  const handleCopyCode = () => {
    if (profile?.collegeCode) {
      navigator.clipboard.writeText(profile.collegeCode);
      toast.success("College Code copied!");
    }
  };

  const handleSendNudge = async () => {
    if (!selectedStudent || !selectedStudent.email) return;
    setIsNudging(true);
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selectedStudent.email,
          subject: `Important: Resume your training on Path Pilot`,
          html: `
            <div style="font-family: sans-serif; color: #2C1A0E;">
              <h2>Action Required: Resume Your Training</h2>
              <p>Hi ${selectedStudent.name},</p>
              <p>Your college administrator at <strong>${profile.collegeName}</strong> noticed your account has been inactive recently.</p>
              <p>Consistent practice is key to mastering the <b>${selectedStudent.track}</b> track. Log in today to protect your streak and continue your progress.</p>
              <a href="https://pathpilot.dev/dashboard" style="background: #006B7A; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 12px; display: inline-block; font-weight: 700; margin-top: 10px;">Return to Dashboard</a>
            </div>
          `
        })
      });
      toast.success('Nudge email sent directly to student!');
    } catch (err) {
      toast.error('Failed to send nudge email');
    }
    setIsNudging(false);
  };

  if (!isReady || loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FDF6EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#8B6E52', fontWeight: 700 }}>Loading Dashboard...</div>
      </div>
    );
  }

  // --- VIEWS ---

  const OverviewView = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
           <div>
             <h1 style={{ fontSize: 28, fontWeight: 900, color: '#2C1A0E', letterSpacing: '-0.03em', marginBottom: 4 }}>Institution Overview</h1>
             <p style={{ color: '#8B6E52', fontSize: 14, fontWeight: 500 }}>Track and manage your student cohort's performance.</p>
           </div>
           
           <div style={{ background: '#FFFFFF', border: '2px solid rgba(180,140,90,0.3)', borderRadius: 16, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 4px 12px rgba(140,90,40,0.05)' }}>
             <div>
               <div style={{ fontSize: 10, fontWeight: 800, color: '#8B6E52', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Institution Code</div>
               <div style={{ fontSize: 18, fontWeight: 900, color: '#006B7A', letterSpacing: '0.05em' }}>{profile?.collegeCode}</div>
             </div>
             <div style={{ width: 1, height: 30, background: 'rgba(180,140,90,0.2)' }} />
             <button onClick={handleCopyCode} style={{ background: 'rgba(0,107,122,0.1)', border: 'none', width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#006B7A', cursor: 'pointer', transition: 'all 0.2s' }}>
                <FiCopy size={16} />
             </button>
           </div>
        </div>

        {/* 4 STAT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 40 }}>
          {[
            { label: 'Total Students', value: stats.total, icon: <FiUsers />, color: '#006B7A' },
            { label: 'Avg Employability', value: `${stats.avgEmp}/100`, icon: <FiActivity />, color: '#2E7D52' },
            { label: 'Job Ready Students', value: stats.jobReady, icon: <FiAward />, color: '#F59E0B' },
            { label: 'At Risk Students', value: stats.atRisk, icon: <FiCheckCircle />, color: '#EF4444' },
          ].map((s, i) => (
            <motion.div key={i} whileHover={{ y: -4 }} style={cardStyle}>
              <div style={{
                width: 36, height: 36, background: `${s.color}15`, border: `1.5px solid ${s.color}30`,
                borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: s.color, fontSize: 16, marginBottom: 14
              }}>{s.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#2C1A0E', letterSpacing: '-0.04em', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#8B6E52', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* FILTER BAR */}
        <div style={{
          background: '#FFFFFF', borderRadius: 20, padding: '20px 24px', border: '2px solid rgba(180,140,90,0.25)',
          marginBottom: 28, display: 'flex', gap: 16, alignItems: 'center', boxShadow: '0 4px 14px rgba(140,90,40,0.05)'
        }}>
          <div style={{ 
            background: '#FDF6EC', border: '1.5px solid rgba(180,140,90,0.2)', borderRadius: 12, padding: '10px 16px', 
            display: 'flex', alignItems: 'center', gap: 10, flex: 1 
          }}>
            <FiSearch color="#8B6E52" />
            <input 
              placeholder="Search students by name..." 
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', color: '#2C1A0E', fontWeight: 600, width: '100%', fontSize: 14 }}
            />
          </div>

          <select value={filterTrack} onChange={e => setFilterTrack(e.target.value)} style={selectStyle}>
            <option>All Tracks</option>
            {TRACKS.map(t => <option key={t}>{t}</option>)}
          </select>

          <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} style={selectStyle}>
            <option>All Levels</option>
            {LEVELS.map(l => <option key={l}>{l}</option>)}
          </select>

          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selectStyle}>
            <option>All Statuses</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* BOTTOM SECTION: TABLE */}
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(180,140,90,0.05)', borderBottom: '2px solid rgba(180,140,90,0.1)' }}>
                <th style={thStyle}>Student</th>
                <th style={thStyle}>Track</th>
                <th style={thStyle}>Labs</th>
                <th style={thStyle}>Score</th>
                <th style={thStyle}>Employability</th>
                <th style={thStyle}>Last Active</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s, i) => {
                const empColor = s.empLevel === 'High — Job Ready' ? '#10B981' : s.empLevel === 'Medium' ? '#F59E0B' : '#6B7280';
                const statColor = s.status === 'Active' ? '#10B981' : s.status === 'Idle' ? '#F59E0B' : '#EF4444';
                
                return (
                  <tr key={s.id} onClick={() => handleOpenProfile(s)} style={{ 
                    borderBottom: '1.5px solid rgba(180,140,90,0.1)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(253,246,236,0.5)',
                    cursor: 'pointer'
                  }} className="hover:bg-amber-50/50 transition-colors">
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #006B7A, #2E7D52)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 900 }}>{s.name[0]}</div>
                        <div style={{ fontWeight: 800, color: '#2C1A0E', fontSize: 14 }}>{s.name}</div>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#006B7A', background: '#e0f2f1', padding: '2px 8px', borderRadius: 6 }}>{s.track}</span>
                    </td>
                    <td style={tdStyle}>{s.labs}</td>
                    <td style={{ ...tdStyle, fontWeight: 900, color: '#006B7A' }}>{s.score}</td>
                    <td style={tdStyle}>
                     <span style={{ fontSize: 11, fontWeight: 800, color: empColor, background: `${empColor}15`, padding: '2px 8px', borderRadius: 6 }}>{s.empLevel}</span>
                    </td>
                    <td style={tdStyle}>{s.lastActive}</td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800, color: statColor }}>
                         <div style={{ width: 8, height: 8, borderRadius: '50%', background: statColor }} />
                         {s.status}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
             <div style={{ padding: 60, textAlign: 'center', color: '#8B6E52', fontWeight: 600 }}>No students match the current criteria.</div>
          )}
        </div>
    </motion.div>
  );

  const UnderConstruction = ({ title }: { title: string }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={cardStyle}>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: '#2C1A0E', marginBottom: 12 }}>{title}</h2>
      <div style={{ padding: 40, border: '2px dashed rgba(180,140,90,0.2)', borderRadius: 20, textAlign: 'center', color: '#B89A7E' }}>
         This module is currently under development.
      </div>
    </motion.div>
  );

  // --- SIDEBAR COMPONENT ---
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
          { id: 'overview', label: 'Overview', icon: <FiHome /> },
          { id: 'students', label: 'My Students', icon: <FiUsers /> },
          { id: 'batches', label: 'Batches', icon: <FiLayers /> },
          { id: 'library', label: 'PDF Library', icon: <FiFileText /> },
          { id: 'exams', label: 'Exam Schedule', icon: <FiCalendar /> },
          { id: 'reports', label: 'Reports', icon: <FiPieChart /> },
          { id: 'settings', label: 'Settings', icon: <FiSettings /> },
        ].map(item => (
          <button key={item.id} onClick={() => setActiveNav(item.id)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
            fontWeight: 700, fontSize: 14, textAlign: 'left', transition: 'all 0.2s',
            background: activeNav === item.id ? 'linear-gradient(135deg, #006B7A, #2E7D52)' : 'transparent',
            color: activeNav === item.id ? '#fff' : '#5C3D1E',
            boxShadow: activeNav === item.id ? '0 4px 14px rgba(0,107,122,0.35)' : 'none'
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

  // --- MAIN RENDER ---
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF6EC', display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: '40px 40px 80px', maxWidth: 1400 }}>
         <AnimatePresence mode="wait">
            {activeNav === 'overview' && <OverviewView key="overview" />}
            {activeNav === 'students' && <UnderConstruction key="students" title="My Students Directory" />}
            {activeNav === 'batches' && <UnderConstruction key="batches" title="Batch Management" />}
            {activeNav === 'library' && <UnderConstruction key="library" title="PDF Library" />}
            {activeNav === 'exams' && <UnderConstruction key="exams" title="Exam Schedule" />}
            {activeNav === 'reports' && <UnderConstruction key="reports" title="Analytics & Reports" />}
            {activeNav === 'settings' && <UnderConstruction key="settings" title="Admin Settings" />}
         </AnimatePresence>
      </main>

      {/* STUDENT SIDE PANEL MODAL */}
      <AnimatePresence>
        {showProfile && selectedStudent && (
          <div style={modalOverlayStyle} onClick={() => setShowProfile(false)}>
            <motion.div 
              style={profileModalStyle} onClick={e => e.stopPropagation()} 
              initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div style={{ padding: '24px 32px', borderBottom: '2px solid rgba(180,140,90,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFF8EE' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <FiUser color="#006B7A" size={20} />
                  <span style={{ fontWeight: 900, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#006B7A' }}>Student Dossier</span>
                </div>
                <button onClick={() => setShowProfile(false)} style={{ background: 'none', border: 'none', color: '#8B6E52', cursor: 'pointer' }}><FiXCircle size={24} /></button>
              </div>
              
              <div style={{ padding: '32px', overflowY: 'auto', height: 'calc(100vh - 80px)' }}>
                {/* Header Info */}
                <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
                   <div style={{ width: 80, height: 80, borderRadius: 24, background: 'linear-gradient(135deg, #006B7A, #2E7D52)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900, color: '#fff', boxShadow: '0 10px 20px rgba(0,107,122,0.2)', flexShrink: 0 }}>
                     {selectedStudent.name[0]}
                   </div>
                   <div style={{ flex: 1 }}>
                     <h2 style={{ fontSize: 24, fontWeight: 900, color: '#2C1A0E', letterSpacing: '-0.02em', margin: '0 0 4px' }}>{selectedStudent.name}</h2>
                     <p style={{ color: '#8B6E52', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, margin: '0 0 12px' }}><FiMail /> {selectedStudent.email}</p>
                     <div style={{ display: 'flex', gap: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 8, background: '#E0F2F1', color: '#006B7A' }}>{selectedStudent.track}</span>
                        <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 8, background: selectedStudent.status === 'Active' ? '#D1FAE5' : selectedStudent.status === 'Idle' ? '#FEF3C7' : '#FEE2E2', color: selectedStudent.status === 'Active' ? '#065F46' : selectedStudent.status === 'Idle' ? '#92400E' : '#991B1B' }}>Status: {selectedStudent.status}</span>
                     </div>
                   </div>
                </div>

                {/* Gemini AI Summary */}
                <div style={{ background: 'linear-gradient(135deg, #FDF6EC, #FFF)', border: '2px solid rgba(180,140,90,0.2)', borderRadius: 16, padding: '20px', marginBottom: 32, position: 'relative', overflow: 'hidden' }}>
                   <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, background: 'radial-gradient(circle, rgba(217,95,43,0.1) 0%, transparent 70%)' }} />
                   <h3 style={{ fontSize: 12, fontWeight: 900, color: '#D95F2B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><FiActivity /> Gemini AI Progress Summary</h3>
                   {isGeneratingAi ? (
                     <div style={{ color: '#8B6E52', fontSize: 14, fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 8 }}>
                       <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /> Analyzing student data...
                     </div>
                   ) : (
                     <p style={{ fontSize: 15, lineHeight: 1.6, color: '#2C1A0E', fontWeight: 600, margin: 0 }}>
                       "{aiSummary}"
                     </p>
                   )}
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
                  <div style={modalStatCard}>
                    <div style={modalInfoLabel}>AI Skill Score</div>
                    <div style={{ fontSize: 28, fontWeight: 950, color: '#006B7A' }}>{selectedStudent.score}<span style={{ fontSize: 14, opacity: 0.6 }}>/100</span></div>
                    <div style={{ fontSize: 12, color: '#8B6E52', marginTop: 4, fontWeight: 600 }}>Algorithm Analysis: B+</div>
                  </div>
                  <div style={modalStatCard}>
                    <div style={modalInfoLabel}>Completed Labs</div>
                    <div style={{ fontSize: 28, fontWeight: 950, color: '#2E7D52' }}>{selectedStudent.labs}</div>
                    <div style={{ fontSize: 12, color: '#8B6E52', marginTop: 4, fontWeight: 600 }}>Top 20% in cohort</div>
                  </div>
                </div>

                {/* Lab History */}
                <div style={{ marginBottom: 32 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 900, color: '#2C1A0E', marginBottom: 16 }}>Recent Lab Submissions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {selectedStudent.labSubmissions && selectedStudent.labSubmissions.length > 0 ? (
                      selectedStudent.labSubmissions.map((lab: any, i: number) => (
                        <div key={i} style={{ background: '#FFF8EE', padding: '14px 16px', borderRadius: 12, border: '1px solid rgba(180,140,90,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 800, color: '#2C1A0E', fontSize: 14 }}>{lab.name || lab.labId || 'Technical Lab'}</div>
                            <div style={{ fontSize: 12, color: '#8B6E52', fontWeight: 600, marginTop: 4 }}>{new Date(lab.date || lab.timestamp || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                          </div>
                          <div style={{ fontSize: 16, fontWeight: 900, color: '#006B7A' }}>
                            {lab.score ? `${lab.score}%` : 'Pass'}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: '#8B6E52', fontSize: 13, fontStyle: 'italic' }}>No completed labs found.</p>
                    )}
                  </div>
                </div>

                {/* Topics */}
                <div style={{ marginBottom: 32 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 900, color: '#2C1A0E', marginBottom: 16 }}>Completed Topics</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {selectedStudent.completedTopics && selectedStudent.completedTopics.length > 0 ? (
                      selectedStudent.completedTopics.map((topic: any, i: number) => (
                         <span key={i} style={{ background: '#FDF6EC', border: '1px solid rgba(180,140,90,0.2)', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, color: '#5C3D1E' }}>
                           {topic}
                         </span>
                      ))
                    ) : (
                      <p style={{ color: '#8B6E52', fontSize: 13, fontStyle: 'italic' }}>No topics completed yet.</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 16, marginTop: 'auto', paddingTop: 20 }}>
                   <button onClick={handleSendNudge} disabled={isNudging} style={modalPrimaryBtn}>
                     {isNudging ? 'Sending Nudge...' : 'Send Nudge Email'} <FiMail />
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- STYLE OBJECTS ---
const cardStyle: React.CSSProperties = {
  background: '#FFFFFF', borderRadius: 20,
  border: '2px solid rgba(180,140,90,0.25)', padding: '24px 22px',
  boxShadow: '0 2px 0 rgba(255,255,255,0.9) inset, 0 8px 24px rgba(140,90,40,0.1)',
};

const selectStyle: React.CSSProperties = {
  background: '#FDF6EC', border: '1.5px solid rgba(180,140,90,0.2)', borderRadius: 12, padding: '10px 14px',
  color: '#5C3D1E', fontWeight: 700, fontSize: 13, outline: 'none', cursor: 'pointer', minWidth: 140
};

const thStyle: React.CSSProperties = { padding: '16px 24px', fontSize: 11, fontWeight: 900, color: '#8B6E52', textTransform: 'uppercase', letterSpacing: '0.08em' };
const tdStyle: React.CSSProperties = { padding: '16px 24px', fontSize: 13, color: '#5C3D1E', fontWeight: 600 };

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(44, 26, 14, 0.4)', display: 'flex', justifyContent: 'flex-end', zIndex: 1000, backdropFilter: 'blur(8px)'
};

const profileModalStyle: React.CSSProperties = {
  background: '#FFFFFF', width: '500px', maxWidth: '100vw', height: '100vh', display: 'flex', flexDirection: 'column',
  boxShadow: '-10px 0 40px rgba(0,0,0,0.2)'
};

const modalInfoLabel: React.CSSProperties = { fontSize: 10, fontWeight: 800, color: '#8B6E52', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 };
const modalStatCard: React.CSSProperties = { background: '#FDF6EC', padding: '20px', borderRadius: 16, border: '1.5px solid rgba(180,140,90,0.15)' };

const modalPrimaryBtn: React.CSSProperties = { width: '100%', padding: '16px', borderRadius: 16, background: 'linear-gradient(135deg, #D95F2B, #B04A1E)', color: 'white', border: 'none', fontWeight: 900, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 24px rgba(217,95,43,0.3)' };
