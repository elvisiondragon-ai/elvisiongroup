import React, { useState } from 'react';
import { Play, Quote, CheckCircle, Brain, Target, Shield, Zap, Eye, Triangle, Heart, Gem, Scale, ArrowRight, Sparkles } from 'lucide-react';

const TestimonyPage = () => {
  const [activeVideo, setActiveVideo] = useState(null);

  const testimonies = [
    {
      name: "Agus",
      title: "SH MH AGUS MULYADI",
      description: "KEPALA INTELIJEN PANGANDARAN JAWA BARAT",
      video: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/agus.mp4",
      poster: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/agus.jpg"
    },
    {
      name: "Vio",
      title: "Influencer",
      description: "",
      video: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/vio.mp4",
      poster: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/vio.jpg"
    },
    {
      name: "Lena",
      title: "ANAK SMA",
      description: "",
      video: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/lena.mp4",
      poster: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/lena.jpg"
    },
    {
      name: "Umi",
      title: "Pemilik Pesantren",
      description: "",
      video: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/umi.mp4",
      poster: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/umi.jpg"
    },
    {
      name: "Habib",
      title: "Umar",
      description: "UStadz",
      video: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/habib.mp4",
      poster: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/habib.jpg"
    },
    {
      name: "Arif",
      title: "Penyintas Kanker Otak Stage 4",
      description: "",
      video: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/arif.mp4",
      poster: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/arif.jpg"
    },
    {
      name: "Felicia",
      title: "Pengusaha",
      description: "",
      video: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/felicia.mp4",
      poster: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/felicia.jpg"
    },
    {
      name: "Dr Gumilar",
      title: "HIPNOTERAPIST AND PEJABAT DAERAH",
      description: "DR GUMILAR",
      video: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/dr.mp4", // Placeholder
      poster: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/dr.jpg" // Placeholder
    }
  ];

  const communityImages = [
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/photo_2025-07-12%2009.48.35_28_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi%20santri_12_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_15taun_6_11zon.jpg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_17juli_3_11zon.jpg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_28juli_5_11zon.jpg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_2jt_16_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_3minggu_17_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_audio1_9_11zon.jpg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_audio2_8_11zon.jpg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_damai_18_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_depres_27_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_eldi3_13_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_jahit_29_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testI_jahitan_19_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_JOE_26_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_karimah_4_11zon.jpg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_kelas1_14_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_marah_24_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_muklas_25_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_pelakor_22_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_pesantren_7_11zon.jpg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_pesantreren01_15_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_proyek_2_11zon.jpg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_santet_11_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi01_20_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi03_21_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi05_23_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi09_10_11zon.jpg"
  ];

  const quotes = [
    "Saya baru sadar, selama ini saya selalu dapat apa yang saya mau — tapi selalu dibayar mahal. Setelah eL Vision, target tetap tercapai, tapi hidup saya tidak lagi berantakan.",
    "Bukan motivasi. Bukan sugesti kosong. Yang berubah itu cara sistem dalam diri saya bekerja. Saya tidak lagi 'memaksa', tapi tetap bergerak.",
    "Biasanya setiap naik level bisnis, pasti ada masalah keluarga atau kesehatan. Kali ini tidak. Itu yang paling terasa berbeda.",
    "Saya kira stres adalah harga sukses. Ternyata itu hanya efek samping dari sistem bawah sadar yang salah set."
  ];

  const howItWorks = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Membongkar Struktur Niat",
      description: "Mengurai lapisan bawah sadar untuk mengidentifikasi muatan emosi, ketakutan, dan dorongan destruktif yang tersembunyi"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Kalibrasi Sistem Internal",
      description: "Memisahkan tujuan dari konsekuensi negatif yang tidak perlu, sehingga pencapaian tidak membawa penderitaan"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Efisiensi Tanpa Pemaksaan",
      description: "Sistem bekerja natural, tujuan tercapai dengan relasi stabil, tubuh sehat, dan mental tetap utuh"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Cara Kerja eL Vision Group
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            14+ Tahun Riset Alam Bawah Sadar Manusia
          </p>
        </div>

        {/* Problem Statement */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-6 text-center">Masalah yang Tidak Disadari</h2>
            <div className="space-y-4 text-lg text-gray-200">
              <p className="text-center italic">
                "Jika saya fokus dan jernih ke tujuan, maka tujuan itu pasti tercapai."
              </p>
              <p className="text-center font-semibold text-yellow-400">
                Itu BENAR. Namun...
              </p>
              <p className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
                <strong className="text-red-400">Yang Dilupakan:</strong><br/>
                Setiap keinginan yang diprogram ke alam bawah sadar selalu membawa paket konsekuensi.
              </p>
            </div>
          </div>
        </div>

        {/* Example Case */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-center text-purple-400">Contoh Nyata</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <h4 className="font-bold text-green-400 mb-2">Target: 1 Miliar Rupiah ✓</h4>
                  <p className="text-sm text-gray-300">Alam bawah sadar tidak menolak — justru akan mencarikan jalan</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-yellow-400 font-semibold mb-2">
                  TAPI YANG TERJADI MESKI MENDAPATKAN 1 Miliar, juga
                </p>
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                  <p className="text-sm">❌ Mendapatkan tekanan dari berbagai arah</p>
                </div>
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                  <p className="text-sm">❌ Konflik relasi & keluarga</p>
                </div>
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                  <p className="text-sm">❌ Stress kronis & gangguan kesehatan</p>
                </div>
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                  <p className="text-sm">❌ Pengkhianatan orang terdekat</p>
                </div>
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                  <p className="text-sm">❌ Rasa hampa setelah tercapai</p>
                </div>
              </div>
            </div>
            <p className="text-center mt-6 text-yellow-400 font-semibold">
              Bukan karena 1 Miliar itu buruk — tapi struktur bawah sadar tidak memfilter konsekuensi
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center">Apa yang eL Vision Lakukan Berbeda</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm hover:scale-105 transition-transform">
                <div className="text-purple-400 mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Process Section - Apa yang Dilakukan eL Vision */}
        <div className="max-w-6xl mx-auto mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Apa yang Dilakukan eL Vision?
            </h2>
            <p className="text-xl text-gray-300">
              Metode Sistematis Mengelola Energi Bawah Sadar
            </p>
          </div>

          <div className="relative">
            {/* Connection Line (Desktop) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-pink-500/20 -translate-x-1/2 z-0"></div>

            <div className="space-y-24 relative z-10">
              {/* Stage 1: Kalibrasi */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1 text-right space-y-4">
                  <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-500/30 px-4 py-2 rounded-full text-blue-400 font-semibold mb-2">
                    <Target className="w-5 h-5" /> Tahap 1
                  </div>
                  <h3 className="text-3xl font-bold text-white">Meluruskan Fokus (Kalibrasi)</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Fokus pada 1 titik. Setiap 1 fokus yang berhasil difokuskan menciptakan <span className="text-blue-400 font-bold">1 unit energi</span>.
                  </p>
                  <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 inline-block">
                    <p className="text-sm text-gray-400 mb-1">Target Akumulasi</p>
                    <p className="text-2xl font-bold text-white flex items-center justify-end gap-2">
                      10.000 Energi <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </p>
                    <p className="text-xs text-gray-500">/ jam (estimasi)</p>
                  </div>
                </div>
                <div className="order-1 md:order-2 flex justify-start md:justify-center">
                  <div className="relative w-full max-w-sm aspect-square">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-slate-900 to-blue-950 border border-blue-500/30 rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-500">
                      <Target className="w-20 h-20 text-blue-400 mb-6" />
                      <div className="w-full bg-slate-800 rounded-full h-4 mb-4 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-full w-[75%] animate-pulse"></div>
                      </div>
                      <p className="text-blue-200 font-mono">Loading Energy...</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stage 2: Membentuk Visi Mentah */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-1 flex justify-end md:justify-center">
                   <div className="relative w-full max-w-md">
                    <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-3xl"></div>
                    <div className="relative bg-slate-900/80 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
                      <div className="flex flex-col gap-4">
                        {/* Visi Realita */}
                        <div className="bg-gradient-to-r from-purple-900/40 to-slate-900 border border-purple-500/40 rounded-xl p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <Heart className="w-6 h-6 text-pink-400 fill-pink-400/20" />
                            <h4 className="font-bold text-lg text-pink-100">Visi Realita</h4>
                            <span className="text-xs bg-pink-500/20 text-pink-300 px-2 py-1 rounded-full border border-pink-500/20">Wajib</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {["Jelas (Clarity)", "Pasrah", "Lepas Lega", "Khusyuk", "Bahagia"].map((tag, i) => (
                              <span key={i} className="text-xs bg-slate-800 text-gray-300 px-2 py-1 rounded border border-slate-700">{tag}</span>
                            ))}
                          </div>
                          <p className="text-xs text-pink-300 mt-3 italic">"Syukur adalah kunci pembuka"</p>
                        </div>

                        {/* Arrow */}
                        <div className="flex justify-center -my-2 z-10">
                          <div className="bg-slate-900 border border-slate-700 rounded-full p-2">
                            <Scale className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>

                        {/* Visi Keinginan */}
                        <div className="bg-gradient-to-r from-slate-900 to-cyan-900/40 border border-cyan-500/40 rounded-xl p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <Gem className="w-6 h-6 text-cyan-400" />
                            <h4 className="font-bold text-lg text-cyan-100">Visi Keinginan</h4>
                          </div>
                          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                            {[
                              "Kesehatan",
                              "Memperbaiki tulang belakang",
                              "Melunakan sel kanker (Pak Arif)",
                              "Rumah tangga adem",
                              "Pasangan yang tepat",
                              "Uang",
                              "Pekerjaan",
                              "Relasi"
                            ].map((item, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                                <div className="w-1 h-1 bg-cyan-500 rounded-full"></div>
                                {item}
                              </li>
                            ))}
                          </ul>
                          <div className="flex items-center gap-2 text-xs text-cyan-300 bg-cyan-900/20 p-2 rounded">
                            <ArrowRight className="w-4 h-4" />
                            <span>Berbanding lurus dengan Visi Realita</span>
                          </div>
                        </div>
                      </div>
                    </div>
                   </div>
                </div>
                <div className="order-2 space-y-4">
                  <div className="inline-flex items-center gap-2 bg-purple-900/30 border border-purple-500/30 px-4 py-2 rounded-full text-purple-400 font-semibold mb-2">
                    <Eye className="w-5 h-5" /> Tahap 2
                  </div>
                  <h3 className="text-3xl font-bold text-white">Membentuk Visi Mentah</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Setelah energi terkumpul, kita membentuk visi. <strong className="text-white">Kuncinya:</strong> Visi Keinginan tidak akan terwujud presisi jika Visi Realita (kondisi batin) belum beres.
                  </p>
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-yellow-200 text-sm">
                      "Jika ingin Visi Keinginan terwujud presisi (seperti melunakkan sel kanker Pak Arif), kita harus memperbaiki realita dulu—atau disebut <strong className="text-yellow-400">SYUKUR</strong>."
                    </p>
                  </div>
                </div>
              </div>

              {/* Stage 3: Aktivasi */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1 text-right space-y-4">
                  <div className="inline-flex items-center gap-2 bg-pink-900/30 border border-pink-500/30 px-4 py-2 rounded-full text-pink-400 font-semibold mb-2">
                    <Sparkles className="w-5 h-5" /> Tahap 3
                  </div>
                  <h3 className="text-3xl font-bold text-white">Aktivasi</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Setelah pondasi realita kokoh dan visi keinginan jelas, kita masuk ke tahap aktivasi menggunakan metode khusus.
                  </p>
                  <h4 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                    eL Triangle
                  </h4>
                </div>
                <div className="order-1 md:order-2 flex justify-start md:justify-center">
                  <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
                    <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
                     <div className="relative w-48 h-48">
                        <Triangle className="w-full h-full text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)] stroke-[1]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_white] animate-ping"></div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-2xl p-8">
            <h3 className="text-3xl font-bold mb-6 text-center">Hasilnya</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Tujuan tercapai lebih natural",
                "Relasi tetap stabil",
                "Tubuh tidak kolaps",
                "Mental tidak hancur",
                "Hidup tetap utuh, bukan sekadar 'menang tapi rusak'"
              ].map((result, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <p className="text-gray-200">{result}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonies Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center">Testimoni Nyata</h2>
          
          {/* Quote Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-5xl mx-auto">
            {quotes.map((quote, index) => (
              <div key={index} className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
                <Quote className="w-8 h-8 text-purple-400 mb-3" />
                <p className="text-gray-200 italic">{quote}</p>
              </div>
            ))}
          </div>

          {/* Video Testimonies */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {testimonies.map((testimony, index) => (
              <div key={index} className="group">
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all">
                  <div className="relative aspect-[9/16]">
                    <video
                      className="w-full h-full object-cover"
                      poster={testimony.poster}
                      controls
                      preload="metadata"
                    >
                      <source src={testimony.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="p-4 text-center">
                    <p className="font-semibold text-purple-400">{testimony.name}</p>
                    {testimony.title && <p className="text-sm text-gray-300">{testimony.title}</p>}
                    {testimony.description && <p className="text-xs text-gray-400">{testimony.description}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Community Images */}
          <div className="mt-20">
            <h2 className="text-4xl font-bold mb-12 text-center">Testimoni Komunitas</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {communityImages.map((imageUrl, index) => (
                <div key={index} className="group">
                  <div className="bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all">
                    <img
                      src={imageUrl}
                      alt={`Testimoni Komunitas ${index + 1}`}
                      className="w-full h-auto object-cover rounded-xl"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conclusion */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/40 rounded-2xl p-10 text-center backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-6">Kesimpulan</h2>
            <p className="text-xl text-gray-200 mb-4">
              eL Vision Group <strong className="text-purple-400">bukan tentang menginginkan lebih keras</strong>,
            </p>
            <p className="text-xl text-gray-200 mb-6">
              melainkan <strong className="text-pink-400">memahami bagaimana alam bawah sadar bekerja agar Anda tidak perlu menderita untuk berhasil</strong>.
            </p>
            <div className="space-y-2 text-lg">
              <p className="text-green-400 font-semibold">✓ Tujuan tetap tercapai</p>
              <p className="text-green-400 font-semibold">✓ Hidup tidak perlu dikorbankan</p>
            </div>
            <div className="mt-8">
              <a 
                href="https://app.elvisiongroup.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105"
              >
                Masuk ke Ecosystem
              </a>
            </div>
          </div>
        </div>

        {/* Community Images */}
      </div>
    </div>
  );
};

export default TestimonyPage;