#!/bin/bash

# Test signup email function
echo "=== Testing Signup Email Function ==="
curl -X POST \
  'https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/send-signup-email' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDk0NTQsImV4cCI6MjA2OTk4NTQ1NH0.62U0WBImD8aT8mJvHv4xysGsp4IyV1A4a26OlTdOpVw' \
  -H 'Content-Type: application/json' \
  -d '{"email": "elreyzandra@gmail.com", "name": "El Reyzandra"}'

echo -e "\n\n=== Testing Expire Subscriptions Function ==="
curl -X POST \
  'https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/expire-subscriptions' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDk0NTQsImV4cCI6MjA2OTk4NTQ1NH0.62U0WBImD8aT8mJvHv4xysGsp4IyV1A4a26OlTdOpVw' \
  -H 'Content-Type: application/json' \
  -d '{}'