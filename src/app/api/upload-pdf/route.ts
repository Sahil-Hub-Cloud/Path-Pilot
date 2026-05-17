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
      console.error("PDF Parse Error:", parseError);
      return NextResponse.json({ error: 'Failed to extract text from PDF. Ensure it is a valid PDF file.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key missing' }, { status: 500 });
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert academic content creator for Indian engineering students. Analyze this syllabus/subject PDF and return ONLY valid JSON with this structure:
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

    const result = await model.generateContent(prompt);
    let aiText = result.response.text();
    
    // Clean markdown blocks if Gemini still adds them
    aiText = aiText.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    let parsedData;
    try {
      parsedData = JSON.parse(aiText);
    } catch (jsonError) {
      console.error("Failed to parse Gemini output as JSON:", aiText);
      return NextResponse.json({ error: 'Failed to generate valid study materials. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: parsedData, rawText: text.substring(0, 50000) });
  } catch (error: any) {
    console.error("PDF Processing Route Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
