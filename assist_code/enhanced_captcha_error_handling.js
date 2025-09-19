// Enhanced CAPTCHA Error Handling for Auth.tsx and Signup.tsx

// 1. Add useRef for Turnstile widget
const turnstileRef = useRef(null);

// 2. Enhanced error handling function
const handleCaptchaError = (error) => {
  console.error('CAPTCHA error:', error);
  setCaptchaToken(null);
  
  // Reset the widget
  if (turnstileRef.current) {
    turnstileRef.current.reset();
  }
  
  toast({
    title: "CAPTCHA Error",
    description: "Please try the CAPTCHA again. If this persists, refresh the page.",
    variant: "destructive",
  });
};

// 3. Enhanced Turnstile component with ref and retry
<Turnstile
  ref={turnstileRef}
  siteKey="0x4AAAAAAB1zRiolDtnT61Ah"
  onSuccess={(token) => {
    setCaptchaToken(token);
  }}
  onError={handleCaptchaError}
  onExpire={() => {
    setCaptchaToken(null);
    // Auto-refresh on expire
    if (turnstileRef.current) {
      setTimeout(() => turnstileRef.current.reset(), 1000);
    }
  }}
  options={{
    action: 'login', // or 'signup', 'forgot-password'
    theme: 'light',
    size: 'normal',
    retry: 'auto'
  }}
/>

// 4. Enhanced auth function with specific CAPTCHA error handling
const enhancedHandleLogin = async (e) => {
  e.preventDefault();

  if (!captchaToken) {
    toast({
      title: "CAPTCHA Required",
      description: "Please complete the CAPTCHA verification.",
      variant: "destructive",
    });
    return;
  }

  setIsLoading(true);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
      options: {
        captchaToken: captchaToken
      }
    });

    if (error) {
      // Specific handling for CAPTCHA verification failed
      if (error.message.includes('captcha') || error.message.includes('verification failed')) {
        setCaptchaToken(null);
        if (turnstileRef.current) {
          turnstileRef.current.reset();
        }
        toast({
          title: "CAPTCHA Verification Failed",
          description: "Please complete the CAPTCHA again.",
          variant: "destructive",
        });
        return;
      }
      throw error;
    }

    if (data.user) {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      onLogin(data.user);
    }
  } catch (error) {
    toast({
      title: "Login Failed",
      description: error.message || "An error occurred during login.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

// 5. Token freshness check before submit
const checkTokenFreshness = () => {
  // If token is older than 5 minutes, refresh
  if (captchaToken && tokenTimestamp && Date.now() - tokenTimestamp > 300000) {
    setCaptchaToken(null);
    if (turnstileRef.current) {
      turnstileRef.current.reset();
    }
    toast({
      title: "CAPTCHA Expired",
      description: "Please complete the CAPTCHA again.",
      variant: "destructive",
    });
    return false;
  }
  return true;
};