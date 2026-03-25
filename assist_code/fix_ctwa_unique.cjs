const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nlrgdhpmsittuwiiindq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQwOTQ1NCwiZXhwIjoyMDY5OTg1NDU0fQ.zA37zRBUtN4Wx64QuE1CTlWiHzphbe6BCRRz-EtWHsE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSQL() {
  const sql = "ALTER TABLE global_ctwa ADD CONSTRAINT global_ctwa_phone_unique UNIQUE (phone);";
  console.log('Executing:', sql);
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
  
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Success:', data);
  }
}

executeSQL();
