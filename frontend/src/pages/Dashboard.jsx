import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Sprout,
  TrendingUp,
  Target,
  CloudSun,
  AlertTriangle,
  ShieldAlert,
  Megaphone,
  X,
} from "lucide-react";

import StatCard from "../components/StatCard";
import { useApp } from "../context/AppContext";

function formatHistoryDate(dateStr) {
  if (!dateStr) return "—";
  if (typeof dateStr === "string") {
    const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, yyyy, mm, dd] = match;
      return `${dd}/${mm}/${yyyy}`;
    }
  }
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  } catch {
    return "—";
  }
}

export default function Dashboard({ nav }) {
  const {
    user,
    language,
    t,
    tCrop,
    tDistrict,
    predictionHistory,
    recommendationHistory,
    farmerBroadcastAlerts,
    readBroadcastIds,
    markBroadcastAsRead,
    getLocalizedBroadcast,
  } = useApp();

  const [dismissedAlertIds, setDismissedAlertIds] = useState([]);
  const [expandedAlertId, setExpandedAlertId] = useState(null);

  const name = user?.name || (user?.role === "Admin" ? "Admin" : "Farmer");
  const userRole = user?.role || "Farmer";
  const userDistrictRaw = user?.district || "Amravati";
  const userDistrict = tDistrict ? tDistrict(userDistrictRaw) : userDistrictRaw;
  const userFarmSize = user?.farmSize
    ? `${user.farmSize} ${t("acresUnit") || user?.farmUnit || "Acres"}`
    : t("farmlandProfileBadge") || "Farmland Profile";

  const userEmail = user?.email?.toLowerCase()?.trim();

  // Filter history strictly for the logged-in user (or all if Super-Admin)
  const userPredictions =
    userRole === "Admin"
      ? predictionHistory
      : predictionHistory.filter(
          (p) => p.user_email && p.user_email.toLowerCase() === userEmail
        );

  const userRecommendations =
    userRole === "Admin"
      ? recommendationHistory
      : recommendationHistory.filter(
          (r) => r.user_email && r.user_email.toLowerCase() === userEmail
        );

  const recentPredictions = userPredictions.slice(0, 4);
  const totalPredictions = userPredictions.length;

  const uniqueCrops = new Set(
    userPredictions.map((item) => item.crop)
  ).size;

  const averageProductivity = (() => {
    if (!userPredictions.length) {
      return "—";
    }

    const total = userPredictions.reduce(
      (sum, item) => sum + Number(item.productivity || 0),
      0
    );

    return `${(total / userPredictions.length).toFixed(2)} t/ha`;
  })();

  const latestRecommendation = userRecommendations.length
    ? userRecommendations[0]
    : null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) {
      return t("goodMorning") || "Good Morning";
    }
    if (hour >= 12 && hour < 17) {
      return t("goodAfternoon") || "Good Afternoon";
    }
    if (hour >= 17 && hour < 22) {
      return t("goodEvening") || "Good Evening";
    }
    return t("goodNight") || "Namaste";
  };

  const bannerSubtitle =
    userRole === "Admin"
      ? t("dashboardAdminBannerSub") ||
        "Administrator Overview: Monitor ML inference throughput, registered farmers directory, and system health."
      : (t("dashboardFarmerBannerSub") || "Smart AI Agronomy Dashboard for your farm in {district}. Get instant crop predictions, nutrient advisories, and weather forecasts.").replace("{district}", userDistrict);

  const visibleAlerts = (farmerBroadcastAlerts || []).filter(
    (a) => !dismissedAlertIds.includes(a.broadcast_id || a.id)
  );

  return (
    <div className="space-y-6">

      {/* =====================================================
          HERO GREETING BANNER (TOP ELEMENT)
      ===================================================== */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#10B981] p-7 text-white shadow-[0_16px_40px_rgba(46,125,50,0.22)] animate-zoom-fade depth-3">

        <div className="pointer-events-none absolute -right-10 -top-16 h-52 w-52 rounded-full bg-white/15 blur-2xl animate-float-slow" />

        <div className="pointer-events-none absolute -bottom-20 right-28 h-44 w-44 rounded-full bg-[#B9E8B8]/15 blur-3xl" />

        <div className="relative z-10">

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold backdrop-blur-md transition-transform hover:scale-105">
              📍 {userDistrict} {t("districtBadgeSuffix") || "District"}
            </span>
            <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold backdrop-blur-md transition-transform hover:scale-105">
              🌾 {userFarmSize}
            </span>
            <span className="rounded-full bg-emerald-900/40 px-3 py-0.5 text-xs font-bold backdrop-blur-md border border-white/20 transition-transform hover:scale-105">
              {userRole === "Admin" ? (t("superAdminBadge") || "🛡️ Super-Admin") : (t("registeredFarmerBadge") || "🌾 Registered Farmer")}
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {getGreeting()}, {name} 👋
          </h1>

          <p className="mt-2 max-w-xl text-xs leading-6 text-green-50/90 sm:text-sm">
            {bannerSubtitle}
          </p>

          <button
            onClick={() => nav?.("prediction")}
            className="btn-shimmer btn-glow mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-[#2E7D32] shadow-[0_8px_25px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#F7FFF5] active:scale-95 cursor-pointer"
          >
            <Sprout size={15} />
            {t("makePrediction")}
            <ArrowRight size={14} />
          </button>

        </div>
      </section>


      {/* =====================================================
          DISTRICT-WISE ADVISORY & EMERGENCY ALERTS (SLEEK RIBBON)
      ===================================================== */}
      {visibleAlerts.length > 0 && (
        <div className="space-y-2.5 animate-zoom-fade">
          {visibleAlerts.map((rawAlert) => {
            const alertKey = String(rawAlert.broadcast_id || rawAlert.id);
            const alert = getLocalizedBroadcast(rawAlert, language);
            const sev = (alert.severity || "advisory").toLowerCase();
            const isCritical = sev === "critical";
            const isWarning = sev === "warning";
            const isExpanded = expandedAlertId === alertKey;

            return (
              <div
                key={alertKey}
                className={`rounded-2xl border transition-all duration-200 shadow-2xs ${
                  isCritical
                    ? "border-red-200 bg-red-50/90 text-red-950"
                    : isWarning
                    ? "border-amber-200 bg-amber-50/90 text-amber-950"
                    : "border-emerald-200 bg-emerald-50/90 text-emerald-950"
                }`}
              >
                {/* Sleek Alert Header Row */}
                <div className="flex items-center justify-between gap-3 p-3 sm:px-4 sm:py-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl shadow-2xs ${
                        isCritical
                          ? "bg-red-600 text-white animate-pulse"
                          : isWarning
                          ? "bg-amber-500 text-white"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      {isCritical ? (
                        <ShieldAlert size={16} />
                      ) : isWarning ? (
                        <AlertTriangle size={16} />
                      ) : (
                        <Megaphone size={16} />
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                            isCritical
                              ? "bg-red-600 text-white"
                              : isWarning
                              ? "bg-amber-500 text-white"
                              : "bg-emerald-600 text-white"
                          }`}
                        >
                          {alert.severityLabel}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-500">
                          📍 {alert.districtLabel}
                        </span>
                        {alert.cropLabel && (
                          <span className="text-[10px] font-semibold text-gray-500">
                            • 🌾 {alert.cropLabel}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold truncate mt-0.5 text-gray-900">
                        {alert.title}
                      </h4>
                    </div>
                  </div>

                  {/* Actions (View Advice Toggle + Dismiss) */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setExpandedAlertId(isExpanded ? null : alertKey)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition cursor-pointer ${
                        isCritical
                          ? "text-red-700 bg-white/70 hover:bg-white"
                          : isWarning
                          ? "text-amber-800 bg-white/70 hover:bg-white"
                          : "text-emerald-800 bg-white/70 hover:bg-white"
                      }`}
                    >
                      {isExpanded
                        ? (language === "mr" ? "कमी करा ▲" : language === "hi" ? "कम करें ▲" : "Hide ▲")
                        : (language === "mr" ? "सल्ला पहा ▼" : language === "hi" ? "सलाह देखें ▼" : "View Advice ▼")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDismissedAlertIds((prev) => [...prev, alertKey]);
                        markBroadcastAsRead(alertKey);
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-black/5 hover:text-gray-700 transition cursor-pointer"
                      title={language === "mr" ? "बंद करा" : language === "hi" ? "हटाएं" : "Dismiss"}
                      aria-label="Dismiss"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* Expandable Advisory Body & Remedy */}
                {isExpanded && (
                  <div className="border-t border-inherit/40 px-4 pb-3 pt-2.5 text-xs text-gray-800 space-y-2 bg-white/70 rounded-b-2xl">
                    <p className="leading-relaxed">
                      {alert.message}
                    </p>

                    {alert.remedy && (
                      <div className="rounded-xl bg-[#F0FDF4] border border-emerald-200 p-2.5 text-emerald-950 font-medium flex items-start gap-2">
                        <span className="text-base shrink-0">🌱</span>
                        <div className="flex-1 text-[11px] sm:text-xs">
                          <strong className="text-emerald-800 font-bold block mb-0.5">
                            {language === "mr" ? "कृषी उपाययोजना / शिफारस:" : language === "hi" ? "कृषि उपाय / सिफारिश:" : "Recommended Agricultural Remedy:"}
                          </strong>
                          {alert.remedy}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-gray-100">
                      <span>
                        {alert.author_name
                          ? `✍️ ${alert.author_name}${alert.author_designation ? ` (${alert.author_designation})` : ""}`
                          : "✍️ कृषी विभाग (Agriculture Department)"}
                      </span>
                      <span>
                        {alert.created_at ? formatHistoryDate(alert.created_at) : ""}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          icon="🔮"
          title={t("totalPredictions")}
          value={totalPredictions}
          change={
            totalPredictions
              ? (t("liveBadge") || "Live")
              : "—"
          }
        />

        <StatCard
          icon="🧪"
          title={t("soilAdvisories") || "Soil Recommendations"}
          value={userRecommendations.length || "—"}
          change={
            userRecommendations.length
              ? (t("liveBadge") || "Live")
              : "—"
          }
        />

        <StatCard
          icon="🌾"
          title={t("cropsAnalyzed")}
          value={uniqueCrops || "—"}
          change={
            uniqueCrops
              ? (t("liveBadge") || "Live")
              : "—"
          }
        />

        <StatCard
          icon="📈"
          title={t("averagePredictedYield")}
          value={averageProductivity}
          change={
            userPredictions.length
              ? (t("liveBadge") || "Live")
              : "—"
          }
        />

      </section>


      {/* =====================================================
          QUICK INSIGHTS
      ===================================================== */}

      <section className="grid gap-4 lg:grid-cols-3">

        {/* Average Productivity */}

        <div className="card card-interactive p-5 group">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3E6] text-[#2E7D32] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-xs">
              <TrendingUp size={19} />
            </div>

            <div>

              <p className="text-[11px] font-medium text-gray-400">
                {t("averagePredictedYield")}
              </p>

              <h3 className="mt-1 text-xl font-extrabold text-[#1F2937] group-hover:text-[#2E7D32] transition-colors">
                {averageProductivity}
              </h3>

            </div>

          </div>

          <p className="mt-4 text-[10px] text-gray-400">
            {userPredictions.length
              ? `${userPredictions.length} ${t(
                  "totalPredictions"
                )}`
              : t("noData")}
          </p>

        </div>


        {/* Latest Recommendation */}

        <div className="card card-interactive p-5 group">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3E6] text-[#2E7D32] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-xs">
              <Sprout size={19} />
            </div>

            <div>

              <p className="text-[11px] font-medium text-gray-400">
                {t("latestRecommendation")}
              </p>

              <h3 className="mt-1 text-lg font-extrabold text-[#1F2937] group-hover:text-[#2E7D32] transition-colors">
                {latestRecommendation?.crop ? tCrop(latestRecommendation.crop) : "—"}
              </h3>

            </div>

          </div>

          <p className="mt-4 text-[11px] leading-5 text-gray-500">
            {latestRecommendation
              ? t("basedOnSoilWeather")
              : t("noData")}
          </p>

          <button
            onClick={() =>
              nav?.("recommendation")
            }
            className="key-cap mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#2E7D32] cursor-pointer"
          >
            <span>{t("getNewRecommendation")}</span>
            <ArrowRight size={13} />
          </button>

        </div>


        {/* Weather & Farm Advisory */}
        <div className="card card-interactive p-5 group">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3E6] text-[#2E7D32] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-xs">
              <CloudSun size={19} />
            </div>
            <div>
              <p className="text-[11px] font-medium text-gray-400">
                {t("weatherAdvisory") || "Farm Weather Outlook"}
              </p>
              <h3 className="mt-1 text-lg font-extrabold text-[#1F2937] group-hover:text-[#2E7D32] transition-colors">
                {userDistrict}
              </h3>
            </div>
          </div>

          <p className="mt-4 text-[11px] leading-5 text-gray-500">
            {(t("dashboardWeatherCardSub") || "Real-time district weather data, humidity alerts, and customized farming advice for {district}.").replace("{district}", userDistrict)}
          </p>

          <button
            onClick={() => nav?.("weather")}
            className="key-cap mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#2E7D32] cursor-pointer"
          >
            <span>{t("viewWeather") || "View Weather & Forecast"}</span>
            <ArrowRight size={13} />
          </button>
        </div>

      </section>


      {/* =====================================================
          RECENT PREDICTIONS
      ===================================================== */}

      <section className="card overflow-hidden">

        <div className="flex flex-col gap-3 border-b border-[#E2EAE0] p-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3E6] text-[#2E7D32]">
              <TrendingUp size={19} />
            </div>

            <div>

              <h2 className="text-sm font-bold text-gray-800">
                {t("recentPredictions")}
              </h2>

              <p className="mt-1 text-[11px] text-gray-400">
                {t("latestPredictions")}
              </p>

            </div>

          </div>

          <button
            onClick={() => nav?.("history")}
            className="key-cap inline-flex items-center gap-1.5 self-start text-[11px] font-bold text-[#2E7D32] transition cursor-pointer"
          >
            <span>{t("viewAll")}</span>
            <ArrowRight size={13} />
          </button>

        </div>


        {recentPredictions.length === 0 ? (

          <div className="p-10 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF3E6] text-2xl">
              🌾
            </div>

            <p className="mt-4 text-sm font-bold text-gray-700">
              {t("noPredictionsFound")}
            </p>

            <button
              onClick={() => nav?.("prediction")}
              className="mt-3 text-xs font-bold text-[#2E7D32] hover:underline"
            >
              {t("makePrediction")}
            </button>

          </div>

        ) : (

          <>

            {/* DESKTOP */}

            <div className="hidden overflow-x-auto md:block">

              <table className="w-full text-left">

                <thead>

                  <tr className="bg-[#F8FAF7] text-[10px] uppercase tracking-wide text-gray-400">

                    <th className="px-5 py-3">
                      {t("crop")}
                    </th>

                    <th className="px-5 py-3">
                      {t("location")}
                    </th>

                    <th className="px-5 py-3">
                      {t("yield")}
                    </th>

                    <th className="px-5 py-3">
                      {t("status")}
                    </th>

                    <th className="px-5 py-3">
                      {t("date")}
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {recentPredictions.map((item) => (

                    <tr
                      key={item.id}
                      className="border-t border-[#EEF2EC] text-xs transition-colors hover:bg-[#FAFCF9]"
                    >

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0F7ED]">
                            🌾
                          </span>

                          <span className="font-bold text-gray-700">
                            {tCrop(item.crop)}
                          </span>

                        </div>

                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <MapPin size={13} />
                          {tDistrict ? tDistrict(item.district) : item.district}
                        </div>
                      </td>

                      <td className="px-5 py-4 font-bold text-gray-700">
                        {Number(
                          item.productivity
                        ).toFixed(2)}{" "}
                        {language === "mr" ? "टन/हेक्टर" : language === "hi" ? "टन/हेक्टेयर" : "t/ha"}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0FDF4] px-2.5 py-1 text-[10px] font-semibold text-[#15803D]">
                          <CheckCircle2 size={11} />
                          {t("completedStatus") || "Completed"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <Clock3 size={12} />
                          {formatHistoryDate(item.createdAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE */}
            <div className="divide-y divide-[#EEF2EC] md:hidden">
              {recentPredictions.map((item) => (
                <div
                  key={item.id}
                  className="p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          🌾
                        </span>
                        <h3 className="text-sm font-bold text-gray-800">
                          {tCrop(item.crop)}
                        </h3>
                      </div>

                      <p className="mt-1 text-[11px] text-gray-400">
                        {tDistrict ? tDistrict(item.district) : item.district} •{" "}
                        {formatHistoryDate(item.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-[#F8FAF7] p-3">
                      <p className="text-[10px] text-gray-400">
                        {t("predictedYield")}
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-700">
                        {Number(
                          item.productivity
                        ).toFixed(2)}{" "}
                        {language === "mr" ? "टन/हेक्टर" : language === "hi" ? "टन/हेक्टेयर" : "t/ha"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#F8FAF7] p-3">
                      <p className="text-[10px] text-gray-400">
                        {t("status")}
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-sm font-bold text-[#15803D]">
                        <CheckCircle2 size={14} />
                        {t("completedStatus") || "Completed"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </>

        )}

      </section>

    </div>
  );
}