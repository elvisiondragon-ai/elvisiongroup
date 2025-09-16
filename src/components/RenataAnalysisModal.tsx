import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Brain, Sparkles, Cpu, Zap, CircuitBoard } from 'lucide-react';

interface RenataAnalysisModalProps {
  isOpen: boolean;
}

export function RenataAnalysisModal({ isOpen }: RenataAnalysisModalProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [dots, setDots] = useState('');

  const analysisPhases = [
    {
      icon: Brain,
      title: "Initializing RENATA Core System",
      subtitle: "Aktivasi Super Intelligence eL Vision Group AI",
      color: "text-cyan-400",
      bgColor: "from-cyan-500/20 to-blue-500/20",
      borderColor: "border-cyan-500/50"
    },
    {
      icon: CircuitBoard,
      title: "Scanning Spiritual Journey Data",
      subtitle: "Menganalisis jurnal, verses, dan elite habits Anda",
      color: "text-purple-400",
      bgColor: "from-purple-500/20 to-indigo-500/20",
      borderColor: "border-purple-500/50"
    },
    {
      icon: Cpu,
      title: "Processing Pattern Recognition",
      subtitle: "Mendeteksi pola tersembunyi dalam perjalanan spiritual",
      color: "text-emerald-400",
      bgColor: "from-emerald-500/20 to-green-500/20",
      borderColor: "border-emerald-500/50"
    },
    {
      icon: Zap,
      title: "Generating Creative Insights",
      subtitle: "Menciptakan rekomendasi spiritual yang unik untuk Anda",
      color: "text-yellow-400",
      bgColor: "from-yellow-500/20 to-orange-500/20",
      borderColor: "border-yellow-500/50"
    },
    {
      icon: Sparkles,
      title: "Finalizing Analysis Report",
      subtitle: "Menyiapkan insight yang akan mengubah hidup Anda",
      color: "text-pink-400",
      bgColor: "from-pink-500/20 to-rose-500/20",
      borderColor: "border-pink-500/50"
    }
  ];

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Cycle through phases
  useEffect(() => {
    if (!isOpen) {
      setCurrentPhase(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentPhase(prev => (prev + 1) % analysisPhases.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, analysisPhases.length]);

  if (!isOpen) return null;

  const currentPhaseData = analysisPhases[currentPhase];
  const IconComponent = currentPhaseData.icon;

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
        <div className="relative">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" />

          {/* Main Modal */}
          <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
            <div className={`
              w-full max-w-2xl p-8 rounded-2xl border-2 backdrop-blur-xl
              bg-gradient-to-br ${currentPhaseData.bgColor}
              ${currentPhaseData.borderColor}
              shadow-2xl transform transition-all duration-1000 ease-in-out
            `}>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 mb-4">
                  <Brain className="w-8 h-8 text-cyan-400 animate-pulse" />
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    RENATA AI
                  </h1>
                  <Brain className="w-8 h-8 text-purple-400 animate-pulse" />
                </div>
                <p className="text-gray-300 text-lg">
                  Super Intelligence eL Vision Group
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  {analysisPhases.map((phase, index) => (
                    <div
                      key={index}
                      className={`
                        w-4 h-4 rounded-full border-2 transition-all duration-500
                        ${index <= currentPhase
                          ? 'bg-gradient-to-r from-cyan-400 to-purple-400 border-cyan-400 shadow-lg shadow-cyan-400/50'
                          : 'border-gray-600 bg-gray-800'
                        }
                      `}
                    />
                  ))}
                </div>
                <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 transition-all duration-1000 ease-out"
                    style={{ width: `${((currentPhase + 1) / analysisPhases.length) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Current Phase Display */}
              <div className="text-center mb-8">
                <div className="mb-6">
                  <IconComponent
                    className={`w-16 h-16 mx-auto ${currentPhaseData.color} animate-bounce`}
                  />
                </div>

                <h2 className={`text-2xl font-bold mb-3 ${currentPhaseData.color}`}>
                  {currentPhaseData.title}{dots}
                </h2>

                <p className="text-gray-300 text-lg">
                  {currentPhaseData.subtitle}
                </p>
              </div>

              {/* Animated Elements */}
              <div className="flex justify-center space-x-4 mb-8">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`
                      w-3 h-3 rounded-full animate-pulse
                      ${i === 0 ? 'bg-cyan-400' : ''}
                      ${i === 1 ? 'bg-purple-400' : ''}
                      ${i === 2 ? 'bg-emerald-400' : ''}
                      ${i === 3 ? 'bg-yellow-400' : ''}
                      ${i === 4 ? 'bg-pink-400' : ''}
                    `}
                    style={{
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '1.5s'
                    }}
                  />
                ))}
              </div>

              {/* Status Text */}
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  RENATA sedang menggunakan ChatGPT-4o-mini Creative Mode
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Proses ini dapat memakan waktu 10-30 detik untuk hasil terbaik
                </p>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-cyan-400/20 rounded-full animate-ping" />
              <div className="absolute -top-6 -right-6 w-6 h-6 bg-purple-400/20 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
              <div className="absolute -bottom-4 -left-6 w-4 h-4 bg-emerald-400/20 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
              <div className="absolute -bottom-6 -right-4 w-10 h-10 bg-pink-400/20 rounded-full animate-ping" style={{ animationDelay: '3s' }} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}