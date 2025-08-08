import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AudioPlayer } from "@/components/AudioPlayer";
import { AudioUpload } from "@/components/AudioUpload";
import { Lock, ArrowLeft, Music, Upload as UploadIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import verseArtwork from "@/assets/verse-1-cosmic.jpg";
import verse2Artwork from "@/assets/verse-2-cosmic.jpg";
import verse3Artwork from "@/assets/verse-3-cosmic.jpg";
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
      artwork: verse3Artwork,
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
      <div className="px-6 space-y-8">
        {verses.map((verse) => (
          <Card
            key={verse.id}
            className={`relative overflow-hidden border-2 transition-all duration-500 transform hover:scale-[1.02] ${
              verse.unlocked
                ? "bg-gradient-to-br from-primary/5 via-background to-accent/5 border-primary/40 shadow-2xl shadow-primary/20"
                : "bg-gradient-to-br from-muted/20 to-background border-border/40 opacity-70"
            }`}
          >
            {/* Cosmic Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-transparent to-accent"></div>
              <div className="absolute top-4 right-4 w-16 h-16 border border-primary/20 rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border border-accent/20 rounded-full"></div>
            </div>
            
            <div className="relative z-10 text-center space-y-6 p-8">
              {/* Title */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold font-orbitron bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {verse.title}
                </h3>
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
              </div>

              {/* Artwork or Lock */}
              <div className="flex justify-center">
                {verse.unlocked && verse.artwork ? (
                  <div className="relative group cursor-pointer">
                    {/* Outer glow ring */}
                    <div className="absolute inset-0 w-40 h-40 rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-30 blur-xl animate-pulse"></div>
                    
                    {/* Main artwork container */}
                    <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-gradient-to-r from-primary/60 to-accent/60 shadow-2xl shadow-primary/40">
                      <img
                        src={verse.artwork}
                        alt={`${verse.title} cosmic artwork`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-accent/20"></div>
                    </div>
                    
                    {/* Play Button Overlay */}
                    <div 
                      className="absolute inset-0 rounded-full bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer"
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
                      <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center backdrop-blur-lg border border-white/20 shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                        <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1 drop-shadow-lg"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="w-36 h-36 rounded-full bg-gradient-to-br from-muted/40 to-muted/20 flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                      <div className="text-center space-y-2">
                        <Lock className="w-10 h-10 text-muted-foreground mx-auto" />
                        <div className="text-xs text-muted-foreground font-medium">LOCKED</div>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-muted/10 to-transparent"></div>
                  </div>
                )}
              </div>

              {/* Status/Button */}
              {verse.unlocked ? (
                <div className="space-y-4">
                  <Button
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-10 py-3 rounded-full shadow-lg shadow-primary/40 transform hover:scale-105 transition-all duration-300 border border-white/20"
                    onClick={() => {
                      // Add tutorial functionality here
                      console.log('Opening tutorial for', verse.title);
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <Music className="w-4 h-4" />
                      READ TUTORIAL
                    </span>
                  </Button>
                  <div className="text-xs text-primary/80 font-medium">✨ UNLOCKED ✨</div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="px-6 py-3 bg-gradient-to-r from-muted/20 to-muted/10 rounded-full border border-muted-foreground/20">
                    <p className="text-muted-foreground text-sm font-medium">
                      {verse.requiredLevel <= 5 
                        ? "🔒 Level up to unlock" 
                        : "🔒 Locked"
                      }
                    </p>
                  </div>
                  {verse.requiredLevel <= 5 && (
                    <div className="text-xs text-muted-foreground/80 bg-muted/20 px-4 py-2 rounded-full">
                      Requires Level {verse.requiredLevel}
                    </div>
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