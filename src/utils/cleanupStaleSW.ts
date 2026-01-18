
export const cleanupStaleServiceWorkers = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        // Force update to ensure we have the latest version
        await registration.update();
      }
    } catch (error) {
      console.error('Failed to update SW:', error);
    }
  }
};
