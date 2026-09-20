/**
 * KrushiMitra WhatsApp Advisory Sharing Utility
 * Formats high-impact, emoji-rich agricultural advisories for 1-click sharing
 * to farmer WhatsApp groups and family.
 */

export const openWhatsAppShare = (text) => {
  if (!text) return;
  const cleanText = text.trim();
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(cleanText)}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

/**
 * Format Live District Weather & 5-Day Agro Forecast
 */
export const formatWeatherShareText = ({
  district = "Maharashtra",
  temp = "--",
  condition = "Partly Cloudy",
  humidity = "--",
  wind = "--",
  rainChance = "--",
  advisory = "",
  lang = "mr",
}) => {
  if (lang === "mr") {
    return `🌦️ *कृषीमित्र दैनिक हवामान सल्ला — ${district} जिल्हा*
━━━━━━━━━━━━━━━━━━━━
🌡️ *तापमान:* ${temp}°C | *स्थिती:* ${condition}
💧 *हवेतील आर्द्रता:* ${humidity}%
🌧️ *पावसाची शक्यता:* ${rainChance}%
💨 *वाऱ्याचा वेग:* ${wind} किमी/तास

🌾 *शेतकरी कृषी सल्ला:*
${advisory || "पिकांची नियमित पाहणी करा व बाष्पीभवनाचा वेग तपासून पाणी व्यवस्थापन ठेवा."}

🌱 *कृषीमित्र — शेतकऱ्यांचा डिजिटल मित्र*`;
  }

  if (lang === "hi") {
    return `🌦️ *कृषि-मित्र दैनिक मौसम सलाह — ${district} जिला*
━━━━━━━━━━━━━━━━━━━━
🌡️ *तापमान:* ${temp}°C | *मौसम:* ${condition}
💧 *हवा में नमी:* ${humidity}%
🌧️ *बारिश की संभावना:* ${rainChance}%
💨 *हवा की गति:* ${wind} किमी/घंटा

🌾 *किसान कृषि सलाह:*
${advisory || "फसल की नियमित निगरानी रखें और नमी के अनुसार सिंचाई करें।"}

🌱 *कृषि-मित्र — किसानों का डिजिटल साथी*`;
  }

  return `🌦️ *KrushiMitra Daily Agro-Weather Advisory — ${district}*
━━━━━━━━━━━━━━━━━━━━
🌡️ *Temperature:* ${temp}°C | *Condition:* ${condition}
💧 *Humidity:* ${humidity}%
🌧️ *Rain Probability:* ${rainChance}%
💨 *Wind Speed:* ${wind} km/h

🌾 *Agronomy Advisory:*
${advisory || "Monitor soil moisture levels and adjust spray schedules accordingly."}

🌱 *KrushiMitra — Farmer's Digital Companion*`;
};

/**
 * Format AI Crop & Soil Nutrient Recommendation
 */
export const formatRecommendationShareText = ({
  crop = "Soybean",
  nitrogen = "--",
  phosphorus = "--",
  potassium = "--",
  ph = "--",
  confidence = 94,
  advisory = "",
  lang = "mr",
}) => {
  if (lang === "mr") {
    return `🌱 *कृषीमित्र एआय माती व पीक शिफारस अहवाल*
━━━━━━━━━━━━━━━━━━━━
🌾 *शिफारस केलेले पीक:* *${crop}* (अचूकता: ${confidence}%)
🧪 *माती विश्लेषण नोंदी:*
 • नत्र (N): ${nitrogen} kg/ha
 • स्फुरद (P): ${phosphorus} kg/ha
 • पालाश (K): ${potassium} kg/ha
 • सामू (pH): ${ph}

💡 *खत व शेती सल्ला:*
${advisory || "सेंद्रिय खतांचा वापर वाढवा व माती परीक्षणाच्या आधारे खतांची विभागून मात्रा द्या."}

🌱 *कृषीमित्र — शेतकऱ्यांचा डिजिटल मित्र*`;
  }

  if (lang === "hi") {
    return `🌱 *कृषि-मित्र एआई मृदा एवं फसल सिफारिश रिपोर्ट*
━━━━━━━━━━━━━━━━━━━━
🌾 *सर्वोत्तम अनुशंसित फसल:* *${crop}* (सटीकता: ${confidence}%)
🧪 *मिट्टी पोषक तत्व:*
 • नाइट्रोजन (N): ${nitrogen} kg/ha
 • फास्फोरस (P): ${phosphorus} kg/ha
 • पोटाश (K): ${potassium} kg/ha
 • पीएच (pH): ${ph}

💡 *उर्वरक एवं कृषि सलाह:*
${advisory || "जैविक खादों का प्रयोग बढ़ाएं और मिट्टी रिपोर्ट अनुसार उर्वरक दें।"}

🌱 *कृषि-मित्र — किसानों का डिजिटल साथी*`;
  }

  return `🌱 *KrushiMitra AI Soil & Crop Advisory Report*
━━━━━━━━━━━━━━━━━━━━
🌾 *Optimal Recommended Crop:* *${crop}* (${confidence}% Confidence)
🧪 *Soil Chemistry:*
 • Nitrogen (N): ${nitrogen} kg/ha
 • Phosphorus (P): ${phosphorus} kg/ha
 • Potassium (K): ${potassium} kg/ha
 • Soil pH: ${ph}

💡 *Agronomist Guidance:*
${advisory || "Apply balanced fertilizers in split applications based on soil fertility tests."}

🌱 *KrushiMitra — Farmer's Digital Companion*`;
};

/**
 * Format Crop Yield Prediction Harvest Report
 */
export const formatPredictionShareText = ({
  crop = "Cotton",
  district = "Pune",
  season = "Kharif",
  area = 1,
  areaUnit = "Acres",
  predictedYield = "--",
  totalProduction = "--",
  lang = "mr",
}) => {
  if (lang === "mr") {
    return `📊 *कृषीमित्र पीक उत्पादन अंदाज अहवाल*
━━━━━━━━━━━━━━━━━━━━
🌾 *पीक:* ${crop} | *जिल्हा:* ${district}
🗓️ *हंगाम:* ${season} | *क्षेत्र:* ${area} ${areaUnit}
📈 *अंदाजित उत्पादकता:* *${predictedYield} टन/हेक्टर*
💰 *एकूण अंदाजित उत्पादन:* *~${totalProduction} क्विंटल*

🌱 *कृषीमित्र — शेतकऱ्यांचा डिजिटल मित्र*`;
  }

  if (lang === "hi") {
    return `📊 *कृषि-मित्र फसल उत्पादन पूर्वानुमान रिपोर्ट*
━━━━━━━━━━━━━━━━━━━━
🌾 *फसल:* ${crop} | *जिला:* ${district}
🗓️ *मौसम:* ${season} | *रकबा:* ${area} ${areaUnit}
📈 *अनुमानित पैदावार:* *${predictedYield} टन/हेक्टेयर*
💰 *कुल अनुमानित उत्पादन:* *~${totalProduction} क्विंटल*

🌱 *कृषि-मित्र — किसानों का डिजिटल साथी*`;
  }

  return `📊 *KrushiMitra Harvest Yield Forecast Report*
━━━━━━━━━━━━━━━━━━━━
🌾 *Crop:* ${crop} | *District:* ${district}
🗓️ *Season:* ${season} | *Farmland Area:* ${area} ${areaUnit}
📈 *Predicted Yield:* *${predictedYield} tonnes/hectare*
💰 *Estimated Production:* *~${totalProduction} quintals*

🌱 *KrushiMitra — Farmer's Digital Companion*`;
};

/**
 * Format AI Plant Doctor Leaf Disease Diagnosis & Spray Dosage
 */
export const formatPlantDoctorShareText = ({
  crop = "Tomato",
  disease = "Early Blight",
  condition = "Diseased",
  dosage15l = "30 gm Mancozeb 75% WP",
  organic15l = "50 ml Neem Oil 10,000 PPM",
  safety = "Wear protective mask and gloves while spraying.",
  lang = "mr",
}) => {
  if (condition === "Healthy") {
    if (lang === "mr") {
      return `🌿 *कृषीमित्र पीक डॉक्टर तपासणी अहवाल*
━━━━━━━━━━━━━━━━━━━━
🌾 *पीक:* ${crop}
✅ *स्थिती:* *निरोगी पीक (Healthy Plant)* — कोणत्याही रोगाची लागण नाही!
🌱 *सल्ला:* पिकाची रोगप्रतिकारक शक्ती कायम ठेवण्यासाठी संतुलित १९:१९:१९ व सूक्ष्मअन्नद्रव्ये फवारा.

🌱 *कृषीमित्र — शेतकऱ्यांचा डिजिटल मित्र*`;
    }
    if (lang === "hi") {
      return `🌿 *कृषि-मित्र फसल डॉक्टर जांच रिपोर्ट*
━━━━━━━━━━━━━━━━━━━━
🌾 *फसल:* ${crop}
✅ *स्थिति:* *स्वस्थ फसल (Healthy Plant)* — किसी रोग का प्रभाव नहीं!
🌱 *सलाह:* फसल की रोग प्रतिरोधक क्षमता बनाए रखने हेतु संतुलित १९:१९:१९ व सूक्ष्म पोषक तत्वों का छिड़काव करें।

🌱 *कृषि-मित्र — किसानों का डिजिटल साथी*`;
    }
    return `🌿 *KrushiMitra Plant Doctor Inspection Report*
━━━━━━━━━━━━━━━━━━━━
🌾 *Crop:* ${crop}
✅ *Status:* *Healthy Plant* — No visible diseases detected!
🌱 *Advice:* Maintain balanced foliar nutrition and scout fields regularly.

🌱 *KrushiMitra — Farmer's Digital Companion*`;
  }

  if (lang === "mr") {
    return `🌿 *कृषीमित्र एआय पीक डॉक्टर — रोग निदान व फवारणी सल्ला*
━━━━━━━━━━━━━━━━━━━━
🌾 *पीक:* ${crop}
⚠️ *आढळलेला रोग:* *${disease}*

💧 *१५ लिटर नॅपसॅक पंपाचे अचूक प्रमाण:*
 • 🧪 *रासायनिक फवारणी:* ${dosage15l}
 • 🌱 *सेंद्रिय/जैविक उपाय:* ${organic15l}

🛡️ *सुरक्षा काळजी:*
${safety}

🌱 *कृषीमित्र — शेतकऱ्यांचा डिजिटल मित्र*`;
  }

  if (lang === "hi") {
    return `🌿 *कृषि-मित्र एआई फसल डॉक्टर — रोग पहचान एवं स्प्रे खुराक*
━━━━━━━━━━━━━━━━━━━━
🌾 *फसल:* ${crop}
⚠️ *पहचाना गया रोग:* *${disease}*

💧 *१५ लीटर स्प्रे पंप की सटीक खुराक:*
 • 🧪 *रासायनिक छिड़काव:* ${dosage15l}
 • 🌱 *जैविक उपचार:* ${organic15l}

🛡️ *सुरक्षा निर्देश:*
${safety}

🌱 *कृषि-मित्र — किसानों का डिजिटल साथी*`;
  }

  return `🌿 *KrushiMitra AI Plant Doctor — Diagnosis & Spray Guide*
━━━━━━━━━━━━━━━━━━━━
🌾 *Crop:* ${crop}
⚠️ *Condition Detected:* *${disease}*

💧 *Exact Spray Pump Dosage (per 15L Knapsack Pump):*
 • 🧪 *Chemical Spray:* ${dosage15l}
 • 🌱 *Eco-friendly / Organic:* ${organic15l}

🛡️ *Safety Instruction:*
${safety}

🌱 *KrushiMitra — Farmer's Digital Companion*`;
};

/**
 * Format Government Agricultural Scheme Alert
 */
export const formatSchemeShareText = ({
  name = "PM-Kisan Samman Nidhi",
  subsidy = "₹6,000 / year",
  benefits = [],
  documents = [],
  applyUrl = "https://mahadbt.maharashtra.gov.in",
  lang = "mr",
}) => {
  const topBenefit = benefits[0] || "थेट शेतकरी खात्यात अनुदान";
  const docsText = documents.slice(0, 3).join(", ");

  if (lang === "mr") {
    return `🏛️ *कृषीमित्र शासकीय योजना अलर्ट — शेतकरी मित्रांसाठी महत्त्वाची माहिती*
━━━━━━━━━━━━━━━━━━━━
📜 *योजनेचे नाव:* *${name}*
💰 *अनुदान / लाभ:* *${subsidy}*

⭐ *मुख्य लाभ:*
${topBenefit}

📑 *आवश्यक कागदपत्रे:*
${docsText}

🌐 *अधिकृत अर्ज करण्यासाठी येथे क्लिक करा:*
${applyUrl}`;
  }

  if (lang === "hi") {
    return `🏛️ *कृषि-मित्र सरकारी योजना अलर्ट — किसान भाइयों के लिए विशेष सूचना*
━━━━━━━━━━━━━━━━━━━━
📜 *योजना का नाम:* *${name}*
💰 *सब्सिडी / लाभ:* *${subsidy}*

⭐ *प्रमुख लाभ:*
${topBenefit}

📑 *आवश्यक दस्तावेज:*
${docsText}

🌐 *आधिकारिक पोर्टल से आवेदन करें:*
${applyUrl}`;
  }

  return `🏛️ *KrushiMitra Govt Scheme Alert — Important Subsidy Information*
━━━━━━━━━━━━━━━━━━━━
📜 *Scheme:* *${name}*
💰 *Subsidy / Grant:* *${subsidy}*

⭐ *Key Benefit:*
${topBenefit}

📑 *Required Documents:*
${docsText}

🌐 *Official Application Link:*
${applyUrl}`;
};
