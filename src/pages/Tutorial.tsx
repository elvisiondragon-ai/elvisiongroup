import { ArrowLeft, Check, X, Headphones, Clock, AlertCircle } from "lucide-react";
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
      description: "Punggung lurus, kaki bersila, posisi nyaman",
      isCorrect: true,
    },
    {
      image: position2,
      title: "Duduk di Kursi",
      description: "Kaki rata di lantai, punggung tegak",
      isCorrect: true,
    },
    {
      image: position3,
      title: "Bersandar di Kursi",
      description: "Bersandar nyaman, tetap waspada",
      isCorrect: true,
    },
    {
      image: position4,
      title: "Berbaring di Kasur",
      description: "Mudah tertidur, tidak disarankan",
      isCorrect: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-semibold font-orbitron text-foreground">
              Tutorial Meditasi
            </h1>
            <p className="text-sm text-muted-foreground">
              Verse 1 - Panduan Posisi & Waktu
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Key Instructions */}
        <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-primary" />
              <h2 className="font-semibold font-orbitron text-foreground">
                Aturan Utama
              </h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Gunakan posisi yang nyaman tapi tidak membuat ngantuk
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <Headphones className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Wajib gunakan headphone</span> untuk pengalaman optimal
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Waktu terbaik:</span> Pagi dan malam hari
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Position Guide */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold font-orbitron text-foreground">
            Pilihan Posisi Meditasi
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {positions.map((position, index) => (
              <Card key={index} className="overflow-hidden relative">
                <div className="relative">
                  <img
                    src={position.image}
                    alt={position.title}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Status Badge */}
                  <div className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center ${
                    position.isCorrect 
                      ? 'bg-green-500/20 border-2 border-green-500' 
                      : 'bg-red-500/20 border-2 border-red-500'
                  }`}>
                    {position.isCorrect ? (
                      <Check className="w-6 h-6 text-green-500" />
                    ) : (
                      <X className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-2">
                    {position.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {position.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <Card className="p-6">
          <h3 className="font-semibold font-orbitron text-foreground mb-4">
            Tips Meditasi Efektif
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
              <p className="text-muted-foreground text-sm">
                Pilih tempat yang tenang dan tidak akan terganggu
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
              <p className="text-muted-foreground text-sm">
                Pastikan volume headphone tidak terlalu keras
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
              <p className="text-muted-foreground text-sm">
                Tutup mata dan fokus pada audio yang diputar
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
              <p className="text-muted-foreground text-sm">
                Jika merasa mengantuk, ubah posisi ke yang lebih tegak
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}