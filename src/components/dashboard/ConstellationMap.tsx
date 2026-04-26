'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Node {
    id: string;
    title: string;
    difficulty: string;
    x: number;
    y: number;
    icon: string;
}

interface ConstellationMapProps {
    modules: any[];
    onModuleClick: (id: string) => void;
}

const DIFFICULTY_COLORS: Record<string, { bg: string; glow: string; border: string; gradient: string }> = {
    EASY: {
        bg: 'from-emerald-500/20 to-teal-500/20',
        glow: 'rgba(16,185,129,0.2)',
        border: 'border-emerald-500/20 hover:border-emerald-500/40',
        gradient: 'from-emerald-500 to-teal-500'
    },
    MEDIUM: {
        bg: 'from-violet-500/20 to-blue-500/20',
        glow: 'rgba(139,92,246,0.2)',
        border: 'border-violet-500/20 hover:border-violet-500/40',
        gradient: 'from-violet-500 to-blue-500'
    },
    HARD: {
        bg: 'from-red-500/20 to-orange-500/20',
        glow: 'rgba(239,68,68,0.2)',
        border: 'border-red-500/20 hover:border-red-500/40',
        gradient: 'from-red-500 to-orange-500'
    },
};

export const ConstellationMap: React.FC<ConstellationMapProps> = ({ modules, onModuleClick }) => {
    const nodes: Node[] = useMemo(() => {
        return modules.map((m, i) => {
            const angle = (i / modules.length) * Math.PI * 2;
            const radius = 140 + Math.random() * 180;
            return {
                id: m.id,
                title: m.title,
                difficulty: m.difficulty,
                icon: m.icon || '📚',
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
            };
        });
    }, [modules]);

    return (
        <div className="relative w-full h-[600px] flex items-center justify-center overflow-visible">
            {/* Connection Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15" />
                        <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.15" />
                    </linearGradient>
                </defs>
                {nodes.map((node, i) => {
                    if (i === 0) return null;
                    const prevNode = nodes[i - 1];
                    return (
                        <motion.line
                            key={`line-${i}`}
                            x1={`calc(50% + ${prevNode.x}px)`}
                            y1={`calc(50% + ${prevNode.y}px)`}
                            x2={`calc(50% + ${node.x}px)`}
                            y2={`calc(50% + ${node.y}px)`}
                            stroke="url(#line-grad)"
                            strokeWidth="1.5"
                            strokeDasharray="6 4"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, delay: i * 0.08 }}
                        />
                    );
                })}
            </svg>

            {/* Nodes */}
            {nodes.map((node, i) => {
                const colors = DIFFICULTY_COLORS[node.difficulty] || DIFFICULTY_COLORS.EASY;
                return (
                    <motion.div
                        key={node.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: i * 0.06, type: 'spring', stiffness: 200 }}
                        whileHover={{ scale: 1.15, zIndex: 10 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onModuleClick(node.id)}
                        className="absolute cursor-pointer group"
                        style={{
                            transform: `translate(${node.x}px, ${node.y}px)`,
                        }}
                    >
                        {/* The Node Orb */}
                        <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.bg} backdrop-blur-xl border ${colors.border} flex items-center justify-center text-2xl transition-all duration-300 group-hover:shadow-[0_0_25px_${colors.glow}]`}>
                            <span className="relative z-10 group-hover:scale-110 transition-transform">{node.icon}</span>

                            {/* Difficulty dot */}
                            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r ${colors.gradient} shadow-lg`} />
                        </div>

                        {/* Title Tooltip */}
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-0 translate-y-2 whitespace-nowrap">
                            <div className="bg-[#020617]/90 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/[0.06] text-[10px] font-bold uppercase tracking-widest text-white shadow-xl">
                                {node.title}
                                <div className={`text-[8px] font-bold mt-0.5 bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                                    {node.difficulty}
                                </div>
                            </div>
                        </div>

                        {/* Hover Glow */}
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" style={{ background: colors.glow }} />
                    </motion.div>
                );
            })}
        </div>
    );
};
