import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Play, Brain, Wallet, Coins, Target, Eye, Heart, Zap, Sun, Moon, Star, Crown } from 'lucide-react';
import { useState } from 'react';

interface FinanceProps {
  onNavigate?: (tab: string) => void;
}

export function Finance({ onNavigate }: FinanceProps) {
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [thumbnailGenerated, setThumbnailGenerated] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const videos = [
    {
      url: "https://www.youtube.com/embed/dPlA9jHzI0M", 
      title: "Arif - Mind Method for Recovery"
    },
    {
      url: "https://www.youtube.com/embed/iADevAyT7us",
      title: "Arif - The Secret to Cellular Recovery"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <DollarSign className="w-6 h-6 text-green-400" />
            <CardTitle className="text-xl text-green-100">
              Keuangan & Keadaan Meditatif
            </CardTitle>
          </div>
          <CardDescription className="text-green-300 text-sm leading-relaxed">
            Mengapa ketenangan pikiran dalam meditasi adalah kunci untuk menciptakan abundance dan kemakmuran finansial yang berkelanjutan
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Introduction */}
      <Card className="p-6">
        <div className="prose prose-sm max-w-none text-foreground">
          <p className="text-lg font-medium text-green-400 mb-4">
            💰 Tahukah Anda bahwa keadaan meditatif yang dalam adalah fondasi untuk menciptakan kemakmuran finansial yang berkelanjutan?
          </p>
          <p className="mb-4 leading-relaxed">
            Ketika pikiran berada dalam keadaan tenang dan terfokus, kita membuka akses ke intuisi finansial yang tajam, kejelasan dalam pengambilan keputusan, dan energi abundan yang menarik peluang. Inilah mengapa memahami hubungan antara meditasi dan keuangan sangat penting dalam perjalanan menuju kemakmuran Anda.
          </p>
        </div>
      </Card>

      {/* The Science Behind It */}
      <Card className="p-6 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-blue-300">Sains di Balik Koneksi Meditasi-Keuangan</h3>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-blue-200">
          <div className="flex items-start gap-3">
            <Zap className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
            <div>
              <strong>Kejelasan Mental:</strong> Meditasi mengurangi noise mental, memungkinkan pengambilan keputusan finansial yang lebih jernih dan strategis.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Eye className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
            <div>
              <strong>Intuisi Finansial:</strong> Keadaan meditatif membuka akses ke wisdom bawah sadar yang dapat mendeteksi peluang dan risiko finansial.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Heart className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
            <div>
              <strong>Energi Abundan:</strong> Vibrasi tenang dan positif dari meditasi menarik synchronicity dan peluang finansial yang tidak terduga.
            </div>
          </div>
        </div>
      </Card>

      {/* Video Section - Finance Meditation */}
      <div className="space-y-6">
        {videos.map((video, index) => (
          <div key={index} className="flex justify-center">
            <div style={{ width: '100%', maxWidth: '300px' }}>
              <h3 className="text-lg font-semibold text-emerald-400 mb-4 text-center">
                {video.title}
              </h3>
              <div className="relative aspect-[9/16] w-full rounded-lg overflow-hidden shadow-xl border border-emerald-500/20">
                <iframe
                  src={video.url}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Factors Affecting Financial Meditation */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Faktor-Faktor yang Mempengaruhi Meditasi Finansial
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Mindset Practices */}
          <div className="space-y-3">
            <h4 className="font-medium text-green-400 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Praktik Mindset
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <strong>Gratitude Practice:</strong> Bersyukur untuk abundance yang sudah ada
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <strong>Visualization:</strong> Memvisualisasikan tujuan finansial dengan jelas
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <strong>Affirmation:</strong> Menegaskan kelayakan untuk menerima kemakmuran
              </li>
            </ul>
          </div>

          {/* Energy Practices */}
          <div className="space-y-3">
            <h4 className="font-medium text-blue-400 flex items-center gap-2">
              <Coins className="w-4 h-4" />
              Praktik Energi
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <strong>Morning Ritual:</strong> Memulai hari dengan meditasi abundance
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <strong>Decision Meditation:</strong> Bermeditasi sebelum keputusan finansial besar
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <strong>Energy Cleansing:</strong> Membersihkan energi negatif terhadap uang
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Natural Ways to Improve */}
      <Card className="p-6 bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border border-yellow-500/30">
        <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
          <Sun className="w-5 h-5" />
          Cara Alami Meningkatkan Kemakmuran Melalui Meditasi
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-yellow-300 font-medium">
              <Moon className="w-4 h-4" />
              Ketenangan Batin
            </div>
            <p className="text-yellow-200 text-xs leading-relaxed">
              Kultivasi ketenangan dalam untuk mendengar guidance internal tentang peluang finansial.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-yellow-300 font-medium">
              <Eye className="w-4 h-4" />
              Clarity Vision
            </div>
            <p className="text-yellow-200 text-xs leading-relaxed">
              Meditasi untuk kejelasan visi finansial jangka panjang dan strategi pencapaian.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-yellow-300 font-medium">
              <Wallet className="w-4 h-4" />
              Abundance Flow
            </div>
            <p className="text-yellow-200 text-xs leading-relaxed">
              Membuka channel energi untuk menerima abundance dari berbagai sumber.
            </p>
          </div>
        </div>
      </Card>

      {/* Personal Experience & Benefits */}
      <Card className="p-6 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/30">
        <h3 className="text-lg font-semibold text-indigo-400 mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5" />
          Pengalaman Nyata: Dampak pada Keuangan
        </h3>
        <div className="space-y-4 text-sm leading-relaxed text-indigo-200">
          <p>
            <strong className="text-indigo-300">Sebelum meditasi finansial:</strong> Keputusan impulsif, stress terhadap uang, sulit melihat peluang, dan pola pikir scarcity yang menghalangi abundance.
          </p>
          <p>
            <strong className="text-indigo-300">Setelah meditasi finansial:</strong> Keputusan finansial lebih tenang dan strategis, intuisi terhadap peluang meningkat, stress berkurang, dan pola pikir abundance yang menarik kemakmuran.
          </p>
          <div className="bg-indigo-800/20 p-4 rounded-lg border border-indigo-500/30 mt-4">
            <p className="text-indigo-100 italic">
              "Ketika pikiran tenang, uang mengalir seperti sungai yang jernih. 
              Abundance bukan tentang mengejar, tetapi tentang menerima dengan hati yang terbuka."
            </p>
          </div>
        </div>
      </Card>

      {/* Call to Action */}
      <Card className="p-6 bg-gradient-to-r from-green-900/20 to-teal-900/20 border border-green-500/30">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="w-6 h-6 text-teal-400" />
            <h3 className="text-xl font-semibold text-teal-300">
              Mulai Perjalanan Kemakmuran Anda
            </h3>
          </div>
          <p className="text-teal-200 leading-relaxed max-w-2xl mx-auto">
            Sekarang setelah Anda memahami hubungan mendalam antara meditasi dan keuangan, 
            saatnya untuk mulai mempraktikkan meditasi yang dapat mengoptimalkan energi abundance Anda. 
            Catat setiap insight dan synchronicity yang muncul.
          </p>
          <Button
            onClick={() => onNavigate && onNavigate('audio-therapy')}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium px-4 py-3 text-sm sm:text-base"
            size="lg"
          >
            <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Verse 4 - Prosperity Stream</span>
          </Button>
          <p className="text-xs text-teal-300/80">
            Gunakan Verse 4 - Prosperity Stream untuk mencapai keadaan meditatif yang membuka energi abundance dan kemakmuran
          </p>
        </div>
      </Card>

      {/* Educational Info */}
      <Card className="p-4 bg-gradient-to-r from-emerald-900/20 to-green-900/20 border border-emerald-500/30">
        <div className="text-sm text-emerald-300 leading-relaxed">
          <strong>💰 Koneksi Meditasi & Keuangan:</strong> Keadaan meditatif yang tenang 
          meningkatkan kejelasan mental, membuka intuisi finansial, dan menciptakan energi 
          abundan yang menarik peluang. Praktik gratitude, visualisasi, dan decision meditation 
          secara signifikan mempengaruhi kemampuan menciptakan dan mempertahankan kemakmuran 
          finansial yang berkelanjutan.
        </div>
      </Card>

    </div>
  );
}