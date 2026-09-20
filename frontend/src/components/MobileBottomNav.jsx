import {
  LayoutDashboard,
  ChartNoAxesCombined,
  Sprout,
  CloudSun,
  User,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function MobileBottomNav({ page, setPage }) {
  const { t, language } = useApp();

  const navItems = [
    {
      id: "dashboard",
      icon: LayoutDashboard,
      label: language === "mr" ? "डॅशबोर्ड" : language === "hi" ? "डैशबोर्ड" : "Dashboard",
    },
    {
      id: "prediction",
      icon: ChartNoAxesCombined,
      label: language === "mr" ? "अंदाज" : language === "hi" ? "पूर्वानुमान" : "Predict",
    },
    {
      id: "recommendation",
      icon: Sprout,
      label: language === "mr" ? "शिफारस" : language === "hi" ? "सलाह" : "Recommend",
    },
    {
      id: "weather",
      icon: CloudSun,
      label: language === "mr" ? "हवामान" : language === "hi" ? "मौसम" : "Weather",
    },
    {
      id: "profile",
      icon: User,
      label: language === "mr" ? "प्रोफाइल" : language === "hi" ? "प्रोफाइल" : "Profile",
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="no-print fixed bottom-0 left-0 right-0 z-40 lg:hidden flex h-[calc(60px+env(safe-area-inset-bottom,0px))] items-center justify-around border-t border-[#DCE8D9] dark:border-[#24402A] bg-white/95 dark:bg-[#132318]/95 backdrop-blur-xl px-1 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = page === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setPage && setPage(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-90 cursor-pointer ${
              active
                ? "text-[#1B5E20] dark:text-[#4ADE80] font-black"
                : "text-gray-500 dark:text-gray-400 font-semibold hover:text-[#2E7D32]"
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                active
                  ? "bg-emerald-100 dark:bg-[#20442c] text-[#1B5E20] dark:text-[#4ADE80] shadow-xs scale-105"
                  : ""
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 2} />
            </div>
            <span className="text-[10px] tracking-tight leading-tight mt-0.5">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
