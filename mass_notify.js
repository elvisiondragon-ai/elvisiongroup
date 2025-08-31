import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nlrgdhpmsittuwiiindq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQwOTQ1NCwiZXhwIjoyMDY5OTg1NDU0fQ.zA37zRBUtN4Wx64QuE1CTlWiHzphbe6BCRRz-EtWHsE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function sendToAllUsers() {
  console.log('🚀 SENDING TO ALL USERS...');
  
  // Get all profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id');
    
  if (error || !profiles) {
    console.error('❌ Error getting profiles:', error);
    return;
  }
  
  console.log(`📧 Found ${profiles.length} users`);
  
  // Send to all users
  const notifications = profiles.map(profile => ({
    user_id: profile.id,
    title: '🚨 MASS BROADCAST!',
    message: 'Ini broadcast ke SEMUA USER! Toast harusnya muncul sekarang!',
    type: 'success'
  }));
  
  const { data, error: insertError } = await supabase
    .from('notifications')
    .insert(notifications);
    
  if (insertError) {
    console.error('❌ Error inserting notifications:', insertError);
    return;
  }
  
  console.log(`✅ Sent notifications to ${profiles.length} users!`);
  console.log('🔔 CHECK YOUR BROWSER - TOAST SHOULD APPEAR NOW!');
}

sendToAllUsers();