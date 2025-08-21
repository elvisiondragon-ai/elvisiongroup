import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CreditCard, Calendar, Phone, User, Mail, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TripaySubscriptionProps {
  user: any;
  userProfile: any;
  onClose: () => void;
}

export function TripaySubscription({ user, userProfile, onClose }: TripaySubscriptionProps) {
  const [selectedPlan, setSelectedPlan] = useState('1_month');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('BCAVA');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState(userProfile?.display_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  const { toast } = useToast();

  const paymentMethods = [
    {
      code: 'BCAVA',
      name: 'BCA Virtual Account',
      description: 'Transfer via BCA Virtual Account'
    },
    {
      code: 'QRIS_SHOPEEPAY',
      name: 'QRIS ShopeePay',
      description: 'Bayar dengan QRIS ShopeePay'
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
      name: 'Berlangganan 1 Tahun',
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

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('is_active', true)
          .order('price', { ascending: false });
        
        if (data && !error) {
          const formattedPlans = data.map(plan => ({
            id: plan.id,
            name: plan.name,
            description: plan.description,
            price: plan.price,
            currency: plan.currency,
            paymentMethodCode: plan.payment_method_code,
            paymentMethod: plan.payment_method,
            duration: `${plan.duration_days} ${plan.duration_days === 1 ? 'hari' : 'hari'}`,
            durationDays: plan.duration_days
          }));
          setSubscriptionPlans(formattedPlans);
        }
      } catch (error) {
        console.error('Error fetching subscription plans:', error);
      }
    };

    fetchPlans();
  }, []);

  const handleCreatePayment = async () => {
    if (!user || !selectedPlan || !phoneNumber.trim() || !fullName.trim()) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon lengkapi nama lengkap dan nomor telepon",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const plan = subscriptionPlans.find(p => p.id === selectedPlan);
      if (!plan) throw new Error('Plan not found');

      const { data, error } = await supabase.functions.invoke('tripay-create-payment', {
        body: {
          subscriptionType: plan.id,
          paymentMethod: selectedPaymentMethod,
          userName: fullName,
          userEmail: email,
          phoneNumber: phoneNumber,
          paymentFlow: 'direct'
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        // Frontend logic: Show payment details in app
        if (data.payCode) {
          // Show VA number in app
          setPaymentData(data);
          setShowPaymentInstructions(true);
          toast({
            title: "Pembayaran Berhasil Dibuat",
            description: "Silakan selesaikan pembayaran menggunakan Virtual Account",
          });
        } else if (data.qrUrl) {
          // Show QR code in app  
          setPaymentData(data);
          setShowPaymentInstructions(true);
          toast({
            title: "Pembayaran Berhasil Dibuat", 
            description: "Silakan scan QR Code untuk menyelesaikan pembayaran",
          });
        } else {
          // Show general payment instructions
          setPaymentData(data);
          setShowPaymentInstructions(true);
          toast({
            title: "Pembayaran Berhasil Dibuat",
            description: "Silakan ikuti instruksi pembayaran",
          });
        }
        // Don't use data.checkoutUrl for redirect
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

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-full max-w-md mx-4 h-[50vh] bg-background border rounded-lg shadow-lg flex flex-col">
        {showPaymentInstructions ? (
          // Modern Premium Payment Instructions View
          <>
            <div className="flex items-center gap-4 p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPaymentInstructions(false)}
                className="hover:bg-primary/10"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Instruksi Pembayaran</h1>
                <p className="text-sm text-muted-foreground">Selesaikan pembayaran untuk mengaktifkan langganan</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex justify-center">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Menunggu Pembayaran
                  </div>
                </div>

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
                        <span className="font-mono text-sm font-medium">{paymentData?.reference}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">Metode</span>
                        <span className="text-sm font-medium">{paymentData?.paymentMethod}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-xs text-muted-foreground block">Berlaku Hingga</span>
                        <span className="text-sm font-medium text-orange-600">
                          {new Date(paymentData?.expiredTime * 1000).toLocaleString('id-ID', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Virtual Account Number */}
                {paymentData?.payCode && (
                  <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-lg">
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="flex items-center justify-center gap-2 text-blue-700">
                        <CreditCard className="w-5 h-5" />
                        Virtual Account {paymentData?.paymentMethod}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <div className="bg-white border-2 border-dashed border-blue-300 p-4 rounded-xl">
                        <p className="font-mono text-2xl font-bold text-blue-800 tracking-wider">
                          {paymentData.payCode}
                        </p>
                      </div>
                      <p className="text-sm text-blue-600 font-medium">
                        Salin nomor di atas untuk melakukan transfer
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyToClipboard(paymentData.payCode)}
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Salin Nomor VA
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* QR Code */}
                {paymentData?.qrUrl && (
                  <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100/50 shadow-lg">
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="flex items-center justify-center gap-2 text-green-700">
                        📱 QR Code Payment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <div className="bg-white p-6 rounded-xl border-2 border-dashed border-green-300 inline-block">
                        <img src={paymentData.qrUrl} alt="QR Code" className="w-40 h-40 mx-auto" />
                      </div>
                      <p className="text-sm text-green-600 font-medium">
                        Scan QR Code dengan aplikasi e-wallet Anda
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Payment Instructions */}
                {paymentData?.instructions && paymentData.instructions.length > 0 && (
                  <Card className="border-2 border-purple-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-purple-700">
                        📋 Cara Pembayaran
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {paymentData.instructions.map((instructionGroup: any, groupIndex: number) => (
                        <div key={groupIndex} className="space-y-3">
                          <h4 className="font-semibold text-purple-600">{instructionGroup.title}</h4>
                          <div className="space-y-2 pl-4">
                            {instructionGroup.steps.map((step: string, stepIndex: number) => (
                              <div key={stepIndex} className="flex gap-3 items-start">
                                <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full text-xs flex items-center justify-center font-medium">
                                  {stepIndex + 1}
                                </span>
                                <p className="text-sm leading-relaxed">{step.replace(/<[^>]*>/g, '')}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <div className="p-6 border-t bg-gradient-to-r from-muted/50 to-muted/30">
              <div className="space-y-3">
                <p className="text-center text-sm text-muted-foreground">
                  Pembayaran akan diverifikasi otomatis dalam 1-5 menit
                </p>
                <Button onClick={onClose} variant="outline" className="w-full">
                  Tutup & Bayar Nanti
                </Button>
              </div>
            </div>
          </>
        ) : (
          // Original Payment Form View
          <>
            <div className="flex items-center gap-4 p-4 border-b">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-semibold">Paket Berlangganan</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6">
                {/* User Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Informasi Pengguna
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="fullName" className="text-xs text-muted-foreground">Nama Lengkap</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Masukkan nama lengkap"
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
                          placeholder="email@contoh.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
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
                          placeholder="08123456789"
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
                                <h3 className="font-medium text-sm">{plan.name}</h3>
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
            </div>

            <div className="p-4 border-t">
              <Button 
                onClick={handleCreatePayment}
                disabled={loading || !selectedPlan || !phoneNumber.trim() || !fullName.trim()}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <CreditCard className="w-4 h-4 mr-2" />
                )}
                {loading ? 'Membuat Pembayaran...' : 'Buat Pembayaran'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}