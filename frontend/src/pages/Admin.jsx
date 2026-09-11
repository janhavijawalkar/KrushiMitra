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

export default function Admin({ nav }) {
  const {
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
      showToast("Alert headline and advisory message are required!");
      return;
    }

    setIsBroadcasting(true);
    try {
      const res = await apiCreateBroadcast(broadcastForm);
      if (res.success) {
        showToast(`📢 ${res.message || "Advisory broadcast successfully dispatched!"}`);
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
        showToast(res.message || "Failed to dispatch broadcast.");
      }
    } catch (err) {
      showToast("Broadcast submission error.");
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleDeleteBroadcast = async (broadcastId, title) => {
    if (confirm(`Are you sure you want to permanently delete broadcast "${title}"?`)) {
      const res = await apiDeleteBroadcast(broadcastId);
      if (res.success) {
        showToast(`Broadcast "${title}" has been deleted.`);
        if (apiFetchAdminBroadcasts) {
          const b = await apiFetchAdminBroadcasts();
          if (b) setBroadcastsList(b);
        }
      } else {
        showToast(res.message || "Failed to delete broadcast.");
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
    showToast(`User role updated to ${newRole} in database!`);
    loadData();
  };

  const handleDeleteUser = async (userId, userName) => {
    if (confirm(`Are you sure you want to permanently delete user "${userName}" from the database?`)) {
      if (apiDeleteUser) {
        await apiDeleteUser(userId);
      }
      showToast(`User "${userName}" has been deleted.`);
      loadData();
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setNewUserError("");

    if (!newUserForm.name || !newUserForm.email) {
      setNewUserError("Name and email are required.");
      return;
    }

    if (apiCreateAdminUser) {
      const res = await apiCreateAdminUser(newUserForm);
      if (res.success) {
        showToast(`User "${newUserForm.name}" successfully created!`);
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
        showToast(`User "${editUserDetail.name}" profile updated in database!`);
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
      showToast(`Ticket status updated to ${newStatus}`);
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
      showToast(`Official reply sent and recorded for ${replyTicketModal.ticket_id}!`);
      setReplyTicketModal(null);
      setAdminReplyText("");
      if (apiFetchAdminTickets) {
        const tickets = await apiFetchAdminTickets();
        if (tickets) setTicketsList(tickets);
      }
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (confirm(`Are you sure you want to delete inquiry "${ticketId}"?`)) {
      if (apiAdminDeleteTicket) {
        await apiAdminDeleteTicket(ticketId);
        showToast(`Inquiry ${ticketId} deleted.`);
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
          showToast("Master database backup JSON downloaded successfully!");
        }
      }
    } catch (err) {
      showToast("Failed to export database backup.");
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
    showToast("Farmer directory exported to CSV format!");
  };

  const handleOptimizeDb = async () => {
    setIsOptimizing(true);
    try {
      if (apiOptimizeDatabase) {
        const res = await apiOptimizeDatabase();
        showToast(res.message || "Database integrity verified and optimized.");
        loadData();
      }
    } catch (err) {
      showToast("Optimization ping failed.");
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
              {t("adminPanel") || "System Administration & Command Center"}
            </h1>
            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-[#1B5E20]">
              <ShieldCheck size={14} /> Master Administrator
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Real-time platform operations, registered farmer registry, crop analytics, feedback helpdesk, and database control.
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
            <span>{isRefreshing ? "Syncing Platform..." : "Sync DB"}</span>
          </button>

          <button
            type="button"
            onClick={handleExportBackup}
            disabled={isExporting}
            className="btn-shimmer btn-glow inline-flex items-center gap-1.5 rounded-xl bg-[#2E7D32] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1B5E20] cursor-pointer"
          >
            <Download size={14} />
            <span>{isExporting ? "Exporting..." : "Export DB Backup"}</span>
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
          { id: "overview", label: "Operations & Telemetry", icon: Activity },
          {
            id: "broadcasts",
            label: `Advisory & Emergency Broadcast (${broadcastsList.length})`,
            icon: Megaphone,
            badge: broadcastsList.filter((b) => b.severity === "Critical").length > 0
              ? `${broadcastsList.filter((b) => b.severity === "Critical").length} Critical`
              : null,
          },
          { id: "users", label: `Farmer & User Registry (${(usersList || []).length})`, icon: Users },
          { id: "tickets", label: `Farmer Queries & Feedback (${ticketsList.length})`, icon: MessageSquare, badge: pendingTickets > 0 ? `${pendingTickets} Open` : null },
          { id: "database", label: "Database & System Logs", icon: Database },
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
              title="Registered Users"
              value={(usersList || []).length}
              subtitle={`${totalFarmers} Farmers • ${totalAdmins} Admins`}
              status="Live DB"
              statusColor="green"
            />

            <MetricCard
              icon={TrendingUp}
              title="Yield Predictions Run"
              value={dbStats?.total_predictions ?? predictionHistory.length ?? 0}
              subtitle="Random Forest Regressor"
              status="Active"
              statusColor="green"
            />

            <MetricCard
              icon={Sprout}
              title="Soil Advisories Generated"
              value={dbStats?.total_recommendations ?? recommendationHistory.length ?? 0}
              subtitle="22-Class Crop Classifier"
              status="Calibrated"
              statusColor="green"
            />

            <MetricCard
              icon={MessageSquare}
              title="User Queries & Feedback"
              value={ticketsList.length}
              subtitle={`${resolvedTickets} Resolved • ${pendingTickets} Pending`}
              status="Helpdesk Active"
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
                  <h3 className="text-sm font-bold text-gray-800">Farmer & User Directory</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    View real registered farmers, acreage, districts, and manage access.
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
                  <h3 className="text-sm font-bold text-gray-800">Farmer Queries & Support</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Inspect user inquiries, ratings, and write official agronomist replies.
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
                  <h3 className="text-sm font-bold text-gray-800">Database & System Logs</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Inspect database health, record counts, and download master backups.
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
                  Total Bulletins
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
                  Critical Emergencies
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
                  Caution Warnings
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
                  Registered Audience
                </p>
                <h3 className="text-xl font-extrabold text-blue-700 dark:text-blue-400">
                  {(usersList || []).filter((u) => u.role === "Farmer").length} Farmers
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
                      Broadcast Advisory Console
                    </h2>
                    <p className="text-[10px] text-emerald-100 font-medium">
                      Real-time alert dispatch to farmer dashboards & mobile apps
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-white/25 px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-xs">
                  MySQL Live
                </span>
              </div>

              {/* QUICK TEMPLATES */}
              <div className="p-4 bg-[#F7FAF6] dark:bg-[#183321]/40 border-b border-gray-100 dark:border-gray-800">
                <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                  <Sparkles size={12} className="text-[#2E7D32]" />
                  <span>Quick Simulation Templates (SIH / Demos):</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setBroadcastForm({
                        title: "Unseasonal Thunderstorm & Hailstorm Warning for Nashik & Ahmednagar",
                        message: "Severe unseasonal thunderstorm with gusty winds (40-50 km/h) and scattered hailstorms expected over the next 48 hours across North Maharashtra. Farmers are strongly advised to secure harvested onion stocks, delay grape canopy spraying, and clear drainage lines in orchards.",
                        severity: "Critical",
                        category: "Weather Alert",
                        district: "Nashik",
                        crop: "Onion, Grapes",
                        action_recommendation: "Shift harvested crops to covered godowns; inspect orchard drainage.",
                        created_by: "District Agriculture Emergency Cell, Nashik",
                      });
                    }}
                    className="rounded-lg bg-white dark:bg-[#1E3A28] border border-red-200 dark:border-red-900 px-2.5 py-1 text-[11px] font-semibold text-red-700 dark:text-red-300 hover:bg-red-50 cursor-pointer transition shadow-2xs"
                  >
                    🌧️ Nashik Hailstorm (Critical)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBroadcastForm({
                        title: "Fall Armyworm Vigilance Advisory for Kharif Maize & Sugarcane",
                        message: "Incidence of early-stage Fall Armyworm (Spodoptera frugiperda) infestation observed in Western Maharashtra zones. Scouting should be undertaken every 4-5 days.",
                        severity: "Warning",
                        category: "Pest & Disease",
                        district: "Pune",
                        crop: "Sugarcane, Maize",
                        action_recommendation: "Install pheromone traps @ 5 per acre & apply Azadirachtin 1500 ppm @ 5ml/L.",
                        created_by: "Krushi Vigyan Kendra (KVK) Pune",
                      });
                    }}
                    className="rounded-lg bg-white dark:bg-[#1E3A28] border border-amber-200 dark:border-amber-900 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-50 cursor-pointer transition shadow-2xs"
                  >
                    🐛 Pune Armyworm (Warning)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBroadcastForm({
                        title: "Statewide Rabi Sowing & Micro-Irrigation 80% Subsidy Open",
                        message: "Maharashtra Agriculture Department announces open portal registration for 80% Drip & Sprinkler Irrigation Subsidies under the PMKSY / MahaDBT framework for all registered farmers.",
                        severity: "Advisory",
                        category: "Government Scheme",
                        district: "All",
                        crop: "All",
                        action_recommendation: "Apply online on MahaDBT portal with updated 7/12 land extract.",
                        created_by: "Maharashtra State Agricultural Department",
                      });
                    }}
                    className="rounded-lg bg-white dark:bg-[#1E3A28] border border-emerald-200 dark:border-emerald-900 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 cursor-pointer transition shadow-2xs"
                  >
                    🏛️ Statewide Subsidy (Advisory)
                  </button>
                </div>
              </div>

              {/* FORM */}
              <form onSubmit={handleCreateBroadcast} className="p-5 space-y-4">
                {/* SEVERITY SELECTOR */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Severity Level (Urgency):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "Critical", label: "🔴 Critical", desc: "Emergency Alert", color: "border-red-400 bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300" },
                      { id: "Warning", label: "🟡 Warning", desc: "High Caution", color: "border-amber-400 bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300" },
                      { id: "Advisory", label: "🟢 Advisory", desc: "General Notice", color: "border-emerald-400 bg-emerald-50 text-[#1B5E20] dark:bg-emerald-950/50 dark:text-emerald-300" },
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
                    Alert Headline / Subject <span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    value={broadcastForm.title}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                    placeholder="e.g. Unseasonal Hailstorm Alert in Nashik & Ahmednagar"
                    className="w-full rounded-xl border border-[#DCE7DA] bg-white dark:bg-[#183321] px-3.5 py-2 text-xs font-semibold text-gray-800 dark:text-white outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-emerald-400/20"
                  />
                </div>

                {/* TARGET DISTRICT & CATEGORY */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Target District <span className="text-red-500">*</span>:
                    </label>
                    <select
                      value={broadcastForm.district}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, district: e.target.value })}
                      className="w-full rounded-xl border border-[#DCE7DA] bg-white dark:bg-[#183321] px-3 py-2 text-xs font-semibold text-gray-800 dark:text-white outline-none focus:border-[#2E7D32]"
                    >
                      <option value="All">🌐 All 36 Districts (Statewide)</option>
                      {districts.map((d) => (
                        <option key={d} value={d}>
                          📍 {d} District
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Advisory Category:
                    </label>
                    <select
                      value={broadcastForm.category}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, category: e.target.value })}
                      className="w-full rounded-xl border border-[#DCE7DA] bg-white dark:bg-[#183321] px-3 py-2 text-xs font-semibold text-gray-800 dark:text-white outline-none focus:border-[#2E7D32]"
                    >
                      <option value="Weather Alert">🌧️ Weather Alert</option>
                      <option value="Pest & Disease">🐛 Pest & Disease Outbreak</option>
                      <option value="Government Scheme">🏛️ Government Scheme / Subsidy</option>
                      <option value="Market & MSP">📈 Market Rate & MSP</option>
                      <option value="Fertilizer & Sowing">🌱 Fertilizer & Sowing Advisory</option>
                    </select>
                  </div>
                </div>

                {/* TARGET CROP & AUTHOR */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Target Crop(s):
                    </label>
                    <input
                      type="text"
                      value={broadcastForm.crop}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, crop: e.target.value })}
                      placeholder="e.g. All, Soybean, Grapes, Cotton"
                      className="w-full rounded-xl border border-[#DCE7DA] bg-white dark:bg-[#183321] px-3.5 py-2 text-xs font-semibold text-gray-800 dark:text-white outline-none focus:border-[#2E7D32]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Issued By / Department:
                    </label>
                    <input
                      type="text"
                      value={broadcastForm.created_by}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, created_by: e.target.value })}
                      placeholder="e.g. District Agriculture Emergency Cell"
                      className="w-full rounded-xl border border-[#DCE7DA] bg-white dark:bg-[#183321] px-3.5 py-2 text-xs font-semibold text-gray-800 dark:text-white outline-none focus:border-[#2E7D32]"
                    />
                  </div>
                </div>

                {/* ADVISORY MESSAGE */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Detailed Advisory Instructions <span className="text-red-500">*</span>:
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={broadcastForm.message}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                    placeholder="Describe the condition, risk factors, and precautions farmers must follow..."
                    className="w-full rounded-xl border border-[#DCE7DA] bg-white dark:bg-[#183321] p-3 text-xs text-gray-800 dark:text-white outline-none focus:border-[#2E7D32]"
                  />
                </div>

                {/* ACTIONABLE RECOMMENDATION */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Direct Action Step for Farmers (Actionable Remedy):
                  </label>
                  <input
                    type="text"
                    value={broadcastForm.action_recommendation}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, action_recommendation: e.target.value })}
                    placeholder="e.g. Spray Neem oil (5ml/L) or transfer produce to covered godowns within 48 hours."
                    className="w-full rounded-xl border border-[#DCE7DA] bg-white dark:bg-[#183321] px-3.5 py-2 text-xs font-semibold text-gray-800 dark:text-white outline-none focus:border-[#2E7D32]"
                  />
                </div>

                {/* AUDIENCE REACH BANNER */}
                <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-950/40 dark:border-blue-900/60 p-3 text-xs text-blue-800 dark:text-blue-200">
                  <Radio size={16} className="shrink-0 text-blue-600 animate-pulse" />
                  <span>
                    🎯 Audience Target:{" "}
                    <strong>
                      {broadcastForm.district === "All"
                        ? `All 36 Districts (~${(usersList || []).filter((u) => u.role === "Farmer").length} registered farmers)`
                        : `${broadcastForm.district} District (~${(usersList || []).filter((u) => u.role === "Farmer" && (u.district || "").toLowerCase() === broadcastForm.district.toLowerCase()).length} registered farmers)`}
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
                  <span>{isBroadcasting ? "Transmitting Alert to MySQL..." : "Broadcast Alert to Farmers Now 🚀"}</span>
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
                      <span>Active Broadcast Advisories & Alert Log ({broadcastsList.length})</span>
                    </h2>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Live transmission log stored in MySQL database. Alerts appear instantly on farmer dashboards.
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
                      placeholder="Search alerts or districts..."
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#183321] pl-8 pr-3 py-1.5 text-xs text-gray-800 dark:text-white outline-none focus:border-[#2E7D32]"
                    />
                  </div>

                  <select
                    value={broadcastSeverityFilter}
                    onChange={(e) => setBroadcastSeverityFilter(e.target.value)}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#183321] px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 font-semibold outline-none"
                  >
                    <option value="all">All Severities</option>
                    <option value="critical">🔴 Critical Only</option>
                    <option value="warning">🟡 Warning Only</option>
                    <option value="advisory">🟢 Advisory Only</option>
                  </select>

                  <select
                    value={broadcastDistrictFilter}
                    onChange={(e) => setBroadcastDistrictFilter(e.target.value)}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#183321] px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 font-semibold outline-none"
                  >
                    <option value="all">All Target Districts</option>
                    <option value="all">🌐 All (Statewide)</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        📍 {d}
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
                    <p className="text-xs font-bold">No broadcast advisories found.</p>
                    <p className="text-[11px]">Compose an advisory using the form on the left.</p>
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
                                  {item.severity}
                                </span>

                                <span className="rounded-full bg-gray-200 dark:bg-gray-700 px-2 py-0.5 text-[10px] font-bold text-gray-700 dark:text-gray-300">
                                  {item.category || "Weather"}
                                </span>

                                <span className="rounded-full bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:text-blue-200 flex items-center gap-1">
                                  <MapPin size={10} />
                                  <span>{item.district === "All" ? "All Maharashtra" : `${item.district} District`}</span>
                                </span>

                                {item.crop && item.crop !== "All" && (
                                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-1">
                                    <Wheat size={10} />
                                    <span>{item.crop}</span>
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
                                    <strong>Actionable Advice:</strong> {item.action_recommendation}
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
                                <span>Issued by: {item.created_by}</span>
                                <span>•</span>
                                <span className="text-[#2E7D32] font-bold flex items-center gap-1">
                                  <Radio size={10} />
                                  <span>Reaches ~{item.estimated_reach || 13} farmers</span>
                                </span>
                              </div>
                            </div>

                            {/* ACTIONS */}
                            <div className="flex sm:flex-col items-center gap-1.5 shrink-0 pt-1">
                              <button
                                type="button"
                                onClick={() => handleDeleteBroadcast(item.broadcast_id || item.id, item.title)}
                                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white dark:bg-[#1E3A28] border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition shadow-2xs cursor-pointer"
                                title="Delete / Archive Alert"
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
                    <span>Registered Farmers & User Directory (Full System Record)</span>
                  </h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Inspect farmer identities, Kisan IDs, registered cities, contact numbers, acreage, and manage account permissions.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search name, ID, email, city, phone..."
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

                  <button
                    type="button"
                    onClick={handleExportUsersCSV}
                    className="key-cap btn-glow flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 cursor-pointer"
                    title="Export Farmer Directory to CSV"
                  >
                    <FileSpreadsheet size={14} className="text-[#2E7D32]" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(true)}
                    className="btn-shimmer btn-glow flex items-center gap-1.5 rounded-xl bg-[#2E7D32] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#1B5E20] cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add New User</span>
                  </button>
                </div>
              </div>
            </div>

            {/* USERS TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F8FAF7] text-[10px] uppercase tracking-wide text-gray-400 border-b border-[#E2EAE0]">
                    <th className="px-4 py-3.5">User / Kisan ID</th>
                    <th className="px-4 py-3.5">Farmer & Contact</th>
                    <th className="px-4 py-3.5">City / District</th>
                    <th className="px-4 py-3.5">Farm Acreage & Soil</th>
                    <th className="px-4 py-3.5">Primary Crops</th>
                    <th className="px-4 py-3.5">Role</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-right">Admin Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EEF2EC]">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-400 text-xs">
                        No users matching search criteria.
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
                              <span className="text-[11px] text-gray-400 italic">Central Operations Desk</span>
                            ) : (
                              <div>
                                <p className="font-bold text-gray-800">
                                  {u.farm_size || u.farmSize ? `${u.farm_size || u.farmSize} ${u.farm_unit || u.farmUnit || "Acres"}` : "—"}
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
                              {isAdminUser ? "🛡️ Admin" : "🌾 Farmer"}
                            </span>
                          </td>

                          {/* STATUS */}
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              {u.status || "Active"}
                            </span>
                          </td>

                          {/* ACTIONS */}
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setViewUserDetail(u)}
                                className="key-cap p-1.5 text-gray-600 hover:text-[#2E7D32] transition cursor-pointer"
                                title="View Full Farmer Dossier"
                              >
                                <Eye size={14} />
                              </button>

                              <button
                                type="button"
                                onClick={() => setEditUserDetail({ ...u })}
                                className="key-cap p-1.5 text-gray-600 hover:text-blue-600 transition cursor-pointer"
                                title="Edit Farmer Details"
                              >
                                <Edit3 size={14} />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRoleToggle(u.id, u.role)}
                                className="key-cap px-2.5 py-1 text-[11px] font-bold text-gray-700 hover:bg-[#F0F8ED] hover:text-[#2E7D32] transition cursor-pointer"
                                title="Toggle Role"
                              >
                                {isAdminUser ? "Demote" : "Make Admin"}
                              </button>

                              {u.email !== "admin@krushimitra.in" && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(u.id, u.name)}
                                  className="key-cap p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                                  title="Delete User"
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

      {/* TAB 3: FARMER QUERIES, SUPPORT & FEEDBACK DESK */}
      {activeTab === "tickets" && (
        <div className="space-y-4 animate-zoom-fade">
          <div className="card overflow-hidden depth-1">
            <div className="border-b border-[#E2EAE0] p-5 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <MessageSquare size={17} className="text-[#2E7D32]" />
                    <span>Farmer Inquiries, Advice Queries & Feedback Desk</span>
                  </h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Review incoming support inquiries, feedback ratings, questions regarding soil/fertilizers, and provide official agronomist responses.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={loadData}
                    disabled={isRefreshing}
                    className="key-cap flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 hover:text-[#2E7D32] transition cursor-pointer"
                    title="Refresh Data from Server"
                  >
                    <RefreshCw size={13} className={isRefreshing ? "animate-spin text-[#2E7D32]" : ""} />
                    <span>Refresh</span>
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
                  All Inquiries ({ticketsList.length})
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
                  <span>Feedback & Ratings ({feedbackTickets})</span>
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
                  <span>Agronomy Questions ({queryTickets})</span>
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
                  ⏳ Pending ({pendingTickets})
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
                  ✅ Resolved ({resolvedTickets})
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
                    placeholder="Search query, subject, farmer name, district..."
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#F8FAF7] pl-8 pr-3 py-1.5 text-xs outline-none focus:border-[#2E7D32] focus:bg-white"
                  />
                </div>

                <select
                  value={ticketStatusFilter}
                  onChange={(e) => setTicketStatusFilter(e.target.value)}
                  className="rounded-xl border border-[#DCE8D9] bg-[#F8FAF7] px-3 py-1.5 text-xs font-bold text-gray-700 outline-none focus:border-[#2E7D32]"
                >
                  <option value="all">All Statuses</option>
                  <option value="Submitted">Submitted / Open</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Resolved">Resolved</option>
                </select>

                <select
                  value={ticketCategoryFilter}
                  onChange={(e) => setTicketCategoryFilter(e.target.value)}
                  className="rounded-xl border border-[#DCE8D9] bg-[#F8FAF7] px-3 py-1.5 text-xs font-bold text-gray-700 outline-none focus:border-[#2E7D32]"
                >
                  <option value="all">All Categories</option>
                  <option value="Feedback">App Feedback & Rating</option>
                  <option value="Prediction">Crop Yield Prediction</option>
                  <option value="Recommendation">Crop Recommendation</option>
                  <option value="Soil">Soil & Fertilizer</option>
                  <option value="Weather">Weather & Climate Service</option>
                  <option value="PDF">PDF Reports</option>
                  <option value="General">General Inquiry</option>
                </select>
              </div>
            </div>

            {/* TICKETS & FEEDBACK LIST */}
            <div className="divide-y divide-[#EEF2EC]">
              {filteredTickets.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs">
                  No farmer inquiries or feedback matching current filter.
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
                            {isFeedback ? "⭐ " + (ticket.category || "App Feedback") : "🌾 " + (ticket.category || "General Query")}
                          </span>

                          {ticket.rating && (
                            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold pl-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              <div className="flex items-center">
                                {[...Array(Number(ticket.rating) || 5)].map((_, i) => (
                                  <Star key={i} size={11} fill="currentColor" />
                                ))}
                              </div>
                              <span className="text-[10px] text-amber-800 font-extrabold">
                                {ticket.rating}/5 Stars
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
                            {isResolved ? "✅ Resolved" : isUnderReview ? "🔍 Under Review" : "⏳ Submitted"}
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
                          {ticket.subject || "Farmer Inquiry"}
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed bg-[#F8FAF7] p-3 rounded-xl border border-[#E2EAE0]">
                          "{ticket.message}"
                        </p>
                      </div>

                      {/* SENDER DETAILS & OFFICIAL REPLY */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span className="font-bold text-gray-800 flex items-center gap-1">
                            👤 {ticket.name || ticket.user_name || "Farmer"}
                          </span>
                          <span>•</span>
                          <span className="text-gray-500">{ticket.user_email}</span>
                          <span>•</span>
                          <span className="text-[#2E7D32] font-semibold flex items-center gap-1">
                            <MapPin size={11} /> {ticket.district && ticket.district.trim() ? (tDistrict ? tDistrict(ticket.district) : ticket.district) : "Maharashtra"}
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
                            <span>{ticket.admin_reply ? "Edit Reply" : "Reply to Farmer"}</span>
                          </button>

                          {ticket.status !== "Resolved" ? (
                            <button
                              type="button"
                              onClick={() => handleTicketStatus(ticket.ticket_id, "Resolved")}
                              className="key-cap px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                            >
                              <Check size={13} className="inline mr-1" />
                              <span>Resolve</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleTicketStatus(ticket.ticket_id, "Submitted")}
                              className="key-cap px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-amber-600 cursor-pointer"
                            >
                              Reopen
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteTicket(ticket.ticket_id)}
                            className="key-cap p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                            title="Delete Inquiry"
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
                            <span>Official Administrator Response:</span>
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

      {/* TAB 4: DATABASE & INFRASTRUCTURE */}
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
                    <h3 className="text-sm font-bold text-gray-800">Database Engine Overview</h3>
                    <p className="text-[10px] text-gray-400">{dbStats?.db_file || "MySQL 127.0.0.1:3306/krushimitra"}</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5">
                  {dbStats?.db_status || "Active & Healthy"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-[#F8FAF7] p-3 border border-[#E2EAE0]">
                  <span className="text-gray-400 text-[10px] font-semibold">Active Tables:</span>
                  <p className="font-extrabold text-gray-800 mt-0.5">5 Tables (Users, Preds, Recs, Tickets, Resets)</p>
                </div>
                <div className="rounded-xl bg-[#F8FAF7] p-3 border border-[#E2EAE0]">
                  <span className="text-gray-400 text-[10px] font-semibold">Total Records:</span>
                  <p className="font-extrabold text-[#2E7D32] mt-0.5">
                    {(dbStats?.total_users || (usersList || []).length) + (dbStats?.total_predictions || predictionHistory.length) + (dbStats?.total_recommendations || recommendationHistory.length) + ticketsList.length} Entries
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
                  <span>{isOptimizing ? "Optimizing..." : "Optimize DB Tables"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportBackup}
                  disabled={isExporting}
                  className="key-cap btn-glow flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 cursor-pointer"
                >
                  <Download size={13} />
                  <span>Export JSON Dump</span>
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
                    <h3 className="text-sm font-bold text-gray-800">Live Database Tables</h3>
                    <p className="text-[10px] text-gray-400">MySQL Schema Telemetry</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5">
                  Live Counts
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-xl bg-[#F8FAF7] p-3 border border-[#E2EAE0]">
                  <span className="font-semibold text-gray-700">users</span>
                  <span className="font-extrabold text-[#2E7D32]">{dbStats?.total_users ?? (usersList || []).length} Records</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-[#F8FAF7] p-3 border border-[#E2EAE0]">
                  <span className="font-semibold text-gray-700">support_tickets</span>
                  <span className="font-extrabold text-[#2E7D32]">{ticketsList.length} Records</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-[#F8FAF7] p-3 border border-[#E2EAE0]">
                  <span className="font-semibold text-gray-700">prediction_history</span>
                  <span className="font-extrabold text-[#2E7D32]">{dbStats?.total_predictions ?? predictionHistory.length} Records</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-[#F8FAF7] p-3 border border-[#E2EAE0]">
                  <span className="font-semibold text-gray-700">recommendation_history</span>
                  <span className="font-extrabold text-[#2E7D32]">{dbStats?.total_recommendations ?? recommendationHistory.length} Records</span>
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
                <span>Create New User / Farmer Account</span>
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
                <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
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
                <label className="block font-semibold text-gray-700 mb-1">Email Address *</label>
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
                  <label className="block font-semibold text-gray-700 mb-1">Role</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3 py-2 text-xs outline-none focus:border-[#2E7D32]"
                  >
                    <option value="Farmer">Farmer</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">City / District</label>
                  <select
                    value={newUserForm.district}
                    onChange={(e) => setNewUserForm({ ...newUserForm, district: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3 py-2 text-xs outline-none focus:border-[#2E7D32]"
                  >
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2 text-xs outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Initial Password</label>
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
                  <label className="block font-semibold text-gray-700 mb-1">Farm Acreage</label>
                  <input
                    type="text"
                    value={newUserForm.farm_size}
                    onChange={(e) => setNewUserForm({ ...newUserForm, farm_size: e.target.value })}
                    placeholder="e.g. 5.0"
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3.5 py-2 text-xs outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Primary Crops</label>
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-shimmer btn-glow rounded-xl bg-[#2E7D32] px-5 py-2 font-bold text-white shadow-xs hover:bg-[#1B5E20] cursor-pointer"
                >
                  Create User
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
                <span>Edit Farmer / User Profile (#{editUserDetail.id})</span>
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
                  <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editUserDetail.name || ""}
                    onChange={(e) => setEditUserDetail({ ...editUserDetail, name: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3 py-2 text-xs outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
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
                  <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editUserDetail.phone || ""}
                    onChange={(e) => setEditUserDetail({ ...editUserDetail, phone: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3 py-2 text-xs outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">City / District</label>
                  <select
                    value={editUserDetail.district || "Pune"}
                    onChange={(e) => setEditUserDetail({ ...editUserDetail, district: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3 py-2 text-xs outline-none focus:border-[#2E7D32]"
                  >
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Assigned Role</label>
                  <select
                    value={editUserDetail.role || "Farmer"}
                    onChange={(e) => setEditUserDetail({ ...editUserDetail, role: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3 py-2 text-xs outline-none focus:border-[#2E7D32]"
                  >
                    <option value="Farmer">Farmer</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Kisan Card ID</label>
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
                  <label className="block font-semibold text-gray-700 mb-1">Farm Acreage</label>
                  <input
                    type="text"
                    value={editUserDetail.farm_size || editUserDetail.farmSize || ""}
                    onChange={(e) => setEditUserDetail({ ...editUserDetail, farm_size: e.target.value, farmSize: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3 py-2 text-xs outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Primary Crops</label>
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-shimmer btn-glow rounded-xl bg-[#2E7D32] px-5 py-2 font-bold text-white shadow-xs hover:bg-[#1B5E20] cursor-pointer"
                >
                  Save Changes
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
                  <span className="text-gray-400 text-[10px] font-semibold">User ID & Role:</span>
                  <p className="font-extrabold text-[#2E7D32] mt-0.5">#{viewUserDetail.id} • {viewUserDetail.role}</p>
                </div>
                <div className="rounded-xl bg-[#F8FAF7] p-3 border border-[#E2EAE0]">
                  <span className="text-gray-400 text-[10px] font-semibold">Kisan Card / PM-Kisan ID:</span>
                  <p className="font-extrabold text-gray-800 mt-0.5">{viewUserDetail.kisan_id || viewUserDetail.kisanId || "—"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-[#F8FAF7] p-3 border border-[#E2EAE0]">
                  <span className="text-gray-400 text-[10px] font-semibold">Contact Phone:</span>
                  <p className="font-bold text-gray-800 mt-0.5">{viewUserDetail.phone && viewUserDetail.phone.trim() ? viewUserDetail.phone : "—"}</p>
                </div>
                <div className="rounded-xl bg-[#F8FAF7] p-3 border border-[#E2EAE0]">
                  <span className="text-gray-400 text-[10px] font-semibold">City / District:</span>
                  <p className="font-bold text-gray-800 mt-0.5">{viewUserDetail.district && viewUserDetail.district.trim() ? viewUserDetail.district : "—"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-[#F8FAF7] p-3 border border-[#E2EAE0]">
                  <span className="text-gray-400 text-[10px] font-semibold">Farm Acreage & Unit:</span>
                  <p className="font-bold text-gray-800 mt-0.5">
                    {viewUserDetail.farm_size || viewUserDetail.farmSize ? `${viewUserDetail.farm_size || viewUserDetail.farmSize} ${viewUserDetail.farm_unit || viewUserDetail.farmUnit || "Acres"}` : "—"}
                  </p>
                </div>
                <div className="rounded-xl bg-[#F8FAF7] p-3 border border-[#E2EAE0]">
                  <span className="text-gray-400 text-[10px] font-semibold">Primary Crops:</span>
                  <p className="font-bold text-gray-800 mt-0.5 truncate">{viewUserDetail.primary_crops || viewUserDetail.primaryCrops || "—"}</p>
                </div>
              </div>

              <div className="rounded-xl bg-[#F8FAF7] p-3 border border-[#E2EAE0]">
                <span className="text-gray-400 text-[10px] font-semibold">Soil Type & Irrigation:</span>
                <p className="font-semibold text-gray-700 mt-0.5">
                  {viewUserDetail.soil_type || viewUserDetail.soilType ? (viewUserDetail.soil_type || viewUserDetail.soilType) : "—"} {viewUserDetail.irrigation_type || viewUserDetail.irrigationType ? `• ${viewUserDetail.irrigation_type || viewUserDetail.irrigationType}` : ""}
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] p-4 text-white">
                <p className="text-[11px] text-green-100 font-medium">Activity Records for {viewUserDetail.name}</p>
                <div className="mt-2 flex justify-between text-xs font-semibold">
                  <span>Predictions: <strong>{predictionHistory.filter(p => p.user_email?.toLowerCase() === viewUserDetail.email?.toLowerCase()).length}</strong></span>
                  <span>Soil Advisories: <strong>{recommendationHistory.filter(r => r.user_email?.toLowerCase() === viewUserDetail.email?.toLowerCase()).length}</strong></span>
                  <span>Member Since: <strong>{viewUserDetail.member_since || viewUserDetail.memberSince || "—"}</strong></span>
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
                Edit User Profile
              </button>
              <button
                type="button"
                onClick={() => setViewUserDetail(null)}
                className="btn-shimmer btn-glow rounded-xl bg-[#2E7D32] px-5 py-2 text-xs font-bold text-white cursor-pointer"
              >
                Close
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
                  Reply to Farmer Inquiry ({replyTicketModal.ticket_id})
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
                <span>From: {replyTicketModal.name || "Farmer"} ({replyTicketModal.district && replyTicketModal.district.trim() ? (tDistrict ? tDistrict(replyTicketModal.district) : replyTicketModal.district) : "Maharashtra"})</span>
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
                    {replyTicketModal.category || "Inquiry"}
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
                  Official Agronomist / Administrator Response *
                </label>
                <textarea
                  rows={4}
                  required
                  value={adminReplyText}
                  onChange={(e) => setAdminReplyText(e.target.value)}
                  placeholder="Type your official advisory or resolution note to the farmer..."
                  className="w-full rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] p-3 text-xs outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Update Inquiry Status</label>
                  <select
                    value={replyStatus}
                    onChange={(e) => setReplyStatus(e.target.value)}
                    className="rounded-xl border border-[#DCE8D9] bg-[#FBFDFB] px-3 py-1.5 text-xs font-bold text-gray-700 outline-none focus:border-[#2E7D32]"
                  >
                    <option value="Resolved">Mark as Resolved</option>
                    <option value="Under Review">Keep Under Review</option>
                    <option value="Submitted">Keep Open</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setReplyTicketModal(null)}
                    className="rounded-xl border border-gray-300 px-4 py-2 font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-shimmer btn-glow flex items-center gap-1.5 rounded-xl bg-[#2E7D32] px-5 py-2 font-bold text-white shadow-xs hover:bg-[#1B5E20] cursor-pointer"
                  >
                    <Send size={13} />
                    <span>Send & Save Response</span>
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