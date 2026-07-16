export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    let userId: string;
    try {
      const decoded = await auth.verifyIdToken(authHeader.split('Bearer ')[1]);
      userId = decoded.uid;
    } catch (e) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const geminiRateLimiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(30, '1m'),
      prefix: 'rl_gemini',
    });

    const { success: geminiAllowed } = await geminiRateLimiter.limit(userId);
    if (!geminiAllowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before sending another request.' },
        { status: 429 }
      );
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI Service configuration missing' }, { status: 500 });
    }

    const MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash'];
    let responseData: any = null;

    for (const modelName of MODELS) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      console.log(`[/api/gemini] Trying model: ${modelName} | Endpoint: ${endpoint.split('?')[0]}`);
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (response.status === 404 || response.status === 400) {
          console.warn(`[/api/gemini] Model ${modelName} returned ${response.status}, trying next...`);
          continue;
        }

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error?.message || 'Unknown Gemini API Error');
        }
        console.log(`[/api/gemini] Success with model: ${modelName}`);
        responseData = data;
        break;
      } catch (fetchErr: any) {
        console.warn(`[/api/gemini] Error for ${modelName}:`, fetchErr?.message);
      }
    }

    if (!responseData) {
      throw new Error('All Gemini models failed to respond.');
    }

    const text = responseData?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, my neural pathways are currently recalibrating.";

    return NextResponse.json({ text });

  } catch (error) {
    // Log the real error server-side
    console.error('[Gemini API] Error:', (error as Error).message);
    // Return only a generic message to the client — never leak internal details
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}

