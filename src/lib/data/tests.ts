export interface Question {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number; // Index in options
}

export interface Test {
    id: string;
    title: string;
    type: 'session' | 'lab' | 'final';
    questions: Question[];
}

export const tests: Record<string, Test> = {
    'html-intro': {
        id: 'html-intro',
        title: 'HTML Basics Quiz',
        type: 'session',
        questions: [
            {
                id: 'q1',
                text: 'What does HTML stand for?',
                options: [
                    'Hyper Text Markup Language',
                    'High Tech Modern Language',
                    'Hyper Transfer Markup Language',
                    'Home Tool Markup Language'
                ],
                correctAnswer: 0
            },
            {
                id: 'q2',
                text: 'Which tag is used for the largest heading?',
                options: ['<head>', '<h6>', '<heading>', '<h1>'],
                correctAnswer: 3
            }
        ]
    },
    'sec-intro': {
        id: 'sec-intro',
        title: 'Security Fundamentals Quick Check',
        type: 'session',
        questions: [
            {
                id: 'q1',
                text: 'What is the "CIA" triad in cybersecurity?',
                options: [
                    'Central Intelligence Agency',
                    'Confidentiality, Integrity, Availability',
                    'Control, Inspection, Authentication',
                    'Cyber Incident Analysis'
                ],
                correctAnswer: 1
            }
        ]
    }
};

export function getTestById(id: string): Test | undefined {
    return tests[id];
}
