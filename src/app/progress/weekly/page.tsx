'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { fetchResilient } from '@/lib/firestore-resilience';
import NotificationBell from '@/components/NotificationBell';
import { LABS } from '@/lib/data/labs';
import { 
  FiArrowLeft, FiTrendingUp, FiActivity, FiClock, 
  FiStar, FiCheckCircle, FiAward
} from 'react-icons/fi';

// Define styling tokens to match dashboard
const C = {
  bg: '#FDF6EC',
  card: '#FFFFFF',
  text: '#2C1A0E',
  sub: '#5C3D1E',
  border: 'rgba(180,140,90,0.2)',
  accent: '#D95F2B',
  green: '#2E7D52',
  blue: '#006B7A',
  amber: '#E6A23C'
};

export default function WeeklyProgressPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    thisWeekLabs: 0,
    thisWeekXP: 0,
    lastWeekLabs: 0,
    lastWeekXP: 0,
    streak: 0,
    topTopic: 'None',
    topTopicTime: 0,
    empChange: 'Stable',
    empLevel: 'Low'
  });

  useEffect(() => {
    const loadData = async () => {
      if (!user?.uid || !db) return;

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await fetchResilient(userRef);
        let currentStreak = 0;
        let empLevel = 'Low';
        let actScore = 0;

        if (userSnap && userSnap.exists()) {
          const ud = userSnap.data();
          currentStreak = ud.streakDays ?? ud.streak ?? 0;
          empLevel = ud.employabilityLevel || 'Low';
          actScore = ud.employabilityScore || 0;
        }

        const subsRef = collection(db, 'users', user.uid, 'submissions');
        const subsSnap = await getDocs(subsRef);
        
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        let tLabs = 0;
        let tXP = 0;
        let lLabs = 0;
        let lXP = 0;

        const topicTimes: Record<string, number> = {};

        subsSnap.forEach(docSnap => {
          const s = docSnap.data();
          if (!s.timestamp) return;
          const date = s.timestamp.toDate();
          const xp = LABS[s.labId]?.xp || 0;
          const cat = LABS[s.labId]?.category || 'Other';
          const time = s.timeSpentSeconds || 0;

          if (date >= sevenDaysAgo) {
            tLabs++;
            tXP += xp;
            topicTimes[cat] = (topicTimes[cat] || 0) + time;
          } else if (date >= fourteenDaysAgo && date < sevenDaysAgo) {
            lLabs++;
            lXP += xp;
          }
        });

        const sortedTopics = Object.entries(topicTimes).sort((a,b) => b[1] - a[1]);
        const topTopicName = sortedTopics.length > 0 ? sortedTopics[0][0] : 'None';
        const topTopicVal = sortedTopics.length > 0 ? sortedTopics[0][1] : 0;

        // Determine employability change explicitly mapping historical diffs
        let changeText = 'Maintained';
        if (tLabs > 0) {
           changeText = `Improved (+${tXP} XP)`;
        } else if (tLabs === 0 && lLabs > 0) {
           changeText = 'Declined';
        } else if (empLevel === 'High — Job Ready') {
           changeText = 'Peak Maintained';
        }

        setStats({
          thisWeekLabs: tLabs,
          thisWeekXP: tXP,
          lastWeekLabs: lLabs,
          lastWeekXP: lXP,
          streak: currentStreak,
          topTopic: topTopicName,
          topTopicTime: topTopicVal,
          empChange: changeText,
          empLevel
        });

      } catch (e) {
        console.error("Error loading weekly stats:", e);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  let motivation = 'This week is not over yet — start now!';
  if (stats.thisWeekLabs >= 3) motivation = 'Outstanding week!';
  else if (stats.thisWeekLabs > 0) motivation = 'Good progress, keep going!';

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (m === 0 && s === 0) return '0m';
    if (m === 0) return `${s}s`;
    return `${m}m ${s}s`;
  };

  const getEmpColor = (lvl: string) => {
    if (lvl.includes('High')) return C.green;
    if (lvl.includes('Medium')) return C.amber;
    return C.accent; // red/orange
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg, padding: '48px 24px', fontFamily: 'inherit' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <button onClick={() => router.back()} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 9, border: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.6)', color: C.sub, cursor: 'pointer', fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
              <FiArrowLeft size={14} /> Back
            </button>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: '#101828', letterSpacing: '-0.02em', margin: 0 }}>Weekly Summary</h1>
            <p style={{ fontSize: 14, color: '#475467', marginTop: 4 }}>Your rolling 7-day performance snapshot.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {user && <NotificationBell uid={user.uid} />}
            <div className="skeu-inset" style={{ padding: '16px 24px', borderRadius: 16, backgroundColor: 'var(--surface-raised)', border: `1px solid ${C.border}` }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: stats.thisWeekLabs >= 3 ? C.blue : (stats.thisWeekLabs > 0 ? C.green : C.accent), display: 'flex', alignItems: 'center', gap: 8 }}>
                {stats.thisWeekLabs >= 3 ? <FiStar /> : (stats.thisWeekLabs > 0 ? <FiTrendingUp /> : <FiClock />)}
                {motivation}
              </h3>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
            <div style={{ width: 40, height: 40, border: `3px solid ${C.blue}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            
            {/* Core Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 20 }}>
              
              <div className="clay-card" style={{ padding: 24, borderRadius: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475467', marginBottom: 12, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>
                   <FiCheckCircle size={16} color={C.green} /> Labs Completed
                </div>
                <div style={{ fontSize: 42, fontWeight: 900, color: C.text, lineHeight: 1 }}>{stats.thisWeekLabs}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 12, fontWeight: 600, color: stats.thisWeekLabs >= stats.lastWeekLabs ? C.green : C.accent }}>
                   <FiTrendingUp style={{ transform: stats.thisWeekLabs >= stats.lastWeekLabs ? 'none' : 'scaleY(-1)' }} />
                   {stats.thisWeekLabs >= stats.lastWeekLabs ? '+' : '-'}{Math.abs(stats.thisWeekLabs - stats.lastWeekLabs)} vs last week
                </div>
              </div>

              <div className="clay-card" style={{ padding: 24, borderRadius: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475467', marginBottom: 12, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>
                   <FiAward size={16} color={C.blue} /> XP Earned
                </div>
                <div style={{ fontSize: 42, fontWeight: 900, color: C.text, lineHeight: 1 }}>{stats.thisWeekXP}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 12, fontWeight: 600, color: stats.thisWeekXP >= stats.lastWeekXP ? C.green : C.accent }}>
                   <FiTrendingUp style={{ transform: stats.thisWeekXP >= stats.lastWeekXP ? 'none' : 'scaleY(-1)' }} />
                   {stats.thisWeekXP >= stats.lastWeekXP ? '+' : '-'}{Math.abs(stats.thisWeekXP - stats.lastWeekXP)} vs last week
                </div>
              </div>

              <div className="clay-card" style={{ padding: 24, borderRadius: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475467', marginBottom: 12, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>
                   <FiActivity size={16} color={C.accent} /> Current Streak
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                   <div style={{ fontSize: 42, fontWeight: 900, color: C.text, lineHeight: 1 }}>{stats.streak}</div>
                   <div style={{ fontSize: 16, fontWeight: 700, color: C.sub }}>days</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 12, fontWeight: 600, color: '#475467' }}>
                   🔥 Keep coding daily!
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
              
              {/* Employability */}
              <div className="clay-card" style={{ padding: 32, borderRadius: 20 }}>
                 <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 20 }}>Employability Level</h2>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ padding: '16px 24px', background: `${getEmpColor(stats.empLevel)}15`, border: `2px solid ${getEmpColor(stats.empLevel)}40`, borderRadius: 16 }}>
                       <span style={{ fontSize: 20, fontWeight: 900, color: getEmpColor(stats.empLevel) }}>{stats.empLevel}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                       <span style={{ fontSize: 12, fontWeight: 600, color: '#475467', textTransform: 'uppercase' }}>Change from last week</span>
                       <span style={{ fontSize: 16, fontWeight: 800, color: stats.empChange === 'Declined' ? C.accent : C.blue }}>
                         {stats.empChange}
                       </span>
                    </div>
                 </div>
              </div>

              {/* Top Topic */}
              <div className="clay-card" style={{ padding: 32, borderRadius: 20 }}>
                 <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 20 }}>Top Topic Active</h2>
                 
                 {stats.topTopic !== 'None' ? (
                   <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                     <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(0,107,122,0.1)', border: '1px solid rgba(0,107,122,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <FiStar size={24} color={C.blue} />
                     </div>
                     <div style={{ display: 'flex', flexDirection: 'column' }}>
                       <span style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{stats.topTopic}</span>
                       <span style={{ fontSize: 13, fontWeight: 600, color: '#475467', marginTop: 4 }}>{formatTime(stats.topTopicTime)} spent</span>
                     </div>
                   </div>
                 ) : (
                   <div style={{ padding: 20, textAlign: 'center', border: `2px dashed ${C.border}`, borderRadius: 12, color: C.sub, fontSize: 13, fontWeight: 600 }}>
                     No specific topic engaged this week.
                   </div>
                 )}
              </div>

            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
