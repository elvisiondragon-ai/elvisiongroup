// Test streak badge logic
function testStreakLogic(streak_days) {
  console.log(`Testing streak_days: ${streak_days}`);
  
  if (streak_days >= 320) {
    console.log("→ Should show: Ignis 320+");
  } else if (streak_days >= 90) {
    console.log("→ Should show: Wanderer 90+");
  } else if (streak_days >= 60) {
    console.log("→ Should show: Lumina 60+");
  } else if (streak_days >= 30) {
    console.log("→ Should show: Seeker 30+");
  } else if (streak_days >= 7) {
    console.log("→ Should show: Warrior 7+");
  } else {
    console.log("→ No badge (less than 7 days)");
  }
  console.log("---");
}

// Test cases
testStreakLogic(50);  // Should be Seeker 30+
testStreakLogic(70);  // Should be Lumina 60+
testStreakLogic(100); // Should be Wanderer 90+
testStreakLogic(320); // Should be Ignis 320+
testStreakLogic(7);   // Should be Warrior 7+