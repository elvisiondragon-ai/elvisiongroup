#!/bin/bash

echo "=== Testing Expire Subscriptions Function ==="
curl -X POST \
  'https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/expire-subscriptions' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NDM2MDUsImV4cCI6MjA4OTgwMzYwNX0.2zDvAe28Ho3BWUZC2Sxk7-PopwW0do2139xelPgEwLo' \
  -H 'Content-Type: application/json' \
  -d '{"test_email": "deliais2001@gmail.com"}'

echo -e "\n=== Expire Function Test Complete ==="