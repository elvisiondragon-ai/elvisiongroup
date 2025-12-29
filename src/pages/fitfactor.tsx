import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from '@/components/ui/select'; // Import Select components
import Adress from '@/components/adress';
import fitfactorImage from '@/assets/fitfactor.jpg';
import qrisBcaImage from '@/assets/qrisbca.jpeg';
import { ArrowLeft, Copy, CreditCard, User, Mail, Phone, Home, Plus, Minus } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Toaster } from '@/components/ui/toaster';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { usePro } from '@/hooks/usePro';

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

export default function FitfactorPaymentPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut, cleanupSupabase } = useAuth();
  const { proStatus } = usePro();
  const whatsappLink = "https://wa.me/62895325633487";

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isIOSStandalone = ('standalone' in window.navigator) && (window.navigator as any).standalone;

  const handleLogout = async () => {
    try {
      localStorage.setItem('manual-logout-flag', 'true');
      if (isIOS && isIOSStandalone) {
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
            console.log('Service worker unregistered for iOS PWA logout');
          }
        }
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
          console.log('All caches cleared for iOS PWA logout');
        }
      }
      await cleanupSupabase();
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) {
        console.error('Logout error:', error);
        toast({
          title: "Logout Error - Refreshing",
          description: "Refreshing page to complete logout...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.replace('/auth');
        }, 1000);
        return;
      }
      toast({
        title: "Berhasil Logout",
        description: "Anda berhasil keluar dari akun.",
      });
      setTimeout(() => {
        window.location.reload();
        window.location.replace('/auth');
      }, 1000);
    } catch (error: any) {
      console.error('Unexpected logout error:', error);
      toast({
        title: "Logout Error - Refreshing",
        description: "Refreshing page to complete logout...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };


  const productId = 'fitfactor_450k';
  const productName = 'Fitfactor';
  const price = 450000;

  const [quantity, setQuantity] = useState(1);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [kota, setKota] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kodePos, setKodePos] = useState('');

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('QRIS');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);

  useEffect(() => {
    if (user) {
      setUserName(user.user_metadata.full_name || '');
      setUserEmail(user.email || '');
    }
  }, [user]);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(1, prev - 1));
  const totalAmount = price * quantity;

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
    if (!userName || !userEmail || !phoneNumber || !userAddress || !selectedProvince || !kota || !kecamatan || !kodePos || !selectedPaymentMethod) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon lengkapi semua informasi: nama, email, telepon, alamat, provinsi, kota, kecamatan, dan kode pos.",
        variant: "destructive",
      });
      return;
    }

    const fullAddress = `${userAddress}, ${kecamatan}, ${kota}, ${selectedProvince}, ${kodePos}`;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('tripay-create-payment', {
        body: {
          subscriptionType: 'fitfactor',
          paymentMethod: selectedPaymentMethod,
          userName: userName,
          userEmail: userEmail,
          phoneNumber: phoneNumber,
          address: fullAddress,
          province: selectedProvince,
          kota: kota,
          kecamatan: kecamatan,
          kodePos: kodePos,
          amount: totalAmount,
          quantity: quantity,
          productName: productName,
          userId: user?.id,
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
    
    const tableName = 'global_product';
    const channel = supabase
      .channel(`payment-status-fitfactor-${paymentData.tripay_reference}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: tableName, filter: `tripay_reference=eq.${paymentData.tripay_reference}`},
        (payload) => {
          if (payload.new?.status === 'PAID') {
            toast({
                title: "🎉 Pembayaran Berhasil!",
                description: "Terima kasih, pembayaran Anda telah kami terima. Silakan hubungi CS untuk konfirmasi.",
                duration: 0, 
                action: (() => {
                      const message = `Halo kak, saya sudah bayar untuk pesanan Fitfactor.\n\n` + 
                                      `Detail Pembayaran:\n` + 
                                      `- Nama: ${userName}\n` + 
                                      `- Email: ${userEmail}\n` + 
                                      `- Telepon: ${phoneNumber}\n` + 
                                      `- Alamat: ${userAddress}, ${kecamatan}, ${kota}, ${selectedProvince}, ${kodePos}\n` + 
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
                    })(),
            });
          }
        }
      ).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [showPaymentInstructions, paymentData?.tripay_reference, navigate, toast, userName, userEmail, phoneNumber, userAddress, selectedProvince, productName, quantity, totalAmount, selectedPaymentMethod]);

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
                <div className="text-center my-4">
                  <h3 className="text-lg font-semibold">Gabung Subscription dan dapatkan diskon 30%++</h3>
                  <Card className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black p-3 rounded-md text-center cursor-pointer" onClick={() => navigate('/whatispro')}>
                        <p className="font-bold">eL Vision Subscription diskon 30-50% sepanjang tahun</p>
                  </Card>
                </div>
                <Card>            <CardHeader>
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
                      href={`https://wa.me/62895325633487?text=${encodeURIComponent(`Halo kak, saya sudah melakukan transfer manual BCA untuk pesanan Fitfactor.<br/><br/>` + 
`Detail Pembayaran:<br/>` + 
`- Nama: ${userName}<br/>` + 
`- Email: ${userEmail}<br/>` + 
`- Telepon: ${phoneNumber}<br/>` + 
`- Alamat: ${userAddress}, ${kecamatan}, ${kota}, ${selectedProvince}, ${kodePos}<br/>` + 
`- Produk: ${productName} (${quantity} unit)<br/>` + 
`- Total: ${formatCurrency(totalAmount)}<br/>` + 
`- Metode: Manual Transfer BCA<br/>` + 
`- Ref TriPay: ${paymentData?.tripay_reference || 'N/A'}<br/>` + 
`- Status: UNPAID (Menunggu Konfirmasi)<br/>` + 
`${paymentData?.payCode ? `- VA/Kode Bayar: ${paymentData.payCode}<br/>` : ''}` + 
`${paymentData?.qrUrl ? `- QR Code: ${paymentData.qrUrl}<br/>` : ''}` + 
`Mohon konfirmasi pesanan saya. Terima kasih.`)}
`}
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
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent">
                    Checkout Fitfactor
                </h1>
            </div>
            {user ? (
                <Button variant="outline" onClick={handleLogout}>Logout</Button>
            ) : (
                <Button variant="outline" onClick={() => navigate('/auth?redirect=/fitfactor')}>Login</Button>
            )}
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
            <div className="flex justify-center my-4">
              <img src={fitfactorImage} alt="Fitfactor Product" className="w-48 h-48 object-contain" />
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
            <Adress
              selectedProvince={selectedProvince}
              setSelectedProvince={setSelectedProvince}
              userAddress={userAddress}
              setUserAddress={setUserAddress}
              kota={kota}
              setKota={setKota}
              kecamatan={kecamatan}
              setKecamatan={setKecamatan}
              kodePos={kodePos}
              setKodePos={setKodePos}
            />
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
