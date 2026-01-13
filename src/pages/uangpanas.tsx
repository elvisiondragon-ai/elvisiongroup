import React, { useState, useEffect } from 'react';
import { Play, Check, X, Star, Clock, Users, Shield, TrendingUp, Zap, ChevronDown, ArrowRight, Gift, User, Mail, Phone, CreditCard, ShieldCheck, Copy } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/toaster';

const VideoModal = ({ video, onClose }: { video: string, onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="relative w-full max-w-[400px] h-[80vh] bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800" onClick={e => e.stopPropagation()}>
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-red-600 transition-colors backdrop-blur-sm"
      >
        <X size={24} />
      </button>
      <video 
        controls 
        autoPlay 
        playsInline
        className="w-full h-full object-cover"
      >
        <source src={video} type="video/mp4" />
      </video>
    </div>
  </div>
);

export default function UangPanasLanding() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 15,
    seconds: 0
  });
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [memberCount, setMemberCount] = useState(2847);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const affiliateRef = searchParams.get('ref');
  const { toast } = useToast();
  const { user } = useAuth();

  // Payment State
  const productNameBackend = 'ebook_uangpanas';
  const displayProductName = 'Sistem Uang Panas: Ebook + Audio + Lead Magnet';
  const originalPrice = 500000;
  const productPrice = 100000;
  const totalQuantity = 1;
  const totalAmount = productPrice;

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('QRIS');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);

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

    const memberTimer = setInterval(() => {
      setMemberCount(prev => prev + 1);
    }, 45000);

    if (typeof window !== 'undefined') {
      // Initialize Pixel
      if (!(window as any).fbq) {
        // @ts-ignore
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
      }

      (window as any).fbq('init', '3319324491540889');
      (window as any).fbq('track', 'PageView');
      (window as any).fbq('track', 'ViewContent', {
        content_name: 'Sistem Uang Panas',
        content_ids: ['ebook_uangpanas'],
        content_type: 'product',
        value: 100000,
        currency: 'IDR'
      });
    }

    return () => {
      clearInterval(timer);
      clearInterval(memberTimer);
    };
  }, []);

  const testimonials = [
    {
      name: "Habib Umar",
      title: "Ustadz",
      video: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/habib.mp4",
      poster: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/habib.jpg",
      quote: "Awalnya ragu, tapi setelah dengar audionya, rezeki datang dari arah tak disangka."
    },
    {
      name: "VIO",
      title: "Anak Muda",
      video: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/vio.mp4",
      poster: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/vio.jpg",
      quote: "Modulnya gampang banget, tinggal copy paste. Sehari bisa dapat 300rb santai."
    },
    {
      name: "Dr Gumilar",
      title: "Hipnoterapis Certified",
      video: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/dr.mp4",
      poster: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/dr.jpg",
      quote: "Marketplace potongan gede, pindah ke sini malah lebih cuan tanpa stok barang."
    }
  ];

  const paymentMethods = [
    { code: 'QRIS', name: 'QRIS', description: 'Scan pakai GoPay, OVO, Dana, ShopeePay, BCA Mobile, dll' },
    { code: 'BCAVA', name: 'BCA Virtual Account', description: 'Transfer otomatis via BCA' },
    { code: 'BNIVA', name: 'BNI Virtual Account', description: 'Transfer otomatis via BNI' },
    { code: 'BRIVA', name: 'BRI Virtual Account', description: 'Transfer otomatis via BRI' },
    { code: 'MANDIRIVA', name: 'Mandiri Virtual Account', description: 'Transfer otomatis via Mandiri' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Berhasil Disalin",
      description: "Teks telah disalin ke clipboard",
    });
  };

  const scrollToCheckout = () => {
    const checkoutSection = document.getElementById('checkout-section');
    if (checkoutSection) {
      checkoutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sendCapiEvent = async (eventName: string, eventData: any) => {
    try {
      await supabase.functions.invoke('capi-universal', {
        body: {
          pixelId: '3319324491540889', // Using same pixel for now, or you can change it
          eventName,
          userData: {
            email: userEmail,
            phone: phoneNumber,
            client_user_agent: navigator.userAgent,
          },
          customData: eventData,
          eventId: paymentData?.tripay_reference ? `${eventName}-${paymentData.tripay_reference}` : undefined
        }
      });
    } catch (err) {
      console.error('Failed to send CAPI event:', err);
    }
  };

  const handleCreatePayment = async () => {
    if (!userName || !userEmail || !phoneNumber || !selectedPaymentMethod || !password || !confirmPassword) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon lengkapi nama, email, no. whatsapp, password, dan metode pembayaran.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Tidak Cocok",
        description: "Konfirmasi password harus sama dengan password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    let currentUserId = user?.id;

    // AUTO AUTH LOGIC
    if (!currentUserId) {
      try {
        // 1. Try Sign Up
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: userEmail,
          password: password,
          options: {
            data: {
              full_name: userName,
              phone: phoneNumber,
            },
          },
        });

        if (signUpData.user) {
          currentUserId = signUpData.user.id;
          console.log("User auto-registered:", currentUserId);
        } else if (signUpError && signUpError.message.includes("already registered")) {
          // 2. If already registered, Try Sign In
          console.log("User exists, trying to login...");
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: userEmail,
            password: password,
          });

          if (signInData.user) {
            currentUserId = signInData.user.id;
            console.log("User auto-logged in:", currentUserId);
          } else {
            // Login failed (wrong password?)
            toast({
              title: "Gagal Login Otomatis",
              description: "Email sudah terdaftar tapi password salah. Silakan gunakan password yang benar atau email lain.",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
        } else if (signUpError) {
           throw signUpError;
        }
      } catch (authErr: any) {
        console.error("Auto-auth failed:", authErr);
        toast({
          title: "Gagal Registrasi",
          description: authErr.message || "Gagal membuat akun otomatis.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    }

    try {
      const { data, error } = await supabase.functions.invoke('tripay-create-payment', {
        body: {
          subscriptionType: productNameBackend,
          paymentMethod: selectedPaymentMethod,
          userName: userName,
          userEmail: userEmail,
          phoneNumber: phoneNumber,
          amount: totalAmount,
          quantity: totalQuantity,
          productName: displayProductName,
          userId: currentUserId, // Use the verified user ID
          affiliateRef: affiliateRef,
        }
      });

      if (error || !data?.success) {
        toast({
          title: "Gagal Memproses",
          description: data?.error || error?.message || "Terjadi kesalahan sistem.",
          variant: "destructive",
        });
        return;
      }

      if (data?.success) {
        setPaymentData(data);
        setShowPaymentInstructions(true);
        toast({
          title: "Order Dibuat!",
          description: "Silakan selesaikan pembayaran Anda.",
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error: any) {
      console.error('Payment Error:', error);
      toast({
        title: "Error",
        description: "Gagal menghubungi server pembayaran.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showPaymentInstructions && paymentData) {
    return (
      <div className="min-h-screen bg-black pb-20 font-sans text-white">
        <div className="max-w-md mx-auto bg-gray-900 min-h-screen shadow-2xl border-x border-gray-800">
          <div className="p-4 bg-red-600 text-white flex items-center gap-2 sticky top-0 z-10">
            <Button variant="ghost" size="icon" onClick={() => setShowPaymentInstructions(false)} className="text-white hover:bg-red-700">
              <X className="w-6 h-6" />
            </Button>
            <h1 className="font-bold text-lg">Selesaikan Pembayaran</h1>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-center">
                <p className="text-gray-400">Total Tagihan</p>
                <p className="text-4xl font-bold text-green-500">{formatCurrency(paymentData.amount)}</p>
                <div className="mt-2 inline-block px-3 py-1 bg-red-900/30 text-red-400 rounded-full text-sm font-medium border border-red-500/30">
                    Menunggu Pembayaran
                </div>
            </div>

            <Card className="bg-gray-800 border-gray-700 border-2">
              <CardContent className="pt-6 space-y-4">
                {paymentData.qrUrl && (
                    <div className="flex flex-col items-center">
                        <img src={paymentData.qrUrl} alt="QRIS" className="w-64 h-64 object-contain bg-white p-2 rounded-lg" />
                        <p className="text-sm text-gray-400 mt-4 text-center">Scan QR di atas menggunakan aplikasi e-wallet atau mobile banking Anda.</p>
                    </div>
                )}
                
                {paymentData.payCode && (
                    <div className="space-y-2">
                        <Label className="text-gray-300">Kode Bayar / Virtual Account</Label>
                        <div className="flex items-center justify-between bg-black p-3 rounded-lg border border-gray-700">
                            <span className="font-mono text-xl font-bold tracking-wider text-yellow-400">{paymentData.payCode}</span>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.payCode)} className="text-gray-400 hover:text-white">
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

                <div className="bg-red-900/20 p-3 rounded text-sm text-red-300 border border-red-900/50">
                    <p><strong>PENTING:</strong> Lakukan pembayaran sebelum waktu habis. Sistem akan otomatis memverifikasi pembayaran Anda dalam 1-2 menit.</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center">
               <p className="text-sm text-gray-500 mb-4">Sudah bayar tapi status belum berubah?</p>
               <Button variant="outline" className="w-full gap-2 border-green-600 text-green-500 hover:bg-green-600 hover:text-white" onClick={() => window.open(`https://wa.me/62895325633487?text=Halo admin, saya sudah bayar untuk order ${paymentData.tripay_reference} tapi belum aktif.`, '_blank')}>
                   <FaWhatsapp /> Hubungi Bantuan Admin
               </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-red-500 selection:text-white">
      <Toaster />
      {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}

      {/* Floating Sticky CTA Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 md:hidden z-50">
        <button 
          onClick={scrollToCheckout}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg animate-pulse"
        >
          AMBIL PROMO RP 100.000 SEKARANG
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/30 via-gray-900 to-black"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/50 text-red-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-8">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            EKONOMI SEDANG TIDAK BAIK-BAIK SAJA
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            Ekonomi Lesu? Kena PHK? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              Biaya Usaha & Pajak Mencekik?
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Kami membangun komunitas yang <strong>EFEKTIF & EFISIEN</strong>. Terbukti membantu ribuan orang menghasilkan uang dari rumah.
          </p>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl mb-12 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              🔥 Apa Itu <span className="text-red-500">UANG PANAS?</span>
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              Artinya <strong>IMPULSIF</strong>. Kami menjual Ebook & Panduan cara menghasilkan 
              <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded mx-2 font-bold">Rp 500.000/HARI</span>
              dengan diam di rumah.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-black/40 px-6 py-3 rounded-lg border border-gray-600 flex items-center gap-2">
                <Check className="text-green-500" /> Tanpa Perlu Stok Barang
              </div>
              <div className="bg-black/40 px-6 py-3 rounded-lg border border-gray-600 flex items-center gap-2">
                <Check className="text-green-500" /> Tanpa Pusing Marketplace
              </div>
            </div>
          </div>

          <button 
            onClick={scrollToCheckout}
            className="group bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white text-xl md:text-2xl font-bold py-6 px-12 rounded-full shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)] transition-all duration-300"
          >
            SAYA MAU GABUNG SEKARANG
            <span className="block text-sm font-normal mt-1 opacity-90">Hanya Rp 100.000 (Promo Terbatas)</span>
          </button>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
              Kenapa Harus Gabung <span className="text-yellow-400">SEKARANG?</span>
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="text-red-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Ekonomi Makin Sulit</h3>
                  <p className="text-gray-400">Banyak orang kehilangan pekerjaan. UMKM tercekik potongan admin marketplace yang besar, belum lagi pajak.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Gift className="text-green-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Solusi Lead Magnet</h3>
                  <p className="text-gray-400">Kami berikan <strong>LEAD MAGNET</strong>: Tools canggih agar orang tertarik melihat dan membeli apa yang kamu jual.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="text-blue-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Metode Terukur</h3>
                  <p className="text-gray-400">Bukan sekedar teori. Di agama disebut Syukur/Yakin, di sini kami buat <strong>TERUKUR</strong> dan bisa dibuktikan langsung.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-black p-8 rounded-2xl border border-gray-700 relative">
            <div className="absolute -top-4 -right-4 bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg transform rotate-3 shadow-lg">
              GARANSI WORK!
            </div>
            <h3 className="text-2xl font-bold mb-6 text-center">SYARAT BERHASIL YANG MUDAH</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg">
                <div className="text-4xl">⏱️</div>
                <div>
                  <h4 className="font-bold text-lg">Hanya 2 Jam / Hari</h4>
                  <p className="text-sm text-gray-400">Sisihkan waktu Anda, hasil maksimal.</p>
                </div>
              </div>
              
              <div className="relative pl-8 border-l-2 border-gray-700 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[39px] bg-purple-600 rounded-full p-1">
                    <Check size={16} />
                  </div>
                  <h5 className="font-bold text-purple-400">1 JAM: Audio Hipnosis Rezeki</h5>
                  <p className="text-gray-400 text-sm">30 menit saat bangun tidur & 30 menit saat mau tidur.</p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[39px] bg-blue-600 rounded-full p-1">
                    <Check size={16} />
                  </div>
                  <h5 className="font-bold text-blue-400">1 JAM: Belajar Modul</h5>
                  <p className="text-gray-400 text-sm">Praktek mengiklankan produk dengan <strong>KOMISI 50%</strong>.</p>
                </div>
              </div>

              <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg text-center">
                <p className="font-bold text-green-400 mb-2">KOMISI 50% — YA, 50%!</p>
                <p className="text-sm text-gray-300">
                  Gak perlu pusing jualan apa (kami buatkan). <br/>
                  Gak perlu pusing jualan kemana (kami arahkan). <br/>
                  Cukup ikuti modulnya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Share Section */}
      <section className="py-20 px-4 bg-black text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            "Kenapa Rahasia Ini Dibagikan?"
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed mb-8">
            Karena rezeki setiap orang tergantung energinya. Dengan menggunakan energi positif Anda, kami pun mendapat keuntungan dengan membantu Anda menghasilkan uang lebih cepat dan mudah.
          </p>
          <div className="inline-block bg-gray-800 px-8 py-4 rounded-full border border-gray-600">
            <span className="text-yellow-400 font-bold">♻️ ENERGY SYNERGY:</span> Kami bantu Anda kaya, Kami ikut kaya.
          </div>
        </div>
      </section>

      {/* How it Works Flow */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            Alur Uang Masuk Ke Rekening Anda
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: "🛒", title: "1. Beli Ebook", desc: "Investasi receh Rp 100.000 sekali seumur hidup." },
              { icon: "🎧", title: "2. Baca & Dengar", desc: "Baca ebooknya, dengarkan audio hipnosisnya." },
              { icon: "📋", title: "3. Copy Paste", desc: "Sebarkan Lead Magnet ke teman atau sosmed (TIktok/IG)." },
              { icon: "💰", title: "4. Panen Komisi", desc: "Setiap penjualan = 50% komisi buat Anda. Enak kan?" }
            ].map((step, idx) => (
              <div key={idx} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-red-500 transition-colors relative group">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">{step.icon}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
                {idx < 3 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="text-gray-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Dengar Review Yang <span className="text-red-500">Bukan Main</span>
          </h2>
          <p className="text-gray-400 mb-12">Bukan rekayasa, ini kata mereka yang sudah praktek.</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-black p-6 rounded-xl border border-gray-800" onClick={() => setSelectedVideo(t.video)}>
                <div className="relative mb-4 group cursor-pointer overflow-hidden rounded-lg">
                  <img src={t.poster} alt={t.name} className="w-full h-48 object-cover transition-transform group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play fill="white" size={48} />
                  </div>
                </div>
                <p className="text-lg italic text-gray-300 mb-4">"{t.quote}"</p>
                <div className="font-bold text-yellow-400">{t.name}</div>
                <div className="text-sm text-gray-500">{t.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHECKOUT FORM SECTION */}
      <section id="checkout-section" className="py-20 px-4 md:px-8 bg-black">
        <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-red-900 shadow-2xl overflow-hidden rounded-2xl bg-gray-900 text-white">
                <div className="bg-red-600 text-white p-3 text-center font-bold animate-pulse">
                    🔥 PROMO BERAKHIR DALAM: {timeLeft.hours}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="bg-gradient-to-r from-red-800 to-black text-white p-8 text-center">
                    <h2 className="text-3xl font-bold mb-2">FORMULIR PEMESANAN</h2>
                    <p className="opacity-90 text-lg">Lengkapi data di bawah untuk akses instan</p>
                </div>
                
                <CardContent className="p-6 md:p-10 space-y-10">
                    <div className="bg-gray-800 border-2 border-gray-700 rounded-xl p-6 text-center shadow-sm">
                        <p className="text-gray-400 text-sm mb-1">Harga Normal</p>
                        <p className="text-xl text-gray-500 line-through decoration-red-500 decoration-2 mb-2">{formatCurrency(originalPrice)}</p>
                        <p className="text-white font-bold mb-1">Harga Promo Hari Ini:</p>
                        <p className="text-5xl font-extrabold text-green-500">{formatCurrency(productPrice)}</p>
                        <div className="mt-4 flex flex-col items-center gap-2 text-sm text-gray-300 font-medium">
                            <div className="flex items-center gap-1">
                                <Check className="w-4 h-4 text-green-500" /> Akses Selamanya • Sekali Bayar
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-gray-800" />

                    <div className="space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-white">
                            <User className="w-5 h-5 text-red-500" /> Data Diri
                        </h3>
                        <div className="grid gap-4">
                            <div>
                                <Label htmlFor="name" className="text-gray-300 font-semibold mb-1 block">Nama Lengkap</Label>
                                <Input 
                                    id="name" 
                                    placeholder="Nama Anda" 
                                    value={userName} 
                                    onChange={(e) => setUserName(e.target.value)} 
                                    className="bg-black text-white border-gray-700 focus:border-red-500 h-12"
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="email" className="text-gray-300 font-semibold mb-1 block">Email</Label>
                                    <Input 
                                        id="email" 
                                        type="email" 
                                        placeholder="email@anda.com" 
                                        value={userEmail} 
                                        onChange={(e) => setUserEmail(e.target.value)} 
                                        className="bg-black text-white border-gray-700 focus:border-red-500 h-12"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone" className="text-gray-300 font-semibold mb-1 block">WhatsApp</Label>
                                    <Input 
                                        id="phone" 
                                        type="tel" 
                                        placeholder="0812..." 
                                        value={phoneNumber} 
                                        onChange={(e) => setPhoneNumber(e.target.value)} 
                                        className="bg-black text-white border-gray-700 focus:border-red-500 h-12"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="password" className="text-gray-300 font-semibold mb-1 block">Password (Untuk Login Member Area)</Label>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    placeholder="Buat password rahasia..." 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className="bg-black text-white border-gray-700 focus:border-red-500 h-12"
                                />
                            </div>
                            <div>
                                <Label htmlFor="confirmPassword" className="text-gray-300 font-semibold mb-1 block">Konfirmasi Password</Label>
                                <Input 
                                    id="confirmPassword" 
                                    type="password" 
                                    placeholder="Ulangi password rahasia..." 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    className="bg-black text-white border-gray-700 focus:border-red-500 h-12"
                                />
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-gray-800" />

                    <div className="space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-white">
                            <CreditCard className="w-5 h-5 text-red-500" /> Metode Pembayaran
                        </h3>
                        <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="grid grid-cols-1 gap-4">
                            {paymentMethods.map((method) => (
                                <Label key={method.code} className={`flex items-start p-5 border-2 rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === method.code ? 'border-red-600 bg-red-900/10' : 'border-gray-800 bg-black hover:border-gray-700'}`}>
                                    <RadioGroupItem value={method.code} id={method.code} className="mt-1 mr-4 border-gray-600 text-red-600" />
                                    <div className="flex-1">
                                        <div className="font-bold text-white text-lg">{method.name}</div>
                                        <div className="text-sm text-gray-400">{method.description}</div>
                                    </div>
                                </Label>
                            ))}
                        </RadioGroup>
                    </div>
                </CardContent>

                <CardFooter className="p-8 bg-black/50 flex flex-col gap-4 border-t border-gray-800">
                    <Button 
                        size="lg" 
                        className="w-full text-xl py-8 bg-green-600 hover:bg-green-700 font-bold shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] text-white"
                        onClick={handleCreatePayment}
                        disabled={loading}
                    >
                        {loading ? 'Memproses...' : `BELI SEKARANG - ${formatCurrency(totalAmount)}`}
                    </Button>
                    <p className="text-center text-gray-500 text-xs mt-2">
                        Promo ini hanya berlangsung sebentar, harga akan naik!
                    </p>
                </CardFooter>
            </Card>
        </div>
      </section>

      <footer className="py-12 text-center text-gray-600 text-sm border-t border-gray-900">
        <p>&copy; {new Date().getFullYear()} eL Vision Group. All rights reserved.</p>
        <p className="mt-2">Disclaimer: Hasil setiap individu bisa berbeda tergantung dedikasi dan praktik.</p>
      </footer>
    </div>
  );
}