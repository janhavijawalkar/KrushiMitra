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
    <div className="min-h-screen bg-[#F6F8F4] dark:bg-[#0D1710] text-[#17291A] dark:text-[#F8FAFC] transition-colors duration-200 print:bg-white print:text-[#17291A]">

      {/* MOBILE BACKDROP OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="no-print fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden animate-fade-in"
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR (Desktop fixed + Mobile slide-over drawer) */}
      <div className="no-print">
        <Sidebar
          page={page}
          setPage={nav}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
      </div>

      {/* MAIN CONTENT WRAPPER */}
      <div
        className={`
          min-h-screen
          transition-[padding-left]
          duration-300
          ease-out
          pl-0
          print:!pl-0
          ${collapsed ? "lg:pl-[78px]" : "lg:pl-[260px]"}
        `}
      >
        <div className="no-print">
          <OfflineBanner />
          <Topbar
            title={title}
            nav={nav}
            setMobileOpen={setMobileOpen}
          />
        </div>

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
            print:!p-0
            print:!m-0
            print:!min-h-0
            print:!overflow-visible
          "
        >
          <div
            key={page}
            className="
              mx-auto
              w-full
              max-w-[1600px]
              animate-page-enter
              print:!max-w-none
              print:!animate-none
            "
          >
            {children}
          </div>
        </main>
      </div>

      {/* DYNAMIC MOBILE BOTTOM NAVIGATION (Phone Website & Phone App) */}
      <div className="no-print">
        <MobileBottomNav page={page} setPage={nav} />
      </div>

      {/* KRUSHIMITRA MULTILINGUAL VOICE CHATBOT */}
      <div className="no-print">
        <VoiceChatbot nav={nav} openInstallModal={() => setShowInstallModal(true)} />
      </div>

      {/* KRUSHIMITRA PWA / APK INSTALL MODAL */}
      <div className="no-print">
        <InstallModal
          isOpen={showInstallModal}
          onClose={() => setShowInstallModal(false)}
        />
      </div>
    </div>
  );
}