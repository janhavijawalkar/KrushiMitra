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
  QrCode,
  ExternalLink,
  Laptop,
  AlertCircle,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

export default function InstallModal({ isOpen, onClose, initialPlatform = null }) {
  const { language } = useApp();
  const { isInstallable, promptInstall } = useOnlineStatus();
  const [activeTab, setActiveTab] = useState("desktop");
  const [installSuccess, setInstallSuccess] = useState(false);
  const [showPhoneOptions, setShowPhoneOptions] = useState(false);
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
    // If browser prompt is not immediately available, show success notice & guidance
    setInstallSuccess(true);
    setTimeout(() => setInstallSuccess(false), 3500);
  };

  const downloadWindowsShortcut = () => {
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "https://krushimitra.vercel.app";
    const content = `[InternetShortcut]\r\nURL=${origin}/\r\nIconIndex=0\r\nIconFile=${origin}/favicon.ico\r\nHotKey=0\r\nIDList=\r\n[{000214A0-0000-0000-C000-000000000046}]\r\nProp3=19,0\r\n`;
    const blob = new Blob([content], { type: "application/x-msdownload;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "KrushiMitra_Desktop.url";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setInstallSuccess(true);
    setTimeout(() => setInstallSuccess(false), 3000);
  };

  const currentUrl =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "https://krushimitra.vercel.app";

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
                  ? "१००% सुरक्षित • कोणत्याही ३ऱ्या पार्टी ॲपची गरज नाही"
                  : language === "hi"
                  ? "१००% सुरक्षित • किसी तीसरे (3rd-party) ऐप की जरूरत नहीं"
                  : "100% Safe & Direct • Zero 3rd-Party Apps Needed"}
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
              <span>Android</span>
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
              {/* CLEAR FARMER REASSURANCE BADGE */}
              <div className="rounded-2xl border border-emerald-300 dark:border-emerald-700/80 bg-emerald-50/90 dark:bg-[#162A1D] p-3 text-xs flex items-start gap-2.5">
                <ShieldCheck size={18} className="text-[#1B5E20] dark:text-[#4ADE80] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-black text-[#1B5E20] dark:text-[#4ADE80] leading-snug">
                    {language === "mr"
                      ? "कोणत्याही ३ऱ्या पार्टी सॉफ्टवेअर (Emulator) ची गरज नाही!"
                      : language === "hi"
                      ? "किसी भी तीसरे (3rd-party) सॉफ़्टवेयर या एमुलेटर की ज़रूरत नहीं!"
                      : "No 3rd-Party Software or Emulators Required!"}
                  </p>
                  <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">
                    {language === "mr"
                      ? "संगणकावर APK चालत नाही व त्यासाठी कोणतेही अनोळखी ॲप डाऊनलोड करू नका. खालील बटणाने थेट KrushiMitra तुमच्या डेस्कटॉपवर चालवा."
                      : language === "hi"
                      ? "कंप्यूटर पर APK नहीं चलता और इसके लिए कोई अज्ञात ऐप डाउनलोड न करें। नीचे दिए बटन से सीधा KrushiMitra अपने डेस्कटॉप पर चलाएं।"
                      : "APK files only run on Android. Do NOT install unknown emulators. Use direct 1-click install or desktop shortcut below."}
                  </p>
                </div>
              </div>

              {/* PRIMARY ACTION 1: 1-CLICK PWA INSTALL */}
              <button
                type="button"
                onClick={handleInstallClick}
                className="btn-shimmer group w-full flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] p-3.5 text-white shadow-md hover:-translate-y-0.5 active:scale-95 cursor-pointer text-left transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white shadow-xs">
                    <Monitor size={21} className="!text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-black !text-white leading-tight">
                      {installSuccess
                        ? language === "mr"
                          ? "✓ इन्स्टॉल प्रक्रिया सुरू झाली!"
                          : language === "hi"
                          ? "✓ इंस्टॉल प्रक्रिया शुरू हो गई!"
                          : "✓ Installation Launched!"
                        : language === "mr"
                        ? "🖥️ संगणकावर १-क्लिक इन्स्टॉल करा"
                        : language === "hi"
                        ? "🖥️ कंप्यूटर पर १-क्लिक इंस्टॉल करें"
                        : "🖥️ 1-Click Install to Desktop"}
                    </p>
                    <p className="text-[10.5px] text-emerald-100 font-medium truncate mt-0.5">
                      {language === "mr"
                        ? "Windows डेस्कटॉप स्क्रीनवर KrushiMitra चे आयकॉन जोडले जाईल"
                        : language === "hi"
                        ? "Windows डेस्कटॉप स्क्रीन पर KrushiMitra का आइकन जुड़ जाएगा"
                        : "Adds KrushiMitra directly to your Windows desktop & start menu"}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-lg bg-white/25 px-2.5 py-1 text-[10px] font-black !text-white">
                  1-Click App
                </span>
              </button>

              {/* SECONDARY ACTION 2: DOWNLOAD WINDOWS SHORTCUT (.URL) */}
              <button
                type="button"
                onClick={downloadWindowsShortcut}
                className="group w-full flex items-center justify-between gap-3 rounded-2xl border-2 border-emerald-300 dark:border-emerald-700 bg-white dark:bg-[#183321] p-3 text-[#1B5E20] dark:text-[#4ADE80] shadow-xs hover:bg-emerald-50 dark:hover:bg-[#20442c] active:scale-95 cursor-pointer transition text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-[#20442c] text-[#1B5E20] dark:text-[#4ADE80] shadow-xs">
                    <FolderDown size={19} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-black leading-tight text-gray-900 dark:text-white">
                      {language === "mr"
                        ? "⬇️ Windows डेस्कटॉप शॉर्टकट डाऊनलोड करा"
                        : language === "hi"
                        ? "⬇️ Windows डेस्कटॉप शॉर्टकट डाउनलोड करें"
                        : "⬇️ Download Windows Desktop Shortcut (.url)"}
                    </p>
                    <p className="text-[10.5px] text-gray-600 dark:text-emerald-300 font-medium truncate mt-0.5">
                      {language === "mr"
                        ? "डाऊनलोड झालेली फाईल डेस्कटॉपवर ठेवा — त्यावर डबल-क्लिक करताच ॲप उघडेल"
                        : language === "hi"
                        ? "डाउनलोड फ़ाइल डेस्कटॉप पर रखें — डबल-क्लिक करते ही सीधा ऐप खुलेगा"
                        : "Save to your desktop — double-click anytime to open instantly"}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-lg bg-emerald-100 dark:bg-emerald-900/80 px-2 py-1 text-[10px] font-black text-emerald-900 dark:text-emerald-200">
                  Direct .url
                </span>
              </button>

              {/* BROWSER URL BAR VISUAL GUIDE */}
              <div className="rounded-2xl border border-gray-200 dark:border-[#24402A] bg-gray-50/80 dark:bg-[#162A1D] p-3 text-xs space-y-2">
                <p className="font-black text-gray-900 dark:text-emerald-200 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Monitor size={13} className="text-[#1B5E20] dark:text-[#4ADE80]" />
                  <span>
                    {language === "mr"
                      ? "किंवा Chrome / Edge मध्ये थेट इन्स्टॉल करा:"
                      : language === "hi"
                      ? "या Chrome / Edge में सीधे इंस्टॉल करें:"
                      : "Or Install Directly via Chrome / Edge:"}
                  </span>
                </p>

                <div className="flex items-center gap-2 text-gray-800 dark:text-emerald-100 font-bold">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-200 dark:bg-emerald-800 text-[#1B5E20] dark:text-[#4ADE80] text-[10px] font-black">
                    १
                  </span>
                  <span>
                    {language === "mr"
                      ? "ब्राऊजरच्या सर्वात वरच्या ॲड्रेस बारमध्ये उजव्या बाजूला (🖥️ किंवा ⊕) चिन्ह दाबा"
                      : language === "hi"
                      ? "ब्राउज़र के सबसे ऊपर एड्रेस बार में दाईं ओर (🖥️ या ⊕) आइकन पर क्लिक करें"
                      : "Look at top URL bar in Chrome/Edge, click the (🖥️ or ⊕) icon"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-800 dark:text-emerald-100 font-bold">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-200 dark:bg-emerald-800 text-[#1B5E20] dark:text-[#4ADE80] text-[10px] font-black">
                    २
                  </span>
                  <span>
                    {language === "mr"
                      ? "'Install' वर क्लिक करा — KrushiMitra चे स्वतंत्र ॲप संगणकावर तयार होईल ✓"
                      : language === "hi"
                      ? "'Install' चुनें — KrushiMitra का स्वतंत्र ऐप कंप्यूटर पर तैयार हो जाएगा ✓"
                      : "Click 'Install' — KrushiMitra runs in its own clean desktop window ✓"}
                  </span>
                </div>
              </div>

              {/* TOGGLE FOR MOBILE PHONE OPTIONS (FOR USERS VISITING ON PC BUT WANTING APP ON PHONE) */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowPhoneOptions(!showPhoneOptions)}
                  className="w-full flex items-center justify-between rounded-xl bg-gray-100 dark:bg-[#1A3322] px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-200 hover:text-[#1B5E20] dark:hover:text-[#4ADE80] transition cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Smartphone size={14} className="text-emerald-600" />
                    <span>
                      {language === "mr"
                        ? "📲 हे ॲप तुमच्या मोबाईल फोनवर हवे आहे का?"
                        : language === "hi"
                        ? "📲 यह ऐप अपने मोबाइल फ़ोन पर चाहिए?"
                        : "📲 Need this app on your Mobile Phone?"}
                    </span>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    {showPhoneOptions ? "▲ लपवा (Hide)" : "▼ येथे पहा (Show)"}
                  </span>
                </button>

                {showPhoneOptions && (
                  <div className="mt-2 p-3 rounded-2xl border border-gray-200 dark:border-[#22402A] bg-gray-50/50 dark:bg-[#15271b] space-y-3 animate-fade-in">
                    {/* QR CODE SCANNER */}
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-white rounded-xl shadow-xs border border-gray-200 shrink-0">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(
                            currentUrl
                          )}`}
                          alt="Scan to open on phone"
                          className="h-20 w-20 rounded-lg"
                        />
                      </div>
                      <div className="text-xs space-y-1">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {language === "mr"
                            ? "📱 फोनच्या कॅमेऱ्याने QR स्कॅन करा"
                            : language === "hi"
                            ? "📱 फ़ोन के कैमरे से QR स्कैन करें"
                            : "📱 Scan QR with Phone Camera"}
                        </p>
                        <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-snug">
                          {language === "mr"
                            ? "स्कॅन करताच तुमच्या मोबाईल फोनवर KrushiMitra थेट उघडेल."
                            : language === "hi"
                            ? "स्कैन करते ही आपके मोबाइल फ़ोन पर KrushiMitra सीधे खुल जाएगा।"
                            : "Scan to open KrushiMitra directly on your mobile browser."}
                        </p>
                      </div>
                    </div>

                    {/* DIRECT APK DOWNLOAD WITH WARNING */}
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                      <a
                        href="/downloads/KrushiMitra.apk"
                        download="KrushiMitra.apk"
                        className="flex items-center justify-between gap-2 rounded-xl bg-gray-200 dark:bg-[#203D27] hover:bg-emerald-100 hover:text-[#1B5E20] dark:hover:bg-[#254d30] p-2.5 text-xs font-bold text-gray-800 dark:text-gray-200 transition no-underline"
                      >
                        <span className="flex items-center gap-2">
                          <FolderDown size={16} className="text-emerald-700 dark:text-emerald-400" />
                          <span>
                            {language === "mr"
                              ? "📥 Android फोनसाठी APK फाईल डाऊनलोड करा"
                              : language === "hi"
                              ? "📥 Android फ़ोन हेतु APK फ़ाइल डाउनलोड करें"
                              : "📥 Download APK for Android Phone"}
                          </span>
                        </span>
                        <span className="rounded bg-black/10 dark:bg-white/10 px-1.5 py-0.5 text-[10px] font-black">
                          Android Only
                        </span>
                      </a>
                      <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium mt-1">
                        {language === "mr"
                          ? "⚠️ टीप: ही .apk फाइल फक्त अँड्रॉइड फोनवर चालते, संगणकावर उघडू नये."
                          : language === "hi"
                          ? "⚠️ ध्यान दें: यह .apk फ़ाइल केवल एंड्रॉइड फ़ोन पर चलेगी, कंप्यूटर पर न खोलें।"
                          : "⚠️ Note: .apk files are for Android phones only and do not run on Windows PC."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ===================== TAB 2: ANDROID MOBILE ===================== */}
          {activeTab === "android" && (
            <>
              {/* OPTION 1: 1-CLICK PWA INSTALL */}
              <button
                type="button"
                onClick={handleInstallClick}
                className="btn-shimmer group w-full flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] p-3.5 text-white shadow-md hover:-translate-y-0.5 active:scale-95 cursor-pointer text-left transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white shadow-xs">
                    <LayoutGrid size={20} className="!text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-black !text-white leading-tight">
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
                    <p className="text-[10.5px] text-emerald-100 font-medium truncate mt-0.5">
                      {language === "mr"
                        ? "मोबाईलच्या होम स्क्रीनवर ॲप जोडले जाईल (१००% मोफत)"
                        : language === "hi"
                        ? "सीधे मोबाइल होम स्क्रीन पर ऐप जुड़ेगा (१००% मुफ्त)"
                        : "Adds native icon directly to mobile home screen"}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-lg bg-white/25 px-2.5 py-1 text-[10px] font-black !text-white">
                  1-Click
                </span>
              </button>

              {/* OPTION 2: DIRECT APK DOWNLOAD */}
              <a
                href="/downloads/KrushiMitra.apk"
                download="KrushiMitra.apk"
                className="group flex items-center justify-between gap-3 rounded-2xl border-2 border-emerald-300 dark:border-emerald-700 bg-white dark:bg-[#183321] p-3 text-[#1B5E20] dark:text-[#4ADE80] shadow-xs hover:bg-emerald-50 dark:hover:bg-[#20442c] active:scale-95 cursor-pointer no-underline transition"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-[#20442c] text-[#1B5E20] dark:text-[#4ADE80] shadow-xs">
                    <FolderDown size={19} />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white leading-tight">
                      {language === "mr"
                        ? "📥 थेट KrushiMitra.apk डाऊनलोड"
                        : language === "hi"
                        ? "📥 सीधे KrushiMitra.apk डाउनलोड"
                        : "📥 Download KrushiMitra.apk (Offline)"}
                    </p>
                    <p className="text-[10.5px] text-gray-600 dark:text-emerald-300 font-medium truncate mt-0.5">
                      {language === "mr"
                        ? "फोनच्या 'Downloads' फोल्डरमध्ये सेव्ह होते"
                        : language === "hi"
                        ? "फ़ोन के 'Downloads' फ़ोल्डर में सेव होगा"
                        : "Saves directly to your phone Downloads"}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-lg bg-emerald-100 dark:bg-emerald-900/80 px-2 py-1 text-[10px] font-black text-emerald-900 dark:text-emerald-200">
                  APK File
                </span>
              </a>

              {/* 2-STEP ANDROID INSTRUCTIONS */}
              <div className="rounded-2xl border border-emerald-100 dark:border-[#24402A] bg-emerald-50/40 dark:bg-[#162A1D] p-3 text-xs space-y-2">
                <div className="flex items-center gap-2 text-gray-800 dark:text-emerald-100 font-bold">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-200 dark:bg-emerald-800 text-[#1B5E20] dark:text-[#4ADE80] text-[10px] font-black">
                    १
                  </span>
                  <span>
                    {language === "mr"
                      ? "वर दिलेल्या '१-क्लिक इन्स्टॉल' बटनावर क्लिक करा"
                      : language === "hi"
                      ? "ऊपर दिए गए '१-क्लिक इंस्टॉल' बटन पर क्लिक करें"
                      : "Tap the 1-Click Install button above"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-800 dark:text-emerald-100 font-bold">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-200 dark:bg-emerald-800 text-[#1B5E20] dark:text-[#4ADE80] text-[10px] font-black">
                    २
                  </span>
                  <span>
                    {language === "mr"
                      ? "किंवा Chrome च्या मेनू (⋮) मधून 'Install app' निवडा ✓"
                      : language === "hi"
                      ? "या Chrome मेनू (⋮) से 'Install app' चुनें ✓"
                      : "Or tap (⋮) in Chrome and select 'Install app' ✓"}
                  </span>
                </div>
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
