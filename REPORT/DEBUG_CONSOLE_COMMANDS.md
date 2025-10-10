# Browser Console Debug Commands

These debug tools are available in your browser console for testing and debugging.

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

## 🔍 Example Debugging Session

```javascript
// 1. Open console and run full check
> window.debug.checkAll()

// Console output will show:
// 1️⃣ IDLE STATE: { isPWA: true, platform: "iOS", ... }
// 2️⃣ SESSION: { valid: true, timeRemaining: "23h 45m", ... }
// 3️⃣ WEBSOCKET: { connectionState: "connected", ... }
// 4️⃣ PRO STATUS: { isPro: true, ... }
// 5️⃣ CACHE INFO: { localStorage: {...}, ... }

// 2. If messages not updating, test idle wake
> window.debug.forceIdleWake()
// ✅ Event dispatched - check Chat component for reload

// 3. If session expired, refresh it
> window.debug.refreshSession()
// ✅ Session refreshed successfully
```

---

## 💡 Tips

1. **Regular Monitoring**: Run `window.debug.checkAll()` periodically to monitor system health

2. **PWA Testing**: Use `window.debug.forceIdleWake()` to test idle-wake without waiting

3. **Session Issues**: Always check session first with `window.debug.checkSession()`

4. **Cache Issues**: Check cache size/keys before clearing with `window.debug.checkCache()`

5. **WebSocket Issues**: Use `window.debug.testRealtime()` to verify connection

---

## 🐛 Reporting Bugs

When reporting bugs, include output from:
```javascript
window.debug.checkAll()
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

- Implementation: `/src/utils/debugTools.ts`
- Initialization: `/src/App.tsx`
- Similar tools: `window.testUpdateToast()` in UpdateToast.tsx
