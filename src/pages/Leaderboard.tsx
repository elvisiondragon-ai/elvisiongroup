import { Card } from "@/components/ui/card";
import { LeaderboardCard } from "@/components/LeaderboardCard";
import { Trophy, Star, Crown } from "lucide-react";

const mockLeaderboard = [
  { id: "1", name: "Amirrudin Sayid", level: 10, xp: 14400, rank: 1, isPro: true, avatar: "", subscriptionType: "1_year", streak_days: 520 },
  { id: "coach-senz", name: "Abdul Hakikat", level: 9, xp: 12200, rank: 2, isPro: true, avatar: "", subscriptionType: "1_year", streak_days: 472 },
  { id: "3", name: "Jason", level: 8, xp: 9900, rank: 3, isPro: true, avatar: "", subscriptionType: "1_year", streak_days: 400 },
  { id: "4", name: "Spiritual Seeker", level: 8, xp: 9380, rank: 4, isPro: true, avatar: "", subscriptionType: "1_year", streak_days: 380 },
  { id: "2", name: "Master Yoga", level: 7, xp: 8300, rank: 5, isPro: true, avatar: "", subscriptionType: "1_year", streak_days: 420 },
  { id: "5", name: "Andrew", level: 7, xp: 7940, rank: 6, isPro: true, avatar: "", subscriptionType: "1_year", streak_days: 390 },
  { id: "7", name: "Zen Master", level: 7, xp: 7340, rank: 7, isPro: true, avatar: "", subscriptionType: "1_year", streak_days: 377 },
  { id: "8", name: "Cosmic Soul", level: 7, xp: 7100, rank: 8, isPro: true, avatar: "", subscriptionType: "1_year", streak_days: 365 },
  { id: "9", name: "Sam_Rindu", level: 6, xp: 6900, rank: 9, isPro: true, avatar: "", subscriptionType: "1_year", streak_days: 362 },
  { id: "10", name: "Nanawati", level: 6, xp: 6760, rank: 10, isPro: true, avatar: "", subscriptionType: "1_year", streak_days: 347 },
];

export function Leaderboard() {
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center glow-primary">
          <Trophy className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold font-exo text-foreground mb-2">
          Leaderboard
        </h1>
        <p className="text-muted-foreground">
          Para soul leaders dengan vibrasi tertinggi
        </p>
      </div>

      {/* Stats Cards */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center bg-gradient-secondary border-border">
            <Crown className="w-6 h-6 mx-auto mb-2 text-gold" />
            <div className="text-lg font-bold font-exo text-gold">120</div>
            <div className="text-xs text-muted-foreground">Masters</div>
          </Card>
          
          <Card className="p-4 text-center bg-gradient-secondary border-border">
            <Star className="w-6 h-6 mx-auto mb-2 text-gold" />
            <div className="text-lg font-bold font-exo text-gold">10.927</div>
            <div className="text-xs text-muted-foreground">Pro Members</div>
          </Card>
          
          <Card className="p-4 text-center bg-gradient-secondary border-border">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-accent" />
            <div className="text-lg font-bold font-exo text-accent">18.719</div>
            <div className="text-xs text-muted-foreground">Active Souls</div>
          </Card>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="px-6 space-y-3">
        <h2 className="text-lg font-semibold font-exo text-foreground mb-4">
          Top Spiritual Warriors
        </h2>
        
        {mockLeaderboard.map((user) => (
          <LeaderboardCard key={user.id} user={user} />
        ))}
      </div>

      {/* Motivation */}
      <div className="p-6">
        <Card className="p-4 bg-gradient-accent border-accent">
          <div className="text-center">
            <h3 className="font-semibold font-exo text-white mb-2">
              🔥 Leaderboard 🔥
            </h3>
            <p className="text-sm text-white">
              Terus kejar Streak days dengan aktif setiap hari agar masuk peringkat. Konsistensi adalah kunci keberhasilan!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}