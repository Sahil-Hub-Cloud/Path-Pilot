import { NextResponse } from "next/server";
import { Resend } from 'resend';
import { adminAuth } from '@/lib/firebase-admin';

const resendClient = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
      await adminAuth.verifyIdToken(authHeader.split('Bearer ')[1]);
    } catch (e) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const { studentId, to, subject, body, html } = await req.json();

    if (!process.env.RESEND_API_KEY) {
      console.error("[MAILER] RESEND_API_KEY is missing");
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    const targetEmail = to || studentId; // Fallback if needed, though frontend sends 'to'
    const content = html || body;

    console.log(`[MAILER] Transmitting engagement to ${targetEmail}: ${subject}`);

    const { data, error } = await resendClient.emails.send({
      from: 'Path Pilot <onboarding@resend.dev>',
      to: [targetEmail],
      subject: subject || 'Path Pilot Engagement Protocol',
      html: content
    });

    if (error) {
      console.error("[MAILER] Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data,
      message: "Engagement protocol transmitted successfully."
    });
  } catch (error: any) {
    console.error("[MAILER] Transmission error:", error);
    return NextResponse.json({ error: "Transmission interrupted: " + error.message }, { status: 500 });
  }
}

