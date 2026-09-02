import { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sprout,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  CheckCircle2,
} from "lucide-react";

import { useApp } from "../context/AppContext";

export default function Register({ nav }) {
  const { apiRegister, addNotification, t, tDistrict, language, changeLanguage } = useApp();

  const [form, setForm] = useState({
    name: "",
    email: "",
    district: "",
    password: "",
    confirmPassword: "",
    acceptTerms: true,
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const districts = [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana",
    "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna",
    "Kolhapur", "Latur", "Mumbai City", "Nagpur", "Nanded", "Nandurbar", "Nashik",
    "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli",
    "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
  ];

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

  const getPasswordStrength = () => {
    if (!form.password) return 0;
    let score = 0;
    if (form.password.length >= 6) score += 1;
    if (/[A-Z]/.test(form.password)) score += 1;
    if (/[0-9]/.test(form.password)) score += 1;
    if (/[^A-Za-z0-9]/.test(form.password) || form.password.length >= 8) score += 1;
    return score;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password || !form.confirmPassword) {
      setError(t("fillAllFields") || "Please fill all required fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!form.acceptTerms) {
      setError("Please accept the Terms & Privacy policy to continue.");
      return;
    }

    setIsLoading(true);
    const result = await apiRegister({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      district: form.district || "Pune",
      role: "Farmer",
    });
    setIsLoading(false);

    if (result.success) {
      if (addNotification) {
        addNotification(
          "Welcome to KrushiMitra! 🌾",
          `Welcome ${form.name.trim()}! An official onboarding email has been dispatched to ${form.email.trim()}.`,
          "system"
        );
      }
      nav("dashboard");
    } else {
      setError(result.message || "Registration failed. Please try again.");
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#EAF5E8] via-[#F4F9F2] to-[#E2F3E7] px-4 py-8">
      {/* Background Decorative Ambient Glows */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#2E7D32]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-96 w-96 rounded-full bg-[#10B981]/15 blur-3xl" />

      <div className="relative w-full max-w-lg">
        {/* TOP BAR: Home & Language */}
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

        {/* CARD */}
        <div className="rounded-3xl border border-[#DCE8D9] bg-white/95 p-7 sm:p-9 shadow-[0_20px_60px_rgba(46,125,50,0.12)] backdrop-blur-sm">
          {/* BRAND HEADER */}
          <div className="mb-5 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2E7D32] via-[#16A34A] to-[#10B981] text-white shadow-[0_8px_22px_rgba(46,125,50,0.25)]">
              <Sprout size={30} />
            </div>

            <h1 className="mt-3 text-2xl font-extrabold text-[#1B5E20]">
              KrushiMitra
            </h1>

            <p className="mt-0.5 text-xs text-gray-500 font-medium">
              {t("aiPoweredAgriculture") || (language === "mr" ? "स्मार्ट AI कृषी तंत्रज्ञान व्यासपीठ" : language === "hi" ? "स्मार्ट AI कृषि प्रौद्योगिकी मंच" : "AI-Powered Agriculture Platform")}
            </p>
          </div>

          {/* SECTION TITLE */}
          <div className="mb-5 text-left">
            <h2 className="text-xl font-bold text-gray-800">
              {language === "mr" ? "नवीन खाते तयार करा" : language === "hi" ? "नया खाता बनाएं" : "Create New Account"}
            </h2>
            <p className="mt-0.5 text-xs text-gray-500">
              {language === "mr" ? "वैयक्तिक AI पीक सल्ला आणि उत्पादन अंदाज मिळवा" : language === "hi" ? "व्यक्तिगत AI फसल सलाह और उपज अनुमान प्राप्त करें" : "Get personalized AI crop advisory and yield predictions"}
            </p>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-xs sm:text-sm font-medium text-red-700">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* FULL NAME */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                {language === "mr" ? "पूर्ण नाव *" : language === "hi" ? "पूरा नाम *" : "Full Name *"}
              </label>
              <div className="relative">
                <User
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={language === "mr" ? "उदा. रमेश पाटील" : language === "hi" ? "उदा. रमेश पाटिल" : "e.g. Ramesh Patil"}
                  className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-4 py-2.5 pl-10 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#2E7D32] focus:bg-white focus:ring-4 focus:ring-[#2E7D32]/10"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                {t("emailLabel") || (language === "mr" ? "ईमेल पत्ता *" : language === "hi" ? "ईमेल पता *" : "Email Address *")}
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t("enterYourEmail") || "e.g. farmer@krushimitra.in"}
                  className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-4 py-2.5 pl-10 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#2E7D32] focus:bg-white focus:ring-4 focus:ring-[#2E7D32]/10"
                />
              </div>
            </div>

            {/* DISTRICT / REGION */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                {t("district") || (language === "mr" ? "जिल्हा (पर्यायी)" : language === "hi" ? "जिला (वैकल्पिक)" : "District / Region (Optional)")}
              </label>
              <div className="relative">
                <MapPin
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <select
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-4 py-2.5 pl-10 text-sm text-gray-800 outline-none transition focus:border-[#2E7D32] focus:bg-white focus:ring-4 focus:ring-[#2E7D32]/10"
                >
                  <option value="">{t("selectDistrict") || (language === "mr" ? "आपला जिल्हा निवडा" : language === "hi" ? "अपना जिला चुनें" : "Select your district")}</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {tDistrict ? tDistrict(d) : d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                {t("passwordLabel") || (language === "mr" ? "पासवर्ड *" : language === "hi" ? "पासवर्ड *" : "Password *")}
              </label>
              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={language === "mr" ? "किमान ६ अक्षरे" : language === "hi" ? "न्यूनतम 6 अक्षर" : "Min. 6 characters"}
                  className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-4 py-2.5 pl-10 pr-10 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#2E7D32] focus:bg-white focus:ring-4 focus:ring-[#2E7D32]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2E7D32]"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {/* Password strength indicator */}
              {form.password && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <div className="flex flex-1 gap-1">
                    <div className={`h-1 flex-1 rounded-full ${strength >= 1 ? "bg-amber-400" : "bg-gray-200"}`} />
                    <div className={`h-1 flex-1 rounded-full ${strength >= 2 ? "bg-green-500" : "bg-gray-200"}`} />
                    <div className={`h-1 flex-1 rounded-full ${strength >= 3 ? "bg-emerald-600" : "bg-gray-200"}`} />
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">
                    {language === "mr"
                      ? (strength === 1 ? "कमकुवत" : strength === 2 ? "मध्यम" : "मजबूत")
                      : language === "hi"
                      ? (strength === 1 ? "कमजोर" : strength === 2 ? "मध्यम" : "मजबूत")
                      : (strength === 1 ? "Weak" : strength === 2 ? "Medium" : "Strong")}
                  </span>
                </div>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                {language === "mr" ? "पासवर्डची पुष्टी करा *" : language === "hi" ? "पासवर्ड की पुष्टि करें *" : "Confirm Password *"}
              </label>
              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder={language === "mr" ? "पासवर्ड पुन्हा टाका" : language === "hi" ? "पासवर्ड दोबारा दर्ज करें" : "Re-enter your password"}
                  className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-4 py-2.5 pl-10 pr-10 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#2E7D32] focus:bg-white focus:ring-4 focus:ring-[#2E7D32]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2E7D32]"
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* TERMS CHECKBOX */}
            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={form.acceptTerms}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 rounded border-[#DCE8D9] text-[#2E7D32] accent-[#2E7D32] focus:ring-[#2E7D32]"
                />
                <span className="text-xs text-gray-600 leading-snug">
                  {language === "mr"
                    ? "मी कृषीमित्राच्या नियम व गोपनीयता धोरणाशी सहमत आहे."
                    : language === "hi"
                    ? "मैं कृषि मित्र के नियम और गोपनीयता नीति से सहमत हूँ।"
                    : "I agree to KrushiMitra’s Terms of Service and Privacy Policy."}
                </span>
              </label>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-shimmer mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2E7D32] to-[#10B981] py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(46,125,50,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:opacity-75 cursor-pointer"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>{language === "mr" ? "नवीन खाते तयार करा" : language === "hi" ? "खाता बनाएं" : "Create Account"}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* BACK TO LOGIN */}
          <div className="mt-6 border-t border-[#EEF2EC] pt-4 text-center">
            <span className="text-xs sm:text-sm text-gray-500">
              {language === "mr" ? "आधीच खाते आहे का?" : language === "hi" ? "क्या आपका पहले से खाता है?" : "Already have an account?"}
            </span>
            <button
              type="button"
              onClick={() => nav("login")}
              className="ml-1.5 text-xs sm:text-sm font-bold text-[#2E7D32] hover:text-[#1B5E20] hover:underline focus:outline-none cursor-pointer"
            >
              {t("login") || (language === "mr" ? "येथे लॉगिन करा" : language === "hi" ? "यहाँ लॉगिन करें" : "Log In")}
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-gray-500 font-medium">
          <ShieldCheck size={13} className="text-[#2E7D32]" />
          <span>{language === "mr" ? "आपली शेतीविषयक माहिती पूर्णपणे खाजगी आणि सुरक्षित ठेवली जाते" : language === "hi" ? "आपकी कृषि और खेत की जानकारी पूरी तरह सुरक्षित रखी जाती है" : "Your agricultural and farm data is kept private & secure"}</span>
        </div>
      </div>
    </div>
  );
}