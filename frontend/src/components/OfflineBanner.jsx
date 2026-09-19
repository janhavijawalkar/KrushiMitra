import { useState } from "react";
import { WifiOff, Wifi, Download, X } from "lucide-react";
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
    <aside
      aria-label="Network status banner"
      className="no-print w-full text-xs font-semibold shadow-xs transition-all duration-300"
    >
      {/* 1. BACK ONLINE ALERT */}
      {isOnline && wasOffline && (
        <div className="flex items-center justify-between border-b border-emerald-500 bg-emerald-600 px-5 py-2.5 text-white animate-fade-in shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
              <Wifi size={14} className="animate-pulse text-white" />
            </span>
            <span className="text-xs font-bold">
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
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-400/80 bg-gradient-to-r from-amber-600 via-amber-600 to-amber-700 px-6 py-3 text-white shadow-md animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-black/20 text-white shadow-inner ring-1 ring-white/30">
              <WifiOff size={16} className="text-white animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-extrabold tracking-wide text-white drop-shadow-xs">
                {language === "mr"
                  ? "📴 ऑफलाइन मोड सक्रिय"
                  : language === "hi"
                  ? "📴 ऑफलाइन मोड सक्रिय"
                  : "📴 Offline Mode Active"}
              </p>
              <p className="text-[12px] font-medium text-amber-100/90 leading-tight">
                {language === "mr"
                  ? "इंटरनेट उपलब्ध नसतानाही आपण जतन केलेला शेती इतिहास, मागील हवामान व शिफारसी वापरू शकता."
                  : language === "hi"
                  ? "इंटरनेट के बिना भी आप सहेजा गया इतिहास, पिछला मौसम और रिपोर्ट देख सकते हैं।"
                  : "You can continue viewing cached farm history, soil advisories, and local tools."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            {isInstallable && (
              <button
                type="button"
                onClick={promptInstall}
                className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-amber-900 shadow-sm transition hover:bg-amber-50 cursor-pointer"
              >
                <Download size={13} className="text-amber-800" />
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
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/10 text-white/90 hover:bg-white/20 hover:text-white transition cursor-pointer"
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
