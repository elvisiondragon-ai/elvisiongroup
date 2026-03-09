// Debug script to check analytics tracking in database
// Run this in browser console while logged in

console.log('🔍 Debug Analytics Tracking');

// Check if user is logged in
const checkUser = async () => {
  const { data: { user } } = await window.supabase.auth.getUser();
  console.log('👤 Current user:', user?.id);
  return user;
};

// Check profile data
const checkProfile = async (userId) => {
  const { data, error } = await window.supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  console.log('📊 Profile data:', data);
  console.log('❌ Profile error:', error);
  return data;
};

// Check analytics columns specifically
const checkAnalyticsColumns = async (userId) => {
  const { data, error } = await window.supabase
    .from('profiles')
    .select('analytics_used, last_analytics_date')
    .eq('user_id', userId)
    .single();

  console.log('📈 Analytics columns:', data);
  console.log('❌ Analytics error:', error);
  return data;
};

// Test month logic
const testMonthLogic = () => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const testDate = '2025-01-15';
  const lastUsedMonth = testDate?.slice(0, 7);

  console.log('📅 Month test:', {
    currentMonth,
    lastUsedMonth,
    isNewMonth: lastUsedMonth !== currentMonth
  });
};

// Run all checks
const runDebug = async () => {
  try {
    const user = await checkUser();
    if (!user) {
      console.log('❌ No user logged in');
      return;
    }

    await checkProfile(user.id);
    await checkAnalyticsColumns(user.id);
    testMonthLogic();

    console.log('✅ Debug complete - check logs above');
  } catch (error) {
    console.error('💥 Debug error:', error);
  }
};

// Auto-run or call manually
runDebug();

// Manual functions for testing:
window.debugAnalytics = {
  checkUser,
  checkProfile,
  checkAnalyticsColumns,
  testMonthLogic,
  runDebug
};

console.log('🛠️ Debug functions available at window.debugAnalytics');