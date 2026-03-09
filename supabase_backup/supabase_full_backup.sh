#!/bin/bash

# Supabase Full Backup Script
# This script creates a complete backup of your Supabase database

# Configuration
SUPABASE_URL="https://nlrgdhpmsittuwiiindq.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQwOTQ1NCwiZXhwIjoyMDY5OTg1NDU0fQ.zA37zRBUtN4Wx64QuE1CTlWiHzphbe6BCRRz-EtWHsE"
DB_PASSWORD="Ns8H1SdrpepWWWeE"
DB_CONNECTION="postgresql://postgres:${DB_PASSWORD}@db.nlrgdhpmsittuwiiindq.supabase.co:5432/postgres"

# Create backup directory with timestamp
BACKUP_DIR="supabase_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "🚀 Starting Supabase Full Backup..."
echo "📁 Backup directory: $BACKUP_DIR"

# 1. Database Schema and Data Backup using pg_dump
echo "💾 Creating database dump..."
pg_dump "$DB_CONNECTION" \
  --verbose \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --format=custom \
  --file="$BACKUP_DIR/database_complete.dump"

# 2. Schema-only backup (for reference)
echo "📋 Creating schema-only backup..."
pg_dump "$DB_CONNECTION" \
  --schema-only \
  --verbose \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --file="$BACKUP_DIR/schema_only.sql"

# 3. Data-only backup
echo "📊 Creating data-only backup..."
pg_dump "$DB_CONNECTION" \
  --data-only \
  --verbose \
  --no-owner \
  --no-privileges \
  --file="$BACKUP_DIR/data_only.sql"

# 4. Individual table backups (critical tables)
echo "🗂️ Creating individual table backups..."
TABLES=("profiles" "chat_messages" "pro_subscriptions" "payment_transactions" "reflections" "user_activities" "xp_transactions" "notification_settings" "subscription_plans" "admin_roles")

for table in "${TABLES[@]}"; do
  echo "📄 Backing up table: $table"
  pg_dump "$DB_CONNECTION" \
    --table="$table" \
    --data-only \
    --verbose \
    --file="$BACKUP_DIR/table_${table}.sql"
done

# 5. Storage buckets backup (if you have file uploads)
echo "🗄️ Creating storage buckets list..."
curl -X GET \
  "$SUPABASE_URL/storage/v1/bucket" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  > "$BACKUP_DIR/storage_buckets.json"

# 6. Auth users backup
echo "👥 Creating auth users backup..."
curl -X GET \
  "$SUPABASE_URL/auth/v1/admin/users" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  > "$BACKUP_DIR/auth_users.json"

# 7. Edge Functions backup (create functions list)
echo "⚡ Creating edge functions list..."
curl -X GET \
  "$SUPABASE_URL/functions/v1/" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  > "$BACKUP_DIR/edge_functions.json" 2>/dev/null || echo "No edge functions or access denied"

# 8. RLS Policies backup
echo "🔒 Creating RLS policies backup..."
pg_dump "$DB_CONNECTION" \
  --schema-only \
  --verbose \
  | grep -A 5 -B 5 "POLICY\|ROW LEVEL SECURITY" \
  > "$BACKUP_DIR/rls_policies.sql"

# 9. Create restore instructions
echo "📖 Creating restore instructions..."
cat > "$BACKUP_DIR/RESTORE_INSTRUCTIONS.md" << 'EOF'
# Supabase Backup Restore Instructions

## Files in this backup:

1. **database_complete.dump** - Complete database backup (schema + data)
2. **schema_only.sql** - Database schema only
3. **data_only.sql** - All data without schema
4. **table_*.sql** - Individual table data backups
5. **storage_buckets.json** - Storage bucket configuration
6. **auth_users.json** - Auth users data
7. **edge_functions.json** - Edge functions list
8. **rls_policies.sql** - Row Level Security policies

## How to Restore:

### Complete Database Restore:
```bash
# Restore complete database (WARNING: This will overwrite existing data)
pg_restore --clean --if-exists --no-owner --no-privileges \
  -d "postgresql://postgres:PASSWORD@HOST:5432/postgres" \
  database_complete.dump
```

### Schema-only Restore:
```bash
psql "postgresql://postgres:PASSWORD@HOST:5432/postgres" < schema_only.sql
```

### Data-only Restore:
```bash
psql "postgresql://postgres:PASSWORD@HOST:5432/postgres" < data_only.sql
```

### Individual Table Restore:
```bash
psql "postgresql://postgres:PASSWORD@HOST:5432/postgres" < table_profiles.sql
```

### RLS Policies Restore:
```bash
psql "postgresql://postgres:PASSWORD@HOST:5432/postgres" < rls_policies.sql
```

## Notes:
- Replace PASSWORD and HOST with your target database credentials
- Test restore on a staging environment first
- Some auth data may need manual recreation due to security restrictions
- Storage files are not included in this backup (only bucket configuration)
EOF

# 10. Create backup info file
echo "ℹ️ Creating backup information..."
cat > "$BACKUP_DIR/backup_info.txt" << EOF
Supabase Backup Information
==========================

Backup Date: $(date)
Source Database: db.nlrgdhpmsittuwiiindq.supabase.co
Supabase URL: $SUPABASE_URL
Backup Method: pg_dump + API calls

Files Created:
- database_complete.dump ($(du -h "$BACKUP_DIR/database_complete.dump" 2>/dev/null | cut -f1 || echo "N/A"))
- schema_only.sql ($(du -h "$BACKUP_DIR/schema_only.sql" 2>/dev/null | cut -f1 || echo "N/A"))
- data_only.sql ($(du -h "$BACKUP_DIR/data_only.sql" 2>/dev/null | cut -f1 || echo "N/A"))
- Individual table backups
- API data exports

Total Backup Size: $(du -sh "$BACKUP_DIR" | cut -f1)
EOF

# 11. Compress backup
echo "📦 Compressing backup..."
tar -czf "${BACKUP_DIR}.tar.gz" "$BACKUP_DIR"
COMPRESSED_SIZE=$(du -sh "${BACKUP_DIR}.tar.gz" | cut -f1)

echo "✅ Backup completed successfully!"
echo "📁 Backup location: ${BACKUP_DIR}.tar.gz"
echo "📊 Compressed size: $COMPRESSED_SIZE"
echo ""
echo "🔧 To restore, extract the archive and follow RESTORE_INSTRUCTIONS.md"
echo ""
echo "⚠️  Important:"
echo "   - Store this backup securely"
echo "   - Test restore process on staging environment"
echo "   - Keep multiple backup versions"
echo "   - Storage files need separate backup if you have uploads"