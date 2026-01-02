import { useState } from "react";
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

const Home = () => {
  const [quantity, setQuantity] = useState(1);
  const pricePerBottle = 450000;

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
                <Card key={index} className="text-center hover:scale-105 transition-all duration-300 border-2 border-emerald-100 shadow-lg">
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
          <Card className="border-2 border-emerald-100 shadow-lg">
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

        {/* Product Details */}
        <section className="mb-16">
          <Card className="border-2 border-emerald-100 shadow-lg">
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
          <Card className="border-2 border-emerald-100 shadow-lg">
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
                    <Badge variant="outline" className="text-xs">{research.source}</Badge>
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
              <Card key={index} className="border-2 border-emerald-100 shadow-lg">
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
          <Card className="border-2 border-emerald-200 shadow-lg">
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
                    src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif.mp4"
                    poster="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif2.jpg" // Updated poster
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
          <Card className="border-2 border-orange-200 shadow-lg">
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
              <Card key={index} className={`cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
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
          <Card className="border-2 border-emerald-200 shadow-lg">
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

export default Home;