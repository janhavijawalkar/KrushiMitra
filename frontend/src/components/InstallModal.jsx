import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Download,
  X,
  Smartphone,
  Apple,
  Monitor,
  CheckCircle2,
  FolderDown,
  LayoutGrid,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

export default function InstallModal({ isOpen, onClose, initialPlatform = null }) {
  const { language } = useApp();
  const { isInstallable, isAppInstalled, promptInstall } = useOnlineStatus();
  const [activeTab, setActiveTab] = useState("desktop");
  const [installSuccess, setInstallSuccess] = useState(false);
  const [showManualGuide, setShowManualGuide] = useState(false);
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
      try {
        const ok = await promptInstall();
        if (ok) {
          setInstallSuccess(true);
          setTimeout(() => {
            onClose();
            setInstallSuccess(false);
          }, 2200);
          return;
        }
      } catch (err) {
        console.warn("Prompt install error:", err);
      }
    }
    // If browser prompt is not supported/triggered, automatically download direct installer
    if (activeTab === "desktop") {
      const link = document.createElement("a");
      link.href = "/downloads/KrushiMitra-Setup.exe";
      link.download = "KrushiMitra-Setup.exe";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (activeTab === "android") {
      const link = document.createElement("a");
      link.href = "/downloads/KrushiMitra.apk";
      link.download = "KrushiMitra.apk";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setInstallSuccess(true);
    setTimeout(() => setInstallSuccess(false), 3500);
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[999999] overflow-y-auto bg-black/70 backdrop-blur-md p-3 sm:p-4 flex min-h-full items-center justify-center animate-fade-in"
      style={{ zIndex: 999999 }}
    >
      <div
        className="relative w-full max-w-lg my-auto rounded-3xl bg-white dark:bg-[#132318] p-4 sm:p-6 shadow-2xl border-2 border-emerald-400 dark:border-emerald-600 animate-zoom-fade depth-3 text-gray-900 dark:text-white max-h-[92vh] flex flex-col overflow-hidden"
        style={{ zIndex: 1000000 }}
      >
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3.5 top-3.5 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-[#1A3322] text-gray-700 dark:text-gray-200 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/60 dark:hover:text-red-400 transition cursor-pointer border border-gray-200 dark:border-emerald-800 shadow-sm"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-[#22402A] pb-3 pr-8 shrink-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white shadow-md">
            {activeTab === "desktop" ? <Monitor size={22} className="!text-white" /> : <Smartphone size={22} className="!text-white" />}
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black !text-gray-900 dark:!text-white leading-tight">
              {activeTab === "desktop"
                ? language === "mr"
                  ? "कृषीमित्र संगणक / डेस्कटॉप अ‍ॅप"
                  : language === "hi"
                  ? "कृषि-मित्र कंप्यूटर / डेस्कटॉप ऐप"
                  : "KrushiMitra Desktop / PC App"
                : language === "mr"
                ? "कृषीमित्र मोबाईल अ‍ॅप"
                : language === "hi"
                ? "कृषि-मित्र मोबाइल ऐप"
                : "KrushiMitra Mobile App"}
            </h2>
            <p className="text-[11px] !text-emerald-700 dark:!text-emerald-300 font-bold flex items-center gap-1">
              <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
              <span>
                {language === "mr"
                  ? "⚡ १००% मोफत • शेतात ऑफलाइन चालणारे अ‍ॅप"
                  : language === "hi"
                  ? "⚡ १००% मुफ्त • खेत में ऑफलाइन काम करता है"
                  : "⚡ 100% Free • Works Offline in Fields"}
              </span>
            </p>
          </div>
        </div>

        {/* PLATFORM SELECTOR TABS */}
        <div className="pt-3 shrink-0">
          <div className="flex rounded-xl bg-gray-100 dark:bg-[#183321] p-1 border border-gray-200 dark:border-emerald-800/80 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("desktop")}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-black transition cursor-pointer ${
                activeTab === "desktop"
                  ? "!bg-[#1B5E20] !text-white shadow-sm"
                  : "!text-gray-700 dark:!text-gray-300 hover:!text-[#1B5E20]"
              }`}
            >
              <Monitor size={14} className={activeTab === "desktop" ? "!text-white" : "!text-purple-600 dark:!text-purple-400"} />
              <span>PC / Laptop</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("android")}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-black transition cursor-pointer ${
                activeTab === "android"
                  ? "!bg-[#1B5E20] !text-white shadow-sm"
                  : "!text-gray-700 dark:!text-gray-300 hover:!text-[#1B5E20]"
              }`}
            >
              <Smartphone size={14} className={activeTab === "android" ? "!text-white" : "!text-emerald-700 dark:!text-emerald-400"} />
              <span>Android (APK)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("ios")}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-black transition cursor-pointer ${
                activeTab === "ios"
                  ? "!bg-[#1B5E20] !text-white shadow-sm"
                  : "!text-gray-700 dark:!text-gray-300 hover:!text-[#1B5E20]"
              }`}
            >
              <Apple size={14} className={activeTab === "ios" ? "!text-white" : "!text-blue-600 dark:!text-blue-400"} />
              <span>iPhone</span>
            </button>
          </div>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="mt-3 overflow-y-auto pr-1 space-y-3 scrollbar-thin">
          {/* ===================== TAB 1: DESKTOP / PC ===================== */}
          {activeTab === "desktop" && (
            <>
              {/* OPTION 1: DIRECT WINDOWS SETUP EXE DOWNLOAD */}
              <a
                href="/downloads/KrushiMitra-Setup.exe"
                download="KrushiMitra-Setup.exe"
                className="btn-shimmer group flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 p-3.5 text-white shadow-md hover:-translate-y-0.5 active:scale-95 cursor-pointer no-underline transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white shadow-xs">
                    <FolderDown size={21} className="!text-white" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-xs sm:text-sm font-black !text-white leading-tight">
                      {language === "mr"
                        ? "📥 KrushiMitra-Setup.exe डाऊनलोड"
                        : language === "hi"
                        ? "📥 KrushiMitra-Setup.exe डाउनलोड"
                        : "📥 Download KrushiMitra-Setup.exe"}
                    </p>
                    <p className="text-[10.5px] text-purple-100 font-medium truncate mt-0.5">
                      {language === "mr"
                        ? "Windows संगणकासाठी थेट १-क्लिक इन्स्टॉलर (.EXE)"
                        : language === "hi"
                        ? "Windows कंप्यूटर के लिए १-क्लिक इंस्टॉलर (.EXE)"
                        : "Direct 1-Click Windows PC setup file (.EXE)"}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-lg bg-white/25 px-2.5 py-1 text-[10px] font-black !text-white">
                  .EXE File
                </span>
              </a>

              {/* OPTION 2: 1-CLICK PWA APP INSTALL */}
              <button
                type="button"
                onClick={handleInstallClick}
                className="group w-full flex items-center justify-between gap-3 rounded-2xl border-2 border-emerald-400 dark:border-emerald-600 bg-emerald-50/80 dark:bg-[#183321] p-3 text-[#1B5E20] dark:text-[#4ADE80] shadow-xs hover:bg-emerald-100 dark:hover:bg-[#20442c] active:scale-95 cursor-pointer transition text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-200 dark:bg-[#20442c] text-[#1B5E20] dark:text-[#4ADE80] shadow-xs">
                    <Monitor size={19} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white leading-tight">
                      {isAppInstalled
                        ? language === "mr"
                          ? "✓ संगणकावर आधीच इन्स्टॉल आहे"
                          : language === "hi"
                          ? "✓ कंप्यूटर पर पहले से इंस्टॉल है"
                          : "✓ App Installed on PC"
                        : installSuccess
                        ? language === "mr"
                          ? "✓ इन्स्टॉल प्रक्रिया सुरू झाली!"
                          : language === "hi"
                          ? "✓ इंस्टॉल प्रक्रिया शुरू हो गई!"
                          : "✓ Installation Launched!"
                        : language === "mr"
                        ? "🖥️ थेट १-क्लिक इन्स्टॉल (Browser Install)"
                        : language === "hi"
                        ? "🖥️ तुरंत १-क्लिक इंस्टॉल (Browser Install)"
                        : "🖥️ 1-Click Browser Install"}
                    </p>
                    <p className="text-[10.5px] text-gray-600 dark:text-emerald-300 font-medium truncate mt-0.5">
                      {language === "mr"
                        ? "ब्राऊजरद्वारे थेट डेस्कटॉपवर स्वतंत्र ॲप जोडले जाते"
                        : language === "hi"
                        ? "ब्राउज़र द्वारा सीधे डेस्कटॉप पर ऐप जुड़ता है"
                        : "Installs directly to desktop via browser"}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-lg bg-emerald-200/80 dark:bg-emerald-900/80 px-2 py-1 text-[10px] font-black text-emerald-900 dark:text-emerald-200">
                  1-Click
                </span>
              </button>

              {/* ZERO CONFIG INSTANT SETUP BADGE */}
              <div className="rounded-2xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50/70 dark:bg-[#162A1D] p-3 text-center">
                <p className="text-xs font-black text-emerald-900 dark:text-emerald-200 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={16} className="text-[#1B5E20] dark:text-[#4ADE80] shrink-0" />
                  <span>
                    {language === "mr"
                      ? "⚡ कोणत्याही इतर सॉफ्टवेअरची गरज नाही • १००% मोफत आणि सुरक्षित"
                      : language === "hi"
                      ? "⚡ किसी अन्य सॉफ़्टवेयर की आवश्यकता नहीं • १००% सुरक्षित व मुफ्त"
                      : "⚡ No 3rd-party software needed • 100% Free & Safe"}
                  </span>
                </p>
              </div>
            </>
          )}

          {/* ===================== TAB 2: ANDROID MOBILE ===================== */}
          {activeTab === "android" && (
            <>
              {/* OPTION 1: DIRECT APK DOWNLOAD */}
              <a
                href="/downloads/KrushiMitra.apk"
                download="KrushiMitra.apk"
                className="btn-shimmer group flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] p-3.5 text-white shadow-md hover:-translate-y-0.5 active:scale-95 cursor-pointer no-underline transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white shadow-xs">
                    <FolderDown size={21} className="!text-white" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-xs sm:text-sm font-black !text-white leading-tight">
                      {language === "mr"
                        ? "📥 थेट KrushiMitra.apk डाऊनलोड"
                        : language === "hi"
                        ? "📥 सीधे KrushiMitra.apk डाउनलोड"
                        : "📥 Download KrushiMitra.apk (Direct APK)"}
                    </p>
                    <p className="text-[10.5px] text-emerald-100 font-medium truncate mt-0.5">
                      {language === "mr"
                        ? "Android मोबाईलसाठी थेट इन्स्टॉलर फाईल"
                        : language === "hi"
                        ? "Android मोबाइल हेतु सीधी इंस्टॉलर फ़ाइल"
                        : "Direct installer for Android mobile phones"}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-lg bg-white/25 px-2.5 py-1 text-[10px] font-black !text-white">
                  .APK File
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
                    <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white leading-tight">
                      {installSuccess
                        ? language === "mr"
                          ? "✓ अ‍ॅप इन्स्टॉल झाले!"
                          : language === "hi"
                          ? "✓ ऐप इंस्टॉल हो गया!"
                          : "✓ Installed Successfully!"
                        : language === "mr"
                        ? "📲 थेट १-क्लिक इन्स्टॉल (Add to Screen)"
                        : language === "hi"
                        ? "📲 तुरंत १-क्लिक इंस्टॉल (Add to Screen)"
                        : "📲 1-Click Install to Phone Screen"}
                    </p>
                    <p className="text-[10.5px] text-gray-600 dark:text-emerald-300 font-medium truncate mt-0.5">
                      {language === "mr"
                        ? "मोबाईलच्या होम स्क्रीनवर ॲप जोडले जाईल (१००% मोफत)"
                        : language === "hi"
                        ? "सीधे मोबाइल होम स्क्रीन पर ऐप जुड़ेगा (१००% मुफ्त)"
                        : "Adds native icon directly to mobile home screen"}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-lg bg-emerald-200/80 dark:bg-emerald-900/80 px-2 py-1 text-[10px] font-black text-emerald-900 dark:text-emerald-200">
                  1-Click
                </span>
              </button>

              {/* ANDROID REASSURANCE BADGE */}
              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-[#162A1D] p-3 text-center">
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={16} className="text-[#1B5E20] dark:text-[#4ADE80] shrink-0" />
                  <span>
                    {language === "mr"
                      ? "⚡ १००% सुरक्षित • शेतात इंटरनेट नसतानाही पूर्ण चालते"
                      : language === "hi"
                      ? "⚡ १००% सुरक्षित • खेत में इंटरनेट के बिना भी चलता है"
                      : "⚡ 100% Safe • Works Completely Offline in Fields"}
                  </span>
                </p>
              </div>
            </>
          )}

          {/* ===================== TAB 3: IPHONE / IOS ===================== */}
          {activeTab === "ios" && (
            <div className="rounded-2xl border border-blue-200 dark:border-[#1E3A5F] bg-blue-50/50 dark:bg-[#102238] p-3 text-xs space-y-3">
              <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200 font-black text-xs">
                <Apple size={16} />
                <span>iPhone / iPad Safari Install:</span>
              </div>
              <div className="flex items-center gap-2 text-gray-800 dark:text-blue-100 font-bold">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-black">
                  १
                </span>
                <span>
                  {language === "mr"
                    ? "Safari मध्ये खाली असलेले Share (⎋) बटण दाबा"
                    : language === "hi"
                    ? "Safari में नीचे Share (⎋) बटन पर टैप करें"
                    : "Tap the Share button (⎋) at the bottom of Safari"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-800 dark:text-blue-100 font-bold">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-black">
                  २
                </span>
                <span>
                  {language === "mr"
                    ? "'Add to Home Screen' (+) निवडून 'Add' दाबा ✓"
                    : language === "hi"
                    ? "'Add to Home Screen' (+) चुनकर 'Add' दबाएं ✓"
                    : "Select 'Add to Home Screen' (+) and tap 'Add' ✓"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-[#22402A] flex items-center justify-between gap-2 shrink-0">
          <span className="text-[10.5px] text-gray-600 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-[#2E7D32]" />
            <span>
              {language === "mr"
                ? "१००% मोफत • शेतात ऑफलाइन कार्य करते"
                : language === "hi"
                ? "१००% मुफ्त • खेत में ऑफलाइन काम करता है"
                : "100% Free • Works Offline"}
            </span>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#1B5E20] hover:bg-[#2E7D32] px-4 py-2 text-xs font-black !text-white shadow-xs transition active:scale-95 cursor-pointer"
          >
            {language === "mr" ? "समजले (Got it)" : language === "hi" ? "समझ गया" : "Got it"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
