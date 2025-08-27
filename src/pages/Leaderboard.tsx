import { Card } from "@/components/ui/card";
import { LeaderboardCard } from "@/components/LeaderboardCard";
import { Trophy, Star, Crown } from "lucide-react";

const mockLeaderboard = [
  { id: "1", name: "Andin", level: 9, xp: 12500, rank: 1, avatar: "" },
  { id: "2", name: "Master Yoga", level: 8, xp: 11200, rank: 2, avatar: "" },
  { id: "3", name: "Jason", level: 7, xp: 8900, rank: 3, isPro: true, avatar: "" },
  { id: "4", name: "Spiritual Seeker", level: 7, xp: 7800, rank: 4, avatar: "" },
  { id: "coach-senz", name: "Senz", level: 6, xp: 4500, rank: 5, avatar: "" },
  { id: "5", name: "Andrew", level: 6, xp: 6500, rank: 6, avatar: "" },
  { id: "6", name: "Meditation Pro", level: 5, xp: 5200, rank: 7, avatar: "" },
  { id: "7", name: "Zen Master", level: 4, xp: 4100, rank: 8, avatar: "" },
  { id: "8", name: "Cosmic Soul", level: 4, xp: 3800, rank: 9, avatar: "" },
  { id: "9", name: "Sam_165", level: 3, xp: 3200, rank: 10, avatar: "" },
  { id: "10", name: "Light Worker", level: 3, xp: 2900, rank: 11, avatar: "" },
  { id: "11", name: "Inner Peace", level: 2, xp: 1800, rank: 12, avatar: "" },
];

export function Leaderboard() {
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center glow-primary">
          <Trophy className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold font-orbitron text-foreground mb-2">
          Hall of Energy
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
            <div className="text-lg font-bold font-orbitron text-gold">12</div>
            <div className="text-xs text-muted-foreground">Masters</div>
          </Card>
          
          <Card className="p-4 text-center bg-gradient-secondary border-border">
            <Star className="w-6 h-6 mx-auto mb-2 text-gold" />
            <div className="text-lg font-bold font-orbitron text-gold">10.927</div>
            <div className="text-xs text-muted-foreground">Pro Members</div>
          </Card>
          
          <Card className="p-4 text-center bg-gradient-secondary border-border">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-accent" />
            <div className="text-lg font-bold font-orbitron text-accent">18.719</div>
            <div className="text-xs text-muted-foreground">Active Souls</div>
          </Card>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="px-6 space-y-3">
        <h2 className="text-lg font-semibold font-orbitron text-foreground mb-4">
          Top Spiritual Warriors
        </h2>
        
        {mockLeaderboard.map((user) => (
          <LeaderboardCard key={user.id} user={user} />
        ))}
      </div>

      {/* Your Rank */}
      <div className="p-6">
        <Card className="p-4 bg-gradient-accent border-accent">
          <div className="text-center">
            <h3 className="font-semibold font-orbitron text-background mb-2">
              Peringkat Anda
            </h3>
            <div className="text-2xl font-bold font-orbitron text-background mb-1">
              #23
            </div>
            <p className="text-sm text-background/80">
              Tetap konsisten untuk naik peringkat!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}