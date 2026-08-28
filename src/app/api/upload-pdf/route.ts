export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
// IMPORTANT: This line must be present in ALL API routes to prevent Vercel build failures

import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import { generateWithResilience, MODELS_HEAVY, MODELS_LIGHT } from '@/lib/gemini-resilience';
import { verifyRequestAuth, requireAuthResponse } from '@/lib/server-auth';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyRequestAuth(req); if (!auth) return requireAuthResponse();
    const { success } = await checkRateLimit(`rl_upload_pdf:${auth.uid}`);
    if (!success) return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const collegeId = (formData.get('collegeId') as string) || 'unknown';
    const subjectId = (formData.get('subjectId') as string) || 'unknown';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key missing' }, { status: 500 });
    }

    // Parse PDF text
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let text = '';
    try {
      const pdfData = await pdfParse(buffer);
      text = pdfData.text;
    } catch (parseError) {
      console.error('[/api/upload-pdf] PDF parse error:', parseError);
      return NextResponse.json(
        { error: 'Failed to extract text from PDF. Ensure it is a valid PDF file.' },
        { status: 400 }
      );
    }

    console.log(`[/api/upload-pdf] feature=pdf-process collegeId=${collegeId} subjectId=${subjectId} chars=${text.length}`);

    const cacheKey = `pdf_${collegeId}_${subjectId}`;

    // ── Main content prompt ────────────────────────────────────────────────────
    const contentPrompt = `You are an expert academic content creator for Indian engineering students. Analyze this syllabus/subject PDF and return ONLY valid JSON with this structure:
{
  "subjectName": "string",
  "totalTopics": 0,
  "topics": [
    {
      "topicName": "string",
      "explanation": "string (simple 3-4 sentence explanation)",
      "keyPoints": ["string (5-7 bullet points)"],
      "formulas": [
        {
          "formulaName": "string",
          "formula": "string",
          "explanation": "string",
          "example": "string"
        }
      ],
      "flashcards": [
        {
          "question": "string",
          "answer": "string"
        }
      ],
      "mcqQuestions": [
        {
          "question": "string",
          "options": ["string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  ]
}

CRITICAL RULES:
1. Make explanations simple enough for a beginner engineering student in India.
2. MINIMUM 5 flashcards per topic.
3. MINIMUM 5 MCQ questions per topic.
4. Do NOT wrap the JSON in markdown code blocks. Return ONLY the raw JSON starting with { and ending with }.
5. Keep the total output token count reasonable by picking the top 3-4 most important topics if the PDF is extremely long.

PDF TEXT (first 30,000 chars):
${text.substring(0, 30000)}
`;

    // ── Flowchart prompt ───────────────────────────────────────────────────────
    const flowchartPrompt = `Analyze this educational content and identify any processes, algorithms, workflows, or step-by-step procedures described in it. For each one, create a detailed flowchart description.

Return ONLY valid JSON as an array of flowcharts with this exact structure:
[
  {
    "title": "string — name of the process or algorithm",
    "steps": [
      {
        "id": "string — unique ID like 'step1', 'step2'",
        "text": "string — short label for this step (max 10 words)",
        "type": "start | process | decision | end",
        "nextStep": "string — ID of the next step for linear flow (null for end nodes)",
        "yesStep": "string — ID of next step when decision is YES (only for decision nodes)",
        "noStep": "string — ID of next step when decision is NO (only for decision nodes)"
      }
    ]
  }
]

RULES:
1. Return an empty array [] if no processes or algorithms are found.
2. Every flowchart must have exactly ONE start node and at least ONE end node.
3. Decision nodes must have both yesStep and noStep.
4. Non-decision nodes must have nextStep (null only for end nodes).
5. Keep step text concise — max 10 words per step.
6. Find 1-3 flowcharts maximum from the content.
7. Do NOT wrap in markdown code blocks. Return ONLY raw JSON starting with [ and ending with ].

CONTENT (first 20,000 chars):
${text.substring(0, 20000)}
`;

    // Run both in parallel using the resilience wrapper
    // Heavy model for content, light for flowcharts
    const [contentResult, flowchartResult] = await Promise.allSettled([
      generateWithResilience({
        apiKey,
        prompt: contentPrompt,
        featureName: 'pdf-process',
        cacheKey,
        models: MODELS_HEAVY,
        timeoutMs: 15000,
        logPrefix: '[/api/upload-pdf] content',
        cacheMeta: { collegeId, subjectId, type: 'pdf_content' },
      }),
      generateWithResilience({
        apiKey,
        prompt: flowchartPrompt,
        featureName: 'pdf-process',
        // no cacheKey for flowcharts (lightweight, always fresh)
        models: MODELS_LIGHT,
        timeoutMs: 15000,
        logPrefix: '[/api/upload-pdf] flowchart',
      }),
    ]);

    // Parse main content
    if (contentResult.status === 'rejected') {
      const msg = contentResult.reason?.message || 'Content generation failed';
      if (msg.startsWith('QUOTA_EXCEEDED')) {
        return NextResponse.json(
          { error: 'PDF processing limit reached for today. Please try again tomorrow.' },
          { status: 429 }
        );
      }
      if (msg.includes('paused by admin')) {
        return NextResponse.json(
          { error: 'PDF processing is currently paused for maintenance.' },
          { status: 503 }
        );
      }
      throw new Error(msg);
    }

    const rawContent = contentResult.value.text
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    let parsedData;
    try {
      parsedData = JSON.parse(rawContent);
    } catch {
      console.error('[/api/upload-pdf] Failed to parse content JSON:', rawContent.slice(0, 500));
      return NextResponse.json(
        { error: 'Failed to generate valid study materials. Please try again.' },
        { status: 500 }
      );
    }

    // Parse flowcharts (non-fatal)
    let parsedFlowcharts: any[] = [];
    if (flowchartResult.status === 'fulfilled') {
      try {
        const rawFlowchart = flowchartResult.value.text
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .trim();
        parsedFlowcharts = JSON.parse(rawFlowchart);
        if (!Array.isArray(parsedFlowcharts)) parsedFlowcharts = [];
      } catch {
        console.warn('[/api/upload-pdf] Flowchart parse failed (non-fatal)');
      }
    }

    return NextResponse.json({
      success: true,
      data: parsedData,
      flowcharts: parsedFlowcharts,
      rawText: text.substring(0, 50000),
      cached: contentResult.value.cached,
    });

  } catch (error: any) {
    console.error('[/api/upload-pdf] ERROR:', error?.message);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
