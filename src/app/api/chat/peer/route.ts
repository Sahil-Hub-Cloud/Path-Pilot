export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
    try {
        const { cohortId, userId, userName, message } = await req.json();

        if (!cohortId || !userId || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newMessage = {
            cohort_id: cohortId,
            user_id: userId,
            user_name: userName || 'Anonymous Intern',
            message: message,
            created_at: new Date().toISOString()
        };

        const docRef = await adminDb.collection('peer_messages').add(newMessage);
        return NextResponse.json({ success: true, message: { id: docRef.id, ...newMessage } });
    } catch (error: any) {
        console.error('Peer Chat POST Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const cohortId = searchParams.get('cohortId');

        if (!cohortId) {
            return NextResponse.json({ error: 'cohortId required' }, { status: 400 });
        }

        const snapshot = await adminDb.collection('peer_messages')
            .where('cohort_id', '==', cohortId)
            .orderBy('created_at', 'asc')
            .limit(50)
            .get();

        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json({ success: true, messages });
    } catch (error: any) {
        console.error('Peer Chat GET Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
