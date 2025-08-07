import { Home, MessageCircle, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const navItems = [
    { id: "home", label: "Beranda", icon: Home },
    { id: "chat", label: "Komunitas", icon: MessageCircle },
    { id: "leaderboard", label: "Hall of Energy", icon: Trophy },
    { id: "profile", label: "Profil", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex items-center justify-around p-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 min-w-0 flex-1",
              activeTab === item.id
                ? "text-primary bg-primary/10 glow-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}