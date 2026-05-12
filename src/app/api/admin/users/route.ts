export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { requireRole, assignRole } from '@/lib/rbac';
import { CohortService } from '@/lib/services/cohort-service';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

/**
 * Admin Users API — Bulk invite students, list users, manage membership
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, action } = body;

        // RBAC check — HOD or admin only for user management
        const { authorized, institutionId } = await requireRole(userId, 'hod', 'admin');
        if (!authorized || !institutionId) {
            return NextResponse.json({ error: 'Unauthorized. HOD or Admin required.' }, { status: 403 });
        }

        if (action === 'bulk_invite') {
            // CSV-based bulk invite
            const { students, cohortId } = body;
            // students = [{ name, email }, ...]

            if (!students || !Array.isArray(students) || students.length === 0) {
                return NextResponse.json({ error: 'No students provided' }, { status: 400 });
            }

            // Check seat limits
            const { data: seatData } = await supabase
                .from('seats')
                .select('total_seats, used_seats')
                .eq('institution_id', institutionId)
                .single();

            if (seatData && seatData.used_seats + students.length > seatData.total_seats) {
                return NextResponse.json({
                    error: `Seat limit exceeded. Available: ${seatData.total_seats - seatData.used_seats}, Requested: ${students.length}`,
                }, { status: 400 });
            }

            const results: { email: string; status: string; userId?: string }[] = [];

            for (const student of students) {
                try {
                    // Generate a placeholder user ID from email (in production, use Firebase Admin SDK)
                    const placeholderUserId = `invite_${student.email.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}`;

                    // Assign student role with invited_email linkage
                    await assignRole(placeholderUserId, 'student', institutionId, student.email);

                    // Add to cohort if specified
                    if (cohortId) {
                        await CohortService.addStudents(cohortId, [placeholderUserId]);
                    }

                    results.push({ email: student.email, status: 'invited', userId: placeholderUserId });
                } catch (e: any) {
                    results.push({ email: student.email, status: `failed: ${e.message}` });
                }
            }

            return NextResponse.json({
                success: true,
                invited: results.filter(r => r.status === 'invited').length,
                failed: results.filter(r => r.status !== 'invited').length,
                results,
            });
        }

        if (action === 'add_faculty') {
            const { facultyUserId, facultyEmail } = body;

            if (!facultyUserId) {
                return NextResponse.json({ error: 'facultyUserId required' }, { status: 400 });
            }

            await assignRole(facultyUserId, 'faculty', institutionId);
            return NextResponse.json({ success: true, message: 'Faculty role assigned' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        console.error('Admin Users API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        const { authorized, institutionId } = await requireRole(userId, 'faculty', 'hod', 'admin');
        if (!authorized || !institutionId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Get all users in this institution with their cohort assignments
        const { data: roles, error } = await supabase
            .from('user_roles')
            .select(`
                user_id, 
                role, 
                created_at, 
                invited_email,
                cohort_members (
                    cohort_id,
                    cohorts (name)
                )
            `)
            .eq('institution_id', institutionId);

        if (error) throw error;

        // Flatten the data for the frontend
        const users = (roles || []).map((r: any) => ({
            user_id: r.user_id,
            role: r.role,
            created_at: r.created_at,
            email: r.invited_email,
            cohort: r.cohort_members?.[0]?.cohorts?.name || 'Unassigned'
        }));

        return NextResponse.json({ success: true, users });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

