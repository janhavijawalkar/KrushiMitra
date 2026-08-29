import { Mic, MicOff, Volume2 } from "lucide-react";
import { useVoiceInput } from "../hooks/useVoiceInput";
import { useApp } from "../context/AppContext";

/**
 * Reusable Voice Microphone Button with sound wave pulse animation.
 */
export default function VoiceMicButton({
  onTranscript,
  className = "",
  size = "md",
  title,
}) {
  const { language } = useApp();

  const { isListening, startListening, stopListening, error, isSupported } =
    useVoiceInput({
      onResult: (text) => {
        if (onTranscript) onTranscript(text);
      },
    });

  if (!isSupported) return null;

  const defaultTitle =
    title ||
    (language === "mr"
      ? "बोलून इनपुट द्या (मराठी/हिंदी/इंग्रजी)"
      : language === "hi"
      ? "बोलकर इनपुट दें (मराठी/हिंदी/अंग्रेजी)"
      : "Click to speak (Marathi/Hindi/English)");

  const isSmall = size === "sm";

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={isListening ? stopListening : () => startListening()}
        className={`relative flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer ${
          isListening
            ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse ring-4 ring-red-200"
            : "bg-[#EAF5E8] text-[#2E7D32] hover:bg-[#D7ECD4] hover:scale-105 active:scale-95"
        } ${isSmall ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm"} ${className}`}
        title={defaultTitle}
        aria-label={defaultTitle}
      >
        {isListening ? (
          <MicOff size={isSmall ? 14 : 17} className="animate-bounce" />
        ) : (
          <Mic size={isSmall ? 15 : 18} />
        )}

        {isListening && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
          </span>
        )}
      </button>

      {/* LISTENING TOAST / TOOLTIP */}
      {isListening && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 whitespace-nowrap rounded-xl bg-gray-900/90 text-white text-[10px] font-bold px-3 py-1.5 shadow-lg backdrop-blur-xs flex items-center gap-1.5 animate-scale-in pointer-events-none">
          <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
          <span>
            {language === "mr"
              ? "ऐकत आहे... बोला"
              : language === "hi"
              ? "सुन रहा हूँ... बोलिए"
              : "Listening... Speak now"}
          </span>
        </div>
      )}

      {error && !isListening && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50 whitespace-nowrap rounded-lg bg-red-600 text-white text-[10px] font-semibold px-2.5 py-1 shadow-md animate-fade-in pointer-events-none">
          {error}
        </div>
      )}
    </div>
  );
}
