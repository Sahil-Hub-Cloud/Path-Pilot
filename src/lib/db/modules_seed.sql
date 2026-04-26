-- 1. Create Modules Table
create table if not exists modules (
  id bigint primary key, -- Keeping integer ID to match code for now
  title text not null,
  description text not null,
  difficulty text check (difficulty in ('Easy', 'Medium', 'Hard', 'Expert')),
  type text check (type in ('INFRASTRUCTURE', 'DEFENSE', 'OFFENSE', 'THEORETICAL')),
  estimated_hours integer default 10,
  risk_level text check (risk_level in ('low', 'medium', 'high')),
  energy_cost integer default 20,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Create Units Table
create table if not exists units (
  id bigint primary key,
  module_id bigint references modules(id),
  title text not null,
  estimated_time text,
  order_index integer
);

-- 3. Seed Data (Migrated from mock-data.ts)
insert into modules (id, title, description, difficulty, type, estimated_hours, risk_level, energy_cost) values
(1, 'Docker Containerization', 'Master container isolation, volume management, and network hardening.', 'Easy', 'INFRASTRUCTURE', 40, 'medium', 20),
(2, 'Social Engineering & Phishing', 'Offensive security: Payload delivery, credential harvesting, and awareness.', 'Medium', 'DEFENSE', 60, 'high', 45),
(3, 'Network Traffic Analysis', 'Deep packet inspection with Wireshark and injection attacks.', 'Hard', 'OFFENSE', 80, 'high', 65),
(4, 'Advanced Penetration Testing', 'Metasploit frameworks and zero-day exploitation strategies.', 'Hard', 'OFFENSE', 100, 'high', 80),
(5, 'DevSecOps & CI/CD Security', 'Secure pipeline architecture and automated vulnerability scanning.', 'Medium', 'INFRASTRUCTURE', 120, 'medium', 40),
(6, 'Quantum Cryptography', 'Post-quantum algorithms and key exchange protocols.', 'Expert', 'THEORETICAL', 150, 'low', 90),
(7, 'Neural Network Hardening', 'Adversarial attacks on AI models and model extraction defense.', 'Medium', 'DEFENSE', 90, 'medium', 70),
(8, 'Cloud Native Forensics', 'Incident response in serverless and K8s environments.', 'Hard', 'INFRASTRUCTURE', 110, 'high', 55),
(9, 'Social Engineering: Vishing', 'AI-voice cloning and real-time deepfake audio forensics.', 'Medium', 'DEFENSE', 50, 'high', 30),
(10, 'Zero Trust Architecture', 'BeyondCorp models and identity-aware proxy implementation.', 'Expert', 'INFRASTRUCTURE', 140, 'medium', 60);

-- 4. Seed Units (Sample for Module 1 & 2)
insert into units (id, module_id, title, estimated_time, order_index) values
(101, 1, 'Container Isolation', '2 hours', 1),
(102, 1, 'Volume Persistence', '4 hours', 2),
(103, 1, 'Network Hardening', '5 hours', 3),
(201, 2, 'Payload Delivery', '4 hours', 1),
(202, 2, 'Credential Harvesting', '6 hours', 2),
(203, 2, 'Psychological Triggers', '3 hours', 3);

-- 5. Enable RLS and Add Policies
alter table modules enable row level security;
alter table units enable row level security;

create policy "Allow public read access for modules" on modules for select using (true);
create policy "Allow public read access for units" on units for select using (true);
