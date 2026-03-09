-- FINAL CORRECTED RLS PERFORMANCE FIXES
-- Using actual existing functions from the policies

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
-- STEP 2: Fix reflections table (has user_id text)
-- ========================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can delete own reflections" ON public.reflections;
DROP POLICY IF EXISTS "Users can select own reflections" ON public.reflections;
DROP POLICY IF EXISTS "Users can insert own reflections" ON public.reflections;
DROP POLICY IF EXISTS "Users can update own reflections" ON public.reflections;

-- Create optimized policy (user_id is text type)
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
-- STEP 8: Fix admin_roles table - consolidate duplicates + optimize
-- ========================================

-- Drop duplicate policies (these both return true for everyone)
DROP POLICY IF EXISTS "allow_read_admin_roles" ON public.admin_roles;
DROP POLICY IF EXISTS "simple_read_admin_roles" ON public.admin_roles;

-- Keep single read policy but optimize existing ones
DROP POLICY IF EXISTS "Super admins can create admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Super admins can update admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Super admins can delete admin roles" ON public.admin_roles;

-- Create optimized policies using the actual function
CREATE POLICY "Admin roles read access" 
ON public.admin_roles 
FOR SELECT
USING (true); -- Keep open access as the duplicates had

CREATE POLICY "Super admins manage admin roles" 
ON public.admin_roles 
FOR ALL
USING (((verify_admin_with_failsafe((select auth.uid()), 'super_admin'::text) ->> 'is_admin'::text))::boolean)
WITH CHECK (((verify_admin_with_failsafe((select auth.uid()), 'super_admin'::text) ->> 'is_admin'::text))::boolean);

-- ========================================
-- STEP 9: Fix data_classification table - consolidate + optimize
-- ========================================

-- Drop duplicate policies
DROP POLICY IF EXISTS "Only verified admins can view data classification" ON public.data_classification;
DROP POLICY IF EXISTS "Only verified admins can manage data classification" ON public.data_classification;

-- Create single optimized policy using actual function
CREATE POLICY "Verified admins manage data classification" 
ON public.data_classification 
FOR ALL
USING (is_verified_admin((select auth.uid())))
WITH CHECK (is_verified_admin((select auth.uid())));

-- ========================================
-- STEP 10: Fix days_remaining table - consolidate + optimize
-- ========================================

-- Drop duplicate policies
DROP POLICY IF EXISTS "Users can view their own days_remaining" ON public.days_remaining;
DROP POLICY IF EXISTS "Verified admins can manage days_remaining" ON public.days_remaining;

-- Create optimized policy using actual function
CREATE POLICY "Days remaining access" 
ON public.days_remaining 
FOR ALL
USING (
    (select auth.uid()) = user_id OR 
    is_verified_admin((select auth.uid()))
)
WITH CHECK (
    (select auth.uid()) = user_id OR 
    is_verified_admin((select auth.uid()))
);

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Test user activities access  
SELECT COUNT(*) FROM public.user_activities WHERE user_id = (select auth.uid());

-- Test XP transactions access
SELECT COUNT(*) FROM public.xp_transactions WHERE user_id = (select auth.uid());

-- Test notifications access
SELECT COUNT(*) FROM public.notifications WHERE user_id = (select auth.uid());