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
  const daysUntilBonus = 7 - (streakDays % 7);

  return (
    <Card className={cn(
      "bg-gradient-secondary border-border flex items-center gap-2 w-fit",
      currentSize.card,
      className
    )}>
      <div className={cn("flex items-center gap-1", getStreakColor())}>
        <StreakIcon className={currentSize.icon} />
        <span className={cn("font-medium font-orbitron", currentSize.text)}>
          {streakDays}
        </span>
      </div>
      
      <div className={cn("text-muted-foreground", currentSize.text)}>
        days
      </div>

      {isWeeklyStreak && (
        <div className={cn(
          "bg-gradient-primary text-primary-foreground rounded-full font-medium",
          currentSize.badge
        )}>
          Week Warrior!
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