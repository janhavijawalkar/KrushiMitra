import { useState, useEffect, useRef, useCallback } from "react";
import { useApp } from "../context/AppContext";

/**
 * Custom React Hook for Voice Input (Speech-to-Text)
 * Supports Marathi (mr-IN), Hindi (hi-IN), and Indian English (en-IN).
 */
export function useVoiceInput({ onResult, onEnd } = {}) {
  const { language } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  const isSupported =
    typeof window !== "undefined" &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  const getLangCode = useCallback(() => {
    switch (language) {
      case "mr":
        return "mr-IN";
      case "hi":
        return "hi-IN";
      default:
        return "en-IN";
    }
  }, [language]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(
    (customCallback) => {
      setError(null);
      setTranscript("");

      if (!isSupported) {
        setError(
          language === "mr"
            ? "आपल्या ब्राउझरमध्ये व्हॉइस इनपुट समर्थित नाही. कृपया Google Chrome किंवा Edge वापरा."
            : language === "hi"
            ? "आपके ब्राउज़र में वॉइस इनपुट समर्थित नहीं है। कृपया Google Chrome या Edge का उपयोग करें।"
            : "Voice input is not supported in this browser. Please use Chrome or Edge."
        );
        return;
      }

      try {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.lang = getLangCode();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          if (event.results && event.results[0] && event.results[0][0]) {
            const spokenText = event.results[0][0].transcript.trim();
            setTranscript(spokenText);
            if (customCallback && typeof customCallback === "function") {
              customCallback(spokenText);
            } else if (onResult && typeof onResult === "function") {
              onResult(spokenText);
            }
          }
        };

        recognition.onerror = (event) => {
          console.warn("[Voice Input] Error event:", event.error);
          if (event.error === "not-allowed") {
            setError(
              language === "mr"
                ? "मायक्रोफोन परवानगी नाकारली गेली. कृपया ब्राउझरमध्ये माइक परवानगी द्या."
                : language === "hi"
                ? "माइक्रोफ़ोन अनुमति अस्वीकृत। कृपया ब्राउज़र में माइक की अनुमति दें।"
                : "Microphone permission was denied. Please allow mic access."
            );
          } else if (event.error === "no-speech") {
            setError(
              language === "mr"
                ? "कोणताही आवाज ऐकू आला नाही. कृपया पुन्हा बोला."
                : language === "hi"
                ? "कोई आवाज़ नहीं सुनाई दी। कृपया पुनः बोलें।"
                : "No speech was detected. Please try again."
            );
          } else {
            setError(
              language === "mr"
                ? "आवाज ओळखण्यात अडचण आली."
                : language === "hi"
                ? "आवाज़ पहचानने में त्रुटि हुई।"
                : "Speech recognition error occurred."
            );
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          if (onEnd) onEnd();
        };

        recognition.start();
      } catch (err) {
        console.error("[Voice Input] Initialization failed:", err);
        setIsListening(false);
        setError(err.message || "Failed to start speech recognition.");
      }
    },
    [isSupported, getLangCode, language, onResult, onEnd]
  );

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
  };
}
