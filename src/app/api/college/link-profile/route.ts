export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  try {
    const { userId, email, fullName, collegeCode, collegeName, yearOfStudy, profileImageUrl, showProfileToAdmins } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Upsert into profiles table
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email,
        full_name: fullName,
        college_code: collegeCode || null,
        college_name: collegeName || null,
        year_of_study: yearOfStudy ? parseInt(yearOfStudy, 10) : null,
        profile_image_url: profileImageUrl || null,
        show_profile_to_admins: showProfileToAdmins ?? true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      console.error('Supabase profile link error:', error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Link Profile Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
