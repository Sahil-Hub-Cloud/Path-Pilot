'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface NeuralVaultProps {
    certificates: any[];
}

export default function NeuralVault({ certificates }: NeuralVaultProps) {
    if (!certificates || certificates.length === 0) {
        return (
            <div className="bg-[#050911] border border-white/5 p-8 rounded-[2.5rem] text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-2xl mx-auto mb-4 opacity-20">🗄️</div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-2">Neural Vault</h3>
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">No verified credentials found</p>
                <div className="mt-6 pt-6 border-t border-white/5">
                    <p className="text-[8px] text-white/10 uppercase tracking-widest">Complete missions to secure artifacts</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#050911] border border-white/5 rounded-[2.5rem] overflow-hidden">
            <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                <div className="flex justify-between items-end">
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-2">Neural Vault</h3>
                        <h2 className="text-xl font-black italic tracking-tight">VERIFIED ARTIFACTS</h2>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-4">
                {certificates.map((cert, i) => (
                    <motion.div
                        key={cert.hash}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group bg-white/[0.02] border border-white/5 p-5 rounded-2xl hover:border-emerald-500/30 transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-[40px] rounded-full group-hover:bg-emerald-500/10 transition-all" />

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-[11px] font-black uppercase tracking-tight text-white/80 group-hover:text-emerald-400 transition-colors">{cert.missionTitle}</h4>
                                <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">{cert.date}</p>
                            </div>
                            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px]">💎</div>
                        </div>

                        <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-white/10 mt-auto">
                            <span>TX_HASH: {cert.txHash?.substring(0, 10)}...</span>
                            <span className="text-emerald-500/50 italic">Verified by Polygon</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="p-6 bg-white/[0.01] border-t border-white/5 text-center">
                <p className="text-[8px] text-white/20 uppercase tracking-[0.2em] font-bold">Secure backup protocol active</p>
            </div>
        </div>
    );
}
