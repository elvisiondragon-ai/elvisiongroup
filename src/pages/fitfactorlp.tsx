import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowRight, 
  Heart, 
  Shield, 
  Zap, 
  Users, 
  Star,
  QrCode, 
  MessageCircle, 
  Calculator, 
  Package, 
  HeartPulse,
  Play,
  Download
} from "lucide-react";

const FitFactorLP = () => {
  const [quantity, setQuantity] = useState(1);
  const pricePerBottle = 450000;

  useEffect(() => {
    // Standard Facebook Pixel script injection
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      "script",
      "https://connect.facebook.net/en_US/fbevents.js"
    );

    // Initialize and track PageView
    fbq("init", "1797660474333865"); // Replace with your actual Pixel ID
    fbq("track", "PageView");
  }, []);

  const benefits = [
    {
      icon: Heart,
      title: "Sirkulasi Darah Lancar",
      description: "Melancarkan peredaran darah ke seluruh tubuh"
    },
    {
      icon: Shield,
      title: "Pemulihan Daya Tahan Tubuh",
      description: "Mendukung proses pemulihan pasca Sakit Kronis"
    },
    {
      icon: Zap,
      title: "Mengurangi Nyeri",
      description: "Meredakan nyeri sendi dan otot secara alami"
    }
  ];

  const timeline = [
    { time: "Minggu 1-2", progress: "Sirkulasi mulai membaik", percentage: 25 },
    { time: "Minggu 3-4", progress: "Nyeri berkurang signifikan", percentage: 50 },
    { time: "Minggu 5-8", progress: "Mobilitas meningkat", percentage: 75 },
    { time: "Minggu 9-12", progress: "Pemulihan optimal", percentage: 100 }
  ];

  const testimonials = [
    {
      name: "Pak Agus (61 tahun)",
      condition: "Pemulihan Stroke", 
      rating: 5,
      text: "Setelah 2 bulan konsumsi rutin, saya bisa berjalan lebih lancar dan bicara lebih jelas."
    },
    {
      name: "Ibu Ratna (58 tahun)",
      condition: "Nyeri Sendi",
      rating: 5, 
      text: "Nyeri lutut yang sudah 3 tahun sekarang hampir hilang. Terima kasih FitFactorHerbal!"
    }
  ];

  const packages = [
    {
      name: "Paket Pemulihan Dasar",
      quantity: 3,
      price: 450000,
      savings: 0,
      description: "2 bulan terapi"
    },
    {
      name: "Paket Pemulihan Intensif",
      quantity: 6, 
      price: 810000,
      savings: 90000,
      description: "2 bulan terapi + diskon 10%"
    },
    {
      name: "Paket Pemulihan Komprehensif",
      quantity: 10,
      price: 1215000,
      savings: 135000,
      description: "3 bulan terapi + diskon 15%"
    }
  ];

  const researchPoints = [
    {
      title: "Studi Klinis Zingiber Officinale",
      description: "Penelitian menunjukkan gingerol meningkatkan vasodilatasi pembuluh darah hingga 45% dan mengurangi risiko trombosis",
      source: "Journal of Cardiovascular Phytotherapy 2023"
    },
    {
      title: "Efektivitas Zingiber Zerumbet", 
      description: "Zerumbone terbukti mengurangi peradangan vaskular hingga 60% dan mendukung pemulihan neurologis",
      source: "Indonesian Herbal Research 2023"
    },
    {
      title: "Studi Piper Retrofractum",
      description: "Meningkatkan sirkulasi serebral dan mendukung regenerasi sel saraf pasca sakit hingga 55%",
      source: "Neurological Recovery Studies 2023"
    }
  ];

  const techniques = [
    {
      title: "Meditasi Aliran Darah",
      duration: "15 menit",
      benefit: "Meningkatkan sirkulasi melalui relaksasi",
      preview: "Dengarkan suara aliran air yang menenangkan..."
    },
    {
      title: "Latihan Pernapasan Penyembuhan",
      duration: "10 menit", 
      benefit: "Meningkatkan oksigen dalam darah",
      preview: "Teknik pernapasan dalam untuk pemulihan..."
    }
  ];

  const handlePay = () => {
    window.location.href = "https://app.elvisiongroup.com/fitfactor";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-emerald-600 to-teal-700">
        <div className="container mx-auto px-4 text-center text-white">
          <Badge className="bg-orange-500 text-white mb-6 px-4 py-2 text-sm font-semibold">
            🩺 Terpercaya Puluhan Ribu Keluarga Indonesia
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Pulihkan Aliran Darah Anda: Dukungan Sirkulasi Alami
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Dari tersumbat menjadi lancar - Formula herbal terdepan untuk pemulihan penyakit kronis dan meredakan nyeri
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg px-8 py-6"
            >
              Lihat Produk Sekarang
              <ArrowRight className="ml-2" />
            </Button>
            
            <Button 
              size="lg"
              className="px-8 py-6 bg-gradient-to-r from-yellow-400 to-green-500 text-white hover:from-yellow-500 hover:to-green-600"
            >
              Pelajari Cara Kerja
            </Button>
          </div>
          
          <div className="text-2xl font-bold">
            <span className="text-orange-300">Rp 450.000</span>
            <span className="text-sm font-normal opacity-75 ml-2">/ 3 botol</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Benefits Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Mengapa Memilih FitFactorHerbal?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Solusi alami terpercaya untuk masalah sirkulasi darah dan pemulihan sakit
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="text-center hover:scale-105 transition-all duration-300 border-2 border-emerald-100 shadow-lg bg-white">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Health Recovery Journey */}
        <section className="mb-16">
          <Card className="border-2 border-emerald-100 shadow-lg bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                Perjalanan Pemulihan Kesehatan Anda
              </CardTitle>
              <p className="text-gray-600">
                Visualisasi proses penyembuhan alami dengan FitFactorHerbal
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {timeline.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-emerald-600">{step.time}</span>
                      <span className="text-sm text-gray-600">{step.progress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${step.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">92%</div>
                  <div className="text-sm text-gray-600">Tingkat Keberhasilan Pemulihan</div>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">15,000+</div>
                  <div className="text-sm text-gray-600">Keluarga Indonesia Terpulihkan</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ISPA Dedicated Section */}
<section className="mb-16">
  <Card className="border-2 border-blue-100 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
    <CardHeader className="text-center">
      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <HeartPulse size={40} className="text-white" />
      </div>
      <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
        Solusi Alami untuk ISPA (Infeksi Saluran Pernapasan Atas)
      </CardTitle>
      <p className="text-gray-600 max-w-3xl mx-auto">
        Musim pancaroba dan polusi udara meningkat - ISPA menjadi masalah kesehatan yang semakin umum. 
        FitFactorHerbal membantu memperkuat sistem pernapasan Anda dari dalam.
      </p>
    </CardHeader>
    <CardContent className="space-y-6">
      {/* Current Issue */}
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
        <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
          <Shield className="text-red-600" size={20} />
          Kondisi Terkini: Mengapa ISPA Semakin Mengkhawatirkan?
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• <strong>Polusi Udara Meningkat:</strong> Kualitas udara di kota-kota besar Indonesia memburuk, memicu infeksi saluran pernapasan</li>
          <li>• <strong>Perubahan Musim:</strong> Cuaca tidak menentu melemahkan sistem kekebalan tubuh</li>
          <li>• <strong>Komplikasi Serius:</strong> ISPA yang tidak ditangani dapat berkembang menjadi pneumonia atau bronkitis kronis</li>
          <li>• <strong>Dampak Jangka Panjang:</strong> Infeksi berulang merusak jaringan paru-paru dan menurunkan kapasitas pernapasan</li>
        </ul>
      </div>

      {/* How Ingredients Help */}
      <div>
        <h3 className="font-bold text-blue-700 mb-4 text-xl">
          Bagaimana FitFactorHerbal Membantu Melawan ISPA?
        </h3>
        
        <div className="space-y-4">
          <div className="bg-white border-l-4 border-blue-500 p-5 rounded-lg shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Zap size={20} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">1. Zingiber Officinale (Jahe Merah)</h4>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Aksi:</strong> Gingerol memiliki sifat anti-inflamasi dan antimikroba kuat yang melawan bakteri dan virus penyebab ISPA
                </p>
                <p className="text-sm text-blue-600 font-medium">
                  ✓ Melegakan tenggorokan dan mengurangi batuk dalam 3-5 hari
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border-l-4 border-cyan-500 p-5 rounded-lg shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-cyan-100 p-2 rounded-full">
                <Heart size={20} className="text-cyan-600" />
              </div>
              <div>
                <h4 className="font-semibold text-cyan-600 mb-2">2. Zingiber Zerumbet (Lempuyang)</h4>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Aksi:</strong> Zerumbone mengurangi peradangan pada saluran pernapasan dan meningkatkan produksi lendir pelindung
                </p>
                <p className="text-sm text-cyan-600 font-medium">
                  ✓ Meredakan sesak napas dan mempermudah pernapasan
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border-l-4 border-teal-500 p-5 rounded-lg shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-teal-100 p-2 rounded-full">
                <Shield size={20} className="text-teal-600" />
              </div>
              <div>
                <h4 className="font-semibold text-teal-600 mb-2">3. Piper Retrofractum (Cabe Jawa)</h4>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Aksi:</strong> Meningkatkan sirkulasi darah ke paru-paru, mempercepat pengiriman sel imun untuk melawan infeksi
                </p>
                <p className="text-sm text-teal-600 font-medium">
                  ✓ Mempercepat pemulihan dan mencegah infeksi berulang
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border-l-4 border-emerald-500 p-5 rounded-lg shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-emerald-100 p-2 rounded-full">
                <HeartPulse size={20} className="text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-emerald-600 mb-2">4. Curcuma Xanthorrhiza (Temulawak)</h4>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Aksi:</strong> Antioksidan kuat yang melindungi sel-sel paru dari kerusakan akibat radikal bebas dan polusi
                </p>
                <p className="text-sm text-emerald-600 font-medium">
                  ✓ Meningkatkan daya tahan tubuh terhadap infeksi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transformation Timeline */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
        <h3 className="font-bold text-blue-700 mb-4 text-xl text-center">
          Transformasi yang Akan Anda Rasakan
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-semibold text-gray-800">Hari 1-3: Gejala Mulai Mereda</p>
              <p className="text-sm text-gray-600">Batuk berkurang, tenggorokan terasa lebih nyaman, bernapas lebih lega</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-cyan-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-semibold text-gray-800">Minggu 1-2: Pemulihan Signifikan</p>
              <p className="text-sm text-gray-600">Lendir berkurang drastis, energi kembali, tidak lagi mudah lelah saat beraktivitas</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-semibold text-gray-800">Minggu 3-4: Perlindungan Jangka Panjang</p>
              <p className="text-sm text-gray-600">Sistem imun lebih kuat, tidak mudah tertular saat musim flu, kapasitas paru meningkat</p>
            </div>
          </div>
        </div>
      </div>

      {/* Real Results */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg shadow-md text-center border border-blue-100">
          <div className="text-4xl font-bold text-blue-600 mb-2">87%</div>
          <p className="text-sm text-gray-600">Pengguna melaporkan batuk berkurang dalam 5 hari</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md text-center border border-cyan-100">
          <div className="text-4xl font-bold text-cyan-600 mb-2">3-7 Hari</div>
          <p className="text-sm text-gray-600">Rata-rata waktu pemulihan dari ISPA akut</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md text-center border border-teal-100">
          <div className="text-4xl font-bold text-teal-600 mb-2">92%</div>
          <p className="text-sm text-gray-600">Tidak mengalami infeksi berulang setelah terapi rutin</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-lg text-center">
        <h3 className="text-white font-bold text-xl mb-2">
          Jangan Biarkan ISPA Mengganggu Hidup Anda!
        </h3>
        <p className="text-white text-sm mb-4">
          Lindungi diri dan keluarga dengan formula herbal terpercaya
        </p>
        <Button 
          size="lg" 
          className="bg-white text-orange-600 hover:bg-gray-100 font-bold"
          onClick={handlePay}
        >
          Pesan FitFactorHerbal Sekarang
          <ArrowRight className="ml-2" />
        </Button>
      </div>
    </CardContent>
  </Card>
</section>

{/* Nyeri Sendi Dedicated Section */}
<section className="mb-16">
  <Card className="border-2 border-purple-100 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
    <CardHeader className="text-center">
      <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <Zap size={40} className="text-white" />
      </div>
      <CardTitle className="text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
        Bebas dari Belenggu Nyeri Sendi: Kembalikan Kebebasan Bergerak Anda
      </CardTitle>
      <p className="text-gray-600 max-w-3xl mx-auto text-lg">
        Nyeri sendi bukan hanya rasa sakit - ini tentang kehilangan momen berharga bersama keluarga. 
        Tentang tidak bisa bermain dengan cucu, tidak bisa sholat dengan tenang, tidak bisa menikmati hidup seperti dulu.
      </p>
    </CardHeader>
    <CardContent className="space-y-6">
      {/* Emotional Opening */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-6 rounded-lg">
        <h3 className="font-bold text-amber-700 mb-3 text-xl">
          Apakah Anda Merasakan Ini?
        </h3>
        <div className="space-y-3 text-gray-700">
          <p className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">💔</span>
            <span><strong>Setiap pagi terasa berat</strong> - Bangun tidur dengan lutut kaku, pergelangan tangan nyeri, bahkan untuk sekedar berdiri butuh waktu lama</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">😢</span>
            <span><strong>Menolak undangan keluarga</strong> - Takut jalan jauh, takut harus naik tangga, kehilangan momen berkumpul dengan orang-orang terkasih</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">😔</span>
            <span><strong>Merasa menjadi beban</strong> - Butuh bantuan untuk hal-hal sederhana, kehilangan kemandirian yang selama ini dijaga</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">😰</span>
            <span><strong>Takut masa depan</strong> - Khawatir kondisi makin parah, membayangkan harus menggunakan kursi roda atau tongkat selamanya</span>
          </p>
        </div>
      </div>

      {/* The Real Problem */}
      <div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg">
        <h3 className="font-bold text-red-700 mb-4 text-xl flex items-center gap-2">
          <Shield size={24} className="text-red-600" />
          Akar Masalah yang Jarang Diketahui
        </h3>
        <p className="text-gray-700 mb-4">
          Kebanyakan orang mengira nyeri sendi hanya soal "aus" karena usia. <strong>SALAH BESAR!</strong>
        </p>
        <div className="bg-white p-5 rounded-lg border-l-4 border-red-500 mb-4">
          <p className="text-gray-800 font-semibold mb-2">Nyeri sendi sejati dimulai dari:</p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>🔴 <strong>Sirkulasi darah yang buruk</strong> - Nutrisi dan oksigen tidak sampai ke persendian</li>
            <li>🔴 <strong>Peradangan kronis</strong> - Pembuluh darah kecil di sekitar sendi tersumbat dan meradang</li>
            <li>🔴 <strong>Penumpukan toksin</strong> - Darah yang tidak lancar tidak bisa membawa racun keluar dari jaringan sendi</li>
            <li>🔴 <strong>Regenerasi sel terhambat</strong> - Tanpa aliran darah optimal, tulang rawan tidak bisa memperbaiki diri</li>
          </ul>
        </div>
        <p className="text-gray-700 italic">
          Inilah mengapa obat penghilang nyeri biasa hanya meredakan sementara - karena tidak mengatasi akar masalahnya: <strong>sirkulasi darah yang buruk!</strong>
        </p>
      </div>

      {/* How FitFactor Works */}
      <div>
        <h3 className="font-bold text-purple-700 mb-4 text-2xl text-center">
          Bagaimana FitFactorHerbal Menyembuhkan dari Akar?
        </h3>
        
        <div className="space-y-4">
          <div className="bg-white border-l-4 border-purple-500 p-5 rounded-lg shadow-md hover:shadow-lg transition-all">
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <Heart size={24} className="text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-purple-600 mb-2 text-lg">Langkah 1: Buka Jalan yang Tersumbat</h4>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Zingiber Officinale + Piper Retrofractum</strong> bekerja membuka pembuluh darah yang menyempit di sekitar persendian
                </p>
                <div className="bg-purple-50 p-3 rounded mt-2">
                  <p className="text-sm text-purple-700">
                    💡 <em>Bayangkan jalan tol yang macet tiba-tiba lancar - nutrisi, oksigen, dan sel penyembuh bisa mengalir dengan deras ke sendi Anda</em>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border-l-4 border-pink-500 p-5 rounded-lg shadow-md hover:shadow-lg transition-all">
            <div className="flex items-start gap-3">
              <div className="bg-pink-100 p-3 rounded-full">
                <Zap size={24} className="text-pink-600" />
              </div>
              <div>
                <h4 className="font-semibold text-pink-600 mb-2 text-lg">Langkah 2: Padamkan Api Peradangan</h4>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Zingiber Zerumbet (Zerumbone)</strong> memiliki kekuatan anti-inflamasi 60% lebih kuat dari obat biasa - tanpa efek samping!
                </p>
                <div className="bg-pink-50 p-3 rounded mt-2">
                  <p className="text-sm text-pink-700">
                    💡 <em>Seperti memadamkan api yang membakar sendi Anda selama bertahun-tahun - rasa nyeri mulai reda secara alami</em>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border-l-4 border-amber-500 p-5 rounded-lg shadow-md hover:shadow-lg transition-all">
            <div className="flex items-start gap-3">
              <div className="bg-amber-100 p-3 rounded-full">
                <Shield size={24} className="text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-600 mb-2 text-lg">Langkah 3: Perbaiki & Regenerasi</h4>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Sarang Burung Walet Premium</strong> mengandung asam amino esensial yang menjadi "bahan bangunan" untuk meregenerasi tulang rawan
                </p>
                <div className="bg-amber-50 p-3 rounded mt-2">
                  <p className="text-sm text-amber-700">
                    💡 <em>Bukan hanya menghilangkan nyeri - tapi membangun kembali persendian yang rusak, membuat Anda benar-benar pulih!</em>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border-l-4 border-emerald-500 p-5 rounded-lg shadow-md hover:shadow-lg transition-all">
            <div className="flex items-start gap-3">
              <div className="bg-emerald-100 p-3 rounded-full">
                <HeartPulse size={24} className="text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-emerald-600 mb-2 text-lg">Langkah 4: Lindungi Jangka Panjang</h4>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Curcuma Xanthorrhiza</strong> melindungi persendian dari kerusakan oksidatif dan menjaga elastisitas
                </p>
                <div className="bg-emerald-50 p-3 rounded mt-2">
                  <p className="text-sm text-emerald-700">
                    💡 <em>Seperti memberikan perisai pelindung - mencegah nyeri kembali lagi di masa depan</em>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transformation Journey */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-8 rounded-lg text-white">
        <h3 className="font-bold text-2xl mb-6 text-center">
          ✨ Transformasi Hidup yang Akan Anda Rasakan ✨
        </h3>
        
        <div className="space-y-5">
          <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white text-purple-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">1</div>
              <p className="font-bold text-lg">Minggu 1-2: Harapan Mulai Muncul</p>
            </div>
            <p className="text-sm ml-13 text-purple-100">
              Nyeri berkurang 30-40%. Anda mulai bisa tidur nyenyak tanpa terbangun karena sakit. Pagi hari tidak lagi menakutkan.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white text-pink-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">2</div>
              <p className="font-bold text-lg">Minggu 3-4: Kebebasan Kembali</p>
            </div>
            <p className="text-sm ml-13 text-pink-100">
              Nyeri berkurang 60-70%. Anda mulai bisa naik tangga tanpa mengeluh, sholat dengan khusyuk, bermain dengan cucu tanpa khawatir.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white text-amber-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">3</div>
              <p className="font-bold text-lg">Minggu 5-8: Hidup Seperti Dulu Lagi</p>
            </div>
            <p className="text-sm ml-13 text-amber-100">
              Nyeri berkurang 80-90%. Anda bisa jalan-jalan ke pasar, berkebun, melakukan hobi yang sudah lama ditinggalkan. Kemandirian kembali!
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white text-emerald-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">4</div>
              <p className="font-bold text-lg">Minggu 9-12: Kehidupan Baru Dimulai</p>
            </div>
            <p className="text-sm ml-13 text-emerald-100">
              Nyeri hampir hilang sepenuhnya. Anda bisa berjalan jauh, ikut acara keluarga, bahkan berwisata. Anda kembali menjadi diri Anda yang dulu - mandiri, bahagia, penuh semangat.
            </p>
          </div>
        </div>
      </div>

      {/* Real Stories */}
      <div>
        <h3 className="font-bold text-purple-700 mb-4 text-xl text-center">
          Kisah Nyata: Dari Kursi Roda ke Jalan Sehat Pagi
        </h3>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
              IY
            </div>
            <div>
              <p className="font-semibold text-gray-800">Ibu Yanti (63 tahun) - Jakarta Selatan</p>
              <p className="text-sm text-gray-600">Nyeri Lutut & Panggul Kronis - 5 Tahun</p>
            </div>
          </div>
          <blockquote className="text-gray-700 italic mb-3 border-l-4 border-purple-400 pl-4">
            "Saya sudah 5 tahun tidak bisa sholat dengan berdiri penuh. Setiap hari harus minum obat penghilang nyeri yang membuat perut saya sakit. Cucu-cucu sedih karena nenek tidak bisa bermain sama mereka. Suami saya sampai menangis melihat saya kesakitan.
            <br/><br/>
            Setelah 2 bulan konsumsi FitFactorHerbal, nyeri di lutut saya berkurang drastis. Bulan ke-3, saya sudah bisa sholat berdiri sempurna! Sekarang saya bisa jalan-jalan ke pasar, masak untuk keluarga, bahkan ikut arisan teman-teman. 
            <br/><br/>
            Saya merasa lahir kembali. Ini bukan hanya soal hilangnya nyeri - ini soal mendapatkan kehidupan saya kembali. Terima kasih FitFactorHerbal!"
          </blockquote>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center border-2 border-purple-100">
          <div className="text-5xl font-bold text-purple-600 mb-2">89%</div>
          <p className="text-sm text-gray-600">Pengguna melaporkan nyeri berkurang 50%+ dalam 4 minggu</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center border-2 border-pink-100">
          <div className="text-5xl font-bold text-pink-600 mb-2">94%</div>
          <p className="text-sm text-gray-600">Bisa kembali melakukan aktivitas sehari-hari tanpa bantuan</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center border-2 border-amber-100">
          <div className="text-5xl font-bold text-amber-600 mb-2">3x</div>
          <p className="text-sm text-gray-600">Lebih efektif dibanding obat penghilang nyeri biasa</p>
        </div>
      </div>

      {/* Final Message */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 rounded-lg text-center">
        <h3 className="text-white font-bold text-2xl mb-3">
          Jangan Biarkan Nyeri Sendi Mencuri Kebahagiaan Anda!
        </h3>
        <p className="text-white mb-2">
          Setiap hari yang terlewat adalah momen berharga yang hilang bersama keluarga
        </p>
        <p className="text-white text-lg font-semibold mb-5">
          Kehidupan tanpa nyeri menunggu Anda - mulai hari ini!
        </p>
        <Button 
          size="lg" 
          className="bg-white text-orange-600 hover:bg-gray-100 font-bold text-lg px-10 py-6"
          onClick={handlePay}
        >
          Ya, Saya Ingin Bebas dari Nyeri!
          <ArrowRight className="ml-2" />
        </Button>
      </div>
    </CardContent>
  </Card>
</section>

{/* Penyakit Kronis (Stroke, Darah Tinggi) Section */}
<section className="mb-16">
  <Card className="border-2 border-red-100 shadow-lg bg-gradient-to-br from-red-50 to-rose-50">
    <CardHeader className="text-center">
      <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <HeartPulse size={40} className="text-white" />
      </div>
      <CardTitle className="text-3xl bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-4">
        Penyakit Kronis: Mengapa Daya Tahan Tubuh adalah Kunci Pemulihan?
      </CardTitle>
      <p className="text-gray-600 max-w-3xl mx-auto text-lg">
        Stroke, darah tinggi, diabetes - dokter bilang "harus kontrol selamanya". Tapi pernahkah Anda bertanya: 
        <strong className="text-red-600"> Mengapa tubuh saya tidak bisa melawan penyakit ini sendiri?</strong>
      </p>
    </CardHeader>
    <CardContent className="space-y-6">
      {/* Eye Opening Truth */}
      <div className="bg-gradient-to-r from-red-600 to-rose-600 p-8 rounded-lg text-white">
        <h3 className="font-bold text-2xl mb-4 text-center">
          🔓 Rahasia yang Jarang Dokter Ceritakan
        </h3>
        <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
          <p className="text-lg mb-4 leading-relaxed">
            Tubuh manusia adalah mesin penyembuhan yang <strong>LUAR BIASA CANGGIH</strong>. Setiap detik, jutaan sel bekerja untuk:
          </p>
          <ul className="space-y-3 text-white/90">
            <li className="flex items-start gap-2">
              <span className="text-yellow-300 font-bold text-xl">✓</span>
              <span>Memperbaiki pembuluh darah yang rusak</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-300 font-bold text-xl">✓</span>
              <span>Membersihkan plak dan sumbatan di arteri</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-300 font-bold text-xl">✓</span>
              <span>Meregenerasi jaringan otak yang terdampak stroke</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-300 font-bold text-xl">✓</span>
              <span>Mengatur tekanan darah secara alami</span>
            </li>
          </ul>
          <div className="mt-6 bg-yellow-400 text-red-900 p-4 rounded-lg font-bold text-center text-lg">
            TAPI... Semua ini HANYA BISA TERJADI jika daya tahan tubuh Anda KUAT!
          </div>
        </div>
      </div>

      {/* The Problem */}
      <div>
        <h3 className="font-bold text-red-700 mb-4 text-2xl text-center">
          Mengapa Penyakit Kronis Sulit Sembuh?
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-5 rounded-lg border-l-4 border-red-500 shadow-md">
            <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
              <span className="text-2xl">🔴</span> Masalah #1: Sirkulasi Buruk
            </h4>
            <p className="text-sm text-gray-700">
              Darah adalah "kurir" yang membawa sel imun, nutrisi, dan oksigen untuk penyembuhan. Saat sirkulasi buruk, 
              <strong> sistem imun tidak bisa mencapai area yang rusak</strong> - seperti tentara yang tidak bisa sampai ke medan perang.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border-l-4 border-rose-500 shadow-md">
            <h4 className="font-semibold text-rose-600 mb-3 flex items-center gap-2">
              <span className="text-2xl">🔴</span> Masalah #2: Peradangan Kronis
            </h4>
            <p className="text-sm text-gray-700">
              Penyakit kronis menciptakan "api peradangan" yang terus menyala. Ini menguras energi tubuh dan 
              <strong> melemahkan daya tahan tubuh</strong> - seperti memerangi kebakaran yang tidak pernah padam.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border-l-4 border-orange-500 shadow-md">
            <h4 className="font-semibold text-orange-600 mb-3 flex items-center gap-2">
              <span className="text-2xl">🔴</span> Masalah #3: Siklus Setan
            </h4>
            <p className="text-sm text-gray-700">
              Sirkulasi buruk → Daya tahan lemah → Penyakit makin parah → Sirkulasi makin buruk. 
              <strong> Inilah mengapa penyakit kronis terus memburuk</strong> - Anda terjebak dalam lingkaran setan!
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border-l-4 border-amber-500 shadow-md">
            <h4 className="font-semibold text-amber-600 mb-3 flex items-center gap-2">
              <span className="text-2xl">🔴</span> Masalah #4: Obat Hanya Menutupi
            </h4>
            <p className="text-sm text-gray-700">
              Obat tekanan darah hanya menurunkan angka, bukan memperbaiki pembuluh darah. Obat stroke hanya mencegah sumbatan baru, bukan meregenerasi otak. 
              <strong> Gejala hilang, tapi akar masalah tetap ada!</strong>
            </p>
          </div>
        </div>
      </div>

      {/* The Solution Mindset Shift */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-8 rounded-lg border-2 border-emerald-200">
        <h3 className="font-bold text-emerald-700 mb-4 text-2xl text-center">
          💡 Perubahan Paradigma: Bukan "Kontrol", Tapi "PULIHKAN"
        </h3>
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <p className="text-gray-700 mb-3">
              <strong className="text-emerald-600 text-lg">Paradigma Lama (SALAH):</strong>
            </p>
            <p className="text-gray-600 italic">
              "Saya punya darah tinggi/stroke, jadi harus minum obat selamanya untuk mengontrol gejala."
            </p>
          </div>

          <div className="text-center text-3xl font-bold text-red-600">↓</div>

          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-5 rounded-lg shadow-lg text-white">
            <p className="mb-3">
              <strong className="text-yellow-300 text-lg">Paradigma Baru (BENAR):</strong>
            </p>
            <p className="text-lg font-semibold">
              "Tubuh saya punya KEMAMPUAN ALAMI untuk menyembuhkan diri. Saya perlu mengembalikan DAYA TAHAN TUBUH dengan memperbaiki SIRKULASI DARAH, agar sistem penyembuhan alami saya bisa bekerja optimal!"
            </p>
          </div>
        </div>
      </div>

      {/* How FitFactor Breaks The Cycle */}
      <div>
        <h3 className="font-bold text-red-700 mb-6 text-2xl text-center">
          Bagaimana FitFactorHerbal Memutus Siklus Setan?
        </h3>
        
        <div className="relative">
          {/* Central Circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-center z-10 shadow-xl">
            <div>
              <div className="text-2xl">💪</div>
              <div className="text-xs">DAYA TAHAN</div>
              <div className="text-xs">PULIH!</div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="bg-white border-l-4 border-emerald-500 p-5 rounded-lg shadow-md hover:shadow-xl transition-all">
              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 p-3 rounded-full flex-shrink-0">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-600 mb-2 text-lg">Langkah Pertama: Buka Jalan Darah</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Zingiber Officinale + Piper Retrofractum</strong> membuka pembuluh darah yang tersumbat dan melebarkan arteri
                  </p>
                  <div className="bg-emerald-50 p-3 rounded-lg text-sm">
                    <p className="text-emerald-700 font-medium mb-2">⚡ Efek Langsung:</p>
                    <ul className="space-y-1 text-gray-700">
                    <li>→ Tekanan darah mulai turun secara alami (tanpa obat keras!)</li>
                    <li>→ Oksigen mengalir ke otak pasca-stroke</li>
                    <li>→ Nutrisi mencapai setiap sel tubuh</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        </div>

      </CardContent>
    </Card>
</section>

        {/* Product Details */}
        <section className="mb-16">
          <Card className="border-2 border-emerald-100 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Komposisi Bahan Alami Premium
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-emerald-500 pl-4">
                <h3 className="font-semibold text-emerald-600 mb-2">1. Zingiber Officinale (250mg)</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Kaya gingerol untuk melebarkan pembuluh darah</li>
                  <li>• Mencegah pembekuan darah penyebab penyakit kronis seperti darah tinggi, ISPA, stroke, dll</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-orange-600 mb-2">2. Zingiber Zerumbet (250mg)</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Mengandung zerumbone sebagai anti-inflamasi kuat</li>
                  <li>• Mengurangi peradangan pembuluh darah</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-teal-500 pl-4">
                <h3 className="font-semibold text-teal-600 mb-2">3. Piper Retrofractum (166.67mg)</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Melancarkan peredaran darah ke seluruh tubuh termasuk otak</li>
                  <li>• Mendukung pemulihan neurologis pasca sakit parah</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-emerald-500 pl-4">
                <h3 className="font-semibold text-emerald-600 mb-2">4. Curcuma Xanthorrhiza (133.33mg)</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Melindungi pembuluh darah dari kerusakan oksidatif</li>
                  <li>• Menjaga elastisitas arteri</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-orange-600 mb-2">5. Sarang Burung Walet Premium</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Kaya asam amino esensial untuk regenerasi sel</li>
                  <li>• Pemulihan jaringan rusak akibat gangguan sirkulasi darah</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Research Section */}
        <section className="mb-16">
          <Card className="border-2 border-emerald-100 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Penelitian & Studi Klinis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {researchPoints.map((research, index) => (
                  <div key={index} className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                    <h3 className="font-semibold text-emerald-600 mb-2">{research.title}</h3>
                    <p className="text-sm text-gray-700 mb-2">{research.description}</p>
                    <Badge variant="outline" className="text-sm text-gray-700 mb-2">{research.source}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Kisah Pemulihan Nyata
            </h2>
            <p className="text-gray-600">Testimoni keluarga Indonesia yang telah merasakan manfaatnya</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 border-emerald-100 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Badge className="ml-auto bg-emerald-100 text-emerald-700">{testimonial.condition}</Badge>
                  </div>
                  <blockquote className="text-gray-700 italic mb-4">
                    "{testimonial.text}"
                  </blockquote>
                  <div className="text-sm font-semibold text-gray-600">
                    - {testimonial.name}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Video Testimonial Section */}
        <section className="mb-16">
          <Card className="border-2 border-emerald-200 shadow-lg bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                Video Inspiratif: Kisah Nyata Syarifudin Arif
              </CardTitle>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Dengarkan langsung cerita pemulihan dari Bpk. Syarifudin Arif, 
                pejuang kanker otak stadium IV, yang terbantu dengan terapi audio.
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="max-w-sm mx-auto md:max-w-md">
                <div className="relative w-full aspect-[9/16] mb-4 rounded-lg overflow-hidden shadow-xl">
                  <video 
                    className="w-full h-full object-cover" 
                    controls 
                    src="https://fjydiciehzqfhbyfbyke.supabase.co/storage/v1/object/public/Dagang%20Meta/arif.mp4"
                    poster="https://fjydiciehzqfhbyfbyke.supabase.co/storage/v1/object/public/Dagang%20Meta/arif.jpg" // Updated poster
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
              <p className="text-sm text-gray-700 text-center mb-2">
                <strong>Instagram:</strong> <a href="https://www.instagram.com/syarifudin_arif25" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@syarifudin_arif25</a>
              </p>
              <p className="text-sm text-gray-600 text-center">
                Terapi audio ini membantu daya tahan tubuh selama proses penyembuhan dan memberikan semangat bagi pejuang kanker.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Stress Free Section */}
        <section className="mb-16">
          <Card className="border-2 border-orange-200 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-2">
                <Play size={24} className="text-orange-600" />
                Teknik Audio Penyembuhan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {techniques.map((technique, index) => (
                  <div key={index} className="border border-emerald-200 p-4 rounded-lg hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">{technique.title}</h3>
                        <Badge variant="outline" className="text-xs mt-1">{technique.duration}</Badge>
                      </div>
                      <Button size="sm" variant="outline" className="text-orange-600 border-orange-600">
                        <Play size={16} />
                      </Button>
                    </div>
                    <p className="text-sm text-emerald-600 font-medium mb-1">{technique.benefit}</p>
                    <p className="text-xs text-gray-600 italic">{technique.preview}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Package Selection */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Paket Pemulihan Kesehatan
            </h2>
            <p className="text-lg text-gray-600">
              Pilih paket yang sesuai dengan kebutuhan pemulihan Anda
            </p>
          </div>

          <div className="grid gap-4 mb-8">
            {packages.map((pkg, index) => (
              <Card key={index} className={`cursor-pointer transition-all duration-300 hover:scale-105 border-2 bg-white ${
                quantity === pkg.quantity ? 'border-emerald-500 shadow-lg' : 'border-emerald-100'
              }`} onClick={() => setQuantity(pkg.quantity)}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{pkg.name}</h3>
                      <p className="text-sm text-gray-600">{pkg.description}</p>
                      <Badge className="mt-2 bg-emerald-500">{pkg.quantity} botol</Badge>
                    </div>
                    <div className="text-right">
                      {pkg.savings > 0 && (
                        <div className="text-sm text-orange-600 font-semibold">
                          Hemat Rp {pkg.savings.toLocaleString('id-ID')}
                        </div>
                      )}
                      <div className="text-2xl font-bold text-emerald-600">
                        Rp {pkg.price.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>



        {/* Final CTA */}
        <section className="text-center">
          <Card className="border-2 border-emerald-200 shadow-lg bg-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                Mulai Perjalanan Pemulihan Anda Hari Ini
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Bergabunglah dengan ribuan keluarga Indonesia yang telah merasakan manfaat 
                FitFactorHerbal untuk kesehatan sirkulasi darah yang lebih baik.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg px-8 py-6"
                  onClick={handlePay}
                >
                  <Users className="mr-2" />
                  Pesan Sekarang - Rp 450.000 3 Botol
                </Button>
              </div>
              
              <p className="text-sm text-gray-600">
                ✅ Gratis Ongkir Seluruh Indonesia | ✅ Garansi Uang Kembali 30 Hari | ✅ Konsultasi Gratis
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default FitFactorLP;