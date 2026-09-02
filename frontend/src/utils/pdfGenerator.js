import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Multilingual Translations for KrushiMitra PDF Reports
 */
const PDF_TRANSLATIONS = {
  en: {
    brandTitle: "KRUSHIMITRA",
    brandSubtitle: "SMART AGRICULTURE INTELLIGENCE & ADVISORY SYSTEM",
    generatedOn: "Generated:",
    farmerName: "Farmer:",
    registeredFarmer: "Registered Farmer",
    page: "Page",
    of: "of",
    footerNotice: "KrushiMitra Farm Decision Support System • Generated from regional agro-climatic datasets.",
    verifiedStamp: "✓ VERIFIED AGRI ADVISORY",

    // Yield Report
    yieldReportTitle: "Crop Productivity & Yield Prediction Report",
    yieldReportSubtitle: "Analytical forecast of estimated crop yield based on farm parameters and regional weather data",
    summaryMetrics: "SUMMARY METRICS",
    totalPredictions: "Total Predictions",
    avgPredictedYield: "Avg. Predicted Yield",
    totalLandArea: "Total Land Area",
    tonnesPerHa: "tonnes/ha",
    hectares: "ha",

    // Table Columns
    colSr: "#",
    colCrop: "Crop",
    colDistrict: "District",
    colSeason: "Season",
    colArea: "Area (ha)",
    colRainfall: "Rainfall (mm)",
    colTemp: "Temp (°C)",
    colYield: "Predicted Yield",
    colDate: "Date",
    colN: "Nitrogen (N)",
    colP: "Phosphorus (P)",
    colK: "Potassium (K)",
    colPh: "pH",
    colHumidity: "Humidity (%)",
    colRecommendation: "Recommended Crop",
    colStatus: "Suitability Status",

    // Recommendation Report
    recReportTitle: "Soil Health & AI Crop Recommendation Advisory",
    recReportSubtitle: "Tailored crop selection advisory based on soil N-P-K nutrients, pH levels, and climate conditions",
    soilSummary: "SOIL & CROP HEALTH SUMMARY",
    soilTestsAnalyzed: "Total Soil Tests Analyzed",
    advisoryStatus: "Advisory Status",
    verified: "Verified",
    optimal: "Optimal Match",

    // Comprehensive Report
    compReportTitle: "Comprehensive Farm Intelligence Report",
    compReportSubtitle: "Consolidated multi-module report: Crop Yield Predictions, AI Recommendations & Field Analytics",
    section1Title: "1. Crop Yield & Productivity Predictions",
    section2Title: "2. Soil Nutrient & Crop Recommendations",
    colNPK: "N-P-K Profile (kg/ha)",
    colClimate: "Climate Profile",

    // Advisory Notes
    yieldAdvisoryHeading: "💡 KrushiMitra Yield Advisory:",
    yieldAdvisoryText: "Yield estimations are computed using regional historical agricultural datasets and agro-climatic factors. Optimize irrigation and fertilizer scheduling to reach peak harvest potential.",
    soilAdvisoryHeading: "🌱 Soil Health Management Tip:",
    soilAdvisoryText: "Ensure soil organic carbon is replenished with compost or farmyard manure. If soil pH is lower than 6.0, apply agricultural lime; if higher than 8.0, consider gypsum application.",

    filenameYield: "KrushiMitra_Crop_Yield_Report_EN.pdf",
    filenameRec: "KrushiMitra_Crop_Recommendation_Report_EN.pdf",
    filenameComp: "KrushiMitra_Comprehensive_Farm_Report_EN.pdf",
  },

  mr: {
    brandTitle: "कृषीमित्र",
    brandSubtitle: "स्मार्ट शेती आणि पीक मार्गदर्शन प्रणाली",
    generatedOn: "दिनांक:",
    farmerName: "शेतकरी नाव:",
    registeredFarmer: "नोंदणीकृत शेतकरी",
    page: "पृष्ठ",
    of: "पैकी",
    footerNotice: "कृषीमित्र शेतकरी निर्णय प्रणाली • प्रादेशिक कृषी व हवामान माहितीवर आधारित अधिकृत अहवाल.",
    verifiedStamp: "✓ अधिकृत कृषी सल्ला",

    // Yield Report
    yieldReportTitle: "पीक उत्पादकता आणि उत्पादन अंदाज अहवाल",
    yieldReportSubtitle: "शेताचे क्षेत्रफळ, हवामान आणि माती घटकांवर आधारित अंदाजित पीक उत्पादनाचा सविस्तर अहवाल",
    summaryMetrics: "उत्पादन सारांश आकडेवारी",
    totalPredictions: "एकूण अंदाज नोंदी",
    avgPredictedYield: "सरासरी अंदाजित उत्पादन",
    totalLandArea: "एकूण शेत क्षेत्रफळ",
    tonnesPerHa: "टन/हेक्टर",
    hectares: "हेक्टर",

    // Table Columns
    colSr: "क्र.",
    colCrop: "पीक",
    colDistrict: "जिल्हा",
    colSeason: "हंगाम",
    colArea: "क्षेत्र (हेक्टर)",
    colRainfall: "पाऊस (मिमी)",
    colTemp: "तापमान (°C)",
    colYield: "अंदाजित उत्पादन",
    colDate: "तारीख",
    colN: "नायट्रोजन (N)",
    colP: "स्फुरद (P)",
    colK: "पालाश (K)",
    colPh: "सामू (pH)",
    colHumidity: "हवेतील आर्द्रता (%)",
    colRecommendation: "शिफारस केलेले पीक",
    colStatus: "अनुकूलता",

    // Recommendation Report
    recReportTitle: "माती परीक्षण आणि पीक शिफारस अहवाल",
    recReportSubtitle: "मातीतील N-P-K अन्नद्रव्ये, सामू आणि स्थानिक हवामानानुसार योग्य पिकांची शिफारस",
    soilSummary: "माती आरोग्य व पीक शिफारस सारांश",
    soilTestsAnalyzed: "तपासलेले माती नमुने",
    advisoryStatus: "तपासणी स्थिती",
    verified: "प्रमाणित",
    optimal: "उत्तम अनुकूल",

    // Comprehensive Report
    compReportTitle: "सर्वसमावेशक शेतकरी कृषी सल्ला अहवाल",
    compReportSubtitle: "एकत्रित कृषी अहवाल: पीक उत्पादन अंदाज, माती परीक्षण शिफारस आणि हवामान मार्गदर्शन",
    section1Title: "१. पीक उत्पादकता अंदाज नोंदी",
    section2Title: "२. माती परीक्षण आणि योग्य पीक शिफारसी",
    colNPK: "N-P-K प्रमाण (किग्रॅ/हे)",
    colClimate: "हवामान स्थिती",

    // Advisory Notes
    yieldAdvisoryHeading: "💡 कृषीमित्र शेती सल्ला:",
    yieldAdvisoryText: "हा उत्पादन अंदाज प्रादेशिक कृषी माहिती व हवामानाच्या आधारे काढण्यात आला आहे. खतांचा संतुलित वापर आणि पाणी व्यवस्थापन करून उत्पादनात वाढ करा.",
    soilAdvisoryHeading: "🌱 माती आरोग्य व्यवस्थापन सल्ला:",
    soilAdvisoryText: "जमिनीतील सेंद्रिय कर्ब वाढवण्यासाठी शेणखत किंवा गांडूळ खताचा वापर करा. जमिनीचा सामू ६.० पेक्षा कमी असल्यास चुना आणि ८.० पेक्षा जास्त असल्यास जिप्सम वापरा.",

    filenameYield: "KrushiMitra_पीक_उत्पादन_अहवाल_MR.pdf",
    filenameRec: "KrushiMitra_पीक_शिफारस_अहवाल_MR.pdf",
    filenameComp: "KrushiMitra_सर्वसमावेशक_शेती_अहवाल_MR.pdf",
  },

  hi: {
    brandTitle: "कृषि-मित्र",
    brandSubtitle: "स्मार्ट कृषि सूचना एवं किसान परामर्श प्रणाली",
    generatedOn: "दिनांक:",
    farmerName: "किसान का नाम:",
    registeredFarmer: "पंजीकृत किसान",
    page: "पृष्ठ",
    of: "का",
    footerNotice: "कृषि-मित्र किसान निर्णय प्रणाली • क्षेत्रीय कृषि एवं मौसमी आंकड़ों पर आधारित आधिकारिक रिपोर्ट।",
    verifiedStamp: "✓ प्रमाणित कृषि परामर्श",

    // Yield Report
    yieldReportTitle: "फसल उत्पादकता एवं उत्पादन पूर्वानुमान रिपोर्ट",
    yieldReportSubtitle: "खेत के क्षेत्रफल, मौसम और मिट्टी के आंकड़ों पर आधारित अनुमानित पैदावार की विस्तृत रिपोर्ट",
    summaryMetrics: "उत्पादन सारांश",
    totalPredictions: "कुल पूर्वानुमान",
    avgPredictedYield: "औसत अनुमानित उपज",
    totalLandArea: "कुल खेत का क्षेत्रफल",
    tonnesPerHa: "टन/हेक्टेयर",
    hectares: "हेक्टेयर",

    // Table Columns
    colSr: "क्र.",
    colCrop: "फसल",
    colDistrict: "जिला",
    colSeason: "मौसम",
    colArea: "क्षेत्रफल (हेक्टेयर)",
    colRainfall: "वर्षा (मिमी)",
    colTemp: "तापमान (°C)",
    colYield: "अनुमानित उपज",
    colDate: "तारीख",
    colN: "नाइट्रोजन (N)",
    colP: "फास्फोरस (P)",
    colK: "पोटाश (K)",
    colPh: "पीएच (pH)",
    colHumidity: "नमी (%)",
    colRecommendation: "सिफारिश की गई फसल",
    colStatus: "अनुकूलता",

    // Recommendation Report
    recReportTitle: "मृदा परीक्षण एवं फसल सिफारिश रिपोर्ट",
    recReportSubtitle: "मिट्टी के N-P-K पोषक तत्व, पीएच और स्थानीय मौसम के अनुसार सर्वोत्तम फसल सिफारिश",
    soilSummary: "मृदा स्वास्थ्य एवं फसल सिफारिश सारांश",
    soilTestsAnalyzed: "जांचे गए मिट्टी के नमूने",
    advisoryStatus: "जांच स्थिति",
    verified: "सत्यापित",
    optimal: "सर्वोत्तम",

    // Comprehensive Report
    compReportTitle: "व्यापक किसान कृषि परामर्श रिपोर्ट",
    compReportSubtitle: "समेकित कृषि रिपोर्ट: फसल उत्पादन पूर्वानुमान, मृदा परीक्षण सिफारिश और मौसम सलाह",
    section1Title: "१. फसल उत्पादन एवं पैदावार पूर्वानुमान",
    section2Title: "२. मृदा पोषक तत्व एवं फसल सिफारिश",
    colNPK: "N-P-K अनुपात (किग्रा/हे)",
    colClimate: "मौसम की स्थिति",

    // Advisory Notes
    yieldAdvisoryHeading: "💡 कृषि-मित्र पैदावार सलाह:",
    yieldAdvisoryText: "यह पैदावार अनुमान क्षेत्रीय कृषि आंकड़ों और मौसम के आधार पर तैयार किया गया है। सिंचाई और खाद के सही प्रबंधन से अधिकतम उपज प्राप्त करें।",
    soilAdvisoryHeading: "🌱 मृदा स्वास्थ्य प्रबंधन सलाह:",
    soilAdvisoryText: "मिट्टी में जीवांश कार्बन बढ़ाने के लिए गोबर की खाद या वर्मीकम्पोस्ट का प्रयोग करें। मिट्टी का पीएच 6.0 से कम होने पर चूना और 8.0 से अधिक होने पर जिप्सम डालें।",

    filenameYield: "KrushiMitra_फसल_उत्पादन_रिपोर्ट_HI.pdf",
    filenameRec: "KrushiMitra_फसल_सिफारिश_रिपोर्ट_HI.pdf",
    filenameComp: "KrushiMitra_व्यापक_कृषि_रिपोर्ट_HI.pdf",
  },
};

const CROP_MAP = {
  soybean: { en: "Soybean", mr: "सोयाबीन", hi: "सोयाबीन" },
  cotton: { en: "Cotton", mr: "कापूस", hi: "कपास" },
  sugarcane: { en: "Sugarcane", mr: "ऊस", hi: "गन्ना" },
  wheat: { en: "Wheat", mr: "गहू", hi: "गेहूं" },
  gram: { en: "Gram (Chickpea)", mr: "हरभरा (चना)", hi: "चना" },
  chickpea: { en: "Gram (Chickpea)", mr: "हरभरा (चना)", hi: "चना" },
  tur: { en: "Tur (Pigeon Pea)", mr: "तूर (अरहर)", hi: "अरहर (तूर)" },
  pigeonpeas: { en: "Tur (Pigeon Pea)", mr: "तूर (अरहर)", hi: "अरहर (तूर)" },
  rice: { en: "Rice (Paddy)", mr: "भात (धान)", hi: "चावल (धान)" },
  maize: { en: "Maize (Corn)", mr: "मका", hi: "मक्का" },
  jute: { en: "Jute", mr: "ताग (ज्यूट)", hi: "पटसन (जूट)" },
  groundnut: { en: "Groundnut", mr: "भुईमूग", hi: "मूंगफली" },
  banana: { en: "Banana", mr: "केळी", hi: "केला" },
  mango: { en: "Mango", mr: "आंबा", hi: "आम" },
  grapes: { en: "Grapes", mr: "द्राक्षे", hi: "अंगूर" },
  apple: { en: "Apple", mr: "सफरचंद", hi: "सेब" },
  orange: { en: "Orange", mr: "संत्रा", hi: "संतरा" },
  papaya: { en: "Papaya", mr: "पपई", hi: "पपीता" },
  coconut: { en: "Coconut", mr: "नारळ", hi: "नारियल" },
  coffee: { en: "Coffee", mr: "कॉफी", hi: "कॉफी" },
  blackgram: { en: "Blackgram (Urad)", mr: "उडीद", hi: "उड़द" },
  lentil: { en: "Lentil (Masoor)", mr: "मसूर", hi: "मसूर" },
  pomegranate: { en: "Pomegranate", mr: "डाळिंब", hi: "अनार" },
  watermelon: { en: "Watermelon", mr: "कलिंगड", hi: "तरबूज" },
  muskmelon: { en: "Muskmelon", mr: "खरबूज", hi: "खरबूजा" },
  mothbeans: { en: "Mothbeans (Matki)", mr: "मटकी", hi: "मोठ" },
  mungbean: { en: "Mungbean (Moong)", mr: "मूग", hi: "मूंग" },
  kidneybeans: { en: "Kidneybeans (Rajma)", mr: "राजमा", hi: "राजमा" },
};

const DISTRICT_MAP = {
  ahmednagar: { en: "Ahilyanagar", mr: "अहिल्यानगर", hi: "अहिल्यानगर" },
  ahilyanagar: { en: "Ahilyanagar", mr: "अहिल्यानगर", hi: "अहिल्यानगर" },
  akola: { en: "Akola", mr: "अकोला", hi: "अकोला" },
  amravati: { en: "Amravati", mr: "अमरावती", hi: "अमरावती" },
  aurangabad: { en: "Chhatrapati Sambhajinagar", mr: "छत्रपती संभाजीनगर", hi: "छत्रपति संभाजीनगर" },
  sambhajinagar: { en: "Chhatrapati Sambhajinagar", mr: "छत्रपती संभाजीनगर", hi: "छत्रपति संभाजीनगर" },
  beed: { en: "Beed", mr: "बीड", hi: "बीड" },
  bhandara: { en: "Bhandara", mr: "भंडारा", hi: "भंडारा" },
  buldhana: { en: "Buldhana", mr: "बुलढाणा", hi: "बुलढाणा" },
  chandrapur: { en: "Chandrapur", mr: "चंद्रपूर", hi: "चंद्रपुर" },
  dhule: { en: "Dhule", mr: "धुळे", hi: "धुले" },
  gadchiroli: { en: "Gadchiroli", mr: "गडचिरोली", hi: "गडचिरोली" },
  gondia: { en: "Gondia", mr: "गोंदिया", hi: "गोंदिया" },
  hingoli: { en: "Hingoli", mr: "हिंगोली", hi: "हिंगोली" },
  jalgaon: { en: "Jalgaon", mr: "जळगाव", hi: "जलगांव" },
  jalna: { en: "Jalna", mr: "जालना", hi: "जालना" },
  kolhapur: { en: "Kolhapur", mr: "कोल्हापूर", hi: "कोल्हापुर" },
  latur: { en: "Latur", mr: "लातूर", hi: "लातुर" },
  mumbai: { en: "Mumbai", mr: "मुंबई", hi: "मुंबई" },
  nagpur: { en: "Nagpur", mr: "नागपूर", hi: "नागपुर" },
  nanded: { en: "Nanded", mr: "नांदेड", hi: "नांदेड़" },
  nandurbar: { en: "Nandurbar", mr: "नंदुरबार", hi: "नंदुरबार" },
  nashik: { en: "Nashik", mr: "नाशिक", hi: "नासिक" },
  osmanabad: { en: "Dharashiv", mr: "धाराशिव", hi: "धाराशिव" },
  dharashiv: { en: "Dharashiv", mr: "धाराशिव", hi: "धाराशिव" },
  palghar: { en: "Palghar", mr: "पालघर", hi: "पालघर" },
  parbhani: { en: "Parbhani", mr: "परभणी", hi: "परभणी" },
  pune: { en: "Pune", mr: "पुणे", hi: "पुणे" },
  raigad: { en: "Raigad", mr: "रायगड", hi: "रायगढ़" },
  ratnagiri: { en: "Ratnagiri", mr: "रत्नागिरी", hi: "रत्नागिरि" },
  sangli: { en: "Sangli", mr: "सांगली", hi: "सांगली" },
  satara: { en: "Satara", mr: "सातारा", hi: "सतारा" },
  sindhudurg: { en: "Sindhudurg", mr: "सिंधुदुर्ग", hi: "सिंधुदुर्ग" },
  solapur: { en: "Solapur", mr: "सोलापूर", hi: "सोलापुर" },
  thane: { en: "Thane", mr: "ठाणे", hi: "ठाणे" },
  wardha: { en: "Wardha", mr: "वर्धा", hi: "वर्धा" },
  washim: { en: "Washim", mr: "वाशीम", hi: "वाशिम" },
  yavatmal: { en: "Yavatmal", mr: "यवतमाळ", hi: "यवतमाल" },
};

const SEASON_MAP = {
  kharif: { en: "Kharif", mr: "खरीप", hi: "खरीफ" },
  rabi: { en: "Rabi", mr: "रब्बी", hi: "रबी" },
  summer: { en: "Summer", mr: "उन्हाळी", hi: "जायद/गर्मी" },
  annual: { en: "Annual", mr: "वार्षिक", hi: "वार्षिक" },
  whole_year: { en: "Whole Year", mr: "संपूर्ण वर्ष", hi: "संपूर्ण वर्ष" },
};

function resolveLang(options, user) {
  if (typeof options === "string" && PDF_TRANSLATIONS[options]) return options;
  if (options?.language && PDF_TRANSLATIONS[options.language]) return options.language;
  if (typeof user === "string" && PDF_TRANSLATIONS[user]) return user;
  if (user?.language && PDF_TRANSLATIONS[user.language]) return user.language;
  try {
    const stored = localStorage.getItem("krushimitra_lang");
    if (stored && PDF_TRANSLATIONS[stored]) return stored;
  } catch (e) {}
  return "en";
}

function localizeCrop(crop, lang) {
  if (!crop) return "—";
  const clean = String(crop).trim().toLowerCase();
  for (const [key, map] of Object.entries(CROP_MAP)) {
    if (clean.includes(key) || key.includes(clean)) {
      return map[lang] || map.en || crop;
    }
  }
  return crop;
}

function localizeDistrict(district, lang) {
  if (!district) return "—";
  const clean = String(district).trim().toLowerCase();
  for (const [key, map] of Object.entries(DISTRICT_MAP)) {
    if (clean.includes(key) || key.includes(clean)) {
      return map[lang] || map.en || district;
    }
  }
  return district;
}

function localizeSeason(season, lang) {
  if (!season) return "—";
  const clean = String(season).trim().toLowerCase();
  for (const [key, map] of Object.entries(SEASON_MAP)) {
    if (clean.includes(key) || key.includes(clean)) {
      return map[lang] || map.en || season;
    }
  }
  return season;
}

function formatDate(dateVal, lang) {
  if (!dateVal) return lang === "mr" ? "अलीकडील" : lang === "hi" ? "हाल ही का" : "Recent";
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (e) {
    return String(dateVal);
  }
}

/**
 * Render HTML element to PDF via html2canvas with high-DPI scaling
 */
async function renderHtmlToPdf(htmlString, filename) {
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "-99999px";
  container.style.left = "-99999px";
  container.style.width = "800px";
  container.style.backgroundColor = "#ffffff";
  container.style.color = "#17291A";
  container.style.fontFamily = "'Noto Sans Devanagari', 'Poppins', 'Segoe UI', Arial, sans-serif";
  container.style.padding = "0";
  container.style.margin = "0";
  container.innerHTML = htmlString;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    doc.addImage(canvas.toDataURL("image/jpeg", 0.98), "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 10) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(canvas.toDataURL("image/jpeg", 0.98), "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    doc.save(filename);
  } catch (err) {
    console.error("PDF generation failed:", err);
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * 1. Generate Crop Yield Prediction PDF
 */
export async function generateYieldReportPDF(predictions = [], user = {}, options = {}) {
  const lang = resolveLang(options, user);
  const t = PDF_TRANSLATIONS[lang] || PDF_TRANSLATIONS.en;
  const data = Array.isArray(predictions) && predictions.length > 0 ? predictions : getSamplePredictions();

  const avgYield = (
    data.reduce((sum, item) => sum + Number(item.productivity || 0), 0) / data.length
  ).toFixed(2);
  const totalArea = data
    .reduce((sum, item) => sum + Number(item.area || 0), 0)
    .toFixed(1);

  const farmerName = user?.name || user?.userName || (user?.email ? user.email.split("@")[0] : t.registeredFarmer);
  const todayStr = formatDate(new Date(), lang);

  const tableRowsHtml = data.map((item, idx) => `
    <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f7fbf6'}; border-bottom: 1px solid #e2ece0;">
      <td style="padding: 9px 8px; text-align: center; font-weight: bold; color: #555;">${idx + 1}</td>
      <td style="padding: 9px 8px; font-weight: bold; color: #1B5E20;">${localizeCrop(item.crop, lang)}</td>
      <td style="padding: 9px 8px; text-align: center; color: #333;">${localizeDistrict(item.district, lang)}</td>
      <td style="padding: 9px 8px; text-align: center; color: #333;">${localizeSeason(item.season, lang)}</td>
      <td style="padding: 9px 8px; text-align: center; color: #333;">${item.area || 0} ${t.hectares}</td>
      <td style="padding: 9px 8px; text-align: center; color: #333;">${item.rainfall || 0} mm</td>
      <td style="padding: 9px 8px; text-align: center; color: #333;">${item.temperature || 0} °C</td>
      <td style="padding: 9px 8px; text-align: center; font-weight: 800; color: #10B981;">${Number(item.productivity || 0).toFixed(2)} ${t.tonnesPerHa}</td>
      <td style="padding: 9px 8px; text-align: center; color: #666; font-size: 11px;">${formatDate(item.createdAt || item.date, lang)}</td>
    </tr>
  `).join("");

  const htmlContent = `
    <div style="padding: 28px 32px; background: #ffffff; width: 736px; min-height: 1040px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <!-- TOP BRAND BANNER -->
        <div style="background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 60%, #10B981 100%); padding: 18px 24px; border-radius: 16px; color: #ffffff; margin-bottom: 22px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 12px rgba(27,94,32,0.15);">
          <div>
            <div style="font-size: 22px; font-weight: 900; letter-spacing: 0.5px;">${t.brandTitle}</div>
            <div style="font-size: 10px; font-weight: 700; opacity: 0.9; margin-top: 2px;">${t.brandSubtitle}</div>
          </div>
          <div style="text-align: right; font-size: 11px;">
            <div style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; font-weight: bold; margin-bottom: 4px;">${t.verifiedStamp}</div>
            <div>${t.generatedOn} <strong>${todayStr}</strong></div>
            <div>${t.farmerName} <strong>${farmerName}</strong></div>
          </div>
        </div>

        <!-- REPORT TITLE -->
        <div style="margin-bottom: 18px; border-left: 4px solid #2E7D32; padding-left: 12px;">
          <h1 style="margin: 0; font-size: 17px; font-weight: 900; color: #172B18;">${t.yieldReportTitle}</h1>
          <p style="margin: 3px 0 0 0; font-size: 11px; color: #55715A; font-weight: 500;">${t.yieldReportSubtitle}</p>
        </div>

        <!-- SUMMARY METRICS -->
        <div style="background: #F3F8F2; border: 1px solid #D2E6D0; border-radius: 12px; padding: 14px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
          <div style="text-align: center;">
            <div style="font-size: 10px; font-weight: bold; color: #55715A; text-transform: uppercase;">${t.totalPredictions}</div>
            <div style="font-size: 18px; font-weight: 900; color: #1B5E20; margin-top: 2px;">${data.length}</div>
          </div>
          <div style="height: 30px; width: 1px; background: #C5DEC2;"></div>
          <div style="text-align: center;">
            <div style="font-size: 10px; font-weight: bold; color: #55715A; text-transform: uppercase;">${t.avgPredictedYield}</div>
            <div style="font-size: 18px; font-weight: 900; color: #1B5E20; margin-top: 2px;">${avgYield} <span style="font-size: 11px; font-weight: normal;">${t.tonnesPerHa}</span></div>
          </div>
          <div style="height: 30px; width: 1px; background: #C5DEC2;"></div>
          <div style="text-align: center;">
            <div style="font-size: 10px; font-weight: bold; color: #55715A; text-transform: uppercase;">${t.totalLandArea}</div>
            <div style="font-size: 18px; font-weight: 900; color: #1B5E20; margin-top: 2px;">${totalArea} <span style="font-size: 11px; font-weight: normal;">${t.hectares}</span></div>
          </div>
        </div>

        <!-- TABLE -->
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <thead>
            <tr style="background: #2E7D32; color: #ffffff;">
              <th style="padding: 10px 8px; font-weight: bold; text-align: center; width: 32px;">${t.colSr}</th>
              <th style="padding: 10px 8px; font-weight: bold; text-align: left;">${t.colCrop}</th>
              <th style="padding: 10px 8px; font-weight: bold; text-align: center;">${t.colDistrict}</th>
              <th style="padding: 10px 8px; font-weight: bold; text-align: center;">${t.colSeason}</th>
              <th style="padding: 10px 8px; font-weight: bold; text-align: center;">${t.colArea}</th>
              <th style="padding: 10px 8px; font-weight: bold; text-align: center;">${t.colRainfall}</th>
              <th style="padding: 10px 8px; font-weight: bold; text-align: center;">${t.colTemp}</th>
              <th style="padding: 10px 8px; font-weight: bold; text-align: center;">${t.colYield}</th>
              <th style="padding: 10px 8px; font-weight: bold; text-align: center;">${t.colDate}</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>

        <!-- ADVISORY NOTE -->
        <div style="background: #FFFDF5; border: 1px solid #EFE4BF; border-radius: 12px; padding: 12px 16px; margin-top: 14px;">
          <div style="font-size: 11px; font-weight: bold; color: #92640A; margin-bottom: 3px;">${t.yieldAdvisoryHeading}</div>
          <p style="margin: 0; font-size: 10.5px; color: #5C4B21; line-height: 1.45;">${t.yieldAdvisoryText}</p>
        </div>
      </div>

      <!-- FOOTER -->
      <div style="margin-top: 24px; padding-top: 10px; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #718096;">
        <div>${t.footerNotice}</div>
        <div style="font-weight: bold; color: #2E7D32;">KrushiMitra © ${new Date().getFullYear()}</div>
      </div>
    </div>
  `;

  await renderHtmlToPdf(htmlContent, t.filenameYield);
}

/**
 * 2. Generate Crop Recommendation Advisory PDF
 */
export async function generateRecommendationReportPDF(recommendations = [], user = {}, options = {}) {
  const lang = resolveLang(options, user);
  const t = PDF_TRANSLATIONS[lang] || PDF_TRANSLATIONS.en;
  const data = Array.isArray(recommendations) && recommendations.length > 0 ? recommendations : getSampleRecommendations();

  const farmerName = user?.name || user?.userName || (user?.email ? user.email.split("@")[0] : t.registeredFarmer);
  const todayStr = formatDate(new Date(), lang);

  const tableRowsHtml = data.map((item, idx) => `
    <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f7fbf6'}; border-bottom: 1px solid #e2ece0;">
      <td style="padding: 9px 8px; text-align: center; font-weight: bold; color: #555;">${idx + 1}</td>
      <td style="padding: 9px 8px; font-weight: bold; color: #1B5E20; font-size: 12.5px;">${localizeCrop(item.crop, lang)}</td>
      <td style="padding: 9px 8px; text-align: center; font-weight: bold; color: #2D3748;">${item.nitrogen || 0}</td>
      <td style="padding: 9px 8px; text-align: center; font-weight: bold; color: #2D3748;">${item.phosphorus || 0}</td>
      <td style="padding: 9px 8px; text-align: center; font-weight: bold; color: #2D3748;">${item.potassium || 0}</td>
      <td style="padding: 9px 8px; text-align: center; font-weight: 800; color: #319795;">${item.ph || 0}</td>
      <td style="padding: 9px 8px; text-align: center; color: #4A5568;">${item.temperature || 0} °C</td>
      <td style="padding: 9px 8px; text-align: center; color: #4A5568;">${item.humidity || 0}%</td>
      <td style="padding: 9px 8px; text-align: center; color: #4A5568;">${item.rainfall || 0} mm</td>
      <td style="padding: 9px 8px; text-align: center; color: #718096; font-size: 11px;">${formatDate(item.createdAt || item.date, lang)}</td>
    </tr>
  `).join("");

  const htmlContent = `
    <div style="padding: 28px 32px; background: #ffffff; width: 736px; min-height: 1040px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <!-- TOP BRAND BANNER -->
        <div style="background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 60%, #10B981 100%); padding: 18px 24px; border-radius: 16px; color: #ffffff; margin-bottom: 22px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 12px rgba(27,94,32,0.15);">
          <div>
            <div style="font-size: 22px; font-weight: 900; letter-spacing: 0.5px;">${t.brandTitle}</div>
            <div style="font-size: 10px; font-weight: 700; opacity: 0.9; margin-top: 2px;">${t.brandSubtitle}</div>
          </div>
          <div style="text-align: right; font-size: 11px;">
            <div style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; font-weight: bold; margin-bottom: 4px;">${t.verifiedStamp}</div>
            <div>${t.generatedOn} <strong>${todayStr}</strong></div>
            <div>${t.farmerName} <strong>${farmerName}</strong></div>
          </div>
        </div>

        <!-- REPORT TITLE -->
        <div style="margin-bottom: 18px; border-left: 4px solid #2E7D32; padding-left: 12px;">
          <h1 style="margin: 0; font-size: 17px; font-weight: 900; color: #172B18;">${t.recReportTitle}</h1>
          <p style="margin: 3px 0 0 0; font-size: 11px; color: #55715A; font-weight: 500;">${t.recReportSubtitle}</p>
        </div>

        <!-- SUMMARY METRICS -->
        <div style="background: #F3F8F2; border: 1px solid #D2E6D0; border-radius: 12px; padding: 14px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
          <div style="text-align: center;">
            <div style="font-size: 10px; font-weight: bold; color: #55715A; text-transform: uppercase;">${t.soilTestsAnalyzed}</div>
            <div style="font-size: 18px; font-weight: 900; color: #1B5E20; margin-top: 2px;">${data.length}</div>
          </div>
          <div style="height: 30px; width: 1px; background: #C5DEC2;"></div>
          <div style="text-align: center;">
            <div style="font-size: 10px; font-weight: bold; color: #55715A; text-transform: uppercase;">${t.advisoryStatus}</div>
            <div style="font-size: 18px; font-weight: 900; color: #1B5E20; margin-top: 2px;">${t.verified}</div>
          </div>
          <div style="height: 30px; width: 1px; background: #C5DEC2;"></div>
          <div style="text-align: center;">
            <div style="font-size: 10px; font-weight: bold; color: #55715A; text-transform: uppercase;">${t.colStatus}</div>
            <div style="font-size: 18px; font-weight: 900; color: #10B981; margin-top: 2px;">${t.optimal}</div>
          </div>
        </div>

        <!-- TABLE -->
        <table style="width: 100%; border-collapse: collapse; font-size: 11.5px; margin-bottom: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <thead>
            <tr style="background: #2E7D32; color: #ffffff;">
              <th style="padding: 10px 6px; font-weight: bold; text-align: center; width: 28px;">${t.colSr}</th>
              <th style="padding: 10px 8px; font-weight: bold; text-align: left;">${t.colRecommendation}</th>
              <th style="padding: 10px 6px; font-weight: bold; text-align: center;">${t.colN}</th>
              <th style="padding: 10px 6px; font-weight: bold; text-align: center;">${t.colP}</th>
              <th style="padding: 10px 6px; font-weight: bold; text-align: center;">${t.colK}</th>
              <th style="padding: 10px 6px; font-weight: bold; text-align: center;">${t.colPh}</th>
              <th style="padding: 10px 6px; font-weight: bold; text-align: center;">${t.colTemp}</th>
              <th style="padding: 10px 6px; font-weight: bold; text-align: center;">${t.colHumidity}</th>
              <th style="padding: 10px 6px; font-weight: bold; text-align: center;">${t.colRainfall}</th>
              <th style="padding: 10px 8px; font-weight: bold; text-align: center;">${t.colDate}</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>

        <!-- ADVISORY NOTE -->
        <div style="background: #F0FBF4; border: 1px solid #B8E6CA; border-radius: 12px; padding: 12px 16px; margin-top: 14px;">
          <div style="font-size: 11px; font-weight: bold; color: #1B5E20; margin-bottom: 3px;">${t.soilAdvisoryHeading}</div>
          <p style="margin: 0; font-size: 10.5px; color: #234E27; line-height: 1.45;">${t.soilAdvisoryText}</p>
        </div>
      </div>

      <!-- FOOTER -->
      <div style="margin-top: 24px; padding-top: 10px; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #718096;">
        <div>${t.footerNotice}</div>
        <div style="font-weight: bold; color: #2E7D32;">KrushiMitra © ${new Date().getFullYear()}</div>
      </div>
    </div>
  `;

  await renderHtmlToPdf(htmlContent, t.filenameRec);
}

/**
 * 3. Generate Comprehensive Farm Audit & Performance PDF
 */
export async function generateComprehensiveFarmReportPDF(predictions = [], recommendations = [], user = {}, options = {}) {
  const lang = resolveLang(options, user);
  const t = PDF_TRANSLATIONS[lang] || PDF_TRANSLATIONS.en;
  const preds = Array.isArray(predictions) && predictions.length > 0 ? predictions : getSamplePredictions();
  const recs = Array.isArray(recommendations) && recommendations.length > 0 ? recommendations : getSampleRecommendations();

  const farmerName = user?.name || user?.userName || (user?.email ? user.email.split("@")[0] : t.registeredFarmer);
  const todayStr = formatDate(new Date(), lang);

  const yieldRowsHtml = preds.slice(0, 5).map((item, idx) => `
    <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f7fbf6'}; border-bottom: 1px solid #e2ece0;">
      <td style="padding: 7px 8px; text-align: center; font-weight: bold; color: #555;">${idx + 1}</td>
      <td style="padding: 7px 8px; font-weight: bold; color: #1B5E20;">${localizeCrop(item.crop, lang)}</td>
      <td style="padding: 7px 8px; text-align: center; color: #333;">${localizeDistrict(item.district, lang)}</td>
      <td style="padding: 7px 8px; text-align: center; color: #333;">${localizeSeason(item.season, lang)}</td>
      <td style="padding: 7px 8px; text-align: center; color: #333;">${item.area || 0} ${t.hectares}</td>
      <td style="padding: 7px 8px; text-align: center; font-weight: 800; color: #10B981;">${Number(item.productivity || 0).toFixed(2)} ${t.tonnesPerHa}</td>
    </tr>
  `).join("");

  const recRowsHtml = recs.slice(0, 5).map((item, idx) => `
    <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f7fbf6'}; border-bottom: 1px solid #e2ece0;">
      <td style="padding: 7px 8px; text-align: center; font-weight: bold; color: #555;">${idx + 1}</td>
      <td style="padding: 7px 8px; font-weight: bold; color: #1B5E20;">${localizeCrop(item.crop, lang)}</td>
      <td style="padding: 7px 8px; text-align: center; color: #333;">N:${item.nitrogen} P:${item.phosphorus} K:${item.potassium}</td>
      <td style="padding: 7px 8px; text-align: center; font-weight: bold; color: #319795;">pH ${item.ph}</td>
      <td style="padding: 7px 8px; text-align: center; color: #333;">${item.temperature}°C / ${item.rainfall}mm</td>
    </tr>
  `).join("");

  const htmlContent = `
    <div style="padding: 28px 32px; background: #ffffff; width: 736px; min-height: 1040px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <!-- TOP BRAND BANNER -->
        <div style="background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 60%, #10B981 100%); padding: 18px 24px; border-radius: 16px; color: #ffffff; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 12px rgba(27,94,32,0.15);">
          <div>
            <div style="font-size: 22px; font-weight: 900; letter-spacing: 0.5px;">${t.brandTitle}</div>
            <div style="font-size: 10px; font-weight: 700; opacity: 0.9; margin-top: 2px;">${t.brandSubtitle}</div>
          </div>
          <div style="text-align: right; font-size: 11px;">
            <div style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; font-weight: bold; margin-bottom: 4px;">${t.verifiedStamp}</div>
            <div>${t.generatedOn} <strong>${todayStr}</strong></div>
            <div>${t.farmerName} <strong>${farmerName}</strong></div>
          </div>
        </div>

        <!-- REPORT TITLE -->
        <div style="margin-bottom: 16px; border-left: 4px solid #2E7D32; padding-left: 12px;">
          <h1 style="margin: 0; font-size: 17px; font-weight: 900; color: #172B18;">${t.compReportTitle}</h1>
          <p style="margin: 3px 0 0 0; font-size: 11px; color: #55715A; font-weight: 500;">${t.compReportSubtitle}</p>
        </div>

        <!-- SECTION 1: YIELD PREDICTIONS -->
        <div style="margin-bottom: 18px;">
          <h2 style="font-size: 13px; font-weight: bold; color: #1B5E20; margin: 0 0 8px 0;">${t.section1Title}</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <thead>
              <tr style="background: #2E7D32; color: #ffffff;">
                <th style="padding: 7px 6px; font-weight: bold; text-align: center; width: 28px;">${t.colSr}</th>
                <th style="padding: 7px 8px; font-weight: bold; text-align: left;">${t.colCrop}</th>
                <th style="padding: 7px 8px; font-weight: bold; text-align: center;">${t.colDistrict}</th>
                <th style="padding: 7px 8px; font-weight: bold; text-align: center;">${t.colSeason}</th>
                <th style="padding: 7px 8px; font-weight: bold; text-align: center;">${t.colArea}</th>
                <th style="padding: 7px 8px; font-weight: bold; text-align: center;">${t.colYield}</th>
              </tr>
            </thead>
            <tbody>
              ${yieldRowsHtml}
            </tbody>
          </table>
        </div>

        <!-- SECTION 2: RECOMMENDATIONS -->
        <div style="margin-bottom: 18px;">
          <h2 style="font-size: 13px; font-weight: bold; color: #1B5E20; margin: 0 0 8px 0;">${t.section2Title}</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <thead>
              <tr style="background: #10B981; color: #ffffff;">
                <th style="padding: 7px 6px; font-weight: bold; text-align: center; width: 28px;">${t.colSr}</th>
                <th style="padding: 7px 8px; font-weight: bold; text-align: left;">${t.colRecommendation}</th>
                <th style="padding: 7px 8px; font-weight: bold; text-align: center;">${t.colNPK}</th>
                <th style="padding: 7px 8px; font-weight: bold; text-align: center;">${t.colPh}</th>
                <th style="padding: 7px 8px; font-weight: bold; text-align: center;">${t.colClimate}</th>
              </tr>
            </thead>
            <tbody>
              ${recRowsHtml}
            </tbody>
          </table>
        </div>

        <!-- ADVISORY SUMMARY NOTE -->
        <div style="background: #F3F8F2; border: 1px solid #D2E6D0; border-radius: 12px; padding: 10px 14px;">
          <div style="font-size: 10.5px; font-weight: bold; color: #1B5E20; margin-bottom: 2px;">${t.yieldAdvisoryHeading}</div>
          <p style="margin: 0; font-size: 10px; color: #2E5C32; line-height: 1.4;">${t.yieldAdvisoryText}</p>
        </div>
      </div>

      <!-- FOOTER -->
      <div style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #718096;">
        <div>${t.footerNotice}</div>
        <div style="font-weight: bold; color: #2E7D32;">KrushiMitra © ${new Date().getFullYear()}</div>
      </div>
    </div>
  `;

  await renderHtmlToPdf(htmlContent, t.filenameComp);
}

/* Sample fallback data for preview if user history is empty */
function getSamplePredictions() {
  return [
    {
      crop: "Soybean",
      district: "Pune",
      season: "Kharif",
      area: 3.5,
      rainfall: 950,
      temperature: 28,
      productivity: 3.42,
      createdAt: new Date(),
    },
    {
      crop: "Cotton",
      district: "Nagpur",
      season: "Kharif",
      area: 5.0,
      rainfall: 820,
      temperature: 31,
      productivity: 2.85,
      createdAt: new Date(),
    },
    {
      crop: "Wheat",
      district: "Nashik",
      season: "Rabi",
      area: 2.5,
      rainfall: 340,
      temperature: 22,
      productivity: 3.90,
      createdAt: new Date(),
    },
  ];
}

function getSampleRecommendations() {
  return [
    {
      crop: "Rice",
      nitrogen: 90,
      phosphorus: 42,
      potassium: 43,
      ph: 6.5,
      temperature: 26,
      humidity: 80,
      rainfall: 210,
      createdAt: new Date(),
    },
    {
      crop: "Cotton",
      nitrogen: 120,
      phosphorus: 50,
      potassium: 45,
      ph: 6.8,
      temperature: 30,
      humidity: 65,
      rainfall: 110,
      createdAt: new Date(),
    },
    {
      crop: "Gram",
      nitrogen: 40,
      phosphorus: 65,
      potassium: 35,
      ph: 7.2,
      temperature: 20,
      humidity: 45,
      rainfall: 70,
      createdAt: new Date(),
    },
  ];
}
