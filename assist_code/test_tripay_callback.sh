#!/bin/bash

# This script helps test the Supabase Edge Function 'tripay-callback' with a sample payload.
# Please be aware that the 'X-Callback-Signature' header is required by the function
# for validation and is not included in this command. Without it, the function will
# likely return a 403 Forbidden error.

curl -X POST \
  https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/tripay-callback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NDM2MDUsImV4cCI6MjA4OTgwMzYwNX0.2zDvAe28Ho3BWUZC2Sxk7-PopwW0do2139xelPgEwLo" \
  -d '{
    "status": "PAID",
    "reference": "T4427228596768XU9EN"
  }'
