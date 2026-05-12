export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { getFirebaseDb } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function POST(req: Request) {
    const body = await req.text();
    const headerList = await headers();
    const signature = headerList.get('Stripe-Signature') as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET || ''
        );
    } catch (err: any) {
        console.error('Webhook Error:', err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        const userId = session.metadata?.userId;

        if (userId) {
            // Update Firestore directly (Server-Side Authority)
            const db = getFirebaseDb();
            if (db) {
                try {
                    await updateDoc(doc(db, 'profiles', userId), {
                        isPremium: true
                    });
                    console.log(`[Stripe] User ${userId} upgraded to Premium.`);
                } catch (e) {
                    console.error(`[Stripe] Failed to update Firestore for ${userId}:`, e);
                }
            } else {
                console.error('[Stripe] DB Connection failed during webhook.');
            }
        }
    }

    return NextResponse.json({ received: true });
}

