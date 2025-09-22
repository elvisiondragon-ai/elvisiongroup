-- MINIMAL SAFE FIX: Only wrap auth.uid() with SELECT for performance
-- ZERO security changes - only performance optimization
-- Fixes auth_rls_initplan warnings for payment tables

BEGIN;

-- ======================
-- 1. FIX PRO_SUBSCRIPTIONS (auth wrapper only)
-- ======================

-- Fix: Users can insert their own subscription (with_check needs wrapper)
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.pro_subscriptions;
CREATE POLICY "Users can insert their own subscription" ON public.pro_subscriptions
    FOR INSERT
    TO public
    WITH CHECK ((SELECT auth.uid()) = user_id);

-- Fix: Users can only delete their own subscription (qual already wrapped correctly)
-- No change needed - already has (SELECT auth.uid() AS uid) which works

-- Fix: Users can only insert their own subscription (with_check already wrapped correctly)  
-- No change needed - already has (SELECT auth.uid() AS uid) which works

-- Fix: Users can only update their own subscription (qual already wrapped correctly)
-- No change needed - already has (SELECT auth.uid() AS uid) which works

-- Fix: Users can only view their own subscription (qual already wrapped correctly)
-- No change needed - already has (SELECT auth.uid() AS uid) which works

-- Fix: Users can update their own subscription (qual needs wrapper)
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.pro_subscriptions;
CREATE POLICY "Users can update their own subscription" ON public.pro_subscriptions
    FOR UPDATE
    TO public
    USING ((SELECT auth.uid()) = user_id);

-- Fix: Users can view their own subscription (qual needs wrapper)
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.pro_subscriptions;
CREATE POLICY "Users can view their own subscription" ON public.pro_subscriptions
    FOR SELECT
    TO public
    USING ((SELECT auth.uid()) = user_id);

-- Fix: Users read own subscriptions (qual needs wrapper)
DROP POLICY IF EXISTS "Users read own subscriptions" ON public.pro_subscriptions;
CREATE POLICY "Users read own subscriptions" ON public.pro_subscriptions
    FOR SELECT
    TO public
    USING (user_id = (SELECT auth.uid()));

-- Fix: Verified admins can view all subscriptions (qual needs wrapper)
DROP POLICY IF EXISTS "Verified admins can view all subscriptions" ON public.pro_subscriptions;
CREATE POLICY "Verified admins can view all subscriptions" ON public.pro_subscriptions
    FOR SELECT
    TO public
    USING (is_verified_admin((SELECT auth.uid())));

-- ======================
-- 2. FIX WAITING_PAYMENT (auth wrapper only)
-- ======================

-- Fix: Users can view their own waiting payments (qual needs wrapper)
DROP POLICY IF EXISTS "Users can view their own waiting payments" ON public.waiting_payment;
CREATE POLICY "Users can view their own waiting payments" ON public.waiting_payment
    FOR SELECT
    TO public
    USING (user_id = (SELECT auth.uid()));

-- ======================  
-- 3. FIX REFLECTIONS (auth wrapper only)
-- ======================

-- Fix: Users manage own reflections (already wrapped correctly, but let's standardize)
DROP POLICY IF EXISTS "Users manage own reflections" ON public.reflections;
CREATE POLICY "Users manage own reflections" ON public.reflections
    FOR ALL
    TO public
    USING ((SELECT auth.uid())::text = user_id)
    WITH CHECK ((SELECT auth.uid())::text = user_id);

-- ======================
-- 4. FIX ADMIN_ROLES (standardize auth wrapper format)
-- ======================

-- Fix: Consolidated admin roles access (standardize wrapper format)
DROP POLICY IF EXISTS "Consolidated admin roles access" ON public.admin_roles;
CREATE POLICY "Consolidated admin roles access" ON public.admin_roles
    FOR SELECT
    TO public
    USING (
        true
        OR
        ((verify_admin_with_failsafe((SELECT auth.uid()), 'super_admin'::text) ->> 'is_admin'::text))::boolean
    );

-- Fix: Super admins manage admin roles data (standardize wrapper format)
DROP POLICY IF EXISTS "Super admins manage admin roles data" ON public.admin_roles;
CREATE POLICY "Super admins manage admin roles data" ON public.admin_roles
    FOR ALL
    TO public
    USING (((verify_admin_with_failsafe((SELECT auth.uid()), 'super_admin'::text) ->> 'is_admin'::text))::boolean)
    WITH CHECK (((verify_admin_with_failsafe((SELECT auth.uid()), 'super_admin'::text) ->> 'is_admin'::text))::boolean);

COMMIT;

-- ======================
-- VERIFICATION QUERIES  
-- ======================

-- Verify no more unwrapped auth.uid() calls in payment tables
SELECT 
    'final_payment_auth_check' as test,
    schemaname,
    tablename,
    policyname,
    cmd,
    CASE 
        WHEN qual ~ 'auth\.uid\(\)' AND qual !~ '\(SELECT auth\.uid\(\)\)' THEN 'STILL_UNWRAPPED_IN_QUAL'
        WHEN with_check ~ 'auth\.uid\(\)' AND with_check !~ '\(SELECT auth\.uid\(\)\)' THEN 'STILL_UNWRAPPED_IN_WITH_CHECK'
        ELSE 'PROPERLY_WRAPPED'
    END as wrapper_status
FROM pg_policies
WHERE (qual ~ 'auth\.' OR with_check ~ 'auth\.')
  AND schemaname = 'public'
  AND tablename IN ('pro_subscriptions', 'waiting_payment', 'reflections', 'admin_roles')
ORDER BY tablename, policyname;

-- Show policy count per table (should be same as before)
SELECT 
    'policy_count_verification' as test,
    tablename,
    COUNT(*) as policy_count,
    array_agg(policyname ORDER BY policyname) as policy_names
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('pro_subscriptions', 'waiting_payment', 'reflections', 'admin_roles')
GROUP BY tablename
ORDER BY tablename;