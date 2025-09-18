import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gem, Sparkles } from 'lucide-react';

interface LifestyleProps {
  onNavigate: (tab: string) => void;
}

export const Lifestyle = ({ onNavigate }: LifestyleProps) => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-6">
        <h1 className="text-2xl font-bold font-orbitron bg-gradient-to-r from-purple-400 to-violet-600 bg-clip-text text-transparent mb-6">
          Lifestyle
        </h1>
        
        <div className="space-y-6">
          {/* Jewelry Section */}
          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Gem className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-orbitron text-purple-800">
                    Jewelry
                  </CardTitle>
                  <CardDescription className="text-purple-600">
                    Rahasia Kecantikan dan Karisma
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-purple-900 mb-2">
                  Ketika Stress Release, Meditasi, dan Jewelry Saling Melengkapi
                </h3>
                <p className="text-sm text-purple-700 leading-relaxed">
                  Pernahkah Anda merasakan bagaimana sebuah perhiasan tidak hanya mempercantik penampilan, 
                  tetapi juga memberikan rasa percaya diri yang luar biasa? Ini bukan sekadar efek psikologis—ada 
                  sains yang mendalam di baliknya.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-purple-900 mb-2">🧠 Neuroplastisitas dan Aura Diri</h4>
                <p className="text-sm text-purple-700 leading-relaxed">
                  Ketika tingkat stress turun melalui meditasi, otak kita mengalami neuroplastisitas—kemampuan 
                  untuk membentuk koneksi saraf baru. Proses ini tidak hanya memperbaiki fungsi kognitif, tetapi 
                  juga meningkatkan persepsi diri dan pancaran aura positif.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-purple-900 mb-2">✨ Efek Placebo yang Kuat</h4>
                <p className="text-sm text-purple-700 leading-relaxed">
                  Jewelry berkualitas tinggi menciptakan efek placebo yang sangat kuat. Ketika Anda mengenakan 
                  perhiasan yang indah, otak melepaskan dopamine dan serotonin—neurotransmitter yang bertanggung 
                  jawab atas perasaan bahagia dan percaya diri.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-purple-900 mb-2">🔮 Kristal dan Energi Vibrational</h4>
                <p className="text-sm text-purple-700 leading-relaxed">
                  Dari sudut pandang fisika kuantum, setiap material memiliki frekuensi vibrational unik. 
                  Perhiasan dengan batu mulia tertentu dapat mempengaruhi medan energi tubuh, menciptakan 
                  resonansi yang memperkuat kondisi meditasi dan ketenangan batin.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-purple-900 mb-2">💎 Kombinasi Sempurna</h4>
                <p className="text-sm text-purple-700 leading-relaxed">
                  Saat stress berkurang + meditasi teratur + jewelry yang tepat = transformasi total dalam 
                  pancaran diri Anda. Ini bukan hanya tentang penampilan luar, tetapi tentang energi yang 
                  Anda pancarkan ke dunia.
                </p>
              </div>

              <Button 
                onClick={() => onNavigate("audio-therapy")}
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white mt-4"
              >
                Tenangkan diri anda di Verse of eL Vision
              </Button>
            </CardContent>
          </Card>

          {/* Fragrance Section */}
          <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 rounded-lg">
                  <Sparkles className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-orbitron text-rose-800">
                    Fragrance
                  </CardTitle>
                  <CardDescription className="text-rose-600">
                    Sains di Balik Aroma dan Daya Tarik
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-rose-900 mb-2">
                  Mengapa Fragrance Bisa Mengubah Persepsi Orang Terhadap Anda?
                </h3>
                <p className="text-sm text-rose-700 leading-relaxed">
                  Tahukah Anda bahwa 75% emosi dipicu oleh aroma? Sistem penciuman langsung terhubung ke 
                  limbic system—pusat emosi dan memori di otak. Inilah mengapa fragrance yang tepat bisa 
                  menciptakan kesan yang tak terlupakan.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-rose-900 mb-2">🧬 Pheromone dan Daya Tarik Alami</h4>
                <p className="text-sm text-rose-700 leading-relaxed">
                  Ketika stress berkurang melalui meditasi, tubuh secara alami memproduksi pheromone yang 
                  lebih berkualitas. Fragrance premium dapat memperkuat sinyal kimia alami ini, menciptakan 
                  daya tarik yang hampir magnetis.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-rose-900 mb-2">🌸 Aromatherapy dan Mood Enhancement</h4>
                <p className="text-sm text-rose-700 leading-relaxed">
                  Komponen aromatherapy dalam fragrance berkualitas tinggi dapat mengaktifkan neurotransmitter 
                  tertentu. Lavender meningkatkan GABA (anti-anxiety), Rose meningkatkan serotonin (happiness), 
                  Sandalwood meningkatkan melatonin (relaxation).
                </p>
              </div>

              <div>
                <h4 className="font-medium text-rose-900 mb-2">🎭 Psychological Anchoring</h4>
                <p className="text-sm text-rose-700 leading-relaxed">
                  Fragrance menciptakan 'anchoring effect' di otak orang lain. Ketika seseorang mencium aroma 
                  Anda, otak mereka secara otomatis mengasosiasikannya dengan kepribadian dan energi yang Anda 
                  pancarkan saat itu.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-rose-900 mb-2">💫 The Perfect Trinity</h4>
                <p className="text-sm text-rose-700 leading-relaxed">
                  Stress management + meditation + signature fragrance = aura yang tak terlupakan. Anda tidak 
                  hanya hadir secara fisik, tetapi meninggalkan jejak energi positif yang bertahan lama di 
                  ingatan orang lain.
                </p>
              </div>

              <Button 
                onClick={() => onNavigate("audio-therapy")}
                className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white mt-4"
              >
                Tenangkan diri anda di Verse of eL Vision
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};