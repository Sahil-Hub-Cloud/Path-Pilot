import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

/**
 * IDENTITY BRIDGE API
 * Securely links a newly registered Firebase UID with an existing "Invite Placeholder"
 */
export async function POST(req: NextRequest) {
    try {
        const { userId, email } = await req.json();

        if (!userId || !email) {
            return NextResponse.json({ error: 'Missing userId or email' }, { status: 400 });
        }

        // 1. Find the invite record
        const { data: inviteRecord, error: findError } = await supabase
            .from('user_roles')
            .select('*')
            .eq('invited_email', email)
            .like('user_id', 'invite_%')
            .maybeSingle();

        if (findError) throw findError;

        if (!inviteRecord) {
            return NextResponse.json({ success: true, message: 'No invite found, skipping linkage.' });
        }

        const placeholderId = inviteRecord.user_id;

        // 2. Atomically migrate the identity
        // We use the service role to perform these updates
        
        // Update user_roles to the real UID
        const { error: roleError } = await supabase
            .from('user_roles')
            .update({ user_id: userId })
            .eq('user_id', placeholderId);

        if (roleError) {
            // Handle unique constraint violation (if user already has a role)
            if (roleError.code === '23505') {
                 // User already exists, we might want to merge or just delete the placeholder
                 console.log('User already has a role, cleaning up placeholder.');
                 await supabase.from('user_roles').delete().eq('user_id', placeholderId);
            } else {
                throw roleError;
            }
        }

        // 3. Move cohort memberships
        const { error: memberError } = await supabase
            .from('cohort_members')
            .update({ user_id: userId })
            .eq('user_id', placeholderId);

        if (memberError) {
            // If already a member of these cohorts, we can ignore duplicates or delete placeholders
             if (memberError.code === '23505') {
                 await supabase.from('cohort_members').delete().eq('user_id', placeholderId);
             } else {
                throw memberError;
             }
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Identity migrated successfully',
            migratedFrom: placeholderId,
            migratedTo: userId
        });

    } catch (error: any) {
        console.error('Identity Bridge Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
