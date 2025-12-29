import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, ArrowRight, Gift, Star, Clock, Instagram, ShoppingBag, Facebook } from 'lucide-react';
import arif1 from '../assets/arif1.jpg'; // Import the image

export default function ArifAffiliate() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const scrollToCheckout = () => {
    document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* SECTION 1: PROBLEM SETUP */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center space-y-8">
            <div className="inline-block animate-bounce">
              <Heart className="w-16 h-16 mx-auto text-yellow-300" fill="currentColor" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Bagaimana Cara Bertahan Hidup Tanpa Operasi<br />Setelah Divonis Dokter?
            </h1>
            
            <p className="text-xl md:text-2xl text-emerald-50 max-w-3xl mx-auto">
              Temukan bagaimana saya, Syarifudin Arif, mengalahkan vonis kematian 3 bulan dan kini hidup lebih sehat dari sebelumnya—tanpa obat kimia, tanpa operasi
            </p>

            <div className="my-12">
              <img 
                src={arif1} 
                alt="Syarifudin Arif - Cancer Survivor" 
                className="mx-auto rounded-2xl shadow-2xl max-w-md w-full border-4 border-white"
              />
            </div>

            <div className="bg-red-600 text-white p-6 rounded-xl max-w-2xl mx-auto border-4 border-red-700">
              <p className="text-lg font-semibold mb-2">⚠️ REALITA YANG MENAKUTKAN:</p>
              <p className="text-base">
                Setiap hari yang berlalu tanpa mengubah pola hidup Anda adalah hari dimana sel-sel tidak sehat semakin berkembang. Dokter memberi saya 3 bulan—tapi saya menolak menyerah. Akankah Anda menunggu sampai terlambat?
              </p>
            </div>

            <button 
              onClick={scrollToCheckout}
              className="bg-yellow-400 text-gray-900 px-12 py-5 rounded-full text-xl font-bold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-2xl inline-flex items-center gap-3"
            >
              Saya Ingin Sehat Seperti Arif <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: PRESENT BENEFIT */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16">
          Yang Akan Kamu Dapatkan dari Perjalanan Saya
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-emerald-200 hover:shadow-2xl transition-all">
            <Sparkles className="w-12 h-12 text-emerald-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Kebangkitan Spiritual Berbasis Sains</h3>
            <p className="text-gray-600">Bukan magic, bukan mukjizat instant—tapi pemahaman mendalam tentang Law of Nature yang mengubah hidup saya 180 derajat</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-teal-200 hover:shadow-2xl transition-all">
            <Heart className="w-12 h-12 text-teal-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Metode Puasa yang Mengubah Segalanya</h3>
            <p className="text-gray-600">Rahasia teknik puasa yang saya gunakan untuk detoksifikasi tubuh dan regenerasi sel secara alami—tanpa kelaparan</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-cyan-200 hover:shadow-2xl transition-all">
            <Star className="w-12 h-12 text-cyan-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Tools dari eL Vision Group</h3>
            <p className="text-gray-600">Akses ke sistem dan tools yang membantu saya monitoring kesehatan dan membangun pola hidup baru yang sustainable</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-emerald-200 hover:shadow-2xl transition-all">
            <Gift className="w-12 h-12 text-emerald-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Cerita Nyata Tanpa Filter</h3>
            <p className="text-gray-600">Dokumentasi lengkap perjalanan saya dari vonis Maret 2025 hingga Desember 2025—bukti bahwa ini BUKAN kebetulan</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-teal-200 hover:shadow-2xl transition-all md:col-span-2">
            <Sparkles className="w-12 h-12 text-teal-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Komunitas & Support System</h3>
            <p className="text-gray-600">Bergabung dengan komunitas eL Vision Group yang supportif dan penuh dengan orang-orang yang juga sedang mentransformasi hidup mereka</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: PRODUCT BRIDGING */}
      <section className="bg-gradient-to-r from-emerald-100 to-teal-100 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-8">
            Apakah Anda Juga Merasa Putus Asa dengan Sistem Kesehatan Konvensional?
          </h2>

          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 my-12">
            <video 
              controls 
              className="w-full rounded-xl shadow-lg mb-8"
              poster={arif1}
            >
              <source src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/diet/diet1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            <div className="text-center">
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                <span className="font-bold text-emerald-600">FitFactor</span> adalah sebuah sistem revolusioner yang bukan hanya suplemen biasa, namun sangat <span className="font-bold">POWERFUL untuk mengoptimalkan metabolisme tubuh secara alami</span>, sehingga <span className="font-bold text-teal-600">tubuh Anda bisa kembali ke kondisi ideal dan melawan penyakit dari dalam</span>.
              </p>
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={scrollToCheckout}
              className="bg-emerald-600 text-white px-12 py-5 rounded-full text-xl font-bold hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-2xl inline-flex items-center gap-3"
            >
              Ya, Saya Mau Coba FitFactor! <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 4: BONUS */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-8 py-3 rounded-full font-bold text-2xl mb-4 animate-pulse">
            🎁 BONUS KHUSUS HARI INI! 🎁
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border-4 border-yellow-300">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-400 h-48 rounded-xl mb-4 flex items-center justify-center text-white text-4xl font-bold">
              📖
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">#BONUS 1: Panduan Puasa Intermittent</h3>
            <p className="text-emerald-600 font-bold text-lg mb-2">Nilai: Rp 497.000</p>
            <p className="text-gray-600">Panduan lengkap metode puasa yang saya gunakan untuk detoksifikasi dan regenerasi sel—step by step untuk pemula</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-4 border-yellow-300">
            <div className="bg-gradient-to-br from-teal-400 to-cyan-400 h-48 rounded-xl mb-4 flex items-center justify-center text-white text-4xl font-bold">
              🧘
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">#BONUS 2: Spiritual Awakening Checklist</h3>
            <p className="text-emerald-600 font-bold text-lg mb-2">Nilai: Rp 397.000</p>
            <p className="text-gray-600">Checklist praktis untuk membangun mindset dan spiritual berbasis sains—bukan mistik, tapi logis dan aplikatif</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-4 border-yellow-300">
            <div className="bg-gradient-to-br from-cyan-400 to-blue-400 h-48 rounded-xl mb-4 flex items-center justify-center text-white text-4xl font-bold">
              📱
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">#BONUS 3: Akses Eksklusif Komunitas</h3>
            <p className="text-emerald-600 font-bold text-lg mb-2">Nilai: Rp 697.000</p>
            <p className="text-gray-600">Bergabung dengan grup support eL Vision Group untuk sharing, motivasi, dan bimbingan langsung dari sesama pejuang kesehatan</p>
          </div>
        </div>
      </section>

      {/* SECTION 5: SOCIAL PROOF */}
      <section className="bg-gradient-to-r from-teal-100 to-cyan-100 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4">
            Mereka Juga Merasakan Transformasi Luar Biasa
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg">
            Ribuan orang telah membuktikan bahwa sistem ini bekerja—bukan hanya untuk saya
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <p className="text-gray-600 italic mb-4 text-lg">
                "Transformasi Arif benar-benar menginspirasi. Dari yang hampir menyerah menjadi role model kesehatan!"
              </p>
              <div className="bg-gradient-to-r from-emerald-200 to-teal-200 h-64 rounded-xl flex items-center justify-center text-4xl">
                ⭐⭐⭐⭐⭐
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <p className="text-gray-600 italic mb-4 text-lg">
                "Sistem eL Vision Group memang berbeda. Bukan janji kosong, tapi hasil nyata yang bisa dirasakan."
              </p>
              <div className="bg-gradient-to-r from-teal-200 to-cyan-200 h-64 rounded-xl flex items-center justify-center text-4xl">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: OFFER STACK */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16">
          Investasi Terbaik untuk Kesehatan Anda
        </h2>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-emerald-300">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Paket Lengkap Termasuk:</h3>
              <ul className="space-y-4">
                <li className="flex justify-between items-center">
                  <span className="text-gray-700">✅ FitFactor System</span>
                  <span className="font-bold text-emerald-600">Rp 1.497.000</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-700">✅ Bonus 1: Panduan Puasa</span>
                  <span className="font-bold text-emerald-600">Rp 497.000</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-700">✅ Bonus 2: Spiritual Checklist</span>
                  <span className="font-bold text-emerald-600">Rp 397.000</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-700">✅ Bonus 3: Akses Komunitas</span>
                  <span className="font-bold text-emerald-600">Rp 697.000</span>
                </li>
              </ul>
              <div className="border-t-2 border-gray-300 mt-6 pt-6">
                <div className="flex justify-between items-center text-2xl font-bold">
                  <span>TOTAL NILAI:</span>
                  <span className="text-emerald-600">Rp 3.088.000</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center text-center">
              <p className="text-3xl font-bold text-gray-800 mb-4">Tapi, Khusus Hari Ini</p>
              <p className="text-2xl text-gray-600 mb-4">Menjadi</p>
              <div className="relative">
                <p className="text-5xl font-bold text-gray-400 line-through mb-4">Rp 3.088.000</p>
                <p className="text-6xl font-bold text-emerald-600 animate-pulse">Rp 997.000</p>
              </div>
              <p className="text-red-600 font-bold text-xl mt-6">HEMAT Rp 2.091.000!</p>
            </div>
          </div>

          <div className="bg-red-600 text-white rounded-xl p-6 text-center mb-8">
            <Clock className="w-12 h-12 mx-auto mb-4" />
            <p className="text-2xl font-bold mb-4">Penawaran Terbatas!</p>
            <div className="flex justify-center gap-4 text-4xl font-bold">
              <div className="bg-white text-red-600 rounded-lg p-4 min-w-[80px]">
                {String(timeLeft.hours).padStart(2, '0')}
                <div className="text-sm font-normal">JAM</div>
              </div>
              <div className="text-4xl">:</div>
              <div className="bg-white text-red-600 rounded-lg p-4 min-w-[80px]">
                {String(timeLeft.minutes).padStart(2, '0')}
                <div className="text-sm font-normal">MENIT</div>
              </div>
              <div className="text-4xl">:</div>
              <div className="bg-white text-red-600 rounded-lg p-4 min-w-[80px]">
                {String(timeLeft.seconds).padStart(2, '0')}
                <div className="text-sm font-normal">DETIK</div>
              </div>
            </div>
            <p className="text-lg mt-4">Ingat, diskon menjadi Rp 997.000 hanya berlaku sebelum waktu menunjukkan 00:00:00</p>
          </div>

          <div id="checkout" className="text-center">
            <a 
              href="https://app.elvisiongroup.com/fitfactor?arif"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-16 py-6 rounded-full text-2xl font-bold hover:from-yellow-300 hover:to-orange-300 transition-all transform hover:scale-105 shadow-2xl inline-flex items-center gap-4"
            >
              🛒 BELI FITFACTOR SEKARANG! <ArrowRight className="w-8 h-8" />
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 7: HANDLING OBJECTION */}
      <section className="bg-gradient-to-br from-gray-800 to-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Bayangkan...</h2>
          
          <p className="text-xl md:text-2xl leading-relaxed mb-6">
            Kita selalu percaya bahwa <span className="text-yellow-400 font-bold">waktu adalah hal yang lebih berharga daripada uang</span>, betul? Karena waktu yang terlewat tidak bisa didapatkan kembali.
          </p>

          <p className="text-xl md:text-2xl leading-relaxed mb-6">
            Lantas, kenapa kita seringkali <span className="text-red-400 font-bold">membuang-buang waktu menunda kesehatan sampai kondisi memburuk</span>?
          </p>

          <p className="text-xl md:text-2xl leading-relaxed mb-6">
            Saya ingin kamu memiliki <span className="text-emerald-400 font-bold">FitFactor dan sistem eL Vision Group</span> agar kamu <span className="text-teal-400 font-bold">bisa mengubah hidup sebelum terlambat—seperti yang saya lakukan</span>.
          </p>

          <p className="text-xl md:text-2xl leading-relaxed mb-12">
            Investasi sebesar <span className="text-yellow-400 font-bold">Rp 997.000</span> akan menjadi tidak ternilai jika dibandingkan dengan <span className="text-red-400 font-bold">penyesalan seumur hidup karena tidak bertindak hari ini</span>.
          </p>

          <div className="bg-yellow-400 text-gray-900 rounded-2xl p-8 mb-12">
            <p className="text-2xl md:text-3xl font-bold">
              Buatlah pilihanmu sekarang juga.
            </p>
          </div>

          <a 
            href="https://app.elvisiongroup.com/fitfactor?arif"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-16 py-6 rounded-full text-2xl font-bold hover:from-emerald-400 hover:to-teal-400 transition-all transform hover:scale-105 shadow-2xl inline-flex items-center gap-4 mb-12"
          >
            MULAI TRANSFORMASI SAYA SEKARANG! <Heart className="w-8 h-8" fill="currentColor" />
          </a>

          <div className="border-t-2 border-gray-700 pt-12">
            <p className="text-2xl font-bold mb-6">Ikuti Perjalanan Saya:</p>
            <div className="flex flex-wrap justify-center gap-6">
              <a 
                href="https://instagram.com/syarifudin_arif25" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-4 rounded-full font-bold hover:from-pink-400 hover:to-purple-400 transition-all inline-flex items-center gap-3"
              >
                <Instagram className="w-6 h-6" />
                @arifsyarifudin
              </a>
              <a 
                href="https://www.facebook.com/share/1bgZgC7cp8/" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-4 rounded-full font-bold hover:from-blue-500 hover:to-blue-700 transition-all inline-flex items-center gap-3"
              >
                <Facebook className="w-6 h-6" />
                Facebook
              </a>
              <a 
                href="https://shopee.co.id/arifsyarifudin" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 rounded-full font-bold hover:from-orange-400 hover:to-red-400 transition-all inline-flex items-center gap-3"
              >
                <ShoppingBag className="w-6 h-6" />
                Shopee Live
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center">
        <p className="mb-2">© 2025 Syarifudin Arif - Cancer Survivor & eL Vision Group Affiliate</p>
        <p className="text-sm">Testimoni dan hasil individual dapat bervariasi. Konsultasikan dengan profesional kesehatan Anda.</p>
      </footer>
    </div>
  );
}