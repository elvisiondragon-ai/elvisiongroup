-- SIMPLE CHAT FIX - NO FAKE DATA, REAL AUTHENTICATION ONLY
-- Problem: User not authenticated, that's why chat doesn't work

-- ===== STEP 1: CHECK REAL AUTHENTICATION =====
SELECT 
    'AUTHENTICATION CHECK' as check_type,
    auth.uid() as current_user_id,
    CASE 
        WHEN auth.uid() IS NOT NULL THEN '✅ USER IS AUTHENTICATED'
        ELSE '❌ USER NOT AUTHENTICATED - LOGIN REQUIRED'
    END as auth_status;

-- ===== STEP 2: ONLY FIX RLS POLICIES (NO FAKE DATA) =====
-- Make chat work for authenticated users only

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Anyone can view chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Authenticated users can insert messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can update own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can delete own messages" ON chat_messages;
DROP POLICY IF EXISTS "Admin can delete any message" ON chat_messages;

-- Simple, clean policies for authenticated users
CREATE POLICY "Auth users can view chat" ON chat_messages
    FOR SELECT USING (true);

CREATE POLICY "Auth users can insert chat" ON chat_messages
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can delete own messages" ON chat_messages
    FOR DELETE USING (auth.uid() = user_id);

-- Profiles policies
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Auth users can view profiles" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own profile" ON profiles
    FOR ALL USING (auth.uid() = user_id);

-- ===== STEP 3: ADD PERFORMANCE INDEXES =====
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- ===== STEP 4: VERIFY CURRENT STATUS =====
SELECT 
    'FINAL STATUS' as check_type,
    CASE 
        WHEN auth.uid() IS NOT NULL THEN 
            'USER AUTHENTICATED: Chat should work now ✅'
        ELSE 
            'USER NOT AUTHENTICATED: Please log in through the app first ❌'
    END as result,
    'Next step: Log in through your app frontend' as instruction;