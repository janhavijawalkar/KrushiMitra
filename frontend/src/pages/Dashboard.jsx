import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Sprout,
  TrendingUp,
  Target,
} from "lucide-react";

import StatCard from "../components/StatCard";
import { useApp } from "../context/AppContext";

export default function Dashboard({ nav }) {
  const {
    user,
    t,
    predictionHistory,
    recommendationHistory,
  } = useApp();

  const name = user?.name || "Farmer";
  const userRole = user?.role || "Farmer";
  const userDistrict = user?.district || "Maharashtra";
  const userFarmSize = user?.farmSize ? `${user.farmSize} ${user?.farmUnit || "Acres"}` : "Farmland Profile";

  // Filter history strictly for the logged-in user (or all if Super-Admin)
  const userPredictions =
    userRole === "Admin"
      ? predictionHistory
      : predictionHistory.filter((p) => !p.user_email || p.user_email.toLowerCase() === user?.email?.toLowerCase());

  const userRecommendations =
    userRole === "Admin"
      ? recommendationHistory
      : recommendationHistory.filter((r) => !r.user_email || r.user_email.toLowerCase() === user?.email?.toLowerCase());

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

  return (
    <div className="space-y-6">

      {/* =====================================================
          WELCOME HERO
      ===================================================== */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#10B981] p-7 text-white shadow-[0_12px_35px_rgba(46,125,50,0.14)]">

        <div className="pointer-events-none absolute -right-10 -top-16 h-52 w-52 rounded-full bg-white/10 blur-2xl" />

        <div className="pointer-events-none absolute -bottom-20 right-28 h-44 w-44 rounded-full bg-[#B9E8B8]/10 blur-3xl" />

        <div className="relative z-10">

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold backdrop-blur-md">
              📍 {userDistrict} District
            </span>
            <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold backdrop-blur-md">
              🌾 {userFarmSize}
            </span>
            <span className="rounded-full bg-emerald-900/40 px-3 py-0.5 text-xs font-bold backdrop-blur-md">
              {userRole === "Admin" ? "🛡️ Super-Admin" : "🌾 Registered Farmer"}
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {t("goodMorning")}, {name} 👋
          </h1>

          <p className="mt-2 max-w-xl text-xs leading-6 text-green-50/90 sm:text-sm">
            {userRole === "Admin"
              ? "Administrator Overview: Monitor ML inference throughput, registered farmers directory, and system health."
              : `AI Agronomy Dashboard for your farm in ${userDistrict}. Get instant crop predictions, nutrient advisories, and weather forecasts.`}
          </p>

          <button
            onClick={() => nav?.("prediction")}
            className="btn-shimmer mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-[#2E7D32] shadow-[0_6px_18px_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:bg-[#F7FFF5] hover:shadow-lg active:scale-95 cursor-pointer"
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
              ? "Live"
              : "—"
          }
        />

        <StatCard
          icon="🎯"
          title="Model R² Score"
          value="20.15%"
          change="RF"
        />

        <StatCard
          icon="🌾"
          title={t("cropsAnalyzed")}
          value={uniqueCrops || "—"}
          change={
            uniqueCrops
              ? "Live"
              : "—"
          }
        />

        <StatCard
          icon="📈"
          title={t("averagePredictedYield")}
          value={averageProductivity}
          change={
            userPredictions.length
              ? "Live"
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
                {latestRecommendation?.crop || "—"}
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


        {/* Model Information */}

        <div className="card card-interactive p-5 group">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3E6] text-[#2E7D32] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-xs">
              <Target size={19} />
            </div>

            <div>

              <p className="text-[11px] font-medium text-gray-400">
                Productivity Model
              </p>

              <h3 className="mt-1 text-lg font-extrabold text-[#1F2937] group-hover:text-[#2E7D32] transition-colors">
                Random Forest
              </h3>

            </div>

          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">

            <div className="rounded-xl bg-[#F8FAF7] p-3 transition hover:bg-[#EAF3E6]">
              <p className="text-[9px] text-gray-400 font-bold">
                R²
              </p>

              <p className="mt-1 text-sm font-bold text-[#2E7D32]">
                0.2015
              </p>
            </div>

            <div className="rounded-xl bg-[#F8FAF7] p-3 transition hover:bg-[#EAF3E6]">
              <p className="text-[9px] text-gray-400 font-bold">
                MAE
              </p>

              <p className="mt-1 text-sm font-bold text-[#2E7D32]">
                0.8606
              </p>
            </div>

          </div>

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
                            {item.crop}
                          </span>

                        </div>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-1.5 text-gray-500">
                          <MapPin size={13} />
                          {item.district}
                        </div>

                      </td>

                      <td className="px-5 py-4 font-bold text-gray-700">
                        {Number(
                          item.productivity
                        ).toFixed(2)}{" "}
                        t/ha
                      </td>

                      <td className="px-5 py-4">

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0FDF4] px-2.5 py-1 text-[10px] font-semibold text-[#15803D]">
                          <CheckCircle2 size={11} />
                          Completed
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-1.5 text-gray-400">

                          <Clock3 size={12} />

                          {new Date(
                            item.createdAt
                          ).toLocaleDateString()}

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
                          {item.crop}
                        </h3>

                      </div>

                      <p className="mt-1 text-[11px] text-gray-400">
                        {item.district} •{" "}
                        {new Date(
                          item.createdAt
                        ).toLocaleDateString()}
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
                        t/ha
                      </p>

                    </div>

                    <div className="rounded-xl bg-[#F8FAF7] p-3">

                      <p className="text-[10px] text-gray-400">
                        {t("status")}
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-sm font-bold text-[#15803D]">
                        <CheckCircle2 size={14} />
                        Completed
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