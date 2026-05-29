import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const MODEL_PRIORITY = [
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-pro',
];

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

function languageLabel(lang?: string): string {
  if (!lang) return 'English';
  const l = lang.toLowerCase();
  if (l === 'hindi') return 'Hindi';
  if (l === 'telugu') return 'Telugu';
  return 'English';
}

export async function POST(request: Request) {
  console.log('[/api/notes] Step 1: POST received');

  const apiKey = process.env.GEMINI_API_KEY;
  console.log('[/api/notes] Step 2: GEMINI_API_KEY configured:', !!apiKey);

  if (!apiKey) {
    console.error('[/api/notes] Step 2b: Missing GEMINI_API_KEY');
    return NextResponse.json(
      { error: 'GEMINI_API_KEY is not configured on the server.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { topicName, courseName, language } = body;
    console.log('[/api/notes] Step 3: body parsed', { topicName, courseName, language });

    if (!topicName || !courseName) {
      return NextResponse.json(
        { error: 'topicName and courseName are required' },
        { status: 400 }
      );
    }

    const lang = languageLabel(language);
    const prompt = `Explain ${topicName} from ${courseName} course in simple ${lang} for an Indian engineering student. Structure your response as markdown with these sections:
1) Simple Definition (2-3 sentences)
2) Key Concepts (5 bullet points)
3) Real World Example (3-4 sentences)
4) Common Mistakes (3 bullets)
5) Quick Summary (1 sentence)

Keep under 300 words. Use clear headings (##) for each section.`;

    console.log('[/api/notes] Step 4: Calling Gemini…');

    let lastError: Error | null = null;

    for (const modelName of MODEL_PRIORITY) {
      try {
        console.log(`[/api/notes] Step 4a: Trying model ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const notes = result.response.text()?.trim() || '';

        if (!notes) {
          throw new Error('Empty response from Gemini');
        }

        console.log(`[/api/notes] Step 5: Success (${modelName}), length=${notes.length}`);
        return NextResponse.json({
          notes,
          content: notes,
          model: modelName,
          generatedAt: Date.now(),
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn(`[/api/notes] Model ${modelName} failed:`, message);
        lastError = err instanceof Error ? err : new Error(message);
        const msg = message.toLowerCase();
        if (!msg.includes('404') && !msg.includes('not found') && !msg.includes('not supported')) {
          break;
        }
      }
    }

    console.error('[/api/notes] Step 6: All models failed', lastError?.message);
    return NextResponse.json(
      {
        error: lastError?.message || 'Gemini failed to generate notes',
      },
      { status: 500 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate notes';
    console.error('[/api/notes] Step ERROR:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
