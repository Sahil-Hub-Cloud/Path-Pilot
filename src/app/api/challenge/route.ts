export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { GEMINI_GENERATE_MODELS } from '@/lib/gemini-models';

export interface ChallengePayload {
  title: string;
  description: string;
  examples: { input: string; output: string }[];
  testCases: { input: string; expectedOutput: string }[];
  hints: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  starterCode: string;
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
    const { topicName, courseName, topicId, courseId } = body;

    if (!topicName || !courseName || !topicId || !courseId) {
      return NextResponse.json({ error: 'topicName, courseName, topicId, and courseId are required' }, { status: 400 });
    }

    // Check Firestore Cache First
    const docRef = adminDb.collection('challenges').doc(courseId).collection('topics').doc(topicId);
    const cachedDoc = await docRef.get();
    if (cachedDoc.exists) {
      const cachedData = cachedDoc.data();
      if (cachedData?.challenge) {
        return NextResponse.json({
          challenge: cachedData.challenge as ChallengePayload,
          generatedAt: cachedData.generatedAt || Date.now(),
          cached: true
        });
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;
    console.log('[/api/challenge] API Key exists:', !!apiKey, '| Topic:', topicName, '| Course:', courseName);

    if (!apiKey) {
      // Fallback challenge when API Key is missing
      const isPython = courseId.includes('python');
      const fallbackChallenge: ChallengePayload = {
        title: `${topicName} Practice`,
        description: `Create a solution that demonstrates your understanding of ${topicName} in ${courseName}.`,
        examples: [{ input: 'None', output: 'Success' }],
        testCases: [{
          input: isPython ? 'solution()' : 'solution()',
          expectedOutput: 'Success'
        }],
        hints: ['Review course notes for syntax examples.', 'Make sure to return the correct value.'],
        difficulty: 'Medium',
        starterCode: isPython ? 'def solution():\n    return "Success"\n' : 'function solution() {\n  return "Success";\n}'
      };

      return NextResponse.json({
        challenge: fallbackChallenge,
        generatedAt: Date.now()
      });
    }

    const prompt = `Create a coding challenge specifically for ${topicName} from ${courseName}. The challenge must: test understanding of ${topicName} specifically, be solvable in 15-30 minutes, have clear input/output examples, have 3 test cases. Return JSON: {title, description, examples: [{input, output}], testCases: [{input, expectedOutput}], hints: string[], difficulty, starterCode}

Rules:
1. Each entry in testCases must have 'input' as a single executable expression calling the student's function (e.g., 'fizzbuzz(5)' or 'solution([1, 2, 3])') and 'expectedOutput' as the expected return value printed to stdout.
2. The challenge starter code must be topic-specific — not a generic template. It should define the function structure with comments and a return placeholder.
3. If the course is Python-based (or contains python in courseId), use Python syntax for the starterCode and testCases. If Javascript-based, use JavaScript syntax.
4. Return ONLY valid raw JSON (no markdown block wrapper).`;

    let res: Response | null = null;
    let usedModel = '';

    for (const modelName of GEMINI_GENERATE_MODELS) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      console.log(`[/api/challenge] Trying model: ${modelName} | Endpoint: ${endpoint.split('?')[0]}`);
      try {
        const attempt = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.5,
              maxOutputTokens: 1000,
            },
          }),
        });
        if (attempt.status === 404 || attempt.status === 400) {
          console.warn(`[/api/challenge] Model ${modelName} returned ${attempt.status}, trying next...`);
          continue;
        }
        res = attempt;
        usedModel = modelName;
        console.log(`[/api/challenge] Success with model: ${modelName}`);
        break;
      } catch (fetchErr: any) {
        console.warn(`[/api/challenge] Fetch error for ${modelName}:`, fetchErr?.message);
      }
    }

    if (!res || !res.ok) {
      throw new Error(`Gemini API error: ${res?.status ?? 'all models failed'}`);
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
        examples: Array.isArray(parsed.examples) ? parsed.examples : [{ input: '', output: '' }],
        testCases: Array.isArray(parsed.testCases) ? parsed.testCases : [{ input: '', expectedOutput: '' }],
        hints: Array.isArray(parsed.hints) ? parsed.hints.map(String).slice(0, 5) : ['Read the problem carefully.', 'Start with pseudocode.'],
        difficulty: ['Easy', 'Medium', 'Hard'].includes(parsed.difficulty) ? parsed.difficulty : 'Medium',
        starterCode: String(parsed.starterCode || (courseId.includes('python') ? 'def solution():\n    pass\n' : 'function solution() {\n  \n}')),
      };
    } catch {
      challenge = {
        title: `${topicName} Challenge`,
        description: `Apply what you learned about ${topicName} in ${courseName}.`,
        examples: [{ input: '', output: '' }],
        testCases: [{ input: 'solution()', expectedOutput: 'Success' }],
        hints: ['Plan before coding.', 'Test edge cases.'],
        difficulty: 'Medium',
        starterCode: courseId.includes('python') ? 'def solution():\n    pass\n' : 'function solution() {\n  \n}',
      };
    }

    // Cache the challenge in Firestore
    const generatedAt = Date.now();
    try {
      await docRef.set({
        challenge,
        generatedAt
      });
    } catch (dbErr) {
      console.warn('Failed to cache challenge to Firestore:', dbErr);
    }

    return NextResponse.json({ challenge, generatedAt });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Challenge generation failed';
    console.error('[/api/challenge]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
