-- Fix untuk extend user session di Supabase (Hosted)
-- auth.config table tidak exist di hosted Supabase

-- Method 1: Via Supabase Dashboard (RECOMMENDED)
-- 1. Buka Supabase Dashboard
-- 2. Authentication → Settings  
-- 3. JWT Expiry: 7776000 (90 days in seconds)
-- 4. Refresh Token Expiry: 7776000 (90 days in seconds)

-- Method 2: Jika ingin via SQL, coba approach ini
-- Set JWT expiry via database configuration
SELECT current_setting('app.jwt_exp', true);

-- If above returns null, set it:
-- ALTER DATABASE postgres SET app.jwt_exp = '7776000';

-- Method 3: Alternative for hosted Supabase
-- Check available auth settings
SELECT name, setting 
FROM pg_settings 
WHERE name LIKE '%jwt%' OR name LIKE '%auth%' OR name LIKE '%token%';

-- Method 4: For self-hosted Supabase only (won't work on hosted)
-- CREATE TABLE IF NOT EXISTS auth.config (
--   parameter TEXT PRIMARY KEY,
--   value TEXT
-- );
-- 
-- INSERT INTO auth.config (parameter, value) VALUES 
-- ('jwt_exp', '7776000'),
-- ('refresh_token_expiry', '7776000')
-- ON CONFLICT (parameter) DO UPDATE SET value = EXCLUDED.value;

-- SOLUTION: Use Supabase Dashboard instead
-- Dashboard → Authentication → Settings → JWT Expiry = 7776000