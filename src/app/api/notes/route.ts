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
    const { topicName, courseName } = body;

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

    const prompt = `You are an expert coding teacher for Indian engineering students. Explain ${topicName} from ${courseName} course. Use simple English mixed with Hindi/Telugu terms where helpful. Structure: ## What is it? (2-3 sentences) ## Key Concepts (5 bullet points) ## Code Example (if applicable) ## Real World Use (2-3 sentences) ## Quick Summary (1 sentence). Maximum 350 words.`;

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
