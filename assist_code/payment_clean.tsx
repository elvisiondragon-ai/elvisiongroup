// CLEANED Payment.tsx - Remove all duplicate auth/session, use only UserProfileContext

// Key changes:
// 1. Added: import { useUserProfile } from '@/contexts/UserProfileContext';
// 2. Removed: const [user, setUser] = useState<any>(null);
// 3. Removed: const [userProfile, setUserProfile] = useState<any>(null);  
// 4. Removed: const [userDataLoading, setUserDataLoading] = useState(true);
// 5. Added: const { userProfile, user, loading: userDataLoading } = useUserProfile();
// 6. Removed: All localStorage cache logic (handled by UserProfileContext)
// 7. Removed: All supabase.auth.getSession() calls
// 8. Removed: All fetchUserProfile() calls  
// 9. Removed: All initializeData() function
// 10. Added: Simple useEffect to auto-populate from UserProfileContext

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CreditCard, Calendar, Phone, User, Mail, Copy, Crown, Edit, RefreshCw, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EditProfile } from '@/components/EditProfile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUserProfile } from '@/contexts/UserProfileContext'; // ADDED

// Meta Pixel declaration
declare global {
  interface Window {
    fbq?: any;
  }
}

interface PaymentProps {
  onNavigate: (tab: string) => void;
}

export function Payment({ onNavigate }: PaymentProps) {
  const [selectedPlan, setSelectedPlan] = useState('1_month');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('QRIS');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  // REMOVED: const [user, setUser] = useState<any>(null);
  // REMOVED: const [userProfile, setUserProfile] = useState<any>(null);
  // REMOVED: const [userDataLoading, setUserDataLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [showQrisModal, setShowQrisModal] = useState(false);
  const { toast } = useToast();
  
  // SPEED FIX: Use UserProfileContext instead of duplicate auth fetching
  const { userProfile, user, loading: userDataLoading } = useUserProfile(); // ADDED

  // Meta Pixel initialization (unchanged)
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.fbq) {
      (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function(...args: any[]) {
          n.callMethod ?
            n.callMethod.apply(n, args) : n.queue.push(args)
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s)
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

      window.fbq('init', '3319324491540889');
      window.fbq('track', 'PageView');
    }
  }, []);

  // SPEED FIX: Auto-populate from UserProfileContext (already cached instantly)
  useEffect(() => {
    if (user && userProfile) {
      console.log('⚡ SPEED FIX: Auto-populating from UserProfileContext');
      setEmail(user.email || '');
      setFullName(userProfile.display_name || user.user_metadata?.display_name || 'User');
      if (userProfile.phone_number) {
        setPhoneNumber(userProfile.phone_number);
      }
    }
  }, [user, userProfile]); // REPLACED all cache logic

  // REMOVED: All localStorage cache logic - handled by UserProfileContext
  // REMOVED: All supabase.auth.getSession() calls  
  // REMOVED: All fetchUserProfile() calls
  // REMOVED: All initializeData() function

  // Rest of the file remains the same...
  // paymentMethods, subscriptionPlans, handleCreatePayment, etc.