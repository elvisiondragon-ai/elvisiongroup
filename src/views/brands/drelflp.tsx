"use client";
import { useState } from "react";
import { ChevronRight, Play, Star, Shield, Heart, Sparkles, Clock, Award, MessageCircle } from "lucide-react";



export default function DrelfLanding() {
  const [activeTab, setActiveTab] = useState("home");

  const scrollToCheckout = () => {
    document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-rose-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-100 via-champagne to-rose-100 pt-12 pb-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6 px-6 py-2 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full text-sm font-semibold text-amber-900 shadow-lg">
              ✨ Pertama di Indonesia
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Rahasia yang Mereka
              <span className="block bg-gradient-to-r from-amber-600 via-amber-500 to-rose-500 bg-clip-text text-transparent">
                Sembunyikan dari Kamu
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-4 font-medium">
              Kenapa jutaan rupiah skincare kamu sia-sia?
            </p>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Karena 70% kecantikan sejati bukan dari luar... tapi dari ketenangan pikiran yang tidak pernah mereka beritahu
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={scrollToCheckout}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Dapatkan Sekarang <ChevronRight size={20} />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">1000+</div>
                <div className="text-sm text-gray-600">Wanita Bertransformasi</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <div className="text-sm text-gray-600">Rating Pelanggan</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">98%</div>
                <div className="text-sm text-gray-600">Reorder Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="relative w-full overflow-hidden py-8">
        <div className="container mx-auto px-6 max-w-sm">
          <div className="aspect-[9/16] w-full rounded-lg overflow-hidden shadow-xl relative">
            <iframe
              src="https://www.youtube.com/embed/U6NsL9RL9rY"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Pain Point Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
              Merasa <span className="text-rose-500">Familiar</span>?
            </h2>
            <p className="text-center text-gray-600 mb-16 text-lg">
              Ini yang terjadi pada ribuan wanita Indonesia setiap hari...
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {[
                {
                  title: "Habis Jutaan untuk Skincare",
                  desc: "Sudah pakai serum mahal, cream import, treatment spa... tapi kulit masih kusam dan lelah. Kenapa?",
                  icon: "💸"
                },
                {
                  title: "Kantung Mata & Wajah Lelah",
                  desc: "Tidur sudah cukup, tapi bangun tetap terlihat capek. Mata bengkak, wajah kusam. Foto selfie harus edit dulu.",
                  icon: "😫"
                },
                {
                  title: "Stress Membunuh Kecantikan",
                  desc: "Tekanan kerja, rumah tangga, sosial media... kortisol naik, kolagen turun 40%. Kulit jadi korban.",
                  icon: "😰"
                },
                {
                  title: "Percaya Diri Menurun",
                  desc: "Lihat cermin jadi insecure. Foto teman-teman glowing, kamu kok beda? Padahal umur sama...",
                  icon: "😔"
                }
              ].map((pain, i) => (
                <div key={i} className="bg-gradient-to-br from-rose-50 to-amber-50 p-8 rounded-2xl border-2 border-rose-100 hover:border-rose-300 transition-all duration-300 hover:shadow-xl">
                  <div className="text-4xl mb-4">{pain.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{pain.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{pain.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-amber-500 to-rose-500 p-1 rounded-3xl">
              <div className="bg-white p-10 rounded-3xl text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Tahukah Kamu Masalah Sebenarnya?
                </h3>
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  <span className="font-bold text-rose-600">70% kecantikan sejati</span> bukan dari produk yang kamu oles di kulit...
                </p>
                <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                  Tapi dari KETENANGAN PIKIRAN yang tidak pernah ada dalam bottle mahal itu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Products Section */}
      <section className="py-20 bg-gradient-to-br from-white to-amber-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Produk Kami
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              DRELF Ultimate Collagen, formulasi premium untuk kecantikan holistik Anda.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-amber-100 p-6">
                <img src={"https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/produk1.png"} alt="Drelf Product 1" className="w-full h-auto rounded-lg mb-4"/>
                <h3 className="text-xl font-bold text-gray-900 mb-2">DRELF Collagen Sachet</h3>
                <p className="text-gray-700">Kemasan praktis untuk konsumsi harian.</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-amber-100 p-6">
                <img src={"https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/produk2.png"} alt="Drelf Product 2" className="w-full h-auto rounded-lg mb-4"/>
                <h3 className="text-xl font-bold text-gray-900 mb-2">DRELF Collagen Box</h3>
                <p className="text-gray-700">Paket lengkap untuk transformasi 30 hari.</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-amber-100 p-6">
                <img src={"https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/produk3.png"} alt="Drelf Product 3" className="w-full h-auto rounded-lg mb-4"/>
                <h3 className="text-xl font-bold text-gray-900 mb-2">DRELF Collagen Bottle</h3>
                <p className="text-gray-700">Botol eksklusif untuk gaya hidup mewah.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why DRELF Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Mengapa Memilih DRELF?
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Lebih dari sekadar kolagen, sebuah revolusi kecantikan holistik.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-amber-50 to-rose-50 p-8 rounded-2xl border-2 border-amber-100 shadow-lg">
                <img src={"https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/why1.png"} alt="Why Drelf 1" className="w-full h-48 object-cover rounded-lg mb-4"/>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pendekatan Holistik</h3>
                <p className="text-gray-700">Menyentuh akar permasalahan kecantikan dari dalam.</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-rose-50 p-8 rounded-2xl border-2 border-amber-100 shadow-lg">
                <img src={"https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/why2.png"} alt="Why Drelf 2" className="w-full h-48 object-cover rounded-lg mb-4"/>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ilmiah & Terbukti</h3>
                <p className="text-gray-700">Formulasi berdasarkan riset dan studi klinis.</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-rose-50 p-8 rounded-2xl border-2 border-amber-100 shadow-lg">
                <img src={"https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/why3.png"} alt="Why Drelf 3" className="w-full h-48 object-cover rounded-lg mb-4"/>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Kualitas Premium</h3>
                <p className="text-gray-700">Bahan baku pilihan dengan standar tertinggi.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Point - Testimonial Style */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-rose-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-6 py-2 bg-amber-100 rounded-full text-amber-800 font-semibold mb-4">
                💬 Dari Pengguna yang Sudah Coba Puluhan Merek Kolagen
              </div>
              <h2 className="text-4xl font-bold text-gray-900">
                "Baru Kali Ini... Beneran Kerasa Bedanya"
              </h2>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-16 relative">
              <div className="absolute -top-6 -left-6 text-8xl text-amber-200 font-serif">"</div>
              <div className="absolute -bottom-6 -right-6 text-8xl text-amber-200 font-serif">"</div>
              
              <div className="relative z-10 space-y-6 text-lg text-gray-700 leading-relaxed">
                <p className="font-medium text-xl text-gray-900">
                  Aku mau jujur ya...
                </p>
                
                <p>
                  Aku sudah minum kolagen <span className="font-bold text-amber-600">bertahun-tahun</span>. Banyak merek, banyak klaim.
                </p>
                
                <p className="text-xl font-bold text-rose-600">
                  Tapi baru kali ini… aku benar-benar kerasa bedanya.
                </p>
                
                <p>
                  DRELF ini bukan cuma kolagen. <span className="font-bold">Ada audionya</span>. Dan efeknya itu… 
                  <span className="bg-amber-100 px-2 py-1 rounded font-semibold"> bangun tidur badan terasa segar, wajah nggak lelah</span>, 
                  feel-nya beda.
                </p>
                
                <p>
                  Biasanya kolagen itu nunggu lama, kadang nggak kerasa. Tapi ini… 
                  <span className="font-bold text-amber-700"> kerasa dari tubuh, bukan cuma dari pikiran.</span>
                </p>
                
                <div className="bg-gradient-to-r from-amber-50 to-rose-50 p-6 rounded-2xl border-2 border-amber-200 mt-8">
                  <p className="text-2xl font-bold text-gray-900 text-center">
                    Jujur, ini game changing di dunia kolagen.
                  </p>
                </div>
                
                <p className="text-center text-gray-600 italic pt-4">
                  Kalau penasaran, jangan percaya aku. <span className="font-bold text-amber-600 not-italic">Coba sendiri.</span>
                </p>
              </div>

              <div className="flex items-center gap-4 mt-10 pt-8 border-t-2 border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-rose-400 rounded-full flex items-center justify-center text-2xl">
                  👩
                </div>
                <div>
                  <div className="font-bold text-gray-900">Sarah M.</div>
                  <div className="text-gray-600 text-sm">Sudah coba 10+ merek kolagen premium</div>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Transformasi Nyata Pelanggan Kami
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  <img src={"https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/1.jpeg"} alt="Testimony 1" className="w-full h-auto rounded-lg shadow-md object-cover"/>
                  <img src={"https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/2.jpeg"} alt="Testimony 2" className="w-full h-auto rounded-lg shadow-md object-cover"/>
                  <img src={"https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/3.jpeg"} alt="Testimony 3" className="w-full h-auto rounded-lg shadow-md object-cover"/>
                  <img src={"https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/4.jpeg"} alt="Testimony 4" className="w-full h-auto rounded-lg shadow-md object-cover"/>
                  <img src={"https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/5.jpeg"} alt="Testimony 5" className="w-full h-auto rounded-lg shadow-md object-cover"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Kenapa DRELF Berbeda dari
                <span className="block bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                  Semua Kolagen di Pasaran?
                </span>
              </h2>
              <p className="text-xl text-gray-600">
                Inilah revolusi kecantikan holistik yang mengubah segalanya
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="bg-gradient-to-br from-rose-50 to-white p-8 rounded-2xl border-2 border-rose-100">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-rose-600 rounded-2xl flex items-center justify-center mb-6">
                  <Heart className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Kolagen Premium 5000mg
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Marine collagen murni dari deep sea fish, bioavailability 98%, langsung diserap tubuh.
                </p>
                <ul className="space-y-2">
                  {["Kulit lebih kencang & elastis", "Mengurangi kerutan 40%", "Glow alami dari dalam"].map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-2xl border-2 border-amber-100">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Audio Meditasi Eksklusif
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Panduan meditasi khusus untuk menurunkan kortisol, meningkatkan produksi kolagen alami.
                </p>
                <ul className="space-y-2">
                  {["Stress turun 60%", "Tidur berkualitas", "Produksi kolagen naik 35%"].map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500 p-1 rounded-3xl">
              <div className="bg-white p-10 rounded-3xl">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="text-amber-600" size={32} />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">2-4 Minggu</div>
                    <div className="text-gray-600">Hasil terlihat nyata</div>
                  </div>
                  <div>
                    <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="text-rose-600" size={32} />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">BPOM</div>
                    <div className="text-gray-600">Certified & Aman</div>
                  </div>
                  <div>
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-rose-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="text-amber-600" size={32} />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">1000+</div>
                    <div className="text-gray-600">Testimoni Nyata</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The DRELF Difference Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-rose-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Rasakan Perbedaan DRELF
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Kecantikan sejati datang dari keseimbangan pikiran dan tubuh.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-amber-100">
                <img src={"https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/drelf4.png"} alt="Drelf Beauty 4" className="w-full h-auto rounded-lg mb-4"/>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ketenangan Batin</h3>
                <p className="text-gray-700">Drelf membantu menenangkan pikiran Anda.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-rose-100">
                <img src={"https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/drelf5.png"} alt="Drelf Beauty 5" className="w-full h-auto rounded-lg mb-4"/>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pancaran Alami</h3>
                <p className="text-gray-700">Kecantikan yang memancar dari dalam.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before After Timeline */}
      <section className="py-20 bg-gradient-to-br from-rose-50 via-amber-50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
              Perjalanan Transformasi Kamu
            </h2>

            <div className="space-y-8">
              {[
                {
                  week: "Minggu 1-2",
                  title: "Foundation Phase",
                  desc: "Tubuh mulai menyerap kolagen, pikiran lebih tenang dengan meditasi pagi",
                  results: ["Tidur lebih nyenyak", "Mood stabil", "Kulit terasa lebih lembab"]
                },
                {
                  week: "Minggu 3-6",
                  title: "Transformation Phase",
                  desc: "Perubahan nyata mulai terlihat, komplimen mulai berdatangan",
                  results: ["Kulit glowing alami", "Fine lines berkurang", "Energi meningkat", "Percaya diri naik"]
                },
                {
                  week: "Minggu 7-12",
                  title: "Mastery Phase",
                  desc: "Kecantikan holistik jadi lifestyle, bukan lagi effort",
                  results: ["Awet muda dari dalam", "Stress management natural", "Inner beauty radiates"]
                }
              ].map((phase, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold">
                      {i + 1}
                    </div>
                    {i < 2 && <div className="w-1 h-full bg-gradient-to-b from-amber-400 to-rose-500 rounded-full"></div>}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-amber-100">
                      <div className="text-sm font-semibold text-amber-600 mb-1">{phase.week}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{phase.title}</h3>
                      <p className="text-gray-600 mb-4">{phase.desc}</p>
                      <div className="space-y-2">
                        {phase.results.map((result, j) => (
                          <div key={j} className="flex items-center gap-2 text-gray-700">
                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"></div>
                            <span className="text-sm">{result}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Section */}
      <section id="checkout" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-6 py-2 bg-rose-100 rounded-full text-rose-800 font-semibold mb-4">
                🎁 Penawaran Terbatas
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Mulai Transformasi Hari Ini
              </h2>
              <p className="text-gray-600 text-lg">
                1 Box = 10 Sachet Premium Collagen + Akses Audio Meditasi Eksklusif
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-rose-50 rounded-3xl p-8 border-2 border-amber-200 shadow-2xl">
              <div className="text-center mb-8">
                <img src={"https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/checkout1.png"} alt="Drelf Checkout Product" className="mx-auto max-w-xs mb-8 rounded-lg shadow-lg"/>
                <div className="inline-block">
                  <div className="text-gray-500 line-through text-xl mb-2">Rp 750.000</div>
                  <div className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent mb-2">
                    Rp 600.000
                  </div>
                  <div className="inline-block px-4 py-1 bg-rose-500 text-white rounded-full text-sm font-semibold">
                    Hemat Rp 150.000
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>10 Sachet Kolagen Premium 5000mg</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>6 Audio Meditasi Eksklusif</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>FREE Ongkir Se-Indonesia</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>Konsultasi Beauty via WhatsApp</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>Buklet Panduan Kecantikan VIP</span>
                </div>
              </div>

              <button 
                onClick={() => window.location.href = 'https://app.elvisiongroup.com/drelf'}
                className="w-full py-5 bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500 text-white rounded-full font-bold text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 mb-4"
              >
                Pesan Sekarang <ChevronRight size={24} />
              </button>

              <div className="text-center space-y-2 text-sm text-gray-600">
                <p>✓ Pembayaran Aman & Terpercaya</p>
                <p>✓ Garansi Uang Kembali 30 Hari</p>
                <p>✓ Pengiriman Cepat & Rapi</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <a 
                href="https://wa.me/628980040002?text=Kak%20mau%20tanya%20Drelf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <MessageCircle size={20} />
                Ada Pertanyaan? Chat CS Kami
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-br from-amber-100 via-rose-100 to-amber-100">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Cantik itu Pilihan.
              <span className="block text-amber-600">Kamu Pilih yang Mana?</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-200">
                <div className="text-4xl mb-4">😔</div>
                <h3 className="font-bold text-gray-900 mb-3">Tanpa DRELF</h3>
                <ul className="space-y-2 text-left text-gray-600 text-sm">
                  <li>❌ Habis jutaan, hasil minimal</li>
                  <li>❌ Stress terus, kulit kusam</li>
                  <li>❌ Insecure setiap hari</li>
                  <li>❌ Umur terlihat lebih tua</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-rose-50 p-6 rounded-2xl shadow-xl border-2 border-amber-300">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="font-bold text-gray-900 mb-3">Dengan DRELF</h3>
                <ul className="space-y-2 text-left text-gray-700 text-sm">
                  <li>✓ Glowing natural dari dalam</li>
                  <li>✓ Tenang, bahagia, percaya diri</li>
                  <li>✓ Komplimen terus datang</li>
                  <li>✓ Awet muda holistik</li>
                </ul>
              </div>
            </div>

            <p className="text-xl text-gray-700 mb-8">
              Investasi terbaik adalah untuk dirimu sendiri. 
              <span className="block font-bold text-amber-600 mt-2">Mulai hari ini, lihat hasilnya dalam 2-4 minggu.</span>
            </p>

            <button 
              onClick={() => window.location.href = 'https://app.elvisiongroup.com/drelf'}
              className="px-12 py-5 bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500 text-white rounded-full font-bold text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Ya, Saya Mau Cantik Holistik Sekarang!
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-xl mb-4 bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
                  DRELF.ID
                </h3>
                <p className="text-gray-400 text-sm">
                  Revolusi kecantikan holistik pertama di Indonesia. Mind, Body, Skin.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Kontak</h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>WhatsApp CS: 0895-3256-33487</p>
                  <p>Email: support@drelf.id</p>
                  <p>Jam Operasional: 09.00-21.00 WIB</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Jaminan Kami</h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>✓ BPOM Certified</p>
                  <p>✓ Garansi Uang Kembali 30 Hari</p>
                  <p>✓ FREE Ongkir Se-Indonesia</p>
                  <p>✓ Pembayaran Aman</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-gray-500 text-sm">
                © 2024 DRELF.ID - All Rights Reserved. Produk ini telah terdaftar BPOM dan aman dikonsumsi.
              </p>
              <p className="text-gray-600 text-xs mt-2">
                Hasil dapat bervariasi tergantung kondisi individu. Konsultasikan dengan dokter jika memiliki kondisi medis tertentu.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/*
 * Extracted URLs, Links, Images, and Video Paths from src/pages/drelflp.tsx:
 *
 * Image Assets (local paths):
 * - @/assets/checkout1.png
 * - @/assets/home1.png
 * - @/assets/siteicon.png
 * - @/assets/drelf4.png
 * - @/assets/drelf5.png
 * - @/assets/produk1.png
 * - @/assets/produk2.png
 * - @/assets/produk3.png
 * - @/assets/why1.png
 * - @/assets/why2.png
 * - @/assets/why3.png
 * - @/assets/1.jpeg
 * - @/assets/2.jpeg
 * - @/assets/3.jpeg
 * - @/assets/4.jpeg
 * - @/assets/5.jpeg
 *
 * Video Paths:
 * - https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/rus.mp4
 * - /rus.jpg (poster image for video)
 *
 * External Links/URLs:
 * - https://app.elvisiongroup.com/drelf
 * - https://wa.me/628980040002?text=Kak%20mau%20tanya%20Drelf
 */
