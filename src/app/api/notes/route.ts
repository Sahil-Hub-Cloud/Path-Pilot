export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { topicName = 'this topic', courseName = 'this course', language = 'english' } = body

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 })
    }

    const languageInstruction =
      language === 'telugu' ? 'Write in Telugu language.' :
      language === 'hindi' ? 'Write in Hindi language.' :
      'Write in English.'

    const prompt = `${languageInstruction} Explain ${topicName} from ${courseName} for Indian engineering students. Include: definition, 5 key concepts, code example, real world use. Max 300 words.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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
      return NextResponse.json({ error: 'Gemini API failed: ' + (data.error?.message || 'unknown') }, { status: 500 })
    }

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Notes not available'

    return NextResponse.json({ content })

  } catch (error: any) {
    console.error('Notes error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok' })
}
