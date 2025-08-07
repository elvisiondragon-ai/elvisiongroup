import { Crown, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface TierBadgeProps {
  level: number;
  isVip?: boolean;
  className?: string;
}

export function TierBadge({ level, isVip = false, className }: TierBadgeProps) {
  const getTierStyle = () => {
    if (level >= 9) return "tier-master";
    if (isVip || level >= 6) return "tier-vip";
    if (level >= 3) return "tier-premium";
    return "tier-basic";
  };

  const getTierIcon = () => {
    if (level >= 9) return <Crown className="w-3 h-3" />;
    if (isVip) return <Star className="w-3 h-3" />;
    if (level >= 3) return <Zap className="w-3 h-3" />;
    return null;
  };

  return (
    <div className={cn("tier-badge", getTierStyle(), className)}>
      <div className="flex items-center gap-1">
        <span>Lv {level}</span>
        {isVip && level < 9 && <span>- VIP</span>}
        {getTierIcon()}
      </div>
    </div>
  );
}