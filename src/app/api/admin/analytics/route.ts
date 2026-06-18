export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { AnalyticsEngine } from '@/lib/services/analytics-engine';

/**
 * Admin Analytics API — Placement readiness scores, skill heatmaps, at-risk students
 * This is the core B2B value proposition — what colleges pay for.
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const cohortId = searchParams.get('cohortId');
        const scope = searchParams.get('scope') || 'cohort'; // 'cohort' | 'institution'

        // RBAC check
        const { authorized, institutionId } = await requireRole(userId, 'faculty', 'hod', 'admin');
        if (!authorized) {
            return NextResponse.json({ error: 'Unauthorized. Faculty or above required.' }, { status: 403 });
        }

        if (scope === 'institution' && institutionId) {
            const analytics = await AnalyticsEngine.getInstitutionAnalytics(institutionId);
            return NextResponse.json({
                success: true,
                scope: 'institution',
                analytics,
                generatedAt: new Date().toISOString(),
            });
        }

        if (scope === 'cohort' && cohortId) {
            const analytics = await AnalyticsEngine.getCohortAnalytics(cohortId);
            if (!analytics) {
                return NextResponse.json({ error: 'Cohort not found or no data' }, { status: 404 });
            }
            return NextResponse.json({
                success: true,
                scope: 'cohort',
                analytics,
                generatedAt: new Date().toISOString(),
            });
        }

        return NextResponse.json({ error: 'Provide cohortId or scope=institution' }, { status: 400 });
    } catch (error: any) {
        console.error('Admin Analytics API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
