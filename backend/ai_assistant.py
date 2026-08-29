import os
import re
import requests
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")

SYSTEM_PROMPT = """
You are "KrushiMitra AI" (कृषीमित्र AI), an expert agronomy and agricultural assistant dedicated to supporting Indian farmers, with a strong focus on Maharashtra agriculture.
Your role:
1. Provide accurate, practical, and eco-friendly farming advice for crops (Soybean, Cotton, Sugarcane, Wheat, Rice, Gram, Tur, Onion, Tomato, Pomegranate, Citrus, etc.).
2. Diagnose crop diseases and recommend IPM (Integrated Pest Management) including organic remedies (Neem oil, Trichoderma) and recommended chemicals with safe dosage.
3. Advise on fertilizer scheduling (NPK, micronutrients, compost, vermicompost), irrigation management (Drip, Sprinkler), and weather readiness.
4. Explain government agricultural schemes (PM-Kisan, PMFBY Crop Insurance, Magel Tyala Shettale, Kisan Credit Card).

Rules:
- Respond in the language requested by the user: Marathi (मराठी), Hindi (हिन्दी), or English.
- Keep responses well-structured with bullet points, bold key terms, and easy-to-read steps.
- Be polite, encouraging, and clear for farmers.
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

def detect_weather_query(query: str):
    """
    Checks if a query is asking for weather or climate information.
    Returns (is_weather, city_key, original_name)
    """
    q = query.lower().strip()
    is_weather = any(kw in q for kw in WEATHER_KEYWORDS)
    if not is_weather:
        return False, None, None

    # Check Devanagari city matches
    for dev_name, city_key in DEVANAGARI_CITY_MAP.items():
        if dev_name in q or dev_name in query:
            loc = MAHARASHTRA_LOCATIONS.get(city_key, {})
            return True, city_key, loc.get("name", city_key.title())

    # Check English city matches
    for city_key, loc in MAHARASHTRA_LOCATIONS.items():
        if city_key in q:
            return True, city_key, loc["name"]

    # If general weather was asked without explicit city, default to Pune
    return True, "pune", "Pune"

def get_live_weather_report(city_key: str, display_name: str, lang: str = "mr") -> str:
    """
    Fetches real-time weather from OpenWeather and generates an agricultural weather advisory.
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

            return f"""🌦️ **{city_title} चे थेट हवामान व शेती सल्ला:**

• 🌡️ **सध्याचे तापमान:** {temp}°C (अंगाला भासणारे: {feels_like}°C)
• 🌤️ **हवामान स्थिती:** {description} (ढगाळ प्रमाण: {cloudiness}%)
• 💧 **हवेतील आर्द्रता (Humidity):** {humidity}%
• 🌧️ **पाऊस:** {rain_1h} mm
• 💨 **वाऱ्याचा वेग:** {wind_speed} km/h • **दाब:** {pressure} hPa

🌾 **शेतकऱ्यांसाठी आजचा सल्ला:**
{advice_text}"""

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

            return f"""🌦️ **{city_title} का लाइव मौसम एवं कृषि सलाह:**

• 🌡️ **वर्तमान तापमान:** {temp}°C (महसूस होने वाला: {feels_like}°C)
• 🌤️ **मौसम स्थिति:** {description} (बादल: {cloudiness}%)
• 💧 **हवा में नमी (Humidity):** {humidity}%
• 🌧️ **वर्षा:** {rain_1h} mm
• 💨 **हवा की गति:** {wind_speed} km/h • **वायुदाब:** {pressure} hPa

🌾 **किसानों के लिए कृषि सुझाव:**
{advice_text}"""

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

            return f"""🌦️ **Live Weather & Farm Advisory for {city_title}:**

• 🌡️ **Current Temperature:** {temp}°C (Feels like: {feels_like}°C)
• 🌤️ **Weather Conditions:** {description} (Cloudiness: {cloudiness}%)
• 💧 **Relative Humidity:** {humidity}%
• 🌧️ **Precipitation:** {rain_1h} mm
• 💨 **Wind Speed:** {wind_speed} km/h • **Pressure:** {pressure} hPa

🌾 **Agronomic Recommendation:**
{advice_text}"""

    except Exception as e:
        print(f"[Weather Error]: {e}")
        if lang == "mr":
            return f"🌦️ **हवामान माहिती ({city_title}):**\nसध्या हवामान सर्व्हरशी संपर्क साधता आला नाही. कृपया शहराचे नाव पुन्हा तपासा किंवा काही वेळाने पुन्हा विचारा."
        elif lang == "hi":
            return f"🌦️ **मौसम जानकारी ({city_title}):**\nवर्तमान में मौसम डेटा उपलब्ध नहीं हो सका। कृपया पुनः प्रयास करें।"
        else:
            return f"🌦️ **Weather Advisory ({city_title}):**\nCould not fetch live weather data at this moment. Please try again."

# =========================================================
# DOMAIN KNOWLEDGE BASE (Offline Maharashtra Agronomy Engine)
# =========================================================

KNOWLEDGE_BASE = [
    {
        "keywords": ["बोंड अळी", "गुलाबी बोंड", "pink bollworm", "bollworm", "कपास की सुंडी", "कापूस अळी"],
        "mr": """🌱 **कापसावरील गुलाबी बोंड अळी नियंत्रण उपाय:**
1. **कामगंध सापळे (Pheromone Traps):** हेक्टरी ५ कामगंध सापळे लावावेत.
2. **जैविक उपाय:** ट्रायकोकार्ड्स (Trichogramma) वापरावे व ५% निंबोळी अर्काची फवारणी करावी.
3. **रासायनिक फवारणी (गरज भासल्यास):**
   - प्रादुर्भाव जास्त असल्यास **प्रोफेनोफॉस ५०% EC** (३० मिली/१० लिटर पाणी) किंवा **इमामेक्टिन बेन्झोएट ५% SG** (४.५ ग्रॅम/१० लिटर पाणी) फवारावे.
4. **सावधगिरी:** प्रादुर्भावग्रस्त बोंडे गोळा करून नष्ट करा.""",
        "hi": """🌱 **कपास में गुलाबी सुंडी (Pink Bollworm) नियंत्रण:**
1. **फेरोमोन ट्रैप:** प्रति एकड़ २-३ फेरोमोन ट्रैप लगाएं।
2. **जैविक नियंत्रण:** ५% नीम का तेल या नीम बीज अर्क का छिड़काव करें।
3. **रासायनिक कीटनाशक:**
   - **इमामेक्टिन बेंजोएट ५% SG** (४.५ ग्राम प्रति १० लीटर पानी) या **प्रोफेनोफॉस ५०% EC** (३० मिली प्रति १० लीटर पानी) का छिड़काव करें।
4. **सुझाव:** ग्रसित फूल व कलियां तोड़कर नष्ट करें।""",
        "en": """🌱 **Cotton Pink Bollworm Management:**
1. **Pheromone Traps:** Install 5 traps per hectare for monitoring.
2. **Biological Control:** Release Trichogramma parasitoids and spray 5% Neem Seed Kernel Extract (NSKE).
3. **Chemical Treatment:**
   - Spray **Emamectin Benzoate 5% SG** @ 4.5 g per 10 L water, or **Profenofos 50% EC** @ 30 ml per 10 L water during evening hours.
4. **Sanitation:** Collect and destroy affected rosetted flowers and dropped bolls."""
    },
    {
        "keywords": ["पिवळा मोजक", "मोज़ेक", "yellow mosaic", "सोयाबीन पिवळा", "सोयाबीन रोग", "mosaic virus"],
        "mr": """🌿 **सोयाबीनवरील पिवळा मोजक (Yellow Mosaic) रोग नियंत्रण:**
1. **कारणीभूत कीड:** हा विषाणू पांढऱ्या माशीमुळे (Whitefly) पसरतो.
2. **नियंत्रण उपाय:**
   - पांढऱ्या माशीच्या नियंत्रणासाठी शेतात **पिवळे चिकट सापळे (Yellow Sticky Traps)** लावा.
   - **थियामेथोक्सम २५% WG** (४ ग्रॅम/१० लिटर पाणी) किंवा **डायमेथोएट ३०% EC** (१५ मिली/१० लिटर पाणी) फवारावे.
3. **महत्त्वाचा सल्ला:** रोगट झाडे उपटून नष्ट करावीत जेणेकरून रोग पसरणार नाही.""",
        "hi": """🌿 **सोयाबीन में पीला मोज़ेक (Yellow Mosaic Virus) नियंत्रण:**
1. **कारण:** यह रोग सफेद मक्खी (Whitefly) द्वारा फैलता है।
2. **उपाय:**
   - खेत में प्रति एकड़ १०-१५ **पीले चिपचिपे कार्ड (Yellow Sticky Traps)** लगाएं।
   - सफेद मक्खी नियंत्रण हेतु **थियामेथोक्सम २५% WG** (४ ग्राम प्रति १० लीटर पानी) का छिड़काव करें।
3. **सावधानी:** रोगग्रस्त पौधों को उखाड़कर नष्ट कर दें।""",
        "en": """🌿 **Soybean Yellow Mosaic Virus Control:**
1. **Vector:** Spread by whiteflies (*Bemisia tabaci*).
2. **Management:**
   - Install **Yellow Sticky Traps** (10-12 per acre) to trap whiteflies.
   - Spray **Thiamethoxam 25% WG** @ 4 g / 10 L water or **Acetamiprid 20% SP** @ 3 g / 10 L water.
3. **Tip:** Rogue out and burn infected plants early to prevent secondary spread."""
    },
    {
        "keywords": ["सोयाबीन खत", "soybean fertilizer", "सोयाबीन खते", "सोयाबीन खाद"],
        "mr": """🌾 **सोयाबीन पिकाचे संतुलित खत व्यवस्थापन:**
1. **पेरणीवेळी (Basal Dose):**
   - **डीएपी (DAP):** ५० किलो किंवा **१०:२६:२६:** ७५ किलो प्रति एकर.
   - **सल्फर (गंधक):** १० किलो प्रति एकर (उत्पादन व तेलाचे प्रमाण वाढवण्यासाठी).
2. **वाढीच्या अवस्थेत (३०-३५ दिवसांनी):**
   - १९:१९:१९ विद्राव्य खत (७५ ग्रॅम/१० लिटर पाणी) फवारणी करावी.
3. **फुलोरा व शेंगा भरताना:**
   - ००:५२:३४ किंवा १३:००:४५ (१०० ग्रॅम/१० लिटर पाणी) फवारणी फायदेशीर ठरते.""",
        "hi": """🌾 **सोयाबीन फसल के लिए खाद व उर्वरक प्रबंधन:**
1. **बुवाई के समय:**
   - **DAP:** ५० किग्रा या **NPK १२:३२:१६:** ७५ किग्रा प्रति एकड़।
   - **सल्फर (गंधक):** १० किग्रा प्रति एकड़ (तेल की मात्रा बढ़ाने हेतु)।
2. **फूल व फली बनते समय:**
   - विलेय उर्वरक **००:५२:३४** (७५ ग्राम प्रति १० लीटर पानी) का छिड़काव करें।""",
        "en": """🌾 **Soybean Balanced Fertilizer Schedule:**
1. **Basal Application (At Sowing):**
   - **DAP:** 50 kg/acre or **NPK 10:26:26:** 75 kg/acre.
   - **Elemental Sulphur:** 10 kg/acre to boost pod development and oil percentage.
2. **Foliar Spray (Flowering & Pod Filling):**
   - Spray Water-Soluble **NPK 00:52:34** @ 75 g / 10 L water at 40-45 days."""
    },
    {
        "keywords": ["ऊस खत", "ऊस व्यवस्थापन", "sugarcane fertilizer", "गन्ना खाद", "गन्ना"],
        "mr": """🎋 **ऊस पिकाचे खत आणि पाणी व्यवस्थापन:**
1. **लागवडीवेळी:** हेक्टरी २५ टन शेणखत + ५० किलो नत्र, १०० किलो स्फुरद, १०० किलो पालाश द्यावे.
2. **६ ते ८ आठवड्यांनी:** ५० किलो नत्र (युरिया) द्यावा.
3. **मोठी बांधणी (४ ते ५ महिने):** १०० किलो नत्र + ५० किलो पालाश + सूक्ष्मअन्नद्रव्ये देऊन माती लावावी.
4. **सिंचन:** ठिबक सिंचनाचा वापर करून २५-३०% पाण्याची बचत करा व खते ठिबकमधून द्या (Fertigation).""",
        "hi": """🎋 **गन्ने की फसल के लिए उर्वरक एवं सिंचाई प्रबंधन:**
1. **बुवाई के समय:** गोबर की खाद + ५० किग्रा नाइट्रोजन, १०० किग्रा फास्फोरस, १०० किग्रा पोटाश प्रति हेक्टेयर।
2. **बड़ी बंधाई पर (४-५ माह):** १०० किग्रा नाइट्रोजन + सूक्ष्म पोषक तत्व दें।
3. **सिंचाई:** टपक सिंचाई (Drip) अपनाएं जिससे जल व खाद दोनों की बचत होती है।""",
        "en": """🎋 **Sugarcane Crop Management & Nutrition:**
1. **Basal Dose:** 25 tons FYM/ha + 50 kg N, 100 kg P2O5, 100 kg K2O per hectare.
2. **At Earthing-Up (4-5 months):** Top dress with 100 kg N and 50 kg K2O.
3. **Water Management:** Adopt Drip Irrigation (fertigation) to improve sugar recovery and save 40% water."""
    },
    {
        "keywords": ["गहू खत", "गहू पीक", "wheat fertilizer", "गेहूं खाद", "गेहूं रोग"],
        "mr": """🌾 **गहू पिकाचे दर्जेदार उत्पादन व्यवस्थापन:**
1. **खत मात्रा:** हेक्टरी १२० किलो नत्र, ६० किलो स्फुरद, ४० किलो पालाश.
2. **विभागून खते:** निम्मे नत्र व संपूर्ण स्फुरद-पालाश पेरणीवेळी, तर उर्वरित नत्र २१ दिवसांनी (मुकुट मुळे फुटताना).
3. **महत्त्वाचे सिंचन टप्पे:** मुकुट मुळे फुटताना (२१ दिवस), कांडी धरताना (४५ दिवस), फुलोऱ्यात (६५ दिवस), दाणे भरताना (८५ दिवस).""",
        "hi": """🌾 **गेहूं की फसल का उत्तम प्रबंधन:**
1. **उर्वरक:** १२० किग्रा नाइट्रोजन, ६० किग्रा फास्फोरस और ४० किग्रा पोटाश प्रति हेक्टेयर।
2. **क्रांतिक सिंचाई चरण:** सीआईआर अवस्था (२१ दिन), कल्ले फूटते समय (४० दिन), फूल आने पर (६५ दिन), और दाना भरते समय (८५ दिन)।""",
        "en": """🌾 **Wheat Crop Nutrition and Critical Irrigation Stages:**
1. **Recommended Fertilizer:** 120:60:40 kg N:P2O5:K2O per hectare.
2. **Critical Irrigation Stages:** Crown Root Initiation (21 days), Tillering (40-45 days), Flowering (65 days), and Milking/Grain filling (85 days)."""
    },
    {
        "keywords": ["pm kisan", "पीएम किसान", "किसान सन्मान निधी", "योजना", "अनुदान", "scheme", "subsidy", "विमा"],
        "mr": """🏛️ **प्रमुख शासकीय शेती योजना (महाराष्ट्र व भारत सरकार):**
1. **पीएम-किसान (PM-KISAN):** पात्र शेतकऱ्यांना वर्षाला ₹६,००० (३ हप्त्यांत थेट बँक खात्यात).
2. **नमो शेतकरी महासन्मान निधी:** महाराष्ट्र शासनाकडून अतिरिक्त ₹६,००० (एकूण ₹१२,००० वार्षिक).
3. **प्रधानमंत्री पीक विमा योजना (PMFBY):** नाममात्र ₹१ मध्ये सर्वसमावेशक पीक विमा.
4. **मागेल त्याला शेततळे / ठिबक अनुदान:** ५०% ते ७५% पर्यंत शासकीय अनुदान.
5. **नोंदणी:** https://pmkisan.gov.in किंवा जवळच्या महा-ई-सेवा केंद्रात संपर्क साधा.""",
        "hi": """🏛️ **प्रमुख सरकारी कृषि योजनाएं:**
1. **पीएम-किसान योजना:** ₹६,००० प्रति वर्ष तीन किस्तों में किसानों के बैंक खाते में।
2. **प्रधानमंत्री फसल बीमा योजना:** प्राकृतिक आपदा से नुकसान पर न्यूनतम प्रीमियम में पूर्ण सुरक्षा।
3. **ड्रिप व स्प्रिंकलर सब्सिडी:** सूक्ष्म सिंचाई पर ५०% से ७०% तक अनुदान।""",
        "en": """🏛️ **Key Government Agricultural Schemes:**
1. **PM-KISAN Scheme:** Direct benefit of ₹6,000/year in three ₹2,000 instalments.
2. **Namo Shetkari Mahasanman Nidhi:** Additional ₹6,000/year for Maharashtra farmers.
3. **PMFBY Crop Insurance:** Comprehensive risk cover for crops against weather anomalies.
4. **Micro-Irrigation Subsidy:** 50% to 75% subsidy on Drip and Sprinkler systems."""
    },
    {
        "keywords": ["माती परीक्षण", "soil test", "ph", "सामू", "माती आरोग्य"],
        "mr": """🧪 **माती परीक्षण आणि जमीन आरोग्य व्यवस्थापन:**
1. **सामू (pH):** ६.५ ते ७.५ दरम्यान असल्यास जमिनीतील सर्व अन्नद्रव्ये पिकाला सहज उपलब्ध होतात.
2. **खारवट जमीन (pH > ८.५):** जिप्समचा वापर करा व सेंद्रिय खते वाढवा.
3. **आम्लधर्मी जमीन (pH < ६.०):** चुन्याचा (Lime) वापर करा.
4. **नियमित सेंद्रिय खत:** दरवर्षी एकरी ३-५ ट्रॉली शेणखत किंवा गांडूळ खत वापरल्यास मातीची सुपीकता टिकून राहते.""",
        "hi": """🧪 **मृदा परीक्षण एवं भूमि स्वास्थ्य सुधार:**
1. **उचित pH स्तर:** ६.५ से ७.५ की मिट्टी फसलों के लिए सबसे उपजाऊ होती है।
2. **क्षारीय मिट्टी (pH > ८.५):** जिप्सम और हरी खाद (ढैंचा) का प्रयोग करें।
3. **अम्लीय मिट्टी (pH < ६.०):** चूना डालकर सुधार करें।""",
        "en": """🧪 **Soil Health and pH Correction:**
1. **Optimal pH:** 6.5 to 7.5 provides the highest nutrient availability to crops.
2. **Alkaline Soils (pH > 8.5):** Apply Agricultural Gypsum and incorporate green manure (Dhaincha).
3. **Acidic Soils (pH < 6.0):** Apply Agricultural Lime.
4. **Organic Matter:** Add 3-5 tonnes of farmyard manure or vermicompost per acre annually."""
    },
    {
        "keywords": ["टोमॅटो", "tomato", "करपा", "blight", "फळ पोखरणारी"],
        "mr": """🍅 **टोमॅटो पिकावरील करपा व कीड नियंत्रण:**
1. **लवकर व उशिरा येणारा करपा (Blight):**
   - **मँकोझेब ७५% WP** (२५ ग्रॅम/१० लिटर) किंवा **अझॉक्सीस्ट्रॉबिन २३% SC** (१० मिली/१० लिटर) फवारावे.
2. **फळ पोखरणारी अळी:**
   - **इमामेक्टिन बेन्झोएट ५% SG** (४ ग्रॅम/१० लिटर पाणी) फवारावे.
3. **कॅल्शियम कमतरता (Blossom End Rot):**
   - कॅल्शियम नायट्रेट (५० ग्रॅम/१० लिटर) फवारावे व जमिनीला नियमित ओलावा ठेवावा.""",
        "hi": """🍅 **टमाटर में झुलसा (Blight) एवं फल छेदक नियंत्रण:**
1. **झुलसा रोग:** मैन्कोजेब ७५% WP (२.५ ग्राम प्रति लीटर पानी) का छिड़काव करें।
2. **फल छेदक कीट:** इमामेक्टिन बेंजोएट ५% SG (४ ग्राम प्रति १० लीटर पानी) का छिड़काव करें।""",
        "en": """🍅 **Tomato Blight & Fruit Borer Management:**
1. **Early & Late Blight:** Spray **Mancozeb 75% WP** @ 25 g / 10 L water or **Azoxystrobin 23% SC** @ 10 ml / 10 L water.
2. **Fruit Borer:** Spray **Emamectin Benzoate 5% SG** @ 4.5 g / 10 L water.
3. **Blossom End Rot:** Foliar spray of Calcium Nitrate @ 50 g / 10 L water."""
    }
]

def generate_fallback_response(query: str, lang: str = "mr") -> str:
    """
    Search the domain knowledge base for keyword matches.
    Provides helpful, complete agricultural guidance.
    """
    q_lower = query.lower().strip()
    
    # Try exact match with knowledge base
    for item in KNOWLEDGE_BASE:
        for kw in item["keywords"]:
            if kw.lower() in q_lower:
                return item.get(lang, item.get("mr", item["en"]))
    
    # General intelligent fallback if no specific keyword matched
    if lang == "mr":
        return f"""🌱 **कृषीमित्र AI सल्ला:**
आपण विचारलेल्या **"{query}"** प्रश्नाबाबत खालील सामान्य कृषी मार्गदर्शक तत्त्वे पाळा:
1. **पिकाची योग्य तपासणी:** शेतात कीड किंवा रोगाची लक्षणे सुरुवातीलाच ओळखा.
2. **एकात्मिक कीड व्यवस्थापन (IPM):** रासायनिक औषधांआधी ५% निंबोळी अर्क, पिवळे/निळे चिकट सापळे आणि कामगंध सापळ्यांचा वापर करा.
3. **संतुलित खत वापर:** माती परीक्षणाच्या अहवालानुसार नत्र, स्फुरद, पालाश व सूक्ष्मअन्नद्रव्ये विभागून द्या.
4. **हवामान अंदाज:** फवारणी करताना पाऊस व वाऱ्याचा वेग तपासा.

💡 *अधिक विशिष्ट सल्ल्यासाठी पिकाचे नाव, लक्षणे किंवा जमिनीचा प्रकार विचारून प्रश्न विचारा (उदा. 'सोयाबीन वरील कीड', 'कापूस खत व्यवस्थापन').*"""
    elif lang == "hi":
        return f"""🌱 **कृषि-मित्र AI सलाह:**
आपके द्वारा पूछे गए **"{query}"** के लिए निम्नलिखित सामान्य कृषि दिशानिर्देश:
1. **फसल निगरानी:** खेत में कीट व रोग के प्रारंभिक लक्षणों की नियमित जांच करें।
2. **एकीकृत कीट नियंत्रण (IPM):** रासायनिक दवाओं से पहले नीम तेल, फेरोमोन ट्रैप और स्टिकी कार्ड का उपयोग करें।
3. **संतुलित उर्वरक:** मृदा परीक्षण के आधार पर NPK एवं सूक्ष्म पोषक तत्वों का संतुलित प्रयोग करें।
4. **मौसम अनुकूलता:** कीटनाशक छिड़काव से पहले हवा की गति और वर्षा का पूर्वानुमान देखें।

💡 *विशिष्ट जानकारी के लिए कृपया फसल का नाम और लक्षण लिखकर पूछें (उदा. 'कपास में खाद', 'टमाटर का झुलसा रोग')।*"""
    else:
        return f"""🌱 **KrushiMitra AI Advisory:**
Regarding your query **"{query}"**, here are general best-practice agronomic recommendations:
1. **Field Scouting:** Inspect crops regularly for early symptoms of pests or nutrient deficiencies.
2. **Integrated Pest Management (IPM):** Employ 5% Neem Seed Kernel Extract (NSKE), pheromone traps, and yellow sticky traps before chemical pesticides.
3. **Balanced Plant Nutrition:** Apply NPK fertilizers in split doses according to your soil health test.
4. **Weather Preparedness:** Check wind speed and rainfall before spraying foliar nutrients.

💡 *For detailed remedies, feel free to mention specific crops and symptoms (e.g. 'Soybean yellow mosaic', 'Cotton bollworm control', 'Sugarcane drip fertilizer').*"""


def chat_with_ai(message: str, lang: str = "mr", history: list = None) -> dict:
    """
    Main chat controller:
    1. Checks if the user is asking about live weather/rain/temperature for a city/district.
    2. If yes, fetches live real-time OpenWeather telemetry and returns accurate forecast.
    3. If no, queries Gemini API or Maharashtra Agronomy Knowledge Engine.
    """
    clean_msg = (message or "").strip()
    if not clean_msg:
        return {
            "success": False,
            "reply": "Please ask an agricultural question." if lang == "en" else "कृपया एक शेतीविषयक प्रश्न विचारा." if lang == "mr" else "कृपया एक कृषि संबंधी प्रश्न पूछें.",
            "language": lang
        }

    # STEP 1: Live Weather Intent Detection
    is_weather, city_key, original_city = detect_weather_query(clean_msg)
    if is_weather and city_key:
        weather_reply = get_live_weather_report(city_key, original_city, lang)
        return {
            "success": True,
            "reply": weather_reply,
            "language": lang,
            "source": "live_weather"
        }

    # STEP 2: If Gemini API key is configured, call Gemini API
    if GEMINI_API_KEY and GEMINI_API_KEY.strip():
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
            
            prompt_lang = "Marathi" if lang == "mr" else "Hindi" if lang == "hi" else "English"
            full_prompt = f"{SYSTEM_PROMPT}\n\nUser Question (Respond in {prompt_lang}):\n{clean_msg}"
            
            payload = {
                "contents": [
                    {
                        "parts": [{"text": full_prompt}]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.4,
                    "maxOutputTokens": 600
                }
            }
            
            res = requests.post(url, json=payload, timeout=10)
            if res.status_code == 200:
                data = res.json()
                reply_text = data["candidates"][0]["content"]["parts"][0]["text"]
                return {
                    "success": True,
                    "reply": reply_text.strip(),
                    "language": lang,
                    "source": "gemini"
                }
        except Exception as e:
            print(f"[AI Assistant] Gemini API call exception: {e}. Falling back to knowledge engine.")

    # STEP 3: High-quality offline knowledge base fallback
    fallback_reply = generate_fallback_response(clean_msg, lang)
    return {
        "success": True,
        "reply": fallback_reply,
        "language": lang,
        "source": "knowledge_engine"
    }
