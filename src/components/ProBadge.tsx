import { Crown, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  isPro?: boolean;
  subscriptionType?: string | null;
  proBadge?: boolean;
}

export function ProBadge({ 
  className, 
  size = 'md', 
  showLabel = true,
  isPro = false,
  subscriptionType = null,
  proBadge = false
}: ProBadgeProps) {
  // Show badge if user is confirmed Pro with badge access
  if (!isPro || !proBadge) {
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

  const isYearlyPro = subscriptionType === 'yearly';
  const icon = isYearlyPro ? <Crown className={iconSizes[size]} /> : <Star className={iconSizes[size]} />;

  return (
    <div className={cn(
      "inline-flex items-center rounded-full font-semibold transition-all",
      "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg",
      "hover:from-amber-500 hover:to-orange-600 hover:shadow-xl",
      "border-2 border-white/20",
      sizeClasses[size],
      className
    )}>
      {icon}
      {showLabel && (
        <span className="font-bold">
          {isYearlyPro ? 'PRO+' : 'PRO'}
        </span>
      )}
    </div>
  );
}