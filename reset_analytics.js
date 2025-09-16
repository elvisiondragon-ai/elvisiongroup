const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function resetAnalyticsForUser(email) {
  try {
    console.log(`🔍 Looking for user: ${email}`);

    // First get the user
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) throw userError;

    const user = userData.users.find(u => u.email === email);
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return;
    }

    console.log(`✅ Found user: ${user.id}`);

    // Check current analytics usage
    const { data: currentProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('analytics_used, last_analytics_date')
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      console.log(`❌ Error fetching profile: ${fetchError.message}`);
      return;
    }

    console.log(`📊 Current state:`, {
      analytics_used: currentProfile.analytics_used,
      last_analytics_date: currentProfile.last_analytics_date
    });

    // Reset analytics usage
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        analytics_used: 0,
        last_analytics_date: null
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.log(`❌ Error resetting: ${updateError.message}`);
      return;
    }

    console.log(`✅ Successfully reset analytics usage for ${email}`);
    console.log(`🔄 New state: analytics_used = 0, last_analytics_date = null`);

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the script
resetAnalyticsForUser('elking.bali@gmail.com');