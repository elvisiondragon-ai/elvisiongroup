import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Definisikan CORS headers untuk mengizinkan permintaan dari backend PHP Anda
// dan untuk menangani permintaan preflight OPTIONS.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // 1. Tangani permintaan preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Validasi Metode: Hanya izinkan POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method Not Allowed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
      )
    }

    // 3. Ambil dan validasi input dari body JSON
    const payload = await req.json()
    const { userId, credit_type, userName, userEmail, phoneNumber } = payload

    // Validasi bahwa semua bidang yang diperlukan ada
    if (!userId || !credit_type || !userName || !userEmail || !phoneNumber) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: userId, credit_type, userName, userEmail, and phoneNumber are required.',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // 4. Inisialisasi Klien Supabase (menggunakan Service Role Key)
    // Kunci ini secara otomatis tersedia di lingkungan Edge Function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // 5. Interaksi Database: Masukkan catatan kredit
    const { data, error } = await supabaseClient
      .from('photo_credit')
      .insert({
        user_id: userId,
        credit_type: credit_type,
        status: 'COMPLETED', // Set status 'COMPLETED' untuk penetapan kredit langsung
        tripay_reference: null, // NULL karena ini bukan transaksi TriPay
        user_name: userName,
        user_email: userEmail,
        phone_number: phoneNumber,
        // created_at akan diatur secara default oleh database
      })
      .select() // Kembalikan baris yang baru dimasukkan
      .single() // Harapkan satu hasil

    // 6. Tangani jika ada error dari database
    if (error) {
      console.error('Supabase database error:', error.message)
      return new Response(
        JSON.stringify({ success: false, error: 'Database insertion failed', details: error.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // 7. Output Sukses
    console.log('Successfully assigned credits:', data.id)
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Credits assigned successfully',
        data: data,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (e) {
    // 8. Tangani error umum (misalnya, JSON tidak valid)
    console.error('Internal function error:', e.message)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error', details: e.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})