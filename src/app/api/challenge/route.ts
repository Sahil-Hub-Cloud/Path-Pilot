export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { GEMINI_GENERATE_MODELS } from '@/lib/gemini-models';
import { getTopicMeta } from '@/lib/data/content-pipeline';

export interface ChallengePayload {
  title: string;
  description: string;
  examples: { input: string; output: string }[];
  testCases: { input: string; expectedOutput: string }[];
  hints: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  starterCode: string;
}

function cacheIsValid(
  cached: Record<string, unknown> | undefined,
  courseId: string,
  topicId: string,
  topicName: string
): boolean {
  if (!cached?.challenge) return false;
  if (cached.courseId && cached.courseId !== courseId) return false;
  if (cached.topicId && cached.topicId !== topicId) return false;
  if (cached.topicName && cached.topicName !== topicName) return false;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    let isAuthenticated = false;
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      try {
        await adminAuth.verifyIdToken(authHeader.split('Bearer ')[1]);
        isAuthenticated = true;
      } catch {
        // Invalid token, just proceed as unauthenticated
      }
    }

    const body = await req.json();
    let { topicName, courseName, topicId, courseId } = body;
    const forceRegenerate = body.forceRegenerate === true;

    if (!topicId || !courseId) {
      return NextResponse.json({ error: 'topicId and courseId are required' }, { status: 400 });
    }

    if (!topicName || !courseName) {
      const meta = getTopicMeta(courseId, topicId);
      if (!meta) {
        return NextResponse.json({ error: 'Could not resolve topic from courseId and topicId' }, { status: 400 });
      }
      topicName = meta.topicName;
      courseName = meta.courseName;
    }

    // Firestore: challenges/{courseId}/topics/{topicId}
    const cacheRef = adminDb.collection('challenges').doc(courseId).collection('topics').doc(topicId);
    console.log('[/api/challenge] cache path:', `challenges/${courseId}/topics/${topicId}`, '| topic:', topicName);

    if (!forceRegenerate) {
      const cachedDoc = await cacheRef.get();
      if (cachedDoc.exists) {
        const cachedData = cachedDoc.data() as Record<string, unknown> | undefined;
        if (cacheIsValid(cachedData, courseId, topicId, topicName)) {
          return NextResponse.json({
            challenge: cachedData!.challenge as ChallengePayload,
            generatedAt: cachedData!.generatedAt || Date.now(),
            cached: true,
            courseId,
            topicId,
          });
        }
        console.warn('[/api/challenge] Stale cache ignored for', courseId, topicId);
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;
    console.log('[/api/challenge] Generating |', { courseId, topicId, topicName, courseName, hasKey: !!apiKey });

    if (!apiKey) {
      const isPython =
        courseId.includes('python') ||
        courseId.includes('ml') ||
        courseId.includes('data') ||
        courseId.includes('django');
      const fallbackChallenge: ChallengePayload = {
        title: `${topicName} — ${courseName} Practice`,
        description: `Write code that demonstrates your understanding of **${topicName}** specifically from the ${courseName} course. This challenge must NOT be generic.`,
        examples: [{ input: 'example_input()', output: 'expected_result' }],
        testCases: [
          { input: 'test_case_1()', expectedOutput: 'result_1' },
          { input: 'test_case_2()', expectedOutput: 'result_2' },
          { input: 'test_case_3()', expectedOutput: 'result_3' },
        ],
        hints: [`Focus only on ${topicName}.`, 'Review the notes tab for this topic.'],
        difficulty: 'Medium',
        starterCode: isPython
          ? `# Challenge: ${topicName}\ndef solve():\n    # TODO: implement for ${topicName}\n    pass\n`
          : `// Challenge: ${topicName}\nfunction solve() {\n  // TODO: implement for ${topicName}\n}\n`,
      };

      return NextResponse.json({
        challenge: fallbackChallenge,
        generatedAt: Date.now(),
        courseId,
        topicId,
      });
    }

    const prompt = `Create a unique coding challenge ONLY for the topic '${topicName}' from '${courseName}' course. Test ONLY ${topicName} concepts. Return JSON: {title, description, examples:[{input,output}], testCases:[{input,expectedOutput}], hints:[], difficulty, starterCode}

Additional rules:
1. Topic ID for uniqueness: ${topicId}. Course ID: ${courseId}. The title MUST mention "${topicName}".
2. Each testCases entry must use 'input' as a single executable expression and 'expectedOutput' as the expected result.
3. starterCode must be specific to ${topicName}, not a generic template.
4. If courseId suggests Python (${courseId}), use Python; if JavaScript/React/Node/Web3, use JavaScript.
5. Return ONLY valid raw JSON (no markdown fences).`;

    let res: Response | null = null;

    for (const modelName of GEMINI_GENERATE_MODELS) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      console.log(`[/api/challenge] Trying model: ${modelName}`);
      try {
        const attempt = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.85,
              maxOutputTokens: 1200,
            },
          }),
        });
        if (attempt.status === 404 || attempt.status === 400) continue;
        res = attempt;
        console.log(`[/api/challenge] Success with model: ${modelName}`);
        break;
      } catch (fetchErr: unknown) {
        const msg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
        console.warn(`[/api/challenge] Fetch error for ${modelName}:`, msg);
      }
    }

    if (!res || !res.ok) {
      throw new Error(`Gemini API error: ${res?.status ?? 'all models failed'}`);
    }

    const data = await res.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const cleaned = raw.replace(/```json|```/g, '').trim();

    const isPython =
      courseId.includes('python') ||
      courseId.includes('ml') ||
      courseId.includes('data') ||
      courseId.includes('django');

    let challenge: ChallengePayload;
    try {
      const parsed = JSON.parse(cleaned);
      challenge = {
        title: String(parsed.title || `${topicName} Challenge`),
        description: String(parsed.description || `Apply ${topicName} from ${courseName}.`),
        examples: Array.isArray(parsed.examples) ? parsed.examples : [{ input: '', output: '' }],
        testCases: Array.isArray(parsed.testCases) ? parsed.testCases.slice(0, 3) : [{ input: '', expectedOutput: '' }],
        hints: Array.isArray(parsed.hints) ? parsed.hints.map(String).slice(0, 5) : ['Read the problem carefully.'],
        difficulty: ['Easy', 'Medium', 'Hard'].includes(parsed.difficulty) ? parsed.difficulty : 'Medium',
        starterCode: String(
          parsed.starterCode ||
            (isPython ? `def ${topicName.replace(/\W+/g, '_').toLowerCase()}():\n    pass\n` : 'function solution() {\n  \n}')
        ),
      };
    } catch {
      challenge = {
        title: `${topicName} Challenge`,
        description: `Apply what you learned about ${topicName} in ${courseName}.`,
        examples: [{ input: '', output: '' }],
        testCases: [
          { input: 'test_1()', expectedOutput: 'out_1' },
          { input: 'test_2()', expectedOutput: 'out_2' },
          { input: 'test_3()', expectedOutput: 'out_3' },
        ],
        hints: ['Plan before coding.', 'Test edge cases.'],
        difficulty: 'Medium',
        starterCode: isPython ? 'def solution():\n    pass\n' : 'function solution() {\n  \n}',
      };
    }

    const generatedAt = Date.now();
    if (isAuthenticated) {
      try {
        await cacheRef.set({
          challenge,
          generatedAt,
          courseId,
          topicId,
          topicName,
          courseName,
        });
      } catch (dbErr) {
        console.warn('Failed to cache challenge to Firestore:', dbErr);
      }
    }

    return NextResponse.json({ challenge, generatedAt, courseId, topicId, cached: false });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Challenge generation failed';
    console.error('[/api/challenge]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
