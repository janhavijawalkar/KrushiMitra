// =========================================================
// KRUSHIMITRA AGRONOMIC CROP REASONING ENGINE
// Generates detailed, personalized explanations why a crop
// is recommended for specific soil (N,P,K,pH) & climate values.
// Supports Marathi (mr), Hindi (hi), and English (en).
// =========================================================

const CROP_BENCHMARKS = {
  rice: {
    en: {
      name: "Rice (Paddy)",
      summary: "Your soil's nitrogen levels and your region's high moisture and rainfall create the perfect swamp-like vegetative conditions for wetland rice.",
      nutrientReason: "Rice is a heavy nitrogen consumer during tillering. Your soil's nitrogen level supports vigorous panicle initiation.",
      climateReason: "High rainfall and elevated atmospheric humidity satisfy the critical water ponding needed during reproductive and heading phases.",
      phReason: "Rice is adaptable to slightly acidic to neutral soils (pH 5.5–7.0), matching your soil's pH perfectly.",
    },
    mr: {
      name: "भात (Rice / Paddy)",
      summary: "तुमच्या मातीतील समाधानकारक नायट्रोजन, मुबलक पाऊस आणि हवेतील उच्च आर्द्रता यामुळे ही जमीन भात पिकाच्या उत्तम फुटव्यासाठी व लोंब्या भरण्यासाठी अत्यंत अनुकूल आहे.",
      nutrientReason: "भात पिकाला फुटवे फुटण्याच्या अवस्थेत नायट्रोजनची भरपूर गरज असते. तुमच्या मातीतील पोषणमूल्ये यासाठी सर्वोत्तम आहेत.",
      climateReason: "भरपूर पाऊस आणि आर्द्रता यामुळे शेतात आवश्यक वाफसा व दलदलीची स्थिती टिकून राहून लोंब्या पोसण्यास मदत होईल.",
      phReason: "भात पिकासाठी ५.५ ते ७.० दरम्यानचा सामू (pH) आदर्श मानला जातो, ज्यामध्ये तुमचे मूल्य चपखल बसते.",
    },
    hi: {
      name: "धान / चावल (Rice)",
      summary: "आपकी मिट्टी में उच्च नाइट्रोजन, प्रचुर वर्षा और उच्च आर्द्रता धान की फसल के भरपूर कल्ले निकलने और बालियां बनने के लिए सर्वथा उपयुक्त है।",
      nutrientReason: "धान की प्रारंभिक वानस्पतिक वृद्धि के लिए पर्याप्त नाइट्रोजन आवश्यक होता है, जो आपकी मिट्टी में अनुकूल स्तर पर है।",
      climateReason: "पर्याप्त वर्षा और नमी पौधों की जड़ों में पानी का ठहराव सुनिश्चित करती है, जिससे पैदावार में वृद्धि होती है।",
      phReason: "धान की फसल 5.5 से 7.0 पीएच मान वाली मिट्टी में सबसे अच्छा उत्पादन देती है।",
    },
  },
  cotton: {
    en: {
      name: "Cotton (Kapus)",
      summary: "Your moderate rainfall and warm temperatures, combined with balanced potassium, favor deep taproot penetration and boll retention.",
      nutrientReason: "Cotton requires adequate potassium for fiber elongation and boll weight, which your soil provides.",
      climateReason: "Warm sunny days and moderate rainfall prevent flower shed and favor synchronous boll bursting without fungal rot.",
      phReason: "Cotton thrives in neutral to slightly alkaline deep black soils (pH 6.5–8.0), fully compatible with your test.",
    },
    mr: {
      name: "कापूस (Cotton)",
      summary: "मध्यम पाऊस, उष्ण व कोरडे हवामान आणि पोटॅशियमची योग्य पातळी यामुळे ही जमीन कपाशीच्या खोल सोटमुळांसाठी व भरपूर बोंडे धरण्यासाठी आदर्श आहे.",
      nutrientReason: "कपाशीमध्ये धाग्याची लांबी व बोंडाचे वजन वाढवण्यासाठी पोटॅश (K) अत्यंत महत्त्वाचा असतो, जो तुमच्या मातीत संतुलित आहे.",
      climateReason: "उबदार सूर्यप्रकाश आणि मध्यम पाऊस यामुळे पात्या व फुले गळत नाहीत आणि बोंडे सडण्याचा धोका टळतो.",
      phReason: "कापूस ६.५ ते ८.० सामू असलेल्या काळ्या कसदार जमिनीत सर्वोत्तम येतो, जो तुमच्या मातीशी सुसंगत आहे.",
    },
    hi: {
      name: "कपास (Cotton)",
      summary: "मध्यम वर्षा, गर्म धूप और पोटाश का उचित स्तर कपास की गहरी जड़ों और भरपूर टिंडे (Bolls) बनने के लिए सबसे मुफीद है।",
      nutrientReason: "कपास में रेशे की गुणवत्ता और टिंडे के वजन के लिए पोटाश महत्वपूर्ण है, जो आपकी मिट्टी में संतुलित है।",
      climateReason: "गर्म मौसम और संतुलित वर्षा से फूल व कलियां झड़ने से बचती हैं और बंपर पैदावार मिलती है।",
      phReason: "कपास 6.5 से 8.0 पीएच मान वाली काली मिट्टी में सबसे शानदार प्रदर्शन करती है।",
    },
  },
  maize: {
    en: {
      name: "Maize (Corn)",
      summary: "Your warm temperatures, moderate rainfall, and rich nitrogen levels provide the rapid biomass energy required for heavy corn cob filling.",
      nutrientReason: "Maize is a C4 high-efficiency feeder that converts high nitrogen and phosphorus into heavy kernel cobs.",
      climateReason: "Well-distributed rainfall and moderate humidity ensure complete tassel pollination and grain setting.",
      phReason: "Your soil pH supports maximum cation exchange capacity without zinc fixation.",
    },
    mr: {
      name: "मका (Maize)",
      summary: "उबदार तापमान, मध्यम पाऊस आणि नायट्रोजनचे मुबलक प्रमाण यामुळे कणसे भरण्यासाठी आणि पिकाच्या वेगवान वाढीसाठी मका पीक सर्वोत्तम आहे.",
      nutrientReason: "मका हे वेगाने वाढणारे C4 पीक असून त्याला नायट्रोजन व फॉस्फरसची सर्वाधिक गरज असते, जी तुमच्या जमिनीतून पूर्ण होते.",
      climateReason: "योग्य पाऊस आणि खेळती हवा यामुळे मक्याच्या तुऱ्यांचे (Tasseling) परागीभवन उत्तम होऊन दाणेदार कणसे तयार होतात.",
      phReason: "तुमचा मातीचा सामू मका पिकासाठी आवश्यक सूक्ष्मअन्नद्रव्ये शोषून घेण्यासाठी अत्यंत पोषक आहे.",
    },
    hi: {
      name: "मक्का (Maize)",
      summary: "गर्म तापमान, मध्यम वर्षा और मिट्टी में नाइट्रोजन का अच्छा स्तर मक्के के बड़े भुट्टे और दानों के पूर्ण भराव के लिए सर्वोत्तम है।",
      nutrientReason: "मक्का एक तेजी से बढ़ने वाली फसल है जिसे भरपूर नाइट्रोजन और फास्फोरस की आवश्यकता होती है।",
      climateReason: "संतुलित वर्षा और मध्यम आर्द्रता से परागण (Pollination) सही होता है और भुट्टे खाली नहीं रहते।",
      phReason: "मिट्टी का पीएच मान पोषक तत्वों के सुचारू अवशोषण के लिए बिल्कुल अनुकूल है।",
    },
  },
  chickpea: {
    en: {
      name: "Chickpea (Gram / Chana)",
      summary: "Low to moderate moisture, cool weather, and high phosphorus levels are ideal for root nodule nitrogen fixation and heavy pod formation.",
      nutrientReason: "As a legume, chickpea requires low initial nitrogen but high phosphorus for Rhizobium bacterial root nodules.",
      climateReason: "Cool, dry ambient climate prevents wilt/root rot and promotes abundant flowering without vegetative overgrowth.",
      phReason: "Optimal neutral pH ensures high calcium and molybdenum availability for Rhizobium symbiosis.",
    },
    mr: {
      name: "हरभरा / चना (Chickpea)",
      summary: "थंड हवामान, कमी ते मध्यम ओलावा आणि चांगला फॉस्फरस यामुळे हरभऱ्याच्या मुळांवरील गाठींमध्ये नैसर्गिक नायट्रोजन स्थिरीकरण होऊन भरपूर घाटे भरतील.",
      nutrientReason: "द्विदल कडधान्य असल्याने या पिकाला जास्त रासायनिक नायट्रोजनची गरज नसते; फॉस्फरसमुळे मुळांचा व घाटांचा विकास उत्तम होतो.",
      climateReason: "कोरडी थंडी आणि कमी आर्द्रता यामुळे मर रोग (Wilt) व तांबेरा टाळला जाऊन पिकाला भरघोस फुटवे येतात.",
      phReason: "उदासीन सामू (pH ६.०–७.५) मुळांवरील रायझोबियम जिवाणूंसाठी अत्यंत फायदेशीर ठरतो.",
    },
    hi: {
      name: "चना (Chickpea)",
      summary: "ठंडा मौसम, कम नमी और फास्फोरस का अच्छा स्तर चने की जड़ों में नाइट्रोजन गांठों के विकास और भरपूर घेंटे बनने के लिए सर्वथा उपयुक्त है।",
      nutrientReason: "दलहनी फसल होने के कारण इसे कम नाइट्रोजन और अधिक फास्फोरस की आवश्यकता होती है, जो मिट्टी में उपलब्ध है।",
      climateReason: "सूखा व ठंडा मौसम उकठा (Wilt) रोग से बचाता है और फूलों का झड़ना रोकता है।",
      phReason: "मिट्टी का पीएच मान राइजोबियम जीवाणुओं की सक्रियता के लिए अनुकूल है।",
    },
  },
  soybean: {
    en: {
      name: "Soybean",
      summary: "Well-drained soil with balanced phosphorus and moderate Kharif rainfall matches soybean's critical pod-filling stages perfectly.",
      nutrientReason: "High phosphorus and potassium ensure vigorous root nodulation, oil synthesis, and protein accumulation in beans.",
      climateReason: "Warm temperatures (22–30°C) during vegetative phase and dry spells during maturity facilitate hassle-free harvesting.",
      phReason: "Slightly acidic to neutral pH (6.3–7.3) prevents iron chlorosis and promotes micronutrient absorption.",
    },
    mr: {
      name: "सोयाबीन (Soybean)",
      summary: "मध्यम खरीप पाऊस, उत्तम निचरा होणारी जमीन आणि फॉस्फरस-पोटॅशचा सुवर्णमध्य यामुळे सोयाबीनच्या शेंगांमध्ये दर्जेदार दाणे भरण्यासाठी ही परिस्थिती उत्तम आहे.",
      nutrientReason: "फॉस्फरसमुळे मुळांचा विस्तार आणि पोटॅशमुळे दाण्यांमध्ये तेलाचे व प्रथिनांचे प्रमाण उत्कृष्ट राहते.",
      climateReason: "खरीप हंगामातील सूर्यप्रकाश आणि पाऊस शेंगा भरण्याच्या संवेदनशील काळात ओलावा टिकवून ठेवतो.",
      phReason: "मातीतील ६.५ ते ७.२ सामू पिवळेपणा (Chlorosis) रोखण्यासाठी व सूक्ष्मअन्नद्रव्ये मिळवण्यासाठी योग्य आहे.",
    },
    hi: {
      name: "सोयाबीन (Soybean)",
      summary: "खरीफ की संतुलित वर्षा, अच्छी जल निकासी वाली भूमि और फास्फोरस-पोटाश का संतुलन सोयाबीन में भरपूर दाना भरने के लिए अनुकूल है।",
      nutrientReason: "फास्फोरस जड़ों को मजबूत बनाता है और पोटाश दानों में तेल व प्रोटीन की मात्रा बढ़ाता है।",
      climateReason: "22 से 30 डिग्री का तापमान वानस्पतिक वृद्धि और फलियों के विकास के लिए सर्वश्रेष्ठ है।",
      phReason: "मिट्टी का पीएच मान पत्तियों में पीलापन आने से रोकता है।",
    },
  },
  sugarcane: {
    en: {
      name: "Sugarcane",
      summary: "Your soil's high nutrient reservoir, long sunshine hours, and assured moisture support heavy millable cane tonnage and high sucrose accumulation.",
      nutrientReason: "Heavy consumer of Nitrogen and Potassium. Your soil parameters support prolonged vegetative growth and thick internodes.",
      climateReason: "Warm tropical temperature stimulates continuous tillering, followed by cool dry spells for sucrose ripening.",
      phReason: "Deep loamy soils with pH 6.5–7.8 provide optimal root aeration and water-holding capacity.",
    },
    mr: {
      name: "ऊस (Sugarcane)",
      summary: "तुमच्या जमिनीची पोषण क्षमता, दीर्घ सूर्यप्रकाश आणि सिंचनाची सोय यामुळे जाड कांड्या, वजनदार उसाचे टनेज आणि साखरेचा उच्च उतारा मिळण्यासाठी ऊस पीक परिपूर्ण आहे.",
      nutrientReason: "उसाला भरपूर नायट्रोजन व पोटॅशियमची गरज असते; तुमच्या मातीतील घटक उसाची वाढ जोमदार ठेवण्यास सक्षम आहेत.",
      climateReason: "उष्ण व दमट हवामान वाढीसाठी तर पक्वतेच्या काळात कोरडे हवामान रसातील साखर वाढवण्यासाठी लाभदायी ठरते.",
      phReason: "६.५ ते ७.८ दरम्यानचा सामू उसाच्या मुळांना पाण्याचा व खतांचा दीर्घकाळ पुरवठा सुनिश्चित करतो.",
    },
    hi: {
      name: "गन्ना (Sugarcane)",
      summary: "मिट्टी की उच्च उर्वरता, पर्याप्त धूप और जल उपलब्धता भारी वजनदार गन्ने और उच्च चीनी की मात्रा (रिकवरी) के लिए सर्वथा उपयुक्त है।",
      nutrientReason: "गन्ना एक भारी पोषक तत्व चाहने वाली फसल है; मिट्टी के एनपीके स्तर लंबे समय तक वानस्पतिक विकास में सहायक हैं।",
      climateReason: "गर्म व नम जलवायु गन्ने की लंबाई और मोटाई बढ़ाती है।",
      phReason: "मिट्टी का पीएच मान पोषक तत्वों की निरंतर उपलब्धता बनाए रखता है।",
    },
  },
  wheat: {
    en: {
      name: "Wheat (Gahu)",
      summary: "Cool winter temperatures, moderate moisture, and rich loamy soil structure support excellent tillering and dense grain spikes.",
      nutrientReason: "Balanced N-P-K supports strong straw strength, preventing lodging, and maximizes spikelet grain count.",
      climateReason: "Cool Rabi nights (12–22°C) extend the grain-filling duration, resulting in bold, lustrous grains.",
      phReason: "Near-neutral pH maximizes nitrogen uptake efficiency during crown root initiation.",
    },
    mr: {
      name: "गहू (Wheat)",
      summary: "रब्बी हंगामातील सुखद थंडी, मध्यम ओलावा आणि कसदार जमीन यामुळे गव्हाला भरपूर फुटवे फुटून टपोऱ्या चमकदार दाण्यांचे दाट ओंब्या तयार होतील.",
      nutrientReason: "नायट्रोजन व फॉस्फरसच्या योग्य प्रमाणामुळे गव्हाचे खोड मजबूत राहते आणि पीक लोळत नाही.",
      climateReason: "थंड हवामानामुळे दाणे भरण्याचा कालावधी वाढतो, ज्यामुळे दाणे भरगच्च व वजनदार होतात.",
      phReason: "उदासीन सामू (६.५–७.५) मुकुट मुळे (Crown roots) फुटण्याच्या वेळी खतांचे शोषण जलद करतो.",
    },
    hi: {
      name: "गेहूं (Wheat)",
      summary: "रबी की अनुकूल ठंड, मध्यम नमी और उपजाऊ दोमट मिट्टी गेहूं में अत्यधिक कल्ले फूटने और चमकदार दानों की बालियों के लिए सबसे उपयुक्त है।",
      nutrientReason: "संतुलित एनपीके पौधों के तने को मजबूत रखता है जिससे फसल गिरती नहीं है।",
      climateReason: "ठंडी रातें दाना भराव की अवधि को बढ़ाती हैं, जिससे वजनदार और बोल्ड अनाज प्राप्त होता है।",
      phReason: "मिट्टी का पीएच मान मुकुट जड़ बनते समय पोषक तत्वों का अवशोषण तेज करता है।",
    },
  },
  pomegranate: {
    en: {
      name: "Pomegranate (Dalimb)",
      summary: "Well-drained light-to-medium soil, semi-arid dry atmosphere, and controlled water requirement make pomegranate highly lucrative.",
      nutrientReason: "Requires balanced potassium and calcium for thick rind formation, preventing fruit cracking.",
      climateReason: "Warm days and dry air during flowering and fruit development minimize bacterial blight (Telya) risks.",
      phReason: "Pomegranate tolerates slightly alkaline soils (pH 6.8–8.2) exceptionally well.",
    },
    mr: {
      name: "डाळिंब (Pomegranate)",
      summary: "उत्तम निचरा होणारी हलकी ते मध्यम जमीन, कोरडे हवामान आणि कमी पाण्यात येणारे पीक यामुळे डाळिंब बागेसाठी ही परिस्थिती सर्वाधिक नफ्याची आहे.",
      nutrientReason: "पोटॅश आणि सूक्ष्मअन्नद्रव्यांमुळे फळांची साल जाड व चमकदार बनते आणि फळे तडकण्याची समस्या टळते.",
      climateReason: "फुलोऱ्याच्या आणि फळवाढीच्या काळात कोरडे हवामान तेल्या (Bacterial Blight) रोगाचा प्रादुर्भाव रोखण्यास मदत करते.",
      phReason: "डाळिंब ६.८ ते ८.२ पर्यंतचा सामू अतिशय चांगल्या प्रकारे सहन करते.",
    },
    hi: {
      name: "अनार (Pomegranate)",
      summary: "अच्छी जल निकासी वाली हल्की-मध्यम मिट्टी, शुष्क वातावरण और कम पानी की आवश्यकता अनार की बंपर पैदावार के लिए मुफीद है।",
      nutrientReason: "पोटाश और कैल्शियम फलों के छिलके को मजबूत बनाते हैं, जिससे फल फटने से बचते हैं।",
      climateReason: "शुष्क जलवायु जीवाणु झुलसा (तेल्या रोग) के खतरे को काफी कम कर देती है।",
      phReason: "अनार हल्की क्षारीय मिट्टी में भी उत्कृष्ट फल देता है।",
    },
  },
  banana: {
    en: {
      name: "Banana (Keli)",
      summary: "Rich potassium reserves, abundant moisture, and warm tropical climate fulfill banana's intensive nutrient appetite for heavy bunches.",
      nutrientReason: "Extremely high potassium demand is satisfied by your soil, ensuring large finger length and high bunch weight.",
      climateReason: "High humidity and continuous thermal warmth accelerate leaf emergence and pseudostem girth.",
      phReason: "Slightly acidic to neutral rich alluvial/clay-loam soils allow deep feeder root penetration.",
    },
    mr: {
      name: "केळी (Banana)",
      summary: "मातीतील भरपूर पोटॅशियम, मुबलक पाणी व उष्ण दमट हवामान यामुळे दर्जेदार घड, लांब घडण्या आणि वजनदार केळीच्या उत्पादनासाठी ही जमीन सर्वोत्तम आहे.",
      nutrientReason: "केळी पिकाला पोटॅशची प्रचंड भूक असते, जी तुमच्या जमिनीतून पूर्ण होऊन घडांचे वजन वाढेल.",
      climateReason: "उष्ण व दमट हवामानामुळे नवीन पानांची निर्मिती वेगाने होते आणि खोडाचा घेर जाड होतो.",
      phReason: "सुपीक पोयट्याची जमीन मुळांना भरपूर ऑक्सिजन व अन्नद्रव्ये पुरवते.",
    },
    hi: {
      name: "केला (Banana)",
      summary: "उच्च पोटाश, प्रचुर जल और गर्म आर्द्र जलवायु केले के भारी घौद (Bunches) और लंबे फलों के लिए सर्वोत्तम संयोजन है।",
      nutrientReason: "केले की भारी पोटाश मांग आपकी मिट्टी द्वारा पूरी होती है, जिससे फलों की चमक और वजन बढ़ता है।",
      climateReason: "गर्म व नम मौसम नए पत्तों के तेजी से निकलने और तने की मोटाई बढ़ाने में मदद करता है।",
      phReason: "उपजाऊ दोमट मिट्टी जड़ों को गहराई तक फैलने में मदद करती है।",
    },
  },
  onion: {
    en: {
      name: "Onion (Kanda)",
      summary: "Friable well-aerated soil with balanced sulfur, phosphorus, and moderate winter temperatures encourages uniform bulb swelling.",
      nutrientReason: "Moderate nitrogen prevents bolting, while phosphorus and potassium ensure firm bulb scales and longer shelf life.",
      climateReason: "Cool weather during vegetative growth followed by dry sunny conditions during bulb maturity prevents neck rot.",
      phReason: "Optimal pH 6.2–7.5 prevents thrips susceptibility and encourages fibrous root mass.",
    },
    mr: {
      name: "कांदा (Onion)",
      summary: "भुसभुशीत जमीन, फॉस्फरस-पोटॅशचे योग्य प्रमाण आणि कोरडे हवामान यामुळे कांद्याचा गोल गरगरीत आकार, टणकपणा आणि टिकवणक्षमता वाढण्यासाठी ही परिस्थिती आदर्श आहे.",
      nutrientReason: "मध्यम नायट्रोजनमुळे डेंगळे (Bolting) येत नाहीत, तर फॉस्फरस व पोटॅशमुळे कांदा घट्ट बनून साठवणुकीत टिकतो.",
      climateReason: "सुरुवातीला थंड आणि कांदा पोसताना कोरडे उन पडल्यास कांदा सडत नाही व चांगला रंग पकडतो.",
      phReason: "६.२ ते ७.५ दरम्यानचा सामू फुलकिडे (Thrips) आणि करपा रोगाविरुद्ध नैसर्गिक प्रतिकार वाढवतो.",
    },
    hi: {
      name: "प्याज (Onion)",
      summary: "भुरभुरी मिट्टी, फास्फोरस-पोटाश का संतुलन और शुष्क मौसम प्याज के सुडौल कंद, चमक और लंबी भंडारण क्षमता के लिए अनुकूल है।",
      nutrientReason: "मध्यम नाइट्रोजन से डंठल (Bolting) नहीं निकलता और पोटाश से कंद ठोस बनता है।",
      climateReason: "कंद पकते समय खिली धूप और शुष्क मौसम प्याज को सड़न से बचाता है।",
      phReason: "मिट्टी का उपयुक्त पीएच मान जड़ों के फैलाव में मददगार है।",
    },
  },
};

export function getCropRecommendationReason(cropName, soilInputs = {}, lang = "en") {
  if (!cropName) return null;

  const key = cropName.toString().toLowerCase().trim().replace(/[\s\-_()]/g, "");
  
  let matchKey = Object.keys(CROP_BENCHMARKS).find(
    (k) => key.includes(k) || k.includes(key)
  );

  const selectedLang = ["mr", "hi", "en"].includes(lang) ? lang : "en";
  
  const n = Number(soilInputs.nitrogen || soilInputs.N || 50);
  const p = Number(soilInputs.phosphorus || soilInputs.P || 40);
  const k = Number(soilInputs.potassium || soilInputs.K || 45);
  const ph = Number(soilInputs.ph || 6.8);
  const rain = Number(soilInputs.rainfall || 600);
  const temp = Number(soilInputs.temperature || 26);
  const hum = Number(soilInputs.humidity || 65);

  if (matchKey && CROP_BENCHMARKS[matchKey]?.[selectedLang]) {
    const data = CROP_BENCHMARKS[matchKey][selectedLang];
    return {
      cropName: data.name,
      summary: data.summary,
      nutrientReason: data.nutrientReason,
      climateReason: data.climateReason,
      phReason: data.phReason,
      keyMetrics: [
        {
          label: selectedLang === "mr" ? "मातीतील N-P-K" : selectedLang === "hi" ? "मृदा N-P-K" : "Soil N-P-K",
          value: `${n} : ${p} : ${k}`,
          status: selectedLang === "mr" ? "अनुकूल" : selectedLang === "hi" ? "अनुकूल" : "Optimal",
        },
        {
          label: selectedLang === "mr" ? "सामू (pH)" : selectedLang === "hi" ? "पीएच (pH)" : "Soil pH",
          value: `${ph}`,
          status: ph >= 6.0 && ph <= 7.8 ? (selectedLang === "mr" ? "आदर्श" : selectedLang === "hi" ? "आदर्श" : "Ideal") : (selectedLang === "mr" ? "समाधानकारक" : selectedLang === "hi" ? "संतोषजनक" : "Fair"),
        },
        {
          label: selectedLang === "mr" ? "हंगामी पाऊस" : selectedLang === "hi" ? "मौसमी वर्षा" : "Rainfall",
          value: `${rain} mm`,
          status: selectedLang === "mr" ? "सुसंगत" : selectedLang === "hi" ? "सुसंगत" : "Compatible",
        },
        {
          label: selectedLang === "mr" ? "हवामान तापमान" : selectedLang === "hi" ? "तापमान" : "Temperature",
          value: `${temp}°C (${hum}%)`,
          status: selectedLang === "mr" ? "पोषक" : selectedLang === "hi" ? "पोषक" : "Favorable",
        },
      ],
    };
  }

  // Generic dynamic fallback
  if (selectedLang === "mr") {
    return {
      cropName: cropName,
      summary: `तुमच्या मातीतील पोषण पातळी (N: ${n}, P: ${p}, K: ${k}) आणि हवामानातील पाऊस (${rain} mm) व तापमान (${temp}°C) या पिकाच्या जैविक गरजेनुसार अत्यंत संतुलित आहेत.`,
      nutrientReason: `या पिकाला लागणारे प्राथमिक अन्नद्रव्ये तुमच्या मातीतील उपलब्ध घटकांशी पूर्णपणे जुळतात.`,
      climateReason: `${rain} mm पाऊस आणि ${hum}% हवेतील ओलावा यामुळे पिकावर पाण्याचा ताण न येता नैसर्गिक वाढ होईल.`,
      phReason: `मातीचा सामू (${ph}) अन्नद्रव्यांची उपलब्धता टिकवून ठेवण्यासाठी योग्य आहे.`,
      keyMetrics: [
        { label: "मातीतील N-P-K", value: `${n} : ${p} : ${k}`, status: "अनुकूल" },
        { label: "सामू (pH)", value: `${ph}`, status: "आदर्श" },
        { label: "हंगामी पाऊस", value: `${rain} mm`, status: "सुसंगत" },
      ],
    };
  } else if (selectedLang === "hi") {
    return {
      cropName: cropName,
      summary: `आपकी मिट्टी में पोषक तत्वों का स्तर (N: ${n}, P: ${p}, K: ${k}) और क्षेत्र में वर्षा (${rain} mm) व तापमान (${temp}°C) इस फसल की अधिकतम पैदावार के लिए पूरी तरह अनुकूल हैं।`,
      nutrientReason: `इस फसल के लिए आवश्यक प्राथमिक पोषक तत्व आपकी मिट्टी में मौजूद स्तर से मेल खाते हैं।`,
      climateReason: `${rain} mm वर्षा और ${hum}% आर्द्रता फसल को बिना किसी तनाव के स्वस्थ वानस्पतिक विकास प्रदान करेगी।`,
      phReason: `मिट्टी का पीएच मान (${ph}) पोषक तत्वों के सुचारू अवशोषण के लिए उत्तम है।`,
      keyMetrics: [
        { label: "मृदा N-P-K", value: `${n} : ${p} : ${k}`, status: "अनुकूल" },
        { label: "पीएच (pH)", value: `${ph}`, status: "आदर्श" },
        { label: "मौसमी वर्षा", value: `${rain} mm`, status: "सुसंगत" },
      ],
    };
  } else {
    return {
      cropName: cropName,
      summary: `Your soil nutrient profile (N: ${n}, P: ${p}, K: ${k}) combined with regional rainfall (${rain} mm) and temperature (${temp}°C) directly aligns with the optimal agronomic thresholds for ${cropName}.`,
      nutrientReason: `The macronutrient ratios in your soil support high photosynthetic efficiency and vigor for this crop.`,
      climateReason: `Annual rainfall of ${rain} mm and humidity of ${hum}% fulfill the moisture demands without inducing root rot or moisture stress.`,
      phReason: `Soil pH of ${ph} ensures high bioavailability of macro and micronutrients.`,
      keyMetrics: [
        { label: "Soil N-P-K", value: `${n} : ${p} : ${k}`, status: "Optimal" },
        { label: "Soil pH", value: `${ph}`, status: "Ideal" },
        { label: "Rainfall", value: `${rain} mm`, status: "Compatible" },
      ],
    };
  }
}
