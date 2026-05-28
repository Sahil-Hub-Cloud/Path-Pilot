export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      try {
        await adminAuth.verifyIdToken(authHeader.split('Bearer ')[1]);
      } catch (e) {
        console.warn('Notes API: Token verification bypassed/failed, proceeding:', e);
      }
    }

    const body = await req.json();
    const { topicName, courseName, language } = body;

    if (!topicName || !courseName) {
      return NextResponse.json({ error: 'topicName and courseName are required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        notes: `**${topicName}** — Notes Unavailable\n\nConfigure GEMINI_API_KEY in Vercel / environment variables to enable AI-generated notes.`,
        generatedAt: Date.now()
      });
    }

    const prompt = `Explain ${topicName} from ${courseName} course in simple English for an Indian engineering student. Structure as: 1) Simple Definition (2-3 sentences) 2) Key Concepts (5 bullet points) 3) Real World Example (3-4 sentences) 4) Common Mistakes (3 bullet points) 5) Quick Summary (1 sentence). Keep under 300 words.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Gemini API error in notes:', errorText);
      throw new Error(`Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Notes generation failed.';

    return NextResponse.json({ 
      notes: text,
      generatedAt: Date.now()
    });
  } catch (err: any) {
    console.error('[/api/notes] Error:', err.message);
    return NextResponse.json(
      { notes: `Notes unavailable right now. Try again later.`, generatedAt: Date.now() },
      { status: 200 }
    );
  }
}
