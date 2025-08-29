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
      if (!user) throw new Error('Not authenticated');

      let result;
      if (activityType === 'audio_completion') {
        const isJournal = metadata.journalId || metadata.journalTitle;
        const minutes = metadata.listeningMinutes || 0;
        
        const { data } = await supabase.rpc('award_audio_xp', {
          user_uuid: user.id,
          is_journal: !!isJournal,
          minutes_listened: minutes
        });
        result = data;
      } else if (activityType === 'journal_completion') {
        const { data } = await supabase.rpc('award_journal_xp', {
          user_uuid: user.id
        });
        result = data;
      }

      if (result > 0) {
        toast({
          title: `+${result} XP Earned!`,
          description: reason || activityType
        });
      }
    } catch (error) {
      console.error('XP error:', error);
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
        xpForNextLevel = 500;
        break;
      case 3:
        totalXPForLevel = 500;
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