import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Copy, CreditCard, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; // Assuming this hook exists in elvisiongroup
import { supabase } from '@/integrations/supabase/client'; // Assuming this path for supabase client
import { Toaster } from '@/components/ui/toaster'; // Assuming this component exists

export default function DrelfPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const queryParams = new URLSearchParams(location.search);

  // Extract payment details from URL parameters
  const productId = queryParams.get('productId') || 'drelf_collagen_ultimate';
  const productName = queryParams.get('productName') || 'Drelf Collagen Ultimate';
  const price = parseInt(queryParams.get('price') || '600000', 10);
  const initialPaymentMethod = queryParams.get('paymentMethod') || 'QRIS';
  const userName = queryParams.get('userName') || '';
  const userEmail = queryParams.get('userEmail') || '';
  const phoneNumber = queryParams.get('phoneNumber') || '';
  const address = queryParams.get('address') || ''; // New: Extract address from URL

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(initialPaymentMethod);
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  const [showQrisModal, setShowQrisModal] = useState(false); // For QRIS video tutorial
  const [userAddress, setUserAddress] = useState(address); // New: State for user address

  // Simulate available payment methods for display in elvisiongroup
  const paymentMethods = [
    { code: 'QRIS', name: 'QRIS', description: 'QRIS Bayar ke Semua Bank Termasuk DANA, OVO, SHOPEEPAY' },
    { code: 'BCAVA', name: 'BCA Virtual Account', description: 'Transfer via BCA Virtual Account' },
    // Add other relevant payment methods from elvisiongroup's Payment.tsx if needed
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Function to copy VA number or reference to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Berhasil Disalin",
      description: "Teks telah disalin ke clipboard",
    });
  };

  const handleCreatePayment = async () => {
    // Input validation
    if (!selectedPaymentMethod) {
      toast({
        title: "Error",
        description: "Silakan pilih metode pembayaran.",
        variant: "destructive",
      });
      return;
    }
    if (!userName || !userEmail || !phoneNumber || !userAddress) { // Added userAddress to validation
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon lengkapi nama lengkap, email, nomor telepon, dan alamat.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    try {
      console.log('💳 Attempting payment creation for Drelf product:', productId);
      const { data, error } = await supabase.functions.invoke('tripay-create-payment', { // Using elvisiongroup's function
        body: {
          subscriptionType: productId,
          paymentMethod: selectedPaymentMethod,
          userName: userName,
          userEmail: userEmail,
          phoneNumber: phoneNumber,
          address: userAddress, // Include address in the payload
          amount: price // Pass amount explicitly for elvisiongroup's backend to decide
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        setPaymentData(data);
        setShowPaymentInstructions(true);
        toast({
          title: "Pembayaran Berhasil Dibuat",
          description: "Silakan selesaikan pembayaran.",
        });
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

  // Real-time payment status listener for global_product table (if elvisiongroup uses it)
  // Or pro_subscriptions if it maps drelf to a subscription
  useEffect(() => {
    if (!showPaymentInstructions || !paymentData?.tripay_reference) return;

    // Assuming elvisiongroup.com also tracks payments in a table like 'global_product' or 'pro_subscriptions'
    const tableName = 'global_product'; // or 'pro_subscriptions' if drelf maps to a subscription
    console.log(`🔔 Setting up realtime subscription for ${tableName} reference:`, paymentData.tripay_reference);

    const channel = supabase
      .channel(`payment-status-drelf-${paymentData.tripay_reference}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: tableName,
          filter: `tripay_reference=eq.${paymentData.tripay_reference}`
        },
        (payload) => {
          console.log(`💰 Payment status change received for ${tableName}:`, payload);
          if (payload.new?.status === 'PAID' || payload.new?.status === 'SUCCESS' || payload.new?.status === 'active') {
            console.log('🎉 Payment completed! Redirecting to success page...');
            navigate('/drelf/success', { state: { paymentDetails: payload.new } }); // Redirect to a success page within elvisiongroup
          }
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Subscribed to real-time payment updates for ${tableName}`, paymentData.tripay_reference);
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Realtime subscription error:', err);
          toast({
            title: "Connection Error",
            description: "Could not listen for payment updates. Please refresh.",
            variant: "destructive",
          });
        }
      });

    return () => {
      console.log('🧹 Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [showPaymentInstructions, paymentData?.tripay_reference, navigate, toast]);


  // Display payment instructions or the initial form
  if (showPaymentInstructions && paymentData) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Toaster />
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
              <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent">
                Instruksi Pembayaran Drelf
              </h1>
              <p className="text-sm text-muted-foreground">Selesaikan pembayaran untuk produk Drelf</p>
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
              {/* Styling adapted from elvisiongroup's Payment.tsx */}
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
              {/* Dialog for QRIS tutorial would go here */}
            </div>
          )}

          {/* QR Code */}
          {(paymentData?.qrUrl || paymentData?.paymentMethod === 'QRIS') && (
            <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 shadow-xl overflow-hidden relative">
              {/* Styling adapted from elvisiongroup's Payment.tsx */}
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
                  <span className="text-xs text-muted-foreground block">Produk</span>
                  <span className="font-medium text-sm break-all">{productName}</span>
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
              <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                Kembali ke Beranda
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Initial form for payment details
  return (
    <div className="min-h-screen bg-background pb-32">
      <Toaster />
      <div className="p-6 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/checkout')} // Go back to drelf's checkout
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent">
            Detail Pembayaran Drelf
          </h1>
        </div>
      </div>

      <div className="px-6 space-y-6">
        <Card className="p-6 space-y-4">
          <CardTitle>Rangkuman Pesanan</CardTitle>
          <Separator />
          <div className="flex justify-between">
            <Label className="text-muted-foreground">Produk</Label>
            <span className="font-medium">{productName}</span>
          </div>
          <div className="flex justify-between">
            <Label className="text-muted-foreground">Harga</Label>
            <span className="font-bold text-lg">{formatCurrency(price)}</span>
          </div>
        </Card>

        {/* User Information from Drelf App */}
        <Card className="p-6 space-y-4">
          <CardTitle>Informasi Kontak Anda</CardTitle>
          <Separator />
          <div>
            <Label>Nama Lengkap</Label>
            <Input value={userName} disabled className="bg-muted/50" />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={userEmail} disabled className="bg-muted/50" />
          </div>
          <div>
            <Label>Nomor Telepon</Label>
            <Input value={phoneNumber} disabled className="bg-muted/50" />
          </div>
          <div> {/* New: Address Input */}
            <Label htmlFor="userAddress">Alamat Pengiriman</Label>
            <Input
              id="userAddress"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              placeholder="Masukkan alamat lengkap Anda"
              required
            />
          </div>
        </Card>

        {/* Payment Method Selection */}
        <Card className="p-6 space-y-4">
          <CardTitle>Pilih Metode Pembayaran</CardTitle>
          <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="space-y-2">
            {paymentMethods.map((method) => (
              <div key={method.code} className="flex items-center space-x-3">
                <RadioGroupItem value={method.code} id={method.code} />
                <Label htmlFor={method.code} className="flex-1 cursor-pointer">
                  <div className={`flex flex-col p-3 rounded-lg transition-all duration-300 ${
                    selectedPaymentMethod === method.code
                      ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/50 shadow-lg'
                      : 'hover:bg-muted/20'
                  }`}>
                    <span className="font-medium text-sm">{method.name}</span>
                    <span className="text-xs text-muted-foreground">{method.description}</span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </Card>

        <div className="fixed bottom-20 left-6 right-6">
          <Button
            onClick={handleCreatePayment}
            disabled={loading || !selectedPaymentMethod}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <CreditCard className="w-4 h-4 mr-2" />
            )}
            {loading ? 'Membuat Pembayaran...' : 'Lanjutkan Pembayaran'}
          </Button>
        </div>
      </div>
    </div>
  );
}

