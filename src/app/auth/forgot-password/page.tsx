'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiArrowLeft, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    
    setLoading(true);
    setMessage(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage({
        type: 'success',
        text: 'Reset link sent! Check your email inbox.'
      });
      setEmail('');
    } catch (err: any) {
      console.error('Forgot Password Error:', err);
      let errorText = 'Failed to send reset email. Please try again.';
      
      if (err.code === 'auth/user-not-found') {
        errorText = 'We couldn\'t find an account with that email address.';
      } else if (err.code === 'auth/invalid-email') {
        errorText = 'Please enter a valid email address.';
      } else if (err.code === 'auth/too-many-requests') {
        errorText = 'Too many attempts. Please try again later.';
      }
      
      setMessage({
        type: 'error',
        text: errorText
      });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#EDE4D3',
    border: '1.5px solid rgba(120,80,40,0.25)',
    boxShadow: 'inset 0 2px 6px rgba(100,60,20,0.1), 0 1px 0 rgba(255,255,255,0.8)',
    borderRadius: 12,
    padding: '13px 16px 13px 44px',
    fontSize: 14,
    fontWeight: 500,
    color: '#2C1A0E',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.2s ease'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF6EC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, opacity: 0.3,
        backgroundImage: 'radial-gradient(circle, rgba(0,107,122,0.15) 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: 460,
          backgroundColor: 'var(--surface-raised)',
          borderRadius: 28,
          border: '2px solid rgba(180,140,90,0.3)',
          padding: 48,
          boxShadow: '0 4px 0 rgba(255,255,255,0.9) inset, 0 20px 60px rgba(140,90,40,0.15)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{
            width: 40, height: 40,
            background: 'linear-gradient(135deg, #006B7A, #2E7D52)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 900, fontSize: 18,
            boxShadow: '0 4px 12px rgba(0,107,122,0.35)'
          }}>P</div>
          <span style={{ fontWeight: 900, fontSize: 18, color: '#2C1A0E' }}>Path Pilot</span>
        </div>

        <h2 style={{ fontWeight: 900, fontSize: 24, color: '#2C1A0E', letterSpacing: '-0.03em', marginBottom: 6 }}>
          Reset Password
        </h2>
        <p style={{ color: '#8B6E52', fontSize: 14, fontWeight: 500, marginBottom: 28 }}>
          Enter your email and we'll send you a link to get back into your account.
        </p>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }}
              style={{ 
                background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(217,95,43,0.1)', 
                border: message.type === 'success' ? '1.5px solid rgba(16,185,129,0.3)' : '1.5px solid rgba(217,95,43,0.3)', 
                borderRadius: 12, 
                padding: '12px 16px', 
                color: message.type === 'success' ? '#065F46' : '#B04A1E', 
                fontSize: 13, 
                fontWeight: 600, 
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              {message.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleResetRequest} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ position: 'relative' }}>
            <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8B6E52' }} />
            <input 
              type="email" 
              placeholder="Email address" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{
              width: '100%', 
              padding: '14px 0', 
              fontSize: 14,
              background: 'linear-gradient(180deg, #008FA3 0%, #006B7A 50%, #005060 100%)',
              color: '#fff', 
              border: '1px solid rgba(0,40,50,0.4)', 
              borderRadius: 14, 
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 800, 
              letterSpacing: '0.04em', 
              textTransform: 'uppercase',
              boxShadow: '0 1px 0 rgba(255,255,255,0.25) inset, 0 -2px 0 rgba(0,0,0,0.2) inset, 0 6px 14px rgba(0,60,80,0.35)',
              transition: 'all 0.18s ease'
            }}
          >
            {loading ? 'SENDING...' : 'Send Reset Link →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button 
            onClick={() => router.push('/auth')} 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: '#8B6E52', 
              fontSize: 13, 
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <FiArrowLeft /> Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
}
