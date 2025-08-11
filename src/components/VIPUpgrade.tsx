import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Clock, CheckCircle } from 'lucide-react';
import { useVIP } from '@/hooks/useVIP';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VIPUpgradeProps {
  onClose?: () => void;
}

export function VIPUpgrade({ onClose }: VIPUpgradeProps) {
  const { vipStatus, startTrial, createPayment } = useVIP();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const handleStartTrial = async () => {
    setLoading(true);
    try {
      await startTrial();
      toast({
        title: "VIP Trial Started!",
        description: "You now have 3 days of VIP access. Enjoy premium features!",
      });
      onClose?.();
    } catch (error: any) {
      toast({
        title: "Trial Failed",
        description: error.message || "Failed to start trial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await createPayment(selectedPlan, paymentMethod);
      
      // Open payment URL in new tab
      window.open(result.payment_url, '_blank');
      
      toast({
        title: "Payment Created",
        description: "Please complete your payment in the new tab",
      });
      
      setShowPaymentDialog(false);
    } catch (error: any) {
      toast({
        title: "Payment Failed",
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
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (vipStatus.loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  // Show current VIP status
  if (vipStatus.isVip) {
    return (
      <Card className="w-full max-w-md mx-auto border-vip">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="w-6 h-6 text-vip" />
            <CardTitle className="text-vip">VIP Active</CardTitle>
          </div>
          <CardDescription>
            {vipStatus.subscriptionType === 'trial' ? (
              <Badge variant="secondary" className="gap-1">
                <Clock className="w-3 h-3" />
                Trial - {vipStatus.daysRemaining} days left
              </Badge>
            ) : (
              <Badge variant="default" className="gap-1 bg-vip">
                <CheckCircle className="w-3 h-3" />
                {vipStatus.subscriptionType === 'monthly' ? 'Monthly' : 'Yearly'} Subscription
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {vipStatus.subscriptionType === 'trial' ? 'Trial expires:' : 'Subscription expires:'}
            </p>
            <p className="font-medium">
              {vipStatus.expiresAt ? formatDate(vipStatus.expiresAt) : 'Unknown'}
            </p>
          </div>

          {vipStatus.subscriptionType === 'trial' && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Upgrade to continue VIP access after trial
              </p>
              <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="default">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to VIP
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Choose Your VIP Plan</DialogTitle>
                    <DialogDescription>
                      Select a subscription plan and payment method
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card 
                        className={`cursor-pointer transition-colors ${selectedPlan === 'monthly' ? 'border-primary' : ''}`}
                        onClick={() => setSelectedPlan('monthly')}
                      >
                        <CardContent className="p-4 text-center">
                          <p className="font-medium">Monthly</p>
                          <p className="text-lg font-bold text-primary">{formatCurrency(100000)}</p>
                          <p className="text-xs text-muted-foreground">per month</p>
                        </CardContent>
                      </Card>
                      <Card 
                        className={`cursor-pointer transition-colors ${selectedPlan === 'yearly' ? 'border-primary' : ''}`}
                        onClick={() => setSelectedPlan('yearly')}
                      >
                        <CardContent className="p-4 text-center">
                          <p className="font-medium">Yearly</p>
                          <p className="text-lg font-bold text-primary">{formatCurrency(800000)}</p>
                          <p className="text-xs text-muted-foreground">per year</p>
                          <Badge variant="secondary" className="mt-1">Save 33%</Badge>
                        </CardContent>
                      </Card>
                    </div>

                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRIVA">BRI Virtual Account</SelectItem>
                        <SelectItem value="BNIVA">BNI Virtual Account</SelectItem>
                        <SelectItem value="MANDIRIVA">Mandiri Virtual Account</SelectItem>
                        <SelectItem value="ALFAMART">Alfamart</SelectItem>
                        <SelectItem value="INDOMARET">Indomaret</SelectItem>
                        <SelectItem value="QRIS">QRIS</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button 
                      onClick={handlePayment} 
                      disabled={loading || !paymentMethod}
                      className="w-full"
                    >
                      {loading ? 'Creating Payment...' : `Pay ${formatCurrency(selectedPlan === 'monthly' ? 100000 : 800000)}`}
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

  // Show upgrade options for non-VIP users
  return (
    <div className="space-y-6">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-6 h-6 text-primary" />
            <CardTitle>Upgrade to VIP</CardTitle>
          </div>
          <CardDescription>
            Unlock premium features and exclusive content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Unlimited chat messages</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Premium audio therapy</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Advanced meditation guides</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Priority support</span>
            </div>
          </div>

          <Button 
            onClick={handleStartTrial} 
            disabled={loading}
            className="w-full"
            variant="outline"
          >
            {loading ? 'Starting Trial...' : 'Start 3-Day Free Trial'}
          </Button>

          <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Crown className="w-4 h-4 mr-2" />
                Subscribe Now
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Choose Your VIP Plan</DialogTitle>
                <DialogDescription>
                  Select a subscription plan and payment method
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card 
                    className={`cursor-pointer transition-colors ${selectedPlan === 'monthly' ? 'border-primary' : ''}`}
                    onClick={() => setSelectedPlan('monthly')}
                  >
                    <CardContent className="p-4 text-center">
                      <p className="font-medium">Monthly</p>
                      <p className="text-lg font-bold text-primary">{formatCurrency(100000)}</p>
                      <p className="text-xs text-muted-foreground">per month</p>
                    </CardContent>
                  </Card>
                  <Card 
                    className={`cursor-pointer transition-colors ${selectedPlan === 'yearly' ? 'border-primary' : ''}`}
                    onClick={() => setSelectedPlan('yearly')}
                  >
                    <CardContent className="p-4 text-center">
                      <p className="font-medium">Yearly</p>
                      <p className="text-lg font-bold text-primary">{formatCurrency(800000)}</p>
                      <p className="text-xs text-muted-foreground">per year</p>
                      <Badge variant="secondary" className="mt-1">Save 33%</Badge>
                    </CardContent>
                  </Card>
                </div>

                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRIVA">BRI Virtual Account</SelectItem>
                    <SelectItem value="BNIVA">BNI Virtual Account</SelectItem>
                    <SelectItem value="MANDIRIVA">Mandiri Virtual Account</SelectItem>
                    <SelectItem value="ALFAMART">Alfamart</SelectItem>
                    <SelectItem value="INDOMARET">Indomaret</SelectItem>
                    <SelectItem value="QRIS">QRIS</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  onClick={handlePayment} 
                  disabled={loading || !paymentMethod}
                  className="w-full"
                >
                  {loading ? 'Creating Payment...' : `Pay ${formatCurrency(selectedPlan === 'monthly' ? 100000 : 800000)}`}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}