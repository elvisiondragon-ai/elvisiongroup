import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TierBadge } from "@/components/TierBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Settings, 
  Crown, 
  Zap, 
  Calendar, 
  Target,
  BookOpen,
  Award,
  LogOut
} from "lucide-react";

interface ProfileProps {
  onLogout: () => void;
}

export function Profile({ onLogout }: ProfileProps) {
  const userProfile = {
    name: "Anda",
    email: "spiritual.seeker@nexus.app",
    level: 3,
    xp: 1250,
    nextLevelXp: 2000,
    streak: 7,
    totalSessions: 45,
    totalMinutes: 1350,
    joinDate: "2024-01-01",
    achievements: [
      { name: "First Step", description: "Completed first meditation", unlocked: true },
      { name: "Week Warrior", description: "7 days streak", unlocked: true },
      { name: "Zen Master", description: "100 meditation sessions", unlocked: false },
      { name: "Soul Leader", description: "Reach level 5", unlocked: false },
    ]
  };

  const stats = [
    {
      icon: Calendar,
      label: "Streak",
      value: `${userProfile.streak} hari`,
      color: "text-neon-green"
    },
    {
      icon: Target,
      label: "Total Sesi",
      value: userProfile.totalSessions,
      color: "text-primary"
    },
    {
      icon: BookOpen,
      label: "Total Menit",
      value: `${userProfile.totalMinutes}m`,
      color: "text-accent"
    },
    {
      icon: Award,
      label: "Achievements",
      value: `${userProfile.achievements.filter(a => a.unlocked).length}/${userProfile.achievements.length}`,
      color: "text-gold"
    }
  ];

  return (
    <div className="pb-20">
      {/* Profile Header */}
      <div className="p-6 text-center">
        <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary glow-primary">
          <AvatarImage src="" />
          <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-orbitron">
            A
          </AvatarFallback>
        </Avatar>
        
        <h1 className="text-2xl font-bold font-orbitron text-foreground mb-2">
          {userProfile.name}
        </h1>
        
        <div className="flex items-center justify-center gap-2 mb-3">
          <TierBadge level={userProfile.level} />
          <span className="text-sm text-muted-foreground">
            Bergabung sejak Jan 2024
          </span>
        </div>
        
        <div className="max-w-xs mx-auto">
          <div className="flex justify-between text-sm mb-2">
            <span>Level {userProfile.level}</span>
            <span>{userProfile.xp} / {userProfile.nextLevelXp} XP</span>
          </div>
          <Progress 
            value={(userProfile.xp / userProfile.nextLevelXp) * 100} 
            className="h-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {userProfile.nextLevelXp - userProfile.xp} XP untuk level selanjutnya
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-semibold font-orbitron text-foreground mb-4">
          Statistik Spiritual
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 bg-gradient-secondary border-border">
              <div className="flex items-center gap-3">
                <div className={`${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold font-orbitron text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-semibold font-orbitron text-foreground mb-4">
          Pencapaian
        </h2>
        
        <div className="space-y-3">
          {userProfile.achievements.map((achievement, index) => (
            <Card 
              key={index} 
              className={`p-4 border-border ${
                achievement.unlocked 
                  ? "bg-gradient-secondary opacity-100" 
                  : "bg-muted/30 opacity-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  achievement.unlocked 
                    ? "bg-gradient-primary text-primary-foreground glow-primary" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">
                    {achievement.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
                {achievement.unlocked && (
                  <div className="text-neon-green">
                    ✓
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="px-6 space-y-3">
        <h2 className="text-lg font-semibold font-orbitron text-foreground mb-4">
          Pengaturan
        </h2>
        
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3 border-border hover:border-primary"
        >
          <User className="w-4 h-4" />
          Edit Profil
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3 border-border hover:border-primary"
        >
          <Settings className="w-4 h-4" />
          Preferensi
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3 border-border hover:border-primary"
        >
          <Crown className="w-4 h-4" />
          Upgrade ke VIP
        </Button>

        <Button 
          variant="outline" 
          onClick={onLogout}
          className="w-full justify-start gap-3 border-destructive hover:border-destructive text-destructive hover:text-destructive"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}