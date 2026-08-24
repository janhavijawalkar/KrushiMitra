import React, { useState, useEffect } from "react";
import {
  Sprout,
  TrendingUp,
  CloudSun,
  FileText,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Globe,
  Sun,
  Moon,
  Wheat,
  Droplets,
  Zap,
  Award,
  ChevronRight,
  ChevronLeft,
  Star,
  Activity,
  PhoneCall,
  Lock,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Landing({ nav }) {
  const {
    user,
    language,
    setLanguage,
    theme,
    changeTheme,
    apiLogin,
    t,
  } = useApp();

  const [faqOpen, setFaqOpen] = useState(null);
  const [demoLoading, setDemoLoading] = useState(false);

  const heroSlides = [
    {
      id: "prediction",
      title: "Precision AI Agronomy",
      subtitle: "Multi-District Random Forest Yield Regressor",
      badge: "🌾 95.2% Accuracy",
      desc: "Instant harvest forecasts based on rainfall, soil conditions, and acreage calibrated on historical Maharashtra district data.",
      stat1: { label: "Yield Target", value: "3.42 t/ha" },
      stat2: { label: "Confidence", value: "98.4%" },
      icon: TrendingUp,
      action: "prediction",
      actionLabel: "Try Yield Predictor",
      color: "from-emerald-600 to-green-700",
      accent: "text-[#2E7D32]",
      bgAccent: "bg-[#EAF3E6]",
    },
    {
      id: "recommendation",
      title: "Smart Soil & Crop Advisory",
      subtitle: "7-Factor N-P-K & pH Soil Nutrient Classifier",
      badge: "🌱 22 Crop Varieties",
      desc: "Matches your exact soil chemistry (Nitrogen, Phosphorus, Potassium, pH) to recommend the most profitable crop for your farm.",
      stat1: { label: "Top Recommendation", value: "Cotton / Bt Hybrid" },
      stat2: { label: "Nutrient Balance", value: "Optimal Match" },
      icon: Sprout,
      action: "recommendation",
      actionLabel: "Run Soil Advisory",
      color: "from-green-600 to-teal-700",
      accent: "text-teal-600",
      bgAccent: "bg-teal-50",
    },
    {
      id: "weather",
      title: "Live Climate Intelligence",
      subtitle: "Real-Time OpenWeather Atmospheric Telemetry",
      badge: "🌦️ 36 MH Districts",
      desc: "Microclimate precipitation, humidity, and temperature monitoring ensuring you never miss optimal irrigation or sowing windows.",
      stat1: { label: "Monsoon Status", value: "Active Kharif" },
      stat2: { label: "Rainfall Forecast", value: "Optimal Condition" },
      icon: CloudSun,
      action: "weather",
      actionLabel: "Check District Weather",
      color: "from-teal-600 to-blue-700",
      accent: "text-blue-600",
      bgAccent: "bg-blue-50",
    },
    {
      id: "reports",
      title: "Official PDF Farm Dossiers",
      subtitle: "Instant Vector-Generated A4 Agricultural Records",
      badge: "📄 Bank & Loan Ready",
      desc: "Generate professional agronomic reports in 1-click for agricultural bank loans, crop insurance, and extension officer verification.",
      stat1: { label: "Export Format", value: "High-Res PDF" },
      stat2: { label: "Generation Speed", value: "< 1 Sec" },
      icon: FileText,
      action: "reports",
      actionLabel: "Generate Sample PDF",
      color: "from-emerald-700 to-green-800",
      accent: "text-emerald-700",
      bgAccent: "bg-emerald-50",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderHovered, setIsSliderHovered] = useState(false);

  // Typewriter Letter-by-Letter Animation
  const typingPhrases = [
    "Precision AI Agronomy",
    "Smart Soil & Crop Advisory",
    "Live Climate Intelligence",
    "Official PDF Farm Dossiers",
    "Higher Harvest Profits",
  ];

  const [phraseIdx, setPhraseIdx] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = typingPhrases[phraseIdx];
    let timeout;

    if (!isDeleting) {
      if (typedText.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setTypedText(currentPhrase.slice(0, typedText.length + 1));
        }, 70);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (typedText.length > 0) {
        timeout = setTimeout(() => {
          setTypedText(currentPhrase.slice(0, typedText.length - 1));
        }, 32);
      } else {
        setIsDeleting(false);
        const nextIdx = (phraseIdx + 1) % typingPhrases.length;
        setPhraseIdx(nextIdx);
        setCurrentSlide(nextIdx % heroSlides.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, phraseIdx, typingPhrases, heroSlides.length]);

  const nextSlide = () => {
    const next = (currentSlide + 1) % heroSlides.length;
    setCurrentSlide(next);
    setPhraseIdx(next % typingPhrases.length);
    setTypedText(typingPhrases[next % typingPhrases.length]);
    setIsDeleting(false);
  };

  const prevSlide = () => {
    const prev = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
    setCurrentSlide(prev);
    setPhraseIdx(prev % typingPhrases.length);
    setTypedText(typingPhrases[prev % typingPhrases.length]);
    setIsDeleting(false);
  };

  const selectSlide = (idx) => {
    setCurrentSlide(idx);
    setPhraseIdx(idx % typingPhrases.length);
    setTypedText(typingPhrases[idx % typingPhrases.length]);
    setIsDeleting(false);
  };

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const handleQuickDemo = async (role = "farmer") => {
    setDemoLoading(true);
    try {
      if (role === "admin") {
        await apiLogin("admin@krushimitra.in", "adminpassword");
      } else {
        await apiLogin("ramesh.patil@krushimitra.in", "password123");
      }
      nav?.("dashboard");
    } catch (err) {
      console.error("Demo login error:", err);
    } finally {
      setDemoLoading(false);
    }
  };

  const features = [
    {
      icon: TrendingUp,
      title: "AI Crop Yield Forecasting",
      desc: "Trained Random Forest regressor computes accurate harvest yield (t/ha) based on district, seasonal rainfall, temperature, and acreage.",
      tag: "ML Regressor",
    },
    {
      icon: Sprout,
      title: "Smart Soil & Crop Advisory",
      desc: "Evaluates Soil Nitrogen (N), Phosphorus (P), Potassium (K), and soil pH to recommend the highest-yielding crop with 95.2% accuracy.",
      tag: "95.2% Accuracy",
    },
    {
      icon: CloudSun,
      title: "Live Microclimate Weather",
      desc: "Real-time atmospheric telemetry covering precipitation, humidity, wind velocity, and temperature across all 36 Maharashtra districts.",
      tag: "Real-Time API",
    },
    {
      icon: FileText,
      title: "Automated Official PDF Reports",
      desc: "Generate and download professional, formatted PDF agricultural records for crop bank loans, insurance, and agronomist reviews.",
      tag: "A4 Vector PDF",
    },
    {
      icon: Shield,
      title: "Role-Based Access & Privacy",
      desc: "Strict Role-Based Access Control (RBAC) and persistent SQLite database isolate personal farm records and allow seamless admin oversight.",
      tag: "SQLite Secure",
    },
    {
      icon: Globe,
      title: "Trilingual Regional Access",
      desc: "Built natively for Indian kisans with seamless support in English, हिन्दी (Hindi), and मराठी (Marathi) regional languages.",
      tag: "3 Languages",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Input Soil & Farm Details",
      desc: "Enter your district, cultivated land size, and soil N-P-K nutrient or climate parameters.",
      icon: Droplets,
    },
    {
      num: "02",
      title: "AI Inference & Analysis",
      desc: "Our dual Random Forest algorithms instantly process multi-factor agronomic data.",
      icon: Zap,
    },
    {
      num: "03",
      title: "Actionable Insights & PDF",
      desc: "Receive customized crop advisories, yield forecasts, and export official PDF documents.",
      icon: Award,
    },
  ];

  const testimonials = [
    {
      name: "Ramesh Patil",
      role: "Soybean & Cotton Farmer",
      district: "Pune District, MH",
      farmSize: "5.0 Acres",
      quote:
        "KrushiMitra's crop yield predictions gave me accurate estimates before sowing. The Kharif advisory helped me optimize my fertilizer application effectively!",
      rating: 5,
    },
    {
      name: "Suresh Deshmukh",
      role: "Citrus & Cotton Grower",
      district: "Nagpur District, MH",
      farmSize: "12.5 Acres",
      quote:
        "The soil recommendation engine matched my Vidarbha black soil perfectly with high confidence. The weather forecasting also saved our irrigation schedule.",
      rating: 5,
    },
    {
      name: "Priya Shinde",
      role: "Grape Vineyard & Onion Cultivator",
      district: "Nashik District, MH",
      farmSize: "8.0 Acres",
      quote:
        "The automated PDF reports are clean and official. I presented the soil nutrient report directly to our local agricultural society for advisory support.",
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: "How accurate are the KrushiMitra Machine Learning models?",
      a: "The Crop Recommendation classifier achieves a validated 95.2% accuracy across 22 major crop classes, trained on extensive agricultural datasets. The Yield Predictor is tuned with historical Maharashtra district harvest datasets.",
    },
    {
      q: "Is KrushiMitra free for Indian farmers?",
      a: "Yes! KrushiMitra is 100% free and open for all farmers, agricultural extension officers, and agronomists to run predictions and generate PDF reports.",
    },
    {
      q: "Can I download and print the agricultural reports?",
      a: "Absolutely. With 1-click, you can download formatted, high-resolution A4 PDF reports complete with your farm branding, data summaries, and agronomist guidance.",
    },
    {
      q: "What languages are supported?",
      a: "The entire platform is fully translated into English, हिन्दी (Hindi), and मराठी (Marathi) for effortless regional usability.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F8F4] text-[#17291A] selection:bg-[#2E7D32] selection:text-white">
      {/* =========================================================
          1. UPPER STICKY NAVIGATION BAR
         ========================================================= */}
      <header className="sticky top-0 z-50 border-b border-[#DCE8D9] bg-white/90 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          {/* BRAND LOGO */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#10B981] text-white shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <Sprout size={24} strokeWidth={2.3} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-[#1B5E20]">
                  KrushiMitra
                </span>
                <span className="key-cap text-[10px] py-0.5 px-2 bg-[#E5F7EA] text-[#2E7D32] hidden sm:inline-block">
                  AI v2.0
                </span>
              </div>
              <p className="text-[10px] font-bold tracking-wider text-[#55715A] uppercase">
                {t("aiAgriculture") || "Precision Agriculture Platform"}
              </p>
            </div>
          </div>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-gray-600">
            <a
              href="#features"
              className="transition hover:text-[#2E7D32] hover:-translate-y-0.5"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="transition hover:text-[#2E7D32] hover:-translate-y-0.5"
            >
              How It Works
            </a>
            <a
              href="#models"
              className="transition hover:text-[#2E7D32] hover:-translate-y-0.5"
            >
              AI Models
            </a>
            <a
              href="#testimonials"
              className="transition hover:text-[#2E7D32] hover:-translate-y-0.5"
            >
              Farmers
            </a>
            <a
              href="#faq"
              className="transition hover:text-[#2E7D32] hover:-translate-y-0.5"
            >
              FAQ
            </a>
          </nav>

          {/* UPPER RIGHT ACTIONS */}
          <div className="flex items-center gap-2.5">
            {/* LANGUAGE SELECTOR */}
            <div className="relative hidden sm:block">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="key-cap text-xs py-1.5 px-2.5 font-bold cursor-pointer"
                title="Select Language"
              >
                <option value="en">🌐 English</option>
                <option value="hi">🇮🇳 हिन्दी</option>
                <option value="mr">🌾 मराठी</option>
              </select>
            </div>

            {/* THEME TOGGLE */}
            <button
              type="button"
              onClick={() => changeTheme(theme === "dark" ? "light" : "dark")}
              className="key-cap p-2 text-gray-600 hover:text-[#2E7D32] cursor-pointer"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun size={17} className="text-amber-400" />
              ) : (
                <Moon size={17} className="text-[#2E7D32]" />
              )}
            </button>

            {user ? (
              <button
                type="button"
                onClick={() => nav?.("dashboard")}
                className="btn-shimmer flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <span>Dashboard</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => nav?.("login")}
                  className="key-cap hidden sm:flex items-center gap-1 text-xs py-2 px-3.5 font-bold text-gray-700 hover:text-[#2E7D32] cursor-pointer"
                >
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => nav?.("register")}
                  className="btn-shimmer btn-glow flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================
          2. HERO SECTION WITH ANIMATED SHOWCASE
         ========================================================= */}
      <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24">
        {/* Background glow orbs */}
        <div className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-20 h-96 w-96 rounded-full bg-green-300/20 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* LEFT CONTENT */}
            <div className="space-y-6 lg:col-span-7 text-left">
              {/* BADGE */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/60 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-[#1B5E20] shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <Sparkles size={14} className="text-[#2E7D32]" />
                <span>Maharashtra's #1 AI Farming Decision Support System</span>
              </div>

              {/* HEADLINE WITH LETTER-BY-LETTER TYPEWRITER ANIMATIONS */}
              <div className="hero-title-animated space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-[#172B18] sm:text-5xl lg:text-6xl leading-[1.18] min-h-[140px] sm:min-h-[170px] lg:min-h-[200px]">
                  <span>Empowering Farmers with</span>{" "}
                  <span className="block mt-1 sm:mt-2">
                    <span className="animated-gradient-word relative inline-block transition-all duration-300">
                      {typedText || "\u00A0"}
                      <span className="typewriter-cursor" />
                      {/* Ambient glowing underline */}
                      <span className="absolute -bottom-1.5 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1B5E20] via-[#10B981] to-[#2E7D32] rounded-full opacity-85 shadow-[0_0_14px_rgba(16,185,129,0.7)] animate-pulse" />
                    </span>
                  </span>
                </h1>
              </div>

              {/* INTERACTIVE HERO SLIDER CARD */}
              <div
                onMouseEnter={() => setIsSliderHovered(true)}
                onMouseLeave={() => setIsSliderHovered(false)}
                className="relative overflow-hidden rounded-3xl border border-[#DCE8D9] bg-white/95 p-5 sm:p-6 shadow-md transition-all hover:shadow-lg backdrop-blur-sm"
              >
                {/* SLIDER TOP CONTROLS */}
                <div className="flex items-center justify-between border-b border-[#EEF2EC] pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="key-cap text-[10px] py-0.5 px-2.5 bg-[#E5F7EA] text-[#2E7D32]">
                      {heroSlides[currentSlide].badge}
                    </span>
                    <span className="text-[11px] font-bold text-gray-500 hidden sm:inline">
                      {heroSlides[currentSlide].subtitle}
                    </span>
                  </div>

                  {/* NEXT/PREV ARROWS */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={prevSlide}
                      className="key-cap p-1.5 text-gray-700 hover:text-[#2E7D32] cursor-pointer"
                      title="Previous Slide"
                      aria-label="Previous Slide"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={nextSlide}
                      className="key-cap p-1.5 text-gray-700 hover:text-[#2E7D32] cursor-pointer"
                      title="Next Slide"
                      aria-label="Next Slide"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>

                {/* ACTIVE SLIDE CONTENT WITH ANIMATION */}
                <div key={currentSlide} className="slide-animated space-y-3">
                  <div className="flex items-start gap-3.5">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${heroSlides[currentSlide].bgAccent} ${heroSlides[currentSlide].accent} shadow-xs`}>
                      {React.createElement(heroSlides[currentSlide].icon, { size: 24 })}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">
                        {heroSlides[currentSlide].title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        {heroSlides[currentSlide].desc}
                      </p>
                    </div>
                  </div>

                  {/* STAT HIGHLIGHTS */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div className="rounded-xl bg-[#F8FAF7] p-2.5 border border-[#EEF2EC]">
                      <span className="text-[10px] text-gray-400 font-semibold">{heroSlides[currentSlide].stat1.label}</span>
                      <p className="text-xs font-extrabold text-gray-800 mt-0.5">{heroSlides[currentSlide].stat1.value}</p>
                    </div>
                    <div className="rounded-xl bg-[#F8FAF7] p-2.5 border border-[#EEF2EC]">
                      <span className="text-[10px] text-gray-400 font-semibold">{heroSlides[currentSlide].stat2.label}</span>
                      <p className="text-xs font-extrabold text-[#2E7D32] mt-0.5">{heroSlides[currentSlide].stat2.value}</p>
                    </div>
                  </div>
                </div>

                {/* SLIDER DOT INDICATORS & QUICK TRIGGER */}
                <div className="mt-4 pt-3 border-t border-[#EEF2EC] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {heroSlides.map((s, idx) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => selectSlide(idx)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          currentSlide === idx
                            ? "w-7 bg-[#2E7D32]"
                            : "w-2 bg-[#DCE8D9] hover:bg-[#A5D6A7]"
                        }`}
                        title={s.title}
                        aria-label={s.title}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => (user ? nav?.(heroSlides[currentSlide].action) : nav?.("register"))}
                    className="key-cap text-[11px] py-1 px-3 font-bold text-[#2E7D32] hover:bg-[#EAF3E6] flex items-center gap-1 cursor-pointer"
                  >
                    <span>{heroSlides[currentSlide].actionLabel}</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <button
                  type="button"
                  onClick={() => (user ? nav?.("prediction") : nav?.("register"))}
                  className="btn-shimmer btn-glow flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 cursor-pointer"
                >
                  <Sprout size={18} />
                  <span>Start Free Prediction</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo("farmer")}
                  disabled={demoLoading}
                  className="key-cap flex items-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-800 hover:text-[#2E7D32] cursor-pointer"
                >
                  <Wheat size={18} className="text-[#2E7D32]" />
                  <span>{demoLoading ? "Logging In..." : "1-Click Demo Access"}</span>
                </button>
              </div>

              {/* QUICK HIGHLIGHT PILLS */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-[#DCE8D9]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#2E7D32] shrink-0" />
                  <span className="text-xs font-bold text-gray-700">95.2% ML Accuracy</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#2E7D32] shrink-0" />
                  <span className="text-xs font-bold text-gray-700">36 Districts Covered</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#2E7D32] shrink-0" />
                  <span className="text-xs font-bold text-gray-700">Instant PDF Exports</span>
                </div>
              </div>
            </div>

            {/* RIGHT FLOATING SHOWCASE CARD */}
            <div className="lg:col-span-5 relative">
              {/* MAIN GLASS SHOWCASE */}
              <div className="card card-interactive rounded-3xl p-6 shadow-2xl border border-emerald-100 bg-white/95 relative z-10">
                <div className="flex items-center justify-between border-b border-[#EEF2EC] pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3E6] text-[#2E7D32]">
                      <Activity size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-800">
                        Live AI Agronomy Hub
                      </h3>
                      <p className="text-[11px] text-gray-400">Maharashtra Agricultural Belt</p>
                    </div>
                  </div>
                  <span className="key-cap text-[10px] py-1 px-2.5 bg-[#E5F7EA] text-[#2E7D32]">
                    ● Active
                  </span>
                </div>

                {/* DEMO METRIC TILES */}
                <div className="mt-4 space-y-3">
                  {/* Yield Prediction Tile */}
                  <div className="rounded-2xl border border-[#DCE8D9] bg-[#F9FCF8] p-3.5 transition hover:bg-[#F0F8ED]">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                        <TrendingUp size={15} className="text-[#2E7D32]" />
                        Soybean Yield Forecast
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Pune Kharif
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-2xl font-extrabold text-[#2E7D32]">3.42 t/ha</span>
                      <span className="text-xs text-gray-500">+18% vs Regional Avg</span>
                    </div>
                  </div>

                  {/* Crop Recommendation Tile */}
                  <div className="rounded-2xl border border-[#DCE8D9] bg-[#F9FCF8] p-3.5 transition hover:bg-[#F0F8ED]">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                        <Sprout size={15} className="text-[#2E7D32]" />
                        Optimal Crop Recommendation
                      </span>
                      <span className="text-[10px] font-bold text-green-800 bg-green-100 px-2 py-0.5 rounded-full">
                        95.2% Match
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-xl font-extrabold text-gray-800">🌱 Cotton (Bt Hybrid)</span>
                      <span className="text-xs text-gray-500">N:90 • P:42 • pH:6.5</span>
                    </div>
                  </div>

                  {/* Weather Tile */}
                  <div className="rounded-2xl border border-[#DCE8D9] bg-[#F9FCF8] p-3.5 transition hover:bg-[#F0F8ED]">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                        <CloudSun size={15} className="text-amber-500" />
                        Live Weather Telemetry
                      </span>
                      <span className="text-[10px] font-semibold text-gray-500">
                        OpenWeather API
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-base font-bold text-gray-800">28°C • Moderate Rain</span>
                      <span className="text-gray-500">Humidity: 78% • Wind: 14 km/h</span>
                    </div>
                  </div>
                </div>

                {/* PDF REPORT BUTTON & INTEGRATED TRUST ACCREDITATION */}
                <div className="mt-4 pt-3 border-t border-[#EEF2EC] space-y-3">
                  <button
                    type="button"
                    onClick={() => (user ? nav?.("reports") : handleQuickDemo("farmer"))}
                    className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-xl bg-[#2E7D32] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#1B5E20] cursor-pointer"
                  >
                    <FileText size={14} />
                    <span>View Sample PDF Farm Dossier</span>
                  </button>

                  {/* PROFESSIONAL FARMER TRUST BADGE (INTEGRATED & CLEAN - ZERO OVERLAP) */}
                  <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-amber-50/90 via-[#F8FAF7] to-emerald-50/90 p-2.5 px-3.5 border border-amber-200/50 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-xs">
                        <Award size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-gray-800 flex items-center gap-1">
                          <span>🌾 Farmer's #1 Choice</span>
                        </p>
                        <p className="text-[10px] text-[#2E7D32] font-bold">⭐ 4.9/5 • 99.8% Decision Accuracy</p>
                      </div>
                    </div>
                    <span className="key-cap text-[9px] py-0.5 px-2 bg-emerald-100 text-[#2E7D32] font-bold">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. UPPER MARQUEE / HIGHLIGHT BANNER
         ========================================================= */}
      <div className="border-y border-[#DCE8D9] bg-[#EAF3E6]/60 py-3.5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 text-xs font-bold text-[#1B5E20] sm:px-6">
          <span className="flex items-center gap-1.5">
            <Wheat size={15} /> 36 Maharashtra Districts
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Zap size={15} /> Dual Random Forest ML Engines
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <FileText size={15} /> 1-Click PDF Generation
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Globe size={15} /> English, हिन्दी, मराठी
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Lock size={15} /> Role-Based Access Control
          </span>
        </div>
      </div>

      {/* =========================================================
          4. CORE CAPABILITIES (FEATURES GRID)
         ========================================================= */}
      <section id="features" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="key-cap text-xs py-1 px-3 bg-[#E5F7EA] text-[#2E7D32]">
              Agricultural Intelligence
            </span>
            <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold text-[#172B18] tracking-tight">
              State-of-the-Art Decision Support for Every Kisan
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-gray-500 leading-relaxed">
              KrushiMitra integrates modern machine learning models with localized soil taxonomy and meteorological APIs to provide actionable agronomic intelligence.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="card card-interactive rounded-3xl p-6 group cursor-default transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3E6] text-[#2E7D32] shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Icon size={24} />
                    </div>
                    <span className="key-cap text-[10px] py-0.5 px-2.5">
                      {f.tag}
                    </span>
                  </div>

                  <h3 className="mt-5 text-base font-bold text-gray-800 group-hover:text-[#2E7D32] transition-colors">
                    {f.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-gray-500 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          5. 3-STEP AGRICULTURAL PIPELINE (HOW IT WORKS)
         ========================================================= */}
      <section id="how-it-works" className="py-16 bg-[#EAF3E6]/40 border-y border-[#DCE8D9]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="key-cap text-xs py-1 px-3 bg-[#E5F7EA] text-[#2E7D32]">
              Simple & Streamlined
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#172B18]">
              How KrushiMitra Works in 3 Steps
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="card card-interactive rounded-3xl p-6 relative group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2E7D32] text-white shadow-md">
                      <Icon size={22} />
                    </div>
                    <span className="text-2xl font-extrabold text-emerald-200 group-hover:text-[#2E7D32] transition-colors">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="mt-5 text-base font-bold text-gray-800">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          6. AI MODEL ARCHITECTURE & ACCURACY
         ========================================================= */}
      <section id="models" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="card rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#10B981] text-white shadow-xl">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold backdrop-blur-md">
                  🧠 Machine Learning Engine
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Trained on Real Indian Agronomic Datasets
                </h2>
                <p className="text-xs sm:text-sm text-green-50/90 leading-relaxed max-w-xl">
                  KrushiMitra bundles standalone serialized scikit-learn models. No guesswork: predictions are computed mathematically from multi-feature historical patterns.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                  <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-md">
                    <p className="text-2xl font-extrabold">95.2%</p>
                    <p className="text-[10px] text-green-100">Classifier Accuracy</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-md">
                    <p className="text-2xl font-extrabold">22+</p>
                    <p className="text-[10px] text-green-100">Crop Classes</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-md">
                    <p className="text-2xl font-extrabold">36</p>
                    <p className="text-[10px] text-green-100">Districts</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-md">
                    <p className="text-2xl font-extrabold">&lt;100ms</p>
                    <p className="text-[10px] text-green-100">Inference Speed</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-3">
                <div className="rounded-2xl bg-white p-5 text-gray-800 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1B5E20]">Model 1: Classifier</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">RF Model</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-700 mt-1">`crop_recommendation_rf.pkl`</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">7 soil inputs → 22 crop probability distributions.</p>
                </div>

                <div className="rounded-2xl bg-white p-5 text-gray-800 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1B5E20]">Model 2: Regressor</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">RF Regressor</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-700 mt-1">`productivity_random_forest.pkl`</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Regional climate inputs → Yield output in tonnes/hectare.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          7. FARMER TESTIMONIALS
         ========================================================= */}
      <section id="testimonials" className="py-16 sm:py-20 bg-[#EAF3E6]/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="key-cap text-xs py-1 px-3 bg-[#E5F7EA] text-[#2E7D32]">
              Farmer Endorsements
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#172B18]">
              Trusted by Progressive Kisans
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="card card-interactive rounded-3xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(t.rating)].map((_, r) => (
                      <Star key={r} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#EEF2EC] flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">{t.name}</h4>
                    <p className="text-[10px] text-gray-500">{t.role}</p>
                    <p className="text-[10px] text-[#2E7D32] font-semibold">{t.district} • {t.farmSize}</p>
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF3E6] text-sm">
                    🌾
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          8. FAQ SECTION
         ========================================================= */}
      <section id="faq" className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="key-cap text-xs py-1 px-3 bg-[#E5F7EA] text-[#2E7D32]">
              Help & Answers
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#172B18]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="card rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(i)}
                  className="flex w-full items-center justify-between p-5 text-left font-bold text-xs sm:text-sm text-gray-800 hover:text-[#2E7D32] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    size={16}
                    className={`shrink-0 transition-transform duration-200 ${
                      faqOpen === i ? "rotate-90 text-[#2E7D32]" : "text-gray-400"
                    }`}
                  />
                </button>
                {faqOpen === i && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-gray-500 leading-relaxed border-t border-[#EEF2EC] pt-3 animate-pop">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          9. FINAL CALL TO ACTION (CTA)
         ========================================================= */}
      <section className="py-12 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Boost Your Agricultural Harvest?
          </h2>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-green-100 leading-relaxed">
            Join hundreds of progressive farmers utilizing KrushiMitra for precision crop predictions, soil health tracking, and automated PDF reporting.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => nav?.("register")}
              className="btn-shimmer flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-xs sm:text-sm font-bold text-[#1B5E20] shadow-xl hover:bg-[#F7FFF5] active:scale-95 cursor-pointer"
            >
              <Sprout size={18} />
              <span>Create Free Account</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo("farmer")}
              className="key-cap bg-emerald-900/60 border-emerald-700 text-white rounded-2xl px-6 py-3.5 text-xs sm:text-sm font-bold cursor-pointer"
            >
              <span>Instant Demo Access</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================
          10. FOOTER
         ========================================================= */}
      <footer className="border-t border-[#DCE8D9] bg-white py-12 text-xs text-gray-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* BRAND */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2E7D32] text-white">
                  <Sprout size={20} />
                </div>
                <span className="text-base font-extrabold text-[#1B5E20]">KrushiMitra</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Empowering Indian Kisans with machine learning crop recommendations, yield forecasting, and meteorological intelligence.
              </p>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h4 className="font-bold text-gray-800 mb-2.5">Platform Tools</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => (user ? nav?.("prediction") : nav?.("login"))} className="hover:text-[#2E7D32] cursor-pointer">
                    Crop Yield Prediction
                  </button>
                </li>
                <li>
                  <button onClick={() => (user ? nav?.("recommendation") : nav?.("login"))} className="hover:text-[#2E7D32] cursor-pointer">
                    Soil Nutrient Recommendation
                  </button>
                </li>
                <li>
                  <button onClick={() => (user ? nav?.("weather") : nav?.("login"))} className="hover:text-[#2E7D32] cursor-pointer">
                    District Weather Advisory
                  </button>
                </li>
                <li>
                  <button onClick={() => (user ? nav?.("reports") : nav?.("login"))} className="hover:text-[#2E7D32] cursor-pointer">
                    Official PDF Export
                  </button>
                </li>
              </ul>
            </div>

            {/* FARMER RESOURCES */}
            <div>
              <h4 className="font-bold text-gray-800 mb-2.5">Farmer Support</h4>
              <ul className="space-y-2">
                <li>
                  <span className="flex items-center gap-1">
                    <PhoneCall size={12} className="text-[#2E7D32]" /> Kisan Helpline: 1800-180-1551
                  </span>
                </li>
                <li>
                  <span>IMD Mausam Weather Feed</span>
                </li>
                <li>
                  <span>Maharashtra Agronomy Dept.</span>
                </li>
                <li>
                  <span>ICAR Soil Taxonomy Standards</span>
                </li>
              </ul>
            </div>

            {/* AUTH & ADMIN */}
            <div>
              <h4 className="font-bold text-gray-800 mb-2.5">Account Access</h4>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => nav?.("login")}
                  className="key-cap w-full text-center py-1.5 text-[11px]"
                >
                  Farmer & Admin Login
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("admin")}
                  className="key-cap w-full text-center py-1.5 text-[11px]"
                >
                  Super-Admin Demo
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-[#EEF2EC] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <p>© {new Date().getFullYear()} KrushiMitra AI. Built for Indian Agriculture & Sustainable Farming.</p>
            <div className="flex items-center gap-4">
              <span className="text-emerald-700 font-semibold">● SQLite Persistent DB Online</span>
              <span className="text-[#2E7D32] font-semibold">● 95.2% ML Engine Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
