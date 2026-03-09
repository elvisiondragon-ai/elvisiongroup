-- Tab Workflow Analysis Summary
-- First time clicking each tab behavior analysis

/*
=== BERANDA (Home.tsx) ===
FIRST TIME LOAD:
1. NO DATABASE FETCH - Pure frontend
2. Uses useUserProfile context (already loaded)
3. Preloads audio files in background for offline access
4. Uses localStorage only for:
   - scrollToTestimonials flag
   - Media URL caching (videos/images)
5. NO auto refresh - static content with cached media

REFRESH BEHAVIOR: 
- No forced refresh
- Only media cache preloading
- Uses context data (already loaded from Profile/Login)

=== KOMUNITAS (Chat.tsx) === 
FIRST TIME LOAD:
1. IMMEDIATE: Gets user from supabase.auth.getSession()
2. BACKGROUND: Fetches from profiles table (display_name, level, achievements)
3. DATABASE FETCH: 
   - chat_messages table (SELECT * ORDER BY created_at)
   - admin_roles lookup for admin status
4. CACHE: Checks localStorage for 'chat-messages-cache'
5. FALLBACK: Uses mock data if database fails

REFRESH BEHAVIOR:
- 60-minute auto polling interval
- Manual refresh button (full page reload)
- Cache-first strategy for instant loading

=== HALL OF ENERGY (Leaderboard.tsx) ===
FIRST TIME LOAD:
1. NO DATABASE FETCH - Uses hardcoded mockLeaderboard array
2. Pure frontend component
3. NO caching, NO refresh

REFRESH BEHAVIOR:
- Static data, no refresh needed
- No database calls

=== PROFILE (Profile.tsx) ===
FIRST TIME LOAD:  
1. IMMEDIATE: Uses useUserProfile context
2. DATABASE FETCH: Full profiles table data
3. Real-time user data loading
4. Multiple profile fields loaded

REFRESH BEHAVIOR:
- Context-based, real-time updates
- Database-driven
*/

-- Check what data each tab actually needs
SELECT 'chat_messages' as table_name, COUNT(*) as record_count FROM chat_messages
UNION ALL
SELECT 'profiles' as table_name, COUNT(*) as record_count FROM profiles;

-- Check if there are any admin users in the system
SELECT user_id, display_name, is_admin FROM profiles WHERE is_admin = true LIMIT 5;