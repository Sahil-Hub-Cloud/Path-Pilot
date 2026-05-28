import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    console.log('Key exists:', !!process.env.GEMINI_API_KEY);
    const { topicName, courseName } = await request.json();
    if (!topicName) return NextResponse.json({ error: 'Topic name required' }, { status: 400 });

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Explain ${topicName} from ${courseName} for an engineering student. Keep it simple, concise, and structured. Max 300 words.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    return NextResponse.json({ content: text });
  } catch (error: any) {
    console.error('Notes Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate notes' }, { status: 500 });
  }
}
