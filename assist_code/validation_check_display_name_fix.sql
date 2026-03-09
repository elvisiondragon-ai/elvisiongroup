-- COMPREHENSIVE VALIDATION CHECK for Display Name Metadata Fix
-- This validates that the infinite toast issue is completely resolved

-- ==================================================
-- SECTION 1: CORE DATA INTEGRITY VALIDATION
-- ==================================================

-- 1.1 Verify NO users have Anonymous or empty metadata display names
SELECT 
    'CRITICAL CHECK - Anonymous Users' as validation_type,
    COUNT(*) as problematic_users,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ PASS - No anonymous users found'
        ELSE '❌ FAIL - Still have anonymous users!'
    END as status
FROM auth.users au
WHERE au.raw_user_meta_data->>'display_name' IS NULL 
   OR trim(au.raw_user_meta_data->>'display_name') = ''
   OR au.raw_user_meta_data->>'display_name' = 'Anonymous';

-- 1.2 Verify metadata and profile display names are synchronized
SELECT 
    'SYNC VALIDATION' as validation_type,
    COUNT(*) as total_users_with_profiles,
    COUNT(CASE WHEN au.raw_user_meta_data->>'display_name' = p.display_name THEN 1 END) as perfectly_synced,
    COUNT(CASE WHEN au.raw_user_meta_data->>'display_name' != p.display_name THEN 1 END) as sync_mismatches,
    CASE 
        WHEN COUNT(CASE WHEN au.raw_user_meta_data->>'display_name' != p.display_name THEN 1 END) = 0 
        THEN '✅ PASS - All synced perfectly'
        ELSE '⚠️  WARNING - Some sync mismatches found'
    END as status
FROM auth.users au
INNER JOIN profiles p ON p.user_id = au.id
WHERE p.display_name IS NOT NULL AND trim(p.display_name) != '';

-- 1.3 Show any remaining sync mismatches for investigation
SELECT 
    'MISMATCH DETAILS' as info,
    au.id,
    au.email,
    au.raw_user_meta_data->>'display_name' as auth_metadata_name,
    p.display_name as profile_name,
    length(au.raw_user_meta_data->>'display_name') as metadata_name_length,
    length(p.display_name) as profile_name_length,
    au.updated_at as last_auth_update,
    p.updated_at as last_profile_update
FROM auth.users au
INNER JOIN profiles p ON p.user_id = au.id
WHERE p.display_name IS NOT NULL 
  AND trim(p.display_name) != ''
  AND au.raw_user_meta_data->>'display_name' != p.display_name
ORDER BY au.updated_at DESC
LIMIT 10;

-- ==================================================
-- SECTION 2: CHAT.TSX SPECIFIC VALIDATION
-- ==================================================

-- 2.1 Simulate Chat.tsx logic: user.user_metadata?.display_name || 'Anonymous'
SELECT 
    'CHAT.TSX SIMULATION' as validation_type,
    COUNT(*) as total_users,
    COUNT(CASE WHEN COALESCE(au.raw_user_meta_data->>'display_name', 'Anonymous') = 'Anonymous' THEN 1 END) as would_show_anonymous_toast,
    COUNT(CASE WHEN COALESCE(au.raw_user_meta_data->>'display_name', 'Anonymous') != 'Anonymous' THEN 1 END) as would_allow_chat,
    CASE 
        WHEN COUNT(CASE WHEN COALESCE(au.raw_user_meta_data->>'display_name', 'Anonymous') = 'Anonymous' THEN 1 END) = 0 
        THEN '✅ PASS - No users would trigger infinite toast'
        ELSE '❌ FAIL - Some users would still trigger toast!'
    END as chat_validation_status
FROM auth.users au;

-- 2.2 Test the exact Chat.tsx condition: !currentUser.name || currentUser.name === 'Anonymous'
SELECT 
    'CHAT MESSAGE BLOCKING TEST' as test_name,
    au.id,
    au.email,
    au.raw_user_meta_data->>'display_name' as metadata_display_name,
    CASE 
        WHEN au.raw_user_meta_data->>'display_name' IS NULL THEN 'WOULD BLOCK - NULL name'
        WHEN trim(au.raw_user_meta_data->>'display_name') = '' THEN 'WOULD BLOCK - Empty name'
        WHEN au.raw_user_meta_data->>'display_name' = 'Anonymous' THEN 'WOULD BLOCK - Anonymous'
        ELSE '✅ WOULD ALLOW CHAT'
    END as chat_access_status
FROM auth.users au
ORDER BY 
    CASE 
        WHEN au.raw_user_meta_data->>'display_name' IS NULL THEN 1
        WHEN trim(au.raw_user_meta_data->>'display_name') = '' THEN 2
        WHEN au.raw_user_meta_data->>'display_name' = 'Anonymous' THEN 3
        ELSE 4
    END
LIMIT 20;

-- ==================================================
-- SECTION 3: PAYMENT.TSX SPECIFIC VALIDATION
-- ==================================================

-- 3.1 Simulate Payment.tsx metadata loading logic
SELECT 
    'PAYMENT.TSX METADATA LOADING' as validation_type,
    COUNT(*) as total_users,
    COUNT(CASE WHEN au.raw_user_meta_data->>'display_name' IS NOT NULL 
                AND trim(au.raw_user_meta_data->>'display_name') != '' THEN 1 END) as instant_name_load,
    COUNT(CASE WHEN au.raw_user_meta_data->>'display_name' IS NULL 
                OR trim(au.raw_user_meta_data->>'display_name') = '' THEN 1 END) as would_need_fallback,
    CASE 
        WHEN COUNT(CASE WHEN au.raw_user_meta_data->>'display_name' IS NOT NULL 
                         AND trim(au.raw_user_meta_data->>'display_name') != '' THEN 1 END) = COUNT(*) 
        THEN '✅ PASS - All users get instant name loading'
        ELSE '⚠️  Some users need fallback logic'
    END as payment_loading_status
FROM auth.users au;

-- ==================================================
-- SECTION 4: EDGE CASE VALIDATION
-- ==================================================

-- 4.1 Check for unusual characters or encoding issues in display names
SELECT 
    'DISPLAY NAME QUALITY CHECK' as check_type,
    COUNT(*) as total_users,
    COUNT(CASE WHEN au.raw_user_meta_data->>'display_name' ~ '[^\x01-\x7F]' THEN 1 END) as has_non_ascii,
    COUNT(CASE WHEN length(au.raw_user_meta_data->>'display_name') > 50 THEN 1 END) as name_too_long,
    COUNT(CASE WHEN au.raw_user_meta_data->>'display_name' ~ '^\s|\s$' THEN 1 END) as has_leading_trailing_spaces,
    COUNT(CASE WHEN au.raw_user_meta_data->>'display_name' ~ '^\d+$' THEN 1 END) as numeric_only_names
FROM auth.users au
WHERE au.raw_user_meta_data->>'display_name' IS NOT NULL;

-- 4.2 Show sample of edge case names for review
SELECT 
    'EDGE CASE SAMPLES' as info,
    au.email,
    au.raw_user_meta_data->>'display_name' as display_name,
    length(au.raw_user_meta_data->>'display_name') as name_length,
    CASE 
        WHEN au.raw_user_meta_data->>'display_name' ~ '[^\x01-\x7F]' THEN 'Non-ASCII chars'
        WHEN length(au.raw_user_meta_data->>'display_name') > 50 THEN 'Too long'
        WHEN au.raw_user_meta_data->>'display_name' ~ '^\s|\s$' THEN 'Has spaces'
        WHEN au.raw_user_meta_data->>'display_name' ~ '^\d+$' THEN 'Numeric only'
        ELSE 'Normal'
    END as edge_case_type
FROM auth.users au
WHERE au.raw_user_meta_data->>'display_name' IS NOT NULL
  AND (au.raw_user_meta_data->>'display_name' ~ '[^\x01-\x7F]'
       OR length(au.raw_user_meta_data->>'display_name') > 50
       OR au.raw_user_meta_data->>'display_name' ~ '^\s|\s$'
       OR au.raw_user_meta_data->>'display_name' ~ '^\d+$')
LIMIT 10;

-- ==================================================
-- SECTION 5: PERFORMANCE IMPACT VALIDATION
-- ==================================================

-- 5.1 Check if all users have properly structured metadata JSON
SELECT 
    'METADATA STRUCTURE VALIDATION' as validation_type,
    COUNT(*) as total_users,
    COUNT(CASE WHEN au.raw_user_meta_data IS NULL THEN 1 END) as null_metadata,
    COUNT(CASE WHEN jsonb_typeof(au.raw_user_meta_data) = 'object' THEN 1 END) as valid_json_object,
    COUNT(CASE WHEN au.raw_user_meta_data ? 'display_name' THEN 1 END) as has_display_name_key,
    CASE 
        WHEN COUNT(CASE WHEN au.raw_user_meta_data ? 'display_name' THEN 1 END) = COUNT(*) 
        THEN '✅ PASS - All users have display_name key'
        ELSE '❌ Some users missing display_name key'
    END as metadata_structure_status
FROM auth.users au;

-- ==================================================
-- SECTION 6: FINAL COMPREHENSIVE VALIDATION SUMMARY
-- ==================================================

-- 6.1 Overall system health check
SELECT 
    'INFINITE TOAST FIX VALIDATION SUMMARY' as final_report,
    (SELECT COUNT(*) FROM auth.users) as total_users,
    
    -- Chat.tsx validation
    (SELECT COUNT(*) FROM auth.users au 
     WHERE COALESCE(au.raw_user_meta_data->>'display_name', 'Anonymous') != 'Anonymous') as chat_ready_users,
    
    -- Payment.tsx validation  
    (SELECT COUNT(*) FROM auth.users au 
     WHERE au.raw_user_meta_data->>'display_name' IS NOT NULL 
       AND trim(au.raw_user_meta_data->>'display_name') != '') as payment_ready_users,
    
    -- Sync validation
    (SELECT COUNT(*) FROM auth.users au 
     INNER JOIN profiles p ON p.user_id = au.id
     WHERE p.display_name IS NOT NULL 
       AND au.raw_user_meta_data->>'display_name' = p.display_name) as perfectly_synced_users,
       
    -- Overall success rate
    CASE 
        WHEN (SELECT COUNT(*) FROM auth.users au 
              WHERE COALESCE(au.raw_user_meta_data->>'display_name', 'Anonymous') = 'Anonymous') = 0
        THEN '✅ SUCCESS - Infinite toast issue completely resolved!'
        ELSE '❌ FAILURE - Issue not fully resolved'
    END as final_status;

-- 6.2 Spot check specific problem users from before (if any known)
-- Replace 'dragon@yahoo.com' with actual problematic user emails if known
SELECT 
    'SPOT CHECK PREVIOUSLY PROBLEMATIC USERS' as check_type,
    au.email,
    au.raw_user_meta_data->>'display_name' as current_metadata_name,
    p.display_name as profile_name,
    CASE 
        WHEN COALESCE(au.raw_user_meta_data->>'display_name', 'Anonymous') = 'Anonymous' 
        THEN '❌ Would still trigger infinite toast'
        ELSE '✅ Fixed - would allow chat'
    END as fix_status
FROM auth.users au
LEFT JOIN profiles p ON p.user_id = au.id
WHERE au.email IN ('dragon@yahoo.com', 'elvisiondragon@gmail.com') -- Add known problematic emails
   OR au.created_at > NOW() - INTERVAL '7 days' -- Recent users most likely to have issues
ORDER BY au.created_at DESC
LIMIT 5;

-- ==================================================
-- FINAL CONFIDENCE CHECK
-- ==================================================

SELECT 
    '🎯 INFINITE TOAST FIX CONFIDENCE SCORE' as metric,
    ROUND(
        (
            -- Weight: Chat functionality (40%)
            (SELECT COUNT(*) FROM auth.users au 
             WHERE COALESCE(au.raw_user_meta_data->>'display_name', 'Anonymous') != 'Anonymous') * 0.4 +
            -- Weight: Payment functionality (30%)  
            (SELECT COUNT(*) FROM auth.users au 
             WHERE au.raw_user_meta_data->>'display_name' IS NOT NULL 
               AND trim(au.raw_user_meta_data->>'display_name') != '') * 0.3 +
            -- Weight: Data sync integrity (30%)
            (SELECT COUNT(*) FROM auth.users au 
             INNER JOIN profiles p ON p.user_id = au.id
             WHERE p.display_name IS NOT NULL 
               AND au.raw_user_meta_data->>'display_name' = p.display_name) * 0.3
        ) / (SELECT COUNT(*) FROM auth.users) * 100, 2
    ) as confidence_percentage,
    CASE 
        WHEN (
            (SELECT COUNT(*) FROM auth.users au 
             WHERE COALESCE(au.raw_user_meta_data->>'display_name', 'Anonymous') != 'Anonymous') = 
            (SELECT COUNT(*) FROM auth.users)
        ) THEN '🎉 PERFECT FIX - Deploy with confidence!'
        ELSE '⚠️  Review needed before deployment'
    END as deployment_recommendation;