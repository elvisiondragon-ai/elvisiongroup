import React, { useState } from 'react';
import { Quote } from 'lucide-react';

const TestimonyPage = () => {
  const testimonies = [
    {
      name: "Arif - Mind Method",
      title: "Penyintas Kanker Otak Stage 4",
      description: "Stop Battling Your Health: Try the Mind Method for Lasting Recovery",
      localVideo: "/assets/arif/Arif_interview_indo_comp.mp4",
      poster: "/assets/arif/arif_interview_indo.jpg"
    },
    {
      name: "Arif - Cellular Recovery",
      title: "Mindset Transformation",
      description: "The Secret to Cellular Recovery: What Nobody Tells You About Healing",
      localVideo: "/assets/arif/arifindo_comp.mp4",
      poster: "/assets/arif/arifindo.jpeg"
    },
    {
      name: "Habib Umar Assegaf",
      title: "Ustadz",
      description: "Spiritual Elevation: A Testimony of Faith and Mental Clarity",
      video: "https://www.youtube.com/embed/jD6XlkCL4sI"
    },
    {
      name: "Pak AGUS SH., MH.",
      title: "Kepala Intelijen",
      description: "Professional Excellence & Inner Balance: A High-Achiever’s Perspective",
      video: "https://www.youtube.com/embed/kVgfxHX_GeY"
    },
    {
      name: "Dr. Gumilar",
      title: "Hypnotherapist",
      description: "A Medical Endorsement: Why Mindset is the Ultimate Key to Recovery",
      video: "https://www.youtube.com/embed/U6NsL9RL9rY"
    },
    {
      name: "eL Vision - Magnet",
      title: "Problem Solver",
      description: "The Root of the Solution: How I Stopped Managing Problems and Started Solving Them",
      video: "https://www.youtube.com/embed/cPwGC0NW8s4"
    },
    {
      name: "Lena",
      title: "Student",
      description: "Manifesting Abundance: Moving from Scarcity to Being Chased by Prosperity",
      video: "https://www.youtube.com/embed/-9u7v6vT5ds"
    },
    {
      name: "Gen Z",
      title: "Modern Lifestyle",
      description: "The Ultimate Mental Edge: Why This is the Modern Life Hack We’ve Been Searching For",
      video: "https://www.youtube.com/embed/wQv7mHlE-5o"
    }
  ];

  const communityImages = [
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/photo_2025-07-12%2009.48.35_28_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi%20santri_12_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_15taun_6_11zon.jpg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_17juli_3_11zon.jpg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_28juli_5_11zon.jpg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_2jt_16_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_3minggu_17_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_audio1_9_11zon.jpg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_audio2_8_11zon.jpg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_damai_18_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_depres_27_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_eldi3_13_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_jahit_29_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testI_jahitan_19_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_JOE_26_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_karimah_4_11zon.jpg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_kelas1_14_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_marah_24_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_muklas_25_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_pelakor_22_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_pesantren_7_11zon.jpg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_pesantreren01_15_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_proyek_2_11zon.jpg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi_santet_11_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi01_20_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi03_21_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi05_23_11zon.jpeg",
    "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/testi_komunitas/testi09_10_11zon.jpg"
  ];

  const quotes = [
    "Saya baru sadar, selama ini saya selalu dapat apa yang saya mau — tapi selalu dibayar mahal. Setelah eL Vision, target tetap tercapai, tapi hidup saya tidak lagi berantakan.",
    "Bukan motivasi. Bukan sugesti kosong. Yang berubah itu cara sistem dalam diri saya bekerja. Saya tidak lagi 'memaksa', tapi tetap bergerak.",
    "Biasanya setiap naik level bisnis, pasti ada masalah keluarga atau kesehatan. Kali ini tidak. Itu yang paling terasa berbeda.",
    "Saya kira stres adalah harga sukses. Ternyata itu hanya efek samping dari sistem bawah sadar yang salah set."
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white py-16">
      <div className="container mx-auto px-4">
        {/* Testimonies Section */}
        <div className="mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Testimoni Nyata
          </h1>
          
          {/* Quote Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-5xl mx-auto">
            {quotes.map((quote, index) => (
              <div key={index} className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
                <Quote className="w-8 h-8 text-purple-400 mb-3" />
                <p className="text-gray-200 italic">{quote}</p>
              </div>
            ))}
          </div>

          {/* Video Testimonies */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {testimonies.map((testimony, index) => (
              <div key={index} className="group">
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all h-full flex flex-col">
                  <div className="relative aspect-[9/16] bg-black">
                    {testimony.localVideo ? (
                      <video
                        src={testimony.localVideo}
                        poster={testimony.poster}
                        controls
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <iframe
                        src={testimony.video}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    )}
                  </div>
                  <div className="p-4 text-center flex-grow flex flex-col justify-center">
                    <p className="font-semibold text-purple-400">{testimony.name}</p>
                    {testimony.title && <p className="text-sm text-gray-300">{testimony.title}</p>}
                    {testimony.description && <p className="text-xs text-gray-400 mt-2">{testimony.description}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Community Images */}
          <div className="mt-20">
            <h2 className="text-4xl font-bold mb-12 text-center">Testimoni Komunitas</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {communityImages.map((imageUrl, index) => (
                <div key={index} className="group">
                  <div className="bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all">
                    <img
                      src={imageUrl}
                      alt={`Testimoni Komunitas ${index + 1}`}
                      className="w-full h-auto object-cover rounded-xl"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonyPage;
