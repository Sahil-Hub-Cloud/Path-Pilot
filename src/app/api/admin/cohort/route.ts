import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { CohortService } from '@/lib/services/cohort-service';

/**
 * Admin Cohort API — Create, list, update, delete cohorts
 */
export async function POST(req: NextRequest) {
    try {
        const { userId, name, courseId, description } = await req.json();

        const { authorized, institutionId } = await requireRole(userId, 'faculty', 'hod', 'admin');
        if (!authorized || !institutionId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        if (!name) {
            return NextResponse.json({ error: 'Cohort name is required' }, { status: 400 });
        }

        const cohort = await CohortService.createCohort(name, institutionId, userId, courseId, description);
        if (!cohort) {
            return NextResponse.json({ error: 'Failed to create cohort' }, { status: 500 });
        }

        return NextResponse.json({ success: true, cohort });
    } catch (error: any) {
        console.error('Admin Cohort API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        const { authorized, institutionId } = await requireRole(userId, 'faculty', 'hod', 'admin');
        if (!authorized || !institutionId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const cohorts = await CohortService.listCohorts(institutionId);
        return NextResponse.json({ success: true, cohorts });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { userId, cohortId, name, courseId, description, isActive } = await req.json();

        const { authorized } = await requireRole(userId, 'faculty', 'hod', 'admin');
        if (!authorized) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        if (!cohortId) {
            return NextResponse.json({ error: 'cohortId required' }, { status: 400 });
        }

        const updates: any = {};
        if (name !== undefined) updates.name = name;
        if (courseId !== undefined) updates.course_id = courseId;
        if (description !== undefined) updates.description = description;
        if (isActive !== undefined) updates.is_active = isActive;

        const success = await CohortService.updateCohort(cohortId, updates);
        return NextResponse.json({ success });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { userId, cohortId } = await req.json();

        const { authorized } = await requireRole(userId, 'hod', 'admin');
        if (!authorized) {
            return NextResponse.json({ error: 'Unauthorized. HOD or Admin required.' }, { status: 403 });
        }

        const success = await CohortService.deleteCohort(cohortId);
        return NextResponse.json({ success });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
