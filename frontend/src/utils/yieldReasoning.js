// =========================================================
// KRUSHIMITRA YIELD PREDICTION AGRONOMIC REASONING ENGINE
// Generates detailed, farmer-friendly agronomic explanations
// for Crop Yield Prediction results.
// Analyzes:
//  1. Yield Performance Benchmark vs Maharashtra state averages
//  2. Rainfall & Soil Moisture adequacy vs crop water demand
//  3. Temperature & Thermal stress / comfort zone
//  4. Regional District agro-climatic & soil suitability
//  5. Seasonal timing & photoperiod alignment
//  6. Actionable field advisory to achieve or exceed predicted yield
// Fully supports Marathi (mr), Hindi (hi), and English (en).
// =========================================================

export const CROP_YIELD_PROFILES = {
  cotton: {
    baseYield: 1.8, // t/ha (seed cotton / kapas)
    unit: "t/ha",
    rainMin: 550,
    rainIdealMin: 650,
    rainIdealMax: 900,
    rainMax: 1200,
    tempIdealMin: 25,
    tempIdealMax: 35,
    primeDistricts: [
      "AMRAVATI", "YAVATMAL", "AKOLA", "WARDHA", "NAGPUR", "BULDHANA", "WASHIM",
      "JALGAON", "DHULE", "NANDURBAR", "AURANGABAD", "JALNA", "BEED", "PARBHANI", "NANDED"
    ],
    primarySeason: "Kharif",
    names: { en: "Cotton", mr: "कापूस", hi: "कपास" },
    soilType: {
      en: "Deep black Vertisol soils with high clay content and high moisture retention.",
      mr: "पाण्याचा उत्तम निचरा होणारी मध्यम ते खोल काळी कसदार जमीन (काळी कपाशीची माती).",
      hi: "मध्यम से गहरी काली रेगुर मिट्टी जिसमें नमी धारण करने की उच्च क्षमता हो।"
    },
    tips: {
      mr: [
        "पात्या व फुले लागण्याच्या अवस्थेत 13:0:45 (पोटॅशियम नायट्रेट) ची २ ग्रॅम/लिटर दराने फवारणी केल्यास बोंडाचे वजन वाढते व गळ कमी होते.",
        "गुलाबी बोंडअळीच्या नियंत्रणासाठी पेरणीनंतर ४५ दिवसांनी हेक्टरी ५ कामगंध सापळे (Pheromone Traps) उभारावेत.",
        "पाण्याचा ताण पडल्यास किंवा जास्त पाऊस झाल्यास शेतात पाणी साचू न देता चर काढून पाण्याचा निचरा ठेवा."
      ],
      hi: [
        "फूल व टिंडे बनते समय 13:0:45 (पोटेशियम नाइट्रेट) का 2 ग्राम/लीटर पानी में छिड़काव करें जिससे कलियां झड़ने से बचेंगी।",
        "गुलाबी सुंडी की रोकथाम के लिए बुवाई के 45 दिनों बाद प्रति हेक्टेयर 5 फेरोमोन ट्रैप लगाएं।",
        "भारी वर्षा की स्थिति में खेत से अतिरिक्त पानी निकालने के लिए नालियां खुली रखें।"
      ],
      en: [
        "Foliar spray of Potassium Nitrate (13:0:45 @ 10g/L) during flowering and square formation reduces shedding and boosts boll weight.",
        "Install 5 pheromone traps per hectare at 45 DAS for early pink bollworm scouting and monitoring.",
        "Ensure drainage furrows are clear to prevent water stagnation in heavy black clay soils during continuous rains."
      ]
    }
  },

  soybean: {
    baseYield: 2.2, // t/ha
    unit: "t/ha",
    rainMin: 500,
    rainIdealMin: 600,
    rainIdealMax: 850,
    rainMax: 1100,
    tempIdealMin: 24,
    tempIdealMax: 32,
    primeDistricts: [
      "LATUR", "NANDED", "OSMANABAD", "AMRAVATI", "AKOLA", "BULDHANA", "WASHIM",
      "YAVATMAL", "NAGPUR", "WARDHA", "KOLHAPUR", "SANGLI", "SATARA", "PUNE"
    ],
    primarySeason: "Kharif",
    names: { en: "Soybean", mr: "सोयाबीन", hi: "सोयाबीन" },
    soilType: {
      en: "Medium to deep well-drained loam to clay-loam soils with neutral pH.",
      mr: "उत्तम निचरा होणारी मध्यम ते भारी काळी जमीन ज्यामध्ये सेंद्रिय कर्बाचे प्रमाण चांगले आहे.",
      hi: "अच्छी जल निकासी वाली मध्यम से भारी दोमट मिट्टी।"
    },
    tips: {
      mr: [
        "शेंगा भरण्याच्या अवस्थेत (R3-R5) 0:52:34 ची १०० ग्रॅम प्रति १५ लिटर पंपाने फवारणी केल्यास दाणे टपोरे व वजनदार होतात.",
        "खोडकिडा व पाने खाणाऱ्या अळीच्या प्रादुर्भावावर वेळीच नियंत्रण ठेवा; पहिल्या ३०-३५ दिवसांत शेत तणमुक्त ठेवावे.",
        "सोयाबीनच्या मुळांवरील गाठी सुरक्षित राहण्यासाठी नत्र खताचा अतिरिक्त वापर टाळावा."
      ],
      hi: [
        "फलियों में दाना भरते समय 0:52:34 का छिड़काव करने से दाने मोटे और चमकदार बनते हैं।",
        "तना मक्खी और पत्ती लपेटक कीट की निगरानी करें; बुवाई के 35 दिनों तक खेत खरपतवार मुक्त रखें।",
        "राइजोबियम जीवाणु गांठों की सुरक्षा हेतु रासायनिक नाइट्रोजन का अत्यधिक प्रयोग न करें।"
      ],
      en: [
        "Apply foliar spray of 0:52:34 (MKP @ 10g/L) during pod initiation (R3) and grain filling (R5) for uniform bold seeds.",
        "Keep the crop weed-free during the critical first 30-35 days to avoid severe yield loss.",
        "Avoid excess nitrogen fertilizer to prevent vegetative lodging and promote natural Rhizobium nitrogen fixation."
      ]
    }
  },

  sugarcane: {
    baseYield: 82.0, // t/ha
    unit: "t/ha",
    rainMin: 1200,
    rainIdealMin: 1500,
    rainIdealMax: 2500,
    rainMax: 3500,
    tempIdealMin: 28,
    tempIdealMax: 38,
    primeDistricts: [
      "KOLHAPUR", "PUNE", "SANGLI", "SATARA", "SOLAPUR", "AHMEDNAGAR",
      "AURANGABAD", "JALNA", "BEED", "NANDED", "OSMANABAD", "NASHIK"
    ],
    primarySeason: "Whole Year",
    names: { en: "Sugarcane", mr: "ऊस", hi: "गन्ना" },
    soilType: {
      en: "Deep alluvial, clay-loam river basin soils with high organic matter and good water-holding capacity.",
      mr: "किमान १ मीटर खोल, गाळाची, पाण्याचा निचरा होणारी कसदार काळी जमीन.",
      hi: "गहरी दोमट व नदी कछार की उपजाऊ मिट्टी जिसमें प्रचुर जीवांश हो।"
    },
    tips: {
      mr: [
        "मोठ्या बांधणीच्या वेळी (१२० ते १३० दिवसांनी) शिफारशीत रासायनिक खतांचा शेवटचा हप्ता देऊन मातीची भर लावावी.",
        "ठिबक सिंचनाचा वापर केल्यास ५०% पाण्याची बचत होऊन हेक्टरी २० ते ३० टनांनी उत्पादन वाढते.",
        "कांड्या पोसताना पालाश (Potash) ची मात्रा वेळेवर दिल्यास उसाचा उतारा (Sucrose recovery) वाढतो."
      ],
      hi: [
        "गन्ने की भारी बंधाई के समय उर्वरकों की अंतिम किस्त देकर जड़ों पर मिट्टी अवश्य चढ़ाएं।",
        "टपक (ड्रिप) सिंचाई अपनाने से जल बचत के साथ 20-30 टन प्रति हेक्टेयर अतिरिक्त पैदावार मिलती है।",
        "पोटाश की उचित मात्रा गन्ने के वजन और चीनी की मात्रा (रिकवरी) को बढ़ाती है।"
      ],
      en: [
        "Perform earthing up at 120-130 days along with final split fertilizer dose to support thick internodes and prevent lodging.",
        "Adopting drip fertigation saves 40-50% water while increasing millable cane tonnage by 20-30 t/ha.",
        "Ensure adequate potassium application during Grand Growth stage for enhanced sucrose accumulation."
      ]
    }
  },

  wheat: {
    baseYield: 3.2, // t/ha
    unit: "t/ha",
    rainMin: 200,
    rainIdealMin: 250,
    rainIdealMax: 450,
    rainMax: 600,
    tempIdealMin: 18,
    tempIdealMax: 26,
    primeDistricts: [
      "NASHIK", "AHMEDNAGAR", "PUNE", "SOLAPUR", "AURANGABAD", "JALGAON",
      "DHULE", "NANDURBAR", "SATARA", "BEED"
    ],
    primarySeason: "Rabi",
    names: { en: "Wheat", mr: "गहू", hi: "गेहूं" },
    soilType: {
      en: "Medium to heavy clay loam soils with high fertility and neutral pH.",
      mr: "मध्यम ते भारी, कसदार आणि पाण्याचा चांगला निचरा होणारी काळी जमीन.",
      hi: "उपजाऊ दोमट अथवा भारी दोमट मिट्टी जिसमें जल निकास उत्तम हो।"
    },
    tips: {
      mr: [
        "मुकुट मुळे फुटण्याच्या (CRI) अवस्थेत म्हणजे पेरणीनंतर २१ व्या दिवशी पहिली सिंचनाची पाळी चुकवू नये.",
        "गव्हाच्या ओंब्या बाहेर पडताना आणि दाणे भरताना (Milking stage) पाणी दिल्यास दाणे बारीक पडत नाहीत.",
        "फेब्रुवारी-मार्चमधील वाढत्या उष्णतेपासून पिकाचे रक्षण करण्यासाठी १९:१९:१९ किंवा पोटॅशियम नायट्रेटची फवारणी करावी."
      ],
      hi: [
        "बुवाई के 21 दिन बाद मुकुट जड़ (CRI) बनने के समय पहली सिंचाई अत्यंत अनिवार्य है।",
        "बालियां निकलते समय और दाना भराव (दूधिया अवस्था) पर खेत में पर्याप्त नमी बनाए रखें।",
        "फरवरी में तापमान बढ़ने पर दानों के सिकुड़ने से बचाने हेतु 13:0:45 का पर्णीय छिड़काव करें।"
      ],
      en: [
        "Never miss the Crown Root Initiation (CRI) irrigation at 21 days after sowing — it anchors tillering.",
        "Maintain adequate moisture during the flowering and milk-dough stages to prevent shriveled grain.",
        "Foliar spray of 1% KNO3 during grain filling protects crops from late-season terminal heat stress."
      ]
    }
  },

  rice: {
    baseYield: 3.0, // t/ha
    unit: "t/ha",
    rainMin: 900,
    rainIdealMin: 1100,
    rainIdealMax: 2000,
    rainMax: 3000,
    tempIdealMin: 25,
    tempIdealMax: 34,
    primeDistricts: [
      "THANE", "PALGHAR", "RAIGAD", "RATNAGIRI", "SINDHUDURG",
      "BHANDARA", "GONDIA", "GADCHIROLI", "CHANDRAPUR", "NAGPUR", "KOLHAPUR"
    ],
    primarySeason: "Kharif",
    names: { en: "Rice (Paddy)", mr: "भात (तांदूळ)", hi: "चावल (धान)" },
    soilType: {
      en: "Clayey loam, alluvial and laterite soils capable of retaining standing water.",
      mr: "जांभा माती किंवा चोपण काळी गाळाची जमीन जी शेतात पाणी साठवून ठेवू शकते.",
      hi: "चिकनी दोमट या जलोढ़ मिट्टी जिसमें जल ठहराव क्षमता अधिक हो।"
    },
    tips: {
      mr: [
        "रोपांची पुनर्लागवड २१ ते २५ दिवसांत करावी आणि एका चुडात २-३ रोपे लावावीत.",
        "फुटवे फुटण्याच्या आणि लोंबी बाहेर पडण्याच्या काळात शेतात २ ते ५ सेमी पाणी कायम ठेवावे.",
        "करपा (Blast) आणि खोडकिड्याच्या नियंत्रणासाठी पानांचे नियमित निरीक्षण करावे."
      ],
      hi: [
        "पौध रोपाई 21 से 25 दिनों में करें तथा प्रति हिल 2-3 स्वस्थ पौधे लगाएं।",
        "कल्ले फूटने और बाली निकलने की अवस्था में 2 से 5 सेमी पानी का ठहराव बनाए रखें।",
        "झुलसा (ब्लास्ट) और तना छेदक कीट की रोकथाम के लिए समय पर कीटनाशी का प्रयोग करें।"
      ],
      en: [
        "Transplant 21-25 day old seedlings at 20x15 cm spacing with 2-3 seedlings per hill.",
        "Ensure 2-5 cm shallow standing water during tillering and panicle initiation stages.",
        "Scout for stem borer dead hearts and blast lesions on leaves during humid spells."
      ]
    }
  },

  gram: {
    baseYield: 1.2, // t/ha
    unit: "t/ha",
    rainMin: 150,
    rainIdealMin: 200,
    rainIdealMax: 350,
    rainMax: 500,
    tempIdealMin: 18,
    tempIdealMax: 28,
    primeDistricts: [
      "AHMEDNAGAR", "BEED", "OSMANABAD", "LATUR", "JALNA", "AURANGABAD",
      "AMRAVATI", "AKOLA", "BULDHANA", "YAVATMAL", "SOLAPUR", "NASHIK"
    ],
    primarySeason: "Rabi",
    names: { en: "Gram (Chickpea)", mr: "हरभरा (चना)", hi: "चना" },
    soilType: {
      en: "Medium to heavy black soil with good moisture holding capacity from monsoon rains.",
      mr: "मध्यम ते भारी, ओलावा टिकवून ठेवणारी काळी जमीन.",
      hi: "मध्यम से भारी काली मिट्टी जिसमें नमी संचय की क्षमता हो।"
    },
    tips: {
      mr: [
        "घाटे अळीच्या (Helicoverpa) नियंत्रणासाठी हेक्टरी ५ कामगंध सापळे आणि टी आकाराचे पक्षी थांबे लावावेत.",
        "फुलोऱ्याच्या अवस्थेत पाणी देणे टाळावे; घाटे भरताना एक हलके सिंचन दिल्यास उत्पादनात ३०% वाढ होते.",
        "पेरणीपूर्वी बियाण्यास रायझोबियम व पीएसबी जिवाणू संवर्धकाची बीजप्रक्रिया अवश्य करावी."
      ],
      hi: [
        "फली छेदक कीट की निगरानी के लिए प्रति हेक्टेयर 5 फेरोमोन ट्रैप और टी-आकार के पक्षी बसेरे लगाएं।",
        "फूल आने के समय पानी देने से बचें; फली बनते समय एक हल्की सिंचाई पैदावार में 30% वृद्धि करती है।",
        "बीज जनित उकठा रोग से बचाव हेतु बुवाई से पूर्व ट्राइकोडर्मा से बीजोपचार करें।"
      ],
      en: [
        "Install 5 pheromone traps and 10 T-shaped bird perches per hectare to naturally manage pod borer (Helicoverpa).",
        "Avoid irrigating during peak flowering; provide one light irrigation at pod development stage.",
        "Treat seeds with Rhizobium and PSB biofertilizer along with Trichoderma before sowing."
      ]
    }
  },

  tur: {
    baseYield: 1.0, // t/ha
    unit: "t/ha",
    rainMin: 500,
    rainIdealMin: 600,
    rainIdealMax: 850,
    rainMax: 1100,
    tempIdealMin: 25,
    tempIdealMax: 35,
    primeDistricts: [
      "LATUR", "OSMANABAD", "NANDED", "PARBHANI", "HINGOLI", "BEED", "JALNA",
      "AKOLA", "AMRAVATI", "YAVATMAL", "BULDHANA", "WARDHA", "NAGPUR"
    ],
    primarySeason: "Kharif",
    names: { en: "Tur (Pigeon Pea)", mr: "तूर (अरहर)", hi: "तूर / अरहर" },
    soilType: {
      en: "Deep, well-drained loamy to black soils with neutral reaction.",
      mr: "उत्तम निचरा होणारी मध्यम ते भारी खोल काळी जमीन.",
      hi: "गहरी, उत्तम जल निकास युक्त दोमट अथवा भारी काली मिट्टी।"
    },
    tips: {
      mr: [
        "पेरणीनंतर ३० ते ३५ दिवसांनी आणि ५० ते ५५ दिवसांनी शेंडा खुडल्यास भरपूर फांद्या व शेंगा लागतात.",
        "फुलोऱ्याच्या आणि शेंगा पोसण्याच्या काळात ०:५२:३४ किंवा पोटॅशियम नायट्रेटची फवारणी फायदेशीर ठरते.",
        "मर रोग (Wilt) आणि वांझ रोगास प्रतिबंध करण्यासाठी ट्रायकोडर्माचा जमिनीतून वापर करा."
      ],
      hi: [
        "बुवाई के 30-35 दिन बाद मुख्य तने की ऊपरी टिप (शिखर) काटने से शाखाएं अधिक फूटती हैं।",
        "फूल व फली बनते समय 13:0:45 का छिड़काव करने से फलियों में दाने ठोस बनते हैं।",
        "उकठा रोग (Wilt) से सुरक्षा के लिए गोबर की खाद में मिलाकर ट्राइकोडर्मा का प्रयोग करें।"
      ],
      en: [
        "Nip the apical shoot tip at 30-35 days and again at 50-55 days to trigger profuse lateral branching and heavy pod setting.",
        "Foliar spray of 0:52:34 or Potassium Nitrate at flowering stage prevents flower drop.",
        "Apply Trichoderma viride enriched FYM to the soil to prevent Fusarium wilt in prone fields."
      ]
    }
  },

  maize: {
    baseYield: 3.8, // t/ha
    unit: "t/ha",
    rainMin: 450,
    rainIdealMin: 550,
    rainIdealMax: 800,
    rainMax: 1000,
    tempIdealMin: 22,
    tempIdealMax: 34,
    primeDistricts: [
      "NASHIK", "AURANGABAD", "JALGAON", "DHULE", "KOLHAPUR", "SANGLI",
      "AHMEDNAGAR", "PUNE", "SATARA", "SOLAPUR"
    ],
    primarySeason: "Kharif",
    names: { en: "Maize (Corn)", mr: "मका", hi: "मक्का" },
    soilType: {
      en: "Fertile, deep loam to silt-loam soils with high aeration.",
      mr: "उत्तम निचरा होणारी सुपीक पोयट्याची अथवा मध्यम ते भारी जमीन.",
      hi: "उपजाऊ दोमट या बलुई दोमट भूमि जिसमें जलभराव न होता हो।"
    },
    tips: {
      mr: [
        "लष्करी अळीच्या (Fall Armyworm) नियंत्रणासाठी पिकाचे सुरुवातीपासून निरीक्षण करून पोंग्यात निंबोळी अर्क किंवा कीटकनाशक टाकावे.",
        "तुरा बाहेर पडताना आणि कणसात दाणे भरताना पाण्याचा ताण पडू देऊ नये.",
        "नत्र खताची मात्रा तीन हप्त्यांत (पेरणीवेळी, गुडघाभर उंचीवर आणि तुरा येताना) विभागून द्यावी."
      ],
      hi: [
        "फॉल आर्मीवर्म कीट से सुरक्षा हेतु फसल के पोंगे में नीम तेल या संस्तुत कीटनाशक का घोल डालें।",
        "मक्के में नर मंजरी (Tassel) और भुट्टे में दाना भरते समय खेत में नमी अवश्य रखें।",
        "नाइट्रोजन की खुराक को तीन बार में (बुवाई, घुटने की ऊंचाई और नर मंजरी निकलते समय) विभाजित कर दें।"
      ],
      en: [
        "Scout whorls early for Fall Armyworm (FAW) damage and apply whorl treatments if pinholes appear.",
        "Critical watering intervals are tasseling and silking; moisture stress here causes unfilled cob tips.",
        "Split nitrogen applications: 1/3 at sowing, 1/3 at knee-high stage (V6), and 1/3 at tasseling (VT)."
      ]
    }
  },

  jowar: {
    baseYield: 1.5, // t/ha
    unit: "t/ha",
    rainMin: 350,
    rainIdealMin: 450,
    rainIdealMax: 650,
    rainMax: 850,
    tempIdealMin: 24,
    tempIdealMax: 36,
    primeDistricts: [
      "SOLAPUR", "AHMEDNAGAR", "PUNE", "SATARA", "BEED", "OSMANABAD",
      "JALGAON", "NANDED", "PARBHANI", "LATUR"
    ],
    primarySeason: "Rabi",
    names: { en: "Jowar (Sorghum)", mr: "ज्वारी", hi: "ज्वार" },
    soilType: {
      en: "Medium-deep black clay soils that conserve post-monsoon subsoil moisture.",
      mr: "मध्यम ते भारी ओलावा टिकवणारी काळी जमीन (विशेषतः रब्बी मालदांडीसाठी).",
      hi: "मध्यम से गहरी काली चिकनी मिट्टी जो लंबे समय तक नमी संजो कर रखे।"
    },
    tips: {
      mr: [
        "खोडमाशीच्या (Shootfly) नियंत्रणासाठी पेरणी ऑक्टोबरच्या पहिल्या पंधरवड्यात पूर्ण करावी.",
        "पोटरी अवस्थेत आणि दाणे भरताना एक संरक्षित पाणी दिल्यास कणसाचा आकार मोठा होतो.",
        "बियाण्यास गंधक (Sulfur) आणि ॲझोटोबॅक्टरची बीजप्रक्रिया केल्यास काणी रोग टळतो."
      ],
      hi: [
        "तना मक्खी से बचाव हेतु रबी ज्वार की बुवाई 15 अक्टूबर से पहले पूरी कर लें।",
        "गाभा बनने और दाना भरते समय एक जीवनरक्षक सिंचाई देने से भुट्टे का वजन दोगुना हो जाता है।",
        "कंडुवा (Smut) रोग की रोकथाम के लिए सल्फर से बीजोपचार अवश्य करें।"
      ],
      en: [
        "Complete sowing by mid-October for Rabi Jowar (Maldandi) to avoid peak shootfly infestation.",
        "One protective irrigation at boot leaf or milk stage dramatically enhances panicle weight.",
        "Treat seed with sulfur (3g/kg) and Azotobacter to prevent grain smut and improve root growth."
      ]
    }
  },

  bajra: {
    baseYield: 1.3, // t/ha
    unit: "t/ha",
    rainMin: 250,
    rainIdealMin: 350,
    rainIdealMax: 550,
    rainMax: 750,
    tempIdealMin: 26,
    tempIdealMax: 38,
    primeDistricts: [
      "AHMEDNAGAR", "NASHIK", "DHULE", "JALGAON", "BEED", "AURANGABAD", "SOLAPUR"
    ],
    primarySeason: "Kharif",
    names: { en: "Bajra (Pearl Millet)", mr: "बाजरी", hi: "बाजरा" },
    soilType: {
      en: "Light to medium well-drained sandy loam to gravelly shallow soils.",
      mr: "हलकी ते मध्यम, पाण्याचा उत्तम निचरा होणारी वालुकामय किंवा उथळ जमीन.",
      hi: "हल्की से मध्यम बलुई दोमट अथवा मुरम युक्त भूमि।"
    },
    tips: {
      mr: [
        "पेरणीनंतर १५ दिवसांनी विरळणी करून दोन रोपांमधील अंतर १२ ते १५ सेमी ठेवावे.",
        "कमी पाण्यात येणारे हे पीक दुष्काळी भागात हमखास उत्पादन देते; शेतात पाणी साचू देऊ नका.",
        "अर्गट व गोसावी (Downy mildew) रोगास प्रतिबंध करण्यासाठी प्रमाणित बियाणे वापरावे."
      ],
      hi: [
        "बुवाई के 15 दिन बाद पौधों की छंटाई (विरलीकरण) कर पौधों की दूरी 12-15 सेमी कर लें।",
        "यह फसल अत्यंत कम वर्षा में भी उत्तम पैदावार देती है; जलभराव से बचाएं।",
        "डाउनी मिल्ड्यू (गोसावी रोग) से बचाव के लिए प्रमाणित फफूंदनाशी उपचारित बीज ही बोएं।"
      ],
      en: [
        "Thin seedlings at 15 DAS to maintain 12-15 cm intra-row spacing for vigorous tillering.",
        "Extremely drought hardy C4 cereal; ensure ridge-and-furrow planting to prevent water stagnation.",
        "Use certified downy-mildew resistant hybrids and dress seeds with Metalaxyl."
      ]
    }
  },

  groundnut: {
    baseYield: 2.0, // t/ha
    unit: "t/ha",
    rainMin: 450,
    rainIdealMin: 550,
    rainIdealMax: 750,
    rainMax: 950,
    tempIdealMin: 24,
    tempIdealMax: 33,
    primeDistricts: [
      "DHULE", "KOLHAPUR", "SANGLI", "SATARA", "PARBHANI", "NANDURBAR", "PUNE"
    ],
    primarySeason: "Kharif",
    names: { en: "Groundnut", mr: "भुईमूग", hi: "मूंगफली" },
    soilType: {
      en: "Light, friable sandy loam or red loamy soils that allow easy gynophore (peg) penetration.",
      mr: "हलकी ते मध्यम, भुसभुशीत वाळूमिश्रित पोयट्याची जमीन ज्यामध्ये आऱ्या सहज जमिनीत जातात.",
      hi: "हल्की भुरभुरी बलुई दोमट मिट्टी जिसमें आरे (Pegs) आसानी से प्रवेश कर सकें।"
    },
    tips: {
      mr: [
        "आऱ्या सुटण्याच्या (Pegging) वेळी माती भुसभुशीत ठेवावी व खुरपणी करताना आऱ्यांना इजा होणार नाही याची दक्षता घ्यावी.",
        "शेंगा भरताना जिप्सम (Gypsum) प्रति हेक्टरी ४०० ते ५०० किलो दिल्यास शेंगा पोकळ न राहता दाणे टपोरे भरतात.",
        "टिक्का (Tikka) रोगाच्या नियंत्रणासाठी कार्बेन्डाझिम किंवा मॅन्कोझेबची फवारणी करावी."
      ],
      hi: [
        "आरे (Pegging) बनते समय मिट्टी भुरभुरी रखें ताकि फलियों का विकास सुगमता से हो सके।",
        "फलियों में दाना भरते समय प्रति हेक्टेयर 400-500 किग्रा जिप्सम डालें जिससे फलियां खाली (पोपटी) नहीं रहेंगी।",
        "टिक्का रोग की रोकथाम के लिए मैंकोजेब 75% WP का 2 ग्राम/लीटर पानी में छिड़काव करें।"
      ],
      en: [
        "Keep the soil friable during pegging and avoid disturbing pegs during intercultural weeding.",
        "Apply Gypsum @ 400-500 kg/ha at flowering/pegging to provide calcium and sulfur for solid kernel filling without pops.",
        "Spray Mancozeb @ 2.5g/L at the first appearance of Cercospora leaf spot (Tikka)."
      ]
    }
  },

  banana: {
    baseYield: 50.0, // t/ha
    unit: "t/ha",
    rainMin: 1000,
    rainIdealMin: 1400,
    rainIdealMax: 2200,
    rainMax: 3000,
    tempIdealMin: 25,
    tempIdealMax: 36,
    primeDistricts: [
      "JALGAON", "NANDED", "PARBHANI", "SOLAPUR", "KOLHAPUR", "PUNE", "DHULE"
    ],
    primarySeason: "Whole Year",
    names: { en: "Banana", mr: "केळी", hi: "केला" },
    soilType: {
      en: "Deep, rich alluvial and clay loam soils with high fertility, organic content, and pH 6.5-7.5.",
      mr: "किमान ९० ते १२० सेमी खोल, सुपीक पोयट्याची गाळाची जमीन.",
      hi: "गहरी, उपजाऊ जलोढ़ दोमट मिट्टी जिसमें भरपूर जीवांश हो।"
    },
    tips: {
      mr: [
        "केळी पिकाला ठिबक सिंचनाद्वारे खते (Fertigation) दिल्यास घडांचे वजन व लांबी मोठ्या प्रमाणात वाढते.",
        "घड निसवल्यानंतर केळफूल वेळेवर कापून निळ्या रंगाच्या प्लॅस्टिक बॅगने घड झाकल्यास फळांची प्रत सुधारते.",
        "सिगाटोका (Sigatoka) करपा रोगाच्या नियंत्रणासाठी जुनी सुकलेली पाने नियमित कापून नष्ट करावीत."
      ],
      hi: [
        "ड्रिप फर्टिगेशन द्वारा पोटाश और यूरिया देने से केले के घौद का वजन और चमक बढ़ती है।",
        "घौद बाहर आने के बाद कमल फूल तोड़कर छिद्रित पॉलीथीन बैग से ढंकें ताकि फल दाग-धब्बों से मुक्त रहें।",
        "सिगाटोका पत्ती झुलसा से बचाव हेतु रोगग्रस्त पत्तों को काटकर तुरंत नष्ट करें।"
      ],
      en: [
        "Adopt drip fertigation to provide split doses of Nitrogen and Potassium during early vegetative and shooting stages.",
        "Cover emerging banana bunches with perforated polyethylene sleeves and denavel male buds for spotless marketable fingers.",
        "Sanitize plantation by removing Sigatoka-infected lower leaves to curb spore dispersal."
      ]
    }
  },
};

// Regional Agro-Climatic Zones of Maharashtra
const DISTRICT_ZONE_INFO = {
  // Vidarbha
  AMRAVATI: { zone: "vidarbha", soil: "deep_black", irrigation: "medium_dryland" },
  AKOLA: { zone: "vidarbha", soil: "deep_black", irrigation: "medium_dryland" },
  YAVATMAL: { zone: "vidarbha", soil: "deep_black", irrigation: "medium_dryland" },
  WARDHA: { zone: "vidarbha", soil: "deep_black", irrigation: "medium_dryland" },
  NAGPUR: { zone: "vidarbha", soil: "black_loam", irrigation: "moderate" },
  BULDHANA: { zone: "vidarbha", soil: "medium_black", irrigation: "medium_dryland" },
  WASHIM: { zone: "vidarbha", soil: "medium_black", irrigation: "medium_dryland" },
  BHANDARA: { zone: "east_vidarbha", soil: "alluvial_laterite", irrigation: "paddy_canal" },
  GONDIA: { zone: "east_vidarbha", soil: "alluvial_laterite", irrigation: "paddy_canal" },
  CHANDRAPUR: { zone: "east_vidarbha", soil: "clay_loam", irrigation: "moderate" },
  GADCHIROLI: { zone: "east_vidarbha", soil: "red_yellow", irrigation: "forest_tribal" },

  // Marathwada
  AURANGABAD: { zone: "marathwada", soil: "medium_black", irrigation: "semi_arid" },
  JALNA: { zone: "marathwada", soil: "medium_black", irrigation: "semi_arid" },
  BEED: { zone: "marathwada", soil: "shallow_medium_black", irrigation: "drought_prone" },
  LATUR: { zone: "marathwada", soil: "deep_black", irrigation: "soybean_hub" },
  OSMANABAD: { zone: "marathwada", soil: "medium_black", irrigation: "semi_arid" },
  NANDED: { zone: "marathwada", soil: "deep_black", irrigation: "godavari_basin" },
  PARBHANI: { zone: "marathwada", soil: "deep_black", irrigation: "godavari_basin" },
  HINGOLI: { zone: "marathwada", soil: "medium_black", irrigation: "semi_arid" },

  // Western Maharashtra
  PUNE: { zone: "western_maha", soil: "loamy_black", irrigation: "canal_well" },
  KOLHAPUR: { zone: "western_maha", soil: "deep_alluvial_black", irrigation: "river_abundant" },
  SATARA: { zone: "western_maha", soil: "clay_loam", irrigation: "canal_drip" },
  SANGLI: { zone: "western_maha", soil: "rich_black", irrigation: "krishna_basin" },
  SOLAPUR: { zone: "western_maha", soil: "medium_deep_black", irrigation: "ujani_canal_dryland" },
  AHMEDNAGAR: { zone: "western_maha", soil: "medium_black", irrigation: "canal_well" },

  // Khandesh
  JALGAON: { zone: "khandesh", soil: "deep_alluvial_tapi", irrigation: "tapi_basin" },
  DHULE: { zone: "khandesh", soil: "medium_black", irrigation: "semi_arid" },
  NANDURBAR: { zone: "khandesh", soil: "red_black_loam", irrigation: "tapi_tribal" },
  NASHIK: { zone: "khandesh", soil: "deep_loam", irrigation: "godavari_canal" },

  // Konkan
  THANE: { zone: "konkan", soil: "laterite_coastal", irrigation: "high_rainfall" },
  PALGHAR: { zone: "konkan", soil: "coastal_alluvial", irrigation: "high_rainfall" },
  RAIGAD: { zone: "konkan", soil: "laterite_clay", irrigation: "high_rainfall" },
  RATNAGIRI: { zone: "konkan", soil: "coastal_laterite", irrigation: "high_rainfall" },
  SINDHUDURG: { zone: "konkan", soil: "red_laterite", irrigation: "high_rainfall" },
  MUMBAI: { zone: "konkan", soil: "coastal", irrigation: "urban" },
};

/**
 * Main Agricultural Yield Prediction Reasoning Generator
 */
export function getYieldPredictionReason(prediction = {}, lang = "en") {
  const {
    crop = "Cotton",
    district = "Amravati",
    season = "Kharif",
    rainfall = 750,
    temperature = 30,
    productivity = 2.0,
    production = 0,
    area = 1,
  } = prediction;

  const selectedLang = ["mr", "hi", "en"].includes(lang) ? lang : "en";
  const cropKey = String(crop || "").toLowerCase().trim().replace(/[\s\-_()]/g, "");

  // Match crop profile
  let matchedCropKey = Object.keys(CROP_YIELD_PROFILES).find((k) =>
    cropKey.includes(k) || k.includes(cropKey)
  );

  if (!matchedCropKey) {
    if (cropKey.includes("chickpea") || cropKey.includes("chana") || cropKey.includes("harbhara")) matchedCropKey = "gram";
    else if (cropKey.includes("pigeon") || cropKey.includes("arhar")) matchedCropKey = "tur";
    else if (cropKey.includes("paddy") || cropKey.includes("bhat")) matchedCropKey = "rice";
    else if (cropKey.includes("sorghum") || cropKey.includes("jwari")) matchedCropKey = "jowar";
    else if (cropKey.includes("corn") || cropKey.includes("makka")) matchedCropKey = "maize";
    else if (cropKey.includes("kapas") || cropKey.includes("kapus")) matchedCropKey = "cotton";
    else matchedCropKey = "cotton"; // default fallback
  }

  const profile = CROP_YIELD_PROFILES[matchedCropKey];
  const cropName = profile.names[selectedLang] || crop;
  const prodNum = Number(productivity) || profile.baseYield;
  const rainNum = Number(rainfall) || 700;
  const tempNum = Number(temperature) || 30;
  const distKey = String(district || "").toUpperCase().trim();
  const zoneInfo = DISTRICT_ZONE_INFO[distKey] || { zone: "general", soil: "medium_black", irrigation: "standard" };

  // 1. EVALUATE YIELD STATUS AGAINST BASE BENCHMARK
  const ratio = prodNum / profile.baseYield;
  let yieldStatus = "moderate";
  let statusBadgeColor = "amber";
  let statusLabel = "";
  let statusHeadline = "";

  if (ratio >= 1.15) {
    yieldStatus = "high";
    statusBadgeColor = "emerald";
    if (selectedLang === "mr") {
      statusLabel = "उच्च / विक्रमी उत्पादन क्षमता";
      statusHeadline = `अंदाजित हेक्टरी उत्पादन (${prodNum.toFixed(2)} टन/हेक्टर) महाराष्ट्रातील सरासरीपेक्षा (${profile.baseYield} टन/हेक्टर) सुमारे ${Math.round((ratio - 1) * 100)}% जास्त आहे. अनुकूल हवामान व योग्य मशागतीमुळे हे पीक उत्कृष्ट परतावा देईल.`;
    } else if (selectedLang === "hi") {
      statusLabel = "उच्च / उत्कृष्ट पैदावार क्षमता";
      statusHeadline = `अनुमानित उपज (${prodNum.toFixed(2)} टन/हेक्टेयर) राज्य औसत (${profile.baseYield} टन/हेक्टेयर) से लगभग ${Math.round((ratio - 1) * 100)}% अधिक है। अनुकूल वातावरण व उन्नत प्रबंधन से यह फसल बंपर उत्पादन देने में सक्षम है।`;
    } else {
      statusLabel = "High / Optimal Yield Potential";
      statusHeadline = `Predicted productivity (${prodNum.toFixed(2)} t/ha) exceeds the Maharashtra state benchmark (${profile.baseYield} t/ha) by ~${Math.round((ratio - 1) * 100)}%, indicating high harvest potential under favorable climatic conditions.`;
    }
  } else if (ratio < 0.85) {
    yieldStatus = "low";
    statusBadgeColor = "rose";
    if (selectedLang === "mr") {
      statusLabel = "सरासरीपेक्षा कमी / हवामान ताण";
      statusHeadline = `अंदाजित उत्पादन (${prodNum.toFixed(2)} टन/हेक्टर) राज्याच्या मानकापेक्षा (${profile.baseYield} टन/हेक्टर) सुमारे ${Math.round((1 - ratio) * 100)}% कमी दिसत आहे. पाऊस किंवा तापमानातील तफावतीमुळे पिकावर ताण येण्याची शक्यता आहे. खालील सल्ल्यानुसार नियोजन करा.`;
    } else if (selectedLang === "hi") {
      statusLabel = "औसत से कम / मौसम का तनाव";
      statusHeadline = `अनुमानित उपज (${prodNum.toFixed(2)} टन/हेक्टेयर) राज्य औसत (${profile.baseYield} टन/हेक्टेयर) से लगभग ${Math.round((1 - ratio) * 100)}% कम है। वर्षा या तापमान के उतार-चढ़ाव के कारण फसल तनाव में रह सकती है। नीचे दिए गए सुझावों का पालन करें।`;
    } else {
      statusLabel = "Below Average / Climate Stress";
      statusHeadline = `Predicted yield (${prodNum.toFixed(2)} t/ha) is ~${Math.round((1 - ratio) * 100)}% lower than state benchmark (${profile.baseYield} t/ha). Environmental or moisture constraints are dampening output; apply targeted crop management below.`;
    }
  } else {
    yieldStatus = "moderate";
    statusBadgeColor = "blue";
    if (selectedLang === "mr") {
      statusLabel = "मध्यम / समाधानकारक उत्पादन";
      statusHeadline = `अंदाजित उत्पादन (${prodNum.toFixed(2)} टन/हेक्टर) या पिकासाठीच्या सर्वसाधारण मानकांशी (${profile.baseYield} टन/हेक्टर) सुसंगत आहे. वेळेवर खते व पाणी व्यवस्थापन ठेवल्यास यामध्ये आणखी १५-२०% वाढ शक्य आहे.`;
    } else if (selectedLang === "hi") {
      statusLabel = "मध्यम / सामान्य अपेक्षित पैदावार";
      statusHeadline = `अनुमानित पैदावार (${prodNum.toFixed(2)} टन/हेक्टेयर) सामान्य कृषि मानकों (${profile.baseYield} टन/हेक्टेयर) के अनुरूप है। समय पर उर्वरक व सिंचाई प्रबंधन से इसमें 15-20% की अतिरिक्त वृद्धि संभव है।`;
    } else {
      statusLabel = "Moderate / Standard Harvest";
      statusHeadline = `Predicted productivity (${prodNum.toFixed(2)} t/ha) aligns closely with state agronomic benchmarks (${profile.baseYield} t/ha). Timely fertigation and pest management can boost final tonnage further.`;
    }
  }

  // 2. RAINFALL DRIVER ANALYSIS
  let rainStatus = "optimal";
  let rainLabel = "";
  let rainDesc = "";

  if (rainNum < profile.rainMin) {
    rainStatus = "deficit";
    if (selectedLang === "mr") {
      rainLabel = "पावसाची तूट (Moisture Deficit)";
      rainDesc = `नोंदवलेला पाऊस (${rainNum} मिमी) या पिकाच्या आदर्श गरजेपेक्षा (${profile.rainIdealMin}-${profile.rainIdealMax} मिमी) कमी आहे. फुलोरा व दाणे भरण्याच्या संवेदनशील अवस्थेत ठिबक किंवा तुषार सिंचनाने पूरक पाणी द्यावे लागेल.`;
    } else if (selectedLang === "hi") {
      rainLabel = "वर्षा की कमी (Moisture Deficit)";
      rainDesc = `दर्ज वर्षा (${rainNum} मिमी) आदर्श आवश्यकता (${profile.rainIdealMin}-${profile.rainIdealMax} मिमी) से कम है। फूल व दाना भराव के समय टपक या फव्वारा सिंचाई की पूरक व्यवस्था अत्यंत आवश्यक होगी।`;
    } else {
      rainLabel = "Rainfall Deficit / Moisture Stress";
      rainDesc = `Rainfall (${rainNum} mm) is below crop optimal needs (${profile.rainIdealMin}-${profile.rainIdealMax} mm). Supplemental drip or sprinkler irrigation is critical during flowering and grain/boll formation.`;
    }
  } else if (rainNum > profile.rainMax) {
    rainStatus = "excess";
    if (selectedLang === "mr") {
      rainLabel = "जास्त पाऊस (Excess Rainfall)";
      rainDesc = `नोंदवलेला पाऊस (${rainNum} मिमी) जास्त असून शेतात पाणी साचण्याची शक्यता आहे. मुळांना ऑक्सिजन मिळण्यासाठी व मूळकुजव्या रोगापासून बचावासाठी शेतात चर काढून पाण्याचा निचरा तात्काळ करावा.`;
    } else if (selectedLang === "hi") {
      rainLabel = "अधिक वर्षा (Excess Rainfall)";
      rainDesc = `दर्ज वर्षा (${rainNum} मिमी) अधिक है। खेत में जलभराव रोकने के लिए उचित जल निकासी नालियां बनाएं ताकि जड़ों में सड़न और पोषक तत्वों का लीचिंग न हो।`;
    } else {
      rainLabel = "Excess Rainfall / Waterlogging Risk";
      rainDesc = `Rainfall (${rainNum} mm) is on the higher side. Field drainage trenches are required to prevent standing water, root asphyxiation, and collar rot.`;
    }
  } else {
    rainStatus = "optimal";
    if (selectedLang === "mr") {
      rainLabel = "समाधानकारक पाऊस (Optimal Moisture)";
      rainDesc = `नोंदवलेला पाऊस (${rainNum} मिमी) पिकाच्या पाण्याच्या गरजेत (${profile.rainIdealMin}-${profile.rainIdealMax} मिमी) चपखल बसतो. यामुळे मुळांच्या परिसरात योग्य वाफसा टिकून पानांची वाढ व फळधारणा जोमदार होईल.`;
    } else if (selectedLang === "hi") {
      rainLabel = "संतुलित वर्षा (Optimal Moisture)";
      rainDesc = `दर्ज वर्षा (${rainNum} मिमी) फसल की जल आवश्यकता (${profile.rainIdealMin}-${profile.rainIdealMax} मिमी) के अनुकूल है। इससे मिट्टी में नमी का संतुलन बना रहेगा और वानस्पतिक वृद्धि अच्छी होगी।`;
    } else {
      rainLabel = "Optimal Rainfall / Moisture";
      rainDesc = `Rainfall (${rainNum} mm) matches the ideal water envelope (${profile.rainIdealMin}-${profile.rainIdealMax} mm), ensuring continuous root hydration without saturation risks.`;
    }
  }

  // 3. TEMPERATURE DRIVER ANALYSIS
  let tempStatus = "optimal";
  let tempLabel = "";
  let tempDesc = "";

  if (tempNum > profile.tempIdealMax) {
    tempStatus = "high";
    if (selectedLang === "mr") {
      tempLabel = "उष्णतेचा ताण (Heat Stress)";
      tempDesc = `कमाल तापमान (${tempNum}°C) अनुकूल मर्यादेपेक्षा (${profile.tempIdealMax}°C) जास्त आहे. यामुळे पाण्याचे बाष्पीभवन वेगाने होऊन परागकण सुकण्याची व फुले गळण्याची जोखीम वाढते. आच्छादनाचा वापर व सायंकाळचे सिंचन उपयुक्त ठरेल.`;
    } else if (selectedLang === "hi") {
      tempLabel = "उच्च तापमान (Heat Stress)";
      tempDesc = `अधिकतम तापमान (${tempNum}°C) अनुकूल सीमा (${profile.tempIdealMax}°C) से अधिक है। इससे वाष्पीकरण बढ़ेगा और फूल झड़ने का खतरा रहेगा। शाम के समय हल्की सिंचाई करें।`;
    } else {
      tempLabel = "Elevated Temperature / Thermal Stress";
      tempDesc = `Maximum temperature (${tempNum}°C) exceeds the ideal threshold (${profile.tempIdealMax}°C), raising evapotranspiration and risking pollen desiccation. Maintain light evening irrigations and organic mulching.`;
    }
  } else if (tempNum < profile.tempIdealMin) {
    tempStatus = "cool";
    if (selectedLang === "mr") {
      tempLabel = "थंड हवामान (Cool Thermal Regime)";
      tempDesc = matchedCropKey === "wheat" || matchedCropKey === "gram"
        ? `थंड हवामान (${tempNum}°C) गव्हाच्या/हरभऱ्याच्या दाणे भरण्यासाठी व भरपूर फुटवे फुटण्यासाठी अत्यंत पोषक आहे.`
        : `कमी तापमान (${tempNum}°C) पिकाच्या सुरुवातीच्या वाढीचा वेग थोडा मंदावू शकते; दिवस जसजसा उबदार होईल तसतसा वाढीचा वेग सुधारेल.`;
    } else if (selectedLang === "hi") {
      tempLabel = "शीतल मौसम (Cool Thermal Regime)";
      tempDesc = matchedCropKey === "wheat" || matchedCropKey === "gram"
        ? `ठंडा मौसम (${tempNum}°C) गेहूं/चने में कल्ले फूटने और दाना भराव की अवधि को बढ़ाने में बहुत लाभकारी है।`
        : `कम तापमान (${tempNum}°C) फसल की प्रारंभिक वानस्पतिक वृद्धि को थोड़ा धीमा कर सकता है।`;
    } else {
      tempLabel = "Cool Temperature Regime";
      tempDesc = matchedCropKey === "wheat" || matchedCropKey === "gram"
        ? `Cool weather (${tempNum}°C) prolongs grain-filling duration, resulting in heavier, plump kernels.`
        : `Lower temperature (${tempNum}°C) may slightly decelerate early vegetative expansion until warmer spells arrive.`;
    }
  } else {
    tempStatus = "optimal";
    if (selectedLang === "mr") {
      tempLabel = "आदर्श तापमान (Comfort Zone)";
      tempDesc = `तापमान (${tempNum}°C) पिकाच्या प्रकाशसंश्लेषण व ऊर्जा निर्मितीसाठी अनुकूल कक्षेत (${profile.tempIdealMin}-${profile.tempIdealMax}°C) आहे, ज्यामुळे पात्या व पानांची वाढ उत्तम राहील.`;
    } else if (selectedLang === "hi") {
      tempLabel = "आदर्श तापमान (Comfort Zone)";
      tempDesc = `तापमान (${tempNum}°C) प्रकाश संश्लेषण और भोजन निर्माण की अनुकूल सीमा (${profile.tempIdealMin}-${profile.tempIdealMax}°C) में है, जिससे फसल हरी-भरी रहेगी।`;
    } else {
      tempLabel = "Optimal Comfort Zone";
      tempDesc = `Temperature (${tempNum}°C) falls squarely within the photosynthetic comfort range (${profile.tempIdealMin}-${profile.tempIdealMax}°C), supporting active chlorophyll function and vigor.`;
    }
  }

  // 4. DISTRICT & AGRO-CLIMATIC SUITABILITY
  const isPrimeDistrict = profile.primeDistricts.includes(distKey);
  let distStatus = isPrimeDistrict ? "high_suitability" : "moderate_suitability";
  let distLabel = "";
  let distDesc = "";

  if (selectedLang === "mr") {
    distLabel = isPrimeDistrict ? "पारंपरिक प्रमुख पट्टा (Prime Belt)" : "प्रादेशिक अनुकूल क्षेत्र (Cultivated Zone)";
    distDesc = `${district} जिल्ह्याची माती आणि हवामान या पिकासाठी सुसंगत आहे. ${profile.soilType.mr}`;
  } else if (selectedLang === "hi") {
    distLabel = isPrimeDistrict ? "पारंपरिक मुख्य क्षेत्र (Prime Belt)" : "क्षेत्रीय अनुकूल इलाका (Cultivated Zone)";
    distDesc = `${district} जिले की जलवायु एवं मृदा संरचना इस फसल के अनुकूल है। ${profile.soilType.hi}`;
  } else {
    distLabel = isPrimeDistrict ? "Prime Agro-Climatic Belt" : "Regionally Adapted Zone";
    distDesc = `${district} district features suitable agro-climatic conditions for ${crop}. ${profile.soilType.en}`;
  }

  // 5. SEASON SUITABILITY
  const seasonNorm = String(season || "").toLowerCase();
  const primaryNorm = profile.primarySeason.toLowerCase();
  const isSeasonMatch = seasonNorm.includes(primaryNorm) || primaryNorm.includes("whole") || (primaryNorm === "rabi" && seasonNorm.includes("rabi"));
  let seasonLabel = "";
  let seasonDesc = "";

  if (isSeasonMatch) {
    if (selectedLang === "mr") {
      seasonLabel = `आदर्श हंगाम (${season})`;
      seasonDesc = `${season} हा ${cropName} पिकासाठी नैसर्गिक वाढ व उत्पादकतेचा मुख्य हंगाम आहे. मान्सून व सूर्यप्रकाशाचे चक्र पिकास पोषक ठरेल.`;
    } else if (selectedLang === "hi") {
      seasonLabel = `अनुकूल मौसम (${season})`;
      seasonDesc = `${season} का मौसम ${cropName} के प्राकृतिक जीवन चक्र और बंपर उपज के लिए सबसे उपयुक्त समय है।`;
    } else {
      seasonLabel = `Optimal Seasonal Timing (${season})`;
      seasonDesc = `${season} matches the primary agronomic cycle for ${crop}, providing natural photoperiod and moisture synchronization.`;
    }
  } else {
    if (selectedLang === "mr") {
      seasonLabel = `अवांतर हंगाम (${season})`;
      seasonDesc = `${season} हंगामात हे पीक घेताना पाणी व तापमानावर विशेष लक्ष ठेवावे लागेल. सुरक्षित सिंचन उपलब्ध असल्यास चांगले उत्पादन शक्य आहे.`;
    } else if (selectedLang === "hi") {
      seasonLabel = `गैर-पारंपरिक मौसम (${season})`;
      seasonDesc = `${season} में इस फसल की खेती हेतु सिंचाई और तापमान प्रबंधन पर अतिरिक्त ध्यान देना होगा।`;
    } else {
      seasonLabel = `Secondary / Off-Season Cultivation (${season})`;
      seasonDesc = `Cultivating in ${season} demands regulated irrigation and microclimate monitoring to offset off-season weather fluctuations.`;
    }
  }

  // 6. ACTIONABLE TIPS
  const actionableTips = profile.tips[selectedLang] || profile.tips.en;

  // 7. CONCISE SPEECH TEXT (for Voice synthesis read-out)
  let speechText = "";
  if (selectedLang === "mr") {
    speechText = `${cropName} पिकासाठी ${district} जिल्ह्यात ${prodNum.toFixed(2)} टन प्रति हेक्टर उत्पादन अंदाजित केले आहे. ${statusLabel}. पाऊस ${rainNum} मिलिमीटर आणि तापमान ${tempNum} अंश सेल्सिअस नोंदवले आहे. ${rainDesc} ${tempDesc}`;
  } else if (selectedLang === "hi") {
    speechText = `${cropName} फसल के लिए ${district} जिले में ${prodNum.toFixed(2)} टन प्रति हेक्टेयर पैदावार अनुमानित है। ${statusLabel}। वर्षा ${rainNum} मिलीमीटर और तापमान ${tempNum} डिग्री सेल्सियस दर्ज किया गया है। ${rainDesc} ${tempDesc}`;
  } else {
    speechText = `For ${crop} in ${district}, predicted yield is ${prodNum.toFixed(2)} tonnes per hectare. ${statusLabel}. Rainfall is ${rainNum} millimeters and temperature is ${tempNum} degrees Celsius. ${rainDesc} ${tempDesc}`;
  }

  return {
    cropKey: matchedCropKey,
    cropName,
    district,
    season,
    productivity: prodNum,
    baseBenchmark: profile.baseYield,
    yieldRatio: ratio,
    yieldStatus,
    statusBadgeColor,
    statusLabel,
    statusHeadline,
    drivers: [
      {
        id: "rainfall",
        icon: "🌧️",
        title: selectedLang === "mr" ? "पाऊस व ओलावा प्रभाव" : selectedLang === "hi" ? "वर्षा एवं नमी प्रभाव" : "Rainfall & Moisture Impact",
        status: rainStatus,
        statusLabel: rainLabel,
        valueText: `${rainNum} mm`,
        description: rainDesc,
      },
      {
        id: "temperature",
        icon: "🌡️",
        title: selectedLang === "mr" ? "तापमान व उष्णता प्रभाव" : selectedLang === "hi" ? "तापमान प्रभाव" : "Thermal Comfort & Heat Impact",
        status: tempStatus,
        statusLabel: tempLabel,
        valueText: `${tempNum}°C`,
        description: tempDesc,
      },
      {
        id: "district",
        icon: "📍",
        title: selectedLang === "mr" ? "जिल्हा व स्थानिक माती" : selectedLang === "hi" ? "जिला एवं क्षेत्रीय मृदा" : "District Soil & Agro-Climate",
        status: distStatus,
        statusLabel: distLabel,
        valueText: district,
        description: distDesc,
      },
      {
        id: "season",
        icon: "🗓️",
        title: selectedLang === "mr" ? "हंगाम सुसंगतता" : selectedLang === "hi" ? "मौसम सुसंगतता" : "Seasonal Timing & Photoperiod",
        status: isSeasonMatch ? "optimal" : "secondary",
        statusLabel: seasonLabel,
        valueText: season,
        description: seasonDesc,
      },
    ],
    actionableTips,
    speechText,
  };
}
