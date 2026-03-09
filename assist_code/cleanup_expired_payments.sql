-- Cleanup expired pending payments from waiting_payment table
-- This should run as a cron job every hour to clean up payments older than 24 hours
-- Using Jakarta time (Asia/Jakarta timezone)

-- Delete payments that are still pending after 24 hours (Jakarta time)
DELETE FROM waiting_payment 
WHERE status = 'pending' 
  AND created_at < (NOW() AT TIME ZONE 'Asia/Jakarta') - INTERVAL '24 hours';


-- Create cleanup_logs table if it doesn't exist (run this once)
-- CREATE TABLE IF NOT EXISTS cleanup_logs (
--   id SERIAL PRIMARY KEY,
--   table_name VARCHAR(50),
--   action VARCHAR(50),
--   records_affected INTEGER,
--   cleanup_date TIMESTAMP DEFAULT NOW()
-- );