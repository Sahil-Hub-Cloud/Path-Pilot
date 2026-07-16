export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
    try {
        const { userId, email } = await req.json();

        if (!userId || !email) {
            return NextResponse.json({ error: 'Missing userId or email' }, { status: 400 });
        }

        const rolesRef = adminDb.collection('user_roles');
        const snapshot = await rolesRef.where('invited_email', '==', email).get();
        let inviteRecord = null;
        
        for (const doc of snapshot.docs) {
            if (doc.id.startsWith('invite_')) {
                inviteRecord = { id: doc.id, ...doc.data() };
                break;
            }
        }

        if (!inviteRecord) {
            return NextResponse.json({ success: true, message: 'No invite found, skipping linkage.' });
        }

        const placeholderId = inviteRecord.id;

        const batch = adminDb.batch();
        
        const newRoleRef = rolesRef.doc(userId);
        batch.set(newRoleRef, inviteRecord);
        batch.delete(rolesRef.doc(placeholderId));

        const cohortMembersRef = adminDb.collection('cohort_members');
        const memberSnapshot = await cohortMembersRef.where('user_id', '==', placeholderId).get();
        
        memberSnapshot.docs.forEach(doc => {
            const data = doc.data();
            const newMemberRef = cohortMembersRef.doc();
            batch.set(newMemberRef, { ...data, user_id: userId });
            batch.delete(doc.ref);
        });

        await batch.commit();

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
