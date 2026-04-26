import { InsightCard } from './mock-data';

interface UserState {
    energy: number;
    credits: number;
    completedModules: number;
    totalModules: number;
    lastActivityTime?: number;
}

export function generateAdaptiveInsights(state: UserState): InsightCard[] {
    const insights: InsightCard[] = [];
    const now = Date.now();

    // Burnout Detection
    if (state.energy < 20) {
        insights.push({
            id: now + 1,
            type: 'risk',
            title: 'Critical: Energy Depletion Detected',
            message: `Your cognitive reserves are at ${state.energy}%. Neural pathways require restoration. Consider purchasing a Neural Reboot or taking a break.`,
            timestamp: new Date().toISOString(),
            context: `Recovery Recommendation: 4-6 hours rest or 500♦ Neural Reboot`,
            confidence: 0.95
        });
    }

    // High Performance Recognition
    const masteryPercent = Math.floor((state.completedModules / state.totalModules) * 100);
    if (masteryPercent > 60) {
        insights.push({
            id: now + 2,
            type: 'strength',
            title: 'Accelerated Learning Pattern',
            message: `You've completed ${state.completedModules}/${state.totalModules} modules (${masteryPercent}%). This velocity places you in the top 15% of operators.`,
            timestamp: new Date().toISOString(),
            context: `Projection: Certification ready in ${Math.ceil((state.totalModules - state.completedModules) * 2)} days`,
            confidence: 0.89
        });
    }

    // Credit Accumulation
    if (state.credits > 2000) {
        insights.push({
            id: now + 3,
            type: 'suggestion',
            title: 'Investment Opportunity',
            message: `You have ${state.credits}♦ available. Consider unlocking premium features like Socrates Pro for unlimited AI assistance.`,
            timestamp: new Date().toISOString(),
            context: 'ROI Analysis: Premium tools reduce completion time by 30%',
            confidence: 0.78
        });
    }

    // Inactivity Warning
    if (state.lastActivityTime) {
        const hoursSinceActivity = (now - state.lastActivityTime) / (1000 * 60 * 60);
        if (hoursSinceActivity > 48) {
            insights.push({
                id: now + 4,
                type: 'risk',
                title: 'Retention Decay Alert',
                message: `${Math.floor(hoursSinceActivity)} hours since last session. Knowledge retention drops 12% per day of inactivity.`,
                timestamp: new Date().toISOString(),
                context: 'Recommended Action: Quick review session (15 min)',
                confidence: 0.91
            });
        }
    }

    // Low Energy but High Progress
    if (state.energy < 40 && masteryPercent > 50) {
        insights.push({
            id: now + 5,
            type: 'pattern',
            title: 'Sustainable Pace Advisory',
            message: 'Your progress is excellent, but energy levels suggest overexertion. Elite operators balance intensity with recovery.',
            timestamp: new Date().toISOString(),
            context: 'Optimal Strategy: 80% effort, 20% rest',
            confidence: 0.85
        });
    }

    // Return top 3 most relevant
    return insights.slice(0, 3);
}
