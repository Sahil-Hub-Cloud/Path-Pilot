// TOP OF FILE - NO IMPORTS THAT INITIALIZE FIREBASE
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

// Lazy initialization - only runs when request comes in
let db: any = null;

async function getDb() {
  if (db) return db;
  
  const admin = await import('firebase-admin');
  
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      }),
    });
  }
  
  db = admin.firestore();
  return db;
}

/**
 * Admin Cohort API — Create, list, update, delete cohorts
 */
export async function POST(req: NextRequest) {
    try {
        const database = await getDb();
        const { requireRole } = await import('@/lib/rbac');
        const { CohortService } = await import('@/lib/services/cohort-service');
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
        const database = await getDb();
        const { requireRole } = await import('@/lib/rbac');
        const { CohortService } = await import('@/lib/services/cohort-service');
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
        const database = await getDb();
        const { requireRole } = await import('@/lib/rbac');
        const { CohortService } = await import('@/lib/services/cohort-service');
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
        const database = await getDb();
        const { requireRole } = await import('@/lib/rbac');
        const { CohortService } = await import('@/lib/services/cohort-service');
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

