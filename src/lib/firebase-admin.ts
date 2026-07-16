import admin from 'firebase-admin';

function initFirebaseAdmin() {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!privateKey) {
    console.error('[Firebase Admin] Missing private key — check FIREBASE_PRIVATE_KEY env var');
    throw new Error('Firebase Admin initialization failed: missing private key');
  }

  // Do NOT log private key length, markers, or any metadata about the key.
  // This is sensitive credential information.

  if (admin.apps.length > 0) {
    return admin.app();
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  });
}

const adminApp = initFirebaseAdmin();
const adminAuth = admin.auth(adminApp);
const adminDb = admin.firestore(adminApp);

export { adminApp, adminAuth, adminDb };
