import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smile, Frown, Zap, Brain, Heart, Sparkles, Target, Flower, Star, Sun, Play } from 'lucide-react';
import { useState } from 'react';

interface KecantikanFisikProps {
  onNavigate?: (tab: string) => void;
}

export function KecantikanFisik({ onNavigate }: KecantikanFisikProps) {
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [thumbnailGenerated, setThumbnailGenerated] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-rose-900/20 to-amber-900/20 border border-rose-500/30 rounded-3xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Smile className="w-6 h-6 text-rose-400" />
            <CardTitle className="text-xl text-rose-100">
              Kecantikan Fisik Sejati
            </CardTitle>
          </div>
          <CardDescription className="text-amber-200 text-sm leading-relaxed">
            Mengungkap rahasia kecantikan yang sesungguhnya - dari dalam ke luar
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Introduction */}
      <Card className="p-6 rounded-3xl">
        <div className="prose prose-sm max-w-none text-foreground">
          <p className="text-lg font-medium text-rose-400 mb-4">
            ✨ Kecantikan sejati tidak hanya terpancar dari luar, namun berasal dari kesehatan mental dan spiritual yang optimal
          </p>
          <p className="mb-4 leading-relaxed">
            Faktanya, sebagian besar kecantikan yang menawan—baik pada pria maupun wanita—bersumber dari kondisi mental yang sehat dan seimbang. Ketika pikiran tenang, jiwa damai, dan energi positif mengalir, hal ini akan secara alami terpancar melalui penampilan fisik yang memikat dan auranya yang menenangkan.
          </p>
        </div>
      </Card>

      {/* The Ancient Wisdom */}
      <Card className="p-6 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/30 rounded-3xl">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-purple-300">Kebijaksanaan Kuno tentang Kecantikan Dalam</h3>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-purple-200">
          <p className="italic text-purple-300">
            "Kecantikan yang sejati adalah cahaya yang bersinar dari dalam jiwa, 
            bukan hanya riasan yang menghiasi wajah." - Rumi
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
              <div>
                <strong>Filsafat Timur:</strong> "Wajah adalah cermin jiwa. Ketika hati bersih dan pikiran tenang, wajah akan memancarkan cahaya kebijaksanaan."
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Heart className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
              <div>
                <strong>Tradisi Kuno:</strong> "Kecantikan lahir dari keseimbangan energi dalam tubuh - ketika chi atau prana mengalir dengan harmonis."
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sun className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
              <div>
                <strong>Warisan Leluhur:</strong> "Orang yang cantik adalah mereka yang menguasai seni mengelola emosi dan stres dalam hidup."
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stress and Beauty Connection */}
      <Card className="p-6 rounded-3xl">
        <h3 className="text-lg font-semibold text-rose-400 mb-4 flex items-center gap-2">
          <Frown className="w-5 h-5" />
          Bagaimana Stres Merusak Kecantikan
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Physical Effects */}
          <div className="space-y-3">
            <h4 className="font-medium text-pink-400 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Efek Fisik Stres
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                <strong>Kerutan Dini:</strong> Stres meningkatkan kortisol yang merusak kolagen
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                <strong>Wajah Tegang:</strong> Otot wajah menegang membentuk ekspresi keras
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                <strong>Kulit Kusam:</strong> Sirkulasi darah terganggu, nutrisi kulit berkurang
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                <strong>Mata Lelah:</strong> Kurang tidur membuat mata sembab dan tidak bercahaya
              </li>
            </ul>
          </div>

          {/* Internal Effects */}
          <div className="space-y-3">
            <h4 className="font-medium text-pink-300 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Kerusakan Organ Dalam
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-pink-300 rounded-full"></span>
                <strong>Sistem Pencernaan:</strong> Gangguan pencernaan menyebabkan jerawat dan kulit bermasalah
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-pink-300 rounded-full"></span>
                <strong>Hormonal Imbalance:</strong> Ketidakseimbangan hormon mempengaruhi kualitas kulit
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-pink-300 rounded-full"></span>
                <strong>Sistem Imun Lemah:</strong> Mudah sakit, wajah pucat dan tidak segar
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-pink-300 rounded-full"></span>
                <strong>Detoksifikasi Terganggu:</strong> Racun terakumulasi, kulit jadi bermasalah
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Positive Beauty Transformation */}
      <Card className="p-6 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-3xl">
        <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
          <Smile className="w-5 h-5" />
          Transformasi Kecantikan Melalui Kesehatan Mental
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-300 font-medium">
              <Sparkles className="w-4 h-4" />
              Stress Management
            </div>
            <p className="text-green-200 text-xs leading-relaxed">
              Menguasai teknik relaksasi dan meditasi membuat otot wajah rileks, ekspresi lebih lembut dan menenangkan.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-300 font-medium">
              <Heart className="w-4 h-4" />
              Emotional Balance
            </div>
            <p className="text-green-200 text-xs leading-relaxed">
              Keseimbangan emosi menciptakan aura positif yang terpancar dari mata dan senyuman yang tulus.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-300 font-medium">
              <Brain className="w-4 h-4" />
              Mental Clarity
            </div>
            <p className="text-green-200 text-xs leading-relaxed">
              Pikiran yang jernih tercermin dari mata yang berbinar dan kepercayaan diri yang terpancar alami.
            </p>
          </div>
        </div>
      </Card>

      {/* Beauty Secrets of Confident People */}
      <Card className="p-6 bg-gradient-to-r from-indigo-900/20 to-blue-900/20 border border-indigo-500/30 rounded-3xl">
        <h3 className="text-lg font-semibold text-indigo-400 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Rahasia Kecantikan Orang-Orang Menawan
        </h3>
        <div className="space-y-4 text-sm leading-relaxed text-indigo-200">
          <p>
            <strong className="text-indigo-300">Penelitian menunjukkan:</strong> Orang yang dianggap cantik atau tampan memiliki tingkat stress management yang tinggi. Mereka tidak menghindari masalah, tetapi memiliki kemampuan superior dalam mengelola tekanan hidup.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-indigo-800/20 p-4 rounded-lg border border-indigo-500/30">
              <h4 className="font-medium text-indigo-300 mb-2">Ciri-ciri Khas:</h4>
              <ul className="space-y-1 text-xs">
                <li>• Wajah rileks dan tidak tegang</li>
                <li>• Mata berbinar dengan energy positif</li>
                <li>• Senyuman yang hangat dan tulus</li>
                <li>• Postur tubuh yang percaya diri</li>
                <li>• Aura yang menenangkan dan menarik</li>
              </ul>
            </div>
            <div className="bg-indigo-800/20 p-4 rounded-lg border border-indigo-500/30">
              <h4 className="font-medium text-indigo-300 mb-2">Kebiasaan Mereka:</h4>
              <ul className="space-y-1 text-xs">
                <li>• Meditasi atau mindfulness rutin</li>
                <li>• Olahraga teratur untuk endorphin</li>
                <li>• Pola tidur yang konsisten</li>
                <li>• Nutrisi seimbang untuk kesehatan optimal</li>
                <li>• Praktik spiritual untuk ketenangan jiwa</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Real Life Examples */}
      <Card className="p-6 bg-gradient-to-r from-rose-900/20 to-pink-900/20 border border-rose-500/30 rounded-3xl">
        <h3 className="text-lg font-semibold text-rose-400 mb-4 flex items-center gap-2">
          <Flower className="w-5 h-5" />
          Pengalaman Nyata: Transformasi Kecantikan Dari Dalam
        </h3>
        <div className="space-y-4 text-sm leading-relaxed text-rose-200">
          <div className="bg-rose-800/20 p-4 rounded-lg border border-rose-500/30">
            <p className="mb-3">
              <strong className="text-rose-300">Sebelum praktik spiritual dan stress management:</strong>
            </p>
            <ul className="text-xs space-y-1 mb-4">
              <li>• Wajah terlihat lelah dan kusam meski menggunakan skincare mahal</li>
              <li>• Kerutan dini muncul karena sering mengerutkan dahi saat stress</li>
              <li>• Mata terlihat tidak bercahaya dan sering sembab</li>
              <li>• Kulit berjerawat karena hormon tidak seimbang</li>
              <li>• Aura negatif yang membuat orang tidak nyaman</li>
            </ul>
          </div>

          <div className="bg-rose-800/20 p-4 rounded-lg border border-rose-500/30">
            <p className="mb-3">
              <strong className="text-rose-300">Setelah praktik rutin Verse of eL Vision dan stress management:</strong>
            </p>
            <ul className="text-xs space-y-1 mb-4">
              <li>• Wajah tampak segar dan bercahaya secara alami</li>
              <li>• Ekspresi wajah lebih rileks dan menenangkan</li>
              <li>• Mata berbinar dengan energy positif yang menarik</li>
              <li>• Kulit lebih sehat karena detoksifikasi optimal</li>
              <li>• Aura positif yang membuat orang merasa nyaman dan tertarik</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-rose-700/20 to-pink-700/20 p-4 rounded-lg border border-rose-400/40 mt-4">
            <p className="text-rose-100 italic text-center">
              "Kecantikan sejati bukan tentang kesempurnaan fisik, tetapi tentang cahaya jiwa yang bersinar melalui mata, 
              senyuman, dan energy positif yang terpancar dari dalam. Inilah mengapa orang yang menguasai stress management 
              selalu terlihat lebih menarik dan menawan."
            </p>
          </div>
        </div>
      </Card>

      {/* Video Section - Beauty Transformation */}
      <Card className="p-6 bg-gradient-to-r from-amber-900/20 to-rose-900/20 border border-amber-500/30 rounded-3xl">
        <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
          <Play className="w-5 h-5" />
          Video: Rahasia Kecantikan Dari Dalam
        </h3>
        <div className="relative rounded-lg overflow-hidden">
          <video 
            className="w-full rounded-lg"
            controls={!showPlayButton}
            preload="metadata"
            muted
            crossOrigin="anonymous"
            onPlay={() => setShowPlayButton(false)}
            onCanPlay={(e) => {
              if (!thumbnailGenerated) {
                const video = e.target as HTMLVideoElement;
                video.currentTime = 0;
                setThumbnailGenerated(true);
              }
            }}
            onSeeked={(e) => {
              const video = e.target as HTMLVideoElement;
              if (thumbnailGenerated && video.currentTime >= 0) {
                video.pause();
              }
            }}
            onError={(e) => {
              console.error('Video error:', e);
              setShowPlayButton(true);
            }}
            style={{ aspectRatio: '9/16', maxHeight: '600px' }}
          >
            <source src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/rus.mp4" type="video/mp4" />
            Browser Anda tidak mendukung video HTML5.
          </video>
          
          {/* Overlay Play Button */}
          {showPlayButton && (
            <div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer group bg-gradient-to-br from-rose-900/20 to-amber-900/20"
              onClick={(e) => {
                const video = e.currentTarget.previousElementSibling as HTMLVideoElement;
                video.play();
                setShowPlayButton(false);
              }}
            >
              <div className="bg-gradient-to-r from-rose-600 to-amber-600 rounded-full p-6 group-hover:from-rose-500 group-hover:to-amber-500 transition-all duration-300 shadow-2xl">
                <Play className="w-16 h-16 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" />
              </div>
            </div>
          )}
        </div>
        <p className="text-amber-200 text-sm mt-4 text-center">
          Pelajari lebih dalam tentang bagaimana kecantikan sejati terpancar dari kesehatan mental dan spiritual
        </p>
      </Card>

      {/* Call to Action */}
      <Card className="p-6 bg-gradient-to-r from-rose-900/20 to-amber-900/20 border border-rose-500/30">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-semibold text-rose-300">
              Mulai Perjalanan Kecantikan Sejati Anda
            </h3>
          </div>
          <p className="text-amber-200 leading-relaxed max-w-2xl mx-auto">
            Kecantikan yang sesungguhnya dimulai dari dalam. Melalui praktik spiritual yang konsisten dengan 
            Verse of eL Vision, Anda tidak hanya akan merasakan ketenangan batin, tetapi juga transformasi 
            penampilan fisik yang menakjubkan. Mari mulai perjalanan menuju kecantikan sejati yang terpancar dari jiwa.
          </p>
          <Button
            onClick={() => onNavigate && onNavigate('audio-therapy')}
            className="w-full bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-medium px-4 py-3 text-sm sm:text-base"
            size="lg"
          >
            <Sparkles className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Tenangkan diri anda di Verse of eL Vision</span>
          </Button>
          <p className="text-xs text-amber-300/80">
            Rasakan transformasi kecantikan dari dalam melalui praktik spiritual yang terbukti
          </p>
        </div>
      </Card>

      {/* Educational Info */}
      <Card className="p-4 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-3xl">
        <div className="text-sm text-blue-300 leading-relaxed">
          <strong>💎 Kecantikan & Spiritualitas:</strong> Ilmu pengetahuan modern membuktikan bahwa 
          praktik meditasi dan spiritual secara signifikan mempengaruhi kesehatan kulit, ekspresi wajah, 
          dan aura seseorang. Stress management yang baik tidak hanya membuat hidup lebih bahagia, 
          tetapi juga membuat penampilan fisik menjadi lebih menarik dan menawan secara alami.
        </div>
      </Card>
    </div>
  );
}