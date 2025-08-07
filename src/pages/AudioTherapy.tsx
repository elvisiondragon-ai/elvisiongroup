import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import verseArtwork from "@/assets/verse-1-cosmic.jpg";

interface AudioTherapyProps {
  onNavigate: (tab: string) => void;
}

export function AudioTherapy({ onNavigate }: AudioTherapyProps) {
  const [userLevel] = useState(3); // Mock user level
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAdmin(user?.email === "elvisiondragon@gmail.com");
    };
    
    checkAdminAccess();
  }, []);

  const verses = [
    {
      id: 1,
      title: "Verse 1",
      unlocked: true,
      requiredLevel: 1,
      artwork: verseArtwork,
    },
    {
      id: 2,
      title: "Verse 2",
      unlocked: userLevel >= 5,
      requiredLevel: 5,
      artwork: null,
    },
    {
      id: 3,
      title: "Verse 3",
      unlocked: userLevel >= 8,
      requiredLevel: 8,
      artwork: null,
    },
  ];

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
            Chamber of eL Vision
          </h1>
        </div>
      </div>

      {/* Verses */}
      <div className="px-6 space-y-6">
        {verses.map((verse) => (
          <Card
            key={verse.id}
            className={`p-6 border-2 transition-all duration-300 ${
              verse.unlocked
                ? "bg-gradient-secondary border-primary/30 glow-primary"
                : "bg-card border-border opacity-60"
            }`}
          >
            <div className="text-center space-y-4">
              {/* Title */}
              <h3 className="text-xl font-semibold font-orbitron text-foreground">
                {verse.title}
              </h3>

              {/* Artwork or Lock */}
              <div className="flex justify-center">
                {verse.unlocked && verse.artwork ? (
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary/50 glow-primary">
                      <img
                        src={verse.artwork}
                        alt={`${verse.title} cosmic artwork`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20"></div>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                    <Lock className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Status/Button */}
              {verse.unlocked ? (
                <Button
                  className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium px-8 py-2 rounded-full glow-primary"
                >
                  READ TUTORIAL
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm">
                    {verse.requiredLevel <= 5 
                      ? "Level up to unlock" 
                      : "Locked"
                    }
                  </p>
                  {verse.requiredLevel <= 5 && (
                    <p className="text-xs text-muted-foreground">
                      Requires Level {verse.requiredLevel}
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
}