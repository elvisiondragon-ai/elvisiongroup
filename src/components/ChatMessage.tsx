import { TierBadge } from "./TierBadge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChatMessageProps {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    level: number;
    isPro?: boolean;
    subscriptionType?: string;
  };
  message: string;
  timestamp: Date;
  currentUserId?: string;
  onDelete?: (messageId: string) => void;
}

export function ChatMessage({ id, user, message, timestamp, currentUserId, onDelete }: ChatMessageProps) {
  const { toast } = useToast();
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDelete = async () => {
    // Immediate optimistic UI update for ultra-fast feel
    if (onDelete) {
      onDelete(id);
    }

    toast({
      title: "Message Deleted 🔥",
      description: ""
    });

    // Fire database delete in background - don't wait
    supabase
      .from('chat_messages')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) {
          console.error('Background delete failed:', error);
          // Could add rollback logic here if needed
        }
      })
      .catch(err => {
        console.error('Background delete error:', err);
      });
  };

  const canDelete = currentUserId === user.id;

  return (
    <div className="flex gap-3 p-4 hover:bg-card/50 transition-colors">
      <Avatar className="w-10 h-10 border border-border">
        <AvatarImage src={user.avatar} />
        <AvatarFallback className="bg-muted text-muted-foreground font-orbitron">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{user.name}</span>
            <TierBadge level={user.level} isPro={user.isPro} achievements={[]} subscriptionType={user.subscriptionType} />
          </div>
          
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-7 w-7 p-0 bg-gradient-to-r from-red-500 via-red-600 to-rose-600 hover:from-red-600 hover:via-red-700 hover:to-rose-700 text-white rounded-full shadow-lg hover:shadow-red-500/50 transition-all duration-150 hover:scale-110 active:scale-95 active:translate-y-0.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        
        <p className="text-muted-foreground leading-relaxed">{message}</p>
        
        <span className="text-xs text-muted-foreground">
          {timestamp.toLocaleTimeString("id-ID", { 
            hour: "2-digit", 
            minute: "2-digit" 
          })}
        </span>
      </div>
    </div>
  );
}