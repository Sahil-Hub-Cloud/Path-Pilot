export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

/**
 * Exams API — Schedule and manage corporate assessments
 */
export async function POST(req: NextRequest) {
    try {
        const { institutionId, cohortId, title, description, scheduledAt, durationMinutes } = await req.json();

        if (!institutionId || !title || !scheduledAt) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('exams')
            .insert({
                institution_id: institutionId,
                cohort_id: cohortId,
                title: title,
                description: description,
                scheduled_at: scheduledAt,
                duration_minutes: durationMinutes || 60
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, exam: data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const institutionId = searchParams.get('institutionId');
        const cohortId = searchParams.get('cohortId');

        let query = supabase.from('exams').select('*').eq('is_active', true);

        if (institutionId) {
            query = query.eq('institution_id', institutionId);
        } else if (cohortId) {
            query = query.eq('cohort_id', cohortId);
        } else {
            return NextResponse.json({ error: 'Missing filter (institutionId or cohortId)' }, { status: 400 });
        }

        const { data, error } = await query.order('scheduled_at', { ascending: true });

        if (error) throw error;

        return NextResponse.json({ success: true, exams: data || [] });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

