/**
 * Voice Parser utility to extract structured agricultural data from spoken text.
 * Handles Marathi, Hindi, and English spoken patterns for precision farming.
 */

export const DISTRICT_VOICE_MAP = {
  // Ahmednagar / Ahilyanagar
  "अहमदनगर": "AHMEDNAGAR", "अहिल्यानगर": "AHMEDNAGAR", "ahmednagar": "AHMEDNAGAR", "ahilyanagar": "AHMEDNAGAR",
  // Akola
  "अकोला": "AKOLA", "akola": "AKOLA",
  // Amravati
  "अमरावती": "AMRAVATI", "amravati": "AMRAVATI",
  // Aurangabad / Chhatrapati Sambhajinagar
  "औरंगाबाद": "AURANGABAD", "छत्रपती संभाजीनगर": "AURANGABAD", "छत्रपति संभाजीनगर": "AURANGABAD", "संभाजीनगर": "AURANGABAD", "aurangabad": "AURANGABAD", "sambhaji nagar": "AURANGABAD", "sambhajinagar": "AURANGABAD",
  // Beed
  "बीड": "BEED", "beed": "BEED", "bid": "BEED",
  // Bhandara
  "भंडारा": "BHANDARA", "bhandara": "BHANDARA",
  // Buldhana
  "बुलढाणा": "BULDHANA", "बुलढ़ाना": "BULDHANA", "buldhana": "BULDHANA",
  // Chandrapur
  "चंद्रपूर": "CHANDRAPUR", "chandrapur": "CHANDRAPUR",
  // Dhule
  "धुळे": "DHULE", "dhule": "DHULE",
  // Gadchiroli
  "गडचिरोली": "GADCHIROLI", "gadchiroli": "GADCHIROLI",
  // Gondia
  "गोंदिया": "GONDIA", "gondia": "GONDIA",
  // Hingoli
  "हिंगोली": "HINGOLI", "hingoli": "HINGOLI",
  // Jalgaon
  "जळगाव": "JALGAON", "जलगांव": "JALGAON", "jalgaon": "JALGAON",
  // Jalna
  "जालना": "JALNA", "jalna": "JALNA",
  // Kolhapur
  "कोल्हापूर": "KOLHAPUR", "कोल्हापुर": "KOLHAPUR", "kolhapur": "KOLHAPUR",
  // Latur
  "लातूर": "LATUR", "लातुर": "LATUR", "latur": "LATUR",
  // Mumbai
  "मुंबई": "MUMBAI", "mumbai": "MUMBAI", "बॉम्बे": "MUMBAI", "bombay": "MUMBAI",
  // Nagpur
  "नागपूर": "NAGPUR", "नागपुर": "NAGPUR", "nagpur": "NAGPUR",
  // Nanded
  "नांदेड": "NANDED", "नांदेड़": "NANDED", "nanded": "NANDED",
  // Nandurbar
  "नंदुरबार": "NANDURBAR", "nandurbar": "NANDURBAR",
  // Nashik
  "नाशिक": "NASHIK", "नासिक": "NASHIK", "nashik": "NASHIK",
  // Osmanabad / Dharashiv
  "उस्मानाबाद": "OSMANABAD", "धाराशिव": "OSMANABAD", "osmanabad": "OSMANABAD", "dharashiv": "OSMANABAD",
  // Palghar
  "पालघर": "PALGHAR", "palghar": "PALGHAR",
  // Parbhani
  "परभणी": "PARBHANI", "parbhani": "PARBHANI",
  // Pune
  "पुणे": "PUNE", "pune": "PUNE",
  // Raigad
  "रायगड": "RAIGAD", "raigad": "RAIGAD",
  // Ratnagiri
  "रत्नागिरी": "RATNAGIRI", "ratnagiri": "RATNAGIRI",
  // Sangli
  "सांगली": "SANGLI", "sangli": "SANGLI",
  // Satara
  "सातारा": "SATARA", "satara": "SATARA",
  // Sindhudurg
  "सिंधुदुर्ग": "SINDHUDURG", "sindhudurg": "SINDHUDURG",
  // Solapur
  "सोलापूर": "SOLAPUR", "सोलापुर": "SOLAPUR", "solapur": "SOLAPUR",
  // Thane
  "ठाणे": "THANE", "thane": "THANE",
  // Wardha
  "वर्धा": "WARDHA", "wardha": "WARDHA",
  // Washim
  "वाशिम": "WASHIM", "washim": "WASHIM",
  // Yavatmal
  "यवतमाळ": "YAVATMAL", "यवतमाल": "YAVATMAL", "yavatmal": "YAVATMAL",
};

export const CROP_VOICE_MAP = {
  // 7 Primary Crops of Crop Productivity Prediction
  "सोयाबीन": "Soybean", "soybean": "Soybean", "soya": "Soybean", "सोया": "Soybean",
  "कापूस": "Cotton", "कपास": "Cotton", "cotton": "Cotton", "kapas": "Cotton",
  "गहू": "Wheat", "गेहूं": "Wheat", "wheat": "Wheat", "gehu": "Wheat",
  "ऊस": "Sugarcane", "गन्ना": "Sugarcane", "sugarcane": "Sugarcane", "ganna": "Sugarcane",
  "भात": "Rice", "तांदूळ": "Rice", "चावल": "Rice", "धान": "Rice", "rice": "Rice", "dhan": "Rice", "chawal": "Rice",
  "हरभरा": "Gram", "चना": "Gram", "gram": "Gram", "chana": "Gram", "chickpea": "Gram",
  "तूर": "Tur", "अरहर": "Tur", "tur": "Tur", "toor": "Tur", "arhar": "Tur",

  // Other Common Crops
  "मका": "Maize", "मक्का": "Maize", "maize": "Maize", "corn": "Maize",
  "ताग": "Jute", "जूट": "Jute", "jute": "Jute",
  "ज्वारी": "Jowar", "ज्वार": "Jowar", "jowar": "Jowar",
  "बाजरी": "Bajra", "बाजरा": "Bajra", "bajra": "Bajra",
  "भुईमूग": "Groundnut", "मूंगफली": "Groundnut", "groundnut": "Groundnut",
  "संत्रे": "Orange", "संतरा": "Orange", "orange": "Orange",
};

export const WORD_NUMBER_MAP = {
  // English words
  "zero": 0, "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
  "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
  "eleven": 11, "twelve": 12, "thirteen": 13, "fourteen": 14, "fifteen": 15,
  "sixteen": 16, "seventeen": 17, "eighteen": 18, "nineteen": 19, "twenty": 20,
  "twenty five": 25, "thirty": 30, "thirty two": 32, "thirty five": 35,
  "forty": 40, "forty five": 45, "fifty": 50, "sixty": 60, "seventy": 70,
  "eighty": 80, "ninety": 90, "hundred": 100, "one hundred": 100,

  // Marathi words
  "शून्य": 0, "एक": 1, "दोन": 2, "तीन": 3, "चार": 4, "पाच": 5,
  "सहा": 6, "सात": 7, "आठ": 8, "नऊ": 9, "दहा": 10,
  "अकरा": 11, "बारा": 12, "तेरा": 13, "चौदा": 14, "पंधरा": 15,
  "सोळा": 16, "सतरा": 17, "अठरा": 18, "एकोणीस": 19, "एकूणवीस": 19, "वीस": 20,
  "पंचवीस": 25, "तीस": 30, "बत्तीस": 32, "पस्तीस": 35,
  "चाळीस": 40, "पंचेचाळीस": 45, "पन्नास": 50, "साठ": 60, "सत्तर": 70,
  "ऐंशी": 80, "नव्वद": 90, "शंभर": 100,

  // Hindi words
  "दो": 2, "पांच": 5, "छह": 6, "नौ": 9, "दस": 10,
  "ग्यारह": 11, "बारह": 12, "तेरह": 13, "चौदह": 14, "पंद्रह": 15,
  "सोलह": 16, "सत्रह": 17, "अठारह": 18, "उन्नीस": 19, "बीस": 20,
  "पच्चीस": 25, "पैंतीस": 35, "चालीस": 40, "पैंतालीस": 45, "पचास": 50, "सौ": 100,
};

/**
 * Converts numbers in Marathi/Hindi digits (०-९) to ASCII digits (0-9)
 */
export function convertDevanagariDigits(str) {
  if (!str) return "";
  const devanagariDigits = "०१२३४५६७८९";
  return String(str).replace(/[०-९]/g, (d) => devanagariDigits.indexOf(d));
}

/**
 * Parses spoken text for a district name
 */
export function parseSpokenDistrict(text) {
  if (!text) return null;
  const clean = text.toLowerCase().trim();

  for (const [key, value] of Object.entries(DISTRICT_VOICE_MAP)) {
    if (clean.includes(key.toLowerCase())) {
      return value;
    }
  }
  return null;
}

/**
 * Parses spoken text for a crop name
 */
export function parseSpokenCrop(text) {
  if (!text) return null;
  const clean = text.toLowerCase().trim();

  for (const [key, value] of Object.entries(CROP_VOICE_MAP)) {
    if (clean.includes(key.toLowerCase())) {
      return value;
    }
  }
  return null;
}

/**
 * Parses spoken text for a season (Kharif, Rabi, Summer)
 */
export function parseSpokenSeason(text) {
  if (!text) return null;
  const clean = text.toLowerCase().trim();
  if (clean.includes("kharif") || clean.includes("खरीप") || clean.includes("खरीफ")) {
    return "Kharif";
  }
  if (clean.includes("rabi") || clean.includes("रब्बी") || clean.includes("रबी")) {
    return "Rabi";
  }
  if (clean.includes("summer") || clean.includes("उन्हाळी") || clean.includes("जायद") || clean.includes("उन्हाळा") || clean.includes("गरवा")) {
    return "Summer";
  }
  return null;
}

/**
 * Parses spoken text for a crop year (2022 - 2026)
 */
export function parseSpokenYear(text) {
  if (!text) return null;
  const clean = convertDevanagariDigits(text);
  const m = clean.match(/\b(202[2-6])\b/);
  if (m) return m[1];
  return null;
}

/**
 * Extracts a numeric value from spoken text.
 * Handles digits ("5", "10.5"), Devanagari digits ("५", "१०"), and spoken word numbers ("पाच", "ten").
 */
export function extractSpokenNumber(text) {
  if (!text) return null;
  const clean = convertDevanagariDigits(String(text).toLowerCase().trim());

  // 1. Direct digit match (e.g. "10", "5.5", "850")
  const numMatch = clean.match(/(\d+(?:\.\d+)?)/);
  if (numMatch) {
    return numMatch[1];
  }

  // 2. Word matching
  for (const [word, val] of Object.entries(WORD_NUMBER_MAP)) {
    const regex = new RegExp(`(?:^|\\s|[.,])${word}(?:\\s|[.,]|$)`, "i");
    if (regex.test(clean)) {
      return String(val);
    }
  }

  return null;
}

/**
 * Parses spoken text to extract soil nutrient values (N, P, K, pH, rainfall, temp, humidity)
 */
export function parseSpokenSoilData(transcript) {
  if (!transcript) return {};
  const clean = convertDevanagariDigits(transcript.toLowerCase());
  const data = {};

  // Extract Nitrogen: "नाइट्रोजन 50" OR "50 नाइट्रोजन"
  const nMatch = clean.match(/(?:nitrogen|नायट्रोजन|नाइट्रोजन|n|एन)\s*[:=]?\s*(\d+(?:\.\d+)?)/i) ||
                 clean.match(/(\d+(?:\.\d+)?)\s*(?:kg\/ha|किलो)?\s*(?:nitrogen|नायट्रोजन|नाइट्रोजन)/i);
  if (nMatch) data.nitrogen = nMatch[1];

  // Extract Phosphorus: "फॉस्फरस 30" OR "30 फॉस्फरस"
  const pMatch = clean.match(/(?:phosphorus|फॉस्फरस|फास्फोरस|p|पी)\s*[:=]?\s*(\d+(?:\.\d+)?)/i) ||
                 clean.match(/(\d+(?:\.\d+)?)\s*(?:kg\/ha|किलो)?\s*(?:phosphorus|फॉस्फरस|फास्फोरस)/i);
  if (pMatch) data.phosphorus = pMatch[1];

  // Extract Potassium: "पोटॅशियम 40" OR "40 पोटॅशियम"
  const kMatch = clean.match(/(?:potassium|पोटॅशियम|पोटाश|k|के)\s*[:=]?\s*(\d+(?:\.\d+)?)/i) ||
                 clean.match(/(\d+(?:\.\d+)?)\s*(?:kg\/ha|किलो)?\s*(?:potassium|पोटॅशियम|पोटाश)/i);
  if (kMatch) data.potassium = kMatch[1];

  // Extract pH: "सामू 6.5" OR "6.5 सामू"
  const phMatch = clean.match(/(?:ph|सामू|पीएच)\s*[:=]?\s*(\d+(?:\.\d+)?)/i) ||
                  clean.match(/(\d+(?:\.\d+)?)\s*(?:ph|सामू|पीएच)/i);
  if (phMatch) data.ph = phMatch[1];

  // Extract Rainfall: "पाऊस 120" OR "120 मिमी पाऊस"
  const rainMatch = clean.match(/(?:rainfall|rain|पाऊस|वर्षा|बारिश)\s*[:=]?\s*(\d+(?:\.\d+)?)/i) ||
                    clean.match(/(\d+(?:\.\d+)?)\s*(?:mm|मिमी|पाऊस|वर्षा|बारिश)/i);
  if (rainMatch) data.rainfall = rainMatch[1];

  // Extract Temperature: "तापमान 28" OR "28 अंश"
  const tempMatch = clean.match(/(?:temperature|temp|तापमान|तास)\s*[:=]?\s*(\d+(?:\.\d+)?)/i) ||
                    clean.match(/(\d+(?:\.\d+)?)\s*(?:degree|अंश|डिग्री|°c|सेल्सिअस)/i);
  if (tempMatch) data.temperature = tempMatch[1];

  // Extract Humidity: "आर्द्रता 70" OR "70 टक्के आर्द्रता"
  const humMatch = clean.match(/(?:humidity|आर्द्रता|नमी)\s*[:=]?\s*(\d+(?:\.\d+)?)/i) ||
                   clean.match(/(\d+(?:\.\d+)?)\s*(?:%|टक्के)?\s*(?:humidity|आर्द्रता|नमी)/i);
  if (humMatch) data.humidity = humMatch[1];

  return data;
}

/**
 * Parses spoken text for Yield prediction parameters
 */
export function parseSpokenYieldData(transcript) {
  if (!transcript) return {};
  const clean = convertDevanagariDigits(transcript.toLowerCase());
  const data = {};

  const district = parseSpokenDistrict(clean);
  if (district) data.district = district;

  const crop = parseSpokenCrop(clean);
  if (crop) data.crop = crop;

  const season = parseSpokenSeason(clean);
  if (season) data.season = season;

  const year = parseSpokenYear(clean);
  if (year) data.year = year;

  // Area: "क्षेत्रफळ ५", "५ हेक्टर", "10 acres", "area 5"
  const areaMatch = clean.match(/(?:area|क्षेत्रफळ|क्षेत्र|एकर|एकड़|हेक्टर|hectare|acres?)\s*[:=]?\s*(\d+(?:\.\d+)?)/i) ||
                    clean.match(/(\d+(?:\.\d+)?)\s*(?:हेक्टर|एकड़|एकर|hectares?|acres?)/i);
  if (areaMatch) data.area = areaMatch[1];

  // Rainfall: "पाऊस ८५०", "८५० मिमी", "rainfall 650", "850 mm"
  const rainMatch = clean.match(/(?:rainfall|rain|पाऊस|वर्षा|बारिश)\s*[:=]?\s*(\d+(?:\.\d+)?)/i) ||
                    clean.match(/(\d+(?:\.\d+)?)\s*(?:mm|मिमी|पाऊस|वर्षा|बारिश)/i);
  if (rainMatch) data.rainfall = rainMatch[1];

  // Temperature: "तापमान ३२", "३२ अंश", "temp 30", "32 degree"
  const tempMatch = clean.match(/(?:temperature|temp|तापमान|तास)\s*[:=]?\s*(\d+(?:\.\d+)?)/i) ||
                    clean.match(/(\d+(?:\.\d+)?)\s*(?:degree|अंश|डिग्री|°c|सेल्सिअस)/i);
  if (tempMatch) data.temperature = tempMatch[1];

  // Positional fallback for unassigned numbers (e.g. "सोयाबीन अमरावती खरीप ५ ६५० ३२")
  const allNumbers = clean.match(/\b\d+(?:\.\d+)?\b/g);
  if (allNumbers && allNumbers.length > 0) {
    const unassigned = allNumbers.filter(
      (n) => n !== data.area && n !== data.rainfall && n !== data.temperature && n !== data.year
    );
    for (const numStr of unassigned) {
      const val = parseFloat(numStr);
      if (val >= 200 && val <= 4000 && !data.rainfall) {
        data.rainfall = String(val);
      } else if (val >= 10 && val <= 50 && !data.temperature) {
        data.temperature = String(val);
      } else if (val >= 0.1 && val <= 100 && !data.area) {
        data.area = String(val);
      }
    }
  }

  return data;
}
