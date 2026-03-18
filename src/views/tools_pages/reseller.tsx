"use client";
import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Package, Megaphone, DollarSign, Clock, CheckCircle, AlertCircle, Send, ExternalLink } from 'lucide-react';

export default function ResellerLanding() {
  const [stock, setStock] = useState(200);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    whatsapp: '',
    produk: '',
    jumlah: 50
  });
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setStock(prev => Math.max(0, prev - Math.floor(Math.random() * 3)));
    }, 45000);
    return () => clearInterval(timer);
  }, []);

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.nama.trim()) newErrors.nama = 'Nama wajib diisi';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email tidak valid';
    if (!formData.whatsapp.trim() || !/^[0-9]{10,13}$/.test(formData.whatsapp.replace(/\D/g, ''))) newErrors.whatsapp = 'Nomor WhatsApp tidak valid';
    if (!formData.produk) newErrors.produk = 'Pilih produk';
    if (formData.jumlah < 50) newErrors.jumlah = 'Minimum pembelian 50 pcs';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const message = `*PENDAFTARAN RESELLER AGENT*%0A%0A*Nama:* ${formData.nama}%0A*Email:* ${formData.email}%0A*WhatsApp:* ${formData.whatsapp}%0A*Produk:* ${formData.produk}%0A*Jumlah:* ${formData.jumlah} pcs%0A%0ASaya ingin bergabung sebagai reseller agent!`;
    window.open(`https://wa.me/62895325633487?text=${message}`, '_blank');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold">STOK TERBATAS - Sisa {stock} Slot Hari Ini!</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Raih Penghasilan Hingga<br />
              <span className="text-yellow-200">Rp 5 Juta - 15 Juta/Bulan</span>
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-yellow-100">
              Dari Rumah Sebagai Reseller Agent Produk Premium DRELF & FitFactor
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-yellow-200" />
                <span>Margin Rp 100.000/Produk</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-yellow-200" />
                <span>Repeat Order Tinggi</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-yellow-200" />
                <span>Full Support Marketing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pain & Agitate Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 border-4 border-yellow-400">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-800">
            Apakah Anda Mengalami Masalah Ini?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              'Penghasilan tidak stabil dan terbatas',
              'Bingung memulai bisnis online tanpa modal besar',
              'Produk biasa dengan margin kecil dan persaingan ketat',
              'Tidak punya waktu untuk produksi sendiri',
              'Kesulitan closing karena produk tidak unik',
              'Takut rugi karena stok menumpuk'
            ].map((pain, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-400 rounded">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <p className="text-gray-700 font-medium">{pain}</p>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-6 rounded-xl border-2 border-yellow-500">
            <p className="text-center text-lg sm:text-xl font-semibold text-gray-800">
              <span className="text-red-600">STOP!</span> Jangan buang waktu lagi dengan produk biasa. 
              Saatnya jualan produk <span className="text-yellow-700">PREMIUM dengan MARGIN BESAR</span> yang pelanggan <span className="text-yellow-700">PASTI BELI LAGI!</span>
            </p>
          </div>
        </div>
      </div>

      {/* Solution & Offer */}
      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-gray-800">
            Solusi: <span className="text-yellow-600">Program Reseller Agent Premium</span>
          </h2>
          <p className="text-center text-xl mb-12 text-gray-700">
            Bergabunglah dengan eksklusif reseller agent kami dan raih kesuksesan!
          </p>

          {/* Products Showcase */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* DRELF */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-yellow-400 transform hover:scale-105 transition-transform flex flex-col">
              <div className="relative h-64 bg-gradient-to-br from-amber-50 to-rose-50 flex items-center justify-center">
                <div className="text-gray-400 font-bold">DRELF Image</div>
                <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-full font-bold">
                  <Sparkles className="w-5 h-5 inline mr-1" />
                  HOT!
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">DRELF Ultimate Collagen</h3>
                <p className="text-gray-600 mb-4">5000mg Marine Collagen + Audio Meditasi Eksklusif</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-black text-black">Kurangi kerutan 40% dalam 2-4 minggu</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-black text-black">Turunkan stress 60% dengan audio meditasi</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-black text-black">98% bioavailability - diserap sempurna</span>
                  </div>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg mb-6">
                  <p className="text-sm font-semibold text-yellow-800">💰 Margin: Rp 100.000/botol</p>
                </div>
                <div className="mt-auto">
                  <button 
                    onClick={() => window.location.href = '/drelflp'}
                    className="w-full py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                  >
                    Drelf <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* FitFactor */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-yellow-400 transform hover:scale-105 transition-transform flex flex-col">
              <div className="relative h-64 bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
                <div className="text-gray-400 font-bold">FitFactor Image</div>
                <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-full font-bold">
                  <TrendingUp className="w-5 h-5 inline mr-1" />
                  HOT!
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">FitFactor Herbal</h3>
                <p className="text-gray-600 mb-4">Formula Herbal Premium + Audio Healing Therapy</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-black text-black">Atasi nyeri sendi & stroke dengan sirkulasi darah</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-black text-black">Tingkatkan vasodilatasi hingga 45%</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-black text-black">Sarang burung walet untuk regenerasi</span>
                  </div>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg mb-6">
                  <p className="text-sm font-semibold text-yellow-800">💰 Margin: Rp 100.000/botol</p>
                </div>
                <div className="mt-auto">
                  <button 
                    onClick={() => window.location.href = '/fitfactorlp'}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                  >
                    Fit Factor <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Package */}
          <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl shadow-2xl p-8 sm:p-12 text-white mb-12">
            <h3 className="text-3xl font-bold text-center mb-8">Paket Reseller Agent Premium</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Package, title: 'Minimum Order', desc: 'Hanya 50 pcs untuk memulai' },
                { icon: DollarSign, title: 'Margin Besar', desc: 'Rp 100.000 per produk terjual' },
                { icon: TrendingUp, title: 'Repeat Order Tinggi', desc: 'Pelanggan pasti beli lagi karena produk unik' },
                { icon: Megaphone, title: 'Video & Gambar Ready', desc: 'Semua aset marketing sudah disediakan' },
                { icon: Sparkles, title: 'Script Jualan', desc: 'Skrip proven untuk marketplace & Meta ads' },
                { icon: CheckCircle, title: 'Full Support', desc: 'Tim support siap bantu closing' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <item.icon className="w-12 h-12 mb-4" />
                  <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                  <p className="text-yellow-100">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why Us */}
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-800">
          Kenapa Bergabung dengan <span className="text-yellow-600">Kami?</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-yellow-500 text-center">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📹</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Video & Gambar Berkualitas</h3>
            <p className="text-gray-600">Kami sediakan semua aset marketing premium yang sudah terbukti convert. Kamu tinggal pakai!</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-yellow-500 text-center">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Cukup Iklankan</h3>
            <p className="text-gray-600">Fokus jualan di marketplace atau Meta ads. Produksi, packaging, kirim? Semua kami handle!</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-yellow-500 text-center">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💎</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Produk Unik = Margin Besar</h3>
            <p className="text-gray-600">Produk dengan audio therapy yang tidak ada di pasaran. Repeat order tinggi = income stabil!</p>
          </div>
        </div>

        {/* Testimonial Video */}
        <div className="bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Bukti Nyata Pelanggan</h3>
          <div className="max-w-2xl mx-auto">
            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl relative">
              <iframe
                src="https://www.youtube.com/embed/dPlA9jHzI0M"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <p className="text-center mt-4 text-gray-700 italic">Testimoni Syarifudin Arif - Pemulihan Kesehatan</p>
          </div>
        </div>
      </div>

      {/* Steps After Joining */}
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 bg-white rounded-3xl shadow-xl mb-16 border-2 border-yellow-100">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Apa yang dilakukan jika <span className="text-yellow-600">sudah bergabung?</span>
        </h2>
        <div className="space-y-10">
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center font-black text-xl flex-shrink-0 shadow-lg shadow-yellow-200">1</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-gray-800">Siapkan Toko & Sosmed</h3>
              <p className="text-gray-700 leading-relaxed">
                Ambil Foto/Video dari <span className="font-bold">Reseller Kit</span> untuk dipasang di marketplace dengan harga public (<span className="text-green-600 font-black">anda untung 100ribu dari sini</span>), juga skrip dan deskripsi nya, bisa post juga di sosmed.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center font-black text-xl flex-shrink-0 shadow-lg shadow-yellow-200">2</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-gray-800">Pengiriman Fleksibel</h3>
              <p className="text-gray-700 leading-relaxed">
                Barang bisa kami kirim ke alamat Reseller saat sudah lunas atau dikirim melalui <span className="font-bold">Gudang Kami</span> (Dropship/Fulfillment), <span className="text-blue-600 font-bold">BPOM Aman, Legal 100%</span>.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center font-black text-xl flex-shrink-0 shadow-lg shadow-yellow-200">3</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-gray-800">Penyelarasan Internal</h3>
              <p className="text-gray-700 leading-relaxed">
                Ikuti <span className="font-bold text-amber-600">Panduan eL Vision</span> agar rezeki makin lancar, karena external tidak cukup. Kami percaya penyelarasan internal adalah pondasi kesuksesan bisnis Anda.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center border-t-2 border-dashed border-yellow-200 pt-8">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-2 font-bold">Moto Kami</p>
          <h3 className="text-3xl md:text-4xl font-black text-gray-900 italic">"Bahagia adalah Kunci"</h3>
        </div>
      </div>

      {/* Registration Form */}
      <div className="bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">
                Daftar Sekarang Juga!
              </h2>
              <div className="inline-flex items-center gap-2 bg-red-100 border-2 border-red-500 px-6 py-3 rounded-full">
                <Clock className="w-5 h-5 text-red-600" />
                <span className="font-bold text-red-600">STOK TERSISA: {stock} SLOT!</span>
              </div>
              <p className="mt-4 text-gray-600">Limited! Kami menjaga jumlah reseller agar tetap sehat. Ambil sebelum slot habis!</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap *</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none"
                  placeholder="Masukkan nama lengkap"
                />
                {errors.nama && <p className="text-red-500 text-sm mt-1">{errors.nama}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none"
                  placeholder="nama@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">No. WhatsApp *</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none"
                  placeholder="08123456789"
                />
                {errors.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Produk *</label>
                <select
                  name="produk"
                  value={formData.produk}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none"
                >
                  <option value="">-- Pilih Produk --</option>
                  <option value="DRELF Ultimate Collagen">DRELF Ultimate Collagen</option>
                  <option value="FitFactor Herbal">FitFactor Herbal</option>
                  <option value="DRELF + FitFactor (Paket Combo)">DRELF + FitFactor (Paket Combo)</option>
                </select>
                {errors.produk && <p className="text-red-500 text-sm mt-1">{errors.produk}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Jumlah Pembelian (Min. 50 pcs) *</label>
                <input
                  type="number"
                  name="jumlah"
                  value={formData.jumlah}
                  onChange={handleChange}
                  min="50"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none"
                  placeholder="50"
                />
                {errors.jumlah && <p className="text-red-500 text-sm mt-1">{errors.jumlah}</p>}
                <p className="text-sm text-gray-500 mt-1">Potensi profit: Rp {(formData.jumlah * 100000).toLocaleString('id-ID')}</p>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                DAFTAR VIA WHATSAPP SEKARANG!
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Dengan mendaftar, Anda setuju dengan syarat dan ketentuan program reseller kami</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">
            Jangan Tunda Lagi! Slot Terbatas!
          </h3>
          <p className="text-xl text-gray-300 mb-6">
            Bergabunglah dengan ratusan reseller sukses yang sudah meraih penghasilan jutaan rupiah per bulan
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-yellow-400" />
              <span>No Risk - High Reward</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-yellow-400" />
              <span>Produk Proven & Unik</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-yellow-400" />
              <span>Full Marketing Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}