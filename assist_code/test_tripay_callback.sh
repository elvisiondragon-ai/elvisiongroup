#!/bin/bash

# This script helps test the Supabase Edge Function 'tripay-callback' with a sample payload.
# Please be aware that the 'X-Callback-Signature' header is required by the function
# for validation and is not included in this command. Without it, the function will
# likely return a 403 Forbidden error.

curl -X POST \
  https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/tripay-callback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDk0NTQsImV4cCI6MjA2OTk4NTQ1NH0.62U0WBImD8aT8mJvHv4xysGsp4IyV1A4a26OlTdOpVw" \
  -d '{
    "status": "PAID",
    "reference": "T4427228596768XU9EN"
  }'
