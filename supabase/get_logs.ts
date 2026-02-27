import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getLogs() {
    const { data: logs, error } = await supabase
        .from('ig_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error("Error fetching ig_logs:", error);
    } else {
        console.log("Recent DB Logs (ig_logs):");
        console.log(JSON.stringify(logs, null, 2));
    }
}

getLogs();
