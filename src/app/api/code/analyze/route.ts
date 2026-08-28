export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequestAuth, requireAuthResponse } from '@/lib/server-auth';
import { checkRateLimit } from '@/lib/rate-limit';

// GenAI initialization moved inside POST
const MODEL_PRIORITY = ['gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash'];

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyRequestAuth(req as any); if (!auth) return requireAuthResponse();
    const { success } = await checkRateLimit(`rl_code_analyze:${auth.uid}`);
    if (!success) return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
    const { code, language, problemId } = await req.json();
    console.log('[/api/code/analyze] API Key exists:', !!process.env.GEMINI_API_KEY);

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

    let responseText = null;
    let lastErr: any = null;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

    for (const modelName of MODEL_PRIORITY) {
      try {
        console.log(`[/api/code/analyze] Trying model: ${modelName}`);
        const m = genAI.getGenerativeModel({ model: modelName });
        const result = await m.generateContent(prompt);
        responseText = result.response.text();
        console.log(`[/api/code/analyze] Success with model: ${modelName}`);
        break;
      } catch (err: any) {
        console.warn(`[/api/code/analyze] Model "${modelName}" failed:`, err?.message);
        lastErr = err;
        const msg = (err?.message || '').toLowerCase();
        if (!msg.includes('404') && !msg.includes('not found')) break;
      }
    }

    if (!responseText) throw lastErr || new Error('No response from AI');

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

