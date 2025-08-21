import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePro } from './usePro';
import { useToast } from './use-toast';

export interface VerseAccess {
  canAccess: boolean;
  reason: 'level' | 'pro' | 'locked';
  requiredLevel?: number;
}

export function useVerseAccess() {
  const { proStatus } = usePro();
  const { toast } = useToast();
  const [userLevel, setUserLevel] = useState<number>(1);

  useEffect(() => {
    fetchUserLevel();
  }, []);

  const fetchUserLevel = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('level')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setUserLevel(profile.level);
      }
    } catch (error) {
      console.error('Failed to fetch user level:', error);
    }
  };

  const checkVerseAccess = (verseNumber: number): VerseAccess => {
    // Pro users can access verses 1-4 regardless of level
    if (proStatus.isPro && verseNumber <= 4) {
      return { canAccess: true, reason: 'pro' };
    }

    // Level requirements for each verse
    const levelRequirements: { [key: number]: number } = {
      1: 3,
      2: 4,
      3: 4,
      4: 5
    };

    const requiredLevel = levelRequirements[verseNumber];
    
    if (!requiredLevel) {
      return { canAccess: false, reason: 'locked' };
    }

    const canAccess = userLevel >= requiredLevel;
    
    return {
      canAccess,
      reason: canAccess ? 'level' : 'locked',
      requiredLevel
    };
  };

  const handleVerseClick = (verseNumber: number, onSuccess?: () => void) => {
    const access = checkVerseAccess(verseNumber);
    
    if (access.canAccess) {
      onSuccess?.();
      return true;
    }

    // Show appropriate message based on why access is blocked
    if (access.reason === 'locked') {
      if (access.requiredLevel) {
        toast({
          title: "Verse Locked",
          description: `You need to reach level ${access.requiredLevel} to access Verse ${verseNumber}. ${proStatus.isPro ? '' : 'Or upgrade to Pro for instant access!'}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Verse Not Available",
          description: `Verse ${verseNumber} is not available yet.`,
          variant: "destructive",
        });
      }
    }

    return false;
  };

  return {
    checkVerseAccess,
    handleVerseClick,
    userLevel,
    refreshLevel: fetchUserLevel
  };
}