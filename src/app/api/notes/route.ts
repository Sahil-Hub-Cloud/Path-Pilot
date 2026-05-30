import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { generateWithResilience, MODELS_LIGHT } from '@/lib/gemini-resilience';

export const dynamic = 'force-dynamic';

function languageLabel(lang?: string): string {
  if (!lang) return 'English';
  const l = lang.toLowerCase();
  if (l === 'hindi') return 'Hindi';
  if (l === 'telugu') return 'Telugu';
  return 'English';
}

export async function POST(request: Request) {
  console.log('[/api/notes] POST received');

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[/api/notes] Missing GEMINI_API_KEY');
    return NextResponse.json(
      { error: 'GEMINI_API_KEY is not configured on the server.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { topicName, courseName, language, courseId, topicId } = body;
    console.log('[/api/notes] body =', JSON.stringify({ topicName, courseName, language, courseId, topicId }));

    if (!topicName || !courseName) {
      return NextResponse.json(
        { error: 'topicName and courseName are required' },
        { status: 400 }
      );
    }

    if (!courseId || !topicId) {
      console.warn('[/api/notes] courseId or topicId missing — skipping Firestore cache');
    }

    const lang = languageLabel(language);
    const cacheKey = courseId && topicId ? `notes_${courseId}_${topicId}_${lang}` : undefined;

    const langPrompt = lang === 'English' ? 'simple English' : `simple ${lang}`;
    const prompt = `Explain ${topicName} from ${courseName} in ${langPrompt} for Indian engineering student. Structure: 1) Simple Definition (2-3 sentences) 2) Key Concepts (5 bullets) 3) Real World Example (3-4 sentences) 4) Common Mistakes (3 bullets) 5) Quick Summary (1 sentence). Max 300 words.`;

    const { text: notes, model, cached } = await generateWithResilience({
      apiKey,
      prompt,
      featureName: 'notes',
      cacheKey,
      models: MODELS_LIGHT,
      timeoutMs: 15000,
      logPrefix: '[/api/notes]',
      cacheMeta: { courseId, topicId, language: lang },
    });

    // Also write to legacy topic_notes collection for backward compatibility
    if (!cached && courseId && topicId) {
      try {
        await adminDb.collection('topic_notes').doc(`${courseId}_${topicId}_${lang}`).set({
          courseId,
          topicId,
          notes,
          language: lang,
          createdAt: Date.now(),
        });
      } catch (e) {
        console.warn('[/api/notes] Failed to write legacy topic_notes cache:', e);
      }
    }

    return NextResponse.json({
      notes,
      content: notes,
      model,
      cached,
      generatedAt: Date.now(),
    });

  } catch (error: any) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[/api/notes] ERROR:', message);

    if (message.startsWith('QUOTA_EXCEEDED')) {
      return NextResponse.json({
        notes: 'Notes are temporarily unavailable — daily limit reached. Please check back tomorrow.',
        isFallback: true,
      });
    }

    if (message.includes('paused by admin')) {
      return NextResponse.json({
        notes: 'AI Notes are currently paused for maintenance. Please check back soon.',
        isFallback: true,
      });
    }

    if (message.includes('timed out') || message.includes('429') || message.toLowerCase().includes('quota')) {
      return NextResponse.json({
        notes: 'Notes are being prepared for this topic. Please check back soon.',
        isFallback: true,
      });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
