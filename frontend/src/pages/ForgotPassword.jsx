import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  Sprout,
  KeyRound,
  LockKeyhole,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { useApp } from "../context/AppContext";

export default function ForgotPassword({ nav }) {
  const { t, language, changeLanguage } = useApp();

  // Steps: 1 = Email, 2 = OTP, 3 = New Password, 4 = Success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !email.includes("@")) {
      setError(t("enterYourEmail") || "Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 400);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError("");

    if (!otp.trim() || otp.length < 4) {
      setError("Please enter the 6-digit verification code sent to your email.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 400);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 450);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#EAF5E8] via-[#F4F9F2] to-[#E2F3E7] px-4 py-8">
      {/* Ambient background glows */}
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
            <span>← Home</span>
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
              {t("aiPoweredAgriculture") || "AI-Powered Agriculture Platform"}
            </p>
          </div>

          {/* STEP INDICATOR */}
          {step < 4 && (
            <div className="mb-6 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                    step >= 1
                      ? "bg-[#2E7D32] text-white shadow-sm"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  1
                </div>
                <span className="text-[11px] font-semibold text-gray-600">Email</span>
              </div>
              <div className="h-0.5 flex-1 mx-2 bg-[#DCE8D9]" />
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                    step >= 2
                      ? "bg-[#2E7D32] text-white shadow-sm"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  2
                </div>
                <span className="text-[11px] font-semibold text-gray-600">Code</span>
              </div>
              <div className="h-0.5 flex-1 mx-2 bg-[#DCE8D9]" />
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                    step >= 3
                      ? "bg-[#2E7D32] text-white shadow-sm"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  3
                </div>
                <span className="text-[11px] font-semibold text-gray-600">Reset</span>
              </div>
            </div>
          )}

          {/* ERROR ALERT */}
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-xs sm:text-sm font-medium text-red-700">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: ENTER EMAIL */}
          {step === 1 && (
            <div>
              <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-800">
                  Forgot Password?
                </h2>
                <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
                  Enter your registered farmer email to receive a password reset verification code.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("enterYourEmail") || "e.g. farmer@krushimitra.in"}
                      className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-4 py-3 pl-11 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#2E7D32] focus:bg-white focus:ring-4 focus:ring-[#2E7D32]/10"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2E7D32] to-[#10B981] py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(46,125,50,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:opacity-75 cursor-pointer"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: VERIFY CODE */}
          {step === 2 && (
            <div>
              <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-800">
                  Enter Verification Code
                </h2>
                <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
                  We sent a 6-digit code to <strong className="text-gray-700">{email}</strong>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-gray-700">
                      Verification Code
                    </label>
                    <button
                      type="button"
                      onClick={() => setOtp("482910")}
                      className="key-cap text-[10px] py-0.5 px-2 font-bold text-[#2E7D32]"
                    >
                      Fill Demo Code (482910)
                    </button>
                  </div>

                  <div className="relative">
                    <KeyRound
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter 6-digit code"
                      className="w-full tracking-widest text-center rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-4 py-3 pl-11 text-base font-bold text-gray-800 outline-none transition focus:border-[#2E7D32] focus:bg-white focus:ring-4 focus:ring-[#2E7D32]/10"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="key-cap w-1/3 rounded-xl py-3 text-xs font-bold text-gray-700 cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-shimmer flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2E7D32] to-[#10B981] py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(46,125,50,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:opacity-75 cursor-pointer"
                  >
                    {loading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <span>Verify & Continue</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: SET NEW PASSWORD */}
          {step === 3 && (
            <div>
              <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-800">
                  Create New Password
                </h2>
                <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
                  Please choose a strong password for your account.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-gray-700">
                    New Password
                  </label>
                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password (min. 6 characters)"
                      className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-4 py-3 pl-11 pr-11 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#2E7D32] focus:bg-white focus:ring-4 focus:ring-[#2E7D32]/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2E7D32]"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-4 py-3 pl-11 pr-11 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#2E7D32] focus:bg-white focus:ring-4 focus:ring-[#2E7D32]/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2E7D32]"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2E7D32] to-[#10B981] py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(46,125,50,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:opacity-75 cursor-pointer"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <CheckCircle2 size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 4 && (
            <div className="text-center py-2 animate-pop">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E5F7EA] text-[#2E7D32] shadow-sm animate-float">
                <CheckCircle2 size={36} />
              </div>

              <h2 className="mt-4 text-xl font-extrabold text-gray-800">
                Password Successfully Reset!
              </h2>

              <p className="mt-2 text-xs sm:text-sm text-gray-500">
                Your password for <strong className="text-gray-700">{email}</strong> has been updated. You can now log in with your new credentials.
              </p>

              <button
                type="button"
                onClick={() => nav("login")}
                className="btn-shimmer mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2E7D32] to-[#10B981] py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(46,125,50,0.25)] transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95 cursor-pointer"
              >
                <span>Proceed to Login</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* BACK TO LOGIN FOOTER */}
          {step !== 4 && (
            <div className="mt-6 border-t border-[#EEF2EC] pt-4 text-center">
              <button
                type="button"
                onClick={() => nav("login")}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#2E7D32] hover:text-[#1B5E20] hover:underline focus:outline-none cursor-pointer"
              >
                <ArrowLeft size={15} />
                <span>Back to {t("login") || "Login"}</span>
              </button>
            </div>
          )}
        </div>

        {/* SECURITY NOTE */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-gray-500 font-medium">
          <ShieldCheck size={13} className="text-[#2E7D32]" />
          <span>Protected by KrushiMitra Security</span>
        </div>
      </div>
    </div>
  );
}