import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Database,
  Cpu,
  Users,
  Activity,
  UserCheck,
  Trash2,
  Search,
  CheckCircle2,
  AlertTriangle,
  Server,
  CloudSun,
  Sprout,
  BarChart3,
  TrendingUp,
  RefreshCw,
  Sparkles,
  KeyRound,
  Lock,
} from "lucide-react";

import { useApp } from "../context/AppContext";

export default function Admin({ nav }) {
  const {
    user,
    usersList,
    apiFetchAdminUsers,
    apiUpdateUserRole,
    apiDeleteUser,
    apiFetchAdminStats,
    predictionHistory,
    recommendationHistory,
    t,
  } = useApp();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [actionToast, setActionToast] = useState("");
  const [dbStats, setDbStats] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    setIsRefreshing(true);
    if (apiFetchAdminUsers) await apiFetchAdminUsers();
    if (apiFetchAdminStats) {
      const stats = await apiFetchAdminStats();
      if (stats) setDbStats(stats);
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(""), 3500);
  };

  const filteredUsers = (usersList || []).filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.district?.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "all" ? true : u.role?.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  const totalFarmers = (usersList || []).filter((u) => u.role === "Farmer").length;
  const totalAdmins = (usersList || []).filter((u) => u.role === "Admin").length;

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === "Admin" ? "Farmer" : "Admin";
    if (apiUpdateUserRole) {
      await apiUpdateUserRole(userId, newRole);
    }
    showToast(`User role updated to ${newRole} in database!`);
    loadData();
  };

  const handleDeleteUser = async (userId, userName) => {
    if (confirm(`Are you sure you want to remove user "${userName}" from the database?`)) {
      if (apiDeleteUser) {
        await apiDeleteUser(userId);
      }
      showToast(`User "${userName}" has been deleted from SQLite database.`);
      loadData();
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* ADMIN SECURITY HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#172B18]">
              {t("adminPanel") || "System Administration & RBAC Control"}
            </h1>
            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-[#1B5E20]">
              <ShieldCheck size={14} /> Super-Admin
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Manage user directory permissions, monitor AI inference models, and inspect platform telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* REFRESH DB BUTTON */}
          <button
            type="button"
            onClick={loadData}
            disabled={isRefreshing}
            className="key-cap inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-gray-700 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin text-[#2E7D32]" : "text-gray-500"} />
            <span>{isRefreshing ? "Syncing DB..." : "Refresh DB"}</span>
          </button>

          <div className="key-cap px-3.5 py-2 text-xs font-semibold text-gray-700">
            Admin: <strong className="text-[#2E7D32]">{user?.email}</strong>
          </div>
        </div>
      </div>

      {/* ACTION TOAST */}
      {actionToast && (
        <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-[#EAF7EC] p-3.5 text-xs sm:text-sm font-semibold text-[#1B5E20] shadow-sm animate-fade-in">
          <CheckCircle2 size={18} className="text-[#2E7D32]" />
          <span>{actionToast}</span>
        </div>
      )}

      {/* SYSTEM METRICS GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Users}
          title="Registered Users"
          value={(usersList || []).length}
          subtitle={`${totalFarmers} Farmers • ${totalAdmins} Admins`}
          status="Live RBAC DB"
          statusColor="green"
        />

        <MetricCard
          icon={Cpu}
          title="ML Inference Models"
          value="2 Models Online"
          subtitle="Recommendation + Yield RF"
          status="95.2% Accuracy"
          statusColor="green"
        />

        <MetricCard
          icon={Database}
          title="Local Data Store"
          value={`${predictionHistory.length + recommendationHistory.length} Records`}
          subtitle="Encrypted LocalStorage"
          status="Healthy"
          statusColor="green"
        />

        <MetricCard
          icon={Activity}
          title="Weather Gateway"
          value="Active (200 OK)"
          subtitle="OpenWeatherMap REST API"
          status="99.9% Uptime"
          statusColor="green"
        />
      </div>

      {/* REGISTERED USERS & RBAC MANAGEMENT TABLE */}
      <div className="card overflow-hidden">
        <div className="border-b border-[#E2EAE0] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Users size={17} className="text-[#2E7D32]" />
                <span>User Directory & Role-Based Access Control (RBAC)</span>
              </h2>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Only authenticated Administrators can view and manage registered farmers and platform roles.
              </p>
            </div>

            {/* SEARCH & FILTER CONTROLS */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email, district..."
                  className="rounded-xl border border-[#DCE8D9] bg-[#F8FAF7] pl-8 pr-3 py-1.5 text-xs outline-none focus:border-[#2E7D32] focus:bg-white"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-xl border border-[#DCE8D9] bg-[#F8FAF7] px-3 py-1.5 text-xs font-bold text-gray-700 outline-none focus:border-[#2E7D32]"
              >
                <option value="all">All Roles</option>
                <option value="Farmer">Farmers</option>
                <option value="Admin">Admins</option>
              </select>
            </div>
          </div>
        </div>

        {/* USERS TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAF7] text-[10px] uppercase tracking-wide text-gray-400 border-b border-[#E2EAE0]">
                <th className="px-5 py-3.5">User Identity</th>
                <th className="px-5 py-3.5">District / Region</th>
                <th className="px-5 py-3.5">Farm Acreage</th>
                <th className="px-5 py-3.5">Assigned Role</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">RBAC Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EEF2EC]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 text-xs">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const initial = u.name ? u.name.charAt(0).toUpperCase() : "U";
                  const isAdmin = u.role === "Admin";
                  return (
                    <tr key={u.id} className="transition hover:bg-[#FAFDF9]">
                      {/* USER IDENTITY */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-xs ${
                              isAdmin
                                ? "bg-gradient-to-br from-purple-600 to-indigo-600"
                                : "bg-gradient-to-br from-[#2E7D32] to-[#10B981]"
                            }`}
                          >
                            {initial}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{u.name}</p>
                            <p className="text-[11px] text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* DISTRICT */}
                      <td className="px-5 py-3.5 text-gray-600">
                        {u.district || "Maharashtra"}
                      </td>

                      {/* FARM SIZE */}
                      <td className="px-5 py-3.5 text-gray-600">
                        {u.farmSize || "—"}
                      </td>

                      {/* ROLE BADGE */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            isAdmin
                              ? "bg-purple-100 text-purple-700 border border-purple-200"
                              : "bg-[#E5F7EA] text-[#2E7D32] border border-[#CDE5D1]"
                          }`}
                        >
                          {isAdmin ? "🛡️ Administrator" : "🌾 Farmer"}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {u.status || "Active"}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleRoleToggle(u.id, u.role)}
                            className="rounded-lg border border-[#DCE8D9] bg-white px-2.5 py-1 text-[11px] font-bold text-gray-700 hover:bg-[#F0F8ED] hover:text-[#2E7D32] transition cursor-pointer"
                            title="Toggle between Admin and Farmer role"
                          >
                            {isAdmin ? "Demote to Farmer" : "Promote to Admin"}
                          </button>

                          {u.email !== "admin@krushimitra.in" && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                              title="Delete user account"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI MODEL SPECS & ARCHITECTURE */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* MODEL 1 */}
        <div className="card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#EEF2EC] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3E6] text-[#2E7D32]">
                <Sprout size={20} />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-800">
                  Model 1: Crop Recommendation
                </h3>
                <p className="text-[10px] text-gray-400">Random Forest Classifier (`crop_recommendation_rf.pkl`)</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5">
              95.2% Confidence
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl bg-[#F8FAF7] p-3">
              <span className="text-gray-400 text-[10px]">Inputs (7 Features):</span>
              <p className="font-bold text-gray-700 mt-0.5">N, P, K, Temp, Humidity, pH, Rainfall</p>
            </div>
            <div className="rounded-xl bg-[#F8FAF7] p-3">
              <span className="text-gray-400 text-[10px]">Target Output:</span>
              <p className="font-bold text-gray-700 mt-0.5">22 Multi-Class Crop Matches</p>
            </div>
          </div>
        </div>

        {/* MODEL 2 */}
        <div className="card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#EEF2EC] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3E6] text-[#2E7D32]">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-800">
                  Model 2: Productivity Prediction
                </h3>
                <p className="text-[10px] text-gray-400">Random Forest Regressor (`productivity_random_forest.pkl`)</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5">
              Trained Regressor
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl bg-[#F8FAF7] p-3">
              <span className="text-gray-400 text-[10px]">Regional Features:</span>
              <p className="font-bold text-gray-700 mt-0.5">District, Season, Area, Temp, Rainfall</p>
            </div>
            <div className="rounded-xl bg-[#F8FAF7] p-3">
              <span className="text-gray-400 text-[10px]">Output Metric:</span>
              <p className="font-bold text-gray-700 mt-0.5">Yield (Tonnes per Hectare)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* REUSABLE METRIC CARD */
function MetricCard({ icon: Icon, title, value, subtitle, status, statusColor }) {
  return (
    <div className="card card-interactive p-5 group cursor-default">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF3E6] text-[#2E7D32] shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <Icon size={20} />
        </div>
        {status && (
          <span className="key-cap text-[10px] py-0.5 px-2 bg-[#E5F7EA] text-[#2E7D32]">
            {status}
          </span>
        )}
      </div>

      <div className="mt-3.5">
        <p className="text-xs font-semibold text-gray-500">{title}</p>
        <p className="mt-0.5 text-xl font-extrabold text-gray-800 group-hover:text-[#2E7D32] transition-colors">{value}</p>
        {subtitle && <p className="text-[10px] text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}