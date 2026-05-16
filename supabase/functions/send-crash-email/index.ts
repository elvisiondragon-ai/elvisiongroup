import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
};

async function sendMailketingEmail(to: string, subject: string, content: string) {
  const apiKey = Deno.env.get('MAILKETING_API_KEY');
  const fromName = "VPS Crash Monitor";
  const fromEmail = "system@elvisiongroup.com";

  const response = await fetch("https://api.mailketing.co.id/api/v1/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "API-Key": apiKey || '',
    },
    body: new URLSearchParams({
      from_name: fromName,
      from_email: fromEmail,
      recipient: to,
      subject: subject,
      content: content,
    }),
  });

  return await response.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { error_message, stack_trace, context } = await req.json();

    console.log(`⚠️ Received Crash Report: ${error_message}`);

    const emailContent = `
      <h2>🚨 VPS CRASH ALERT</h2>
      <p><strong>Error Message:</strong> ${error_message}</p>
      <p><strong>Context:</strong> ${context || 'N/A'}</p>
      <hr/>
      <p><strong>Stack Trace:</strong></p>
      <pre style="background: #f4f4f4; padding: 10px; border: 1px solid #ddd;">${stack_trace || 'No stack trace available'}</pre>
      <hr/>
      <p>Sent by Supabase Edge Function</p>
    `;

    await sendMailketingEmail(
      'elvisiondragon@gmail.com',
      `[CRASH ALERT] VPS Error: ${error_message.substring(0, 50)}`,
      emailContent
    );

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
