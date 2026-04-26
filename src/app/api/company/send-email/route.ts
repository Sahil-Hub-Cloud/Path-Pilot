import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

/**
 * Company Link Node (Email) API
 */
export async function POST(req: NextRequest) {
  try {
    const { studentId, subject, body: emailBody } = await req.json();

    if (!studentId || !subject || !emailBody) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // In a production app with Resend:
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Path Pilot <hiring@pathpilot.net>',
      to: studentEmail,
      subject: subject,
      text: emailBody
    });
    */

    // Save to hiring_emails table
    const { error } = await supabase
      .from('hiring_emails')
      .insert({
        student_id: studentId,
        email_subject: subject,
        email_body: emailBody,
        status: 'sent'
      });

    if (error) throw error;

    console.log(`[REAL_EMAIL_MOCK] Sent to ${studentId}: ${subject}`);

    return NextResponse.json({ success: true, message: 'Neural link established and protocol transmitted.' });

  } catch (error: any) {
    console.error('Send Email Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
