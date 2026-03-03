import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

// Mailketing API configuration
const MAILKETING_API_URL = Deno.env.get('MAILKETING_API_URL') || 'https://api.mailketing.co.id/api/v1';
const MAILKETING_API_KEY = Deno.env.get('MAILKETING_API_KEY');
const LIST_ID = '80713'; // Default List ID

// --- PRODUCT CONFIGURATION ---
const PRODUCT_TEMPLATES: Record<string, any> = {
  'universal_Id_parenting_paid': {
    subject: "✨ Akses Download: Co-Parenting Tracker & Tutorial",
    downloadLink: "https://docs.google.com/spreadsheets/d/1u1H6Pv0O5noENH7_P-SEqheHmIqlixAo_0DncVYMuqlY/edit?gid=612184692#gid=612184692",
    color: "#4F46E5", // Indigo
    accentColor: "#ffffff",
    title: "Akses Co-Parenting Tracker Terbuka",
    description: "Selamat! Anda sekarang memiliki akses penuh ke Template Co-Parenting Tracker.",
    instructions: [
      "Silahkan copy file sheet tersebut ke Google Anda melalui link di atas.",
      "Tonton Tutorial Penggunaan di sini: https://www.youtube.com/watch?v=H9O0kV7zTAM"
    ],
    lang: "id"
  },

  'raja_ranjang': {
    subject: "🔥 Akses Download: Ebook Universal Raja Ranjang",
    downloadLink: "https://drive.google.com/drive/folders/1g35DL8wAap-FWWyCrvu6pMzD_8viCXM1?usp=sharing",
    color: "#C9991A", // Gold
    accentColor: "#EEE5C8",
    title: "Akses Raja Ranjang Diaktifkan",
    description: "Terima kasih! Pembayaran Anda sukses. Panduan Keintiman Raja Ranjang kini siap diunduh.",
    instructions: [
      "Buka link download yang telah kami sediakan.",
      "Simpan file Ebook PDF ke perangkat Anda.",
      "Pelajari, praktikkan, dan biarkan keajaibannya bekerja."
    ],
    lang: "id"
  },
  'ebook_diet': {
    subject: "🥗 Akses Diet: Program Diet eL-Vision Anda",
    downloadLink: "https://docs.google.com/document/d/1Xy--tVqilrJ-YNeQXXc9OjiDvmDCC_4l/edit?usp=sharing&ouid=105986209873893322274&rtpof=true&sd=true",
    color: "#4CAF50", // Green
    title: "Program Diet Dimulai!",
    description: "Terima kasih telah bergabung. Panduan lengkap diet Anda siap diakses.",
    instructions: [
      "Baca panduan pola makan dengan teliti.",
      "Siapkan bahan makanan sesuai daftar belanja.",
      "Mulai jurnal harian Anda besok pagi."
    ],
    lang: "id"
  },
  'ebook_elvision': {
    subject: "📘 Download: Ebook eL Vision Premium",
    downloadLink: "https://drive.google.com/drive/folders/17yvGGDVqT4BbymvKsTXZhoU_XKM4qD3S?usp=sharing",
    color: "#2196F3", // Blue
    title: "Akses Ebook Terbuka",
    description: "Selamat! Anda kini memiliki akses ke perpustakaan pengetahuan eL Vision.",
    instructions: [
      "Unduh ebook ke perangkat Anda.",
      "Pelajari materi dasar terlebih dahulu.",
      "Gabung komunitas Telegram jika tersedia."
    ],
    lang: "id"
  },
  'ebook_health20': {
    subject: "🌿 Akses Download: Protokol Pemulihan Kesehatan Anda",
    downloadLink: "https://drive.google.com/drive/folders/1E2iYI6JLtZ73F3jggHEHkke6IniRWaxB?usp=sharing",
    color: "#004d40", // Teal/Dark Green
    title: "Mulai Perjalanan Kesembuhan",
    description: "Terima kasih atas kepercayaan Anda. Folder ini berisi Ebook dan Terapi Audio untuk pemulihan.",
    instructions: [
      "Dengarkan audio setiap malam sebelum tidur (wajib earphone).",
      "Baca ebook untuk protokol diet.",
      "Lakukan konsisten minimal 21 hari."
    ],
    lang: "id"
  },
  'ebook_percayadiri': {
    subject: "🔥 Akses Download: Paket Pria Alpha Anda",
    downloadLink: "https://drive.google.com/drive/folders/1P4wdc44vaPquxw6vL2OpmQcENZeUIuNO?usp=sharing",
    color: "#1a2a3a", // Dark Navy
    accentColor: "#c5a059", // Gold
    title: "Akses Pria Alpha Terbuka",
    description: "Selamat! Anda sekarang memiliki akses penuh ke Paket Pria Alpha (Audio & Ebook).",
    instructions: [
      "Gunakan earphone untuk Audio Therapy.",
      "Dengarkan 'Deep Alpha Reset' saat akan tidur.",
      "Dengarkan 'Morning Glory' saat bangun pagi."
    ],
    lang: "id"
  },
  'ebook_feminine': {
    subject: "✨ Akses Download: Paket Dark Feminine Anda",
    downloadLink: "https://drive.google.com/drive/folders/19Hrs9fYFm_PNAQkOGJwI3OWdDb86dkuy?usp=share_link",
    color: "#e11d48",
    accentColor: "#ffffff",
    title: "Akses Dark Feminine Terbuka",
    description: "Selamat! Anda sekarang memiliki akses penuh ke Paket Dark Feminine.",
    instructions: [
      "Silahkan klik tombol di bawah untuk mendownload seluruh ebook Anda."
    ],
    lang: "id"
  },
  'ebook_feminine_lovemagnet': {
    subject: "✨ Akses Download: Paket Feminine Magnetism + Audio Love Magnet",
    downloadLink: "https://drive.google.com/drive/folders/1IZmSrzPDSgGSYwq1sQhhGgBaUExJjhgd?usp=sharing",
    color: "#e11d48",
    accentColor: "#facc15",
    title: "Akses Feminine Magnetism LENGKAP Terbuka",
    description: "Selamat! Anda sekarang memiliki akses penuh ke Paket Feminine Magnetism beserta Bonus Spesial Audio Love Magnet.",
    instructions: [
      "Gunakan earphone agar gelombang Theta bekerja maksimal.",
      "Dengarkan Audio 'Love Magnet' untuk memancarkan aura daya tarik.",
      "Dengarkan 'Goddess Awakening' setiap malam sebelum tidur.",
      "Dengarkan 'Morning Radiance' untuk memulai hari dengan energi feminin."
    ],
    lang: "id"
  },
  // --- DARK FEMININE EN ---
  'universal_darkfeminine_en': {
    subject: "✨ Download Access: Dark Feminine Package (PDF)",
    downloadLink: "https://drive.google.com/drive/folders/1xxikmQHs860wJL-uoZjw15Erb8FCsZ4H?usp=share_link",
    color: "#e11d48",
    accentColor: "#ffffff",
    title: "Access Granted: Dark Feminine",
    description: "Congratulations! You now have full access to the Dark Feminine PDF Package.",
    instructions: [
      "Click the button below to download your complete ebook package.",
      "Save to your device for offline reading anytime."
    ],
    btnText: "DOWNLOAD NOW",
    lang: "en"
  },
  'universal_darkfeminine_en_audio': {
    subject: "✨ Download Access: Dark Feminine Package (PDF + Audio)",
    downloadLink: "https://drive.google.com/drive/folders/1Otb4SkWN34Wv7lnHFiMSTjPUjbMAXk9Z?usp=share_link",
    color: "#e11d48",
    accentColor: "#facc15",
    title: "Access Granted: Dark Feminine + Audio",
    description: "Congratulations! You now have full access to the Dark Feminine PDF + Audio Package.",
    instructions: [
      "Click the button below to access your full PDF + Audio package.",
      "Use earphones for the best Audio Theta experience.",
      "Listen to the audio every night before sleep for maximum effect."
    ],
    btnText: "DOWNLOAD PDF + AUDIO",
    lang: "en"
  },
  // --- DARK FEMININE PH ---
  'universal_darkfeminine_ph': {
    subject: "✨ I-download Na: Dark Feminine Package (PDF)",
    downloadLink: "https://drive.google.com/drive/folders/1CYBeQOBAgSHCLjxU6a6d3qEa_-t35cXe?usp=share_link",
    color: "#e11d48",
    accentColor: "#ffffff",
    title: "Binuksan Na: Dark Feminine",
    description: "Binabati kita! Mayroon ka na ngayong buong access sa Dark Feminine PDF Package.",
    instructions: [
      "I-click ang button sa ibaba para i-download ang iyong kumpletong ebook package.",
      "I-save sa iyong device para mabasa kahit walang internet."
    ],
    btnText: "I-DOWNLOAD NGAYON",
    lang: "tl"
  },
  'universal_darkfeminine_ph_audio': {
    subject: "✨ I-download Na: Dark Feminine Package (PDF + Audio)",
    downloadLink: "https://drive.google.com/drive/folders/1Z7ArFWDe0lhDlcTfPWSV0MM0zeytYMqk?usp=share_link",
    color: "#e11d48",
    accentColor: "#facc15",
    title: "Binuksan Na: Dark Feminine + Audio",
    description: "Binabati kita! Mayroon ka na ngayong buong access sa Dark Feminine PDF + Audio Package.",
    instructions: [
      "I-click ang button sa ibaba para ma-access ang iyong buong PDF + Audio package.",
      "Gumamit ng earphones para sa pinakamahusay na karanasan sa Audio Theta.",
      "Pakinggan ang audio tuwing gabi bago matulog para sa pinakamataas na epekto."
    ],
    btnText: "I-DOWNLOAD PDF + AUDIO",
    lang: "tl"
  },
  'ebook_uangpanas': {
    subject: "🔥 Akses Download: Sistem Uang Panas (Lead Magnet + Audio)",
    downloadLink: "https://drive.google.com/file/d/1R_AEFpjaxBwYnxLGevVPKHf548pMn9gE/view?usp=sharing", // Placeholder link, please update
    color: "#b91c1c", // Red 700
    accentColor: "#facc15", // Yellow 400
    title: "Sistem Uang Panas Diaktifkan!",
    description: "Terima kasih! Anda telah mengambil langkah cerdas. Berikut adalah akses ke 'senjata' rahasia Anda.",
    instructions: [
      "Download Ebook & Lead Magnet Pack segera.",
      "Dengarkan Audio 'Money Magnet' setiap pagi dan malam.",
      "Pelajari modul Affiliate untuk mulai hasilkan komisi 50%."
    ],
    lang: "id"
  },
  'webinar_el': {
    subject: "🎟️ Webinar Ticket: eL Vision & Bonus Ebook",
    downloadLink: "https://drive.google.com/drive/folders/1ZQ4LsWFnuuRJTNu1vfZc5-hJDfOGzJsU?usp=share_link",
    color: "#b91c1c",
    accentColor: "#facc15",
    title: "You are Registered! + Bonus Access",
    description: "Thank you! You have taken a smart step. Below is your access to the Bonus Ebook and our Telegram Group.",
    instructions: [
      "Check your session time here: <a href='https://ai.elvisiongroup.com/webinarleft' style='color:#b91c1c; font-weight:bold;'>Check Session Status</a> (Enter your email)",
      "Download your Bonus Ebook via the button above.",
      "MANDATORY: Join our Telegram Waiting List here: <a href='https://t.me/elvision1' style='color:#b91c1c; font-weight:bold;'>Click To Join Telegram</a>",
      "Event Date: Sunday, February 22, 2026 at 17:00 WIB."
    ],
    lang: "en",
    btnText: "GET BONUS EBOOK"
  },
  'vip_coaching': {
    subject: "💎 VIP Confirmation: 6 Weeks eL Vision Program",
    downloadLink: "https://wa.me/62895325633487?text=HI%20I%20have%20paid%20for%20VIP%206%20weeks",
    color: "#004d40", // Teal/Dark Green
    title: "Welcome to the VIP Program",
    description: "Your payment has been received. The next step is to confirm your 1:1 session schedule.",
    instructions: [
      "Click the button below to connect with our WhatsApp Admin.",
      "Send the pre-filled confirmation message.",
      "Our admin will arrange your first session schedule."
    ],
    btnText: "WHATSAPP CONFIRMATION",
    lang: "en"
  },
  // --- USA PRODUCTS (ENGLISH) ---
  'usa_ebookhealth': {
    subject: "🌿 Download Access: Your Health Recovery Protocol",
    downloadLink: "https://drive.google.com/drive/folders/1E2iYI6JLtZ73F3jggHEHkke6IniRWaxB?usp=sharing",
    color: "#004d40", // Teal/Dark Green
    title: "Start Your Healing Journey",
    description: "Thank you for your trust. This folder contains your Recovery Ebook and Audio Therapy.",
    instructions: [
      "Listen to the audio every night before sleep (earphones mandatory).",
      "Read the ebook for the diet protocol.",
      "Be consistent for at least 21 days."
    ],
    lang: "en"
  },
  'usa_ebookslim': {
    subject: "🥗 Download Access: Slim Without Suffering Program",
    downloadLink: "https://docs.google.com/document/d/1Xy--tVqilrJ-YNeQXXc9OjiDvmDCC_4l/edit?usp=sharing&ouid=105986209873893322274&rtpof=true&sd=true", // Using existing diet link placeholder
    color: "#4CAF50", // Green
    title: "Your Slimming Journey Begins!",
    description: "Thank you for joining. Your complete diet guide is ready to access.",
    instructions: [
      "Read the meal plan guide carefully.",
      "Prepare your groceries according to the shopping list.",
      "Start your daily journal tomorrow morning."
    ],
    lang: "en"
  },
  'usa_3000': {
    subject: "💎 VIP Confirmation: 6 Weeks eL Vision Program",
    downloadLink: "https://wa.me/62895325633487?text=HI%20I%20have%20paid%20for%20VIP%206%20weeks",
    color: "#004d40",
    title: "Welcome to the VIP Program",
    description: "Your payment has been received. The next step is to confirm your 1:1 session schedule.",
    instructions: [
      "Click the button below to connect with our WhatsApp Admin.",
      "Send the pre-filled confirmation message.",
      "Our admin will arrange your first session schedule."
    ],
    btnText: "WHATSAPP CONFIRMATION",
    lang: "en"
  },
  'usa_ebookfeminine': {
    subject: "✨ Download Access: Feminine Magnetism (USA)",
    downloadLink: "https://drive.google.com/drive/folders/1Pxz5nYxblo-rzllG6SsYUQq4039Kbd9C?usp=share_link",
    color: "#e11d48", // Rose 600
    accentColor: "#ffffff",
    title: "Access Granted: Feminine Magnetism",
    description: "Congratulations! You now have full access to the Feminine Magnetism Package (Audio & Ebook).",
    instructions: [
      "Use earphones for the best experience with Theta waves.",
      "Listen to 'Goddess Awakening' every night before sleep.",
      "Listen to 'Morning Radiance' to start your day with feminine energy."
    ],
    lang: "en"
  },
  'usa_webinar20': {
    subject: "🎟️ Webinar Access: eL Vision Webinar & Materials",
    downloadLink: "https://chat.whatsapp.com/KxDQ29iKvAQBVvS3deckVC",
    color: "#004d40",
    title: "Welcome to the eL Vision Webinar",
    description: "Thank you for joining our global webinar! Below is your access link and instructions to prepare for your transformation.",
    instructions: [
      "Check your session time here: <a href='https://ai.elvisiongroup.com/webinarleft' style='color:#004d40; font-weight:bold;'>Check Session Status</a> (Enter your email)",
      "JOIN THE WEBINAR GROUP: https://chat.whatsapp.com/KxDQ29iKvAQBVvS3deckVC",
      "Contact Customer Service in the group to confirm your attendance.",
      "Access your preparation materials here: https://drive.google.com/drive/folders/1E2iYI6JLtZ73F3jggHEHkke6IniRWaxB?usp=sharing",
      "Listen to your alignment audio every night before sleep (earphones mandatory)."
    ],
    btnText: "JOIN WEBINAR GROUP",
    lang: "en"
  },
  'sg_elvision_en': {
    subject: "📘 Download: eL Vision Ebook (English Edition)",
    downloadLink: "https://drive.google.com/drive/folders/17yvGGDVqT4BbymvKsTXZhoU_XKM4qD3S?usp=sharing",
    color: "#2196F3",
    title: "Access Granted: eL Vision Ebook",
    description: "Congratulations! You now have full access to the eL Vision Ebook + Audio Hypnosis (English Edition).",
    instructions: [
      "Download the ebook to your device.",
      "Study the foundational materials first.",
      "Use earphones for the Audio Hypnosis for maximum effect."
    ],
    btnText: "DOWNLOAD NOW",
    lang: "en"
  },
  'sg_elvision_malay': {
    subject: "📘 Muat Turun: Ebook eL Vision (Edisi Bahasa Melayu)",
    downloadLink: "https://drive.google.com/drive/folders/17yvGGDVqT4BbymvKsTXZhoU_XKM4qD3S?usp=sharing",
    color: "#2196F3",
    title: "Akses Diberikan: Ebook eL Vision",
    description: "Tahniah! Anda kini mempunyai akses penuh ke Ebook eL Vision + Hipnosis Audio (Edisi Bahasa Melayu).",
    instructions: [
      "Muat turun ebook ke peranti anda.",
      "Pelajari bahan asas terlebih dahulu.",
      "Gunakan fon telinga untuk Hipnosis Audio untuk kesan maksimum."
    ],
    btnText: "MUAT TURUN SEKARANG",
    lang: "ms"
  }
};

// Helper to match product name to key
function getProductKey(productName: string): string {
  if (!productName) return 'ebook_elvision'; // Default fallback
  const lower = productName.toLowerCase();

  // --- Exact / specific matches first ---
  if (lower.includes('parenting_paid') || lower.includes('universal_id_parenting_paid')) return 'universal_Id_parenting_paid';
  if (lower.includes('sg_elvision_en')) return 'sg_elvision_en';
  if (lower.includes('sg_elvision_malay')) return 'sg_elvision_malay';

  if (lower.includes('usa_ebookhealth') || lower.includes('ebookhealthlp')) return 'usa_ebookhealth';
  if (lower.includes('usa_webinar')) return 'usa_webinar20';
  if (lower.includes('usa_ebookslim')) return 'usa_ebookslim';
  if (lower.includes('usa_ebookfeminine')) return 'usa_ebookfeminine';
  if (lower.includes('usa_3000')) return 'usa_3000';

  // --- Dark Feminine EN & PH (check BEFORE generic 'feminine') ---
  if (lower.includes('universal_darkfeminine_en_audio') || lower.includes('dark feminine en audio') || lower.includes('darkfeminine en audio')) return 'universal_darkfeminine_en_audio';
  if (lower.includes('universal_darkfeminine_en') || lower.includes('dark feminine en')) return 'universal_darkfeminine_en';
  if (lower.includes('universal_darkfeminine_ph_audio') || lower.includes('dark feminine ph audio') || lower.includes('darkfeminine ph audio')) return 'universal_darkfeminine_ph_audio';
  if (lower.includes('universal_darkfeminine_ph') || lower.includes('dark feminine ph')) return 'universal_darkfeminine_ph';

  // --- Dark Feminine ID (audio and non-audio both map to ebook_feminine folder) ---
  if (lower.includes('universal_darkfeminine_id') || lower.includes('dark feminine id') || lower.includes('universal dark feminine id')) return 'ebook_feminine';

  if (lower.includes('diet')) return 'ebook_diet';
  if (lower.includes('health') || lower.includes('pemulihan')) return 'ebook_health20';
  if (lower.includes('percayadiri') || lower.includes('pria alpha') || lower.includes('alpha')) return 'ebook_percayadiri';
  if (lower.includes('love magnet')) return 'ebook_feminine_lovemagnet';
  if (lower.includes('feminine') || lower.includes('feminin') || lower.includes('magnetism') || lower.includes('dark feminine') || lower.includes('dark feminin')) return 'ebook_feminine';
  if (lower.includes('uangpanas') || lower.includes('uang panas')) return 'ebook_uangpanas';
  if (lower.includes('vip') || lower.includes('3000') || lower.includes('coaching')) return 'vip_coaching';
  if (lower.includes('webinar_el') || lower.includes('jalur langit') || lower.includes('webinar')) return 'webinar_el';
  if (lower.includes('raja ranjang')) return 'raja_ranjang';

  return 'ebook_elvision';
}

// Add subscriber to Mailketing list
async function addToMailketingList(email: string, name: string) {
  try {
    const params = new URLSearchParams({
      api_token: MAILKETING_API_KEY!,
      list_id: LIST_ID,
      email: email,
      first_name: name ? name.split(' ')[0] : email.split('@')[0],
      last_name: name ? name.split(' ').slice(1).join(' ') : ''
    });

    await fetch(`${MAILKETING_API_URL}/addsubtolist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });
    return true;
  } catch (error) {
    console.error('❌ Failed to add to list:', error);
    return false;
  }
}

// Send email via Mailketing
async function sendMailketingEmail(email: string, subject: string, htmlContent: string) {
  try {
    const params = new URLSearchParams({
      api_token: MAILKETING_API_KEY!,
      email: 'support@elvisiongroup.com',
      from_name: 'eL Vision Group',
      from_email: 'support@elvisiongroup.com',
      recipient: email,
      subject: subject,
      content: htmlContent
    });

    const response = await fetch(`${MAILKETING_API_URL}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    const result = await response.text();
    try {
      return JSON.parse(result);
    } catch {
      return { success: true, response: result };
    }
  } catch (error) {
    console.error('❌ Mailketing send failed:', error);
    throw error;
  }
}

const handler = async (req: Request) => {
  console.log('🚀 SEND-EBOOKS-EMAIL Edge Function Started');

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const recipientEmail = body.userEmail || body.email;
    if (!recipientEmail) throw new Error('Email address is required');

    const amount = body.amount || 0;
    const reference = body.reference || 'N/A';
    const productNameInput = body.subscriptionType || body.productName || 'Unknown Product';
    const userName = body.userName || recipientEmail.split('@')[0];
    const currency = body.currency || 'IDR';
    const affiliateEmail = body.affiliateEmail;

    // Determine Product Template
    const productKey = getProductKey(productNameInput);
    const template = PRODUCT_TEMPLATES[productKey];

    console.log(`📊 Processing email for: ${recipientEmail} | Product: ${productNameInput} -> Key: ${productKey}`);

    let displayAmount = '';
    // Force USD display for USA products regardless of incoming currency string
    if (productKey.startsWith('usa_')) {
      displayAmount = `$${Number(amount).toFixed(2)} USD`;
    } else if (currency === 'USD') {
      displayAmount = `$${Number(amount).toFixed(2)} USD`;
    } else if (currency === 'SGD') {
      displayAmount = `S$${Number(amount).toFixed(2)} SGD`;
    } else if (currency === 'MYR') {
      displayAmount = `RM ${Number(amount).toFixed(2)} MYR`;
    } else if (currency === 'IDR') {
      displayAmount = `Rp ${Number(amount).toLocaleString('id-ID')}`;
    } else {
      // Fallback detection if currency not explicitly sent
      displayAmount = amount < 1000
        ? `$${Number(amount).toFixed(2)} USD`
        : `Rp ${Number(amount).toLocaleString('id-ID')}`;
    }

    // Add to list first
    await addToMailketingList(recipientEmail, userName);

    // Generate HTML
    const mainColor = template.color || '#333';
    const accentColor = template.accentColor || '#ffffff';

    const htmlLang = template.lang || 'id';
    const greeting = htmlLang === 'en' ? 'Hello' : 'Halo';
    const instructionLabel = htmlLang === 'en' ? 'Instructions:' : 'Instruksi:';
    const productLabel = htmlLang === 'en' ? 'Product:' : 'Produk:';
    const referenceLabel = htmlLang === 'en' ? 'Reference:' : 'Referensi:';
    const totalLabel = htmlLang === 'en' ? 'Total:' : 'Total:';
    const helpText = htmlLang === 'en'
      ? 'Need help? Reply to this email or contact us via WhatsApp.'
      : 'Butuh bantuan? Balas email ini atau hubungi kami via WhatsApp.';
    const btnText = template.btnText || (htmlLang === 'en' ? 'DOWNLOAD NOW' : 'DOWNLOAD SEKARANG');

    const htmlContent = `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f4f4f9; color: #333; line-height: 1.6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: ${mainColor}; color: ${accentColor}; padding: 40px 20px; text-align: center; border-bottom: 4px solid ${template.accentColor ? template.accentColor : 'rgba(255,255,255,0.2)'}; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 40px 30px; }
        .btn { display: inline-block; background: ${mainColor}; color: ${accentColor}; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 20px 0; text-transform: uppercase; letter-spacing: 1px; transition: opacity 0.3s; }
        .btn:hover { opacity: 0.9; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee; }
        .details { background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 14px; border: 1px solid #eee; }
        .instruction-list { background: #fff; border: 1px dashed ${mainColor}; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .instruction-list ul { margin: 0; padding-left: 20px; }
        .instruction-list li { margin-bottom: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${template.title}</h1>
        </div>
        <div class="content">
            <h2>${greeting} ${userName},</h2>
            <p>${template.description}</p>
            
            <div style="text-align: center;">
                <a href="${template.downloadLink}" class="btn">
                    ${btnText}
                </a>
            </div>

            <div class="instruction-list">
                <p style="font-weight: bold; margin-top: 0; color: ${mainColor};">${instructionLabel}</p>
                <ul>
                    ${template.instructions.map((inst: string) => `<li>${inst}</li>`).join('')}
                </ul>
            </div>

            <div class="details">
                <p><strong>${productLabel}</strong> ${productNameInput}</p>
                <p><strong>${referenceLabel}</strong> ${reference}</p>
                <p><strong>${totalLabel}</strong> ${displayAmount}</p>
            </div>
        </div>
        <div class="footer">
            <p>&copy; 2026 eL Vision Group. All Rights Reserved.</p>
            <p>${helpText}</p>
        </div>
    </div>
</body>
</html>`;

    // Send Email to Buyer (paid only)
    let emailResult = null;
    emailResult = await sendMailketingEmail(recipientEmail, template.subject, htmlContent);
    console.log("✅ Email sent successfully to buyer");

    // BCC to Admins (send separate emails as BCC simulation)
    const bccList = ['support@elvisiongroup.com', 'elreyzandra@gmail.com', 'elvisiondragon@gmail.com'];

    // Add affiliate to BCC if exists
    if (affiliateEmail) {
      bccList.push(affiliateEmail);
      console.log(`📎 Adding affiliate ${affiliateEmail} to notification list.`);
    }

    for (const bccEmail of bccList) {
      try {
        await sendMailketingEmail(bccEmail, `[NOTIF] ${template.subject}`, htmlContent);
        console.log(`✅ BCC/Notif sent to ${bccEmail}`);
      } catch (e) {
        console.error(`⚠️ Notification Failed for ${bccEmail}:`, e);
      }
    }

    // --- WHATSAPP NOTIFICATION ---
    const userPhone = body.phone || body.phone_number || body.ph;

    const waProductKeys = ['raja_ranjang', 'ebook_feminine', 'ebook_feminine_lovemagnet', 'universal_Id_parenting_paid',
      'universal_darkfeminine_en', 'universal_darkfeminine_en_audio',
      'universal_darkfeminine_ph', 'universal_darkfeminine_ph_audio'];

    if (waProductKeys.includes(productKey)) {
      const waToken = "23b62c4255c43489f55fa84693dc0451d89ea5a5c9ec00021a7b77287cdce0b8";

      if (userPhone) {
        console.log(`📱 Sending WhatsApp Notification to ${userPhone} for ${productKey}...`);
        try {
          let cleanPhone = userPhone.replace(/\D/g, '');
          if (cleanPhone.startsWith('0')) {
            cleanPhone = '62' + cleanPhone.slice(1);
          } else if (cleanPhone.startsWith('8')) {
            cleanPhone = '62' + cleanPhone;
          }

          const isDarkFeminine = productKey.startsWith('ebook_feminine') || productKey.startsWith('universal_darkfeminine');
          const isParenting = productKey === 'universal_Id_parenting_paid';
          const isEnglish = productKey.includes('_en');
          const isFilipino = productKey.includes('_ph');

          const productNameDisplay = isParenting
            ? "Co-Parenting Tracker"
            : productKey === 'ebook_feminine_lovemagnet'
              ? "Universal Dark Feminine + Love Magnet"
              : productKey === 'universal_darkfeminine_en_audio'
                ? "Dark Feminine (PDF + Audio) EN"
                : productKey === 'universal_darkfeminine_en'
                  ? "Dark Feminine (PDF) EN"
                  : productKey === 'universal_darkfeminine_ph_audio'
                    ? "Dark Feminine (PDF + Audio) PH"
                    : productKey === 'universal_darkfeminine_ph'
                      ? "Dark Feminine (PDF) PH"
                      : isDarkFeminine ? "Universal Dark Feminine" : "Universal Raja Ranjang";

          const adminName = (isDarkFeminine || isEnglish || isFilipino) ? "Admin eL Vision" : "Renata dari Admin eL Vision Group";

          let waMessage: string;
          if (isEnglish) {
            waMessage = `Hi ${userName}! 👋\nI am ${adminName}.\n\nThank you for purchasing *${productNameDisplay}*.\n\nYour payment of ${displayAmount} has been received.\n\nHere is your exclusive download link:\n👉 ${template.downloadLink}\n\nPlease download and save it! Feel free to reply if you have any questions.\n\nWarm regards,\neL Vision Group`;
          } else if (isFilipino) {
            waMessage = `Halo ${userName}! 👋\nAko si ${adminName}.\n\nSalamat sa iyong pagbili ng *${productNameDisplay}*.\n\nNatanggap na namin ang iyong bayad na ${displayAmount}.\n\nNarito ang iyong eksklusibong download link:\n👉 ${template.downloadLink}\n\nPaki-download at i-save na! Huwag mag-atubiling sumagot kung may katanungan ka.\n\nMainit na pagbati,\neL Vision Group`;
          } else {
            waMessage = `Halo kak ${userName}! 👋\nSaya ${adminName}.\n\nTerima kasih atas pembayaran kakak untuk paket *${productNameDisplay}*.\n\nPembayaran kakak telah kami terima senilai ${displayAmount}.\n\nBerikut adalah link akses eksklusif untuk mendownload materi kakak:\n👉 ${template.downloadLink}\n\nSilakan di-download dan disimpan ya kak. Jika ada pertanyaan, kakak bisa langsung balas pesan ini.\n\nSalam hangat,\nAdmin - eL Vision Group`;
          }

          const waResponse = await fetch('https://watzapp.web.id/api/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': waToken },
            body: JSON.stringify({ to: cleanPhone, message: waMessage, token: waToken })
          });

          if (waResponse.ok) {
            console.log(`✅ WhatsApp sent successfully to buyer: ${cleanPhone}`);
          } else {
            console.error(`⚠️ WhatsApp API returned status ${waResponse.status} for buyer: ${cleanPhone}`);
          }
        } catch (waError) {
          console.error(`❌ Error sending WhatsApp to buyer ${userPhone}:`, waError);
        }
      }

      // 🔔 ADMIN NOTIFICATION
      const adminPhones = ['6281383838013', '6285664733499'];
      const adminMessage = `💰 *PEMBELIAN BARU: ${productKey.toUpperCase()}*\n\nNama: ${userName}\nEmail: ${recipientEmail}\nWA: ${userPhone || 'N/A'}\nTotal: ${displayAmount}\nRef: ${reference}`;

      for (const adminPhone of adminPhones) {
        console.log(`📱 Sending Admin WA Notification to ${adminPhone}...`);
        try {
          const waResponseAdmin = await fetch('https://watzapp.web.id/api/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': waToken },
            body: JSON.stringify({ to: adminPhone, message: adminMessage, token: waToken })
          });
          if (waResponseAdmin.ok) console.log(`✅ WhatsApp sent to admin: ${adminPhone}`);
        } catch (waError) {
          console.error(`❌ Error sending WhatsApp to admin ${adminPhone}:`, waError);
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Email sent successfully',
      mailketing_result: emailResult,
      product_detected: productKey
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });

  } catch (error: any) {
    console.error("❌ Error sending email:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
};

serve(handler);
