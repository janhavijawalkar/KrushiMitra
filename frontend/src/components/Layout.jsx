import { useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import VoiceChatbot from "./VoiceChatbot";

import { useApp } from "../context/AppContext";

export default function Layout({
  page,
  nav,
  children,
}) {
  const { t } = useApp();

  const [collapsed, setCollapsed] = useState(false);

  const titles = {
    dashboard: t("dashboard"),
    prediction: t("prediction"),
    recommendation: t("recommendation"),
    weather: t("weather"),
    reports: t("reports"),
    history: t("history"),

    profile: t("profile"),
    settings: t("settings"),
    notifications: t("notifications") || "Notifications",
    admin: t("admin"),

    result: t("predictionResult"),
  };

  const title =
    titles[page] || "KrushiMitra";

  return (
    <div className="min-h-screen bg-[#F6F8F4]">

      <Sidebar
        page={page}
        setPage={nav}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        className={`
          min-h-screen
          transition-[padding-left]
          duration-300
          ease-out
          ${collapsed ? "pl-[78px]" : "pl-[260px]"}
        `}
      >
        <Topbar title={title} nav={nav} />

        <main
          className="
            min-h-[calc(100vh-78px)]
            overflow-x-hidden
            px-4 py-5
            sm:px-6
            lg:px-8
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

      {/* KRUSHIMITRA MULTILINGUAL VOICE CHATBOT */}
      <VoiceChatbot />
    </div>
  );
}