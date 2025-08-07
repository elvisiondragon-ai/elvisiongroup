import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Play, ArrowLeft, Save } from "lucide-react";
import { useState } from "react";

interface SpiritualJournalProps {
  onNavigate: (tab: string) => void;
}

export function SpiritualJournal({ onNavigate }: SpiritualJournalProps) {
  const [reflection, setReflection] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    // Here you would integrate audio playback
  };

  const handleSaveReflection = () => {
    // Here you would save the reflection
    console.log("Saving reflection:", reflection);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate("home")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold font-orbitron bg-gradient-primary bg-clip-text text-transparent">
            Jurnal Spiritual
          </h1>
        </div>
      </div>

      <div className="px-6 space-y-8">
        {/* Audio Guide Section */}
        <Card className="relative p-6 bg-gradient-secondary border-2 border-primary/30 glow-primary overflow-hidden">
          {/* Animated background ripple */}
          <div className="absolute inset-0 opacity-20">
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-primary/30 ${isPlaying ? 'animate-ping' : ''}`}></div>
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-primary/20 ${isPlaying ? 'animate-pulse' : ''}`}></div>
          </div>
          
          <div className="relative z-10 text-center space-y-4">
            <h2 className="text-xl font-semibold font-orbitron text-foreground">
              Guide to Inner Silence
            </h2>
            <p className="text-muted-foreground">
              Audio Pembuka Renungan
            </p>
            
            <div className="flex justify-center py-4">
              <Button
                onClick={handlePlay}
                className={`w-16 h-16 rounded-full bg-gradient-primary hover:opacity-90 transition-all duration-300 ${isPlaying ? 'glow-primary scale-110' : ''}`}
              >
                <Play className={`w-6 h-6 text-primary-foreground ${isPlaying ? 'animate-pulse' : ''}`} />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Dengarkan dan renungkan selama 2 menit
            </p>
          </div>
        </Card>

        {/* Daily Reflection Section */}
        <Card className="p-6 bg-gradient-secondary border-2 border-accent/30 glow-accent">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-orbitron text-foreground">
              Pertanyaan Hari Ini
            </h3>
            
            <div className="p-4 rounded-lg bg-card/50 border border-border">
              <p className="text-foreground leading-relaxed">
                "Apa yang paling ingin kamu lepaskan hari ini, agar hatimu bisa ringan kembali?"
              </p>
            </div>
            
            <div className="space-y-3">
              <Textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Tulis jawabanmu di sini..."
                className="min-h-32 cyber-input bg-card/30 border-border focus:border-primary resize-none"
                rows={6}
              />
              
              <Button
                onClick={handleSaveReflection}
                disabled={!reflection.trim()}
                className="w-full bg-gradient-accent hover:opacity-90 text-background font-medium glow-accent"
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan Renungan
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Done Button */}
      <div className="fixed bottom-6 left-6 right-6">
        <Button
          onClick={() => onNavigate("home")}
          className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium py-3 rounded-full glow-primary"
        >
          Done
        </Button>
      </div>

      {/* Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Cosmic particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-accent rounded-full opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-primary rounded-full opacity-50 animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-accent rounded-full opacity-30 animate-pulse delay-1500"></div>
        <div className="absolute top-1/6 right-1/3 w-1 h-1 bg-primary rounded-full opacity-70 animate-pulse delay-700"></div>
        
        {/* Glowing ambient areas */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
}
