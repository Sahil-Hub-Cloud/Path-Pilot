export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const { verifyRequestAuth, requireAuthResponse } = await import('@/lib/server-auth');
    const auth = await verifyRequestAuth(req);
    if (!auth) return requireAuthResponse();
    const { success } = await checkRateLimit(`rl_company_send_email:${auth.uid}`);
    if (!success) return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });

    const { requireRole } = await import('@/lib/rbac');
    const { authorized } = await requireRole(auth.uid, 'recruiter', 'admin');
    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized. Recruiter role required.' }, { status: 403 });
    }

    const { studentId, subject, body: emailBody } = await req.json();

    if (!studentId || !subject || !emailBody) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await adminDb.collection('hiring_emails').add({
      student_id: studentId,
      email_subject: subject,
      email_body: emailBody,
      status: 'sent',
      created_at: new Date().toISOString()
    });

    console.log(`[REAL_EMAIL_MOCK] Sent to ${studentId}: ${subject}`);

    return NextResponse.json({ success: true, message: 'Neural link established and protocol transmitted.' });

  } catch (error: any) {
    console.error('Send Email Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
