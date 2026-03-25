const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nlrgdhpmsittuwiiindq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQwOTQ1NCwiZXhwIjoyMDY5OTg1NDU0fQ.zA37zRBUtN4Wx64QuE1CTlWiHzphbe6BCRRz-EtWHsE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSQL() {
  const sql = `
    -- Enable RLS on global_ctwa
    ALTER TABLE global_ctwa ENABLE ROW LEVEL SECURITY;

    -- Create a policy to allow all access (since it's a global tracking table)
    -- This removes the "Red" RLS warning in Supabase dashboard
    DO $$ 
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'global_ctwa' AND policyname = 'Allow all access to global_ctwa'
        ) THEN
            CREATE POLICY "Allow all access to global_ctwa" ON global_ctwa FOR ALL USING (true) WITH CHECK (true);
        END IF;
    END $$;
  `;
  console.log('Executing RLS enablement and Policy creation...');
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
  
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Success: RLS enabled and policy created.');
  }
}

executeSQL();
