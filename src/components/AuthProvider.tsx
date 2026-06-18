'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    role: 'student' | 'company' | 'college' | 'admin' | null;
    signOut: () => Promise<void>;
    authError: string | null;
    retryAuth: () => void;
    // Legacy compat
    institutionId: string | null;
    isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    role: null,
    institutionId: null,
    isAdmin: false,
    authError: null,
    retryAuth: () => {},
    signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<'student' | 'company' | 'college' | 'admin' | null>(null);
    const [institutionId, setInstitutionId] = useState<string | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);
    const router = useRouter();

    const initAuth = useCallback((retryCount = 0) => {
        if (!auth) {
            console.error('AuthProvider: Firebase auth object is null/undefined.');
            setAuthError('Firebase failed to initialize. Check your configuration.');
            setLoading(false);
            return () => {};
        }

        if (retryCount === 0) {
            setLoading(true);
        }
        setAuthError(null);

        // Safety timeout: 30 seconds
        const timeout = setTimeout(() => {
            console.error('AuthProvider: Firebase auth timed out after 30 seconds.');
            setAuthError('Using offline mode - limited features');
            setLoading(false);

            // Exponential backoff retry logic
            if (retryCount < 3) {
                const backoffDelay = Math.pow(2, retryCount) * 2000;
                console.log(`AuthProvider: Retrying connection in ${backoffDelay}ms... (Attempt ${retryCount + 1})`);
                setTimeout(() => {
                    initAuth(retryCount + 1);
                }, backoffDelay);
            }
        }, 30000);

        let unsubscribe: (() => void) | undefined;

        try {
            unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
                clearTimeout(timeout);
                // Clear any previous offline error on success
                if (authError === 'Using offline mode - limited features') {
                    setAuthError(null);
                }

                // ⚡ Set user and loading IMMEDIATELY — do NOT await Firestore here.
                setUser(firebaseUser);
                setLoading(false);

                // Load role from Firestore in the background
                if (firebaseUser) {
                    loadUserRole(firebaseUser.uid);
                } else {
                    setRole(null);
                    setInstitutionId(null);
                }
            }, (error: any) => {
                clearTimeout(timeout);
                console.error(`AuthProvider: onAuthStateChanged error [Code: ${error?.code}]:`, error);
                setAuthError(`Authentication error: ${error.message}`);
                setLoading(false);
            });
        } catch (error: any) {
            clearTimeout(timeout);
            console.error(`AuthProvider: Failed to attach auth listener [Code: ${error?.code}]:`, error);
            setAuthError(`Failed to initialize authentication: ${error.message}`);
            setLoading(false);
        }

        return () => {
            clearTimeout(timeout);
            if (unsubscribe) unsubscribe();
        };
    }, [authError]);

    useEffect(() => {
        const cleanup = initAuth(0);
        return cleanup;
    }, [initAuth]);

    const retryAuth = useCallback(() => {
        console.log('AuthProvider: Manual retry auth connection...');
        setAuthError(null);
        setLoading(true);
        return initAuth(0);
    }, [initAuth]);

    // Separate async function — runs in background, never blocks auth
    const loadUserRole = async (uid: string) => {
        try {
            const { db } = await import('@/lib/firebase');
            if (!db) return;
            const { doc, getDoc } = await import('firebase/firestore');
            // Use a race with a timeout so offline Firestore doesn't hang forever
            const firestoreTimeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
            const docPromise = getDoc(doc(db, 'users', uid));
            const result = await Promise.race([docPromise, firestoreTimeout]);
            if (result && 'exists' in result && result.exists()) {
                const data = result.data();
                const fetchedRole = data?.role;
                if (fetchedRole === 'company' || fetchedRole === 'college' || fetchedRole === 'admin' || fetchedRole === 'student') {
                    setRole(fetchedRole);
                } else {
                    setRole('student');
                }
                if (fetchedRole === 'admin' || fetchedRole === 'college') {
                    setInstitutionId(data?.collegeId || null);
                } else {
                    setInstitutionId(null);
                }
            } else {
                setRole('student');
                setInstitutionId(null);
            }
        } catch {
            // Firestore offline — default to student role
            setRole('student');
            setInstitutionId(null);
        }
    };

    const signOut = async () => {
        if (auth) {
            await firebaseSignOut(auth);
            setUser(null);
            setRole(null);
            setInstitutionId(null);
            router.push('/auth');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, role, institutionId, isAdmin: role === 'admin', authError, retryAuth, signOut }}>
            {authError && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
                    background: 'linear-gradient(135deg, #B04A1E 0%, #8B3A15 100%)',
                    color: '#fff', padding: '12px 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontSize: 14, fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                    <span>⚠️ {authError}</span>
                    <button
                        onClick={retryAuth}
                        style={{
                            background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)',
                            color: '#fff', padding: '6px 16px', borderRadius: 8,
                            cursor: 'pointer', fontWeight: 700, fontSize: 13,
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Retry Connection
                    </button>
                </div>
            )}
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

