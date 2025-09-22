-- Fix SAFE security warnings (avoiding payment functions)
-- 1. Extension in Public Schema
-- 2. Non-critical function search_path issues

-- ======================
-- 1. CHECK EXTENSION USAGE FIRST
-- ======================
-- Before moving extension, check what uses it
SELECT 
    'http_extension_usage' as test,
    routine_name,
    routine_definition
FROM information_schema.routines
WHERE routine_definition ILIKE '%http_%'
  AND routine_schema = 'public'
LIMIT 5;

-- Check current extension location
SELECT 
    'extension_current_location' as test,
    extname,
    nspname as schema_name
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE extname = 'http';

-- ======================
-- 2. FIX NON-PAYMENT FUNCTIONS (SAFE ONES)
-- ======================
-- Start with utility functions that are safe to modify

-- Fix handle_updated_at (safe utility function)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Fix update_updated_at_column (safe utility function)  
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Fix get_level_from_xp (safe calculation function)
CREATE OR REPLACE FUNCTION public.get_level_from_xp(xp_amount integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Simple level calculation based on XP
    CASE 
        WHEN xp_amount < 100 THEN RETURN 1;
        WHEN xp_amount < 300 THEN RETURN 2;
        WHEN xp_amount < 600 THEN RETURN 3;
        WHEN xp_amount < 1000 THEN RETURN 4;
        WHEN xp_amount < 1500 THEN RETURN 5;
        ELSE RETURN 6;
    END CASE;
END;
$$;

-- ======================
-- 3. CREATE EXTENSION MOVE SCRIPT (PREPARED BUT NOT EXECUTED)
-- ======================
-- This will be a separate step since it might affect existing code

-- Note: Extension move commands (to be executed separately after testing):
-- CREATE SCHEMA IF NOT EXISTS extensions;
-- ALTER EXTENSION http SET SCHEMA extensions;

-- ======================
-- VERIFICATION
-- ======================
SELECT 
    'safe_functions_security_check' as test,
    routine_name,
    CASE 
        WHEN routine_definition LIKE '%SET search_path = ''''%' THEN 'SECURED'
        ELSE 'STILL_VULNERABLE'
    END as security_status
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('handle_updated_at', 'update_updated_at_column', 'get_level_from_xp')
ORDER BY routine_name;