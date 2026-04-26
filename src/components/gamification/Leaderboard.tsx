'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
    rank: number;
    user: {
        id: string;
        username: string;
        avatar_url?: string;
        level: number;
    };
    score: number;
    trend?: 'up' | 'down' | 'same';
}

const SAMPLE_LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, user: { id: '1', username: 'CodeMasterRaj', level: 45 }, score: 12500, trend: 'up' },
    { rank: 2, user: { id: '2', username: 'PriyaTech', level: 42 }, score: 11800, trend: 'down' },
    { rank: 3, user: { id: '3', username: 'DevArjun', level: 40 }, score: 10950, trend: 'up' },
    { rank: 4, user: { id: '4', username: 'MLQueen', level: 38 }, score: 9800, trend: 'same' },
    { rank: 5, user: { id: '5', username: 'HackerVikram', level: 35 }, score: 8750, trend: 'up' },
    { rank: 6, user: { id: '6', username: 'DataWhiz', level: 33 }, score: 8200, trend: 'down' },
    { rank: 7, user: { id: '7', username: 'WebWizard', level: 30 }, score: 7500, trend: 'up' },
    { rank: 8, user: { id: '8', username: 'AIEnthusiast', level: 28 }, score: 6900, trend: 'same' },
    { rank: 9, user: { id: '9', username: 'SecureCode', level: 25 }, score: 6100, trend: 'up' },
    { rank: 10, user: { id: '10', username: 'CloudNinja', level: 22 }, score: 5400, trend: 'down' },
];

type LeaderboardType = 'GLOBAL' | 'DOMAIN' | 'WEEKLY' | 'MONTHLY';

export default function Leaderboard() {
    const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('GLOBAL');
    const [entries] = useState<LeaderboardEntry[]>(SAMPLE_LEADERBOARD);

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'text-yellow-400';
        if (rank === 2) return 'text-gray-300';
        if (rank === 3) return 'text-orange-400';
        return 'text-purple-300';
    };

    const getRankBadge = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    return (
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-6 border border-purple-500/30">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">🏆 Leaderboard</h2>
                <p className="text-purple-300">Compete with learners worldwide</p>
            </div>

            {/* Type Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
                {['GLOBAL', 'DOMAIN', 'WEEKLY', 'MONTHLY'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setLeaderboardType(type as LeaderboardType)}
                        className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${leaderboardType === type
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                : 'bg-white/10 text-purple-300 hover:bg-white/20'
                            }`}
                    >
                        {type === 'GLOBAL' ? 'Global' : type === 'DOMAIN' ? 'Domain' : type === 'WEEKLY' ? 'This Week' : 'This Month'}
                    </button>
                ))}
            </div>

            {/* Leaderboard List */}
            <div className="space-y-2">
                {entries.map((entry, index) => (
                    <motion.div
                        key={entry.user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center gap-4 p-4 rounded-xl transition-all ${entry.rank <= 3
                                ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50'
                                : 'bg-white/5 hover:bg-white/10'
                            }`}
                    >
                        {/* Rank */}
                        <div className={`text-2xl font-bold ${getRankColor(entry.rank)} w-12 text-center`}>
                            {getRankBadge(entry.rank)}
                        </div>

                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                            {entry.user.username[0].toUpperCase()}
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                            <h4 className="font-bold text-white">{entry.user.username}</h4>
                            <p className="text-sm text-purple-300">Level {entry.user.level}</p>
                        </div>

                        {/* Score */}
                        <div className="text-right">
                            <div className="text-xl font-bold text-white">{entry.score.toLocaleString()} XP</div>
                            {entry.trend && (
                                <div
                                    className={`text-sm ${entry.trend === 'up'
                                            ? 'text-green-400'
                                            : entry.trend === 'down'
                                                ? 'text-red-400'
                                                : 'text-gray-400'
                                        }`}
                                >
                                    {entry.trend === 'up' ? '↗️ Rising' : entry.trend === 'down' ? '↘️ Falling' : '→ Stable'}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Your Rank */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50 rounded-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-white">Your Rank</h4>
                        <p className="text-sm text-purple-300">Keep learning to climb higher!</p>
                    </div>
                    <div className="text-3xl font-bold text-yellow-400">#42</div>
                </div>
            </div>
        </div>
    );
}
