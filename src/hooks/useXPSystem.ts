import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface XPSystemHook {
  awardXP: (activityType: string, xpAmount: number, reason?: string, metadata?: any, showNotification?: boolean) => Promise<void>;
  calculateXPProgress: (currentXP: number, level: number) => { currentLevelXP: number; xpForNextLevel: number; progress: number };
  isLoading: boolean;
}

export function useXPSystem(): XPSystemHook {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const awardXP = useCallback(async (
    activityType: string,
    xpAmount: number,
    reason?: string,
    metadata: any = {},
    showNotification: boolean = true
  ) => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Award XP using the basic system (daily limits not implemented yet)
      const { data, error } = await supabase.rpc('award_xp', {
        p_user_id: user.id,
        p_xp_amount: xpAmount,
        p_activity_type: activityType,
        p_reason: reason,
        p_metadata: metadata
      });

      if (error) throw error;

      // Show success toast with level up information
      const result = data as any;
      
      // Check if daily limit was reached
      if (!result.success && result.reason === 'daily_limit_reached') {
        // Don't show notification for daily limit - just silently return
        return;
      }
      
      // Only show notifications if showNotification is true
      if (showNotification) {
        // Check for level up
        if (result?.level_up) {
          toast({
            title: `🎉 SELAMAT ANDA MASUK KE LEVEL SELANJUTNYA!`,
            description: `Sekarang Level ${result.new_level}! +${result.xp_awarded} XP earned! ${result.achievement_earned ? '⚡ Achievement baru terbuka!' : ''}`,
          });
        } else if (result.show_notification && result.limit_reached) {
          // Only show daily limit notification when limit is hit for the first time
          toast({
            title: `+${result.xp_awarded} XP Earned! 🎯 Daily Limit Reached`,
            description: `You've earned 30/30 XP today! Come back tomorrow for more XP.`,
            variant: "default",
          });
        } else if (result.success) {
          // Regular success message
          toast({
            title: `+${result.xp_awarded} XP Earned!`,
            description: reason || `${activityType} completed`,
          });
        }
      }

    } catch (error) {
      console.error('Error awarding XP:', error);
      toast({
        title: "Error awarding XP",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const calculateXPProgress = useCallback((currentXP: number, level: number) => {
    // Updated level requirements with new thresholds
    let totalXPForLevel = 0;
    let xpForNextLevel = 0;

    switch (level) {
      case 1:
        totalXPForLevel = 0;
        xpForNextLevel = 150;
        break;
      case 2:
        totalXPForLevel = 150;
        xpForNextLevel = 300;
        break;
      case 3:
        totalXPForLevel = 300;
        xpForNextLevel = 1200;
        break;
      case 4:
        totalXPForLevel = 1200;
        xpForNextLevel = 2500;
        break;
      case 5:
        totalXPForLevel = 2500;
        xpForNextLevel = 4500;
        break;
      case 6:
        totalXPForLevel = 4500;
        xpForNextLevel = 7000;
        break;
      case 7:
        totalXPForLevel = 7000;
        xpForNextLevel = 9000;
        break;
      case 8:
        totalXPForLevel = 9000;
        xpForNextLevel = 12000;
        break;
      case 9:
        totalXPForLevel = 12000;
        xpForNextLevel = 15000;
        break;
      case 10:
        totalXPForLevel = 15000;
        xpForNextLevel = 15000; // Max level
        break;
      default:
        totalXPForLevel = 15000;
        xpForNextLevel = 15000; // Max level
    }

    // XP for current level progress - FIXED CALCULATION
    const currentLevelXP = Math.max(0, currentXP - totalXPForLevel);
    
    // XP needed for next level from current level start
    const xpNeededForNextLevel = xpForNextLevel - totalXPForLevel;
    
    // Progress percentage (for max level, show 100%)
    let progress = 0;
    if (level >= 10) {
      progress = 100;
    } else if (xpNeededForNextLevel > 0) {
      progress = Math.min((currentLevelXP / xpNeededForNextLevel) * 100, 100);
    }

    return {
      currentLevelXP,
      xpForNextLevel: xpNeededForNextLevel,
      progress
    };
  }, []);

  return {
    awardXP,
    calculateXPProgress,
    isLoading
  };
}