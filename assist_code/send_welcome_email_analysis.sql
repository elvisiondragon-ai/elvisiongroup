-- SEND-WELCOME-EMAIL FUNCTION ANALYSIS
-- Status: ❌ UNUSED - CAN BE DELETED

-- COMPARISON:
-- 1. send-signup-email: ✅ ACTIVELY USED in Auth.tsx & Signup.tsx (Mailketing API)
-- 2. send-welcome-email: ❌ NOT USED anywhere in codebase (Resend API)

-- EVIDENCE:
-- ✅ send-signup-email found in:
--    - /src/pages/Auth.tsx (line 486, 255)
--    - /src/pages/Signup.tsx (line 151)
--    - Multiple test files in assist_code/

-- ❌ send-welcome-email NOT found in:
--    - No .tsx/.ts files invoke this function
--    - Only exists in config.toml and download scripts
--    - Never actually called by frontend

-- FUNCTION DIFFERENCES:
-- send-signup-email (USED):
--   - Uses Mailketing API
--   - Adds to mailing list (LIST_ID: 80713)
--   - Comprehensive welcome email with features
--   - Subject: "🎉 Selamat Datang di ElVision Group!"
--   - Includes Pro upgrade promo

-- send-welcome-email (UNUSED):
--   - Uses Resend API  
--   - Simple welcome email
--   - Subject: "Selamat Datang di ElVision Group!"
--   - Different email template

-- RECOMMENDATION:
-- DELETE send-welcome-email function to avoid confusion
-- Keep only send-signup-email which is actively used

-- FILES TO DELETE:
-- /supabase/functions/send-welcome-email/index.ts
-- Remove from supabase/config.toml