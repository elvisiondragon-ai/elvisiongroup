import React, { useState, useEffect, useRef } from 'react';
import { Star, CheckCircle, TrendingUp, Heart, Crown, DollarSign, Phone, ArrowRight, Sparkles, Shield, Check, Play, Pause } from 'lucide-react';

export default function ELVision15K() {
  // Facebook Pixel Code
  useEffect(() => {
    !(function (f: any, b: any, e: any, v: any, n: any, t: any, s: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      'script',
      'https://connect.facebook.net/en_US/fbevents.js'
    );
    fbq('init', '3319324491540889');
    fbq('track', 'PageView');
  }, []);

  const videoTestimonials = [
    {
      name: "Agus Mulyadi, SH., MH.",
      title: "Kepala Intelijen Pangandaran",
      videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/AGUS_WA.mp4",
      thumbnail: "🎖️"
    },
    {
      name: "Dr. Gumilar",
      title: "Hipnoterapist & Pemimpin Yayasan",
      videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/DRVIDEO_WA.mp4",
      thumbnail: "⚕️"
    },
    {
      name: "Habib Umar",
      title: "Pemimpin Pondok Pesantren Atsaqofah",
      videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/HABIBVIDEO_WA.mp4",
      thumbnail: "🕌"
    },
    {
      name: "Umi Jamilah",
      title: "Pemimpin Yayasan",
      videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/UMIVIDEO_WA.mp4",
      thumbnail: "👳‍♀️"
    },
    {
      name: "Felicia",
      title: "Pengusaha",
      videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/FELVIDEO_WA.mp4",
      thumbnail: "👩‍💼"
    },
    {
      name: "Lena",
      title: "Klien eL Vision",
      videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/LENA_WA.mp4",
      thumbnail: "🌟"
    },
    {
      name: "Vio",
      title: "Klien eL Vision",
      videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/VIOVIDEO_WA.mp4",
      thumbnail: "✨"
    },
    {
      name: "Arif",
      title: "Klien eL Vision",
      videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif.mp4",
      thumbnail: "👨‍💻"
    }
  ];

  const testimonials = [
    {
      name: "Felicia Quincy",
      title: "Instagram: @itsfelicia.quincy",
      verified: true,
      image: "👩‍💼",
      rating: 5,
      text: "Mengikuti program 6 minggu membuat saya dari cemas dan overthinking, awalnya semua keputusan saya kabur dan sangat sulit untuk maju, setelah program saya bisa melihat hal-hal lebih jelas dan juga ketika getaran saya jelas, realitas, koneksi dan keuangan saya menjadi lebih baik. Luar biasa"
    },
    {
      name: "Agus Mulyadi, SH., MH.",
      title: "Kepala Intelijen Pangandaran, Indonesia",
      verified: true,
      image: "👨‍💼",
      rating: 5,
      text: "Sebagai kepala intelijen di Indonesia saya memiliki banyak tugas sulit dan tanggung jawab yang mustahil untuk diputuskan, dengan meditasi 6 minggu saya memiliki intuisi super untuk mendapatkan hasil terbaik dari pekerjaan saya"
    },
    {
      name: "Dr. Gumilar",
      title: "Dokter & Hipnoterapis (20+ Tahun)",
      verified: true,
      image: "⚕️",
      rating: 5,
      text: "Sebagai dokter dan hipnoterapis selama lebih dari 20 tahun, saya MENYADARI hipnoterapi saya sudah ketinggalan zaman, melakukan metode eL Vision selama 6 minggu sepenuhnya mengubah perspektif saya dan melihat bahwa metode modern ini memberikan hasil yang cepat"
    },
    {
      name: "Suryadi",
      title: "Yayasan Aisyah - Mengelola 100+ Panti Asuhan",
      verified: true,
      image: "🌟",
      rating: 5,
      text: "Kami mengelola ratusan panti asuhan dan memberikan mereka beasiswa ke perguruan tinggi terbaik di seluruh dunia. Bagian tersulit adalah mendapatkan donatur yang memahami nilainya, dengan meditasi mendalam bersama eL, luar biasa dan membuat saya lebih mudah bertemu donatur yang tepat"
    },
    {
      name: "David Sutanto",
      title: "CEO Tech Startup, Valuasi $50M",
      image: "💎",
      rating: 5,
      text: "Uang bukan lagi masalah, tapi masalah terus datang. Setelah 1:1 dengan eL Vision, saya paham: yang hilang bukan strategi, tapi kalibrasi energi. Sekarang bisnis berkembang tanpa drama."
    },
    {
      name: "Linda Permata",
      title: "Investor Real Estate & Pengusaha",
      image: "👩‍💼",
      rating: 5,
      text: "Saya pikir saya sudah 'selesai' secara finansial. Ternyata ada level berikutnya: manifestasi tanpa paksaan. Rp 15 juta adalah investasi terbaik dibandingkan seminar Rp 50 juta yang hanya teori."
    },
    {
      name: "Budi Hermawan",
      title: "Pemilik Grup Manufaktur",
      image: "🎯",
      rating: 5,
      text: "6 minggu mengubah 15 tahun pola pikir. Kekayaan ada, tapi kedamaian tidak. Sekarang saya mengerti: kemakmuran sejati dimulai dengan 1% fokus yang tepat."
    }
  ];

  const weeklyProgram = [
    {
      week: "Minggu 0",
      title: "Sebelum Program",
      description: "Masalah, pikiran kabur, sakit kepala, takut, ragu",
      color: "from-red-900/30 to-gray-900",
      borderColor: "border-red-900/50"
    },
    {
      week: "Minggu 1",
      title: "Pergeseran Awal",
      description: "Mulai merasa lebih mudah melihat hari demi hari dan kegembiraan",
      color: "from-orange-900/30 to-gray-900",
      borderColor: "border-orange-900/50"
    },
    {
      week: "Minggu 2",
      title: "Koneksi Lebih Dalam",
      description: "Memperdalam rasa realitas Anda, dari visual, mendengar bahkan merasakan kinetik, Anda mulai terhubung dengan realitas dengan kegembiraan",
      color: "from-yellow-900/30 to-gray-900",
      borderColor: "border-yellow-900/50"
    },
    {
      week: "Minggu 3",
      title: "Keselarasan & Aliran",
      description: "Kebahagiaan mulai mengalir otomatis dalam kehadiran Anda, karena sekarang Anda Selaras dengan tujuan Anda, semua jawaban yang mungkin mulai mengungkapkan dirinya kepada Anda",
      color: "from-green-900/30 to-gray-900",
      borderColor: "border-green-900/50"
    },
    {
      week: "Minggu 4",
      title: "Hasil Mulai Terlihat",
      description: "Mulai mengumpulkan hasil langkah demi langkah",
      color: "from-blue-900/30 to-gray-900",
      borderColor: "border-blue-900/50"
    },
    {
      week: "Minggu 5",
      title: "Hasil Semakin Dalam",
      description: "Hasil Semakin Dekat saat frekuensi Anda semakin selaras dengan tujuan Anda",
      color: "from-purple-900/30 to-gray-900",
      borderColor: "border-purple-900/50"
    },
    {
      week: "Minggu 6",
      title: "Pencapaian",
      description: "Hasil tercapai",
      color: "from-yellow-500/30 to-amber-500/30",
      borderColor: "border-yellow-500/50"
    }
  ];

  const goals = [
    {
      icon: <DollarSign className="w-12 h-12" />,
      title: "KEKAYAAN",
      description: "Manifestasi kesadaran kekayaan tanpa kecemasan. Uang mengalir secara alami."
    },
    {
      icon: <Crown className="w-12 h-12" />,
      title: "KEKUASAAN",
      description: "Kepemimpinan yang berakar pada kejelasan. Pengaruh organik dan berkelanjutan."
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: "CINTA",
      description: "Hubungan yang autentik dan mendalam. Kehadiran magnetik alami."
    }
  ];

  // Audio Player Component
  const AudioPlayer = () => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlayPause = () => {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
        // @ts-ignore
        if (typeof fbq === 'function') {
          // @ts-ignore
          fbq('trackCustom', 'AudioPlayed', {
            audio_src: audioRef.current.src,
          });
        }
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    useEffect(() => {
      const audio = audioRef.current;
      if (audio) {
        const handleEnded = () => setIsPlaying(false);
        audio.addEventListener('ended', handleEnded);
        return () => audio.removeEventListener('ended', handleEnded);
      }
    }, []);

    return (
      <div className="flex items-center justify-center p-4">
        <button
          onClick={togglePlayPause}
          className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-all transform hover:scale-105 shadow-xl shadow-yellow-500/50"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          {isPlaying ? 'Jeda Audio' : 'Putar Audio'}
        </button>
        <audio ref={audioRef} src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/audio/el15jt.mp3" preload="auto" className="hidden" />
      </div>
    );
  };

  // Video Testimonial Component
  const VideoTestimonial = ({ testimonial }) => {
    const videoRef = useRef(null);

    return (
      <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-2xl p-6 hover:border-yellow-500/50 transition-all">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl">{testimonial.thumbnail}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-yellow-400">{testimonial.name}</h3>
            <p className="text-sm text-gray-400">{testimonial.title}</p>
          </div>
        </div>
        
        <video 
          ref={videoRef}
          className="w-full rounded-lg"
          controls
          preload="metadata"
          playsInline
          webkit-playsinline="true"
        >
          <source src={testimonial.videoUrl} type="video/mp4" />
          Browser Anda tidak mendukung pemutaran video.
        </video>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/10 via-black to-black" />

        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-full px-6 py-3 backdrop-blur-sm">
              <Shield className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-500 font-semibold">EKSKLUSIF UNTUK HIGH ACHIEVERS</span>
            </div>
          </div>

          <h1 className="text-7xl md:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
              SISTEM 1:1
            </span>
          </h1>
          
          <p className="text-3xl md:text-4xl text-gray-300 mb-4 font-light">
            eL Vision Premium Coaching
          </p>

          <div className="flex items-center justify-center gap-3 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-8 h-8 fill-yellow-500 text-yellow-500" />
            ))}
          </div>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
            Untuk mereka yang sudah memiliki segalanya, namun masih mencari sesuatu yang lebih dalam
          </p>

          {/* Free Trial Badge */}
          <div className="inline-block bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-2xl px-8 py-4 mb-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div className="text-left">
                <div className="text-2xl font-bold text-green-400">SESI PERTAMA GRATIS</div>
                <div className="text-sm text-gray-300">Rasakan Nilainya, Bayar Saat Anda Yakin</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/30 rounded-2xl p-8 max-w-2xl mx-auto backdrop-blur-sm mb-8">
            <div className="text-5xl font-bold text-yellow-400 mb-2">Rp 15.000.000</div>
            <div className="text-xl text-gray-300 mb-1">6 Minggu • 6 Sesi Private (60 menit/sesi)</div>
            <div className="text-sm text-gray-400">Bayar Setelah Sesi 1 • 1 Sesi per Minggu</div>
          </div>
        </div>
      </div>

      <button 
        className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold text-xl px-8 py-4 rounded-full transition-all transform hover:scale-105 shadow-xl shadow-purple-500/50 flex items-center gap-4 mx-auto mb-16"
        onClick={() => window.open('https://instagram.com/elreyzandra', '_blank')}
      >
        <ArrowRight className="w-6 h-6" />
        FOLLOW FOUNDER KAMI DI INSTAGRAM
      </button>
    
      {/* Audio Player */}
      <div className="py-10 bg-black">
        <div className="container mx-auto px-6">
          <AudioPlayer />
        </div>
      </div>

      {/* Reyzandra's Message */}
      <div className="py-10 bg-black">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-2xl p-10 mb-8 text-gray-300 leading-relaxed text-lg">
            <p className="mb-4">Nama saya eL Reyzandra,</p>
            <p className="mb-4">Pendiri eL Vision.</p>
            <p className="mb-4">Hingga 2025, saya telah menghabiskan lebih dari 15 tahun bekerja di bidang ini.</p>
            <p className="mb-4">Klien saya terutama adalah individu dengan tanggung jawab signifikan—kepala unit intelijen, pendiri yayasan sosial, lembaga beasiswa, dan pemimpin yang beroperasi di bawah tekanan konstan.</p>
            <p className="mb-4">Satu kategori klien yang meninggalkan kesan mendalam bagi saya adalah mereka yang datang di momen paling kritis dalam hidup.</p>
            <p className="mb-4">Misalnya, Pak Arif, yang pada Mei 2025 secara medis didiagnosis dengan kanker otak stadium 4 dan diberi estimasi tiga bulan. Hingga Desember 2025, beliau masih hidup, sadar, dan berfungsi.</p>
            <p className="mb-4">Pengalaman ini memperkuat prinsip yang telah saya pegang selama bertahun-tahun:</p>
            <p className="mb-4">sains dapat mengukur probabilitas, tetapi tidak memiliki otoritas atas kehidupan.</p>
            <p className="mb-4">Kehidupan bergerak menurut hukum alam—dan alam, ketika dipahami dengan benar, jauh lebih penuh belas kasih daripada yang kebanyakan orang sadari.</p>
            <p className="mb-4">Banyak yang bertanya mengapa klien saya cenderung individu profil tinggi.</p>
            <p className="mb-4">Alasannya sederhana:</p>
            <p className="mb-4">semakin banyak pengetahuan dan pengalaman yang dikumpulkan seseorang, semakin cepat mereka menyadari bahwa ada faktor pembatas yang tidak terlihat—faktor yang menghalangi kemajuan terlepas dari kecerdasan, strategi, atau usaha.</p>
            <p className="mb-4">Ini bukan kurangnya keterampilan.</p>
            <p className="mb-4">Ini adalah ketidakselarasan dengan hukum alam.</p>
            <p className="mb-4">Perjalanan saya dimulai 15 tahun yang lalu ketika saya secara pribadi mencoba menerapkan Law of Attraction melalui ajaran populer seperti The Secret. Saya gagal total.</p>
            <p className="mb-4">Kegagalan itu memaksa saya untuk mengajukan pertanyaan yang lebih dalam:</p>
            <p className="mb-4">Apa yang hilang?</p>
            <p className="mb-4">Bertahun-tahun penelitian, pengujian pribadi, dan pengorbanan akhirnya mengungkap celahnya.</p>
            <p className="mb-4">Celah itulah yang sekarang ditangani oleh eL Vision—bukan sebagai teori, tetapi sebagai sistem yang hidup yang dapat dialami secara langsung.</p>
            <p className="mb-4">Inilah sebabnya sesi pertama ditawarkan gratis.</p>
            <p className="mb-4">Saya tidak menjual motivasi, kepercayaan, atau nasihat.</p>
            <p className="mb-4">Saya menawarkan metode yang bekerja.</p>
            <p className="mb-4">Salah satu klien internasional pertama saya di Dubai datang kepada saya setelah kehilangan pekerjaannya. Dia bergabung dengan sesi gratis. Minggu kemudian, dia mendapatkan posisi yang lebih baik sebagai manajer di gym premium.</p>
            <p className="mb-4">Tidak ada janji yang dibuat. Tidak ada bujukan yang digunakan.</p>
            <p className="mb-4">Apakah saya luar biasa?</p>
            <p className="mb-4">Tidak.</p>
            <p className="mb-4">Yang telah saya pelajari adalah ini:</p>
            <p className="mb-4">setiap manusia membawa kekuatan batin yang sudah diberikan oleh alam.</p>
            <p className="mb-4">Perbedaannya hanya terletak pada mengetahui cara mengaktifkannya.</p>
            <p className="mb-4">Jika Anda benar-benar ingin mengalami ini sendiri,</p>
            <p className="mb-4">mulailah dengan sesi gratis.</p>
            <p className="mb-4">Baru kemudian putuskan apakah program enam minggu ini tepat untuk Anda.</p>
            <p className="mb-4">Saya tidak tertarik mendapatkan uang dengan membuat orang tetap tergantung atau bingung.</p>
            <p className="mb-4">Ini dirancang untuk menjadi salah satu investasi paling efisien yang pernah Anda buat—</p>
            <p className="mb-4">sebagian kecil dari sumber daya Anda, sebagai pertukaran untuk apa yang paling penting: kejelasan, keselarasan, dan stabilitas batin.</p>
            <p className="mb-4">Saya menantikan untuk bertemu Anda di kelas.</p>
            <p className="mt-8 font-bold">— eL Reyzandra</p>
            <p className="font-bold">Pendiri, eL Vision</p>
          </div>
        </div>
      </div>

      {/* Story-Based Case Studies Section */}
      <div className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                Cerita Nyata, Transformasi Nyata
              </span>
            </h2>
            <p className="text-xl text-gray-400 text-center mb-16">
              Studi kasus dari high-performers yang menembus batasan internal
            </p>

            {/* John's Story */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-2xl p-10 mb-8">
              <div className="inline-block bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-1 mb-4">
                <span className="text-yellow-400 font-semibold text-sm">STUDI KASUS: JOHN</span>
              </div>
              <h3 className="text-3xl font-bold text-yellow-400 mb-6">Pemilik Bisnis yang Sudah Melakukan Semuanya dengan Benar</h3>
              
              <div className="space-y-4 text-gray-300 leading-relaxed text-lg">
                <p>
                  John sudah melakukan semuanya dengan benar. Dia telah menguji berbagai strategi iklan, mempekerjakan tim yang kuat, mengoptimalkan funnel, dan menghabiskan uang yang serius untuk eksekusi. Secara teknis, tidak ada yang salah.
                </p>
                <p>
                  Namun bisnisnya terus terhenti di batas yang sama. Tidak peduli seberapa keras dia mendorong secara eksternal, terobosan tidak akan terjadi.
                </p>
                <p className="text-yellow-400 font-semibold">
                  Ketika kami bekerja sama, menjadi jelas: hambatan bukan lagi di luar bisnis. Itu internal — gesekan mental yang halus, kelelahan keputusan, dan resistensi tidak sadar yang bahkan orang pintar lewatkan.
                </p>
                <p>
                  Setelah memasuki proses privat 6 minggu yang terfokus, perubahan tidak dramatis di permukaan. Tapi kejelasan kembali. Eksekusi disederhanakan. Dan hasil yang dia kejar akhirnya mulai bergerak.
                </p>
              </div>
            </div>

            {/* Noah's Story */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-amber-900/30 rounded-2xl p-10">
              <div className="inline-block bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-1 mb-4">
                <span className="text-amber-400 font-semibold text-sm">STUDI KASUS: NOAH</span>
              </div>
              <h3 className="text-3xl font-bold text-amber-400 mb-6">Kekayaan Tanpa Kedamaian</h3>
              
              <div className="space-y-4 text-gray-300 leading-relaxed text-lg">
                <p>
                  Kisah Noah terlihat berbeda. Dia memiliki kekayaan, status, dan kebebasan di atas kertas. Tapi keluarganya tidak bahagia. Tubuhnya rusak.
                </p>
                <p>
                  Uang, alih-alih menjadi alat, telah menjadi sumber tekanan dan masalah berulang. Masalahnya bukan kurangnya kesuksesan. Itu ketidakselarasan internal.
                </p>
                <p className="text-amber-400 font-semibold">
                  Selama kerja privat 6 minggu yang sama, kami menangani pola internal yang diam-diam mendistorsi bagaimana uang, hubungan, dan kesehatan muncul dalam hidupnya.
                </p>
                <p>
                  Seiring waktu, uang kembali ke peran yang tepat — alat untuk hidup, bukan pemicu penderitaan.
                </p>
              </div>
            </div>

            {/* Pattern Recognition */}
            <div className="mt-12 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-8">
              <h4 className="text-2xl font-bold text-purple-400 mb-4">Pola Umum</h4>
              <div className="space-y-3 text-gray-300 leading-relaxed">
                <p>
                  Banyak orang berbagi pola yang sama. Mereka mencoba lebih keras. Mereka memperbaiki strategi. Mereka mengoptimalkan sistem. Tapi solusinya bukan di sana.
                </p>
                <p className="text-xl font-semibold text-white">
                  Faktanya, lebih dari 90% klien kami adalah pemain tingkat atas. Mereka sudah memiliki penguasaan teknis dan kompetensi eksternal.
                </p>
                <p>
                  Jadi mengapa mereka datang kepada kami? Karena semakin pintar Anda, semakin Anda menyadari ada faktor X yang tidak bisa diperbaiki dengan teknik. Dan faktor itu adalah internal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Program Breakdown */}
      <div className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Perjalanan Transformasi 6 Minggu
            </span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto">
            Apa yang terjadi minggu demi minggu dalam transformasi Anda
          </p>

          <div className="max-w-4xl mx-auto space-y-6">
            {weeklyProgram.map((week, idx) => (
              <div key={idx} className={`bg-gradient-to-r ${week.color} border ${week.borderColor} rounded-2xl p-8 transition-all hover:scale-105`}>
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-full ${week.week === "Minggu 6" ? "bg-yellow-500" : "bg-gray-800"} flex items-center justify-center border-2 ${week.week === "Minggu 6" ? "border-yellow-400" : "border-gray-700"}`}>
                      <span className={`font-bold ${week.week === "Minggu 6" ? "text-black" : "text-white"}`}>{idx}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-gray-400 uppercase">{week.week}</span>
                      {week.week === "Minggu 6" && <Check className="w-5 h-5 text-yellow-400" />}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{week.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{week.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/30 rounded-2xl px-8 py-6">
              <p className="text-xl text-gray-300">
                <strong className="text-yellow-400">Ini bukan nasihat. Ini bukan motivasi.</strong><br />
                Ini adalah pekerjaan presisi pada sistem yang menggerakkan segalanya.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Proof Not Advice Section */}
      <div className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl px-8 py-4 mb-8">
              <TrendingUp className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  Kami Tidak Menjual Nasihat
                </span>
              </h2>
              <p className="text-2xl text-gray-300">
                Kami Menjual <span className="text-yellow-400 font-bold">HASIL TERBUKTI</span>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-900/50 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 text-9xl opacity-10">✗</div>
                <h3 className="text-2xl font-bold text-red-400 mb-4">Bukan Ini</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-3 text-gray-400">
                    <span className="text-red-500 mt-1">×</span>
                    <span>Nasihat teoretis yang terdengar bagus di atas kertas</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <span className="text-red-500 mt-1">×</span>
                    <span>Motivasi sementara yang memudar besok</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <span className="text-red-500 mt-1">×</span>
                    <span>Konsep spiritual abstrak</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <span className="text-red-500 mt-1">×</span>
                    <span>Janji kosong tanpa bukti nyata</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-900/30 to-black border-2 border-green-500/50 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 text-9xl opacity-10">✓</div>
                <h3 className="text-2xl font-bold text-green-400 mb-4">Yang Anda Dapatkan</h3>
                <ul className="space-y-4 text-left">
                  <li className="flex items-start gap-3 text-gray-300">
                    <span className="text-2xl mt-1 flex-shrink-0">🏥</span>
                    <span><strong>Transformasi kesehatan:</strong> Kami telah membantu klien menentang diagnosis terminal. Pak Arif didiagnosis kanker dan diberi waktu 3 bulan untuk hidup pada Mei 2025 - dia hidup dan berkembang hari ini. Anda dapat menghubunginya langsung untuk mendengar ceritanya.</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-300">
                    <span className="text-2xl mt-1 flex-shrink-0">💰</span>
                    <span><strong>Terobosan finansial:</strong> Satu pemilik yayasan meningkatkan donasi beasiswa mereka dari nol menjadi $6M/tahun setelah bekerja dengan kami.</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-300">
                    <span className="text-2xl mt-1 flex-shrink-0">👨‍👩‍👧‍👦</span>
                    <span><strong>Penyembuhan keluarga:</strong> Pria sukses sering berjuang dengan perasaan dihormati di rumah. Ketika bentrokan ego tampak tidak dapat diselesaikan, kami menciptakan perubahan dalam hitungan minggu - bukan tahun.</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-300">
                    <span className="text-2xl mt-1 flex-shrink-0">☮️</span>
                    <span><strong>Kedamaian & kebahagiaan sejati:</strong> Uang dan kebahagiaan berbeda. Uang membeli kunjungan rumah sakit dan penghilang stres - bukan kegembiraan. Kebahagiaan sejati berasal dari sikap dan memberi. Dalam sesi pertama Anda, Anda akan menemukan kebahagiaan melalui hal-hal sederhana: napas Anda, apa yang Anda lihat, bagaimana Anda merasakan dunia. Keuangan Anda menjadi bonus untuk kebahagiaan itu sendiri.</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-300">
                    <span className="text-2xl mt-1 flex-shrink-0">❤️</span>
                    <span><strong>Cinta & hubungan:</strong> Klien pria kami yang ingin menarik wanita tertentu memiliki tingkat keberhasilan 95% dalam 6 minggu. Untuk transparansi: wanita yang ingin menarik pria tertentu memiliki tingkat keberhasilan 50% dalam jangka waktu yang sama. Namun, wanita yang bekerja untuk menyembuhkan pernikahan yang ada juga mencapai keberhasilan 95% - itulah mengapa kami sering merekomendasikan jalur itu.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/30 rounded-2xl p-8">
              <p className="text-2xl text-gray-300 leading-relaxed">
                Itulah mengapa <strong className="text-yellow-400">SESI PERTAMA GRATIS</strong>.<br />
                Anda tidak harus percaya kata-kata kami.<br />
                <span className="text-3xl font-bold text-yellow-400">Rasakan buktinya sendiri.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pain Point Section */}
      <div className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Apakah Ini Anda?
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-red-900/30 rounded-2xl p-8">
                <div className="text-red-400 text-6xl mb-4">💸</div>
                <h3 className="text-2xl font-bold mb-4 text-red-400">Uang Ada, Tapi...</h3>
                <p className="text-gray-300 leading-relaxed">
                  Masalah terus datang. Seolah uang menjadi magnet untuk drama, konflik, dan kecemasan. Semakin banyak kekayaan yang Anda miliki, semakin kompleks masalah menggerogoti kedamaian Anda.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-orange-900/30 rounded-2xl p-8">
                <div className="text-orange-400 text-6xl mb-4">🎭</div>
                <h3 className="text-2xl font-bold mb-4 text-orange-400">Sukses di Luar, Kosong di Dalam</h3>
                <p className="text-gray-300 leading-relaxed">
                  Pencapaian demi pencapaian tercapai. Tapi ada kekosongan yang tidak bisa diisi oleh apa pun. Anda tahu ada lebih banyak, tapi tidak tahu bagaimana mengaksesnya.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-2xl p-8">
                <div className="text-yellow-400 text-6xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold mb-4 text-yellow-400">Energi Terkuras</h3>
                <p className="text-gray-300 leading-relaxed">
                  Setiap hari terasa seperti pertempuran. Keputusan besar menguras energi Anda. Anda ingin aliran alami, bukan perjuangan melelahkan yang konstan.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-amber-900/30 rounded-2xl p-8">
                <div className="text-amber-400 text-6xl mb-4">🌪️</div>
                <h3 className="text-2xl font-bold mb-4 text-amber-400">Kehilangan Kejelasan</h3>
                <p className="text-gray-300 leading-relaxed">
                  Visi yang dulunya tajam sekarang kabur. Terlalu banyak pilihan, terlalu banyak suara. Anda membutuhkan kejelasan untuk melihat langkah selanjutnya dengan kepastian.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-2xl text-gray-300 italic">
                "Kalibrasi yang salah membuat kesuksesan terasa seperti beban."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Tentukan Tujuan Spesifik Anda
            </span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto">
            Fokus adalah kunci. Pilih satu area untuk transformasi mendalam dalam 6 minggu
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {goals.map((goal, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-800 to-black border border-yellow-900/30 rounded-2xl p-8 hover:border-yellow-500/50 transition-all hover:scale-105 cursor-pointer">
                <div className="text-yellow-500 mb-6 flex justify-center">
                  {goal.icon}
                </div>
                <h3 className="text-3xl font-bold text-center mb-4 text-yellow-400">
                  {goal.title}
                </h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  {goal.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-lg text-gray-400 mb-8">
              Atau kombinasi dari ketiganya? Kami akan menyesuaikan dengan kebutuhan Anda.
            </p>
          </div>
        </div>
      </div>

      {/* What You Get Section */}
      <div className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Yang Anda Dapatkan
            </span>
          </h2>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              "6 Sesi Private 1:1 (60 menit per sesi) dengan metode eksklusif eL Vision",
              "Vipassana & Kalibrasi yang disesuaikan khusus untuk tujuan Anda",
              "Akses WhatsApp langsung untuk bimbingan di antara sesi",
              "Protokol manifestasi khusus berdasarkan tanda tangan energi Anda",
              "Pelacakan kemajuan mingguan untuk memastikan transformasi terukur",
              "Akses seumur hidup ke komunitas klien tingkat tinggi eksklusif"
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-yellow-900/50 transition-all">
                <CheckCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                <span className="text-lg text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Testimonials Section */}
      <div className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Testimoni Video Klien Kami
            </span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16">
            Dengarkan langsung dari mereka yang telah merasakan transformasi
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {videoTestimonials.map((testimonial, idx) => (
              <VideoTestimonial key={idx} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>

      {/* Text Testimonials Section */}
      <div className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Apa Kata Klien Tingkat Tinggi Kami
            </span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16">
            Mereka yang sudah "berhasil" tetapi mencari level berikutnya
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-2xl p-8 hover:border-yellow-500/50 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{testimonial.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-yellow-400">{testimonial.name}</h3>
                      {testimonial.verified && (
                        <div className="bg-blue-500 rounded-full p-1" title="Terverifikasi">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{testimonial.title}</p>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                <p className="text-gray-300 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-block bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl px-8 py-6">
              <p className="text-xl text-gray-300 mb-2">
                <strong className="text-purple-400">Hasil Bukan Kebetulan.</strong>
              </p>
              <p className="text-lg text-gray-400">
                Setiap testimoni adalah bukti kalibrasi energi yang presisi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-32 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-8" />
            
            <h2 className="text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                Saatnya Rekalibrasi
              </span>
            </h2>

            <p className="text-2xl text-gray-300 mb-8 leading-relaxed">
              Uang Anda sudah cukup. Yang Anda butuhkan adalah kejelasan, kedamaian, dan aliran alami dalam mewujudkan keinginan Anda berikutnya.
            </p>

            <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/30 rounded-2xl p-10 backdrop-blur-sm mb-12">
              <div className="inline-block bg-green-500/20 border border-green-500/50 rounded-full px-6 py-2 mb-4">
                <span className="text-green-400 font-bold text-lg">✓ SESI PERTAMA GRATIS - Tanpa Risiko</span>
              </div>
              <div className="text-5xl font-bold text-yellow-400 mb-3">Rp 15.000.000</div>
              <div className="text-xl text-gray-300 mb-2">Transformasi 6 Minggu (60 menit/sesi)</div>
              <div className="text-sm text-gray-400 mb-6">Bayar Setelah Sesi 1 • 1 Sesi per Minggu</div>
              
              <div className="inline-block bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-6 py-3">
                <p className="text-yellow-400 font-semibold">⚡ Terbatas: Hanya 3 Slot per Bulan</p>
              </div>
            </div>

            <button 
              className="group bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold text-2xl px-16 py-8 rounded-full transition-all transform hover:scale-105 shadow-2xl shadow-yellow-500/50 flex items-center gap-4 mx-auto mb-8"
              onClick={() => {
                // @ts-ignore
                if (typeof fbq === 'function') {
                  // @ts-ignore
                  fbq('track', 'AddToCart', {
                    content_name: 'EL Vision 15K Coaching',
                    value: 15000000,
                    currency: 'IDR'
                  });
                }
                window.open('https://wa.me/62895325633487?text=Hi%20saya%20ingin%20mendaftar%20VIP%201%3A1%20%0ANama:%20%0ATujuan%20Spesifik:%20', '_blank');
              }}
            >
              <Phone className="w-8 h-8" />
              BOOK SEKARANG
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </button>

            <p className="text-gray-500 text-sm">
              Slot terbatas. Kami hanya bekerja dengan mereka yang serius tentang transformasi mendalam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}