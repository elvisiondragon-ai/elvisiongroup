import { useState, useEffect } from "react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ProUpgradeNotification } from "@/components/ProUpgradeNotification";
import { Home } from "./Home";
import { Chat } from "./Chat";
import { Leaderboard } from "./Leaderboard";
import { Profile } from "./Profile";
import { useToast } from "@/hooks/use-toast";
import { AudioTherapy } from "./AudioTherapy";
import { SpiritualJournal } from "./SpiritualJournal";
import { MeditationSessions } from "./MeditationSessions";
import { TutorialVideo } from "./TutorialVideo";
import { IgnisQuest } from "./IgnisQuest";
import { Payment } from "./Payment";
import { JournalAnalytics } from "@/components/JournalAnalytics";
import { EliteHabit } from "@/components/EliteHabit";
import { BloodCirculation } from "@/components/BloodCirculation";
import { Finance } from "@/components/Finance";
import { KecantikanFisik } from "@/components/KecantikanFisik";
import { TrueDiet } from "@/components/TrueDiet";
import { Lifestyle } from "@/components/Lifestyle";
import { Pasangan } from "@/components/Pasangan";
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
  const { toast } = useToast();


  const handleTabChange = (newTab: string) => {
    if (isMeditativeActive && newTab !== activeTab) {
      setPendingTab(newTab);
      setShowTabWarning(true);
      return;
    }
    setActiveTab(newTab);
  };

  // Handle signup redirect → force refresh → welcome toast pattern
  useEffect(() => {
    // Check for signup welcome flag and force refresh
    if (localStorage.getItem('signup-welcome-pending') === 'true') {
      
      // Set flag to show welcome toast after refresh
      localStorage.setItem('post-signup-welcome', 'true');
      
      // Clear the original flag
      localStorage.removeItem('signup-welcome-pending');
      
      // Force refresh
      window.location.reload();
      return;
    }
    
    // Check if we need to redirect to chat after refresh button
    if (localStorage.getItem('refresh-redirect-to-chat') === 'true') {
      localStorage.removeItem('refresh-redirect-to-chat');
      setActiveTab('chat');
      return;
    }
    
    // Check if we need to redirect to payment after refresh button
    if (localStorage.getItem('refresh-redirect-to-payment') === 'true') {
      localStorage.removeItem('refresh-redirect-to-payment');
      setActiveTab('payment');
      return;
    }

    // Auto-deploy selective cache cleaner redirects
    if (localStorage.getItem('refresh-redirect-to-journal') === 'true') {
      localStorage.removeItem('refresh-redirect-to-journal');
      setActiveTab('journal');
      return;
    }

    if (localStorage.getItem('refresh-redirect-to-elite-habit') === 'true') {
      localStorage.removeItem('refresh-redirect-to-elite-habit');
      setActiveTab('elite-habit');
      return;
    }

    if (localStorage.getItem('refresh-redirect-to-meditation') === 'true') {
      localStorage.removeItem('refresh-redirect-to-meditation');
      setActiveTab('sesi-meditasi');
      return;
    }

    if (localStorage.getItem('refresh-redirect-to-profile') === 'true') {
      localStorage.removeItem('refresh-redirect-to-profile');
      setActiveTab('profile');
      return;
    }

    if (localStorage.getItem('refresh-redirect-to-audio') === 'true') {
      localStorage.removeItem('refresh-redirect-to-audio');
      setActiveTab('audio-therapy');
      return;
    }
    if (localStorage.getItem('refresh-redirect-to-home') === 'true') {
      localStorage.removeItem('refresh-redirect-to-home');
      setActiveTab('home');
      return;
    }
    
    // Check if we just refreshed from signup and show welcome toast
    if (localStorage.getItem('post-signup-welcome') === 'true') {
      setTimeout(() => {
        toast({
          title: "Selamat Datang!",
          description: "Selamat datang di eL Vision Group Ecosystem!",
        });
        localStorage.removeItem('post-signup-welcome');
      }, 1000);
    }

    // Check for login success and show welcome back toast
    if (localStorage.getItem('login-success-pending') === 'true') {
      setTimeout(() => {
        toast({
          title: "Selamat Datang kembali! 🎉",
          description: "Anda berhasil masuk ke eL Vision Group.",
          variant: "default",
        });
        localStorage.removeItem('login-success-pending');
      }, 1000);
    }
  }, [toast]);

  // Global scroll-to-top functionality for all section navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Home onNavigate={setActiveTab} />;
      case "chat":
        return <Chat onNavigate={setActiveTab} />;
      case "leaderboard":
        return <Leaderboard />;
      case "profile":
        return <Profile onNavigate={setActiveTab} />;
      case "audio-therapy":
        return <AudioTherapy onNavigate={setActiveTab} />;
      case "spiritual-journal":
        return <SpiritualJournal onNavigate={setActiveTab} />;
      case "personal-analytics":
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
        return <TutorialVideo />;
      case "ignis-quest":
        return <IgnisQuest onNavigate={setActiveTab} />;
      case "payment":
        return <Payment onNavigate={setActiveTab} />;
      case "blood-circulation":
        console.log("Rendering Blood Circulation component");
        return (
          <div className="min-h-screen bg-background pb-20">
            <div className="p-6">
              <h1 className="text-2xl font-bold font-orbitron bg-gradient-primary bg-clip-text text-transparent mb-6">
                Peredaran Darah Optimal
              </h1>
              <BloodCirculation onNavigate={setActiveTab} />
            </div>
          </div>
        );
      case "finance":
        console.log("Rendering Finance component");
        return (
          <div className="min-h-screen bg-background pb-20">
            <div className="p-6">
              <h1 className="text-2xl font-bold font-orbitron bg-gradient-primary bg-clip-text text-transparent mb-6">
                Keuangan & Meditasi
              </h1>
              <Finance onNavigate={setActiveTab} />
            </div>
          </div>
        );
      case "physical-beauty":
        console.log("Rendering Physical Beauty component");
        return (
          <div className="min-h-screen bg-background pb-20">
            <div className="p-6">
              <h1 className="text-2xl font-bold font-orbitron bg-gradient-primary bg-clip-text text-transparent mb-6">
                Kecantikan Fisik Sejati
              </h1>
              <KecantikanFisik onNavigate={setActiveTab} />
            </div>
          </div>
        );
      case "true-diet":
        console.log("Rendering True Diet component");
        return (
          <div className="min-h-screen bg-background pb-20">
            <div className="p-6">
              <h1 className="text-2xl font-bold font-orbitron bg-gradient-primary bg-clip-text text-transparent mb-6">
                True Diet: Diet Sejati
              </h1>
              <TrueDiet onNavigate={setActiveTab} />
            </div>
          </div>
        );
      case "lifestyle":
        console.log("Rendering Lifestyle component");
        return <Lifestyle onNavigate={setActiveTab} />;
      case "pasangan":
        console.log("Rendering Pasangan component");
        return (
          <div className="min-h-screen bg-background pb-20">
            <div className="p-6">
              <h1 className="text-2xl font-bold font-orbitron bg-gradient-primary bg-clip-text text-transparent mb-6">
                Pasangan & Ketenangan Diri
              </h1>
              <Pasangan onNavigate={setActiveTab} />
            </div>
          </div>
        );
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
