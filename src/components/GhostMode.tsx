'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GhostModeProps {
    isActive: boolean;
    onDeactivate: () => void;
}

export default function GhostMode({ isActive, onDeactivate }: GhostModeProps) {
    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-[#020617]/95 backdrop-blur-3xl flex flex-col items-center justify-center p-8 overflow-hidden"
                >
                    {/* Background Glitch Effects */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-1 bg-purple-500/20 animate-glitch-line" />
                        <div className="absolute top-[30%] left-0 w-full h-[2px] bg-indigo-500/10 animate-glitch-line-slow" />
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-500/20 animate-glitch-line" />
                    </div>

                    {/* Shield Icon & Glow */}
                    <div className="relative mb-12">
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-purple-500 blur-[100px] rounded-full"
                        />
                        <div className="w-32 h-32 rounded-3xl bg-black border-2 border-purple-500/50 flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(168,85,247,0.3)]">
                            <span className="text-6xl">👻</span>
                        </div>
                    </div>

                    {/* Status Text */}
                    <div className="text-center space-y-4 max-w-lg relative z-10">
                        <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase group">
                            GHOST PROTOCOL <span className="text-purple-500 animate-pulse">ACTIVE</span>
                        </h1>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.5em] mb-12">
                            Neural Shield // Focus Lock // 1.5x Efficiency
                        </p>

                        <div className="bg-white dark:bg-gray-800/5 border border-white/5 p-6 rounded-2xl space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Distraction Block</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Locked</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Neural Multiplier</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-purple-400">1.5X Active</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Energy Regen</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-purple-400">Enhanced (+15/hr)</span>
                            </div>
                        </div>
                    </div>

                    <p className="mt-12 text-[10px] text-white/20 font-medium leading-relaxed text-center max-w-sm">
                        You are now in a high-intensity focus loop. Navigation to external modules is restricted until the protocol is terminated.
                    </p>

                    {/* Action Button */}
                    <button
                        onClick={onDeactivate}
                        className="mt-12 px-12 py-4 bg-white dark:bg-gray-800/5 border border-white/10 hover:bg-white dark:bg-gray-800/10 hover:border-purple-500/50 transition-all rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white"
                    >
                        Terminate Protocol
                    </button>

                    {/* Footer Info */}
                    <div className="absolute bottom-10 left-0 right-0 px-12 flex justify-between items-center">
                        <div className="flex gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-1.5 h-1.5 bg-purple-500/20 rounded-full" />
                            ))}
                        </div>
                        <span className="text-[8px] font-black text-white/10 uppercase tracking-widest">Integrity Check: Stable</span>
                    </div>

                    {/* Scan Layer */}
                    <div className="absolute inset-0 pointer-events-none bg-scan-lines opacity-10" />
                </motion.div>
            )}

            <style jsx global>{`
                @keyframes glitch-line {
                    0% { transform: translateY(-100%); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(100vh); opacity: 0; }
                }
                .animate-glitch-line {
                    animation: glitch-line 2s linear infinite;
                }
                .animate-glitch-line-slow {
                    animation: glitch-line 5s linear infinite;
                }
                .bg-scan-lines {
                    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
                    background-size: 100% 2px, 3px 100%;
                }
            `}</style>
        </AnimatePresence>
    );
}
