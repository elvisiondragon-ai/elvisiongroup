import { Crown, Star, Zap, Leaf, Droplets, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProBadge } from "./ProBadge";
import { usePro } from "@/hooks/usePro";

interface TierBadgeProps {
  level: number;
  isPro?: boolean;
  className?: string;
  showProBadge?: boolean;
  achievements?: string[];
  subscriptionType?: string;
}

export function TierBadge({ level, isPro = false, className, showProBadge = true, achievements = [], subscriptionType }: TierBadgeProps) {
  const { proStatus } = usePro();
  
  // Check if user has level 3 achievement from passed achievements
  const hasLevel3Achievement = achievements?.includes('level_3') ?? false;
  
  // Don't show ProBadge if pro badge is disabled or user doesn't have pro access
  const shouldShowProBadge = true;
  
  const getTierStyle = () => {
    if (level >= 10) return "tier-master";
    if (level >= 9) return "tier-fire";
    if (level >= 7) return "tier-water";
    if (level >= 5) return "tier-earth";
    if (level >= 3 || hasLevel3Achievement) return "tier-spirit";
    return "tier-basic";
  };

  const getTierIcon = () => {
    if (level >= 10) return <Crown className="w-3 h-3" />;
    if (level >= 9) return <Flame className="w-3 h-3" />;
    if (level >= 7) return <Droplets className="w-3 h-3" />;
    if (level >= 5) return <Leaf className="w-3 h-3" />;
    if (level >= 3 || hasLevel3Achievement) return <Zap className="w-3 h-3" />;
    return null;
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn("tier-badge", getTierStyle(), className)}>
        <div className="flex items-center gap-1">
          <span>Lv {level}</span>
          {getTierIcon()}
        </div>
      </div>
      {shouldShowProBadge && <ProBadge size="sm" targetUserIsPro={isPro} targetUserSubscriptionType={subscriptionType} />}
    </div>
  );
}