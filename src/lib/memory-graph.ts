import { Timestamp } from "firebase/firestore";

// --- Tier 1: Identity & Long-Term Intent ---
export interface StudentIdentity {
    uid: string;
    name: string;
    email: string;
    degree: {
        name: string; // e.g., "B.Tech Computer Science"
        currentSemester: number;
        targetYear: number; // e.g., 2026
    };
    careerIntent: {
        primaryPath: 'placement' | 'research' | 'entrepreneurship';
        targetRoles: string[]; // e.g., ["Software Engineer", "AI Researcher"]
        dreamCompanies?: string[];
    };
    createdAt: Timestamp;
}

// --- Tier 2: The Neural Knowledge Graph ---
export interface LearningVector {
    domain: string; // e.g., "Data Structures"
    confidence: number; // 0.0 to 1.0 (The AI's trust in the student)
    lastAssessed: Timestamp;
    decayRate: number; // How fast this student forgets this topic
}

export interface KnowledgeNode {
    id: string; // "unit_arrays_101"
    moduleId: string;
    title: string;
    prerequisites: string[]; // IDs of other nodes
    difficulty: 'basic' | 'intermediate' | 'advanced';
    estimatedHours: number;
    status: 'locked' | 'unlocked' | 'active' | 'completed' | 'decaying';
    masteryScore: number; // 0-100 derived from assessments
}

// --- Tier 3: Constraints & Reality Modeling ---
export interface ConstraintModel {
    weeklyHours: number;
    blackoutDates: string[]; // ISO Dates for exams, family events
    energyProfile: {
        peakHours: string[]; // e.g., ["09:00", "20:00"]
        burnoutThreshold: number; // Max hours before quality drops
    };
    stressLevel: number; // 0-10, sensed from user interaction/missed tasks
}

// --- Tier 4: The Evolution Log (Failure Memory) ---
export interface EvolutionLog {
    id: string;
    date: Timestamp;
    type: 'plan_failure' | 'exam_success' | 'burnout_detected';
    context: string; // "Skipped 3 days of DSA due to 'tiredness'"
    aiAdjustment: string; // "Reduced plan density by 20% for next week"
    userFeedback?: string; // "I was sick"
}

// --- Root Graph Document ---
export interface StudentGraph {
    identity: StudentIdentity;
    vectors: Record<string, LearningVector>; // domain -> vector
    constraints: ConstraintModel;
    logs: EvolutionLog[];
}
