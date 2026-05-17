'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { usePathname } from 'next/navigation';

export default function DoubtChatbot() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ sender: 'ai' | 'user', text: string }[]>([
        { sender: 'ai', text: 'Hey! 👋 I\'m your AI Mentor. Ask me anything about code, concepts, or career paths!' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const { user } = useAuth();
    const userId = user?.uid || 'guest';

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    if (pathname === '/auth' || pathname === '/onboarding') {
        return null;
    }

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: `You are Path Pilot's AI Tutor. Help the student with this question: "${userMsg}"`
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response');
            }

            setMessages(prev => [...prev, { sender: 'ai', text: data.text || 'No response received.' }]);
        } catch (error) {
            console.error('Chatbot Error:', error);
            setMessages(prev => [...prev, { sender: 'ai', text: "I'm having trouble connecting right now. Please check your internet connection and try again." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center text-2xl transition-all duration-500 z-50 micro-bounce ${isOpen
                    ? 'bg-red-500/80 backdrop-blur-xl rotate-90 scale-90 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                    : 'bg-gradient-to-br from-violet-600 to-cyan-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:scale-110'
                    }`}
            >
                {isOpen ? '✕' : '🧠'}
            </button>

            {/* Chat Window */}
            <div className={`fixed bottom-24 right-6 w-[380px] h-[520px] flex flex-col transition-all duration-500 z-50 origin-bottom-right ${isOpen
                ? 'scale-100 opacity-100 translate-y-0'
                : 'scale-0 opacity-0 translate-y-10 pointer-events-none'
                }`}>
                {/* Card with liquid styling */}
                <div className="liquid-card flex flex-col h-full overflow-hidden">

                    {/* Header */}
                    <div className="p-4 border-b border-white/[0.06] bg-gradient-to-r from-violet-600/10 to-cyan-600/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-sm shadow-[0_0_12px_rgba(139,92,246,0.3)] micro-float">
                                    🧠
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">AI Mentor</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                                        <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">Online</p>
                                    </div>
                                </div>
                            </div>
                            <a href="/chat" className="text-[9px] text-violet-400 hover:text-violet-300 font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-violet-500/20 hover:bg-violet-500/10 hover:border-violet-500/30 transition-all">
                                Full Screen →
                            </a>
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${m.sender === 'user'
                                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-br-sm shadow-[0_2px_10px_rgba(139,92,246,0.2)]'
                                    : 'bg-white dark:bg-gray-800/[0.04] text-slate-300 border border-white/[0.06] rounded-bl-sm'
                                    }`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-gray-800/[0.04] p-3.5 rounded-2xl rounded-bl-sm flex gap-1.5 items-center border border-white/[0.06]">
                                    <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" />
                                    <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                                    <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t border-white/[0.06] bg-[#020617]/60">
                        <div className="flex gap-2">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                placeholder="Ask me anything..."
                                className="flex-1 bg-white dark:bg-gray-800/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] placeholder:text-slate-600 transition-all"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-30 text-white p-2.5 rounded-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] active:scale-95"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
