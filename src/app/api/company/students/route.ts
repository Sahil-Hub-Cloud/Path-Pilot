import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

/**
 * Get Students for Companies API
 */
export async function GET(req: NextRequest) {
  try {
    // Return students where course_completed = true and visible
    const { data, error } = await supabase
      .from('student_skills')
      .select(`
        id,
        ai_score,
        completion_speed,
        github_username,
        course_completed,
        users (
          display_name,
          email,
          avatar_url
        )
      `)
      .eq('course_completed', true)
      .eq('is_visible_to_companies', true)
      .order('ai_score', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ students: data });

  } catch (error: any) {
    console.error('Get Students Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
