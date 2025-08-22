import { Crown, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProBadge } from "./ProBadge";

interface TierBadgeProps {
  level: number;
  isPro?: boolean;
  className?: string;
  showProBadge?: boolean;
}

export function TierBadge({ level, isPro = false, className, showProBadge = true }: TierBadgeProps) {
  // Don't show ProBadge if isPro is undefined (loading state)
  const shouldShowProBadge = showProBadge && isPro === true;
  const getTierStyle = () => {
    if (level >= 9) return "tier-master";
    if (isPro || level >= 6) return "tier-pro";
    if (level >= 3) return "tier-premium";
    return "tier-basic";
  };

  const getTierIcon = () => {
    if (level >= 9) return <Crown className="w-3 h-3" />;
    if (isPro && !showProBadge) return <Star className="w-3 h-3" />;
    if (level >= 3) return <Zap className="w-3 h-3" />;
    return null;
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn("tier-badge", getTierStyle(), className)}>
        <div className="flex items-center gap-1">
          <span>Lv {level}</span>
          {isPro && !showProBadge && <span>- Pro</span>}
          {getTierIcon()}
        </div>
      </div>
      {shouldShowProBadge && <ProBadge size="sm" />}
    </div>
  );
}