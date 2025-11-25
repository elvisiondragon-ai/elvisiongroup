import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
// GLOBAL RATE LIMITING STORAGE
// Menyimpan waktu terakhir WhatsApp dikirim untuk mencegah spam
let lastWhatsAppSent = 0;
const RATE_LIMIT_MINUTES = 5; // Limit 5 menit sekali
// MAIN EDGE FUNCTION - TELEGRAM TO WHATSAPP
serve(async (req)=>{