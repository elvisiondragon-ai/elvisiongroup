import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Check for password reset flow indicators in URL
    const checkResetFlow = () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const queryParams = new URLSearchParams(window.location.search);
      
      // Check for reset-related parameters
      const type = hashParams.get('type') || queryParams.get('type');
      const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
      
      // If this is a recovery type with access token, it's a valid reset flow
      if (type === 'recovery' && accessToken) {
        setHasToken(true);
        // Supabase automatically handles the session when user clicks email link
        // We just need to listen for the auth state change
      } else if (type === 'recovery') {
        // Recovery type but no token means it might have been processed already
        setHasToken(true);
      } else {
        setHasToken(false);
        toast({
          title: "Invalid Reset Link",
          description: "This reset link is invalid or has expired. Please request a new one.",
          variant: "destructive",
        });
      }
    };

    // Listen for auth state changes to detect successful token verification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change in reset:', event, session?.user?.email);
        
        if (event === 'PASSWORD_RECOVERY' && session?.user) {
          setHasToken(true);
          console.log('Password recovery session established');
        } else if (event === 'SIGNED_IN' && session?.user) {
          // User is signed in, which means token was valid
          setHasToken(true);
        }
      }
    );

    checkResetFlow();

    return () => subscription.unsubscribe();
  }, [toast]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasToken) {
      toast({
        title: "Invalid Reset Link",
        description: "This reset link is invalid or has expired.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Password Updated!",
        description: "Your password has been successfully updated.",
      });

      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message || "An error occurred while updating your password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/auth');
  };

  // Success View
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/lovable-uploads/fbd7b86c-d8ea-447e-87ad-d67254074e61.png" 
                alt="eL Vision Group Logo" 
                className="w-24 h-24 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold font-orbitron bg-gradient-primary bg-clip-text text-transparent">
              eL Vision Group
            </h1>
            <p className="text-muted-foreground mt-2">
              Password Updated Successfully
            </p>
          </div>

          <Card className="p-6 bg-gradient-secondary border-border text-center">
            <div className="mb-4">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Success!
              </h3>
              <p className="text-muted-foreground">
                Your password has been updated successfully. 
                You will be redirected to the home page shortly.
              </p>
            </div>

            <Button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium h-11"
            >
              Go to Home
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Invalid Token View
  if (!hasToken) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/lovable-uploads/fbd7b86c-d8ea-447e-87ad-d67254074e61.png" 
                alt="eL Vision Group Logo" 
                className="w-24 h-24 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold font-orbitron bg-gradient-primary bg-clip-text text-transparent">
              eL Vision Group
            </h1>
            <p className="text-muted-foreground mt-2">
              Invalid Reset Link
            </p>
          </div>

          <Card className="p-6 bg-gradient-secondary border-border text-center">
            <div className="mb-4">
              <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Link Invalid or Expired
              </h3>
              <p className="text-muted-foreground">
                This password reset link is invalid or has expired. 
                Please request a new password reset.
              </p>
            </div>

            <Button
              onClick={handleBackToLogin}
              className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium h-11"
            >
              Back to Login
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Reset Password Form
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/fbd7b86c-d8ea-447e-87ad-d67254074e61.png" 
              alt="eL Vision Group Logo" 
              className="w-24 h-24 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold font-orbitron bg-gradient-primary bg-clip-text text-transparent">
            eL Vision Group
          </h1>
          <p className="text-muted-foreground mt-2">
            Set Your New Password
          </p>
        </div>

        <Card className="p-6 bg-gradient-secondary border-border">
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10 pr-10 cyber-input"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="pl-10 pr-10 cyber-input"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium h-11"
              disabled={isLoading || !hasToken}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              onClick={handleBackToLogin}
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              Back to Login
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}