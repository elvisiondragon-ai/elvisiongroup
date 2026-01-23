import React, { useState } from 'react';
import { Heart, Download, Star, Check, ChevronDown, Sparkles, Users, BookOpen, Shield } from 'lucide-react';

export default function GriefTherapyLanding() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Produk ini bentuknya apa sih?",
      a: "Produk ini berbentuk file digital (PDF) yang bisa langsung kamu download setelah pembayaran. Kamu bisa print sendiri di rumah atau di tempat percetakan, dan bisa digunakan berulang kali — gak perlu beli ulang!"
    },
    {
      q: "Cocok untuk anak usia berapa?",
      a: "Bundle ini dirancang untuk berbagai usia: anak-anak (6-12 tahun), remaja (13-18 tahun), dan dewasa. Setiap workbook sudah disesuaikan dengan tahap perkembangan masing-masing kelompok usia."
    },
    {
      q: "Apakah bisa digunakan oleh guru atau terapis juga?",
      a: "Tentu saja! Bundle ini sangat cocok untuk konselor, psikolog, guru BK, terapis, dan siapa saja yang mendampingi proses berduka. Semua materi sudah trauma-informed dan evidence-based."
    },
    {
      q: "Berapa lama akses saya?",
      a: "Akses selamanya! Setelah download, file menjadi milikmu dan bisa digunakan kapan saja, berapa kali pun dibutuhkan."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/30 to-amber-100/30"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-8 border border-yellow-200/50">
            <Sparkles className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-900">Panduan Terapi Berduka Profesional</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
              Kehilangan Itu Berat.
            </span>
            <br />
            <span className="text-gray-800">
              Dan Kamu Gak Harus<br />Menjalaninya Sendiri.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Panduan terapi berduka untuk anak, remaja, & dewasa<br />
            yang membantu memproses kehilangan dengan cara aman & lembut
          </p>
          
          <div className="flex items-center justify-center gap-2 text-gray-500 mb-12">
            <Heart className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-lg">Trauma-informed & Evidence-based</span>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
            Mungkin ini yang lagi kamu alami:
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { title: "Anak jadi pendiam", desc: "atau emosinya meledak tanpa peringatan" },
              { title: "Remaja menarik diri", desc: "& susah diajak ngobrol atau terbuka" },
              { title: "Kamu sendiri capek", desc: "harus "kuat terus" tanpa ruang untuk berduka" }
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-white to-yellow-50/50 p-8 rounded-2xl shadow-lg border border-yellow-200/30 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">{i + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-2xl md:text-3xl font-semibold text-gray-700 mb-2">
              Niatnya mau bantu.
            </p>
            <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
              Tapi bingung harus mulai dari mana.
            </p>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/20 to-amber-100/20"></div>
        
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-8 py-3 rounded-full font-semibold text-lg mb-6 shadow-lg">
              🌿 Grief Therapy Bundle
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Solusi Lengkap untuk<br />Proses Berduka yang Sehat
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Kumpulan workbook, question cards, coping skills, dan emotional tools yang membantu proses berduka tanpa memaksa cepat pulih.
            </p>
          </div>

          {/* What's Inside */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-yellow-200/50">
            <h3 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
              <BookOpen className="w-8 h-8 text-yellow-600" />
              <span className="bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                Apa Aja Isinya?
              </span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: "📚", title: "Workbook terapi", desc: "Panduan lengkap untuk anak, remaja, dan dewasa" },
                { icon: "💭", title: "Question & Affirmation Cards", desc: "Kartu-kartu penuntun untuk refleksi dan penguatan diri" },
                { icon: "🧘", title: "Emotional Toolbox", desc: "Teknik grounding & calming untuk menenangkan diri" },
                { icon: "🌱", title: "Coping Skills", desc: "Strategi praktis untuk menghadapi hari-hari berat" }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 bg-gradient-to-br from-yellow-50 to-amber-50/50 p-6 rounded-xl border border-yellow-200/30 hover:shadow-lg transition-all">
                  <div className="text-4xl">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-800 mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl border-2 border-yellow-300/50">
              <p className="text-center text-gray-800 font-semibold flex items-center justify-center gap-2">
                <Shield className="w-5 h-5 text-yellow-700" />
                Semua dirancang age-appropriate & trauma-informed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is It For */}
      <section className="py-16 bg-gradient-to-br from-white to-yellow-50/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            <Users className="w-10 h-10 inline-block mb-2 text-yellow-600" />
            <br />Siapa yang Cocok?
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: "👨‍👩‍👧", title: "Orang Tua", desc: "Yang ingin mendampingi anak berduka" },
              { icon: "🧑‍🎓", title: "Remaja", desc: "Yang sedang memproses kehilangan" },
              { icon: "👨‍👩‍👧‍👦", title: "Keluarga Berduka", desc: "Yang butuh panduan bersama" },
              { icon: "🧑‍⚕️", title: "Konselor & Pendamping", desc: "Yang mendampingi klien" }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-lg text-center border-2 border-yellow-200/30 hover:border-yellow-400/50 transition-all hover:-translate-y-2">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
                <Check className="w-6 h-6 text-green-500 mx-auto mt-4" />
              </div>
            ))}
          </div>

          <p className="text-center text-xl font-semibold text-gray-700 mt-12">
            Satu bundle, bisa dipakai lintas usia.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
            Kata Mereka yang Sudah Mencoba
          </h2>
          <div className="flex justify-center gap-1 mb-12">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Ibu Dinda",
                role: "Orang Tua, 32 tahun",
                text: "Bundle ini benar-benar membantu anak saya memahami perasaannya setelah kehilangan neneknya. Workbook-nya lembut tapi efektif, dan saya jadi punya panduan jelas untuk mendampinginya."
              },
              {
                name: "Pak Reza",
                role: "Ayah dari 2 anak, 35 tahun",
                text: "Awalnya saya bingung bagaimana ngobrol sama anak tentang kehilangan. Question cards-nya sangat membantu membuka percakapan tanpa memaksa. Anak-anak jadi lebih terbuka."
              },
              {
                name: "Ibu Maya",
                role: "Konselor Sekolah, 29 tahun",
                text: "Sebagai konselor, saya sangat terbantu dengan tools yang trauma-informed ini. Siswa-siswa saya merespons dengan baik, dan prosesnya terasa aman untuk mereka. Highly recommended!"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-gradient-to-br from-white to-yellow-50/30 p-8 rounded-2xl shadow-xl border border-yellow-200/30 hover:shadow-2xl transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="border-t border-yellow-200 pt-4">
                  <p className="font-bold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/40 to-amber-100/40"></div>
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-800">
            Harga Spesial Buat Kamu! 🎉
          </h2>
          
          <div className="bg-white rounded-3xl shadow-2xl p-12 border-4 border-yellow-300/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-br from-red-500 to-red-600 text-white px-8 py-2 rounded-bl-3xl font-bold text-lg shadow-lg">
              DISKON 67%
            </div>
            
            <div className="mb-8">
              <p className="text-gray-600 text-lg mb-2">Harga Normal:</p>
              <p className="text-3xl text-gray-400 line-through mb-4">Rp 299.000</p>
              
              <p className="text-2xl font-semibold text-gray-700 mb-4">Harga Hari Ini:</p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                  Rp 99.000
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-8 text-left max-w-md mx-auto">
              {[
                "📦 Format digital (PDF) siap download",
                "🖨️ Bisa langsung print di rumah",
                "♾️ Akses selamanya",
                "🔄 Bisa digunakan berulang kali",
                "👨‍👩‍👧‍👦 Untuk semua anggota keluarga"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 bg-yellow-50 p-4 rounded-xl">
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <button className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-bold text-xl py-6 px-12 rounded-2xl shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3 group">
              <Download className="w-6 h-6 group-hover:animate-bounce" />
              Download Sekarang
            </button>

            <p className="text-sm text-gray-500 mt-6">
              ⚡ Penawaran terbatas! Harga bisa naik kapan saja
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white/60 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Pertanyaan yang Sering Ditanya
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg border border-yellow-200/30 overflow-hidden">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-yellow-50/50 transition-colors"
                >
                  <span className="font-semibold text-lg text-gray-800">{faq.q}</span>
                  <ChevronDown className={`w-6 h-6 text-yellow-600 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-8 pb-6 text-gray-600 leading-relaxed border-t border-yellow-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-yellow-100 to-amber-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Kamu Gak Sendirian dalam Proses Ini
          </h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Berduka adalah proses yang wajar dan butuh waktu.<br />
            Biarkan bundle ini jadi teman dalam perjalananmu.
          </p>
          
          <button className="bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-700 hover:to-amber-800 text-white font-bold text-2xl py-6 px-16 rounded-2xl shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-1 inline-flex items-center gap-3">
            <Heart className="w-7 h-7" />
            Mulai Perjalanan Pemulihan
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 text-center">
        <p className="text-sm">© 2025 Grief Therapy Bundle. Dibuat dengan 🤍 untuk mendampingi perjalanan berduka</p>
      </footer>
    </div>
  );
}