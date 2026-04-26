export interface Concept {
    id: string;
    name: string;
    description: string;
    difficulty: number;
    prerequisites: string[];
    masteryLevel: number;
    timeToMaster: number;
}

export interface Relationship {
    from: string;
    to: string;
    type: string;
}

export interface KnowledgeGraph {
    id: string;
    studentId: string;
    source: 'PDF' | 'IMAGE' | 'URL' | 'MANUAL';
    concepts: Concept[];
    relationships: Relationship[];
    metadata: {
        subject: string;
        difficulty: number;
        estimatedHours: number;
        language: string;
    };
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export interface TimeBlock {
    startTime: string;
    endTime: string;
    subject: string;
    concepts: string[];
    energyLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    type: 'STUDY' | 'REVIEW' | 'PRACTICE' | 'REST';
}

export interface Schedule {
    id: string;
    studentId: string;
    date: string;
    timeBlocks: TimeBlock[];
    adaptationScore: number;
    adherenceRate: number;
}

export interface BurnoutAssessment {
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    confidence: number;
    indicators: string[];
    timeToBreakdown: number; // hours
}

export interface CareerScenario {
    id: string;
    career: string;
    scenarios: any[];
    learningObjectives: string[];
    assessmentCriteria: any[];
}

// ============ Bio-Logic Scheduler Enhanced Types ============

export interface CircadianProfile {
    studentId: string;
    peakEnergyHours: number[]; // Hours of day (0-23)
    lowEnergyHours: number[];
    optimalStudyWindows: TimeWindow[];
    sleepPattern: SleepPattern;
    cognitiveLoadCapacity: number; // 0-100
    lastUpdated: string;
}

export interface TimeWindow {
    startHour: number;
    endHour: number;
    energyLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    recommendedActivities: string[];
}

export interface SleepPattern {
    averageBedtime: string; // HH:MM format
    averageWakeTime: string;
    averageDuration: number; // hours
    quality: number; // 0-100
}

export interface PerformanceData {
    id: string;
    studentId: string;
    timestamp: string;
    subject: string;
    concept: string;
    performanceScore: number; // 0-100
    timeOfDay: number; // Hour (0-23)
    energyLevelReported: 'HIGH' | 'MEDIUM' | 'LOW';
    durationMinutes: number;
    completionRate: number; // 0-1
}

export interface PerformanceCorrelation {
    studentId: string;
    subjectPerformanceByHour: Record<string, Record<number, number>>; // subject -> hour -> avg score
    optimalHoursBySubject: Record<string, number[]>;
    energyAccuracy: number; // How well reported energy matches performance
    recommendations: string[];
}

export interface ScheduleConstraints {
    availableHours: TimeWindow[];
    subjects: string[];
    priorityConcepts: string[];
    maxDailyStudyHours: number;
    breakFrequency: number; // minutes between breaks
    breakDuration: number; // minutes
    preferences: {
        preferMorning?: boolean;
        preferEvening?: boolean;
        avoidLateNight?: boolean;
    };
}

export interface ScheduleFeedback {
    scheduleId: string;
    adherenceRate: number; // 0-1
    completedBlocks: string[];
    skippedBlocks: string[];
    performanceByBlock: Record<string, number>;
    energyMismatches: number; // Count of blocks where energy didn't match prediction
    studentNotes?: string;
}

// ============ Burnout Prediction Enhanced Types ============

export interface BurnoutMetrics {
    studentId: string;
    timestamp: string;
    studyDurationToday: number; // minutes
    studyDurationWeek: number; // minutes
    breaksTaken: number;
    averageBreakDuration: number; // minutes
    sleepQuality: number; // 0-100
    sleepDuration: number; // hours
    performanceTrend: number; // -1 to 1 (declining to improving)
    stressLevel: number; // 0-100 (self-reported or inferred)
    socialInteractions: number; // count
    physicalActivity: number; // minutes
    screenTime: number; // hours
    missedDeadlines: number;
}

export interface BurnoutPrediction {
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    confidence: number; // 0-1
    timeToBreakdown: number; // hours until predicted burnout
    primaryIndicators: string[];
    secondaryIndicators: string[];
    trendDirection: 'IMPROVING' | 'STABLE' | 'DECLINING';
    predictedAt: string;
}

export interface Intervention {
    id: string;
    type: 'IMMEDIATE' | 'SCHEDULED' | 'PREVENTIVE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    title: string;
    description: string;
    actionItems: string[];
    estimatedDuration: number; // minutes
    category: 'REST' | 'SOCIAL' | 'PHYSICAL' | 'MENTAL' | 'ACADEMIC';
    effectiveness: number; // 0-1 based on historical data
}

export interface StudentContext {
    studentId: string;
    currentCourseLoad: number;
    upcomingDeadlines: Array<{ subject: string; date: string; importance: number }>;
    supportSystem: 'STRONG' | 'MODERATE' | 'WEAK';
    historicalBurnoutEvents: number;
    copingStrategies: string[];
    preferences: {
        preferredInterventions: string[];
        availableTime: number; // minutes per day
    };
}

// ============ Career Simulator Enhanced Types ============

export interface DetailedScenario {
    id: string;
    career: string;
    title: string;
    difficulty: number; // 1-5
    description: string;
    context: string;
    decisions: Decision[];
    requiredSkills: string[];
    learningObjectives: string[];
    estimatedDuration: number; // minutes
}

export interface Decision {
    id: string;
    prompt: string;
    options: DecisionOption[];
    timeLimit?: number; // seconds
    skillsTested: string[];
}

export interface DecisionOption {
    id: string;
    text: string;
    outcome: ScenarioOutcome;
    skillsRequired: string[];
    correctness: number; // 0-1
}

export interface ScenarioOutcome {
    nextScenarioId?: string;
    feedback: string;
    score: number;
    skillsGained: string[];
    consequenceDescription: string;
    isTerminal: boolean;
}

export interface SkillGapAnalysis {
    studentId: string;
    targetCareer: string;
    currentSkills: Skill[];
    requiredSkills: Skill[];
    gaps: SkillGap[];
    overallReadiness: number; // 0-100
    estimatedTimeToReady: number; // months
    recommendedActions: string[];
}

export interface Skill {
    name: string;
    category: string;
    level: number; // 0-100
    verified: boolean;
    lastAssessed?: string;
}

export interface SkillGap {
    skillName: string;
    currentLevel: number;
    requiredLevel: number;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    learningResources: string[];
    estimatedTimeToAcquire: number; // hours
}

export interface CareerPath {
    startingPoint: string;
    targetCareer: string;
    milestones: Milestone[];
    totalDuration: number; // months
    difficulty: number; // 1-5
    successRate: number; // 0-1 based on historical data
}

export interface Milestone {
    id: string;
    title: string;
    description: string;
    skillsToAcquire: string[];
    estimatedDuration: number; // months
    prerequisites: string[];
    verificationMethod: string;
}

// ============ Neural Ingestion Enhanced Types ============

export interface QualityScore {
    overall: number; // 0-100
    conceptClarity: number; // 0-100
    relationshipAccuracy: number; // 0-100
    completeness: number; // 0-100
    consistency: number; // 0-100
    issues: string[];
    suggestions: string[];
}

export interface ProcessingResult {
    success: boolean;
    knowledgeGraph?: KnowledgeGraph;
    qualityScore?: QualityScore;
    processingTime: number; // milliseconds
    errors?: string[];
    warnings?: string[];
}

// ============ Orchestrator Types ============

export interface PersonalizedPlan {
    studentId: string;
    generatedAt: string;
    schedule: Schedule;
    burnoutAssessment: BurnoutAssessment;
    careerRecommendations: string[];
    knowledgeGraphs: KnowledgeGraph[];
    interventions: Intervention[];
    nextReviewDate: string;
}

export interface HealthStatus {
    studentId: string;
    timestamp: string;
    overallHealth: number; // 0-100
    burnoutRisk: BurnoutAssessment;
    scheduleAdherence: number; // 0-1
    performanceTrend: 'IMPROVING' | 'STABLE' | 'DECLINING';
    activeInterventions: Intervention[];
    alerts: Alert[];
}

export interface Alert {
    id: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    title: string;
    message: string;
    actionRequired: boolean;
    timestamp: string;
}
