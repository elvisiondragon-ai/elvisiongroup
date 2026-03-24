import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if we've already tried to refresh for this path
    // This helps handle cases where a new route was added but the user has an old cached version
    const hasRetried = sessionStorage.getItem(`retry-${location.pathname}`);
    
    if (!hasRetried) {
      sessionStorage.setItem(`retry-${location.pathname}`, "true");
      console.log("404 encountered, attempting one-time refresh to check for updates...");
      window.location.reload();
      return;
    }

    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Delay showing the 404 to allow Service Worker updates to trigger a reload
    // This prevents the "Flash of 404" when a new route is added but the old SW is still active
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Checking routes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
