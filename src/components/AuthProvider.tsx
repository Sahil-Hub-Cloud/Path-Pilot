'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    role: 'student' | 'company' | null;
    signOut: () => Promise<void>;
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
    signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<'student' | 'company' | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }

        // Safety timeout: if onAuthStateChanged never fires (e.g. SDK init failure),
        // unblock the app after 5 seconds.
        const timeout = setTimeout(() => {
            console.warn('AuthProvider: Firebase auth timed out. Assuming no user.');
            setLoading(false);
        }, 5000);

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            clearTimeout(timeout);

            // ⚡ Set user and loading IMMEDIATELY — do NOT await Firestore here.
            // Firestore can be offline and its promises hang indefinitely.
            // Role is loaded in a separate non-blocking async call below.
            setUser(firebaseUser);
            setLoading(false);

            // Load role from Firestore in the background — won't block auth
            if (firebaseUser) {
                loadUserRole(firebaseUser.uid);
            } else {
                setRole(null);
            }
        });

        return () => {
            clearTimeout(timeout);
            unsubscribe();
        };
    }, []);

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
                setRole(data?.role === 'company' ? 'company' : 'student');
            } else {
                setRole('student');
            }
        } catch {
            // Firestore offline — default to student role
            setRole('student');
        }
    };

    const signOut = async () => {
        if (auth) {
            await firebaseSignOut(auth);
            setUser(null);
            setRole(null);
            router.push('/auth');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, role, institutionId: null, isAdmin: false, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
