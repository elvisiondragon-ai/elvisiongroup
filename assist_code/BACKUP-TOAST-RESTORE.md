# BACKUP - HOW TO RESTORE ORIGINAL TOAST SYSTEM

## ORIGINAL CODE TO RESTORE:

### 1. onNeedRefresh() function - RESTORE THESE LINES (around line 221-225):
```javascript
// Option 1 - Manual Deploy : 🟢ON (jika mau off pakai //)
localStorage.setItem('app-needs-update', 'true')
localStorage.setItem('update-timestamp', Date.now().toString())
// Reset blocker so notification can show for new updates  
localStorage.removeItem('force-refresh-completed')
```

### 2. RESTORE ENTIRE useEffect (lines 232-384):
```javascript
// Show soft update notification when available
useEffect(() => {
  const showSoftUpdateToast = () => {
    // Prevent multiple toasts
    if (toastId) return;
    
    const newToastId = toast({
      title: "🔵 SOFT UPDATE 🛜",
      description: "Klik untuk update ke versi terbaru aplikasi",
      action: (
        <button 
          onClick={(e) => {
            setUpdateClicked(true);
            
            console.log('🔵 User clicked SOFT UPDATE button')
            localStorage.removeItem('app-needs-update')
            
            // Backup ALL auth tokens before SW update
            const authKeys = Object.keys(localStorage).filter(key => 
              key.startsWith('sb-') || 
              key.includes('auth') || 
              key.includes('session') ||
              key.includes('supabase') ||
              key.includes('token') ||
              key.match(/^supabase\.auth\./)
            );
            const authBackup: Record<string, string> = {};
            authKeys.forEach(key => {
              const value = localStorage.getItem(key);
              if (value) authBackup[key] = value;
            });
            
            // Also backup current session from Supabase
            supabase.auth.getSession().then(({ data: { session } }) => {
              if (session) {
                authBackup['_session_backup'] = JSON.stringify(session);
              }
              sessionStorage.setItem('auth-backup', JSON.stringify(authBackup));
            });
            
            sessionStorage.setItem('auth-backup', JSON.stringify(authBackup));
            
            localStorage.setItem('force-refresh-completed', 'true');
            localStorage.setItem('update-success-pending', 'true');
            
            console.log('🔵 SOFT UPDATE: Auth backed up, updating service worker');
            
            // iOS-specific timing adjustments
            const updateDelay = isIOS ? 200 : 50;
            const resetDelay = isIOS ? 2000 : 1500;
            
            setTimeout(() => {
              try {
                updateServiceWorker(true)
                setNeedRefresh(false)
                setToastId(null);
                
                // Restore auth after SW update with better timing
                setTimeout(async () => {
                  const backup = sessionStorage.getItem('auth-backup');
                  if (backup) {
                    const authData = JSON.parse(backup);
                    
                    // Restore localStorage items first
                    Object.keys(authData).forEach(key => {
                      if (key !== '_session_backup' && authData[key]) {
                        localStorage.setItem(key, authData[key]);
                      }
                    });
                    
                    // Then restore session if available
                    if (authData._session_backup) {
                      try {
                        const session = JSON.parse(authData._session_backup);
                        await supabase.auth.setSession(session);
                        console.log('🔄 Session restored from backup');
                      } catch (e) {
                        console.warn('⚠️ Failed to restore session:', e);
                      }
                    }
                    
                    sessionStorage.removeItem('auth-backup');
                  }
                }, 500);
                
                // iOS fallback: Force reload if service worker fails
                if (isIOS) {
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }
              } catch (error) {
                console.error('Service worker update failed:', error);
                // Restore auth before fallback reload
                const backup = sessionStorage.getItem('auth-backup');
                if (backup) {
                  const authData = JSON.parse(backup);
                  Object.keys(authData).forEach(key => {
                    if (key !== '_session_backup' && authData[key]) {
                      localStorage.setItem(key, authData[key]);
                    }
                  });
                }
                window.location.reload();
              }
              
              // Always reset state after delay (in case reload fails)
              setTimeout(() => {
                setUpdateClicked(false);
                setToastId(null);
              }, resetDelay);
            }, updateDelay);
          }}
          disabled={updateClicked}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
            updateClicked 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80'
          }`}
        >
          Double Click disini untuk update
        </button>
      ),
      duration: 0, // Don't auto-dismiss
    });
    
    setToastId(newToastId);
  }

  // Check if update is available from SW or localStorage
  const hasUpdate = needRefresh || localStorage.getItem('app-needs-update') === 'true'
  const forceRefreshCompleted = localStorage.getItem('force-refresh-completed') === 'true'
  const updateTimestamp = localStorage.getItem('update-timestamp')
  
  if (hasUpdate && !forceRefreshCompleted) {
    // If we already have a toast but there's a newer update, dismiss old one first
    if (toastId && updateTimestamp) {
      console.log('🔄 Newer update available, refreshing notification')
      // The existing toast will be replaced by the new one
    }
    
    if (!toastId || updateTimestamp) {
      console.log('📢 Showing latest update notification')
      showSoftUpdateToast()
    }
  }
  
  // Cleanup toast ID when update completes
  return () => {
    if (!hasUpdate) {
      setToastId(null);
    }
  };
}, [needRefresh, toast, updateServiceWorker, setNeedRefresh, toastId]);
```

### 3. RESTORE SUCCESS NOTIFICATION useEffect (lines 387-397):
```javascript
// Show success notification after refresh
useEffect(() => {
  const updateSuccess = localStorage.getItem('update-success-pending');
  if (updateSuccess === 'true') {
    localStorage.removeItem('update-success-pending');
    toast({
      title: "🚀 Update berhasil diperbarui",
      description: "Aplikasi telah diperbarui ke versi terbaru",
      variant: "default"
    });
  }
}, [toast]);
```

## TO RESTORE:
1. REMOVE the instant update logic from onNeedRefresh()
2. UNCOMMENT the localStorage lines in onNeedRefresh()
3. UNCOMMENT the entire toast useEffect (lines 232-384)
4. UNCOMMENT the success notification useEffect (lines 387-397)