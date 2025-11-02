import { TierBadge } from "./TierBadge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { GoldReport } from "./GoldReport";
// Updated spiritual icons for streak tiers
import { GiTrophy, GiFire, GiHorseHead, GiSailboat, GiMoon, GiMeditation } from "react-icons/gi";

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
  currentUserIsAdmin?: boolean;
  isGoldReported?: boolean;
  onDelete?: (messageId: string) => void;
  onGoldReportToggle?: (messageId: string, isGoldReported: boolean) => void;
}

export function ChatMessage({ id, user, message, timestamp, currentUserId, currentUserIsAdmin, isGoldReported, onDelete, onGoldReportToggle }: ChatMessageProps) {
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
    // Make message disappear from UI with slide left animation
    const messageElement = document.querySelector(`[data-message-id="${id}"]`);
    if (messageElement) {
      messageElement.style.opacity = '0';
      messageElement.style.transform = 'translateX(-100%)';
      messageElement.style.transition = 'all 0.5s ease-out'; // 500ms

      // Remove from DOM after animation
      setTimeout(() => {
        if (onDelete) {
          onDelete(id);
        }
      }, 500); // 500ms
    } else {
      // Fallback if element not found
      if (onDelete) {
        onDelete(id);
      }
    }
  };

  const canDelete = currentUserIsAdmin || currentUserId === user.id;

  return (
    <div
      data-message-id={id}
      className={cn(
        "flex gap-3 p-4 transition-colors",
        isGoldReported
          ? "bg-gradient-to-r from-amber-400/60 via-yellow-400/60 to-amber-500/60 shadow-lg shadow-amber-500/20"
          : "hover:bg-card/50"
      )}
    >
      <Avatar 
        className="w-10 h-10 border border-border" 
        onContextMenu={(e) => e.preventDefault()}
        onTouchStart={(e) => e.preventDefault()}
        onTouchEnd={(e) => e.preventDefault()}
        onTouchMove={(e) => e.preventDefault()}
        style={{ 
          userSelect: 'none', 
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        <AvatarImage 
          src={user.avatar} 
          onContextMenu={(e) => e.preventDefault()} 
          onTouchStart={(e) => e.preventDefault()}
          onTouchEnd={(e) => e.preventDefault()}
          onTouchMove={(e) => e.preventDefault()}
          draggable={false}
          style={{ 
            userSelect: 'none', 
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
            WebkitTapHighlightColor: 'transparent',
            pointerEvents: 'none'
          }}
        />
        <AvatarFallback className="bg-muted text-muted-foreground font-exo">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn(
                "font-semibold transition-all duration-300",
                user.isAdmin 
                  ? "bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white px-3 py-1.5 rounded-lg shadow-2xl shadow-red-500/25 hover:from-red-700 hover:via-red-800 hover:to-red-900"
                  : "text-foreground"
              )}>
                {user.name}
              </span>
              <TierBadge level={user.level} isPro={user.isPro} isAdmin={user.isAdmin} achievements={[]} subscriptionType={user.subscriptionType} showProBadge={true} />
            </div>
            
            {/* Streak badges - Under username - Multiple Tiers - Hidden for Admin */}
            {!user.isAdmin && user.streak_days >= 7 && (
              <div className="flex items-center gap-1" style={{ minHeight: '24px' }}>
                {user.streak_days >= 500 ? (
                  <div className="streak-badge streak-ignis shadow-sm">
                    <GiFire className="w-3 h-3" style={{ flexShrink: 0 }} />
                    <span className="font-medium">Ignis 500+</span>
                  </div>
                ) : user.streak_days >= 320 ? (
                  <div className="streak-badge streak-horsemen shadow-sm">
                    <GiHorseHead className="w-3 h-3" style={{ flexShrink: 0 }} />
                    <span className="font-medium">Horsemen 320+</span>
                  </div>
                ) : user.streak_days >= 90 ? (
                  <div className="streak-badge streak-wanderer shadow-sm">
                    <GiSailboat className="w-3 h-3" style={{ flexShrink: 0 }} />
                    <span className="font-medium">Wanderer 90+</span>
                  </div>
                ) : user.streak_days >= 60 ? (
                  <div className="streak-badge streak-lumina shadow-sm">
                    <GiMoon className="w-3 h-3" style={{ flexShrink: 0 }} />
                    <span className="font-medium">Lumina 60+</span>
                  </div>
                ) : user.streak_days >= 30 ? (
                  <div className="streak-badge streak-seeker shadow-sm">
                    <GiSailboat className="w-3 h-3" style={{ flexShrink: 0 }} />
                    <span className="font-medium">Seeker 30+</span>
                  </div>
                ) : (
                  <div className="streak-badge streak-warrior shadow-sm">
                    <GiTrophy className="w-3 h-3" style={{ flexShrink: 0 }} />
                    <span className="font-medium">Warrior 7+</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            {currentUserIsAdmin && (
              <GoldReport
                messageId={id}
                isAdmin={currentUserIsAdmin}
                isGoldReported={isGoldReported}
                messageContent={message}
                onToggle={(isGoldReported) => {
                  if (onGoldReportToggle) {
                    onGoldReportToggle(id, isGoldReported);
                  }
                }}
              />
            )}
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
        </div>
        
        <p className={cn(
          "leading-relaxed",
          isGoldReported ? "text-white font-medium" : "text-muted-foreground"
        )}>{message}</p>
        
        <span className={cn(
          "text-xs",
          isGoldReported ? "text-white/90" : "text-muted-foreground"
        )}>
          {timestamp.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit"
          })}
        </span>
      </div>
    </div>
  );
}