-- ============================================================
-- PATH PILOT B2B COLLEGES AND PROFILES SCHEMA
-- Migration 008
-- ============================================================

-- 1. COLLEGES TABLE
CREATE TABLE IF NOT EXISTS colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_name TEXT NOT NULL,
    location TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    student_count INTEGER NOT NULL,
    college_code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on college_code
CREATE INDEX IF NOT EXISTS idx_colleges_code ON colleges(college_code);

-- 2. PROFILES TABLE
-- Maps Firebase UID to student profiles, linking them to colleges
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY, -- Firebase UID
    email TEXT,
    full_name TEXT,
    college_code TEXT REFERENCES colleges(college_code) ON DELETE SET NULL,
    college_name TEXT,
    year_of_study INTEGER CHECK (year_of_study BETWEEN 1 AND 4),
    profile_image_url TEXT,
    show_profile_to_admins BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_college_code ON profiles(college_code);

-- Enable RLS
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create Policies for colleges
CREATE POLICY "Service role full access on colleges" ON colleges FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable read access to colleges for all users" ON colleges FOR SELECT USING (true);

-- Create Policies for profiles
CREATE POLICY "Service role full access on profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable read access to profiles for all users" ON profiles FOR SELECT USING (true);
CREATE POLICY "Enable insert/update for own profile" ON profiles 
    FOR ALL 
    USING (true)
    WITH CHECK (true);
