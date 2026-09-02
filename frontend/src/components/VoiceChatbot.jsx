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
  ChevronDown,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useVoiceInput } from "../hooks/useVoiceInput";
import { buildApiUrl } from "../utils/apiConfig";

export default function VoiceChatbot() {
  const { language } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);

  const initialGreeting =
    language === "mr"
      ? "नमस्कार शेतकरी बंधूंनो! 🙏 मी तुमचा कृषीमित्र AI सहाय्यक आहे. तुम्ही मला शेती, पिके, खते, कीड नियंत्रण किंवा शासकीय योजनांबद्दल बोलून अथवा लिहून प्रश्न विचारू शकता."
      : language === "hi"
      ? "नमस्ते किसान भाइयों! 🙏 मैं आपका कृषि-मित्र AI सहायक हूँ। आप मुझसे फसल, खाद, कीट नियंत्रण, मौसम या सरकारी योजनाओं के बारे में बोलकर या लिखकर पूछ सकते हैं।"
      : "Hello farmer friends! 🙏 I am your KrushiMitra AI Assistant. You can ask me any question about crops, fertilizers, pest remedies, weather, or government schemes by voice or text.";

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: initialGreeting,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  // Voice Input Hook
  const { isListening, startListening, stopListening, isSupported } =
    useVoiceInput({
      onResult: (spokenText) => {
        if (spokenText) {
          setInput(spokenText);
          handleSendMessage(spokenText);
        }
      },
    });

  // Text to Speech Functionality
  const handleSpeak = (text, index) => {
    if (!("speechSynthesis" in window)) return;

    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown characters for pleasant voice reading
    const cleanText = text
      .replace(/[*_#`~]/g, "")
      .replace(/🌱|🌿|🌾|🎋|🏛️|🧪|🍅|💡|🙏|✅|⚠️|❌/g, "")
      .replace(/\n+/g, ". ");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === "mr" ? "mr-IN" : language === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = 0.95; // Friendly cadence for farmers

    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (customMessage) => {
    const textToSend = (customMessage || input).trim();
    if (!textToSend || loading) return;

    const userMsg = {
      role: "user",
      content: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(buildApiUrl("/ai/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          language: language,
          history: messages.slice(-4), // keep context
        }),
      });

      const data = await response.json();

      if (data.success && data.reply) {
        const botMsg = {
          role: "assistant",
          content: data.reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(data.message || "Failed to get reply");
      }
    } catch (err) {
      console.error("AI Chat Error:", err);
      const errorReply =
        language === "mr"
          ? "माफ करा, सर्व्हरशी संपर्क साधता आला नाही. कृपया बॅकएंड सुरू असल्याची खात्री करा."
          : language === "hi"
          ? "क्षमा करें, सर्वर से संपर्क नहीं हो सका। कृपया जांचें कि बैकएंड चालू है।"
          : "Sorry, could not connect to server. Please verify backend is running.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorReply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    window.speechSynthesis?.cancel();
    setSpeakingIndex(null);
    setMessages([
      {
        role: "assistant",
        content: initialGreeting,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const suggestionChips =
    language === "mr"
      ? [
          "कापसावरील बोंड अळीसाठी उपाय",
          "सोयाबीन खत व्यवस्थापन",
          "पीएम-किसान योजनेची माहिती",
          "टोमॅटो करपा रोग नियंत्रण",
        ]
      : language === "hi"
      ? [
          "कपास में गुलाबी सुंडी नियंत्रण",
          "सोयाबीन के लिए खाद प्रबंधन",
          "पीएम किसान योजना विवरण",
          "टमाटर में झुलसा रोग उपाय",
        ]
      : [
          "Cotton pink bollworm control",
          "Soybean fertilizer schedule",
          "PM-Kisan subsidy details",
          "Tomato blight treatment",
        ];

  return (
    <>
      {/* FLOATING ACTION BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#10B981] px-4 py-3.5 text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer border-2 border-white/40"
          title={
            language === "mr"
              ? "कृषीमित्र AI सह बोला 🎙️"
              : language === "hi"
              ? "कृषि-मित्र AI से बात करें 🎙️"
              : "Ask KrushiMitra AI 🎙️"
          }
        >
          <div className="relative">
            <Bot size={22} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
            </span>
          </div>

          <span className="text-xs font-extrabold tracking-wide hidden sm:inline">
            {language === "mr"
              ? "कृषीमित्र AI 🎙️"
              : language === "hi"
              ? "कृषि-मित्र AI 🎙️"
              : "KrushiMitra AI 🎙️"}
          </span>
        </button>
      )}

      {/* CHAT DRAWER / WINDOW */}
      {isOpen && (
        <div
          className={`fixed right-4 bottom-4 z-50 flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl border border-green-200 transition-all duration-300 ${
            isMinimized
              ? "h-16 w-80 sm:w-96"
              : "h-[560px] max-h-[85vh] w-[92vw] sm:w-[420px]"
          }`}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#15803D] px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xs">
                <Sparkles size={18} className="text-yellow-300" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold flex items-center gap-1.5">
                  {language === "mr"
                    ? "कृषीमित्र AI सहाय्यक"
                    : language === "hi"
                    ? "कृषि-मित्र AI सहायक"
                    : "KrushiMitra AI Bot"}
                  <span className="text-[9px] font-semibold bg-green-500/80 px-1.5 py-0.5 rounded-full">
                    {language.toUpperCase()}
                  </span>
                </h3>
                <p className="text-[10px] text-green-100 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  {language === "mr"
                    ? "२४/७ शेती सल्लागार"
                    : language === "hi"
                    ? "२४/७ कृषि सलाहकार"
                    : "24/7 Agronomy Assistant"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/80">
              <button
                type="button"
                onClick={clearChat}
                className="rounded-lg p-1.5 hover:bg-white/20 hover:text-white transition cursor-pointer"
                title="Clear Chat"
              >
                <Trash2 size={15} />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="rounded-lg p-1.5 hover:bg-white/20 hover:text-white transition cursor-pointer"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
              </button>
              <button
                type="button"
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setIsOpen(false);
                }}
                className="rounded-lg p-1.5 hover:bg-white/20 hover:text-white transition cursor-pointer"
                title="Close"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* BODY & MESSAGES */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-[#F7FAF6] to-[#F1F6F0]">
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
                          : "bg-green-100 text-[#1B5E20] border border-green-300"
                      }`}
                    >
                      {msg.role === "user" ? <User size={14} /> : <Bot size={15} />}
                    </div>

                    <div
                      className={`relative max-w-[82%] rounded-2xl p-3 text-xs shadow-2xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#2E7D32] text-white rounded-tr-none"
                          : "bg-white text-gray-800 border border-green-100/80 rounded-tl-none"
                      }`}
                    >
                      {/* Message Content formatted */}
                      <div className="whitespace-pre-wrap font-medium">
                        {msg.content}
                      </div>

                      <div className="mt-1.5 flex items-center justify-between gap-3 text-[9px] opacity-70">
                        <span>{msg.time}</span>

                        {msg.role === "assistant" && (
                          <button
                            type="button"
                            onClick={() => handleSpeak(msg.content, idx)}
                            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 hover:bg-green-50 text-[#1B5E20] font-bold cursor-pointer transition"
                            title={
                              speakingIndex === idx
                                ? "Stop Speaking"
                                : "Listen (Text-to-Speech)"
                            }
                          >
                            {speakingIndex === idx ? (
                              <>
                                <VolumeX size={13} className="text-red-500 animate-pulse" />
                                <span className="text-red-500">थांबवा</span>
                              </>
                            ) : (
                              <>
                                <Volume2 size={13} />
                                <span>ऐका 🔊</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-100 text-[#1B5E20]">
                      <Bot size={15} />
                    </div>
                    <div className="rounded-2xl rounded-tl-none bg-white p-3.5 border border-green-100 shadow-2xs">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="h-2 w-2 rounded-full bg-[#2E7D32] animate-bounce" />
                        <span className="h-2 w-2 rounded-full bg-[#2E7D32] animate-bounce [animation-delay:0.2s]" />
                        <span className="h-2 w-2 rounded-full bg-[#2E7D32] animate-bounce [animation-delay:0.4s]" />
                        <span className="ml-1.5 text-[11px] font-semibold text-[#1B5E20]">
                          {language === "mr"
                            ? "माहिती शोधत आहे..."
                            : language === "hi"
                            ? "जानकारी खोज रहा हूँ..."
                            : "Thinking..."}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* QUICK SUGGESTIONS */}
              <div className="border-t border-green-100 bg-white px-3 py-2">
                <p className="text-[10px] font-bold text-gray-400 mb-1.5">
                  {language === "mr"
                    ? "💡 त्वरित प्रश्न विचारा:"
                    : language === "hi"
                    ? "💡 तुरंत पूछें:"
                    : "💡 Suggested questions:"}
                </p>
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {suggestionChips.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setInput(chip);
                        handleSendMessage(chip);
                      }}
                      className="shrink-0 rounded-full border border-green-200 bg-green-50/70 px-2.5 py-1 text-[10px] font-semibold text-[#1B5E20] hover:bg-[#2E7D32] hover:text-white transition cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* FOOTER & INPUT */}
              <div className="border-t border-gray-100 bg-white p-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  {/* MIC BUTTON */}
                  {isSupported && (
                    <button
                      type="button"
                      onClick={isListening ? stopListening : () => startListening()}
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition duration-200 cursor-pointer ${
                        isListening
                          ? "bg-red-500 text-white animate-pulse ring-4 ring-red-200"
                          : "bg-green-100 text-[#1B5E20] hover:bg-green-200 active:scale-95"
                      }`}
                      title={
                        isListening
                          ? "Stop Listening"
                          : language === "mr"
                          ? "बोलून प्रश्न विचारा (मराठी/हिंदी/इंग्रजी)"
                          : language === "hi"
                          ? "बोलकर प्रश्न पूछें (मराठी/हिंदी/अंग्रेजी)"
                          : "Speak question (Marathi/Hindi/English)"
                      }
                    >
                      {isListening ? (
                        <MicOff size={18} className="animate-bounce" />
                      ) : (
                        <Mic size={18} />
                      )}
                    </button>
                  )}

                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      isListening
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
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-800 outline-none transition focus:border-[#2E7D32] focus:bg-white focus:ring-2 focus:ring-green-100"
                  />

                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2E7D32] text-white transition hover:bg-[#1B5E20] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
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
    </>
  );
}
