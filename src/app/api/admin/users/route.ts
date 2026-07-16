export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { adminDb as db } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
    try {
        const { requireRole, assignRole } = await import('@/lib/rbac');
        const { CohortService } = await import('@/lib/services/cohort-service');
        const body = await req.json();
        const { userId, action } = body;

        const { authorized, institutionId } = await requireRole(userId, 'hod', 'admin');
        if (!authorized || !institutionId) {
            return NextResponse.json({ error: 'Unauthorized. HOD or Admin required.' }, { status: 403 });
        }

        if (action === 'bulk_invite') {
            const { students, cohortId } = body;

            if (!students || !Array.isArray(students) || students.length === 0) {
                return NextResponse.json({ error: 'No students provided' }, { status: 400 });
            }

            const snapshot = await db.collection('seats').where('institution_id', '==', institutionId).limit(1).get();
            if (!snapshot.empty) {
                const seatData = snapshot.docs[0].data();
                if (seatData.used_seats + students.length > seatData.total_seats) {
                    return NextResponse.json({
                        error: `Seat limit exceeded. Available: ${seatData.total_seats - seatData.used_seats}, Requested: ${students.length}`,
                    }, { status: 400 });
                }
            }

            const results: { email: string; status: string; userId?: string }[] = [];

            for (const student of students) {
                try {
                    const placeholderUserId = `invite_${student.email.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}`;
                    await assignRole(placeholderUserId, 'student', institutionId, student.email);
                    if (cohortId) {
                        await CohortService.addStudents(cohortId, [placeholderUserId]);
                    }
                    results.push({ email: student.email, status: 'invited', userId: placeholderUserId });
                } catch (e: any) {
                    results.push({ email: student.email, status: `failed: ${e.message}` });
                }
            }

            return NextResponse.json({
                success: true,
                invited: results.filter(r => r.status === 'invited').length,
                failed: results.filter(r => r.status !== 'invited').length,
                results,
            });
        }

        if (action === 'add_faculty') {
            const { facultyUserId } = body;
            if (!facultyUserId) {
                return NextResponse.json({ error: 'facultyUserId required' }, { status: 400 });
            }
            await assignRole(facultyUserId, 'faculty', institutionId);
            return NextResponse.json({ success: true, message: 'Faculty role assigned' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        console.error('Admin Users API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { requireRole } = await import('@/lib/rbac');
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        const { authorized, institutionId } = await requireRole(userId, 'faculty', 'hod', 'admin');
        if (!authorized || !institutionId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const snapshot = await db.collection('user_roles').where('institution_id', '==', institutionId).get();
        const users = await Promise.all(snapshot.docs.map(async doc => {
            const r = doc.data();
            let cohort = 'Unassigned';
            const memberSnap = await db.collection('cohort_members').where('user_id', '==', r.user_id).get();
            if (!memberSnap.empty) {
                const cohortId = memberSnap.docs[0].data().cohort_id;
                const cohortDoc = await db.collection('cohorts').doc(cohortId).get();
                if (cohortDoc.exists) cohort = cohortDoc.data()?.name || cohort;
            }
            return {
                user_id: r.user_id,
                role: r.role,
                created_at: r.created_at,
                email: r.invited_email,
                cohort
            };
        }));

        return NextResponse.json({ success: true, users });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
