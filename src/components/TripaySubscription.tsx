import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CreditCard, Calendar, Phone, User, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TripaySubscriptionProps {
  user: any;
  userProfile: any;
  onClose: () => void;
}

export function TripaySubscription({ user, userProfile, onClose }: TripaySubscriptionProps) {
  const [selectedPlan, setSelectedPlan] = useState('1_year');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('BCAVA');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState(userProfile?.display_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
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
      id: '1_week',
      name: 'Berlangganan 1 Minggu',
      description: 'Berlangganan mingguan dengan akses penuh', 
      price: 30000,
      currency: 'IDR',
      paymentMethodCode: 'BCAVA',
      paymentMethod: 'BCA Virtual Account',
      duration: '7 hari',
      durationDays: 7
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
          userEmail: email,
          userName: fullName,
          phoneNumber: phoneNumber,
          amount: plan.price,
          currency: plan.currency
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success && data?.checkoutUrl) {
        // Open checkout URL in new tab
        window.open(data.checkoutUrl, '_blank', 'noopener,noreferrer');
        
        toast({
          title: "Pembayaran Dibuat ✅",
          description: "Anda akan diarahkan ke halaman pembayaran Tripay",
        });
        
        // Optional: Store payment reference for status checking
        if (data.reference) {
          localStorage.setItem('lastPaymentReference', data.reference);
        }
      } else {
        throw new Error(data?.error || 'Gagal membuat pembayaran');
      }

      onClose();
    } catch (error) {
      console.error('Tripay payment error:', error);
      toast({
        title: "Error ❌",
        description: error.message || "Gagal membuat pembayaran. Silakan coba lagi.",
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

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-full max-w-md mx-4 h-[90vh] bg-background border rounded-lg shadow-lg flex flex-col">
        {/* Header */}
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

        {/* Scrollable Content */}
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

        {/* Footer Button */}
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
      </div>
    </div>
  );
}