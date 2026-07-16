import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { isCodeMalicious, hardenCode, judge0SandboxConfig } from '@/lib/api-security';
import { logSecurityEvent } from '@/lib/security-logger';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const JUDGE0_URL = process.env.JUDGE0_URL || 'https://ce.judge0.com';
const JUDGE0_KEY = process.env.JUDGE0_API_KEY || '';

const LANG_MAP: Record<string, number> = {
  python: 71,
  javascript: 63,
  typescript: 74,
  java: 62,
  cpp: 54,
  go: 60,
  rust: 73,
};

const MAX_CODE_LENGTH = 50000;

const rateLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1m'),
  prefix: 'rl_execute',
});

export async function POST(request: NextRequest) {
  try {
    // === AUTH CHECK ===
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    let userId: string;
    try {
      const token = authHeader.split('Bearer ')[1];
      const decoded = await adminAuth.verifyIdToken(token);
      userId = decoded.uid;
    } catch {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // === PER-USER RATE LIMITING ===
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const { success, remaining } = await rateLimiter.limit(`${userId}:${ip}`);
    if (!success) {
      await logSecurityEvent({
        type: 'rate_limit_breach',
        severity: 'medium',
        userId,
        ip,
        path: '/api/execute',
        details: { reason: 'Rate limit exceeded on code execution' },
      });
      return NextResponse.json({ error: 'Too many execution requests', retryAfter: 60 }, { status: 429 });
    }

    // === PARSE & VALIDATE BODY ===
    let body: { language?: string; code?: string; testSuite?: string[] };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { language, code, testSuite } = body;

    if (!language || !code) {
      return NextResponse.json({ error: 'language and code are required' }, { status: 400 });
    }

    const langId = LANG_MAP[language.toLowerCase()];
    if (!langId) {
      return NextResponse.json({ error: `Unsupported language: ${language}` }, { status: 400 });
    }

    if (code.length > MAX_CODE_LENGTH) {
      return NextResponse.json({ error: 'Code exceeds maximum length of 50KB' }, { status: 400 });
    }

    // === MALICIOUS CODE CHECK ===
    if (isCodeMalicious(code)) {
      await logSecurityEvent({
        type: 'malicious_code_detected',
        severity: 'critical',
        userId,
        ip,
        path: '/api/execute',
        details: { language, codeLength: code.length },
      });
      return NextResponse.json({ error: 'Code contains prohibited patterns' }, { status: 400 });
    }

    // === HARDEN CODE ===
    const hardenedCode = hardenCode(code, language);

    // === BUILD JUDGE0 SUBMISSION WITH SANDBOX CONFIG ===
    const submissionPayload = {
      source_code: hardenedCode,
      language_id: langId,
      stdin: testSuite?.join('\n') || '',
      ...judge0SandboxConfig,
    };

    // === SUBMIT TO JUDGE0 ===
    const submitRes = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(JUDGE0_KEY ? { 'X-Auth-Token': JUDGE0_KEY } : {}),
      },
      body: JSON.stringify(submissionPayload),
    });

    if (!submitRes.ok) {
      const errorText = await submitRes.text();
      await logSecurityEvent({
        type: 'system_error',
        severity: 'high',
        userId,
        path: '/api/execute',
        details: { judge0Status: submitRes.status, judge0Error: errorText.slice(0, 500) },
      });
      return NextResponse.json({ error: 'Code execution service unavailable' }, { status: 502 });
    }

    const result = await submitRes.json();

    // === LOG SUCCESS ===
    await logSecurityEvent({
      type: 'code_execution',
      severity: 'low',
      userId,
      ip,
      path: '/api/execute',
      details: { language, codeLength: code.length, judge0Token: result.token },
    });

    // === RETURN SANITIZED RESULT ===
    return NextResponse.json({
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      compile_output: result.compile_output || '',
      time: result.time,
      memory: result.memory,
      exit_code: result.exit_code,
      status: result.status?.description || 'Unknown',
    });

  } catch (error) {
    await logSecurityEvent({
      type: 'system_error',
      severity: 'high',
      path: '/api/execute',
      details: { errorMessage: (error as Error).message },
    });
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
