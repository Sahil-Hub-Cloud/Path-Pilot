import { NextResponse } from 'next/server';
import { generateWithResilience } from '@/lib/gemini-resilience';
import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    await admin.auth().verifyIdToken(token);

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
