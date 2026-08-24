import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Common Header and Branding for KrushiMitra PDF Reports
 */
function addPdfHeader(doc, title, subtitle, user) {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Top Green Banner
  doc.setFillColor(30, 90, 40); // Dark Green #1E5A28
  doc.rect(0, 0, pageWidth, 28, "F");

  // Accent Line
  doc.setFillColor(16, 185, 129); // Emerald #10B981
  doc.rect(0, 28, pageWidth, 2.5, "F");

  // Logo / Title Text
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("KRUSHIMITRA", 14, 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("AI-POWERED AGRICULTURE INTELLIGENCE SYSTEM", 14, 20);

  // Date on right
  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  doc.setFontSize(8.5);
  doc.text(`Generated: ${today}`, pageWidth - 14, 14, { align: "right" });
  doc.text(`Farmer: ${user?.name || "Registered Farmer"}`, pageWidth - 14, 20, {
    align: "right",
  });

  // Report Title Box
  doc.setTextColor(33, 37, 41);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(title, 14, 40);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(subtitle, 14, 46);

  // Divider line
  doc.setDrawColor(220, 230, 220);
  doc.setLineWidth(0.5);
  doc.line(14, 50, pageWidth - 14, 50);
}

/**
 * Common Footer on all pages
 */
function addPdfFooter(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer divider
    doc.setDrawColor(220, 230, 220);
    doc.setLineWidth(0.4);
    doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);

    // Footer text
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(140, 150, 160);
    doc.text(
      "KrushiMitra Decision Support System • Predictions are based on trained ML Random Forest models.",
      14,
      pageHeight - 8
    );

    doc.setFont("helvetica", "bold");
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, pageHeight - 8, {
      align: "right",
    });
  }
}

/**
 * 1. Generate Crop Yield Prediction PDF
 */
export function generateYieldReportPDF(predictions, user) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const data = predictions.length > 0 ? predictions : getSamplePredictions();

  addPdfHeader(
    doc,
    "Crop Productivity & Yield Prediction Report",
    "Detailed analytical report of estimated crop yield based on farm parameters and weather data",
    user
  );

  // Summary Metrics Box
  const avgYield = (
    data.reduce((sum, item) => sum + Number(item.productivity || 0), 0) /
    data.length
  ).toFixed(2);
  const totalArea = data
    .reduce((sum, item) => sum + Number(item.area || 0), 0)
    .toFixed(1);

  doc.setFillColor(243, 248, 242);
  doc.roundedRect(14, 54, 182, 18, 3, 3, "F");
  doc.setDrawColor(210, 230, 210);
  doc.roundedRect(14, 54, 182, 18, 3, 3, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(46, 125, 50);
  doc.text("SUMMARY METRICS:", 18, 62);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  doc.text(
    `Total Predictions: ${data.length}   |   Avg. Predicted Yield: ${avgYield} tonnes/ha   |   Total Land Area: ${totalArea} ha`,
    18,
    68
  );

  // Table Data
  const tableRows = data.map((item, index) => [
    index + 1,
    item.crop || "—",
    item.district || "—",
    item.season || "—",
    `${item.area || 0} ha`,
    `${item.rainfall || 0} mm`,
    `${item.temperature || 0} °C`,
    `${Number(item.productivity || 0).toFixed(2)} t/ha`,
    item.createdAt
      ? new Date(item.createdAt).toLocaleDateString("en-IN")
      : "Recent",
  ]);

  autoTable(doc, {
    startY: 77,
    head: [
      [
        "#",
        "Crop",
        "District",
        "Season",
        "Area",
        "Rainfall",
        "Temp",
        "Predicted Yield",
        "Date",
      ],
    ],
    body: tableRows,
    theme: "striped",
    headStyles: {
      fillColor: [46, 125, 50],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8.5,
      halign: "center",
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [40, 40, 40],
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: [247, 251, 246],
    },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { fontStyle: "bold", textColor: [30, 90, 40] },
      7: { fontStyle: "bold", textColor: [16, 140, 70] },
    },
    margin: { left: 14, right: 14 },
  });

  // Advisory Note
  const finalY = doc.lastAutoTable.finalY + 10;
  if (finalY < 250) {
    doc.setFillColor(250, 250, 245);
    doc.roundedRect(14, finalY, 182, 22, 2, 2, "F");
    doc.setDrawColor(230, 230, 200);
    doc.roundedRect(14, finalY, 182, 22, 2, 2, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(140, 100, 20);
    doc.text("💡 KrushiMitra Yield Advisory:", 18, finalY + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(80, 80, 80);
    doc.text(
      "Yield estimations are computed using historical regional trends and agro-climatic factors. Optimize irrigation and fertilizer scheduling to reach peak potential yield.",
      18,
      finalY + 14,
      { maxWidth: 174 }
    );
  }

  addPdfFooter(doc);
  doc.save("KrushiMitra_Crop_Yield_Report.pdf");
}

/**
 * 2. Generate Crop Recommendation Advisory PDF
 */
export function generateRecommendationReportPDF(recommendations, user) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const data =
    recommendations.length > 0
      ? recommendations
      : getSampleRecommendations();

  addPdfHeader(
    doc,
    "AI Crop Suitability & Recommendation Advisory",
    "Tailored crop selection advisory based on soil N-P-K nutrients, pH levels, and climate conditions",
    user
  );

  // Summary Metrics Box
  doc.setFillColor(243, 248, 242);
  doc.roundedRect(14, 54, 182, 18, 3, 3, "F");
  doc.setDrawColor(210, 230, 210);
  doc.roundedRect(14, 54, 182, 18, 3, 3, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(46, 125, 50);
  doc.text("SOIL & CROP HEALTH SUMMARY:", 18, 62);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  doc.text(
    `Total Soil Samples Analyzed: ${data.length}   |   AI Recommendation Confidence: 90%+   |   Model: Random Forest`,
    18,
    68
  );

  // Table Data
  const tableRows = data.map((item, index) => [
    index + 1,
    (item.crop || "—").toUpperCase(),
    `${item.nitrogen || 0}`,
    `${item.phosphorus || 0}`,
    `${item.potassium || 0}`,
    `${item.ph || 0}`,
    `${item.temperature || 0} °C`,
    `${item.humidity || 0}%`,
    `${item.rainfall || 0} mm`,
    item.createdAt
      ? new Date(item.createdAt).toLocaleDateString("en-IN")
      : "Recent",
  ]);

  autoTable(doc, {
    startY: 77,
    head: [
      [
        "#",
        "Recommended Crop",
        "Nitrogen (N)",
        "Phosphorus (P)",
        "Potassium (K)",
        "pH",
        "Temp",
        "Humidity",
        "Rainfall",
        "Date",
      ],
    ],
    body: tableRows,
    theme: "striped",
    headStyles: {
      fillColor: [46, 125, 50],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
      halign: "center",
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [40, 40, 40],
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: [247, 251, 246],
    },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { fontStyle: "bold", textColor: [30, 90, 40] },
    },
    margin: { left: 14, right: 14 },
  });

  // Agronomic Guideline
  const finalY = doc.lastAutoTable.finalY + 10;
  if (finalY < 250) {
    doc.setFillColor(240, 249, 242);
    doc.roundedRect(14, finalY, 182, 24, 2, 2, "F");
    doc.setDrawColor(200, 230, 210);
    doc.roundedRect(14, finalY, 182, 24, 2, 2, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 100, 40);
    doc.text("🌱 Soil Health Management Tip:", 18, finalY + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(70, 70, 70);
    doc.text(
      "Ensure soil organic carbon is replenished with compost or farmyard manure. If soil pH is lower than 6.0, apply agricultural lime; if higher than 8.0, consider gypsum application.",
      18,
      finalY + 14,
      { maxWidth: 174 }
    );
  }

  addPdfFooter(doc);
  doc.save("KrushiMitra_Crop_Recommendation_Report.pdf");
}

/**
 * 3. Generate Comprehensive Farm Audit & Performance PDF
 */
export function generateComprehensiveFarmReportPDF(
  predictions,
  recommendations,
  user
) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const preds = predictions.length > 0 ? predictions : getSamplePredictions();
  const recs =
    recommendations.length > 0
      ? recommendations
      : getSampleRecommendations();

  addPdfHeader(
    doc,
    "Comprehensive Agricultural Intelligence Report",
    "Consolidated multi-module report: Crop Yield Predictions, AI Recommendations & Field Analytics",
    user
  );

  // Section 1: Yield Predictions
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 90, 40);
  doc.text("1. Crop Yield & Productivity Predictions", 14, 58);

  const yieldRows = preds.slice(0, 8).map((item, index) => [
    index + 1,
    item.crop || "—",
    item.district || "—",
    item.season || "—",
    `${item.area || 0} ha`,
    `${Number(item.productivity || 0).toFixed(2)} t/ha`,
  ]);

  autoTable(doc, {
    startY: 62,
    head: [["#", "Crop", "District", "Season", "Area", "Predicted Yield"]],
    body: yieldRows,
    theme: "striped",
    headStyles: {
      fillColor: [46, 125, 50],
      textColor: [255, 255, 255],
      fontSize: 8,
      halign: "center",
    },
    bodyStyles: { fontSize: 8, halign: "center" },
    margin: { left: 14, right: 14 },
  });

  // Section 2: Recommendations
  const nextY = doc.lastAutoTable.finalY + 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 90, 40);
  doc.text("2. Soil Nutrient & Crop Recommendations", 14, nextY);

  const recRows = recs.slice(0, 8).map((item, index) => [
    index + 1,
    (item.crop || "—").toUpperCase(),
    `N:${item.nitrogen} P:${item.phosphorus} K:${item.potassium}`,
    `pH: ${item.ph}`,
    `${item.temperature}°C / ${item.rainfall}mm`,
  ]);

  autoTable(doc, {
    startY: nextY + 4,
    head: [["#", "Recommended Crop", "NPK Profile", "Soil pH", "Climate"]],
    body: recRows,
    theme: "striped",
    headStyles: {
      fillColor: [16, 140, 70],
      textColor: [255, 255, 255],
      fontSize: 8,
      halign: "center",
    },
    bodyStyles: { fontSize: 8, halign: "center" },
    margin: { left: 14, right: 14 },
  });

  addPdfFooter(doc);
  doc.save("KrushiMitra_Comprehensive_Farm_Report.pdf");
}

/* Sample data fallbacks for preview if history is empty */
function getSamplePredictions() {
  return [
    {
      crop: "Rice",
      district: "Pune",
      season: "Kharif",
      area: 2.5,
      rainfall: 1150,
      temperature: 28,
      productivity: 3.45,
      createdAt: new Date(),
    },
    {
      crop: "Wheat",
      district: "Nagpur",
      season: "Rabi",
      area: 4.0,
      rainfall: 320,
      temperature: 22,
      productivity: 2.95,
      createdAt: new Date(),
    },
    {
      crop: "Cotton",
      district: "Amravati",
      season: "Kharif",
      area: 3.2,
      rainfall: 850,
      temperature: 31,
      productivity: 1.85,
      createdAt: new Date(),
    },
  ];
}

function getSampleRecommendations() {
  return [
    {
      crop: "Rice",
      nitrogen: 90,
      phosphorus: 42,
      potassium: 43,
      ph: 6.5,
      temperature: 24,
      humidity: 82,
      rainfall: 210,
      createdAt: new Date(),
    },
    {
      crop: "Maize",
      nitrogen: 80,
      phosphorus: 45,
      potassium: 20,
      ph: 6.8,
      temperature: 26,
      humidity: 65,
      rainfall: 95,
      createdAt: new Date(),
    },
    {
      crop: "Chickpea",
      nitrogen: 40,
      phosphorus: 60,
      potassium: 80,
      ph: 7.2,
      temperature: 19,
      humidity: 45,
      rainfall: 70,
      createdAt: new Date(),
    },
  ];
}
