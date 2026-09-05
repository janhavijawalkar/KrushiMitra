import React from "react";
import ReactDOM from "react-dom/client";
import { registerSW } from "virtual:pwa-register";

import App from "./App.jsx";
import "./index.css";

import { AppProvider } from "./context/AppContext.jsx";

// Register PWA Service Worker for offline support
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log("[PWA] New version available, auto-updating cache...");
  },
  onOfflineReady() {
    console.log("[PWA] KrushiMitra is ready to work offline!");
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);