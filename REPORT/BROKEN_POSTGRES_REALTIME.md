# 🚨 BROKEN: Supabase postgres_changes Realtime Events

## Summary
**postgres_changes realtime events are NOT working** in this Supabase project. The listeners are registered correctly, channel connects successfully, but **callbacks never fire**.

## Issue Date
October 18, 2025

## Symptoms
- ❌ `postgres_changes` events never fire (INSERT, UPDATE, DELETE)
- ✅ Broadcast events work perfectly
- ✅ Channel subscription succeeds (status: SUBSCRIBED)
- ✅ Manual database queries work
- ❌ Console log `💖 Realtime message received:` NEVER appears

## What Works
- ✅ Channel connects: `✈️✈️ CHAT RT SUKSES Connected`
- ✅ Broadcast: `🧊 Message broadcasted`
- ✅ Manual UI sends work (via broadcast)
- ✅ Database inserts via SQL work
- ✅ Database inserts via client work

## What Doesn't Work
- ❌ postgres_changes INSERT events
- ❌ postgres_changes UPDATE events
- ❌ postgres_changes DELETE events
- ❌ SQL inserts don't appear in UI until refresh

## Configuration Verified ✅

### 1. Publication
```sql
SELECT * FROM pg_publication_tables
WHERE pubname = 'supabase_realtime' AND tablename = 'chat_messages';
```
**Result:** ✅ Table is in publication

### 2. Replica Identity
```sql
SELECT c.relname, c.relreplident
FROM pg_class c
WHERE c.relname = 'chat_messages';
```
**Result:** ✅ FULL (code: 'f')

### 3. RLS Policies
```sql
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'chat_messages';
```
**Result:** ✅ Clean policies exist:
- `chat_select` - SELECT for all (authenticated, anon)
- `chat_insert` - INSERT for authenticated
- `chat_delete` - DELETE for own messages + admin

### 4. Realtime Enabled
- ✅ Supabase Dashboard → Database → Tables → chat_messages → Realtime: **ENABLED**
- ✅ Project Settings → API → Realtime: **ENABLED**

## Code Verified ✅

### Listener Registration
```javascript
// AuthContext.tsx line 227-236
channel.on(
  'postgres_changes',
  {
    event: 'INSERT',
    schema: 'public',
    table: 'chat_messages',
    filter: 'channel_id=eq.community'
  },
  async (payload) => {
    console.log('💖 Realtime message received:', payload.new); // NEVER FIRES
  }
);
```

### Tests Performed

#### Test 1: Specific INSERT listener
```javascript
channel.on('postgres_changes', {
  event: 'INSERT',
  schema: 'public',
  table: 'chat_messages',
  filter: 'channel_id=eq.community'
}, callback);
```
**Result:** ❌ Never fires

#### Test 2: Wildcard listener (all events)
```javascript
channel.on('postgres_changes', {
  event: '*',
  schema: 'public',
  table: 'chat_messages'
}, callback);
```
**Result:** ❌ Never fires

#### Test 3: No filter
```javascript
channel.on('postgres_changes', {
  event: 'INSERT',
  schema: 'public',
  table: 'chat_messages'
}, callback);
```
**Result:** ❌ Never fires

#### Test 4: Different table
Created `test_realtime` table with identical configuration.
**Result:** ❌ Never fires

#### Test 5: Insert methods tested
- Via Supabase SQL Editor (service role)
- Via authenticated client (`supabase.from().insert()`)
- Via browser console with client
**Result:** ❌ None trigger postgres_changes events

## Console Logs Evidence

### Successful Channel Setup
```
🔧 Rebuilding chat channel - Reason: auth state change | Token changed: true
🔑 WebSocket Auth token updated
💔 WebSocket Auth propagation: Waiting 500ms...
🔧 Channel recreated with new auth
✈️✈️ CHAT RT SUKSES Connected
✅ Channel rebuild completed successfully
```

### Successful Broadcast
```
Message sent successfully
🧊 Message broadcasted: 5a22760e-3282-4654-bfd5-143889e00cbf
```

### Missing postgres_changes
```
💖 Realtime message received: <-- NEVER APPEARS
🔥🔥 ANY postgres_changes event received: <-- NEVER APPEARS
🧪 TEST TABLE event: <-- NEVER APPEARS
```

## Supabase Support Query

Sent to Supabase AI on October 18, 2025:

> postgres_changes events not firing - realtime completely broken
>
> My Supabase Realtime postgres_changes listeners are not receiving ANY events, even though:
> - Table is in supabase_realtime publication ✅
> - Replica identity is FULL ✅
> - RLS policies allow SELECT ✅
> - Channel connects successfully ✅
> - Broadcast events work ✅
> - postgres_changes NEVER fires ❌

**Response:** Supabase recommends using **Broadcast with database triggers** instead of postgres_changes.

## Current Workaround

**NONE** - postgres_changes is completely non-functional.

### Attempted Workaround (Failed)
Tried implementing database trigger to broadcast changes:
```sql
CREATE TRIGGER chat_broadcast_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.chat_messages
FOR EACH ROW EXECUTE FUNCTION broadcast_chat_changes();
```
**Result:** ❌ Also doesn't work

## Impact

### High Priority Issues
1. **SQL inserts don't appear in UI** - When inserting messages via SQL (for testing, admin tools, etc.), they don't show until page refresh
2. **No database-level realtime** - Only client-side broadcasts work, not database changes
3. **Inconsistent state** - Database and UI can be out of sync

### What Still Works
- User sending messages via UI (uses broadcast, not postgres_changes)
- Manual page refresh
- Delete button for admins ✅ (just implemented)

## Conclusion

**postgres_changes is fundamentally broken in this Supabase project.**

### Evidence
- ✅ All configuration correct (publication, RLS, replica identity)
- ✅ Channel connects successfully
- ✅ Broadcast works
- ❌ postgres_changes callbacks NEVER execute
- ❌ Tested on multiple tables, multiple event types, multiple insert methods
- ❌ Even wildcard listeners (`event: '*'`) don't fire

### Root Cause
**Unknown** - Likely server-side Supabase issue. postgres_changes may be:
1. Disabled for this project
2. Misconfigured at infrastructure level
3. Broken in current Supabase version
4. Blocked by some hidden configuration

### Recommendation
**Contact Supabase Support** - This appears to be a Supabase infrastructure issue, not a code issue.

## Files Modified During Investigation

### Reverted (no changes kept)
- `src/contexts/AuthContext.tsx` - Added test listeners, all reverted
- `src/pages/Chat.tsx` - Tested various approaches, reverted

### Final Changes (kept)
- `src/pages/Chat.tsx:710-748` - Admin delete functionality ✅

### SQL Scripts Created
- `assist_code/fix_chat_realtime.sql` - Diagnostic queries
- `assist_code/check_replica_identity.sql` - Replica identity check
- `assist_code/chat_broadcast_trigger.sql` - Failed trigger workaround
- `assist_code/remove_broadcast_trigger.sql` - Cleanup script

## Next Steps

1. **Contact Supabase Support** with this report
2. **Wait for fix** or migrate to broadcast-only approach
3. **Document workaround** if Supabase provides one

---

**Report Generated:** October 18, 2025
**Issue Status:** UNRESOLVED
**Priority:** HIGH (impacts real-time functionality)
