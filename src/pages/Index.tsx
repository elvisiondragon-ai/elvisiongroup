import { useState } from "react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Home } from "./Home";
import { Chat } from "./Chat";
import { Leaderboard } from "./Leaderboard";
import { Profile } from "./Profile";
import { AudioTherapy } from "./AudioTherapy";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Home onNavigate={setActiveTab} />;
      case "chat":
        return <Chat />;
      case "leaderboard":
        return <Leaderboard />;
      case "profile":
        return <Profile />;
      case "audio-therapy":
        return <AudioTherapy onNavigate={setActiveTab} />;
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
