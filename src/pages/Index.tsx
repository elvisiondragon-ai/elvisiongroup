import { useState } from "react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ProUpgradeNotification } from "@/components/ProUpgradeNotification";
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
import { JournalAnalytics } from "@/components/JournalAnalytics";
import { EliteHabit } from "@/components/EliteHabit";
import { supabase } from "@/integrations/supabase/client";
import { useMeditative } from "@/contexts/MeditativeContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const { isMeditativeActive } = useMeditative();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };

  const handleTabChange = (newTab: string) => {
    if (isMeditativeActive && newTab !== activeTab) {
      setPendingTab(newTab);
      setShowTabWarning(true);
      return;
    }
    setActiveTab(newTab);
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
      case "personal-analytics":
        console.log("Rendering Personal Analytics component");
        return (
          <div className="min-h-screen bg-background pb-20">
            <div className="p-6">
              <h1 className="text-2xl font-bold font-orbitron bg-gradient-primary bg-clip-text text-transparent mb-6">
                Personal Analytics Algoritm
              </h1>
              <JournalAnalytics onUpgradeClick={() => setActiveTab("payment")} />
            </div>
          </div>
        );
      case "elite-habit":
        console.log("Rendering Elite Habit component");
        return (
          <div className="min-h-screen bg-background pb-20">
            <div className="p-6">
              <h1 className="text-2xl font-bold font-orbitron bg-gradient-primary bg-clip-text text-transparent mb-6">
                Elite Habit
              </h1>
              <EliteHabit />
            </div>
          </div>
        );
      case "meditation-sessions":
        return <MeditationSessions onNavigate={setActiveTab} />;
      case "tutorial":
        return <Tutorial />;
      case "ignis-quest":
        return <IgnisQuest onNavigate={setActiveTab} />;
      case "payment":
        return <Payment onNavigate={setActiveTab} />;
      default:
        return <Home onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ProUpgradeNotification onUpgradeClick={() => setActiveTab("payment")} />
      <main className="relative">
        {renderContent()}
      </main>
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      {/* Tab Warning Dialog */}
      <AlertDialog open={showTabWarning} onOpenChange={setShowTabWarning}>
        <AlertDialogContent className="bg-background border border-primary/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-primary">Peringatan</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              EXP sesi ini akan di reset jika keluar tab. Fokuslah sejenak.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2">
            <AlertDialogAction 
              onClick={() => {
                setShowTabWarning(false);
                setPendingTab(null);
                if (pendingTab) {
                  setActiveTab(pendingTab);
                } else {
                  setActiveTab("audio-therapy");
                }
                // Reset logic here if needed
              }}
              className="bg-destructive hover:bg-destructive/90 w-full"
            >
              Reset EXP dan Keluar
            </AlertDialogAction>
            <AlertDialogCancel 
              onClick={() => {
                setShowTabWarning(false);
                setPendingTab(null);
              }}
              className="border-primary/20 w-full"
            >
              Jangan Reset EXP
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
