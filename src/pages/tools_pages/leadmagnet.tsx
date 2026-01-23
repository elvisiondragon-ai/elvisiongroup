import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Zap, Video, Image as ImageIcon, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function LeadMagnet() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const aiPrompt = "Buatkan gambar realistis tumpukan uang rupiah yang sedang terbakar api berwarna biru dan merah yang artistik, background gelap, cinematic lighting, ultra hd, ratio 9:16 untuk story instagram/tiktok.";
  
  const waTemplate = `🔥 Gila sih, ternyata ini rahasianya.

Bukan tuyul, bukan pesugihan. Tapi 'Uang Panas' yang halal.
Caranya aneh tapi masuk akal. Cek sendiri deh sebelum dihapus:

[LINK AFFILIATE KAMU]`;

  const copyToClipboard = (text: string, type: 'prompt' | 'template') => {
    navigator.clipboard.writeText(text);
    if (type === 'prompt') {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } else {
      setCopiedTemplate(true);
      setTimeout(() => setCopiedTemplate(false), 2000);
    }
    toast({
      title: "Berhasil Disalin",
      description: "Teks telah disalin ke clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white pb-20">
      <Toaster />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/30 border border-red-800 rounded-full text-red-400 mb-6 animate-pulse">
            <Zap size={16} />
            <span className="text-sm font-bold">Panduan Clipper Official</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Cara Hasilkan Uang dari Konten <br />
            <span className="text-red-600">"Uang Panas"</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Hanya butuh 3 langkah sederhana: Clip Video, Tambah Visual AI, Sebar Link.
            Tanpa perlu tampil wajah, tanpa perlu jago ngomong.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => document.getElementById('step1')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-6 px-8 rounded-full text-lg"
            >
              Mulai Praktek Sekarang
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/uangpanas')}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white py-6 px-8 rounded-full text-lg"
            >
              Lihat Produknya
            </Button>
          </div>
        </div>
      </section>

      {/* Steps Container */}
      <div className="max-w-4xl mx-auto px-4 space-y-24">
        
        {/* Step 1 */}
        <section id="step1" className="relative">
          <div className="absolute -left-12 top-0 text-9xl font-bold text-gray-900 -z-10 select-none">01</div>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-red-600 p-3 rounded-xl">
              <Video className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold">Potong (Clip) Video</h2>
          </div>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 md:p-8">
              <p className="text-lg text-gray-300 mb-6">
                Ambil Video dari Folder ini, boleh langsung atau kamu edit dipotong potong, lalu tambahkan text yang kreatif ikuti prompt di bawah dan mulai sebarkan dengan Link affiliate kamu Ke Whatsapp, Sosmed Kamu, Cara kedua Buat Video kamu sendiri merasakan manfaat dari Audio ini dan mulai Sebarkan video tersebut. Metode ini GRATIS. Namun Jika ingin yang berbayar dan lebih cepat meta ads, tunggu sampai kamu untung terlebih dahulu. Baru pertimbangkan untuk menggunakan iklan
              </p>
              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-3">
                  <Check className="text-green-500 mt-1" />
                  <span>Potong durasi menjadi <strong>15 - 30 detik</strong> saja.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-500 mt-1" />
                  <span>Pastikan format video <strong>9:16 (Vertikal)</strong> untuk TikTok/Reels/Shorts.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-500 mt-1" />
                  <span>Tambahkan teks headline besar di video, contoh: "Rahasia Uang Panas 2026".</span>
                </li>
              </ul>
              <div className="bg-black/50 p-4 rounded-lg border-l-4 border-yellow-500 text-gray-400 italic">
                Tips: Video pendek dengan retensi tinggi akan lebih cepat viral (FYP).
              </div>
              <div className="mt-6">
                <Button
                  onClick={() => window.open('https://drive.google.com/drive/folders/1rBPeEBplwklIVMXC5gZ92zYaP65CXQA9?usp=sharing', '_blank')}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md text-base"
                >
                  <Video className="mr-2" size={20} /> LEAD MAGNET VIDEO
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Step 2 */}
        <section className="relative">
          <div className="absolute -left-12 top-0 text-9xl font-bold text-gray-900 -z-10 select-none">02</div>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-600 p-3 rounded-xl">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold">Buat Visual AI</h2>
          </div>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 md:p-8">
              <p className="text-lg text-gray-300 mb-6">
                Gunakan AI seperti <strong>ChatGPT, Qwen, atau Midjourney</strong> untuk membuat cover atau footage tambahan yang menarik perhatian (Stop Scrolling).
              </p>
              
              <div className="space-y-4">
                <div className="bg-black border border-gray-800 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Prompt AI (Tinggal Copy)</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className={`hover:bg-gray-800 ${copiedPrompt ? 'text-green-500' : 'text-gray-400'}`}
                      onClick={() => copyToClipboard(aiPrompt, 'prompt')}
                    >
                      {copiedPrompt ? <Check size={16} /> : <Copy size={16} />}
                      <span className="ml-2">{copiedPrompt ? 'Disalin!' : 'Copy Prompt'}</span>
                    </Button>
                  </div>
                  <p className="text-gray-300 font-mono text-sm leading-relaxed">
                    "{aiPrompt}"
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="w-full justify-between border-gray-700 hover:bg-gray-800" onClick={() => window.open('https://chat.openai.com', '_blank')}>
                        Buka ChatGPT <ExternalLink size={16} />
                    </Button>
                    <Button variant="outline" className="w-full justify-between border-gray-700 hover:bg-gray-800" onClick={() => window.open('https://chat.qwen.lm', '_blank')}>
                        Buka Qwen AI <ExternalLink size={16} />
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Step 3 */}
        <section className="relative">
          <div className="absolute -left-12 top-0 text-9xl font-bold text-gray-900 -z-10 select-none">03</div>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-green-600 p-3 rounded-xl">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold">Sebar & Cuan</h2>
          </div>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 md:p-8">
              <p className="text-lg text-gray-300 mb-6">
                Sebarkan konten yang sudah kamu buat ke WhatsApp Status, Group, atau sosmed lain. Gunakan copywriting yang memancing rasa penasaran.
              </p>

              <div className="bg-green-900/10 border border-green-900/50 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-green-500 uppercase tracking-wider">Template Caption / WhatsApp</span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className={`hover:bg-green-900/20 ${copiedTemplate ? 'text-green-500' : 'text-gray-400'}`}
                    onClick={() => copyToClipboard(waTemplate, 'template')}
                  >
                    {copiedTemplate ? <Check size={16} /> : <Copy size={16} />}
                    <span className="ml-2">{copiedTemplate ? 'Disalin!' : 'Copy Template'}</span>
                  </Button>
                </div>
                <pre className="text-gray-300 font-sans text-sm whitespace-pre-wrap leading-relaxed">
                  {waTemplate}
                </pre>
              </div>

              <div className="bg-red-900/20 p-4 rounded-lg border border-red-900/50 flex gap-4 items-start">
                 <div className="bg-red-600 rounded-full p-1 mt-1 flex-shrink-0">
                    <Zap size={12} className="text-white" />
                 </div>
                 <p className="text-sm text-red-200">
                    <strong>PENTING:</strong> Jangan lupa ganti <span className="underline">[LINK AFFILIATE KAMU]</span> dengan link asli dari dashboard affiliate kamu agar komisinya masuk.
                 </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Final CTA */}
        <section className="text-center py-10">
            <h3 className="text-2xl font-bold mb-6">Sudah Siap Praktek?</h3>
            <div className="flex flex-col gap-4 max-w-md mx-auto">
                <Button 
                    size="lg" 
                    className="w-full bg-white text-black hover:bg-gray-200 font-bold py-6 text-lg group"
                    onClick={() => navigate('/affiliate')}
                >
                    Ambil Link Affiliate Saya <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <p className="text-gray-500 text-sm">
                    Belum punya akun? <span className="text-white underline cursor-pointer" onClick={() => navigate('/signup')}>Daftar disini</span>
                </p>
            </div>
        </section>

      </div>
    </div>
  );
}
