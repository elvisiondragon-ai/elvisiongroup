/*
How to use this component:
This file is often used. 

To UNHIDE the banner:
1. Add the following import to src/App.tsx:
   import UpdateBanner from "./updatebanner";
2. Add the following component tag inside the AppLoader in src/App.tsx:
   <UpdateBanner />

To HIDE the banner:
- Remove the import and the component tag from src/App.tsx.
*/

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// BANNER RULES
// - The banner is shown once per user until they click the button.
// - Deployments that clear localStorage will surface the banner again automatically.

// Optional server-side version tag (kept for analytics / XP rewards)
const BANNER_VERSION = import.meta.env.VITE_UPDATE_BANNER_VERSION || 'v002';

// Download target
const UPDATE_URL = 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/apk/elvisionv2.apk';

// Local, per-user dismissal key (cleared when SW purges cache)
const dismissalKey = (userId?: string | null) =>
  `updateBannerDismissed:${userId ?? 'anon'}`;

// Pending outbox for offline inserts
const OUTBOX_KEY = 'updateBannerOutbox'; // JSON array of { user_id, banner_version, clicked_at }

type OutboxItem = { user_id: string; banner_version: string; clicked_at: string };

const UpdateBanner: React.FC = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [checking, setChecking] = useState(true);

  // Flush any pending offline clicks once we have a user/session
  const flushOutbox = useCallback(async () => {
    try {
      const raw = localStorage.getItem(OUTBOX_KEY);
      if (!raw) return;
      const items: OutboxItem[] = JSON.parse(raw);
      if (!Array.isArray(items) || items.length === 0) return;

      const keep: OutboxItem[] = [];
      for (const item of items) {
        try {
          const { error } = await supabase
            .from('update_banner_clicks')
            .insert({ user_id: item.user_id, banner_version: item.banner_version, clicked_at: item.clicked_at });
          if (error) {
            // Keep if transient error; drop on unique violation
            if (String((error as any)?.code) === '23505') continue; // unique_violation
            keep.push(item);
          }
        } catch {
          keep.push(item);
        }
      }
      if (keep.length > 0) {
        localStorage.setItem(OUTBOX_KEY, JSON.stringify(keep));
      } else {
        localStorage.removeItem(OUTBOX_KEY);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    flushOutbox();
  }, [flushOutbox]);

  // Decide visibility: prefer server truth, fallback to local to avoid flicker
  useEffect(() => {
    setChecking(true);

    // Only show for authenticated users
    if (!user?.id) {
      setIsVisible(false);
      setChecking(false);
      return;
    }

    const key = dismissalKey(user.id);
    const dismissed = localStorage.getItem(key) === 'true';
    setIsVisible(!dismissed);
    setChecking(false);
  }, [user]);

  const handleDownloadClick = async () => {
    // Immediately close banner and mark local suppression
    if (user?.id) localStorage.setItem(dismissalKey(user.id), 'true');
    setIsVisible(false);

    // Open download
    window.open(UPDATE_URL, '_blank');

    // Record click server-side (deduplicated by unique constraint)
    if (user?.id) {
      const nowIso = new Date().toISOString();
      try {
        const { error } = await supabase
          .from('update_banner_clicks')
          .insert({ user_id: user.id, banner_version: BANNER_VERSION, clicked_at: nowIso });

        if (error) {
          // Unique violation: treat as success (already clicked elsewhere)
          if (String((error as any)?.code) !== '23505') {
            // Queue for retry when back online
            const raw = localStorage.getItem(OUTBOX_KEY);
            const items: OutboxItem[] = raw ? JSON.parse(raw) : [];
            items.push({ user_id: user.id, banner_version: BANNER_VERSION, clicked_at: nowIso });
            localStorage.setItem(OUTBOX_KEY, JSON.stringify(items));
          }
        } else {
          // Only award EXP on successful, unique insert
          if (userProfile) {
            try {
              const experienceGained = 200;
              const currentExperience = userProfile.experience_points || 0;
              const newExperience = currentExperience + experienceGained;

              const { error: xpError } = await supabase
                .from('profiles')
                .update({ experience_points: newExperience })
                .eq('user_id', user.id);

              if (xpError) {
                console.error('Error updating XP for banner click:', xpError);
                toast({
                  title: 'Error',
                  description: 'Failed to award XP. Please try again.',
                  variant: 'destructive',
                });
              } else {
                toast({
                  title: '✨ Bonus EXP! ✨',
                  description: `Kamu mendapatkan +${experienceGained} EXP untuk update aplikasi!`,
                });
              }
            } catch (xpUnexpected) {
              console.error('Unexpected error awarding XP for banner click:', xpUnexpected);
              toast({
                title: 'Error',
                description: 'An unexpected error occurred while awarding XP.',
                variant: 'destructive',
              });
            }
          }
        }
      } catch (err) {
        // Network failure: queue for retry
        const raw = localStorage.getItem(OUTBOX_KEY);
        const items: OutboxItem[] = raw ? JSON.parse(raw) : [];
        items.push({ user_id: user.id, banner_version: BANNER_VERSION, clicked_at: nowIso });
        localStorage.setItem(OUTBOX_KEY, JSON.stringify(items));
      }
    }
  };

  if (!isVisible || checking) {
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
      <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Gold Report Event</span>
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
