import { Crown, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProBadge } from "./ProBadge";
import { usePro } from "@/hooks/usePro";
import { useUserProfile } from "@/contexts/UserProfileContext";

interface TierBadgeProps {
  level: number;
  isPro?: boolean;
  className?: string;
  showProBadge?: boolean;
}

export function TierBadge({ level, isPro = false, className, showProBadge = true }: TierBadgeProps) {
  const { proStatus } = usePro();
  const { userProfile } = useUserProfile();
  
  // Use the isPro prop passed from parent (individual user's status)
  const actualIsPro = isPro;
  
  // Check if user has level 3 achievement
  const hasLevel3Achievement = userProfile?.achievements?.includes('level_3') ?? false;
  
  // Don't show ProBadge if pro badge is disabled or user doesn't have pro access
  const shouldShowProBadge = showProBadge && actualIsPro;
  
  const getTierStyle = () => {
    if (level >= 10) return "tier-master";
    if (actualIsPro || level >= 6) return "tier-pro";
    if (level >= 3 || hasLevel3Achievement) return "tier-premium";
    return "tier-basic";
  };

  const getTierIcon = () => {
    if (level >= 10) return <Crown className="w-3 h-3" />;
    if (actualIsPro && !showProBadge) return <Star className="w-3 h-3" />;
    if (level >= 3 || hasLevel3Achievement) return <Zap className="w-3 h-3 text-purple-400" />;
    return null;
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn("tier-badge", getTierStyle(), className)}>
        <div className="flex items-center gap-1">
          <span>Lv {level}</span>
          {actualIsPro && !showProBadge && <span>- Pro</span>}
          {getTierIcon()}
        </div>
      </div>
      {shouldShowProBadge && <ProBadge size="sm" />}
    </div>
  );
}