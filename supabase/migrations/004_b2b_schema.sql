-- ============================================================
-- PATH PILOT B2B SCHEMA — Institutions, Cohorts, Content, Seats
-- Migration 004
-- ============================================================

-- 1. INSTITUTIONS TABLE
-- Stores the college/company customer
CREATE TABLE IF NOT EXISTS institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain TEXT,                          -- e.g. "iitb.ac.in" for domain-based join
    logo_url TEXT,
    plan_tier TEXT DEFAULT 'starter' CHECK (plan_tier IN ('starter', 'professional', 'enterprise')),
    max_seats INTEGER DEFAULT 50,
    is_active BOOLEAN DEFAULT true,
    created_by UUID NOT NULL,            -- Firebase UID of the admin who created it
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER ROLES TABLE (RBAC)
-- Links Firebase UIDs to roles and institutions
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,               -- Firebase UID
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'hod', 'admin')),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    invited_email TEXT,                  -- For pre-registration identity bridging
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)                      -- One role per user
);

CREATE INDEX IF NOT EXISTS idx_user_roles_invited_email ON user_roles(invited_email);

-- 3. COHORTS TABLE
-- Class/batch groupings within an institution
CREATE TABLE IF NOT EXISTS cohorts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,                  -- e.g. "CSE 2024 Batch A"
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    course_id TEXT,                       -- Maps to ROADMAPS key (e.g. 'frontend_react')
    description TEXT,
    invite_code TEXT UNIQUE,             -- Magic link code for student self-join
    is_active BOOLEAN DEFAULT true,
    created_by TEXT NOT NULL,            -- Firebase UID of creator
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. COHORT MEMBERS TABLE
-- Bridge between students and cohorts
CREATE TABLE IF NOT EXISTS cohort_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cohort_id UUID NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,               -- Firebase UID
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cohort_id, user_id)           -- No duplicate memberships
);

-- 5. INSTITUTION CONTENT TABLE
-- Uploaded syllabus, videos, PDFs by institution faculty
CREATE TABLE IF NOT EXISTS institution_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    cohort_id UUID REFERENCES cohorts(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    content_type TEXT NOT NULL CHECK (content_type IN ('pdf', 'video', 'text', 'link', 'syllabus')),
    file_url TEXT,                        -- Supabase Storage URL
    file_size_bytes BIGINT,
    metadata JSONB DEFAULT '{}',
    uploaded_by TEXT NOT NULL,            -- Firebase UID
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SEATS TABLE
-- License/seat tracking per institution
CREATE TABLE IF NOT EXISTS seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE UNIQUE,
    total_seats INTEGER NOT NULL DEFAULT 50,
    used_seats INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_institution ON user_roles(institution_id);
CREATE INDEX IF NOT EXISTS idx_cohorts_institution ON cohorts(institution_id);
CREATE INDEX IF NOT EXISTS idx_cohorts_invite_code ON cohorts(invite_code);
CREATE INDEX IF NOT EXISTS idx_cohort_members_cohort ON cohort_members(cohort_id);
CREATE INDEX IF NOT EXISTS idx_cohort_members_user ON cohort_members(user_id);
CREATE INDEX IF NOT EXISTS idx_content_institution ON institution_content(institution_id);
CREATE INDEX IF NOT EXISTS idx_content_cohort ON institution_content(cohort_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohort_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE institution_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (for API routes)
CREATE POLICY "Service role full access" ON institutions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON user_roles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON cohorts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON cohort_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON institution_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON seats FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Function to generate a unique 8-char invite code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        code := upper(substr(md5(random()::text), 1, 8));
        SELECT EXISTS(SELECT 1 FROM cohorts WHERE invite_code = code) INTO exists_check;
        EXIT WHEN NOT exists_check;
    END LOOP;
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Auto-generate invite code on cohort insert
CREATE OR REPLACE FUNCTION set_invite_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invite_code IS NULL THEN
        NEW.invite_code := generate_invite_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_invite_code
    BEFORE INSERT ON cohorts
    FOR EACH ROW
    EXECUTE FUNCTION set_invite_code();

-- Auto-update seat count when cohort_members changes
CREATE OR REPLACE FUNCTION update_seat_count()
RETURNS TRIGGER AS $$
DECLARE
    inst_id UUID;
    seat_count INTEGER;
BEGIN
    -- Get institution from cohort
    IF TG_OP = 'DELETE' THEN
        SELECT institution_id INTO inst_id FROM cohorts WHERE id = OLD.cohort_id;
    ELSE
        SELECT institution_id INTO inst_id FROM cohorts WHERE id = NEW.cohort_id;
    END IF;

    -- Count unique students across all cohorts in this institution
    SELECT COUNT(DISTINCT cm.user_id) INTO seat_count
    FROM cohort_members cm
    JOIN cohorts c ON cm.cohort_id = c.id
    WHERE c.institution_id = inst_id;

    -- Upsert seat count
    INSERT INTO seats (institution_id, total_seats, used_seats, updated_at)
    VALUES (inst_id, 50, seat_count, NOW())
    ON CONFLICT (institution_id)
    DO UPDATE SET used_seats = seat_count, updated_at = NOW();

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_seats_insert
    AFTER INSERT ON cohort_members
    FOR EACH ROW
    EXECUTE FUNCTION update_seat_count();

CREATE TRIGGER trigger_update_seats_delete
    AFTER DELETE ON cohort_members
    FOR EACH ROW
    EXECUTE FUNCTION update_seat_count();

-- ============================================================
-- Supabase Storage bucket for institution content
-- (Run this via Supabase dashboard or CLI)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('institution-content', 'institution-content', false);
-- ============================================================
