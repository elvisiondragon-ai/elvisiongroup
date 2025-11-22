import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Copy, CreditCard, Play, User, Mail, Phone, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Toaster } from '@/components/ui/toaster';
import { Separator } from '@/components/ui/separator';

// This new drelf page is a standalone checkout, not tied to logged-in users.
// It mimics the structure of Payment.tsx but is self-contained for one product.

export default function DrelfPaymentPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // --- Static Product Information ---
  const productId = 'drelf_collagen_1x_600k';
  const productName = 'Drelf Collagen 1x';
  const price = 600000;

  // --- Component State ---
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('QRIS');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  const [showQrisModal, setShowQrisModal] = useState(false);

  // --- Payment Methods (from Payment.tsx) ---
  const paymentMethods = [
    { code: 'QRIS', name: 'QRIS', description: 'Bayar ke Semua Bank, DANA, OVO, SHOPEEPAY' },
    { code: 'BCAVA', name: 'BCA Virtual Account', description: 'Transfer via BCA Virtual Account' },
    { code: 'PERMATAVA', name: 'Permata Virtual Account', description: 'Transfer via Permata Virtual Account' },
    { code: 'BNIVA', name: 'BNI Virtual Account', description: 'Transfer via BNI Virtual Account' },
    { code: 'BRIVA', name: 'BRI Virtual Account', description: 'Transfer via BRI Virtual Account' },
    { code: 'MANDIRIVA', name: 'Mandiri Virtual Account', description: 'Transfer via Mandiri Virtual Account' },
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

  // --- Create Payment Logic ---
  const handleCreatePayment = async () => {
    if (!userName || !userEmail || !phoneNumber || !userAddress || !selectedPaymentMethod) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon lengkapi semua informasi: nama, email, telepon, dan alamat.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('💳 Attempting payment creation for Drelf product:', productId);
      const { data, error } = await supabase.functions.invoke('tripay-create-payment', {
        body: {
          subscriptionType: productId, // Using this field for product ID
          paymentMethod: selectedPaymentMethod,
          userName: userName,
          userEmail: userEmail,
          phoneNumber: phoneNumber,
          address: userAddress,
          amount: price
        }
      });

      if (error) throw error;

      if (data?.success) {
        setPaymentData(data);
        setShowPaymentInstructions(true);
        toast({
          title: "Pembayaran Berhasil Dibuat",
          description: "Silakan selesaikan pembayaran.",
        });
      } else {
        toast({
          title: "Error Membuat Pembayaran",
          description: data?.error || "Gagal membuat pembayaran. Silakan coba lagi.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Tripay payment error:', error);
      toast({
        title: "Error Kritis",
        description: "Gagal memanggil fungsi pembayaran. Periksa konsol untuk detail.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Real-time Listener (from drelf.tsx) ---
  useEffect(() => {
    if (!showPaymentInstructions || !paymentData?.tripay_reference) return;
    
    // Using global_product because this is a physical product, not a subscription
    const tableName = 'global_product';
    console.log(`🔔 Setting up realtime subscription for ${tableName} reference:`, paymentData.tripay_reference);

    const channel = supabase
      .channel(`payment-status-drelf-${paymentData.tripay_reference}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: tableName, filter: `tripay_reference=eq.${paymentData.tripay_reference}`},
        (payload) => {
          console.log(`💰 Payment status change received for ${tableName}:`, payload);
          if (payload.new?.status === 'PAID' || payload.new?.status === 'SUCCESS') {
            console.log('🎉 Payment completed! Redirecting to a generic success page...');
            // We don't have a dedicated drelf success page, so redirecting home for now.
            // A dedicated success page could be created at /drelf/success.
            toast({
                title: "Pembayaran Berhasil!",
                description: "Terima kasih, pembayaran Anda telah kami terima.",
                variant: "success",
            });
            navigate('/'); 
          }
        }
      ).subscribe();

    return () => {
      console.log('🧹 Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [showPaymentInstructions, paymentData?.tripay_reference, navigate, toast]);


  // --- Payment Instructions View ---
  if (showPaymentInstructions && paymentData) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Toaster />
        <div className="p-6 pb-4">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => setShowPaymentInstructions(false)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent">Instruksi Pembayaran</h1>
              <p className="text-sm text-muted-foreground">Selesaikan pembayaran untuk produk Drelf</p>
            </div>
          </div>
        </div>

        <div className="px-6 space-y-6 pb-32">
            <div className="flex justify-center">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                Menunggu Pembayaran
                </div>
            </div>

            {/* QR Code Display */}
            {paymentData?.qrUrl && selectedPaymentMethod === 'QRIS' && (
                 <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 shadow-xl">
                 <CardHeader className="text-center pb-4"><CardTitle className="text-purple-100">📱 Scan QR Code QRIS</CardTitle></CardHeader>
                 <CardContent className="text-center space-y-4">
                   <div className="bg-white/95 p-3 rounded-xl border-2 border-dashed border-purple-300 inline-block">
                     <img src={paymentData.qrUrl} alt="QR Code QRIS" className="w-64 h-64 mx-auto"/>
                   </div>
                   <p className="text-sm text-purple-200">Screenshot QR ini dan upload di aplikasi Bank/E-Wallet Anda.</p>
                 </CardContent>
               </Card>
            )}

            {/* Virtual Account Display */}
            {paymentData?.payCode && selectedPaymentMethod !== 'QRIS' && (
                <Card className="border-2 border-yellow-300 bg-gradient-to-br from-yellow-100 to-amber-200 shadow-xl">
                    <CardHeader className="text-center pb-4"><CardTitle className="text-amber-800">Virtual Account {selectedPaymentMethod}</CardTitle></CardHeader>
                    <CardContent className="text-center space-y-4">
                        <div className="bg-white/90 p-6 rounded-xl">
                        <p className="font-mono text-2xl font-bold text-amber-900">{paymentData.payCode}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(paymentData.payCode)}>
                        <Copy className="w-4 h-4 mr-1" /> Salin Nomor VA
                        </Button>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader><CardTitle>Detail Pembayaran</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-between"><span>Total Pembayaran:</span> <span className="font-bold">{formatCurrency(paymentData?.amount)}</span></div>
                    <div className="flex justify-between"><span>Produk:</span> <span>{productName}</span></div>
                    <div className="flex justify-between"><span>Metode:</span> <span>{paymentData?.paymentMethod}</span></div>
                </CardContent>
            </Card>
        </div>
        <div className="fixed bottom-20 left-6 right-6 z-50">
            <Button onClick={() => navigate('/')} variant="outline" className="w-full">Kembali ke Beranda</Button>
        </div>
      </div>
    );
  }

  // --- Initial Form View ---
  return (
    <div className="min-h-screen bg-background pb-32">
      <Toaster />
      <div className="p-6 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent">
            Checkout Drelf
          </h1>
        </div>
      </div>

      <div className="px-6 space-y-6">
        <Card>
          <CardHeader><CardTitle>1. Rangkuman Pesanan</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-muted-foreground">Produk</Label>
              <span className="font-medium">{productName}</span>
            </div>
            <Separator/>
            <div className="flex justify-between items-center">
              <Label className="text-muted-foreground">Total Harga</Label>
              <span className="font-bold text-lg text-primary">{formatCurrency(price)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>2. Informasi Pengiriman</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="userName"><User className="inline-block w-4 h-4 mr-2"/>Nama Lengkap</Label>
              <Input id="userName" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="John Doe" required />
            </div>
            <div>
              <Label htmlFor="userEmail"><Mail className="inline-block w-4 h-4 mr-2"/>Email</Label>
              <Input id="userEmail" type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="email@example.com" required />
            </div>
            <div>
              <Label htmlFor="phoneNumber"><Phone className="inline-block w-4 h-4 mr-2"/>Nomor Telepon</Label>
              <Input id="phoneNumber" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="08123456789" required />
            </div>
            <div>
              <Label htmlFor="userAddress"><Home className="inline-block w-4 h-4 mr-2"/>Alamat Pengiriman</Label>
              <Input id="userAddress" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} placeholder="Jl. Pahlawan No. 123" required />
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>3. Metode Pembayaran</CardTitle></CardHeader>
            <CardContent>
            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="space-y-3">
                {paymentMethods.map((method) => (
                <Label key={method.code} htmlFor={method.code} className={`flex flex-col p-4 rounded-lg border cursor-pointer transition-all ${selectedPaymentMethod === method.code ? 'border-primary shadow-lg' : 'border-border'}`}>
                    <div className="flex items-center space-x-3">
                        <RadioGroupItem value={method.code} id={method.code} />
                        <div className="flex-1">
                            <span className="font-medium">{method.name}</span>
                            <p className="text-xs text-muted-foreground">{method.description}</p>
                        </div>
                    </div>
                </Label>
                ))}
            </RadioGroup>
            </CardContent>
        </Card>

        <div className="fixed bottom-20 left-6 right-6">
          <Button onClick={handleCreatePayment} disabled={loading} className="w-full" size="lg">
            {loading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
            {loading ? 'Memproses...' : `Bayar Sekarang (${formatCurrency(price)})`}
          </Button>
        </div>
      </div>
    </div>
  );
}