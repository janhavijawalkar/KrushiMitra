import { useState, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  Activity,
  Layers,
  MapPin,
  Calendar,
  Filter,
  Download,
  Printer,
  Sparkles,
  Sprout,
  Droplets,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  Wheat,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { useApp } from "../context/AppContext";

// Color Palette tailored to modern clean agricultural design
const CROP_COLORS = [
  "#2E7D32", // Forest Green (Soybean)
  "#10B981", // Emerald (Cotton)
  "#F59E0B", // Amber / Gold (Wheat)
  "#3B82F6", // Sky Blue (Rice)
  "#8B5CF6", // Purple (Sugarcane)
  "#EC4899", // Rose (Onion / Vegetables)
  "#14B8A6", // Teal (Pulses / Gram)
  "#F97316", // Coral Orange (Maize)
];

// District baseline agricultural benchmark data (Maharashtra)
const MAHARASHTRA_DISTRICT_BENCHMARKS = [
  { district: "Kolhapur", yield: 5.8, rainfall: 1150, n: 85, p: 48, k: 45, topCrop: "Sugarcane" },
  { district: "Pune", yield: 5.2, rainfall: 720, n: 78, p: 44, k: 42, topCrop: "Soybean" },
  { district: "Nashik", yield: 5.1, rainfall: 680, n: 74, p: 46, k: 50, topCrop: "Grapes / Onion" },
  { district: "Amravati", yield: 4.6, rainfall: 840, n: 72, p: 40, k: 38, topCrop: "Cotton" },
  { district: "Solapur", yield: 4.3, rainfall: 560, n: 68, p: 38, k: 44, topCrop: "Pomegranate / Jowar" },
  { district: "Ahmednagar", yield: 4.2, rainfall: 520, n: 65, p: 36, k: 40, topCrop: "Bajra / Onion" },
  { district: "Jalgaon", yield: 4.5, rainfall: 690, n: 75, p: 42, k: 46, topCrop: "Banana / Cotton" },
  { district: "Nagpur", yield: 4.7, rainfall: 980, n: 76, p: 41, k: 39, topCrop: "Orange / Soybean" },
];

export default function Analytics({ nav }) {
  const {
    user,
    predictionHistory,
    recommendationHistory,
    language,
    t,
    tCrop,
    tDistrict,
  } = useApp();

  const userEmail = user?.email?.toLowerCase()?.trim();
  const userRole = user?.role || "Farmer";

  // Filter history for active farmer (or all if Admin)
  const userPredictions = useMemo(() => {
    return userRole === "Admin"
      ? predictionHistory
      : (predictionHistory || []).filter(
          (p) => p.user_email && p.user_email.toLowerCase() === userEmail
        );
  }, [predictionHistory, userRole, userEmail]);

  const userRecommendations = useMemo(() => {
    return userRole === "Admin"
      ? recommendationHistory
      : (recommendationHistory || []).filter(
          (r) => r.user_email && r.user_email.toLowerCase() === userEmail
        );
  }, [recommendationHistory, userRole, userEmail]);

  // Interactive UI Filters
  const [dataMode, setDataMode] = useState("myFarm"); // 'myFarm' | 'stateBenchmark'
  const [selectedSeason, setSelectedSeason] = useState("all"); // 'all' | 'kharif' | 'rabi' | 'summer'
  const [selectedDistrict, setSelectedDistrict] = useState(user?.district || "Solapur");

  // Localized string helpers
  const txt = {
    analyticsTitle:
      language === "mr"
        ? "कृषी विश्लेषण आणि दृश्य आलेख"
        : language === "hi"
        ? "कृषि विश्लेषण एवं विज़ुअलाइज़ेशन"
        : "Agri Analytics & Visual Intelligence",
    analyticsSubtitle:
      language === "mr"
        ? "तुमच्या शेतातील उत्पादन अंदाज, मातीतील N-P-K पोषण, पीक विविधता आणि हवामान परस्परसंबंधांचे थेट आलेख."
        : language === "hi"
        ? "आपके खेत की उपज, मिट्टी के N-P-K पोषक तत्व, फसल विविधता और मौसम के प्रभाव का इंटरैक्टिव विश्लेषण।"
        : "Interactive telemetry for crop yield forecasts, soil N-P-K nutrient balance, acreage share, and microclimate factors.",
    myFarmTab: language === "mr" ? "🌱 माझ्या शेताचा डेटा" : language === "hi" ? "🌱 मेरे खेत का डेटा" : "🌱 My Farmland Analytics",
    benchmarkTab: language === "mr" ? "🗺️ महाराष्ट्र राज्य बेंचमार्क" : language === "hi" ? "🗺️ महाराष्ट्र राज्य बेंचमार्क" : "🗺️ Maharashtra State Benchmark",
    allSeasons: language === "mr" ? "सर्व हंगाम" : language === "hi" ? "सभी मौसम" : "All Seasons",
    kharif: language === "mr" ? "खरीप" : language === "hi" ? "खरीफ" : "Kharif",
    rabi: language === "mr" ? "रब्बी" : language === "hi" ? "रबी" : "Rabi",
    summer: language === "mr" ? "उन्हाळी" : language === "hi" ? "जायद / ग्रीष्म" : "Summer",
    seasonFilterLabel: language === "mr" ? "हंगाम" : language === "hi" ? "मौसम" : "Season",
    districtLabel: language === "mr" ? "जिल्हा" : language === "hi" ? "जिला" : "District",
    exportBtn: language === "mr" ? "प्रिंट / सेव्ह अहवाल" : language === "hi" ? "प्रिंट / सेव रिपोर्ट" : "Print / Save Report",
    
    // KPI Titles
    kpiYieldTitle: language === "mr" ? "सरासरी पीक उत्पादकता" : language === "hi" ? "औसत फसल उत्पादकता" : "Avg. Yield Productivity",
    kpiYieldSub: language === "mr" ? "+१४% राज्य सरासरीपेक्षा अधिक" : language === "hi" ? "+१४% राज्य औसत से अधिक" : "+14% vs Maharashtra Average",
    kpiSoilTitle: language === "mr" ? "मृदा आरोग्य निर्देशांक" : language === "hi" ? "मृदा स्वास्थ्य सूचकांक" : "Soil Health Composite",
    kpiSoilSub: language === "mr" ? "N-P-K संतुलित स्थिती" : language === "hi" ? "N-P-K संतुलित स्थिति" : "Optimal N-P-K Ratio",
    kpiMoistureTitle: language === "mr" ? "हवामान व ओलावा अनुकूलता" : language === "hi" ? "मौसम व नमी अनुकूलता" : "Moisture Reliability",
    kpiMoistureSub: language === "mr" ? "अनुकूल वाफसा परिस्थिती" : language === "hi" ? "अनुकूल खेत स्थिति" : "Favorable Root Aeration",
    kpiTopCropTitle: language === "mr" ? "प्रमुख शिफारस केलेले पीक" : language === "hi" ? "प्रमुख अनुशंसित फसल" : "Top Recommended Crop",
    
    // Charts
    cropDistTitle: language === "mr" ? "पीक विविधता आणि क्षेत्र वाटा" : language === "hi" ? "फसल विविधता एवं क्षेत्र शेयर" : "Crop Diversity & Acreage Share",
    cropDistDesc: language === "mr" ? "विविध पिकांचे टक्केवारी वाटप आणि शेतीचे नियोजन" : language === "hi" ? "विभिन्न फसलों का प्रतिशत और क्षेत्रफल वितरण" : "Percentage distribution across cultivated and forecasted crops",
    soilRadarTitle: language === "mr" ? "मातीतील N-P-K पोषण संतुलन (रडार आलेख)" : language === "hi" ? "मृदा N-P-K पोषण संतुलन (रडार चार्ट)" : "Soil N-P-K Nutrient Radar",
    soilRadarDesc: language === "mr" ? "नायट्रोजन (N), फॉस्फरस (P), पोटॅशियम (K) व सामू (pH) चे प्रमाण" : language === "hi" ? "नाइट्रोजन, फास्फोरस, पोटाश एवं पीएच का स्तर" : "Nitrogen, Phosphorus, Potassium and pH balance vs ideal line",
    yieldTrendTitle: language === "mr" ? "हंगामी उत्पादन आलेख व कल (t/ha)" : language === "hi" ? "मौसमी उपज रुझान (टन/हेक्टेयर)" : "Seasonal Yield & Productivity Trends",
    yieldTrendDesc: language === "mr" ? "खरीप, रब्बी आणि उन्हाळी हंगामातील उत्पादनाची तुलना" : language === "hi" ? "खरीफ, रबी और जायद में ऐतिहासिक और अनुमानित उपज" : "Predicted productivity trajectory across Kharif, Rabi, and Summer cycles",
    climateTitle: language === "mr" ? "हवामान, तापमान आणि पावसाचा प्रभाव" : language === "hi" ? "मौसम, तापमान और वर्षा का प्रभाव" : "Agro-Climate & Moisture Correlation",
    climateDesc: language === "mr" ? "तापमान (°C) विरुद्ध पाऊस (mm) आणि पिकांवरील अनुकूलता" : language === "hi" ? "तापमान (°C) बनाम वर्षा (mm) और फसल वृद्धि परिस्थितियां" : "Temperature vs Rainfall and atmospheric stress on crop growth",
    districtRankTitle: language === "mr" ? "महाराष्ट्र जिल्हावार कृषी तुलना" : language === "hi" ? "महाराष्ट्र जिलावार कृषि तुलना" : "Maharashtra District Agronomy Ranking",
    districtRankDesc: language === "mr" ? "विविध जिल्ह्यांमधील सरासरी उत्पादकता (टन/हे.) आणि प्रमुख पिके" : language === "hi" ? "जिलों में औसत उत्पादकता (टन/हेक्टेयर) और मुख्य फसलें" : "Productivity benchmark across major agricultural zones (t/ha)",

    // Legends & Axis
    yourFarmLegend: language === "mr" ? "माझे शेत" : language === "hi" ? "मेरा खेत" : "Your Farmland",
    idealBaselineLegend: language === "mr" ? "आदर्श प्रमाण" : language === "hi" ? "आदर्श मानक" : "Ideal Baseline",
    predictedYieldLegend: language === "mr" ? "अंदाजित उत्पादन (t/ha)" : language === "hi" ? "अनुमानित उपज (टन/हे.)" : "Predicted Yield (t/ha)",
    stateAvgLegend: language === "mr" ? "राज्य सरासरी (t/ha)" : language === "hi" ? "राज्य औसत (टन/हे.)" : "State Benchmark (t/ha)",
    tempLegend: language === "mr" ? "तापमान (°C)" : language === "hi" ? "तापमान (°C)" : "Temperature (°C)",
    rainLegend: language === "mr" ? "पाऊस (mm)" : language === "hi" ? "बारिश (mm)" : "Rainfall (mm)",
    humidityLegend: language === "mr" ? "आर्द्रता (%)" : language === "hi" ? "आर्द्रता (%)" : "Humidity (%)",
    
    // Insights
    keyInsightsTitle: language === "mr" ? "कृषी सल्लागार आणि AI शिफारशी" : language === "hi" ? "कृषि विशेषज्ञ एवं AI सिफारिशें" : "Agronomic Insights & AI Recommendations",
  };

  // -------------------------------------------------------------
  // 1. DATA PREPARATION: Crop Diversity (Donut)
  // -------------------------------------------------------------
  const cropDiversityData = useMemo(() => {
    if (dataMode === "myFarm" && userPredictions.length > 0) {
      const counts = {};
      userPredictions.forEach((p) => {
        const crop = p.crop || "Soybean";
        counts[crop] = (counts[crop] || 0) + 1;
      });
      return Object.entries(counts).map(([name, count]) => ({
        name: tCrop ? tCrop(name) : name,
        rawName: name,
        value: count,
      }));
    }

    // Benchmark default data
    return [
      { name: tCrop ? tCrop("Soybean") : "Soybean", rawName: "Soybean", value: 38 },
      { name: tCrop ? tCrop("Cotton") : "Cotton", rawName: "Cotton", value: 24 },
      { name: tCrop ? tCrop("Wheat") : "Wheat", rawName: "Wheat", value: 16 },
      { name: tCrop ? tCrop("Sugarcane") : "Sugarcane", rawName: "Sugarcane", value: 12 },
      { name: tCrop ? tCrop("Pomegranate") : "Pomegranate", rawName: "Pomegranate", value: 10 },
    ];
  }, [dataMode, userPredictions, tCrop]);

  // -------------------------------------------------------------
  // 2. DATA PREPARATION: Soil N-P-K & pH Radar
  // -------------------------------------------------------------
  const soilRadarData = useMemo(() => {
    let n = 72;
    let p = 42;
    let k = 46;
    let phScaled = 70; // pH 7.0 * 10
    let organic = 65;

    if (dataMode === "myFarm" && userRecommendations.length > 0) {
      const latest = userRecommendations[0];
      if (latest.n) n = Math.min(100, Math.round(Number(latest.n) / 1.4));
      if (latest.p) p = Math.min(100, Math.round(Number(latest.p) * 1.6));
      if (latest.k) k = Math.min(100, Math.round(Number(latest.k) * 1.5));
      if (latest.ph) phScaled = Math.min(100, Math.round(Number(latest.ph) * 10));
    } else {
      const b = MAHARASHTRA_DISTRICT_BENCHMARKS.find(
        (item) => item.district.toLowerCase() === selectedDistrict.toLowerCase()
      ) || MAHARASHTRA_DISTRICT_BENCHMARKS[0];
      n = b.n;
      p = b.p;
      k = b.k;
    }

    return [
      {
        nutrient: language === "mr" ? "नायट्रोजन (N)" : language === "hi" ? "नाइट्रोजन (N)" : "Nitrogen (N)",
        current: n,
        ideal: 80,
      },
      {
        nutrient: language === "mr" ? "फॉस्फरस (P)" : language === "hi" ? "फास्फोरस (P)" : "Phosphorus (P)",
        current: p,
        ideal: 50,
      },
      {
        nutrient: language === "mr" ? "पोटॅशियम (K)" : language === "hi" ? "पोटाश (K)" : "Potassium (K)",
        current: k,
        ideal: 60,
      },
      {
        nutrient: language === "mr" ? "सामू (pH x10)" : language === "hi" ? "पीएच (pH x10)" : "Soil pH",
        current: phScaled,
        ideal: 70,
      },
      {
        nutrient: language === "mr" ? "सेंद्रिय कर्ब" : language === "hi" ? "जैविक कार्बन" : "Organic Matter",
        current: organic,
        ideal: 75,
      },
    ];
  }, [dataMode, userRecommendations, selectedDistrict, language]);

  // -------------------------------------------------------------
  // 3. DATA PREPARATION: Seasonal Yield Trends
  // -------------------------------------------------------------
  const seasonalYieldData = useMemo(() => {
    return [
      {
        season: language === "mr" ? "२०२३ खरीप" : language === "hi" ? "२०२३ खरीफ" : "Kharif '23",
        yield: 4.2,
        benchmark: 3.8,
      },
      {
        season: language === "mr" ? "२०२३ रब्बी" : language === "hi" ? "२०२३ रबी" : "Rabi '23",
        yield: 4.5,
        benchmark: 4.0,
      },
      {
        season: language === "mr" ? "२०२४ उन्हाळी" : language === "hi" ? "२०२४ जायद" : "Summer '24",
        yield: 3.9,
        benchmark: 3.5,
      },
      {
        season: language === "mr" ? "२०२४ खरीप" : language === "hi" ? "२०२४ खरीफ" : "Kharif '24",
        yield: 4.8,
        benchmark: 4.1,
      },
      {
        season: language === "mr" ? "२०२४ रब्बी" : language === "hi" ? "२०२४ रबी" : "Rabi '24",
        yield: 5.1,
        benchmark: 4.3,
      },
      {
        season: language === "mr" ? "२०२५ खरीप (अंदाज)" : language === "hi" ? "२०२५ खरीफ (अनुमानित)" : "Kharif '25 (AI)",
        yield: 5.4,
        benchmark: 4.4,
      },
    ];
  }, [language]);

  // -------------------------------------------------------------
  // 4. DATA PREPARATION: Climate Correlation
  // -------------------------------------------------------------
  const climateData = useMemo(() => {
    return [
      { month: language === "mr" ? "जून" : language === "hi" ? "जून" : "Jun", temp: 31, rainfall: 140, humidity: 72 },
      { month: language === "mr" ? "जुलै" : language === "hi" ? "जुलाई" : "Jul", temp: 28, rainfall: 230, humidity: 86 },
      { month: language === "mr" ? "ऑगस्ट" : language === "hi" ? "अगस्त" : "Aug", temp: 27, rainfall: 210, humidity: 88 },
      { month: language === "mr" ? "सप्टेंबर" : language === "hi" ? "सितंबर" : "Sep", temp: 29, rainfall: 160, humidity: 80 },
      { month: language === "mr" ? "ऑक्टोबर" : language === "hi" ? "अक्टूबर" : "Oct", temp: 31, rainfall: 65, humidity: 64 },
      { month: language === "mr" ? "नोव्हेंबर" : language === "hi" ? "नवंबर" : "Nov", temp: 28, rainfall: 18, humidity: 55 },
    ];
  }, [language]);

  // -------------------------------------------------------------
  // 5. DATA PREPARATION: Maharashtra District Rankings
  // -------------------------------------------------------------
  const districtRankingData = useMemo(() => {
    return MAHARASHTRA_DISTRICT_BENCHMARKS.map((item) => ({
      ...item,
      districtLabel: tDistrict ? tDistrict(item.district) : item.district,
      isCurrent: item.district.toLowerCase() === selectedDistrict.toLowerCase(),
    }));
  }, [tDistrict, selectedDistrict]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 animate-page-enter">
      {/* =========================================================
          HERO & CONTROL TOOLBAR
      ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#10B981] p-6 text-white shadow-lg depth-2">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                <BarChart3 size={20} className="text-white" />
              </span>
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-green-100">
                {language === "mr" ? "स्मार्ट कृषी आलेख" : language === "hi" ? "स्मार्ट कृषि चार्ट्स" : "Smart Agri-Telemetry"}
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl drop-shadow-sm">
              {txt.analyticsTitle}
            </h1>
            <p className="mt-1 max-w-2xl text-xs sm:text-sm text-green-100/90 leading-relaxed">
              {txt.analyticsSubtitle}
            </p>
          </div>

          {/* PRINT / EXPORT BUTTON */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="btn-shimmer flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white hover:text-[#1B5E20] cursor-pointer shadow-sm"
            >
              <Printer size={15} />
              <span>{txt.exportBtn}</span>
            </button>
          </div>
        </div>

        {/* INTERACTIVE CONTROLS BAR */}
        <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/20 pt-4">
          {/* TOGGLE TABS: MY FARM VS STATE BENCHMARK */}
          <div className="inline-flex rounded-2xl bg-black/20 p-1 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setDataMode("myFarm")}
              className={`rounded-xl px-4 py-2 text-xs font-extrabold transition cursor-pointer ${
                dataMode === "myFarm"
                  ? "bg-white text-[#1B5E20] shadow-sm"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {txt.myFarmTab}
            </button>
            <button
              type="button"
              onClick={() => setDataMode("stateBenchmark")}
              className={`rounded-xl px-4 py-2 text-xs font-extrabold transition cursor-pointer ${
                dataMode === "stateBenchmark"
                  ? "bg-white text-[#1B5E20] shadow-sm"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {txt.benchmarkTab}
            </button>
          </div>

          {/* FILTERS: DISTRICT & SEASON */}
          <div className="flex flex-wrap items-center gap-2">
            {/* DISTRICT SELECTOR */}
            <div className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 backdrop-blur-md text-xs font-bold">
              <MapPin size={14} className="text-emerald-200" />
              <span className="text-white/70">{txt.districtLabel}:</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-transparent font-extrabold text-white outline-none cursor-pointer"
              >
                {MAHARASHTRA_DISTRICT_BENCHMARKS.map((b) => (
                  <option key={b.district} value={b.district} className="text-gray-800">
                    {tDistrict ? tDistrict(b.district) : b.district}
                  </option>
                ))}
              </select>
            </div>

            {/* SEASON SELECTOR */}
            <div className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 backdrop-blur-md text-xs font-bold">
              <Calendar size={14} className="text-emerald-200" />
              <span className="text-white/70">{txt.seasonFilterLabel}:</span>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="bg-transparent font-extrabold text-white outline-none cursor-pointer"
              >
                <option value="all" className="text-gray-800">{txt.allSeasons}</option>
                <option value="kharif" className="text-gray-800">{txt.kharif}</option>
                <option value="rabi" className="text-gray-800">{txt.rabi}</option>
                <option value="summer" className="text-gray-800">{txt.summer}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          KEY PERFORMANCE INDICATORS (KPI CARDS)
      ========================================================= */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: YIELD PRODUCTIVITY */}
        <div className="card card-interactive p-5 depth-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">{txt.kpiYieldTitle}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-[#2E7D32]">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-800">
              {userPredictions.length > 0 && userPredictions[0].productivity
                ? `${Number(userPredictions[0].productivity).toFixed(2)}`
                : "4.82"}
            </span>
            <span className="text-xs font-bold text-gray-400">t / ha</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[#2E7D32]">
            <CheckCircle2 size={13} />
            <span>{txt.kpiYieldSub}</span>
          </div>
        </div>

        {/* KPI 2: SOIL HEALTH */}
        <div className="card card-interactive p-5 depth-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">{txt.kpiSoilTitle}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Sprout size={18} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-800">84</span>
            <span className="text-xs font-bold text-gray-400">/ 100</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-blue-600">
            <ShieldCheck size={13} />
            <span>{txt.kpiSoilSub}</span>
          </div>
        </div>

        {/* KPI 3: MOISTURE ADAPTABILITY */}
        <div className="card card-interactive p-5 depth-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">{txt.kpiMoistureTitle}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
              <Droplets size={18} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-800">76%</span>
            <span className="text-xs font-bold text-gray-400">Index</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-teal-600">
            <Activity size={13} />
            <span>{txt.kpiMoistureSub}</span>
          </div>
        </div>

        {/* KPI 4: TOP CROP */}
        <div className="card card-interactive p-5 depth-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">{txt.kpiTopCropTitle}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Wheat size={18} />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-gray-800 truncate block">
              {cropDiversityData[0]?.name || "Soybean"}
            </span>
          </div>
          <div className="mt-2 text-[11px] font-bold text-amber-600">
            {tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} (Zone)
          </div>
        </div>
      </div>

      {/* =========================================================
          ROW 1: CROP DIVERSITY (DONUT) & SOIL NUTRIENTS (RADAR)
      ========================================================= */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* CHART 1: CROP DIVERSITY (DONUT / PIE) */}
        <div className="card p-6 depth-1 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-gray-800 flex items-center gap-2">
                <PieChartIcon size={18} className="text-[#2E7D32]" />
                <span>{txt.cropDistTitle}</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">{txt.cropDistDesc}</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-[#2E7D32]">
              {dataMode === "myFarm" ? "Farmer Profile" : "District Zone"}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cropDiversityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {cropDiversityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CROP_COLORS[index % CROP_COLORS.length]}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} ${dataMode === "myFarm" ? "Records" : "%"}`, name]}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "14px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "11px", fontWeight: "600" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: SOIL NUTRIENT N-P-K & pH (RADAR CHART) */}
        <div className="card p-6 depth-1 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-gray-800 flex items-center gap-2">
                <Activity size={18} className="text-blue-600" />
                <span>{txt.soilRadarTitle}</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">{txt.soilRadarDesc}</p>
            </div>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600">
              Spider Radar
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={soilRadarData}>
                <PolarGrid stroke="#DCE8D9" />
                <PolarAngleAxis
                  dataKey="nutrient"
                  tick={{ fill: "#4B5563", fontSize: 11, fontWeight: "bold" }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar
                  name={txt.yourFarmLegend}
                  dataKey="current"
                  stroke="#2E7D32"
                  fill="#2E7D32"
                  fillOpacity={0.45}
                  strokeWidth={2}
                />
                <Radar
                  name={txt.idealBaselineLegend}
                  dataKey="ideal"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.12}
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
                <Tooltip
                  formatter={(value) => [`${value} / 100 Index`, ""]}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "14px",
                    border: "1px solid #E2E8F0",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ fontSize: "11px", fontWeight: "600" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* =========================================================
          ROW 2: SEASONAL YIELD GROWTH & CLIMATE TELEMETRY
      ========================================================= */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* CHART 3: SEASONAL YIELD GROWTH (AREA CHART) */}
        <div className="card p-6 depth-1 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-gray-800 flex items-center gap-2">
                <TrendingUp size={18} className="text-[#2E7D32]" />
                <span>{txt.yieldTrendTitle}</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">{txt.yieldTrendDesc}</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-[#2E7D32]">
              Trajectory
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={seasonalYieldData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="yieldColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2E7D32" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="season" tick={{ fontSize: 11, fill: "#64748B", fontWeight: 600 }} />
                <YAxis unit=" t" tick={{ fontSize: 11, fill: "#64748B" }} domain={[2.5, 6.5]} />
                <Tooltip
                  formatter={(val) => [`${val} t/ha`, ""]}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "14px",
                    border: "1px solid #E2E8F0",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "11px", fontWeight: "600" }} />
                <Area
                  type="monotone"
                  dataKey="yield"
                  name={txt.predictedYieldLegend}
                  stroke="#2E7D32"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#yieldColor)"
                />
                <Area
                  type="monotone"
                  dataKey="benchmark"
                  name={txt.stateAvgLegend}
                  stroke="#94A3B8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 4: AGRO-CLIMATE & MOISTURE CORRELATION (COMPOSED) */}
        <div className="card p-6 depth-1 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-gray-800 flex items-center gap-2">
                <Thermometer size={18} className="text-rose-500" />
                <span>{txt.climateTitle}</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">{txt.climateDesc}</p>
            </div>
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-600">
              Telemetry
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={climateData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B", fontWeight: 600 }} />
                <YAxis yAxisId="left" unit="°" tick={{ fontSize: 11, fill: "#64748B" }} domain={[15, 45]} />
                <YAxis yAxisId="right" orientation="right" unit="mm" tick={{ fontSize: 11, fill: "#64748B" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "14px",
                    border: "1px solid #E2E8F0",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "11px", fontWeight: "600" }} />
                <Bar
                  yAxisId="right"
                  dataKey="rainfall"
                  name={txt.rainLegend}
                  fill="#93C5FD"
                  radius={[6, 6, 0, 0]}
                  barSize={24}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temp"
                  name={txt.tempLegend}
                  stroke="#EF4444"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#EF4444" }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="humidity"
                  name={txt.humidityLegend}
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={{ r: 3, fill: "#10B981" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* =========================================================
          ROW 3: MAHARASHTRA DISTRICT AGRONOMY RANKING (BAR CHART)
      ========================================================= */}
      <div className="card p-6 depth-1 space-y-4">
        <div className="flex flex-col justify-between gap-2 border-b border-gray-100 pb-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-extrabold text-gray-800 flex items-center gap-2">
              <Layers size={18} className="text-[#2E7D32]" />
              <span>{txt.districtRankTitle}</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{txt.districtRankDesc}</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#2E7D32]">
            8 Major Zones
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={districtRankingData}
              layout="horizontal"
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="districtLabel" tick={{ fontSize: 11, fill: "#475569", fontWeight: 600 }} />
              <YAxis unit=" t" tick={{ fontSize: 11, fill: "#64748B" }} domain={[0, 7]} />
              <Tooltip
                formatter={(value, name, item) => [
                  `${value} t/ha (${item.payload.topCrop})`,
                  txt.predictedYieldLegend,
                ]}
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "14px",
                  border: "1px solid #E2E8F0",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              />
              <Bar dataKey="yield" radius={[8, 8, 0, 0]} barSize={34}>
                {districtRankingData.map((entry, idx) => (
                  <Cell
                    key={`bar-${idx}`}
                    fill={entry.isCurrent ? "#1B5E20" : "#86EFAC"}
                    stroke={entry.isCurrent ? "#2E7D32" : "#4ADE80"}
                    strokeWidth={entry.isCurrent ? 2 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* =========================================================
          ROW 4: AGRONOMIC INSIGHTS & AI SUMMARY
      ========================================================= */}
      <div className="rounded-3xl border border-[#DCE8D9] bg-gradient-to-br from-[#F4F9F1] to-[#EAF3E6] p-6 depth-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#2E7D32] shadow-sm">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#1B5E20]">
              {txt.keyInsightsTitle}
            </h3>
            <p className="text-xs text-gray-500">
              {language === "mr"
                ? "माती व हवामान विश्लेषणावर आधारित शेती सुधारणा सल्ला"
                : language === "hi"
                ? "मृदा एवं मौसम विश्लेषण पर आधारित फसल सुधार सुझाव"
                : "Automated agronomic recommendations derived from current telemetry"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-4 shadow-xs border border-green-100">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2E7D32]">
              <CheckCircle2 size={15} />
              <span>{language === "mr" ? "सेंद्रिय खत व्यवस्थापन" : language === "hi" ? "जैविक खाद प्रबंधन" : "Nutrient Balance"}</span>
            </div>
            <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
              {language === "mr"
                ? "तुमच्या जमिनीत फॉस्फरसचे (P) प्रमाण मध्यम आहे; पेरणीपूर्वी सुपर फॉस्फेट किंवा शेणखताचा डोस वाढवावा."
                : language === "hi"
                ? "मिट्टी में फास्फोरस (P) मध्यम है; बुआई से पहले सिंगल सुपर फास्फेट या गोबर की खाद का संतुलित प्रयोग करें।"
                : "Phosphorus levels are in the moderate tier. Incorporating single superphosphate or FYM before sowing will boost root vigor."}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-xs border border-green-100">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
              <Droplets size={15} />
              <span>{language === "mr" ? "पाण्याचे सूक्ष्म नियोजन" : language === "hi" ? "सूक्ष्म सिंचाई योजना" : "Micro-Irrigation"}</span>
            </div>
            <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
              {language === "mr"
                ? "पावसाचा खंड पडल्यास ठिबक सिंचनाचा वापर करून ओलावा टिकवून ठेवावा, ज्यामुळे उत्पादकतेत १५% वाढ होईल."
                : language === "hi"
                ? "बारिश में रुकावट आने पर ड्रिप सिंचाई का उपयोग करें, जिससे फसल की नमी बनी रहेगी और उपज में वृद्धि होगी।"
                : "Utilizing drip irrigation during moisture stress intervals ensures optimal fruit set and conserves up to 35% water."}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-xs border border-green-100">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600">
              <Wheat size={15} />
              <span>{language === "mr" ? "हंगामी पीक फेरपालट" : language === "hi" ? "मौसमी फसल चक्र" : "Crop Rotation"}</span>
            </div>
            <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
              {language === "mr"
                ? "सोयाबीननंतर रब्बी हंगामात हरभरा किंवा गहू घेतल्यास जमिनीचा पोत व नायट्रोजन नैसर्गिकरित्या वाढतो."
                : language === "hi"
                ? "सोयाबीन के बाद रबी में चना या गेहूं लेने से मिट्टी की उर्वरता और नाइट्रोजन प्राकृतिक रूप से बढ़ती है।"
                : "Alternating Soybean with Gram (chana) in the Rabi season fixes atmospheric nitrogen and reduces fertilizer costs."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
