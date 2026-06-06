export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { topicName = 'this topic', courseName = 'this course', language = 'English' } = body

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing Gemini API key' }, { status: 500 })
    }

    const prompt = `Explain ${topicName} from ${courseName} in simple ${language}. Structure exactly:
## What is it?
(2-3 simple sentences)
## Key Concepts
- (5 bullet points)
## Code Example
(if applicable, otherwise skip)
## Real World Use
(2-3 sentences)
## Quick Summary
(1 sentence)
Keep under 350 words. Use clear markdown formatting.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('Gemini error:', JSON.stringify(data))
      return NextResponse.json(
        { error: 'Gemini API failed: ' + (data.error?.message || 'unknown') },
        { status: 500 }
      )
    }

    const notes = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!notes) {
      return NextResponse.json(
        { error: 'Gemini returned empty response' },
        { status: 500 }
      )
    }

    return NextResponse.json({ notes })

  } catch (error: any) {
    console.error('💥 NOTES API CRASH:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
