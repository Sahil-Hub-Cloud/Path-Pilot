'use client';

import { useContext } from 'react';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { AuthContext } from '@/components/AuthProvider';

export const useAuth = () => {
  const context = useContext(AuthContext);

  const signOut = async () => {
    if (auth) {
      await firebaseSignOut(auth);
    }
  };

  return {
    ...context,
    signOut: context.signOut || signOut,
  };
};
