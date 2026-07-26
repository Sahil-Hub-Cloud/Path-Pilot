import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis/cloudflare';

const rateLimiters = {
  auth: new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, '1m'),
    prefix: 'rl_auth',
  }),
  general: new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(100, '1m'),
    prefix: 'rl_general',
  }),
};

export async function middleware(request: NextRequest) {
  // Handle OPTIONS preflight IMMEDIATELY
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': getAllowOrigin(request),
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  const url = new URL(request.url);
  const path = url.pathname;

  // Security headers on ALL responses
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com https://www.gstatic.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://identitytoolkit.googleapis.com https://firestore.googleapis.com https://*.supabase.co https://ce.judge0.com wss://*.firebaseio.com https://www.google-analytics.com https://*.google-analytics.com https://www.google.com; frame-src 'self' https://*.firebaseapp.com;"
  );
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');

  // CORS header for API routes
  if (path.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', getAllowOrigin(request));
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const key = `${ip}:${path}`;

  try {
    if (path.startsWith('/api/auth/') || path === '/api/auth') {
      const { success } = await rateLimiters.auth.limit(key);
      if (!success) {
        console.warn(`[Security] Rate limit breach (auth) by IP: ${ip} for path: ${path}`);
        return new NextResponse(JSON.stringify({ error: 'Too many auth attempts' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
        });
      }
    } else if (path.startsWith('/api/')) {
      const { success } = await rateLimiters.general.limit(key);
      if (!success) {
        console.warn(`[Security] Rate limit breach (general) by IP: ${ip} for path: ${path}`);
        return new NextResponse(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
        });
      }
    }
  } catch (err) {
    console.error(`[Security] Rate limiter system error: ${(err as Error).message}`);
  }

  return response;
}

function getAllowOrigin(request: NextRequest): string {
  const origin = request.headers.get('origin') || '';
  const allowed = ['https://pathpilot.ai', 'https://www.pathpilot.ai', 'http://localhost:3000'];
  if (allowed.includes(origin)) return origin;
  return 'https://pathpilot.ai';
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
