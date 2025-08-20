import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CreditCard, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TripaySubscriptionProps {
  user: any;
  userProfile: any;
  onClose: () => void;
}

export function TripaySubscription({ user, userProfile, onClose }: TripaySubscriptionProps) {
  const [selectedPlan, setSelectedPlan] = useState('1_year');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [subscriptionPlans, setSubscriptionPlans] = useState([
    {
      id: '1_year',
      name: '1 Year Subscription',
      description: 'Annual subscription with full access',
      price: 800000,
      currency: 'IDR',
      paymentMethodCode: 'BCAVA',
      paymentMethod: 'BCA Virtual Account',
      duration: '365 days',
      durationDays: 365
    },
    {
      id: '1_month',
      name: '1 Month Subscription', 
      description: 'Monthly subscription with full access',
      price: 100000,
      currency: 'IDR',
      paymentMethodCode: 'BCAVA',
      paymentMethod: 'BCA Virtual Account',
      duration: '30 days',
      durationDays: 30
    },
    {
      id: '1_week',
      name: '1 Week Subscription',
      description: 'Weekly subscription with full access', 
      price: 30000,
      currency: 'IDR',
      paymentMethodCode: 'BCAVA',
      paymentMethod: 'BCA Virtual Account',
      duration: '7 days',
      durationDays: 7
    },
    {
      id: '1_day',
      name: '1 Day Subscription',
      description: 'Daily subscription with full access',
      price: 4000,
      currency: 'IDR',
      paymentMethodCode: 'BCAVA', 
      paymentMethod: 'BCA Virtual Account',
      duration: '1 day',
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
            duration: `${plan.duration_days} ${plan.duration_days === 1 ? 'day' : 'days'}`,
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
    if (!user || !selectedPlan) return;
    
    setLoading(true);
    try {
      const plan = subscriptionPlans.find(p => p.id === selectedPlan);
      if (!plan) throw new Error('Plan not found');

      // Generate merchant reference
      const timestamp = Date.now();
      const planType = plan.id.toUpperCase().replace('_', '');
      const merchantRef = `INV${planType}_${timestamp}`;
      const reference = `TT442721${timestamp}`;

      const paymentData = {
        reference: reference,
        merchant_ref: merchantRef,
        payment_method: plan.paymentMethod,
        payment_method_code: plan.paymentMethodCode,
        total_amount: plan.price,
        fee_merchant: 20000,
        fee_customer: 0,
        total_fee: 20000,
        amount_received: plan.price - 20000,
        is_closed_payment: 1,
        status: "UNPAID",
        paid_at: null,
        note: null,
        action: "check_payment"
      };

      const { data, error } = await supabase.functions.invoke('tripay-create-payment', {
        body: {
          subscriptionType: plan.id,
          paymentMethod: plan.paymentMethodCode,
          userEmail: user.email,
          userName: userProfile?.display_name || user.email?.split('@')[0] || 'User',
          paymentData: paymentData
        }
      });

      if (error) {
        throw error;
      }

      if (data?.checkoutUrl) {
        window.open(data.checkoutUrl, '_blank');
        toast({
          title: "Payment Created",
          description: "Payment link opened in new tab",
        });
      } else {
        toast({
          title: "Payment Created",
          description: "Payment has been created successfully",
        });
      }

      onClose();
    } catch (error) {
      console.error('Tripay payment error:', error);
      toast({
        title: "Error",
        description: "Failed to create payment. Please try again.",
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
    <div className="fixed inset-0 bg-background z-50 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b bg-background/95 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Subscription Plans</h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 max-w-md">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Choose Your Plan
                </CardTitle>
                <CardDescription>
                  Select a subscription plan to unlock premium features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                  {subscriptionPlans.map((plan) => (
                    <div key={plan.id} className="flex items-start space-x-3">
                      <RadioGroupItem value={plan.id} id={plan.id} className="mt-1" />
                      <Label htmlFor={plan.id} className="flex-1 cursor-pointer">
                        <Card className="p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{plan.name}</h3>
                            <div className="text-right">
                              <div className="font-bold text-lg">{formatCurrency(plan.price)}</div>
                              <div className="text-sm text-muted-foreground">{plan.duration}</div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{plan.description}</p>
                          <div className="flex items-center gap-2 text-sm text-primary">
                            <Calendar className="w-4 h-4" />
                            {plan.paymentMethod}
                          </div>
                        </Card>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <Button 
                  onClick={handleCreatePayment}
                  disabled={loading || !selectedPlan}
                  className="w-full mt-6"
                  size="lg"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <CreditCard className="w-4 h-4 mr-2" />
                  )}
                  {loading ? 'Creating Payment...' : 'Create Payment'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}