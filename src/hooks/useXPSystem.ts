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

      // Check daily chat limit if it's a chat message
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
    // Calculate XP needed for current level
    let totalXPForLevel = 0;
    for (let i = 1; i < level; i++) {
      if (i <= 3) totalXPForLevel += 100;
      else if (i <= 6) totalXPForLevel += 150;
      else if (i <= 10) totalXPForLevel += 200;
      else totalXPForLevel += 250;
    }

    // XP for current level progress
    const currentLevelXP = currentXP - totalXPForLevel;
    
    // XP needed for next level
    let xpForNextLevel: number;
    if (level <= 3) xpForNextLevel = 100;
    else if (level <= 6) xpForNextLevel = 150;
    else if (level <= 10) xpForNextLevel = 200;
    else xpForNextLevel = 250;

    // Progress percentage
    const progress = Math.min((currentLevelXP / xpForNextLevel) * 100, 100);

    return {
      currentLevelXP,
      xpForNextLevel,
      progress
    };
  }, []);

  return {
    awardXP,
    calculateXPProgress,
    isLoading
  };
}