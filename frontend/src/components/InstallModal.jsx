import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Download,
  X,
  Smartphone,
  Apple,
  Monitor,
  CheckCircle2,
  Sparkles,
  FolderDown,
  LayoutGrid,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

export default function InstallModal({ isOpen, onClose, initialPlatform = null }) {
  const { language } = useApp();
  const { isInstallable, promptInstall } = useOnlineStatus();
  const [activeTab, setActiveTab] = useState("android");
  const [installSuccess, setInstallSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialPlatform) {
      setActiveTab(initialPlatform);
      return;
    }
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

  if (!isOpen || !mounted) return null;

  const handleInstallClick = async () => {
    if (promptInstall) {
      const ok = await promptInstall();
      if (ok) {
        setInstallSuccess(true);
        setTimeout(() => {
          onClose();
          setInstallSuccess(false);
        }, 2200);
        return;
      }
    }
    if (typeof navigator !== "undefined") {
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        setActiveTab("ios");
      } else if (/android/i.test(navigator.userAgent)) {
        setActiveTab("android");
      } else {
        setActiveTab("desktop");
      }
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[999999] overflow-y-auto bg-black/70 backdrop-blur-md p-3 sm:p-4 flex min-h-full items-center justify-center animate-fade-in"
      style={{ zIndex: 999999 }}
    >
      <div
        className="relative w-full max-w-md my-auto rounded-3xl bg-white dark:bg-[#132318] p-4 sm:p-5 shadow-2xl border-2 border-emerald-400 dark:border-emerald-600 animate-zoom-fade depth-3 text-gray-900 dark:text-white max-h-[92vh] flex flex-col overflow-hidden"
        style={{ zIndex: 1000000 }}
      >
        {/* CLOSE BUTTON - ALWAYS ACCESSIBLE */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3.5 top-3.5 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-[#1A3322] text-gray-700 dark:text-gray-200 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/60 dark:hover:text-red-400 transition cursor-pointer border border-gray-200 dark:border-emerald-800 shadow-sm"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* COMPACT HEADER */}
        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-[#22402A] pb-3 pr-8 shrink-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white shadow-md">
            <Download size={19} className="!text-white" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black !text-gray-900 dark:!text-white leading-tight">
              {language === "mr"
                ? "कृषीमित्र अ‍ॅप डाऊनलोड व इन्स्टॉल"
                : language === "hi"
                ? "कृषि-मित्र ऐप डाउनलोड एवं इंस्टॉल"
                : "Download & Install KrushiMitra App"}
            </h2>
            <p className="text-[10.5px] !text-emerald-700 dark:!text-emerald-300 font-semibold">
              {language === "mr"
                ? "⚡ १००% मोफत • शेतात ऑफलाइन चालणारे अ‍ॅप"
                : language === "hi"
                ? "⚡ १००% मुफ्त • खेत में ऑफलाइन काम करता है"
                : "⚡ 100% Free • Works 100% Offline in Fields"}
            </p>
          </div>
        </div>

        {/* SCROLLABLE BODY (Fits comfortably on all mobile screens) */}
        <div className="mt-3 overflow-y-auto pr-1 space-y-3 scrollbar-thin">
          {/* OPTION 1: DIRECT APK DOWNLOAD */}
          <a
            href="/downloads/KrushiMitra.apk"
            download="KrushiMitra.apk"
            className="btn-shimmer group flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] p-3 text-white shadow-md hover:-translate-y-0.5 active:scale-95 cursor-pointer no-underline transition"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white shadow-xs">
                <FolderDown size={19} className="!text-white" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs sm:text-sm font-black !text-white leading-tight">
                  {language === "mr"
                    ? "📥 थेट KrushiMitra.apk डाऊनलोड"
                    : language === "hi"
                    ? "📥 सीधे KrushiMitra.apk डाउनलोड"
                    : "📥 Download KrushiMitra.apk"}
                </p>
                <p className="text-[10px] text-emerald-100 font-medium truncate">
                  {language === "mr"
                    ? "फोनच्या 'Downloads' फोल्डरमध्ये सेव्ह होते"
                    : language === "hi"
                    ? "फ़ोन के 'Downloads' फ़ोल्डर में सेव होगा"
                    : "Saves directly to your phone Downloads"}
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-lg bg-white/25 px-2 py-1 text-[10px] font-black !text-white">
              APK
            </span>
          </a>

          {/* OPTION 2: 1-CLICK PWA INSTALL */}
          <button
            type="button"
            onClick={handleInstallClick}
            className="group w-full flex items-center justify-between gap-3 rounded-2xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50/70 dark:bg-[#183321] p-3 text-[#1B5E20] dark:text-[#4ADE80] shadow-xs hover:bg-emerald-100 dark:hover:bg-[#20442c] active:scale-95 cursor-pointer transition text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-200 dark:bg-[#20442c] text-[#1B5E20] dark:text-[#4ADE80] shadow-xs">
                <LayoutGrid size={19} />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-black leading-tight">
                  {installSuccess
                    ? (language === "mr" ? "✓ अ‍ॅप इन्स्टॉल झाले!" : language === "hi" ? "✓ ऐप इंस्टॉल हो गया!" : "✓ Installed Successfully!")
                    : (language === "mr" ? "📲 थेट १-क्लिक इन्स्टॉल" : language === "hi" ? "📲 तुरंत १-क्लिक इंस्टॉल" : "📲 1-Click Install to Screen")}
                </p>
                <p className="text-[10px] text-emerald-800 dark:text-emerald-300 font-medium truncate">
                  {language === "mr"
                    ? "थेट मोबाईलच्या होम स्क्रीनवर ॲप जोडले जाईल"
                    : language === "hi"
                    ? "सीधे मोबाइल होम स्क्रीन पर ऐप जुड़ेगा"
                    : "Adds native icon directly to home screen"}
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-lg bg-emerald-200/80 dark:bg-emerald-900/80 px-2 py-1 text-[10px] font-black text-emerald-900 dark:text-emerald-200">
              1-Click
            </span>
          </button>

          {/* PLATFORM SELECTOR TABS */}
          <div className="pt-1">
            <div className="flex rounded-xl bg-gray-100 dark:bg-[#183321] p-1 border border-gray-200 dark:border-emerald-800/80 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("android")}
                className={`flex-1 flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-black transition cursor-pointer ${
                  activeTab === "android"
                    ? "!bg-[#1B5E20] !text-white shadow-sm"
                    : "!text-gray-700 dark:!text-gray-300 hover:!text-[#1B5E20]"
                }`}
              >
                <Smartphone size={13} className={activeTab === "android" ? "!text-white" : "!text-emerald-700 dark:!text-emerald-400"} />
                <span>Android</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("ios")}
                className={`flex-1 flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-black transition cursor-pointer ${
                  activeTab === "ios"
                    ? "!bg-[#1B5E20] !text-white shadow-sm"
                    : "!text-gray-700 dark:!text-gray-300 hover:!text-[#1B5E20]"
                }`}
              >
                <Apple size={13} className={activeTab === "ios" ? "!text-white" : "!text-blue-600 dark:!text-blue-400"} />
                <span>iPhone</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("desktop")}
                className={`flex-1 flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-black transition cursor-pointer ${
                  activeTab === "desktop"
                    ? "!bg-[#1B5E20] !text-white shadow-sm"
                    : "!text-gray-700 dark:!text-gray-300 hover:!text-[#1B5E20]"
                }`}
              >
                <Monitor size={13} className={activeTab === "desktop" ? "!text-white" : "!text-purple-600 dark:!text-purple-400"} />
                <span>PC / Laptop</span>
              </button>
            </div>
          </div>

          {/* COMPACT 2-STEP INSTRUCTIONS */}
          <div className="rounded-2xl border border-emerald-100 dark:border-[#24402A] bg-emerald-50/40 dark:bg-[#162A1D] p-3 text-xs space-y-2">
            {activeTab === "android" && (
              <>
                <div className="flex items-center gap-2 text-gray-800 dark:text-emerald-100 font-bold">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-200 dark:bg-emerald-800 text-[#1B5E20] dark:text-[#4ADE80] text-[10px] font-black">१</span>
                  <span>
                    {language === "mr"
                      ? "वर दिलेल्या हिरव्या बटनाने APK फाईल डाऊनलोड करा"
                      : language === "hi"
                      ? "ऊपर हरे बटन से APK फ़ाइल डाउनलोड करें"
                      : "Download the APK file or tap 1-Click Install"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-800 dark:text-emerald-100 font-bold">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-200 dark:bg-emerald-800 text-[#1B5E20] dark:text-[#4ADE80] text-[10px] font-black">२</span>
                  <span>
                    {language === "mr"
                      ? "किंवा Chrome च्या मेनू (⋮) मधून 'Install app' निवडा ✓"
                      : language === "hi"
                      ? "या Chrome मेनू (⋮) से 'Install app' चुनें ✓"
                      : "Or tap (⋮) in Chrome and select 'Install app' ✓"}
                  </span>
                </div>
              </>
            )}

            {activeTab === "ios" && (
              <>
                <div className="flex items-center gap-2 text-gray-800 dark:text-emerald-100 font-bold">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-[10px] font-black">१</span>
                  <span>
                    {language === "mr"
                      ? "Safari मध्ये खाली असलेले Share (⎋) बटण दाबा"
                      : language === "hi"
                      ? "Safari में नीचे Share (⎋) बटन पर टैप करें"
                      : "Tap the Share button (⎋) in Safari"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-800 dark:text-emerald-100 font-bold">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-[10px] font-black">२</span>
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
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 text-[10px] font-black">१</span>
                  <span>
                    {language === "mr"
                      ? "ब्राऊजरच्या अ‍ॅड्रेस बारमधील (🖥️) आयकॉन दाबा"
                      : language === "hi"
                      ? "ब्राउज़र के एड्रेस बार में (🖥️) आइकन दबाएं"
                      : "Click the Install (🖥️) icon in Chrome URL bar"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-800 dark:text-emerald-100 font-bold">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 text-[10px] font-black">२</span>
                  <span>
                    {language === "mr"
                      ? "'Install' वर क्लिक करून स्वतंत्र डेस्कटॉप अ‍ॅप वापरा ✓"
                      : language === "hi"
                      ? "'Install' चुनकर बिना ब्राउज़र सीधे ऐप चलाएं ✓"
                      : "Click 'Install' to run as dedicated desktop app ✓"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* COMPACT FOOTER */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-[#22402A] flex items-center justify-between gap-2 shrink-0">
          <span className="text-[10px] text-gray-500 dark:text-emerald-300 font-semibold flex items-center gap-1">
            <CheckCircle2 size={12} className="text-[#2E7D32]" />
            <span>{language === "mr" ? "३ MB • १००% सुरक्षित" : language === "hi" ? "३ MB • १००% सुरक्षित" : "3 MB • 100% Safe"}</span>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#1B5E20] hover:bg-[#2E7D32] px-4 py-1.5 text-xs font-black !text-white shadow-xs transition active:scale-95 cursor-pointer"
          >
            {language === "mr" ? "समजले (Got it)" : language === "hi" ? "समझ गया" : "Got it"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
