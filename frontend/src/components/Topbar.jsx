import { useState, useRef, useEffect } from "react";
import {
  Bell,
  Search,
  ChevronDown,
  Sun,
  Moon,
  User,
  Settings as SettingsIcon,
  LogOut,
  Shield,
  CheckCheck,
  X,
  Sparkles,
  CloudRain,
  Sprout,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  Lock,
  Download,
  WifiOff,
} from "lucide-react";

import { useApp } from "../context/AppContext";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import InstallModal from "./InstallModal";

export default function Topbar({ title, nav }) {
  const { isOnline, isInstallable, promptInstall } = useOnlineStatus();
  const {
    user,
    logout,
    language,
    setLanguage,
    theme,
    changeTheme,
    notifications,
    markAllNotificationsAsRead,
    clearAllNotifications,
    t,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const notifsList = notifications || [];
  const unreadCount = notifsList.filter((n) => n.unread).length;

  const getNotifIcon = (type) => {
    switch (type) {
      case "prediction":
        return TrendingUp;
      case "recommendation":
        return Sprout;
      case "weather":
        return CloudRain;
      case "admin":
        return Shield;
      case "profile":
        return User;
      case "security":
        return Lock;
      case "welcome":
        return Sparkles;
      case "report":
        return FileText;
      default:
        return Bell;
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes("predict") || q.includes("yield")) {
      nav?.("prediction");
    } else if (q.includes("recommend") || q.includes("soil") || q.includes("crop")) {
      nav?.("recommendation");
    } else if (q.includes("weather") || q.includes("rain") || q.includes("temp")) {
      nav?.("weather");
    } else if (q.includes("report") || q.includes("pdf")) {
      nav?.("reports");
    } else if (q.includes("history")) {
      nav?.("history");
    } else if (q.includes("profile") || q.includes("farmer")) {
      nav?.("profile");
    } else if (q.includes("setting") || q.includes("theme") || q.includes("dark")) {
      nav?.("settings");
    } else {
      nav?.("dashboard");
    }
  };

  const userName = user?.name || "Ramesh Patil";
  const userRole = user?.role || "Farmer";
  const userEmail = user?.email || "farmer@krushimitra.in";
  const initial = userName ? userName.charAt(0).toUpperCase() : "F";

  const today = new Date();
  const formattedDate = today.toLocaleDateString(
    language === "mr" ? "mr-IN" : language === "hi" ? "hi-IN" : "en-IN",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  return (
    <header className="sticky top-0 z-40 flex h-[78px] shrink-0 items-center justify-between gap-4 border-b border-[#E1EAE0] bg-white/95 px-4 sm:px-7 shadow-[0_2px_15px_rgba(30,70,35,0.035)] backdrop-blur-xl transition-colors duration-200">
      {/* PAGE TITLE & DATE */}
      <div className="min-w-fit">
        <h2 className="text-[17px] font-extrabold tracking-tight text-[#17291A]">
          {title}
        </h2>
        <p className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
          <Clock size={11} className="text-gray-400" />
          <span>{formattedDate}</span>
        </p>
      </div>

      {/* SEARCH BAR (Visible in Light & Dark Mode) */}
      <div className="hidden max-w-[420px] flex-1 md:block">
        <form onSubmit={handleSearchSubmit} className="group relative">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#2E7D32]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder") || "Search crops, predictions, weather, reports..."}
            aria-label={t("search") || "Search"}
            className="h-10 w-full rounded-xl border border-[#DCE7DA] bg-[#F7F9F6] pl-10 pr-4 text-xs text-gray-800 outline-none transition-all placeholder:text-gray-400 hover:border-[#B9D2B6] focus:border-[#2E7D32] focus:bg-white focus:ring-4 focus:ring-[#2E7D32]/10"
          />
        </form>
      </div>

      {/* RIGHT ACTION CONTROLS */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* OFFLINE STATUS BADGE */}
        {!isOnline && (
          <div
            className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-[11px] font-bold text-amber-800 shadow-2xs"
            title={language === "mr" ? "ऑफलाइन मोड सक्रिय" : language === "hi" ? "ऑफलाइन मोड सक्रिय" : "Offline Mode Active"}
          >
            <WifiOff size={13} className="text-amber-600 animate-pulse" />
            <span className="hidden sm:inline">
              {language === "mr" ? "ऑफलाइन" : language === "hi" ? "ऑफलाइन" : "Offline"}
            </span>
          </div>
        )}

        {/* PWA INSTALL / DOWNLOAD APP BUTTON */}
        <button
          type="button"
          onClick={async () => {
            if (isInstallable && promptInstall) {
              const res = await promptInstall();
              if (!res) setShowInstallModal(true);
            } else {
              setShowInstallModal(true);
            }
          }}
          className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 shadow-2xs transition hover:bg-emerald-100 hover:shadow-sm cursor-pointer"
          title={language === "mr" ? "अ‍ॅप डाऊनलोड / इन्स्टॉल करा" : language === "hi" ? "ऐप डाउनलोड / इंस्टॉल करें" : "Download / Install App"}
        >
          <Download size={13} className="text-[#2E7D32]" />
          <span className="hidden sm:inline">
            {language === "mr" ? "अ‍ॅप डाऊनलोड" : language === "hi" ? "ऐप डाउनलोड" : "Download App"}
          </span>
        </button>

        {/* LANGUAGE SELECTOR */}
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label={t("language") || "Language"}
            className="h-10 appearance-none rounded-xl border border-[#DCE7DA] bg-[#F7F9F6] pl-3 pr-7 text-xs font-bold text-[#2E7D32] outline-none transition-all hover:border-[#AFC8AB] focus:ring-4 focus:ring-[#2E7D32]/10 cursor-pointer"
          >
            <option value="en">EN</option>
            <option value="hi">हिन्दी</option>
            <option value="mr">मराठी</option>
          </select>
          <ChevronDown
            size={13}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#2E7D32]"
          />
        </div>

        {/* THEME TOGGLE (SUN / MOON) */}
        <button
          type="button"
          onClick={() => changeTheme(theme === "dark" ? "light" : "dark")}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#DCE7DA] bg-[#F7F9F6] text-gray-600 transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-[#B9D2B6] hover:bg-white hover:text-[#2E7D32] hover:shadow-md active:scale-95 cursor-pointer"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? (
            <Sun size={18} className="text-amber-400 transition-transform duration-300 hover:rotate-90" />
          ) : (
            <Moon size={18} className="text-[#2E7D32] transition-transform duration-300 hover:-rotate-12" />
          )}
        </button>

        {/* NOTIFICATION BUTTON & DROPDOWN */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="bell-hover relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#DCE7DA] bg-[#F7F9F6] text-gray-600 transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-[#B9D2B6] hover:bg-white hover:text-[#2E7D32] hover:shadow-md active:scale-95 cursor-pointer"
            title={t("notifications") || "Notifications"}
            aria-label={t("notifications") || "Notifications"}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E11D48] text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* NOTIFICATIONS DROPDOWN PANEL */}
          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl border border-[#DCE8D9] bg-white p-4 shadow-2xl z-50 animate-pop">
              <div className="flex items-center justify-between border-b border-[#EEF2EC] pb-3">
                <div className="flex items-center gap-1.5">
                  <Bell size={16} className="text-[#2E7D32]" />
                  <h3 className="text-sm font-bold text-gray-800">
                    {language === "mr" ? "शेतकरी सूचना व अपडेट्स" : language === "hi" ? "किसान अलर्ट और अपडेट" : "Farm Alerts & Updates"}
                  </h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-[#E5F7EA] px-2 py-0.5 text-[10px] font-bold text-[#2E7D32]">
                      {unreadCount} {language === "mr" ? "नवीन" : language === "hi" ? "नए" : "new"}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] font-semibold text-[#2E7D32] hover:underline cursor-pointer"
                    >
                      {language === "mr" ? "वाचलेले चिन्हांकित करा" : language === "hi" ? "पढ़ा हुआ चिह्नित करें" : "Mark read"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* NOTIFICATION ITEMS */}
              <div className="divide-y divide-[#EEF2EC] max-h-72 overflow-y-auto my-2">
                {notifsList.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-400">
                    {language === "mr" ? "आपल्या खात्यासाठी नवीन सूचना नाहीत." : language === "hi" ? "आपके खाते के लिए कोई नई सूचना नहीं है।" : "No new notifications for your account."}
                  </div>
                ) : (
                  notifsList.map((item) => {
                    const Icon = getNotifIcon(item.type);
                    return (
                      <div
                        key={item.id}
                        className={`flex items-start gap-3 py-3 px-2 transition rounded-xl ${
                          item.unread ? "bg-[#FAFDF9]" : ""
                        }`}
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                            item.unread
                              ? "bg-[#EAF5E8] text-[#2E7D32]"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <Icon size={17} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-gray-800">
                              {item.title}
                            </p>
                            <span className="text-[10px] text-gray-400">
                              {item.time || (language === "mr" ? "आत्ताच" : language === "hi" ? "अभी" : "Just now")}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                            {item.desc}
                          </p>
                        </div>
                        {item.unread && (
                          <span className="mt-1 h-2 w-2 rounded-full bg-[#2E7D32] shrink-0" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* FOOTER */}
              <div className="border-t border-[#EEF2EC] pt-2.5 flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={clearAllNotifications}
                  className="font-medium text-gray-400 hover:text-red-500 cursor-pointer"
                >
                  {language === "mr" ? "सर्व हटवा" : language === "hi" ? "सभी हटाएं" : "Clear all"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifications(false);
                    nav?.("notifications");
                  }}
                  className="font-bold text-[#2E7D32] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{t("notifications") || (language === "mr" ? "सर्व सूचना" : language === "hi" ? "सभी सूचनाएं" : "All notifications")}</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* USER PROFILE BUTTON & DROPDOWN */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="group flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-[#F5F8F4] cursor-pointer"
            aria-label={t("profile") || "Profile"}
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2E8B38] via-[#16A34A] to-[#10B981] text-sm font-extrabold text-white shadow-md ring-2 ring-white transition-transform duration-200 group-hover:scale-105">
              {initial}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#22C55E]" />
            </div>

            <div className="hidden text-left lg:block">
              <p className="max-w-[110px] truncate text-[11px] font-bold text-gray-800">
                {userName}
              </p>
              <p className="text-[10px] font-medium text-gray-400">
                {userRole === "Admin" ? (t("superAdminBadge") || "Super-Admin") : (t("farmer") || "Farmer")}
              </p>
            </div>

            <ChevronDown
              size={14}
              className={`hidden text-gray-400 transition-transform duration-200 sm:block ${
                showProfileMenu ? "rotate-180 text-[#2E7D32]" : "group-hover:text-[#2E7D32]"
              }`}
            />
          </button>

          {/* PROFILE DROPDOWN MENU */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2.5 w-60 rounded-2xl border border-[#DCE8D9] bg-white p-3 shadow-2xl z-50 animate-page-enter">
              {/* USER HEADER */}
              <div className="border-b border-[#EEF2EC] pb-3 px-2 text-left">
                <p className="text-xs font-bold text-gray-800 truncate">
                  {userName}
                </p>
                <p className="text-[11px] text-gray-400 truncate mt-0.5">
                  {userEmail}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  <span className="rounded-full bg-[#E5F7EA] px-2 py-0.5 text-[9px] font-bold text-[#2E7D32]">
                    🌾 {userRole === "Admin" ? (t("superAdminBadge") || "Super-Admin") : (t("farmer") || "Farmer")}
                  </span>
                  {(user?.kisan_id || user?.kisanId) && (
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-mono font-bold text-[#1B5E20]">
                      {user.kisan_id || user.kisanId}
                    </span>
                  )}
                </div>
              </div>

              {/* MENU ACTIONS */}
              <div className="py-2 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    nav?.("profile");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-[#F0F8ED] hover:text-[#2E7D32] cursor-pointer"
                >
                  <User size={15} className="text-[#2E7D32]" />
                  <span>{t("myProfile") || "Farmer Profile Details"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    nav?.("settings");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-[#F0F8ED] hover:text-[#2E7D32] cursor-pointer"
                >
                  <SettingsIcon size={15} className="text-[#2E7D32]" />
                  <span>{t("settings") || "Settings & Appearance"}</span>
                </button>

                {user?.role === "Admin" && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      nav?.("admin");
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-[#F0F8ED] hover:text-[#2E7D32] cursor-pointer"
                  >
                    <Shield size={15} className="text-[#2E7D32]" />
                    <span>{t("admin") || "Admin & RBAC Controls"}</span>
                  </button>
                )}
              </div>

              {/* LOGOUT */}
              <div className="border-t border-[#EEF2EC] pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout?.();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>{t("logout") || "Sign Out"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* INSTALL MODAL */}
      <InstallModal isOpen={showInstallModal} onClose={() => setShowInstallModal(false)} />
    </header>
  );
}