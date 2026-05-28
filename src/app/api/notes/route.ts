import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Model priority list — tries each in order until one succeeds
const MODEL_PRIORITY = ['gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-pro'];

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('[/api/notes] API Key exists:', !!apiKey);

  try {
    const { topicName, courseName } = await request.json();
    if (!topicName) {
      return NextResponse.json({ error: 'Topic name required' }, { status: 400 });
    }

    const prompt = `You are a friendly Indian CS teacher explaining to an engineering student.
Explain "${topicName}" from "${courseName}" in simple, clear English.
Use examples and analogies. Where helpful, sprinkle in Hindi/Telugu terms (e.g., "seedha matlab" = "simply means").
Structure your answer with:
1. What is it? (1-2 sentences)
2. Why it matters? (1-2 sentences)
3. How it works? (bullet points or short paragraphs)
4. Quick Example (code or analogy)
Keep it under 350 words. Make it engaging, not boring textbook content.`;

    let lastError: Error | null = null;

    for (const modelName of MODEL_PRIORITY) {
      try {
        console.log(`[/api/notes] Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log(`[/api/notes] Success with model: ${modelName}, chars: ${text.length}`);
        return NextResponse.json({ content: text, model: modelName });
      } catch (err: any) {
        console.warn(`[/api/notes] Model "${modelName}" failed:`, err?.message || err);
        lastError = err;
        // If it's a 404 / not-found, try next model. Otherwise break early.
        const msg = err?.message?.toLowerCase() || '';
        if (!msg.includes('404') && !msg.includes('not found') && !msg.includes('not supported')) {
          break;
        }
      }
    }

    // All models failed — return a static fallback
    console.error('[/api/notes] All models failed. Last error:', lastError?.message);
    const fallbackContent = `## ${topicName}\n\n**Note:** AI notes are temporarily unavailable. Please check your notes or course materials for information on **${topicName}** in ${courseName}.\n\nKey things to look up:\n- Definition and basic concept\n- Common use cases\n- Syntax / examples in code\n\n*AI service will be back soon!*`;
    return NextResponse.json({ content: fallbackContent, model: 'fallback', error: lastError?.message });

  } catch (error: any) {
    console.error('[/api/notes] Unexpected error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate notes' }, { status: 500 });
  }
}
