// PathPilot Bharat Core Types
export interface Student {
  id: string;
  name: string;
  email?: string;
  phone: string;
  preferredLanguages: string[];
  educationLevel: string;
  subjects: string[];
  circadianProfile?: CircadianProfile;
  performanceHistory: PerformanceMetric[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CircadianProfile {
  peakEnergyHours: number[];
  lowEnergyHours: number[];
  sleepSchedule: {
    bedtime: string;
    wakeTime: string;
  };
  energyPattern: 'MORNING' | 'EVENING' | 'NIGHT';
}

export interface PerformanceMetric {
  id: string;
  studentId: string;
  timestamp: Date;
  subject: string;
  score: number;
  timeSpent: number;
  energyLevel: number;
  retentionRate: number;
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
  id: string;
  fromConcept: string;
  toConcept: string;
  type: 'PREREQUISITE' | 'RELATED' | 'BUILDS_ON' | 'APPLIES_TO';
  strength: number;
}

export interface Schedule {
  id: string;
  studentId: string;
  date: Date;
  timeBlocks: TimeBlock[];
  adaptationScore: number;
  adherenceRate: number;
}

export interface TimeBlock {
  startTime: Date;
  endTime: Date;
  subject: string;
  concepts: string[];
  energyLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  type: 'STUDY' | 'REVIEW' | 'PRACTICE' | 'REST';
}

export interface BurnoutAssessment {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  indicators: BurnoutIndicator[];
  timeToBreakdown: number; // hours
  recommendations: string[];
}

export interface BurnoutIndicator {
  type: 'STUDY_DURATION' | 'SLEEP_PATTERN' | 'PERFORMANCE_DECLINE' | 'STRESS_LEVEL';
  value: number;
  threshold: number;
  severity: number;
}

export interface CareerPath {
  id: string;
  name: string;
  description: string;
  requiredSkills: Skill[];
  salaryRange: SalaryRange;
  growthProspects: GrowthData;
  marketDemand: number;
  scenarios: CareerScenario[];
}

export interface Skill {
  name: string;
  level: number;
  importance: number;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  experience: string;
}

export interface GrowthData {
  yearlyGrowthRate: number;
  promotionTimeline: string;
  skillDevelopmentPath: string[];
}

export interface CareerScenario {
  id: string;
  career: string;
  title: string;
  description: string;
  scenarios: DayScenario[];
  learningObjectives: string[];
  assessmentCriteria: AssessmentCriteria[];
}

export interface DayScenario {
  time: string;
  activity: string;
  description: string;
  choices?: Choice[];
  outcome?: string;
}

export interface Choice {
  id: string;
  text: string;
  impact: number;
  explanation: string;
}

export interface AssessmentCriteria {
  skill: string;
  weight: number;
  description: string;
}

export interface WhatsAppMessage {
  from: string;
  body: string;
  type: 'text' | 'image' | 'document' | 'audio';
  media?: MediaFile;
  timestamp: Date;
}

export interface MediaFile {
  filename: string;
  mimetype: string;
  data: Buffer;
  size: number;
}

export interface WhatsAppResponse {
  to: string;
  body: string;
  type: 'text' | 'image' | 'document';
  media?: string;
}

export interface MasteryProof {
  id: string;
  studentId: string;
  skill: string;
  level: number;
  verificationHash: string;
  issuedAt: Date;
  validUntil: Date;
  verificationURL: string;
}

export interface LanguageDetection {
  primaryLanguage: string;
  confidence: number;
  codeMixing: boolean;
  mixedLanguages?: string[];
}

export interface AIResponse {
  text: string;
  language: string;
  confidence: number;
  context: any;
}

// Service Interfaces
export interface NeuralIngestionService {
  parsePDF(file: Buffer): Promise<KnowledgeGraph>;
  processImage(image: Buffer): Promise<KnowledgeGraph>;
  scrapeURL(url: string): Promise<KnowledgeGraph>;
  validateGraph(graph: KnowledgeGraph): Promise<ValidationResult>;
}

export interface BioLogicScheduler {
  generateSchedule(studentId: string, preferences: StudyPreferences): Promise<Schedule>;
  adaptSchedule(studentId: string, performanceData: PerformanceMetric[]): Promise<Schedule>;
  getOptimalStudyTime(studentId: string, subject: string): Promise<TimeWindow>;
}

export interface BurnoutPredictor {
  analyzeBurnoutRisk(studentId: string): Promise<BurnoutAssessment>;
  predictBurnout(studentId: string, timeHorizon: number): Promise<BurnoutPrediction>;
  recommendInterventions(assessment: BurnoutAssessment): Promise<Intervention[]>;
}

export interface CareerSimulator {
  generateScenario(career: string, studentProfile: Student): Promise<CareerScenario>;
  simulateDay(scenarioId: string, decisions: Decision[]): Promise<SimulationResult>;
  assessCareerFit(studentId: string, career: string): Promise<CareerFitScore>;
  getCareerRecommendations(studentId: string): Promise<CareerRecommendation[]>;
}

export interface VernacularAI {
  detectLanguage(text: string): Promise<LanguageDetection>;
  translateWithContext(text: string, targetLang: string, context: any): Promise<Translation>;
  generateResponse(prompt: string, language: string): Promise<AIResponse>;
  handleCodeMixing(text: string): Promise<ProcessedText>;
}

// Supporting Types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface StudyPreferences {
  preferredTimes: string[];
  subjectPriorities: { [subject: string]: number };
  sessionDuration: number;
  breakDuration: number;
}

export interface TimeWindow {
  start: Date;
  end: Date;
  energyLevel: number;
  availability: number;
}

export interface BurnoutPrediction {
  probability: number;
  timeframe: number;
  factors: string[];
  confidence: number;
}

export interface Intervention {
  type: 'REST' | 'EXERCISE' | 'SOCIAL' | 'PROFESSIONAL';
  description: string;
  duration: number;
  priority: number;
}

export interface Decision {
  scenarioId: string;
  choiceId: string;
  timestamp: Date;
}

export interface SimulationResult {
  score: number;
  feedback: string;
  skillsGained: string[];
  nextSteps: string[];
}

export interface CareerFitScore {
  score: number;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
}

export interface CareerRecommendation {
  career: string;
  fitScore: number;
  reasoning: string;
  nextSteps: string[];
}

export interface Translation {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
}

export interface ProcessedText {
  originalText: string;
  processedText: string;
  languages: string[];
  confidence: number;
}
