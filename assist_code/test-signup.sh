#!/bin/bash

echo "=== Testing Signup Email Function ==="
curl -X POST \
  'https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/send-signup-email' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NDM2MDUsImV4cCI6MjA4OTgwMzYwNX0.2zDvAe28Ho3BWUZC2Sxk7-PopwW0do2139xelPgEwLo' \
  -H 'Content-Type: application/json' \
  -d '{"email": "elreyzandra@gmail.com", "name": "El Reyzandra"}'

echo -e "\n=== Signup Email Test Complete ==="