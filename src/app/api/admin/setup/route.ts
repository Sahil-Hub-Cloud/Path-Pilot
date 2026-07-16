export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { adminDb as db } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
    try {
        const { userId, email, institutionName } = await req.json();

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
