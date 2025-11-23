import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Droplets, Activity, Brain, Coffee, Clock, Moon, Sun, Wind, Zap, Target } from 'lucide-react';

interface BloodCirculationProps {
  onNavigate?: (tab: string) => void;
}

export function BloodCirculation({ onNavigate }: BloodCirculationProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-red-900/20 to-pink-900/20 border border-red-500/30">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-6 h-6 text-red-400" />
            <CardTitle className="text-xl text-red-100">
              Peredaran Darah & Keadaan Meditatif
            </CardTitle>
          </div>
          <CardDescription className="text-red-300 text-sm leading-relaxed">
            Mengapa aliran darah yang optimal adalah kunci untuk mencapai ketenangan pikiran yang mendalam
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Introduction */}
      <Card className="p-6">
        <div className="prose prose-sm max-w-none text-foreground">
          <p className="text-lg font-medium text-red-400 mb-4">
            🧠 Tahukah Anda bahwa peredaran darah yang optimal adalah fondasi untuk mencapai keadaan meditatif yang ideal?
          </p>
          <p className="mb-4 leading-relaxed">
            Ketika darah mengalir dengan lancar ke seluruh tubuh, terutama ke otak, kita menciptakan kondisi biologis yang sempurna untuk ketenangan mental, fokus yang tajam, dan konsentrasi yang mendalam. Inilah mengapa memahami dan mengoptimalkan peredaran darah sangat penting dalam perjalanan spiritual dan meditasi Anda.
          </p>
        </div>
      </Card>

      {/* The Science Behind It */}
      <Card className="p-6 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-blue-300">Sains di Balik Koneksi Darah-Meditasi</h3>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-blue-200">
          <div className="flex items-start gap-3">
            <Zap className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
            <div>
              <strong>Oksigenasi Otak:</strong> Aliran darah yang lancar membawa oksigen segar ke otak, meningkatkan kejernihan mental dan kemudahan berkonsentrasi.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Heart className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
            <div>
              <strong>Pengurangan Kortisol:</strong> Sirkulasi yang baik membantu mengurangi hormon stres, menciptakan kondisi internal yang tenang.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Wind className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
            <div>
              <strong>Neurotransmitter Balance:</strong> Peredaran darah optimal mendukung produksi serotonin dan dopamin yang diperlukan untuk kebahagiaan dan ketenangan.
            </div>
          </div>
        </div>
      </Card>

      {/* Factors Affecting Blood Circulation */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Faktor-Faktor yang Mempengaruhi Peredaran Darah
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Physical Activities */}
          <div className="space-y-3">
            <h4 className="font-medium text-green-400 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Aktivitas Fisik
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <strong>Yoga:</strong> Meningkatkan fleksibilitas pembuluh darah
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <strong>Jalan Kaki:</strong> Aktivitas kardio ringan yang ideal
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <strong>Pernapasan Dalam:</strong> Mengoksigenasi darah secara optimal
              </li>
            </ul>
          </div>

          {/* Lifestyle Factors */}
          <div className="space-y-3">
            <h4 className="font-medium text-blue-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Gaya Hidup
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <strong>Tidur Berkualitas:</strong> Regenerasi pembuluh darah
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <strong>Hidrasi:</strong> Menjaga viskositas darah optimal
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <strong>Puasa Intermittent:</strong> Meningkatkan autophagy vascular
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Natural Ways to Improve */}
      <Card className="p-6 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30">
        <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
          <Sun className="w-5 h-5" />
          Cara Alami Meningkatkan Peredaran Darah
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-300 font-medium">
              <Droplets className="w-4 h-4" />
              Hidrasi
            </div>
            <p className="text-green-200 text-xs leading-relaxed">
              Minum air hangat di pagi hari dan jaga asupan air sepanjang hari untuk menjaga fluiditas darah.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-300 font-medium">
              <Moon className="w-4 h-4" />
              Tidur Berkualitas
            </div>
            <p className="text-green-200 text-xs leading-relaxed">
              Tidur 7-8 jam memungkinkan regenerasi pembuluh darah dan optimasi sirkulasi.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-300 font-medium">
              <Coffee className="w-4 h-4" />
              Nutrisi Tepat
            </div>
            <p className="text-green-200 text-xs leading-relaxed">
              Makanan kaya omega-3, antioksidan, dan menghindari makanan yang menyebabkan inflamasi.
            </p>
          </div>
        </div>
      </Card>

      {/* Personal Experience & Benefits */}
      <Card className="p-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30">
        <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Pengalaman Nyata: Dampak pada Meditasi
        </h3>
        <div className="space-y-4 text-sm leading-relaxed text-purple-200">
          <p>
            <strong className="text-purple-300">Sebelum optimasi peredaran darah:</strong> Sulit fokus, pikiran mudah terdistraksi, tubuh terasa kaku saat meditasi, dan butuh waktu lama untuk mencapai ketenangan.
          </p>
          <p>
            <strong className="text-purple-300">Setelah optimasi peredaran darah:</strong> Masuk ke keadaan meditatif lebih cepat, konsentrasi lebih stabil, tubuh terasa ringan dan rileks, serta mampu mempertahankan fokus lebih lama.
          </p>
          <div className="bg-purple-800/20 p-4 rounded-lg border border-purple-500/30 mt-4">
            <p className="text-purple-100 italic">
              "Ketika aliran darah optimal, pikiran menjadi jernih seperti air yang tenang. 
              Inilah kunci untuk mencapai keadaan meditatif yang mendalam dan transformatif."
            </p>
          </div>
        </div>
      </Card>

      {/* Call to Action */}
      <Card className="p-6 bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="w-6 h-6 text-orange-400" />
            <h3 className="text-xl font-semibold text-orange-300">
              Mulai Optimasi Peredaran Darah Anda
            </h3>
          </div>
          <p className="text-orange-200 leading-relaxed max-w-2xl mx-auto">
            Sekarang setelah Anda memahami pentingnya peredaran darah untuk meditasi, 
            saatnya untuk mulai mempraktikkan aktivitas yang dapat mengoptimalkan aliran darah Anda. 
            Catat setiap aktivitas dan rasakan perbedaannya dalam kemudahan bermeditasi.
          </p>
          <Button
            onClick={() => onNavigate && onNavigate('elite-habit')}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium px-4 py-3 text-sm sm:text-base"
            size="lg"
          >
            <Activity className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Mulai Catat Aktivitas Elite Habit</span>
          </Button>
          <Button
            onClick={() => window.open('https://app.fitfactorherbal.com', '_blank')}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium px-4 py-3 text-sm sm:text-base mt-2" // Added mt-2 for spacing
            size="lg"
          >
            <Zap className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Beli FitFactor</span>
          </Button>
          <p className="text-xs text-orange-300/80">
            Dalam Elite Habit, Anda dapat mencatat aktivitas dan perasaan setelah melakukan aktivitas untuk optimasi peredaran darah
          </p>
        </div>
      </Card>

      {/* Educational Info */}
      <Card className="p-4 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30">
        <div className="text-sm text-blue-300 leading-relaxed">
          <strong>🧠 Koneksi Peredaran Darah & Meditasi:</strong> Aliran darah yang optimal 
          meningkatkan oksigenasi otak, menurunkan kortisol, dan memfasilitasi produksi 
          neurotransmitter yang mendukung ketenangan. Aktivitas seperti yoga, jalan kaki, 
          hidrasi yang baik, dan pola tidur teratur secara signifikan mempengaruhi kemudahan 
          mencapai dan mempertahankan keadaan meditatif yang mendalam.
        </div>
      </Card>
    </div>
  );
}