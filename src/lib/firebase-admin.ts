import * as admin from 'firebase-admin';

export function initFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.app();
  }
  
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  // Vercel stores multi-line env vars with actual newlines, no escaping needed
  // But we add fallback handling for different formats
  const formattedPrivateKey = privateKey
    ?.replace(/\\n/g, '\n')      // Handle escaped newlines
    ?.replace(/\\\\n/g, '\n');   // Handle double-escaped newlines
  
  if (!projectId || !formattedPrivateKey || !clientEmail) {
    console.error('❌ Missing Firebase Admin credentials');
    console.error('FIREBASE_ADMIN_PROJECT_ID:', !!projectId);
    console.error('FIREBASE_ADMIN_PRIVATE_KEY:', !!formattedPrivateKey);
    console.error('FIREBASE_ADMIN_CLIENT_EMAIL:', !!clientEmail);
    throw new Error('Firebase Admin credentials not configured');
  }

  // Validate private key format
  if (!formattedPrivateKey?.includes('-----BEGIN PRIVATE KEY-----')) {
    throw new Error('Invalid private key format - missing BEGIN marker');
  }

  // Debug logging
  console.log('🔑 Private key length:', formattedPrivateKey?.length);
  console.log('🔑 Has BEGIN marker:', formattedPrivateKey?.includes('-----BEGIN'));
  console.log('🔑 Has END marker:', formattedPrivateKey?.includes('-----END'));
  
  const app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      privateKey: formattedPrivateKey,
      clientEmail,
    }),
  });
  console.log('✅ Firebase Admin initialized');
  return app;
}

export const db = initFirebaseAdmin().firestore();
export const auth = initFirebaseAdmin().auth();
