import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TierBadge } from "@/components/TierBadge";
import { supabase } from "@/integrations/supabase/client";
import { Play, Headphones, BookOpen, Zap } from "lucide-react";
import heroImage from "@/assets/hero-meditation.jpg";

interface HomeProps {
  onNavigate: (tab: string) => void;
}

interface UserProfile {
  display_name: string | null;
  level: number;
  experience_points: number;
  streak_days: number;
  total_sessions: number;
}

export function Home({ onNavigate }: HomeProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        await fetchUserProfile(user.id);
      }
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

      if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const displayName = userProfile?.display_name || user?.email?.split('@')[0] || "User";
  const nextLevelXp = userProfile ? userProfile.level * 100 : 100;

  const features = [
    {
      title: "Sesi Meditasi",
      description: "Guided meditation dalam bahasa Indonesia",
      icon: Play,
      color: "text-primary",
    },
    {
      title: "Verse of Secret Decree",
      description: "Rahasia Frekuensi alam untuk mengubah realitasmu",
      icon: Headphones,
      color: "text-accent",
    },
    {
      title: "Jurnal Spiritual",
      description: "Catat perjalanan transformasi Anda",
      icon: BookOpen,
      color: "text-gold",
    },
    {
      title: "Komunitas",
      description: "Bergabung dengan soul tribe",
      icon: Zap,
      color: "text-neon-green",
    },
  ];

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="h-64 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="relative h-full flex items-end p-6">
            <div className="flex items-center gap-4">
              <img 
                src="/lovable-uploads/fbd7b86c-d8ea-447e-87ad-d67254074e61.png" 
                alt="eL Vision Group Logo" 
                className="w-16 h-16 object-contain"
              />
              <div>
                <h1 className="text-3xl font-bold font-orbitron text-foreground mb-2">
                  Selamat Datang di
                  <span className="block bg-gradient-primary bg-clip-text text-transparent">
                    eL Vision Group
                  </span>
                </h1>
                <p className="text-muted-foreground">
                  Transformasi diri melalui teknologi spiritual
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="p-6">
        <Card className="p-4 bg-gradient-secondary border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground">{displayName}</h3>
                <TierBadge level={userProfile?.level || 1} />
                {(userProfile?.streak_days || 0) >= 7 && (
                  <span className="px-2 py-1 text-xs font-medium bg-gradient-primary text-primary-foreground rounded-full">
                    Week Warrior
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Streak: {userProfile?.streak_days || 0} hari
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold font-orbitron text-primary">
                {userProfile?.experience_points || 0} XP
              </div>
              <div className="text-xs text-muted-foreground">
                {nextLevelXp - (userProfile?.experience_points || 0)} XP to next level
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Level {userProfile?.level || 1} Progress</span>
              <span>{Math.round(((userProfile?.experience_points || 0) / nextLevelXp) * 100)}%</span>
            </div>
            <Progress 
              value={((userProfile?.experience_points || 0) / nextLevelXp) * 100} 
              className="h-2"
            />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-6 space-y-4">
        <h2 className="text-xl font-semibold font-orbitron">Jelajahi</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-4 bg-card hover:bg-card/80 border-border hover:border-primary transition-all duration-300 cursor-pointer"
              onClick={() => {
                console.log("Feature clicked:", feature.title);
                if (feature.title === "Komunitas") {
                  onNavigate("chat");
                } else if (feature.title === "Verse of Secret Decree") {
                  onNavigate("audio-therapy");
                } else if (feature.title === "Jurnal Spiritual") {
                  console.log("Navigating to spiritual-journal");
                  onNavigate("spiritual-journal");
                } else if (feature.title === "Sesi Meditasi") {
                  onNavigate("meditation-sessions");
                }
              }}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-3 rounded-full bg-muted ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Community Preview */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold font-orbitron">Komunitas Aktif</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate("chat")}
            className="text-primary hover:text-primary/80"
          >
            Lihat Semua
          </Button>
        </div>
        
        <Card className="p-4 bg-gradient-secondary border-border">
          <div className="text-center">
            <div className="text-2xl font-bold font-orbitron text-primary mb-2">
              127
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Anggota online sekarang
            </p>
            <Button 
              onClick={() => onNavigate("chat")}
              className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium"
            >
              Bergabung di Chat
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}