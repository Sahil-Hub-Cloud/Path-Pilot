-- Final Schema for Path Pilot Strict Reconstruction

-- 1. Student Skills / Profile Verification
CREATE TABLE IF NOT EXISTS public.student_skills (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    ai_score INTEGER DEFAULT 0,
    completion_speed TEXT, -- 'Fast', 'Moderate', 'Slow'
    github_username TEXT,
    is_visible_to_companies BOOLEAN DEFAULT true,
    course_completed BOOLEAN DEFAULT false,
    certificate_hash TEXT UNIQUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Companies Table
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    industry TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Hiring Emails / Link Node Protocol
CREATE TABLE IF NOT EXISTS public.hiring_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id),
    student_id UUID REFERENCES auth.users(id),
    email_subject TEXT NOT NULL,
    email_body TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT DEFAULT 'sent' -- 'sent', 'opened', 'replied'
);

-- Enable RLS
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hiring_emails ENABLE ROW LEVEL SECURITY;

-- Basic Policies
CREATE POLICY "Students can view their own skills" ON public.student_skills FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Companies can view visible student skills" ON public.student_skills FOR SELECT USING (is_visible_to_companies = true);
CREATE POLICY "Companies can manage their own profiles" ON public.companies FOR ALL USING (auth.uid() = id);
CREATE POLICY "Companies can view their sent emails" ON public.hiring_emails FOR SELECT USING (company_id = auth.uid());
