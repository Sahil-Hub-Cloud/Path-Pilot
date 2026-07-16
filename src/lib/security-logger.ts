import { adminAuth, adminDb } from './firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export type SecurityEventType =
  | 'auth_success' | 'auth_failure' | 'auth_suspicious'
  | 'api_abuse' | 'rate_limit_breach'
  | 'code_execution' | 'malicious_code_detected'
  | 'data_access_anomaly'
  | 'admin_action'
  | 'system_error';

export interface SecurityEvent {
  type: SecurityEventType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  ip?: string;
  path?: string;
  details: Record<string, unknown>;
  timestamp: Timestamp;
}

const WEBHOOK_URL = process.env.SECURITY_WEBHOOK_URL;
const CRITICAL_EVENTS: SecurityEventType[] = ['api_abuse', 'malicious_code_detected', 'data_access_anomaly'];

export async function logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): Promise<void> {
  try {
    const docRef = await adminDb.collection('security_logs').add({
      ...event,
      timestamp: Timestamp.now(),
    });

    // Fire webhook for critical events
    if (CRITICAL_EVENTS.includes(event.type) && WEBHOOK_URL) {
      fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, docId: docRef.id }),
        signal: AbortSignal.timeout(5000),
      }).catch(err => {
        console.error('[Security Webhook] Failed:', err.message);
      });
    }
  } catch (err) {
    console.error('[Security Logger] Failed to write event:', err);
  }
}
