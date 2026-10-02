import { useState, useMemo } from "react";
import {
  Sprout,
  Thermometer,
  Droplets,
  CloudRain,
  FlaskConical,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Leaf,
  Activity,
  AlertCircle,
  Loader2,
  Share2,
  TrendingUp,
  MapPin,
} from "lucide-react";

import { useApp } from "../context/AppContext";
import VoiceMicButton from "../components/VoiceMicButton";
import { parseSpokenSoilData, convertDevanagariDigits } from "../utils/voiceParser";
import { buildApiUrl } from "../utils/apiConfig";
import { openWhatsAppShare, formatRecommendationShareText } from "../utils/whatsappShare";
import { getCropRecommendationReason } from "../utils/cropReasoning";

const QUICK_PRESETS = [
  {
    id: "cotton",
    name: { en: "Cotton (Kapus)", mr: "कापूस (Cotton)", hi: "कपास (Cotton)" },
    icon: "🌱",
    values: { nitrogen: "118", phosphorus: "46", potassium: "20", temperature: "24", humidity: "80", ph: "6.9", rainfall: "80" },
  },
  {
    id: "rice",
    name: { en: "Rice (Paddy)", mr: "भात (Rice)", hi: "धान (Rice)" },
    icon: "🌾",
    values: { nitrogen: "80", phosphorus: "47", potassium: "40", temperature: "24", humidity: "82", ph: "6.4", rainfall: "236" },
  },
  {
    id: "maize",
    name: { en: "Maize (Maka)", mr: "मका (Maize)", hi: "मक्का (Maize)" },
    icon: "🌽",
    values: { nitrogen: "78", phosphorus: "48", potassium: "20", temperature: "22", humidity: "65", ph: "6.2", rainfall: "85" },
  },
  {
    id: "chickpea",
    name: { en: "Gram (Harbhara)", mr: "हरभरा (Chickpea)", hi: "चना (Chickpea)" },
    icon: "🥔",
    values: { nitrogen: "40", phosphorus: "68", potassium: "80", temperature: "19", humidity: "17", ph: "6.8", rainfall: "80" },
  },
  {
    id: "pigeonpeas",
    name: { en: "Tur (Arhar)", mr: "तूर (Pigeon Pea)", hi: "अरहर (Tur)" },
    icon: "🌿",
    values: { nitrogen: "35", phosphorus: "68", potassium: "20", temperature: "28", humidity: "48", ph: "5.7", rainfall: "150" },
  },
  {
    id: "banana",
    name: { en: "Banana (Keli)", mr: "केळी (Banana)", hi: "केला (Banana)" },
    icon: "🍌",
    values: { nitrogen: "100", phosphorus: "82", potassium: "50", temperature: "27", humidity: "80", ph: "6.0", rainfall: "105" },
  },
  {
    id: "grapes",
    name: { en: "Grapes (Draksha)", mr: "द्राक्षे (Grapes)", hi: "अंगूर (Grapes)" },
    icon: "🍇",
    values: { nitrogen: "23", phosphorus: "133", potassium: "200", temperature: "24", humidity: "82", ph: "6.0", rainfall: "70" },
  },
  {
    id: "watermelon",
    name: { en: "Watermelon", mr: "कलिंगड (Watermelon)", hi: "तरबूज (Watermelon)" },
    icon: "🍉",
    values: { nitrogen: "99", phosphorus: "17", potassium: "50", temperature: "26", humidity: "88", ph: "6.5", rainfall: "51" },
  },
];

const CROP_AREA_PLANNING = {
  soybean: {
    yieldAcre: 1.25,
    seedRate: 30,
    seedUnit: { en: "kg", mr: "कि.ग्रॅ.", hi: "किग्रा" },
    dapBagsPerAcre: 1.5,
    ureaBagsPerAcre: 1.0,
    spacing: { en: "45 x 5 cm", mr: "४५ x ५ सेंमी", hi: "45 x 5 सेमी" },
  },
  cotton: {
    yieldAcre: 1.10,
    seedRate: 2,
    seedUnit: { en: "packets (450g)", mr: "पाकिटे (४५० ग्रॅम)", hi: "पैकेट (450g)" },
    dapBagsPerAcre: 1.5,
    ureaBagsPerAcre: 2.0,
    spacing: { en: "90 x 60 cm", mr: "९० x ६० सेंमी", hi: "90 x 60 सेमी" },
  },
  sugarcane: {
    yieldAcre: 38.0,
    seedRate: 25000,
    seedUnit: { en: "eye buds", mr: "डोळे / टिपरी", hi: "आंखें / टुकड़े" },
    dapBagsPerAcre: 3.0,
    ureaBagsPerAcre: 6.0,
    spacing: { en: "4-5 ft ridges", mr: "४-५ फूट सरी", hi: "4-5 फीट नाली" },
  },
  wheat: {
    yieldAcre: 1.55,
    seedRate: 40,
    seedUnit: { en: "kg", mr: "कि.ग्रॅ.", hi: "किग्रा" },
    dapBagsPerAcre: 1.5,
    ureaBagsPerAcre: 2.0,
    spacing: { en: "22.5 cm rows", mr: "२२.५ सेंमी ओळीत", hi: "22.5 सेमी कतार" },
  },
  rice: {
    yieldAcre: 1.85,
    seedRate: 15,
    seedUnit: { en: "kg", mr: "कि.ग्रॅ.", hi: "किग्रा" },
    dapBagsPerAcre: 1.5,
    ureaBagsPerAcre: 2.0,
    spacing: { en: "20 x 15 cm", mr: "२० x १५ सेंमी", hi: "20 x 15 सेमी" },
  },
  chickpea: {
    yieldAcre: 0.85,
    seedRate: 25,
    seedUnit: { en: "kg", mr: "कि.ग्रॅ.", hi: "किग्रा" },
    dapBagsPerAcre: 1.0,
    ureaBagsPerAcre: 0.5,
    spacing: { en: "30 x 10 cm", mr: "३० x १० सेंमी", hi: "30 x 10 सेमी" },
  },
  gram: {
    yieldAcre: 0.85,
    seedRate: 25,
    seedUnit: { en: "kg", mr: "कि.ग्रॅ.", hi: "किग्रा" },
    dapBagsPerAcre: 1.0,
    ureaBagsPerAcre: 0.5,
    spacing: { en: "30 x 10 cm", mr: "३० x १० सेंमी", hi: "30 x 10 सेमी" },
  },
  pigeonpeas: {
    yieldAcre: 0.75,
    seedRate: 5,
    seedUnit: { en: "kg", mr: "कि.ग्रॅ.", hi: "किग्रा" },
    dapBagsPerAcre: 1.0,
    ureaBagsPerAcre: 0.5,
    spacing: { en: "90 x 20 cm", mr: "९० x २० सेंमी", hi: "90 x 20 सेमी" },
  },
  tur: {
    yieldAcre: 0.75,
    seedRate: 5,
    seedUnit: { en: "kg", mr: "कि.ग्रॅ.", hi: "किग्रा" },
    dapBagsPerAcre: 1.0,
    ureaBagsPerAcre: 0.5,
    spacing: { en: "90 x 20 cm", mr: "९० x २० सेंमी", hi: "90 x 20 सेमी" },
  },
  maize: {
    yieldAcre: 2.20,
    seedRate: 8,
    seedUnit: { en: "kg", mr: "कि.ग्रॅ.", hi: "किग्रा" },
    dapBagsPerAcre: 1.5,
    ureaBagsPerAcre: 2.5,
    spacing: { en: "60 x 20 cm", mr: "६० x २० सेंमी", hi: "60 x 20 सेमी" },
  },
  banana: {
    yieldAcre: 22.0,
    seedRate: 1200,
    seedUnit: { en: "plantlets", mr: "रोपे", hi: "पौधे" },
    dapBagsPerAcre: 2.0,
    ureaBagsPerAcre: 4.0,
    spacing: { en: "1.5 x 1.5 m", mr: "१.५ x १.५ मी", hi: "1.5 x 1.5 मी" },
  },
  grapes: {
    yieldAcre: 8.5,
    seedRate: 900,
    seedUnit: { en: "vines", mr: "कलमे / रोपे", hi: "पौधे" },
    dapBagsPerAcre: 2.0,
    ureaBagsPerAcre: 3.0,
    spacing: { en: "9 x 5 ft", mr: "९ x ५ फूट", hi: "9 x 5 फीट" },
  },
  watermelon: {
    yieldAcre: 15.0,
    seedRate: 350,
    seedUnit: { en: "grams", mr: "ग्रॅम", hi: "ग्राम" },
    dapBagsPerAcre: 1.5,
    ureaBagsPerAcre: 2.0,
    spacing: { en: "2 m beds", mr: "२ मीटर गादीवाफे", hi: "2 मीटर क्यारी" },
  },
  orange: {
    yieldAcre: 6.5,
    seedRate: 110,
    seedUnit: { en: "grafts", mr: "कलमे", hi: "कलमें" },
    dapBagsPerAcre: 2.0,
    ureaBagsPerAcre: 3.0,
    spacing: { en: "6 x 6 m", mr: "६ x ६ मी", hi: "6 x 6 मी" },
  },
  papaya: {
    yieldAcre: 25.0,
    seedRate: 1000,
    seedUnit: { en: "seedlings", mr: "रोपे", hi: "पौधे" },
    dapBagsPerAcre: 2.0,
    ureaBagsPerAcre: 3.5,
    spacing: { en: "2.1 x 2.1 m", mr: "२.१ x २.१ मी", hi: "2.1 x 2.1 मी" },
  },
};

export default function Recommendation({ nav }) {
  const { addRecommendation, language, t, tCrop, user } = useApp();

  const defaultArea = user?.farm_size || user?.farmSize || "5";

  const [npkUnit, setNpkUnit] = useState("kg/ha"); // 'kg/ha' | 'kg/acre'
  const [unitToast, setUnitToast] = useState("");

  const [form, setForm] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
    area: defaultArea,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [voiceToast, setVoiceToast] = useState("");

  // Convert N-P-K measurement unit between kg/ha (standard) and kg/acre
  // Conversion constant: 1 hectare = 2.47105 acres
  // kg/ha -> kg/acre: value / 2.47105
  // kg/acre -> kg/ha: value * 2.47105
  const handleNpkUnitChange = (newUnit) => {
    if (newUnit === npkUnit) return;

    setForm((prev) => {
      const convert = (val) => {
        if (val === "" || val === undefined || val === null || isNaN(val)) return val;
        const num = Number(val);
        if (newUnit === "kg/acre") {
          return String(Math.round((num / 2.47105) * 10) / 10);
        } else {
          return String(Math.round(num * 2.47105));
        }
      };

      const hasValues = prev.nitrogen !== "" || prev.phosphorus !== "" || prev.potassium !== "";
      if (hasValues) {
        setUnitToast(
          newUnit === "kg/acre"
            ? (language === "mr" ? "🔄 N-P-K मूल्ये किलो/एकर मध्ये रूपांतरित केली!" : language === "hi" ? "🔄 N-P-K मान किग्रा/एकड़ में परिवर्तित किए गए!" : "🔄 N-P-K converted to kg/acre!")
            : (language === "mr" ? "🔄 N-P-K मूल्ये किलो/हेक्टर मध्ये रूपांतरित केली!" : language === "hi" ? "🔄 N-P-K मान किग्रा/हेक्टर में परिवर्तित किए गए!" : "🔄 N-P-K converted to kg/ha!")
        );
        setTimeout(() => setUnitToast(""), 3500);
      }

      return {
        ...prev,
        nitrogen: convert(prev.nitrogen),
        phosphorus: convert(prev.phosphorus),
        potassium: convert(prev.potassium),
      };
    });

    setNpkUnit(newUnit);
    if (result) setResult(null);
  };

  const phVal = form.ph !== "" ? Number(form.ph) : null;
  const tempVal = form.temperature !== "" ? Number(form.temperature) : null;

  const phError = phVal !== null && !isNaN(phVal) && (phVal < 0.0 || phVal > 14.0);
  const tempError = tempVal !== null && !isNaN(tempVal) && tempVal > 50.0;
  const hasValidationError = phError || tempError;

  const phWarningMessage = useMemo(() => {
    if (!phError) return "";
    if (language === "mr") {
      return "⚠️ मातीचा सामू (pH) ० ते १४ दरम्यान असावा. ० ते १४ च्या बाहेरील मूल्य अमान्य आहे.";
    }
    if (language === "hi") {
      return "⚠️ मिट्टी का pH मान 0 से 14 के बीच होना चाहिए। 0 से 14 के बाहर का मान अमान्य है।";
    }
    return "⚠️ Soil pH must be between 0 and 14 on the standard pH scale.";
  }, [phError, language]);

  const tempWarningMessage = useMemo(() => {
    if (!tempError) return "";
    if (language === "mr") {
      return "⚠️ तापमान ५०°C पेक्षा जास्त असू नये. अति उष्णतेमुळे पिकांची वाढ थांबते, त्यामुळे पीक शिफारस अनुमत नाही.";
    }
    if (language === "hi") {
      return "⚠️ तापमान 50°C से अधिक नहीं होना चाहिए। अत्यधिक गर्मी फसलों के विकास को रोकती है, अतः सिफारिश अनुमत नहीं है।";
    }
    return "⚠️ Temperature cannot be more than 50°C as extreme heat prevents crop growth. Recommendation is not allowed.";
  }, [tempError, language]);

  const applyPreset = (preset) => {
    let n = preset.values.nitrogen;
    let p = preset.values.phosphorus;
    let k = preset.values.potassium;

    if (npkUnit === "kg/acre") {
      n = String(Math.round((Number(n) / 2.47105) * 10) / 10);
      p = String(Math.round((Number(p) / 2.47105) * 10) / 10);
      k = String(Math.round((Number(k) / 2.47105) * 10) / 10);
    }

    setForm((prev) => ({
      ...preset.values,
      nitrogen: n,
      phosphorus: p,
      potassium: k,
      area: prev.area || defaultArea,
    }));
    setError("");
    if (result) setResult(null);
  };

  const reasoning = useMemo(() => {
    if (!result?.crop) return null;
    return getCropRecommendationReason(result.crop, { ...form, ...result }, language);
  }, [result, form, language]);

  const handleVoiceSoilAutoFill = (transcript) => {
    const extracted = parseSpokenSoilData(transcript);
    if (Object.keys(extracted).length > 0) {
      if (extracted.npkUnit && extracted.npkUnit !== npkUnit) {
        setNpkUnit(extracted.npkUnit);
      }
      const dataToApply = { ...extracted };
      delete dataToApply.npkUnit;

      setForm((prev) => ({
        ...prev,
        ...dataToApply,
      }));
      if (result) setResult(null);
      if (error) setError("");
      const keysCount = Object.keys(dataToApply).length;
      setVoiceToast(
        language === "mr"
          ? `✅ व्हॉइस इनपुटवरून ${keysCount} घटक भरले गेले!`
          : language === "hi"
          ? `✅ वॉइस इनपुट से ${keysCount} पैरामीटर भरे गए!`
          : `✅ Auto-filled ${keysCount} soil parameters from voice!`
      );
      setTimeout(() => setVoiceToast(""), 4500);
    } else {
      setVoiceToast(
        language === "mr"
          ? "कोणतेही माती घटक ओळखले नाहीत. कृपया उदा. 'नायट्रोजन ५०, फॉस्फरस ३०, पाऊस १२०' असे बोला."
          : language === "hi"
          ? "कोई पोषक तत्व नहीं पहचाने गए। कृपया उदा. 'नाइट्रोजन 50, फास्फोरस 30, वर्षा 120' बोलें।"
          : "No parameters detected. Try saying 'Nitrogen 50, Phosphorus 30, Rainfall 120'."
      );
      setTimeout(() => setVoiceToast(""), 4500);
    }
  };

  const handleSingleFieldVoice = (field, val) => {
    setForm((prev) => ({
      ...prev,
      [field]: val,
    }));
    if (result) setResult(null);
    if (error) setError("");
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (result) {
      setResult(null);
    }

    if (error) {
      setError("");
    }
  };

  const handleRecommend = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);

    const values = Object.values(form);

    if (values.some((value) => value === "")) {
      setError(t("fillAllFields"));
      return;
    }

    const numericValues = values.map(Number);

    if (
      numericValues.some(
        (value) => Number.isNaN(value)
      )
    ) {
      setError(t("invalidNumericValues"));
      return;
    }

    const phNum = Number(form.ph);
    const tempNum = Number(form.temperature);
    const areaNum = Number(form.area);

    if (!areaNum || isNaN(areaNum) || areaNum <= 0) {
      setError(
        language === "mr"
          ? "कृपया योग्य शेतजमीन क्षेत्र (एकर) टाका (उदा. ५ एकर)."
          : language === "hi"
          ? "कृपया मान्य खेत का क्षेत्रफल (एकड़) दर्ज करें (उदा. ५ एकड़)।"
          : "Please enter a valid farmland area in acres (e.g. 5 acres)."
      );
      return;
    }

    // Strict Agricultural Boundaries Validation:
    // If pH < 0 or pH > 14 or Temperature > 50, block recommendation completely!
    if (phNum < 0.0 || phNum > 14.0) {
      setResult(null);
      setError(phWarningMessage);
      return;
    }

    if (tempNum > 50.0) {
      setResult(null);
      setError(tempWarningMessage);
      return;
    }

    setLoading(true);

    try {
      // Normalize N, P, K to standard kg/ha for the RandomForest ML Model:
      // (The agronomic ML model expects kg/ha benchmarks, where 1 ha = 2.47105 acres)
      const normN = npkUnit === "kg/acre" ? Math.round(Number(form.nitrogen) * 2.47105) : Number(form.nitrogen);
      const normP = npkUnit === "kg/acre" ? Math.round(Number(form.phosphorus) * 2.47105) : Number(form.phosphorus);
      const normK = npkUnit === "kg/acre" ? Math.round(Number(form.potassium) * 2.47105) : Number(form.potassium);

      const requestData = {
        N: normN,
        P: normP,
        K: normK,
        raw_n: Number(form.nitrogen),
        raw_p: Number(form.phosphorus),
        raw_k: Number(form.potassium),
        npk_unit: npkUnit,
        is_normalized: true,
        temperature: tempNum,
        humidity: Number(form.humidity),
        ph: phNum,
        rainfall: Number(form.rainfall),
        area: areaNum,
      };

      const response = await fetch(
        buildApiUrl("/recommend"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        const err = new Error(
          data.message ||
            t("recommendationFailed")
        );
        err.status = response.status;
        err.field = data.field;
        throw err;
      }

      const recommendation = {
        crop: data.recommended_crop,
        confidence: data.confidence || 88.0,
        topRecommendations: data.top_recommendations || [],
        area: areaNum,
        npkUnit: npkUnit,
        nitrogen: Number(form.nitrogen),
        phosphorus: Number(form.phosphorus),
        potassium: Number(form.potassium),
        nitrogenKgHa: normN,
        phosphorusKgHa: normP,
        potassiumKgHa: normK,
        temperature: tempNum,
        humidity: Number(form.humidity),
        ph: phNum,
        rainfall: Number(form.rainfall),
      };

      setResult(recommendation);

      addRecommendation(recommendation);
    } catch (err) {
      // If validation rejection from server or agricultural constraint violated:
      // strictly do NOT recommend any crop!
      if (err.status === 400 || phNum < 0.0 || phNum > 14.0 || tempNum > 50.0) {
        setResult(null);
        setError(err.message || (phNum < 0.0 || phNum > 14.0 ? phWarningMessage : tempWarningMessage));
        return;
      }

      console.warn("Recommendation fetch failed, using offline soil agronomy rules:", err);

      const rawN = Number(form.nitrogen) || (npkUnit === "kg/acre" ? 20 : 50);
      const rawP = Number(form.phosphorus) || (npkUnit === "kg/acre" ? 20 : 50);
      const rawK = Number(form.potassium) || (npkUnit === "kg/acre" ? 20 : 50);
      const n = npkUnit === "kg/acre" ? Math.round(rawN * 2.47105) : rawN;
      const p = npkUnit === "kg/acre" ? Math.round(rawP * 2.47105) : rawP;
      const k = npkUnit === "kg/acre" ? Math.round(rawK * 2.47105) : rawK;
      const rain = Number(form.rainfall) || 600;
      const ph = phNum || 6.5;

      let offlineCrop = "Wheat";
      if (rain > 1000 && n > 70) {
        offlineCrop = "Rice";
      } else if (n > 80 && k > 60) {
        offlineCrop = "Sugarcane";
      } else if (n >= 40 && n <= 70 && p >= 40) {
        offlineCrop = "Soybean";
      } else if (n >= 50 && rain <= 600) {
        offlineCrop = "Cotton";
      } else if (n < 40) {
        offlineCrop = "Chickpea";
      } else if (k > 50 && rain > 800) {
        offlineCrop = "Banana";
      } else {
        offlineCrop = "Maize";
      }

      const offlineRecommendation = {
        crop: offlineCrop,
        confidence: 88.0,
        isOfflineEstimate: true,
        topRecommendations: [
          { crop: offlineCrop, confidence: 88.0 },
          { crop: "Soybean", confidence: 72.0 },
          { crop: "Maize", confidence: 60.0 }
        ],
        area: areaNum,
        npkUnit: npkUnit,
        nitrogen: rawN,
        phosphorus: rawP,
        potassium: rawK,
        nitrogenKgHa: n,
        phosphorusKgHa: p,
        potassiumKgHa: k,
        temperature: tempNum || 28,
        humidity: Number(form.humidity) || 65,
        ph: ph,
        rainfall: rain,
      };

      setResult(offlineRecommendation);
      addRecommendation(offlineRecommendation);

      setError(
        language === "mr"
          ? "📴 ऑफलाइन शिफारस: सर्व्हर अनुपलब्ध असल्यामुळे माती घटकांच्या मानकांनुसार तात्काळ योग्य पीक सुचवले आहे."
          : language === "hi"
          ? "📴 ऑफलाइन सिफारिश: सर्वर से कनेक्ट न होने पर मृदा पोषक मानकों के अनुसार उपयुक्त फसल सुझाई गई है।"
          : "📴 Offline Recommendation: Generated using soil agronomy benchmarks as server is offline."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      nitrogen: "",
      phosphorus: "",
      potassium: "",
      temperature: "",
      humidity: "",
      ph: "",
      rainfall: "",
      area: defaultArea,
    });

    setUnitToast("");
    setResult(null);
    setError("");
  };

  const npkUnitSuffix = npkUnit === "kg/acre"
    ? (language === "mr" ? "किलो/एकर" : language === "hi" ? "किग्रा/एकड़" : "kg/acre")
    : (language === "mr" ? "किलो/हेक्टर" : language === "hi" ? "किग्रा/हेक्टर" : "kg/ha");

  return (
    <div className="space-y-6 p-4 sm:p-6">

      {/* HEADER */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#174B1B] via-[#2E7D32] to-[#10B981] p-6 text-white shadow-lg sm:p-8">

        <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10" />

        <div className="absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-white/10" />

        <div className="relative z-10 flex items-center justify-between gap-6">

          <div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-semibold backdrop-blur-sm">
              <Sparkles size={13} />
              {t("aiCropRecommendation")}
            </div>

            <h1 className="text-2xl font-extrabold sm:text-3xl">
              {t("cropRecommendation")}
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-6 text-green-50/80 sm:text-sm">
              {t("recommendationDescription")}
            </p>

          </div>

          <div className="hidden rounded-3xl bg-white/10 p-5 backdrop-blur-md lg:block">
            <Leaf
              size={55}
              strokeWidth={1.3}
            />
          </div>

        </div>
      </div>


      {/* ERROR */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 animate-fade-in shadow-sm">

          <AlertCircle
            size={22}
            className="mt-0.5 shrink-0 text-red-500"
          />

          <div>

            <p className="text-sm font-bold text-red-700">
              {(error.includes("7.0") || error.includes("50") || error.includes("अल्कधर्मी") || error.includes("क्षारीय") || error.includes("उष्णतेमुळे") || error.includes("गर्मी") || error.includes("alkaline") || error.includes("Extreme heat"))
                ? (language === "mr" ? "⚠️ शेती नियम मर्यादा उल्लंघन / शिफारस रोखली" : language === "hi" ? "⚠️ कृषि नियम सीमा उल्लंघन / सिफारिश रोकी गई" : "⚠️ Agricultural Boundary Violation / Recommendation Blocked")
                : t("error")}
            </p>

            <p className="mt-1 text-xs leading-5 text-red-600 font-semibold">
              {error}
            </p>

            {!(error.includes("7.0") || error.includes("50") || error.includes("अल्कधर्मी") || error.includes("क्षारीय") || error.includes("उष्णतेमुळे") || error.includes("गर्मी") || error.includes("alkaline") || error.includes("Extreme heat") || error.includes("📴")) && (
              <p className="mt-2 text-[11px] leading-5 text-red-500">
                {t("makeSureBackendRunning")}
              </p>
            )}

          </div>

        </div>
      )}


      {/* MAIN CONTENT */}

      <div className="grid gap-6 xl:grid-cols-[1.55fr_0.85fr]">

        {/* FORM */}

        <div className="overflow-hidden rounded-3xl border border-[#DCE8D9] bg-white shadow-sm">

          <div className="border-b border-[#E8EFE6] bg-gradient-to-r from-[#F7FBF5] to-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3E6] text-[#2E7D32]">
                <Sprout size={23} />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-gray-800">
                  {t("soilClimateInformation")}
                </h2>
                <p className="mt-1 text-[11px] text-gray-400">
                  {t("enterFarmConditions")}
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleRecommend}
            className="grid gap-5 p-6 sm:grid-cols-2"
          >
            {/* 1-CLICK QUICK SAMPLE TEST PRESETS */}
            <div className="col-span-1 sm:col-span-2 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50/70 via-green-50/50 to-teal-50/60 p-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">🎯</span>
                  <span className="text-xs font-black text-emerald-950">
                    {language === "mr"
                      ? "जलद नमुना चाचणी (1-Click Sample Presets):"
                      : language === "hi"
                      ? "त्वरित नमूना परीक्षण (1-Click Sample Presets):"
                      : "1-Click Crop Test Presets:"}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-800/80 font-medium">
                  {language === "mr"
                    ? "कोणत्याही पिकावर क्लिक करून अचूक माती घटक आपोआप भरा"
                    : language === "hi"
                    ? "किसी भी फसल पर क्लिक कर सटीक मृदा मान स्वतः भरें"
                    : "Click any crop chip to auto-populate agronomic benchmarks"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_PRESETS.map((p) => {
                  const expectedN = npkUnit === "kg/acre"
                    ? String(Math.round((Number(p.values.nitrogen) / 2.47105) * 10) / 10)
                    : p.values.nitrogen;
                  const isSelected = form.nitrogen === expectedN && form.rainfall === p.values.rainfall;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#2E7D32] text-white shadow-sm ring-2 ring-emerald-400"
                          : "bg-white text-emerald-900 hover:bg-emerald-100/70 border border-emerald-200 shadow-2xs hover:-translate-y-0.5"
                      }`}
                    >
                      <span>{p.icon}</span>
                      <span>{p.name[language] || p.name.en}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SMART VOICE AUTO-FILL BANNER */}
            <div className="col-span-1 sm:col-span-2 rounded-2xl border border-green-200 bg-gradient-to-r from-[#F0F8ED] via-[#F7FCF5] to-white p-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <VoiceMicButton onTranscript={handleVoiceSoilAutoFill} size="md" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1B5E20]">
                      {language === "mr"
                        ? "🎙️ बोलून माती घटक भरा (Voice Auto-Fill)"
                        : language === "hi"
                        ? "🎙️ बोलकर मृदा पैरामीटर भरें (Voice Auto-Fill)"
                        : "🎙️ Dictate Soil & Climate Parameters (Voice Auto-Fill)"}
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      {language === "mr"
                        ? 'उदा. "नायट्रोजन ५०, फॉस्फरस ३०, पोटॅशियम ४०, पाऊस १२०, सामू ६.५, ५ एकर"'
                        : language === "hi"
                        ? 'उदा. "नाइट्रोजन 50, फास्फोरस 30, पोटाश 40, वर्षा 120, पीएच 6.5, 5 एकड़"'
                        : 'e.g. "Nitrogen 50, Phosphorus 30, Potassium 40, Rainfall 120, pH 6.5, 5 acres"'}
                    </p>
                  </div>
                </div>
              </div>
              {voiceToast && (
                <div className="mt-2.5 rounded-xl bg-white border border-green-300 p-2 text-xs font-semibold text-[#1B5E20] animate-fade-in flex items-center gap-1.5">
                  <span>{voiceToast}</span>
                </div>
              )}
            </div>

            {/* N-P-K MEASUREMENT UNIT SELECTOR (kg/ha vs kg/acre) */}
            <div className="col-span-1 sm:col-span-2 rounded-2xl border border-emerald-300/90 bg-gradient-to-r from-emerald-50/90 via-teal-50/40 to-white p-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-[#1B5E20] text-white shadow-xs text-base">
                    ⚖️
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-black text-emerald-950">
                        {language === "mr"
                          ? "माती पोषण मोजण्याचे एकक (N-P-K Unit)"
                          : language === "hi"
                          ? "मृदा पोषक तत्व मापन इकाई (N-P-K Unit)"
                          : "Soil Nutrient Measurement Unit (N-P-K)"}
                      </h4>
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {npkUnit === "kg/acre" ? "kg/acre (किलो / एकर)" : "kg/ha (किलो / हेक्टर)"}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {language === "mr"
                        ? "माती परीक्षण कार्डानुसार निवडा. एकक बदलल्यास भरलेली मूल्ये आपोआप रूपांतरित होतात (१ हेक्टर = २.४७ एकर)"
                        : language === "hi"
                        ? "मृदा कार्ड अनुसार इकाई चुनें। बदलने पर प्रविष्ट मान स्वतः परिवर्तित होते हैं (1 हेक्टेयर = 2.47 एकड़)"
                        : "Choose according to your soil card. Values auto-convert on switch (1 ha = 2.471 acres)"}
                    </p>
                  </div>
                </div>

                {/* 2-BUTTON SEGMENTED SWITCH */}
                <div className="flex items-center p-1 rounded-xl bg-white border border-emerald-300 shadow-2xs self-start sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleNpkUnitChange("kg/ha")}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      npkUnit === "kg/ha"
                        ? "bg-[#2E7D32] text-white shadow-xs"
                        : "text-gray-600 hover:text-emerald-800 hover:bg-emerald-50"
                    }`}
                  >
                    <span>🌾</span>
                    <span>{language === "mr" ? "किलो / हेक्टर" : language === "hi" ? "किग्रा / हेक्टर" : "kg / ha"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNpkUnitChange("kg/acre")}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      npkUnit === "kg/acre"
                        ? "bg-[#2E7D32] text-white shadow-xs"
                        : "text-gray-600 hover:text-emerald-800 hover:bg-emerald-50"
                    }`}
                  >
                    <span>📐</span>
                    <span>{language === "mr" ? "किलो / एकर" : language === "hi" ? "किग्रा / एकड़" : "kg / acre"}</span>
                  </button>
                </div>
              </div>

              {unitToast && (
                <div className="mt-2.5 rounded-xl bg-emerald-100/90 border border-emerald-300 p-2 text-xs font-bold text-emerald-900 animate-fade-in flex items-center gap-2">
                  <span>{unitToast}</span>
                </div>
              )}
            </div>

            <NumberInput
              label={
                language === "mr"
                  ? `नायट्रोजन (नत्र - N) [${npkUnitSuffix}]`
                  : language === "hi"
                  ? `नाइट्रोजन (नत्र - N) [${npkUnitSuffix}]`
                  : `Nitrogen (N) [${npkUnit}]`
              }
              name="nitrogen"
              value={form.nitrogen}
              onChange={handleChange}
              onVoiceInput={(val) => handleSingleFieldVoice("nitrogen", val)}
              placeholder={npkUnit === "kg/acre" ? "उदा. 15 - 50" : "उदा. 40 - 120"}
              icon={<Activity size={15} />}
              suffix={npkUnitSuffix}
            />

            <NumberInput
              label={
                language === "mr"
                  ? `फॉस्फरस (स्फुरद - P) [${npkUnitSuffix}]`
                  : language === "hi"
                  ? `फास्फोरस (स्फुरद - P) [${npkUnitSuffix}]`
                  : `Phosphorus (P) [${npkUnit}]`
              }
              name="phosphorus"
              value={form.phosphorus}
              onChange={handleChange}
              onVoiceInput={(val) => handleSingleFieldVoice("phosphorus", val)}
              placeholder={npkUnit === "kg/acre" ? "उदा. 8 - 35" : "उदा. 20 - 90"}
              icon={<Activity size={15} />}
              suffix={npkUnitSuffix}
            />

            <NumberInput
              label={
                language === "mr"
                  ? `पोटॅशियम (पालाश - K) [${npkUnitSuffix}]`
                  : language === "hi"
                  ? `पोटाश (पालाश - K) [${npkUnitSuffix}]`
                  : `Potassium (K) [${npkUnit}]`
              }
              name="potassium"
              value={form.potassium}
              onChange={handleChange}
              onVoiceInput={(val) => handleSingleFieldVoice("potassium", val)}
              placeholder={npkUnit === "kg/acre" ? "उदा. 6 - 40" : "उदा. 15 - 100"}
              icon={<Activity size={15} />}
              suffix={npkUnitSuffix}
            />

            <NumberInput
              label={t("temperature")}
              name="temperature"
              value={form.temperature}
              onChange={handleChange}
              onVoiceInput={(val) => handleSingleFieldVoice("temperature", val)}
              placeholder="e.g. 18 - 35 (max 50°C)"
              icon={<Thermometer size={15} />}
              suffix="°C"
              step="0.1"
              max="50"
              error={tempWarningMessage}
            />

            <NumberInput
              label={t("humidity")}
              name="humidity"
              value={form.humidity}
              onChange={handleChange}
              onVoiceInput={(val) => handleSingleFieldVoice("humidity", val)}
              placeholder="e.g. 30 - 90"
              icon={<Droplets size={15} />}
              suffix="%"
              step="0.1"
            />

            <NumberInput
              label={t("soilPh")}
              name="ph"
              value={form.ph}
              onChange={handleChange}
              onVoiceInput={(val) => handleSingleFieldVoice("ph", val)}
              placeholder="e.g. 5.5 - 8.5 (0 - 14)"
              icon={<FlaskConical size={15} />}
              suffix="pH"
              step="0.01"
              min="0"
              max="14.0"
              error={phWarningMessage}
            />

            <NumberInput
              label={t("rainfall")}
              name="rainfall"
              value={form.rainfall}
              onChange={handleChange}
              onVoiceInput={(val) => handleSingleFieldVoice("rainfall", val)}
              placeholder="e.g. 60 - 250"
              icon={<CloudRain size={15} />}
              suffix="mm"
              step="0.1"
            />

            <NumberInput
              label={
                language === "mr"
                  ? "शेतजमीन क्षेत्र (एकर)"
                  : language === "hi"
                  ? "खेत का क्षेत्रफल (एकड़)"
                  : "Farmland Area (Acres)"
              }
              name="area"
              value={form.area}
              onChange={handleChange}
              onVoiceInput={(val) => handleSingleFieldVoice("area", val)}
              placeholder="e.g. 5"
              icon={<MapPin size={15} />}
              suffix={language === "mr" ? "एकर" : language === "hi" ? "एकड़" : "Acres"}
              step="0.5"
            />

            <div className="flex gap-3 pt-2 sm:col-span-2">
              <button
                type="submit"
                disabled={loading || hasValidationError}
                title={
                  hasValidationError
                    ? (language === "mr"
                        ? "अवैध इनपुट: मातीचा सामू (pH) ० ते १४ आणि तापमान ≤ ५०°C असणे आवश्यक आहे"
                        : language === "hi"
                        ? "अमान्य इनपुट: मिट्टी का pH 0 से 14 और तापमान ≤ 50°C होना आवश्यक है"
                        : "Invalid inputs: Soil pH must be 0 to 14 and Temperature must be ≤ 50°C")
                    : ""
                }
                className={`btn-shimmer btn-glow group flex flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-xs font-bold text-white shadow-md transition duration-300 ${
                  hasValidationError
                    ? "bg-gray-400 cursor-not-allowed opacity-75 shadow-none"
                    : "bg-gradient-to-r from-[#2E7D32] to-[#10B981] hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    {t("analyzingConditions")}
                  </>
                ) : (
                  <>
                    <Sprout size={16} />
                    {t("recommendBestCrop")}
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1.5"
                    />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="key-cap rounded-2xl border border-[#DCE8D9] bg-white px-4 py-3.5 text-gray-500 transition hover:bg-[#EAF3E6] hover:text-[#2E7D32] disabled:opacity-50 cursor-pointer"
                title={t("reset")}
                aria-label={t("reset")}
              >
                <RotateCcw size={16} />
              </button>
            </div>

          </form>
        </div>


        {/* SIDE INFORMATION */}

        <div className="relative overflow-hidden rounded-3xl border border-[#DCE8D9] bg-white shadow-sm">

          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#EAF3E6]" />

          <div className="relative z-10 p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF3E6] text-[#2E7D32]">
                <Sparkles size={20} />
              </div>

              <div>

                <h2 className="text-sm font-extrabold text-gray-800">
                  {t("howKrushiMitraWorks")}
                </h2>

                <p className="mt-1 text-[10px] text-gray-400">
                  {t("aiCropSuitabilityAnalysis")}
                </p>

              </div>

            </div>

            <div className="mt-7 space-y-4">

              <InfoItem
                number="01"
                title={t("soilAnalysis")}
                text={t("soilAnalysisDescription")}
              />

              <InfoItem
                number="02"
                title={t("climateAnalysis")}
                text={t("climateAnalysisDescription")}
              />

              <InfoItem
                number="03"
                title={t("aiRecommendation")}
                text={t("aiRecommendationDescription")}
              />

            </div>

            <div className="mt-7 rounded-2xl bg-[#F6F9F4] p-4">

              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {t("parameters")}
              </p>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">

                <MiniStat
                  label={`N (${npkUnit})`}
                  value={form.nitrogen ? `${form.nitrogen} ${npkUnit}` : "--"}
                />

                <MiniStat
                  label={`P (${npkUnit})`}
                  value={form.phosphorus ? `${form.phosphorus} ${npkUnit}` : "--"}
                />

                <MiniStat
                  label={`K (${npkUnit})`}
                  value={form.potassium ? `${form.potassium} ${npkUnit}` : "--"}
                />

                <MiniStat
                  label="pH"
                  value={form.ph || "--"}
                />

                <div className="col-span-2 sm:col-span-2">
                  <MiniStat
                    label={language === "mr" ? "शेतजमीन क्षेत्र" : language === "hi" ? "खेत का क्षेत्रफल" : "Target Area"}
                    value={form.area ? `${form.area} ${language === "mr" ? "एकर" : language === "hi" ? "एकड़" : "Acres"}` : "--"}
                  />
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* RESULT */}

      {result && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#174B1B] via-[#2E7D32] to-[#10B981] p-6 text-white shadow-[0_20px_50px_rgba(46,125,50,0.3)] sm:p-8 animate-zoom-fade depth-3 glow-emerald border border-white/20">

          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/15 blur-2xl animate-float-slow" />
          <div className="pointer-events-none absolute -bottom-20 right-20 h-48 w-48 rounded-full bg-yellow-300/15 blur-3xl" />

          <div className="relative z-10">

            <div className="flex items-center gap-2 text-green-100">

              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                <CheckCircle2 size={14} className="text-white" />
              </span>

              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/15 px-2.5 py-1 rounded-full backdrop-blur-xs">
                {t("aiRecommendationComplete")}
              </span>

            </div>

            <div className="mt-6">

              <p className="text-xs font-semibold text-green-100">
                {t("recommendedCrop")}
              </p>

              <h2 className="mt-2 text-4xl font-black sm:text-5xl flex items-center gap-3 tracking-tight">
                <span className="animate-float-slow inline-block select-none filter drop-shadow-md">🌾</span>
                <span className="drop-shadow-sm">{tCrop(result.crop)}</span>
              </h2>

              <p className="mt-3 max-w-xl text-xs leading-5 text-green-50/90 font-medium">
                {t("recommendationResultDescription")}
              </p>

              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-white border border-white/25">
                  <MapPin size={14} className="text-yellow-300" />
                  <span>
                    {language === "mr"
                      ? `शिफारस केलेले शेतजमीन क्षेत्र: ${result.area || form.area || 5} एकर`
                      : language === "hi"
                      ? `अनुशंसित खेत का क्षेत्रफल: ${result.area || form.area || 5} एकड़`
                      : `Recommended Farmland Area: ${result.area || form.area || 5} Acres`}
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-black/25 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-green-100 border border-white/20">
                  <span>⚖️</span>
                  <span>
                    {language === "mr"
                      ? `माती पोषण: N ${result.nitrogen ?? form.nitrogen} | P ${result.phosphorus ?? form.phosphorus} | K ${result.potassium ?? form.potassium} (${result.npkUnit === "kg/acre" ? "किलो/एकर" : "किलो/हेक्टर"})`
                      : language === "hi"
                      ? `मृदा पोषक: N ${result.nitrogen ?? form.nitrogen} | P ${result.phosphorus ?? form.phosphorus} | K ${result.potassium ?? form.potassium} (${result.npkUnit === "kg/acre" ? "किग्रा/एकड़" : "किग्रा/हेक्टर"})`
                      : `Nutrients: N ${result.nitrogen ?? form.nitrogen} | P ${result.phosphorus ?? form.phosphorus} | K ${result.potassium ?? form.potassium} (${result.npkUnit || "kg/ha"})`}
                  </span>
                </div>
              </div>

            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">

              {/* 1-Click Bridge to Crop Yield Prediction for Maharashtra's major field crops */}
              {(() => {
                const YIELD_PREDICTION_CROPS = {
                  cotton: "Cotton",
                  soybean: "Soybean",
                  sugarcane: "Sugarcane",
                  wheat: "Wheat",
                  rice: "Rice",
                  chickpea: "Gram",
                  gram: "Gram",
                  pigeonpeas: "Tur",
                  tur: "Tur",
                };
                const cropKey = (result.crop || "").toLowerCase().trim();
                const mappedCrop = YIELD_PREDICTION_CROPS[cropKey];
                const targetArea = Number(result.area || form.area || 5);

                if (mappedCrop) {
                  return (
                    <button
                      type="button"
                      onClick={() =>
                        nav &&
                        nav("prediction", {
                          crop: mappedCrop,
                          rainfall: form.rainfall || "",
                          temperature: form.temperature || "",
                          area: targetArea,
                        })
                      }
                      className="btn-shimmer flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-gray-950 px-5 py-3 text-xs font-black shadow-lg transition hover:-translate-y-0.5 active:scale-95 cursor-pointer border border-amber-200"
                    >
                      <TrendingUp size={15} className="text-gray-900" />
                      <span>
                        {language === "mr"
                          ? `📈 ${tCrop ? tCrop(result.crop) : result.crop}चे ${targetArea} एकरासाठी उत्पादन मोजा`
                          : language === "hi"
                          ? `📈 ${tCrop ? tCrop(result.crop) : result.crop} का ${targetArea} एकड़ हेतु उत्पादन मापें`
                          : `📈 Predict ${tCrop ? tCrop(result.crop) : result.crop} Yield for ${targetArea} Acres`}
                      </span>
                      <ArrowRight size={14} />
                    </button>
                  );
                }

                return null;
              })()}

              <button
                onClick={resetForm}
                className="btn-shimmer btn-glow flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-extrabold text-[#2E7D32] shadow-md transition hover:-translate-y-0.5 hover:bg-green-50 active:scale-95 cursor-pointer"
              >
                <RotateCcw size={14} />
                {t("newRecommendation")}
              </button>

              <button
                type="button"
                onClick={() =>
                  openWhatsAppShare(
                    formatRecommendationShareText({
                      crop: tCrop ? tCrop(result.crop) : result.crop,
                      nitrogen: result.nitrogen ?? form.nitrogen ?? "--",
                      phosphorus: result.phosphorus ?? form.phosphorus ?? "--",
                      potassium: result.potassium ?? form.potassium ?? "--",
                      ph: result.ph ?? form.ph ?? "--",
                      area: result.area || form.area || 5,
                      confidence: result.confidence ? Math.round(result.confidence) : 95,
                      lang: language,
                      npkUnit: result.npkUnit || npkUnit,
                    })
                  )
                }
                className="flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-3 text-xs font-extrabold shadow-md transition hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                title="Share on WhatsApp"
              >
                <Share2 size={14} />
                <span>{language === "mr" ? "WhatsApp वर सल्ला शेअर करा" : language === "hi" ? "व्हाट्सएप पर शेयर करें" : "Share Advisory on WhatsApp"}</span>
              </button>

            </div>

            {/* FARM SCALE AGRONOMIC PLANNING CARD FOR TARGET ACREAGE */}
            {(() => {
              const cropKey = (result.crop || "").toLowerCase().trim();
              const plan = CROP_AREA_PLANNING[cropKey];
              const targetArea = Number(result.area || form.area || 5);

              if (!plan || targetArea <= 0) return null;

              const totalYield = (plan.yieldAcre * targetArea).toFixed(1);
              const totalSeed = (plan.seedRate * targetArea).toLocaleString();
              const seedUnitText = plan.seedUnit[language] || plan.seedUnit.en;
              const dapBags = (plan.dapBagsPerAcre * targetArea).toFixed(1);
              const ureaBags = (plan.ureaBagsPerAcre * targetArea).toFixed(1);
              const spacingText = plan.spacing[language] || plan.spacing.en;

              return (
                <div className="mt-6 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 p-5 sm:p-6 text-white shadow-inner animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/15">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📐</span>
                      <div>
                        <h3 className="text-sm font-black tracking-tight flex items-center gap-2">
                          <span>
                            {language === "mr"
                              ? `शेत नियोजन: ${targetArea} एकर क्षेत्रासाठी लागणारे निविष्ठा व उत्पादन`
                              : language === "hi"
                              ? `फार्म प्लानिंग: ${targetArea} एकड़ क्षेत्र हेतु इनपुट व उपज गणना`
                              : `Farm Planning: Inputs & Harvest for ${targetArea} Acres`}
                          </span>
                        </h3>
                        <p className="text-[11px] text-green-100/80">
                          {language === "mr"
                            ? "कृषी विद्यापीठ व पॅकेज ऑफ प्रॅक्टिसवर आधारित अचूक अंदाज"
                            : language === "hi"
                            ? "कृषि विश्वविद्यालय मानकों पर आधारित सटीक अनुमान"
                            : "Calibrated to Maharashtra SAU Package of Practices"}
                        </p>
                      </div>
                    </div>
                    <span className="self-start sm:self-center px-3 py-1 rounded-full bg-yellow-400 text-gray-950 text-xs font-black shadow-xs">
                      {targetArea} {language === "mr" ? "एकर क्षेत्र" : language === "hi" ? "एकड़ क्षेत्र" : "Acres"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="rounded-xl bg-black/20 p-3 border border-white/10">
                      <span className="text-[10px] text-green-200 uppercase font-bold block">
                        {language === "mr" ? "अंदाजित एकूण उत्पादन" : language === "hi" ? "कुल अनुमानित उपज" : "Estimated Harvest"}
                      </span>
                      <span className="text-base sm:text-lg font-black text-yellow-300 block mt-0.5">
                        ~{totalYield} {language === "mr" ? "टन" : language === "hi" ? "टन" : "Tonnes"}
                      </span>
                      <span className="text-[9.5px] text-white/70 block mt-0.5">
                        ({plan.yieldAcre} {language === "mr" ? "टन/एकर" : language === "hi" ? "टन/एकड़" : "t/acre"})
                      </span>
                    </div>

                    <div className="rounded-xl bg-black/20 p-3 border border-white/10">
                      <span className="text-[10px] text-green-200 uppercase font-bold block">
                        {language === "mr" ? "आवश्यक बियाणे / रोपे" : language === "hi" ? "बीज / पौधे की मात्रा" : "Total Seed Needed"}
                      </span>
                      <span className="text-base sm:text-lg font-black text-white block mt-0.5">
                        {totalSeed} {seedUnitText}
                      </span>
                      <span className="text-[9.5px] text-white/70 block mt-0.5">
                        ({plan.seedRate} {seedUnitText}/acre)
                      </span>
                    </div>

                    <div className="rounded-xl bg-black/20 p-3 border border-white/10">
                      <span className="text-[10px] text-green-200 uppercase font-bold block">
                        {language === "mr" ? "रासायनिक खते (बॅग)" : language === "hi" ? "उर्वरक आवश्यकता (बैग)" : "Fertilizers (Bags)"}
                      </span>
                      <span className="text-sm sm:text-base font-black text-white block mt-0.5">
                        DAP: {dapBags} | Urea: {ureaBags}
                      </span>
                      <span className="text-[9.5px] text-white/70 block mt-0.5">
                        {language === "mr" ? "DAP व युरिया बॅग्स" : language === "hi" ? "डीएपी व यूरिया बैग्स" : "DAP & Urea Bags"}
                      </span>
                    </div>

                    <div className="rounded-xl bg-black/20 p-3 border border-white/10">
                      <span className="text-[10px] text-green-200 uppercase font-bold block">
                        {language === "mr" ? "शिफारस केलेले अंतर" : language === "hi" ? "अनुशंसित दूरी" : "Plant Spacing"}
                      </span>
                      <span className="text-sm sm:text-base font-black text-cyan-200 block mt-0.5">
                        {spacingText}
                      </span>
                      <span className="text-[9.5px] text-white/70 block mt-0.5">
                        {language === "mr" ? "ओळ व रोपांतील अंतर" : language === "hi" ? "कतार व पौधों की दूरी" : "Row x Plant distance"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* TOP ALTERNATIVE CROP CANDIDATES WITH PROBABILITY BARS */}
            {result.topRecommendations && result.topRecommendations.length > 1 && (
              <div className="mt-6 rounded-2xl bg-white/10 backdrop-blur-md p-4 sm:p-5 border border-white/20">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-yellow-300" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-green-100">
                      {language === "mr"
                        ? "इतर पर्यायी शिफारसी व संभाव्यता (Alternative Crop Candidates)"
                        : language === "hi"
                        ? "वैकल्पिक फसल संभावनाएं (Alternative Crop Candidates)"
                        : "Alternative Crop Candidates & Confidence"}
                    </h3>
                  </div>
                  <span className="text-[10px] text-green-200/80 font-medium">
                    {language === "mr"
                      ? "मल्टी-क्लास ML मॉडेल विश्लेषण"
                      : language === "hi"
                      ? "मल्टी-क्लास ML मॉडल विश्लेषण"
                      : "Multi-Class ML Probability"}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {result.topRecommendations.slice(0, 3).map((cand, idx) => {
                    const isPrimary = cand.crop.toLowerCase() === result.crop.toLowerCase();
                    return (
                      <div
                        key={idx}
                        className={`rounded-xl p-3 border transition ${
                          isPrimary
                            ? "bg-white/25 border-yellow-300 shadow-sm"
                            : "bg-black/20 border-white/10 hover:bg-black/30"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                            <span>{idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}</span>
                            <span>{tCrop ? tCrop(cand.crop) : cand.crop}</span>
                          </span>
                          <span
                            className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                              isPrimary
                                ? "bg-yellow-400 text-gray-950"
                                : "bg-white/20 text-green-100"
                            }`}
                          >
                            {cand.confidence}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-white/15 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isPrimary ? "bg-yellow-400" : "bg-emerald-300"
                            }`}
                            style={{ width: `${Math.min(cand.confidence, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Non-field / Orchard Crop Clarification Badge */}
            {(() => {
              const YIELD_PREDICTION_CROPS = {
                cotton: "Cotton",
                soybean: "Soybean",
                sugarcane: "Sugarcane",
                wheat: "Wheat",
                rice: "Rice",
                chickpea: "Gram",
                gram: "Gram",
                pigeonpeas: "Tur",
                tur: "Tur",
              };
              const cropKey = (result.crop || "").toLowerCase().trim();
              if (!YIELD_PREDICTION_CROPS[cropKey]) {
                return (
                  <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-black/25 backdrop-blur-md p-3 text-xs text-green-100 border border-white/15">
                    <span className="text-base">ℹ️</span>
                    <div>
                      <strong className="font-bold text-white">
                        {language === "mr"
                          ? "फळबाग व बहुवार्षिक पीक (Perennial Orchard):"
                          : language === "hi"
                          ? "फल एवं बागवानी फसल (Perennial Orchard):"
                          : "Perennial Orchard & Horticulture Crop:"}
                      </strong>{" "}
                      {language === "mr"
                        ? "या पिकाचे उत्पादन झाडाचे वय, छाटणी व मशागतीवर अवलंबून असते. महाराष्ट्र शासनाचे सांख्यिकी मॉडेल ७ प्रमुख वार्षिक अन्नधान्य व नगदी पिकांच्या (कापूस, सोयाबीन, ऊस, गहू, भात, हरभरा, तूर) एकरी उत्पादनासाठी विशेष तयार केलेले आहे."
                        : language === "hi"
                        ? "इस फसल की उपज वृक्ष की आयु, छंटाई एवं छत्र प्रबंधन पर निर्भर है। महाराष्ट्र राज्य सांख्यिकी मॉडल 7 प्रमुख वार्षिक नकदी व खाद्यान्न फसलों (कपास, सोयाबीन, गन्ना, गेहूं, धान, चना, अरहर) के एकड़ उपज अनुमान हेतु विशेष रूप से प्रशिक्षित है।"
                        : "Yield for orchard/fruit crops depends on tree maturity, pruning, and canopy management. The state econometric regression engine specifically calibrates metric yield (tonnes/acre) for Maharashtra's 7 primary annual staple and commercial cash crops."}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* AGRONOMIC RECOMMENDATION REASONING CARD */}
            {reasoning && (
              <div className="mt-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-5 sm:p-6 text-white shadow-inner animate-fade-in">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/15">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-base shadow-xs">
                    💡
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
                      {language === "mr"
                        ? "🌾 हे पीक का सुचवले आहे? (कृषी वैज्ञानिक विश्लेषण)"
                        : language === "hi"
                        ? "🌾 यह फसल क्यों अनुशंसित है? (कृषि वैज्ञानिक विश्लेषण)"
                        : "🌾 Why this crop is recommended? (Agronomic Analysis)"}
                    </h3>
                    <p className="text-[11px] text-green-100/80">
                      {language === "mr"
                        ? "तुमच्या माती परीक्षण व हवामान घटकांनुसार वैयक्तिकृत विश्लेषण"
                        : language === "hi"
                        ? "आपके मृदा परीक्षण एवं मौसम मापदंडों के अनुसार व्यक्तिगत विश्लेषण"
                        : "Personalized rationale based on your soil test and regional climate"}
                    </p>
                  </div>
                </div>

                {/* Summary Rationale */}
                <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-green-50 font-medium bg-black/15 p-3.5 rounded-xl border border-white/10">
                  {reasoning.summary}
                </p>

                {/* 3 Agronomic Pillars */}
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {/* Pillar 1: Nutrients */}
                  <div className="rounded-xl bg-white/10 p-3.5 border border-white/15 backdrop-blur-xs">
                    <div className="flex items-center gap-2 text-yellow-200 text-xs font-bold mb-1.5">
                      <FlaskConical size={14} />
                      <span>
                        {language === "mr"
                          ? "मातीतील N-P-K पोषण"
                          : language === "hi"
                          ? "मृदा पोषण (N-P-K)"
                          : "Soil N-P-K Balance"}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-green-50/90 font-normal">
                      {reasoning.nutrientReason}
                    </p>
                  </div>

                  {/* Pillar 2: Climate & Rainfall */}
                  <div className="rounded-xl bg-white/10 p-3.5 border border-white/15 backdrop-blur-xs">
                    <div className="flex items-center gap-2 text-cyan-200 text-xs font-bold mb-1.5">
                      <CloudRain size={14} />
                      <span>
                        {language === "mr"
                          ? "हवामान व पाऊस"
                          : language === "hi"
                          ? "मौसम एवं वर्षा"
                          : "Climate & Rainfall"}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-green-50/90 font-normal">
                      {reasoning.climateReason}
                    </p>
                  </div>

                  {/* Pillar 3: Soil pH */}
                  <div className="rounded-xl bg-white/10 p-3.5 border border-white/15 backdrop-blur-xs">
                    <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold mb-1.5">
                      <Leaf size={14} />
                      <span>
                        {language === "mr"
                          ? "मातीचा सामू (pH)"
                          : language === "hi"
                          ? "मृदा पीएच (pH)"
                          : "Soil pH Bioavailability"}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-green-50/90 font-normal">
                      {reasoning.phReason}
                    </p>
                  </div>
                </div>

                {/* Metric Status Badges */}
                {reasoning.keyMetrics && reasoning.keyMetrics.length > 0 && (
                  <div className="mt-4 pt-3.5 border-t border-white/15 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-green-200/80 mr-1">
                      {language === "mr" ? "घटक स्थिती:" : language === "hi" ? "घटक स्थिति:" : "Status:"}
                    </span>
                    {reasoning.keyMetrics.map((metric, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-xs border border-white/20"
                      >
                        <span className="text-green-200">{metric.label}:</span>
                        <span className="font-bold">{metric.value}</span>
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-emerald-400/30 text-emerald-100 border border-emerald-300/40">
                          {metric.status}
                        </span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      )}


      {/* INFORMATION CARDS */}

      <div className="grid gap-4 md:grid-cols-3">

        <InfoCard
          icon="🧪"
          title={t("soilNutrients")}
          text={t("soilNutrientsDescription")}
        />

        <InfoCard
          icon="🌦️"
          title={t("climateConditions")}
          text={t("climateConditionsDescription")}
        />

        <InfoCard
          icon="🌱"
          title={t("seasonalSuitability")}
          text={t("seasonalSuitabilityDescription")}
        />

      </div>


      {/* BACK */}

      <button
        onClick={() =>
          nav?.("dashboard")
        }
        className="inline-flex items-center gap-2 rounded-xl bg-[#2E7D32] px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1B5E20] hover:shadow-md"
      >
        ← {t("backToDashboard")}
      </button>

    </div>
  );
}


/* =========================================================
   NUMBER INPUT
========================================================= */

function NumberInput({
  label,
  name,
  value,
  onChange,
  onVoiceInput,
  placeholder,
  icon,
  suffix,
  step = "1",
  max,
  error,
}) {
  const handleSingleVoice = (spokenText) => {
    const clean = convertDevanagariDigits(spokenText);
    const numMatch = clean.match(/(\d+(\.\d+)?)/);
    if (numMatch && onVoiceInput) {
      onVoiceInput(numMatch[1]);
    }
  };

  const hasError = Boolean(error);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
          <span className={hasError ? "text-red-500 font-bold" : "text-[#2E7D32]"}>
            {icon}
          </span>
          <span className={hasError ? "text-red-700 font-bold" : ""}>
            {label}
          </span>
        </label>
        {onVoiceInput && (
          <VoiceMicButton onTranscript={handleSingleVoice} size="sm" />
        )}
      </div>

      <div className="relative">
        <input
          type="number"
          min="0"
          max={max}
          step={step}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-white px-4 py-3 pr-20 text-sm text-gray-800 outline-none transition duration-200 placeholder:text-gray-400 ${
            hasError
              ? "border-red-500 bg-red-50/20 text-red-900 ring-2 ring-red-100 focus:border-red-600 focus:ring-4 focus:ring-red-100"
              : "border-[#DCE8D9] focus:border-[#2E7D32] focus:ring-4 focus:ring-green-50"
          }`}
        />

        <span className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold ${
          hasError ? "text-red-600 font-bold" : "text-gray-500"
        }`}>
          {suffix}
        </span>
      </div>

      {hasError && (
        <div className="mt-1.5 flex items-start gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] font-semibold text-red-700 animate-fade-in shadow-xs">
          <AlertCircle size={14} className="mt-0.5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}


/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({
  number,
  title,
  text,
}) {
  return (
    <div className="flex gap-3">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF3E6] text-[9px] font-extrabold text-[#2E7D32]">
        {number}
      </div>

      <div>

        <h3 className="text-xs font-bold text-gray-800">
          {title}
        </h3>

        <p className="mt-1 text-[11px] leading-4 text-gray-500">
          {text}
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   MINI STAT
========================================================= */

function MiniStat({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-[#DCE8D9] bg-white p-3 shadow-2xs">

      <p className="text-[10px] font-bold text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-extrabold text-[#2E7D32]">
        {value}
      </p>

    </div>
  );
}


/* =========================================================
   INFORMATION CARD
========================================================= */

function InfoCard({
  icon,
  title,
  text,
}) {
  return (
    <div className="card card-interactive group rounded-2xl border border-[#DCE8D9] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">

      <div className="flex items-start gap-3">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF3E6] text-lg transition group-hover:scale-110">
          {icon}
        </div>

        <div>

          <h3 className="text-xs font-bold text-gray-800">
            {title}
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-gray-500">
            {text}
          </p>

        </div>

      </div>

    </div>
  );
}