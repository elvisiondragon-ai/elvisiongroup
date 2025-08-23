import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSignedAudioUrl(filePath: string | null) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!filePath) {
      setSignedUrl(null);
      return;
    }

    const generateSignedUrl = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase.storage
          .from('audio-files')
          .createSignedUrl(filePath, 4800); // 1 hour 20 minutes expiry
        
        if (error) {
          console.error('Error creating signed URL:', error);
          setError(error.message);
          setSignedUrl(null);
        } else {
          setSignedUrl(data.signedUrl);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Failed to generate signed URL');
        setSignedUrl(null);
      } finally {
        setLoading(false);
      }
    };

    generateSignedUrl();
  }, [filePath]);

  return { signedUrl, loading, error };
}