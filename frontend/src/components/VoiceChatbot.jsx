import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Mic,
  MicOff,
  Send,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Trash2,
  Minimize2,
  Maximize2,
  Compass,
  ArrowRight,
  Radio,
  RotateCcw,
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  CheckCircle2,
  Square,
  ExternalLink,
  Sun,
  Moon,
  Camera,
  Image,
  Share2,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useVoiceInput } from "../hooks/useVoiceInput";
import { buildApiUrl } from "../utils/apiConfig";
import { openWhatsAppShare } from "../utils/whatsappShare";

/* =========================================================
   LIGHTWEIGHT CLEAN MARKDOWN & BULLET FORMATTER
   ========================================================= */
function FormattedMessage({ content, isUser }) {
  if (!content) return null;

  const sanitized = content.replace(/\[\[ACTION:[^\]]+\]\]/gi, "").trim();
  const lines = sanitized.split("\n");

  const parseInline = (str) => {
    const parts = str.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, pIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={pIdx} className={`font-bold ${isUser ? "text-white" : "text-gray-900 dark:text-white"}`}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={pIdx} className={`italic ${isUser ? "text-green-100" : "text-gray-700 dark:text-gray-300"}`}>
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-1.5 leading-relaxed text-xs">
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lIdx} className="h-1" />;
        }

        const isBullet =
          trimmed.startsWith("•") ||
          trimmed.startsWith("- ") ||
          trimmed.startsWith("* ");
        const bulletText = isBullet ? trimmed.replace(/^[•\-\*]\s*/, "") : trimmed;

        if (isBullet) {
          return (
            <div key={lIdx} className="flex items-start gap-1.5 pl-1">
              <span className={`font-bold mt-0.5 ${isUser ? "text-green-200" : "text-[#2E7D32] dark:text-emerald-400"}`}>
                •
              </span>
              <span className="flex-1">{parseInline(bulletText)}</span>
            </div>
          );
        }

        return (
          <p key={lIdx} className={isUser ? "text-white" : "text-gray-800 dark:text-gray-200"}>
            {parseInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

/* =========================================================
   INTERACTIVE LIVE WEATHER WIDGET CARD
   ========================================================= */
function LiveWeatherCard({ card, nav, language }) {
  if (!card) return null;

  const isRain = card.condition_type === "rain";
  const isHot = card.condition_type === "hot";

  return (
    <div
      className={`mt-3 overflow-hidden rounded-2xl border shadow-md transition-all duration-300 ${
        isRain
          ? "bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white border-blue-400/40"
          : isHot
          ? "bg-gradient-to-br from-amber-950 via-slate-900 to-orange-950 text-white border-amber-400/40"
          : "bg-gradient-to-br from-[#0B2613] via-[#0E2015] to-[#07170D] text-white border-emerald-500/40"
      }`}
    >
      <div className="p-3.5 pb-3">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-xs text-xs">
              📍
            </span>
            <h4 className="text-xs sm:text-sm font-black truncate text-white">
              {card.city}
            </h4>
          </div>
          <span className="shrink-0 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE ⚡</span>
          </span>
        </div>

        {/* Big Temperature & Animated Icon */}
        <div className="flex items-center justify-between mt-2.5">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-sm">
                {card.temp}°
              </span>
              <span className="text-sm font-bold text-white/70">C</span>
            </div>
            <p className="text-[11px] font-medium text-white/80 mt-0.5">
              {card.description} • {language === "mr" ? "भासणारे तापमान" : language === "hi" ? "महसूस" : "Feels like"} {card.feels_like}°C
            </p>
          </div>

          <div className="text-4xl animate-bounce [animation-duration:3s]">
            {isRain ? "🌧️" : isHot ? "☀️" : card.cloudiness > 60 ? "⛅" : "🌤️"}
          </div>
        </div>

        {/* Weather Metrics Grid */}
        <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-white/10 text-center">
          <div className="bg-white/10 rounded-xl p-1.5 backdrop-blur-xs">
            <span className="text-[9px] text-white/70 block">
              💧 {language === "mr" ? "आर्द्रता" : language === "hi" ? "नमी" : "Humidity"}
            </span>
            <span className="text-xs font-bold text-white">{card.humidity}%</span>
          </div>
          <div className="bg-white/10 rounded-xl p-1.5 backdrop-blur-xs">
            <span className="text-[9px] text-white/70 block">
              💨 {language === "mr" ? "वारा" : language === "hi" ? "वायु" : "Wind"}
            </span>
            <span className="text-xs font-bold text-white">{card.wind_speed} km/h</span>
          </div>
          <div className="bg-white/10 rounded-xl p-1.5 backdrop-blur-xs">
            <span className="text-[9px] text-white/70 block">
              🌧️ {language === "mr" ? "पाऊस" : language === "hi" ? "वर्षा" : "Rain"}
            </span>
            <span className="text-xs font-bold text-white">{card.rain || 0} mm</span>
          </div>
        </div>

        {/* Agricultural Advisory Callout */}
        {card.advice && (
          <div className="mt-2.5 rounded-xl bg-black/30 p-2 text-[11px] leading-snug text-emerald-200 border border-emerald-500/20">
            🌱 <strong className="text-white font-bold">{language === "mr" ? "शेती सल्ला:" : language === "hi" ? "कृषि सुझाव:" : "Agronomic Tip:"}</strong>{" "}
            {card.advice.replace(/[*_#]/g, "")}
          </div>
        )}

        {/* 1-Click Action to 5-Day Radar */}
        {nav && (
          <button
            type="button"
            onClick={() => nav("weather")}
            className="w-full mt-2.5 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold transition backdrop-blur-xs cursor-pointer border border-white/10 active:scale-[0.98]"
          >
            <span>{language === "mr" ? "५ दिवसांचा सविस्तर हवामान अंदाज पहा 🌦️" : language === "hi" ? "५ दिवसीय विस्तृत मौसम देखें 🌦️" : "View 5-Day Detailed Radar 🌦️"}</span>
            <ArrowRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function VoiceChatbot({ nav, openInstallModal }) {
  const { language, user, theme, changeTheme } = useApp();
  const isDark =
    theme === "dark" ||
    (theme === "auto" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(true); // Default to Voice mode
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [isAutoSpeak, setIsAutoSpeak] = useState(false); // Only speak on explicit voice interaction
  const [liveTranscript, setLiveTranscript] = useState("");
  const [attachedImage, setAttachedImage] = useState(null);
  const chatFileInputRef = useRef(null);

  const handleAttachImage = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setAttachedImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Determine farmer's city/district from user profile or local storage
  const farmerDistrict =
    user?.district ||
    (typeof window !== "undefined"
      ? localStorage.getItem("krushimitra_selected_district") ||
        (() => {
          try {
            const w = localStorage.getItem("krushimitra_last_weather");
            if (w) {
              const parsed = JSON.parse(w);
              return parsed.city || parsed.district;
            }
          } catch (e) {}
          return "Pune";
        })()
      : "Pune");

  const initialGreeting =
    language === "mr"
      ? `नमस्कार शेतकरी बंधूंनो! 🙏 मी तुमचा कृषीमित्र AI सहाय्यक आहे.\n\nतुम्ही मला **"आज माझ्या शहरात हवामान कसे आहे?"**, पिकांवरील कीड, खते, बाजारभाव किंवा सरकारी योजनांबद्दल थेट बोलून विचारू शकता!`
      : language === "hi"
      ? `नमस्ते किसान भाइयों! 🙏 मैं आपका कृषि-मित्र AI सहायक हूँ।\n\nआप मुझसे **"आज मेरे शहर का मौसम कैसा है?"**, फसल रोग, खाद, मंडी भाव या सरकारी योजनाओं के बारे में सीधे बोलकर पूछ सकते हैं!`
      : `Hello farmer friends! 🙏 I am your KrushiMitra AI Assistant.\n\nYou can ask me aloud: **"Hey, what's today's weather of my city?"**, crop pests, fertilizer doses, mandi market prices, or government schemes!`;

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: initialGreeting,
      action: null,
      weather_card: null,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized && !isVoiceMode) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isVoiceMode]);

  // Voice Input Hook (Speech-to-Text)
  const { isListening, startListening, stopListening, isSupported } =
    useVoiceInput({
      onResult: (spokenText) => {
        if (spokenText) {
          setLiveTranscript(spokenText);
          setInput(spokenText);
          handleSendMessage(spokenText, true);
        }
      },
    });

  // Action Button Click Handler (Theme, Navigate, or Open Modal)
  const handleActionClick = (action) => {
    if (!action) return;
    if (action.type === "theme" && action.value) {
      if (changeTheme) {
        changeTheme(action.value);
      }
    } else if (action.type === "modal" && action.target === "install_modal") {
      if (openInstallModal) openInstallModal();
    } else if (action.type === "navigate" && action.page) {
      if (nav) {
        if (!user && !["landing", "login", "register", "forgot"].includes(action.page)) {
          nav("login");
        } else {
          nav(action.page);
        }
      }
    } else if (action.type === "url" && action.url) {
      window.open(action.url, "_blank", "noopener,noreferrer");
    }
  };

  // Text-to-Speech Functionality (TTS)
  const handleSpeak = (text, index = null) => {
    if (!("speechSynthesis" in window)) return;

    if (speakingIndex !== null) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      if (speakingIndex === index) return;
    }

    window.speechSynthesis.cancel();

    // Clean text for natural, friendly voice reading
    const cleanText = text
      .replace(/[*_#`~]/g, "")
      .replace(/🌱|🌿|🌾|🎋|🏛️|🧪|🍅|💡|🙏|✅|⚠️|❌|🚀|🌦️|📲|☀️|🌧️|💧|💨|💰|⚡/g, "")
      .replace(/\[\[ACTION:[^\]]+\]\]/gi, "")
      .replace(/https?:\/\/[^\s]+/g, "")
      .replace(/\n+/g, ". ");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === "mr" ? "mr-IN" : language === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = 0.95; // Friendly, clear cadence for farmers

    // Select the best matching native voice if available
    try {
      const voices = window.speechSynthesis.getVoices();
      const targetPrefix = language === "mr" ? "mr" : language === "hi" ? "hi" : "en";
      const matchedVoice = voices.find(
        (v) => v.lang && (v.lang.toLowerCase().startsWith(targetPrefix) || v.lang.toLowerCase().includes(targetPrefix))
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
    } catch (e) {}

    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(index !== null ? index : "active");
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
    }
  };

  const handleSendMessage = async (customMessage, isFromVoice = false) => {
    let textToSend = (customMessage || input).trim();
    if (!textToSend && !attachedImage) return;
    if (loading) return;

    if (!textToSend && attachedImage) {
      textToSend =
        language === "mr"
          ? "कृपया या पिकाच्या पानाची तपासणी करून कोणता रोग आहे व औषध काय फवारावे ते सांगा."
          : language === "hi"
          ? "कृपया इस पत्ते की जांच कर बताएं कि कौन सा रोग है और क्या दवा छिड़कें।"
          : "Please examine this crop leaf photo, diagnose the disease, and recommend spray dosages.";
    }

    const currentImage = attachedImage;
    setAttachedImage(null);

    const userMsg = {
      role: "user",
      content: textToSend,
      image: currentImage,
      action: null,
      weather_card: null,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setLiveTranscript(textToSend);

    try {
      const response = await fetch(buildApiUrl("/ai/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          language: language,
          history: messages.slice(-4),
          farmer_district: farmerDistrict,
          image_data: currentImage || "",
        }),
      });

      const data = await response.json();

      if (data.success && data.reply) {
        const cleanReply = (data.reply || "").replace(/\[\[ACTION:[^\]]+\]\]/gi, "").trim();
        const botMsg = {
          role: "assistant",
          content: cleanReply,
          action: data.action || null,
          weather_card: data.weather_card || null,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, botMsg]);

        // Speak aloud ONLY when user interacted via voice microphone (silent during text chat)
        if (isFromVoice) {
          handleSpeak(cleanReply, "active");
        }

        // Auto-execute Theme Change or Page Navigation
        if (data.action) {
          if (data.action.type === "theme") {
            handleActionClick(data.action);
          } else if (data.action.type === "navigate" && data.action.auto_navigate) {
            setTimeout(() => {
              handleActionClick(data.action);
            }, 600);
          }
        }
      } else {
        throw new Error(data.message || "Failed to get reply");
      }
    } catch (err) {
      console.warn("AI Chat offline, generating fallback response:", err);
      const queryLower = textToSend.toLowerCase();

      let offlineReply = "";
      let offlineAction = null;

      if (
        queryLower.includes("dark mode") ||
        queryLower.includes("dark theme") ||
        queryLower.includes("डार्क मोड") ||
        queryLower.includes("डार्क थीम") ||
        queryLower.includes("काळा मोड")
      ) {
        offlineReply =
          language === "mr"
            ? "🌙 **डार्क मोड सक्रिय केला आहे!** डोळ्यांना त्रास होणार नाही."
            : language === "hi"
            ? "🌙 **डार्क मोड सक्रिय किया गया!** आँखों के लिए आरामदायक।"
            : "🌙 **Dark Mode activated!** Easy on your eyes.";
        offlineAction = { type: "theme", value: "dark", label: "Dark Mode 🌙" };
        if (changeTheme) changeTheme("dark");
      } else if (
        queryLower.includes("light mode") ||
        queryLower.includes("light theme") ||
        queryLower.includes("व्हाइट मोड") ||
        queryLower.includes("लाइट मोड") ||
        queryLower.includes("लाइट थीम")
      ) {
        offlineReply =
          language === "mr"
            ? "☀️ **लाइट मोड सक्रिय केला आहे!**"
            : language === "hi"
            ? "☀️ **लाइट मोड सक्रिय किया गया!**"
            : "☀️ **Light Mode activated!**";
        offlineAction = { type: "theme", value: "light", label: "Light Mode ☀️" };
        if (changeTheme) changeTheme("light");
      } else if (
        queryLower.includes("recommend") ||
        queryLower.includes("recomend") ||
        queryLower.includes("शिफारस") ||
        queryLower.includes("सिफारिश")
      ) {
        offlineReply =
          language === "mr"
            ? "🌱 **पीक शिफारस (Crop Recommendation) विभाग उघडत आहे...**\n\nयेथे आपण माती परीक्षण घटक भरून योग्य पिकांची शिफारस मिळवू शकता."
            : language === "hi"
            ? "🌱 **फसल सिफारिश (Crop Recommendation) पेज पर ले जा रहे हैं...**\n\nयहाँ आप मिट्टी के पोषक तत्वों के आधार पर फसलों की सिफारिश पा सकते हैं।"
            : "🌱 **Navigating to Crop Recommendation page...**\n\nEnter soil N-P-K parameters to get customized crop suggestions.";
        offlineAction = {
          type: "navigate",
          page: "recommendation",
          label: language === "mr" ? "पीक शिफारस उघडा 🌱" : language === "hi" ? "फसल सिफारिश खोलें 🌱" : "Open Recommendation 🌱",
          auto_navigate: true,
        };
        setTimeout(() => {
          handleActionClick(offlineAction);
        }, 600);
      } else if (
        queryLower.includes("weather") ||
        queryLower.includes("हवामान") ||
        queryLower.includes("मौसम") ||
        queryLower.includes("rain") ||
        queryLower.includes("पाऊस")
      ) {
        offlineReply =
          language === "mr"
            ? `🌦️ **${farmerDistrict} हवामान व शेती अंदाज:**\n\nआपल्या ${farmerDistrict} जिल्ह्याचे थेट हवामान, पावसाची शक्यता आणि ५ दिवसांचा फवारणी अंदाज पाहण्यासाठी हवामान विभाग उघडा.`
            : language === "hi"
            ? `🌦️ **${farmerDistrict} मौसम पूर्वानुमान:**\n\nअपने ${farmerDistrict} जिले का लाइव मौसम और ५ दिवसीय पूर्वानुमान देखने हेतु मौसम पेज पर जाएं।`
            : `🌦️ **Weather Forecast for ${farmerDistrict}:**\n\nCheck live hourly weather and 5-day agro-climatic outlooks on the Weather page.`;
        offlineAction = {
          type: "navigate",
          page: "weather",
          label: language === "mr" ? "हवामान पहा 🌦️" : language === "hi" ? "मौसम देखें 🌦️" : "View Weather 🌦️",
          auto_navigate: true,
        };
        setTimeout(() => {
          handleActionClick(offlineAction);
        }, 600);
      } else if (
        queryLower.includes("rate") ||
        queryLower.includes("भाव") ||
        queryLower.includes("mandi") ||
        queryLower.includes("बाजारभाव")
      ) {
        offlineReply =
          language === "mr"
            ? "💰 **महाराष्ट्र बाजारभाव (APMC Rates):**\n\n• सोयाबीन: ₹४,४०० ते ₹४,८५०/क्विंटल (MSP: ₹४,८९२)\n• कापूस: ₹६,९०० ते ₹७,३५०/क्विंटल (MSP: ₹७,१२१)\n• कांदा: ₹१,४०० ते ₹२,४००/क्विंटल"
            : language === "hi"
            ? "💰 **मंडी भाव (APMC Rates):**\n\n• सोयाबीन: ₹४,४०० से ₹४,८५०/क्विंटल (MSP: ₹४,८९२)\n• कपास: ₹६,९०० से ₹७,३५०/क्विंटल (MSP: ₹७,१२१)\n• प्याज: ₹१,४०० से ₹२,४००/क्विंटल"
            : "💰 **Maharashtra APMC Mandi Rates:**\n\n• Soybean: ₹4,400 to ₹4,850/quintal (MSP: ₹4,892)\n• Cotton: ₹6,900 to ₹7,350/quintal (MSP: ₹7,121)\n• Onion: ₹1,400 to ₹2,400/quintal";
      } else if (
        queryLower.includes("predict") ||
        queryLower.includes("अंदाज") ||
        queryLower.includes("अनुमान") ||
        queryLower.includes("yield")
      ) {
        offlineReply =
          language === "mr"
            ? "🌾 **पीक अंदाज (Crop Yield Prediction) साधन:**\n\nआपण 'पीक अंदाज' विभागात जाऊन जिल्हा, हंगाम, क्षेत्रफळ आणि माती घटक भरून हेक्टरी उत्पन्नाचा अचूक अंदाज घेऊ शकता."
            : language === "hi"
            ? "🌾 **फसल पूर्वानुमान टूल:**\n\nआप 'फसल पूर्वानुमान' पेज पर जाकर जिला, मौसम, रकबा और पोषक तत्व दर्ज कर सटीक उपज का अनुमान पा सकते हैं।"
            : "🌾 **Crop Yield Prediction Tool:**\n\nNavigate to Yield Prediction to input district, season, area, and soil nutrients for AI-powered yield forecasting.";
        offlineAction = {
          type: "navigate",
          page: "prediction",
          label: language === "mr" ? "पीक अंदाज सुरू करा 🚀" : language === "hi" ? "फसल अनुमान शुरू करें 🚀" : "Open Crop Prediction 🚀",
          auto_navigate: true,
        };
        setTimeout(() => {
          handleActionClick(offlineAction);
        }, 600);
      } else if (
        queryLower.includes("doctor") ||
        queryLower.includes("रोग") ||
        queryLower.includes("फवारणी") ||
        queryLower.includes("कीड") ||
        queryLower.includes("disease") ||
        queryLower.includes("spray") ||
        queryLower.includes("बोंड अळी")
      ) {
        offlineReply =
          language === "mr"
            ? "🌿 **एआय पीक डॉक्टर विभाग उघडत आहे...**\n\nयेथे पानाचा फोटो अपलोड करा व रोगाचे निदान आणि पंपनिहाय फवारणीचे अचूक प्रमाण मिळवा."
            : language === "hi"
            ? "🌿 **एआई प्लांट डॉक्टर पेज पर ले जा रहे हैं...**\n\nयहाँ पत्ती की फोटो अपलोड करें और रोग निदान व स्प्रे पंप अनुसार सटीक खुराक पाएं।"
            : "🌿 **Navigating to AI Plant Doctor...**\n\nUpload leaf photos for instant disease diagnosis and exact spray pump dosages.";
        offlineAction = {
          type: "navigate",
          page: "plant-doctor",
          label: language === "mr" ? "पीक डॉक्टर उघडा 🌿" : language === "hi" ? "प्लांट डॉक्टर खोलें 🌿" : "Open Plant Doctor 🌿",
          auto_navigate: true,
        };
        setTimeout(() => {
          handleActionClick(offlineAction);
        }, 600);
      } else if (
        queryLower.includes("scheme") ||
        queryLower.includes("योजना") ||
        queryLower.includes("अनुदान") ||
        queryLower.includes("subsidy") ||
        queryLower.includes("mahadbt") ||
        queryLower.includes("pm kisan") ||
        queryLower.includes("पीएम किसान")
      ) {
        offlineReply =
          language === "mr"
            ? "🏛️ **शासकीय योजना व पात्रता तपासणी विभाग उघडत आहे...**\n\nयेथे पीएम-किसान, नमो शेतकरी, सौर पंप आणि महाडीबीटी योजनांची माहिती व अर्ज प्रक्रिया पहा."
            : language === "hi"
            ? "🏛️ **सरकारी योजना व पात्रता पेज पर ले जा रहे हैं...**\n\nयहाँ पीएम-किसान, नमो शेतकरी, सोलर पंप और महाडीबीटी योजनाओं की जानकारी व आवेदन लिंक देखें।"
            : "🏛️ **Navigating to Government Schemes & Eligibility Matcher...**\n\nCheck your eligibility for PM-Kisan, Namo Shetkari, PM-KUSUM, and MahaDBT subsidies.";
        offlineAction = {
          type: "navigate",
          page: "schemes",
          label: language === "mr" ? "शासकीय योजना पहा 🏛️" : language === "hi" ? "सरकारी योजनाएं देखें 🏛️" : "View Govt Schemes 🏛️",
          auto_navigate: true,
        };
        setTimeout(() => {
          handleActionClick(offlineAction);
        }, 600);
      } else {
        offlineReply =
          language === "mr"
            ? "🌱 **कृषीमित्र AI शेती सहाय्यक:**\n\nआपण मला हवामान, खत व्यवस्थापन, कीड नियंत्रण (कापूस बोंड अळी, सोयाबीन), बाजारभाव किंवा सरकारी योजनांबद्दल थेट विचारू शकता."
            : language === "hi"
            ? "🌱 **कृषि-मित्र AI कृषि सहायक:**\n\nआप मुझसे मौसम, खाद, कीट नियंत्रण (कपास सुंडी, सोयाबीन), मंडी भाव या सरकारी योजनाओं के बारे में पूछ सकते हैं।"
            : "🌱 **KrushiMitra AI Agronomy Assistant:**\n\nYou can ask about live weather, fertilizer dosage, crop diseases (cotton, soybean), mandi rates, or government schemes.";
      }

      const botMsg = {
        role: "assistant",
        content: offlineReply,
        action: offlineAction,
        weather_card: null,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);

      // Speak aloud ONLY when user interacted via voice microphone (silent during text chat)
      if (isFromVoice) {
        handleSpeak(offlineReply, "active");
      }
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    stopSpeaking();
    setMessages([
      {
        role: "assistant",
        content: initialGreeting,
        action: null,
        weather_card: null,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setLiveTranscript("");
  };

  // Quick spoken suggestion chips across all 3 languages
  const spokenPrompts =
    language === "mr"
      ? [
          { icon: "🌱", label: "पीक शिफारस उघडा", query: "पीक शिफारस पेजवर जा" },
          { icon: "🌙", label: "डार्क मोड", query: "डार्क मोड करा" },
          { icon: "☀️", label: "लाइट मोड", query: "लाइट मोड करा" },
          { icon: "🌦️", label: "आजचे हवामान", query: "आज माझ्या शहरात हवामान कसे आहे?" },
          { icon: "🐛", label: "कापूस बोंड अळी उपाय", query: "कापसावरील बोंड अळीसाठी काय उपाय करावेत?" },
          { icon: "💰", label: "सोयाबीन बाजारभाव", query: "सोयाबीनचा आजचा बाजारभाव काय आहे?" },
          { icon: "🌾", label: "पीक अंदाज घ्या", query: "पीक अंदाज पेजवर जा" },
          { icon: "🧪", label: "खत व माती सल्ला", query: "माती परीक्षण आणि खत शिफारस कशी मिळते?" },
          { icon: "🏛️", label: "पीएम किसान योजना", query: "पीएम किसान योजनेचे पैसे कधी मिळतात?" },
        ]
      : language === "hi"
      ? [
          { icon: "🌱", label: "फसल सिफारिश खोलें", query: "फसल सिफारिश पेज पर जाओ" },
          { icon: "🌙", label: "डार्क मोड", query: "डार्क मोड चालू करो" },
          { icon: "☀️", label: "लाइट मोड", query: "लाइट मोड चालू करो" },
          { icon: "🌦️", label: "आज का मौसम", query: "आज मेरे शहर का मौसम कैसा है?" },
          { icon: "🐛", label: "कपास गुलाबी सुंडी", query: "कपास में गुलाबी सुंडी का नियंत्रण कैसे करें?" },
          { icon: "💰", label: "सोयाबीन मंडी भाव", query: "सोयाबीन का आज का मंडी भाव क्या है?" },
          { icon: "🌾", label: "फसल उपज अनुमान", query: "फसल उपज अनुमान पेज पर जाओ" },
          { icon: "🧪", label: "मृदा व खाद सलाह", query: "मिट्टी की जांच और खाद की सलाह कैसे पाएं?" },
          { icon: "🏛️", label: "पीएम-किसान योजना", query: "पीएम किसान योजना की जानकारी दीजिए" },
        ]
      : [
          { icon: "🌱", label: "Recommendation", query: "Go to recommendation page" },
          { icon: "🌙", label: "Dark Mode", query: "Switch to dark mode" },
          { icon: "☀️", label: "Light Mode", query: "Switch to light mode" },
          { icon: "🌦️", label: "Today's Weather", query: "Hey what's today's weather of my city?" },
          { icon: "🐛", label: "Cotton Bollworm", query: "How to control pink bollworm in cotton?" },
          { icon: "💰", label: "Soybean Mandi Price", query: "What is today's soybean market rate?" },
          { icon: "🌾", label: "Crop Prediction", query: "Go to crop prediction page" },
          { icon: "🧪", label: "Soil & Fertilizer", query: "How to get soil recommendation and fertilizer dosage?" },
          { icon: "🏛️", label: "PM-Kisan Scheme", query: "Explain PM-Kisan and Namo Shetkari schemes" },
        ];

  // Get the latest assistant response for Voice Mode display
  const latestBotMsg = [...messages].reverse().find((m) => m.role === "assistant") || messages[0];
  const latestUserMsg = [...messages].reverse().find((m) => m.role === "user");

  return (
    <div className="no-print">
      {/* FLOATING ACTION BUTTON */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsVoiceMode(true);
          }}
          className="no-print fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#10B981] px-4.5 py-3.5 text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer border-2 border-white/40 ring-4 ring-green-600/20"
          title={
            language === "mr"
              ? "कृषीमित्र AI व्हॉइस असिस्टंट 🎙️"
              : language === "hi"
              ? "कृषि-मित्र AI वॉइस असिस्टेंट 🎙️"
              : "KrushiMitra AI Voice Assistant 🎙️"
          }
        >
          <div className="relative">
            <Radio size={22} className="group-hover:rotate-12 transition-transform text-yellow-300" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
            </span>
          </div>

          <div className="flex flex-col items-start leading-none hidden sm:flex">
            <span className="text-xs font-black tracking-wide">
              {language === "mr" ? "कृषीमित्र AI 🎙️" : language === "hi" ? "कृषि-मित्र AI 🎙️" : "KrushiMitra AI 🎙️"}
            </span>
            <span className="text-[9px] text-green-200 font-semibold mt-0.5">
              {language === "mr" ? "बोलून प्रश्न विचारा 🎙️" : language === "hi" ? "बोलकर पूछें 🎙️" : "Voice Assistant"}
            </span>
          </div>
        </button>
      )}

      {/* ASSISTANT WINDOW */}
      {isOpen && (
        <div
          className={`no-print fixed right-3 sm:right-6 bottom-4 z-50 flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-[#0D1710] shadow-2xl border border-green-200 dark:border-[#24402A] transition-all duration-300 ${
            isMinimized
              ? "h-16 w-80 sm:w-96"
              : isExpanded
              ? "h-[88vh] w-[95vw] sm:w-[580px]"
              : "h-[600px] max-h-[88vh] w-[94vw] sm:w-[440px]"
          }`}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#15803D] px-4 py-3 text-white shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xs">
                <Sparkles size={18} className="text-yellow-300" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-black truncate flex items-center gap-1.5">
                  {language === "mr" ? "कृषीमित्र AI व्हॉइस" : language === "hi" ? "कृषि-मित्र AI वॉइस" : "KrushiMitra Voice AI"}
                  <span className="text-[9px] font-bold bg-green-500/80 px-1.5 py-0.2 rounded-full uppercase">
                    {language}
                  </span>
                </h3>
                <p className="text-[10px] text-green-100 flex items-center gap-1 truncate">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
                  <span>📍 {farmerDistrict}</span>
                  <span>• {isVoiceMode ? (language === "mr" ? "व्हॉइस" : language === "hi" ? "वॉइस" : "Voice") : (language === "mr" ? "चॅट" : language === "hi" ? "चैट" : "Chat")}</span>
                </p>
              </div>
            </div>

            {/* Mode Switcher & Controls */}
            <div className="flex items-center gap-1 text-white/90 shrink-0">
              {/* Voice / Chat Tab Switcher */}
              <div className="flex items-center rounded-lg bg-black/20 p-0.5 backdrop-blur-xs mr-1">
                <button
                  type="button"
                  onClick={() => setIsVoiceMode(true)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition cursor-pointer ${
                    isVoiceMode ? "bg-white text-[#1B5E20] shadow-2xs" : "text-white/80 hover:text-white"
                  }`}
                  title="Voice Assistant Mode"
                >
                  <Radio size={12} />
                  <span className="hidden sm:inline">Voice</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsVoiceMode(false)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition cursor-pointer ${
                    !isVoiceMode ? "bg-white text-[#1B5E20] shadow-2xs" : "text-white/80 hover:text-white"
                  }`}
                  title="Text Chat Mode"
                >
                  <MessageSquare size={12} />
                  <span className="hidden sm:inline">Chat</span>
                </button>
              </div>

              {/* Auto-Speak Toggle */}
              <button
                type="button"
                onClick={() => {
                  if (speakingIndex !== null) stopSpeaking();
                  setIsAutoSpeak(!isAutoSpeak);
                }}
                className={`rounded-lg p-1.5 transition cursor-pointer ${
                  isAutoSpeak ? "bg-white/20 text-yellow-300" : "hover:bg-white/20 text-white/60"
                }`}
                title={isAutoSpeak ? "Auto-Voice ON (बोलून उत्तर द्या)" : "Auto-Voice Muted (आवाज बंद)"}
              >
                {isAutoSpeak ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={() => changeTheme?.(isDark ? "light" : "dark")}
                className="rounded-lg p-1.5 hover:bg-white/20 transition cursor-pointer text-white/90 hover:text-white"
                title={isDark ? "Switch to Light Mode ☀️" : "Switch to Dark Mode 🌙"}
              >
                {isDark ? <Sun size={15} className="text-amber-300" /> : <Moon size={15} />}
              </button>

              <button
                type="button"
                onClick={clearChat}
                className="rounded-lg p-1.5 hover:bg-white/20 transition cursor-pointer"
                title="Clear"
              >
                <Trash2 size={14} />
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="rounded-lg p-1.5 hover:bg-white/20 transition cursor-pointer hidden sm:inline-flex"
                title={isExpanded ? "Restore" : "Expand"}
              >
                {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="rounded-lg p-1.5 hover:bg-white/20 transition cursor-pointer"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* MAIN BODY: VOICE ASSISTANT MODE */}
          {!isMinimized && isVoiceMode && (
            <div className="flex-1 flex flex-col justify-between overflow-y-auto p-4 sm:p-5 bg-gradient-to-b from-[#EBF5EC] via-[#F6FAF6] to-[#E5F2E7] dark:bg-radial dark:from-[#12331B] dark:via-[#0D2414] dark:to-[#08170D] text-slate-800 dark:text-white transition-colors duration-300">
              {/* TOP STATUS BAR */}
              <div className="flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-200/80 pb-2 border-b border-emerald-200/70 dark:border-white/10">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>📍 {farmerDistrict}</span>
                  <span>({language.toUpperCase()})</span>
                </span>
                {speakingIndex !== null && (
                  <button
                    type="button"
                    onClick={stopSpeaking}
                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-600 dark:bg-red-500/30 dark:text-red-300 border border-red-400/40 hover:bg-red-500/30 dark:hover:bg-red-500/50 cursor-pointer"
                  >
                    <Square size={10} />
                    <span>{language === "mr" ? "थांबवा" : language === "hi" ? "रोकें" : "Stop"}</span>
                  </button>
                )}
              </div>

              {/* LATEST EXCHANGE / ANSWER DISPLAY */}
              <div className="my-auto py-3 space-y-3">
                {latestUserMsg && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-950 dark:text-emerald-300/90 bg-white/90 dark:bg-white/5 rounded-xl px-3 py-2 border border-emerald-200/80 dark:border-white/10 shadow-2xs">
                    <User size={14} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span className="truncate">"{latestUserMsg.content}"</span>
                  </div>
                )}

                {/* Weather Card Display if Available */}
                {latestBotMsg.weather_card ? (
                  <LiveWeatherCard card={latestBotMsg.weather_card} nav={nav} language={language} />
                ) : (
                  <div className="rounded-2xl bg-white/95 dark:bg-white/10 backdrop-blur-md p-4 border border-emerald-200 dark:border-white/15 shadow-lg max-h-56 overflow-y-auto">
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-500/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-400/40">
                        <Bot size={15} />
                      </div>
                      <div className="flex-1 min-w-0 text-slate-800 dark:text-white">
                        <FormattedMessage content={latestBotMsg.content} isUser={false} />

                        {latestBotMsg.action && (
                          <button
                            type="button"
                            onClick={() => handleActionClick(latestBotMsg.action)}
                            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 dark:from-emerald-500 dark:to-green-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md hover:from-emerald-700 hover:to-green-800 transition cursor-pointer"
                          >
                            <Compass size={13} className="text-yellow-300" />
                            <span>{latestBotMsg.action.label}</span>
                            <ArrowRight size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CENTER: GLOWING VOICE ORB & SOUND WAVES */}
              <div className="flex flex-col items-center justify-center my-3">
                <div className="relative flex items-center justify-center">
                  {/* Concentric Pulsing Sound Rings */}
                  {(isListening || speakingIndex !== null) && (
                    <>
                      <span className="absolute h-40 w-40 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 animate-ping [animation-duration:2.5s]" />
                      <span className="absolute h-48 w-48 rounded-full bg-green-500/10 dark:bg-green-400/15 animate-pulse" />
                    </>
                  )}

                  {/* Equalizer Sound Wave Bars */}
                  <div className="absolute flex items-center justify-center gap-1.5 z-0 pointer-events-none">
                    {[30, 60, 95, 45, 80, 55, 90, 40].map((h, i) => (
                      <span
                        key={i}
                        className={`w-1.5 rounded-full transition-all duration-150 ${
                          isListening
                            ? "bg-red-500 dark:bg-red-400 animate-pulse"
                            : speakingIndex !== null
                            ? "bg-emerald-600 dark:bg-emerald-300 animate-pulse"
                            : "bg-emerald-200/80 dark:bg-white/10"
                        }`}
                        style={{
                          height: isListening || speakingIndex !== null ? `${Math.max(14, h * 0.55)}px` : "6px",
                          animationDelay: `${i * 110}ms`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Main Center Glowing Mic Button */}
                  <button
                    type="button"
                    onClick={isListening ? stopListening : () => startListening()}
                    className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-full shadow-2xl transition-all duration-300 cursor-pointer ${
                      isListening
                        ? "bg-gradient-to-tr from-red-600 to-rose-500 text-white scale-110 ring-8 ring-red-500/30 animate-pulse"
                        : loading
                        ? "bg-gradient-to-tr from-amber-600 to-yellow-500 text-white scale-105 ring-8 ring-amber-500/30"
                        : speakingIndex !== null
                        ? "bg-gradient-to-tr from-emerald-600 to-teal-500 text-white ring-8 ring-emerald-500/30"
                        : "bg-gradient-to-tr from-[#1B5E20] via-[#2E7D32] to-[#10B981] text-white hover:scale-105 active:scale-95 ring-8 ring-emerald-500/20"
                    }`}
                  >
                    {isListening ? (
                      <MicOff size={34} className="animate-bounce" />
                    ) : loading ? (
                      <Sparkles size={34} className="animate-spin text-yellow-300" />
                    ) : speakingIndex !== null ? (
                      <Volume2 size={34} className="animate-pulse text-emerald-200" />
                    ) : (
                      <Mic size={34} className="text-white drop-shadow-md" />
                    )}
                  </button>
                </div>

                {/* State Label Below Orb */}
                <p className="text-xs font-bold text-center mt-3 text-emerald-950 dark:text-emerald-200">
                  {isListening
                    ? language === "mr"
                      ? "👂 ऐकत आहे... बोला... (Listening...)"
                      : language === "hi"
                      ? "👂 सुन रहा हूँ... बोलें... (Listening...)"
                      : "👂 Listening... Speak now..."
                    : loading
                    ? language === "mr"
                      ? "🧠 माहिती शोधत आहे... (Thinking...)"
                      : language === "hi"
                      ? "🧠 विश्लेषण हो रहा है... (Thinking...)"
                      : "🧠 Thinking & Analyzing..."
                    : speakingIndex !== null
                    ? language === "mr"
                      ? "🔊 उत्तर सांगत आहे... (Speaking...)"
                      : language === "hi"
                      ? "🔊 उत्तर बता रहा हूँ... (Speaking...)"
                      : "🔊 Speaking answer aloud..."
                    : language === "mr"
                    ? "🎙️ टॅप करा आणि विचारा (उदा. 'हवामान काय आहे?')"
                    : language === "hi"
                    ? "🎙️ टैप करें और बोलें (उदा. 'मौसम कैसा है?')"
                    : "🎙️ Tap mic & speak (e.g. 'What's the weather?')" }
                </p>
              </div>

              {/* QUICK VOICE PROMPTS CAROUSEL */}
              <div className="pt-2 border-t border-emerald-200/70 dark:border-white/10">
                <p className="text-[10px] font-bold text-emerald-800/80 dark:text-emerald-300/70 mb-1.5">
                  {language === "mr" ? "💡 बोलण्यासाठी त्वरित प्रश्न (टॅप करा):" : language === "hi" ? "💡 बोलकर पूछें (टैप करें):" : "💡 Try saying aloud (tap to ask):"}
                </p>
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {spokenPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(p.query, true)}
                      className="shrink-0 flex items-center gap-1 rounded-full border border-emerald-200 dark:border-white/15 bg-white/90 dark:bg-white/10 hover:bg-emerald-50 dark:hover:bg-white/20 px-2.5 py-1 text-[10px] font-semibold text-emerald-900 dark:text-white transition cursor-pointer backdrop-blur-xs shadow-2xs"
                    >
                      <span>{p.icon}</span>
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MAIN BODY: TRADITIONAL CHAT MODE */}
          {!isMinimized && !isVoiceMode && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-[#F7FAF6] to-[#F1F6F0] dark:from-[#0D1710] dark:to-[#08120B]">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        msg.role === "user"
                          ? "bg-[#2E7D32] text-white"
                          : "bg-green-100 dark:bg-emerald-900/50 text-[#1B5E20] dark:text-emerald-300 border border-green-300 dark:border-emerald-800"
                      }`}
                    >
                      {msg.role === "user" ? <User size={14} /> : <Bot size={15} />}
                    </div>

                    <div
                      className={`relative max-w-[88%] rounded-2xl p-3 text-xs shadow-2xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#2E7D32] text-white rounded-tr-none"
                          : "bg-white dark:bg-[#132218] text-gray-800 dark:text-gray-200 border border-green-100/80 dark:border-[#24402A] rounded-tl-none"
                      }`}
                    >
                      {/* Attached Image Thumbnail if User sent a photo */}
                      {msg.image && (
                        <div className="mb-2 rounded-xl overflow-hidden border border-white/25 shadow-xs max-w-[200px]">
                          <img src={msg.image} alt="Attached leaf scan" className="w-full h-28 object-cover" />
                        </div>
                      )}

                      {/* Message Content Formatted */}
                      <FormattedMessage content={msg.content} isUser={msg.role === "user"} />

                      {/* Interactive Weather Widget if attached */}
                      {msg.weather_card && (
                        <LiveWeatherCard card={msg.weather_card} nav={nav} language={language} />
                      )}

                      {/* Interactive Navigation Action Button */}
                      {msg.action && (
                        <div className="mt-2.5 pt-2 border-t border-green-100/90 dark:border-white/10 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleActionClick(msg.action)}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#15803D] px-3.5 py-2 text-xs font-bold text-white shadow-md hover:from-[#2E7D32] hover:to-[#388E3C] hover:shadow-lg active:scale-95 transition-all cursor-pointer border border-white/20 group"
                          >
                            <Compass size={14} className="text-yellow-300 group-hover:rotate-45 transition-transform" />
                            <span>{msg.action.label}</span>
                            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      )}

                      <div className="mt-2 flex items-center justify-between gap-3 text-[9px] opacity-80">
                        <span>{msg.time}</span>

                        <div className="flex items-center gap-2">
                          {msg.role === "assistant" && (
                            <button
                              type="button"
                              onClick={() =>
                                openWhatsAppShare(
                                  `🌾 *कृषीमित्र सल्ला (KrushiMitra AI Advisory):*\n\n${msg.content}\n\n🌱 *कृषीमित्र — शेतकऱ्यांचा डिजिटल मित्र*`
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 hover:bg-green-500/20 text-green-700 dark:text-emerald-300 font-bold cursor-pointer transition"
                              title="Share on WhatsApp"
                            >
                              <Share2 size={11} />
                              <span>WhatsApp</span>
                            </button>
                          )}

                          {msg.role === "assistant" && (
                            <button
                              type="button"
                              onClick={() => handleSpeak(msg.content, idx)}
                              className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 hover:bg-green-50 dark:hover:bg-white/10 text-[#1B5E20] dark:text-emerald-300 font-bold cursor-pointer transition"
                              title={speakingIndex === idx ? "Stop Speaking" : "Listen (Text-to-Speech)"}
                            >
                              {speakingIndex === idx ? (
                                <>
                                  <VolumeX size={13} className="text-red-500 animate-pulse" />
                                  <span className="text-red-500">{language === "mr" ? "थांबवा" : language === "hi" ? "रोकें" : "Stop"}</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 size={13} />
                                  <span>{language === "mr" ? "ऐका 🔊" : language === "hi" ? "सुनें 🔊" : "Listen 🔊"}</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-emerald-900/50 text-[#1B5E20] dark:text-emerald-300">
                      <Bot size={15} />
                    </div>
                    <div className="rounded-2xl rounded-tl-none bg-white dark:bg-[#132218] p-3.5 border border-green-100 dark:border-[#24402A] shadow-2xs">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <span className="h-2 w-2 rounded-full bg-[#2E7D32] animate-bounce" />
                        <span className="h-2 w-2 rounded-full bg-[#2E7D32] animate-bounce [animation-delay:0.2s]" />
                        <span className="h-2 w-2 rounded-full bg-[#2E7D32] animate-bounce [animation-delay:0.4s]" />
                        <span className="ml-1.5 text-[11px] font-semibold text-[#1B5E20] dark:text-emerald-400">
                          {language === "mr" ? "माहिती शोधत आहे..." : language === "hi" ? "जानकारी खोज रहा हूँ..." : "Thinking..."}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* QUICK SUGGESTIONS */}
              <div className="border-t border-green-100 dark:border-[#24402A] bg-white dark:bg-[#0D1710] px-3 py-2">
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {spokenPrompts.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(chip.query, false)}
                      className="shrink-0 flex items-center gap-1 rounded-full border border-green-200 dark:border-[#24402A] bg-green-50/70 dark:bg-[#183321] px-2.5 py-1 text-[10px] font-semibold text-[#1B5E20] dark:text-emerald-300 hover:bg-[#2E7D32] hover:text-white transition cursor-pointer"
                    >
                      <span>{chip.icon}</span>
                      <span>{chip.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* INPUT BAR */}
              <div className="border-t border-gray-100 dark:border-[#24402A] bg-white dark:bg-[#0D1710] p-3">
                {/* ATTACHED IMAGE PREVIEW BAR */}
                {attachedImage && (
                  <div className="mb-2 flex items-center justify-between rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 p-1.5 px-2">
                    <div className="flex items-center gap-2">
                      <img src={attachedImage} alt="Preview" className="h-9 w-9 rounded-lg object-cover border border-green-300 dark:border-green-700" />
                      <div className="text-[11px] font-bold text-green-900 dark:text-green-300">
                        {language === "mr" ? "🌿 पाण्याचा फोटो जोडला (Leaf photo attached)" : "🌿 Leaf photo attached"}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachedImage(null)}
                      className="rounded-full bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 p-1 hover:bg-red-500 hover:text-white transition cursor-pointer"
                      title="Remove image"
                    >
                      <X size={13} />
                    </button>
                  </div>
                )}

                {/* HIDDEN PHOTO INPUT */}
                <input
                  ref={chatFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleAttachImage(e.target.files?.[0])}
                />

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  {/* ATTACH PHOTO BUTTON */}
                  <button
                    type="button"
                    onClick={() => chatFileInputRef.current?.click()}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition duration-200 cursor-pointer border ${
                      attachedImage
                        ? "bg-green-600 text-white border-green-700 shadow-xs"
                        : "bg-green-50 dark:bg-[#183321] text-[#1B5E20] dark:text-emerald-300 hover:bg-green-100 dark:hover:bg-[#20432c] border-green-200 dark:border-[#24402A]"
                    }`}
                    title={language === "mr" ? "पानाचा फोटो जोडा (Camera/Upload)" : "Attach leaf photo"}
                  >
                    <Camera size={17} />
                  </button>

                  {isSupported && (
                    <button
                      type="button"
                      onClick={isListening ? stopListening : () => startListening()}
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition duration-200 cursor-pointer ${
                        isListening
                          ? "bg-red-500 text-white animate-pulse ring-4 ring-red-200"
                          : "bg-green-100 dark:bg-[#183321] text-[#1B5E20] dark:text-emerald-300 hover:bg-green-200"
                      }`}
                      title={isListening ? "Stop" : "Speak question"}
                    >
                      {isListening ? <MicOff size={18} className="animate-bounce" /> : <Mic size={18} />}
                    </button>
                  )}

                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      attachedImage
                        ? language === "mr"
                          ? "या फोटोबद्दल विचारा (उदा. कोणता रोग आहे?)..."
                          : language === "hi"
                          ? "इस फोटो के बारे में पूछें (उदा. कौन सा रोग है?)..."
                          : "Ask about this leaf photo..."
                        : isListening
                        ? language === "mr"
                          ? "ऐकत आहे... बोला..."
                          : language === "hi"
                          ? "सुन रहा हूँ... बोलें..."
                          : "Listening... Speak now..."
                        : language === "mr"
                        ? "शेतीविषयक प्रश्न येथे विचारा..."
                        : language === "hi"
                        ? "कृषि प्रश्न यहाँ पूछें..."
                        : "Ask your farming question..."
                    }
                    className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#183321] px-3.5 py-2.5 text-xs text-gray-800 dark:text-white outline-none transition focus:border-[#2E7D32]"
                  />

                  <button
                    type="submit"
                    disabled={(!input.trim() && !attachedImage) || loading}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2E7D32] text-white transition hover:bg-[#1B5E20] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer shadow-xs"
                    title="Send"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
