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

export const WEATHER_TRANSLATIONS = {
  // Clear Sky
  clearsky: { en: "Clear Sky", hi: "साफ आसमान", mr: "निरभ्र आकाश" },
  clear: { en: "Clear Sky", hi: "साफ आसमान", mr: "निरभ्र आकाश" },
  sunny: { en: "Sunny Skies", hi: "धूप खिली हुई", mr: "स्वच्छ सूर्यप्रकाश" },

  // Clouds
  fewclouds: { en: "Few Clouds", hi: "कम बादल", mr: "काही प्रमाणात ढगाळ" },
  scatteredclouds: { en: "Scattered Clouds", hi: "बिखरे हुए बादल", mr: "विखुरलेले ढग" },
  brokenclouds: { en: "Partly Cloudy", hi: "आंशिक रूप से बादल", mr: "अंशतः ढगाळ" },
  overcastclouds: { en: "Overcast Clouds", hi: "घने बादल / घटाटोप", mr: "पूर्णपणे ढगाळ आकाश" },
  overcast: { en: "Overcast Clouds", hi: "घने बादल / घटाटोप", mr: "पूर्णपणे ढगाळ आकाश" },
  clouds: { en: "Cloudy", hi: "बादल छाए हुए", mr: "ढगाळ वातावरण" },
  cloudy: { en: "Cloudy", hi: "बादल छाए हुए", mr: "ढगाळ वातावरण" },

  // Rain
  lightrain: { en: "Light Rain", hi: "हल्की बारिश", mr: "हलका पाऊस" },
  moderaterain: { en: "Moderate Rain", hi: "मध्यम बारिश", mr: "मध्यम पाऊस" },
  heavyintensityrain: { en: "Heavy Rain", hi: "भारी बारिश", mr: "मुसळधार पाऊस" },
  heavyrain: { en: "Heavy Rain", hi: "भारी बारिश", mr: "मुसळधार पाऊस" },
  veryheavyrain: { en: "Very Heavy Rain", hi: "अति भारी बारिश", mr: "अति मुसळधार पाऊस" },
  extremerain: { en: "Extreme Rain", hi: "अत्यधिक बारिश", mr: "अतिवृष्टी" },
  freezingrain: { en: "Freezing Rain", hi: "बर्फ़ीली बारिश", mr: "गारपीट / अतिथंड पाऊस" },
  lightintensityshowerrain: { en: "Light Shower Rain", hi: "हल्की बौछारें", mr: "पावसाची हलकी सर" },
  showerrain: { en: "Shower Rain", hi: "बारिश की बौछारें", mr: "पावसाच्या सरी" },
  heavyintensityshowerrain: { en: "Heavy Showers", hi: "तेज बौछारें", mr: "मुसळधार पावसाच्या सरी" },
  raggedshowerrain: { en: "Irregular Showers", hi: "अनियमित बौछारें", mr: "तुटक पावसाच्या सरी" },
  rain: { en: "Rain", hi: "बारिश", mr: "पाऊस" },

  // Drizzle
  lightintensitydrizzle: { en: "Light Drizzle", hi: "हल्की बूंदाबांदी", mr: "हलकी रिमझिम" },
  drizzle: { en: "Drizzle", hi: "बूंदाबांदी / फुहारें", mr: "रिमझिम पाऊस" },
  heavyintensitydrizzle: { en: "Heavy Drizzle", hi: "तेज बूंदाबांदी", mr: "तीव्र रिमझिम पाऊस" },
  drizzlerain: { en: "Drizzle Rain", hi: "रिमझिम बारिश", mr: "रिमझिम पाऊस" },
  showerdrizzle: { en: "Shower Drizzle", hi: "फुहारों के साथ बारिश", mr: "रिमझिम पावसाच्या सरी" },

  // Thunderstorm
  thunderstorm: { en: "Thunderstorm", hi: "गरज के साथ तूफ़ान", mr: "विजांच्या कडकडाटासह वादळ" },
  lightthunderstorm: { en: "Light Thunderstorm", hi: "हल्का तूफ़ान", mr: "हलके वादळ" },
  heavythunderstorm: { en: "Heavy Thunderstorm", hi: "तीव्र तूफ़ान", mr: "तीव्र वादळी पाऊस" },
  raggedthunderstorm: { en: "Ragged Thunderstorm", hi: "अनियमित तूफ़ान", mr: "वादळी वारे" },
  thunderstormwithlightrain: { en: "Thunderstorm with Light Rain", hi: "गरज और हल्की बारिश", mr: "विजा आणि हलका पाऊस" },
  thunderstormwithrain: { en: "Thunderstorm with Rain", hi: "गरज के साथ बारिश", mr: "विजांच्या कडकडाटासह पाऊस" },
  thunderstormwithheavyrain: { en: "Thunderstorm with Heavy Rain", hi: "गरज और भारी बारिश", mr: "विजा आणि मुसळधार पाऊस" },
  thunderstormwithdrizzle: { en: "Thunderstorm with Drizzle", hi: "गरज और बूंदाबांदी", mr: "विजा आणि रिमझिम पाऊस" },

  // Atmospheric phenomena
  mist: { en: "Mist", hi: "धुंध", mr: "धुके" },
  smoke: { en: "Smoke", hi: "धुआं", mr: "धूर" },
  haze: { en: "Haze", hi: "हल्की धुंध", mr: "धुरकट हवा" },
  sanddustwhirls: { en: "Dust Whirls", hi: "धूल भरी आंधी", mr: "धुळीचे चक्रीवादळ" },
  fog: { en: "Fog", hi: "घना कोहरा", mr: "दाट धुके" },
  sand: { en: "Sand", hi: "रेतीली हवा", mr: "वाळूचे वादळ" },
  dust: { en: "Dusty Air", hi: "धूल भरी हवा", mr: "धुळीचे वातावरण" },
  volcanicash: { en: "Volcanic Ash", hi: "राख", mr: "ज्वालामुखीची राख" },
  squalls: { en: "Squalls", hi: "तेज झोंकेदार हवा", mr: "सोसाट्याचा वारा" },
  tornado: { en: "Tornado", hi: "बवंडर / चक्रवात", mr: "चक्रीवादळ" },

  // Snow
  lightsnow: { en: "Light Snow", hi: "हल्की बर्फबारी", mr: "हलका हिमवर्षाव" },
  snow: { en: "Snow", hi: "बर्फबारी", mr: "हिमवर्षाव" },
  heavysnow: { en: "Heavy Snow", hi: "भारी बर्फबारी", mr: "मुसळधार हिमवर्षाव" },
  sleet: { en: "Sleet", hi: "ओलावृष्टि", mr: "गारपीट" },
};

export const getLocalizedWeatherCondition = (condition, lang = "en") => {
  if (!condition) return "";
  const raw = condition.toString().trim();
  const key = raw.toLowerCase().replace(/[\s\-_(),/]/g, "");

  if (WEATHER_TRANSLATIONS[key]) {
    return WEATHER_TRANSLATIONS[key][lang] || WEATHER_TRANSLATIONS[key]["en"] || raw;
  }

  for (const [k, translations] of Object.entries(WEATHER_TRANSLATIONS)) {
    if (key.includes(k) || k.includes(key)) {
      return translations[lang] || translations["en"] || raw;
    }
  }

  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

export const BROADCAST_TRANSLATIONS = {
  "ADV-2026-001": {
    mr: {
      title: "नाशिक व अहमदनगर जिल्ह्यांसाठी अवकाळी वादळ व गारपिटीचा इशारा",
      message: "उत्तर महाराष्ट्रात पुढील ४८ तासांत वादळी वारे (४०-५० किमी/तास) आणि विखुरलेल्या गारपिटीसह अवकाळी पावसाची शक्यता आहे. काढलेला कांदा झाकून ठेवावा आणि द्राक्ष बागांची निचरा व्यवस्था तपासावी.",
      remedy: "काढणी केलेला शेतमाल सुरक्षित गोदामात हलवा; बागेतील अतिरिक्त पाण्याचा निचरा करा.",
      created_by: "जिल्हा कृषी आपत्कालीन कक्ष, नाशिक",
      category: "हवामान इशारा",
    },
    hi: {
      title: "नाशिक व अहमदनगर जिलों के लिए बेमौसम आंधी व ओलावृष्टि चेतावनी",
      message: "उत्तर महाराष्ट्र में आगामी ४८ घंटों में तेज हवाओं (४०-५० किमी/घंटा) और ओलावृष्टि के साथ बेमौसम बारिश की आशंका है। कटे हुए प्याज को सुरक्षित करें और अंगूर के बागों में जल निकासी सुनिश्चित करें।",
      remedy: "कटी हुई फसलों को सुरक्षित गोदामों में रखें; खेतों में जल निकासी की व्यवस्था करें।",
      created_by: "जिला कृषि आपातकालीन प्रकोष्ठ, नाशिक",
      category: "मौसम चेतावनी",
    },
  },
  "ADV-2026-002": {
    mr: {
      title: "खरीप मका आणि ऊस पिकावरील लष्करी अळी (Fall Armyworm) सतर्कता सल्ला",
      message: "पश्चिम महाराष्ट्र व मराठवाडा विभागातील मका व ऊस पिकावर लष्करी अळीचा (Spodoptera frugiperda) प्रादुर्भाव दिसून आला आहे. शेतकऱ्यांनी दर ४-५ दिवसांनी शेताची पाहणी करावी.",
      remedy: "एकर ५ कामगंध सापळे (फेरोमोन ट्रॅप) लावा आणि निंबोळी अर्क (Azadirachtin १५०० ppm) ५ मिली प्रति लिटर पाण्यात मिसळून फवारा.",
      created_by: "कृषी विज्ञान केंद्र (KVK), पुणे",
      category: "कीड व रोग नियंत्रण",
    },
    hi: {
      title: "खरीफ मक्का और गन्ना फसल पर फॉल आर्मीवर्म सतर्कता सलाह",
      message: "पश्चिम महाराष्ट्र और मराठवाड़ा में मक्का व गन्ना फसल पर फॉल आर्मीवर्म (Spodoptera frugiperda) कीट का प्रकोप देखा गया है। किसान प्रत्येक ४-५ दिनों में खेतों का निरीक्षण करें।",
      remedy: "प्रति एकड़ ५ फेरोमोन ट्रैप लगाएं और अज़ाडिराक्टिन १५०० ppm ५ मिली प्रति लीटर पानी में मिलाकर छिड़काव करें।",
      created_by: "कृषि विज्ञान केंद्र (KVK), पुणे",
      category: "कीट व रोग नियंत्रण",
    },
  },
  "ADV-2026-003": {
    mr: {
      title: "राज्यव्यापी रब्बी पेरणी व सूक्ष्म सिंचन (ठिबक/तुषार) ८०% अनुदान नोंदणी सुरू",
      message: "महाराष्ट्र कृषी विभागाने सर्व नोंदणीकृत शेतकऱ्यांसाठी महाडीबीटी / पीएमकेएसवाय (PMKSY) अंतर्गत ८०% ठिबक व तुषार सिंचन अनुदानाची नोंदणी सुरू केली आहे.",
      remedy: "अद्ययावत ७/१२ उतारा आणि बँक पासबुकसह महाडीबीटी (MahaDBT) शेतकरी पोर्टलवर ऑनलाइन अर्ज करा.",
      created_by: "महाराष्ट्र राज्य कृषी विभाग",
      category: "शासकीय योजना",
    },
    hi: {
      title: "राज्यव्यापी रबी बुवाई और सूक्ष्म सिंचाई (ड्रिप/स्प्रिंकलर) ८०% सब्सिडी पोर्टल खुला",
      message: "महाराष्ट्र कृषि विभाग ने सभी पंजीकृत किसानों के लिए महाडीबीटी / PMKSY के तहत ८०% ड्रिप और स्प्रिंकलर सिंचाई सब्सिडी हेतु पंजीकरण शुरू किया है।",
      remedy: "नवीनतम ७/१२ खतौनी और बैंक पासबुक के साथ महाडीबीटी किसान पोर्टल पर ऑनलाइन आवेदन करें।",
      created_by: "महाराष्ट्र राज्य कृषि विभाग",
      category: "सरकारी योजना",
    },
  },
};

const BROADCAST_KEYWORD_RULES = [
  {
    test: (t, m) =>
      (t + " " + m).toLowerCase().includes("armyworm") ||
      (t + " " + m).toLowerCase().includes("लष्करी") ||
      (t + " " + m).toLowerCase().includes("फॉल आर्मी"),
    mr: {
      title: "खरीप मका आणि ऊस पिकावरील लष्करी अळी (Fall Armyworm) सतर्कता सल्ला",
      message: "पश्चिम महाराष्ट्र व मराठवाडा विभागातील मका व ऊस पिकावर लष्करी अळीचा (Spodoptera frugiperda) प्रादुर्भाव दिसून आला आहे. शेतकऱ्यांनी दर ४-५ दिवसांनी शेताची पाहणी करावी.",
      remedy: "एकर ५ कामगंध सापळे (फेरोमोन ट्रॅप) लावा आणि निंबोळी अर्क (Azadirachtin १५०० ppm) ५ मिली प्रति लिटर पाण्यात मिसळून फवारा.",
      created_by: "कृषी विज्ञान केंद्र (KVK), पुणे",
      category: "कीड व रोग नियंत्रण",
    },
    hi: {
      title: "खरीफ मक्का और गन्ना फसल पर फॉल आर्मीवर्म सतर्कता सलाह",
      message: "पश्चिम महाराष्ट्र और मराठवाड़ा में मक्का व गन्ना फसल पर फॉल आर्मीवर्म (Spodoptera frugiperda) कीट का प्रकोप देखा गया है। किसान प्रत्येक ४-५ दिनों में खेतों का निरीक्षण करें।",
      remedy: "प्रति एकड़ ५ फेरोमोन ट्रैप लगाएं और अज़ाडिराक्टिन १५०० ppm ५ मिली प्रति लीटर पानी में मिलाकर छिड़काव करें।",
      created_by: "कृषि विज्ञान केंद्र (KVK), पुणे",
      category: "कीट व रोग नियंत्रण",
    },
  },
  {
    test: (t, m) =>
      (t + " " + m).toLowerCase().includes("subsidy") ||
      (t + " " + m).toLowerCase().includes("micro-irrigation") ||
      (t + " " + m).toLowerCase().includes("ठिबक") ||
      (t + " " + m).toLowerCase().includes("सिंचाई") ||
      (t + " " + m).toLowerCase().includes("अनुदान"),
    mr: {
      title: "राज्यव्यापी रब्बी पेरणी व सूक्ष्म सिंचन (ठिबक/तुषार) ८०% अनुदान नोंदणी सुरू",
      message: "महाराष्ट्र कृषी विभागाने सर्व नोंदणीकृत शेतकऱ्यांसाठी महाडीबीटी / पीएमकेएसवाय (PMKSY) अंतर्गत ८०% ठिबक व तुषार सिंचन अनुदानाची नोंदणी सुरू केली आहे.",
      remedy: "अद्ययावत ७/१२ उतारा आणि बँक पासबुकसह महाडीबीटी (MahaDBT) शेतकरी पोर्टलवर ऑनलाइन अर्ज करा.",
      created_by: "महाराष्ट्र राज्य कृषी विभाग",
      category: "शासकीय योजना",
    },
    hi: {
      title: "राज्यव्यापी रबी बुवाई और सूक्ष्म सिंचाई (ड्रिप/स्प्रिंकलर) ८०% सब्सिडी पोर्टल खुला",
      message: "महाराष्ट्र कृषि विभाग ने सभी पंजीकृत किसानों के लिए महाडीबीटी / PMKSY के तहत ८०% ड्रिप और स्प्रिंकलर सिंचाई सब्सिडी हेतु पंजीकरण शुरू किया है।",
      remedy: "नवीनतम ७/१२ खतौनी और बैंक पासबुक के साथ महाडीबीटी किसान पोर्टल पर ऑनलाइन आवेदन करें।",
      created_by: "महाराष्ट्र राज्य कृषि विभाग",
      category: "सरकारी योजना",
    },
  },
  {
    test: (t, m) =>
      (t + " " + m).toLowerCase().includes("hailstorm") ||
      (t + " " + m).toLowerCase().includes("thunderstorm") ||
      (t + " " + m).toLowerCase().includes("गारपीट") ||
      (t + " " + m).toLowerCase().includes("ओलावृष्टि") ||
      (t + " " + m).toLowerCase().includes("अवकाळी"),
    mr: {
      title: "नाशिक व अहमदनगर जिल्ह्यांसाठी अवकाळी वादळ व गारपिटीचा इशारा",
      message: "उत्तर महाराष्ट्रात पुढील ४८ तासांत वादळी वारे (४०-५० किमी/तास) आणि विखुरलेल्या गारपिटीसह अवकाळी पावसाची शक्यता आहे. काढलेला कांदा झाकून ठेवावा आणि द्राक्ष बागांची निचरा व्यवस्था तपासावी.",
      remedy: "काढणी केलेला शेतमाल सुरक्षित गोदामात हलवा; बागेतील अतिरिक्त पाण्याचा निचरा करा.",
      created_by: "जिल्हा कृषी आपत्कालीन कक्ष, नाशिक",
      category: "हवामान इशारा",
    },
    hi: {
      title: "नाशिक व अहमदनगर जिलों के लिए बेमौसम आंधी व ओलावृष्टि चेतावनी",
      message: "उत्तर महाराष्ट्र में आगामी ४८ घंटों में तेज हवाओं (४०-५० किमी/घंटा) और ओलावृष्टि के साथ बेमौसम बारिश की आशंका है। कटे हुए प्याज को सुरक्षित करें और अंगूर के बागों में जल निकासी सुनिश्चित करें।",
      remedy: "कटी हुई फसलों को सुरक्षित गोदामों में रखें; खेतों में जल निकासी की व्यवस्था करें।",
      created_by: "जिला कृषि आपातकालीन प्रकोष्ठ, नाशिक",
      category: "मौसम चेतावनी",
    },
  },
  {
    test: (t, m) =>
      (t + " " + m).toLowerCase().includes("pink bollworm") ||
      (t + " " + m).toLowerCase().includes("बोंड अळी") ||
      (t + " " + m).toLowerCase().includes("गुलाबी सुंडी"),
    mr: {
      title: "कापूस पिकावरील गुलाबी बोंड अळी नियंत्रण सतर्कता सल्ला",
      message: "विदर्भ आणि खान्देश पट्ट्यात कापूस पिकावर बोंड अळीचा प्रादुर्भाव वाढण्याची शक्यता आहे. नियमित कामगंध सापळे तपासावेत.",
      remedy: "५% निंबोळी अर्क किंवा प्रोफेनोफॉस ५०% ईसी ३० मिली प्रति पंप फवारा.",
      created_by: "कापूस संशोधन केंद्र",
      category: "कीड व रोग नियंत्रण",
    },
    hi: {
      title: "कपास फसल में गुलाबी सुंडी रोकथाम सतर्कता सलाह",
      message: "विदर्भ और खानदेश क्षेत्र में कपास पर गुलाबी सुंडी का प्रकोप बढ़ने की आशंका है। नियमित रूप से फेरोमोन ट्रैप की निगरानी करें।",
      remedy: "५% नीम का काढ़ा या प्रोफेनोफॉस ५०% ईसी ३० मिली प्रति पंप छिड़कें।",
      created_by: "कपास अनुसंधान केंद्र",
      category: "कीट व रोग नियंत्रण",
    },
  },
  {
    test: (t, m) =>
      (t + " " + m).toLowerCase().includes("yellow mosaic") ||
      (t + " " + m).toLowerCase().includes("मोझॅक") ||
      (t + " " + m).toLowerCase().includes("मोज़ेक"),
    mr: {
      title: "सोयाबीन पिवळा मोझॅक आणि खोडमाशी नियंत्रण सल्ला",
      message: "सोयाबीन पिकावर पांढरी माशी आणि खोडमाशीचा प्रादुर्भाव झाल्यास पिवळा मोझॅक रोग पसरतो. वेळेवर कीटकनाशक फवारणी आवश्यक आहे.",
      remedy: "थायमेथोक्सम २५% डब्ल्यूजी ४ ग्रॅम किंवा एसीफेट ७५% एसपी १५ ग्रॅम प्रति १० लिटर पाण्यात मिसळून फवारा.",
      created_by: "सोयाबीन संशोधन केंद्र",
      category: "कीड व रोग नियंत्रण",
    },
    hi: {
      title: "सोयाबीन पीला मोज़ेक और तना मक्खी नियंत्रण सलाह",
      message: "सफेद मक्खी द्वारा फैलने वाले पीले मोज़ेक वायरस से बचाव हेतु तुरंत अनुशंसित कीटनाशक का छिड़काव करें।",
      remedy: "थायमेथोक्सम २५% डब्ल्यूजी ४ ग्राम या एसीफेट १५ ग्राम प्रति १० लीटर पानी में छिड़कें।",
      created_by: "सोयाबीन अनुसंधान केंद्र",
      category: "कीट व रोग नियंत्रण",
    },
  },
];

export const getLocalizedBroadcast = (alert, lang = "en") => {
  if (!alert) return {};

  const bId = alert.broadcast_id || alert.id || "";
  const origTitle = alert.title || "";
  const origMessage = alert.message || "";
  const origRemedy = alert.remedy || alert.action_recommendation || "";
  const origAuthor = alert.author_name || alert.created_by || "";
  const origCategory = alert.category || "General";
  const origSeverity = alert.severity || "Advisory";

  // Severity Label translation
  const sevLower = origSeverity.toLowerCase();
  let severityLabel = origSeverity;
  if (sevLower === "critical") {
    severityLabel = lang === "mr" ? "आपत्कालीन इशारा" : lang === "hi" ? "आपातकालीन चेतावनी" : "Critical Alert";
  } else if (sevLower === "warning") {
    severityLabel = lang === "mr" ? "सावधगिरी सूचना" : lang === "hi" ? "सावधानी सूचना" : "Warning";
  } else {
    severityLabel = lang === "mr" ? "कृषी सल्ला" : lang === "hi" ? "कृषि सलाह" : "Official Advisory";
  }

  // District Label translation
  const origDistrict = alert.district || "All";
  let districtLabel = origDistrict;
  if (origDistrict.toLowerCase() === "all" || origDistrict.toLowerCase() === "statewide") {
    districtLabel = lang === "mr" ? "सर्व महाराष्ट्र" : lang === "hi" ? "पूरा महाराष्ट्र" : "All Maharashtra";
  } else {
    districtLabel = getLocalizedDistrictName(origDistrict, lang);
  }

  // Crop Label translation
  const origCrop = alert.crop || "All";
  let cropLabel = origCrop;
  if (origCrop.toLowerCase() === "all") {
    cropLabel = lang === "mr" ? "सर्व पिके" : lang === "hi" ? "सभी फसलें" : "All Crops";
  } else if (origCrop.includes(",")) {
    cropLabel = origCrop
      .split(",")
      .map((c) => getLocalizedCropName(c.trim(), lang))
      .join(", ");
  } else {
    cropLabel = getLocalizedCropName(origCrop, lang);
  }

  // Category translation
  const catLower = origCategory.toLowerCase();
  let categoryLabel = origCategory;
  if (catLower.includes("weather")) {
    categoryLabel = lang === "mr" ? "हवामान अलर्ट" : lang === "hi" ? "मौसम अलर्ट" : "Weather Alert";
  } else if (catLower.includes("pest") || catLower.includes("disease")) {
    categoryLabel = lang === "mr" ? "कीड व रोग नियंत्रण" : lang === "hi" ? "कीट व रोग नियंत्रण" : "Pest & Disease";
  } else if (catLower.includes("scheme") || catLower.includes("gov")) {
    categoryLabel = lang === "mr" ? "शासकीय योजना" : lang === "hi" ? "सरकारी योजना" : "Government Scheme";
  }

  if (lang === "en") {
    return {
      ...alert,
      title: origTitle,
      message: origMessage,
      remedy: origRemedy,
      author_name: origAuthor || "Maharashtra Agriculture Department",
      severityLabel,
      districtLabel,
      cropLabel,
      categoryLabel,
    };
  }

  // 1. Direct ID match
  if (bId && BROADCAST_TRANSLATIONS[bId] && BROADCAST_TRANSLATIONS[bId][lang]) {
    const tData = BROADCAST_TRANSLATIONS[bId][lang];
    return {
      ...alert,
      title: tData.title || origTitle,
      message: tData.message || origMessage,
      remedy: tData.remedy || origRemedy,
      author_name: tData.created_by || origAuthor,
      severityLabel,
      districtLabel,
      cropLabel,
      categoryLabel: tData.category || categoryLabel,
    };
  }

  // 2. Keyword Rule match
  for (const rule of BROADCAST_KEYWORD_RULES) {
    if (rule.test(origTitle, origMessage) && rule[lang]) {
      const tData = rule[lang];
      return {
        ...alert,
        title: tData.title || origTitle,
        message: tData.message || origMessage,
        remedy: tData.remedy || origRemedy,
        author_name: tData.created_by || origAuthor,
        severityLabel,
        districtLabel,
        cropLabel,
        categoryLabel: tData.category || categoryLabel,
      };
    }
  }

  return {
    ...alert,
    title: origTitle,
    message: origMessage,
    remedy: origRemedy,
    author_name: origAuthor,
    severityLabel,
    districtLabel,
    cropLabel,
    categoryLabel,
  };
};

const translations = {
  en: {
    dashboard: "Dashboard",
    prediction: "Crop Prediction",
    recommendation: "Crop Recommendation",
    weather: "Weather",
    reports: "Reports",
    analytics: "Agri Analytics",
    history: "History",
    plantDoctor: "AI Plant Doctor",
    schemes: "Govt Schemes",
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
    hectaresUnit: "Acres",
    completedStatus: "Completed",
    liveBadge: "Live",

    predictions: "Yield Predictions",
    recommendations: "Crop Recommendations",
    exportPdf: "Export PDF",

    cropPrediction: "Crop Productivity Prediction",
    cropYieldPrediction: "Crop Yield Prediction",
    district: "District",
    cropYear: "Crop Year",
    season: "Season",
    area: "Area (Acres)",
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
      "KrushiMitra analyzes regional agricultural, crop, rainfall, temperature, acreage, and location datasets to estimate expected harvest productivity in tonnes per acre.",
    backToDashboard: "Back to Dashboard",
    tonnesPerHectare: "tonnes/acre",
    tonnesPerAcre: "tonnes/acre",
    select: "Select",
    fillAllFields: "Please fill all fields.",
    makeSureBackendRunning:
      "Unable to reach server. Please check your internet connection and try again.",
    backendConnectionError:
      "Unable to connect to the KrushiMitra cloud server. Please check your internet connection.",

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
    yieldForecastingDesc: "Find out how much harvest (in tonnes/acre) you can expect based on your district, land size, and weather.",
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
    analytics: "कृषि विश्लेषण",
    history: "इतिहास",
    plantDoctor: "एआई फसल डॉक्टर",
    schemes: "सरकारी योजनाएं",
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
    hectaresUnit: "एकड़",
    completedStatus: "पूर्ण",
    liveBadge: "लाइव",

    predictions: "उत्पादन पूर्वानुमान",
    recommendations: "उचित फसल सलाह",
    exportPdf: "PDF डाउनलोड करें",

    cropPrediction:
      "फसल उत्पादकता पूर्वानुमान",
    cropYieldPrediction:
      "फसल उत्पादन पूर्वानुमान",
    district: "जिला",
    cropYear: "फसल वर्ष",
    season: "मौसम",
    area: "क्षेत्रफल (एकड़)",
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
      "KrushiMitra ऐतिहासिक कृषि, फसल, वर्षा, तापमान, एकड़ रकबा और क्षेत्रीय डेटा का विश्लेषण करके प्रति एकड़ अपेक्षित फसल उत्पादकता का अनुमान लगाता है।",
    backToDashboard:
      "डैशबोर्ड पर वापस जाएं",
    tonnesPerHectare:
      "टन प्रति एकड़",
    tonnesPerAcre:
      "टन प्रति एकड़",
    select: "चुनें",
    fillAllFields:
      "कृपया सभी फ़ील्ड भरें।",
    makeSureBackendRunning:
      "सर्वर से संपर्क नहीं हो पा रहा है। कृपया अपना इंटरनेट कनेक्शन जांचें।",
    backendConnectionError:
      "KrushiMitra क्लाउड सर्वर से संपर्क नहीं हो सका। कृपया इंटरनेट जांचें और पुनः प्रयास करें।",

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
    yieldForecastingDesc: "अपने जिले, खेत के आकार (एकड़) और मौसम के अनुसार जानें कि आपको कितनी पैदावार (टन/एकड़) मिल सकती है।",
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
    recommendation: "योग्य पीक सल्ला",
    weather: "हवामान व पाऊस",
    reports: "शेती अहवाल (PDF)",
    analytics: "शेती प्रगती व आलेख",
    history: "मागील नोंदी",
    plantDoctor: "पीक डॉक्टर (रोग निदान)",
    schemes: "सरकारी योजना",
    profile: "माझी शेतकरी माहिती",
    settings: "सेटिंग्ज",
    admin: "प्रशासक (अ‍ॅडमिन)",

    mainMenu: "मुख्य मेनू",
    account: "माझे खाते",
    logout: "लॉग आउट करा",
    toggleSidebar: "मेनू उघडा / बंद करा",
    aiAgriculture: "स्मार्ट शेती",

    searchPlaceholder:
      "पीक, जिल्हा, अंदाज किंवा अहवाल शोधा...",
    notifications: "शेती अलर्ट व मेसेज",
    farmer: "शेतकरी बांधव",
    language: "भाषा निवडा",

    search: "शोधा",
    save: "सेव्ह करा",
    cancel: "रद्द करा",
    edit: "बदला",
    delete: "काढून टाका",
    submit: "सबमिट करा",
    back: "मागे जा",
    next: "पुढे जा",
    close: "बंद करा",
    loading: "माहिती लोड होत आहे, कृपया थांबा...",
    noData: "अजून कोणतीही माहिती उपलब्ध नाही",
    success: "यशस्वी!",
    error: "काहीतरी चूक झाली",
    tryAgain: "पुन्हा प्रयत्न करा",
    required: "आवश्यक माहिती",
    reset: "रीसेट करा",
    date: "तारीख",
    type: "प्रकार",
    result: "अंदाज निकाल",
    actions: "पर्याय",
    action: "पर्याय",
    status: "स्थिती",
    view: "पहा",

    welcome: "कृषीमित्रवर आपले सहर्ष स्वागत आहे!",
    goodMorning: "शुभ सकाळ",
    goodAfternoon: "शुभ दुपार",
    goodEvening: "शुभ संध्याकाळ",
    goodNight: "नमस्कार",
    overview:
      "शेतात भरघोस उत्पादन घेण्यासाठी योग्य पीक निवडा, पावसाचा अंदाज घ्या आणि शेती फायदेशीर करा.",
    makePrediction: "उत्पादन अंदाज काढा",
    totalPredictions: "केलेले एकूण अंदाज",
    soilAdvisories: "माती परीक्षण व खत सल्ला",
    modelAccuracy: "अंदाजांची अचूकता (विश्वसनीयता)",
    cropsAnalyzed: "तपासलेली पिके",
    estimatedProfit: "अपेक्षित नफा व उत्पन्न",
    recentPredictions: "नुकतेच केलेले अंदाज",
    latestPredictions: "तुमच्या शेतीसाठी नुकतेच काढलेले उत्पादन अंदाज",
    viewAll: "सर्व नोंदी पहा",
    crop: "पीक",
    location: "गाव / जिल्हा",
    yield: "एकरी अपेक्षित उत्पादन",
    confidence: "अचूकतेची खात्री",
    averagePredictedYield:
      "सरासरी अपेक्षित उत्पादन",
    comparedWithPrevious:
      "मागील अंदाजांशी तुलना करता",
    latestRecommendation:
      "नुकताच दिलेला पीक सल्ला",
    basedOnSoilWeather:
      "मातीतील पोषण (नत्र, स्फुरद, पालाश), पाऊस आणि तापमानानुसार.",
    getNewRecommendation:
      "नवीन पीक सल्ला घ्या",
    weatherAdvisory: "शेतीसाठी आजचे हवामान व पाऊस",
    viewWeather: "हवामान व पाऊस पहा",
    currentFarmingRegion:
      "आपला शेती परिसर / जिल्हा",
    checkWeather:
      "हवामान तपासा",
    noPredictionsFound:
      "अजून कोणताही अंदाज घेतलेला नाही.",
    districtBadgeSuffix: "जिल्हा",
    farmlandProfileBadge: "माझी शेतजमीन",
    registeredFarmerBadge: "नोंदणी केलेले शेतकरी",
    superAdminBadge: "मुख्य प्रशासक",
    dashboardFarmerBannerSub: "{district} जिल्ह्यातील आपल्या शेतीसाठी कृषीमित्र! एकरी किती उत्पन्न निघेल, कोणतं पीक सर्वाधिक फायदा देईल आणि पाऊस कसा राहील हे सर्व एकाच ठिकाणी जाणून घ्या.",
    dashboardAdminBannerSub: "प्रशासक नियंत्रण: पीक अंदाज प्रणाली, शेतकरी यादी आणि सिस्टीम स्थितीचे निरीक्षण करा.",
    dashboardWeatherCardSub: "{district} मधील आजचे हवामान, पाऊस आणि शेतीची कामे करण्यासाठी उपयुक्त सल्ला.",
    acresUnit: "एकर",
    hectaresUnit: "एकर",
    completedStatus: "पूर्ण झाले",
    liveBadge: "थेट (Live)",

    predictions: "उत्पादन अंदाज",
    recommendations: "योग्य पीक सल्ला",
    exportPdf: "PDF डाऊनलोड करा",

    cropPrediction:
      "पीक उत्पादन अंदाज",
    cropYieldPrediction:
      "पीक उत्पादन अंदाज",
    district: "जिल्हा",
    cropYear: "वर्ष",
    season: "हंगाम",
    area: "शेतीचे क्षेत्र (एकर)",
    rainfall: "पाऊस",
    maximumTemperature:
      "कमाल तापमान",
    predictProductivity:
      "उत्पादन अंदाज काढा",
    predictedProductivity:
      "एकरी अपेक्षित उत्पादन",
    predictionResult:
      "अपेक्षित उत्पादन निकाल",
    enterDetails:
      "शेतात किती पीक येईल हे जाणून घेण्यासाठी खालील माहिती भरा.",
    cropFieldInformation:
      "शेती आणि पिकाची माहिती",
    enterFieldDetails:
      "शेताची माहिती निवडा आणि उत्पादन अंदाज मिळवा",
    predictYield:
      "उत्पादन अंदाज काढा",
    predicting:
      "तुमच्या शेतासाठी अंदाज काढत आहे, थोडा वेळ थांबा...",
    predictionFailed:
      "अंदाज काढता आला नाही. कृपया माहिती पुन्हा तपासून प्रयत्न करा.",
    aiModelPrediction:
      "अपेक्षित पीक उत्पादन अंदाज",
    aboutCropYieldPrediction:
      "उत्पादन अंदाज कसा काढला जातो?",
    cropYieldDescription:
      "गेल्या काही वर्षांतील पाऊस, तापमान, तुमचा जिल्हा आणि जमिनीच्या क्षेत्रफळानुसार शेतात किती टन/पोती पीक निघेल याचा शास्त्रीय अंदाज कृषीमित्र देते.",
    backToDashboard:
      "मुख्य पानावर जा (डॅशबोर्ड)",
    tonnesPerHectare:
      "टन / एकर",
    tonnesPerAcre:
      "टन / एकर",
    select: "निवडा...",
    fillAllFields:
      "कृपया शेतीची सर्व आवश्यक माहिती भरा.",
    makeSureBackendRunning:
      "सर्व्हरशी संपर्क होऊ शकला नाही. कृपया इंटरनेट कनेक्शन तपासा आणि पुन्हा प्रयत्न करा.",
    backendConnectionError:
      "कृषीमित्र क्लाउड सर्व्हरशी संपर्क होऊ शकला नाही. कृपया इंटरनेट तपासा आणि पुन्हा प्रयत्न करा.",

    aiCropRecommendation:
      "मातीनुसार योग्य पीक सल्ला",
    cropRecommendation:
      "योग्य पीक सल्ला",
    recommendationDescription:
      "जमिनीतील पोषणद्रव्ये (नत्र, स्फुरद, पालाश) आणि परिसरातील हवामानानुसार शेतात कोणते पीक सर्वाधिक फायदेशीर ठरेल ते जाणून घ्या.",
    invalidNumericValues:
      "कृपया रकान्यांमध्ये योग्य संख्या भरा.",
    recommendationFailed:
      "पीक सल्ला मिळू शकला नाही. कृपया पुन्हा प्रयत्न करा.",
    soilClimateInformation:
      "माती आणि हवामानाची माहिती",
    enterFarmConditions:
      "माती परीक्षण अहवालातील आकडे आणि शेताची माहिती भरा.",
    nitrogen:
      "नत्र (N) - Nitrogen",
    phosphorus:
      "स्फुरद (P) - Phosphorus",
    potassium:
      "पालाश (K) - Potash",
    temperature:
      "तापमान (°C)",
    humidity:
      "हवेतील आर्द्रता / दमटपणा (%)",
    soilPh:
      "जमिनीचा सामू (pH)",
    mlRecommendationModel:
      "माती व हवामानानुसार शास्त्रोक्त पीक निवड",
    mlRecommendationDescription:
      "नत्र, स्फुरद, पालाश, जमिनीचा सामू (pH) आणि स्थानिक हवामानाचा अभ्यास करून सर्वोत्तम पीक सुचवले जाते.",
    analyzingConditions:
      "माती व हवामानाची परिस्थिती तपासत आहे...",
    recommendBestCrop:
      "सर्वोत्तम पीक सुचवा",
    howKrushiMitraWorks:
      "कृषीमित्र कसे काम करते?",
    aiCropSuitabilityAnalysis:
      "तुमच्या शेतासाठी पीक कसे निवडले जाते?",
    soilAnalysis:
      "मातीची तपासणी (Soil Test)",
    soilAnalysisDescription:
      "मातीतील नत्र, स्फुरद, पालाश आणि जमिनीचा सामू (pH) बारकाईने तपासला जातो.",
    climateAnalysis:
      "हवामानाची तपासणी",
    climateAnalysisDescription:
      "परिसरातील तापमान, हवेतील आर्द्रता आणि अपेक्षित पावसाचे प्रमाण तपासले जाते.",
    aiRecommendation:
      "योग्य पीक निवड",
    aiRecommendationDescription:
      "मातीची सुपीकता आणि हवामानाशी सुसंगत असलेले सर्वाधिक उत्पादन देणारे पीक निवडले जाते.",
    parameters:
      "घटक / माहिती",
    aiRecommendationComplete:
      "तुमच्या शेतीसाठी पीक सल्ला तयार आहे!",
    recommendedCrop:
      "शेतासाठी सर्वात योग्य पीक",
    recommendationConfidence:
      "पिकाची अनुकूलता (खात्री)",
    recommendationResultDescription:
      "माती परीक्षण आणि स्थानिक हवामानाचा विचार करता तुमच्या शेतात या पिकाची लागवड केल्यास भरघोस उत्पादन व चांगला नफा मिळू शकतो.",
    modelConfidenceScore:
      "अंदाजाची खात्री",
    newRecommendation:
      "नवीन पीक सल्ला घ्या",
    soilNutrients:
      "मातीतील मुख्य अन्नद्रव्ये",
    soilNutrientsDescription:
      "नत्र, स्फुरद आणि पालाश ही पिकांच्या निरोगी वाढीसाठी व दाणे भरण्यासाठी आवश्यक मुख्य अन्नद्रव्ये आहेत.",
    climateConditions:
      "हवामानाची परिस्थिती",
    climateConditionsDescription:
      "योग्य तापमान, हवेतील दमटपणा आणि वेळेवर पडणारा पाऊस यामुळे पिकाचे नुकसान टळते.",
    machineLearning:
      "हंगामानुसार निवड",
    machineLearningDescription:
      "हंगाम, पेरणीची वेळ आणि जमिनीच्या प्रकारानुसार योग्य पिकाचा अचूक सल्ला दिला जातो.",
    seasonalSuitability:
      "हंगामी अनुकूलता",
    seasonalSuitabilityDescription:
      "पेरणीची योग्य वेळ आणि जमिनीनुसार सर्वोत्तम पिकाची शिफारस.",

    weatherForecast:
      "हवामान व पावसाचा अंदाज",
    weatherDescription:
      "पेरणी, फवारणी व पाणी देण्याचे योग्य नियोजन करण्यासाठी आजचे हवामान आणि पावसाचा अंदाज पाहा.",
    searchCity:
      "तालुका, शहर किंवा जिल्हा शोधा",
    enterCityDistrict:
      "उदा. बारामती, अमरावती, नाशिक, नागपूर...",
    currentWeather:
      "आजचे थेट हवामान",
    feelsLike:
      "प्रत्यक्षात जाणवणारे तापमान",
    weatherCondition:
      "हवामानाची स्थिती",
    weatherInformation:
      "हवामानाची माहिती",
    weatherDetails:
      "हवामानाचे इतर तपशील",
    weatherDetailsDescription:
      "शेतातील आजचे तापमान, पाऊस आणि वाऱ्याची स्थिती",
    weatherConditions:
      "हवामानाची परिस्थिती",
    weatherConditionsDescription:
      "पिकांची वाढ आणि संरक्षणासाठी उपयुक्त हवामान घटक",
    checkYourLocalWeather:
      "तुमच्या भागातील हवामान पहा",
    weatherEmptyDescription:
      "आपल्या परिसरातील तापमान, पाऊस, हवेतील आर्द्रता आणि वाऱ्याचा वेग पाहण्यासाठी तालुका किंवा जिल्हा निवडा.",
    fetchingWeather:
      "हवामानाची ताजी माहिती मिळवत आहे, कृपया थांबा...",
    weatherUnavailable:
      "हवामानाची माहिती मिळू शकली नाही.",
    cityRequired:
      "कृपया तालुका किंवा जिल्हा टाका.",
    farmingInsight:
      "शेतीसाठी आजचा सल्ला",
    farmingInsightDescription:
      "हवामानाची स्थिती पाहून पिकांना पाणी देणे, औषध फवारणी किंवा खते टाकण्याचे योग्य नियोजन करा.",
    relativeHumidity:
      "हवेतील आर्द्रता (दमटपणा)",
    rainfallLastHour:
      "गेल्या तासातील पाऊस",
    currentWindSpeed:
      "वाऱ्याचा वेग",
    atmosphericPressure:
      "हवेचा दाब",
    notAvailable:
      "माहिती उपलब्ध नाही",
    visibility:
      "दृश्यमानता (धुक्याचे प्रमाण)",
    cloudiness:
      "ढगाळ वातावरण (ढगांचे प्रमाण)",
    windSpeed:
      "वाऱ्याचा वेग",
    pressure:
      "हवेचा दाब",
    fieldEnvironment:
      "शेतातील आजचे वातावरण",
    fieldEnvironmentDescription:
      "पिकांची वाढ आणि फवारणीवर परिणाम करणारे महत्त्वाचे घटक",
    agriculturalAdvisory:
      "आजची शेती कामे व सल्ला",
    agriculturalAdvisoryDescription:
      "आजच्या हवामानात औषध फवारणी, पाणी व्यवस्थापन आणि पीक काढणी करावी की नाही याचे मार्गदर्शन",
    dewPoint:
      "दव पडण्याचे प्रमाण (दवबिंदू)",
    solarExposure:
      "ऊन / सूर्यप्रकाश",
    sprayingCondition:
      "औषध फवारणीसाठी आजची परिस्थिती",
    irrigationSchedule:
      "पिकांना पाणी देण्याची गरज / वेळ",
    diseaseRisk:
      "बुरशीजन्य रोग व कीड येण्याचा धोका",
    harvestSafety:
      "पीक काढणीसाठी वातावरण",

    report:
      "शेती अहवाल (PDF)",
    generateReport:
      "अहवाल तयार करा",
    generateNewReport:
      "नवीन अहवाल तयार करा",
    downloadReport:
      "अहवाल डाऊनलोड करा",
    download:
      "डाऊनलोड करा",
    reportSummary:
      "अहवालाचा सारांश",
    totalReports:
      "एकूण तयार अहवाल",
    yieldReports:
      "उत्पादन अंदाज अहवाल",
    aiReports:
      "पीक सल्ला अहवाल",
    availableReports:
      "उपलब्ध शेती अहवाल",
    recentlyGeneratedReports:
      "तुमच्या शेतीसाठी तयार केलेले छापील अहवाल",
    cropYieldAnalysis:
      "उत्पादन अंदाज तपशील",
    cropYieldAnalysisDescription:
      "शेतात एकरी किती उत्पादन निघेल याचे सविस्तर विश्लेषण",
    predictionPerformance:
      "अचूकता व विश्वसनीयता",
    predictionPerformanceDescription:
      "मागील अंदाजांची खात्री व अचूकतेचा तुलनात्मक अहवाल",
    cropRecommendationReport:
      "योग्य पीक सल्ला अहवाल",
    cropRecommendationReportDescription:
      "माती परीक्षण व हवामानानुसार शेतासाठी सुचवलेल्या फायदेशीर पिकांचा अहवाल",
    yieldReport:
      "उत्पादन अंदाज अहवाल",
    aiReport:
      "पीक सल्ला अहवाल",
    reportType:
      "अहवालाचा प्रकार",
    period:
      "कालावधी",
    reportGenerationDescription:
      "पीक उत्पादन अंदाज, मातीनुसार खत व पीक सल्ला आणि हवामान मार्गदर्शनाचा अधिकृत १-पानाचा PDF अहवाल डाऊनलोड करा.",

    predictionHistory:
      "मागील सर्व अंदाज",
    predictionHistoryDescription:
      "तुम्ही पूर्वी घेतलेले सर्व उत्पादन अंदाज येथे सुरक्षित आहेत.",
    newPrediction:
      "नवीन अंदाज काढा",
    cropsPredicted:
      "तपासलेली पिके",
    avgConfidence:
      "सरासरी अचूकता",
    latestPrediction:
      "नुकताच केलेला अंदाज",
    today:
      "आज",
    searchHistory:
      "पीक, जिल्हा किंवा हंगामानुसार शोधा...",
    previousPredictions:
      "मागील अंदाज",
    predictionRecords:
      "मागील अंदाजांच्या नोंदी",
    predictedYield:
      "एकरी अपेक्षित उत्पादन",
    recommendationHistory:
      "मागील पीक सल्ला नोंदी",
    recommendationRecords:
      "यापूर्वी घेतलेले पीक सल्ले",
    noRecommendationsFound:
      "अजून कोणताही पीक सल्ला घेतलेला नाही.",
    recommendationDate:
      "तारीख",

    myProfile:
      "माझी शेतकरी माहिती",
    personalInformation:
      "शेतकऱ्याचे नाव व संपर्क",
    personalDetails:
      "संपर्क व पत्ता",
    manageAccountDetails:
      "तुमची वैयक्तिक माहिती पहा व अद्ययावत करा",
    editProfile:
      "माहिती बदला",
    name:
      "नाव",
    fullName:
      "पूर्ण नाव",
    email:
      "ईमेल किंवा फोन",
    emailAddress:
      "ईमेल पत्ता",
    phoneNumber:
      "मोबाईल नंबर (WhatsApp)",
    state:
      "राज्य",
    memberSince:
      "नोंदणी केल्याची तारीख",
    activityStats:
      "शेती नोंदी",
    reportsGenerated:
      "तयार केलेले अहवाल",
    profileCropsAnalyzed:
      "तपासलेली पिके",
    profileAvgConfidence:
      "सरासरी अचूकता",
    preferredLanguage:
      "वापराची भाषा",
    farmDetails:
      "शेतजमीन माहिती",
    enterFarmDetails:
      "शेताविषयी माहिती भरा...",
    noFarmDetails:
      "अजून शेताची माहिती जोडलेली नाही.",
    notProvided:
      "माहिती दिलेली नाही",
    security:
      "सुरक्षा व पासवर्ड",
    manageAccountSecurity:
      "पासवर्ड बदला आणि खाते सुरक्षित ठेवा",
    password:
      "पासवर्ड",
    passwordDescription:
      "खात्याचा पासवर्ड सुरक्षित ठेवा.",
    changePassword:
      "पासवर्ड बदला",
    notifications:
      "शेती सूचना व मेसेज",
    manageNotificationPreferences:
      "कोणत्या शेती सूचना हव्या आहेत ते निवडा",
    predictionResults:
      "नवीन उत्पादन अंदाज मेसेज",
    weatherAlerts:
      "अतिवृष्टी व हवामान अलर्ट",
    cropRecommendations:
      "पीक व खत सल्ला मेसेज",
    reportUpdates:
      "शेती अहवाल अपडेट्स",

    applicationSettings:
      "अ‍ॅप सेटिंग्ज",
    settingsDescription:
      "कृषीमित्रची भाषा आणि रंग बदला",
    appearance:
      "रंग व अक्षरे (थीम)",
    privacy:
      "माहितीची सुरक्षा",
    helpSupport:
      "शेतकरी मदत व संपर्क",
    about:
      "आमच्याबद्दल",
    customizeAppearance:
      "अ‍ॅपचा रंग आणि अक्षरांचा आकार बदला",
    theme:
      "स्क्रीन रंग (थीम)",
    light:
      "पांढरा (लाइट)",
    dark:
      "गडद / काळा (डार्क)",
    auto:
      "फोननुसार (ऑटो)",
    fontSize:
      "अक्षरांचा आकार",
    small:
      "लहान अक्षरे",
    medium:
      "मध्यम अक्षरे",
    large:
      "मोठी अक्षरे (वाचायला सोपी)",
    saveAppearance:
      "सेटिंग्ज सेव्ह करा",
    selectPreferredLanguage:
      "तुमची आवडीची भाषा निवडा",
    privacyDescription:
      "तुमची शेती माहिती पूर्णपणे सुरक्षित ठेवली जाते.",
    dataProtection:
      "माहितीचे रक्षण",
    dataProtectionDescription:
      "तुमची सर्व माहिती आणि नोंदी सुरक्षित आहेत.",
    predictionHistoryPrivacy:
      "मागील नोंदी",
    predictionHistoryPrivacyDescription:
      "तुमचे सर्व मागील अंदाज खात्यात कायम सुरक्षित राहतील.",
    needHelp:
      "कृषीमित्र वापरताना काही अडचण येत आहे का?",
    supportTeam:
      "शेतकरी मदत केंद्र",
    supportDescription:
      "अंदाज, पीक सल्ला, हवामान किंवा अहवालाबाबत मदतीसाठी आमच्याशी संपर्क साधा.",
    aboutKrushiMitra:
      "कृषीमित्रविषयी",
    aboutDescription:
      "कृषीमित्र हे महाराष्ट्रातील शेतकरी बांधवांसाठी बनवलेले सोपे शेती मित्र आहे, ज्यातून कोणतं पीक घ्यावं, किती उत्पादन निघेल आणि पाऊस कसा राहील हे अगदी सहज मराठीत समजते.",
    aiAgriculturePlatform:
      "शेतकऱ्यांसाठी स्मार्ट कृषीमित्र",
    appearanceSaved:
      "सेटिंग्ज यशस्वीरित्या सेव्ह झाल्या आहेत!",

    adminPanel:
      "प्रशासक कक्ष",
    adminDescription:
      "कृषीमित्र प्रणाली व शेतकरी व्यवस्थापन.",
    systemStatus:
      "प्रणाली स्थिती",
    servicesRunning:
      "कृषीमित्रच्या सर्व सेवा सुरळीत सुरू आहेत.",
    users:
      "नोंदणी केलेले शेतकरी",
    registeredUsers:
      "नोंदणी केलेले शेतकरी",
    database:
      "माहिती साठा (डेटाबेस)",
    connected:
      "सुरू आहे",
    dataStorage:
      "माहिती साठा",
    mlModel:
      "स्मार्ट AI मॉडेल",
    ready:
      "सक्रिय",
    predictionService:
      "उत्पादन अंदाज सेवा",
    system:
      "प्रणाली",
    active:
      "सुरू आहे",
    platformStatus:
      "प्रणाली स्थिती",

    welcomeBack:
      "कृषीमित्रवर आपले स्वागत आहे",
    loginToContinue:
      "कृषीमित्र वापरण्यासाठी लॉगिन करा",
    emailLabel:
      "ईमेल किंवा फोन",
    passwordLabel:
      "पासवर्ड",
    enterYourEmail:
      "आपला ईमेल किंवा फोन टाका",
    enterYourPassword:
      "आपला पासवर्ड टाका",
    forgotPassword:
      "पासवर्ड विसरलात?",
    login:
      "लॉगिन करा",
    backToLogin:
      "लॉगिनकडे परत जा",
    dontHaveAccount:
      "नवीन शेतकरी आहात?",
    register:
      "मोफत नोंदणी करा",
    aiPoweredAgriculture:
      "शेतकऱ्यांसाठी स्मार्ट कृषीमित्र",
    rememberMe: "माझे लॉगिन लक्षात ठेवा",
    loginRequired:
      "कृपया ईमेल आणि पासवर्ड टाका.",

    landingSolutions: "शेती सुविधा",
    landingHowItWorks: "कसे वापरावे?",
    landingSupportedCrops: "मुख्य पिके",
    landingFarmers: "शेतकरी बांधव",
    landingFaq: "नेहमी विचारले जाणारे प्रश्न",
    signIn: "लॉगिन करा",
    getStarted: "सुरू करा",
    heroBadge: "महाराष्ट्रातील शेतकरी बांधवांसाठी सोपे व स्मार्ट कृषीमित्र",
    heroTitlePart1: "बळीराजाला समृद्ध करणारा",
    heroTitlePart2: "स्मार्ट व सोपा कृषीमित्र",
    heroSubtitle: "कोणतं पीक फायदेशीर ठरेल? एकरी किती उत्पन्न निघेल? आणि पाऊस कसा राहील? सर्व माहिती मिळवा एकाच ठिकाणी, अगदी सहज मराठीत!",
    startFreePrediction: "उत्पादनाचा अंदाज काढा",
    quickDemoLogin: "डेमो वापरून पहा",
    yieldForecast: "उत्पादन अंदाज",
    optimalMatch: "योग्य पीक सल्ला",
    sowingWindow: "पेरणीसाठी सर्वोत्तम वेळ",
    solutionsHeader: "शेतकऱ्यांसाठी अत्यंत सोपी व उपयुक्त साधने",
    solutionsSub: "आपली माती आणि स्थानिक हवामानानुसार योग्य पीक निवडा, एकरी उत्पादनाचा अचूक अंदाज घ्या आणि शेती तोट्यातून फायद्यात आणा.",
    yieldForecastingTitle: "पीक उत्पादन अंदाज",
    yieldForecastingDesc: "तुमचा जिल्हा, शेताचे क्षेत्र (एकर) आणि हवामानानुसार एकरी व एकूण किती टन माल निघेल ते पेरणीपूर्वीच जाणून घ्या.",
    soilAdvisoryTitle: "मातीनुसार योग्य पीक सल्ला",
    soilAdvisoryDesc: "मातीतील नत्र, स्फुरद, पालाश आणि जमिनीचा सामू (pH) टाकून तुमच्या रानात कोणते पीक सर्वाधिक नफा देईल ते शोधा.",
    weatherTelemetryTitle: "थेट हवामान व पावसाचा अंदाज",
    weatherTelemetryDesc: "पेरणी, फवारणी आणि खते देण्याचे नियोजन करण्यासाठी आपल्या गावातील थेट तापमान, पाऊस आणि वाऱ्याचा वेग तपासा.",
    pdfDossiersTitle: "शेतीचा १-पानाचा छापील PDF अहवाल",
    pdfDossiersDesc: "बँक पीक कर्ज, पीक विमा किंवा शासकीय कामांसाठी संपूर्ण माहितीचा १-पानाचा छापील PDF अहवाल मोफत डाऊनलोड करा.",
    howItWorksHeading: "कृषीमित्र कसे वापरावे? (३ सोप्या पायऱ्या)",
    step1Title: "१. शेतीची माहिती भरा किंवा आवाजाने बोला",
    step1Desc: "आपला जिल्हा, शेतीचे क्षेत्र (एकर) आणि पिकाचे नाव निवडा अथवा आवाजाने सांगा.",
    step2Title: "२. काही सेकंदात अंदाज मिळवा",
    step2Desc: "आधुनिक तंत्रज्ञानाद्वारे काही सेकंदातच एकरी अपेक्षित उत्पादन व शेती सल्ला स्क्रीनवर दिसेल.",
    step3Title: "३. सल्ला पहा व PDF अहवाल मिळवा",
    step3Desc: "खतांचे प्रमाण व शेतीची कामे समजून घ्या आणि एका क्लिकवर WhatsApp वर शेअर करा किंवा PDF डाऊनलोड करा.",
    supportedCropsHeading: "महाराष्ट्रातील प्रमुख पिके",
    supportedCropsSub: "सोयाबीन, कापूस, तूर, हरभरा, मका, ऊस यांसह महाराष्ट्रातील सर्व प्रमुख पिकांचे संपूर्ण मार्गदर्शन.",
    farmerTestimonialsHeading: "शेतकरी बांधवांचे अनुभव",
    faqHeading: "नेहमी विचारले जाणारे प्रश्न",
    ctaHeading: "शेतीत भरघोस उत्पादन व चांगला नफा मिळवण्यासाठी तयार आहात का?",
    ctaSubtitle: "मातीनुसार योग्य पीक निवड, अचूक उत्पादन अंदाज आणि विश्वासार्ह हवामान सल्ल्यासाठी आजच कृषीमित्र वापरा.",
    createFreeAccount: "मोफत नोंदणी करा",
    instantDemoAccess: "डेमो वापरून पहा",
    platformTools: "शेती साधने",
    farmerSupport: "शेतकरी सहाय्यता",
    kisanHelpline: "शेतकरी मदत क्रमांक",
    accountAccess: "खाते लॉगिन",
    simHeader: "शेती माहिती व उत्पादन अंदाज",
    simSub: "थेट पीक उत्पादन अंदाज, मातीनुसार योग्य पीक आणि आजचे हवामान.",
    yieldPredictorTab: "उत्पादन अंदाज",
    soilAdvisoryTab: "माती व पीक सल्ला",
    liveWeatherTab: "थेट हवामान",
    liveTelemetry: "थेट माहिती",
    selectDistrict: "जिल्हा निवडा",
    selectCrop: "पीक निवडा",
    selectSeason: "हंगाम निवडा",
    selectYear: "वर्ष निवडा",
    cropArea: "शेतीचे क्षेत्र (एकर)",
    estimateHarvestYield: "उत्पादन अंदाज काढा",
    findOptimalCrop: "योग्य पीक शोधा",
    useMyLiveLocation: "📍 माझे थेट गाव/शहर निवडा",
    locating: "स्थान शोधत आहे...",
    predictedYieldBanner: "अपेक्षित पीक उत्पादन",
    recommendedCropBanner: "सुचवलेले योग्य पीक",
    expectedOutput: "एकरी अपेक्षित उत्पादन",
    totalHarvest: "शेतातील एकूण उत्पादन",
    totalHarvestEstimate: "अपेक्षित एकूण उत्पादन",
    suitabilityFactor: "हवामान व जमीन अनुकूलता",
    liveTemperature: "थेट तापमान",
    relativeHumidity: "हवेतील आर्द्रता",
    windVelocity: "वाऱ्याचा वेग",
    farmingStatus: "शेतीसाठी आजचा सल्ला",
    atmosphericMoisture: "हवेतील दमटपणा",
    breezeVelocity: "वाऱ्याचा वेग",
    openWeatherTelemetry: "थेट हवामान माहिती",
    exploreTool: "वापरून पहा",
    tryStep: "पायरी",
    tryStepNow: "सुरू करा",
    allCropsFilter: "🌾 सर्व पिके",
    kharifFilter: "🌧️ खरीप (पावसाळी)",
    rabiFilter: "❄️ रब्बी (हिवाळी)",
    cashFilter: "💰 नगदी पिके",
    farmerExperiences: "⭐ शेतकरी बांधवांचे अनुभव",
    helpAndAnswers: "❓ मदत आणि उत्तरे",
    joinFellowFarmers: "महाराष्ट्रातील शेतकरी बांधवांशी जोडा",
    aboutUsTitle: "🌱 आमच्याबद्दल — कृषीमित्र",
    aboutUsDesc1: "कृषीमित्र हे महाराष्ट्रातील शेतकरी बांधवांसाठी तयार केलेले सोपे कृषी साधन आहे. हवामान, पाऊस, मागील वर्षांतील उत्पादन आणि मातीतील खतांच्या प्रमाणानुसार शेतकऱ्यांना एकरी किती उत्पन्न होईल आणि कोणते पीक फायदेशीर ठरेल याचे अचूक मार्गदर्शन करणे हा याचा मुख्य उद्देश आहे.",
    aboutUsDesc2: "किचकट आकडेवारीऐवजी शेतकऱ्यांना समजेल अशा साध्या व अस्सल मराठी भाषेत माहिती देणे हे कृषीमित्रचे वैशिष्ट्य आहे. शेतीचा प्रत्येक निर्णय सोपा आणि फायदेशीर व्हावा यासाठी तंत्रज्ञान थेट शेतकऱ्यांच्या बांधापर्यंत आणले आहे.",

    // Reports Page Full Localization
    reportsPageHeading: "शेती अहवाल व PDF डाऊनलोड",
    reportsPageSub: "बँक पीक कर्ज, विमा दावा किंवा स्वतःच्या नोंदींसाठी शेतीचा अधिकृत १-पानाचा PDF अहवाल डाऊनलोड करा.",
    recordsReady: "नोंदी तयार",
    pdfReadyBadge: "PDF तयार आहे",
    exportBundleBtn: "सर्व अहवाल एकत्र डाऊनलोड करा",
    noReportsToExport: "डाऊनलोड करण्यासाठी नोंदी उपलब्ध नाहीत",
    loggedYieldPredictions: "केलेले उत्पादन अंदाज",
    soilCropTests: "माती व पीक चाचण्या",
    availableFarmDossiers: "उपलब्ध शेती अहवाल",
    dossierUnit: "अहवाल",
    dossiersUnit: "अहवाल",
    noFarmReportsTitle: "अजून कोणतेही शेती अहवाल तयार केलेले नाहीत",
    noFarmReportsDesc: "तुम्ही अजून कोणताही उत्पादन अंदाज किंवा पीक सल्ला घेतलेला नाही. एकदा अंदाज किंवा सल्ला घेतल्यावर तुमचा शेती अहवाल येथे लगेच उपलब्ध होईल.",
    getSoilCropAdvisoryBtn: "मातीनुसार योग्य पीक सल्ला घ्या",
    predictHarvestYieldBtn: "पीक उत्पादन अंदाज काढा",
    availableReportsCatalog: "उपलब्ध PDF अहवाल",
    selectReportTypeSub: "खाली दिलेल्या बटनावर क्लिक करून तुमचा PDF अहवाल डाऊनलोड करा.",
    yieldReportItemTitle: "पीक उत्पादन अंदाज अहवाल (PDF)",
    yieldReportItemDesc: "जिल्हा, पाऊस, तापमान आणि एकर क्षेत्रफळानुसार किती उत्पादन निघेल याचे संपूर्ण विवरण.",
    yieldReportItemType: "उत्पादन अहवाल",
    recReportItemTitle: "माती परीक्षण व पीक सल्ला अहवाल (PDF)",
    recReportItemDesc: "मातीतील खते (नत्र, स्फुरद, पालाश), जमिनीचा सामू (pH) आणि हवामानानुसार निवडलेल्या पिकांचा अहवाल.",
    recReportItemType: "पीक सल्ला",
    masterReportItemTitle: "संपूर्ण शेती अहवाल (मास्टर PDF)",
    masterReportItemDesc: "उत्पादन अंदाज, मातीनुसार पीक सल्ला आणि शेती नियोजनाचा सर्वसमावेशक एकत्रित अहवाल.",
    masterReportItemType: "संपूर्ण अहवाल",
    recordCountSingular: "नोंद",
    recordCountPlural: "नोंदी",
    downloadPdfBtn: "PDF डाऊनलोड करा",
    officialFarmRecordsTitle: "अधिकृत शेती अहवाल व सल्ला दस्तऐवज",
    officialFarmRecordsDesc: "हा PDF अहवाल बँक पीक कर्ज, पीक विमा किंवा कृषी अधिकाऱ्यांच्या मार्गदर्शनासाठी अत्यंत उपयुक्त आहे.",
    reportGeneratedSuccess: "PDF अहवाल यशस्वीरित्या तयार झाला!",

    // Profile Page Localization
    profilePageHeading: "माझी शेतकरी माहिती व नोंदी",
    profilePageSub: "आपले नाव, मोबाईल नंबर, शेतजमीन आणि इतर तपशील येथे तपासा व अद्ययावत करा.",
    personalAndFarmInfo: "माझी माहिती व शेती तपशील",
    securityAndPassword: "सुरक्षा व पासवर्ड",
    notificationAlerts: "शेती अलर्ट व मेसेज",
    farmerAgriDetails: "शेतकरी व शेती तपशील",
    farmerAgriDetailsSub: "आपला मोबाईल नंबर, जिल्हा, जमिनीचा प्रकार आणि सिंचनाची सोय अद्ययावत करा.",
    editProfileDetails: "माहिती बदला",
    contactAndIdentity: "१. संपर्क व ओळख",
    farmerFullName: "शेतकऱ्याचे संपूर्ण नाव *",
    phoneMobile: "मोबाईल नंबर (WhatsApp) *",
    pmKisanIdLabel: "KCC / पीएम-किसान किंवा नमो शेतकरी आयडी (ऐच्छिक)",
    pmKisanIdPlaceholder: "उपलब्ध असल्यास पीएम-किसान / KCC नंबर टाका",
    farmlandProfileHeading: "२. शेतजमीन व पिकांची माहिती",
    districtMaharashtra: "जिल्हा (महाराष्ट्र)",
    totalCultivatedLandArea: "एकूण शेतजमीन (एकर)",
    primarySoilClass: "मातीचा प्रकार",
    selectSoilType: "मातीचा प्रकार निवडा...",
    irrigationWaterSource: "पाण्याची सोय (सिंचन)",
    selectIrrigationSource: "उदा. विहीर, बोअरवेल, कालवा (कॅनॉल), ठिबक सिंचन, तुषार सिंचन",
    primaryCropsLabel: "तुम्ही सहसा घेता ती पिके",
    primaryCropsPlaceholder: "उदा. कापूस, सोयाबीन, गहू, भात, ऊस",
    fieldNotesLabel: "शेतीविषयी इतर नोंदी",
    fieldNotesPlaceholder: "शेताविषयी काही विशेष माहिती असल्यास येथे लिहा...",
    saveFarmProfile: "माहिती सेव्ह करा",
    accountSecurityHeading: "खाते सुरक्षा आणि पासवर्ड",
    accountSecuritySub: "आपला पासवर्ड बदला आणि शेतकरी खाते सुरक्षित ठेवा.",
    currentPassword: "सध्याचा पासवर्ड",
    newPassword: "नवीन पासवर्ड",
    confirmNewPassword: "नवीन पासवर्ड पुन्हा टाका",
    enterCurrentPasswordPlaceholder: "सध्याचा पासवर्ड टाका",
    min6CharsPlaceholder: "किमान ६ अक्षरे",
    reenterNewPasswordPlaceholder: "नवीन पासवर्ड पुन्हा टाका",
    updatePassword: "पासवर्ड बदला",
    notifAlertsHeading: "शेती सूचना व मेसेज प्राधान्ये",
    notifAlertsSub: "पीक अंदाज, हवामान आणि खतांचे कोणते अलर्ट हवे आहेत ते निवडा.",
    notifYieldTitle: "पीक उत्पादन अंदाज मेसेज",
    notifYieldDesc: "नवीन उत्पादन अंदाज तयार झाल्यावर तात्काळ सूचना मिळवा.",
    notifWeatherTitle: "अतिवृष्टी व हवामान अलर्ट",
    notifWeatherDesc: "अतिवृष्टी, गारपीट, वादळी वारे किंवा हवामान बदलाचा तातडीचा इशारा.",
    notifCropRecTitle: "हंगामी पीक व खत सल्ला",
    notifCropRecDesc: "खरीप, रब्बी व उन्हाळी हंगामासाठी जमिनीनुसार फायदेशीर पिकांचा सल्ला.",
    notifSmsTitle: "मोबाईलवर SMS अलर्ट",
    notifSmsDesc: "महत्त्वाचे कृषी सल्ले व अलर्ट थेट मोबाईलवर SMS द्वारे मिळवा.",
    liveFarmStats: "माझ्या शेतीची माहिती",
    yieldPredictionsLabel: "उत्पादन अंदाज:",
    cropRecommendationsLabel: "पीक सल्ला:",
    cropsUnit: "पिके",
    profileSavedSuccess: "माहिती यशस्वीरित्या सेव्ह झाली!",
    passwordUpdatedSuccess: "पासवर्ड यशस्वीरित्या बदलला!",
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
    if (typeof window !== "undefined") {
      const sessionUser = sessionStorage.getItem("krushimitra_user");
      if (sessionUser) {
        try {
          return sanitizeUserData(JSON.parse(sessionUser));
        } catch {
          return null;
        }
      }
      const localUser = localStorage.getItem("krushimitra_user");
      if (localUser) {
        try {
          return sanitizeUserData(JSON.parse(localUser));
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const [language, setLanguage] = useState(() => {
    // Default language is ALWAYS Marathi ('mr') as KrushiMitra is tailored for Maharashtra farmers.
    // If the user actively switches to English or Hindi in the active session, respect that choice.
    const sessionLang = sessionStorage.getItem("krushimitra_language");
    if (sessionLang && ["mr", "en", "hi"].includes(sessionLang)) {
      return sessionLang;
    }
    // Only use saved choice if explicitly chosen by the user in the UI
    const explicitUserLang = localStorage.getItem("krushimitra_explicit_language");
    if (explicitUserLang && ["mr", "en", "hi"].includes(explicitUserLang)) {
      return explicitUserLang;
    }
    return "mr";
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
          productivity: 1.38,
          production: 6.9,
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
          productivity: 1.15,
          production: 5.18,
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

  const API_BASE = API_BASE_URL;

  const [supportTickets, setSupportTickets] = useState(() => {
    const saved = localStorage.getItem("krushimitra_support_tickets");
    return saved ? JSON.parse(saved) : [];
  });

  // User Directory for Admin RBAC
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem("krushimitra_users_db");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleanUsers = parsed.filter(u => 
            !["suresh.deshmukh@krushimitra.in", "priya.shinde@krushimitra.in", "anil.jadhav@krushimitra.in", "balasaheb@krushimitra.in", "namdev.koli@krushimitra.in", "raju.shetti.test@gmail.com", "pooja.deshmukh@example.com"].includes(u?.email)
            && !(u?.email && u.email.startsWith("test.farmer."))
          );
          if (cleanUsers.length > 0) {
            localStorage.setItem("krushimitra_users_db", JSON.stringify(cleanUsers));
            return cleanUsers;
          }
        }
      } catch {
        // fallback
      }
    }
    const initialUsers = [
      {
        id: 1,
        name: "KrushiMitra Administrator",
        email: "admin@krushimitra.in",
        role: "Admin",
        district: "Pune",
        phone: "+91 98000 00001",
        status: "Active",
        member_since: "January 2026",
      },
      {
        id: 2,
        name: "Ramesh Patil",
        email: "ramesh.patil@krushimitra.in",
        role: "Farmer",
        district: "Pune",
        farm_size: "5.0",
        farm_unit: "Acres",
        phone: "+91 98230 45678",
        status: "Active",
        member_since: "February 2026",
      },
      {
        id: 20,
        name: "Janhavi Jawalkar",
        email: "janhavijawalkar15@gmail.com",
        role: "Farmer",
        district: "Amravati",
        farm_size: "4.5",
        farm_unit: "Acres",
        phone: "+91 98220 12345",
        status: "Active",
        member_since: "September 2026",
      }
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
  const [farmerBroadcastAlerts, setFarmerBroadcastAlerts] = useState([]);
  const [adminBroadcastsList, setAdminBroadcastsList] = useState([]);
  const [readBroadcastIds, setReadBroadcastIds] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const key = user?.email
        ? `krushimitra_read_broadcasts_${user.email.toLowerCase()}`
        : "krushimitra_read_broadcasts_guest";
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync read broadcasts when user changes
  useEffect(() => {
    const key = user?.email
      ? `krushimitra_read_broadcasts_${user.email.toLowerCase()}`
      : "krushimitra_read_broadcasts_guest";
    try {
      const saved = localStorage.getItem(key);
      setReadBroadcastIds(saved ? JSON.parse(saved) : []);
    } catch {
      setReadBroadcastIds([]);
    }
  }, [user?.email]);

  // Sync active district broadcast advisories whenever user or their district changes
  useEffect(() => {
    const dist = user?.district || "Pune";
    fetch(buildApiUrl(`/farmer/broadcasts?district=${encodeURIComponent(dist)}`))
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.alerts)) {
          setFarmerBroadcastAlerts(data.alerts);
        }
      })
      .catch(() => {});
  }, [user?.district]);

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
              area: Number(r.area || 5.0),
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

  const markBroadcastAsRead = (broadcastId) => {
    if (!broadcastId) return;
    const bIdStr = String(broadcastId);
    setReadBroadcastIds((prev) => {
      if (prev.includes(bIdStr)) return prev;
      const updated = [...prev, bIdStr];
      const key = user?.email
        ? `krushimitra_read_broadcasts_${user.email.toLowerCase()}`
        : "krushimitra_read_broadcasts_guest";
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    });
  };

  const markAllBroadcastsAsRead = () => {
    const allIds = (farmerBroadcastAlerts || []).map((b) => String(b.broadcast_id || b.id)).filter(Boolean);
    setReadBroadcastIds((prev) => {
      const combined = Array.from(new Set([...prev, ...allIds]));
      const key = user?.email
        ? `krushimitra_read_broadcasts_${user.email.toLowerCase()}`
        : "krushimitra_read_broadcasts_guest";
      localStorage.setItem(key, JSON.stringify(combined));
      return combined;
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

    // Also mark all broadcast alerts as read so badge clears
    markAllBroadcastsAsRead();
  };

  const clearAllNotifications = () => {
    const userKey = user?.email
      ? `krushimitra_notifications_${user.email.toLowerCase()}`
      : "krushimitra_notifications_guest";

    setNotifications([]);
    localStorage.setItem(userKey, JSON.stringify([]));
  };

  // Real Database Login
  const apiLogin = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }
      if (!response.ok || !data.success) {
        return {
          success: false,
          userNotFound: Boolean(data.user_not_found),
          message: data.message || (response.status === 401 ? "Incorrect password. Please verify and try again." : `Login failed (${response.status})`),
        };
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
      return {
        success: false,
        message: err?.message && !err.message.includes("fetch")
          ? `Connection error: ${err.message}`
          : "Database server connection error. Please try again."
      };
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
      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }
      if (!response.ok || !data.success) {
        return { success: false, message: data.message || `Registration failed (${response.status})` };
      }
      login(data.user);
      registerUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      console.error("Backend API connection error during registration:", err);
      return {
        success: false,
        message:
          language === "mr"
            ? "सर्व्हरशी संपर्क होऊ शकला नाही. कृपया इंटरनेट कनेक्शन तपासा आणि पुन्हा प्रयत्न करा."
            : language === "hi"
            ? "सर्वर से संपर्क नहीं हो सका। कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।"
            : "Could not connect to KrushiMitra cloud server. Please check your internet connection.",
      };
    }
  };

  // Google OAuth 2.0 Sign-In & Onboarding (Cross-Device Compatible)
  const apiGoogleAuth = async (credentialOrData) => {
    try {
      const payload =
        typeof credentialOrData === "string"
          ? { credential: credentialOrData }
          : credentialOrData;

      const response = await fetch(`${API_BASE}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }
      if (!response.ok || !data.success) {
        return { success: false, message: data.message || `Authentication failed (${response.status})` };
      }
      login(data.user);
      registerUser(data.user);
      return { success: true, user: data.user, isNewUser: data.isNewUser };
    } catch (err) {
      console.warn("Backend Google Auth error:", err);
      return {
        success: false,
        message: err?.message && !err.message.includes("fetch")
          ? `Connection error: ${err.message}`
          : "Server connection failed during Google Sign-In. Please check your network and try again."
      };
    }
  };

  // Secure Authorization Headers (JWT + RBAC Identity)
  const getAuthHeaders = () => {
    const token = typeof window !== "undefined"
      ? (sessionStorage.getItem("krushimitra_token") || localStorage.getItem("krushimitra_token"))
      : null;
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    if (user?.email) {
      headers["X-User-Email"] = user.email;
      if (user.role === "Admin") {
        headers["X-Admin-Email"] = user.email;
      }
    }
    return headers;
  };

  // Real Database Profile Update
  const apiUpdateProfile = async (profileData) => {
    try {
      const response = await fetch(`${API_BASE}/user/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
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
      const response = await fetch(`${API_BASE}/admin/users`, {
        headers: { ...getAuthHeaders() }
      });
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

  // Synchronize live users directly from MySQL on mount and auth changes
  useEffect(() => {
    apiFetchAdminUsers();
  }, [user?.email, user?.role]);

  // Real Database Admin User Role Update
  const apiUpdateUserRole = async (userId, newRole) => {
    try {
      await fetch(`${API_BASE}/admin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
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
        headers: { ...getAuthHeaders() }
      });
    } catch (err) {
      console.warn("Backend API offline for user delete:", err);
    }
    deleteUser(userId);
  };

  // Real Database Admin Stats Fetch
  const apiFetchAdminStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/stats`, {
        headers: { ...getAuthHeaders() }
      });
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
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
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
  // Admin: Fetch Tickets
  const apiFetchAdminTickets = async () => {
    let serverTickets = [];
    try {
      const response = await fetch(`${API_BASE}/admin/tickets`);
      const data = await response.json();
      if (response.ok && data.success && Array.isArray(data.tickets)) {
        serverTickets = data.tickets;
      }
    } catch (err) {
      console.warn("Backend API offline for tickets:", err);
    }

    let localTickets = [];
    try {
      const saved = localStorage.getItem("krushimitra_support_tickets");
      if (saved) localTickets = JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to parse local support tickets:", e);
    }

    const serverIds = new Set(serverTickets.map((t) => String(t.ticket_id || t.id)));
    const merged = [
      ...serverTickets,
      ...localTickets.filter((t) => !serverIds.has(String(t.ticket_id || t.id))),
    ];

    setSupportTickets(merged);
    try {
      localStorage.setItem("krushimitra_support_tickets", JSON.stringify(merged));
    } catch (e) {}

    return merged;
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
      setSupportTickets((prev) => {
        const updated = prev.map((t) =>
          (String(t.ticket_id) === String(ticketId) || String(t.id) === String(ticketId))
            ? { ...t, status }
            : t
        );
        localStorage.setItem("krushimitra_support_tickets", JSON.stringify(updated));
        return updated;
      });
      return { success: response.ok && data.success };
    } catch (err) {
      setSupportTickets((prev) => {
        const updated = prev.map((t) =>
          (String(t.ticket_id) === String(ticketId) || String(t.id) === String(ticketId))
            ? { ...t, status }
            : t
        );
        localStorage.setItem("krushimitra_support_tickets", JSON.stringify(updated));
        return updated;
      });
      return { success: true };
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
      setSupportTickets((prev) => {
        const updated = prev.map((t) =>
          (String(t.ticket_id) === String(ticketId) || String(t.id) === String(ticketId))
            ? { ...t, admin_reply: reply, status }
            : t
        );
        localStorage.setItem("krushimitra_support_tickets", JSON.stringify(updated));
        return updated;
      });
      return { success: response.ok && data.success, message: data.message };
    } catch (err) {
      setSupportTickets((prev) => {
        const updated = prev.map((t) =>
          (String(t.ticket_id) === String(ticketId) || String(t.id) === String(ticketId))
            ? { ...t, admin_reply: reply, status }
            : t
        );
        localStorage.setItem("krushimitra_support_tickets", JSON.stringify(updated));
        return updated;
      });
      return { success: true, message: "Reply saved locally" };
    }
  };

  // Admin: Delete Support Ticket
  const apiAdminDeleteTicket = async (ticketId) => {
    try {
      const response = await fetch(`${API_BASE}/admin/tickets/${ticketId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      setSupportTickets((prev) => {
        const updated = prev.filter((t) => String(t.ticket_id) !== String(ticketId) && String(t.id) !== String(ticketId));
        localStorage.setItem("krushimitra_support_tickets", JSON.stringify(updated));
        return updated;
      });
      return { success: response.ok && data.success };
    } catch (err) {
      setSupportTickets((prev) => {
        const updated = prev.filter((t) => String(t.ticket_id) !== String(ticketId) && String(t.id) !== String(ticketId));
        localStorage.setItem("krushimitra_support_tickets", JSON.stringify(updated));
        return updated;
      });
      return { success: true };
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

  // =========================================================
  // BROADCAST ADVISORY & EMERGENCY ALERTS APIs
  // =========================================================

  // Farmer: Fetch Broadcast Alerts for a District
  const apiFetchFarmerBroadcasts = async (targetDistrict) => {
    try {
      const dist = targetDistrict || user?.district || "Pune";
      const response = await fetch(buildApiUrl(`/farmer/broadcasts?district=${encodeURIComponent(dist)}`));
      const data = await response.json();
      if (response.ok && data.success) {
        setFarmerBroadcastAlerts(data.alerts || []);
        return data.alerts || [];
      }
    } catch (err) {
      console.warn("Farmer alerts fetch error:", err);
    }
    return [];
  };

  // Admin: Fetch All Broadcasts
  const apiFetchAdminBroadcasts = async () => {
    try {
      const response = await fetch(buildApiUrl("/admin/broadcasts"));
      const data = await response.json();
      if (response.ok && data.success) {
        setAdminBroadcastsList(data.broadcasts || []);
        return data.broadcasts || [];
      }
    } catch (err) {
      console.warn("Admin broadcasts fetch error:", err);
    }
    return [];
  };

  // Admin: Create & Dispatch New Broadcast
  const apiCreateBroadcast = async (broadcastData) => {
    try {
      const response = await fetch(buildApiUrl("/admin/broadcasts"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(broadcastData),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        await apiFetchAdminBroadcasts();
        // Also refresh farmer alerts if applicable
        const curDist = user?.district || "Pune";
        apiFetchFarmerBroadcasts(curDist);
        return { success: true, message: data.message, broadcast: data.broadcast };
      }
      return { success: false, message: data.message || "Failed to dispatch broadcast" };
    } catch (err) {
      return { success: false, message: "Broadcast server connection failed" };
    }
  };

  // Admin: Delete Broadcast
  const apiDeleteBroadcast = async (broadcastId) => {
    try {
      const response = await fetch(buildApiUrl(`/admin/broadcasts/${encodeURIComponent(broadcastId)}`), {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok && data.success) {
        await apiFetchAdminBroadcasts();
        const curDist = user?.district || "Pune";
        apiFetchFarmerBroadcasts(curDist);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || "Failed to delete broadcast" };
    } catch (err) {
      return { success: false, message: "Broadcast server connection failed" };
    }
  };

  const registerUser = (newUser) => {
    const userObj = {
      id: newUser.id || "usr-" + Date.now().toString().slice(-6),
      name: newUser.name,
      email: newUser.email,
      password: newUser.password || "password123",
      role: newUser.role || "Farmer",
      district: newUser.district || "Pune",
      phone: newUser.phone || "+91 98000 00000",
      farm_size: newUser.farm_size || newUser.farmSize || "5.0",
      farm_unit: newUser.farm_unit || newUser.farmUnit || "Acres",
      kisan_id: newUser.kisan_id || newUser.kisanId || "",
      soil_type: newUser.soil_type || newUser.soilType || "",
      irrigation_type: newUser.irrigation_type || newUser.irrigationType || "",
      primary_crops: newUser.primary_crops || newUser.primaryCrops || "",
      member_since: newUser.member_since || newUser.joinedDate || new Date().toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      }),
      status: newUser.status || "Active",
      totalPredictions: newUser.totalPredictions || 0,
      created_at: newUser.created_at || new Date().toISOString(),
    };

    setUsersList((prev) => {
      const updated = [userObj, ...prev.filter((u) => u.email?.toLowerCase() !== newUser.email?.toLowerCase())];
      localStorage.setItem("krushimitra_users_db", JSON.stringify(updated));
      return updated;
    });

    // In the background, also synchronize latest state directly from MySQL backend
    apiFetchAdminUsers().catch(() => {});

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
    const isFeedback = (ticket.category || "").toLowerCase().includes("feedback") || ticket.type === "feedback";
    const genId = ticket.id || ticket.ticket_id || ("TICK-" + Date.now().toString().slice(-6));
    const optimisticTicket = {
      id: genId,
      ticket_id: genId,
      ...ticket,
      type: isFeedback ? "feedback" : "query",
      user_email: ticket.user_email || user?.email || "farmer@krushimitra.in",
      name: ticket.name || user?.name || "Farmer",
      district: ticket.district || user?.district || "Maharashtra",
      status: "Submitted",
      rating: isFeedback ? (Number(ticket.rating) || 5) : null,
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
          rating: isFeedback ? (Number(optimisticTicket.rating) || 5) : null,
          type: optimisticTicket.type,
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

    if (typeof window !== "undefined") {
      sessionStorage.setItem("krushimitra_user", JSON.stringify(sanitized));
      localStorage.setItem("krushimitra_user", JSON.stringify(sanitized));

      if (userData?.token) {
        sessionStorage.setItem("krushimitra_token", userData.token);
        localStorage.setItem("krushimitra_token", userData.token);
      }
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("krushimitra_user");
      sessionStorage.removeItem("krushimitra_token");
      localStorage.removeItem("krushimitra_user");
      localStorage.removeItem("krushimitra_token");
    }
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
        : "mr";

    setLanguage(selectedLanguage);

    localStorage.setItem(
      "krushimitra_language",
      selectedLanguage
    );
    sessionStorage.setItem(
      "krushimitra_language",
      selectedLanguage
    );
    localStorage.setItem(
      "krushimitra_user_lang",
      selectedLanguage
    );
    localStorage.setItem(
      "krushimitra_explicit_language",
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
      desc: `Estimated yield: ${prediction.productivity || "—"} t/acre for ${prediction.district || "your farm"} (${prediction.season || "Season"}).`,
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
        area: Number(recommendation.area || 5.0),
        n_val: Number(recommendation.nitrogen || 0),
        p_val: Number(recommendation.phosphorus || 0),
        k_val: Number(recommendation.potassium || 0),
        temperature: Number(recommendation.temperature || 0),
        humidity: Number(recommendation.humidity || 0),
        ph: Number(recommendation.ph || 0),
        rainfall: Number(recommendation.rainfall || 0),
      }),
    }).catch(() => {});

    const recArea = recommendation.area || 5;
    addNotification({
      title: `Recommended Crop: ${recommendation.crop || "Crop"} (${recArea} Acres)`,
      desc: `High match recommendation for your ${recArea} acre farmland based on soil N-P-K nutrient & weather levels.`,
      type: "recommendation",
      crop: recommendation.crop,
      area: recArea,
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

        // Broadcast Advisory & Emergency Alerts
        farmerBroadcastAlerts,
        adminBroadcastsList,
        readBroadcastIds,
        markBroadcastAsRead,
        markAllBroadcastsAsRead,
        apiFetchFarmerBroadcasts,
        apiFetchAdminBroadcasts,
        apiCreateBroadcast,
        apiDeleteBroadcast,
        getLocalizedBroadcast: (alert) => getLocalizedBroadcast(alert, language),
        tBroadcast: (alert) => getLocalizedBroadcast(alert, language),
        BROADCAST_TRANSLATIONS,

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
        tWeather: (condition) => getLocalizedWeatherCondition(condition, language),
        getLocalizedWeatherCondition,
        WEATHER_TRANSLATIONS,
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