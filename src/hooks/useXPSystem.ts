import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface XPSystemHook {
  awardXP: (activityType: string, xpAmount: number, reason?: string, metadata?: any) => Promise<void>;
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
    metadata: any = {}
  ) => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check daily limits
      if (activityType === 'chat_message') {
        const { data: canChat } = await supabase.rpc('check_daily_chat_limit', {
          p_user_id: user.id
        });
        
        if (!canChat) {
          toast({
            title: "Daily chat limit reached",
            description: "You've reached the daily limit of 10 chat messages for XP.",
            variant: "destructive"
          });
          return;
        }
      }

      if (activityType === 'journal_entry') {
        const { data: canJournal } = await supabase.rpc('check_daily_journal_limit', {
          p_user_id: user.id
        });
        
        if (!canJournal) {
          toast({
            title: "Daily journal limit reached",
            description: "You've reached the daily limit of 5 XP from journal entries.",
            variant: "destructive"
          });
          return;
        }
      }

      if (activityType === 'audio_completed') {
        const { data: canAudio } = await supabase.rpc('check_daily_audio_limit', {
          p_user_id: user.id
        });
        
        if (!canAudio) {
          toast({
            title: "Daily audio limit reached",
            description: "You've reached the daily limit of 20 XP from audio listening.",
            variant: "destructive"
          });
          return;
        }
      }

      // Award XP using the database function
      const { error } = await supabase.rpc('award_xp', {
        p_user_id: user.id,
        p_xp_amount: xpAmount,
        p_activity_type: activityType,
        p_reason: reason,
        p_metadata: metadata
      });

      if (error) throw error;

      // Show success toast
      toast({
        title: `+${xpAmount} XP Earned!`,
        description: reason || `${activityType} completed`,
      });

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
    // New level requirements: 1=100, 2=500, 3=1500, 4=3000
    let totalXPForLevel = 0;
    let xpForNextLevel = 0;

    switch (level) {
      case 1:
        totalXPForLevel = 0;
        xpForNextLevel = 500;
        break;
      case 2:
        totalXPForLevel = 100;
        xpForNextLevel = 1500;
        break;
      case 3:
        totalXPForLevel = 500;
        xpForNextLevel = 3000;
        break;
      case 4:
        totalXPForLevel = 1500;
        xpForNextLevel = 3000; // Max level
        break;
      default:
        totalXPForLevel = 3000;
        xpForNextLevel = 3000; // Max level
    }

    // XP for current level progress
    const currentLevelXP = currentXP - totalXPForLevel;
    
    // Progress percentage (for max level, show 100%)
    const progress = level >= 4 ? 100 : Math.min((currentLevelXP / (xpForNextLevel - totalXPForLevel)) * 100, 100);

    return {
      currentLevelXP,
      xpForNextLevel: xpForNextLevel - totalXPForLevel,
      progress
    };
  }, []);

  return {
    awardXP,
    calculateXPProgress,
    isLoading
  };
}