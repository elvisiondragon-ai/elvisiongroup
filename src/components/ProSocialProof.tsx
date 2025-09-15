import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Crown, Users, Radio, Eye, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProSocialProofProps {
  className?: string;
}

export function ProSocialProof({ className }: ProSocialProofProps) {
  // Generate dynamic numbers based on current date for consistency
  const getDailyNumber = (base: number, variation: number) => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    // Use day of year as seed for consistent daily numbers
    const seed = (dayOfYear * 137) % 1000; // Simple hash
    return base + (seed % variation);
  };

  const [liveProUsers, setLiveProUsers] = useState(() => getDailyNumber(10900, 127)); // 10,900-11,027 range
  const [currentlyMeditating, setCurrentlyMeditating] = useState(() => getDailyNumber(1200, 4400)); // 1,200-5,600 range
  const [recentActivity, setRecentActivity] = useState<string>('');

  useEffect(() => {
    // Simulate live updates for Pro users with realistic bounds
    const interval = setInterval(() => {
      setLiveProUsers(prev => Math.max(10900, Math.min(11027, prev + Math.floor(Math.random() * 5) - 2)));
      setCurrentlyMeditating(prev => Math.max(1200, Math.min(5600, prev + Math.floor(Math.random() * 15) - 7)));

      // Random Pro activity messages
      const activities = [
        'Anggota Pro baru saja menyelesaikan Verse 5',
        'Seseorang mendapat insight dari Journal Analytics',
        'Anggota Pro sedang mengikuti live session',
        'Baru saja ada yang unlock Verse 3 Premium',
        'Pro member mencapai streak 30 hari!',
      ];
      setRecentActivity(activities[Math.floor(Math.random() * activities.length)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Live Pro Counter */}
      <Card className="p-4 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            <span className="text-purple-300 font-semibold">
              {liveProUsers.toLocaleString()} Anggota Pro
            </span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm">
              {currentlyMeditating} sedang bermeditasi
            </span>
          </div>
        </div>
      </Card>

      {/* FOMO Activity */}
      <Card className="p-3 bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/30">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-amber-200 text-sm">{recentActivity}</span>
        </div>
      </Card>
    </div>
  );
}