'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/lib/toast';

export function RoleRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // If auth state is still loading, wait
    if (loading) {
      setAuthorized(false);
      return;
    }

    // List of public paths that don't need authentication
    const isPublicPath =
      pathname === '/' ||
      pathname.startsWith('/auth') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next') ||
      pathname === '/favicon.ico' ||
      pathname === '/logo.webp';

    if (isPublicPath) {
      setAuthorized(true);
      return;
    }

    // Protected paths need auth
    if (!user) {
      setAuthorized(false);
      router.replace('/auth');
      return;
    }

    // Auth exists, wait for role to resolve
    if (!role) {
      setAuthorized(false);
      return;
    }

    // Role-based path checks
    const isCollegeRoute = pathname.startsWith('/college');
    const isCompanyRoute = pathname.startsWith('/company');
    const isAdminRoute = pathname.startsWith('/admin');
    const isStudentRoute =
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/learn') ||
      pathname.startsWith('/labs') ||
      pathname.startsWith('/onboarding') ||
      pathname.startsWith('/profile') ||
      pathname.startsWith('/leaderboard');

    // Rule 1: /college/* routes require role='college'
    if (isCollegeRoute) {
      if (role === 'college') {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        toast.error('Access denied. Redirecting...');
        router.replace('/dashboard');
      }
      return;
    }

    // Rule 2: /company/* routes require role='company'
    if (isCompanyRoute) {
      if (role === 'company') {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        toast.error('Access denied. Redirecting...');
        router.replace('/dashboard');
      }
      return;
    }

    // Rule 3: /admin/* routes require role='admin'
    if (isAdminRoute) {
      if (role === 'admin') {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        toast.error('Access denied. Redirecting...');
        router.replace('/dashboard');
      }
      return;
    }

    // Rule 4: Student routes require role='student'
    if (isStudentRoute) {
      if (role === 'student') {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        // Redirect non-students to their respective dashboards
        if (role === 'college') {
          router.replace('/college/dashboard');
        } else if (role === 'company') {
          router.replace('/company/dashboard');
        } else if (role === 'admin') {
          router.replace('/admin/dashboard');
        } else {
          router.replace('/auth');
        }
      }
      return;
    }

    // Default: allow other routes
    setAuthorized(true);
  }, [user, loading, role, pathname, router]);

  // Render children only when authorized. If not authorized, show an elegant loading screen.
  if (!authorized) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#FDF6EC',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-jakarta)'
      }}>
        <div style={{
          position: 'fixed', inset: 0, zIndex: 0, opacity: 0.3,
          backgroundImage: 'radial-gradient(circle, rgba(0,107,122,0.15) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{
            width: 48,
            height: 48,
            border: '4px solid rgba(0, 107, 122, 0.1)',
            borderTopColor: '#006B7A',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}} />
          <p style={{ color: '#8B6E52', fontSize: 14, fontWeight: 600 }}>Verifying credentials...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
