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
          DISTRICT-WISE ADVISORY & EMERGENCY BROADCAST ALERTS
      ===================================================== */}
      {visibleAlerts.length > 0 && (
        <div className="space-y-3 animate-zoom-fade">
          {visibleAlerts.map((alert) => {
            const isCritical = alert.severity === "Critical";
            const isWarning = alert.severity === "Warning";
            const alertKey = alert.broadcast_id || alert.id;
            const isExpanded = expandedAlertId === alertKey;

            return (
              <div
                key={alertKey}
                className={`relative overflow-hidden rounded-3xl border-2 p-4 sm:p-5 shadow-lg transition-all duration-300 ${
                  isCritical
                    ? "border-red-500/90 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-red-500/25 ring-2 ring-red-400/30"
                    : isWarning
                    ? "border-amber-400/90 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white shadow-amber-500/25 ring-2 ring-amber-400/30"
                    : "border-emerald-500/90 bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#16A34A] text-white shadow-emerald-500/25 ring-2 ring-emerald-400/30"
                }`}
              >
                {/* Background pulse glow */}
                {isCritical && (
                  <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/20 blur-xl animate-pulse" />
                )}

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    {/* ICON */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-md ${
                        isCritical
                          ? "bg-white text-red-600 animate-bounce"
                          : isWarning
                          ? "bg-white text-amber-600"
                          : "bg-white text-[#1B5E20]"
                      }`}
                    >
                      {isCritical ? (
                        <ShieldAlert size={22} className="stroke-[2.5]" />
                      ) : isWarning ? (
                        <AlertTriangle size={22} className="stroke-[2.5]" />
                      ) : (
                        <Megaphone size={22} className="stroke-[2.5]" />
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-full bg-black/25 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">
                          {isCritical
                            ? "🚨 EMERGENCY ALERT"
                            : isWarning
                            ? "⚠️ HIGH CAUTION"
                            : "📢 OFFICIAL ADVISORY"}
                        </span>
                        <span className="rounded-full bg-white/25 px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
                          <MapPin size={10} />
                          <span>{alert.district === "All" ? "All Maharashtra" : `${alert.district} District`}</span>
                        </span>
                        {alert.crop && alert.crop !== "All" && (
                          <span className="rounded-full bg-white/25 px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-xs">
                            🌾 {alert.crop}
                          </span>
                        )}
                        <span className="text-[10px] opacity-80">
                          {alert.category}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-black leading-snug">
                        {alert.title}
                      </h3>

                      <p className={`text-xs leading-relaxed text-white/95 ${!isExpanded ? "line-clamp-2" : ""}`}>
                        {alert.message}
                      </p>

                      {alert.action_recommendation && (
                        <div className="mt-2 rounded-xl bg-black/20 backdrop-blur-md p-2.5 border border-white/25 text-xs font-semibold flex items-start gap-1.5">
                          <CheckCircle2 size={15} className="shrink-0 text-white mt-0.5" />
                          <span>
                            <strong>Recommended Remedy / कृषी सल्ला:</strong> {alert.action_recommendation}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-1 text-[10px] text-white/80">
                        <span>Issued by: {alert.created_by}</span>
                        {alert.message && alert.message.length > 100 && (
                          <button
                            type="button"
                            onClick={() => setExpandedAlertId(isExpanded ? null : alertKey)}
                            className="underline font-bold text-white ml-2 cursor-pointer"
                          >
                            {isExpanded ? "Show Less ▲" : "Read Full Bulletin ▼"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* DISMISS BUTTON */}
                  <button
                    type="button"
                    onClick={() => setDismissedAlertIds([...dismissedAlertIds, alertKey])}
                    className="self-end sm:self-start flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition active:scale-90 cursor-pointer"
                    title="Dismiss alert banner"
                    aria-label="Dismiss alert"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =====================================================
          HERO BANNER
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