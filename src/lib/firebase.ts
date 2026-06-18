// Firebase initialization — client-side only, always works
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  memoryLocalCache,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.error('🔥 FIREBASE API KEY MISSING IN ENV VARS');
}
console.log('🔥 FIREBASE CONFIG LOADED:', firebaseConfig);

if (!firebaseConfig.apiKey) console.error("Missing NEXT_PUBLIC_FIREBASE_API_KEY");

if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.authDomain ||
  !firebaseConfig.projectId ||
  !firebaseConfig.storageBucket ||
  !firebaseConfig.messagingSenderId ||
  !firebaseConfig.appId
) {
  console.error("Missing one or more required Firebase environment variables:", firebaseConfig);
  if (typeof window !== 'undefined') {
    alert("Missing one or more required Firebase environment variables.");
  }
}

// Only initialize once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
console.log('Firebase initialized:', !!app);

export const auth = getAuth(app);

// Use persistent cache only in browser environments that support IndexedDB.
// Falling back to memory cache avoids the SDK opening a background Write stream
// before the user authenticates, which would produce a spurious PERMISSION_DENIED error.
// NOTE: We intentionally do NOT pass persistentMultipleTabManager here — that tab manager
// opens an immediate background stream even before auth, causing the spurious warning.
// Single-tab persistence (default) is sufficient and does not have this side effect.
function createFirestore() {
  if (typeof window !== "undefined" && typeof indexedDB !== "undefined") {
    try {
      return initializeFirestore(app, {
        localCache: persistentLocalCache(),
      });
    } catch {
      // IndexedDB blocked (private mode, old browser, etc.) — fall through
    }
  }
  return initializeFirestore(app, { localCache: memoryLocalCache() });
}

export const db = createFirestore();
export const storage = getStorage(app);

// Legacy compat getters
export const getFirebaseAuth = () => auth;
export const getFirebaseDb = () => db;
