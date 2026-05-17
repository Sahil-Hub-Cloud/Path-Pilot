'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';

export default function SplashScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    // Only start the 1.5s countdown once Firebase auth state has resolved
    // If auth state is still loading, wait for it.
    if (loading) return;
    
    const timer = setTimeout(() => {
      if (user) {
        router.push('/dashboard');
      } else {
        setShowOptions(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [user, loading, router]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FDF6EC',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decor */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px', height: '800px',
        background: 'radial-gradient(circle, rgba(0,107,122,0.06) 0%, rgba(253,246,236,0) 70%)',
        zIndex: 0
      }}></div>

      <AnimatePresence>
        <motion.div 
          key="splash-content"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          {/* Logo element */}
          <div style={{ marginBottom: 28 }}>
             <Image src="/logo.webp" alt="Path Pilot" width={88} height={88} className="object-contain" />
          </div>

          <h1 style={{ 
            fontSize: 48, fontWeight: 900, color: '#2C1A0E', 
            letterSpacing: '-0.04em', margin: 0, lineHeight: 1 
          }}>
            Path Pilot
          </h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{ 
              color: '#8B6E52', fontSize: 16, fontWeight: 700, 
              letterSpacing: '0.08em', marginTop: 16, textTransform: 'uppercase'
            }}
          >
            Learn. Code. Get Hired.
          </motion.p>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!showOptions ? (
          <motion.div
            key="loading-bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            style={{
              position: 'absolute',
              bottom: '12%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 10
            }}
          >
            <div style={{
              width: 140,
              height: 4,
              background: 'rgba(0,107,122,0.1)',
              borderRadius: 4,
              overflow: 'hidden'
            }}>
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                style={{
                  width: '40%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, #006B7A, transparent)',
                  borderRadius: 4
                }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="auth-options"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              position: 'absolute',
              bottom: '12%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              zIndex: 10,
              width: '100%',
              padding: '0 24px'
            }}
          >
            <button 
              onClick={() => router.push('/auth?type=student')}
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '16px 24px',
                background: 'linear-gradient(135deg, #006B7A, #005060)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 107, 122, 0.4)',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              I am a Student
            </button>
            <button 
              onClick={() => router.push('/auth/college')}
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '16px 24px',
                background: '#FFFFFF',
                color: '#006B7A',
                border: '2px solid #006B7A',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              I represent a College
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
