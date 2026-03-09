import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Crown, BarChart, Headphones, Percent } from 'lucide-react';

export const WhatIsPro: React.FC = () => {
  const navigate = useNavigate();

  const handleSubscribeClick = () => {
    navigate('/payment');
  };

  const proBenefits = [
    {
      icon: <BarChart className="w-5 h-5 text-purple-500" />,
      title: 'Akses Ke Analytics AI untuk Progress',
      description: 'Dapatkan wawasan mendalam tentang perkembangan Anda dengan analisis berbasis AI.'
    },
    {
      icon: <Headphones className="w-5 h-5 text-purple-500" />,
      title: 'Audio Khusus Pro',
      description: 'Nikmati koleksi audio eksklusif yang dirancang untuk meningkatkan pengalaman Anda.'
    },
    {
      icon: <Percent className="w-5 h-5 text-purple-500" />,
      title: 'Diskon 30% Sepanjang Tahun Produk Ecosystem',
      description: 'Hemat lebih banyak dengan diskon 30% untuk semua produk dan layanan di ekosistem kami.'
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-purple-500" />,
      title: 'Dan Banyak Lainnya',
      description: 'Fitur dan keuntungan eksklusif lainnya menanti Anda sebagai anggota Pro.'
    }
  ];

  return (
    <div className="pt-10">
      <Card className="max-w-md mx-auto shadow-lg border-purple-500/20 bg-gradient-to-br from-purple-900/10 to-indigo-900/10">
      <CardHeader className="text-center">
        <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Apa Itu Langganan Pro?
        </CardTitle>
        <CardDescription className="text-purple-200 mt-2">
          Dapatkan akses penuh ke fitur-fitur eksklusif yang dirancang untuk mempercepat progres Anda.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ul className="space-y-4">
          {proBenefits.map((benefit, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {benefit.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-purple-100">{benefit.title}</h3>
                <p className="text-purple-300 text-sm">{benefit.description}</p>
              </div>
            </li>
          ))}
        </ul>

        <Button
          onClick={handleSubscribeClick}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 text-lg rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
        >
          <Crown className="w-5 h-5 mr-2" />
          Langganan Pro Sekarang!
        </Button>
      </CardContent>
    </Card>
    </div>
  );
};
