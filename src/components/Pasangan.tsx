import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Users, Brain, Target, Sparkles, Wind, Moon, Coffee, MessageCircle, Eye, Shield } from 'lucide-react';

interface PasanganProps {
  onNavigate?: (tab: string) => void;
}

export function Pasangan({ onNavigate }: PasanganProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-pink-900/20 to-rose-900/20 border border-pink-500/30">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-6 h-6 text-pink-400" />
            <CardTitle className="text-xl text-pink-100">
              Pasangan & Ketenangan Diri
            </CardTitle>
          </div>
          <CardDescription className="text-pink-300 text-sm leading-relaxed">
            Bagaimana relevansi pasangan dengan diri kita dan ketenangan kita, serta bagaimana meditasi menjadi solusi
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Introduction */}
      <Card className="p-6">
        <div className="prose prose-sm max-w-none text-foreground">
          <p className="text-lg font-medium text-pink-400 mb-4">
            💕 Tahukah Anda bahwa hubungan dengan pasangan adalah cerminan dari hubungan dengan diri sendiri?
          </p>
          <p className="mb-4 leading-relaxed">
            Seringkali pasangan mengikuti prasangka perasaan kita. Jika kita berpikir semakin buruk tentang hubungan, 
            maka itulah yang akan terwujud, demikian pula sebaliknya. Ketenangan diri melalui meditasi adalah kunci 
            untuk menciptakan harmoni dalam hubungan yang bermakna dan berkelanjutan.
          </p>
        </div>
      </Card>

      {/* The Mind-Relationship Connection */}
      <Card className="p-6 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/30">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-purple-300">Koneksi Pikiran & Hubungan</h3>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-purple-200">
          <div className="flex items-start gap-3">
            <Eye className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <strong>Proyeksi Diri:</strong> Apa yang kita lihat dalam pasangan seringkali adalah cerminan dari kondisi internal kita. Ketenangan dalam diri menciptakan persepsi yang lebih jernih.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Wind className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
            <div>
              <strong>Energi Vibrasi:</strong> Keadaan mental kita memancarkan energi yang ditangkap oleh pasangan. Pikiran tenang menghasilkan vibrasi harmonis.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MessageCircle className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
            <div>
              <strong>Komunikasi Sadar:</strong> Meditasi membantu kita berkomunikasi dari tempat yang tenang, bukan dari reaktivitas emosional.
            </div>
          </div>
        </div>
      </Card>

      {/* Breaking Negative Cycles */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-orange-400 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Memutus Siklus Prasangka Negatif
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Negative Patterns */}
          <div className="space-y-3">
            <h4 className="font-medium text-red-400 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Pola Destruktif
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                <strong>Prasangka Negatif:</strong> "Semua pria/wanita sama saja"
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                <strong>Self-Fulfilling Prophecy:</strong> Ekspektasi buruk menciptakan realitas buruk
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                <strong>Reaktivitas:</strong> Merespons dari tempat emosi, bukan ketenangan
              </li>
            </ul>
          </div>

          {/* Solution Through Meditation */}
          <div className="space-y-3">
            <h4 className="font-medium text-green-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Solusi Meditatif
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <strong>Kesadaran Diri:</strong> Mengenali pola pikir otomatis
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <strong>Observasi Tanpa Judgment:</strong> Melihat tanpa menghakimi
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <strong>Respons vs Reaksi:</strong> Memilih dengan sadar, bukan otomatis
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Facts About Negative Beliefs */}
      <Card className="p-6 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30">
        <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Fakta: Kekuatan Belief System
        </h3>
        <div className="space-y-4 text-sm leading-relaxed text-yellow-200">
          <div className="bg-yellow-800/20 p-4 rounded-lg border border-yellow-500/30">
            <p className="font-medium text-yellow-300 mb-2">🔍 Fakta Mengejutkan:</p>
            <p>
              Orang yang sering mengatakan "semua pria brengsek" atau "semua wanita brengsek" 
              hampir pasti mendapatkan sesuai dugaan mereka. Ini adalah loop yang harus diakhiri, 
              tapi tidak cukup dengan ucapan - harus dalam keadaan meditatif super tenang.
            </p>
          </div>
          <div className="space-y-2">
            <p><strong className="text-yellow-300">Mengapa ini terjadi:</strong></p>
            <ul className="space-y-1 text-xs pl-4">
              <li>• Belief menciptakan filter persepsi</li>
              <li>• Kita menarik energi yang sesuai dengan vibrasi internal</li>
              <li>• Konfirmasi bias membuat kita hanya melihat yang negatif</li>
              <li>• Energi defensif menciptakan konflik</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Meditation as Solution */}
      <Card className="p-6 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30">
        <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
          <Moon className="w-5 h-5" />
          Meditasi: Solusi untuk Ketenangan Super
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-300 font-medium">
              <Brain className="w-4 h-4" />
              Kejernihan Mental
            </div>
            <p className="text-blue-200 text-xs leading-relaxed">
              Meditasi membersihkan filter negatif dalam pikiran, memungkinkan kita melihat pasangan dengan mata yang jernih.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-300 font-medium">
              <Heart className="w-4 h-4" />
              Cinta Diri
            </div>
            <p className="text-blue-200 text-xs leading-relaxed">
              Ketika kita mencintai diri sendiri melalui praktik yang tenang, kita tidak lagi memproyeksikan kekurangan pada pasangan.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-300 font-medium">
              <Users className="w-4 h-4" />
              Harmoni Relasi
            </div>
            <p className="text-blue-200 text-xs leading-relaxed">
              Ketenangan internal menciptakan ruang untuk hubungan yang otentik dan saling mendukung.
            </p>
          </div>
        </div>
      </Card>

      {/* Testimonial Section */}
      <Card className="p-6 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30">
        <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Dengar apa kata Client kami
        </h3>
        <div className="text-center space-y-4">
          <div className="mx-auto max-w-sm">
            <img
              src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_pelakor.jpeg"
              alt="Testimoni Client tentang Pasangan"
              className="w-full object-cover rounded-lg border border-green-500/30"
              style={{ aspectRatio: '9/16' }}
            />
          </div>
          <p className="text-green-200 text-sm italic">
            "Melalui praktik meditasi yang konsisten, saya belajar bahwa masalah dalam hubungan 
            sebenarnya adalah cerminan dari kegelisahan dalam diri. Ketika saya tenang, 
            pasangan saya pun merespons dengan energi yang sama."
          </p>
        </div>
      </Card>

      {/* Call to Action */}
      <Card className="p-6 bg-gradient-to-r from-pink-900/20 to-purple-900/20 border border-pink-500/30">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-semibold text-purple-300">
              Mulai Transformasi Hubungan Anda
            </h3>
          </div>
          <p className="text-purple-200 leading-relaxed max-w-2xl mx-auto">
            Saatnya memutus siklus prasangka negatif dan menciptakan hubungan yang harmonis. 
            Mulailah dengan meditasi untuk mencapai ketenangan super yang akan mentransformasi 
            cara Anda melihat dan berinteraksi dengan pasangan.
          </p>
          <Button
            onClick={() => onNavigate && onNavigate('audio-therapy')}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium px-4 py-3 text-sm sm:text-base"
            size="lg"
          >
            <Heart className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Verse 8 - Love Magnet</span>
          </Button>
          <p className="text-xs text-purple-300/80">
            Gunakan Verse of eL Vision untuk mencapai keadaan meditatif super tenang yang akan mengubah persepsi Anda tentang hubungan
          </p>
        </div>
      </Card>

      {/* Educational Info */}
      <Card className="p-4 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/30">
        <div className="text-sm text-indigo-300 leading-relaxed">
          <strong>💕 Koneksi Pasangan & Ketenangan Diri:</strong> Hubungan dengan pasangan adalah 
          cerminan dari hubungan dengan diri sendiri. Prasangka dan belief negatif menciptakan 
          realitas yang sesuai. Meditasi dalam keadaan super tenang adalah satu-satunya cara 
          untuk memutus loop destruktif ini dan menciptakan harmoni sejati dalam hubungan.
        </div>
      </Card>
    </div>
  );
}