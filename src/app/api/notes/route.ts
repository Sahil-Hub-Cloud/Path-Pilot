export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      topicName = 'this topic', 
      topicId = 'unknown', 
      courseId = 'unknown', 
      courseName = 'this course', 
      language = 'english' 
    } = body

    // Check Firestore cache first
    const cacheId = `${courseId}__${topicId}__${language}`
    
    try {
      const cacheRef = doc(db, 'notes_cache', cacheId)
      const cacheSnap = await getDoc(cacheRef)
      if (cacheSnap.exists()) {
        return NextResponse.json({ 
          content: cacheSnap.data().content,
          cached: true 
        })
      }
    } catch (cacheError) {
      console.log('Cache read failed, generating fresh')
    }

    // Check API key
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Notes service not configured' }, 
        { status: 500 }
      )
    }

    // Generate with Gemini
    const languageInstruction = 
      language === 'telugu' ? 'Write ENTIRELY in Telugu language.' :
      language === 'hindi' ? 'Write ENTIRELY in Hindi language.' :
      'Write ENTIRELY in English.'

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const prompt = `${languageInstruction}
You are an expert teacher for Indian engineering students.
Explain: ${topicName} from ${courseName} course.

Structure:
## What is ${topicName}?
(2-3 simple sentences)

## Key Concepts
(5 bullet points)

## Code Example
(if applicable)

## Real World Use
(2-3 sentences)

## Quick Summary
(1 sentence)

Maximum 350 words. Keep it simple.`

    const result = await model.generateContent(prompt)
    const content = result.response.text()

    // Save to Firestore permanently
    try {
      const cacheRef = doc(db, 'notes_cache', cacheId)
      await setDoc(cacheRef, {
        content,
        topicName,
        courseId,
        language,
        generatedAt: serverTimestamp(),
        permanent: true
      })
    } catch (saveError) {
      console.log('Cache save failed:', saveError)
    }

    return NextResponse.json({ content, cached: false })

  } catch (error: any) {
    console.error('Notes API error:', error.message)
    return NextResponse.json(
      { error: 'Could not generate notes. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Notes API ready' })
}
