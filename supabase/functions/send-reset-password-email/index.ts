import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Mailketing API configuration
const MAILKETING_API_URL = Deno.env.get('MAILKETING_API_URL') || 'https://api.mailketing.co.id/api/v1';
const MAILKETING_API_KEY = Deno.env.get('MAILKETING_API_KEY');
const MAILKETING_EMAIL = Deno.env.get('MAILKETING_EMAIL') || 'support@elvisiongroup.com';

interface ResetPasswordEmailRequest {
  email: string;
  redirectTo: string;
  userName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('🚀 Reset password email function started (Mailketing)');

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, redirectTo, userName }: ResetPasswordEmailRequest = await req.json();
    console.log('📧 Processing reset request for:', email);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // 1. Generate the reset link
    console.log('🔑 Generating recovery link...');
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: { redirectTo }
    });

    if (linkError) {
      console.error('❌ Failed to generate reset link:', linkError);
      throw linkError;
    }

    const resetUrl = linkData.properties.action_link;
    console.log('✅ Link generated successfully');

    // 2. Prepare Email Content
    const subject = "Reset Password - ElVision Group";
    const rawHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; color: #333; border: 1px solid #e2e8f0; border-radius: 12px;">
        <div style="padding: 20px; text-align: center; border-bottom: 1px solid #f1f5f9;">
          <h1 style="margin: 0; font-size: 24px; color: #1e293b;">🔐 Reset Password</h1>
          <p style="margin: 10px 0 0 0; color: #64748b;">Gunakan tombol di bawah untuk memperbarui password Anda</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #1e293b; margin-bottom: 20px; font-size: 18px;">Halo ${userName || email.split('@')[0]},</h2>
          
          <p style="color: #475569; line-height: 1.6; margin-bottom: 24px;">
            Kami menerima permintaan untuk mereset password akun ElVision Group Anda. 
            Silakan klik tombol di bawah untuk melanjutkan:
          </p>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="background-color: #3b82f6; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);">
              Update Password Sekarang
            </a>
          </div>

          <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #f1f5f9; text-align: center;">
            <p style="color: #64748b; font-size: 14px; margin-bottom: 16px;">
              Mengalami kendala? Hubungi kami via WhatsApp:
            </p>
            <a href="https://wa.me/62895325633487?text=Kak%20saya%20resetr%20password%20gagal" style="background-color: #22c55e; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500; font-size: 14px;">
              💬 Bantuan WhatsApp
            </a>
          </div>
          
          <p style="color: #94a3b8; margin-top: 40px; font-size: 12px; text-align: center;">
            Salam,<br>
            <strong style="color: #475569;">Tim ElVision Group</strong>
          </p>
        </div>
      </div>
    `.trim();

    // 3. Send via Mailketing
    console.log('📨 Sending email via Mailketing...');
    const senderEmail = Deno.env.get('MAILKETING_EMAIL') || 'support@elvisiongroup.com';

    const params = new URLSearchParams();
    params.append('api_token', MAILKETING_API_KEY || '');
    params.append('email', senderEmail);
    params.append('from_name', 'Support El Vision Group');
    params.append('from_email', 'support@elvisiongroup.com');
    params.append('recipient', email);
    params.append('subject', subject);
    params.append('content', rawHtml);

    console.log('📊 Stats:', {
      sender: senderEmail,
      recipient: email,
      htmlSize: rawHtml.length,
      hasToken: !!MAILKETING_API_KEY
    });

    const emailResponse = await fetch(`${MAILKETING_API_URL}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    const resultText = await emailResponse.text();
    console.log('📧 Mailketing Response:', resultText);

    return new Response(JSON.stringify({
      success: true,
      mailketing: resultText,
      debug: {
        sent_to: email,
        html_len: rawHtml.length
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("❌ Error in reset password function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);