//YOU STUPID AI READ THIS ? DONT FUCKING ADD THIS EDGE FUNCTION TO TRIPAY CALLBACK THIS IS FUTURE DEVELOPMENT NOT PRODUCTION
// ==================================================================================
// MASTER PAID NOTIF: UNIFIED FULFILLMENT FOR ALL PRODUCTS (DIGITAL & PHYSICAL)
// ==================================================================================
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

// --- CONFIGURATION ---
const MAILKETING_API_URL = Deno.env.get('MAILKETING_API_URL') || 'https://api.mailketing.co.id/api/v1';
const MAILKETING_API_KEY = Deno.env.get('MAILKETING_API_KEY');
const MAILKETING_EMAIL = Deno.env.get('MAILKETING_EMAIL') || 'support@elvisiongroup.com';

const WAPI_TOKEN = Deno.env.get('WAPI_TOKEN') || "rvpwk8dkih9m";
const WAPI_URL = Deno.env.get('WAPI_URL') || "https://api.elvisiongroup.com/api/send";
const WAPI_SESSION = Deno.env.get('WAPI_SESSION') || "renata";

const ADMIN_PHONES = ['6281383838013', '6285664733499'];

// --- PRODUCT TEMPLATES (MASTER LIST) ---
const PRODUCT_TEMPLATES: Record<string, any> = {
  // DIGITAL / EBOOKS
  'raja_ranjang': { sku: "ebookspaid01", subject: "Akses Download: Ebook Universal Raja Ranjang", downloadLink: "https://drive.google.com/drive/folders/1g35DL8wAap-FWWyCrvu6pMzD_8viCXM1?usp=sharing", title: "Akses Raja Ranjang Diaktifkan", lang: "id", instructions: ["Buka link download.", "Simpan file PDF.", "Praktikkan materinya."] },
  'ebook_diet': { sku: "ebookspaid02", subject: "Akses Diet: Program Diet eL-Vision Anda", downloadLink: "https://docs.google.com/document/d/1Xy--tVqilrJ-YNeQXXc9OjiDvmDCC_4l/edit?usp=sharing", title: "Program Diet Dimulai!", lang: "id", instructions: ["Baca panduan pola makan.", "Siapkan bahan makanan.", "Mulai jurnal harian."] },
  'ebook_elvision': { sku: "ebookspaid03", subject: "Download: Ebook eL Vision Premium", downloadLink: "https://drive.google.com/drive/folders/17yvGGDVqT4BbymvKsTXZhoU_XKM4qD3S?usp=sharing", title: "Akses Ebook Terbuka", lang: "id", instructions: ["Unduh ke perangkat Anda.", "Pelajari materi dasar.", "Gabung Telegram."] },
  'ebook_health20': { sku: "ebookspaid04", subject: "Akses Download: Protokol Pemulihan Kesehatan Anda", downloadLink: "https://drive.google.com/drive/folders/1E2iYI6JLtZ73F3jggHEHkke6IniRWaxB?usp=sharing", title: "Mulai Perjalanan Kesembuhan", lang: "id", instructions: ["Dengarkan audio sebelum tidur.", "Baca ebook protokol diet.", "Konsisten minimal 21 hari."] },
  'ebook_percayadiri': { sku: "ebookspaid05", subject: "Akses Download: Paket Pria Alpha Anda", downloadLink: "https://drive.google.com/drive/folders/1P4wdc44vaPquxw6vL2OpmQcENZeUIuNO?usp=sharing", title: "Akses Pria Alpha Terbuka", lang: "id", instructions: ["Gunakan earphone untuk Audio.", "Deep Alpha Reset saat tidur.", "Morning Glory saat bangun."] },
  'ebook_feminine': { sku: "ebookspaid06", subject: "Akses Download: Paket Dark Feminine Anda", downloadLink: "https://drive.google.com/drive/folders/19Hrs9fYFm_PNAQkOGJwI3OWdDb86dkuy?usp=share_link", title: "Akses Dark Feminine Terbuka", lang: "id", instructions: ["Klik tombol di bawah download."] },
  'ebook_feminine_lovemagnet': { sku: "ebookspaid07", subject: "Akses Download: Paket Feminine Magnetism + Audio Love Magnet", downloadLink: "https://drive.google.com/drive/folders/1IZmSrzPDSgGSYwq1sQhhGgBaUExJjhgd?usp=sharing", title: "Akses Feminine Magnetism LENGKAP", lang: "id", instructions: ["Gunakan earphone.", "Love Magnet untuk aura.", "Goddess Awakening sebelum tidur."] },
  'universal_darkfeminine_en': { sku: "ebookspaid08", subject: "Download Access: Dark Feminine Package (PDF)", downloadLink: "https://drive.google.com/drive/folders/1xxikmQHs860wJL-uoZjw15Erb8FCsZ4H?usp=share_link", title: "Access Granted: Dark Feminine", lang: "en", instructions: ["Click to download ebook.", "Save for offline reading."] },
  'universal_darkfeminine_en_audio': { sku: "ebookspaid09", subject: "Download Access: Dark Feminine Package (PDF + Audio)", downloadLink: "https://drive.google.com/drive/folders/1Otb4SkWN34Wv7lnHFiMSTjPUjbMAXk9Z?usp=share_link", title: "Access Granted: Dark Feminine + Audio", lang: "en", instructions: ["Access PDF + Audio.", "Use earphones for Theta.", "Listen before sleep."] },
  'universal_darkfeminine_ph': { sku: "ebookspaid10", subject: "I-download Na: Dark Feminine Package (PDF)", downloadLink: "https://drive.google.com/drive/folders/1CYBeQOBAgSHCLjxU6a6d3qEa_-t35cXe?usp=share_link", title: "Binuksan Na: Dark Feminine", lang: "tl", instructions: ["I-click para i-download.", "I-save sa iyong device."] },
  'universal_darkfeminine_ph_audio': { sku: "ebookspaid11", subject: "I-download Na: Dark Feminine Package (PDF + Audio)", downloadLink: "https://drive.google.com/drive/folders/1Z7ArFWDe0lhDlcTfPWSV0MM0zeytYMqk?usp=share_link", title: "Binuksan Na: Dark Feminine + Audio", lang: "tl", instructions: ["I-access ang PDF + Audio.", "Gumamit ng earphones.", "Pakinggan bago matulog."] },
  'ebook_uangpanas': { sku: "ebookspaid12", subject: "Akses Download: Sistem Uang Panas", downloadLink: "https://drive.google.com/file/d/1R_AEFpjaxBwYnxLGevVPKHf548pMn9gE/view?usp=sharing", title: "Sistem Uang Panas Diaktifkan!", lang: "id", instructions: ["Download Ebook segera.", "Dengarkan Money Magnet.", "Pelajari modul Affiliate."] },
  'webinar_el': { sku: "ebookspaid13", subject: "Webinar Ticket: eL Vision & Bonus Ebook", downloadLink: "https://drive.google.com/drive/folders/1ZQ4LsWFnuuRJTNu1vfZc5-hJDfOGzJsU?usp=share_link", title: "You are Registered! + Bonus", lang: "en", instructions: ["Join Telegram Waiting List.", "Download Bonus Ebook.", "Check Session Status."] },
  'vip_coaching': { sku: "paymentpaid01", subject: "VIP Confirmation: 6 Weeks eL Vision Program", downloadLink: "https://wa.me/62895325633487", title: "Welcome to VIP Program", lang: "en", instructions: ["Confirm session schedule.", "Connect with Admin."] },
  'universal_saham_ultimate': { sku: "ebookspaid22", subject: "Akses Download: Ebook Saham Ultimate Anda", downloadLink: "https://drive.google.com/drive/folders/1sJ9vf8NLuH3ccVjc3ofPk2Ew3IjKTDFJ?usp=sharing", title: "Akses Saham Ultimate Terbuka", lang: "id", instructions: ["Simpan file PDF.", "Login ke Dashboard Saham."] },
  
  // PHYSICAL / SUBSCRIPTIONS
  'fitfactor': { sku: "paymentpaid05", subject: "Pesanan Diterima: Fit Factor Herbal", title: "Fit Factor Imun Booster", lang: "id", isPhysical: true },
  'drelf': { sku: "paymentpaid02", subject: "Order Confirmed: Drelf Collagen Ritual", title: "Drelf Collagen", lang: "id", isPhysical: true },
  'jewelry': { sku: "paymentpaid03", subject: "Order Confirmed: eL Royal Jewelry Masterpiece", title: "eL Royal Jewelry", lang: "id", isPhysical: true },
  'parenting': { sku: "paymentpaid04", subject: "Akses Download: Co-Parenting Tracker", downloadLink: "https://docs.google.com/spreadsheets/d/1u1H6Pv0O5noENH7_P-SEqheHmIqlixAo_0DncVYMuqlY/edit", title: "Co-Parenting Tracker", lang: "id", instructions: ["Make a copy of the sheet."] },
  'pro': { sku: "paymentpaid06", subject: "Pembayaran Berhasil: ElVision Group Pro", title: "Pro Subscription", lang: "id" }
};

// Helper: Get Product Key & SKU
function getMasterProduct(productName: string): { key: string; sku: string } {
  const lower = (productName || '').toLowerCase();
  
  // SKU Maps
  const ebookSkuMap: Record<string, string> = {
    'ebookspaid01': 'raja_ranjang', 'ebookspaid02': 'ebook_diet', 'ebookspaid03': 'ebook_elvision',
    'ebookspaid04': 'ebook_health20', 'ebookspaid05': 'ebook_percayadiri', 'ebookspaid06': 'ebook_feminine',
    'ebookspaid07': 'ebook_feminine_lovemagnet', 'ebookspaid08': 'universal_darkfeminine_en',
    'ebookspaid09': 'universal_darkfeminine_en_audio', 'ebookspaid10': 'universal_darkfeminine_ph',
    'ebookspaid11': 'universal_darkfeminine_ph_audio', 'ebookspaid12': 'ebook_uangpanas',
    'ebookspaid13': 'webinar_el', 'ebookspaid22': 'universal_saham_ultimate'
  };
  const paymentSkuMap: Record<string, string> = {
    'paymentpaid01': 'vip_coaching', 'paymentpaid02': 'drelf', 'paymentpaid03': 'jewelry',
    'paymentpaid04': 'parenting', 'paymentpaid05': 'fitfactor', 'paymentpaid06': 'pro'
  };

  // Check SKUs first
  const skuMatch = lower.match(/^(ebookspaid|paymentpaid)0?(\d+)$/);
  if (skuMatch) {
    const skuCode = `${skuMatch[1]}${skuMatch[2].padStart(2, '0')}`;
    const key = (skuMatch[1] === 'ebookspaid' ? ebookSkuMap[skuCode] : paymentSkuMap[skuCode]);
    if (key) return { key, sku: skuCode };
  }

  // Keyword Matching
  if (lower.includes('fitfactor')) return { key: 'fitfactor', sku: 'paymentpaid05' };
  if (lower.includes('drelf')) return { key: 'drelf', sku: 'paymentpaid02' };
  if (lower.includes('jewelry')) return { key: 'jewelry', sku: 'paymentpaid03' };
  if (lower.includes('parenting')) return { key: 'parenting', sku: 'paymentpaid04' };
  if (lower.includes('love magnet')) return { key: 'ebook_feminine_lovemagnet', sku: 'ebookspaid07' };
  if (lower.includes('dark feminine') || lower.includes('feminin') || lower.includes('magnetism')) {
    if (lower.includes('_en')) return { key: 'universal_darkfeminine_en', sku: 'ebookspaid08' };
    if (lower.includes('_ph')) return { key: 'universal_darkfeminine_ph', sku: 'ebookspaid10' };
    return { key: 'ebook_feminine', sku: 'ebookspaid06' };
  }
  if (lower.includes('saham')) return { key: 'universal_saham_ultimate', sku: 'ebookspaid22' };
  if (lower.includes('raja ranjang')) return { key: 'raja_ranjang', sku: 'ebookspaid01' };
  if (lower.includes('diet')) return { key: 'ebook_diet', sku: 'ebookspaid02' };
  if (lower.includes('health') || lower.includes('pemulihan')) return { key: 'ebook_health20', sku: 'ebookspaid04' };

  return { key: 'ebook_elvision', sku: 'ebookspaid03' };
}

async function sendMailketingEmail(email: string, subject: string, htmlContent: string) {
  try {
    const params = new URLSearchParams({ api_token: MAILKETING_API_KEY!, from_name: 'eL Vision Group', from_email: MAILKETING_EMAIL, recipient: email, subject: subject, content: htmlContent });
    await fetch(`${MAILKETING_API_URL}/send`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params });
  } catch (err) { console.error('Email Failed:', err); }
}

const handler = async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const body = await req.json();
    const recipientEmail = body.userEmail || body.email;
    if (!recipientEmail) throw new Error('Email required');

    const userName = body.userName || recipientEmail.split('@')[0];
    const userPhone = body.userPhone || body.phone || body.phone_number || body.ph;
    const amount = body.amount || 0;
    const reference = body.reference || 'N/A';
    const rawProduct = body.subscriptionType || body.product_name || 'Generic Product';
    
    const { key, sku } = getMasterProduct(rawProduct);
    const template = PRODUCT_TEMPLATES[key];

    const formattedAmount = body.currency === 'USD' ? `$${Number(amount).toFixed(2)}` : `Rp ${Number(amount).toLocaleString('id-ID')}`;
    const address = template.isPhysical ? (body.address || "Standard Delivery") : "DIGITAL";

    // --- WHATSAPP MESSAGE ---
    let waMessage = "";
    const adminName = (key.startsWith('ebook_feminine') || key.includes('_en') || key.includes('_ph')) ? "Admin eL Vision" : "Renata dari Admin eL Vision Group";
    
    if (template.isPhysical) {
        waMessage = `Halo kak ${userName}! 👋\nSaya Admin dari ${template.title}.\n\nTerima kasih atas pembayaran kakak.\n\nPembayaran kakak telah kami terima senilai ${formattedAmount}.\n\n*DATA PENGIRIMAN:*\nNama: ${userName}\nTotal: ${formattedAmount}\nRef: ${reference}\nAlamat: ${address}\nProduk: ${template.title}\n\nKami akan segera memproses pesanan Anda. Salam hangat,\nAdmin eL Vision Group`;
    } else {
        waMessage = `Halo kak ${userName}! 👋\nSaya ${adminName}.\n\nTerima kasih atas pembayaran kakak untuk paket *${template.title}*.\n\nPembayaran kakak telah kami terima senilai ${formattedAmount}.\n\nBerikut adalah link akses eksklusif untuk mendownload materi kakak:\n👉 ${template.downloadLink}\n\nSilakan di-download dan disimpan ya kak. Jika ada pertanyaan, kakak bisa langsung balas pesan ini.\n\nKakak juga mendapat Kupon diskon 70% Dari 1.800.000 menjadi 540.000 (hemat 1,3juta!)\nUntuk produk https://drelf.id\nCheckout disini https://export.elvisiongroup.com/id_drelf\nSUDAH Bpom yah\n\nSalam hangat,\nAdmin - eL Vision Group`;
    }

    // --- EMAIL CONTENT ---
    const htmlContent = `<!DOCTYPE html><html><body style="font-family: Arial; padding: 20px; line-height: 1.6;">
      <h2>Halo ${userName},</h2>
      <p>Terima kasih. Pembayaran untuk <strong>${template.title}</strong> [${sku}] telah kami terima.</p>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Total:</strong> ${formattedAmount}</p>
        <p><strong>Ref:</strong> ${reference}</p>
        <p><strong>SKU:</strong> ${sku}</p>
      </div>
      ${template.downloadLink ? `<p style="text-align: center;"><a href="${template.downloadLink}" style="background: #1a73e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">DOWNLOAD SEKARANG</a></p>` : ''}
      <p>Salam hangat,<br>eL Vision Group</p></body></html>`;

    // Trigger Notifications
    const promises = [sendMailketingEmail(recipientEmail, template.subject, htmlContent)];
    
    if (userPhone && waMessage) {
      let cleanPhone = userPhone.replace(/\D/g, '');
      if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
      else if (cleanPhone.startsWith('8')) cleanPhone = '62' + cleanPhone;
      promises.push(fetch(WAPI_URL, { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session: WAPI_SESSION, token: WAPI_TOKEN, to: cleanPhone, message: waMessage }) }));
    }

    // Admin alerts
    const adminMsg = `💰 *PAID: ${sku}*\n\nProduk: ${template.title}\nNama: ${userName}\nTotal: ${formattedAmount}\nRef: ${reference}`;
    for (const ph of ADMIN_PHONES) { promises.push(fetch(WAPI_URL, { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session: WAPI_SESSION, token: WAPI_TOKEN, to: ph, message: adminMsg }) })); }

    await Promise.allSettled(promises);
    return new Response(JSON.stringify({ success: true, sku }), { headers: { "Content-Type": "application/json", ...corsHeaders } });

  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
};

serve(handler);
