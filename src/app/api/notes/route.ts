export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
      await adminAuth.verifyIdToken(authHeader.split('Bearer ')[1]);
    } catch (e) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { topicName, courseName, language } = body;

    if (!topicName || !courseName) {
      return NextResponse.json({ error: 'topicName and courseName are required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        notes: `**${topicName}** — Notes Unavailable\n\nAdd GEMINI_API_KEY to your .env.local file to enable AI-generated notes.`,
        generatedAt: Date.now()
      });
    }

    const langInstruction = language ? `Respond in ${language}.` : '';
    const prompt = `Explain ${topicName} from ${courseName} in simple English for an Indian engineering student. Give: 1) 3-sentence summary, 2) 5 key bullet points, 3) one real-world example. Maximum 250 words total. ${langInstruction}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 512,
          },
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Notes generation failed.';

    return NextResponse.json({ 
      notes: text,
      generatedAt: Date.now()
    });
  } catch (err: any) {
    console.error('[/api/notes]', err.message);
    return NextResponse.json(
      { notes: `Notes unavailable right now. Try again later.`, generatedAt: Date.now() },
      { status: 200 }
    );
  }
}

