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
  const { data, error } = await supabase.storage
    .from('audio-files')
    .createSignedUrl(fileName, 86400); // 24 hours
  
  return error ? null : data.signedUrl;
};