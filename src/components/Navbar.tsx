'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const publicLinks = [
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/labs', label: 'Labs' },
  { href: '/hackathon', label: 'Hackathons' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (
    !pathname ||
    pathname === '/' ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/college') ||
    pathname.startsWith('/company') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/onboarding')
  ) {
    return null;
  }

  const dashboardHref = role === 'college' ? '/college/dashboard' : role === 'company' ? '/company/dashboard' : '/dashboard';

  return (
    <header className="sticky top-0 z-[120] w-full border-b border-[var(--border-clay)] bg-[rgba(253,246,236,0.88)] backdrop-blur-xl dark:border-gray-800 dark:bg-[rgba(10,10,14,0.88)]">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 text-lg font-black tracking-tight text-[var(--peacock-blue)]"
        >
          Path Pilot
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {publicLinks.map(link => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex min-h-11 items-center rounded-xl px-4 text-sm font-bold transition-colors ${
                  active
                    ? 'bg-[rgba(0,107,122,0.12)] text-[var(--peacock-blue)]'
                    : 'text-[var(--text-medium)] hover:bg-[var(--surface-raised)] hover:text-[var(--peacock-blue)]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:block">
          {user ? (
            <Link href={dashboardHref} className="btn-peacock-blue min-h-11 px-5 py-2.5">
              <LayoutDashboard size={16} aria-hidden />
              Dashboard
            </Link>
          ) : (
            <Link href="/auth" className="btn-peacock-blue min-h-11 px-5 py-2.5">
              Sign In
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(open => !open)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border-clay)] bg-[var(--surface-raised)] text-[var(--text-dark)] transition-colors hover:bg-[var(--surface-sunken)] md:hidden"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-[var(--border-clay)] bg-[var(--bg-cream-light)] px-4 pb-4 pt-3 shadow-xl md:hidden dark:border-gray-800 dark:bg-[#111118]">
          <div className="grid gap-1">
            {publicLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="flex min-h-11 items-center rounded-xl px-4 text-sm font-bold text-[var(--text-medium)] transition-colors hover:bg-[var(--surface-raised)]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={user ? dashboardHref : '/auth'}
              className="btn-peacock-blue mt-2 min-h-11 w-full px-5 py-3"
            >
              {user ? 'Go to Dashboard' : 'Sign In'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
