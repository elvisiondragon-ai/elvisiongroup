import { ArrowLeft, Check, X, Headphones, Clock, AlertCircle, BookOpen, Flame, Droplets } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import position1 from "@/assets/tutorial-position-1.jpg";
import position2 from "@/assets/tutorial-position-2.jpg";
import position3 from "@/assets/tutorial-position-3.jpg";
import position4 from "@/assets/tutorial-position-4.jpg";

export function Headphone() {
  const navigate = useNavigate();

  const positions = [
    {
      image: position1,
      title: "Duduk Bersila",
      description: "Posisi ideal untuk fokus dan meditasi",
      isCorrect: true,
    },
    {
      image: position3,
      title: "Bersandar di Kursi",
      description: "Posisi nyaman untuk refleksi spiritual",
      isCorrect: true,
    },
  ];

  return (
    <div className="min-h-screen bg-blue-900/20 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-blue-900/20 backdrop-blur-md border-b border-blue-500/30 p-4">
        <div className="text-center">
          <h1 className="font-semibold text-2xl text-white">
            Tutorial - Ecosystem
          </h1>
          <p className="text-sm text-white/80">
            Panduan Transformasi Kehidupan Nyata
          </p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Introduction */}
        <Card className="p-6 bg-blue-900/20 backdrop-blur-md border border-blue-500/30">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/30">
              <BookOpen className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Tutorial - Ecosystem
            </h2>
            <p className="text-lg font-semibold text-white">
              Ini akan menjadi tolak ukur anda dengan kehidupan
            </p>
          </div>
        </Card>

        {/* New Ecosystem Tutorial Content */}
        <Card className="p-6 bg-blue-900/20 backdrop-blur-md border border-blue-500/30">
          <div className="space-y-6">

            {/* Step-by-step Instructions */}
            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-3">
                  Langkah Transformasi 7 Hari:
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold text-sm">1</div>
                    <p className="text-white/90">
                      <span className="font-semibold">Lakukan Elite Habit</span> agar lebih mudah konsentrasi dengan nyaman
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-sm">2</div>
                    <p className="text-white/90">
                      <span className="font-semibold">Dengar Verse of eL Vision</span>
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold text-sm">3</div>
                    <p className="text-white/90">
                      <span className="font-semibold">Tulis Journal Spiritual</span>
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center text-white font-bold text-sm">4</div>
                    <p className="text-white/90">
                      <span className="font-semibold">Lakukan 7 hari</span> lalu <span className="font-semibold">Klik Personal Analysis</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Promise Section */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg p-6 border border-yellow-500/30">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-yellow-300">
                  Janji Transformasi
                </h3>
                <p className="text-white text-lg leading-relaxed">
                  Anda akan mendapat jawaban yang <span className="font-bold text-yellow-300">mencengangkan</span>, dan kehidupan anda di dunia nyata pun akan mengalami <span className="font-bold text-yellow-300">perubahan nyata</span>.
                </p>
              </div>
            </div>

            {/* Reality Section */}
            <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-lg p-6 border border-red-500/30">
              <div className="text-center space-y-4">
                <p className="text-white text-lg font-semibold">
                  Ini bukan sekedar game digital, <br />
                  <span className="text-red-300 font-bold text-xl">Ecosystem eL Vision adalah Simulasi dari dunia nyata</span>.
                </p>
              </div>
            </div>

            {/* Closing Message */}
            <div className="text-center py-6">
              <p className="text-3xl font-bold text-white mb-2">
                Selamat Berbahagia! ✨
              </p>
              <p className="text-lg text-white/80">
                eL Vision Group
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}