import React from "react";
import { RefreshCw, Home, AlertTriangle, Sparkles } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[KrushiMitra ErrorBoundary] Uncaught runtime error:", error, errorInfo);
  }

  handleForceUpdate = async () => {
    try {
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      }
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } catch (e) {
      console.warn("Cache purge failed:", e);
    }
    // Hard reload with cache buster query parameter
    window.location.href = window.location.origin + window.location.pathname + "?updated=" + Date.now();
  };

  handleGoHome = () => {
    window.location.href = window.location.origin;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#F4F9F2] p-6 text-gray-800 font-sans animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-[#DCE8D9] bg-white p-8 text-center shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-[#2E7D32] shadow-sm">
              <Sparkles size={32} />
            </div>

            <h1 className="mt-5 text-xl font-extrabold text-gray-900 sm:text-2xl">
              कृषीमित्र अपडेट झाले आहे / App Updated
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
              नवीन अपडेट किंवा कॅश बदलामुळे अ‍ॅप रीलोड करणे आवश्यक आहे. खालील बटणावर क्लिक करून अ‍ॅप अपडेट करा.
            </p>
            <p className="mt-1 text-xs text-gray-400">
              (A new update is available. Click below to refresh and load the latest version cleanly.)
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={this.handleForceUpdate}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-6 py-3 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95 cursor-pointer"
              >
                <RefreshCw size={15} />
                <span>अ‍ॅप अपडेट व रीलोड करा (Update & Reload)</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 text-xs font-bold text-gray-700 transition hover:bg-gray-100 cursor-pointer"
              >
                <Home size={15} />
                <span>मुख्य पृष्ठ (Home)</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
