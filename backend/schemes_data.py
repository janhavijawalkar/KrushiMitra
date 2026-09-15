"""
Government Schemes Dataset for Maharashtra Farmers
Includes Central (GoI) and State (GoM) flagship schemes with detailed criteria,
subsidy percentages, required documents, and official portal links.
"""

GOVERNMENT_SCHEMES = [
    {
        "id": "pm-kisan",
        "name": {
            "en": "PM-Kisan Samman Nidhi Yojana",
            "mr": "प्रधानमंत्री किसान सन्मान निधी योजना",
            "hi": "प्रधानमंत्री किसान सम्मान निधि योजना"
        },
        "tagline": {
            "en": "₹6,000 annual direct income support in 3 equal instalments of ₹2,000 directly to farmer bank accounts.",
            "mr": "शेतकऱ्यांच्या थेट बँक खात्यात दरवर्षी ३ समान हप्त्यांमध्ये ₹६,००० चे थेट उत्पन्न सहाय्य.",
            "hi": "किसानों के बैंक खातों में प्रति वर्ष ₹६,००० की प्रत्यक्ष आय सहायता (३ समान किस्तों में)।"
        },
        "category": "financial",
        "level": "Central",
        "subsidy_amount": {
            "en": "₹6,000 / year (Direct DBT)",
            "mr": "₹६,००० प्रति वर्ष (थेट बँक जमा)",
            "hi": "₹६,००० प्रति वर्ष (सीधे बैंक खाते में)"
        },
        "eligibility": {
            "max_land_acres": None,
            "categories": ["ALL"],
            "water_source_required": False,
            "farmer_types": ["Small & Marginal", "Medium", "Large"],
            "criteria_summary": {
                "en": "All landholding farmer families having cultivable landholding in their names. Institutional landholders and high-income tax payers are excluded.",
                "mr": "स्वतःच्या नावावर शेतजमीन असलेले सर्व शेतकरी कुटुंब पात्र. सरकारी नोकरदार व आयकर भरणारे वगळता.",
                "hi": "जिन किसानों के नाम कृषि योग्य भूमि है। आयकर दाता और संस्थागत भूमिधारक पात्र नहीं हैं।"
            }
        },
        "benefits": {
            "en": [
                "₹2,000 transferred directly every 4 months via Aadhaar-linked DBT",
                "100% centrally funded with zero intermediary cut",
                "Automatic linkage to Kisan Credit Card (KCC) at 4% concessional interest rate"
            ],
            "mr": [
                "दर चार महिन्यांनी ₹२,००० आधार संलग्न DBT द्वारे थेट खात्यात जमा",
                "कोणत्याही मध्यस्थाशिवाय १००% केंद्र सरकारचे अनुदान",
                "फक्त ४% सवलतीच्या व्याजदरावर किसान क्रेडिट कार्ड (KCC) मिळण्याची सुविधा"
            ],
            "hi": [
                "हर चार महीने में ₹२,००० सीधे आधार लिंक बैंक खाते में डीबीटी द्वारा",
                "बिना किसी बिचौलिए के १००% केंद्र प्रायोजित राशि",
                "४% रियायती ब्याज दर पर किसान क्रेडिट कार्ड (KCC) से स्वतः जुड़ाव"
            ]
        },
        "documents": {
            "en": ["Aadhaar Card (Linked with Mobile)", "7/12 & 8-A Land Extract (उतारा)", "Active Bank Account Passbook", "Active Mobile Number"],
            "mr": ["आधार कार्ड (मोबाईल लिंक असलेले)", "७/१२ व ८-अ जमीन उतारा", "बँक पासबुक झेरॉक्स", "सक्रिय मोबाईल क्रमांक"],
            "hi": ["आधार कार्ड (मोबाइल से लिंक)", "७/१२ एवं ८-अ खतौनी/भूलेख", "बैंक पासबुक", "सक्रिय मोबाइल नंबर"]
        },
        "apply_url": "https://pmkisan.gov.in",
        "portal_name": "PM-Kisan Official Portal",
        "offline_contact": "Gram Sevak / Talathi / Common Service Center (CSC / Aaple Sarkar)"
    },
    {
        "id": "namo-shetkari",
        "name": {
            "en": "Namo Shetkari Mahasanman Nidhi Yojana (Maharashtra)",
            "mr": "नमो शेतकरी महासन्मान निधी योजना (महाराष्ट्र शासन)",
            "hi": "नमो शेतकारी महासम्मान निधि योजना (महाराष्ट्र)"
        },
        "tagline": {
            "en": "Additional ₹6,000/year state bonus from Maharashtra Govt, bringing total annual assistance to ₹12,000.",
            "mr": "महाराष्ट्र शासनाकडून अतिरिक्त ₹६,००० दरवर्षी — PM-Kisan मिळून एकूण ₹१२,००० थेट खात्यात!",
            "hi": "महाराष्ट्र सरकार द्वारा अतिरिक्त ₹६,००० प्रति वर्ष — पीएम-किसान मिलाकर कुल ₹१२,००० की आय सहायता!"
        },
        "category": "financial",
        "level": "Maharashtra State",
        "subsidy_amount": {
            "en": "₹6,000 / year (State Top-up)",
            "mr": "₹६,००० प्रति वर्ष (राज्य शासन)",
            "hi": "₹६,००० प्रति वर्ष (राज्य सरकार)"
        },
        "eligibility": {
            "max_land_acres": None,
            "categories": ["ALL"],
            "water_source_required": False,
            "farmer_types": ["All PM-Kisan Beneficiaries in Maharashtra"],
            "criteria_summary": {
                "en": "All Maharashtra farmers currently approved and receiving PM-Kisan Samman Nidhi are automatically eligible.",
                "mr": "महाराष्ट्रातील पीएम-किसान सन्मान निधीचे लाभ मिळणारे सर्व नोंदणीकृत शेतकरी आपोआप पात्र आहेत.",
                "hi": "महाराष्ट्र के वे सभी किसान जिन्हें पीएम-किसान सम्मान निधि मिल रही है, स्वतः पात्र हैं।"
            }
        },
        "benefits": {
            "en": [
                "Combined total of ₹12,000/year (₹6,000 Central + ₹6,000 Maharashtra State)",
                "No separate registration needed if PM-Kisan e-KYC and land seeding is completed",
                "Credited in 3 installments matching PM-Kisan calendar"
            ],
            "mr": [
                "केंद्राचे ₹६,००० + राज्याचे ₹६,००० असे एकूण वर्षाला ₹१२,००० चे भरघोस आर्थिक सहाय्य",
                "पीएम-किसान ई-केवायसी व लँड सीडिंग असल्यास स्वतंत्र अर्ज करण्याची आवश्यकता नाही",
                "थेट बँक खात्यात पारदर्शकपणे जमा"
            ],
            "hi": [
                "कुल मिलाकर ₹१२,००० प्रति वर्ष (₹६,००० केंद्र + ₹६,००० महाराष्ट्र राज्य)",
                "पीएम-किसान ई-केवाईसी पूर्ण होने पर किसी अलग पंजीकरण की आवश्यकता नहीं",
                "सीधे बैंक खाते में पारदर्शी रूप से स्थानांतरित"
            ]
        },
        "documents": {
            "en": ["PM-Kisan Registration ID", "Aadhaar Card", "7/12 Land Record", "DBT Enabled Bank Account"],
            "mr": ["पीएम-किसान नोंदणी क्रमांक", "आधार कार्ड", "७/१२ दाखला", "डीबीटी सक्रिय बँक खाते"],
            "hi": ["पीएम-किसान पंजीकरण आईडी", "आधार कार्ड", "७/१२ भूलेख", "डीबीटी सक्षम बैंक खाता"]
        },
        "apply_url": "https://mahadbt.maharashtra.gov.in",
        "portal_name": "MahaDBT Farmer Portal",
        "offline_contact": "Taluka Krushi Adhikari (TKA) / District Agriculture Office"
    },
    {
        "id": "pmfby-one-rupee",
        "name": {
            "en": "PMFBY ₹1 Crop Insurance (Pradhan Mantri Fasal Bima)",
            "mr": "सर्वसमावेशक ₹१ पीक विमा योजना (PMFBY महाराष्ट्र)",
            "hi": "प्रधानमंत्री फसल बीमा योजना (₹१ टोकन प्रीमियम महाराष्ट्र)"
        },
        "tagline": {
            "en": "Full crop protection against drought, unseasonal rain, hail & pests at just ₹1 token premium for Maharashtra farmers.",
            "mr": "अवकाळी पाऊस, दुष्काळ, गारपीट व किडीपासून संपूर्ण पीक संरक्षण — शेतकऱ्यांसाठी फक्त ₹१ टोकन विमा हप्ता!",
            "hi": "सूखा, बेमौसम बारिश, ओलावृष्टि और कीटों से पूरी सुरक्षा — महाराष्ट्र किसानों के लिए मात्र ₹१ में बीमा!"
        },
        "category": "insurance",
        "level": "State + Central",
        "subsidy_amount": {
            "en": "Farmer pays only ₹1 (Balance 100% subsidized by State Govt)",
            "mr": "शेतकऱ्याला फक्त ₹१ भरावा लागतो (उर्वरित संपूर्ण हप्ता राज्य शासन भरते)",
            "hi": "किसान को सिर्फ ₹१ देना है (बाकी पूरा प्रीमियम राज्य सरकार वहन करती है)"
        },
        "eligibility": {
            "max_land_acres": None,
            "categories": ["ALL"],
            "water_source_required": False,
            "farmer_types": ["Owner Farmers", "Tenant Farmers / Sharecroppers"],
            "criteria_summary": {
                "en": "All loanee and non-loanee farmers growing notified Kharif and Rabi crops across all 36 Maharashtra districts.",
                "mr": "महाराष्ट्रातील अधिसूचित खरीप व रब्बी पिके घेणारे सर्व खातेदार व भाडेकरू शेतकरी पात्र.",
                "hi": "महाराष्ट्र के सभी ३६ जिलों में अधिसूचित खरीफ एवं रबी फसलें उगाने वाले सभी किसान पात्र।"
            }
        },
        "benefits": {
            "en": [
                "Full compensation for prevented sowing, mid-season adversity, local natural calamities, and post-harvest losses",
                "Zero financial burden: farmer pays only ₹1 per application",
                "Instant claim intimation via Crop Insurance mobile app within 72 hours of damage"
            ],
            "mr": [
                "पेरणी न होणे, हंगामातील नुकसान, गारपीट, ढगफुटी आणि काढणीनंतरच्या नुकसानीची १००% भरपाई",
                "आर्थिक भार नाही: प्रति अर्जासाठी शेतकऱ्याला फक्त ₹१ भरावा लागतो",
                "नुकसानीनंतर ७२ तासांत 'Crop Insurance App' वरून क्लेम नोंदवण्याची सोय"
            ],
            "hi": [
                "बुवाई न होने, ओलावृष्टि, स्थानीय आपदा और फसल कटाई उपरांत नुकसान पर पूर्ण मुआवजा",
                "किसानों पर कोई वित्तीय बोझ नहीं: केवल ₹१ प्रति आवेदन",
                "नुकसान के ७२ घंटे के भीतर क्रॉप इंश्योरेंस मोबाइल ऐप द्वारा तुरंत सूचना की सुविधा"
            ]
        },
        "documents": {
            "en": ["7/12 Extract with Crop Sowing Entry (पीक पाहणी नोंद)", "8-A Extract", "Aadhaar Card", "Bank Passbook", "Self Sowing Declaration (स्वयंघोषणा पत्र)"],
            "mr": ["ई-पीक पाहणी नोंद असलेला ७/१२ उतारा", "८-अ उतारा", "आधार कार्ड", "बँक पासबुक", "पीक पेरणी स्वयंघोषणा पत्र"],
            "hi": ["ई-पीक मुआयना दर्ज ७/१२ खतौनी", "८-अ भूलेख", "आधार कार्ड", "बैंक पासबुक", "स्व-घोषणा पत्र"]
        },
        "apply_url": "https://pmfby.gov.in",
        "portal_name": "National Crop Insurance Portal & CSC",
        "offline_contact": "District Agriculture Officer / CSC Center / Bank Branch"
    },
    {
        "id": "pm-kusum-solar",
        "name": {
            "en": "PM-KUSUM Solar Agriculture Pump Scheme (Component B)",
            "mr": "पीएम-कुसुम सौर कृषी पंप योजना (महाकृषी ऊर्जा अभियान)",
            "hi": "पीएम-कुसुम सोलर कृषि पंप योजना"
        },
        "tagline": {
            "en": "90% to 95% subsidy for 3 HP, 5 HP, and 7.5 HP off-grid solar water pumps for daytime uninterrupted irrigation.",
            "mr": "दिवसा हक्काचे सिंचन मिळवण्यासाठी ३, ५ व ७.५ हॉर्सपॉवरच्या सौर पंपावर ९०% ते ९५% सरकारी अनुदान!",
            "hi": "दिन में निर्बाध सिंचाई हेतु ३, ५ और ७.५ एचपी के सौर पंपों पर ९०% से ९५% की भारी सब्सिडी!"
        },
        "category": "solar",
        "level": "State + Central",
        "subsidy_amount": {
            "en": "90% Subsidy (General) / 95% Subsidy (SC/ST)",
            "mr": "सर्वसाधारण शेतकऱ्यांना ९०% अनुदान / SC-ST शेतकऱ्यांना ९५% अनुदान",
            "hi": "सामान्य किसानों को ९०% सब्सिडी / अनुसूचित जाति-जनजाति को ९५% सब्सिडी"
        },
        "eligibility": {
            "max_land_acres": None,
            "categories": ["ALL", "SC", "ST", "OBC", "GENERAL"],
            "water_source_required": True,
            "farmer_types": ["Farmers without conventional electric grid connection"],
            "criteria_summary": {
                "en": "Farmers possessing agricultural land with a perennial water source (well, borewell, farm pond, river) and no active conventional grid electric pump connection.",
                "mr": "स्वतःची शेतजमीन आणि पाण्याचा शाश्वत स्रोत (विहीर, कूपनलिका, शेततळे, नदी) असलेले व वीज कनेक्शन नसलेले शेतकरी.",
                "hi": "कृषि भूमि और सुनिश्चित जल स्रोत (कुआं, बोरवेल, खेत तालाब) वाले किसान जिनके पास बिजली का कनेक्शन नहीं है।"
            }
        },
        "benefits": {
            "en": [
                "Daytime 8 to 10 hours continuous free solar irrigation — no night watering hassles",
                "Farmer contribution only 5% (SC/ST) or 10% (General category)",
                "5-year comprehensive maintenance, warranty, and insurance coverage by vendor"
            ],
            "mr": [
                "दिवसा ८ ते १० तास मोफत सौरऊर्जेवर पाणी — रात्रीच्या वेळी शेतात जाण्याची भीती नाही",
                "शेतकऱ्याला फक्त ५% (SC/ST) किंवा १०% (इतर) स्वहिस्सा भरावा लागतो",
                "५ वर्षांची संपूर्ण वॉरंटी, विमा आणि मोफत देखभाल दुरुस्ती"
            ],
            "hi": [
                "दिन में ८ से १० घंटे मुफ्त सौर सिंचाई — रात में खेत जाने की परेशानी खत्म",
                "किसान को केवल ५% (SC/ST) या १०% (सामान्य) अंशदान देना होता है",
                "५ वर्षों की व्यापक वारंटी, बीमा और रखरखाव सहायता"
            ]
        },
        "documents": {
            "en": ["7/12 & 8-A Extract with Water Source Entry", "Aadhaar Card", "Caste Certificate (for SC/ST 95% subsidy)", "Bank Passbook", "No-Dues / No Conventional Connection Certificate"],
            "mr": ["पाण्याच्या स्रोताची नोंद असलेला ७/१२ व ८-अ उतारा", "आधार कार्ड", "जात प्रमाणपत्र (SC/ST सवलतीसाठी)", "बँक पासबुक", "महावितरण वीज जोडणी नसल्याचे प्रमाणपत्र"],
            "hi": ["जल स्रोत दर्ज ७/१२ एवं ८-अ भूलेख", "आधार कार्ड", "जाति प्रमाण पत्र (SC/ST हेतु)", "बैंक पासबुक", "बिजली कनेक्शन न होने का प्रमाण पत्र"]
        },
        "apply_url": "https://www.mahadiscom.in/solar_MSEDCL/",
        "portal_name": "MahaVitaran (MSEDCL) Solar Portal",
        "offline_contact": "MSEDCL Sub-Division Office / Mahavitaran Junior Engineer"
    },
    {
        "id": "mahadbt-micro-irrigation",
        "name": {
            "en": "MahaDBT Drip & Sprinkler Micro-Irrigation Subsidy",
            "mr": "ठिबक व तुषार सूक्ष्म सिंचन योजना (MahaDBT)",
            "hi": "महाडीबीटी ड्रिप एवं स्प्रिंकलर सूक्ष्म सिंचाई योजना"
        },
        "tagline": {
            "en": "75% to 80% subsidy on drip and sprinkler sets under PMKSY & Maharashtra State top-up fund.",
            "mr": "पाण्याची ६०% बचत आणि उत्पादनात वाढ — ठिबक व तुषार संचावर ७५% ते ८०% सरकारी अनुदान!",
            "hi": "६०% पानी की बचत और पैदावार में वृद्धि — ड्रिप व स्प्रिंकलर सेट पर ७५% से ८०% सरकारी सब्सिडी!"
        },
        "category": "irrigation",
        "level": "State + Central",
        "subsidy_amount": {
            "en": "80% (Small/Marginal Farmers < 5 Acres) / 75% (Others)",
            "mr": "लहान व अल्पभूधारक शेतकऱ्यांना ८०% / इतर शेतकऱ्यांना ७५% अनुदान",
            "hi": "छोटे व सीमांत किसानों को ८०% / अन्य किसानों को ७५% सब्सिडी"
        },
        "eligibility": {
            "max_land_acres": 12.5,
            "categories": ["ALL"],
            "water_source_required": True,
            "farmer_types": ["Small (< 2.5 acres)", "Marginal (2.5 to 5 acres)", "Other (> 5 acres)"],
            "criteria_summary": {
                "en": "Farmers possessing cultivable land with a verified water source and electric/diesel/solar pump. Max ceiling up to 5 hectares.",
                "mr": "शेतात पाण्याचा स्रोत व पाणी उपसा साधन (पंप) असलेले सर्व शेतकरी. कमाल मर्यादा ५ हेक्टरपर्यंत.",
                "hi": "खेत में सुनिश्चित जल स्रोत और लिफ्टिंग पंप रखने वाले सभी किसान। अधिकतम सीमा ५ हेक्टेयर तक।"
            }
        },
        "benefits": {
            "en": [
                "Saves 50-60% water, enables fertigation (liquid fertilizer application) directly to plant roots",
                "Up to ₹85,000 subsidy per hectare for wide-spaced crops (sugarcane, fruit orchards)",
                "Transparent computer lottery system through MahaDBT portal"
            ],
            "mr": [
                "पाण्याची ५०-६०% बचत, खते थेट मुळांना देण्याची (Fertigation) उत्कृष्ट सोय",
                "फळबागा व ऊस पिकासाठी हेक्टरी ₹८५,००० पर्यंत भरघोस अनुदान",
                "महाडीबीटी संगणकीय सोडत पद्धतीद्वारे पारदर्शक निवड"
            ],
            "hi": [
                "५०-६०% पानी की बचत और उर्वरक सीधे जड़ों तक पहुंचाने की सुविधा",
                "बागवानी और गन्ना जैसी फसलों के लिए प्रति हेक्टेयर ₹८५,००० तक अनुदान",
                "महाडीबीटी कम्प्यूटरीकृत लॉटरी के माध्यम से पूर्णतः पारदर्शी चयन"
            ]
        },
        "documents": {
            "en": ["7/12 & 8-A Extract", "Electricity Bill / Solar Pump Certificate", "Aadhaar Card", "Bank Passbook", "Registered Micro-Irrigation Dealer Quotation / Bill"],
            "mr": ["७/१२ व ८-अ उतारा", "वीज बिल किंवा सौर पंप पावती", "आधार कार्ड", "बँक पासबुक", "मान्यताप्राप्त ठिबक कंपनीचे कोटेशन व बिल"],
            "hi": ["७/१२ एवं ८-अ खतौनी", "बिजली बिल या सोलर पंप रसीद", "आधार कार्ड", "बैंक पासबुक", "पंजीकृत डीलर का कोटेशन और बिल"]
        },
        "apply_url": "https://mahadbt.maharashtra.gov.in",
        "portal_name": "MahaDBT Farmer Schemes Portal",
        "offline_contact": "Krushi Sahayak / Taluka Krushi Adhikari Office"
    },
    {
        "id": "magel-tyala-shettale",
        "name": {
            "en": "Magel Tyala Shettale (Farm Pond on Demand) Scheme",
            "mr": "मागेल त्याला शेततळे योजना (महाराष्ट्र शासन)",
            "hi": "मागेल त्याला शेततळे (मांगने पर खेत तालाब योजना)"
        },
        "tagline": {
            "en": "Government grant up to ₹75,000 for farm pond excavation + ₹1,00,000 for plastic film lining.",
            "mr": "दुष्काळी परिस्थितीवर मात — शेततळे खोदकामासाठी ₹७५,००० आणि प्लास्टिक अस्तरीकरणासाठी ₹१,००,००० अनुदान!",
            "hi": "सूखे से बचाव — खेत तालाब निर्माण हेतु ₹७५,००० और प्लास्टिक अस्तर बिछाने हेतु ₹१,००,००० अनुदान!"
        },
        "category": "irrigation",
        "level": "Maharashtra State",
        "subsidy_amount": {
            "en": "Up to ₹1,75,000 Total (₹75k digging + ₹1 Lakh lining)",
            "mr": "एकूण ₹१,७५,००० पर्यंत (₹७५ हजार खोदकाम + ₹१ लाख अस्तरीकरण)",
            "hi": "कुल ₹१,७५,००० तक (₹७५ हजार खुदाई + ₹१ लाख प्लास्टिक अस्तर)"
        },
        "eligibility": {
            "max_land_acres": None,
            "categories": ["ALL"],
            "water_source_required": False,
            "farmer_types": ["Minimum 0.60 Hectare (1.5 Acres) Land"],
            "criteria_summary": {
                "en": "Farmers owning minimum 0.60 hectare land holding. Land must be technically feasible for rainwater harvesting.",
                "mr": "किमान ०.६० हेक्टर (दीड एकर) जमीन मालकी असणे आवश्यक. पावसाचे पाणी साठवण्यासाठी जागा योग्य असावी.",
                "hi": "न्यूनतम ०.६० हेक्टेयर भूमि का स्वामित्व होना आवश्यक। वर्षा जल संचयन हेतु भूमि उपयुक्त हो।"
            }
        },
        "benefits": {
            "en": [
                "Guaranteed protective irrigation during critical dry spells in Kharif and Rabi",
                "Substantial increase in orchard productivity and winter crop acreage",
                "Fish farming (aquaculture) opportunity in farm pond for extra farm income"
            ],
            "mr": [
                "खरीप व रब्बी हंगामात पावसाचा खंड पडल्यास पिकांना हमखास संरक्षित पाणी",
                "फळबागा, भाजीपाला आणि नगदी पिकांचे उत्पादन दुप्पट",
                "शेततळ्यात मत्स्यपालन करून अतिरिक्त पूरक उत्पन्न मिळवण्याची संधी"
            ],
            "hi": [
                "मानसून में सूखा पड़ने पर फसलों के लिए जीवनरक्षक संरक्षित सिंचाई",
                "बागवानी और सब्जियों की पैदावार में भारी बढ़ोतरी",
                "खेत तालाब में मछली पालन कर अतिरिक्त आय का अवसर"
            ]
        },
        "documents": {
            "en": ["7/12 & 8-A Extract", "Consent letter of co-holders if joint land", "Aadhaar Card", "Bank Passbook", "GPS Geotagged Site Photo"],
            "mr": ["७/१२ व ८-अ उतारा", "सामाईक खातेदार असल्यास संमतीपत्र", "आधार कार्ड", "बँक पासबुक", "जिओटॅग केलेला शेताचा फोटो"],
            "hi": ["७/१२ एवं ८-अ खतौनी", "साझा खातेदार होने पर सहमति पत्र", "आधार कार्ड", "बैंक पासबुक", "जियोटैग युक्त स्थल फोटो"]
        },
        "apply_url": "https://mahadbt.maharashtra.gov.in",
        "portal_name": "MahaDBT Agriculture Portal",
        "offline_contact": "Krushi Sahayak / Mandal Krushi Adhikari"
    },
    {
        "id": "krushi-yantrikikaran-smam",
        "name": {
            "en": "SMAM Farm Mechanization Subsidy (कृषी यांत्रिकीकरण)",
            "mr": "कृषी यांत्रिकीकरण उप-अभियान (ट्रॅक्टर, रोटाव्हेटर अनुदान)",
            "hi": "कृषि यंत्रीकरण उप-मिशन (ट्रैक्टर व कृषि उपकरण सब्सिडी)"
        },
        "tagline": {
            "en": "40% to 50% subsidy on Tractors, Rotavators, Power Tillers, Seed Drills, Harvesters, and Sprayers.",
            "mr": "शेती कामात वेळेची व पैशाची बचत — ट्रॅक्टर, रोटाव्हेटर, पॉवर टिलर व पेरणी यंत्रांवर ४०% ते ५०% अनुदान!",
            "hi": "खेती में समय और खर्च की बचत — ट्रैक्टर, रोटावेटर, पावर टिलर और बुवाई मशीनों पर ४०% से ५०% सब्सिडी!"
        },
        "category": "machinery",
        "level": "State + Central",
        "subsidy_amount": {
            "en": "Up to ₹1.25 Lakhs for Tractors / 50% on Implements",
            "mr": "ट्रॅक्टरसाठी ₹१.२५ लाखांपर्यंत / कृषी अवजारांवर ५०% अनुदान",
            "hi": "ट्रैक्टर हेतु ₹१.२५ लाख तक / कृषि उपकरणों पर ५०% सब्सिडी"
        },
        "eligibility": {
            "max_land_acres": None,
            "categories": ["ALL", "WOMEN", "SC", "ST"],
            "water_source_required": False,
            "farmer_types": ["Small/Marginal, Women, SC/ST get priority 50% subsidy"],
            "criteria_summary": {
                "en": "Any farmer with 7/12 extract in their name. A farmer can avail tractor subsidy once in 10 years and implement subsidy once in 3 years.",
                "mr": "स्वतःच्या नावावर ७/१२ असलेले शेतकरी. ट्रॅक्टर अनुदान १० वर्षांतून एकदा व अवजारे अनुदान ३ वर्षांतून एकदा मिळते.",
                "hi": "अपने नाम ७/१२ रखने वाले किसान। ट्रैक्टर सब्सिडी १० साल में एक बार व उपकरण सब्सिडी ३ साल में एक बार मान्य।"
            }
        },
        "benefits": {
            "en": [
                "Drastic reduction in manual labor costs and timely land preparation",
                "High preference for women farmers, Scheduled Caste (SC) and Scheduled Tribe (ST) applicants (up to 50% subsidy)",
                "Option to create Custom Hiring Center (CHC) to rent machinery to neighbouring village farmers"
            ],
            "mr": [
                "मजुरी खर्चात मोठी बचत आणि वेळेत नांगरणी, पेरणी व मशागत",
                "महिला शेतकरी, अनुसूचित जाती (SC) व जमाती (ST) अर्जदारांना ५०% प्राधान्य अनुदान",
                "इतर शेतकऱ्यांना भाड्याने अवजारे देऊन कस्टम हायरिंग सेंटर (CHC) द्वारे व्यवसाय उभारण्याची संधी"
            ],
            "hi": [
                "मजदूरी खर्च में भारी कमी और समय पर जुताई, बुवाई व कटाई",
                "महिला किसानों, अनुसूचित जाति (SC) और जनजाति (ST) को ५०% तक वरीयता अनुदान",
                "उपकरण किराए पर देकर कस्टम हायरिंग सेंटर (CHC) से व्यवसाय शुरू करने का मौका"
            ]
        },
        "documents": {
            "en": ["7/12 & 8-A Extract", "Aadhaar Card", "Authorized Tractor Dealer Quotation", "Caste Certificate (if SC/ST)", "Driving License (if applying for Tractor)"],
            "mr": ["७/१२ व ८-अ उतारा", "आधार कार्ड", "मान्यताप्राप्त विक्रेत्याचे कोटेशन", "जात प्रमाणपत्र (SC/ST असल्यास)", "वाहन चालक परवाना (ट्रॅक्टरसाठी)"],
            "hi": ["७/१२ एवं ८-अ भूलेख", "आधार कार्ड", "अधिकृत डीलर का कोटेशन", "जाति प्रमाण पत्र (यदि लागू हो)", "ड्राइविंग लाइसेंस (ट्रैक्टर हेतु)"]
        },
        "apply_url": "https://mahadbt.maharashtra.gov.in",
        "portal_name": "MahaDBT Mechanization Module",
        "offline_contact": "Taluka Agriculture Officer / District Mechanization Officer"
    },
    {
        "id": "dr-ambedkar-krishi-swavalamban",
        "name": {
            "en": "Dr. Babasaheb Ambedkar Krishi Swavalamban Yojana",
            "mr": "डॉ. बाबासाहेब आंबेडकर कृषी स्वावलंबन योजना (SC शेतकऱ्यांसाठी)",
            "hi": "डॉ. बाबासाहेब आंबेडकर कृषि स्वावलंबन योजना"
        },
        "tagline": {
            "en": "100% financial assistance up to ₹2.5 Lakhs for new well digging, in-well boring, pump set, and solar connectivity for SC farmers.",
            "mr": "अनुसूचित जाती (SC) शेतकऱ्यांसाठी नवीन विहिरीसाठी ₹२.५ लाख आणि सौर/विद्युत पंपासाठी १००% अनुदान!",
            "hi": "अनुसूचित जाति के किसानों के लिए नए कुएं हेतु ₹२.५ लाख और सिंचाई पंप सेट हेतु १००% वित्तीय सहायता!"
        },
        "category": "special",
        "level": "Maharashtra State",
        "subsidy_amount": {
            "en": "Up to ₹2,50,000 for New Well / 100% Grant on Pump",
            "mr": "नवीन विहिरीसाठी ₹२,५०,००० / पंप व सौर पॅनेलवर १००% अनुदान",
            "hi": "नए कुएं हेतु ₹२,५०,००० / पंप और सौर पैनल पर १००% अनुदान"
        },
        "eligibility": {
            "max_land_acres": 15,
            "categories": ["SC", "NAVABOUDDHA"],
            "water_source_required": False,
            "farmer_types": ["SC / Navabouddha Category Farmers (0.40 Ha to 6 Ha land)"],
            "criteria_summary": {
                "en": "Farmer must belong to Scheduled Caste (SC) or Neo-Buddhist community, own between 0.40 to 6.00 hectares of land, and have annual income below ₹1.50 Lakhs.",
                "mr": "शेतकरी अनुसूचित जाती (SC) किंवा नवबौद्ध प्रवर्गातील असावा, जमीन ०.४० ते ६ हेक्टर दरम्यान व वार्षिक उत्पन्न ₹१.५० लाखांच्या आत असावे.",
                "hi": "किसान अनुसूचित जाति या नवबौद्ध वर्ग का हो, भूमि ०.४० से ६ हेक्टेयर के बीच और वार्षिक आय ₹१.५० लाख से कम हो।"
            }
        },
        "benefits": {
            "en": [
                "₹2,50,000 for new dug well construction",
                "₹25,000 for electric pump set or high-efficiency solar pump set",
                "₹50,000 for drip irrigation or farm pond plastic lining"
            ],
            "mr": [
                "नवीन विहीर खोदकामासाठी ₹२,५०,००० चे संपूर्ण सरकारी अर्थसहाय्य",
                "विद्युत पंप किंवा सौर पंपासाठी ₹२५,००० चे अनुदान",
                "ठिबक सिंचन किंवा शेततळे अस्तरीकरणासाठी ₹५०,००० अतिरिक्त अनुदान"
            ],
            "hi": [
                "नया कुआं खोदने हेतु ₹२,५०,००० की पूर्ण सरकारी सहायता",
                "इलेक्ट्रिक पंप या सोलर पंप सेट हेतु ₹२५,००० की सब्सिडी",
                "ड्रिप सिंचाई या तालाब प्लास्टिक अस्तर हेतु ₹५०,००० अतिरिक्त"
            ]
        },
        "documents": {
            "en": ["Caste Certificate (सक्षम प्राधिकाऱ्याचे जात प्रमाणपत्र)", "Annual Income Certificate (< ₹1.5 Lakhs)", "7/12 & 8-A Extract", "Aadhaar Card", "Bank Passbook"],
            "mr": ["सक्षम अधिकाऱ्याचे जात प्रमाणपत्र", "तहसीलदारांचा उत्पन्नाचा दाखला (₹१.५० लाखांपेक्षा कमी)", "७/१२ व ८-अ उतारा", "आधार कार्ड", "बँक पासबुक"],
            "hi": ["सक्षम प्राधिकारी का जाति प्रमाण पत्र", "तहसीलदार द्वारा आय प्रमाण पत्र (१.५० लाख से कम)", "७/१२ एवं ८-अ खतौनी", "आधार कार्ड", "बैंक पासबुक"]
        },
        "apply_url": "https://mahadbt.maharashtra.gov.in",
        "portal_name": "MahaDBT Special Component Portal",
        "offline_contact": "Social Welfare Office / Taluka Agriculture Officer"
    },
    {
        "id": "gopinath-munde-apghat-vima",
        "name": {
            "en": "Gopinath Munde Shetkari Apghat Suraksha Sanugrah Anudan",
            "mr": "गोपीनाथ मुंडे शेतकरी अपघात सुरक्षा सानुग्रह अनुदान योजना",
            "hi": "गोपीनाथ मुंडे किसान दुर्घटना बीमा योजना"
        },
        "tagline": {
            "en": "Financial assistance of ₹2,00,000 to farmer's family in case of accidental death or permanent disability.",
            "mr": "शेतातील कामादरम्यान अपघात, वीज पडणे किंवा सर्पदंशामुळे मृत्यू अथवा अपंगत्व आल्यास कुटुंबास ₹२ लाखांची मदत.",
            "hi": "खेती के दौरान दुर्घटना, आकाशीय बिजली या सर्पदंश से मृत्यु या स्थायी दिव्यांगता पर परिवार को ₹२ लाख की सहायता।"
        },
        "category": "insurance",
        "level": "Maharashtra State",
        "subsidy_amount": {
            "en": "₹2,00,000 (Accidental Death / Double Limb Loss) / ₹1,00,000 (Single Limb)",
            "mr": "₹२,००,००० (अपघाती मृत्यू / दोन अवयव निकामी) / ₹१,००,००० (एक अवयव)",
            "hi": "₹२,००,००० (दुर्घटना में मृत्यु / दो अंग हानि) / ₹१,००,००० (एक अंग हानि)"
        },
        "eligibility": {
            "max_land_acres": None,
            "categories": ["ALL"],
            "water_source_required": False,
            "farmer_types": ["All Landholding Farmers in Maharashtra (Age 10 to 75 Years)"],
            "criteria_summary": {
                "en": "All registered 7/12 landholding farmers and their family members aged 10 to 75 years in Maharashtra.",
                "mr": "महाराष्ट्रातील ७/१२ वर नाव असलेले सर्व शेतकरी व त्यांच्या कुटुंबातील सदस्य (वय १० ते ७५ वर्षे).",
                "hi": "महाराष्ट्र में ७/१२ भूलेख धारक सभी किसान और उनके परिवार के सदस्य (आयु १० से ७५ वर्ष)।"
            }
        },
        "benefits": {
            "en": [
                "Zero premium cost for farmers — 100% funded by Maharashtra Government",
                "Covers road accidents, electric shock, snake/scorpion bite, drowning in well, and machinery accidents",
                "Direct transfer to nominee bank account within 30 days of claim submission"
            ],
            "mr": [
                "शेतकऱ्याला कोणताही हप्ता भरावा लागत नाही — संपूर्ण खर्च महाराष्ट्र सरकार करते",
                "रस्ता अपघात, विजेचा धक्का, सर्पदंश, विहिरीत बुडणे आणि शेती अवजारांच्या अपघातांचा समावेश",
                "दावा सादर केल्यावर ३० दिवसांत वारसदाराच्या बँक खात्यात थेट रक्कम जमा"
            ],
            "hi": [
                "किसानों के लिए कोई प्रीमियम नहीं — पूरा खर्च महाराष्ट्र सरकार वहन करती है",
                "सड़क दुर्घटना, करंट लगना, सर्पदंश, कुएं में डूबना और कृषि यंत्र दुर्घटनाएं शामिल",
                "दावा प्रस्तुत करने के ३० दिनों के भीतर नामित वारिस के बैंक खाते में सीधा भुगतान"
            ]
        },
        "documents": {
            "en": ["Police FIR / Panchanama (एफआयआर व घटना पंचनामा)", "Post-Mortem Report / Disability Certificate", "7/12 Extract of Deceased / Injured", "Nominee Aadhaar & Bank Passbook", "Death Certificate"],
            "mr": ["पोलीस एफआयआर व घटना पंचनामा", "शवविच्छेदन (Post-Mortem) अहवाल / अपंगत्व प्रमाणपत्र", "अपघातग्रस्त व्यक्तीचा ७/१२ उतारा", "वारसदाराचे आधार कार्ड व बँक पासबुक", "मृत्यू दाखला"],
            "hi": ["पुलिस एफआईआर व घटनास्थल पंचनामा", "पोस्टमार्टम रिपोर्ट / दिव्यांगता प्रमाण पत्र", "पीड़ित का ७/१२ भूलेख", "वारिस का आधार कार्ड व बैंक पासबुक", "मृत्यु प्रमाण पत्र"]
        },
        "apply_url": "https://krishi.maharashtra.gov.in",
        "portal_name": "Maharashtra Department of Agriculture",
        "offline_contact": "Taluka Krushi Adhikari (Within 30 days of incident)"
    }
]

def get_all_schemes():
    return GOVERNMENT_SCHEMES

def filter_eligible_schemes(land_acres=None, category="ALL", needs=None):
    """
    Filters schemes matching farmer's landholding, social category, and needs.
    """
    needs = [str(n).lower() for n in (needs or [])]
    category = (category or "ALL").upper()
    
    results = []
    for s in GOVERNMENT_SCHEMES:
        # 1. Land constraint
        max_land = s["eligibility"]["max_land_acres"]
        if land_acres is not None and max_land is not None:
            try:
                if float(land_acres) > float(max_land):
                    continue
            except (ValueError, TypeError):
                pass

        # 2. Social category constraint
        allowed_cats = s["eligibility"]["categories"]
        if "ALL" not in allowed_cats and category not in allowed_cats and category != "ALL":
            continue

        # 3. Needs matching boost
        cat = s["category"]
        is_direct_match = False
        if "all" in needs or not needs:
            is_direct_match = True
        else:
            if "solar" in needs and cat == "solar":
                is_direct_match = True
            elif any(k in needs for k in ["irrigation", "drip", "pond", "water"]) and cat == "irrigation":
                is_direct_match = True
            elif any(k in needs for k in ["income", "money", "kisan", "financial"]) and cat == "financial":
                is_direct_match = True
            elif any(k in needs for k in ["insurance", "loss", "bima", "calamity"]) and cat == "insurance":
                is_direct_match = True
            elif any(k in needs for k in ["tractor", "machinery", "equipment", "mechanization"]) and cat == "machinery":
                is_direct_match = True
            elif "special" in needs and cat == "special":
                is_direct_match = True

        results.append({
            **s,
            "direct_match": is_direct_match
        })

    results.sort(key=lambda x: x["direct_match"], reverse=True)
    return results
