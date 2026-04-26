'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';

interface ContentItem {
    id: string;
    title: string;
    content_type: string;
    file_url: string;
    created_at: string;
}

interface Cohort {
    id: string;
    name: string;
    description: string;
    invite_code: string;
}

interface Message {
    id: string;
    sender: 'ai' | 'user' | 'peer';
    text: string;
    timestamp: Date;
    userName?: string;
}

interface Exam {
    id: string;
    title: string;
    scheduled_at: string;
    duration_minutes: number;
}

export default function CorporateConsole() {
    const { id } = useParams();
    const router = useRouter();
    const { user, loading } = useAuth();
    
    // Data State
    const [cohort, setCohort] = useState<Cohort | null>(null);
    const [assets, setAssets] = useState<ContentItem[]>([]);
    const [exams, setExams] = useState<Exam[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [selectedAsset, setSelectedAsset] = useState<ContentItem | null>(null);

    // AI & Peer Chat State
    const [chatMode, setChatMode] = useState<'advisor' | 'peer'>('advisor');
    const [showChat, setShowChat] = useState(true);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    
    const [aiMessages, setAiMessages] = useState<Message[]>([
        { id: '1', sender: 'ai', text: "Welcome to the Corporate Training Console. I'm your AI Advisor. How can I help you with today's materials?", timestamp: new Date() }
    ]);
    const [peerMessages, setPeerMessages] = useState<Message[]>([]);
    
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!loading && !user) router.push('/auth');
        if (id && user) loadData();
    }, [id, user, loading]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (chatMode === 'peer' && id) fetchPeerMessages();
        }, 5000); // Poll peer messages every 5 seconds
        return () => clearInterval(timer);
    }, [chatMode, id]);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [aiMessages, peerMessages, isTyping, chatMode]);

    const loadData = async () => {
        setLoadingData(true);
        try {
            // Fetch cohort details
            const cRes = await fetch(`/api/admin/cohort?userId=${user?.uid}`);
            const cData = await cRes.json();
            if (cData.success) {
                const found = cData.cohorts.find((c: any) => c.id === id);
                if (found) setCohort(found);
            }

            // Fetch content
            const aRes = await fetch(`/api/admin/content?userId=${user?.uid}&cohortId=${id}`);
            const aData = await aRes.json();
            if (aData.success) {
                setAssets(aData.content);
                if (aData.content.length > 0) setSelectedAsset(aData.content[0]);
            }

            // Fetch exams
            const eRes = await fetch(`/api/admin/exams?cohortId=${id}`);
            const eData = await eRes.json();
            if (eData.success) {
                setExams(eData.exams);
            }

            fetchPeerMessages();
        } catch (e) {
            console.error('Failed to load console data:', e);
        } finally {
            setLoadingData(false);
        }
    };

    const fetchPeerMessages = async () => {
        try {
            const res = await fetch(`/api/chat/peer?cohortId=${id}`);
            const data = await res.json();
            if (data.success) {
                const formatted = data.messages.map((m: any) => ({
                    id: m.id,
                    sender: m.user_id === user?.uid ? 'user' : 'peer',
                    text: m.message,
                    timestamp: new Date(m.created_at),
                    userName: m.user_name
                }));
                setPeerMessages(formatted);
            }
        } catch (e) {
            console.error('Fetch peer messages failed:', e);
        }
    };

    const sendChatMessage = async () => {
        if (!chatInput.trim() || isTyping) return;
        
        const text = chatInput.trim();
        setChatInput('');

        if (chatMode === 'advisor') {
            const userMsg: Message = { id: Date.now().toString(), sender: 'user', text, timestamp: new Date() };
            setAiMessages(prev => [...prev, userMsg]);
            setIsTyping(true);

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: aiMessages.concat(userMsg).map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
                        personalityMode: 'SOCRATIC',
                        studentContext: { cohortId: id, assetId: selectedAsset?.id, context: 'CORPORATE_LMS' },
                        userId: user?.uid
                    })
                });
                const data = await response.json();
                setAiMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: data.text || "I was unable to process that. Try again.", timestamp: new Date() }]);
            } catch (err) {
                console.error('AI Chat error:', err);
            } finally {
                setIsTyping(false);
            }
        } else {
            // Peer Chat
            try {
                const res = await fetch('/api/chat/peer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cohortId: id,
                        userId: user?.uid,
                        userName: user?.email?.split('@')[0] || 'Intern',
                        message: text
                    })
                });
                if (res.ok) fetchPeerMessages();
            } catch (err) {
                console.error('Peer message failed:', err);
            }
        }
    };

    if (loadingData) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="text-4xl text-indigo-600">⚙️</motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex overflow-hidden">
            {/* Sidebar Assets Panel */}
            <div className="w-[350px] bg-white border-r border-slate-100 flex flex-col flex-shrink-0">
                <div className="p-8 border-b border-slate-50">
                    <div className="flex items-center gap-3 mb-8 cursor-pointer group" onClick={() => router.push('/dashboard')}>
                        <span className="text-slate-400 group-hover:text-indigo-600 transition-colors">←</span>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-indigo-600 transition-colors">Training Dashboard</span>
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-lg">L</div>
                        <h2 className="font-black text-lg text-slate-900 tracking-tight">LMS Hub</h2>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{cohort?.name || 'Corporate Unit'}</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Course Material</h3>
                    {assets.length === 0 ? (
                        <div className="p-10 text-center rounded-[32px] bg-slate-50 border border-dashed border-slate-200">
                            <p className="text-3xl mb-3 opacity-30">📁</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vault Empty</p>
                        </div>
                    ) : (
                        assets.map((asset) => (
                            <motion.div 
                                key={asset.id} 
                                onClick={() => setSelectedAsset(asset)}
                                className={`p-5 rounded-[24px] cursor-pointer transition-all border ${selectedAsset?.id === asset.id ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100 text-white' : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-sm text-slate-900'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${selectedAsset?.id === asset.id ? 'bg-white/20' : 'bg-slate-50 text-indigo-500'}`}>
                                        {asset.content_type === 'pdf' ? '📄' : asset.content_type === 'video' ? '🎬' : '🔗'}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-black text-xs truncate">{asset.title}</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest mt-0.5 opacity-60">
                                            {asset.content_type}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative bg-white">
                {/* Top Nav */}
                <div className="px-10 py-6 border-b border-slate-50 flex items-center justify-between">
                    <div>
                        <h1 className="font-black text-2xl text-slate-900 tracking-tight">{cohort?.name} <span className="text-slate-300 font-medium mx-2">/</span> <span className="text-indigo-600 underline underline-offset-8 decoration-4">{selectedAsset?.title || 'Training Overview'}</span></h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex bg-slate-100 p-1 rounded-full">
                             <button onClick={() => setChatMode('advisor')} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${chatMode === 'advisor' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Advisor</button>
                             <button onClick={() => setChatMode('peer')} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${chatMode === 'peer' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Peer Chat</button>
                        </div>
                    </div>
                </div>

                {/* Viewer Body */}
                <div className="flex-1 overflow-y-auto p-12 bg-[#FBFBFF]">
                    <AnimatePresence mode="wait">
                        {selectedAsset ? (
                            <motion.div 
                                key={selectedAsset.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-5xl mx-auto"
                            >
                                {exams.length > 0 && (
                                    <div className="mb-12">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                                            Scheduled Assessments
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {exams.map(exam => (
                                                <div key={exam.id} className="p-6 rounded-[32px] bg-white border border-indigo-100 shadow-sm border-l-4 border-l-indigo-600">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <span className="text-xl">📝</span>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Active</span>
                                                    </div>
                                                    <h4 className="font-bold text-slate-900 mb-1">{exam.title}</h4>
                                                    <div className="flex items-center gap-3 text-[10px] font-medium text-slate-500">
                                                        <span>📅 {new Date(exam.scheduled_at).toLocaleDateString()}</span>
                                                        <span>⏱️ {exam.duration_minutes}m</span>
                                                    </div>
                                                    <button className="w-full mt-4 py-3 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all">Start Exam</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="p-12 rounded-[48px] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden mb-12">
                                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="w-20 h-20 rounded-[32px] bg-slate-50 flex items-center justify-center text-4xl border border-slate-100">
                                                {selectedAsset.content_type === 'pdf' ? '📄' : selectedAsset.content_type === 'video' ? '🎬' : '🔗'}
                                            </div>
                                            {selectedAsset.file_url && (
                                                <a href={selectedAsset.file_url} target="_blank" rel="noopener noreferrer" 
                                                   className="px-8 py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs shadow-xl hover:bg-indigo-700 transition-all">
                                                    Open Asset
                                                </a>
                                            )}
                                        </div>
                                        <h3 className="text-4xl font-black text-slate-900 mb-4">{selectedAsset.title}</h3>
                                        <p className="text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">
                                            Official corporate syllabus for <span className="text-indigo-600">{cohort?.name}</span>. Access restricted to internal personnel.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                     <div className="p-10 rounded-[40px] bg-slate-900 text-white relative overflow-hidden">
                                          <div className="absolute top-0 right-0 p-6 text-4xl opacity-20">📝</div>
                                          <h4 className="text-xl font-bold mb-4">Exam Ready</h4>
                                          <p className="text-sm text-slate-400 mb-8 max-w-xs">Complete this training module to unlock the certification exam. Issued automatically upon passing.</p>
                                          <button className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/20 transition-all">Enter Assessment</button>
                                     </div>
                                     <div className="p-10 rounded-[40px] bg-white border border-slate-100 shadow-sm flex flex-col items-center text-center justify-center">
                                          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-3xl mb-4">🏆</div>
                                          <h4 className="text-lg font-bold text-slate-900 mb-1">Auto-Certification</h4>
                                          <p className="text-xs text-slate-500 font-medium tracking-tight">Skill verification protocol active.</p>
                                     </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center h-full max-w-sm mx-auto opacity-40">
                                <div className="text-8xl mb-8 grayscale text-indigo-500">🏢</div>
                                <h4 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-4">Select Asset</h4>
                                <p className="text-sm font-medium text-slate-500 leading-relaxed">Choose a course module from the repository to begin.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right-side AI & Peer Chat Panel */}
            <AnimatePresence>
                {showChat && (
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        className="w-[450px] bg-[#F8FAFC] border-l border-slate-100 flex flex-col flex-shrink-0 z-[50] shadow-2xl"
                    >
                        <div className="p-8 border-b border-slate-100 bg-white">
                             <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{chatMode === 'advisor' ? '🧠' : '👥'}</span>
                                    <div>
                                        <h4 className="font-black text-slate-900 leading-tight">
                                            {chatMode === 'advisor' ? 'Advisor AI' : 'Intern Peer Chat'}
                                        </h4>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-indigo-500">
                                            {chatMode === 'advisor' ? 'Institutional Protocol active' : `${peerMessages.length} Messages in Space`}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setShowChat(false)} className="text-slate-300 hover:text-slate-600 transition-colors text-2xl">×</button>
                             </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {(chatMode === 'advisor' ? aiMessages : peerMessages).map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className="flex flex-col max-w-[85%]">
                                        {msg.userName && msg.sender !== 'user' && (
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 ml-2">{msg.userName}</span>
                                        )}
                                        <div className={`p-5 rounded-[24px] text-xs font-semibold leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : msg.sender === 'peer' ? 'bg-white border border-slate-100 text-slate-700' : 'bg-slate-900 text-slate-300'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isTyping && chatMode === 'advisor' && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-slate-100 p-4 rounded-[20px] shadow-sm flex gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                                        <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        <div className="p-6 bg-white border-t border-slate-100">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                                    placeholder={chatMode === 'advisor' ? "Ask the AI..." : "Chat with colleagues..."}
                                    className="w-full bg-[#F8FAFC] border border-slate-100 rounded-2xl py-4 pl-5 pr-12 text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                                <button onClick={sendChatMessage} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                                    ↑
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
