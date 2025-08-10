import { Trophy, Music, BookOpen, MessageCircle, Calendar, Star } from "lucide-react";
import { Card } from "./ui/card";

export function XPRules() {
  const rules = [
    {
      action: "Listen to audio until finished",
      xp: 10,
      icon: Music,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      limit: "Max 20 XP/day"
    },
    {
      action: "Complete spiritual journal entry",
      xp: 5,
      icon: BookOpen,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      limit: "Max 5 XP/day"
    },
    {
      action: "Send message in community chat",
      xp: 1,
      icon: MessageCircle,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      limit: "Max 10/day"
    },
    {
      action: "Daily login streak bonus",
      xp: 5,
      icon: Calendar,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10"
    },
    {
      action: "Weekly challenge bonus",
      xp: 50,
      icon: Star,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10"
    }
  ];

  const levelRequirements = [
    { levels: "1", xp: 100 },
    { levels: "2", xp: 500 },
    { levels: "3", xp: 1500 },
    { levels: "4", xp: 3000 }
  ];

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">How to Earn XP</h3>
      </div>
      
      <div className="space-y-3 mb-6">
        {rules.map((rule, index) => {
          const Icon = rule.icon;
          return (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
              <div className={`p-2 rounded-full ${rule.bgColor}`}>
                <Icon className={`w-4 h-4 ${rule.color}`} />
              </div>
              <div className="flex-1">
                <span className="text-sm text-foreground">{rule.action}</span>
                {rule.limit && (
                  <span className="text-xs text-muted-foreground ml-2">({rule.limit})</span>
                )}
              </div>
              <span className="text-sm font-semibold text-primary">+{rule.xp} XP</span>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border/50 pt-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Level Requirements</h4>
        <div className="grid grid-cols-2 gap-2">
          {levelRequirements.map((req, index) => (
            <div key={index} className="text-xs text-muted-foreground">
              <span className="font-medium">Lv {req.levels}:</span> {req.xp} XP/level
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}