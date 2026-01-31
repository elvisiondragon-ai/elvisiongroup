// 🌐 IP Address Helper - Fetch client IP (IPv6 preferred)
export const getClientIp = async (): Promise<string | null> => {
  try {
    const response = await fetch('https://api64.ipify.org?format=json');
    if (!response.ok) throw new Error('IP fetch failed');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn('Failed to fetch client IP:', error);
    return null;
  }
};

// 🎯 Facebook Pixel FBC/FBP Enhanced Tracking System

// ⏳ Wait for FBP Cookie Helper
export const waitForFbp = async (timeout = 2000): Promise<string | null> => {
  const start = Date.now();
  // Poll every 100ms
  while (Date.now() - start < timeout) {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(^|;\s*)_fbp=([^;]+)/);
      if (match) return match[2];
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return null;
};

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
  
  // Check Hash (#...?fbclid=... or #/page?fbclid=...)
  let fbclid = fromSearch;
  if (!fbclid && window.location.hash) {
     const hashString = window.location.hash.includes('?') 
        ? window.location.hash.split('?')[1] 
        : '';
     const hashParams = new URLSearchParams(hashString);
     fbclid = hashParams.get('fbclid');
  }

  if (fbclid) {
    // 🛡️ SECURITY & QUALITY CHECK
    // Real fbclids are mixed case and reasonably long (usually 40+ chars).
    // We reject if:
    // 1. It contains "test" (case-insensitive)
    // 2. It is too short (< 20 chars), likely truncated
    // 3. It has NO uppercase letters (Meta tokens MUST be mixed-case. 
    //    If no uppercase, it was likely corrupted/lowercased by a tool).
    
    const hasUppercase = /[A-Z]/.test(fbclid);
    const hasLowercase = /[a-z]/.test(fbclid);
    const isTooShort = fbclid.length < 20;
    const isTest = /test/i.test(fbclid);
    
    // Valid Meta IDs are ALWAYS mixed case if they contain letters
    const isCorruptedLowercase = !hasUppercase && hasLowercase;

    if (isTest || isTooShort || isCorruptedLowercase) {
      console.warn("⚠️ Meta Pixel: Ignoring invalid/corrupted fbclid:", fbclid);
      return null;
    }
    return fbclid;
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
export const setFbcData = (fbclid: string, existingFormattedFbc?: string) => {
    if (!fbclid) return;

    const formattedFbc = existingFormattedFbc || formatFbcCookieValue(fbclid);
    
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

  // --- 🛡️ SAFETY CHECK: Discard suspicious lowercase FBC cookies ---
  if (fbc) {
    const parts = fbc.split('.');
    // Structure: fb.1.timestamp.fbclid
    if (parts.length >= 4) {
      const fbclid = parts.slice(3).join('.');
      
      // 🛡️ STRICT VALIDATION (Updated)
      // 1. Must have Uppercase (mixed case)
      // 2. Must be >= 15 chars (not truncated)
      // 3. No "test"
      
      const hasUppercase = /[A-Z]/.test(fbclid);
      const isTooShort = fbclid.length < 15;
      const isTest = /test/i.test(fbclid);
      const isAllLowercase = !hasUppercase && /[a-z]/.test(fbclid);

      if (isTest || isTooShort || isAllLowercase) {
        console.warn("⚠️ Discarding invalid (suspicious) FBC cookie:", fbc);
        fbc = null; 
      }
    }
  }

  // FBC Fallback 1: LocalStorage
  if (!fbc && typeof window !== 'undefined' && window.localStorage) {
      const backup = localStorage.getItem('_fbc_backup');
      if (backup) {
          // Check if backup is not too old (90 days)
          const ts = localStorage.getItem('_fbc_timestamp');
          const maxAge = 90 * 24 * 60 * 60 * 1000;
          if (ts && (Date.now() - parseInt(ts)) < maxAge) {
             // Verify backup value isn't also suspicious
             const parts = backup.split('.');
             let isBackupSuspicious = false;
             if (parts.length >= 4) {
               const fbclid = parts.slice(3).join('.');
               isBackupSuspicious = 
                (/^[a-z0-9_\-\.]+$/.test(fbclid) && /[a-z]/.test(fbclid) && fbclid.length > 20) ||
                /test/i.test(fbclid);
             }

             if (!isBackupSuspicious) {
               fbc = backup;
               // Try to revive cookie
               setCookieHelper('_fbc', backup, 90);
               console.log('♻️ FBC revived from LocalStorage:', fbc);
             } else {
               localStorage.removeItem('_fbc_backup');
               localStorage.removeItem('_fbc_timestamp');
             }
          }
      }
  }

  // FBC Fallback 2: URL Direct
  if (!fbc) {
      const currentFbclid = getFbcClickIdFromUrl();
      if (currentFbclid) {
          // 🔧 GENERATE ONCE, USE EVERYWHERE
          // This ensures the timestamp is identical for both the variable returned 
          // and the cookie saved. Prevents "modified value" errors in Meta.
          fbc = formatFbcCookieValue(currentFbclid);
          
          setFbcData(currentFbclid, fbc);
          console.log('🔗 FBC extracted from URL:', fbc);
      }
  }

  console.log(`🍪 getFbcFbpCookies result - FBC: ${fbc}, FBP: ${fbp}`);
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
  
  // Name Splitting Logic for better Match Quality
  let firstName = userData.fn;
  let lastName = userData.ln;
  
  if (firstName && !lastName && firstName.includes(' ')) {
    const parts = firstName.trim().split(/\s+/);
    firstName = parts[0];
    lastName = parts.slice(1).join(' ');
  }

  if (userData.em) hashedData.em = await sha256(userData.em);
  if (userData.ph) hashedData.ph = await sha256(userData.ph);
  if (firstName) hashedData.fn = await sha256(firstName);
  if (lastName) hashedData.ln = await sha256(lastName);
  if (userData.ct) hashedData.ct = await sha256(userData.ct);
  if (userData.st) hashedData.st = await sha256(userData.st);
  if (userData.zp) hashedData.zp = await sha256(userData.zp);
  if (userData.country) hashedData.country = await sha256(userData.country);
  
  // NOT HASHED fields (Meta Requirement)
  if (userData.external_id) hashedData.external_id = userData.external_id; 
  if (userData.db_id) hashedData.db_id = userData.db_id;
  
  if (userData.fbc) hashedData.fbc = userData.fbc;
  if (userData.fbp) hashedData.fbp = userData.fbp;

  return hashedData;
};

// 🚀 Pixel Initializer - Initialize Facebook Pixel with enhanced logging and error handling
// Global set to track initialized pixels and prevent duplicates
const initializedPixels = new Set<string>();

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
    
    // Prevent duplicate initialization for the same Pixel ID
    if (initializedPixels.has(pixelId)) {
        console.log(`ℹ️ Meta Pixel ${pixelId} already initialized. Skipping duplicate init.`);
        return;
    }

    // If userData provided, hash it (async) then init
    if (userData) {
      hashUserData(userData).then(hashed => {
        (window as any).fbq('init', pixelId, hashed);
        initializedPixels.add(pixelId);
      });
    } else {
      (window as any).fbq('init', pixelId);
      initializedPixels.add(pixelId);
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

// 🎯 TEST CODE MAPPING (Dynamic Source of Truth)
const TEST_CODE_MAPPING: Record<string, string> = {
  'testcode_indo': 'TEST23224', 
  'testcode_usa': 'TEST88049',
};

// ⭐ Generic Track Helper
const trackEvent = async (eventName: string, eventData: any = {}, options: { eventID?: string, pixelId?: string, userData?: AdvancedMatchingData, testCode?: string } = {}) => {
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
    
    // Resolve Test Code from Mapping
    if (options.testCode) {
        trackOptions.test_event_code = TEST_CODE_MAPPING[options.testCode] || options.testCode;
    }

    if (options.pixelId) {
       // 🎯 Target SPECIFIC Pixel ID (Prevents cross-firing in SPA)
       (window as any).fbq('trackSingle', options.pixelId, eventName, eventData, trackOptions);
    } else {
       // 📢 Broadcast to ALL initialized pixels (Fallback)
       (window as any).fbq('track', eventName, eventData, trackOptions);
    }
  } catch (error) {
    console.log(`FB Pixel ${eventName} tracking failed:`, error);
  }
};

// ⭐ View Content Tracker
export const trackViewContentEvent = async (eventData: any = {}, eventID?: string, pixelId?: string, userData?: AdvancedMatchingData, testCode?: string): Promise<void> => {
  await trackEvent('ViewContent', eventData, { eventID, pixelId, userData, testCode });
};

// 📄 Page View Tracker
export const trackPageViewEvent = async (eventData: any = {}, eventID?: string, pixelId?: string, userData?: AdvancedMatchingData, testCode?: string): Promise<void> => {
  await trackEvent('PageView', eventData, { eventID, pixelId, userData, testCode });
};

// 🛒 Add to Cart Tracker
export const trackAddToCartEvent = async (eventData: any = {}, eventID?: string, pixelId?: string, userData?: AdvancedMatchingData, testCode?: string): Promise<void> => {
  await trackEvent('AddToCart', eventData, { eventID, pixelId, userData, testCode });
};

// 💰 Purchase Tracker
export const trackPurchaseEvent = async (eventData: any = {}, eventID?: string, pixelId?: string, userData?: AdvancedMatchingData, testCode?: string): Promise<void> => {
  await trackEvent('Purchase', eventData, { eventID, pixelId, userData, testCode });
};

// 💳 Add Payment Info Tracker
export const trackAddPaymentInfoEvent = async (eventData: any = {}, eventID?: string, pixelId?: string, userData?: AdvancedMatchingData, testCode?: string): Promise<void> => {
  await trackEvent('AddPaymentInfo', eventData, { eventID, pixelId, userData, testCode });
};

// 🎯 Custom Event Tracker
export const trackCustomEvent = async (eventName: string, eventData: any = {}, eventID?: string, pixelId?: string, userData?: AdvancedMatchingData, testCode?: string): Promise<void> => {
  await trackEvent(eventName, eventData, { eventID, pixelId, userData, testCode });
};