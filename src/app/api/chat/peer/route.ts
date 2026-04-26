import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

/**
 * Peer Chat API — Real-time communication for interns within a cohort
 */
export async function POST(req: NextRequest) {
    try {
        const { cohortId, userId, userName, message } = await req.json();

        if (!cohortId || !userId || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('peer_messages')
            .insert({
                cohort_id: cohortId,
                user_id: userId,
                user_name: userName || 'Anonymous Intern',
                message: message
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, message: data });
    } catch (error: any) {
        console.error('Peer Chat POST Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const cohortId = searchParams.get('cohortId');

        if (!cohortId) {
            return NextResponse.json({ error: 'cohortId required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('peer_messages')
            .select('*')
            .eq('cohort_id', cohortId)
            .order('created_at', { ascending: true })
            .limit(50);

        if (error) throw error;

        return NextResponse.json({ success: true, messages: data || [] });
    } catch (error: any) {
        console.error('Peer Chat GET Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
