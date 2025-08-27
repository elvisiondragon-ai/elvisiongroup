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
  isCurrentUser?: boolean;
}

export function TierBadge({ level, isPro = false, className, showProBadge = true, isCurrentUser = false }: TierBadgeProps) {
  const { proStatus } = usePro();
  const { userProfile } = useUserProfile();
  
  // Only use current user's pro status and achievements if this is for the current user
  const actualIsPro = isCurrentUser ? (proStatus.isPro && proStatus.proBadge) : false;
  
  // Check if user has level 3 achievement (only for current user)
  const hasLevel3Achievement = isCurrentUser ? (userProfile?.achievements?.includes('level_3') ?? false) : false;
  
  // Don't show ProBadge for other users, only for current user
  const shouldShowProBadge = showProBadge && actualIsPro && isCurrentUser;
  
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