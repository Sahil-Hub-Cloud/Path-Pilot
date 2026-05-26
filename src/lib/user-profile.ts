
import { useState, useEffect, useCallback, useMemo } from 'react';

export interface CyberneticStats {
    focus: number;
    speed: number;
    resilience: number;
    logic: number;
    creativity: number;
}

export interface UserProfile {
    credits: number;
    stats: CyberneticStats;
    inventory: string[];
    rank: string;
    isPremium: boolean;
    achievements: string[];
    joinDate: string;
}

const DEFAULT_PROFILE: UserProfile = {
    credits: 500, // Starting Credits
    stats: {
        focus: 65,
        speed: 40,
        resilience: 70,
        logic: 50,
        creativity: 30
    },
    inventory: [],
    rank: 'SCRIPT KIDDIE',
    isPremium: false,
    achievements: [],
    joinDate: new Date().toISOString().split('T')[0]
};

import { getFirebaseDb } from './firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export const useCyberneticProfile = (userId: string) => {
    const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
    const [loading, setLoading] = useState(true);

    const storageKey = useMemo(() => `pilot_profile_${userId || 'unknown'}`, [userId]);

    // Load & Sync
    useEffect(() => {
        if (!userId || typeof window === 'undefined') return;

        const db = getFirebaseDb();
        let unsubscribe: (() => void) | undefined;

        const loadProfile = async () => {
            setLoading(true);

            // 1. ALWAYS try LocalStorage first (offline-first approach)
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setProfile(parsed);
                    setLoading(false);
                } catch {
                    setProfile(DEFAULT_PROFILE);
                }
            } else {
                // No local data, use defaults
                const rank = localStorage.getItem('pilot_rank') || 'SCRIPT KIDDIE';
                const init = { ...DEFAULT_PROFILE, rank };
                setProfile(init);
                localStorage.setItem(storageKey, JSON.stringify(init));
            }

            // 2. Try Firestore sync in background (non-blocking)
            if (db && !userId.startsWith('off_')) {
                try {
                    const docRef = doc(db, 'profiles', userId);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const firestoreData = docSnap.data() as UserProfile;
                        setProfile(firestoreData);
                        localStorage.setItem(storageKey, JSON.stringify(firestoreData));
                    } else {
                        // User doesn't exist in Firestore, create from localStorage
                        let currentProfile = { ...DEFAULT_PROFILE };
                        if (saved) {
                            try {
                                currentProfile = JSON.parse(saved);
                            } catch (e) {
                                console.error("Error parsing profile for firestore sync:", e);
                            }
                        }
                        await setDoc(docRef, currentProfile);
                    }

                    // 3. Set up realtime listener (only if online)
                    unsubscribe = onSnapshot(docRef, (doc) => {
                        if (doc.exists()) {
                            const data = doc.data() as UserProfile & { economy?: { credits: number, energy: number } };
                            if (data.economy) {
                                setProfile(() => ({ ...data, credits: data.economy!.credits }));
                            } else {
                                setProfile(data);
                            }
                            localStorage.setItem(storageKey, JSON.stringify(data));
                        }
                    });
                } catch (error: any) {
                    // Firestore failed (offline, rules, etc.) - silently continue with localStorage
                    console.warn('Firestore sync failed, using offline mode:', error.code || error.message);
                }
            }

            setLoading(false);
        };

        loadProfile();

        // Cross-tab Sync
        const handleSync = (e: StorageEvent) => {
            if (e.key === storageKey && e.newValue) {
                try {
                    setProfile(JSON.parse(e.newValue));
                } catch (err) {
                    console.error("Sync error", err);
                }
            }
        };

        window.addEventListener('storage', handleSync);
        return () => {
            unsubscribe?.();
            window.removeEventListener('storage', handleSync);
        };
    }, [userId, storageKey]);

    // Save
    const saveProfile = useCallback(async (newProfile: UserProfile) => {
        if (!userId) return;
        setProfile(newProfile);

        // Always save to localStorage first (offline-first)
        try {
            localStorage.setItem(storageKey, JSON.stringify(newProfile));
        } catch (_e) {
            console.warn("LocalStorage full, proceeding with state only");
        }

        // Try Firestore sync in background (non-blocking)
        const db = getFirebaseDb();
        if (db && userId && !userId.startsWith('off_')) {
            try {
                await setDoc(doc(db, 'profiles', userId), newProfile, { merge: true });
            } catch (error: any) {
                // Silently fail if offline - data is already in localStorage
                console.warn("Firestore save failed (offline mode):", error.code || error.message);
            }
        }
    }, [userId, storageKey]);

    // Actions
    const addCredits = useCallback((amount: number) => {
        setProfile(prev => {
            const next = { ...prev, credits: prev.credits + amount };
            saveProfile(next); // Syncs full profile
            return next;
        });
    }, [saveProfile, userId]);

    const purchaseItem = useCallback((item: string, cost: number): boolean => {
        let success = false;
        setProfile(prev => {
            if (prev.credits < cost || prev.inventory.includes(item)) {
                success = false;
                return prev;
            }
            const next = {
                ...prev,
                credits: prev.credits - cost,
                inventory: [...prev.inventory, item]
            };
            saveProfile(next);
            success = true;
            return next;
        });
        return success;
    }, [saveProfile, userId]);

    const updateStats = useCallback((delta: Partial<CyberneticStats>) => {
        setProfile(prev => {
            const nextStats = { ...prev.stats };
            (Object.keys(delta) as Array<keyof CyberneticStats>).forEach(key => {
                if (delta[key] !== undefined) {
                    nextStats[key] = Math.min(100, Math.max(0, nextStats[key] + (delta[key] || 0)));
                }
            });
            const next = { ...prev, stats: nextStats };
            saveProfile(next);
            return next;
        });
    }, [saveProfile]);

    const unlockAchievement = useCallback((id: string) => {
        setProfile(prev => {
            if (prev.achievements.includes(id)) return prev;
            const next = {
                ...prev,
                achievements: [...prev.achievements, id]
            };
            saveProfile(next);
            return next;
        });
    }, [saveProfile]);

    const evaluateRank = useCallback((currentProfile: UserProfile, completedCount: number) => {
        let newRank = currentProfile.rank;
        if (completedCount >= 5 && currentProfile.rank !== 'SYSTEM ARCHITECT') {
            newRank = 'SYSTEM ARCHITECT';
        } else if (completedCount >= 3 && currentProfile.rank === 'SCRIPT KIDDIE') {
            newRank = 'PILOT';
        } else if (completedCount >= 1 && currentProfile.rank === 'SCRIPT KIDDIE') {
            newRank = 'NEOPHYTE';
        }

        if (newRank !== currentProfile.rank) {
            saveProfile({ ...currentProfile, rank: newRank });
            return true;
        }
        return false;
    }, [saveProfile]);

    return {
        profile,
        loading,
        saveProfile,
        addCredits,
        purchaseItem,
        updateStats,
        unlockAchievement,
        evaluateRank
    };
};
