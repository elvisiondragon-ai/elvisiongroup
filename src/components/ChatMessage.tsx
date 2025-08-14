import { TierBadge } from "./TierBadge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
interface ChatMessageProps {
  user: {
    id: string;
    name: string;
    avatar?: string;
    level: number;
    isPro?: boolean;
  };
  message: string;
  timestamp: Date;
}
export function ChatMessage({
  user,
  message,
  timestamp
}: ChatMessageProps) {
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };
  return <div className="flex gap-3 p-4 hover:bg-card/50 transition-colors">
      <Avatar className="w-10 h-10 border border-border">
        <AvatarImage src={user.avatar} />
        <AvatarFallback className="bg-muted text-muted-foreground font-orbitron">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">{user.name}</span>
          <TierBadge level={user.level} isPro={user.isPro} />
        </div>
        
        
        
        <span className="text-xs text-muted-foreground">
          {timestamp.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit"
        })}
        </span>
      </div>
    </div>;
}