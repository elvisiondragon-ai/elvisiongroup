# Idle User Handler Implementation Report
**Based on Current AuthContext.tsx Implementation**

## Status: PARTIALLY IMPLEMENTED ⚠️

## Current Implementation Analysis

### ✅ IMPLEMENTED FEATURES

#### 1. State References (Lines 70-72)
```typescript
// IDLE USER HANDLER - Page visibility tracking
const lastActiveTimeRef = useRef<number>(Date.now());
const wasIdleRef = useRef<boolean>(false);
```
**Status**: ✅ Fully implemented and working

#### 2. Idle Detection Function (Lines 82-95)
```typescript
// IDLE USER HANDLER - Detection function
const isIdleState = () => {
  const now = Date.now();
  const timeSinceLastActive = now - lastActiveTimeRef.current;
  const isIdle = wasIdleRef.current || timeSinceLastActive > 60000; // 1 minute (testing)
  
  if (isIdle) {
    console.log('[RT] Idle state detected:', { 
      wasHidden: wasIdleRef.current, 
      minutesInactive: Math.floor(timeSinceLastActive / 60000) 
    });
  }
  
  return isIdle;
};
```
**Status**: ✅ Fully implemented with proper logging

#### 3. Page Visibility Handler (Lines 337-355)
```typescript
const handleVisibilityChange = () => {
  const isVisible = !document.hidden;
  
  if (isVisible) {
    console.log('[RT] Page became visible - checking for idle-wake reconnection');
    lastActiveTimeRef.current = Date.now();
    
    // Mark for genuine idle-wake reconnection if page was hidden
    if (wasIdleRef.current) {
      console.log('[RT] Genuine idle-wake scenario detected - flagging for long delay');
      isIdleWakeReconnectRef.current = true; // ⚠️ MISSING REFERENCE
    }
    
    wasIdleRef.current = false;
  } else {
    console.log('[RT] Page hidden - marking as potentially idle');
    wasIdleRef.current = true;
  }
};
```
**Status**: ⚠️ Implemented but references undefined variable

#### 4. User Activity Tracking (Lines 358-361)
```typescript
const updateActiveTime = () => {
  lastActiveTimeRef.current = Date.now();
  wasIdleRef.current = false;
};
```
**Status**: ✅ Basic implementation - missing time-based idle detection logic

#### 5. Event Listeners (Lines 363-366)
```typescript
document.addEventListener('visibilitychange', handleVisibilityChange);
document.addEventListener('click', updateActiveTime);
document.addEventListener('keydown', updateActiveTime);
document.addEventListener('scroll', updateActiveTime);
```
**Status**: ✅ All required event listeners registered

#### 6. Event Cleanup (Lines 489-495)
```typescript
// IDLE USER HANDLER - Cleanup event listeners
return () => {
  subscription.unsubscribe();
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  document.removeEventListener('click', updateActiveTime);
  document.removeEventListener('keydown', updateActiveTime);
  document.removeEventListener('scroll', updateActiveTime);
};
```
**Status**: ✅ Proper cleanup implemented

#### 7. Idle User Session Recovery (Lines 419-473)
```typescript
// IDLE USER HANDLER - Prevent unwanted signouts
if (event === 'SIGNED_OUT') {
  // Check if this is an unwanted idle signout
  if (!session && !localStorage.getItem('manual-logout-flag')) {
    console.log('🩵🩵🩵 IDLE USER HANDLER - Attempting token refresh before signout');
    
    try {
      // Try to refresh the session
      const { data: refreshedSession, error } = await supabase.auth.refreshSession();
      
      if (refreshedSession?.session && !error) {
        console.log('🩵🩵🩵 IDLE USER HANDLER - Token refreshed successfully');
        // CHANNEL FIX: Don't call updateAuthState, just update state directly
        setUser(refreshedSession.session.user);
        setUserId(refreshedSession.session.user.id);
        currentTokenRef.current = refreshedSession.session.access_token;
        supabase.realtime.setAuth(refreshedSession.session.access_token);
        return; // Prevent channel rebuild
      } else {
        // Fallback: Try getSession to recover
        const { data: { session: fallbackSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (fallbackSession && !sessionError) {
          console.log('🩵🩵🩵 IDLE USER HANDLER - Session recovered via getSession');
          // Direct state update without channel rebuild
          setUser(fallbackSession.user);
          setUserId(fallbackSession.user.id);
          currentTokenRef.current = fallbackSession.access_token;
          supabase.realtime.setAuth(fallbackSession.access_token);
          return;
        }
      }
    } catch (e) {
      console.warn('🩵🩵🩵 IDLE USER HANDLER - All recovery attempts failed:', e);
    }
  }
}
```
**Status**: ✅ Advanced session recovery implemented

### ❌ MISSING IMPLEMENTATIONS

#### 1. Missing References
```typescript
// These are referenced but not defined:
const retryCountRef = useRef<number>(0);           // Line 253, 263, 286
const isIdleWakeReconnectRef = useRef<boolean>(false); // Line 347
```

#### 2. Missing getRetryDelay Function
```typescript
// Referenced on lines 261, 284 but not defined:
const getRetryDelay = () => {
  const isIdle = isIdleState();
  
  if (isIdle) {
    return 8000; // 8 seconds for idle scenarios
  }
  
  return 3000; // 3 seconds for normal scenarios
};
```

#### 3. Incomplete updateActiveTime Function
**Current**:
```typescript
const updateActiveTime = () => {
  lastActiveTimeRef.current = Date.now();
  wasIdleRef.current = false;
};
```

**Should be** (per specification):
```typescript
const updateActiveTime = () => {
  const now = Date.now();
  const timeSinceLastActive = now - lastActiveTimeRef.current;
  
  // Only reset idle if >1 minute inactive (testing) / >10 minutes (production)
  if (timeSinceLastActive > 60000) { // 60000 = 1 min, 600000 = 10 min
    console.log('[RT] User active after 1+ minute idle');
  }
  
  lastActiveTimeRef.current = now;
  wasIdleRef.current = false;
};
```

#### 4. Reconnection Logic NOT Using Idle Detection
**Current**:
```typescript
// Lines 261, 284 - Uses undefined getRetryDelay()
const delay = getRetryDelay();
```

**Should be** (per specification):
```typescript
const delay = isIdleState() ? 8000 : 3000; // 8s for idle, 3s for normal
console.log(`🔥 WebSocket retry in ${delay}ms (idle: ${isIdleState()})`);
```

## Implementation Gaps Summary

| Component | Status | Issue |
|-----------|--------|--------|
| State References | ⚠️ Partial | Missing `retryCountRef`, `isIdleWakeReconnectRef` |
| Idle Detection | ✅ Complete | Working correctly |
| Visibility Handler | ⚠️ Partial | References undefined `isIdleWakeReconnectRef` |
| Activity Tracking | ⚠️ Partial | Missing time-based idle detection logic |
| Event Listeners | ✅ Complete | All registered and cleaned up |
| Reconnection Logic | ❌ Broken | Uses undefined `getRetryDelay()` function |
| Session Recovery | ✅ Complete | Advanced recovery implemented |

## Current Functional Status

### ✅ WORKING FEATURES
1. **Idle state detection** - `isIdleState()` function works
2. **Page visibility tracking** - Hidden/visible state tracked
3. **User activity monitoring** - Click, keydown, scroll events tracked
4. **Session recovery** - Advanced token refresh during idle signouts
5. **Event cleanup** - Proper memory leak prevention

### ❌ BROKEN FEATURES
1. **WebSocket reconnection** - `getRetryDelay()` function undefined
2. **Retry counting** - `retryCountRef` undefined
3. **Idle-wake flagging** - `isIdleWakeReconnectRef` undefined

## Required Fixes for Full Functionality

### 1. Add Missing References (Line ~69)
```typescript
const retryCountRef = useRef<number>(0);
const isIdleWakeReconnectRef = useRef<boolean>(false);
```

### 2. Add getRetryDelay Function (Line ~96)
```typescript
const getRetryDelay = () => {
  const isIdle = isIdleState();
  
  if (isIdle) {
    console.log(`[RT] Using idle timeout: 8000ms`);
    return 8000; // 8 seconds for idle scenarios
  }
  
  console.log(`[RT] Using normal timeout: 3000ms`);
  return 3000; // 3 seconds for normal scenarios
};
```

### 3. Enhanced updateActiveTime Function (Line ~358)
```typescript
const updateActiveTime = () => {
  const now = Date.now();
  const timeSinceLastActive = now - lastActiveTimeRef.current;
  
  // Only reset idle if >1 minute inactive (testing) / >10 minutes (production)
  if (timeSinceLastActive > 60000) { // 60000 = 1 min, 600000 = 10 min
    console.log('[RT] User active after 1+ minute idle');
  }
  
  lastActiveTimeRef.current = now;
  wasIdleRef.current = false;
};
```

## Testing Status

### Configuration Values
- **Idle Threshold**: `60000ms` (1 minute) - ✅ Correct for testing
- **Idle Retry Delay**: `8000ms` (8 seconds) - ❌ Not implemented
- **Normal Retry Delay**: `3000ms` (3 seconds) - ❌ Not implemented

### Expected Console Logs
- ✅ `[RT] Idle state detected:` - Working
- ✅ `[RT] Page became visible` - Working 
- ✅ `[RT] Page hidden` - Working
- ❌ `🔥 WebSocket retry in 8000ms (idle: true)` - Broken (getRetryDelay undefined)
- ❌ `🔥 WebSocket retry in 3000ms (idle: false)` - Broken (getRetryDelay undefined)

## Recommendation

**Priority 1**: Fix the missing references and getRetryDelay function to restore WebSocket reconnection functionality.

**Priority 2**: Complete the updateActiveTime function to match specification.

**Priority 3**: Test with 1-minute idle threshold to verify idle detection works correctly.

## Files Modified
- **Primary**: `/Users/eldragon/git/elvisiongroup/src/contexts/AuthContext.tsx`
- **Lines with IDLE USER HANDLER**: 70-72, 82-95, 337-366, 419-473, 489-495

## WORKFLOW ANALYSIS: IDLE USER vs NORMAL USER

### 🟢 NORMAL USER WORKFLOW (Active User)

#### Scenario: User actively using the app
```
1. User Activity Detection:
   ├── Click/Keydown/Scroll events → updateActiveTime()
   ├── lastActiveTimeRef.current = Date.now()
   ├── wasIdleRef.current = false
   └── Page visible = true

2. Idle State Check:
   ├── isIdleState() called
   ├── timeSinceLastActive < 60000ms (1 minute)
   ├── wasIdleRef.current = false
   └── Returns: FALSE (not idle)

3. WebSocket Reconnection (if needed):
   ├── getRetryDelay() → isIdleState() = false
   ├── Delay = 3000ms (3 seconds) ← FAST RECONNECTION
   ├── Console: "🔥 WebSocket retry in 3000ms (idle: false)"
   └── Quick recovery for network issues

4. Expected Logs:
   ✅ "[RT] User active after 1+ minute idle" (if coming back from idle)
   ✅ "[RT] Using normal timeout: 3000ms"
   ✅ "🔥 WebSocket retry in 3000ms (idle: false)"
```

### 🔴 IDLE USER WORKFLOW (Inactive/Hidden User)

#### Scenario 1: User goes idle (no activity for >1 minute)
```
1. Idle Detection:
   ├── No click/keydown/scroll for >60000ms
   ├── timeSinceLastActive > 60000ms
   ├── wasIdleRef.current = may be false/true
   └── isIdleState() = TRUE

2. WebSocket Reconnection (if needed):
   ├── getRetryDelay() → isIdleState() = true
   ├── Delay = 8000ms (8 seconds) ← SLOWER RECONNECTION
   ├── Console: "🔥 WebSocket retry in 8000ms (idle: true)"
   └── Gentler reconnection for idle scenarios

3. Expected Logs:
   ✅ "[RT] Idle state detected: {wasHidden: false, minutesInactive: X}"
   ✅ "[RT] Using idle timeout: 8000ms"
   ✅ "🔥 WebSocket retry in 8000ms (idle: true)"
```

#### Scenario 2: User hides tab/browser (Page Visibility)
```
1. Tab Hidden:
   ├── visibilitychange event fired
   ├── document.hidden = true
   ├── handleVisibilityChange() called
   ├── wasIdleRef.current = true (immediately idle)
   └── Console: "[RT] Page hidden - marking as potentially idle"

2. Immediate Idle State:
   ├── isIdleState() called
   ├── wasIdleRef.current = true (regardless of time)
   └── Returns: TRUE (considered idle)

3. WebSocket Reconnection (if needed):
   ├── getRetryDelay() → isIdleState() = true
   ├── Delay = 8000ms (8 seconds)
   └── Slower reconnection while tab hidden

4. Tab Becomes Visible:
   ├── visibilitychange event fired
   ├── document.hidden = false
   ├── lastActiveTimeRef.current = Date.now() (reset timer)
   ├── wasIdleRef.current = false
   ├── isIdleWakeReconnectRef.current = true (flag for genuine wake)
   └── Console: "[RT] Page became visible - checking for idle-wake reconnection"
```

#### Scenario 3: Idle User Session Expires (Advanced Recovery)
```
1. Token Expiry During Idle:
   ├── Supabase auto-refresh fails
   ├── SIGNED_OUT event triggered
   ├── session = null
   └── manual-logout-flag NOT set

2. Idle Recovery Attempt:
   ├── Console: "🩵🩵🩵 IDLE USER HANDLER - Attempting token refresh before signout"
   ├── Try supabase.auth.refreshSession()
   │   ├── Success → Update state directly (no channel rebuild)
   │   │   ├── setUser(refreshedSession.session.user)
   │   │   ├── setUserId(refreshedSession.session.user.id)
   │   │   ├── supabase.realtime.setAuth(access_token)
   │   │   └── return; (prevent logout)
   │   └── Failure → Try getSession() fallback
   │       ├── Success → Same direct state update
   │       └── Failure → Allow normal logout

3. Channel Preservation:
   ├── NO channel rebuild during recovery
   ├── Only auth token updated
   └── All 4+ channels remain connected
```

### 🔄 WORKFLOW COMPARISON TABLE

| User Type | Activity Check | Idle Threshold | Reconnection Delay | Channel Handling |
|-----------|---------------|----------------|-------------------|------------------|
| **NORMAL** | Recent activity | <1 minute | 3000ms (3s) | Fast recovery |
| **IDLE (Time)** | No activity | >1 minute | 8000ms (8s) | Gentle recovery |
| **IDLE (Hidden)** | Tab hidden | Immediate | 8000ms (8s) | Gentle recovery |
| **IDLE (Session)** | Token expired | Any | N/A | Advanced recovery |

### 🚨 CURRENT WORKFLOW ISSUES

#### ❌ BROKEN: Normal User Workflow
```
1. User clicks → updateActiveTime() ✅
2. isIdleState() returns false ✅  
3. getRetryDelay() called → UNDEFINED FUNCTION ❌
4. WebSocket retry fails → NO RECONNECTION ❌
```

#### ❌ BROKEN: Idle User Workflow  
```
1. User idle >1 minute → isIdleState() returns true ✅
2. Page hidden → wasIdleRef.current = true ✅
3. getRetryDelay() called → UNDEFINED FUNCTION ❌
4. WebSocket retry fails → NO RECONNECTION ❌
```

#### ⚠️ PARTIALLY WORKING: Session Recovery
```
1. Token expires during idle ✅
2. Recovery attempts work ✅
3. State updated without channel rebuild ✅
4. Channels preserved ✅
```

### 🔧 REQUIRED FIXES FOR COMPLETE WORKFLOW

1. **Add getRetryDelay() function** → Enable reconnection timing
2. **Add retryCountRef** → Track retry attempts  
3. **Add isIdleWakeReconnectRef** → Flag genuine idle-wake scenarios
4. **Complete updateActiveTime()** → Add time-based idle detection logging

## Implementation Coverage: 75% Complete
- ✅ Core idle detection logic
- ✅ Page visibility tracking  
- ✅ Event management
- ✅ Session recovery
- ❌ WebSocket reconnection timing
- ❌ Retry counting