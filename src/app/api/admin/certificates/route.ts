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
 * Certificates API — Issue and retrieve corporate training credentials
 */
export async function POST(req: NextRequest) {
    try {
        const database = await getDb();
        const { supabaseAdmin: supabase } = await import('@/lib/supabase-admin');
        const { userId, cohortId, examId } = await req.json();

        if (!userId || !cohortId) {
            return NextResponse.json({ error: 'Missing userId or cohortId' }, { status: 400 });
        }

        // Check if certificate already exists
        const { data: existing } = await supabase
            .from('certificates')
            .select('*')
            .eq('user_id', userId)
            .eq('cohort_id', cohortId)
            .maybeSingle();

        if (existing) {
            return NextResponse.json({ success: true, certificate: existing, message: 'Already issued' });
        }

        const { data, error } = await supabase
            .from('certificates')
            .insert({
                user_id: userId,
                cohort_id: cohortId,
                exam_id: examId,
                certificate_url: `/certificate/${Math.random().toString(36).substr(2, 9)}` // Mock URL for now
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, certificate: data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const database = await getDb();
        const { supabaseAdmin: supabase } = await import('@/lib/supabase-admin');
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'userId required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('certificates')
            .select(`
                *,
                cohorts (name)
            `)
            .eq('user_id', userId);

        if (error) throw error;

        return NextResponse.json({ success: true, certificates: data || [] });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

