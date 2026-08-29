/**
 * Voice Parser utility to extract structured agricultural data from spoken text.
 * Handles Marathi, Hindi, and English spoken patterns.
 */

const DISTRICT_VOICE_MAP = {
  // Marathi & Hindi to English
  "अमरावती": "Amravati",
  "amravati": "Amravati",
  "पुणे": "Pune",
  "pune": "Pune",
  "नागपूर": "Nagpur",
  "नागपुर": "Nagpur",
  "nagpur": "Nagpur",
  "नाशिक": "Nashik",
  "नासिक": "Nashik",
  "nashik": "Nashik",
  "कोल्हापूर": "Kolhapur",
  "कोल्हापुर": "Kolhapur",
  "kolhapur": "Kolhapur",
  "सोलापूर": "Solapur",
  "सोलापुर": "Solapur",
  "solapur": "Solapur",
  "औरंगाबाद": "Aurangabad",
  "aurangabad": "Aurangabad",
  "छत्रपती संभाजीनगर": "Aurangabad",
  "छत्रपति संभाजीनगर": "Aurangabad",
  "संभाजीनगर": "Aurangabad",
  "अहमदनगर": "Ahmednagar",
  "ahmednagar": "Ahmednagar",
  "अहिल्यानगर": "Ahmednagar",
  "लातूर": "Latur",
  "लातुर": "Latur",
  "latur": "Latur",
  "सातारा": "Satara",
  "satara": "Satara",
  "सांगली": "Sangli",
  "sangli": "Sangli",
  "ठाणे": "Thane",
  "thane": "Thane",
  "जळगाव": "Jalgaon",
  "जलगांव": "Jalgaon",
  "jalgaon": "Jalgaon",
  "नांदेड": "Nanded",
  "नांदेड़": "Nanded",
  "nanded": "Nanded",
  "अकोला": "Akola",
  "akola": "Akola",
  "बुलढाणा": "Buldhana",
  "बुलढ़ाना": "Buldhana",
  "buldhana": "Buldhana",
  "बीड": "Beed",
  "beed": "Beed",
  "चंद्रपूर": "Chandrapur",
  "chandrapur": "Chandrapur",
  "धुळे": "Dhule",
  "dhule": "Dhule",
  "गडचिरोली": "Gadchiroli",
  "gadchiroli": "Gadchiroli",
  "गोंदिया": "Gondia",
  "gondia": "Gondia",
  "हिंगोली": "Hingoli",
  "hingoli": "Hingoli",
  "जालना": "Jalna",
  "jalna": "Jalna",
  "नंदुरबार": "Nandurbar",
  "nandurbar": "Nandurbar",
  "उस्मानाबाद": "Osmanabad",
  "धाराशिव": "Osmanabad",
  "osmanabad": "Osmanabad",
  "पालघर": "Palghar",
  "palghar": "Palghar",
  "परभणी": "Parbhani",
  "parbhani": "Parbhani",
  "रायगड": "Raigad",
  "raigad": "Raigad",
  "रत्नागिरी": "Ratnagiri",
  "ratnagiri": "Ratnagiri",
  "सिंधुदुर्ग": "Sindhudurg",
  "sindhudurg": "Sindhudurg",
  "वर्धा": "Wardha",
  "wardha": "Wardha",
  "वाशिम": "Washim",
  "washim": "Washim",
  "यवतमाळ": "Yavatmal",
  "यवतमाल": "Yavatmal",
  "yavatmal": "Yavatmal",
};

const CROP_VOICE_MAP = {
  "सोयाबीन": "Soybean",
  "soybean": "Soybean",
  "कापूस": "Cotton",
  "कपास": "Cotton",
  "cotton": "Cotton",
  "गहू": "Wheat",
  "गेहूं": "Wheat",
  "wheat": "Wheat",
  "ऊस": "Sugarcane",
  "गन्ना": "Sugarcane",
  "sugarcane": "Sugarcane",
  "मका": "Maize",
  "मक्का": "Maize",
  "maize": "Maize",
  "ताग": "Jute",
  "जूट": "Jute",
  "jute": "Jute",
  "भात": "Rice",
  "तांदूळ": "Rice",
  "चावल": "Rice",
  "धान": "Rice",
  "rice": "Rice",
  "हरभरा": "Gram",
  "चना": "Gram",
  "gram": "Gram",
  "तूर": "Tur",
  "अरहर": "Tur",
  "tur": "Tur",
  "ज्वारी": "Jowar",
  "ज्वार": "Jowar",
  "jowar": "Jowar",
  "बाजरी": "Bajra",
  "बाजरा": "Bajra",
  "bajra": "Bajra",
  "भुईमूग": "Groundnut",
  "मूंगफली": "Groundnut",
  "groundnut": "Groundnut",
  "संत्रे": "Orange",
  "संतरा": "Orange",
  "orange": "Orange",
};

/**
 * Converts numbers in Marathi/Hindi digits (०-९) to ASCII digits (0-9)
 */
export function convertDevanagariDigits(str) {
  if (!str) return "";
  const devanagariDigits = "०१२३४५६७८९";
  return str.replace(/[०-९]/g, (d) => devanagariDigits.indexOf(d));
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
  return text.trim();
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
  return text.trim();
}

/**
 * Parses spoken text to extract soil nutrient values (N, P, K, pH, rainfall, temp, humidity)
 */
export function parseSpokenSoilData(transcript) {
  if (!transcript) return {};
  const clean = convertDevanagariDigits(transcript.toLowerCase());
  const data = {};

  // Extract Nitrogen
  const nMatch = clean.match(/(?:nitrogen|नायट्रोजन|नाइट्रोजन|n|एन)[\s:=]*(\d+(\.\d+)?)/i);
  if (nMatch) data.nitrogen = nMatch[1];

  // Extract Phosphorus
  const pMatch = clean.match(/(?:phosphorus|फॉस्फरस|फास्फोरस|p|पी)[\s:=]*(\d+(\.\d+)?)/i);
  if (pMatch) data.phosphorus = pMatch[1];

  // Extract Potassium
  const kMatch = clean.match(/(?:potassium|पोटॅशियम|पोटाश|k|के)[\s:=]*(\d+(\.\d+)?)/i);
  if (kMatch) data.potassium = kMatch[1];

  // Extract pH
  const phMatch = clean.match(/(?:ph|सामू|पीएच)[\s:=]*(\d+(\.\d+)?)/i);
  if (phMatch) data.ph = phMatch[1];

  // Extract Rainfall
  const rainMatch = clean.match(/(?:rainfall|rain|पाऊस|वर्षा|बारिश)[\s:=]*(\d+(\.\d+)?)/i);
  if (rainMatch) data.rainfall = rainMatch[1];

  // Extract Temperature
  const tempMatch = clean.match(/(?:temperature|temp|तापमान|तास)[\s:=]*(\d+(\.\d+)?)/i);
  if (tempMatch) data.temperature = tempMatch[1];

  // Extract Humidity
  const humMatch = clean.match(/(?:humidity|आर्द्रता|नमी)[\s:=]*(\d+(\.\d+)?)/i);
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

  // Season
  if (clean.includes("kharif") || clean.includes("खरीप") || clean.includes("खरीफ")) {
    data.season = "Kharif";
  } else if (clean.includes("rabi") || clean.includes("रब्बी") || clean.includes("रबी")) {
    data.season = "Rabi";
  } else if (clean.includes("summer") || clean.includes("उन्हाळी") || clean.includes("जायद") || clean.includes("उन्हाळा")) {
    data.season = "Summer";
  }

  // Area
  const areaMatch = clean.match(/(?:area|क्षेत्रफळ|क्षेत्र|एकर|एकड़|हेक्टर|hectare|acres?)[\s:=]*(\d+(\.\d+)?)/i);
  if (areaMatch) data.area = areaMatch[1];

  // Rainfall
  const rainMatch = clean.match(/(?:rainfall|rain|पाऊस|वर्षा)[\s:=]*(\d+(\.\d+)?)/i);
  if (rainMatch) data.rainfall = rainMatch[1];

  // Temperature
  const tempMatch = clean.match(/(?:temperature|temp|तापमान)[\s:=]*(\d+(\.\d+)?)/i);
  if (tempMatch) data.temperature = tempMatch[1];

  return data;
}
