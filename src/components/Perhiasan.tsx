import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gem, Sparkles } from 'lucide-react';

interface PerhiasanProps {
  onNavigate: (tab: string) => void;
}

export const Perhiasan = ({ onNavigate }: PerhiasanProps) => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-6">
        <h1 className="text-4xl font-bold font-exo bg-gradient-to-r from-purple-400 to-violet-600 bg-clip-text text-transparent mb-6">
          Perhiasan
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
                      </div>
                    </div>
                  </div>
                );
              };