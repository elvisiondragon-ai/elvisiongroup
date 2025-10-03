import React from 'react';
import { Card } from '@/components/ui/card';
import { Gift, Video, Calendar, HeadphonesIcon, BookOpen, MessageCircle, TrendingUp } from 'lucide-react';

export const ProGratisAnnouncement = () => {
  return (
    <Card className="max-w-md mx-auto p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 shadow-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <Gift className="w-8 h-8 text-amber-600 mr-2" />
          <h1 className="text-2xl font-bold text-amber-800">
            Halo Anggota eL Vision
          </h1>
        </div>
        
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2 rounded-full text-lg font-semibold shadow-md">
          🎉 Kamu kebagian Pro Gratis 1 Bulan! 🎉
        </div>
      </div>

      {/* Syarat */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Video className="w-5 h-5 text-blue-600 mr-2" />
          Syaratnya Cukup:
        </h2>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-gray-700">
            Buat Video Testimony yang sudah didapatkan apa saja hal positif
          </p>
        </div>
      </div>

      {/* Perpanjangan */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Calendar className="w-5 h-5 text-green-600 mr-2" />
          Untuk Memperpanjang Bulan Depan:
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
            <HeadphonesIcon className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-gray-700">Setiap hari aktif Dengar Verses</span>
          </div>
          
          <div className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
            <BookOpen className="w-5 h-5 text-purple-600 mr-3" />
            <span className="text-gray-700">Setiap hari aktif isi Jurnal</span>
          </div>
          
          <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <MessageCircle className="w-5 h-5 text-blue-600 mr-3" />
            <span className="text-gray-700">Setiap hari Chat</span>
          </div>
        </div>
      </div>

      {/* Hasil */}
      <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
        <div className="flex items-center justify-center mb-2">
          <TrendingUp className="w-6 h-6 text-emerald-600 mr-2" />
          <span className="text-lg font-semibold text-emerald-800">
            Peringkat akan naik (Streak_days)
          </span>
        </div>
        <p className="text-sm text-emerald-700">
          Setiap bulan Streak tercapai!
        </p>
      </div>
    </Card>
  );
};