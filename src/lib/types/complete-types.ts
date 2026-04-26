// PathPilot Complete Platform - Type Definitions
// TypeScript interfaces for all database entities and modules

// ============================================
// 1. USER & PROFILE TYPES
// ============================================
export interface User {
    id: string;
    email: string;
    username: string;
    full_name: string;
    avatar_url?: string;
    bio?: string;
    college?: string;
    graduation_year?: number;
    current_domain?: string;
    learning_level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
    total_xp: number;
    current_level: number;
    streak_days: number;
    last_activity_date?: string;
    preferences?: Record<string, any>;
    created_at: string;
    updated_at: string;
}

// ============================================
// 2. DOMAIN & ROADMAP TYPES
// ============================================
export interface Domain {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    color?: string;
    difficulty_level: number;
    estimated_hours?: number;
    job_market_demand?: number;
    created_at: string;
}

export interface Roadmap {
    id: string;
    domain_id: string;
    title: string;
    description?: string;
    graph_data: RoadmapGraphData;
    estimated_completion_hours?: number;
    created_at: string;
    updated_at: string;
}

export interface RoadmapGraphData {
    nodes: RoadmapNode[];
    edges: RoadmapEdge[];
}

export interface RoadmapNode {
    id: string;
    title: string;
    description?: string;
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
    x: number;
    y: number;
}

export interface RoadmapEdge {
    source: string;
    target: string;
    type?: 'required' | 'recommended' | 'optional';
}

export interface RoadmapMilestone {
    id: string;
    roadmap_id: string;
    title: string;
    description?: string;
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
    position: number;
    prerequisites: string[];
    created_at: string;
}

// ============================================
// 3. COURSE & CONTENT TYPES
// ============================================
export interface Course {
    id: string;
    domain_id?: string;
    title: string;
    slug: string;
    description?: string;
    thumbnail_url?: string;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    estimated_hours?: number;
    instructor_name?: string;
    rating?: number;
    enrollment_count: number;
    is_published: boolean;
    tags?: string[];
    created_at: string;
    updated_at: string;
}

export interface CourseModule {
    id: string;
    course_id: string;
    title: string;
    description?: string;
    position: number;
    created_at: string;
}

export interface Lesson {
    id: string;
    module_id: string;
    title: string;
    slug: string;
    content_type: 'VIDEO' | 'TEXT' | 'CODE' | 'MIXED';
    video_url?: string;
    video_duration?: number;
    text_content?: string;
    code_snippets?: CodeSnippet[];
    position: number;
    is_free: boolean;
    created_at: string;
    updated_at: string;
}

export interface CodeSnippet {
    language: string;
    code: string;
    explanation?: string;
    filename?: string;
}

export interface CourseEnrollment {
    id: string;
    user_id: string;
    course_id: string;
    enrolled_at: string;
    last_accessed_at: string;
    completion_percentage: number;
}

export interface LessonProgress {
    id: string;
    user_id: string;
    lesson_id: string;
    is_completed: boolean;
    last_position: number;
    time_spent: number;
    completed_at?: string;
    created_at: string;
    updated_at: string;
}

// ============================================
// 4. LAB TYPES
// ============================================
export interface Lab {
    id: string;
    course_id?: string;
    lesson_id?: string;
    title: string;
    description?: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    programming_language: string;
    environment_config?: Record<string, any>;
    starter_code?: string;
    instructions: string;
    hints?: string[];
    test_cases: TestCase[];
    solution_code?: string;
    estimated_minutes?: number;
    xp_reward: number;
    created_at: string;
    updated_at: string;
}

export interface TestCase {
    id: string;
    input: any;
    expected_output: any;
    hidden: boolean;
    description?: string;
}

export interface LabSubmission {
    id: string;
    user_id: string;
    lab_id: string;
    code: string;
    language: string;
    test_results?: TestResult[];
    is_passed: boolean;
    execution_time?: number;
    submitted_at: string;
}

export interface TestResult {
    test_id: string;
    passed: boolean;
    output?: any;
    error?: string;
    execution_time?: number;
}

// ============================================
// 5. PROJECT TYPES
// ============================================
export interface Project {
    id: string;
    domain_id?: string;
    title: string;
    description?: string;
    difficulty: 'STARTER' | 'INTERMEDIATE' | 'CAPSTONE';
    requirements: string;
    tech_stack?: string[];
    starter_template_url?: string;
    demo_url?: string;
    estimated_hours?: number;
    xp_reward: number;
    tags?: string[];
    created_at: string;
    updated_at: string;
}

export interface ProjectSubmission {
    id: string;
    user_id: string;
    project_id: string;
    repository_url?: string;
    live_url?: string;
    description?: string;
    code_files?: Record<string, string>;
    ai_review_score?: number;
    ai_review_feedback?: AIReviewFeedback;
    is_featured: boolean;
    submitted_at: string;
    updated_at: string;
}

export interface AIReviewFeedback {
    overall_score: number;
    readability: number;
    efficiency: number;
    best_practices: number;
    security: number;
    suggestions: ReviewSuggestion[];
    strengths: string[];
    improvements: string[];
}

export interface ReviewSuggestion {
    file: string;
    line?: number;
    severity: 'INFO' | 'WARNING' | 'ERROR';
    message: string;
    suggestion?: string;
}

// ============================================
// 6. ASSESSMENT TYPES
// ============================================
export interface Quiz {
    id: string;
    course_id: string;
    module_id?: string;
    title: string;
    description?: string;
    time_limit?: number;
    passing_score: number;
    xp_reward: number;
    created_at: string;
    updated_at: string;
}

export interface QuizQuestion {
    id: string;
    quiz_id: string;
    question_text: string;
    question_type: 'MCQ' | 'MULTIPLE_SELECT' | 'TRUE_FALSE' | 'CODE';
    options?: QuestionOption[];
    correct_answer?: string;
    explanation?: string;
    position: number;
    points: number;
    created_at: string;
}

export interface QuestionOption {
    text: string;
    is_correct: boolean;
}

export interface QuizAttempt {
    id: string;
    user_id: string;
    quiz_id: string;
    answers: Record<string, any>;
    score: number;
    percentage: number;
    is_passed: boolean;
    time_taken?: number;
    attempted_at: string;
}

export interface CodingChallenge {
    id: string;
    title: string;
    slug: string;
    description: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    category?: string[];
    input_format?: string;
    output_format?: string;
    constraints?: string;
    test_cases: TestCase[];
    solution_code?: Record<string, string>;
    hints?: string[];
    xp_reward: number;
    acceptance_rate?: number;
    created_at: string;
}

export interface ChallengeSubmission {
    id: string;
    user_id: string;
    challenge_id: string;
    code: string;
    language: string;
    test_results?: TestResult[];
    is_accepted: boolean;
    runtime?: number;
    memory_used?: number;
    submitted_at: string;
}

export interface MockInterview {
    id: string;
    user_id: string;
    interview_type: 'BEHAVIORAL' | 'TECHNICAL' | 'MIXED';
    domain?: string;
    questions: InterviewQuestion[];
    answers?: Record<string, string>;
    ai_feedback?: InterviewFeedback;
    overall_score?: number;
    duration?: number;
    created_at: string;
}

export interface InterviewQuestion {
    id: string;
    question: string;
    type: 'BEHAVIORAL' | 'TECHNICAL';
    category?: string;
}

export interface InterviewFeedback {
    strengths: string[];
    improvements: string[];
    communication_score: number;
    technical_score: number;
    confidence_score: number;
    recommendations: string[];
}

// ============================================
// 7. CERTIFICATE TYPES
// ============================================
export interface Certificate {
    id: string;
    user_id: string;
    course_id?: string;
    certificate_type: 'COURSE' | 'PROJECT' | 'DOMAIN' | 'ACHIEVEMENT';
    title: string;
    description?: string;
    verification_id: string;
    qr_code_url?: string;
    pdf_url?: string;
    issued_at: string;
    expires_at?: string;
    is_featured: boolean;
    metadata?: Record<string, any>;
}

// ============================================
// 8. GAMIFICATION TYPES
// ============================================
export interface Achievement {
    id: string;
    title: string;
    description?: string;
    icon?: string;
    category: string;
    unlock_condition: UnlockCondition;
    xp_reward: number;
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
    created_at: string;
}

export interface UnlockCondition {
    type: string;
    target?: string;
    value: number;
}

export interface UserAchievement {
    id: string;
    user_id: string;
    achievement_id: string;
    unlocked_at: string;
}

export interface Badge {
    id: string;
    name: string;
    description?: string;
    image_url?: string;
    category?: string;
    unlock_criteria?: Record<string, any>;
    created_at: string;
}

export interface UserBadge {
    id: string;
    user_id: string;
    badge_id: string;
    earned_at: string;
}

export interface LeaderboardEntry {
    id: string;
    user_id: string;
    leaderboard_type: 'GLOBAL' | 'DOMAIN' | 'COURSE' | 'WEEKLY' | 'MONTHLY';
    domain_id?: string;
    score: number;
    rank?: number;
    period_start?: string;
    period_end?: string;
    created_at: string;
    updated_at: string;
}

export interface XPTransaction {
    id: string;
    user_id: string;
    amount: number;
    source_type: 'LESSON' | 'LAB' | 'PROJECT' | 'QUIZ' | 'ACHIEVEMENT' | 'STREAK' | 'REVIEW';
    source_id?: string;
    description?: string;
    created_at: string;
}

// ============================================
// 9. COMMUNITY TYPES
// ============================================
export interface ForumTopic {
    id: string;
    user_id: string;
    course_id?: string;
    domain_id?: string;
    title: string;
    content: string;
    tags?: string[];
    upvotes: number;
    downvotes: number;
    is_pinned: boolean;
    is_locked: boolean;
    view_count: number;
    created_at: string;
    updated_at: string;
}

export interface ForumPost {
    id: string;
    topic_id: string;
    user_id: string;
    parent_id?: string;
    content: string;
    upvotes: number;
    downvotes: number;
    is_solution: boolean;
    created_at: string;
    updated_at: string;
}

export interface StudyGroup {
    id: string;
    name: string;
    description?: string;
    domain_id?: string;
    college?: string;
    is_private: boolean;
    max_members: number;
    creator_id?: string;
    created_at: string;
    updated_at: string;
}

export interface GroupMember {
    id: string;
    group_id: string;
    user_id: string;
    role: 'ADMIN' | 'MODERATOR' | 'MEMBER';
    joined_at: string;
}

export interface CodeReview {
    id: string;
    requester_id: string;
    reviewer_id?: string;
    submission_type: 'LAB' | 'PROJECT' | 'CHALLENGE';
    submission_id: string;
    code: string;
    language?: string;
    status: 'PENDING' | 'IN_REVIEW' | 'COMPLETED' | 'CANCELLED';
    created_at: string;
    completed_at?: string;
}

export interface ReviewComment {
    id: string;
    review_id: string;
    user_id: string;
    line_number?: number;
    comment: string;
    comment_type?: 'SUGGESTION' | 'ISSUE' | 'PRAISE' | 'QUESTION';
    created_at: string;
}

// ============================================
// 10. NOTIFICATION TYPES
// ============================================
export interface Notification {
    id: string;
    user_id: string;
    type: 'ACHIEVEMENT' | 'BADGE' | 'STREAK' | 'FORUM_REPLY' | 'CODE_REVIEW' | 'CERTIFICATE' | 'COURSE_UPDATE';
    title: string;
    message?: string;
    action_url?: string;
    is_read: boolean;
    created_at: string;
}

// ============================================
// 11. AI & CHATBOT TYPES
// ============================================
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
    context?: ChatContext;
}

export interface ChatContext {
    lesson_id?: string;
    lab_id?: string;
    project_id?: string;
    course_id?: string;
    user_level?: string;
    current_progress?: number;
}

export interface CareerAssessment {
    interests: string[];
    skills: string[];
    goals: string[];
    learning_style?: 'VISUAL' | 'AUDITORY' | 'KINESTHETIC' | 'READING';
    time_commitment?: number;
    background?: string;
}

export interface DomainRecommendation {
    domain: Domain;
    fit_score: number;
    reasoning: string;
    next_steps: string[];
    career_paths: string[];
}

// ============================================
// 12. API RESPONSE TYPES
// ============================================
export interface APIResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
}

export interface DashboardStats {
    total_xp: number;
    current_level: number;
    streak_days: number;
    courses_enrolled: number;
    courses_completed: number;
    labs_completed: number;
    projects_completed: number;
    certificates_earned: number;
    forum_posts: number;
    achievements_unlocked: number;
    global_rank?: number;
    domain_rank?: number;
}

export interface LearningStats {
    time_spent_today: number;
    time_spent_week: number;
    lessons_completed_week: number;
    current_streak: number;
    longest_streak: number;
    favorite_domain?: string;
    most_active_time?: string;
}

// ============================================
// 13. FORM & INPUT TYPES
// ============================================
export interface CourseFilters {
    domain?: string;
    difficulty?: string[];
    duration_min?: number;
    duration_max?: number;
    is_free?: boolean;
    search?: string;
    sort_by?: 'popularity' | 'rating' | 'recent' | 'alphabetical';
}

export interface ProjectFilters {
    domain?: string;
    difficulty?: string[];
    tech_stack?: string[];
    search?: string;
}

export interface ForumFilters {
    domain?: string;
    course?: string;
    tags?: string[];
    search?: string;
    sort_by?: 'recent' | 'popular' | 'unanswered';
}

// ============================================
// 14. UTILITY TYPES
// ============================================
export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type LabDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type ProjectDifficulty = 'STARTER' | 'INTERMEDIATE' | 'CAPSTONE';
export type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
export type LeaderboardType = 'GLOBAL' | 'DOMAIN' | 'COURSE' | 'WEEKLY' | 'MONTHLY';
export type ReviewStatus = 'PENDING' | 'IN_REVIEW' | 'COMPLETED' | 'CANCELLED';
