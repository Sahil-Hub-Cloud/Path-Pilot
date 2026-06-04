import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

// ── Safely import firebase-admin (may not be configured) ────────────────────
let adminDb: FirebaseFirestore.Firestore | null = null;
let FieldValue: typeof import('firebase-admin/firestore').FieldValue | null = null;

try {
  const firebaseAdmin = require('@/lib/firebase-admin');
  adminDb = firebaseAdmin.adminDb;
  const firestoreModule = require('firebase-admin/firestore');
  FieldValue = firestoreModule.FieldValue;
  console.log('[/api/notes] Firebase Admin loaded successfully');
} catch (err) {
  console.warn('[/api/notes] Firebase Admin not available — Firestore caching disabled:', err);
}

export async function POST(request: Request) {
  console.log('[/api/notes] ── POST request received ──');

  let body: any;
  try {
    body = await request.json();
  } catch (parseErr) {
    console.error('[/api/notes] Failed to parse request body:', parseErr);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const {
    topicName,
    topicId,
    courseName,
    courseId,
    difficulty = 'Beginner',
    language = 'english',
  } = body;

  console.log('[/api/notes] Request params:', { topicName, topicId, courseName, courseId, difficulty, language });

  // ── Validate API key ──────────────────────────────────────────────────────
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[/api/notes] GEMINI_API_KEY is missing from process.env');
    console.error('[/api/notes] Available env keys:', Object.keys(process.env).filter(k => k.includes('GEMINI') || k.includes('API')).join(', '));
    return NextResponse.json(
      { error: 'GEMINI_API_KEY is not configured on the server.' },
      { status: 500 }
    );
  }
  console.log('[/api/notes] GEMINI_API_KEY found (length=' + apiKey.length + ')');

  // ── Validate required fields ──────────────────────────────────────────────
  if (!topicName || !courseName) {
    console.error('[/api/notes] Missing required fields:', { topicName, courseName });
    return NextResponse.json(
      { error: 'topicName and courseName are required' },
      { status: 400 }
    );
  }

  const lang = (language || 'english').toLowerCase();
  const cacheId = courseId && topicId ? `${courseId}__${topicId}__${lang}` : null;

  console.log(`[/api/notes] cacheId=${cacheId}`);

  // ── Step 1: Check Firestore cache (optional — skip if not configured) ─────
  if (cacheId && adminDb) {
    try {
      const cacheRef = adminDb.collection('notes_cache').doc(cacheId);
      const cacheSnap = await cacheRef.get();

      if (cacheSnap.exists) {
        const data = cacheSnap.data()!;
        console.log('[/api/notes] ✅ Firestore cache HIT — returning stored notes');
        return NextResponse.json({
          notes: data.content,
          generatedAt: data.generatedAt ?? new Date().toISOString(),
          cached: true,
        });
      }
      console.log('[/api/notes] Firestore cache MISS');
    } catch (cacheErr) {
      console.warn('[/api/notes] Firestore cache read failed (continuing to Gemini):', cacheErr);
      // Don't crash — just skip cache and generate fresh
    }
  } else if (!adminDb) {
    console.log('[/api/notes] Firestore not available — skipping cache check');
  }

  // ── Step 2: Generate with Gemini ──────────────────────────────────────────
  try {
    const languageInstruction =
      lang === 'telugu'
        ? 'Write ENTIRELY in Telugu language using Telugu script only.'
        : lang === 'hindi'
        ? 'Write ENTIRELY in Hindi language using Devanagari script only.'
        : 'Write ENTIRELY in English. Do not use Telugu or Hindi words.';

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `${languageInstruction}
You are an expert coding teacher for Indian engineering students. Explain ${topicName} from ${courseName} course. Use simple English mixed with Hindi/Telugu terms where helpful. Structure your response as:

## What is ${topicName}?
(2-3 simple sentences)

## Key Concepts
- (5 bullet points with code examples where applicable)

## Simple Example
(code example if applicable)

## Real World Use
(where this is used in real projects - 2-3 sentences)

## Quick Summary
(1 sentence)

Keep language simple and beginner-friendly. Maximum 400 words.`;

    console.log('[/api/notes] Calling Gemini gemini-2.0-flash-exp...');
    const startTime = Date.now();
    const result = await model.generateContent(prompt);
    const content = result.response.text();
    const elapsed = Date.now() - startTime;

    console.log(`[/api/notes] Gemini responded in ${elapsed}ms | content length=${content?.length ?? 0}`);

    if (!content || !content.trim()) {
      console.error('[/api/notes] Gemini returned empty content');
      return NextResponse.json(
        { error: 'Could not generate notes. Please try again.' },
        { status: 500 }
      );
    }

    const generatedAt = new Date().toISOString();

    // ── Step 3: Save to Firestore cache (optional) ────────────────────────
    if (cacheId && adminDb && FieldValue) {
      try {
        await adminDb.collection('notes_cache').doc(cacheId).set({
          content,
          topicName,
          topicId,
          courseName,
          courseId,
          language: lang,
          generatedAt: FieldValue.serverTimestamp(),
          permanent: true,
        });
        console.log(`[/api/notes] ✅ Cached to Firestore: ${cacheId}`);
      } catch (writeErr) {
        console.warn('[/api/notes] Firestore write failed (non-blocking):', writeErr);
      }
    }

    console.log('[/api/notes] ✅ Returning generated notes');
    return NextResponse.json({
      notes: content,
      generatedAt,
      cached: false,
    });

  } catch (error: any) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : '';
    console.error('[/api/notes] ❌ Gemini ERROR:', message);
    console.error('[/api/notes] Stack:', stack);

    if (message.includes('429') || message.toLowerCase().includes('quota')) {
      return NextResponse.json(
        { error: 'Notes are being prepared. Please try again in a few minutes.' },
        { status: 429 }
      );
    }

    if (message.toLowerCase().includes('api key') || message.toLowerCase().includes('permission')) {
      return NextResponse.json(
        { error: 'Gemini API key is invalid or has insufficient permissions.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Could not generate notes. Please try again.' },
      { status: 500 }
    );
  }
}
