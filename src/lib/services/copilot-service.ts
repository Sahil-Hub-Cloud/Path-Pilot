const GROQ_API_KEY = process.env.GROQ_API_KEY;

export interface QuizQuestion {
    id: number;
    type: 'mcq' | 'coding' | 'short_answer';
    question: string;
    options?: string[];
    correct_answer: string;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

export interface CodingChallenge {
    id: number;
    title: string;
    description: string;
    starter_code: string;
    expected_output: string;
    hints: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    language: string;
}

export class CopilotService {
    /**
     * Generate quiz questions from a topic.
     */
    static async generateQuiz(
        topic: string,
        difficulty: 'easy' | 'medium' | 'hard' = 'medium',
        numQuestions: number = 5
    ): Promise<QuizQuestion[]> {
        if (!GROQ_API_KEY) {
            return this.getMockQuiz(topic, numQuestions);
        }

        const prompt = `You are an expert quiz creator for computer science education.
Generate ${numQuestions} quiz questions about "${topic}" at ${difficulty} difficulty.

RULES:
1. Mix question types: MCQ (multiple choice), short answer, and coding questions.
2. Each MCQ must have exactly 4 options (A, B, C, D).
3. Provide clear explanations for each answer.
4. Make questions progressively harder.
5. Return ONLY a JSON array, no markdown formatting.

Schema per question:
{
    "id": number,
    "type": "mcq" | "coding" | "short_answer",
    "question": "Question text",
    "options": ["A) ...", "B) ...", "C) ...", "D) ..."],  // only for MCQ
    "correct_answer": "The answer or option letter",
    "explanation": "Why this is correct",
    "difficulty": "${difficulty}"
}`;

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: 'You are a quiz generator. Return ONLY valid JSON arrays.' },
                        { role: 'user', content: prompt },
                    ],
                    temperature: 0.7,
                    max_tokens: 2000,
                }),
            });

            if (!response.ok) throw new Error('Groq API Error');

            const data = await response.json();
            const text = data.choices?.[0]?.message?.content || '';
            const cleaned = text.replace(/```json|```/g, '').trim();

            try {
                return JSON.parse(cleaned);
            } catch {
                console.error('CopilotService: Failed to parse quiz JSON');
                return this.getMockQuiz(topic, numQuestions);
            }
        } catch (e) {
            console.error('CopilotService: Quiz generation failed:', e);
            return this.getMockQuiz(topic, numQuestions);
        }
    }

    /**
     * Generate a coding challenge from a topic.
     */
    static async generateCodingChallenge(
        topic: string,
        language: string = 'javascript'
    ): Promise<CodingChallenge | null> {
        if (!GROQ_API_KEY) return this.getMockChallenge(topic, language);

        const prompt = `Create a coding challenge about "${topic}" in ${language}.

Return JSON ONLY:
{
    "id": 1,
    "title": "Challenge Title",
    "description": "What the student needs to build",
    "starter_code": "Starter code with TODO comments",
    "expected_output": "What the correct solution should output",
    "hints": ["Hint 1", "Hint 2", "Hint 3"],
    "difficulty": "medium",
    "language": "${language}"
}`;

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: 'You are a coding challenge creator. Return ONLY valid JSON.' },
                        { role: 'user', content: prompt },
                    ],
                    temperature: 0.8,
                    max_tokens: 1500,
                }),
            });

            if (!response.ok) throw new Error('Groq API Error');

            const data = await response.json();
            const text = data.choices?.[0]?.message?.content || '';
            const cleaned = text.replace(/```json|```/g, '').trim();
            const match = cleaned.match(/\{[\s\S]*\}/);

            return match ? JSON.parse(match[0]) : this.getMockChallenge(topic, language);
        } catch (e) {
            console.error('CopilotService: Challenge generation failed:', e);
            return this.getMockChallenge(topic, language);
        }
    }

    /**
     * Generate content from uploaded syllabus text.
     */
    static async generateFromContent(
        contentText: string,
        type: 'quiz' | 'challenge' = 'quiz'
    ): Promise<QuizQuestion[] | CodingChallenge | null> {
        const topicSummary = contentText.substring(0, 2000);

        if (type === 'quiz') {
            return this.generateQuiz(`Based on this content: ${topicSummary}`);
        } else {
            return this.generateCodingChallenge(`Based on this content: ${topicSummary}`);
        }
    }

    // ─── Mock Fallbacks ─────────────────────────────────────────
    private static getMockQuiz(topic: string, count: number): QuizQuestion[] {
        return Array.from({ length: count }, (_, i) => ({
            id: i + 1,
            type: 'mcq' as const,
            question: `Sample question ${i + 1} about ${topic}`,
            options: ['A) Option 1', 'B) Option 2', 'C) Option 3', 'D) Option 4'],
            correct_answer: 'A',
            explanation: 'This is a mock question. Configure GROQ_API_KEY for real AI generation.',
            difficulty: 'medium' as const,
        }));
    }

    private static getMockChallenge(topic: string, language: string): CodingChallenge {
        return {
            id: 1,
            title: `${topic} Challenge`,
            description: `Write a solution for ${topic} (Mock — configure GROQ_API_KEY for AI generation)`,
            starter_code: `// TODO: Implement ${topic}\nconsole.log("Hello World");`,
            expected_output: 'Hello World',
            hints: ['Think about the problem step by step', 'Break it into smaller parts'],
            difficulty: 'medium',
            language,
        };
    }
}
