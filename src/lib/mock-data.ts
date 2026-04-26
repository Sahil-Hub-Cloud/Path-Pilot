// Minimal mock data - only essential types and data used by remaining components

export interface Module {
    id: string;
    title: string;
    description: string;
    duration: string;
    lessons: number;
}

export interface MockModule {
    id: number;
    name: string;
    description: string;
    type: string;
    estimatedHours: number;
    riskLevel: string;
    energyCost: number;
    units: { id: number; name: string; estimatedTime: string }[];
}

// InsightCard for insight-engine.ts
export interface InsightCard {
    id: number;
    type: 'risk' | 'strength' | 'suggestion' | 'pattern';
    title: string;
    message: string;
    timestamp: string;
    context: string;
    confidence: number;
}

// Mock modules for ModuleService fallback
export const MODULES: MockModule[] = [
    {
        id: 1,
        name: 'Introduction to Programming',
        description: 'Learn programming fundamentals',
        type: 'FUNDAMENTALS',
        estimatedHours: 10,
        riskLevel: 'LOW',
        energyCost: 20,
        units: [
            { id: 1, name: 'Variables & Data Types', estimatedTime: '2h' },
            { id: 2, name: 'Control Flow', estimatedTime: '2h' },
        ]
    },
    {
        id: 2,
        name: 'Web Development Basics',
        description: 'Build your first website',
        type: 'WEB',
        estimatedHours: 15,
        riskLevel: 'LOW',
        energyCost: 25,
        units: [
            { id: 3, name: 'HTML Fundamentals', estimatedTime: '3h' },
            { id: 4, name: 'CSS Styling', estimatedTime: '3h' },
        ]
    },
    {
        id: 3,
        name: 'JavaScript Essentials',
        description: 'Master JavaScript programming',
        type: 'PROGRAMMING',
        estimatedHours: 20,
        riskLevel: 'MEDIUM',
        energyCost: 30,
        units: [
            { id: 5, name: 'Functions & Scope', estimatedTime: '4h' },
            { id: 6, name: 'Async Programming', estimatedTime: '4h' },
        ]
    }
];
