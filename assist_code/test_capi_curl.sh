curl -X POST https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/capi-universal \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NDM2MDUsImV4cCI6MjA4OTgwMzYwNX0.2zDvAe28Ho3BWUZC2Sxk7-PopwW0do2139xelPgEwLo" \
  -H "Content-Type: application/json" \
  -d '{
    "pixelId": "3319324491540889",
    "eventName": "Purchase",
    "testCode": "TEST9597",
    "userData": {
      "email": "test@example.com",
      "client_ip_address": "127.0.0.1",
      "client_user_agent": "Mozilla/5.0 (Test Browser)"
    },
    "customData": {
      "value": 100,
      "currency": "IDR"
    },
    "eventId": "TEST_ID_MANUAL_101"
  }'