import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
  try {
    const { code, language, problemId } = await req.json();

    const prompt = `Analyze this ${language} code for logic errors only. 
    Problem Context: ${problemId}
    Do not give the solution. 
    Identify up to 3 logic issues.
    For each error explain:
    1. Which line (or section)
    2. What type of error
    3. A hint to help student think (Socratic style)
    
    Return as a clean JSON array of objects: [{ "line": string, "type": string, "hint": string }]
    Code:
    ${code}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Extract JSON from potential markdown tags
    const jsonStr = responseText.replace(/```json|```/g, "").trim();
    const issues = JSON.parse(jsonStr);

    return NextResponse.json({ issues });
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ 
      issues: [{ line: "System", type: "AI Offline", hint: "The AI analyzer is temporarily unavailable. Check your logic manually." }] 
    }, { status: 500 });
  }
}
