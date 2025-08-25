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

      // Show streak notification
      if (loginData.streak_bonus_awarded) {
        toast({
          title: "🔥 Weekly Streak Bonus!",
          description: `+${loginData.xp_awarded} XP for completing 7 consecutive days!`,
          duration: 5000,
        });
      } else if (loginData.streak_days === 1) {
        toast({
          title: "🌟 Login Streak Started!",
          description: "Keep logging in daily to earn bonus XP every 7 days!",
        });
      } else if (loginData.streak_days > 1) {
        toast({
          title: "🔥 Streak Active!",
          description: `${loginData.streak_days} day streak! ${7 - (loginData.streak_days % 7)} more days until bonus XP!`,
        });
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
        
        // Handle daily login after getting profile
        setTimeout(() => {
          handleDailyLogin();
        }, 1000);
      }
      
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          const profile = await fetchUserProfile(session.user.id);
          setUserProfile(profile);
          setDailyLoginProcessed(false); // Reset for new session
          
          // Handle daily login for new session
          setTimeout(() => {
            handleDailyLogin();
          }, 1000);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserProfile(null);
          setDailyLoginProcessed(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchUserProfile, handleDailyLogin]);

  // Listen for XP updates to refresh profile
  useEffect(() => {
    if (!user) return;

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
          // Refresh profile when it's updated
          refreshProfile();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refreshProfile]);

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