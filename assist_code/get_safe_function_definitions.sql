-- Get definitions for SAFE functions (exclude payment-related)
-- These are utility functions that are safe to modify

-- 1. Safe utility functions
SELECT 
    'safe_utility_functions' as category,
    routine_name,
    routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
      'handle_updated_at',
      'update_updated_at_column', 
      'get_level_from_xp',
      'get_xp_thresholds',
      'calculate_correct_level',
      'update_streak',
      'check_user_notification_shown',
      'mark_notification_type_shown'
  )
ORDER BY routine_name;

-- 2. Safe XP/Achievement functions  
SELECT 
    'safe_xp_functions' as category,
    routine_name,
    routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
      'add_achievement',
      'award_audio_xp',
      'award_journal_xp',
      'increment_total_journal',
      'increment_total_verses',
      'update_total_journal_count',
      'update_total_journal_count_delete'
  )
ORDER BY routine_name;