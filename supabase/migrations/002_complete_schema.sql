-- PathPilot Complete Platform Database Schema
-- Expansion for all 12 modules
-- Run this AFTER 001_bharat_schema.sql

-- ============================================
-- 1. USERS & PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    college TEXT,
    graduation_year INTEGER,
    current_domain TEXT,
    learning_level TEXT CHECK (learning_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT')),
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    streak_days INTEGER DEFAULT 0,
    last_activity_date DATE,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_domain ON users(current_domain);

-- ============================================
-- 2. DOMAINS & ROADMAPS
-- ============================================
CREATE TABLE IF NOT EXISTS domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    estimated_hours INTEGER,
    job_market_demand INTEGER CHECK (job_market_demand >= 0 AND job_market_demand <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id UUID REFERENCES domains(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    graph_data JSONB NOT NULL, -- D3.js tree structure
    estimated_completion_hours INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roadmap_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_id UUID REFERENCES roadmaps(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    level TEXT NOT NULL CHECK (level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT')),
    position INTEGER NOT NULL,
    prerequisites UUID[], -- Array of milestone IDs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. COURSES & CONTENT
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id UUID REFERENCES domains(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    estimated_hours INTEGER,
    instructor_name TEXT,
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    enrollment_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_domain ON courses(domain_id);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);

CREATE TABLE IF NOT EXISTS course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('VIDEO', 'TEXT', 'CODE', 'MIXED')),
    video_url TEXT,
    video_duration INTEGER, -- seconds
    text_content TEXT,
    code_snippets JSONB, -- { language, code, explanation }[]
    position INTEGER NOT NULL,
    is_free BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);

-- ============================================
-- 4. ENROLLMENTS & PROGRESS
-- ============================================
CREATE TABLE IF NOT EXISTS course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user ON course_enrollments(user_id);

CREATE TABLE IF NOT EXISTS lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    last_position INTEGER DEFAULT 0, -- for video resume
    time_spent INTEGER DEFAULT 0, -- seconds
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);

-- ============================================
-- 5. LABS
-- ============================================
CREATE TABLE IF NOT EXISTS labs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    programming_language TEXT NOT NULL,
    environment_config JSONB, -- Docker/sandbox config
    starter_code TEXT,
    instructions TEXT NOT NULL,
    hints TEXT[],
    test_cases JSONB NOT NULL, -- { input, expected_output, hidden }[]
    solution_code TEXT,
    estimated_minutes INTEGER,
    xp_reward INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_labs_course ON labs(course_id);

CREATE TABLE IF NOT EXISTS lab_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    lab_id UUID REFERENCES labs(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    language TEXT NOT NULL,
    test_results JSONB, -- { test_id, passed, output, error }[]
    is_passed BOOLEAN DEFAULT FALSE,
    execution_time INTEGER, -- milliseconds
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lab_id)
);

CREATE INDEX IF NOT EXISTS idx_lab_submissions_user ON lab_submissions(user_id);

-- ============================================
-- 6. PROJECTS
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id UUID REFERENCES domains(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('STARTER', 'INTERMEDIATE', 'CAPSTONE')),
    requirements TEXT NOT NULL,
    tech_stack TEXT[],
    starter_template_url TEXT,
    demo_url TEXT,
    estimated_hours INTEGER,
    xp_reward INTEGER DEFAULT 200,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_domain ON projects(domain_id);

CREATE TABLE IF NOT EXISTS project_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    repository_url TEXT,
    live_url TEXT,
    description TEXT,
    code_files JSONB, -- For inline code storage
    ai_review_score INTEGER CHECK (ai_review_score >= 0 AND ai_review_score <= 100),
    ai_review_feedback JSONB,
    is_featured BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, project_id)
);

CREATE INDEX IF NOT EXISTS idx_project_submissions_user ON project_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_project_submissions_featured ON project_submissions(is_featured);

-- ============================================
-- 7. ASSESSMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    time_limit INTEGER, -- minutes, NULL = no limit
    passing_score INTEGER DEFAULT 70,
    xp_reward INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('MCQ', 'MULTIPLE_SELECT', 'TRUE_FALSE', 'CODE')),
    options JSONB, -- { text, is_correct }[]
    correct_answer TEXT,
    explanation TEXT,
    position INTEGER NOT NULL,
    points INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    answers JSONB NOT NULL, -- { question_id, answer }[]
    score INTEGER NOT NULL,
    percentage DECIMAL(5,2),
    is_passed BOOLEAN DEFAULT FALSE,
    time_taken INTEGER, -- seconds
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);

-- Coding Challenges (LeetCode-style)
CREATE TABLE IF NOT EXISTS coding_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    category TEXT[],
    input_format TEXT,
    output_format TEXT,
    constraints TEXT,
    test_cases JSONB NOT NULL,
    solution_code JSONB, -- { language, code }[]
    hints TEXT[],
    xp_reward INTEGER DEFAULT 100,
    acceptance_rate DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS challenge_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES coding_challenges(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    language TEXT NOT NULL,
    test_results JSONB,
    is_accepted BOOLEAN DEFAULT FALSE,
    runtime INTEGER, -- milliseconds
    memory_used INTEGER, -- KB
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_challenge_submissions_user ON challenge_submissions(user_id);

-- Mock Interviews
CREATE TABLE IF NOT EXISTS mock_interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    interview_type TEXT NOT NULL CHECK (interview_type IN ('BEHAVIORAL', 'TECHNICAL', 'MIXED')),
    domain TEXT,
    questions JSONB NOT NULL, -- AI-generated questions
    answers JSONB, -- User's responses
    ai_feedback JSONB,
    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    duration INTEGER, -- seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 8. CERTIFICATES
-- ============================================
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    certificate_type TEXT NOT NULL CHECK (certificate_type IN ('COURSE', 'PROJECT', 'DOMAIN', 'ACHIEVEMENT')),
    title TEXT NOT NULL,
    description TEXT,
    verification_id TEXT UNIQUE NOT NULL,
    qr_code_url TEXT,
    pdf_url TEXT,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE, -- NULL = no expiration
    is_featured BOOLEAN DEFAULT FALSE,
    metadata JSONB -- Additional certificate data
);

CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_verification ON certificates(verification_id);

-- ============================================
-- 9. GAMIFICATION
-- ============================================
-- Achievements (unlockable milestones)
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    category TEXT NOT NULL,
    unlock_condition JSONB NOT NULL, -- { type, target, value }
    xp_reward INTEGER DEFAULT 50,
    rarity TEXT CHECK (rarity IN ('COMMON', 'RARE', 'EPIC', 'LEGENDARY')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);

-- Badges (visual collectibles)
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    category TEXT,
    unlock_criteria JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Leaderboards
CREATE TABLE IF NOT EXISTS leaderboard_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    leaderboard_type TEXT NOT NULL CHECK (leaderboard_type IN ('GLOBAL', 'DOMAIN', 'COURSE', 'WEEKLY', 'MONTHLY')),
    domain_id UUID REFERENCES domains(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    rank INTEGER,
    period_start DATE,
    period_end DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_user ON leaderboard_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_type ON leaderboard_entries(leaderboard_type);

-- XP Transactions (audit log)
CREATE TABLE IF NOT EXISTS xp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    source_type TEXT NOT NULL CHECK (source_type IN ('LESSON', 'LAB', 'PROJECT', 'QUIZ', 'ACHIEVEMENT', 'STREAK', 'REVIEW')),
    source_id UUID,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_xp_transactions_user ON xp_transactions(user_id);

-- ============================================
-- 10. COMMUNITY
-- ============================================
-- Forums
CREATE TABLE IF NOT EXISTS forum_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    domain_id UUID REFERENCES domains(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[],
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_forum_topics_user ON forum_topics(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_course ON forum_topics(course_id);

CREATE TABLE IF NOT EXISTS forum_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES forum_topics(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE, -- For threading
    content TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    is_solution BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_forum_posts_topic ON forum_posts(topic_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_user ON forum_posts(user_id);

-- Study Groups
CREATE TABLE IF NOT EXISTS study_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    domain_id UUID REFERENCES domains(id) ON DELETE SET NULL,
    college TEXT,
    is_private BOOLEAN DEFAULT FALSE,
    max_members INTEGER DEFAULT 50,
    creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'MEMBER' CHECK (role IN ('ADMIN', 'MODERATOR', 'MEMBER')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members(user_id);

-- Peer Code Reviews
CREATE TABLE IF NOT EXISTS code_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    submission_type TEXT NOT NULL CHECK (submission_type IN ('LAB', 'PROJECT', 'CHALLENGE')),
    submission_id UUID NOT NULL,
    code TEXT NOT NULL,
    language TEXT,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_REVIEW', 'COMPLETED', 'CANCELLED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_code_reviews_requester ON code_reviews(requester_id);
CREATE INDEX IF NOT EXISTS idx_code_reviews_reviewer ON code_reviews(reviewer_id);

CREATE TABLE IF NOT EXISTS review_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID REFERENCES code_reviews(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    line_number INTEGER,
    comment TEXT NOT NULL,
    comment_type TEXT CHECK (comment_type IN ('SUGGESTION', 'ISSUE', 'PRAISE', 'QUESTION')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 11. NOTIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('ACHIEVEMENT', 'BADGE', 'STREAK', 'FORUM_REPLY', 'CODE_REVIEW', 'CERTIFICATE', 'COURSE_UPDATE')),
    title TEXT NOT NULL,
    message TEXT,
    action_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Users: Can view own profile, update own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (id = auth.uid());

-- Courses: Public read, enrolled users can see full content
CREATE POLICY "Anyone can view published courses" ON courses
    FOR SELECT USING (is_published = true);

-- Enrollments: Users can view/create own enrollments
CREATE POLICY "Users can view own enrollments" ON course_enrollments
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can enroll in courses" ON course_enrollments
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Progress: Users own their progress
CREATE POLICY "Users can manage own lesson progress" ON lesson_progress
    FOR ALL USING (user_id = auth.uid());

-- Submissions: Users own their submissions
CREATE POLICY "Users can manage own lab submissions" ON lab_submissions
    FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own project submissions" ON project_submissions
    FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own quiz attempts" ON quiz_attempts
    FOR ALL USING (user_id = auth.uid());

-- Certificates: Users can view own, anyone can verify
CREATE POLICY "Users can view own certificates" ON certificates
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Anyone can verify certificates" ON certificates
    FOR SELECT USING (true);

-- Gamification: Users own their data
CREATE POLICY "Users can view own achievements" ON user_achievements
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can view own badges" ON user_badges
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Anyone can view leaderboards" ON leaderboard_entries
    FOR SELECT USING (true);

-- Forums: Public read, authenticated write
CREATE POLICY "Anyone can view forum topics" ON forum_topics
    FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create topics" ON forum_topics
    FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can edit own topics" ON forum_topics
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Anyone can view forum posts" ON forum_posts
    FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON forum_posts
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Notifications: Users see only their notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR ALL USING (user_id = auth.uid());

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at on table changes
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Insert sample domains
INSERT INTO domains (name, slug, description, icon, color, difficulty_level, estimated_hours, job_market_demand) VALUES
('Web Development', 'web-dev', 'Build modern web applications', '🌐', '#3B82F6', 2, 300, 95),
('Data Science', 'data-science', 'Analyze data and build ML models', '📊', '#10B981', 3, 400, 92),
('Mobile Development', 'mobile-dev', 'Create iOS and Android apps', '📱', '#8B5CF6', 3, 350, 88),
('DevOps', 'devops', 'Infrastructure and deployment', '⚙️', '#F59E0B', 4, 250, 90),
('AI/ML', 'ai-ml', 'Artificial Intelligence and Machine Learning', '🤖', '#EF4444', 4, 500, 98),
('Cybersecurity', 'cybersecurity', 'Secure systems and ethical hacking', '🔒', '#EC4899', 4, 350, 94),
('Game Development', 'game-dev', 'Build games and interactive experiences', '🎮', '#06B6D4', 3, 400, 75),
('Blockchain', 'blockchain', 'Decentralized applications and Web3', '⛓️', '#F97316', 4, 300, 85)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample achievements
INSERT INTO achievements (title, description, icon, category, unlock_condition, xp_reward, rarity) VALUES
('First Steps', 'Complete your first lesson', '👣', 'LEARNING', '{"type": "lesson_count", "value": 1}', 50, 'COMMON'),
('Code Warrior', 'Complete 10 labs', '⚔️', 'LABS', '{"type": "lab_count", "value": 10}', 200, 'RARE'),
('Streak Master', 'Maintain a 7-day streak', '🔥', 'ENGAGEMENT', '{"type": "streak_days", "value": 7}', 100, 'RARE'),
('Project Pioneer', 'Submit your first project', '🚀', 'PROJECTS', '{"type": "project_count", "value": 1}', 150, 'COMMON'),
('Quiz Champion', 'Score 100% on any quiz', '🏆', 'ASSESSMENTS', '{"type": "perfect_quiz", "value": 1}', 100, 'EPIC'),
('Social Butterfly', 'Help 5 peers in forums', '🦋', 'COMMUNITY', '{"type": "forum_replies", "value": 5}', 75, 'COMMON'),
('Domain Master', 'Complete all courses in a domain', '👑', 'LEARNING', '{"type": "domain_completion", "value": 1}', 500, 'LEGENDARY')
ON CONFLICT DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'PathPilot Complete Platform schema created successfully!';
    RAISE NOTICE 'New tables: 30+';
    RAISE NOTICE 'Modules: 12 (Onboarding, Roadmaps, Courses, Labs, Projects, Assessments, Certificates, Gamification, Community, Dashboard, Profile)';
END $$;
