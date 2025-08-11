import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Crown, Star, Clock, CreditCard, Building, Banknote, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePro } from '@/hooks/usePro';

interface ProUpgradeProps {
  onClose?: () => void;
}

export function ProUpgrade({ onClose }: ProUpgradeProps) {
  const { proStatus, startTrial, createPayment } = usePro();
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const { toast } = useToast();

  const handleStartTrial = async () => {
    setLoading(true);
    try {
      await startTrial();
      toast({
        title: "Pro Trial Started!",
        description: "You now have 3 days of Pro access. Enjoy premium features!",
      });
      onClose?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start trial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      toast({
        title: "Error",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await createPayment(selectedPlan, selectedPaymentMethod);
      
      if (result.payment_url) {
        // Redirect to payment URL
        window.open(result.payment_url, '_blank');
        toast({
          title: "Payment Created",
          description: "You've been redirected to complete your payment.",
        });
        setShowPaymentDialog(false);
        onClose?.();
      } else {
        throw new Error("Payment URL not received");
      }
    } catch (error: any) {
      toast({
        title: "Error", 
        description: error.message || "Failed to create payment. Please try again.",
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const paymentMethods = [
    { 
      id: 'BCA_MANUAL', 
      name: 'BCA Manual', 
      icon: Building,
      description: 'Transfer manual ke rekening BCA'
    },
    { 
      id: 'BRIVA', 
      name: 'BRI Virtual Account', 
      icon: Building,
      description: 'Transfer via BRI Virtual Account'
    },
    { 
      id: 'BCAVA', 
      name: 'BCA Virtual Account', 
      icon: Building,
      description: 'Transfer via BCA Virtual Account'
    },
    { 
      id: 'BNIVA', 
      name: 'BNI Virtual Account', 
      icon: Building,
      description: 'Transfer via BNI Virtual Account'
    },
    { 
      id: 'MANDIRIVA', 
      name: 'Mandiri Virtual Account', 
      icon: Building,
      description: 'Transfer via Mandiri Virtual Account'
    },
    { 
      id: 'ALFAMART', 
      name: 'Alfamart', 
      icon: Banknote,
      description: 'Bayar di Alfamart terdekat'
    },
    { 
      id: 'INDOMARET', 
      name: 'Indomaret', 
      icon: Banknote,
      description: 'Bayar di Indomaret terdekat'
    }
  ];

  // Show loading state
  if (proStatus.loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading subscription status...</p>
        </CardContent>
      </Card>
    );
  }

  // Show current Pro status
  if (proStatus.isPro) {
    return (
      <Card className="w-full max-w-md mx-auto border-pro">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="w-6 h-6 text-pro" />
            <CardTitle className="text-pro">Pro Active</CardTitle>
          </div>
          <CardDescription>
            {proStatus.subscriptionType === 'trial' ? (
              <Badge variant="secondary" className="gap-1">
                <Clock className="w-3 h-3" />
                Trial - {proStatus.daysRemaining} days left
              </Badge>
            ) : (
              <Badge variant="default" className="gap-1 bg-pro">
                <Crown className="w-3 h-3" />
                {proStatus.subscriptionType === 'monthly' ? 'Monthly' : 'Yearly'} Subscription
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-3">
          <div className="text-sm">
            <p className="font-medium text-foreground">
              {proStatus.subscriptionType === 'trial' ? 'Trial expires:' : 'Subscription expires:'}
            </p>
            <p className="text-muted-foreground">
              {proStatus.expiresAt ? formatDate(proStatus.expiresAt) : 'Unknown'}
            </p>
          </div>
          
          {proStatus.subscriptionType === 'trial' && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Upgrade to continue Pro access after trial
              </p>
              <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="default">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Choose Your Pro Plan</DialogTitle>
                    <DialogDescription>
                      Select a subscription plan and payment method
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Plan Selection */}
                    <div>
                      <h4 className="font-medium mb-3">Select Plan</h4>
                      <RadioGroup value={selectedPlan} onValueChange={(value: 'monthly' | 'yearly') => setSelectedPlan(value)}>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="monthly" id="monthly" />
                              <Label htmlFor="monthly">Monthly</Label>
                            </div>
                            <span className="font-semibold">{formatCurrency(100000)}/month</span>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yearly" id="yearly" />
                              <Label htmlFor="yearly">Yearly</Label>
                            </div>
                            <div className="text-right">
                              <span className="font-semibold">{formatCurrency(800000)}/year</span>
                              <p className="text-xs text-muted-foreground">Save 33%</p>
                            </div>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Payment Method Selection */}
                    <div>
                      <h4 className="font-medium mb-3">Payment Method</h4>
                      <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                        <div className="space-y-2">
                          {paymentMethods.map((method) => (
                            <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem value={method.id} id={method.id} />
                                <method.icon className="w-5 h-5 text-muted-foreground" />
                                <div>
                                  <Label htmlFor={method.id} className="cursor-pointer">
                                    {method.name}
                                  </Label>
                                  <p className="text-xs text-muted-foreground">
                                    {method.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    <Button 
                      onClick={handlePayment} 
                      disabled={loading || !selectedPaymentMethod}
                      className="w-full"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <CreditCard className="w-4 h-4 mr-2" />
                      )}
                      {loading ? 'Processing...' : 'Create Payment'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Show upgrade options for non-Pro users
  return (
    <div className="space-y-6">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-6 h-6 text-primary" />
            <CardTitle>Upgrade to Pro</CardTitle>
          </div>
          <CardDescription>
            Unlock premium features and exclusive content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Access to all premium audio content</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Exclusive spiritual journals</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Advanced meditation techniques</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Priority support</span>
            </div>
          </div>
          
          <Button 
            onClick={handleStartTrial}
            disabled={loading}
            className="w-full"
            variant="outline"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Clock className="w-4 h-4 mr-2" />
            )}
            {loading ? 'Starting...' : 'Start 3-Day Free Trial'}
          </Button>
          
          <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Crown className="w-4 h-4 mr-2" />
                Subscribe Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Choose Your Pro Plan</DialogTitle>
                <DialogDescription>
                  Select a subscription plan and payment method
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Plan Selection */}
                <div>
                  <h4 className="font-medium mb-3">Select Plan</h4>
                  <RadioGroup value={selectedPlan} onValueChange={(value: 'monthly' | 'yearly') => setSelectedPlan(value)}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="monthly" id="monthly" />
                          <Label htmlFor="monthly">Monthly</Label>
                        </div>
                        <span className="font-semibold">{formatCurrency(100000)}/month</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yearly" id="yearly" />
                          <Label htmlFor="yearly">Yearly</Label>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">{formatCurrency(800000)}/year</span>
                          <p className="text-xs text-muted-foreground">Save 33%</p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Payment Method Selection */}
                <div>
                  <h4 className="font-medium mb-3">Payment Method</h4>
                  <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                    <div className="space-y-2">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value={method.id} id={method.id} />
                            <method.icon className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <Label htmlFor={method.id} className="cursor-pointer">
                                {method.name}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {method.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <Button 
                  onClick={handlePayment} 
                  disabled={loading || !selectedPaymentMethod}
                  className="w-full"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <CreditCard className="w-4 h-4 mr-2" />
                  )}
                  {loading ? 'Processing...' : 'Create Payment'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}