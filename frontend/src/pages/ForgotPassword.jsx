import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  Sprout,
  KeyRound,
  ShieldCheck,
  Send,
  ExternalLink,
} from "lucide-react";

import { useApp } from "../context/AppContext";

export default function ForgotPassword({ nav }) {
  const { t, language, changeLanguage, apiForgotPassword } = useApp();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devInfo, setDevInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !email.includes("@")) {
      setError(t("enterYourEmail") || "Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiForgotPassword(email);
      setLoading(false);

      if (res.success) {
        setSubmitted(true);
        if (res.dev_token || res.dev_reset_url) {
          setDevInfo({
            token: res.dev_token,
            url: res.dev_reset_url,
            isSmtpLive: res.is_smtp_live,
          });
        }
      } else {
        setError(res.message || "Failed to send reset email. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      setError("Server connection error. Please ensure backend is running.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#EAF5E8] via-[#F4F9F2] to-[#E2F3E7] dark:from-[#0D1710] dark:via-[#112015] dark:to-[#0D1710] px-4 py-8">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#2E7D32]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-96 w-96 rounded-full bg-[#10B981]/15 blur-3xl" />

      <div className="relative w-full max-w-lg">
        {/* TOP BAR: Home & Language */}
        <div className="mb-4 flex items-center justify-between px-2">
          <button
            type="button"
            onClick={() => nav?.("landing")}
            className="key-cap flex items-center gap-1.5 text-xs font-bold text-[#2E7D32] dark:text-[#4ADE80] hover:underline cursor-pointer"
          >
            <span>← {t("home") || "Home"}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:inline">
              🌐 {t("language") || "Language"}:
            </span>
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="key-cap px-2.5 py-1 text-xs font-bold text-[#2E7D32] dark:text-[#4ADE80] outline-none cursor-pointer"
            >
              <option value="en">English (EN)</option>
              <option value="hi">हिन्दी (HI)</option>
              <option value="mr">मराठी (MR)</option>
            </select>
          </div>
        </div>

        {/* CARD */}
        <div className="rounded-3xl border border-[#DCE8D9] dark:border-[#24402A] bg-white/95 dark:bg-[#152319]/95 p-7 sm:p-9 shadow-[0_20px_60px_rgba(46,125,50,0.12)] backdrop-blur-sm">
          {/* BRAND HEADER */}
          <div className="mb-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2E7D32] via-[#16A34A] to-[#10B981] text-white shadow-[0_8px_22px_rgba(46,125,50,0.25)]">
              <Sprout size={30} />
            </div>

            <h1 className="mt-3 text-2xl font-extrabold text-[#1B5E20] dark:text-[#4ADE80]">
              KrushiMitra
            </h1>

            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
              {t("aiPoweredAgriculture") || "Smart AI Agriculture Platform"}
            </p>
          </div>

          {!submitted ? (
            <div>
              <div className="mb-6 text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#2E7D32] dark:text-[#4ADE80]">
                  <KeyRound size={20} />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t("forgotPassword") || "Forgot Your Password?"}
                </h2>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  {t("forgotPasswordSub") || "Enter your registered farmer email. We will send you a secure link to reset your password."}
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 dark:border-red-800/60 bg-red-50 dark:bg-red-950/40 p-3 text-xs text-red-700 dark:text-red-300 animate-pop">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-700 dark:text-gray-300">
                    {t("registeredEmail") || "Registered Email Address"}
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="farmer@krushimitra.in"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-[#F6F8F4] dark:bg-[#183321] py-2.5 pl-10 pr-4 text-xs text-gray-900 dark:text-white outline-none transition focus:border-[#2E7D32] focus:bg-white dark:focus:bg-[#152319]"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-xl bg-[#2E7D32] py-3 text-xs font-bold text-white shadow-md hover:bg-[#1B5E20] transition disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span>Sending Reset Link...</span>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>{t("sendResetLink") || "Send Password Reset Link"}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center animate-page-enter">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#2E7D32] dark:text-[#4ADE80] shadow-sm">
                <CheckCircle2 size={32} />
              </div>

              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {language === "mr" ? "पासवर्ड रीसेट लिंक पाठवली आहे!" : language === "hi" ? "पासवर्ड रीसेट लिंक भेजी गई!" : "Password Reset Link Sent!"}
              </h2>

              <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 leading-relaxed max-w-sm mx-auto">
                {language === "mr" ? "आम्ही सुरक्षित पासवर्ड रीसेट सूचना या ईमेलवर पाठवल्या आहेत: " : language === "hi" ? "हमने सुरक्षित पासवर्ड रीसेट निर्देश इस ईमेल पर भेजे हैं: " : "We have sent secure password reset instructions to "}
                <strong className="text-[#1B5E20] dark:text-[#4ADE80] font-bold">{email}</strong>.
              </p>

              <div className="my-5 rounded-2xl bg-emerald-50/80 dark:bg-[#183321]/60 border border-emerald-200 dark:border-emerald-800 p-4 text-left text-xs text-emerald-900 dark:text-emerald-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#1B5E20] dark:text-[#4ADE80]">
                  <ShieldCheck size={16} />
                  <span>{language === "mr" ? "सुरक्षा माहिती:" : language === "hi" ? "सुरक्षा जानकारी:" : "Security Information:"}</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-gray-600 dark:text-gray-300">
                  <li>{language === "mr" ? "रीसेट लिंक ६० मिनिटांसाठी वैध आहे." : language === "hi" ? "रीसेट लिंक 60 मिनट के लिए मान्य है।" : "The reset link is active for 60 minutes."}</li>
                  <li>{language === "mr" ? "इनबॉक्समध्ये न दिसल्यास स्पॅम (Spam) फोल्डर तपासा." : language === "hi" ? "यदि इनबॉक्स में न दिखे तो स्पैम (Spam) फ़ोल्डर देखें।" : "Check your Spam / Junk folder if not visible in primary inbox."}</li>
                  <li>{language === "mr" ? "सुरक्षेसाठी प्रत्येक लिंक फक्त एकदाच वापरता येईल." : language === "hi" ? "सुरक्षा के लिए प्रत्येक लिंक का उपयोग केवल एक बार किया जा सकता है।" : "Each reset link can only be used once for safety."}</li>
                </ul>
              </div>

              {/* DEV PREVIEW HELPER (ONLY WHEN SMTP IS NOT CONFIGURED) */}
              {!devInfo?.isSmtpLive && devInfo?.token ? (
                <div className="my-4 rounded-xl border border-dashed border-emerald-400 bg-[#F4F9F2] dark:bg-[#112015] p-3.5 text-left text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1B5E20] dark:text-[#4ADE80]">
                      🛠️ Instant Reset Link (Dev Preview):
                    </span>
                    <span className="text-[10px] text-gray-500">Auto Generated</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      nav?.("reset-password", { token: devInfo.token });
                    }}
                    className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#2E7D32] px-3 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1B5E20] cursor-pointer"
                  >
                    <span>Click to Set New Password Now</span>
                    <ExternalLink size={13} />
                  </button>
                </div>
              ) : null}

              <div className="mt-6 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setError("");
                  }}
                  className="text-xs font-bold text-gray-500 hover:text-[#2E7D32] dark:text-gray-400 dark:hover:text-[#4ADE80] transition cursor-pointer"
                >
                  {language === "mr" ? "ईमेल मिळाला नाही का? पुन्हा विनंती पाठवा" : language === "hi" ? "ईमेल नहीं मिला? दोबारा अनुरोध भेजें" : "Did not receive email? Resend request"}
                </button>
              </div>
            </div>
          )}

          {/* BACK TO LOGIN FOOTER */}
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700/60 pt-4 text-center">
            <button
              type="button"
              onClick={() => nav?.("login")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E7D32] dark:text-[#4ADE80] hover:underline cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>{t("backToLogin") || (language === "mr" ? "लॉगिनकडे परत जा" : language === "hi" ? "लॉगिन पर वापस जाएं" : "Back to Login")}</span>
            </button>
          </div>
        </div>

        {/* SECURITY NOTE */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-gray-500 font-medium">
          <ShieldCheck size={13} className="text-[#2E7D32]" />
          <span>{language === "mr" ? "कृषीमित्र सुरक्षा प्रणालीद्वारे संरक्षित" : language === "hi" ? "कृषि मित्र सुरक्षा द्वारा संरक्षित" : "Protected by KrushiMitra Security"}</span>
        </div>
      </div>
    </div>
  );
}