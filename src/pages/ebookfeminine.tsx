import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Copy, CreditCard, User, Mail, Phone, CheckCircle, Star, ShieldCheck, PlayCircle, BookOpen, Headphones, Heart, Sparkles, Award } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Toaster } from '@/components/ui/toaster';

// Countdown Timer Component
const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 15, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return { hours: 0, minutes: 15, seconds: 0 };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white p-3 text-center font-bold text-sm md:text-base animate-pulse">
            ✨ Penawaran Berakhir Dalam: {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </div>
    );
};

const WhatsAppButton = () => (
  <a
    href="https://wa.me/62895325633487"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-24 right-5 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110"
    aria-label="Contact via WhatsApp"
  >
    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  </a>
);

export default function EbookFeminineLanding() {
  const { toast } = useToast();
  const productNameBackend = 'ebook_feminine';
  const displayProductName = 'Feminine Magnetism: Audio Hipnoterapi + Ebook';
  const originalPrice = 300000;
  const productPrice = 100000;
  const totalQuantity = 1;
  const totalAmount = productPrice;

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('QRIS');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);

  // Helper to send CAPI events
  const sendCapiEvent = async (eventName: string, eventData: any) => {
    try {
      await supabase.functions.invoke('capi-universal', {
        body: {
          pixelId: '3319324491540889', // EbookIndo Pixel
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

  // Pixel Tracking
  useEffect(() => {
    if (typeof window !== 'undefined') {
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

      (window as any).fbq('init', '3319324491540889'); // EbookIndo Pixel
      (window as any).fbq('track', 'PageView');

      (window as any).fbq('track', 'ViewContent', {
        content_name: displayProductName,
        content_ids: [productNameBackend],
        content_type: 'product',
        value: productPrice,
        currency: 'IDR'
      });
    }
  }, []);

  const paymentMethods = [
    { code: 'QRIS', name: 'QRIS', description: 'Scan pakai GoPay, OVO, Dana, ShopeePay, BCA Mobile, dll' },
    { code: 'BCAVA', name: 'BCA Virtual Account', description: 'Transfer otomatis via BCA' },
    { code: 'BNIVA', name: 'BNI Virtual Account', description: 'Transfer otomatis via BNI' },
    { code: 'BRIVA', name: 'BRI Virtual Account', description: 'Transfer otomatis via BRI' },
    { code: 'MANDIRIVA', name: 'Mandiri Virtual Account', description: 'Transfer otomatis via Mandiri' },
    { code: 'PERMATAVA', name: 'Permata Virtual Account', description: 'Transfer otomatis via Permata' },
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

  const handleCreatePayment = async () => {
    if (!userName || !userEmail || !phoneNumber || !selectedPaymentMethod) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon lengkapi nama, email, no. whatsapp, dan metode pembayaran.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // FB Pixel AddToCart
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'AddToCart', {
          content_ids: [productNameBackend],
          content_type: 'product',
          value: totalAmount,
          currency: 'IDR'
        });
      }
      
      // Send CAPI AddToCart
      sendCapiEvent('AddToCart', {
        content_ids: [productNameBackend],
        content_type: 'product',
        value: totalAmount,
        currency: 'IDR'
      });

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
          userId: null, // No auth required
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
        // Scroll to top to see instructions
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

  // Realtime Payment Listener
  useEffect(() => {
    if (!showPaymentInstructions || !paymentData?.tripay_reference) return;
    
    const channel = supabase
      .channel(`payment-${paymentData.tripay_reference}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'global_product', 
        filter: `tripay_reference=eq.${paymentData.tripay_reference}`
      }, (payload) => {
        if (payload.new?.status === 'PAID') {
          toast({
              title: "LUNAS! Akses Dikirim.",
              description: "Pembayaran berhasil. Cek email Anda sekarang untuk akses Audio & Ebook.",
              duration: 5000, 
              variant: "default"
          });
          
          if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'Purchase', {
              content_ids: [productNameBackend],
              content_type: 'product',
              value: totalAmount,
              currency: 'IDR'
            });
          }
          
          // Send CAPI Purchase
          sendCapiEvent('Purchase', {
            content_ids: [productNameBackend],
            content_type: 'product',
            value: totalAmount,
            currency: 'IDR'
          });
        }
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [showPaymentInstructions, paymentData]);

  // --- RENDER PAYMENT INSTRUCTIONS ---
  if (showPaymentInstructions && paymentData) {
    return (
      <div className="min-h-screen bg-pink-50 pb-20 font-sans">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl">
          <div className="p-4 bg-rose-600 text-white flex items-center gap-2 sticky top-0 z-10">
            <Button variant="ghost" size="icon" onClick={() => setShowPaymentInstructions(false)} className="text-white hover:bg-rose-700">
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="font-bold text-lg">Selesaikan Pembayaran</h1>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-center">
                <p className="text-gray-500">Total Tagihan</p>
                <p className="text-3xl font-bold text-rose-600">{formatCurrency(paymentData.amount)}</p>
                <div className="mt-2 inline-block px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-medium">
                    Menunggu Pembayaran
                </div>
            </div>

            <Card className="border-2 border-rose-100">
              <CardContent className="pt-6 space-y-4">
                {paymentData.qrUrl && (
                    <div className="flex flex-col items-center">
                        <img src={paymentData.qrUrl} alt="QRIS" className="w-64 h-64 object-contain border rounded-lg" />
                        <p className="text-sm text-gray-500 mt-2 text-center">Scan QR di atas menggunakan aplikasi e-wallet atau mobile banking Anda.</p>
                    </div>
                )}
                
                {paymentData.payCode && (
                    <div className="space-y-2">
                        <Label>Kode Bayar / Virtual Account</Label>
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                            <span className="font-mono text-xl font-bold tracking-wider text-rose-700">{paymentData.payCode}</span>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.payCode)}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

                <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-800 border border-yellow-200">
                    <p><strong>PENTING:</strong> Lakukan pembayaran sebelum waktu habis. Sistem akan otomatis memverifikasi pembayaran Anda.</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center">
               <Button variant="outline" className="w-full gap-2 border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => window.open(`https://wa.me/62895325633487?text=Halo admin, saya sudah bayar untuk order Feminine Magnetism ${paymentData.tripay_reference} tapi belum aktif.`, '_blank')}>
                   Bantuan Admin
               </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- LANDING PAGE CONTENT ---
  return (
    <div className="min-h-screen bg-rose-50/30 font-sans text-slate-800">
      <WhatsAppButton />
      <Toaster />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2c1a32] to-[#4a2c40] text-white pt-20 pb-28 px-4 text-center">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <svg width="100%" height="100%">
                <pattern id="sparkles" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="1" fill="white" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#sparkles)" />
            </svg>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-block px-4 py-1 bg-pink-500/20 border border-pink-400 text-pink-300 rounded-full text-sm font-bold tracking-wider mb-6 backdrop-blur-sm">
            UNTUK WANITA YANG LELAH MENGEJAR
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 font-serif">
            Aktifkan <span className="text-pink-400">Feminine Magnetism</span> & Buat Dia Tergila-gila Tanpa Usaha
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light">
            Berhenti menjadi 'pemburu'. Mulailah menjadi 'hadiah'. Rahasia psikologi pria & aktivasi energi feminin yang membuat Anda dikejar, dihargai, dan diratukan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg shadow-pink-500/30 transition-all transform hover:-translate-y-1" onClick={scrollToCheckout}>
              SAYA SIAP JADI MAGNET
            </Button>
            <div className="flex flex-col items-center sm:items-start">
              <p className="text-sm text-gray-400">Garansi Uang Kembali 100%</p>
              <div className="flex text-pink-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN SECTION */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#2c1a32] font-serif">
            Apakah Kamu Sering Merasa...
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
            {[
                { title: "Selalu 'Memberi' Lebih", desc: "Kamu yang selalu chat duluan, merencanakan kencan, dan berkorban, tapi dia malah semakin cuek." },
                { title: "Merasa Tidak Terlihat", desc: "Diabaikan, tidak dianggap prioritas, atau hanya dijadikan 'pilihan kedua' saat dia bosan." },
                { title: "Lelah Menjadi Kuat", desc: "Terjebak dalam energi maskulin (bekerja keras, memimpin) sehingga kehilangan sisi lembut yang menarik pria." }
            ].map((item, i) => (
                <Card key={i} className="border-none shadow-lg bg-white hover:shadow-xl transition-all">
                    <CardHeader>
                        <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-4">
                            <Heart className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-xl text-slate-900 font-serif">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
        <div className="mt-12 p-6 bg-rose-50 border-l-4 border-rose-400 rounded-r-lg text-center">
            <p className="text-lg font-medium text-rose-800">
                Masalahnya BUKAN kamu kurang cantik atau kurang baik. Masalahnya adalah <strong>Polaritas Energi</strong>. Saat kamu terlalu "Maskulin" (mengejar/mengontrol), pria secara alami akan mundur.
            </p>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="bg-white py-20 px-6 border-y border-rose-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
                <div className="relative">
                    <div className="absolute inset-0 bg-pink-200 rounded-full blur-3xl opacity-30"></div>
                    <div className="relative bg-gradient-to-br from-pink-50 to-white border border-pink-100 rounded-2xl p-8 shadow-xl text-center">
                        <Sparkles className="w-20 h-20 text-pink-400 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold mb-2 text-[#2c1a32] font-serif">High Value Woman</h3>
                        <p className="text-gray-500">The Art of Receiving</p>
                    </div>
                </div>
            </div>
            <div className="md:w-1/2 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-[#2c1a32] font-serif">
                    Kembalikan Mahkotamu dengan <span className="text-pink-600">Feminine Magnetism</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Program audio hipnoterapi & panduan eksklusif untuk mengakses kembali energi feminin murnimu. Biarkan alam bawah sadarmu memancarkan sinyal "High Value" yang membuat pria ingin melindungi, memberi, dan berkomitmen.
                </p>
                <ul className="space-y-4">
                    {[
                        "Menghapus trauma 'tidak layak dicintai'",
                        "Mengaktifkan aura 'The Prize' (Hadiah) bukan 'Chaser'",
                        "Membuat pria merasa maskulin & berguna di dekatmu",
                        "Menarik komitmen tanpa perlu memohon atau menuntut"
                    ].map((feat, i) => (
                        <li key={i} className="flex items-center gap-3">
                            <CheckCircle className="text-pink-500 w-5 h-5 flex-shrink-0" />
                            <span className="font-medium text-slate-700">{feat}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#2c1a32] font-serif">Apa Yang Kamu Dapatkan?</h2>
        <div className="space-y-6">
            <div className="flex gap-4 items-start p-6 bg-white rounded-xl shadow-sm border border-pink-100 hover:border-pink-300 transition-colors">
                <div className="bg-pink-100 p-3 rounded-lg text-pink-600">
                    <Headphones className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">1. Audio "Goddess Awakening" (Sleep Hypnosis)</h3>
                    <p className="text-slate-600">Audio 20 menit dengan gelombang Theta untuk didengarkan sebelum tidur. Menghapus <em>inner block</em>, meningkatkan <em>self-worth</em>, dan memancarkan aura dewi yang tenang.</p>
                </div>
            </div>
            <div className="flex gap-4 items-start p-6 bg-white rounded-xl shadow-sm border border-pink-100 hover:border-pink-300 transition-colors">
                <div className="bg-rose-100 p-3 rounded-lg text-rose-600">
                    <Sparkles className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">2. Audio "Morning Radiance" Booster</h3>
                    <p className="text-slate-600">Audio 5 menit untuk pagi hari. Membangkitkan mood ceria, playful, dan magnetis. Pria sangat tertarik pada wanita yang bahagia dengan dirinya sendiri.</p>
                </div>
            </div>
            <div className="flex gap-4 items-start p-6 bg-white rounded-xl shadow-sm border border-pink-100 hover:border-pink-300 transition-colors">
                <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                    <BookOpen className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">3. Ebook "The Siren's Secret"</h3>
                    <p className="text-slate-600">Buku panduan psikologi pria. Pelajari cara berkomunikasi yang membuat pria mendengarkan, cara menetapkan batasan (boundaries) yang seksi, dan seni menerima.</p>
                </div>
            </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-white py-20 px-6 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#2c1a32] font-serif">Transformasi Wanita Indonesia</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    {
                        name: "Sarah, 28th", role: "Karyawan Swasta",
                        text: "Dulu aku yang ngejar-ngejar mantan sampai harga diri hancur. Setelah dengerin audio ini, entah kenapa aku jadi tenang banget. Tiba-tiba mantan yang dulu cuek malah reach out dan minta balikan. Tapi sekarang aku yang mikir-mikir haha!",
                        avatar: "S"
                    },
                    {
                        name: "Dinda, 31th", role: "Entrepreneur",
                        text: "Sering banget dibilang 'terlalu mandiri' sama cowok. Ternyata aku emang terlalu maskulin energinya. Audio ini bantu aku untuk 'lean back' dan rileks. Sekarang pasangan jadi lebih inisiatif dan romantis.",
                        avatar: "D"
                    },
                    {
                        name: "Bella, 25th", role: "Content Creator",
                        text: "Inner work is real! Pas self-worth aku naik karena audio ini, cowok-cowok yang deketin kualitasnya beda. Bukan lagi fuckboy, tapi pria yang mature dan siap komitmen.",
                        avatar: "B"
                    }
                ].map((testi, i) => (
                    <Card key={i} className="bg-rose-50/50 border-none shadow-sm p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center font-bold text-pink-700">
                                {testi.avatar}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">{testi.name}</h4>
                                <p className="text-xs text-slate-500">{testi.role}</p>
                            </div>
                        </div>
                        <p className="text-slate-700 italic">"{testi.text}"</p>
                    </Card>
                ))}
            </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 text-[#2c1a32] font-serif">Pertanyaan Yang Sering Diajukan</h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="item-1" className="bg-white px-4 rounded-lg border border-gray-200">
                    <AccordionTrigger className="text-slate-900 font-semibold">Berapa lama sampai terlihat hasilnya?</AccordionTrigger>
                    <AccordionContent className="text-slate-700">
                        Sebagian besar pengguna merasakan shift mental (lebih tenang & percaya diri) dalam 5-10 hari pertama. Perubahan dinamika hubungan biasanya terlihat setelah 21 hari rutin mendengarkan.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="bg-white px-4 rounded-lg border border-gray-200">
                    <AccordionTrigger className="text-slate-900 font-semibold">Apakah ini aman secara agama/medis?</AccordionTrigger>
                    <AccordionContent className="text-slate-700">
                        Sangat aman. Ini adalah teknik relaksasi mendalam (hipnoterapi) untuk menanamkan mindset positif. Tidak ada unsur mistis. Hanya psikologi dan neuroscience.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="bg-white px-4 rounded-lg border border-gray-200">
                    <AccordionTrigger className="text-slate-900 font-semibold">Apakah ini akan membuat saya jadi 'jahat'?</AccordionTrigger>
                    <AccordionContent className="text-slate-700">
                        TIDAK. Menjadi "High Value" bukan berarti sombong atau jual mahal. Itu berarti kamu menghargai dirimu sendiri, sehingga orang lain pun otomatis menghargaimu. Kamu tetap menjadi dirimu yang baik, tapi dengan standar yang lebih sehat.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
      </section>

      {/* CHECKOUT FORM SECTION */}
      <section id="checkout-section" className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-pink-200 shadow-2xl overflow-hidden rounded-2xl bg-white text-slate-900">
                <CountdownTimer />
                <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white p-8 text-center">
                    <h2 className="text-3xl font-bold mb-2 font-serif">FORMULIR PEMESANAN</h2>
                    <p className="opacity-90 text-lg">Investasi untuk kebahagiaan & cinta sejatimu</p>
                </div>
                
                <CardContent className="p-6 md:p-10 space-y-10 bg-white">
                    {/* PRICING BOX */}
                    <div className="bg-pink-50 border-2 border-pink-100 rounded-xl p-6 text-center shadow-sm">
                        <p className="text-slate-500 text-sm mb-1">Harga Normal</p>
                        <p className="text-xl text-slate-400 line-through decoration-rose-500 decoration-2 mb-2">{formatCurrency(originalPrice)}</p>
                        <p className="text-pink-900 font-bold mb-1">Harga Promo Spesial:</p>
                        <p className="text-4xl font-extrabold text-pink-600">{formatCurrency(productPrice)}</p>
                        <div className="mt-4 flex flex-col items-center gap-2 text-sm text-green-700 font-medium">
                            <div className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" /> Hemat 67% • Akses Selamanya
                            </div>
                            <div className="flex items-center gap-1 text-blue-700">
                                <ShieldCheck className="w-4 h-4" /> Garansi Uang Kembali 100%
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-slate-200" />

                    {/* FORM INPUTS */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900">
                            <User className="w-5 h-5 text-pink-600" /> Data Diri
                        </h3>
                        <div className="grid gap-4">
                            <div>
                                <Label htmlFor="name" className="text-slate-700 font-semibold mb-1 block">Nama Lengkap</Label>
                                <Input 
                                    id="name" 
                                    placeholder="Contoh: Sarah Wijaya" 
                                    value={userName} 
                                    onChange={(e) => setUserName(e.target.value)} 
                                    className="bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-200 focus:border-pink-500 h-12"
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="email" className="text-slate-700 font-semibold mb-1 block">Alamat Email (PENTING)</Label>
                                    <Input 
                                        id="email" 
                                        type="email" 
                                        placeholder="Untuk kirim akses produk" 
                                        value={userEmail} 
                                        onChange={(e) => setUserEmail(e.target.value)} 
                                        className="bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-200 focus:border-pink-500 h-12"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone" className="text-slate-700 font-semibold mb-1 block">Nomor WhatsApp</Label>
                                    <Input 
                                        id="phone" 
                                        type="tel" 
                                        placeholder="0812xxxx" 
                                        value={phoneNumber} 
                                        onChange={(e) => setPhoneNumber(e.target.value)} 
                                        className="bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-200 focus:border-pink-500 h-12"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-slate-200" />

                    {/* PAYMENT METHOD */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900">
                            <CreditCard className="w-5 h-5 text-pink-600" /> Metode Pembayaran
                        </h3>
                        <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="grid grid-cols-1 gap-4">
                            {paymentMethods.map((method) => (
                                <Label key={method.code} className={`flex items-start p-5 border-2 rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === method.code ? 'border-pink-600 bg-pink-50 shadow-md ring-1 ring-pink-600' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}>
                                    <RadioGroupItem value={method.code} id={method.code} className="mt-1 mr-4 border-slate-400 text-pink-600" />
                                    <div className="flex-1">
                                        <div className="font-bold text-slate-900 text-lg">{method.name}</div>
                                        <div className="text-sm text-slate-600">{method.description}</div>
                                    </div>
                                </Label>
                            ))}
                        </RadioGroup>
                    </div>

                </CardContent>

                <CardFooter className="p-8 bg-slate-50 flex flex-col gap-4 border-t border-slate-200">
                    <Button 
                        size="lg" 
                        className="w-full text-xl py-8 bg-green-600 hover:bg-green-700 font-bold shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] text-white"
                        onClick={handleCreatePayment}
                        disabled={loading}
                    >
                        {loading ? 'Memproses...' : `BAYAR SEKARANG - ${formatCurrency(totalAmount)}`}
                    </Button>
                    <div className="flex items-center justify-center gap-4 text-xs text-slate-500 font-medium">
                        <div className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-green-600" /> Secure Payment
                        </div>
                        <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-blue-600" /> Instant Access
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#2c1a32] text-white py-12 text-center text-sm">
        <p className="mb-4">© 2026 eL Vision Ecosystem. All Rights Reserved.</p>
        <p className="text-gray-500">
            Disclaimer: Program ini adalah alat bantu psikologis untuk pengembangan diri.<br/>Hasil dapat bervariasi untuk setiap individu.
        </p>
      </footer>
    </div>
  );
}
