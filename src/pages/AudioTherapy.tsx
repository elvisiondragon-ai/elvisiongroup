import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AudioPlayer } from "@/components/AudioPlayer";
import { AudioUpload } from "@/components/AudioUpload";
import { Lock, ArrowLeft, Music, Upload as UploadIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import verseArtwork from "@/assets/verse-1-cosmic.jpg";
import verse2Artwork from "@/assets/verse-2-cosmic.jpg";
import verse4Artwork from "@/assets/verse-4-cosmic.jpg";

interface AudioTherapyProps {
  onNavigate: (tab: string) => void;
}

export function AudioTherapy({ onNavigate }: AudioTherapyProps) {
  const [userLevel] = useState(3); // Mock user level
  const [isAdmin, setIsAdmin] = useState(false);
  const [audioTracks, setAudioTracks] = useState<any[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAdmin(user?.email === "elvisiondragon@gmail.com");
      await fetchAudioTracks();
      setLoading(false);
    };
    
    initializeData();
  }, []);

  const fetchAudioTracks = async () => {
    try {
      const { data, error } = await supabase
        .from('audio_tracks')
        .select('*')
        .eq('category', 'verse')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching audio tracks:', error);
        return;
      }

      setAudioTracks(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUploadComplete = () => {
    fetchAudioTracks(); // Refresh the tracks list
    setShowUpload(false);
  };

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
      artwork: verse2Artwork,
    },
    {
      id: 3,
      title: "Verse 3",
      unlocked: userLevel >= 8,
      requiredLevel: 8,
      artwork: null,
    },
    {
      id: 4,
      title: "Verse 4",
      unlocked: userLevel >= 10,
      requiredLevel: 10,
      artwork: verse4Artwork,
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
                  <div className="relative group cursor-pointer">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary/50 glow-primary">
                      <img
                        src={verse.artwork}
                        alt={`${verse.title} cosmic artwork`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20"></div>
                    
                    {/* Play Button Overlay */}
                    <div 
                      className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={() => {
                        // For users, find and play the corresponding audio track
                        const verseTrack = audioTracks.find(track => 
                          track.title.toLowerCase().includes(verse.title.toLowerCase())
                        );
                        if (verseTrack) {
                          // You can implement audio playback logic here
                          console.log('Playing:', verseTrack.title);
                        }
                      }}
                    >
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[6px] border-y-transparent ml-1"></div>
                      </div>
                    </div>
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
                  variant="outline"
                  className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium px-8 py-2 rounded-full glow-primary border-primary hover:border-primary"
                  onClick={() => {
                    // Add tutorial functionality here
                    console.log('Opening tutorial for', verse.title);
                  }}
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


      {/* Audio Tracks Section - Show only first 2 tracks */}
      {audioTracks.length > 0 && (
        <div className="px-6 space-y-4">
          <h2 className="text-xl font-semibold font-orbitron text-foreground">
            Available Tracks
          </h2>
          {audioTracks.slice(0, 2).map((track) => (
            <AudioPlayer
              key={track.id}
              title={track.title}
              description={track.description}
              src={track.file_url}
            />
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="px-6">
          <Card className="p-6 bg-gradient-secondary border-border">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-muted-foreground">Loading audio tracks...</p>
            </div>
          </Card>
        </div>
      )}


      {/* Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
}