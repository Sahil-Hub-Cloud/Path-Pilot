export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { SkillMetricsService } from '@/lib/services/skill-metrics';

/**
 * HOD Skill Report API
 * 
 * Returns aggregated class-wide skill data for college administrators.
 * This is the B2B data visibility layer — what colleges pay for.
 */
export async function GET() {
    try {
        const report = await SkillMetricsService.getClassReport();

        return NextResponse.json({
            success: true,
            report: {
                totalStudents: report.totalStudents,
                averages: report.averages,
                atRiskCount: report.atRisk.length,
                atRiskStudents: report.atRisk.map(s => ({
                    user_id: s.user_id,
                    logic: s.logic_reasoning_score,
                    debugging: s.debugging_score,
                    syntax_js: s.javascript_syntax_score,
                    syntax_py: s.python_syntax_score,
                    prompt: s.prompt_quality_score,
                    total_runs: s.total_runs,
                })),
                generatedAt: new Date().toISOString(),
            }
        });
    } catch (error) {
        console.error('Skill Report Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to generate skill report' },
            { status: 500 }
        );
    }
}

