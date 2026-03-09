// media-compress Edge Function (hardcoded source bucket = "testi", batch folder and whole-bucket support)
// Request shapes now:
// - Optional folder prefix: { folder?: string, recursive?: boolean, destBucket?: string }
// - Optional single file path: { path?: string, destBucket?: string }
// If neither path nor folder is provided, it will process the entire source bucket recursively.
// Supported types: mp4, mp3, jpg/jpeg.

import { createClient } from "npm:@supabase/supabase-js@2.47.10";

const SOURCE_BUCKET = "testi" as const;

function inferType(path: string): "mp4" | "mp3" | "jpg" | "other" {
  const lower = path.toLowerCase();
  if (lower.endsWith(".mp4")) return "mp4";
  if (lower.endsWith(".mp3")) return "mp3";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "jpg";
  return "other";
}

async function ffmpeg(args: string[]) {
  const candidates = ["/usr/bin/ffmpeg", "/bin/ffmpeg", "ffmpeg"];
  for (const bin of candidates) {
    try {
      const v = await new Deno.Command(bin, { args: ["-version"], stdout: "piped", stderr: "piped" }).output();
      if (v.code === 0) {
        const proc = new Deno.Command(bin, { args, stdout: "inherit", stderr: "piped" });
        const out = await proc.output();
        return { code: out.code, stderr: new TextDecoder().decode(out.stderr) };
      }
    } catch (_) { /* try next */ }
  }
  throw new Error("ffmpeg is not available in this Edge runtime");
}

async function downloadToTmp(supabase: ReturnType<typeof createClient>, bucket: string, path: string): Promise<string> {
  const { data, error } = await supabase.storage.from(bucket).download(path);
  if (error) throw error;
  const buf = await data.arrayBuffer();
  const ext = path.includes('.') ? path.slice(path.lastIndexOf('.')) : '';
  const tmpPath = `/tmp/input-${crypto.randomUUID()}${ext}`;
  await Deno.writeFile(tmpPath, new Uint8Array(buf));
  return tmpPath;
}

async function uploadFromTmp(supabase: ReturnType<typeof createClient>, bucket: string, destPath: string, filePath: string, contentType?: string) {
  const file = await Deno.readFile(filePath);
  const { error } = await supabase.storage.from(bucket).upload(destPath, file, { upsert: true, contentType });
  if (error) throw error;
}

function deriveDestPath(srcPath: string): string {
  const i = srcPath.lastIndexOf(".");
  if (i === -1) return `${srcPath}-compressed`;
  return `${srcPath.slice(0, i)}-compressed${srcPath.slice(i)}`;
}

function jpgQualityForHalf(): number { return 60; }
function videoAudioBitrateForHalf(): { v: string; a: string } { return { v: "1500k", a: "128k" }; }

async function compressOne(supabase: ReturnType<typeof createClient>, destinationBucket: string, path: string) {
  const extType = inferType(path);
  if (extType === "other") {
    return { path, skipped: true, reason: "unsupported" };
  }
  const inputPath = await downloadToTmp(supabase, SOURCE_BUCKET, path);
  const destPathRelative = deriveDestPath(path);
  const ext = path.includes('.') ? path.slice(path.lastIndexOf('.')) : '';
  const outputPath = `/tmp/output-${crypto.randomUUID()}${ext}`;

  try {
    if (extType === "mp4") {
      const { v, a } = videoAudioBitrateForHalf();
      const args = ["-y", "-i", inputPath, "-c:v", "libx264", "-b:v", v, "-preset", "veryfast", "-movflags", "+faststart", "-c:a", "aac", "-b:a", a, outputPath];
      const res = await ffmpeg(args);
      if (res.code !== 0) throw new Error(`ffmpeg mp4 failed: ${res.stderr}`);
      await uploadFromTmp(supabase, destinationBucket, destPathRelative, outputPath, "video/mp4");
    } else if (extType === "mp3") {
      const args = ["-y", "-i", inputPath, "-c:a", "libmp3lame", "-b:a", "96k", outputPath];
      const res = await ffmpeg(args);
      if (res.code !== 0) throw new Error(`ffmpeg mp3 failed: ${res.stderr}`);
      await uploadFromTmp(supabase, destinationBucket, destPathRelative, outputPath, "audio/mpeg");
    } else if (extType === "jpg") {
      const q = String(jpgQualityForHalf());
      const args = ["-y", "-i", inputPath, "-q:v", q, "-frames:v", "1", outputPath];
      const res = await ffmpeg(args);
      if (res.code !== 0) throw new Error(`ffmpeg jpg failed: ${res.stderr}`);
      await uploadFromTmp(supabase, destinationBucket, destPathRelative, outputPath, "image/jpeg");
    }
  } finally {
    try { await Deno.remove(inputPath); } catch (_) {}
    try { await Deno.remove(outputPath); } catch (_) {}
  }

  return { path, output: destPathRelative };
}

async function listPrefixOnce(supabase: ReturnType<typeof createClient>, prefix: string): Promise<{ files: string[]; folders: string[] }> {
  const files: string[] = [];
  const folders: string[] = [];
  const { data, error } = await supabase.storage.from(SOURCE_BUCKET).list(prefix, { limit: 1000, sortBy: { column: 'name', order: 'asc' } });
  if (error) throw error;
  for (const item of data ?? []) {
    const fullPath = prefix ? `${prefix.replace(/\/$/, '')}/${item.name}` : item.name;
    // Supabase returns objects for files; folders are entries with no "id" and a sublisting
    if ((item as any).id) {
      files.push(fullPath);
    } else {
      folders.push(fullPath);
    }
  }
  return { files, folders };
}

async function listAllFilesRecursive(supabase: ReturnType<typeof createClient>, startPrefix = ""): Promise<string[]> {
  const filesCollected: string[] = [];
  const queue: string[] = [startPrefix];
  const seen = new Set<string>();
  while (queue.length) {
    const current = queue.shift()!;
    if (seen.has(current)) continue;
    seen.add(current);
    const { files, folders } = await listPrefixOnce(supabase, current);
    filesCollected.push(...files);
    for (const f of folders) queue.push(f);
  }
  return filesCollected;
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "GET") {
      return new Response(JSON.stringify({ status: "ok", message: `media-compress ready; source bucket: ${SOURCE_BUCKET}` }), { headers: { "Content-Type": "application/json" } });
    }
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
    }

    const body = await req.json().catch(() => ({} as any));
    const { path, folder, recursive = true, destBucket } = body as { path?: string; folder?: string; recursive?: boolean; destBucket?: string };

    const destinationBucket = destBucket || "apk";
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // If a single file path is provided, compress just that file
    if (path) {
      const result = await compressOne(supabase, destinationBucket, path);
      return new Response(JSON.stringify({ ok: true, processed: [result] }), { headers: { "Content-Type": "application/json" } });
    }

    // Determine scope: provided folder prefix or whole bucket
    const prefix = (folder ?? "").replace(/^\/+/, '').replace(/\/+/g, '/');

    let files: string[] = [];
    if (recursive) {
      files = await listAllFilesRecursive(supabase, prefix);
    } else {
      const { files: firstLevel } = await listPrefixOnce(supabase, prefix);
      files = firstLevel;
    }

    const supported = files.filter((p) => inferType(p) !== 'other');

    const results = [] as any[];
    for (const p of supported) {
      try {
        const r = await compressOne(supabase, destinationBucket, p);
        results.push({ ok: true, ...r });
      } catch (err) {
        results.push({ ok: false, path: p, error: String((err as Error)?.message || err) });
      }
    }

    return new Response(JSON.stringify({ ok: true, count: results.length, results }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String((e as Error)?.message || e) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});