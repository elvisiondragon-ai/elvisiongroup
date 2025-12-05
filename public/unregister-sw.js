if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
      console.log('Old service worker unregistered.');
    }
    if (registrations.length > 0) {
      window.location.reload();
    }
  });
}
