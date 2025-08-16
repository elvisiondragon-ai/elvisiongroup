import { Crown, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";


interface TierBadgeProps {
  level: number;
  isPro?: boolean;
  className?: string;
  isAdmin?: boolean;
}

export function TierBadge({ level, isPro = false, className, isAdmin = false }: TierBadgeProps) {
  const getTierStyle = () => {
    if (isAdmin) return "tier-admin";
    if (level >= 9) return "tier-master";
    if (isPro || level >= 6) return "tier-pro";
    if (level >= 3) return "tier-premium";
    return "tier-basic";
  };

  const getTierIcon = () => {
    if (isAdmin) return <Crown className="w-3 h-3" />;
    if (level >= 9) return <Crown className="w-3 h-3" />;
    if (isPro) return <Star className="w-3 h-3" />;
    if (level >= 3) return <Zap className="w-3 h-3" />;
    return null;
  };

  return (
    <div className={cn("tier-badge", getTierStyle(), className)}>
      <div className="flex items-center gap-1">
        <span>{isAdmin ? "ADMIN" : `Lv ${level}`}</span>
        {isPro && level < 9 && !isAdmin && <span>- Pro</span>}
        {getTierIcon()}
      </div>
    </div>
  );
}