import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Eye, EyeOff, Sparkles, User, ArrowLeft, Phone } from "lucide-react";
import { Turnstile } from '@marsidev/react-turnstile';
import { Link, useNavigate } from 'react-router-dom';

export function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Signup form state
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    phoneNumber: ''
  });

  // Captcha token state
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'signup' | 'success'>('signup');

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

    // Validate phone number format if provided
    if (signupData.phoneNumber && !/^08[0-9]{8,13}$/.test(signupData.phoneNumber)) {
      toast({
        title: "Error",
        description: "Phone number must start with 08 and be 10-15 digits total (08xxxxxxxxxx)",
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
            display_name: signupData.displayName || signupData.email.split('@')[0],
            phone_number: signupData.phoneNumber
          }
        }
      });

      if (error) {
        toast({
          title: "Signup Error",
          description: error.message,
          variant: "destructive",
        });
      } else if (data.user) {
        if (data.user.email_confirmed_at) {
          toast({
            title: "Welcome!",
            description: "Account created successfully. You are now logged in.",
          });
          navigate('/');
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
              <Mail className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-orbitron bg-gradient-primary bg-clip-text text-transparent">
              Check Your Email
            </h1>
            <p className="text-muted-foreground text-center">
              We've sent a verification link to <span className="font-medium text-foreground">{signupData.email}</span>. 
              Please check your email and click the link to activate your account.
            </p>
            <div className="space-y-3 pt-4">
              <Button 
                onClick={() => navigate('/auth')}
                className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground glow-primary"
              >
                Back to Login
              </Button>
              <Button 
                variant="outline"
                onClick={() => setCurrentView('signup')}
                className="w-full"
              >
                Try Different Email
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
            <Label htmlFor="phone-number" className="text-foreground">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone-number"
                type="tel"
                placeholder="08123456789"
                value={signupData.phoneNumber}
                onChange={(e) => {
                  // Phone number validation and sanitization - must start with 08
                  let sanitized = e.target.value.replace(/[^0-9]/g, '');
                  // Ensure it starts with 08
                  if (sanitized.length > 0 && !sanitized.startsWith('08')) {
                    sanitized = '08' + sanitized.replace(/^0+/, '');
                  }
                  // Limit to 15 characters max (08 + 13 digits)
                  if (sanitized.length > 15) {
                    sanitized = sanitized.substring(0, 15);
                  }
                  setSignupData(prev => ({ ...prev, phoneNumber: sanitized }));
                }}
                className="pl-10"
                maxLength={15}
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
              siteKey="0x4AAAAAAB1zRiolDtnT61Ah"
              onSuccess={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken(null)}
              onError={() => setCaptchaToken(null)}
              options={{
                theme: 'light',
                size: 'normal'
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

        <div className="text-center space-y-2">
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