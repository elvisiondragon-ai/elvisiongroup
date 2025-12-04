import React from 'react';
import { AlertCircle, CheckCircle, TrendingUp, Brain, ShoppingCart, Users, Zap } from 'lucide-react';

export default function BrandFlow() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Brand Awareness Flow
          </h1>
          <p className="text-xl text-gray-600">
            Memahami perbedaan strategi Hard Sales vs Brand Awareness
          </p>
        </div>

        {/* Wrong Approach */}
        <div className="bg-red-50 border-4 border-red-300 rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-500 p-3 rounded-full">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-red-700">❌ Pendekatan SALAH</h2>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="text-center">
                <div className="bg-red-100 p-6 rounded-xl mb-4">
                  <ShoppingCart className="w-16 h-16 text-red-600 mx-auto" />
                </div>
                <p className="text-lg font-semibold text-gray-800">Iklan Marketplace</p>
                <p className="text-sm text-gray-600">(Hard Sales)</p>
              </div>

              <div className="text-4xl text-red-500 transform md:transform-none rotate-90 md:rotate-0">→</div>

              <div className="text-center">
                <div className="bg-red-100 p-6 rounded-xl mb-4">
                  <Users className="w-16 h-16 text-red-600 mx-auto" />
                </div>
                <p className="text-lg font-semibold text-gray-800">100 Orang</p>
              </div>

              <div className="text-4xl text-red-500 transform md:transform-none rotate-90 md:rotate-0">→</div>

              <div className="text-center">
                <div className="bg-red-100 p-6 rounded-xl mb-4">
                  <p className="text-4xl font-bold text-red-600">1</p>
                </div>
                <p className="text-lg font-semibold text-gray-800">Pembeli</p>
                <p className="text-sm text-red-600 font-bold">Konversi 1%</p>
              </div>
            </div>
            
            <div className="mt-6 bg-red-100 p-4 rounded-lg">
              <p className="text-center text-red-800 font-semibold">
                ⚠️ Langsung jualan tanpa membangun kesadaran brand terlebih dahulu
              </p>
            </div>
          </div>
        </div>

        {/* Correct Approach */}
        <div className="bg-green-50 border-4 border-green-300 rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-500 p-3 rounded-full">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-green-700">✅ Pendekatan BENAR</h2>
          </div>
          
          {/* Step 1: Brainwash Phase */}
          <div className="bg-white rounded-xl p-6 shadow-md mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-8 h-8 text-purple-600" />
              <h3 className="text-2xl font-bold text-purple-700">Step 1: Fase Brainwash</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="font-semibold text-purple-800 mb-2">📱 Meta Ads</p>
                <p className="text-sm text-gray-700">Konten edukatif & awareness</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="font-semibold text-purple-800 mb-2">🎥 Social Media</p>
                <p className="text-sm text-gray-700">Video viral & engaging</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="font-semibold text-purple-800 mb-2">🛍️ Marketplace Organic</p>
                <p className="text-sm text-gray-700">Konten non-jualan</p>
              </div>
            </div>

            <div className="bg-purple-100 p-4 rounded-lg">
              <p className="text-purple-900 font-semibold mb-2">💡 Tujuan: Membangun Kesadaran & Trust</p>
              <ul className="text-sm text-purple-800 space-y-1 ml-4">
                <li>• Edukasi audience</li>
                <li>• Buka mata konsumen</li>
                <li>• Build emotional connection</li>
                <li>• TIDAK langsung jualan</li>
              </ul>
            </div>
          </div>

          {/* Step 2: Conversion Phase */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <h3 className="text-2xl font-bold text-green-700">Step 2: Fase Konversi</h3>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="text-center">
                <div className="bg-green-100 p-6 rounded-xl mb-4">
                  <ShoppingCart className="w-16 h-16 text-green-600 mx-auto" />
                </div>
                <p className="text-lg font-semibold text-gray-800">Iklan Marketplace</p>
                <p className="text-sm text-gray-600">(ke audience ter-brainwash)</p>
              </div>
              
              <div className="text-4xl text-green-500 transform md:transform-none rotate-90 md:rotate-0">→</div>
              
              <div className="text-center">
                <div className="bg-green-100 p-6 rounded-xl mb-4">
                  <Users className="w-16 h-16 text-green-600 mx-auto" />
                </div>
                <p className="text-lg font-semibold text-gray-800">100 Orang</p>
                <p className="text-sm text-green-600 font-bold">(Sudah Aware)</p>
              </div>
              
              <div className="text-4xl text-green-500 transform md:transform-none rotate-90 md:rotate-0">→</div>
              
              <div className="text-center">
                <div className="bg-green-100 p-6 rounded-xl mb-4">
                  <p className="text-4xl font-bold text-green-600">10</p>
                </div>
                <p className="text-lg font-semibold text-gray-800">Pembeli</p>
                <p className="text-sm text-green-600 font-bold">Konversi 10%</p>
              </div>
            </div>

            <div className="mt-6 bg-green-100 p-4 rounded-lg">
              <p className="text-center text-green-800 font-semibold">
                ✨ Customer sudah kenal brand → Trust tinggi → Conversion rate 10x lebih tinggi!
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-red-200">
            <h3 className="text-xl font-bold text-red-700 mb-4">Hard Sales (Tanpa Brainwash)</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Conversion Rate:</span>
                <span className="text-2xl font-bold text-red-600">1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Trust Level:</span>
                <span className="text-xl font-bold text-red-600">Rendah</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">ROI:</span>
                <span className="text-xl font-bold text-red-600">Buruk</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
            <h3 className="text-xl font-bold text-green-700 mb-4">Brainwash + Sales</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Conversion Rate:</span>
                <span className="text-2xl font-bold text-green-600">10%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Trust Level:</span>
                <span className="text-xl font-bold text-green-600">Tinggi</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">ROI:</span>
                <span className="text-xl font-bold text-green-600">Excellent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Brainwash Content Examples */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-8 h-8 text-indigo-600" />
            <h2 className="text-3xl font-bold text-indigo-900">Contoh Konten Brainwash</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="bg-indigo-100 p-4 rounded-lg mb-4">
                <h3 className="font-bold text-indigo-900 text-lg mb-2">🎓 Konten Edukatif</h3>
                <p className="text-sm text-gray-700">
                  "Cara yang SALAH vs yang BENAR menggunakan produk ini..."
                </p>
              </div>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Membuka perspektif baru</li>
                <li>✓ Positioning sebagai expert</li>
                <li>✓ Tidak langsung jualan</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="bg-purple-100 p-4 rounded-lg mb-4">
                <h3 className="font-bold text-purple-900 text-lg mb-2">😱 Konten Provocative</h3>
                <p className="text-sm text-gray-700">
                  "AWAS! Selama ini kamu SALAH pilih produk..."
                </p>
              </div>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Trigger emotional response</li>
                <li>✓ Membuat penasaran</li>
                <li>✓ Viral potential tinggi</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="bg-pink-100 p-4 rounded-lg mb-4">
                <h3 className="font-bold text-pink-900 text-lg mb-2">💡 Konten "Tahukah Kamu"</h3>
                <p className="text-sm text-gray-700">
                  "Tahukah kamu? Ini fakta mengejutkan tentang..."
                </p>
              </div>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Informasi bernilai</li>
                <li>✓ Membangun kredibilitas</li>
                <li>✓ Shareable content</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="bg-orange-100 p-4 rounded-lg mb-4">
                <h3 className="font-bold text-orange-900 text-lg mb-2">🔥 Konten Kontroversial</h3>
                <p className="text-sm text-gray-700">
                  "Kenapa kebanyakan orang gagal? Ini alasannya..."
                </p>
              </div>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ High engagement</li>
                <li>✓ Memicu diskusi</li>
                <li>✓ Brand recall kuat</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-indigo-600 text-white p-6 rounded-xl">
            <p className="text-center text-lg font-semibold">
              🎯 Kunci Sukses: Konten brainwash TIDAK jualan, tapi membangun TRUST & AWARENESS
            </p>
          </div>
        </div>

        {/* Key Differences */}
        <div className="mt-8 bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            📊 Perbedaan Utama
          </h2>
          
          <div className="space-y-4 md:hidden">
            {[
              { aspect: "Tujuan", hardSales: "Jual langsung", brainwash: "Edukasi & awareness" },
              { aspect: "Pendekatan", hardSales: "Promosi produk", brainwash: "Story telling & value" },
              { aspect: "Hasil", hardSales: "Konversi 1-2%", brainwash: "Konversi 10%+" },
              { aspect: "Jangka Waktu", hardSales: "Short-term", brainwash: "Long-term investment" },
              { aspect: "Customer Trust", hardSales: "Rendah", brainwash: "Tinggi" },
            ].map(item => (
              <div key={item.aspect} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <p className="font-bold text-lg text-gray-900 mb-3">{item.aspect}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-red-700">Hard Sales:</span>
                  <span className="text-gray-700 text-right">{item.hardSales}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-green-700">Brainwash System:</span>
                  <span className="text-gray-700 text-right">{item.brainwash}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left font-bold text-gray-900">Aspek</th>
                  <th className="p-4 text-left font-bold text-red-700">Hard Sales</th>
                  <th className="p-4 text-left font-bold text-green-700">Brainwash System</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-4 font-semibold text-gray-800">Tujuan</td>
                  <td className="p-4 text-gray-700">Jual langsung</td>
                  <td className="p-4 text-gray-700">Edukasi & awareness</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-800">Pendekatan</td>
                  <td className="p-4 text-gray-700">Promosi produk</td>
                  <td className="p-4 text-gray-700">Story telling & value</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-800">Hasil</td>
                  <td className="p-4 text-gray-700">Konversi 1-2%</td>
                  <td className="p-4 text-gray-700">Konversi 10%+</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-800">Jangka Waktu</td>
                  <td className="p-4 text-gray-700">Short-term</td>
                  <td className="p-4 text-gray-700">Long-term investment</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-800">Customer Trust</td>
                  <td className="p-4 text-gray-700">Rendah</td>
                  <td className="p-4 text-gray-700">Tinggi</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}