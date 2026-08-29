import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Sprout,
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  KeyRound,
} from "lucide-react";

import { useApp } from "../context/AppContext";

export default function ResetPassword({ nav, token: initialToken }) {
  const { t, language, changeLanguage, apiVerifyResetToken, apiResetPassword } = useApp();

  // Extract token from prop or from current URL query params
  const [token, setToken] = useState(initialToken || "");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let tkn = initialToken;
    if (!tkn) {
      const params = new URLSearchParams(window.location.search);
      tkn = params.get("reset_token") || params.get("token") || "";
    }
    setToken(tkn);

    if (!tkn) {
      setVerifying(false);
      setTokenValid(false);
      setTokenError("No reset token provided. Please use the link from your email.");
      return;
    }

    // Verify token validity with backend
    const checkToken = async () => {
      setVerifying(true);
      try {
        const res = await apiVerifyResetToken(tkn);
        setVerifying(false);
        if (res.valid) {
          setTokenValid(true);
          setVerifiedEmail(res.email || "");
        } else {
          setTokenValid(false);
          setTokenError(res.message || "This password reset link is invalid or has expired.");
        }
      } catch (err) {
        setVerifying(false);
        setTokenValid(false);
        setTokenError("Unable to connect to verification server.");
      }
    };

    checkToken();
  }, [initialToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill out both password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiResetPassword(token, newPassword);
      setLoading(false);
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.message || "Failed to reset password. Token may have expired.");
      }
    } catch (err) {
      setLoading(false);
      setError("Server connection error during password reset.");
    }
  };

  // Password strength calculation
  const getStrength = (pass) => {
    let score = 0;
    if (pass.length >= 6) score += 25;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const strength = getStrength(newPassword);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#EAF5E8] via-[#F4F9F2] to-[#E2F3E7] dark:from-[#0D1710] dark:via-[#112015] dark:to-[#0D1710] px-4 py-8">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#2E7D32]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-96 w-96 rounded-full bg-[#10B981]/15 blur-3xl" />

      <div className="relative w-full max-w-lg">
        {/* TOP BAR */}
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
              Account Security & Password Reset
            </p>
          </div>

          {verifying ? (
            <div className="py-8 text-center space-y-3">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-3 border-[#2E7D32] border-t-transparent" />
              <p className="text-xs font-bold text-gray-600 dark:text-gray-300">
                Verifying password reset authorization token...
              </p>
            </div>
          ) : !tokenValid ? (
            <div className="text-center py-4 space-y-4 animate-page-enter">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
                <AlertTriangle size={30} />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Invalid or Expired Link
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed max-w-sm mx-auto">
                {tokenError || "This password reset token has expired or has already been used. Please request a fresh reset link."}
              </p>
              <button
                type="button"
                onClick={() => nav?.("forgot")}
                className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-xl bg-[#2E7D32] py-3 text-xs font-bold text-white shadow-md hover:bg-[#1B5E20] transition cursor-pointer"
              >
                <span>Request New Reset Link</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : success ? (
            <div className="text-center py-4 space-y-4 animate-page-enter">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E5F7EA] dark:bg-[#183321] text-[#2E7D32] dark:text-[#4ADE80] shadow-sm">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Password Reset Successfully! 🎉
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
                  Your new password is now active for <strong className="text-gray-800 dark:text-gray-200">{verifiedEmail}</strong>. You can sign in immediately.
                </p>
              </div>

              <button
                type="button"
                onClick={() => nav?.("login")}
                className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-xl bg-[#2E7D32] py-3 text-xs font-bold text-white shadow-md hover:bg-[#1B5E20] transition cursor-pointer"
              >
                <span>Proceed to Login</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-6 text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#2E7D32] dark:text-[#4ADE80]">
                  <KeyRound size={20} />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Create New Password
                </h2>
                {verifiedEmail && (
                  <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-[#183321] py-1 px-3 rounded-lg inline-block border border-emerald-200 dark:border-emerald-800">
                    Account: {verifiedEmail}
                  </p>
                )}
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 dark:border-red-800/60 bg-red-50 dark:bg-red-950/40 p-3 text-xs text-red-700 dark:text-red-300 animate-pop">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <div className="relative">
                    <LockKeyhole
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-[#F6F8F4] dark:bg-[#183321] py-2.5 pl-10 pr-10 text-xs text-gray-900 dark:text-white outline-none transition focus:border-[#2E7D32] focus:bg-white dark:focus:bg-[#152319]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="h-1 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            strength <= 25
                              ? "bg-red-500 w-1/4"
                              : strength <= 50
                              ? "bg-amber-500 w-2/4"
                              : strength <= 75
                              ? "bg-blue-500 w-3/4"
                              : "bg-emerald-500 w-full"
                          }`}
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 text-right">
                        Strength: {strength <= 25 ? "Weak" : strength <= 50 ? "Fair" : strength <= 75 ? "Good" : "Strong"}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-700 dark:text-gray-300">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <LockKeyhole
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-[#F6F8F4] dark:bg-[#183321] py-2.5 pl-10 pr-10 text-xs text-gray-900 dark:text-white outline-none transition focus:border-[#2E7D32] focus:bg-white dark:focus:bg-[#152319]"
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
                    <span>Updating Password...</span>
                  ) : (
                    <>
                      <ShieldCheck size={15} />
                      <span>Save New Password</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
