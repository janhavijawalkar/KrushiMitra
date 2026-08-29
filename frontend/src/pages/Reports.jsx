import { useState } from "react";
import {
  FileText,
  Download,
  BarChart3,
  TrendingUp,
  Sprout,
  CalendarDays,
  CheckCircle2,
  Sparkles,
  Printer,
  ShieldCheck,
  Wheat,
  FileCheck,
} from "lucide-react";

import { useApp } from "../context/AppContext";
import {
  generateYieldReportPDF,
  generateRecommendationReportPDF,
  generateComprehensiveFarmReportPDF,
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

export default function Reports({ nav }) {
  const { user, predictionHistory, recommendationHistory, t, language } = useApp();

  const [downloadingType, setDownloadingType] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const userEmail = user?.email?.toLowerCase()?.trim();
  const userRole = user?.role || "Farmer";

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

  const totalReports = userPredictions.length + userRecommendations.length;

  const availableReports = [];
  if (userPredictions.length > 0) {
    availableReports.push({
      id: "yieldReport",
      title: t("yieldReportItemTitle") || "Crop Yield & Productivity Report",
      translationKey: "cropYieldAnalysis",
      description:
        t("yieldReportItemDesc") ||
        "Comprehensive PDF document containing all your yield predictions, regional district trends, rainfall and temperature factors.",
      date: formatHistoryDate(userPredictions[0].createdAt),
      type: t("yieldReportItemType") || "Yield Analysis",
      icon: BarChart3,
      count: userPredictions.length,
      action: async () => {
        await generateYieldReportPDF(userPredictions, user, { language });
      },
    });
  }

  if (userRecommendations.length > 0) {
    availableReports.push({
      id: "recommendationReport",
      title: t("recReportItemTitle") || "AI Crop Recommendation Advisory",
      translationKey: "cropRecommendationReport",
      description:
        t("recReportItemDesc") ||
        "Agronomic advisory PDF detailing your soil N-P-K nutrient assessments, pH profiles, and optimal AI crop matches.",
      date: formatHistoryDate(userRecommendations[0].createdAt),
      type: t("recReportItemType") || "Crop Advisory",
      icon: Sprout,
      count: userRecommendations.length,
      action: async () => {
        await generateRecommendationReportPDF(userRecommendations, user, { language });
      },
    });
  }

  if (totalReports > 0) {
    availableReports.push({
      id: "masterReport",
      title: t("masterReportItemTitle") || "Master Farm Intelligence Dossier",
      translationKey: "predictionPerformance",
      description:
        t("masterReportItemDesc") ||
        "Full executive summary combining yield forecasts, soil nutrient advisories, and model performance metrics.",
      date: new Date().toLocaleDateString(language === "mr" || language === "hi" ? "mr-IN" : "en-IN"),
      type: t("masterReportItemType") || "Comprehensive",
      icon: TrendingUp,
      count: totalReports,
      action: async () => {
        await generateComprehensiveFarmReportPDF(
          userPredictions,
          userRecommendations,
          user,
          { language }
        );
      },
    });
  }

  const handleDownloadPDF = async (report) => {
    setDownloadingType(report.id);
    setSuccessMessage("");

    try {
      await report.action();
      setSuccessMessage(`"${report.title}" ${t("reportGeneratedSuccess") || "has been generated as a PDF!"}`);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("PDF Generation error:", err);
    } finally {
      setDownloadingType(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* HEADER WITH MASTER EXPORT BUTTON */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">
              {t("reportsPageHeading") || t("reports") || "Farm Reports & PDF Export"}
            </h1>
            <span className="flex items-center gap-1 rounded-full bg-[#E5F7EA] dark:bg-emerald-950/60 px-2.5 py-0.5 text-xs font-bold text-[#2E7D32] dark:text-[#4ADE80]">
              <FileCheck size={13} /> {totalReports > 0 ? `${totalReports} ${t("recordsReady") || "Records Ready"}` : (t("pdfReadyBadge") || "PDF Ready")}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("reportsPageSub") || "Generate and download professional, formatted PDF agricultural reports for your farm records."}
          </p>
        </div>

        {/* MASTER PDF BUTTON */}
        <button
          type="button"
          disabled={totalReports === 0 || downloadingType === "all"}
          onClick={() =>
            handleDownloadPDF({
              id: "all",
              title: t("masterReportItemTitle") || "Master Comprehensive Farm Report",
              action: async () => {
                await generateComprehensiveFarmReportPDF(
                  userPredictions,
                  userRecommendations,
                  user,
                  { language }
                );
              },
            })
          }
          className={`btn-shimmer flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs sm:text-sm font-bold text-white transition-all ${
            totalReports > 0
              ? "bg-gradient-to-r from-[#2E7D32] to-[#10B981] shadow-[0_8px_20px_rgba(46,125,50,0.22)] hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer"
              : "bg-gray-400 dark:bg-gray-700 opacity-60 cursor-not-allowed"
          }`}
        >
          {downloadingType === "all" ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <Download size={16} />
              <span>{totalReports > 0 ? (t("exportBundleBtn") || "Export Complete PDF Bundle") : (t("noReportsToExport") || "No Reports to Export")}</span>
            </>
          )}
        </button>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card card-interactive p-4 group">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3E6] dark:bg-[#152319] text-[#2E7D32] dark:text-[#4ADE80] transition-transform duration-300 group-hover:scale-110 shadow-xs">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{t("loggedYieldPredictions") || "Logged Yield Predictions"}</p>
              <h3 className="text-lg font-extrabold text-gray-800 dark:text-white group-hover:text-[#2E7D32] dark:group-hover:text-[#4ADE80] transition-colors">{userPredictions.length}</h3>
            </div>
          </div>
        </div>

        <div className="card card-interactive p-4 group">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3E6] dark:bg-[#152319] text-[#2E7D32] dark:text-[#4ADE80] transition-transform duration-300 group-hover:scale-110 shadow-xs">
              <Sprout size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{t("soilCropTests") || "Soil & Crop Tests"}</p>
              <h3 className="text-lg font-extrabold text-gray-800 dark:text-white group-hover:text-[#2E7D32] dark:group-hover:text-[#4ADE80] transition-colors">{userRecommendations.length}</h3>
            </div>
          </div>
        </div>

        <div className="card card-interactive p-4 group">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3E6] dark:bg-[#152319] text-[#2E7D32] dark:text-[#4ADE80] transition-transform duration-300 group-hover:scale-110 shadow-xs">
              <FileCheck size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{t("availableFarmDossiers") || "Available Farm Dossiers"}</p>
              <h3 className="text-lg font-extrabold text-gray-800 dark:text-white group-hover:text-[#2E7D32] dark:group-hover:text-[#4ADE80] transition-colors">
                {availableReports.length} {availableReports.length === 1 ? (t("dossierUnit") || "Dossier") : (t("dossiersUnit") || "Dossiers")}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS BANNER */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800 px-4 py-3 text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-300 shadow-sm animate-pop">
          <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* REPORTS CATALOG / EMPTY STATE */}
      {totalReports === 0 ? (
        <div className="card rounded-3xl border border-[#DCE8D9] dark:border-gray-800 bg-white dark:bg-[#122016] p-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF3E6] dark:bg-[#1c2e22] text-[#2E7D32] dark:text-[#4ADE80] shadow-xs">
            <FileText size={30} />
          </div>
          <h3 className="mt-4 text-lg font-extrabold text-gray-800 dark:text-white">
            {t("noFarmReportsTitle") || "No Farm Reports Generated Yet"}
          </h3>
          <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            {t("noFarmReportsDesc") || "You haven't run any crop recommendations or harvest yield predictions yet. Once you make your first prediction or soil test, official 1-page PDF farm dossiers will automatically appear here."}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => nav?.("recommendation")}
              className="btn-shimmer flex items-center gap-2 rounded-xl bg-[#2E7D32] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#1B5E20] cursor-pointer"
            >
              <Sprout size={15} />
              <span>{t("getSoilCropAdvisoryBtn") || "Get Soil & Crop Advisory"}</span>
            </button>
            <button
              type="button"
              onClick={() => nav?.("prediction")}
              className="key-cap flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-[#2E7D32] dark:text-[#4ADE80] hover:bg-[#EAF5E8] dark:hover:bg-[#1c2e22] cursor-pointer"
            >
              <BarChart3 size={15} />
              <span>{t("predictHarvestYieldBtn") || "Predict Harvest Yield"}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="border-b border-[#EEF2EC] dark:border-gray-800 p-5">
            <h2 className="text-base font-bold text-gray-800 dark:text-white">
              {t("availableReportsCatalog") || "Available PDF Reports Catalog"}
            </h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {t("selectReportTypeSub") || "Select an individual report type below to generate a tailored PDF document."}
            </p>
          </div>

          <div className="divide-y divide-[#EEF2EC] dark:divide-gray-800">
            {availableReports.map((report) => {
              const Icon = report.icon;
              const isDownloading = downloadingType === report.id;

              return (
                <div
                  key={report.id}
                  className="flex flex-col gap-4 p-5 transition hover:bg-[#FAFCF9] dark:hover:bg-[#152319] sm:flex-row sm:items-center sm:justify-between group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF3E6] dark:bg-[#1b2b20] text-[#2E7D32] dark:text-[#4ADE80] shadow-sm transition-transform group-hover:scale-105">
                      <Icon size={24} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-gray-800 dark:text-white group-hover:text-[#2E7D32] dark:group-hover:text-[#4ADE80] transition-colors">
                          {report.title}
                        </h3>
                        <span className="key-cap py-0.5 px-2 text-[10px]">
                          {report.type}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 max-w-xl">
                        {report.description}
                      </p>

                      <div className="mt-2.5 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                          <CalendarDays size={12} className="text-gray-400" />
                          {t("date") || "Date"}: {report.date}
                        </span>

                        <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                          • {report.count} {report.count === 1 ? (t("recordCountSingular") || "Record") : (t("recordCountPlural") || "Records")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* PDF DOWNLOAD BUTTON */}
                  <button
                    type="button"
                    onClick={() => handleDownloadPDF(report)}
                    disabled={isDownloading}
                    className="key-cap shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-[#2E7D32] dark:text-[#4ADE80] disabled:opacity-50 cursor-pointer"
                  >
                    {isDownloading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#2E7D32] border-t-transparent" />
                    ) : (
                      <>
                        <Download size={15} />
                        <span>{t("downloadPdfBtn") || "Download PDF"}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* HOW TO USE REPORTS / INFO BOX */}
      <div className="rounded-2xl border border-[#DCE8D9] bg-gradient-to-br from-[#F4F9F2] to-[#EBF6EE] p-5">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2E7D32] text-white shadow-sm">
            <Wheat size={20} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#1B5E20]">
              {t("officialFarmRecordsTitle") || "Official Farm Records & Advisory Documentation"}
            </h4>
            <p className="mt-1 text-xs text-gray-600 leading-relaxed">
              {t("officialFarmRecordsDesc") || "KrushiMitra PDF reports are pre-formatted for printing, submitting to agricultural credit/loan applications, government crop insurance assessments, or sharing with local Krishi Vigyan Kendra (KVK) agronomists."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({ icon, title, value, subtitle }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EAF3E6] text-[#2E7D32]">
          {icon}
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500">{title}</p>
          <p className="mt-0.5 text-2xl font-extrabold text-gray-800">{value}</p>
          {subtitle && (
            <p className="text-[10px] text-gray-400 font-medium">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}