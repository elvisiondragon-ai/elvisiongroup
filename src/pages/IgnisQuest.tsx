import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Angry, Headphones, Home as HomeIcon } from "lucide-react";

interface IgnisQuestProps {
  onNavigate: (tab: string) => void;
}

export function IgnisQuest({ onNavigate }: IgnisQuestProps) {
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate("home")}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-orange-500/20 text-orange-500">
              <Target className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold font-orbitron">Ignis Quest</h1>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
            <img 
              src="/lovable-uploads/logo-ignis.gif" 
              alt="Ignis Quest Logo" 
              className="w-16 h-16 object-contain"
              onError={(e) => {
                // Fallback to icon if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.removeAttribute('style');
              }}
            />
            <Target className="w-12 h-12 text-white" style={{ display: 'none' }} />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-orbitron text-foreground mb-2">
              Ignis Quest
            </h2>
            <p className="text-lg font-medium text-muted-foreground mb-4">
              Panduan Mencapai Keinginanmu di Dunia Nyata
            </p>
            <p className="text-muted-foreground">
              Quest ini berisi langkah-langkah dan strategi untuk meraih harta, tahta, dan cinta, 
              membawamu dari impian ke pencapaian nyata.
            </p>
          </div>
        </div>

        {/* Description */}
        <Card className="p-6 bg-gradient-secondary border-border">
          <h3 className="text-lg font-semibold font-orbitron text-foreground mb-3">
            Tentang Ignis Quest
          </h3>
          <p className="text-muted-foreground">
            Ignis Quest adalah perjalanan terstruktur untuk mengubah keinginan menjadi kenyataan. 
            Melalui tiga fase utama, kamu akan belajar memanfaatkan energi terdesak, menjaga fokus, 
            dan mengarahkan tujuan hidup dengan cara yang sehat dan efektif.
          </p>
        </Card>

        {/* Three Phases */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold font-orbitron text-center">Tiga Fase Ignis Quest</h3>
          
          {/* Fase 1 */}
          <Card className="p-6 bg-gradient-secondary border-border">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-red-500/20 text-red-500 flex-shrink-0">
                <Angry className="w-6 h-6" />
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
          <Card className="p-6 bg-gradient-secondary border-border">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-blue-500/20 text-blue-500 flex-shrink-0">
                <Headphones className="w-6 h-6" />
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
                  className="text-blue-500 border-blue-500 hover:bg-blue-500/10"
                >
                  <Headphones className="w-4 h-4 mr-2" />
                  Akses Verse of eL Vision
                </Button>
              </div>
            </div>
          </Card>

          {/* Fase 3 */}
          <Card className="p-6 bg-gradient-secondary border-border">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-green-500/20 text-green-500 flex-shrink-0">
                <HomeIcon className="w-6 h-6" />
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
        <Card className="p-6 bg-gradient-primary/10 border-primary/20">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold font-orbitron text-foreground">
              Siap Memulai Perjalanan Ignis Quest?
            </h3>
            <p className="text-muted-foreground">
              Mulai dengan Fase 1 dan rasakan transformasi hidup yang luar biasa
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => onNavigate("meditation-sessions")}
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
              >
                Mulai Meditasi
              </Button>
              <Button 
                variant="outline"
                onClick={() => onNavigate("audio-therapy")}
                className="border-primary text-primary hover:bg-primary/10"
              >
                Akses Audio
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}