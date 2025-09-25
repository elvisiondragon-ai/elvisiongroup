import { TierBadge } from "./TierBadge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { GiTrophy, GiFire } from "react-icons/gi";

interface ChatMessageProps {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    level: number;
    isPro?: boolean;
    isAdmin?: boolean;
    subscriptionType?: string;
    streak_days?: number;
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
    // Call parent handler which handles database delete + UI update
    if (onDelete) {
      await onDelete(id);
    }
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
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className={cn(
                "font-semibold transition-all duration-300",
                user.isAdmin 
                  ? "bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white px-3 py-1.5 rounded-lg shadow-2xl shadow-red-500/25 hover:from-red-700 hover:via-red-800 hover:to-red-900"
                  : "text-foreground"
              )}>
                {user.name}
              </span>
              <TierBadge level={user.level} isPro={user.isPro} isAdmin={user.isAdmin} achievements={[]} subscriptionType={user.subscriptionType} />
            </div>
            
            {/* Streak badges below username */}
            {user.streak_days >= 7 && (
              <div className="flex items-center gap-1">
                {user.streak_days >= 320 ? (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-red-800/80 via-red-700/80 to-orange-800/80 border border-red-500 text-orange-100 shadow-sm">
                    <GiFire className="w-3 h-3 drop-shadow-sm" />
                    <span className="font-medium">Ignis Horsemen 320+ Streak Days</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-yellow-800/80 via-yellow-700/80 to-orange-800/80 border border-yellow-400 text-yellow-100 shadow-sm">
                    <GiTrophy className="w-3 h-3 drop-shadow-sm" />
                    <span className="font-medium">Week Warrior</span>
                  </div>
                )}
              </div>
            )}
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