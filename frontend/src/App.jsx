import { useEffect, useState } from "react";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";
import Weather from "./pages/Weather";
import Recommendation from "./pages/Recommendation";
import Prediction from "./pages/Prediction";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Admin from "./pages/Admin";

import Layout from "./components/Layout";
import OfflineBanner from "./components/OfflineBanner";
import UpdateNotification from "./components/UpdateNotification";

import { useApp } from "./context/AppContext";

export default function App() {
  const { user } = useApp();

  const [pageParams, setPageParams] = useState({});

  // Check URL query parameters for reset token on initial load
  const [page, setPage] = useState(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("reset_token") || urlParams.get("token");
      if (token) {
        return "reset-password";
      }
    }
    return user ? "dashboard" : "landing";
  });

  useEffect(() => {
    if (user && (page === "login" || page === "register" || page === "forgot" || page === "reset-password")) {
      setPage("dashboard");
    }

    if (!user && !["landing", "login", "register", "forgot", "reset-password"].includes(page)) {
      setPage("landing");
    }
  }, [user, page]);

  const navigate = (newPage, params = {}) => {
    setPageParams(params || {});
    setPage(newPage);
  };

  const renderContent = () => {
    /* ================= LANDING FOR LOGGED IN USERS ================= */
    if (page === "landing") {
      return <Landing nav={navigate} />;
    }

    /* ================= AUTH PAGES (UNAUTHENTICATED) ================= */
    if (!user) {
      if (page === "register") {
        return <Register nav={navigate} />;
      }

      if (page === "forgot") {
        return <ForgotPassword nav={navigate} />;
      }

      if (page === "reset-password") {
        return <ResetPassword nav={navigate} token={pageParams.token} />;
      }

      if (page === "login") {
        return <Login nav={navigate} />;
      }

      return <Landing nav={navigate} />;
    }

    /* ================= ACCOUNT & SYSTEM PAGES ================= */
    if (page === "profile") {
      return (
        <Layout page={page} nav={navigate}>
          <Profile />
        </Layout>
      );
    }

    if (page === "settings") {
      return (
        <Layout page={page} nav={navigate}>
          <Settings />
        </Layout>
      );
    }

    if (page === "notifications") {
      return (
        <Layout page={page} nav={navigate}>
          <Notifications nav={navigate} />
        </Layout>
      );
    }

    if (page === "admin") {
      if (user?.role !== "Admin") {
        return (
          <Layout page="dashboard" nav={navigate}>
            <div className="mx-auto my-12 max-w-lg rounded-3xl border border-red-200 bg-red-50/90 p-8 text-center shadow-lg animate-page-enter">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 shadow-sm">
                <span className="text-3xl">🔒</span>
              </div>

              <h2 className="mt-4 text-xl font-extrabold text-gray-900">
                Access Restricted (403 Forbidden)
              </h2>

              <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                You are currently logged in as a <strong>Farmer ({user?.name})</strong>. You do not have Administrator privileges to view system users, registered farmer directories, or database management tools.
              </p>

              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("dashboard")}
                  className="rounded-xl bg-[#2E7D32] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#1B5E20] transition cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </Layout>
        );
      }

      return (
        <Layout page={page} nav={navigate}>
          <Admin nav={navigate} />
        </Layout>
      );
    }

    /* ================= MAIN APPLICATION ================= */
    return (
      <Layout page={page} nav={navigate}>
        {page === "dashboard" && <Dashboard nav={navigate} />}
        {page === "weather" && <Weather nav={navigate} />}
        {page === "recommendation" && <Recommendation nav={navigate} />}
        {page === "prediction" && <Prediction nav={navigate} />}
        {page === "reports" && <Reports nav={navigate} />}
        {page === "analytics" && <Analytics nav={navigate} />}
        {page === "history" && <History nav={navigate} />}

        {![
          "dashboard",
          "weather",
          "recommendation",
          "prediction",
          "reports",
          "analytics",
          "history",
          "profile",
          "settings",
          "notifications",
          "admin",
        ].includes(page) && <Dashboard nav={navigate} />}
      </Layout>
    );
  };

  return (
    <>
      {(!user || page === "landing") && <OfflineBanner />}
      {renderContent()}
      <UpdateNotification />
    </>
  );
}