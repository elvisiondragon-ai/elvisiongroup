import { Crown, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProBadge } from "./ProBadge";
import { usePro } from "@/hooks/usePro";

interface TierBadgeProps {
  level: number;
  isPro?: boolean;
  className?: string;
  showProBadge?: boolean;
}

export function TierBadge({ level, isPro = false, className, showProBadge = true }: TierBadgeProps) {
  const { proStatus } = usePro();
  
  // Use the unified pro status instead of the isPro prop
  const actualIsPro = proStatus.isPro && proStatus.proBadge;
  
  // Don't show ProBadge if pro badge is disabled or user doesn't have pro access
  const shouldShowProBadge = showProBadge && actualIsPro;
  
  const getTierStyle = () => {
    if (level >= 9) return "tier-master";
    if (actualIsPro || level >= 6) return "tier-pro";
    if (level >= 3) return "tier-premium";
    return "tier-basic";
  };

  const getTierIcon = () => {
    if (level >= 9) return <Crown className="w-3 h-3" />;
    if (actualIsPro && !showProBadge) return <Star className="w-3 h-3" />;
    if (level >= 3) return <Zap className="w-3 h-3" />;
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