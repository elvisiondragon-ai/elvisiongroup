#!/bin/bash

# Test tripay-callback edge function with PAID status
# This simulates Tripay confirming payment for reference T4427226597162XLYPB

curl -X POST \
  https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/tripay-callback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQwOTQ1NCwiZXhwIjoyMDY5OTg1NDU0fQ.zA37zRBUtN4Wx64QuE1CTlWiHzphbe6BCRRz-EtWHsE" \
  -d '{
    "reference": "T4427226597162XLYPB",
    "status": "PAID",
    "payment_method": "BCAVA",
    "amount": 100000,
    "currency": "IDR",
    "merchant_ref": "EVG_TEST_123",
    "customer_email": "test@example.com"
  }'