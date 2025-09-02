import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SacredFocusNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  verseName: string;
}

export function SacredFocusNotification({ 
  isVisible, 
  onClose, 
  verseName 
}: SacredFocusNotificationProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Delay content appearance for dramatic effect
      const timer = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center">
      {/* Sacred Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-yellow-400/15 to-amber-400/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-radial from-amber-300/25 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
        
        {/* Sacred particles */}
        <div className="absolute top-1/6 left-1/3 w-3 h-3 bg-amber-300 rounded-full opacity-70 animate-ping" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-yellow-300 rounded-full opacity-60 animate-ping" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-1/3 left-1/5 w-2.5 h-2.5 bg-orange-300 rounded-full opacity-50 animate-ping" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 right-1/6 w-1.5 h-1.5 bg-amber-400 rounded-full opacity-80 animate-ping" style={{animationDelay: '0.7s'}}></div>
      </div>

      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-6 right-6 text-amber-300/60 hover:text-amber-300 z-10"
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Main content */}
      <div className={`relative z-10 text-center max-w-2xl mx-6 transition-all duration-1000 transform ${
        showContent ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
      }`}>
        {/* Sacred glow around content */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-yellow-400/5 to-orange-400/10 rounded-3xl blur-xl"></div>
        
        <div className="relative bg-black/40 backdrop-blur-xl border-2 border-amber-400/30 rounded-3xl p-12 shadow-2xl shadow-amber-400/20">
          {/* Sacred symbol */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-amber-400/60 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-300/80 to-yellow-300/80 rounded-full blur-sm animate-pulse"></div>
              </div>
              <div className="absolute inset-0 w-20 h-20 border-2 border-amber-300/30 rounded-full animate-spin" style={{animationDuration: '8s'}}></div>
            </div>
          </div>

          {/* Sacred title */}
          <h1 className="text-4xl font-bold font-serif text-transparent bg-gradient-to-r from-amber-200 via-yellow-200 to-orange-200 bg-clip-text mb-4 tracking-wider" 
              style={{
                fontFamily: 'Times New Roman, serif',
                textShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
                letterSpacing: '0.1em'
              }}>
            ✨ Momen Sakral ✨
          </h1>

          {/* Verse name with glow */}
          <div className="mb-8">
            <p className="text-xl font-semibold text-amber-200/90 mb-2" style={{
              textShadow: '0 0 10px rgba(251, 191, 36, 0.3)'
            }}>
              {verseName}
            </p>
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto"></div>
          </div>

          {/* Sacred message */}
          <div className="space-y-6 mb-10">
            <p className="text-2xl font-bold text-yellow-200 leading-relaxed" style={{
              fontFamily: 'Times New Roman, serif',
              textShadow: '0 0 15px rgba(251, 191, 36, 0.4)',
              letterSpacing: '0.05em'
            }}>
              Fokus Menyimak Agar Hasil Maksimal
            </p>
            
            <p className="text-lg text-amber-200/80 leading-relaxed font-medium" style={{
              fontFamily: 'Times New Roman, serif',
              textShadow: '0 0 8px rgba(251, 191, 36, 0.2)',
              letterSpacing: '0.02em'
            }}>
              Jangan berpindah Tab saat meditasi
            </p>

            <p className="text-base text-amber-300/70 italic" style={{
              fontFamily: 'Times New Roman, serif',
              letterSpacing: '0.03em'
            }}>
              "Ketenangan sejati datang dari fokus yang tidak terbagi"
            </p>
          </div>

          {/* Sacred continue button */}
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-amber-500/80 to-yellow-500/80 hover:from-amber-500 hover:to-yellow-500 text-black font-bold px-12 py-4 rounded-full text-lg shadow-2xl shadow-amber-500/40 border-2 border-amber-400/50 transform hover:scale-105 transition-all duration-300"
            style={{
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              boxShadow: '0 0 30px rgba(251, 191, 36, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
            }}
          >
            Saya sudah selesai meditasi
          </Button>
        </div>
      </div>

      {/* Breathing light effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-radial from-amber-400/5 via-transparent to-transparent animate-pulse" 
             style={{animationDuration: '4s'}}></div>
      </div>
    </div>
  );
}