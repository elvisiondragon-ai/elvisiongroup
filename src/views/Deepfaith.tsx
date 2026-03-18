"use client";
import React, { useState, useEffect } from 'react';
import { CheckCircle, Quote, Play, Brain, Target, Shield, Zap, Eye, Triangle, Heart, Gem, Scale, ArrowRight, Sparkles } from 'lucide-react';

export default function ElVisionLanding() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const testimonies = [
    {
      name: "Arif - Mind Method",
      title: "Penyintas Kanker Otak Stage 4",
      description: "Stop Battling Your Health: Try the Mind Method for Lasting Recovery",
      video: "https://www.youtube.com/embed/dPlA9jHzI0M"
    },
    {
      name: "Arif - Cellular Recovery",
      title: "Mindset Transformation",
      description: "The Secret to Cellular Recovery: What Nobody Tells You About Healing",
      video: "https://www.youtube.com/embed/iADevAyT7us"
    },
    {
      name: "Habib Umar Assegaf",
      title: "Ustadz",
      description: "Spiritual Elevation: A Testimony of Faith and Mental Clarity",
      video: "https://www.youtube.com/embed/jD6XlkCL4sI"
    },
    {
      name: "Pak AGUS SH., MH.",
      title: "Kepala Intelijen",
      description: "Professional Excellence & Inner Balance: A High-Achiever’s Perspective",
      video: "https://www.youtube.com/embed/kVgfxHX_GeY"
    },
    {
      name: "Dr. Gumilar",
      title: "Hypnotherapist",
      description: "A Medical Endorsement: Why Mindset is the Ultimate Key to Recovery",
      video: "https://www.youtube.com/embed/U6NsL9RL9rY"
    },
    {
      name: "eL Vision - Magnet",
      title: "Problem Solver",
      description: "The Root of the Solution: How I Stopped Managing Problems and Started Solving Them",
      video: "https://www.youtube.com/embed/cPwGC0NW8s4"
    },
    {
      name: "Lena",
      title: "Student",
      description: "Manifesting Abundance: Moving from Scarcity to Being Chased by Prosperity",
      video: "https://www.youtube.com/embed/-9u7v6vT5ds"
    },
    {
      name: "Gen Z",
      title: "Modern Lifestyle",
      description: "The Ultimate Mental Edge: Why This is the Modern Life Hack We’ve Been Searching For",
      video: "https://www.youtube.com/embed/wQv7mHlE-5o"
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
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi01_20_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi03_21_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi05_23_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi09_10_11zon.jpg"
  ];

  const quotes = [
    "Saya baru sadar, selama ini saya selalu dapat apa yang saya mau — tapi selalu dibayar mahal. Setelah eL Vision, target tetap tercapai, tapi hidup saya tidak lagi berantakan.",
    "Bukan motivasi. Bukan sugesti kosong. Yang berubah itu cara sistem dalam diri saya bekerja. Saya tidak lagi 'memaksa', tapi tetap bergerak.",
    "Biasanya setiap naik level bisnis, pasti ada masalah keluarga atau kesehatan. Kali ini tidak. Itu yang paling terasa berbeda.",
    "Saya kira stres adalah harga sukses. Ternyata itu hanya efek samping dari sistem bawah sadar yang salah set."
  ];

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-sans overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]" />
        <div 
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div 
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * -0.2}px)` }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          {/* Atom Visualization */}
          <div className={`relative mb-12 transition-all duration-1500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <div className="relative w-32 h-32 mx-auto">
              {/* Nucleus */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-br from-cyan-400 to-amber-400 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.6)]" />
              
              {/* Orbits */}
              {[0, 60, 120].map((rotation, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-cyan-500/30 rounded-full animate-spin"
                  style={{ 
                    animationDuration: `${8 + i * 2}s`,
                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`
                  }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                </div>
              ))}
            </div>
          </div>

          <div className={`space-y-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-block px-4 py-2 border border-cyan-500/50 rounded-full text-cyan-400 text-sm tracking-wider mb-4 bg-cyan-500/5 backdrop-blur-sm">
              eL Vision
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-none tracking-tight mb-6">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-amber-400">
                DEEP FAITH
              </span>
            </h1>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-amber-400">
                KENAPA KEYAKINAN
              </span>
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-cyan-400">
                DAN KEINGINANMU
              </span>
              <span className="block mt-2 text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                HANCUR LEBUR?
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
              Bukan karena kurang usaha. Tapi karena kamu menggunakan <span className="text-cyan-400 font-semibold">ALAT YANG SALAH</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 rounded-lg font-bold text-slate-950 transition-all duration-300 hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:scale-105">
                <span className="relative z-10">Mulai Sekarang</span>
                <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              
              <button className="px-8 py-4 border-2 border-slate-700 hover:border-cyan-500/50 rounded-lg font-semibold hover:bg-cyan-500/5 transition-all duration-300">
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The Pain Section */}
      <section className="relative py-32 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 font-bold">
                01
              </div>
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold">
                  <span className="text-red-400">THE PAIN:</span>
                  <br />
                  <span className="text-slate-200">Kamu Bekerja di Alamat yang Salah</span>
                </h2>
                
                <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
                  <p className="text-xl font-semibold text-slate-100">
                    Selama ini, kamu menggunakan <span className="text-cyan-400">Alam Sadar</span> untuk mengejar mimpi. Dan itulah akar kehancuranmu.
                  </p>
                  
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 space-y-4">
                    <p className="font-bold text-xl text-amber-400">Alam Sadar itu LAMBAT. TERBATAS. BOROS ENERGI.</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <div className="text-4xl font-bold text-red-400">40 bit/s</div>
                        <div className="text-sm text-slate-400 mt-1">Alam Sadar</div>
                      </div>
                      <div className="text-center p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                        <div className="text-4xl font-bold text-cyan-400">11M bit/s</div>
                        <div className="text-sm text-slate-400 mt-1">Alam Bawah Sadar</div>
                      </div>
                    </div>
                  </div>

                  <p>
                    Kamu pakai motor bebek untuk lomba MotoGP. Kamu pakai pisau dapur untuk bedah jantung. <span className="text-red-400 font-bold">Salah alamat, bro.</span>
                  </p>

                  <div className="space-y-3">
                    <p className="font-semibold text-slate-100">Dan hasilnya?</p>
                    {[
                      'Lelah mental yang luar biasa',
                      'Stres berulang karena realita tidak sesuai "rencana"',
                      'Obsesi yang menggerogoti ketenangan',
                      'Kegagalan yang datang lagi dan lagi'
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 pl-4">
                        <div className="w-2 h-2 bg-red-400 rounded-full" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xl font-bold text-slate-100 pt-4">
                    Ini bukan soal niat kurang kuat. Ini soal kamu memakai sistem yang <span className="text-red-400">TIDAK DIDESAIN</span> untuk pekerjaan ini.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Gain Section */}
      <section className="relative py-32 px-6 md:px-12 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold">
                02
              </div>
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold">
                  <span className="text-cyan-400">THE GAIN:</span>
                  <br />
                  <span className="text-slate-200">Probabilitas Menang 90%++</span>
                </h2>
                
                <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
                  <p className="text-xl font-semibold text-slate-100">
                    Bayangkan: Kamu <span className="text-cyan-400">berhenti berpikir</span> dengan Alam Sadar.
                  </p>
                  
                  <p>
                    Kamu berhenti ngotot. Berhenti ngoprek strategi dengan logika. Berhenti paksa semesta pakai tenaga otot.
                  </p>

                  <div className="bg-gradient-to-br from-cyan-500/10 to-amber-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-8 space-y-4 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
                    <p className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-400">
                      Probabilitas kemenanganmu melonjak hingga 90%++
                    </p>
                    <p className="text-slate-200">
                      Karena Alam Bawah Sadar bekerja <span className="font-bold">11 juta kali lebih cepat</span>. Dia terhubung langsung dengan Hukum Alam—dengan Quantum Field—dengan Takdir yang Allah rancang.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="font-semibold text-slate-100">Kamu tidak perlu lagi:</p>
                    {[
                      'Overthinking strategi',
                      'Menguras energi untuk "membuat sesuatu terjadi"',
                      'Gelisah menunggu hasil'
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 pl-4">
                        <div className="w-2 h-2 bg-slate-600 rounded-full" />
                        <span className="line-through text-slate-500">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 pt-4">
                    <p className="font-semibold text-slate-100">Sebaliknya:</p>
                    {[
                      'Pencapaian terjadi secara alami',
                      'Peluang datang tanpa kamu kejar',
                      'Jalan terbuka tanpa kamu paksakan'
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 pl-4">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                        <span className="text-cyan-300">{item}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-2xl font-bold text-center py-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-amber-400 to-cyan-400">
                    EFFORTLESS. EFISIEN. MASIF.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Method Section */}
      <section className="relative py-32 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold">
                03
              </div>
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold">
                  <span className="text-amber-400">THE METHOD:</span>
                  <br />
                  <span className="text-slate-200">Bypass Alam Bawah Sadar</span>
                </h2>
                
                <div className="space-y-8 text-lg text-slate-300 leading-relaxed">
                  <div className="bg-gradient-to-r from-slate-800/80 to-slate-800/40 backdrop-blur-sm border-l-4 border-cyan-400 rounded-r-xl p-6">
                    <p className="font-bold text-slate-100 mb-2">Rumus Keseimbangan Atom:</p>
                    <p>Atom terbagi dua: <span className="text-cyan-400 font-semibold">Proton (Positif)</span> dan <span className="text-amber-400 font-semibold">Neutron (Netral)</span>.</p>
                    <p className="mt-2">Begitu pula Alam Bawah Sadarmu butuh <span className="text-white font-bold">DUA NIAT SEIMBANG</span>.</p>
                  </div>

                  {/* Niat Cards */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Deep Release */}
                    <div className="group bg-slate-800/50 backdrop-blur-sm border-2 border-amber-500/30 hover:border-amber-500/60 rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_40px_rgba(251,191,36,0.2)] hover:scale-105">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-amber-400" />
                        </div>
                        <div>
                          <div className="text-xs text-amber-400 font-semibold tracking-wider">NEUTRON</div>
                          <div className="text-lg font-bold text-slate-100">DEEP RELEASE</div>
                        </div>
                      </div>
                      <p className="text-slate-300 mb-3">
                        "Saya melepas. Saya tidak terobsesi. Saya ikhlas pada apapun hasilnya."
                      </p>
                      <div className="space-y-2 text-sm">
                        <p className="text-amber-400 font-semibold">RASAKAN sensasi:</p>
                        <ul className="space-y-1 text-slate-400">
                          <li>• Bebas dari cengkeraman hasil</li>
                          <li>• Tidak ada gelisah</li>
                          <li>• Netral, tenang, tanpa tekanan</li>
                        </ul>
                      </div>
                    </div>

                    {/* Deep Faith */}
                    <div className="group bg-slate-800/50 backdrop-blur-sm border-2 border-cyan-500/30 hover:border-cyan-500/60 rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_40px_rgba(6,182,212,0.2)] hover:scale-105">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-cyan-400" />
                        </div>
                        <div>
                          <div className="text-xs text-cyan-400 font-semibold tracking-wider">PROTON</div>
                          <div className="text-lg font-bold text-slate-100">DEEP FAITH</div>
                        </div>
                      </div>
                      <p className="text-slate-300 mb-3">
                        "Saya merasakan SEKARANG, saya sedang mendapatkan / ini sudah terjadi."
                      </p>
                      <div className="space-y-2 text-sm">
                        <p className="text-cyan-400 font-semibold">RASAKAN sensasi:</p>
                        <ul className="space-y-1 text-slate-400">
                          <li>• Seolah realita SUDAH terwujud</li>
                          <li>• Positif, penuh, sudah ada</li>
                          <li>• Bukan masa depan, tapi SEKARANG</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Kunci Eksekusi */}
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-amber-400 rounded-lg" />
                      <h3 className="text-2xl font-bold text-slate-100">Kunci Eksekusi</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-xl font-semibold text-slate-100">
                        Alam Sadarmu hanya punya satu tugas: <span className="text-red-400">DIAM.</span>
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {['Tumaninah', 'Alpha', 'Theta', 'Delta'].map((state, i) => (
                          <span key={i} className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-full text-sm text-slate-300">
                            {state}
                          </span>
                        ))}
                      </div>

                      <div className="space-y-3 pt-4 border-t border-slate-700">
                        {[
                          'Tidak boleh berpikir',
                          'Tidak boleh analisis',
                          'Tidak boleh skeptis'
                        ].map((rule, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                            <span className="text-slate-300">{rule}</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-gradient-to-r from-cyan-500/10 to-amber-500/10 border border-cyan-500/30 rounded-lg p-4 mt-6">
                        <p className="text-cyan-300 font-semibold">Biarkan NIAT yang bekerja—bukan pikiran.</p>
                        <p className="text-slate-400 text-sm mt-1">Niat itu bypass. Dia langsung masuk ke Alam Bawah Sadar tanpa harus dipikirkan.</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center py-4">
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-cyan-400 to-amber-400">
                      NIAT ITU DIRASAKAN. BUKAN DILOGIKAKAN.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative py-32 px-6 md:px-12 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
              Dari Puluhan Ribu Orang yang Kami Saksikan
            </h2>
            <p className="text-xl text-slate-400">90% orang gagal karena tidak seimbang</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Too Much Release */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-amber-500/30 rounded-xl p-6 text-center">
              <div className="text-5xl font-bold text-amber-400 mb-2">50%</div>
              <div className="text-lg font-semibold text-slate-200 mb-3">Terlalu Deep Release</div>
              <p className="text-sm text-slate-400 mb-4">Terlalu santai, pasif</p>
              <div className="inline-block px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-sm font-semibold">
                GAGAL
              </div>
            </div>

            {/* Too Much Faith */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 text-center">
              <div className="text-5xl font-bold text-cyan-400 mb-2">40%</div>
              <div className="text-lg font-semibold text-slate-200 mb-3">Terlalu Deep Faith</div>
              <p className="text-sm text-slate-400 mb-4">Terlalu agresif, obsesif</p>
              <div className="inline-block px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-sm font-semibold">
                GAGAL
              </div>
            </div>

            {/* Balanced */}
            <div className="bg-gradient-to-br from-cyan-500/20 to-amber-500/20 backdrop-blur-sm border-2 border-emerald-500/50 rounded-xl p-6 text-center shadow-[0_0_40px_rgba(16,185,129,0.2)]">
              <div className="text-5xl font-bold text-emerald-400 mb-2">10%</div>
              <div className="text-lg font-semibold text-slate-200 mb-3">Balance</div>
              <p className="text-sm text-slate-400 mb-4">Deep Faith + Deep Release</p>
              <div className="inline-block px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-full text-emerald-400 text-sm font-semibold">
                MENANG
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="relative py-20 px-6 md:px-12 bg-slate-950">
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
          <h2 className="text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-400">
            Testimoni Nyata
          </h2>
          
          {/* Quote Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-5xl mx-auto">
            {quotes.map((quote, index) => (
              <div key={index} className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
                <Quote className="w-8 h-8 text-cyan-400 mb-3" />
                <p className="text-gray-200 italic">{quote}</p>
              </div>
            ))}
          </div>

          {/* Video Testimonies */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {testimonies.map((testimony, index) => (
              <div key={index} className="group">
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all">
                  <div className="relative aspect-[9/16]">
                    <iframe
                      src={testimony.video}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="p-4 text-center">
                    <p className="font-semibold text-cyan-400">{testimony.name}</p>
                    {testimony.title && <p className="text-sm text-gray-300">{testimony.title}</p>}
                    {testimony.description && <p className="text-xs text-gray-400">{testimony.description}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Community Images */}
          <div className="mt-20">
            <h2 className="text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-cyan-400">
              Testimoni Komunitas
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {communityImages.map((imageUrl, index) => (
                <div key={index} className="group">
                  <div className="bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all">
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
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-8">
            Pertanyaan Terakhir Untukmu
          </h2>
          
          <div className="space-y-6 text-xl text-slate-300 mb-12">
            <p>
              Apakah kamu masih mau membuang waktu dengan <span className="line-through text-slate-500">"berpikir"</span> pakai <span className="text-red-400 font-semibold">Alam Sadar</span>?
            </p>
            <p>
              Atau kamu siap mengaktifkan <span className="text-cyan-400 font-bold">sistem yang benar</span>—sistem yang didesain untuk mewujudkan mimpi dengan probabilitas <span className="text-emerald-400 font-bold">90%++</span>?
            </p>
          </div>

          <div className="inline-block space-y-4 mb-12">
            <p className="text-2xl font-bold text-slate-100">Pilihan ada di tanganmu.</p>
            <p className="text-lg text-slate-400">Tapi Hukum Alam tidak menunggu.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group relative px-10 py-5 bg-gradient-to-r from-cyan-500 to-amber-500 hover:from-cyan-400 hover:to-amber-400 rounded-xl font-bold text-lg text-slate-950 transition-all duration-300 hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] hover:scale-105 overflow-hidden">
              <span className="relative z-10">Aktifkan Sistem Sekarang</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-6 md:px-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <div className="text-4xl font-black mb-1">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-400">
                  DEEP FAITH
                </span>
              </div>
              <p className="text-slate-500 text-sm mb-1">by eL Vision</p>
              <p className="text-slate-600 italic text-sm">Bypass Your Reality.</p>
            </div>

            <div className="flex gap-8 text-sm text-slate-400">
              <a href="#" className="hover:text-cyan-400 transition-colors">Tentang</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Metode</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Testimoni</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Kontak</a>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            <p>© 2024 Deep Faith by eL Vision. Mind Technology for Human Excellence.</p>
            <p className="mt-2 text-xs">Combining Quantum Physics, Psychology, and Spiritual Wisdom.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}