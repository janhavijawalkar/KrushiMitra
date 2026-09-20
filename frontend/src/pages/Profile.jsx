import { useState, useEffect } from "react";
import {
  User,
  Lock,
  Bell,
  Pencil,
  Save,
  X,
  BarChart3,
  FileText,
  Sprout,
  Target,
  Phone,
  Mail,
  MapPin,
  Trees,
  Droplets,
  Layers,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  Wheat,
  Check,
} from "lucide-react";

import { useApp } from "../context/AppContext";

export default function Profile() {
  const {
    user,
    setUser,
    login,
    apiUpdateProfile,
    apiChangePassword,
    predictionHistory,
    recommendationHistory,
    language,
    changeLanguage,
    t,
    tDistrict,
    tCrop,
  } = useApp();

  const currentUser = user || {};

  const getInitialForm = (u) => {
    let kid = u?.kisanId || u?.kisan_id || "";
    if (typeof kid === "string" && (kid.startsWith("PMK-MH-2026") || kid.startsWith("ADM-MH-2026"))) {
      kid = "";
    }
    return {
      name: u?.name || "",
      email: u?.email || "",
      phone: u?.phone || "",
      state: u?.state || "Maharashtra",
      district: u?.district || "",
      farmSize: u?.farmSize || u?.farm_size || "",
      farmUnit: u?.farmUnit || u?.farm_unit || "Acres",
      soilType: u?.soilType || u?.soil_type || "",
      irrigationType: u?.irrigationType || u?.irrigation_type || "",
      primaryCrops: u?.primaryCrops || u?.primary_crops || "",
      kisanId: kid,
      farmDetails: u?.farmDetails || u?.farm_details || "",
    };
  };

  const [activeTab, setActiveTab] = useState("personal");
  const [editing, setEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailToast, setEmailToast] = useState("");

  const handleResendWelcomeEmail = async () => {
    if (!currentUser?.email) return;
    setSendingEmail(true);
    setEmailToast("");
    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/resend-welcome-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentUser.email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEmailToast("✅ Official Kisan ID email sent! Check Inbox & Spam.");
      } else {
        setEmailToast(`Failed: ${data.message || "Could not dispatch email."}`);
      }
    } catch (err) {
      setEmailToast("Server error. Please verify backend is running.");
    } finally {
      setSendingEmail(false);
    }
  };

  // Personal & Farm Details Form (No static dummy data)
  const [form, setForm] = useState(() => getInitialForm(currentUser));

  // Sync form when user changes
  useEffect(() => {
    setForm(getInitialForm(user));
  }, [user]);

  // Password / Security Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Notification Preferences
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("krushimitra_notification_prefs");
    return saved
      ? JSON.parse(saved)
      : {
          predictionResults: true,
          weatherAlerts: true,
          cropRecommendations: true,
          reportUpdates: false,
          smsAlerts: true,
        };
  });

  const districts = [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana",
    "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna",
    "Kolhapur", "Latur", "Mumbai City", "Nagpur", "Nanded", "Nandurbar", "Nashik",
    "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli",
    "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
  ];

  const soilTypes = [
    { value: "Black Clayey Soil (Regur)", label: { en: "Black Clayey Soil (Regur)", mr: "काळी चिकण माती (रेगूर)", hi: "काली चिकनी मिट्टी (रेगुर)" } },
    { value: "Red & Yellow Loamy Soil", label: { en: "Red & Yellow Loamy Soil", mr: "तांबडी व पिवळी दुमट माती", hi: "लाल एवं पीली दोमट मिट्टी" } },
    { value: "Alluvial River Basin Soil", label: { en: "Alluvial River Basin Soil", mr: "गाळाची सुपीक माती", hi: "जलोढ़ नदी घाटी मिट्टी" } },
    { value: "Laterite Soil", label: { en: "Laterite Soil", mr: "जांभी माती (लॅटेराइट)", hi: "लैटेराइट मिट्टी" } },
    { value: "Sandy Loam Soil", label: { en: "Sandy Loam Soil", mr: "रेताड दुमट माती", hi: "बलुई दोमट मिट्टी" } },
    { value: "Saline / Alkaline Soil", label: { en: "Saline / Alkaline Soil", mr: "खारवट / चोपण जमीन", hi: "लवणीय / क्षारीय मिट्टी" } },
  ];

  const irrigationMethods = [
    { value: "Drip & Micro-Irrigation", label: { en: "Drip & Micro-Irrigation", mr: "ठिबक व सूक्ष्म सिंचन", hi: "टपक एवं सूक्ष्म सिंचाई" } },
    { value: "Drip & Canal Irrigation", label: { en: "Drip & Canal Irrigation", mr: "ठिबक व कालवा सिंचन", hi: "टपक एवं नहर सिंचाई" } },
    { value: "Sprinkler Irrigation System", label: { en: "Sprinkler Irrigation System", mr: "तुषार सिंचन पद्धत", hi: "फव्वारा सिंचाई प्रणाली" } },
    { value: "Canal & Well Irrigation", label: { en: "Canal & Well Irrigation", mr: "कालवा व विहीर सिंचन", hi: "नहर एवं कुआं सिंचाई" } },
    { value: "Borewell & Pump System", label: { en: "Borewell & Pump System", mr: "बोअरवेल व पंप सिस्टीम", hi: "बोरवेल एवं पंप प्रणाली" } },
    { value: "Rainfed / Natural Monsoon", label: { en: "Rainfed / Natural Monsoon", mr: "कोरडवाहू / पावसावर आधारित", hi: "वर्षा आधारित / प्राकृतिक मानसून" } },
  ];

  const getLocalizedSoilType = (val) => {
    if (!val || val.trim() === "" || val.trim() === "—") {
      return language === "mr" ? "नोंद नाही" : language === "hi" ? "कोई विवरण नहीं" : "—";
    }
    const found = soilTypes.find((s) => s.value.toLowerCase().trim() === val.toLowerCase().trim());
    if (found) return found.label[language] || found.label.en;

    const low = val.toLowerCase();
    if (low.includes("black") || low.includes("regur") || low.includes("काळी") || low.includes("काली")) {
      return language === "mr" ? "काळी चिकण माती (रेगूर)" : language === "hi" ? "काली चिकनी मिट्टी (रेगुर)" : "Black Clayey Soil (Regur)";
    }
    if (low.includes("red") || low.includes("yellow") || low.includes("तांबडी") || low.includes("लाल")) {
      return language === "mr" ? "तांबडी व पिवळी दुमट माती" : language === "hi" ? "लाल एवं पीली दोमट मिट्टी" : "Red & Yellow Loamy Soil";
    }
    if (low.includes("alluvial") || low.includes("basin") || low.includes("गाळाची") || low.includes("जलोढ़")) {
      return language === "mr" ? "गाळाची सुपीक माती" : language === "hi" ? "जलोढ़ नदी घाटी मिट्टी" : "Alluvial River Basin Soil";
    }
    if (low.includes("laterite") || low.includes("जांभी") || low.includes("लैटेराइट")) {
      return language === "mr" ? "जांभी माती (लॅटेराइट)" : language === "hi" ? "लैटेराइट मिट्टी" : "Laterite Soil";
    }
    if (low.includes("sandy") || low.includes("रेताड") || low.includes("बलुई")) {
      return language === "mr" ? "रेताड दुमट माती" : language === "hi" ? "बलुई दोमट मिट्टी" : "Sandy Loam Soil";
    }
    if (low.includes("saline") || low.includes("alkaline") || low.includes("खारवट") || low.includes("लवणीय")) {
      return language === "mr" ? "खारवट / चोपण जमीन" : language === "hi" ? "लवणीय / क्षारीय मिट्टी" : "Saline / Alkaline Soil";
    }
    return val;
  };

  const getLocalizedIrrigation = (val) => {
    if (!val || val.trim() === "" || val.trim() === "—") {
      return language === "mr" ? "नोंद नाही" : language === "hi" ? "कोई विवरण नहीं" : "—";
    }
    const found = irrigationMethods.find((i) => i.value.toLowerCase().trim() === val.toLowerCase().trim());
    if (found) return found.label[language] || found.label.en;

    const low = val.toLowerCase();
    if ((low.includes("drip") && low.includes("canal")) || (low.includes("ठिबक") && low.includes("कालवा")) || (low.includes("टपक") && low.includes("नहर"))) {
      return language === "mr" ? "ठिबक व कालवा सिंचन" : language === "hi" ? "टपक एवं नहर सिंचाई" : "Drip & Canal Irrigation";
    }
    if (low.includes("drip") || low.includes("micro") || low.includes("ठिबक") || low.includes("टपक")) {
      return language === "mr" ? "ठिबक व सूक्ष्म सिंचन" : language === "hi" ? "टपक एवं सूक्ष्म सिंचाई" : "Drip & Micro-Irrigation";
    }
    if (low.includes("sprinkler") || low.includes("तुषार") || low.includes("फव्वारा")) {
      return language === "mr" ? "तुषार सिंचन पद्धत" : language === "hi" ? "फव्वारा सिंचाई प्रणाली" : "Sprinkler Irrigation System";
    }
    if ((low.includes("canal") && low.includes("well")) || (low.includes("कालवा") && low.includes("विहीर")) || (low.includes("नहर") && low.includes("कुआं"))) {
      return language === "mr" ? "कालवा व विहीर सिंचन" : language === "hi" ? "नहर एवं कुआं सिंचाई" : "Canal & Well Irrigation";
    }
    if (low.includes("canal") || low.includes("कालवा") || low.includes("नहर")) {
      return language === "mr" ? "कालवा सिंचन" : language === "hi" ? "नहर सिंचाई" : "Canal Irrigation";
    }
    if (low.includes("borewell") || low.includes("well") || low.includes("pump") || low.includes("बोअरवेल") || low.includes("बोरवेल")) {
      return language === "mr" ? "बोअरवेल व पंप सिस्टीम" : language === "hi" ? "बोरवेल एवं पंप प्रणाली" : "Borewell & Pump System";
    }
    if (low.includes("rain") || low.includes("monsoon") || low.includes("कोरडवाहू") || low.includes("मानसून")) {
      return language === "mr" ? "कोरडवाहू / पावसावर आधारित" : language === "hi" ? "वर्षा आधारित / प्राकृतिक मानसून" : "Rainfed / Natural Monsoon";
    }
    return val;
  };

  const getLocalizedCrops = (cropsStr) => {
    if (!cropsStr || cropsStr.trim() === "" || cropsStr.trim() === "—") {
      return language === "mr" ? "नोंद नाही" : language === "hi" ? "कोई विवरण नहीं" : "—";
    }
    const items = cropsStr.split(/[,;\/]+/).map((c) => c.trim()).filter(Boolean);
    if (!items.length) return "—";
    return items.map((crop) => (tCrop ? tCrop(crop) : crop)).join(", ");
  };

  const getLocalizedFarmDetails = (details) => {
    if (!details || details.trim() === "" || details.trim() === "—" || details.trim().toLowerCase() === "none") {
      return language === "mr"
        ? "माती संवर्धन आणि आधुनिक तंत्रज्ञानावर आधारित शाश्वत शेती पद्धती."
        : language === "hi"
        ? "मृदा संरक्षण एवं आधुनिक तकनीक पर आधारित सतत कृषि पद्धति।"
        : "Sustainable farming practice focused on soil conservation and modern techniques.";
    }
    const low = details.toLowerCase();
    if (low.includes("organic") || low.includes("regenerative") || low.includes("सेंद्रिय") || low.includes("जैविक")) {
      return language === "mr"
        ? "माती पुनरुज्जीवन तंत्रावर भर देणारी सेंद्रिय शेती पद्धत."
        : language === "hi"
        ? "मिट्टी पुनर्जनन तकनीकों पर केंद्रित जैविक कृषि पद्धति।"
        : "Organic farming practice with focus on soil regenerative techniques.";
    }
    if (low.includes("citrus") || low.includes("orchard") || low.includes("pulse") || low.includes("फळबाग") || low.includes("बाग")) {
      return language === "mr"
        ? "संत्र्याची फळबाग लागवड आणि कडधान्यांचे फेरपालट पीक."
        : language === "hi"
        ? "संतरे के बाग की खेती और दलहन फसल चक्र।"
        : "Citrus orchard plantation and rotation pulse crops.";
    }
    if (low.includes("admin") || low.includes("operations") || low.includes("master") || low.includes("कृषीशास्त्र")) {
      return language === "mr"
        ? "कृषीमित्र मुख्य कृषीशास्त्र आणि कामकाज नियंत्रण केंद्र."
        : language === "hi"
        ? "कृषि-मित्र मुख्य कृषि विज्ञान एवं संचालन केंद्र।"
        : "KrushiMitra Master Agronomy & Operations Desk.";
    }
    return details;
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();

    const payload = {
      ...currentUser,
      ...form,
      name: form.name.trim(),
      email: (currentUser.email || form.email).trim().toLowerCase(),
      phone: form.phone.trim(),
    };

    await apiUpdateProfile(payload);
    setEditing(false);
    showToast(t("profileSavedSuccess") || "Profile and farm details successfully saved!");
  };

  const handleCancel = () => {
    setForm(getInitialForm(currentUser));
    setEditing(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMsg("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError(t("fillPasswordFields") || "Please fill all password fields.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError(t("passwordMinLength") || "New password must be at least 6 characters long.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError(t("passwordsDoNotMatch") || "New passwords do not match.");
      return;
    }

    const email = currentUser.email || form.email;
    const res = await apiChangePassword(email, passwordForm.currentPassword, passwordForm.newPassword);
    if (res.success) {
      setPasswordMsg(t("passwordUpdatedSuccess") || "Password successfully updated in database!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordMsg(""), 4500);
    } else {
      setPasswordError(res.message || "Failed to update password. Verify current password.");
    }
  };

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("krushimitra_notification_prefs", JSON.stringify(updated));
      return updated;
    });
    showToast(t("notificationAlerts") || "Notification preference updated.");
  };

  // Dynamic User-Scoped Metrics
  const userEmail = (currentUser.email || form.email || "").toLowerCase().trim();
  const userPreds = predictionHistory.filter(
    (p) => !userEmail || (p.user_email && p.user_email.toLowerCase() === userEmail)
  );
  const userRecs = recommendationHistory.filter(
    (r) => !userEmail || (r.user_email && r.user_email.toLowerCase() === userEmail)
  );

  const totalPreds = userPreds.length;
  const totalRecs = userRecs.length;
  const uniqueCrops = new Set([
    ...userPreds.map((p) => p.crop),
    ...userRecs.map((r) => r.crop),
  ]).size;

  const avgYield = totalPreds
    ? (
        userPreds.reduce(
          (sum, item) => sum + Number(item.productivity || 0),
          0
        ) / totalPreds
      ).toFixed(2) + " t/ha"
    : "—";

  const initial = form.name ? form.name.charAt(0).toUpperCase() : (currentUser.role === "Admin" ? "A" : "F");
  const isAdmin = currentUser.role === "Admin";

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-zoom-fade">
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-[#172B18] flex items-center gap-2">
          {isAdmin ? (
            <>
              <span>{t("adminProfileHeading") || "System Administrator Profile & Operations Desk"}</span>
              <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-[#1B5E20]">
                🛡️ Super-Admin
              </span>
            </>
          ) : (
            t("profilePageHeading") || "Farmer Profile & Farm Records"
          )}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          {isAdmin
            ? (t("adminProfileSub") || "Manage system administration credentials, root security privileges, and platform command oversight.")
            : (t("profilePageSub") || "Manage your personal details, contact information, farm land characteristics, and security.")}
        </p>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-[#EAF7EC] p-3.5 text-xs sm:text-sm font-semibold text-[#1B5E20] shadow-sm animate-fade-in">
          <CheckCircle2 size={18} className="text-[#2E7D32]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MAIN LAYOUT */}
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* ================= LEFT PROFILE CARD ================= */}
        <div className="space-y-6">
          {/* USER INFO CARD */}
          <div className="rounded-3xl border border-[#DCE8D9] bg-white p-7 shadow-sm text-center depth-1 card-interactive">
            {/* AVATAR */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#2E7D32] via-[#16A34A] to-[#10B981] text-4xl font-extrabold text-white shadow-lg animate-float-slow">
                  {initial}
                </div>
                {!editing && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("personal");
                      setEditing(true);
                    }}
                    className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#2E7D32] text-white shadow-md transition hover:bg-[#1B5E20] cursor-pointer"
                    title={t("editProfileDetails") || "Edit Profile"}
                  >
                    <Pencil size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* NAME & ROLE */}
            <h2 className="mt-4 text-xl font-extrabold text-gray-800">
              {form.name || (isAdmin ? "KrushiMitra Administrator" : t("registeredFarmerBadge") || "Registered Farmer")}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">{form.email}</p>
            {form.phone && (
              <p className="text-xs font-semibold text-[#2E7D32] mt-1 flex items-center justify-center gap-1">
                <Phone size={12} /> {form.phone}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
              <span className="rounded-full bg-[#E5F7EA] px-3 py-1 text-[11px] font-bold text-[#2E7D32]">
                {isAdmin ? "🛡️ Super-Admin" : `🌾 ${t("farmer") || "Farmer"}`}
              </span>
              <span className="rounded-full bg-[#F0F8ED] px-3 py-1 text-[11px] font-bold text-gray-600">
                📍 {form.district && form.district.trim() ? (tDistrict ? tDistrict(form.district) : form.district) : (isAdmin ? "Central Command Desk" : "Maharashtra")}
              </span>
            </div>

            {/* KISAN ID / MEMBER DATE / ADMIN BADGE */}
            <div className="mt-5 rounded-2xl bg-[#F6F8F4] dark:bg-[#152319] p-3.5 text-left text-xs space-y-1.5 border border-[#E2EAE0] dark:border-gray-800">
              {isAdmin ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Access Tier:</span>
                    <span className="font-bold text-[#2E7D32]">Tier 1 (Root Access)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Command Hub:</span>
                    <span className="font-bold text-gray-700">{form.district && form.district.trim() ? `${form.district} Operations Desk` : "Central Command Desk"}</span>
                  </div>
                </>
              ) : (
                <>
                  {form.kisanId && form.kisanId.trim() ? (
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">{t("kisanId") || "Kisan ID:"}</span>
                      <span className="font-bold text-gray-700 dark:text-gray-200">{form.kisanId}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">{t("memberSince") || "Member Since:"}</span>
                    <span className="font-bold text-gray-700 dark:text-gray-200">
                      {currentUser.memberSince || currentUser.member_since || (language === "mr" ? "नुकतेच सामील" : language === "hi" ? "हाल ही में जुड़े" : "Recently Joined")}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* WELCOME DOSSIER EMAIL ACTION */}
            {!isAdmin && currentUser?.email && (
              <div className="mt-4 pt-3 border-t border-[#EEF2EC]">
                <button
                  type="button"
                  onClick={handleResendWelcomeEmail}
                  disabled={sendingEmail}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#1B5E20] py-2 px-3 text-xs font-bold transition duration-200 cursor-pointer disabled:opacity-60"
                >
                  <Mail size={14} />
                  <span>{sendingEmail ? (language === "mr" ? "ईमेल पाठवत आहे..." : language === "hi" ? "ईमेल भेजा जा रहा है..." : "Sending Email...") : (language === "mr" ? "किसान आयडी ईमेल पुन्हा पाठवा" : language === "hi" ? "किसान आईडी ईमेल दोबारा भेजें" : "Resend Kisan ID & Welcome Email")}</span>
                </button>
                {emailToast && (
                  <p className={`mt-2 text-[11px] font-medium text-center ${emailToast.includes("Failed") ? "text-red-600" : "text-emerald-700 font-bold"}`}>
                    {emailToast}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* DYNAMIC ACTIVITY STATS */}
          <div className="rounded-3xl border border-[#DCE8D9] bg-white p-6 shadow-sm depth-1 card-interactive">
            <h3 className="mb-4 text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <BarChart3 size={17} className="text-[#2E7D32]" />
              <span>{isAdmin ? "Platform Telemetry Overview" : (t("liveFarmStats") || "Live Farm Statistics")}</span>
            </h3>

            {isAdmin ? (
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between border-b border-[#EEF2EC] pb-3">
                  <span className="text-gray-500">System Predictions Logged:</span>
                  <strong className="text-sm font-bold text-gray-800">{predictionHistory.length}</strong>
                </div>

                <div className="flex items-center justify-between border-b border-[#EEF2EC] pb-3">
                  <span className="text-gray-500">Crop Advisories Generated:</span>
                  <strong className="text-sm font-bold text-gray-800">{recommendationHistory.length}</strong>
                </div>

                <div className="flex items-center justify-between border-b border-[#EEF2EC] pb-3">
                  <span className="text-gray-500">AI ML Models:</span>
                  <strong className="text-sm font-bold text-[#2E7D32]">RandomForest & Classifier Active</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Database Engine:</span>
                  <strong className="text-sm font-bold text-[#2E7D32]">Multi-Tenant DB (Live)</strong>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between border-b border-[#EEF2EC] pb-3">
                  <span className="text-gray-500">{t("yieldPredictionsLabel") || "Yield Predictions:"}</span>
                  <strong className="text-sm font-bold text-gray-800">{totalPreds}</strong>
                </div>

                <div className="flex items-center justify-between border-b border-[#EEF2EC] pb-3">
                  <span className="text-gray-500">{t("cropRecommendationsLabel") || "Crop Recommendations:"}</span>
                  <strong className="text-sm font-bold text-gray-800">{totalRecs}</strong>
                </div>

                <div className="flex items-center justify-between border-b border-[#EEF2EC] pb-3">
                  <span className="text-gray-500">{t("cropsAnalyzed")}:</span>
                  <strong className="text-sm font-bold text-[#2E7D32]">
                    {uniqueCrops} {t("cropsUnit") || "Crops"}
                  </strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">{t("averagePredictedYield")}:</span>
                  <strong className="text-sm font-bold text-[#2E7D32]">{avgYield}</strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT EDITABLE TABS ================= */}
        <div className="overflow-hidden rounded-3xl border border-[#DCE8D9] bg-white shadow-sm depth-1">
          {/* TAB HEADER */}
          <div className="flex border-b border-[#E2EAE0] overflow-x-auto">
            {[
              { id: "personal", label: isAdmin ? "Administrator Credentials & Role" : (t("personalAndFarmInfo") || "Personal & Farm Information"), icon: User },
              { id: "security", label: t("securityAndPassword") || "Security & Password", icon: Lock },
              { id: "notifications", label: t("notificationAlerts") || "Notification Alerts", icon: Bell },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex shrink-0 items-center gap-2 px-6 py-4.5 text-xs sm:text-sm font-bold transition cursor-pointer ${
                    active
                      ? "border-b-2 border-[#2E7D32] text-[#2E7D32] bg-[#FAFDF9]"
                      : "text-gray-500 hover:text-[#2E7D32]"
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: PERSONAL & FARM DETAILS */}
          {activeTab === "personal" && (
            <div key="personal" className="p-6 sm:p-8 space-y-6 animate-zoom-fade">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#EEF2EC] pb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {isAdmin ? "System Administrator & Security Identity" : (t("farmerAgriDetails") || "Farmer & Agricultural Details")}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {isAdmin
                      ? "Manage official administrator name, contact email, and system authorization parameters."
                      : (t("farmerAgriDetailsSub") || "Update phone number, district, soil type, and farming methods.")}
                  </p>
                </div>

                {!editing ? (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="btn-shimmer btn-glow inline-flex items-center justify-center gap-2 rounded-xl bg-[#2E7D32] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1B5E20] cursor-pointer"
                  >
                    <Pencil size={14} />
                    <span>{t("editProfileDetails") || "Edit Details"}</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                    >
                      <X size={14} />
                      <span>{t("cancel") || "Cancel"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      className="btn-shimmer btn-glow flex items-center gap-1.5 rounded-xl bg-[#2E7D32] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#1B5E20] cursor-pointer"
                    >
                      <Save size={14} />
                      <span>{t("saveChanges") || "Save Changes"}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* FORM FIELDS */}
              <form onSubmit={handleSaveProfile} className="space-y-5">
                {/* SECTION 1: PERSONAL CONTACT */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2E7D32] mb-3 flex items-center gap-1">
                    <User size={13} /> {isAdmin ? "1. Administrator Identity & Contact" : (t("contactAndIdentity") || "1. Contact & Identity")}
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* FULL NAME */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        {isAdmin ? "Administrator Full Name *" : (t("farmerFullName") || "Farmer Full Name *")}
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          required
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#2E7D32] focus:bg-white"
                        />
                      ) : (
                        <div className="rounded-xl border border-[#E2EAE0] bg-[#F8FAF7] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-800">
                          {form.name || "—"}
                        </div>
                      )}
                    </div>

                    {/* PHONE NUMBER */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        {t("phoneMobile") || "Phone / Mobile Number"}
                      </label>
                      {editing ? (
                        <div className="relative">
                          <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210 (Optional)"
                            className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2.5 pl-9 text-xs sm:text-sm outline-none focus:border-[#2E7D32] focus:bg-white"
                          />
                        </div>
                      ) : (
                        <div className="rounded-xl border border-[#E2EAE0] bg-[#F8FAF7] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-800">
                          {form.phone && form.phone.trim() ? form.phone : "—"}
                        </div>
                      )}
                    </div>

                    {/* EMAIL ADDRESS */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        {t("email") || "Email Address"}
                      </label>
                      {editing ? (
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#2E7D32] focus:bg-white"
                        />
                      ) : (
                        <div className="rounded-xl border border-[#E2EAE0] bg-[#F8FAF7] px-3.5 py-2.5 text-xs sm:text-sm text-gray-800">
                          {form.email}
                        </div>
                      )}
                    </div>

                    {/* CITY / DISTRICT */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        {t("districtMaharashtra") || "District / City (Maharashtra)"}
                      </label>
                      {editing ? (
                        <select
                          name="district"
                          value={form.district}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#2E7D32]"
                        >
                          <option value="">-- Select District / City --</option>
                          {districts.map((d) => (
                            <option key={d} value={d}>
                              {tDistrict ? tDistrict(d) : d}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="rounded-xl border border-[#E2EAE0] bg-[#F8FAF7] px-3.5 py-2.5 text-xs sm:text-sm text-gray-800">
                          {form.district && form.district.trim() ? (tDistrict ? tDistrict(form.district) : form.district) : "—"}
                        </div>
                      )}
                    </div>

                    {/* KISAN ID (ONLY FOR FARMERS) */}
                    {!isAdmin && (
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          {t("pmKisanIdLabel") || "KCC / PM-Kisan ID (Optional)"}
                        </label>
                        {editing ? (
                          <input
                            type="text"
                            name="kisanId"
                            value={form.kisanId}
                            onChange={handleChange}
                            placeholder={t("pmKisanIdPlaceholder") || "Enter PM-Kisan / KCC ID if available"}
                            className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#2E7D32] focus:bg-white"
                          />
                        ) : (
                          <div className="rounded-xl border border-[#E2EAE0] bg-[#F8FAF7] dark:bg-[#152319] dark:border-gray-800 px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                            {form.kisanId || "—"}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* SECTION 2: FARM & LAND PROFILE (ONLY FOR FARMERS) */}
                {!isAdmin && (
                  <div className="pt-2 border-t border-[#EEF2EC]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#2E7D32] mb-3 flex items-center gap-1">
                      <Wheat size={13} /> {t("farmlandProfileHeading") || "2. Farmland & Agronomic Profile"}
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* DISTRICT */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          {t("districtMaharashtra") || "District (Maharashtra)"}
                        </label>
                        {editing ? (
                          <select
                            name="district"
                            value={form.district}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#2E7D32]"
                          >
                            {districts.map((d) => (
                              <option key={d} value={d}>
                                {tDistrict ? tDistrict(d) : d}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="rounded-xl border border-[#E2EAE0] bg-[#F8FAF7] px-3.5 py-2.5 text-xs sm:text-sm text-gray-800">
                            {tDistrict ? tDistrict(form.district) : form.district}
                          </div>
                        )}
                      </div>

                      {/* FARM SIZE */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          {t("totalCultivatedLandArea") || "Total Cultivated Land Area"}
                        </label>
                        {editing ? (
                          <div className="flex gap-2">
                            <input
                              type="number"
                              step="0.1"
                              name="farmSize"
                              value={form.farmSize}
                              onChange={handleChange}
                              className="w-2/3 rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#2E7D32]"
                            />
                            <select
                              name="farmUnit"
                              value={form.farmUnit}
                              onChange={handleChange}
                              className="w-1/3 rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-2 py-2.5 text-xs outline-none"
                            >
                              <option value="Acres">{t("acresUnit") || "Acres"}</option>
                              <option value="Hectares">{t("hectaresUnit") || "Hectares"}</option>
                              <option value="Guntha">{language === "mr" || language === "hi" ? "गुंठा" : "Guntha"}</option>
                            </select>
                          </div>
                        ) : (
                          <div className="rounded-xl border border-[#E2EAE0] bg-[#F8FAF7] dark:bg-[#152319] dark:border-gray-800 px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                            {form.farmSize
                              ? `${form.farmSize} ${
                                  form.farmUnit === "Hectares"
                                    ? t("hectaresUnit") || "Hectares"
                                    : form.farmUnit === "Guntha"
                                    ? (language === "mr" || language === "hi" ? "गुंठा" : "Guntha")
                                    : t("acresUnit") || "Acres"
                                }`
                              : "—"}
                          </div>
                        )}
                      </div>

                      {/* SOIL TYPE */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          {t("primarySoilClass") || "Primary Soil Classification"}
                        </label>
                        {editing ? (
                          <select
                            name="soilType"
                            value={form.soilType}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#2E7D32]"
                          >
                            <option value="">{t("selectSoilType") || "Select Soil Type..."}</option>
                            {soilTypes.map((st) => (
                              <option key={st.value} value={st.value}>
                                {st.label[language] || st.label.en}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="rounded-xl border border-[#E2EAE0] bg-[#F8FAF7] dark:bg-[#152319] dark:border-gray-800 px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                            {getLocalizedSoilType(form.soilType)}
                          </div>
                        )}
                      </div>

                      {/* IRRIGATION METHOD */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          {t("irrigationWaterSource") || "Irrigation & Water Source"}
                        </label>
                        {editing ? (
                          <select
                            name="irrigationType"
                            value={form.irrigationType}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#2E7D32]"
                          >
                            <option value="">{t("selectIrrigationSource") || "Select Irrigation Source..."}</option>
                            {irrigationMethods.map((im) => (
                              <option key={im.value} value={im.value}>
                                {im.label[language] || im.label.en}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="rounded-xl border border-[#E2EAE0] bg-[#F8FAF7] dark:bg-[#152319] dark:border-gray-800 px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                            {getLocalizedIrrigation(form.irrigationType)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* PRIMARY CROPS */}
                    <div className="mt-4">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {t("primaryCropsLabel") || "Primary Crops Usually Cultivated"}
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          name="primaryCrops"
                          value={form.primaryCrops}
                          onChange={handleChange}
                          placeholder={language === "mr" ? "उदा. सोयाबीन, कापूस, गहू, ऊस, मका" : language === "hi" ? "उदा. सोयाबीन, कपास, गेहूं, गन्ना, मक्का" : "e.g. Cotton, Soybean, Wheat, Rice, Sugarcane"}
                          className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#2E7D32]"
                        />
                      ) : (
                        <div className="rounded-xl border border-[#E2EAE0] bg-[#F8FAF7] dark:bg-[#152319] dark:border-gray-800 px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 dark:text-gray-200 font-medium">
                          {getLocalizedCrops(form.primaryCrops)}
                        </div>
                      )}
                    </div>

                    {/* FARM BIO */}
                    <div className="mt-4">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {t("fieldNotesLabel") || "Field Notes & Farming Practices"}
                      </label>
                      {editing ? (
                        <textarea
                          rows={3}
                          name="farmDetails"
                          value={form.farmDetails}
                          onChange={handleChange}
                          placeholder={language === "mr" ? "आपल्या शेताचे स्थान, मातीचा इतिहास, सेंद्रिय शेती पद्धती..." : language === "hi" ? "अपने खेत का स्थान, मिट्टी का इतिहास, जैविक खेती..." : "Add your farm location, soil history, organic certifications..."}
                          className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] p-3 text-xs sm:text-sm outline-none focus:border-[#2E7D32]"
                        />
                      ) : (
                        <div className="rounded-xl border border-[#E2EAE0] bg-[#F8FAF7] dark:bg-[#152319] dark:border-gray-800 p-3.5 text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                          {getLocalizedFarmDetails(form.farmDetails)}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {editing && (
                  <div className="pt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="key-cap rounded-xl px-5 py-2.5 text-xs font-semibold text-gray-600 cursor-pointer"
                    >
                      {t("cancel") || "Cancel"}
                    </button>
                    <button
                      type="submit"
                      className="btn-shimmer flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95 cursor-pointer"
                    >
                      <Save size={15} />
                      <span>{t("saveFarmProfile") || "Save Farm Profile"}</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* TAB 2: SECURITY & PASSWORD */}
          {activeTab === "security" && (
            <div key="security" className="p-6 sm:p-8 space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {t("accountSecurityHeading") || "Account Security & Password"}
                </h2>
                <p className="text-xs text-gray-500">
                  {t("accountSecuritySub") || "Manage login credentials and protect your agricultural data."}
                </p>
              </div>

              {passwordMsg && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-3.5 text-xs font-bold text-[#1B5E20]">
                  {passwordMsg}
                </div>
              )}

              {passwordError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-bold text-red-600">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t("currentPassword") || "Current Password"}
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    placeholder={t("enterCurrentPasswordPlaceholder") || "Enter current password"}
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t("newPassword") || "New Password"}
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    placeholder={t("min6CharsPlaceholder") || "Min. 6 characters"}
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t("confirmNewPassword") || "Confirm New Password"}
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    placeholder={t("reenterNewPasswordPlaceholder") || "Re-enter new password"}
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-shimmer flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95 cursor-pointer"
                >
                  <KeyRound size={15} />
                  <span>{t("updatePassword") || "Update Password"}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div key="notifications" className="p-6 sm:p-8 space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {t("notifAlertsHeading") || "Notification Alerts & Farmer Advisory Preferences"}
                </h2>
                <p className="text-xs text-gray-500">
                  {t("notifAlertsSub") || "Select which updates you want to receive regarding your crop predictions and weather."}
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    key: "predictionResults",
                    title: t("notifYieldTitle") || "Crop Yield & Prediction Insights",
                    desc: t("notifYieldDesc") || "Receive summaries when ML models predict new crop harvests.",
                  },
                  {
                    key: "weatherAlerts",
                    title: t("notifWeatherTitle") || "Live Extreme Weather & Rain Alerts",
                    desc: t("notifWeatherDesc") || "Severe rainfall, wind speed, or sudden temperature change notifications.",
                  },
                  {
                    key: "cropRecommendations",
                    title: t("notifCropRecTitle") || "Seasonal Crop & Fertilizer Recommendations",
                    desc: t("notifCropRecDesc") || "Kharif and Rabi seasonal crop advisory prompts for your soil type.",
                  },
                  {
                    key: "smsAlerts",
                    title: t("notifSmsTitle") || "Kisan SMS Alerts to Mobile Phone",
                    desc: t("notifSmsDesc") || "Send high-priority advisory updates directly to your registered phone number.",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    onClick={() => handleNotificationToggle(item.key)}
                    className="flex items-center justify-between rounded-2xl border border-[#E2EAE0] bg-[#FAFDF9] p-4 transition hover:bg-[#F3F8F0] cursor-pointer"
                  >
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-800">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                    </div>

                    <input
                      type="checkbox"
                      checked={!!notifications[item.key]}
                      onChange={() => {}}
                      className="h-4 w-4 rounded accent-[#2E7D32] cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}