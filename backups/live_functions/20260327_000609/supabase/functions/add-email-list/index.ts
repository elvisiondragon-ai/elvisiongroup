
// The list ID tidak harus disini, dynamic accept anything from front end - to mailketing
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

const MAILKETING_API_URL = 'https://api.mailketing.co.id/api/v1';
const MAILKETING_API_KEY = Deno.env.get('MAILKETING_API_KEY');

async function addToMailketingList(email: string, name: string, listId: string) {
  try {
    console.log(`📋 Adding ${email} to Mailketing list ${listId}...`);
    const params = new URLSearchParams({
      api_token: MAILKETING_API_KEY || '',
      list_id: listId,
      email: email,
      first_name: name ? name.split(' ')[0] : email.split('@')[0],
      last_name: name ? name.split(' ').slice(1).join(' ') : ''
    });
    
    const response = await fetch(`${MAILKETING_API_URL}/addsubtolist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });
    
    const result = await response.json();
    console.log(`📋 Add to list ${listId} result:`, result);
    return result;
  } catch (error) {
    console.error(`❌ Failed to add to list ${listId}:`, error);
    return { success: false, error: error.message };
  }
}

const handler = async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, lists } = await req.json();
    
    if (!email) {
      throw new Error('Email is required');
    }

    const targetLists = lists || ['80713', '88212']; // Default to Core and DarkFem
    console.log(`🚀 Processing email: ${email} for lists: ${targetLists.join(', ')}`);

    const results = await Promise.all(
      targetLists.map((listId: string) => addToMailketingList(email, name, listId))
    );

    return new Response(JSON.stringify({
      success: true,
      message: 'Email added to lists successfully',
      results
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error: any) {
    console.error("❌ Error in add-email-list function:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
};

serve(handler);
