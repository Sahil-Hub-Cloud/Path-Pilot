import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF
    let text = '';
    try {
      const pdfData = await pdfParse(buffer);
      text = pdfData.text;
    } catch (parseError) {
      console.error('PDF Parse Error:', parseError);
      return NextResponse.json(
        { error: 'Failed to extract text from PDF. Ensure it is a valid PDF file.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key missing' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // ── Main content prompt (flashcards, formulas, MCQs) ─────────────────────
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
4. Do NOT wrap the JSON in markdown code blocks like \`\`\`json. Return ONLY the raw JSON starting with { and ending with }.
5. Keep the total output token count reasonable by picking the top 3-4 most important topics if the PDF is extremely long.

PDF TEXT (first 30,000 chars):
${text.substring(0, 30000)}
`;

    // ── Flowchart prompt ──────────────────────────────────────────────────────
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

    // Run both prompts in parallel
    const [contentResult, flowchartResult] = await Promise.all([
      model.generateContent(contentPrompt),
      model.generateContent(flowchartPrompt),
    ]);

    // Parse main content
    let aiContentText = contentResult.response.text();
    aiContentText = aiContentText.replace(/```json/gi, '').replace(/```/g, '').trim();
    let parsedData;
    try {
      parsedData = JSON.parse(aiContentText);
    } catch (jsonError) {
      console.error('Failed to parse Gemini content output as JSON:', aiContentText);
      return NextResponse.json(
        { error: 'Failed to generate valid study materials. Please try again.' },
        { status: 500 }
      );
    }

    // Parse flowcharts (non-fatal — empty array on failure)
    let parsedFlowcharts: any[] = [];
    try {
      let aiFlowchartText = flowchartResult.response.text();
      aiFlowchartText = aiFlowchartText.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsedFlowcharts = JSON.parse(aiFlowchartText);
      if (!Array.isArray(parsedFlowcharts)) parsedFlowcharts = [];
    } catch (flowErr) {
      console.warn('Flowchart generation failed (non-fatal), continuing without flowcharts:', flowErr);
      parsedFlowcharts = [];
    }

    return NextResponse.json({
      success: true,
      data: parsedData,
      flowcharts: parsedFlowcharts,
      rawText: text.substring(0, 50000),
    });
  } catch (error: any) {
    console.error('PDF Processing Route Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
