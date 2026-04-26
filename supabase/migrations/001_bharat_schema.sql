-- PathPilot Bharat Database Schema
-- Run this in your Supabase SQL Editor to create all necessary tables

-- ============================================
-- 1. CIRCADIAN PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS circadian_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL UNIQUE,
    peak_hours INTEGER[] NOT NULL DEFAULT '{}',
    low_hours INTEGER[] NOT NULL DEFAULT '{}',
    optimal_windows JSONB NOT NULL DEFAULT '[]',
    sleep_pattern JSONB,
    cognitive_capacity INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster student lookups
CREATE INDEX IF NOT EXISTS idx_circadian_student ON circadian_profiles(student_id);

-- ============================================
-- 2. PERFORMANCE DATA TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS performance_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    subject TEXT NOT NULL,
    concept TEXT,
    performance_score DECIMAL(5,2) NOT NULL CHECK (performance_score >= 0 AND performance_score <= 100),
    energy_level_reported TEXT CHECK (energy_level_reported IN ('HIGH', 'MEDIUM', 'LOW')),
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    completion_rate DECIMAL(5,2) CHECK (completion_rate >= 0 AND completion_rate <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance queries
CREATE INDEX IF NOT EXISTS idx_performance_student ON performance_data(student_id);
CREATE INDEX IF NOT EXISTS idx_performance_timestamp ON performance_data(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_performance_subject ON performance_data(subject);

-- ============================================
-- 3. BURNOUT METRICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS burnout_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    study_duration_daily INTEGER NOT NULL DEFAULT 0,
    study_duration_weekly INTEGER NOT NULL DEFAULT 0,
    break_frequency INTEGER DEFAULT 0,
    sleep_quality DECIMAL(3,2) CHECK (sleep_quality >= 0 AND sleep_quality <= 1),
    sleep_duration_hours DECIMAL(4,2),
    performance_trend TEXT CHECK (performance_trend IN ('IMPROVING', 'STABLE', 'DECLINING')),
    stress_level INTEGER CHECK (stress_level >= 0 AND stress_level <= 10),
    social_interactions INTEGER DEFAULT 0,
    physical_activity_minutes INTEGER DEFAULT 0,
    screen_time_hours DECIMAL(4,2),
    missed_deadlines INTEGER DEFAULT 0,
    metrics_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for burnout analysis
CREATE INDEX IF NOT EXISTS idx_burnout_student ON burnout_metrics(student_id);
CREATE INDEX IF NOT EXISTS idx_burnout_timestamp ON burnout_metrics(timestamp DESC);

-- ============================================
-- 4. BURNOUT PREDICTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS burnout_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    indicators TEXT[] NOT NULL DEFAULT '{}',
    predicted_breakdown_date TIMESTAMP WITH TIME ZONE,
    interventions_recommended JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for prediction queries
CREATE INDEX IF NOT EXISTS idx_prediction_student ON burnout_predictions(student_id);
CREATE INDEX IF NOT EXISTS idx_prediction_timestamp ON burnout_predictions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_prediction_risk ON burnout_predictions(risk_level);

-- ============================================
-- 5. CAREER SCENARIOS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS career_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_id TEXT NOT NULL,
    scenario JSONB NOT NULL,
    difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for career lookups
CREATE INDEX IF NOT EXISTS idx_scenario_career ON career_scenarios(career_id);

-- ============================================
-- 6. STUDENT SKILLS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS student_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    skill_name TEXT NOT NULL,
    category TEXT NOT NULL,
    level INTEGER NOT NULL CHECK (level >= 0 AND level <= 100),
    verified BOOLEAN DEFAULT FALSE,
    last_assessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, skill_name)
);

-- Indexes for skill queries
CREATE INDEX IF NOT EXISTS idx_skills_student ON student_skills(student_id);
CREATE INDEX IF NOT EXISTS idx_skills_category ON student_skills(category);

-- ============================================
-- 7. KNOWLEDGE GRAPHS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS knowledge_graphs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    source TEXT NOT NULL CHECK (source IN ('PDF', 'IMAGE', 'URL', 'MANUAL')),
    graph_data JSONB NOT NULL,
    quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for knowledge graph queries
CREATE INDEX IF NOT EXISTS idx_kg_student ON knowledge_graphs(student_id);
CREATE INDEX IF NOT EXISTS idx_kg_source ON knowledge_graphs(source);

-- ============================================
-- 8. SCHEDULES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    schedule_data JSONB NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    adaptation_score DECIMAL(3,2) CHECK (adaptation_score >= 0 AND adaptation_score <= 1),
    adherence_rate DECIMAL(3,2) CHECK (adherence_rate >= 0 AND adherence_rate <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for schedule queries
CREATE INDEX IF NOT EXISTS idx_schedule_student ON schedules(student_id);
CREATE INDEX IF NOT EXISTS idx_schedule_dates ON schedules(start_date, end_date);

-- ============================================
-- 9. MASTERY PROOFS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS mastery_proofs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    skill TEXT NOT NULL,
    level INTEGER NOT NULL CHECK (level >= 0 AND level <= 100),
    verification_hash TEXT NOT NULL UNIQUE,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    verification_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for proof queries
CREATE INDEX IF NOT EXISTS idx_proof_student ON mastery_proofs(student_id);
CREATE INDEX IF NOT EXISTS idx_proof_hash ON mastery_proofs(verification_hash);

-- ============================================
-- 10. INTERVENTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS interventions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    intervention_type TEXT NOT NULL CHECK (intervention_type IN ('REST', 'SOCIAL', 'PHYSICAL', 'MENTAL', 'ACADEMIC')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'COMPLETED', 'SKIPPED')),
    effectiveness_score DECIMAL(3,2) CHECK (effectiveness_score >= 0 AND effectiveness_score <= 1),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for intervention queries
CREATE INDEX IF NOT EXISTS idx_intervention_student ON interventions(student_id);
CREATE INDEX IF NOT EXISTS idx_intervention_status ON interventions(status);
CREATE INDEX IF NOT EXISTS idx_intervention_priority ON interventions(priority);

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE circadian_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE burnout_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE burnout_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_graphs ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE mastery_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES (Students can only access their own data)
-- ============================================

-- Circadian Profiles
CREATE POLICY "Students can view own circadian profile" ON circadian_profiles
    FOR SELECT USING (student_id = auth.uid()::text);
CREATE POLICY "Students can insert own circadian profile" ON circadian_profiles
    FOR INSERT WITH CHECK (student_id = auth.uid()::text);
CREATE POLICY "Students can update own circadian profile" ON circadian_profiles
    FOR UPDATE USING (student_id = auth.uid()::text);

-- Performance Data
CREATE POLICY "Students can view own performance data" ON performance_data
    FOR SELECT USING (student_id = auth.uid()::text);
CREATE POLICY "Students can insert own performance data" ON performance_data
    FOR INSERT WITH CHECK (student_id = auth.uid()::text);

-- Burnout Metrics
CREATE POLICY "Students can view own burnout metrics" ON burnout_metrics
    FOR SELECT USING (student_id = auth.uid()::text);
CREATE POLICY "Students can insert own burnout metrics" ON burnout_metrics
    FOR INSERT WITH CHECK (student_id = auth.uid()::text);

-- Burnout Predictions
CREATE POLICY "Students can view own burnout predictions" ON burnout_predictions
    FOR SELECT USING (student_id = auth.uid()::text);
CREATE POLICY "Students can insert own burnout predictions" ON burnout_predictions
    FOR INSERT WITH CHECK (student_id = auth.uid()::text);

-- Career Scenarios (Public read, admin write)
CREATE POLICY "Anyone can view career scenarios" ON career_scenarios
    FOR SELECT USING (true);

-- Student Skills
CREATE POLICY "Students can view own skills" ON student_skills
    FOR SELECT USING (student_id = auth.uid()::text);
CREATE POLICY "Students can insert own skills" ON student_skills
    FOR INSERT WITH CHECK (student_id = auth.uid()::text);
CREATE POLICY "Students can update own skills" ON student_skills
    FOR UPDATE USING (student_id = auth.uid()::text);

-- Knowledge Graphs
CREATE POLICY "Students can view own knowledge graphs" ON knowledge_graphs
    FOR SELECT USING (student_id = auth.uid()::text);
CREATE POLICY "Students can insert own knowledge graphs" ON knowledge_graphs
    FOR INSERT WITH CHECK (student_id = auth.uid()::text);

-- Schedules
CREATE POLICY "Students can view own schedules" ON schedules
    FOR SELECT USING (student_id = auth.uid()::text);
CREATE POLICY "Students can insert own schedules" ON schedules
    FOR INSERT WITH CHECK (student_id = auth.uid()::text);
CREATE POLICY "Students can update own schedules" ON schedules
    FOR UPDATE USING (student_id = auth.uid()::text);

-- Mastery Proofs
CREATE POLICY "Students can view own mastery proofs" ON mastery_proofs
    FOR SELECT USING (student_id = auth.uid()::text);
CREATE POLICY "Anyone can verify proofs by hash" ON mastery_proofs
    FOR SELECT USING (true);

-- Interventions
CREATE POLICY "Students can view own interventions" ON interventions
    FOR SELECT USING (student_id = auth.uid()::text);
CREATE POLICY "Students can insert own interventions" ON interventions
    FOR INSERT WITH CHECK (student_id = auth.uid()::text);
CREATE POLICY "Students can update own interventions" ON interventions
    FOR UPDATE USING (student_id = auth.uid()::text);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_circadian_profiles_updated_at BEFORE UPDATE ON circadian_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_scenarios_updated_at BEFORE UPDATE ON career_scenarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_skills_updated_at BEFORE UPDATE ON student_skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_graphs_updated_at BEFORE UPDATE ON knowledge_graphs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interventions_updated_at BEFORE UPDATE ON interventions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample career scenarios
INSERT INTO career_scenarios (career_id, scenario, difficulty) VALUES
('data-scientist', '{"title": "Data Analysis Challenge", "description": "Analyze customer churn data"}', 3),
('software-engineer', '{"title": "Bug Fix Sprint", "description": "Debug production issue"}', 2)
ON CONFLICT DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'PathPilot Bharat database schema created successfully!';
    RAISE NOTICE 'Tables created: 10';
    RAISE NOTICE 'RLS policies: Enabled';
    RAISE NOTICE 'Next step: Verify tables in Supabase Table Editor';
END $$;
