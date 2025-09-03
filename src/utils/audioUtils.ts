import { supabase } from '@/integrations/supabase/client';

export const audioFiles = [
  'Jurnalsyukur1.MP3',
  'Verse 3 - Syukur.MP3', 
  'Verse1 - The Space Hill.MP3',
  'Verse2 - Lucid Beach.MP3',
  'Verse4-English.MP3',
  'Verse5 - Virtality Vortex.MP3'
];

export const getAudioUrl = async (fileName: string) => {
  try {
    // Use signed URL with 30 minute expiration for better security
    const { data, error } = await supabase.storage
      .from('audio-files')
      .createSignedUrl(fileName, 1800); // 30 minutes
      
    if (error) {
      console.warn('Signed URL failed, fallback to public URL:', error);
      // Fallback to public URL if signed URL fails
      const { data: publicData } = supabase.storage
        .from('audio-files')
        .getPublicUrl(fileName);
      return publicData.publicUrl;
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting audio URL:', error);
    // Final fallback to public URL
    const { data } = supabase.storage
      .from('audio-files')
      .getPublicUrl(fileName);
    return data.publicUrl;
  }
};