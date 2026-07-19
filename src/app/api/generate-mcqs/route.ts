export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    await adminAuth.verifyIdToken(token);

    const { topicName, courseName, topicId } = await request.json();

    if (!topicName || !courseName || !topicId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const systemPrompt = `You are an expert engineering professor. Generate exactly 20 multiple-choice questions for ${topicName}. Output ONLY a valid JSON array. Each object must have: "question" (string), "options" (array of 4 strings), and "correctAnswerIndex" (number 0-3).`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7
    });

    let rawResponse = chatCompletion.choices[0]?.message?.content || '[]';
    
    // The prompt requested a JSON array, but response_format: 'json_object' requires a JSON object.
    // If we use json_object, we need to wrap the prompt or Groq might fail. 
    // Wait, the prompt says "Output ONLY a valid JSON array". Groq's json_object requires an object.
    // Let's parse it manually since Groq can return raw text.
    let mcqBank = [];
    try {
      // Sometimes LLMs return markdown block
      const jsonStr = rawResponse.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
      mcqBank = JSON.parse(jsonStr);
      // If it returned an object like { questions: [...] } handle it
      if (mcqBank && !Array.isArray(mcqBank)) {
        mcqBank = mcqBank.questions || mcqBank.mcqs || Object.values(mcqBank)[0];
      }
    } catch (e) {
      console.error('Failed to parse Groq response:', rawResponse);
      return NextResponse.json({ error: 'Failed to generate valid MCQs' }, { status: 500 });
    }

    if (!Array.isArray(mcqBank) || mcqBank.length === 0) {
      return NextResponse.json({ error: 'Generated MCQs are invalid' }, { status: 500 });
    }

    // Save to Firestore
    const topicRef = adminDb.collection('topics').doc(topicId);
    console.log(`[generate-mcqs API] Attempting to write MCQs to Firestore path: topics/${topicId}`);
    await topicRef.set({ mcq_bank: mcqBank }, { merge: true });

    return NextResponse.json({ mcqs: mcqBank });
  } catch (error: any) {
    console.error('Error generating MCQs:', error);
    return NextResponse.json({ error: 'Failed to generate MCQs', details: error.message }, { status: 500 });
  }
}
