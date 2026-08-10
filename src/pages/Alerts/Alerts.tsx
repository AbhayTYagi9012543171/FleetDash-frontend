import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { ReactNode } from "react";

import {
  FiAlertCircle,
  FiAlertTriangle,
  FiBell,
  FiCalendar,
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiFilter,
  FiMapPin,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiTrash2,
  FiTruck,
  FiUser,
  FiX,
  FiXCircle,
  FiEye,
} from "react-icons/fi";

import { api } from "../../services/api";

// ======================================================
// TYPES
// ======================================================

type Severity = "Critical" | "High" | "Medium" | "Low";

type AlertStatus = "Active" | "Pending" | "Resolved";

type SeverityFilter = "All" | Severity;

type StatusFilter = "All" | AlertStatus;

type SortOrder = "newest" | "oldest";

interface Alert {
  _id: string;
  alertType: string;
  severity: Severity | string;
  message: string;
  location?: string;
  status: AlertStatus | string;
  createdAt: string;
  vehicleId?: string;
  driverId?: string;
}

// ======================================================
// FALLBACK DATA
// ======================================================

const fallbackAlerts: Alert[] = [
  {
    _id: "fallback-1",
    alertType: "Engine Temperature",
    severity: "Critical",
    message:
      "Vehicle engine temperature is above the recommended operating range.",
    location: "Delhi - Meerut Expressway",
    status: "Active",
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    vehicleId: "VH-1024",
    driverId: "DRV-201",
  },
  {
    _id: "fallback-2",
    alertType: "Speed Violation",
    severity: "High",
    message:
      "Vehicle exceeded the configured speed limit for the monitored route.",
    location: "NH-24, Ghaziabad",
    status: "Pending",
    createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    vehicleId: "VH-1008",
    driverId: "DRV-108",
  },
  {
    _id: "fallback-3",
    alertType: "Fuel Level",
    severity: "Medium",
    message:
      "Fuel level has dropped below the configured fleet monitoring threshold.",
    location: "Noida Sector 62",
    status: "Pending",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    vehicleId: "VH-1015",
    driverId: "DRV-116",
  },
  {
    _id: "fallback-4",
    alertType: "Maintenance Completed",
    severity: "Low",
    message:
      "Scheduled maintenance has been completed successfully.",
    location: "Fleet Service Center",
    status: "Resolved",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    vehicleId: "VH-1003",
    driverId: "DRV-104",
  },
];

// ======================================================
// CONFIG
// ======================================================

const severityConfig = {
  Critical: {
    border: "border-l-red-500",
    icon: "bg-red-50 text-red-600 border-red-100",
    badge: "bg-red-50 text-red-600 border-red-100",
    dot: "bg-red-500",
    value: "text-red-600",
    soft: "bg-red-50",
    priority: 4,
  },

  High: {
    border: "border-l-orange-500",
    icon: "bg-orange-50 text-orange-600 border-orange-100",
    badge: "bg-orange-50 text-orange-600 border-orange-100",
    dot: "bg-orange-500",
    value: "text-orange-600",
    soft: "bg-orange-50",
    priority: 3,
  },

  Medium: {
    border: "border-l-yellow-500",
    icon: "bg-yellow-50 text-yellow-600 border-yellow-100",
    badge: "bg-yellow-50 text-yellow-600 border-yellow-100",
    dot: "bg-yellow-500",
    value: "text-yellow-600",
    soft: "bg-yellow-50",
    priority: 2,
  },

  Low: {
    border: "border-l-green-500",
    icon: "bg-green-50 text-green-600 border-green-100",
    badge: "bg-green-50 text-green-600 border-green-100",
    dot: "bg-green-500",
    value: "text-green-600",
    soft: "bg-green-50",
    priority: 1,
  },
} as const;

// ======================================================
// HELPERS
// ======================================================

const normalize = (value?: string) =>
  value?.toLowerCase().trim() || "";

const formatDate = (value?: string) => {
  if (!value) return "--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "--";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value?: string) => {
  if (!value) return "--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "--";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getSeverity = (severity?: string) => {
  const key = Object.keys(severityConfig).find(
    (item) =>
      normalize(item) === normalize(severity)
  );

  return (
    severityConfig[
      key as keyof typeof severityConfig
    ] ?? severityConfig.Low
  );
};

const getStatusClass = (status?: string) => {
  switch (normalize(status)) {
    case "active":
      return "bg-red-50 text-red-600 border-red-100";

    case "pending":
      return "bg-yellow-50 text-yellow-600 border-yellow-100";

    case "resolved":
      return "bg-green-50 text-green-600 border-green-100";

    default:
      return "bg-slate-50 text-slate-600 border-slate-100";
  }
};

// ======================================================
// COMPONENT
// ======================================================

const Alerts = () => {
  // ====================================================
  // STATE
  // ====================================================

  const [alerts, setAlerts] = useState<Alert[]>([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [usingFallback, setUsingFallback] = useState(false);

  const [search, setSearch] = useState("");

  const [severityFilter, setSeverityFilter] =
    useState<SeverityFilter>("All");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All");

  const [sortOrder, setSortOrder] =
    useState<SortOrder>("newest");

  const [showFilters, setShowFilters] =
    useState(false);

  const [selectedAlert, setSelectedAlert] =
    useState<Alert | null>(null);

  const [actionLoading, setActionLoading] =
    useState<string | null>(null);

  const [toast, setToast] = useState("");

  // ====================================================
  // TOAST
  // ====================================================

  const showToast = (message: string) => {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 3000);
  };

  // ====================================================
  // FETCH ALERTS
  // ====================================================

  const fetchAlerts = useCallback(async () => {
    try {
      setError("");

      const response = await api.get("/alerts");

      const data =
        response?.data?.alerts ??
        response?.data?.data ??
        response?.data ??
        [];

      if (Array.isArray(data)) {
        setAlerts(data);
        setUsingFallback(false);
      } else {
        setAlerts(fallbackAlerts);
        setUsingFallback(true);
      }
    } catch (err) {
      console.error("Alert Fetch Error:", err);

      setAlerts(fallbackAlerts);
      setUsingFallback(true);

      setError(
        "Live alert service is unavailable. Showing fallback data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ====================================================
  // INITIAL LOAD + AUTO REFRESH
  // ====================================================

  useEffect(() => {
    fetchAlerts();

    const timer = window.setInterval(
      fetchAlerts,
      15000
    );

    return () => {
      window.clearInterval(timer);
    };
  }, [fetchAlerts]);

  // ====================================================
  // MANUAL REFRESH
  // ====================================================

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchAlerts();
      showToast("Alerts refreshed successfully.");
    } finally {
      setRefreshing(false);
    }
  };

  // ====================================================
  // MARK RESOLVED
  // ====================================================

  const handleResolve = async (alert: Alert) => {
    if (alert.status === "Resolved") return;

    try {
      setActionLoading(alert._id);

      if (!alert._id.startsWith("fallback-")) {
        await api.patch(
          `/alerts/${alert._id}/status`,
          {
            status: "Resolved",
          }
        );
      }

      setAlerts((previous) =>
        previous.map((item) =>
          item._id === alert._id
            ? {
                ...item,
                status: "Resolved",
              }
            : item
        )
      );

      if (
        selectedAlert?._id === alert._id
      ) {
        setSelectedAlert({
          ...alert,
          status: "Resolved",
        });
      }

      showToast("Alert marked as resolved.");
    } catch (err) {
      console.error(
        "Resolve Alert Error:",
        err
      );

      showToast(
        "Unable to resolve this alert."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ====================================================
  // DELETE ALERT
  // ====================================================

  const handleDelete = async (alert: Alert) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this alert?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(alert._id);

      if (!alert._id.startsWith("fallback-")) {
        await api.delete(
          `/alerts/${alert._id}`
        );
      }

      setAlerts((previous) =>
        previous.filter(
          (item) =>
            item._id !== alert._id
        )
      );

      if (
        selectedAlert?._id === alert._id
      ) {
        setSelectedAlert(null);
      }

      showToast("Alert deleted successfully.");
    } catch (err) {
      console.error(
        "Delete Alert Error:",
        err
      );

      showToast(
        "Unable to delete this alert."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ====================================================
  // STATISTICS
  // ====================================================

  const statistics = useMemo(() => {
    const countSeverity = (
      value: string
    ) =>
      alerts.filter(
        (alert) =>
          normalize(alert.severity) ===
          normalize(value)
      ).length;

    const countStatus = (
      value: string
    ) =>
      alerts.filter(
        (alert) =>
          normalize(alert.status) ===
          normalize(value)
      ).length;

    const resolved =
      countStatus("Resolved");

    const resolutionRate = alerts.length
      ? (
          (resolved / alerts.length) *
          100
        ).toFixed(1)
      : "0";

    return {
      total: alerts.length,

      critical:
        countSeverity("Critical"),

      high:
        countSeverity("High"),

      medium:
        countSeverity("Medium"),

      low:
        countSeverity("Low"),

      active:
        countStatus("Active"),

      pending:
        countStatus("Pending"),

      resolved,

      resolutionRate,
    };
  }, [alerts]);

  // ====================================================
  // FILTER + SORT
  // ====================================================

  const filteredAlerts = useMemo(() => {
    const result = alerts.filter(
      (alert) => {
        const searchText =
          normalize(search);

        const matchesSearch =
          !searchText ||
          normalize(
            alert.alertType
          ).includes(searchText) ||
          normalize(
            alert.message
          ).includes(searchText) ||
          normalize(
            alert.location
          ).includes(searchText) ||
          normalize(
            alert.severity
          ).includes(searchText) ||
          normalize(
            alert.status
          ).includes(searchText) ||
          normalize(
            alert.vehicleId
          ).includes(searchText) ||
          normalize(
            alert.driverId
          ).includes(searchText);

        const matchesSeverity =
          severityFilter === "All" ||
          normalize(alert.severity) ===
            normalize(severityFilter);

        const matchesStatus =
          statusFilter === "All" ||
          normalize(alert.status) ===
            normalize(statusFilter);

        return (
          matchesSearch &&
          matchesSeverity &&
          matchesStatus
        );
      }
    );

    return result.sort((a, b) => {
      const first = new Date(
        a.createdAt
      ).getTime();

      const second = new Date(
        b.createdAt
      ).getTime();

      return sortOrder === "newest"
        ? second - first
        : first - second;
    });
  }, [
    alerts,
    search,
    severityFilter,
    statusFilter,
    sortOrder,
  ]);

  // ====================================================
  // CLEAR FILTERS
  // ====================================================

  const clearFilters = () => {
    setSearch("");
    setSeverityFilter("All");
    setStatusFilter("All");
    setSortOrder("newest");
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8 animate-pulse">
        <div className="h-36 rounded-3xl bg-slate-100" />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-36 rounded-2xl bg-slate-100"
              />
            )
          )}
        </div>

        <div className="h-32 rounded-2xl bg-slate-100" />

        <div className="h-96 rounded-2xl bg-slate-100" />
      </div>
    );
  }

  // ====================================================
  // STAT CARD
  // ====================================================

  const StatCard = ({
    title,
    value,
    description,
    icon,
    iconClass,
    valueClass,
  }: {
    title: string;
    value: number | string;
    description: string;
    icon: ReactNode;
    iconClass: string;
    valueClass: string;
  }) => (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p
            className={`mt-2 text-3xl font-bold ${valueClass}`}
          >
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );

  // ====================================================
  // MAIN UI
  // ====================================================

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">

      {/* ==================================================
          TOAST
      ================================================== */}

      {toast && (
        <div className="fixed right-5 top-5 z-[100] flex items-center gap-3 rounded-xl border border-green-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-xl">
          <FiCheckCircle className="text-green-600" />
          {toast}
        </div>
      )}

      {/* ==================================================
          HEADER
      ================================================== */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white sm:p-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                <FiAlertTriangle size={28} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">

                  <h1 className="text-2xl font-bold sm:text-3xl">
                    Fleet Alerts
                  </h1>

                  <span className="rounded-full bg-green-400/10 px-3 py-1 text-xs font-semibold text-green-300 ring-1 ring-green-400/20">
                    Live Monitoring
                  </span>

                </div>

                <p className="mt-2 max-w-2xl text-sm text-slate-300">
                  Monitor operational warnings, critical
                  events, vehicle issues and fleet health
                  in real time.
                </p>
              </div>

            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiRefreshCw
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh Alerts"}
            </button>

          </div>

        </div>

        {/* ==================================================
            SEARCH
        ================================================== */}

        <div className="p-5 sm:p-6">

          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">

              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search alerts, vehicle, driver, location..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />

              {search && (
                <button
                  onClick={() =>
                    setSearch("")
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <FiX />
                </button>
              )}

            </div>

            <button
              onClick={() =>
                setShowFilters(
                  !showFilters
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <FiFilter />

              Filters

              <FiChevronDown
                className={`transition-transform ${
                  showFilters
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

          </div>

          {/* FILTERS */}

          {showFilters && (
            <div className="mt-5 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-3">

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Severity
                </label>

                <select
                  value={
                    severityFilter
                  }
                  onChange={(e) =>
                    setSeverityFilter(
                      e.target
                        .value as SeverityFilter
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-400"
                >
                  <option>All</option>
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </label>

                <select
                  value={
                    statusFilter
                  }
                  onChange={(e) =>
                    setStatusFilter(
                      e.target
                        .value as StatusFilter
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-400"
                >
                  <option>All</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Resolved</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Sort
                </label>

                <select
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(
                      e.target
                        .value as SortOrder
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-400"
                >
                  <option value="newest">
                    Newest First
                  </option>

                  <option value="oldest">
                    Oldest First
                  </option>
                </select>
              </div>

              <button
                onClick={clearFilters}
                className="text-left text-sm font-semibold text-blue-600 hover:text-blue-700 md:col-span-3"
              >
                Clear all filters
              </button>

            </div>
          )}

        </div>
      </section>

      {/* ==================================================
          API FALLBACK NOTICE
      ================================================== */}

      {usingFallback && (
        <div className="flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          <FiAlertCircle className="shrink-0" />

          <span>
            Live API data is unavailable.
            Showing demo fallback alerts.
          </span>
        </div>
      )}

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && !usingFallback && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4">

          <div className="flex items-center gap-3">

            <FiXCircle className="text-red-600" />

            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

          </div>

          <button
            onClick={handleRefresh}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Retry
          </button>

        </div>
      )}

      {/* ==================================================
          STATS
      ================================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Alerts"
          value={statistics.total}
          description="All fleet notifications"
          icon={<FiBell size={22} />}
          iconClass="bg-blue-50 text-blue-600 border-blue-100"
          valueClass="text-slate-900"
        />

        <StatCard
          title="Critical"
          value={statistics.critical}
          description="Immediate attention required"
          icon={<FiAlertTriangle size={22} />}
          iconClass="bg-red-50 text-red-600 border-red-100"
          valueClass="text-red-600"
        />

        <StatCard
          title="Active"
          value={statistics.active}
          description="Currently unresolved"
          icon={<FiAlertCircle size={22} />}
          iconClass="bg-orange-50 text-orange-600 border-orange-100"
          valueClass="text-orange-600"
        />

        <StatCard
          title="Resolution Rate"
          value={`${statistics.resolutionRate}%`}
          description={`${statistics.resolved} alerts resolved`}
          icon={<FiCheckCircle size={22} />}
          iconClass="bg-green-50 text-green-600 border-green-100"
          valueClass="text-green-600"
        />

      </div>

      {/* ==================================================
          HEALTH OVERVIEW
      ================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Alert Health
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current distribution of fleet alerts
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
            <FiShield />
            Fleet Monitoring Active
          </div>

        </div>

        {/* Progress */}

        <div className="mt-6">

          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Resolution Progress</span>

            <span>
              {statistics.resolutionRate}%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-green-500 transition-all duration-500"
              style={{
                width: `${statistics.resolutionRate}%`,
              }}
            />

          </div>

        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">

          {[
            {
              label: "Critical",
              value: statistics.critical,
              className:
                "text-red-600 bg-red-50",
            },
            {
              label: "High",
              value: statistics.high,
              className:
                "text-orange-600 bg-orange-50",
            },
            {
              label: "Medium",
              value: statistics.medium,
              className:
                "text-yellow-600 bg-yellow-50",
            },
            {
              label: "Pending",
              value: statistics.pending,
              className:
                "text-blue-600 bg-blue-50",
            },
            {
              label: "Resolved",
              value: statistics.resolved,
              className:
                "text-green-600 bg-green-50",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-xl p-4 ${item.className}`}
            >
              <p className="text-xs font-semibold">
                {item.label}
              </p>

              <p className="mt-1 text-2xl font-bold">
                {item.value}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* ==================================================
          ALERT ACTIVITY
      ================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Alert Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredAlerts.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {alerts.length}
              </span>{" "}
              alerts
            </p>
          </div>

          {(search ||
            severityFilter !== "All" ||
            statusFilter !== "All") && (
            <button
              onClick={clearFilters}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Clear Filters
            </button>
          )}

        </div>

        {/* EMPTY */}

        {filteredAlerts.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
              <FiCheckCircle size={36} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No Alerts Found
            </h3>

            <p className="mt-2 max-w-md text-sm text-slate-500">
              No fleet alerts match your current search
              and filter criteria.
            </p>

            <button
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Clear Filters
            </button>

          </div>
        ) : (

          <div className="divide-y divide-slate-100">

            {filteredAlerts.map(
              (alert) => {

                const severity =
                  getSeverity(
                    alert.severity
                  );

                const isActionLoading =
                  actionLoading ===
                  alert._id;

                return (
                  <article
                    key={alert._id}
                    className={`border-l-4 ${severity.border} p-5 transition hover:bg-slate-50`}
                  >

                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                      {/* LEFT */}

                      <div className="flex min-w-0 gap-4">

                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${severity.icon}`}
                        >
                          <FiAlertTriangle size={21} />
                        </div>

                        <div className="min-w-0 flex-1">

                          {/* TITLE */}

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="font-bold text-slate-900">
                              {alert.alertType ||
                                "Fleet Alert"}
                            </h3>

                            <span
                              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${severity.badge}`}
                            >
                              {alert.severity}
                            </span>

                            <span
                              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getStatusClass(
                                alert.status
                              )}`}
                            >
                              {alert.status}
                            </span>

                          </div>

                          {/* MESSAGE */}

                          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                            {alert.message}
                          </p>

                          {/* META */}

                          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">

                            <span className="inline-flex items-center gap-1.5">
                              <FiMapPin />
                              {alert.location ||
                                "Unknown location"}
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                              <FiCalendar />
                              {formatDate(
                                alert.createdAt
                              )}
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                              <FiClock />
                              {formatTime(
                                alert.createdAt
                              )}
                            </span>

                            {alert.vehicleId && (
                              <span className="inline-flex items-center gap-1.5">
                                <FiTruck />
                                {alert.vehicleId}
                              </span>
                            )}

                            {alert.driverId && (
                              <span className="inline-flex items-center gap-1.5">
                                <FiUser />
                                {alert.driverId}
                              </span>
                            )}

                          </div>

                        </div>

                      </div>

                      {/* RIGHT */}

                      <div className="flex flex-col gap-3 xl:min-w-[230px] xl:items-end">

                        {/* PRIORITY */}

                        <div className="flex items-center gap-1">

                          <span className="mr-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Priority
                          </span>

                          {Array.from({
                            length:
                              severity.priority,
                          }).map(
                            (_, index) => (
                              <span
                                key={index}
                                className={`h-2.5 w-2.5 rounded-full ${severity.dot}`}
                              />
                            )
                          )}

                        </div>

                        {/* ACTIONS */}

                        <div className="flex flex-wrap gap-2">

                          <button
                            onClick={() =>
                              setSelectedAlert(
                                alert
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                          >
                            <FiEye />
                            View
                          </button>

                          {normalize(
                            alert.status
                          ) !== "resolved" && (
                            <button
                              onClick={() =>
                                handleResolve(
                                  alert
                                )
                              }
                              disabled={
                                isActionLoading
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                            >
                              <FiCheck />

                              {isActionLoading
                                ? "..."
                                : "Resolve"}
                            </button>
                          )}

                          <button
                            onClick={() =>
                              handleDelete(
                                alert
                              )
                            }
                            disabled={
                              isActionLoading
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                          >
                            <FiTrash2 />
                            Delete
                          </button>

                        </div>

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

      </section>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">

        <span className="inline-flex items-center gap-2">
          <FiRefreshCw
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          Live monitoring active
        </span>

        <span>
          Auto refresh every 15 seconds
        </span>

      </footer>

      {/* ==================================================
          DETAILS MODAL
      ================================================== */}

      {selectedAlert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={() =>
            setSelectedAlert(null)
          }
        >

          <div
            className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 p-5">

              <div className="flex items-center gap-3">

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                    getSeverity(
                      selectedAlert.severity
                    ).icon
                  }`}
                >
                  <FiAlertTriangle />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Alert Details
                  </h2>

                  <p className="text-xs text-slate-500">
                    {selectedAlert.alertType}
                  </p>
                </div>

              </div>

              <button
                onClick={() =>
                  setSelectedAlert(null)
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <FiX size={20} />
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="space-y-6 p-6">

              <div className="flex flex-wrap gap-2">

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    getSeverity(
                      selectedAlert.severity
                    ).badge
                  }`}
                >
                  {selectedAlert.severity}
                </span>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                    selectedAlert.status
                  )}`}
                >
                  {selectedAlert.status}
                </span>

              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Message
                </p>

                <p className="mt-2 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {selectedAlert.message}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <FiMapPin />
                    Location
                  </div>

                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {selectedAlert.location ||
                      "Unknown"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <FiCalendar />
                    Date & Time
                  </div>

                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {formatDate(
                      selectedAlert.createdAt
                    )}{" "}
                    •{" "}
                    {formatTime(
                      selectedAlert.createdAt
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <FiTruck />
                    Vehicle
                  </div>

                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {selectedAlert.vehicleId ||
                      "Not assigned"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <FiUser />
                    Driver
                  </div>

                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {selectedAlert.driverId ||
                      "Not assigned"}
                  </p>
                </div>

              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 p-5 sm:flex-row sm:justify-end">

              <button
                onClick={() =>
                  handleDelete(
                    selectedAlert
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-100"
              >
                <FiTrash2 />
                Delete Alert
              </button>

              {normalize(
                selectedAlert.status
              ) !== "resolved" && (
                <button
                  onClick={() =>
                    handleResolve(
                      selectedAlert
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
                >
                  <FiCheck />
                  Mark Resolved
                </button>
              )}

              <button
                onClick={() =>
                  setSelectedAlert(null)
                }
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Alerts;