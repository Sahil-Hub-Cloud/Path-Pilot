export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { topicName, courseName } = await request.json()
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const prompt = `Explain ${topicName} from ${courseName} course in simple English for an Indian engineering student. Structure your response as: 1) Simple Definition (2-3 sentences) 2) Key Concepts (5 bullet points) 3) Real World Example (3-4 sentences) 4) Common Mistakes to Avoid (3 bullet points) 5) Quick Summary (1 sentence). Keep total length under 300 words.`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    return NextResponse.json({ notes: text })
  } catch (error) {
    console.error('Gemini API error:', error)
    return NextResponse.json({ error: 'Failed to generate notes' }, { status: 500 })
  }
}
