import { supabase } from '@/integrations/supabase/client';

export const audioFiles = [
  'Jurnalsyukur1.MP3',
  'Verse 3 - Syukur.MP3', 
  'Verse1 - The Space Hill.MP3',
  'Verse2 - Lucid Beach.MP3',
  'Verse4-English.MP3',
  'Verse5 - Virtality Vortex.MP3'
];

export const getAudioUrl = (fileName: string) => {
  console.log('getAudioUrl called with:', fileName);
  
  // HLS Only Mode for Verse 1 - No direct MP3 URLs exposed
  if (fileName === 'Verse1 - The Space Hill.MP3') {
    console.log('Returning HLS URL for Verse 1');
    return '/hls/verse1/playlist.m3u8';
  }
  
  // Regular Supabase URL for other files
  const { data } = supabase.storage
    .from('audio-files')
    .getPublicUrl(fileName);
  
  console.log('Returning regular URL:', data.publicUrl);
  return data.publicUrl;
};