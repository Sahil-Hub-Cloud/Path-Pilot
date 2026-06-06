export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { topicName = 'this topic', courseName = 'this course', courseId, topicId, language = 'english' } = body

    if (courseId && topicId) {
      const docId = `${courseId}_${topicId}_${language}`
      const docSnap = await db.collection('topic_notes').doc(docId).get()
      if (docSnap.exists) {
        const data = docSnap.data()
        if (data?.notes) {
          return NextResponse.json({ content: data.notes, cached: true })
        }
      }
    }

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
      if (response.status === 429 || response.status === 403) {
        return NextResponse.json({ 
          content: 'Notes coming soon for this topic!', 
          isFallback: true 
        })
      }
      console.error('Gemini error:', JSON.stringify(data))
      return NextResponse.json({ error: 'Gemini API failed: ' + (data.error?.message || 'unknown') }, { status: 500 })
    }

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Notes not available'

    if (courseId && topicId && content !== 'Notes not available') {
      const docId = `${courseId}_${topicId}_${language}`
      await db.collection('topic_notes').doc(docId).set({
        notes: content,
        courseId,
        topicId,
        topicName,
        language,
        generatedAt: new Date()
      }, { merge: true }).catch(err => console.error("Cache save error:", err))
    }

    return NextResponse.json({ content })

  } catch (error: any) {
    console.error('Notes error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok' })
}
