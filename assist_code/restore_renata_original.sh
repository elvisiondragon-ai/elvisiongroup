#!/bin/bash

# Script to reverse painful mentor approach and restore neutral tone

echo "🔄 Reversing painful mentor changes in renata-analysis..."

# First backup the current version
cp /Users/eldragon/git/elvisiongroup/supabase/functions/renata-analysis/index.ts \
   /Users/eldragon/git/elvisiongroup/assist_code/renata-analysis-painful-mentor-backup.ts

# Now restore neutral tone by replacing harsh language
cd /Users/eldragon/git/elvisiongroup

# Financial pattern - restore neutral tone
sed -i '' 's/Obsesi uang ini menunjukkan kamu belum paham prinsip dasar: yang desperate tidak akan datang. Kamu menciptakan resistance sendiri./Pola dominan menunjukkan fokus besar pada pencapaian finansial, terutama target "juta" yang sering disebutkan/g' supabase/functions/renata-analysis/index.ts

sed -i '' 's/Setiap kali kamu tulis.*Stop sabotase diri sendiri./Ada urgency dan pressure yang kuat ("harus dapat segera") yang menciptakan stress finansial/g' supabase/functions/renata-analysis/index.ts

# Anxiety pattern - restore neutral
sed -i '' 's/Kecemasan ini menunjukkan kamu hidup di masa depan.*tidak pernah terjadi./Pola kecemasan yang dominan menunjukkan mind yang overactive dan sulit tenang/g' supabase/functions/renata-analysis/index.ts

sed -i '' 's/Overthinking adalah bentuk arogansi spiritual.*ilusi berbahaya./Overthinking pattern menciptakan siklus worry yang menjauhkan dari inner peace/g' supabase/functions/renata-analysis/index.ts

# Self-doubt pattern - restore neutral
sed -i '' 's/Keraguan diri ini adalah penghinaan.*gift yang sudah diberikan./Self-doubt pattern yang kuat menghalangi potensi spiritual dan manifestasi/g' supabase/functions/renata-analysis/index.ts

# Love pattern - restore neutral
sed -i '' 's/Obsesi jodoh ini menunjukkan.*kamu isi sendiri./Focus besar pada relationship menunjukkan kebutuhan deep connection/g' supabase/functions/renata-analysis/index.ts

sed -i '' 's/Desperate energy ini akan mengusir jodoh yang tepat.*diselamatkan./Possible attachment atau fear tentang being alone yang creates desperation energy/g' supabase/functions/renata-analysis/index.ts

echo "✅ Neutral tone restored in renata-analysis"
echo "📁 Painful mentor version backed up to assist_code/"