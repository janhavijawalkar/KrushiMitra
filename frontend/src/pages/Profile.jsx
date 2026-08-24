import { useState } from "react";
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
  } = useApp();

  const currentUser = user || {};

  const [activeTab, setActiveTab] = useState("personal");
  const [editing, setEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Personal & Farm Details Form
  const [form, setForm] = useState({
    name: currentUser.name || "Ramesh Patil",
    email: currentUser.email || "ramesh.patil@krushimitra.in",
    phone: currentUser.phone || "+91 98230 45678",
    state: currentUser.state || "Maharashtra",
    district: currentUser.district || "Pune",
    farmSize: currentUser.farmSize || "5.0",
    farmUnit: currentUser.farmUnit || "Acres",
    soilType: currentUser.soilType || "Black Clayey Soil (Regur)",
    irrigationType: currentUser.irrigationType || "Drip & Canal Irrigation",
    primaryCrops: currentUser.primaryCrops || "Soybean, Cotton, Wheat",
    kisanId: currentUser.kisanId || "PMK-MH-2026-8941",
    farmDetails:
      currentUser.farmDetails ||
      "Organic farming practice with focus on soil regenerative techniques and precision drip irrigation.",
  });

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
    "Black Clayey Soil (Regur)",
    "Red & Yellow Loamy Soil",
    "Alluvial River Basin Soil",
    "Laterite Soil",
    "Sandy Loam Soil",
    "Saline / Alkaline Soil",
  ];

  const irrigationMethods = [
    "Drip & Micro-Irrigation",
    "Sprinkler Irrigation System",
    "Canal & Well Irrigation",
    "Borewell & Pump System",
    "Rainfed / Natural Monsoon",
  ];

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
    showToast("Profile and farm details successfully saved to database!");
  };

  const handleCancel = () => {
    setForm({
      name: currentUser.name || "Ramesh Patil",
      email: currentUser.email || "ramesh.patil@krushimitra.in",
      phone: currentUser.phone || "+91 98230 45678",
      state: currentUser.state || "Maharashtra",
      district: currentUser.district || "Pune",
      farmSize: currentUser.farmSize || "5.0",
      farmUnit: currentUser.farmUnit || "Acres",
      soilType: currentUser.soilType || "Black Clayey Soil (Regur)",
      irrigationType: currentUser.irrigationType || "Drip & Canal Irrigation",
      primaryCrops: currentUser.primaryCrops || "Soybean, Cotton, Wheat",
      kisanId: currentUser.kisanId || "PMK-MH-2026-8941",
      farmDetails: currentUser.farmDetails || "",
    });
    setEditing(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMsg("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("Please fill all password fields.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    const email = currentUser.email || form.email;
    const res = await apiChangePassword(email, passwordForm.currentPassword, passwordForm.newPassword);
    if (res.success) {
      setPasswordMsg("Password successfully updated in database!");
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
    showToast("Notification preference updated.");
  };

  // Dynamic Metrics
  const totalPreds = predictionHistory.length;
  const totalRecs = recommendationHistory.length;
  const uniqueCrops = new Set([
    ...predictionHistory.map((p) => p.crop),
    ...recommendationHistory.map((r) => r.crop),
  ]).size;

  const avgYield = totalPreds
    ? (
        predictionHistory.reduce(
          (sum, item) => sum + Number(item.productivity || 0),
          0
        ) / totalPreds
      ).toFixed(2) + " t/ha"
    : "—";

  const initial = form.name ? form.name.charAt(0).toUpperCase() : "F";

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-[#172B18]">
          {t("profile") || "Farmer Profile & Farm Records"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Manage your personal details, contact information, farm land characteristics, and security.
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
          <div className="rounded-3xl border border-[#DCE8D9] bg-white p-7 shadow-sm text-center">
            {/* AVATAR */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#2E7D32] via-[#16A34A] to-[#10B981] text-4xl font-extrabold text-white shadow-lg">
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
                    title="Edit Profile"
                  >
                    <Pencil size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* NAME & ROLE */}
            <h2 className="mt-4 text-xl font-extrabold text-gray-800">
              {form.name || "Registered Farmer"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">{form.email}</p>
            {form.phone && (
              <p className="text-xs font-semibold text-[#2E7D32] mt-1 flex items-center justify-center gap-1">
                <Phone size={12} /> {form.phone}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
              <span className="rounded-full bg-[#E5F7EA] px-3 py-1 text-[11px] font-bold text-[#2E7D32]">
                🌾 {currentUser.role || "Farmer"}
              </span>
              <span className="rounded-full bg-[#F0F8ED] px-3 py-1 text-[11px] font-bold text-gray-600">
                📍 {form.district || "Maharashtra"}
              </span>
            </div>

            {/* KISAN ID / MEMBER DATE */}
            <div className="mt-5 rounded-2xl bg-[#F6F8F4] p-3.5 text-left text-xs space-y-1.5 border border-[#E2EAE0]">
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Kisan ID:</span>
                <span className="font-bold text-gray-700">{form.kisanId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Member Since:</span>
                <span className="font-bold text-gray-700">
                  {currentUser.memberSince || "August 2026"}
                </span>
              </div>
            </div>
          </div>

          {/* DYNAMIC ACTIVITY STATS */}
          <div className="rounded-3xl border border-[#DCE8D9] bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <BarChart3 size={17} className="text-[#2E7D32]" />
              <span>Live Farm Statistics</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between border-b border-[#EEF2EC] pb-3">
                <span className="text-gray-500">Yield Predictions:</span>
                <strong className="text-sm font-bold text-gray-800">{totalPreds}</strong>
              </div>

              <div className="flex items-center justify-between border-b border-[#EEF2EC] pb-3">
                <span className="text-gray-500">Crop Recommendations:</span>
                <strong className="text-sm font-bold text-gray-800">{totalRecs}</strong>
              </div>

              <div className="flex items-center justify-between border-b border-[#EEF2EC] pb-3">
                <span className="text-gray-500">Crops Analyzed:</span>
                <strong className="text-sm font-bold text-[#2E7D32]">{uniqueCrops} Crops</strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Avg. Predicted Yield:</span>
                <strong className="text-sm font-bold text-[#2E7D32]">{avgYield}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT EDITABLE TABS ================= */}
        <div className="overflow-hidden rounded-3xl border border-[#DCE8D9] bg-white shadow-sm">
          {/* TAB HEADER */}
          <div className="flex border-b border-[#E2EAE0] overflow-x-auto">
            {[
              { id: "personal", label: "Personal & Farm Information", icon: User },
              { id: "security", label: "Security & Password", icon: Lock },
              { id: "notifications", label: "Notification Alerts", icon: Bell },
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
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#EEF2EC] pb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Farmer & Agricultural Details
                  </h2>
                  <p className="text-xs text-gray-500">
                    Update phone number, district, soil type, and farming methods.
                  </p>
                </div>

                {!editing ? (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2E7D32] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1B5E20] cursor-pointer"
                  >
                    <Pencil size={14} />
                    <span>Edit Profile Details</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                    >
                      <X size={14} />
                      <span>Cancel</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      className="flex items-center gap-1.5 rounded-xl bg-[#2E7D32] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#1B5E20] cursor-pointer"
                    >
                      <Save size={14} />
                      <span>Save Changes</span>
                    </button>
                  </div>
                )}
              </div>

              {/* FORM FIELDS */}
              <form onSubmit={handleSaveProfile} className="space-y-5">
                {/* SECTION 1: PERSONAL CONTACT */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2E7D32] mb-3 flex items-center gap-1">
                    <User size={13} /> 1. Contact & Identity
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* FULL NAME */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Farmer Full Name *
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
                          {form.name}
                        </div>
                      )}
                    </div>

                    {/* PHONE NUMBER */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Phone / WhatsApp Mobile *
                      </label>
                      {editing ? (
                        <div className="relative">
                          <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            required
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2.5 pl-9 text-xs sm:text-sm outline-none focus:border-[#2E7D32] focus:bg-white"
                          />
                        </div>
                      ) : (
                        <div className="rounded-xl border border-[#E2EAE0] bg-[#F8FAF7] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-800">
                          {form.phone || "—"}
                        </div>
                      )}
                    </div>

                    {/* EMAIL ADDRESS */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Email Address
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

                    {/* KISAN CARD / PM KISAN ID */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        KCC / PM-Kisan ID (Optional)
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          name="kisanId"
                          value={form.kisanId}
                          onChange={handleChange}
                          placeholder="e.g. PMK-MH-2026-XXXX"
                          className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#2E7D32] focus:bg-white"
                        />
                      ) : (
                        <div className="rounded-xl border border-[#E2EAE0] bg-[#F8FAF7] px-3.5 py-2.5 text-xs sm:text-sm text-gray-800">
                          {form.kisanId || "Not Registered"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* SECTION 2: FARM & LAND PROFILE */}
                <div className="pt-2 border-t border-[#EEF2EC]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2E7D32] mb-3 flex items-center gap-1">
                    <Wheat size={13} /> 2. Farmland & Agronomic Profile
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* DISTRICT */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        District (Maharashtra)
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
                              {d}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="rounded-xl border border-[#E2EAE0] bg-[#F8FAF7] px-3.5 py-2.5 text-xs sm:text-sm text-gray-800">
                          {form.district}
                        </div>
                      )}
                    </div>

                    {/* FARM SIZE */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Total Cultivated Land Area
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
                            <option value="Acres">Acres</option>
                            <option value="Hectares">Hectares</option>
                            <option value="Guntha">Guntha</option>
                          </select>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-[#E2EAE0] bg-[#F8FAF7] px-3.5 py-2.5 text-xs sm:text-sm text-gray-800">
                          {form.farmSize} {form.farmUnit}
                        </div>
                      )}
                    </div>

                    {/* SOIL TYPE */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Primary Soil Classification
                      </label>
                      {editing ? (
                        <select
                          name="soilType"
                          value={form.soilType}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#2E7D32]"
                        >
                          {soilTypes.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="rounded-xl border border-[#E2EAE0] bg-[#F8FAF7] px-3.5 py-2.5 text-xs sm:text-sm text-gray-800">
                          {form.soilType}
                        </div>
                      )}
                    </div>

                    {/* IRRIGATION METHOD */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Irrigation & Water Source
                      </label>
                      {editing ? (
                        <select
                          name="irrigationType"
                          value={form.irrigationType}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#2E7D32]"
                        >
                          {irrigationMethods.map((im) => (
                            <option key={im} value={im}>
                              {im}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="rounded-xl border border-[#E2EAE0] bg-[#F8FAF7] px-3.5 py-2.5 text-xs sm:text-sm text-gray-800">
                          {form.irrigationType}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* PRIMARY CROPS */}
                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Primary Crops Usually Cultivated
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="primaryCrops"
                        value={form.primaryCrops}
                        onChange={handleChange}
                        placeholder="e.g. Cotton, Soybean, Wheat, Rice, Sugarcane"
                        className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#2E7D32]"
                      />
                    ) : (
                      <div className="rounded-xl border border-[#E2EAE0] bg-[#F8FAF7] px-3.5 py-2.5 text-xs sm:text-sm text-gray-800">
                        {form.primaryCrops || "—"}
                      </div>
                    )}
                  </div>

                  {/* FARM BIO */}
                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Field Notes & Farming Practices
                    </label>
                    {editing ? (
                      <textarea
                        rows={3}
                        name="farmDetails"
                        value={form.farmDetails}
                        onChange={handleChange}
                        placeholder="Add special field notes, compost details, or soil treatment history..."
                        className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] p-3 text-xs sm:text-sm outline-none focus:border-[#2E7D32]"
                      />
                    ) : (
                      <div className="rounded-xl border border-[#E2EAE0] bg-[#F8FAF7] p-3.5 text-xs sm:text-sm text-gray-700 leading-relaxed min-h-[70px]">
                        {form.farmDetails || "No additional notes provided."}
                      </div>
                    )}
                  </div>
                </div>

                {editing && (
                  <div className="pt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="key-cap rounded-xl px-5 py-2.5 text-xs font-semibold text-gray-600 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-shimmer flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95 cursor-pointer"
                    >
                      <Save size={15} />
                      <span>Save Farm Profile</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* TAB 2: SECURITY & PASSWORD */}
          {activeTab === "security" && (
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Account Security & Password
                </h2>
                <p className="text-xs text-gray-500">
                  Manage login credentials and protect your agricultural data.
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
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    placeholder="Enter current password"
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    placeholder="Min. 6 characters"
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    placeholder="Re-enter new password"
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-shimmer flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95 cursor-pointer"
                >
                  <KeyRound size={15} />
                  <span>Update Password</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Notification Alerts & Farmer Advisory Preferences
                </h2>
                <p className="text-xs text-gray-500">
                  Select which updates you want to receive regarding your crop predictions and weather.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    key: "predictionResults",
                    title: "Crop Yield & Prediction Insights",
                    desc: "Receive summaries when ML models predict new crop harvests.",
                  },
                  {
                    key: "weatherAlerts",
                    title: "Live Extreme Weather & Rain Alerts",
                    desc: "Severe rainfall, wind speed, or sudden temperature change notifications.",
                  },
                  {
                    key: "cropRecommendations",
                    title: "Seasonal Crop & Fertilizer Recommendations",
                    desc: "Kharif and Rabi seasonal crop advisory prompts for your soil type.",
                  },
                  {
                    key: "smsAlerts",
                    title: "Kisan SMS Alerts to Mobile Phone",
                    desc: "Send high-priority advisory updates directly to your registered phone number.",
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