# Cloudflare Turnstile Backup

This file contains all the Turnstile Cloudflare CAPTCHA implementation code from Auth.tsx and Signup.tsx as a backup.

## Cloudflare Turnstile Dashboard Configuration

### Hostnames Configuration
The following hostnames are configured in the Cloudflare Turnstile dashboard:

1. **127.0.0.1** - Local development
2. **192.168.100.152** - Local network development
3. **app.elvisiongroup.com** - Production domain
4. **localhost** - Local development
5. **nlrgdhpmsittuwiiindq.supabase.co** - Supabase hosted domain

### Widget Configuration
- **Widget Mode**: MANAGED
- **Pre-Clearance**: YES
- **Level Pre-Clearance**: Managed
- **Site Key**: 0x4AAAAAAB1zRiolDtnT61Ah

### Dashboard Settings
- Total configured hostnames: 5 items
- All hostnames are active and configured for the same site key
- Widget operates in managed mode with pre-clearance enabled

## Import Statement
```tsx
import { Turnstile } from '@marsidev/react-turnstile';
```

## Environment Variable Check
```tsx
// Check for required environment variables
const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
if (!turnstileSiteKey) {
  console.error('Missing VITE_TURNSTILE_SITE_KEY environment variable');
}
```

## State Management
```tsx
// Captcha token state
const [captchaToken, setCaptchaToken] = useState<string | null>(null);
const [tokenTimestamp, setTokenTimestamp] = useState<number | null>(null);

// Refs for Turnstile widgets
const loginTurnstileRef = useRef<any>(null);
const signupTurnstileRef = useRef<any>(null);
const forgotPasswordTurnstileRef = useRef<any>(null);
```

## CAPTCHA Handler Functions
```tsx
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

const resetCaptcha = (ref: any) => {
  if (ref?.current) {
    ref.current.reset();
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
```

## Turnstile Component Implementation

### Login Turnstile
```tsx
{/* Turnstile CAPTCHA */}
<div className="flex justify-center">
  <Turnstile
    ref={loginTurnstileRef}
    siteKey={turnstileSiteKey}
    onSuccess={handleCaptchaSuccess}
    onError={handleCaptchaError}
    onExpire={handleCaptchaExpire}
    options={{
      action: 'login',
      theme: 'light',
      size: 'normal',
      retry: 'auto'
    }}
  />
</div>
```

### Signup Turnstile
```tsx
{/* Turnstile CAPTCHA */}
<div className="flex justify-center">
  <Turnstile
    ref={signupTurnstileRef}
    siteKey={turnstileSiteKey}
    onSuccess={handleCaptchaSuccess}
    onError={handleCaptchaError}
    onExpire={handleCaptchaExpire}
    options={{
      action: 'signup',
      theme: 'light',
      size: 'normal',
      retry: 'auto'
    }}
  />
</div>
```

### Forgot Password Turnstile
```tsx
{/* Turnstile CAPTCHA */}
<div className="flex justify-center">
  <Turnstile
    ref={forgotPasswordTurnstileRef}
    siteKey={turnstileSiteKey}
    onSuccess={handleCaptchaSuccess}
    onError={handleCaptchaError}
    onExpire={handleCaptchaExpire}
    options={{
      action: 'forgot-password',
      theme: 'light',
      size: 'normal',
      retry: 'auto'
    }}
  />
</div>
```

## Form Validation with CAPTCHA

### Login Form Validation
```tsx
const enhancedHandleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!captchaToken) {
    toast({
      title: "Captcha Required",
      description: "Please complete the captcha verification.",
      variant: "destructive",
    });
    return;
  }

  if (!checkTokenFreshness()) {
    resetCaptcha(loginTurnstileRef);
    return;
  }

  // ... rest of login logic with captchaToken
  const { data, error } = await supabase.auth.signInWithPassword({
    email: loginData.email,
    password: loginData.password,
    options: {
      captchaToken: captchaToken
    }
  });

  if (error) {
    // Specific handling for CAPTCHA verification failed
    if (error.message.toLowerCase().includes('captcha') || 
        error.message.toLowerCase().includes('verification failed') ||
        error.message.toLowerCase().includes('invalid captcha')) {
      setCaptchaToken(null);
      setTokenTimestamp(null);
      resetCaptcha(loginTurnstileRef);
      toast({
        title: "CAPTCHA Verification Failed",
        description: "Please complete the CAPTCHA again.",
        variant: "destructive",
      });
      return;
    }
    throw error;
  }
};
```

### Signup Form Validation
```tsx
const enhancedHandleSignup = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!captchaToken) {
    toast({
      title: "Captcha Required",
      description: "Please complete the captcha verification.",
      variant: "destructive",
    });
    return;
  }

  if (!checkTokenFreshness()) {
    resetCaptcha(signupTurnstileRef);
    return;
  }

  // ... rest of signup logic with captchaToken
  const { data, error } = await supabase.auth.signUp({
    email: signupData.email,
    password: signupData.password,
    options: {
      emailRedirectTo: redirectUrl,
      captchaToken,
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
    throw error;
  }
};
```

### Forgot Password Form Validation
```tsx
const handleForgotPassword = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!captchaToken) {
    toast({
      title: "Captcha Required",
      description: "Please complete the captcha verification.",
      variant: "destructive",
    });
    return;
  }

  // ... rest of forgot password logic
  const { error } = await supabase.auth.resetPasswordForEmail(
    forgotPasswordData.email,
    {
      redirectTo: `${window.location.origin}/reset-password`,
      captchaToken: captchaToken
    }
  );
};
```

## Button Disabled State
```tsx
<Button
  type="submit"
  disabled={isLoading || !captchaToken}
  // ... other props
>
  {/* Button content */}
</Button>
```

## Environment Variables Required
- `VITE_TURNSTILE_SITE_KEY`: Cloudflare Turnstile site key for the domain

## Features
- Token freshness validation (5 minutes expiry)
- Automatic CAPTCHA reset on errors
- Error handling for CAPTCHA verification failures
- Different actions for different forms (login, signup, forgot-password)
- Ref-based widget management for programmatic control
- Integration with Supabase auth methods

This backup preserves all Turnstile implementation details from both Auth.tsx and Signup.tsx files.