-- ===========================================
-- PREVENT FUTURE DUPLICATE PRO SUBSCRIPTIONS
-- ===========================================

-- 1. Create unique constraint to prevent duplicates
-- Only allow one active subscription per user
ALTER TABLE pro_subscriptions
ADD CONSTRAINT unique_active_subscription_per_user
UNIQUE (user_id, status)
DEFERRABLE INITIALLY DEFERRED;

-- 2. Create function to handle subscription upgrades/extensions
CREATE OR REPLACE FUNCTION handle_subscription_upgrade()
RETURNS TRIGGER AS $$
BEGIN
    -- If inserting active subscription and user already has active subscription
    IF NEW.status = 'active' AND EXISTS (
        SELECT 1 FROM pro_subscriptions
        WHERE user_id = NEW.user_id
        AND status = 'active'
        AND id != NEW.id
    ) THEN
        -- Get existing subscription
        WITH existing AS (
            SELECT * FROM pro_subscriptions
            WHERE user_id = NEW.user_id
            AND status = 'active'
            AND id != NEW.id
            ORDER BY subscription_end_date DESC
            LIMIT 1
        )
        -- If new subscription is longer, update existing instead of creating duplicate
        UPDATE pro_subscriptions
        SET
            subscription_type = CASE
                WHEN NEW.subscription_end_date > (SELECT subscription_end_date FROM existing) THEN NEW.subscription_type
                ELSE subscription_type
            END,
            subscription_end_date = GREATEST(subscription_end_date, NEW.subscription_end_date),
            days_remaining = GREATEST(days_remaining, NEW.days_remaining),
            updated_at = NOW()
        WHERE user_id = NEW.user_id AND status = 'active';

        -- Prevent the INSERT
        RETURN NULL;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;