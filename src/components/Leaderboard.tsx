'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LeaderboardUser {
    uid: string;
    displayName: string;
    college: string;
    learningPath: string;
    xp: number;
    labsCompleted: number;
    employabilityLevel: string;
    rank?: number;
}

interface LeaderboardProps {
    users: LeaderboardUser[];
    currentUserId?: string;
    isLoading?: boolean;
}

export default function Leaderboard({ users, currentUserId, isLoading }: LeaderboardProps) {
    const activeRowRef = useRef<HTMLTableRowElement>(null);

    // Provide a way for parent to trigger scroll
    useEffect(() => {
        const handleScrollRequest = () => {
           activeRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };
        window.addEventListener('scroll-to-my-rank', handleScrollRequest);
        return () => window.removeEventListener('scroll-to-my-rank', handleScrollRequest);
    }, []);

    const getBadgeStyle = (level: string) => {
        const lvl = level?.toLowerCase() || '';
        if (lvl.includes('high') || lvl.includes('excellent')) return { bg: 'rgba(16,185,129,0.1)', text: '#10B981', border: 'rgba(16,185,129,0.2)' };
        if (lvl.includes('medium') || lvl.includes('good')) return { bg: 'rgba(59,130,246,0.1)', text: '#3B82F6', border: 'rgba(59,130,246,0.2)' };
        if (lvl.includes('practice')) return { bg: 'rgba(239,68,68,0.1)', text: '#EF4444', border: 'rgba(239,68,68,0.2)' };
        return { bg: 'rgba(245,158,11,0.1)', text: '#F59E0B', border: 'rgba(245,158,11,0.2)' };
    };

    return (
        <div className="bg-[#050911] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                <div className="flex justify-between items-end">
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-2">Global Hierarchy</h3>
                        <h2 className="text-xl font-black italic tracking-tight text-white">PILOT LEADERBOARD</h2>
                    </div>
                    <div className="text-[9px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                        Top {users.length} Active
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead>
                        <tr className="text-[9px] font-black uppercase tracking-widest text-white/20 border-b border-white/5">
                            <th className="py-6 pl-8">Rank</th>
                            <th className="py-6">Pilot / Institution</th>
                            <th className="py-6">Sector (Track)</th>
                            <th className="py-6">Credits (XP)</th>
                            <th className="py-6">Labs</th>
                            <th className="py-6 pr-8">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="py-20 text-center">
                                    <div className="inline-block w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-20 text-center text-white/20 font-black uppercase tracking-widest text-xs">
                                    No data available in this sector
                                </td>
                            </tr>
                        ) : (
                            users.map((user, idx) => {
                                const isSelf = user.uid === currentUserId;
                                const badge = getBadgeStyle(user.employabilityLevel);
                                
                                return (
                                    <motion.tr
                                        key={user.uid}
                                        ref={isSelf ? activeRowRef : null}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.01)' }}
                                        style={{ 
                                            background: isSelf ? 'rgba(0,107,122,0.15)' : 'transparent',
                                            boxShadow: isSelf ? 'inset 4px 0 0 #006B7A' : 'none'
                                        }}
                                        className="group transition-all"
                                    >
                                        <td className="py-5 pl-8">
                                            <span className={`text-sm font-black ${idx === 0 ? 'text-cyan-400' : idx === 1 ? 'text-amber-400' : idx === 2 ? 'text-slate-400' : 'text-white/20'}`}>
                                                {(idx + 1).toString().padStart(2, '0')}
                                            </span>
                                        </td>
                                        <td className="py-5">
                                            <div>
                                                <div className="text-[12px] font-black uppercase tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                                                    {user.displayName}
                                                </div>
                                                <div className="text-[9px] font-bold text-white/30 uppercase tracking-wider mt-0.5">
                                                    {user.college || 'Universal Academy'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5">
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-tight">
                                                {user.learningPath}
                                            </span>
                                        </td>
                                        <td className="py-5">
                                            <span className="text-[11px] font-black text-cyan-400/90">
                                                {user.xp?.toLocaleString() || 0}<span className="text-[8px] ml-0.5">XP</span>
                                            </span>
                                        </td>
                                        <td className="py-5">
                                            <span className="text-[11px] font-black text-white/40 group-hover:text-white transition-colors">
                                                {user.labsCompleted || 0}
                                            </span>
                                        </td>
                                        <td className="py-5 pr-8">
                                            <div style={{ 
                                                display: 'inline-flex', padding: '3px 10px', borderRadius: '4px', border: `1px solid ${badge.border}`, 
                                                background: badge.bg, color: badge.text, fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' 
                                            }}>
                                                {user.employabilityLevel || 'N/A'}
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-6 bg-white/[0.01] border-t border-white/5 text-center">
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/10">
                    System Registry Updated Real-time
                </p>
            </div>
        </div>
    );
}
