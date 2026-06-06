import * as admin from 'firebase-admin';

export function initFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.app();
  }
  
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  
  if (!projectId || !privateKey || !clientEmail) {
    console.error('❌ Missing Firebase Admin credentials');
    console.error('FIREBASE_ADMIN_PROJECT_ID:', !!projectId);
    console.error('FIREBASE_ADMIN_PRIVATE_KEY:', !!privateKey);
    console.error('FIREBASE_ADMIN_CLIENT_EMAIL:', !!clientEmail);
    throw new Error('Firebase Admin credentials not configured');
  }
  
  const app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      privateKey,
      clientEmail,
    }),
  });
  console.log('✅ Firebase Admin initialized');
  return app;
}

export const db = initFirebaseAdmin().firestore();
export const auth = initFirebaseAdmin().auth();
