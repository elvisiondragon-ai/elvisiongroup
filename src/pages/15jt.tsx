import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, TrendingUp, Heart, Crown, DollarSign, Phone, ArrowRight, Sparkles, Shield } from 'lucide-react';

export default function ELVision15JT() {
  const whatsappUrl = "https://wa.me/62895325633487?text=" + encodeURIComponent("Kak Renata saya mau tanya tentang 1:1 6 minggu. \nNama: \nTujuan Spesifik: ");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testimonials = [
    {
      name: "Agus Mulyadi, SH., MH.",
      title: "Kepala Intelijen Pangandaran",
      image: "👨‍💼",
      rating: 5,
      text: "Clarity yang saya rasakan luar biasa. Setelah 6 minggu, keputusan-keputusan besar yang tadinya membingungkan kini terasa mudah dan jelas. eL Vision membuka dimensi baru dalam kepemimpinan saya."
    },
    {
      name: "Moses Maina",
      title: "Former Luxury Gym Manager, Dubai",
      image: "🏋️",
      rating: 5,
      text: "Kehilangan pekerjaan adalah titik terendah saya. Hanya 1x sesi, saya mendapat clarity yang luar biasa. Dalam 2 minggu, saya dapat posisi baru yang jauh lebih baik dengan gaji 40% lebih tinggi. Ini bukan kebetulan."
    },
    {
      name: "David Sutanto",
      title: "CEO Tech Startup, Valuasi $50M",
      image: "👔",
      rating: 5,
      text: "Uang bukan masalah lagi, tapi masalah terus datang. Setelah 1:1 dengan eL Vision, saya paham: yang kurang bukan strategi, tapi kalibrasi energi. Sekarang bisnis tumbuh tanpa drama."
    },
    {
      name: "Linda Permata",
      title: "Investor & Pengusaha Properti",
      image: "👩‍💼",
      rating: 5,
      text: "Saya pikir saya sudah 'selesai' secara finansial. Ternyata ada level berikutnya: manifestasi tanpa paksaan. 15 juta ini investasi terbaik dibanding seminar 100 juta yang cuma teori."
    },
    {
      name: "Stephanie Chen",
      title: "Art Gallery Owner, Singapore",
      image: "🎨",
      rating: 5,
      text: "Setelah sesi 1 gratis, saya langsung tahu ini berbeda. Bukan saran kosong, tapi hasil nyata. 3 minggu kemudian, koleksi saya terjual dengan harga 3x lipat dari ekspektasi. Energy shift-nya real."
    },
    {
      name: "Budi Hermawan",
      title: "Pemilik Grup Perusahaan Manufaktur",
      image: "🎯",
      rating: 5,
      text: "6 minggu mengubah 15 tahun pola pikir. Harta sudah ada, tapi ketenangan tidak. Sekarang saya mengerti: kemakmuran sejati dimulai dari 1% fokus yang tepat."
    },
    {
      name: "Dr. Siska Wijaya",
      title: "Dokter Spesialis & Praktisi Holistik",
      image: "⚕️",
      rating: 5,
      text: "Sebagai dokter, saya skeptis. Tapi sistem 1:1 ini bukan hanya teori spiritual—ini science of consciousness. Pasien saya juga merasakan perubahan energi saya yang berbeda."
    },
    {
      name: "Rahman Putra",
      title: "Direktur Perusahaan Ekspor-Impor",
      image: "🌏",
      rating: 5,
      text: "Deal-deal besar mulai datang dengan sendirinya. Yang berubah bukan strategi bisnis saya, tapi kalibrasi internal. eL Vision mengajarkan manifestasi dari level yang belum pernah saya sentuh."
    },
    {
      name: "Patricia Wong",
      title: "Fashion Entrepreneur, Jakarta",
      image: "👗",
      rating: 5,
      text: "Brand saya stuck di revenue yang sama selama 2 tahun. Setelah program ini, breakthrough datang: partnership dengan retailer internasional yang saya tidak pernah bayangkan. Ini tentang alignment energi."
    }
  ];

  const goals = [
    {
      icon: <DollarSign className="w-12 h-12" />,
      title: "HARTA",
      description: "Manifestasi wealth consciousness tanpa kegelisahan. Uang datang dengan natural flow."
    },
    {
      icon: <Crown className="w-12 h-12" />,
      title: "TAHTA",
      description: "Kepemimpinan yang didasari clarity. Pengaruh yang organik dan berkelanjutan."
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: "CINTA",
      description: "Relasi yang autentik dan mendalam. Magnetic presence yang natural."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 blur-3xl"
              style={{
                width: `${Math.random() * 400 + 200}px`,
                height: `${Math.random() * 400 + 200}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `translateY(${scrollY * 0.5}px)`,
                animation: `float ${Math.random() * 15 + 10}s infinite ease-in-out`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-full px-6 py-3 backdrop-blur-sm">
              <Shield className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-500 font-semibold">EXCLUSIVELY FOR HIGH ACHIEVERS</span>
            </div>
          </div>

          <h1 className="text-7xl md:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
              1:1 SYSTEM
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
            Untuk mereka yang sudah memiliki segalanya, tapi masih mencari sesuatu yang lebih dalam
          </p>

                      <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/30 rounded-2xl p-8 max-w-2xl mx-auto backdrop-blur-sm mb-8">
            <div className="inline-block bg-green-500/20 border border-green-500/50 rounded-full px-6 py-2 mb-4">
              <span className="text-green-400 font-bold">✓ SESI 1 GRATIS - RASAKAN DULU VALUENYA</span>
            </div>
            <div className="text-5xl font-bold text-yellow-400 mb-2">Rp 15.000.000</div>
            <div className="text-xl text-gray-300 mb-1">6 Minggu • 6 Sesi Private (60 menit/sesi)</div>
            <div className="text-sm text-gray-400">Bayar setelah Sesi 1 • 1 Sesi per Minggu</div>
          </div>

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="group bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold text-xl px-12 py-6 rounded-full transition-all transform hover:scale-105 shadow-2xl shadow-yellow-500/50 flex items-center gap-3 mx-auto">
            <Phone className="w-6 h-6" />
            BOOK A CALL
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </a>
        </div>
      </div>

      {/* Proof Not Advice Section */}
      <div className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl px-8 py-4 mb-8">
              <TrendingUp className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  Kami Tidak Menjual Saran
                </span>
              </h2>
              <p className="text-2xl text-gray-300">
                Kami Menjual <span className="text-yellow-400 font-bold">BUKTI HASIL</span>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-900/50 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 text-9xl opacity-10">❌</div>
                <h3 className="text-2xl font-bold text-red-400 mb-4">Bukan Ini</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-3 text-gray-400">
                    <span className="text-red-500 mt-1">×</span>
                    <span>Saran teoretis yang bagus di kertas</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <span className="text-red-500 mt-1">×</span>
                    <span>Motivasi sesaat yang hilang besok</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <span className="text-red-500 mt-1">×</span>
                    <span>Konsep spiritual yang abstrak</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <span className="text-red-500 mt-1">×</span>
                    <span>Janji-janji tanpa bukti nyata</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-900/30 to-black border-2 border-green-500/50 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 text-9xl opacity-10">✓</div>
                <h3 className="text-2xl font-bold text-green-400 mb-4">Yang Anda Dapat</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span><strong>Hasil terukur</strong> dalam minggu pertama</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span><strong>Transformasi energi</strong> yang Anda rasakan</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span><strong>Clarity</strong> untuk keputusan besar</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span><strong>Manifestasi nyata</strong> seperti clients kami</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/30 rounded-2xl p-8">
              <p className="text-2xl text-gray-300 leading-relaxed">
                Makanya <strong className="text-yellow-400">SESI 1 GRATIS</strong>.<br />
                Anda tidak perlu percaya kata-kata kami.<br />
                <span className="text-3xl font-bold text-yellow-400">Rasakan sendiri buktinya.</span>
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
                  Masalah terus berdatangan. Seakan uang menjadi magnet untuk drama, konflik, dan kegelisahan. Semakin banyak harta, semakin kompleks permasalahan yang menggerogoti ketenangan Anda.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-orange-900/30 rounded-2xl p-8">
                <div className="text-orange-400 text-6xl mb-4">🎭</div>
                <h3 className="text-2xl font-bold mb-4 text-orange-400">Sukses di Luar, Kosong di Dalam</h3>
                <p className="text-gray-300 leading-relaxed">
                  Pencapaian demi pencapaian sudah diraih. Tapi ada kekosongan yang tidak bisa diisi dengan apapun. Anda tahu ada yang lebih, tapi tidak tahu bagaimana mengaksesnya.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-2xl p-8">
                <div className="text-yellow-400 text-6xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold mb-4 text-yellow-400">Energi Terkuras</h3>
                <p className="text-gray-300 leading-relaxed">
                  Setiap hari terasa seperti pertempuran. Keputusan besar menguras energi. Anda ingin flow yang natural, bukan perjuangan konstan yang melelahkan.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-amber-900/30 rounded-2xl p-8">
                <div className="text-amber-400 text-6xl mb-4">🌪️</div>
                <h3 className="text-2xl font-bold mb-4 text-amber-400">Kehilangan Clarity</h3>
                <p className="text-gray-300 leading-relaxed">
                  Visi yang dulu tajam kini kabur. Terlalu banyak pilihan, terlalu banyak suara. Anda butuh kejernihan untuk melihat langkah berikutnya dengan pasti.
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
              Atau kombinasi ketiganya? Kami akan sesuaikan dengan kebutuhan Anda.
            </p>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="group bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold text-lg px-10 py-5 rounded-full transition-all transform hover:scale-105 shadow-xl flex items-center gap-3 mx-auto">
              <Phone className="w-5 h-5" />
              BOOK A CALL SEKARANG
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* What You Get Section */}
      <div className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Apa Yang Anda Dapatkan
            </span>
          </h2>

          <div className="max-w-4xl mx-auto space-y-6">
            {[ 
              "6 Sesi Private 1:1 (90 menit per sesi) dengan metode eL Vision eksklusif",
              "Vipassana & Kalibrasi khusus disesuaikan dengan tujuan spesifik Anda",
              "Akses langsung via WhatsApp untuk guidance di antara sesi",
              "Custom manifestation protocol berdasarkan energi signature Anda",
              "Tracking progress mingguan untuk memastikan transformasi yang terukur",
              "Lifetime access ke komunitas eksklusif high-tier clients"
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-yellow-900/50 transition-all">
                <CheckCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                <span className="text-lg text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Apa Kata High-Tier Clients Kami
            </span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16">
            Mereka yang sudah "berhasil" tapi mencari level berikutnya
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-2xl p-8 hover:border-yellow-500/50 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{testimonial.image}</div>
                  <div>
                    <h3 className="text-xl font-bold text-yellow-400">{testimonial.name}</h3>
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
                Setiap testimoni adalah bukti dari kalibrasi energi yang tepat.
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
                Saatnya Kalibrasi Ulang
              </span>
            </h2>

            <p className="text-2xl text-gray-300 mb-8 leading-relaxed">
              Uang Anda sudah cukup. Yang Anda butuhkan adalah clarity, ketenangan, dan flow yang natural dalam memanifestasikan keinginan berikutnya.
            </p>

            <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/30 rounded-2xl p-10 backdrop-blur-sm mb-12">
              <div className="inline-block bg-green-500/20 border border-green-500/50 rounded-full px-6 py-2 mb-4">
                <span className="text-green-400 font-bold text-lg">✓ SESI 1 GRATIS - Zero Risk</span>
              </div>
              <div className="text-5xl font-bold text-yellow-400 mb-3">Rp 15.000.000</div>
              <div className="text-xl text-gray-300 mb-2">6 Minggu Transformasi (60 menit/sesi)</div>
              <div className="text-sm text-gray-400 mb-6">Bayar setelah Sesi 1 • 1 Sesi per Minggu</div>
              
              <div className="inline-block bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-6 py-3">
                <p className="text-yellow-400 font-semibold">⚡ Limited: Hanya 3 Slot per Bulan</p>
              </div>
            </div>

            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="group bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold text-2xl px-16 py-8 rounded-full transition-all transform hover:scale-105 shadow-2xl shadow-yellow-500/50 flex items-center gap-4 mx-auto mb-8">
              <Phone className="w-8 h-8" />
              BOOK A CALL SEKARANG
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </a>

            <p className="text-gray-500 text-sm">
              Slot terbatas. Kami hanya bekerja dengan mereka yang serius untuk transformasi mendalam.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
