'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { FiSend, FiArrowLeft, FiCpu } from 'react-icons/fi';

interface Message { id: string; sender: 'ai' | 'user'; text: string; timestamp: Date; }

const MODES = [
  { id: 'TUTOR',     name: 'Tutor',     icon: '👨‍🏫', desc: 'Guides you with hints, not answers' },
  { id: 'SOCRATIC',  name: 'Socratic',  icon: '🤔', desc: 'Questions only — forces deep thinking' },
  { id: 'DEBUGGER',  name: 'Debugger',  icon: '🐛', desc: 'Teaches you to find and fix bugs' },
  { id: 'INTERVIEW', name: 'Interview', icon: '👔', desc: 'Mock technical interview' },
];

const STYLE = {
  bg:          '#FDF6EC',
  card:        '#FFFFFF',
  border:      'rgba(180,140,90,0.25)',
  textPrimary: '#2C1A0E',
  textSub:     '#8B6E52',
  teal:        '#006B7A',
  green:       '#2E7D52',
};

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { isReady } = useAuthGuard();
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', sender: 'ai', text: "Hey there! 👋 I'm your Path Pilot AI Tutor. Pick a mode above and ask me anything — I'm here to help you LEARN, not just give answers.", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState('TUTOR');
  const [isVernacular, setIsVernacular] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const m = searchParams.get('mode');
    if (m && MODES.find(x => x.id === m.toUpperCase())) setMode(m.toUpperCase());
  }, [searchParams]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    if (textareaRef.current) { textareaRef.current.style.height = 'auto'; }
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.concat(userMsg).map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
          personalityMode: mode,
          vernacularMode: isVernacular,
          studentContext: { energy: 100, streak: 0 },
          userId: user?.uid
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), sender: 'ai',
        text: data.text || 'Hmm, I had a hiccup. Try asking again!',
        timestamp: new Date()
      }]);
    } catch (err: any) {
      const errorMsg = err?.message?.includes('CONFIG_ERROR')
        ? "AI Tutor isn't configured yet. Ask the admin to add the GROQ_API_KEY."
        : err?.message?.includes('decommissioned')
          ? "AI model is being updated. Please try again in a moment."
          : err?.message?.includes('rate')
            ? "AI is busy right now. Please wait a moment and try again."
            : `Something went wrong: ${err?.message || 'unknown error'}. Check your connection and try again.`;
      setMessages(prev => [...prev, {
        id: 'err-' + Date.now(), sender: 'ai',
        text: errorMsg,
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isReady) return (
    <div style={{ minHeight: '100vh', background: STYLE.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, background: `linear-gradient(135deg, ${STYLE.teal}, ${STYLE.green})`, borderRadius: 10, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 18 }}>P</div>
        <div style={{ fontWeight: 700, color: STYLE.textSub, fontSize: 14 }}>Loading AI Tutor...</div>
      </div>
    </div>
  );

  const activeMode = MODES.find(m => m.id === mode) || MODES[0];

  return (
    <div style={{ minHeight: '100vh', height: '100vh', background: STYLE.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ─── HEADER ─── */}
      <div style={{
        padding: '16px 24px', borderBottom: `2px solid ${STYLE.border}`,
        background: '#FFF8EE', display: 'flex', alignItems: 'center', gap: 16,
        flexShrink: 0, boxShadow: '0 4px 16px rgba(140,90,40,0.08)'
      }}>
        <button onClick={() => router.push('/dashboard')} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
          background: 'rgba(0,107,122,0.08)', border: `1.5px solid ${STYLE.border}`,
          borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 13, color: STYLE.teal
        }}>
          <FiArrowLeft size={14} /> Dashboard
        </button>

        <div style={{ height: 20, width: 1, background: STYLE.border }} />

        {/* Mode tabs */}
        <div style={{ display: 'flex', gap: 8 }}>
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} style={{
              padding: '8px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: 12, transition: 'all 0.2s',
              background: mode === m.id ? `linear-gradient(135deg, ${STYLE.teal}, ${STYLE.green})` : 'rgba(180,140,90,0.1)',
              color: mode === m.id ? '#fff' : STYLE.textSub,
              boxShadow: mode === m.id ? `0 4px 12px rgba(0,107,122,0.3)` : 'none'
            }}>
              {m.icon} {m.name}
            </button>
          ))}
        </div>

        {/* Hinglish toggle */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: STYLE.textSub }}>Hinglish</span>
          <button role="switch" aria-checked={isVernacular} aria-label="Toggle Hinglish" onClick={() => setIsVernacular(!isVernacular)} style={{
            width: 40, height: 22, borderRadius: 999, position: 'relative', border: 'none',
            cursor: 'pointer', padding: 3, transition: 'all 0.2s',
            background: isVernacular ? STYLE.teal : 'rgba(180,140,90,0.25)'
          }}>
            <motion.div animate={{ x: isVernacular ? 18 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: 'var(--surface-raised)', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
          </button>
        </div>

        <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${STYLE.teal}, ${STYLE.green})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18 }}>
          <FiCpu />
        </div>
      </div>

      {/* Mode description bar */}
      <div style={{ padding: '10px 24px', background: `${STYLE.teal}0D`, borderBottom: `1px solid ${STYLE.border}`, flexShrink: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: STYLE.teal }}>{activeMode.icon} {activeMode.name} Mode</span>
        <span style={{ fontSize: 12, color: STYLE.textSub, marginLeft: 8 }}>— {activeMode.desc}</span>
      </div>

      {/* ─── MESSAGES ─── */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 8px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <AnimatePresence mode="popLayout">
            {messages.map((msg, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: '82%' }}>
                  {msg.sender === 'ai' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, background: `linear-gradient(135deg, ${STYLE.teal}, ${STYLE.green})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 9, fontWeight: 900 }}>AI</div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: STYLE.textSub, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{mode} Mode · {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )}
                  <div style={{
                    padding: '14px 18px', borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                    fontSize: 14, lineHeight: 1.65, fontWeight: 500, whiteSpace: 'pre-wrap',
                    background: msg.sender === 'user' ? `linear-gradient(135deg, ${STYLE.teal}, ${STYLE.green})` : STYLE.card,
                    color: msg.sender === 'user' ? '#fff' : STYLE.textPrimary,
                    border: msg.sender === 'user' ? 'none' : `2px solid ${STYLE.border}`,
                    boxShadow: msg.sender === 'user'
                      ? `0 4px 14px rgba(0,107,122,0.3), inset 0 1px 0 rgba(255,255,255,0.15)`
                      : `0 2px 8px rgba(140,90,40,0.08), inset 0 1px 0 rgba(255,255,255,0.8)`
                  }}>
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: `linear-gradient(135deg, ${STYLE.teal}, ${STYLE.green})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 9, fontWeight: 900 }}>AI</div>
              <div style={{ padding: '14px 20px', background: STYLE.card, borderRadius: '4px 18px 18px 18px', border: `2px solid ${STYLE.border}`, display: 'flex', gap: 6, alignItems: 'center' }}>
                {[0, 150, 300].map(delay => (
                  <motion.span key={delay} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: delay / 1000 }}
                    style={{ width: 8, height: 8, borderRadius: '50%', background: STYLE.teal, display: 'block' }} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ─── INPUT ─── */}
      <div style={{ padding: '16px 24px 24px', flexShrink: 0 }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: 12,
            background: STYLE.card, border: `2px solid ${STYLE.border}`,
            borderRadius: 18, padding: '10px 10px 10px 18px',
            boxShadow: '0 4px 20px rgba(140,90,40,0.1), inset 0 1px 0 rgba(255,255,255,0.8)'
          }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
              }}
              placeholder={`Ask in ${activeMode.name} mode... (Enter to send, Shift+Enter for new line)`}
              rows={1}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: 14, fontWeight: 500, color: STYLE.textPrimary, resize: 'none',
                minHeight: 24, maxHeight: 160, lineHeight: 1.6,
                fontFamily: 'inherit', overflowY: 'auto'
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              style={{
                width: 44, height: 44, borderRadius: 12, border: 'none', cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                background: input.trim() && !isTyping ? `linear-gradient(135deg, ${STYLE.teal}, ${STYLE.green})` : 'rgba(180,140,90,0.15)',
                color: input.trim() && !isTyping ? '#fff' : STYLE.textSub,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.2s',
                boxShadow: input.trim() && !isTyping ? `0 4px 14px rgba(0,107,122,0.35)` : 'none'
              }}
            >
              <FiSend size={18} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#FDF6EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontWeight: 700, color: '#8B6E52' }}>Loading AI Tutor...</div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
