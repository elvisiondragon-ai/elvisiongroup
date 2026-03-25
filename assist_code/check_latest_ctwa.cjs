const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nlrgdhpmsittuwiiindq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQwOTQ1NCwiZXhwIjoyMDY5OTg1NDU0fQ.zA37zRBUtN4Wx64QuE1CTlWiHzphbe6BCRRz-EtWHsE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLatestRecords() {
  const { data, error } = await supabase
    .from('global_ctwa')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('❌ Error fetching records:', error.message);
  } else {
    console.log('✅ Latest 5 records in global_ctwa:');
    console.log(JSON.stringify(data, null, 2));
  }
}

checkLatestRecords();
