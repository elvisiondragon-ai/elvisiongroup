-- SAFE RLS PERFORMANCE FIXES
-- Run these one table at a time and test after each

-- ========================================
-- STEP 1: Fix profiles table (SAFEST TO START)
-- ========================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create optimized policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK ((select auth.uid()) = user_id);

-- ========================================
-- STEP 2: Fix chat_messages table
-- ========================================

-- Drop old policies
DROP POLICY IF EXISTS "Authenticated users can create chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Channel-based chat message access" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can delete their own chat messages" ON public.chat_messages;

-- Create consolidated optimized policies
CREATE POLICY "Chat message access" 
ON public.chat_messages 
FOR SELECT 
USING (
    channel_id = 'community' OR 
    (select auth.uid()) = user_id OR
    ((select auth.uid()) = ANY(allowed_users))
);

CREATE POLICY "Authenticated users can create chat messages" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can delete their own chat messages" 
ON public.chat_messages 
FOR DELETE 
USING ((select auth.uid()) = user_id);

-- ========================================
-- STEP 3: Fix pro_subscriptions table (CAREFUL - BILLING RELATED)
-- ========================================

-- Drop duplicate policies
DROP POLICY IF EXISTS "Users can only view their own subscription" ON public.pro_subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.pro_subscriptions;
DROP POLICY IF EXISTS "Users read own subscriptions" ON public.pro_subscriptions;

DROP POLICY IF EXISTS "Users can only insert their own subscription" ON public.pro_subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.pro_subscriptions;

DROP POLICY IF EXISTS "Users can only update their own subscription" ON public.pro_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.pro_subscriptions;

-- Create single optimized policies
CREATE POLICY "Users manage own subscriptions" 
ON public.pro_subscriptions 
FOR ALL
USING (
    (select auth.uid()) = user_id OR 
    public.is_verified_admin((select auth.uid()))
)
WITH CHECK (
    (select auth.uid()) = user_id OR 
    public.is_verified_admin((select auth.uid()))
);

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Test profiles access
SELECT COUNT(*) FROM public.profiles WHERE user_id = (select auth.uid());

-- Test chat access  
SELECT COUNT(*) FROM public.chat_messages WHERE channel_id = 'community';

-- Test subscription access
SELECT COUNT(*) FROM public.pro_subscriptions WHERE user_id = (select auth.uid());

-- ========================================
-- ROLLBACK PLAN (IF NEEDED)
-- ========================================

/*
-- If something breaks, run this to restore original policies:

-- Restore profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);
*/