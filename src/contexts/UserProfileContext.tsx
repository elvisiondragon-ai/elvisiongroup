// @ts-nocheck
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useXPSystem } from '@/hooks/useXPSystem';

interface DailyLoginResponse {
  streak_days: number;
  xp_awarded: number;
  streak_bonus_awarded: boolean;
  message: string;
}

interface UserProfile {
  user_id: string;
  display_name: string | null;
  level: number;
  experience_points: number;
  streak_days: number;
  total_sessions: number;
  total_verses: number;
  total_journal: number;
  achievements: string[];
  created_at: string;
  avatar_url?: string;
  last_login_date?: string;
  last_streak_bonus_date?: string;
}

interface UserProfileContextType {
  userProfile: UserProfile | null;
  user: any;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  handleDailyLogin: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dailyLoginProcessed, setDailyLoginProcessed] = useState(false);
  const { toast } = useToast();
  const { calculateXPProgress } = useXPSystem();

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    
    const profile = await fetchUserProfile(user.id);
    if (profile) {
      setUserProfile(profile);
    }
  }, [user, fetchUserProfile]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }, [user, userProfile, toast]);

  const handleDailyLogin = useCallback(async () => {
    if (!user || dailyLoginProcessed) return;

    try {
      const { data, error } = await supabase.rpc('handle_daily_login', {
        p_user_id: user.id
      });

      if (error) {
        console.error('Error handling daily login:', error);
        return;
      }

      setDailyLoginProcessed(true);

      // Type cast the response data safely
      const loginData = data as unknown as DailyLoginResponse;

      // Check if notification already shown today to prevent spam
      const todayString = new Date().toDateString();
      const shownKey = `streak_notification_${todayString}`;
      const alreadyShownToday = localStorage.getItem(shownKey);

      // Don't show notification if already shown today or if already processed
      if (alreadyShownToday || loginData.message === "Already logged in today") {
        return;
      }

      // Show streak notification
      if (loginData.streak_bonus_awarded) {
        toast({
          title: "🔥 Weekly Streak Bonus!",
          description: `+${loginData.xp_awarded} XP for completing 7 consecutive days!`,
          duration: 5000,
        });
        localStorage.setItem(shownKey, 'true');
      } else if (loginData.streak_days === 1) {
        toast({
          title: "🌟 Login Streak Started!",
          description: "Keep logging in daily to earn bonus XP every 7 days!",
        });
        localStorage.setItem(shownKey, 'true');
      } else if (loginData.streak_days > 1) {
        toast({
          title: "🔥 Streak Active!",
          description: `${loginData.streak_days} day streak! ${7 - (loginData.streak_days % 7)} more days until bonus XP!`,
        });
        localStorage.setItem(shownKey, 'true');
      }

      // Refresh profile to get updated data
      await refreshProfile();
    } catch (error) {
      console.error('Error in daily login:', error);
    }
  }, [user, dailyLoginProcessed, toast, refreshProfile]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const profile = await fetchUserProfile(user.id);
        setUserProfile(profile);
        
        // Handle daily login after getting profile - single call with session check
        const sessionKey = `daily_login_${new Date().toDateString()}_${user.id}`;
        const hasProcessedToday = sessionStorage.getItem(sessionKey);
        
        if (!hasProcessedToday && !dailyLoginProcessed) {
          setTimeout(() => {
            handleDailyLogin();
            sessionStorage.setItem(sessionKey, 'true');
          }, 1000);
        }
      }
      
      setLoading(false);
    };

    // REMOVE DUPLICATE AUTH LISTENER - App.tsx already handles this
    // Only get initial user state, no auth state listener here
    getUser();
  }, []); // FIXED: Empty dependencies to prevent loops

  // Listen for XP updates to refresh profile - THROTTLED
  useEffect(() => {
    if (!user) return;

    let throttleTimeout: NodeJS.Timeout;
    const channel = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // THROTTLE refreshProfile calls to prevent spam
          clearTimeout(throttleTimeout);
          throttleTimeout = setTimeout(() => {
            refreshProfile();
          }, 2000); // 2 second throttle
        }
      )
      .subscribe();

    return () => {
      clearTimeout(throttleTimeout);
      supabase.removeChannel(channel);
    };
  }, [user?.id]); // FIXED: Only depend on user.id, not refreshProfile

  const value = {
    userProfile,
    user,
    loading,
    refreshProfile,
    handleDailyLogin,
    updateProfile,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}