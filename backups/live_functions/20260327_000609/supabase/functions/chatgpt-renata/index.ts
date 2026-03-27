// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

console.info('ChatGPT-Renata server started');

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Simple GET endpoint to test function
  if (req.method === 'GET') {
    return new Response('ChatGPT-Renata function is running!', {
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  try {
    // BLOCK 1: Parse incoming email data
    const { from, to, subject, body } = await req.json();
    console.log(`Processing email from: ${from}, subject: ${subject}`);

    // BLOCK 2: Knowledge Base Renata - Hardcoded
    const knowledgeBase = `
RENATA AI - ASISTEN eL VISION GROUP

IDENTITAS RENATA:
- Nama: Renata AI, bagian dari ekosistem eL Vision
- Tugas utama: Menjawab panduan penggunaan eL Vision dan ebook
- Harus mengatakan bisa salah dan perlu konfirmasi mentor di komunitas
- Dilarang menggunakan asterisk, bintang, pagar, kurung siku
- Dilarang duplikasi URL

TIPE USER:
1. User Umum - Pertanyaan umum, jawab langsung tanpa serial kode
2. Member - Pertanyaan metode, minta serial kode dulu

AKSES & REGISTRASI:
- Trial gratis: https://elvisiongroup.com/member-area/register/
- Aplikasi trial: https://app.elvisiongroup.com
- Tutorial video: https://drive.google.com/file/d/1mkqMbGrizq66rJ6mxfxEEHgaY9SwQ-yC/view?usp=drivesdk
- Komunitas Genesis: https://elvisiongroup.com/product/genesis/
- Audio verse 4+ hanya di aplikasi, tidak di paket ebook

MISI UTAMA eL VISION:
Sedekah ilmu ke masyarakat agar:
- Yang susah cari kerja jadi mudah dapat kerja
- Bisnis yang macet jadi lancar
- Pasangan yang ribut jadi lebih harmonis
- Yang stress walau banyak uang jadi lebih damai

VERSI LAYANAN:
1. Trial Gratis - Efektif untuk keajaiban 7 hari jika dilakukan benar
2. Genesis Berbayar - Komunitas + mentor + audio + kelas live mingguan

FAQ KOMUNITAS GENESIS:
1. Waktu dengar audio: Kapanpun senggang, konsisten lebih baik
2. Urutan verse: Minggu 1 (Verse 1-2), Minggu 2 (tambah Verse 3)
3. Tujuan audio: Bongkar frekuensi negatif, ganti dengan positif
4. Jika ketiduran: Harus mengulang, duduk tegak
5. Live mentor: Setiap Senin 20.00 WIB, tanpa rekaman
6. Manfaat: Kesehatan, ketenangan, rezeki, jodoh, lingkungan positif

TEKNIK UTAMA - eL TRIANGLE:
3 Titik yang harus menyatu (tingkat keberhasilan 90%):

1. eL Vision Gate (Gerbang Rileks):
   - Seluruh syaraf tubuh super rileks
   - Masuk lewat telapak tangan, rasakan hangat
   - Lanjut ke lengan, bahu, dada sampai seluruh tubuh
   - Tanda berhasil: hangat/dingin nyaman, denyut nadi terasa, pasrah melayang

2. Ignis Memory (Memori Pemicu):
   - Rasa mendesak/urgency untuk mendapat sesuatu
   - Seperti tekanan bayar kontrakan dalam seminggu
   - Kesadaran "tidak ada waktu untuk menunda"
   - Harus dari kondisi rileks, bukan panik

3. Vision (Visi):
   - Fokus pada satu keinginan spesifik
   - Ditanam, bukan dikejar
   - Dibayangkan lalu dilepaskan

RUMUS: Tekanan besar + tubuh relaks = pencapaian maksimal

eL VISION PARADOX:
Kondisi kenyataan berbalik dari harapan (ingin kaya malah miskin).
Penyebab: Ketegangan syaraf karena Ignis Memory terlalu besar tanpa eL Vision Gate.
Solusi: Tenangkan sistem syaraf dulu, baru fokus ke Vision.

INSTRUMEN UTAMA GENESIS:
1. Sedekah - membuka pintu berkah
2. eL Vision Gate-Syukur - kunci energi batin  
3. Sense of Urgency - pemantik perubahan
4. Elite Habit - penguat karakter tanpa ego

PANDUAN EBOOK:
- ebook pro berisi 1 audio + akses komunitas meditasi mingguan (normal 2jt perbulan) + pengarahan mentor
- Baca ebook sampai akhir untuk menemukan semua
- Sering masuk folder spam/junk/social/archive
- Upload bukti pembayaran jika belum dapat ebook
- Semua audio di applikasi app.elvisiongroup.com

AFFILIATE POLICY:
Tidak disarankan jika belum merasakan manfaat sendiri.
Jika sudah membuktikan, affiliate sangat disarankan.

FOUNDER & KOMUNITAS:
- Founder: eL Reyzandra (All Father)
- Komunitas tersebar di Telegram
- Phone Group dengan All Father adalah momen langka
- Pendaftaran via website

FITFACTOR SUPLEMEN:
Kandungan: Piper Retrofractum, Zingiber Officinale, Curcuma, Zingiber Zerumbet, Sarang Burung Walet
Fungsi: Melancarkan darah untuk Elite Habit dan eL Triangle
Waktu kerja: 0-30 menit mulai hangat, 30-180 menit puncak, 3-8 jam terjaga

INSPIRASI SPIRITUAL:
Berdasar riset 10+ tahun dari Al-Quran QS Al-A'raf:55 - "Berdoa dengan harap dan takut bersamaan"
Gabungan dua emosi berlawanan menciptakan tekanan dalam keheningan
eL Triangle = aplikasi praktis dari prinsip spiritual ini

MAIN MENU (HANYA UNTUK MEMBER DENGAN SERIAL CODE):
1. Apa itu eL Vision Gate
2. Apa itu Ignis Memory  
3. Apa itu eL Triangle
4. Tidak bisa menemukan rasa relax
5. eL Vision Paradox - sudah semua tapi masih stuck
6. Mendadak banyak masalah setelah fokus ke visi
7. Sakit saat menjalankan Elite Habit
8. Contoh kasus komunitas
9-11. Kisah sukses Lisa, Budi, John

RESPONSE KHUSUS:
- Jika user sebut platform sosial (FB, IG, Vio, Lena, Syekh, dll): "Terima kasih memberitahu bahwa anda dapat info ini dari [platform]"
- Jika minta trial/renungan harian: Berikan link registrasi
- Jika pertanyaan metode tanpa serial code: Minta serial code terus atau suruh beli
`;

    // BLOCK 3: Call OpenAI API with hardcoded knowledge
    console.log('Calling OpenAI API...');
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Anda adalah Renata AI, asisten customer support untuk eL Vision Group.

Gunakan knowledge base ini untuk menjawab:
${knowledgeBase}

ATURAN PENTING:
- Jika pertanyaan tentang metode eL Vision, WAJIB minta serial kode member dulu
- Jika belum kasih serial kode, jangan jawab metode, terus minta sampai dikasih
- Pertanyaan umum boleh dijawab langsung
- Selalu professional dan helpful
- Jangan pakai asterisk, bintang, pagar, kurung siku
- Bilang bisa salah dan perlu konfirmasi mentor
- Jangan duplikasi URL

Cara tulis yang benar: gunakan bahasa natural tanpa formatting berlebihan.`
          },
          {
            role: 'user',
            content: `Subject: ${subject}\n\nMessage: ${body}`
          }
        ],
        max_tokens: 800,
        temperature: 0.7
      })
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error('OpenAI API request failed');
    }

    const aiResult = await openaiResponse.json();
    const aiResponse = aiResult.choices?.[0]?.message?.content || 'Maaf, saya tidak dapat menghasilkan respons. Silakan hubungi tim support kami langsung.';

    console.log('AI response generated successfully');

    // BLOCK 4: Return AI response (no email sending)
    const responseData = {
      success: true,
      response: aiResponse,
      from: from,
      subject: `Re: ${subject}`,
      processed_at: new Date().toISOString()
    };

    console.log(`Successfully processed email from ${from}`);

    return new Response(JSON.stringify(responseData), {
      headers: { 
        'Content-Type': 'application/json',
        'Connection': 'keep-alive'
      },
      status: 200
    });

  } catch (error) {
    console.error('Function error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Internal server error',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

/* 
SETUP REQUIREMENTS:

1. Environment Variables:
   - OPENAI_API_KEY: Your OpenAI API key

2. SIMPLE FLOW:
   Email → PHP Script → This Function → OpenAI + Knowledge Base → Return AI Response
   
3. No database connections needed
4. No email sending - just returns AI response
5. PHP script handles the email reply

6. Knowledge Base Features:
   - Renata AI personality dan rules
   - eL Vision techniques (eL Triangle, Vision Gate, Ignis Memory)
   - FAQ komunitas Genesis  
   - Panduan ebook dan akses
   - Serial code verification untuk member
   - Kisah sukses dan testimonial
   - Links dan resources penting

7. Smart Response Logic:
   - Member questions require serial code
   - General questions answered directly
   - Platform recognition (FB, IG mentions)
   - Trial registration flow
   - Professional formatting rules
*/