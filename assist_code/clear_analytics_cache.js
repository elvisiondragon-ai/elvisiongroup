// Clear analytics cache script
// Run this in browser console to clear any cached analytics data

console.log('🧹 Clearing analytics cache...');

// Clear localStorage
Object.keys(localStorage).forEach(key => {
  if (key.includes('analytics') || key.includes('analysis') || key.includes('renata')) {
    console.log('Removing from localStorage:', key);
    localStorage.removeItem(key);
  }
});

// Clear sessionStorage
Object.keys(sessionStorage).forEach(key => {
  if (key.includes('analytics') || key.includes('analysis') || key.includes('renata')) {
    console.log('Removing from sessionStorage:', key);
    sessionStorage.removeItem(key);
  }
});

// Clear any potential cache in window object
if (window.analyticsCache) {
  delete window.analyticsCache;
  console.log('Cleared window.analyticsCache');
}

console.log('✅ Analytics cache cleared! Refresh the page.');

// Instructions
console.log(`
🔧 To completely fix "Personal Analysisx":
1. Run this script ✅
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. If still shows "x", check database with SQL script
`);