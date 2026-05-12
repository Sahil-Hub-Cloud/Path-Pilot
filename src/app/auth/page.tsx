'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiLoader } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { fetchResilient } from '@/lib/firestore-resilience';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [role, setRole] = useState<'student' | 'company'>('student');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [redirectProcessing, setRedirectProcessing] = useState(false); // Only true when there's an actual pending redirect
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '', name: '', companyName: '' });

  // Handle post-auth Firestore writes & redirect — resilient to Firestore being offline
  const handlePostAuth = async (firebaseUser: any, uid: string) => {
    const savedRole = localStorage.getItem('pp_role') || 'student';
    localStorage.removeItem('pp_role');

    // Default values if Sync fails
    let finalRole = savedRole;
    let isNewUser = true;
    let onboardingComplete = false;

    if (db) {
      try {
        // 1. Fetch existing profile with strict timeout
        const userDoc = await fetchResilient(doc(db, 'users', uid), 4000);
        if (userDoc && userDoc.exists()) {
          const userData = userDoc.data();
          isNewUser = false;
          onboardingComplete = userData?.onboardingComplete === true;
          finalRole = userData?.role || savedRole;
        }

        // 2. Role Validation: Check if the account matches the selected persona
        if (finalRole !== savedRole && !isNewUser) {
          await auth.signOut();
          const mismatchError = `Identity Mismatch: This account is registered as a ${finalRole.toUpperCase()}. Please switch to ${finalRole.toUpperCase()} mode to continue.`;
          throw { code: 'custom/role-mismatch', message: mismatchError };
        }

        // 3. Write/Sync user data with timeout — don't block if slow
        const syncTimeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000));
        await Promise.race([
          setDoc(doc(db, 'users', uid), {
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            role: finalRole,
            updatedAt: new Date().toISOString()
          }, { merge: true }),
          syncTimeout
        ]);
      } catch (err: any) {
        if (err.code === 'custom/role-mismatch') throw err; 
        console.warn('Auth Sync: Database slow or offline, proceeding with defaults...', err);
      }
    }

    // Reset all loading states before navigation
    setLoading(false);
    setGoogleLoading(false);
    setRedirectProcessing(false);

    // 4. Navigate
    if (finalRole === 'company') {
      router.push('/company/dashboard');
    } else if (isNewUser || !onboardingComplete) {
      router.push('/onboarding');
    } else {
      router.push('/dashboard');
    }
  };

  // Check for a pending redirect result on mount (only relevant after signInWithRedirect)
  useEffect(() => {
    const r = searchParams.get('role');
    if (r === 'company') setRole('company');

    if (!auth) return;

    // Only check for redirect result if we previously triggered one
    const pendingRedirect = localStorage.getItem('pp_pending_redirect');
    if (!pendingRedirect) return; // No pending redirect — skip the check entirely

    setRedirectProcessing(true);
    console.log("Auth: Checking for pending redirect result...");

    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          console.log("Auth: Redirect success for", result.user.email);
          localStorage.removeItem('pp_pending_redirect');
          await handlePostAuth(result.user, result.user.uid);
        } else {
          console.log("Auth: No redirect result found.");
          localStorage.removeItem('pp_pending_redirect');
          setRedirectProcessing(false);
        }
      })
      .catch((err) => {
        console.error("Auth: Redirect check error:", err);
        localStorage.removeItem('pp_pending_redirect');
        if (err.code !== 'auth/no-redirect-operation' && err.code !== 'auth/null-user') {
          showError(`Connection issue: ${err.message || 'Please try again.'}`);
        }
        setRedirectProcessing(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(''), 10000);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) { showError('System initialization failed. Refreshing...'); window.location.reload(); return; }
    setLoading(true);
    setError('');
    try {
      if (mode === 'signin') {
        const result = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        
        // 1. Resolve role from Firestore
        let userRole: 'student' | 'company' = 'student';
        let targetPath = '/dashboard';

        if (db) {
          try {
            const firestoreTimeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3500));
            const docResult = await Promise.race([
              getDoc(doc(db, 'users', result.user.uid)),
              firestoreTimeout
            ]);
            
            if (docResult && 'exists' in docResult && docResult.exists()) {
              const userData = docResult.data();
              userRole = (userData?.role as 'student' | 'company') || 'student';
              targetPath = userRole === 'company' ? '/company/dashboard' : '/dashboard';
            }
          } catch (e) {
            console.warn("Auth: Firestore role check failed, defaulting to student dashboard", e);
          }
        }

        // 2. Strict Role Validation: Ensure intended role matches account role
        if (userRole !== role) {
          await auth.signOut(); // Kick them out immediately
          const errorMsg = `Login Failed: This email is registered as a ${userRole.toUpperCase()}. Please switch the tab to ${userRole.toUpperCase()} mode to sign in.`;
          throw { code: 'custom/role-mismatch', message: errorMsg };
        }

        router.push(targetPath);
      } else {
        const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
        // Write profile — with timeout to prevent hanging the UI
        if (db) {
          try {
            const firestoreTimeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000));
            await Promise.race([
              setDoc(doc(db, 'users', result.user.uid), {
                displayName: role === 'company' ? formData.companyName : formData.name,
                email: formData.email,
                role,
                onboardingComplete: false,
                createdAt: new Date().toISOString()
              }),
              firestoreTimeout
            ]);
          } catch (firestoreErr) {
            console.warn('Auth: Could not save profile to Firestore (timeout/offline), continuing...', firestoreErr);
          }
        }
        router.push(role === 'company' ? '/company/dashboard' : '/onboarding');
      }
    } catch (err: any) {
      console.error("Auth: Email error:", err);
      setLoading(false); // Immediate unlock on error
      
      const msg =
        err.code === 'custom/role-mismatch' ? err.message
        : err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential' ? 'Incorrect email or password for this role.'
        : err.code === 'auth/user-not-found' ? 'No account with this email. Create one below.'
        : err.code === 'auth/email-already-in-use' ? 'Email already registered. Try switching to Sign In mode.'
        : err.code === 'auth/weak-password' ? 'Password must be at least 6 characters.'
        : err.code === 'auth/network-request-failed' ? 'Connection lost. Check your internet or VPN.'
        : err.message || 'Login failed. Please verify your credentials.';
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!auth) { showError('Authentication error. Please refresh.'); return; }
    setGoogleLoading(true);
    setError('');
    localStorage.setItem('pp_role', role);

    try {
      // 1. Try popup first — works on localhost and most environments
      console.log("Auth: Trying Google popup...");
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      await handlePostAuth(result.user, result.user.uid);
    } catch (err: any) {
      console.warn("Auth: Popup attempt result:", err.code);
      setGoogleLoading(false); // Enable retry on error

      if (
        err.code === 'auth/popup-blocked' ||
        err.code === 'auth/popup-closed-by-user' ||
        err.code === 'auth/cancelled-popup-request'
      ) {
        try {
          const provider = new GoogleAuthProvider();
          provider.setCustomParameters({ prompt: 'select_account' });
          localStorage.setItem('pp_pending_redirect', '1'); 
          localStorage.setItem('pp_role', role); // Re-persist role for redirect
          await signInWithRedirect(auth, provider);
        } catch (redirectErr: any) {
          console.error("Auth: Redirect failed:", redirectErr);
          localStorage.removeItem('pp_pending_redirect');
          showError('Google sign-in failed. Please try another browser.');
        }
      } else if (err.code === 'custom/role-mismatch') {
        showError(err.message);
      } else {
        console.error("Auth: Google error:", err);
        showError(err.message || 'Google sign-in failed.');
      }
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
      {/* LOADING OVERLAY — only for in-flight redirect processing */}
      <AnimatePresence>
        {redirectProcessing && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(253,246,236,0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <FiLoader className="spin" size={48} style={{ color: '#006B7A', marginBottom: 20 }} />
            <h3 style={{ color: '#2C1A0E', fontWeight: 800 }}>Establishing secure session...</h3>
            <p style={{ color: '#8B6E52', fontSize: 13 }}>Please do not refresh the page.</p>
          </motion.div>
        )}
      </AnimatePresence>

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
          background: '#FFFFFF',
          borderRadius: 28,
          border: '2px solid rgba(180,140,90,0.3)',
          padding: 48,
          boxShadow: '0 4px 0 rgba(255,255,255,0.9) inset, 0 20px 60px rgba(140,90,40,0.15)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <Image src="/logo.webp" alt="Path Pilot" width={40} height={40} className="object-contain" />
          <span style={{ fontWeight: 900, fontSize: 18, color: '#2C1A0E' }}>Path Pilot</span>
        </div>

        <h2 style={{ fontWeight: 900, fontSize: 24, color: '#2C1A0E', letterSpacing: '-0.03em', marginBottom: 6 }}>
          {mode === 'signin' ? 'Welcome back' : 'Create account'}
        </h2>
        <p style={{ color: '#8B6E52', fontSize: 14, fontWeight: 500, marginBottom: 28 }}>
          {mode === 'signin' ? 'Sign in to continue your journey.' : 'Get started with Path Pilot today.'}
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 28, background: '#EDE4D3', borderRadius: 14, padding: 4 }}>
          {(['student', 'company'] as const).map(r => (
            <button key={r} onClick={() => setRole(r)} style={{
              flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontWeight: 800, fontSize: 13, transition: 'all 0.2s ease',
              background: role === r ? 'linear-gradient(135deg, #006B7A, #2E7D52)' : 'transparent',
              color: role === r ? '#fff' : '#8B6E52',
              boxShadow: role === r ? '0 3px 12px rgba(0,107,122,0.35)' : 'none'
            }}>
              {r === 'student' ? 'Student' : 'Company'}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ background: 'rgba(217,95,43,0.1)', border: '1.5px solid rgba(217,95,43,0.3)', borderRadius: 12, padding: '12px 16px', color: '#B04A1E', fontSize: 13, fontWeight: 600, marginBottom: 20 }}
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AnimatePresence>
            {mode === 'signup' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                <div style={{ position: 'relative' }}>
                  <FiUser style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8B6E52' }} />
                  <input type="text" placeholder={role === 'company' ? 'Company name' : 'Full name'} required
                    value={role === 'company' ? formData.companyName : formData.name}
                    onChange={e => setFormData(prev => role === 'company' ? { ...prev, companyName: e.target.value } : { ...prev, name: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ position: 'relative' }}>
            <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8B6E52' }} />
            <input type="email" placeholder="Email address" required value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              style={inputStyle}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8B6E52' }} />
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" required value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              style={{ ...inputStyle, paddingRight: 48 }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8B6E52' }}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {mode === 'signin' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -8 }}>
              <button 
                type="button" 
                onClick={() => router.push('/auth/forgot-password')} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#006B7A', fontSize: 13, fontWeight: 700 }}
              >
                Forgot password?
              </button>
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px 0', fontSize: 14,
            background: 'linear-gradient(180deg, #008FA3 0%, #006B7A 50%, #005060 100%)',
            color: '#fff', border: '1px solid rgba(0,40,50,0.4)', borderRadius: 14, cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase',
            boxShadow: '0 1px 0 rgba(255,255,255,0.25) inset, 0 -2px 0 rgba(0,0,0,0.2) inset, 0 6px 14px rgba(0,60,80,0.35)',
            transition: 'all 0.18s ease',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'auto'
          }}>
            {loading ? (
              <span>WAITING...</span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 14 }}>{mode === 'signin' ? 'Sign In →' : 'Create Account →'}</span>
                <span style={{ fontSize: 9, opacity: 0.8, letterSpacing: '0.1em', fontWeight: 600 }}>AS {role.toUpperCase()}</span>
              </div>
            )}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0', color: '#B89A7E', fontSize: 12, fontWeight: 700 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(180,140,90,0.25)' }} />
          OR
          <div style={{ flex: 1, height: 1, background: 'rgba(180,140,90,0.25)' }} />
        </div>

        <button onClick={handleGoogleAuth} disabled={googleLoading} style={{
          width: '100%', padding: '14px 0',
          background: '#FFFFFF', border: '2px solid rgba(180,140,90,0.35)',
          borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          cursor: googleLoading ? 'not-allowed' : 'pointer',
          fontWeight: 700, fontSize: 14, color: '#2C1A0E',
          boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 4px 10px rgba(140,90,40,0.1)',
          transition: 'all 0.2s ease'
        }}>
          <FcGoogle size={20} />
          {googleLoading ? 'Connecting...' : 'Continue with Google'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#8B6E52', fontWeight: 500 }}>
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#006B7A', fontWeight: 800 }}>
            {mode === 'signin' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </motion.div>
      
      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', backgroundColor: '#FDF6EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontWeight: 700, color: '#5C3D1E' }}>Connecting to Path Pilot...</div>
      </div>
    }>
      <AuthForm />
    </Suspense>
  );
}
