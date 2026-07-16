export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, studentId, message } = body;

    const { authorized, institutionId } = await requireRole(userId, 'recruiter', 'admin');
    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized. Company recruiter role required.' }, { status: 403 });
    }

    if (!studentId) {
      return NextResponse.json({ error: 'studentId is required' }, { status: 400 });
    }

    await adminDb.collection('hiring_interests').add({
      company_user_id: userId,
      student_id: studentId,
      message: message || 'I am interested in your profile for a potential role.',
      institution_id: institutionId,
      status: 'pending',
      created_at: new Date().toISOString()
    });

    console.log(`[HIRING_NOTIFICATION] Recruiter ${userId} is interested in User ${studentId}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Hiring interest recorded and student notified via neural link.'
    });
  } catch (error: any) {
    console.error('Hiring API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
