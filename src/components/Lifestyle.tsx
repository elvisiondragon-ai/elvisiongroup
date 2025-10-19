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
        <h1 className="text-4xl font-bold font-exo bg-gradient-to-r from-purple-400 to-violet-600 bg-clip-text text-transparent mb-6">
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
                  <CardTitle className="text-3xl font-exo text-purple-800">
                    Jewelry
                  </CardTitle>
                  <CardDescription className="text-lg text-purple-600">
                    Rahasia Kecantikan dan Karisma
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  Rahasia Kecantikan dan Karisma: Ketika Stress Release, Meditasi, dan Jewelry Saling Melengkapi
                </h3>
                <p className="text-base text-purple-700 leading-relaxed">
                  Dalam dunia modern yang penuh tekanan, kita sering lupa bahwa stres tidak hanya mengganggu pikiran, tetapi juga meninggalkan jejak nyata pada tubuh dan wajah. Banyak penelitian psikodermatologi menunjukkan bahwa stres kronis dapat memicu jerawat, kulit kusam, penuaan dini, hingga memperburuk kondisi kulit sensitif. Lebih dari itu, energi tubuh pun ikut terkuras—wajah tampak lelah, sorot mata meredup, dan daya tarik alami perlahan menghilang.
                </p>
              </div>

              <div>
                <h4 className="text-base font-medium text-purple-900 mb-2">💔 Bagaimana Stres Menggerogoti Daya Tarik</h4>
                <p className="text-base text-purple-700 leading-relaxed mb-2">
                  Saat tubuh berada dalam kondisi stres, hormon kortisol meningkat. Kortisol yang berlebihan:
                </p>
                <ul className="text-base text-purple-700 leading-relaxed ml-4 space-y-1">
                  <li>• Memperlambat regenerasi sel kulit.</li>
                  <li>• Menurunkan kadar kolagen dan elastisitas kulit.</li>
                  <li>• Membuat wajah terlihat menua lebih cepat.</li>
                  <li>• Mengganggu keseimbangan energi tubuh sehingga aura positif meredup.</li>
                </ul>
                <p className="text-base text-purple-700 leading-relaxed mt-2">
                  Tidak hanya wanita, pria pun mengalami dampak serupa. Tubuh yang tegang, ekspresi wajah keras, serta hilangnya ketenangan membuat kharisma pribadi menurun.
                </p>
              </div>

              <div>
                <h4 className="text-base font-medium text-purple-900 mb-2">🧘 Meditasi dan Stress Release: Kunci Menghidupkan Aura Alami</h4>
                <p className="text-base text-purple-700 leading-relaxed mb-2">
                  Di sinilah meditasi, pernapasan dalam, dan praktik stress release berperan penting. Saat tubuh diajak untuk kembali tenang, sistem saraf parasimpatik aktif, hormon stres menurun, dan tubuh mulai memperbaiki dirinya sendiri. Dampaknya:
                </p>
                <ul className="text-base text-purple-700 leading-relaxed ml-4 space-y-1">
                  <li>• Kulit lebih cerah karena sirkulasi darah lancar.</li>
                  <li>• Sorot mata lebih hidup, tidak lagi berat.</li>
                  <li>• Aura alami lebih hangat, memancarkan ketenangan yang menarik.</li>
                </ul>
                <p className="text-base text-purple-700 leading-relaxed mt-2">
                  Banyak yang terkejut saat menyadari: daya tarik sejati bukan hanya dari kosmetik atau penampilan luar, melainkan dari kualitas energi yang terpancar ketika seseorang tenang dan damai.
                </p>
              </div>

              <div>
                <h4 className="text-base font-medium text-purple-900 mb-2">💎 Jewelry Sebagai Amplifier Energi Ketenangan</h4>
                <p className="text-base text-purple-700 leading-relaxed mb-2">
                  Di titik inilah jewelry—entah Moissanite ataupun berlian—berperan bukan hanya sebagai aksesori, melainkan sebagai amplifier.
                </p>
                <ul className="text-base text-purple-700 leading-relaxed ml-4 space-y-1">
                  <li>• Kilau permata sejatinya adalah refleksi cahaya. Namun, ketika dikenakan oleh seseorang yang stress-free, kilau itu seolah ikut memancarkan energi batin pemakainya.</li>
                  <li>• Berlian atau Moissanite tidak sekadar indah karena potongannya, tetapi karena "hidup" bersama aura pemakainya.</li>
                  <li>• Jewelry menjadi simbol kesadaran diri: bahwa kita pantas terlihat bercahaya, bukan hanya dari luar tapi juga dari dalam.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-base font-medium text-purple-900 mb-2">👩 Manfaat Bagi Wanita</h4>
                <p className="text-base text-purple-700 leading-relaxed mb-2">
                  Bagi wanita, jewelry sering dipandang sebagai lambang kecantikan. Namun, jika dikaitkan dengan inner calm, jewelry menjelma menjadi:
                </p>
                <ul className="text-base text-purple-700 leading-relaxed ml-4 space-y-1">
                  <li>• <strong>Sumber rasa percaya diri</strong>: bukan hanya karena tampil mewah, tapi karena ia merefleksikan penghargaan diri.</li>
                  <li>• <strong>Kecantikan alami yang terkuat</strong>: ketika kulit segar dan pikiran damai, jewelry seolah menegaskan aura keanggunan yang sudah ada.</li>
                  <li>• <strong>Simbol self-love</strong>: setiap kilau adalah pengingat bahwa dirinya layak untuk dihargai dan dicintai, pertama-tama oleh dirinya sendiri.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-base font-medium text-purple-900 mb-2">👨 Manfaat Bagi Pria</h4>
                <p className="text-base text-purple-700 leading-relaxed mb-2">
                  Bagi pria, jewelry bukan sekadar aksesoris gaya atau status sosial. Lebih dalam dari itu:
                </p>
                <ul className="text-base text-purple-700 leading-relaxed ml-4 space-y-1">
                  <li>• Jewelry menjadi <strong>simbol kekuatan tenang</strong>—menunjukkan bahwa maskulinitas modern bukan tentang agresi, melainkan tentang kontrol diri dan keseimbangan emosional.</li>
                  <li>• Jewelry mencerminkan <strong>kelas dan wibawa</strong>: ketika dipadukan dengan sikap yang damai, kilau jewelry mengubah kesan menjadi elegan, bukan sekadar pamer harta.</li>
                  <li>• Jewelry adalah <strong>tanda kesadaran diri</strong>: bahwa ketenangan batin sama berharganya dengan pencapaian luar.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-base font-medium text-purple-900 mb-2">💫 Kesimpulan: Inner Calm dan Jewelry, Dua Sisi Koin yang Sama</h4>
                <p className="text-base text-purple-700 leading-relaxed">
                  Ketika seseorang menemukan inner calm melalui meditasi dan stress release, kecantikan serta karismanya muncul secara alami. Dalam kondisi itu, jewelry tidak lagi sekadar benda, tetapi medium yang membuat pancaran diri terlihat lebih nyata.
                </p>
                <p className="text-base text-purple-700 leading-relaxed mt-2">
                  Sebaliknya, jewelry yang berkilau di tubuh tenang seakan memperkuat pengalaman batin itu: bahwa rasa damai dan percaya diri bukan hanya sesuatu yang kita rasakan, tetapi juga sesuatu yang bisa dilihat oleh dunia.
                </p>
                <p className="text-base text-purple-700 leading-relaxed font-semibold mt-2">
                  <strong>Inner calm membuat jewelry hidup. Jewelry membuat inner calm terasa nyata.</strong>
                </p>
              </div>

              <Button 
                onClick={() => onNavigate("audio-therapy")}
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white mt-4"
              >
                Dengarkan Verse of eL Vision
              </Button>
            </CardContent>
          </Card>

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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};