import React from "react";
import ReactDOM from "react-dom/client";
import { registerSW } from "virtual:pwa-register";

import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import "./index.css";

import { AppProvider } from "./context/AppContext.jsx";

// 1. Recover gracefully from Vite stale chunk / preload errors after an update
if (typeof window !== "undefined") {
  window.addEventListener("vite:preloadError", (event) => {
    console.warn("[KrushiMitra] Preload error detected after update. Reloading page with fresh assets...", event);
    window.location.reload();
  });

  window.addEventListener("error", (event) => {
    const msg = event?.message || "";
    if (
      msg.includes("Failed to fetch dynamically imported module") ||
      msg.includes("Importing a module script failed") ||
      msg.includes("error loading dynamically imported module")
    ) {
      console.warn("[KrushiMitra] Stale module detected. Clearing cache and reloading fresh version...");
      if ("caches" in window) {
        caches.keys().then((names) => Promise.all(names.map((n) => caches.delete(n)))).finally(() => {
          window.location.reload();
        });
      } else {
        window.location.reload();
      }
    }
  });
}

// 2. Register PWA Service Worker with notification trigger
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log("[PWA] New version ready, notifying user...");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("krushimitra-sw-updated"));
    }
  },
  onOfflineReady() {
    console.log("[PWA] KrushiMitra is ready to work offline!");
  },
});

// 3. Ensure Service Worker is registered in all environments for 1-click install
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <App />
      </AppProvider>
    </ErrorBoundary>
  </React.StrictMode>
);