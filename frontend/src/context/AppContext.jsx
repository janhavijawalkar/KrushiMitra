import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

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
    toggleSidebar: "Toggle sidebar",
    aiAgriculture: "AI AGRICULTURE",

    searchPlaceholder: "Search crops, predictions, reports...",
    notifications: "Notifications",
    farmer: "Farmer",
    language: "Language",

    search: "Search",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    submit: "Submit",
    back: "Back",
    next: "Next",
    close: "Close",
    loading: "Loading...",
    noData: "No data available",
    success: "Success",
    error: "Error",
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
    overview:
      "Use AI-powered predictions and recommendations to make better decisions for your crops.",
    makePrediction: "Make Prediction",
    totalPredictions: "Total Predictions",
    modelAccuracy: "Model Accuracy",
    cropsAnalyzed: "Crops Analyzed",
    estimatedProfit: "Avg. Estimated Profit",
    recentPredictions: "Recent Predictions",
    latestPredictions: "Your latest AI predictions",
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
    getNewRecommendation: "Get new recommendation",
    currentFarmingRegion: "Current Farming Region",
    checkWeather: "Check weather",
    noPredictionsFound: "No predictions found.",

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
      "KrushiMitra uses a trained Random Forest machine-learning model with historical agricultural, crop, rainfall, temperature, area and location data to estimate crop productivity.",
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
    mlRecommendationModel: "ML Recommendation Model",
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
    aiRecommendation: "AI Recommendation",
    aiRecommendationDescription:
      "The ML model identifies the most suitable crop.",
    parameters: "Parameters",
    aiRecommendationComplete:
      "AI Recommendation Complete",
    recommendedCrop: "Recommended Crop",
    recommendationConfidence:
      "Recommendation Confidence",
    recommendationResultDescription:
      "Based on the soil nutrient levels and environmental conditions you provided, this crop has been identified as the most suitable option.",
    modelConfidenceScore: "Model confidence score",
    newRecommendation: "New Recommendation",
    soilNutrients: "Soil Nutrients",
    soilNutrientsDescription:
      "Nitrogen, phosphorus and potassium help determine crop suitability.",
    climateConditions: "Climate Conditions",
    climateConditionsDescription:
      "Temperature, humidity and rainfall influence crop selection.",
    machineLearning: "Machine Learning",
    machineLearningDescription:
      "The trained recommendation model analyzes multiple parameters together.",

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
      "AI model prediction accuracy report",
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
    dontHaveAccount:
      "Don't have an account?",
    register: "Register",
    aiPoweredAgriculture:
      "AI-Powered Agriculture Platform",
    loginRequired:
      "Please enter email and password.",
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
    overview:
      "अपनी फसलों के लिए बेहतर निर्णय लेने हेतु AI आधारित पूर्वानुमान और सिफारिशों का उपयोग करें।",
    makePrediction: "पूर्वानुमान करें",
    totalPredictions: "कुल पूर्वानुमान",
    modelAccuracy: "मॉडल सटीकता",
    cropsAnalyzed: "विश्लेषित फसलें",
    estimatedProfit: "औसत अनुमानित लाभ",
    recentPredictions: "हाल के पूर्वानुमान",
    latestPredictions: "आपके नवीनतम AI पूर्वानुमान",
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
    currentFarmingRegion:
      "वर्तमान कृषि क्षेत्र",
    checkWeather: "मौसम जांचें",
    noPredictionsFound:
      "कोई पूर्वानुमान नहीं मिला।",

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
      "KrushiMitra ऐतिहासिक कृषि, फसल, वर्षा, तापमान, क्षेत्रफल और स्थान संबंधी डेटा के साथ प्रशिक्षित Random Forest मशीन लर्निंग मॉडल का उपयोग करके उत्पादकता का अनुमान लगाता है।",
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
      "ML सिफारिश मॉडल",
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
    aiRecommendation: "AI सिफारिश",
    aiRecommendationDescription:
      "ML मॉडल सबसे उपयुक्त फसल की पहचान करता है।",
    parameters: "पैरामीटर",
    aiRecommendationComplete:
      "AI सिफारिश पूरी हुई",
    recommendedCrop: "अनुशंसित फसल",
    recommendationConfidence:
      "सिफारिश विश्वसनीयता",
    recommendationResultDescription:
      "आपके द्वारा दिए गए मिट्टी के पोषक तत्वों और पर्यावरणीय परिस्थितियों के आधार पर इस फसल को सबसे उपयुक्त पाया गया है।",
    modelConfidenceScore:
      "मॉडल विश्वसनीयता स्कोर",
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
      "मशीन लर्निंग",
    machineLearningDescription:
      "प्रशिक्षित सिफारिश मॉडल कई मापदंडों का एक साथ विश्लेषण करता है।",

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
      "AI मॉडल पूर्वानुमान सटीकता रिपोर्ट",
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
    dontHaveAccount:
      "खाता नहीं है?",
    register: "रजिस्टर",
    aiPoweredAgriculture:
      "AI आधारित कृषि प्लेटफॉर्म",
    loginRequired:
      "कृपया ईमेल और पासवर्ड दर्ज करें।",
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
    overview:
      "आपल्या पिकांसाठी योग्य निर्णय घेण्यासाठी AI आधारित अंदाज आणि शिफारसींचा वापर करा.",
    makePrediction: "अंदाज करा",
    totalPredictions: "एकूण अंदाज",
    modelAccuracy: "मॉडेल अचूकता",
    cropsAnalyzed: "विश्लेषित पिके",
    estimatedProfit: "सरासरी अंदाजित नफा",
    recentPredictions: "अलीकडील अंदाज",
    latestPredictions: "आपले नवीनतम AI अंदाज",
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
    currentFarmingRegion:
      "सध्याचा कृषी प्रदेश",
    checkWeather:
      "हवामान तपासा",
    noPredictionsFound:
      "कोणतेही अंदाज सापडले नाहीत.",

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
      "KrushiMitra ऐतिहासिक कृषी, पीक, पाऊस, तापमान, क्षेत्रफळ आणि स्थानिक डेटासह प्रशिक्षित Random Forest मशीन लर्निंग मॉडेलचा वापर करून उत्पादकतेचा अंदाज घेते.",
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
      "ML पीक शिफारस मॉडेल",
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
      "AI शिफारस",
    aiRecommendationDescription:
      "ML मॉडेल सर्वात योग्य पीक ओळखते.",
    parameters:
      "पॅरामीटर्स",
    aiRecommendationComplete:
      "AI पीक शिफारस पूर्ण झाली",
    recommendedCrop:
      "शिफारस केलेले पीक",
    recommendationConfidence:
      "शिफारस विश्वास पातळी",
    recommendationResultDescription:
      "आपण दिलेल्या मातीतील पोषक घटक आणि पर्यावरणीय परिस्थितींवर आधारित हे पीक सर्वात योग्य असल्याचे आढळले आहे.",
    modelConfidenceScore:
      "मॉडेल विश्वास पातळी",
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
      "मशीन लर्निंग",
    machineLearningDescription:
      "प्रशिक्षित शिफारस मॉडेल अनेक पॅरामीटर्सचे एकत्रित विश्लेषण करते.",

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
    dontHaveAccount:
      "खाते नाही?",
    register:
      "नोंदणी करा",
    aiPoweredAgriculture:
      "AI आधारित कृषी प्लॅटफॉर्म",
    loginRequired:
      "कृपया ईमेल आणि पासवर्ड भरा.",
  },
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(
      "krushimitra_user"
    );

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
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

  const [predictionHistory, setPredictionHistory] =
    useState(() => {
      const savedHistory = localStorage.getItem(
        "krushimitra_prediction_history"
      );

      if (!savedHistory) {
        return [];
      }

      try {
        return JSON.parse(savedHistory);
      } catch {
        return [];
      }
    });

  const [
    recommendationHistory,
    setRecommendationHistory,
  ] = useState(() => {
    const savedHistory = localStorage.getItem(
      "krushimitra_recommendation_history"
    );

    if (!savedHistory) {
      return [];
    }

    try {
      return JSON.parse(savedHistory);
    } catch {
      return [];
    }
  });

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

  // User Notifications Engine (Dynamic Per User)
  const getInitialNotifications = (currentUser) => {
    const userKey = currentUser?.email
      ? `krushimitra_notifications_${currentUser.email.toLowerCase()}`
      : "krushimitra_notifications_guest";

    const saved = localStorage.getItem(userKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }

    if (currentUser?.role === "Admin") {
      return [
        {
          id: "notif-adm-1",
          title: "System Online & SQLite Connected",
          desc: "Backend database is active with registered farmers and live ML telemetry.",
          time: "Just now",
          type: "admin",
          unread: true,
        },
        {
          id: "notif-adm-2",
          title: "ML Inference Engines Ready",
          desc: "Random Forest Classifier (95.2% accuracy) & Regressor operational.",
          time: "10m ago",
          type: "model",
          unread: true,
        },
      ];
    } else if (currentUser) {
      const dist = currentUser.district || "Pune";
      const uName = currentUser.name || "Farmer";
      return [
        {
          id: "notif-farmer-1",
          title: `Welcome, ${uName}!`,
          desc: `Your farm profile is active in ${dist} district (${currentUser.farmSize || "5.0"} ${currentUser.farmUnit || "Acres"}).`,
          time: "Just now",
          type: "welcome",
          unread: true,
        },
        {
          id: "notif-farmer-2",
          title: `${dist} Regional Weather Advisory`,
          desc: `Live weather forecasts updated for ${dist} agricultural belt.`,
          time: "1h ago",
          type: "weather",
          unread: true,
        },
      ];
    } else {
      return [
        {
          id: "notif-guest-1",
          title: "Welcome to KrushiMitra",
          desc: "Explore AI Crop Yield Prediction and Soil Nutrient Recommendations.",
          time: "Just now",
          type: "welcome",
          unread: true,
        },
      ];
    }
  };

  const [notifications, setNotifications] = useState(() => getInitialNotifications(user));

  // Sync user notifications when logged in user changes
  useEffect(() => {
    const userKey = user?.email
      ? `krushimitra_notifications_${user.email.toLowerCase()}`
      : "krushimitra_notifications_guest";

    const saved = localStorage.getItem(userKey);
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
        return;
      } catch {}
    }

    const initialNotifs = getInitialNotifications(user);
    setNotifications(initialNotifs);
    localStorage.setItem(userKey, JSON.stringify(initialNotifs));
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

  const API_BASE = "http://127.0.0.1:5000/api";

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
    localStorage.removeItem("krushimitra_prediction_history");
    localStorage.removeItem("krushimitra_recommendation_history");
  };

  const submitSupportTicket = (ticket) => {
    const newTicket = {
      id: "TICK-" + Date.now().toString().slice(-6),
      ...ticket,
      status: "Submitted",
      createdAt: new Date().toISOString(),
    };

    setSupportTickets((prev) => {
      const updated = [newTicket, ...prev];
      localStorage.setItem(
        "krushimitra_support_tickets",
        JSON.stringify(updated)
      );
      return updated;
    });

    return newTicket;
  };

  const login = (userData) => {
    setUser(userData);

    localStorage.setItem(
      "krushimitra_user",
      JSON.stringify(userData)
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
    const newPrediction = {
      id: Date.now(),
      user_email: user?.email || "guest",
      user_name: user?.name || "Farmer",
      ...prediction,
      createdAt: new Date().toISOString(),
    };

    setPredictionHistory((previous) => {
      const updatedHistory = [
        newPrediction,
        ...previous,
      ];

      localStorage.setItem(
        "krushimitra_prediction_history",
        JSON.stringify(updatedHistory)
      );

      return updatedHistory;
    });

    addNotification({
      title: `${prediction.crop || "Crop"} Yield Forecast Ready`,
      desc: `Estimated yield: ${prediction.productivity || "—"} t/ha for ${prediction.district || "your farm"} (${prediction.season || "Season"}).`,
      type: "prediction",
    });
  };

  const deletePrediction = (id) => {
    setPredictionHistory((previous) => {
      const updatedHistory =
        previous.filter(
          (item) => item.id !== id
        );

      localStorage.setItem(
        "krushimitra_prediction_history",
        JSON.stringify(updatedHistory)
      );

      return updatedHistory;
    });
  };

  const addRecommendation = (recommendation) => {
    const newRecommendation = {
      id: Date.now(),
      user_email: user?.email || "guest",
      user_name: user?.name || "Farmer",
      ...recommendation,
      createdAt: new Date().toISOString(),
    };

    setRecommendationHistory((previous) => {
      const updatedHistory = [
        newRecommendation,
        ...previous,
      ];

      localStorage.setItem(
        "krushimitra_recommendation_history",
        JSON.stringify(updatedHistory)
      );

      return updatedHistory;
    });

    addNotification({
      title: `Recommended Crop: ${recommendation.crop || "Crop"}`,
      desc: `High match recommendation for your soil N-P-K nutrient & weather levels.`,
      type: "recommendation",
    });
  };

  const deleteRecommendation = (id) => {
    setRecommendationHistory((previous) => {
      const updatedHistory =
        previous.filter(
          (item) => item.id !== id
        );

      localStorage.setItem(
        "krushimitra_recommendation_history",
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
        apiUpdateProfile,
        apiChangePassword,
        apiFetchAdminUsers,
        apiUpdateUserRole,
        apiDeleteUser,
        apiFetchAdminStats,

        t,
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