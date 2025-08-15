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
    email?: string;
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
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting message:', error);
        toast({
          title: "Error",
          description: "Failed to delete message",
          variant: "destructive"
        });
        return;
      }

      if (onDelete) {
        onDelete(id);
      }

      toast({
        title: "Success",
        description: "Message deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive"
      });
    }
  };

  const canDelete = currentUserId === user.id;
  const isAdmin = user.email === "srcindocs@gmail.com" || user.name.toLowerCase().includes("admin");

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
            <TierBadge level={user.level} isPro={user.isPro} isAdmin={isAdmin} />
          </div>
          
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3 w-3" />
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