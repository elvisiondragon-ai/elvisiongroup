#!/bin/bash

# RENATA Analysis API Test Script
# Usage: ./renata.sh [test|post|status|deploy|secrets]

BASE_URL="https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/renata-analysis"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NDM2MDUsImV4cCI6MjA4OTgwMzYwNX0.2zDvAe28Ho3BWUZC2Sxk7-PopwW0do2139xelPgEwLo"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔮 RENATA Analysis API Tester${NC}"
echo "=================================="

case "$1" in
  "test")
    echo -e "${YELLOW}Testing analytics endpoint (no auth)...${NC}"
    curl -s "${BASE_URL}?test=analytics" | jq '.' || curl -s "${BASE_URL}?test=analytics"
    ;;

  "post")
    echo -e "${YELLOW}Testing POST analytics with auth...${NC}"
    curl -X POST "${BASE_URL}" \
      -H "Authorization: Bearer ${ANON_KEY}" \
      -H "Content-Type: application/json" \
      -d '{
        "reflections": [
          {"reflection": "Hari ini saya ingin melepaskan kekhawatiran tentang pekerjaan dan uang. Saya percaya bahwa rezeki sudah diatur."},
          {"reflection": "Saya melepaskan rasa takut akan masa depan. Saya ingin mendapatkan ketenangan hati dan cinta dalam hidup."},
          {"reflection": "Melepaskan rasa tidak percaya diri. Saya yakin saya bisa sukses dan bahagia."},
          {"reflection": "Saya lepaskan semua beban masa lalu yang menghambat kemajuan saya."}
        ],
        "totalVerses": 3,
        "userId": "test-user-123"
      }' | jq '.' || curl -X POST "${BASE_URL}" \
      -H "Authorization: Bearer ${ANON_KEY}" \
      -H "Content-Type: application/json" \
      -d '{"reflections":[{"reflection":"Hari ini saya ingin melepaskan kekhawatiran tentang pekerjaan dan uang"},{"reflection":"Saya melepaskan rasa takut akan masa depan"},{"reflection":"Melepaskan rasa tidak percaya diri"},{"reflection":"Saya lepaskan semua beban masa lalu"}],"totalVerses":3,"userId":"test-user-123"}'
    ;;

  "status")
    echo -e "${YELLOW}Checking function status...${NC}"
    curl -s "${BASE_URL}" | jq '.' || curl -s "${BASE_URL}"
    ;;

  "deploy")
    echo -e "${YELLOW}Deploying RENATA function...${NC}"
    supabase functions deploy renata-analysis
    ;;

  "secrets")
    echo -e "${YELLOW}Setting up secrets...${NC}"
    echo "Setting CHATGPT_API_KEY..."
    supabase secrets set CHATGPT_API_KEY=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

    echo "Setting SUPABASE_URL..."
    supabase secrets set SUPABASE_URL=https://nlrgdhpmsittuwiiindq.supabase.co

    echo "Setting SUPABASE_ANON_KEY..."
    supabase secrets set SUPABASE_ANON_KEY=${ANON_KEY}

    echo "Setting JWT_KEY..."
    supabase secrets set JWT_KEY=0B2A+aZ5iUMTdEuhZz9kzUiFrjg2P+DUz7zeJ0TKV8CdXayNXaqQrP7pligDIYso9d4j2hLiOsRKOXKOlqf0eg==

    echo -e "${GREEN}✅ All secrets set!${NC}"
    ;;

  "logs")
    echo -e "${YELLOW}Checking function logs...${NC}"
    supabase functions logs renata-analysis
    ;;

  *)
    echo -e "${GREEN}Usage: ./renata.sh [command]${NC}"
    echo ""
    echo "Commands:"
    echo "  test     - Test analytics endpoint (no auth, works immediately)"
    echo "  post     - Test POST analytics with real data"
    echo "  status   - Check function status and secrets"
    echo "  deploy   - Deploy the function"
    echo "  secrets  - Set all required secrets"
    echo "  logs     - View function logs"
    echo ""
    echo "Examples:"
    echo "  ./renata.sh test      # Quick test"
    echo "  ./renata.sh deploy    # Deploy function"
    echo "  ./renata.sh secrets   # Set all secrets"
    echo "  ./renata.sh post      # Full analytics test"
    ;;
esac