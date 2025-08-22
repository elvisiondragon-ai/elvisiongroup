import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  userName?: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const handler = async (req: Request): Promise<Response> => {
  console.log('🚀 Welcome email function started');
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, userName }: WelcomeEmailRequest = await req.json();
    console.log('📧 Sending welcome email to:', email);

    const subject = "Selamat Datang di ElVision Group!";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🎉 Selamat Datang!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Terima kasih telah bergabung dengan ElVision Group</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Halo ${userName || 'Member'},</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Selamat datang di ElVision Group! Kami sangat senang Anda telah bergabung dengan komunitas spiritual kami.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">🌟 Apa yang bisa Anda lakukan:</h3>
            <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
              <li>Bergabung dalam chat komunitas spiritual</li>
              <li>Mengakses audio therapy untuk meditasi</li>
              <li>Membuat spiritual journal pribadi</li>
              <li>Mengikuti tutorial Ignis Quest</li>
              <li>Berinteraksi dengan sesama member</li>
            </ul>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3 style="color: #27ae60; margin-top: 0;">🚀 Mulai Perjalanan Spiritual Anda</h3>
            <p style="color: #333; margin-bottom: 15px;">Dapatkan gratis trial 2 hari untuk fitur Pro!</p>
            <a href="https://app.elvisiongroup.com" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              🎯 Mulai Sekarang
            </a>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;">
              <strong>💡 Tips:</strong> Jangan lupa untuk melengkapi profil Anda dan bergabung dalam chat komunitas 
              untuk mendapatkan pengalaman terbaik di ElVision Group.
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            Jika Anda memiliki pertanyaan atau membutuhkan bantuan, jangan ragu untuk menghubungi tim support kami.
            Kami siap membantu Anda dalam perjalanan spiritual ini.
          </p>
          
          <p style="color: #666; margin-top: 30px;">
            Selamat bergabung dan semoga bermanfaat!<br>
            <strong style="color: #333;">Tim ElVision Group</strong>
          </p>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "ElVision Group <welcome@elvisiongroup.com>",
      to: [email],
      subject: subject,
      html: html,
    });

    console.log("✅ Welcome email sent successfully:", emailResponse);

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
    console.error("❌ Error sending welcome email:", error);
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