// Check all available react-icons/gi icons
import * as GI from 'react-icons/gi';

console.log('Total icons available:', Object.keys(GI).length);
console.log('\nAll available icons:');
Object.keys(GI).sort().forEach((iconName, index) => {
  console.log(`${index + 1}. ${iconName}`);
});

// You can also filter by keywords:
console.log('\n--- SEARCH BY KEYWORD ---');
console.log('Usage: node check-all-icons.js | grep -i "keyword"');
console.log('Example: node check-all-icons.js | grep -i "crown"');