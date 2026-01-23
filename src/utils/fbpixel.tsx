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

// 🍪 Cookie Helper - Set cookie with domain handling
export const setCookieHelper = (name: string, value: string, days: number = 90) => {
    if (typeof document === 'undefined') return;
    
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    
    // Attempt to set on root domain for better persistence
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    let domain = hostname;
    
    // If we have at least 2 parts (e.g. example.com), try to set on .example.com
    // This covers subdomains like app.example.com -> .example.com
    if (parts.length >= 2 && !hostname.includes('localhost') && !/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
        domain = '.' + parts.slice(-2).join('.');
    }

    document.cookie = `${name}=${value}; ${expires}; path=/; domain=${domain}; SameSite=Lax`;
    
    // Fallback: Set on current domain if the above fails or just to be safe
    document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`;
};

// 🍪 FBC Cookie Helper - Get browser cookie value
export const getFbcCookieHelper = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// 🔗 FBC URL Extractor - Get fbclid from URL parameters (Search OR Hash)
export const getFbcClickIdFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Check Search Query (?fbclid=...)
  const urlParams = new URLSearchParams(window.location.search);
  const fromSearch = urlParams.get('fbclid');
  if (fromSearch) return fromSearch;

  // Check Hash (#...?fbclid=... or #/page?fbclid=...)
  if (window.location.hash) {
     const hashString = window.location.hash.includes('?') 
        ? window.location.hash.split('?')[1] 
        : '';
     const hashParams = new URLSearchParams(hashString);
     const fromHash = hashParams.get('fbclid');
     if (fromHash) return fromHash;
  }

  return null;
};

// 🔧 FBC Formatter - Format FBC cookie according to Meta standards
export const formatFbcCookieValue = (fbclid: string): string => {
  const timestamp = Date.now();
  // fb.1 is standard for top-level domain cookies
  // fb.2 is often used for www. subdomains
  // We'll stick to 'fb.1' as a safe default for root-domain cookies which we prefer
  const version = 'fb';
  const subdomainIndex = 1; 
  return `${version}.${subdomainIndex}.${timestamp}.${fbclid}`;
};

// 💾 Save FBC Data to Cookie & LocalStorage
export const setFbcData = (fbclid: string) => {
    if (!fbclid) return;

    const formattedFbc = formatFbcCookieValue(fbclid);
    
    // 1. Set Cookie
    setCookieHelper('_fbc', formattedFbc, 90);
    
    // 2. Set LocalStorage (Backup)
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('_fbc_backup', formattedFbc);
        localStorage.setItem('_fbc_timestamp', Date.now().toString());
    }
};

// 🔗 FBC Cookie Manager - Handle FBC cookie creation and storage
export const handleFbcCookieManager = (): void => {
  const fbclid = getFbcClickIdFromUrl();
  if (fbclid) {
    setFbcData(fbclid);
  }
};

// 🍪 Get Both FBC and FBP Cookies (with LocalStorage & URL Fallback)
export const getFbcFbpCookies = (): { fbc: string | null; fbp: string | null } => {
  let fbc = getFbcCookieHelper('_fbc');
  let fbp = getFbcCookieHelper('_fbp');

  // FBC Fallback 1: LocalStorage
  if (!fbc && typeof window !== 'undefined' && window.localStorage) {
      const backup = localStorage.getItem('_fbc_backup');
      if (backup) {
          // Check if backup is not too old (90 days)
          const ts = localStorage.getItem('_fbc_timestamp');
          const maxAge = 90 * 24 * 60 * 60 * 1000;
          if (ts && (Date.now() - parseInt(ts)) < maxAge) {
             fbc = backup;
             // Try to revive cookie
             setCookieHelper('_fbc', backup, 90);
          }
      }
  }

  // FBC Fallback 2: URL Direct
  if (!fbc) {
      const currentFbclid = getFbcClickIdFromUrl();
      if (currentFbclid) {
          fbc = formatFbcCookieValue(currentFbclid);
          // Save it now that we found it
          setFbcData(currentFbclid);
      }
  }

  return { fbc, fbp };
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