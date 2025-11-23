import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from '@/components/ui/select'; // Import Select components
import devImage from '@/assets/dev.ico';
import qrisBcaImage from '@/assets/qrisbca.jpeg';
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

export default function DevPaymentPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const whatsappLink = "https://wa.me/62895325633487";

  const baseProductName = 'Dev Service';
  const variants = {
    'UI Display': 1600000,
    'Backend Integration': 3000000,
    'Maintenance 6 Bulan': 10000000,
  };

  const [quantities, setQuantities] = useState({
    'UI Display': 1,
    'Backend Integration': 0,
    'Maintenance 6 Bulan': 0,
  });

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('QRIS');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);

  const handleQuantityChange = (variant, change) => {
    setQuantities(prev => ({
      ...prev,
      [variant]: Math.max(0, prev[variant] + change)
    }));
  };

  const totalAmount = Object.entries(quantities).reduce((acc, [variant, quantity]) => {
    return acc + (variants[variant] * quantity);
  }, 0);

  const totalQuantity = Object.values(quantities).reduce((acc, quantity) => acc + quantity, 0);

  const productName = Object.entries(quantities)
    .filter(([, quantity]) => quantity > 0)
    .map(([variant, quantity]) => `${baseProductName} - ${variant} (x${quantity})`)
    .join(', ');

  useEffect(() => {
    if (totalAmount > 5000000) {
      setSelectedPaymentMethod('BCA_MANUAL');
      toast({
        title: "Pemberitahuan",
        description: "Diatas 5 Juta hanya manual Bca, atau silahkan hubungi CS",
        variant: "destructive",
      });
    }
  }, [totalAmount, toast]);


  const paymentMethods = [
    { code: 'BCA_MANUAL', name: 'Manual Transfer BCA', description: '' },
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
    if (!userName || !userEmail || !phoneNumber || !selectedPaymentMethod) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon lengkapi semua informasi: nama, email, telepon, dan metode pembayaran.",
        variant: "destructive",
      });
      return;
    }

    const fullAddress = ''; // Address not required for digital product

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('tripay-public-payment', {
        body: {
          subscriptionType: 'dev',
          paymentMethod: selectedPaymentMethod,
          userName: userName,
          userEmail: userEmail,
          phoneNumber: phoneNumber,
          address: null, // Digital product, no physical address
          province: null,
          kota: null,
          kecamatan: null,
          kodePos: null,
          amount: totalAmount,
          quantity: totalQuantity,
          productName: productName,
        }
      });

      if (error || !data?.success) {
        if (selectedPaymentMethod === 'BCA_MANUAL') {
          setPaymentData({
            paymentMethod: selectedPaymentMethod,
            amount: totalAmount,
            status: 'UNPAID',
            tripay_reference: `MANUAL-${Date.now()}`, // Provide a dummy reference
          });
          setShowPaymentInstructions(true);
          toast({
            title: "Instruksi Pembayaran Manual",
            description: "Silakan lanjutkan dengan transfer manual BCA.",
          });
          return;
        } else {
          toast({
            title: "Error Membuat Pembayaran",
            description: data?.error || error?.message || "Gagal membuat pembayaran. Silakan coba lagi.",
            variant: "destructive",
          });
          return;
        }
      }

      if (data?.success) {
        setPaymentData(data);
        setShowPaymentInstructions(true);
        toast({
          title: "Pembayaran Berhasil Dibuat",
          description: "Silakan selesaikan pembayaran.",
        });
      }
    } catch (error: any) {
      console.error('Tripay payment error:', error);
      if (selectedPaymentMethod === 'BCA_MANUAL') {
        setPaymentData({
          paymentMethod: selectedPaymentMethod,
          amount: totalAmount,
          status: 'UNPAID',
          tripay_reference: `MANUAL-${Date.now()}`, // Provide a dummy reference
        });
        setShowPaymentInstructions(true);
        toast({
          title: "Instruksi Pembayaran Manual",
          description: "Silakan lanjutkan dengan transfer manual BCA.",
        });
      } else {
        toast({
          title: "Error Kritis",
          description: "Gagal memanggil fungsi pembayaran. Periksa konsol untuk detail.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showPaymentInstructions || !paymentData?.tripay_reference) return;
    
    const tableName = 'waiting_payment';
    const channel = supabase
      .channel(`payment-status-dev-${paymentData.tripay_reference}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: tableName, filter: `tripay_reference=eq.${paymentData.tripay_reference}`},
        (payload) => {
          if (payload.new?.status === 'paid') {
            toast({
                title: "🎉 Pembayaran Berhasil!",
                description: "Terima kasih, pembayaran Anda telah kami terima.",
                duration: 0, 
            });
          }
        }
      ).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [showPaymentInstructions, paymentData?.tripay_reference, navigate, toast, userName, userEmail, phoneNumber, productName, totalAmount, selectedPaymentMethod]);

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
                          </div>              {paymentData.paymentMethod !== 'BCA_MANUAL' && (
                <div className="flex justify-between items-center">
                  <Label className="text-muted-foreground">Batas Pembayaran</Label>
                  <span className="font-medium">
                    {new Date(paymentData.expiredTime * 1000).toLocaleString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {paymentData.paymentMethod === 'BCA_MANUAL' && (
            <Card>
              <CardHeader>
                <CardTitle>Transfer Manual BCA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Nomor Rekening</Label>
                  <div className="flex items-center justify-between bg-secondary p-3 rounded-md">
                    <span className="font-mono text-lg">7751146578</span>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard('7751146578')}>
                      <Copy className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Atas Nama</Label>
                  <div className="flex items-center justify-between bg-secondary p-3 rounded-md">
                    <span className="font-medium">Delia Mutia</span>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard('Delia Mutia')}>
                      <Copy className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <img src={qrisBcaImage} alt="QRIS BCA" className="w-64 h-64 border rounded-lg" />
                </div>
                {paymentData.paymentMethod === 'BCA_MANUAL' && paymentData.status === 'UNPAID' && (
                  <div className="my-12">
                    <a
                      href={`https://wa.me/62895325633487?text=${encodeURIComponent(`Halo kak, saya sudah melakukan transfer manual BCA untuk pesanan Dev.<br/><br/>` + 
`Detail Pembayaran:<br/>` + 
`- Nama: ${userName}<br/>` + 
`- Email: ${userEmail}<br/>` + 
`- Telepon: ${phoneNumber}<br/>` + 
`- Produk: ${productName}<br/>` + 
`- Total: ${formatCurrency(totalAmount)}<br/>` + 
`- Metode: Manual Transfer BCA<br/>` + 
`- Ref TriPay: ${paymentData?.tripay_reference || 'N/A'}<br/>` + 
`- Status: UNPAID (Menunggu Konfirmasi)<br/>` + 
`${paymentData?.payCode ? `- VA/Kode Bayar: ${paymentData.payCode}<br/>` : ''}` + 
`${paymentData?.qrUrl ? `- QR Code: ${paymentData.qrUrl}<br/>` : ''}` + 
`Mohon konfirmasi pesanan saya. Terima kasih.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white" size="lg">
                        <FaWhatsapp className="mr-2" /> Hubungi CS jika sudah bayar
                      </Button>
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

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
                        <li key={stepIndex} className="text-muted-foreground"><span dangerouslySetInnerHTML={{ __html: step }} /></li>
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
            Checkout Dev
          </h1>
        </div>
      </div>

      <div className="px-6 space-y-6">
        <Card>
          <CardHeader><CardTitle>1. Rangkuman Pesanan</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-muted-foreground">Produk</Label>
              <span className="font-medium">{baseProductName}</span>
            </div>
            <div className="flex justify-center my-4">
              <img src={devImage} alt="Dev Product" className="w-48 h-48 object-contain" />
            </div>

            <Separator/>
            
            <div className="space-y-4">
              {Object.entries(variants).map(([variantName, variantPrice]) => (
                <div key={variantName} className="flex justify-between items-center">
                  <div>
                    <Label htmlFor={`quantity-${variantName}`} className="text-muted-foreground">{variantName}</Label>
                    <p className="text-xs text-muted-foreground">{formatCurrency(variantPrice)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(variantName, -1)}>
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-bold text-lg w-10 text-center">{quantities[variantName]}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(variantName, 1)}>
                        <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Separator/>
            
            <div className="flex justify-between items-center">
              <Label className="text-muted-foreground">Total Harga</Label>
              <span className="font-bold text-lg text-primary">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-green-600 font-bold">
              <Label className="text-green-600">Ongkos Kirim</Label>
              <span>FREE ONGKIR</span>
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

          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>3. Metode Pembayaran</CardTitle></CardHeader>
            <CardContent>
            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="space-y-3">
                {paymentMethods.map((method) => (
                <Label key={method.code} htmlFor={method.code} className={`flex flex-col p-4 rounded-lg border cursor-pointer transition-all ${selectedPaymentMethod === method.code ? 'border-primary shadow-lg' : 'border-border'}`}>
                    <div className="flex items-center space-x-3">
                        <RadioGroupItem value={method.code} id={method.code} disabled={totalAmount > 5000000 && method.code !== 'BCA_MANUAL'} />
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
