// 🎯 Facebook Pixel FBC/FBP Enhanced Tracking System

// 🔐 SHA-256 Hash Helper
export const sha256 = async (message: string): Promise<string> => {
  if (!message) return "";
  const msgBuffer = new TextEncoder().encode(message.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

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
  }
};

// 🍪 Get Both FBC and FBP Cookies
export const getFbcFbpCookies = (): { fbc: string | null; fbp: string | null } => {
  return {
    fbc: getFbcCookieHelper('_fbc'),
    fbp: getFbcCookieHelper('_fbp')
  };
};

export interface AdvancedMatchingData {
  em?: string; // Email
  ph?: string; // Phone
  fn?: string; // First Name
  ln?: string; // Last Name
  ct?: string; // City
  st?: string; // State
  zp?: string; // Zip
  country?: string; // Country
  external_id?: string; // System User ID
  db_id?: string; // Facebook Login ID
  fbc?: string;
  fbp?: string;
}

// 🔐 Hash User Data for Pixel
export const hashUserData = async (userData: AdvancedMatchingData): Promise<AdvancedMatchingData> => {
  const hashedData: AdvancedMatchingData = {};
  if (userData.em) hashedData.em = await sha256(userData.em);
  if (userData.ph) hashedData.ph = await sha256(userData.ph);
  if (userData.fn) hashedData.fn = await sha256(userData.fn);
  if (userData.ln) hashedData.ln = await sha256(userData.ln);
  if (userData.ct) hashedData.ct = await sha256(userData.ct);
  if (userData.st) hashedData.st = await sha256(userData.st);
  if (userData.zp) hashedData.zp = await sha256(userData.zp);
  if (userData.country) hashedData.country = await sha256(userData.country);
  if (userData.external_id) hashedData.external_id = userData.external_id; 
  if (userData.db_id) hashedData.db_id = userData.db_id;
  
  // FBC/FBP are not hashed
  if (userData.fbc) hashedData.fbc = userData.fbc;
  if (userData.fbp) hashedData.fbp = userData.fbp;

  return hashedData;
};

// 🚀 Pixel Initializer - Initialize Facebook Pixel with enhanced logging and error handling
export const initFacebookPixelWithLogging = (pixelId: string, userData?: AdvancedMatchingData): void => {
  if (typeof window === 'undefined') return;

  // 🛑 BLOCK INTERNAL TRAFFIC
  if (localStorage.getItem('DISABLE_FB_PIXEL')) {
    console.log('🚫 FB Pixel Initialized BLOCKED (DISABLE_FB_PIXEL flag found)');
    return;
  }

  // Initialize FBC/FBP cookies
  handleFbcCookieManager();

  try {
    if (!(window as any).fbq) {
      (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return; 
        n = f.fbq = function() { 
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
        t = b.createElement(e); t.async = !0; t.src = v; 
        t.onerror = function() { window.fbq = function() {}; };
        s = b.getElementsByTagName(e)[0]; 
        try { s.parentNode.insertBefore(t, s); } catch (e) {}
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    }
    
    // If userData provided, hash it (async) then init
    // But init is usually immediate. We can fire init without data, then init again with data?
    // Or we handle async here.
    if (userData) {
      hashUserData(userData).then(hashed => {
        (window as any).fbq('init', pixelId, hashed);
      });
    } else {
      (window as any).fbq('init', pixelId);
    }
  } catch (error) {
    console.log('FB Pixel initialization failed, app continues:', error);
  }
};

// 🔄 Update Pixel User Data (Manual Advanced Matching)
export const updatePixelUserData = async (pixelId: string, userData: AdvancedMatchingData): Promise<void> => {
  if (typeof window === 'undefined' || !(window as any).fbq) return;
  const hashed = await hashUserData(userData);
  (window as any).fbq('init', pixelId, hashed);
};

// ⭐ Generic Track Helper
const trackEvent = async (eventName: string, eventData: any = {}, options: { eventID?: string, pixelId?: string, userData?: AdvancedMatchingData } = {}) => {
  if (typeof window === 'undefined' || !(window as any).fbq) return;

  // 🛑 BLOCK INTERNAL TRAFFIC
  if (localStorage.getItem('DISABLE_FB_PIXEL')) {
    console.log(`🚫 FB Pixel Event '${eventName}' BLOCKED (DISABLE_FB_PIXEL flag found)`);
    return;
  }

  try {
    // If userData and pixelId are present, update user data first
    if (options.userData && options.pixelId) {
      await updatePixelUserData(options.pixelId, options.userData);
    }

    const trackOptions: any = {};
    if (options.eventID) {
      trackOptions.eventID = options.eventID;
    }

    (window as any).fbq('track', eventName, eventData, trackOptions);
  } catch (error) {
    console.log(`FB Pixel ${eventName} tracking failed:`, error);
  }
};

// ⭐ View Content Tracker
export const trackViewContentEvent = async (eventData: any = {}, eventID?: string, pixelId?: string, userData?: AdvancedMatchingData): Promise<void> => {
  await trackEvent('ViewContent', eventData, { eventID, pixelId, userData });
};

// 📄 Page View Tracker
export const trackPageViewEvent = async (eventData: any = {}, eventID?: string, pixelId?: string, userData?: AdvancedMatchingData): Promise<void> => {
  await trackEvent('PageView', eventData, { eventID, pixelId, userData });
};

// 🛒 Add to Cart Tracker
export const trackAddToCartEvent = async (eventData: any = {}, eventID?: string, pixelId?: string, userData?: AdvancedMatchingData): Promise<void> => {
  await trackEvent('AddToCart', eventData, { eventID, pixelId, userData });
};

// 💰 Purchase Tracker
export const trackPurchaseEvent = async (eventData: any = {}, eventID?: string, pixelId?: string, userData?: AdvancedMatchingData): Promise<void> => {
  await trackEvent('Purchase', eventData, { eventID, pixelId, userData });
};

// 💳 Add Payment Info Tracker
export const trackAddPaymentInfoEvent = async (eventData: any = {}, eventID?: string, pixelId?: string, userData?: AdvancedMatchingData): Promise<void> => {
  await trackEvent('AddPaymentInfo', eventData, { eventID, pixelId, userData });
};

// 🎯 Custom Event Tracker
export const trackCustomEvent = async (eventName: string, eventData: any = {}, eventID?: string, pixelId?: string, userData?: AdvancedMatchingData): Promise<void> => {
  await trackEvent(eventName, eventData, { eventID, pixelId, userData });
};