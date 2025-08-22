import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentEmailRequest {
  email: string;
  userName?: string;
  type: 'payment_created' | 'payment_completed';
  paymentData: {
    amount: number;
    currency: string;
    reference?: string;
    subscriptionType: string;
    paymentMethod?: string;
    expiresAt?: string;
    virtualAccount?: string;
    qrCode?: string;
    endDate?: string;
  };
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const handler = async (req: Request): Promise<Response> => {
  console.log('🚀 Payment email function started');
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, userName, type, paymentData }: PaymentEmailRequest = await req.json();
    console.log('📧 Sending payment email:', { email, type, reference: paymentData.reference });

    let subject: string;
    let html: string;

    if (type === 'payment_created') {
      subject = "Pembayaran Menunggu - ElVision Group";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🔔 Pembayaran Menunggu</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Terima kasih telah memilih ElVision Group Pro!</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Halo ${userName || 'Member'},</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Pembayaran Anda telah dibuat dan sedang menunggu konfirmasi. Berikut adalah detail pembayaran:
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #666;">Paket:</span>
                <span style="font-weight: bold; color: #333;">${paymentData.subscriptionType.charAt(0).toUpperCase() + paymentData.subscriptionType.slice(1)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #666;">Jumlah:</span>
                <span style="font-weight: bold; color: #333;">Rp ${paymentData.amount.toLocaleString('id-ID')}</span>
              </div>
              ${paymentData.reference ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #666;">Referensi:</span>
                <span style="font-weight: bold; color: #333; font-family: monospace;">${paymentData.reference}</span>
              </div>
              ` : ''}
              ${paymentData.paymentMethod ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #666;">Metode Pembayaran:</span>
                <span style="font-weight: bold; color: #333;">${paymentData.paymentMethod}</span>
              </div>
              ` : ''}
              ${paymentData.expiresAt ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #666;">Berlaku Hingga:</span>
                <span style="font-weight: bold; color: #e74c3c;">${new Date(paymentData.expiresAt).toLocaleDateString('id-ID', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              ` : ''}
            </div>
            
            ${paymentData.virtualAccount ? `
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #27ae60; font-weight: bold;">💳 Virtual Account:</p>
              <p style="margin: 5px 0; font-family: monospace; font-size: 18px; color: #333;">${paymentData.virtualAccount}</p>
            </div>
            ` : ''}
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #856404;">
                <strong>⏰ Penting:</strong> Pembayaran akan otomatis diproses setelah kami menerima konfirmasi dari bank. 
                Pastikan nominal transfer sesuai dengan yang tertera.
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi tim support kami.
            </p>
            
            <p style="color: #666; margin-top: 30px;">
              Salam,<br>
              <strong style="color: #333;">Tim ElVision Group</strong>
            </p>
          </div>
        </div>
      `;
    } else {
      // payment_completed
      subject = "Selamat! Pembayaran Berhasil - ElVision Group Pro";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #00c851 0%, #007e33 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🎉 Pembayaran Berhasil!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Selamat datang di ElVision Group Pro</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Halo ${userName || 'Member'},</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Terima kasih! Pembayaran Anda telah berhasil diproses dan akun Pro Anda telah diaktifkan. 
              Anda sekarang dapat menikmati semua fitur premium ElVision Group.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #00c851; margin: 20px 0;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #666;">Paket:</span>
                <span style="font-weight: bold; color: #333;">${paymentData.subscriptionType.charAt(0).toUpperCase() + paymentData.subscriptionType.slice(1)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #666;">Jumlah Dibayar:</span>
                <span style="font-weight: bold; color: #333;">Rp ${paymentData.amount.toLocaleString('id-ID')}</span>
              </div>
              ${paymentData.reference ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #666;">Referensi:</span>
                <span style="font-weight: bold; color: #333; font-family: monospace;">${paymentData.reference}</span>
              </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #666;">Status:</span>
                <span style="font-weight: bold; color: #00c851;">✅ AKTIF</span>
              </div>
              ${paymentData.endDate ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #666;">Berakhir Pada:</span>
                <span style="font-weight: bold; color: #e74c3c;">${new Date(paymentData.endDate).toLocaleDateString('id-ID', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}</span>
              </div>
              ` : ''}
            </div>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <h3 style="color: #27ae60; margin-top: 0;">🚀 Fitur Pro Yang Bisa Anda Nikmati:</h3>
              <ul style="text-align: left; color: #333; line-height: 1.8; padding-left: 20px;">
                <li>Akses ke semua konten premium</li>
                <li>Fitur chat tanpa batas</li>
                <li>Audio therapy eksklusif</li>
                <li>Spiritual journal dengan fitur lanjutan</li>
                <li>Badge Pro di profil Anda</li>
                <li>Prioritas customer support</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://app.elvisiongroup.com" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                🎯 Mulai Jelajahi Fitur Pro
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Jika Anda memiliki pertanyaan tentang fitur Pro atau membutuhkan bantuan, 
              tim support kami siap membantu Anda 24/7.
            </p>
            
            <p style="color: #666; margin-top: 30px;">
              Selamat menikmati pengalaman Pro!<br>
              <strong style="color: #333;">Tim ElVision Group</strong>
            </p>
          </div>
        </div>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "ElVision Group <support@elvisiongroup.com>",
      to: [email],
      subject: subject,
      html: html,
    });

    console.log("✅ Payment email sent successfully:", emailResponse);

    return new Response(JSON.stringify({
      success: true,
      messageId: emailResponse.data?.id
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("❌ Error sending payment email:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);