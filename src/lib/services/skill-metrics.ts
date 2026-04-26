import { supabase } from '../supabase';

export interface SkillMetrics {
    id?: string;
    user_id: string;
    python_syntax_score: number;
    javascript_syntax_score: number;
    logic_reasoning_score: number;
    debugging_score: number;
    prompt_quality_score: number;
    total_runs: number;
    successful_runs: number;
    total_errors: number;
    hints_used: number;
    challenges_completed: number;
    debug_challenges_solved: number;
    last_updated?: string;
}

export interface SkillDelta {
    syntax?: number;
    logic?: number;
    debugging?: number;
    prompt_quality?: number;
}

const DEFAULT_METRICS: Omit<SkillMetrics, 'user_id'> = {
    python_syntax_score: 0,
    javascript_syntax_score: 0,
    logic_reasoning_score: 0,
    debugging_score: 0,
    prompt_quality_score: 0,
    total_runs: 0,
    successful_runs: 0,
    total_errors: 0,
    hints_used: 0,
    challenges_completed: 0,
    debug_challenges_solved: 0,
};

export class SkillMetricsService {
    private static STORAGE_KEY = 'pathpilot_skill_metrics';

    /**
     * Get skill metrics for a user. Falls back to localStorage if Supabase is unavailable.
     */
    static async getMetrics(userId: string): Promise<SkillMetrics> {
        if (!userId || userId === 'guest') {
            return { user_id: 'guest', ...DEFAULT_METRICS };
        }

        // Try Supabase first
        try {
            const { data, error } = await supabase
                .from('user_skill_metrics')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle();

            if (!error && data) return data as SkillMetrics;
        } catch (e) {
            console.warn('Supabase skill metrics fetch failed:', e);
        }

        // Fallback to localStorage
        try {
            if (typeof window === 'undefined') return { user_id: userId, ...DEFAULT_METRICS };
            const cache = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
            if (cache[userId]) return cache[userId];
        } catch (e) {
            console.warn('Local cache read failed:', e);
        }

        return { user_id: userId, ...DEFAULT_METRICS };
    }

    /**
     * Update skill metrics with deltas from a scoring event.
     */
    static async updateMetrics(
        userId: string,
        language: string,
        update: {
            syntaxDelta?: number;
            logicScore?: number;
            debuggingDelta?: number;
            promptDelta?: number;
            ranSuccessfully?: boolean;
            hadErrors?: boolean;
            usedHint?: boolean;
            completedChallenge?: boolean;
            solvedDebugChallenge?: boolean;
        }
    ): Promise<SkillDelta> {
        const current = await this.getMetrics(userId);
        const delta: SkillDelta = {};

        // Apply syntax delta (capped at 1.0)
        const syntaxKey = language === 'python' ? 'python_syntax_score' : 'javascript_syntax_score';
        if (update.syntaxDelta) {
            const oldScore = current[syntaxKey as keyof SkillMetrics] as number;
            const newScore = Math.min(1.0, Math.max(0, oldScore + update.syntaxDelta));
            (current as any)[syntaxKey] = newScore;
            delta.syntax = +(newScore - oldScore).toFixed(3);
        }

        // Apply logic score (replace, not delta — based on hint usage)
        if (update.logicScore !== undefined) {
            const oldLogic = current.logic_reasoning_score;
            // Weighted moving average: 70% new, 30% old
            current.logic_reasoning_score = +(oldLogic * 0.3 + update.logicScore * 0.7).toFixed(3);
            delta.logic = +(current.logic_reasoning_score - oldLogic).toFixed(3);
        }

        // Apply debugging delta (capped at 1.0)
        if (update.debuggingDelta) {
            const oldDebug = current.debugging_score;
            current.debugging_score = Math.min(1.0, Math.max(0, oldDebug + update.debuggingDelta));
            delta.debugging = +(current.debugging_score - oldDebug).toFixed(3);
        }

        // Apply prompt quality delta (capped at 1.0)
        if (update.promptDelta) {
            const oldPrompt = current.prompt_quality_score;
            current.prompt_quality_score = Math.min(1.0, Math.max(0, oldPrompt + update.promptDelta));
            delta.prompt_quality = +(current.prompt_quality_score - oldPrompt).toFixed(3);
        }

        // Activity counters
        current.total_runs += 1;
        if (update.ranSuccessfully) current.successful_runs += 1;
        if (update.hadErrors) current.total_errors += 1;
        if (update.usedHint) current.hints_used += 1;
        if (update.completedChallenge) current.challenges_completed += 1;
        if (update.solvedDebugChallenge) current.debug_challenges_solved += 1;

        // Persist to localStorage (always)
        try {
            if (typeof window !== 'undefined') {
                const cache = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
                cache[userId] = { ...current, last_updated: new Date().toISOString() };
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cache));
            }
        } catch (e) {
            console.warn('LocalStorage save failed:', e);
        }

        // Persist to Supabase (best effort)
        try {
            await supabase
                .from('user_skill_metrics')
                .upsert({
                    user_id: userId,
                    python_syntax_score: current.python_syntax_score,
                    javascript_syntax_score: current.javascript_syntax_score,
                    logic_reasoning_score: current.logic_reasoning_score,
                    debugging_score: current.debugging_score,
                    prompt_quality_score: current.prompt_quality_score,
                    total_runs: current.total_runs,
                    successful_runs: current.successful_runs,
                    total_errors: current.total_errors,
                    hints_used: current.hints_used,
                    challenges_completed: current.challenges_completed,
                    debug_challenges_solved: current.debug_challenges_solved,
                    last_updated: new Date().toISOString(),
                });
        } catch (e) {
            console.warn('Supabase skill metrics update failed (data saved locally):', e);
        }

        return delta;
    }

    /**
     * Get aggregated class report for HOD dashboard.
     */
    static async getClassReport(): Promise<{
        totalStudents: number;
        averages: Record<string, number>;
        atRisk: SkillMetrics[];
    }> {
        try {
            const { data, error } = await supabase
                .from('user_skill_metrics')
                .select('*');

            if (error || !data || data.length === 0) {
                return { totalStudents: 0, averages: {}, atRisk: [] };
            }

            const totalStudents = data.length;
            const sum = (key: string) =>
                data.reduce((acc, d) => acc + ((d as any)[key] || 0), 0) / totalStudents;

            const averages = {
                python_syntax: +sum('python_syntax_score').toFixed(3),
                javascript_syntax: +sum('javascript_syntax_score').toFixed(3),
                logic_reasoning: +sum('logic_reasoning_score').toFixed(3),
                debugging: +sum('debugging_score').toFixed(3),
                prompt_quality: +sum('prompt_quality_score').toFixed(3),
            };

            // At-risk: students with logic OR debugging below 0.4
            const atRisk = data.filter(
                (d: any) => d.logic_reasoning_score < 0.4 || d.debugging_score < 0.4
            ) as SkillMetrics[];

            return { totalStudents, averages, atRisk };
        } catch (e) {
            console.error('Class report generation failed:', e);
            return { totalStudents: 0, averages: {}, atRisk: [] };
        }
    }
}
