import {
  History as HistoryIcon,
  Search,
  Eye,
  Trash2,
  TrendingUp,
  Sprout,
  Download,
} from "lucide-react";

import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  generateYieldReportPDF,
  generateRecommendationReportPDF,
} from "../utils/pdfGenerator";

export default function History({ nav }) {
  const {
    user,
    predictionHistory,
    deletePrediction,
    recommendationHistory,
    deleteRecommendation,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState("predictions");
  const [search, setSearch] = useState("");

  const userPredictions =
    user?.role === "Admin"
      ? predictionHistory
      : predictionHistory.filter(
          (item) => !item.user_email || item.user_email.toLowerCase() === user?.email?.toLowerCase()
        );

  const userRecommendations =
    user?.role === "Admin"
      ? recommendationHistory
      : recommendationHistory.filter(
          (item) => !item.user_email || item.user_email.toLowerCase() === user?.email?.toLowerCase()
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
                generateYieldReportPDF(userPredictions, user);
              } else {
                generateRecommendationReportPDF(userRecommendations, user);
              }
            }}
            className="key-cap flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-[#2E7D32] cursor-pointer"
          >
            <Download size={15} />
            <span>Export PDF</span>
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
        <>
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
                predictionHistory.length
                  ? new Date(
                      predictionHistory[0].createdAt
                    ).toLocaleDateString()
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
                              {item.crop}
                            </span>

                          </div>

                        </td>

                        <td className="px-5 py-4 text-gray-500">
                          {item.district}
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

                        <td className="px-5 py-4 text-gray-400">
                          {new Date(
                            item.createdAt
                          ).toLocaleDateString()}
                        </td>

                        <td className="px-5 py-4">

                          <div className="flex justify-end gap-2">

                            <button
                              className="rounded-lg border border-[#DCE8D9] p-2 text-gray-500 hover:bg-[#EAF3E6] hover:text-[#2E7D32]"
                              title={t("view")}
                              aria-label={t("view")}
                            >
                              <Eye size={14} />
                            </button>

                            <button
                              onClick={() =>
                                deletePrediction(
                                  item.id
                                )
                              }
                              className="rounded-lg border border-red-100 p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
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
                            {item.crop}
                          </h3>

                        </div>

                        <p className="mt-1 text-[11px] text-gray-400">
                          {item.district} •{" "}
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
                          {new Date(
                            item.createdAt
                          ).toLocaleDateString()}
                        </p>

                      </div>

                    </div>

                    <button
                      onClick={() =>
                        deletePrediction(
                          item.id
                        )
                      }
                      className="mt-3 flex items-center gap-2 text-xs font-semibold text-red-500"
                    >
                      <Trash2 size={13} />
                      {t("delete")}
                    </button>

                  </div>

                ))

              )}

            </div>

          </div>
        </>
      )}


      {/* ================= RECOMMENDATION HISTORY ================= */}

      {activeTab === "recommendations" && (
        <>
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
                recommendationHistory.length
                  ? new Date(
                      recommendationHistory[0].createdAt
                    ).toLocaleDateString()
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
                            {item.crop}
                          </h3>

                          <p className="mt-1 text-xs text-gray-400">
                            {t("recommendationDate")}:{" "}
                            {new Date(
                              item.createdAt
                            ).toLocaleDateString()}
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


                      <button
                        onClick={() =>
                          deleteRecommendation(
                            item.id
                          )
                        }
                        className="flex items-center gap-2 self-start text-xs font-semibold text-red-500 sm:self-center"
                      >
                        <Trash2 size={13} />
                        {t("delete")}
                      </button>

                    </div>

                  )
                )}

              </div>

            )}

          </div>
        </>
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