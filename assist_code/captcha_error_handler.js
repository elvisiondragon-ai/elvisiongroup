// Enhanced CAPTCHA Error Handler for Auth.tsx and Signup.tsx
// Add this to improve CAPTCHA reliability

// 1. Add retry mechanism for failed CAPTCHA
const handleCaptchaError = (error, setCaptchaToken, toast) => {
  console.error('CAPTCHA error:', error);
  setCaptchaToken(null);
  
  toast({
    title: "CAPTCHA Error",
    description: "Please try the CAPTCHA again. If this persists, refresh the page.",
    variant: "destructive",
  });
};

// 2. Add CAPTCHA refresh functionality
const refreshCaptcha = (turnstileRef) => {
  if (turnstileRef.current) {
    turnstileRef.current.reset();
  }
};

// 3. Enhanced Turnstile component with better error handling
const EnhancedTurnstile = ({ onSuccess, onError, onExpire }) => {
  const [retryCount, setRetryCount] = useState(0);
  const turnstileRef = useRef(null);

  return (
    <div className="flex flex-col items-center space-y-2">
      <Turnstile
        ref={turnstileRef}
        siteKey="0x4AAAAAAB1zRiolDtnT61Ah"
        onSuccess={(token) => {
          setRetryCount(0);
          onSuccess(token);
        }}
        onError={(error) => {
          setRetryCount(prev => prev + 1);
          onError(error);
          
          // Auto-retry up to 2 times
          if (retryCount < 2) {
            setTimeout(() => {
              turnstileRef.current?.reset();
            }, 2000);
          }
        }}
        onExpire={() => {
          onExpire();
          // Auto-refresh on expire
          setTimeout(() => {
            turnstileRef.current?.reset();
          }, 1000);
        }}
        options={{
          theme: 'light',
          size: 'normal',
          retry: 'auto',
          'retry-interval': 8000
        }}
      />
      
      {retryCount > 0 && (
        <button
          type="button"
          onClick={() => {
            setRetryCount(0);
            turnstileRef.current?.reset();
          }}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Refresh CAPTCHA ({retryCount}/2 retries)
        </button>
      )}
    </div>
  );
};

// 4. SQL to check specific user issues
/*
-- Run this to check if rizakhomsin@yahoo.com has account issues:

SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    last_sign_in_at,
    raw_user_meta_data->>'display_name' as display_name
FROM auth.users 
WHERE email = 'rizakhomsin@yahoo.com';

-- If user exists but has issues, try:
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    updated_at = NOW()
WHERE email = 'rizakhomsin@yahoo.com';

-- Clear any stuck sessions:
DELETE FROM auth.sessions 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'rizakhomsin@yahoo.com');
*/