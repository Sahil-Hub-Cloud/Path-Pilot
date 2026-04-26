'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UserStats {
    energy: number;
    credits: number;
    streak: number;
    labsCompleted: number;
    completedModuleIds: number[];
    lastRegenTimestamp: number; // For passive recovery
    isGhostMode: boolean; // Focus Lock Mode
    mintedCerts: any[]; // Blockchain verified certificates
}

export function useUserStats() {
    const [stats, setStats] = useState<UserStats>({
        energy: 100,
        credits: 50,
        streak: 1,
        labsCompleted: 0,
        completedModuleIds: [],
        lastRegenTimestamp: Date.now(),
        isGhostMode: false,
        mintedCerts: []
    });

    const getCostMultiplier = () => {
        if (stats.isGhostMode) return 1.0; // Standard cost during focus lock
        const hour = new Date().getHours();
        if (hour >= 23 || hour < 5) return 2.5; // Graveyard Penalty
        if (hour >= 9 && hour < 13) return 0.8; // Golden Window
        return 1.0;
    };

    const calculateRegen = useCallback((currentStats: UserStats): UserStats => {
        const now = Date.now();
        const elapsedHours = (now - currentStats.lastRegenTimestamp) / (1000 * 60 * 60);

        // Ghost Mode Multiplier: 1.5x regen
        const baseRegen = 10;
        const multiplier = currentStats.isGhostMode ? 1.5 : 1.0;
        const regenAmount = Math.floor(elapsedHours * baseRegen * multiplier);

        if (regenAmount >= 1) {
            return {
                ...currentStats,
                energy: Math.min(100, currentStats.energy + regenAmount),
                lastRegenTimestamp: now
            };
        }
        return currentStats;
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem('pathpilot_user_stats');
        let currentStats = stats;

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Ensure all fields exist
                currentStats = {
                    ...stats,
                    ...parsed,
                    isGhostMode: parsed.isGhostMode ?? false,
                    mintedCerts: parsed.mintedCerts ?? []
                };
            } catch (e) {
                console.error("Failed to parse user stats");
            }
        }

        // Apply passive regen on initialization
        const updated = calculateRegen(currentStats);
        setStats(updated);
        localStorage.setItem('pathpilot_user_stats', JSON.stringify(updated));

        // Setup regen interval (check every minute)
        const interval = setInterval(() => {
            setStats(prev => {
                const afterRegen = calculateRegen(prev);
                if (afterRegen !== prev) {
                    localStorage.setItem('pathpilot_user_stats', JSON.stringify(afterRegen));
                }
                return afterRegen;
            });
        }, 60000);

        return () => clearInterval(interval);
    }, [calculateRegen]);

    const spendEnergy = (amount: number) => {
        const multiplier = getCostMultiplier();
        const finalAmount = Math.round(amount * multiplier);

        setStats(prev => {
            const newStats = { ...prev, energy: Math.max(0, prev.energy - finalAmount) };
            localStorage.setItem('pathpilot_user_stats', JSON.stringify(newStats));
            return newStats;
        });
    };

    const addCredits = (amount: number) => {
        const multiplier = stats.isGhostMode ? 1.5 : 1.0;
        const finalAmount = Math.round(amount * multiplier);

        setStats(prev => {
            const newStats = { ...prev, credits: prev.credits + finalAmount };
            localStorage.setItem('pathpilot_user_stats', JSON.stringify(newStats));
            return newStats;
        });
    };

    const toggleGhostMode = () => {
        setStats(prev => {
            const newStats = { ...prev, isGhostMode: !prev.isGhostMode };
            localStorage.setItem('pathpilot_user_stats', JSON.stringify(newStats));
            return newStats;
        });
    };

    const recordMintedCert = (cert: any) => {
        setStats(prev => {
            const newStats = { ...prev, mintedCerts: [...(prev.mintedCerts || []), cert] };
            localStorage.setItem('pathpilot_user_stats', JSON.stringify(newStats));
            return newStats;
        });
    };

    const completeModule = (id: number) => {
        if (!stats.completedModuleIds.includes(id)) {
            const multiplier = stats.isGhostMode ? 1.5 : 1.0;
            const creditReward = Math.round(50 * multiplier);

            setStats(prev => {
                const newStats = {
                    ...prev,
                    completedModuleIds: [...prev.completedModuleIds, id],
                    credits: prev.credits + creditReward,
                    labsCompleted: prev.labsCompleted + 1,
                };
                localStorage.setItem('pathpilot_user_stats', JSON.stringify(newStats));
                return newStats;
            });
        }
    };

    return {
        stats,
        spendEnergy,
        addCredits,
        completeModule,
        toggleGhostMode,
        recordMintedCert,
        costMultiplier: getCostMultiplier()
    };
}
