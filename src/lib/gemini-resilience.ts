/**
 * gemini-resilience.ts
 * Shared resilience utilities for all Gemini-powered API routes.
 * Provides: response caching (glm_outputs), retry/backoff, 15s timeout,
 * per-feature daily quota tracking (usage_limits), and usage logging.
 */

import { adminDb } from '@/lib/firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ─── Model routing ────────────────────────────────────────────────────────────
/** Heavy tasks: PDF parsing, flashcard generation */
export const MODELS_HEAVY = [
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
];

/** Light tasks: notes, MCQ fallback */
export const MODELS_LIGHT = [
  'gemini-2.5-flash',
  'gemini-2.0-flash-001',
  'gemini-2.0-flash',
  'gemini-2.5-flash-lite',
];

// ─── Quota limits ─────────────────────────────────────────────────────────────
const DAILY_LIMITS: Record<string, number> = {
  'pdf-process':   500,
  'flashcards':    500,
  'notes':         2000,
  'quiz':          2000,
  'challenge':     2000,
  'default':       1000,
};

// ─── Types ────────────────────────────────────────────────────────────────────
export interface GeminiResult {
  text: string;
  model: string;
  cached: boolean;
}

// ─── Firestore helpers ────────────────────────────────────────────────────────

/** Check whether a GLM feature is enabled via admin toggle. */
export async function isFeatureEnabled(featureName: string): Promise<boolean> {
  try {
    const ref = adminDb.collection('glm_settings').doc('features');
    const snap = await ref.get();
    if (!snap.exists) return true; // default: enabled
    const data = snap.data() as Record<string, boolean>;
    // If specific key exists and is false, disabled
    if (data[featureName] === false) return false;
    return true;
  } catch {
    return true; // fail-open
  }
}

/** Increment daily usage counter and check quota. Returns true if over limit. */
export async function isOverQuota(featureName: string): Promise<boolean> {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const docId = `${today}_${featureName}`;
  const limit = DAILY_LIMITS[featureName] ?? DAILY_LIMITS['default'];

  try {
    const ref = adminDb.collection('usage_limits').doc(docId);
    const snap = await ref.get();
    const current = (snap.data()?.count as number) ?? 0;

    if (current >= limit) {
      console.warn(`[quota] ${featureName} OVER LIMIT (${current}/${limit}) on ${today}`);
      return true;
    }

    // Log warning at 80%
    if (current >= limit * 0.8) {
      console.warn(`[quota] ${featureName} at ${Math.round((current / limit) * 100)}% quota (${current}/${limit})`);
    }

    // Increment counter
    await ref.set(
      { featureName, date: today, count: current + 1 },
      { merge: true }
    );
    return false;
  } catch {
    return false; // fail-open
  }
}

/** Read from glm_outputs cache. Returns null on miss or expired (>7 days). */
export async function readGlmCache(cacheKey: string): Promise<string | null> {
  try {
    const ref = adminDb.collection('glm_outputs').doc(cacheKey);
    const snap = await ref.get();
    if (!snap.exists) return null;
    const data = snap.data();
    if (!data?.content) return null;
    // 7-day TTL
    const age = Date.now() - (data.generatedAt ?? 0);
    if (age > 7 * 24 * 60 * 60 * 1000) {
      console.log(`[glm_cache] Expired cache for key: ${cacheKey}`);
      return null;
    }
    console.log(`[glm_cache] Cache HIT for key: ${cacheKey}`);
    return data.content as string;
  } catch {
    return null;
  }
}

/** Write text content to glm_outputs cache. */
export async function writeGlmCache(
  cacheKey: string,
  content: string,
  meta: Record<string, unknown> = {}
): Promise<void> {
  try {
    await adminDb.collection('glm_outputs').doc(cacheKey).set({
      content,
      generatedAt: Date.now(),
      ...meta,
    });
  } catch (e) {
    console.warn('[glm_cache] Failed to write cache:', e);
  }
}

// ─── Core generation function ─────────────────────────────────────────────────

interface GenerateOptions {
  apiKey: string;
  prompt: string;
  featureName: string;
  cacheKey?: string;            // omit to skip caching
  models?: string[];            // defaults to MODELS_LIGHT
  timeoutMs?: number;           // default 15000
  logPrefix?: string;
  cacheMeta?: Record<string, unknown>;
}

/**
 * Main resilient generation wrapper.
 * - Checks glm_outputs cache first
 * - Checks/increments daily quota
 * - Retries up to 2× with exponential backoff on 429/5xx
 * - Enforces 15s timeout per attempt
 * - Logs feature_name, model, status, tokens estimate
 */
export async function generateWithResilience(opts: GenerateOptions): Promise<GeminiResult> {
  const {
    apiKey,
    prompt,
    featureName,
    cacheKey,
    models = MODELS_LIGHT,
    timeoutMs = 15000,
    logPrefix = `[${featureName}]`,
    cacheMeta = {},
  } = opts;

  // 1. Cache check
  if (cacheKey) {
    const cached = await readGlmCache(cacheKey);
    if (cached) {
      console.log(`${logPrefix} feature=${featureName} status=cache_hit key=${cacheKey}`);
      return { text: cached, model: 'cached', cached: true };
    }
  }

  // 2. Feature toggle check
  const enabled = await isFeatureEnabled(featureName);
  if (!enabled) {
    throw new Error(`Feature "${featureName}" is currently paused by admin.`);
  }

  // 3. Quota check
  const overQuota = await isOverQuota(featureName);
  if (overQuota) {
    throw new Error(`QUOTA_EXCEEDED:${featureName}`);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: Error = new Error('No models attempted');

  // 4. Model iteration with retry + backoff
  for (const modelName of models) {
    const maxAttempts = 3; // 1 original + 2 retries
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`${logPrefix} feature=${featureName} model=${modelName} attempt=${attempt}`);

        const model = genAI.getGenerativeModel({ model: modelName });

        // Timeout wrapper
        const text = await withTimeout(
          model.generateContent(prompt).then((r) => r.response.text()?.trim() || ''),
          timeoutMs,
          `${featureName} Gemini call timed out after ${timeoutMs}ms`
        );

        if (!text) throw new Error('Empty response from Gemini');

        const tokenEstimate = Math.round(text.length / 4);
        console.log(
          `${logPrefix} feature=${featureName} model=${modelName} status=200 tokens_est=${tokenEstimate} attempt=${attempt}`
        );

        // 5. Write cache
        if (cacheKey) {
          await writeGlmCache(cacheKey, text, { featureName, model: modelName, ...cacheMeta });
        }

        return { text, model: modelName, cached: false };

      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        const status = extractStatus(msg);

        console.warn(
          `${logPrefix} feature=${featureName} model=${modelName} status=${status} attempt=${attempt} error=${msg}`
        );

        // Don't retry on 404/model-not-found — try next model instead
        if (is404Error(msg)) break;

        // Retry on 429 / 5xx
        if ((status === 429 || status >= 500) && attempt < maxAttempts) {
          const backoff = attempt === 1 ? 1000 : 3000;
          console.log(`${logPrefix} Backing off ${backoff}ms before retry…`);
          await sleep(backoff);
          continue;
        }

        lastError = err instanceof Error ? err : new Error(msg);
        break; // fatal or exhausted retries — try next model
      }
    }
  }

  throw lastError;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    promise.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); }
    );
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function extractStatus(msg: string): number {
  const m = msg.match(/\b(4\d{2}|5\d{2})\b/);
  return m ? parseInt(m[1]) : 0;
}

function is404Error(msg: string): boolean {
  const m = msg.toLowerCase();
  return m.includes('404') || m.includes('not found') || m.includes('not supported');
}
