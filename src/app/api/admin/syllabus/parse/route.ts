export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import pdf from 'pdf-parse';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Gemini API key is not configured." }, { status: 500 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No syllabus file provided." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        let contentToParse = '';

        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
            try {
                const data = await pdf(buffer);
                contentToParse = data.text;
            } catch (pdfError) {
                console.error("PDF Parsing Error:", pdfError);
                return NextResponse.json({ error: "Failed to parse PDF file." }, { status: 400 });
            }
        } else {
            return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 });
        }

        if (contentToParse.trim().length < 50) {
            return NextResponse.json({ error: "Content too short to extract a curriculum." }, { status: 400 });
        }

        console.log('[/api/admin/syllabus/parse] API Key exists:', !!process.env.GEMINI_API_KEY);

        const MODEL_PRIORITY = ['gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash'];
        const prompt = `You are an academic curriculum expert. Extract a structured week by week curriculum from this syllabus document. Return ONLY valid JSON with this structure: {courseName: string, totalWeeks: number, weeks: [{weekNumber: number, title: string, topics: string[], learningGoals: string[], estimatedHours: number}], examDates: [{examName: string, date: string, topics: string[]}]}. If information is missing make reasonable academic assumptions.
        
        Syllabus Content:
        """
        ${contentToParse.substring(0, 15000)} 
        """
        `;

        let textResponse = '';
        let lastErr: any = null;

        for (const modelName of MODEL_PRIORITY) {
            try {
                console.log(`[/api/admin/syllabus/parse] Trying model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                textResponse = result.response.text();
                console.log(`[/api/admin/syllabus/parse] Success with model: ${modelName}`);
                break;
            } catch (err: any) {
                console.warn(`[/api/admin/syllabus/parse] Model "${modelName}" failed:`, err?.message);
                lastErr = err;
                const msg = (err?.message || '').toLowerCase();
                if (!msg.includes('404') && !msg.includes('not found')) break;
            }
        }

        if (!textResponse) throw lastErr || new Error('No response from AI');

        // Extract JSON from potential markdown tags
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("AI failed to return structured data.");
        }

        const curriculumData = JSON.parse(jsonMatch[0]);

        return NextResponse.json({ success: true, curriculum: curriculumData });

    } catch (error: any) {
        console.error("Syllabus Parse Error:", error);
        return NextResponse.json({
            error: "Failed to parse syllabus.",
            details: error.message
        }, { status: 500 });
    }
}
