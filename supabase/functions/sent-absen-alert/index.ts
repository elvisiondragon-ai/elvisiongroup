// Supabase Edge Function: supabase/functions/sent-absen-alert/index.ts
// This function is designed to be triggered by a cron job (e.g., using pg_cron).

import { createClient } from 'npm:@supabase/supabase-js@2'

// The 'cors' helper is used to handle Cross-Origin Resource Sharing (CORS).
import { corsHeaders } from '../_shared/cors.ts'

console.log("Edge function 'sent-absen-alert' is initializing.");

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // For cron runs, use the service role key to bypass RLS.
    // For client-side calls, use the anon key and the user's auth header.
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    
    // Safely get the Authorization header.
    const authorization = req.headers.get('Authorization');

    const supabaseClient = createClient(
      supabaseUrl,
      supabaseKey,
      // Pass the Authorization header if it exists, otherwise the service role key will be used.
      authorization ? { global: { headers: { Authorization: authorization } } } : {}
    );

    // 1. Find users who haven't checked in for the last 48 hours.
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    console.log(`Checking for users who haven't checked in since: ${fortyEightHoursAgo}`);

    const { data: overdueUsers, error: fetchError } = await supabaseClient
      .from('absen_hidup')
      .select('user_id, contacts')
      .lt('last_checked_in', fortyEightHoursAgo);

    if (fetchError) {
      console.error('Error fetching overdue users:', JSON.stringify(fetchError, null, 2));
      throw new Error('Failed to fetch overdue users from database.');
    }

    if (!overdueUsers || overdueUsers.length === 0) {
      console.log('No overdue users found. Exiting.');
      return new Response(JSON.stringify({ message: "No overdue users found." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    console.log(`Found ${overdueUsers.length} overdue users. Processing alerts.`);

    // 2. For each overdue user, trigger alerts to their contacts.
    for (const user of overdueUsers) {
      let contacts = [];
      try {
        // Defensive parsing of the contacts JSONB field.
        if (typeof user.contacts === 'string') {
          contacts = JSON.parse(user.contacts);
        } else if (Array.isArray(user.contacts)) {
          contacts = user.contacts;
        }
      } catch (parseError) {
        console.error(`Failed to parse contacts for user ${user.user_id}:`, parseError);
        continue; // Skip to the next user
      }

      if (contacts && contacts.length > 0) {
        console.log(`Processing ${contacts.length} contacts for user ${user.user_id}.`);
        for (const contact of contacts) {
          if (contact.email) {
            console.log(`ACTION: Send email alert for user ${user.user_id} to ${contact.name} at ${contact.email}`);
            // TODO: Implement your email sending logic here.
          }
          if (contact.phone) {
            console.log(`ACTION: Send SMS alert for user ${user.user_id} to ${contact.name} at ${contact.phone}`);
            // TODO: Implement your SMS sending logic here.
          }
        }
      } else {
        console.log(`No valid contacts found for user ${user.user_id}.`);
      }
    }

    return new Response(JSON.stringify({ message: `Successfully processed ${overdueUsers.length} users.` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (err) {
    console.error('An unexpected error occurred:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
})
