import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Eye, EyeOff, Sparkles, Zap, Phone, User as UserIcon, MessageCircle } from "lucide-react";
import type { User } from '@supabase/supabase-js';
import { Capacitor } from '@capacitor/core';
import { iOSCacheCleaner } from "@/utils/iOSCacheCleaner";

interface AuthProps {
  onLogin: (user: User) => void;
}

export function Auth({ onLogin }: AuthProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const redirectPath = new URLSearchParams(window.location.search).get('redirect') || '/';


  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });

  // Forgot password form state
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: ''
  });


  // Track current view
  const [currentView, setCurrentView] = useState<'auth' | 'forgot-password' | 'reset-sent' | 'signup-success'>('auth');
  
  // Track active tab and click states
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isTabClicked, setIsTabClicked] = useState(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);
  const [showApkButton, setShowApkButton] = useState(true);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = Capacitor.getPlatform() === 'android';
    setShowApkButton(!isIOS && !isAndroid);
  }, []);

  // Check if user is already logged in + iOS cache verification
  useEffect(() => {
    const checkUser = async () => {
      // iOS cache verification and cleanup
      await iOSCacheCleaner.verifyCleanState();
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        onLogin(session.user);
      }
    };
    checkUser();
  }, [onLogin]);

  // Helper function to clean up auth state
  const cleanupAuthState = () => {
    // Clear all auth-related localStorage items
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;

      if (data.user) {
        // Selective cache bomb - Clear all caches on login to prevent stale data issues
        console.log('💣 LOGIN: Selective cache bomb clearing all caches');
        localStorage.removeItem('user-profile-cache');
        localStorage.removeItem('profile-metadata');
        localStorage.removeItem('user-cache');
        localStorage.removeItem('chat-messages-cache');
        localStorage.removeItem('meditation-cache');
        localStorage.removeItem('audio-cache');
        sessionStorage.clear();
        
        // Set login success flag for post-reload toast
        localStorage.setItem('login-success-pending', 'true');
        
        // Force refresh after login
        window.location.reload();
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Simple password validation - minimum 6 characters
    if (signupData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }


    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: signupData.displayName
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Selective cache bomb - Clear all caches on login to prevent stale data issues
        console.log('💣 LOGIN: Selective cache bomb clearing all caches');
        localStorage.removeItem('user-profile-cache');
        localStorage.removeItem('profile-metadata');
        localStorage.removeItem('user-cache');
        localStorage.removeItem('chat-messages-cache');
        localStorage.removeItem('meditation-cache');
        localStorage.removeItem('audio-cache');
        sessionStorage.clear();
        
        // Set login success flag for post-reload toast
        localStorage.setItem('login-success-pending', 'true');
        
        // Force refresh after login
        window.location.reload();
      }
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message || "An error occurred during signup.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    
    try {
      // Clean up any existing auth state first
      cleanupAuthState();
      
      // Keep existing session if available - removed signOut to avoid conflicts

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${redirectPath}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          }
        }
      });

      if (error) throw error;

      // Check if this is a new user and send welcome email
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Send welcome email for Google signup
        try {
          await supabase.functions.invoke('send-signup-email', {
            body: {
              userEmail: session.user.email,
              userName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0]
            }
          });
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
          // Continue even if email fails
        }
      }

      // The actual user data will be handled by the auth state change listener
      toast({
        title: "Redirecting to Google...",
        description: "You'll be redirected to complete authentication.",
      });

    } catch (error: any) {
      console.error('Google auth error:', error);
      toast({
        title: "Google Authentication Failed",
        description: error.message || "An error occurred during Google authentication.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();


    setIsLoading(true);

    try {
      // Use Supabase's built-in reset password function
      const { error } = await supabase.auth.resetPasswordForEmail(
        forgotPasswordData.email,
        {
          redirectTo: `${window.location.origin}/reset-password`
        }
      );

      if (error) throw error;

      toast({
        title: "Reset Email Sent!",
        description: "Check your email for password reset instructions.",
      });
      
      setCurrentView('reset-sent');
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message || "An error occurred while sending reset email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const enhancedHandleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      // iOS-specific: Clear form cache before login attempt
      await iOSCacheCleaner.quickLoginCacheClear();
      
      // Clean up any existing auth state
      const trimmedEmail = loginData.email.trim();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: loginData.password,
      });

      if (error) {
        // iOS-specific: If login fails, try comprehensive cache clear and retry ONCE
        if (error.message.includes('Invalid') || error.message.includes('incorrect')) {
          console.log('🚨 iOS Login failed - attempting cache clear and retry');
          
          const shouldRetry = await iOSCacheCleaner.clearAllCaches();
          if (shouldRetry.success && shouldRetry.isIOS) {
            toast({
              title: "Clearing Cache",
              description: "Retrying login with fresh cache...",
              duration: 2000,
            });
            
            // Wait a moment for cache clearing to complete
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Retry login once
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
              email: loginData.email,
              password: loginData.password,
            });
            
            if (retryError) {
              throw retryError;
            }
            
            if (retryData.user) {
              console.log('✅ iOS Login retry successful after cache clear');
              // Continue to success handling below
              Object.assign(data, retryData);
            }
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }

      if (data.user) {
        // Selective cache bomb - Clear all caches on login to prevent stale data issues
        console.log('💣 LOGIN: Selective cache bomb clearing all caches');
        localStorage.removeItem('user-profile-cache');
        localStorage.removeItem('profile-metadata');
        localStorage.removeItem('user-cache');
        localStorage.removeItem('chat-messages-cache');
        localStorage.removeItem('meditation-cache');
        localStorage.removeItem('audio-cache');
        sessionStorage.clear();
        
        // Set login success flag for post-reload toast
        localStorage.setItem('login-success-pending', 'true');
        
        // Navigate to the redirect path
        navigate(redirectPath);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      toast({
        title: "Login Gagal",
        description: error.message || "Terjadi kesalahan saat login.",
        variant: "destructive",
      });
      
      // iOS-specific: Clear form cache after failed login to prevent stuck state
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        setTimeout(() => {
          iOSCacheCleaner.quickLoginCacheClear();
        }, 500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const enhancedHandleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Allow any password without strict validation
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Password Not match",
        description: "Password must identic.",
        variant: "destructive",
      });
      return;
    }



    // Very lenient password validation - minimum 1 character
    if (signupData.password.length < 1) {
      toast({
        title: "Password empty",
        description: "Insert password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Clean up existing state first
      cleanupAuthState();

      const redirectUrl = `${window.location.origin}/`;

      const trimmedEmail = signupData.email.trim();
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: signupData.password,
        options: {
          emailRedirectTo: redirectUrl,
          // Skip email confirmation for easier registration
          data: {
            email_confirm: true
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
          resetCaptcha(signupTurnstileRef);
          toast({
            title: "CAPTCHA Verification Failed",
            description: "Please complete the CAPTCHA again.",
            variant: "destructive",
          });
          return;
        }

        // If user already exists, try to sign them in instead
        if (error.message.includes('already registered')) {
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: signupData.email,
            password: signupData.password,
          });

          if (loginError) throw loginError;

          if (loginData.user) {
            toast({
              title: "Login!",
              description: "Welcome to eL Vision.",
            });
            onLogin(loginData.user);
            return;
          }
        }
        throw error;
      }

      if (data.user) {
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

        toast({
          title: "Signup Successful!",
          description: "Welcome to eL Vision. You are now being logged in.",
        });
        onLogin(data.user);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Signup Error",
        description: error.message || "Try another email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password View
  if (currentView === 'forgot-password') {
    return (
      <div 
        className="min-h-screen bg-background flex items-center justify-center p-4"
        style={{
          minHeight: '100vh',
          background: '#0F0F23',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}
      >
        <div className="w-full max-w-md">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/favicon.png" 
                alt="eL Vision Group Logo" 
                className="w-24 h-24 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent">
              eL Vision Group
            </h1>
            <p className="text-muted-foreground mt-2">
              Reset Password Anda
            </p>
          </div>

          <Card className="p-6 bg-gradient-secondary border-border">
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email" className="text-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                          <Input
                                                            id="forgot-email"
                                                            type="email"
                                                            placeholder="your@email.com"
                                                            value={forgotPasswordData.email}
                                                            onChange={(e) => setForgotPasswordData(prev => ({ ...prev, email: e.target.value }))}
                                                            onBlur={() => setForgotPasswordData(prev => ({ ...prev, email: prev.email.trim() }))}
                                                            className="pl-10 cyber-input"
                                                            required
                                                          />                </div>
              </div>


              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium h-11 transition-all duration-200 transform hover:scale-105 active:scale-95"
                disabled={isLoading}
              >
                {isLoading ? "Sent..." : "Reset Email Sent"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button
                onClick={() => setCurrentView('auth')}
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                Kembali ke Login
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Reset Email Sent View
  if (currentView === 'signup-success') {
    return (
      <div 
        className="min-h-screen bg-background flex items-center justify-center p-4"
        style={{
          minHeight: '100vh',
          background: '#0F0F23',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}
      >
        <Card className="w-full max-w-md p-8 space-y-6 bg-gradient-secondary border-border">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto glow-primary">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent">
              Selamat Akun Dibuat! 🎉
            </h1>
            <p className="text-muted-foreground text-center">
              Acount Created!
            </p>
            <div className="space-y-3 pt-4">
              <Button 
                onClick={() => setCurrentView('auth')}
                className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground glow-primary transform hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Start Explore
              </Button>
              <Button 
                variant="outline"
                onClick={() => setCurrentView('auth')}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (currentView === 'reset-sent') {
    return (
      <div 
        className="min-h-screen bg-background flex items-center justify-center p-4"
        style={{
          minHeight: '100vh',
          background: '#0F0F23',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}
      >
        <div className="w-full max-w-md">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/favicon.png" 
                alt="eL Vision Group Logo" 
                className="w-24 h-24 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent">
              eL Vision Group
            </h1>
            <p className="text-muted-foreground mt-2">
              Email Reset Sent
            </p>
          </div>

          <Card className="p-6 bg-gradient-secondary border-border text-center">
            <div className="mb-4">
              <Mail className="h-12 w-12 mx-auto text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Check Email 
              </h3>
              <p className="text-muted-foreground">
                Reset Password sent 
                Check Your Email
              </p>
            </div>

            <Button
              onClick={() => setCurrentView('auth')}
              className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium h-11"
            >
              Back ke Login
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Main Auth View
  return (
    <div 
      className="min-h-screen bg-background flex items-center justify-center p-4"
      style={{
        minHeight: '100vh',
        background: '#0F0F23',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div 
        className="w-full max-w-md"
        style={{
          width: '100%',
          maxWidth: '28rem'
        }}
      >
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
                          <img 
                            src="/favicon.png" 
                            alt="eL Vision Group Logo" 
                            className="w-24 h-24 object-contain"
                          />          </div>
          <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent">
            eL Vision Group
          </h1>
          <p className="text-muted-foreground mt-2">
            Self-transformation through spiritual technology
          </p>
        </div>

        <Card className="p-6 bg-gradient-secondary border-border">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 p-2 rounded-lg backdrop-blur-sm gap-2">
              <TabsTrigger 
                value="login" 
                className={`font-bold text-white transition-all duration-300 relative overflow-hidden rounded-md ${
                  activeTab === 'login' 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => {
                  setIsTabClicked(true);
                  setTimeout(() => setIsTabClicked(false), 150);
                }}
              >
                <span className={`transition-transform duration-150 ${
                  isTabClicked && activeTab === 'login' ? 'scale-95' : 'scale-100'
                }`}>
                  Login
                </span>
                {activeTab === 'login' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 animate-pulse rounded-md" />
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className={`font-bold text-white transition-all duration-300 relative overflow-hidden rounded-md ${
                  activeTab === 'signup' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => {
                  setIsTabClicked(true);
                  setTimeout(() => setIsTabClicked(false), 150);
                }}
              >
                <span className={`transition-transform duration-150 ${
                  isTabClicked && activeTab === 'signup' ? 'scale-95' : 'scale-100'
                }`}>
                  Daftar
                </span>
                {activeTab === 'signup' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-pulse rounded-md" />
                )}
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={enhancedHandleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-foreground">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="text"
                      placeholder="email@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      onBlur={() => setLoginData(prev => ({ ...prev, email: prev.email.trim() }))}
                      className="pl-10 cyber-input"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 pr-10 cyber-input"
                      autoComplete="current-password"
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


                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium h-11 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  disabled={isLoading}
                >
                  <span className="flex items-center justify-center gap-2">
                    {isLoading ? "Login..." : "Login"}
                    {!isLoading && <Zap className="h-4 w-4" />}
                  </span>
                </Button>
              </form>

              {showApkButton && (
                <Button
                  onClick={() => window.open('https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/apk/elvisionv2.apk', '_blank')}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-medium h-9 py-1 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  Download APK
                </Button>
              )}

              {/* Forgot Password & Troubleshoot Links */}
              <div className="text-center">
                <button
                  onClick={() => setCurrentView('forgot-password')}
                  className="text-sm bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent font-medium hover:from-orange-300 hover:to-yellow-300 transition-all duration-200 cursor-pointer"
                >
                  Forgot Password?
                </button>
                <span className="mx-2 text-muted-foreground">•</span>
                <button
                  onClick={() => setShowTroubleshoot(!showTroubleshoot)}
                  className="text-sm bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent font-medium hover:from-orange-300 hover:to-yellow-300 transition-all duration-200 cursor-pointer"
                >
                  Login Problem?
                </button>
                
                {/* Troubleshoot Options */}
                {showTroubleshoot && (
                  <div className="mt-3 p-3 bg-muted/30 rounded-lg border border-border/50 space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Login Problem?
                    </p>
                    <button
                      onClick={async () => {
                        toast({
                          title: "Clearing Cache",
                          description: "Clear all stale cache..",
                          duration: 2000,
                        });
                        
                        await iOSCacheCleaner.forceCleanReload();
                        // Will reload automatically
                      }}
                      className="w-full text-sm font-medium py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                    >
                      🧹 Clear Cache & Reload
                    </button>
                    <p className="text-xs text-muted-foreground/70">
                      Refresh system
                    </p>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or Login With..</span>
                </div>
              </div>

              <Button
                onClick={handleGoogleAuth}
                variant="outline"
                className="w-full h-11 border-border hover:bg-muted transition-all duration-200 transform hover:scale-105 active:scale-95"
                disabled={isLoading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={enhancedHandleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-displayname" className="text-foreground">
                    Display Name
                  </Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-displayname"
                      type="text"
                      placeholder="Enter your display name"
                      value={signupData.displayName}
                      onChange={(e) => setSignupData(prev => ({ ...prev, displayName: e.target.value }))}
                      className="pl-10 cyber-input"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-foreground">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="text"
                      placeholder="email@example.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                      onBlur={() => setSignupData(prev => ({ ...prev, email: prev.email.trim() }))}
                      className="pl-10 cyber-input"
                    />
                  </div>
                </div>


                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={signupData.password}
                      onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 pr-10 cyber-input"
                      autoComplete="new-password"
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
                  <Label htmlFor="signup-confirm-password" className="text-foreground">
                    Konfirmasi Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="pl-10 pr-10 cyber-input"
                      autoComplete="new-password"
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


                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium h-11 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  disabled={isLoading}
                >
                  <span className="flex items-center justify-center gap-2">
                    {isLoading ? "Create account..." : "Sign Up"}
                    {!isLoading && <Sparkles className="h-4 w-4" />}
                  </span>
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Login With Google</span>
                </div>
              </div>

              <Button
                onClick={handleGoogleAuth}
                variant="outline"
                className="w-full h-11 border-border hover:bg-muted transition-all duration-200 transform hover:scale-105 active:scale-95"
                disabled={isLoading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
            </TabsContent>
          </Tabs>
        </Card>


        {/* WhatsApp Customer Service Button */}
        <div className="text-center mt-6">
          <Button
            variant="outline"
            onClick={() => {
              const message = encodeURIComponent("Hi About Ekosistem..");
              window.open(`https://wa.me/62895325633487?text=${message}`, '_blank');
            }}
            className="w-full max-w-md bg-green-50 hover:bg-green-100 text-green-700 border-green-200 hover:border-green-300"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Ask Customer Service
          </Button>
        </div>

        {/* Privacy Policy and Terms Links */}
        <div className="text-center mt-6 space-x-4">
          <a
            href="/privacy-policy"
            className="text-muted-foreground hover:text-foreground text-sm transition-all duration-200 underline"
          >
            Privacy Policy
          </a>
          <span className="text-muted-foreground">•</span>
          <a
            href="/terms"
            className="text-muted-foreground hover:text-foreground text-sm transition-all duration-200 underline"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  );
}