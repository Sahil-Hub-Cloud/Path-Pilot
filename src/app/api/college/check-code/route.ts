export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Code parameter is required' }, { status: 400 });
    }

    console.log(`API check-code: Querying Firebase Admin SDK for collegeCode = ${code}`);
    const collegesRef = db.collection('colleges');
    const querySnapshot = await collegesRef.where('collegeCode', '==', code).get();

    if (querySnapshot.empty) {
      return NextResponse.json({ available: true, exists: false });
    } else {
      const firstDoc = querySnapshot.docs[0];
      const data = firstDoc.data();
      return NextResponse.json({
        available: false,
        exists: true,
        collegeId: firstDoc.id,
        collegeName: data.collegeName
      });
    }
  } catch (error: any) {
    console.error('Error checking college code availability:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
