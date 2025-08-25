import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TierBadge } from "@/components/TierBadge";
import { ProBadge } from "@/components/ProBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditProfile } from "@/components/EditProfile";
import { NotificationSettings } from "@/components/NotificationSettings";
import { ProUpgrade } from "@/components/ProUpgrade";

import { usePro } from "@/hooks/usePro";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { 
  User, 
  Settings, 
  Crown, 
  Zap, 
  Calendar, 
  Target,
  BookOpen,
  Award,
  LogOut,
  Bell,
  ArrowLeft,
  Trash2
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
  avatar_url?: string;
}

export function Profile({ onLogout, onNavigate }: ProfileProps) {
  const { userProfile, user, loading } = useUserProfile();
  const [editingProfile, setEditingProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProUpgrade, setShowProUpgrade] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { proStatus } = usePro();
  const { toast } = useToast();

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

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    try {
      // Delete all user data first
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', user.id);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
      }

      // Delete related data
      await Promise.all([
        supabase.from('chat_messages').delete().eq('user_id', user.id),
        supabase.from('reflections').delete().eq('user_id', user.id),
        supabase.from('user_activities').delete().eq('user_id', user.id),
        supabase.from('xp_transactions').delete().eq('user_id', user.id),
        supabase.from('device_tokens').delete().eq('user_id', user.id),
        supabase.from('notification_settings').delete().eq('user_id', user.id),
        supabase.from('pro_subscriptions').delete().eq('user_id', user.id),
        supabase.from('payment_transactions').delete().eq('user_id', user.id),
      ]);

      // Sign out the user after data deletion
      await supabase.auth.signOut();

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted",
      });

      onLogout();
    } catch (error) {
      console.error('Delete account error:', error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
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

  // Create default profile data if not found
  const defaultProfile: UserProfile = {
    display_name: user?.email?.split('@')[0] || "Alex",
    level: 1,
    experience_points: 0,
    streak_days: 0,
    total_sessions: 0,
    achievements: [],
    created_at: new Date().toISOString()
  };

  const profile = userProfile || defaultProfile;

  const displayName = profile.display_name || user?.email?.split('@')[0] || "User";
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

  // Show edit component if editing
  if (editingProfile) {
    return (
      <div className="pb-20">
        <EditProfile
          user={user}
          userProfile={userProfile}
          onSave={() => {
            setEditingProfile(false);
            // Profile will be updated automatically via context
          }}
          onCancel={() => setEditingProfile(false)}
        />
      </div>
    );
  }

  if (showNotifications) {
    return (
      <NotificationSettings />
    );
  }

  if (showProUpgrade) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowProUpgrade(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Pro Membership</h1>
          </div>
          <ProUpgrade onClose={() => setShowProUpgrade(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Profile Header */}
      <div className="p-6 text-center">
        <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary glow-primary">
          <AvatarImage src={profile.avatar_url} />
          <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-orbitron">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <h1 className="text-2xl font-bold font-orbitron text-foreground mb-2">
          {displayName}
        </h1>
        
        <div className="flex items-center justify-center gap-2 mb-3">
          <TierBadge level={profile.level} isPro={proStatus.isPro} />
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-sm text-muted-foreground">
            Bergabung sejak {joinDate}
          </span>
          {proStatus.isPro && (
            <ProBadge size="sm" />
          )}
        </div>
        
        <div className="max-w-xs mx-auto mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Level {profile.level}</span>
            <span>{profile.experience_points} / {nextLevelXp} XP</span>
          </div>
          <Progress 
            value={Math.min((profile.experience_points / nextLevelXp) * 100, 100)} 
            className="h-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {Math.max(nextLevelXp - profile.experience_points, 0)} XP untuk level selanjutnya
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
          className="w-full"
          onClick={() => setEditingProfile(true)}
        >
          <User className="w-4 h-4 mr-2" />
          Edit Profil
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setShowNotifications(true)}
        >
          <Bell className="w-4 h-4 mr-2" />
          Notifikasi
        </Button>


        <Button 
          variant="outline" 
          className={`w-full ${proStatus.isPro ? 'border-pro text-pro' : 'tier-pro'}`}
          onClick={() => onNavigate("payment")}
        >
          <Crown className="w-4 h-4 mr-2" />
          {proStatus.isPro 
            ? `Your Pro Plan until ${proStatus.expiresAt ? new Date(proStatus.expiresAt).toLocaleDateString('id-ID', { 
                year: 'numeric', 
                month: 'short',
                day: 'numeric'
              }) : 'Unknown'}`
            : 'Upgrade ke Pro'
          }
        </Button>


        <Button
          variant="destructive"
          onClick={handleLogout}
          className="w-full"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>

        {/* Delete Account Section */}
        <div className="border-t border-border pt-4 mt-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Zona Bahaya
          </h3>
          
          {!showDeleteConfirm ? (
            <Button 
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus Akun
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Apakah Anda yakin ingin menghapus akun Anda? Tindakan ini tidak dapat dibatalkan dan semua data Anda akan hilang permanen.
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button 
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="flex-1"
                >
                  Ya, Hapus Akun
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}