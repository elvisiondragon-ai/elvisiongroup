import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CreditCard, Calendar, Phone, User, Mail, Copy, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PaymentProps {
  onNavigate: (tab: string) => void;
}

export function Payment({ onNavigate }: PaymentProps) {
  const [selectedPlan, setSelectedPlan] = useState('1_month');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('BCAVA');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();

  const paymentMethods = [
    {
      code: 'BCAVA',
      name: 'BCA Virtual Account',
      description: 'Transfer via BCA Virtual Account'
    },
    {
      code: 'QRIS',
      name: 'QRIS',
      description: 'Bayar dengan QRIS'
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

  useEffect(() => {
    const initializeData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        setEmail(user.email || '');
        
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        setUserProfile(profile);
        if (profile?.display_name) {
          setFullName(profile.display_name);
        }
      }

      // Fetch subscription plans
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
    };

    initializeData();
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

        <div className="px-6 space-y-6">
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
                  <span className="font-mono text-sm font-medium">{paymentData?.tripay_reference}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Metode</span>
                  <span className="text-sm font-medium">{paymentData?.paymentMethod}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-muted-foreground block">Berlaku Hingga</span>
                  <span className="text-sm font-medium text-orange-600">
                    {paymentData?.expires_at 
                      ? new Date(paymentData.expires_at * 1000).toLocaleString('id-ID', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })
                      : 'N/A'
                    }
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
                <div className="bg-white border-2 border-dashed border-blue-300 p-6 rounded-xl">
                  <p className="font-mono text-4xl font-bold text-blue-800 tracking-wider mb-2">
                    {paymentData.payCode}
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    Nomor Virtual Account
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
                  📱 QR Code QRIS
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="bg-white p-6 rounded-xl border-2 border-dashed border-green-300 inline-block">
                  <img 
                    src={paymentData.qrUrl || paymentData.qr_url} 
                    alt="QR Code QRIS" 
                    className="w-48 h-48 mx-auto" 
                    onError={(e) => {
                      console.error('QR Image failed to load:', paymentData.qrUrl || paymentData.qr_url);
                    }}
                  />
                </div>
                <p className="text-sm text-green-600 font-medium">
                  Scan QR Code QRIS dengan aplikasi e-wallet atau mobile banking
                </p>
                <p className="text-xs text-green-500">
                  Mendukung: ShopeePay, GoPay, OVO, DANA, LinkAja, dll
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
        <div className="fixed bottom-20 left-6 right-6">
          <Card className="p-4 bg-card/80 backdrop-blur-sm border border-border">
            <div className="space-y-3">
              <p className="text-center text-sm text-muted-foreground">
                Pembayaran akan diverifikasi otomatis dalam 1-5 menit
              </p>
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