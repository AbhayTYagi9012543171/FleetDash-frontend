import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { ReactNode } from "react";

import {
  FiAlertTriangle,
  FiRefreshCw,
  FiMapPin,
  FiClock,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiActivity,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiBell,
  FiCalendar,
} from "react-icons/fi";

import { api } from "../../services/api";

// ======================================================
// TYPES
// ======================================================

interface Alert {
  _id: string;
  alertType: string;
  severity: string;
  message: string;
  location?: string;
  status: string;
  createdAt: string;
}

type SeverityFilter =
  | "All"
  | "Critical"
  | "High"
  | "Medium"
  | "Low";

type StatusFilter =
  | "All"
  | "Active"
  | "Pending"
  | "Resolved";

type SortOrder =
  | "newest"
  | "oldest";

// ======================================================
// HELPERS
// ======================================================

const normalize = (value?: string): string =>
  value?.toLowerCase().trim() || "";

const formatDate = (value?: string): string => {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value?: string): string => {
  if (!value) {
    return "--";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ======================================================
// COMPONENT
// ======================================================

const Alerts = () => {
  // ====================================================
  // STATE
  // ====================================================

  const [alerts, setAlerts] =
    useState<Alert[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [severityFilter, setSeverityFilter] =
    useState<SeverityFilter>("All");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All");

  const [sortOrder, setSortOrder] =
    useState<SortOrder>("newest");

  const [showFilters, setShowFilters] =
    useState(false);

  // ====================================================
  // FETCH ALERTS
  // ====================================================

  const fetchAlerts = async () => {
    try {
      setError("");

      const response =
        await api.get("/alerts");

      console.log(
        "Alerts API:",
        response.data
      );

      const result =
        response?.data?.alerts ??
        response?.data?.data ??
        response?.data ??
        [];

      if (Array.isArray(result)) {
        setAlerts(result);
      } else {
        setAlerts([]);
      }
    } catch (err) {
      console.error(
        "Alerts Error:",
        err
      );

      setError(
        "Unable to load fleet alerts."
      );
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // INITIAL LOAD + AUTO REFRESH
  // ====================================================

  useEffect(() => {
    fetchAlerts();

    const interval =
      window.setInterval(
        fetchAlerts,
        15000
      );

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  // ====================================================
  // REFRESH
  // ====================================================

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      await fetchAlerts();
    } finally {
      setRefreshing(false);
    }
  };

  // ====================================================
  // STATISTICS
  // ====================================================

  const statistics = useMemo(() => {
    const critical =
      alerts.filter(
        (alert) =>
          normalize(alert.severity) ===
          "critical"
      ).length;

    const high =
      alerts.filter(
        (alert) =>
          normalize(alert.severity) ===
          "high"
      ).length;

    const medium =
      alerts.filter(
        (alert) =>
          normalize(alert.severity) ===
          "medium"
      ).length;

    const low =
      alerts.filter(
        (alert) =>
          normalize(alert.severity) ===
          "low"
      ).length;

    const pending =
      alerts.filter(
        (alert) =>
          normalize(alert.status) ===
          "pending"
      ).length;

    const active =
      alerts.filter(
        (alert) =>
          normalize(alert.status) ===
          "active"
      ).length;

    const resolved =
      alerts.filter(
        (alert) =>
          normalize(alert.status) ===
          "resolved"
      ).length;

    return {
      total: alerts.length,
      critical,
      high,
      medium,
      low,
      pending,
      active,
      resolved,
    };
  }, [alerts]);

  // ====================================================
  // FILTERED ALERTS
  // ====================================================

  const filteredAlerts = useMemo(() => {
    const result = alerts.filter(
      (alert) => {
        const searchValue =
          normalize(search);

        const matchesSearch =
          !searchValue ||
          normalize(
            alert.alertType
          ).includes(searchValue) ||
          normalize(
            alert.message
          ).includes(searchValue) ||
          normalize(
            alert.location
          ).includes(searchValue) ||
          normalize(
            alert.severity
          ).includes(searchValue) ||
          normalize(
            alert.status
          ).includes(searchValue);

        const matchesSeverity =
          severityFilter === "All" ||
          normalize(
            alert.severity
          ) ===
            normalize(
              severityFilter
            );

        const matchesStatus =
          statusFilter === "All" ||
          normalize(
            alert.status
          ) ===
            normalize(statusFilter);

        return (
          matchesSearch &&
          matchesSeverity &&
          matchesStatus
        );
      }
    );

    result.sort((a, b) => {
      const first =
        new Date(
          a.createdAt
        ).getTime();

      const second =
        new Date(
          b.createdAt
        ).getTime();

      return sortOrder === "newest"
        ? second - first
        : first - second;
    });

    return result;
  }, [
    alerts,
    search,
    severityFilter,
    statusFilter,
    sortOrder,
  ]);

  // ====================================================
  // SEVERITY STYLE
  // ====================================================

  const getSeverityStyle = (
    severity?: string
  ) => {
    switch (normalize(severity)) {
      case "critical":
        return {
          border:
            "border-l-red-500",
          icon:
            "bg-red-50 text-red-600 border-red-100",
          badge:
            "bg-red-50 text-red-600 border-red-100",
          text:
            "text-red-600",
          dot:
            "bg-red-500",
          count: 4,
        };

      case "high":
        return {
          border:
            "border-l-orange-500",
          icon:
            "bg-orange-50 text-orange-600 border-orange-100",
          badge:
            "bg-orange-50 text-orange-600 border-orange-100",
          text:
            "text-orange-600",
          dot:
            "bg-orange-500",
          count: 3,
        };

      case "medium":
        return {
          border:
            "border-l-yellow-500",
          icon:
            "bg-yellow-50 text-yellow-600 border-yellow-100",
          badge:
            "bg-yellow-50 text-yellow-600 border-yellow-100",
          text:
            "text-yellow-600",
          dot:
            "bg-yellow-500",
          count: 2,
        };

      case "low":
        return {
          border:
            "border-l-green-500",
          icon:
            "bg-green-50 text-green-600 border-green-100",
          badge:
            "bg-green-50 text-green-600 border-green-100",
          text:
            "text-green-600",
          dot:
            "bg-green-500",
          count: 1,
        };

      default:
        return {
          border:
            "border-l-slate-400",
          icon:
            "bg-slate-50 text-slate-600 border-slate-100",
          badge:
            "bg-slate-50 text-slate-600 border-slate-100",
          text:
            "text-slate-600",
          dot:
            "bg-slate-400",
          count: 1,
        };
    }
  };

  // ====================================================
  // STATUS STYLE
  // ====================================================

  const getStatusStyle = (
    status?: string
  ) => {
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
    value: number;
    description: string;
    icon: ReactNode;
    iconClass: string;
    valueClass: string;
  }) => (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition
        duration-200
        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-md
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p
            className={`
              mt-2
              text-3xl
              font-bold
              tracking-tight
              ${valueClass}
            `}
          >
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={`
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            ${iconClass}
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  );

  // ====================================================
  // LOADING SCREEN
  // ====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">

          <div className="animate-pulse">
            <div className="h-10 w-72 rounded-lg bg-slate-100" />

            <div className="mt-3 h-4 w-96 max-w-full rounded bg-slate-100" />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-36 animate-pulse rounded-2xl border border-slate-100 bg-slate-50"
                />
              )
            )}
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-24 animate-pulse rounded-xl bg-slate-50"
                  />
                )
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ====================================================
  // MAIN
  // ====================================================

  return (
    <div className="min-h-screen bg-white text-slate-900">

      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">

        {/* ==================================================
            HEADER
        ================================================== */}

        <section
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
            sm:p-6
          "
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-red-100
                  bg-red-50
                  text-red-600
                "
              >
                <FiAlertTriangle size={27} />
              </div>

              <div>
                <h1
                  className="
                    text-2xl
                    font-bold
                    tracking-tight
                    text-slate-900
                    sm:text-3xl
                  "
                >
                  Fleet Alerts
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Monitor critical events, operational
                  warnings and fleet notifications.
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-5
                py-3
                text-sm
                font-semibold
                text-slate-700
                shadow-sm
                transition
                hover:border-slate-300
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
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
                : "Refresh"}
            </button>

          </div>

          {/* Search + Filter */}

          <div className="mt-6 flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">

              <FiSearch
                size={19}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search alerts, messages, locations..."
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  py-3
                  pl-11
                  pr-4
                  text-sm
                  text-slate-800
                  placeholder:text-slate-400
                  outline-none
                  transition
                  focus:border-blue-400
                  focus:ring-4
                  focus:ring-blue-50
                "
              />

            </div>

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (current) => !current
                )
              }
              className={`
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                px-5
                py-3
                text-sm
                font-semibold
                transition
                ${
                  showFilters
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }
              `}
            >
              <FiFilter />

              Filters

              <FiChevronDown
                className={
                  showFilters
                    ? "rotate-180 transition"
                    : "transition"
                }
              />
            </button>

          </div>

          {/* Filters */}

          {showFilters && (
            <div
              className="
                mt-4
                grid
                grid-cols-1
                gap-4
                rounded-xl
                border
                border-slate-200
                bg-slate-50/50
                p-4
                md:grid-cols-3
              "
            >
              <div>
                <label
                  className="
                    mb-2
                    block
                    text-xs
                    font-bold
                    uppercase
                    tracking-wide
                    text-slate-500
                  "
                >
                  Severity
                </label>

                <select
                  value={severityFilter}
                  onChange={(event) =>
                    setSeverityFilter(
                      event.target.value as SeverityFilter
                    )
                  }
                  className="
                    w-full
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    text-slate-700
                    outline-none
                    focus:border-blue-400
                  "
                >
                  <option value="All">
                    All Severities
                  </option>

                  <option value="Critical">
                    Critical
                  </option>

                  <option value="High">
                    High
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="Low">
                    Low
                  </option>
                </select>
              </div>

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-xs
                    font-bold
                    uppercase
                    tracking-wide
                    text-slate-500
                  "
                >
                  Status
                </label>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value as StatusFilter
                    )
                  }
                  className="
                    w-full
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    text-slate-700
                    outline-none
                    focus:border-blue-400
                  "
                >
                  <option value="All">
                    All Statuses
                  </option>

                  <option value="Active">
                    Active
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Resolved">
                    Resolved
                  </option>
                </select>
              </div>

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-xs
                    font-bold
                    uppercase
                    tracking-wide
                    text-slate-500
                  "
                >
                  Sort
                </label>

                <select
                  value={sortOrder}
                  onChange={(event) =>
                    setSortOrder(
                      event.target.value as SortOrder
                    )
                  }
                  className="
                    w-full
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    text-slate-700
                    outline-none
                    focus:border-blue-400
                  "
                >
                  <option value="newest">
                    Newest First
                  </option>

                  <option value="oldest">
                    Oldest First
                  </option>
                </select>
              </div>
            </div>
          )}
        </section>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div
            className="
              rounded-2xl
              border
              border-red-200
              bg-red-50
              p-5
            "
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-red-600
                  "
                >
                  <FiXCircle />
                </div>

                <div>
                  <p className="font-bold text-red-800">
                    Alert service unavailable
                  </p>

                  <p className="mt-1 text-sm text-red-600">
                    {error}
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={handleRefresh}
                className="
                  rounded-lg
                  bg-red-600
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-red-700
                "
              >
                Retry
              </button>

            </div>
          </div>
        )}

        {/* ==================================================
            STATISTICS
        ================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          <StatCard
            title="Total Alerts"
            value={statistics.total}
            description="All recorded fleet alerts"
            icon={<FiBell size={23} />}
            iconClass="bg-blue-50 text-blue-600 border-blue-100"
            valueClass="text-slate-900"
          />

          <StatCard
            title="Critical"
            value={statistics.critical}
            description="Immediate attention required"
            icon={
              <FiAlertTriangle size={23} />
            }
            iconClass="bg-red-50 text-red-600 border-red-100"
            valueClass="text-red-600"
          />

          <StatCard
            title="High Priority"
            value={statistics.high}
            description="High-risk operational alerts"
            icon={
              <FiAlertCircle size={23} />
            }
            iconClass="bg-orange-50 text-orange-600 border-orange-100"
            valueClass="text-orange-600"
          />

          <StatCard
            title="Pending"
            value={statistics.pending}
            description="Waiting for resolution"
            icon={<FiClock size={23} />}
            iconClass="bg-yellow-50 text-yellow-600 border-yellow-100"
            valueClass="text-yellow-600"
          />
        </div>

        {/* ==================================================
            HEALTH
        ================================================== */}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

          <section
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
              lg:col-span-2
            "
          >
            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Alert Health
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Current distribution of fleet alerts.
                </p>
              </div>

              <FiActivity
                size={26}
                className="text-blue-600"
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">

              <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-600">
                  Critical
                </p>

                <p className="mt-2 text-3xl font-bold text-red-600">
                  {statistics.critical}
                </p>
              </div>

              <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                <p className="text-sm font-semibold text-orange-600">
                  High
                </p>

                <p className="mt-2 text-3xl font-bold text-orange-600">
                  {statistics.high}
                </p>
              </div>

              <div className="rounded-xl border border-yellow-100 bg-yellow-50 p-4">
                <p className="text-sm font-semibold text-yellow-600">
                  Pending
                </p>

                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  {statistics.pending}
                </p>
              </div>

              <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                <p className="text-sm font-semibold text-green-600">
                  Resolved
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {statistics.resolved}
                </p>
              </div>

            </div>
          </section>

          {/* Resolved */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
            "
          >
            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-green-100
                  bg-green-50
                  text-green-600
                "
              >
                <FiCheckCircle size={24} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Resolved Alerts
                </p>

                <p className="text-3xl font-bold text-slate-900">
                  {statistics.resolved}
                </p>
              </div>

            </div>

            <div className="mt-7 flex items-center gap-3">

              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-green-500 transition-all"
                  style={{
                    width:
                      statistics.total > 0
                        ? `${Math.min(
                            100,
                            (statistics.resolved /
                              statistics.total) *
                              100
                          )}%`
                        : "0%",
                  }}
                />

              </div>

              <span className="text-sm font-semibold text-slate-600">
                {statistics.total > 0
                  ? `${(
                      (statistics.resolved /
                        statistics.total) *
                      100
                    ).toFixed(1)}%`
                  : "0%"}
              </span>

            </div>

            <p className="mt-3 text-xs text-slate-500">
              Resolution rate
            </p>
          </section>

        </div>

        {/* ==================================================
            ALERT ACTIVITY
        ================================================== */}

        <section
          className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >

          <div
            className="
              flex
              flex-col
              gap-4
              border-b
              border-slate-200
              p-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Alert Activity
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredAlerts.length} alerts matching
                your current view.
              </p>
            </div>

            <div
              className="
                inline-flex
                items-center
                gap-2
                self-start
                rounded-full
                border
                border-blue-100
                bg-blue-50
                px-3
                py-2
                text-xs
                font-semibold
                text-blue-700
                sm:self-auto
              "
            >
              <FiActivity />

              Live Monitoring

              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            </div>
          </div>

          {/* Empty */}

          {filteredAlerts.length === 0 && (
            <div
              className="
                flex
                min-h-[360px]
                flex-col
                items-center
                justify-center
                px-6
                text-center
              "
            >
              <div
                className="
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
                  bg-green-50
                  text-green-600
                "
              >
                <FiCheckCircle size={34} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                No Alerts Found
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                No alerts match your current search and
                filter criteria.
              </p>

              {(search ||
                severityFilter !== "All" ||
                statusFilter !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSeverityFilter("All");
                    setStatusFilter("All");
                  }}
                  className="
                    mt-5
                    rounded-lg
                    bg-blue-600
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    hover:bg-blue-700
                  "
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Alert Rows */}

          {filteredAlerts.length > 0 && (
            <div className="divide-y divide-slate-100">

              {filteredAlerts.map((alert) => {
                const severity =
                  getSeverityStyle(
                    alert.severity
                  );

                return (
                  <article
                    key={alert._id}
                    className={`
                      border-l-4
                      ${severity.border}
                      p-5
                      transition
                      duration-200
                      hover:bg-slate-50
                    `}
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                      {/* Alert Info */}

                      <div className="flex min-w-0 gap-4">

                        <div
                          className={`
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            ${severity.icon}
                          `}
                        >
                          <FiAlertTriangle size={21} />
                        </div>

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="text-base font-bold text-slate-900">
                              {alert.alertType ||
                                "Fleet Alert"}
                            </h3>

                            <span
                              className={`
                                rounded-full
                                border
                                px-2.5
                                py-1
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wide
                                ${severity.badge}
                              `}
                            >
                              {alert.severity ||
                                "Unknown"}
                            </span>

                            <span
                              className={`
                                rounded-full
                                border
                                px-2.5
                                py-1
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wide
                                ${getStatusStyle(
                                  alert.status
                                )}
                              `}
                            >
                              {alert.status ||
                                "Unknown"}
                            </span>

                          </div>

                          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                            {alert.message ||
                              "No alert message available."}
                          </p>

                          <div
                            className="
                              mt-3
                              flex
                              flex-wrap
                              items-center
                              gap-x-5
                              gap-y-2
                              text-xs
                              text-slate-500
                            "
                          >

                            <span className="inline-flex items-center gap-1.5">
                              <FiMapPin />

                              {alert.location ||
                                "Location unavailable"}
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

                          </div>

                        </div>

                      </div>

                      {/* Priority */}

                      <div
                        className="
                          flex
                          shrink-0
                          items-center
                          gap-3
                          xl:flex-col
                          xl:items-end
                        "
                      >
                        <span
                          className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-slate-400
                          "
                        >
                          Priority
                        </span>

                        <div className="flex items-center gap-1.5">

                          {Array.from({
                            length: severity.count,
                          }).map(
                            (_, index) => (
                              <span
                                key={index}
                                className={`
                                  h-2.5
                                  w-2.5
                                  rounded-full
                                  ${severity.dot}
                                `}
                              />
                            )
                          )}

                          {Array.from({
                            length:
                              4 -
                              severity.count,
                          }).map(
                            (_, index) => (
                              <span
                                key={`empty-${index}`}
                                className="
                                  h-2.5
                                  w-2.5
                                  rounded-full
                                  bg-slate-200
                                "
                              />
                            )
                          )}

                        </div>
                      </div>

                    </div>
                  </article>
                );
              })}

            </div>
          )}

        </section>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer
          className="
            flex
            flex-col
            justify-between
            gap-3
            rounded-xl
            border
            border-slate-200
            bg-white
            px-5
            py-4
            text-xs
            text-slate-500
            sm:flex-row
            sm:items-center
          "
        >
          <span>
            Fleet alert monitoring is active.
          </span>

          <span className="inline-flex items-center gap-2">
            <FiRefreshCw />

            Automatically refreshed every 15 seconds.
          </span>
        </footer>

      </div>
    </div>
  );
};

export default Alerts;