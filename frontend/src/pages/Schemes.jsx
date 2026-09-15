import { useState, useEffect } from "react";
import {
  Landmark,
  Search,
  CheckCircle2,
  ExternalLink,
  Share2,
  FileText,
  Filter,
  Sparkles,
  ChevronRight,
  SunMedium,
  Droplets,
  Tractor,
  ShieldCheck,
  Coins,
  Building2,
  Info,
  CheckSquare,
  HelpCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { API_BASE_URL, buildApiUrl } from "../utils/apiConfig";
import { openWhatsAppShare, formatSchemeShareText } from "../utils/whatsappShare";

export default function Schemes({ nav }) {
  const { language, user } = useApp();

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 3-Step Wizard State
  const [wizardOpen, setWizardOpen] = useState(true);
  const [landAcres, setLandAcres] = useState("2");
  const [farmerCategory, setFarmerCategory] = useState("ALL");
  const [selectedNeeds, setSelectedNeeds] = useState(["income", "solar"]);
  const [expandedSchemeId, setExpandedSchemeId] = useState(null);

  useEffect(() => {
    fetchSchemes();
  }, [landAcres, farmerCategory, selectedNeeds]);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const needsParam = selectedNeeds.join(",");
      const url = buildApiUrl(
        `/schemes?land_acres=${landAcres}&category=${farmerCategory}&needs=${needsParam}`
      );
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.success) {
        setSchemes(data.schemes || []);
      }
    } catch (err) {
      console.error("[Schemes Fetch Error]:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleNeed = (needKey) => {
    setSelectedNeeds((prev) =>
      prev.includes(needKey)
        ? prev.filter((k) => k !== needKey)
        : [...prev, needKey]
    );
  };

  const toggleExpandScheme = (id) => {
    setExpandedSchemeId((prev) => (prev === id ? null : id));
  };

  const handleWhatsAppShare = (scheme) => {
    const name = scheme.name?.[language] || scheme.name?.en;
    const subsidy = scheme.subsidy_amount?.[language] || scheme.subsidy_amount?.en;
    const benefits = scheme.benefits?.[language] || scheme.benefits?.en || [];
    const documents = scheme.documents?.[language] || scheme.documents?.en || [];

    const text = formatSchemeShareText({
      name,
      subsidy,
      benefits,
      documents,
      applyUrl: scheme.apply_url,
      lang: language,
    });

    openWhatsAppShare(text);
  };

  // Filter schemes by category tab and search query
  const filteredSchemes = schemes.filter((s) => {
    const matchesCategory =
      selectedCategory === "all" || s.category === selectedCategory;

    const nameStr = (
      (s.name?.en || "") +
      " " +
      (s.name?.mr || "") +
      " " +
      (s.name?.hi || "")
    ).toLowerCase();

    const matchesSearch =
      !searchQuery || nameStr.includes(searchQuery.toLowerCase().trim());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] p-6 text-white shadow-xl shadow-blue-900/10 dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#1E3A8A]">
        <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Landmark className="h-3.5 w-3.5 text-blue-200" />
              <span>
                {language === "mr"
                  ? "महाराष्ट्र व केंद्र शासन कृषी योजना पोर्टल"
                  : language === "hi"
                  ? "महाराष्ट्र एवं केंद्र सरकार कृषि योजना पोर्टल"
                  : "Maharashtra & Central Govt Agricultural Subsidies"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {language === "mr"
                ? "🏛️ शासकीय योजना व महाडीबीटी (Govt Schemes)"
                : language === "hi"
                ? "🏛️ सरकारी योजनाएं एवं महाडीबीटी (Govt Schemes)"
                : "🏛️ Government Schemes & MahaDBT"}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl leading-relaxed">
              {language === "mr"
                ? "पीएम-किसान (₹६,०००), नमो शेतकरी (₹६,०००), पीएम-कुसुम सौर कृषी पंप (९५% अनुदान), ₹१ पीक विमा आणि महाडीबीटी ठिबक अनुदानासाठी ३-सोप्या पायऱ्यांत पात्रता तपासा व थेट अर्ज करा."
                : language === "hi"
                ? "पीएम-किसान (₹६,०००), नमो शेतकारी (₹६,०००), कुसुम सोलर पंप (९५% सब्सिडी), ₹१ फसल बीमा एवं महाडीबीटी ड्रिप सब्सिडी हेतु पात्रता जांचें और सीधे आवेदन करें।"
                : "Check 100% eligibility for PM-Kisan (₹6k), Namo Shetkari (₹6k), PM-KUSUM Solar Pumps (95% subsidy), PMFBY ₹1 Crop Insurance, and MahaDBT micro-irrigation."}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => nav("plant-doctor")}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-white/20 hover:bg-white/30 border border-white/25 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition-all cursor-pointer shadow-xs"
            >
              <span>🌿 {language === "mr" ? "पीक डॉक्टर" : language === "hi" ? "फसल डॉक्टर" : "Plant Doctor"}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3-STEP INTERACTIVE ELIGIBILITY WIZARD */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-[#20432B] dark:bg-[#122317]">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-900 dark:text-gray-100">
                {language === "mr"
                  ? "३-पायऱ्यांचे पात्रता कॅल्क्युलेटर (Eligibility Matcher)"
                  : language === "hi"
                  ? "३-चरणीय पात्रता कैलकुलेटर (Eligibility Matcher)"
                  : "3-Step Instant Eligibility Matcher"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === "mr"
                  ? "आपल्या शेतीनुसार अचूक योजना व अनुदान शोधण्यासाठी खालील पर्याय निवडा."
                  : language === "hi"
                  ? "अपनी जोत एवं आवश्यकताओं के आधार पर पात्र योजनाएं खोजें।"
                  : "Customize parameters to discover exact subsidies matching your farm."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setWizardOpen(!wizardOpen)}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>
              {wizardOpen
                ? language === "mr"
                  ? "लपवा"
                  : language === "hi"
                  ? "छिपाएं"
                  : "Collapse"
                : language === "mr"
                ? "दाखवा"
                : language === "hi"
                ? "दिखाएं"
                : "Expand"}
            </span>
            {wizardOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {wizardOpen && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
            {/* STEP 1: LAND HOLDING */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px]">
                  1
                </span>
                {language === "mr"
                  ? "शेतजमीन क्षेत्र (Landholding):"
                  : language === "hi"
                  ? "जमीन का रकबा (Landholding):"
                  : "Farmland Acreage:"}
              </label>

              <div className="space-y-1.5">
                {[
                  {
                    val: "1.5",
                    labelMr: "अल्पभूधारक (< २.५ एकर / Small)",
                    labelHi: "सीमांत व छोटे किसान (< २.५ एकड़)",
                    labelEn: "< 2.5 Acres (Small & Marginal)",
                  },
                  {
                    val: "4",
                    labelMr: "मध्यम शेतकरी (२.५ ते ५ एकर / Medium)",
                    labelHi: "मध्यम किसान (२.५ से ५ एकड़)",
                    labelEn: "2.5 to 5 Acres (Medium)",
                  },
                  {
                    val: "8",
                    labelMr: "मोठे शेतकरी (> ५ एकर / Large)",
                    labelHi: "बड़े किसान (> ५ एकड़)",
                    labelEn: "> 5 Acres (Large Landholder)",
                  },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setLandAcres(item.val)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      landAcres === item.val
                        ? "border-blue-600 bg-blue-50 text-blue-900 font-bold dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300 ring-1 ring-blue-500"
                        : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-gray-50/50 dark:bg-black/20 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {language === "mr" ? item.labelMr : language === "hi" ? item.labelHi : item.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 2: FARMER CATEGORY */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px]">
                  2
                </span>
                {language === "mr"
                  ? "सामाजिक प्रवर्ग (Social Category):"
                  : language === "hi"
                  ? "सामाजिक वर्ग (Social Category):"
                  : "Farmer Category:"}
              </label>

              <div className="space-y-1.5">
                {[
                  {
                    key: "ALL",
                    labelMr: "सर्वसाधारण / खुला प्रवर्ग (General/All)",
                    labelHi: "सामान्य / सभी वर्ग (General/All)",
                    labelEn: "General / All Categories",
                  },
                  {
                    key: "SC",
                    labelMr: "अनुसूचित जाती (SC / नवबौद्ध - ९५% अनुदान)",
                    labelHi: "अनुसूचित जाति (SC - ९५% अनुदान)",
                    labelEn: "SC (Dr. Ambedkar Yojana 95-100%)",
                  },
                  {
                    key: "ST",
                    labelMr: "अनुसूचित जमाती (ST / बिरसा मुंडा)",
                    labelHi: "अनुसूचित जनजाति (ST / बिरसा मुंडा)",
                    labelEn: "ST (Tribal / 95-100% Grant)",
                  },
                  {
                    key: "WOMEN",
                    labelMr: "महिला शेतकरी (Women Farmer - ५०% अवजारे)",
                    labelHi: "महिला किसान (Women Farmer - ५०% प्राथमिकता)",
                    labelEn: "Women Farmer (Priority 50%)",
                  },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setFarmerCategory(cat.key)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      farmerCategory === cat.key
                        ? "border-blue-600 bg-blue-50 text-blue-900 font-bold dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300 ring-1 ring-blue-500"
                        : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-gray-50/50 dark:bg-black/20 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {language === "mr" ? cat.labelMr : language === "hi" ? cat.labelHi : cat.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 3: FARM NEEDS */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px]">
                  3
                </span>
                {language === "mr"
                  ? "प्राधान्य आवश्यकता (Farm Needs):"
                  : language === "hi"
                  ? "प्राथमिक आवश्यकताएं (Farm Needs):"
                  : "Select Priority Needs:"}
              </label>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "income", labelMr: "थेट पैसे (PM-Kisan)", labelHi: "सीधी आय (PM-Kisan)", labelEn: "Direct Income (PM-Kisan)", icon: Coins },
                  { key: "solar", labelMr: "सौर कृषी पंप", labelHi: "सौर कृषि पंप", labelEn: "Solar Agri Pump", icon: SunMedium },
                  { key: "irrigation", labelMr: "ठिबक / शेततळे", labelHi: "ड्रिप / खेत तालाब", labelEn: "Drip / Farm Pond", icon: Droplets },
                  { key: "machinery", labelMr: "ट्रॅक्टर / अवजारे", labelHi: "ट्रैक्टर / कृषि यंत्र", labelEn: "Tractor / Machinery", icon: Tractor },
                  { key: "insurance", labelMr: "₹१ पीक विमा", labelHi: "₹१ फसल बीमा", labelEn: "₹1 Crop Insurance", icon: ShieldCheck },
                  { key: "special", labelMr: "विहीर / बोरिंग", labelHi: "कुआं / बोरवेल", labelEn: "Well / Borewell", icon: Building2 },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedNeeds.includes(item.key);
                  const label = language === "mr" ? item.labelMr : language === "hi" ? item.labelHi : item.labelEn;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => toggleNeed(item.key)}
                      className={`flex items-center gap-1.5 p-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 text-blue-900 dark:border-blue-400 dark:bg-blue-950/60 dark:text-blue-300 shadow-xs"
                          : "border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SEARCH AND CATEGORY FILTER TABS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* CATEGORY TABS */}
        <div className="flex items-center overflow-x-auto w-full sm:w-auto rounded-2xl bg-gray-100 dark:bg-gray-800/80 p-1 border border-gray-200 dark:border-gray-700">
          {[
            { id: "all", labelMr: "सर्व योजना", labelHi: "सभी योजनाएं", labelEn: "All Schemes" },
            { id: "financial", labelMr: "थेट आर्थिक मदत", labelHi: "प्रत्यक्ष वित्तीय सहायता", labelEn: "Financial" },
            { id: "solar", labelMr: "सौर ऊर्जा", labelHi: "सौर ऊर्जा", labelEn: "Solar Pump" },
            { id: "irrigation", labelMr: "सिंचन व शेततळे", labelHi: "सिंचाई एवं खेत तालाब", labelEn: "Irrigation" },
            { id: "machinery", labelMr: "कृषी यांत्रिकीकरण", labelHi: "कृषि यंत्रीकरण", labelEn: "Machinery" },
            { id: "insurance", labelMr: "पीक विमा", labelHi: "फसल बीमा", labelEn: "Insurance" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === tab.id
                  ? "bg-[#1D4ED8] text-white shadow-xs"
                  : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
              }`}
            >
              {language === "mr" ? tab.labelMr : language === "hi" ? tab.labelHi : tab.labelEn}
            </button>
          ))}
        </div>

        {/* SEARCH BOX */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === "mr"
                ? "योजनेचे नाव शोधा (उदा. कुसुम, नमो, ठिबक)..."
                : language === "hi"
                ? "योजना का नाम खोजें (उदा. कुसुम, नमो, ड्रिप)..."
                : "Search schemes (e.g. Kusum, Namo)..."
            }
            className="w-full pl-9 pr-3 py-2 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#122317] text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* SCHEMES LISTING GRID */}
      {loading ? (
        <div className="py-12 text-center text-xs text-gray-500">
          {language === "mr"
            ? "शासकीय योजना लोड होत आहेत..."
            : language === "hi"
            ? "सरकारी योजनाएं लोड हो रही हैं..."
            : "Loading schemes..."}
        </div>
      ) : filteredSchemes.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 p-8 text-center text-xs text-gray-500 bg-white dark:bg-[#122317]">
          {language === "mr"
            ? "कोणतीही जुळणारी योजना आढळली नाही. कृपया शोध शब्द बदला."
            : language === "hi"
            ? "कोई योजना नहीं मिली। कृपया अन्य शब्द खोजें।"
            : "No matching schemes found. Please broaden your search criteria."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSchemes.map((scheme) => {
            const isExpanded = expandedSchemeId === scheme.id;
            const name = scheme.name?.[language] || scheme.name?.en;
            const tagline = scheme.tagline?.[language] || scheme.tagline?.en;
            const subsidy = scheme.subsidy_amount?.[language] || scheme.subsidy_amount?.en;
            const benefits = scheme.benefits?.[language] || scheme.benefits?.en || [];
            const documents = scheme.documents?.[language] || scheme.documents?.en || [];

            return (
              <div
                key={scheme.id}
                className={`flex flex-col justify-between rounded-3xl border transition-all duration-200 bg-white dark:bg-[#122317] p-5 shadow-xs ${
                  scheme.direct_match
                    ? "border-blue-200 dark:border-blue-900/60 ring-1 ring-blue-500/20"
                    : "border-gray-200/80 dark:border-gray-800"
                }`}
              >
                <div>
                  {/* TOP HEADER: BADGES */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {scheme.level === "Central"
                        ? language === "mr"
                          ? "🏛️ केंद्र शासन"
                          : language === "hi"
                          ? "🏛️ केंद्र सरकार"
                          : "🏛️ Central Govt"
                        : language === "mr"
                        ? "🚩 महाराष्ट्र शासन"
                        : language === "hi"
                        ? "🚩 महाराष्ट्र सरकार"
                        : "🚩 Maharashtra State"}
                    </span>

                    {scheme.direct_match && (
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {language === "mr"
                          ? "१००% पात्र"
                          : language === "hi"
                          ? "१००% पात्र"
                          : "100% Eligible"}
                      </span>
                    )}
                  </div>

                  {/* SCHEME NAME & SUBSIDY */}
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-gray-100 leading-snug">
                    {name}
                  </h3>

                  <div className="mt-1.5 inline-block rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200 dark:border-amber-800/60 px-3 py-1 text-xs font-black text-amber-800 dark:text-amber-300">
                    💰 {subsidy}
                  </div>

                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {tagline}
                  </p>

                  {/* BENEFITS BULLETS */}
                  <div className="mt-3.5 space-y-1.5 border-t border-gray-100 dark:border-gray-800 pt-3">
                    <div className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
                      ⭐{" "}
                      {language === "mr"
                        ? "मुख्य लाभ (Key Benefits):"
                        : language === "hi"
                        ? "मुख्य लाभ (Key Benefits):"
                        : "Key Benefits:"}
                    </div>
                    {benefits.slice(0, 2).map((ben, idx) => (
                      <div
                        key={idx}
                        className="text-[11px] text-gray-600 dark:text-gray-400 flex items-start gap-1.5"
                      >
                        <span className="text-green-600 dark:text-green-400 font-bold">•</span>
                        <span>{ben}</span>
                      </div>
                    ))}
                  </div>

                  {/* EXPANDABLE DOCUMENTS & CRITERIA ACCORDION */}
                  {isExpanded && (
                    <div className="mt-4 rounded-2xl bg-gray-50 dark:bg-black/30 p-3.5 border border-gray-200/80 dark:border-gray-800 text-xs space-y-3 animate-fade-in">
                      <div>
                        <div className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1 mb-1">
                          <FileText className="h-3.5 w-3.5 text-blue-600" />
                          <span>
                            {language === "mr"
                              ? "आवश्यक कागदपत्रे (Required Documents):"
                              : language === "hi"
                              ? "आवश्यक दस्तावेज (Required Documents):"
                              : "Required Documents:"}
                          </span>
                        </div>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-0.5 text-[11px]">
                          {documents.map((doc, dIdx) => (
                            <li key={dIdx}>{doc}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700/60 text-[11px] text-gray-500">
                        <strong>
                          {language === "mr"
                            ? "ऑफलाइन संपर्क:"
                            : language === "hi"
                            ? "ऑफलाइन संपर्क:"
                            : "Offline Contact:"}
                        </strong>{" "}
                        {scheme.offline_contact}
                      </div>
                    </div>
                  )}
                </div>

                {/* BOTTOM ACTION BUTTONS */}
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => toggleExpandScheme(scheme.id)}
                    className="text-xs font-bold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 flex items-center gap-1 cursor-pointer"
                  >
                    <span>
                      {isExpanded
                        ? language === "mr"
                          ? "कागदपत्रे लपवा"
                          : language === "hi"
                          ? "दस्तावेज छिपाएं"
                          : "Hide Documents"
                        : language === "mr"
                        ? "कागदपत्रे तपासा"
                        : language === "hi"
                        ? "दस्तावेज देखें"
                        : "Required Docs"}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleWhatsAppShare(scheme)}
                      className="inline-flex items-center gap-1 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white px-3 py-1.5 text-xs font-bold transition-all shadow-xs cursor-pointer"
                      title="Share scheme details on WhatsApp"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>
                        {language === "mr"
                          ? "शेअर"
                          : language === "hi"
                          ? "शेयर"
                          : "Share"}
                      </span>
                    </button>

                    <a
                      href={scheme.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <span>
                        {language === "mr"
                          ? "थेट अर्ज करा"
                          : language === "hi"
                          ? "सीधे आवेदन करें"
                          : "Apply Online"}
                      </span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
