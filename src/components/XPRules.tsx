import { Trophy, Music, BookOpen, MessageCircle, Calendar, Star } from "lucide-react";
import { Card } from "./ui/card";

export function XPRules() {
  const rules = [
    {
      action: "Mendengar audio sampai selesai",
      xp: 10,
      icon: Music,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    },
    {
      action: "Menulis journal spiritual",
      xp: 5,
      icon: BookOpen,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      action: "Menekan tombol chat",
      xp: 1,
      icon: MessageCircle,
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    }
  ];

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">How to Earn EXP</h3>
      </div>
      
      {/* Daily Activities */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-medium text-muted-foreground">Setiap aktivitas anda:</h4>
        {rules.map((rule, index) => {
          const Icon = rule.icon;
          return (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
              <div className={`p-2 rounded-full ${rule.bgColor}`}>
                <Icon className={`w-4 h-4 ${rule.color}`} />
              </div>
              <div className="flex-1">
                <span className="text-sm text-foreground">{rule.action}</span>
              </div>
              <span className="text-sm font-semibold text-primary">+{rule.xp} EXP</span>
            </div>
          );
        })}
      </div>

      {/* Daily Limit */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-medium text-foreground">MAX 35 EXP / DAY</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Maksimal 35 EXP per hari dari semua aktivitas
        </p>
      </div>

      {/* Weekly Challenge */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-foreground">WEEKLY CHALLENGE BONUS</span>
        </div>
        <p className="text-xs text-muted-foreground mb-1">
          Jika hit 35 EXP setiap hari selama 7 hari akan dapat bonus:
        </p>
        <span className="text-lg font-bold text-yellow-400">+50 EXP</span>
      </div>
    </Card>
  );
}