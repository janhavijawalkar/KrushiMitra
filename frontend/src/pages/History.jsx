import {
  History as HistoryIcon,
  Search,
  Eye,
  Trash2,
  TrendingUp,
  Sprout,
  Download,
  X,
  MapPin,
  Calendar,
  Thermometer,
  Droplets,
} from "lucide-react";

import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  generateYieldReportPDF,
  generateRecommendationReportPDF,
} from "../utils/pdfGenerator";

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

export default function History({ nav }) {
  const {
    user,
    predictionHistory,
    deletePrediction,
    recommendationHistory,
    deleteRecommendation,
    language,
    t,
    tCrop,
    tDistrict,
  } = useApp();

  const [activeTab, setActiveTab] = useState("predictions");
  const [search, setSearch] = useState("");
  const [viewRecord, setViewRecord] = useState(null);

  const userEmail = user?.email?.toLowerCase()?.trim();

  const userPredictions =
    user?.role === "Admin"
      ? predictionHistory
      : predictionHistory.filter(
          (item) => item.user_email && item.user_email.toLowerCase() === userEmail
        );

  const userRecommendations =
    user?.role === "Admin"
      ? recommendationHistory
      : recommendationHistory.filter(
          (item) => item.user_email && item.user_email.toLowerCase() === userEmail
        );

  const filteredPredictions = userPredictions.filter(
    (item) => {
      const text = `
        ${item.crop}
        ${item.district}
        ${item.season}
        ${item.year}
      `.toLowerCase();

      return text.includes(search.toLowerCase());
    }
  );

  const filteredRecommendations =
    userRecommendations.filter((item) => {
      const text = `
        ${item.crop}
        ${item.nitrogen}
        ${item.phosphorus}
        ${item.potassium}
        ${item.temperature}
        ${item.humidity}
        ${item.ph}
        ${item.rainfall}
      `.toLowerCase();

      return text.includes(search.toLowerCase());
    });

  const predictionAverageProductivity = (() => {
    if (!userPredictions.length) {
      return "—";
    }

    const total = userPredictions.reduce(
      (sum, item) =>
        sum + Number(item.productivity || 0),
      0
    );

    return `${(
      total / userPredictions.length
    ).toFixed(2)} t/ha`;
  })();

  return (
    <div className="space-y-6 p-6">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">
            {t("history")}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {activeTab === "predictions"
              ? t("predictionHistoryDescription")
              : t("recommendationRecords")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (activeTab === "predictions") {
                generateYieldReportPDF(userPredictions, user, { language });
              } else {
                generateRecommendationReportPDF(userRecommendations, user, { language });
              }
            }}
            className="key-cap flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-[#2E7D32] cursor-pointer"
          >
            <Download size={15} />
            <span>{t("exportPdf") || "Export PDF"}</span>
          </button>

          <button
            onClick={() =>
              nav?.(
                activeTab === "predictions"
                  ? "prediction"
                  : "recommendation"
              )
            }
            className="btn-shimmer flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95 cursor-pointer"
          >
            {activeTab === "predictions" ? (
              <TrendingUp size={16} />
            ) : (
              <Sprout size={16} />
            )}

            {activeTab === "predictions"
              ? t("newPrediction")
              : t("newRecommendation")}
          </button>
        </div>

      </div>


      {/* TABS */}

      <div className="card p-2">

        <div className="grid grid-cols-2 gap-2">

          <button
            onClick={() => {
              setActiveTab("predictions");
              setSearch("");
            }}
            className={`
              key-cap flex items-center justify-center gap-2
              rounded-xl py-3 text-xs font-bold
              transition-all duration-200 active:scale-95 cursor-pointer
              ${
                activeTab === "predictions"
                  ? "bg-[#2E7D32] text-white shadow-sm"
                  : "text-gray-500 hover:bg-[#F3F8F0] hover:text-[#2E7D32]"
              }
            `}
          >
            <TrendingUp size={16} />
            {t("predictions")} ({userPredictions.length})
          </button>

          <button
            onClick={() => {
              setActiveTab("recommendations");
              setSearch("");
            }}
            className={`
              key-cap flex items-center justify-center gap-2
              rounded-xl py-3 text-xs font-bold
              transition-all duration-200 active:scale-95 cursor-pointer
              ${
                activeTab === "recommendations"
                  ? "bg-[#2E7D32] text-white shadow-sm"
                  : "text-gray-500 hover:bg-[#F3F8F0] hover:text-[#2E7D32]"
              }
            `}
          >
            <Sprout size={16} />
            {t("recommendations")} ({userRecommendations.length})
          </button>

        </div>

      </div>


      {/* ================= PREDICTION HISTORY ================= */}

      {activeTab === "predictions" && (
        <div key="predictions" className="space-y-6 animate-fade-in-up">
          {/* SUMMARY */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <SummaryCard
              icon="📊"
              title={t("totalPredictions")}
              value={predictionHistory.length}
            />

            <SummaryCard
              icon="🌾"
              title={t("cropsPredicted")}
              value={
                new Set(
                  predictionHistory.map(
                    (item) => item.crop
                  )
                ).size
              }
            />

            <SummaryCard
              icon="📈"
              title={t("averagePredictedYield")}
              value={predictionAverageProductivity}
            />

            <SummaryCard
              icon="🕒"
              title={t("latestPrediction")}
              value={
                userPredictions.length
                  ? formatHistoryDate(userPredictions[0].createdAt)
                  : "—"
              }
            />

          </div>


          {/* SEARCH */}

          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder={t("searchHistory")}
            t={t}
          />


          {/* TABLE */}

          <div className="card overflow-hidden">

            <div className="border-b border-[#E2EAE0] p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3E6] text-[#2E7D32]">
                  <HistoryIcon size={20} />
                </div>

                <div>

                  <h2 className="text-sm font-bold text-gray-800">
                    {t("previousPredictions")}
                  </h2>

                  <p className="mt-1 text-[11px] text-gray-400">
                    {t("predictionRecords")}
                  </p>

                </div>

              </div>

            </div>


            {/* DESKTOP */}

            <div className="hidden overflow-x-auto md:block">

              <table className="w-full text-left">

                <thead>

                  <tr className="bg-[#F8FAF7] text-[10px] uppercase tracking-wide text-gray-400">

                    <th className="px-5 py-3">
                      {t("crop")}
                    </th>

                    <th className="px-5 py-3">
                      {t("district")}
                    </th>

                    <th className="px-5 py-3">
                      {t("season")}
                    </th>

                    <th className="px-5 py-3">
                      {t("cropYear")}
                    </th>

                    <th className="px-5 py-3">
                      {t("yield")}
                    </th>

                    <th className="px-5 py-3">
                      {t("date")}
                    </th>

                    <th className="px-5 py-3 text-right">
                      {t("action")}
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredPredictions.length === 0 ? (

                    <EmptyRow t={t} />

                  ) : (

                    filteredPredictions.map((item) => (

                      <tr
                        key={item.id}
                        className="border-t border-[#EEF2EC] text-xs transition hover:bg-[#FAFCF9]"
                      >

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <span className="text-lg">
                              🌾
                            </span>

                            <span className="font-bold text-gray-700">
                              {tCrop(item.crop)}
                            </span>

                          </div>

                        </td>

                        <td className="px-5 py-4 text-gray-500">
                          {tDistrict ? tDistrict(item.district) : item.district}
                        </td>

                        <td className="px-5 py-4">

                          <span className="rounded-full bg-[#F3F8F0] px-2 py-1 text-[10px] font-semibold text-[#2E7D32]">
                            {item.season}
                          </span>

                        </td>

                        <td className="px-5 py-4 text-gray-500">
                          {item.year}
                        </td>

                        <td className="px-5 py-4 font-bold text-gray-700">
                          {Number(
                            item.productivity
                          ).toFixed(2)}{" "}
                          t/ha
                        </td>

                        <td className="px-5 py-4 text-gray-400 font-medium text-xs">
                          {formatHistoryDate(item.createdAt)}
                        </td>

                        <td className="px-5 py-4">

                          <div className="flex justify-end gap-2">

                            <button
                              onClick={() => setViewRecord({ ...item, type: "prediction" })}
                              className="rounded-lg border border-[#DCE8D9] p-2 text-gray-500 hover:bg-[#EAF3E6] hover:text-[#2E7D32] transition cursor-pointer"
                              title={t("view") || "View Details"}
                              aria-label={t("view") || "View Details"}
                            >
                              <Eye size={14} />
                            </button>

                            <button
                              onClick={() =>
                                deletePrediction(
                                  item.id
                                )
                              }
                              className="rounded-lg border border-red-100 p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition cursor-pointer"
                              title={t("delete")}
                              aria-label={t("delete")}
                            >
                              <Trash2 size={14} />
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>


            {/* MOBILE */}

            <div className="divide-y divide-[#EEF2EC] md:hidden">

              {filteredPredictions.length === 0 ? (

                <div className="p-8 text-center text-xs text-gray-400">
                  {t("noPredictionsFound")}
                </div>

              ) : (

                filteredPredictions.map((item) => (

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
                          {item.season} •{" "}
                          {item.year}
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
                          {t("date")}
                        </p>

                        <p className="mt-1 text-sm font-bold text-gray-700">
                          {formatHistoryDate(item.createdAt)}
                        </p>

                      </div>

                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5">
                      <button
                        onClick={() => setViewRecord({ ...item, type: "prediction" })}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#2E7D32] hover:underline cursor-pointer"
                      >
                        <Eye size={13} />
                        {t("view") || "View Details"}
                      </button>

                      <button
                        onClick={() =>
                          deletePrediction(
                            item.id
                          )
                        }
                        className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:underline cursor-pointer"
                      >
                        <Trash2 size={13} />
                        {t("delete")}
                      </button>
                    </div>

                  </div>

                ))

              )}

            </div>

          </div>
        </div>
      )}


      {/* ================= RECOMMENDATION HISTORY ================= */}

      {activeTab === "recommendations" && (
        <div key="recommendations" className="space-y-6 animate-fade-in-up">
          {/* SUMMARY */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <SummaryCard
              icon="🌱"
              title={t("recommendationHistory")}
              value={recommendationHistory.length}
            />

            <SummaryCard
              icon="🌾"
              title={t("cropsPredicted")}
              value={
                new Set(
                  recommendationHistory.map(
                    (item) => item.crop
                  )
                ).size
              }
            />

            <SummaryCard
              icon="🕒"
              title={t("latestPrediction")}
              value={
                userRecommendations.length
                  ? formatHistoryDate(userRecommendations[0].createdAt)
                  : "—"
              }
            />

          </div>


          {/* SEARCH */}

          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder={t("searchHistory")}
            t={t}
          />


          {/* RECOMMENDATION LIST */}

          <div className="card overflow-hidden">

            <div className="border-b border-[#E2EAE0] p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3E6] text-[#2E7D32]">
                  <Sprout size={20} />
                </div>

                <div>

                  <h2 className="text-sm font-bold text-gray-800">
                    {t("recommendationHistory")}
                  </h2>

                  <p className="mt-1 text-[11px] text-gray-400">
                    {t("recommendationRecords")}
                  </p>

                </div>

              </div>

            </div>


            {filteredRecommendations.length === 0 ? (

              <div className="p-10 text-center text-xs text-gray-400">
                {t("noRecommendationsFound")}
              </div>

            ) : (

              <div className="divide-y divide-[#EEF2EC]">

                {filteredRecommendations.map(
                  (item) => (

                    <div
                      key={item.id}
                      className="flex flex-col gap-4 p-5 transition hover:bg-[#FAFCF9] sm:flex-row sm:items-center sm:justify-between"
                    >

                      <div className="flex items-center gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF3E6] text-xl">
                          🌾
                        </div>

                        <div>

                          <h3 className="text-sm font-bold text-gray-800">
                            {tCrop(item.crop)}
                          </h3>

                          <p className="mt-1 text-xs text-gray-400">
                            {t("recommendationDate")}:{" "}
                            {formatHistoryDate(item.createdAt)}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2">

                            <span className="rounded-full bg-[#F3F8F0] px-2 py-1 text-[9px] font-semibold text-[#2E7D32]">
                              N: {item.nitrogen}
                            </span>

                            <span className="rounded-full bg-[#F3F8F0] px-2 py-1 text-[9px] font-semibold text-[#2E7D32]">
                              P: {item.phosphorus}
                            </span>

                            <span className="rounded-full bg-[#F3F8F0] px-2 py-1 text-[9px] font-semibold text-[#2E7D32]">
                              K: {item.potassium}
                            </span>

                            <span className="rounded-full bg-[#F3F8F0] px-2 py-1 text-[9px] font-semibold text-[#2E7D32]">
                              pH: {item.ph}
                            </span>

                          </div>

                        </div>

                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <button
                          onClick={() =>
                            setViewRecord({ ...item, type: "recommendation" })
                          }
                          className="flex items-center gap-1.5 rounded-lg border border-[#DCE8D9] px-3 py-1.5 text-xs font-bold text-[#2E7D32] hover:bg-[#EAF3E6] transition cursor-pointer"
                        >
                          <Eye size={13} />
                          {t("view") || "View"}
                        </button>

                        <button
                          onClick={() =>
                            deleteRecommendation(
                              item.id
                            )
                          }
                          className="flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition cursor-pointer"
                        >
                          <Trash2 size={13} />
                          {t("delete")}
                        </button>
                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>
        </div>
      )}

      {/* =========================================================
         RECORD DETAILS MODAL
      ========================================================= */}
      {viewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4 animate-zoom-fade">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-green-200/80 animate-zoom-fade depth-3 glow-emerald">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF3E6] text-2xl shadow-xs animate-float-slow">
                  🌾
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-800">
                    {tCrop ? tCrop(viewRecord.crop) : viewRecord.crop}
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    {viewRecord.type === "prediction"
                      ? (t("yieldReportItemTitle") || "Crop Yield Prediction Record")
                      : (t("recReportItemTitle") || "Soil & Crop Advisory Record")}{" "}
                    • {formatHistoryDate(viewRecord.createdAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewRecord(null)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition cursor-pointer"
                aria-label={t("close") || "Close"}
              >
                <X size={18} />
              </button>
            </div>

            {/* BODY */}
            <div className="mt-5 space-y-4 max-h-[65vh] overflow-y-auto pr-1">
              {viewRecord.type === "prediction" ? (
                <>
                  {/* Primary Yield Banner */}
                  <div className="rounded-2xl bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] p-5 text-white shadow-md">
                    <p className="text-xs text-green-100 font-medium">
                      {t("estimatedYield") || "Estimated Crop Productivity"}
                    </p>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="text-3xl font-black">{viewRecord.productivity} <span className="text-sm font-normal">t/ha</span></span>
                      <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                        {t("totalHarvest") || "Harvest"}: {viewRecord.production ? `${viewRecord.production} Tonnes` : `${(parseFloat(viewRecord.area || 1) * parseFloat(viewRecord.productivity || 0)).toFixed(2)} Tonnes`}
                      </span>
                    </div>
                  </div>

                  {/* Grid of parameters */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-gray-100 bg-[#F9FBF8] p-3">
                      <span className="text-gray-400 block text-[10px] font-semibold">{t("district") || "District"}</span>
                      <span className="font-bold text-gray-700 mt-0.5 block">{tDistrict ? tDistrict(viewRecord.district) : (viewRecord.district || "—")}</span>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-[#F9FBF8] p-3">
                      <span className="text-gray-400 block text-[10px] font-semibold">{t("season") || "Season"} & {t("cropYear") || "Year"}</span>
                      <span className="font-bold text-gray-700 mt-0.5 block">{viewRecord.season || "—"} • {viewRecord.year || "—"}</span>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-[#F9FBF8] p-3">
                      <span className="text-gray-400 block text-[10px] font-semibold">{t("area") || "Field Area"}</span>
                      <span className="font-bold text-gray-700 mt-0.5 block">{viewRecord.area ? `${viewRecord.area} ${t("hectaresUnit") || "Hectares"}` : "—"}</span>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-[#F9FBF8] p-3">
                      <span className="text-gray-400 block text-[10px] font-semibold">{t("rainfall") || "Rainfall"}</span>
                      <span className="font-bold text-gray-700 mt-0.5 block">{viewRecord.rainfall ? `${viewRecord.rainfall} mm` : "—"}</span>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-[#F9FBF8] p-3">
                      <span className="text-gray-400 block text-[10px] font-semibold">{t("temperature") || "Temperature"}</span>
                      <span className="font-bold text-gray-700 mt-0.5 block">{viewRecord.temperature ? `${viewRecord.temperature}°C` : "—"}</span>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-[#F9FBF8] p-3">
                      <span className="text-gray-400 block text-[10px] font-semibold">{t("date") || "Recorded Date"}</span>
                      <span className="font-bold text-gray-700 mt-0.5 block">{formatHistoryDate(viewRecord.createdAt)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Recommendation Top Banner */}
                  <div className="rounded-2xl bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] p-5 text-white shadow-md">
                    <p className="text-xs text-green-100 font-medium">{t("recommendedCrop") || "Recommended Crop for Field"}</p>
                    <h2 className="mt-1 text-2xl font-black">{tCrop ? tCrop(viewRecord.crop) : viewRecord.crop}</h2>
                    <p className="text-[11px] text-green-100/90 mt-1">{t("basedOnSoilWeather") || "Based on soil chemistry and atmospheric environment"}</p>
                  </div>

                  {/* Soil and Climate Nutrients Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="rounded-xl border border-gray-100 bg-[#F9FBF8] p-3">
                      <span className="text-gray-400 block text-[10px] font-semibold">{t("nitrogen") || "Nitrogen (N)"}</span>
                      <span className="font-bold text-gray-700 mt-0.5 block">{viewRecord.nitrogen || "—"} mg/kg</span>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-[#F9FBF8] p-3">
                      <span className="text-gray-400 block text-[10px] font-semibold">{t("phosphorus") || "Phosphorus (P)"}</span>
                      <span className="font-bold text-gray-700 mt-0.5 block">{viewRecord.phosphorus || "—"} mg/kg</span>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-[#F9FBF8] p-3">
                      <span className="text-gray-400 block text-[10px] font-semibold">{t("potassium") || "Potassium (K)"}</span>
                      <span className="font-bold text-gray-700 mt-0.5 block">{viewRecord.potassium || "—"} mg/kg</span>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-[#F9FBF8] p-3">
                      <span className="text-gray-400 block text-[10px] font-semibold">{t("ph") || "Soil pH"}</span>
                      <span className="font-bold text-gray-700 mt-0.5 block">{viewRecord.ph || "—"}</span>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-[#F9FBF8] p-3">
                      <span className="text-gray-400 block text-[10px] font-semibold">{t("temperature") || "Temperature"}</span>
                      <span className="font-bold text-gray-700 mt-0.5 block">{viewRecord.temperature ? `${viewRecord.temperature}°C` : "—"}</span>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-[#F9FBF8] p-3">
                      <span className="text-gray-400 block text-[10px] font-semibold">{t("humidity") || "Humidity"}</span>
                      <span className="font-bold text-gray-700 mt-0.5 block">{viewRecord.humidity ? `${viewRecord.humidity}%` : "—"}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-3 rounded-xl border border-gray-100 bg-[#F9FBF8] p-3 flex justify-between items-center">
                      <span className="text-gray-400 text-[10px] font-semibold">{t("rainfall") || "Rainfall"}</span>
                      <span className="font-bold text-gray-700">{viewRecord.rainfall ? `${viewRecord.rainfall} mm` : "—"}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* FOOTER */}
            <div className="mt-6 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
              <button
                onClick={() => {
                  if (viewRecord.type === "prediction") {
                    generateYieldReportPDF([viewRecord], { name: user?.name || "Farmer", email: user?.email }, { language });
                  } else {
                    generateRecommendationReportPDF([viewRecord], { name: user?.name || "Farmer", email: user?.email }, { language });
                  }
                }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95 transition cursor-pointer"
              >
                <Download size={14} />
                {t("downloadPdf") || "Download PDF"}
              </button>

              <button
                onClick={() => setViewRecord(null)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
              >
                {t("cancel") || "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


/* =========================================================
   SEARCH BOX
========================================================= */

function SearchBox({
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="card p-5">

      <div className="relative">

        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          className="w-full rounded-xl border border-[#DCE8D9] bg-white py-3 pl-10 pr-4 text-xs outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-green-100"
        />

      </div>

    </div>
  );
}


/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="card p-5">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3E6] text-lg">
          {icon}
        </div>

        <div>

          <p className="text-[11px] text-gray-400">
            {title}
          </p>

          <p className="mt-1 text-xl font-extrabold text-gray-800">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   EMPTY ROW
========================================================= */

function EmptyRow({ t }) {
  return (
    <tr>
      <td
        colSpan="7"
        className="p-10 text-center text-xs text-gray-400"
      >
        {t("noPredictionsFound")}
      </td>
    </tr>
  );
}