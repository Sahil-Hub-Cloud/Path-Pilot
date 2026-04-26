import { motion, AnimatePresence } from 'framer-motion';
import IntegrationRow from './IntegrationRow';
import { useNeuralLink } from '@/lib/neural-link';

interface NeuralLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onReboot: () => void;
}

export default function NeuralLinkModal({ isOpen, onClose, onReboot }: NeuralLinkModalProps) {
    const { integrations, toggleIntegration, mounted } = useNeuralLink();

    // We need to sync local state with the hook's state to ensure we are modifying the same underlying data
    // However, useNeuralLink reads from localStorage on mount.
    // For this modal to work as a "Control Panel", it should read/write to the same source.
    // Since useNeuralLink handles the logic, we just use it directly.

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-inter">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#09090b]/90 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 30 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            y: 0,
                            transition: { type: "spring", stiffness: 300, damping: 30 }
                        }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#0f1623]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_80px_rgba(6,182,212,0.15)] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-white/5 relative overflow-hidden">
                            {/* Top Highlight */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />

                            <div className="flex items-center gap-4">
                                <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">🧠</span>
                                <div>
                                    <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2" style={{ fontFamily: 'Orbitron' }}>
                                        NEURAL LINK
                                        <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30">v3.2</span>
                                    </h2>
                                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-1">Bi-Directional Data Streams</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 -mr-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">

                            {/* Data Streams */}
                            <div>
                                <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-4 pl-1 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_5px_cyan]"></span>
                                    Input Streams
                                </h3>
                                <div className="space-y-3 pl-2 border-l-2 border-white/5">
                                    <IntegrationRow
                                        id="calendar"
                                        name="Google Calendar"
                                        icon="🗓️"
                                        description="Read lecture blocks & study time"
                                        isConnected={integrations.calendar.connected}
                                        onToggle={() => toggleIntegration('calendar')}
                                    />
                                    <IntegrationRow
                                        id="health"
                                        name="Google Health"
                                        icon="💤"
                                        description="Sync sleep & heart-rate for energy model"
                                        isConnected={integrations.health.connected}
                                        onToggle={() => toggleIntegration('health')}
                                    />
                                    <IntegrationRow
                                        id="notion"
                                        name="Notion Workspace"
                                        icon="📝"
                                        description="Import syllabus & active tasks"
                                        isConnected={integrations.notion.connected}
                                        onToggle={() => toggleIntegration('notion')}
                                    />
                                </div>
                            </div>

                            {/* Content Streams */}
                            <div>
                                <h3 className="text-[10px] font-black text-violet-500 uppercase tracking-widest mb-4 pl-1 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_5px_violet]"></span>
                                    Learning Streams
                                </h3>
                                <div className="space-y-3 pl-2 border-l-2 border-white/5">
                                    <IntegrationRow
                                        id="youtube"
                                        name="YouTube Neural Filter"
                                        icon="🎞️"
                                        description="Auto-log tutorials & block distractions"
                                        isConnected={integrations.youtube.connected}
                                        onToggle={() => toggleIntegration('youtube')}
                                    />
                                    <IntegrationRow
                                        id="pdf"
                                        name="PDF Drive Link"
                                        icon="📄"
                                        description="Ingest syllabus PDFs directly"
                                        isConnected={integrations.pdf.connected}
                                        onToggle={() => toggleIntegration('pdf')}
                                    />
                                </div>
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="px-6 py-5 bg-black/40 border-t border-white/5 flex justify-between items-center">
                            <p className="text-[10px] text-slate-500 font-mono uppercase">
                                <span className={Object.values(integrations).some(i => i.connected) ? "text-emerald-400" : "text-slate-600"}>●</span> {Object.values(integrations).filter(i => i.connected).length} active streams
                            </p>
                            <button
                                onClick={onReboot}
                                className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all uppercase tracking-wide text-xs"
                            >
                                Save & Reboot Kernel
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
