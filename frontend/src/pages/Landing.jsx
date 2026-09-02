import React, { useState, useEffect, useRef } from "react";
import {
  Sprout,
  TrendingUp,
  CloudSun,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon,
  Wheat,
  Zap,
  Award,
  ChevronRight,
  ChevronLeft,
  Star,
  Activity,
  PhoneCall,
  Layers,
  CheckCircle2,
  MapPin,
  RefreshCw,
  Droplets,
  Wind,
  Gauge,
  Compass,
  Mail,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import ImageSlider from "../components/ImageSlider";
import VoiceChatbot from "../components/VoiceChatbot";

/* =========================================================
   ZOOM-FADE SCROLL REVEAL WRAPPER
   ========================================================= */
function ZoomFadeReveal({ children, className = "", delay = 0, threshold = 0.08 }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    const currentElem = domRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, [threshold]);

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${
        isVisible
          ? "opacity-100 scale-100 translate-y-0 blur-none"
          : "opacity-0 scale-[0.93] translate-y-6 blur-[2px] pointer-events-none"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function Landing({ nav }) {
  const {
    user,
    language,
    setLanguage,
    theme,
    changeTheme,
    apiLogin,
    t,
    tCrop,
  } = useApp();

  const [faqOpen, setFaqOpen] = useState(null);
  const [demoLoading, setDemoLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("yield");
  const [activeStep, setActiveStep] = useState(0);

  // Crops Category Filter & Slider State
  const [cropCategory, setCropCategory] = useState("all");

  // Testimonials Carousel Slider State
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Dynamic Simulator State: Yield Predictor
  const [simDistrict, setSimDistrict] = useState("Pune");
  const [simCrop, setSimCrop] = useState("Soybean");
  const [simArea, setSimArea] = useState(3.5);
  const [simYieldResult, setSimYieldResult] = useState({
    yieldPerHa: 3.42,
    totalProduction: 11.97,
    status: "+18% Regional Calibration",
    confidence: "High Compatibility",
  });

  // Dynamic Simulator State: Soil Advisory
  const [soilN, setSoilN] = useState(90);
  const [soilP, setSoilP] = useState(42);
  const [soilK, setSoilK] = useState(43);
  const [soilPh, setSoilPh] = useState(6.8);
  const [soilRecResult, setSoilRecResult] = useState({
    crop: "Rice (Paddy)",
    confidence: "Optimal",
    suitability: "High Nitrogen & Moisture Match",
  });

  // Dynamic Simulator State: Live Location Weather
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherData, setWeatherData] = useState({
    location: "Pune, MH",
    temp: 28.5,
    condition: "Optimal Skies",
    humidity: 78,
    wind: 12,
    advice: "Optimal Kharif Sowing Window",
    isLiveGps: false,
  });

  // Multi-lingual Core Supported Crops
  const supportedModelCrops = [
    {
      name: "Soybean",
      category: "kharif",
      displayName: language === "mr" ? "सोयाबीन" : language === "hi" ? "सोयाबीन" : "Soybean",
      marathiName: "सोयाबीन",
      hindiName: "सोयाबीन",
      icon: "🌱",
      season: language === "mr" ? "खरीप (पावसाळी)" : language === "hi" ? "खरीफ (मानसून)" : "Kharif (Monsoon)",
      soil: language === "mr" ? "काळी चिकणमाती जमीन" : language === "hi" ? "काली चिकनी मिट्टी" : "Black Clayey Regur Soil",
      yieldRange: "2.8 - 3.8 t/ha",
      badge: language === "mr" ? "तेलबिया पीक" : language === "hi" ? "तिलहन फसल" : "Oilseed Crop",
    },
    {
      name: "Cotton",
      category: "cash",
      displayName: language === "mr" ? "कापूस" : language === "hi" ? "कपास" : "Cotton",
      marathiName: "कापूस",
      hindiName: "कपास",
      icon: "☁️",
      season: language === "mr" ? "खरीप हंगाम" : language === "hi" ? "खरीफ मौसम" : "Kharif Season",
      soil: language === "mr" ? "सुपीक काळी जमीन" : language === "hi" ? "उपजाऊ गहरी काली मिट्टी" : "Deep Black Loam",
      yieldRange: "2.2 - 3.2 t/ha",
      badge: language === "mr" ? "नगदी कापूस" : language === "hi" ? "नकदी रेशा" : "Cash Fiber",
    },
    {
      name: "Sugarcane",
      category: "cash",
      displayName: language === "mr" ? "ऊस" : language === "hi" ? "गन्ना" : "Sugarcane",
      marathiName: "ऊस",
      hindiName: "गन्ना",
      icon: "🎋",
      season: language === "mr" ? "वार्षिक / बागायती" : language === "hi" ? "वार्षिक / बारहमासी" : "Perennial / Annual",
      soil: language === "mr" ? "गाळाची ओलसर जमीन" : language === "hi" ? "दोमट और कछारी मिट्टी" : "Alluvial & Canal Basin",
      yieldRange: "85 - 110 t/ha",
      badge: language === "mr" ? "उच्च उत्पन्न नगदी" : language === "hi" ? "उच्च उपज नकदी" : "High Yield Cash",
    },
    {
      name: "Wheat",
      category: "rabi",
      displayName: language === "mr" ? "गहू" : language === "hi" ? "गेहूं" : "Wheat",
      marathiName: "गहू",
      hindiName: "गेहूं",
      icon: "🌾",
      season: language === "mr" ? "रब्बी (हिवाळी)" : language === "hi" ? "रबी (सर्दियां)" : "Rabi (Winter)",
      soil: language === "mr" ? "पाण्याचा निचरा होणारी जमीन" : language === "hi" ? "अच्छे जल निकास वाली दोमट" : "Well-Drained Loam",
      yieldRange: "3.2 - 4.5 t/ha",
      badge: language === "mr" ? "हिवाळी अन्नधान्य" : language === "hi" ? "शीतकालीन अनाज" : "Winter Cereal",
    },
    {
      name: "Gram",
      category: "rabi",
      displayName: language === "mr" ? "हरभरा" : language === "hi" ? "चना" : "Gram (Chickpea)",
      marathiName: "हरभरा",
      hindiName: "चना",
      icon: "🥔",
      season: language === "mr" ? "रब्बी (हिवाळी)" : language === "hi" ? "रबी (सर्दियां)" : "Rabi (Winter)",
      soil: language === "mr" ? "हलकी ते मध्यम काळी जमीन" : language === "hi" ? "रेतीली दोमट मिट्टी" : "Sandy Clay Loam",
      yieldRange: "1.6 - 2.4 t/ha",
      badge: language === "mr" ? "कडधान्य डाळ" : language === "hi" ? "दलहन फसल" : "Protein Pulse",
    },
    {
      name: "Tur",
      category: "kharif",
      displayName: language === "mr" ? "तूर" : language === "hi" ? "अरहर" : "Tur (Pigeon Pea)",
      marathiName: "तूर",
      hindiName: "अरहर",
      icon: "🌿",
      season: language === "mr" ? "खरीप हंगाम" : language === "hi" ? "खरीफ मौसम" : "Kharif Season",
      soil: language === "mr" ? "मध्यम काळी जमीन" : language === "hi" ? "मध्यम गहरी काली मिट्टी" : "Medium Deep Black Soil",
      yieldRange: "1.5 - 2.2 t/ha",
      badge: language === "mr" ? "नायट्रोजन समृद्ध" : language === "hi" ? "नाइट्रोजन युक्त" : "Nitrogen Fixing",
    },
    {
      name: "Rice",
      category: "kharif",
      displayName: language === "mr" ? "भात / धान" : language === "hi" ? "चावल / धान" : "Rice (Paddy)",
      marathiName: "भात / धान",
      hindiName: "चावल / धान",
      icon: "🌾",
      season: language === "mr" ? "खरीप हंगाम" : language === "hi" ? "खरीफ मौसम" : "Kharif Season",
      soil: language === "mr" ? "दलदलीची ओलसर जमीन" : language === "hi" ? "चिकनी नम मिट्टी" : "Clayey Moist Basin",
      yieldRange: "3.8 - 5.2 t/ha",
      badge: language === "mr" ? "प्रमुख अन्नधान्य" : language === "hi" ? "प्रमुख खाद्यान्न" : "Primary Staple",
    },
  ];

  const filteredCrops =
    cropCategory === "all"
      ? supportedModelCrops
      : supportedModelCrops.filter((c) => c.category === cropCategory);

  const handleTryStep = (stepIdx) => {
    if (user) {
      if (stepIdx === 0) nav?.("recommendation");
      else if (stepIdx === 1) nav?.("prediction");
      else nav?.("reports");
    } else {
      nav?.("register");
    }
  };

  const handleFeatureClick = (action) => {
    if (user) {
      nav?.(action);
    } else {
      nav?.("register");
    }
  };

  // Dynamic Yield Calculator on simulator change
  useEffect(() => {
    const yieldRates = {
      Soybean: { Pune: 3.42, Nagpur: 2.89, Nashik: 3.15, Kolhapur: 3.65, Solapur: 2.75, Amravati: 2.95, Aurangabad: 3.05 },
      Cotton: { Pune: 2.45, Nagpur: 3.12, Nashik: 2.60, Kolhapur: 2.35, Solapur: 2.50, Amravati: 3.18, Aurangabad: 2.85 },
      Sugarcane: { Pune: 98.5, Nagpur: 82.0, Nashik: 88.5, Kolhapur: 104.2, Solapur: 91.0, Amravati: 79.5, Aurangabad: 85.0 },
      Wheat: { Pune: 3.80, Nagpur: 3.25, Nashik: 4.10, Kolhapur: 3.60, Solapur: 3.10, Amravati: 3.35, Aurangabad: 3.70 },
      Gram: { Pune: 2.10, Nagpur: 1.95, Nashik: 2.25, Kolhapur: 1.85, Solapur: 1.90, Amravati: 2.05, Aurangabad: 2.15 },
      Tur: { Pune: 1.90, Nagpur: 2.15, Nashik: 1.80, Kolhapur: 1.75, Solapur: 1.85, Amravati: 2.20, Aurangabad: 2.00 },
      Rice: { Pune: 4.60, Nagpur: 4.20, Nashik: 4.80, Kolhapur: 5.10, Solapur: 3.60, Amravati: 3.90, Aurangabad: 4.10 },
    };

    const rate = (yieldRates[simCrop] && yieldRates[simCrop][simDistrict]) || 3.25;
    const totalProd = (rate * Number(simArea)).toFixed(2);

    const statusLabel = language === "mr" ? `+${(rate * 5.2).toFixed(0)}% प्रादेशिक अचूकता` : language === "hi" ? `+${(rate * 5.2).toFixed(0)}% क्षेत्रीय सटीकता` : `+${(rate * 5.2).toFixed(0)}% Regional Calibration`;
    const confLabel = language === "mr" ? "उच्च अनुकूलता" : language === "hi" ? "उच्च अनुकूलता" : "High Compatibility";

    setSimYieldResult({
      yieldPerHa: rate,
      totalProduction: totalProd,
      status: statusLabel,
      confidence: confLabel,
    });
  }, [simCrop, simDistrict, simArea, language]);

  // Dynamic Soil Advisory on N-P-K sliders
  useEffect(() => {
    let recCrop = "Rice";
    let reason = language === "mr" ? "नायट्रोजन आणि ओलाव्यासाठी उत्तम" : language === "hi" ? "नाइट्रोजन और नमी के लिए सर्वोत्तम" : "High Nitrogen & Soil Moisture Profile";
    let conf = language === "mr" ? "योग्य" : language === "hi" ? "उपयुक्त" : "Optimal";

    if (soilN > 100 && soilK > 40) {
      recCrop = "Cotton";
      reason = language === "mr" ? "नायट्रोजन आणि पालाशसाठी उत्तम" : language === "hi" ? "नाइट्रोजन और पोटाश के लिए सर्वोत्तम" : "High Nitrogen & Potassium Affinity";
    } else if (soilP > 55) {
      recCrop = "Gram";
      reason = language === "mr" ? "स्फुरद घटकांसाठी अनुकूल कडधान्य" : language === "hi" ? "फास्फोरस के लिए उपयुक्त दलहन" : "Phosphorus Responsive Legume Profile";
    } else if (soilN < 60 && soilP < 40) {
      recCrop = "Tur";
      reason = language === "mr" ? "कमी अन्नद्रव्ये लागणारे द्विदल पीक" : language === "hi" ? "कम पोषक तत्वों वाली उपयुक्त फसल" : "Low Nutrient Tolerant Nitrogen-Fixing Pulse";
    } else if (soilPh > 7.2) {
      recCrop = "Sugarcane";
      reason = language === "mr" ? "मध्यम आम्ल जमिनीत उत्तम उत्पादन" : language === "hi" ? "हल्की क्षारीय मिट्टी के लिए उपयुक्त" : "Slight Alkaline Loam Tolerance";
    } else if (soilN > 70 && soilP > 35) {
      recCrop = "Soybean";
      reason = language === "mr" ? "संतुलित नायट्रोजन व स्फुरदसाठी उत्तम" : language === "hi" ? "संतुलित नाइट्रोजन व फास्फोरस के लिए सर्वोत्तम" : "Optimal Balanced Nitrogen-Phosphorus Match";
    }

    setSoilRecResult({
      crop: recCrop,
      confidence: conf,
      suitability: reason,
    });
  }, [soilN, soilP, soilK, soilPh, language]);

  // Fetch Live Real Location Weather Telemetry
  const fetchLiveLocationWeather = () => {
    setWeatherLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(
              `http://127.0.0.1:5000/api/weather?lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            if (res.ok && data.success) {
              setWeatherData({
                location: data.city || (language === "mr" ? "तुमचे थेट शेत स्थान" : language === "hi" ? "आपका लाइव खेत स्थान" : "Your Live Farm Location"),
                temp: data.temperature || 28.5,
                condition: data.condition || "Optimal Atmosphere",
                humidity: data.humidity || 75,
                wind: data.wind_speed || 12,
                advice: data.farming_advice || (language === "mr" ? "शेतीसाठी अनुकूल हवामान" : language === "hi" ? "खेती के लिए अनुकूल मौसम" : "Favorable Field Conditions"),
                isLiveGps: true,
              });
            } else {
              fallbackDistrictWeather("Pune");
            }
          } catch (e) {
            fallbackDistrictWeather("Pune");
          } finally {
            setWeatherLoading(false);
          }
        },
        () => {
          fallbackDistrictWeather("Pune");
          setWeatherLoading(false);
        },
        { timeout: 8000 }
      );
    } else {
      fallbackDistrictWeather("Pune");
      setWeatherLoading(false);
    }
  };

  const fallbackDistrictWeather = async (districtName) => {
    setWeatherLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/api/weather?city=${encodeURIComponent(districtName)}`
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setWeatherData({
          location: `${districtName}, MH`,
          temp: data.temperature || 28.5,
          condition: data.condition || "Clear Sowing Skies",
          humidity: data.humidity || 76,
          wind: data.wind_speed || 14,
          advice: data.farming_advice || (language === "mr" ? "पेरणीसाठी अनुकूल हवामान" : language === "hi" ? "बुवाई के लिए सही समय" : "Optimal Kharif Sowing Window"),
          isLiveGps: false,
        });
      }
    } catch (e) {
      console.error("Weather fetch fallback error:", e);
    } finally {
      setWeatherLoading(false);
    }
  };

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const handleQuickDemo = async (role = "farmer") => {
    setDemoLoading(true);
    try {
      await apiLogin("ramesh.patil@krushimitra.in", "password123");
      nav?.("dashboard");
    } catch (err) {
      console.error("Demo login error:", err);
    } finally {
      setDemoLoading(false);
    }
  };

  const coreFeatures = [
    {
      icon: TrendingUp,
      title: t("yieldForecastingTitle") || "Crop Yield Prediction",
      desc: t("yieldForecastingDesc") || "Find out how much harvest (in tonnes/hectare) you can expect based on your district, land size, and weather.",
      tag: language === "mr" ? "उत्पादन अंदाज" : language === "hi" ? "पैदावार अनुमान" : "Harvest Forecast",
      bg: "bg-emerald-50 dark:bg-emerald-950/60",
      accent: "text-emerald-700 dark:text-[#4ADE80]",
      action: "prediction",
    },
    {
      icon: Sprout,
      title: t("soilAdvisoryTitle") || "Soil & Crop Recommendation",
      desc: t("soilAdvisoryDesc") || "Enter your soil test values (N, P, K, pH) to find the most profitable and healthy crop for your field.",
      tag: language === "mr" ? "माती परीक्षण सल्ला" : language === "hi" ? "मृदा परीक्षण सलाह" : "Soil Advisory",
      bg: "bg-green-50 dark:bg-green-950/60",
      accent: "text-green-700 dark:text-[#4ADE80]",
      action: "recommendation",
    },
    {
      icon: CloudSun,
      title: t("weatherTelemetryTitle") || "Live Weather & Rain Forecast",
      desc: t("weatherTelemetryDesc") || "Check real-time temperature, rainfall, and weather conditions across Maharashtra to plan your sowing and irrigation.",
      tag: language === "mr" ? "थेट हवामान" : language === "hi" ? "लाइव मौसम" : "Live Weather",
      bg: "bg-teal-50 dark:bg-teal-950/60",
      accent: "text-teal-700 dark:text-teal-400",
      action: "weather",
    },
    {
      icon: FileText,
      title: t("pdfDossiersTitle") || "Downloadable Farm Reports (PDF)",
      desc: t("pdfDossiersDesc") || "Download simple, professional 1-page PDF reports for your farm records, bank loans, or crop insurance.",
      tag: language === "mr" ? "१-क्लिक PDF" : language === "hi" ? "१-क्लिक PDF" : "1-Click PDF",
      bg: "bg-amber-50 dark:bg-amber-950/60",
      accent: "text-amber-700 dark:text-amber-400",
      action: "reports",
    },
  ];

  const workflowSteps = [
    {
      num: "01",
      title: t("step1Title") || "1. Enter Farm Details",
      desc: t("step1Desc") || "Select your district, land area, and simple soil test numbers.",
      icon: Layers,
      highlight: language === "mr" ? "जिल्हा व माती परीक्षण घटक निवडा" : language === "hi" ? "जिला और मृदा परीक्षण आंकड़े चुनें" : "Select District & Soil Chemistry",
    },
    {
      num: "02",
      title: t("step2Title") || "2. Smart AI Analysis",
      desc: t("step2Desc") || "Our smart AI calculates the best crop options and expected harvest yield in seconds.",
      icon: Zap,
      highlight: language === "mr" ? "स्मार्ट AI द्वारे उत्पादन गणना" : language === "hi" ? "स्मार्ट AI फसल उत्पादन गणना" : "Smart AI Harvest Calculation",
    },
    {
      num: "03",
      title: t("step3Title") || "3. Get Advice & PDF",
      desc: t("step3Desc") || "View your personalized farm recommendations and download your clean PDF report.",
      icon: Award,
      highlight: language === "mr" ? "१-क्लिक अधिकृत शेती PDF अहवाल" : language === "hi" ? "१-क्लिक आधिकारिक किसान PDF रिपोर्ट" : "1-Click Official PDF Report",
    },
  ];

  const localizedTestimonials = {
    en: [
      {
        name: "Ramesh Patil",
        role: "Soybean & Cotton Farmer",
        district: "Pune District, MH",
        farmSize: "5.0 Acres",
        quote: "KrushiMitra's Kharif yield predictions were remarkably accurate for my farm. The soil advisory helped me adjust my fertilizer schedule, increasing my harvest efficiency.",
        rating: 5,
      },
      {
        name: "Suresh Deshmukh",
        role: "Cotton & Gram Farmer",
        district: "Nagpur District, MH",
        farmSize: "12.5 Acres",
        quote: "The soil recommendation engine matched our Vidarbha black soil profile seamlessly. Live weather forecasts also helped avoid sowing right before unseasonal rain.",
        rating: 5,
      },
      {
        name: "Priya Shinde",
        role: "Vegetable & Sugarcane Grower",
        district: "Nashik District, MH",
        farmSize: "8.0 Acres",
        quote: "The automated PDF reports look very clean and official. I submitted the farm report directly to our local agricultural society for crop advisory.",
        rating: 5,
      },
    ],
    mr: [
      {
        name: "रमेश पाटील",
        role: "सोयाबीन व कापूस उत्पादक शेतकरी",
        district: "पुणे जिल्हा, महाराष्ट्र",
        farmSize: "५.० एकर",
        quote: "कृषीमित्रने वर्तवलेला खरीप उत्पादनाचा अंदाज माझ्या शेतासाठी अत्यंत अचूक ठरला. माती परीक्षणावरील सल्ल्यामुळे खतांचे योग्य नियोजन करता आले आणि उत्पादनात लक्षणीय वाढ झाली.",
        rating: 5,
      },
      {
        name: "सुरेश देशमुख",
        role: "कापूस व हरभरा उत्पादक शेतकरी",
        district: "नागपूर जिल्हा, महाराष्ट्र",
        farmSize: "१२.५ एकर",
        quote: "माती परीक्षणानुसार पीक शिफारसीने आमच्या विदर्भातील काळ्या मातीसाठी अगदी योग्य पीक सुचवले. थेट हवामान अंदाजामुळे अवकाळी पावसापूर्वी योग्य निर्णय घेता आला.",
        rating: 5,
      },
      {
        name: "प्रिया शिंदे",
        role: "ऊस व भाजीपाला उत्पादक शेतकरी",
        district: "नाशिक जिल्हा, महाराष्ट्र",
        farmSize: "८.० एकर",
        quote: "कृषीमित्रचे PDF अहवाल खूप सुंदर आणि अधिकृत आहेत. हा अहवाल मी थेट आमच्या सोसायटीत आणि कृषी सेवा केंद्रात दाखवून योग्य सल्ला घेतला.",
        rating: 5,
      },
    ],
    hi: [
      {
        name: "रमेश पाटिल",
        role: "सोयाबीन एवं कपास उत्पादक किसान",
        district: "पुणे जिला, महाराष्ट्र",
        farmSize: "५.० एकड़",
        quote: "कृषि-मित्र का खरीफ फसल उत्पादन अनुमान मेरे खेत के लिए बहुत सटीक रहा। मिट्टी की सलाह से खाद का सही प्रबंधन करने में बहुत मदद मिली।",
        rating: 5,
      },
      {
        name: "सुरेश देशमुख",
        role: "कपास एवं चना उत्पादक किसान",
        district: "नागपुर जिला, महाराष्ट्र",
        farmSize: "१२.५ एकड़",
        quote: "मृदा परीक्षण सिफारिश ने हमारी विदर्भ की काली मिट्टी के लिए सबसे उपयुक्त फसल सुझाई। लाइव मौसम के अनुमान से बेमौसम बारिश से पहले फसल प्रबंधन आसान हो गया।",
        rating: 5,
      },
      {
        name: "प्रिया शिंदे",
        role: "गन्ना एवं सब्जी उत्पादक किसान",
        district: "नासिक जिला, महाराष्ट्र",
        farmSize: "८.० एकड़",
        quote: "स्वचालित पीडीएफ रिपोर्ट बहुत साफ और आधिकारिक है। मैंने यह रिपोर्ट सीधे अपनी स्थानीय कृषि समिति में फसल सलाह के लिए उपयोग की।",
        rating: 5,
      },
    ],
  };

  const testimonials = localizedTestimonials[language] || localizedTestimonials.en;

  const localizedFaqs = {
    en: [
      {
        q: "How does KrushiMitra generate crop recommendations and yield predictions?",
        a: "KrushiMitra integrates regional agricultural data, soil chemistry records, and meteorological patterns across Maharashtra. It factors in district geography, seasonal rainfall, temperature, and farm acreage to provide actionable, farmer-friendly advisories.",
      },
      {
        q: "Is KrushiMitra free to use for farmers?",
        a: "Yes! KrushiMitra is completely free for all farmers, agricultural students, extension officers, and agronomists to generate predictions, run soil advisories, and export PDF reports.",
      },
      {
        q: "What districts and crops are supported?",
        a: "All 36 districts of Maharashtra are natively supported with localized meteorological data and multi-district yield calibrations across major crops including Cotton, Soybean, Sugarcane, Wheat, Gram, Rice, and Tur.",
      },
      {
        q: "Can I download and print the agricultural reports?",
        a: "Yes, you can generate and download formatted, high-resolution A4 PDF reports complete with your farm details, AI predictions, and guidance in 1-click.",
      },
    ],
    mr: [
      {
        q: "कृषीमित्र पीक शिफारस आणि उत्पादन अंदाज कसा तयार करते?",
        a: "कृषीमित्र महाराष्ट्रातील प्रादेशिक कृषी माहिती, माती परीक्षण घटक आणि हवामानाचा अभ्यास करून कार्य करते. जिल्हा, पाऊस, तापमान आणि जमिनीच्या क्षेत्रफळानुसार शेतकऱ्यांना सोपा व खात्रीशीर सल्ला दिला जातो.",
      },
      {
        q: "कृषीमित्र शेतकऱ्यांसाठी पूर्णपणे मोफत आहे का?",
        a: "होय! कृषीमित्र सर्व शेतकरी, कृषी पदवीधर, कृषी अधिकारी आणि संशोधकांसाठी उत्पादन अंदाज, माती सल्ला आणि PDF अहवाल डाऊनलोड करण्यासाठी पूर्णपणे मोफत आहे.",
      },
      {
        q: "कोणते जिल्हे आणि पिके समर्थित आहेत?",
        a: "महाराष्ट्रातील सर्व ३६ जिल्हे समर्थित आहेत. यामध्ये कापूस, सोयाबीन, ऊस, गहू, हरभरा, भात आणि तूर या प्रमुख पिकांचा समावेश आहे.",
      },
      {
        q: "मी शेतीचे अहवाल डाउनलोड आणि प्रिंट करू शकतो का?",
        a: "होय, तुम्ही १-क्लिक मध्ये शेताची माहिती, उत्पादन अंदाज आणि कृषी सल्ल्याचा सुंदर A4 PDF अहवाल डाउनलोड आणि प्रिंट करू शकता.",
      },
    ],
    hi: [
      {
        q: "कृषि-मित्र फसल सिफारिश और उत्पादन अनुमान कैसे तैयार करता है?",
        a: "कृषि-मित्र महाराष्ट्र के क्षेत्रीय कृषि आंकड़ों, मिट्टी के पोषक तत्वों और मौसम की जानकारी का विश्लेषण करता है। यह जिले, वर्षा, तापमान और खेत के क्षेत्रफल के आधार पर सटीक और उपयोगी सलाह देता है।",
      },
      {
        q: "क्या कृषि-मित्र किसानों के लिए पूरी तरह से मुफ्त है?",
        a: "हाँ! कृषि-मित्र सभी किसान भाइयों, कृषि छात्रों और सलाहकारों के लिए पूर्वानुमान, मृदा सलाह और पीडीएफ रिपोर्ट डाउनलोड करने के लिए बिल्कुल मुफ्त है।",
      },
      {
        q: "कौन से जिले और फसलें समर्थित हैं?",
        a: "महाराष्ट्र के सभी 36 जिले समर्थित हैं। इसमें कपास, सोयाबीन, गन्ना, गेहूं, चना, धान और अरहर जैसी मुख्य फसलें शामिल हैं।",
      },
      {
        q: "क्या मैं कृषि रिपोर्ट डाउनलोड और प्रिंट कर सकता हूँ?",
        a: "हाँ, आप १-क्लिक में अपने खेत के विवरण, फसल अनुमान और मार्गदर्शन की उच्च-गुणवत्ता वाली A4 PDF रिपोर्ट डाउनलोड और प्रिंट कर सकते हैं।",
      },
    ],
  };

  const faqs = localizedFaqs[language] || localizedFaqs.en;

  return (
    <div className="min-h-screen bg-[#F6F8F4] dark:bg-[#0D1710] text-[#17291A] dark:text-[#F8FAFC] selection:bg-[#2E7D32] selection:text-white transition-colors duration-300">
      {/* =========================================================
          1. HEADER / NAVIGATION BAR
         ========================================================= */}
      <header className="sticky top-0 z-50 border-b border-[#DCE8D9] dark:border-[#24402A] bg-white/90 dark:bg-[#132218]/90 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* BRAND LOGO */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="km-morph-icon flex h-11 w-11 items-center justify-center bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#10B981] text-white shadow-md transition-transform duration-300 group-hover:scale-110">
              <Sprout size={24} strokeWidth={2.4} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-[#1B5E20] dark:text-[#4ADE80]">
                KrushiMitra
              </span>
              <p className="text-[10px] font-bold tracking-wider text-[#55715A] dark:text-[#A3B899] uppercase">
                {t("aiAgriculture") || "Smart Agriculture Assistant"}
              </p>
            </div>
          </div>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-gray-600 dark:text-gray-300">
            <a
              href="#features"
              className="transition hover:text-[#2E7D32] dark:hover:text-[#4ADE80] hover:-translate-y-0.5"
            >
              {t("landingSolutions") || "Solutions"}
            </a>
            <a
              href="#simulator"
              className="transition hover:text-[#2E7D32] dark:hover:text-[#4ADE80] hover:-translate-y-0.5"
            >
              Live Demo
            </a>
            <a
              href="#how-it-works"
              className="transition hover:text-[#2E7D32] dark:hover:text-[#4ADE80] hover:-translate-y-0.5"
            >
              {t("landingHowItWorks") || "How It Works"}
            </a>
            <a
              href="#crops"
              className="transition hover:text-[#2E7D32] dark:hover:text-[#4ADE80] hover:-translate-y-0.5"
            >
              {t("landingSupportedCrops") || "Supported Crops"}
            </a>
            <a
              href="#testimonials"
              className="transition hover:text-[#2E7D32] dark:hover:text-[#4ADE80] hover:-translate-y-0.5"
            >
              {t("landingFarmers") || "Farmers"}
            </a>
            <a
              href="#faq"
              className="transition hover:text-[#2E7D32] dark:hover:text-[#4ADE80] hover:-translate-y-0.5"
            >
              {t("landingFaq") || "FAQ"}
            </a>
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2.5">
            {/* LANGUAGE SELECTOR */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="key-cap text-xs py-1.5 px-2.5 font-bold cursor-pointer bg-white dark:bg-[#183321] border-[#DCE8D9] dark:border-[#24402A] text-gray-700 dark:text-gray-200"
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
              className="key-cap p-2 text-gray-600 dark:text-gray-300 hover:text-[#2E7D32] dark:hover:text-[#4ADE80] cursor-pointer transition-transform hover:scale-105"
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
                className="btn-shimmer flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-4 py-2 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <span>{t("dashboard") || "Dashboard"}</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => nav?.("login")}
                  className="key-cap hidden sm:flex items-center gap-1 text-xs py-2 px-3.5 font-bold text-gray-700 dark:text-gray-200 hover:text-[#2E7D32] dark:hover:text-[#4ADE80] cursor-pointer"
                >
                  <span>{t("signIn") || "Sign In"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => nav?.("register")}
                  className="btn-shimmer btn-glow flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-4 py-2 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95 cursor-pointer"
                >
                  <span>{t("getStarted") || "Get Started"}</span>
                  <ArrowRight size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================
      {/* =========================================================
          2. HERO SECTION WITH VIBRANT ANIMATED BADGE & ZOOM HERO IMAGE
         ========================================================= */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-24 animate-zoom-fade-hero">
        {/* Ambient Glow Orbs with Morphing */}
        <div className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-emerald-400/20 dark:bg-emerald-500/15 blur-3xl km-morph-icon" />
        <div className="pointer-events-none absolute -right-20 top-20 h-96 w-96 rounded-full bg-green-400/20 dark:bg-teal-500/15 blur-3xl km-morph-icon" style={{ animationDelay: "-3s" }} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* LEFT HERO CONTENT */}
            <div className="space-y-6 lg:col-span-6 text-left">
              {/* TOP BADGE - EXPLICIT HIGH CONTRAST IN DARK AND LIGHT */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/50 dark:border-emerald-500/60 bg-emerald-50 dark:bg-[#183321] px-4 py-1.5 text-xs font-black shadow-md backdrop-blur-md transition-all hover:scale-105">
                <Sparkles size={14} className="text-emerald-700 dark:text-[#4ADE80] animate-spin" />
                <span className="text-emerald-900 dark:text-[#4ADE80] font-extrabold tracking-wide">
                  {t("heroBadge") || "Smart Farming & AI Agriculture Assistant"}
                </span>
              </div>

              {/* MAIN HERO HEADLINE WITH ANIMATED GRADIENT & ACCENTS */}
              <div className="relative">
                <h1 className="text-3xl font-black tracking-tight text-[#172B18] dark:text-white sm:text-5xl lg:text-[52px] leading-[1.15]">
                  <span className="inline-block transition-transform hover:scale-[1.01]">
                    {t("heroTitlePart1") || "Empowering Farmers with"}
                  </span>{" "}
                  <span className="block mt-1 sm:mt-2 relative">
                    <span className="bg-gradient-to-r from-[#1B5E20] via-[#10B981] to-[#2E7D32] dark:from-[#4ADE80] dark:via-[#34D399] dark:to-[#22C55E] bg-clip-text text-transparent drop-shadow-xs animate-[km-pulse-glow_4s_ease-in-out_infinite]">
                      {t("heroTitlePart2") || "Smart AI Agriculture"}
                    </span>
                    {/* Animated Accent Underline */}
                    <span className="block h-1.5 w-32 sm:w-48 rounded-full bg-gradient-to-r from-[#2E7D32] via-[#10B981] to-transparent mt-2 opacity-80" />
                  </span>
                </h1>
              </div>

              {/* VALUE PROPOSITION SUBTITLE (SIMPLE & CLEAR LANGUAGE) */}
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl font-medium">
                {t("heroSubtitle") || "Get smart crop recommendations, accurate harvest yield predictions, live local weather updates, and easy-to-download farm PDF reports."}
              </p>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => (user ? nav?.("prediction") : nav?.("register"))}
                  className="btn-shimmer btn-glow flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl active:scale-95 cursor-pointer"
                >
                  <Sprout size={18} />
                  <span>{t("startFreePrediction") || "Start Free Prediction"}</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo("farmer")}
                  disabled={demoLoading}
                  className="key-cap flex items-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-[#2E7D32] dark:hover:text-[#4ADE80] cursor-pointer transition-transform hover:scale-105"
                >
                  <Wheat size={18} className="text-[#2E7D32] dark:text-[#4ADE80]" />
                  <span>{demoLoading ? t("loading") : (t("quickDemoLogin") || "1-Click Demo Login")}</span>
                </button>
              </div>
            </div>

            {/* RIGHT HERO IMAGE WITH ZOOM-IN & FLOATING METRIC CARDS */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* HERO IMAGE CONTAINER WITH ZOOM-IN ON HOVER */}
                <div className="overflow-hidden rounded-3xl border border-[#DCE8D9] dark:border-[#24402A] shadow-2xl bg-gradient-to-br from-emerald-100 to-green-50 dark:from-emerald-950/40 dark:to-green-950/20 group">
                  <img
                    src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1200&auto=format&fit=crop"
                    alt="Smart Farming & Precision Agriculture"
                    className="h-80 sm:h-96 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none rounded-3xl" />
                </div>

                {/* FLOATING CARD 1: CROP YIELD FORECAST */}
                <div className="absolute -top-4 -left-4 sm:-left-6 rounded-2xl glass-panel p-3.5 shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-[km-float_4s_ease-in-out_infinite]">
                  <div className="flex items-center gap-2.5">
                    <div className="km-morph-icon flex h-9 w-9 items-center justify-center bg-emerald-100 dark:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300">
                      <TrendingUp size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400">{t("yieldForecast") || "Yield Forecast"}</p>
                      <p className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                        3.42 t/ha <span className="text-[10px] text-gray-400 font-normal">(Soybean)</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* FLOATING CARD 2: OPTIMAL CROP RECOMMENDATION */}
                <div className="absolute -bottom-4 -right-4 sm:-right-6 rounded-2xl glass-panel p-3.5 shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-[km-float_4.5s_ease-in-out_infinite_1s]">
                  <div className="flex items-center gap-2.5">
                    <div className="km-morph-icon flex h-9 w-9 items-center justify-center bg-green-100 dark:bg-green-900/80 text-green-700 dark:text-green-300">
                      <Sprout size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400">{t("optimalMatch") || "Optimal Crop"}</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white">
                        🌱 Cotton (Bt Hybrid) <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">95.2%</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* FLOATING CARD 3: LIVE CLIMATE BADGE */}
                <div className="absolute bottom-4 left-4 rounded-xl bg-black/65 backdrop-blur-md px-3.5 py-1.5 text-white flex items-center gap-2 text-xs font-semibold shadow-md">
                  <CloudSun size={15} className="text-amber-400" />
                  <span>28°C • {t("sowingWindow") || "Optimal Kharif Sowing Window"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURED VISUAL SLIDER WITH ZOOM-FADE KEN BURNS
         ========================================================= */}
      <ZoomFadeReveal delay={50} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16">
        <div className="overflow-hidden rounded-3xl border border-[#DCE8D9] dark:border-[#24402A] shadow-2xl">
          <ImageSlider onSlideAction={(action) => nav?.(action)} />
        </div>
      </ZoomFadeReveal>

      {/* =========================================================
          3. DYNAMIC LIVE AI ENGINE & WEATHER SIMULATOR WIDGET
         ========================================================= */}
      <section id="simulator" className="py-16 bg-[#EAF3E6]/40 dark:bg-[#112015]/40 border-y border-[#DCE8D9] dark:border-[#24402A]">
        <ZoomFadeReveal delay={80} className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#172B18] dark:text-white">
              {t("simHeader") || "Live Agricultural Telemetry & Crop Forecast"}
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              {t("simSub") || "Real-time crop yield models, soil nutrient profiling, and live weather conditions."}
            </p>
          </div>

          {/* SIMULATOR CARD WITH GLASSMORPHISM */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-200/70 dark:border-emerald-800/60">
            {/* TABS HEADER */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200/60 dark:border-gray-700/60 pb-5 mb-6">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("yield")}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 cursor-pointer ${
                    activeTab === "yield"
                      ? "bg-[#2E7D32] text-white shadow-md scale-105"
                      : "key-cap text-gray-600 dark:text-gray-300 hover:text-[#2E7D32]"
                  }`}
                >
                  <TrendingUp size={15} />
                  <span>{t("yieldPredictorTab") || "Yield Predictor"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("soil")}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 cursor-pointer ${
                    activeTab === "soil"
                      ? "bg-[#2E7D32] text-white shadow-md scale-105"
                      : "key-cap text-gray-600 dark:text-gray-300 hover:text-[#2E7D32]"
                  }`}
                >
                  <Sprout size={15} />
                  <span>{t("soilAdvisoryTab") || "Soil Advisory"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("weather");
                    if (!weatherData.isLiveGps) {
                      fetchLiveLocationWeather();
                    }
                  }}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 cursor-pointer ${
                    activeTab === "weather"
                      ? "bg-[#2E7D32] text-white shadow-md scale-105"
                      : "key-cap text-gray-600 dark:text-gray-300 hover:text-[#2E7D32]"
                  }`}
                >
                  <CloudSun size={15} />
                  <span>{t("liveWeatherTab") || "Live Weather"}</span>
                </button>
              </div>

              <span className="key-cap text-[11px] py-1 px-3 bg-[#E5F7EA] dark:bg-[#183321] text-[#2E7D32] dark:text-[#4ADE80] flex items-center gap-1">
                <Activity size={13} className="animate-pulse" /> {t("liveTelemetry") || "Live Telemetry"}
              </span>
            </div>

            {/* TAB 1: YIELD PREDICTOR SIMULATOR */}
            {activeTab === "yield" && (
              <div className="grid gap-6 sm:grid-cols-12 items-center animate-pop">
                <div className="sm:col-span-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                      {language === "mr" ? "पीक निवडा:" : language === "hi" ? "फसल चुनें:" : "Select Crop:"}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: "Soybean", icon: "🌱" },
                        { key: "Cotton", icon: "☁️" },
                        { key: "Sugarcane", icon: "🎋" },
                        { key: "Wheat", icon: "🌾" },
                        { key: "Gram", icon: "🥔" },
                        { key: "Tur", icon: "🌿" },
                        { key: "Rice", icon: "🌾" },
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setSimCrop(item.key)}
                          className={`p-2 rounded-xl text-xs font-bold text-left transition-all duration-300 cursor-pointer border ${
                            simCrop === item.key
                              ? "border-[#2E7D32] bg-[#EAF3E6] dark:bg-[#183321] text-[#1B5E20] dark:text-[#4ADE80] scale-102 shadow-xs"
                              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-[#2E7D32]"
                          }`}
                        >
                          {item.icon} {tCrop ? tCrop(item.key) : item.key}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                        {t("district") || "District"}:
                      </label>
                      <select
                        value={simDistrict}
                        onChange={(e) => setSimDistrict(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-xs font-bold text-gray-700 dark:text-gray-200"
                      >
                        <option value="Pune">📍 {language === "mr" ? "पुणे" : language === "hi" ? "पुणे" : "Pune"}</option>
                        <option value="Nagpur">📍 {language === "mr" ? "नागपूर" : language === "hi" ? "नागपुर" : "Nagpur"}</option>
                        <option value="Nashik">📍 {language === "mr" ? "नाशिक" : language === "hi" ? "नासिक" : "Nashik"}</option>
                        <option value="Kolhapur">📍 {language === "mr" ? "कोल्हापूर" : language === "hi" ? "कोल्हापुर" : "Kolhapur"}</option>
                        <option value="Solapur">📍 {language === "mr" ? "सोलापूर" : language === "hi" ? "सोलापुर" : "Solapur"}</option>
                        <option value="Amravati">📍 {language === "mr" ? "अमरावती" : language === "hi" ? "अमरावती" : "Amravati"}</option>
                        <option value="Aurangabad">📍 {language === "mr" ? "छत्रपती संभाजीनगर" : language === "hi" ? "छत्रपति संभाजीनगर" : "Chhatrapati Sambhajinagar"}</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                        {language === "mr" ? "शेती क्षेत्र" : language === "hi" ? "खेत का क्षेत्रफल" : "Cultivated Land"}: {simArea} {language === "mr" ? "हेक्टर" : language === "hi" ? "हेक्टेयर" : "ha"}
                      </label>
                      <input
                        type="range"
                        min="1.0"
                        max="10.0"
                        step="0.5"
                        value={simArea}
                        onChange={(e) => setSimArea(e.target.value)}
                        className="w-full accent-[#2E7D32] cursor-pointer mt-2"
                      />
                    </div>
                  </div>
                </div>

                {/* CALCULATED OUTPUT PANEL WITH SHAPE MORPHISM */}
                <div className="sm:col-span-6 rounded-3xl bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#10B981] p-6 text-white shadow-xl space-y-4 transition-transform hover:scale-[1.02] duration-300">
                  <div className="flex items-center justify-between border-b border-white/20 pb-3">
                    <span className="text-xs font-bold text-green-100 uppercase tracking-wider">
                      {t("predictedYieldBanner") || "Predicted Crop Yield Output"}
                    </span>
                    <span className="text-[10px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
                      {simDistrict} • {tCrop ? tCrop(simCrop) : simCrop}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-3xl sm:text-4xl font-black text-white">
                      {simYieldResult.yieldPerHa} {language === "mr" ? "टन/हेक्टर" : language === "hi" ? "टन/हेक्टेयर" : "t/ha"}
                    </p>
                    <p className="text-xs text-green-100">
                      {t("totalHarvest") || "Total Farm Harvest"}: <span className="font-extrabold text-white">{simYieldResult.totalProduction} {language === "mr" ? "टन" : language === "hi" ? "टन" : "Tonnes"}</span> ({language === "mr" ? "क्षेत्र" : language === "hi" ? "क्षेत्रफल" : "across"} {simArea} {language === "mr" ? "हेक्टर" : language === "hi" ? "हेक्टेयर" : "ha"})
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                    <div className="rounded-xl bg-white/10 p-2.5 backdrop-blur-xs">
                      <p className="text-[10px] text-green-200 font-semibold">{language === "mr" ? "उत्पादन अचूकता" : language === "hi" ? "उत्पादन सटीकता" : "Yield Calibration"}</p>
                      <p className="font-extrabold text-white mt-0.5">{simYieldResult.status}</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-2.5 backdrop-blur-xs">
                      <p className="text-[10px] text-green-200 font-semibold">{t("suitabilityFactor") || "Regional Suitability"}</p>
                      <p className="font-extrabold text-white mt-0.5">{simYieldResult.confidence}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => (user ? nav?.("prediction") : nav?.("register"))}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-white py-2.5 text-xs font-bold text-[#1B5E20] shadow-md hover:bg-[#F7FFF5] transition cursor-pointer hover:scale-102"
                  >
                    <span>{t("estimateHarvestYield") || "Estimate Harvest Yield with Real Farm Data"}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: SOIL ADVISORY SIMULATOR */}
            {activeTab === "soil" && (
              <div className="space-y-6 animate-pop">
                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="glass-step-card rounded-2xl p-4">
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-gray-600 dark:text-gray-300">{t("nitrogen") || "Nitrogen (N)"}</span>
                      <span className="text-[#2E7D32] dark:text-[#4ADE80] font-black">{soilN} kg/ha</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="140"
                      value={soilN}
                      onChange={(e) => setSoilN(Number(e.target.value))}
                      className="w-full accent-[#2E7D32] cursor-pointer"
                    />
                  </div>

                  <div className="glass-step-card rounded-2xl p-4">
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-gray-600 dark:text-gray-300">{t("phosphorus") || "Phosphorus (P)"}</span>
                      <span className="text-[#2E7D32] dark:text-[#4ADE80] font-black">{soilP} kg/ha</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={soilP}
                      onChange={(e) => setSoilP(Number(e.target.value))}
                      className="w-full accent-[#2E7D32] cursor-pointer"
                    />
                  </div>

                  <div className="glass-step-card rounded-2xl p-4">
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-gray-600 dark:text-gray-300">{t("potassium") || "Potassium (K)"}</span>
                      <span className="text-[#2E7D32] dark:text-[#4ADE80] font-black">{soilK} kg/ha</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="80"
                      value={soilK}
                      onChange={(e) => setSoilK(Number(e.target.value))}
                      className="w-full accent-[#2E7D32] cursor-pointer"
                    />
                  </div>

                  <div className="glass-step-card rounded-2xl p-4">
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-gray-600 dark:text-gray-300">{t("soilPh") || "Soil pH"}</span>
                      <span className="text-[#2E7D32] dark:text-[#4ADE80] font-black">{soilPh} pH</span>
                    </div>
                    <input
                      type="range"
                      min="5.0"
                      max="8.5"
                      step="0.1"
                      value={soilPh}
                      onChange={(e) => setSoilPh(Number(e.target.value))}
                      className="w-full accent-[#2E7D32] cursor-pointer"
                    />
                  </div>
                </div>

                {/* ADVISORY RESULT CARD */}
                <div className="rounded-2xl glass-panel p-5 border border-emerald-300 dark:border-emerald-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                  <div className="flex items-center gap-3.5 text-left">
                    <div className="km-morph-icon flex h-12 w-12 items-center justify-center bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white text-2xl shadow-md">
                      🌱
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-[#1B5E20] dark:text-[#4ADE80]">
                          {t("recommendedCropBanner") || "Recommended Crop"}: {tCrop ? tCrop(soilRecResult.crop) : soilRecResult.crop}
                        </h4>
                        <span className="rounded-full bg-emerald-100 dark:bg-[#183321] px-2.5 py-0.5 text-[10px] font-extrabold text-[#1B5E20] dark:text-[#4ADE80]">
                          {language === "mr" ? "योग्य पीक" : language === "hi" ? "उपयुक्त फसल" : "Optimal Match"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                        {soilRecResult.suitability}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => (user ? nav?.("recommendation") : nav?.("register"))}
                    className="btn-shimmer shrink-0 rounded-xl bg-[#2E7D32] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1B5E20] transition cursor-pointer hover:scale-105"
                  >
                    {t("findOptimalCrop") || "Find Optimal Crop"}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: DYNAMIC REAL-TIME WEATHER TELEMETRY (LIVE LOCATION ACCESS) */}
            {activeTab === "weather" && (
              <div className="space-y-5 animate-pop">
                {/* LIVE LOCATION BAR */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl glass-panel p-3.5 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-200">
                    <MapPin size={16} className="text-[#2E7D32] dark:text-[#4ADE80]" />
                    <span>{t("location") || "Location"}: <span className="text-[#1B5E20] dark:text-[#4ADE80] font-black">{weatherData.location}</span></span>
                    {weatherData.isLiveGps && (
                      <span className="rounded-full bg-emerald-100 dark:bg-[#183321] px-2 py-0.5 text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300">
                        ● GPS Live
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={fetchLiveLocationWeather}
                      disabled={weatherLoading}
                      className="flex items-center gap-1 rounded-xl bg-[#2E7D32] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#1B5E20] transition cursor-pointer hover:scale-105"
                    >
                      <RefreshCw size={13} className={weatherLoading ? "animate-spin" : ""} />
                      <span>{weatherLoading ? (t("locating") || "Locating...") : (t("useMyLiveLocation") || "📍 Use My Live Location")}</span>
                    </button>

                    <select
                      onChange={(e) => fallbackDistrictWeather(e.target.value)}
                      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1.5 text-xs font-bold text-gray-700 dark:text-gray-200 cursor-pointer"
                    >
                      <option value="Pune">{t("selectDistrict") || "Select District"}</option>
                      {["Pune", "Nagpur", "Nashik", "Chhatrapati Sambhajinagar", "Kolhapur", "Amravati", "Solapur", "Latur", "Satara", "Jalgaon", "Nanded", "Ahmednagar"].map((d) => (
                        <option key={d} value={d}>
                          {tDistrict ? tDistrict(d) : d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* LIVE METEOROLOGICAL METRICS */}
                <div className="grid gap-4 sm:grid-cols-4 text-center">
                  <div className="rounded-2xl glass-panel border border-amber-200 dark:border-amber-800 p-4 transition-transform hover:scale-105">
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300">{t("liveTemperature") || "Live Temperature"}</span>
                    <p className="text-2xl font-black text-amber-900 dark:text-amber-100 mt-1">{weatherData.temp}°C</p>
                    <p className="text-[10px] text-amber-700 dark:text-amber-300 mt-0.5">{weatherData.condition}</p>
                  </div>
                  <div className="rounded-2xl glass-panel border border-blue-200 dark:border-blue-800 p-4 transition-transform hover:scale-105">
                    <span className="text-xs font-bold text-blue-800 dark:text-blue-300">{t("relativeHumidity") || "Relative Humidity"}</span>
                    <p className="text-2xl font-black text-blue-900 dark:text-blue-100 mt-1">{weatherData.humidity}%</p>
                    <p className="text-[10px] text-blue-700 dark:text-blue-300 mt-0.5">{t("atmosphericMoisture") || "Atmospheric Moisture"}</p>
                  </div>
                  <div className="rounded-2xl glass-panel border border-teal-200 dark:border-teal-800 p-4 transition-transform hover:scale-105">
                    <span className="text-xs font-bold text-teal-800 dark:text-teal-300">{t("windVelocity") || "Wind Velocity"}</span>
                    <p className="text-2xl font-black text-teal-900 dark:text-teal-100 mt-1">{weatherData.wind} km/h</p>
                    <p className="text-[10px] text-teal-700 dark:text-teal-300 mt-0.5">{t("breezeVelocity") || "Breeze Velocity"}</p>
                  </div>
                  <div className="rounded-2xl glass-panel border border-green-200 dark:border-green-800 p-4 transition-transform hover:scale-105">
                    <span className="text-xs font-bold text-green-800 dark:text-green-300">{t("farmingStatus") || "Farming Status"}</span>
                    <p className="text-xs font-black text-green-900 dark:text-green-100 mt-2">{weatherData.advice}</p>
                    <p className="text-[10px] text-green-700 dark:text-green-300 mt-0.5">{t("openWeatherTelemetry") || "OpenWeather Telemetry"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ZoomFadeReveal>
      </section>

      {/* =========================================================
          4. CORE PLATFORM SOLUTIONS (FEATURES) WITH ZOOM-IN
         ========================================================= */}
      <section id="features" className="py-16 sm:py-24">
        <ZoomFadeReveal delay={60} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="key-cap text-xs py-1.5 px-4 bg-white/80 dark:bg-[#183321]/80 backdrop-blur-md text-[#2E7D32] dark:text-[#4ADE80] border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
              🌾 Agricultural Intelligence
            </span>
            <h2 className="mt-3.5 text-2xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              {t("solutionsHeader") || "Smart Tools for Better Farming"}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {t("solutionsSub") || "Simple, easy-to-use AI tools to help you pick the best crops, forecast harvest output, and check live weather for your farm."}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <ZoomFadeReveal key={i} delay={i * 80} className="h-full">
                  <div
                    onClick={() => handleFeatureClick(f.action)}
                    className="glass-step-card rounded-3xl p-6 shadow-sm zoom-fade-hover cursor-pointer group flex flex-col justify-between relative overflow-hidden h-full"
                  >
                    {/* Subtle Corner Glow */}
                    <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-emerald-400/10 dark:bg-emerald-500/10 pointer-events-none group-hover:scale-125 transition-transform duration-500" />

                    <div>
                      <div className="flex items-center justify-between">
                        <div className={`km-morph-icon flex h-13 w-13 items-center justify-center ${f.bg} ${f.accent} shadow-sm group-hover:rotate-6 transition-all`}>
                          <Icon size={24} />
                        </div>
                        <span className="key-cap text-[10px] py-1 px-3 bg-white/80 dark:bg-[#183321]/80 backdrop-blur-xs">
                          {f.tag}
                        </span>
                      </div>

                      <h3 className="mt-5 text-base font-black text-gray-900 dark:text-white group-hover:text-[#2E7D32] dark:group-hover:text-[#4ADE80] transition-colors">
                        {f.title}
                      </h3>

                      <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                        {f.desc}
                      </p>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between text-xs font-bold text-[#2E7D32] dark:text-[#4ADE80]">
                      <span>Explore Tool</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </ZoomFadeReveal>
              );
            })}
          </div>
        </ZoomFadeReveal>
      </section>

      {/* =========================================================
          5. HOW IT WORKS (GLASSMORPHISM & SHAPE MORPHISM 3-STEP PIPELINE)
         ========================================================= */}
      <section id="how-it-works" className="relative overflow-hidden py-20 bg-gradient-to-b from-[#EAF3E6]/60 via-[#F6F8F4] to-[#EAF3E6]/60 dark:from-[#112015]/60 dark:via-[#0D1710] dark:to-[#112015]/60 border-y border-[#DCE8D9] dark:border-[#24402A]">
        {/* Ambient Morphing Background Blobs */}
        <div className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-emerald-400/15 dark:bg-emerald-500/10 blur-3xl km-morph-icon" />
        <div className="pointer-events-none absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-teal-400/15 dark:bg-teal-500/10 blur-3xl km-morph-icon" style={{ animationDelay: "-4s" }} />

        <ZoomFadeReveal delay={60} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="key-cap text-xs py-1.5 px-4 bg-white/80 dark:bg-[#183321]/80 backdrop-blur-md text-[#2E7D32] dark:text-[#4ADE80] border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
              🌱 Simple & Streamlined Process
            </span>
            <h2 className="mt-3.5 text-2xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              {t("howItWorksHeading") || "How KrushiMitra Works in 3 Simple Steps"}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Follow three easy steps to get instant agronomic advisory for your land.
            </p>
          </div>

          {/* STEPS CONTAINER WITH CONNECTING BEAM */}
          <div className="relative">
            {/* DESKTOP ANIMATED CONNECTING BEAM LINE */}
            <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-1 -translate-y-6 rounded-full step-beam-connector opacity-70 pointer-events-none z-0" />

            <div className="relative z-10 grid gap-6 sm:grid-cols-3">
              {workflowSteps.map((step, idx) => {
                const Icon = step.icon;
                const isSelected = activeStep === idx;
                return (
                  <ZoomFadeReveal key={idx} delay={idx * 100} className="h-full">
                    <div
                      onClick={() => setActiveStep(idx)}
                      className={`glass-step-card rounded-3xl p-7 relative overflow-hidden cursor-pointer group zoom-fade-hover h-full ${
                        isSelected
                          ? "border-[#2E7D32] dark:border-[#4ADE80] ring-2 ring-[#2E7D32]/20 dark:ring-[#4ADE80]/30 shadow-2xl -translate-y-2 scale-102"
                          : "border-[#DCE8D9] dark:border-[#24402A]"
                      }`}
                    >
                      {/* Top Specular Glow Corner */}
                      <div className="absolute top-0 right-0 h-28 w-28 rounded-bl-full bg-gradient-to-bl from-emerald-400/10 via-green-300/5 to-transparent pointer-events-none group-hover:scale-125 transition-transform duration-500" />

                      <div className="flex items-center justify-between">
                        {/* SHAPE MORPHISM ICON CAPSULE */}
                        <div
                          className={`km-morph-icon flex h-14 w-14 items-center justify-center text-white shadow-md transition-transform duration-500 group-hover:rotate-6 ${
                            isSelected
                              ? "bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#10B981] shadow-emerald-900/30"
                              : "bg-gradient-to-br from-[#2E7D32] to-[#10B981]"
                          }`}
                        >
                          <Icon size={24} strokeWidth={2.2} />
                        </div>

                        {/* STEP NUMBER BADGE WITH MORPHING PILL */}
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-2xl font-black transition-colors duration-300 ${
                              isSelected
                                ? "text-[#1B5E20] dark:text-[#4ADE80]"
                                : "text-emerald-300 dark:text-emerald-700/80 group-hover:text-emerald-500"
                            }`}
                          >
                            {step.num}
                          </span>
                        </div>
                      </div>

                      <h3 className="mt-6 text-base sm:text-lg font-black text-gray-900 dark:text-white group-hover:text-[#1B5E20] dark:group-hover:text-[#4ADE80] transition-colors">
                        {step.title}
                      </h3>

                      <p className="mt-2.5 text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                        {step.desc}
                      </p>

                      <div className="mt-5 pt-3.5 border-t border-gray-200/70 dark:border-gray-700/60 flex items-center justify-between text-[11px] font-bold text-[#1B5E20] dark:text-[#4ADE80]">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-[#2E7D32] dark:text-[#4ADE80]" />
                          <span>{step.highlight}</span>
                        </span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </ZoomFadeReveal>
                );
              })}
            </div>
          </div>

          {/* ACTIVE STEP INTERACTIVE SUMMARY DRAWER */}
          <div className="mt-8 mx-auto max-w-3xl glass-panel rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border border-emerald-200/80 dark:border-emerald-800/60 shadow-lg animate-zoom-fade-card">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white font-black text-xs shadow-xs">
                {workflowSteps[activeStep].num}
              </span>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{workflowSteps[activeStep].title}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{workflowSteps[activeStep].highlight}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleTryStep(activeStep)}
              className="btn-shimmer flex items-center gap-1.5 rounded-xl bg-[#2E7D32] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#1B5E20] transition cursor-pointer hover:scale-105"
            >
              <span>Try Step {workflowSteps[activeStep].num} Now</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </ZoomFadeReveal>
      </section>

      {/* =========================================================
          6. SUPPORTED MODEL CROPS ONLY (WITH CATEGORY FILTER & ZOOM CARDS)
         ========================================================= */}
      <section id="crops" className="py-16 sm:py-20">
        <ZoomFadeReveal delay={60} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="key-cap text-xs py-1.5 px-4 bg-white/80 dark:bg-[#183321]/80 backdrop-blur-md text-[#2E7D32] dark:text-[#4ADE80] border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
            🌱 Supported Crops
          </span>
          <h2 className="mt-3.5 text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            {t("supportedCropsHeading") || "Supported Maharashtra Crops"}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            {t("supportedCropsSub") || "Accurate predictions for major crops grown across Maharashtra farms."}
          </p>

          {/* INTERACTIVE CATEGORY FILTER SLIDER TABS */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "all", label: "🌾 All Crops" },
              { id: "kharif", label: "🌧️ Kharif (Monsoon)" },
              { id: "rabi", label: "❄️ Rabi (Winter)" },
              { id: "cash", label: "💰 Cash Crops" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCropCategory(cat.id)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 cursor-pointer ${
                  cropCategory === cat.id
                    ? "bg-[#2E7D32] text-white shadow-md scale-105"
                    : "key-cap text-gray-600 dark:text-gray-300 hover:text-[#2E7D32]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 7 MODEL CROPS GRID WITH ZOOM-IN CARDS */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {filteredCrops.map((c, i) => (
              <ZoomFadeReveal key={i} delay={i * 50} className="h-full">
                <div
                  className="glass-step-card rounded-3xl p-5 text-left shadow-sm zoom-fade-hover flex flex-col justify-between relative overflow-hidden h-full"
                >
                  {/* Specular Glow Corner */}
                  <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-full bg-emerald-400/10 dark:bg-emerald-500/10 pointer-events-none group-hover:scale-125 transition-transform" />

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl km-morph-icon inline-block">{c.icon}</span>
                      <span className="key-cap text-[10px] py-0.5 px-2.5 bg-[#E5F7EA] dark:bg-[#183321] text-[#2E7D32] dark:text-[#4ADE80]">
                        {c.badge}
                      </span>
                    </div>

                    <h4 className="mt-4 text-base font-black text-gray-900 dark:text-white flex items-center justify-between">
                      <span>{c.name}</span>
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
                        {language === "mr" ? c.marathiName : language === "hi" ? c.hindiName : ""}
                      </span>
                    </h4>

                    <div className="mt-3 space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <p className="flex items-center gap-1.5">
                        🌱 <span className="font-semibold text-gray-700 dark:text-gray-200">{c.soil}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        📈 Expected: <span className="font-bold text-[#2E7D32] dark:text-[#4ADE80]">{c.yieldRange}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-gray-700/60 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 size={12} /> {c.season}
                  </div>
                </div>
              </ZoomFadeReveal>
            ))}
          </div>
        </ZoomFadeReveal>
      </section>

      {/* =========================================================
          7. FARMER TESTIMONIALS WITH INTERACTIVE CAROUSEL SLIDER & ZOOM
         ========================================================= */}
      <section id="testimonials" className="py-16 bg-[#EAF3E6]/30 dark:bg-[#112015]/30 border-t border-[#DCE8D9] dark:border-[#24402A]">
        <ZoomFadeReveal delay={60} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
            <div className="text-left">
              <span className="key-cap text-xs py-1.5 px-4 bg-white/80 dark:bg-[#183321]/80 backdrop-blur-md text-[#2E7D32] dark:text-[#4ADE80] border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
                ⭐ Farmer Experiences
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                {t("farmerTestimonialsHeading") || "Trusted by Fellow Farmers"}
              </h2>
            </div>

            {/* CAROUSEL SLIDER CONTROLS */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setTestimonialIndex(
                    (prev) => (prev - 1 + testimonials.length) % testimonials.length
                  )
                }
                className="key-cap p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:text-[#2E7D32] dark:hover:text-[#4ADE80] cursor-pointer transition-transform hover:scale-110"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() =>
                  setTestimonialIndex((prev) => (prev + 1) % testimonials.length)
                }
                className="key-cap p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:text-[#2E7D32] dark:hover:text-[#4ADE80] cursor-pointer transition-transform hover:scale-110"
                aria-label="Next Testimonial"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* TESTIMONIAL CARDS WITH ZOOM AND CAROUSEL HIGHLIGHT */}
          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((test, idx) => {
              const isCurrent = testimonialIndex === idx;
              return (
                <ZoomFadeReveal key={idx} delay={idx * 80} className="h-full">
                  <div
                    onClick={() => setTestimonialIndex(idx)}
                    className={`glass-step-card rounded-3xl p-6 flex flex-col justify-between shadow-sm cursor-pointer zoom-fade-hover h-full ${
                      isCurrent
                        ? "border-[#2E7D32] dark:border-[#4ADE80] ring-2 ring-[#2E7D32]/20 dark:ring-[#4ADE80]/30 shadow-2xl scale-103 -translate-y-2"
                        : "opacity-80 hover:opacity-100 hover:scale-102"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1 text-amber-400 mb-3">
                        {[...Array(test.rating)].map((_, r) => (
                          <Star key={r} size={15} fill="currentColor" />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic">
                        "{test.quote}"
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white">{test.name}</h4>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">{test.role}</p>
                        <p className="text-[10px] text-[#2E7D32] dark:text-[#4ADE80] font-semibold">{test.district} • {test.farmSize}</p>
                      </div>
                      <span className="km-morph-icon flex h-9 w-9 items-center justify-center bg-emerald-50 dark:bg-[#183321] text-sm">
                        🌾
                      </span>
                    </div>
                  </div>
                </ZoomFadeReveal>
              );
            })}
          </div>
        </ZoomFadeReveal>
      </section>

      {/* =========================================================
          8. FAQ SECTION
         ========================================================= */}
      <section id="faq" className="py-16 sm:py-24">
        <ZoomFadeReveal delay={60} className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="key-cap text-xs py-1.5 px-4 bg-white/80 dark:bg-[#183321]/80 backdrop-blur-md text-[#2E7D32] dark:text-[#4ADE80] border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
              ❓ Help & Answers
            </span>
            <h2 className="mt-3.5 text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              {t("faqHeading") || "Frequently Asked Questions"}
            </h2>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="glass-panel rounded-2xl border border-gray-200/70 dark:border-gray-700/60 overflow-hidden shadow-xs transition-all duration-300 hover:border-[#2E7D32] dark:hover:border-[#4ADE80] zoom-fade-hover"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(i)}
                  className="flex w-full items-center justify-between p-5 text-left font-bold text-xs sm:text-sm text-gray-800 dark:text-gray-200 hover:text-[#2E7D32] dark:hover:text-[#4ADE80] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    size={16}
                    className={`shrink-0 transition-transform duration-300 ${
                      faqOpen === i ? "rotate-90 text-[#2E7D32] dark:text-[#4ADE80]" : "text-gray-400"
                    }`}
                  />
                </button>
                {faqOpen === i && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-200/60 dark:border-gray-700/60 pt-3 animate-zoom-fade-soft">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ZoomFadeReveal>
      </section>

      {/* =========================================================
          9. ANIMATIC HIGH-TECH CALL TO ACTION (CTA)
         ========================================================= */}
      <section className="relative overflow-hidden py-16 sm:py-20 bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#0F4716] text-white">
        {/* Animated Glow Rings in Background */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl km-morph-icon" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-green-400/20 blur-3xl km-morph-icon" style={{ animationDelay: "-3s" }} />

        <ZoomFadeReveal delay={80} className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold backdrop-blur-md">
            <Sparkles size={14} className="text-yellow-300 animate-spin" />
            <span>Join Fellow Progressive Farmers</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {t("ctaHeading") || "Ready to Grow More and Farm Smarter?"}
          </h2>

          <p className="max-w-xl mx-auto text-xs sm:text-base text-green-100 leading-relaxed font-normal">
            {t("ctaSubtitle") || "Join fellow farmers using KrushiMitra to plan better harvests, test soil compatibility, and download farm reports."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => nav?.("register")}
              className="btn-shimmer btn-glow flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-black text-[#1B5E20] shadow-2xl transition duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sprout size={20} />
              <span>{t("createFreeAccount") || "Create Free Account"}</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo("farmer")}
              className="rounded-2xl border border-white/40 bg-white/10 backdrop-blur-md px-7 py-4 text-sm font-bold text-white hover:bg-white/20 transition duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer shadow-lg"
            >
              <span>{t("instantDemoAccess") || "Instant Demo Access"}</span>
            </button>
          </div>
        </ZoomFadeReveal>
      </section>

      {/* =========================================================
          10. FOOTER (CLEAN & MINIMAL)
         ========================================================= */}
      <footer className="border-t border-[#DCE8D9] dark:border-[#24402A] bg-white dark:bg-[#0D1710] py-12 text-xs text-gray-500 dark:text-gray-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* BRAND */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="km-morph-icon flex h-9 w-9 items-center justify-center bg-[#2E7D32] text-white shadow-sm">
                  <Sprout size={20} />
                </div>
                <span className="text-base font-black text-[#1B5E20] dark:text-[#4ADE80]">KrushiMitra</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Empowering Indian Kisans with machine learning crop recommendations, yield forecasting, and meteorological intelligence.
              </p>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2.5">{t("platformTools") || "Platform Tools"}</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => (user ? nav?.("prediction") : nav?.("login"))} className="hover:text-[#2E7D32] dark:hover:text-[#4ADE80] cursor-pointer">
                    {t("cropPrediction") || "Crop Yield Prediction"}
                  </button>
                </li>
                <li>
                  <button onClick={() => (user ? nav?.("recommendation") : nav?.("login"))} className="hover:text-[#2E7D32] dark:hover:text-[#4ADE80] cursor-pointer">
                    {t("cropRecommendation") || "Soil Nutrient Advisory"}
                  </button>
                </li>
                <li>
                  <button onClick={() => (user ? nav?.("weather") : nav?.("login"))} className="hover:text-[#2E7D32] dark:hover:text-[#4ADE80] cursor-pointer">
                    {t("weather") || "District Weather Advisory"}
                  </button>
                </li>
                <li>
                  <button onClick={() => (user ? nav?.("reports") : nav?.("login"))} className="hover:text-[#2E7D32] dark:hover:text-[#4ADE80] cursor-pointer">
                    {t("reports") || "Official PDF Export"}
                  </button>
                </li>
              </ul>
            </div>

            {/* FARMER RESOURCES */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2.5">{t("farmerSupport") || "Farmer Support"}</h4>
              <ul className="space-y-2">
                <li>
                  <span className="flex items-center gap-1">
                    <PhoneCall size={12} className="text-[#2E7D32] dark:text-[#4ADE80]" /> {t("kisanHelpline") || "Kisan Helpline"}: 1800-180-1551
                  </span>
                </li>
                <li>
                  <a
                    href="mailto:krushimitra.project1@gmail.com"
                    className="flex items-center gap-1 hover:text-[#2E7D32] dark:hover:text-[#4ADE80] transition"
                  >
                    <Mail size={12} className="text-[#2E7D32] dark:text-[#4ADE80]" /> krushimitra.project1@gmail.com
                  </a>
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

            {/* AUTH ACCESS */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2.5">{t("accountAccess") || "Account Access"}</h4>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => nav?.("login")}
                  className="key-cap w-full text-center py-2 text-[11px] font-bold text-gray-700 dark:text-gray-200 hover:text-[#2E7D32] cursor-pointer"
                >
                  {t("signIn") || "Sign In to Account"}
                </button>
                <button
                  type="button"
                  onClick={() => nav?.("register")}
                  className="btn-shimmer w-full text-center py-2 text-[11px] font-bold text-white bg-[#2E7D32] rounded-xl hover:bg-[#1B5E20] cursor-pointer shadow-xs hover:scale-102"
                >
                  {t("getStarted") || "Register New Farmer"}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-[#DCE8D9] dark:border-[#24402A] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <p>© {new Date().getFullYear()} KrushiMitra AI. Built for Indian Agriculture & Sustainable Farming.</p>
          </div>
        </div>
      </footer>

      {/* KRUSHIMITRA MULTILINGUAL VOICE CHATBOT */}
      <VoiceChatbot />
    </div>
  );
}
