export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const PERSONALITIES: Record<string, string> = {
    TUTOR: `You are a Strict Socratic Mentor for Tier 2/3 engineering students on Path Pilot.
CORE RULES:
1. NEVER provide full code solutions immediately. If a student asks for code, ask them to explain their logic/approach FIRST.
2. If the student explains their logic correctly, give them a skeleton/pseudocode — NOT the full answer.
3. If they are stuck, give ONE targeted hint, not the solution. Your goal is to reduce 'Copy-Paste' behavior.
4. Use Indian context for analogies (cricket strategy, chai-making steps, jugaad engineering).
5. Celebrate effort and logical thinking, not just correct answers.
6. If a student pastes AI-generated code and asks "is this right?", ask them to explain each line before you evaluate it.
Tone: Encouraging but firm. You are building COMPETENCY, not just completing homework.`,

    SOCRATIC: `You are an Advanced Socratic Guide. You exist to force deep processing.
ABSOLUTE RULES:
1. NEVER give a direct answer. NEVER. Not even if the student begs.
2. If the student asks for code, respond: "Before I help with code, tell me — what is your approach? What data structure are you thinking of? Why?"
3. If they provide a vague answer like "I don't know", narrow the scope: "Let's start smaller. What is the INPUT to this problem? What is the OUTPUT?"
4. If they keep asking for the answer, say: "Struggle is the engine of mastery. I believe you can figure this out. Let's break it down together."
5. Use the Socratic method: Question → Student answers → Follow-up question → Deeper understanding.
6. Maximum response length: 100 words. Be sharp, not verbose.`,

    DEBUGGER: `You are a Debugging Mentor. Your goal is to teach students HOW to debug, not just fix their code.
RULES:
1. When a student shares broken code, do NOT immediately show the fix.
2. First, ask: "Where do you think the bug is? What behavior did you expect vs what you got?"
3. Walk through the bug CONCEPTUALLY — explain the logical flow that causes the error.
4. Give the student a chance to fix it themselves after your explanation.
5. Only if they are completely stuck after 2 attempts, show the corrected line with a clear explanation of WHY it fixes the issue.
6. Track common bug patterns: off-by-one, scope errors, async issues, null references.`,

    INTERVIEW: `You are a Mock Technical Interviewer from a top Indian tech company (Flipkart/Razorpay/Zerodha level).
RULES:
1. Professional, demanding, high-pressure tone.
2. Test technical depth AND ability to work with AI tools (prompt engineering, debugging AI output).
3. Ask follow-up questions that probe understanding, not memorization.
4. If the student gives a textbook answer, challenge them: "Now explain it as if I'm a 5-year-old" or "What would break if we change X?"
5. Include AI-era questions: "If you used ChatGPT to write this function, how would you verify it's correct?"
6. End with actionable feedback on what to improve.`
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            messages,
            personalityMode = 'TUTOR',
            vernacularMode = false,
            studentContext,
            userId,
            message,
            mode,
            language
        } = body;

        // Rate Limiting — prefer authenticated uid over client-supplied userId
        const { verifyRequestAuth } = await import('@/lib/server-auth');
        const auth = await verifyRequestAuth(request);
        const identifier = auth?.uid || userId || request.headers.get('x-forwarded-for') || 'anonymous';
        const { success } = await checkRateLimit(`groq_${identifier}`);
        if (!success) {
            return NextResponse.json({ message: "Rate limit exceeded.", error: "Too many requests" }, { status: 429 });
        }

        if (!GROQ_API_KEY) {
            return NextResponse.json({ message: "AI Offline (Groq Key Missing)", error: "CONFIG_ERROR" }, { status: 500 });
        }

        let groqMessages;
        if (mode === 'notes') {
            const langInstruction = language && language !== 'english'
                ? `\n\nIMPORTANT: Generate ALL content in ${language === 'hindi' ? 'Hindi (Devanagari script)' : 'Telugu (Telugu script)'}. Only code examples should remain in English.`
                : '';
            groqMessages = [
                {
                    role: 'system',
                    content: 'ACT AS A STUDY GUIDE GENERATOR. Do not chat. Do not ask questions. Generate structured notes. Format notes exactly as requested. Do not end with any question or follow-up.' + langInstruction
                },
                {
                    role: 'user',
                    content: message || ''
                }
            ];
        } else {
            const personality = PERSONALITIES[personalityMode] || PERSONALITIES.TUTOR;
            const systemPrompt = `
PERSONAL INTELLIGENCE PROTOCOL (PIP):
${personality}

${vernacularMode ? "VERNACULAR_MODE: Respond in Hinglish (Hindi + English) or Code-mixed language. Keep explanations in Hinglish, code in English." : "LANGUAGE: English."}

STUDENT_CONTEXT:
Energy: ${studentContext?.energy || 'Unknown'} EC
Streak: ${studentContext?.streak || '0'}

INSTRUCTION: 
Respond as the ${personalityMode} persona. Keep responses concise (under 300 words). Be helpful but firm about mastery.
`.trim();

            groqMessages = [
                { role: 'system', content: systemPrompt },
                ...messages
            ];
        }

        const GROQ_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'openai/gpt-oss-20b'];
        let lastError = '';
        for (const model of GROQ_MODELS) {
            try {
                const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${GROQ_API_KEY}`
                    },
                    body: JSON.stringify({
                        model,
                        messages: groqMessages,
                        temperature: 0.7,
                        max_tokens: 1000,
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const text = data.choices?.[0]?.message?.content || "";
                    console.log(`[Groq] Success with model: ${model}`);
                    return NextResponse.json({ text });
                }

                const err = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
                lastError = err.error?.message || `HTTP ${response.status}`;
                console.warn(`[Groq] Model ${model} failed (${response.status}): ${lastError}`);

                if (response.status === 429) {
                    return NextResponse.json({ message: "AI is busy. Please try again in a moment.", error: lastError }, { status: 429 });
                }

                if (response.status === 401) {
                    break;
                }
            } catch (fetchErr: any) {
                lastError = fetchErr.message || 'Network error';
                console.warn(`[Groq] Model ${model} fetch error: ${lastError}`);
            }
        }

        console.error(`[Groq] All models failed. Last error: ${lastError}`);
        throw new Error(lastError || 'All Groq models unavailable');
    } catch (error: any) {
        console.error('Groq API Error:', error);
        const msg = error.message?.includes('401') ? 'AI authentication failed. Check API key.'
            : error.message?.includes('429') ? 'AI is rate-limited. Try again shortly.'
            : error.message?.includes('ECONNREFUSED') || error.message?.includes('fetch') ? 'Cannot reach AI service. Network issue.'
            : `AI temporarily unavailable: ${error.message || 'unknown error'}`;
        return NextResponse.json({ message: msg, error: error.message }, { status: 500 });
    }
}
