import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Clock, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePro } from '@/hooks/usePro';
import { TripaySubscription } from './TripaySubscription';
import { supabase } from '@/integrations/supabase/client';

interface ProUpgradeProps {
  onClose?: () => void;
}

export function ProUpgrade({ onClose }: ProUpgradeProps) {
  const { proStatus, startTrial } = usePro();
  const [loading, setLoading] = useState(false);
  const [showTripayPayment, setShowTripayPayment] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (showTripayPayment) {
      fetchUserData();
    }
  }, [showTripayPayment]);

  const fetchUserData = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        setUser(currentUser);
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

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


  // Show Tripay payment interface
  if (showTripayPayment) {
    return <TripaySubscription user={user} userProfile={userProfile} onClose={() => setShowTripayPayment(false)} />;
  }

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
              <Button 
                onClick={() => setShowTripayPayment(true)}
                className="w-full"
                variant="default"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
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
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Premium audio content</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Exclusive journals & priority support</span>
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
          
          <Button 
            onClick={() => setShowTripayPayment(true)}
            className="w-full"
          >
            <Crown className="w-4 h-4 mr-2" />
            Subscribe Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}