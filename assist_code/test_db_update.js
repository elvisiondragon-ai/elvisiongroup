// Test database update directly
// Run this in browser console while logged in

const testDatabaseUpdate = async () => {
  console.log('🧪 Testing database update...');

  // Get current user
  const { data: { user }, error: authError } = await window.supabase.auth.getUser();
  if (authError || !user) {
    console.error('❌ Auth error:', authError);
    return;
  }

  console.log('👤 User ID:', user.id);

  // Check current profile
  const { data: currentProfile, error: fetchError } = await window.supabase
    .from('profiles')
    .select('analytics_used, last_analytics_date')
    .eq('user_id', user.id)
    .single();

  console.log('📊 Current profile:', currentProfile);
  console.log('❌ Fetch error:', fetchError);

  if (fetchError) {
    console.error('Cannot fetch profile - stopping test');
    return;
  }

  // Test simple update
  const today = new Date().toISOString().split('T')[0];
  const newUsage = (currentProfile?.analytics_used || 0) + 1;

  console.log('💾 Attempting update:', { newUsage, today });

  const { data: updateData, error: updateError } = await window.supabase
    .from('profiles')
    .update({
      analytics_used: newUsage,
      last_analytics_date: today
    })
    .eq('user_id', user.id)
    .select(); // Add select to see what was updated

  console.log('✅ Update result:', updateData);
  console.log('❌ Update error:', updateError);

  // Verify the update
  const { data: verifyProfile, error: verifyError } = await window.supabase
    .from('profiles')
    .select('analytics_used, last_analytics_date')
    .eq('user_id', user.id)
    .single();

  console.log('🔍 After update:', verifyProfile);
  console.log('❌ Verify error:', verifyError);
};

// Auto-run
testDatabaseUpdate();

// Make available globally
window.testDatabaseUpdate = testDatabaseUpdate;