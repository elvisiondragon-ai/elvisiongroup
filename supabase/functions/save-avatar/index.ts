import { createClient } from "npm:@supabase/supabase-js@2.45.3";

// --- CONFIGURATION ---
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const BUCKET_NAME = 'profile-pictures';

// --- CORS HEADERS ---
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// --- HELPER FUNCTIONS ---

function json(status, body) {
  return new Response(JSON.stringify(body), { 
    status, 
    headers: { ...corsHeaders, "Content-Type": "application/json" } 
  });
}

async function getAuthUser(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) throw new Error("Missing Authorization header");
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error(`Unauthorized: ${error?.message || 'No user found'}`);
  if (!user.email) throw new Error("User email is missing");
  
  return user;
}

// --- MAIN LOGIC ---

console.info("save-avatar function running (v5 - simplified, no compression)");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  console.log("save-avatar function invoked.");

  try {
    // 1. Authenticate user and get file from request
    const user = await getAuthUser(req);
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) throw new Error("Missing 'file' in form data");

    const finalBytes = new Uint8Array(await file.arrayBuffer());

    // 2. Log the size of the uploaded file
    console.log(`The size of the uploaded file is = ${finalBytes.byteLength} bytes`);

    // 3. Upload final image
    const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const finalPath = `${user.email}.jpeg`;
    
    const { error: uploadError } = await serviceClient.storage
      .from(BUCKET_NAME)
      .upload(finalPath, finalBytes, { contentType: 'image/jpeg', upsert: true });

    if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);
    
    // 4. Get public URL and update profile
    const { data: urlData } = serviceClient.storage.from(BUCKET_NAME).getPublicUrl(finalPath);
    const publicUrl = urlData.publicUrl;

    const { error: profileError } = await serviceClient
      .from('profiles')
      .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);

    if (profileError) throw new Error(`Profile update failed: ${profileError.message}`);

    // 5. Return success
    return json(200, { ok: true, url: publicUrl });

  } catch (e) {
    console.error("Critical error in save-avatar function:", e.message);
    return json(400, { error: e.message });
  }
});
