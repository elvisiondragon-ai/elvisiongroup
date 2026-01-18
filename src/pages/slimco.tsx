import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import dietImage from '@/assets/diet.jpg';
import { ArrowLeft, Copy, CreditCard, User, Mail, Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Toaster } from '@/components/ui/toaster';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { usePro } from '@/hooks/usePro';

const WhatsAppButton = () => (
  <a
    href="https://wa.me/62895325633487"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-24 right-5 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110"
    aria-label="Contact via WhatsApp"
  >
    <FaWhatsapp size={28} />
  </a>
);

export default function SlimcoPaymentPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut, cleanupSupabase } = useAuth();
  const { proStatus } = usePro();
  
  const purchaseFiredRef = useRef(false);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isIOSStandalone = ('standalone' in window.navigator) && (window.navigator as any).standalone;

  const handleLogout = async () => {
    try {
      localStorage.setItem('manual-logout-flag', 'true');
      if (isIOS && isIOSStandalone) {
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
            console.log('Service worker unregistered for iOS PWA logout');
          }
        }
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
          console.log('All caches cleared for iOS PWA logout');
        }
      }
      await cleanupSupabase();
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) {
        console.error('Logout error:', error);
        toast({
          title: "Logout Error - Refreshing",
          description: "Refreshing page to complete logout...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.replace('/auth');
        }, 1000);
        return;
      }
      toast({
        title: "Successfully Logged Out",
        description: "You have been logged out.",
      });
      setTimeout(() => {
        window.location.reload();
        window.location.replace('/auth');
      }, 1000);
    } catch (error: any) {
      console.error('Unexpected logout error:', error);
      toast({
        title: "Logout Error - Refreshing",
        description: "Refreshing page to complete logout...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const productName = 'Slim Ebook';
  const originalPrice = 30; // Original price
  const productPrice = 20; // Discounted price
  const totalQuantity = 1;

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('CREDIT_CARD');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  
  const totalAmount = productPrice;

  // Facebook Pixel - AddToCart event on page load
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      console.log('FB Pixel: Firing AddToCart for Slim Ebook');
      (window as any).fbq('track', 'AddToCart', {
        content_ids: ['ebook_slim'],
        content_type: 'product',
        value: productPrice,
        currency: 'USD',
        pixel_id: '3319324491540889'
      });
    }
  }, [productPrice]);

  const paymentMethods = [
    { code: 'CREDIT_CARD', name: 'Credit Card', description: 'Pay with your credit card' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Text has been copied to clipboard",
    });
  };

  const handleCreatePayment = async () => {
    if (!userName || !userEmail || !phoneNumber || !selectedPaymentMethod) {
      toast({
        title: "Incomplete Data",
        description: "Please fill in all the information: name, email, phone, and payment method.",
        variant: "destructive",
      });
      return;
    }

    let currentUserId = user?.id;

    // If user is not logged in, attempt to sign them up
    if (!user) {
      if (!password || !confirmPassword) {
        toast({
          title: "Password Required",
          description: "Please enter and confirm your password to create an account.",
          variant: "destructive",
        });
        return;
      }
      if (password !== confirmPassword) {
        toast({
          title: "Passwords Do Not Match",
          description: "The password and confirmation password do not match.",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: userEmail,
        password: password,
        options: {
          data: {
            full_name: userName,
          }
        }
      });

      if (signUpError) {
        toast({
          title: "Failed to Create Account",
          description: signUpError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      if (!signUpData.user) {
        toast({
          title: "Email Verification Required",
          description: "Please check your email for verification before proceeding with the payment.",
          variant: "default",
        });
        setLoading(false);
        return;
      }

      currentUserId = signUpData.user.id;
      toast({
        title: "Account Created Successfully!",
        description: "Proceeding to payment...",
      });
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stripe-payment', { // Assuming a different function for stripe
        body: {
          subscriptionType: 'ebook_slim',
          paymentMethod: selectedPaymentMethod,
          userName: userName,
          userEmail: userEmail,
          phoneNumber: phoneNumber,
          amount: totalAmount,
          quantity: totalQuantity,
          productName: productName,
          userId: currentUserId,
        }
      });

      if (error || !data?.success) {
        toast({
          title: "Error Creating Payment",
          description: data?.error || error?.message || "Failed to create payment. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data?.success) {
        setPaymentData(data);
        setShowPaymentInstructions(true);
        toast({
          title: "Payment Created Successfully",
          description: "Please complete the payment.",
        });
      }
    } catch (error: any) {
      console.error('Stripe payment error:', error);
      toast({
        title: "Critical Error",
        description: "Failed to call payment function. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showPaymentInstructions || !paymentData?.reference) return;
    
    const tableName = 'global_product';
    const channelName = `payment-status-slim-${paymentData.reference}`;
    
    console.log(`[SlimcoPaymentPage] Attempting to subscribe to channel: ${channelName} for reference: ${paymentData.reference}`);

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: tableName, filter: `reference=eq.${paymentData.reference}`},
        (payload) => {
          console.log('[SlimcoPaymentPage] Realtime payload received:', payload);
          if (payload.new?.status === 'PAID') {
            if (purchaseFiredRef.current) return;
            purchaseFiredRef.current = true;

            console.log('[SlimcoPaymentPage] Payment status is PAID, showing toast.');
            toast({
                title: "🎉 Payment Successful!",
                description: "Thank you, your payment has been received. Please check your email (Inbox, Important, or Spam) for the Ebook link.",
                duration: 0, 
            });

            // Facebook Pixel - Purchase event
            if (typeof window !== 'undefined' && (window as any).fbq) {
              console.log('FB Pixel: Firing Purchase for Slim Ebook');
              (window as any).fbq('track', 'Purchase', {
                content_ids: ['ebook_slim'],
                content_type: 'product',
                value: payload.new?.amount || totalAmount, // Use amount from payload if available, fallback to local state
                currency: 'USD',
                pixel_id: '3319324491540889'
              }, { eventID: paymentData.reference });
            }
            // Optionally navigate after showing toast
            // navigate('/success-page'); 
          } else {
            console.log(`[SlimcoPaymentPage] Payment status is not PAID. Current status: ${payload.new?.status}`);
          }
        }
      ).subscribe((status) => {
        console.log(`[SlimcoPaymentPage] Supabase channel status for ${channelName}:`, status);
        if (status === 'SUBSCRIBED') {
          console.log(`[SlimcoPaymentPage] Successfully SUBSCRIBED to ${channelName}`);
        }
      });

    return () => {
      console.log(`[SlimcoPaymentPage] Unsubscribing from channel: ${channelName}`);
      supabase.removeChannel(channel);
    };
  }, [showPaymentInstructions, paymentData?.reference, navigate, toast]);

  if (showPaymentInstructions && paymentData) {
    return (
      <div className="min-h-screen bg-background pb-32">
        <Toaster />
        <div className="p-6 pb-4">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => setShowPaymentInstructions(false)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent">
              Payment Instructions
            </h1>
          </div>
        </div>

        <div className="px-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Status</Label>
                <span className={`font-medium ${paymentData.status === 'UNPAID' ? 'text-orange-500' : 'text-green-500'}`}>
                  {paymentData.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Payment Method</Label>
                <span className="font-medium">{paymentData.paymentMethod}</span>
              </div>
                          <div className="flex justify-between items-center">
                            <Label className="text-muted-foreground">Total Payment</Label>
                            <span className="font-bold text-lg text-primary">{formatCurrency(paymentData.amount)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <Label className="text-muted-foreground">Reference</Label>
                            <span className="font-medium">{paymentData.reference}</span>
                          </div>              
                          {paymentData.checkoutUrl && (
                            <div className="fixed bottom-20 left-6 right-6">
                                <Button onClick={() => window.open(paymentData.checkoutUrl, '_blank')} className="w-full" size="lg">
                                    <CreditCard className="w-4 h-4 mr-2" /> Continue to Payment
                                </Button>
                            </div>
                          )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <Toaster />
      <WhatsAppButton />
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/slim')}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent">
                    Checkout Slim Program
                </h1>
            </div>
            {user ? (
                <Button variant="outline" onClick={handleLogout}>Logout</Button>
            ) : (
                <Button variant="outline" onClick={() => navigate('/auth?redirect=/slim/co')}>Login</Button>
            )}
        </div>
      </div>

      <div className="px-6 space-y-6">
        <Card>
          <CardHeader><CardTitle>1. Order Summary</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-muted-foreground">Product</Label>
              <span className="font-medium">{productName}</span>
            </div>
            <div className="flex justify-center my-4">
              <img src={dietImage} alt="Slim Product" className="w-48 h-48 object-contain" />
            </div>

            <Separator/>
            
            <div className="flex justify-between items-center">
              <Label className="text-muted-foreground">Original Price</Label>
              <span className="font-medium line-through text-red-500">{formatCurrency(originalPrice)}</span>
            </div>
            <div className="flex justify-between items-center">
              <Label className="text-muted-foreground">Total Price</Label>

              <span className="font-bold text-lg text-primary">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-green-600 font-bold">
              <Label className="text-green-600">Shipping</Label>
              <span>FREE SHIPPING</span>
            </div>
            <Card className="mt-4 bg-amber-400 text-black border-none shadow-md">
              <CardContent className="p-4 text-center">
                <p className="font-bold">Special promo for today only! Price returns to normal tomorrow.</p>
                <p className="text-sm mt-1">Ebook is sent to your email automatically after payment.</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>2. Shipping Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="userName"><User className="inline-block w-4 h-4 mr-2"/>Full Name</Label>
              <Input id="userName" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="John Doe" required />
            </div>
            <div>
              <Label htmlFor="userEmail"><Mail className="inline-block w-4 h-4 mr-2"/>Email</Label>
              <Input id="userEmail" type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="email@example.com" required />
            </div>
            <div>
              <Label htmlFor="phoneNumber"><Phone className="inline-block w-4 h-4 mr-2"/>Phone Number</Label>
              <Input id="phoneNumber" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+1234567890" required />
            </div>
            {!user && (
              <>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required />
                </div>
              </>
            )}

          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>3. Payment Method</CardTitle></CardHeader>
            <CardContent>
            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="space-y-3">
                {paymentMethods.map((method) => (
                <Label key={method.code} htmlFor={method.code} className={`flex flex-col p-4 rounded-lg border cursor-pointer transition-all ${selectedPaymentMethod === method.code ? 'border-primary shadow-lg' : 'border-border'}`}>
                    <div className="flex items-center space-x-3">
                        <RadioGroupItem value={method.code} id={method.code} />
                        <div className="flex-1">
                            <span className="font-medium">{method.name}</span>
                            <p className="text-xs text-muted-foreground">{method.description}</p>
                        </div>
                    </div>
                </Label>
                ))}
            </RadioGroup>
            </CardContent>
        </Card>

        <div className="fixed bottom-20 left-6 right-6">
          <Button onClick={handleCreatePayment} disabled={loading} className="w-full" size="lg">
            {loading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
            {loading ? 'Processing...' : `Pay Now (${formatCurrency(totalAmount)})`}
          </Button>
        </div>
      </div>
    </div>
  );
}