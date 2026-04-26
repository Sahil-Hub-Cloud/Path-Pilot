import { supabase } from '../supabase';
import { SkillMetrics, SkillMetricsService } from './skill-metrics';

export interface CohortAnalytics {
    cohortId: string;
    cohortName: string;
    totalStudents: number;
    averages: {
        python_syntax: number;
        javascript_syntax: number;
        logic_reasoning: number;
        debugging: number;
        prompt_quality: number;
        readiness: number;
    };
    atRiskStudents: AtRiskStudent[];
    topPerformers: TopPerformer[];
    engagement: EngagementMetrics;
}

export interface AtRiskStudent {
    user_id: string;
    logic_score: number;
    debugging_score: number;
    total_runs: number;
    risk_reason: string;
}

export interface TopPerformer {
    user_id: string;
    readiness_score: number;
    challenges_completed: number;
}

export interface EngagementMetrics {
    avg_total_runs: number;
    avg_successful_runs: number;
    avg_challenges_completed: number;
    avg_debug_challenges_solved: number;
    total_hints_used: number;
}

export class AnalyticsEngine {
    /**
     * Get analytics for a specific cohort.
     */
    static async getCohortAnalytics(cohortId: string): Promise<CohortAnalytics | null> {
        try {
            // 1. Get cohort info
            const { data: cohort } = await supabase
                .from('cohorts')
                .select('id, name')
                .eq('id', cohortId)
                .single();

            if (!cohort) return null;

            // 2. Get cohort members
            const { data: members } = await supabase
                .from('cohort_members')
                .select('user_id')
                .eq('cohort_id', cohortId);

            if (!members || members.length === 0) {
                return {
                    cohortId: cohort.id,
                    cohortName: cohort.name,
                    totalStudents: 0,
                    averages: { python_syntax: 0, javascript_syntax: 0, logic_reasoning: 0, debugging: 0, prompt_quality: 0, readiness: 0 },
                    atRiskStudents: [],
                    topPerformers: [],
                    engagement: { avg_total_runs: 0, avg_successful_runs: 0, avg_challenges_completed: 0, avg_debug_challenges_solved: 0, total_hints_used: 0 },
                };
            }

            const userIds = members.map(m => m.user_id);

            // 3. Get skill metrics for all members
            const { data: metrics } = await supabase
                .from('user_skill_metrics')
                .select('*')
                .in('user_id', userIds);

            const allMetrics = (metrics || []) as SkillMetrics[];
            const totalStudents = allMetrics.length || 1;

            // 4. Compute averages
            const avg = (key: keyof SkillMetrics) =>
                +(allMetrics.reduce((sum, m) => sum + (Number(m[key]) || 0), 0) / totalStudents).toFixed(3);

            const averages = {
                python_syntax: avg('python_syntax_score'),
                javascript_syntax: avg('javascript_syntax_score'),
                logic_reasoning: avg('logic_reasoning_score'),
                debugging: avg('debugging_score'),
                prompt_quality: avg('prompt_quality_score'),
                readiness: +(
                    avg('logic_reasoning_score') * 0.35 +
                    avg('debugging_score') * 0.25 +
                    avg('javascript_syntax_score') * 0.20 +
                    avg('prompt_quality_score') * 0.20
                ).toFixed(3),
            };

            // 5. At-risk students (logic OR debugging below 0.4)
            const atRiskStudents: AtRiskStudent[] = allMetrics
                .filter(m => m.logic_reasoning_score < 0.4 || m.debugging_score < 0.4)
                .map(m => ({
                    user_id: m.user_id,
                    logic_score: m.logic_reasoning_score,
                    debugging_score: m.debugging_score,
                    total_runs: m.total_runs,
                    risk_reason: m.logic_reasoning_score < 0.4 && m.debugging_score < 0.4
                        ? 'Low logic & debugging'
                        : m.logic_reasoning_score < 0.4 ? 'Low logic reasoning' : 'Low debugging',
                }));

            // 6. Top performers (readiness > 0.7)
            const topPerformers: TopPerformer[] = allMetrics
                .map(m => ({
                    user_id: m.user_id,
                    readiness_score: +(
                        m.logic_reasoning_score * 0.35 +
                        m.debugging_score * 0.25 +
                        m.javascript_syntax_score * 0.20 +
                        m.prompt_quality_score * 0.20
                    ).toFixed(3),
                    challenges_completed: m.challenges_completed,
                }))
                .filter(p => p.readiness_score >= 0.7)
                .sort((a, b) => b.readiness_score - a.readiness_score)
                .slice(0, 10);

            // 7. Engagement metrics
            const engagement: EngagementMetrics = {
                avg_total_runs: +(allMetrics.reduce((s, m) => s + m.total_runs, 0) / totalStudents).toFixed(1),
                avg_successful_runs: +(allMetrics.reduce((s, m) => s + m.successful_runs, 0) / totalStudents).toFixed(1),
                avg_challenges_completed: +(allMetrics.reduce((s, m) => s + m.challenges_completed, 0) / totalStudents).toFixed(1),
                avg_debug_challenges_solved: +(allMetrics.reduce((s, m) => s + m.debug_challenges_solved, 0) / totalStudents).toFixed(1),
                total_hints_used: allMetrics.reduce((s, m) => s + m.hints_used, 0),
            };

            return {
                cohortId: cohort.id,
                cohortName: cohort.name,
                totalStudents: members.length,
                averages,
                atRiskStudents,
                topPerformers,
                engagement,
            };
        } catch (e) {
            console.error('AnalyticsEngine: Cohort analytics failed:', e);
            return null;
        }
    }

    /**
     * Get aggregated analytics for an entire institution (all cohorts).
     */
    static async getInstitutionAnalytics(institutionId: string): Promise<{
        totalCohorts: number;
        totalStudents: number;
        averageReadiness: number;
        atRiskCount: number;
        cohortBreakdown: { cohortId: string; name: string; studentCount: number; avgReadiness: number }[];
    }> {
        try {
            // Get all cohorts
            const { data: cohorts } = await supabase
                .from('cohorts')
                .select('id, name')
                .eq('institution_id', institutionId)
                .eq('is_active', true);

            if (!cohorts || cohorts.length === 0) {
                return { totalCohorts: 0, totalStudents: 0, averageReadiness: 0, atRiskCount: 0, cohortBreakdown: [] };
            }

            let totalStudents = 0;
            let totalReadiness = 0;
            let atRiskCount = 0;
            const cohortBreakdown: { cohortId: string; name: string; studentCount: number; avgReadiness: number }[] = [];

            for (const cohort of cohorts) {
                const analytics = await this.getCohortAnalytics(cohort.id);
                if (analytics) {
                    totalStudents += analytics.totalStudents;
                    totalReadiness += analytics.averages.readiness * analytics.totalStudents;
                    atRiskCount += analytics.atRiskStudents.length;
                    cohortBreakdown.push({
                        cohortId: cohort.id,
                        name: cohort.name,
                        studentCount: analytics.totalStudents,
                        avgReadiness: analytics.averages.readiness,
                    });
                }
            }

            return {
                totalCohorts: cohorts.length,
                totalStudents,
                averageReadiness: totalStudents > 0 ? +(totalReadiness / totalStudents).toFixed(3) : 0,
                atRiskCount,
                cohortBreakdown,
            };
        } catch (e) {
            console.error('AnalyticsEngine: Institution analytics failed:', e);
            return { totalCohorts: 0, totalStudents: 0, averageReadiness: 0, atRiskCount: 0, cohortBreakdown: [] };
        }
    }
}
