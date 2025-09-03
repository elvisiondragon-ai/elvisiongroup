import { supabase } from '@/integrations/supabase/client';

export const audioFiles = [
  'Jurnalsyukur1.MP3',
  'Verse 3 - Syukur.MP3', 
  'Verse1 - The Space Hill.MP3',
  'Verse2 - Lucid Beach.MP3',
  'Verse4-English.MP3',
  'Verse5 - Virtality Vortex.MP3'
];

// URL obfuscation to hide real URLs from download managers
const obfuscateUrl = (url: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${url}?t=${timestamp}&r=${random}&_=${btoa(window.location.href).slice(0, 8)}`;
};

// Detect download managers by user agent
const isDownloadManager = (): boolean => {
  const ua = navigator.userAgent.toLowerCase();
  const downloadManagers = [
    'idm', 'internetdownloadmanager', 'neatdownloadmanager', 
    'fdm', 'freedownloadmanager', 'downloadaccelerator',
    'eagleget', 'jdownloader', 'ant download manager'
  ];
  return downloadManagers.some(dm => ua.includes(dm));
};

export const getAudioUrl = (fileName: string) => {
  // Block download managers completely
  if (isDownloadManager()) {
    console.warn('Download manager detected - access denied');
    return '';
  }

  const { data } = supabase.storage
    .from('audio-files')
    .getPublicUrl(fileName);
  
  // Return obfuscated URL to hide real path
  return obfuscateUrl(data.publicUrl);
};