// 🎯 Facebook Pixel FBC/FBP Enhanced Tracking System

// 🍪 FBC Cookie Helper - Get browser cookie value
export const getFbcCookieHelper = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// 🔗 FBC URL Extractor - Get fbclid from URL parameters
export const getFbcClickIdFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('fbclid');
};

// 🔧 FBC Formatter - Format FBC cookie according to Meta standards
export const formatFbcCookieValue = (fbclid: string): string => {
  const timestamp = Date.now();
  const hostname = window.location.hostname;
  let subdomainIndex = 1; // Default for most domains
  if (hostname === 'com') subdomainIndex = 0;
  else if (hostname.includes('www.')) subdomainIndex = 2;
  return `fb.${subdomainIndex}.${timestamp}.${fbclid}`;
};

// 🔗 FBC Cookie Manager - Handle FBC cookie creation and storage
export const handleFbcCookieManager = (): void => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  const fbclid = getFbcClickIdFromUrl();
  if (fbclid) {
    const formattedFbc = formatFbcCookieValue(fbclid);
    const expires = new Date(Date.now() + 90*24*60*60*1000).toUTCString();
    document.cookie = `_fbc=${formattedFbc}; expires=${expires}; path=/`;
    // console.log('🔗 FBC Cookie Manager - Click ID stored:', formattedFbc);
  }
};

// 🔐 Email Hash Generator - Hash email for privacy compliance
export const hashEmailForPixel = (email: string): string => {
  if (!email) return '';
  // Simple SHA-256 hash simulation for email (Meta requires hashed emails)
  return btoa(email.toLowerCase().trim()).replace(/[^a-zA-Z0-9]/g, '');
};

// 👤 First Name Hash Generator - Hash first name for privacy compliance  
export const hashFirstNameForPixel = (firstName: string): string => {
  if (!firstName) return '';
  // Simple hash for first name (Meta requires hashed names)
  return btoa(firstName.toLowerCase().trim()).replace(/[^a-zA-Z0-9]/g, '');
};

// 📊 Enhanced Tracking Parameters - Get FBC/FBP + user data
export const getEnhancedTrackingParams = (email?: string, firstName?: string): { 
  fbc?: string; 
  fbp?: string; 
  em?: string; 
  fn?: string; 
} => {
  const fbc = getFbcCookieHelper('_fbc');
  const fbp = getFbcCookieHelper('_fbp');
  
  const params: { fbc?: string; fbp?: string; em?: string; fn?: string } = {};
  
  if (fbc) {
    params.fbc = fbc;
    // console.log('📊 FBC Click ID Parameter - Found:', fbc);
  }
  if (fbp) {
    params.fbp = fbp;
    // console.log('📊 FBP Browser Parameter - Found:', fbp);
  }
  if (email) {
    params.em = hashEmailForPixel(email);
    // console.log('📧 Email Parameter - Hashed and added');
  }
  if (firstName) {
    params.fn = hashFirstNameForPixel(firstName);
    // console.log('👤 First Name Parameter - Hashed and added');
  }
  
  return params;
};

// 📊 FBC/FBP Tracking Parameters - Get basic tracking data (backward compatibility)
export const getFbcFbpTrackingParams = (): { fbc?: string; fbp?: string } => {
  const enhanced = getEnhancedTrackingParams();
  return { fbc: enhanced.fbc, fbp: enhanced.fbp };
};

// 🚀 Pixel Initializer - Initialize Facebook Pixel with enhanced logging and error handling
export const initFacebookPixelWithLogging = (pixelId: string): void => {
  if (typeof window === 'undefined' || window.fbq) return;

  // console.log('🚀 Pixel Initializer - Starting Facebook Pixel setup');
  
  try {
    (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return; 
      n = f.fbq = function() { 
        try {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        } catch (error) {
          console.log('FB Pixel method call failed, continuing:', error);
        }
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; 
      
      // Add error handler for script load failure
      t.onerror = function() {
        // Silent fail - no console logs
        // Create a dummy fbq function to prevent errors
        window.fbq = function() {
          // Silent - no tracking logs
        };
      };
      
      s = b.getElementsByTagName(e)[0]; 
      // Wrap insertion in try-catch to handle blocked requests silently
      try {
        s.parentNode.insertBefore(t, s);
      } catch (e) {
        // Silent fail if blocked by client/ad blocker
      }
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    
    // Wrap init call in try-catch
    setTimeout(() => {
      try {
        window.fbq('init', pixelId);
        // console.log('🚀 Pixel Initializer - Facebook Pixel ready with ID:', pixelId);
      } catch (error) {
        console.log('FB Pixel init failed, continuing:', error);
      }
    }, 100);
  } catch (error) {
    console.log('FB Pixel initialization failed, app continues:', error);
    // Create fallback function to prevent future errors
    window.fbq = function() {
      console.log('FB Pixel unavailable, tracking skipped');
    };
  }
};

// ⭐ View Content Tracker - Track ViewContent events with enhanced data
export const trackViewContentEvent = (eventData: any = {}, email?: string, firstName?: string): void => {
  if (typeof window === 'undefined' || !window.fbq) return;
  
  try {
    const trackingParams = getEnhancedTrackingParams(email, firstName);
    // console.log('⭐ View Content Tracker - Tracking ViewContent event');
    window.fbq('track', 'ViewContent', eventData, trackingParams);
  } catch (error) {
    console.log('FB Pixel ViewContent tracking failed, continuing:', error);
  }
};

// 📄 Page View Tracker - Track PageView events with enhanced data
export const trackPageViewEvent = (eventData: any = {}, email?: string, firstName?: string): void => {
  if (typeof window === 'undefined' || !window.fbq) return;
  
  try {
    const trackingParams = getEnhancedTrackingParams(email, firstName);
    // console.log('📄 Page View Tracker - Tracking PageView event');
    window.fbq('track', 'PageView', eventData, trackingParams);
  } catch (error) {
    console.log('FB Pixel PageView tracking failed, continuing:', error);
  }
};

// 🛒 Add to Cart Tracker - Track AddToCart events with enhanced data
export const trackAddToCartEvent = (eventData: any = {}, email?: string, firstName?: string): void => {
  if (typeof window === 'undefined' || !window.fbq) return;
  
  try {
    const trackingParams = getEnhancedTrackingParams(email, firstName);
    // console.log('🛒 Add to Cart Tracker - Tracking AddToCart event');
    window.fbq('track', 'AddToCart', eventData, trackingParams);
  } catch (error) {
    console.log('FB Pixel AddToCart tracking failed, continuing:', error);
  }
};

// 💰 Purchase Tracker - Track Purchase events with enhanced data
export const trackPurchaseEvent = (eventData: any = {}, email?: string, firstName?: string): void => {
  if (typeof window === 'undefined' || !window.fbq) return;
  
  try {
    const trackingParams = getEnhancedTrackingParams(email, firstName);
    // console.log('💰 Purchase Tracker - Tracking Purchase event');
    // console.log('💰 Purchase Data:', eventData);
    window.fbq('track', 'Purchase', eventData, trackingParams);
  } catch (error) {
    console.log('FB Pixel Purchase tracking failed, continuing:', error);
  }
};

// 🎯 Generic Event Tracker - Track any custom events with FBC/FBP
export const trackGenericPixelEvent = (eventName: string, eventData: any = {}, customData: any = {}): void => {
  if (typeof window === 'undefined' || !window.fbq) return;
  
  try {
    const trackingParams = getFbcFbpTrackingParams();
    const enhancedCustomData = { ...customData, ...trackingParams };
    // console.log(`🎯 Generic Event Tracker - Tracking ${eventName} event`);
    window.fbq('track', eventName, eventData, enhancedCustomData);
  } catch (error) {
    console.log(`FB Pixel ${eventName} tracking failed, continuing:`, error);
  }
};