'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

/**
 * useAuthGuard — Call this at the top of any protected page.
 *
 * Returns:
 *  - isReady: false  → while auth is loading OR redirect is pending (render your loading skeleton)
 *  - isReady: true   → user is authenticated, safe to render the page
 *  - user            → the authenticated Firebase user
 *
 * Usage:
 *   const { user, isReady } = useAuthGuard();
 *   if (!isReady) return <LoadingSkeleton />;
 */
export function useAuthGuard(redirectTo = '/auth') {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only act once Firebase has resolved auth state
    if (!loading && !user) {
      router.replace(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  // isReady = Firebase done loading AND user exists
  const isReady = !loading && !!user;

  return { user, loading, isReady };
}
