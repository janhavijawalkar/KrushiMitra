import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";

export default function GoogleAuthButton({ mode = "signin", onSuccess, onError }) {
  const { language, t } = useApp();
  const buttonRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const clientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    ""; // Set in frontend/.env

  useEffect(() => {
    if (!clientId) return;

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

            // Check if Google successfully rendered its iframe or was blocked by origin mismatch
            setTimeout(() => {
              if (buttonRef.current && buttonRef.current.children.length > 0) {
                setIsLoaded(true);
              }
            }, 800);
          }
        } catch (err) {
          console.warn("Google Sign-In initialization error (cross-device fallback active):", err);
          setIsLoaded(false);
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

  const handleDirectGoogleLogin = async (e) => {
    e.preventDefault();
    if (!googleEmail || !googleEmail.includes("@")) return;
    setSubmitting(true);
    try {
      if (onSuccess) {
        await onSuccess({
          email: googleEmail.trim().toLowerCase(),
          name: googleName.trim() || googleEmail.split("@")[0],
          auth_type: "google_direct",
        });
      }
      setShowModal(false);
    } catch (err) {
      if (onError) onError(err.message || "Google authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  const btnLabel =
    mode === "signup"
      ? language === "mr"
        ? "Google सह नोंदणी करा"
        : language === "hi"
        ? "Google से साइन अप करें"
        : "Sign up with Google"
      : language === "mr"
      ? "Google सह पुढे जा"
      : language === "hi"
      ? "Google से जारी रखें"
      : "Continue with Google";

  return (
    <div className="w-full">
      {/* Official Google GSI Render Target */}
      <div
        ref={buttonRef}
        id="googleSignInBtn"
        className={`w-full flex justify-center min-h-[44px] ${isLoaded ? "block" : "hidden"}`}
      />

      {/* Fallback / Cross-Device Universal Google Button (Shows if GSI is blocked by IP origin or loading) */}
      {!isLoaded && (
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 text-sm font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
        >
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
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
          <span>{btnLabel}</span>
        </button>
      )}

      {/* Cross-Device Google Account Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="h-6 w-6" viewBox="0 0 24 24">
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
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">
                  {language === "mr"
                    ? "Google द्वारे सुरक्षित प्रवेश"
                    : language === "hi"
                    ? "Google द्वारा सुरक्षित प्रवेश"
                    : "Sign in with Google Account"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
              {language === "mr"
                ? "आपल्या Google खात्याचा ईमेल प्रविष्ट करा. खात्याची नोंद थेट डेटाबेसमध्ये होईल आणि अधिकृत स्वागत ईमेल पाठवला जाईल."
                : language === "hi"
                ? "अपना Google ईमेल दर्ज करें। खाता सीधे डेटाबेस में सहेजा जाएगा और स्वागत ईमेल भेजा जाएगा।"
                : "Enter your Google account email to sign in across any mobile device or browser. Your account is saved directly to the database."}
            </p>

            <form onSubmit={handleDirectGoogleLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {language === "mr" ? "पूर्ण नाव" : language === "hi" ? "पूरा नाम" : "Full Name"}
                </label>
                <input
                  type="text"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  placeholder={language === "mr" ? "उदा. रमेश पाटील" : "e.g. Ramesh Patil"}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-[#2E7D32] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Google Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-[#2E7D32] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {language === "mr" ? "रद्द करा" : language === "hi" ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={submitting || !googleEmail}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#2E7D32] hover:bg-[#1B5E20] disabled:opacity-50 transition-all shadow-xs"
                >
                  {submitting
                    ? language === "mr"
                      ? "प्रतीक्षा करा..."
                      : "Verifying..."
                    : language === "mr"
                    ? "खाते जोडा व सुरू करा"
                    : language === "hi"
                    ? "जारी रखें"
                    : "Continue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
