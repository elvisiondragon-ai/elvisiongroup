import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nlrgdhpmsittuwiiindq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQwOTQ1NCwiZXhwIjoyMDY5OTg1NDU0fQ.zA37zRBUtN4Wx64QuE1CTlWiHzphbe6BCRRz-EtWHsE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function sendTestNotification() {
  try {
    // Get a user ID from profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
      
    if (profilesError || !profiles?.length) {
      console.error('❌ Error getting user:', profilesError);
      return;
    }
    
    const userId = profiles[0].id;
    console.log('👤 Sending notification to user:', userId);
    
    // Insert notification - this should trigger real-time
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: '🔥 LIVE TEST',
        message: 'Ini notifikasi real-time! Harusnya muncul toast di browser.',
        type: 'success'
      })
      .select();
      
    if (error) {
      console.error('❌ Error:', error);
      return;
    }
    
    console.log('✅ Notification sent:', data[0]);
    console.log('🔔 Check your browser at http://localhost:8081 - should see toast notification!');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

// Send notification every 5 seconds for testing
console.log('🚀 Starting real-time notification test...');
console.log('🔔 Make sure you are logged in at http://localhost:8081');
console.log('⏱️  Will send test notification in 5 seconds...');

setTimeout(async () => {
  await sendTestNotification();
  process.exit(0);
}, 5000);