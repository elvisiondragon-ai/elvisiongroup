-- CORRECTED RLS PERFORMANCE FIXES (BASED ON ACTUAL COLUMN NAMES)
-- Only fix tables that exist and have proper user columns

-- ========================================
-- STEP 1: Fix elite_habits table (has user_id uuid)
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
-- STEP 2: Fix reflections table (has user_id text - different type!)
-- ========================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can delete own reflections" ON public.reflections;
DROP POLICY IF EXISTS "Users can select own reflections" ON public.reflections;
DROP POLICY IF EXISTS "Users can insert own reflections" ON public.reflections;
DROP POLICY IF EXISTS "Users can update own reflections" ON public.reflections;

-- Create optimized policy (note: user_id is text type here)
CREATE POLICY "Users manage own reflections" 
ON public.reflections 
FOR ALL
USING ((select auth.uid()::text) = user_id)
WITH CHECK ((select auth.uid()::text) = user_id);

-- ========================================
-- STEP 3: Fix user_activities table (has user_id uuid)
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
-- STEP 4: Fix xp_transactions table (has user_id uuid)
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
-- STEP 5: Fix notification_settings table (has user_id uuid)
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
-- STEP 6: Fix device_tokens table (has user_id uuid)
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
-- STEP 7: Fix notifications table (has user_id uuid)
-- ========================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;

-- Create optimized policy
CREATE POLICY "Users view own notifications" 
ON public.notifications 
FOR SELECT
USING ((select auth.uid()) = user_id);

-- ========================================
-- STEP 8: Fix admin_roles table (has user_id uuid) - consolidate duplicates
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
-- STEP 9: Fix days_remaining table (has user_id uuid) - consolidate duplicates
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

-- Test user activities access  
SELECT COUNT(*) FROM public.user_activities WHERE user_id = (select auth.uid());

-- Test XP transactions access
SELECT COUNT(*) FROM public.xp_transactions WHERE user_id = (select auth.uid());

-- Test notifications access
SELECT COUNT(*) FROM public.notifications WHERE user_id = (select auth.uid());

-- ========================================
-- ROLLBACK PLAN (IF NEEDED)
-- ========================================

/*
-- If something breaks, run this to restore basic policies:

-- Restore basic elite_habits policy
CREATE POLICY "Users can view own elite habits" 
ON public.elite_habits 
FOR SELECT 
USING (auth.uid() = user_id);

-- Restore basic reflections policy (note text type)
CREATE POLICY "Users can select own reflections" 
ON public.reflections 
FOR SELECT 
USING (auth.uid()::text = user_id);
*/