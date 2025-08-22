import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResetPasswordEmailRequest {
  email: string;
  resetUrl: string;
  userName?: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const handler = async (req: Request): Promise<Response> => {
  console.log('🚀 Reset password email function started');
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, resetUrl, userName }: ResetPasswordEmailRequest = await req.json();
    console.log('📧 Sending reset password email to:', email);

    const subject = "Reset Password - ElVision Group";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🔐 Reset Password</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Permintaan reset password untuk akun Anda</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Halo ${userName || 'Member'},</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Kami menerima permintaan untuk reset password akun ElVision Group Anda. 
            Jika Anda tidak melakukan permintaan ini, Anda dapat mengabaikan email ini.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #e74c3c; margin: 20px 0; text-align: center;">
            <p style="color: #333; margin-bottom: 20px; font-weight: bold;">
              Klik tombol di bawah untuk reset password Anda:
            </p>
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 10px 0;">
              🔑 Reset Password Sekarang
            </a>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;">
              <strong>⏰ Penting:</strong> Link reset password ini akan kadaluarsa dalam 24 jam. 
              Jika link sudah tidak berlaku, silakan lakukan permintaan reset password baru.
            </p>
          </div>
          
          <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #721c24;">
              <strong>🔒 Keamanan:</strong> Jika Anda tidak melakukan permintaan reset password, 
              mohon segera hubungi tim support kami dan pastikan akun Anda aman.
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6; font-size: 14px; margin-top: 30px;">
            Jika tombol di atas tidak berfungsi, Anda dapat menyalin dan menempel link berikut ke browser Anda:<br>
            <span style="font-family: monospace; background: #e9ecef; padding: 5px; border-radius: 4px; word-break: break-all;">${resetUrl}</span>
          </p>
          
          <p style="color: #666; margin-top: 30px;">
            Salam,<br>
            <strong style="color: #333;">Tim ElVision Group</strong>
          </p>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "ElVision Group <support@elvisiongroup.com>",
      to: [email],
      subject: subject,
      html: html,
    });

    console.log("✅ Reset password email sent successfully:", emailResponse);

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
    console.error("❌ Error sending reset password email:", error);
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