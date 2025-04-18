self.addEventListener("install", (e) => {
    console.log("🛠️ Service Worker Installed");
    self.skipWaiting();
  });
  
  self.addEventListener("activate", (e) => {
    console.log("🚀 Service Worker Activated");
  });
  
  self.addEventListener("push", (event) => {
    const data = event.data.json();
    console.log("🔔 Push Received:", data);
  
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.message,
        icon: "/icon-192.png",
      })
    );
  });