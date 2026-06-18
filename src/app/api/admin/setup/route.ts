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
 * Admin Setup API — Creates institution + assigns HOD role
 * Called during first-time institution registration
 */
export async function POST(req: NextRequest) {
    try {
        const database = await getDb();
        const { supabaseAdmin: supabase } = await import('@/lib/supabase-admin');
        const { userId, email, institutionName } = await req.json();

        if (!userId || !email || !institutionName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Create institution
        const { data: institution, error: instError } = await supabase
            .from('institutions')
            .insert({
                name: institutionName,
                domain: email.split('@')[1] || null,
                created_by: userId,
            })
            .select()
            .single();

        if (instError) throw instError;

        // 2. Assign HOD role
        const { error: roleError } = await supabase
            .from('user_roles')
            .upsert({
                user_id: userId,
                role: 'hod',
                institution_id: institution.id,
            });

        if (roleError) throw roleError;

        // 3. Initialize seats
        const { error: seatError } = await supabase
            .from('seats')
            .insert({
                institution_id: institution.id,
                total_seats: 50,
                used_seats: 0,
            });

        if (seatError) console.warn('Seat init warning:', seatError);

        return NextResponse.json({
            success: true,
            institution: {
                id: institution.id,
                name: institution.name,
            },
        });
    } catch (error: any) {
        console.error('Admin Setup Error:', error);
        return NextResponse.json({ error: error.message || 'Setup failed' }, { status: 500 });
    }
}

