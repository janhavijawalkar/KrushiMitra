import { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sprout,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useApp } from "../context/AppContext";
import GoogleAuthButton from "../components/GoogleAuthButton";

export default function Login({ nav }) {
  const { login, apiLogin, apiGoogleAuth, addNotification, t, language, changeLanguage } = useApp();

  const [form, setForm] = useState(() => ({
    email: (typeof window !== "undefined" ? localStorage.getItem("krushimitra_remembered_email") : "") || "",
    password: "",
    rememberMe: true,
  }));

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError(t("loginRequired") || "Please enter email and password.");
      return;
    }

    setIsLoading(true);
    const result = await apiLogin(form.email.trim(), form.password);
    setIsLoading(false);

    if (result.success) {
      if (typeof window !== "undefined") {
        if (form.rememberMe) {
          localStorage.setItem("krushimitra_remembered_email", form.email.trim());
        } else {
          localStorage.removeItem("krushimitra_remembered_email");
        }
      }
      nav("dashboard");
    } else {
      setError(result.message || "Invalid credentials. Please verify your email and password.");
    }
  };

  const handleGoogleSuccess = async (credential) => {
    setIsLoading(true);
    setError("");
    const res = await apiGoogleAuth(credential);
    setIsLoading(false);
    if (res.success) {
      if (addNotification) {
        addNotification(
          "Welcome to KrushiMitra! 🌾",
          `Authenticated with Google as ${res.user?.name || res.user?.email}.`,
          "system"
        );
      }
      nav("dashboard");
    } else {
      setError(res.message || "Google Sign-In failed. Please try again.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#EAF5E8] via-[#F4F9F2] to-[#E2F3E7] px-4 py-8">
      {/* Background Decorative Ambient Glows */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#2E7D32]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-96 w-96 rounded-full bg-[#10B981]/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-white/40 blur-2xl" />

      <div className="relative w-full max-w-lg">
        {/* TOP BAR: Home & Language Switcher */}
        <div className="mb-4 flex items-center justify-between px-2">
          <button
            type="button"
            onClick={() => nav?.("landing")}
            className="key-cap flex items-center gap-1.5 text-xs font-bold text-[#2E7D32] hover:underline cursor-pointer"
          >
            <span>← {t("home") || (language === "mr" ? "मुख्यपृष्ठ" : language === "hi" ? "होम" : "Home")}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium hidden sm:inline">🌐 {t("language") || "Language"}:</span>
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="key-cap px-2.5 py-1 text-xs font-bold text-[#2E7D32] outline-none cursor-pointer"
            >
              <option value="en">English (EN)</option>
              <option value="hi">हिन्दी (HI)</option>
              <option value="mr">मराठी (MR)</option>
            </select>
          </div>
        </div>

        {/* MAIN LOGIN CARD */}
        <div className="rounded-3xl border border-[#DCE8D9] bg-white/95 p-7 sm:p-9 shadow-[0_20px_60px_rgba(46,125,50,0.12)] backdrop-blur-sm">
          {/* BRAND HEADER */}
          <div className="mb-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2E7D32] via-[#16A34A] to-[#10B981] text-white shadow-[0_8px_24px_rgba(46,125,50,0.28)] transition-transform duration-300 hover:scale-105">
              <Sprout size={34} strokeWidth={2.2} />
            </div>

            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1B5E20]">
              KrushiMitra
            </h1>

            <p className="mt-1 text-xs sm:text-sm font-medium text-gray-500">
              {t("aiPoweredAgriculture") || "AI-Powered Agriculture Platform"}
            </p>
          </div>

          {/* SECTION TITLE */}
          <div className="mb-5 text-left">
            <h2 className="text-xl font-bold text-gray-800">
              {t("welcomeBack") || "Welcome Back"}
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
              {t("loginToContinue") || "Login to access crop prediction, recommendations, and analytics"}
            </p>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-xs sm:text-sm font-medium text-red-700">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* EMAIL FIELD */}
            <div>
              <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-gray-700">
                {t("emailLabel") || "Email Address"}
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t("enterYourEmail") || "e.g. farmer@krushimitra.in"}
                  className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-4 py-3 pl-11 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#2E7D32] focus:bg-white focus:ring-4 focus:ring-[#2E7D32]/10"
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs sm:text-sm font-semibold text-gray-700">
                  {t("passwordLabel") || "Password"}
                </label>
                <button
                  type="button"
                  onClick={() => nav("forgot")}
                  className="text-xs font-semibold text-[#2E7D32] hover:text-[#1B5E20] hover:underline focus:outline-none"
                >
                  {t("forgotPassword") || "Forgot Password?"}
                </button>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={t("enterYourPassword") || "Enter your password"}
                  className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-4 py-3 pl-11 pr-11 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#2E7D32] focus:bg-white focus:ring-4 focus:ring-[#2E7D32]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition hover:text-[#2E7D32]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* REMEMBER ME */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={form.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-[#DCE8D9] text-[#2E7D32] accent-[#2E7D32] focus:ring-[#2E7D32]"
                />
                <span className="text-xs text-gray-600 font-medium">
                  {t("rememberMe") || (language === "mr" ? "माझे लॉगिन लक्षात ठेवा" : language === "hi" ? "मुझे याद रखें" : "Remember my session")}
                </span>
              </label>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-shimmer btn-glow mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2E7D32] to-[#10B981] py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(46,125,50,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(46,125,50,0.3)] active:scale-95 disabled:opacity-75 cursor-pointer"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>{t("login") || (language === "mr" ? "खात्यात लॉगिन करा" : language === "hi" ? "खाते में लॉगिन करें" : "Login to Account")}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* OR DIVIDER */}
          <div className="my-4 flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-gray-200" />
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              {language === "mr" ? "किंवा" : language === "hi" ? "अथवा" : "or continue with"}
            </span>
            <div className="h-[1px] flex-1 bg-gray-200" />
          </div>

          {/* GOOGLE SIGN-IN BUTTON */}
          <GoogleAuthButton
            mode="signin"
            onSuccess={handleGoogleSuccess}
            onError={(msg) => setError(msg)}
          />

          {/* REGISTER LINK */}
          <div className="mt-6 border-t border-[#EEF2EC] pt-4 text-center">
            <span className="text-xs sm:text-sm text-gray-500">
              {t("dontHaveAccount") || (language === "mr" ? "नवीन शेतकरी आहात का?" : language === "hi" ? "क्या आपका खाता नहीं है?" : "Don't have an account?")}
            </span>
            <button
              type="button"
              onClick={() => nav("register")}
              className="ml-1.5 text-xs sm:text-sm font-bold text-[#2E7D32] hover:text-[#1B5E20] hover:underline focus:outline-none cursor-pointer"
            >
              {t("register") || (language === "mr" ? "नवीन खाते तयार करा" : language === "hi" ? "नया खाता बनाएं" : "Create an Account")}
            </button>
          </div>
        </div>

        {/* TRUST BADGES / FOOTER */}
        <div className="mt-4 flex items-center justify-center gap-6 text-[11px] font-medium text-gray-500">
          <div className="flex items-center gap-1">
            <ShieldCheck size={13} className="text-[#2E7D32]" />
            <span>{language === "mr" ? "सुरक्षित शेतकरी प्रवेश" : language === "hi" ? "सुरक्षित किसान पहुंच" : "Secure Access"}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Sprout size={13} className="text-[#2E7D32]" />
            <span>{language === "mr" ? "स्मार्ट AI कृषी तंत्रज्ञान" : language === "hi" ? "स्मार्ट AI कृषि तकनीक" : "ML Crop Intelligence"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}