import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SchedulePicker } from "@/components/SchedulePicker";
import { ArrowLeft, Bell, BellRing, Plus, Calendar } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface MeditationSessionsProps {
  onNavigate: (tab: string) => void;
}

interface Session {
  id: number;
  coach: string;
  date: string;
  time: string;
  notificationSet: boolean;
}

export function MeditationSessions({ onNavigate }: MeditationSessionsProps) {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: 1,
      coach: "Coach Senz",
      date: "20 Agustus",
      time: "21.00 WIB",
      notificationSet: false,
    },
    {
      id: 2,
      coach: "Coach Andre",
      date: "20 Agustus", 
      time: "15.00 WIB",
      notificationSet: false,
    },
    {
      id: 3,
      coach: "Coach Andin",
      date: "21 Agustus",
      time: "08.00 WIB",
      notificationSet: false,
    },
    {
      id: 4,
      coach: "Coach Fredi",
      date: "22 Agustus",
      time: "12.00 WIB",
      notificationSet: false,
    },
  ]);

  const [showScheduler, setShowScheduler] = useState(false);
  const { toast } = useToast();

  const handleNotification = (sessionId: number) => {
    setSessions(sessions.map(session => 
      session.id === sessionId 
        ? { ...session, notificationSet: !session.notificationSet }
        : session
    ));
  };

  const handleScheduleSelect = (date: Date, time: string) => {
    const newSession: Session = {
      id: sessions.length + 1,
      coach: "Personal Session",
      date: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' }),
      time: `${time} WIB`,
      notificationSet: false,
    };
    
    setSessions([...sessions, newSession]);
    setShowScheduler(false);
    
    toast({
      title: "Sesi Dijadwalkan!",
      description: `Sesi meditasi pada ${newSession.date} jam ${newSession.time} telah ditambahkan.`,
    });
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
            Sesi Meditasi
          </h1>
          <Button
            onClick={() => setShowScheduler(true)}
            className="ml-auto bg-gradient-primary hover:opacity-90"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Jadwalkan
          </Button>
        </div>
      </div>

      {/* Sessions List */}
      <div className="px-6 space-y-4">
        {sessions.map((session) => (
          <Card
            key={session.id}
            className="p-6 bg-gradient-secondary border-2 border-primary/20 glow-primary/50 transition-all duration-300 hover:border-primary/40 hover:glow-primary"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold font-orbitron text-foreground">
                  {session.coach}
                </h3>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">
                    {session.date}
                  </p>
                  <p className="text-accent font-medium">
                    {session.time}
                  </p>
                </div>
              </div>
              
              <Button
                onClick={() => handleNotification(session.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  session.notificationSet
                    ? "bg-gradient-accent text-background glow-accent"
                    : "bg-gradient-primary text-primary-foreground glow-primary hover:opacity-90"
                }`}
              >
                {session.notificationSet ? (
                  <>
                    <BellRing className="w-4 h-4 mr-2" />
                    Notified
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 mr-2" />
                    Notify Me 3 Hours Prior
                  </>
                )}
              </Button>
            </div>

            {/* Cosmic background decoration */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-2 right-4 w-8 h-8 bg-primary/20 rounded-full blur-sm"></div>
              <div className="absolute bottom-3 left-6 w-4 h-4 bg-accent/30 rounded-full blur-sm"></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom Tip */}
      <div className="fixed bottom-24 left-6 right-6">
        <Card className="p-4 bg-card/80 backdrop-blur-sm border border-border">
          <div className="flex items-center gap-3">
            <div className="text-2xl">💡</div>
            <p className="text-sm text-muted-foreground">
              Tap Notify to get reminded before each session
            </p>
          </div>
        </Card>
      </div>

      {/* Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Flowing particles */}
        <div className="absolute top-1/6 left-1/4 w-2 h-2 bg-primary rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-2/6 right-1/3 w-1 h-1 bg-accent rounded-full opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-3/6 left-1/5 w-1 h-1 bg-primary rounded-full opacity-50 animate-pulse delay-500"></div>
        <div className="absolute top-4/6 right-1/4 w-2 h-2 bg-accent rounded-full opacity-30 animate-pulse delay-1500"></div>
        <div className="absolute top-5/6 left-1/3 w-1 h-1 bg-primary rounded-full opacity-70 animate-pulse delay-700"></div>
        
        {/* Glowing ambient areas */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/2 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/3 rounded-full blur-2xl"></div>
        
        {/* Indigo flowing effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/1 via-transparent to-accent/1"></div>
      </div>

      {/* Schedule Dialog */}
      <Dialog open={showScheduler} onOpenChange={setShowScheduler}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-orbitron">Jadwalkan Sesi Meditasi</DialogTitle>
          </DialogHeader>
          <SchedulePicker onScheduleSelect={handleScheduleSelect} />
        </DialogContent>
      </Dialog>
    </div>
  );
}