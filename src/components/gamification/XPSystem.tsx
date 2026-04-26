'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface XPSystemProps {
    userId: string;
    currentXP?: number;
    currentLevel?: number;
}

export default function XPSystem({ userId, currentXP = 0, currentLevel = 1 }: XPSystemProps) {
    const [xp, setXP] = useState(currentXP);
    const [level, setLevel] = useState(currentLevel);
    const [showLevelUp, setShowLevelUp] = useState(false);

    // XP required for next level (exponential growth)
    const getXPForLevel = (lvl: number) => {
        return Math.floor(100 * Math.pow(1.5, lvl - 1));
    };

    const xpForCurrentLevel = getXPForLevel(level);
    const xpForNextLevel = getXPForLevel(level + 1);
    const progressPercentage = ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

    const addXP = (amount: number) => {
        const newXP = xp + amount;
        setXP(newXP);

        // Check for level up
        if (newXP >= xpForNextLevel) {
            setLevel((prev) => prev + 1);
            setShowLevelUp(true);
            setTimeout(() => setShowLevelUp(false), 3000);
        }
    };

    return (
        <div className="relative">
            {/* Level Up Animation */}
            {showLevelUp && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-50"
                >
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-2xl shadow-2xl text-center">
                        <div className="text-4xl mb-2">🎉</div>
                        <div className="font-bold text-2xl">LEVEL UP!</div>
                        <div className="text-lg">You're now Level {level}</div>
                    </div>
                </motion.div>
            )}

            {/* XP Display */}
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl p-6 border border-purple-500/30">
                {/* Level Badge */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                            {level}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white">Level {level}</h3>
                            <p className="text-purple-300 text-sm">
                                {xp.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => addXP(50)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-500 transition-colors"
                    >
                        +50 XP (Test)
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                    <div className="w-full h-4 bg-black/30 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <p className="text-center text-xs text-purple-300 mt-2">
                        {Math.round(progressPercentage)}% to Level {level + 1}
                    </p>
                </div>

                {/* Recent XP Gains */}
                <div className="mt-6">
                    <h4 className="text-sm font-semibold text-purple-300 mb-3">Recent Gains:</h4>
                    <div className="space-y-2">
                        {[
                            { source: '🎓 Completed Lesson', amount: 30 },
                            { source: '🧪 Passed Lab', amount: 50 },
                            { source: '🔥 7-Day Streak', amount: 100 },
                        ].map((gain, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                            >
                                <span className="text-sm text-purple-200">{gain.source}</span>
                                <span className="text-green-400 font-bold">+{gain.amount} XP</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
