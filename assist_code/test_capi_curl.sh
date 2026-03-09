curl -X POST https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/capi-universal \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDk0NTQsImV4cCI6MjA2OTk4NTQ1NH0.62U0WBImD8aT8mJvHv4xysGsp4IyV1A4a26OlTdOpVw" \
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