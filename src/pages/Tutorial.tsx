import { ArrowLeft, Check, X, Headphones, Clock, AlertCircle, BookOpen, Flame, Droplets } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import position1 from "@/assets/tutorial-position-1.jpg";
import position2 from "@/assets/tutorial-position-2.jpg";
import position3 from "@/assets/tutorial-position-3.jpg";
import position4 from "@/assets/tutorial-position-4.jpg";

export function Tutorial() {
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
          <h1 className="font-semibold text-2xl text-white" style={{ fontFamily: 'serif' }}>
            Tutorial Read Profil
          </h1>
          <p className="text-sm text-white/80" style={{ fontFamily: 'serif' }}>
            Panduan Memahami Profil Spiritual
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
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'serif' }}>
              Tutorial Read Profil
            </h2>
            <p className="text-lg font-semibold text-white" style={{ fontFamily: 'serif' }}>
              Profil ini akan menjadi tolak ukur anda dengan kehidupan
            </p>
          </div>
        </Card>

        {/* Metrics Explanation */}
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-blue-900/20 backdrop-blur-md rounded-lg border border-blue-500/30">
            <Flame className="w-8 h-8 text-orange-400 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-white mb-2 text-lg" style={{ fontFamily: 'serif' }}>Total Verses - Api:</p>
              <p className="text-white/80" style={{ fontFamily: 'serif' }}>
                melambangkan tekad dan ambisi anda dalam mencapai tujuan
              </p>
            </div>
            <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-orange-400/30 flex-shrink-0">
              <img
                src={position1}
                alt="Duduk Bersila"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-blue-900/20 backdrop-blur-md rounded-lg border border-blue-500/30">
            <Droplets className="w-8 h-8 text-blue-400 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-white mb-2 text-lg" style={{ fontFamily: 'serif' }}>Total Journal - Air:</p>
              <p className="text-white/80" style={{ fontFamily: 'serif' }}>
                melambangkan totalitas anda melepaskan semua emosi negatif berserta ambisi negatif atas keinginan anda
              </p>
            </div>
            <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-400/30 flex-shrink-0">
              <img
                src={position3}
                alt="Bersandar di Kursi"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Combination Card */}
        <Card className="p-6 bg-blue-900/20 backdrop-blur-md border border-blue-500/30">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Flame className="w-8 h-8 text-orange-400" />
              <span className="text-2xl font-bold text-white" style={{ fontFamily: 'serif' }}>+</span>
              <Droplets className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'serif' }}>
              Dengan Menggabungkan Tekad yang serius dan Melepaskan Emosi Negatif
            </h3>
            <p className="text-white/80" style={{ fontFamily: 'serif' }}>
              Anda akan mudah mengukur pencapaian di kehidupan nyata setiap bulan.
            </p>
          </div>
        </Card>


        {/* Guidance Section */}
        <Card className="p-6 bg-blue-900/20 backdrop-blur-md border border-blue-500/30">
          <div className="space-y-4">
            <p className="text-white font-semibold text-lg" style={{ fontFamily: 'serif' }}>
              Jika Tujuan belum Tercapai:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                <p className="text-white/80 text-sm" style={{ fontFamily: 'serif' }}>
                  <span className="font-medium text-white">Cek Apakah anda sudah sering melepaskan Emosi negatif dan keinginan di Journal Spiritual?</span>
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                <p className="text-white/80 text-sm" style={{ fontFamily: 'serif' }}>
                  <span className="font-medium text-white">Cek apakah anda sudah sering mendengarkan total verse agar pikiran menjadi fokus dengan jernih mencapai Tujuan anda?</span>
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Conclusion Section */}
        <Card className="p-6 bg-blue-900/20 backdrop-blur-md border border-blue-500/30">
          <div className="text-center space-y-4">
            <p className="text-white/80 text-sm" style={{ fontFamily: 'serif' }}>
              Sering kali kita tidak bisa mengukur sudah sejauh mana usaha kita mencapai Tujuan Kita <span className="font-semibold text-white">-Harta, Tahta, Cinta-</span>
            </p>
            
            <p className="font-semibold text-white text-lg" style={{ fontFamily: 'serif' }}>
              Dengan Ekosistem ini anda akan memiliki visual nyata mengukur setiap langkah pencapaian anda di dunia nyata
            </p>
            
            <div className="pt-4">
              <p className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'serif' }}>
                Teruslah hidup dalam rasa syukur
              </p>
              <p className="text-lg text-white/80" style={{ fontFamily: 'serif' }}>
                eL Vision Group
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}