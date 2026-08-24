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

export default function Reports() {
  const { user, predictionHistory, recommendationHistory, t } = useApp();

  const [downloadingType, setDownloadingType] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const totalReports = predictionHistory.length + recommendationHistory.length;
  const yieldReports = predictionHistory.length;
  const recommendationReports = recommendationHistory.length;

  const reports = [
    {
      id: "yieldReport",
      title: "Crop Yield & Productivity Report",
      translationKey: "cropYieldAnalysis",
      description:
        "Comprehensive PDF document containing all yield predictions, regional district trends, rainfall and temperature factors.",
      date: predictionHistory.length
        ? new Date(predictionHistory[0].createdAt).toLocaleDateString("en-IN")
        : "Latest",
      type: "Yield Analysis",
      icon: BarChart3,
      count: predictionHistory.length,
      action: () => {
        generateYieldReportPDF(predictionHistory, user);
      },
    },
    {
      id: "recommendationReport",
      title: "AI Crop Recommendation Advisory",
      translationKey: "cropRecommendationReport",
      description:
        "Agronomic advisory PDF detailing soil N-P-K nutrient assessments, pH profiles, and optimal AI crop matches.",
      date: recommendationHistory.length
        ? new Date(
            recommendationHistory[0].createdAt
          ).toLocaleDateString("en-IN")
        : "Latest",
      type: "Crop Advisory",
      icon: Sprout,
      count: recommendationHistory.length,
      action: () => {
        generateRecommendationReportPDF(recommendationHistory, user);
      },
    },
    {
      id: "masterReport",
      title: "Master Farm Intelligence Report",
      translationKey: "predictionPerformance",
      description:
        "Full executive summary combining yield forecasts, soil nutrient advisories, and model performance metrics.",
      date: new Date().toLocaleDateString("en-IN"),
      type: "Comprehensive",
      icon: TrendingUp,
      count: totalReports,
      action: () => {
        generateComprehensiveFarmReportPDF(
          predictionHistory,
          recommendationHistory,
          user
        );
      },
    },
  ];

  const handleDownloadPDF = (report) => {
    setDownloadingType(report.id);
    setSuccessMessage("");

    setTimeout(() => {
      try {
        report.action();
        setSuccessMessage(`"${report.title}" has been generated as a PDF!`);
        setTimeout(() => setSuccessMessage(""), 4000);
      } catch (err) {
        console.error("PDF Generation error:", err);
      } finally {
        setDownloadingType(null);
      }
    }, 350);
  };

  return (
    <div className="space-y-6 p-6">
      {/* HEADER WITH MASTER EXPORT BUTTON */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-gray-800">
              {t("reports") || "Farm Reports & PDF Export"}
            </h1>
            <span className="flex items-center gap-1 rounded-full bg-[#E5F7EA] px-2.5 py-0.5 text-xs font-bold text-[#2E7D32]">
              <FileCheck size={13} /> PDF Ready
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Generate and download professional, formatted PDF agricultural reports for your farm records.
          </p>
        </div>

        {/* MASTER PDF BUTTON */}
        <button
          type="button"
          onClick={() =>
            handleDownloadPDF({
              id: "all",
              title: "Master Comprehensive Farm Report",
              action: () =>
                generateComprehensiveFarmReportPDF(
                  predictionHistory,
                  recommendationHistory,
                  user
                ),
            })
          }
          className="btn-shimmer flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2E7D32] to-[#10B981] px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-[0_8px_20px_rgba(46,125,50,0.22)] transition-all hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer"
        >
          {downloadingType === "all" ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <Download size={16} />
              <span>Export Complete PDF Bundle</span>
            </>
          )}
        </button>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card card-interactive p-4 group">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3E6] text-[#2E7D32] transition-transform duration-300 group-hover:scale-110 shadow-xs">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Logged Yield Predictions</p>
              <h3 className="text-lg font-extrabold text-gray-800 group-hover:text-[#2E7D32] transition-colors">{predictionHistory.length}</h3>
            </div>
          </div>
        </div>

        <div className="card card-interactive p-4 group">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3E6] text-[#2E7D32] transition-transform duration-300 group-hover:scale-110 shadow-xs">
              <Sprout size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Soil & Crop Tests</p>
              <h3 className="text-lg font-extrabold text-gray-800 group-hover:text-[#2E7D32] transition-colors">{recommendationHistory.length}</h3>
            </div>
          </div>
        </div>

        <div className="card card-interactive p-4 group">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3E6] text-[#2E7D32] transition-transform duration-300 group-hover:scale-110 shadow-xs">
              <FileCheck size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Report Formats Available</p>
              <h3 className="text-lg font-extrabold text-gray-800 group-hover:text-[#2E7D32] transition-colors">3 Types (PDF)</h3>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS BANNER */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs sm:text-sm font-semibold text-emerald-800 shadow-sm animate-pop">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* REPORTS CATALOG */}
      <div className="card overflow-hidden">
        <div className="border-b border-[#EEF2EC] p-5">
          <h2 className="text-base font-bold text-gray-800">
            Available PDF Reports Catalog
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Select an individual report type below to generate a tailored PDF document.
          </p>
        </div>

        <div className="divide-y divide-[#EEF2EC]">
          {reports.map((report) => {
            const Icon = report.icon;
            const isDownloading = downloadingType === report.id;

            return (
              <div
                key={report.id}
                className="flex flex-col gap-4 p-5 transition hover:bg-[#FAFCF9] sm:flex-row sm:items-center sm:justify-between group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF3E6] text-[#2E7D32] shadow-sm transition-transform group-hover:scale-105">
                    <Icon size={24} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-800 group-hover:text-[#2E7D32] transition-colors">
                        {report.title}
                      </h3>
                      <span className="key-cap py-0.5 px-2 text-[10px]">
                        {report.type}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-gray-500 max-w-xl">
                      {report.description}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                        <CalendarDays size={12} className="text-gray-400" />
                        Date: {report.date}
                      </span>

                      <span className="text-[11px] text-gray-500 font-medium">
                        • {report.count} {report.count === 1 ? "Record" : "Records"}
                      </span>

                      {report.count === 0 && (
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          Sample preview will be exported
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* PDF DOWNLOAD BUTTON */}
                <button
                  type="button"
                  onClick={() => handleDownloadPDF(report)}
                  disabled={isDownloading}
                  className="key-cap shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-[#2E7D32] disabled:opacity-50 cursor-pointer"
                >
                  {isDownloading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#2E7D32] border-t-transparent" />
                  ) : (
                    <>
                      <Download size={15} />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* HOW TO USE REPORTS / INFO BOX */}
      <div className="rounded-2xl border border-[#DCE8D9] bg-gradient-to-br from-[#F4F9F2] to-[#EBF6EE] p-5">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2E7D32] text-white shadow-sm">
            <Wheat size={20} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#1B5E20]">
              Official Farm Records & Advisory Documentation
            </h4>
            <p className="mt-1 text-xs text-gray-600 leading-relaxed">
              KrushiMitra PDF reports are pre-formatted for printing, submitting to agricultural credit/loan applications, government crop insurance assessments, or sharing with local Krishi Vigyan Kendra (KVK) agronomists.
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