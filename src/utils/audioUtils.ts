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
  // Temporarily disable HLS for debugging
  console.log('getAudioUrl called with:', fileName);
  
  // For now, use regular Supabase URL for all files
  const { data } = supabase.storage
    .from('audio-files')
    .getPublicUrl(fileName);
  
  console.log('Returning URL:', data.publicUrl);
  return data.publicUrl;
  
  // HLS Only Mode - No direct MP3 URLs exposed
  // if (fileName === 'Verse1 - The Space Hill.MP3') {
  //   return '/hls/verse1/playlist.m3u8';
  // }
};