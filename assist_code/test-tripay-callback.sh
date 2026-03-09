#!/bin/bash

# STEP 1: Insert test data first (run this SQL in your database)
echo "⚠️  IMPORTANT: Run create-test-waiting-payment.sql first to create test data!"
echo "Then run this curl command..."
echo

# STEP 2: Test curl command for Tripay callback function
# For activating paid test with email: elvisiondragon@gmail.com

curl -X POST \
    https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/tripay-callback \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDk0NTQsImV4cCI6MjA2OTk4NTQ1NH0.62U0WBImD8aT8mJvHv4xysGsp4IyV1A4a26OlTdOpVw" \
    -d '{
      "reference": "T4427226517122ZKAT6",
      "status": "PAID", 
      "payment_method": "BCA Virtual Account"
    }'