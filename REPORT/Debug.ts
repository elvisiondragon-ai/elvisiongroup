/**
 * Browser Console Debug Tools
 * Usage: Open browser console and type:
 * - window.debug.checkIdle()
 * - window.debug.checkSession()
 * - window.debug.checkWebSocket()
 * - window.debug.checkAll()
 * - window.debug.forceIdleWake()
 * - window.debug.clearAllCache()
 * - window.debug.testRefreshRedirect()
 * - window.debug.checkRedirectFlags()
 */

import { supabase } from "@/integrations/supabase/client";

export const setupDebugTools = () => {
  const debugTools = {
    /**
     * Check if user is currently in idle state
     * Usage: window.debug.checkIdle()
     */
    checkIdle: () => {
      const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                    (window.navigator as any).standalone === true;

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/i.test(navigator.userAgent);

      const result = {
        isPWA,
        platform: isIOS ? 'iOS' : isAndroid ? 'Android' : 'Browser',
        documentHidden: document.hidden,
        visibilityState: document.visibilityState,
        lastActive: localStorage.getItem('last-active-time') || 'N/A',
        idleFlags: {
          wasIdle: localStorage.getItem('was-idle') === 'true',
          iosNeedsRecovery: localStorage.getItem('ios-needs-recovery') === 'true',
          needsRecovery: localStorage.getItem('needs-recovery') === 'true'
        }
      };

      console.table(result);
      return result;
    },

    /**
     * Check session validity
     * Usage: window.debug.checkSession()
     */
    checkSession: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('❌ Session Error:', error);
        return { valid: false, error };
      }

      if (!session) {
        console.warn('⚠️ No active session');
        return { valid: false, message: 'No session found' };
      }

      // Fetch display_name from profile for privacy
      let displayName = 'Anonymous';
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('user_id', session.user.id)
          .single();

        displayName = profile?.display_name || 'Anonymous';
      } catch (e) {
        console.warn('⚠️ Could not fetch display name');
      }

      const expiryTime = new Date(session.expires_at! * 1000);
      const now = new Date();
      const timeUntilExpiry = expiryTime.getTime() - now.getTime();
      const hoursUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60 * 60));
      const minutesUntilExpiry = Math.floor((timeUntilExpiry % (1000 * 60 * 60)) / (1000 * 60));

      const result = {
        valid: true,
        userId: session.user.id,
        displayName: displayName,
        expiresAt: expiryTime.toISOString(),
        timeRemaining: `${hoursUntilExpiry}h ${minutesUntilExpiry}m`,
        isExpired: timeUntilExpiry <= 0,
        accessToken: session.access_token.substring(0, 20) + '...',
        refreshToken: session.refresh_token ? session.refresh_token.substring(0, 20) + '...' : 'N/A'
      };

      console.log('✅ Session Valid');
      console.table(result);
      return result;
    },

    /**
     * Check WebSocket/Realtime connection status
     * Usage: window.debug.checkWebSocket()
     */
    checkWebSocket: () => {
      const channels = supabase.getChannels();
      const realtimeStatus = (supabase.realtime as any).connectionState();

      const result = {
        connectionState: realtimeStatus,
        activeChannels: channels.length,
        channels: channels.map(ch => ({
          topic: ch.topic,
          state: ch.state,
          joinRef: (ch as any).joinRef
        }))
      };

      console.log('🔌 WebSocket Status:');
      console.log('Connection State:', realtimeStatus);
      console.log('Active Channels:', channels.length);
      console.table(result.channels);

      return result;
    },

    /**
     * Check Pro subscription status
     * Usage: window.debug.checkProStatus()
     */
    checkProStatus: async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        console.warn('⚠️ No user session');
        return { valid: false };
      }

      try {
        const { data, error } = await supabase.rpc('check_unified_pro_status', {
          p_user_id: session.user.id
        });

        if (error) throw error;

        const result = {
          isPro: data?.[0]?.is_pro || false,
          subscriptionType: data?.[0]?.subscription_type || 'None',
          status: data?.[0]?.status || 'N/A',
          expiresAt: data?.[0]?.expires_at || 'N/A',
          daysRemaining: data?.[0]?.days_remaining || 0
        };

        console.log(result.isPro ? '⭐ PRO User' : '👤 Free User');
        console.table(result);
        return result;
      } catch (error) {
        console.error('❌ Pro status check failed:', error);
        return { error };
      }
    },

    /**
     * Check redirect flags in localStorage
     * Usage: window.debug.checkRedirectFlags()
     */
    checkRedirectFlags: () => {
      const flags = {
        chat: localStorage.getItem('refresh-redirect-to-chat'),
        payment: localStorage.getItem('refresh-redirect-to-payment'),
        profile: localStorage.getItem('refresh-redirect-to-profile'),
        home: localStorage.getItem('refresh-redirect-to-home'),
        journal: localStorage.getItem('refresh-redirect-to-journal'),
        eliteHabit: localStorage.getItem('refresh-redirect-to-elite-habit'),
        meditation: localStorage.getItem('refresh-redirect-to-meditation'),
        audio: localStorage.getItem('refresh-redirect-to-audio')
      };

      const activeFlags = Object.entries(flags)
        .filter(([_, value]) => value === 'true')
        .map(([key, _]) => key);

      console.log('🚩 Redirect Flags Status:');
      console.table(flags);

      if (activeFlags.length > 0) {
        console.warn('⚠️ Active redirect flags:', activeFlags.join(', '));
      } else {
        console.log('✅ No active redirect flags');
      }

      return { flags, activeFlags };
    },

    /**
     * Test refresh-redirect mechanism
     * Usage: window.debug.testRefreshRedirect('chat')
     */
    testRefreshRedirect: (tab: string = 'chat') => {
      const validTabs = ['chat', 'payment', 'profile', 'home', 'journal', 'elite-habit', 'meditation', 'audio'];

      if (!validTabs.includes(tab)) {
        console.error(`❌ Invalid tab: ${tab}. Valid tabs:`, validTabs);
        return { error: 'Invalid tab' };
      }

      const flagKey = `refresh-redirect-to-${tab}`;

      console.log(`🧪 Testing refresh-redirect to: ${tab}`);
      console.log(`1. Setting flag: ${flagKey} = true`);
      localStorage.setItem(flagKey, 'true');

      console.log(`2. Checking flag...`);
      const flagValue = localStorage.getItem(flagKey);
      console.log(`   Flag value: ${flagValue}`);

      if (flagValue === 'true') {
        console.log('✅ Flag set successfully');
        console.log('3. Reloading page in 2 seconds...');
        console.log(`   Expected: App should navigate to ${tab} tab after reload`);

        setTimeout(() => {
          window.location.reload();
        }, 2000);

        return { success: true, tab, flagKey };
      } else {
        console.error('❌ Flag not set correctly');
        return { success: false, tab, flagKey };
      }
    },

    /**
     * Clear all redirect flags
     * Usage: window.debug.clearRedirectFlags()
     */
    clearRedirectFlags: () => {
      const flags = [
        'refresh-redirect-to-chat',
        'refresh-redirect-to-payment',
        'refresh-redirect-to-profile',
        'refresh-redirect-to-home',
        'refresh-redirect-to-journal',
        'refresh-redirect-to-elite-habit',
        'refresh-redirect-to-meditation',
        'refresh-redirect-to-audio'
      ];

      console.log('🧹 Clearing all redirect flags...');

      flags.forEach(flag => {
        if (localStorage.getItem(flag) === 'true') {
          localStorage.removeItem(flag);
          console.log(`  ✅ Cleared: ${flag}`);
        }
      });

      console.log('✅ All redirect flags cleared');
      return { cleared: true };
    },

    /**
     * Check all systems at once
     * Usage: window.debug.checkAll()
     */
    checkAll: async () => {
      console.log('🔍 Running comprehensive system check...\n');

      console.log('1️⃣ IDLE STATE:');
      const idle = debugTools.checkIdle();

      console.log('\n2️⃣ SESSION:');
      const session = await debugTools.checkSession();

      console.log('\n3️⃣ WEBSOCKET:');
      const websocket = debugTools.checkWebSocket();

      console.log('\n4️⃣ PRO STATUS:');
      const proStatus = await debugTools.checkProStatus();

      console.log('\n5️⃣ CACHE INFO:');
      const cacheInfo = await debugTools.checkCache();

      console.log('\n6️⃣ REDIRECT FLAGS:');
      const redirectFlags = debugTools.checkRedirectFlags();

      return {
        idle,
        session,
        websocket,
        proStatus,
        cacheInfo,
        redirectFlags,
        timestamp: new Date().toISOString()
      };
    },

    /**
     * Force trigger idle wake event (test PWA reload)
     * Usage: window.debug.forceIdleWake()
     */
    forceIdleWake: () => {
      const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                    (window.navigator as any).standalone === true;

      console.log('🔥 Forcing idle-wake event dispatch');
      window.dispatchEvent(new CustomEvent('pwa-reload-messages', {
        detail: {
          reason: 'manual-test',
          timestamp: Date.now(),
          isPWA
        }
      }));

      console.log('✅ Event dispatched - check Chat component for reload');
      return { dispatched: true, isPWA };
    },

    /**
     * Check cache status
     * Usage: window.debug.checkCache()
     */
    checkCache: async () => {
      const cacheNames = await caches.keys();
      const localStorageSize = new Blob(Object.values(localStorage)).size;
      const sessionStorageSize = new Blob(Object.values(sessionStorage)).size;

      const result = {
        serviceworkerCaches: cacheNames.length,
        cacheNames,
        localStorage: {
          keys: Object.keys(localStorage).length,
          sizeKB: Math.round(localStorageSize / 1024),
          authKeys: Object.keys(localStorage).filter(k =>
            k.includes('auth') || k.includes('supabase') || k.startsWith('sb-')
          ).length,
          audioKeys: Object.keys(localStorage).filter(k =>
            k.includes('audio') || k.includes('Audio')
          ).length,
          redirectKeys: Object.keys(localStorage).filter(k =>
            k.includes('refresh-redirect')
          ).length
        },
        sessionStorage: {
          keys: Object.keys(sessionStorage).length,
          sizeKB: Math.round(sessionStorageSize / 1024)
        }
      };

      console.log('💾 Cache Status:');
      console.table(result.localStorage);
      console.table(result.sessionStorage);
      console.log('SW Caches:', result.cacheNames);

      return result;
    },

    /**
     * Clear all caches (dangerous!)
     * Usage: window.debug.clearAllCache()
     */
    clearAllCache: async () => {
      console.warn('⚠️ WARNING: Clearing ALL caches - this will log you out!');

      // Clear SW caches
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));

      // Clear storage
      localStorage.clear();
      sessionStorage.clear();

      console.log('✅ All caches cleared');
      console.log('🔄 Reloading page...');

      setTimeout(() => {
        window.location.reload();
      }, 1000);

      return { cleared: true };
    },

    /**
     * Refresh session manually
     * Usage: window.debug.refreshSession()
     */
    refreshSession: async () => {
      console.log('🔄 Refreshing session...');

      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        console.error('❌ Refresh failed:', error);
        return { success: false, error };
      }

      if (data.session) {
        console.log('✅ Session refreshed successfully');
        console.table({
          userId: data.session.user.id,
          expiresAt: new Date(data.session.expires_at! * 1000).toISOString()
        });
        return { success: true, session: data.session };
      }

      return { success: false };
    },

    /**
     * Test realtime connection
     * Usage: window.debug.testRealtime()
     */
    testRealtime: async () => {
      console.log('🔌 Testing realtime connection...');

      const testChannel = supabase.channel('debug-test');

      testChannel.on('broadcast', { event: 'test' }, (payload) => {
        console.log('✅ Broadcast received:', payload);
      });

      await testChannel.subscribe((status) => {
        console.log('Channel status:', status);

        if (status === 'SUBSCRIBED') {
          testChannel.send({
            type: 'broadcast',
            event: 'test',
            payload: { message: 'Debug test', timestamp: Date.now() }
          });

          setTimeout(() => {
            testChannel.unsubscribe();
            console.log('✅ Test complete - channel unsubscribed');
          }, 2000);
        }
      });

      return { testStarted: true };
    },

    /**
     * Show help
     * Usage: window.debug.help()
     */
    help: () => {
      console.log(`
🛠️ DEBUG TOOLS AVAILABLE:

📊 System Checks:
  window.debug.checkIdle()           - Check idle state
  window.debug.checkSession()        - Check session validity
  window.debug.checkWebSocket()      - Check WebSocket status
  window.debug.checkProStatus()      - Check Pro subscription
  window.debug.checkCache()          - Check cache status
  window.debug.checkRedirectFlags()  - Check redirect flags
  window.debug.checkAll()            - Run all checks

🔧 Actions:
  window.debug.forceIdleWake()       - Force idle-wake event
  window.debug.refreshSession()      - Refresh auth session
  window.debug.testRealtime()        - Test realtime connection
  window.debug.clearAllCache()       - Clear all caches (⚠️ DANGEROUS)

🚩 Refresh-Redirect Tools:
  window.debug.testRefreshRedirect('chat')  - Test refresh-redirect to tab
  window.debug.clearRedirectFlags()         - Clear all redirect flags

ℹ️ Info:
  window.debug.help()                - Show this help

Example usage:
  > window.debug.checkAll()
  > window.debug.testRefreshRedirect('chat')
  > window.debug.checkRedirectFlags()

Quick Test:
  > localStorage.setItem('refresh-redirect-to-chat', 'true'); window.location.reload();
      `);
    }
  };

  // Expose to window
  (window as any).debug = debugTools;

  console.log('🛠️ Debug tools loaded! Type window.debug.help() for available commands');

  return debugTools;
};
