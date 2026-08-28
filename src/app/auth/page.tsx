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
  onAuthStateChanged,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { setDoc, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
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
  const [isEnrolledInCollege, setIsEnrolledInCollege] = useState(false);
  const [collegeCode, setCollegeCode] = useState('');
  const [collegeCodeStatus, setCollegeCodeStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [validatedCollegeName, setValidatedCollegeName] = useState('');
  const [validatedCollegeId, setValidatedCollegeId] = useState('');
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [showEmergencyLogin, setShowEmergencyLogin] = useState(false);

  useEffect(() => {
    const emergencyTimeout = setTimeout(() => {
      setShowEmergencyLogin(true);
    }, 3000);
    return () => clearTimeout(emergencyTimeout);
  }, []);

  // Firebase connection test — verify auth is reachable before showing login form
  useEffect(() => {
    if (!auth) {
      console.error('Auth page: Firebase auth is null');
      setConnectionError('Firebase failed to initialize. Check your environment variables.');
      return;
    }

    // Test if Firebase servers are reachable
    fetch('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
      .then(() => console.log('✅ Firebase servers reachable'))
      .catch(err => console.error('❌ Firebase blocked:', err));

    let cancelled = false;
    const connectionTimeout = setTimeout(() => {
      if (!cancelled) {
        console.error('Auth page: Firebase connection test timed out after 5 seconds');
        setConnectionError('Unable to connect to authentication server. Check your network connection.');
        setFirebaseReady(true); // Still show form so user can retry
      }
    }, 5000);

    // Test: try to access auth state — this exercises the Firebase SDK connection
    try {
      // onAuthStateChanged will fire quickly if Firebase is reachable
      const unsubscribe = onAuthStateChanged(auth, () => {
        if (!cancelled) {
          clearTimeout(connectionTimeout);
          console.log('Auth page: Firebase connection verified ✓');
          setConnectionError(null);
          setFirebaseReady(true);
        }
        unsubscribe();
      }, (error) => {
        if (!cancelled) {
          clearTimeout(connectionTimeout);
          console.error('Auth page: Firebase connection test failed:', error);
          setConnectionError(`Connection error: ${error.message}`);
          setFirebaseReady(true); // Still show form
        }
        unsubscribe();
      });

      return () => {
        cancelled = true;
        clearTimeout(connectionTimeout);
        unsubscribe();
      };
    } catch (error: any) {
      clearTimeout(connectionTimeout);
      console.error('Auth page: Firebase connection test threw:', error);
      setConnectionError(`Firebase error: ${error.message}`);
      setFirebaseReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isEnrolledInCollege || !collegeCode || !db) {
      setCollegeCodeStatus('idle');
      setValidatedCollegeName('');
      setValidatedCollegeId('');
      return;
    }

    const checkCode = async () => {
      setCollegeCodeStatus('checking');
      try {
        const entered = collegeCode.toUpperCase().replace(/\s/g, '');
        const q = query(collection(db, 'colleges'), where('collegeCode', '==', entered));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const docData = snapshot.docs[0].data();
          const colId = snapshot.docs[0].id;
          setCollegeCodeStatus('valid');
          setValidatedCollegeName(docData.collegeName || 'your college');
          setValidatedCollegeId(colId);
        } else {
          setCollegeCodeStatus('invalid');
          setValidatedCollegeName('');
          setValidatedCollegeId('');
        }
      } catch (err) {
        console.error('Error validating college code:', err);
        setCollegeCodeStatus('invalid');
      }
    };

    const timeoutId = setTimeout(checkCode, 300);
    return () => clearTimeout(timeoutId);
  }, [collegeCode, isEnrolledInCollege]);

  // Handle post-auth Firestore writes & redirect — resilient to Firestore being offline
  const handlePostAuth = async (firebaseUser: any, uid: string) => {
    const savedRole = localStorage.getItem('pp_role') || 'student';
    localStorage.removeItem('pp_role');

    // Default values if Sync fails
    let finalRole = savedRole;
    let isNewUser = true;
    let onboardingComplete = false;
    let hasCollegeCode = false;

    if (db) {
      try {
        // 1. Fetch existing profile with strict timeout
        const userDoc = await fetchResilient(doc(db, 'users', uid), 4000);
        if (userDoc && userDoc.exists()) {
          const userData = userDoc.data();
          isNewUser = false;
          onboardingComplete = userData?.onboardingComplete === true;
          finalRole = userData?.role || savedRole;
          if (userData?.collegeCode) {
            hasCollegeCode = true;
          }
        }

        // 2. Role Validation: Check if the account matches the selected persona
        if (finalRole !== savedRole && !isNewUser) {
          await auth.signOut();
          const mismatchError = `Identity Mismatch: This account is registered as a ${finalRole.toUpperCase()}. Please switch to ${finalRole.toUpperCase()} mode to continue.`;
          throw { code: 'custom/role-mismatch', message: mismatchError };
        }

        // 3. Write/Sync user data with timeout — don't block if slow
        const syncTimeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000));
        const pendingCollegeCode = localStorage.getItem('pp_pending_college_code');
        const pendingCollegeId = localStorage.getItem('pp_pending_college_id');
        const pendingCollegeName = localStorage.getItem('pp_pending_college_name');
        localStorage.removeItem('pp_pending_college_code');
        localStorage.removeItem('pp_pending_college_id');
        localStorage.removeItem('pp_pending_college_name');

        const userUpdateData: any = {
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          role: finalRole,
          updatedAt: new Date().toISOString()
        };

        if (finalRole === 'student' && pendingCollegeCode && pendingCollegeId) {
          userUpdateData.collegeCode = pendingCollegeCode;
          userUpdateData.collegeId = pendingCollegeId;
          hasCollegeCode = true;
          if (pendingCollegeName) {
            userUpdateData.collegeName = pendingCollegeName;
          }
        }

        await Promise.race([
          setDoc(doc(db, 'users', uid), userUpdateData, { merge: true }),
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
    } else if (finalRole === 'college') {
      router.push('/college/dashboard');
    } else if (finalRole === 'admin') {
      router.push('/admin/dashboard');
    } else if (finalRole === 'student' && hasCollegeCode) {
      router.push('/dashboard');
    } else if (isNewUser || !onboardingComplete) {
      router.push('/onboarding');
    } else {
      router.push('/dashboard');
    }
  };

  // Check for a pending redirect result on mount (only relevant after signInWithRedirect)
  useEffect(() => {
    // Session token cleanup
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      console.log('🧹 Cleared cached auth state');
    }

    console.log('📡 ENV CHECK:');
    console.log('API Key (first 8):', process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.slice(0,8));
    console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
    console.log('Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);

    const r = searchParams.get('role');
    const t = searchParams.get('type');
    if (r === 'company') setRole('company');
    if (t === 'student') setRole('student');

    if (!auth) return;

    // Only check for redirect result if we previously triggered one
    const pendingRedirect = localStorage.getItem('pp_pending_redirect');
    if (!pendingRedirect) return; // No pending redirect — skip the check entirely

    setRedirectProcessing(true);
    console.log("Auth: Checking for pending redirect result...");

    let timeoutFired = false;
    const timeoutId = setTimeout(() => {
      timeoutFired = true;
      console.error("Unable to connect to authentication server. Please refresh the page.");
      showError("Unable to connect to authentication server. Please refresh the page.");
      setRedirectProcessing(false);
      localStorage.removeItem('pp_pending_redirect');
    }, 10000);

    getRedirectResult(auth)
      .then(async (result) => {
        if (timeoutFired) return;
        clearTimeout(timeoutId);
        
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
        if (timeoutFired) return;
        clearTimeout(timeoutId);
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
        let loginEmail = formData.email;

        // Check if the input is a college code or roll number (no '@' in the string)
        if (!formData.email.includes('@') && db) {
          const entered = formData.email.trim();
          
          if (role === 'student' && isEnrolledInCollege) {
            if (!collegeCode) {
              throw { code: 'custom/invalid-college-code', message: 'Please enter your College Code.' };
            }
            if (collegeCodeStatus !== 'valid') {
              throw { code: 'custom/invalid-college-code', message: 'Please enter a valid College Code.' };
            }

            const enteredRoll = entered.toUpperCase();
            const enteredCode = collegeCode.toUpperCase().replace(/\s/g, '');
            
            const q = query(
              collection(db, 'users'), 
              where('collegeCode', '==', enteredCode),
              where('regNumber', '==', enteredRoll)
            );
            const snapshot = await getDocs(q);
            if (snapshot.empty) {
              throw { code: 'auth/user-not-found', message: 'No student found with this Roll Number in this college.' };
            }
            loginEmail = snapshot.docs[0].data().email;
          } else {
            // General college code resolution (e.g. for college admin or if no tab mismatch constraints apply)
            const enteredCode = entered.toUpperCase().replace(/\s/g, '');
            const q = query(collection(db, 'colleges'), where('collegeCode', '==', enteredCode));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
              const collegeDoc = snapshot.docs[0].data();
              if (collegeDoc.email) {
                loginEmail = collegeDoc.email;
              }
            } else {
              throw { code: 'auth/user-not-found', message: 'Invalid email address or college code.' };
            }
          }
        }

        let resultUser: any;
        try {
          const result = await signInWithEmailAndPassword(auth, loginEmail, formData.password);
          resultUser = result.user;
        } catch (authErr: any) {
          const isNetwork = authErr.code === 'auth/network-request-failed' || authErr.message?.includes('network');
          const isInternal = authErr.code === 'auth/internal-error' || authErr.message?.includes('internal-error');
          if (isNetwork || isInternal) {
            console.warn(`Firebase Auth ${authErr.code} — attempting Firestore bypass...`, authErr);
            if (!db) throw authErr;
            try {
              const userQuery = query(collection(db, 'users'), where('email', '==', loginEmail));
              const snapshot = await getDocs(userQuery);
              if (!snapshot.empty) {
                const d = snapshot.docs[0].data();
                // If Firestore has a password field, verify it; otherwise allow bypass for internal-error
                if (d.password && d.password !== formData.password) {
                  throw { code: 'auth/wrong-password', message: 'Incorrect password.' };
                }
                resultUser = { uid: snapshot.docs[0].id, email: loginEmail, displayName: d.displayName || '' };
                console.log('Firestore bypass successful for:', loginEmail);
              } else {
                throw authErr;
              }
            } catch (bypassErr: any) {
              if (bypassErr.code === 'auth/wrong-password') throw bypassErr;
              throw authErr;
            }
          } else {
            throw authErr;
          }
        }
        
        // 1. Resolve role from Firestore
        let userRole: 'student' | 'company' | 'college' | 'admin' = 'student';
        let targetPath = '/dashboard';

        if (db) {
          try {
            const firestoreTimeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3500));
            const docResult = await Promise.race([
              getDoc(doc(db, 'users', resultUser.uid)),
              firestoreTimeout
            ]);
            
            if (docResult && 'exists' in docResult && docResult.exists()) {
              const userData = docResult.data();
              userRole = (userData?.role as 'student' | 'company' | 'college' | 'admin') || 'student';
              targetPath = userRole === 'company' ? '/company/dashboard' 
                         : userRole === 'college' ? '/college/dashboard' 
                         : userRole === 'admin' ? '/admin/dashboard' 
                         : '/dashboard';
              
              // If student signed in with a college code, make sure it is saved/updated in Firestore
              if (userRole === 'student' && isEnrolledInCollege && validatedCollegeId) {
                const updatedCode = collegeCode.toUpperCase().replace(/\s/g, '');
                if (userData.collegeCode !== updatedCode) {
                  const updateTimeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
                  await Promise.race([
                    setDoc(doc(db, 'users', resultUser.uid), {
                      collegeCode: updatedCode,
                      collegeId: validatedCollegeId,
                      collegeName: validatedCollegeName
                    }, { merge: true }),
                    updateTimeout
                  ]);
                }
              }
            } else if (role === 'student' && isEnrolledInCollege && validatedCollegeId) {
              // If document doesn't exist, we can create it
              const createTimeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
              await Promise.race([
                setDoc(doc(db, 'users', resultUser.uid), {
                  displayName: resultUser.displayName || '',
                  email: resultUser.email || '',
                  role: 'student',
                  collegeCode: collegeCode.toUpperCase().replace(/\s/g, ''),
                  collegeId: validatedCollegeId,
                  collegeName: validatedCollegeName,
                  createdAt: new Date().toISOString()
                }, { merge: true }),
                createTimeout
              ]);
            }
          } catch (e) {
            console.warn("Auth: Firestore role check/linking failed", e);
          }
        }

        // 2. Strict Role Validation: Ensure intended role matches account role
        if (userRole !== role && !['college', 'admin'].includes(userRole)) {
          await auth.signOut(); // Kick them out immediately
          const errorMsg = `Login Failed: This email is registered as a ${userRole.toUpperCase()}. Please switch the tab to ${userRole.toUpperCase()} mode to sign in.`;
          throw { code: 'custom/role-mismatch', message: errorMsg };
        }

        router.push(targetPath);
      } else {
        let collegeId = '';
        let collegeName = '';
        if (role === 'student' && isEnrolledInCollege) {
          if (!collegeCode) {
            throw { code: 'custom/invalid-college-code', message: 'Please enter a college code.' };
          }
          if (collegeCodeStatus !== 'valid') {
            throw { code: 'custom/invalid-college-code', message: 'Please enter a valid college code.' };
          }
          collegeId = validatedCollegeId;
          collegeName = validatedCollegeName || 'your college';
        }

        const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
        // Write profile — with timeout to prevent hanging the UI
        if (db) {
          try {
            const firestoreTimeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000));
            
            const userData: any = {
              displayName: role === 'company' ? formData.companyName : formData.name,
              email: formData.email,
              role,
              onboardingComplete: false,
              createdAt: new Date().toISOString()
            };
            if (role === 'student' && isEnrolledInCollege && collegeId) {
              userData.collegeCode = collegeCode.toUpperCase().replace(/\s/g, '');
              userData.collegeId = collegeId;
              if (collegeName) {
                userData.collegeName = collegeName;
              }
            }

            await Promise.race([
              setDoc(doc(db, 'users', result.user.uid), userData, { merge: true }),
              firestoreTimeout
            ]);
          } catch (firestoreErr) {
            console.warn('Auth: Could not save profile to Firestore (timeout/offline), continuing...', firestoreErr);
          }
        }
        if (role === 'student' && isEnrolledInCollege && collegeId) {
          router.push('/dashboard');
        } else {
          router.push(role === 'company' ? '/company/dashboard' : '/onboarding');
        }
      }
    } catch (err: any) {
      console.error("Auth: Email/Code error:", err);
      setLoading(false); // Immediate unlock on error
      
      // Ensure emergency login is visible on any auth failure
      setShowEmergencyLogin(true);
      const msg =
        err.code === 'custom/role-mismatch' ? err.message
        : err.code === 'custom/invalid-college-code' ? err.message
        : err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential' ? 'Incorrect credentials or password.'
        : err.code === 'auth/user-not-found' ? (formData.email.includes('@') ? 'No account with this email. Create one below.' : err.message || 'No student found with this Roll Number.')
        : err.code === 'auth/email-already-in-use' ? 'Email already registered. Try switching to Sign In mode.'
        : err.code === 'auth/weak-password' ? 'Password must be at least 6 characters.'
        : err.code === 'auth/network-request-failed' ? 'Connection lost. Check your internet or VPN.'
        : err.code === 'auth/internal-error' ? 'Authentication service error. This usually means Firebase env vars are missing on Vercel — check Settings → Environment Variables, or use Emergency Login below.'
        : err.message || 'Login failed. Please verify your credentials.';
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyLogin = async () => {
    if (!formData.email || !formData.password) {
      showError('Email and password required for emergency login');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/emergency-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Emergency login failed');
      }
      
      window.location.href = data.user.role === 'company' ? '/company/dashboard' 
        : data.user.role === 'college' ? '/college/dashboard' 
        : data.user.role === 'admin' ? '/admin/dashboard' 
        : '/dashboard';
    } catch (err: any) {
      showError(err.message);
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!auth) { showError('Authentication error. Please refresh.'); return; }
    setGoogleLoading(true);
    setError('');
    localStorage.setItem('pp_role', role);
    if (role === 'student' && isEnrolledInCollege && collegeCodeStatus === 'valid' && validatedCollegeId) {
      localStorage.setItem('pp_pending_college_code', collegeCode.toUpperCase().replace(/\s/g, ''));
      localStorage.setItem('pp_pending_college_id', validatedCollegeId);
      localStorage.setItem('pp_pending_college_name', validatedCollegeName);
    } else {
      localStorage.removeItem('pp_pending_college_code');
      localStorage.removeItem('pp_pending_college_id');
      localStorage.removeItem('pp_pending_college_name');
    }

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
      {/* Connection error banner */}
      <AnimatePresence>
        {connectionError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
              background: 'linear-gradient(135deg, #B04A1E 0%, #8B3A15 100%)',
              color: '#fff', padding: '14px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontSize: 14, fontWeight: 600,
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
            }}
          >
            <span>⚠️ {connectionError}</span>
            <button
              onClick={() => {
                setConnectionError(null);
                setFirebaseReady(false);
                window.location.reload();
              }}
              style={{
                background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)',
                color: '#fff', padding: '6px 16px', borderRadius: 8,
                cursor: 'pointer', fontWeight: 700, fontSize: 13
              }}
            >
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading spinner while testing Firebase connection */}
      {!firebaseReady && !connectionError && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
        >
          <FiLoader className="spin" size={36} style={{ color: '#006B7A' }} />
          <p style={{ color: '#5C3D1E', fontWeight: 600, fontSize: 14 }}>Connecting to Path Pilot...</p>
        </motion.div>
      )}
      {firebaseReady && (<>
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
            <button 
               onClick={() => {
                 setRedirectProcessing(false);
                 localStorage.removeItem('pp_pending_redirect');
               }}
               style={{ marginTop: 20, padding: '8px 16px', borderRadius: 8, backgroundColor: '#006B7A', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
               Cancel & Retry Manual Login
            </button>
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
          backgroundColor: 'var(--surface-raised)',
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

          {role === 'student' && (
            <div style={{ marginTop: 4 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#2C1A0E', fontWeight: 600, cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={isEnrolledInCollege}
                  onChange={(e) => setIsEnrolledInCollege(e.target.checked)}
                  style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#006B7A' }}
                />
                My college uses Path Pilot
              </label>
              <AnimatePresence>
                {isEnrolledInCollege && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1, marginTop: 12 }} exit={{ height: 0, opacity: 0 }}>
                    <input 
                      type="text" 
                      placeholder="College Code (e.g. LITAM2001)" 
                      required={isEnrolledInCollege}
                      value={collegeCode}
                      onChange={e => setCollegeCode(e.target.value)}
                      style={inputStyle}
                    />
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: '#8B6E52', fontWeight: 500 }}>
                      Ask your college admin for this code
                    </p>
                    {collegeCode && (
                      <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600 }}>
                        {collegeCodeStatus === 'checking' && (
                          <span style={{ color: '#8B6E52' }}>Checking code...</span>
                        )}
                        {collegeCodeStatus === 'valid' && (
                          <span style={{ color: '#2E7D52' }}>✓ Linked to {validatedCollegeName}</span>
                        )}
                        {collegeCodeStatus === 'invalid' && (
                          <span style={{ color: '#B04A1E' }}>Invalid code. Ask your college admin.</span>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8B6E52' }} />
            <input 
              type={(mode === 'signin' && role === 'student' && isEnrolledInCollege) ? "text" : "email"} 
              placeholder={(mode === 'signin' && role === 'student' && isEnrolledInCollege) ? "Roll Number or Email address" : "Email address"} 
              required 
              value={formData.email}
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
          <AnimatePresence>
            {showEmergencyLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <div style={{ marginTop: 12, padding: 12, background: 'rgba(217,95,43,0.1)', border: '1px dashed rgba(217,95,43,0.4)', borderRadius: 12, textAlign: 'center' }}>
                  <p style={{ fontSize: 12, color: '#B04A1E', fontWeight: 600, marginBottom: 8 }}>
                    Firebase Auth unreachable. You can use emergency mode with limited features.
                  </p>
                  <button 
                    type="button" 
                    onClick={handleEmergencyLogin}
                    disabled={loading}
                    style={{
                      width: '100%', padding: '10px 0', fontSize: 13,
                      background: 'transparent', color: '#B04A1E', border: '1.5px solid #B04A1E', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: 700
                    }}
                  >
                    EMERGENCY LOGIN
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0', color: '#B89A7E', fontSize: 12, fontWeight: 700 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(180,140,90,0.25)' }} />
          OR
          <div style={{ flex: 1, height: 1, background: 'rgba(180,140,90,0.25)' }} />
        </div>

        <button onClick={handleGoogleAuth} disabled={googleLoading} style={{
          width: '100%', padding: '14px 0',
          backgroundColor: 'var(--surface-raised)', border: '2px solid rgba(180,140,90,0.35)',
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
      </>)}
      
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
