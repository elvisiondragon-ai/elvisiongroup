-- SAFE RLS PERFORMANCE FIXES (NON-CRITICAL TABLES ONLY)
-- Skip pro_subscriptions, waiting_payment, and other billing-related tables

-- ========================================
-- STEP 1: Fix audio_tracks table
-- ========================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can view their own audio tracks" ON public.audio_tracks;
DROP POLICY IF EXISTS "Authenticated users can create audio tracks" ON public.audio_tracks;
DROP POLICY IF EXISTS "Users can update their own audio tracks" ON public.audio_tracks;
DROP POLICY IF EXISTS "Anyone can view public audio tracks" ON public.audio_tracks;

-- Create optimized consolidated policies
CREATE POLICY "Audio tracks access" 
ON public.audio_tracks 
FOR SELECT 
USING (
    is_public = true OR 
    (select auth.uid()) = user_id
);

CREATE POLICY "Authenticated users can create audio tracks" 
ON public.audio_tracks 
FOR INSERT 
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can update their own audio tracks" 
ON public.audio_tracks 
FOR UPDATE 
USING ((select auth.uid()) = user_id);

-- ========================================
-- STEP 2: Fix elite_habits table
-- ========================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can insert own elite habits" ON public.elite_habits;
DROP POLICY IF EXISTS "Users can view own elite habits" ON public.elite_habits;
DROP POLICY IF EXISTS "Users can update own elite habits" ON public.elite_habits;
DROP POLICY IF EXISTS "Users can delete own elite habits" ON public.elite_habits;

-- Create optimized policy
CREATE POLICY "Users manage own elite habits" 
ON public.elite_habits 
FOR ALL
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);

-- ========================================
-- STEP 3: Fix reflections table
-- ========================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can delete own reflections" ON public.reflections;
DROP POLICY IF EXISTS "Users can select own reflections" ON public.reflections;
DROP POLICY IF EXISTS "Users can insert own reflections" ON public.reflections;
DROP POLICY IF EXISTS "Users can update own reflections" ON public.reflections;

-- Create optimized policy
CREATE POLICY "Users manage own reflections" 
ON public.reflections 
FOR ALL
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);

-- ========================================
-- STEP 4: Fix user_activities table
-- ========================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can view their own activities" ON public.user_activities;
DROP POLICY IF EXISTS "Users can create their own activities" ON public.user_activities;

-- Create optimized policy
CREATE POLICY "Users manage own activities" 
ON public.user_activities 
FOR ALL
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);

-- ========================================
-- STEP 5: Fix xp_transactions table
-- ========================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can view their own XP transactions" ON public.xp_transactions;
DROP POLICY IF EXISTS "Users can create their own XP transactions" ON public.xp_transactions;

-- Create optimized policy
CREATE POLICY "Users manage own XP transactions" 
ON public.xp_transactions 
FOR ALL
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);

-- ========================================
-- STEP 6: Fix notification_settings table
-- ========================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can view their own notification settings" ON public.notification_settings;
DROP POLICY IF EXISTS "Users can insert their own notification settings" ON public.notification_settings;
DROP POLICY IF EXISTS "Users can update their own notification settings" ON public.notification_settings;

-- Create optimized policy
CREATE POLICY "Users manage own notification settings" 
ON public.notification_settings 
FOR ALL
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);

-- ========================================
-- STEP 7: Fix device_tokens table
-- ========================================

-- Drop old policies
DROP POLICY IF EXISTS "Secure device token access" ON public.device_tokens;
DROP POLICY IF EXISTS "Secure device token insert" ON public.device_tokens;
DROP POLICY IF EXISTS "Secure device token update" ON public.device_tokens;
DROP POLICY IF EXISTS "Secure device token delete" ON public.device_tokens;

-- Create optimized policy
CREATE POLICY "Secure device token management" 
ON public.device_tokens 
FOR ALL
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);

-- ========================================
-- STEP 8: Fix notifications table
-- ========================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;

-- Create optimized policy
CREATE POLICY "Users view own notifications" 
ON public.notifications 
FOR SELECT
USING ((select auth.uid()) = user_id);

-- ========================================
-- STEP 9: Fix admin_roles table (consolidate duplicates)
-- ========================================

-- Drop duplicate policies
DROP POLICY IF EXISTS "allow_read_admin_roles" ON public.admin_roles;
DROP POLICY IF EXISTS "simple_read_admin_roles" ON public.admin_roles;

-- Keep or create single optimized policy
CREATE POLICY "Admin roles access" 
ON public.admin_roles 
FOR SELECT
USING (public.is_super_admin((select auth.uid())));

-- Keep existing admin management policies but optimize them
DROP POLICY IF EXISTS "Super admins can create admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Super admins can update admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Super admins can delete admin roles" ON public.admin_roles;

CREATE POLICY "Super admins manage admin roles" 
ON public.admin_roles 
FOR ALL
USING (public.is_super_admin((select auth.uid())))
WITH CHECK (public.is_super_admin((select auth.uid())));

-- ========================================
-- STEP 10: Fix data_classification table (consolidate duplicates)
-- ========================================

-- Drop duplicate policies
DROP POLICY IF EXISTS "Only verified admins can view data classification" ON public.data_classification;
DROP POLICY IF EXISTS "Only verified admins can manage data classification" ON public.data_classification;

-- Create single optimized policy
CREATE POLICY "Verified admins manage data classification" 
ON public.data_classification 
FOR ALL
USING (public.is_verified_admin((select auth.uid())))
WITH CHECK (public.is_verified_admin((select auth.uid())));

-- ========================================
-- STEP 11: Fix days_remaining table (consolidate duplicates)
-- ========================================

-- Drop duplicate policies
DROP POLICY IF EXISTS "Users can view their own days_remaining" ON public.days_remaining;
DROP POLICY IF EXISTS "Verified admins can manage days_remaining" ON public.days_remaining;

-- Create optimized policy
CREATE POLICY "Days remaining access" 
ON public.days_remaining 
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
-- VERIFICATION QUERIES (SAFE TO RUN)
-- ========================================

-- Test audio tracks access
SELECT COUNT(*) FROM public.audio_tracks WHERE is_public = true;

-- Test user activities access  
SELECT COUNT(*) FROM public.user_activities WHERE user_id = (select auth.uid());

-- Test XP transactions access
SELECT COUNT(*) FROM public.xp_transactions WHERE user_id = (select auth.uid());

-- ========================================
-- ROLLBACK PLAN (IF NEEDED)
-- ========================================

/*
-- If something breaks, run this to restore a basic policy:

-- Restore basic audio_tracks policy
CREATE POLICY "Users can view their own audio tracks" 
ON public.audio_tracks 
FOR SELECT 
USING (auth.uid() = user_id);

-- Restore basic elite_habits policy
CREATE POLICY "Users can view own elite habits" 
ON public.elite_habits 
FOR SELECT 
USING (auth.uid() = user_id);
*/