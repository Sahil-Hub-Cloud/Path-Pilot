import { NextResponse } from 'next/server';
import { generateTextWithFallback } from '@/lib/gemini-models';

export const dynamic = 'force-dynamic';

export interface Challenge {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  starterCode: string;
  testCases: { input: string; expectedOutput: string }[];
}

export async function POST(request: Request) {
  console.log('[/api/challenges/generate] POST received');

  const apiKey = process.env.GEMINI_API_KEY;
  console.log('[/api/challenges/generate] GEMINI_API_KEY configured:', !!apiKey);

  if (!apiKey) {
    console.error('[/api/challenges/generate] Missing GEMINI_API_KEY');
    return NextResponse.json(
      { error: 'GEMINI_API_KEY is not configured on the server.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { topicName, courseName } = body;
    console.log('[/api/challenges/generate] body parsed', { topicName, courseName });

    if (!topicName || !courseName) {
      return NextResponse.json(
        { error: 'topicName and courseName are required' },
        { status: 400 }
      );
    }

    const prompt = `Generate 3 coding challenges for ${topicName} in ${courseName}. Each challenge should have:
- title
- difficulty (Easy/Medium/Hard)
- description
- starter code
- test cases (array of objects with input and expectedOutput)

Return as JSON array. Make challenges specific to ${topicName} from ${courseName} course.`;

    console.log('[/api/challenges/generate] Calling Gemini…');
    const { text: response, model } = await generateTextWithFallback(apiKey, prompt, '[/api/challenges/generate]');

    console.log(`[/api/challenges/generate] Success (${model}), length=${response.length}`);

    // Parse the JSON response
    let challenges: Challenge[];
    try {
      // Clean the response to remove markdown code blocks if present
      const cleaned = response.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      
      // Validate and format the challenges
      challenges = Array.isArray(parsed) ? parsed.slice(0, 3) : [parsed];
      
      // Ensure each challenge has required fields
      challenges = challenges.map((c: any) => ({
        title: c.title || `${topicName} Challenge`,
        difficulty: ['Easy', 'Medium', 'Hard'].includes(c.difficulty) ? c.difficulty : 'Medium',
        description: c.description || `Apply ${topicName} concepts from ${courseName}.`,
        starterCode: c.starterCode || '// Starter code\nfunction solution() {\n  // TODO: implement\n}',
        testCases: Array.isArray(c.testCases) ? c.testCases.slice(0, 3) : [{ input: '', expectedOutput: '' }],
      }));
    } catch (parseError) {
      console.error('[/api/challenges/generate] JSON parse error:', parseError);
      // Return fallback challenges if parsing fails
      challenges = [
        {
          title: `${topicName} Challenge 1`,
          difficulty: 'Easy',
          description: `Basic ${topicName} problem from ${courseName}.`,
          starterCode: '// Starter code\nfunction solution() {\n  // TODO: implement\n}',
          testCases: [{ input: 'test1', expectedOutput: 'result1' }],
        },
        {
          title: `${topicName} Challenge 2`,
          difficulty: 'Medium',
          description: `Intermediate ${topicName} problem from ${courseName}.`,
          starterCode: '// Starter code\nfunction solution() {\n  // TODO: implement\n}',
          testCases: [{ input: 'test2', expectedOutput: 'result2' }],
        },
        {
          title: `${topicName} Challenge 3`,
          difficulty: 'Hard',
          description: `Advanced ${topicName} problem from ${courseName}.`,
          starterCode: '// Starter code\nfunction solution() {\n  // TODO: implement\n}',
          testCases: [{ input: 'test3', expectedOutput: 'result3' }],
        },
      ];
    }

    return NextResponse.json({
      challenges,
      model,
      generatedAt: Date.now(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate challenges';
    console.error('[/api/challenges/generate] ERROR:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
