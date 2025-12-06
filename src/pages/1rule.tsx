import React, { useState, useEffect } from 'react';
import { Sparkles, Focus, Wind, Eye, Heart, Loader } from 'lucide-react';

export default function OnePercentRule() {
  const [activeSection, setActiveSection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const sections = [
    {
      title: "Apa itu 1% Rule?",
      icon: <Sparkles className="w-8 h-8" />,
      content: "Skill utama di eL Vision tentang vipassana dan kalibrasi. Fokus 1 titik yang membawa ketenangan, kesenangan, kesehatan, harta, dan banyak hal lainnya."
    },
    {
      title: "Konsep Inti",
      icon: <Focus className="w-8 h-8" />,
      content: "Analogikan diri kita memiliki 100 Pikiran. 1% fokus ke satu titik (audio/lilin/suara/nafas), sementara 99% lainnya harus dilepaskan."
    },
    {
      title: "Cara Melepaskan 99%",
      icon: <Wind className="w-8 h-8" />,
      content: "Abaikan, lepaskan, nasihati 99% pikiran lain. Berbicara kepada mereka: 'Ini sangat penting untuk masa depan kita, mari fokus kali ini untuk kebaikanmu juga.'"
    },
    {
      title: "Transformasi Energi",
      icon: <Eye className="w-8 h-8" />,
      content: "Setelah 20 menit, 99% energi yang berhasil dilepaskan menjadi sumber manifestasi. Kepasrahan yang dalam terwujud dari energi yang tunduk ini."
    },
    {
      title: "Manifestasi",
      icon: <Heart className="w-8 h-8" />,
      content: "Gunakan visi tanpa perlu dilihat lagi. Fokus tetap ke 1%, itu akan berubah menjadi rasa - FEEL - dan itulah manifestasi sejati."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <div className="relative">
              <h1 className="text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                1% RULE
              </h1>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 blur-2xl opacity-30 -z-10" />
            </div>
          </div>
          <p className="text-2xl text-gray-300 mb-4">eL Vision Core Practice</p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Vipassana • Kalibrasi • Manifestasi
          </p>
        </div>

        {/* Central Circle Visualization */}
        <div className="flex justify-center items-center mb-20">
          <div className="relative w-96 h-96">
            {/* Outer 99% Circle */}
            <div className={`absolute inset-0 rounded-full border-4 border-gray-700 transition-all duration-1000 ${isAnimating ? 'scale-100 opacity-30' : 'scale-110 opacity-10'}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-bold text-gray-600">99%</span>
              </div>
            </div>
            
            {/* Inner 1% Circle */}
            <div className="absolute inset-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-pulse">
              <div className="text-center">
                <div className="text-7xl font-bold mb-2">1%</div>
                <div className="text-sm uppercase tracking-wider">Fokus</div>
              </div>
            </div>

            {/* Orbiting Elements */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-purple-400 rounded-full opacity-60"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  animation: `orbit ${6 + i}s linear infinite`,
                  animationDelay: `${i * 0.75}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {sections.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSection(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === idx 
                  ? 'bg-purple-500 w-12' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Content Cards */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-start gap-6 mb-6">
              <div className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl">
                {sections[activeSection].icon}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {sections[activeSection].title}
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {sections[activeSection].content}
                </p>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-800">
              <button
                onClick={() => setActiveSection(prev => (prev - 1 + sections.length) % sections.length)}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
              >
                ← Sebelumnya
              </button>
              <span className="text-gray-500">
                {activeSection + 1} / {sections.length}
              </span>
              <button
                onClick={() => setActiveSection(prev => (prev + 1) % sections.length)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl transition-all"
              >
                Selanjutnya →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="mt-20 text-center max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm">
            <p className="text-xl italic text-gray-300 mb-4">
              "Kepasrahan terwujud dari 99% energi yang berhasil dilepaskan. 
              99% yang tunduk itulah yang memanifestasi keinginan kita."
            </p>
            <div className="flex items-center justify-center gap-2 text-purple-400">
              <Loader className="w-5 h-5 animate-spin" />
              <span className="text-sm uppercase tracking-wider">20 Menit untuk Transformasi</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, 20px); }
        }
        
        @keyframes orbit {
          from { transform: translate(-50%, -50%) rotate(0deg) translateX(180px) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg) translateX(180px) rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}