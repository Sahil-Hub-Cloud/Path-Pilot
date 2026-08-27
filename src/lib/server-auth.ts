import { NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

/**
 * Verify Bearer idToken from Authorization header.
 * Returns { uid, token } or null.
 */
export async function verifyRequestAuth(req: NextRequest): Promise<{ uid: string; email?: string } | null> {
  const auth = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.slice(7).trim();
  if (!token) return null;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email };
  } catch {
    return null;
  }
}

export function requireAuthResponse() {
  return new Response(JSON.stringify({ error: 'Unauthorized — missing or invalid token' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}
