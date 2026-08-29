import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  ArrowRight,
  Sprout,
  TrendingUp,
  CloudSun,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ImageSlider({
  slides = [],
  autoPlay = true,
  interval = 5000,
  transitionMode = "fade", // "fade" | "slide"
  showControls = true,
  showDots = true,
  showProgressBar = true,
  className = "",
  onSlideAction = null,
}) {
  const { language } = useApp?.() || { language: "en" };
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  // Multi-lingual rich agriculture slides
  const localizedSlideData = {
    en: [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80",
        category: "🌾 Smart Crop Selection",
        title: "Data-Driven Crop Recommendations",
        description: "Analyze Nitrogen, Phosphorus, Potassium, Soil pH, and Rainfall to discover high-yield crops tailored to your soil chemistry.",
        buttonText: "Recommend Crops",
        action: "recommendation",
        badgeIcon: Sprout,
        badgeColor: "bg-emerald-500",
      },
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1600&q=80",
        category: "📈 Harvest Yield Forecasting",
        title: "Predict Expected Harvest Productivity",
        description: "Calibrated on historical district datasets across Maharashtra to help you anticipate harvest tonnage and plan marketing in advance.",
        buttonText: "Predict Farm Yield",
        action: "prediction",
        badgeIcon: TrendingUp,
        badgeColor: "bg-amber-500",
      },
      {
        id: 3,
        image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1600&q=80",
        category: "⛅ Real-Time Agro Meteorology",
        title: "Live Weather & Sowing Advisories",
        description: "Get real-time precipitation, ambient humidity, and wind telemetry to time your fertilization and spraying operations accurately.",
        buttonText: "View Live Weather",
        action: "weather",
        badgeIcon: CloudSun,
        badgeColor: "bg-teal-500",
      },
      {
        id: 4,
        image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1600&q=80",
        category: "📑 Official Farm Reports",
        title: "Export 1-Click Farm Health PDF Reports",
        description: "Generate structured, printable farm records with soil test summaries, harvest estimates, and agronomic guidance.",
        buttonText: "Generate Reports",
        action: "reports",
        badgeIcon: ShieldCheck,
        badgeColor: "bg-green-600",
      },
    ],
    mr: [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80",
        category: "🌾 योग्य पीक निवड",
        title: "माती परीक्षणानुसार पीक शिफारस",
        description: "तुमच्या शेतातील नायट्रोजन, स्फुरद, पालाश, सामू आणि हवामानानुसार सर्वाधिक उत्पन्न देणारे योग्य पीक निवडा.",
        buttonText: "पीक शिफारस पहा",
        action: "recommendation",
        badgeIcon: Sprout,
        badgeColor: "bg-emerald-500",
      },
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1600&q=80",
        category: "📈 पीक उत्पादन अंदाज",
        title: "अपेक्षित शेत उत्पादकतेचा अचूक अंदाज",
        description: "महाराष्ट्रातील ऐतिहासिक कृषी व हवामान माहितीच्या आधारे तुमच्या शेतातील अंदाजित उत्पादनाची माहिती मिळवा.",
        buttonText: "उत्पादन अंदाज काढा",
        action: "prediction",
        badgeIcon: TrendingUp,
        badgeColor: "bg-amber-500",
      },
      {
        id: 3,
        image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1600&q=80",
        category: "⛅ थेट हवामान व कृषी सल्ला",
        title: "हवामान अंदाज आणि फवारणी मार्गदर्शन",
        description: "पाऊस, तापमान आणि आर्द्रतेची अचूक माहिती मिळवून खत व्यवस्थापन आणि कीटकनाशक फवारणीचे योग्य नियोजन करा.",
        buttonText: "थेट हवामान पहा",
        action: "weather",
        badgeIcon: CloudSun,
        badgeColor: "bg-teal-500",
      },
      {
        id: 4,
        image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1600&q=80",
        category: "📑 अधिकृत शेतकरी अहवाल",
        title: "१-क्लिक मध्ये शेतकरी PDF अहवाल डाऊनलोड करा",
        description: "मातीचे घटक, पीक उत्पादन अंदाज आणि संपूर्ण कृषी मार्गदर्शनाचा मुद्रणयोग्य अधिकृत अहवाल तयार करा.",
        buttonText: "अहवाल तयार करा",
        action: "reports",
        badgeIcon: ShieldCheck,
        badgeColor: "bg-green-600",
      },
    ],
    hi: [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80",
        category: "🌾 स्मार्ट फसल चयन",
        title: "मृदा परीक्षण आधारित फसल सिफारिश",
        description: "अपनी जमीन के नाइट्रोजन, फास्फोरस, पोटाश, पीएच और वर्षा के आधार पर सर्वाधिक उपज देने वाली फसल चुनें।",
        buttonText: "फसल सिफारिश देखें",
        action: "recommendation",
        badgeIcon: Sprout,
        badgeColor: "bg-emerald-500",
      },
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1600&q=80",
        category: "📈 फसल उत्पादन पूर्वानुमान",
        title: "अपेक्षित पैदावार का सटीक अनुमान",
        description: "महाराष्ट्र के कृषि एवं मौसमी आंकड़ों के आधार पर अपने खेत की अनुमानित पैदावार पहले से जानें।",
        buttonText: "उत्पादन पूर्वानुमान देखें",
        action: "prediction",
        badgeIcon: TrendingUp,
        badgeColor: "bg-amber-500",
      },
      {
        id: 3,
        image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1600&q=80",
        category: "⛅ रीयल-टाइम मौसम और कृषि सलाह",
        title: "सटीक मौसम पूर्वानुमान और छिड़काव सलाह",
        description: "बारिश, तापमान और नमी के लाइव आंकड़ों से खाद प्रबंधन और कीटनाशक छिड़काव का सही समय तय करें।",
        buttonText: "लाइव मौसम देखें",
        action: "weather",
        badgeIcon: CloudSun,
        badgeColor: "bg-teal-500",
      },
      {
        id: 4,
        image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1600&q=80",
        category: "📑 आधिकारिक कृषि रिपोर्ट",
        title: "१-क्लिक में किसान PDF रिपोर्ट डाउनलोड करें",
        description: "मिट्टी के पोषक तत्व, फसल उत्पादन अनुमान और कृषि परामर्श की साफ-सुथरी PDF रिपोर्ट प्राप्त करें।",
        buttonText: "रिपोर्ट बनाएं",
        action: "reports",
        badgeIcon: ShieldCheck,
        badgeColor: "bg-green-600",
      },
    ],
  };

  const defaultSlides = localizedSlideData[language] || localizedSlideData.en;
  const activeSlides = slides.length > 0 ? slides : defaultSlides;
  const totalSlides = activeSlides.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto-advance timer logic
  useEffect(() => {
    if (isPlaying && !isHovered && totalSlides > 1) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, interval);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, currentIndex, interval, totalSlides]);

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];
  const BadgeIcon = currentSlide.badgeIcon || Sparkles;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border border-[#DCE8D9] dark:border-[#24402A] shadow-[0_16px_40px_rgba(46,125,50,0.12)] bg-[#132218] select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* PROGRESS BAR TIMER (AUTO SLIDER) */}
      {showProgressBar && isPlaying && !isHovered && (
        <div className="absolute top-0 left-0 right-0 z-30 h-1 bg-white/20">
          <div
            key={currentIndex}
            className="h-full bg-gradient-to-r from-[#4ADE80] to-[#10B981] animate-[km-progress-bar_linear_forwards]"
            style={{ animationDuration: `${interval}ms` }}
          />
        </div>
      )}

      {/* SLIDES CONTAINER WITH FADE & KEN BURNS ZOOM */}
      <div className="relative h-[380px] sm:h-[430px] md:h-[480px] w-full">
        {activeSlides.map((slide, idx) => {
          const isActive = idx === currentIndex;

          return (
            <div
              key={slide.id || idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* SLIDE BACKGROUND IMAGE WITH KEN BURNS SLOW ZOOM */}
              <div
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-out ${
                  isActive ? "scale-108" : "scale-100"
                }`}
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              />

              {/* MULTI-LAYER GRADIENT OVERLAYS */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0d1710]/95 via-[#0d1710]/60 to-transparent" />

              {/* SLIDE CONTENT (SLIDE-IN ANIMATED OVERLAY) */}
              {isActive && (
                <div className="relative z-20 flex h-full max-w-2xl flex-col justify-end p-6 sm:p-9 md:p-12 text-white">
                  {/* CATEGORY BADGE (SLIDE IN FROM LEFT) */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3.5 py-1 text-xs font-black backdrop-blur-md shadow-sm w-fit animate-slide-in-left">
                    <BadgeIcon size={14} className="text-[#4ADE80] animate-pulse" />
                    <span className="text-[#EAF3E6] font-bold tracking-wide">
                      {slide.category}
                    </span>
                  </div>

                  {/* SLIDE TITLE (SLIDE IN FROM BOTTOM WITH ZOOM ACCENT) */}
                  <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight animate-slide-in-up">
                    {slide.title}
                  </h2>

                  {/* SLIDE DESCRIPTION (STAGGERED FADE-IN) */}
                  <p className="mt-2.5 text-xs sm:text-sm text-gray-200/90 leading-relaxed font-medium max-w-xl animate-fade-in-up stagger-1">
                    {slide.description}
                  </p>

                  {/* CALL TO ACTION BUTTON (HOVER GLOW & BOUNCE) */}
                  {slide.buttonText && (
                    <div className="mt-5 animate-slide-in-up stagger-2">
                      <button
                        type="button"
                        onClick={() => onSlideAction && onSlideAction(slide.action || slide)}
                        className="btn-shimmer btn-glow group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#2E7D32] via-[#16A34A] to-[#10B981] px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-extrabold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl active:scale-95 cursor-pointer"
                      >
                        <span>{slide.buttonText}</span>
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-300 group-hover:translate-x-1.5"
                        />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* NAVIGATION CONTROLS: PREV & NEXT BUTTONS */}
      {showControls && totalSlides > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border border-white/20 bg-black/40 text-white backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-110 hover:bg-[#2E7D32] hover:border-[#4ADE80] active:scale-90 cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border border-white/20 bg-black/40 text-white backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-110 hover:bg-[#2E7D32] hover:border-[#4ADE80] active:scale-90 cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* BOTTOM CONTROLS: EXPANDING PILL DOTS & PLAY/PAUSE TOGGLE */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full shadow-lg">
        {/* PLAY/PAUSE TOGGLE */}
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? "Pause Auto-play" : "Start Auto-play"}
          className="text-white/80 hover:text-white transition cursor-pointer"
          title={isPlaying ? "Pause Slider" : "Auto-play Slider"}
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} />}
        </button>

        <span className="h-3 w-px bg-white/20" />

        {/* DOTS INDICATOR WITH EXPANDING PILL */}
        {showDots && (
          <div className="flex items-center gap-1.5">
            {activeSlides.map((_, idx) => {
              const active = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    active
                      ? "w-6 bg-gradient-to-r from-[#4ADE80] to-[#10B981] shadow-xs"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
