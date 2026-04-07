// @ts-nocheck
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TierBadge } from "@/components/TierBadge";
import { ProBadge } from "@/components/ProBadge";
import { AdminBadge } from "@/components/AdminBadge";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditProfile } from "@/components/EditProfile";
import { NotificationSettings } from "@/components/NotificationSettings";
import { Payment } from "@/pages/Payment";
import { LoadingOverlay } from "@/components/LoadingOverlay";

import { usePro } from "@/hooks/usePro";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { useAuth } from '@/contexts/AuthContext';
import { StreakIndicator } from "@/components/StreakIndicator";
// Updated spiritual icons for streak tiers
import { GiTrophy, GiFire, GiHorseHead, GiSailboat, GiMoon, GiMeditation } from "react-icons/gi";
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
  Droplets,
  Activity,
  Globe,
  RefreshCw,
} from "lucide-react";
import { GiCrownCoin, GiBatMask, GiCrown, GiFootsteps } from "react-icons/gi";
import { Leaf } from "lucide-react";

interface ProfileProps {
  onNavigate: (tab: string) => void;
}

interface UserProfile {
  display_name: string | null;
  level: number;
  experience_points: number;
  streak_days: number;
  total_verses: number;
  total_journal: number;
  total_elite_habit: number;
  achievements: string[];
  created_at: string;
  avatar_url?: string;
}

import { useNavigate } from "react-router-dom";
// ... other imports ...

export function Profile({ onNavigate }: ProfileProps) {
  const { user, userId, userProfile, loading, cleanupSupabase, mediaAudit } = useAuth();
  const navigate = useNavigate();
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProUpgrade, setShowProUpgrade] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Detect PWA mode (iOS and Android) - includes fullscreen mode
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isIOSStandalone = ('standalone' in window.navigator) && (window.navigator as any).standalone;
  const isAndroidStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isAndroidFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
  const isAndroidMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches;
  const isPWA = (isIOS && isIOSStandalone) || isAndroidStandalone || isAndroidFullscreen || isAndroidMinimalUI;

  // INSTANT AUTH STATE - for immediate logout button response

  const { proStatus } = usePro();
  const { toast } = useToast();

  // Tab-level pro status logging
  useEffect(() => {
    if (proStatus) {
      console.log('🔵 Subscribe From Profile tab - pro_status_changes channel');
      return () => {
        console.log('🟣 Unsubscribe From Profile tab - pro_status_changes channel');
      };
    }
  }, [proStatus]);


    const handleLogout = async () => {
      try {
        // Set manual logout flag immediately to prevent IDLE USER HANDLER
        localStorage.setItem('manual-logout-flag', 'true');
  
        // PWA-specific handling for iOS logout
        if (isIOS && isIOSStandalone) {
          if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
              await registration.unregister();
              console.log('Service worker unregistered for iOS PWA logout');
            }
          }
          // Clear caches for PWA to ensure clean state
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
            console.log('All caches cleared for iOS PWA logout');
          }
        }
        
        // Clean up Supabase connections before signOut
        await cleanupSupabase();
        
        const { error } = await supabase.auth.signOut({ scope: 'local' });
        
        if (error) {
          console.error('Logout error:', error);
          toast({
            title: "Logout Error - Refreshing",
            description: "Refreshing page to complete logout...",
            variant: "destructive",
          });
          // REDIRECT TO REAL LOGOUT PAGE
          setTimeout(() => {
            window.location.replace('/auth');
          }, 1000);
          return;
        }

        toast({
          title: "Berhasil Logout",
          description: "Anda berhasil keluar dari akun.",
        });

        // Reload the page to clear client-side state, then redirect to /auth
        setTimeout(() => {
          window.location.reload();
          // This line might not be reached if reload is immediate, but included for explicitness.
          window.location.replace('/auth');
        }, 1000);

      } catch (error: any) {
        console.error('Unexpected logout error:', error);
        toast({
          title: "Logout Error - Refreshing",
          description: "Refreshing page to complete logout...",
          variant: "destructive",
        });
        // Refresh instead of staying on page with error
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    };
  const handleDeleteAccount = async () => {
    if (!userId) return;

    try {
      // Delete all user data first
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
      }

      // Delete related data
      await Promise.all([
        supabase.from('chat_messages').delete().eq('user_id', userId),
        supabase.from('reflections').delete().eq('user_id', userId),
        supabase.from('user_activities').delete().eq('user_id', userId),
        supabase.from('xp_transactions').delete().eq('user_id', userId),
        supabase.from('device_tokens').delete().eq('user_id', userId),
        supabase.from('notification_settings').delete().eq('user_id', userId),
        supabase.from('pro_subscriptions').delete().eq('user_id', userId),
        supabase.from('payment_transactions').delete().eq('user_id', userId),
      ]);

      // Sign out the user after data deletion
      localStorage.setItem('manual-logout-flag', 'true');
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast({
      title: "Refreshing...",
      description: "Clearing cache & updating app",
    });

    try {
      // Unregister all service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
          console.log('Service worker unregistered');
        }
      }

      // Clear all caches except for the audio cache
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter(cacheName => !cacheName.includes('audio'))
            .map(cacheName => caches.delete(cacheName))
        );
        console.log('All non-audio caches cleared');
      }

      // Set flag to show success toast after reload
      localStorage.setItem('app-updated-flag', 'true');

      // Force hard reload to get newest service worker
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Error during refresh:', error);
      // Fallback to normal reload
      window.location.reload();
    }
  };


  // Check for redirect back to upgrade page after refresh
  useEffect(() => {
    const shouldRedirectToUpgrade = localStorage.getItem('refresh-redirect-to-profile-upgrade');
    if (shouldRedirectToUpgrade === 'true') {
      localStorage.removeItem('refresh-redirect-to-profile-upgrade');
      // Small delay to ensure UI is ready
      setTimeout(() => {
        onNavigate("payment");
      }, 500);
    }
  }, [onNavigate]);

  // Check for auto-edit profile flag from chat
  useEffect(() => {
    const shouldAutoEdit = localStorage.getItem('auto-edit-profile');
    if (shouldAutoEdit === 'true') {
      localStorage.removeItem('auto-edit-profile');
      // Small delay to ensure profile is loaded
      setTimeout(() => {
        setEditingProfile(true);
      }, 300);
    }
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }



  // If we have userId from AuthContext but no user object yet, show loading
  if (userId && !user && !loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const profile = userProfile || {
    display_name: user?.email?.split('@')[0] || "User", // Use email username if available
    level: 1,
    experience_points: 0,
    streak_days: 0,
    total_verses: 0,
    total_journal: 0,
    total_elite_habit: 0,
    achievements: [],
    created_at: new Date().toISOString()
  };

  const displayName = profile.display_name || "User";
  const isAdmin = user?.id === '3da83afb-aa8c-4c55-b3b0-8aa64000205f';
  
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
    ...(profile.total_verses >= 900 
      ? [{ 
          name: "Hand of Midas", 
          description: "Berhasil raih 1 Milyar setelah gabung Ignis", 
          unlocked: true,
          isHandOfMidas: true
        }]
      : [{ name: "First Step", description: "Joined eL Vision Group", unlocked: true }]
    ),
    // Streak tier achievements - spiritual progression
    ...(profile.streak_days >= 500 
      ? [{ 
          name: "Ignis Lord 500+", 
          description: `${profile.streak_days} days streak - Eternal Fire`, 
          unlocked: true,
          isIgnisLordMaster: true
        }]
      : profile.streak_days >= 320 
        ? [{ 
            name: "Horsemen 320+", 
            description: `${profile.streak_days} days streak - Divine Flame`, 
            unlocked: true,
            isHorsemen: true
          }]
        : profile.streak_days >= 90 
        ? [{ 
            name: "Wanderer 90+", 
            description: `${profile.streak_days} days streak - Wise Traveler`, 
            unlocked: true,
            isWanderer: true
          }]
        : profile.streak_days >= 60 
          ? [{ 
              name: "Lumina 60+", 
              description: `${profile.streak_days} days streak - Light Bringer`, 
              unlocked: true,
              isLumina: true
            }]
          : profile.streak_days >= 30 
            ? [{ 
                name: "Seeker 30+", 
                description: `${profile.streak_days} days streak - Truth Finder`, 
                unlocked: true,
                isSeeker: true
              }]
            : profile.streak_days >= 7 
              ? [{ 
                  name: "Warrior 7+", 
                  description: `${profile.streak_days} days streak - Spiritual Fighter`, 
                  unlocked: true,
                  isWarrior: true
                }]
              : [{ name: "Warrior", description: "7 days streak - Begin your journey", unlocked: false }]
    ),
    ...(profile.total_journal >= 1200 
      ? [{ 
          name: "Reality Master", 
          description: `${profile.total_journal} journal entries`, 
          unlocked: true,
          isRealityMaster: true
        }]
      : profile.total_journal >= 100 
        ? [{ name: "Zen Master", description: "Complete 100 journal entries", unlocked: true }]
        : [{ name: "Zen Master", description: "Complete 100 journal entries", unlocked: false }]
    ),
    ...(profile.level >= 9 
      ? [{ 
          name: "The Void", 
          description: `Reach level ${profile.level}`, 
          unlocked: true,
          isTheVoid: true
        }]
      : profile.level >= 5 
        ? [{ name: "Soul Leader", description: "Reach level 5", unlocked: true }]
        : [{ name: "Soul Leader", description: "Reach level 5", unlocked: false }]
    ),
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
      icon: Activity,
      label: "Total Elite Habit",
      value: `${profile.total_elite_habit || 0}`,
      color: "text-emerald-400",
      iconStyle: { filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.8)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))" }
    },
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
    <>
      <LoadingOverlay isVisible={showLoadingOverlay} message={loadingMessage} />
      <div className="min-h-screen bg-background pb-20">
      {/* Profile Header */}
      <div className="p-6 text-center">
        <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary glow-primary">
          <AvatarImage src={profile.avatar_url} />
          <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-exo">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex items-center justify-center gap-2 mb-2">
          <h1 className={cn(
            "text-2xl font-bold font-exo transition-all duration-300",
            isAdmin 
              ? "bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white px-4 py-2 rounded-lg shadow-2xl shadow-red-500/25"
              : "text-foreground"
          )}>
            {displayName}
          </h1>
          {isAdmin && <AdminBadge size="md" />}
          {!isAdmin && <TierBadge level={profile.level} isPro={proStatus.isPro} achievements={profile.achievements || []} subscriptionType={proStatus.subscriptionType} />}
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
            {profile.streak_days >= 500 ? (
              <div className="streak-badge streak-ignis shadow-sm">
                <GiFire className="w-3 h-3" style={{ flexShrink: 0 }} />
                <span className="font-medium">Ignis 500+</span>
              </div>
            ) : profile.streak_days >= 320 ? (
              <div className="streak-badge streak-horsemen shadow-sm">
                <GiHorseHead className="w-3 h-3" style={{ flexShrink: 0 }} />
                <span className="font-medium">Horsemen 320+</span>
              </div>
            ) : profile.streak_days >= 90 ? (
              <div className="streak-badge streak-wanderer shadow-sm">
                <GiSailboat className="w-3 h-3" style={{ flexShrink: 0 }} />
                <span className="font-medium">Wanderer 90+</span>
              </div>
            ) : profile.streak_days >= 60 ? (
              <div className="streak-badge streak-lumina shadow-sm">
                <GiMoon className="w-3 h-3" style={{ flexShrink: 0 }} />
                <span className="font-medium">Lumina 60+</span>
              </div>
            ) : profile.streak_days >= 30 ? (
              <div className="streak-badge streak-seeker shadow-sm">
                <GiSailboat className="w-3 h-3" style={{ flexShrink: 0 }} />
                <span className="font-medium">Seeker 30+</span>
              </div>
            ) : profile.streak_days >= 7 ? (
              <div className="streak-badge streak-warrior shadow-sm">
                <GiTrophy className="w-3 h-3" style={{ flexShrink: 0 }} />
                <span className="font-medium">Warrior 7+</span>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">{profile.streak_days} days</span>
            )}
          </div>
        </div>


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
              <div className="font-bold font-exo text-foreground text-lg">
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
        <h2 className="text-lg font-semibold font-exo text-foreground mb-4">
          Pencapaian
        </h2>
        
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <Card 
              key={index} 
              className={`p-4 border-border transition-all duration-300 hover:scale-105 backdrop-blur-sm ${
                achievement.unlocked && achievement.isHandOfMidas
                  ? "bg-gradient-to-r from-yellow-900/80 via-amber-800/80 to-yellow-900/80 border-yellow-500 shadow-lg shadow-yellow-500/25" 
                  : achievement.unlocked && achievement.isIgnisLordMaster
                    ? "bg-gradient-to-r from-red-900/80 via-orange-800/80 to-red-800/80 border-red-600 shadow-lg shadow-red-600/25"
                    : achievement.unlocked && achievement.isHorsemen
                      ? "bg-gradient-to-r from-purple-800/80 via-pink-700/80 to-purple-800/80 border-purple-500 shadow-lg shadow-purple-500/25" 
                    : achievement.unlocked && achievement.isRealityMaster
                      ? "bg-gradient-to-r from-purple-900/80 via-purple-800/80 to-blue-900/80 border-purple-500 shadow-lg shadow-purple-500/25"
                      : achievement.unlocked && achievement.isTheVoid
                        ? "bg-gradient-to-r from-black/80 via-gray-900/80 to-black/80 border-gray-500 shadow-lg shadow-gray-500/25"
                        : achievement.unlocked && achievement.isWanderer
                          ? "bg-gradient-to-r from-green-800/80 via-green-700/80 to-emerald-800/80 border-green-500 shadow-lg shadow-green-500/25" 
                          : achievement.unlocked && achievement.isLumina
                            ? "bg-gradient-to-r from-blue-800/80 via-blue-700/80 to-cyan-800/80 border-blue-500 shadow-lg shadow-blue-500/25"
                            : achievement.unlocked && achievement.isSeeker
                              ? "bg-gradient-to-r from-orange-800/80 via-orange-700/80 to-red-800/80 border-orange-500 shadow-lg shadow-orange-500/25"
                              : achievement.unlocked && achievement.isWarrior
                                ? "bg-gradient-to-r from-yellow-800/80 via-yellow-700/80 to-orange-800/80 border-yellow-400 shadow-lg shadow-yellow-400/25" 
                                : achievement.name === "Zen Master" && achievement.unlocked
                                  ? "bg-gradient-to-r from-blue-800/80 via-blue-700/80 to-indigo-800/80 border-blue-400 shadow-lg shadow-blue-400/25"
                                  : achievement.name === "Soul Leader" && achievement.unlocked
                                    ? "bg-gradient-to-r from-indigo-800/80 via-purple-700/80 to-purple-800/80 border-indigo-400 shadow-lg shadow-indigo-400/25"
                              : achievement.name === "First Step" && achievement.unlocked
                                ? "bg-gradient-to-r from-green-800/80 via-emerald-700/80 to-green-800/80 border-green-400 shadow-lg shadow-green-400/25"
                                : achievement.unlocked 
                                  ? "bg-gradient-secondary/80 opacity-100" 
                                  : "bg-muted/20 opacity-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center relative overflow-hidden ${
                  achievement.unlocked && achievement.isHandOfMidas
                    ? "bg-gradient-to-r from-yellow-700 to-amber-700 text-amber-100" 
                    : achievement.unlocked && achievement.isIgnisLordMaster
                      ? "bg-gradient-to-r from-red-800 to-orange-700 text-red-100"
                      : achievement.unlocked && achievement.isHorsemen
                        ? "bg-gradient-to-r from-purple-700 to-pink-600 text-purple-100" 
                      : achievement.unlocked && achievement.isRealityMaster
                        ? "bg-gradient-to-r from-purple-700 to-blue-700 text-blue-100"
                        : achievement.unlocked && achievement.isTheVoid
                          ? "bg-gradient-to-r from-gray-700 to-black text-gray-100"
                          : achievement.unlocked && achievement.isWanderer
                            ? "bg-gradient-to-r from-green-800 to-emerald-800 text-green-100"
                            : achievement.unlocked && achievement.isLumina
                              ? "bg-gradient-to-r from-blue-800 to-cyan-800 text-blue-100"
                              : achievement.unlocked && achievement.isSeeker
                                ? "bg-gradient-to-r from-orange-800 to-red-800 text-orange-100"
                                : achievement.unlocked && achievement.isWarrior
                                  ? "bg-gradient-to-r from-yellow-800 to-orange-800 text-yellow-100"
                                  : achievement.name === "Zen Master" && achievement.unlocked
                                    ? "bg-gradient-to-r from-blue-700 to-indigo-700 text-blue-100"
                                    : achievement.name === "Soul Leader" && achievement.unlocked
                                      ? "bg-gradient-to-r from-indigo-700 to-purple-700 text-indigo-100"
                                      : achievement.name === "First Step" && achievement.unlocked
                                        ? "bg-gradient-to-r from-green-700 to-emerald-700 text-green-100"
                                  : achievement.unlocked 
                                    ? "bg-gradient-primary text-primary-foreground glow-primary" 
                                    : "bg-muted text-muted-foreground"
                }`}>
                  <div className="absolute inset-0 bg-black/20 rounded-full"></div>
                  <div className="relative z-10">
                    {achievement.isHandOfMidas && achievement.unlocked ? (
                      <GiCrownCoin className="w-7 h-7 animate-bounce drop-shadow-lg" />
                    ) : achievement.isIgnisLordMaster && achievement.unlocked ? (
                      <GiFire className="w-7 h-7 animate-bounce drop-shadow-lg" />
                    ) : achievement.isHorsemen && achievement.unlocked ? (
                      <GiHorseHead className="w-7 h-7 animate-bounce drop-shadow-lg" />
                    ) : achievement.isRealityMaster && achievement.unlocked ? (
                      <Globe className="w-7 h-7 animate-spin drop-shadow-lg" />
                    ) : achievement.isTheVoid && achievement.unlocked ? (
                      <GiBatMask className="w-7 h-7 animate-pulse drop-shadow-lg" />
                    ) : achievement.isWarrior && achievement.unlocked ? (
                      <GiTrophy className="w-7 h-7 animate-pulse drop-shadow-lg" />
                    ) : achievement.name === "Zen Master" && achievement.unlocked ? (
                      <GiMeditation className="w-7 h-7 animate-pulse drop-shadow-lg" />
                    ) : achievement.name === "Soul Leader" && achievement.unlocked ? (
                      <Leaf className="w-7 h-7 animate-pulse drop-shadow-lg" />
                    ) : achievement.name === "First Step" && achievement.unlocked ? (
                      <GiFootsteps className="w-7 h-7 animate-pulse drop-shadow-lg" />
                    ) : (
                      <Award className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
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
        <h2 className="text-lg font-semibold font-exo text-foreground mb-4">
          Pengaturan
        </h2>

          <Button
            variant="outline"
            className="w-full transition-all duration-200 hover:scale-105 active:scale-95 transform"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Check Update
          </Button>

        <Button
          variant="outline"
          className="w-full transition-all duration-200 hover:scale-105 active:scale-95 transform"
          onClick={() => {
            if (user) {
              setEditingProfile(true);
            } else {
              toast({
                title: "Login Required",
                description: "Please log in to edit your profile.",
                variant: "destructive",
              });
            }
          }}
        >
          <User className="w-4 h-4 mr-2" />
          Edit Profil
        </Button>
        
        <Button
          variant="outline"
          className="w-full transition-all duration-200 hover:scale-105 active:scale-95 transform"
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
          className="w-full relative overflow-hidden group bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 hover:from-slate-800 hover:via-blue-800 hover:to-indigo-800 text-white border-none shadow-2xl hover:shadow-blue-900/25 transition-all duration-200 transform hover:scale-105 active:scale-95"
          onClick={() => {
                if (mediaAudit && user) {
                  mediaAudit.handleOpenOrPlay({
                    object_name: 'Tujuan Kami',
                    user_email: user.email
                  });
                }
                setLoadingMessage('Loading Tujuan Kami...');
                setShowLoadingOverlay(true);
                // Show loading for 1 second before opening
                setTimeout(() => {
                  window.open('https://display.elvisiongroup.com', '_blank');
                  setShowLoadingOverlay(false);
                }, 1000);
              }}        >
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
          className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600/20 via-sky-500/20 to-cyan-400/20 hover:from-blue-600/30 hover:via-sky-500/30 hover:to-cyan-400/30 text-white hover:text-white border border-blue-400/30 hover:border-cyan-400/50 shadow-lg hover:shadow-cyan-400/25 transition-all duration-200 transform hover:scale-105 active:scale-95"
          onClick={() => {
            setLoadingMessage('Connecting to Telegram...');
            setShowLoadingOverlay(true);
            // Show loading for 1 second before opening
            setTimeout(() => {
              window.open('https://t.me/elvision1', '_blank');
              setShowLoadingOverlay(false);
            }, 1000);
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

        <div className="flex gap-2">
          <Button
            variant="outline"
            className={`flex-1 transition-all duration-200 transform hover:scale-105 active:scale-95 ${proStatus.isPro
              ? 'border-pro text-pro'
              : 'bg-gradient-to-r from-black via-gray-900 to-yellow-600 hover:from-gray-900 hover:via-black hover:to-yellow-500 text-white border-none shadow-lg hover:shadow-xl'
            }`}
            onClick={async () => {
              if (!userId) {
                toast({
                  title: "Error",
                  description: "Silakan login terlebih dahulu",
                  variant: "destructive"
                });
                return;
              }
              onNavigate("payment");
            }}
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
          
        </div>


        <Button
          variant="destructive"
          className="w-full transition-all duration-200 hover:scale-105 active:scale-95 transform"
          onClick={() => window.location.href = '/delete'}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Hapus Akun
        </Button>

        <div className="p-6">
          {user ? (
            <div className="flex items-center justify-center gap-4">
              {proStatus.isPro && <ProBadge />}
              <Button
                variant="destructive"
                onClick={handleLogout}
                onTouchEnd={(e) => { e.preventDefault(); handleLogout(); }}
                className="flex-grow transition-all duration-200 transform hover:scale-105 active:scale-95"
                style={{ touchAction: 'manipulation' }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              onClick={() => navigate('/auth')}
              className="w-full transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Login
            </Button>
          )}
        </div>

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
        <div className="mt-8 mb-4 text-center">
          <p className="text-[10px] text-muted-foreground/30 font-mono">
            v3.0.1-stable
          </p>
        </div>
      </div>
    </div>
    </>
  );
}