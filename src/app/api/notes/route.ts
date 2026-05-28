export const dynamic = 'force-dynamic';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function GET() {
  return NextResponse.json({ status: 'Notes API is running', hasKey: !!process.env.GEMINI_API_KEY });
}

export async function POST(request: Request) {
  try {
    console.log('[Notes API] Starting request. Key exists:', !!process.env.GEMINI_API_KEY);
    
    const body = await request.json();
    const { topicName, courseName } = body;
    
    if (!topicName) {
      console.warn('[Notes API] Missing topicName');
      return NextResponse.json({ error: 'Topic name required' }, { status: 400 });
    }

    console.log(`[Notes API] Generating for Topic: ${topicName}, Course: ${courseName}`);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('[Notes API] Model selected: gemini-1.5-flash');
    
    const prompt = `Explain ${topicName} from ${courseName} for an engineering student. Keep it simple, concise, and structured. Max 300 words.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    console.log('[Notes API] Generation successful.');
    return NextResponse.json({ content: text });
  } catch (error: any) {
    console.error('Notes Generation Error:', error);
    console.error('Error Stack:', error.stack);
    return NextResponse.json({ error: error.message || 'Failed to generate notes' }, { status: 500 });
  }
}
