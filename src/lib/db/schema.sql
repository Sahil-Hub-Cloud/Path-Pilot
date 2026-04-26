-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Knowledge Graphs Table (Neural Ingestion)
create table if not exists knowledge_graphs (
  id text primary key,
  student_id text not null,
  source text check (source in ('PDF', 'IMAGE', 'URL', 'DOCX', 'PPTX')),
  data jsonb not null, -- Stores the full graph structure
  metadata jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Performance Data Table (Bio-Logic & Burnout)
create table if not exists performance_data (
  id uuid default uuid_generate_v4() primary key,
  student_id text not null,
  subject text not null,
  score number,
  time_spent_seconds integer,
  completed_at timestamp with time zone default timezone('utc'::text, now()),
  energy_level text check (energy_level in ('HIGH', 'MEDIUM', 'LOW')),
  stress_level integer check (stress_level between 0 and 100)
);

-- 3. Schedules Table (Bio-Logic Scheduler)
create table if not exists schedules (
  id text primary key,
  student_id text not null,
  date date not null,
  time_blocks jsonb not null,
  adaptation_score float,
  adherence_rate float,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Burnout Predictions Table (Burnout Engine)
create table if not exists burnout_predictions (
  id uuid default uuid_generate_v4() primary key,
  student_id text not null,
  prediction jsonb not null, -- Stores risk level, indicators, etc.
  predicted_at timestamp with time zone not null
);

-- 5. Lab State Persistence (New Feature)
create table if not exists lab_state (
  student_id text primary key,
  code_content text, -- Saving Coding Lab content
  terminal_history jsonb, -- Saving Terminal command history
  file_system_state jsonb, -- Saving modified file system
  last_updated timestamp with time zone default timezone('utc'::text, now())
);

-- Create indexes for performance
create index if not exists idx_perf_student on performance_data(student_id);
create index if not exists idx_perf_created on performance_data(completed_at);

-- ============================================================
-- 6. Profiles Table (User Identity)
-- ============================================================
create table if not exists profiles (
  id uuid default uuid_generate_v4() primary key,
  email text,
  full_name text,
  college_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Submissions Table (Code Run Tracking)
create table if not exists submissions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id),
  code_content text,
  language text,
  hints_used integer default 0,
  is_successful boolean,
  error_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_submissions_user on submissions(user_id);
create index if not exists idx_submissions_created on submissions(created_at);

