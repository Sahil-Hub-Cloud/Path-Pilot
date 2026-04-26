import { supabase } from './supabase';

// ─── User Roles ──────────────────────────────────────────────
export type UserRole = 'student' | 'faculty' | 'hod' | 'admin' | 'recruiter';

export interface UserRoleRecord {
    user_id: string;
    role: UserRole;
    institution_id: string | null;
}

// ─── Get user role from Supabase ─────────────────────────────
export async function getUserRole(userId: string): Promise<UserRoleRecord | null> {
    if (!userId) return null;

    try {
        const { data, error } = await supabase
            .from('user_roles')
            .select('user_id, role, institution_id')
            .eq('user_id', userId)
            .maybeSingle();

        if (error || !data) return null;
        return data as UserRoleRecord;
    } catch (e) {
        console.warn('RBAC: Failed to fetch user role by ID:', e);
        return null;
    }
}

// ─── Get user role by email (for invited users) ────────────────
export async function getUserRoleByEmail(email: string): Promise<UserRoleRecord | null> {
    if (!email) return null;

    try {
        const { data, error } = await supabase
            .from('user_roles')
            .select('user_id, role, institution_id')
            .eq('invited_email', email)
            .maybeSingle();

        if (error || !data) return null;
        return data as UserRoleRecord;
    } catch (e) {
        console.warn('RBAC: Failed to fetch user role by email:', e);
        return null;
    }
}

// ─── Role check helpers ──────────────────────────────────────
export function isAdminRole(role: UserRole | null): boolean {
    return role === 'admin' || role === 'hod';
}

export function isFacultyOrAbove(role: UserRole | null): boolean {
    return role === 'faculty' || role === 'hod' || role === 'admin';
}

export function isStudent(role: UserRole | null): boolean {
    return role === 'student' || role === null;
}

// ─── Server-side role enforcement (for API routes) ───────────
export async function requireRole(
    userId: string | null | undefined,
    ...allowedRoles: UserRole[]
): Promise<{ authorized: boolean; role: UserRole | null; institutionId: string | null }> {
    if (!userId) {
        return { authorized: false, role: null, institutionId: null };
    }

    const record = await getUserRole(userId);

    if (!record) {
        // Fallback: If 'student' is in allowedRoles, we allow it even without a record
        return {
            authorized: allowedRoles.includes('student'),
            role: 'student',
            institutionId: null,
        };
    }

    return {
        authorized: allowedRoles.includes(record.role),
        role: record.role,
        institutionId: record.institution_id,
    };
}

// ─── Assign a role to a user ─────────────────────────────────
export async function assignRole(
    userId: string,
    role: UserRole,
    institutionId?: string,
    email?: string
): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('user_roles')
            .upsert({
                user_id: userId,
                role,
                institution_id: institutionId || null,
                invited_email: email || null,
            });

        if (error) throw error;
        return true;
    } catch (e) {
        console.error('RBAC: Failed to assign role:', e);
        return false;
    }
}

// ─── Route protection map ────────────────────────────────────
export const PROTECTED_ROUTES: Record<string, UserRole[]> = {
    '/admin': ['faculty', 'hod', 'admin'],
    '/admin/dashboard': ['faculty', 'hod', 'admin'],
    '/dashboard': ['student', 'faculty', 'hod', 'admin'],

    '/labs': ['student', 'faculty', 'hod', 'admin'],
    '/chat': ['student', 'faculty', 'hod', 'admin'],

    '/library': ['student', 'faculty', 'hod', 'admin'],
    '/profile': ['student', 'faculty', 'hod', 'admin'],
    '/certificate': ['student', 'faculty', 'hod', 'admin'],
    '/security': ['student', 'faculty', 'hod', 'admin'],
};
