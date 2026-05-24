// Firebase initialization — client-side only, always works
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  memoryLocalCache,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyClaPma9uKk217DlBCC1yW2SMNVwvE5_C0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "path-pilot-11255.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "path-pilot-11255",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "path-pilot-11255.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "866666251842",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:866666251842:web:d762282473f0b740f58fdb",
};

// Only initialize once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

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

// Legacy compat getters
export const getFirebaseAuth = () => auth;
export const getFirebaseDb = () => db;
