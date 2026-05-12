export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI Service configuration missing' }, { status: 500 });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error?.message || "Unknown Gemini API Error");
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, my neural pathways are currently recalibrating.";

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error('Chatbot API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

