export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { verifyRequestAuth, requireAuthResponse } = await import('@/lib/server-auth');
    const auth = await verifyRequestAuth(req);
    if (!auth) return requireAuthResponse();

    const { email, fullName, collegeCode, collegeName, yearOfStudy, profileImageUrl, showProfileToAdmins } = await req.json();
    const userId = auth.uid;

    // Upsert into users table in Firestore
    await adminDb.collection('users').doc(userId).set({
      id: userId,
      email,
      full_name: fullName,
      college_code: collegeCode || null,
      college_name: collegeName || null,
      year_of_study: yearOfStudy ? parseInt(yearOfStudy, 10) : null,
      profile_image_url: profileImageUrl || null,
      show_profile_to_admins: showProfileToAdmins ?? true,
      updated_at: new Date().toISOString()
    }, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Link Profile Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
