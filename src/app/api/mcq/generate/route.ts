export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
// IMPORTANT: This line must be present in ALL API routes to prevent Vercel build failures

import { NextResponse } from 'next/server';
import { generateWithResilience } from '@/lib/gemini-resilience';
import { adminAuth as auth } from '@/lib/firebase-admin';



export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    await auth.verifyIdToken(token);

    const { topicName, courseName } = await request.json();

    if (!topicName || !courseName) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const systemPrompt = `You are an expert technical instructor. Generate 5 multiple choice questions for the topic: "${topicName}" in the course "${courseName}".
Each question should test conceptual understanding.
Provide exactly 4 options for each question.
Return JSON ONLY, with the following structure:
{
  "mcqs": [
    {
      "question": "question text",
      "options": ["opt1", "opt2", "opt3", "opt4"],
      "answer": "the exact text of the correct option",
      "explanation": "why this is correct"
    }
  ]
}`;

    const result = await generateWithResilience({
      apiKey: process.env.GEMINI_API_KEY || '',
      prompt: systemPrompt,
      featureName: 'quiz'
    });
    
    const rawResponse = result.text;

    // Clean JSON markdown
    let jsonStr = rawResponse.trim();
    if (jsonStr.startsWith('\`\`\`json')) {
      jsonStr = jsonStr.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
    } else if (jsonStr.startsWith('\`\`\`')) {
      jsonStr = jsonStr.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
    }

    const data = JSON.parse(jsonStr);

    return NextResponse.json({ mcqs: data.mcqs });
  } catch (error: any) {
    console.error('Error generating MCQs:', error);
    return NextResponse.json({ error: 'Failed to generate MCQs' }, { status: 500 });
  }
}
