const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nlrgdhpmsittuwiiindq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQwOTQ1NCwiZXhwIjoyMDY5OTg1NDU0fQ.zA37zRBUtN4Wx64QuE1CTlWiHzphbe6BCRRz-EtWHsE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTestRecord() {
  const { data, error } = await supabase
    .from('global_ctwa')
    .select('*')
    .eq('phone', '6281234567890')
    .single();

  if (error) {
    console.error('❌ Record not found or error:', error.message);
  } else {
    console.log('✅ Record found successfully:');
    console.log(JSON.stringify(data, null, 2));
  }
}

checkTestRecord();
