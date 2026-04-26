-- ============================================================
-- PathPilot Skill Vector Schema
-- The "IP" — per-student, per-dimension skill scoring
-- ============================================================

CREATE TABLE IF NOT EXISTS user_skill_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  
  -- Syntax competency (per language)
  python_syntax_score FLOAT DEFAULT 0.0,
  javascript_syntax_score FLOAT DEFAULT 0.0,
  
  -- Core skill dimensions
  logic_reasoning_score FLOAT DEFAULT 0.0,
  debugging_score FLOAT DEFAULT 0.0,
  prompt_quality_score FLOAT DEFAULT 0.0,
  
  -- Activity tracking (feeds the scoring formulas)
  total_runs INTEGER DEFAULT 0,
  successful_runs INTEGER DEFAULT 0,
  total_errors INTEGER DEFAULT 0,
  hints_used INTEGER DEFAULT 0,
  challenges_completed INTEGER DEFAULT 0,
  debug_challenges_solved INTEGER DEFAULT 0,
  
  -- Metadata
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fast lookup by user
CREATE INDEX IF NOT EXISTS idx_skill_metrics_user ON user_skill_metrics(user_id);

-- Enable Row Level Security
ALTER TABLE user_skill_metrics ENABLE ROW LEVEL SECURITY;

-- Users can read/write their own data
CREATE POLICY "Users can view own metrics"
  ON user_skill_metrics FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own metrics"
  ON user_skill_metrics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own metrics"
  ON user_skill_metrics FOR UPDATE
  USING (true);
