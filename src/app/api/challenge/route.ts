export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export interface ChallengePayload {
  title: string;
  description: string;
  expectedOutput: string;
  hints: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  labId?: string;
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
      await adminAuth.verifyIdToken(authHeader.split('Bearer ')[1]);
    } catch {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { topicName, courseName } = body;

    if (!topicName || !courseName) {
      return NextResponse.json({ error: 'topicName and courseName are required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        challenge: {
          title: `${topicName} Practice`,
          description: `Practice applying ${topicName} concepts from ${courseName}. Configure GEMINI_API_KEY for AI-generated challenges.`,
          expectedOutput: 'Correct program output matching the problem statement.',
          hints: ['Break the problem into smaller steps.', 'Test with a simple example first.'],
          difficulty: 'Medium' as const,
        },
        generatedAt: Date.now(),
      });
    }

    const prompt = `You are a coding instructor for Indian engineering students.

Create ONE coding challenge for the topic "${topicName}" in the course "${courseName}".

Return ONLY valid JSON (no markdown fences) with this exact shape:
{
  "title": "short challenge title",
  "description": "clear problem statement in 2-4 sentences",
  "expectedOutput": "what stdout should look like for a correct solution",
  "hints": ["hint 1", "hint 2", "hint 3"],
  "difficulty": "Easy" | "Medium" | "Hard"
}

Rules:
- Appropriate for beginners to intermediate students
- No trick questions
- hints must guide thinking, not give full solutions
- difficulty must match topic complexity`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 800,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const cleaned = raw.replace(/```json|```/g, '').trim();

    let challenge: ChallengePayload;
    try {
      const parsed = JSON.parse(cleaned);
      challenge = {
        title: String(parsed.title || `${topicName} Challenge`),
        description: String(parsed.description || `Solve a problem related to ${topicName}.`),
        expectedOutput: String(parsed.expectedOutput || 'Program runs without errors and matches expected output.'),
        hints: Array.isArray(parsed.hints) ? parsed.hints.map(String).slice(0, 5) : ['Read the problem carefully.', 'Start with pseudocode.'],
        difficulty: ['Easy', 'Medium', 'Hard'].includes(parsed.difficulty) ? parsed.difficulty : 'Medium',
      };
    } catch {
      challenge = {
        title: `${topicName} Challenge`,
        description: `Apply what you learned about ${topicName} in ${courseName}.`,
        expectedOutput: 'Correct output as described in the problem.',
        hints: ['Plan before coding.', 'Test edge cases.'],
        difficulty: 'Medium',
      };
    }

    return NextResponse.json({ challenge, generatedAt: Date.now() });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Challenge generation failed';
    console.error('[/api/challenge]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
