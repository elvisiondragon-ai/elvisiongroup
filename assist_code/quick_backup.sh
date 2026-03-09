#!/bin/bash

# Quick Supabase Backup - Essential Data Only
# For faster daily backups

DB_PASSWORD="Ns8H1SdrpepWWWeE"
DB_CONNECTION="postgresql://postgres:${DB_PASSWORD}@db.nlrgdhpmsittuwiiindq.supabase.co:5432/postgres"

BACKUP_DIR="quick_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "⚡ Quick Supabase Backup..."

# Essential tables only
ESSENTIAL_TABLES=("profiles" "chat_messages" "pro_subscriptions" "payment_transactions" "reflections")

for table in "${ESSENTIAL_TABLES[@]}"; do
  echo "📄 Backing up $table..."
  pg_dump "$DB_CONNECTION" \
    --table="$table" \
    --data-only \
    --file="$BACKUP_DIR/${table}.sql"
done

# Auth users
echo "👥 Backing up auth users..."
curl -X GET \
  "https://nlrgdhpmsittuwiiindq.supabase.co/auth/v1/admin/users" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQwOTQ1NCwiZXhwIjoyMDY5OTg1NDU0fQ.zA37zRBUtN4Wx64QuE1CTlWiHzphbe6BCRRz-EtWHsE" \
  > "$BACKUP_DIR/auth_users.json"

# Compress
tar -czf "${BACKUP_DIR}.tar.gz" "$BACKUP_DIR"
rm -rf "$BACKUP_DIR"

echo "✅ Quick backup: ${BACKUP_DIR}.tar.gz"