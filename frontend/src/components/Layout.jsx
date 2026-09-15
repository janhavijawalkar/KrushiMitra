import { useState, useEffect } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import OfflineBanner from "./OfflineBanner";
import VoiceChatbot from "./VoiceChatbot";
import MobileBottomNav from "./MobileBottomNav";
import InstallModal from "./InstallModal";

import { useApp } from "../context/AppContext";

export default function Layout({
  page,
  nav,
  children,
}) {
  const { t } = useApp();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  const titles = {
    dashboard: t("dashboard"),
    prediction: t("prediction"),
    recommendation: t("recommendation"),
    weather: t("weather"),
    reports: t("reports"),
    analytics: t("analytics") || "Agri Analytics",
    history: t("history"),
    "plant-doctor": t("plantDoctor") || "AI Plant Doctor",
    schemes: t("schemes") || "Govt Schemes",

    profile: t("profile"),
    settings: t("settings"),
    notifications: t("notifications") || "Notifications",
    admin: t("admin"),

    result: t("predictionResult"),
  };

  const title =
    titles[page] || "KrushiMitra";

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = title ? `${title} — KrushiMitra` : "KrushiMitra";
    }
  }, [title]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="min-h-screen bg-[#F6F8F4] dark:bg-[#0D1710] text-[#17291A] dark:text-[#F8FAFC] transition-colors duration-200">

      {/* MOBILE BACKDROP OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden animate-fade-in"
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR (Desktop fixed + Mobile slide-over drawer) */}
      <Sidebar
        page={page}
        setPage={nav}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* MAIN CONTENT WRAPPER */}
      <div
        className={`
          min-h-screen
          transition-[padding-left]
          duration-300
          ease-out
          pl-0
          ${collapsed ? "lg:pl-[78px]" : "lg:pl-[260px]"}
        `}
      >
        <OfflineBanner />
        <Topbar
          title={title}
          nav={nav}
          setMobileOpen={setMobileOpen}
        />

        <main
          className="
            min-h-[calc(100vh-78px)]
            overflow-x-hidden
            px-3 py-4
            pb-24
            sm:px-6
            sm:py-6
            lg:px-8
            lg:pb-8
            xl:px-10
          "
        >
          <div
            key={page}
            className="
              mx-auto
              w-full
              max-w-[1600px]
              animate-page-enter
            "
          >
            {children}
          </div>
        </main>
      </div>

      {/* DYNAMIC MOBILE BOTTOM NAVIGATION (Phone Website & Phone App) */}
      <MobileBottomNav page={page} setPage={nav} />

      {/* KRUSHIMITRA MULTILINGUAL VOICE CHATBOT */}
      <VoiceChatbot nav={nav} openInstallModal={() => setShowInstallModal(true)} />

      {/* KRUSHIMITRA PWA / APK INSTALL MODAL */}
      <InstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
}