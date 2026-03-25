#!/bin/bash

AUTH_HEADER="Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NDM2MDUsImV4cCI6MjA4OTgwMzYwNX0.2zDvAe28Ho3BWUZC2Sxk7-PopwW0do2139xelPgEwLo"
CONTENT_TYPE="Content-Type: application/json"
BASE_URL="https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1"

# Array of test users
declare -a emails=("email2@example.com" "email3@example.com" "email4@example.com")
declare -a names=("User Two" "User Three" "User Four")

echo "=== Bulk Testing Signup Email Function ==="
for i in "${!emails[@]}"; do
    email="${emails[$i]}"
    name="${names[$i]}"
    
    echo "Sending to: $email ($name)"
    curl -X POST \
        "$BASE_URL/send-signup-email" \
        -H "$AUTH_HEADER" \
        -H "$CONTENT_TYPE" \
        -d "{\"email\": \"$email\", \"name\": \"$name\"}"
    
    echo -e "\n---\n"
    sleep 1  # Small delay between requests
done

echo -e "\n=== Testing Expire Subscriptions Function ==="
curl -X POST \
    "$BASE_URL/expire-subscriptions" \
    -H "$AUTH_HEADER" \
    -H "$CONTENT_TYPE" \
    -d '{}'

echo -e "\n\n=== Bulk Test Complete ==="