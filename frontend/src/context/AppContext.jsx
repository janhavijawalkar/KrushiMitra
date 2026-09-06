import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL, buildApiUrl } from "../utils/apiConfig";

const AppContext = createContext(null);

export const CROP_TRANSLATIONS = {
  jute: { en: "Jute", hi: "जूट (पटसन)", mr: "ताग (Jute)" },
  rice: { en: "Rice (Paddy)", hi: "चावल (धान)", mr: "भात (तांदूळ)" },
  paddy: { en: "Rice (Paddy)", hi: "चावल (धान)", mr: "भात (तांदूळ)" },
  wheat: { en: "Wheat", hi: "गेहूं", mr: "गहू" },
  cotton: { en: "Cotton", hi: "कपास", mr: "कापूस" },
  sugarcane: { en: "Sugarcane", hi: "गन्ना", mr: "ऊस" },
  soybean: { en: "Soybean", hi: "सोयाबीन", mr: "सोयाबीन" },
  maize: { en: "Maize (Corn)", hi: "मक्का", mr: "मका" },
  corn: { en: "Maize (Corn)", hi: "मक्का", mr: "मका" },
  chickpea: { en: "Chickpea (Gram)", hi: "चना (छोले)", mr: "हरभरा" },
  gram: { en: "Gram (Chickpea)", hi: "चना", mr: "हरभरा" },
  tur: { en: "Tur (Pigeon Pea)", hi: "तूर (अरहर)", mr: "तूर" },
  pigeonpeas: { en: "Pigeon Peas (Tur)", hi: "अरहर (तूर)", mr: "तूर" },
  kidneybeans: { en: "Kidney Beans (Rajma)", hi: "राजमा", mr: "राजमा" },
  mothbeans: { en: "Moth Beans (Matki)", hi: "मोठ (मटकी)", mr: "मटकी" },
  mungbean: { en: "Mung Bean (Moong)", hi: "मूंग", mr: "मूग" },
  blackgram: { en: "Black Gram (Urad)", hi: "उड़द", mr: "उडीद" },
  lentil: { en: "Lentil (Masoor)", hi: "मसूर", mr: "मसूर" },
  pomegranate: { en: "Pomegranate", hi: "अनार", mr: "डाळिंब" },
  banana: { en: "Banana", hi: "केला", mr: "केळी" },
  mango: { en: "Mango", hi: "आम", mr: "आंबा" },
  grapes: { en: "Grapes", hi: "अंगूर", mr: "द्राक्षे" },
  watermelon: { en: "Watermelon", hi: "तरबूज", mr: "कलिंगड" },
  muskmelon: { en: "Muskmelon", hi: "खरबूजा", mr: "खरबूज" },
  apple: { en: "Apple", hi: "सेब", mr: "सफरचंद" },
  orange: { en: "Orange", hi: "संतरा", mr: "संत्रे" },
  papaya: { en: "Papaya", hi: "पपीता", mr: "पपई" },
  coconut: { en: "Coconut", hi: "नारियल", mr: "नारळ" },
  coffee: { en: "Coffee", hi: "कॉफ़ी", mr: "कॉफी" },
  groundnut: { en: "Groundnut (Peanut)", hi: "मूंगफली", mr: "भुईमूग" },
  sorghum: { en: "Sorghum (Jowar)", hi: "ज्वार", mr: "ज्वारी" },
  jowar: { en: "Jowar (Sorghum)", hi: "ज्वार", mr: "ज्वारी" },
  bajra: { en: "Bajra (Pearl Millet)", hi: "बाजरा", mr: "बाजरी" },
};

export const MAHARASHTRA_DISTRICTS = [
  "AHMEDNAGAR",
  "AKOLA",
  "AMRAVATI",
  "AURANGABAD",
  "BEED",
  "BHANDARA",
  "BULDHANA",
  "CHANDRAPUR",
  "DHULE",
  "GADCHIROLI",
  "GONDIA",
  "HINGOLI",
  "JALGAON",
  "JALNA",
  "KOLHAPUR",
  "LATUR",
  "MUMBAI",
  "NAGPUR",
  "NANDED",
  "NANDURBAR",
  "NASHIK",
  "OSMANABAD",
  "PALGHAR",
  "PARBHANI",
  "PUNE",
  "RAIGAD",
  "RATNAGIRI",
  "SANGLI",
  "SATARA",
  "SINDHUDURG",
  "SOLAPUR",
  "THANE",
  "WARDHA",
  "WASHIM",
  "YAVATMAL",
];

export const DISTRICT_TRANSLATIONS = {
  // 1. Ahmednagar / Ahilyanagar
  ahmednagar: { en: "Ahilyanagar (Ahmednagar)", hi: "अहिल्यानगर (अहमदनगर)", mr: "अहिल्यानगर (अहमदनगर)" },
  ahilyanagar: { en: "Ahilyanagar", hi: "अहिल्यानगर", mr: "अहिल्यानगर" },

  // 2. Akola
  akola: { en: "Akola", hi: "अकोला", mr: "अकोला" },

  // 3. Amravati
  amravati: { en: "Amravati", hi: "अमरावती", mr: "अमरावती" },

  // 4. Aurangabad / Chhatrapati Sambhajinagar
  aurangabad: { en: "Chhatrapati Sambhajinagar", hi: "छत्रपति संभाजीनगर", mr: "छत्रपती संभाजीनगर" },
  chhatrapatisambhajinagar: { en: "Chhatrapati Sambhajinagar", hi: "छत्रपति संभाजीनगर", mr: "छत्रपती संभाजीनगर" },
  sambhajinagar: { en: "Chhatrapati Sambhajinagar", hi: "छत्रपति संभाजीनगर", mr: "छत्रपती संभाजीनगर" },

  // 5. Beed
  beed: { en: "Beed", hi: "बीड", mr: "बीड" },
  bid: { en: "Beed", hi: "बीड", mr: "बीड" },

  // 6. Bhandara
  bhandara: { en: "Bhandara", hi: "भंडारा", mr: "भंडारा" },

  // 7. Buldhana
  buldhana: { en: "Buldhana", hi: "बुलढाणा", mr: "बुलढाणा" },
  buldana: { en: "Buldhana", hi: "बुलढाणा", mr: "बुलढाणा" },

  // 8. Chandrapur
  chandrapur: { en: "Chandrapur", hi: "चंद्रपुर", mr: "चंद्रपूर" },

  // 9. Dhule
  dhule: { en: "Dhule", hi: "धुले", mr: "धुळे" },

  // 10. Gadchiroli
  gadchiroli: { en: "Gadchiroli", hi: "गडचिरोली", mr: "गडचिरोली" },

  // 11. Gondia
  gondia: { en: "Gondia", hi: "गोंदिया", mr: "गोंदिया" },
  gondiya: { en: "Gondia", hi: "गोंदिया", mr: "गोंदिया" },

  // 12. Hingoli
  hingoli: { en: "Hingoli", hi: "हिंगोली", mr: "हिंगोली" },

  // 13. Jalgaon
  jalgaon: { en: "Jalgaon", hi: "जलगांव", mr: "जळगाव" },

  // 14. Jalna
  jalna: { en: "Jalna", hi: "जालना", mr: "जालना" },

  // 15. Kolhapur
  kolhapur: { en: "Kolhapur", hi: "कोल्हापुर", mr: "कोल्हापूर" },

  // 16. Latur
  latur: { en: "Latur", hi: "लातुर", mr: "लातूर" },

  // 17. Mumbai / Mumbai City / Mumbai Suburban
  mumbai: { en: "Mumbai", hi: "मुंबई", mr: "मुंबई" },
  mumbaicity: { en: "Mumbai City", hi: "मुंबई शहर", mr: "मुंबई शहर" },
  mumbaisuburban: { en: "Mumbai Suburban", hi: "मुंबई उपनगर", mr: "मुंबई उपनगर" },
  bombay: { en: "Mumbai", hi: "मुंबई", mr: "मुंबई" },

  // 18. Nagpur
  nagpur: { en: "Nagpur", hi: "नागपुर", mr: "नागपूर" },

  // 19. Nanded
  nanded: { en: "Nanded", hi: "नांदेड़", mr: "नांदेड" },

  // 20. Nandurbar
  nandurbar: { en: "Nandurbar", hi: "नंदुरबार", mr: "नंदुरबार" },

  // 21. Nashik
  nashik: { en: "Nashik", hi: "नासिक", mr: "नाशिक" },
  nasik: { en: "Nashik", hi: "नासिक", mr: "नाशिक" },

  // 22. Osmanabad / Dharashiv
  osmanabad: { en: "Dharashiv (Osmanabad)", hi: "धाराशिव (उस्मानाबाद)", mr: "धाराशिव (उस्मानाबाद)" },
  dharashiv: { en: "Dharashiv", hi: "धाराशिव", mr: "धाराशिव" },

  // 23. Palghar
  palghar: { en: "Palghar", hi: "पालघर", mr: "पालघर" },

  // 24. Parbhani
  parbhani: { en: "Parbhani", hi: "परभणी", mr: "परभणी" },

  // 25. Pune
  pune: { en: "Pune", hi: "पुणे", mr: "पुणे" },
  poona: { en: "Pune", hi: "पुणे", mr: "पुणे" },

  // 26. Raigad
  raigad: { en: "Raigad", hi: "रायगढ़", mr: "रायगड" },
  raigarh: { en: "Raigad", hi: "रायगढ़", mr: "रायगड" },
  alibag: { en: "Alibaug (Raigad)", hi: "अलिबाग", mr: "अलिबाग" },

  // 27. Ratnagiri
  ratnagiri: { en: "Ratnagiri", hi: "रत्नागिरि", mr: "रत्नागिरी" },

  // 28. Sangli
  sangli: { en: "Sangli", hi: "सांगली", mr: "सांगली" },

  // 29. Satara
  satara: { en: "Satara", hi: "सतारा", mr: "सातारा" },

  // 30. Sindhudurg
  sindhudurg: { en: "Sindhudurg", hi: "सिंधुदुर्ग", mr: "सिंधुदुर्ग" },

  // 31. Solapur
  solapur: { en: "Solapur", hi: "सोलापुर", mr: "सोलापूर" },
  sholapur: { en: "Solapur", hi: "सोलापुर", mr: "सोलापूर" },

  // 32. Thane
  thane: { en: "Thane", hi: "ठाणे", mr: "ठाणे" },
  thana: { en: "Thane", hi: "ठाणे", mr: "ठाणे" },

  // 33. Wardha
  wardha: { en: "Wardha", hi: "वर्धा", mr: "वर्धा" },

  // 34. Washim
  washim: { en: "Washim", hi: "वाशिम", mr: "वाशीम" },
  wasim: { en: "Washim", hi: "वाशिम", mr: "वाशीम" },

  // 35. Yavatmal
  yavatmal: { en: "Yavatmal", hi: "यवतमाल", mr: "यवतमाळ" },
  yeotmal: { en: "Yavatmal", hi: "यवतमाल", mr: "यवतमाळ" },

  // Major Sub-districts / APMC Agricultural Hubs
  baramati: { en: "Baramati", hi: "बारामती", mr: "बारामती" },
  lasalgaon: { en: "Lasalgaon", hi: "लासलगांव", mr: "लासलगाव" },
  shirdi: { en: "Shirdi", hi: "शिर्डी", mr: "शिर्डी" },
  pandharpur: { en: "Pandharpur", hi: "पंढरपुर", mr: "पंढरपूर" },
  malegaon: { en: "Malegaon", hi: "मालेगांव", mr: "मालेगाव" },
  kalyan: { en: "Kalyan", hi: "कल्याण", mr: "कल्याण" },
  navimumbai: { en: "Navi Mumbai", hi: "नवी मुंबई", mr: "नवी मुंबई" },
  vashi: { en: "Vashi", hi: "वाशी", mr: "वाशी" },
  panvel: { en: "Panvel", hi: "पनवेल", mr: "पनवेल" },
  sangamner: { en: "Sangamner", hi: "संगमनेर", mr: "संगमनेर" },
  shrirampur: { en: "Shrirampur", hi: "श्रीरामपुर", mr: "श्रीरामपूर" },
  karad: { en: "Karad", hi: "कराड", mr: "कराड" },
  ichalkaranji: { en: "Ichalkaranji", hi: "इचलकरंजी", mr: "इचलकरंजी" },

  // Region & Country
  maharashtra: { en: "Maharashtra", hi: "महाराष्ट्र", mr: "महाराष्ट्र" },
  india: { en: "India", hi: "भारत", mr: "भारत" },
};

export const getLocalizedCropName = (crop, lang = "en") => {
  if (!crop) return "—";
  const raw = crop.toString().trim();
  const key = raw.toLowerCase().replace(/[\s\-_()]/g, "");
  
  if (CROP_TRANSLATIONS[key]) {
    return CROP_TRANSLATIONS[key][lang] || CROP_TRANSLATIONS[key]["en"] || raw;
  }
  
  const foundKey = Object.keys(CROP_TRANSLATIONS).find(
    (k) => key.includes(k) || k.includes(key)
  );
  if (foundKey && CROP_TRANSLATIONS[foundKey]) {
    return CROP_TRANSLATIONS[foundKey][lang] || CROP_TRANSLATIONS[key]["en"] || raw;
  }
  
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

export const getLocalizedDistrictName = (district, lang = "en") => {
  if (!district) return "—";
  const raw = district.toString().trim();
  const clean = raw
    .replace(/,\s*(IN|India|Maharashtra|महाराष्ट्र|भारत)/gi, "")
    .replace(/\s+(District|जिल्हा|जिला)/gi, "")
    .trim();
  const key = clean.toLowerCase().replace(/[\s\-_(),]/g, "");

  if (DISTRICT_TRANSLATIONS[key]) {
    return DISTRICT_TRANSLATIONS[key][lang] || DISTRICT_TRANSLATIONS[key]["en"] || clean;
  }

  const foundKey = Object.keys(DISTRICT_TRANSLATIONS).find(
    (k) => key.includes(k) || k.includes(key)
  );
  if (foundKey && DISTRICT_TRANSLATIONS[foundKey]) {
    return DISTRICT_TRANSLATIONS[foundKey][lang] || DISTRICT_TRANSLATIONS[foundKey]["en"] || clean;
  }

  return clean;
};

export const getLocalizedSeasonName = (season, lang = "en") => {
  if (!season) return "—";
  const s = season.toString().trim().toLowerCase();
  if (s.includes("kharif")) return lang === "mr" ? "खरीप" : lang === "hi" ? "खरीफ" : "Kharif";
  if (s.includes("rabi")) return lang === "mr" ? "रब्बी" : lang === "hi" ? "रबी" : "Rabi";
  if (s.includes("summer") || s.includes("jayad") || s.includes("zaid")) return lang === "mr" ? "उन्हाळी" : lang === "hi" ? "जायद/गर्मी" : "Summer";
  if (s.includes("annual") || s.includes("year")) return lang === "mr" ? "वार्षिक" : lang === "hi" ? "वार्षिक" : "Annual";
  return season;
};

const translations = {
  en: {
    dashboard: "Dashboard",
    prediction: "Crop Prediction",
    recommendation: "Crop Recommendation",
    weather: "Weather",
    reports: "Reports",
    history: "History",
    profile: "Profile",
    settings: "Settings",
    admin: "Admin",

    mainMenu: "Main Menu",
    account: "Account",
    logout: "Logout",
    toggleSidebar: "Toggle Sidebar",
    aiAgriculture: "AI AGRICULTURE",

    searchPlaceholder: "Search crops, yield history, guides...",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    notifications: "Notifications",
    unreadNotifications: "Unread Notifications",
    allNotifications: "All Notifications",
    clearAll: "Clear All",
    noNotifications: "No notifications",
    noUnreadNotifications: "No unread notifications",
    farmer: "Farmer",
    language: "Language",

    search: "Search",
    save: "Save",
    saveChanges: "Save Changes",
    savedSuccessfully: "Saved successfully.",
    cancel: "Cancel",
    confirm: "Confirm",
    edit: "Edit",
    delete: "Delete",
    submit: "Submit",
    back: "Back",
    next: "Next",
    close: "Close",
    loading: "Loading...",
    noData: "No data available",
    success: "Success",
    error: "An error occurred",
    retry: "Retry",
    tryAgain: "Try Again",
    required: "Required",
    reset: "Reset",
    date: "Date",
    type: "Type",
    result: "Result",
    actions: "Actions",
    action: "Action",
    status: "Status",
    view: "View",

    welcome: "Welcome to KrushiMitra",
    goodMorning: "Good Morning",
    goodAfternoon: "Good Afternoon",
    goodEvening: "Good Evening",
    goodNight: "Namaste",
    overview:
      "Use AI-powered predictions and recommendations to make better decisions for your crops.",
    makePrediction: "Predict Harvest Yield",
    totalPredictions: "Total Predictions",
    soilAdvisories: "Soil Advisories",
    modelAccuracy: "Model Accuracy",
    cropsAnalyzed: "Crops Analyzed",
    estimatedProfit: "Avg. Estimated Profit",
    recentPredictions: "Recent Predictions",
    latestPredictions: "Your latest crop yield forecasts",
    viewAll: "View All",
    crop: "Crop",
    location: "Location",
    yield: "Yield",
    confidence: "Confidence",
    averagePredictedYield: "Average Predicted Yield",
    comparedWithPrevious: "Compared with your previous predictions",
    latestRecommendation: "Latest Recommendation",
    basedOnSoilWeather:
      "Based on soil nutrients, rainfall, humidity and temperature.",
    getNewRecommendation: "Get New Recommendation",
    weatherAdvisory: "Farm Weather Outlook",
    viewWeather: "View Weather & Forecast",
    currentFarmingRegion: "Current Farming Region",
    checkWeather: "Check weather",
    noPredictionsFound: "No predictions found.",
    districtBadgeSuffix: "District",
    farmlandProfileBadge: "Farmland Profile",
    registeredFarmerBadge: "Registered Farmer",
    superAdminBadge: "Super-Admin",
    dashboardFarmerBannerSub: "Smart AI Agronomy Dashboard for your farm in {district}. Get instant crop predictions, nutrient advisories, and weather forecasts.",
    dashboardAdminBannerSub: "Administrator Overview: Monitor ML inference throughput, registered farmers directory, and system health.",
    dashboardWeatherCardSub: "Real-time district weather data, humidity alerts, and customized farming advice for {district}.",
    acresUnit: "Acres",
    hectaresUnit: "Hectares",
    completedStatus: "Completed",
    liveBadge: "Live",

    cropPrediction: "Crop Productivity Prediction",
    cropYieldPrediction: "Crop Yield Prediction",
    district: "District",
    cropYear: "Crop Year",
    season: "Season",
    area: "Area",
    rainfall: "Rainfall",
    maximumTemperature: "Maximum Temperature",
    predictProductivity: "Predict Productivity",
    predictedProductivity: "Predicted Productivity",
    predictionResult: "Prediction Result",
    enterDetails:
      "Enter the required agricultural and weather details to predict crop productivity.",
    cropFieldInformation: "Crop & Field Information",
    enterFieldDetails:
      "Enter the details of your agricultural field",
    predictYield: "Predict Yield",
    predicting: "Predicting...",
    predictionFailed: "Prediction Failed",
    aiModelPrediction: "AI Model Prediction",
    aboutCropYieldPrediction: "About Crop Yield Prediction",
    cropYieldDescription:
      "KrushiMitra analyzes regional agricultural, crop, rainfall, temperature, area, and location datasets to estimate expected harvest productivity.",
    backToDashboard: "Back to Dashboard",
    tonnesPerHectare: "tonnes/hectare",
    select: "Select",
    fillAllFields: "Please fill all fields.",
    makeSureBackendRunning:
      "Make sure your Flask backend is running on port 5000.",
    backendConnectionError:
      "Unable to connect to the KrushiMitra backend. Please make sure Flask is running on port 5000.",

    aiCropRecommendation: "AI CROP RECOMMENDATION",
    cropRecommendation: "Crop Recommendation",
    recommendationDescription:
      "Analyze soil nutrients and environmental conditions to discover the crop best suited for your farmland.",
    invalidNumericValues: "Please enter valid numeric values.",
    recommendationFailed:
      "Unable to generate crop recommendation.",
    soilClimateInformation: "Soil & Climate Information",
    enterFarmConditions:
      "Enter your farmland conditions for AI analysis.",
    nitrogen: "Nitrogen (N)",
    phosphorus: "Phosphorus (P)",
    potassium: "Potassium (K)",
    temperature: "Temperature",
    humidity: "Humidity",
    soilPh: "Soil pH",
    mlRecommendationModel: "Soil & Climate Advisory",
    mlRecommendationDescription:
      "Evaluates N, P, K, pH and climate conditions.",
    analyzingConditions: "Analyzing Conditions...",
    recommendBestCrop: "Recommend Best Crop",
    howKrushiMitraWorks: "How KrushiMitra Works",
    aiCropSuitabilityAnalysis:
      "AI-based crop suitability analysis",
    soilAnalysis: "Soil Analysis",
    soilAnalysisDescription:
      "N, P, K and soil pH are evaluated.",
    climateAnalysis: "Climate Analysis",
    climateAnalysisDescription:
      "Temperature, humidity and rainfall are considered.",
    aiRecommendation: "Crop Suitability Analysis",
    aiRecommendationDescription:
      "Evaluates soil chemistry and regional meteorological data.",
    parameters: "Parameters",
    aiRecommendationComplete:
      "Soil & Crop Analysis Complete",
    recommendedCrop: "Recommended Crop",
    recommendationConfidence:
      "Suitability Match",
    recommendationResultDescription:
      "Based on the soil nutrient levels and environmental conditions you provided, this crop has been identified as the most suitable option.",
    modelConfidenceScore: "Suitability index",
    newRecommendation: "New Recommendation",
    soilNutrients: "Soil Nutrients",
    soilNutrientsDescription:
      "Nitrogen, phosphorus and potassium help determine crop suitability.",
    climateConditions: "Climate Conditions",
    climateConditionsDescription:
      "Temperature, humidity and rainfall influence crop selection.",
    machineLearning: "Seasonal Suitability",
    machineLearningDescription:
      "Aligns recommendations with regional sowing windows and soil health.",
    seasonalSuitability: "Seasonal Suitability",
    seasonalSuitabilityDescription:
      "Aligns recommendations with regional sowing windows and soil health.",

    weatherForecast: "Weather Forecast",
    weatherDescription:
      "Monitor current weather conditions to make better farming decisions.",
    searchCity: "Search city or district",
    enterCityDistrict:
      "Enter city or district e.g. Amravati",
    currentWeather: "Current Weather",
    feelsLike: "Feels Like",
    weatherCondition: "Weather Condition",
    weatherInformation: "Weather Information",
    weatherDetails: "Weather Details",
    weatherDetailsDescription:
      "Current atmospheric conditions",
    weatherConditions: "Weather Conditions",
    weatherConditionsDescription:
      "Additional atmospheric information",
    checkYourLocalWeather:
      "Check Your Local Weather",
    weatherEmptyDescription:
      "Enter your city or district to view temperature, rainfall, humidity, wind speed and other weather conditions.",
    fetchingWeather:
      "Fetching latest weather data...",
    weatherUnavailable:
      "Unable to fetch weather.",
    cityRequired:
      "Please enter a city or district.",
    farmingInsight:
      "Farming Weather Insight",
    farmingInsightDescription:
      "Current conditions can help farmers plan irrigation, spraying and other field activities. Always consider local field conditions before making agricultural decisions.",
    relativeHumidity: "Relative humidity",
    rainfallLastHour: "Rainfall in last hour",
    currentWindSpeed: "Current wind speed",
    atmosphericPressure: "Atmospheric pressure",
    notAvailable: "Not available",
    visibility: "Visibility",
    cloudiness: "Cloudiness",
    windSpeed: "Wind Speed",
    pressure: "Pressure",
    fieldEnvironment: "Field Environment & Micro-Climate",
    fieldEnvironmentDescription: "Atmospheric factors impacting crop transpiration and field operations",
    agriculturalAdvisory: "Field Operations & Farm Advisory",
    agriculturalAdvisoryDescription: "Practical guidance for spraying, irrigation and harvest safety",
    dewPoint: "Est. Dew Point",
    solarExposure: "Solar Exposure",
    sprayingCondition: "Pesticide Spraying",
    irrigationSchedule: "Irrigation Schedule",
    diseaseRisk: "Fungal Spore Risk",
    harvestSafety: "Harvest & Field Prep",

    report: "Report",
    generateReport: "Generate Report",
    generateNewReport: "Generate New Report",
    downloadReport: "Download Report",
    download: "Download",
    reportSummary: "Report Summary",
    totalReports: "Total Reports",
    yieldReports: "Yield Reports",
    aiReports: "AI Reports",
    availableReports: "Available Reports",
    recentlyGeneratedReports:
      "Your recently generated KrushiMitra reports",
    cropYieldAnalysis: "Crop Yield Analysis",
    cropYieldAnalysisDescription:
      "Monthly crop yield prediction analysis",
    predictionPerformance: "Prediction Performance",
    predictionPerformanceDescription:
      "Farm harvest yield and prediction insights report",
    cropRecommendationReport: "Crop Recommendation",
    cropRecommendationReportDescription:
      "Recommended crops based on field conditions",
    yieldReport: "Yield Report",
    aiReport: "AI Report",
    reportType: "Report Type",
    period: "Period",
    reportGenerationDescription:
      "Generate detailed reports from your crop predictions, recommendations and historical agricultural data.",

    predictionHistory: "Prediction History",
    predictionHistoryDescription:
      "View your previous crop yield predictions.",
    newPrediction: "New Prediction",
    cropsPredicted: "Crops Predicted",
    avgConfidence: "Avg. Confidence",
    latestPrediction: "Latest Prediction",
    today: "Today",
    searchHistory:
      "Search by crop, district, season or year...",
    previousPredictions: "Previous Predictions",
    predictionRecords:
      "Your crop yield prediction records",
    predictedYield: "Predicted Yield",
    recommendationHistory:
      "Recommendation History",
    recommendationRecords:
      "Your previous crop recommendations",
    noRecommendationsFound:
      "No recommendations found.",
    recommendationDate: "Recommendation Date",

    myProfile: "My Profile",
    personalInformation: "Personal Information",
    personalDetails: "Personal Details",
    manageAccountDetails:
      "Manage your account details",
    editProfile: "Edit Profile",
    name: "Name",
    fullName: "Full Name",
    email: "Email",
    emailAddress: "Email Address",
    phoneNumber: "Phone Number",
    state: "State",
    memberSince: "Member since",
    activityStats: "Activity Stats",
    reportsGenerated: "Reports Generated",
    profileCropsAnalyzed: "Crops Analyzed",
    profileAvgConfidence: "Avg. Confidence",
    preferredLanguage: "Preferred Language",
    farmDetails: "Farm Details",
    enterFarmDetails:
      "Enter your farm details...",
    noFarmDetails:
      "No farm details added yet.",
    notProvided: "Not provided",
    security: "Security",
    manageAccountSecurity:
      "Manage your account security",
    password: "Password",
    passwordDescription:
      "Keep your password secure and updated.",
    changePassword: "Change Password",
    notifications: "Notifications",
    manageNotificationPreferences:
      "Manage your notification preferences",
    predictionResults: "Prediction results",
    weatherAlerts: "Weather alerts",
    cropRecommendations: "Crop recommendations",
    reportUpdates: "Report updates",

    applicationSettings: "Application Settings",
    settingsDescription:
      "Customize your KrushiMitra experience",
    appearance: "Appearance",
    privacy: "Privacy",
    helpSupport: "Help & Support",
    about: "About",
    customizeAppearance:
      "Customize how KrushiMitra looks",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    auto: "Auto",
    fontSize: "Font Size",
    small: "Small",
    medium: "Medium",
    large: "Large",
    saveAppearance: "Save Appearance",
    selectPreferredLanguage:
      "Select your preferred language",
    privacyDescription:
      "Manage your privacy and data preferences.",
    dataProtection: "Data Protection",
    dataProtectionDescription:
      "Your account information is stored securely.",
    predictionHistoryPrivacy:
      "Prediction History",
    predictionHistoryPrivacyDescription:
      "Your previous crop predictions are associated with your account.",
    needHelp:
      "Need help using KrushiMitra?",
    supportTeam: "KrushiMitra Support",
    supportDescription:
      "For assistance with crop prediction, recommendation, weather or reports, contact your project support team.",
    aboutKrushiMitra:
      "About KrushiMitra",
    aboutDescription:
      "KrushiMitra is an AI-powered agriculture platform designed to help farmers make data-driven decisions using crop prediction, crop recommendation and weather information.",
    aiAgriculturePlatform:
      "AI Agriculture Platform",
    appearanceSaved:
      "Appearance settings saved!",

    adminPanel: "Admin Panel",
    adminDescription:
      "KrushiMitra system and platform overview.",
    systemStatus: "System Status",
    servicesRunning:
      "KrushiMitra services are running normally.",
    users: "Users",
    registeredUsers: "Registered users",
    database: "Database",
    connected: "Connected",
    dataStorage: "Data storage",
    mlModel: "ML Model",
    ready: "Ready",
    predictionService: "Prediction service",
    system: "System",
    active: "Active",
    platformStatus: "Platform status",

    welcomeBack: "Welcome Back",
    loginToContinue:
      "Login to continue to KrushiMitra",
    emailLabel: "Email",
    passwordLabel: "Password",
    enterYourEmail: "Enter your email",
    enterYourPassword: "Enter your password",
    forgotPassword: "Forgot Password?",
    login: "Login",
    backToLogin: "Back to Login",
    dontHaveAccount:
      "Don't have an account?",
    register: "Register",
    aiPoweredAgriculture:
      "AI-Powered Agriculture Platform",
    rememberMe: "Remember my session",
    loginRequired:
      "Please enter email and password.",

    landingSolutions: "Solutions",
    landingHowItWorks: "How It Works",
    landingSupportedCrops: "Supported Crops",
    landingFarmers: "Farmers",
    landingFaq: "FAQ",
    signIn: "Sign In",
    getStarted: "Get Started",
    heroBadge: "Smart Farming & AI Agriculture Assistant",
    heroTitlePart1: "Empowering Farmers with",
    heroTitlePart2: "Smart AI Agriculture",
    heroSubtitle: "Get smart crop recommendations, accurate harvest yield predictions, live local weather updates, and easy-to-download farm PDF reports.",
    startFreePrediction: "Start Free Prediction",
    quickDemoLogin: "1-Click Demo Login",
    yieldForecast: "Yield Forecast",
    optimalMatch: "Optimal Crop Match",
    sowingWindow: "Optimal Kharif Sowing Window",
    solutionsHeader: "Smart Tools for Better Farming",
    solutionsSub: "Simple, easy-to-use AI tools to help you pick the best crops, forecast harvest output, and check live weather for your farm.",
    yieldForecastingTitle: "Crop Yield Prediction",
    yieldForecastingDesc: "Find out how much harvest (in tonnes/hectare) you can expect based on your district, land size, and weather.",
    soilAdvisoryTitle: "Soil & Crop Recommendation",
    soilAdvisoryDesc: "Enter your soil test values (N, P, K, pH) to find the most profitable and healthy crop for your field.",
    weatherTelemetryTitle: "Live Weather & Rain Forecast",
    weatherTelemetryDesc: "Check real-time temperature, rainfall, and weather conditions across Maharashtra to plan your sowing and irrigation.",
    pdfDossiersTitle: "Downloadable Farm Reports (PDF)",
    pdfDossiersDesc: "Download simple, professional 1-page PDF reports for your farm records, bank loans, or crop insurance.",
    howItWorksHeading: "How KrushiMitra Works in 3 Simple Steps",
    step1Title: "1. Enter Farm Details",
    step1Desc: "Select your district, land area, and simple soil test numbers.",
    step2Title: "2. Smart AI Analysis",
    step2Desc: "Our smart AI calculates the best crop options and expected harvest yield in seconds.",
    step3Title: "3. Get Advice & PDF",
    step3Desc: "View your personalized farm recommendations and download your clean PDF report.",
    supportedCropsHeading: "Supported Maharashtra Crops",
    supportedCropsSub: "Accurate predictions for major crops grown across Maharashtra farms.",
    farmerTestimonialsHeading: "Trusted by Fellow Farmers",
    faqHeading: "Frequently Asked Questions",
    ctaHeading: "Ready to Grow More and Farm Smarter?",
    ctaSubtitle: "Join fellow farmers using KrushiMitra to plan better harvests, test soil compatibility, and download farm reports.",
    createFreeAccount: "Create Free Account",
    instantDemoAccess: "Instant Demo Access",
    platformTools: "Platform Tools",
    farmerSupport: "Farmer Support",
    kisanHelpline: "Kisan Helpline",
    accountAccess: "Account Access",
    simHeader: "Live Agricultural Telemetry & Crop Forecast",
    simSub: "Real-time crop yield models, soil nutrient profiling, and live weather conditions.",
    yieldPredictorTab: "Yield Predictor",
    soilAdvisoryTab: "Soil Advisory",
    liveWeatherTab: "Live Weather",
    liveTelemetry: "Live Telemetry",
    selectDistrict: "Select District",
    selectCrop: "Select Crop",
    selectSeason: "Select Season",
    selectYear: "Select Year",
    cropArea: "Crop Area (Acres)",
    estimateHarvestYield: "Estimate Harvest Yield",
    findOptimalCrop: "Find Optimal Crop",
    useMyLiveLocation: "📍 Use My Live Location",
    locating: "Locating...",
    predictedYieldBanner: "PREDICTED CROP YIELD",
    recommendedCropBanner: "RECOMMENDED CROP",
    expectedOutput: "Expected Output",
    totalHarvest: "Total Harvest",
    totalHarvestEstimate: "Total Harvest Estimate",
    suitabilityFactor: "Suitability Factor",
    liveTemperature: "Live Temperature",
    relativeHumidity: "Relative Humidity",
    windVelocity: "Wind Velocity",
    farmingStatus: "Farming Status",
    atmosphericMoisture: "Atmospheric Moisture",
    breezeVelocity: "Breeze Velocity",
    openWeatherTelemetry: "OpenWeather Telemetry",
    exploreTool: "Explore Tool",
    tryStep: "Try Step",
    tryStepNow: "Now",
    allCropsFilter: "🌾 All Crops",
    kharifFilter: "🌧️ Kharif (Monsoon)",
    rabiFilter: "❄️ Rabi (Winter)",
    cashFilter: "💰 Cash Crops",
    farmerExperiences: "⭐ Farmer Experiences",
    helpAndAnswers: "❓ Help & Answers",
    joinFellowFarmers: "Join Fellow Progressive Farmers",
    aboutUsTitle: "🌱 About Us — KrushiMitra",
    aboutUsDesc1: "KrushiMitra is a smart agriculture platform designed to support farmers with data-driven and intelligent agricultural insights. Our project focuses on using agricultural, soil, weather, and historical crop data to help users make better decisions about crop selection and expected crop yield.",
    aboutUsDesc2: "KrushiMitra integrates intelligent recommendations, weather information, and an easy-to-use web interface to provide useful agricultural recommendations. By transforming complex agricultural data into simple and understandable information, the platform aims to make technology more accessible to farmers.",

    // Reports Page Full Localization
    reportsPageHeading: "Farm Reports & PDF Export",
    reportsPageSub: "Generate and download professional, formatted PDF agricultural reports for your farm records.",
    recordsReady: "Records Ready",
    pdfReadyBadge: "PDF Ready",
    exportBundleBtn: "Export Complete PDF Bundle",
    noReportsToExport: "No Reports to Export",
    loggedYieldPredictions: "Logged Yield Predictions",
    soilCropTests: "Soil & Crop Tests",
    availableFarmDossiers: "Available Farm Reports",
    dossierUnit: "Report",
    dossiersUnit: "Reports",
    noFarmReportsTitle: "No Farm Reports Generated Yet",
    noFarmReportsDesc: "You haven't run any crop recommendations or harvest yield predictions yet. Once you make your first prediction or soil test, official 1-page PDF farm reports will automatically appear here.",
    getSoilCropAdvisoryBtn: "Get Soil & Crop Advisory",
    predictHarvestYieldBtn: "Predict Harvest Yield",
    availableReportsCatalog: "Available PDF Reports Catalog",
    selectReportTypeSub: "Select an individual report type below to generate a tailored PDF document.",
    yieldReportItemTitle: "Crop Yield & Productivity Report",
    yieldReportItemDesc: "Comprehensive PDF document containing all your yield predictions, regional district trends, rainfall and temperature factors.",
    yieldReportItemType: "Yield Analysis",
    recReportItemTitle: "AI Crop Recommendation Advisory",
    recReportItemDesc: "Agronomic advisory PDF detailing your soil N-P-K nutrient assessments, pH profiles, and optimal AI crop matches.",
    recReportItemType: "Crop Advisory",
    masterReportItemTitle: "Master Comprehensive Farm Report",
    masterReportItemDesc: "Full executive summary combining yield forecasts, soil nutrient advisories, and model performance metrics.",
    masterReportItemType: "Comprehensive",
    recordCountSingular: "Record",
    recordCountPlural: "Records",
    downloadPdfBtn: "Download PDF",
    officialFarmRecordsTitle: "Official Farm Records & Advisory Documentation",
    officialFarmRecordsDesc: "KrushiMitra PDF reports are pre-formatted for printing, submitting to agricultural credit/loan applications, government crop insurance assessments, or sharing with local Krishi Vigyan Kendra (KVK) agronomists.",
    reportGeneratedSuccess: "has been generated as a PDF!",

    // Profile Page Localization
    profilePageHeading: "Farmer Profile & Farm Records",
    profilePageSub: "Manage your personal details, contact information, farm land characteristics, and security.",
    personalAndFarmInfo: "Personal & Farm Information",
    securityAndPassword: "Security & Password",
    notificationAlerts: "Notification Alerts",
    farmerAgriDetails: "Farmer & Agricultural Details",
    farmerAgriDetailsSub: "Update phone number, district, soil type, and farming methods.",
    editProfileDetails: "Edit Profile Details",
    contactAndIdentity: "1. Contact & Identity",
    farmerFullName: "Farmer Full Name *",
    phoneMobile: "Phone / WhatsApp Mobile *",
    pmKisanIdLabel: "KCC / PM-Kisan ID (Optional)",
    pmKisanIdPlaceholder: "Enter PM-Kisan / KCC ID if available",
    farmlandProfileHeading: "2. Farmland & Agronomic Profile",
    districtMaharashtra: "District (Maharashtra)",
    totalCultivatedLandArea: "Total Cultivated Land Area",
    primarySoilClass: "Primary Soil Classification",
    selectSoilType: "Select Soil Type...",
    irrigationWaterSource: "Irrigation & Water Source",
    selectIrrigationSource: "Select Irrigation Source...",
    primaryCropsLabel: "Primary Crops Usually Cultivated",
    primaryCropsPlaceholder: "e.g. Cotton, Soybean, Wheat, Rice, Sugarcane",
    fieldNotesLabel: "Field Notes & Farming Practices",
    fieldNotesPlaceholder: "Add your farm location, soil history, organic certifications...",
    saveFarmProfile: "Save Farm Profile",
    accountSecurityHeading: "Account Security & Password",
    accountSecuritySub: "Manage login credentials and protect your agricultural data.",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    enterCurrentPasswordPlaceholder: "Enter current password",
    min6CharsPlaceholder: "Min. 6 characters",
    reenterNewPasswordPlaceholder: "Re-enter new password",
    updatePassword: "Update Password",
    notifAlertsHeading: "Notification Alerts & Farmer Advisory Preferences",
    notifAlertsSub: "Select which updates you want to receive regarding your crop predictions and weather.",
    notifYieldTitle: "Crop Yield & Prediction Insights",
    notifYieldDesc: "Receive summaries when ML models predict new crop harvests.",
    notifWeatherTitle: "Live Extreme Weather & Rain Alerts",
    notifWeatherDesc: "Severe rainfall, wind speed, or sudden temperature change notifications.",
    notifCropRecTitle: "Seasonal Crop & Fertilizer Recommendations",
    notifCropRecDesc: "Kharif and Rabi seasonal crop advisory prompts for your soil type.",
    notifSmsTitle: "Kisan SMS Alerts to Mobile Phone",
    notifSmsDesc: "Send high-priority advisory updates directly to your registered phone number.",
    liveFarmStats: "Live Farm Statistics",
    yieldPredictionsLabel: "Yield Predictions:",
    cropRecommendationsLabel: "Crop Recommendations:",
    cropsUnit: "Crops",
    profileSavedSuccess: "Profile and farm details successfully saved!",
    passwordUpdatedSuccess: "Password successfully updated in database!",
    fillPasswordFields: "Please fill all password fields.",
    passwordMinLength: "New password must be at least 6 characters long.",
    passwordsDoNotMatch: "New passwords do not match.",
  },

  hi: {
    dashboard: "डैशबोर्ड",
    prediction: "फसल उत्पादन पूर्वानुमान",
    recommendation: "फसल सिफारिश",
    weather: "मौसम",
    reports: "रिपोर्ट",
    history: "इतिहास",
    profile: "प्रोफ़ाइल",
    settings: "सेटिंग्स",
    admin: "एडमिन",

    mainMenu: "मुख्य मेनू",
    account: "खाता",
    logout: "लॉग आउट",
    toggleSidebar: "साइडबार बदलें",
    aiAgriculture: "AI कृषि",

    searchPlaceholder:
      "फसल, पूर्वानुमान, रिपोर्ट खोजें...",
    notifications: "सूचनाएं",
    farmer: "किसान",
    language: "भाषा",

    search: "खोजें",
    save: "सहेजें",
    cancel: "रद्द करें",
    edit: "संपादित करें",
    delete: "हटाएं",
    submit: "जमा करें",
    back: "वापस",
    next: "अगला",
    close: "बंद करें",
    loading: "लोड हो रहा है...",
    noData: "कोई डेटा उपलब्ध नहीं है",
    success: "सफलता",
    error: "त्रुटि",
    tryAgain: "पुनः प्रयास करें",
    required: "आवश्यक",
    reset: "रीसेट",
    date: "दिनांक",
    type: "प्रकार",
    result: "परिणाम",
    actions: "कार्य",
    action: "कार्य",
    status: "स्थिति",
    view: "देखें",

    welcome: "कृषिमित्र में आपका स्वागत है",
    goodMorning: "सुप्रभात",
    goodAfternoon: "शुभ दोपहर",
    goodEvening: "शुभ संध्या",
    goodNight: "नमस्ते",
    overview:
      "अपनी फसलों के लिए बेहतर निर्णय लेने हेतु AI आधारित पूर्वानुमान और सिफारिशों का उपयोग करें।",
    makePrediction: "फसल उपज का अनुमान लगाएं",
    totalPredictions: "कुल पूर्वानुमान",
    soilAdvisories: "मृदा परीक्षण सलाह",
    modelAccuracy: "मॉडल सटीकता",
    cropsAnalyzed: "विश्लेषित फसलें",
    estimatedProfit: "औसत अनुमानित लाभ",
    recentPredictions: "हाल के पूर्वानुमान",
    latestPredictions: "आपके नवीनतम फसल उपज पूर्वानुमान",
    viewAll: "सभी देखें",
    crop: "फसल",
    location: "स्थान",
    yield: "उत्पादन",
    confidence: "विश्वसनीयता",
    averagePredictedYield:
      "औसत अनुमानित उत्पादन",
    comparedWithPrevious:
      "आपके पिछले पूर्वानुमानों की तुलना में",
    latestRecommendation: "नवीनतम सिफारिश",
    basedOnSoilWeather:
      "मिट्टी के पोषक तत्वों, वर्षा, आर्द्रता और तापमान के आधार पर।",
    getNewRecommendation:
      "नई सिफारिश प्राप्त करें",
    weatherAdvisory: "कृषि मौसम पूर्वानुमान",
    viewWeather: "मौसम और पूर्वानुमान देखें",
    currentFarmingRegion:
      "वर्तमान कृषि क्षेत्र",
    checkWeather: "मौसम जांचें",
    noPredictionsFound:
      "कोई पूर्वानुमान नहीं मिला।",
    districtBadgeSuffix: "जिला",
    farmlandProfileBadge: "कृषि प्रोफ़ाइल",
    registeredFarmerBadge: "पंजीकृत किसान",
    superAdminBadge: "सुपर-एडमिन",
    dashboardFarmerBannerSub: "{district} में आपके खेत के लिए स्मार्ट कृषि डैशबोर्ड। तुरंत फसल उपज पूर्वानुमान, पोषक तत्व सलाह और मौसम पूर्वानुमान प्राप्त करें।",
    dashboardAdminBannerSub: "प्रशासक अवलोकन: फसल पूर्वानुमान प्रणाली, पंजीकृत किसान निर्देशिका और सिस्टम स्वास्थ्य की निगरानी करें।",
    dashboardWeatherCardSub: "{district} के लिए वास्तविक समय जिला मौसम डेटा, आर्द्रता अलर्ट और अनुकूलित कृषि सलाह।",
    acresUnit: "एकड़",
    hectaresUnit: "हेक्टेयर",
    completedStatus: "पूर्ण",
    liveBadge: "लाइव",

    cropPrediction:
      "फसल उत्पादकता पूर्वानुमान",
    cropYieldPrediction:
      "फसल उत्पादन पूर्वानुमान",
    district: "जिला",
    cropYear: "फसल वर्ष",
    season: "मौसम",
    area: "क्षेत्रफल",
    rainfall: "वर्षा",
    maximumTemperature: "अधिकतम तापमान",
    predictProductivity:
      "उत्पादकता का पूर्वानुमान करें",
    predictedProductivity:
      "अनुमानित उत्पादकता",
    predictionResult: "पूर्वानुमान परिणाम",
    enterDetails:
      "फसल उत्पादकता का पूर्वानुमान करने के लिए आवश्यक कृषि और मौसम की जानकारी दर्ज करें।",
    cropFieldInformation:
      "फसल और खेत की जानकारी",
    enterFieldDetails:
      "अपने कृषि क्षेत्र का विवरण दर्ज करें",
    predictYield:
      "उत्पादन का पूर्वानुमान करें",
    predicting:
      "पूर्वानुमान हो रहा है...",
    predictionFailed:
      "पूर्वानुमान विफल रहा",
    aiModelPrediction:
      "AI मॉडल पूर्वानुमान",
    aboutCropYieldPrediction:
      "फसल उत्पादन पूर्वानुमान के बारे में",
    cropYieldDescription:
      "KrushiMitra ऐतिहासिक कृषि, फसल, वर्षा, तापमान, क्षेत्रफल और क्षेत्रीय डेटा का विश्लेषण करके अपेक्षित फसल उत्पादकता का अनुमान लगाता है।",
    backToDashboard:
      "डैशबोर्ड पर वापस जाएं",
    tonnesPerHectare:
      "टन प्रति हेक्टेयर",
    select: "चुनें",
    fillAllFields:
      "कृपया सभी फ़ील्ड भरें।",
    makeSureBackendRunning:
      "सुनिश्चित करें कि Flask बैकएंड पोर्ट 5000 पर चल रहा है।",
    backendConnectionError:
      "KrushiMitra बैकएंड से कनेक्ट नहीं हो सका। कृपया सुनिश्चित करें कि Flask पोर्ट 5000 पर चल रहा है।",

    aiCropRecommendation:
      "AI फसल सिफारिश",
    cropRecommendation:
      "फसल सिफारिश",
    recommendationDescription:
      "मिट्टी के पोषक तत्वों और पर्यावरणीय परिस्थितियों का विश्लेषण करके आपकी भूमि के लिए उपयुक्त फसल खोजें।",
    invalidNumericValues:
      "कृपया मान्य संख्यात्मक मान दर्ज करें।",
    recommendationFailed:
      "फसल सिफारिश तैयार नहीं की जा सकी।",
    soilClimateInformation:
      "मिट्टी और जलवायु की जानकारी",
    enterFarmConditions:
      "AI विश्लेषण के लिए अपनी कृषि भूमि की परिस्थितियां दर्ज करें।",
    nitrogen: "नाइट्रोजन (N)",
    phosphorus: "फास्फोरस (P)",
    potassium: "पोटैशियम (K)",
    temperature: "तापमान",
    humidity: "आर्द्रता",
    soilPh: "मिट्टी का pH",
    mlRecommendationModel:
      "मृदा एवं जलवायु सलाह",
    mlRecommendationDescription:
      "N, P, K, pH और जलवायु परिस्थितियों का मूल्यांकन करता है।",
    analyzingConditions:
      "परिस्थितियों का विश्लेषण हो रहा है...",
    recommendBestCrop:
      "उपयुक्त फसल की सिफारिश करें",
    howKrushiMitraWorks:
      "कृषिमित्र कैसे काम करता है",
    aiCropSuitabilityAnalysis:
      "AI आधारित फसल उपयुक्तता विश्लेषण",
    soilAnalysis:
      "मिट्टी का विश्लेषण",
    soilAnalysisDescription:
      "N, P, K और मिट्टी के pH का मूल्यांकन किया जाता है।",
    climateAnalysis:
      "जलवायु विश्लेषण",
    climateAnalysisDescription:
      "तापमान, आर्द्रता और वर्षा को ध्यान में रखा जाता है।",
    aiRecommendation: "फसल उपयुक्तता विश्लेषण",
    aiRecommendationDescription:
      "मिट्टी के पोषक तत्वों और क्षेत्रीय मौसम का विश्लेषण करता है।",
    parameters: "पैरामीटर",
    aiRecommendationComplete:
      "मृदा एवं फसल विश्लेषण पूर्ण",
    recommendedCrop: "अनुशंसित फसल",
    recommendationConfidence:
      "उपयुक्तता मिलान",
    recommendationResultDescription:
      "आपके द्वारा दिए गए मिट्टी के पोषक तत्वों और पर्यावरणीय परिस्थितियों के आधार पर इस फसल को सबसे उपयुक्त पाया गया है।",
    modelConfidenceScore:
      "उपयुक्तता सूचकांक",
    newRecommendation:
      "नई सिफारिश",
    soilNutrients: "मिट्टी के पोषक तत्व",
    soilNutrientsDescription:
      "नाइट्रोजन, फास्फोरस और पोटैशियम फसल की उपयुक्तता निर्धारित करने में मदद करते हैं।",
    climateConditions:
      "जलवायु परिस्थितियां",
    climateConditionsDescription:
      "तापमान, आर्द्रता और वर्षा फसल चयन को प्रभावित करते हैं।",
    machineLearning:
      "मौसमी उपयुक्तता",
    machineLearningDescription:
      "क्षेत्रीय बुवाई के समय और मिट्टी के स्वास्थ्य के अनुसार उपयुक्त फसल की सिफारिश करता है।",
    seasonalSuitability:
      "मौसमी उपयुक्तता",
    seasonalSuitabilityDescription:
      "क्षेत्रीय बुवाई के समय और मिट्टी के स्वास्थ्य के अनुसार उपयुक्त फसल की सिफारिश करता है।",

    weatherForecast: "मौसम पूर्वानुमान",
    weatherDescription:
      "बेहतर कृषि निर्णय लेने के लिए वर्तमान मौसम की स्थिति पर नज़र रखें।",
    searchCity: "शहर या जिला खोजें",
    enterCityDistrict:
      "शहर या जिला दर्ज करें जैसे अमरावती",
    currentWeather: "वर्तमान मौसम",
    feelsLike:
      "महसूस होने वाला तापमान",
    weatherCondition: "मौसम की स्थिति",
    weatherInformation: "मौसम की जानकारी",
    weatherDetails: "मौसम का विवरण",
    weatherDetailsDescription:
      "वर्तमान वायुमंडलीय परिस्थितियां",
    weatherConditions:
      "मौसम की परिस्थितियां",
    weatherConditionsDescription:
      "अतिरिक्त वायुमंडलीय जानकारी",
    checkYourLocalWeather:
      "अपने स्थानीय मौसम की जांच करें",
    weatherEmptyDescription:
      "तापमान, वर्षा, आर्द्रता, हवा की गति और अन्य मौसम की स्थिति देखने के लिए अपना शहर या जिला दर्ज करें।",
    fetchingWeather:
      "नवीनतम मौसम डेटा प्राप्त किया जा रहा है...",
    weatherUnavailable:
      "मौसम प्राप्त नहीं किया जा सका।",
    cityRequired:
      "कृपया शहर या जिला दर्ज करें।",
    farmingInsight: "कृषि मौसम सुझाव",
    farmingInsightDescription:
      "वर्तमान परिस्थितियां सिंचाई, छिड़काव और अन्य कृषि गतिविधियों की योजना बनाने में मदद कर सकती हैं। कृषि निर्णय लेने से पहले स्थानीय परिस्थितियों को ध्यान में रखें।",
    relativeHumidity:
      "सापेक्ष आर्द्रता",
    rainfallLastHour:
      "पिछले घंटे की वर्षा",
    currentWindSpeed:
      "वर्तमान हवा की गति",
    atmosphericPressure:
      "वायुमंडलीय दबाव",
    notAvailable: "उपलब्ध नहीं",
    visibility: "दृश्यता",
    cloudiness: "बादल",
    windSpeed: "हवा की गति",
    pressure: "वायुदाब",
    fieldEnvironment: "खेत का वातावरण और सूक्ष्म जलवायु",
    fieldEnvironmentDescription: "फसल वाष्पोत्सर्जन और खेत कार्यों को प्रभावित करने वाले कारक",
    agriculturalAdvisory: "कृषि कार्य एवं फसल सुरक्षा सलाह",
    agriculturalAdvisoryDescription: "छिड़काव, सिंचाई और फसल कटाई सुरक्षा के लिए व्यावहारिक मार्गदर्शन",
    dewPoint: "अनुमानित ओस बिंदु",
    solarExposure: "सौर प्रकाश स्तर",
    sprayingCondition: "कीटनाशक छिड़काव",
    irrigationSchedule: "सिंचाई कार्यक्रम",
    diseaseRisk: "फफूंद रोग जोखिम",
    harvestSafety: "कटाई एवं खेत कार्य",

    report: "रिपोर्ट",
    generateReport: "रिपोर्ट तैयार करें",
    generateNewReport:
      "नई रिपोर्ट तैयार करें",
    downloadReport:
      "रिपोर्ट डाउनलोड करें",
    download: "डाउनलोड",
    reportSummary: "रिपोर्ट सारांश",
    totalReports: "कुल रिपोर्ट",
    yieldReports: "उत्पादन रिपोर्ट",
    aiReports: "AI रिपोर्ट",
    availableReports: "उपलब्ध रिपोर्ट",
    recentlyGeneratedReports:
      "आपकी हाल ही में तैयार की गई KrushiMitra रिपोर्ट",
    cropYieldAnalysis:
      "फसल उत्पादन विश्लेषण",
    cropYieldAnalysisDescription:
      "मासिक फसल उत्पादन पूर्वानुमान विश्लेषण",
    predictionPerformance:
      "पूर्वानुमान प्रदर्शन",
    predictionPerformanceDescription:
      "फसल उत्पादन और कृषि पूर्वानुमान रिपोर्ट",
    cropRecommendationReport:
      "फसल सिफारिश",
    cropRecommendationReportDescription:
      "खेत की परिस्थितियों के आधार पर अनुशंसित फसलें",
    yieldReport: "उत्पादन रिपोर्ट",
    aiReport: "AI रिपोर्ट",
    reportType: "रिपोर्ट प्रकार",
    period: "अवधि",
    reportGenerationDescription:
      "अपनी फसल भविष्यवाणियों, सिफारिशों और ऐतिहासिक कृषि डेटा से विस्तृत रिपोर्ट तैयार करें।",

    predictionHistory: "पूर्वानुमान इतिहास",
    predictionHistoryDescription:
      "अपने पिछले फसल उत्पादन पूर्वानुमान देखें।",
    newPrediction: "नया पूर्वानुमान",
    cropsPredicted: "पूर्वानुमानित फसलें",
    avgConfidence:
      "औसत विश्वसनीयता",
    latestPrediction:
      "नवीनतम पूर्वानुमान",
    today: "आज",
    searchHistory:
      "फसल, जिला, मौसम या वर्ष के अनुसार खोजें...",
    previousPredictions:
      "पिछले पूर्वानुमान",
    predictionRecords:
      "आपके फसल उत्पादन पूर्वानुमान रिकॉर्ड",
    predictedYield:
      "अनुमानित उत्पादन",
    recommendationHistory:
      "सिफारिश इतिहास",
    recommendationRecords:
      "आपकी पिछली फसल सिफारिशें",
    noRecommendationsFound:
      "कोई सिफारिश नहीं मिली।",
    recommendationDate:
      "सिफारिश की तारीख",

    myProfile: "मेरी प्रोफ़ाइल",
    personalInformation:
      "व्यक्तिगत जानकारी",
    personalDetails:
      "व्यक्तिगत विवरण",
    manageAccountDetails:
      "अपने खाते का विवरण प्रबंधित करें",
    editProfile:
      "प्रोफ़ाइल संपादित करें",
    name: "नाम",
    fullName: "पूरा नाम",
    email: "ईमेल",
    emailAddress: "ईमेल पता",
    phoneNumber: "फ़ोन नंबर",
    state: "राज्य",
    memberSince:
      "सदस्य बने",
    activityStats:
      "गतिविधि आँकड़े",
    reportsGenerated:
      "तैयार की गई रिपोर्ट",
    profileCropsAnalyzed:
      "विश्लेषित फसलें",
    profileAvgConfidence:
      "औसत विश्वसनीयता",
    preferredLanguage:
      "पसंदीदा भाषा",
    farmDetails: "खेत का विवरण",
    enterFarmDetails:
      "अपने खेत का विवरण दर्ज करें...",
    noFarmDetails:
      "अभी तक खेत का कोई विवरण नहीं जोड़ा गया है।",
    notProvided:
      "उपलब्ध नहीं",
    security: "सुरक्षा",
    manageAccountSecurity:
      "अपने खाते की सुरक्षा प्रबंधित करें",
    password: "पासवर्ड",
    passwordDescription:
      "अपने पासवर्ड को सुरक्षित और अद्यतन रखें।",
    changePassword:
      "पासवर्ड बदलें",
    notifications: "सूचनाएं",
    manageNotificationPreferences:
      "अपनी सूचना प्राथमिकताएं प्रबंधित करें",
    predictionResults:
      "पूर्वानुमान परिणाम",
    weatherAlerts:
      "मौसम अलर्ट",
    cropRecommendations:
      "फसल सिफारिशें",
    reportUpdates:
      "रिपोर्ट अपडेट",

    applicationSettings:
      "एप्लिकेशन सेटिंग्स",
    settingsDescription:
      "अपने KrushiMitra अनुभव को अनुकूलित करें",
    appearance: "दिखावट",
    privacy: "गोपनीयता",
    helpSupport:
      "सहायता और समर्थन",
    about: "के बारे में",
    customizeAppearance:
      "KrushiMitra का रूप अनुकूलित करें",
    theme: "थीम",
    light: "लाइट",
    dark: "डार्क",
    auto: "ऑटो",
    fontSize:
      "फ़ॉन्ट आकार",
    small: "छोटा",
    medium: "मध्यम",
    large: "बड़ा",
    saveAppearance:
      "दिखावट सहेजें",
    selectPreferredLanguage:
      "अपनी पसंदीदा भाषा चुनें",
    privacyDescription:
      "अपनी गोपनीयता और डेटा प्राथमिकताएं प्रबंधित करें।",
    dataProtection:
      "डेटा सुरक्षा",
    dataProtectionDescription:
      "आपकी खाता जानकारी सुरक्षित रूप से संग्रहीत की जाती है।",
    predictionHistoryPrivacy:
      "पूर्वानुमान इतिहास",
    predictionHistoryPrivacyDescription:
      "आपके पिछले फसल पूर्वानुमान आपके खाते से जुड़े हैं।",
    needHelp:
      "KrushiMitra का उपयोग करने में सहायता चाहिए?",
    supportTeam:
      "KrushiMitra सहायता",
    supportDescription:
      "फसल पूर्वानुमान, सिफारिश, मौसम या रिपोर्ट से संबंधित सहायता के लिए अपनी परियोजना सहायता टीम से संपर्क करें।",
    aboutKrushiMitra:
      "KrushiMitra के बारे में",
    aboutDescription:
      "KrushiMitra एक AI आधारित कृषि प्लेटफॉर्म है जो किसानों को फसल पूर्वानुमान, फसल सिफारिश और मौसम की जानकारी के माध्यम से डेटा आधारित निर्णय लेने में मदद करता है।",
    aiAgriculturePlatform:
      "AI कृषि प्लेटफॉर्म",
    appearanceSaved:
      "दिखावट सेटिंग्स सहेजी गईं!",

    adminPanel: "एडमिन पैनल",
    adminDescription:
      "KrushiMitra सिस्टम और प्लेटफॉर्म का अवलोकन।",
    systemStatus: "सिस्टम स्थिति",
    servicesRunning:
      "KrushiMitra सेवाएं सामान्य रूप से चल रही हैं।",
    users: "उपयोगकर्ता",
    registeredUsers:
      "पंजीकृत उपयोगकर्ता",
    database: "डेटाबेस",
    connected: "कनेक्टेड",
    dataStorage: "डेटा स्टोरेज",
    mlModel: "ML मॉडल",
    ready: "तैयार",
    predictionService:
      "पूर्वानुमान सेवा",
    system: "सिस्टम",
    active: "सक्रिय",
    platformStatus:
      "प्लेटफॉर्म स्थिति",

    welcomeBack: "वापसी पर स्वागत है",
    loginToContinue:
      "KrushiMitra में जारी रखने के लिए लॉगिन करें",
    emailLabel: "ईमेल",
    passwordLabel: "पासवर्ड",
    enterYourEmail:
      "अपना ईमेल दर्ज करें",
    enterYourPassword:
      "अपना पासवर्ड दर्ज करें",
    forgotPassword:
      "पासवर्ड भूल गए?",
    login: "लॉगिन",
    backToLogin: "लॉगिन पर वापस जाएं",
    dontHaveAccount:
      "खाता नहीं है?",
    register: "रजिस्टर",
    aiPoweredAgriculture:
      "AI आधारित कृषि प्लेटफॉर्म",
    rememberMe: "मुझे याद रखें",
    loginRequired:
      "कृपया ईमेल और पासवर्ड दर्ज करें।",

    landingSolutions: "समाधान",
    landingHowItWorks: "यह कैसे काम करता है",
    landingSupportedCrops: "समर्थित फसलें",
    landingFarmers: "किसान",
    landingFaq: "सामान्य प्रश्न",
    signIn: "साइन इन",
    getStarted: "शुरू करें",
    heroBadge: "किसानों के लिए स्मार्ट AI कृषि साथी",
    heroTitlePart1: "किसानों को सशक्त बनाना",
    heroTitlePart2: "स्मार्ट AI कृषि तकनीक से",
    heroSubtitle: "पाएं सही फसल की सलाह, सटीक उत्पादन का अनुमान, लाइव मौसम की जानकारी और आसान पीडीएफ रिपोर्ट।",
    startFreePrediction: "मुफ्त पूर्वानुमान शुरू करें",
    quickDemoLogin: "१-क्लिक डेमो लॉगिन",
    yieldForecast: "उत्पादन अनुमान",
    optimalMatch: "उपयुक्त फसल",
    sowingWindow: "खरीफ बुवाई के लिए सही समय",
    solutionsHeader: "बेहतर खेती के लिए आसान और स्मार्ट टूल्स",
    solutionsSub: "अपनी मिट्टी और मौसम के अनुसार सही फसल चुनें, पैदावार का अनुमान लगाएं और बेहतर मुनाफा कमाएं।",
    yieldForecastingTitle: "फसल उत्पादन का अनुमान",
    yieldForecastingDesc: "अपने जिले, खेत के आकार और मौसम के अनुसार जानें कि आपको कितनी पैदावार (टन/हेक्टेयर) मिल सकती है।",
    soilAdvisoryTitle: "मिट्टी के अनुसार फसल सलाह",
    soilAdvisoryDesc: "अपनी मिट्टी की जांच (N, P, K, pH) के अनुसार जानें कि आपके खेत के लिए कौन सी फसल सबसे फायदेमंद रहेगी।",
    weatherTelemetryTitle: "लाइव मौसम और बारिश की जानकारी",
    weatherTelemetryDesc: "बुवाई और सिंचाई की सही योजना बनाने के लिए अपने क्षेत्र के तापमान, हवा और बारिश की लाइव जानकारी देखें।",
    pdfDossiersTitle: "खेत की पीडीएफ रिपोर्ट डाउनलोड करें",
    pdfDossiersDesc: "बैंक लोन, फसल बीमा या अपने रिकॉर्ड के लिए 1-क्लिक में साफ और सुंदर पीडीएफ रिपोर्ट प्राप्त करें।",
    howItWorksHeading: "कृषि-मित्र कैसे काम करता है? (३ आसान कदम)",
    step1Title: "१. खेत की जानकारी भरें",
    step1Desc: "अपना जिला, खेत का क्षेत्रफल और मिट्टी के आंकड़े दर्ज करें।",
    step2Title: "२. AI द्वारा तुरंत जांच",
    step2Desc: "हमारा स्मार्ट AI कुछ ही सेकंड में सबसे उपयुक्त फसल और उत्पादन का हिसाब लगाता है।",
    step3Title: "३. सलाह देखें और रिपोर्ट पाएं",
    step3Desc: "अपनी फसल की सलाह देखें और अपने फोन में पीडीएफ रिपोर्ट डाउनलोड करें।",
    supportedCropsHeading: "प्रमुख समर्थित फसलें",
    supportedCropsSub: "महाराष्ट्र के खेतों में उगाई जाने वाली मुख्य फसलों के लिए सटीक मार्गदर्शन।",
    farmerTestimonialsHeading: "किसान भाइयों का विश्वास",
    faqHeading: "अक्सर पूछे जाने वाले प्रश्न",
    ctaHeading: "क्या आप अपनी खेती को और बेहतर बनाना चाहते हैं?",
    ctaSubtitle: "आज ही कृषि-मित्र से जुड़ें, सही फसल चुनें और अपनी पैदावार बढ़ाएं।",
    createFreeAccount: "मुफ्त खाता बनाएं",
    instantDemoAccess: "त्वरित डेमो एक्सेस",
    platformTools: "प्लेटफॉर्म टूल्स",
    farmerSupport: "किसान सहायता",
    kisanHelpline: "किसान हेल्पलाइन",
    accountAccess: "खाता पहुंच",
    simHeader: "लाइव कृषि आंकड़े एवं फसल पूर्वानुमान प्रणाली",
    simSub: "रीयल-टाइम फसल पैदावार अनुमान, मृदा परीक्षण विश्लेषण और लाइव मौसम सलाह।",
    yieldPredictorTab: "उपज पूर्वानुमान",
    soilAdvisoryTab: "मृदा एवं फसल सलाह",
    liveWeatherTab: "लाइव मौसम",
    liveTelemetry: "लाइव आंकड़े",
    selectDistrict: "जिला चुनें",
    selectCrop: "फसल चुनें",
    selectSeason: "मौसम चुनें",
    selectYear: "वर्ष चुनें",
    cropArea: "खेत का क्षेत्रफल (एकड़)",
    estimateHarvestYield: "अनुमानित उपज निकालें",
    findOptimalCrop: "सर्वोत्तम फसल खोजें",
    useMyLiveLocation: "📍 मेरा लाइव स्थान उपयोग करें",
    locating: "खोज रहा है...",
    predictedYieldBanner: "अनुमानित फसल उपज",
    recommendedCropBanner: "सिफारिश की गई फसल",
    expectedOutput: "अपेक्षित उत्पादन",
    totalHarvest: "कुल खेत उत्पादन",
    totalHarvestEstimate: "कुल अनुमानित पैदावार",
    suitabilityFactor: "अनुकूलता कारक",
    liveTemperature: "लाइव तापमान",
    relativeHumidity: "सापेक्ष आर्द्रता",
    windVelocity: "हवा की गति",
    farmingStatus: "कृषि स्थिति सलाह",
    atmosphericMoisture: "वायुमंडलीय नमी",
    breezeVelocity: "पवन गति",
    openWeatherTelemetry: "लाइव मौसम आंकड़े",
    exploreTool: "टूल उपयोग करें",
    tryStep: "चरण",
    tryStepNow: "का उपयोग करें",
    allCropsFilter: "🌾 सभी फसलें",
    kharifFilter: "🌧️ खरीफ (मानसून)",
    rabiFilter: "❄️ रबी (सर्दियां)",
    cashFilter: "💰 नकदी फसलें",
    farmerExperiences: "⭐ किसान भाइयों के अनुभव",
    helpAndAnswers: "❓ सहायता एवं उत्तर",
    joinFellowFarmers: "प्रगतिशील किसान भाइयों के साथ जुड़ें",
    aboutUsTitle: "🌱 हमारे बारे में — कृषि-मित्र",
    aboutUsDesc1: "कृषि-मित्र एक स्मार्ट कृषि प्लेटफॉर्म है जो किसानों को डेटा-संचालित और सटीक कृषि सलाह प्रदान करने के लिए बनाया गया है। हमारा उद्देश्य मिट्टी, मौसम और ऐतिहासिक फसल आंकड़ों का उपयोग करके किसानों को सही फसल चुनने और अपेक्षित उपज का अनुमान लगाने में सहायता करना है।",
    aboutUsDesc2: "कृषि-मित्र आधुनिक तकनीक, मौसम की जानकारी और सरल वेब इंटरफेस को जोड़कर किसानों को उपयोगी कृषि सलाह प्रदान करता है। जटिल कृषि आंकड़ों को सरल और समझने योग्य जानकारी में बदलकर तकनीक को किसानों तक पहुंचाना हमारा लक्ष्य है।",

    // Reports Page Full Localization
    reportsPageHeading: "कृषि रिपोर्ट एवं पीडीएफ डाउनलोड",
    reportsPageSub: "अपने खेत के रिकॉर्ड के लिए आधिकारिक एवं व्यवस्थित कृषि रिपोर्ट पीडीएफ प्रारूप में तैयार करें और डाउनलोड करें।",
    recordsReady: "रिकॉर्ड तैयार",
    pdfReadyBadge: "पीडीएफ तैयार",
    exportBundleBtn: "संपूर्ण रिपोर्ट बंडल डाउनलोड करें",
    noReportsToExport: "डाउनलोड के लिए कोई रिकॉर्ड नहीं है",
    loggedYieldPredictions: "दर्ज फसल उपज पूर्वानुमान",
    soilCropTests: "मृदा एवं फसल परीक्षण",
    availableFarmDossiers: "उपलब्ध कृषि रिपोर्ट",
    dossierUnit: "रिपोर्ट",
    dossiersUnit: "रिपोर्ट्स",
    noFarmReportsTitle: "अभी तक कोई कृषि रिपोर्ट नहीं बनाई गई है",
    noFarmReportsDesc: "आपने अभी तक कोई फसल सिफारिश या उत्पादन पूर्वानुमान नहीं किया है। पहला पूर्वानुमान या मृदा परीक्षण करते ही आधिकारिक 1-पेज पीडीएफ रिपोर्ट यहाँ दिखाई देगी।",
    getSoilCropAdvisoryBtn: "मृदा परीक्षण एवं फसल सलाह लें",
    predictHarvestYieldBtn: "फसल उपज का अनुमान लगाएं",
    availableReportsCatalog: "उपलब्ध पीडीएफ रिपोर्ट सूची",
    selectReportTypeSub: "अपनी आवश्यकतानुसार उपयुक्त रिपोर्ट चुनें और नीचे दिए गए बटन से पीडीएफ डाउनलोड करें।",
    yieldReportItemTitle: "फसल उत्पादकता एवं उपज पूर्वानुमान रिपोर्ट",
    yieldReportItemDesc: "आपके सभी उपज पूर्वानुमानों, जिला स्तरीय मौसम, वर्षा और तापमान कारकों का विस्तृत विश्लेषणात्मक दस्तावेज।",
    yieldReportItemType: "उपज विश्लेषण",
    recReportItemTitle: "मृदा परीक्षण एवं फसल सिफारिश रिपोर्ट",
    recReportItemDesc: "मिट्टी के N-P-K पोषक तत्वों, पीएच और मौसम के अनुसार सर्वोत्तम फसल सिफारिशों की आधिकारिक रिपोर्ट।",
    recReportItemType: "फसल सलाह",
    masterReportItemTitle: "व्यापक किसान कृषि परामर्श रिपोर्ट (मास्टर रिपोर्ट)",
    masterReportItemDesc: "उपज पूर्वानुमान, मृदा पोषक तत्व सिफारिश और मॉडल प्रदर्शन का समेकित संपूर्ण विवरण।",
    masterReportItemType: "व्यापक रिपोर्ट",
    recordCountSingular: "रिकॉर्ड",
    recordCountPlural: "रिकॉर्ड्स",
    downloadPdfBtn: "पीडीएफ डाउनलोड करें",
    officialFarmRecordsTitle: "आधिकारिक कृषि रिकॉर्ड एवं परामर्श प्रलेखन",
    officialFarmRecordsDesc: "कृषि-मित्र पीडीएफ रिपोर्ट कृषि ऋण/क्रेडिट आवेदन, फसल बीमा सत्यापन या स्थानीय कृषि विज्ञान केंद्र (KVK) विशेषज्ञों से परामर्श हेतु उपयुक्त प्रारूप में तैयार की गई हैं।",
    reportGeneratedSuccess: "पीडीएफ सफलतापूर्वक तैयार हो गई है!",

    // Profile Page Localization
    profilePageHeading: "किसान प्रोफ़ाइल एवं कृषि रिकॉर्ड",
    profilePageSub: "अपनी व्यक्तिगत जानकारी, संपर्क विवरण, खेत की मिट्टी व सिंचाई संबंधी जानकारी और सुरक्षा प्रबंधित करें।",
    personalAndFarmInfo: "व्यक्तिगत एवं कृषि विवरण",
    securityAndPassword: "सुरक्षा एवं पासवर्ड",
    notificationAlerts: "सूचनाएं एवं अलर्ट",
    farmerAgriDetails: "किसान एवं कृषि विवरण",
    farmerAgriDetailsSub: "मोबाइल नंबर, जिला, मिट्टी का प्रकार और सिंचाई पद्धति अपडेट करें।",
    editProfileDetails: "प्रोफ़ाइल संपादित करें",
    contactAndIdentity: "1. संपर्क एवं पहचान",
    farmerFullName: "किसान का पूरा नाम *",
    phoneMobile: "फोन / व्हाट्सएप मोबाइल *",
    pmKisanIdLabel: "KCC / पीएम-किसान आईडी (वैकल्पिक)",
    pmKisanIdPlaceholder: "यदि उपलब्ध हो तो पीएम-किसान / केसीसी आईडी दर्ज करें",
    farmlandProfileHeading: "2. कृषि भूमि एवं फसल प्रोफ़ाइल",
    districtMaharashtra: "जिला (महाराष्ट्र)",
    totalCultivatedLandArea: "कुल कृषि योग्य भूमि क्षेत्रफल",
    primarySoilClass: "प्राथमिक मिट्टी का प्रकार",
    selectSoilType: "मिट्टी का प्रकार चुनें...",
    irrigationWaterSource: "सिंचाई एवं जल स्रोत",
    selectIrrigationSource: "सिंचाई स्रोत चुनें...",
    primaryCropsLabel: "आमतौर पर उगाई जाने वाली प्रमुख फसलें",
    primaryCropsPlaceholder: "उदा. कपास, सोयाबीन, गेहूं, धान, गन्ना",
    fieldNotesLabel: "खेत संबंधी विवरण एवं कृषि पद्धतियां",
    fieldNotesPlaceholder: "खेत का स्थान, मिट्टी का इतिहास, जैविक प्रमाणन आदि लिखें...",
    saveFarmProfile: "कृषि प्रोफ़ाइल सहेजें",
    accountSecurityHeading: "खाता सुरक्षा एवं पासवर्ड",
    accountSecuritySub: "लॉगिन क्रेडेंशियल प्रबंधित करें और अपने कृषि डेटा को सुरक्षित रखें।",
    currentPassword: "वर्तमान पासवर्ड",
    newPassword: "नया पासवर्ड",
    confirmNewPassword: "नए पासवर्ड की पुष्टि करें",
    enterCurrentPasswordPlaceholder: "वर्तमान पासवर्ड दर्ज करें",
    min6CharsPlaceholder: "न्यूनतम 6 अक्षर",
    reenterNewPasswordPlaceholder: "नया पासवर्ड दोबारा दर्ज करें",
    updatePassword: "पासवर्ड अपडेट करें",
    notifAlertsHeading: "सूचनाएं एवं किसान सलाह प्राथमिकताएं",
    notifAlertsSub: "फसल पूर्वानुमान और मौसम संबंधी कौन-से अपडेट आप प्राप्त करना चाहते हैं, चुनें।",
    notifYieldTitle: "फसल उपज एवं पूर्वानुमान रिपोर्ट",
    notifYieldDesc: "नया फसल उत्पादन पूर्वानुमान होने पर अलर्ट प्राप्त करें।",
    notifWeatherTitle: "मौसम एवं भारी वर्षा अलर्ट",
    notifWeatherDesc: "अत्यधिक बारिश, तेज हवा और तापमान परिवर्तन की तत्काल सूचना।",
    notifCropRecTitle: "मौसमी फसल एवं खाद-उर्वरक सलाह",
    notifCropRecDesc: "खरीफ और रबी मौसम के लिए आपकी मिट्टी अनुसार फसल सलाह।",
    notifSmsTitle: "मोबाइल फोन पर किसान SMS अलर्ट",
    notifSmsDesc: "महत्वपूर्ण कृषि सलाह सीधे अपने पंजीकृत मोबाइल नंबर पर पाएं।",
    liveFarmStats: "लाइव कृषि आंकड़े",
    yieldPredictionsLabel: "उपज पूर्वानुमान:",
    cropRecommendationsLabel: "फसल सिफारिशें:",
    cropsUnit: "फसलें",
    profileSavedSuccess: "प्रोफ़ाइल एवं खेत का विवरण सफलतापूर्वक सहेजा गया!",
    passwordUpdatedSuccess: "पासवर्ड सफलतापूर्वक अपडेट कर दिया गया है!",
    fillPasswordFields: "कृपया पासवर्ड के सभी फ़ील्ड भरें।",
    passwordMinLength: "नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
    passwordsDoNotMatch: "दोनों पासवर्ड मेल नहीं खाते।",
  },

  mr: {
    dashboard: "डॅशबोर्ड",
    prediction: "पीक उत्पादन अंदाज",
    recommendation: "पीक शिफारस",
    weather: "हवामान",
    reports: "अहवाल",
    history: "इतिहास",
    profile: "प्रोफाइल",
    settings: "सेटिंग्ज",
    admin: "अॅडमिन",

    mainMenu: "मुख्य मेनू",
    account: "खाते",
    logout: "लॉग आउट",
    toggleSidebar: "साइडबार बदला",
    aiAgriculture: "AI कृषी",

    searchPlaceholder:
      "पीक, अंदाज, अहवाल शोधा...",
    notifications: "सूचना",
    farmer: "शेतकरी",
    language: "भाषा",

    search: "शोधा",
    save: "जतन करा",
    cancel: "रद्द करा",
    edit: "संपादित करा",
    delete: "हटवा",
    submit: "सबमिट करा",
    back: "मागे",
    next: "पुढे",
    close: "बंद करा",
    loading: "लोड होत आहे...",
    noData: "डेटा उपलब्ध नाही",
    success: "यशस्वी",
    error: "त्रुटी",
    tryAgain: "पुन्हा प्रयत्न करा",
    required: "आवश्यक",
    reset: "रीसेट",
    date: "दिनांक",
    type: "प्रकार",
    result: "निकाल",
    actions: "कृती",
    action: "कृती",
    status: "स्थिती",
    view: "पहा",

    welcome: "कृषिमित्रमध्ये आपले स्वागत आहे",
    goodMorning: "शुभ प्रभात",
    goodAfternoon: "शुभ दुपार",
    goodEvening: "शुभ संध्याकाळ",
    goodNight: "नमस्कार",
    overview:
      "आपल्या पिकांसाठी योग्य निर्णय घेण्यासाठी AI आधारित अंदाज आणि शिफारसींचा वापर करा.",
    makePrediction: "पीक उत्पादन अंदाज काढा",
    totalPredictions: "एकूण अंदाज",
    soilAdvisories: "माती परीक्षण सल्ला",
    modelAccuracy: "मॉडेल अचूकता",
    cropsAnalyzed: "विश्लेषित पिके",
    estimatedProfit: "सरासरी अंदाजित नफा",
    recentPredictions: "अलीकडील अंदाज",
    latestPredictions: "आपल्या शेतासाठी नवीनतम पीक उत्पादन अंदाज",
    viewAll: "सर्व पहा",
    crop: "पीक",
    location: "स्थान",
    yield: "उत्पादन",
    confidence: "विश्वास पातळी",
    averagePredictedYield:
      "सरासरी अंदाजित उत्पादन",
    comparedWithPrevious:
      "आपल्या मागील अंदाजांच्या तुलनेत",
    latestRecommendation:
      "नवीनतम शिफारस",
    basedOnSoilWeather:
      "मातीतील पोषक घटक, पाऊस, आर्द्रता आणि तापमानावर आधारित.",
    getNewRecommendation:
      "नवीन शिफारस मिळवा",
    weatherAdvisory: "शेती हवामान अंदाज",
    viewWeather: "हवामान व अंदाज पहा",
    currentFarmingRegion:
      "सध्याचा कृषी प्रदेश",
    checkWeather:
      "हवामान तपासा",
    noPredictionsFound:
      "कोणतेही अंदाज सापडले नाहीत.",
    districtBadgeSuffix: "जिल्हा",
    farmlandProfileBadge: "शेती प्रोफाईल",
    registeredFarmerBadge: "नोंदणीकृत शेतकरी",
    superAdminBadge: "मुख्य प्रशासक",
    dashboardFarmerBannerSub: "{district} येथील आपल्या शेतीसाठी स्मार्ट कृषी डॅशबोर्ड. त्वरित पीक उत्पादन अंदाज, खत-माती सल्ला आणि हवामान अंदाज मिळवा.",
    dashboardAdminBannerSub: "प्रशासक नियंत्रण: पीक अंदाज प्रणाली, नोंदणीकृत शेतकरी यादी आणि सिस्टीम स्थितीचे निरीक्षण करा.",
    dashboardWeatherCardSub: "{district} साठी थेट जिल्हा हवामान माहिती, आर्द्रता सतर्कता आणि विशेष शेती सल्ला.",
    acresUnit: "एकर",
    hectaresUnit: "हेक्टर",
    completedStatus: "पूर्ण",
    liveBadge: "थेट",

    cropPrediction:
      "पीक उत्पादकता अंदाज",
    cropYieldPrediction:
      "पीक उत्पादन अंदाज",
    district: "जिल्हा",
    cropYear: "पीक वर्ष",
    season: "हंगाम",
    area: "क्षेत्रफळ",
    rainfall: "पाऊस",
    maximumTemperature:
      "कमाल तापमान",
    predictProductivity:
      "उत्पादकतेचा अंदाज घ्या",
    predictedProductivity:
      "अंदाजित उत्पादकता",
    predictionResult:
      "अंदाजाचा निकाल",
    enterDetails:
      "पीक उत्पादकतेचा अंदाज घेण्यासाठी आवश्यक कृषी आणि हवामानाची माहिती भरा.",
    cropFieldInformation:
      "पीक आणि शेताची माहिती",
    enterFieldDetails:
      "आपल्या कृषी क्षेत्राची माहिती भरा",
    predictYield:
      "उत्पादनाचा अंदाज घ्या",
    predicting:
      "अंदाज घेतला जात आहे...",
    predictionFailed:
      "अंदाज घेता आला नाही",
    aiModelPrediction:
      "AI मॉडेल अंदाज",
    aboutCropYieldPrediction:
      "पीक उत्पादन अंदाजाबद्दल",
    cropYieldDescription:
      "KrushiMitra ऐतिहासिक कृषी, पीक, पाऊस, तापमान, क्षेत्रफळ आणि स्थानिक डेटाचे विश्लेषण करून अपेक्षित पीक उत्पादकतेचा अंदाज देते.",
    backToDashboard:
      "डॅशबोर्डवर परत जा",
    tonnesPerHectare:
      "टन प्रति हेक्टर",
    select: "निवडा",
    fillAllFields:
      "कृपया सर्व फील्ड भरा.",
    makeSureBackendRunning:
      "Flask बॅकएंड पोर्ट 5000 वर चालू असल्याची खात्री करा.",
    backendConnectionError:
      "KrushiMitra बॅकएंडशी कनेक्ट करता आले नाही. Flask पोर्ट 5000 वर चालू आहे याची खात्री करा.",

    aiCropRecommendation:
      "AI पीक शिफारस",
    cropRecommendation:
      "पीक शिफारस",
    recommendationDescription:
      "मातीतील पोषक घटक आणि पर्यावरणीय परिस्थितींचे विश्लेषण करून आपल्या शेतासाठी योग्य पीक शोधा.",
    invalidNumericValues:
      "कृपया वैध संख्यात्मक मूल्ये भरा.",
    recommendationFailed:
      "पीक शिफारस तयार करता आली नाही.",
    soilClimateInformation:
      "माती आणि हवामानाची माहिती",
    enterFarmConditions:
      "AI विश्लेषणासाठी आपल्या शेतातील परिस्थिती भरा.",
    nitrogen:
      "नायट्रोजन (N)",
    phosphorus:
      "फॉस्फरस (P)",
    potassium:
      "पोटॅशियम (K)",
    temperature:
      "तापमान",
    humidity:
      "आर्द्रता",
    soilPh:
      "मातीचा pH",
    mlRecommendationModel:
      "माती आणि हवामान सल्ला",
    mlRecommendationDescription:
      "N, P, K, pH आणि हवामानाच्या परिस्थितीचे मूल्यांकन करते.",
    analyzingConditions:
      "परिस्थितीचे विश्लेषण होत आहे...",
    recommendBestCrop:
      "योग्य पीक शिफारस करा",
    howKrushiMitraWorks:
      "कृषिमित्र कसे कार्य करते",
    aiCropSuitabilityAnalysis:
      "AI आधारित पीक योग्यतेचे विश्लेषण",
    soilAnalysis:
      "मातीचे विश्लेषण",
    soilAnalysisDescription:
      "N, P, K आणि मातीच्या pH चे मूल्यांकन केले जाते.",
    climateAnalysis:
      "हवामानाचे विश्लेषण",
    climateAnalysisDescription:
      "तापमान, आर्द्रता आणि पावसाचा विचार केला जातो.",
    aiRecommendation:
      "पीक उपयुक्तता विश्लेषण",
    aiRecommendationDescription:
      "मातीतील पोषक घटक आणि स्थानिक हवामानाचे सर्वसमावेशक मूल्यांकन करते.",
    parameters:
      "पॅरामीटर्स",
    aiRecommendationComplete:
      "माती आणि पीक विश्लेषण पूर्ण",
    recommendedCrop:
      "शिफारस केलेले पीक",
    recommendationConfidence:
      "उपयुक्तता जुळणी",
    recommendationResultDescription:
      "आपण दिलेल्या मातीतील पोषक घटक आणि पर्यावरणीय परिस्थितींवर आधारित हे पीक सर्वात योग्य असल्याचे आढळले आहे.",
    modelConfidenceScore:
      "उपयुक्तता निर्देशांक",
    newRecommendation:
      "नवीन शिफारस",
    soilNutrients:
      "मातीतील पोषक घटक",
    soilNutrientsDescription:
      "नायट्रोजन, फॉस्फरस आणि पोटॅशियम पीक योग्यतेचे निर्धारण करण्यास मदत करतात.",
    climateConditions:
      "हवामानाच्या परिस्थिती",
    climateConditionsDescription:
      "तापमान, आर्द्रता आणि पाऊस पीक निवडीवर परिणाम करतात.",
    machineLearning:
      "हंगामी योग्यता",
    machineLearningDescription:
      "हंगामी पेरणीची वेळ आणि मातीच्या आरोग्यानुसार योग्य पिकाची शिफारस करते.",
    seasonalSuitability:
      "हंगामी योग्यता",
    seasonalSuitabilityDescription:
      "हंगामी पेरणीची वेळ आणि मातीच्या आरोग्यानुसार योग्य पिकाची शिफारस करते.",

    weatherForecast:
      "हवामान अंदाज",
    weatherDescription:
      "चांगले कृषी निर्णय घेण्यासाठी सध्याच्या हवामानाच्या परिस्थितीवर लक्ष ठेवा.",
    searchCity:
      "शहर किंवा जिल्हा शोधा",
    enterCityDistrict:
      "शहर किंवा जिल्हा भरा उदा. अमरावती",
    currentWeather:
      "सध्याचे हवामान",
    feelsLike:
      "जाणवणारे तापमान",
    weatherCondition:
      "हवामानाची स्थिती",
    weatherInformation:
      "हवामानाची माहिती",
    weatherDetails:
      "हवामानाचा तपशील",
    weatherDetailsDescription:
      "सध्याच्या वातावरणीय परिस्थिती",
    weatherConditions:
      "हवामानाच्या परिस्थिती",
    weatherConditionsDescription:
      "अतिरिक्त वातावरणीय माहिती",
    checkYourLocalWeather:
      "आपल्या स्थानिक हवामानाची तपासणी करा",
    weatherEmptyDescription:
      "तापमान, पाऊस, आर्द्रता, वाऱ्याचा वेग आणि इतर हवामानाची माहिती पाहण्यासाठी शहर किंवा जिल्हा भरा.",
    fetchingWeather:
      "नवीनतम हवामान डेटा मिळवत आहे...",
    weatherUnavailable:
      "हवामान मिळवता आले नाही.",
    cityRequired:
      "कृपया शहर किंवा जिल्हा भरा.",
    farmingInsight:
      "शेतीसाठी हवामान सूचना",
    farmingInsightDescription:
      "सध्याच्या परिस्थितीमुळे सिंचन, फवारणी आणि इतर शेतीच्या कामांचे नियोजन करण्यात मदत होऊ शकते. कृषी निर्णय घेण्यापूर्वी स्थानिक परिस्थिती लक्षात घ्या.",
    relativeHumidity:
      "सापेक्ष आर्द्रता",
    rainfallLastHour:
      "मागील तासातील पाऊस",
    currentWindSpeed:
      "सध्याचा वाऱ्याचा वेग",
    atmosphericPressure:
      "वातावरणीय दाब",
    notAvailable:
      "उपलब्ध नाही",
    visibility:
      "दृश्यता",
    cloudiness:
      "ढगाळपणा",
    windSpeed:
      "वाऱ्याचा वेग",
    pressure:
      "हवेचा दाब",
    fieldEnvironment:
      "शेतातील वातावरण आणि सूक्ष्म हवामान",
    fieldEnvironmentDescription:
      "पिकांचे बाष्पीभवन आणि शेती कामांवर परिणाम करणारे वातावरणीय घटक",
    agriculturalAdvisory:
      "शेतीविषयक कामे आणि पीक सुरक्षा सल्ला",
    agriculturalAdvisoryDescription:
      "फवारणी, सिंचन आणि काढणी सुरक्षेसाठी प्रत्यक्ष मार्गदर्शन",
    dewPoint:
      "अपेक्षित दव बिंदू",
    solarExposure:
      "सौर प्रकाश पातळी",
    sprayingCondition:
      "कीटकनाशक फवारणी",
    irrigationSchedule:
      "सिंचन नियोजन",
    diseaseRisk:
      "बुरशीजन्य रोग जोखीम",
    harvestSafety:
      "काढणी आणि शेती कामे",

    report:
      "अहवाल",
    generateReport:
      "अहवाल तयार करा",
    generateNewReport:
      "नवीन अहवाल तयार करा",
    downloadReport:
      "अहवाल डाउनलोड करा",
    download:
      "डाउनलोड",
    reportSummary:
      "अहवालाचा सारांश",
    totalReports:
      "एकूण अहवाल",
    yieldReports:
      "उत्पादन अहवाल",
    aiReports:
      "AI अहवाल",
    availableReports:
      "उपलब्ध अहवाल",
    recentlyGeneratedReports:
      "आपले अलीकडे तयार केलेले KrushiMitra अहवाल",
    cropYieldAnalysis:
      "पीक उत्पादन विश्लेषण",
    cropYieldAnalysisDescription:
      "मासिक पीक उत्पादन अंदाज विश्लेषण",
    predictionPerformance:
      "अंदाज कार्यक्षमता",
    predictionPerformanceDescription:
      "AI मॉडेल अंदाज अचूकता अहवाल",
    cropRecommendationReport:
      "पीक शिफारस",
    cropRecommendationReportDescription:
      "शेतातील परिस्थितीनुसार शिफारस केलेली पिके",
    yieldReport:
      "उत्पादन अहवाल",
    aiReport:
      "AI अहवाल",
    reportType:
      "अहवाल प्रकार",
    period:
      "कालावधी",
    reportGenerationDescription:
      "आपल्या पीक अंदाज, शिफारसी आणि ऐतिहासिक कृषी डेटावर आधारित सविस्तर अहवाल तयार करा.",

    predictionHistory:
      "अंदाजाचा इतिहास",
    predictionHistoryDescription:
      "आपले मागील पीक उत्पादन अंदाज पहा.",
    newPrediction:
      "नवीन अंदाज",
    cropsPredicted:
      "अंदाजित पिके",
    avgConfidence:
      "सरासरी विश्वास पातळी",
    latestPrediction:
      "नवीनतम अंदाज",
    today:
      "आज",
    searchHistory:
      "पीक, जिल्हा, हंगाम किंवा वर्षानुसार शोधा...",
    previousPredictions:
      "मागील अंदाज",
    predictionRecords:
      "आपल्या पीक उत्पादन अंदाजाच्या नोंदी",
    predictedYield:
      "अंदाजित उत्पादन",
    recommendationHistory:
      "शिफारसींचा इतिहास",
    recommendationRecords:
      "आपल्या मागील पीक शिफारसी",
    noRecommendationsFound:
      "कोणत्याही शिफारसी सापडल्या नाहीत.",
    recommendationDate:
      "शिफारशीची तारीख",

    myProfile:
      "माझे प्रोफाइल",
    personalInformation:
      "वैयक्तिक माहिती",
    personalDetails:
      "वैयक्तिक तपशील",
    manageAccountDetails:
      "आपल्या खात्याचा तपशील व्यवस्थापित करा",
    editProfile:
      "प्रोफाइल संपादित करा",
    name:
      "नाव",
    fullName:
      "पूर्ण नाव",
    email:
      "ईमेल",
    emailAddress:
      "ईमेल पत्ता",
    phoneNumber:
      "फोन नंबर",
    state:
      "राज्य",
    memberSince:
      "सदस्यत्व सुरू",
    activityStats:
      "क्रियाकलाप आकडेवारी",
    reportsGenerated:
      "तयार केलेले अहवाल",
    profileCropsAnalyzed:
      "विश्लेषित पिके",
    profileAvgConfidence:
      "सरासरी विश्वास पातळी",
    preferredLanguage:
      "प्राधान्याची भाषा",
    farmDetails:
      "शेताची माहिती",
    enterFarmDetails:
      "आपल्या शेताची माहिती भरा...",
    noFarmDetails:
      "अजून शेताची माहिती जोडलेली नाही.",
    notProvided:
      "दिलेली नाही",
    security:
      "सुरक्षा",
    manageAccountSecurity:
      "आपल्या खात्याची सुरक्षा व्यवस्थापित करा",
    password:
      "पासवर्ड",
    passwordDescription:
      "आपला पासवर्ड सुरक्षित आणि अद्ययावत ठेवा.",
    changePassword:
      "पासवर्ड बदला",
    notifications:
      "सूचना",
    manageNotificationPreferences:
      "आपल्या सूचना प्राधान्ये व्यवस्थापित करा",
    predictionResults:
      "अंदाजाचे निकाल",
    weatherAlerts:
      "हवामान सूचना",
    cropRecommendations:
      "पीक शिफारसी",
    reportUpdates:
      "अहवाल अपडेट",

    applicationSettings:
      "अॅप्लिकेशन सेटिंग्ज",
    settingsDescription:
      "आपला KrushiMitra अनुभव सानुकूलित करा",
    appearance:
      "दिसणे",
    privacy:
      "गोपनीयता",
    helpSupport:
      "मदत आणि समर्थन",
    about:
      "आमच्याबद्दल",
    customizeAppearance:
      "KrushiMitra चे स्वरूप सानुकूलित करा",
    theme:
      "थीम",
    light:
      "लाइट",
    dark:
      "डार्क",
    auto:
      "ऑटो",
    fontSize:
      "फॉन्ट आकार",
    small:
      "लहान",
    medium:
      "मध्यम",
    large:
      "मोठा",
    saveAppearance:
      "दिसण्याची सेटिंग जतन करा",
    selectPreferredLanguage:
      "आपली प्राधान्याची भाषा निवडा",
    privacyDescription:
      "आपली गोपनीयता आणि डेटा प्राधान्ये व्यवस्थापित करा.",
    dataProtection:
      "डेटा संरक्षण",
    dataProtectionDescription:
      "आपली खाते माहिती सुरक्षितपणे साठवली जाते.",
    predictionHistoryPrivacy:
      "अंदाजाचा इतिहास",
    predictionHistoryPrivacyDescription:
      "आपले मागील पीक अंदाज आपल्या खात्याशी जोडलेले आहेत.",
    needHelp:
      "KrushiMitra वापरण्यास मदत हवी आहे?",
    supportTeam:
      "KrushiMitra समर्थन",
    supportDescription:
      "पीक अंदाज, शिफारस, हवामान किंवा अहवालांबाबत मदतीसाठी आपल्या प्रकल्प समर्थन टीमशी संपर्क साधा.",
    aboutKrushiMitra:
      "KrushiMitra बद्दल",
    aboutDescription:
      "KrushiMitra हे AI आधारित कृषी प्लॅटफॉर्म आहे जे पीक अंदाज, पीक शिफारस आणि हवामानाच्या माहितीचा वापर करून शेतकऱ्यांना डेटा आधारित निर्णय घेण्यास मदत करते.",
    aiAgriculturePlatform:
      "AI कृषी प्लॅटफॉर्म",
    appearanceSaved:
      "दिसण्याच्या सेटिंग्ज जतन केल्या आहेत!",

    adminPanel:
      "अॅडमिन पॅनेल",
    adminDescription:
      "KrushiMitra सिस्टम आणि प्लॅटफॉर्मचा आढावा.",
    systemStatus:
      "सिस्टम स्थिती",
    servicesRunning:
      "KrushiMitra सेवा सामान्यपणे सुरू आहेत.",
    users:
      "वापरकर्ते",
    registeredUsers:
      "नोंदणीकृत वापरकर्ते",
    database:
      "डेटाबेस",
    connected:
      "कनेक्टेड",
    dataStorage:
      "डेटा स्टोरेज",
    mlModel:
      "ML मॉडेल",
    ready:
      "तयार",
    predictionService:
      "अंदाज सेवा",
    system:
      "सिस्टम",
    active:
      "सक्रिय",
    platformStatus:
      "प्लॅटफॉर्म स्थिती",

    welcomeBack:
      "पुन्हा स्वागत आहे",
    loginToContinue:
      "KrushiMitra मध्ये पुढे जाण्यासाठी लॉगिन करा",
    emailLabel:
      "ईमेल",
    passwordLabel:
      "पासवर्ड",
    enterYourEmail:
      "आपला ईमेल भरा",
    enterYourPassword:
      "आपला पासवर्ड भरा",
    forgotPassword:
      "पासवर्ड विसरलात?",
    login:
      "लॉगिन",
    backToLogin:
      "लॉगिनकडे परत जा",
    dontHaveAccount:
      "खाते नाही?",
    register:
      "नोंदणी करा",
    aiPoweredAgriculture:
      "AI आधारित कृषी प्लॅटफॉर्म",
    rememberMe: "माझे लॉगिन लक्षात ठेवा",
    loginRequired:
      "कृपया ईमेल आणि पासवर्ड भरा.",

    landingSolutions: "सुविधा",
    landingHowItWorks: "कसे कार्य करते",
    landingSupportedCrops: "समर्थित पिके",
    landingFarmers: "शेतकरी",
    landingFaq: "वारंवार विचारले जाणारे प्रश्न",
    signIn: "साइन इन",
    getStarted: "सुरू करा",
    heroBadge: "शेतकऱ्यांसाठी स्मार्ट AI कृषी मार्गदर्शक",
    heroTitlePart1: "शेतकऱ्यांना सक्षम करणे",
    heroTitlePart2: "स्मार्ट AI कृषी तंत्रज्ञानाने",
    heroSubtitle: "मिळवा योग्य पिकाचा सल्ला, उत्पादनाचा अचूक अंदाज, थेट हवामान माहिती आणि सोपे शेती PDF अहवाल.",
    startFreePrediction: "मोफत अंदाज सुरू करा",
    quickDemoLogin: "१-क्लिक डेमो लॉगिन",
    yieldForecast: "उत्पादन अंदाज",
    optimalMatch: "योग्य पीक",
    sowingWindow: "खरीप पेरणीसाठी योग्य वेळ",
    solutionsHeader: "उत्तम शेतीसाठी सोपी व स्मार्ट साधने",
    solutionsSub: "माती आणि हवामानानुसार योग्य पीक निवडा, उत्पादनाचा अंदाज घ्या आणि शेतीचा नफा वाढवा.",
    yieldForecastingTitle: "पीक उत्पादन अंदाज",
    yieldForecastingDesc: "तुमचा जिल्हा, शेताचे क्षेत्रफळ आणि हवामानानुसार किती उत्पादन (टन/हेक्टर) मिळू शकते ते सहज जाणून घ्या.",
    soilAdvisoryTitle: "मातीनुसार योग्य पीक शिफारस",
    soilAdvisoryDesc: "माती परीक्षण घटक (N, P, K, pH) भरून तुमच्या शेतासाठी सर्वात फायदेशीर ठरणारे पीक शोधा.",
    weatherTelemetryTitle: "थेट हवामान व पावसाचा अंदाज",
    weatherTelemetryDesc: "पेरणी आणि पाणी व्यवस्थापनाचे नियोजन करण्यासाठी तुमच्या भागातील थेट तापमान आणि पावसाचा अंदाज पाहा.",
    pdfDossiersTitle: "शेतीचा PDF अहवाल डाउनलोड करा",
    pdfDossiersDesc: "बँक कर्ज, पीक विमा किंवा शेतीच्या नोंदींसाठी १-क्लिकमध्ये सोपा व अधिकृत PDF अहवाल मिळवा.",
    howItWorksHeading: "कृषीमित्र कसे कार्य करते? (३ सोप्या पायऱ्या)",
    step1Title: "१. शेताची माहिती भरा",
    step1Desc: "तुमचा जिल्हा, शेताचे क्षेत्रफळ आणि मातीचे घटक निवडा.",
    step2Title: "२. AI द्वारे जलद विश्लेषण",
    step2Desc: "आमची स्मार्ट प्रणाली काही सेकंदात योग्य पीक आणि उत्पादनाचा अंदाज काढते.",
    step3Title: "३. सल्ला व PDF अहवाल मिळवा",
    step3Desc: "तुमच्या शेतासाठी योग्य सल्ला पाहा आणि फोनवर PDF अहवाल डाउनलोड करा.",
    supportedCropsHeading: "महाराष्ट्रातील मुख्य समर्थित पिके",
    supportedCropsSub: "महाराष्ट्रातील प्रमुख पिकांसाठी अचूक आणि खात्रीशीर मार्गदर्शन.",
    farmerTestimonialsHeading: "शेतकरी बांधवांचा विश्वास",
    faqHeading: "वारंवार विचारले जाणारे प्रश्न",
    ctaHeading: "शेतीचे उत्पादन वाढवण्यासाठी तयार आहात का?",
    ctaSubtitle: "योग्य पीक नियोजन, माती परीक्षण आणि शेती अहवालांसाठी आजच कृषीमित्र वापरा.",
    createFreeAccount: "मोफत खाते तयार करा",
    instantDemoAccess: "त्वरित डेमो लॉगिन",
    platformTools: "प्लॅटफॉर्म टूल्स",
    farmerSupport: "शेतकरी मदत केंद्र",
    kisanHelpline: "किसान हेल्पलाइन",
    accountAccess: "खाते लॉगिन",
    simHeader: "थेट कृषी माहिती आणि पीक अंदाज प्रणाली",
    simSub: "रिअल-टाइम पीक उत्पादन अंदाज, माती परीक्षण विश्लेषण आणि थेट हवामान सल्ला.",
    yieldPredictorTab: "उत्पादन अंदाज",
    soilAdvisoryTab: "माती व पीक सल्ला",
    liveWeatherTab: "थेट हवामान",
    liveTelemetry: "थेट माहिती",
    selectDistrict: "जिल्हा निवडा",
    selectCrop: "पीक निवडा",
    selectSeason: "हंगाम निवडा",
    selectYear: "वर्ष निवडा",
    cropArea: "जमीन क्षेत्र (एकर)",
    estimateHarvestYield: "अंदाजित उत्पन्न काढा",
    findOptimalCrop: "योग्य पीक शोधा",
    useMyLiveLocation: "📍 माझे थेट स्थान वापरा",
    locating: "शोधत आहे...",
    predictedYieldBanner: "अंदाजित पीक उत्पादन",
    recommendedCropBanner: "शिफारस केलेले पीक",
    expectedOutput: "अपेक्षित उत्पन्न",
    totalHarvest: "एकूण शेत उत्पादन",
    totalHarvestEstimate: "एकूण अंदाजित उत्पादन",
    suitabilityFactor: "अनुकूलता निकष",
    liveTemperature: "थेट तापमान",
    relativeHumidity: "हवेतील आर्द्रता",
    windVelocity: "वाऱ्याचा वेग",
    farmingStatus: "शेती सल्ला स्थिती",
    atmosphericMoisture: "वातावरणातील ओलावा",
    breezeVelocity: "वाऱ्याचा वेग",
    openWeatherTelemetry: "थेट हवामान माहिती",
    exploreTool: "टूल वापरा",
    tryStep: "पायरी",
    tryStepNow: "वापरा",
    allCropsFilter: "🌾 सर्व पिके",
    kharifFilter: "🌧️ खरीप (पावसाळी)",
    rabiFilter: "❄️ रबी (हिवाळी)",
    cashFilter: "💰 नगदी पिके",
    farmerExperiences: "⭐ शेतकरी बांधवांचे अनुभव",
    helpAndAnswers: "❓ मदत आणि उत्तरे",
    joinFellowFarmers: "प्रगतीशील शेतकरी बांधवांमध्ये सामील व्हा",
    aboutUsTitle: "🌱 आमच्याबद्दल — कृषीमित्र",
    aboutUsDesc1: "कृषीमित्र हे एक स्मार्ट कृषी प्लॅटफॉर्म आहे जे शेतकऱ्यांना अचूक माहिती आणि अभ्यासावर आधारित कृषी मार्गदर्शन पुरवण्यासाठी तयार केले आहे. आमचा प्रकल्प शेतकरी बांधवांना माती परीक्षण, हवामान आणि मागील उत्पादनाच्या माहितीचा उपयोग करून योग्य पीक निवड आणि उत्पादनाचा अचूक अंदाज घेण्यास मदत करतो.",
    aboutUsDesc2: "कृषीमित्र आधुनिक तंत्रज्ञान, स्थानिक हवामान आणि सोप्या मराठी वेब इंटरफेसचा मेळ घालून उपयुक्त कृषी सल्ला देते. किचकट कृषी आकडेवारीचे सोप्या आणि सहज समजणाऱ्या माहितीमध्ये रूपांतर करून तंत्रज्ञान थेट शेतकऱ्यांच्या बांधापर्यंत पोहोचवणे हे आमचे ध्येय आहे.",

    // Reports Page Full Localization
    reportsPageHeading: "शेती अहवाल आणि पीडीएफ डाऊनलोड",
    reportsPageSub: "आपल्या शेती नोंदींसाठी अधिकृत आणि सुबक कृषी अहवाल पीडीएफ स्वरूपात तयार करा व डाऊनलोड करा.",
    recordsReady: "नोंदी तयार",
    pdfReadyBadge: "पीडीएफ तयार",
    exportBundleBtn: "सर्व अहवाल एकत्र डाऊनलोड करा (बंडल)",
    noReportsToExport: "डाऊनलोड करण्यासाठी नोंदी उपलब्ध नाहीत",
    loggedYieldPredictions: "नोंदणीकृत उत्पादन अंदाज",
    soilCropTests: "माती व पीक चाचण्या",
    availableFarmDossiers: "उपलब्ध शेती अहवाल",
    dossierUnit: "अहवाल",
    dossiersUnit: "अहवाल",
    noFarmReportsTitle: "अद्याप कोणतेही शेती अहवाल तयार केलेले नाहीत",
    noFarmReportsDesc: "तुम्ही अद्याप कोणतीही पीक शिफारस किंवा उत्पादन अंदाज तपासलेला नाही. पहिला अंदाज किंवा माती परीक्षण करताच अधिकृत १-पानांचे शेती अहवाल येथे उपलब्ध होतील.",
    getSoilCropAdvisoryBtn: "माती परीक्षण व पीक सल्ला मिळवा",
    predictHarvestYieldBtn: "पीक उत्पादन अंदाज काढा",
    availableReportsCatalog: "उपलब्ध पीडीएफ अहवाल सूची",
    selectReportTypeSub: "आपल्या गरजेनुसार योग्य अहवाल निवडून खालील बटनावर क्लिक करून पीडीएफ डाऊनलोड करा.",
    yieldReportItemTitle: "पीक उत्पादकता आणि उत्पादन अंदाज अहवाल",
    yieldReportItemDesc: "आपले उत्पादन अंदाज, जिल्हावार हवामान, पाऊस व तापमानाचा सविस्तर विश्लेषणात्मक पीडीएफ अहवाल.",
    yieldReportItemType: "उत्पादन विश्लेषण",
    recReportItemTitle: "माती परीक्षण आणि पीक शिफारस अहवाल",
    recReportItemDesc: "मातीतील N-P-K अन्नद्रव्ये, सामू आणि हवामानानुसार योग्य पिकांची शिफारस करणारा अधिकृत कृषी सल्ला.",
    recReportItemType: "पीक सल्ला",
    masterReportItemTitle: "सर्वसमावेशक शेतकरी कृषी सल्ला अहवाल (मास्टर अहवाल)",
    masterReportItemDesc: "पीक उत्पादन अंदाज, माती परीक्षण शिफारस आणि मॉडेल विश्लेषणाचा एकत्रित संपूर्ण कृषी अहवाल.",
    masterReportItemType: "सर्वसमावेशक",
    recordCountSingular: "नोंद",
    recordCountPlural: "नोंदी",
    downloadPdfBtn: "पीडीएफ डाऊनलोड करा",
    officialFarmRecordsTitle: "अधिकृत शेती नोंदी आणि कृषी सल्ला दस्तऐवज",
    officialFarmRecordsDesc: "कृषीमित्र पीडीएफ अहवाल शेती कर्ज/क्रेडिट अर्ज, पीक विमा पडताळणी किंवा स्थानिक कृषी विज्ञान केंद्र (KVK) तज्ज्ञांशी सल्लामसलत करण्यासाठी प्रमाणित स्वरूपात तयार केलेले आहेत.",
    reportGeneratedSuccess: "पीडीएफ यशस्वीरित्या तयार झाली आहे!",

    // Profile Page Localization
    profilePageHeading: "शेतकरी प्रोफाईल आणि शेती नोंदी",
    profilePageSub: "आपली वैयक्तिक माहिती, संपर्क क्रमांक, शेतजमीन वैशिष्ट्ये आणि सुरक्षा व्यवस्थापित करा.",
    personalAndFarmInfo: "वैयक्तिक आणि शेती माहिती",
    securityAndPassword: "सुरक्षा आणि पासवर्ड",
    notificationAlerts: "सूचना आणि अलर्ट",
    farmerAgriDetails: "शेतकरी आणि कृषी तपशील",
    farmerAgriDetailsSub: "फोन नंबर, जिल्हा, मातीचा प्रकार आणि सिंचन पद्धती अपडेट करा.",
    editProfileDetails: "प्रोफाईल संपादित करा",
    contactAndIdentity: "१. संपर्क आणि ओळख",
    farmerFullName: "शेतकऱ्याचे संपूर्ण नाव *",
    phoneMobile: "फोन / व्हॉट्सॲप मोबाइल *",
    pmKisanIdLabel: "KCC / पीएम-किसान आयडी (ऐच्छिक)",
    pmKisanIdPlaceholder: "उपलब्ध असल्यास पीएम-किसान / केसीसी आयडी भरा",
    farmlandProfileHeading: "२. शेतजमीन आणि पीक प्रोफाईल",
    districtMaharashtra: "जिल्हा (महाराष्ट्र)",
    totalCultivatedLandArea: "एकूण वहितीखालील शेतजमीन क्षेत्र",
    primarySoilClass: "जमिनीचा / मातीचा मुख्य प्रकार",
    selectSoilType: "मातीचा प्रकार निवडा...",
    irrigationWaterSource: "सिंचन आणि पाण्याचा स्रोत",
    selectIrrigationSource: "पाण्याचा स्रोत निवडा...",
    primaryCropsLabel: "नेहमी पिकवली जाणारी प्रमुख पिके",
    primaryCropsPlaceholder: "उदा. कापूस, सोयाबीन, गहू, भात, ऊस",
    fieldNotesLabel: "शेती नोंदी आणि पीक पद्धती",
    fieldNotesPlaceholder: "शेताचे स्थान, मातीचा इतिहास, सेंद्रिय शेती नोंदी लिहा...",
    saveFarmProfile: "शेती प्रोफाईल जतन करा",
    accountSecurityHeading: "खाते सुरक्षा आणि पासवर्ड",
    accountSecuritySub: "लॉगिन तपशील व्यवस्थापित करा आणि आपली शेती माहिती सुरक्षित ठेवा.",
    currentPassword: "सध्याचा पासवर्ड",
    newPassword: "नवीन पासवर्ड",
    confirmNewPassword: "नवीन पासवर्डची खात्री करा",
    enterCurrentPasswordPlaceholder: "सध्याचा पासवर्ड टाका",
    min6CharsPlaceholder: "किमान ६ अक्षरे",
    reenterNewPasswordPlaceholder: "नवीन पासवर्ड पुन्हा टाका",
    updatePassword: "पासवर्ड बदला",
    notifAlertsHeading: "सूचना व शेती सल्ला प्राधान्ये",
    notifAlertsSub: "पीक उत्पादन अंदाज आणि हवामानाशी संबंधित कोणत्या सूचना हव्या आहेत ते निवडा.",
    notifYieldTitle: "पीक उत्पादन आणि अंदाज सूचना",
    notifYieldDesc: "नवीन पीक उत्पादन अंदाज तयार झाल्यावर माहिती मिळवा.",
    notifWeatherTitle: "थेट अतिवृष्टी व हवामान अलर्ट",
    notifWeatherDesc: "अतिवृष्टी, सोसाट्याचा वारा किंवा तापमान बदलाच्या तातडीच्या सूचना.",
    notifCropRecTitle: "हंगामी पीक आणि खत शिफारस",
    notifCropRecDesc: "खरीप आणि रब्बी हंगामासाठी आपल्या जमिनीनुसार पीक सल्ला सूचना.",
    notifSmsTitle: "मोबाईलवर किसान SMS अलर्ट",
    notifSmsDesc: "तातडीचा आणि महत्त्वाचा शेती सल्ला थेट आपल्या नोंदणीकृत मोबाईलवर मिळवा.",
    liveFarmStats: "थेट शेती आकडेवारी",
    yieldPredictionsLabel: "उत्पादन अंदाज:",
    cropRecommendationsLabel: "पीक शिफारसी:",
    cropsUnit: "पिके",
    profileSavedSuccess: "प्रोफाईल आणि शेती तपशील यशस्वीरित्या जतन केले!",
    passwordUpdatedSuccess: "पासवर्ड यशस्वीरित्या बदलला आहे!",
    fillPasswordFields: "कृपया पासवर्डचे सर्व रकाने भरा.",
    passwordMinLength: "नवीन पासवर्ड किमान ६ अक्षरांचा असावा.",
    passwordsDoNotMatch: "दोन्ही पासवर्ड जुळत नाहीत.",
  },
};

const sanitizeUserData = (u) => {
  if (!u || typeof u !== "object") return u;
  const clone = { ...u };
  if (typeof clone.kisan_id === "string" && (clone.kisan_id.startsWith("PMK-MH-2026") || clone.kisan_id.startsWith("ADM-MH-2026"))) {
    clone.kisan_id = "";
  }
  if (typeof clone.kisanId === "string" && (clone.kisanId.startsWith("PMK-MH-2026") || clone.kisanId.startsWith("ADM-MH-2026"))) {
    clone.kisanId = "";
  }
  return clone;
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("krushimitra_user");
    if (!savedUser) {
      return null;
    }

    try {
      return sanitizeUserData(JSON.parse(savedUser));
    } catch {
      return null;
    }
  });

  const [language, setLanguage] = useState(() => {
    return (
      localStorage.getItem(
        "krushimitra_language"
      ) || "en"
    );
  });

  // User-Scoped Prediction and Recommendation Storage Keys
  const getUserHistoryStorageKey = (prefix, currentUser) => {
    const email = currentUser?.email ? currentUser.email.toLowerCase().trim() : "guest";
    return `${prefix}_${email}`;
  };

  const loadUserPredictionHistory = (currentUser) => {
    const key = getUserHistoryStorageKey("krushimitra_prediction_history", currentUser);
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }

    // Seed sample records ONLY for the default demo farmer Ramesh Patil / farmer@krushimitra.ai
    if (
      currentUser?.email &&
      (currentUser.email.toLowerCase() === "ramesh.patil@krushimitra.in" ||
        currentUser.email.toLowerCase() === "farmer@krushimitra.ai")
    ) {
      const demoSeed = [
        {
          id: "pred-demo-1",
          user_email: currentUser.email.toLowerCase(),
          user_name: currentUser.name || "Ramesh Patil",
          crop: "Soybean",
          district: "Pune",
          season: "Kharif",
          year: 2026,
          area: 5.0,
          rainfall: 820,
          temperature: 28.5,
          productivity: 3.42,
          production: 17.1,
          confidence: 98.4,
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
        {
          id: "pred-demo-2",
          user_email: currentUser.email.toLowerCase(),
          user_name: currentUser.name || "Ramesh Patil",
          crop: "Cotton",
          district: "Pune",
          season: "Kharif",
          year: 2025,
          area: 4.5,
          rainfall: 750,
          temperature: 30.2,
          productivity: 2.88,
          production: 12.96,
          confidence: 96.1,
          createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        },
      ];
      localStorage.setItem(key, JSON.stringify(demoSeed));
      return demoSeed;
    }

    return [];
  };

  const loadUserRecommendationHistory = (currentUser) => {
    const key = getUserHistoryStorageKey("krushimitra_recommendation_history", currentUser);
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }

    if (
      currentUser?.email &&
      (currentUser.email.toLowerCase() === "ramesh.patil@krushimitra.in" ||
        currentUser.email.toLowerCase() === "farmer@krushimitra.ai")
    ) {
      const demoRecSeed = [
        {
          id: "rec-demo-1",
          user_email: currentUser.email.toLowerCase(),
          user_name: currentUser.name || "Ramesh Patil",
          crop: "Cotton",
          confidence: 95.2,
          nitrogen: 90,
          phosphorus: 42,
          potassium: 43,
          temperature: 27.5,
          humidity: 75,
          ph: 6.5,
          rainfall: 800,
          createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
        },
      ];
      localStorage.setItem(key, JSON.stringify(demoRecSeed));
      return demoRecSeed;
    }

    return [];
  };

  const [predictionHistory, setPredictionHistory] = useState(() =>
    loadUserPredictionHistory(user)
  );

  const [recommendationHistory, setRecommendationHistory] = useState(() =>
    loadUserRecommendationHistory(user)
  );

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("krushimitra_theme") || "light";
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem("krushimitra_font") || "medium";
  });

  const [supportTickets, setSupportTickets] = useState(() => {
    const saved = localStorage.getItem("krushimitra_support_tickets");
    return saved ? JSON.parse(saved) : [];
  });

  // User Directory for Admin RBAC
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem("krushimitra_users_db");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    const initialUsers = [
      {
        id: "usr-admin-01",
        name: "KrushiMitra Administrator",
        email: "admin@krushimitra.in",
        password: "adminpassword",
        role: "Admin",
        district: "Pune",
        phone: "+91 98000 00001",
        joinedDate: "January 2026",
        status: "Active",
        totalPredictions: 42,
      },
      {
        id: "usr-farmer-01",
        name: "Ramesh Patil",
        email: "ramesh.patil@krushimitra.in",
        password: "password123",
        role: "Farmer",
        district: "Pune",
        farmSize: "5.0 Acres",
        phone: "+91 98230 45678",
        joinedDate: "February 2026",
        status: "Active",
        totalPredictions: 14,
      },
      {
        id: "usr-farmer-02",
        name: "Suresh Deshmukh",
        email: "suresh.deshmukh@krushimitra.in",
        password: "password123",
        role: "Farmer",
        district: "Nagpur",
        farmSize: "12.5 Acres",
        phone: "+91 94221 88901",
        joinedDate: "March 2026",
        status: "Active",
        totalPredictions: 9,
      },
      {
        id: "usr-farmer-03",
        name: "Priya Shinde",
        email: "priya.shinde@krushimitra.in",
        password: "password123",
        role: "Farmer",
        district: "Nashik",
        farmSize: "8.0 Acres",
        phone: "+91 98902 33412",
        joinedDate: "May 2026",
        status: "Active",
        totalPredictions: 21,
      },
      {
        id: "usr-farmer-04",
        name: "Anil Jadhav",
        email: "anil.jadhav@krushimitra.in",
        password: "password123",
        role: "Farmer",
        district: "Amravati",
        farmSize: "3.5 Acres",
        phone: "+91 97654 11223",
        joinedDate: "June 2026",
        status: "Active",
        totalPredictions: 6,
      },
    ];
    localStorage.setItem("krushimitra_users_db", JSON.stringify(initialUsers));
    return initialUsers;
  });

  // User Notifications Engine (Clean & Real Events Only)
  const getInitialNotifications = (currentUser) => {
    const userKey = currentUser?.email
      ? `krushimitra_notifications_${currentUser.email.toLowerCase()}`
      : "krushimitra_notifications_guest";

    const saved = localStorage.getItem(userKey);
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }

    // New users start with 0 notifications (no fake/unnecessary notifications)
    return [];
  };

  const [notifications, setNotifications] = useState(() => getInitialNotifications(user));

  // Sync user notifications when logged in user changes
  useEffect(() => {
    const userKey = user?.email
      ? `krushimitra_notifications_${user.email.toLowerCase()}`
      : "krushimitra_notifications_guest";

    const saved = localStorage.getItem(userKey);
    if (saved !== null) {
      try {
        setNotifications(JSON.parse(saved));
        return;
      } catch {}
    }

    const initialNotifs = getInitialNotifications(user);
    setNotifications(initialNotifs);
    localStorage.setItem(userKey, JSON.stringify(initialNotifs));
  }, [user?.email]);

  // Sync user-scoped prediction & recommendation history when logged-in user changes
  useEffect(() => {
    const userPreds = loadUserPredictionHistory(user);
    const userRecs = loadUserRecommendationHistory(user);
    setPredictionHistory(userPreds);
    setRecommendationHistory(userRecs);

    if (user?.email) {
      const emailParam = encodeURIComponent(user.email.toLowerCase().trim());
      // Sync Predictions from DB
      fetch(buildApiUrl(`/history/predictions?email=${emailParam}`))
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.records) && data.records.length > 0) {
            const formatted = data.records.map((r) => ({
              id: r.id,
              user_email: r.user_email,
              crop: r.crop,
              district: r.district,
              season: r.season,
              year: r.crop_year,
              area: r.area,
              rainfall: r.rainfall,
              temperature: r.temperature,
              productivity: r.productivity,
              production: r.production,
              createdAt: r.created_at || new Date().toISOString(),
            }));
            setPredictionHistory(formatted);
            localStorage.setItem(
              getUserHistoryStorageKey("krushimitra_prediction_history", user),
              JSON.stringify(formatted)
            );
          }
        })
        .catch(() => {});

      // Sync Recommendations from DB
      fetch(buildApiUrl(`/history/recommendations?email=${emailParam}`))
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.records) && data.records.length > 0) {
            const formatted = data.records.map((r) => ({
              id: r.id,
              user_email: r.user_email,
              crop: r.crop,
              confidence: r.confidence,
              nitrogen: r.n_val,
              phosphorus: r.p_val,
              potassium: r.k_val,
              temperature: r.temperature,
              humidity: r.humidity,
              ph: r.ph,
              rainfall: r.rainfall,
              createdAt: r.created_at || new Date().toISOString(),
            }));
            setRecommendationHistory(formatted);
            localStorage.setItem(
              getUserHistoryStorageKey("krushimitra_recommendation_history", user),
              JSON.stringify(formatted)
            );
          }
        })
        .catch(() => {});

      // Sync User Queries & Feedback from DB
      fetch(`${API_BASE}/support/my-tickets?email=${emailParam}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.tickets)) {
            setSupportTickets(data.tickets);
            localStorage.setItem(
              "krushimitra_support_tickets",
              JSON.stringify(data.tickets)
            );
          }
        })
        .catch(() => {});
    }
  }, [user?.email]);

  const addNotification = (notif) => {
    const userKey = user?.email
      ? `krushimitra_notifications_${user.email.toLowerCase()}`
      : "krushimitra_notifications_guest";

    const newNotif = {
      id: "notif-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
      time: "Just now",
      unread: true,
      ...notif,
    };

    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      localStorage.setItem(userKey, JSON.stringify(updated));
      return updated;
    });
  };

  const markAllNotificationsAsRead = () => {
    const userKey = user?.email
      ? `krushimitra_notifications_${user.email.toLowerCase()}`
      : "krushimitra_notifications_guest";

    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, unread: false }));
      localStorage.setItem(userKey, JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllNotifications = () => {
    const userKey = user?.email
      ? `krushimitra_notifications_${user.email.toLowerCase()}`
      : "krushimitra_notifications_guest";

    setNotifications([]);
    localStorage.setItem(userKey, JSON.stringify([]));
  };

  const API_BASE = API_BASE_URL;

  // Real Database Login
  const apiLogin = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return { success: false, message: data.message || "Invalid email or password" };
      }
      login(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      console.warn("Backend API offline, using local verification:", err);
      // Fallback to local DB
      const found = usersList.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        login(found);
        return { success: true, user: found };
      }
      return { success: false, message: "Database server connection error." };
    }
  };

  // Real Database Register
  const apiRegister = async (registrationData) => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return { success: false, message: data.message || "Registration failed" };
      }
      login(data.user);
      registerUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      console.warn("Backend API offline, registering locally:", err);
      const userObj = registerUser(registrationData);
      login(userObj);
      return { success: true, user: userObj };
    }
  };

  // Google OAuth 2.0 Sign-In & Onboarding
  const apiGoogleAuth = async (credential) => {
    try {
      const response = await fetch(`${API_BASE}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return { success: false, message: data.message || "Google authentication failed" };
      }
      login(data.user);
      registerUser(data.user);
      return { success: true, user: data.user, isNewUser: data.isNewUser };
    } catch (err) {
      console.warn("Backend Google Auth error:", err);
      return { success: false, message: "Server connection failed during Google Sign-In" };
    }
  };

  // Real Database Profile Update
  const apiUpdateProfile = async (profileData) => {
    try {
      const response = await fetch(`${API_BASE}/user/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        login(data.user);
        return { success: true, user: data.user };
      }
    } catch (err) {
      console.warn("Backend API offline, updating local profile:", err);
    }
    const updated = { ...user, ...profileData };
    login(updated);
    return { success: true, user: updated };
  };

  // Real Database Password Change
  const apiChangePassword = async (email, currentPassword, newPassword) => {
    try {
      const response = await fetch(`${API_BASE}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, currentPassword, newPassword }),
      });
      const data = await response.json();
      return data;
    } catch (err) {
      return { success: false, message: "Database connection failed" };
    }
  };

  // Real Database Forgot Password Request
  const apiForgotPassword = async (email) => {
    try {
      const response = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      return data;
    } catch (err) {
      return { success: false, message: "Server connection failed" };
    }
  };

  // Real Database Verify Password Reset Token
  const apiVerifyResetToken = async (token) => {
    try {
      const response = await fetch(`${API_BASE}/auth/verify-reset-token?token=${encodeURIComponent(token)}`);
      const data = await response.json();
      return data;
    } catch (err) {
      return { valid: false, message: "Server connection failed" };
    }
  };

  // Real Database Reset Password with Token
  const apiResetPassword = async (token, newPassword) => {
    try {
      const response = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await response.json();
      return data;
    } catch (err) {
      return { success: false, message: "Server connection failed" };
    }
  };

  // Real Database Admin Users Fetch
  const apiFetchAdminUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/users`);
      const data = await response.json();
      if (response.ok && data.success && Array.isArray(data.users)) {
        setUsersList(data.users);
        localStorage.setItem("krushimitra_users_db", JSON.stringify(data.users));
        return data.users;
      }
    } catch (err) {
      console.warn("Backend API offline, using cached users:", err);
    }
    return usersList;
  };

  // Real Database Admin User Role Update
  const apiUpdateUserRole = async (userId, newRole) => {
    try {
      await fetch(`${API_BASE}/admin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
    } catch (err) {
      console.warn("Backend API offline for role update:", err);
    }
    updateUserRole(userId, newRole);
  };

  // Real Database Admin User Delete
  const apiDeleteUser = async (userId) => {
    try {
      await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Backend API offline for user delete:", err);
    }
    deleteUser(userId);
  };

  // Real Database Admin Stats Fetch
  const apiFetchAdminStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/stats`);
      const data = await response.json();
      if (response.ok && data.success) {
        return data.stats;
      }
    } catch (err) {
      console.warn("Backend API offline for stats:", err);
    }
    return null;
  };

  // Admin: Create User
  const apiCreateAdminUser = async (userData) => {
    try {
      const response = await fetch(`${API_BASE}/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        await apiFetchAdminUsers();
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || "Failed to create user" };
    } catch (err) {
      return { success: false, message: "Backend offline" };
    }
  };

  // Admin: Fetch Tickets
  const apiFetchAdminTickets = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/tickets`);
      const data = await response.json();
      if (response.ok && data.success && Array.isArray(data.tickets)) {
        return data.tickets;
      }
    } catch (err) {
      console.warn("Backend API offline for tickets:", err);
    }
    return [];
  };

  // Admin: Update Ticket Status
  const apiUpdateTicketStatus = async (ticketId, status) => {
    try {
      const response = await fetch(`${API_BASE}/admin/tickets/${ticketId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      return { success: response.ok && data.success };
    } catch (err) {
      return { success: false };
    }
  };

  // Admin: Update User Full Details
  const apiAdminUpdateUser = async (userId, userData) => {
    try {
      const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        await apiFetchAdminUsers();
        return { success: true, message: data.message, user: data.user };
      }
      return { success: false, message: data.message || "Failed to update user" };
    } catch (err) {
      return { success: false, message: "Backend offline" };
    }
  };

  // Admin: Reply to Support Ticket
  const apiAdminReplyTicket = async (ticketId, reply, status = "Resolved") => {
    try {
      const response = await fetch(`${API_BASE}/admin/tickets/${ticketId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply, status }),
      });
      const data = await response.json();
      return { success: response.ok && data.success, message: data.message };
    } catch (err) {
      return { success: false, message: "Backend offline" };
    }
  };

  // Admin: Delete Support Ticket
  const apiAdminDeleteTicket = async (ticketId) => {
    try {
      const response = await fetch(`${API_BASE}/admin/tickets/${ticketId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      return { success: response.ok && data.success };
    } catch (err) {
      return { success: false };
    }
  };

  // Admin: Purge Old Sample Tickets
  const apiAdminPurgeSampleTickets = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/tickets/purge-sample`, {
        method: "POST",
      });
      const data = await response.json();
      return { success: response.ok && data.success, message: data.message };
    } catch (err) {
      return { success: false, message: "Backend offline" };
    }
  };

  // Admin: Export DB Data
  const apiExportDatabase = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/export`);
      const data = await response.json();
      if (response.ok && data.success) {
        return data.data;
      }
    } catch (err) {
      console.warn("Export failed:", err);
    }
    return null;
  };

  // Admin: Optimize DB
  const apiOptimizeDatabase = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/optimize`, { method: "POST" });
      const data = await response.json();
      return data;
    } catch (err) {
      return { success: false, message: "Optimization server unreachable" };
    }
  };

  const registerUser = (newUser) => {
    const userObj = {
      id: "usr-" + Date.now().toString().slice(-6),
      name: newUser.name,
      email: newUser.email,
      password: newUser.password || "password123",
      role: newUser.role || "Farmer",
      district: newUser.district || "Pune",
      phone: newUser.phone || "+91 98000 00000",
      farmSize: newUser.farmSize || "4.0 Acres",
      joinedDate: new Date().toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      }),
      status: "Active",
      totalPredictions: 0,
    };

    setUsersList((prev) => {
      const updated = [userObj, ...prev.filter((u) => u.email !== newUser.email)];
      localStorage.setItem("krushimitra_users_db", JSON.stringify(updated));
      return updated;
    });

    return userObj;
  };

  const updateUserRole = (userId, newRole) => {
    setUsersList((prev) => {
      const updated = prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
      localStorage.setItem("krushimitra_users_db", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteUser = (userId) => {
    setUsersList((prev) => {
      const updated = prev.filter((u) => u.id !== userId);
      localStorage.setItem("krushimitra_users_db", JSON.stringify(updated));
      return updated;
    });
  };

  // Apply Theme & Font Size to Document Root
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (currentTheme) => {
      let isDark = false;
      if (currentTheme === "dark") {
        isDark = true;
      } else if (currentTheme === "auto") {
        isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }

      if (isDark) {
        root.classList.add("dark");
        root.setAttribute("data-theme", "dark");
      } else {
        root.classList.remove("dark");
        root.setAttribute("data-theme", "light");
      }
    };

    applyTheme(theme);

    // Font size scaling
    root.setAttribute("data-font", fontSize);
    if (fontSize === "small") {
      root.style.fontSize = "14px";
    } else if (fontSize === "large") {
      root.style.fontSize = "16.5px";
    } else {
      root.style.fontSize = "15px";
    }
  }, [theme, fontSize]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("krushimitra_theme", newTheme);
  };

  const changeFontSize = (newSize) => {
    setFontSize(newSize);
    localStorage.setItem("krushimitra_font", newSize);
  };

  const resetFarmData = () => {
    setPredictionHistory([]);
    setRecommendationHistory([]);
    localStorage.removeItem(getUserHistoryStorageKey("krushimitra_prediction_history", user));
    localStorage.removeItem(getUserHistoryStorageKey("krushimitra_recommendation_history", user));
  };

  const submitSupportTicket = async (ticket) => {
    const genId = ticket.id || ticket.ticket_id || ("TICK-" + Date.now().toString().slice(-6));
    const optimisticTicket = {
      id: genId,
      ticket_id: genId,
      ...ticket,
      user_email: ticket.user_email || user?.email || "farmer@krushimitra.in",
      name: ticket.name || user?.name || "Farmer",
      district: ticket.district || user?.district || "Maharashtra",
      status: "Submitted",
      rating: Number(ticket.rating) || 5,
      created_at: new Date().toLocaleString(),
    };

    setSupportTickets((prev) => {
      const updated = [optimisticTicket, ...prev.filter((t) => (t.ticket_id || t.id) !== genId)];
      localStorage.setItem(
        "krushimitra_support_tickets",
        JSON.stringify(updated)
      );
      return updated;
    });

    // Also persist directly into backend DB
    try {
      const response = await fetch(`${API_BASE}/support/ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticket_id: optimisticTicket.ticket_id,
          user_email: optimisticTicket.user_email,
          name: optimisticTicket.name,
          district: optimisticTicket.district,
          category: optimisticTicket.category || "General Inquiry",
          subject: optimisticTicket.subject || "Farmer Query",
          message: optimisticTicket.message || "",
          rating: Number(optimisticTicket.rating) || 5,
          status: "Submitted",
        }),
      });
      const data = await response.json();
      if (data.ticket) {
        setSupportTickets((prev) => {
          const updated = [data.ticket, ...prev.filter((t) => (t.ticket_id || t.id) !== genId)];
          localStorage.setItem(
            "krushimitra_support_tickets",
            JSON.stringify(updated)
          );
          return updated;
        });
        return data.ticket;
      }
      return optimisticTicket;
    } catch (err) {
      console.warn("Backend ticket sync fallback:", err);
      return optimisticTicket;
    }
  };

  const fetchMyTickets = async () => {
    if (!user?.email) return [];
    try {
      const response = await fetch(
        `${API_BASE}/support/my-tickets?email=${encodeURIComponent(user.email.toLowerCase().trim())}`
      );
      const data = await response.json();
      if (response.ok && data.success && Array.isArray(data.tickets)) {
        setSupportTickets(data.tickets);
        localStorage.setItem(
          "krushimitra_support_tickets",
          JSON.stringify(data.tickets)
        );
        return data.tickets;
      }
    } catch (err) {
      console.warn("Backend ticket sync fallback:", err);
    }
    return supportTickets;
  };

  const login = (userData) => {
    const sanitized = sanitizeUserData(userData);
    setUser(sanitized);

    localStorage.setItem(
      "krushimitra_user",
      JSON.stringify(sanitized)
    );
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem(
      "krushimitra_user"
    );
  };

  const changeLanguage = (newLanguage) => {
    const validLanguages = [
      "en",
      "hi",
      "mr",
    ];

    const selectedLanguage =
      validLanguages.includes(newLanguage)
        ? newLanguage
        : "en";

    setLanguage(selectedLanguage);

    localStorage.setItem(
      "krushimitra_language",
      selectedLanguage
    );
  };

  const addPrediction = (prediction) => {
    const userEmail = user?.email ? user.email.toLowerCase().trim() : "guest";
    const userName = user?.name || "Farmer";
    const newPrediction = {
      id: "pred-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
      user_email: userEmail,
      user_name: userName,
      ...prediction,
      createdAt: new Date().toISOString(),
    };

    setPredictionHistory((previous) => {
      const updatedHistory = [
        newPrediction,
        ...previous,
      ];

      localStorage.setItem(
        getUserHistoryStorageKey("krushimitra_prediction_history", user),
        JSON.stringify(updatedHistory)
      );

      return updatedHistory;
    });

    // Sync to SQLite Backend DB
    fetch(`${API_BASE}/history/predictions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_email: userEmail,
        crop: prediction.crop,
        district: prediction.district,
        season: prediction.season,
        area: Number(prediction.area || 0),
        rainfall: Number(prediction.rainfall || 0),
        temperature: Number(prediction.temperature || 0),
        crop_year: Number(prediction.year || 2026),
        productivity: Number(prediction.productivity || 0),
        production: Number(
          prediction.production ||
            Number(prediction.productivity || 0) * Number(prediction.area || 1)
        ),
      }),
    }).catch(() => {});

    addNotification({
      title: `${prediction.crop || "Crop"} Yield Forecast Ready`,
      desc: `Estimated yield: ${prediction.productivity || "—"} t/ha for ${prediction.district || "your farm"} (${prediction.season || "Season"}).`,
      type: "prediction",
      crop: prediction.crop,
      productivity: prediction.productivity,
      district: prediction.district,
      season: prediction.season,
    });
  };

  const deletePrediction = (id) => {
    setPredictionHistory((previous) => {
      const updatedHistory =
        previous.filter(
          (item) => item.id !== id
        );

      localStorage.setItem(
        getUserHistoryStorageKey("krushimitra_prediction_history", user),
        JSON.stringify(updatedHistory)
      );

      return updatedHistory;
    });
  };

  const addRecommendation = (recommendation) => {
    const userEmail = user?.email ? user.email.toLowerCase().trim() : "guest";
    const userName = user?.name || "Farmer";
    const newRecommendation = {
      id: "rec-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
      user_email: userEmail,
      user_name: userName,
      ...recommendation,
      createdAt: new Date().toISOString(),
    };

    setRecommendationHistory((previous) => {
      const updatedHistory = [
        newRecommendation,
        ...previous,
      ];

      localStorage.setItem(
        getUserHistoryStorageKey("krushimitra_recommendation_history", user),
        JSON.stringify(updatedHistory)
      );

      return updatedHistory;
    });

    // Sync to SQLite Backend DB
    fetch(`${API_BASE}/history/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_email: userEmail,
        crop: recommendation.crop,
        confidence: Number(recommendation.confidence || 95.2),
        n_val: Number(recommendation.nitrogen || 0),
        p_val: Number(recommendation.phosphorus || 0),
        k_val: Number(recommendation.potassium || 0),
        temperature: Number(recommendation.temperature || 0),
        humidity: Number(recommendation.humidity || 0),
        ph: Number(recommendation.ph || 0),
        rainfall: Number(recommendation.rainfall || 0),
      }),
    }).catch(() => {});

    addNotification({
      title: `Recommended Crop: ${recommendation.crop || "Crop"}`,
      desc: `High match recommendation for your soil N-P-K nutrient & weather levels.`,
      type: "recommendation",
      crop: recommendation.crop,
    });
  };

  const deleteRecommendation = (id) => {
    setRecommendationHistory((previous) => {
      const updatedHistory =
        previous.filter(
          (item) => item.id !== id
        );

      localStorage.setItem(
        getUserHistoryStorageKey("krushimitra_recommendation_history", user),
        JSON.stringify(updatedHistory)
      );

      return updatedHistory;
    });
  };

  const t = (key) => {
    return (
      translations[language]?.[key] ??
      translations.en?.[key] ??
      key
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,

        theme,
        changeTheme,
        fontSize,
        changeFontSize,

        language,
        setLanguage: changeLanguage,
        changeLanguage,

        predictionHistory,
        addPrediction,
        deletePrediction,

        recommendationHistory,
        addRecommendation,
        deleteRecommendation,

        resetFarmData,
        supportTickets,
        submitSupportTicket,
        fetchMyTickets,

        usersList,
        registerUser,
        updateUserRole,
        deleteUser,

        notifications,
        addNotification,
        markAllNotificationsAsRead,
        clearAllNotifications,

        apiLogin,
        apiRegister,
        apiGoogleAuth,
        apiUpdateProfile,
        apiChangePassword,
        apiForgotPassword,
        apiVerifyResetToken,
        apiResetPassword,
        apiFetchAdminUsers,
        apiUpdateUserRole,
        apiAdminUpdateUser,
        apiDeleteUser,
        apiFetchAdminStats,
        apiCreateAdminUser,
        apiFetchAdminTickets,
        apiUpdateTicketStatus,
        apiAdminReplyTicket,
        apiAdminDeleteTicket,
        apiAdminPurgeSampleTickets,
        apiExportDatabase,
        apiOptimizeDatabase,
        t,
        tCrop: (cropName) => getLocalizedCropName(cropName, language),
        getLocalizedCropName,
        CROP_TRANSLATIONS,
        tDistrict: (districtName) => getLocalizedDistrictName(districtName, language),
        getLocalizedDistrictName,
        DISTRICT_TRANSLATIONS,
        MAHARASHTRA_DISTRICTS,
        tSeason: (seasonName) => getLocalizedSeasonName(seasonName, language),
        getLocalizedSeasonName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp must be used inside AppProvider"
    );
  }

  return context;
}