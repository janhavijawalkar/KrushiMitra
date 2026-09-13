import os
import re
import requests
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")

SYSTEM_PROMPT = """
You are "KrushiMitra AI" (कृषीमित्र AI), an intelligent agricultural scientist and dedicated platform assistant for Indian farmers, specialized in Maharashtra agriculture.

You have two core responsibilities:
1. AGRICULTURAL EXPERT (ChatGPT/Gemini for Farming):
   - Provide accurate, practical, eco-friendly farming advice for crops (Soybean, Cotton, Sugarcane, Wheat, Rice, Gram/Chana, Tur, Onion, Tomato, Grapes, Pomegranate, Maize, Chilli, etc.).
   - Diagnose pests and diseases, recommending Integrated Pest Management (IPM), biological controls (Trichoderma, Neem oil 10000 PPM, pheromone traps) and safe chemical dosage.
   - Advise on balanced plant nutrition (NPK, Nano Urea, compost, vermicompost, micronutrients Zinc/Boron).
   - Explain government schemes (PM-Kisan, PMFBY ₹1 crop insurance, Namo Shetkari, Magel Tyala Shettale, KUSUM solar pumps, drip subsidies).
   - Advise on irrigation (drip, sprinkler) and post-harvest storage.

2. KRUSHIMITRA PLATFORM ASSISTANT & NAVIGATOR:
   - You know all pages and features of the KrushiMitra website:
     * Crop Yield Prediction (/prediction): Predicts crop harvest productivity (t/ha) using Random Forest & XGBoost ML models. User inputs district, season, crop, area, rainfall, soil type.
     * Soil Health & Recommendation (/recommendation): Recommends optimal crops and fertilizer dosages based on N, P, K, pH, rainfall, temperature, humidity.
     * District Weather (/weather): Real-time live weather, rain probability, wind, humidity, and 5-day agro-forecast for all 36 Maharashtra districts.
     * Farm PDF Reports (/reports): Generates official, downloadable bilingual PDF reports for soil and crop plans.
     * Prediction History (/history): View past predictions and farm analytics.
     * Profile & Farmland (/profile): Manage farmer name, district, farm acreage.
     * Mobile App & APK Download: 1-click PWA Add to Home Screen and direct KrushiMitra.apk download.
     * Emergency Broadcast Advisories: Live emergency alerts from state agriculture officers.
     * Kisan Support Desk: Email krushimitra.project1@gmail.com and Kisan Helpline 1800-180-1551.

ACTION TRIGGER RULES:
- Whenever the user asks how to use, access, or navigate to a KrushiMitra feature, append a special tag at the very end of your response:
  [[ACTION:prediction]] -> for crop yield prediction
  [[ACTION:recommendation]] -> for soil health and crop recommendation
  [[ACTION:weather]] -> for weather and forecasts
  [[ACTION:reports]] -> for PDF reports
  [[ACTION:history]] -> for past history
  [[ACTION:download_app]] -> for downloading/installing the mobile app
  [[ACTION:profile]] -> for profile or farm settings
  [[ACTION:admin]] -> for admin panel

FORMATTING RULES:
- Respond in the language requested by the user: Marathi (मराठी), Hindi (हिन्दी), or English.
- Use clear markdown: bold important keywords, use bullet points, numbered steps, and relevant emojis.
- Be polite, encouraging, practical, and farmer-friendly.
"""

# =========================================================
# MAHARASHTRA DISTRICTS & CITIES MAP FOR WEATHER LOOKUP
# =========================================================

MAHARASHTRA_LOCATIONS = {
    "ahmednagar": {"name": "Ahmednagar", "lat": 19.0952, "lon": 74.7496, "mr": "अहमदनगर", "hi": "अहमदनगर"},
    "ahilyanagar": {"name": "Ahilyanagar (Ahmednagar)", "lat": 19.0952, "lon": 74.7496, "mr": "अहिल्यानगर (अहमदनगर)", "hi": "अहिल्यानगर"},
    "akola": {"name": "Akola", "lat": 20.7002, "lon": 77.0082, "mr": "अकोला", "hi": "अकोला"},
    "amravati": {"name": "Amravati", "lat": 20.9374, "lon": 77.7796, "mr": "अमरावती", "hi": "अमरावती"},
    "aurangabad": {"name": "Aurangabad", "lat": 19.8762, "lon": 75.3433, "mr": "छत्रपती संभाजीनगर (औरंगाबाद)", "hi": "छत्रपति संभाजीनगर (औरंगाबाद)"},
    "chhatrapati sambhajinagar": {"name": "Chhatrapati Sambhajinagar", "lat": 19.8762, "lon": 75.3433, "mr": "छत्रपती संभाजीनगर", "hi": "छत्रपति संभाजीनगर"},
    "sambhajinagar": {"name": "Chhatrapati Sambhajinagar", "lat": 19.8762, "lon": 75.3433, "mr": "छत्रपती संभाजीनगर", "hi": "छत्रपति संभाजीनगर"},
    "beed": {"name": "Beed", "lat": 18.9891, "lon": 75.7601, "mr": "बीड", "hi": "बीड"},
    "bhandara": {"name": "Bhandara", "lat": 21.1713, "lon": 79.6543, "mr": "भंडारा", "hi": "भंडारा"},
    "buldhana": {"name": "Buldhana", "lat": 20.5300, "lon": 76.1800, "mr": "बुलढाणा", "hi": "बुलढाणा"},
    "chandrapur": {"name": "Chandrapur", "lat": 19.9615, "lon": 79.2961, "mr": "चंद्रपूर", "hi": "चंद्रपुर"},
    "dhule": {"name": "Dhule", "lat": 20.9042, "lon": 74.7749, "mr": "धुळे", "hi": "धुले"},
    "gadchiroli": {"name": "Gadchiroli", "lat": 20.1849, "lon": 79.9948, "mr": "गडचिरोली", "hi": "गडचिरोली"},
    "gondia": {"name": "Gondia", "lat": 21.4598, "lon": 80.1961, "mr": "गोंदिया", "hi": "गोंदिया"},
    "hingoli": {"name": "Hingoli", "lat": 19.7196, "lon": 77.1481, "mr": "हिंगोली", "hi": "हिंगोली"},
    "jalgaon": {"name": "Jalgaon", "lat": 21.0077, "lon": 75.5626, "mr": "जळगाव", "hi": "जलगांव"},
    "jalna": {"name": "Jalna", "lat": 19.8410, "lon": 75.8864, "mr": "जालना", "hi": "जालना"},
    "kolhapur": {"name": "Kolhapur", "lat": 16.7050, "lon": 74.2433, "mr": "कोल्हापूर", "hi": "कोल्हापुर"},
    "latur": {"name": "Latur", "lat": 18.4088, "lon": 76.5604, "mr": "लातूर", "hi": "लातुर"},
    "mumbai": {"name": "Mumbai", "lat": 19.0760, "lon": 72.8777, "mr": "मुंबई", "hi": "मुंबई"},
    "nagpur": {"name": "Nagpur", "lat": 21.1458, "lon": 79.0882, "mr": "नागपूर", "hi": "नागपुर"},
    "nanded": {"name": "Nanded", "lat": 19.1383, "lon": 77.3210, "mr": "नांदेड", "hi": "नांदेड़"},
    "nandurbar": {"name": "Nandurbar", "lat": 21.3700, "lon": 74.2400, "mr": "नंदुरबार", "hi": "नंदुरबार"},
    "nashik": {"name": "Nashik", "lat": 19.9975, "lon": 73.7898, "mr": "नाशिक", "hi": "नासिक"},
    "osmanabad": {"name": "Osmanabad", "lat": 18.1856, "lon": 76.0419, "mr": "धाराशिव (उस्मानाबाद)", "hi": "धाराशिव (उस्मानाबाद)"},
    "dharashiv": {"name": "Dharashiv", "lat": 18.1856, "lon": 76.0419, "mr": "धाराशिव", "hi": "धाराशिव"},
    "palghar": {"name": "Palghar", "lat": 19.6967, "lon": 72.7699, "mr": "पालघर", "hi": "पालघर"},
    "parbhani": {"name": "Parbhani", "lat": 19.2686, "lon": 76.7708, "mr": "परभणी", "hi": "परभणी"},
    "pune": {"name": "Pune", "lat": 18.5204, "lon": 73.8567, "mr": "पुणे", "hi": "पुणे"},
    "raigad": {"name": "Raigad", "lat": 18.5158, "lon": 73.1822, "mr": "रायगड", "hi": "रायगड"},
    "alibag": {"name": "Alibag", "lat": 18.6414, "lon": 72.8722, "mr": "अलिबाग", "hi": "अलिबाग"},
    "ratnagiri": {"name": "Ratnagiri", "lat": 16.9902, "lon": 73.3120, "mr": "रत्नागिरी", "hi": "रत्नागिरी"},
    "sangli": {"name": "Sangli", "lat": 16.8524, "lon": 74.5815, "mr": "सांगली", "hi": "सांगली"},
    "satara": {"name": "Satara", "lat": 17.6805, "lon": 73.9997, "mr": "सातारा", "hi": "सातारा"},
    "sindhudurg": {"name": "Sindhudurg", "lat": 16.0354, "lon": 73.6933, "mr": "सिंधुदुर्ग", "hi": "सिंधुदुर्ग"},
    "solapur": {"name": "Solapur", "lat": 17.6599, "lon": 75.9064, "mr": "सोलापूर", "hi": "सोलापुर"},
    "thane": {"name": "Thane", "lat": 19.2183, "lon": 72.9781, "mr": "ठाणे", "hi": "ठाणे"},
    "wardha": {"name": "Wardha", "lat": 20.7453, "lon": 78.6022, "mr": "वर्धा", "hi": "वर्धा"},
    "washim": {"name": "Washim", "lat": 20.1098, "lon": 77.1350, "mr": "वाशिम", "hi": "वाशिम"},
    "yavatmal": {"name": "Yavatmal", "lat": 20.3888, "lon": 78.1204, "mr": "यवतमाळ", "hi": "यवतमाल"},
    "baramati": {"name": "Baramati", "lat": 18.1513, "lon": 74.5770, "mr": "बारामती", "hi": "बारामती"},
    "pandharpur": {"name": "Pandharpur", "lat": 17.6775, "lon": 75.3262, "mr": "पंढरपूर", "hi": "पंढरपुर"},
    "karad": {"name": "Karad", "lat": 17.2885, "lon": 74.1843, "mr": "कराड", "hi": "कराड"},
    "malegaon": {"name": "Malegaon", "lat": 20.5539, "lon": 74.5307, "mr": "मालेगाव", "hi": "मालेगांव"},
    "shirdi": {"name": "Shirdi", "lat": 19.7645, "lon": 74.4762, "mr": "शिर्डी", "hi": "शिर्डी"},
    "delhi": {"name": "Delhi", "lat": 28.6139, "lon": 77.2090, "mr": "नवी दिल्ली", "hi": "नई दिल्ली"},
    "bangalore": {"name": "Bangalore", "lat": 12.9716, "lon": 77.5946, "mr": "बंगळुरू", "hi": "बैंगलोर"},
    "hyderabad": {"name": "Hyderabad", "lat": 17.3850, "lon": 78.4867, "mr": "हैद्राबाद", "hi": "हैदराबाद"},
}

DEVANAGARI_CITY_MAP = {
    "अहमदनगर": "ahmednagar",
    "अहिल्यानगर": "ahilyanagar",
    "अकोला": "akola",
    "अमरावती": "amravati",
    "औरंगाबाद": "aurangabad",
    "संभाजीनगर": "chhatrapati sambhajinagar",
    "छत्रपती संभाजीनगर": "chhatrapati sambhajinagar",
    "छत्रपति संभाजीनगर": "chhatrapati sambhajinagar",
    "बीड": "beed",
    "भंडारा": "bhandara",
    "बुलढाणा": "buldhana",
    "बुलढ़ाना": "buldhana",
    "चंद्रपूर": "chandrapur",
    "चंद्रपुर": "chandrapur",
    "धुळे": "dhule",
    "धुले": "dhule",
    "गडचिरोली": "gadchiroli",
    "गोंदिया": "gondia",
    "हिंगोली": "hingoli",
    "जळगाव": "jalgaon",
    "जलगांव": "jalgaon",
    "जालना": "jalna",
    "कोल्हापूर": "kolhapur",
    "कोल्हापुर": "kolhapur",
    "लातूर": "latur",
    "लातुर": "latur",
    "मुंबई": "mumbai",
    "नागपूर": "nagpur",
    "नागपुर": "nagpur",
    "नांदेड": "nanded",
    "नांदेड़": "nanded",
    "नंदुरबार": "nandurbar",
    "नाशिक": "nashik",
    "नासिक": "nashik",
    "उस्मानाबाद": "osmanabad",
    "धाराशिव": "dharashiv",
    "पालघर": "palghar",
    "परभणी": "parbhani",
    "पुणे": "pune",
    "पुण्याचे": "pune",
    "पुण्यात": "pune",
    "पुण्याचा": "pune",
    "रायगड": "raigad",
    "अलिबाग": "alibag",
    "रत्नागिरी": "ratnagiri",
    "सांगली": "sangli",
    "सातारा": "satara",
    "सिंधुदुर्ग": "sindhudurg",
    "सोलापूर": "solapur",
    "सोलापुर": "solapur",
    "ठाणे": "thane",
    "वर्धा": "wardha",
    "वाशिम": "washim",
    "यवतमाळ": "yavatmal",
    "यवतमाल": "yavatmal",
    "बारामती": "baramati",
    "पंढरपूर": "pandharpur",
    "कराड": "karad",
    "मालेगाव": "malegaon",
    "शिर्डी": "shirdi",
}

WEATHER_KEYWORDS = [
    "हवामान", "हवामानाचा", "हवामानाची", "हवामान काय", "पाऊस", "तापमान", "थंडी", "ऊन", "ढगाळ",
    "मौसम", "तापमान", "बारिश", "वर्षा", "मौसम कैसा", "मौसम की जानकारी", "हवा",
    "weather", "temperature", "forecast", "climate", "rainfall", "humidity", "rain"
]

MY_CITY_KEYWORDS = [
    "my city", "my district", "my village", "my town", "my location", "my area", "here",
    "today's weather", "today weather", "todays weather", "weather today", "what is the weather",
    "current weather", "weather right now", "how is the weather", "whats the weather", "what's the weather",
    "माझ्या शहरात", "माझ्या शहराचे", "माझ्या शहरातील", "माझ्या गावात", "माझ्या गावातील", "माझ्या भागात",
    "माझ्या जिल्ह्यात", "माझ्या जिल्ह्याचे", "इथले", "येथील", "आजचे हवामान", "आजचा पाऊस", "हवामान कसे आहे", "हवामान सांगा", "हवामान काय",
    "मेरे शहर", "मेरे शहर का", "मेरे गांव", "मेरे गांव का", "मेरे जिले", "मेरे जिले का", "यहाँ का", "यहाँ",
    "आज का मौसम", "आज बारिश", "मौसम कैसा है", "मौसम बताओ", "मौसम क्या है"
]

def detect_weather_query(query: str, farmer_district: str = None):
    """
    Checks if a query is asking for weather or climate information.
    Resolves specific city names OR defaults intelligently to farmer's district/city.
    Returns (is_weather, city_key, original_name, is_my_city)
    """
    q = query.lower().strip()
    is_weather = any(kw in q for kw in WEATHER_KEYWORDS)
    if not is_weather:
        return False, None, None, False

    # 1. Check if user asked specifically for "my city / here / today"
    is_my_city_requested = any(phrase in q for phrase in MY_CITY_KEYWORDS)

    # 2. Check Devanagari city matches in query
    matched_city_key = None
    matched_display_name = None

    for dev_name, city_key in DEVANAGARI_CITY_MAP.items():
        if dev_name in q or dev_name in query:
            loc = MAHARASHTRA_LOCATIONS.get(city_key, {})
            matched_city_key = city_key
            matched_display_name = loc.get("name", city_key.title())
            break

    # 3. Check English city matches in query
    if not matched_city_key:
        for city_key, loc in MAHARASHTRA_LOCATIONS.items():
            if city_key in q:
                matched_city_key = city_key
                matched_display_name = loc["name"]
                break

    # If an explicit city was mentioned and it's NOT just generic "my city", use that
    if matched_city_key and not is_my_city_requested:
        return True, matched_city_key, matched_display_name, False

    # 4. If "my city / district" was asked or no specific city was named, resolve to farmer's district
    if farmer_district and str(farmer_district).strip():
        dist_clean = str(farmer_district).strip()
        dist_lower = dist_clean.lower()

        # Check if farmer_district matches Devanagari map
        if dist_clean in DEVANAGARI_CITY_MAP:
            d_key = DEVANAGARI_CITY_MAP[dist_clean]
            loc = MAHARASHTRA_LOCATIONS.get(d_key, {})
            return True, d_key, loc.get("name", dist_clean), True

        # Check if matches English locations
        for k, loc in MAHARASHTRA_LOCATIONS.items():
            if k in dist_lower or dist_lower in k:
                return True, k, loc["name"], True

        # Custom district not directly in map
        return True, dist_lower, dist_clean.title(), True

    # 5. Fallback if no farmer_district was provided
    if matched_city_key:
        return True, matched_city_key, matched_display_name, False

    return True, "pune", "Pune", True

def get_live_weather_report(city_key: str, display_name: str, lang: str = "mr", is_my_city: bool = False) -> tuple:
    """
    Fetches real-time weather from OpenWeather and generates an agricultural weather advisory.
    Returns (formatted_text, weather_card_dict)
    """
    loc = MAHARASHTRA_LOCATIONS.get(city_key.lower()) if city_key else None
    
    url = "https://api.openweathermap.org/data/2.5/weather"
    if loc:
        params = {
            "lat": loc["lat"],
            "lon": loc["lon"],
            "appid": OPENWEATHER_API_KEY,
            "units": "metric"
        }
        city_title = loc.get(lang, loc.get("name", display_name or city_key.title()))
    else:
        params = {
            "q": f"{city_key},IN",
            "appid": OPENWEATHER_API_KEY,
            "units": "metric"
        }
        city_title = display_name or city_key.title()

    try:
        res = requests.get(url, params=params, timeout=8)
        if res.status_code != 200:
            # Fallback to Pune coordinates if not found
            fallback_loc = MAHARASHTRA_LOCATIONS["pune"]
            res = requests.get(url, params={
                "lat": fallback_loc["lat"],
                "lon": fallback_loc["lon"],
                "appid": OPENWEATHER_API_KEY,
                "units": "metric"
            }, timeout=8)
            city_title = display_name or "Pune"

        data = res.json()
        temp = round(float(data["main"]["temp"]), 1)
        feels_like = round(float(data["main"]["feels_like"]), 1)
        humidity = int(data["main"]["humidity"])
        pressure = int(data["main"]["pressure"])
        wind_speed = round(float(data["wind"]["speed"]) * 3.6, 1)  # km/h
        description = data["weather"][0]["description"].title()
        cloudiness = int(data.get("clouds", {}).get("all", 0))
        rain_1h = float(data.get("rain", {}).get("1h", 0))

        # Add "Your City / आपले शहर" badge if requested
        if is_my_city:
            if lang == "mr":
                city_header = f"{city_title} (आपले शहर)"
            elif lang == "hi":
                city_header = f"{city_title} (आपका शहर)"
            else:
                city_header = f"{city_title} (Your City)"
        else:
            city_header = city_title

        # Determine condition tag for UI card
        if rain_1h > 0 or "rain" in description.lower() or "drizzle" in description.lower():
            condition_type = "rain"
        elif temp > 35:
            condition_type = "hot"
        elif cloudiness > 60:
            condition_type = "cloudy"
        else:
            condition_type = "clear"

        # Agricultural recommendations based on live numbers
        if lang == "mr":
            agri_advice = []
            if temp > 36:
                agri_advice.append("☀️ **उष्णतेचा इशारा:** पिकांना पाण्याचे योग्य नियोजन करा व ठिबक सिंचन सकाळी किंवा संध्याकाळी चालू ठेवा.")
            elif rain_1h > 0 or "rain" in description.lower():
                agri_advice.append("🌧️ **पावसाची शक्यता:** शेतात कीटकनाशक किंवा विद्राव्य खतांची फवारणी तात्पुरती पुढे ढकला.")
            elif humidity > 80:
                agri_advice.append("💧 **जास्त आर्द्रता:** पिकांवर बुरशीजन्य रोगांचा प्रादुर्भाव होऊ नये म्हणून पिकांचे निरीक्षण करा.")
            else:
                agri_advice.append("✅ **शेतीकामासाठी उत्तम वेळ:** सध्याचे हवामान खते देणे, आंतरमशागत आणि फवारणीसाठी अतिशय अनुकूल आहे.")

            if wind_speed > 25:
                agri_advice.append("💨 **वारा जास्त:** उंच पिकांना आधार द्या व फवारणी करताना काळजी घ्या.")

            advice_text = "\n".join(agri_advice)

            text_report = f"""🌦️ **{city_header} चे थेट हवामान व शेती सल्ला:**

• 🌡️ **सध्याचे तापमान:** {temp}°C (अंगाला भासणारे: {feels_like}°C)
• 🌤️ **हवामान स्थिती:** {description} (ढगाळ प्रमाण: {cloudiness}%)
• 💧 **हवेतील आर्द्रता (Humidity):** {humidity}%
• 🌧️ **पाऊस:** {rain_1h} mm
• 💨 **वाऱ्याचा वेग:** {wind_speed} km/h • **दाब:** {pressure} hPa

🌾 **शेतकऱ्यांसाठी आजचा सल्ला:**
{advice_text}

[[ACTION:weather]]"""

        elif lang == "hi":
            agri_advice = []
            if temp > 36:
                agri_advice.append("☀️ **उच्च तापमान चेतावनी:** फसलों में हल्की सिंचाई करें एवं दोपहर के समय धूप से बचाएं।")
            elif rain_1h > 0 or "rain" in description.lower():
                agri_advice.append("🌧️ **वर्षा की संभावना:** कीटनाशक छिड़काव और यूरिया का प्रयोग बारिश थमने तक रोकें।")
            elif humidity > 80:
                agri_advice.append("💧 **अधिक नमी:** फफूंद जनित रोगों की रोकथाम हेतु फसलों की निगरानी करें।")
            else:
                agri_advice.append("✅ **अनुकूल मौसम:** आज का मौसम खाद डालने, निराई-गुड़ाई और कीटनाशक छिड़काव के लिए उत्तम है।")

            advice_text = "\n".join(agri_advice)

            text_report = f"""🌦️ **{city_header} का लाइव मौसम एवं कृषि सलाह:**

• 🌡️ **वर्तमान तापमान:** {temp}°C (महसूस होने वाला: {feels_like}°C)
• 🌤️ **मौसम स्थिति:** {description} (बादल: {cloudiness}%)
• 💧 **हवा में नमी (Humidity):** {humidity}%
• 🌧️ **वर्षा:** {rain_1h} mm
• 💨 **हवा की गति:** {wind_speed} km/h • **वायुदाब:** {pressure} hPa

🌾 **किसानों के लिए कृषि सुझाव:**
{advice_text}

[[ACTION:weather]]"""

        else:
            agri_advice = []
            if temp > 36:
                agri_advice.append("☀️ **High Heat Alert:** Irrigate during morning/evening hours and maintain soil mulch.")
            elif rain_1h > 0 or "rain" in description.lower():
                agri_advice.append("🌧️ **Rain Expected:** Postpone chemical foliar spraying until dry weather resumes.")
            elif humidity > 80:
                agri_advice.append("💧 **High Moisture:** Scout crops for potential fungal infections.")
            else:
                agri_advice.append("✅ **Optimal Conditions:** Favorable weather for fertilizer application, weeding, and spraying.")

            advice_text = "\n".join(agri_advice)

            text_report = f"""🌦️ **Live Weather & Farm Advisory for {city_header}:**

• 🌡️ **Current Temperature:** {temp}°C (Feels like: {feels_like}°C)
• 🌤️ **Weather Conditions:** {description} (Cloudiness: {cloudiness}%)
• 💧 **Relative Humidity:** {humidity}%
• 🌧️ **Precipitation:** {rain_1h} mm
• 💨 **Wind Speed:** {wind_speed} km/h • **Pressure:** {pressure} hPa

🌾 **Agronomic Recommendation:**
{advice_text}

[[ACTION:weather]]"""

        weather_card = {
            "city": city_header,
            "raw_city": city_title,
            "district": city_key,
            "temp": temp,
            "feels_like": feels_like,
            "humidity": humidity,
            "pressure": pressure,
            "wind_speed": wind_speed,
            "description": description,
            "cloudiness": cloudiness,
            "rain": rain_1h,
            "advice": advice_text,
            "condition_type": condition_type,
            "is_my_city": is_my_city
        }

        return text_report, weather_card

    except Exception as e:
        print(f"[Weather Error]: {e}")
        if lang == "mr":
            err_text = f"🌦️ **हवामान माहिती ({city_title}):**\nसध्या हवामान सर्व्हरशी संपर्क साधता आला नाही. कृपया काही वेळाने पुन्हा विचारा."
        elif lang == "hi":
            err_text = f"🌦️ **मौसम जानकारी ({city_title}):**\nवर्तमान में मौसम डेटा उपलब्ध नहीं हो सका। कृपया पुनः प्रयास करें।"
        else:
            err_text = f"🌦️ **Weather Advisory ({city_title}):**\nCould not fetch live weather data at this moment. Please try again."
        return err_text, None

# =========================================================
# DOMAIN KNOWLEDGE BASE (Offline Maharashtra Agronomy Engine)
# =========================================================

KNOWLEDGE_BASE = [
    # -----------------------------------------------------
    # WEBSITE PAGES & ASSISTANT FEATURES
    # -----------------------------------------------------
    {
        "keywords": ["crop prediction", "predict yield", "पीक अंदाज", "उत्पादन अंदाज", "yield predict", "उत्पादन कसे", "how to predict", "फसल उत्पादन", "पूर्वानुमान"],
        "action": "prediction",
        "mr": """🌾 **कृषीमित्र पीक उत्पादन अंदाज (Crop Yield Prediction) कसे वापरावे:**

१. **जिल्हा व हंगाम निवडा:** आपला जिल्हा (उदा. नाशिक, पुणे, अमरावती) व हंगाम (खरीप / रब्बी / उन्हाळी) निवडा.
२. **पीक व क्षेत्र प्रविष्ट करा:** पीक (उदा. सोयाबीन, कापूस, गहू) आणि शेतीचे क्षेत्र (एकर किंवा हेक्टरमध्ये) टाका.
३. **हवामान व माती माहिती:** अंदाजित पाऊस (Rainfall mm) व जमिनीचा प्रकार (काळी, तांबडी, चिकनमाती) भरा.
४. **'उत्पादन अंदाज काढा' बटण दाबा:** आमचे **Random Forest व XGBoost AI मॉडेल्स** त्वरित आपल्या शेताचे अंदाजित उत्पादन (टन/हेक्टर आणि एकूण क्विंटल) मोजून देतात.

💡 *थेट उत्पादन अंदाज पृष्ठावर जाण्यासाठी खालील बटणावर क्लिक करा:*
[[ACTION:prediction]]""",
        "hi": """🌾 **कृषि-मित्र फसल उत्पादन पूर्वानुमान (Crop Yield Prediction) कैसे उपयोग करें:**

१. **जिला एवं मौसम चुनें:** अपना जिला (उदा. पुणे, नाशिक, नागपुर) और सीजन (खरीफ / रबी / जायद) चुनें।
२. **फसल और क्षेत्रफल दर्ज करें:** अपनी फसल (कपास, सोयाबीन, गेहूं आदि) और खेत का रकबा डालें।
३. **वर्षा एवं मृदा प्रकार:** अनुमानित वार्षिक वर्षा एवं मिट्टी का प्रकार भरें।
४. **'पूर्वानुमान निकालें' बटन दबाएं:** हमारे **Random Forest और XGBoost AI मॉडल** आपके खेत के लिए सटीक उत्पादकता (टन/हेक्टेयर व कुल क्विंटल) प्रदर्शित करेंगे।

💡 *सीधे फसल पूर्वानुमान पेज पर जाने हेतु नीचे क्लिक करें:*
[[ACTION:prediction]]""",
        "en": """🌾 **How to use KrushiMitra Crop Yield Prediction:**

1. **Select District & Season:** Choose your district (e.g. Pune, Nashik, Amravati) and season (Kharif / Rabi / Summer).
2. **Select Crop & Area:** Choose your crop (Soybean, Cotton, Sugarcane, Wheat, etc.) and enter your farmland size.
3. **Rainfall & Soil Type:** Enter expected rainfall (mm) and soil category (Black, Red, Loamy).
4. **Click 'Predict Yield':** Our advanced **Random Forest & XGBoost Machine Learning models** compute expected productivity in tonnes/hectare and total quintals.

💡 *Click the button below to go directly to Crop Prediction:*
[[ACTION:prediction]]"""
    },
    {
        "keywords": ["soil recommendation", "soil test", "माती परीक्षण", "मृदा परीक्षण", "fertilizer recommendation", "खत शिफारस", "soil advisory", "कोणते पीक", "कौन सी फसल", "npk"],
        "action": "recommendation",
        "mr": """🧪 **माती परीक्षण व पीक शिफारस (Soil Advisory) साधन:**

१. **मातीचे घटक प्रविष्ट करा:** माती तपासणी अहवालानुसार **नत्र (N), स्फुरद (P), पालाश (K)** आणि **सामू (pH)** ची मूल्ये भरा.
२. **स्थानिक हवामान द्या:** सरासरी तापमान, हवेतील आर्द्रता आणि वार्षिक पाऊस टाका.
३. **AI विश्लेषण:** आमचे ॲग्रोनॉमी अल्गोरिदम आपल्या जमिनीसाठी **सर्वात फायदेशीर टॉप ३ पिके** शिफारस करते.
४. **संतुलित खत वेळापत्रक:** निवडलेल्या पिकासाठी हेक्टरी युरिया, डीएपी (DAP), पोटॅश (MOP) व सूक्ष्मअन्नद्रव्यांचे अचूक डोस मिळतात.

💡 *आपल्या जमिनीची तपासणी करण्यासाठी खालील बटण दाबा:*
[[ACTION:recommendation]]""",
        "hi": """🧪 **मृदा परीक्षण एवं फसल सलाह (Soil Advisory) टूल:**

१. **पोषक तत्व दर्ज करें:** अपनी मिट्टी की जांच रिपोर्ट से **नाइट्रोजन (N), फास्फोरस (P), पोटाश (K)** तथा **pH मान** दर्ज करें।
२. **मौसम विवरण भरें:** औसत तापमान, आर्द्रता और वर्षा भरें।
३. **AI अनुशंसा:** हमारा सिस्टम आपकी मिट्टी के लिए **सर्वश्रेष्ठ ३ अनुकूल फसलों** की सिफारिश करता है।
४. **उर्वरक शेड्यूल:** बेसल डोज और टॉप ड्रेसिंग के लिए यूरिया, डीएपी, पोटाश का सटीक मात्रा पत्रक प्राप्त करें।

💡 *मृदा सलाहकार पेज पर जाने के लिए नीचे क्लिक करें:*
[[ACTION:recommendation]]""",
        "en": """🧪 **KrushiMitra Soil Health & Crop Advisory Tool:**

1. **Enter Soil Nutrients:** Input values from your soil health card: **Nitrogen (N), Phosphorus (P), Potassium (K)**, and **pH level**.
2. **Enter Climate Parameters:** Fill in local average temperature, humidity, and rainfall.
3. **AI Agronomy Inference:** The engine evaluates crop suitability matrices and recommends the **Top 3 most profitable crops** for your land.
4. **Fertilizer Schedule:** Get tailored dosage recommendations for Urea, DAP, Potash, and micronutrients.

💡 *Click below to open Soil Recommendation:*
[[ACTION:recommendation]]"""
    },
    {
        "keywords": ["weather page", "हवामान पृष्ठ", "मौसम पेज", "check weather", "हवामान अंदाज कुठे", "weather forecast", "हवामान कुठे"],
        "action": "weather",
        "mr": """🌦️ **कृषीमित्र हवामान व शेती अंदाज विभाग:**

• **थेट हवामान उपग्रह डेटा:** महाराष्ट्रातील सर्व ३६ जिल्ह्यांचे तापमान, हवेतील आर्द्रता, वाऱ्याचा वेग आणि पावसाची शक्यता दर तासाला अपडेट होते.
• **५ दिवसांचा शेती अंदाज:** पुढील ५ दिवसांतील पावसाचा अंदाज पाहून फवारणी, खते देणे किंवा काढणीचे नियोजन करू शकता.
• **स्वयंचलित कृषी सल्ले:** अतिवृष्टी, उष्णतेची लाट किंवा गारपिटीचा इशारा त्वरित दिला जातो.

💡 *आपल्या जिल्ह्याचे हवामान तपासण्यासाठी येथे क्लिक करा:*
[[ACTION:weather]]""",
        "hi": """🌦️ **कृषि-मित्र मौसम एवं कृषि पूर्वानुमान खंड:**

• **लाइव उपग्रह मौसम डेटा:** महाराष्ट्र के सभी ३६ जिलों का तापमान, आर्द्रता, वायु वेग और वर्षा की संभावना प्रति घंटा अपडेट होती है।
• **५ दिवसीय कृषि पूर्वानुमान:** आगामी ५ दिनों के मौसम को देखकर कीटनाशक छिड़काव व सिंचाई की योजना बनाएं।
• **कृषि मौसम अलर्ट:** आंधी, ओलावृष्टि एवं भारी बारिश की अग्रिम चेतावनी प्राप्त करें।

💡 *मौसम देखने के लिए नीचे क्लिक करें:*
[[ACTION:weather]]""",
        "en": """🌦️ **KrushiMitra Weather & Climate Advisory:**

• **Real-Time Satellite Feed:** Hourly telemetry for temperature, relative humidity, wind velocity, and precipitation across all 36 Maharashtra districts.
• **5-Day Agricultural Forecast:** Plan pesticide spraying, fertilizer application, and harvesting around rainfall outlooks.
• **Automated Agronomic Warnings:** Severe weather, hailstorm, and heatwave alerts customized for regional crops.

💡 *Click below to open the Weather page:*
[[ACTION:weather]]"""
    },
    {
        "keywords": ["pdf report", "download report", "अहवाल डाऊनलोड", "रिपोर्ट डाउनलोड", "farm report", "शेती अहवाल", "प्रिंट अहवाल"],
        "action": "reports",
        "mr": """📄 **अधिकृत शेती PDF अहवाल (Farm PDF Reports):**

• आपण केलेले पीक अंदाज आणि माती परीक्षण एका क्लिकवर **अधिकृत द्विभाषिक PDF अहवालात** रूपांतरित होते.
• या अहवालात पीक शिफारस, खतांचे वेळापत्रक, अपेक्षित उत्पन्न आणि शेतीचे तांत्रिक विश्लेषण समाविष्ट असते.
• हा अहवाल आपण डाऊनलोड करू शकता, प्रिंट करू शकता किंवा बँक पीक कर्जासाठी (KCC) पुरावा म्हणून वापरू शकता.

💡 *आपले अहवाल पाहण्यासाठी व डाऊनलोड करण्यासाठी येथे क्लिक करा:*
[[ACTION:reports]]""",
        "hi": """📄 **आधिकारिक कृषि PDF रिपोर्ट (Farm PDF Reports):**

• आपके द्वारा किए गए सभी फसल पूर्वानुमान एवं मृदा सलाह का एक क्लिक में **द्विभाषी रिपोर्ट** तैयार होता है।
• इस रिपोर्ट में उर्वरक शेड्यूल, अनुमानित पैदावार और वैज्ञानिक विश्लेषण शामिल रहता है।
• इसे डाउनलोड करके किसान क्रेडिट कार्ड (KCC) या कृषि अधिकारी को दिखाने हेतु प्रिंट कर सकते हैं।

💡 *अपनी PDF रिपोर्ट देखने के लिए नीचे क्लिक करें:*
[[ACTION:reports]]""",
        "en": """📄 **Official Farm PDF Reports:**

• Automatically synthesizes your crop yield predictions and soil test advisories into an **official printable bilingual PDF report**.
• Includes full agronomic recommendations, fertilizer application schedules, and expected yield metrics.
• Useful for farm record-keeping and Kisan Credit Card (KCC) crop loan documentation.

💡 *Click below to view and download Farm Reports:*
[[ACTION:reports]]"""
    },
    {
        "keywords": ["download app", "install app", "apk", "अ‍ॅप डाऊनलोड", "ऐप डाउनलोड", "मोबाइल अ‍ॅप", "install pwa", "ॲप कसे"],
        "action": "download_app",
        "mr": """📲 **कृषीमित्र मोबाईल अ‍ॅप कसे डाऊनलोड व इन्स्टॉल करावे:**

१. **थेट Android APK डाऊनलोड:** आपण थेट `KrushiMitra.apk` फाईल आपल्या मोबाईलमध्ये डाऊनलोड करून इन्स्टॉल करू शकता.
२. **१-क्लिक इन्स्टॉल (PWA):** कोणत्याही ॲप स्टोअरच्या त्रासाशिवाय थेट 'Add to Home Screen' वर क्लिक करून अ‍ॅप इन्स्टॉल करा.
३. **ऑफलाइन सुविधा:** शेतात इंटरनेट नसतानाही अ‍ॅप सहज उघडते आणि काम करते.

💡 *अ‍ॅप डाऊनलोड करण्यासाठी खालील बटण दाबा:*
[[ACTION:download_app]]""",
        "hi": """📲 **कृषि-मित्र मोबाइल ऐप कैसे डाउनलोड एवं इंस्टॉल करें:**

१. **सीधा Android APK डाउनलोड:** आप सीधे `KrushiMitra.apk` फाइल अपने फोन में डाउनलोड करके इंस्टॉल कर सकते हैं।
२. **१-क्लिक इंस्टॉल (PWA):** बिना प्ले स्टोर के झंझट सीधे 'Add to Home Screen' पर क्लिक करके ऐप फोन में लगाएं।
३. **ऑफलाइन मोड:** खेत में इंटरनेट न होने पर भी ऐप सुचारू रूप से कार्य करता है।

💡 *ऐप डाउनलोड करने हेतु नीचे क्लिक करें:*
[[ACTION:download_app]]""",
        "en": """📲 **How to Download & Install KrushiMitra App:**

1. **Direct Android APK:** Download `KrushiMitra.apk` directly to your phone and install with one tap.
2. **Instant 1-Click PWA:** Tap 'Add to Home Screen' in your mobile browser to install without app store delays.
3. **Offline Field Ready:** Works smoothly even with low connectivity in remote farmlands.

💡 *Click below to open the App Download modal:*
[[ACTION:download_app]]"""
    },
    {
        "keywords": ["history", "मागील अंदाज", "पिछला इतिहास", "past prediction", "माझा इतिहास"],
        "action": "history",
        "mr": """📜 **मागील अंदाज व इतिहास (History Log):**

• आपण आतापर्यंत घेतलेले सर्व पीक उत्पादन अंदाज आणि माती परीक्षण नोंदी सुरक्षित जतन केलेल्या आहेत.
• आपण तारीख, जिल्हा, पीक आणि उत्पादकतेनुसार पूर्वीचे सर्व रेकॉर्ड पुन्हा पाहू शकता.

💡 *आपला इतिहास तपासण्यासाठी येथे क्लिक करा:*
[[ACTION:history]]""",
        "hi": """📜 **पूर्व इतिहास एवं रिकॉर्ड (History Log):**

• आपके द्वारा पूर्व में निकाले गए सभी फसल पूर्वानुमान एवं मृदा सिफारिशें सुरक्षित रूप से दर्ज हैं।
• तारीख, जिला और फसल अनुसार पुराना ब्योरा कभी भी देख सकते हैं।

💡 *अपना इतिहास देखने के लिए नीचे क्लिक करें:*
[[ACTION:history]]""",
        "en": """📜 **Prediction & Recommendation History Log:**

• View your complete historical record of crop yield predictions, dates, districts, and productivity numbers.
• Easily revisit previous farm plans or re-export previous evaluations.

💡 *Click below to view History:*
[[ACTION:history]]"""
    },
    {
        "keywords": ["profile", "farm size", "माझे खाते", "माझी प्रोफाइल", "जिल्हा बदला", "प्रोफाइल"],
        "action": "profile",
        "mr": """👤 **शेतकरी प्रोफाइल व शेतजमीन तपशील:**

• प्रोफाइल पृष्ठावर आपण आपले नाव, मुख्य जिल्हा, शेतीचे एकूण क्षेत्रफळ (एकर/हेक्टर) आणि संपर्क माहिती अपडेट करू शकता.
• जिल्हा निवडल्याने डॅशबोर्डवरील हवामान आणि आपत्कालीन सल्ले थेट आपल्या गावासाठी सानुकूलित होतात.

💡 *आपली प्रोफाइल संपादित करण्यासाठी येथे क्लिक करा:*
[[ACTION:profile]]""",
        "hi": """👤 **किसान प्रोफाइल एवं खेत विवरण:**

• प्रोफाइल पेज पर आप अपना नाम, गृह जिला, कुल रकबा (एकड़/हेक्टेयर) व विवरण अपडेट कर सकते हैं।
• जिला सेट करने पर डैशबोर्ड पर आपके जिले का मौसम और अलर्ट अपने-आप दिखने लगते हैं।

💡 *अपनी प्रोफाइल देखने के लिए नीचे क्लिक करें:*
[[ACTION:profile]]""",
        "en": """👤 **Farmer Profile & Farmland Settings:**

• Manage your registered farmer name, home district, farm acreage (acres/hectares), and preferences.
• Setting your home district customizes emergency broadcasts and weather outlooks across your dashboard.

💡 *Click below to open Profile:*
[[ACTION:profile]]"""
    },
    {
        "keywords": ["admin", "broadcast", "आपत्कालीन", "अधिकारी", "प्रशासक", "advisory broadcast"],
        "action": "admin",
        "mr": """🛡️ **प्रशासक नियंत्रण केंद्र (Admin Command Center):**

• **जिल्हावार आपत्कालीन संदेश (Broadcast Advisory):** कृषी अधिकारी गारपीट, कीड प्रादुर्भाव किंवा अनुदानाची माहिती थेट शेतकर्‍यांच्या डॅशबोर्डवर प्रसारित करू शकतात.
• **शेतकरी व्यवस्थापन:** नोंदणीकृत शेतकऱ्यांची संख्या आणि जिल्हावार पोहोच मोजता येते.
• **MySQL डेटाबेस थेट सिंक:** सर्व अलर्ट्स आणि नोंदी सुरक्षित MySQL डेटाबेसमध्ये रिअल-टाइम जतन होतात.

💡 *प्रशासक पॅनेल उघडण्यासाठी येथे क्लिक करा:*
[[ACTION:admin]]""",
        "hi": """🛡️ **प्रशासक कमांड सेंटर (Admin Command Center):**

• **जिलावार आपातकालीन चेतावनी (Broadcast Advisory):** कृषि अधिकारी ओलावृष्टि, कीट प्रकोप एवं सब्सिडी की सूचना तुरंत किसानों को भेज सकते हैं।
• **किसान प्रबंधन:** पंजीकृत किसानों की संख्या एवं रीच की निगरानी।
• **MySQL डेटाबेस सिंक:** सभी बुलेटिन सीधे MySQL डेटाबेस में सुरक्षित रहते हैं।

💡 *एडमिन पैनल खोलने के लिए नीचे क्लिक करें:*
[[ACTION:admin]]""",
        "en": """🛡️ **KrushiMitra Admin Command Center:**

• **District-Wise Advisory & Emergency Broadcast:** Agriculture officers broadcast real-time weather alerts, pest outbreaks, and subsidy news directly to farmers' dashboards.
• **Farmer Directory & Audience Reach:** Monitor registered farmers and district telemetry.
• **Powered by MySQL:** All records and bulletins persist directly in the production MySQL database.

💡 *Click below to open Admin Panel:*
[[ACTION:admin]]"""
    },

    # -----------------------------------------------------
    # GOVERNMENT SCHEMES (MAHARASHTRA & CENTRAL)
    # -----------------------------------------------------
    {
        "keywords": ["pm kisan", "पीएम किसान", "सन्मान निधी", "pm-kisan", "६०००", "योजना"],
        "mr": """🏛️ **पीएम-किसान सन्मान निधी योजना (PM-Kisan) व नमो शेतकरी योजना:**

१. **पीएम-किसान (PM-Kisan):** केंद्र सरकार पात्र शेतकऱ्यांना दरवर्षी **₹६,०००** (दर ४ महिन्यांनी ₹२,००० चे ३ हप्ते) थेट बँक खात्यात (DBT) जमा करते.
२. **नमो शेतकरी महासन्मान निधी (महाराष्ट्र):** महाराष्ट्र शासनाकडून अतिरिक्त **₹६,०००** दिले जातात. त्यामुळे राज्यातील शेतकऱ्यांना एकूण **₹१२,००० प्रतिवर्ष** मिळतात.
३. **पात्रता व कागदपत्रे:** आधार कार्ड, ७/१२ उतारा, आधार लिंक बँक खाते आणि ई-केवायसी (e-KYC) पूर्ण असणे आवश्यक आहे.
४. **अर्ज कसा करावा:** `pmkisan.gov.in` वर किंवा गावातील CSC केंद्रावर जाऊन ऑनलाइन नोंदणी करू शकता.""",
        "hi": """🏛️ **पीएम-किसान सम्मान निधि एवं नमो शेतकरी योजना:**

१. **पीएम-किसान (PM-Kisan):** केंद्र सरकार द्वारा पात्र किसान परिवारों को प्रतिवर्ष **₹६,०००** (₹२,००० की ३ किस्तों में) सीधे बैंक खाते में प्रदान किए जाते हैं।
२. **नमो शेतकरी योजना (महाराष्ट्र):** महाराष्ट्र सरकार द्वारा अतिरिक्त **₹६,०००** दिए जाते हैं, जिससे राज्य के किसानों को कुल **₹१२,००० प्रतिवर्ष** मिलते हैं।
३. **आवश्यक दस्तावेज:** आधार कार्ड, भूमि अभिलेख (खसरा/खतौनी/७-१२), बैंक खाता आधार से लिंक और e-KYC अनिवार्य है।
४. **आवेदन प्रक्रिया:** `pmkisan.gov.in` पोर्टल या नजदीकी CSC केंद्र से पंजीकरण कराएं।""",
        "en": """🏛️ **PM-Kisan & Namo Shetkari Samman Nidhi Schemes:**

1. **PM-Kisan (Central):** Direct financial assistance of **₹6,000/year** paid in 3 equal four-monthly installments of ₹2,000 directly via DBT into Aadhaar-seeded bank accounts.
2. **Namo Shetkari Scheme (Maharashtra):** Additional top-up of **₹6,000/year** from Maharashtra Govt, providing a total of **₹12,000 per year** to state farmers.
3. **Key Requirements:** Land ownership (7/12 record), active Aadhaar-linked bank account, and completed biometric/OTP e-KYC.
4. **Portal:** Apply online at `pmkisan.gov.in` or via CSC centers."""
    },
    {
        "keywords": ["pik vima", "fasal bima", "पीक विमा", "फसल बीमा", "pmfby", "१ रुपया विमा"],
        "mr": """🛡️ **पंतप्रधान पीक विमा योजना (PMFBY) - १ रुपयात पीक विमा (महाराष्ट्र):**

१. **१ रुपयात पीक विमा:** महाराष्ट्र शासनाने शेतकऱ्यांसाठी केवळ **₹१ नाममात्र शुल्कात** पीक विमा उपलब्ध करून दिला आहे. उर्वरित हप्ता राज्य शासन भरते.
२. **कव्हरेज (संरक्षण):**
   - पेरणी न होणे / दुष्काळ.
   - हंगामातील खंड किंवा अतिवृष्टी / पूर.
   - काढणीनंतर अवकाळी पाऊस किंवा गारपिटीमुळे होणारे नुकसान.
३. **नुकसान भरपाई दावा (Intimation):** नैसर्गिक आपत्तीनंतर **७२ तासांच्या आत** Crop Insurance App वरून किंवा टोल-फ्री क्रमांकावर तक्रार नोंदवणे अनिवार्य आहे.""",
        "hi": """🛡️ **प्रधानमंत्री फसल बीमा योजना (PMFBY) - ₹१ में बीमा (महाराष्ट्र):**

१. **मात्र ₹१ में प्रीमियम:** महाराष्ट्र सरकार द्वारा किसानों के लिए केवल **₹१ में फसल बीमा** की सुविधा दी गई है, बाकी प्रीमियम सरकार वहन करती है।
२. **जोखिम सुरक्षा:** सूखा, अतिवृष्टि, बाढ़, कीट प्रकोप एवं कटाई उपरांत ओलावृष्टि से नुकसान की भरपाई।
३. **दावा प्रक्रिया:** फसल क्षति के **७२ घंटे के भीतर** Crop Insurance App या बीमा कंपनी टोल-फ्री नंबर पर सूचना दर्ज कराना अनिवार्य है।""",
        "en": """🛡️ **Pradhan Mantri Fasal Bima Yojana (PMFBY) - ₹1 Crop Insurance:**

1. **₹1 Token Premium (Maharashtra):** Farmers pay only ₹1 token premium per application; the remaining premium is subsidized by the State and Central Govt.
2. **Covered Risks:** Prevented sowing, mid-season localized drought/flood, and post-harvest unseasonal hailstorms/cyclones.
3. **Claim Notification:** Farmers must lodge localized calamity claims within **72 hours** via the Crop Insurance Mobile App or toll-free helpline."""
    },
    {
        "keywords": ["shettale", "solar pump", "kusum", "मागेल त्याला शेततळे", "शेततळे", "सोलर पंप", "कुसुम योजना", "सौर कृषी पंप"],
        "mr": """☀️ **मागेल त्याला शेततळे व मागेल त्याला सौर कृषी पंप (PM-KUSUM) योजना:**

१. **मागेल त्याला शेततळे:** शेतात पावसाचे पाणी साठवण्यासाठी **₹७५,००० पर्यंत अनुदान** दिले जाते. अर्ज महाडीबीटी (MahaDBT) पोर्टलवर करावा.
२. **मागेल त्याला सौर कृषी पंप (KUSUM B):**
   - ३ HP, ५ HP व ७.५ HP क्षमतेचे DC सोलर पंप **९०% ते ९५% अनुदानावर** उपलब्ध.
   - शेतकऱ्याला केवळ ५% ते १०% हिस्सा भरावा लागतो.
   - दिवसा वीज उपलब्ध होत असल्याने रात्री पाणी देण्याचा त्रास संपतो.
३. **अर्ज पोर्टल:** `mahadiscom.in/solar` किंवा MahaDBT पोर्टल.""",
        "hi": """☀️ **मागेल त्याला शेततळे एवं सोलर कृषि पंप (KUSUM) योजना:**

१. **खेत तालाब योजना:** जल संचयन हेतु खेत में पक्के तालाब निर्माण पर **₹७५,००० तक का अनुदान** MahaDBT पर उपलब्ध।
२. **पीएम कुसुम सोलर पंप योजना:**
   - ३ HP, ५ HP एवं ७.५ HP क्षमता के सोलर पंप **९०% से ९५% सब्सिडी** पर उपलब्ध।
   - किसान को केवल ५% से १०% अंशदान देना होता है।
   - दिन के समय मुफ्त एवं निर्बाध सिंचाई की सुविधा।
३. **वेबसाइट:** MahaDBT एवं `mahadiscom.in/solar` पर आवेदन करें।""",
        "en": """☀️ **Farm Ponds & Solar Agri Pump (PM-KUSUM) Schemes:**

1. **Magel Tyala Shettale (Farm Ponds):** Up to **₹75,000 direct subsidy** for harvesting rainwater in farm ponds via the MahaDBT portal.
2. **Solar Agriculture Pumps (KUSUM Component B):**
   - 3 HP, 5 HP, and 7.5 HP solar water pumping systems subsidized by **90% to 95%**.
   - Farmers contribute only 5% to 10% of the capital cost.
   - Provides reliable, free daytime irrigation without power cut issues.
3. **Application Portal:** MahaDBT and Mahadiscom Solar portal."""
    },

    # -----------------------------------------------------
    # CROPS, PESTS & AGRONOMY REMEDIES
    # -----------------------------------------------------
    {
        "keywords": ["बोंड अळी", "गुलाबी बोंड", "pink bollworm", "bollworm", "कपास की सुंडी", "कापूस अळी"],
        "mr": """🌱 **कापसावरील गुलाबी बोंड अळी (Pink Bollworm) नियंत्रण उपाय:**

१. **कामगंध सापळे (Pheromone Traps):** हेक्टरी ५ कामगंध सापळे लावावेत.
२. **जैविक नियंत्रण:** ट्रायकोकार्ड्स (Trichogramma) वापरावे व ५% निंबोळी अर्काची (NSKE) फवारणी करावी.
३. **रासायनिक फवारणी (गरज भासल्यास):**
   - **इमामेक्टिन बेन्झोएट ५% SG** (४.५ ग्रॅम/१० लिटर पाणी) किंवा **प्रोफेनोफॉस ५०% EC** (३० मिली/१० लिटर पाणी) संध्याकाळच्या वेळी फवारावे.
४. **सावधगिरी:** प्रादुर्भावग्रस्त डोमकळ्या व गळालेली बोंडे गोळा करून नष्ट करा.""",
        "hi": """🌱 **कपास में गुलाबी सुंडी (Pink Bollworm) नियंत्रण:**

१. **फेरोमोन ट्रैप:** प्रति एकड़ २-३ फेरोमोन ट्रैप लगाएं।
२. **जैविक नियंत्रण:** ५% नीम बीज अर्क (NSKE) का छिड़काव करें।
३. **रासायनिक कीटनाशक:**
   - **इमामेक्टिन बेंजोएट ५% SG** (४.५ ग्राम प्रति १० लीटर पानी) या **प्रोफेनोफॉस ५०% EC** (३० मिली प्रति १० लीटर पानी) का छिड़काव करें।
४. **सुझाव:** ग्रसित फूल व कलियां तोड़कर नष्ट करें।""",
        "en": """🌱 **Cotton Pink Bollworm Management:**

1. **Pheromone Traps:** Install 5 traps per hectare for monitoring.
2. **Biological Control:** Release Trichogramma parasitoids and spray 5% Neem Seed Kernel Extract (NSKE).
3. **Chemical Treatment:** Spray **Emamectin Benzoate 5% SG** @ 4.5 g per 10 L water or **Profenofos 50% EC** @ 30 ml per 10 L water during evening hours.
4. **Sanitation:** Collect and destroy affected rosetted flowers and dropped bolls."""
    },
    {
        "keywords": ["पिवळा मोजक", "मोज़ेक", "yellow mosaic", "सोयाबीन पिवळा", "सोयाबीन रोग", "mosaic virus"],
        "mr": """🌿 **सोयाबीनवरील पिवळा मोजक (Yellow Mosaic) रोग नियंत्रण:**

१. **कारणीभूत कीड:** हा विषाणू पांढऱ्या माशीमुळे (Whitefly) पसरतो.
२. **नियंत्रण उपाय:**
   - शेतात प्रति एकर १०-१२ **पिवळे चिकट सापळे (Yellow Sticky Traps)** लावा.
   - **थियामेथोक्सम २५% WG** (४ ग्रॅम/१० लिटर पाणी) किंवा **डायमेथोएट ३०% EC** (१५ मिली/१० लिटर पाणी) फवारावे.
३. **महत्त्वाचा सल्ला:** रोगट झाडे उपटून नष्ट करावीत जेणेकरून विषाणू इतर निरोगी झाडांवर पसरणार नाही.""",
        "hi": """🌿 **सोयाबीन में पीला मोज़ेक (Yellow Mosaic Virus) नियंत्रण:**

१. **कारण:** यह विषाणु सफेद मक्खी (Whitefly) द्वारा फैलता है।
२. **नियंत्रण:**
   - खेत में प्रति एकड़ १० **पीले चिपचिपे कार्ड (Yellow Sticky Traps)** लगाएं।
   - सफेद मक्खी नियंत्रण हेतु **थियामेथोक्सम २५% WG** (४ ग्राम प्रति १० लीटर पानी) का छिड़काव करें।
३. **सावधानी:** रोगग्रस्त पौधों को उखाड़कर नष्ट कर दें।""",
        "en": """🌿 **Soybean Yellow Mosaic Virus Control:**

1. **Vector:** Spread by whiteflies (*Bemisia tabaci*).
2. **Management:**
   - Install **Yellow Sticky Traps** (10-12 per acre) to trap whiteflies.
   - Spray **Thiamethoxam 25% WG** @ 4 g / 10 L water or **Acetamiprid 20% SP** @ 3 g / 10 L water.
3. **Tip:** Rogue out and destroy infected plants early to stop secondary transmission."""
    },
    {
        "keywords": ["सोयाबीन खत", "soybean fertilizer", "सोयाबीन खते", "सोयाबीन खाद"],
        "mr": """🌾 **सोयाबीन खत व्यवस्थापन (प्रति एकर):**

१. **पेरणीच्या वेळी (बेसल डोस):**
   - **DAP:** ५० किलो + **पोटॅश (MOP):** २५ किलो + **सल्फर (गंधक):** १० किलो प्रति एकर.
   - किंवा **१०:२६:२६:** ७५ किलो प्रति एकर.
२. **जिवाणू संवर्धन (बीजप्रक्रिया):** रायझोबियम व पीएसबी (PSB) २५० ग्रॅम प्रति १० किलो बियाण्यास चोळावे.
३. **फुलोरा व शेंगा भरताना फवारणी:**
   - फुलोऱ्याच्या वेळी: **१९:१९:१९** (७५ ग्रॅम/१० लिटर) + चिलेटेड मायक्रोन्यूट्रिएंट्स.
   - शेंगा भरताना: **००:५२:३४** (१०० ग्रॅम/१० लिटर) चा फवारा घ्यावा.""",
        "hi": """🌾 **सोयाबीन उर्वरक प्रबंधन (प्रति एकड़):**

१. **बुवाई के समय (बेसल डोज):**
   - **DAP:** ५० किलो + **पोटाश:** २५ किलो + **सल्फर:** १० किलो प्रति एकड़।
   - या **१०:२६:२६:** ७५ किलो प्रति एकड़।
२. **बीज उपचार:** राइजोबियम एवं PSB कल्चर से बीज उपचार करें।
३. **पोषक छिड़काव:**
   - फूल आने पर: **१९:१९:१९** (७५ ग्राम/१० ली) का छिड़काव।
   - दाना भरते समय: **००:५२:३४** (१०० ग्राम/१० ली) का छिड़काव करें।""",
        "en": """🌾 **Soybean Balanced Fertilizer Schedule (Per Acre):**

1. **Basal Dose (At Sowing):**
   - **DAP:** 50 kg + **MOP (Potash):** 25 kg + **Bentonite Sulphur:** 10 kg.
   - Or **10:26:26:** 75 kg per acre.
2. **Seed Treatment:** Inoculate seeds with *Rhizobium japonicum* & PSB @ 250 g per 10 kg seed.
3. **Foliar Nutrition:**
   - Flowering stage: Foliar spray of **19:19:19** @ 75 g / 10 L water.
   - Pod-filling stage: **00:52:34** @ 100 g / 10 L water to boost grain weight."""
    },
    {
        "keywords": ["ऊस", "sugarcane", "ऊस खत", "गन्ना", "खोडकीड", "ऊस कीड"],
        "mr": """🎋 **ऊस पीक व्यवस्थापन व खत नियोजन:**

१. **खत डोस (प्रति एकर):**
   - लागवडीच्या वेळी: १ बॅग DAP + १ बॅग पोटॅश + १० किलो फेरस सल्फेट.
   - बाळबांधणी (४५ दिवस): १ बॅग युरिया + २५ किलो पोटॅश.
   - मोठ्या बांधणीच्या वेळी (१२० दिवस): २ बॅग युरिया + १ बॅग पोटॅश + ५ किलो झिंक.
२. **खोडकीड व कांडीकीड नियंत्रण:**
   - **फिप्रोनिल ०.३% GR** (१० किलो/एकर) मातीत मिसळावे किंवा **क्लोरँट्रानिलीप्रोल १८.५% SC (कोराजन)** @ ०.४ मिली/लिटर आळवणी करावी.
३. **ठिबक सिंचन:** ठिबक सिंचनामुळे ४०% पाण्याची बचत होते व उसाचे वजन २५% वाढते.""",
        "hi": """🎋 **गन्ना फसल एवं उर्वरक प्रबंधन:**

१. **खाद की मात्रा (प्रति एकड़):**
   - बुवाई समय: १ बोरी DAP + १ बोरी पोटाश + सल्फर।
   - ४५ दिन बाद: १ बोरी यूरिया + पोटाश।
   - भारी मिट्टी चढ़ाने पर (१२० दिन): २ बोरी यूरिया + १ बोरी पोटाश।
२. **कंसुआ (Shoot Borer) नियंत्रण:**
   - **कोराजन (Chlorantraniliprole 18.5% SC)** @ १५० मिली प्रति एकड़ ड्रेंचिंग करें।
३. **ड्रिप सिंचाई:** ड्रिप द्वारा जल एवं खाद देने पर उपज में २०-३०% की वृद्धि होती है।""",
        "en": """🎋 **Sugarcane Crop Management & Nutrition:**

1. **Fertilizer Schedule (Per Acre):**
   - Basal: 1 bag DAP + 1 bag MOP + 10 kg Zinc/Sulphur.
   - 45 Days: 1 bag Urea + 25 kg Potash.
   - Earthing up (120 Days): 2 bags Urea + 1 bag Potash.
2. **Early Shoot Borer Control:**
   - Drench **Chlorantraniliprole 18.5% SC (Coragen)** @ 150 ml in 400 L water per acre at 30-40 days.
3. **Drip Fertigation:** Delivers water and soluble NPK directly to root zones, improving stalk girth and sucrose recovery."""
    },
    {
        "keywords": ["कांदा", "onion", "कांदा करपा", "कांदा पीक", "प्याज", "थ्रिप्स"],
        "mr": """🧅 **कांदा पीक - जांभळा करपा व थ्रिप्स (फुलकिडे) नियंत्रण:**

१. **फुलकिडे (Thrips) लक्षणे:** पानांवर पांढरे चट्टे पडतात व पाने वाकडी होतात.
   - फवारणी: **फिप्रोनिल ५% SC** (२० मिली/१० लिटर) किंवा **लॅम्बडा सायहॅलोथ्रीन** (१० मिली/१० लिटर) + स्टिकर.
२. **जांभळा करपा (Purple Blotch):**
   - फवारणी: **मँकोझेब ७५% WP** (२५ ग्रॅम/१० लिटर) किंवा **टेब्युकोनॅझोल + ट्रायफ्लॉक्सिस्ट्रॉबिन** (१० ग्रॅम/१० लिटर).
३. **साठवणूक क्षमता वाढवण्यासाठी:** काढणीच्या १५ दिवस आधी पाणी बंद करावे आणि **मॅलिक हायड्रॅझाइड (MH)** फवारावे.""",
        "hi": """🧅 **प्याज की फसल - थ्रिप्स एवं बैंगनी धब्बा (करपा) नियंत्रण:**

१. **थ्रिप्स कीट नियंत्रण:**
   - **फिप्रोनिल ५% SC** (२० मिली प्रति १० लीटर पानी) या **इमिडाक्लोप्रिड १७.८% SL** (५ मिली) का छिड़काव करें।
२. **बैंगनी धब्बा (Purple Blotch):**
   - **मेंकोजेब ७५% WP** (२५ ग्राम प्रति १० ली) या **एज़ोक्सीस्ट्रोबिन** का छिड़काव करें।
३. **भंडारण सुधार:** कटाई से १५ दिन पूर्व सिंचाई रोकें ताकि कंद ठोस रहें।""",
        "en": """🧅 **Onion Thrips & Purple Blotch Management:**

1. **Thrips Control:** Spray **Fipronil 5% SC** @ 20 ml / 10 L water or **Acetamiprid 20% SP** @ 5 g / 10 L water mixed with a wetting agent/sticker.
2. **Purple Blotch (Alternaria porri):** Spray **Mancozeb 75% WP** @ 25 g / 10 L water or **Tebuconazole + Trifloxystrobin** @ 10 g / 10 L water.
3. **Storage Quality:** Stop irrigation 10-15 days prior to harvest to cure bulb necks and minimize storage rot."""
    },
    {
        "keywords": ["टोमॅटो", "tomato", "टोमॅटो करपा", "टमाटर", "फळ पोखरणारी"],
        "mr": """🍅 **टोमॅटो - करपा व फळ पोखरणारी अळी नियंत्रण:**

१. **लवकर व उशिरा येणारा करपा (Blight):** **अझॉक्सिस्ट्रॉबिन + डायफेनोकोनॅझोल** (१० मिली/१० लिटर) किंवा **मँकोझेब** (२५ ग्रॅम/१० लिटर) फवारावे.
२. **फळ पोखरणारी अळी (Fruit Borer):** **इमामेक्टिन बेन्झोएट ५% SG** (४ ग्रॅम/१० लिटर) किंवा **स्पिनोसॅड ४५% SC** (३ मिली/१० लिटर) फवारावे.
३. **कॅल्शियम कमतरता (Blossom End Rot):** फळांचा मागचा भाग काळा पडत असल्यास **कॅल्शियम नायट्रेट** (५ ग्रॅम/लिटर) फवारावे.""",
        "hi": """🍅 **टमाटर - झुलसा (Blight) एवं फल छेदक कीट नियंत्रण:**

१. **झुलसा रोग:** **मेंकोजेब ७५% WP** (२५ ग्राम प्रति १० लीटर) या **एज़ोक्सीस्ट्रोबिन** (१० मिली) का छिड़काव करें।
२. **फल छेदक कीट:** **इमामेक्टिन बेंजोएट ५% SG** (४ ग्राम प्रति १० लीटर पानी) का छिड़काव करें।
३. **कैल्शियम कमी:** फल के तल में कालापन दिखने पर कैल्शियम नाइट्रेट का छिड़काव करें।""",
        "en": """🍅 **Tomato Blight & Fruit Borer Management:**

1. **Early & Late Blight:** Spray **Mancozeb 75% WP** @ 25 g / 10 L water or **Azoxystrobin 23% SC** @ 10 ml / 10 L water.
2. **Fruit Borer (Helicoverpa):** Spray **Emamectin Benzoate 5% SG** @ 4.5 g / 10 L water or **Flubendiamide 39.35% SC** @ 4 ml / 10 L.
3. **Blossom End Rot:** Foliar spray of Calcium Nitrate @ 50 g / 10 L water to rectify calcium deficiency."""
    },
    {
        "keywords": ["दुरुस्ती", "संपर्क", "हेल्पलाईन", "support", "contact", "मदत केंद्र", "customer care"],
        "mr": """📞 **कृषीमित्र शेतकरी मदत केंद्र व संपर्क:**

• **ईमेल सपोर्ट:** `krushimitra.project1@gmail.com`
• **राष्ट्रीय किसान कॉल सेंटर (KCC):** १८००-१८०-१५५१ (टोल-फ्री, २४ तास मोफत)
• **महाराष्ट्र कृषी विभाग हेल्पलाईन:** १४४४३
• आमचा AI चॅटबॉट २४/७ आपल्या सर्व शंकांचे निरसन करण्यासाठी तयार आहे!""",
        "hi": """📞 **कृषि-मित्र सहायता केंद्र एवं संपर्क:**

• **ईमेल सहायता:** `krushimitra.project1@gmail.com`
• **राष्ट्रीय किसान कॉल सेंटर (KCC):** १८००-१८०-१५५१ (टोल-फ्री, २४ घंटे निशुल्क)
• **महाराष्ट्र कृषि हेल्पलाइन:** १४४४३
• हमारा AI चैटबॉट २४/७ आपकी सेवा में उपस्थित है!""",
        "en": """📞 **KrushiMitra Farmer Support & Helpline:**

• **Official Project Email:** `krushimitra.project1@gmail.com`
• **Kisan Call Center (KCC) National Toll-Free:** 1800-180-1551 (24/7 free agri guidance)
• **Maharashtra Agriculture Department Helpline:** 14443
• You can also ask any question directly to KrushiMitra AI right here!"""
    },
    {
        "keywords": ["बाजारभाव", "मंडी भाव", "भाव काय", "rate", "mandi price", "market price", "सोयाबीन भाव", "कापूस भाव", "कांदा भाव", "गहू भाव", "bazar bhav", "apmc"],
        "mr": """💰 **महाराष्ट्र प्रमुख बाजार समिती (APMC) बाजारभाव व विक्री सल्ला:**

१. **सोयाबीन (लातूर / अकोला / वाशिम):**
   • सरासरी भाव: **₹४,४०० ते ₹४,८५० / क्विंटल** (हमीभाव MSP: ₹४,८९२)
   • सल्ला: दाण्यातील ओलावा १०% पेक्षा कमी असावा. चांगल्या भावासाठी माल ग्रेडिंग करून विका.
२. **कापूस (जळगाव / यवतमाळ / छत्रपती संभाजीनगर):**
   • सरासरी भाव: **₹६,९०० ते ₹७,३५० / क्विंटल** (हमीभाव MSP: ₹७,१२१)
   • सल्ला: लांब धाग्याच्या आणि स्वच्छ कापसाला चांगला दर मिळतो.
३. **कांदा (लासलगाव / पिंपळगाव / पुणे):**
   • सरासरी भाव: **₹१,४०० ते ₹२,४०० / क्विंटल**
   • सल्ला: प्रतवारीनुसार सुपर कांदा आणि गोल्टी कांदा वेगळा करून विकावा.
४. **तूर / हरभरा:**
   • तूर भाव: **₹९,००० ते ₹१०,२५० / क्विंटल**
   • हरभरा भाव: **₹५,८०० ते ₹६,३०० / क्विंटल**

💡 *टीप: बाजारभाव दररोज आवक व दर्जानुसार बदलतात. बाजारात नेण्यापूर्वी स्थानिक APMC शी संपर्क साधावा.*""",
        "hi": """💰 **महाराष्ट्र प्रमुख कृषि उपज मंडी (APMC) भाव एवं विपणन सुझाव:**

१. **सोयाबीन (लातूर / अकोला / वाशिम):**
   • औसत भाव: **₹४,४०० से ₹४,८५० / क्विंटल** (MSP: ₹४,८९२)
   • सुझाव: दाने में नमी १०% से कम रखें। अच्छी गुणवत्ता पर अधिक दर मिलती है।
२. **कपास (जलगांव / यवतमाल / संभाजीनगर):**
   • औसत भाव: **₹६,९०० से ₹७,३५० / क्विंटल** (MSP: ₹७,१२१)
   • सुझाव: सूखी और साफ कपास मंडी लाएं।
३. **प्याज (लासलगांव / पिंपलगांव / पुणे):**
   • औसत भाव: **₹१,४०० से ₹२,४०० / क्विंटल**
   • सुझाव: ग्रेडिंग अनुसार सुपर व मीडियम प्याज अलग कर बेचें।
४. **अरहर / चना:**
   • अरहर (तूर): **₹९,००० से ₹१०,२५० / क्विंटल**
   • चना: **₹५,८०० से ₹६,३०० / क्विंटल**

💡 *सुझाव: दैनिक भाव आवक अनुसार बदलते हैं। मंडी ले जाने से पूर्व स्थानीय APMC से दर सत्यापित करें।*""",
        "en": """💰 **Maharashtra APMC Mandi Market Prices & Advisory:**

1. **Soybean (Latur / Akola / Washim APMC):**
   • Current Range: **₹4,400 to ₹4,850 / quintal** (Govt MSP: ₹4,892)
   • Tip: Ensure moisture content is under 10% for premium buyers.
2. **Cotton (Jalgaon / Yavatmal / Sambhajinagar APMC):**
   • Current Range: **₹6,900 to ₹7,350 / quintal** (Govt MSP: ₹7,121)
   • Tip: Clean, dry, long-staple cotton fetches peak market rates.
3. **Onion (Lasalgaon / Pimpalgaon / Pune APMC):**
   • Current Range: **₹1,400 to ₹2,400 / quintal**
   • Tip: Grade into super, medium, and small bulbs to maximize revenue.
4. **Pigeon Pea (Tur) & Gram (Chana):**
   • Tur: **₹9,000 to ₹10,250 / quintal**
   • Chana: **₹5,800 to ₹6,300 / quintal**

💡 *Note: Real-time rates fluctuate daily based on arrivals and quality grading.*"""
    }
]

# Action definitions mapping action keys to friendly labels
ACTION_DEFINITIONS = {
    "prediction": {
        "type": "navigate",
        "page": "prediction",
        "mr": "पीक अंदाज पृष्ठावर जा 🚀",
        "hi": "फसल पूर्वानुमान पेज खोलें 🚀",
        "en": "Open Crop Prediction 🚀"
    },
    "recommendation": {
        "type": "navigate",
        "page": "recommendation",
        "mr": "माती सल्ला पृष्ठावर जा 🌱",
        "hi": "मृदा सलाह पेज खोलें 🌱",
        "en": "Open Soil Advisory 🌱"
    },
    "weather": {
        "type": "navigate",
        "page": "weather",
        "mr": "हवामान अंदाज पहा 🌦️",
        "hi": "मौसम पूर्वानुमान देखें 🌦️",
        "en": "Open Weather Forecast 🌦️"
    },
    "reports": {
        "type": "navigate",
        "page": "reports",
        "mr": "शेती अहवाल (PDF) पहा 📄",
        "hi": "कृषि PDF रिपोर्ट देखें 📄",
        "en": "View Farm PDF Reports 📄"
    },
    "history": {
        "type": "navigate",
        "page": "history",
        "mr": "मागील अंदाज इतिहास 📜",
        "hi": "पूर्व रिकॉर्ड इतिहास 📜",
        "en": "View Prediction History 📜"
    },
    "download_app": {
        "type": "modal",
        "target": "install_modal",
        "mr": "मोबाईल अ‍ॅप डाऊनलोड करा 📲",
        "hi": "मोबाइल ऐप डाउनलोड करें 📲",
        "en": "Download & Install App 📲"
    },
    "profile": {
        "type": "navigate",
        "page": "profile",
        "mr": "माझी शेतकरी प्रोफाइल 👤",
        "hi": "किसान प्रोफाइल देखें 👤",
        "en": "View Farmer Profile 👤"
    },
    "admin": {
        "type": "navigate",
        "page": "admin",
        "mr": "प्रशासक पॅनेल उघडा 🛡️",
        "hi": "एडमिन पैनल खोलें 🛡️",
        "en": "Open Admin Command Center 🛡️"
    }
}

def extract_action_from_reply(reply_text: str, lang: str = "mr") -> tuple:
    """
    Looks for [[ACTION:page_key]] in the reply string.
    Returns (cleaned_reply, action_dict_or_None)
    """
    match = re.search(r"\[\[ACTION:([a-zA-Z_]+)\]\]", reply_text)
    if not match:
        return reply_text, None

    action_key = match.group(1).lower()
    cleaned = re.sub(r"\[\[ACTION:[a-zA-Z_]+\]\]", "", reply_text).strip()

    action_def = ACTION_DEFINITIONS.get(action_key)
    if not action_def:
        return cleaned, None

    action_obj = {
        "type": action_def.get("type", "navigate"),
        "page": action_def.get("page", action_key),
        "target": action_def.get("target", None),
        "label": action_def.get(lang, action_def.get("en", "Open Feature"))
    }
    return cleaned, action_obj

def generate_fallback_response(query: str, lang: str = "mr") -> tuple:
    """
    Searches the comprehensive KrushiMitra knowledge base.
    Returns (reply_text, action_dict_or_None)
    """
    q_lower = query.lower().strip()
    
    # 1. Match against extensive domain knowledge base
    for item in KNOWLEDGE_BASE:
        for kw in item["keywords"]:
            if kw.lower() in q_lower:
                raw_reply = item.get(lang, item.get("mr", item["en"]))
                cleaned, action = extract_action_from_reply(raw_reply, lang)
                if not action and "action" in item:
                    action_def = ACTION_DEFINITIONS.get(item["action"])
                    if action_def:
                        action = {
                            "type": action_def.get("type", "navigate"),
                            "page": action_def.get("page", item["action"]),
                            "target": action_def.get("target", None),
                            "label": action_def.get(lang, action_def.get("en", "Open Feature"))
                        }
                return cleaned, action
    
    # 2. General intelligent assistant response
    if lang == "mr":
        reply = f"""🌱 **कृषीमित्र AI शेती व सहाय्यक सल्ला:**

आपण विचारलेल्या **"{query}"** प्रश्नाबाबत खालील माहिती व मार्गदर्शक तत्त्वे पाळा:

• **पिकाची योग्य तपासणी (Field Scouting):** शेतात कीड किंवा रोगाची सुरुवातीची लक्षणे ओळखा.
• **एकात्मिक कीड व्यवस्थापन (IPM):** रासायनिक फवारणीपूर्वी ५% निंबोळी अर्क, कामगंध सापळे आणि चिकट सापळ्यांचा वापर करा.
• **संतुलित खत वापर:** माती परीक्षणाच्या अहवालानुसार नत्र, स्फुरद, पालाश व सूक्ष्मअन्नद्रव्ये विभागून द्या.
• **कृषीमित्र डिजिटल साधने:** पीक उत्पादन अंदाज काढण्यासाठी व माती सल्ल्यासाठी वरील मेनूचा वापर करू शकता.

💡 *आपण मला कोणत्याही पिकाचे नाव (उदा. कापूस, सोयाबीन, कांदा, टोमॅटो), खतांचे प्रमाण, हवामान किंवा शासकीय योजनांबद्दल थेट विचारू शकता!*"""
    elif lang == "hi":
        reply = f"""🌱 **कृषि-मित्र AI कृषि एवं सहायक सलाह:**

आपके द्वारा पूछे गए प्रश्न **"{query}"** के संदर्भ में निम्नलिखित मुख्य सुझाव:

• **नियमित फसल निगरानी:** खेत में रोग एवं कीट के प्रारंभिक लक्षणों की समय पर पहचान करें।
• **एकीकृत कीट प्रबंधन (IPM):** रासायनिक दवाओं से पहले नीम तेल, फेरोमोन ट्रैप और जैविक फफूंदनाशक अपनाएं।
• **संतुलित उर्वरक प्रबंधन:** मृदा स्वास्थ्य पत्रक के आधार पर NPK और सूक्ष्म पोषक तत्वों का संतुलित प्रयोग करें।
• **कृषि-मित्र ऑनलाइन टूल्स:** अपनी फसल का सटीक पूर्वानुमान एवं मृदा सलाह पाने हेतु हमारे डिजिटल टूल्स का उपयोग करें।

💡 *आप मुझसे किसी भी फसल, खाद की मात्रा, मौसम या सरकारी योजनाओं के बारे में विस्तार से पूछ सकते हैं!*"""
    else:
        reply = f"""🌱 **KrushiMitra AI Agricultural & Assistant Advisory:**

Regarding your query **"{query}"**, here is best-practice guidance:

• **Field Scouting:** Routinely inspect crops for early symptoms of nutrient deficiency or pest infestations.
• **Integrated Pest Management (IPM):** Prioritize biological controls (5% Neem seed kernel extract, pheromone traps, Trichoderma) before chemical treatments.
• **Balanced Plant Nutrition:** Apply NPK fertilizers in split doses based on soil test results.
• **KrushiMitra Farm Tools:** Use our Yield Predictor to estimate harvest output and Soil Advisory for optimal crop selection.

💡 *You can ask me about any specific crop (Cotton, Soybean, Onion, Sugarcane, Tomato), fertilizer rates, live weather, or government schemes!*"""

    return reply, None

def chat_with_ai(message: str, lang: str = "mr", history: list = None, farmer_district: str = None) -> dict:
    """
    Main Assistant Chat Controller (ChatGPT / Gemini Grade & Siri/Alexa Style):
    1. Detects real-time live weather requests for farmer's city or 50+ Maharashtra locations.
    2. Returns structured weather_card metadata alongside rich voice-ready text.
    3. Calls Gemini 1.5/2.0 Flash with full conversation history, farmer location, and platform sitemap.
    4. Seamlessly falls back to the comprehensive multi-intent KrushiMitra Knowledge Engine.
    5. Automatically extracts actionable platform navigation buttons.
    """
    clean_msg = (message or "").strip()
    if not clean_msg:
        return {
            "success": False,
            "reply": "Please ask an agricultural or website question." if lang == "en" else "कृपया एक शेतीविषयक किंवा वेबसाइट संबंधित प्रश्न विचारा." if lang == "mr" else "कृपया कोई कृषि या वेबसाइट संबंधी प्रश्न पूछें.",
            "language": lang
        }

    # STEP 1: Live Weather Intent Detection (with farmer_district support)
    is_weather, city_key, original_city, is_my_city = detect_weather_query(clean_msg, farmer_district=farmer_district)
    if is_weather and city_key:
        weather_reply, weather_card = get_live_weather_report(city_key, original_city, lang, is_my_city=is_my_city)
        cleaned_text, action_obj = extract_action_from_reply(weather_reply, lang)
        return {
            "success": True,
            "reply": cleaned_text,
            "language": lang,
            "action": action_obj,
            "weather_card": weather_card,
            "source": "live_weather"
        }

    # STEP 2: Gemini API Integration (if key is set)
    if GEMINI_API_KEY and GEMINI_API_KEY.strip():
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"

            prompt_lang = "Marathi (मराठी)" if lang == "mr" else "Hindi (हिन्दी)" if lang == "hi" else "English"
            location_note = f"\nFarmer Location: Currently based in {farmer_district or 'Maharashtra'}, India. If they ask about their city, crops, or weather without specifying a location, reference {farmer_district or 'Maharashtra'}."
            
            contents = []
            contents.append({
                "role": "user",
                "parts": [{"text": f"System Guidelines:\n{SYSTEM_PROMPT}{location_note}\nAlways answer in {prompt_lang}."}]
            })
            contents.append({
                "role": "model",
                "parts": [{"text": f"Understood. I am KrushiMitra AI, ready to assist Indian and Maharashtra farmers in {prompt_lang} with agricultural science and platform navigation."}]
            })

            if history and isinstance(history, list):
                for item in history[-4:]:
                    role = "user" if item.get("role") == "user" else "model"
                    txt = item.get("content", "").strip()
                    if txt:
                        contents.append({"role": role, "parts": [{"text": txt}]})

            contents.append({
                "role": "user",
                "parts": [{"text": f"Question (Respond in {prompt_lang}):\n{clean_msg}"}]
            })

            payload = {
                "contents": contents,
                "generationConfig": {
                    "temperature": 0.35,
                    "maxOutputTokens": 800
                }
            }

            res = requests.post(url, json=payload, timeout=12)
            if res.status_code == 200:
                data = res.json()
                reply_text = data["candidates"][0]["content"]["parts"][0]["text"]
                cleaned_text, action_obj = extract_action_from_reply(reply_text, lang)
                
                if not action_obj:
                    for item in KNOWLEDGE_BASE:
                        if "action" in item:
                            if any(kw.lower() in clean_msg.lower() for kw in item["keywords"]):
                                action_def = ACTION_DEFINITIONS.get(item["action"])
                                if action_def:
                                    action_obj = {
                                        "type": action_def.get("type", "navigate"),
                                        "page": action_def.get("page", item["action"]),
                                        "target": action_def.get("target", None),
                                        "label": action_def.get(lang, action_def.get("en", "Open Feature"))
                                    }
                                break

                return {
                    "success": True,
                    "reply": cleaned_text.strip(),
                    "language": lang,
                    "action": action_obj,
                    "source": "gemini"
                }
            else:
                print(f"[Gemini API status {res.status_code}]: {res.text[:200]}")
        except Exception as e:
            print(f"[AI Assistant] Gemini API call exception: {e}. Falling back to knowledge engine.")

    # STEP 3: High-Coverage Knowledge & Navigation Engine
    fallback_reply, action_obj = generate_fallback_response(clean_msg, lang)
    return {
        "success": True,
        "reply": fallback_reply,
        "language": lang,
        "action": action_obj,
        "source": "knowledge_assistant"
    }
