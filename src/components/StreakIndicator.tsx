import { Calendar, Flame, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StreakIndicatorProps {
  streakDays: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StreakIndicator({ streakDays, className, size = 'md' }: StreakIndicatorProps) {
  const getStreakColor = () => {
    if (streakDays >= 7) return "text-orange-500 glow-orange";
    if (streakDays >= 3) return "text-yellow-500 glow-yellow";
    return "text-muted-foreground";
  };

  const getStreakIcon = () => {
    if (streakDays >= 7) return Flame;
    if (streakDays >= 3) return Award;
    return Calendar;
  };

  const sizes = {
    sm: {
      card: "px-2 py-1",
      icon: "w-3 h-3",
      text: "text-xs",
      badge: "text-xs px-1"
    },
    md: {
      card: "px-3 py-2",
      icon: "w-4 h-4", 
      text: "text-sm",
      badge: "text-sm px-2"
    },
    lg: {
      card: "px-4 py-3",
      icon: "w-5 h-5",
      text: "text-base",
      badge: "text-base px-3"
    }
  };

  const currentSize = sizes[size];
  const StreakIcon = getStreakIcon();
  const isWeeklyStreak = streakDays >= 7;
  const isIgnisHorsemen = streakDays >= 300;
  const daysUntilBonus = 7 - (streakDays % 7);

  return (
    <Card className={cn(
      "border-border flex items-center gap-2 w-fit",
      isIgnisHorsemen 
        ? "bg-gradient-to-r from-red-900 via-red-800 to-orange-900 border-red-500 shadow-lg shadow-red-500/25" 
        : "bg-gradient-secondary",
      currentSize.card,
      className
    )}>
      <div className={cn("flex items-center gap-1", getStreakColor())}>
        <StreakIcon className={cn(
          currentSize.icon,
          isIgnisHorsemen && "animate-bounce",
          streakDays >= 7 && streakDays < 300 && "animate-pulse"
        )} />
        <span className={cn("font-medium font-exo", currentSize.text)}>
          {streakDays}
        </span>
      </div>
      
      <div className={cn("text-muted-foreground", currentSize.text)}>
        days
      </div>

      {isIgnisHorsemen && (
        <div className={cn(
          "bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full font-bold animate-pulse border border-red-400",
          currentSize.badge
        )}>
          Ignis Lord
        </div>
      )}

      {isWeeklyStreak && !isIgnisHorsemen && (
        <div className={cn(
          "bg-gradient-primary text-primary-foreground rounded-full font-medium",
          currentSize.badge
        )}>
          Week Warrior
        </div>
      )}

      {!isWeeklyStreak && streakDays > 0 && (
        <div className={cn(
          "text-muted-foreground",
          currentSize.text
        )}>
          • {daysUntilBonus} more for bonus
        </div>
      )}
    </Card>
  );
}