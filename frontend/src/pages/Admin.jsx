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
  Download,
  Plus,
  X,
  Eye,
  MessageSquare,
  Check,
  Clock,
  HardDrive,
  FileSpreadsheet,
  Layers,
  Edit3,
  Star,
  Send,
  Filter,
  Phone,
  MapPin,
  Calendar,
  Wheat,
  Droplets,
  Megaphone,
  Radio,
  BellRing,
  ShieldAlert,
  AlertOctagon,
} from "lucide-react";

import { useApp } from "../context/AppContext";
import { getAdminText } from "../utils/adminTranslations";

export default function Admin({ nav }) {
  const {
    language,
    user,
    usersList,
    apiFetchAdminUsers,
    apiUpdateUserRole,
    apiAdminUpdateUser,
    apiDeleteUser,
    apiFetchAdminStats,
    apiCreateAdminUser,
    apiFetchAdminTickets,
    apiUpdateTicketStatus,
    apiAdminReplyTicket,
    apiAdminDeleteTicket,
    apiExportDatabase,
    apiOptimizeDatabase,
    adminBroadcastsList,
    apiFetchAdminBroadcasts,
    apiCreateBroadcast,
    apiDeleteBroadcast,
    predictionHistory,
    recommendationHistory,
    t,
    tDistrict,
    tCrop,
  } = useApp();

  const at = (key, params = {}) => getAdminText(key, language, params);

  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'broadcasts', 'users', 'tickets', 'database'
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [ticketStatusFilter, setTicketStatusFilter] = useState("all");
  const [ticketCategoryFilter, setTicketCategoryFilter] = useState("all");
  const [ticketTypeTab, setTicketTypeTab] = useState("all"); // 'all', 'feedback', 'query'
  const [ticketSearch, setTicketSearch] = useState("");
  const [actionToast, setActionToast] = useState("");
  const [dbStats, setDbStats] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Broadcast Advisory State
  const [broadcastsList, setBroadcastsList] = useState([]);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSearch, setBroadcastSearch] = useState("");
  const [broadcastSeverityFilter, setBroadcastSeverityFilter] = useState("all");
  const [broadcastDistrictFilter, setBroadcastDistrictFilter] = useState("all");
  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    message: "",
    severity: "Critical",
    category: "Weather Alert",
    district: "All",
    crop: "All",
    action_recommendation: "",
    created_by: "District Agriculture Emergency Cell",
  });

  // Modals & State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [viewUserDetail, setViewUserDetail] = useState(null);
  const [editUserDetail, setEditUserDetail] = useState(null);
  const [replyTicketModal, setReplyTicketModal] = useState(null);
  const [adminReplyText, setAdminReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState("Resolved");
  const [ticketsList, setTicketsList] = useState([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // New User Form State
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Farmer",
    district: "Pune",
    phone: "",
    farm_size: "",
    farm_unit: "Acres",
    soil_type: "",
    irrigation_type: "",
    primary_crops: "",
  });
  const [newUserError, setNewUserError] = useState("");

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      if (apiFetchAdminUsers) await apiFetchAdminUsers();
      if (apiFetchAdminStats) {
        const stats = await apiFetchAdminStats();
        if (stats) setDbStats(stats);
      }
      if (apiFetchAdminTickets) {
        const tickets = await apiFetchAdminTickets();
        if (tickets && Array.isArray(tickets)) setTicketsList(tickets);
      }
      if (apiFetchAdminBroadcasts) {
        const b = await apiFetchAdminBroadcasts();
        if (b && Array.isArray(b)) setBroadcastsList(b);
      }
    } catch (e) {
      console.warn("Load data error:", e);
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();

    // Auto-poll live database every 3 seconds for new farmer tickets, broadcasts, and stats
    const interval = setInterval(() => {
      if (apiFetchAdminTickets) {
        apiFetchAdminTickets().then((tickets) => {
          if (tickets && Array.isArray(tickets)) {
            setTicketsList(tickets);
          }
        }).catch(() => {});
      }
      if (apiFetchAdminBroadcasts) {
        apiFetchAdminBroadcasts().then((b) => {
          if (b && Array.isArray(b)) {
            setBroadcastsList(b);
          }
        }).catch(() => {});
      }
      if (apiFetchAdminStats) {
        apiFetchAdminStats().then((stats) => {
          if (stats) setDbStats(stats);
        }).catch(() => {});
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const showToast = (msg) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(""), 3500);
  };

  const handleCreateBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastForm.title.trim() || !broadcastForm.message.trim()) {
      showToast(at("toastAlertHeadlineRequired"));
      return;
    }

    setIsBroadcasting(true);
    try {
      const res = await apiCreateBroadcast(broadcastForm);
      if (res.success) {
        showToast(at("toastBroadcastDispatched"));
        setBroadcastForm({
          title: "",
          message: "",
          severity: "Critical",
          category: "Weather Alert",
          district: "All",
          crop: "All",
          action_recommendation: "",
          created_by: "District Agriculture Emergency Cell",
        });
        if (apiFetchAdminBroadcasts) {
          const b = await apiFetchAdminBroadcasts();
          if (b) setBroadcastsList(b);
        }
      } else {
        showToast(res.message || at("toastBroadcastFailed"));
      }
    } catch (err) {
      showToast(at("toastBroadcastFailed"));
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleDeleteBroadcast = async (broadcastId, title) => {
    if (confirm(at("confirmDeleteBroadcastMsg"))) {
      const res = await apiDeleteBroadcast(broadcastId);
      if (res.success) {
        showToast(at("toastBroadcastDeleted"));
        if (apiFetchAdminBroadcasts) {
          const b = await apiFetchAdminBroadcasts();
          if (b) setBroadcastsList(b);
        }
      } else {
        showToast(res.message || at("toastBroadcastFailed"));
      }
    }
  };

  // User Filter Logic
  const filteredUsers = (usersList || []).filter((u) => {
    const term = search.toLowerCase();
    const matchesSearch =
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.district?.toLowerCase().includes(term) ||
      u.phone?.toLowerCase().includes(term) ||
      (u.kisan_id || u.kisanId)?.toLowerCase().includes(term);

    const matchesRole =
      roleFilter === "all" ? true : u.role?.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  // Ticket / Feedback Filter Logic
  const filteredTickets = (ticketsList || []).filter((t) => {
    const term = ticketSearch.toLowerCase();
    const matchesSearch =
      (t.subject || "").toLowerCase().includes(term) ||
      (t.message || "").toLowerCase().includes(term) ||
      (t.name || "").toLowerCase().includes(term) ||
      (t.user_email || "").toLowerCase().includes(term) ||
      (t.district || "").toLowerCase().includes(term) ||
      (t.ticket_id || "").toLowerCase().includes(term);

    const matchesStatus =
      ticketStatusFilter === "all"
        ? true
        : (t.status || "Submitted").toLowerCase() === ticketStatusFilter.toLowerCase();

    const isFeedback = (t.category || "").toLowerCase().includes("feedback") || Boolean(t.rating);
    const matchesType =
      ticketTypeTab === "all"
        ? true
        : ticketTypeTab === "feedback"
        ? isFeedback
        : !isFeedback;

    const matchesCategory =
      ticketCategoryFilter === "all"
        ? true
        : (t.category || "").toLowerCase().includes(ticketCategoryFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesType && matchesCategory;
  });

  const totalFarmers = (usersList || []).filter((u) => u.role === "Farmer").length;
  const totalAdmins = (usersList || []).filter((u) => u.role === "Admin").length;
  const resolvedTickets = ticketsList.filter((t) => t.status === "Resolved").length;
  const pendingTickets = ticketsList.filter((t) => t.status !== "Resolved").length;
  const feedbackTickets = ticketsList.filter((t) => (t.category || "").toLowerCase().includes("feedback") || Boolean(t.rating)).length;
  const queryTickets = ticketsList.filter((t) => !((t.category || "").toLowerCase().includes("feedback") || Boolean(t.rating))).length;

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === "Admin" ? "Farmer" : "Admin";
    if (apiUpdateUserRole) {
      await apiUpdateUserRole(userId, newRole);
    }
    showToast(at("toastRoleUpdated", { role: newRole }));
    loadData();
  };

  const handleDeleteUser = async (userId, userName) => {
    if (confirm(at("confirmDeleteUserMsg"))) {
      if (apiDeleteUser) {
        await apiDeleteUser(userId);
      }
      showToast(at("toastUserDeleted", { name: userName }));
      loadData();
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setNewUserError("");

    if (!newUserForm.name || !newUserForm.email) {
      setNewUserError(at("toastAlertHeadlineRequired"));
      return;
    }

    if (apiCreateAdminUser) {
      const res = await apiCreateAdminUser(newUserForm);
      if (res.success) {
        showToast(at("toastUserCreated", { name: newUserForm.name }));
        setShowAddUserModal(false);
        setNewUserForm({
          name: "",
          email: "",
          password: "password123",
          role: "Farmer",
          district: "Pune",
          phone: "",
          farm_size: "5.0",
          farm_unit: "Acres",
          soil_type: "Medium Black Soil (Madhyam Kali)",
          irrigation_type: "Drip & Micro-Irrigation",
          primary_crops: "Soybean, Wheat, Cotton",
        });
        loadData();
      } else {
        setNewUserError(res.message || "Failed to create user.");
      }
    }
  };

  const handleSaveEditUser = async (e) => {
    e.preventDefault();
    if (!editUserDetail) return;

    if (apiAdminUpdateUser) {
      const res = await apiAdminUpdateUser(editUserDetail.id, editUserDetail);
      if (res.success) {
        showToast(at("toastUserUpdated", { name: editUserDetail.name }));
        setEditUserDetail(null);
        loadData();
      } else {
        showToast(res.message || "Failed to update user.");
      }
    }
  };

  const handleTicketStatus = async (ticketId, newStatus) => {
    if (apiUpdateTicketStatus) {
      await apiUpdateTicketStatus(ticketId, newStatus);
      const localizedStatus = newStatus === "Resolved" ? at("statusResolved") : newStatus === "Under Review" ? at("underReview") : at("statusSubmitted");
      showToast(`${at("status")}: ${localizedStatus}`);
      if (apiFetchAdminTickets) {
        const tickets = await apiFetchAdminTickets();
        if (tickets) setTicketsList(tickets);
      }
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyTicketModal) return;

    if (apiAdminReplyTicket) {
      await apiAdminReplyTicket(replyTicketModal.ticket_id, adminReplyText, replyStatus);
      showToast(at("toastReplySent"));
      setReplyTicketModal(null);
      setAdminReplyText("");
      if (apiFetchAdminTickets) {
        const tickets = await apiFetchAdminTickets();
        if (tickets) setTicketsList(tickets);
      }
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (confirm(at("confirmDeleteTicketMsg"))) {
      if (apiAdminDeleteTicket) {
        await apiAdminDeleteTicket(ticketId);
        showToast(at("toastTicketDeleted"));
        if (apiFetchAdminTickets) {
          const tickets = await apiFetchAdminTickets();
          if (tickets) setTicketsList(tickets);
        }
      }
    }
  };

  const handleExportBackup = async () => {
    setIsExporting(true);
    try {
      if (apiExportDatabase) {
        const data = await apiExportDatabase();
        if (data) {
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `KrushiMitra_Master_Backup_${new Date().toISOString().slice(0, 10)}.json`;
          a.click();
          URL.revokeObjectURL(url);
          showToast(at("toastBackupDownloaded"));
        }
      }
    } catch (err) {
      showToast(at("toastBackupFailed"));
    }
    setIsExporting(false);
  };

  const handleExportUsersCSV = () => {
    if (!usersList || usersList.length === 0) return;
    const headers = ["ID", "Name", "Email", "Phone", "Role", "District", "Farm Size", "Soil Type", "Irrigation", "Kisan ID", "Status", "Member Since"];
    const rows = usersList.map((u) => [
      u.id,
      `"${u.name || ""}"`,
      `"${u.email || ""}"`,
      `"${u.phone || ""}"`,
      `"${u.role || ""}"`,
      `"${u.district || ""}"`,
      `"${u.farm_size || u.farmSize || ""} ${u.farm_unit || u.farmUnit || ""}"`,
      `"${u.soil_type || u.soilType || ""}"`,
      `"${u.irrigation_type || u.irrigationType || ""}"`,
      `"${u.kisan_id || u.kisanId || ""}"`,
      `"${u.status || "Active"}"`,
      `"${u.member_since || u.memberSince || ""}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KrushiMitra_Farmers_Directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(at("toastCsvExported"));
  };

  const handleOptimizeDb = async () => {
    setIsOptimizing(true);
    try {
      if (apiOptimizeDatabase) {
        const res = await apiOptimizeDatabase();
        showToast(res.message || at("toastDbOptimized"));
        loadData();
      }
    } catch (err) {
      showToast(at("toastBroadcastFailed"));
    }
    setIsOptimizing(false);
  };

  const districts = [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana",
    "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna",
    "Kolhapur", "Latur", "Mumbai City", "Nagpur", "Nanded", "Nandurbar", "Nashik",
    "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli",
    "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-zoom-fade">
      {/* ADMIN SECURITY HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#172B18]">
              {at("adminTitle")}
            </h1>
            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-[#1B5E20]">
              <ShieldCheck size={14} /> {at("adminBadge")}
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            {at("adminSubtitle")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* REFRESH DB BUTTON */}
          <button
            type="button"
            onClick={loadData}
            disabled={isRefreshing}
            className="key-cap btn-glow inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-gray-700 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin text-[#2E7D32]" : "text-gray-500"} />
            <span>{isRefreshing ? at("syncing") : at("syncDb")}</span>
          </button>

          <button
            type="button"
            onClick={handleExportBackup}
            disabled={isExporting}
            className="btn-shimmer btn-glow inline-flex items-center gap-1.5 rounded-xl bg-[#2E7D32] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1B5E20] cursor-pointer"
          >
            <Download size={14} />
            <span>{isExporting ? at("exporting") : at("exportDbBackup")}</span>
          </button>
        </div>
      </div>

      {/* ACTION TOAST */}
      {actionToast && (
        <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-[#EAF7EC] p-3.5 text-xs sm:text-sm font-semibold text-[#1B5E20] shadow-sm animate-fade-in">
          <CheckCircle2 size={18} className="text-[#2E7D32]" />
          <span>{actionToast}</span>
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-[#DCE8D9] overflow-x-auto gap-2">
        {[
          { id: "overview", label: at("tabOverview"), icon: Activity },
          {
            id: "broadcasts",
            label: `${at("tabBroadcasts")} (${broadcastsList.length})`,
            icon: Megaphone,
            badge: broadcastsList.filter((b) => b.severity === "Critical").length > 0
              ? `${broadcastsList.filter((b) => b.severity === "Critical").length} ${at("criticalBadge")}`
              : null,
          },
          { id: "users", label: `${at("tabUsers")} (${(usersList || []).length})`, icon: Users },
          { id: "tickets", label: `${at("tabTickets")} (${ticketsList.length})`, icon: MessageSquare, badge: pendingTickets > 0 ? `${pendingTickets} ${at("openBadge")}` : null },
          { id: "database", label: at("tabDatabase"), icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold transition border-b-2 cursor-pointer ${
                active
                  ? "border-[#2E7D32] text-[#2E7D32] bg-[#FAFDF9]"
                  : "border-transparent text-gray-500 hover:text-[#2E7D32]"
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OPERATIONS & TELEMETRY */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-zoom-fade">
          {/* TOP METRICS */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              icon={Users}
              title={at("registeredUsers")}
              value={(usersList || []).length}
              subtitle={`${totalFarmers} ${at("farmers")} • ${totalAdmins} ${at("admins")}`}
              status={at("liveDb")}
              statusColor="green"
            />

            <MetricCard
              icon={TrendingUp}
              title={at("yieldPredictionsRun")}
              value={dbStats?.total_predictions ?? predictionHistory.length ?? 0}
              subtitle={at("rfModel")}
              status={at("active")}
              statusColor="green"
            />

            <MetricCard
              icon={Sprout}
              title={at("soilAdvisoriesGenerated")}
              value={dbStats?.total_recommendations ?? recommendationHistory.length ?? 0}
              subtitle={at("cropClassifier")}
              status={at("calibrated")}
              statusColor="green"
            />

            <MetricCard
              icon={MessageSquare}
              title={at("userQueriesFeedback")}
              value={ticketsList.length}
              subtitle={`${resolvedTickets} ${at("resolved")} • ${pendingTickets} ${at("pending")}`}
              status={at("helpdeskActive")}
              statusColor="green"
            />
          </div>

          {/* ADMINISTRATIVE QUICK OPERATIONS */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div
              onClick={() => setActiveTab("users")}
              className="card card-interactive p-5 depth-1 cursor-pointer transition hover:border-[#2E7D32]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#2E7D32]">
                  <Users size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">{at("farmerDirectoryTitle")}</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {at("farmerDirectoryDesc")}
                  </p>
                </div>
              </div>
            </div>

            <div
              onClick={() => setActiveTab("tickets")}
              className="card card-interactive p-5 depth-1 cursor-pointer transition hover:border-[#2E7D32]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <MessageSquare size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">{at("farmerQueriesTitle")}</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {at("farmerQueriesDesc")}
                  </p>
                </div>
              </div>
            </div>

            <div
              onClick={() => setActiveTab("database")}
              className="card card-interactive p-5 depth-1 cursor-pointer transition hover:border-[#2E7D32]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Database size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">{at("databaseLogsTitle")}</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {at("databaseLogsDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ADVISORY & EMERGENCY BROADCAST COMMAND CENTER */}
      {activeTab === "broadcasts" && (
        <div className="space-y-6 animate-zoom-fade">
          {/* BROADCAST TELEMETRY METRICS */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <div className="card depth-1 p-4 flex items-center gap-3.5 bg-gradient-to-br from-emerald-50/60 to-white dark:from-[#183321]/60 dark:to-[#132318]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1B5E20] text-white shadow-md">
                <Megaphone size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {at("totalBulletins")}
                </p>
                <h3 className="text-xl font-extrabold text-[#172B18] dark:text-white">
                  {broadcastsList.length}
                </h3>
              </div>
            </div>

            <div className="card depth-1 p-4 flex items-center gap-3.5 bg-gradient-to-br from-red-50/60 to-white dark:from-red-950/20 dark:to-[#132318]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md">
                <ShieldAlert size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                  {at("criticalEmergencies")}
                </p>
                <h3 className="text-xl font-extrabold text-red-700 dark:text-red-400">
                  {broadcastsList.filter((b) => b.severity === "Critical").length}
                </h3>
              </div>
            </div>

            <div className="card depth-1 p-4 flex items-center gap-3.5 bg-gradient-to-br from-amber-50/60 to-white dark:from-amber-950/20 dark:to-[#132318]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md">
                <AlertOctagon size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  {at("cautionWarnings")}
                </p>
                <h3 className="text-xl font-extrabold text-amber-700 dark:text-amber-400">
                  {broadcastsList.filter((b) => b.severity === "Warning").length}
                </h3>
              </div>
            </div>

            <div className="card depth-1 p-4 flex items-center gap-3.5 bg-gradient-to-br from-blue-50/60 to-white dark:from-blue-950/20 dark:to-[#132318]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
                <Radio size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {at("registeredAudience")}
                </p>
                <h3 className="text-xl font-extrabold text-blue-700 dark:text-blue-400">
                  {(usersList || []).filter((u) => u.role === "Farmer").length} {at("farmers")}
                </h3>
              </div>
            </div>
          </div>

          {/* MAIN GRID: COMPOSER & LIVE BROADCAST LOG */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COMPOSER (lg:col-span-5) */}
            <div className="card depth-2 overflow-hidden border-2 border-emerald-300/80 dark:border-emerald-700/60 lg:col-span-5">
              <div className="bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#16A34A] p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                    <Radio size={18} className="animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black tracking-wide">
                      {at("broadcastConsole")}
                    </h2>
                    <p className="text-[10px] text-emerald-100 font-medium">
                      {at("broadcastSubtitle")}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-white/25 px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-xs">
                  {at("liveDbTag")}
                </span>
              </div>

              {/* QUICK TEMPLATES */}
              <div className="p-4 bg-[#F7FAF6] dark:bg-[#183321]/40 border-b border-gray-100 dark:border-gray-800">
                <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                  <Sparkles size={12} className="text-[#2E7D32]" />
                  <span>{at("quickSimTemplatesTitle")}</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setBroadcastForm({
                        title: language === "mr"
                          ? "नाशिक व अहमदनगर जिल्ह्यांसाठी अवकाळी वादळी पाऊस व गारपीट इशारा"
                          : language === "hi"
                          ? "नासिक और अहमदनगर जिलों के लिए बेमौसम आंधी और ओलावृष्टि चेतावनी"
                          : "Unseasonal Thunderstorm & Hailstorm Warning for Nashik & Ahmednagar",
                        message: language === "mr"
                          ? "उत्तर महाराष्ट्रात पुढील ४८ तासांत वादळी वाऱ्यासह (४०-५० किमी/तास) मुसळधार पाऊस व गारपिटीची शक्यता आहे. शेतकऱ्यांनी काढलेला कांदा झाकून ठेवावा आणि बागांमधील पाण्याचा निचरा करावा."
                          : language === "hi"
                          ? "उत्तर महाराष्ट्र में अगले 48 घंटों में तेज हवाओं (40-50 किमी/घंटा) के साथ भारी बारिश और ओलावृष्टि की संभावना है। किसान निकाले गए प्याज को ढककर रखें और बगीचों में जल निकासी सुनिश्चित करें।"
                          : "Severe unseasonal thunderstorm with gusty winds (40-50 km/h) and scattered hailstorms expected over the next 48 hours across North Maharashtra. Farmers are strongly advised to secure harvested onion stocks, delay grape canopy spraying, and clear drainage lines in orchards.",
                        severity: "Critical",
                        category: "Weather Alert",
                        district: "Nashik",
                        crop: "Onion, Grapes",
                        action_recommendation: language === "mr"
                          ? "काढलेले पीक तात्काळ सुरक्षित गोदामात हलवा; फळबागांमधील पाण्याचा निचरा करा."
                          : language === "hi"
                          ? "कटी हुई फसलों को तुरंत सुरक्षित गोदाम में रखें; बगीचे की जल निकासी साफ करें।"
                          : "Shift harvested crops to covered godowns; inspect orchard drainage.",
                        created_by: language === "mr"
                          ? "जिल्हा कृषी आपत्ती निवारण कक्ष, नाशिक"
                          : language === "hi"
                          ? "जिला कृषि आपातकालीन प्रकोष्ठ, नासिक"
                          : "District Agriculture Emergency Cell, Nashik",
                      });
                    }}
                    className="rounded-lg bg-white dark:bg-[#1E3A28] border border-red-200 dark:border-red-900 px-2.5 py-1 text-[11px] font-semibold text-red-700 dark:text-red-300 hover:bg-red-50 cursor-pointer transition shadow-2xs"
                  >
                    {at("btnTplNashik")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBroadcastForm({
                        title: language === "mr"
                          ? "खरीप मका व उसावरील लष्करी अळी (Fall Armyworm) बाबत सतर्कता सल्ला"
                          : language === "hi"
                          ? "खरीफ मक्का और गन्ने पर फॉल आर्मीवर्म के प्रकोप पर सतर्कता चेतावनी"
                          : "Fall Armyworm Vigilance Advisory for Kharif Maize & Sugarcane",
                        message: language === "mr"
                          ? "पश्चिम महाराष्ट्रात मका व ऊस पिकावर लष्करी अळीचा प्रादुर्भाव दिसून येत आहे. शेतकऱ्यांनी दर ४-५ दिवसांनी शेताची पाहणी करावी."
                          : language === "hi"
                          ? "पश्चिम महाराष्ट्र में मक्का और गन्ने पर फॉल आर्मीवर्म का प्रकोप देखा गया है। किसान हर 4-5 दिनों में खेत का निरीक्षण करें।"
                          : "Incidence of early-stage Fall Armyworm (Spodoptera frugiperda) infestation observed in Western Maharashtra zones. Scouting should be undertaken every 4-5 days.",
                        severity: "Warning",
                        category: "Pest & Disease",
                        district: "Pune",
                        crop: "Sugarcane, Maize",
                        action_recommendation: language === "mr"
                          ? "प्रति एकर ५ कामगंध सापळे लावा आणि अझाडिरॅक्टिन १५०० पीपीएम ५ मिली/लिटर फवारा."
                          : language === "hi"
                          ? "प्रति एकड़ 5 फेरोमोन ट्रैप लगाएं और एज़ाडिराक्टिन 1500 पीपीएम 5 मिली/लीटर का छिड़काव करें।"
                          : "Install pheromone traps @ 5 per acre & apply Azadirachtin 1500 ppm @ 5ml/L.",
                        created_by: language === "mr"
                          ? "कृषी विज्ञान केंद्र (KVK), पुणे"
                          : language === "hi"
                          ? "कृषि विज्ञान केंद्र (KVK), पुणे"
                          : "Krushi Vigyan Kendra (KVK) Pune",
                      });
                    }}
                    className="rounded-lg bg-white dark:bg-[#1E3A28] border border-amber-200 dark:border-amber-900 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-50 cursor-pointer transition shadow-2xs"
                  >
                    {at("btnTplPune")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBroadcastForm({
                        title: language === "mr"
                          ? "रब्बी पेरणी व सूक्ष्म सिंचनासाठी ८०% शासकीय अनुदान योजना सुरू"
                          : language === "hi"
                          ? "रबी बुवाई और सूक्ष्म सिंचाई के लिए 80% सरकारी सब्सिडी योजना खुली"
                          : "Statewide Rabi Sowing & Micro-Irrigation 80% Subsidy Open",
                        message: language === "mr"
                          ? "महाराष्ट्र कृषी विभागामार्फत महाडीबीटी (MahaDBT) पोर्टलवर ८०% ठिबक व तुषार सिंचन अनुदानासाठी अर्ज सुरू झाले आहेत."
                          : language === "hi"
                          ? "महाराष्ट्र कृषि विभाग द्वारा महाडीबीटी (MahaDBT) पोर्टल पर 80% ड्रिप और स्प्रिंकलर सिंचाई सब्सिडी के लिए ऑनलाइन आवेदन खुले हैं।"
                          : "Maharashtra Agriculture Department announces open portal registration for 80% Drip & Sprinkler Irrigation Subsidies under the PMKSY / MahaDBT framework for all registered farmers.",
                        severity: "Advisory",
                        category: "Government Scheme",
                        district: "All",
                        crop: "All",
                        action_recommendation: language === "mr"
                          ? "अद्ययावत ७/१२ उताऱ्यासह महाडीबीटी पोर्टलवर ऑनलाइन अर्ज करा."
                          : language === "hi"
                          ? "अद्यतन 7/12 खतौनी के साथ महाडीबीटी पोर्टल पर ऑनलाइन आवेदन करें।"
                          : "Apply online on MahaDBT portal with updated 7/12 land extract.",
                        created_by: language === "mr"
                          ? "महाराष्ट्र राज्य कृषी विभाग"
                          : language === "hi"
                          ? "महाराष्ट्र राज्य कृषि विभाग"
                          : "Maharashtra State Agricultural Department",
                      });
                    }}
                    className="rounded-lg bg-white dark:bg-[#1E3A28] border border-emerald-200 dark:border-emerald-900 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 cursor-pointer transition shadow-2xs"
                  >
                    {at("btnTplSubsidy")}
                  </button>
                </div>
              </div>

              {/* FORM */}
              <form onSubmit={handleCreateBroadcast} className="p-5 space-y-4">
                {/* SEVERITY SELECTOR */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    {at("severity")}:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "Critical", label: at("severityCritical"), desc: language === "mr" ? "आणीबाणी इशारा" : language === "hi" ? "आपातकालीन" : "Emergency Alert", color: "border-red-400 bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300" },
                      { id: "Warning", label: at("severityWarning"), desc: language === "mr" ? "सावधगिरी सूचना" : language === "hi" ? "सावधानी सूचना" : "High Caution", color: "border-amber-400 bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300" },
                      { id: "Advisory", label: at("severityAdvisory"), desc: language === "mr" ? "सामान्य सल्ला" : language === "hi" ? "सामान्य सलाह" : "General Notice", color: "border-emerald-400 bg-emerald-50 text-[#1B5E20] dark:bg-emerald-950/50 dark:text-emerald-300" },
                    ].map((sev) => {
                      const selected = broadcastForm.severity === sev.id;
                      return (
                        <button
                          key={sev.id}
                          type="button"
                          onClick={() => setBroadcastForm({ ...broadcastForm, severity: sev.id })}
                          className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition cursor-pointer ${
                            selected
                              ? `${sev.color} ring-2 ring-offset-1 font-black shadow-xs`
                              : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1B3523]"
                          }`}
                        >
                          <span className="text-xs">{sev.label}</span>
                          <span className="text-[9px] opacity-75">{sev.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* TITLE */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {at("alertHeadlineLabel")} <span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    value={broadcastForm.title}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                    placeholder={at("enterTitlePlaceholder")}
                    className="w-full rounded-xl border border-[#DCE7DA] bg-white dark:bg-[#183321] px-3.5 py-2 text-xs font-semibold text-gray-800 dark:text-white outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-emerald-400/20"
                  />
                </div>

                {/* TARGET DISTRICT & CATEGORY */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      {at("targetDistrictLabel")} <span className="text-red-500">*</span>:
                    </label>
                    <select
                      value={broadcastForm.district}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, district: e.target.value })}
                      className="w-full rounded-xl border border-[#DCE7DA] bg-white dark:bg-[#183321] px-3 py-2 text-xs font-semibold text-gray-800 dark:text-white outline-none focus:border-[#2E7D32]"
                    >
                      <option value="All">{at("statewideAll36")}</option>
                      {districts.map((d) => (
                        <option key={d} value={d}>
                          📍 {tDistrict ? tDistrict(d) : d} {at("district")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      {at("advisoryCategoryLabel")}
                    </label>
                    <select
                      value={broadcastForm.category}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, category: e.target.value })}
                      className="w-full rounded-xl border border-[#DCE7DA] bg-white dark:bg-[#183321] px-3 py-2 text-xs font-semibold text-gray-800 dark:text-white outline-none focus:border-[#2E7D32]"
                    >
                      <option value="Weather Alert">🌧️ {at("catWeather")}</option>
                      <option value="Pest & Disease">🐛 {at("catPest")}</option>
                      <option value="Government Scheme">🏛️ {at("catScheme")}</option>
                      <option value="Market & MSP">📈 {at("catMarket")}</option>
                      <option value="Fertilizer & Sowing">🌱 {at("catFertilizer")}</option>
                    </select>
                  </div>
                </div>

                {/* TARGET CROP & AUTHOR */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      {at("targetCropsLabel")}
                    </label>
                    <input
                      type="text"
                      value={broadcastForm.crop}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, crop: e.target.value })}
                      placeholder={language === "mr" ? "उदा. सर्व पिके, सोयाबीन, द्राक्षे, कापूस" : language === "hi" ? "उदा. सभी, सोयाबीन, अंगूर, कपास" : "e.g. All, Soybean, Grapes, Cotton"}
                      className="w-full rounded-xl border border-[#DCE7DA] bg-white dark:bg-[#183321] px-3.5 py-2 text-xs font-semibold text-gray-800 dark:text-white outline-none focus:border-[#2E7D32]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      {at("issuedByLabel")}
                    </label>
                    <input
                      type="text"
                      value={broadcastForm.created_by}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, created_by: e.target.value })}
                      placeholder={language === "mr" ? "उदा. जिल्हा कृषी आपत्ती निवारण कक्ष" : language === "hi" ? "उदा. जिला कृषि आपातकालीन प्रकोष्ठ" : "e.g. District Agriculture Emergency Cell"}
                      className="w-full rounded-xl border border-[#DCE7DA] bg-white dark:bg-[#183321] px-3.5 py-2 text-xs font-semibold text-gray-800 dark:text-white outline-none focus:border-[#2E7D32]"
                    />
                  </div>
                </div>

                {/* ADVISORY MESSAGE */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {at("detailedInstructionsLabel")} <span className="text-red-500">*</span>:
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={broadcastForm.message}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                    placeholder={at("enterMessagePlaceholder")}
                    className="w-full rounded-xl border border-[#DCE7DA] bg-white dark:bg-[#183321] p-3 text-xs text-gray-800 dark:text-white outline-none focus:border-[#2E7D32]"
                  />
                </div>

                {/* ACTIONABLE RECOMMENDATION */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {at("directActionRemedyLabel")}
                  </label>
                  <input
                    type="text"
                    value={broadcastForm.action_recommendation}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, action_recommendation: e.target.value })}
                    placeholder={at("enterRemedyPlaceholder")}
                    className="w-full rounded-xl border border-[#DCE7DA] bg-white dark:bg-[#183321] px-3.5 py-2 text-xs font-semibold text-gray-800 dark:text-white outline-none focus:border-[#2E7D32]"
                  />
                </div>

                {/* AUDIENCE REACH BANNER */}
                <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-950/40 dark:border-blue-900/60 p-3 text-xs text-blue-800 dark:text-blue-200">
                  <Radio size={16} className="shrink-0 text-blue-600 animate-pulse" />
                  <span>
                    {at("audienceTargetBanner")}{" "}
                    <strong>
                      {broadcastForm.district === "All"
                        ? `${at("statewideAll36")} (~${(usersList || []).filter((u) => u.role === "Farmer").length} ${at("farmers")})`
                        : `${tDistrict ? tDistrict(broadcastForm.district) : broadcastForm.district} ${at("district")} (~${(usersList || []).filter((u) => u.role === "Farmer" && (u.district || "").toLowerCase() === broadcastForm.district.toLowerCase()).length} ${at("farmers")})`}
                    </strong>
                  </span>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={isBroadcasting}
                  className="btn-shimmer btn-glow flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] py-3 text-xs font-black text-white shadow-md transition hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Send size={15} />
                  <span>{isBroadcasting ? at("transmittingBtn") : at("broadcastNowBtn")}</span>
                </button>
              </form>
            </div>

            {/* RIGHT: ACTIVE BROADCASTS & TRANSMISSION LOG TABLE (lg:col-span-7) */}
            <div className="card depth-2 overflow-hidden lg:col-span-7 space-y-4">
              <div className="border-b border-[#E2EAE0] dark:border-[#24402A] p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-sm font-black text-gray-800 dark:text-white flex items-center gap-2">
                      <Megaphone size={17} className="text-[#2E7D32]" />
                      <span>{at("activeBroadcasts")} ({broadcastsList.length})</span>
                    </h2>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {at("broadcastSubtitle")}
                    </p>
                  </div>
                </div>

                {/* FILTERS & SEARCH */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={broadcastSearch}
                      onChange={(e) => setBroadcastSearch(e.target.value)}
                      placeholder={at("searchAlerts")}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#183321] pl-8 pr-3 py-1.5 text-xs text-gray-800 dark:text-white outline-none focus:border-[#2E7D32]"
                    />
                  </div>

                  <select
                    value={broadcastSeverityFilter}
                    onChange={(e) => setBroadcastSeverityFilter(e.target.value)}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#183321] px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 font-semibold outline-none"
                  >
                    <option value="all">{at("allSeverities")}</option>
                    <option value="critical">{at("critOnly")}</option>
                    <option value="warning">{at("warnOnly")}</option>
                    <option value="advisory">{at("advOnly")}</option>
                  </select>

                  <select
                    value={broadcastDistrictFilter}
                    onChange={(e) => setBroadcastDistrictFilter(e.target.value)}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#183321] px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 font-semibold outline-none"
                  >
                    <option value="all">{at("allDistricts")}</option>
                    <option value="all">{at("statewideAll36")}</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        📍 {tDistrict ? tDistrict(d) : d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* LIST / TABLE */}
              <div className="p-4 space-y-3 max-h-[700px] overflow-y-auto">
                {broadcastsList.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Megaphone size={36} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-xs font-bold">{at("noBroadcastsFound")}</p>
                    <p className="text-[11px]">{at("noBroadcastsSub")}</p>
                  </div>
                ) : (
                  broadcastsList
                    .filter((b) => {
                      const term = broadcastSearch.toLowerCase();
                      const matchesSearch =
                        (b.title || "").toLowerCase().includes(term) ||
                        (b.message || "").toLowerCase().includes(term) ||
                        (b.district || "").toLowerCase().includes(term) ||
                        (b.crop || "").toLowerCase().includes(term) ||
                        (b.broadcast_id || "").toLowerCase().includes(term);

                      const matchesSeverity =
                        broadcastSeverityFilter === "all"
                          ? true
                          : (b.severity || "").toLowerCase() === broadcastSeverityFilter.toLowerCase();

                      const matchesDistrict =
                        broadcastDistrictFilter === "all"
                          ? true
                          : (b.district || "").toLowerCase() === broadcastDistrictFilter.toLowerCase();

                      return matchesSearch && matchesSeverity && matchesDistrict;
                    })
                    .map((item) => {
                      const isCritical = item.severity === "Critical";
                      const isWarning = item.severity === "Warning";
                      return (
                        <div
                          key={item.broadcast_id || item.id}
                          className={`rounded-2xl p-4 border transition-all hover:shadow-md ${
                            isCritical
                              ? "border-red-200 bg-red-50/40 dark:bg-red-950/20 dark:border-red-900/40"
                              : isWarning
                              ? "border-amber-200 bg-amber-50/40 dark:bg-amber-950/20 dark:border-amber-900/40"
                              : "border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-900/40"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="space-y-1.5 flex-1">
                              {/* BADGES ROW */}
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span
                                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                                    isCritical
                                      ? "bg-red-600 text-white"
                                      : isWarning
                                      ? "bg-amber-500 text-white"
                                      : "bg-[#1B5E20] text-white"
                                  }`}
                                >
                                  {isCritical
                                    ? (language === "mr" ? "🔴 Critical आणीबाणी" : language === "hi" ? "🔴 Critical आपातकाल" : "Critical")
                                    : isWarning
                                    ? (language === "mr" ? "🟡 Warning सतर्कता" : language === "hi" ? "🟡 Warning चेतावनी" : "Warning")
                                    : (language === "mr" ? "🟢 Advisory सल्ला" : language === "hi" ? "🟢 Advisory सलाह" : "Advisory")}
                                </span>

                                <span className="rounded-full bg-gray-200 dark:bg-gray-700 px-2 py-0.5 text-[10px] font-bold text-gray-700 dark:text-gray-300">
                                  {item.category || "Weather"}
                                </span>

                                <span className="rounded-full bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:text-blue-200 flex items-center gap-1">
                                  <MapPin size={10} />
                                  <span>{item.district === "All" ? at("allMaharashtra") : `${tDistrict ? tDistrict(item.district) : item.district} ${at("district")}`}</span>
                                </span>

                                {item.crop && item.crop !== "All" && (
                                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-1">
                                    <Wheat size={10} />
                                    <span>{tCrop ? tCrop(item.crop) : item.crop}</span>
                                  </span>
                                )}

                                <span className="text-[10px] text-gray-400 font-mono ml-auto">
                                  {item.broadcast_id}
                                </span>
                              </div>

                              {/* HEADLINE */}
                              <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white">
                                {item.title}
                              </h3>

                              {/* MESSAGE */}
                              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                                {item.message}
                              </p>

                              {/* ACTION REMEDY BOX */}
                              {item.action_recommendation && (
                                <div className="rounded-xl bg-white dark:bg-[#132318] p-2.5 border border-gray-100 dark:border-gray-800 text-[11px] font-semibold text-gray-700 dark:text-emerald-200 flex items-start gap-1.5 shadow-2xs">
                                  <CheckCircle2 size={13} className="shrink-0 text-[#2E7D32] mt-0.5" />
                                  <span>
                                    <strong>{at("actionableHeader")}</strong> {item.action_recommendation}
                                  </span>
                                </div>
                              )}

                              {/* METADATA */}
                              <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-400 pt-1">
                                <span className="flex items-center gap-1">
                                  <Clock size={11} />
                                  <span>{item.created_at || "Recent"}</span>
                                </span>
                                <span>•</span>
                                <span>{at("issuedBy")} {item.created_by}</span>
                                <span>•</span>
                                <span className="text-[#2E7D32] font-bold flex items-center gap-1">
                                  <Radio size={10} />
                                  <span>{at("reachesFarmers", { count: item.estimated_reach || 13 })}</span>
                                </span>
                              </div>
                            </div>

                            {/* ACTIONS */}
                            <div className="flex sm:flex-col items-center gap-1.5 shrink-0 pt-1">
                              <button
                                type="button"
                                onClick={() => handleDeleteBroadcast(item.broadcast_id || item.id, item.title)}
                                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white dark:bg-[#1E3A28] border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition shadow-2xs cursor-pointer"
                                title={at("deleteBroadcast")}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REGISTERED USERS & FARMER DIRECTORY */}
      {activeTab === "users" && (
        <div className="space-y-4 animate-zoom-fade">
          <div className="card overflow-hidden depth-1">
            <div className="border-b border-[#E2EAE0] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <Users size={17} className="text-[#2E7D32]" />
                    <span>{at("userDirectory")}</span>
                  </h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {at("userDirectoryDesc")}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={at("searchUsersPlaceholder")}
                      className="rounded-xl border border-[#DCE8D9] bg-[#F8FAF7] pl-8 pr-3 py-1.5 text-xs outline-none focus:border-[#2E7D32] focus:bg-white"
                    />
                  </div>

                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="rounded-xl border border-[#DCE8D9] bg-[#F8FAF7] px-3 py-1.5 text-xs font-bold text-gray-700 outline-none focus:border-[#2E7D32]"
                  >
                    <option value="all">{at("allRoles")}</option>
                    <option value="Farmer">{at("farmersOnly")}</option>
                    <option value="Admin">{at("adminsOnly")}</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleExportUsersCSV}
                    className="key-cap btn-glow flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 cursor-pointer"
                    title={at("exportCsv")}
                  >
                    <FileSpreadsheet size={14} className="text-[#2E7D32]" />
                    <span>{at("exportCsv")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(true)}
                    className="btn-shimmer btn-glow flex items-center gap-1.5 rounded-xl bg-[#2E7D32] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#1B5E20] cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>{at("addNewUser")}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* USERS TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F8FAF7] text-[10px] uppercase tracking-wide text-gray-400 border-b border-[#E2EAE0]">
                    <th className="px-4 py-3.5">{at("thKisanId")}</th>
                    <th className="px-4 py-3.5">{at("thFarmerContact")}</th>
                    <th className="px-4 py-3.5">{at("thCityDistrict")}</th>
                    <th className="px-4 py-3.5">{at("thFarmAcreage")}</th>
                    <th className="px-4 py-3.5">{at("thPrimaryCrops")}</th>
                    <th className="px-4 py-3.5">{at("thRole")}</th>
                    <th className="px-4 py-3.5">{at("thStatus")}</th>
                    <th className="px-4 py-3.5 text-right">{at("thActions")}</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EEF2EC]">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-400 text-xs">
                        {at("noUsersFound")}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const initial = u.name ? u.name.charAt(0).toUpperCase() : "U";
                      const isAdminUser = u.role === "Admin";
                      return (
                        <tr key={u.id || u.email} className="transition hover:bg-[#FAFDF9]">
                          {/* USER ID / KISAN ID */}
                          <td className="px-4 py-3.5">
                            <div className="space-y-0.5">
                              <span className="font-extrabold text-gray-700 bg-gray-100 rounded-md px-1.5 py-0.5 text-[10px]">
                                #{u.id}
                              </span>
                              {(u.kisan_id || u.kisanId) ? (
                                <p className="text-[10px] font-bold text-[#2E7D32]">
                                  {u.kisan_id || u.kisanId}
                                </p>
                              ) : null}
                            </div>
                          </td>

                          {/* USER IDENTITY */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-xs ${
                                  isAdminUser
                                    ? "bg-gradient-to-br from-purple-600 to-indigo-600"
                                    : "bg-gradient-to-br from-[#2E7D32] to-[#10B981]"
                                }`}
                              >
                                {initial}
                              </div>
                              <div>
                                <p className="font-bold text-gray-800">{u.name}</p>
                                <p className="text-[11px] text-gray-400">{u.email}</p>
                                {u.phone && (
                                  <p className="text-[10px] text-[#2E7D32] font-semibold flex items-center gap-1">
                                    <Phone size={10} /> {u.phone}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* CITY / DISTRICT */}
                          <td className="px-4 py-3.5 text-gray-700 font-semibold">
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={12} className="text-gray-400" />
                              {u.district && u.district.trim() ? (tDistrict ? tDistrict(u.district) : u.district) : "—"}
                            </span>
                          </td>

                          {/* FARM SIZE & SOIL */}
                          <td className="px-4 py-3.5 text-gray-600">
                            {isAdminUser ? (
                              <span className="text-[11px] text-gray-400 italic">
                                {language === "mr" ? "मध्यवर्ती संचालन केंद्र" : language === "hi" ? "केंद्रीय संचालन डेस्क" : "Central Operations Desk"}
                              </span>
                            ) : (
                              <div>
                                <p className="font-bold text-gray-800">
                                  {u.farm_size || u.farmSize ? `${u.farm_size || u.farmSize} ${at("acres")}` : "—"}
                                </p>
                                <p className="text-[10px] text-gray-400 truncate max-w-[150px]">
                                  {u.soil_type || u.soilType || "—"}
                                </p>
                              </div>
                            )}
                          </td>

                          {/* PRIMARY CROPS */}
                          <td className="px-4 py-3.5 text-gray-600 text-[11px]">
                            {isAdminUser ? (
                              "—"
                            ) : (
                              <span className="font-medium text-gray-700 truncate max-w-[140px] block">
                                {u.primary_crops || u.primaryCrops || "—"}
                              </span>
                            )}
                          </td>

                          {/* ROLE BADGE */}
                          <td className="px-4 py-3.5">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                isAdminUser
                                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                                  : "bg-[#E5F7EA] text-[#2E7D32] border border-[#CDE5D1]"
                              }`}
                            >
                              {isAdminUser ? `🛡️ ${at("admins")}` : `🌾 ${at("farmers")}`}
                            </span>
                          </td>

                          {/* STATUS */}
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              {u.status || at("activeStatus")}
                            </span>
                          </td>

                          {/* ACTIONS */}
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setViewUserDetail(u)}
                                className="key-cap p-1.5 text-gray-600 hover:text-[#2E7D32] transition cursor-pointer"
                                title={at("viewUserDossierTitle")}
                              >
                                <Eye size={14} />
                              </button>

                              <button
                                type="button"
                                onClick={() => setEditUserDetail({ ...u })}
                                className="key-cap p-1.5 text-gray-600 hover:text-blue-600 transition cursor-pointer"
                                title={at("editUser")}
                              >
                                <Edit3 size={14} />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRoleToggle(u.id, u.role)}
                                className="key-cap px-2.5 py-1 text-[11px] font-bold text-gray-700 hover:bg-[#F0F8ED] hover:text-[#2E7D32] transition cursor-pointer"
                                title={isAdminUser ? at("makeFarmer") : at("makeAdmin")}
                              >
                                {isAdminUser ? at("makeFarmer") : at("makeAdmin")}
                              </button>

                              {u.email !== "admin@krushimitra.in" && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(u.id, u.name)}
                                  className="key-cap p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                                  title={at("deleteUser")}
                                >
                                  <Trash2 size={14} />
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
        </div>
      )}

      {/* TAB 4: FARMER QUERIES, SUPPORT & FEEDBACK DESK */}
      {activeTab === "tickets" && (
        <div className="space-y-4 animate-zoom-fade">
          <div className="card overflow-hidden depth-1">
            <div className="border-b border-[#E2EAE0] p-5 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <MessageSquare size={17} className="text-[#2E7D32]" />
                    <span>{at("helpdeskTitle")}</span>
                  </h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {at("helpdeskDesc")}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={loadData}
                    disabled={isRefreshing}
                    className="key-cap flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 hover:text-[#2E7D32] transition cursor-pointer"
                    title={at("syncDb")}
                  >
                    <RefreshCw size={13} className={isRefreshing ? "animate-spin text-[#2E7D32]" : ""} />
                    <span>{isRefreshing ? at("syncing") : (language === "mr" ? "रिफ्रेश करा" : language === "hi" ? "रिफ्रेश करें" : "Refresh")}</span>
                  </button>
                </div>
              </div>

              {/* FILTER PILLS */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#EEF2EC]">
                <button
                  type="button"
                  onClick={() => { setTicketTypeTab("all"); setTicketStatusFilter("all"); }}
                  className={`rounded-xl px-3 py-1 text-xs font-bold transition cursor-pointer ${
                    ticketTypeTab === "all" && ticketStatusFilter === "all"
                      ? "bg-[#2E7D32] text-white shadow-xs"
                      : "bg-[#F4F7F2] text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {at("allInquiriesPill", { count: ticketsList.length })}
                </button>

                <button
                  type="button"
                  onClick={() => { setTicketTypeTab("feedback"); setTicketStatusFilter("all"); }}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold transition cursor-pointer ${
                    ticketTypeTab === "feedback"
                      ? "bg-amber-500 text-white shadow-xs"
                      : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60"
                  }`}
                >
                  <Star size={12} className="fill-current" />
                  <span>{at("feedbackRatingsPill", { count: feedbackTickets })}</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setTicketTypeTab("query"); setTicketStatusFilter("all"); }}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold transition cursor-pointer ${
                    ticketTypeTab === "query"
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60"
                  }`}
                >
                  <span>🌾</span>
                  <span>{at("agronomyQuestionsPill", { count: queryTickets })}</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setTicketStatusFilter("Submitted"); }}
                  className={`rounded-xl px-3 py-1 text-xs font-bold transition cursor-pointer ${
                    ticketStatusFilter === "Submitted"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  ⏳ {at("pendingPill", { count: pendingTickets })}
                </button>

                <button
                  type="button"
                  onClick={() => { setTicketStatusFilter("Resolved"); }}
                  className={`rounded-xl px-3 py-1 text-xs font-bold transition cursor-pointer ${
                    ticketStatusFilter === "Resolved"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  ✅ {at("resolvedPill", { count: resolvedTickets })}
                </button>
              </div>

              {/* SEARCH & FILTERS BAR */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="relative flex-1 min-w-[220px]">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={ticketSearch}
                    onChange={(e) => setTicketSearch(e.target.value)}
                    placeholder={at("searchTickets")}
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#F8FAF7] pl-8 pr-3 py-1.5 text-xs outline-none focus:border-[#2E7D32] focus:bg-white"
                  />
                </div>

                <select
                  value={ticketStatusFilter}
                  onChange={(e) => setTicketStatusFilter(e.target.value)}
                  className="rounded-xl border border-[#DCE8D9] bg-[#F8FAF7] px-3 py-1.5 text-xs font-bold text-gray-700 outline-none focus:border-[#2E7D32]"
                >
                  <option value="all">{at("allStatuses")}</option>
                  <option value="Submitted">{at("statusSubmitted")}</option>
                  <option value="Under Review">{at("underReview")}</option>
                  <option value="Resolved">{at("statusResolved")}</option>
                </select>

                <select
                  value={ticketCategoryFilter}
                  onChange={(e) => setTicketCategoryFilter(e.target.value)}
                  className="rounded-xl border border-[#DCE8D9] bg-[#F8FAF7] px-3 py-1.5 text-xs font-bold text-gray-700 outline-none focus:border-[#2E7D32]"
                >
                  <option value="all">{at("allCategories")}</option>
                  <option value="Feedback">{at("catFeedback")}</option>
                  <option value="Prediction">{at("yieldPredictionsRun")}</option>
                  <option value="Recommendation">{at("catCropAdvisory")}</option>
                  <option value="Soil">{at("catFertilizerSoil")}</option>
                  <option value="Weather">{at("catWeather")}</option>
                  <option value="PDF">{language === "mr" ? "PDF अहवाल" : language === "hi" ? "PDF रिपोर्ट्स" : "PDF Reports"}</option>
                  <option value="General">{at("catGeneral")}</option>
                </select>
              </div>
            </div>

            {/* TICKETS & FEEDBACK LIST */}
            <div className="divide-y divide-[#EEF2EC]">
              {filteredTickets.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs">
                  {at("noTicketsFound")}
                </div>
              ) : (
                filteredTickets.map((ticket) => {
                  const isFeedback = (ticket.category || "").toLowerCase().includes("feedback") || Boolean(ticket.rating);
                  const isResolved = ticket.status === "Resolved";
                  const isUnderReview = ticket.status === "Under Review";

                  return (
                    <div key={ticket.id || ticket.ticket_id} className="p-5 hover:bg-[#FAFDF9] transition space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="key-cap text-[10px] px-2.5 py-0.5 font-extrabold text-[#2E7D32]">
                            {ticket.ticket_id || `TICK-#${ticket.id}`}
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                              isFeedback
                                ? "bg-amber-100 text-amber-800 border-amber-200"
                                : "bg-[#E5F7EA] text-[#2E7D32] border-[#CDE5D1]"
                            }`}
                          >
                            {isFeedback ? at("feedbackStarCategory") : at("queryCropCategory")}
                          </span>

                          {ticket.rating && (
                            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold pl-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              <div className="flex items-center">
                                {[...Array(Number(ticket.rating) || 5)].map((_, i) => (
                                  <Star key={i} size={11} fill="currentColor" />
                                ))}
                              </div>
                              <span className="text-[10px] text-amber-800 font-extrabold">
                                {at("starsLabel", { rating: ticket.rating })}
                              </span>
                            </div>
                          )}

                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              isResolved
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : isUnderReview
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : "bg-amber-100 text-amber-800 border border-amber-200"
                            }`}
                          >
                            {isResolved ? `✅ ${at("statusResolved")}` : isUnderReview ? `🔍 ${at("underReview")}` : `⏳ ${at("statusSubmitted")}`}
                          </span>
                        </div>

                        <div className="text-[11px] text-gray-400 flex items-center gap-2">
                          <Calendar size={12} />
                          <span>{ticket.created_at || "Recent"}</span>
                        </div>
                      </div>

                      {/* QUERY SUBJECT & MESSAGE */}
                      <div className="space-y-1">
                        <h4 className="text-sm font-extrabold text-gray-800">
                          {ticket.subject || at("queriesSupport")}
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed bg-[#F8FAF7] p-3 rounded-xl border border-[#E2EAE0]">
                          "{ticket.message}"
                        </p>
                      </div>

                      {/* SENDER DETAILS & OFFICIAL REPLY */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span className="font-bold text-gray-800 flex items-center gap-1">
                            👤 {ticket.name || ticket.user_name || at("anonymous")}
                          </span>
                          <span>•</span>
                          <span className="text-gray-500">{ticket.user_email}</span>
                          <span>•</span>
                          <span className="text-[#2E7D32] font-semibold flex items-center gap-1">
                            <MapPin size={11} /> {ticket.district && ticket.district.trim() ? (tDistrict ? tDistrict(ticket.district) : ticket.district) : (language === "mr" ? "महाराष्ट्र" : language === "hi" ? "महाराष्ट्र" : "Maharashtra")}
                          </span>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setReplyTicketModal(ticket);
                              setAdminReplyText(ticket.admin_reply || "");
                              setReplyStatus(ticket.status === "Resolved" ? "Resolved" : "Resolved");
                            }}
                            className="btn-shimmer btn-glow flex items-center gap-1.5 rounded-xl bg-[#2E7D32] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#1B5E20] cursor-pointer"
                          >
                            <MessageSquare size={13} />
                            <span>{ticket.admin_reply ? at("editReply") : at("replyToFarmer")}</span>
                          </button>

                          {ticket.status !== "Resolved" ? (
                            <button
                              type="button"
                              onClick={() => handleTicketStatus(ticket.ticket_id, "Resolved")}
                              className="key-cap px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                            >
                              <Check size={13} className="inline mr-1" />
                              <span>{at("resolveBtn")}</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleTicketStatus(ticket.ticket_id, "Submitted")}
                              className="key-cap px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-amber-600 cursor-pointer"
                            >
                              {at("reopenBtn")}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteTicket(ticket.ticket_id)}
                            className="key-cap p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                            title={at("deleteTicket")}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* DISPLAY RECORDED ADMIN REPLY IF ANY */}
                      {ticket.admin_reply && (
                        <div className="rounded-xl border border-emerald-200 bg-[#EAF7EC] p-3 text-xs text-[#1B5E20] space-y-1">
                          <p className="font-bold flex items-center gap-1.5">
                            <ShieldCheck size={14} className="text-[#2E7D32]" />
                            <span>{at("officialAdminResponse")}</span>
                          </p>
                          <p className="pl-5 leading-relaxed">{ticket.admin_reply}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DATABASE & INFRASTRUCTURE */}
      {activeTab === "database" && (
        <div className="space-y-6 animate-zoom-fade">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* DB STATUS CARD */}
            <div className="card p-6 space-y-4 depth-1">
              <div className="flex items-center justify-between border-b border-[#EEF2EC] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3E6] text-[#2E7D32]">
                    <Database size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">{at("dbEngineOverview")}</h3>
                    <p className="text-[10px] text-gray-400">{dbStats?.db_file || "MySQL 127.0.0.1:3306/krushimitra"}</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5">
                  {dbStats?.db_status || at("healthy")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-[#F8FAF7] p-3 border border-[#E2EAE0]">
                  <span className="text-gray-400 text-[10px] font-semibold">{at("activeTables")}</span>
                  <p className="font-extrabold text-gray-800 mt-0.5">
                    {language === "mr" ? "५ मुख्य टेबल्स (वापरकर्ते, अंदाज, शिफारसी, तक्रारी)" : language === "hi" ? "५ मुख्य तालिकाएँ (उपयोगकर्ता, अनुमान, सिफारिशें, शिकायतें)" : "5 Tables (Users, Preds, Recs, Tickets, Resets)"}
                  </p>
                </div>
                <div className="rounded-xl bg-[#F8FAF7] p-3 border border-[#E2EAE0]">
                  <span className="text-gray-400 text-[10px] font-semibold">{at("totalRecordsCount")}</span>
                  <p className="font-extrabold text-[#2E7D32] mt-0.5">
                    {(dbStats?.total_users || (usersList || []).length) + (dbStats?.total_predictions || predictionHistory.length) + (dbStats?.total_recommendations || recommendationHistory.length) + ticketsList.length} {at("entries")}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleOptimizeDb}
                  disabled={isOptimizing}
                  className="btn-shimmer btn-glow flex items-center gap-2 rounded-xl bg-[#2E7D32] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1B5E20] cursor-pointer"
                >
                  <RefreshCw size={13} className={isOptimizing ? "animate-spin" : ""} />
                  <span>{isOptimizing ? at("optimizing") : at("optimizeDbTablesBtn")}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportBackup}
                  disabled={isExporting}
                  className="key-cap btn-glow flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 cursor-pointer"
                >
                  <Download size={13} />
                  <span>{at("exportJsonDumpBtn")}</span>
                </button>
              </div>
            </div>

            {/* LIVE DATABASE TABLES METRICS */}
            <div className="card p-6 space-y-4 depth-1">
              <div className="flex items-center justify-between border-b border-[#EEF2EC] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3E6] text-[#2E7D32]">
                    <Database size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">{at("liveDbTables")}</h3>
                    <p className="text-[10px] text-gray-400">{at("schemaTelemetry")}</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5">
                  {at("liveCountsBadge")}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-xl bg-[#F8FAF7] p-3 border border-[#E2EAE0]">
                  <span className="font-semibold text-gray-700">users</span>
                  <span className="font-extrabold text-[#2E7D32]">{dbStats?.total_users ?? (usersList || []).length} {at("records")}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-[#F8FAF7] p-3 border border-[#E2EAE0]">
                  <span className="font-semibold text-gray-700">support_tickets</span>
                  <span className="font-extrabold text-[#2E7D32]">{ticketsList.length} {at("records")}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-[#F8FAF7] p-3 border border-[#E2EAE0]">
                  <span className="font-semibold text-gray-700">prediction_history</span>
                  <span className="font-extrabold text-[#2E7D32]">{dbStats?.total_predictions ?? predictionHistory.length} {at("records")}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-[#F8FAF7] p-3 border border-[#E2EAE0]">
                  <span className="font-semibold text-gray-700">recommendation_history</span>
                  <span className="font-extrabold text-[#2E7D32]">{dbStats?.total_recommendations ?? recommendationHistory.length} {at("records")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
         MODAL 1: ADD NEW USER (ADMIN ACTION)
      ========================================================= */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4 animate-zoom-fade">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-green-200/80 animate-zoom-fade depth-3 glow-emerald">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-extrabold text-gray-800 flex items-center gap-2">
                <Plus size={18} className="text-[#2E7D32]" />
                <span>{at("addUserTitle")}</span>
              </h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {newUserError && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs font-medium text-red-700">
                {newUserError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">{at("nameLabel")} *</label>
                <input
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2 text-xs outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">{at("emailLabel")} *</label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="e.g. farmer@krushimitra.in"
                  className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2 text-xs outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{at("roleLabel")}</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3 py-2 text-xs outline-none focus:border-[#2E7D32]"
                  >
                    <option value="Farmer">{at("farmers")}</option>
                    <option value="Admin">{at("admins")}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{at("districtLabel")}</label>
                  <select
                    value={newUserForm.district}
                    onChange={(e) => setNewUserForm({ ...newUserForm, district: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3 py-2 text-xs outline-none focus:border-[#2E7D32]"
                  >
                    {districts.map((d) => (
                      <option key={d} value={d}>{tDistrict ? tDistrict(d) : d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{at("phoneLabel")}</label>
                  <input
                    type="text"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2 text-xs outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{at("passwordLabel")}</label>
                  <input
                    type="password"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    placeholder="password123"
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2 text-xs outline-none focus:border-[#2E7D32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{at("thFarmAcreage")}</label>
                  <input
                    type="text"
                    value={newUserForm.farm_size}
                    onChange={(e) => setNewUserForm({ ...newUserForm, farm_size: e.target.value })}
                    placeholder="e.g. 5.0"
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2 text-xs outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{at("thPrimaryCrops")}</label>
                  <input
                    type="text"
                    value={newUserForm.primary_crops}
                    onChange={(e) => setNewUserForm({ ...newUserForm, primary_crops: e.target.value })}
                    placeholder="Soybean, Wheat, Cotton"
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2 text-xs outline-none focus:border-[#2E7D32]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="rounded-xl border border-gray-300 px-4 py-2 font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  {at("cancel")}
                </button>
                <button
                  type="submit"
                  className="btn-shimmer btn-glow rounded-xl bg-[#2E7D32] px-5 py-2 font-bold text-white shadow-xs hover:bg-[#1B5E20] cursor-pointer"
                >
                  {at("addNewUser")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
         MODAL 2: EDIT USER DETAILS (ADMIN ACTION)
      ========================================================= */}
      {editUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4 animate-zoom-fade">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-green-200/80 animate-zoom-fade depth-3 glow-emerald">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-extrabold text-gray-800 flex items-center gap-2">
                <Edit3 size={18} className="text-[#2E7D32]" />
                <span>{at("editUserTitle")} (#{editUserDetail.id})</span>
              </h3>
              <button
                onClick={() => setEditUserDetail(null)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{at("nameLabel")}</label>
                  <input
                    type="text"
                    required
                    value={editUserDetail.name || ""}
                    onChange={(e) => setEditUserDetail({ ...editUserDetail, name: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3 py-2 text-xs outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{at("emailLabel")}</label>
                  <input
                    type="email"
                    required
                    value={editUserDetail.email || ""}
                    onChange={(e) => setEditUserDetail({ ...editUserDetail, email: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3 py-2 text-xs outline-none focus:border-[#2E7D32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{at("phoneLabel")}</label>
                  <input
                    type="text"
                    value={editUserDetail.phone || ""}
                    onChange={(e) => setEditUserDetail({ ...editUserDetail, phone: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3 py-2 text-xs outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{at("districtLabel")}</label>
                  <select
                    value={editUserDetail.district || "Pune"}
                    onChange={(e) => setEditUserDetail({ ...editUserDetail, district: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3 py-2 text-xs outline-none focus:border-[#2E7D32]"
                  >
                    {districts.map((d) => (
                      <option key={d} value={d}>{tDistrict ? tDistrict(d) : d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{at("roleLabel")}</label>
                  <select
                    value={editUserDetail.role || "Farmer"}
                    onChange={(e) => setEditUserDetail({ ...editUserDetail, role: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3 py-2 text-xs outline-none focus:border-[#2E7D32]"
                  >
                    <option value="Farmer">{at("farmers")}</option>
                    <option value="Admin">{at("admins")}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{at("kisanCardId")}</label>
                  <input
                    type="text"
                    value={editUserDetail.kisan_id || editUserDetail.kisanId || ""}
                    onChange={(e) => setEditUserDetail({ ...editUserDetail, kisan_id: e.target.value, kisanId: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3 py-2 text-xs outline-none focus:border-[#2E7D32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{at("thFarmAcreage")}</label>
                  <input
                    type="text"
                    value={editUserDetail.farm_size || editUserDetail.farmSize || ""}
                    onChange={(e) => setEditUserDetail({ ...editUserDetail, farm_size: e.target.value, farmSize: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3 py-2 text-xs outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{at("thPrimaryCrops")}</label>
                  <input
                    type="text"
                    value={editUserDetail.primary_crops || editUserDetail.primaryCrops || ""}
                    onChange={(e) => setEditUserDetail({ ...editUserDetail, primary_crops: e.target.value, primaryCrops: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3 py-2 text-xs outline-none focus:border-[#2E7D32]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditUserDetail(null)}
                  className="rounded-xl border border-gray-300 px-4 py-2 font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  {at("cancel")}
                </button>
                <button
                  type="submit"
                  className="btn-shimmer btn-glow rounded-xl bg-[#2E7D32] px-5 py-2 font-bold text-white shadow-xs hover:bg-[#1B5E20] cursor-pointer"
                >
                  {at("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
         MODAL 3: INSPECT USER FULL DOSSIER
      ========================================================= */}
      {viewUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4 animate-zoom-fade">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-green-200/80 animate-zoom-fade depth-3 glow-emerald">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2E7D32] to-[#10B981] text-white font-extrabold text-xl">
                  {viewUserDetail.name?.charAt(0) || "F"}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-800">{viewUserDetail.name}</h3>
                  <p className="text-[11px] text-gray-400">{viewUserDetail.email}</p>
                </div>
              </div>
              <button
                onClick={() => setViewUserDetail(null)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-[#F8FAF7] p-3 border border-[#E2EAE0]">
                  <span className="text-gray-400 text-[10px] font-semibold">{at("userIdRole")}</span>
                  <p className="font-extrabold text-[#2E7D32] mt-0.5">#{viewUserDetail.id} • {viewUserDetail.role === "Admin" ? at("admins") : at("farmers")}</p>
                </div>
                <div className="rounded-xl bg-[#F8FAF7] p-3 border border-[#E2EAE0]">
                  <span className="text-gray-400 text-[10px] font-semibold">{at("kisanCardId")}</span>
                  <p className="font-extrabold text-gray-800 mt-0.5">{viewUserDetail.kisan_id || viewUserDetail.kisanId || "—"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-[#F8FAF7] p-3 border border-[#E2EAE0]">
                  <span className="text-gray-400 text-[10px] font-semibold">{at("contactPhone")}</span>
                  <p className="font-bold text-gray-800 mt-0.5">{viewUserDetail.phone && viewUserDetail.phone.trim() ? viewUserDetail.phone : "—"}</p>
                </div>
                <div className="rounded-xl bg-[#F8FAF7] p-3 border border-[#E2EAE0]">
                  <span className="text-gray-400 text-[10px] font-semibold">{at("thCityDistrict")}</span>
                  <p className="font-bold text-gray-800 mt-0.5">
                    {viewUserDetail.district && viewUserDetail.district.trim() ? (tDistrict ? tDistrict(viewUserDetail.district) : viewUserDetail.district) : "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-[#F8FAF7] p-3 border border-[#E2EAE0]">
                  <span className="text-gray-400 text-[10px] font-semibold">{at("farmAcreageUnit")}</span>
                  <p className="font-bold text-gray-800 mt-0.5">
                    {viewUserDetail.farm_size || viewUserDetail.farmSize ? `${viewUserDetail.farm_size || viewUserDetail.farmSize} ${at("acres")}` : "—"}
                  </p>
                </div>
                <div className="rounded-xl bg-[#F8FAF7] p-3 border border-[#E2EAE0]">
                  <span className="text-gray-400 text-[10px] font-semibold">{at("thPrimaryCrops")}</span>
                  <p className="font-bold text-gray-800 mt-0.5 truncate">{viewUserDetail.primary_crops || viewUserDetail.primaryCrops || "—"}</p>
                </div>
              </div>

              <div className="rounded-xl bg-[#F8FAF7] p-3 border border-[#E2EAE0]">
                <span className="text-gray-400 text-[10px] font-semibold">{at("soilTypeIrrigation")}</span>
                <p className="font-semibold text-gray-700 mt-0.5">
                  {viewUserDetail.soil_type || viewUserDetail.soilType ? (viewUserDetail.soil_type || viewUserDetail.soilType) : "—"} {viewUserDetail.irrigation_type || viewUserDetail.irrigationType ? `• ${viewUserDetail.irrigation_type || viewUserDetail.irrigationType}` : ""}
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] p-4 text-white">
                <p className="text-[11px] text-green-100 font-medium">{at("activityRecordsFor", { name: viewUserDetail.name })}</p>
                <div className="mt-2 flex justify-between text-xs font-semibold">
                  <span>{at("predictionsCount")} <strong>{predictionHistory.filter(p => p.user_email?.toLowerCase() === viewUserDetail.email?.toLowerCase()).length}</strong></span>
                  <span>{at("soilAdvisoriesCount")} <strong>{recommendationHistory.filter(r => r.user_email?.toLowerCase() === viewUserDetail.email?.toLowerCase()).length}</strong></span>
                  <span>{at("memberSince")} <strong>{viewUserDetail.member_since || viewUserDetail.memberSince || "—"}</strong></span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditUserDetail({ ...viewUserDetail });
                  setViewUserDetail(null);
                }}
                className="key-cap px-4 py-2 text-xs font-bold text-gray-700 cursor-pointer"
              >
                {at("editUserProfileBtn")}
              </button>
              <button
                type="button"
                onClick={() => setViewUserDetail(null)}
                className="btn-shimmer btn-glow rounded-xl bg-[#2E7D32] px-5 py-2 text-xs font-bold text-white cursor-pointer"
              >
                {at("close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
         MODAL 4: REPLY TO FARMER INQUIRY / FEEDBACK
      ========================================================= */}
      {replyTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4 animate-zoom-fade">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-green-200/80 animate-zoom-fade depth-3 glow-emerald">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-[#2E7D32]" />
                <h3 className="text-base font-extrabold text-gray-800">
                  {at("replyModalTitle")} ({replyTicketModal.ticket_id})
                </h3>
              </div>
              <button
                onClick={() => setReplyTicketModal(null)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-[#F8FAF7] p-3.5 text-xs border border-[#E2EAE0] space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2 font-bold text-gray-700">
                <span>
                  {at("fromFarmer", { name: replyTicketModal.name || at("anonymous") })} ({replyTicketModal.district && replyTicketModal.district.trim() ? (tDistrict ? tDistrict(replyTicketModal.district) : replyTicketModal.district) : (language === "mr" ? "महाराष्ट्र" : language === "hi" ? "महाराष्ट्र" : "Maharashtra")})
                </span>
                <div className="flex items-center gap-2">
                  {replyTicketModal.rating && (
                    <div className="flex items-center gap-0.5 text-amber-500 font-extrabold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      {[...Array(Number(replyTicketModal.rating) || 5)].map((_, i) => (
                        <Star key={i} size={11} fill="currentColor" />
                      ))}
                      <span className="text-[10px] text-amber-800 ml-0.5">{replyTicketModal.rating}/5</span>
                    </div>
                  )}
                  <span className="text-[#2E7D32] bg-[#E5F7EA] px-2 py-0.5 rounded-full border border-[#CDE5D1] text-[10px] font-bold">
                    {replyTicketModal.category || at("catGeneral")}
                  </span>
                </div>
              </div>
              <p className="font-extrabold text-gray-800 text-xs">{replyTicketModal.subject}</p>
              <p className="text-gray-600 bg-white p-2.5 rounded-lg border border-[#E2EAE0] leading-relaxed">
                "{replyTicketModal.message}"
              </p>
            </div>

            <form onSubmit={handleSendReply} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  {at("officialReply")} *
                </label>
                <textarea
                  rows={4}
                  required
                  value={adminReplyText}
                  onChange={(e) => setAdminReplyText(e.target.value)}
                  placeholder={at("replyPlaceholder")}
                  className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] p-3 text-xs outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{at("thStatus")}</label>
                  <select
                    value={replyStatus}
                    onChange={(e) => setReplyStatus(e.target.value)}
                    className="rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3 py-1.5 text-xs font-bold text-gray-700 outline-none focus:border-[#2E7D32]"
                  >
                    <option value="Resolved">{at("statusResolved")}</option>
                    <option value="Under Review">{at("underReview")}</option>
                    <option value="Submitted">{at("statusSubmitted")}</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setReplyTicketModal(null)}
                    className="rounded-xl border border-gray-300 px-4 py-2 font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                  >
                    {at("cancel")}
                  </button>
                  <button
                    type="submit"
                    className="btn-shimmer btn-glow flex items-center gap-1.5 rounded-xl bg-[#2E7D32] px-5 py-2 font-bold text-white shadow-xs hover:bg-[#1B5E20] cursor-pointer"
                  >
                    <Send size={13} />
                    <span>{at("sendReplyBtn")}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* REUSABLE METRIC CARD */
function MetricCard({ icon: Icon, title, value, subtitle, status, statusColor }) {
  return (
    <div className="card card-interactive p-5 group cursor-default depth-1">
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