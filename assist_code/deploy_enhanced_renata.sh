#!/bin/bash
# Deploy Enhanced RENATA Analysis Function with Elite Habits Integration

echo "🔮 Deploying Enhanced RENATA Analysis v3.0..."

# Backup current function
echo "📁 Backing up current renata-analysis function..."
cp /Users/eldragon/git/elvisiongroup/supabase/functions/renata-analysis/index.ts /Users/eldragon/git/elvisiongroup/assist_code/renata-analysis-backup-$(date +%Y%m%d_%H%M%S).ts

# Deploy enhanced version
echo "🚀 Deploying enhanced RENATA function..."
cp /Users/eldragon/git/elvisiongroup/assist_code/enhanced_renata_analysis.ts /Users/eldragon/git/elvisiongroup/supabase/functions/renata-analysis/index.ts

echo "✅ Enhanced RENATA Analysis v3.0 deployed!"
echo ""
echo "🔮 NEW CAPABILITIES:"
echo "   ✨ Elite Habits mindfulness training assessment"
echo "   ✨ Stress-to-Peace conversion power analysis"
echo "   ✨ Mindfulness profile determination (discipline-focus, introspective-calm, etc.)"
echo "   ✨ Complete spiritual trinity analysis (reflections + elite habits + verses)"
echo "   ✨ Enhanced spiritual growth scoring"
echo "   ✨ Mindfulness level calculation"
echo ""
echo "📊 REQUIRED DATA STRUCTURE:"
echo "   - reflections: array of reflection objects"
echo "   - eliteHabits: array of elite habit objects with exercise_type and duration_minutes"
echo "   - totalVerses: number"
echo "   - totalJournal: number"
echo "   - totalEliteHabits: number"
echo ""
echo "🧘‍♀️ ELITE HABITS UNDERSTANDING:"
echo "   - Plank/Push-up = Discipline-Focus training"
echo "   - Yoga = Introspective-Calm training"
echo "   - Walking = Contemplative-Movement training"
echo "   - Swimming = Flow-Meditation training"
echo "   - Running = Endurance-Mindfulness training"
echo "   - Breathing = Breath-Awareness training"
echo ""
echo "🎯 To test: Send POST with complete spiritual data to renata-analysis function"