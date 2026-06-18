export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { auth } from '@/lib/firebase-admin';

/**
 * Certificate Hash Generator
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
      await auth.verifyIdToken(authHeader.split('Bearer ')[1]);
    } catch (e) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const { studentId, courseId } = await req.json();

    if (!studentId || !courseId) {
      return NextResponse.json({ error: 'studentId and courseId are required' }, { status: 400 });
    }

    // Generate unique SHA256 hash
    const hash = crypto
      .createHash('sha256')
      .update(`${studentId}-${courseId}-${Date.now()}`)
      .digest('hex');

    // Save to mastery_proofs (using Supabase Admin for system-level save)
    const { data, error } = await supabase
      .from('student_skills')
      .update({ 
        certificate_hash: hash,
        course_completed: true,
        ai_score: 92 // Mock score for now
      })
      .eq('id', studentId);

    if (error) {
       // If student_skills row doesn't exist, create it (Upsert)
       await supabase.from('student_skills').upsert({
           id: studentId,
           certificate_hash: hash,
           course_completed: true,
           ai_score: 92
       });
    }

    return NextResponse.json({ certificateId: hash, hash });

  } catch (error: any) {
    console.error('Certificate Generator Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

