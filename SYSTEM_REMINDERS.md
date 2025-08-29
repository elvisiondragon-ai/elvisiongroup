# SYSTEM REMINDERS & KEY CODE REFERENCES

## 🚨 IMPORTANT: Copy-paste these SQL commands when fixing issues

### FIXING EXP SYSTEM REMINDERS

#### **Problem: XP Limits Not Working**
**SQL Commands to run in Supabase SQL Editor:**

```sql
-- 1. Apply the XP limits migration
-- Copy all content from: supabase/migrations/20250829_audio_xp_limits_sql.sql
-- Paste and run in Supabase SQL Editor

-- 2. Test XP functions
SELECT * FROM award_audio_xp(
    'your-user-uuid-here'::UUID, 
    '{"journalId": 1, "journalTitle": "Guide to Inner Silence", "listeningMinutes": 75}'::jsonb,
    'Completed journal audio listening'
);

-- 3. Check daily limits
SELECT * FROM get_daily_xp_status('your-user-uuid-here'::UUID);
```

**Key Variables:**
- `daily_limit` for audio: `20 XP`
- `daily_limit` for journal typing: `5 XP`
- Journal audio minimum: `60 minutes`
- Journal typing cooldown: `1 hour`

---

#### **Problem: Profile Counters Not Updating**
**SQL Commands:**

```sql
-- Apply profile counters migration
-- Copy all content from: supabase/migrations/20250829_profile_counters_and_badges.sql
-- Paste and run in Supabase SQL Editor

-- Manual counter update
UPDATE profiles 
SET 
    total_journal_sessions = (
        SELECT COUNT(*) FROM xp_transactions 
        WHERE xp_transactions.user_id = profiles.user_id 
        AND (transaction_type = 'journal_completion' OR metadata::jsonb ? 'journalId')
    ),
    total_verses_completed = (
        SELECT COUNT(*) FROM xp_transactions 
        WHERE xp_transactions.user_id = profiles.user_id 
        AND metadata::jsonb ? 'verseId'
    );
```

**Key Variables:**
- `total_journal_sessions`: Counter for journal activities
- `total_verses_completed`: Counter for verse completions
- Badges: `is_week_warrior`, `is_zen_master`

---

#### **Problem: Audio Time Tracking Issues**
**Frontend Code Location:** `src/contexts/AudioContext.tsx`

**Key Variables:**
```typescript
const startTimeRef = useRef<number | null>(null);
const totalPlayTimeRef = useRef<number>(0);
```

**Critical Logic:**
- Start timing: `startTimeRef.current = Date.now();`
- Update total: `totalPlayTimeRef.current += Date.now() - startTimeRef.current;`
- Minimum check: `totalMinutes >= 60` for journal XP

---

#### **Problem: Badge System Not Working**
**SQL Commands:**

```sql
-- Week Warrior Badge (7-day streak)
UPDATE profiles 
SET is_week_warrior = TRUE 
WHERE streak_days >= 7 AND NOT COALESCE(is_week_warrior, FALSE);

-- Zen Master Badge (100 verses)
UPDATE profiles 
SET is_zen_master = TRUE 
WHERE total_verses_completed >= 100 AND NOT COALESCE(is_zen_master, FALSE);

-- Check badge status
SELECT user_id, display_name, streak_days, total_verses_completed, 
       is_week_warrior, is_zen_master 
FROM profiles 
WHERE user_id = 'your-user-uuid-here';
```

**Badge Requirements:**
- **Week Warrior**: 7 consecutive days of activity
- **Zen Master**: 100 completed verses

---

### FIXING API COST ISSUES

#### **Problem: High API Usage**
**Frontend Optimizations:**
1. **Cache HLS streams** - implement caching in audio utils
2. **Reduce database queries** - use React Query/SWR
3. **Batch XP transactions** - combine multiple XP awards

**Code Location:** `src/utils/audioUtils.ts`

---

### FIXING DOWNLOADABLE AUDIO ISSUES

#### **Problem: Audio Download Protection**
**Key Code in AudioContext:**

```typescript
// Enhanced protection
audio.crossOrigin = 'anonymous';
audio.setAttribute('controlsList', 'nodownload noremoteplayback nofullscreen');
audio.setAttribute('disablePictureInPicture', 'true');
audio.style.pointerEvents = 'none';
audio.addEventListener('contextmenu', handleContextMenu);
```

**Method:** Disable right-click, control lists, and picture-in-picture

---

### FIXING NOTIFICATION SYSTEM

#### **Problem: Orphan Audio Notifications**
**Code Location:** `src/contexts/AudioContext.tsx`

**Key Implementation:**
```typescript
const handleVisibilityChange = () => {
  if (document.hidden && currentTrackId && isPlaying) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Audio masih berjalan! 🎵', {
        body: 'Kembali ke aplikasi untuk melanjutkan mendengarkan',
        icon: '/icon-192x192.png'
      });
    }
  }
};
```

---

## 🎯 TESTING COMMANDS

### Local Supabase Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Start local instance
supabase start

# Apply migrations
supabase migration up

# Reset if needed
supabase db reset
```

### Test User Flow
1. **Audio Completion Test:**
   - Play audio for 60+ minutes
   - Check XP awarded (should be 10)
   - Try again same day (should hit 20 XP limit)

2. **Journal Typing Test:**
   - Write journal entry (should get 5 XP)
   - Try again within 1 hour (should be blocked)
   - Try after 1 hour (should work up to 5 XP daily limit)

3. **Badge Test:**
   - Complete 7 days activity → Week Warrior
   - Complete 100 verses → Zen Master

---

## 📊 KEY DATABASE FUNCTIONS

### Essential Functions Created:
1. `award_xp_with_limits()` - Main XP awarding with all limits
2. `award_audio_xp()` - Simplified audio XP
3. `award_journal_typing_xp()` - Journal typing with cooldown
4. `update_user_streak()` - Streak calculation
5. `get_daily_xp_status()` - Check current limits

### Tables Modified:
- `profiles` - Added counters and badge columns
- `xp_transactions` - XP tracking
- Added triggers for automatic counter updates

---

## 🔧 EMERGENCY FIXES

**If XP system breaks completely:**
```sql
-- Reset user XP (use carefully!)
DELETE FROM xp_transactions WHERE user_id = 'user-uuid-here';
UPDATE profiles SET experience_points = 0, level = 1 WHERE user_id = 'user-uuid-here';

-- Fix corrupt data
UPDATE profiles SET 
  total_journal_sessions = COALESCE(total_journal_sessions, 0),
  total_verses_completed = COALESCE(total_verses_completed, 0),
  is_week_warrior = COALESCE(is_week_warrior, FALSE),
  is_zen_master = COALESCE(is_zen_master, FALSE);
```

**If profile counters are wrong:**
```sql
-- Recalculate all counters from xp_transactions
UPDATE profiles SET 
    total_journal_sessions = (
        SELECT COUNT(*) FROM xp_transactions 
        WHERE xp_transactions.user_id = profiles.user_id 
        AND (transaction_type = 'journal_completion' OR metadata::jsonb ? 'journalId')
    ),
    total_verses_completed = (
        SELECT COUNT(*) FROM xp_transactions 
        WHERE xp_transactions.user_id = profiles.user_id 
        AND metadata::jsonb ? 'verseId'
    );
```

---

## 🎨 UI/UX REMINDERS

### Toast Messages:
- **XP Earned**: `+{amount} XP Earned!`
- **Daily Limit**: `🎉 EXP Harian Anda Sudah Maximal!`
- **Hourly Cooldown**: `⏰ Menunggu Waktu Berikutnya`
- **Time Insufficient**: `⏱️ Waktu Mendengarkan Kurang`

### Badge Names:
- Level 3+: "Spirit"
- 7-day streak: "Week Warrior"
- 100 verses: "Zen Master"

---

**📝 Created by Claude Code on 2025-08-29**
**Last Updated: When implementing XP system fixes**