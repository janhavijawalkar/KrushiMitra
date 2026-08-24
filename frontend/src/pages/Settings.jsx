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
  Cpu,
  Database,
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
    showFeedback(`Theme updated to ${newTheme.toUpperCase()}`);
  };

  const handleFontSizeChange = (newSize) => {
    changeFontSize(newSize);
    showFeedback(`Font size updated to ${newSize.toUpperCase()}`);
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) {
      return;
    }

    const created = submitSupportTicket(ticketForm);
    setTicketSuccess(`Support request submitted! Ticket ID: ${created.id}`);
    setTicketForm({ subject: "", category: "Crop Prediction", message: "" });
    setTimeout(() => setTicketSuccess(""), 5000);
  };

  const handleResetData = () => {
    resetFarmData();
    setShowResetModal(false);
    showFeedback("All local predictions and recommendations have been cleared.");
  };

  const sections = [
    { id: "appearance", icon: Palette, label: t("appearance") || "Appearance & Theme" },
    { id: "language", icon: Globe, label: t("language") || "Language & Regional" },
    { id: "help", icon: HelpCircle, label: t("helpSupport") || "Help & Support" },
    { id: "about", icon: Info, label: t("about") || "About KrushiMitra" },
    { id: "privacy", icon: Shield, label: t("privacy") || "Privacy & Storage" },
  ];

  const faqs = [
    {
      q: "How does the Crop Recommendation model work?",
      a: "The Crop Recommendation engine utilizes a Random Forest classifier trained on thousands of agricultural soil records. It evaluates Soil Nitrogen (N), Phosphorus (P), Potassium (K), Soil pH, Ambient Temperature, Humidity, and Rainfall to determine the optimal crop with an accuracy exceeding 95%.",
    },
    {
      q: "How does the Crop Productivity / Yield predictor work?",
      a: "Yield predictions are calculated using a Random Forest regressor with historical district-level datasets in Maharashtra. It takes district name, crop type, year, season, cultivated area, rainfall, and max temperature to output expected yield in tonnes per hectare.",
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
        <div className="rounded-3xl border border-[#DCE8D9] bg-white p-6 sm:p-8 shadow-sm">
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
                  <span>Color Theme</span>
                </h3>

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                  {[
                    { id: "light", icon: Sun, label: t("lightMode") || "Light Forest", desc: "Crisp emerald daytime palette" },
                    { id: "dark", icon: Moon, label: t("darkMode") || "Dark Midnight", desc: "High contrast dark emerald theme" },
                    { id: "auto", icon: Laptop, label: t("systemDefault") || "System Sync", desc: "Matches device operating system" },
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
                            <Check size={13} /> Active
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
                  <span>Font Scaling</span>
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "small", label: "Compact (Small)", sample: "14px" },
                    { id: "medium", label: "Standard (Default)", sample: "15px" },
                    { id: "large", label: "Accessible (Large)", sample: "16.5px" },
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
                  Live Visual Preview
                </span>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2E7D32] text-white">
                    🌾
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1B5E20]">
                      KrushiMitra Precision Advisory
                    </h4>
                    <p className="text-xs text-gray-600">
                      The chosen theme and font size are applied in real-time across all prediction and reporting dashboards.
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
                  Select your primary language for farmer advisories, form labels, and notifications.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { id: "en", native: "English", english: "English (Global)", badge: "EN", flag: "🌐" },
                  { id: "hi", native: "हिन्दी", english: "Hindi (Rashtrabhasha)", badge: "HI", flag: "🇮🇳" },
                  { id: "mr", native: "मराठी", english: "Marathi (Maharashtra Regional)", badge: "MR", flag: "🚩" },
                ].map((item) => {
                  const isSelected = language === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        changeLanguage(item.id);
                        showFeedback(`Language switched to ${item.native}`);
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
                  Get instant answers, view farming guides, or reach our agricultural AI support desk.
                </p>
              </div>

              {/* HELPLINE CARDS */}
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div className="flex items-center gap-3.5 rounded-2xl border border-green-200 bg-[#F0F8ED] p-4.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2E7D32] text-white shadow-sm">
                    <PhoneCall size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-700">Kisan Toll-Free Helpline</h4>
                    <p className="text-sm font-extrabold text-[#1B5E20]">1800-180-1551</p>
                    <p className="text-[10px] text-gray-500">Available 24x7 in All Languages</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 rounded-2xl border border-[#DCE8D9] bg-white p-4.5 shadow-sm">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#10B981] text-white shadow-sm">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-700">Agronomist Email Support</h4>
                    <p className="text-xs font-bold text-[#1B5E20]">support@krushimitra.gov.in</p>
                    <p className="text-[10px] text-gray-500">Average response time: &lt; 2 hours</p>
                  </div>
                </div>
              </div>

              {/* FREQUENTLY ASKED QUESTIONS */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5">
                  <BookOpen size={16} className="text-[#2E7D32]" />
                  <span>Frequently Asked Questions (FAQ)</span>
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
                  <span>Submit Support or Agronomy Query</span>
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Need help with prediction accuracy or farm data? Send a note to our tech team.
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
                        Category
                      </label>
                      <select
                        value={ticketForm.category}
                        onChange={(e) =>
                          setTicketForm({ ...ticketForm, category: e.target.value })
                        }
                        className="w-full rounded-xl border border-[#DCE8D9] bg-white px-3 py-2 text-xs outline-none focus:border-[#2E7D32]"
                      >
                        <option value="Crop Prediction">Crop Yield Prediction</option>
                        <option value="Recommendation">Crop Recommendation</option>
                        <option value="Weather Service">Weather & Climate Service</option>
                        <option value="PDF Reports">PDF Report Downloads</option>
                        <option value="Other">General Agronomy Query</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        required
                        value={ticketForm.subject}
                        onChange={(e) =>
                          setTicketForm({ ...ticketForm, subject: e.target.value })
                        }
                        placeholder="e.g. Yield prediction question for Soybean"
                        className="w-full rounded-xl border border-[#DCE8D9] bg-white px-3 py-2 text-xs outline-none focus:border-[#2E7D32]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Message Details
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={ticketForm.message}
                      onChange={(e) =>
                        setTicketForm({ ...ticketForm, message: e.target.value })
                      }
                      placeholder="Describe your query or feedback in detail..."
                      className="w-full rounded-xl border border-[#DCE8D9] bg-white p-3 text-xs outline-none focus:border-[#2E7D32]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-shimmer flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95 cursor-pointer"
                  >
                    <Send size={14} />
                    <span>Send Message</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* =========================================================
              4. ABOUT KRUSHIMITRA
             ========================================================= */}
          {section === "about" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {t("aboutKrushiMitra") || "About KrushiMitra"}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  {t("aiAgriculturePlatform") || "Smart Precision Agriculture & Machine Learning Decision Support System"}
                </p>
              </div>

              {/* HERO CARD */}
              <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-[#EAF5E8] via-[#F4F9F2] to-[#DFF3E4] p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2E7D32] to-[#10B981] text-white shadow-md">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#1B5E20]">
                      KrushiMitra • 2026 Edition
                    </h3>
                    <p className="text-xs text-gray-600 font-medium">
                      Version 2.4.0 (Production Release)
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed">
                  KrushiMitra is an intelligent pair-farming platform designed to empower Indian farmers, agronomists, and agricultural researchers with precision AI insights. It bridges the gap between field soil chemistry, atmospheric forecasts, and machine learning models to maximize crop yields while preserving long-term soil fertility.
                </p>
              </div>

              {/* ARCHITECTURE & DATA SOURCES GRID */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#DCE8D9] bg-white p-4.5 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu size={18} className="text-[#2E7D32]" />
                    <h4 className="text-xs font-bold text-gray-800">Trained ML Models</h4>
                  </div>
                  <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                    <li><strong>Crop Recommendation:</strong> Random Forest Classifier with 95%+ precision.</li>
                    <li><strong>Crop Productivity:</strong> Random Forest Regressor trained on regional agro-data.</li>
                    <li><strong>Backend Runtime:</strong> Flask Python Server (RESTful API).</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-[#DCE8D9] bg-white p-4.5 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Database size={18} className="text-[#2E7D32]" />
                    <h4 className="text-xs font-bold text-gray-800">Data Sources</h4>
                  </div>
                  <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                    <li>Indian Council of Agricultural Research (ICAR)</li>
                    <li>Ministry of Agriculture & Farmers Welfare datasets</li>
                    <li>OpenWeatherMap Real-Time API</li>
                  </ul>
                </div>
              </div>

              {/* SPECIFICATION PILLS */}
              <div className="rounded-2xl bg-[#F6F8F4] p-4 text-xs text-gray-600 space-y-2 border border-[#E2EAE0]">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Frontend Technology:</span>
                  <span>React 19 + Vite + Tailwind CSS</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">PDF Generator Engine:</span>
                  <span>jsPDF & AutoTable Vector Generator</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">License:</span>
                  <span>Open Agriculture MIT License</span>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              5. PRIVACY & DATA STORAGE
             ========================================================= */}
          {section === "privacy" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {t("privacy") || "Privacy & Data Storage"}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Manage how your farm prediction logs and soil records are handled.
                </p>
              </div>

              <div className="space-y-4 pt-1">
                <div className="rounded-2xl bg-[#F6F8F4] p-5 border border-[#E2EAE0]">
                  <h4 className="text-xs font-bold text-gray-800">Local Browser Storage</h4>
                  <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                    Your prediction and soil recommendation logs are securely stored in your browser’s local storage (`localStorage`). No farm data is sent to external third-party advertisers.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F6F8F4] p-5 border border-[#E2EAE0]">
                  <h4 className="text-xs font-bold text-gray-800">Model Inference Privacy</h4>
                  <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                    API calls sent to your local backend machine (`http://127.0.0.1:5000`) are processed locally in memory for immediate computation.
                  </p>
                </div>

                {/* DANGER ZONE: CLEAR FARM DATA */}
                <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5 mt-6">
                  <h4 className="text-xs font-bold text-red-700 flex items-center gap-1.5">
                    <Trash2 size={15} /> Clear Saved Farm History
                  </h4>
                  <p className="mt-1 text-xs text-red-600/80">
                    This will permanently clear all saved crop predictions and soil recommendation records from your local storage.
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowResetModal(true)}
                    className="mt-4 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition cursor-pointer"
                  >
                    Clear All Saved Records
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
              Clear All Farm Records?
            </h3>
            <p className="mt-1 text-center text-xs text-gray-500">
              This action cannot be undone. All saved predictions and recommendation histories will be erased.
            </p>

            <div className="mt-6 flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="w-1/2 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetData}
                className="w-1/2 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 cursor-pointer"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}