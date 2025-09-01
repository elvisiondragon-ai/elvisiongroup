import { useEffect } from 'react';

interface UseNavigationBlockProps {
  isBlocked: boolean;
  onNavigationAttempt: () => void;
}

export function useNavigationBlock({ isBlocked, onNavigationAttempt }: UseNavigationBlockProps) {
  useEffect(() => {
    if (!isBlocked) return;

    // Block back button
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.pathname);
      onNavigationAttempt();
    };

    // Block page unload/reload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      onNavigationAttempt();
      return '';
    };

    // Block keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+W, Ctrl+T, Ctrl+N, Ctrl+Shift+T, etc.
      if (e.ctrlKey && (e.key === 'w' || e.key === 't' || e.key === 'n' || 
          (e.shiftKey && e.key === 'T'))) {
        e.preventDefault();
        onNavigationAttempt();
      }
      
      // Block F5 refresh
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        e.preventDefault();
        onNavigationAttempt();
      }
      
      // Block Alt+F4
      if (e.altKey && e.key === 'F4') {
        e.preventDefault();
        onNavigationAttempt();
      }
    };

    // Push initial state to enable back button blocking
    window.history.pushState(null, '', window.location.pathname);
    
    // Add event listeners
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isBlocked, onNavigationAttempt]);
}