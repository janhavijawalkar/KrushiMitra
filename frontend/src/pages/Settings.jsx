import { useState } from "react";
import {
  Palette,
  Globe,
  Shield,
  HelpCircle,
  Info,
  Sun,
  Moon,
  Monitor,
  Check,
  Send,
  PhoneCall,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Trash2,
  CheckCircle2,
  BookOpen,
  Sprout,
  TrendingUp,
  CloudSun,
  FileText,
  Award,
  Users,
  Target,
  ShieldCheck,
  Lock,
  ExternalLink,
  LifeBuoy,
} from "lucide-react";

import { useApp } from "../context/AppContext";

export default function Settings() {
  const {
    language,
    changeLanguage,
    theme,
    changeTheme,
    fontSize,
    changeFontSize,
    resetFarmData,
    supportTickets,
    submitSupportTicket,
    t,
  } = useApp();

  const [section, setSection] = useState("appearance");
  const [saveToast, setSaveToast] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);

  // Support Form State
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "Crop Prediction",
    message: "",
  });
  const [ticketSuccess, setTicketSuccess] = useState("");

  const showFeedback = (msg) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(""), 3500);
  };

  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
    showFeedback(
      language === "mr"
        ? `थीम यशस्वीरित्या ${newTheme === "dark" ? "डार्क मोड" : newTheme === "light" ? "लाईट मोड" : "सिस्टम मोड"} वर बदलली.`
        : language === "hi"
        ? `थीम बदलकर ${newTheme === "dark" ? "डार्क मोड" : newTheme === "light" ? "लाइट मोड" : "सिस्टम मोड"} कर दी गई।`
        : `Theme updated to ${newTheme.toUpperCase()}`
    );
  };

  const handleFontSizeChange = (newSize) => {
    changeFontSize(newSize);
    showFeedback(
      language === "mr"
        ? `फॉन्ट आकार यशस्वीरित्या बदलला (${newSize}).`
        : language === "hi"
        ? `फ़ॉन्ट आकार अपडेट किया गया (${newSize})।`
        : `Font size updated to ${newSize.toUpperCase()}`
    );
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) {
      return;
    }

    try {
      const created = await submitSupportTicket(ticketForm);
      const ticketId = created?.ticket_id || created?.id || "TICK-" + Date.now().toString().slice(-6);
      setTicketSuccess(
        language === "mr"
          ? `आपली विनंती यशस्वीपणे पाठवली गेली! तिकीट आयडी: ${ticketId}`
          : language === "hi"
          ? `आपका अनुरोध सफलतापूर्वक भेज दिया गया! टिकट आईडी: ${ticketId}`
          : `Support request submitted! Ticket ID: ${ticketId}`
      );
      setTicketForm({ subject: "", category: "Crop Prediction", message: "" });
      setTimeout(() => setTicketSuccess(""), 6000);
    } catch (err) {
      showFeedback(language === "mr" ? "मदत संदेश पाठवणे अयशस्वी झाले." : language === "hi" ? "सहायता अनुरोध भेजने में विफल।" : "Failed to submit support inquiry.");
    }
  };

  const handleResetData = () => {
    resetFarmData();
    setShowResetModal(false);
    showFeedback(language === "mr" ? "सर्व जतन केलेल्या पीक अंदाज आणि शिफारस नोंदी साफ केल्या." : language === "hi" ? "सभी सहेजे गए फसल पूर्वानुमान और सिफारिश रिकॉर्ड हटा दिए गए।" : "All local predictions and recommendations have been cleared.");
  };

  const sections = [
    { id: "appearance", icon: Palette, label: t("appearance") || "Appearance & Theme" },
    { id: "language", icon: Globe, label: t("language") || "Language & Regional" },
    { id: "help", icon: HelpCircle, label: t("helpSupport") || "Help & Support" },
    { id: "about", icon: Info, label: t("about") || "About KrushiMitra" },
    { id: "privacy", icon: Shield, label: t("privacy") || "Privacy & Storage" },
  ];

  const faqs = language === "mr" ? [
    {
      q: "पीक शिफारस प्रणाली कशी काम करते?",
      a: "पीक शिफारस प्रणाली आपल्या शेतातील माती घटकांचे (N, P, K, pH) आणि हवामानाचे (तापमान, आर्द्रता, पाऊस) विश्लेषण करून आपल्या जमिनीसाठी सर्वात योग्य व फायदेशीर पिकाची शिफारस करते.",
    },
    {
      q: "पीक उत्पादकता / उत्पन्न अंदाज कसा काढला जातो?",
      a: "महाराष्ट्रातील विविध जिल्ह्यांच्या शेतीविषयक माहितीच्या आधारे जिल्हा, पीक, हंगाम, क्षेत्रफळ, पाऊस आणि तापमानाचा विचार करून हेक्टरी अंदाजित उत्पादन (टन/हेक्टर) काढले जाते.",
    },
    {
      q: "अधिकृत शेती PDF अहवाल कसा डाउनलोड करावा?",
      a: "अहवाल (Reports) किंवा इतिहास (History) पानावर जाऊन 'PDF डाऊनलोड करा' किंवा 'संपूर्ण शेती अहवाल बंडल' बटनावर क्लिक करा. आपल्या शेताचा प्रमाणित A4 PDF अहवाल तयार होईल.",
    },
    {
      q: "हवामानाची माहिती कुठून मिळवली जाते?",
      a: "थेट हवामान माहिती OpenWeatherMap API द्वारे रिअल-टाइममध्ये मिळवली जाते, ज्यामध्ये तापमान, आर्द्रता, वारा आणि पावसाचा अचूक अंदाज समाविष्ट असतो.",
    },
  ] : language === "hi" ? [
    {
      q: "फसल सिफारिश प्रणाली कैसे काम करती है?",
      a: "फसल सिफारिश प्रणाली खेत की मिट्टी के घटकों (N, P, K, pH) और मौसम (तापमान, आर्द्रता, वर्षा) का विश्लेषण करके आपकी भूमि के लिए सर्वोत्तम फसल की सिफारिश करती है।",
    },
    {
      q: "फसल उपज / उत्पादकता पूर्वानुमान कैसे काम करता है?",
      a: "महाराष्ट्र के जिलावार कृषि डेटा के आधार पर जिला, फसल, मौसम, बुवाई क्षेत्रफल, वर्षा और तापमान को ध्यान में रखकर अपेक्षित फसल उत्पादन (टन/हेक्टेयर) का अनुमान लगाया जाता है।",
    },
    {
      q: "आधिकारिक कृषि पीडीएफ रिपोर्ट कैसे डाउनलोड करें?",
      a: "रिपोर्ट्स (Reports) या इतिहास (History) पृष्ठ पर जाकर 'पीडीएफ डाउनलोड करें' बटन पर क्लिक करें। आपका आधिकारिक A4 कृषि दस्तावेज तुरंत तैयार हो जाएगा।",
    },
    {
      q: "मौसम का पूर्वानुमान कहाँ से प्राप्त होता है?",
      a: "वास्तविक समय का मौसम डेटा OpenWeatherMap API के माध्यम से प्राप्त किया जाता है, जिसमें तापमान, आर्द्रता, हवा की गति और वर्षा की जानकारी शामिल है।",
    },
  ] : [
    {
      q: "How does the Crop Recommendation engine work?",
      a: "The Crop Recommendation engine analyzes agricultural soil records. It evaluates Soil Nitrogen (N), Phosphorus (P), Potassium (K), Soil pH, Ambient Temperature, Humidity, and Rainfall to determine the optimal crop for your farmland.",
    },
    {
      q: "How does the Crop Productivity / Yield predictor work?",
      a: "Yield predictions are calculated using regional agricultural datasets across Maharashtra. It takes district name, crop type, year, season, cultivated area, rainfall, and temperature to estimate expected harvest productivity in tonnes per hectare.",
    },
    {
      q: "How do I export official farm reports in PDF?",
      a: "Navigate to the Reports page or History tab, and click 'Download PDF' or 'Export Full Farm PDF'. The system generates a formatted A4 document with your farm metrics, tables, and agronomist tips.",
    },
    {
      q: "Where is the weather forecast data sourced from?",
      a: "Live weather data is fetched in real-time from the OpenWeatherMap REST API through the KrushiMitra backend, providing temperature, humidity, wind, and precipitation metrics.",
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-[#172B18]">
          {t("settings") || "Platform Settings"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          {t("settingsDescription") || "Configure your preferences, theme, regional languages, and help resources."}
        </p>
      </div>

      {/* TOAST ALERT */}
      {saveToast && (
        <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-[#EAF7EC] p-3.5 text-xs sm:text-sm font-semibold text-[#1B5E20] shadow-sm animate-fade-in">
          <CheckCircle2 size={18} className="text-[#2E7D32]" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* MAIN SETTINGS LAYOUT */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* SIDEBAR NAVIGATION */}
        <div className="rounded-3xl border border-[#DCE8D9] bg-white p-3.5 shadow-sm h-fit space-y-1">
          {sections.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  active
                    ? "bg-[#2E7D32] text-white shadow-[0_4px_14px_rgba(46,125,50,0.25)]"
                    : "text-gray-600 hover:bg-[#F3F8F0] hover:text-[#2E7D32]"
                }`}
              >
                <Icon size={18} className={active ? "text-white" : "text-[#2E7D32]"} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* SETTINGS CONTENT CONTAINER */}
        <div key={section} className="rounded-3xl border border-[#DCE8D9] bg-white p-6 sm:p-8 shadow-sm animate-fade-in-up">
          {/* =========================================================
              1. APPEARANCE & THEME
             ========================================================= */}
          {section === "appearance" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {t("appearance") || "Appearance & Display"}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  {t("customizeAppearance") || "Choose how KrushiMitra looks and feels on your device."}
                </p>
              </div>

              {/* THEME SELECTOR */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Palette size={16} className="text-[#2E7D32]" />
                  <span>{language === "mr" ? "रंग थीम निवडा" : language === "hi" ? "रंग थीम चुनें" : "Color Theme"}</span>
                </h3>

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                  {[
                    { id: "light", icon: Sun, label: language === "mr" ? "लाईट मोड (दिवस)" : language === "hi" ? "लाइट मोड (दिन)" : "Light Forest", desc: language === "mr" ? "हिरवा प्रसन्न दिवस मोड" : language === "hi" ? "उज्ज्वल हरा दिन मोड" : "Crisp emerald daytime palette" },
                    { id: "dark", icon: Moon, label: language === "mr" ? "डार्क मोड (रात्र)" : language === "hi" ? "डार्क मोड (रात)" : "Dark Midnight", desc: language === "mr" ? "गडद हिरवा रात्र मोड" : language === "hi" ? "गहरा हरा रात मोड" : "High contrast dark emerald theme" },
                    { id: "auto", icon: Monitor, label: language === "mr" ? "सिस्टम डिफॉल्ट" : language === "hi" ? "सिस्टम अनुसार" : "System Sync", desc: language === "mr" ? "डिव्हाइसनुसार आपोआप" : language === "hi" ? "डिवाइस अनुसार स्वचालित" : "Matches device operating system" },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = theme === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleThemeChange(item.id)}
                        className={`key-cap flex flex-col items-center rounded-2xl p-5 text-center transition cursor-pointer ${
                          isSelected
                            ? "bg-[#F0F8ED] border-[#2E7D32] text-[#2E7D32] font-bold shadow-md ring-2 ring-[#2E7D32]/20"
                            : "border-[#E2EAE0] hover:border-[#2E7D32]/40 hover:bg-[#FAFDF9]"
                        }`}
                      >
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-110 ${
                            isSelected
                              ? "bg-[#2E7D32] text-white"
                              : "bg-[#EAF3E6] text-[#2E7D32]"
                          }`}
                        >
                          <Icon size={24} />
                        </div>
                        <span className="mt-3 text-xs sm:text-sm font-bold text-gray-800">
                          {item.label}
                        </span>
                        <span className="mt-0.5 text-[10px] text-gray-400">
                          {item.desc}
                        </span>
                        {isSelected && (
                          <span className="mt-2.5 flex items-center gap-1 text-[10px] font-bold text-[#2E7D32]">
                            <Check size={13} /> {language === "mr" ? "सक्रिय" : language === "hi" ? "सक्रिय" : "Active"}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FONT SIZE SELECTOR */}
              <div className="pt-2 border-t border-[#EEF2EC]">
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span>{language === "mr" ? "फॉन्ट आकार स्केलिंग" : language === "hi" ? "फ़ॉन्ट आकार स्केलिंग" : "Font Scaling"}</span>
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "small", label: language === "mr" ? "लहान (Compact)" : language === "hi" ? "छोटा (Compact)" : "Compact (Small)", sample: "14px" },
                    { id: "medium", label: language === "mr" ? "मध्यम (Standard)" : language === "hi" ? "मध्यम (Standard)" : "Standard (Default)", sample: "15px" },
                    { id: "large", label: language === "mr" ? "मोठा (Accessible)" : language === "hi" ? "बड़ा (Accessible)" : "Accessible (Large)", sample: "16.5px" },
                  ].map((item) => {
                    const isSelected = fontSize === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleFontSizeChange(item.id)}
                        className={`key-cap rounded-2xl p-4 text-center transition cursor-pointer ${
                          isSelected
                            ? "bg-[#F0F8ED] text-[#2E7D32] font-bold border-[#2E7D32] ring-2 ring-[#2E7D32]/20"
                            : "border-[#E2EAE0] text-gray-600 hover:bg-[#FAFDF9]"
                        }`}
                      >
                        <p className="text-xs sm:text-sm">{item.label}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{item.sample}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* LIVE PREVIEW BOX */}
              <div className="rounded-2xl border border-[#DCE8D9] bg-[#F8FAF7] p-4.5">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  {language === "mr" ? "थेट दृश्य पूर्वावलोकन" : language === "hi" ? "लाइव दृश्य पूर्वावलोकन" : "Live Visual Preview"}
                </span>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2E7D32] text-white">
                    🌾
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1B5E20]">
                      {language === "mr" ? "कृषीमित्र अचूक कृषी सल्ला" : language === "hi" ? "कृषि-मित्र सटीक कृषि परामर्श" : "KrushiMitra Precision Advisory"}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {language === "mr"
                        ? "निवडलेली थीम आणि फॉन्ट आकार सर्व अंदाज, शिफारसी आणि अहवाल पृष्ठांवर त्वरित लागू होतो."
                        : language === "hi"
                        ? "चुनी गई थीम और फ़ॉन्ट आकार सभी पूर्वानुमान, सिफारिश और रिपोर्ट पृष्ठों पर तुरंत लागू होता है।"
                        : "The chosen theme and font size are applied in real-time across all prediction and reporting dashboards."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              2. LANGUAGE & REGIONAL
             ========================================================= */}
          {section === "language" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {t("language") || "Language & Regional Settings"}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  {language === "mr"
                    ? "शेती सल्ला, फॉर्म लेबल्स आणि सूचनांसाठी आपली मुख्य भाषा निवडा."
                    : language === "hi"
                    ? "कृषि सलाह, फॉर्म लेबल और सूचनाओं के लिए अपनी प्राथमिक भाषा चुनें।"
                    : "Select your primary language for farmer advisories, form labels, and notifications."}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { id: "en", native: "English", english: "English (Global)", badge: "EN", flag: "🌐" },
                  { id: "hi", native: "हिन्दी", english: "Hindi (राष्ट्रभाषा)", badge: "HI", flag: "🇮🇳" },
                  { id: "mr", native: "मराठी", english: "Marathi (महाराष्ट्र प्रादेशिक)", badge: "MR", flag: "🚩" },
                ].map((item) => {
                  const isSelected = language === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        changeLanguage(item.id);
                        showFeedback(
                          item.id === "mr"
                            ? `भाषा यशस्वीरित्या मराठी वर बदलली.`
                            : item.id === "hi"
                            ? `भाषा बदलकर हिन्दी कर दी गई।`
                            : `Language switched to ${item.native}`
                        );
                      }}
                      className={`flex w-full items-center justify-between rounded-2xl border-2 p-5 transition cursor-pointer ${
                        isSelected
                          ? "border-[#2E7D32] bg-[#F0F8ED] shadow-sm"
                          : "border-[#E2EAE0] hover:border-[#2E7D32]/40 hover:bg-[#FAFDF9]"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="text-2xl">{item.flag}</span>
                        <div className="text-left">
                          <p className="text-sm font-bold text-gray-800">
                            {item.native}
                          </p>
                          <p className="text-xs text-gray-400">{item.english}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#E5F7EA] px-2.5 py-0.5 text-[10px] font-bold text-[#2E7D32]">
                          {item.badge}
                        </span>
                        {isSelected && (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2E7D32] text-white">
                            <Check size={14} />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================
              3. HELP & SUPPORT
             ========================================================= */}
          {section === "help" && (
            <div className="space-y-7">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {t("helpSupport") || "Help & Farmer Support"}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  {language === "mr"
                    ? "त्वरित उत्तरे मिळवा, शेती मार्गदर्शक पहा किंवा आमच्या कृषी तज्ज्ञ मदत केंद्राशी संपर्क साधा."
                    : language === "hi"
                    ? "त्वरित उत्तर प्राप्त करें, कृषि मार्गदर्शिका देखें या हमारे कृषि विशेषज्ञ सहायता केंद्र से संपर्क करें।"
                    : "Get instant answers, view farming guides, or reach our agricultural AI support desk."}
                </p>
              </div>

              {/* HELPLINE CARDS */}
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div className="flex items-center gap-3.5 rounded-2xl border border-green-200 bg-[#F0F8ED] p-4.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2E7D32] text-white shadow-sm">
                    <PhoneCall size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-700">
                      {language === "mr" ? "किसान टोल-फ्री हेल्पलाइन" : language === "hi" ? "किसान टोल-फ्री हेल्पलाइन" : "Kisan Toll-Free Helpline"}
                    </h4>
                    <p className="text-sm font-extrabold text-[#1B5E20]">1800-180-1551</p>
                    <p className="text-[10px] text-gray-500">
                      {language === "mr" ? "२४x७ सर्व भाषांमध्ये उपलब्ध" : language === "hi" ? "24x7 सभी भाषाओं में उपलब्ध" : "Available 24x7 in All Languages"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 rounded-2xl border border-[#DCE8D9] dark:border-gray-800 bg-white dark:bg-[#152319] p-4.5 shadow-sm">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#10B981] text-white shadow-sm">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200">
                      {language === "mr" ? "कृषी तज्ज्ञ ईमेल सपोर्ट" : language === "hi" ? "कृषि विशेषज्ञ ईमेल सहायता" : "Agronomist Email Support"}
                    </h4>
                    <a
                      href="mailto:krushimitra.project1@gmail.com"
                      className="text-xs font-bold text-[#1B5E20] dark:text-[#4ADE80] hover:underline"
                    >
                      krushimitra.project1@gmail.com
                    </a>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      {language === "mr" ? "प्रतिसाद वेळ: २ तासांच्या आत" : language === "hi" ? "प्रतिक्रिया समय: 2 घंटे के भीतर" : "Average response time: < 2 hours"}
                    </p>
                  </div>
                </div>
              </div>

              {/* FREQUENTLY ASKED QUESTIONS */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5">
                  <BookOpen size={16} className="text-[#2E7D32]" />
                  <span>{t("faqHeading") || "Frequently Asked Questions (FAQ)"}</span>
                </h3>

                <div className="space-y-2.5">
                  {faqs.map((faq, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div
                        key={index}
                        className="rounded-2xl border border-[#E2EAE0] overflow-hidden transition"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : index)}
                          className="flex w-full items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-gray-800 hover:bg-[#FAFDF9] cursor-pointer"
                        >
                          <span>{faq.q}</span>
                          {isOpen ? (
                            <ChevronUp size={16} className="text-[#2E7D32] shrink-0" />
                          ) : (
                            <ChevronDown size={16} className="text-gray-400 shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="border-t border-[#E2EAE0] bg-[#FAFDF9] p-4 text-xs text-gray-600 leading-relaxed">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CONTACT TICKET FORM */}
              <div className="rounded-2xl border border-[#DCE8D9] bg-[#FAFDF9] p-5">
                <h3 className="text-sm font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                  <LifeBuoy size={16} className="text-[#2E7D32]" />
                  <span>{language === "mr" ? "मदत किंवा शेती विषयक प्रश्न विचारा" : language === "hi" ? "सहायता या कृषि संबंधी प्रश्न पूछें" : "Submit Support or Agronomy Query"}</span>
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  {language === "mr"
                    ? "आपल्या शेतीविषयक डेटा किंवा माती चाचणीबद्दल मदत हवी असल्यास आमच्या टीमला संदेश पाठवा."
                    : language === "hi"
                    ? "अपने कृषि डेटा या मृदा परीक्षण के संबंध में सहायता के लिए हमारी टीम को संदेश भेजें।"
                    : "Need help with your farm data or soil advisories? Send a note to our support team."}
                </p>

                {ticketSuccess && (
                  <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-xs font-bold text-[#1B5E20]">
                    {ticketSuccess}
                  </div>
                )}

                <form onSubmit={handleSupportSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        {language === "mr" ? "विषय श्रेणी" : language === "hi" ? "श्रेणी" : "Category"}
                      </label>
                      <select
                        value={ticketForm.category}
                        onChange={(e) =>
                          setTicketForm({ ...ticketForm, category: e.target.value })
                        }
                        className="w-full rounded-xl border border-[#DCE8D9] bg-white px-3 py-2 text-xs outline-none focus:border-[#2E7D32]"
                      >
                        <option value="Crop Prediction">{language === "mr" ? "पीक उत्पादन अंदाज" : language === "hi" ? "फसल उपज पूर्वानुमान" : "Crop Yield Prediction"}</option>
                        <option value="Recommendation">{language === "mr" ? "पीक शिफारस व माती सल्ला" : language === "hi" ? "फसल सिफारिश एवं मृदा सलाह" : "Crop Recommendation"}</option>
                        <option value="Weather Service">{language === "mr" ? "हवामान सेवा" : language === "hi" ? "मौसम सेवा" : "Weather & Climate Service"}</option>
                        <option value="PDF Reports">{language === "mr" ? "PDF अहवाल डाउनलोड" : language === "hi" ? "पीडीएफ रिपोर्ट डाउनलोड" : "PDF Report Downloads"}</option>
                        <option value="Other">{language === "mr" ? "इतर सामान्य शेती प्रश्न" : language === "hi" ? "अन्य सामान्य कृषि प्रश्न" : "General Agronomy Query"}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        {language === "mr" ? "मुख्य विषय" : language === "hi" ? "विषय" : "Subject"}
                      </label>
                      <input
                        type="text"
                        required
                        value={ticketForm.subject}
                        onChange={(e) =>
                          setTicketForm({ ...ticketForm, subject: e.target.value })
                        }
                        placeholder={language === "mr" ? "उदा. सोयाबीन उत्पादन अंदाज प्रश्न" : language === "hi" ? "उदा. सोयाबीन उपज संबंधी प्रश्न" : "e.g. Yield prediction question for Soybean"}
                        className="w-full rounded-xl border border-[#DCE8D9] bg-white px-3 py-2 text-xs outline-none focus:border-[#2E7D32]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      {language === "mr" ? "तपशीलवार संदेश" : language === "hi" ? "विस्तृत संदेश" : "Message Details"}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={ticketForm.message}
                      onChange={(e) =>
                        setTicketForm({ ...ticketForm, message: e.target.value })
                      }
                      placeholder={language === "mr" ? "आपला प्रश्न किंवा अभिप्राय सविस्तरपणे लिहा..." : language === "hi" ? "अपना प्रश्न या प्रतिक्रिया विस्तार से लिखें..." : "Describe your query or feedback in detail..."}
                      className="w-full rounded-xl border border-[#DCE8D9] bg-white p-3 text-xs outline-none focus:border-[#2E7D32]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-shimmer flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95 cursor-pointer"
                  >
                    <Send size={14} />
                    <span>{language === "mr" ? "संदेश पाठवा" : language === "hi" ? "संदेश भेजें" : "Send Message"}</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* =========================================================
              4. ABOUT US — KRUSHIMITRA
             ========================================================= */}
          {section === "about" && (
            <div className="space-y-7">
              {/* TITLE & INTRO */}
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>🌱</span>
                  <span>{t("aboutUsTitle") || "About Us — KrushiMitra"}</span>
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {language === "mr"
                    ? "स्मार्ट तंत्रज्ञान आणि अचूक माहितीच्या आधारे शेतीला सक्षम बनवणे."
                    : language === "hi"
                    ? "सटीक तकनीक और डेटा-संचालित निर्णयों के माध्यम से कृषि को सशक्त बनाना।"
                    : "Empowering agriculture through intelligent technology and data-driven decisions."}
                </p>
              </div>

              {/* ABOUT US HERO CARD */}
              <div className="rounded-3xl border border-[#DCE8D9] dark:border-[#24402A] bg-gradient-to-br from-[#EAF5E8] via-[#F4F9F2] to-[#DFF3E4] dark:from-[#152319] dark:via-[#1B2F21] dark:to-[#122316] p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2E7D32] to-[#10B981] text-white shadow-md">
                    <Sprout size={24} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#1B5E20] dark:text-[#4ADE80]">
                      {language === "mr" ? "कृषीमित्र स्मार्ट शेती प्लॅटफॉर्म" : language === "hi" ? "कृषि-मित्र स्मार्ट कृषि प्लेटफॉर्म" : "KrushiMitra Smart Agriculture Platform"}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                      {language === "mr" ? "आधुनिक तंत्रज्ञान व अचूक शेतीचा संगम" : language === "hi" ? "आधुनिक तकनीक और सटीक कृषि का संगम" : "Bridging Modern Technology & Precision Agriculture"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  <p>
                    {t("aboutUsDesc1")}
                  </p>
                  <p>
                    {t("aboutUsDesc2")}
                  </p>
                </div>
              </div>

              {/* 🎯 WHAT WE PROVIDE (4 SMALL CARDS) */}
              <div>
                <h3 className="text-base font-extrabold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Target size={19} className="text-[#2E7D32] dark:text-[#4ADE80]" />
                  <span>{language === "mr" ? "🎯 आम्ही काय सेवा देतो" : language === "hi" ? "🎯 हम क्या प्रदान करते हैं" : "🎯 What We Provide"}</span>
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* CARD 1: CROP RECOMMENDATION */}
                  <div className="rounded-2xl border border-[#DCE8D9] dark:border-gray-800 bg-white dark:bg-[#152319] p-5 shadow-xs transition hover:shadow-md">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E5F7EA] dark:bg-[#1E3825] text-[#2E7D32] dark:text-[#4ADE80] font-bold text-base">
                        🌾
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                        {t("recommendation") || "Crop Recommendation"}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {language === "mr"
                        ? "माती आणि हवामानाच्या स्थितीवर आधारित योग्य पिकांची शिफारस करणे."
                        : language === "hi"
                        ? "मिट्टी और मौसम की स्थिति के आधार पर उपयुक्त फसलों का सुझाव देना।"
                        : "Suggest suitable crops based on soil and environmental conditions."}
                    </p>
                  </div>

                  {/* CARD 2: YIELD PREDICTION */}
                  <div className="rounded-2xl border border-[#DCE8D9] dark:border-gray-800 bg-white dark:bg-[#152319] p-5 shadow-xs transition hover:shadow-md">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E5F7EA] dark:bg-[#1E3825] text-[#2E7D32] dark:text-[#4ADE80] font-bold text-base">
                        📊
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                        {t("prediction") || "Yield Prediction"}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {language === "mr"
                        ? "जिल्हा, पाऊस आणि शेती क्षेत्रावरून पीक उत्पादकतेचा अंदाज काढणे."
                        : language === "hi"
                        ? "जिला, वर्षा और बुवाई क्षेत्र से फसल उत्पादकता का सटीक अनुमान लगाना।"
                        : "Estimate crop productivity from relevant agricultural factors."}
                    </p>
                  </div>

                  {/* CARD 3: WEATHER INSIGHTS */}
                  <div className="rounded-2xl border border-[#DCE8D9] dark:border-gray-800 bg-white dark:bg-[#152319] p-5 shadow-xs transition hover:shadow-md">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E5F7EA] dark:bg-[#1E3825] text-[#2E7D32] dark:text-[#4ADE80] font-bold text-base">
                        🌦️
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                        {t("weather") || "Weather Insights"}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {language === "mr"
                        ? "शेतीविषयक कामांच्या नियोजनासाठी थेट हवामान माहिती आणि सल्ला देणे."
                        : language === "hi"
                        ? "कृषि कार्यों की योजना के लिए वास्तविक समय मौसम की जानकारी और सलाह प्रदान करना।"
                        : "Provide weather-related information that can support agricultural decision-making."}
                    </p>
                  </div>

                  {/* CARD 4: DATA-DRIVEN AGRICULTURE */}
                  <div className="rounded-2xl border border-[#DCE8D9] dark:border-gray-800 bg-white dark:bg-[#152319] p-5 shadow-xs transition hover:shadow-md">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E5F7EA] dark:bg-[#1E3825] text-[#2E7D32] dark:text-[#4ADE80] font-bold text-base">
                        🌱
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                        {language === "mr" ? "माहिती-आधारित शेती" : language === "hi" ? "डेटा-संचालित कृषि" : "Data-Driven Agriculture"}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {language === "mr"
                        ? "ऐतिहासिक शेती माहिती आणि विश्लेषण मॉडेलचा वापर करून अर्थपूर्ण मार्गदर्शन तयार करणे."
                        : language === "hi"
                        ? "ऐतिहासिक कृषि डेटा और विश्लेषण मॉडल का उपयोग करके सार्थक मार्गदर्शन तैयार करना।"
                        : "Use historical agricultural data and models to generate meaningful insights."}
                    </p>
                  </div>
                </div>
              </div>

              {/* 🌱 OUR VISION */}
              <div className="rounded-3xl border border-[#DCE8D9] dark:border-[#24402A] bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] p-6 sm:p-7 text-white text-center shadow-md">
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/10 mb-2">
                  <Sparkles size={20} className="text-yellow-300" />
                </div>
                <h3 className="text-xs uppercase tracking-widest font-extrabold text-green-200 mb-1">
                  🌱 {language === "mr" ? "आमचे ध्येय" : language === "hi" ? "हमारा दृष्टिकोण" : "Our Vision"}
                </h3>
                <blockquote className="text-base sm:text-lg font-extrabold italic text-white max-w-xl mx-auto leading-relaxed">
                  {language === "mr"
                    ? "“स्मार्ट तंत्रज्ञान आणि अचूक माहितीच्या आधारे शेतीला समृद्ध बनवणे.”"
                    : language === "hi"
                    ? "“स्मार्ट तकनीक और सटीक निर्णयों के माध्यम से कृषि को समृद्ध बनाना।”"
                    : "“Empowering agriculture through intelligent technology and data-driven decisions.”"}
                </blockquote>
              </div>
            </div>
          )}

          {/* =========================================================
              5. PRIVACY & DATA SECURITY
             ========================================================= */}
          {section === "privacy" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Shield size={20} className="text-[#2E7D32] dark:text-[#4ADE80]" />
                  <span>{t("privacy") || "Privacy & Data Security"}</span>
                </h2>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {language === "mr"
                    ? "सर्वसमावेशक गोपनीयता संरक्षण, सुरक्षा मानके आणि शेतकरी डेटाचे रक्षण."
                    : language === "hi"
                    ? "व्यापक गोपनीयता सुरक्षा, एन्क्रिप्शन मानक और किसान डेटा का पूर्ण संरक्षण।"
                    : "Comprehensive privacy safeguards, encryption standards, and grower data governance."}
                </p>
              </div>

              <div className="space-y-4 pt-1">
                {/* CARD 1: CONFIDENTIALITY */}
                <div className="rounded-2xl bg-[#F6F8F4] dark:bg-[#152319] p-5 border border-[#E2EAE0] dark:border-gray-800">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck size={16} className="text-[#2E7D32] dark:text-[#4ADE80]" />
                    <span>{language === "mr" ? "शेतकरी डेटा गोपनीयता" : language === "hi" ? "किसान डेटा गोपनीयता" : "Farmer Data Confidentiality"}</span>
                  </h4>
                  <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {language === "mr"
                      ? "आपला शेतीविषयक डेटा, जमिनीचे क्षेत्रफळ, माती परीक्षण अहवाल आणि पीक अंदाज पूर्णपणे गोपनीय आहेत. कृषीमित्र कोणत्याही बाहेरील व्यावसायिक संस्थांना शेतकरी डेटा विकत किंवा भाड्याने देत नाही."
                      : language === "hi"
                      ? "आपका संपूर्ण कृषि डेटा, भूमि क्षेत्र, मृदा परीक्षण रिपोर्ट और फसल पूर्वानुमान पूरी तरह गोपनीय हैं। कृषि-मित्र किसी भी तीसरे पक्ष को किसान डेटा नहीं बेचता।"
                      : "All agricultural data, farm acreage records, soil test chemistry, and expected yield forecasts are strictly confidential. KrushiMitra does not sell, lease, or monetize individual farmer data or telemetry to commercial third parties."}
                  </p>
                </div>

                {/* CARD 2: ENCRYPTION */}
                <div className="rounded-2xl bg-[#F6F8F4] dark:bg-[#152319] p-5 border border-[#E2EAE0] dark:border-gray-800">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Lock size={16} className="text-[#2E7D32] dark:text-[#4ADE80]" />
                    <span>{language === "mr" ? "सुरक्षित एन्क्रिप्शन आणि डेटा संरक्षण" : language === "hi" ? "एंड-टू-एंड एन्क्रिप्शन एवं क्लाउड सुरक्षा" : "End-to-End Encryption & Cloud Security"}</span>
                  </h4>
                  <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {language === "mr"
                      ? "आपला ब्राउझर आणि कृषीमित्र सर्व्हर दरम्यानचे संप्रेषण आधुनिक TLS एन्क्रिप्शनने सुरक्षित आहे. संकेतशब्द सुरक्षित क्रिप्टोग्राफिक अल्गोरिदमने हॅश केले जातात."
                      : language === "hi"
                      ? "आपके ब्राउज़र और कृषि-मित्र सर्वर के बीच संचार आधुनिक टीएलएस एन्क्रिप्शन द्वारा सुरक्षित है। पासवर्ड क्रिप्टोग्राफिक रूप से सुरक्षित हैं।"
                      : "Communication between your browser and KrushiMitra servers is secured using modern TLS encryption. Passwords and credentials are cryptographically hashed using standard salted cryptographic algorithms."}
                  </p>
                </div>

                {/* CARD 3: GROWER DATA OWNERSHIP */}
                <div className="rounded-2xl bg-[#F6F8F4] dark:bg-[#152319] p-5 border border-[#E2EAE0] dark:border-gray-800">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#2E7D32] dark:text-[#4ADE80]" />
                    <span>{language === "mr" ? "शेतकरी हक्क आणि डेटा पोर्टेबिलिटी" : language === "hi" ? "किसान अधिकार और डेटा पोर्टेबिलिटी" : "Grower Rights & Data Portability"}</span>
                  </h4>
                  <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {language === "mr"
                      ? "आपल्या शेती नोंदींवर आपला पूर्ण मालकी हक्क आहे. आपण कोणत्याही वेळी मागील माती सल्ला आणि उत्पादन इतिहासाचे संपूर्ण PDF अहवाल डाउनलोड करू शकता."
                      : language === "hi"
                      ? "अपने कृषि अभिलेखों पर आपका पूर्ण अधिकार है। आप कभी भी अपनी पिछली मृदा सलाह और उपज इतिहास की पूरी पीडीएफ रिपोर्ट डाउनलोड कर सकते हैं।"
                      : "You maintain complete ownership of your farm archives. You may download full PDF reports of your past soil advisories and yield history at any time or request complete record deletion."}
                  </p>
                </div>

                {/* DANGER ZONE: CLEAR FARM DATA */}
                <div className="rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 p-5 mt-6">
                  <h4 className="text-xs font-bold text-red-700 dark:text-red-400 flex items-center gap-1.5">
                    <Trash2 size={15} /> {language === "mr" ? "जतन केलेला शेती इतिहास साफ करा" : language === "hi" ? "सहेजा गया कृषि इतिहास हटाएं" : "Clear Saved Farm History"}
                  </h4>
                  <p className="mt-1 text-xs text-red-600/80 dark:text-red-300/80 leading-relaxed">
                    {language === "mr"
                      ? "आपल्या सक्रिय सत्रातील सर्व जतन केलेले पीक उत्पादन अंदाज आणि माती शिफारसी कायमस्वरूपी रीसेट करा."
                      : language === "hi"
                      ? "अपने सक्रिय सत्र के सभी सहेजे गए फसल पूर्वानुमान और मृदा सिफारिशों को स्थायी रूप से रीसेट करें।"
                      : "Permanently reset all saved crop prediction calculations and soil nutrient recommendations for your active session."}
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowResetModal(true)}
                    className="mt-4 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition cursor-pointer"
                  >
                    {language === "mr" ? "सर्व नोंदी साफ करा" : language === "hi" ? "सभी रिकॉर्ड हटाएं" : "Clear All Saved Records"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CONFIRMATION MODAL FOR RESETTING DATA */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-red-100 bg-white p-6 shadow-2xl animate-page-enter">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <Trash2 size={24} />
            </div>

            <h3 className="mt-4 text-center text-base font-bold text-gray-800">
              {language === "mr" ? "सर्व शेती नोंदी साफ करायच्या का?" : language === "hi" ? "क्या सभी कृषि रिकॉर्ड मिटाएं?" : "Clear All Farm Records?"}
            </h3>
            <p className="mt-1 text-center text-xs text-gray-500">
              {language === "mr"
                ? "ही कृती पूर्ववत केली जाऊ शकत नाही. सर्व जतन केलेले अंदाज आणि शिफारस नोंदी कायमच्या मिटवल्या जातील."
                : language === "hi"
                ? "यह क्रिया पूर्ववत नहीं की जा सकती। सभी सहेजे गए पूर्वानुमान और सिफारिश रिकॉर्ड हमेशा के लिए मिटा दिए जाएंगे।"
                : "This action cannot be undone. All saved predictions and recommendation histories will be erased."}
            </p>

            <div className="mt-6 flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="w-1/2 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                {t("cancel") || "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleResetData}
                className="w-1/2 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 cursor-pointer"
              >
                {language === "mr" ? "होय, सर्व साफ करा" : language === "hi" ? "हाँ, सभी हटाएं" : "Yes, Clear All"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}