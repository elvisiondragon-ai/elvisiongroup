# Chat Realtime Implementation Summary

## Problem Identified
- Chat.tsx had multiple `getSession()` calls causing performance issues
- Realtime channel used old JWT tokens after token refresh
- Users had to logout/login to get new tokens for realtime events
- Token expiry caused realtime chat to stop working

## Root Cause Analysis
1. **Multiple getSession() calls in Chat.tsx:**
   - Line 213: `loadFreshMessages` function
   - Line 224: `initRealtime` function  
   - Line 461: `handleSendMessage` function

2. **Token Management Issues:**
   - Chat.tsx created its own realtime channel with snapshot token
   - No mechanism to update realtime auth when tokens refreshed
   - useEffect dependency `[user]` only triggered on login/logout, not token refresh

3. **Channel Cleanup Issues:**
   - Used `chatChannel.off()` which doesn't exist in Supabase
   - Caused errors when navigating away from Chat

## Solution Implemented

### 1. Centralized Auth in AuthContext.tsx
**Added:**
- `userId: string | null` - Never expires user ID
- `chatChannel: RealtimeChannel | null` - Shared channel
- `updateAuthState(session)` - Handles all auth state updates
- Auto token refresh: `supabase.realtime.setAuth(session?.access_token ?? '')`
- Channel recreation on token refresh

**Key Code:**
```typescript
const updateAuthState = (session: Session | null) => {
  setUserId(session?.user?.id ?? null);
  supabase.realtime.setAuth(session?.access_token ?? '');
  
  if (chatChannelRef.current) {
    supabase.removeChannel(chatChannelRef.current);
    chatChannelRef.current = null;
  }
  
  if (session?.user) {
    const channel = supabase.channel('chat-community', {
      config: { broadcast: { self: true } }
    });
    // ... channel setup
    chatChannelRef.current = channel;
    setChatChannel(channel);
  }
};
```

### 2. Simplified Chat.tsx
**Removed:**
- All `getSession()` calls (3 instances)
- `realtimeChannel = useRef<any>(null)`
- Channel creation block (lines 228-264)
- Channel cleanup block (271-273)

**Added:**
- `const { userId, chatChannel } = useAuth()`
- Early return: `if (!userId) return null`
- Proper Supabase subscription pattern

**Key Code:**
```typescript
const sub = chatChannel
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: 'channel_id=eq.community' }, handleMessage)
  .on('broadcast', { event: 'message_added' }, handleBroadcastMessage)
  .on('broadcast', { event: 'message_deleted' }, handleBroadcastDelete)
  .subscribe();

return () => {
  sub.unsubscribe();
};
```

### 3. Real-time Broadcast Implementation
**Added message broadcasting:**
```typescript
// In handleSendMessage - broadcast new message
if (chatChannel) {
  chatChannel.send({
    type: 'broadcast',
    event: 'message_added',
    payload: { ...optimisticMessage, id: data.id }
  });
}

// In handleDeleteMessage - broadcast delete
if (chatChannel) {
  chatChannel.send({
    type: 'broadcast',
    event: 'message_deleted',
    payload: { message_id: messageId }
  });
}
```

**Added broadcast listeners:**
```typescript
const handleBroadcastMessage = (payload) => {
  if (payload.payload.user_id !== userId) {
    setMessages(current => {
      const exists = current.some(msg => msg.id === payload.payload.id);
      if (exists) return current;
      return [...current, payload.payload];
    });
  }
};

const handleBroadcastDelete = (payload) => {
  setMessages(current => current.filter(msg => msg.id !== payload.payload.message_id));
};
```

### 4. App.tsx Cleanup
**Removed:**
- Duplicate auth state listener (lines 297-491)
- Unnecessary user state management
- Token freshness protection (handled by AuthContext)

**Simplified to:**
- AuthProvider wrapper
- Simple auth guards using AuthContext state

## Results Achieved

### ✅ Token Refresh Fixed
- AuthContext automatically calls `supabase.realtime.setAuth(newToken)` on TOKEN_REFRESHED
- Realtime channel recreated with fresh auth on token refresh
- No more logout/login required for continued realtime functionality

### ✅ Performance Improved  
- Eliminated 3 `getSession()` calls from Chat.tsx
- Single source of truth for auth state in AuthContext
- No duplicate auth handling between App.tsx and AuthContext

### ✅ Real-time Chat Enhanced
- Instant message delivery via broadcast events
- Instant message deletion via broadcast events  
- Proper Supabase subscription cleanup with `sub.unsubscribe()`
- No navigation errors when leaving Chat

### ✅ Code Simplified
- Chat.tsx: 273 lines → ~240 lines (removed complexity)
- App.tsx: 564 lines → ~325 lines (removed duplicate auth)
- AuthContext: Centralized all auth + realtime logic

## Technical Pattern Applied
```
AuthContext owns:
├── session state (userId, accessToken)
├── onAuthStateChange listener
├── supabase.realtime.setAuth(newToken) 
└── shared chatChannel creation/cleanup

Chat.tsx consumes:
├── { userId, chatChannel } from useAuth()
├── Early return if (!userId)
└── No getSession(), no channel creation
```

## Files Modified
1. `/src/contexts/AuthContext.tsx` - Added userId, chatChannel, updateAuthState
2. `/src/pages/Chat.tsx` - Removed getSession calls, added broadcast
3. `/src/App.tsx` - Removed duplicate auth handling, simplified

## Bugs Fixed
1. `chatChannel.off is not a function` → Used `sub.unsubscribe()`
2. Token expiry breaking realtime → Auto token refresh in AuthContext  
3. Race conditions → Eliminated duplicate auth sources
4. Navigation black screen → Fixed useAuth import and cleanup

## Pattern Benefits
- **Single source of truth** for auth state
- **Automatic token refresh** for realtime
- **Simplified components** consuming auth from context
- **Proper cleanup** using Supabase subscription pattern
- **Instant real-time** via broadcast events

## Code Changes Made

### AuthContext.tsx - Added userId, chatChannel, realtime management

```typescript
// Added imports
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

// Updated interface
interface AuthContextType {
  user: User | null;
  userId: string | null;
  loading: boolean;
  chatChannel: RealtimeChannel | null;
  isPro: boolean;
  proStatus: {
    isPro: boolean;
    subscriptionType: string | null;
    status: string | null;
    expiresAt: string | null;
  } | null;
}

// Updated context default
const AuthContext = createContext<AuthContextType>({
  user: null,
  userId: null,
  loading: true,
  chatChannel: null,
  isPro: false,
  proStatus: null,
});

// Added state variables
const [userId, setUserId] = useState<string | null>(null);
const [chatChannel, setChatChannel] = useState<RealtimeChannel | null>(null);
const chatChannelRef = useRef<RealtimeChannel | null>(null);

// Added updateAuthState function
const updateAuthState = (session: Session | null) => {
  setUser(session?.user ?? null);
  setUserId(session?.user?.id ?? null);
  
  supabase.realtime.setAuth(session?.access_token ?? '');
  
  if (chatChannelRef.current) {
    supabase.removeChannel(chatChannelRef.current);
    chatChannelRef.current = null;
  }
  
  if (session?.user) {
    const channel = supabase.channel('chat-community', {
      config: {
        broadcast: { self: true }
      }
    });
    
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: 'channel_id=eq.community'
      },
      (payload) => console.log('💬 Realtime message received:', payload.new)
    );
    
    channel.subscribe((status) => console.log('🔴 Chat realtime status:', status));
    
    chatChannelRef.current = channel;
    setChatChannel(channel);
    
    checkProStatus(session.user.id);
  } else {
    setChatChannel(null);
    setLoading(false);
  }
};

// Updated useEffect
useEffect(() => {
  // Get initial session
  supabase.auth.getSession().then(({ data: { session } }) => {
    updateAuthState(session);
  });

  // Auth listener
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    updateAuthState(session);
  });

  return () => subscription.unsubscribe();
}, []);

// Updated provider value
return (
  <AuthContext.Provider
    value={{
      user,
      userId,
      loading,
      chatChannel,
      isPro: proStatus?.isPro || false,
      proStatus,
    }}
  >
    {children}
  </AuthContext.Provider>
);
```

### Chat.tsx - Removed getSession calls, added broadcast, fixed subscription

```typescript
// Updated imports
import { useAuth } from "@/contexts/AuthContext";

// Updated component start
export function Chat({ onNavigate }: ChatProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  // ... other state

  const { userId, chatChannel } = useAuth();
  
  if (!userId) return null;

  // Updated realtime listener
  useEffect(() => {
    if (chatChannel) {
      const handleMessage = (payload) => {
        const newMessage = payload.new;
        if (newMessage.user_id !== userId) {
          setMessages(current => {
            const exists = current.some(msg => msg.id === newMessage.id);
            if (exists) return current;
            return [...current, newMessage];
          });
        }
      };

      const handleBroadcastMessage = (payload) => {
        if (payload.payload.user_id !== userId) {
          setMessages(current => {
            const exists = current.some(msg => msg.id === payload.payload.id);
            if (exists) return current;
            return [...current, payload.payload];
          });
        }
      };

      const handleBroadcastDelete = (payload) => {
        setMessages(current => current.filter(msg => msg.id !== payload.payload.message_id));
      };
      
      const sub = chatChannel
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: 'channel_id=eq.community' }, handleMessage)
        .on('broadcast', { event: 'message_added' }, handleBroadcastMessage)
        .on('broadcast', { event: 'message_deleted' }, handleBroadcastDelete)
        .subscribe();
      
      return () => {
        sub.unsubscribe();
      };
    }
  }, [chatChannel, userId]);

  // Updated loadFreshMessages (removed getSession)
  const loadFreshMessages = async () => {
    if (userId) {
      loadMessages();
    }
  };

  // Updated handleSendMessage (removed getSession, added broadcast)
  const handleSendMessage = async () => {
    localStorage.removeItem('chat-messages-cache');
    
    if (!userId) return;

    // ... validation and optimistic update

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: userId,
          user_name: userProfile?.display_name || 'Anonymous',
          user_level: userProfile?.level || 1,
          is_pro: userProfile?.is_pro || false,
          message: message.trim()
        })
        .select()
        .single();

      if (error) {
        // ... error handling
      } else {
        // Replace optimistic message with real one
        setMessages(current => current.map(msg => 
          msg.id === tempId ? { ...optimisticMessage, id: data.id } : msg
        ));

        // Broadcast new message to all users
        if (chatChannel) {
          chatChannel.send({
            type: 'broadcast',
            event: 'message_added',
            payload: { ...optimisticMessage, id: data.id }
          });
        }

        // ... success toast
      }
    } catch (err) {
      // ... error handling
    }
  };

  // Updated handleDeleteMessage (removed getSession, added broadcast)
  const handleDeleteMessage = async (messageId: string) => {
    setMessages(current => current.filter(msg => msg.id !== messageId));
    
    if (messageId.startsWith('temp-')) {
      return;
    }
    
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId)
        .eq('user_id', userId);

      if (error) {
        // ... restore message on error
      } else {
        // Broadcast delete to all users
        if (chatChannel) {
          chatChannel.send({
            type: 'broadcast',
            event: 'message_deleted',
            payload: { message_id: messageId }
          });
        }
      }
    } catch (err) {
      // ... error handling
    }
  };
}
```

### App.tsx - Added useAuth import, simplified structure

```typescript
// Updated imports
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Updated component structure
const AppContent = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateClicked, setUpdateClicked] = useState(false);
  const [toastId, setToastId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, loading } = useAuth();

  // ... PWA update logic (unchanged)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AudioProvider>
      <MeditativeProvider>
        <UserProfileProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}>
            <Routes>
              <Route 
                path="/" 
                element={user ? <Index /> : <Auth />} 
              />
              {/* ... other routes */}
            </Routes>
          </BrowserRouter>
          {/* Free User Notification Modal */}
        </UserProfileProvider>
      </MeditativeProvider>
    </AudioProvider>
  );
};

// Main App wrapper
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
```

## Key Code Patterns Used

### 1. Proper Supabase Subscription Pattern
```typescript
const sub = channel
  .on('event1', config1, handler1)
  .on('event2', config2, handler2)
  .subscribe();

return () => {
  sub.unsubscribe();
};
```

### 2. Broadcast Pattern for Real-time
```typescript
// Send
channel.send({
  type: 'broadcast',
  event: 'message_added',
  payload: messageData
});

// Receive
channel.on('broadcast', { event: 'message_added' }, handleMessage);
```

### 3. Context Consumer Pattern
```typescript
const { userId, chatChannel } = useAuth();
if (!userId) return null;
// Use userId for operations, chatChannel for realtime
```

### 4. Token Refresh Pattern
```typescript
onAuthStateChange((event, session) => {
  supabase.realtime.setAuth(session?.access_token ?? '');
  // Recreate channels with fresh auth
});
```