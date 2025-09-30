WEBSOCKET ISSUES - PROBLEMATIC CODE IDENTIFIED

  ISSUE #1: RACE CONDITION IN CHANNEL CLEANUP

  Location: AuthContext.tsx:54-64
  // 2. Teardown old channel
  if (chatChannelRef.current) {
    console.log('☠️ Chat realtime status Unsubscribe');
    try {
      await chatChannelRef.current.unsubscribe(); // ❌ ASYNC
    } catch (e) {
      console.log('⚠️ Unsubscribe failed, continuing...');
    }
    supabase.removeChannel(chatChannelRef.current); // ❌ IMMEDIATE AFTER 
  ASYNC
    chatChannelRef.current = null;
    setChatChannel(null);
  }
  PROBLEM: Async unsubscribe() followed by immediate removeChannel() creates
   race condition.

  ---
  ISSUE #2: INSUFFICIENT AUTH PROPAGATION TIME

  Location: AuthContext.tsx:73-81
  // 3. Set auth FIRST
  console.log('🔑 WebSocket Auth token updated');
  supabase.realtime.setAuth(session.access_token);

  // 4. Wait for auth propagation
  console.log('⏳ WebSocket Auth propagation...');
  await new Promise(resolve => setTimeout(resolve, 100)); // ❌ ONLY 100MS

  // 5. Ensure WebSocket connected
  console.log('⚡️ WebSocket Sukses konek');
  supabase.realtime.connect(); // ❌ MAY CONNECT BEFORE AUTH IS SET
  PROBLEM: 100ms may not be enough for auth token propagation to WebSocket
  connection.

  ---
  ISSUE #3: REPEATED CONNECT() CALLS

  Location: AuthContext.tsx:81
  supabase.realtime.connect(); // ❌ CALLED ON EVERY rebuildChatChannel()
  Triggered by:
  - AuthContext.tsx:156: rebuildChatChannel(session, 'auth state change')
  - AuthContext.tsx:125: rebuildChatChannel(session, 'retry after timeout')
  - AuthContext.tsx:162: Initial session load

  PROBLEM: Multiple connect() calls can create conflicting WebSocket
  connections.

  ---
  ISSUE #4: INCOMPLETE ERROR HANDLING

  Location: AuthContext.tsx:105-129
  channel.subscribe((status) => {
    setChannelStatus(status);

    if (status === 'SUBSCRIBED') {
      // Success handling
    } else if (status === 'TIMED_OUT' || status === 'CLOSED') {
      // Retry logic
    }
    // ❌ MISSING: No handling for 'CHANNEL_ERROR', 'CONNECTION_ERROR', 
  'FAILED'
  });
  PROBLEM: WebSocket connection failures return 'failed' status but code
  doesn't handle it.

  ---
  ISSUE #5: RECURSIVE REBUILD LOOP RISK

  Location: AuthContext.tsx:125 + AuthContext.tsx:156
  // In retry timeout:
  rebuildChatChannel(session, 'retry after timeout').catch(() => {});

  // In updateAuthState:
  rebuildChatChannel(session, 'auth state change').catch(() => {});
  PROBLEM: rebuildChatChannel() can trigger auth state changes, causing
  recursive calls.

  ---
  ISSUE #6: SILENT ERROR SWALLOWING

  Location: AuthContext.tsx:125 + AuthContext.tsx:156
  rebuildChatChannel(session, 'retry after timeout').catch(() => {}); // ❌ 
  EMPTY CATCH
  rebuildChatChannel(session, 'auth state change').catch(() => {}); // ❌ 
  EMPTY CATCH
  PROBLEM: All errors are silently ignored, making debugging impossible.

  ---
  ROOT CAUSE ANALYSIS:

  PRIMARY ISSUE: WebSocket connection fails because:
  1. Auth token not properly propagated (100ms insufficient)
  2. Multiple competing connect() calls
  3. Failed connections not handled ('failed' status ignored)

  SECONDARY ISSUES:
  - Race conditions in cleanup
  - Recursive rebuild loops
  - Silent error handling

  IMPACT: Complete real-time chat failure - users cannot send/receive live
  messages.