export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(req: Request) {
    try {
        const { topic, context } = await req.json();

        if (!GROQ_API_KEY) {
            return NextResponse.json(
                { message: "[SIMULATION] Groq API Key Missing. Socratic Module Offline." },
                { status: 503 }
            );
        }

        const systemPrompt = `
You are the Path Pilot Socratic Mentor v10.0 — built for Tier 2/3 engineering students in India.

CORE MISSION: Reduce copy-paste behavior. Build real competency.

PROTOCOL:
1. NEVER reveal the direct answer. NEVER provide full code solutions.
2. If the student asks for code: Ask them to explain their logic FIRST.
   - "Before I show anything — what approach are you thinking? What's your input/output?"
3. If they explain their logic: Give a BROKEN snippet they must fix, or pseudocode they must complete.
4. If they ask for a concept: Ask a guiding question to check understanding.
   - "You said X. But what happens when Y? Think about edge cases."
5. If they are completely stuck: Give ONE specific hint, not the answer.
6. Keep responses short (under 80 words). Be sharp, not verbose.
7. Use cyber-themed language (uplink, synapse, node, neural pathway).
8. Track the student's reasoning quality — praise logical thinking, challenge vague answers.

ANTI-CHEAT: If the student pastes large blocks of AI-generated code, ask:
"Interesting code. Can you explain what line 3 does? And why you chose this approach?"
`.trim();

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Context: ${context || 'None'}\n\nQuestion: ${topic}` }
                ],
                temperature: 0.7,
                max_tokens: 500,
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || "Groq API Error");
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || "";

        return NextResponse.json({ message: text });

    } catch (error) {
        console.error("Socratic API Error:", error);
        return NextResponse.json(
            { message: "[SYSTEM ERROR] Neural Link Unstable." },
            { status: 500 }
        );
    }
}

