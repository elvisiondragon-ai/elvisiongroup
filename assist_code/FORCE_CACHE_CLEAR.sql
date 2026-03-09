-- SQL METHOD TO FORCE CACHE CLEAR FOR ALL USERS
-- This creates a version control system for cache invalidation

-- 1. CREATE CACHE VERSION TABLE
CREATE TABLE IF NOT EXISTS cache_version (
  id SERIAL PRIMARY KEY,
  version_number INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reason TEXT
);

-- Insert initial version
INSERT INTO cache_version (version_number, reason) 
VALUES (1, 'Initial cache version')
ON CONFLICT DO NOTHING;

-- 2. FUNCTION TO FORCE CACHE CLEAR (increment version)
CREATE OR REPLACE FUNCTION force_cache_clear(clear_reason TEXT DEFAULT 'Manual cache clear')
RETURNS INTEGER AS $$
DECLARE
  new_version INTEGER;
BEGIN
  -- Increment version number
  UPDATE cache_version 
  SET version_number = version_number + 1,
      updated_at = NOW(),
      reason = clear_reason
  WHERE id = 1
  RETURNING version_number INTO new_version;
  
  -- Log the cache clear
  INSERT INTO admin_logs (action, details, created_at)
  VALUES ('CACHE_CLEAR', 'Cache cleared: ' || clear_reason, NOW());
  
  RETURN new_version;
END;
$$ LANGUAGE plpgsql;

-- 3. RPC FUNCTION FOR FRONTEND TO CHECK CACHE VERSION
CREATE OR REPLACE FUNCTION check_cache_version()
RETURNS TABLE(version INTEGER, updated_at TIMESTAMP WITH TIME ZONE) AS $$
BEGIN
  RETURN QUERY
  SELECT cv.version_number, cv.updated_at
  FROM cache_version cv
  WHERE cv.id = 1;
END;
$$ LANGUAGE plpgsql;

-- 4. HOW TO USE:

-- FORCE CACHE CLEAR (run this to invalidate all user caches):
-- SELECT force_cache_clear('Updated chat system');

-- GET CURRENT CACHE VERSION:
-- SELECT * FROM check_cache_version();

-- 5. FRONTEND IMPLEMENTATION EXAMPLE:
-- In JavaScript, check cache version and clear if different:
/*
// Store cache version with cached data
const cacheData = {
  version: currentVersion,
  data: messages,
  timestamp: Date.now()
};
localStorage.setItem('chat-messages-cache', JSON.stringify(cacheData));

// Check if cache is still valid
const { data: versionData } = await supabase.rpc('check_cache_version');
const serverVersion = versionData[0].version;
const cachedData = JSON.parse(localStorage.getItem('chat-messages-cache') || '{}');

if (!cachedData.version || cachedData.version < serverVersion) {
  // Cache is outdated, clear all caches
  localStorage.removeItem('chat-messages-cache');
  localStorage.removeItem('user-profile-cache');
  localStorage.removeItem('user-cache');
  // Reload data
}
*/