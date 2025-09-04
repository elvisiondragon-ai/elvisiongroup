import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAppUpdates = (user: any) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const checkForAppUpdates = async () => {
      try {
        // Get ONLY the latest app update
        const { data: updates, error } = await supabase
          .from('app_updates')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        if (error || !updates || updates.length === 0) return;

        const update = updates[0];
        const updateKey = `app_update_${update.id}`;
        
        // Show once per update ID
        if (!localStorage.getItem(updateKey)) {
          // Mobile-friendly: Simple toast without action button
          toast({
            title: update.title + " - TAP DISINI!",
            description: update.description + " ✅",
            duration: 0, // Persistent
            onClick: () => {
              console.log('🔄 Mobile notification tapped');
              // Mark as seen
              localStorage.setItem(updateKey, 'true');
              
              // Simple refresh without nested toast
              alert("🚀 Update Berhasil");
              setTimeout(() => window.location.reload(), 1000);
            }
          });
        }
      } catch (error) {
        console.error('Error checking app updates:', error);
      }
    };

    // Check for updates after login (delay like other notifications)
    setTimeout(checkForAppUpdates, 3000);
  }, [user?.id]); // Fixed dependency
};