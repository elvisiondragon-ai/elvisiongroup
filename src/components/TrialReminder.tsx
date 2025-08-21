import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Crown, X } from 'lucide-react';
import { usePro } from '@/hooks/usePro';
import { supabase } from '@/integrations/supabase/client';

export function TrialReminder() {
  const { proStatus } = usePro();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show reminder if user is on trial and has less than 2 days remaining
    if (proStatus.subscriptionType === 'trial' && 
        proStatus.status === 'active' && 
        proStatus.daysRemaining !== null && 
        proStatus.daysRemaining <= 2) {
      setIsVisible(true);
    }
  }, [proStatus]);

  useEffect(() => {
    // Check if trial has expired and logout user
    if (proStatus.subscriptionType === 'trial' && 
        proStatus.status === 'expired') {
      handleTrialExpired();
    }
  }, [proStatus]);

  const handleTrialExpired = async () => {
    // Sign out the user when trial expires
    await supabase.auth.signOut();
    // The app will redirect to auth page automatically
  };

  const formatTimeRemaining = () => {
    if (!proStatus.expiresAt) return '';
    
    const now = new Date();
    const expires = new Date(proStatus.expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  if (!isVisible || proStatus.isPro) return null;

  return (
    <Card className="mx-4 mb-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                Free Trial
              </Badge>
              <span className="text-sm font-medium text-amber-800">
                {formatTimeRemaining()} remaining
              </span>
            </div>
            
            <p className="text-sm text-amber-700 mb-3">
              Your free trial gives you access to all verses! After it expires, you'll only have access to Verse 4 unless you upgrade to Pro.
            </p>
            
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </Button>
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-1 hover:bg-amber-100 rounded"
          >
            <X className="w-4 h-4 text-amber-600" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}