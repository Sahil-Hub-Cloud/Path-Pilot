import { useState, useEffect } from 'react';

export interface LeaderboardEntry {
    rank: number;
    name: string;
    score: number;
    active?: boolean;
    isBot?: boolean;
}

interface BotPlayer {
    name: string;
    baseScore: number;
    growthRate: number; // XP per hour
}

const BOT_PLAYERS: BotPlayer[] = [
    { name: 'Pilot_Zero', baseScore: 9940, growthRate: 50 },
    { name: 'Neo_Student', baseScore: 8200, growthRate: 35 },
    { name: 'Cyber_Socrates', baseScore: 4100, growthRate: 25 },
];

export function useLeaderboard(username: string, userScore: number) {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const storageKey = 'leaderboard_bots';
        const now = Date.now();
        const botStates = localStorage.getItem(storageKey);
        let parsedBots: { [key: string]: { score: number; lastUpdate: number } } = {};

        if (botStates) {
            try {
                parsedBots = JSON.parse(botStates);
            } catch {
                console.error("Leaderboard data corrupt");
            }
        }

        // Ensure all bots exist
        BOT_PLAYERS.forEach(bot => {
            if (!parsedBots[bot.name]) {
                parsedBots[bot.name] = { score: bot.baseScore, lastUpdate: now };
            }
        });

        // Update bot scores
        BOT_PLAYERS.forEach(bot => {
            const state = parsedBots[bot.name];
            const hoursElapsed = (now - state.lastUpdate) / (1000 * 60 * 60);
            if (hoursElapsed > 0.1) {
                const xpGained = Math.floor(hoursElapsed * bot.growthRate);
                const newScore = Math.min(50000, state.score + xpGained);
                parsedBots[bot.name] = { score: newScore, lastUpdate: now };
            }
        });

        localStorage.setItem(storageKey, JSON.stringify(parsedBots));

        const newEntries: LeaderboardEntry[] = [
            ...BOT_PLAYERS.map(bot => ({
                rank: 0,
                name: bot.name,
                score: parsedBots[bot.name].score,
                isBot: true
            })),
            {
                rank: 0,
                name: username || 'You',
                score: userScore,
                active: true
            }
        ];

        newEntries.sort((a, b) => b.score - a.score);
        newEntries.forEach((entry, index) => {
            entry.rank = index + 1;
        });

        setEntries(newEntries);
    }, [username, userScore]);

    return entries;
}
