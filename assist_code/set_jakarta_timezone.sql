-- Set Jakarta timezone for all Supabase tables
-- Run this once to configure your database

-- Set database timezone to Jakarta
SET timezone = 'Asia/Jakarta';

-- Make it permanent for this session
ALTER DATABASE postgres SET timezone = 'Asia/Jakarta';

-- Update default for timestamp columns to use Jakarta time
-- For existing tables, update created_at and updated_at defaults
ALTER TABLE profiles ALTER COLUMN created_at SET DEFAULT (NOW() AT TIME ZONE 'Asia/Jakarta');
ALTER TABLE profiles ALTER COLUMN updated_at SET DEFAULT (NOW() AT TIME ZONE 'Asia/Jakarta');

ALTER TABLE waiting_payment ALTER COLUMN created_at SET DEFAULT (NOW() AT TIME ZONE 'Asia/Jakarta');
ALTER TABLE waiting_payment ALTER COLUMN updated_at SET DEFAULT (NOW() AT TIME ZONE 'Asia/Jakarta');

ALTER TABLE pro_subscriptions ALTER COLUMN created_at SET DEFAULT (NOW() AT TIME ZONE 'Asia/Jakarta');
ALTER TABLE pro_subscriptions ALTER COLUMN updated_at SET DEFAULT (NOW() AT TIME ZONE 'Asia/Jakarta');

-- For new tables, use this template:
-- created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Jakarta')
-- updated_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Jakarta')