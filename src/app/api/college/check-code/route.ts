export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Code parameter is required' }, { status: 400 });
    }

    try {
      // 1. Try Firebase Admin SDK first
      console.log('API check-code: Attempting with Firebase Admin SDK...');
      const collegesRef = adminDb.collection('colleges');
      const querySnapshot = await collegesRef.where('collegeCode', '==', code).get();

      if (querySnapshot.empty) {
        return NextResponse.json({ available: true });
      } else {
        return NextResponse.json({ available: false });
      }
    } catch (adminError: any) {
      console.warn('API check-code: Firebase Admin SDK failed, falling back to Client SDK. Error:', adminError.message);
      
      // 2. Fallback to Client SDK (authenticated anonymously to satisfy read rules)
      if (!db || !auth) {
        throw new Error('Fallback database or auth is not initialized');
      }
      
      await signInAnonymously(auth);
      const collegesRef = collection(db, 'colleges');
      const q = query(collegesRef, where('collegeCode', '==', code));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return NextResponse.json({ available: true });
      } else {
        return NextResponse.json({ available: false });
      }
    }
  } catch (error: any) {
    console.error('Error checking college code availability:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
