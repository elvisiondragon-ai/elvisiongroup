import { useState, useEffect, lazy, Suspense } from "react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Home } from "./Home";

// Heavy components loaded lazily
const Chat = lazy(() => import("./Chat").then(module => ({ default: module.Chat })));
const Leaderboard = lazy(() => import("./Leaderboard").then(module => ({ default: module.Leaderboard })));
const Profile = lazy(() => import("./Profile").then(module => ({ default: module.Profile })));
const AudioTherapy = lazy(() => import("./AudioTherapy").then(module => ({ default: module.AudioTherapy })));
const SpiritualJournal = lazy(() => import("./SpiritualJournal").then(module => ({ default: module.SpiritualJournal })));
const MeditationSessions = lazy(() => import("./MeditationSessions").then(module => ({ default: module.MeditationSessions })));
const IgnisQuest = lazy(() => import("./IgnisQuest").then(module => ({ default: module.IgnisQuest })));
const Payment = lazy(() => import("./Payment").then(module => ({ default: module.Payment })));

import { useToast } from "@/hooks/use-toast";
import { JournalAnalytics } from "@/components/JournalAnalytics";
import { EliteHabit } from "@/components/EliteHabit";
import { BloodCirculation } from "@/components/BloodCirculation";
import { Finance } from "@/components/Finance";
import { KecantikanFisik } from "@/components/KecantikanFisik";
import { TrueDiet } from "@/components/TrueDiet";

import { Perhiasan } from "@/components/Perhiasan";
import { Aroma } from "@/components/Aroma";
import { Pasangan } from "@/components/Pasangan";


import { supabase } from "@/integrations/supabase/client";
import { useMeditative } from "@/contexts/MeditativeContext";
import { useAuth } from "@/contexts/AuthContext";
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
  const { trackPageView } = useAuth();


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
    
    // Handle auto-redirect to profile for avatar upload incentive
    if (localStorage.getItem('auto-edit-profile') === 'true') {
      localStorage.removeItem('auto-edit-profile');
      setActiveTab('profile');
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
    trackPageView(activeTab);
  }, [activeTab, trackPageView]);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Home onNavigate={handleTabChange} />;
      case "chat":
        return <Chat onNavigate={handleTabChange} />;
      case "leaderboard":
        return <Leaderboard />;
      case "profile":
        return <Profile onNavigate={handleTabChange} />;
      case "audio-therapy":
        return <AudioTherapy onNavigate={handleTabChange} />;
      case "spiritual-journal":
        return <SpiritualJournal onNavigate={handleTabChange} />;
      case "personal-analytics":
        return (
          <div className="min-h-screen bg-background pb-20">
            <div className="p-6">
              <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent mb-6">
                Personal Analytics Algoritm
              </h1>
              <JournalAnalytics onUpgradeClick={() => handleTabChange("payment")} />
            </div>
          </div>
        );
      case "elite-habit":
        return (
          <div className="min-h-screen bg-background pb-20">
            <div className="p-6">
              <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent mb-6">
                Elite Habit
              </h1>
              <EliteHabit />
            </div>
          </div>
        );
      case "meditation-sessions":
        return <MeditationSessions onNavigate={handleTabChange} />;

      case "ignis-quest":
        return <IgnisQuest onNavigate={handleTabChange} />;
        
      case "payment":
        return <Payment onNavigate={handleTabChange} />;
      case "blood-circulation":
        console.log("Rendering Blood Circulation component");
        return (
          <div className="min-h-screen bg-background pb-20">
            <div className="p-6">
              <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent mb-6">
                Peredaran Darah Optimal
              </h1>
              <BloodCirculation onNavigate={handleTabChange} />
            </div>
          </div>
        );
      case "finance":
        console.log("Rendering Finance component");
        return (
          <div className="min-h-screen bg-background pb-20">
            <div className="p-6">
              <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent mb-6">
                Keuangan & Meditasi
              </h1>
              <Finance onNavigate={handleTabChange} />
            </div>
          </div>
        );
      case "physical-beauty":
        console.log("Rendering Physical Beauty component");
        return (
          <div className="min-h-screen bg-background pb-20">
            <div className="p-6">
              <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent mb-6">
                Kecantikan Fisik Sejati
              </h1>
              <KecantikanFisik onNavigate={handleTabChange} />
            </div>
          </div>
        );
      case "true-diet":
        console.log("Rendering True Diet component");
        return (
          <div className="min-h-screen bg-background pb-20">
            <div className="p-6">
              <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent mb-6">
                True Diet: Diet Sejati
              </h1>
              <TrueDiet onNavigate={handleTabChange} />
            </div>
          </div>
        );
      case "perhiasan":
        console.log("Rendering Perhiasan component");
        return (
          <div className="min-h-screen bg-background pb-20">
            <div className="p-6">
              <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent mb-6">
                Perhiasan
              </h1>
              <Perhiasan onNavigate={handleTabChange} />
            </div>
          </div>
        );
      case "aroma":
        console.log("Rendering Aroma component");
        return (
          <div className="min-h-screen bg-background pb-20">
            <div className="p-6">
              <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent mb-6">
                Aroma
              </h1>
              <Aroma onNavigate={handleTabChange} />
            </div>
          </div>
        );

      case "pasangan":
        console.log("Rendering Pasangan component");
        return (
          <div className="min-h-screen bg-background pb-20">
            <div className="p-6">
              <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent mb-6">
                Pasangan & Ketenangan Diri
              </h1>
              <Pasangan onNavigate={handleTabChange} />
            </div>
          </div>
        );
      default:
        return <Home onNavigate={handleTabChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      
      <main className="relative">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          {renderContent()}
        </Suspense>
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
