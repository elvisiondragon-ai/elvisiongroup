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
import { IgnisQuest } from "./IgnisQuest";
import { Payment } from "./Payment";
import { HLSTest } from "./HLSTest";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };

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
        return <Profile onLogout={handleLogout} onNavigate={setActiveTab} />;
      case "audio-therapy":
        return <AudioTherapy onNavigate={setActiveTab} />;
      case "spiritual-journal":
        console.log("Rendering SpiritualJournal component");
        return <SpiritualJournal onNavigate={setActiveTab} />;
      case "meditation-sessions":
        return <MeditationSessions onNavigate={setActiveTab} />;
      case "tutorial":
        return <Tutorial />;
      case "ignis-quest":
        return <IgnisQuest onNavigate={setActiveTab} />;
      case "payment":
        return <Payment onNavigate={setActiveTab} />;
      case "hls-test":
        return <HLSTest onNavigate={setActiveTab} />;
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
