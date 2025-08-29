-- PROFILE COUNTERS AND BADGES IMPLEMENTATION
-- This migration adds profile counters and badge systems

-- Add new columns to profiles table if they don't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'profiles' AND column_name = 'total_journal_sessions') THEN
        ALTER TABLE profiles ADD COLUMN total_journal_sessions INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'profiles' AND column_name = 'total_verses_completed') THEN
        ALTER TABLE profiles ADD COLUMN total_verses_completed INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'profiles' AND column_name = 'streak_days') THEN
        ALTER TABLE profiles ADD COLUMN streak_days INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'profiles' AND column_name = 'last_activity_date') THEN
        ALTER TABLE profiles ADD COLUMN last_activity_date DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'profiles' AND column_name = 'is_week_warrior') THEN
        ALTER TABLE profiles ADD COLUMN is_week_warrior BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'profiles' AND column_name = 'is_zen_master') THEN
        ALTER TABLE profiles ADD COLUMN is_zen_master BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Function to update journal counter and check badges
CREATE OR REPLACE FUNCTION update_journal_counter()
RETURNS TRIGGER AS $$
BEGIN
    -- Only process audio_completion and journal_completion types
    IF NEW.transaction_type IN ('audio_completion', 'journal_completion') THEN
        -- Check if it's a journal activity based on metadata
        IF NEW.metadata::jsonb ? 'journalId' OR NEW.metadata::jsonb ? 'journalTitle' OR NEW.transaction_type = 'journal_completion' THEN
            -- Update journal sessions counter
            UPDATE profiles 
            SET 
                total_journal_sessions = COALESCE(total_journal_sessions, 0) + 1,
                total_sessions = COALESCE(total_sessions, 0) + 1,
                last_activity_date = CURRENT_DATE
            WHERE user_id = NEW.user_id;
            
            -- Update streak days
            PERFORM update_user_streak(NEW.user_id);
        END IF;
        
        -- Check if it's a verse activity
        IF NEW.metadata::jsonb ? 'verseId' OR NEW.metadata::jsonb ? 'verseTitle' THEN
            -- Update verses counter
            UPDATE profiles 
            SET 
                total_verses_completed = COALESCE(total_verses_completed, 0) + 1,
                last_activity_date = CURRENT_DATE
            WHERE user_id = NEW.user_id;
            
            -- Check for Zen Master badge (100 verses)
            UPDATE profiles 
            SET is_zen_master = TRUE 
            WHERE user_id = NEW.user_id 
            AND COALESCE(total_verses_completed, 0) >= 100 
            AND NOT is_zen_master;
            
            -- Update streak days
            PERFORM update_user_streak(NEW.user_id);
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user streak and check Week Warrior badge
CREATE OR REPLACE FUNCTION update_user_streak(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
    user_record profiles%ROWTYPE;
    days_diff INTEGER;
BEGIN
    -- Get current user profile
    SELECT * INTO user_record FROM profiles WHERE user_id = user_uuid;
    
    IF user_record.user_id IS NULL THEN
        RETURN; -- User not found
    END IF;
    
    -- Calculate days difference
    IF user_record.last_activity_date IS NULL THEN
        days_diff = 0;
    ELSE
        days_diff = CURRENT_DATE - user_record.last_activity_date;
    END IF;
    
    -- Update streak based on days difference
    IF days_diff = 0 THEN
        -- Same day, no change to streak
        NULL;
    ELSIF days_diff = 1 THEN
        -- Consecutive day, increment streak
        UPDATE profiles 
        SET streak_days = COALESCE(streak_days, 0) + 1 
        WHERE user_id = user_uuid;
    ELSE
        -- Gap in days, reset streak to 1
        UPDATE profiles 
        SET streak_days = 1 
        WHERE user_id = user_uuid;
    END IF;
    
    -- Check for Week Warrior badge (7 day streak)
    UPDATE profiles 
    SET is_week_warrior = TRUE 
    WHERE user_id = user_uuid 
    AND COALESCE(streak_days, 0) >= 7 
    AND NOT is_week_warrior;
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update counters on XP transactions
DROP TRIGGER IF EXISTS update_profile_counters_trigger ON xp_transactions;
CREATE TRIGGER update_profile_counters_trigger
    AFTER INSERT ON xp_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_journal_counter();

-- Update existing data: Set initial counters based on existing xp_transactions
UPDATE profiles 
SET 
    total_journal_sessions = COALESCE((
        SELECT COUNT(*)
        FROM xp_transactions 
        WHERE xp_transactions.user_id = profiles.user_id 
        AND (
            xp_transactions.transaction_type = 'journal_completion' 
            OR (xp_transactions.metadata::jsonb ? 'journalId')
            OR (xp_transactions.metadata::jsonb ? 'journalTitle')
        )
    ), 0),
    total_verses_completed = COALESCE((
        SELECT COUNT(*)
        FROM xp_transactions 
        WHERE xp_transactions.user_id = profiles.user_id 
        AND (
            (xp_transactions.metadata::jsonb ? 'verseId')
            OR (xp_transactions.metadata::jsonb ? 'verseTitle')
        )
    ), 0);

-- Update badges based on current counters
UPDATE profiles 
SET is_zen_master = TRUE 
WHERE COALESCE(total_verses_completed, 0) >= 100 AND NOT is_zen_master;

-- Set Week Warrior for users with recent activity (basic implementation)
UPDATE profiles 
SET is_week_warrior = TRUE 
WHERE COALESCE(streak_days, 0) >= 7 AND NOT is_week_warrior;

-- Create view for profile stats (optional, for easier querying)
CREATE OR REPLACE VIEW profile_stats AS
SELECT 
    p.*,
    COALESCE(p.total_journal_sessions, 0) as journal_count,
    COALESCE(p.total_verses_completed, 0) as verses_count,
    COALESCE(p.streak_days, 0) as current_streak,
    CASE 
        WHEN p.is_zen_master THEN 'Zen Master'
        WHEN p.is_week_warrior THEN 'Week Warrior'
        WHEN p.level >= 3 THEN 'Spirit'
        ELSE 'Beginner'
    END as current_badge
FROM profiles p;