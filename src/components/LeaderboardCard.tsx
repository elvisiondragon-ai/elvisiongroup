import { TierBadge } from "./TierBadge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";

interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  xp: number;
  isVip?: boolean;
  rank: number;
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
    if (user.rank === 1) return "text-gold glow-gold";
    if (user.rank === 2) return "text-silver";
    if (user.rank === 3) return "text-accent";
    return "text-muted-foreground";
  };

  return (
    <Card className="p-4 bg-gradient-secondary border-border hover:border-primary transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className={`text-2xl font-bold font-orbitron ${getRankStyle()}`}>
          #{user.rank}
        </div>
        
        <Avatar className="w-12 h-12 border border-border">
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="bg-muted text-muted-foreground font-orbitron">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-foreground">{user.name}</span>
            <TierBadge level={user.level} isVip={user.isVip} />
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{user.xp} XP</span>
            <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
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