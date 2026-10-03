import { useState, useEffect } from "react";

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => {
    return typeof window !== "undefined" && typeof navigator !== "undefined"
      ? navigator.onLine
      : true;
  });

  const [wasOffline, setWasOffline] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(() => {
    return typeof window !== "undefined" ? window.__krushiMitraDeferredPrompt || null : null;
  });
  const [isInstallable, setIsInstallable] = useState(() => {
    return typeof window !== "undefined" ? Boolean(window.__krushiMitraDeferredPrompt) : false;
  });
  const [isAppInstalled, setIsAppInstalled] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    );
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if early capture already has it
    if (window.__krushiMitraDeferredPrompt && !deferredPrompt) {
      setDeferredPrompt(window.__krushiMitraDeferredPrompt);
      setIsInstallable(true);
    }

    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);
      const timer = setTimeout(() => setWasOffline(false), 5000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      window.__krushiMitraDeferredPrompt = e;
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      window.__krushiMitraDeferredPrompt = null;
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsAppInstalled(true);
    };

    const handlePromptReady = () => {
      if (window.__krushiMitraDeferredPrompt) {
        setDeferredPrompt(window.__krushiMitraDeferredPrompt);
        setIsInstallable(true);
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("krushimitra-deferred-prompt-ready", handlePromptReady);
    window.addEventListener("krushimitra-app-installed", handleAppInstalled);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("krushimitra-deferred-prompt-ready", handlePromptReady);
      window.removeEventListener("krushimitra-app-installed", handleAppInstalled);
    };
  }, [deferredPrompt]);

  const promptInstall = async () => {
    const promptEvent = deferredPrompt || (typeof window !== "undefined" ? window.__krushiMitraDeferredPrompt : null);
    if (!promptEvent) return false;
    try {
      promptEvent.prompt();
      const choiceResult = await promptEvent.userChoice;
      if (choiceResult.outcome === "accepted") {
        setIsInstallable(false);
        setIsAppInstalled(true);
        setDeferredPrompt(null);
        if (typeof window !== "undefined") {
          window.__krushiMitraDeferredPrompt = null;
        }
        return true;
      }
    } catch (err) {
      console.warn("Install prompt failed:", err);
    }
    return false;
  };

  return {
    isOnline,
    wasOffline,
    isInstallable,
    isAppInstalled,
    promptInstall,
  };
}

export default useOnlineStatus;
