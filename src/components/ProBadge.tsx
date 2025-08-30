import { Crown, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePro } from "@/hooks/usePro";

interface ProBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  targetUserIsPro?: boolean;
  targetUserSubscriptionType?: string;
}

export function ProBadge({ className, size = 'md', showLabel = true, targetUserIsPro, targetUserSubscriptionType }: ProBadgeProps) {
  const { proStatus } = usePro();

  // FIXED: For other users, ONLY show their actual subscription type
  // For current user (when no target specified), use current user's status
  const subscriptionType = targetUserSubscriptionType !== undefined 
    ? targetUserSubscriptionType 
    : proStatus.subscriptionType;

  // CRITICAL FIX: If this is for another user (targetUserSubscriptionType was passed)
  // and they don't have a subscription, don't show badge at all - NO FALLBACK TO VIEWER
  if (targetUserSubscriptionType !== undefined && !targetUserSubscriptionType) {
    return null;
  }
  
  // For current user, show badge only if they have subscription
  if (targetUserSubscriptionType === undefined && !subscriptionType) {
    return null;
  }

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs gap-1',
    md: 'px-2 py-1 text-sm gap-1.5', 
    lg: 'px-3 py-1.5 text-base gap-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const isYearlyPro = subscriptionType === '1_year';
  const icon = isYearlyPro ? <Crown className={iconSizes[size]} /> : <Star className={iconSizes[size]} />;

  const badgeStyles = isYearlyPro
    ? {
        gradient: "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600",
        hover: "hover:from-purple-700 hover:via-pink-700 hover:to-blue-700",
        border: "border-2 border-white/30",
        shadow: "shadow-2xl shadow-purple-500/25"
      }
    : {
        gradient: "bg-gradient-to-r from-amber-400 to-orange-500",
        hover: "hover:from-amber-500 hover:to-orange-600", 
        border: "border-2 border-white/20",
        shadow: "shadow-lg"
      };

  return (
    <div className={cn(
      "inline-flex items-center rounded-full font-semibold transition-all",
      "text-white relative overflow-hidden",
      badgeStyles.gradient,
      badgeStyles.hover,
      badgeStyles.border,
      badgeStyles.shadow,
      sizeClasses[size],
      className
    )}>
      {isYearlyPro && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      )}
      {icon}
      {showLabel && (
        <span className="font-bold relative z-10">
          {isYearlyPro ? 'PRO+' : 'PRO'}
        </span>
      )}
    </div>
  );
}