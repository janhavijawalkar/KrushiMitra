import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";

export default function GoogleAuthButton({ mode = "signin", onSuccess, onError }) {
  const { language, t } = useApp();
  const buttonRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");

  const clientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    ""; // Set in frontend/.env

  useEffect(() => {
    if (!clientId) {
      return;
    }

    let checkInterval = null;

    const initGsi = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => {
              if (response?.credential) {
                if (onSuccess) onSuccess(response.credential);
              } else {
                if (onError) onError("No credential returned from Google.");
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          if (buttonRef.current) {
            buttonRef.current.innerHTML = "";
            window.google.accounts.id.renderButton(buttonRef.current, {
              theme: "outline",
              size: "large",
              type: "standard",
              text: mode === "signup" ? "signup_with" : "continue_with",
              shape: "rectangular",
              logo_alignment: "left",
              width: buttonRef.current.offsetWidth || 340,
              locale: language === "mr" ? "mr" : language === "hi" ? "hi" : "en",
            });
          }
          setIsLoaded(true);
        } catch (err) {
          console.warn("Google Sign-In initialization error:", err);
          setLoadError(err.message || "Failed to initialize Google Sign-In");
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGsi();
    } else {
      checkInterval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(checkInterval);
          initGsi();
        }
      }, 300);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [clientId, mode, language]);

  if (!clientId) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/70 p-3 text-center text-xs text-gray-500">
        <div className="flex items-center justify-center gap-2 font-semibold text-gray-700 mb-1">
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Google Sign-In Ready</span>
        </div>
        <p className="text-[11px] text-gray-400">
          Paste your Google Client ID into <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">frontend/.env</code> to activate 1-click Google authentication.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        ref={buttonRef}
        id="googleSignInBtn"
        className="w-full flex justify-center min-h-[44px]"
      />
      {loadError && (
        <p className="mt-1 text-center text-[11px] text-red-500 font-medium">
          {loadError}
        </p>
      )}
    </div>
  );
}
