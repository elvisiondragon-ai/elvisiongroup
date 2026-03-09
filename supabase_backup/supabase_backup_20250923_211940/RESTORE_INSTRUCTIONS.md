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
