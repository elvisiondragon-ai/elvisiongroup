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
  onNavigate: (tab: string) => void;
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

export function Profile({ onLogout, onNavigate }: ProfileProps) {
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
      onLogout();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Create default profile data if not found
  const defaultProfile: UserProfile = {
    display_name: user?.email?.split('@')[0] || "Alex",
    level: 3,
    experience_points: 250,
    streak_days: 5,
    total_sessions: 42,
    achievements: ["First Step", "Week Warrior"],
    created_at: new Date().toISOString()
  };

  const profile = userProfile || defaultProfile;

  const displayName = profile.display_name || "Renata";
  const nextLevelXp = profile.level * 100;
  const joinDate = new Date(profile.created_at).toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'short' 
  });

  const achievements = [
    { name: "First Step", description: "Joined eL Vision Group", unlocked: true },
    { name: "Week Warrior", description: "7 days streak", unlocked: profile.streak_days >= 7 },
    { name: "Zen Master", description: "Complete 100 sessions", unlocked: profile.total_sessions >= 100 },
    { name: "Soul Leader", description: "Reach level 5", unlocked: profile.level >= 5 },
  ];

  const stats = [
    {
      icon: Calendar,
      label: "Total Meditations",
      value: profile.total_sessions,
      color: "text-primary"
    },
    {
      icon: Target,
      label: "Total Sessions",
      value: `${profile.total_sessions}`,
      color: "text-neon-green"
    },
    {
      icon: BookOpen,
      label: "Points Earned",
      value: `${profile.experience_points}`,
      color: "text-accent"
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
          <TierBadge level={profile.level} />
          <span className="text-sm text-muted-foreground">
            Bergabung sejak {joinDate}
          </span>
        </div>
        
        <div className="max-w-xs mx-auto mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Level {profile.level}</span>
            <span>{profile.experience_points} / {nextLevelXp} XP</span>
          </div>
          <Progress 
            value={(profile.experience_points / nextLevelXp) * 100} 
            className="h-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {nextLevelXp - profile.experience_points} XP untuk level selanjutnya
          </p>
        </div>

        {/* READ TUTORIAL Button */}
        <Button 
          variant="outline"
          className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium px-8 py-2 rounded-full glow-primary border-primary hover:border-primary"
          onClick={() => {
            onNavigate('tutorial');
          }}
        >
          READ TUTORIAL
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 bg-gradient-secondary border-border text-center">
              <div className={`${stat.color} mb-2 flex justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="font-bold font-orbitron text-foreground text-lg">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">
                {stat.label}
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
          onClick={() => {
            toast({
              title: "Edit Profil",
              description: "Fitur edit profil akan segera tersedia",
            });
          }}
        >
          <User className="w-4 h-4" />
          Edit Profil
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3 border-border hover:border-primary"
          onClick={() => {
            toast({
              title: "Preferensi",
              description: "Fitur pengaturan preferensi akan segera tersedia",
            });
          }}
        >
          <Settings className="w-4 h-4" />
          Preferensi
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3 border-yellow-400 bg-gradient-to-r from-yellow-400/10 to-amber-500/10 text-yellow-400 hover:border-yellow-300 hover:bg-gradient-to-r hover:from-yellow-400/20 hover:to-amber-500/20 hover:text-yellow-300 transition-all duration-300"
        >
          <Crown className="w-4 h-4 text-yellow-400" />
          Upgrade ke VIP
        </Button>

        <Button 
          variant="destructive"
          onClick={handleLogout}
          className="w-full justify-start gap-3"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}