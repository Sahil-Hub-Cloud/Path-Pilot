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
        const { success } = await checkRateLimit(`rl_admin_certificates:${auth.uid}`);
        if (!success) return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });

        const { userId, cohortId, examId } = await req.json();

        if (!userId || !cohortId) {
            return NextResponse.json({ error: 'Missing userId or cohortId' }, { status: 400 });
        }

        const snapshot = await db.collection('certificates')
            .where('user_id', '==', userId)
            .where('cohort_id', '==', cohortId)
            .limit(1)
            .get();

        if (!snapshot.empty) {
            return NextResponse.json({ success: true, certificate: snapshot.docs[0].data(), message: 'Already issued' });
        }

        const newCert = {
            user_id: userId,
            cohort_id: cohortId,
            exam_id: examId,
            certificate_url: `/certificate/${Math.random().toString(36).substr(2, 9)}`,
            created_at: new Date().toISOString()
        };

        const docRef = await db.collection('certificates').add(newCert);

        return NextResponse.json({ success: true, certificate: { id: docRef.id, ...newCert } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { verifyRequestAuth, requireAuthResponse } = await import('@/lib/server-auth');
        const auth = await verifyRequestAuth(req);
        if (!auth) return requireAuthResponse();
        {
          const { success: rlSuccess } = await checkRateLimit(`rl_admin_certificates:${auth.uid}`);
          if (!rlSuccess) return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
        }

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId') || auth.uid;

        if (!userId) {
            return NextResponse.json({ error: 'userId required' }, { status: 400 });
        }

        const snapshot = await db.collection('certificates').where('user_id', '==', userId).get();
        const certificates = await Promise.all(snapshot.docs.map(async doc => {
            const data = doc.data();
            let cohortName = 'Unknown';
            if (data.cohort_id) {
                const cohortDoc = await db.collection('cohorts').doc(data.cohort_id).get();
                if (cohortDoc.exists) cohortName = cohortDoc.data()?.name || cohortName;
            }
            return { id: doc.id, ...data, cohorts: { name: cohortName } };
        }));

        return NextResponse.json({ success: true, certificates });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
