export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { adminDb as db } from '@/lib/firebase-admin';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
    try {
        const { verifyRequestAuth, requireAuthResponse } = await import('@/lib/server-auth');
        const auth = await verifyRequestAuth(req);
        if (!auth) return requireAuthResponse();
        {
          const { success } = await checkRateLimit(`rl_admin_setup:${auth.uid}`);
          if (!success) return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
        }

        const { institutionName } = await req.json();
        const userId = auth.uid;
        const email = auth.email || '';

        if (!userId || !email || !institutionName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const institutionRef = db.collection('institutions').doc();
        await institutionRef.set({
            name: institutionName,
            domain: email.split('@')[1] || null,
            created_by: userId,
        });

        await db.collection('user_roles').doc(userId).set({
            user_id: userId,
            role: 'hod',
            institution_id: institutionRef.id,
        }, { merge: true });

        await db.collection('seats').doc().set({
            institution_id: institutionRef.id,
            total_seats: 50,
            used_seats: 0,
        });

        return NextResponse.json({
            success: true,
            institution: {
                id: institutionRef.id,
                name: institutionName,
            },
        });
    } catch (error: any) {
        console.error('Admin Setup Error:', error);
        return NextResponse.json({ error: error.message || 'Setup failed' }, { status: 500 });
    }
}
