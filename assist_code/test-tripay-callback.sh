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
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NDM2MDUsImV4cCI6MjA4OTgwMzYwNX0.2zDvAe28Ho3BWUZC2Sxk7-PopwW0do2139xelPgEwLo" \
    -d '{
      "reference": "T4427226517122ZKAT6",
      "status": "PAID", 
      "payment_method": "BCA Virtual Account"
    }'