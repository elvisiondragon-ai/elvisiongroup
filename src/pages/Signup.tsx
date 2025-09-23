import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Eye, EyeOff, Sparkles, User, ArrowLeft, MessageCircle } from "lucide-react";
import { Turnstile } from '@marsidev/react-turnstile';
import { Link, useNavigate } from 'react-router-dom';

export function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for required environment variables
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  if (!turnstileSiteKey) {
    console.error('Missing VITE_TURNSTILE_SITE_KEY environment variable');
  }

  // Signup form state
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });

  // Captcha token state
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [tokenTimestamp, setTokenTimestamp] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState<'signup' | 'success'>('signup');
  
  // Ref for Turnstile widget
  const signupTurnstileRef = useRef<any>(null);

  // Enhanced CAPTCHA error handling
  const handleCaptchaSuccess = (token: string) => {
    setCaptchaToken(token);
    setTokenTimestamp(Date.now());
  };

  const handleCaptchaError = (error?: any) => {
    console.error('CAPTCHA error:', error);
    setCaptchaToken(null);
    setTokenTimestamp(null);
    
    toast({
      title: "CAPTCHA Error",
      description: "Please try the CAPTCHA again. If this persists, refresh the page.",
      variant: "destructive",
    });
  };

  const handleCaptchaExpire = () => {
    setCaptchaToken(null);
    setTokenTimestamp(null);
  };

  const resetCaptcha = () => {
    if (signupTurnstileRef?.current) {
      signupTurnstileRef.current.reset();
    }
  };

  const checkTokenFreshness = () => {
    if (captchaToken && tokenTimestamp && Date.now() - tokenTimestamp > 300000) { // 5 minutes
      setCaptchaToken(null);
      setTokenTimestamp(null);
      toast({
        title: "CAPTCHA Expired",
        description: "Please complete the CAPTCHA again.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaToken) {
      toast({
        title: "Error",
        description: "Please complete the captcha verification",
        variant: "destructive",
      });
      return;
    }

    if (!checkTokenFreshness()) {
      resetCaptcha();
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (signupData.password.length < 6) {
      toast({
        title: "Error", 
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          captchaToken,
          data: {
            display_name: signupData.displayName
          }
        }
      });

      if (error) {
        // Specific handling for CAPTCHA verification failed
        if (error.message.toLowerCase().includes('captcha') || 
            error.message.toLowerCase().includes('verification failed') ||
            error.message.toLowerCase().includes('invalid captcha')) {
          setCaptchaToken(null);
          setTokenTimestamp(null);
          resetCaptcha();
          toast({
            title: "CAPTCHA Verification Failed",
            description: "Please complete the CAPTCHA again.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Signup Error",
          description: error.message,
          variant: "destructive",
        });
      } else if (data.user) {
        // Send welcome email and add to subscriber list
        try {
          await supabase.functions.invoke('send-signup-email', {
            body: {
              userEmail: signupData.email,
              userName: signupData.displayName
            }
          });
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
          // Continue even if email fails
        }

        if (data.user.email_confirmed_at) {
          // Show toast with loading first
          toast({
            title: "Akun Berhasil Dibuat!",
            description: "🚀 Mengarahkan ke Ecosystem...",
          });
          
          // Set flag for showing welcome toast after refresh
          localStorage.setItem('signup-welcome-pending', 'true');
          
          // Wait then redirect and force refresh
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        } else {
          setCurrentView('success');
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (currentView === 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6 bg-gradient-secondary border-border">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto glow-primary">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-orbitron bg-gradient-primary bg-clip-text text-transparent">
              Selamat Akun Dibuat! 🎉
            </h1>
            <p className="text-muted-foreground text-center">
              Akun anda telah berhasil dibuat dan siap digunakan. Mulai perjalanan spiritual anda sekarang!
            </p>
            <div className="space-y-3 pt-4">
              <Button 
                onClick={() => {
                  // Show toast with loading first
                  toast({
                    title: "🚀 Tunggu Sebentar ⏳ Sedang Mengarahkan ke Ecosystem...",
                    description: "Selamat datang di eL Vision Group!",
                  });
                  
                  // Set flag for showing welcome toast after refresh
                  localStorage.setItem('signup-welcome-pending', 'true');
                  
                  // Wait then redirect
                  setTimeout(() => {
                    window.location.href = '/';
                  }, 2000);
                }}
                className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground glow-primary transform hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                MULAI PERJALANAN
              </Button>
              <Button 
                variant="outline"
                onClick={() => setCurrentView('signup')}
                className="w-full"
              >
                Kembali ke Pendaftaran
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6 bg-gradient-secondary border-border">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/auth')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </Button>
          </div>
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto glow-primary">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold font-orbitron bg-gradient-primary bg-clip-text text-transparent">
            Join eL Vision Group
          </h1>
          <p className="text-muted-foreground">
            Create your account to start your spiritual journey
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-foreground">Display Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="displayName"
                type="text"
                placeholder="Enter your display name"
                value={signupData.displayName}
                onChange={(e) => setSignupData(prev => ({ ...prev, displayName: e.target.value }))}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-foreground">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                value={signupData.email}
                onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                className="pl-10"
                required
              />
            </div>
          </div>


          <div className="space-y-2">
            <Label htmlFor="signup-password" className="text-foreground">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={signupData.password}
                onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-foreground">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={signupData.confirmPassword}
                onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Captcha */}
          <div className="flex justify-center">
            <Turnstile
              ref={signupTurnstileRef}
              siteKey={turnstileSiteKey}
              onSuccess={handleCaptchaSuccess}
              onExpire={handleCaptchaExpire}
              onError={handleCaptchaError}
              options={{
                action: 'signup',
                theme: 'light',
                size: 'normal',
                retry: 'auto'
              }}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground glow-primary transition-all duration-200 transform hover:scale-105 active:scale-95"
            disabled={isLoading || !captchaToken}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="text-center space-y-3">
          <Button
            variant="outline"
            onClick={() => {
              const message = encodeURIComponent("Hi kak nanya tentang Ekosistem..");
              window.open(`https://wa.me/62895325633487?text=${message}`, '_blank');
            }}
            className="w-full bg-green-50 hover:bg-green-100 text-green-700 border-green-200 hover:border-green-300"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Tanya Customer Service
          </Button>
          
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link 
              to="/auth" 
              className="text-primary hover:underline font-medium"
            >
              Sign in here
            </Link>
          </p>
          <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
            <Link to="/terms" className="hover:text-foreground hover:underline">
              Terms
            </Link>
            <Link to="/privacy-policy" className="hover:text-foreground hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}