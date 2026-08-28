export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || (req as any).ip || 'anonymous';
    const { success } = await checkRateLimit(`rl_college_check_code:${ip}`);
    if (!success) return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Code parameter is required' }, { status: 400 });
    }

    console.log(`API check-code: Querying Firebase for collegeCode = ${code}`);
    
    const snapshot = await adminDb.collection('colleges').where('college_code', '==', code).limit(1).get();

    if (snapshot.empty) {
      return NextResponse.json({ available: true, exists: false });
    } else {
      const doc = snapshot.docs[0];
      const data = doc.data();
      return NextResponse.json({
        available: false,
        exists: true,
        collegeId: doc.id,
        collegeName: data.college_name
      });
    }
  } catch (error: any) {
    console.error('Error checking college code availability:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
