import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Copy, CreditCard, User, Mail, Phone, Home, Plus, Minus } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Toaster } from '@/components/ui/toaster';
import { Separator } from '@/components/ui/separator';

const WhatsAppButton = () => (
  <a
    href="https://wa.me/62895325633487"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-24 right-5 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110"
    aria-label="Contact via WhatsApp"
  >
    <FaWhatsapp size={28} />
  </a>
);

export default function DrelfPaymentPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const whatsappLink = "https://wa.me/62895325633487";

  const productId = 'drelf_collagen_1x_600k';
  const productName = 'Drelf Collagen';
  const price = 600000;

  const [quantity, setQuantity] = useState(1);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('QRIS');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(1, prev - 1));
  const totalAmount = price * quantity;

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
      // As per new user instruction, send the client-calculated total amount directly.
      const { data, error } = await supabase.functions.invoke('tripay-public-payment', {
        body: {
          subscriptionType: 'drelf', // Set subscriptionType to 'drelf'
          paymentMethod: selectedPaymentMethod,
          userName: userName,
          userEmail: userEmail,
          phoneNumber: phoneNumber,
          address: userAddress,
          amount: totalAmount, // Send the final calculated amount
          quantity: quantity, // Add quantity to the request body
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

  useEffect(() => {
    if (!showPaymentInstructions || !paymentData?.tripay_reference) return;
    
    const tableName = 'global_product';
    const channel = supabase
      .channel(`payment-status-drelf-${paymentData.tripay_reference}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: tableName, filter: `tripay_reference=eq.${paymentData.tripay_reference}`},
        (payload) => {
          if (payload.new?.status === 'PAID') {
            toast({
                title: "🎉 Pembayaran Berhasil!",
                description: "Terima kasih, pembayaran Anda telah kami terima. Silakan Refresh atau hubungi CS untuk konfirmasi.",
                duration: 0, // Don't auto-dismiss
                action: (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        console.log('🔄 User clicked refresh after payment success');
                        window.location.reload();
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors w-full"
                    >
                      🔄 Refresh Halaman!
                    </button>
                    {(() => {
                      const message = `Halo kak, saya sudah bayar untuk pesanan Drelf Collagen.\n\n` +
                                      `Detail Pembayaran:\n` +
                                      `- Nama: ${userName}\n` +
                                      `- Email: ${userEmail}\n` +
                                      `- Telepon: ${phoneNumber}\n` +
                                      `- Alamat: ${userAddress}\n` +
                                      `- Produk: ${productName} (${quantity} unit)\n` +
                                      `- Total: ${formatCurrency(totalAmount)}\n` +
                                      `- Metode: ${selectedPaymentMethod}\n` +
                                      `- Ref TriPay: ${paymentData?.tripay_reference || 'N/A'}\n` +
                                      `- Status: PAID\n` +
                                      `${paymentData?.payCode ? `- VA/Kode Bayar: ${paymentData.payCode}\n` : ''}` +
                                      `${paymentData?.qrUrl ? `- QR Code: ${paymentData.qrUrl}\n` : ''}` +
                                      `Mohon konfirmasi pesanan saya. Terima kasih.`;
                      const encodedMessage = encodeURIComponent(message);
                      const whatsappHref = `https://wa.me/62895325633487?text=${encodedMessage}`;

                      return (
                        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="w-full">
                          <Button variant="outline" className="bg-green-500 hover:bg-green-600 text-white w-full">
                            <FaWhatsapp className="mr-2" /> Hubungi CS
                          </Button>
                        </a>
                      );
                    })()}
                  </div>
                ),
            });
            setTimeout(() => navigate('/'), 5000); 
          }
        }
      ).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [showPaymentInstructions, paymentData?.tripay_reference, navigate, toast, userName, userEmail, phoneNumber, userAddress, productName, quantity, totalAmount, selectedPaymentMethod]);

  if (showPaymentInstructions && paymentData) {
    return (
      <div className="min-h-screen bg-background pb-32">
        <Toaster />
        <div className="p-6 pb-4">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => setShowPaymentInstructions(false)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent">
              Instruksi Pembayaran
            </h1>
          </div>
        </div>

        <div className="px-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detail Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Status</Label>
                <span className={`font-medium ${paymentData.status === 'UNPAID' ? 'text-orange-500' : 'text-green-500'}`}>
                  {paymentData.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Metode Pembayaran</Label>
                <span className="font-medium">{paymentData.paymentMethod}</span>
              </div>
                          <div className="flex justify-between items-center">
                            <Label className="text-muted-foreground">Total Pembayaran</Label>
                            <span className="font-bold text-lg text-primary">{formatCurrency(paymentData.amount)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <Label className="text-muted-foreground">Tripay Reference</Label>
                            <span className="font-medium">{paymentData.tripay_reference}</span>
                          </div>              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Batas Pembayaran</Label>
                <span className="font-medium">
                  {new Date(paymentData.expiredTime * 1000).toLocaleString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
            </CardContent>
          </Card>

          {paymentData.payCode && (
            <Card>
              <CardHeader>
                <CardTitle>Nomor Virtual Account / Kode Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between bg-secondary p-3 rounded-md">
                  <span className="font-mono text-lg">{paymentData.payCode}</span>
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(paymentData.payCode)}>
                    <Copy className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {paymentData.qrUrl && (
            <Card>
              <CardHeader>
                <CardTitle>QR Code</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <img src={paymentData.qrUrl} alt="QR Code" className="w-64 h-64 border rounded-lg" />
              </CardContent>
            </Card>
          )}

          {paymentData.checkoutUrl && paymentData.paymentType === 'REDIRECT' && (
            <div className="fixed bottom-20 left-6 right-6">
              <Button onClick={() => window.open(paymentData.checkoutUrl, '_blank')} className="w-full" size="lg">
                <CreditCard className="w-4 h-4 mr-2" /> Lanjutkan Pembayaran
              </Button>
            </div>
          )}

          {paymentData.instructions && paymentData.instructions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Cara Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentData.instructions.map((instructionGroup: any, index: number) => (
                  <div key={index}>
                    <h3 className="font-semibold mb-2">{instructionGroup.title}</h3>
                    <ol className="list-decimal list-inside space-y-1">
                      {instructionGroup.steps.map((step: string, stepIndex: number) => (
                        <li key={stepIndex} className="text-muted-foreground">{step}</li>
                      ))}
                    </ol>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <Toaster />
      <WhatsAppButton />
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
          <CardHeader>
            <CardTitle>1. Rangkuman Pesanan</CardTitle>
            </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-muted-foreground">Produk</Label>
              <span className="font-medium">{productName}</span>
            </div>

            <Separator/>
            
            <div className="flex justify-between items-center">
              <Label htmlFor="quantity" className="text-muted-foreground">Kuantitas</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleDecrement}>
                    <Minus className="h-4 w-4" />
                </Button>
                <span className="font-bold text-lg w-10 text-center">{quantity}</span>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleIncrement}>
                    <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded-md text-center">
                <p className="font-bold">Promo: Beli 3 Dikirim 4!</p>
            </div>

            <Separator/>
            
            <div className="flex justify-between items-center">
              <Label className="text-muted-foreground">Total Harga</Label>
              <span className="font-bold text-lg text-primary">{formatCurrency(totalAmount)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Other cards (Informasi Pengiriman, Metode Pembayaran) remain the same */}
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
            {loading ? 'Memproses...' : `Bayar Sekarang (${formatCurrency(totalAmount)})`}
          </Button>
        </div>
      </div>
    </div>
  );
}