export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
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
