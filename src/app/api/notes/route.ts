export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const topic = req.nextUrl.searchParams.get('topic') || '';
  const course = req.nextUrl.searchParams.get('course') || '';

  if (!topic) {
    return NextResponse.json({ error: 'topic is required' }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Return a helpful fallback if key not configured
    return NextResponse.json({
      notes: `**${topic}** — Notes Unavailable\n\nAdd GEMINI_API_KEY to your .env.local file to enable AI-generated notes for this topic.`,
      fallback: true,
    });
  }

  const prompt = `You are an expert teacher for Indian engineering students learning ${course || 'software development'}.

Explain "${topic}" in simple English. Your response must follow this exact format with markdown:

## What is ${topic}?
[2-3 sentences explaining the concept simply]

## Key Concepts
- [Concept 1 with brief explanation]
- [Concept 2 with brief explanation]
- [Concept 3 with brief explanation]

## Real-World Example
[One concrete, relatable example relevant to Indian students — could be Swiggy, Zomato, Flipkart, UPI, etc.]

## 3-Point Summary
1. [Key takeaway 1]
2. [Key takeaway 2]
3. [Key takeaway 3]

## Common Mistake to Avoid
[One common mistake beginners make with this topic]

Keep it under 250 words. Be direct and practical.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 512,
          },
        }),
      }
    );

    if (!res.ok) {
      if (res.status === 429) {
        throw new Error('429');
      }
      throw new Error(`Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Notes generation failed.';

    return NextResponse.json({ notes: text });
  } catch (err: any) {
    console.error('[/api/notes]', err.message);
    
    if (err.message === '429') {
      return NextResponse.json(
        { 
          notes: `**System Too Busy**\n\nI'm currently helping many students and reached my rate limit. Please wait a moment and try clicking the topic again to generate notes for **${topic}**.`, 
          error: true 
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { notes: `Could not generate notes for **${topic}**. Please try again.`, error: true },
      { status: 200 } // return 200 so UI handles gracefully
    );
  }
}

