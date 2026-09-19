import { useState, useEffect } from "react";
import { RefreshCw, Sparkles, X, Check } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function UpdateNotification() {
  const { language } = useApp();
  const [showUpdate, setShowUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Listen for custom PWA update event
    const handleUpdateReady = () => {
      setShowUpdate(true);
    };

    window.addEventListener("krushimitra-sw-updated", handleUpdateReady);

    // Also check if navigator.serviceWorker has waiting worker
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                setShowUpdate(true);
              }
            });
          }
        });
      });
    }

    return () => {
      window.removeEventListener("krushimitra-sw-updated", handleUpdateReady);
    };
  }, []);

  if (!showUpdate) return null;

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          if (reg.waiting) {
            reg.waiting.postMessage({ type: "SKIP_WAITING" });
          }
          await reg.update();
        }
      }

      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } catch (e) {
      console.warn("Update purge failed:", e);
    }

    // Give service worker 300ms to activate then reload cleanly
    setTimeout(() => {
      window.location.href =
        window.location.origin + window.location.pathname + "?v=" + Date.now();
    }, 350);
  };

  return (
    <div className="no-print fixed bottom-5 right-5 z-50 max-w-md animate-bounce-short">
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-300 bg-white p-4 shadow-2xl ring-2 ring-emerald-500/20">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white shadow-sm">
          <Sparkles size={18} />
        </div>

        <div className="flex-1 text-xs">
          <p className="font-extrabold text-gray-900">
            {language === "mr"
              ? "नवीन अपडेट उपलब्ध आहे! 🌾"
              : language === "hi"
              ? "नया अपडेट उपलब्ध है! 🌾"
              : "New Update Available! 🌾"}
          </p>
          <p className="text-gray-500 text-[11px] mt-0.5">
            {language === "mr"
              ? "नवीनतम शेती अहवाल व सुधारणा लोड करण्यासाठी अपडेट करा."
              : language === "hi"
              ? "नवीनतम फसल रिपोर्ट व सुधार लोड करने के लिए अपडेट करें।"
              : "Click update to load the latest features and data."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUpdate}
            disabled={isUpdating}
            className="flex items-center gap-1.5 rounded-xl bg-[#2E7D32] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#1B5E20] active:scale-95 cursor-pointer"
          >
            <RefreshCw size={13} className={isUpdating ? "animate-spin" : ""} />
            <span>
              {isUpdating
                ? (language === "mr" ? "अपडेट होत आहे..." : language === "hi" ? "अपडेट हो रहा है..." : "Updating...")
                : (language === "mr" ? "अपडेट करा" : language === "hi" ? "अपडेट करें" : "Update App")}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowUpdate(false)}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
            title="Dismiss"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
