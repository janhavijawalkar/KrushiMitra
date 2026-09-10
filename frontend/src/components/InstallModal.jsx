import { useState, useEffect } from "react";
import {
  Download,
  X,
  Smartphone,
  Apple,
  Monitor,
  CheckCircle2,
  Sparkles,
  Share,
  PlusSquare,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

export default function InstallModal({ isOpen, onClose, initialPlatform = null }) {
  const { language } = useApp();
  const { isInstallable, promptInstall } = useOnlineStatus();
  const [activeTab, setActiveTab] = useState("android");
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    if (initialPlatform) {
      setActiveTab(initialPlatform);
      return;
    }
    // Detect device OS to select initial tab
    if (typeof navigator !== "undefined") {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        setActiveTab("ios");
      } else if (/android/i.test(userAgent)) {
        setActiveTab("android");
      } else {
        setActiveTab("desktop");
      }
    }
  }, [initialPlatform, isOpen]);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (promptInstall) {
      const success = await promptInstall();
      if (success) {
        setInstallSuccess(true);
        setTimeout(() => {
          onClose();
          setInstallSuccess(false);
        }, 2000);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex min-h-full items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md my-auto rounded-3xl bg-white dark:bg-[#132318] p-5 sm:p-6 shadow-2xl border-2 border-emerald-300 dark:border-emerald-700/80 animate-zoom-fade depth-3 text-gray-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-[#1A3322] text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-emerald-900 transition cursor-pointer border border-gray-200 dark:border-emerald-800"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-[#22402A] pb-3 pr-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white shadow-md">
            <Download size={20} className="!text-white" />
          </div>
          <div>
            <h2 className="text-base font-black !text-gray-900 dark:!text-white leading-tight">
              {language === "mr"
                ? "कृषीमित्र अ‍ॅप इन्स्टॉल करा"
                : language === "hi"
                ? "कृषि-मित्र ऐप इंस्टॉल करें"
                : "Install KrushiMitra App"}
            </h2>
            <p className="text-[11px] !text-gray-500 dark:!text-emerald-300 font-medium">
              {language === "mr"
                ? "शेतात इंटरनेट नसतानाही १००% ऑफलाइन कार्य करते"
                : language === "hi"
                ? "बिना इंटरनेट भी १००% ऑफलाइन काम करता है"
                : "Fast, lightweight & 100% offline ready"}
            </p>
          </div>
        </div>

        {/* 1-CLICK DIRECT INSTALL BUTTON */}
        <div className="mt-4">
          <button
            type="button"
            onClick={async () => {
              if (promptInstall) {
                const ok = await promptInstall();
                if (ok) {
                  setInstallSuccess(true);
                  setTimeout(() => {
                    onClose();
                    setInstallSuccess(false);
                  }, 2000);
                  return;
                }
              }
              // If native prompt is not available, highlight the 2 simple steps
              if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                setActiveTab("ios");
              } else if (/android/i.test(navigator.userAgent)) {
                setActiveTab("android");
              } else {
                setActiveTab("desktop");
              }
            }}
            className="btn-shimmer w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] py-3.5 px-4 text-xs sm:text-sm font-black !text-white shadow-lg hover:-translate-y-0.5 active:scale-95 cursor-pointer"
          >
            <Download size={18} className="!text-white" />
            <span className="!text-white">
              {installSuccess
                ? (language === "mr" ? "✓ अ‍ॅप इन्स्टॉल झाले!" : language === "hi" ? "✓ ऐप इंस्टॉल हो गया!" : "✓ Installed Successfully!")
                : (language === "mr" ? "📲 थेट अ‍ॅप इन्स्टॉल करा (Install Now)" : language === "hi" ? "📲 तुरंत ऐप इंस्टॉल करें (Install Now)" : "📲 Install KrushiMitra App Now")}
            </span>
          </button>
        </div>

        {/* PLATFORM PILL TABS */}
        <div className="mt-4">
          <div className="flex rounded-xl bg-gray-100 dark:bg-[#183321] p-1 border border-gray-200 dark:border-emerald-800/80 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("android")}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-black transition cursor-pointer ${
                activeTab === "android"
                  ? "!bg-[#1B5E20] !text-white shadow-sm"
                  : "!text-gray-700 dark:!text-gray-300 hover:!text-[#1B5E20] dark:hover:!text-white"
              }`}
            >
              <Smartphone size={14} className={activeTab === "android" ? "!text-white" : "!text-emerald-700 dark:!text-emerald-400"} />
              <span className={activeTab === "android" ? "!text-white" : ""}>Android</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("ios")}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-black transition cursor-pointer ${
                activeTab === "ios"
                  ? "!bg-[#1B5E20] !text-white shadow-sm"
                  : "!text-gray-700 dark:!text-gray-300 hover:!text-[#1B5E20] dark:hover:!text-white"
              }`}
            >
              <Apple size={14} className={activeTab === "ios" ? "!text-white" : "!text-blue-600 dark:!text-blue-400"} />
              <span className={activeTab === "ios" ? "!text-white" : ""}>iPhone</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("desktop")}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-black transition cursor-pointer ${
                activeTab === "desktop"
                  ? "!bg-[#1B5E20] !text-white shadow-sm"
                  : "!text-gray-700 dark:!text-gray-300 hover:!text-[#1B5E20] dark:hover:!text-white"
              }`}
            >
              <Monitor size={14} className={activeTab === "desktop" ? "!text-white" : "!text-purple-600 dark:!text-purple-400"} />
              <span className={activeTab === "desktop" ? "!text-white" : ""}>PC / Laptop</span>
            </button>
          </div>
        </div>

        {/* 2 SUPER SIMPLE STEPS */}
        <div className="mt-3 rounded-2xl border border-emerald-100 dark:border-[#24402A] bg-[#F9FAF8] dark:bg-[#162A1D] p-3.5 text-xs space-y-2.5">
          {activeTab === "android" && (
            <>
              <div className="flex items-center gap-2 text-gray-800 dark:text-emerald-100 font-bold">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-200 dark:bg-emerald-800 text-[#1B5E20] dark:text-[#4ADE80] text-[11px] font-black">१</span>
                <span>
                  {language === "mr"
                    ? "Chrome मध्ये वर उजवीकडे तीन ठिपके (⋮) दाबा"
                    : language === "hi"
                    ? "Chrome में ऊपर दाईं ओर तीन बिंदु (⋮) दबाएं"
                    : "Tap the 3 dots (⋮) menu in Chrome (top right)"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-800 dark:text-emerald-100 font-bold">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-200 dark:bg-emerald-800 text-[#1B5E20] dark:text-[#4ADE80] text-[11px] font-black">२</span>
                <span>
                  {language === "mr"
                    ? "'Install app' किंवा 'Add to Home screen' निवडा ✓"
                    : language === "hi"
                    ? "'Install app' या 'Add to Home screen' चुनें ✓"
                    : "Tap 'Install app' or 'Add to Home screen' ✓"}
                </span>
              </div>
            </>
          )}

          {activeTab === "ios" && (
            <>
              <div className="flex items-center gap-2 text-gray-800 dark:text-emerald-100 font-bold">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-[11px] font-black">१</span>
                <span>
                  {language === "mr"
                    ? "Safari मध्ये खाली असलेले Share (⎋) बटण दाबा"
                    : language === "hi"
                    ? "Safari में नीचे Share (⎋) बटन पर टैप करें"
                    : "Tap the Share button (⎋) at the bottom in Safari"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-800 dark:text-emerald-100 font-bold">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-[11px] font-black">२</span>
                <span>
                  {language === "mr"
                    ? "'Add to Home Screen' निवडून 'Add' दाबा ✓"
                    : language === "hi"
                    ? "'Add to Home Screen' चुनकर 'Add' दबाएं ✓"
                    : "Select 'Add to Home Screen' and tap 'Add' ✓"}
                </span>
              </div>
            </>
          )}

          {activeTab === "desktop" && (
            <>
              <div className="flex items-center gap-2 text-gray-800 dark:text-emerald-100 font-bold">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 text-[11px] font-black">१</span>
                <span>
                  {language === "mr"
                    ? "अ‍ॅड्रेस बारमधील कॉम्प्युटर/डाऊनलोड (🖥️) आयकॉन दाबा"
                    : language === "hi"
                    ? "एड्रेस बार में कंप्यूटर/डाउनलोड (🖥️) आइकन दबाएं"
                    : "Click the Install (🖥️) icon in Chrome/Edge URL bar"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-800 dark:text-emerald-100 font-bold">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 text-[11px] font-black">२</span>
                <span>
                  {language === "mr"
                    ? "'Install' वर क्लिक करून स्वतंत्र अ‍ॅप सुरू करा ✓"
                    : language === "hi"
                    ? "'Install' पर क्लिक करके ऐप शुरू करें ✓"
                    : "Click 'Install' to run as dedicated desktop app ✓"}
                </span>
              </div>
            </>
          )}
        </div>

        {/* FOOTER DISMISS BUTTON */}
        <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-[#22402A]">
          <span className="text-[11px] !text-gray-500 dark:!text-emerald-300 font-medium flex items-center gap-1">
            <CheckCircle2 size={13} className="text-[#2E7D32]" />
            <span>{language === "mr" ? "केवळ ३ MB • ऑफलाइन सपोर्ट" : language === "hi" ? "सिर्फ ३ MB • ऑफलाइन सपोर्ट" : "Only 3 MB • Offline Ready"}</span>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-gray-100 dark:bg-[#1A3322] px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#254530] transition cursor-pointer"
          >
            {language === "mr" ? "समजले (Got it)" : language === "hi" ? "समझ गया" : "Got it"}
          </button>
        </div>
      </div>
    </div>
  );
}
