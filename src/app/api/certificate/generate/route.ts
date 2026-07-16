export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminAuth as auth, adminDb as db } from '@/lib/firebase-admin';

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

    const hash = crypto.createHash('sha256').update(`${studentId}-${courseId}-${Date.now()}`).digest('hex');

    await db.collection('student_skills').doc(studentId).set({
      id: studentId,
      certificate_hash: hash,
      course_completed: true,
      ai_score: 92
    }, { merge: true });

    return NextResponse.json({ certificateId: hash, hash });

  } catch (error: any) {
    console.error('Certificate Generator Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
