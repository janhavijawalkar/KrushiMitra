import { useState } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  TrendingUp,
  Sprout,
  CloudRain,
  Shield,
  User,
  Sparkles,
  FileText,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Inbox,
} from "lucide-react";

import { useApp } from "../context/AppContext";

export default function Notifications({ nav }) {
  const {
    user,
    notifications,
    addNotification,
    markAllNotificationsAsRead,
    clearAllNotifications,
    language,
    t,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState("all");
  const [toastMsg, setToastMsg] = useState("");

  const notifsList = notifications || [];
  const unreadCount = notifsList.filter((n) => n.unread).length;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

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
      case "report":
        return FileText;
      case "welcome":
        return Sparkles;
      default:
        return Bell;
    }
  };

  const getNotifBadge = (type) => {
    switch (type) {
      case "prediction":
        return {
          label: language === "mr" ? "पीक अंदाज" : language === "hi" ? "फसल पूर्वानुमान" : "Yield Forecast",
          color: "bg-emerald-100 text-emerald-800",
        };
      case "recommendation":
        return {
          label: language === "mr" ? "माती सल्ला" : language === "hi" ? "मृदा सलाह" : "Soil Advisory",
          color: "bg-teal-100 text-teal-800",
        };
      case "weather":
        return {
          label: language === "mr" ? "हवामान" : language === "hi" ? "मौसम" : "Climate",
          color: "bg-blue-100 text-blue-800",
        };
      case "admin":
        return {
          label: language === "mr" ? "प्रणाली" : language === "hi" ? "सिस्टम" : "System",
          color: "bg-purple-100 text-purple-800",
        };
      case "report":
        return {
          label: language === "mr" ? "शेती अहवाल" : language === "hi" ? "कृषि रिपोर्ट" : "Farm Report",
          color: "bg-amber-100 text-amber-800",
        };
      case "welcome":
        return {
          label: language === "mr" ? "स्वागत" : language === "hi" ? "स्वागत" : "Welcome",
          color: "bg-green-100 text-green-800",
        };
      default:
        return {
          label: language === "mr" ? "सामान्य" : language === "hi" ? "सामान्य" : "General",
          color: "bg-gray-100 text-gray-800",
        };
    }
  };

  const getActionTarget = (type) => {
    switch (type) {
      case "prediction":
        return {
          label: language === "mr" ? "उत्पादन अंदाज उघडा" : language === "hi" ? "उपज पूर्वानुमान खोलें" : "Open Yield Predictor",
          page: "prediction",
        };
      case "recommendation":
        return {
          label: language === "mr" ? "माती सल्ला पहा" : language === "hi" ? "मृदा सलाह देखें" : "Open Soil Advisory",
          page: "recommendation",
        };
      case "weather":
        return {
          label: language === "mr" ? "जिल्हा हवामान तपासा" : language === "hi" ? "जिला मौसम देखें" : "Check District Weather",
          page: "weather",
        };
      case "report":
        return {
          label: language === "mr" ? "शेती अहवाल पहा" : language === "hi" ? "कृषि रिपोर्ट देखें" : "View Farm Reports",
          page: "reports",
        };
      case "admin":
        return {
          label: language === "mr" ? "अॅडमिन नियंत्रण" : language === "hi" ? "एडमिन नियंत्रण" : "Admin Controls",
          page: "admin",
        };
      case "profile":
        return {
          label: language === "mr" ? "शेतकरी प्रोफाइल" : language === "hi" ? "किसान प्रोफ़ाइल" : "Farmer Profile",
          page: "profile",
        };
      default:
        return {
          label: language === "mr" ? "डॅशबोर्डवर जा" : language === "hi" ? "डैशबोर्ड पर जाएँ" : "Go to Dashboard",
          page: "dashboard",
        };
    }
  };

  const filteredNotifs = notifsList.filter((n) => {
    if (activeFilter === "unread") return n.unread;
    if (activeFilter === "prediction") return n.type === "prediction";
    if (activeFilter === "recommendation") return n.type === "recommendation";
    if (activeFilter === "weather") return n.type === "weather";
    if (activeFilter === "system") return n.type === "admin" || n.type === "welcome";
    return true;
  });

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
    showToast("All notifications marked as read.");
  };

  const handleClearAll = () => {
    clearAllNotifications();
    showToast("Notification history cleared.");
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-[#172B18]">
              {t("notifications") || "Farm Alerts & Notification Center"}
            </h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-[#E11D48] px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            {language === "mr"
              ? "थेट उत्पादन सूचना, माती घटक शिफारसी, जिल्हा हवामान अंदाज आणि प्रणाली नोंदी."
              : language === "hi"
              ? "वास्तविक समय उपज अलर्ट, मृदा पोषक सिफारिशें, जिला मौसम अपडेट और सिस्टम लॉग।"
              : "Real-time harvest alerts, soil nutrient recommendations, district climate updates, and system logs."}
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-2.5">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="key-cap flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#2E7D32] hover:bg-[#EAF5E8] cursor-pointer"
            >
              <CheckCheck size={15} />
              <span>{language === "mr" ? "सर्व वाचले म्हणून चिन्हांकित करा" : language === "hi" ? "सभी को पढ़ा हुआ चिह्नित करें" : "Mark all as read"}</span>
            </button>
          )}

          {notifsList.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="key-cap flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 hover:border-red-200 cursor-pointer"
            >
              <Trash2 size={14} />
              <span>{language === "mr" ? "सर्व साफ करा" : language === "hi" ? "सभी हटाएं" : "Clear all"}</span>
            </button>
          )}
        </div>
      </div>

      {/* TOAST MESSAGE */}
      {toastMsg && (
        <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-[#EAF7EC] p-3.5 text-xs sm:text-sm font-semibold text-[#1B5E20] shadow-sm animate-fade-in">
          <CheckCircle2 size={18} className="text-[#2E7D32]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* FILTER TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#DCE8D9] pb-3">
        {[
          { id: "all", label: language === "mr" ? "सर्व सूचना" : language === "hi" ? "सभी अलर्ट" : "All Alerts", count: notifsList.length },
          { id: "unread", label: language === "mr" ? "न वाचलेले" : language === "hi" ? "अपठित" : "Unread", count: unreadCount },
          { id: "prediction", label: language === "mr" ? "पीक उत्पादन" : language === "hi" ? "फसल उपज" : "Yield Forecasts" },
          { id: "recommendation", label: language === "mr" ? "माती सल्ला" : language === "hi" ? "मृदा सलाह" : "Soil Advisories" },
          { id: "weather", label: language === "mr" ? "हवामान व पाऊस" : language === "hi" ? "मौसम व वर्षा" : "Climate & Rain" },
          { id: "system", label: language === "mr" ? "प्रणाली व स्वागत" : language === "hi" ? "सिस्टम व स्वागत" : "System & Welcome" },
        ].map((tab) => {
          const active = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                active
                  ? "bg-[#2E7D32] text-white shadow-sm"
                  : "bg-white text-gray-600 border border-[#DCE8D9] hover:bg-[#F3F8F0] hover:text-[#2E7D32]"
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === "number" && tab.count > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                    active ? "bg-white text-[#2E7D32]" : "bg-[#EAF3E6] text-[#2E7D32]"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* NOTIFICATIONS LIST */}
      <div key={activeFilter} className="space-y-3 animate-fade-in-up">
        {filteredNotifs.length === 0 ? (
          <div className="rounded-3xl border border-[#DCE8D9] bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF3E6] text-[#2E7D32]">
              <Inbox size={28} />
            </div>
            <h3 className="mt-4 text-base font-bold text-gray-800">
              {language === "mr" ? "कोणत्याही सूचना आढळल्या नाहीत" : language === "hi" ? "कोई सूचना नहीं मिली" : "No notifications found"}
            </h3>
            <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
              {activeFilter === "unread"
                ? (language === "mr" ? "आपण आपल्या सर्व शेती सूचना वाचल्या आहेत!" : language === "hi" ? "आपने अपने सभी कृषि अलर्ट पढ़ लिए हैं!" : "You have read all your farm alerts and updates!")
                : (language === "mr" ? "या श्रेणीमध्ये अद्याप कोणतीही सूचना नाही." : language === "hi" ? "इस श्रेणी में अभी कोई सूचना नहीं है।" : "You don't have any notifications in this category yet.")}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => nav?.("prediction")}
                className="btn-shimmer rounded-xl bg-[#2E7D32] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#1B5E20] cursor-pointer"
              >
                {language === "mr" ? "पीक उत्पादन अंदाज चालवा" : language === "hi" ? "फसल उपज पूर्वानुमान चलाएं" : "Run AI Yield Predictor"}
              </button>
            </div>
          </div>
        ) : (
          filteredNotifs.map((item) => {
            const Icon = getNotifIcon(item.type);
            const badge = getNotifBadge(item.type);
            const action = getActionTarget(item.type);

            return (
              <div
                key={item.id}
                className={`card card-interactive flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border p-4.5 sm:p-5 transition-all shadow-xs ${
                  item.unread
                    ? "bg-[#FAFDF9] border-emerald-300 ring-1 ring-emerald-200/50"
                    : "bg-white border-[#DCE8D9]"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-2xs ${
                      item.unread
                        ? "bg-gradient-to-br from-[#2E7D32] to-[#10B981] text-white"
                        : "bg-[#EAF3E6] text-[#2E7D32]"
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  <div className="space-y-1 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-800">
                        {item.title}
                      </h4>
                      {item.unread && (
                        <span className="flex h-2 w-2 rounded-full bg-[#2E7D32] animate-ping" />
                      )}
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
                      {item.desc}
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-[10px] text-gray-400">
                      <Clock size={11} />
                      <span>{item.time || "Recent"}</span>
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTON */}
                <div className="shrink-0 flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EEF2EC]">
                  <button
                    type="button"
                    onClick={() => nav?.(action.page)}
                    className="key-cap flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#2E7D32] hover:bg-[#EAF5E8] cursor-pointer"
                  >
                    <span>{action.label}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
