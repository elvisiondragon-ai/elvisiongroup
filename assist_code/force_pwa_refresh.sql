-- ===========================================
-- FORCE PWA CACHE REFRESH SYSTEM
-- ===========================================
-- Run this SQL in Supabase SQL Editor to force all users to refresh their PWA cache

-- Step 1: Add app_version column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS app_version INTEGER DEFAULT 1;

-- Step 2: Add cache_cleared_at column if it doesn't exist  
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS cache_cleared_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Step 3: Create app_config table for global version management
CREATE TABLE IF NOT EXISTS app_config (
    id INTEGER PRIMARY KEY DEFAULT 1,
    current_version INTEGER NOT NULL DEFAULT 1,
    force_refresh BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT single_config CHECK (id = 1)
);

-- Insert initial config if not exists
INSERT INTO app_config (id, current_version, force_refresh) 
VALUES (1, 1, FALSE) 
ON CONFLICT (id) DO NOTHING;

-- Step 4: Function to force refresh for all users
CREATE OR REPLACE FUNCTION force_global_cache_refresh()
RETURNS void AS $$
BEGIN
    -- Increment global app version
    UPDATE app_config 
    SET current_version = current_version + 1,
        force_refresh = TRUE,
        updated_at = NOW()
    WHERE id = 1;
    
    -- Reset all user versions to trigger refresh
    UPDATE profiles 
    SET app_version = 0,
        cache_cleared_at = NULL;
        
    -- Log the refresh action
    RAISE NOTICE 'Global cache refresh triggered. New version: %', 
        (SELECT current_version FROM app_config WHERE id = 1);
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- HOW TO USE:
-- ===========================================

-- TO FORCE ALL USERS TO REFRESH PWA CACHE:
-- SELECT force_global_cache_refresh();

-- TO CHECK CURRENT VERSION:
-- SELECT * FROM app_config;

-- TO SEE USERS WHO NEED TO REFRESH:
-- SELECT id, email, app_version, cache_cleared_at 
-- FROM profiles 
-- WHERE app_version < (SELECT current_version FROM app_config WHERE id = 1);

-- ===========================================
-- EMERGENCY: INSTANT CACHE CLEAR (RUN THIS NOW)
-- ===========================================
SELECT force_global_cache_refresh();