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
  // Use private bucket signed URL ONLY for short verse (Jurnalsyukur1.MP3)
  if (fileName === 'Jurnalsyukur1.MP3') {
    // Your private bucket signed URL for testing
    return 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/sign/testaudio/Jurnalsyukur1.MP3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mNzk0Yjg1MC04NjZhLTQwMWItYjVlYi0wZjdiZjdlMzcxMGYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0ZXN0YXVkaW8vSnVybmFsc3l1a3VyMS5NUDMiLCJpYXQiOjE3NTY5MDU0NTUsImV4cCI6MTc4ODQ0MTQ1NX0.xUVMTBMJwCl7ogHnO38S2xXuvTjbipeFUk7-S4g2FcQ';
  }
  
  // All other verses use regular public bucket (fast loading)
  const { data } = supabase.storage
    .from('audio-files')
    .getPublicUrl(fileName);
  
  return data.publicUrl;
};