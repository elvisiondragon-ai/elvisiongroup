# Browser Console Debug Commands & Refresh-Redirect Guide

This document contains debug tools available in your browser console and detailed documentation about the refresh-redirect mechanism.

---

## Table of Contents
1. [Quick Debug Commands](#-quick-start)
2. [Refresh-Redirect Mechanism](#refresh-redirect-mechanism)
3. [Testing in Console](#testing-in-browser-console)
4. [Debugging Steps](#debugging-steps)
5. [Common Issues](#common-issues)

---

## 🚀 Quick Start

Open your browser console (F12 or Cmd+Option+J on Mac) and type:

```javascript
window.debug.help()
```

## 📋 Available Commands

### System Checks

#### 1. Check Idle State
```javascript
window.debug.checkIdle()
```
**Returns:**
- Platform (iOS/Android/Browser)
- PWA status
- Document visibility
- Last active time
- Idle flags

**Example Output:**
```
{
  isPWA: true,
  platform: "iOS",
  documentHidden: false,
  visibilityState: "visible",
  lastActive: "2024-01-20T10:30:00",
  idleFlags: { wasIdle: false, ... }
}
```

---

#### 2. Check Session Validity
```javascript
window.debug.checkSession()
```
**Returns:**
- User ID
- Display Name (privacy-safe)
- Session expiry time
- Time remaining
- Token status

**Example Output:**
```
✅ Session Valid
{
  valid: true,
  userId: "abc123...",
  displayName: "John Doe",
  expiresAt: "2024-01-21T10:30:00",
  timeRemaining: "23h 45m",
  isExpired: false
}
```

---

#### 3. Check WebSocket Status
```javascript
window.debug.checkWebSocket()
```
**Returns:**
- Connection state
- Active channels
- Channel details

**Example Output:**
```
🔌 WebSocket Status:
Connection State: connected
Active Channels: 1
{
  topic: "chat-community",
  state: "joined",
  joinRef: 1
}
```

---

#### 4. Check Pro Status
```javascript
window.debug.checkProStatus()
```
**Returns:**
- Pro subscription status
- Subscription type
- Expiry date
- Days remaining

**Example Output:**
```
⭐ PRO User
{
  isPro: true,
  subscriptionType: "monthly",
  status: "active",
  expiresAt: "2024-02-20",
  daysRemaining: 30
}
```

---

#### 5. Check Cache Status
```javascript
window.debug.checkCache()
```
**Returns:**
- Service Worker caches
- LocalStorage info
- SessionStorage info
- Cache sizes

**Example Output:**
```
💾 Cache Status:
localStorage: { keys: 45, sizeKB: 256, authKeys: 5, audioKeys: 10 }
sessionStorage: { keys: 3, sizeKB: 12 }
SW Caches: ["workbox-precache-v2", "images-cache", ...]
```

---

#### 6. Check All Systems
```javascript
window.debug.checkAll()
```
Runs all checks above and returns comprehensive system status.

---

### Actions

#### 7. Force Idle-Wake Event
```javascript
window.debug.forceIdleWake()
```
Manually triggers the idle-wake event to test PWA message reload.

**Use Case:** Test if messages reload when PWA comes back from background

---

#### 8. Refresh Session
```javascript
window.debug.refreshSession()
```
Manually refresh the authentication session.

**Use Case:** Test session refresh without reloading page

---

#### 9. Test Realtime Connection
```javascript
window.debug.testRealtime()
```
Tests WebSocket/Realtime connection by creating a test channel.

**Use Case:** Verify realtime is working correctly

---

#### 10. Clear All Cache ⚠️ DANGEROUS
```javascript
window.debug.clearAllCache()
```
**WARNING:** This will:
- Clear all Service Worker caches
- Clear localStorage
- Clear sessionStorage
- Log you out
- Reload the page

**Use Case:** Complete reset when debugging cache issues

---

## 📊 Common Debugging Scenarios

### Scenario 1: Messages Not Updating in PWA
```javascript
// 1. Check if user is idle
window.debug.checkIdle()

// 2. Check WebSocket status
window.debug.checkWebSocket()

// 3. Force idle-wake event
window.debug.forceIdleWake()
```

---

### Scenario 2: Session/Login Issues
```javascript
// 1. Check session validity
window.debug.checkSession()

// 2. Try refreshing session
window.debug.refreshSession()

// 3. If still failing, check all systems
window.debug.checkAll()
```

---

### Scenario 3: Pro Status Not Showing
```javascript
// 1. Check pro status
window.debug.checkProStatus()

// 2. Check cache (might be stale)
window.debug.checkCache()

// 3. Clear cache if needed (⚠️ will logout)
window.debug.clearAllCache()
```

---

### Scenario 4: WebSocket/Realtime Issues
```javascript
// 1. Check connection status
window.debug.checkWebSocket()

// 2. Test connection
window.debug.testRealtime()

// 3. Check session (realtime needs valid session)
window.debug.checkSession()
```

---

### Scenario 5: Complete System Check
```javascript
// Run comprehensive check
window.debug.checkAll()
```

---

# Refresh-Redirect Mechanism

## Overview
This section explains the refresh-redirect mechanism used to return users to the Chat tab after a page reload, and provides debugging steps for troubleshooting issues.

---

## How It Works

### The Flow
```
1. User is in Chat tab
   ↓
2. Error/Timeout occurs in Chat.tsx
   ↓
3. Code runs:
   localStorage.setItem('refresh-redirect-to-chat', 'true')
   window.location.reload()
   ↓
4. App restarts from Index.tsx (root component)
   ↓
5. Index.tsx checks: "Is there a flag?"
   if (localStorage.getItem('refresh-redirect-to-chat') === 'true') {
     setActiveTab('chat')  // Navigate to chat
   }
   ↓
6. User sees Chat.tsx again
```

### Why This Pattern Exists
- `reload()` clears memory → fixes stuck state
- But `reload()` loses your tab position
- So we use `localStorage` flag → Index.tsx restores your tab after reload

---

## Code Implementation

### 1. Setting the Flag (Chat.tsx)

#### Timeout Mechanism (4 seconds)
**Location:** `/src/pages/Chat.tsx:457-468`

```javascript
// 4000ms (4 second) timeout mechanism for chat loading
useEffect(() => {
  const loadingTimeout = setTimeout(() => {
    if (isLoading) {
      console.log('⏱️ Chat loading timeout triggered (4 seconds), forcing refresh and return to chat...');
      localStorage.setItem('refresh-redirect-to-chat', 'true');
      window.location.reload();
    }
  }, 4000);

  return () => clearTimeout(loadingTimeout);
}, [isLoading]);
```

#### Auth Error Handler
**Location:** `/src/pages/Chat.tsx:786-816`

```javascript
catch (err) {
  console.error('Unexpected error sending message:', err);

  // Check if it's likely an auth error
  const isAuthError = !user || !userProfile || err.message?.includes('auth') || err.message?.includes('user');

  if (isAuthError) {
    console.log('🔄 Auth error detected, triggering auto-refresh to chat...');
    toast({
      title: "🔄 Auth Error - Auto Refreshing",
      description: "Refreshing to reload your session...",
      variant: "default"
    });

    // Set flag to return to chat after refresh
    localStorage.setItem('refresh-redirect-to-chat', 'true');

    // Small delay then refresh
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}
```

### 2. Reading the Flag (Index.tsx)

**Location:** `/src/pages/Index.tsx:55-81`

```javascript
// Handle signup redirect → force refresh → welcome toast pattern
useEffect(() => {
  console.log('🔍 Index.tsx useEffect running...');
  console.log('🔍 refresh-redirect-to-chat flag:', localStorage.getItem('refresh-redirect-to-chat'));

  // Check for signup welcome flag and force refresh
  if (localStorage.getItem('signup-welcome-pending') === 'true') {
    // Set flag to show welcome toast after refresh
    localStorage.setItem('post-signup-welcome', 'true');
    // Clear the original flag
    localStorage.removeItem('signup-welcome-pending');
    // Force refresh
    window.location.reload();
    return;
  }

  // Check if we need to redirect to chat after refresh button
  if (localStorage.getItem('refresh-redirect-to-chat') === 'true') {
    console.log('✅ Chat redirect flag detected! Navigating to chat...');
    localStorage.removeItem('refresh-redirect-to-chat');
    setActiveTab('chat');
    return;
  } else {
    console.log('❌ No chat redirect flag found');
  }

  // ... other redirect checks
}, [toast]);
```

---

## Testing in Browser Console

### Open Browser Console
- **Chrome/Edge**: `F12` or `Ctrl+Shift+J` (Windows) / `Cmd+Option+J` (Mac)
- **Firefox**: `F12` or `Ctrl+Shift+K`

### Test Commands

#### 1. Basic Test (One-Liner)
```javascript
localStorage.setItem('refresh-redirect-to-chat', 'true'); window.location.reload();
```

**Expected Result:**
- Page refreshes
- Returns to Chat tab automatically

#### 2. Step-by-Step Test
```javascript
// Step 1: Set the flag
localStorage.setItem('refresh-redirect-to-chat', 'true');

// Step 2: Verify flag is set
console.log('Flag:', localStorage.getItem('refresh-redirect-to-chat'));

// Step 3: Refresh
window.location.reload();
```

#### 3. Check Flag Status
```javascript
// Check if flag is currently set
console.log(localStorage.getItem('refresh-redirect-to-chat'));
// Returns: "true" if set, null if not
```

#### 4. View All LocalStorage Items
```javascript
// See ALL localStorage items
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(key, '=', localStorage.getItem(key));
}
```

#### 5. Clear Flag Manually
```javascript
localStorage.removeItem('refresh-redirect-to-chat');
```

### Other Redirect Flags

```javascript
// Go to payment after refresh
localStorage.setItem('refresh-redirect-to-payment', 'true'); window.location.reload();

// Go to profile after refresh
localStorage.setItem('refresh-redirect-to-profile', 'true'); window.location.reload();

// Go to home after refresh
localStorage.setItem('refresh-redirect-to-home', 'true'); window.location.reload();

// Go to journal after refresh
localStorage.setItem('refresh-redirect-to-journal', 'true'); window.location.reload();

// Go to elite-habit after refresh
localStorage.setItem('refresh-redirect-to-elite-habit', 'true'); window.location.reload();

// Go to meditation after refresh
localStorage.setItem('refresh-redirect-to-meditation', 'true'); window.location.reload();

// Go to audio after refresh
localStorage.setItem('refresh-redirect-to-audio', 'true'); window.location.reload();
```

---

## Debugging Steps

### If Redirect Not Working

#### Step 1: Check Console Logs
After reload, you should see:
```
🔍 Index.tsx useEffect running...
🔍 refresh-redirect-to-chat flag: true
✅ Chat redirect flag detected! Navigating to chat...
```

If you see:
```
🔍 Index.tsx useEffect running...
🔍 refresh-redirect-to-chat flag: null
❌ No chat redirect flag found
```
→ **Problem:** Flag is not persisting across reload

#### Step 2: Verify Flag Persistence
```javascript
// Set flag
localStorage.setItem('refresh-redirect-to-chat', 'true');

// Check immediately
console.log('Immediately:', localStorage.getItem('refresh-redirect-to-chat'));

// Refresh, then check again in console
console.log('After reload:', localStorage.getItem('refresh-redirect-to-chat'));
```

If flag is null after reload → **Browser's localStorage is disabled or cleared**

#### Step 3: Check for Conflicts
```javascript
// Check if another script is clearing localStorage
window.addEventListener('storage', (e) => {
  console.log('🔔 Storage event:', e.key, e.oldValue, '→', e.newValue);
});
```

#### Step 4: Verify Index.tsx useEffect is Running
```javascript
// In Index.tsx, the useEffect should run on mount
// Look for the debug logs we added:
// "🔍 Index.tsx useEffect running..."
```

If you don't see this log → useEffect is not running (React/build issue)

---

## Common Issues

### Issue 1: Works Locally But Not in Production

**Cause:** Service Worker / PWA cache serving old code

**Solution:**
```javascript
// Run in production console
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
    console.log('✅ Service worker unregistered:', registration);
  }
});

// Clear all caches
caches.keys().then(function(names) {
  for (let name of names) {
    caches.delete(name);
    console.log('✅ Cache deleted:', name);
  }
});

// Hard refresh after 2 seconds
setTimeout(() => {
  window.location.reload();
}, 2000);
```

**Then:**
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Test again

### Issue 2: Flag Clears Before Index.tsx Reads It

**Cause:** Another script clearing localStorage on load

**Debug:**
```javascript
// Add this at the TOP of Index.tsx
console.log('🚀 App starting, flag status:', localStorage.getItem('refresh-redirect-to-chat'));
```

### Issue 3: Returns to Home Instead of Chat

**Possible Causes:**
1. Flag was cleared by another redirect check (they run in order)
2. Flag never persisted
3. Index.tsx useEffect not running

**Check Order in Index.tsx:**
```javascript
// Check runs in this order:
1. signup-welcome-pending  (if true, returns early)
2. refresh-redirect-to-chat  (if true, returns early)
3. refresh-redirect-to-payment
4. refresh-redirect-to-journal
// ... etc
```

If an earlier check returns, later checks won't run.

### Issue 4: Mobile PWA Not Updating

**Solution:**
1. Uninstall PWA from home screen
2. Clear browser data for the site
3. Redeploy with new code
4. Wait 5-10 minutes for CDN
5. Reinstall PWA

---

## Production vs Local Differences

| Aspect | Local Development | Production |
|--------|------------------|------------|
| **Code Updates** | Immediate (HMR) | Requires build + deploy |
| **Service Worker** | May not be active | Always active in PWA |
| **Cache** | Less aggressive | Very aggressive |
| **CDN** | None | May cache for 5-10 mins |
| **Testing** | Easy to test | Need cache clearing |

### Production Deployment Checklist

When deploying code with localStorage changes:

1. ✅ Build locally: `npm run build`
2. ✅ Commit and push to git
3. ✅ Deploy to production
4. ✅ Wait 5-10 minutes for CDN
5. ✅ Clear service workers on production site
6. ✅ Hard refresh browser
7. ✅ Test the localStorage flag mechanism
8. ✅ Verify console logs show correct flow

---

## App Architecture

### Single Page Application (SPA)
This app uses **client-side routing** (state-based), not server-side routing.

#### What Exists:
```
/           ← Only ONE real page (Index.tsx)
```

#### What Doesn't Exist:
```
/chat       ← Not a real page (just a state)
/home       ← Not a real page (just a state)
/profile    ← Not a real page (just a state)
```

#### How Navigation Works:
```javascript
// Index.tsx renders different components based on activeTab state
const renderContent = () => {
  switch (activeTab) {
    case "home":
      return <Home />;
    case "chat":
      return <Chat />;      // Not a real page, just a component!
    case "profile":
      return <Profile />;
    default:
      return <Home />;
  }
};
```

### Navigation Methods

| Method | When to Use | Example |
|--------|-------------|---------|
| `setActiveTab('chat')` | ✅ Normal navigation | Switch tabs without refresh |
| `localStorage + reload()` | ✅ Need to clear state | Fix stuck/cached data |
| `window.location.href = '/chat'` | ❌ NEVER | Doesn't exist, gives 404 |
| `window.history.back()` | ❌ Don't use | No browser history in SPA |

---

## Understanding window.location.reload()

### What It Does:
```javascript
window.location.reload();  // ♻️ Reloads/Restarts the ENTIRE app
```

**NOT** "go back to a page" - it **refreshes the current page**

### Comparison:

| Action | What it does |
|--------|-------------|
| `window.history.back()` | ⬅️ Go BACK to previous page |
| `window.location.href = '/chat'` | 🔗 Navigate TO a URL |
| `window.location.reload()` | ♻️ REFRESH current page/app |

### Why reload() + localStorage Pattern:

```
Problem: App has stuck/stale state
Solution: Reload to clear memory
But: Reload loses the user's tab position
Fix: Save tab to localStorage before reload
Result: Index.tsx restores tab after reload
```

---

## Cache System in Chat.tsx

Chat.tsx has multiple cache layers:

### 1. chatProBadgeCache (Lines 104-116)
- **Persisted** to localStorage as `'chat-pro-badge-cache'`
- Stores current user's badge data
- Includes timestamp

### 2. userBadgeCache (Lines 119-127)
- **In-memory only** (not persisted)
- For optimistic UI consistency

### 3. User Data Cache (Per-user, 24hr TTL)
- **Key:** `user-data-${userId}`
- **TTL:** 24 hours
- Stores profile + subscription data

### 4. Messages Cache (Removed)
- Previously cached messages
- Now using network-first strategy

### Current Loading Strategy:
**Network-first** - No message cache on open, always load fresh data

---

## Timeout Mechanism

### Current Timeout: 4 Seconds

If Chat.tsx is still loading after 4 seconds:
```javascript
1. Console logs: "⏱️ Chat loading timeout triggered (4 seconds)..."
2. Sets flag: localStorage.setItem('refresh-redirect-to-chat', 'true')
3. Reloads: window.location.reload()
4. Returns to chat via Index.tsx flag detection
```

### Timeline:
```
0ms    → Chat.tsx mounts
0ms    → isLoading = true
0ms    → Timer starts (4 seconds)
...    → Attempting to load messages
4000ms → If still loading, trigger refresh + redirect
```

---

## Success Indicators

### Console Logs to Look For:

#### On Timeout Trigger:
```
⏱️ Chat loading timeout triggered (4 seconds), forcing refresh and return to chat...
```

#### On Reload (Index.tsx):
```
🔍 Index.tsx useEffect running...
🔍 refresh-redirect-to-chat flag: true
✅ Chat redirect flag detected! Navigating to chat...
```

#### Flag Cleared:
After successful redirect, running this should return `null`:
```javascript
localStorage.getItem('refresh-redirect-to-chat')
// → null (flag was cleared by Index.tsx)
```

---

## 💡 General Tips

1. **Regular Monitoring**: Run `window.debug.checkAll()` periodically to monitor system health

2. **PWA Testing**: Use `window.debug.forceIdleWake()` to test idle-wake without waiting

3. **Session Issues**: Always check session first with `window.debug.checkSession()`

4. **Cache Issues**: Check cache size/keys before clearing with `window.debug.checkCache()`

5. **WebSocket Issues**: Use `window.debug.testRealtime()` to verify connection

6. **Refresh Issues**: Test with `localStorage.setItem('refresh-redirect-to-chat', 'true'); window.location.reload()`

---

## 🐛 Reporting Bugs

When reporting bugs, include output from:
```javascript
window.debug.checkAll()
```

And if related to chat redirect issues, include:
```javascript
localStorage.getItem('refresh-redirect-to-chat')
```

This provides complete system state for debugging.

---

## 📝 Notes

- All commands are safe except `clearAllCache()` which will log you out
- Commands work on all platforms: Browser, iOS PWA, Android PWA
- Output is formatted in console tables for easy reading
- Commands are available immediately when app loads

---

## 🔗 Related Files

- Debug Tools: `/src/utils/Debug.ts` ⭐ (renamed from debugTools.ts)
- App Initialization: `/src/App.tsx`
- Chat Component: `/src/pages/Chat.tsx`
- Index (Router): `/src/pages/Index.tsx`
- Auth Context: `/src/contexts/AuthContext.tsx`
- User Profile Context: `/src/contexts/UserProfileContext.tsx`

---

## Last Updated
2025-10-09

## Status
✅ Working in both local and production environments
✅ 4-second timeout implemented
✅ Debug logs added for troubleshooting
✅ Comprehensive debugging guide complete
