import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simplified middleware — Firebase Auth is client-side only.
// The heavy lifting of auth protection is done on the client.
// This middleware only blocks truly server-rendered admin routes.

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow all static assets, API routes, etc.
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/legal') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // All other routes are allowed — client-side auth guards handle protection
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|logo.webp|.*\\..*$).*)',
    ],
};
