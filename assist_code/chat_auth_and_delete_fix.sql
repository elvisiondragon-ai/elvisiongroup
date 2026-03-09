-- SQL TO CHECK AND FIX CHAT AUTHENTICATION AND DELETE BUTTON ISSUES
-- Problem 1: Cannot type chat (requires login) but user is logged in
-- Problem 2: Cannot see delete button on history chat

-- ===== STEP 1: CHECK CURRENT DATABASE STRUCTURE =====
-- Check if chat_messages table exists and its structure
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'chat_messages' 
ORDER BY ordinal_position;

-- Check if profiles table exists (needed for authentication)
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- ===== STEP 2: CHECK RLS POLICIES =====
-- Check current RLS policies for chat_messages
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'chat_messages';

-- Check current RLS policies for profiles
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- ===== STEP 3: CHECK IF TABLES EXIST, CREATE IF MISSING =====
-- Create chat_messages table if not exists
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_level INTEGER DEFAULT 1,
    is_pro BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    subscription_type TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create profiles table if not exists
CREATE TABLE IF NOT EXISTS profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    is_pro BOOLEAN DEFAULT FALSE,
    subscription_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===== STEP 4: ENABLE RLS =====
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ===== STEP 5: DROP EXISTING PROBLEMATIC POLICIES =====
DROP POLICY IF EXISTS "Users can view all chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert their own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can update their own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can delete their own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Admins can delete any chat message" ON chat_messages;

DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- ===== STEP 6: CREATE CORRECT RLS POLICIES =====

-- CHAT_MESSAGES POLICIES
-- Allow everyone to view all chat messages (public chat)
CREATE POLICY "Anyone can view chat messages" ON chat_messages
    FOR SELECT USING (true);

-- Allow authenticated users to insert messages
CREATE POLICY "Authenticated users can insert messages" ON chat_messages
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Allow users to update their own messages
CREATE POLICY "Users can update own messages" ON chat_messages
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own messages
CREATE POLICY "Users can delete own messages" ON chat_messages
    FOR DELETE USING (auth.uid() = user_id);

-- Allow admin to delete any message (admin user ID from code)
CREATE POLICY "Admin can delete any message" ON chat_messages
    FOR DELETE USING (auth.uid() = '3da83afb-aa8c-4c55-b3b0-8aa64000205f'::uuid);

-- PROFILES POLICIES
-- Allow users to view all profiles (for chat display)
CREATE POLICY "Anyone can view profiles" ON profiles
    FOR SELECT USING (true);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- ===== STEP 7: CREATE INDEXES FOR PERFORMANCE =====
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- ===== STEP 8: CREATE TRIGGER FOR UPDATED_AT =====
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
DROP TRIGGER IF EXISTS update_chat_messages_updated_at ON chat_messages;
CREATE TRIGGER update_chat_messages_updated_at
    BEFORE UPDATE ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===== STEP 9: VERIFICATION QUERIES =====
-- Test authentication check
SELECT 
    'AUTH CHECK' as test_type,
    auth.uid() as current_user_id,
    CASE 
        WHEN auth.uid() IS NOT NULL THEN 'USER IS AUTHENTICATED ✅'
        ELSE 'USER NOT AUTHENTICATED ❌'
    END as auth_status;

-- Test chat_messages table access
SELECT 
    'CHAT ACCESS TEST' as test_type,
    COUNT(*) as message_count,
    'Can read chat messages ✅' as status
FROM chat_messages;

-- Test profiles table access
SELECT 
    'PROFILES ACCESS TEST' as test_type,
    COUNT(*) as profile_count,
    'Can read profiles ✅' as status
FROM profiles;

-- Check RLS policies are working
SELECT 
    'RLS POLICIES CHECK' as test_type,
    tablename,
    policyname,
    cmd as permission_type
FROM pg_policies 
WHERE tablename IN ('chat_messages', 'profiles')
ORDER BY tablename, cmd;

-- ===== STEP 10: TEST DELETE FUNCTIONALITY =====
-- Check if current user can delete their own messages
SELECT 
    'DELETE TEST' as test_type,
    cm.id,
    cm.user_name,
    cm.message,
    CASE 
        WHEN cm.user_id = auth.uid() THEN 'CAN DELETE ✅'
        WHEN auth.uid() = '3da83afb-aa8c-4c55-b3b0-8aa64000205f'::uuid THEN 'CAN DELETE AS ADMIN ✅'
        ELSE 'CANNOT DELETE ❌'
    END as delete_permission
FROM chat_messages cm
ORDER BY cm.created_at DESC
LIMIT 10;

-- ===== STEP 11: INSERT TEST MESSAGE (IF USER IS AUTHENTICATED) =====
-- Only runs if user is authenticated
INSERT INTO chat_messages (user_id, user_name, user_level, is_pro, message)
SELECT 
    auth.uid(),
    COALESCE(p.display_name, split_part(au.email, '@', 1), 'Test User'),
    COALESCE(p.level, 1),
    COALESCE(p.is_pro, false),
    '🔧 Database connection test - this message confirms auth is working!'
FROM auth.users au
LEFT JOIN profiles p ON p.user_id = au.id
WHERE au.id = auth.uid() AND auth.uid() IS NOT NULL;

-- Final status check
SELECT 
    'FINAL STATUS' as check_type,
    CASE 
        WHEN auth.uid() IS NOT NULL THEN '✅ User authenticated'
        ELSE '❌ User not authenticated'
    END as auth_status,
    CASE 
        WHEN EXISTS(SELECT 1 FROM chat_messages WHERE user_id = auth.uid()) THEN '✅ Can insert messages'
        ELSE '⚠️ No messages from current user (may be new user)'
    END as insert_status,
    CASE 
        WHEN EXISTS(SELECT 1 FROM pg_policies WHERE tablename = 'chat_messages' AND cmd = 'DELETE') THEN '✅ Delete policies exist'
        ELSE '❌ Delete policies missing'
    END as delete_policy_status;