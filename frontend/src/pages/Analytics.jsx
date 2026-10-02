import { useState, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  Activity,
  Layers,
  MapPin,
  Calendar,
  Filter,
  Download,
  Printer,
  Sparkles,
  Sprout,
  Droplets,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  Wheat,
  Sun,
  CloudRain,
  Check,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { useApp } from "../context/AppContext";

// Color Palette tailored to modern clean agricultural design
const CROP_COLORS = [
  "#2E7D32", // Forest Green
  "#10B981", // Emerald
  "#F59E0B", // Amber / Gold
  "#3B82F6", // Sky Blue
  "#8B5CF6", // Purple
  "#EC4899", // Rose
  "#14B8A6", // Teal
  "#F97316", // Coral Orange
];

export const MAHARASHTRA_ALL_DISTRICTS = [
  "Ahmednagar",
  "Akola",
  "Amravati",
  "Aurangabad",
  "Beed",
  "Bhandara",
  "Buldhana",
  "Chandrapur",
  "Dhule",
  "Gadchiroli",
  "Gondia",
  "Hingoli",
  "Jalgaon",
  "Jalna",
  "Kolhapur",
  "Latur",
  "Mumbai",
  "Nagpur",
  "Nanded",
  "Nandurbar",
  "Nashik",
  "Osmanabad",
  "Palghar",
  "Parbhani",
  "Pune",
  "Raigad",
  "Ratnagiri",
  "Sangli",
  "Satara",
  "Sindhudurg",
  "Solapur",
  "Thane",
  "Wardha",
  "Washim",
  "Yavatmal",
];

// Comprehensive Agro-Climatic Profile & Baseline Telemetry for Maharashtra Districts
export const DISTRICT_AGRO_PROFILES = {
  ahmednagar: {
    district: "Ahmednagar",
    yield: 4.25,
    rainfall: 520,
    n: 65,
    p: 36,
    k: 40,
    ph: 7.8,
    organic: 60,
    zone: "Semi-Arid Deccan Plateau",
    topCrop: "Sugarcane / Bajra",
    cropDiversity: [
      { crop: "Bajra", value: 30 },
      { crop: "Sugarcane", value: 25 },
      { crop: "Onion", value: 20 },
      { crop: "Soybean", value: 15 },
      { crop: "Pomegranate", value: 10 },
    ],
    insights: {
      nutrient: {
        en: "High calcium carbonate and alkaline pH (7.8). Apply gypsum or sulfur amendments and green manuring (dhaincha) to lower alkalinity.",
        mr: "जमिनीत चुनखडीचे प्रमाण जास्त व अल्कधर्मी सामू (७.८) आहे. जिप्सम, गंधक आणि ताग/धैंचाचे हिरवळीचे खत देऊन क्षारता कमी करावी.",
        hi: "मिट्टी में चूना अधिक और क्षारीय पीएच (7.8) है। जिप्सम, गंधक और ढैंचा की हरी खाद डालकर क्षारीयता को संतुलित करें।",
      },
      irrigation: {
        en: "Rain-shadow zone (520 mm annual). Drip fertigation is essential for sugarcane and onion to conserve the depleting water table.",
        mr: "कमी पावसाचा दुष्काळी पट्टा (५२० मिमी). ऊस व कांद्यासाठी ठिबक सिंचन वापरल्यास भूजल पातळी टिकवून ४०% पाण्याची बचत होते.",
        hi: "कम वर्षा वाला सूखाग्रस्त क्षेत्र (520 मिमी)। गन्ने और प्याज के लिए ड्रिप सिंचाई अपनाएं जिससे भूजल की बचत होगी।",
      },
      rotation: {
        en: "Rotate Sugarcane and Bajra with Chickpea (Harbara) or Moong to restore nitrogen and break persistent pest cycles.",
        mr: "ऊस व बाजरीनंतर हरभरा किंवा मुगासारखी कडधान्ये घेतल्यास जमिनीतील नत्र वाढतो व कीड-रोगांचे चक्र तुटते.",
        hi: "गन्ने और बाजरे के बाद चना या मूंग की फसल चक्र में शामिल करने से प्राकृतिक नाइट्रोजन बढ़ता है और कीट चक्र टूटता है।",
      },
    },
  },
  akola: {
    district: "Akola",
    yield: 4.45,
    rainfall: 780,
    n: 70,
    p: 38,
    k: 42,
    ph: 7.6,
    organic: 62,
    zone: "Vidarbha Black Soil Basin",
    topCrop: "Cotton / Soybean",
    cropDiversity: [
      { crop: "Cotton", value: 38 },
      { crop: "Soybean", value: 32 },
      { crop: "Tur", value: 16 },
      { crop: "Jowar", value: 8 },
      { crop: "Wheat", value: 6 },
    ],
    insights: {
      nutrient: {
        en: "Deep black vertisols with high clay. Add farmyard manure (FYM) to improve aeration and prevent compaction.",
        mr: "खोल काळी चिकणमाती जमीन. जमिनीत हवा खेळती राहण्यासाठी व टणकपणा रोखण्यासाठी शेणखत व कंपोस्टचा भरपूर वापर करावा.",
        hi: "गहरी काली चिकनी मिट्टी। मिट्टी में वायु संचार बेहतर करने और कठोरता रोकने के लिए गोबर की सड़ी खाद डालें।",
      },
      irrigation: {
        en: "Adopt broad bed furrow (BBF) layout to overcome August dry spells and drain excess torrential monsoon water.",
        mr: "रुंद वरंबा सरी (BBF) तंत्रज्ञान वापरा, जेणेकरून पावसाचा खंड पडल्यास ओलावा टिकेल आणि अतिवृष्टीत पाणी साचणार नाही.",
        hi: "ब्रॉड बेड फरो (BBF) विधि अपनाएं, जिससे सूखे में नमी बनी रहे और भारी बारिश में जलभराव न हो।",
      },
      rotation: {
        en: "Cotton + Tur (6:1) intercropping optimizes land use and minimizes financial risks of market volatility.",
        mr: "कापूस + तूर (६:१) आंतरपीक पद्धत अत्यंत फायदेशीर ठरते आणि बाजारभावातील चढ-उतारांपासून शेतकऱ्याचे संरक्षण करते.",
        hi: "कपास + अरहर (6:1) अंतर-फसल प्रणाली अपनाएं, जिससे भूमि का समुचित उपयोग होगा और जोखिम कम होगा।",
      },
    },
  },
  amravati: {
    district: "Amravati",
    yield: 4.6,
    rainfall: 840,
    n: 72,
    p: 40,
    k: 38,
    ph: 7.5,
    organic: 65,
    zone: "Vidarbha Orange & Cotton Belt",
    topCrop: "Cotton / Orange",
    cropDiversity: [
      { crop: "Cotton", value: 36 },
      { crop: "Soybean", value: 30 },
      { crop: "Orange", value: 18 },
      { crop: "Tur", value: 10 },
      { crop: "Wheat", value: 6 },
    ],
    insights: {
      nutrient: {
        en: "High moisture retention black regur soil. Foliar zinc and boron sprays are crucial for orange fruit set and quality.",
        mr: "काळी कसदार जमीन. संत्रा बागांमध्ये फळगळ रोखण्यासाठी व दर्जेदार उत्पादनासाठी झिंक आणि बोरॉनची फवारणी आवश्यक आहे.",
        hi: "काली उपजाऊ मिट्टी। संतरा फल की गुणवत्ता और फल झड़ने से रोकने के लिए जिंक और बोरॉन का छिड़काव करें।",
      },
      irrigation: {
        en: "Sub-surface drip for citrus orchards reduces evaporation losses during 40°C+ summer heat.",
        mr: "उन्हाळ्यात ४०°C पेक्षा जास्त तापमानात बाष्पीभवन टाळण्यासाठी संत्रा बागांना ठिबक सिंचनाद्वारे पाणी द्यावे.",
        hi: "गर्मियों में 40°C से अधिक तापमान में वाष्पीकरण रोकने के लिए संतरा बगीचों में ड्रिप सिंचाई का प्रयोग करें।",
      },
      rotation: {
        en: "Follow Kharif soybean with Rabi chickpea for high organic nitrogen enrichment and disease break.",
        mr: "खरीप सोयाबीननंतर रब्बीत हरभरा (दिग्विजय) घेतल्यास जमिनीची सुपीकता वाढते आणि उत्पादन खर्च कमी होतो.",
        hi: "खरीफ सोयाबीन के बाद रबी में चना लगाने से मिट्टी की प्राकृतिक उर्वरता बढ़ती है।",
      },
    },
  },
  aurangabad: {
    district: "Aurangabad",
    yield: 4.4,
    rainfall: 650,
    n: 68,
    p: 37,
    k: 42,
    ph: 7.7,
    organic: 61,
    zone: "Marathwada Central Agro-Zone",
    topCrop: "Cotton / Maize",
    cropDiversity: [
      { crop: "Cotton", value: 35 },
      { crop: "Maize", value: 25 },
      { crop: "Bajra", value: 18 },
      { crop: "Soybean", value: 12 },
      { crop: "Sweet Orange", value: 10 },
    ],
    insights: {
      nutrient: {
        en: "Medium black to shallow stony soils. Enhance organic carbon by applying 5 tonnes/acre well-decomposed FYM.",
        mr: "मध्यम काळी ते हलकी मुरमाड जमीन. एकरी ५ टन चांगले कुजलेले शेणखत टाकून सेंद्रिय कर्बाची पातळी सुधारावी.",
        hi: "मध्यम काली से पथरीली मिट्टी। 5 टन प्रति एकड़ सड़ी गोबर खाद डालकर मिट्टी का जैविक कार्बन सुधारें।",
      },
      irrigation: {
        en: "Farm ponds (Shet Tale) provide critical protective irrigation for cotton during flowering and boll formation.",
        mr: "शेततळ्यांमधील संरक्षित पाणी कापूस फुलोरा व बोंड भरण्याच्या अवस्थेत दिल्यास उत्पादनात २५% वाढ होते.",
        hi: "खेत तालाब (शेत तले) से फूल और गूलर बनते समय कपास को संरक्षित सिंचाई देने से उपज में 25% वृद्धि होती है।",
      },
      rotation: {
        en: "Maize followed by Rabi Gram or Wheat maintains soil aggregate stability and minimizes soil erosion.",
        mr: "मक्क्यानंतर रब्बी हंगामात हरभरा किंवा गहू घेतल्यास जमिनीची धूप थांबते व पोत टिकून राहतो.",
        hi: "मक्के के बाद रबी में चना या गेहूं लेने से मिट्टी का कटाव रुकता है और बनावट सुधरती है।",
      },
    },
  },
  beed: {
    district: "Beed",
    yield: 4.1,
    rainfall: 640,
    n: 64,
    p: 34,
    k: 39,
    ph: 7.8,
    organic: 58,
    zone: "Marathwada Rain-Shadow Zone",
    topCrop: "Soybean / Cotton",
    cropDiversity: [
      { crop: "Soybean", value: 35 },
      { crop: "Cotton", value: 30 },
      { crop: "Bajra", value: 15 },
      { crop: "Tur", value: 12 },
      { crop: "Sugarcane", value: 8 },
    ],
    insights: {
      nutrient: {
        en: "Moderate depth black soil with surface crusting. Shallow intercultural hoeing preserves root moisture.",
        mr: "मध्यम काळी जमीन. जमिनीवर पडणारा कडक पापुद्रा फोडण्यासाठी कोळपणी करून जमिनीतील ओलावा टिकवावा.",
        hi: "मध्यम काली मिट्टी में पपड़ी जमने की समस्या रहती है; हल्की निराई-गुड़ाई करके नमी को सुरक्षित रखें।",
      },
      irrigation: {
        en: "Adopt drought-tolerant short-duration soybean cultivars (JS 335, JS 93-05) to withstand rainfall gaps.",
        mr: "पावसाचा ताण सहन करणाऱ्या कमी कालावधीच्या सोयाबीन जातींची (JS 335, Phule Sangam) निवड करावी.",
        hi: "कम वर्षा वाले समय के लिए कम अवधि की सूखा-सहिष्णु सोयाबीन किस्मों का चयन करें।",
      },
      rotation: {
        en: "Intercropping Bajra + Tur or Soybean + Pigeon Pea minimizes weather risk and feeds cattle.",
        mr: "बाजरी + तूर किंवा सोयाबीन + तूर आंतरपीक पद्धतीमुळे दुष्काळी परिस्थितीतही खात्रीशीर उत्पन्न मिळते.",
        hi: "बाजरा + अरहर या सोयाबीन + अरहर की अंतर-फसल प्रणाली सूखे के जोखिम को कम करती है।",
      },
    },
  },
  bhandara: {
    district: "Bhandara",
    yield: 4.9,
    rainfall: 1300,
    n: 80,
    p: 44,
    k: 42,
    ph: 6.8,
    organic: 72,
    zone: "Eastern Vidarbha Wainganga Rice Bowl",
    topCrop: "Paddy (Rice) / Pulses",
    cropDiversity: [
      { crop: "Rice", value: 55 },
      { crop: "Pulses", value: 20 },
      { crop: "Soybean", value: 12 },
      { crop: "Wheat", value: 8 },
      { crop: "Sugarcane", value: 5 },
    ],
    insights: {
      nutrient: {
        en: "Yellowish-brown sandy loam (Morand) and acidic clay. Split nitrogen applications reduce leaching.",
        mr: "पिवळसर तपकिरी वाळूमिश्रित चिकणमाती. युरिया खताची मात्रा २ ते ३ हप्त्यांमध्ये दिल्यास नत्राचा अपव्यय टळतो.",
        hi: "पीली-भूरी बलुई दोमट मिट्टी। नाइट्रोजन (यूरिया) को दो से तीन किस्तों में देने से बहाव रुकता है।",
      },
      irrigation: {
        en: "System of Rice Intensification (SRI) with tank/lake irrigation delivers up to 25% higher paddy output.",
        mr: "तलावांचे मुबलक पाणी उपलब्ध असल्याने भाताची 'श्री' (SRI) पद्धत वापरल्यास २५% जास्त उत्पादन मिळते.",
        hi: "तालाबों के भरपूर पानी से धान की श्री (SRI) पद्धति अपनाकर 25% अधिक उपज प्राप्त की जा सकती है।",
      },
      rotation: {
        en: "Practice Utera/Para cropping: broadcast Gram or Linseed in standing paddy 10 days before harvest.",
        mr: "उतेरा पद्धत: भात कापणीपूर्वी १० दिवस आधी हरभरा किंवा जवस उभे पिकात फेकून दुबार पीक घ्यावे.",
        hi: "उतेरा पद्धति: धान की कटाई से 10 दिन पहले चना या अलसी खड़ी फसल में छिड़क कर दोहरा लाभ लें।",
      },
    },
  },
  buldhana: {
    district: "Buldhana",
    yield: 4.35,
    rainfall: 740,
    n: 69,
    p: 36,
    k: 41,
    ph: 7.6,
    organic: 60,
    zone: "Western Vidarbha Plateau",
    topCrop: "Soybean / Cotton",
    cropDiversity: [
      { crop: "Soybean", value: 38 },
      { crop: "Cotton", value: 32 },
      { crop: "Maize", value: 14 },
      { crop: "Tur", value: 10 },
      { crop: "Wheat", value: 6 },
    ],
    insights: {
      nutrient: {
        en: "Medium black soils prone to zinc deficiency. Apply zinc sulfate (10 kg/acre) before Kharif sowing.",
        mr: "जमिनीत झिंकची कमतरता आढळते. खरीप पेरणीपूर्वी एकरी १० किलो झिंक सल्फेट जमिनीतून द्यावे.",
        hi: "मिट्टी में जिंक की कमी पाई जाती है। खरीफ बुआई से पहले 10 किलो जिंक सल्फेट प्रति एकड़ डालें।",
      },
      irrigation: {
        en: "Contour bunding and in-situ moisture conservation enhance groundwater recharge on undulating land.",
        mr: "उताराच्या जमिनीवर समपातळी बांधबंदिस्ती केल्यास पावसाचे पाणी जमिनीत मुरून विहिरींची पातळी वाढते.",
        hi: "समोच्च मेड़बंदी (कंटूर बंडिंग) करके वर्षा जल को रोकें, जिससे भूजल स्तर में सुधार होगा।",
      },
      rotation: {
        en: "Soybean followed by Rabi Jowar or Chickpea provides reliable double-crop farm returns.",
        mr: "सोयाबीननंतर रब्बी ज्वारी किंवा हरभरा घेतल्यास दोन्ही हंगामात शाश्वत नफा मिळतो.",
        hi: "सोयाबीन के बाद रबी ज्वार या चना लेने से दोनों मौसम में पक्का मुनाफा होता है।",
      },
    },
  },
  chandrapur: {
    district: "Chandrapur",
    yield: 4.75,
    rainfall: 1200,
    n: 78,
    p: 42,
    k: 40,
    ph: 6.9,
    organic: 70,
    zone: "Eastern Vidarbha Forest Agro-Zone",
    topCrop: "Paddy (Rice) / Cotton",
    cropDiversity: [
      { crop: "Rice", value: 42 },
      { crop: "Cotton", value: 28 },
      { crop: "Soybean", value: 16 },
      { crop: "Tur", value: 8 },
      { crop: "Linseed", value: 6 },
    ],
    insights: {
      nutrient: {
        en: "Reddish sandy loam to clay alluvium rich in organic matter. Use PSB and Azotobacter biofertilizers.",
        mr: "सेंद्रिय घटकांनी समृद्ध तांबूस काळी जमीन. पीएसबी आणि अझोटोबॅक्टर जिवाणू संवर्धकाचा वापर करावा.",
        hi: "जैविक तत्वों से भरपूर लाल-काली मिट्टी। पीएसबी और एजोटोबैक्टर जैव उर्वरक का उपयोग करें।",
      },
      irrigation: {
        en: "High rainfall (1200 mm). Provide field drainage trenches in cotton plots to prevent root rot during July.",
        mr: "वार्षिक १२०० मिमी पाऊस. जुलै-ऑगस्टच्या मुसळधार पावसात कापसात पाणी साचू न देता चर काढून पाणी बाहेर काढावे.",
        hi: "भारी वर्षा (1200 मिमी)। जलभराव से जड़ सड़न रोकने के लिए कपास के खेतों में जल निकासी नालियां बनाएं।",
      },
      rotation: {
        en: "Lowland Rice followed by upland Cotton-Soybean creates balanced farm risk management.",
        mr: "सखल भागात भात आणि उंचवट्यावर कापूस-सोयाबीन लागवड केल्यास शेतीचा तोटा टळतो.",
        hi: "निचले खेतों में धान और ऊपरी खेतों में कपास-सोयाबीन लेने से जोखिम संतुलित रहता है।",
      },
    },
  },
  dhule: {
    district: "Dhule",
    yield: 4.3,
    rainfall: 610,
    n: 67,
    p: 35,
    k: 43,
    ph: 7.7,
    organic: 59,
    zone: "Khandesh Tapi Valley Basin",
    topCrop: "Cotton / Bajra",
    cropDiversity: [
      { crop: "Cotton", value: 38 },
      { crop: "Bajra", value: 24 },
      { crop: "Maize", value: 18 },
      { crop: "Soybean", value: 12 },
      { crop: "Groundnut", value: 8 },
    ],
    insights: {
      nutrient: {
        en: "Medium black along Tapi basin. Moderate potassium, low phosphorus. Apply single superphosphate (SSP).",
        mr: "तापी खोऱ्यातील मध्यम जमीन. स्फुरदाचे प्रमाण कमी असल्याने पेरणीवेळी सिंगल सुपर फॉस्फेटचा वापर करावा.",
        hi: "तापी घाटी की मध्यम मिट्टी। फास्फोरस की कमी के लिए सिंगल सुपर फास्फेट (SSP) का प्रयोग करें।",
      },
      irrigation: {
        en: "Semi-arid conditions; micro-sprinklers for maize and groundnut maximize water use efficiency.",
        mr: "कमी पाऊसमान. मका व भुईमुगासाठी तुषार सिंचन वापरल्यास पाण्याची मोठी बचत होऊन दाणे चांगले भरतात.",
        hi: "कम बारिश का क्षेत्र। मक्का और मूंगफली में फव्वारा (स्प्रिंकलर) सिंचाई से पानी की बचत और पैदावार अच्छी होती है।",
      },
      rotation: {
        en: "Cotton followed by Groundnut or Bajra keeps soil aerated and adds nitrogen naturally.",
        mr: "कापूसनंतर भुईमूग किंवा बाजरी घेतल्यास जमिनीतील हवेचे प्रमाण सुधारते व नत्र स्थिरीकरण होते.",
        hi: "कपास के बाद मूंगफली या बाजरा लेने से मिट्टी में प्राकृतिक नाइट्रोजन बढ़ता है।",
      },
    },
  },
  gadchiroli: {
    district: "Gadchiroli",
    yield: 4.65,
    rainfall: 1400,
    n: 82,
    p: 45,
    k: 38,
    ph: 6.6,
    organic: 76,
    zone: "Pranhita-Godavari Forest Agro-Zone",
    topCrop: "Paddy (Rice) / Minor Millets",
    cropDiversity: [
      { crop: "Rice", value: 62 },
      { crop: "Pulses", value: 15 },
      { crop: "Millets", value: 12 },
      { crop: "Soybean", value: 7 },
      { crop: "Oilseeds", value: 4 },
    ],
    insights: {
      nutrient: {
        en: "Red and yellow loamy forest soils with natural humus. Slightly acidic (6.6); ideal for paddy cultivation.",
        mr: "ह्युमसने समृद्ध लाल-पिवळसर जंगल जमीन. सामू ६.६ (किंचित आम्लधर्मी) असल्याने भात पिकासाठी अत्यंत अनुकूल आहे.",
        hi: "प्राकृतिक ह्यूमस से भरपूर लाल-पीली दोमट मिट्टी। हल्का अम्लीय (6.6) पीएच धान के लिए आदर्श है।",
      },
      irrigation: {
        en: "Heavy monsoon (>1400 mm). Store runoff in farm ponds and bhandaras for post-monsoon crop survival.",
        mr: "वार्षिक १४०० मिमीपेक्षा जास्त पाऊस. बंधारे व शेततळ्यात पाणी साठवून रब्बी पिकांना जीवदान द्यावे.",
        hi: "भारी वर्षा (>1400 मिमी)। रबी फसलों के लिए चेकडैम और तालाबों में वर्षा जल संचित करें।",
      },
      rotation: {
        en: "Grow scented indigenous rice varieties followed by Black Gram (Urad) or Wal.",
        mr: "सुवासिक देशी भात वाणांनंतर उडीद किंवा वाल पिकाची लागवड केल्यास शेतीचा दर्जा उंचावतो.",
        hi: "पारंपरिक सुगंधित धान के बाद उड़द या दलहन लेने से मिट्टी की उर्वरा शक्ति बनी रहती है।",
      },
    },
  },
  gondia: {
    district: "Gondia",
    yield: 4.85,
    rainfall: 1350,
    n: 81,
    p: 43,
    k: 41,
    ph: 6.7,
    organic: 74,
    zone: "Eastern Lake District of Maharashtra",
    topCrop: "Paddy (Rice) / Sugarcane",
    cropDiversity: [
      { crop: "Rice", value: 65 },
      { crop: "Sugarcane", value: 15 },
      { crop: "Gram", value: 10 },
      { crop: "Linseed", value: 6 },
      { crop: "Vegetables", value: 4 },
    ],
    insights: {
      nutrient: {
        en: "Lateritic alluvial sandy clay loam. Responsive to organic compost and balanced 80:40:40 N-P-K fertilizer.",
        mr: "वाळूमिश्रित चिकण जमीन. सेंद्रिय खतांसोबत ८०:४०:४० नत्र, स्फुरद, पालाश खतमात्रा दिल्यास बंपर भात उत्पादन मिळते.",
        hi: "बलुई चिकनी दोमट मिट्टी। जैविक खाद के साथ 80:40:40 एनपीके का संतुलित प्रयोग सर्वोत्तम है।",
      },
      irrigation: {
        en: "Historic Malguzari tanks network ensures dependable gravity surface water for rice paddies.",
        mr: "मालगुजारी तलावांच्या समृद्ध वारशामुळे भातशेतीला पाटाने शाश्वत पाणीपुरवठा होतो.",
        hi: "मालगुजारी तालाबों की ऐतिहासिक प्रणाली से धान की फसलों को भरपूर सिंचाई मिलती है।",
      },
      rotation: {
        en: "Rice-Gram-Summer Vegetable tri-seasonal rotation ensures consistent cash flow across seasons.",
        mr: "भात - हरभरा - उन्हाळी भाजीपाला अशी त्रिसूत्री पीक पद्धती वर्षभर आर्थिक स्थैर्य देते.",
        hi: "धान - चना - ग्रीष्मकालीन सब्जियां, यह त्रि-फसली चक्र वर्षभर किसानों को निरंतर आय देता है।",
      },
    },
  },
  hingoli: {
    district: "Hingoli",
    yield: 4.4,
    rainfall: 820,
    n: 71,
    p: 37,
    k: 40,
    ph: 7.5,
    organic: 63,
    zone: "Central Marathwada Agri-Hub",
    topCrop: "Soybean / Turmeric",
    cropDiversity: [
      { crop: "Soybean", value: 40 },
      { crop: "Turmeric", value: 22 },
      { crop: "Cotton", value: 18 },
      { crop: "Gram", value: 12 },
      { crop: "Jowar", value: 8 },
    ],
    insights: {
      nutrient: {
        en: "Fertile black cotton soil. Turmeric beds require organic compost and potassium for active curcumin synthesis.",
        mr: "हळदीसाठी अनुकूल काळी कसदार जमीन. हळदीमध्ये कुरकुमीन वाढवण्यासाठी पालाश आणि भरपूर शेणखत द्यावे.",
        hi: "हल्दी के लिए अनुकूल उपजाऊ काली मिट्टी। करक्यूमिन बढ़ाने के लिए पोटाश और जैविक खाद दें।",
      },
      irrigation: {
        en: "Raised-bed drip irrigation in turmeric prevents rhizome rot (Kand Kuj) and optimizes water economy.",
        mr: "गादीवाफ्यावर हळद लागवड करून ठिबक दिल्यास कंदकुजव्या रोगाचा प्रादुर्भाव टळतो व पाणी वाचते.",
        hi: "हल्दी में उठी हुई क्यारियों (बेड) पर ड्रिप सिंचाई से कंद सड़न रोग रुकता है और पानी बचता है।",
      },
      rotation: {
        en: "Intercrop turmeric with border maize or castor to provide partial shade and deter sucking pests.",
        mr: "हळदीच्या कडेने मका किंवा एरंडीची लागवड केल्यास अंशतः सावली मिळते व रसशोषक किडींपासून रक्षण होते.",
        hi: "हल्दी के चारों ओर मक्का या अरंडी लगाने से आंशिक छाया मिलती है और कीटों से सुरक्षा होती है।",
      },
    },
  },
  jalgaon: {
    district: "Jalgaon",
    yield: 5.1,
    rainfall: 690,
    n: 77,
    p: 44,
    k: 48,
    ph: 7.6,
    organic: 67,
    zone: "Khandesh Banana Capital & Tapi Plains",
    topCrop: "Banana / Cotton",
    cropDiversity: [
      { crop: "Banana", value: 35 },
      { crop: "Cotton", value: 30 },
      { crop: "Maize", value: 15 },
      { crop: "Soybean", value: 12 },
      { crop: "Wheat", value: 8 },
    ],
    insights: {
      nutrient: {
        en: "Deep alluvial black soil with excellent potassium reserves, ideally suited for heavy banana fruiting.",
        mr: "केळीसाठी अत्यंत पोषक पालाशयुक्त खोल काळी गाळाची जमीन. फळ पोसण्यासाठी पोटॅशियम अत्यंत फायदेशीर ठरते.",
        hi: "केले के लिए आदर्श पोटाश से भरपूर गहरी काली जलोढ़ मिट्टी। फल के विकास में पोटाश सहायक है।",
      },
      irrigation: {
        en: "High-density banana orchards demand automated drip fertigation with water-soluble 0:52:34 and 13:0:45.",
        mr: "केळीच्या बागांमध्ये ठिबक खत विद्राव्य (०:५२:३४ व १३:०:४५) दिल्यास घड वजनदार व दर्जेदार निघतात.",
        hi: "केले में ड्रिप द्वारा घुलनशील 0:52:34 व 13:0:45 फर्टिगेशन से घार का वजन और गुणवत्ता बढ़ती है।",
      },
      rotation: {
        en: "After banana uprooting, green manure with Sunhemp followed by Wheat or Cotton restores soil tilth.",
        mr: "केळी खोडव्यानंतर तागाचे हिरवळीचे खत गाडून रब्बीत गहू किंवा कापूस घेतल्यास जमिनीचा कस ताजा होतो.",
        hi: "केले के बाद सनई की हरी खाद दबाकर गेहूं या कपास लगाने से मिट्टी की ताकत दोबारा लौटती है।",
      },
    },
  },
  jalna: {
    district: "Jalna",
    yield: 4.45,
    rainfall: 680,
    n: 70,
    p: 38,
    k: 43,
    ph: 7.7,
    organic: 62,
    zone: "Marathwada Seed & Citrus Belt",
    topCrop: "Sweet Orange / Soybean",
    cropDiversity: [
      { crop: "Soybean", value: 34 },
      { crop: "Cotton", value: 28 },
      { crop: "Sweet Orange", value: 18 },
      { crop: "Bajra", value: 12 },
      { crop: "Gram", value: 8 },
    ],
    insights: {
      nutrient: {
        en: "Medium black calcareous soil. Prevent iron chlorosis in sweet orange orchards with chelated iron (Fe-EDDHA).",
        mr: "चुनखडीयुक्त मध्यम काळी जमीन. मोसंबी बागेतील पिवळेपणा घालवण्यासाठी चिलेटेड आयर्नची (Fe-EDDHA) आळवणी करावी.",
        hi: "चूनायुक्त मध्यम काली मिट्टी। मौसंबी में पीलापन दूर करने के लिए चिलेटेड आयरन (Fe-EDDHA) दें।",
      },
      irrigation: {
        en: "Drip irrigation with silver-black mulch sheets conserves up to 45% moisture during hot post-monsoon weeks.",
        mr: "मोसंबी व भाजीपाल्यात ठिबक आणि मल्चिंग पेपर वापरल्यास ऑक्टोबर हिटमध्ये ओलावा टिकून राहतो.",
        hi: "ड्रिप और मल्चिंग शीट के उपयोग से अक्टूबर की तेज धूप में भी 45% तक नमी सुरक्षित रहती है।",
      },
      rotation: {
        en: "Alternate soybean with chickpea (Digvijay) to break weed cycles and cut chemical fertilizer inputs.",
        mr: "सोयाबीननंतर हरभरा (दिग्विजय) पीक घेतल्यास तणांचे प्रमाण कमी होते आणि खतांचा खर्च वाचतो.",
        hi: "सोयाबीन के बाद चना फसल लेने से खरपतवार का चक्र टूटता है और खाद का खर्च कम होता है।",
      },
    },
  },
  kolhapur: {
    district: "Kolhapur",
    yield: 5.85,
    rainfall: 1250,
    n: 85,
    p: 48,
    k: 45,
    ph: 6.9,
    organic: 78,
    zone: "Panchganga Fertile Agricultural Valley",
    topCrop: "Sugarcane / Soybean",
    cropDiversity: [
      { crop: "Sugarcane", value: 45 },
      { crop: "Soybean", value: 25 },
      { crop: "Rice", value: 15 },
      { crop: "Groundnut", value: 8 },
      { crop: "Vegetables", value: 7 },
    ],
    insights: {
      nutrient: {
        en: "Highly fertile Panchganga alluvial soil with rich organic matter (78/100). Halt flood irrigation to curb salinity.",
        mr: "पंचगंगा खोऱ्यातील अत्यंत कसदार जमीन. जमिनी चोपण व खारवट होण्यापासून रोखण्यासाठी मोकाट पाणी देणे थांबवावे.",
        hi: "पंचगंगा घाटी की उपजाऊ मिट्टी। मिट्टी को खारा होने से बचाने के लिए खुला (फ्लड) पानी देना बंद करें।",
      },
      irrigation: {
        en: "Subsurface drip in sugarcane saves 40% water and prevents saline salt crust accumulation on the soil surface.",
        mr: "उसात जमिनीखालील (Subsurface) ठिबक सिंचन वापरल्यास उत्पादनात एकरी १०-१५ टन वाढ होते आणि क्षार साचत नाहीत.",
        hi: "गन्ने में सब-सरफेस ड्रिप से 40% पानी बचता है और जमीन की सतह पर खारे लवण नहीं जमते।",
      },
      rotation: {
        en: "Trash mulching in ratoon sugarcane combined with intercropped soybean delivers an extra 8 t/acre output.",
        mr: "खोडवा उसात पाचट व्यवस्थापन आणि सुरुवातीला सोयाबीनचे आंतरपीक घेतल्यास जमिनीचा पोत व उत्पन्न दोन्ही वाढतात.",
        hi: "पेड़ी गन्ने में सूखी पत्ती की मल्चिंग और सोयाबीन की अंतर-फसल लेने से मिट्टी और उपज दोनों बेहतर होती हैं।",
      },
    },
  },
  latur: {
    district: "Latur",
    yield: 4.5,
    rainfall: 780,
    n: 73,
    p: 39,
    k: 42,
    ph: 7.6,
    organic: 64,
    zone: "Marathwada Soybean & Pulse Trading Hub",
    topCrop: "Soybean / Tur (Pigeon Pea)",
    cropDiversity: [
      { crop: "Soybean", value: 42 },
      { crop: "Tur", value: 25 },
      { crop: "Gram", value: 15 },
      { crop: "Cotton", value: 10 },
      { crop: "Sugarcane", value: 8 },
    ],
    insights: {
      nutrient: {
        en: "Deep black regur soil with summer cracking. Deep summer plowing controls white grubs and aerates subsoil.",
        mr: "उन्हाळ्यात भेगा पडणारी काळी रेगूर जमीन. उन्हाळी खोल नांगरट केल्याने हुमणी कीड नष्ट होते व जमीन मोकळी होते.",
        hi: "गर्मियों में दरारें पड़ने वाली काली मिट्टी। गहरी जुताई से सफेद लट (हुमणी) नष्ट होती है और वायु संचार सुधरता है।",
      },
      irrigation: {
        en: "Farm pond water provides life-saving protective irrigation during critical soybean pod filling.",
        mr: "शेततळ्यातील पाणी सोयाबीनच्या शेंगा भरण्याच्या नाजूक टप्प्यात दिल्यास दाणे टपोरे भरतात व नुकसान टळते.",
        hi: "सोयाबीन की फली भरते समय खेत-तालाब से एक सुरक्षात्मक सिंचाई देने से दाना मोटा और वजनदार होता है।",
      },
      rotation: {
        en: "Soybean + Tur (4:2 pattern) generates top net returns and ensures insurance against uneven monsoon.",
        mr: "सोयाबीन + तूर (४:२ पट्टा पद्धत) सर्वाधिक फायदेशीर ठरते आणि पावसाच्या लहरीपणापासून विमा संरक्षण देते.",
        hi: "सोयाबीन + अरहर (4:2 विधि) सबसे अधिक मुनाफा देती है और अनियमित वर्षा में सुरक्षा कवच बनती है।",
      },
    },
  },
  mumbai: {
    district: "Mumbai",
    yield: 4.2,
    rainfall: 2200,
    n: 72,
    p: 40,
    k: 38,
    ph: 6.8,
    organic: 68,
    zone: "Coastal Urban & Peri-Urban Agro-Zone",
    topCrop: "Horticulture / Urban Veg",
    cropDiversity: [
      { crop: "Vegetables", value: 40 },
      { crop: "Leafy Greens", value: 30 },
      { crop: "Flowers", value: 20 },
      { crop: "Fruit Plants", value: 10 },
    ],
    insights: {
      nutrient: {
        en: "Coastal peri-urban soils. High humidity (>75%). Use vermicompost and enriched bio-char for container farming.",
        mr: "शहरी व लगतचा परिसर. हवेत भरपूर दमटपणा. गांडूळ खत आणि जैविक कंपोस्टचा वापर करून सेंद्रिय भाजीपाला पिकवावा.",
        hi: "तटीय शहरी क्षेत्र। उच्च आर्द्रता (>75%)। वर्मीकम्पोस्ट और जैविक खाद से हरी ताजी सब्जियां उगाएं।",
      },
      irrigation: {
        en: "Hydroponics, polyhouses, and automated misting maximize micro-yield per square foot.",
        mr: "पॉलिहाऊस, हायड्रोपोनिक्स आणि मिस्टिंग सिस्टीमचा वापर करून कमी जागेत दर्जेदार उत्पादन मिळवावे.",
        hi: "हाइड्रोपोनिक्स और पॉलीहाउस में सूक्ष्म फुहारों द्वारा कम स्थान में अधिकतम उपज प्राप्त करें।",
      },
      rotation: {
        en: "Fast-cycle leafy greens (Spinach, Coriander, Fenugreek) deliver weekly revenue in city markets.",
        mr: "पालक, कोथिंबीर, मेथी अशा जलद येणाऱ्या पालेभाज्यांची फेरपालट करून दर आठवड्याला रोख नफा मिळवावा.",
        hi: "पालक, धनिया, मेथी जैसी जल्दी तैयार होने वाली पत्तेदार सब्जियों से साप्ताहिक नकद आमदनी प्राप्त करें।",
      },
    },
  },
  nagpur: {
    district: "Nagpur",
    yield: 4.95,
    rainfall: 1050,
    n: 78,
    p: 42,
    k: 40,
    ph: 7.3,
    organic: 70,
    zone: "Vidarbha Orange Capital & Central Basin",
    topCrop: "Orange / Soybean",
    cropDiversity: [
      { crop: "Orange", value: 35 },
      { crop: "Soybean", value: 30 },
      { crop: "Cotton", value: 15 },
      { crop: "Tur", value: 12 },
      { crop: "Wheat", value: 8 },
    ],
    insights: {
      nutrient: {
        en: "Basalt-derived deep black soils. Apply organic FYM and micronutrient cocktail to boost orange brix.",
        mr: "बेसाल्ट खडकापासून बनलेली काळी जमीन. संत्रा गोडी व चकचकीतपणा वाढवण्यासाठी सूक्ष्म अन्नद्रव्यांची फवारणी करावी.",
        hi: "बेसाल्ट चट्टानों से बनी काली मिट्टी। संतरे की चमक और मिठास के लिए सूक्ष्म पोषक तत्वों का प्रयोग करें।",
      },
      irrigation: {
        en: "Regulated water deficit management is key to inducing prolific Ambia/Mrig bahar citrus flowering.",
        mr: "मृग व आंबिया बहराच्या योग्य फुलोऱ्यासाठी संत्रा झाडांना ठरवून पाण्याचा ताण देणे अत्यंत गरजेचे असते.",
        hi: "अंबिया और मृग बहार के अच्छे फूल आने के लिए संतरा पौधों को नियंत्रित पानी का तनाव देना आवश्यक है।",
      },
      rotation: {
        en: "Soybean in Kharif followed by Chickpea or Wheat under well irrigation in Rabi optimizes crop balance.",
        mr: "खरीप सोयाबीननंतर रब्बी हंगामात हरभरा किंवा गव्हाचे पीक बागायती पाण्यावर उत्तम येते.",
        hi: "खरीफ में सोयाबीन के बाद रबी में चना या गेहूं की फसल सिंचित अवस्था में बेहतरीन परिणाम देती है।",
      },
    },
  },
  nanded: {
    district: "Nanded",
    yield: 4.6,
    rainfall: 890,
    n: 74,
    p: 40,
    k: 41,
    ph: 7.5,
    organic: 65,
    zone: "Godavari Fertile Agricultural Basin",
    topCrop: "Cotton / Soybean",
    cropDiversity: [
      { crop: "Cotton", value: 36 },
      { crop: "Soybean", value: 32 },
      { crop: "Turmeric", value: 14 },
      { crop: "Tur", value: 10 },
      { crop: "Banana", value: 8 },
    ],
    insights: {
      nutrient: {
        en: "Rich alluvial black soil along Godavari river banks. Excellent nutrient capacity for high-value cash crops.",
        mr: "गोदावरी नदीकाठची समृद्ध काळी गाळाची जमीन. नगदी पिकांसाठी उत्तम सुपीकता; संतुलित नत्र-स्फुरद-पालाश द्यावे.",
        hi: "गोदावरी नदी तट की समृद्ध जलोढ़ काली मिट्टी। नकदी फसलों के लिए संतुलित एनपीके का प्रयोग करें।",
      },
      irrigation: {
        en: "Well-developed canal systems; avoid waterlogging in cotton during heavy late-August showers.",
        mr: "कालव्याचे मुबलक पाणी. ऑगस्टच्या मुसळधार पावसात कपाशीच्या शेतात चर काढून निचरा करावा.",
        hi: "नहरों का अच्छा नेटवर्क। अगस्त की तेज बारिश में कपास के खेतों में पानी खड़ा न होने दें।",
      },
      rotation: {
        en: "Rotate cotton with turmeric or pulses to curb fungal wilt (Fusarium) and maintain soil biodiversity.",
        mr: "कापूसनंतर हळद किंवा कडधान्ये घेतल्यास मर रोगाचा (Wilt) नायनाट होतो आणि जमिनीचा कस टिकतो.",
        hi: "कपास के बाद हल्दी या दलहन लेने से उकठा (विल्ट) रोग का प्रकोप रुकता है और मिट्टी उपजाऊ रहती है।",
      },
    },
  },
  nandurbar: {
    district: "Nandurbar",
    yield: 4.2,
    rainfall: 720,
    n: 66,
    p: 35,
    k: 38,
    ph: 7.4,
    organic: 62,
    zone: "Northern Satpura Foothills Agro-Zone",
    topCrop: "Chilli / Cotton",
    cropDiversity: [
      { crop: "Chilli", value: 30 },
      { crop: "Cotton", value: 28 },
      { crop: "Maize", value: 18 },
      { crop: "Bajra", value: 14 },
      { crop: "Pulses", value: 10 },
    ],
    insights: {
      nutrient: {
        en: "Shallow hillside soils to fertile valley black alluvium. Apply vermicompost for hot red chilli pungency.",
        mr: "सातपुड्याच्या पायथ्याची जमीन. मिरचीच्या तिखटपणासाठी व दर्जेदार रंगासाठी गांडूळ खताचा डोस द्यावा.",
        hi: "सतपुड़ा तलहटी की मिट्टी। लाल मिर्च के तीखेपन और अच्छे रंग के लिए केंचुआ खाद (वर्मीकम्पोस्ट) डालें।",
      },
      irrigation: {
        en: "Check dams and nalabunds along Satpura slopes recharge ground aquifers for post-monsoon vegetable crops.",
        mr: "सातपुड्याच्या उतारावर नालाबांध व चेकडॅम बांधल्याने हिवाळी भाजीपाल्यासाठी विहिरींना भरपूर पाणी राहते.",
        hi: "सतपुड़ा ढलानों पर चेकडैम बनाकर भूजल बढ़ाएं, जिससे सर्दियों की सब्जियों को भरपूर पानी मिले।",
      },
      rotation: {
        en: "Follow Red Chilli with Gram or Urad to break viral leaf curl and thrips buildup.",
        mr: "मिरची पिकाच्या फेरपालटीत हरभरा किंवा उडीद घेतल्यास चुरडा-मुरडा (Leaf curl) व थ्रिप्सचा प्रादुर्भाव मोडतो.",
        hi: "मिर्च के बाद चना या उड़द लगाने से पर्ण कुंचन (लीफ कर्ल) और थ्रिप्स कीट का चक्र टूटता है।",
      },
    },
  },
  nashik: {
    district: "Nashik",
    yield: 5.3,
    rainfall: 680,
    n: 76,
    p: 46,
    k: 52,
    ph: 7.2,
    organic: 72,
    zone: "Maharashtra Horticultural & Wine Capital",
    topCrop: "Grapes / Onion",
    cropDiversity: [
      { crop: "Onion", value: 34 },
      { crop: "Grapes", value: 26 },
      { crop: "Tomato", value: 16 },
      { crop: "Soybean", value: 14 },
      { crop: "Wheat", value: 10 },
    ],
    insights: {
      nutrient: {
        en: "High natural potassium reserves in Godavari valley soils, ideal for high grape brix and onion storage shelf-life.",
        mr: "गोदावरी खोऱ्यातील पोटॅशियमयुक्त कसदार जमीन. द्राक्षाची गोडी आणि कांद्याची टिकवणक्षमता वाढवण्यासाठी पालाशचा उत्तम फायदा होतो.",
        hi: "गोदावरी घाटी की पोटाश से भरपूर मिट्टी। अंगूर की मिठास और प्याज की भंडारण क्षमता के लिए यह बहुत उपयुक्त है।",
      },
      irrigation: {
        en: "Automated drip fertigation with tensiometers ensures exact moisture balance during grape berry thinning.",
        mr: "द्राक्षांमध्ये मणी फुगवणीच्या काळात ठिबक सिंचनाद्वारे अचूक खत व पाण्याचे नियोजन करावे.",
        hi: "अंगूर के दाने के विकास के समय ड्रिप फर्टिगेशन से पानी और खाद का सटीक संतुलन रखें।",
      },
      rotation: {
        en: "Kharif Onion followed by Rabi Wheat or late-season Tomato guarantees strong annual cash returns.",
        mr: "खरीप कांद्यानंतर रब्बीत गहू किंवा टोमॅटोची लागवड केल्यास वर्षभरात तीन पिकांचे भरघोस उत्पन्न मिळते.",
        hi: "खरीफ प्याज के बाद रबी गेहूं या टमाटर लगाने से वर्षभर में तीन फसलों का भरपूर लाभ मिलता है।",
      },
    },
  },
  osmanabad: {
    district: "Osmanabad",
    yield: 4.25,
    rainfall: 690,
    n: 67,
    p: 36,
    k: 41,
    ph: 7.7,
    organic: 60,
    zone: "Balaghat Semi-Arid Plateau",
    topCrop: "Soybean / Jowar",
    cropDiversity: [
      { crop: "Soybean", value: 36 },
      { crop: "Jowar", value: 24 },
      { crop: "Tur", value: 16 },
      { crop: "Gram", value: 14 },
      { crop: "Sugarcane", value: 10 },
    ],
    insights: {
      nutrient: {
        en: "Medium black soils with shallow stony sub-layers. Foliar sprays of 19:19:19 stimulate vegetative growth.",
        mr: "मध्यम काळी व काही भागात हलकी जमीन. फुटवे वाढवण्यासाठी १९:१९:१९ विद्राव्य खताची फवारणी करावी.",
        hi: "मध्यम काली और पथरीली मिट्टी। वानस्पतिक वृद्धि के लिए 19:19:19 घुलनशील खाद का छिड़काव करें।",
      },
      irrigation: {
        en: "Protective irrigation during critical grain filling of Rabi Jowar (Maldhandi) boosts grain yield by 30%.",
        mr: "रब्बी ज्वारी (मालदांडी) पोटाऱ्यात असताना एक संरक्षित पाणी दिल्यास दाणे भरदार होऊन ३०% उत्पादन वाढते.",
        hi: "रबी ज्वार (मालदांडी) में दाना बनते समय एक सुरक्षा सिंचाई देने से पैदावार 30% तक बढ़ जाती है।",
      },
      rotation: {
        en: "Intercropping Soybean with Tur (4:2 ratio) provides essential financial cushion against dry spells.",
        mr: "सोयाबीन + तूर (४:२) आंतरपीक घेतल्यास दुष्काळी स्थितीतही हमखास आर्थिक आधार मिळतो.",
        hi: "सोयाबीन + अरहर (4:2) अंतर-फसल सूखे के समय भी किसान को सुरक्षित आमदनी देती है।",
      },
    },
  },
  palghar: {
    district: "Palghar",
    yield: 4.7,
    rainfall: 2400,
    n: 75,
    p: 41,
    k: 39,
    ph: 6.4,
    organic: 73,
    zone: "North Konkan Coastal Agro-Zone",
    topCrop: "Rice / Chickoo (Sapota)",
    cropDiversity: [
      { crop: "Rice", value: 48 },
      { crop: "Sapota", value: 22 },
      { crop: "Vegetables", value: 15 },
      { crop: "Finger Millet", value: 10 },
      { crop: "Coconut", value: 5 },
    ],
    insights: {
      nutrient: {
        en: "Coastal lateritic sandy alluvium with acidic pH (6.2-6.5). Apply agricultural lime once every three years.",
        mr: "आम्लधर्मीय तांबूस जमीन (सामू ६.४). जमिनीचा आम्लदोष घालवण्यासाठी दर ३ वर्षांनी कृषी चुन्याचा वापर करावा.",
        hi: "तटीय बलुई दोमट अम्लीय मिट्टी (पीएच 6.4)। अम्लीयता कम करने के लिए हर 3 साल में कृषि चूना डालें।",
      },
      irrigation: {
        en: "Heavy torrential monsoon. Raised beds and drainage trenches protect sapota (chickoo) orchards from waterlogging.",
        mr: "अतिवृष्टीचा प्रदेश. चिकूच्या बागेत पाणी साचू न देता गादीवाफे व पाण्याचा निचरा करणारी चर काढावी.",
        hi: "भारी वर्षा वाला क्षेत्र। चीकू के बगीचों में जलभराव रोकने के लिए मेड़ बनाएं और जल निकासी नालियां रखें।",
      },
      rotation: {
        en: "Kharif Paddy followed by winter Wal (Lablab bean) or Capsicum utilizes residual ground moisture.",
        mr: "खरीप भातानंतर वाल किंवा ढोबळी मिरची घेतल्यास जमिनीत उरलेल्या ओलाव्याचा पूर्ण उपयोग होतो.",
        hi: "खरीफ धान के बाद सर्दियों में वाल (सेम) या शिमला मिर्च लेने से बची हुई नमी का पूरा लाभ मिलता है।",
      },
    },
  },
  parbhani: {
    district: "Parbhani",
    yield: 4.45,
    rainfall: 790,
    n: 72,
    p: 38,
    k: 42,
    ph: 7.6,
    organic: 63,
    zone: "Central Marathwada Agriculture University Belt",
    topCrop: "Cotton / Soybean",
    cropDiversity: [
      { crop: "Cotton", value: 38 },
      { crop: "Soybean", value: 32 },
      { crop: "Jowar", value: 14 },
      { crop: "Tur", value: 10 },
      { crop: "Gram", value: 6 },
    ],
    insights: {
      nutrient: {
        en: "Deep black vertisols with high swell-shrink capacity. Deep chiseling every 2-3 years breaks hard pan.",
        mr: "भारी खोल काळी जमीन. जमिनीचा टणक थर फोडण्यासाठी दर २-३ वर्षांनी सबसॉइलरने खोल नांगरट करावी.",
        hi: "गहरी काली मिट्टी। कठोर परत तोड़ने के लिए हर 2-3 साल में सबसॉइलर से गहरी जुताई करें।",
      },
      irrigation: {
        en: "Adopt drip irrigation with plastic mulch in cotton to reduce evaporation losses during dry spells.",
        mr: "कापसात ठिबक आणि प्लास्टिक मल्चिंग वापरल्यास पावसाचा खंड पडला तरी बोंडांचा विकास उत्तम होतो.",
        hi: "कपास में ड्रिप और प्लास्टिक मल्चिंग के उपयोग से सूखे के समय भी वाष्पीकरण रुकता है और गूलर अच्छे बनते हैं।",
      },
      rotation: {
        en: "Soybean-Gram rotation balances nitrogen reserves and curbs root-knot nematode propagation.",
        mr: "सोयाबीननंतर हरभऱ्याची फेरपालट केल्यास नत्र वाढतो व सूत्रकृमीचा (Nematodes) प्रादुर्भाव टळतो.",
        hi: "सोयाबीन के बाद चना लेने से प्राकृतिक नाइट्रोजन संतुलित रहता है और सूत्रकृमि का खतरा टलता है।",
      },
    },
  },
  pune: {
    district: "Pune",
    yield: 5.25,
    rainfall: 720,
    n: 78,
    p: 44,
    k: 44,
    ph: 7.2,
    organic: 71,
    zone: "Western Maharashtra Bhima Basin",
    topCrop: "Sugarcane / Vegetables",
    cropDiversity: [
      { crop: "Sugarcane", value: 30 },
      { crop: "Soybean", value: 25 },
      { crop: "Vegetables", value: 20 },
      { crop: "Wheat", value: 15 },
      { crop: "Gram", value: 10 },
    ],
    insights: {
      nutrient: {
        en: "Well-balanced black to reddish loam. Incorporate enriched compost before vegetable sowing for balanced N-P-K.",
        mr: "मध्यम काळी सुपीक जमीन. भाजीपाला लागवडीपूर्वी चांगले कुजलेले शेणखत व गांडूळ खत मिसळावे.",
        hi: "संतुलित उपजाऊ दोमट मिट्टी। सब्जी बोने से पहले कम्पोस्ट खाद मिलाकर एनपीके को संतुलित रखें।",
      },
      irrigation: {
        en: "Extensive micro-irrigation network. Pulse drip irrigation for vegetables cuts water usage by 35%.",
        mr: "ठिबक सिंचनाचा प्रभावी वापर. भाजीपाल्याला रोज थोड्या थोड्या अंतराने ठिबकने पाणी दिल्यास ३५% पाणी वाचते.",
        hi: "ड्रिप सिंचाई का व्यापक उपयोग। सब्जियों में पल्स ड्रिप सिंचाई से 35% पानी की बचत होती है।",
      },
      rotation: {
        en: "Rotate Sugarcane with Green Manure (Sunhemp) and high-value exotic vegetables for maximum acre revenue.",
        mr: "उसानंतर तागाचे हिरवळीचे खत आणि त्यानंतर भाजीपाला पिके घेतल्यास जमिनीचा कस आणि नफा दोन्ही वाढतात.",
        hi: "गन्ने के बाद सनई की हरी खाद और फिर नकदी सब्जियां लेने से प्रति एकड़ अधिकतम मुनाफा होता है।",
      },
    },
  },
  raigad: {
    district: "Raigad",
    yield: 4.8,
    rainfall: 2800,
    n: 77,
    p: 43,
    k: 40,
    ph: 6.3,
    organic: 75,
    zone: "Central Konkan Coastal Zone",
    topCrop: "Rice / Mango",
    cropDiversity: [
      { crop: "Rice", value: 52 },
      { crop: "Mango", value: 20 },
      { crop: "Vegetables", value: 12 },
      { crop: "Cashew", value: 10 },
      { crop: "Wal", value: 6 },
    ],
    insights: {
      nutrient: {
        en: "Red lateritic to coastal alluvial soil. Acidic pH (6.3); supplement with rock phosphate and organic manure.",
        mr: "जांभा व गाळाची आम्लधर्मीय जमीन. स्फुरदासाठी रॉक फॉस्फेट व सेंद्रिय खतांचा नियमित वापर करावा.",
        hi: "लाल लैटराइट और तटीय जलोढ़ अम्लीय मिट्टी। रॉक फास्फेट और जैविक खाद का प्रयोग करें।",
      },
      irrigation: {
        en: "Torrential monsoon (2800 mm). Terrace bunding prevents nutrient runoff on sloping coastal foothill terrains.",
        mr: "मुसळधार पाऊस (२८०० मिमी). उताराच्या शेतात पायऱ्यांची खाचरे केल्यास जमिनीतील खते वाहून जात नाहीत.",
        hi: "भारी वर्षा (2800 मिमी)। सीढ़ीदार खेत और मेड़बंदी से ढलान वाली जमीनों में पोषक तत्व बहने से रुकते हैं।",
      },
      rotation: {
        en: "Paddy in monsoon followed by traditional Wal bean in winter restores soil structure and fixes nitrogen.",
        mr: "पावसाळ्यात भात आणि हिवाळ्यात वालाचे पीक घेतल्यास जमिनीत नत्र वाढून पोत उत्कृष्ट राहतो.",
        hi: "बरसात में धान और सर्दियों में वाल (सेम) लेने से मिट्टी की संरचना सुधरती है और नाइट्रोजन बढ़ता है।",
      },
    },
  },
  ratnagiri: {
    district: "Ratnagiri",
    yield: 5.0,
    rainfall: 3200,
    n: 79,
    p: 45,
    k: 42,
    ph: 6.1,
    organic: 77,
    zone: "South Konkan Coastal Horticulture Hub",
    topCrop: "Alphonso Mango / Cashew",
    cropDiversity: [
      { crop: "Mango", value: 42 },
      { crop: "Rice", value: 30 },
      { crop: "Cashew", value: 16 },
      { crop: "Coconut", value: 8 },
      { crop: "Ragi", value: 4 },
    ],
    insights: {
      nutrient: {
        en: "Laterite (Jambha) soil rich in iron and aluminium, low in available phosphorus. Apply rock phosphate and bone meal.",
        mr: "जांभा प्रकारची तांबडी जमीन. लोह जास्त पण स्फुरद कमी असल्याने हाडांचे खत व रॉक फॉस्फेटचा वापर करावा.",
        hi: "लैटराइट (जांभा) लाल मिट्टी। लोहा अधिक पर फास्फोरस कम होता है; रॉक फास्फेट और जैविक खाद डालें।",
      },
      irrigation: {
        en: "Torrential monsoon followed by dry winter. Mulch mango tree basins with dry leaves to conserve winter soil moisture.",
        mr: "अतिमुसळधार पाऊस (३२०० मिमी). हापूसच्या झाडांभोवती पालापाचोळ्याचे आच्छादन (Mulch) केल्यास हिवाळ्यात ओलावा टिकून फळगळ थांबते.",
        hi: "अत्यधिक वर्षा (3200 मिमी)। हापुस आम के पेड़ों के चारों ओर सूखी पत्तियों की मल्चिंग करने से नमी टिकती है और फल झड़ना रुकता है।",
      },
      rotation: {
        en: "Intercrop young mango orchards with Pineapple, Turmeric, or Ginger for early supplementary farm revenue.",
        mr: "नवीन हापूस बागेत पहिली ५-६ वर्षे अननस, हळद किंवा आल्याचे आंतरपीक घेतल्यास सुरुवातीपासून भरघोस उत्पन्न मिळते.",
        hi: "नए आम के बगीचों में शुरुआती वर्षों में अनानास, हल्दी या अदरक की अंतर-फसल से अतिरिक्त आय प्राप्त करें।",
      },
    },
  },
  sangli: {
    district: "Sangli",
    yield: 5.4,
    rainfall: 620,
    n: 80,
    p: 47,
    k: 50,
    ph: 7.4,
    organic: 73,
    zone: "Krishna River Basin Horticulture Hub",
    topCrop: "Grapes / Turmeric",
    cropDiversity: [
      { crop: "Sugarcane", value: 32 },
      { crop: "Grapes", value: 28 },
      { crop: "Turmeric", value: 18 },
      { crop: "Soybean", value: 12 },
      { crop: "Pomegranate", value: 10 },
    ],
    insights: {
      nutrient: {
        en: "Fertile Krishna river basin loam with rich potassium. Potassic fertigation enhances grape sugar content and turmeric weight.",
        mr: "कृष्णा काठची सुपीक जमीन. भरपूर पोटॅशियममुळे द्राक्षांमध्ये उत्तम गोडी व हळदीच्या बोटांना वजनदारपणा मिळतो.",
        hi: "कृष्णा नदी तट की उपजाऊ दोमट मिट्टी। पोटाश की प्रचुरता से अंगूर में मिठास और हल्दी की गुणवत्ता बढ़ती है।",
      },
      irrigation: {
        en: "Lift irrigation schemes; avoid over-saturation in black soils to maintain healthy root zone aeration.",
        mr: "उपसा सिंचन योजना. काळ्या जमिनीत अतिरिक्त पाणी साचू न देता मुळांना हवा खेळती राहील असे पाणी द्यावे.",
        hi: "लिफ्ट सिंचाई प्रणाली। काली मिट्टी में अतिरिक्त जलभराव से बचें ताकि जड़ों में वायु संचार बना रहे।",
      },
      rotation: {
        en: "Turmeric followed by Sugarcane or cover crops like Cowpea breaks nematode build-up and aerates soil.",
        mr: "हळदीनंतर ऊस किंवा चवळीसारखे हिरवळीचे पीक घेतल्यास सूत्रकृमी नष्ट होतात व जमिनीचा कस वाढतो.",
        hi: "हल्दी के बाद गन्ना या लोबिया लेने से सूत्रकृमि (निमेटोड) नष्ट होते हैं और मिट्टी की उर्वरा शक्ति बढ़ती है।",
      },
    },
  },
  satara: {
    district: "Satara",
    yield: 5.5,
    rainfall: 850,
    n: 82,
    p: 46,
    k: 46,
    ph: 7.1,
    organic: 76,
    zone: "Krishna-Koyna Basin & Mahabaleshwar Valley",
    topCrop: "Sugarcane / Strawberry",
    cropDiversity: [
      { crop: "Sugarcane", value: 35 },
      { crop: "Soybean", value: 25 },
      { crop: "Strawberry", value: 15 },
      { crop: "Ginger", value: 15 },
      { crop: "Wheat", value: 10 },
    ],
    insights: {
      nutrient: {
        en: "Rich alluvial black soil along Koyna basin with high organic matter (76/100). Potassic nutrition boosts strawberry brix.",
        mr: "कोयना खोऱ्यातील सुपीक काळी कसदार जमीन (सेंद्रिय कर्ब ७६/१००). ऊस व स्ट्रॉबेरीच्या गोडीसाठी पालाशयुक्त खतांचा वापर करावा.",
        hi: "कोयना घाटी की समृद्ध जलोढ़ काली मिट्टी। गन्ने और स्ट्रॉबेरी की मिठास के लिए पोटाश उर्वरक का संतुलित प्रयोग करें।",
      },
      irrigation: {
        en: "Reliable perennial irrigation from Koyna dam. Use silver-black plastic mulch and drip for strawberries and ginger.",
        mr: "कोयना धरणाचे मुबलक पाणी. स्ट्रॉबेरी व आल्यासाठी सिल्व्हर-ब्लॅक मल्चिंग व ठिबक वापरल्यास कंदकुजव्या रोगाला प्रतिबंध होतो.",
        hi: "कोयना बांध से भरपूर सिंचाई। स्ट्रॉबेरी और अदरक के लिए प्लास्टिक मल्चिंग व ड्रिप से कंद सड़न को रोकें।",
      },
      rotation: {
        en: "Rotate Sugarcane and Ginger cycles with Legumes (Gram or Soybean) to maintain excellent soil friability.",
        mr: "ऊस व आल्याच्या फेरपालटीत हरभरा किंवा सोयाबीन घेतल्यास जमिनीची सुपीकता टिकून राहते व सूत्रकृमींना आळा बसतो.",
        hi: "गन्ने और अदरक के चक्र में चना या सोयाबीन लेने से मिट्टी की उर्वरता बनी रहती है और सूत्रकृमि पर नियंत्रण रहता है।",
      },
    },
  },
  sindhudurg: {
    district: "Sindhudurg",
    yield: 4.9,
    rainfall: 3100,
    n: 78,
    p: 44,
    k: 41,
    ph: 6.2,
    organic: 76,
    zone: "Deep South Konkan Tropical Eco-Agro Zone",
    topCrop: "Cashew / Alphonso Mango",
    cropDiversity: [
      { crop: "Cashew", value: 38 },
      { crop: "Mango", value: 32 },
      { crop: "Rice", value: 20 },
      { crop: "Coconut", value: 10 },
    ],
    insights: {
      nutrient: {
        en: "Porous iron-rich laterite soils. Apply bio-fertilizers and organic compost to enhance active phosphorus uptake.",
        mr: "सच्छिद्र जांभा तांबडी जमीन. जमिनीत स्फुरद उपलब्ध करून देण्यासाठी बायो-फॉस्फेट व शेणखताचा मुबलक वापर करावा.",
        hi: "छिद्रयुक्त लैटराइट लाल मिट्टी। फास्फोरस ग्रहण बढ़ाने के लिए जैव उर्वरक और सड़ी खाद का उपयोग करें।",
      },
      irrigation: {
        en: "High rainfall (3100 mm). Mulch cashew and mango tree basins before November to trap residual subsoil moisture.",
        mr: "वार्षिक ३१०० मिमी पाऊस. नोव्हेंबरपूर्वी काजू व आंबा झाडांच्या मुळाशी पालापाचोळा टाकून जमिनीतील ओलावा टिकवावा.",
        hi: "भारी वर्षा (3100 मिमी)। नवंबर से पहले काजू और आम के पेड़ों के नीचे सूखी पत्तियों की मल्चिंग करें।",
      },
      rotation: {
        en: "Multi-tier agroforestry: Coconut + Nutmeg/Black Pepper + Pineapple maximizes vertical light and ground space.",
        mr: "बहुस्तरीय बागायती शेती: नारळ + जायफळ/काळी मिरी + अननस अशी लागवड केल्यास प्रत्येक चौरस फुटातून उत्पन्न मिळते.",
        hi: "बहुस्तरीय कृषि: नारियल + जायफल/काली मिर्च + अनानास की मिश्र खेती से हर स्तर पर भरपूर आय होती है।",
      },
    },
  },
  solapur: {
    district: "Solapur",
    yield: 4.3,
    rainfall: 560,
    n: 68,
    p: 38,
    k: 45,
    ph: 7.9,
    organic: 60,
    zone: "Deccan Drought-Prone Pomegranate & Jowar Capital",
    topCrop: "Pomegranate / Jowar",
    cropDiversity: [
      { crop: "Jowar", value: 32 },
      { crop: "Pomegranate", value: 26 },
      { crop: "Sugarcane", value: 20 },
      { crop: "Tur", value: 12 },
      { crop: "Grapes", value: 10 },
    ],
    insights: {
      nutrient: {
        en: "Calcareous black soil with high calcium carbonate. Maintain canopy aeration to prevent bacterial blight (Telya).",
        mr: "चुनखडीयुक्त काळी जमीन. डाळिंबावरील तेलकट डाग (तेलंग्या) रोग रोखण्यासाठी झाडांमध्ये हवा खेळती ठेवावी व बोर्डो फवारावे.",
        hi: "चूनायुक्त काली मिट्टी। अनार में जीवाणु धब्बा (तेलिया) रोग से बचाव के लिए पौधों में वायु संचार बनाए रखें।",
      },
      irrigation: {
        en: "Rain-shadow zone (560 mm). Deficit drip irrigation with soil tensiometers produces high pomegranate fruit brix.",
        mr: "कमी पावसाचा दुष्काळी पट्टा (५६० मिमी). डाळिंबाला ठिबक सिंचनाने मोजून पाणी दिल्यास फळे टपोरी व चवदार होतात.",
        hi: "कम बारिश वाला सूखा क्षेत्र (560 मिमी)। ड्रिप द्वारा संतुलित पानी देने से अनार के फल रसीले और मीठे होते हैं।",
      },
      rotation: {
        en: "Rotate Rabi Jowar (Maldhandi) with Green Gram (Moong) or Soybean in Kharif for peak dryland water efficiency.",
        mr: "खरीपात मूग किंवा सोयाबीन आणि रब्बीत मालदांडी ज्वारी घेतल्यास कोरडवाहू शेतीतही जास्तीत जास्त नफा होतो.",
        hi: "खरीफ में मूंग या सोयाबीन और रबी में मालदांडी ज्वार लेने से वर्षा आधारित खेती में भी अच्छा मुनाफा होता है।",
      },
    },
  },
  thane: {
    district: "Thane",
    yield: 4.75,
    rainfall: 2350,
    n: 76,
    p: 42,
    k: 40,
    ph: 6.5,
    organic: 72,
    zone: "North Konkan Peri-Urban Agriculture Belt",
    topCrop: "Rice / Vegetables",
    cropDiversity: [
      { crop: "Rice", value: 50 },
      { crop: "Vegetables", value: 25 },
      { crop: "Pulses", value: 15 },
      { crop: "Fruits", value: 10 },
    ],
    insights: {
      nutrient: {
        en: "Coastal sandy clay to medium loam. Split nitrogen fertilizer into 3 top-dressings across paddy growth stages.",
        mr: "किनारपट्टीची गाळमिश्रित जमीन. भाताला युरिया खताची मात्रा एकाच वेळी न देता तीन टप्प्यांत विभागून द्यावी.",
        hi: "तटीय बलुई चिकनी दोमट मिट्टी। धान में नाइट्रोजन (यूरिया) को तीन चरणों में बांट कर दें।",
      },
      irrigation: {
        en: "Abundant monsoon rainfall. Bunding and farm ponds preserve residual water for profitable second-crop vegetables.",
        mr: "भरपूर पाऊस (२३५० मिमी). भातशेतीचे बांध मजबूत ठेवून रब्बी भाजीपाल्यासाठी पाणी साठवून ठेवावे.",
        hi: "प्रचुर वर्षा (2350 मिमी)। मेड़ों को मजबूत रखकर रबी की सब्जियों के लिए पानी का संरक्षण करें।",
      },
      rotation: {
        en: "Paddy followed by high-demand Mumbai market vegetables (Brinjal, Bittergourd, Okra) yields top realization.",
        mr: "भातानंतर वांगी, कारली, भेंडी अशा मुंबई बाजारात रोज खपणाऱ्या भाजीपाल्याची लागवड केल्यास मोठा फायदा होतो.",
        hi: "धान के बाद बैंगन, करेला, भिंडी जैसी मुंबई बाजार में मांग वाली सब्जियां उगाने से सर्वोत्तम मूल्य मिलता है।",
      },
    },
  },
  wardha: {
    district: "Wardha",
    yield: 4.55,
    rainfall: 960,
    n: 74,
    p: 39,
    k: 39,
    ph: 7.4,
    organic: 66,
    zone: "Wardha Valley Vidarbha Cotton Belt",
    topCrop: "Cotton / Soybean",
    cropDiversity: [
      { crop: "Cotton", value: 40 },
      { crop: "Soybean", value: 32 },
      { crop: "Tur", value: 16 },
      { crop: "Wheat", value: 8 },
      { crop: "Gram", value: 4 },
    ],
    insights: {
      nutrient: {
        en: "Heavy black vertisols with high cation exchange. Apply balanced 100:50:50 N-P-K fertilizer for cotton crops.",
        mr: "काळी कसदार रेगूर जमीन. कपाशीसाठी १००:५०:५० नत्र, स्फुरद व पालाश खतांची संतुलित मात्रा द्यावी.",
        hi: "गहरी काली मिट्टी। कपास के लिए 100:50:50 एनपीके उर्वरक का संतुलित प्रयोग करें।",
      },
      irrigation: {
        en: "Broad-bed furrows and farm pond harvesting overcome extended August dry spells in the cotton belt.",
        mr: "रुंद वरंबा सरी (BBF) आणि शेततळ्यातील पाण्याचा वापर करून ऑगस्टच्या पावसाच्या खंडात पिकांचे रक्षण करावे.",
        hi: "ब्रॉड-बेड फरो और खेत-तालाब के पानी से अगस्त के सूखे के समय कपास की रक्षा करें।",
      },
      rotation: {
        en: "Alternate Cotton with Gram or Soybean + Tur intercropping for soil regeneration and pest suppression.",
        mr: "कापूसनंतर हरभरा किंवा सोयाबीन + तूर आंतरपीक घेतल्यास जमिनीची ताकद टिकून बोंडअळीचा प्रादुर्भाव कमी होतो.",
        hi: "कपास के बाद चना या सोयाबीन + अरहर अंतर-फसल से मिट्टी की ताकत सुधरती है और कीट कम होते हैं।",
      },
    },
  },
  washim: {
    district: "Washim",
    yield: 4.45,
    rainfall: 810,
    n: 71,
    p: 37,
    k: 40,
    ph: 7.5,
    organic: 63,
    zone: "Central Vidarbha Soybean Heartland",
    topCrop: "Soybean / Tur",
    cropDiversity: [
      { crop: "Soybean", value: 45 },
      { crop: "Tur", value: 22 },
      { crop: "Cotton", value: 18 },
      { crop: "Wheat", value: 9 },
      { crop: "Gram", value: 6 },
    ],
    insights: {
      nutrient: {
        en: "Deep black regur soil. High clay content; avoid working soil when wet to prevent damaging compaction.",
        mr: "खोल काळी चिकण जमीन. जमीन ओली असताना मशागत करू नये, अन्यथा जमीन घट्ट होऊन मुळांची वाढ खुंटते.",
        hi: "गहरी काली चिकनी मिट्टी। गीली मिट्टी में जुताई से बचें ताकि जमीन सख्त न हो और जड़ें स्वस्थ रहें।",
      },
      irrigation: {
        en: "Timely sprinkler irrigation during soybean pod development prevents up to 25% yield loss in low-rain years.",
        mr: "सोयाबीनच्या शेंगा भरताना तुषार सिंचनाने पाणी दिल्यास पावसाच्या खंडात होणारे २५% नुकसान टळते.",
        hi: "सोयाबीन में फली बनते समय फव्वारा सिंचाई देने से सूखे के वर्षों में 25% तक नुकसान बच जाता है।",
      },
      rotation: {
        en: "Soybean followed by Chickpea or Wheat is the most stable and profitable double-crop sequence for Washim.",
        mr: "सोयाबीननंतर हरभरा किंवा गहू घेणे हा वाशीममधील शेतकऱ्यांसाठी सर्वात सुरक्षित व फायदेशीर दुबार पीक पर्याय आहे.",
        hi: "सोयाबीन के बाद चना या गेहूं लेना वाशिम क्षेत्र के लिए सबसे सुरक्षित और लाभदायक दोहरा फसल चक्र है।",
      },
    },
  },
  yavatmal: {
    district: "Yavatmal",
    yield: 4.5,
    rainfall: 910,
    n: 72,
    p: 38,
    k: 39,
    ph: 7.5,
    organic: 64,
    zone: "Vidarbha White Gold (Cotton) Belt",
    topCrop: "Cotton / Soybean",
    cropDiversity: [
      { crop: "Cotton", value: 42 },
      { crop: "Soybean", value: 30 },
      { crop: "Tur", value: 16 },
      { crop: "Jowar", value: 7 },
      { crop: "Wheat", value: 5 },
    ],
    insights: {
      nutrient: {
        en: "Fertile black cotton soils. Install pheromone traps early to monitor and combat pink bollworm outbreaks.",
        mr: "काळी कसदार जमीन. गुलाबी बोंडअळीच्या नियंत्रणासाठी सुरुवातीपासूनच एकरी ५ कामगंध (Pheromone) सापळे लावावेत.",
        hi: "उपजाऊ कपास की काली मिट्टी। गुलाबी सुंडी से बचाव के लिए शुरुआत से ही फेरोमोन ट्रैप लगाएं।",
      },
      irrigation: {
        en: "In-situ moisture conservation using sub-soiling and inter-row mulching retains water into reproductive stages.",
        mr: "कापसात ओलावा टिकवण्यासाठी आंतरमशागत करून पिकाच्या ओळींमध्ये पालापाचोळ्याचे आच्छादन करावे.",
        hi: "कपास में नमी बनाए रखने के लिए समय पर निराई-गुड़ाई करें और कतारों के बीच पत्तों की मल्चिंग करें।",
      },
      rotation: {
        en: "Intercropping cotton with Green Gram (Moong) fixes organic nitrogen and attracts beneficial predator insects.",
        mr: "कापसात मूग किंवा उडदाचे आंतरपीक घेतल्यास नत्र वाढतो आणि मित्रकिडींचे संवर्धन होऊन मावा-तुडतुड्यांचा बंदोबस्त होतो.",
        hi: "कपास में मूंग या उड़द की अंतर-फसल लगाने से मिट्टी में नाइट्रोजन बढ़ता है और मित्र कीटों की संख्या बढ़ती है।",
      },
    },
  },
};

// Safe helper to fetch district profile with alias fallback
export const getDistrictProfile = (districtName) => {
  if (!districtName) return DISTRICT_AGRO_PROFILES.pune;
  const clean = districtName
    .toString()
    .toLowerCase()
    .replace(/,\s*(in|india|maharashtra)/gi, "")
    .replace(/\s+(district|जिल्हा|जिला)/gi, "")
    .replace(/[\s\-_(),]/g, "");

  if (DISTRICT_AGRO_PROFILES[clean]) return DISTRICT_AGRO_PROFILES[clean];

  const foundKey = Object.keys(DISTRICT_AGRO_PROFILES).find(
    (k) => clean.includes(k) || k.includes(clean)
  );
  if (foundKey && DISTRICT_AGRO_PROFILES[foundKey]) {
    return DISTRICT_AGRO_PROFILES[foundKey];
  }

  return DISTRICT_AGRO_PROFILES.pune;
};

export default function Analytics({ nav }) {
  const {
    user,
    predictionHistory,
    recommendationHistory,
    language,
    t,
    theme,
    tCrop,
    tDistrict,
    tSeason,
  } = useApp();

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)")?.matches);

  const axisColor = isDark ? "#cbd5e1" : "#334155";
  const gridColor = isDark ? "#24402a" : "#CBD5E1";
  const tooltipStyle = {
    backgroundColor: isDark ? "#132218" : "#FFFFFF",
    borderRadius: "14px",
    border: `1px solid ${isDark ? "#24402a" : "#E2E8F0"}`,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
    fontSize: "12px",
    fontWeight: "bold",
    color: isDark ? "#f8fafc" : "#1e293b",
  };

  const userEmail = user?.email?.toLowerCase()?.trim();
  const userRole = user?.role || "Farmer";
  const userFarmSize = parseFloat(user?.farm_size || user?.farmSize || "5.0") || 5.0;

  // Filter history for active farmer (or all if Admin)
  const userPredictions = useMemo(() => {
    return userRole === "Admin"
      ? predictionHistory || []
      : (predictionHistory || []).filter(
          (p) => p.user_email && p.user_email.toLowerCase() === userEmail
        );
  }, [predictionHistory, userRole, userEmail]);

  const userRecommendations = useMemo(() => {
    return userRole === "Admin"
      ? recommendationHistory || []
      : (recommendationHistory || []).filter(
          (r) => r.user_email && r.user_email.toLowerCase() === userEmail
        );
  }, [recommendationHistory, userRole, userEmail]);

  // Interactive UI Filters - Defaults dynamically to user's registered district
  const [viewMode, setViewMode] = useState("simple"); // 'simple' (Farmer Friendly) | 'charts' (Detailed Graphs)
  const [dataMode, setDataMode] = useState("myFarm"); // 'myFarm' | 'stateBenchmark'
  const [selectedSeason, setSelectedSeason] = useState("all"); // 'all' | 'kharif' | 'rabi' | 'summer'
  const [selectedDistrict, setSelectedDistrict] = useState(user?.district || "Pune");

  // Selected district active profile
  const currentDistrictProfile = useMemo(() => {
    return getDistrictProfile(selectedDistrict);
  }, [selectedDistrict]);

  // Filter user predictions specifically for the selected district and season
  const districtPredictions = useMemo(() => {
    const distClean = selectedDistrict.toLowerCase().replace(/[\s\-_(),]/g, "");
    let filtered = userPredictions.filter((p) => {
      if (!p.district) return false;
      const pDist = p.district.toLowerCase().replace(/[\s\-_(),]/g, "");
      return pDist === distClean || distClean.includes(pDist) || pDist.includes(distClean);
    });

    if (selectedSeason !== "all") {
      const seasonFiltered = filtered.filter(
        (p) => p.season && p.season.toLowerCase().trim() === selectedSeason.toLowerCase().trim()
      );
      if (seasonFiltered.length > 0) {
        filtered = seasonFiltered;
      }
    }

    return filtered;
  }, [userPredictions, selectedDistrict, selectedSeason]);

  // Filter user recommendations specifically for the selected district
  const districtRecommendations = useMemo(() => {
    const distClean = selectedDistrict.toLowerCase().replace(/[\s\-_(),]/g, "");
    return userRecommendations.filter((r) => {
      if (!r.district) {
        const uDist = (user?.district || "").toLowerCase().replace(/[\s\-_(),]/g, "");
        return uDist === distClean;
      }
      const rDist = r.district.toLowerCase().replace(/[\s\-_(),]/g, "");
      return rDist === distClean || distClean.includes(rDist) || rDist.includes(distClean);
    });
  }, [userRecommendations, selectedDistrict, user?.district]);

  // Dynamic Average Yield (t/acre) tailored to chosen city/district
  const dynamicAverageYield = useMemo(() => {
    if (dataMode === "myFarm" && districtPredictions.length > 0) {
      const valid = districtPredictions.filter((p) => Number(p.productivity || p.yield || 0) > 0);
      if (valid.length > 0) {
        const sum = valid.reduce((acc, p) => acc + Number(p.productivity || p.yield || 0), 0);
        return (sum / valid.length).toFixed(2);
      }
    }
    return (currentDistrictProfile.yield / 2.47105).toFixed(2);
  }, [dataMode, districtPredictions, currentDistrictProfile]);

  // Dynamic Total Production (tonnes) = yield * farm size
  const dynamicTotalProduction = useMemo(() => {
    return (parseFloat(dynamicAverageYield) * userFarmSize).toFixed(1);
  }, [dynamicAverageYield, userFarmSize]);

  // Dynamic Soil Health Score (0-100) calibrated per city
  const dynamicSoilScore = useMemo(() => {
    if (dataMode === "myFarm" && districtRecommendations.length > 0) {
      const rec = districtRecommendations[0];
      const nVal = Number(rec.nitrogen || rec.n || 70);
      const pVal = Number(rec.phosphorus || rec.p || 45);
      const kVal = Number(rec.potassium || rec.k || 45);
      const phVal = Number(rec.ph || 7.0);

      const nScore = 100 - Math.min(40, Math.abs(80 - nVal));
      const pScore = 100 - Math.min(40, Math.abs(50 - pVal) * 1.5);
      const kScore = 100 - Math.min(40, Math.abs(60 - kVal) * 1.2);
      const phScore = 100 - Math.min(40, Math.abs(7.0 - phVal) * 15);

      const composite = Math.round((nScore + pScore + kScore + phScore) / 4);
      return Math.max(55, Math.min(96, composite));
    }

    // Benchmark composite for selected district
    const nScore = 100 - Math.min(40, Math.abs(80 - currentDistrictProfile.n));
    const pScore = 100 - Math.min(40, Math.abs(50 - currentDistrictProfile.p) * 1.5);
    const kScore = 100 - Math.min(40, Math.abs(60 - currentDistrictProfile.k) * 1.2);
    const phScore = 100 - Math.min(40, Math.abs(7.0 - currentDistrictProfile.ph) * 15);
    const composite = Math.round(
      (nScore + pScore + kScore + phScore + currentDistrictProfile.organic) / 5
    );
    return Math.max(60, Math.min(95, composite));
  }, [dataMode, districtRecommendations, currentDistrictProfile]);

  // Dynamic Top Recommended Crop for chosen city
  const topCropDisplay = useMemo(() => {
    if (dataMode === "myFarm" && districtPredictions.length > 0) {
      const counts = {};
      districtPredictions.forEach((p) => {
        const c = p.crop || "Soybean";
        counts[c] = (counts[c] || 0) + 1;
      });
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      if (sorted.length > 0) {
        return tCrop ? tCrop(sorted[0][0]) : sorted[0][0];
      }
    }
    const raw = currentDistrictProfile.topCrop.split("/")[0].trim();
    return tCrop ? tCrop(raw) : raw;
  }, [dataMode, districtPredictions, currentDistrictProfile, tCrop]);

  // Localized string helpers
  const txt = {
    analyticsTitle:
      language === "mr"
        ? "कृषी विश्लेषण आणि दृश्य आलेख"
        : language === "hi"
        ? "कृषि विश्लेषण एवं विज़ुअलाइज़ेशन"
        : "Agri Analytics & Visual Intelligence",
    analyticsSubtitle:
      language === "mr"
        ? `शेतकरी: ${user?.name || "शेतकरी मित्र"} | क्षेत्र: ${userFarmSize} एकर | जिल्हा: ${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict}. थेट उत्पादन, मातीतील N-P-K पोषण आणि हवामानाचे आलेख.`
        : language === "hi"
        ? `किसान: ${user?.name || "किसान मित्र"} | क्षेत्रफल: ${userFarmSize} एकड़ | जिला: ${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict}. वास्तविक उपज, मृदा पोषण एवं मौसम का गतिशील विश्लेषण।`
        : `Farmer: ${user?.name || "Farmer"} | Farmland: ${userFarmSize} Acres | District: ${selectedDistrict}. Dynamic telemetry for yield forecasts, soil N-P-K balance, and climate factors.`,
    myFarmTab: language === "mr" ? "🌱 माझ्या शेताचा डेटा" : language === "hi" ? "🌱 मेरे खेत का डेटा" : "🌱 My Farmland Analytics",
    benchmarkTab: language === "mr" ? "🗺️ महाराष्ट्र राज्य बेंचमार्क" : language === "hi" ? "🗺️ महाराष्ट्र राज्य बेंचमार्क" : "🗺️ Maharashtra State Benchmark",
    allSeasons: language === "mr" ? "सर्व हंगाम" : language === "hi" ? "सभी मौसम" : "All Seasons",
    kharif: language === "mr" ? "खरीप" : language === "hi" ? "खरीफ" : "Kharif",
    rabi: language === "mr" ? "रब्बी" : language === "hi" ? "रबी" : "Rabi",
    summer: language === "mr" ? "उन्हाळी" : language === "hi" ? "जायद / ग्रीष्म" : "Summer",
    seasonFilterLabel: language === "mr" ? "हंगाम" : language === "hi" ? "मौसम" : "Season",
    districtLabel: language === "mr" ? "जिल्हा" : language === "hi" ? "जिला" : "District",
    exportBtn: language === "mr" ? "प्रिंट / सेव्ह अहवाल" : language === "hi" ? "प्रिंट / सेव रिपोर्ट" : "Print / Save Report",

    // KPI Titles
    kpiYieldTitle: language === "mr" ? "सरासरी पीक उत्पादकता" : language === "hi" ? "औसत फसल उत्पादकता" : "Avg. Yield Productivity",
    kpiYieldSub: language === "mr"
      ? (districtPredictions.length > 0 && dataMode === "myFarm"
          ? `थेट ${districtPredictions.length} नोंदींवरून (${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict})`
          : `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} जिल्हा कृषी मानक`)
      : language === "hi"
      ? (districtPredictions.length > 0 && dataMode === "myFarm"
          ? `वास्तविक ${districtPredictions.length} पूर्वानुमानों पर (${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict})`
          : `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} जिला कृषि मानक`)
      : (districtPredictions.length > 0 && dataMode === "myFarm"
          ? `Based on ${districtPredictions.length} forecasts in ${selectedDistrict}`
          : `${selectedDistrict} District Benchmark`),

    kpiSoilTitle: language === "mr" ? "मृदा आरोग्य निर्देशांक" : language === "hi" ? "मृदा स्वास्थ्य सूचकांक" : "Soil Health Composite",
    kpiSoilSub: language === "mr"
      ? (districtRecommendations.length > 0 && dataMode === "myFarm"
          ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} थेट माती चाचणीनुसार`
          : `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} जिल्हा माती प्रकारावर आधारित`)
      : language === "hi"
      ? (districtRecommendations.length > 0 && dataMode === "myFarm"
          ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} सत्यापित मृदा परीक्षण पर`
          : `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} जिला मृदा प्रोफाइल`)
      : (districtRecommendations.length > 0 && dataMode === "myFarm"
          ? `From soil test in ${selectedDistrict}`
          : `From ${selectedDistrict} soil profile`),

    kpiMoistureTitle: language === "mr" ? "एकूण अंदाजित उत्पादन" : language === "hi" ? "कुल अनुमानित उत्पादन" : "Est. Total Production",
    kpiMoistureSub: language === "mr"
      ? `${userFarmSize} एकर शेतजमीन • ${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict}`
      : language === "hi"
      ? `${userFarmSize} एकड़ कृषि भूमि • ${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict}`
      : `For ${userFarmSize} Acres in ${selectedDistrict}`,

    kpiTopCropTitle: language === "mr" ? "प्रमुख शिफारस केलेले पीक" : language === "hi" ? "प्रमुख अनुशंसित फसल" : "Top Recommended Crop",

    // Charts
    cropDistTitle: language === "mr" ? "पीक विविधता आणि क्षेत्र वाटा" : language === "hi" ? "फसल विविधता एवं क्षेत्र शेयर" : "Crop Diversity & Acreage Share",
    cropDistDesc: language === "mr"
      ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} जिल्ह्यातील प्रमुख पिकांचे टक्केवारी वाटप`
      : language === "hi"
      ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} जिले में प्रमुख फसलों का प्रतिशत वितरण`
      : `Crop acreage distribution for ${selectedDistrict}`,

    soilRadarTitle: language === "mr" ? "मातीतील N-P-K पोषण संतुलन (रडार आलेख)" : language === "hi" ? "मृदा N-P-K पोषण संतुलन (रडार चार्ट)" : "Soil N-P-K Nutrient Radar",
    soilRadarDesc: language === "mr"
      ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict}: नायट्रोजन (N), फॉस्फरस (P), पोटॅशियम (K) व सामू (pH)`
      : language === "hi"
      ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict}: नाइट्रोजन, फास्फोरस, पोटाश एवं पीएच संतुलन`
      : `${selectedDistrict}: Nitrogen, Phosphorus, Potassium and pH balance vs ideal line`,

    yieldTrendTitle: language === "mr" ? "हंगामी उत्पादन आलेख व कल (टन/एकर)" : language === "hi" ? "मौसमी उपज रुझान (टन/एकड़)" : "Seasonal Yield & Productivity Trends (t/acre)",
    yieldTrendDesc: language === "mr"
      ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} खरीप, रब्बी आणि उन्हाळी उत्पादकतेची तुलना`
      : language === "hi"
      ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} खरीफ, रबी और जायद में उत्पादकता की तुलना`
      : `Predicted productivity trajectory in ${selectedDistrict} across crop seasons`,

    climateTitle: language === "mr"
      ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} हवामान, तापमान आणि पावसाचा प्रभाव`
      : language === "hi"
      ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} मौसम, तापमान और वर्षा का प्रभाव`
      : `${selectedDistrict} Agro-Climate & Moisture Correlation`,
    climateDesc: language === "mr" ? "तापमान (°C) विरुद्ध पाऊस (mm) आणि पिकांवरील अनुकूलता" : language === "hi" ? "तापमान (°C) बनाम वर्षा (mm) और फसल वृद्धि परिस्थितियां" : "Temperature vs Rainfall and atmospheric stress on crop growth",

    districtRankTitle: language === "mr" ? "महाराष्ट्र जिल्हावार कृषी तुलना" : language === "hi" ? "महाराष्ट्र जिलावार कृषि तुलना" : "Maharashtra District Agronomy Ranking",
    districtRankDesc: language === "mr" ? "विविध जिल्ह्यांमधील सरासरी उत्पादकता (टन/एकर) आणि प्रमुख पिके" : language === "hi" ? "जिलों में औसत उत्पादकता (टन/एकड़) और मुख्य फसलें" : "Productivity benchmark across major agricultural zones (t/acre)",

    // Legends & Axis
    yourFarmLegend: language === "mr" ? "माझे शेत / जिल्हा" : language === "hi" ? "मेरा खेत / जिला" : "Selected Zone",
    idealBaselineLegend: language === "mr" ? "आदर्श प्रमाण" : language === "hi" ? "आदर्श मानक" : "Ideal Baseline",
    predictedYieldLegend: language === "mr" ? "अंदाजित उत्पादन (टन/एकर)" : language === "hi" ? "अनुमानित उपज (टन/एकड़)" : "Predicted Yield (t/acre)",
    stateAvgLegend: language === "mr" ? "राज्य सरासरी (टन/एकर)" : language === "hi" ? "राज्य औसत (टन/एकड़)" : "State Benchmark (t/acre)",
    tempLegend: language === "mr" ? "तापमान (°C)" : language === "hi" ? "तापमान (°C)" : "Temperature (°C)",
    rainLegend: language === "mr" ? "पाऊस (mm)" : language === "hi" ? "बारिश (mm)" : "Rainfall (mm)",
    humidityLegend: language === "mr" ? "आर्द्रता (%)" : language === "hi" ? "आर्द्रता (%)" : "Humidity (%)",

    // Insights
    keyInsightsTitle: language === "mr"
      ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} कृषी सल्लागार आणि AI शिफारशी`
      : language === "hi"
      ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} कृषि विशेषज्ञ एवं AI सिफारिशें`
      : `${selectedDistrict} Agronomic Insights & AI Recommendations`,

    simpleViewTab: language === "mr" ? "🌾 सोपे दृश्य (शेतकरी मोड)" : language === "hi" ? "🌾 सरल दृश्य (किसान मोड)" : "🌾 Simple Farmer View",
    chartsViewTab: language === "mr" ? "📊 आलेख दृश्य (ग्राफ मोड)" : language === "hi" ? "📊 ग्राफ दृश्य (चार्ट मोड)" : "📊 Detailed Graphs",
    farmerTipTitle: language === "mr" ? "शेतकऱ्यांसाठी सोपा सल्ला" : language === "hi" ? "किसानों के लिए सरल सलाह" : "Farmer Advice & Takeaway",
    farmerFriendlyBadge: language === "mr" ? "शेतकरी अनुकूल" : language === "hi" ? "किसान अनुकूल" : "Farmer Friendly",
  };

  // -------------------------------------------------------------
  // 1. DATA PREPARATION: Crop Diversity (Donut) - DYNAMIC PER CITY
  // -------------------------------------------------------------
  const cropDiversityData = useMemo(() => {
    if (dataMode === "myFarm" && districtPredictions.length > 0) {
      const counts = {};
      districtPredictions.forEach((p) => {
        const crop = p.crop || "Soybean";
        counts[crop] = (counts[crop] || 0) + 1;
      });
      return Object.entries(counts).map(([name, count]) => ({
        name: tCrop ? tCrop(name) : name,
        rawName: name,
        value: count,
      }));
    }

    // Benchmark district crop diversity
    return currentDistrictProfile.cropDiversity.map((item) => ({
      name: tCrop ? tCrop(item.crop) : item.crop,
      rawName: item.crop,
      value: item.value,
    }));
  }, [dataMode, districtPredictions, currentDistrictProfile, tCrop]);

  // -------------------------------------------------------------
  // 2. DATA PREPARATION: Soil N-P-K & pH Radar - DYNAMIC PER CITY
  // -------------------------------------------------------------
  const soilRadarData = useMemo(() => {
    let n = currentDistrictProfile.n;
    let p = currentDistrictProfile.p;
    let k = currentDistrictProfile.k;
    let phScaled = Math.round(currentDistrictProfile.ph * 10);
    let organic = currentDistrictProfile.organic;

    if (dataMode === "myFarm" && districtRecommendations.length > 0) {
      const latest = districtRecommendations[0];
      const rawN = latest.nitrogenKgHa || (latest.npkUnit === "kg/acre" ? Number(latest.nitrogen || latest.n || 0) * 2.47105 : Number(latest.nitrogen || latest.n || 0));
      const rawP = latest.phosphorusKgHa || (latest.npkUnit === "kg/acre" ? Number(latest.phosphorus || latest.p || 0) * 2.47105 : Number(latest.phosphorus || latest.p || 0));
      const rawK = latest.potassiumKgHa || (latest.npkUnit === "kg/acre" ? Number(latest.potassium || latest.k || 0) * 2.47105 : Number(latest.potassium || latest.k || 0));
      const rawPh = Number(latest.ph || 0);

      if (rawN > 0) n = Math.min(100, Math.round(rawN / 1.4));
      if (rawP > 0) p = Math.min(100, Math.round(rawP * 1.6));
      if (rawK > 0) k = Math.min(100, Math.round(rawK * 1.5));
      if (rawPh > 0) phScaled = Math.min(100, Math.round(rawPh * 10));
    }

    return [
      {
        nutrient: language === "mr" ? "नायट्रोजन (N)" : language === "hi" ? "नाइट्रोजन (N)" : "Nitrogen (N)",
        current: n,
        ideal: 80,
      },
      {
        nutrient: language === "mr" ? "फॉस्फरस (P)" : language === "hi" ? "फास्फोरस (P)" : "Phosphorus (P)",
        current: p,
        ideal: 50,
      },
      {
        nutrient: language === "mr" ? "पोटॅशियम (K)" : language === "hi" ? "पोटाश (K)" : "Potassium (K)",
        current: k,
        ideal: 60,
      },
      {
        nutrient: language === "mr" ? "सामू (pH x10)" : language === "hi" ? "पीएच (pH x10)" : "Soil pH",
        current: phScaled,
        ideal: 70,
      },
      {
        nutrient: language === "mr" ? "सेंद्रिय कर्ब" : language === "hi" ? "जैविक कार्बन" : "Organic Matter",
        current: organic,
        ideal: 75,
      },
    ];
  }, [dataMode, districtRecommendations, currentDistrictProfile, language]);

  // -------------------------------------------------------------
  // 3. DATA PREPARATION: Seasonal Yield Trends - DYNAMIC PER CITY
  // -------------------------------------------------------------
  const seasonalYieldData = useMemo(() => {
    const baseBench = parseFloat((currentDistrictProfile.yield / 2.47105).toFixed(2));

    if (dataMode === "myFarm" && districtPredictions.length > 0) {
      const sorted = [...districtPredictions].sort((a, b) => {
        const da = new Date(a.created_at || a.createdAt || 0).getTime();
        const db = new Date(b.created_at || b.createdAt || 0).getTime();
        return da - db;
      });

      const mapped = sorted.slice(-6).map((item, idx) => {
        const seasonName = item.season
          ? (tSeason ? tSeason(item.season) : item.season)
          : (language === "mr" ? "हंगाम" : language === "hi" ? "मौसम" : "Season");
        const cropName = item.crop ? (tCrop ? tCrop(item.crop) : item.crop) : "";
        const label = `${cropName ? cropName + " - " : ""}${seasonName} '${
          item.year || item.crop_year ? String(item.year || item.crop_year).slice(-2) : 23 + idx
        }`;
        const yVal = Number(item.productivity || item.yield || baseBench);

        return {
          season: label,
          yield: parseFloat(yVal.toFixed(2)),
          benchmark: baseBench,
        };
      });

      if (mapped.length === 1) {
        const single = mapped[0];
        return [
          {
            season: language === "mr" ? "२०२३ खरीप" : language === "hi" ? "२०२३ खरीफ" : "Kharif '23",
            yield: parseFloat((single.yield * 0.88).toFixed(2)),
            benchmark: parseFloat((baseBench * 0.95).toFixed(2)),
          },
          {
            season: language === "mr" ? "२०२३ रब्बी" : language === "hi" ? "२०२३ रबी" : "Rabi '23",
            yield: parseFloat((single.yield * 0.94).toFixed(2)),
            benchmark: baseBench,
          },
          single,
          {
            season: language === "mr" ? "२०२५ खरीप (अंदाज)" : language === "hi" ? "२०२५ खरीफ (अनुमानित)" : "Kharif '25 (AI)",
            yield: parseFloat((single.yield * 1.08).toFixed(2)),
            benchmark: parseFloat((baseBench * 1.05).toFixed(2)),
          },
        ];
      }

      return mapped;
    }

    // Default district-calibrated projection
    const mult = baseBench / 1.82;
    return [
      {
        season: language === "mr" ? "२०२३ खरीप" : language === "hi" ? "२०२३ खरीफ" : "Kharif '23",
        yield: parseFloat((1.65 * mult).toFixed(2)),
        benchmark: parseFloat((1.54 * mult).toFixed(2)),
      },
      {
        season: language === "mr" ? "२०२३ रब्बी" : language === "hi" ? "२०२३ रबी" : "Rabi '23",
        yield: parseFloat((1.78 * mult).toFixed(2)),
        benchmark: parseFloat((1.62 * mult).toFixed(2)),
      },
      {
        season: language === "mr" ? "२०२४ उन्हाळी" : language === "hi" ? "२०२४ जायद" : "Summer '24",
        yield: parseFloat((1.54 * mult).toFixed(2)),
        benchmark: parseFloat((1.42 * mult).toFixed(2)),
      },
      {
        season: language === "mr" ? "२०२४ खरीप" : language === "hi" ? "२०२४ खरीफ" : "Kharif '24",
        yield: parseFloat((1.90 * mult).toFixed(2)),
        benchmark: parseFloat((1.66 * mult).toFixed(2)),
      },
      {
        season: language === "mr" ? "२०२४ रब्बी" : language === "hi" ? "२०२४ रबी" : "Rabi '24",
        yield: parseFloat((2.02 * mult).toFixed(2)),
        benchmark: parseFloat((1.74 * mult).toFixed(2)),
      },
      {
        season: language === "mr" ? "२०२५ खरीप (अंदाज)" : language === "hi" ? "२०२५ खरीफ (अनुमानित)" : "Kharif '25 (AI)",
        yield: parseFloat((2.15 * mult).toFixed(2)),
        benchmark: parseFloat((1.78 * mult).toFixed(2)),
      },
    ];
  }, [dataMode, districtPredictions, currentDistrictProfile, language, tSeason, tCrop]);

  // -------------------------------------------------------------
  // 4. DATA PREPARATION: Climate Correlation - REALISTIC PER AGRO-ZONE
  // -------------------------------------------------------------
  const climateData = useMemo(() => {
    const prof = currentDistrictProfile;
    const rfMult = (prof.rainfall || 720) / 720;
    const distLower = prof.district.toLowerCase();

    const isCoastal = ["ratnagiri", "sindhudurg", "raigad", "thane", "palghar", "mumbai"].some(
      (k) => distLower.includes(k)
    );
    const isVidarbha = [
      "nagpur",
      "amravati",
      "chandrapur",
      "bhandara",
      "gondia",
      "wardha",
      "akola",
      "yavatmal",
      "gadchiroli",
      "buldhana",
      "washim",
    ].some((k) => distLower.includes(k));
    const isArid = ["solapur", "ahmednagar", "beed", "osmanabad", "jalna", "dhule"].some((k) =>
      distLower.includes(k)
    );

    let baseCurve;
    if (isCoastal) {
      baseCurve = [
        { month: "Jun", temp: 30, rainfall: Math.round(480 * (prof.rainfall / 2800)), humidity: 82 },
        { month: "Jul", temp: 28, rainfall: Math.round(980 * (prof.rainfall / 2800)), humidity: 93 },
        { month: "Aug", temp: 28, rainfall: Math.round(820 * (prof.rainfall / 2800)), humidity: 92 },
        { month: "Sep", temp: 29, rainfall: Math.round(420 * (prof.rainfall / 2800)), humidity: 88 },
        { month: "Oct", temp: 31, rainfall: Math.round(140 * (prof.rainfall / 2800)), humidity: 76 },
        { month: "Nov", temp: 30, rainfall: Math.round(30 * (prof.rainfall / 2800)), humidity: 65 },
      ];
    } else if (isVidarbha) {
      baseCurve = [
        { month: "Jun", temp: 36, rainfall: Math.round(160 * rfMult), humidity: 62 },
        { month: "Jul", temp: 30, rainfall: Math.round(310 * rfMult), humidity: 84 },
        { month: "Aug", temp: 29, rainfall: Math.round(290 * rfMult), humidity: 86 },
        { month: "Sep", temp: 31, rainfall: Math.round(180 * rfMult), humidity: 79 },
        { month: "Oct", temp: 32, rainfall: Math.round(55 * rfMult), humidity: 60 },
        { month: "Nov", temp: 28, rainfall: Math.round(15 * rfMult), humidity: 50 },
      ];
    } else if (isArid) {
      baseCurve = [
        { month: "Jun", temp: 34, rainfall: Math.round(95 * rfMult), humidity: 65 },
        { month: "Jul", temp: 30, rainfall: Math.round(140 * rfMult), humidity: 76 },
        { month: "Aug", temp: 29, rainfall: Math.round(130 * rfMult), humidity: 78 },
        { month: "Sep", temp: 30, rainfall: Math.round(160 * rfMult), humidity: 79 },
        { month: "Oct", temp: 31, rainfall: Math.round(75 * rfMult), humidity: 62 },
        { month: "Nov", temp: 29, rainfall: Math.round(20 * rfMult), humidity: 52 },
      ];
    } else {
      // Western Maharashtra / Deccan standard
      baseCurve = [
        { month: "Jun", temp: 31, rainfall: Math.round(145 * rfMult), humidity: 72 },
        { month: "Jul", temp: 27, rainfall: Math.round(250 * rfMult), humidity: 88 },
        { month: "Aug", temp: 26, rainfall: Math.round(220 * rfMult), humidity: 89 },
        { month: "Sep", temp: 28, rainfall: Math.round(170 * rfMult), humidity: 83 },
        { month: "Oct", temp: 30, rainfall: Math.round(70 * rfMult), humidity: 65 },
        { month: "Nov", temp: 28, rainfall: Math.round(22 * rfMult), humidity: 56 },
      ];
    }

    const monthLabels = {
      mr: ["जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर"],
      hi: ["जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर"],
      en: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
    };
    const activeMonths = monthLabels[language] || monthLabels.en;

    return baseCurve.map((item, idx) => ({
      ...item,
      month: activeMonths[idx],
    }));
  }, [language, currentDistrictProfile]);

  // -------------------------------------------------------------
  // 5. DATA PREPARATION: Maharashtra District Rankings - DYNAMIC HIGHLIGHT
  // -------------------------------------------------------------
  const districtRankingData = useMemo(() => {
    // Representative set of benchmark districts across Maharashtra
    const benchmarkDistricts = [
      "Kolhapur",
      "Satara",
      "Sangli",
      "Pune",
      "Nashik",
      "Jalgaon",
      "Nagpur",
      "Amravati",
      "Ratnagiri",
      "Solapur",
      "Ahmednagar",
    ];

    let displayList = [...benchmarkDistricts];
    const selectedNorm = selectedDistrict.toLowerCase().replace(/[\s\-_(),]/g, "");
    const alreadyInList = displayList.some(
      (d) => d.toLowerCase().replace(/[\s\-_(),]/g, "") === selectedNorm
    );

    if (!alreadyInList) {
      displayList.push(selectedDistrict);
    }

    return displayList.map((dName) => {
      const p = getDistrictProfile(dName);
      const isCurrent =
        dName.toLowerCase().replace(/[\s\-_(),]/g, "") === selectedNorm ||
        p.district.toLowerCase().replace(/[\s\-_(),]/g, "") === selectedNorm;

      return {
        district: p.district,
        yield: Number((p.yield / 2.47105).toFixed(2)),
        rainfall: p.rainfall,
        topCrop: p.topCrop,
        districtLabel: tDistrict ? tDistrict(p.district) : p.district,
        isCurrent,
      };
    });
  }, [tDistrict, selectedDistrict]);

  const getCropEmoji = (cropName = "") => {
    const c = String(cropName).toLowerCase();
    if (c.includes("cotton") || c.includes("कापूस") || c.includes("कपास")) return "🌾";
    if (c.includes("soybean") || c.includes("सोयाबीन")) return "🌱";
    if (c.includes("sugarcane") || c.includes("ऊस") || c.includes("गन्ना")) return "🎋";
    if (c.includes("onion") || c.includes("कांदा") || c.includes("प्याज़")) return "🧅";
    if (c.includes("maize") || c.includes("मका") || c.includes("मक्का")) return "🌽";
    if (c.includes("banana") || c.includes("केळी") || c.includes("केला")) return "🍌";
    if (c.includes("turmeric") || c.includes("हळद") || c.includes("हल्दी")) return "🟨";
    if (c.includes("wheat") || c.includes("गहू") || c.includes("गेहूं")) return "🌾";
    if (c.includes("rice") || c.includes("भात") || c.includes("तांदूळ") || c.includes("चावल")) return "🍚";
    if (c.includes("gram") || c.includes("हरभरा") || c.includes("चना")) return "🧆";
    if (c.includes("pomegranate") || c.includes("डाळिंब") || c.includes("अनार")) return "🍎";
    if (c.includes("grapes") || c.includes("द्राक्षे") || c.includes("अंगूर")) return "🍇";
    if (c.includes("orange") || c.includes("संत्रा") || c.includes("मोसंबी") || c.includes("संतरा")) return "🍊";
    if (c.includes("bajra") || c.includes("बाजरी") || c.includes("बाजरा")) return "🌾";
    if (c.includes("jowar") || c.includes("ज्वारी") || c.includes("ज्वार")) return "🌾";
    return "🌿";
  };

  const weatherCalendar = useMemo(() => {
    const calendarLookup = {
      mr: [
        { month: "जून", icon: "🌱", rainType: "मान्सून आगमन", action: "मान्सून पूर्व मशागत, पेरणी व बियाणे प्रक्रिया" },
        { month: "जुलै", icon: "⛈️", rainType: "मुसळधार पाऊस", action: "खतांचा पहिला हप्ता, कोळपणी व तण नियंत्रण" },
        { month: "ऑगस्ट", icon: "🌧️", rainType: "सतत पाऊस", action: "रोग-कीड पाहणी, शेतात पाण्याचा योग्य निचरा" },
        { month: "सप्टेंबर", icon: "🌦️", rainType: "परतीचा पाऊस", action: "दाणे भरण्याची अवस्था, हलके सिंचन व फवारणी" },
        { month: "ऑक्टोबर", icon: "☀️", rainType: "उन्हाचा तडाखा", action: "खरीप पिकांची कापणी, मळणी व सुरक्षित साठवण" },
        { month: "नोव्हेंबर", icon: "🚜", rainType: "कोरडे / थंडी", action: "रब्बी हंगामाची पेरणी (हरभरा / गहू / कांदा)" },
      ],
      hi: [
        { month: "जून", icon: "🌱", rainType: "मानसून शुरुआत", action: "मानसून पूर्व जुताई, बुवाई एवं बीज उपचार" },
        { month: "जुलाई", icon: "⛈️", rainType: "भारी वर्षा", action: "खाद की पहली खुराक, निराई-गुड़ाई एवं खरपतवार नियंत्रण" },
        { month: "अगस्त", icon: "🌧️", rainType: "निरंतर वर्षा", action: "कीट-रोग निगरानी, खेत में जल निकासी की व्यवस्था" },
        { month: "सितंबर", icon: "🌦️", rainType: "वापसी बारिश", action: "दाना भराव की अवस्था, हल्की सिंचाई व छिड़काव" },
        { month: "अक्टूबर", icon: "☀️", rainType: "तेज धूप", action: "खरीफ फसलों की कटाई, गहाई और सुरक्षित भंडारण" },
        { month: "नवंबर", icon: "🚜", rainType: "शुष्क / ठंड", action: "रबी फसलों की बुवाई (चना / गेहूं / प्याज)" },
      ],
      en: [
        { month: "Jun", icon: "🌱", rainType: "Monsoon Arrival", action: "Pre-monsoon land preparation, sowing & seed treatment" },
        { month: "Jul", icon: "⛈️", rainType: "Peak Monsoon", action: "First fertilizer split, inter-cultivation & weed control" },
        { month: "Aug", icon: "🌧️", rainType: "Steady Rain", action: "Pest & fungal scouting, ensure field water drainage" },
        { month: "Sep", icon: "🌦️", rainType: "Late Showers", action: "Grain filling stage, light irrigation & protective spray" },
        { month: "Oct", icon: "☀️", rainType: "Warm Sun", action: "Kharif harvesting, threshing & grain storage" },
        { month: "Nov", icon: "🚜", rainType: "Dry & Cool", action: "Rabi season sowing (Chickpea, Wheat, Onion)" },
      ],
    };
    const activeCal = calendarLookup[language] || calendarLookup.mr;
    return climateData.map((item, idx) => ({
      ...item,
      cal: activeCal[idx] || activeCal[0],
    }));
  }, [language, climateData]);

  const nutrientCards = useMemo(() => {
    let nVal = currentDistrictProfile.n;
    let pVal = currentDistrictProfile.p;
    let kVal = currentDistrictProfile.k;
    let phVal = currentDistrictProfile.ph;
    let organicVal = currentDistrictProfile.organic;

    if (dataMode === "myFarm" && districtRecommendations.length > 0) {
      const rec = districtRecommendations[0];
      const normN = rec.nitrogenKgHa || (rec.npkUnit === "kg/acre" ? Number(rec.nitrogen || rec.n || 0) * 2.47105 : Number(rec.nitrogen || rec.n || 0));
      const normP = rec.phosphorusKgHa || (rec.npkUnit === "kg/acre" ? Number(rec.phosphorus || rec.p || 0) * 2.47105 : Number(rec.phosphorus || rec.p || 0));
      const normK = rec.potassiumKgHa || (rec.npkUnit === "kg/acre" ? Number(rec.potassium || rec.k || 0) * 2.47105 : Number(rec.potassium || rec.k || 0));

      if (normN > 0) nVal = Math.round(normN);
      if (normP > 0) pVal = Math.round(normP);
      if (normK > 0) kVal = Math.round(normK);
      if (rec.ph) phVal = Number(rec.ph);
    }

    return [
      {
        id: "n",
        name: language === "mr" ? "नायट्रोजन (नत्र - N)" : language === "hi" ? "नाइट्रोजन (नत्र - N)" : "Nitrogen (N)",
        role: language === "mr" ? "पानांची वाढ व हिरवेगारपणा" : language === "hi" ? "पत्तियों की वृद्धि व हरियाली" : "Foliage growth & vegetative vigor",
        value: nVal,
        ideal: 80,
        pct: Math.min(100, Math.round((nVal / 100) * 100)),
        status: nVal >= 65 ? "optimal" : nVal >= 45 ? "moderate" : "low",
        badge:
          nVal >= 65
            ? (language === "mr" ? "🟢 मुबलक (उत्तम पोषण)" : language === "hi" ? "🟢 प्रचुर (उत्तम)" : "🟢 Optimal")
            : nVal >= 45
            ? (language === "mr" ? "🟡 मध्यम (साधारण)" : language === "hi" ? "🟡 मध्यम" : "🟡 Moderate")
            : (language === "mr" ? "🔴 कमी (खत द्या)" : language === "hi" ? "🔴 कम (खाद दें)" : "🔴 Deficient"),
        advice:
          language === "mr"
            ? "पाने पिवळी पडू नयेत म्हणून प्रति एकर १ बॅग युरिया किंवा चांगल्या कुजलेल्या शेणखताचा वापर करा."
            : language === "hi"
            ? "पत्तियों को पीला होने से बचाने के लिए प्रति एकड़ 1 बैग यूरिया या गोबर की खाद डालें।"
            : "Apply 1 bag Urea or well-decomposed manure per acre to ensure rich green leaves.",
      },
      {
        id: "p",
        name: language === "mr" ? "फॉस्फरस (स्फुरद - P)" : language === "hi" ? "फास्फोरस (स्फुरद - P)" : "Phosphorus (P)",
        role: language === "mr" ? "मुळांची मजबुती व फुलोरा" : language === "hi" ? "जड़ों की मजबूती व फूल आना" : "Root development & flowering",
        value: pVal,
        ideal: 50,
        pct: Math.min(100, Math.round((pVal / 60) * 100)),
        status: pVal >= 40 ? "optimal" : pVal >= 25 ? "moderate" : "low",
        badge:
          pVal >= 40
            ? (language === "mr" ? "🟢 मुबलक (उत्तम स्फुरद)" : language === "hi" ? "🟢 प्रचुर" : "🟢 Optimal")
            : pVal >= 25
            ? (language === "mr" ? "🟡 मध्यम (साधारण)" : language === "hi" ? "🟡 मध्यम" : "🟡 Moderate")
            : (language === "mr" ? "🔴 कमी (खत द्या)" : language === "hi" ? "🔴 कम (खाद दें)" : "🔴 Deficient"),
        advice:
          language === "mr"
            ? "मुळांच्या भक्कम वाढीसाठी पेरणीवेळी सिंगल सुपर फॉस्फेट (SSP) किंवा डीएपी खत द्यावे."
            : language === "hi"
            ? "जड़ों के मजबूत फैलाव और फूलों के लिए बुवाई पर डीएपी या सिंगल सुपर फॉस्फेट डालें।"
            : "Apply SSP or DAP at planting time for deep root growth and prolific flowering.",
      },
      {
        id: "k",
        name: language === "mr" ? "पोटॅशियम (पालाश - K)" : language === "hi" ? "पोटाश (पालाश - K)" : "Potassium (K)",
        role: language === "mr" ? "दाण्यांचे वजन व कीड प्रतिकारशक्ती" : language === "hi" ? "दानों का वजन व रोग प्रतिरोध" : "Grain filling & disease defense",
        value: kVal,
        ideal: 60,
        pct: Math.min(100, Math.round((kVal / 70) * 100)),
        status: kVal >= 45 ? "optimal" : kVal >= 30 ? "moderate" : "low",
        badge:
          kVal >= 45
            ? (language === "mr" ? "🟢 मुबलक (उत्तम पालाश)" : language === "hi" ? "🟢 प्रचुर" : "🟢 Optimal")
            : kVal >= 30
            ? (language === "mr" ? "🟡 मध्यम (साधारण)" : language === "hi" ? "🟡 मध्यम" : "🟡 Moderate")
            : (language === "mr" ? "🔴 कमी (खत द्या)" : language === "hi" ? "🔴 कम (खाद दें)" : "🔴 Deficient"),
        advice:
          language === "mr"
            ? "दाण्यांचे वजन, फळांची चमक व कीड प्रतिकारशक्ती वाढवण्यासाठी पोटॅश (MOP) खत द्यावे."
            : language === "hi"
            ? "दानों के वजन और चमक के लिए पोटाश (MOP) खाद डालें।"
            : "Use Potash (MOP) for plump grains, glossy produce, and drought resistance.",
      },
      {
        id: "ph",
        name: language === "mr" ? "सामू (जमिनीचा pH)" : language === "hi" ? "पीएच (जमीन का pH)" : "Soil pH (Acidity/Alkalinity)",
        role: language === "mr" ? "जमिनीची सुपीकता व क्षारता" : language === "hi" ? "मिट्टी की उर्वरता व क्षारीयता" : "Soil fertility & balance",
        value: phVal,
        ideal: 7.0,
        pct: Math.min(100, Math.round((phVal / 10) * 100)),
        status: phVal >= 6.5 && phVal <= 7.8 ? "optimal" : "moderate",
        badge:
          phVal >= 6.5 && phVal <= 7.8
            ? (language === "mr" ? `🟢 योग्य सामू (${phVal})` : language === "hi" ? `🟢 संतुलित (${phVal})` : `🟢 Ideal (${phVal})`)
            : phVal > 7.8
            ? (language === "mr" ? `🟡 चोपण जमीन (${phVal})` : language === "hi" ? `🟡 क्षारीय (${phVal})` : `🟡 Alkaline (${phVal})`)
            : (language === "mr" ? `🟡 आम्लयुक्त जमीन (${phVal})` : language === "hi" ? `🟡 अम्लीय (${phVal})` : `🟡 Acidic (${phVal})`),
        advice:
          language === "mr"
            ? "जमीन भुसभुशीत ठेवण्यासाठी ताग/धैंचाचे हिरवळीचे खत गाडावे आणि जिप्समचा वापर करावा."
            : language === "hi"
            ? "मिट्टी को उपजाऊ रखने के लिए ढैंचा की हरी खाद और जिप्सम का प्रयोग करें।"
            : "Apply green manuring and agricultural gypsum to condition soil structure.",
      },
      {
        id: "org",
        name: language === "mr" ? "सेंद्रिय कर्ब (Organic Carbon)" : language === "hi" ? "जैविक कार्बन" : "Organic Carbon",
        role: language === "mr" ? "पाणी धरून ठेवणे व गांडूळ खत" : language === "hi" ? "जलधारण क्षमता व जीवांश" : "Moisture retention & soil biology",
        value: organicVal,
        ideal: 75,
        pct: Math.min(100, Math.round(organicVal)),
        status: organicVal >= 60 ? "optimal" : organicVal >= 45 ? "moderate" : "low",
        badge:
          organicVal >= 60
            ? (language === "mr" ? "🟢 उत्तम सेंद्रिय घटक" : language === "hi" ? "🟢 उत्तम जीवांश" : "🟢 Rich")
            : organicVal >= 45
            ? (language === "mr" ? "🟡 मध्यम" : language === "hi" ? "🟡 मध्यम" : "🟡 Moderate")
            : (language === "mr" ? "🔴 कमी सेंद्रिय घटक" : language === "hi" ? "🔴 कम" : "🔴 Low"),
        advice:
          language === "mr"
            ? "जमिनीची धूप रोखण्यासाठी आणि पाणी टिकवण्यासाठी शेणखत किंवा गांडूळखताचा नियमित वापर करा."
            : language === "hi"
            ? "नमी बनाए रखने के लिए गोबर की खाद या केंचुआ खाद का नियमित उपयोग करें।"
            : "Incorporate compost or vermicompost to enrich microbial life and hold water.",
      },
    ];
  }, [currentDistrictProfile, dataMode, districtRecommendations, language]);

  const seasonalHarvestCards = useMemo(() => {
    const yieldNum = parseFloat(dynamicAverageYield) || 2.4;
    return [
      {
        id: "kharif",
        name: language === "mr" ? "खरीप हंगाम (पावसाळी)" : language === "hi" ? "खरीफ मौसम (बरसात)" : "Kharif Season (Monsoon)",
        icon: "🌧️",
        yield: yieldNum.toFixed(2),
        totalTons: (yieldNum * userFarmSize).toFixed(1),
        bags: Math.round(yieldNum * userFarmSize * 20),
        quintals: Math.round(yieldNum * userFarmSize * 10),
        crops: language === "mr" ? "सोयाबीन, कापूस, तूर, बाजरी, मका" : language === "hi" ? "सोयाबीन, कपास, अरहर, बाजरा" : "Soybean, Cotton, Tur, Bajra",
        status: language === "mr" ? "🟢 सर्वाधिक उत्पादन देणारा मुख्य हंगाम" : language === "hi" ? "🟢 सबसे अधिक उपज वाला मौसम" : "🟢 Primary high-yield season",
        rating: "⭐⭐⭐⭐⭐",
        badge: language === "mr" ? "कमाल उत्पादन" : language === "hi" ? "अधिकतम उपज" : "Peak Yield",
      },
      {
        id: "rabi",
        name: language === "mr" ? "रब्बी हंगाम (हिवाळी)" : language === "hi" ? "रबी मौसम (सर्दियां)" : "Rabi Season (Winter)",
        icon: "❄️",
        yield: (yieldNum * 0.88).toFixed(2),
        totalTons: (yieldNum * 0.88 * userFarmSize).toFixed(1),
        bags: Math.round(yieldNum * 0.88 * userFarmSize * 20),
        quintals: Math.round(yieldNum * 0.88 * userFarmSize * 10),
        crops: language === "mr" ? "हरभरा, गहू, ज्वारी, रब्बी कांदा" : language === "hi" ? "चना, गेहूं, ज्वार, रबी प्याज" : "Chickpea, Wheat, Jowar, Onion",
        status: language === "mr" ? "🟢 स्थिर व खात्रीशीर बाजारभाव" : language === "hi" ? "🟢 स्थिर बाजार भाव" : "🟢 Reliable market value",
        rating: "⭐⭐⭐⭐",
        badge: language === "mr" ? "कमी खर्चात नफा" : language === "hi" ? "कम लागत में लाभ" : "Cost Efficient",
      },
      {
        id: "summer",
        name: language === "mr" ? "उन्हाळी हंगाम (ग्रीष्म)" : language === "hi" ? "जायद / ग्रीष्म मौसम" : "Summer Season",
        icon: "☀️",
        yield: (yieldNum * 0.58).toFixed(2),
        totalTons: (yieldNum * 0.58 * userFarmSize).toFixed(1),
        bags: Math.round(yieldNum * 0.58 * userFarmSize * 20),
        quintals: Math.round(yieldNum * 0.58 * userFarmSize * 10),
        crops: language === "mr" ? "भुईमूग, उन्हाळी बाजरी, भाजीपाला" : language === "hi" ? "मूंगफली, ग्रीष्मकालीन बाजरा, सब्जियां" : "Groundnut, Summer Bajra, Veggies",
        status: language === "mr" ? "🟡 पाण्याची सोय असल्यास फायदेशीर" : language === "hi" ? "🟡 सिंचाई पर निर्भर" : "🟡 Water Dependent",
        rating: "⭐⭐⭐",
        badge: language === "mr" ? "पाणी आवश्यक" : language === "hi" ? "पानी जरूरी" : "Needs Irrigation",
      },
    ];
  }, [dynamicAverageYield, userFarmSize, language]);

  const topDistrictRankingList = useMemo(() => {
    return [...districtRankingData].sort((a, b) => b.yield - a.yield).slice(0, 7);
  }, [districtRankingData]);

  const handlePrint = () => {
    window.dispatchEvent(new Event("resize"));
    setTimeout(() => {
      window.print();
    }, 250);
  };

  return (
    <div className="space-y-6 pb-12 animate-page-enter print:space-y-4 print:pb-0 print:animate-none">
      {/* =========================================================
          PRINT-ONLY OFFICIAL DOSSIER HEADER
      ========================================================= */}
      <div className="print-only mb-6 border-b-2 border-[#1B5E20] pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1B5E20] text-2xl text-white shadow-xs">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-[#1B5E20]">
                  KRUSHIMITRA • कृषीमित्र
                </h1>
                <span className="rounded-full bg-emerald-100 border border-emerald-300 px-2 py-0.5 text-[9px] font-bold text-[#1B5E20] uppercase">
                  Agri-Telemetry Dossier
                </span>
              </div>
              <p className="text-xs font-semibold text-gray-600">
                {language === "mr"
                  ? "स्मार्ट कृषी विश्लेषण व शेतजमीन उत्पादन क्षमता अहवाल • महाराष्ट्र शासन कृषी सहकार्य"
                  : language === "hi"
                  ? "स्मार्ट कृषि विश्लेषण एवं उत्पादन क्षमता रिपोर्ट • महाराष्ट्र शासन कृषि सहयोग"
                  : "Smart Agricultural Telemetry & Farmland Productivity Dossier • Govt of Maharashtra Agro-Link"}
              </p>
            </div>
          </div>

          <div className="text-right text-xs">
            <div className="font-mono text-xs font-black text-[#1B5E20]">
              ID: KM-{selectedDistrict.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3)}-{new Date().getFullYear()}
            </div>
            <div className="text-[10px] font-medium text-gray-500">
              {new Date().toLocaleDateString(
                language === "mr" ? "mr-IN" : language === "hi" ? "hi-IN" : "en-IN",
                {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              )}
            </div>
          </div>
        </div>

        {/* FARMER PROFILE DOSSIER SUMMARY */}
        <div className="mt-4 grid grid-cols-4 gap-3 rounded-xl border border-gray-200 dark:border-[#24402a] bg-gray-50/90 dark:bg-[#132218] p-3 text-xs">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {language === "mr" ? "शेतकऱ्याचे नाव" : language === "hi" ? "किसान का नाम" : "Farmer Name"}
            </span>
            <span className="font-extrabold text-gray-900 dark:text-gray-100">
              {user?.name || "Ramesh Patil"}
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {language === "mr" ? "किसान ओळख क्रमांक" : language === "hi" ? "किसान आईडी" : "Kisan ID"}
            </span>
            <span className="font-mono font-bold text-[#1B5E20] dark:text-[#4ade80]">
              {user?.kisan_id || user?.kisanId || "KM-MH-2024-8921"}
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {language === "mr" ? "जिल्हा / कृषी विभाग" : language === "hi" ? "जिला / कृषि प्रभाग" : "District / Zone"}
            </span>
            <span className="font-extrabold text-gray-900 dark:text-gray-100">
              {tDistrict ? tDistrict(selectedDistrict) : selectedDistrict}, Maharashtra
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {language === "mr" ? "शेत क्षेत्र व व्याप्ती" : language === "hi" ? "खेत का क्षेत्रफल" : "Farm Area & Scope"}
            </span>
            <span className="font-extrabold text-gray-900 dark:text-gray-100">
              {userFarmSize} {language === "mr" ? "एकर" : language === "hi" ? "एकड़" : "Acres"} ({dataMode === "myFarm" ? "Farmer Farm" : "District Benchmark"})
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================
          HERO & CONTROL TOOLBAR (Hidden in Print Mode)
      ========================================================= */}
      <div className="no-print relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#10B981] p-6 text-white shadow-lg depth-2">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                <BarChart3 size={20} className="text-white" />
              </span>
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-green-100">
                {language === "mr" ? "स्मार्ट कृषी आलेख" : language === "hi" ? "स्मार्ट कृषि चार्ट्स" : "Smart Agri-Telemetry"}
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl drop-shadow-sm">
              {txt.analyticsTitle}
            </h1>
            <p className="mt-1 max-w-2xl text-xs sm:text-sm text-green-100/90 leading-relaxed">
              {txt.analyticsSubtitle}
            </p>
          </div>

          {/* PRINT / EXPORT BUTTON */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="btn-shimmer flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white hover:text-[#1B5E20] cursor-pointer shadow-sm"
            >
              <Printer size={15} />
              <span>{txt.exportBtn}</span>
            </button>
          </div>
        </div>

        {/* INTERACTIVE CONTROLS BAR */}
        <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/20 pt-4">
          {/* TOGGLE TABS: MY FARM VS STATE BENCHMARK */}
          <div className="inline-flex rounded-2xl bg-black/20 p-1 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setDataMode("myFarm")}
              className={`rounded-xl px-4 py-2 text-xs font-extrabold transition cursor-pointer ${
                dataMode === "myFarm"
                  ? "bg-white text-[#1B5E20] shadow-sm"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {txt.myFarmTab}
            </button>
            <button
              type="button"
              onClick={() => setDataMode("stateBenchmark")}
              className={`rounded-xl px-4 py-2 text-xs font-extrabold transition cursor-pointer ${
                dataMode === "stateBenchmark"
                  ? "bg-white text-[#1B5E20] shadow-sm"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {txt.benchmarkTab}
            </button>
          </div>

          {/* FILTERS: DISTRICT (ALL 36 DISTRICTS) & SEASON */}
          <div className="flex flex-wrap items-center gap-2">
            {/* DISTRICT SELECTOR */}
            <div className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 backdrop-blur-md text-xs font-bold">
              <MapPin size={14} className="text-emerald-200" />
              <span className="text-white/70">{txt.districtLabel}:</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-transparent font-extrabold text-white outline-none cursor-pointer"
              >
                {MAHARASHTRA_ALL_DISTRICTS.map((d) => (
                  <option key={d} value={d} className="text-gray-800">
                    {tDistrict ? tDistrict(d) : d}
                  </option>
                ))}
              </select>
            </div>

            {/* SEASON SELECTOR */}
            <div className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 backdrop-blur-md text-xs font-bold">
              <Calendar size={14} className="text-emerald-200" />
              <span className="text-white/70">{txt.seasonFilterLabel}:</span>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="bg-transparent font-extrabold text-white outline-none cursor-pointer"
              >
                <option value="all" className="text-gray-800">{txt.allSeasons}</option>
                <option value="kharif" className="text-gray-800">{txt.kharif}</option>
                <option value="rabi" className="text-gray-800">{txt.rabi}</option>
                <option value="summer" className="text-gray-800">{txt.summer}</option>
              </select>
            </div>
          </div>
        </div>

        {/* VIEW MODE SELECTOR (SIMPLE FARMER VIEW vs DETAILED CHARTS) */}
        <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/20 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white/90">
              {language === "mr" ? "आलेख मोड निवडा:" : language === "hi" ? "ग्राफ मोड चुनें:" : "View Mode:"}
            </span>
            <div className="inline-flex rounded-2xl bg-black/30 p-1 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setViewMode("simple")}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black transition cursor-pointer ${
                  viewMode === "simple"
                    ? "bg-white text-[#1B5E20] shadow-md"
                    : "text-white/80 hover:text-white"
                }`}
              >
                <Wheat size={15} />
                <span>{txt.simpleViewTab}</span>
                <span className="rounded-full bg-emerald-100 text-[#1B5E20] px-1.5 py-0.2 text-[9px] font-black uppercase">
                  {language === "mr" ? "शिफारस" : language === "hi" ? "अनुशंसित" : "Recommended"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("charts")}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black transition cursor-pointer ${
                  viewMode === "charts"
                    ? "bg-white text-[#1B5E20] shadow-md"
                    : "text-white/80 hover:text-white"
                }`}
              >
                <BarChart3 size={15} />
                <span>{txt.chartsViewTab}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-emerald-100 backdrop-blur-md">
            <CheckCircle2 size={13} className="text-emerald-300" />
            <span>
              {viewMode === "simple"
                ? (language === "mr" ? "शेतकऱ्यांसाठी अतिशय सोपे रंगीत मापक आणि थेट खत सल्ला" : language === "hi" ? "किसानों के लिए अत्यंत सरल रंगीन मीटर और सीधा खाद सुझाव" : "Ultra-simple color gauges and direct fertilizer guidance for farmers")
                : (language === "mr" ? "तपशीलवार आलेख आणि तांत्रिक आकडेवारी" : language === "hi" ? "विस्तृत चार्ट्स और तकनीकी आंकड़े" : "Detailed charts and technical trends")}
            </span>
          </div>
        </div>
      </div>

      {/* KEY PERFORMANCE INDICATORS (KPI CARDS) - DYNAMIC PER CITY */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 print-kpi-grid">
        {/* KPI 1: YIELD PRODUCTIVITY */}
        <div className="card card-interactive print-card print-avoid-break p-5 depth-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{txt.kpiYieldTitle}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-[#2E7D32] dark:text-emerald-300">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-800 dark:text-gray-100">
              {dynamicAverageYield}
            </span>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
              {language === "mr" ? "टन/एकर" : language === "hi" ? "टन/एकड़" : "t/acre"}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[#2E7D32] dark:text-emerald-400">
            <CheckCircle2 size={13} />
            <span>{txt.kpiYieldSub}</span>
          </div>
        </div>

        {/* KPI 2: SOIL HEALTH */}
        <div className="card card-interactive print-card print-avoid-break p-5 depth-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{txt.kpiSoilTitle}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-300">
              <Sprout size={18} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-800 dark:text-gray-100">{dynamicSoilScore}</span>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500">/ 100</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
            <ShieldCheck size={13} />
            <span>{txt.kpiSoilSub}</span>
          </div>
        </div>

        {/* KPI 3: TOTAL ESTIMATED PRODUCTION */}
        <div className="card card-interactive print-card print-avoid-break p-5 depth-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{txt.kpiMoistureTitle}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-950/70 text-teal-600 dark:text-teal-300">
              <Droplets size={18} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-800 dark:text-gray-100">{dynamicTotalProduction}</span>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500">{language === "mr" ? "टन" : language === "hi" ? "टन" : "Tonnes"}</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-teal-600 dark:text-teal-400">
            <Activity size={13} />
            <span>{txt.kpiMoistureSub} • ~{Math.round(dynamicTotalProduction * 20)} {language === "mr" ? "पोती" : language === "hi" ? "बोरी" : "bags"}</span>
          </div>
        </div>

        {/* KPI 4: TOP CROP */}
        <div className="card card-interactive print-card print-avoid-break p-5 depth-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{txt.kpiTopCropTitle}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-300">
              <Wheat size={18} />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-gray-800 dark:text-gray-100 truncate block">
              {topCropDisplay}
            </span>
          </div>
          <div className="mt-2 text-[11px] font-bold text-amber-600 dark:text-amber-400">
            {tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} ({currentDistrictProfile.zone.split("/")[0].trim()})
          </div>
        </div>
      </div>

      {/* CALLOUT BANNER FOR USERS WITH FEW RECORDS IN CURRENT DISTRICT */}
      {districtPredictions.length === 0 && dataMode === "myFarm" && (
        <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-[#122317] p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                {language === "mr"
                  ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} साठी थेट पीक अंदाज घ्या!`
                  : language === "hi"
                  ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} के लिए वास्तविक उपज पूर्वानुमान लें!`
                  : `Personalize ${selectedDistrict} farmland telemetry!`}
              </h4>
              <p className="text-[11px] text-emerald-800/80 dark:text-emerald-400/90">
                {language === "mr"
                  ? "सध्या जिल्हा मानक माहिती दाखवली जात आहे. आपल्या शेताचा थेट उत्पादन अंदाज व माती चाचणी करून अचूक आलेख मिळवा."
                  : language === "hi"
                  ? "वर्तमान में जिला मानक आंकड़े दिखाए जा रहे हैं। वास्तविक परीक्षण करके अपने खेत का डेटा जोड़ें।"
                  : "Currently displaying certified district baseline. Run crop yield prediction or soil tests to feed real sensor data."}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {nav && (
              <>
                <button
                  type="button"
                  onClick={() => nav("yield-prediction")}
                  className="rounded-xl bg-[#1B5E20] dark:bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#2E7D32] dark:hover:bg-emerald-500 transition cursor-pointer"
                >
                  🌾 {language === "mr" ? "उत्पादन अंदाज घ्या" : language === "hi" ? "उपज पूर्वानुमान" : "Forecast Yield"}
                </button>
                <button
                  type="button"
                  onClick={() => nav("crop-recommendation")}
                  className="rounded-xl bg-white dark:bg-[#183321] border border-emerald-300 dark:border-emerald-700 px-3.5 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 shadow-xs hover:bg-emerald-100/50 dark:hover:bg-[#20442c] transition cursor-pointer"
                >
                  🧪 {language === "mr" ? "माती चाचणी करा" : language === "hi" ? "मृदा परीक्षण" : "Soil Test"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          MAIN VISUALIZATION: ULTRA-SIMPLE FARMER VIEW VS DETAILED CHARTS
      ========================================================= */}
      {viewMode === "simple" ? (
        /* ULTRA-SIMPLE FARMER-FRIENDLY VISUAL MODULES */
        <div className="space-y-6">
          {/* MODULE 1: CROP DIVERSITY & LAND ALLOCATION */}
          <div className="card print-card print-avoid-break p-6 depth-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <PieChartIcon size={19} className="text-[#2E7D32] dark:text-emerald-400" />
                  <span>{txt.cropDistTitle}</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {language === "mr"
                    ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} जिल्ह्यातील प्रमुख पिके, शेतजमीन वाटा (एकर) आणि संभाव्य उत्पादन`
                    : language === "hi"
                    ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} जिले की प्रमुख फसलें, कृषि भूमि शेयर (एकड़) और अनुमानित उपज`
                    : `Crop distribution, acreage share and projected harvest for ${selectedDistrict}`}
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/40 px-3 py-1 text-xs font-bold text-[#2E7D32] dark:text-emerald-300 self-start sm:self-auto">
                📍 {tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} • {userFarmSize} {language === "mr" ? "एकर शेत" : language === "hi" ? "एकड़ खेत" : "Acres Farm"}
              </span>
            </div>

            {/* VISUAL CROP BARS & ACREAGE ALLOCATION */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-1">
              {cropDiversityData.map((item, idx) => {
                const shareAcres = ((item.value / 100) * userFarmSize).toFixed(1);
                const estTons = (parseFloat(shareAcres) * parseFloat(dynamicAverageYield)).toFixed(1);
                const estBags = Math.round(parseFloat(estTons) * 20);
                const cropEmoji = getCropEmoji(item.rawName || item.name);

                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-gradient-to-br from-white to-[#F8FAF7] dark:from-[#132218] dark:to-[#0f1b13] p-4 shadow-2xs space-y-2.5 transition-transform hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100/70 dark:bg-emerald-950 text-lg shadow-2xs">
                          {cropEmoji}
                        </span>
                        <div>
                          <h4 className="text-sm font-extrabold text-gray-800 dark:text-gray-100">
                            {item.name}
                          </h4>
                          <span className="text-[10px] font-bold text-gray-400">
                            {idx === 0
                              ? (language === "mr" ? "🥇 सर्वाधिक लागवड" : language === "hi" ? "🥇 सबसे अधिक बुवाई" : "🥇 Top Crop")
                              : idx === 1
                              ? (language === "mr" ? "🥈 दुय्यम पीक" : language === "hi" ? "🥈 द्वितीय फसल" : "🥈 Secondary Crop")
                              : (language === "mr" ? "🥉 पूरक पीक" : language === "hi" ? "🥉 पूरक फसल" : "🥉 Complementary Crop")}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-[#1B5E20] dark:text-emerald-400">
                          {item.value}%
                        </span>
                        <span className="block text-[10px] font-bold text-gray-500 dark:text-gray-400">
                          {shareAcres} {language === "mr" ? "एकर" : language === "hi" ? "एकड़" : "Acres"}
                        </span>
                      </div>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${item.value}%`,
                          backgroundColor: CROP_COLORS[idx % CROP_COLORS.length],
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-600 dark:text-gray-300 pt-0.5 border-t border-gray-100 dark:border-white/5">
                      <span>
                        {language === "mr" ? "अंदाजित उत्पादन:" : language === "hi" ? "अनुमानित उपज:" : "Est. Harvest:"}
                      </span>
                      <span className="text-[#1B5E20] dark:text-emerald-300 font-extrabold">
                        {estTons} {language === "mr" ? "टन" : language === "hi" ? "टन" : "t"} (~{estBags} {language === "mr" ? "पोती" : language === "hi" ? "बोरी" : "bags"})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FARMER TAKEAWAY BOX */}
            <div className="rounded-2xl bg-[#F0FDF4] dark:bg-[#07190D] border border-emerald-200 dark:border-emerald-800/80 p-4 text-xs flex items-start gap-3 shadow-2xs">
              <span className="text-xl shrink-0">💡</span>
              <div>
                <strong className="text-[#1B5E20] dark:text-emerald-300 font-extrabold block text-sm mb-1">
                  {txt.farmerTipTitle}
                </strong>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                  {language === "mr"
                    ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} जिल्ह्यात ${topCropDisplay} आणि सोयाबीन/कापूस हे पीक मुख्य मानले जाते. शेतात एकाच पिकावर अवलंबून न राहता आंतरपीक (उदा. सोयाबीन + तूर किंवा कापूस + मूग) घेतल्यास बाजारभावातील घसरणीतही शाश्वत उत्पन्न मिळते.`
                    : language === "hi"
                    ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} जिले में ${topCropDisplay} और सोयाबीन/कपास मुख्य फसलें हैं। केवल एक फसल न लेकर अंतर-फसल (जैसे सोयाबीन + अरहर) लगाएं जिससे जोखिम कम होगा।`
                    : `${topCropDisplay} and major regional crops lead acreage in ${selectedDistrict}. Intercropping mitigates price volatility and maximizes land profitability.`}
                </p>
              </div>
            </div>
          </div>

          {/* MODULE 2: SOIL HEALTH & N-P-K STATUS (VISUAL GAUGES) */}
          <div className="card print-card print-avoid-break p-6 depth-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <Activity size={19} className="text-blue-600 dark:text-blue-400" />
                  <span>
                    {language === "mr"
                      ? "मातीचे आरोग्य व खत व्यवस्थापन (रंगीत मापक)"
                      : language === "hi"
                      ? "मृदा स्वास्थ्य एवं खाद प्रबंधन (रंगीन मीटर)"
                      : "Soil Health & Nutrient Gauges"}
                  </span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {language === "mr"
                    ? "नत्र, स्फुरद, पालाश, सामू व सेंद्रिय कर्बाचे प्रमाण आणि खतांचा थेट सल्ला"
                    : language === "hi"
                    ? "नाइट्रोजन, फास्फोरस, पोटाश, पीएच एवं जैविक कार्बन की स्थिति और खाद सलाह"
                    : "N-P-K nutrient status, soil balance and practical fertilizer remedies"}
                </p>
              </div>

              {/* OVERALL SOIL SCORE BADGE */}
              <div className="flex items-center gap-3 rounded-2xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/60 p-2.5 px-4 self-start sm:self-auto shadow-2xs">
                <span className="text-2xl">🌱</span>
                <div>
                  <div className="text-[10px] font-bold uppercase text-blue-700 dark:text-blue-300">
                    {language === "mr" ? "मृदा आरोग्य निर्देशांक" : language === "hi" ? "मृदा स्वास्थ्य स्कोर" : "Soil Health Index"}
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-blue-900 dark:text-blue-100">
                      {dynamicSoilScore}
                    </span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-300">/ 100</span>
                    <span className="ml-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#1B5E20] dark:text-emerald-300 px-2 py-0.2 text-[10px] font-black">
                      {dynamicSoilScore >= 75
                        ? (language === "mr" ? "उत्कृष्ट सुपीक" : language === "hi" ? "उत्कृष्ट" : "High Fertility")
                        : (language === "mr" ? "मध्यम सुपीक" : language === "hi" ? "मध्यम" : "Moderate")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5 NUTRIENT STATUS BARS */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-1">
              {nutrientCards.map((n) => (
                <div
                  key={n.id}
                  className="rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-gradient-to-br from-white to-[#F8FAF7] dark:from-[#132218] dark:to-[#0f1b13] p-4 shadow-2xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-gray-800 dark:text-gray-100">
                      {n.name}
                    </h4>
                    <span className="rounded-full bg-gray-100 dark:bg-white/10 px-2 py-0.5 text-[10px] font-black">
                      {n.badge}
                    </span>
                  </div>

                  <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                    🎯 {n.role}
                  </p>

                  {/* Meter progress bar */}
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        n.status === "optimal"
                          ? "bg-gradient-to-r from-emerald-500 to-[#1B5E20]"
                          : n.status === "moderate"
                          ? "bg-gradient-to-r from-amber-400 to-amber-600"
                          : "bg-gradient-to-r from-red-500 to-red-700"
                      }`}
                      style={{ width: `${n.pct}%` }}
                    />
                  </div>

                  {/* Practical fertilizer advice */}
                  <div className="rounded-xl bg-[#F8FAF7] dark:bg-white/5 p-2.5 border border-gray-100 dark:border-white/5 text-[11px] text-gray-700 dark:text-gray-200 space-y-1">
                    <span className="font-extrabold text-[#1B5E20] dark:text-emerald-300 block">
                      🚜 {language === "mr" ? "खतांचा थेट सल्ला:" : language === "hi" ? "खाद की सलाह:" : "Fertilizer Advisory:"}
                    </span>
                    <p className="leading-snug">
                      {n.advice}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* FARMER TAKEAWAY BOX */}
            <div className="rounded-2xl bg-[#F0FDF4] dark:bg-[#07190D] border border-emerald-200 dark:border-emerald-800/80 p-4 text-xs flex items-start gap-3 shadow-2xs">
              <span className="text-xl shrink-0">💡</span>
              <div>
                <strong className="text-[#1B5E20] dark:text-emerald-300 font-extrabold block text-sm mb-1">
                  {txt.farmerTipTitle}
                </strong>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                  {currentDistrictProfile.insights.nutrient[language] || currentDistrictProfile.insights.nutrient.mr}
                </p>
              </div>
            </div>
          </div>

          {/* MODULE 3: SEASONAL HARVEST COMPARISON */}
          <div className="card print-card print-avoid-break p-6 depth-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <TrendingUp size={19} className="text-[#2E7D32] dark:text-emerald-400" />
                  <span>
                    {language === "mr"
                      ? "हंगामनिहाय उत्पादन व नफा तुलना (खरीप / रब्बी / उन्हाळी)"
                      : language === "hi"
                      ? "मौसमी उपज एवं लाभ तुलना (खरीफ / रबी / जायद)"
                      : "Seasonal Harvest & Profit Comparison (Kharif / Rabi / Summer)"}
                  </span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {language === "mr"
                    ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} मधील तिन्ही हंगामांमधील सरासरी उत्पादन आणि एकूण पोती/टन हिशोब`
                    : language === "hi"
                    ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} में तीनों मौसमों की औसत उपज और कुल क्विंटल/टन गणना`
                    : `Yield comparison in tonnes/acre and total harvest sacks across crop seasons`}
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/40 px-3 py-1 text-xs font-bold text-[#2E7D32] dark:text-emerald-300 self-start sm:self-auto">
                🌾 {userFarmSize} {language === "mr" ? "एकर क्षेत्र" : language === "hi" ? "एकड़ क्षेत्र" : "Acres Scope"}
              </span>
            </div>

            {/* 3 SEASON CARDS */}
            <div className="grid gap-4 sm:grid-cols-3 pt-1">
              {seasonalHarvestCards.map((sc) => (
                <div
                  key={sc.id}
                  className="rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-gradient-to-br from-white to-[#F8FAF7] dark:from-[#132218] dark:to-[#0f1b13] p-5 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{sc.icon}</span>
                      <div>
                        <h4 className="text-sm font-black text-gray-800 dark:text-gray-100">
                          {sc.name}
                        </h4>
                        <span className="text-[10px] font-bold text-gray-400">{sc.rating}</span>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#1B5E20] dark:text-emerald-300 px-2.5 py-0.5 text-[10px] font-black">
                      {sc.badge}
                    </span>
                  </div>

                  {/* Big Yield Display */}
                  <div className="rounded-xl bg-gray-50/90 dark:bg-white/5 p-3 text-center border border-gray-100 dark:border-white/5">
                    <div className="text-2xl font-black text-[#1B5E20] dark:text-emerald-400">
                      {sc.yield}
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">
                        {language === "mr" ? "टन / एकर" : language === "hi" ? "टन / एकड़" : "t / acre"}
                      </span>
                    </div>
                    <div className="mt-1 text-xs font-extrabold text-gray-700 dark:text-gray-200">
                      {language === "mr" ? "एकूण उत्पादन:" : language === "hi" ? "कुल उत्पादन:" : "Total Harvest:"}{" "}
                      <span className="text-[#1B5E20] dark:text-emerald-300">
                        {sc.totalTons} {language === "mr" ? "टन" : language === "hi" ? "टन" : "t"} (~{sc.bags} {language === "mr" ? "पोती" : language === "hi" ? "बोरी" : "bags"})
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      {language === "mr" ? "शिफारस पिके:" : language === "hi" ? "अनुशंसित फसलें:" : "Recommended Crops:"}
                    </span>
                    <p className="font-bold text-gray-800 dark:text-gray-200 text-[11px]">
                      {sc.crops}
                    </p>
                  </div>

                  <div className="text-[11px] font-bold text-[#1B5E20] dark:text-emerald-400 flex items-center gap-1 pt-2 border-t border-gray-100 dark:border-white/5">
                    <CheckCircle2 size={13} />
                    <span>{sc.status}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* FARMER TAKEAWAY BOX */}
            <div className="rounded-2xl bg-[#F0FDF4] dark:bg-[#07190D] border border-emerald-200 dark:border-emerald-800/80 p-4 text-xs flex items-start gap-3 shadow-2xs">
              <span className="text-xl shrink-0">💡</span>
              <div>
                <strong className="text-[#1B5E20] dark:text-emerald-300 font-extrabold block text-sm mb-1">
                  {txt.farmerTipTitle}
                </strong>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                  {language === "mr"
                    ? `खरीप हंगामात मान्सूनच्या चांगल्या पावसामुळे सर्वात जास्त उत्पादन मिळते. रब्बी हंगामात पाण्याची सोय असल्यास हरभरा (दिग्विजय), गहू किंवा कांद्याचे पीक घेतल्यास कमी खर्चात शाश्वत नफा मिळतो. उन्हाळी पिके केवळ पाण्याची खात्री असल्यास घ्यावीत.`
                    : language === "hi"
                    ? `खरीफ मौसम में अच्छी बारिश के कारण सबसे अधिक उपज मिलती है। रबी में पानी की सुविधा होने पर चना या गेहूं लेने से कम लागत में अधिक लाभ होता है।`
                    : `Kharif season yields peak with rainfall support. In Rabi, chickpea and wheat offer reliable market value with lower fertilizer inputs.`}
                </p>
              </div>
            </div>
          </div>

          {/* MODULE 4: WEATHER & MONTHLY FARMING CALENDAR */}
          <div className="card print-card print-avoid-break p-6 depth-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <Thermometer size={19} className="text-rose-500 dark:text-rose-400" />
                  <span>
                    {language === "mr"
                      ? "पाऊस आणि शेतकाम दिनदर्शिका (जून ते नोव्हेंबर)"
                      : language === "hi"
                      ? "वर्षा एवं कृषि कार्य कैलेंडर (जून से नवंबर)"
                      : "Rainfall & Monthly Agricultural Calendar (Jun - Nov)"}
                  </span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {language === "mr"
                    ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict}: पाऊस (मिमी), तापमान आणि महिन्यानुसार करायची शेती कामे`
                    : language === "hi"
                    ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict}: बारिश (मिमी), तापमान और महीने अनुसार कृषि कार्य`
                    : `Monthly precipitation, thermal indices and practical fieldwork timeline`}
                </p>
              </div>
              <span className="rounded-full bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800/40 px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-300 self-start sm:self-auto">
                🌧️ {currentDistrictProfile.rainfall} mm/yr {language === "mr" ? "वार्षिक पाऊस" : language === "hi" ? "वार्षिक वर्षा" : "Annual Rain"}
              </span>
            </div>

            {/* 6 MONTHLY CARDS */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-1">
              {weatherCalendar.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-gradient-to-br from-white to-[#F8FAF7] dark:from-[#132218] dark:to-[#0f1b13] p-4 shadow-2xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.cal.icon}</span>
                      <div>
                        <h4 className="text-sm font-extrabold text-gray-800 dark:text-gray-100">
                          {item.month}
                        </h4>
                        <span className="text-[10px] font-bold text-gray-400">{item.cal.rainType}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                        🌧️ {item.rainfall} mm
                      </span>
                      <span className="block text-[10px] font-bold text-rose-600 dark:text-rose-400">
                        ☀️ {item.temp}°C
                      </span>
                    </div>
                  </div>

                  {/* Rain level progress bar */}
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round((item.rainfall / 320) * 100))}%` }}
                    />
                  </div>

                  {/* Monthly Farm Action */}
                  <div className="rounded-xl bg-[#F8FAF7] dark:bg-white/5 p-2.5 border border-gray-100 dark:border-white/5 text-[11px] text-gray-700 dark:text-gray-200">
                    <span className="font-extrabold text-[#1B5E20] dark:text-emerald-300 block mb-0.5">
                      🚜 {language === "mr" ? "महिन्याचे शेतकाम:" : language === "hi" ? "महीने का कृषि कार्य:" : "Fieldwork Action:"}
                    </span>
                    <p className="leading-snug">
                      {item.cal.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* FARMER TAKEAWAY BOX */}
            <div className="rounded-2xl bg-[#F0FDF4] dark:bg-[#07190D] border border-emerald-200 dark:border-emerald-800/80 p-4 text-xs flex items-start gap-3 shadow-2xs">
              <span className="text-xl shrink-0">💡</span>
              <div>
                <strong className="text-[#1B5E20] dark:text-emerald-300 font-extrabold block text-sm mb-1">
                  {txt.farmerTipTitle}
                </strong>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                  {currentDistrictProfile.insights.irrigation[language] || currentDistrictProfile.insights.irrigation.mr}
                </p>
              </div>
            </div>
          </div>

          {/* MODULE 5: MAHARASHTRA DISTRICT AGRONOMY RANKING */}
          <div className="card print-card print-avoid-break p-6 depth-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <Layers size={19} className="text-[#2E7D32] dark:text-emerald-400" />
                  <span>{txt.districtRankTitle}</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{txt.districtRankDesc}</p>
              </div>
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/40 px-3 py-1 text-xs font-bold text-[#2E7D32] dark:text-emerald-300 self-start sm:self-auto">
                {language === "mr" ? "प्रमुख कृषी विभाग" : language === "hi" ? "प्रमुख कृषि क्षेत्र" : "Maharashtra Agro Zones"}
              </span>
            </div>

            {/* HORIZONTAL RANKING CARDS */}
            <div className="grid gap-2.5 sm:grid-cols-2 pt-1">
              {topDistrictRankingList.map((entry, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border p-3.5 transition-all shadow-2xs ${
                    entry.isCurrent
                      ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/30"
                      : "border-gray-100 dark:border-gray-800/80 bg-white dark:bg-[#132218] text-gray-800 dark:text-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs font-black ${
                          entry.isCurrent
                            ? "bg-[#1B5E20] text-white"
                            : idx === 0
                            ? "bg-amber-400 text-gray-900"
                            : idx === 1
                            ? "bg-gray-300 text-gray-900"
                            : idx === 2
                            ? "bg-amber-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
                      </span>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs sm:text-sm font-extrabold">
                            {entry.districtLabel}
                          </h4>
                          {entry.isCurrent && (
                            <span className="rounded-full bg-[#1B5E20] text-white px-2 py-0.2 text-[9px] font-black uppercase">
                              {language === "mr" ? "📍 तुमचा जिल्हा" : language === "hi" ? "📍 आपका जिला" : "📍 Your District"}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 block mt-0.5">
                          🌾 {entry.topCrop}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm sm:text-base font-black text-[#1B5E20] dark:text-emerald-400">
                        {entry.yield}
                      </span>
                      <span className="block text-[10px] font-bold text-gray-400">
                        {language === "mr" ? "टन/एकर" : language === "hi" ? "टन/एकड़" : "t/acre"}
                      </span>
                    </div>
                  </div>

                  {/* Mini progress bar */}
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden mt-2.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        entry.isCurrent ? "bg-emerald-600 dark:bg-emerald-400" : "bg-emerald-300 dark:bg-emerald-700"
                      }`}
                      style={{ width: `${Math.min(100, Math.round((entry.yield / 3.0) * 100))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* FARMER TAKEAWAY BOX */}
            <div className="rounded-2xl bg-[#F0FDF4] dark:bg-[#07190D] border border-emerald-200 dark:border-emerald-800/80 p-4 text-xs flex items-start gap-3 shadow-2xs">
              <span className="text-xl shrink-0">💡</span>
              <div>
                <strong className="text-[#1B5E20] dark:text-emerald-300 font-extrabold block text-sm mb-1">
                  {txt.farmerTipTitle}
                </strong>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                  {language === "mr"
                    ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} जिल्ह्यातील सरासरी उत्पादन ${dynamicAverageYield} टन/एकर आहे. आधुनिक ठिबक सिंचन, सेंद्रिय खतांचा वापर आणि योग्य वेळी कीड नियंत्रण केल्यास आपण याहून ३०% अधिक उत्पादन मिळवू शकता.`
                    : language === "hi"
                    ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} जिले की औसत उपज ${dynamicAverageYield} टन/एकड़ है। उचित पोषण व सिंचाई प्रबंधन से आप औसत से 30% अधिक उत्पादन ले सकते हैं।`
                    : `Average productivity in ${selectedDistrict} is ${dynamicAverageYield} t/acre. Drip fertigation and timely pest control can comfortably boost your farm yield above district averages.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* DETAILED CHARTS VIEW (WITH FARMER TAKEAWAYS UNDER EACH CHART) */
        <div className="space-y-6">
          {/* ROW 1: CROP DIVERSITY (DONUT) & SOIL NUTRIENTS (RADAR) */}
          <div className="grid gap-6 lg:grid-cols-2 analytics-grid-row">
            {/* CHART 1: CROP DIVERSITY (DONUT / PIE) */}
            <div className="card print-card print-avoid-break p-6 depth-1 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <div>
                  <h2 className="text-base font-extrabold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <PieChartIcon size={18} className="text-[#2E7D32] dark:text-emerald-400" />
                    <span>{txt.cropDistTitle}</span>
                  </h2>
                  <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">{txt.cropDistDesc}</p>
                </div>
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-transparent dark:border-emerald-800/40 px-2.5 py-1 text-[10px] font-bold text-[#2E7D32] dark:text-emerald-300">
                  {tDistrict ? tDistrict(selectedDistrict) : selectedDistrict}
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={cropDiversityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                      isAnimationActive={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {cropDiversityData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CROP_COLORS[index % CROP_COLORS.length]}
                          stroke={isDark ? "#132218" : "#FFFFFF"}
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [
                        `${value} ${districtPredictions.length > 0 && dataMode === "myFarm" ? "Records" : "%"}`,
                        name,
                      ]}
                      contentStyle={tooltipStyle}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ fontSize: "11px", fontWeight: "600", color: axisColor }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Takeaway box */}
              <div className="rounded-xl bg-[#F0FDF4] dark:bg-[#07190D] border border-emerald-200 dark:border-emerald-800/80 p-3 text-xs flex items-start gap-2">
                <span className="text-base shrink-0">💡</span>
                <p className="text-gray-700 dark:text-gray-200">
                  <strong className="text-[#1B5E20] dark:text-emerald-300 mr-1">{txt.farmerTipTitle}:</strong>
                  {language === "mr"
                    ? `${selectedDistrict} जिल्ह्यात ${topCropDisplay} हे प्रमुख पीक आहे. आंतरपीक घेतल्यास बाजारभावातील घसरणीतही नफा टिकून राहतो.`
                    : `${topCropDisplay} is dominant in ${selectedDistrict}. Intercropping mitigates farm market risk.`}
                </p>
              </div>
            </div>

            {/* CHART 2: SOIL NUTRIENT N-P-K & pH (RADAR CHART) */}
            <div className="card print-card print-avoid-break p-6 depth-1 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <div>
                  <h2 className="text-base font-extrabold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <Activity size={18} className="text-blue-600 dark:text-blue-400" />
                    <span>{txt.soilRadarTitle}</span>
                  </h2>
                  <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">{txt.soilRadarDesc}</p>
                </div>
                <span className="rounded-full bg-blue-50 dark:bg-blue-950/70 border border-transparent dark:border-blue-800/40 px-2.5 py-1 text-[10px] font-bold text-blue-600 dark:text-blue-300">
                  {tDistrict ? tDistrict(selectedDistrict) : selectedDistrict}
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={soilRadarData}>
                    <PolarGrid stroke={gridColor} />
                    <PolarAngleAxis
                      dataKey="nutrient"
                      tick={{ fill: axisColor, fontSize: 11, fontWeight: "bold" }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: axisColor, fontSize: 9 }} />
                    <Radar
                      name={txt.yourFarmLegend}
                      dataKey="current"
                      stroke="#2E7D32"
                      fill="#2E7D32"
                      fillOpacity={0.45}
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                    <Radar
                      name={txt.idealBaselineLegend}
                      dataKey="ideal"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.12}
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      isAnimationActive={false}
                    />
                    <Tooltip
                      formatter={(value) => [`${value} / 100 Index`, ""]}
                      contentStyle={tooltipStyle}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      wrapperStyle={{ fontSize: "11px", fontWeight: "600", color: axisColor }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Takeaway box */}
              <div className="rounded-xl bg-[#F0FDF4] dark:bg-[#07190D] border border-emerald-200 dark:border-emerald-800/80 p-3 text-xs flex items-start gap-2">
                <span className="text-base shrink-0">💡</span>
                <p className="text-gray-700 dark:text-gray-200">
                  <strong className="text-[#1B5E20] dark:text-emerald-300 mr-1">{txt.farmerTipTitle}:</strong>
                  {currentDistrictProfile.insights.nutrient[language] || currentDistrictProfile.insights.nutrient.mr}
                </p>
              </div>
            </div>
          </div>

          {/* ROW 2: SEASONAL YIELD GROWTH & CLIMATE TELEMETRY */}
          <div className="grid gap-6 lg:grid-cols-2 analytics-grid-row">
            {/* CHART 3: SEASONAL YIELD GROWTH (AREA CHART) */}
            <div className="card print-card print-avoid-break p-6 depth-1 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <div>
                  <h2 className="text-base font-extrabold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <TrendingUp size={18} className="text-[#2E7D32] dark:text-emerald-400" />
                    <span>{txt.yieldTrendTitle}</span>
                  </h2>
                  <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">{txt.yieldTrendDesc}</p>
                </div>
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-transparent dark:border-emerald-800/40 px-2.5 py-1 text-[10px] font-bold text-[#2E7D32] dark:text-emerald-300">
                  {tDistrict ? tDistrict(selectedDistrict) : selectedDistrict}
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={seasonalYieldData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="yieldColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2E7D32" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis dataKey="season" tick={{ fontSize: 11, fill: axisColor, fontWeight: 600 }} />
                    <YAxis unit=" t" tick={{ fontSize: 11, fill: axisColor }} domain={[0.5, 3.5]} />
                    <Tooltip
                      formatter={(val) => [`${val} ${language === "mr" ? "टन/एकर" : language === "hi" ? "टन/एकड़" : "t/acre"}`, ""]}
                      contentStyle={tooltipStyle}
                    />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "11px", fontWeight: "600", color: axisColor }} />
                    <Area
                      type="monotone"
                      dataKey="yield"
                      name={txt.predictedYieldLegend}
                      stroke="#2E7D32"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#yieldColor)"
                      isAnimationActive={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="benchmark"
                      name={txt.stateAvgLegend}
                      stroke="#94A3B8"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fill="transparent"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Takeaway box */}
              <div className="rounded-xl bg-[#F0FDF4] dark:bg-[#07190D] border border-emerald-200 dark:border-emerald-800/80 p-3 text-xs flex items-start gap-2">
                <span className="text-base shrink-0">💡</span>
                <p className="text-gray-700 dark:text-gray-200">
                  <strong className="text-[#1B5E20] dark:text-emerald-300 mr-1">{txt.farmerTipTitle}:</strong>
                  {language === "mr"
                    ? "खरीप हंगामात पाऊस चांगला असल्याने सर्वाधिक उत्पादन मिळते. रब्बी हंगामात हरभरा किंवा गहू घेतल्यास जमिनीचा कस टिकून राहतो."
                    : "Kharif yields peak with seasonal rainfall. In Rabi, chickpea and wheat deliver stable economic returns."}
                </p>
              </div>
            </div>

            {/* CHART 4: AGRO-CLIMATE & MOISTURE CORRELATION (COMPOSED) */}
            <div className="card print-card print-avoid-break p-6 depth-1 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <div>
                  <h2 className="text-base font-extrabold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <Thermometer size={18} className="text-rose-500 dark:text-rose-400" />
                    <span>{txt.climateTitle}</span>
                  </h2>
                  <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">{txt.climateDesc}</p>
                </div>
                <span className="rounded-full bg-rose-50 dark:bg-rose-950/70 border border-transparent dark:border-rose-800/40 px-2.5 py-1 text-[10px] font-bold text-rose-600 dark:text-rose-300">
                  {currentDistrictProfile.rainfall} mm/yr
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height={280}>
                  <ComposedChart data={climateData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: axisColor, fontWeight: 600 }} />
                    <YAxis yAxisId="left" unit="°" tick={{ fontSize: 11, fill: axisColor }} domain={[15, 45]} />
                    <YAxis yAxisId="right" orientation="right" unit="mm" tick={{ fontSize: 11, fill: axisColor }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "11px", fontWeight: "600", color: axisColor }} />
                    <Bar
                      yAxisId="right"
                      dataKey="rainfall"
                      name={txt.rainLegend}
                      fill="#93C5FD"
                      radius={[6, 6, 0, 0]}
                      barSize={24}
                      isAnimationActive={false}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="temp"
                      name={txt.tempLegend}
                      stroke="#EF4444"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#EF4444" }}
                      isAnimationActive={false}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="humidity"
                      name={txt.humidityLegend}
                      stroke="#10B981"
                      strokeWidth={2}
                      strokeDasharray="3 3"
                      dot={{ r: 3, fill: "#10B981" }}
                      isAnimationActive={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Takeaway box */}
              <div className="rounded-xl bg-[#F0FDF4] dark:bg-[#07190D] border border-emerald-200 dark:border-emerald-800/80 p-3 text-xs flex items-start gap-2">
                <span className="text-base shrink-0">💡</span>
                <p className="text-gray-700 dark:text-gray-200">
                  <strong className="text-[#1B5E20] dark:text-emerald-300 mr-1">{txt.farmerTipTitle}:</strong>
                  {currentDistrictProfile.insights.irrigation[language] || currentDistrictProfile.insights.irrigation.mr}
                </p>
              </div>
            </div>
          </div>

          {/* ROW 3: MAHARASHTRA DISTRICT AGRONOMY RANKING (BAR CHART) */}
          <div className="card print-card print-avoid-break p-6 depth-1 space-y-4">
            <div className="flex flex-col justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-base font-extrabold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <Layers size={18} className="text-[#2E7D32] dark:text-emerald-400" />
                  <span>{txt.districtRankTitle}</span>
                </h2>
                <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">{txt.districtRankDesc}</p>
              </div>
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-transparent dark:border-emerald-800/40 px-3 py-1 text-xs font-bold text-[#2E7D32] dark:text-emerald-300">
                {language === "mr" ? "प्रमुख कृषी विभाग" : language === "hi" ? "प्रमुख कृषि क्षेत्र" : "Maharashtra Agro Zones"}
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={districtRankingData}
                  layout="horizontal"
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                  <XAxis dataKey="districtLabel" tick={{ fontSize: 11, fill: axisColor, fontWeight: 600 }} />
                  <YAxis unit=" t" tick={{ fontSize: 11, fill: axisColor }} domain={[0, 3.5]} />
                  <Tooltip
                    formatter={(value, name, item) => [
                      `${value} ${language === "mr" ? "टन/एकर" : language === "hi" ? "टन/एकड़" : "t/acre"} (${item.payload.topCrop})`,
                      txt.predictedYieldLegend,
                    ]}
                    contentStyle={tooltipStyle}
                  />
                  <Bar dataKey="yield" radius={[8, 8, 0, 0]} barSize={32} isAnimationActive={false}>
                    {districtRankingData.map((entry, idx) => (
                      <Cell
                        key={`bar-${idx}`}
                        fill={entry.isCurrent ? (isDark ? "#22c55e" : "#1B5E20") : (isDark ? "#14532d" : "#86EFAC")}
                        stroke={entry.isCurrent ? (isDark ? "#4ade80" : "#2E7D32") : (isDark ? "#166534" : "#4ADE80")}
                        strokeWidth={entry.isCurrent ? 2 : 1}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Takeaway box */}
            <div className="rounded-xl bg-[#F0FDF4] dark:bg-[#07190D] border border-emerald-200 dark:border-emerald-800/80 p-3 text-xs flex items-start gap-2">
              <span className="text-base shrink-0">💡</span>
              <p className="text-gray-700 dark:text-gray-200">
                <strong className="text-[#1B5E20] dark:text-emerald-300 mr-1">{txt.farmerTipTitle}:</strong>
                {language === "mr"
                  ? `${selectedDistrict} जिल्ह्यातील सरासरी उत्पादन ${dynamicAverageYield} टन/एकर आहे. आधुनिक खत व पाणी व्यवस्थापनाने आपण सरासरीपेक्षा अधिक उत्पादन काढू शकता.`
                  : `Average yield in ${selectedDistrict} is ${dynamicAverageYield} t/acre. Drip irrigation and balanced nutrition can increase your farm yield.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          ROW 4: AGRONOMIC INSIGHTS & AI SUMMARY - DYNAMIC PER CITY
      ========================================================= */}
      <div className="card print-card print-avoid-break rounded-3xl border border-[#DCE8D9] dark:border-[#24402a] bg-gradient-to-br from-[#F4F9F1] to-[#EAF3E6] dark:from-[#132218] dark:to-[#0f1b13] p-6 depth-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-[#183321] text-[#2E7D32] dark:text-emerald-400 shadow-sm border border-transparent dark:border-[#24402a]">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#1B5E20] dark:text-emerald-300">
              {txt.keyInsightsTitle}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {language === "mr"
                ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} च्या माती व हवामान विश्लेषणावर आधारित शेती सुधारणा सल्ला`
                : language === "hi"
                ? `${tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} के मृदा एवं मौसम विश्लेषण पर आधारित फसल सुधार सुझाव`
                : `Automated agronomic recommendations derived from ${selectedDistrict} agro-climatic telemetry`}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* INSIGHT 1: NUTRIENT */}
          <div className="rounded-2xl bg-white dark:bg-[#183321]/70 p-4 shadow-xs border border-green-100 dark:border-[#24402a]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2E7D32] dark:text-emerald-300">
              <CheckCircle2 size={15} />
              <span>
                {language === "mr"
                  ? "सेंद्रिय खत व पोषण व्यवस्थापन"
                  : language === "hi"
                  ? "जैविक खाद एवं पोषण प्रबंधन"
                  : "Nutrient & Soil Balance"}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              {currentDistrictProfile.insights.nutrient[language] ||
                currentDistrictProfile.insights.nutrient.en}
            </p>
          </div>

          {/* INSIGHT 2: IRRIGATION */}
          <div className="rounded-2xl bg-white dark:bg-[#183321]/70 p-4 shadow-xs border border-green-100 dark:border-[#24402a]">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
              <Droplets size={15} />
              <span>
                {language === "mr"
                  ? "पाण्याचे सूक्ष्म नियोजन"
                  : language === "hi"
                  ? "सूक्ष्म सिंचाई योजना"
                  : "Micro-Irrigation & Water"}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              {currentDistrictProfile.insights.irrigation[language] ||
                currentDistrictProfile.insights.irrigation.en}
            </p>
          </div>

          {/* INSIGHT 3: ROTATION */}
          <div className="rounded-2xl bg-white dark:bg-[#183321]/70 p-4 shadow-xs border border-green-100 dark:border-[#24402a]">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Wheat size={15} />
              <span>
                {language === "mr"
                  ? "हंगामी पीक फेरपालट व नियोजन"
                  : language === "hi"
                  ? "मौसमी फसल चक्र एवं बाजार"
                  : "Crop Rotation & Strategy"}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              {currentDistrictProfile.insights.rotation[language] ||
                currentDistrictProfile.insights.rotation.en}
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================
          PRINT-ONLY FOOTER
      ========================================================= */}
      <div className="print-only print-footer mt-8 border-t border-gray-200 pt-4 text-center text-[10px] text-gray-500 print:mt-2 print:pt-2">
        <div className="flex items-center justify-center">
          <span>🌱 KrushiMitra AI Agriculture Platform • {tDistrict ? tDistrict(selectedDistrict) : selectedDistrict} District Agro-Dossier</span>
        </div>
      </div>
    </div>
  );
}
