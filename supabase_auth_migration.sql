-- Run this in your Supabase SQL Editor

-- 1. Allow the users table to accept UUIDs from Auth system
-- (If the id column already has a default, we need to allow it to be set manually)
ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 2. Make sure RLS allows all operations for now
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public users" ON users;
CREATE POLICY "Public users" ON users FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public health records" ON health_records;
CREATE POLICY "Public health records" ON health_records FOR ALL USING (true) WITH CHECK (true);

-- 3. Add email column to users table (optional but useful)
ALTER TABLE users ADD COLUMN IF NOT EXISTS email text;
