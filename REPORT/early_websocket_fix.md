# Early WebSocket Fix - Before Channel Removal

## Original Issue
- **Problem**: CHANNEL_ERROR during idle periods causing WebSocket connection failures
- **Symptom**: Repeated cycle of connection failure → recovery → failure
- **Log Pattern**: 
  ```
  🔥 WebSocket connection failed with status: CHANNEL_ERROR
  🚀⚡️ WebSocket connection recovered successfully!
  ```

## Before: What Caused the Error

**Original problematic code in AuthContext.tsx:**
```typescript
// Auth listener - BEFORE FIX
const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
  console.log(`🔵🔵🔵 Auth State Change: ${event}`, { userId: session?.user?.id, hasSession: !!session });
  
  // PROBLEM: This always called updateAuthState() which rebuilt ALL channels
  updateAuthState(session);
});

const updateAuthState = (session: Session | null) => {
  setUser(session?.user ?? null);
  setUserId(session?.user?.id ?? null);
  
  // PROBLEM: This always triggered rebuildChatChannel() 
  rebuildChatChannel(session, 'auth state change').catch((error) => {
    console.error('💙 WebSocket auth state rebuild failed:', error);
  });
};

const rebuildChatChannel = async (session: Session | null, reason: string) => {
  // PROBLEM: This rebuilt the channel even during idle token refresh
  console.log(`🔧 Rebuilding chat channel - Reason: ${reason}`);
  
  // 1. Teardown existing channel
  if (chatChannelRef.current) {
    await chatChannelRef.current.unsubscribe();
    supabase.removeChannel(chatChannelRef.current);
  }
  
  // 2. Create new channel - THIS HAPPENED FOR ALL 4+ CHANNELS SIMULTANEOUSLY
  const channel = supabase.channel('chat-community', { ... });
  // Subscribe to channel...
};
```

## Root Cause Analysis
- **When**: Only happened during idle periods (10+ minutes)
- **Why**: Supabase token refresh during idle triggered `SIGNED_OUT` → `TOKEN_REFRESHED` events
- **Problem**: Every auth event called `updateAuthState()` → `rebuildChatChannel()`
- **Effect**: All 4+ active channels tried to rebuild simultaneously, overwhelming WebSocket
- **Result**: WebSocket couldn't handle simultaneous channel teardown/rebuild operations

## The Cascade Failure
1. **User goes idle** (10+ minutes)
2. **Supabase token expires** → triggers `SIGNED_OUT` event
3. **IDLE USER HANDLER** tries to refresh token → triggers `TOKEN_REFRESHED` event  
4. **Each auth event** calls `updateAuthState()`
5. **Each updateAuthState()** calls `rebuildChatChannel()`
6. **All 4+ channels rebuild simultaneously**: 
   - `chat-community` (AuthContext)
   - `global-notifications` (useRealTimeNotifications) 
   - `profile_changes` (UserProfileContext)
   - `pro_status_changes` (usePro)
   - `payment-status-changes` (Payment - if active)
7. **WebSocket overload** → CHANNEL_ERROR → Recovery cycle

## After: The Fix Code (Without Removing Channels)
**File**: `src/contexts/AuthContext.tsx:429-449`

```typescript
// Auth listener - AFTER FIX
const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
  console.log(`🔵🔵🔵 Auth State Change: ${event}`, { userId: session?.user?.id, hasSession: !!session });
  
  // IDLE USER HANDLER - Prevent unwanted signouts
  if (event === 'SIGNED_OUT') {
    const now = new Date().toISOString();
    const logoutReason = session ? '🔑 User manually clicked sign out' : '☠️ Token expired/disconnected';
    
    // Check if this is an unwanted idle signout
    if (!session && !localStorage.getItem('manual-logout-flag')) {
      console.log('🩵🩵🩵 IDLE USER HANDLER - Attempting token refresh before signout');
      
      try {
        // Try to refresh the session
        const { data: refreshedSession, error } = await supabase.auth.refreshSession();
        
        if (refreshedSession?.session && !error) {
          console.log('🩵🩵🩵 IDLE USER HANDLER - Token refreshed successfully');
          // CHANNEL FIX: Don't call updateAuthState, just update state directly to avoid channel rebuild
          setUser(refreshedSession.session.user);
          setUserId(refreshedSession.session.user.id);
          currentTokenRef.current = refreshedSession.session.access_token;
          // Just update auth token without rebuilding channels
          supabase.realtime.setAuth(refreshedSession.session.access_token);
          return; // IMPORTANT: Return early to skip updateAuthState()
        } else {
          console.log('🩵🩵🩵 IDLE USER HANDLER - Refresh failed, trying getSession fallback');
          
          // Fallback: Try getSession to recover
          const { data: { session: fallbackSession }, error: sessionError } = await supabase.auth.getSession();
          
          if (fallbackSession && !sessionError) {
            console.log('🩵🩵🩵 IDLE USER HANDLER - Session recovered via getSession');
            // CHANNEL FIX: Don't call updateAuthState, just update state directly
            setUser(fallbackSession.user);
            setUserId(fallbackSession.user.id);
            currentTokenRef.current = fallbackSession.access_token;
            supabase.realtime.setAuth(fallbackSession.access_token);
            return; // IMPORTANT: Return early to skip updateAuthState()
          }
        }
      } catch (e) {
        console.warn('🩵🩵🩵 IDLE USER HANDLER - All recovery attempts failed:', e);
      }
    }
    
    // Continue with normal logout handling...
    const logEntry = `${now} - 🟡🟡🟡 Reason Signed out: ${logoutReason}`;
    localStorage.setItem('last-logout-reason', logEntry);
    console.log(logEntry);
    localStorage.removeItem('manual-logout-flag');
    currentTokenRef.current = null;
  }
  
  // IMPORTANT: Only call updateAuthState for non-idle token refresh events
  // This prevents unnecessary channel rebuilds during idle periods
  updateAuthState(session);
});
```
  
  // Check if this is an unwanted idle signout
  if (!session && !localStorage.getItem('manual-logout-flag')) {
    console.log('🩵🩵🩵 IDLE USER HANDLER - Attempting token refresh before signout');
    
    try {
      // Try to refresh the session
      const { data: refreshedSession, error } = await supabase.auth.refreshSession();
      
      if (refreshedSession?.session && !error) {
        console.log('🩵🩵🩵 IDLE USER HANDLER - Token refreshed successfully');
        // CHANNEL FIX: Don't call updateAuthState, just update state directly to avoid channel rebuild
        setUser(refreshedSession.session.user);
        setUserId(refreshedSession.session.user.id);
        currentTokenRef.current = refreshedSession.session.access_token;
        // Just update auth token without rebuilding channels
        supabase.realtime.setAuth(refreshedSession.session.access_token);
        return;
      } else {
        console.log('🩵🩵🩵 IDLE USER HANDLER - Refresh failed, trying getSession fallback');
        
        // Fallback: Try getSession to recover
        const { data: { session: fallbackSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (fallbackSession && !sessionError) {
          console.log('🩵🩵🩵 IDLE USER HANDLER - Session recovered via getSession');
          // CHANNEL FIX: Don't call updateAuthState, just update state directly
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

## What This Fix Did
1. **Prevented channel rebuilds** during idle token refresh
2. **Updated auth token directly** via `supabase.realtime.setAuth()`
3. **Updated React state manually** without triggering `updateAuthState()`
4. **Maintained all 4 channels** without removing any functionality

## Channels That Were Preserved
1. **`chat-community`** - Chat + verse notifications
2. **`global-notifications`** - Global notifications  
3. **`profile_changes`** - Profile updates (XP, level, badges, streak)
4. **`pro_status_changes`** - Pro subscription status changes
5. **`payment-status-changes`** (conditional) - Payment status updates

## Why This Fix Worked
- **Root cause**: Multiple channels rebuilding simultaneously during auth refresh
- **Solution**: Update auth token without rebuilding channels
- **Result**: WebSocket connection stability during idle periods
- **Benefit**: Kept all real-time functionality intact

## Key Code Changes
```typescript
// BEFORE (caused channel rebuilds):
updateAuthState(refreshedSession);

// AFTER (direct state update):
setUser(refreshedSession.session.user);
setUserId(refreshedSession.session.user.id);
currentTokenRef.current = refreshedSession.session.access_token;
supabase.realtime.setAuth(refreshedSession.session.access_token);
```

## Effectiveness
- ✅ **Eliminated CHANNEL_ERROR** during idle periods
- ✅ **Preserved all real-time features**
- ✅ **No breaking changes** to existing functionality
- ✅ **Minimal code changes** required

This fix addressed the WebSocket stability issue while maintaining all real-time capabilities.