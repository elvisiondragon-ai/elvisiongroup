// @ts-nocheck
import { useEffect, useRef, memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/ChatMessage";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ChatMessageData {
  id: string;
  user_id: string;
  user_name: string;
  user_level: number;
  is_pro: boolean;
  is_admin?: boolean;
  message: string;
  created_at: string;
  streak_days?: number;
  subscription_type?: string | null;
  avatar_url?: string;
  is_gold_reported?: boolean;
}

interface GoldReportListProps {
  onBack: () => void;
  currentUserIsAdmin: boolean;
  userId: string | null;
  onDelete: (messageId: string) => void;
  onGoldReportToggle: (messageId: string, isGoldReported: boolean) => void;
}

// Memoized message list
const MessageList = memo(({ messages, userId, userIsAdmin, onDelete, onGoldReportToggle }: {
  messages: ChatMessageData[];
  userId: string | null;
  userIsAdmin: boolean;
  onDelete: (id: string) => void;
  onGoldReportToggle: (messageId: string, isGoldReported: boolean) => void;
}) => {
  return (
    <div className="space-y-3 p-2">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="relative rounded-2xl border border-white/20 shadow-2xl backdrop-blur-md bg-white/10 overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none"></div>
          <ChatMessage
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
            currentUserIsAdmin={userIsAdmin}
            isGoldReported={msg.is_gold_reported}
            onDelete={onDelete}
            onGoldReportToggle={onGoldReportToggle}
          />
        </div>
      ))}
    </div>
  );
});

MessageList.displayName = 'MessageList';

export function GoldReportList({ onBack, currentUserIsAdmin, userId, onDelete, onGoldReportToggle }: GoldReportListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [goldReportedMessages, setGoldReportedMessages] = useState<ChatMessageData[]>(() => {
    // Load from cache instantly
    const cached = localStorage.getItem('gold-reports-cache');
    return cached ? JSON.parse(cached) : [];
  });
  const [displayLimit, setDisplayLimit] = useState(100);
  const [totalCount, setTotalCount] = useState(0);

  // iOS detection
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  // Android detection
  const isAndroid = /Android/i.test(navigator.userAgent);
  // Desktop detection
  const isDesktop = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  // PWA detection
  const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone === true;

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  // Fetch gold reported messages from database
  useEffect(() => {
    const fetchGoldReports = async () => {
      // Get gold reports with message data
      const { data: goldReports, error } = await supabase
        .from('gold_reports')
        .select('message_id');

      if (error || !goldReports) {
        console.error('Error loading gold reports:', error);
        return;
      }

      setTotalCount(goldReports.length);

      const messageIds = goldReports.map(gr => gr.message_id);

      if (messageIds.length === 0) {
        setGoldReportedMessages([]);
        return;
      }

      // Fetch messages for these IDs
      const { data: chatMessages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .in('id', messageIds)
        .order('created_at', { ascending: true });

      if (messagesError || !chatMessages) {
        console.error('Error loading messages:', messagesError);
        return;
      }

      // Get unique user IDs
      const userIds = [...new Set(chatMessages.map(msg => msg.user_id))];

      // Fetch user profiles
      const { data: userProfiles } = await supabase
        .from('profiles')
        .select('user_id, display_name, streak_days, level, is_admin, avatar_url')
        .in('user_id', userIds);

      // Map user data
      const profileMap = new Map(userProfiles?.map(p => [p.user_id, p]) || []);

      // Process messages
      const processedMessages = chatMessages.map(msg => {
        const userProfile = profileMap.get(msg.user_id);

        return {
          id: msg.id,
          user_id: msg.user_id,
          message: msg.message,
          created_at: msg.created_at,
          user_name: userProfile?.display_name || msg.user_name,
          user_level: userProfile?.level || 1,
          is_pro: false,
          is_admin: userProfile?.is_admin || false,
          streak_days: userProfile?.streak_days || 0,
          subscription_type: null,
          avatar_url: userProfile?.avatar_url || undefined,
          is_gold_reported: true
        };
      });

      // Update state and cache
      setGoldReportedMessages(processedMessages);
      localStorage.setItem('gold-reports-cache', JSON.stringify(processedMessages));
      setTimeout(scrollToBottom, 100);
    };

    // Fetch fresh data in background (cache already displayed)
    fetchGoldReports();

    // Listen for realtime changes to gold_reports
    const channel = supabase
      .channel('gold-reports-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'gold_reports'
        },
        () => {
          console.log('🔄 Gold reports changed - refreshing...');
          fetchGoldReports();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auto-scroll when component mounts
  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Header with Back Button */}
      <div
        className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50 px-4 py-3"
        style={{
          paddingTop: ((isIOS || isAndroid) && isPWA) ? 'calc(env(safe-area-inset-top) + 12px)' : '12px'
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="w-full h-10 bg-gradient-to-r from-amber-400/60 via-yellow-400/60 to-amber-500/60 hover:from-amber-500/60 hover:via-yellow-500/60 hover:to-amber-600/60 text-black font-medium shadow-lg shadow-amber-500/20 transition-all duration-150 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Chat
        </Button>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="overflow-y-auto"
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          WebkitOverflowScrolling: 'touch',
          position: 'absolute',
          top: '60px',
          bottom: isIOS ? (isPWA ? '110px' : '150px') : isDesktop ? '60px' : (isAndroid && isPWA) ? '75px' : '120px', // Fullscreen - device-specific spacing
          left: '0',
          right: '0',
          paddingTop: ((isIOS || isAndroid) && isPWA) ? 'env(safe-area-inset-top)' : '0px',
          touchAction: isIOS ? 'pan-y' : 'auto',
          paddingBottom: '0px',
          overscrollBehavior: 'none',
          overscrollBehaviorY: 'none',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
        onTouchStart={(e) => {
          if (isIOS) {
            e.stopPropagation();
          }
        }}
        onTouchMove={(e) => {
          if (isIOS) {
            const touch = e.touches[0];
            const deltaX = Math.abs(touch.clientX - (touch.target as any).startX || 0);
            const deltaY = Math.abs(touch.clientY - (touch.target as any).startY || 0);

            if (deltaX > deltaY) {
              e.preventDefault();
            }
          }
        }}
      >
        {goldReportedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No gold reports yet
          </div>
        ) : (
          <>
            <MessageList
              messages={goldReportedMessages.slice(0, displayLimit)}
              userId={userId}
              userIsAdmin={currentUserIsAdmin}
              onDelete={onDelete}
              onGoldReportToggle={onGoldReportToggle}
            />
            {displayLimit < goldReportedMessages.length && (
              <div className="p-4 text-center">
                <span
                  onClick={() => setDisplayLimit(goldReportedMessages.length)}
                  className="inline-block px-3 py-1.5 text-xs text-white font-medium bg-gray-800 hover:bg-gray-700 rounded-full cursor-pointer shadow-md transition-all duration-150"
                >
                  Load More Gold Report...
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
