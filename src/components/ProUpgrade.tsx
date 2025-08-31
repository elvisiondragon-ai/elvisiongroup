import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Clock, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePro } from '@/hooks/usePro';
import { supabase } from '@/integrations/supabase/client';

interface ProUpgradeProps {
  onClose?: () => void;
  onNavigate?: (page: string) => void;
}

export function ProUpgrade({ onClose, onNavigate }: ProUpgradeProps) {
  const { proStatus } = usePro();
  const { toast } = useToast();


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
                {proStatus.subscriptionType === '1_month' ? '1 Month' : 
                 proStatus.subscriptionType === '1_year' ? '1 Year' :
                 proStatus.subscriptionType === '1_week' ? '1 Week' :
                 proStatus.subscriptionType === '1_day' ? '1 Day' : 'Subscription'}
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
                onClick={() => onNavigate?.("payment")}
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
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Free Access:</strong> Verse 4 + Spiritual Journal
            </p>
            <p className="text-xs text-muted-foreground">
              Upgrade to Pro for all verses and premium features
            </p>
          </div>
          
          <Button 
            onClick={() => onNavigate?.("payment")}
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