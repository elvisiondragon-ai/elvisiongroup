-- SIGNUP EMAIL FUNCTION ANALYSIS
-- Current Status: send-signup-email function is NOT called for all signup methods

-- ISSUE FOUND:
-- 1. Auth.tsx - Regular signup: ✅ CALLS send-signup-email (line 486)
-- 2. Auth.tsx - Google signup: ❌ MISSING send-signup-email call 
-- 3. Signup.tsx - Regular signup: ❌ MISSING send-signup-email call

-- LOCATIONS NEEDING FIX:
-- File: /Users/eldragon/git/elvisiongroup/src/pages/Auth.tsx
-- Function: handleGoogleAuth (line 223) - Add after successful OAuth
-- 
-- File: /Users/eldragon/git/elvisiongroup/src/pages/Signup.tsx  
-- Function: handleSignup (line 148-166) - Add after successful signup

-- CURRENT WORKING CODE (from Auth.tsx:484-491):
/*
try {
  await supabase.functions.invoke('send-signup-email', {
    body: {
      userEmail: signupData.email,
      userName: signupData.email.split('@')[0]
    }
  });
} catch (emailError) {
  console.error('Failed to send welcome email:', emailError);
  // Continue even if email fails
}
*/

-- SQL TO CHECK EXISTING EMAIL FUNCTION:
SELECT 
    name,
    created_at,
    updated_at,
    version
FROM pg_catalog.pg_proc 
WHERE proname LIKE '%signup%email%' 
   OR proname LIKE '%send%email%';

-- Check function logs in Supabase Dashboard:
-- Dashboard > Functions > send-signup-email > Logs