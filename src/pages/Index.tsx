import { useState } from "react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Home } from "./Home";
import { Chat } from "./Chat";
import { Leaderboard } from "./Leaderboard";
import { Profile } from "./Profile";
import { AudioTherapy } from "./AudioTherapy";
import { SpiritualJournal } from "./SpiritualJournal";
import { MeditationSessions } from "./MeditationSessions";
import { Tutorial } from "./Tutorial";
// import { supabase } from "@/integrations/supabase/client"; // Dihapus karena tidak lagi diperlukan

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  // Fungsi handleLogout dihapus karena tidak ada lagi proses login/logout
  /*
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };
  */

  const renderContent = () => {
    console.log("Current activeTab:", activeTab);
    switch (activeTab) {
      case "home":
        return <Home onNavigate={setActiveTab} />;
      case "chat":
        return <Chat />;
      case "leaderboard":
        return <Leaderboard />;
      case "profile":
        // Properti onLogout dihapus dari komponen Profile
        return <Profile onNavigate={setActiveTab} />;
      case "audio-therapy":
        return <AudioTherapy onNavigate={setActiveTab} />;
      case "spiritual-journal":
        console.log("Rendering SpiritualJournal component");
        return <SpiritualJournal onNavigate={setActiveTab} />;
      case "meditation-sessions":
        return <MeditationSessions onNavigate={setActiveTab} />;
      case "tutorial":
        return <Tutorial />;
      default:
        return <Home onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="relative">
        {renderContent()}
      </main>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
