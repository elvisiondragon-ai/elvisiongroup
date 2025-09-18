import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Apple, Brain, Heart, AlertTriangle, CheckCircle, Target, Sparkles, Utensils, Scale, Clock } from 'lucide-react';

interface TrueDietProps {
  onNavigate?: (tab: string) => void;
}

export function TrueDiet({ onNavigate }: TrueDietProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Apple className="w-6 h-6 text-green-400" />
            <CardTitle className="text-xl text-green-100">
              True Diet: Diet Sejati
            </CardTitle>
          </div>
          <CardDescription className="text-lime-200 text-sm leading-relaxed">
            Diet sejati bukan obat, melainkan cara pandang kita terhadap makanan
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Introduction Story */}
      <Card className="p-6">
        <div className="prose prose-sm max-w-none text-foreground">
          <p className="mb-4 leading-relaxed">
            Bayangkan dua orang yang makan porsi sama persis setiap hari. Satu merasa cukup, tenang, dan sehat. 
            Satu lagi selalu cemas, ngidam, lalu minum pil "pelangsing" demi cepat kurus — namun badannya buntung, 
            mood kacau, dan kesehatan memburuk. Apa yang berbeda bukan semata nutrisi: melainkan <strong>cara pandang</strong> 
            mereka terhadap makanan, rasa lapar, dan tubuh sendiri.
          </p>
          <p className="mb-4 leading-relaxed">
            Diet sejati — <strong>True Diet</strong> — bukanlah sekadar aturan kalori, pil, atau ramuan kimia. 
            Diet sejati adalah <strong>paradigma</strong>: bagaimana kita melihat makanan, bagaimana kita merasakan 
            lapar, kenyang, emosi, dan relasi kita dengan makan tanpa kekerasan terhadap tubuh. Kalau ini benar-benar 
            dipahami, banyak masalah "berat badan" yang selama ini dicari jalan pintasnya lewat obat kimia akan 
            beresak dari akarnya.
          </p>
        </div>
      </Card>

      {/* Why Mindset is More Powerful */}
      <Card className="p-6 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-blue-300">Mengapa Cara Pandang Lebih Kuat dari Pil atau Hitungan Kalori</h3>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-blue-200">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center mt-0.5 flex-shrink-0">1</span>
            <div>
              <strong>Makan dimotori oleh otak:</strong> kebiasaan, emosi, stres, dan makna sosial. Bukan hanya kebutuhan energi.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center mt-0.5 flex-shrink-0">2</span>
            <div>
              <strong>Pola makan yang dipaksakan (diet keras)</strong> memicu respon biologis: rasa lapar kompensasi, gangguan metabolik, dan gangguan hubungan dengan makanan — yang sering memicu efek yo-yo.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center mt-0.5 flex-shrink-0">3</span>
            <div>
              <strong>Ketika kita memelajari tubuh dan sinyalnya</strong> (lapar vs haus, lapar fisiologis vs lapar emosional), kita bisa membuat perubahan berkelanjutan tanpa rasa kekerasan atau ketergantungan.
            </div>
          </div>
          <div className="bg-blue-800/20 p-4 rounded-lg border border-blue-500/30 mt-4">
            <p className="text-blue-100 text-sm">
              <strong>📚 Bukti Ilmiah:</strong> Ada bukti bahwa pendekatan <em>mindfulness</em> dan <em>mindful eating</em> 
              (cara makan penuh hadir) membantu memperbaiki hubungan dengan makanan, menurunkan makan emosional, dan memberi 
              manfaat psikologis jangka panjang dibandingkan trik cepat yang sifatnya eksternal.
            </p>
          </div>
        </div>
      </Card>

      {/* Dangers of Chemical Diet Pills */}
      <Card className="p-6 bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h3 className="text-lg font-semibold text-red-300">Bahaya Obat Diet Kimia — Faktanya (Bukan Sekadar Mitos)</h3>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-red-200">
          <p className="text-red-100 mb-4">
            Banyak produk "pelangsing" menjanjikan hasil cepat. Namun ada beberapa masalah besar dan terdokumentasi:
          </p>
          
          <div className="space-y-3">
            <div className="bg-red-800/20 p-4 rounded-lg border border-red-500/30">
              <h4 className="font-medium text-red-300 mb-2">⚠️ Produk Palsu dan Kontaminasi Berbahaya</h4>
              <p className="text-xs">
                Banyak produk yang dipasarkan sebagai "all-natural" ternyata mengandung bahan obat yang tidak tercantum — dan itu bisa berbahaya. 
                Badan pengawas (FDA) secara rutin menurunkan peringatan untuk produk penurunan berat badan yang terkontaminasi atau palsu.
              </p>
            </div>
            
            <div className="bg-red-800/20 p-4 rounded-lg border border-red-500/30">
              <h4 className="font-medium text-red-300 mb-2">💊 Efek Samping Obat Resep</h4>
              <p className="text-xs">
                Obat-obat tertentu yang diresepkan memiliki efek samping: peningkatan denyut jantung, tekanan darah, 
                insomnia, konstipasi, hingga risiko gangguan perkembangan janin. Obat stimulan memiliki potensi penyalahgunaan 
                dan efek kardiovaskular jika dipakai sembarangan.
              </p>
            </div>
            
            <div className="bg-red-800/20 p-4 rounded-lg border border-red-500/30">
              <h4 className="font-medium text-red-300 mb-2">🌿 Suplemen "Alami" Tidak Selalu Aman</h4>
              <p className="text-xs">
                Evidence untuk suplemen penurun berat badan umumnya lemah; banyak tidak diuji jangka panjang. 
                Sebagian lagi telah dikaitkan dengan toksisitas. FDA dan lembaga kesehatan sudah mengeluarkan banyak peringatan.
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-700/20 to-orange-700/20 p-4 rounded-lg border border-red-400/40 mt-4">
            <p className="text-red-100 font-medium text-sm text-center">
              💀 <strong>Kesimpulan:</strong> Mencari langsing lewat zat kimia atau ramuan yang dipasarkan tanpa bukti ilmiah 
              dan tanpa pengawasan medis adalah taruhan berbahaya terhadap kesehatan jantung, hati, hormon, dan bahkan nyawa.
            </p>
          </div>
        </div>
      </Card>

      {/* Why Focus on Mind is Better */}
      <Card className="p-6 bg-gradient-to-r from-emerald-900/20 to-green-900/20 border border-emerald-500/30">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-emerald-300">Mengapa Fokus ke Pikiran dan Cara Pandang Lebih Aman — dan Lebih Efektif</h3>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-emerald-200">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-emerald-800/20 p-4 rounded-lg border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <h4 className="font-medium text-emerald-300">Mengubah Perilaku dari Akar</h4>
              </div>
              <p className="text-xs">
                Bila kita melatih perhatian saat makan, kita jadi mampu membedakan lapar fisiologis dan lapar emosional. 
                Ini menurunkan makan impulsif.
              </p>
            </div>
            
            <div className="bg-emerald-800/20 p-4 rounded-lg border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <h4 className="font-medium text-emerald-300">Menghindari Efek Samping</h4>
              </div>
              <p className="text-xs">
                Perbaikan kebiasaan makan dan manajemen stres tidak menambah beban organ tubuh seperti 
                obat-obatan yang memengaruhi jantung, hati, atau hormon.
              </p>
            </div>
            
            <div className="bg-emerald-800/20 p-4 rounded-lg border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <h4 className="font-medium text-emerald-300">Hasil Berkelanjutan</h4>
              </div>
              <p className="text-xs">
                Perubahan mindset melahirkan kebiasaan. Kebiasaan bertahan lebih lama daripada solusi cepat 
                yang segera hilang ketika obat dihentikan (efek yo-yo).
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Practical True Diet Steps */}
      <Card className="p-6 bg-gradient-to-r from-lime-900/20 to-green-900/20 border border-lime-500/30">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-lime-400" />
          <h3 className="text-lg font-semibold text-lime-300">Praktik True Diet: Langkah Praktis yang Bisa Dicoba Hari Ini</h3>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-lime-200">
          <p className="text-lime-100 mb-4">
            Berikut protokol sederhana—bukan "aturan" kaku, namun latihan cara pandang:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-lime-800/20 rounded-lg border border-lime-500/30">
              <span className="w-6 h-6 rounded-full bg-lime-600 text-white text-xs flex items-center justify-center mt-0.5 flex-shrink-0">1</span>
              <div>
                <strong className="text-lime-300">Tarik napas sebelum makan (1–2 menit):</strong> hadirkan niat untuk mengetahui rasa lapar. 
                Tanyakan: "Apakah aku lapar secara fisik atau ini reaksi emosi?"
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-lime-800/20 rounded-lg border border-lime-500/30">
              <span className="w-6 h-6 rounded-full bg-lime-600 text-white text-xs flex items-center justify-center mt-0.5 flex-shrink-0">2</span>
              <div>
                <strong className="text-lime-300">Makan tanpa gangguan selama satu makanan per hari:</strong> jauhkan ponsel, TV. 
                Fokus pada tekstur, rasa, suhu. Rasakan bagaimana tubuh merespons setiap suapan.
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-lime-800/20 rounded-lg border border-lime-500/30">
              <span className="w-6 h-6 rounded-full bg-lime-600 text-white text-xs flex items-center justify-center mt-0.5 flex-shrink-0">3</span>
              <div>
                <strong className="text-lime-300">Skala kenyang 0–10:</strong> setiap beberapa suapan, cek titik kenyang. 
                Berhenti di 7–8, bukan 10. Melatih sinyal tubuh, bukan menekan diri.
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-lime-800/20 rounded-lg border border-lime-500/30">
              <span className="w-6 h-6 rounded-full bg-lime-600 text-white text-xs flex items-center justify-center mt-0.5 flex-shrink-0">4</span>
              <div>
                <strong className="text-lime-300">Tulis 3 pemicu emosional makan:</strong> stress? bosan? sedih? 
                Jika muncul, gunakan teknik sederhana: napas 4-4-4 atau jalan 5 menit sebelum makan.
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-lime-800/20 rounded-lg border border-lime-500/30">
              <span className="w-6 h-6 rounded-full bg-lime-600 text-white text-xs flex items-center justify-center mt-0.5 flex-shrink-0">5</span>
              <div>
                <strong className="text-lime-300">Eksperimen 7 hari:</strong> jangan evaluasi pada hari ke-1. 
                Catat energi, mood, tidur, dan hubungan dengan makanan setiap hari. Perubahan kecil namun konsisten akan muncul.
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-lime-700/20 to-green-700/20 p-4 rounded-lg border border-lime-400/40 mt-4">
            <p className="text-lime-100 text-sm">
              <strong>🎯 Hasil:</strong> Langkah-langkah ini mengubah hubungan mental terhadap makanan, sehingga "diet" 
              bukan lagi perjuangan dan represi, melainkan pemilihan sadar.
            </p>
          </div>
        </div>
      </Card>

      {/* Final Message */}
      <Card className="p-6 bg-gradient-to-r from-amber-900/20 to-yellow-900/20 border border-amber-500/30">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-amber-300">Diet Sejati adalah Revolusi Cara Pandang</h3>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-amber-200">
          <p className="text-amber-100">
            Jika Anda masih mencari "jalan pintas" — ingatlah bahwa pintas itu sering berujung labirin berbahaya. 
            Pilih pendekatan yang menghormati tubuh dan pikiran: pelajari sinyal, latih perhatian, dan hindari produk 
            yang menjanjikan mukjizat tanpa bukti.
          </p>
          <p className="text-amber-100">
            Untuk klaim atau penggunaan obat tertentu, konsultasikan dengan profesional kesehatan yang kredibel — 
            jangan mencoba eksperimen sendiri.
          </p>
        </div>
      </Card>

      {/* Call to Action */}
      <Card className="p-6 bg-gradient-to-r from-green-900/20 to-lime-900/20 border border-green-500/30">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="w-6 h-6 text-lime-400" />
            <h3 className="text-xl font-semibold text-green-300">
              Mulai Praktik True Diet Anda
            </h3>
          </div>
          <p className="text-lime-200 leading-relaxed max-w-2xl mx-auto">
            Daripada mencari solusi instant melalui pil atau obat berbahaya, mulailah perjalanan transformasi yang sejati. 
            Pelajari cara mendengarkan tubuh Anda, kelola stress dengan baik, dan temukan ketenangan dalam setiap aspek hidup 
            melalui praktik Verse of eL Vision.
          </p>
          <Button
            onClick={() => onNavigate && onNavigate('audio-therapy')}
            className="w-full bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700 text-white font-medium px-4 py-3 text-sm sm:text-base"
            size="lg"
          >
            <Sparkles className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Praktik Verse of eL Vision untuk Stress Management</span>
          </Button>
          <p className="text-xs text-lime-300/80">
            Kelola stress dan emosi Anda dengan baik untuk hubungan yang sehat dengan makanan
          </p>
        </div>
      </Card>

      {/* Educational Info */}
      <Card className="p-4 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30">
        <div className="text-sm text-blue-300 leading-relaxed">
          <strong>🧠 True Diet & Spiritualitas:</strong> Pendekatan mindful eating dan spiritual awareness 
          terbukti lebih efektif dan aman dibandingkan solusi instant melalui obat-obatan. Ketika kita memahami 
          hubungan antara emosi, stress, dan pola makan, kita dapat menciptakan transformasi yang berkelanjutan 
          dan menyeluruh tanpa membahayakan kesehatan.
        </div>
      </Card>
    </div>
  );
}