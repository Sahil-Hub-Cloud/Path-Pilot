export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { adminDb as db } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
    try {
        const { institutionId, cohortId, title, description, scheduledAt, durationMinutes } = await req.json();

        if (!institutionId || !title || !scheduledAt) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const examRef = await db.collection('exams').add({
            institution_id: institutionId,
            cohort_id: cohortId,
            title: title,
            description: description,
            scheduled_at: scheduledAt,
            duration_minutes: durationMinutes || 60,
            is_active: true
        });

        return NextResponse.json({ success: true, exam: { id: examRef.id } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const institutionId = searchParams.get('institutionId');
        const cohortId = searchParams.get('cohortId');

        let query = db.collection('exams').where('is_active', '==', true);

        if (institutionId) {
            query = query.where('institution_id', '==', institutionId);
        } else if (cohortId) {
            query = query.where('cohort_id', '==', cohortId);
        } else {
            return NextResponse.json({ error: 'Missing filter (institutionId or cohortId)' }, { status: 400 });
        }

        const snapshot = await query.orderBy('scheduled_at', 'asc').get();
        const exams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return NextResponse.json({ success: true, exams });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
