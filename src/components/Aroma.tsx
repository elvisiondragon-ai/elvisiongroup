import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gem, Sparkles } from 'lucide-react'; // Gem might not be needed, but Sparkles is for the icon

interface AromaProps {
  onNavigate: (tab: string) => void;
}

export const Aroma = ({ onNavigate }: AromaProps) => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-6">
        <h1 className="text-4xl font-bold font-exo bg-gradient-to-r from-red-400 to-pink-600 bg-clip-text text-transparent mb-6">
          Aroma
        </h1>
        
        <div className="space-y-6">
          {/* Fragrance Section */}
          <Card className="bg-gradient-to-br from-red-950 to-red-900 border-red-950 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-700 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-exo text-white">
                    Fragrance
                  </CardTitle>
                  <CardDescription className="text-lg text-white">
                    Sains di Balik Aroma dan Daya Tarik
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Harmoni Tubuh dan Fragrance : Kekuatan Stress Release, Meditasi, dan Fragrance
                </h3>
                <p className="text-base text-white leading-relaxed">
                  Kehidupan modern yang penuh tekanan sering kali meninggalkan jejak pada tubuh kita. Stres bukan hanya mengganggu pikiran, tetapi juga merusak kesehatan kulit, ekspresi wajah, hingga energi tubuh. Akibatnya, karisma alami pun memudar.
                </p>
              </div>

              <div>
                <h4 className="text-base font-medium text-white mb-2">🔥 Dampak Stres pada Penampilan dan Energi</h4>
                <p className="text-base text-white leading-relaxed mb-2">
                  Ketika stres menumpuk, hormon kortisol meningkat. Akibatnya:
                </p>
                <ul className="text-base text-white leading-relaxed ml-4 space-y-1">
                  <li>• Kulit menjadi kusam, kehilangan elastisitas, dan lebih cepat menua.</li>
                  <li>• Energi tubuh melemah, membuat aura pribadi meredup.</li>
                  <li>• Ekspresi wajah tegang, sorot mata berat, daya tarik alami menurun.</li>
                </ul>
                <p className="text-base text-white leading-relaxed mt-2">
                  Pria maupun wanita sama-sama mengalaminya. Wajah yang seharusnya bersinar justru tampak tertutup kabut kelelahan.
                </p>
              </div>

              <div>
                <h4 className="text-base font-medium text-white mb-2">🧘 Meditasi dan Stress Release: Menghidupkan Aura Batin</h4>
                <p className="text-base text-white leading-relaxed mb-2">
                  Praktik sederhana seperti meditasi, pernapasan dalam, atau sekadar hening beberapa menit dapat menenangkan sistem saraf. Saat tubuh kembali rileks:
                </p>
                <ul className="text-base text-white leading-relaxed ml-4 space-y-1">
                  <li>• Kulit terlihat segar karena aliran darah lancar.</li>
                  <li>• Pikiran lebih jernih, energi lebih stabil.</li>
                  <li>• Aura alami meningkat, memancarkan ketenangan yang membuat orang lain nyaman berada di sekitar kita.</li>
                </ul>
                <p className="text-base text-white leading-relaxed mt-2">
                  Inilah fondasi daya tarik sejati: bukan hanya tampilan luar, tetapi pancaran energi damai dari dalam.
                </p>
              </div>

              <div>
                <h4 className="text-base font-medium text-white mb-2">🌸 Fragrance: Amplifier dari Inner Calm</h4>
                <p className="text-base text-white leading-relaxed mb-2">
                  Fragrance bukan sekadar wangi. Seperti halnya cahaya memperkuat kecantikan, aroma memperkuat energi batin.
                </p>
                <ul className="text-base text-white leading-relaxed ml-4 space-y-1">
                  <li>• Saat tubuh tenang, aroma parfum yang dipakai terasa lebih "hidup"—ia menyatu dengan kepribadian pemakainya.</li>
                  <li>• Wangi tertentu dapat mempertegas aura: menenangkan, elegan, berwibawa, atau penuh daya tarik sensual.</li>
                  <li>• Parfum menjadi simbol yang tak terlihat namun dirasakan: sebuah tanda kehadiran yang meninggalkan kesan mendalam.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-base font-medium text-white mb-2">👩 Manfaat Fragrance bagi Wanita</h4>
                <ul className="text-base text-white leading-relaxed ml-4 space-y-1">
                  <li>• <strong>Meningkatkan rasa percaya diri</strong>: aroma yang sesuai membuat langkah terasa lebih mantap.</li>
                  <li>• <strong>Mempertegas kecantikan alami</strong>: parfum bukan menutupi, tetapi menyorot aura feminin yang sudah ada.</li>
                  <li>• <strong>Self-love dalam bentuk aroma</strong>: setiap semprotan parfum menjadi pengingat bahwa dirinya layak dihargai dan dirawat.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-base font-medium text-white mb-2">👨 Manfaat Fragrance bagi Pria</h4>
                <ul className="text-base text-white leading-relaxed ml-4 space-y-1">
                  <li>• <strong>Simbol kekuatan tenang</strong>: parfum dengan karakter woody, leather, atau musk menegaskan maskulinitas yang matang.</li>
                  <li>• <strong>Meningkatkan wibawa</strong>: kehadiran pria yang harum membuat orang lain lebih menghargai tanpa kata-kata.</li>
                  <li>• <strong>Status emosional</strong>: parfum yang tepat menunjukkan bukan hanya gaya hidup, tapi kualitas batin yang stabil.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-base font-medium text-white mb-2">🎯 Bagaimana Memilih Fragrance Sesuai Tujuan</h4>
                <p className="text-base text-white leading-relaxed mb-2">
                  Tidak semua parfum cocok untuk setiap suasana. Berikut saran sederhana:
                </p>
                <ul className="text-base text-white leading-relaxed ml-4 space-y-1">
                  <li>• <strong>Untuk menenangkan diri / meditasi</strong>: pilih aroma dengan unsur lavender, sandalwood, atau green tea.</li>
                  <li>• <strong>Untuk meningkatkan kepercayaan diri</strong>: gunakan citrus segar (bergamot, lemon) atau spicy (cardamom, pepper).</li>
                  <li>• <strong>Untuk kesan elegan & wibawa</strong>: pilih woody (oud, cedarwood) atau leather notes.</li>
                  <li>• <strong>Untuk daya tarik romantis</strong>: gunakan gourmand (vanilla, tonka bean) atau floral (rose, jasmine).</li>
                </ul>
              </div>

              <div>
                <h4 className="text-base font-medium text-white mb-2">💫 Kesimpulan: Inner Calm & Fragrance, Dua Kekuatan yang Menyatu</h4>
                <p className="text-base text-white leading-relaxed">
                  Ketenangan batin yang diperoleh dari stress release dan meditasi membuat tubuh memancarkan energi positif. Saat dipadukan dengan fragrance yang tepat, pancaran itu menjadi semakin terasa nyata bagi orang lain.
                </p>
                <p className="text-base text-white leading-relaxed font-semibold mt-2">
                  <strong>Inner calm membuat aroma terasa hidup. Fragrance membuat inner calm lebih mudah dirasakan dunia.</strong>
                </p>
              </div>

              <Button 
                onClick={() => onNavigate("audio-therapy")}
                className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white mt-4"
              >
                Dengarkan Verse of eL Vision
              </Button>
              <Button
                onClick={() => window.open('https://app.elroyaleparfum.com', '_blank')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white mt-2" // Added mt-2 and new colors
              >
                <Sparkles className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">Kunjungi El Royale Parfum</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};