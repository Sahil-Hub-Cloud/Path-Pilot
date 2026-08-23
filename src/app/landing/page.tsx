'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

export default function SplashScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
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
      background:
        'linear-gradient(135deg, var(--bg-cream) 0%, var(--bg-cream-light) 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      color: 'var(--text-dark)'
    }}>
      {/* Decorative floating orbs */}
      <div style={{
        position: 'absolute',
        width: '400px', height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--peacock-blue-light) 0%, transparent 70%)',
        top: -100,
        left: -100,
        opacity: 0.6,
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '300px', height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--peacock-green-light) 0%, transparent 70%)',
        bottom: -50,
        right: -50,
        opacity: 0.5,
        animation: 'float 6s ease-in-out infinite reverse'
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
          <div style={{ marginBottom: 28 }}>
             <Image
               src="/logo.webp"
               alt="Path Pilot"
               width={96}
               height={96}
               className="object-contain rounded-xl border border-[var(--border-clay)]"
             />
          </div>

          <h1 style={{
            fontSize: 56,
            fontWeight: 900,
            color: 'var(--peacock-blue)',
            letterSpacing: '-0.04em',
            margin: 0,
            lineHeight: 1
          }}>
            Path Pilot
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{
              color: 'var(--peacock-green)',
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '0.04em',
              marginTop: 16,
              textTransform: 'uppercase'
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
                  background: 'linear-gradient(90deg, transparent, var(--peacock-blue), transparent)',
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
              gap: '20px',
              zIndex: 10,
              width: '100%',
              maxWidth: '360px',
              padding: '0 24px'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', width: '100%' }}>
              <button
                onClick={() => router.push('/auth?type=student')}
                style={{
                  width: '100%',
                  padding: '16px 32px',
                  background: 'linear-gradient(135deg, var(--peacock-blue-light) 0%, var(--peacock-blue) 50%, var(--peacock-blue-dark) 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '16px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0, 107, 122, 0.4)',
                  transition: 'transform 0.2s',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Start Learning Free
              </button>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '4px', fontWeight: 500 }}>
                Join as a student to access paths, labs, and track your skills.
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', width: '100%' }}>
              <button
                onClick={() => router.push('/auth/college')}
                style={{
                  width: '100%',
                  padding: '16px 32px',
                  backgroundColor: 'var(--surface-raised)',
                  color: 'var(--peacock-blue)',
                  border: '2px solid var(--peacock-blue)',
                  borderRadius: '14px',
                  fontSize: '16px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.2s',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                I represent a College
              </button>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '4px', fontWeight: 500 }}>
                Register your institution to track student progress and manage onboarding.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}