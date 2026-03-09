-- Check if reflections table has triggers (like elite_habits does)
-- This will tell us why journal counters might not sync properly

-- 1. Check triggers on reflections table specifically  
SELECT 
    t.trigger_name,
    t.event_manipulation,
    t.action_timing,
    t.action_statement,
    t.action_condition
FROM information_schema.triggers t
WHERE t.event_object_table = 'reflections'
ORDER BY t.trigger_name;

-- 2. Compare with elite_habits triggers
SELECT 
    'ELITE_HABITS' as table_type,
    t.trigger_name,
    t.event_manipulation,
    t.action_timing,
    t.action_statement
FROM information_schema.triggers t
WHERE t.event_object_table = 'elite_habits'
UNION ALL
SELECT 
    'REFLECTIONS' as table_type,
    t.trigger_name,
    t.event_manipulation,
    t.action_timing,
    t.action_statement
FROM information_schema.triggers t
WHERE t.event_object_table = 'reflections'
ORDER BY table_type, trigger_name;
[
  {
    "table_type": "ELITE_HABITS",
    "trigger_name": "auto_populate_elite_habit_email_trigger",
    "event_manipulation": "INSERT",
    "action_timing": "BEFORE",
    "action_statement": "EXECUTE FUNCTION auto_populate_elite_habit_email()"
  },
  {
    "table_type": "ELITE_HABITS",
    "trigger_name": "handle_elite_habits_updated_at",
    "event_manipulation": "UPDATE",
    "action_timing": "BEFORE",
    "action_statement": "EXECUTE FUNCTION handle_updated_at()"
  },
  {
    "table_type": "ELITE_HABITS",
    "trigger_name": "sync_elite_habit_count_delete",
    "event_manipulation": "DELETE",
    "action_timing": "AFTER",
    "action_statement": "EXECUTE FUNCTION sync_elite_habit_count()"
  },
  {
    "table_type": "ELITE_HABITS",
    "trigger_name": "sync_elite_habit_count_insert",
    "event_manipulation": "INSERT",
    "action_timing": "AFTER",
    "action_statement": "EXECUTE FUNCTION sync_elite_habit_count()"
  },
  {
    "table_type": "ELITE_HABITS",
    "trigger_name": "sync_elite_habit_count_update",
    "event_manipulation": "UPDATE",
    "action_timing": "AFTER",
    "action_statement": "EXECUTE FUNCTION sync_elite_habit_count()"
  }
]

-- 3. Test current counter consistency
SELECT 
    p.user_id,
    p.user_email,
    p.total_journal as profile_counter,
    p.total_elite_habit as elite_counter,
    (SELECT COUNT(*) FROM reflections r WHERE r.user_id::text = p.user_id::text) as actual_reflections,
    (SELECT COUNT(*) FROM elite_habits e WHERE e.user_id::text = p.user_id::text) as actual_elite_habits,
    
    -- Check consistency
    CASE 
        WHEN p.total_journal = (SELECT COUNT(*) FROM reflections r WHERE r.user_id::text = p.user_id::text) 
        THEN '✅ JOURNAL_OK' 
        ELSE '❌ JOURNAL_MISMATCH' 
    END as journal_sync_status,
    
    CASE 
        WHEN p.total_elite_habit = (SELECT COUNT(*) FROM elite_habits e WHERE e.user_id::text = p.user_id::text) 
        THEN '✅ ELITE_OK' 
        ELSE '❌ ELITE_MISMATCH' 
    END as elite_sync_status
    
FROM profiles p
WHERE (p.total_journal > 0 OR p.total_elite_habit > 0)
ORDER BY p.updated_at DESC
LIMIT 10;

[
  {
    "user_id": "23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a",
    "user_email": "nandangstn69@gmail.com",
    "profile_counter": 17,
    "elite_counter": 7,
    "actual_reflections": 13,
    "actual_elite_habits": 6,
    "journal_sync_status": "❌ JOURNAL_MISMATCH",
    "elite_sync_status": "❌ ELITE_MISMATCH"
  },
  {
    "user_id": "3da83afb-aa8c-4c55-b3b0-8aa64000205f",
    "user_email": "dragon@yahoo.com",
    "profile_counter": 33,
    "elite_counter": 1,
    "actual_reflections": 0,
    "actual_elite_habits": 1,
    "journal_sync_status": "❌ JOURNAL_MISMATCH",
    "elite_sync_status": "✅ ELITE_OK"
  },
  {
    "user_id": "9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95",
    "user_email": "elreyzandra@gmail.com",
    "profile_counter": 14,
    "elite_counter": 13,
    "actual_reflections": 1,
    "actual_elite_habits": 15,
    "journal_sync_status": "❌ JOURNAL_MISMATCH",
    "elite_sync_status": "❌ ELITE_MISMATCH"
  },
  {
    "user_id": "8c2cd3b1-6b77-4df9-92c5-467182ecd13d",
    "user_email": "elvisiondragon@gmail.com",
    "profile_counter": 1,
    "elite_counter": 0,
    "actual_reflections": 0,
    "actual_elite_habits": 0,
    "journal_sync_status": "❌ JOURNAL_MISMATCH",
    "elite_sync_status": "✅ ELITE_OK"
  },
  {
    "user_id": "9658b272-7c15-4ca7-aa18-4fed28aab303",
    "user_email": "elking.bali@gmail.com",
    "profile_counter": 4,
    "elite_counter": 0,
    "actual_reflections": 0,
    "actual_elite_habits": 0,
    "journal_sync_status": "❌ JOURNAL_MISMATCH",
    "elite_sync_status": "✅ ELITE_OK"
  },
  {
    "user_id": "94dda7bb-aa8f-47c8-a3be-de2139f94ef9",
    "user_email": "mock1@yahoo.com",
    "profile_counter": 25,
    "elite_counter": 8,
    "actual_reflections": 1,
    "actual_elite_habits": 9,
    "journal_sync_status": "❌ JOURNAL_MISMATCH",
    "elite_sync_status": "❌ ELITE_MISMATCH"
  },
  {
    "user_id": "f6560fca-177d-497f-9225-a597ed888589",
    "user_email": "astawebogor@gmail.com",
    "profile_counter": 32,
    "elite_counter": 0,
    "actual_reflections": 28,
    "actual_elite_habits": 0,
    "journal_sync_status": "❌ JOURNAL_MISMATCH",
    "elite_sync_status": "✅ ELITE_OK"
  },
  {
    "user_id": "ed675b6c-0cd8-4475-aecc-74b921c68b35",
    "user_email": "trial01@yahoo.com",
    "profile_counter": 6,
    "elite_counter": 3,
    "actual_reflections": 5,
    "actual_elite_habits": 2,
    "journal_sync_status": "❌ JOURNAL_MISMATCH",
    "elite_sync_status": "❌ ELITE_MISMATCH"
  },
  {
    "user_id": "22c2ab08-6a42-44c3-b290-dedba2161dd0",
    "user_email": "kikisandhi@gmail.com",
    "profile_counter": 22,
    "elite_counter": 0,
    "actual_reflections": 20,
    "actual_elite_habits": 0,
    "journal_sync_status": "❌ JOURNAL_MISMATCH",
    "elite_sync_status": "✅ ELITE_OK"
  },
  {
    "user_id": "2c89253b-a0cd-4217-acdc-f98d84d21dca",
    "user_email": "nurul.helmie@gmail.com",
    "profile_counter": 61,
    "elite_counter": 4,
    "actual_reflections": 61,
    "actual_elite_habits": 3,
    "journal_sync_status": "✅ JOURNAL_OK",
    "elite_sync_status": "❌ ELITE_MISMATCH"
  }
]