// deno-lint-ignore-file no-explicit-any
// downloadfolder: Zips files from the `avatar` bucket (optionally a subfolder) and stores the ZIP in the `apk` bucket.
// Returns JSON with object path and a signed URL.
//
// Query params:
// - prefix: optional subfolder within avatar (e.g., "users/123/")
// - name: optional base name for the zip file (without .zip). If omitted, a timestamped name is used.
// - overwrite: optional boolean ("true"/"false"). If false and object exists, a unique suffix is added.
//
// Example:
//   curl -L -X POST "https://<project>.supabase.co/functions/v1/downloadfolder?prefix=users/123/&name=user-123&overwrite=false"
//
// Notes:
// - Uses SUPABASE_SERVICE_ROLE_KEY to access private storage and generate signed URLs.
// - For large folders, this buffers the ZIP in memory. If you need streaming, ask to switch to a streaming ZIP writer.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import JSZip from "npm:jszip@3.10.1";
const SOURCE_BUCKET = "profile-pictures";
const TARGET_BUCKET = "apk";
async function* listAllObjects(supabase, bucket, prefix) {
  const pageSize = 1000;
  let offset = 0;
  while(true){
    const { data, error } = await supabase.storage.from(bucket).list(prefix, {
      limit: pageSize,
      offset,
      sortBy: {
        column: "name",
        order: "asc"
      }
    });
    if (error) throw error;
    if (!data || data.length === 0) break;
    for (const entry of data){
      if (!entry.id) continue; // skip pseudo-folders
      const name = prefix ? `${prefix.replace(/\/$/, "")}/${entry.name}` : entry.name;
      yield name;
    }
    offset += pageSize;
  }
}
async function objectExists(supabase, bucket, path) {
  const { data, error } = await supabase.storage.from(bucket).list(path.replace(/[^/]+$/, ''), {
    limit: 1000
  });
  if (error) return false;
  return (data ?? []).some((e)=>e.name === path.split('/').pop());
}
Deno.serve(async (req)=>{
  try {
    const url = new URL(req.url);
    let prefix = url.searchParams.get("prefix") ?? "";
    if (prefix === "/" || prefix === ".") prefix = "";
    if (prefix.startsWith("/")) prefix = prefix.slice(1);
    if (prefix !== "" && !prefix.endsWith("/")) prefix = `${prefix}/`;
    const baseName = (url.searchParams.get("name") || (prefix ? prefix.replace(/\/$/, '').replace(/\//g, '-') : 'avatar-all')).trim() || 'avatar-all';
    const overwrite = (url.searchParams.get("overwrite") || "false").toLowerCase() === "true";
    const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
    // Build ZIP in memory
    const zip = new JSZip();
    let fileCount = 0;
    for await (const objectPath of listAllObjects(supabase, SOURCE_BUCKET, prefix)){
      const { data: file, error: dlErr } = await supabase.storage.from(SOURCE_BUCKET).download(objectPath);
      if (dlErr) continue;
      const ab = await file.arrayBuffer();
      zip.file(objectPath.replace(prefix, ''), ab); // store relative path inside zip
      fileCount++;
    }
    if (fileCount === 0) {
      return new Response(JSON.stringify({
        error: "No files found for given prefix",
        prefix
      }), {
        status: 404,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const zipBytes = await zip.generateAsync({
      type: "uint8array",
      compression: "DEFLATE",
      compressionOptions: {
        level: 6
      }
    });
    // Determine destination path
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    let objectPath = `${baseName}${overwrite ? '' : '-' + timestamp}.zip`;
    if (overwrite) {
      // Upload, possibly overwriting existing
      const { error: upErr } = await supabase.storage.from(TARGET_BUCKET).upload(objectPath, zipBytes, {
        contentType: "application/zip",
        upsert: true
      });
      if (upErr) throw upErr;
    } else {
      // Ensure unique name; if already exists, append a short random suffix
      let finalPath = objectPath;
      if (await objectExists(supabase, TARGET_BUCKET, finalPath)) {
        const rand = Math.random().toString(36).slice(2, 8);
        finalPath = `${baseName}-${timestamp}-${rand}.zip`;
      }
      const { error: upErr } = await supabase.storage.from(TARGET_BUCKET).upload(finalPath, zipBytes, {
        contentType: "application/zip",
        upsert: false
      });
      if (upErr) throw upErr;
      objectPath = finalPath;
    }
    // Create a signed URL (default 1 hour)
    const { data: signed, error: signErr } = await supabase.storage.from(TARGET_BUCKET).createSignedUrl(objectPath, 60 * 60);
    if (signErr) throw signErr;
    return new Response(JSON.stringify({
      message: "ZIP created and stored",
      source_bucket: SOURCE_BUCKET,
      source_prefix: prefix,
      target_bucket: TARGET_BUCKET,
      object_path: objectPath,
      file_count: fileCount,
      signed_url: signed.signedUrl
    }), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({
      error: e?.message ?? "Internal error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
});
