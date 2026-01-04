import "@/styles/globals.css";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  // Register service worker for offline functionality
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;

      // Log service worker events
      wb.addEventListener("installed", (event) => {
        console.log(`✅ Service Worker installed: ${event.isUpdate ? 'Update' : 'First time'}`);
      });

      wb.addEventListener("controlling", () => {
        console.log("✅ Service Worker is controlling the page");
      });

      wb.addEventListener("activated", () => {
        console.log("✅ Service Worker activated");
      });

      // Add a waiting service worker update prompt
      wb.addEventListener("waiting", () => {
        console.log("⏳ Service Worker waiting to activate");
        // Optionally auto-update
        wb.messageSkipWaiting();
      });

      // Reload after service worker takes control
      wb.addEventListener("controlling", () => {
        window.location.reload();
      });

      // Register the service worker
      wb.register();
    }
  }, []);

  return <Component {...pageProps} />;
}
