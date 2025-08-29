-- AUDIO XP LIMITS - SQL IMPLEMENTATION
-- This migration implements proper XP limits in the database

-- Create enhanced XP awarding function with proper limits
CREATE OR REPLACE FUNCTION award_xp_with_limits(
    p_user_id UUID,
    p_xp_amount INTEGER,
    p_activity_type TEXT,
    p_reason TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
) RETURNS TABLE (
    success BOOLEAN,
    message TEXT,
    xp_awarded INTEGER
) AS $$
DECLARE
    today_start TIMESTAMPTZ := DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC');
    one_hour_ago TIMESTAMPTZ := NOW() AT TIME ZONE 'UTC' - INTERVAL '1 hour';
    daily_total INTEGER;
    recent_journal_count INTEGER;
    daily_limit INTEGER;
    actual_xp INTEGER;
    is_journal_activity BOOLEAN := FALSE;
    is_verse_activity BOOLEAN := FALSE;
    listening_minutes INTEGER;
BEGIN
    -- Determine activity type and limits
    IF p_activity_type = 'audio_completion' THEN
        daily_limit := 20; -- Max 20 XP per day for audio completion
        
        -- Check if it's journal or verse based on metadata
        IF p_metadata ? 'journalId' OR p_metadata ? 'journalTitle' THEN
            is_journal_activity := TRUE;
            -- Extract listening minutes for journal validation
            listening_minutes := COALESCE((p_metadata->>'listeningMinutes')::INTEGER, 0);
            
            -- Journal audio must be listened for minimum 60 minutes
            IF listening_minutes < 60 THEN
                RETURN QUERY SELECT FALSE, 'Journal audio must be listened for minimum 1 hour (60 minutes)', 0;
                RETURN;
            END IF;
        ELSIF p_metadata ? 'verseId' OR p_metadata ? 'verseTitle' THEN
            is_verse_activity := TRUE;
        END IF;
        
    ELSIF p_activity_type = 'journal_completion' THEN
        daily_limit := 5; -- Max 5 XP per day for journal completion (typing)
        is_journal_activity := TRUE;
        
        -- Check hourly cooldown for journal typing
        SELECT COUNT(*) INTO recent_journal_count
        FROM xp_transactions
        WHERE user_id = p_user_id
        AND transaction_type = 'journal_completion'
        AND created_at >= one_hour_ago;
        
        IF recent_journal_count > 0 THEN
            RETURN QUERY SELECT FALSE, 'Journal typing XP is limited to once per hour', 0;
            RETURN;
        END IF;
    ELSE
        daily_limit := 999; -- No limit for other activities
    END IF;
    
    -- Check daily limits
    SELECT COALESCE(SUM(xp_amount), 0) INTO daily_total
    FROM xp_transactions
    WHERE user_id = p_user_id
    AND transaction_type = p_activity_type
    AND created_at >= today_start;
    
    -- Calculate actual XP to award (don't exceed daily limit)
    actual_xp := LEAST(p_xp_amount, daily_limit - daily_total);
    
    IF actual_xp <= 0 THEN
        RETURN QUERY SELECT FALSE, 'Daily XP limit reached for this activity', 0;
        RETURN;
    END IF;
    
    -- Insert XP transaction
    INSERT INTO xp_transactions (
        user_id, 
        xp_amount, 
        transaction_type, 
        reason, 
        metadata
    ) VALUES (
        p_user_id, 
        actual_xp, 
        p_activity_type, 
        COALESCE(p_reason, p_activity_type), 
        p_metadata
    );
    
    -- Update profile counters
    IF is_journal_activity THEN
        -- Update journal sessions counter
        UPDATE profiles 
        SET 
            total_journal_sessions = COALESCE(total_journal_sessions, 0) + 1,
            total_sessions = COALESCE(total_sessions, 0) + 1,
            last_activity_date = CURRENT_DATE
        WHERE user_id = p_user_id;
        
        -- Update streak
        PERFORM update_user_streak(p_user_id);
        
    ELSIF is_verse_activity THEN
        -- Update verses counter
        UPDATE profiles 
        SET 
            total_verses_completed = COALESCE(total_verses_completed, 0) + 1,
            last_activity_date = CURRENT_DATE
        WHERE user_id = p_user_id;
        
        -- Check for Zen Master badge (100 verses)
        UPDATE profiles 
        SET is_zen_master = TRUE 
        WHERE user_id = p_user_id 
        AND COALESCE(total_verses_completed, 0) >= 100 
        AND NOT COALESCE(is_zen_master, FALSE);
        
        -- Update streak
        PERFORM update_user_streak(p_user_id);
    END IF;
    
    RETURN QUERY SELECT TRUE, 'XP awarded successfully', actual_xp;
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create simplified function for frontend to call
CREATE OR REPLACE FUNCTION award_audio_xp(
    p_user_id UUID,
    p_metadata JSONB DEFAULT '{}',
    p_reason TEXT DEFAULT NULL
) RETURNS TABLE (
    success BOOLEAN,
    message TEXT,
    xp_awarded INTEGER
) AS $$
BEGIN
    RETURN QUERY SELECT * FROM award_xp_with_limits(
        p_user_id := p_user_id,
        p_xp_amount := 10, -- Always 10 XP for audio completion
        p_activity_type := 'audio_completion',
        p_reason := p_reason,
        p_metadata := p_metadata
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create simplified function for journal typing XP
CREATE OR REPLACE FUNCTION award_journal_typing_xp(
    p_user_id UUID,
    p_reason TEXT DEFAULT 'Spiritual journal reflection'
) RETURNS TABLE (
    success BOOLEAN,
    message TEXT,
    xp_awarded INTEGER
) AS $$
BEGIN
    RETURN QUERY SELECT * FROM award_xp_with_limits(
        p_user_id := p_user_id,
        p_xp_amount := 5, -- Always 5 XP for journal typing
        p_activity_type := 'journal_completion',
        p_reason := p_reason,
        p_metadata := '{}'::jsonb
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check current daily XP status
CREATE OR REPLACE FUNCTION get_daily_xp_status(p_user_id UUID)
RETURNS TABLE (
    audio_xp_today INTEGER,
    audio_xp_remaining INTEGER,
    journal_xp_today INTEGER,
    journal_xp_remaining INTEGER,
    last_journal_typing TIMESTAMPTZ,
    can_journal_typing BOOLEAN
) AS $$
DECLARE
    today_start TIMESTAMPTZ := DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC');
    one_hour_ago TIMESTAMPTZ := NOW() AT TIME ZONE 'UTC' - INTERVAL '1 hour';
    audio_total INTEGER;
    journal_total INTEGER;
    last_journal TIMESTAMPTZ;
BEGIN
    -- Get today's XP totals
    SELECT 
        COALESCE(SUM(CASE WHEN transaction_type = 'audio_completion' THEN xp_amount ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN transaction_type = 'journal_completion' THEN xp_amount ELSE 0 END), 0)
    INTO audio_total, journal_total
    FROM xp_transactions
    WHERE user_id = p_user_id
    AND created_at >= today_start;
    
    -- Get last journal typing time
    SELECT MAX(created_at) INTO last_journal
    FROM xp_transactions
    WHERE user_id = p_user_id
    AND transaction_type = 'journal_completion';
    
    RETURN QUERY SELECT 
        audio_total,
        GREATEST(0, 20 - audio_total), -- Audio remaining (max 20)
        journal_total,
        GREATEST(0, 5 - journal_total), -- Journal remaining (max 5)
        last_journal,
        (last_journal IS NULL OR last_journal < one_hour_ago); -- Can do journal typing
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION award_xp_with_limits(UUID, INTEGER, TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION award_audio_xp(UUID, JSONB, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION award_journal_typing_xp(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_daily_xp_status(UUID) TO authenticated;

-- Example usage comments:
/*
-- Award audio XP for journal listening (with 60+ minutes validation):
SELECT * FROM award_audio_xp(
    'user-uuid-here'::UUID, 
    '{"journalId": 1, "journalTitle": "Guide to Inner Silence", "listeningMinutes": 75}'::jsonb,
    'Completed journal audio listening'
);

-- Award audio XP for verse completion:
SELECT * FROM award_audio_xp(
    'user-uuid-here'::UUID, 
    '{"verseId": 123, "verseTitle": "Some Verse"}'::jsonb,
    'Completed verse audio'
);

-- Award journal typing XP:
SELECT * FROM award_journal_typing_xp('user-uuid-here'::UUID);

-- Check daily limits:
SELECT * FROM get_daily_xp_status('user-uuid-here'::UUID);
*/