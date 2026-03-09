import { Crown, Star, Zap, Leaf, Droplets, Flame } from "lucide-react";
import { GiBatMask } from "react-icons/gi";
import { cn } from "@/lib/utils";
import { ProBadge } from "./ProBadge";
import { AdminBadge } from "./AdminBadge";
import { usePro } from "@/hooks/usePro";

interface TierBadgeProps {
  level: number;
  isPro?: boolean;
  isAdmin?: boolean;
  className?: string;
  showProBadge?: boolean;
  achievements?: string[];
  subscriptionType?: string;
}

export function TierBadge({ level, isPro = false, isAdmin = false, className, showProBadge = true, achievements = [], subscriptionType }: TierBadgeProps) {
  // Check if user has level 3 achievement from passed achievements
  const hasLevel3Achievement = achievements?.includes('level_3') ?? false;
  
  // Show ProBadge based on THIS specific user's subscription status (isPro/subscriptionType)
  // Everyone can see everyone's Pro status in chat
  const shouldShowProBadge = showProBadge && subscriptionType && subscriptionType !== 'false' && subscriptionType !== '' && !isAdmin;
  
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
    if (level >= 9) return <GiBatMask className="w-3 h-3" />;
    if (level >= 7) return <Droplets className="w-3 h-3" />;
    if (level >= 5) return <Leaf className="w-3 h-3" />;
    if (level >= 3 || hasLevel3Achievement) return <Zap className="w-3 h-3" />;
    return null;
  };

  return (
    <div className="flex items-center gap-2">
      {/* Hide level badge for admin users */}
      {!isAdmin && (
        <div className={cn("tier-badge", getTierStyle(), className)}>
          <div className="flex items-center gap-1">
            <span>Lv {level}</span>
            {getTierIcon()}
          </div>
        </div>
      )}
      {isAdmin && <AdminBadge size="sm" />}
      {shouldShowProBadge && <ProBadge size="sm" targetUserIsPro={isPro} targetUserSubscriptionType={subscriptionType} />}
    </div>
  );
}