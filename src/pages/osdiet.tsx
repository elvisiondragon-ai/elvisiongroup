declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq: (...args: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _fbq: Array<any>;
  }
}

const PIXEL_ID = '3319324491540889';

/**
 * Initializes the Facebook Pixel and tracks a 'ViewContent' event.
 * This function should be called once per page load/route change.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
export const initAndTrackPixel = () => {
  if (typeof window === 'undefined') {
    return;
  }

  // Standard Facebook Pixel initialization script
  if (!window._fbq) {
    (function(f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function() {
        // eslint-disable-next-line prefer-spread, prefer-rest-params
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
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

    window.fbq('init', PIXEL_ID);
  }

  // Track 'ViewContent' for entire pages as requested
  window.fbq('track', 'ViewContent');
};

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  Sparkles,
  AlertCircle,
  TrendingDown,
  Frown,
  RotateCcw,
  Brain,
  Heart,
  Lightbulb,
  BookOpen,
  Dumbbell,
  Target,
  Award,
  Play,
  Headphones,
  Quote,
  Star,
  Mail,
  Shield,
  Check,
  Clock,
  Zap,
  HelpCircle,
} from "lucide-react";

const Home = () => {
  // Hero component logic
  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  // Problem component logic
  const problems = [
    {
      icon: TrendingDown,
      title: "Diet Konvensional Memicu Hormon Lapar",
      description: "Menahan lapar meningkatkan hormon Ghrelin dan Kortisol, membuat tubuh menimbun lemak sebagai respons bertahan hidup."
    },
    {
      icon: Frown,
      title: "The Cursed Pressure",
      description: "Melawan keinginan menciptakan tekanan psikologis yang justru membuat Anda semakin ingin makan. Ini bukan soal kemauan, tapi sistem yang salah."
    },
    {
      icon: RotateCcw,
      title: "Yoyo Effect yang Mematahkan Semangat",
      description: "Turun 5 kg, naik 7 kg. Siklus ini merusak metabolisme dan kepercayaan diri Anda."
    }
  ];

  // Solution component logic
  const principles = [
    {
      icon: Brain,
      title: "Berat Badan = Identitas Mental",
      description: "Tubuh Anda hanyalah cerminan dari identitas bawah sadar. Ubah 'cetak biru mental', tubuh akan mengikuti secara otomatis."
    },
    {
      icon: Lightbulb,
      title: "Gelombang Otak Alpha/Theta",
      description: "Gunakan neurosains untuk menanam sugesti positif saat otak paling reseptif (meditasi & tidur)."
    },
    {
      icon: Heart,
      title: "Joyful Movement, Bukan Siksaan",
      description: "Gerak yang menyenangkan mengaktifkan dopamin (hormon bahagia), bukan kortisol (hormon stress)."
    }
  ];

  // AudioTeaser component logic
  const [isPlaying, setIsPlaying] = useState(false);
  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Contents component logic
  const chapters = [
    {
      icon: Sparkles,
      number: "BAB 1",
      title: "Cheat Code & Jalan Pintas Sugesti",
      description: "Rahasia programmer pikiran untuk memotong proses bertahun-tahun menjadi beberapa minggu. Teknik sugesti yang digunakan oleh atlet olimpiade.",
      highlights: ["Teknik auto-sugesti cepat", "Script afirmasi ready-to-use", "Timing optimal untuk reprogramming"]
    },
    {
      icon: Brain,
      number: "BAB 2",
      title: "The Mental Mirror - Mengubah Identitas",
      description: "Pelajari cara kerja identitas bawah sadar dan bagaimana tubuh Anda adalah cerminan langsung dari self-image internal Anda.",
      highlights: ["Konsep 'Set Point' berat badan", "Cara mengubah cetak biru mental", "Latihan visualisasi identity shift"]
    },
    {
      icon: Target,
      number: "BAB 3",
      title: "The Abundance Release Method™",
      description: "Teknik 3 langkah revolusioner: Bayangkan → Lepaskan → Rasakan. Metode ini menggabungkan neurosains dengan prinsip manifestasi modern.",
      highlights: ["Panduan step-by-step harian", "Waktu terbaik praktik (Alpha/Theta state)", "Common mistakes & cara menghindarinya"]
    },
    {
      icon: Dumbbell,
      number: "BAB 4",
      title: "Joyful Movement - Gerak Tanpa Paksaan",
      description: "Lupakan gym menyiksa. Temukan gerakan yang Anda nikmati dan aktifkan 'Abundance Loop' - semakin enjoy, semakin konsisten, semakin langsing.",
      highlights: ["Intuitive Eating principles", "Gerakan yang melepas dopamin", "Menghindari over-exercise trap"]
    },
    {
      icon: Award,
      number: "BAB 5",
      title: "Konsistensi Permanen & Kisah Sukses Anna",
      description: "Studi kasus nyata: Bagaimana Anna (35 tahun, ibu 2 anak) turun 18 kg tanpa diet ketat dan malah mendapat promosi jabatan berkat confidence baru.",
      highlights: ["Anna's transformation timeline", "Strategi anti-sabotase diri", "Maintenance jangka panjang"]
    }
  ];

  // Pricing component logic
  const features = [
    "5 Bab Komprehensif (120+ halaman)",
    "Audio Terapi Bawah Sadar",
    "Studi Kasus (Timeline lengkap)",
    "Akses Selamanya (Lifetime Access)",
    "Garansi Uang Kembali 30 Hari"
  ];
  const handleCTA = () => {
    window.location.href = 'https://app.elvisiongroup.com/diet';
  };

  useEffect(() => {
    initAndTrackPixel();
  }, []);

  // FAQ component logic
  const faqs = [
    {
      question: "Apakah metode ini cocok untuk saya yang sudah mencoba banyak diet gagal?",
      answer: "Justru metode ini dirancang untuk Anda! Jika diet konvensional gagal, itu bukan karena Anda lemah, tapi karena metodanya melawan cara kerja otak. Metode Abundance Mental fokus pada reprogramming mental, bukan 'menahan lapar' - jadi tidak ada efek yoyo lagi."
    },
    {
      question: "Berapa lama saya akan melihat hasil?",
      answer: "Setiap orang berbeda, tapi sebagian besar pengguna melaporkan perubahan mindset dalam 2-3 minggu pertama (lebih tenang, tidak crave makanan), dan penurunan berat terlihat di bulan ke-2. Anna dalam studi kasus turun 18 kg dalam 8 bulan secara konsisten tanpa yoyo."
    },
    {
      question: "Apakah saya harus mendengarkan audio setiap hari?",
      answer: "Untuk hasil optimal, dengarkan audio 3-5x seminggu saat tidur atau meditasi. Kuncinya adalah konsistensi, bukan intensitas. Audio dirancang agar bisa didengar sambil tidur (menanam sugesti ke bawah sadar)."
    },
    {
      question: "Apakah ini termasuk program diet atau menu makanan?",
      answer: "Bukan. Ini adalah metode reprogramming mental. Kami tidak memberikan menu diet, karena filosofi kami adalah 'Intuitive Eating' - makan apa yang tubuh minta, tapi dari identitas mental yang sudah diubah. Anda akan secara alami memilih makanan sehat."
    },
    {
      question: "Bagaimana cara mengakses e-book setelah pembelian?",
      answer: "Setelah pembayaran berhasil, Anda akan langsung menerima email berisi link download e-book (PDF) dan semua file audio (MP3). Akses selamanya, bisa diunduh ke perangkat apa pun."
    },
    {
      question: "Apakah ada syarat khusus? Usia? Kondisi kesehatan?",
      answer: "Metode ini aman untuk semua usia (18+). Namun jika Anda memiliki kondisi medis khusus (diabetes, gangguan makan, dll), harap konsultasi dengan dokter Anda sebelum memulai program perubahan berat badan apa pun."
    },
    {
      question: "Bagaimana jika saya tidak puas?",
      answer: "Kami memberikan garansi uang kembali 30 hari tanpa pertanyaan. Jika Anda merasa metode ini tidak cocok, cukup kirim email dan kami proses refund 100%."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-10" />
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full border border-accent/20">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Metode Revolusioner Berbasis Neurosains</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="text-foreground">Langsing Tanpa</span>
              <br />
              <span className="text-black">
                Penderitaan
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Mengubah Pikiran, Mengubah Tubuh dengan <span className="font-semibold text-primary">Metode Abundance Mental</span>
            </p>

            {/* Pain Point */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-[var(--shadow-card)] max-w-2xl mx-auto">
              <p className="text-lg text-foreground leading-relaxed">
                Bosan dengan diet yoyo? Lelah menahan lapar dan olahraga siksaan yang tidak bertahan lama?
                <span className="font-semibold text-primary"> Saatnya mengubah permainan.</span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <Button
                              size="lg"
                              onClick={scrollToPricing}
                              className="bg-emerald-500 text-white px-8 py-6"
                            >
                              Dapatkan Sekarang
                            </Button>              
            </div>

            {/* Trust Badge */}
            <p className="text-sm text-muted-foreground pt-4">
              🔒 100% Aman • Akses Instant • Garansi Uang Kembali
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Section Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Kenapa Diet Selalu Gagal?</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Masalah Sebenarnya Bukan di
                <span className="text-primary"> Tubuh Anda</span>
              </h2>
              
              <p className="text-xl text-muted-foreground">
                Penelitian neurosains membuktikan: 95% diet konvensional gagal dalam 2 tahun. Bukan karena Anda lemah, tapi karena metodenya melawan cara kerja otak manusia.
              </p>
            </div>

            {/* Problem Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {problems.map((problem, index) => (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 space-y-4 hover:shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                    <problem.icon className="w-6 h-6 text-destructive" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{problem.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
                </div>
              ))}
            </div>

            {/* Highlight Box */}
            <div className="bg-primary/5 border-l-4 border-primary rounded-r-xl p-6">
              <p className="text-lg text-foreground font-medium">
                Teori <span className="text-primary font-bold">"Reaktansi Psikologis"</span> menjelaskan: 
                Semakin Anda memaksa diri, semakin besar perlawanan internal. 
                Inilah sebabnya diet ketat selalu berakhir dengan "cheat day" yang tidak terkendali.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-16">
            {/* Section Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Solusi Revolusioner</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-foreground text-center">
                 <span className="bg-clip-text text-transparent bg-[var(--gradient-hero)]">Abundance Mental</span>
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Bukan lagi tentang membatasi. Ini tentang <span className="font-semibold text-primary">memprogram ulang identitas</span> Anda menjadi orang yang secara natural ramping dan sehat. Tubuh adalah cerminan mental. Orang ramping bukan karena mereka 'berjuang keras', 
                    tapi karena identitas bawah sadar mereka adalah <span className="font-semibold text-primary">"Saya adalah orang yang sehat dan ideal"</span>. 
                    Ebook ini mengajarkan cara mengubah identitas itu.
              </p>
            </div>

        

            {/* Principles Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {principles.map((principle, index) => (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 space-y-4 hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <principle.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{principle.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{principle.description}</p>
                </div>
              ))}
            </div>

            {/* Method Highlight */}
            <div className="bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20 rounded-2xl p-8 space-y-6">
              <h3 className="text-2xl font-bold text-foreground text-center">
                The Abundance Release Method™
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-accent">
                    1
                  </div>
                  <h4 className="font-semibold text-foreground">Visualisasi Intens</h4>
                  <p className="text-sm text-muted-foreground">Bayangkan diri ideal dengan detail sensori</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-primary">
                    2
                  </div>
                  <h4 className="font-semibold text-foreground">Letting Go</h4>
                  <p className="text-sm text-muted-foreground">Lepaskan keinginan memaksa (paradoks manifestasi)</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-secondary">
                    3
                  </div>
                  <h4 className="font-semibold text-foreground">Feeling it Real</h4>
                  <p className="text-sm text-muted-foreground">Rasakan emosi sudah mencapai tubuh ideal</p>
                </div>
              </div>
            </div>
            

          </div>
        </div>
      </section>

      {/* Audio Teaser Section */}
      <section className="py-20 bg-[var(--gradient-section)]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Main Audio Card */}
            <div className="bg-card border border-primary/30 rounded-2xl p-8 md:p-12 shadow-[var(--shadow-card)] space-y-6 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
              
              <div className="relative z-10 space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full border border-accent/20">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Bonus Eksklusif</span>
                </div>

                {/* Heading */}
                <div className="space-y-3">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    Dengarkan Cuplikan Terapi Bawah Sadar
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Rasakan perbedaannya hanya dalam 2 menit. Audio panduan ini akan membantu Anda memprogram ulang otak saat tidur.
                  </p>
                </div>

                {/* Audio Player UI */}
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">Sample Diet afirmasi</h3>
                  <audio controls autoPlay>
                    <source src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/diet/samplediet.MP3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>

                {/* Benefits */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Headphones className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Teknologi Binaural Beats</h4>
                      <p className="text-sm text-muted-foreground">Frekuensi khusus untuk relaksasi mendalam</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Afirmasi Tertanam</h4>
                      <p className="text-sm text-muted-foreground">Sugesti positif masuk ke bawah sadar</p>
                    </div>
                  </div>
                </div>

                {/* Note */}
                <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-4">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">💡 Tips:</span> Dengarkan dengan headphone di ruangan tenang untuk hasil maksimal. 
                    Ebook lengkap berisi 5+ audio berbeda untuk berbagai skenario.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contents Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Section Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm font-medium">Isi Lengkap E-book</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Apa yang Akan Anda
                <span className="text-primary"> Pelajari?</span>
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                5 Bab komprehensif dengan total 120+ halaman praktis, dilengkapi audio panduan dan worksheet.
              </p>
            </div>

            {/* Chapters List */}
            <div className="space-y-6">
              {chapters.map((chapter, index) => (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 md:p-8 hover:border-primary/50 hover:shadow-[var(--shadow-card)] transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Icon & Number */}
                    <div className="flex items-start gap-4 md:flex-col md:items-center md:min-w-[100px]">
                      <div className="w-14 h-14 bg-[var(--gradient-hero)] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <chapter.icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-primary md:text-center">{chapter.number}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {chapter.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {chapter.description}
                      </p>

                      {/* Highlights */}
                      <ul className="space-y-2 pt-2">
                        {chapter.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                            <span className="text-primary mt-0.5">✓</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bonus Section */}
            <div className="bg-gradient-to-br from-accent/10 to-secondary/10 border border-accent/30 rounded-2xl p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Bonus Eksklusif</h3>
              </div>
              <ul className="space-y-3 text-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">+</span>
                  <span><strong>Audio Terapi</strong> untuk berbagai skenario (tidur, meditasi, workout)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">+</span>
                  <span><strong>EBOOK</strong> untuk tracking progress dan journaling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">+</span>
                  <span><strong>Quick Reference Guide</strong> - Cheat sheet 1 halaman untuk akses cepat</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Section Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">Kisah Sukses Nyata</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Transformasi <span className="text-secondary">Anna</span>
              </h2>
            </div>

            {/* Main Testimonial Card */}
            <div className="bg-card border border-border rounded-2xl shadow-[var(--shadow-card)] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-secondary/10 to-primary/10 p-6 md:p-8 border-b border-border">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Avatar */}
                  <div className="w-24 h-24 bg-[var(--gradient-hero)] rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                    A
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">Anna Wijaya</h3>
                    <p className="text-muted-foreground">Wanita Karier, 35 Tahun, Ibu 2 Anak</p>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 space-y-6">
                {/* Quote */}
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-12 h-12 text-primary/20" />
                  <blockquote className="text-lg text-foreground leading-relaxed pl-8 italic">
                    "Saya sudah mencoba semua diet: Keto, Intermittent Fasting, bahkan Weight Watchers. 
                    Selalu turun 5-7 kg dalam 2 bulan, tapi naik lagi 10 kg dalam 6 bulan. 
                    Siklus yoyo ini membuat saya frustrasi dan kehilangan kepercayaan diri di kantor."
                  </blockquote>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 py-6 border-y border-border">
                  <div className="text-center space-y-1">
                    <div className="text-3xl font-bold text-secondary">-18kg</div>
                    <div className="text-sm text-muted-foreground">Berat Turun</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-3xl font-bold text-primary">8 Bulan</div>
                    <div className="text-sm text-muted-foreground">Durasi</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-3xl font-bold text-accent">100%</div>
                    <div className="text-sm text-muted-foreground">Konsisten</div>
                  </div>
                </div>

                {/* Story */}
                <div className="space-y-4 text-foreground">
                  <p className="leading-relaxed">
                    <strong className="text-primary">The Turning Point:</strong> Setelah menggunakan Metode Abundance Mental, 
                    Anna menyadari masalah sebenarnya bukan soal makanan, tapi identitas mentalnya yang masih 
                    "wanita yang harus berjuang keras untuk langsing."
                  </p>
                  
                  <p className="leading-relaxed">
                    Dengan audio terapi bawah sadar yang dilakukan setiap malam sebelum tidur, 
                    Anna mulai menanam sugesti baru: <em className="text-primary">"Saya adalah wanita yang secara natural sehat dan ideal."</em>
                  </p>

                  <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-4 space-y-2">
                    <p className="font-semibold text-foreground flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-secondary" />
                      Hasil di Luar Ekspektasi
                    </p>
                    <p className="text-sm leading-relaxed">
                      Dalam 3 bulan pertama, Anna turun 8 kg tanpa merasa menyiksa diri. 
                      Yang lebih mengejutkan: ia mulai menikmati jalan pagi (dulu dibenci) dan 
                      otomatis memilih makanan sehat tanpa "menahan diri."
                    </p>
                  </div>

                  <div className="bg-secondary/5 border-l-4 border-secondary rounded-r-lg p-4 space-y-2">
                    <p className="font-semibold text-foreground flex items-center gap-2">
                      <Heart className="w-5 h-5 text-secondary" />
                      Bonus Tak Terduga
                    </p>
                    <p className="text-sm leading-relaxed">
                      Confidence baru Anna membawa dampak ke karier: 
                      Ia mendapat promosi menjadi Senior Manager karena auranya yang berbeda. 
                      "Ketika Anda mencintai tubuh Anda, orang lain merasakan energi itu," ujar Anna.
                    </p>
                  </div>
                </div>

                {/* Final Quote */}
                <div className="bg-gradient-to-r from-accent/5 to-primary/5 rounded-xl p-6">
                  <p className="text-lg text-foreground italic text-center">
                    "Buku ini bukan hanya mengubah berat badan saya. Ia mengubah seluruh hidup saya. 
                    Sekarang saya tahu: <span className="font-bold text-primary not-italic">Langsing bukan tujuan, tapi efek samping dari mindset yang benar.</span>"
                  </p>
                  <p className="text-center text-sm text-muted-foreground mt-3">— Anna Wijaya</p>
                </div>

                {/* Video Testimony */}
                <div className="mt-8 text-center">
                  <video 
                    className="w-full max-w-2xl mx-auto rounded-lg shadow-lg" 
                    src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/diet/diet1.mp4" 
                    controls 
                    loop 
                    playsInline
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>

            {/* Trust Element */}
            <div className="text-center text-sm text-muted-foreground">
              <p>* Hasil individual dapat bervariasi. Anna mengikuti metode secara konsisten selama 8 bulan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Section Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full border border-secondary/20">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Penawaran Terbatas</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Investasi untuk
                <span className="text-primary"> Tubuh Ideal</span> Selamanya
              </h2>
            </div>

            {/* Scarcity Alert */}
            <div className="bg-secondary/10 border-2 border-secondary/30 rounded-xl p-4 flex items-center gap-3 max-w-2xl mx-auto">
              <Clock className="w-6 h-6 text-secondary flex-shrink-0" />
              <p className="text-foreground font-medium">
                <span className="text-secondary font-bold">DISKON HARI INI:</span> Harga spesial hanya berlaku sampai akhir hari ini!
              </p>
            </div>

            {/* Pricing Card */}
            <div className="bg-card border-2 border-primary/30 rounded-2xl shadow-[var(--shadow-card)] overflow-hidden max-w-2xl mx-auto">
              {/* Header */}
              <div className="bg-[var(--gradient-hero)] p-8 text-center text-black space-y-4">
                <h3 className="text-2xl font-bold">Paket Lengkap E-book + Audio</h3>
                <div className="space-y-2">
                  <div className="text-black/80 text-lg line-through">Rp 300.000</div>
                  <div className="text-5xl md:text-6xl font-bold">Rp 200.000</div>
                  <div className="text-black/90 text-sm">Hemat - Hanya Bulan Ini</div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Features List */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground text-lg mb-4">Yang Anda Dapatkan:</h4>
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Trust Badges */}
                <div className="grid md:grid-cols-3 gap-4 py-6 border-t border-border">
                  <div className="flex flex-col items-center text-center gap-2">
                    <Shield className="w-8 h-8 text-primary" />
                    <span className="text-sm text-muted-foreground">Pembayaran Aman</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <Zap className="w-8 h-8 text-secondary" />
                    <span className="text-sm text-muted-foreground">Akses Instant</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <Check className="w-8 h-8 text-accent" />
                    <span className="text-sm text-muted-foreground">Garansi 30 Hari</span>
                  </div>
                </div>



                {/* Guarantee */}
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <p className="text-sm text-foreground">
                    <strong className="text-primary">💯 Garansi 100% Bebas Risiko:</strong>
                    {" "}Jika dalam 30 hari Anda merasa metode ini tidak berguna setelah melakukan, 
                    kami kembalikan uang Anda tanpa pertanyaan.
                  </p>
                  <Button
                    size="lg"
                    onClick={handleCTA}
                    className="mt-4 w-full bg-emerald-500 text-white text-lg py-4"
                  >
                    Bayar Sekarang
                  </Button>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="text-center space-y-3">
              <div className="flex justify-center items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div 
                      key={i} 
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold border-2 border-background"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-muted-foreground text-sm">+237 pembeli bulan ini</span>
              </div>
              <p className="text-sm text-muted-foreground">
                ⭐️ 4.9/5.0 dari 189 review
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Section Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Pertanyaan Umum</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Masih Ada <span className="text-primary">Pertanyaan?</span>
              </h2>
              
              <p className="text-lg text-muted-foreground">
                Berikut jawaban untuk pertanyaan yang sering diajukan
              </p>
            </div>

            {/* FAQ Accordion */}
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/50 transition-colors"
                >
                  <AccordionTrigger className="text-left text-foreground hover:text-primary font-semibold py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Contact Support */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center space-y-3">
              <p className="text-foreground font-medium">
                Pertanyaan lain? Hubungi kami:
              </p>
              <a 
                href="mailto:support@elvisiongroup.com" 
                className="text-primary hover:underline font-semibold"
              >
                support@elvisiongroup.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-foreground text-background">
        {/* Final CTA Section */}
        <div className="border-b border-background/10">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Siap Mengubah Hidup Anda?
              </h2>
              <p className="text-lg text-background/80">
                Bergabunglah dengan ratusan orang yang sudah menemukan kebebasan dari diet yoyo
              </p>
                            <Button
                              size="lg"
                              onClick={scrollToPricing}
                              className="bg-emerald-500 text-white px-8 py-6"
                            >
                              Mulai Transformasi Sekarang
                            </Button>              <p className="text-sm text-background/60 pt-2">
                🔒 Pembayaran aman • Akses instant • Garansi 30 hari
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Brand */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold">Langsing Tanpa Penderitaan</h3>
              <p className="text-sm text-background/70 leading-relaxed">
                Metode Abundance Mental - Mengubah identitas, mengubah tubuh. 
                Berbasis neurosains dan psikologi transformasi.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="font-semibold text-background/90">Informasi</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li>
                  <a href="#pricing" className="hover:text-background transition-colors">
                    Harga & Paket
                  </a>
                </li>
                <li>
                  <a href="#solution" className="hover:text-background transition-colors">
                    Tentang Metode
                  </a>
                </li>
                <li>
                  <a href="mailto:support@elvisiongroup.com" className="hover:text-background transition-colors">
                    Kontak Support
                  </a>
                </li>
                <li>
                  <button className="hover:text-background transition-colors text-left">
                    Syarat & Ketentuan
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h4 className="font-semibold text-background/90">Kontak</h4>
              <div className="space-y-3">
                <a 
                  href="mailto:support@elvisiongroup.com"
                  className="flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  support@elvisiongroup.com
                </a>
                <div className="flex items-center gap-2 text-sm text-background/70">
                  <Shield className="w-4 h-4" />
                  Pembayaran Aman & Terpercaya
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-background/10 mt-12 pt-8 text-center">
            <p className="text-sm text-background/60">
              © 2024 Langsing Tanpa Penderitaan. Hak Cipta Dilindungi.
            </p>
            <p className="text-xs text-background/50 mt-2">
              Hasil individual dapat bervariasi. Produk ini bukan pengganti konsultasi medis profesional.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;