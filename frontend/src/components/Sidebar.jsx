import {
  LayoutDashboard,
  ChartNoAxesCombined,
  Sprout,
  CloudSun,
  FileText,
  History,
  User,
  Settings,
  Bell,
  Shield,
  Menu,
  LogOut,
  ChevronLeft,
  BarChart3,
  Smartphone,
  Download,
  Leaf,
  Landmark,
} from "lucide-react";
import { useState } from "react";

import { useApp } from "../context/AppContext";
import InstallModal from "./InstallModal";

export default function Sidebar({
  page,
  setPage,
  collapsed,
  setCollapsed,
  mobileOpen = false,
  setMobileOpen,
}) {
  const { user, t, logout, notifications, language } = useApp();
  const [showInstallModal, setShowInstallModal] = useState(false);

  const unreadCount = (notifications || []).filter((n) => n.unread).length;

  const items = [
    {
      id: "dashboard",
      label: t("dashboard"),
      icon: LayoutDashboard,
    },
    {
      id: "prediction",
      label: t("prediction"),
      icon: ChartNoAxesCombined,
    },
    {
      id: "recommendation",
      label: t("recommendation"),
      icon: Sprout,
    },
    {
      id: "plant-doctor",
      label: t("plantDoctor") || "AI Plant Doctor",
      icon: Leaf,
    },
    {
      id: "schemes",
      label: t("schemes") || "Govt Schemes",
      icon: Landmark,
    },
    {
      id: "weather",
      label: t("weather"),
      icon: CloudSun,
    },
    {
      id: "reports",
      label: t("reports"),
      icon: FileText,
    },
    {
      id: "analytics",
      label: t("analytics") || "Agri Analytics",
      icon: BarChart3,
    },
    {
      id: "history",
      label: t("history"),
      icon: History,
    },
  ];

  const accountItems = [
    {
      id: "profile",
      label: t("profile"),
      icon: User,
    },
    {
      id: "notifications",
      label: t("notifications") || "Alerts",
      icon: Bell,
      badge: unreadCount,
    },
    {
      id: "settings",
      label: t("settings"),
      icon: Settings,
    },
    ...(user?.role === "Admin"
      ? [
          {
            id: "admin",
            label: t("admin") || "Admin Panel",
            icon: Shield,
          },
        ]
      : []),
  ];

  const handleNavigation = (id) => {
    if (setPage) {
      setPage(id);
    }
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <aside
      className={`
        no-print
        fixed left-0 top-0 z-[60] flex h-screen flex-col
        border-r border-[#DCE8D9] dark:border-[#24402A]
        bg-[#EAF3E6]/95 dark:bg-[#132318]/95 backdrop-blur-xl
        transition-all duration-300 ease-out
        w-[270px] lg:${collapsed ? "w-[78px]" : "w-[260px]"}
        ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
      `}
    >

      {/* BRAND */}

      <div
        className={`
          flex h-[82px] shrink-0 items-center justify-between
          border-b border-[#DCE8D9] dark:border-[#24402A]
          ${collapsed ? "justify-center px-3" : "px-5"}
        `}
      >

        <button
          onClick={() =>
            setCollapsed(!collapsed)
          }
          className="group flex items-center gap-3 cursor-pointer"
          title={t("toggleSidebar")}
        >

          <div
            className="
              relative flex h-11 w-11 shrink-0
              items-center justify-center
              overflow-hidden rounded-2xl
              bg-gradient-to-br from-[#2E7D32] via-[#16A34A] to-[#10B981]
              text-xl text-white
              shadow-[0_8px_20px_rgba(46,125,50,0.25)]
              transition duration-300
              group-hover:scale-105
            "
          >
            <span className="relative z-10">
              🌱
            </span>

            <div className="absolute inset-0 bg-white/10 opacity-0 transition group-hover:opacity-100" />

          </div>

          {!collapsed && (
            <div className="min-w-0 text-left">

              <h1 className="text-[18px] font-extrabold tracking-tight text-[#1B5E20] dark:text-[#4ADE80]">
                KrushiMitra
              </h1>

              <p className="text-[9px] font-bold tracking-[0.18em] text-[#6B8A6B] dark:text-[#8FA88E]">
                {t("aiAgriculture")}
              </p>

            </div>
          )}

        </button>

        {/* MOBILE CLOSE DRAWER BUTTON */}
        {setMobileOpen && (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition active:scale-95 lg:hidden cursor-pointer"
            aria-label="Close menu"
          >
            ✕
          </button>
        )}

      </div>


      {/* COLLAPSE BUTTON (Desktop only) */}

      <button
        onClick={() =>
          setCollapsed(!collapsed)
        }
        className="
          absolute -right-3 top-[67px]
          hidden lg:flex
          h-7 w-7 items-center justify-center
          rounded-full
          border border-[#D8E5D5] dark:border-[#24402A]
          bg-white dark:bg-[#1A3322]
          text-[#4B7A50] dark:text-[#4ADE80]
          shadow-md
          transition-all duration-200
          hover:scale-110
          hover:bg-[#F3F8F1]
          cursor-pointer
        "
        aria-label={t("toggleSidebar")}
      >
        {collapsed ? (
          <Menu size={14} />
        ) : (
          <ChevronLeft size={14} />
        )}
      </button>


      {/* MAIN MENU */}

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-6 scrollbar-hide">

        {!collapsed && (
          <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#9DB89A]">
            {t("mainMenu")}
          </p>
        )}

        <nav className="space-y-1.5">

          {items.map((item) => {

            const Icon = item.icon;
            const active = page === item.id;

            return (
              <button
                key={item.id}
                onClick={() =>
                  handleNavigation(item.id)
                }
                title={
                  collapsed
                    ? item.label
                    : ""
                }
                className={`
                  sidebar-item group relative flex w-full
                  items-center rounded-xl cursor-pointer
                  transition-all duration-200 active:scale-95
                  ${
                    collapsed
                      ? "justify-center px-3 py-3.5 hover:scale-105"
                      : "gap-3 px-3.5 py-3 hover:translate-x-1"
                  }
                  ${
                    active
                      ? "bg-gradient-to-r from-[#2E8B38] to-[#359D43] text-white shadow-[0_7px_18px_rgba(46,125,50,0.24)]"
                      : "text-[#55715A] hover:bg-white/75 hover:text-[#2E7D32] hover:shadow-sm"
                  }
                `}
              >

                {active && (
                  <span className="absolute left-0 h-6 w-1 rounded-r-full bg-[#B9E8B8]" />
                )}

                <Icon
                  size={19}
                  strokeWidth={
                    active ? 2.4 : 2
                  }
                  className={`
                    shrink-0 transition-transform duration-200
                    ${
                      !active &&
                      "group-hover:scale-110 group-hover:rotate-3"
                    }
                  `}
                />

                {!collapsed && (
                  <span className="truncate text-[13px] font-semibold">
                    {item.label}
                  </span>
                )}

                {active && !collapsed && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/80 animate-ping" />
                )}

              </button>
            );
          })}

        </nav>


        {/* ACCOUNT */}

        <div className="my-6 h-px bg-[#D7E4D3]" />

        {!collapsed && (
          <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#9DB89A]">
            {t("account")}
          </p>
        )}

        <nav className="space-y-1.5">

          {accountItems.map((item) => {

            const Icon = item.icon;
            const active = page === item.id;

            return (
              <button
                key={item.id}
                onClick={() =>
                  handleNavigation(item.id)
                }
                title={
                  collapsed
                    ? item.label
                    : ""
                }
                className={`
                  group relative flex w-full
                  items-center rounded-xl cursor-pointer
                  transition-all duration-200 active:scale-95
                  ${
                    collapsed
                      ? "justify-center px-3 py-3.5 hover:scale-105"
                      : "gap-3 px-3.5 py-3 hover:translate-x-1"
                  }
                  ${
                    active
                      ? "bg-gradient-to-r from-[#2E8B38] to-[#359D43] text-white shadow-[0_7px_18px_rgba(46,125,50,0.24)]"
                      : "text-[#55715A] hover:bg-white/75 hover:text-[#2E7D32] hover:shadow-sm"
                  }
                `}
              >

                <Icon
                  size={19}
                  strokeWidth={
                    active ? 2.4 : 2
                  }
                  className="shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3"
                />

                {!collapsed && (
                  <span className="text-[13px] font-semibold">
                    {item.label}
                  </span>
                )}

                {item.badge > 0 && !collapsed && (
                  <span className="ml-auto rounded-full bg-[#E11D48] px-2 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
                    {item.badge}
                  </span>
                )}

                {item.badge > 0 && collapsed && (
                  <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-[#E11D48] ring-2 ring-white" />
                )}

              </button>
            );
          })}

        </nav>

      </div>


      {/* INSTALL APP PROMPT BUTTON */}
      <div className="shrink-0 border-t border-[#D7E4D3] p-3 space-y-2">
        <button
          onClick={() => {
            if (setMobileOpen) setMobileOpen(false);
            setShowInstallModal(true);
          }}
          title={language === "mr" ? "मोबाईल अ‍ॅप डाऊनलोड व इन्स्टॉल करा" : language === "hi" ? "मोबाइल ऐप डाउनलोड एवं इंस्टॉल करें" : "Download & Install Mobile App"}
          className={`
            group flex w-full items-center rounded-xl
            border border-emerald-300/80 bg-emerald-100/70 text-[#1B5E20] transition-all duration-200 cursor-pointer
            hover:bg-emerald-200/80 hover:text-[#0F4716] active:scale-95 shadow-2xs
            ${
              collapsed
                ? "justify-center px-3 py-3"
                : "gap-2.5 px-3.5 py-2.5"
            }
          `}
        >
          <Smartphone
            size={17}
            className="shrink-0 text-[#2E7D32] transition-transform duration-200 group-hover:scale-110"
          />
          {!collapsed && (
            <div className="text-left flex-1">
              <p className="text-[12px] font-extrabold leading-tight">
                {language === "mr" ? "मोबाईल अ‍ॅप" : language === "hi" ? "मोबाइल ऐप" : "Mobile App"}
              </p>
              <p className="text-[10px] text-emerald-800/80 font-medium">
                {language === "mr" ? "इन्स्टॉल करा" : language === "hi" ? "इंस्टॉल करें" : "Install Now"}
              </p>
            </div>
          )}
        </button>

        {/* LOGOUT */}
        <button
          onClick={() => {
            if (setMobileOpen) setMobileOpen(false);
            logout();
          }}
          title={
            collapsed
              ? t("logout")
              : ""
          }
          className={`
            group flex w-full items-center rounded-xl
            text-[#B45309] transition-all duration-200 cursor-pointer
            hover:bg-amber-50 hover:text-[#92400E] active:scale-95
            ${
              collapsed
                ? "justify-center px-3 py-3"
                : "gap-3 px-3.5 py-2.5"
            }
          `}
        >
          <LogOut
            size={18}
            className="shrink-0 transition-transform duration-200 group-hover:-translate-x-1"
          />

          {!collapsed && (
            <span className="text-[13px] font-semibold">
              {t("logout")}
            </span>
          )}
        </button>
      </div>

      {/* INSTALL MODAL */}
      <InstallModal isOpen={showInstallModal} onClose={() => setShowInstallModal(false)} />
    </aside>
  );
}