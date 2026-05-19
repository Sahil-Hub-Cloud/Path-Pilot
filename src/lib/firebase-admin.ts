import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (privateKey && clientEmail) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'path-pilot-11255',
        clientEmail: clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      })
    });
  } else {
    admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'path-pilot-11255',
    });
  }
}

export const adminDb = admin.firestore();
