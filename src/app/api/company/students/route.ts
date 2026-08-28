export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyRequestAuth, requireAuthResponse } from '@/lib/server-auth';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyRequestAuth(req); if (!auth) return requireAuthResponse();
    const { success } = await checkRateLimit(`rl_company_students:${auth.uid}`);
    if (!success) return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
    const snapshot = await adminDb.collection('student_skills')
      .where('course_completed', '==', true)
      .where('is_visible_to_companies', '==', true)
      .orderBy('ai_score', 'desc')
      .get();

    const students = await Promise.all(snapshot.docs.map(async (doc) => {
      const data = doc.data();
      let users = null;
      if (data.user_id) {
          const userDoc = await adminDb.collection('users').doc(data.user_id).get();
          if (userDoc.exists) users = userDoc.data();
      }
      return { id: doc.id, ...data, users };
    }));

    return NextResponse.json({ students });
  } catch (error: any) {
    console.error('Get Students Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
