-- SIMPLE FIX: SpiritualJournal.tsx validation timing issue
-- Problem: currentUser is null during navigation but not during F5 refresh
-- Solution: Split validation checks for better UX

-- VERIFICATION QUERY: Check if users have valid sessions
SELECT 
    'Current valid sessions' as check_type,
    COUNT(*) as total_sessions,
    COUNT(CASE WHEN expires_at > NOW() THEN 1 END) as active_sessions,
    MAX(created_at) as latest_session
FROM auth.sessions
WHERE created_at > NOW() - INTERVAL '1 day';

-- FRONTEND FIX NEEDED:
-- File: /src/pages/SpiritualJournal.tsx
-- Line: 67-75 
-- 
-- CHANGE FROM:
-- if (!reflection.trim() || !currentUser) {
--   toast({ description: "Silakan tulis renungan Anda terlebih dahulu" });
--   return;
-- }
--
-- CHANGE TO:
-- if (!reflection.trim()) {
--   toast({ description: "Silakan tulis renungan Anda terlebih dahulu" });
--   return;
-- }
-- 
-- if (!currentUser) {
--   toast({ description: "Loading user data, please wait..." });
--   // Retry getCurrentUser() or show loading state
--   return;
-- }

-- VERIFICATION: After fix, test that reflections can be saved during navigation
SELECT 
    'Post-fix verification' as test_type,
    user_id,
    user_email,
    created_at,
    'Navigation test' as source
FROM reflections 
WHERE created_at > NOW() - INTERVAL '5 minutes'
ORDER BY created_at DESC
LIMIT 3;