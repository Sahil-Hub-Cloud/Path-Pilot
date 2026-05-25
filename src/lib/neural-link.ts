import { useState, useEffect } from 'react';

export interface Unit {
    id: number;
    name: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    estimatedTime: string;
    status: 'not-started' | 'in-progress' | 'completed';
    retentionScore: number;
}

export interface NeuralLinkState {
    calendar: { connected: boolean; mockData: boolean };
    health: { connected: boolean; mockData: boolean };
    notion: { connected: boolean; mockData: boolean };
    youtube: { connected: boolean; mockData: boolean };
    pdf: { connected: boolean; mockData: boolean };
}

const DEFAULT_STATE: NeuralLinkState = {
    calendar: { connected: false, mockData: true },
    health: { connected: false, mockData: true },
    notion: { connected: false, mockData: true },
    youtube: { connected: false, mockData: true },
    pdf: { connected: false, mockData: true },
};

export function useNeuralLink() {
    const [mounted, setMounted] = useState(false);
    const [integrations, setIntegrations] = useState<NeuralLinkState>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('neural-link-state');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    console.error("Neural Link state corrupt", e);
                }
            }
        }
        return DEFAULT_STATE;
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleIntegration = (key: keyof NeuralLinkState) => {
        setIntegrations(prev => {
            const next = {
                ...prev,
                [key]: { ...prev[key], connected: !prev[key].connected }
            };
            // Persist to storage
            localStorage.setItem('neural-link-state', JSON.stringify(next));
            return next;
        });
    };

    return {
        integrations,
        toggleIntegration,
        mounted
    };
}
