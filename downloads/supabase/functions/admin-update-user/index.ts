// supabase/functions/admin-update-user/index.ts

// Uses built-in env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Route: POST /functions/v1/admin-update-user
// Body:
//   - Identify user by user_id (preferred) or email
//   - Update fields: email?, password?
//
// Example:
//   curl -L -X POST 'https://<PROJECT>.supabase.co/functions/v1/admin-update-user' \
//     -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
//     -H "Content-Type: application/json" \
//     --data '{"user_id":"<uuid>","email":"new@example.com","password":"newpass"}'

interface UpdatePayload {
  user_id?: string;
  email?: string;
  password?: string;
  // If identifying by email (for lookup), use lookup_email
  lookup_email?: string;
}

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const PROJECT_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

function isServiceRoleAuth(header: string | null): boolean {
  if (!header) return false;
  // Allow either raw SR key or "Bearer <SR>"
  const token = header.startsWith("Bearer ") ? header.slice(7) : header;
  return token && token === SERVICE_ROLE;
}

async function findUserIdByEmail(email: string): Promise<string | null> {
  const resp = await fetch(`${PROJECT_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${SERVICE_ROLE}`,
      "apikey": SERVICE_ROLE,
    },
  });
  if (!resp.ok) {
    return null;
  }
  // List endpoint returns array of users; take first match
  const data = await resp.json();
  if (Array.isArray(data) && data.length > 0 && (data[0] as any)?.id) {
    return (data[0] as any).id as string;
  }
  return null;
}

async function updateUserAdmin(userId: string, updates: { email?: string; password?: string }) {
  const resp = await fetch(`${PROJECT_URL}/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${SERVICE_ROLE}`,
      "apikey": SERVICE_ROLE,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
  const body = await resp.text();
  let json: unknown;
  try {
    json = body ? JSON.parse(body) : null;
  } catch {
    json = body;
  }
  return { ok: resp.ok, status: resp.status, data: json };
}

console.info("admin-update-user function started");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    // Auth guard: service role only
    const authHeader = req.headers.get("authorization");
    if (!isServiceRoleAuth(authHeader)) {
      return new Response(JSON.stringify({ error: "Forbidden: service role required" }), {
        status: 403,
        headers: corsHeaders,
      });
    }

    const payload = (await req.json()) as UpdatePayload;

    // Identify the user to update:
    // Priority:
    // 1) user_id
    // 2) lookup_email (explicit lookup)
    // 3) email (if used as identifier and also being updated, use lookup_email to disambiguate)
    let targetUserId = payload.user_id ?? null;

    if (!targetUserId) {
      const lookup = payload.lookup_email ?? payload.email;
      if (!lookup) {
        return new Response(JSON.stringify({
          error: "Provide user_id or lookup_email (or email to lookup).",
        }), { status: 400, headers: corsHeaders });
      }
      const found = await findUserIdByEmail(lookup);
      if (!found) {
        return new Response(JSON.stringify({
          error: "User not found for provided email.",
        }), { status: 404, headers: corsHeaders });
      }
      targetUserId = found;
    }

    // Build updates
    const updates: { email?: string; password?: string } = {};
    if (payload.email) updates.email = payload.email;
    if (payload.password) updates.password = payload.password;

    if (!updates.email && !updates.password) {
      return new Response(JSON.stringify({
        error: "Nothing to update. Provide email and/or password.",
      }), { status: 400, headers: corsHeaders });
    }

    const result = await updateUserAdmin(targetUserId, updates);
    if (!result.ok) {
      return new Response(JSON.stringify({
        error: "Update failed",
        status: result.status,
        details: result.data,
      }), { status: result.status || 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({
      ok: true,
      user_id: targetUserId,
      updated: Object.keys(updates),
      result: result.data,
    }), { status: 200, headers: corsHeaders });
  } catch (e) {
    console.error("Unhandled error:", e);
    return new Response(JSON.stringify({ error: "Internal error", details: String(e) }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});