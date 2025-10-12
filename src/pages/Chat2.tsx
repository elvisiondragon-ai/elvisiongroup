// @ts-nocheck
import { useState, useEffect, useCallback, useRef, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/components/ChatMessage";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useAuth } from "@/contexts/AuthContext";

interface Chat2Props {
  onNavigate: (tab: string) => void;
}

interface ChatMessageData {
  id: string;
  user_id: string;
  user_name: string;
  user_level: number;
  is_pro: boolean;
  is_admin?: boolean;
  message: string;
  created_at: string;
  translatedMessage?: string;
  streak_days?: number;
  subscription_type?: string | null;
  avatar_url?: string;
}

// Memoized message list to prevent re-renders on every keystroke
const MessageList = memo(({ messages, userId, onDelete }: {
  messages: ChatMessageData[];
  userId: string | null;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="divide-y divide-border">
      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          id={msg.id}
          user={{
            id: msg.user_id,
            name: msg.user_name,
            level: msg.user_level,
            isPro: msg.is_pro || false,
            isAdmin: msg.is_admin || false,
            streak_days: msg.streak_days || 0,
            subscriptionType: msg.subscription_type || undefined,
            avatar: msg.avatar_url || ""
          }}
          message={msg.message}
          timestamp={new Date(msg.created_at)}
          currentUserId={userId}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
});

MessageList.displayName = 'MessageList';

//CHAT 2 NOT ALLOWED COMPLEX POSITIONING
export function Chat2({ onNavigate }: Chat2Props) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // iOS detection
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  // Android detection
  const isAndroid = /Android/i.test(navigator.userAgent);
  // PWA detection - check if app is installed to home screen
  const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone === true;

  const { toast } = useToast();
  const { user, userProfile } = useUserProfile();
  const { userId, chatChannel, isPro, proStatus, messages, setMessages, addMessage, removeMessage, broadcastMessage, broadcastDelete } = useAuth();

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (proStatus) {
      console.log('🔵 Subscribe From Chat2 tab - pro_status_changes channel');
      return () => {
        console.log('🟣 Unsubscribe From Chat2 tab - pro_status_changes channel');
      };
    }
  }, [proStatus]);

  if (!userId) return null;

  // Prevent body scroll on iOS, only allow chat messages to scroll
  useEffect(() => {
    if (isIOS) {
      // Disable body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';

      return () => {
        // Cleanup on unmount
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
      };
    }
  }, [isIOS]);

  // Independent pro badge cache for Chat2.tsx optimistic UI
  const [chatProBadgeCache, setChatProBadgeCache] = useState(() => {
    const saved = localStorage.getItem('chat-pro-badge-cache');
    return saved ? JSON.parse(saved) : {
      is_pro: false,
      is_admin: false,
      subscription_type: null,
      streak_days: 0,
      user_name: '',
      user_level: 1,
      avatar_url: '',
      timestamp: 0
    };
  });

  // User badge cache for optimistic UI consistency
  const [userBadgeCache, setUserBadgeCache] = useState({
    is_pro: false,
    is_admin: false,
    subscription_type: null,
    streak_days: 0,
    user_name: '',
    user_level: 1,
    avatar_url: ''
  });

  // Scroll to bottom function for both platforms
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      // For column-reverse, scroll to bottom
      container.scrollTop = container.scrollHeight;
    }
  };

  // Auto-scroll to bottom when messages load or change
  useEffect(() => {
    if (messages.length > 0) {
      // Small delay to ensure DOM is updated
      setTimeout(scrollToBottom, 100);
    }
  }, [messages.length]);

  // Invalidate user cache when pro status changes
  const invalidateUserCache = (userId: string) => {
    localStorage.removeItem(`user-data-${userId}`);
    console.log(`🗑️ Invalidated cache for user: ${userId}`);
  };

  // Update independent chat pro badge cache with persistence
  useEffect(() => {
    if (user && userProfile) {
      const knownAdminId = '3da83afb-aa8c-4c55-b3b0-8aa64000205f';
      const currentProStatus = isPro || proStatus?.isPro || false;

      // Check if pro status changed (for pro upgrade/downgrade detection)
      const proStatusChanged = chatProBadgeCache.timestamp > 0 &&
        chatProBadgeCache.is_pro !== currentProStatus;

      const cacheData = {
        is_pro: currentProStatus,
        is_admin: user.id === knownAdminId || userProfile?.is_admin || false,
        subscription_type: proStatus?.subscriptionType || null,
        streak_days: userProfile?.streak_days || 0,
        user_name: userProfile?.display_name || 'Anonymous',
        user_level: userProfile?.level || 1,
        avatar_url: userProfile?.avatar_url || '',
        timestamp: Date.now()
      };

      // Always update cache if pro status changed
      if (proStatusChanged) {
        console.log('🔄 Pro status changed, invalidating user cache:', {
          old: chatProBadgeCache.is_pro,
          new: currentProStatus
        });
        // Invalidate cache when pro status changes
        invalidateUserCache(user.id);
      }

      // Update both caches
      setChatProBadgeCache(cacheData);
      setUserBadgeCache(cacheData);

      // Persist chat-specific cache to localStorage
      localStorage.setItem('chat-pro-badge-cache', JSON.stringify(cacheData));
    }
  }, [user, userProfile, isPro, proStatus]);

  // Smart user data cache with TTL (24 hours)
  const getUserDataFromCache = (userId: string) => {
    const cached = localStorage.getItem(`user-data-${userId}`);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const TTL = 24 * 60 * 60 * 1000; // 24 hours

    if (Date.now() - timestamp > TTL) {
      localStorage.removeItem(`user-data-${userId}`);
      return null;
    }

    return data;
  };

  const cacheUserData = (userId: string, data: any) => {
    localStorage.setItem(`user-data-${userId}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  };

  // Load messages from database with smart caching
  const loadMessages = useCallback(async (showRefreshState = false) => {
    try {
      // Get chat messages first
      let { data: chatMessages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('channel_id', 'community')
        .order('created_at', { ascending: true });

      if (error || !chatMessages) {
        console.error('Error loading messages:', error);
        setIsLoading(false);
        return;
      }

      // Get unique user IDs from chat messages
      const userIds = [...new Set(chatMessages.map(msg => msg.user_id))];

      // Check cache for existing user data
      const cachedProfiles = new Map();
      const cachedSubscriptions = new Map();
      const uncachedUserIds = [];

      userIds.forEach(userId => {
        const cached = getUserDataFromCache(userId);
        if (cached) {
          cachedProfiles.set(userId, cached.profile);
          if (cached.subscription) {
            cachedSubscriptions.set(userId, cached.subscription);
          }
        } else {
          uncachedUserIds.push(userId);
        }
      });

      console.log(`💾 Cache hit: ${userIds.length - uncachedUserIds.length}/${userIds.length} users, fetching: ${uncachedUserIds.length}`);

      // Only fetch data for uncached users
      let userProfiles = [];
      let subscriptions = [];

      if (uncachedUserIds.length > 0) {
        // Fetch real profiles for uncached users only
        const { data: newUserProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, display_name, streak_days, level, is_admin, user_email, avatar_url')
          .in('user_id', uncachedUserIds);

        // Fetch Pro status for uncached users only using public RPC
        const { data: newSubscriptions } = await supabase
          .rpc('get_public_pro_status', { user_ids: uncachedUserIds });

        userProfiles = newUserProfiles || [];
        subscriptions = newSubscriptions || [];

        // Cache the new data
        userProfiles.forEach(profile => {
          const subscription = subscriptions.find(sub => sub.user_id === profile.user_id);
          cacheUserData(profile.user_id, {
            profile,
            subscription: subscription ? {
              is_pro: subscription.is_pro,
              subscription_type: subscription.subscription_type
            } : null
          });
          cachedProfiles.set(profile.user_id, profile);
          if (subscription?.is_pro) {
            cachedSubscriptions.set(profile.user_id, {
              is_pro: true,
              subscription_type: subscription.subscription_type
            });
          }
        });

        if (profilesError) {
          console.error('Error loading user profiles:', profilesError);
        }
      }

      // Create maps from combined cached + fresh data
      const profilesMap = cachedProfiles;
      const subscriptionMap = cachedSubscriptions;

      // Get admin users
      let adminUsers = new Set();
      const knownAdminId = '3da83afb-aa8c-4c55-b3b0-8aa64000205f';
      adminUsers.add(knownAdminId);

      // Process messages with real profile data
      const processedMessages = chatMessages?.map(msg => {
        const userProfile = profilesMap.get(msg.user_id);
        const realStreakDays = userProfile?.streak_days || 0;

        // For consistency, give minimum 7 days to users without profile data
        const displayStreakDays = userProfile ? realStreakDays : (realStreakDays === 0 ? 7 : realStreakDays);

        // Get subscription data from unified RPC
        const subscriptionData = subscriptionMap.get(msg.user_id);

        return {
          ...msg,
          is_admin: adminUsers.has(msg.user_id) || userProfile?.is_admin || false,
          // Use real streak_days or minimum for display
          streak_days: displayStreakDays,
          // Update other profile data if available
          user_level: userProfile?.level || msg.user_level || 1,
          is_pro: subscriptionData?.is_pro || false,
          subscription_type: subscriptionData?.subscription_type || null,
          user_name: userProfile?.display_name || msg.user_name,
          avatar_url: userProfile?.avatar_url || undefined
        };
      }) || [];

      setMessages(processedMessages);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  }, [toast]);

  // Load initial messages when channel is ready
  useEffect(() => {
    if (chatChannel) {
      console.log('🔵 Chat2 realtime status: SUBSCRIBED - Loading initial messages');
      loadMessages();
    }
  }, [chatChannel, loadMessages]);

  // 10000ms timeout mechanism for chat loading
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        console.log('Chat2 loading timeout triggered (10000ms), forcing refresh...');
        localStorage.setItem('refresh-redirect-to-chat', 'true');
        window.location.reload();
      }
    }, 10000);

    return () => clearTimeout(loadingTimeout);
  }, [isLoading]);

  useEffect(() => {
    // Network-first: Load fresh messages immediately on mount
    const loadFreshMessages = async () => {
      if (userId && messages.length === 0) {
        setIsLoading(true);
        try {
          await loadMessages();
        } catch (error) {
          console.error('Failed to load messages from network:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (messages.length > 0) {
        setIsLoading(false);
      }
    };
    loadFreshMessages();
  }, [loadMessages, messages.length, userId]);

  useEffect(() => {
    // Set up 60-minute polling interval
    const interval = setInterval(() => {
      loadMessages(true);
    }, 60 * 60 * 1000); // 60 minutes in milliseconds

    return () => clearInterval(interval);
  }, [loadMessages]);

  // Enhanced input validation function
  const validateMessage = (input: string): string | null => {
    const trimmed = input.trim();

    // Length validation
    if (trimmed.length === 0) return "Message cannot be empty";
    if (trimmed.length > 500) return "Message must be 500 characters or less";

    // Basic sanitization - remove potentially harmful characters
    const sanitized = trimmed
      .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+\s*=/gi, ''); // Remove event handlers

    // Check for excessive repetition (spam detection)
    const repeated = /(.)\1{10,}/.test(sanitized);
    if (repeated) return "Message contains excessive repeated characters";

    return null;
  };

  const handleSendMessage = async () => {
    if (!userId) return;

    const validationError = validateMessage(message);
    if (validationError) {
      toast({
        title: "Invalid Message",
        description: validationError,
        variant: "destructive"
      });
      return;
    }

    // Check if user has valid display name
    if (!userProfile?.display_name || userProfile.display_name === 'Anonymous') {
      toast({
        title: "Lengkapi Profil untuk Chat",
        description: "Silakan pilih Edit Profil memastikan Nama anda untuk chat",
        variant: "destructive",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              localStorage.setItem('auto-edit-profile', 'true');
              onNavigate('profile');
            }}
          >
            Arahkan Ke Profil
          </Button>
        )
      });
      return;
    }

    // Get current user data from cache or fallback to profile
    const knownAdminId = '3da83afb-aa8c-4c55-b3b0-8aa64000205f';
    const isAdmin = user.id === knownAdminId || userProfile?.is_admin || false;

    // Try to get fresh user data from cache first
    const cachedUserData = getUserDataFromCache(user.id);
    let userData = {
      is_pro: isPro || proStatus?.isPro || false,
      is_admin: isAdmin,
      subscription_type: proStatus?.subscriptionType || null,
      streak_days: userProfile?.streak_days || 0,
      user_name: userProfile?.display_name || 'Anonymous',
      user_level: userProfile?.level || 1,
      avatar_url: userProfile?.avatar_url || ''
    };

    // Use cached data if available and fresher
    if (cachedUserData) {
      userData = {
        is_pro: cachedUserData.subscription?.is_pro || userData.is_pro,
        is_admin: cachedUserData.profile?.is_admin || userData.is_admin,
        subscription_type: cachedUserData.subscription?.subscription_type || userData.subscription_type,
        streak_days: cachedUserData.profile?.streak_days || userData.streak_days,
        user_name: cachedUserData.profile?.display_name || userData.user_name,
        user_level: cachedUserData.profile?.level || userData.user_level,
        avatar_url: cachedUserData.profile?.avatar_url || userData.avatar_url
      };
    }

    // Update caches with latest data
    if (user && userProfile) {
      setChatProBadgeCache({ ...userData, timestamp: Date.now() });
      setUserBadgeCache(userData);
      localStorage.setItem('chat-pro-badge-cache', JSON.stringify({ ...userData, timestamp: Date.now() }));
    }

    // Add optimistic message immediately with best available data
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: ChatMessageData = {
      id: tempId,
      user_id: user.id,
      user_name: userData.user_name,
      user_level: userData.user_level,
      is_pro: userData.is_pro,
      is_admin: userData.is_admin,
      message: message.trim(),
      created_at: new Date().toISOString(),
      streak_days: userData.streak_days,
      subscription_type: userData.subscription_type,
      avatar_url: userData.avatar_url
    };

    addMessage(optimisticMessage);
    setMessage(""); // Button becomes disabled immediately

    try {
      // Send to database without timeout
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          user_name: userProfile?.display_name || 'Anonymous',
          user_level: userProfile?.level || 1,
          message: message.trim(),
          channel_id: 'community'
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        // Remove optimistic message on error
        removeMessage(tempId);
        toast({
          title: "Error",
          description: `Failed to send message: ${error.message}`,
          variant: "destructive"
        });
      } else {
        console.log('Message sent successfully');
        // Replace optimistic message with real one
        setMessages(current => current.map(msg =>
          msg.id === tempId ? { ...optimisticMessage, id: data.id } : msg
        ));

        // Broadcast new message to all users using AuthContext
        broadcastMessage({ ...optimisticMessage, id: data.id });

        toast({
          title: "Message Sent 🚀",
          description: "",
          variant: "default"
        });
      }
    } catch (err) {
      console.error('Unexpected error sending message:', err);
      removeMessage(tempId);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMessage = useCallback(async (messageId: string) => {
    removeMessage(messageId);

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
        const messageToRestore = messages.find(msg => msg.id === messageId);
        if (messageToRestore) {
          addMessage(messageToRestore);
        }
      } else {
        // Broadcast delete to all users using AuthContext
        broadcastDelete(messageId);
      }
    } catch (err) {
      const messageToRestore = messages.find(msg => msg.id === messageId);
      if (messageToRestore) {
        addMessage(messageToRestore);
      }
    }
  }, [removeMessage, userId, messages, addMessage, broadcastDelete]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Show loading state during initial load
  if (isLoading) {
    return (
      <div className="h-screen pb-20" style={{ display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <img
            src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/admin-image/elvisionlogo.png"
            alt="Loading"
            className="w-20 h-20 mb-4 opacity-50"
            loading="eager"
            style={{ margin: '0 auto' }}
          />
          <p className="text-sm bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent font-semibold">Tunggu Sebentar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* CHAT MESSAGES */}
      <div
        ref={messagesContainerRef}
        className="overflow-y-auto pb-4"
        style={{
          position: 'absolute',
          top: 0,
          bottom: (isAndroid && isPWA) ? '150px' : '170px',
          left: 0,
          right: 0,
          paddingTop: (isIOS && isPWA) ? 'env(safe-area-inset-top)' : '0px',
          WebkitOverflowScrolling: 'touch',
          touchAction: isIOS ? 'pan-y' : 'auto',
          overscrollBehavior: 'none',
          overscrollBehaviorY: 'none',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
        onTouchStart={(e) => {
          // iOS handler - only allow vertical scroll for chat messages
          if (isIOS) {
            e.stopPropagation();
          }
        }}
        onTouchMove={(e) => {
          // iOS handler - prevent horizontal scroll, only allow vertical
          if (isIOS) {
            const touch = e.touches[0];
            const deltaX = Math.abs(touch.clientX - (touch.target as any).startX || 0);
            const deltaY = Math.abs(touch.clientY - (touch.target as any).startY || 0);

            // If more horizontal movement than vertical, prevent scroll
            if (deltaX > deltaY) {
              e.preventDefault();
            }
          }
        }}
      >
        <MessageList
          messages={messages}
          userId={user?.id || null}
          onDelete={handleDeleteMessage}
        />
      </div>

      {/* INPUT BAR */}
      <div className="fixed bottom-20 left-0 right-0 bg-background border-t border-border p-4 z-50">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem' }}>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Bagikan energi positif Anda..."
            className="cyber-input"
            maxLength={500}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:opacity-90 text-white px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
