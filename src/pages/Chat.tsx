import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ChatMessage } from "@/components/ChatMessage";
import { Send, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChatMessageData {
  id: string;
  user_id: string;
  user_name: string;
  user_level: number;
  is_vip: boolean;
  message: string;
  created_at: string;
}

export function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Get user profile for level info
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        setCurrentUser({
          id: session.user.id,
          name: profile?.display_name || session.user.email?.split('@')[0] || 'Anonymous',
          level: profile?.level || 1,
          isVip: profile?.level >= 5 // VIP if level 5 or higher
        });
      }
    };

    getCurrentUser();
  }, []);

  useEffect(() => {
    // Load chat history
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100); // Limit to recent 100 messages

      if (error) {
        console.error('Error loading messages:', error);
        toast({
          title: "Error",
          description: "Failed to load chat history",
          variant: "destructive"
        });
      } else {
        setMessages(data || []);
      }
      setIsLoading(false);
    };

    loadMessages();

    // Set up realtime subscription
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          setMessages(current => [...current, payload.new as ChatMessageData]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const handleSendMessage = async () => {
    if (message.trim() && currentUser) {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: currentUser.id,
          user_name: currentUser.name,
          user_level: currentUser.level,
          is_vip: currentUser.isVip,
          message: message.trim()
        });

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive"
        });
      } else {
        setMessage("");
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
            <Users className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold font-orbitron text-foreground">
              Komunitas Spiritual
            </h1>
            <p className="text-sm text-muted-foreground">
              127 anggota online
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">Loading chat history...</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                user={{
                  id: msg.user_id,
                  name: msg.user_name,
                  level: msg.user_level,
                  isVip: msg.is_vip,
                  avatar: ""
                }}
                message={msg.message}
                timestamp={new Date(msg.created_at)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="sticky bottom-16 bg-background border-t border-border p-4">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Bagikan energi positif Anda..."
            className="cyber-input"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}