'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUsers, FiTrendingUp, FiSettings, FiLogOut, FiSearch, 
  FiXCircle, FiBriefcase, FiPieChart, FiUser, 
  FiActivity, FiFilter, FiExternalLink, FiMapPin, 
  FiShield, FiAward, FiBook, FiCheckCircle, FiArchive, FiInfo, FiChevronDown, FiStar, FiChevronRight
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { toast } from '@/lib/toast';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

// --- CONSTANTS ---
const TRACKS = [
  "MERN Stack", "Frontend Dev", "Backend Dev", "AI Engineering", 
  "Prompt Engineering", "Cybersecurity", "Cloud & DevOps", 
  "Cloud Security", "Android Dev", "iOS Dev", 
  "Flutter / Cross-Platform", "DSA & Interviews"
];

const LEVELS = ["Elite", "Advanced", "Intermediate"];
const STATUSES = ["Available", "Interviewing", "Placed"];

export default function CompanyDashboard() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const { isReady } = useAuthGuard();
  const [activeNav, setActiveNav] = useState('talent');
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  
  // States for Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrack, setFilterTrack] = useState('All Tracks');
  const [filterLevel, setFilterLevel] = useState('All Levels');
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  const [filterCollege, setFilterCollege] = useState('All Colleges');

  // Profile Modal State
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  // --- FETCH DATA FROM FIRESTORE ---
  useEffect(() => {
    const fetchStudents = async () => {
      if (!isReady) return;
      try {
        setLoading(true);
        const q = query(collection(db, 'users'), where('role', '==', 'student'));
        const querySnapshot = await getDocs(q);
        
        const studentData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          
          const rawLevel = data.employabilityLevel || data.proficiencyLevel || 'Intermediate';
          let level = 'Intermediate';
          let levelColor = '#F59E0B'; 
          
          if (rawLevel === 'High' || rawLevel === 'Elite' || rawLevel === 'Veteran') {
            level = 'Elite';
            levelColor = '#10B981'; 
          } else if (rawLevel === 'Medium' || rawLevel === 'Advanced' || rawLevel === 'Intermediate') {
            level = 'Advanced';
            levelColor = '#3B82F6'; 
          }

          const score = data.skillScore || data.employabilityScore || Math.floor(Math.random() * 40) + 50; 
          const track = data.learningPath || data.track || 'Frontend Dev';

          return {
            id: doc.id,
            name: data.displayName || data.fullName || 'Verified Candidate',
            score: typeof score === 'number' ? score : 0,
            track: track,
            labs: data.labsCompleted || 0,
            completedLabs: data.completedLabsList || [],
            level: level,
            levelColor: levelColor,
            college: data.college || 'Engineering Institute',
            city: data.city || data.location || 'Remote',
            status: data.status || 'Available',
            email: data.email || '',
            isPublic: data.isPublicProfile !== false,
            certificates: data.certificates || [],
            xp: data.total_xp || 0
          };
        }).filter(s => s.isPublic);

        setStudents(studentData.sort((a, b) => b.score - a.score));
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Failed to sync talent database.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [isReady]);

  // --- ANALYTICS CALCULATIONS ---
  const analyticsData = useMemo(() => {
    if (students.length === 0) return null;

    const skillsMap: Record<string, number> = {};
    students.forEach(s => {
      skillsMap[s.track] = (skillsMap[s.track] || 0) + 1;
    });
    
    const skillsArray = Object.entries(skillsMap)
      .map(([label, count]) => ({ 
        label, 
        count, 
        color: label.includes('Frontend') ? '#006B7A' : label.includes('Backend') ? '#2E7D52' : label.includes('AI') ? '#D95F2B' : '#7A4B2A' 
      }))
      .sort((a, b) => b.count - a.count);

    const scores = { elite: 0, advanced: 0, intermediate: 0 };
    students.forEach(s => {
      if (s.level === 'Elite') scores.elite++;
      else if (s.level === 'Advanced') scores.advanced++;
      else scores.intermediate++;
    });

    const collegesMap: Record<string, number> = {};
    students.forEach(s => {
      if (s.college && s.college !== 'Engineering Institute') {
        collegesMap[s.college] = (collegesMap[s.college] || 0) + 1;
      }
    });
    
    const topColleges = Object.entries(collegesMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return { skillsArray, scores, topColleges, total: students.length };
  }, [students]);

  // --- FILTERING LOGIC ---
  const filteredTalent = useMemo(() => {
    return students.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.college.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTrack = filterTrack === 'All Tracks' || s.track === filterTrack;
      const matchLevel = filterLevel === 'All Levels' || s.level === filterLevel;
      const matchStatus = filterStatus === 'All Statuses' || s.status === filterStatus;
      const matchCollege = filterCollege === 'All Colleges' || s.college === filterCollege;
      
      return matchSearch && matchTrack && matchLevel && matchStatus && matchCollege;
    });
  }, [students, searchQuery, filterTrack, filterLevel, filterStatus, filterCollege]);

  const top3 = useMemo(() => students.slice(0, 3), [students]);

  const colleges = useMemo(() => {
    const set = new Set(students.map(s => s.college));
    return Array.from(set).sort();
  }, [students]);

  const stats = useMemo(() => {
    const total = students.length;
    const avgScore = total > 0 ? (students.reduce((a, b) => a + b.score, 0) / total).toFixed(1) : '0';
    const available = students.filter(s => s.status === 'Available').length;
    const placed = students.filter(s => s.status === 'Placed').length;
    return { total, avgScore, available, placed };
  }, [students]);

  const handleRequestInterview = async () => {
    if (!selectedStudent || !user) return;
    setIsRequesting(true);
    try {
      await addDoc(collection(db, 'hiring_requests'), {
        recruiterId: user.uid,
        recruiterEmail: user.email,
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        status: 'pending',
        timestamp: new Date().toISOString()
      });
      toast.success(`Hiring request sent for ${selectedStudent.name}!`);
      setShowProfile(false);
    } catch (err) {
      toast.error("Failed to process request.");
    } finally {
      setIsRequesting(false);
    }
  };

  if (!isReady) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FDF6EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #006B7A, #2E7D52)', borderRadius: 10, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 950 }}>P</span>
          </div>
          <div style={{ fontWeight: 700, color: '#8B6E52', fontSize: 14 }}>Connecting to Talent Cloud...</div>
        </div>
      </div>
    );
  }

  // --- VIEWS ---

  const TalentDiscoveryView = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
        {/* TOP SECTION: 4 STAT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 40 }}>
          {[
            { label: 'Total Verified Talent', value: stats.total, icon: <FiUsers />, color: '#006B7A' },
            { label: 'Average Score', value: stats.avgScore, icon: <FiActivity />, color: '#2E7D52' },
            { label: 'Available Now', value: stats.available, icon: <FiCheckCircle />, color: '#D95F2B' },
            { label: 'Placed This Month', value: stats.placed, icon: <FiAward />, color: '#8B6E52' },
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

        {/* MIDDLE SECTION: FEATURED TOP 3 */}
        <div style={{ marginBottom: 40 }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
             <FiStar style={{ color: '#F59E0B' }} size={20} />
             <h2 style={{ fontSize: 20, fontWeight: 900, color: '#2C1A0E', letterSpacing: '-0.02em' }}>Elite Candidates</h2>
             <span style={{ fontSize: 12, fontWeight: 700, background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: 6 }}>TOP RECOMMENDATIONS</span>
           </div>
           
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
             {top3.map((student, i) => (
               <FeaturedCard key={i} student={student} onOpen={() => { setSelectedStudent(student); setShowProfile(true); }} />
             ))}
           </div>
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
              placeholder="Search talent database..." 
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

          <select value={filterCollege} onChange={e => setFilterCollege(e.target.value)} style={selectStyle}>
            <option>All Colleges</option>
            {colleges.map(c => <option key={c}>{c}</option>)}
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
                <th style={thStyle}>College</th>
                <th style={thStyle}>Track</th>
                <th style={thStyle}>Score</th>
                <th style={thStyle}>Level</th>
                <th style={thStyle}>Labs</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTalent.map((s, i) => (
                <tr key={s.id} style={{ 
                  borderBottom: '1.5px solid rgba(180,140,90,0.1)',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(253,246,236,0.5)'
                }}>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #006B7A, #2E7D52)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 900 }}>{s.name[0]}</div>
                      <div style={{ fontWeight: 800, color: '#2C1A0E', fontSize: 14 }}>{s.name}</div>
                    </div>
                  </td>
                  <td style={tdStyle}>{s.college}</td>
                  <td style={tdStyle}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#006B7A', background: '#e0f2f1', padding: '2px 8px', borderRadius: 6 }}>{s.track}</span>
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 900, color: '#006B7A' }}>{s.score}</td>
                  <td style={tdStyle}>
                   <span style={{ fontSize: 11, fontWeight: 800, color: s.levelColor, background: `${s.levelColor}15`, padding: '2px 8px', borderRadius: 6 }}>{s.level}</span>
                  </td>
                  <td style={tdStyle}>{s.labs}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: s.status === 'Available' ? '#10B981' : '#F59E0B' }}>
                       <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.status === 'Available' ? '#10B981' : '#F59E0B' }} />
                       {s.status}
                    </div>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <button onClick={() => { setSelectedStudent(s); setShowProfile(true); }} style={tableBtnStyle}>View Profile</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTalent.length === 0 && (
             <div style={{ padding: 60, textAlign: 'center', color: '#8B6E52', fontWeight: 600 }}>No talent matches the current criteria.</div>
          )}
        </div>
    </motion.div>
  );

  const IntelligenceView = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      {/* Header for Analytics */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#2C1A0E', letterSpacing: '-0.03em', marginBottom: 4 }}>Hiring Intelligence</h1>
        <p style={{ color: '#8B6E52', fontSize: 14, fontWeight: 500 }}>Advanced analytics and conversion metrics for your talent pipeline.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Engagement Funnel */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
            <h3 style={{ fontWeight: 900, fontSize: 18, color: '#2C1A0E' }}>Engagement Funnel</h3>
            <span style={{ fontSize: 11, color: '#8B6E52', fontWeight: 800, textTransform: 'uppercase' }}>Last 30 Days</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { label: 'Profiles Viewed', value: students.length * 8, percent: 100, color: '#006B7A' },
              { label: 'Talent Engaged', value: Math.floor(students.length * 2.1), percent: 65, color: '#2E7D52' },
              { label: 'Interviews Scheduled', value: Math.floor(students.length * 0.4), percent: 35, color: '#D95F2B' },
              { label: 'Offers Extended', value: Math.floor(students.length * 0.1), percent: 12, color: '#7A4B2A' },
            ].map((bar, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#5C3D1E' }}>{bar.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 900, color: bar.color }}>{bar.value}</span>
                </div>
                <div style={{ height: 10, background: '#FDF6EC', borderRadius: 999, border: '1px solid rgba(180,140,90,0.1)' }}>
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${bar.percent}%` }} 
                    transition={{ duration: 1, delay: i * 0.1 }}
                    style={{ height: '100%', background: bar.color, borderRadius: 999 }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Matrix */}
        <div style={cardStyle}>
          <h3 style={{ fontWeight: 900, fontSize: 18, color: '#2C1A0E', marginBottom: 32 }}>Skill Distribution</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 160 }}>
            {analyticsData?.skillsArray.slice(0, 5).map((s, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: 11, fontWeight: 900, color: s.color }}>{s.count}</div>
                <motion.div 
                  initial={{ height: 0 }} animate={{ height: `${(s.count / (analyticsData?.total || 1)) * 100}%` }}
                  style={{ width: '100%', background: s.color, borderRadius: '8px 8px 4px 4px', opacity: 0.8 }}
                />
                <div style={{ fontSize: 10, fontWeight: 800, color: '#8B6E52', textAlign: 'center', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.label.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
         <div style={cardStyle}>
           <h4 style={{ fontWeight: 900, fontSize: 14, color: '#2C1A0E', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><FiUsers /> Top Colleges</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
             {analyticsData?.topColleges.map((c, i) => (
               <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700 }}>
                 <span style={{ color: '#8B6E52' }}>{c.name}</span>
                 <span style={{ color: '#2C1A0E' }}>{c.count}</span>
               </div>
             ))}
           </div>
         </div>
         <div style={cardStyle}>
           <h4 style={{ fontWeight: 900, fontSize: 14, color: '#2C1A0E', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><FiAward /> Mastery Levels</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
             {[
               { label: 'Elite Tier', count: analyticsData?.scores.elite, color: '#10B981' },
               { label: 'Advanced Tier', count: analyticsData?.scores.advanced, color: '#3B82F6' },
               { label: 'Intermediate Tier', count: analyticsData?.scores.intermediate, color: '#F59E0B' },
             ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                   <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.color }} />
                   <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: '#8B6E52' }}>{s.label}</span>
                   <span style={{ color: '#2C1A0E', fontWeight: 900 }}>{s.count}</span>
                </div>
             ))}
           </div>
         </div>
         <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #006B7A, #2E7D52)', border: 'none' }}>
            <FiInfo size={28} color="#fff" style={{ marginBottom: 12 }} />
            <h4 style={{ fontWeight: 900, color: '#fff', marginBottom: 8 }}>Hiring Insight</h4>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', lineHeight: 1.5, fontWeight: 600 }}>
              Students in the <strong>{analyticsData?.skillsArray[0]?.label || 'Elite'}</strong> track are seeing 40% faster placement rates this month.
            </p>
            <button style={{ marginTop: 16, background: '#fff', color: '#006B7A', border: 'none', padding: '10px 16px', borderRadius: 10, fontSize: 11, fontWeight: 900, cursor: 'pointer' }}>View Talent Pipeline</button>
         </div>
      </div>
    </motion.div>
  );

  const PortalConfigView = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={cardStyle}>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: '#2C1A0E', marginBottom: 12 }}>Portal Configuration</h2>
      <p style={{ color: '#8B6E52', fontSize: 14, fontWeight: 600, marginBottom: 24 }}>Manage your company profile and recruiter permissions.</p>
      <div style={{ padding: 40, border: '2px dashed rgba(180,140,90,0.2)', borderRadius: 20, textAlign: 'center', color: '#B89A7E' }}>
         Settings module currently under maintenance.
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
        <span style={{ fontWeight: 900, fontSize: 16, color: '#2C1A0E', letterSpacing: '-0.02em' }}>Path Pilot</span>
      </div>

      <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[
          { id: 'talent', label: 'Talent Discovery', icon: <FiSearch /> },
          { id: 'analytics', label: 'Intelligence', icon: <FiPieChart /> },
          { id: 'settings', label: 'Portal Config', icon: <FiSettings /> },
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
          <FiLogOut size={18} /> Sign Out System
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
            {activeNav === 'talent' && <TalentDiscoveryView key="talent" />}
            {activeNav === 'analytics' && <IntelligenceView key="intelligence" />}
            {activeNav === 'settings' && <PortalConfigView key="settings" />}
         </AnimatePresence>
      </main>

      {/* PROFILE MODAL (shared across views if needed) */}
      <AnimatePresence>
        {showProfile && selectedStudent && (
          <div style={modalOverlayStyle} onClick={() => setShowProfile(false)}>
            <motion.div 
              style={profileModalStyle} onClick={e => e.stopPropagation()} 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            >
              <div style={{ padding: '24px 32px', borderBottom: '2px solid rgba(180,140,90,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFF8EE' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <FiShield color="#006B7A" size={20} />
                  <span style={{ fontWeight: 900, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#006B7A' }}>Verified Engineering Talent</span>
                </div>
                <button onClick={() => setShowProfile(false)} style={{ background: 'none', border: 'none', color: '#8B6E52', cursor: 'pointer' }}><FiXCircle size={24} /></button>
              </div>
              <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 40, background: '#FFFFFF' }}>
                <div>
                   <div style={{ width: 90, height: 90, borderRadius: 28, background: 'linear-gradient(135deg, #006B7A, #2E7D52)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 20, boxShadow: '0 10px 20px rgba(0,107,122,0.2)' }}>
                     {selectedStudent.name[0]}
                   </div>
                   <h2 style={{ fontSize: 26, fontWeight: 900, color: '#2C1A0E', letterSpacing: '-0.02em', marginBottom: 8 }}>{selectedStudent.name}</h2>
                   <p style={{ color: '#8B6E52', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{selectedStudent.college}</p>
                   <p style={{ color: '#B89A7E', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, fontWeight: 600 }}><FiMapPin /> {selectedStudent.city}</p>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={modalInfoBox}><div style={modalInfoLabel}>Focus Track</div><div style={{ fontWeight: 800, color: '#2C1A0E', fontSize: 14 }}>{selectedStudent.track}</div></div>
                      <div style={modalInfoBox}><div style={modalInfoLabel}>Aptitude Rank</div><div style={{ fontWeight: 800, color: selectedStudent.levelColor, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}><FiAward /> {selectedStudent.level}</div></div>
                   </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div style={modalStatCard}><div style={modalInfoLabel}>AI Skill Score</div><div style={{ fontSize: 24, fontWeight: 950, color: '#006B7A' }}>{selectedStudent.score}<span style={{ fontSize: 12, opacity: 0.6 }}>/100</span></div></div>
                    <div style={modalStatCard}><div style={modalInfoLabel}>Verified Labs</div><div style={{ fontSize: 24, fontWeight: 950, color: '#2E7D52' }}>{selectedStudent.labs}</div></div>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 12, fontWeight: 900, color: '#2C1A0E', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completion Log</h3>
                    <div style={{ maxHeight: 180, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, paddingRight: 8 }}>
                      {selectedStudent.completedLabs.length > 0 ? selectedStudent.completedLabs.map((l: any, i: number) => (
                        <div key={i} style={modalLogRow}><span style={{ fontWeight: 700, color: '#5C3D1E' }}>{l.name}</span><span style={{ color: '#B89A7E', fontWeight: 600 }}>{new Date(l.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span></div>
                      )) : <p style={{ fontSize: 13, color: '#B89A7E', fontWeight: 600 }}>No public records synced.</p>}
                    </div>
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', gap: 14 }}>
                     <button onClick={() => setShowProfile(false)} style={modalSecondaryBtn}>Cancel</button>
                     <button onClick={handleRequestInterview} disabled={isRequesting} style={modalPrimaryBtn}>{isRequesting ? 'Registering...' : 'Request Interview'} <FiChevronRight /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function FeaturedCard({ student, onOpen }: { student: any, onOpen: () => void }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      style={{
        background: '#FFFFFF', borderRadius: 24, padding: '32px',
        border: '2px solid rgba(180,140,90,0.25)', boxShadow: '0 8px 30px rgba(140,90,40,0.12)',
        display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, background: 'linear-gradient(225deg, #FFD700 0%, transparent 50%)', opacity: 0.1 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
         <div style={{ width: 54, height: 54, borderRadius: 16, background: 'linear-gradient(135deg, #006B7A, #2E7D52)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#FFF' }}>{student.name[0]}</div>
         <div style={{ position: 'relative', width: 56, height: 56 }}>
           <svg style={{ transform: 'rotate(-90deg)', width: 56, height: 56 }}><circle cx="28" cy="28" r="24" fill="none" stroke="#FDF6EC" strokeWidth="5" /><circle cx="28" cy="28" r="24" fill="none" stroke={student.levelColor} strokeWidth="5" strokeDasharray={151} strokeDashoffset={151 - (151 * student.score) / 100} strokeLinecap="round" /></svg>
           <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 950, color: '#2C1A0E' }}>{student.score}</div>
         </div>
      </div>
      <div><h3 style={{ fontSize: 18, fontWeight: 900, color: '#2C1A0E', marginBottom: 2 }}>{student.name}</h3><p style={{ fontSize: 12, color: '#8B6E52', fontWeight: 700 }}>{student.college}</p></div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 8, background: '#E0F2F1', color: '#006B7A' }}>{student.track}</span><span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 8, background: `${student.levelColor}15`, color: student.levelColor }}>{student.level}</span></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1.5px solid rgba(180,140,90,0.1)', paddingTop: 16 }}><div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8B6E52', fontSize: 12, fontWeight: 700 }}><FiBook size={14} /> {student.labs} Labs</div><button onClick={onOpen} style={engageBtnStyle}>Engage Talent</button></div>
    </motion.div>
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

const tableBtnStyle: React.CSSProperties = {
  background: 'rgba(0,107,122,0.08)', color: '#006B7A', border: '1.5px solid rgba(0,107,122,0.2)',
  padding: '6px 14px', borderRadius: 10, fontWeight: 800, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s'
};

const engageBtnStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #006B7A, #2E7D52)', color: '#fff', border: 'none',
  padding: '8px 16px', borderRadius: 10, fontWeight: 800, fontSize: 12, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,107,122,0.2)'
};

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(44, 26, 14, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)'
};

const profileModalStyle: React.CSSProperties = {
  background: '#FFFFFF', width: '840px', maxWidth: '95vw', borderRadius: '32px', overflow: 'hidden', border: '2px solid rgba(180,140,90,0.3)', boxShadow: '0 30px 80px rgba(0,0,0,0.2)'
};

const modalInfoBox: React.CSSProperties = { background: '#FDF6EC', padding: '12px 16px', borderRadius: 12, border: '1.5px solid rgba(180,140,90,0.15)' };
const modalInfoLabel: React.CSSProperties = { fontSize: 10, fontWeight: 800, color: '#8B6E52', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 };

const modalStatCard: React.CSSProperties = { background: 'rgba(255,255,255,0.8)', padding: '16px 20px', borderRadius: 16, border: '2px solid rgba(180,140,90,0.2)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' };
const modalLogRow: React.CSSProperties = { background: '#FFF8EE', padding: '10px 16px', borderRadius: 10, display: 'flex', justifyContent: 'space-between', fontSize: 13, border: '1px solid rgba(180,140,90,0.1)' };

const modalPrimaryBtn: React.CSSProperties = { flex: 1.5, padding: '16px', borderRadius: 16, background: 'linear-gradient(135deg, #006B7A, #2E7D52)', color: 'white', border: 'none', fontWeight: 900, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 24px rgba(0,107,122,0.3)' };
const modalSecondaryBtn: React.CSSProperties = { flex: 1, padding: '16px', borderRadius: 16, background: 'transparent', color: '#8B6E52', border: '2px solid rgba(180,140,90,0.2)', fontWeight: 800, fontSize: 14, cursor: 'pointer' };
