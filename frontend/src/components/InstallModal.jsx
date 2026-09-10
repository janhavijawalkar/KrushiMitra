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
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md p-3 sm:p-4 md:p-6 flex min-h-full items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg my-auto max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-[#132318] p-5 sm:p-6 shadow-2xl border-2 border-emerald-200 dark:border-emerald-700/60 animate-zoom-fade depth-3 overflow-hidden text-gray-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-[#183321] text-gray-600 dark:text-gray-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/60 dark:hover:text-red-400 transition cursor-pointer shadow-xs border border-gray-200 dark:border-emerald-800"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* HEADER (ALWAYS VISIBLE UPSIDE) */}
        <div className="shrink-0 flex items-center gap-3 border-b border-gray-100 dark:border-[#22402A] pb-3.5 pr-10">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white shadow-md">
            <Download size={22} className="!text-white" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black !text-gray-900 dark:!text-white leading-tight">
              {language === "mr"
                ? "कृषीमित्र अ‍ॅप डाऊनलोड व इन्स्टॉल"
                : language === "hi"
                ? "कृषि-मित्र ऐप डाउनलोड एवं इंस्टॉल"
                : "Download & Install KrushiMitra App"}
            </h2>
            <p className="text-[11px] sm:text-xs !text-gray-500 dark:!text-emerald-300 font-medium">
              {language === "mr"
                ? "शेतात इंटरनेट नसतानाही १००% ऑफलाइन कार्य करते"
                : language === "hi"
                ? "खेत में बिना इंटरनेट भी १००% ऑफलाइन काम करता है"
                : "Works 100% offline in fields with zero mobile data"}
            </p>
          </div>
        </div>

        {/* PLATFORM SELECTOR TABS (PERMANENTLY VISIBLE AT TOP / UPSIDE) */}
        <div className="shrink-0 mt-3.5 mb-1">
          <div className="flex rounded-2xl bg-gray-100 dark:bg-[#1A3322] p-1.5 border border-gray-200 dark:border-emerald-800/80 shadow-inner gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("android")}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-2 text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === "android"
                  ? "!bg-[#1B5E20] !text-white shadow-md ring-2 ring-[#2E7D32]/50 scale-[1.02]"
                  : "!text-gray-700 dark:!text-emerald-100 hover:!text-[#1B5E20] dark:hover:!text-white hover:bg-white/80 dark:hover:bg-white/10"
              }`}
            >
              <Smartphone size={16} className={activeTab === "android" ? "!text-white" : "!text-emerald-700 dark:!text-emerald-400"} />
              <span className={activeTab === "android" ? "!text-white font-black" : "font-bold"}>Android</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("ios")}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-2 text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === "ios"
                  ? "!bg-[#1B5E20] !text-white shadow-md ring-2 ring-[#2E7D32]/50 scale-[1.02]"
                  : "!text-gray-700 dark:!text-emerald-100 hover:!text-[#1B5E20] dark:hover:!text-white hover:bg-white/80 dark:hover:bg-white/10"
              }`}
            >
              <Apple size={16} className={activeTab === "ios" ? "!text-white" : "!text-blue-600 dark:!text-blue-400"} />
              <span className={activeTab === "ios" ? "!text-white font-black" : "font-bold"}>iPhone / iOS</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("desktop")}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-2 text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === "desktop"
                  ? "!bg-[#1B5E20] !text-white shadow-md ring-2 ring-[#2E7D32]/50 scale-[1.02]"
                  : "!text-gray-700 dark:!text-emerald-100 hover:!text-[#1B5E20] dark:hover:!text-white hover:bg-white/80 dark:hover:bg-white/10"
              }`}
            >
              <Monitor size={16} className={activeTab === "desktop" ? "!text-white" : "!text-purple-600 dark:!text-purple-400"} />
              <span className={activeTab === "desktop" ? "!text-white font-black" : "font-bold"}>PC / Desktop</span>
            </button>
          </div>
        </div>

        {/* SCROLLABLE INSTRUCTIONS & DIRECT INSTALL */}
        <div className="overflow-y-auto flex-1 my-3 pr-1 space-y-3 custom-scrollbar">
          {/* 1-CLICK DIRECT INSTALL BUTTON IF SUPPORTED */}
          {isInstallable && (
            <div className="rounded-2xl bg-emerald-50 dark:bg-[#183321] p-3.5 border border-emerald-200 dark:border-emerald-700/60 text-center">
              <p className="text-xs font-bold !text-[#1B5E20] dark:!text-[#4ADE80] mb-2.5 flex items-center justify-center gap-1.5">
                <Sparkles size={15} />
                <span>
                  {language === "mr"
                    ? "तुमच्या ब्राऊजरवर थेट १-क्लिक इन्स्टॉल उपलब्ध आहे!"
                    : language === "hi"
                    ? "आपके ब्राउज़र पर सीधा १-क्लिक इंस्टॉल उपलब्ध है!"
                    : "Direct 1-click install available on your browser!"}
                </span>
              </p>
              <button
                type="button"
                onClick={handleInstallClick}
                className="btn-shimmer w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] py-3 text-xs font-black !text-white shadow-md transition hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <Download size={16} className="!text-white" />
                <span className="!text-white">
                  {installSuccess
                    ? (language === "mr" ? "अ‍ॅप यशस्वीरित्या इन्स्टॉल झाले! ✓" : language === "hi" ? "ऐप सफलतापूर्वक इंस्टॉल हो गया! ✓" : "Installed Successfully! ✓")
                    : (language === "mr" ? "📲 थेट अ‍ॅप इन्स्टॉल करा (Install Now)" : language === "hi" ? "📲 तुरंत ऐप इंस्टॉल करें (Install Now)" : "📲 Install KrushiMitra App Now")}
                </span>
              </button>
            </div>
          )}

          {/* STEP-BY-STEP INSTRUCTIONS ACCORDING TO TAB */}
          <div className="rounded-2xl border border-gray-200 dark:border-[#24402A] bg-[#F9FAF8] dark:bg-[#162A1D] p-4 text-xs space-y-3">
            {activeTab === "android" && (
              <>
                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/60 !text-[#1B5E20] dark:!text-[#4ADE80] font-black text-[11px]">
                    १
                  </span>
                  <p className="!text-gray-800 dark:!text-emerald-100 leading-relaxed font-medium">
                    {language === "mr"
                      ? "मोबाईलवर Google Chrome किंवा Samsung Browser मध्ये KrushiMitra उघडा."
                      : language === "hi"
                      ? "मोबाइल पर Google Chrome या Samsung Internet में KrushiMitra खोलें।"
                      : "Open KrushiMitra in Google Chrome or your Android mobile browser."}
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/60 !text-[#1B5E20] dark:!text-[#4ADE80] font-black text-[11px]">
                    २
                  </span>
                  <p className="!text-gray-800 dark:!text-emerald-100 leading-relaxed font-medium">
                    {language === "mr"
                      ? "ब्राऊजरच्या वरच्या उजव्या कोपऱ्यातील तीन ठिपके (⋮) दाबा आणि 'Install App' किंवा 'Add to Home screen' निवडा."
                      : language === "hi"
                      ? "ब्राउज़र के ऊपर दाईं ओर तीन बिंदुओं (⋮) पर टैप करें और 'Install App' या 'Add to Home screen' चुनें।"
                      : "Tap the 3 dots (⋮) menu in Chrome and select 'Install app' or 'Add to Home screen'."}
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/60 !text-[#1B5E20] dark:!text-[#4ADE80] font-black text-[11px]">
                    ३
                  </span>
                  <p className="!text-gray-800 dark:!text-emerald-100 leading-relaxed font-medium">
                    {language === "mr"
                      ? "अ‍ॅप तुमच्या मोबाईलवर इन्स्टॉल होईल आणि होम स्क्रीनवर कृषीमित्रचा आयकॉन दिसेल!"
                      : language === "hi"
                      ? "ऐप आपके मोबाइल पर इंस्टॉल हो जाएगा और होम स्क्रीन पर कृषि-मित्र का आइकन दिखेगा!"
                      : "The app will be installed with its official green icon on your mobile home screen!"}
                  </p>
                </div>
              </>
            )}

            {activeTab === "ios" && (
              <>
                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/60 !text-blue-700 dark:!text-blue-300 font-black text-[11px]">
                    १
                  </span>
                  <p className="!text-gray-800 dark:!text-emerald-100 leading-relaxed font-medium">
                    {language === "mr"
                      ? "तुमच्या iPhone / iPad वर Safari ब्राऊजरमध्ये KrushiMitra उघडा."
                      : language === "hi"
                      ? "अपने iPhone / iPad पर Safari ब्राउज़र में KrushiMitra खोलें।"
                      : "Open KrushiMitra in the Safari browser on your iPhone or iPad."}
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/60 !text-blue-700 dark:!text-blue-300 font-black text-[11px]">
                    २
                  </span>
                  <p className="!text-gray-800 dark:!text-emerald-100 leading-relaxed font-medium flex items-center gap-1.5 flex-wrap">
                    <span>
                      {language === "mr"
                        ? "खालील शेअर बटणावर (Share"
                        : language === "hi"
                        ? "नीचे दिए गए शेयर बटन (Share"
                        : "Tap the Share button ("}
                    </span>
                    <Share size={14} className="inline text-blue-600 dark:text-blue-400" />
                    <span>
                      {language === "mr"
                        ? ") टॅप करा आणि 'Add to Home Screen'"
                        : language === "hi"
                        ? ") पर टैप करें और 'Add to Home Screen'"
                        : ") at the bottom and tap 'Add to Home Screen'"}
                    </span>
                    <PlusSquare size={14} className="inline text-blue-600 dark:text-blue-400" />
                    <span>{language === "mr" ? "निवडा." : language === "hi" ? "चुनें।" : "."}</span>
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/60 !text-blue-700 dark:!text-blue-300 font-black text-[11px]">
                    ३
                  </span>
                  <p className="!text-gray-800 dark:!text-emerald-100 leading-relaxed font-medium">
                    {language === "mr"
                      ? "उजव्या कोपऱ्यात 'Add' वर क्लिक करा. कृषीमित्र अ‍ॅप आयकॉन तुमच्या iPhone वर तयार होईल."
                      : language === "hi"
                      ? "ऊपर 'Add' पर क्लिक करें। कृषि-मित्र ऐप आइकन आपके आईफोन पर बन जाएगा।"
                      : "Tap 'Add' in the top right. KrushiMitra is now added to your iPhone home screen."}
                  </p>
                </div>
              </>
            )}

            {activeTab === "desktop" && (
              <>
                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/60 !text-purple-700 dark:!text-purple-300 font-black text-[11px]">
                    १
                  </span>
                  <p className="!text-gray-800 dark:!text-emerald-100 leading-relaxed font-medium">
                    {language === "mr"
                      ? "Google Chrome किंवा Microsoft Edge मध्ये KrushiMitra उघडा."
                      : language === "hi"
                      ? "Google Chrome या Microsoft Edge में KrushiMitra खोलें।"
                      : "Open KrushiMitra in Google Chrome or Microsoft Edge on your computer."}
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/60 !text-purple-700 dark:!text-purple-300 font-black text-[11px]">
                    २
                  </span>
                  <p className="!text-gray-800 dark:!text-emerald-100 leading-relaxed font-medium">
                    {language === "mr"
                      ? "ब्राऊजरच्या अ‍ॅड्रेस बारमध्ये उजव्या बाजूला दिसणाऱ्या कॉम्प्युटर/डाऊनलोड आयकॉनवर क्लिक करा."
                      : language === "hi"
                      ? "ब्राउज़र के एड्रेस बार में दाईं ओर दिखने वाले कंप्यूटर/डाउनलोड आइकन पर क्लिक करें।"
                      : "Click the Install icon (computer with down arrow) located in the right of the URL address bar."}
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/60 !text-purple-700 dark:!text-purple-300 font-black text-[11px]">
                    ३
                  </span>
                  <p className="!text-gray-800 dark:!text-emerald-100 leading-relaxed font-medium">
                    {language === "mr"
                      ? "'Install' बटण दाबा. KrushiMitra स्वतंत्र विंडोज/मॅक अ‍ॅप म्हणून सुरू होईल."
                      : language === "hi"
                      ? "'Install' पर क्लिक करें। KrushiMitra एक स्वतंत्र डेस्कटॉप ऐप के रूप में चलेगा।"
                      : "Click 'Install'. KrushiMitra will run as a dedicated, fullscreen desktop app."}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* BOTTOM BENEFIT BADGE (ALWAYS VISIBLE AT BOTTOM) */}
        <div className="shrink-0 flex items-center justify-between text-[11px] !text-gray-500 dark:!text-gray-300 pt-3 border-t border-gray-100 dark:border-[#22402A]">
          <span className="flex items-center gap-1 !text-[#2E7D32] dark:!text-[#4ADE80] font-bold">
            <CheckCircle2 size={13} />
            <span>{language === "mr" ? "केवळ ३ MB आकार" : language === "hi" ? "केवल ३ MB साइज" : "Ultra-Lightweight (3 MB)"}</span>
          </span>
          <span className="flex items-center gap-1 !text-blue-600 dark:!text-blue-400 font-bold">
            <CheckCircle2 size={13} />
            <span>{language === "mr" ? "कधीही अपडेट्सची चिंता नाही" : language === "hi" ? "हमेशा ऑटो-अपडेट" : "Automatic Updates"}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
