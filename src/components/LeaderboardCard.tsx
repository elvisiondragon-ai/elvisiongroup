import { TierBadge } from "./TierBadge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";

interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  xp: number;
  isPro?: boolean;
  rank: number;
  subscriptionType?: string;
}

interface LeaderboardCardProps {
  user: LeaderboardUser;
}

export function LeaderboardCard({ user }: LeaderboardCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRankStyle = () => {
    if (user.rank === 1) return "text-gold";
    if (user.rank === 2) return "text-silver";
    if (user.rank === 3) return "text-accent";
    return "text-muted-foreground";
  };

  return (
    <Card className="p-3 sm:p-4 bg-gradient-secondary border-border hover:border-primary transition-all duration-300">
      <div className="flex items-center gap-2 sm:gap-4">
        <div className={`text-lg sm:text-2xl font-bold font-orbitron flex-shrink-0 ${getRankStyle()}`}>
          #{user.rank}
        </div>
        
        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border border-border flex-shrink-0">
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="bg-muted text-muted-foreground font-orbitron">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-foreground truncate text-sm sm:text-base">{user.name}</span>
            <div className="flex-shrink-0">
              <TierBadge level={user.level} isPro={user.isPro} achievements={[]} subscriptionType={user.subscriptionType} />
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
            <span className="flex-shrink-0">{user.xp} XP</span>
            <div className="w-16 sm:w-20 h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-primary"
                style={{ width: `${(user.xp % 1000) / 10}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}