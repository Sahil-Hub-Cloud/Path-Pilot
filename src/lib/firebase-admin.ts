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

// Lazy initialization — only initialize when actually used at runtime,
// not during Next.js build-time static analysis
let _adminApp: admin.app.App | null = null;

function getAdminApp() {
  if (!_adminApp) {
    _adminApp = initFirebaseAdmin();
  }
  return _adminApp;
}

// Use getters so the admin SDK is only initialized when these are accessed
export const adminAuth = new Proxy({} as admin.auth.Auth, {
  get(_, prop) {
    return (admin.auth(getAdminApp()) as any)[prop];
  }
});

export const adminDb = new Proxy({} as admin.firestore.Firestore, {
  get(_, prop) {
    return (admin.firestore(getAdminApp()) as any)[prop];
  }
});

export { getAdminApp as adminApp };
