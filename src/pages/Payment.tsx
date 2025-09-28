import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CreditCard, Calendar, Phone, User, Mail, Copy, Crown, Edit, RefreshCw, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useAuth } from '@/contexts/AuthContext';

// Meta Pixel declaration
declare global {
  interface Window {
    fbq?: any;
  }
}

interface PaymentProps {
  onNavigate: (tab: string) => void;
}

export function Payment({ onNavigate }: PaymentProps) {
  const { user, userProfile, loading: userDataLoading } = useUserProfile();
  const { userId } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('1_month');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('QRIS');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  
  // Cache profile for fast payment processing
  const [cachedProfile, setCachedProfile] = useState<any>(null);

  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  const [showQrisModal, setShowQrisModal] = useState(false);
  const { toast } = useToast();

  // Meta Pixel initialization with error handling
  useEffect(() => {
    // Initialize Meta Pixel if not already loaded
    if (typeof window !== 'undefined' && !window.fbq) {
      try {
        (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
          if (f.fbq) return;
          n = f.fbq = function(...args: any[]) {
            n.callMethod ?
              n.callMethod.apply(n, args) : n.queue.push(args)
          };
          if (!f._fbq) f._fbq = n;
          n.push = n;
          n.loaded = !0;
          n.version = '2.0';
          n.queue = [];
          t = b.createElement(e);
          t.async = !0;
          t.src = v;
          t.onerror = () => {
            // Silently fail if Facebook Pixel can't load
            console.warn('Facebook Pixel failed to load (blocked or network issue)');
          };
          s = b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t, s)
        })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

        // Initialize with your Pixel ID (with error handling)
        setTimeout(() => {
          if (window.fbq) {
            window.fbq('init', '3319324491540889');
            window.fbq('track', 'PageView');
          }
        }, 1000);
      } catch (error) {
        console.warn('Facebook Pixel initialization failed:', error);
      }
    }
  }, []);

  // Track AddToCart when component mounts (user enters payment page)
  useEffect(() => {
    const trackAddToCart = () => {
      if (window.fbq) {
        console.log('🛒 Add to Cart Event Pixel - User entered payment page');
        window.fbq('track', 'AddToCart');
      } else {
        // Retry if fbq not loaded yet
        setTimeout(trackAddToCart, 500);
      }
    };
    
    trackAddToCart();
  }, []);

  const paymentMethods = [
    {
      code: 'QRIS',
      name: 'QRIS',
      description: 'QRIS Bayar ke Semua Bank Termasuk DANA, OVO, SHOPEEPAY'
    },
    {
      code: 'BCAVA',
      name: 'BCA Virtual Account',
      description: 'Transfer via BCA Virtual Account'
    },
    {
      code: 'PERMATAVA',
      name: 'Permata Virtual Account',
      description: 'Transfer via Permata Virtual Account'
    },
    {
      code: 'BNIVA',
      name: 'BNI Virtual Account',
      description: 'Transfer via BNI Virtual Account'
    },
    {
      code: 'BRIVA',
      name: 'BRI Virtual Account',
      description: 'Transfer via BRI Virtual Account'
    },
    {
      code: 'MANDIRIVA',
      name: 'Mandiri Virtual Account',
      description: 'Transfer via Mandiri Virtual Account'
    },
    {
      code: 'BSIVA',
      name: 'BSI Virtual Account',
      description: 'Transfer via BSI Virtual Account'
    },
    {
      code: 'OCBCVA',
      name: 'OCBC NISP Virtual Account',
      description: 'Transfer via OCBC NISP Virtual Account'
    }
  ];

  const [subscriptionPlans, setSubscriptionPlans] = useState([
    {
      id: '1_month',
      name: 'Berlangganan 1 Bulan', 
      description: 'Berlangganan bulanan dengan akses penuh',
      price: 100000,
      currency: 'IDR',
      paymentMethodCode: 'BCAVA',
      paymentMethod: 'BCA Virtual Account',
      duration: '30 hari',
      durationDays: 30
    },
    {
      id: '1_day',
      name: 'Berlangganan 1 Hari',
      description: 'Berlangganan harian dengan akses penuh',
      price: 4000,
      currency: 'IDR',
      paymentMethodCode: 'BCAVA', 
      paymentMethod: 'BCA Virtual Account',
      duration: '1 hari',
      durationDays: 1
    },
    {
      id: '1_year',
      name: 'Berlangganan 1 Tahun (30% Lebih Hemat)',
      description: 'Berlangganan tahunan dengan akses penuh',
      price: 800000,
      currency: 'IDR',
      paymentMethodCode: 'BCAVA',
      paymentMethod: 'BCA Virtual Account',
      duration: '365 hari',
      durationDays: 365
    },
    {
      id: '1_week',
      name: 'Berlangganan 1 Minggu',
      description: 'Berlangganan mingguan dengan akses penuh', 
      price: 30000,
      currency: 'IDR',
      paymentMethodCode: 'BCAVA',
      paymentMethod: 'BCA Virtual Account',
      duration: '7 hari',
      durationDays: 7
    }
  ]);

  // Real-time payment status listener
  useEffect(() => {
    if (!showPaymentInstructions || !paymentData?.tripay_reference) return;

    console.log('🔔 Setting up realtime subscription for tripay_reference:', paymentData.tripay_reference);

    const channel = supabase
      .channel('payment-status-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pro_subscriptions',
          filter: `tripay_reference=eq.${paymentData.tripay_reference}`
        },
        (payload) => {
          console.log('💰 Pro subscription activated:', payload);
          
          if (payload.new?.status === 'active') {
            console.log('🎉 Payment completed! Showing success notification...');
            console.log('🎉 Payment data:', payload.new);
            
            // Track Meta Pixel Purchase - Only when truly PAID
            const plan = subscriptionPlans.find(p => p.id === selectedPlan);
            if (window.fbq && paymentData) {
              console.log('✨ Purchase Event Pixel - Payment completed');
              console.log('📊 Tracking Meta Pixel Purchase:', {
                value: paymentData.amount,
                currency: 'IDR',
                content_name: plan?.name || 'Pro Subscription',
                transaction_id: paymentData.tripay_reference
              });
              
              window.fbq('track', 'Purchase', {
                value: paymentData.amount || 0,
                currency: 'IDR',
                content_name: plan?.name || 'Pro Subscription',
                content_ids: [selectedPlan],
                content_type: 'subscription',
                transaction_id: paymentData.tripay_reference
              });
            }
            
            // Show success notification with refresh button
            toast({
              title: "🎉 Pembayaran Berhasil!",
              description: "Status Pro telah aktif, Klik disini untuk Refresh dan Akses Pro",
              action: (
                <button 
                  onClick={() => {
                    console.log('🔄 User clicked refresh after payment success')
                    window.location.reload()
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  🔄 Refresh dan Akses Pro!
                </button>
              ),
              duration: 0, // Don't auto-dismiss
            });
            
            // Show full-screen success modal with purple design
            const modal = document.createElement('div');
            modal.innerHTML = `
              <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 9999; backdrop-filter: blur(8px);">
                <div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%); padding: 50px; border-radius: 25px; text-align: center; max-width: 90%; box-shadow: 0 25px 80px rgba(139, 92, 246, 0.3); border: 2px solid rgba(139, 92, 246, 0.3); position: relative; overflow: hidden;">
                  <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%); animation: pulse 2s ease-in-out infinite;"></div>
                  <div style="position: relative; z-index: 10;">
                    <div style="font-size: 5rem; margin-bottom: 25px; filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.5));">🎉</div>
                    <h2 style="font-size: 2.5rem; background: linear-gradient(45deg, #8b5cf6, #a855f7, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 20px; font-weight: bold;">Pembayaran Berhasil!</h2>
                    <p style="font-size: 1.4rem; color: #c4b5fd; margin-bottom: 25px; line-height: 1.6;">Pembayaran berhasil silahkan Check Email !</p>
                    <button id="refreshBtn" style="background: linear-gradient(45deg, #10b981, #059669); color: white; border: none; padding: 15px 30px; border-radius: 12px; font-size: 1.2rem; font-weight: bold; cursor: pointer; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); transition: all 0.3s ease;">
                      🔄 Refresh dan Akses Pro Sekarang!
                    </button>
                    <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 12px; padding: 15px; margin-top: 20px;">
                      <p style="color: #a78bfa; font-size: 1rem;">Jendela ini akan tertutup dalam <span id="countdown" style="color: #8b5cf6; font-weight: bold; font-size: 1.2rem;">30</span> detik</p>
                    </div>
                  </div>
                </div>
              </div>
              <style>
                @keyframes pulse {
                  0%, 100% { opacity: 0.5; transform: scale(1); }
                  50% { opacity: 0.8; transform: scale(1.05); }
                }
              </style>
            `;
            document.body.appendChild(modal);
            
            // Add refresh button click handler
            const refreshBtn = document.getElementById('refreshBtn');
            if (refreshBtn) {
              refreshBtn.addEventListener('click', () => {
                console.log('🔄 User clicked refresh from payment success modal');
                clearInterval(timer);
                document.body.removeChild(modal);
                window.location.reload();
              });
            }
            
            let countdown = 30;
            const countdownEl = document.getElementById('countdown');
            const timer = setInterval(() => {
              countdown--;
              if (countdownEl) countdownEl.textContent = countdown.toString();
              if (countdown <= 0) {
                clearInterval(timer);
                document.body.removeChild(modal);
                setShowPaymentInstructions(false);
                onNavigate("profile");
              }
            }, 1000);
          } else {
            console.log('📝 Payment status update:', payload.new?.status);
          }
        }
      )
      .subscribe();

    return () => {
      console.log('🧹 Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [showPaymentInstructions, paymentData?.tripay_reference]);


  // Cache session and profile data in memory for fast payment processing
  useEffect(() => {
    if (user?.id && userProfile) {
      setCachedProfile(userProfile);
      
      setEmail(user.email || '');
      
      if (userProfile.display_name && !fullName) {
        setFullName(userProfile.display_name);
      }
      
      if (userProfile.phone_number && !phoneNumber) {
        setPhoneNumber(userProfile.phone_number);
      }
    }
  }, [user, userProfile, phoneNumber, fullName]);

  const handleCreatePayment = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Silakan login terlebih dahulu",
        variant: "destructive"
      });
      return;
    }
    
    // Use cached data for fast payment processing
    const profile = cachedProfile || userProfile;
    
    // Use form data if profile data not available
    const finalPhoneNumber = profile?.phone_number?.trim() || phoneNumber.trim();
    const finalDisplayName = profile?.display_name?.trim() || fullName.trim();
    
    if (!userId || !selectedPlan || !finalPhoneNumber || !finalDisplayName || !user?.email?.trim()) {
      toast({
        title: "Data Tidak Lengkap", 
        description: "Mohon lengkapi nama lengkap, nomor telepon, dan email",
        variant: "destructive",
      });
      return;
    }
    
    if (!/^08[0-9]{6,13}$/.test(finalPhoneNumber)) {
      toast({
        title: "Nomor Telepon Tidak Valid",
        description: "Format: 08xxxx (8-15 digit) Silahkan Klik Edit Profil",
        variant: "destructive",
      });
      return;
    }
    
    // Always save payment form data to profile (like clicking "edit profil")
    if (finalPhoneNumber && finalDisplayName) {
      console.log('💾 Auto-saving payment data to profile:', { 
        phone_number: finalPhoneNumber, 
        display_name: finalDisplayName 
      });
      await supabase.from('profiles').update({ 
        phone_number: finalPhoneNumber,
        display_name: finalDisplayName,
        updated_at: new Date().toISOString()
      }).eq('user_id', userId);
    }
    
    setLoading(true);
    
    toast({
      title: "Membuat Pembayaran...",
      description: "Sedang memproses permintaan Anda, mohon tunggu",
    });
    
    try {
      const plan = subscriptionPlans.find(p => p.id === selectedPlan);
      if (!plan) throw new Error('Plan not found');

      console.log('💳 Attempting payment creation for user:', userId);
      console.log('💰 Payment data:', {
        user_id: userId,
        user_name: finalDisplayName,
        user_email: user?.email,
        phone_number: finalPhoneNumber,
        subscription_type: selectedPlan,
        payment_method: selectedPaymentMethod,
        amount: plan.price
      });

      const { data, error } = await supabase.functions.invoke('tripay-create-payment', {
        body: {
          subscriptionType: plan.id,
          paymentMethod: selectedPaymentMethod,
          userName: finalDisplayName,
          userEmail: user.email,
          phoneNumber: finalPhoneNumber,
          amount: plan.price
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        setPaymentData(data);
        setShowPaymentInstructions(true);
        
        if (data.payCode) {
          toast({
            title: "Pembayaran Berhasil Dibuat",
            description: "Silakan selesaikan pembayaran menggunakan Virtual Account",
          });
        } else if (data.qrUrl) {
          toast({
            title: "Pembayaran Berhasil Dibuat", 
            description: "Silakan scan QR Code untuk menyelesaikan pembayaran",
          });
        } else {
          toast({
            title: "Pembayaran Berhasil Dibuat",
            description: "Silakan ikuti instruksi pembayaran",
          });
        }
      } else {
        toast({
          title: "Error",
          description: data?.error || "Gagal membuat pembayaran. Silakan coba lagi.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Tripay payment error:', error);
      toast({
        title: "Error",
        description: "Gagal membuat pembayaran. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
      description: "Nomor Virtual Account telah disalin ke clipboard",
    });
  };





  if (showPaymentInstructions) {
    return (
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowPaymentInstructions(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold font-orbitron bg-gradient-primary bg-clip-text text-transparent">
                Instruksi Pembayaran
              </h1>
              <p className="text-sm text-muted-foreground">Selesaikan pembayaran untuk mengaktifkan langganan</p>
            </div>
          </div>
        </div>

        <div className="px-6 space-y-6 pb-32">
          {/* Status Badge */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium">
              Menunggu Pembayaran
            </div>
          </div>

          {/* Virtual Account Number */}
          {(paymentData?.payCode || paymentData?.paymentType === 'DIRECT') && paymentData?.paymentMethod !== 'QRIS' && (
            <Card className="border-2 border-yellow-300 bg-gradient-to-br from-yellow-100 via-yellow-200 to-amber-200 shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-amber-300/30 to-yellow-600/20"></div>
              <CardHeader className="text-center pb-4 relative z-10">
                <CardTitle className="flex items-center justify-center gap-2 text-amber-800">
                  <CreditCard className="w-5 h-5" />
                  Virtual Account {selectedPaymentMethod}
                </CardTitle>
                <p className="text-sm text-amber-700 font-medium mt-1">
                  {paymentData?.paymentMethod}
                </p>
              </CardHeader>
              <CardContent className="text-center space-y-4 relative z-10">
                <div className="bg-white/90 backdrop-blur-sm border-2 border-dashed border-amber-400 p-6 rounded-xl shadow-inner">
                  <p className="font-mono text-lg sm:text-2xl font-bold text-amber-900 tracking-wider mb-2 break-all">
                    {paymentData.payCode || 'Loading...'}
                  </p>
                  <p className="text-xs text-amber-700 font-medium">
                    Nomor Virtual Account
                  </p>
                </div>
                <p className="text-sm text-amber-800 font-medium">
                  Salin nomor di atas untuk melakukan transfer
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(paymentData.payCode)}
                  className="border-amber-400 text-amber-800 hover:bg-amber-50 bg-white/80 backdrop-blur-sm shadow-md"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Salin Nomor VA
                </Button>
              </CardContent>
            </Card>
          )}

          {/* QRIS Tutorial Button */}
          {(paymentData?.qrUrl || paymentData?.paymentMethod === 'QRIS') && (
            <div className="flex justify-center mb-4">
              <Dialog open={showQrisModal} onOpenChange={setShowQrisModal}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-purple-600 px-4 py-1 rounded-lg shadow-lg text-xs"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    CARA BAYAR QRIS
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm p-0 bg-black">
                  <DialogHeader className="p-4 pb-0">
                    <DialogTitle className="text-white text-center">Cara Bayar QRIS</DialogTitle>
                  </DialogHeader>
                  <div className="aspect-[9/16] w-full relative">
                    <video
                      className="w-full h-full object-cover rounded-b-lg"
                      controls
                      poster="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/admin-image/QRIS.png"
                      preload="metadata"
                    >
                      <source 
                        src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/admin-image/QRIS.mp4" 
                        type="video/mp4" 
                      />
                      <p className="text-white text-center p-4">
                        Browser Anda tidak mendukung video player. 
                        <a 
                          href="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/admin-image/QRIS.mp4"
                          className="text-purple-400 underline ml-1"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download video
                        </a>
                      </p>
                    </video>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* QR Code */}
          {(paymentData?.qrUrl || paymentData?.paymentMethod === 'QRIS') && (
            <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-indigo-700/30 to-purple-900/20"></div>
              <CardHeader className="text-center pb-4 relative z-10">
                <CardTitle className="flex items-center justify-center gap-2 text-purple-100">
                  📱 QR Code QRIS
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4 relative z-10">
                <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl border-2 border-dashed border-purple-300 inline-block shadow-inner">
                  {paymentData?.qrUrl ? (
                    <img 
                      src={paymentData.qrUrl} 
                      alt="QR Code QRIS" 
                      className="w-64 h-64 mx-auto" 
                      onError={(e) => {
                        console.error('QR Image failed to load:', paymentData.qrUrl);
                      }}
                    />
                  ) : (
                    <div className="w-64 h-64 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg">
                      <p className="text-gray-500 text-sm">QR Code Loading...</p>
                    </div>
                  )}
                </div>
                <p className="text-sm text-purple-200 font-medium">
                  Screenshot QR ini dan upload foto di OVO, ShopeePay, DANA, Atau Bank lain yang Anda miliki
                </p>
                <p className="text-xs text-purple-300">
                  Atau scan langsung dengan aplikasi mobile banking/e-wallet
                </p>
              </CardContent>
            </Card>
          )}

          {/* Payment Summary Card */}
          <Card className="overflow-hidden border-2 border-primary/20 shadow-lg">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">{formatCurrency(paymentData?.amount)}</h2>
                <p className="text-muted-foreground">Total Pembayaran</p>
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">Referensi</span>
                  <span className="font-mono text-xs font-medium break-all">{paymentData?.tripay_reference}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Metode</span>
                  <span className="text-sm font-medium">{paymentData?.paymentMethod}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-muted-foreground block">Berlaku Hingga</span>
                  <span className="text-sm font-medium text-orange-600">
                    {paymentData?.expiredTime && !isNaN(paymentData.expiredTime)
                      ? new Date(paymentData.expiredTime * 1000).toLocaleString('id-ID', {
                          year: 'numeric',
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Tidak ada batas waktu'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Payment Instructions */}
          {paymentData?.instructions && paymentData.instructions.length > 0 && (
            <Card className="border-2 border-purple-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  📋 Cara Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto space-y-4">
                {paymentData.instructions.map((instructionGroup: any, groupIndex: number) => (
                  <div key={groupIndex} className="space-y-3">
                    <h4 className="font-semibold text-purple-600">{instructionGroup.title}</h4>
                    <div className="space-y-2 pl-4">
                      {instructionGroup.steps.map((step: string, stepIndex: number) => (
                        <div key={stepIndex} className="flex gap-3 items-start">
                          <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full text-xs flex items-center justify-center font-medium">
                            {stepIndex + 1}
                          </span>
                          <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: step }} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="fixed bottom-20 left-6 right-6 z-50">
          <Card className="p-4 bg-card/80 backdrop-blur-sm border border-border">
            <div className="space-y-3">
              <div className="bg-purple-600 px-4 py-2 rounded-lg">
                <p className="text-center text-sm text-white font-medium">
                  Pembayaran akan diverifikasi otomatis dalam 1 Menit
                </p>
              </div>
              <Button onClick={() => onNavigate("profile")} variant="outline" className="w-full">
                Kembali ke Profil
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate("profile")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold font-orbitron bg-gradient-primary bg-clip-text text-transparent">
            Paket Berlangganan
          </h1>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* User Information */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              Informasi Pengguna
              {userDataLoading && (
                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
              )}
            </h3>
          </div>
          
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="fullName" className="text-xs text-muted-foreground">Nama</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Tulis Nama anda disini"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-xs text-muted-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={userDataLoading ? "Memuat email..." : "email@contoh.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-muted/50 cursor-not-allowed"
                  required
                  disabled
                />
              </div>
              
            </div>

            <div>
              <Label htmlFor="phoneNumber" className="text-xs text-muted-foreground">Nomor Telepon</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder={userDataLoading ? "Memuat nomor telepon..." : "08123456789"}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>
        </div>


        {/* Payment Method Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Metode Pembayaran</h3>
          <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="space-y-2">
            {paymentMethods.map((method) => (
              <div key={method.code} className="flex items-center space-x-3">
                <RadioGroupItem value={method.code} id={method.code} />
                <Label htmlFor={method.code} className="flex-1 cursor-pointer">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{method.name}</span>
                    <span className="text-xs text-muted-foreground">{method.description}</span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Subscription Plans */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Paket Berlangganan
          </h3>

          <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="space-y-3">
            {subscriptionPlans.map((plan) => (
              <div key={plan.id} className="flex items-start space-x-3">
                <RadioGroupItem value={plan.id} id={plan.id} className="mt-3" />
                <Label htmlFor={plan.id} className="flex-1 cursor-pointer">
                  <Card className="p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm">{plan.name}</h3>
                          {/* Crown logo for 1 year subscription */}
                          {(plan.durationDays === 365 || plan.name.includes('Tahun') || plan.name.includes('Year')) && (
                            <Crown className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                      </div>
                      <div className="text-right ml-3">
                        <div className="font-bold text-base">{formatCurrency(plan.price)}</div>
                        <div className="text-xs text-muted-foreground">{plan.duration}</div>
                      </div>
                    </div>
                  </Card>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-20 left-6 right-6">
        <Button 
          onClick={() => {
            // Use final data that will actually be sent to payment
            const profile = cachedProfile || userProfile;
            const finalPhoneNumber = profile?.phone_number?.trim() || phoneNumber.trim();
            const finalDisplayName = profile?.display_name?.trim() || fullName.trim();
            
            console.log('%c🎁 Payment button clicked:', 'color: green; font-weight: bold;', {
              name: finalDisplayName,
              email: user?.email, // AUTH email
              phone: finalPhoneNumber,
              user_id: userId, // AUTH ID
              subscription_plan: selectedPlan
            });
            handleCreatePayment();
          }}
          disabled={loading || userDataLoading || !selectedPlan || 
            !(cachedProfile?.phone_number?.trim() || phoneNumber.trim()) || 
            !(cachedProfile?.display_name?.trim() || fullName.trim())}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <CreditCard className="w-4 h-4 mr-2" />
          )}
          {loading ? 'Membuat Pembayaran...' : userDataLoading ? 'Memuat Data Pengguna...' : 'Buat Pembayaran'}
        </Button>
      </div>

      {/* Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/6 left-1/4 w-2 h-2 bg-primary rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-2/6 right-1/3 w-1 h-1 bg-accent rounded-full opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-3/6 left-1/5 w-1 h-1 bg-primary rounded-full opacity-50 animate-pulse delay-500"></div>
        <div className="absolute top-4/6 right-1/4 w-2 h-2 bg-accent rounded-full opacity-30 animate-pulse delay-1500"></div>
        <div className="absolute top-5/6 left-1/3 w-1 h-1 bg-primary rounded-full opacity-70 animate-pulse delay-700"></div>
        
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/2 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/3 rounded-full blur-2xl"></div>
        
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/1 via-transparent to-accent/1"></div>
      </div>
    </div>
  );
}