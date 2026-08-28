export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import Groq from 'groq-sdk';
import { verifyRequestAuth, requireAuthResponse } from '@/lib/server-auth';
import { checkRateLimit } from '@/lib/rate-limit';

function getFallbackMCQs(topicName: string, courseName: string) {
  return [
    {
      question: `What is the primary role of ${topicName} in ${courseName}?`,
      options: [
        `To structure logic and handle key operations for ${topicName}`,
        `To disable browser network operations`,
        `To bypass data processing steps`,
        `To reset local database state automatically`
      ],
      correctAnswerIndex: 0
    },
    {
      question: `Which concept is fundamental when working with ${topicName}?`,
      options: [
        `Modular design and clean state handling`,
        `Hardcoding all runtime parameters`,
        `Ignoring error propagation`,
        `Running synchronous blocking operations`
      ],
      correctAnswerIndex: 0
    },
    {
      question: `What is a best practice when implementing ${topicName}?`,
      options: [
        `Writing reusable code and validating inputs`,
        `Avoiding type checks and safety assertions`,
        `Storing plain-text secrets in source control`,
        `Disabling error logging`
      ],
      correctAnswerIndex: 0
    },
    {
      question: `Why is ${topicName} important in engineering applications?`,
      options: [
        `It provides standardized solutions for building scalable software`,
        `It increases CPU temperature artificially`,
        `It replaces standard data structures`,
        `It prevents code compilation`
      ],
      correctAnswerIndex: 0
    },
    {
      question: `In modern development, how is ${topicName} applied?`,
      options: [
        `As an essential module within application features`,
        `Exclusively for formatting CSS animations`,
        `Only during system reboots`,
        `To encrypt log messages`
      ],
      correctAnswerIndex: 0
    }
  ];
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyRequestAuth(request as any); if (!auth) return requireAuthResponse();
    const { success } = await checkRateLimit(`rl_generate_mcqs:${auth.uid}`);
    if (!success) return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });

    const body = await request.json().catch(() => ({}));
    const topicName = body.topicName || 'Topic';
    const courseName = body.courseName || 'Course';
    const topicId = body.topicId || 'default-topic';

    let mcqBank: any[] = [];

    if (process.env.GROQ_API_KEY) {
      try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const systemPrompt = `You are an expert engineering professor. Generate exactly 20 multiple-choice questions for ${topicName}. Output ONLY a valid JSON array. Each object must have: "question" (string), "options" (array of 4 strings), and "correctAnswerIndex" (number 0-3).`;

        const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: 'system', content: systemPrompt }],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.7
        });

        let rawResponse = chatCompletion.choices[0]?.message?.content || '[]';
        const jsonStr = rawResponse.replace(/^```json/, '').replace(/```$/, '').trim();
        let parsed = JSON.parse(jsonStr);
        if (parsed && !Array.isArray(parsed)) {
          parsed = parsed.questions || parsed.mcqs || Object.values(parsed)[0];
        }
        if (Array.isArray(parsed) && parsed.length > 0) {
          mcqBank = parsed;
        }
      } catch (e) {
        console.error('Groq generation error, using fallbacks:', e);
      }
    }

    if (!mcqBank || mcqBank.length === 0) {
      mcqBank = getFallbackMCQs(topicName, courseName);
    }

    // Save to Firestore if possible
    try {
      const topicRef = adminDb.collection('topics').doc(topicId);
      await topicRef.set({ mcq_bank: mcqBank }, { merge: true });
    } catch (e) {
      console.warn('Firestore write failed, returning generated MCQs directly:', e);
    }

    return NextResponse.json({ mcqs: mcqBank });
  } catch (error: any) {
    console.error('Error in generate-mcqs endpoint:', error);
    return NextResponse.json({ mcqs: getFallbackMCQs('Topic', 'Course') });
  }
}
