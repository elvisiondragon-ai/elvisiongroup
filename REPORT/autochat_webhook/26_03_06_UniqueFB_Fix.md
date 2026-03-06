# Unique Facebook Account Fix
**Date:** 2026-03-06
**Timestamp:** 20:06:00+07:00

## Root Problem Analysis
1. **Unconstrained Facebook Links:** Users could potentially link the same Facebook access token (`meta_page_id`) to different Supabase accounts (`user_email`), leading to confusing routing when the webhook processes events for that Page ID. 
2. **Requirement:** Ensure 1 Facebook Page ID is explicitly tied to 1 User Email.

## Solutions Implemented

### 1. Database Constraint (Postgres Trigger)
- Wrote `016_unique_meta_page_id.sql`.
- Added a `BEFORE INSERT OR UPDATE` trigger on the `autochat_clients` table.
- The trigger function `check_unique_meta_page_id` looks up `auth.users` for any existing row using the same `meta_page_id` but a different `user_id`.
- If an existing record is found, it raises an exception: `'akun sudah digunakan di % silahkan logout dan gunakan email tersebut'` where `%` is the existing email.
- This exception is designed to bubble up seamlessly to the frontend to trigger a toast error message for the user.

## Status 
- The SQL Script is written. 
- Awaiting Database password to apply the constraint directly, as local `supabase db push` has unsynchronized migration tracking preventing automated push.
