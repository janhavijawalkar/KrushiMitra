import { useState } from "react";
import { WifiOff, Wifi, Download, X, AlertTriangle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

export default function OfflineBanner() {
  const { language } = useApp();
  const { isOnline, wasOffline, isInstallable, promptInstall } = useOnlineStatus();
  const [dismissed, setDismissed] = useState(false);

  if (isOnline && !wasOffline) {
    return null;
  }

  return (
    <aside aria-label="Network status banner" className="sticky top-0 z-50 w-full animate-fade-in text-xs font-semibold shadow-sm transition-all duration-300">
      {/* 1. BACK ONLINE ALERT */}
      {isOnline && wasOffline && (
        <div className="flex items-center justify-between bg-emerald-600 px-4 py-2 text-white">
          <div className="flex items-center gap-2">
            <Wifi size={15} className="animate-pulse" />
            <span>
              {language === "mr"
                ? "🌐 इंटरनेट कनेक्शन पूर्ववत झाले — शेती डेटा क्लाउडशी जोडला गेला आहे."
                : language === "hi"
                ? "🌐 इंटरनेट कनेक्शन बहाल हुआ — कृषि डेटा क्लाउड से सिंक हो गया है।"
                : "🌐 Back Online — Cloud database connection restored."}
            </span>
          </div>
        </div>
      )}

      {/* 2. OFFLINE BANNER */}
      {!isOnline && !dismissed && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-300 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 px-4 py-2.5 text-white shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white">
              <WifiOff size={14} />
            </div>
            <div>
              <p className="font-bold">
                {language === "mr"
                  ? "📴 ऑफलाइन मोड सक्रिय"
                  : language === "hi"
                  ? "📴 ऑफलाइन मोड सक्रिय"
                  : "📴 Offline Mode Active"}
              </p>
              <p className="text-[11px] text-amber-100 font-normal">
                {language === "mr"
                  ? "इंटरनेट उपलब्ध नसतानाही आपण जतन केलेला शेती इतिहास, मागील हवामान व शिफारसी वापरू शकता."
                  : language === "hi"
                  ? "इंटरनेट के बिना भी आप सहेजा गया इतिहास, पिछला मौसम और रिपोर्ट देख सकते हैं।"
                  : "You can continue viewing cached farm history, soil advisories, and local tools."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isInstallable && (
              <button
                type="button"
                onClick={promptInstall}
                className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-amber-900 shadow-sm transition hover:bg-amber-50 cursor-pointer"
              >
                <Download size={13} />
                <span>
                  {language === "mr"
                    ? "अ‍ॅप इन्स्टॉल करा"
                    : language === "hi"
                    ? "ऐप इंस्टॉल करें"
                    : "Install App"}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="rounded-md p-1 text-white/80 hover:bg-white/20 hover:text-white cursor-pointer"
              title="Dismiss"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
