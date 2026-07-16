import { adminAuth } from './firebase-admin';

export async function setSessionClaim(uid: string): Promise<void> {
  await adminAuth.setCustomUserClaims(uid, {
    sessionStartedAt: Date.now(),
  });
}

export async function verifySession(uid: string): Promise<boolean> {
  try {
    const user = await adminAuth.getUser(uid);
    const claims = user.customClaims || {};
    const startedAt = claims.sessionStartedAt as number | undefined;

    if (!startedAt) return false;

    const elapsed = Date.now() - startedAt;
    const MAX_SESSION_MS = 24 * 60 * 60 * 1000; // 24 hours

    if (elapsed > MAX_SESSION_MS) {
      await adminAuth.revokeRefreshTokens(uid);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
