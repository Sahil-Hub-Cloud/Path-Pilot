import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.json();
  const {
    topicName,
    topicId,
    courseName,
    courseId,
    language = 'english',
  } = body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[/api/notes] Missing GEMINI_API_KEY');
    return NextResponse.json(
      { error: 'GEMINI_API_KEY is not configured on the server.' },
      { status: 500 }
    );
  }

  if (!topicName || !courseName) {
    return NextResponse.json(
      { error: 'topicName and courseName are required' },
      { status: 400 }
    );
  }

  const lang = (language || 'english').toLowerCase();

  // Create a unique permanent cache ID — one entry per course + topic + language
  const cacheId = `${courseId}__${topicId}__${lang}`;

  console.log(`[/api/notes] POST | cacheId=${cacheId} | topic="${topicName}"`);

  // ── Step 1: Check Firestore permanent cache first ────────────────────────
  if (courseId && topicId) {
    try {
      const cacheRef = adminDb.collection('notes_cache').doc(cacheId);
      const cacheSnap = await cacheRef.get();

      if (cacheSnap.exists) {
        const data = cacheSnap.data()!;
        console.log(`[/api/notes] Cache HIT — returning stored notes, no Gemini call`);
        return NextResponse.json({
          content: data.content,
          notes:   data.content,
          cached:  true,
          generatedAt: data.generatedAt ?? null,
        });
      }
    } catch (cacheErr) {
      console.log('[/api/notes] Cache read failed, will generate fresh notes:', cacheErr);
    }
  }

  // ── Step 2: Notes don't exist yet — generate with Gemini ONCE ────────────
  try {
    // Strict language instruction — prevents mixing scripts
    const languageInstruction =
      lang === 'telugu'
        ? 'Write ENTIRELY in Telugu language using Telugu script only.'
        : lang === 'hindi'
        ? 'Write ENTIRELY in Hindi language using Devanagari script only.'
        : 'Write ENTIRELY in English. Do not use Telugu or Hindi words.';

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `${languageInstruction}
You are an expert coding teacher for Indian engineering students.
Explain the topic: ${topicName} from the course: ${courseName}

Structure your response exactly like this:
## What is ${topicName}?
(2-3 simple sentences)

## Key Concepts
(5 bullet points)

## Code Example
(practical code example if applicable)

## Real World Use
(where this is used in real projects, 2-3 sentences)

## Quick Summary
(1 sentence summary)

Keep it simple and clear. Maximum 400 words.`;

    console.log(`[/api/notes] Calling Gemini for cacheId=${cacheId}`);
    const result = await model.generateContent(prompt);
    const content = result.response.text();

    if (!content || !content.trim()) {
      throw new Error('Gemini returned empty content');
    }

    // ── Step 3: Save to Firestore PERMANENTLY — never generate again ────────
    if (courseId && topicId) {
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
        console.log(`[/api/notes] Permanently cached: ${cacheId}`);
      } catch (writeErr) {
        console.warn('[/api/notes] Failed to write to notes_cache:', writeErr);
        // Non-blocking — still return the content even if write fails
      }
    }

    return NextResponse.json({
      content,
      notes:       content,
      cached:      false,
      generatedAt: new Date().toISOString(),
    });

  } catch (error: any) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[/api/notes] ERROR:', message);

    if (message.includes('429') || message.toLowerCase().includes('quota')) {
      return NextResponse.json(
        {
          error: 'Notes are being prepared. Please try again in a few minutes.',
          rateLimited: true,
        },
        { status: 429 }
      );
    }

    return NextResponse.json({ error: 'Could not generate notes' }, { status: 500 });
  }
}
