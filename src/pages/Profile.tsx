// @ts-nocheck
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
import { StreakIndicator } from "@/components/StreakIndicator";
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
  Trash2,
  MessageCircle,
  Send,
  Flame,
  Droplets
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
  total_verses: number;
  total_journal: number;
  achievements: string[];
  created_at: string;
  avatar_url?: string;
}

export function Profile({ onLogout, onNavigate }: ProfileProps) {
  const { userProfile, user, loading } = useUserProfile();
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
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

  // Error handling - if no user, show error state
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="text-center">
          <p className="text-destructive">Error loading profile</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Simple profile handling
  const profile = userProfile || {
    display_name: user?.email?.split('@')[0] || "User",
    level: 1,
    experience_points: 0,
    streak_days: 0,
    total_verses: 0,
    total_journal: 0,
    achievements: [],
    created_at: new Date().toISOString()
  };

  const displayName = profile.display_name || user?.email?.split('@')[0] || "User";
  
  // Correct XP calculation using proper thresholds
  const currentXP = profile.experience_points || 0;
  const currentLevel = profile.level || 1;
  
  // Level thresholds (MUST match SQL function)
  const levelThresholds = [0, 150, 500, 1200, 2500, 4500, 7000, 9000, 12000, 15000];
  
  // XP needed for next level
  const nextLevelXp = currentLevel >= 10 ? 15000 : levelThresholds[currentLevel] || 15000;
  const currentLevelStartXp = levelThresholds[currentLevel - 1] || 0;
  const progressXp = Math.max(0, currentXP - currentLevelStartXp);
  const neededXp = nextLevelXp - currentLevelStartXp;
  const joinDate = new Date(profile.created_at).toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'short' 
  });

  const achievements = [
    { name: "First Step", description: "Joined eL Vision Group", unlocked: true },
    { name: "Week Warrior", description: "7 days streak", unlocked: profile.streak_days >= 7 },
    { name: "Zen Master", description: "Complete 100 journal entries", unlocked: profile.total_journal >= 100 },
    { name: "Soul Leader", description: "Reach level 5", unlocked: profile.level >= 5 },
  ];

  const stats = [
    {
      icon: Flame,
      label: "Total Verses",
      value: `${profile.total_verses || 0}`,
      color: "text-orange-500",
      iconStyle: { filter: "drop-shadow(0 0 8px rgba(251, 146, 60, 0.8)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))" }
    },
    {
      icon: Droplets,
      label: "Total Journal",
      value: `${profile.total_journal || 0}`,
      color: "text-blue-400",
      iconStyle: { filter: "drop-shadow(0 0 8px rgba(96, 165, 250, 0.8)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))" }
    },
    {
      icon: BookOpen,
      label: "Points Earned",
      value: `${profile.experience_points}`,
      color: "text-purple-400",
      iconStyle: { filter: "drop-shadow(0 0 8px rgba(196, 181, 253, 0.8)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))" }
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
          <ProUpgrade onClose={() => setShowProUpgrade(false)} onNavigate={onNavigate} />
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
          <TierBadge level={profile.level} isPro={proStatus.isPro} achievements={profile.achievements || []} />
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-sm text-muted-foreground">
            Bergabung sejak {joinDate}
          </span>
        </div>
        
        <div className="max-w-xs mx-auto mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Level {currentLevel}</span> 
            <span>{currentXP} / {nextLevelXp} XP</span>
          </div>
          <Progress 
            value={currentLevel >= 10 ? 100 : Math.min((progressXp / neededXp) * 100, 100)} 
            className="h-2"
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              {currentLevel >= 10 ? 'MAX LEVEL REACHED' : `${Math.max(nextLevelXp - currentXP, 0)} XP untuk level selanjutnya`}
            </p>
            <StreakIndicator streakDays={profile.streak_days} size="sm" />
          </div>
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
                <stat.icon 
                  className="w-8 h-8" 
                  style={stat.iconStyle}
                />
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
          onClick={() => {
            const message = encodeURIComponent("Kak renata saya dari ecosystem mau bertanya");
            window.open(`https://wa.me/62895325633487?text=${message}`, '_blank');
          }}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Hubungi Customer Support
        </Button>

        <Button 
          variant="outline" 
          className="w-full relative overflow-hidden group bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 hover:from-slate-800 hover:via-blue-800 hover:to-indigo-800 text-white border-none shadow-2xl hover:shadow-blue-900/25 transition-all duration-500 transform hover:scale-[1.02]"
          onClick={() => {
            window.open('https://ecosystem.elvisiongroup.com', '_blank');
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 via-blue-800/30 to-indigo-800/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center justify-center">
            <Target className="w-4 h-4 mr-2 text-white group-hover:text-white transition-colors duration-300" />
            <span className="font-semibold tracking-wide">Tujuan Kami</span>
          </div>
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </Button>

        <Button 
          variant="outline" 
          className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600/20 via-sky-500/20 to-cyan-400/20 hover:from-blue-600/30 hover:via-sky-500/30 hover:to-cyan-400/30 text-white hover:text-white border border-blue-400/30 hover:border-cyan-400/50 shadow-lg hover:shadow-cyan-400/25 transition-all duration-500 transform hover:scale-[1.02]"
          onClick={() => {
            window.open('https://t.me/elvision1', '_blank');
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-sky-500/10 to-cyan-400/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center justify-center">
            <Send className="w-4 h-4 mr-2 text-white group-hover:text-white transition-colors duration-300" />
            <span className="font-semibold tracking-wide">Telegram Community</span>
          </div>
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
        </Button>

        <Button 
          variant="outline" 
          className={`w-full ${proStatus.isPro 
            ? 'border-pro text-pro' 
            : 'bg-gradient-to-r from-black via-gray-900 to-yellow-600 hover:from-gray-900 hover:via-black hover:to-yellow-500 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300'
          }`}
          onClick={() => onNavigate("payment")}
        >
          <Crown className={`w-4 h-4 mr-2 ${proStatus.isPro ? '' : 'text-yellow-400'}`} />
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

        {/* Delete Account Section - HIDDEN */}
        {false && (
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
        )}
      </div>
    </div>
  );
}