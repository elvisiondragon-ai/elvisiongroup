#!/bin/bash

# Simple database test script
HOST="db.nlrgdhpmsittuwiiindq.supabase.co"
PORT="5432"
DBNAME="postgres"
USERNAME="postgres"
PASSWORD="Ns8H1SdrpepWWWeE"

echo "🧪 Testing Supabase Database Connection"
echo "======================================="

echo "🔍 Testing basic connection..."
if PGPASSWORD="$PASSWORD" psql -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DBNAME" -c "SELECT version();" 2>/dev/null; then
    echo "✅ Connection successful!"
else
    echo "❌ Connection failed!"
    exit 1
fi

echo ""
echo "📊 Testing database content..."
echo "Tables in public schema:"
PGPASSWORD="$PASSWORD" psql -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DBNAME" -c "\dt public.*" 2>/dev/null

echo ""
echo "🔧 Testing functions:"
PGPASSWORD="$PASSWORD" psql -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DBNAME" -c "\df public.*" 2>/dev/null | head -10

echo ""
echo "💾 Testing small dump..."
PGPASSWORD="$PASSWORD" pg_dump -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DBNAME" --schema-only --table=pg_stat_database 2>/dev/null | head -10

echo ""
echo "🎯 If you see content above, the database is working!"