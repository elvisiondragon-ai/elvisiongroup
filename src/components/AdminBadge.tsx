import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function AdminBadge({ className, size = 'sm', showLabel = true }: AdminBadgeProps) {
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

  return (
    <div className={cn(
      "inline-flex items-center rounded-full font-semibold transition-all",
      "text-white relative overflow-hidden",
      "bg-gradient-to-r from-red-600 via-red-700 to-red-800",
      "hover:from-red-700 hover:via-red-800 hover:to-red-900",
      "border-2 border-white/30",
      "shadow-2xl shadow-red-500/25",
      sizeClasses[size],
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      <Shield className={iconSizes[size]} />
      {showLabel && (
        <span className="font-bold relative z-10">
          ADMIN
        </span>
      )}
    </div>
  );
}