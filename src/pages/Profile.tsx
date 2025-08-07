import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TierBadge } from "@/components/TierBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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

interface UserProfile {
  display_name: string | null;
  level: number;
  experience_points: number;
  streak_days: number;
  total_sessions: number;
  achievements: string[];
  created_at: string;
}

export function Profile({ onLogout }: ProfileProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        await fetchUserProfile(user.id);
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!userProfile || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <Card className="w-full max-w-md mx-4">
          <div className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Failed to load profile</p>
            <Button onClick={handleLogout} variant="destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const displayName = userProfile.display_name || user?.email?.split('@')[0] || "User";
  const nextLevelXp = userProfile.level * 100;
  const joinDate = new Date(userProfile.created_at).toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'short' 
  });

  const achievements = [
    { name: "First Step", description: "Joined eL Vision Group", unlocked: true },
    { name: "Week Warrior", description: "7 days streak", unlocked: userProfile.streak_days >= 7 },
    { name: "Zen Master", description: "Complete 100 sessions", unlocked: userProfile.total_sessions >= 100 },
    { name: "Soul Leader", description: "Reach level 5", unlocked: userProfile.level >= 5 },
  ];

  const stats = [
    {
      icon: Calendar,
      label: "Streak",
      value: `${userProfile.streak_days} hari`,
      color: "text-neon-green"
    },
    {
      icon: Target,
      label: "Total Sesi",
      value: userProfile.total_sessions,
      color: "text-primary"
    },
    {
      icon: BookOpen,
      label: "Total Menit",
      value: `${userProfile.total_sessions * 15}m`,
      color: "text-accent"
    },
    {
      icon: Award,
      label: "Achievements",
      value: `${achievements.filter(a => a.unlocked).length}/${achievements.length}`,
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
          {displayName}
        </h1>
        
        <div className="flex items-center justify-center gap-2 mb-3">
          <TierBadge level={userProfile.level} />
          <span className="text-sm text-muted-foreground">
            Bergabung sejak {joinDate}
          </span>
        </div>
        
        <div className="max-w-xs mx-auto">
          <div className="flex justify-between text-sm mb-2">
            <span>Level {userProfile.level}</span>
            <span>{userProfile.experience_points} / {nextLevelXp} XP</span>
          </div>
          <Progress 
            value={(userProfile.experience_points / nextLevelXp) * 100} 
            className="h-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {nextLevelXp - userProfile.experience_points} XP untuk level selanjutnya
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
          {achievements.map((achievement, index) => (
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
          onClick={handleLogout}
          className="w-full justify-start gap-3 border-destructive hover:border-destructive text-destructive hover:text-destructive"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}