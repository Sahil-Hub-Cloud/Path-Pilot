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
        const rawText = formData.get('text') as string;

        let contentToParse = '';

        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                try {
                    const data = await pdf(buffer);
                    contentToParse = data.text;
                } catch (pdfError) {
                    console.error("PDF Parsing Error:", pdfError);
                    return NextResponse.json({ error: "Failed to parse PDF file. Please ensure it is a valid document." }, { status: 400 });
                }
            } else {
                contentToParse = buffer.toString('utf-8');
            }
        } else if (rawText) {
            contentToParse = rawText;
        } else {
            return NextResponse.json({ error: "No syllabus content provided. Please upload a file or paste text." }, { status: 400 });
        }

        if (contentToParse.trim().length < 50) {
            return NextResponse.json({ error: "Content too short to generate a meaningful roadmap." }, { status: 400 });
        }

        console.log('[/api/ingest] API Key exists:', !!process.env.GEMINI_API_KEY);

        const MODEL_PRIORITY = ['gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash'];

        const prompt = `
        You are Path Pilot's AI Education Architect. Your mission is to transform a student's syllabus into a high-octane, interactive learning journey.
        
        Syllabus Content:
        """
        ${contentToParse.substring(0, 10000)} 
        """

        INSTRUCTIONS:
        1. Extract the core subjects and modules from this syllabus.
        2. Assign each module a cyber-themed title (e.g., "SQL Injection" -> "Database Infiltration").
        3. Design 3 specific learning modules with:
           - title: Strategic and cyber-themed.
           - description: Exciting, mission-focused summary.
           - type: One of SIMULATION, FORENSICS, OFFENSIVE, DEFENSIVE, or ANALYSIS.
           - difficulty: BEGINNER, INTERMEDIATE, or ADVANCED.
           - estimated_hours: 1-5 hours.
           - energy_cost: 10-40.
           - risk_level: LOW, MEDIUM, or HIGH.
           - icon: A relevant emoji.
        4. Return ONLY a valid JSON object with this exact structure:
        {
          "courseTitle": "Extracted Course Name",
          "modules": [
            {
              "id": 1,
              "title": "Module Title",
              "description": "Description",
              "type": "TYPE",
              "difficulty": "DIFFICULTY",
              "estimated_hours": 2,
              "energy_cost": 20,
              "risk_level": "LOW",
              "icon": "🖥️",
              "color": "from-emerald-500/20 to-emerald-900/20",
              "borderColor": "border-emerald-500/30",
              "accentColor": "text-emerald-400"
            }
          ]
        }
        
        Rules for colors:
        - Emerald/Green for Beginner/Defensive
        - Amber/Orange for Intermediate/Forensics
        - Red/Pink for Advanced/Offensive/Simulation
        `;

        let textResponse = '';
        let lastErr: any = null;

        for (const modelName of MODEL_PRIORITY) {
            try {
                console.log(`[/api/ingest] Trying model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                textResponse = result.response.text();
                console.log(`[/api/ingest] Success with model: ${modelName}`);
                break;
            } catch (err: any) {
                console.warn(`[/api/ingest] Model "${modelName}" failed:`, err?.message);
                lastErr = err;
                const msg = (err?.message || '').toLowerCase();
                if (!msg.includes('404') && !msg.includes('not found')) break;
            }
        }

        if (!textResponse) throw lastErr || new Error('No response from AI');

        // Clean up markdown markers
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("AI failed to return structured data.");
        }

        const roadmapData = JSON.parse(jsonMatch[0]);

        return NextResponse.json(roadmapData);

    } catch (error: any) {
        console.error("Syllabus Ingestion Error:", error);
        return NextResponse.json({
            error: "Neural link timeout. Could not process syllabus.",
            details: error.message
        }, { status: 500 });
    }
}

