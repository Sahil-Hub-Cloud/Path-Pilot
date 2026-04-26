import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest) {
    try {
        const { text } = await request.json();

        if (!text) {
            return NextResponse.json({ message: "Text required." }, { status: 400 });
        }

        if (!GEMINI_API_KEY) {
            return NextResponse.json({ message: "API Key missing." }, { status: 500 });
        }

        const model = "text-embedding-004";
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: `models/${model}`,
                content: { parts: [{ text }] }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini Embedding Error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json({ embedding: data.embedding.values });
    } catch (error: any) {
        console.error('Embedding API Error:', error);
        return NextResponse.json({ message: "Embedding failed.", error: error.message }, { status: 500 });
    }
}
