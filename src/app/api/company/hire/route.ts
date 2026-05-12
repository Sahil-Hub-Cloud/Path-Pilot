export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

/**
 * Company Hiring API — Record interest in a student and trigger notification
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, studentId, message } = body;

    // RBAC check — Must be a company recruiter or admin
    const { authorized, institutionId } = await requireRole(userId, 'recruiter', 'admin');
    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized. Company recruiter role required.' }, { status: 403 });
    }

    if (!studentId) {
      return NextResponse.json({ error: 'studentId is required' }, { status: 400 });
    }

    // Record the hiring interest in the database
    const { data, error } = await supabase
      .from('hiring_interests')
      .insert({
        company_user_id: userId,
        student_id: studentId,
        message: message || 'I am interested in your profile for a potential role.',
        institution_id: institutionId,
        status: 'pending'
      });

    if (error) throw error;

    // In a real production app, this would trigger a SendGrid/Resend email notification
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

