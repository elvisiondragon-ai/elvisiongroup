import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const UPDATE_URL = 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/apk/elvisionv2.apk';
const LOCAL_STORAGE_KEY = 'hasClickedUpdateBannerElvisionV2';

const UpdateBanner: React.FC = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasClicked = localStorage.getItem(LOCAL_STORAGE_KEY);
    // Only show the banner if the user is logged in (user object exists)
    // and they have not clicked the download link before.
    //UPDATE BANNER ALWAYS HAVE UNIQUE CODE NOW IS V.2 IF YOU DEPLOY THIS CHANGE TO V.2.1
    if (user && hasClicked !== 'true') {
      setIsVisible(true);
    } else {
      // Hide banner if user is not logged in or has already clicked it
      setIsVisible(false);
    }
  }, [user]); // Re-run this effect when the user's authentication state changes

  const handleDownloadClick = async () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    setIsVisible(false);
    window.open(UPDATE_URL, '_blank');

    if (user && userProfile) {
      try {
        const experienceGained = 200;
        const currentExperience = userProfile.experience_points || 0;
        const newExperience = currentExperience + experienceGained;

        const { error } = await supabase
          .from('profiles')
          .update({ experience_points: newExperience })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating XP for banner click:', error);
          toast({
            title: "Error",
            description: "Failed to award XP. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: '✨ Bonus EXP! ✨',
            description: `Kamu mendapatkan +${experienceGained} EXP untuk update aplikasi!`, 
          });
        }
      } catch (error) {
        console.error('Unexpected error awarding XP for banner click:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while awarding XP.",
          variant: "destructive",
        });
      }
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '80px', // 80px from the bottom
      left: 0,
      right: 0,
      backgroundColor: '#FFD700', // Gold color for visibility
      color: 'black',
      padding: '8px',
      textAlign: 'center',
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Perbaikan Audio mode offline</span>
      <a
        href={UPDATE_URL}
        onClick={handleDownloadClick}
        style={{
          backgroundColor: '#007BFF',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '16px',
          textDecoration: 'none',
          fontWeight: 'bold',
        }}
      >
        KLIK DISINI + Bonus 200EXP
      </a>
    </div>
  );
};

export default UpdateBanner;
