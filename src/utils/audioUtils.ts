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
  
  // HLS Only Mode - ALL audio files protected
  const hlsMapping: { [key: string]: string } = {
    'Jurnalsyukur1.MP3': '/hls/jurnalsyukur1/playlist.m3u8',
    'Verse 3 - Syukur.MP3': '/hls/verse3/playlist.m3u8',
    'Verse1 - The Space Hill.MP3': '/hls/verse1/playlist.m3u8',
    'Verse2 - Lucid Beach.MP3': '/hls/verse2/playlist.m3u8',
    'Verse4-English.MP3': '/hls/verse4/playlist.m3u8',
    'Verse5 - Virtality Vortex.MP3': '/hls/verse5/playlist.m3u8'
  };
  
  if (hlsMapping[fileName]) {
    console.log(`Returning HLS URL for ${fileName}: ${hlsMapping[fileName]}`);
    return hlsMapping[fileName];
  }
  
  // Fallback to regular Supabase URL (if any audio files not converted yet)
  console.warn(`Audio file ${fileName} not found in HLS mapping, falling back to Supabase`);
  const { data } = supabase.storage
    .from('audio-files')
    .getPublicUrl(fileName);
  
  return data.publicUrl;
};