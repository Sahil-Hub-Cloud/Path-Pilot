import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { CopilotService } from '@/lib/services/copilot-service';

/**
 * Admin Copilot API — AI-powered quiz and challenge generation for faculty
 * Addresses the pain point: "My faculty is too busy to create quizzes."
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, action, topic, difficulty, numQuestions, language, contentText } = body;

        // RBAC check
        const { authorized } = await requireRole(userId, 'faculty', 'hod', 'admin');
        if (!authorized) {
            return NextResponse.json({ error: 'Unauthorized. Faculty or above required.' }, { status: 403 });
        }

        switch (action) {
            case 'generate_quiz': {
                if (!topic) {
                    return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
                }
                const quiz = await CopilotService.generateQuiz(
                    topic,
                    difficulty || 'medium',
                    numQuestions || 5
                );
                return NextResponse.json({ success: true, quiz });
            }

            case 'generate_challenge': {
                if (!topic) {
                    return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
                }
                const challenge = await CopilotService.generateCodingChallenge(
                    topic,
                    language || 'javascript'
                );
                return NextResponse.json({ success: true, challenge });
            }

            case 'generate_from_content': {
                if (!contentText) {
                    return NextResponse.json({ error: 'Content text is required' }, { status: 400 });
                }
                const type = body.type || 'quiz';
                const result = await CopilotService.generateFromContent(contentText, type);
                return NextResponse.json({ success: true, result });
            }

            default:
                return NextResponse.json({
                    error: 'Invalid action. Use: generate_quiz, generate_challenge, or generate_from_content',
                }, { status: 400 });
        }
    } catch (error: any) {
        console.error('Admin Copilot API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
