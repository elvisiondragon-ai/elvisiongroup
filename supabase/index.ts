// save-avatar Edge Function with compression to <= 100 KB when possible
// - Stores to: profile-pictures/pro/{email}.jpeg
// - Content-Type: image/jpeg
// - Upserts existing file
// - Uses Storage Image Transformations for compression (quality steps)
// - Updates public.profiles.avatar_url
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const MAX_BYTES = 100 * 1024; // 100 KB
const BUCKET = "profile-pictures";
const FINAL_FOLDER = "pro";
console.info("save-avatar function started");
Deno.serve(async (req)=>{
  try {
    if (req.method !== "POST") {
      return json({
        error: "Method not allowed"
      }, 405);
    }
    const authHeader = req.headers.get("Authorization") || "";
    const jwt = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!jwt) return json({
      error: "Missing Bearer token"
    }, 401);
    const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_ANON_KEY"), {
      global: {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    });
    const serviceClient = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return json({
        error: "Content-Type must be multipart/form-data"
      }, 400);
    }
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return json({
        error: "Missing file field 'file'"
      }, 400);
    }
    // Authenticated user
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) return json({
      error: "Unauthorized"
    }, 401);
    const user = userData.user;
    const emailRaw = (user.email || "").trim();
    if (!emailRaw) return json({
      error: "User email not found on account"
    }, 400);
    const email = emailRaw.toLowerCase();
    // Read incoming bytes
    const originalBuf = new Uint8Array(await file.arrayBuffer());
    const originalSize = originalBuf.byteLength;
    // If already ≤ 100 KB, we keep as-is and just convert/force to jpeg content-type if needed.
    let finalBytes = originalBuf;
    if (originalSize > MAX_BYTES) {
      // We need to compress. Since we can't rely on native encoders in Edge,
      // use Storage Image Transformations:
      // 1) Upload the original to a temporary path.
      // 2) Fetch transformed JPEG at decreasing quality until ≤ 100 KB or last attempt.
      const tempPath = makeTempPath(user.id);
      const tempUpload = await supabase.storage.from(BUCKET).upload(tempPath, originalBuf, {
        contentType: file.type || "application/octet-stream",
        upsert: true,
        cacheControl: "60"
      });
      if (tempUpload.error) {
        return json({
          error: `Temporary upload failed: ${tempUpload.error.message}`
        }, 400);
      }
      // Build a public-or-signed URL for the temp object
      let tempPublicUrl = supabase.storage.from(BUCKET).getPublicUrl(tempPath).data.publicUrl;
      if (!tempPublicUrl) {
        const signed = await supabase.storage.from(BUCKET).createSignedUrl(tempPath, 60);
        if (signed.error) {
          return json({
            error: `Temp signed URL failed: ${signed.error.message}`
          }, 500);
        }
        tempPublicUrl = signed.data.signedUrl;
      }
      // Try multiple qualities
      const qualities = [
        75,
        65,
        55,
        45,
        35
      ];
      let compressed = null;
      for (const q of qualities){
        const compressedBytes = await fetchTransformed(tempPublicUrl, {
          quality: q,
          format: "jpeg"
        });
        if (!compressedBytes) continue;
        if (compressedBytes.byteLength <= MAX_BYTES) {
          compressed = compressedBytes;
          break;
        }
        // keep last attempt even if > 100 KB to avoid failure
        compressed = compressedBytes;
      }
      // Clean up temp file in background
      EdgeRuntime.waitUntil(supabase.storage.from(BUCKET).remove([
        tempPath
      ]));
      if (!compressed) {
        return json({
          error: "Compression failed: transformation not available or fetch failed"
        }, 500);
      }
      finalBytes = compressed;
    }
    const finalPath = `${FINAL_FOLDER}/${email}.jpeg`;
    const upload = await supabase.storage.from(BUCKET).upload(finalPath, finalBytes, {
      contentType: "image/jpeg",
      upsert: true,
      cacheControl: "3600"
    });
    if (upload.error) {
      return json({
        error: `Upload failed: ${upload.error.message}`
      }, 400);
    }
    // Public URL or signed URL
    let finalUrl = supabase.storage.from(BUCKET).getPublicUrl(finalPath).data.publicUrl;
    if (!finalUrl) {
      const signed = await supabase.storage.from(BUCKET).createSignedUrl(finalPath, 60 * 60 * 24 * 7);
      if (signed.error) {
        return json({
          error: `URL generation failed: ${signed.error.message}`
        }, 500);
      }
      finalUrl = signed.data.signedUrl;
    }
    // Update profiles.avatar_url
    const { error: updateErr } = await serviceClient.from("profiles").update({
      avatar_url: finalUrl
    }).eq("user_id", user.id);
    if (updateErr) {
      return json({
        error: `Profile update failed: ${updateErr.message}`
      }, 400);
    }
    return json({
      path: finalPath,
      url: finalUrl,
      bucket: BUCKET,
      contentType: "image/jpeg",
      size_bytes: finalBytes.byteLength,
      message: "Avatar saved successfully",
      compressed: originalSize > MAX_BYTES
    });
  } catch (e) {
    return json({
      error: String(e)
    }, 500);
  }
});
// Helpers
function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json"
    }
  });
}
function makeTempPath(userId) {
  // Simple temp location inside same bucket, per-user with time for uniqueness
  const stamp = Date.now();
  return `_tmp/${userId}/${stamp}.bin`;
}
async function fetchTransformed(publicOrSignedUrl, opts) {
  try {
    // Supabase Storage Transformations: append query params to render variant
    // Example: ?render=1&quality=75&format=jpeg
    const url = new URL(publicOrSignedUrl);
    url.searchParams.set("render", "1");
    url.searchParams.set("quality", String(opts.quality));
    url.searchParams.set("format", opts.format);
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const arr = new Uint8Array(await res.arrayBuffer());
    return arr;
  } catch  {
    return null;
  }
}
