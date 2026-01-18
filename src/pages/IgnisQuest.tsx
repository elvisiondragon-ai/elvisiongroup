import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Flame, Zap, Sparkles, Crown, Home as HomeIcon } from "lucide-react";

interface IgnisQuestProps {
  onNavigate: (tab: string) => void;
}

export function IgnisQuest({ onNavigate }: IgnisQuestProps) {
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-red-900/90 via-orange-800/90 to-yellow-700/90 backdrop-blur-md border-b border-orange-500/30 shadow-lg shadow-orange-500/20">
        <div className="flex items-center gap-3 p-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate("home")}
            className="p-2 hover:bg-white/10 text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 shadow-lg shadow-orange-500/50">
              <Flame className="w-5 h-5 text-white animate-pulse" />
            </div>
            <h1 className="text-xl font-semibold font-exo text-white">Ignis Quest</h1>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/40 animate-pulse">
            <Flame className="w-16 h-16 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold font-exo bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-3">
              🔥 Ignis Quest 🔥
            </h2>
            <p className="text-xl font-semibold text-orange-600 mb-4">
              Panduan Mencapai Keinginanmu di Dunia Nyata
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Quest ini berisi langkah-langkah dan strategi untuk meraih <span className="text-yellow-600 font-semibold">harta</span>, 
              <span className="text-orange-600 font-semibold"> tahta</span>, dan <span className="text-red-600 font-semibold">cinta</span>, 
              membawamu dari impian ke pencapaian nyata.
            </p>
          </div>
        </div>

        {/* Description */}
        <Card className="p-6 bg-gradient-to-br from-orange-900/10 via-red-900/5 to-yellow-900/10 border-orange-500/20 shadow-lg shadow-orange-500/10">
          <h3 className="text-lg font-semibold font-exo bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-3">
            🔥 Tentang Ignis Quest 🔥
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Ignis Quest adalah perjalanan terstruktur untuk mengubah keinginan menjadi kenyataan. 
            Melalui tiga fase utama, kamu akan belajar memanfaatkan <span className="text-red-500 font-semibold">energi terdesak</span>, 
            <span className="text-orange-500 font-semibold"> menjaga fokus</span>, 
            dan <span className="text-yellow-500 font-semibold">mengarahkan tujuan hidup</span> dengan cara yang sehat dan efektif.
          </p>
        </Card>

        {/* Three Phases */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold font-exo text-center bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            🔥 Tiga Fase Ignis Quest 🔥
          </h3>
          
          {/* Fase 1 */}
          <Card className="p-6 bg-gradient-to-br from-red-900/20 via-red-800/15 to-red-700/10 border-red-500/30 shadow-lg shadow-red-500/10">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-500/50 flex-shrink-0">
                <Zap className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-3">
                  Fase 1 – Aktifkan Ignis Memory Keadaan Terdesak
                </h4>
                <p className="text-muted-foreground mb-4">
                  Sadarilah kondisi terdesak setiap hari. Keadaan ini adalah pemicu awal untuk bergerak. 
                  Fase ini bisa digabungkan dengan elite habit seperti berenang, olahraga lari, 
                  atau aktivitas fisik lainnya yang menyalakan kesadaran penuh.
                </p>
                <div className="text-sm text-muted-foreground italic">
                  💡 Tip: Kombinasikan dengan aktivitas fisik untuk hasil maksimal
                </div>
              </div>
            </div>
          </Card>

          {/* Fase 2 */}
          <Card className="p-6 bg-gradient-to-br from-orange-900/20 via-orange-800/15 to-orange-700/10 border-orange-500/30 shadow-lg shadow-orange-500/10">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-orange-600 to-orange-500 shadow-lg shadow-orange-500/50 flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-3">
                  Fase 2 – Karantina Energi dengan Audio
                </h4>
                <p className="text-muted-foreground mb-4">
                  Energi terdesak harus dijaga dan tidak boleh langsung digunakan. Jika dibiarkan, 
                  energi marah atau panik bisa merusak dan membuat pekerjaan sia-sia. 
                  Dengarkan audio Verse of eL Vision sampai hati tenang dan tubuh kembali berenergi positif.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onNavigate("audio-therapy")}
                  className="text-orange-500 border-orange-500 hover:bg-orange-500/10 shadow-lg hover:shadow-orange-500/20"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Akses Verse of eL Vision
                </Button>
              </div>
            </div>
          </Card>

          {/* Fase 3 */}
          <Card className="p-6 bg-gradient-to-br from-yellow-900/20 via-yellow-800/15 to-yellow-700/10 border-yellow-500/30 shadow-lg shadow-yellow-500/10">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-500 shadow-lg shadow-yellow-500/50 flex-shrink-0">
                <Crown className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-3">
                  Fase 3 – Arahkan & Lepaskan
                </h4>
                <p className="text-muted-foreground mb-4">
                  Setelah tenang, arahkan energimu ke tujuan yang diinginkan. Visualisasikan dengan jelas, 
                  lalu lepaskan visi itu dengan sikap pasrah. Kombinasi fokus dan penerimaan ini akan 
                  membuka jalan untuk hasil nyata.
                </p>
                <div className="text-sm text-muted-foreground italic">
                  🎯 Hasil: Rumah, mobil, dan kehidupan yang diimpikan
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="p-6 bg-gradient-to-br from-red-900/20 via-orange-900/15 to-yellow-900/20 border-orange-500/30 shadow-2xl shadow-orange-500/20">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold font-exo bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              🔥 Siap Memulai Perjalanan Ignis Quest? 🔥
            </h3>
            <p className="text-muted-foreground">
              Mulai dengan Fase 1 dan rasakan transformasi hidup yang luar biasa
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => onNavigate("meditation-sessions")}
                className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 hover:from-red-700 hover:via-orange-600 hover:to-yellow-600 text-white shadow-lg shadow-orange-500/30 transition-all duration-300"
              >
                <Zap className="w-4 h-4 mr-2" />
                Mulai Meditasi
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onNavigate("audio-therapy")}
                className="border-orange-500 text-orange-500 hover:bg-orange-500/10 shadow-lg hover:shadow-orange-500/20"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Akses Audio
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}