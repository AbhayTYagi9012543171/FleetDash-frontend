import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiActivity,
  FiAlertTriangle,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiDownload,
  FiDroplet,
  FiFileText,
  FiRefreshCw,
  FiTruck,
  FiUsers,
  FiWifi,
  FiWifiOff,
  FiTrendingUp,
} from "react-icons/fi";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import {
  Bar,
  Doughnut,
  Line,
} from "react-chartjs-2";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  api,
} from "../../services/api";

// ======================================================
// CHART REGISTRATION
// ======================================================

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

// ======================================================
// TYPES
// ======================================================

interface AnalyticsData {
  totalVehicles: number;
  activeVehicles: number;
  idleVehicles: number;
  offlineVehicles: number;

  totalDrivers: number;

  totalAlerts: number;

  totalReports: number;

  fuelConsumed: number;

  revenue: number;

  fleetHealth: number;
}

const defaultData: AnalyticsData = {
  totalVehicles: 0,
  activeVehicles: 0,
  idleVehicles: 0,
  offlineVehicles: 0,

  totalDrivers: 0,

  totalAlerts: 0,

  totalReports: 0,

  fuelConsumed: 0,

  revenue: 0,

  fleetHealth: 0,
};

// ======================================================
// HELPERS
// ======================================================

const numberValue = (
  value: unknown
): number => {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
};

const formatNumber = (
  value: number
): string => {
  return new Intl.NumberFormat("en-IN").format(
    value
  );
};

const formatCurrency = (
  value: number
): string => {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(value);
};

// ======================================================
// COMPONENT
// ======================================================

const Analytics = () => {
  // ====================================================
  // STATE
  // ====================================================

  const [
    analytics,
    setAnalytics,
  ] = useState<AnalyticsData>(
    defaultData
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  // ====================================================
  // FETCH ANALYTICS
  // ====================================================

  const fetchAnalytics = useCallback(
    async () => {
      try {
        setError("");

        const response =
          await api.get(
            "/analytics"
          );

        console.log(
          "Analytics API:",
          response.data
        );

        const data =
          response?.data?.analytics ??
          response?.data?.data ??
          response?.data ??
          {};

        setAnalytics({
          totalVehicles:
            numberValue(
              data.totalVehicles ??
                data.vehicles
            ),

          activeVehicles:
            numberValue(
              data.activeVehicles
            ),

          idleVehicles:
            numberValue(
              data.idleVehicles
            ),

          offlineVehicles:
            numberValue(
              data.offlineVehicles
            ),

          totalDrivers:
            numberValue(
              data.totalDrivers ??
                data.drivers
            ),

          totalAlerts:
            numberValue(
              data.totalAlerts ??
                data.alerts
            ),

          totalReports:
            numberValue(
              data.totalReports ??
                data.reports
            ),

          fuelConsumed:
            numberValue(
              data.fuelConsumed ??
                data.fuelConsumption
            ),

          revenue:
            numberValue(
              data.revenue
            ),

          fleetHealth:
            numberValue(
              data.fleetHealth
            ),
        });
      } catch (err: any) {
        console.error(
          "Analytics Error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Unable to load analytics data."
        );

        setAnalytics(
          defaultData
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // ====================================================
  // REFRESH
  // ====================================================

  const handleRefresh =
    async () => {
      setRefreshing(true);

      await fetchAnalytics();
    };

  // ====================================================
  // PDF EXPORT
  // ====================================================

  const exportPDF = () => {
    try {
      const pdf =
        new jsPDF();

      pdf.setFontSize(20);

      pdf.text(
        "FleetDash Analytics Report",
        14,
        18
      );

      pdf.setFontSize(10);

      pdf.text(
        `Generated: ${new Date().toLocaleString()}`,
        14,
        26
      );

      autoTable(pdf, {
        startY: 34,

        head: [
          [
            "Metric",
            "Value",
          ],
        ],

        body: [
          [
            "Total Vehicles",
            formatNumber(
              analytics.totalVehicles
            ),
          ],

          [
            "Active Vehicles",
            formatNumber(
              analytics.activeVehicles
            ),
          ],

          [
            "Idle Vehicles",
            formatNumber(
              analytics.idleVehicles
            ),
          ],

          [
            "Offline Vehicles",
            formatNumber(
              analytics.offlineVehicles
            ),
          ],

          [
            "Total Drivers",
            formatNumber(
              analytics.totalDrivers
            ),
          ],

          [
            "Total Alerts",
            formatNumber(
              analytics.totalAlerts
            ),
          ],

          [
            "Total Reports",
            formatNumber(
              analytics.totalReports
            ),
          ],

          [
            "Fuel Consumed",
            `${formatNumber(
              analytics.fuelConsumed
            )} L`,
          ],

          [
            "Revenue",
            formatCurrency(
              analytics.revenue
            ),
          ],

          [
            "Fleet Health",
            `${analytics.fleetHealth}%`,
          ],
        ],
      });

      pdf.save(
        "FleetDash_Analytics.pdf"
      );
    } catch (err) {
      console.error(
        "PDF Export Error:",
        err
      );
    }
  };

  // ====================================================
  // VEHICLE HEALTH PERCENTAGES
  // ====================================================

  const vehiclePercentages =
    useMemo(() => {
      const total =
        analytics.totalVehicles;

      if (!total) {
        return {
          active: 0,
          idle: 0,
          offline: 0,
        };
      }

      return {
        active:
          (analytics.activeVehicles /
            total) *
          100,

        idle:
          (analytics.idleVehicles /
            total) *
          100,

        offline:
          (analytics.offlineVehicles /
            total) *
          100,
      };
    }, [analytics]);

  // ====================================================
  // CHART OPTIONS
  // ====================================================

  const barOptions = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        backgroundColor:
          "#111827",

        padding: 12,

        titleColor: "#ffffff",

        bodyColor: "#ffffff",

        displayColors: false,
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: "#64748b",
        },
      },

      y: {
        beginAtZero: true,

        grid: {
          color: "#e2e8f0",
        },

        ticks: {
          color: "#64748b",
        },
      },
    },
  };

  const lineOptions = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        backgroundColor:
          "#111827",

        padding: 12,
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: "#64748b",
        },
      },

      y: {
        beginAtZero: true,

        grid: {
          color: "#e2e8f0",
        },

        ticks: {
          color: "#64748b",
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,

    maintainAspectRatio: false,

    cutout: "70%",

    plugins: {
      legend: {
        position:
          "bottom" as const,

        labels: {
          usePointStyle: true,

          padding: 20,

          color: "#475569",
        },
      },
    },
  };

  // ====================================================
  // CHART DATA
  // ====================================================

  const vehicleChartData =
    useMemo(
      () => ({
        labels: [
          "Active",
          "Idle",
          "Offline",
        ],

        datasets: [
          {
            label:
              "Vehicles",

            data: [
              analytics.activeVehicles,
              analytics.idleVehicles,
              analytics.offlineVehicles,
            ],

            borderRadius: 8,

            barThickness: 42,

            backgroundColor: [
              "#2563eb",
              "#f59e0b",
              "#ef4444",
            ],
          },
        ],
      }),
      [analytics]
    );

  const fleetChartData =
    useMemo(
      () => ({
        labels: [
          "Active",
          "Idle",
          "Offline",
        ],

        datasets: [
          {
            data: [
              analytics.activeVehicles,
              analytics.idleVehicles,
              analytics.offlineVehicles,
            ],

            backgroundColor: [
              "#2563eb",
              "#f59e0b",
              "#ef4444",
            ],

            borderWidth: 0,

            hoverOffset: 6,
          },
        ],
      }),
      [analytics]
    );

  const revenueChartData =
    useMemo(
      () => ({
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
        ],

        datasets: [
          {
            label:
              "Revenue",

            data: [
              120000,
              180000,
              250000,
              220000,
              300000,
              analytics.revenue,
            ],

            borderColor:
              "#2563eb",

            backgroundColor:
              "rgba(37, 99, 235, 0.10)",

            fill: true,

            tension: 0.4,

            pointRadius: 4,

            pointHoverRadius: 6,

            pointBackgroundColor:
              "#2563eb",

            pointBorderColor:
              "#ffffff",

            pointBorderWidth: 2,
          },
        ],
      }),
      [analytics]
    );

  const fuelChartData =
    useMemo(
      () => ({
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
        ],

        datasets: [
          {
            label:
              "Fuel Consumption",

            data: [
              3000,
              3500,
              2800,
              4200,
              3900,
              analytics.fuelConsumed,
            ],

            borderColor:
              "#f59e0b",

            backgroundColor:
              "rgba(245, 158, 11, 0.10)",

            fill: true,

            tension: 0.4,

            pointRadius: 4,

            pointHoverRadius: 6,

            pointBackgroundColor:
              "#f59e0b",

            pointBorderColor:
              "#ffffff",

            pointBorderWidth: 2,
          },
        ],
      }),
      [analytics]
    );

  // ====================================================
  // KPI CARD
  // ====================================================

  const MetricCard = ({
    title,
    value,
    subtitle,
    icon,
    iconClass,
    valueClass = "text-slate-900",
  }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
    iconClass: string;
    valueClass?: string;
  }) => {
    return (
      <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">
              {title}
            </p>

            <p
              className={`mt-3 text-2xl font-bold tracking-tight sm:text-3xl ${valueClass}`}
            >
              {loading
                ? "..."
                : value}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              {subtitle}
            </p>
          </div>

          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
          >
            {icon}
          </div>
        </div>
      </div>
    );
  };

  // ====================================================
  // LOADING SCREEN
  // ====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="animate-pulse">
            <div className="h-8 w-72 rounded-lg bg-slate-100" />

            <div className="mt-3 h-4 w-96 max-w-full rounded bg-slate-100" />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-6">
            {Array.from({
              length: 6,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-36 rounded-2xl border border-slate-100 bg-white shadow-sm"
                />
              )
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {Array.from({
              length: 4,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-96 animate-pulse rounded-2xl border border-slate-100 bg-slate-50"
                />
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // MAIN UI
  // ====================================================

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl space-y-7 p-4 sm:p-6 lg:p-8">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiBarChart2 size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Analytics Dashboard
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Fleet performance intelligence and operational insights.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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

            <button
              type="button"
              onClick={exportPDF}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <FiDownload />

              Export Report
            </button>
          </div>
        </div>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <FiAlertTriangle />
              </div>

              <div>
                <p className="font-semibold text-red-800">
                  Analytics unavailable
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* ==================================================
            KPI GRID
        ================================================== */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-6">
          <MetricCard
            title="Vehicles"
            value={formatNumber(
              analytics.totalVehicles
            )}
            subtitle="Total registered vehicles"
            icon={
              <FiTruck size={22} />
            }
            iconClass="bg-blue-50 text-blue-600"
          />

          <MetricCard
            title="Drivers"
            value={formatNumber(
              analytics.totalDrivers
            )}
            subtitle="Total active drivers"
            icon={
              <FiUsers size={22} />
            }
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <MetricCard
            title="Alerts"
            value={formatNumber(
              analytics.totalAlerts
            )}
            subtitle="Fleet alerts recorded"
            icon={
              <FiAlertTriangle
                size={22}
              />
            }
            iconClass="bg-red-50 text-red-600"
            valueClass="text-red-600"
          />

          <MetricCard
            title="Reports"
            value={formatNumber(
              analytics.totalReports
            )}
            subtitle="Generated reports"
            icon={
              <FiFileText size={22} />
            }
            iconClass="bg-violet-50 text-violet-600"
          />

          <MetricCard
            title="Fuel"
            value={`${formatNumber(
              analytics.fuelConsumed
            )} L`}
            subtitle="Total fuel consumed"
            icon={
              <FiDroplet size={22} />
            }
            iconClass="bg-amber-50 text-amber-600"
          />

          <MetricCard
            title="Revenue"
            value={formatCurrency(
              analytics.revenue
            )}
            subtitle="Fleet revenue"
            icon={
              <FiDollarSign
                size={22}
              />
            }
            iconClass="bg-green-50 text-green-600"
          />
        </div>

        {/* ==================================================
            FLEET HEALTH
        ================================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Fleet Health
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Overall Fleet Performance
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Current operational health based on available fleet data.
                </p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FiActivity
                  size={30}
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-5xl font-bold tracking-tight text-slate-900">
                  {analytics.fleetHealth}%
                </p>

                <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                  <FiTrendingUp />

                  Fleet health score
                </p>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                  <span>
                    Health Score
                  </span>

                  <span>
                    {analytics.fleetHealth}%
                  </span>
                </div>

                <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-700"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          0,
                          analytics.fleetHealth
                        )
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Vehicle Health
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Fleet Status
                </h2>
              </div>

              <FiTruck
                className="text-blue-600"
                size={22}
              />
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    Active
                  </span>

                  <span className="font-semibold text-blue-600">
                    {analytics.activeVehicles}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{
                      width: `${vehiclePercentages.active}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    Idle
                  </span>

                  <span className="font-semibold text-amber-600">
                    {analytics.idleVehicles}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{
                      width: `${vehiclePercentages.idle}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    Offline
                  </span>

                  <span className="font-semibold text-red-600">
                    {analytics.offlineVehicles}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-red-500"
                    style={{
                      width: `${vehiclePercentages.offline}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            CHARTS ROW 1
        ================================================== */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* VEHICLE STATUS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Vehicle Status
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Current fleet availability.
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FiBarChart2 />
              </div>
            </div>

            <div className="mt-6 h-[320px]">
              <Bar
                data={
                  vehicleChartData
                }
                options={
                  barOptions
                }
              />
            </div>
          </div>

          {/* DISTRIBUTION */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Fleet Distribution
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Active, idle and offline vehicles.
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <FiActivity />
              </div>
            </div>

            <div className="relative mt-6 h-[320px]">
              <Doughnut
                data={
                  fleetChartData
                }
                options={
                  doughnutOptions
                }
              />

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-slate-900">
                    {analytics.totalVehicles}
                  </p>

                  <p className="text-xs text-slate-400">
                    Vehicles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            CHARTS ROW 2
        ================================================== */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* REVENUE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Revenue Trend
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Monthly fleet revenue performance.
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <FiDollarSign />
              </div>
            </div>

            <div className="mt-6 h-[320px]">
              <Line
                data={
                  revenueChartData
                }
                options={
                  lineOptions
                }
              />
            </div>
          </div>

          {/* FUEL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Fuel Consumption
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Monthly fuel usage trend.
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <FiDroplet />
              </div>
            </div>

            <div className="mt-6 h-[320px]">
              <Line
                data={
                  fuelChartData
                }
                options={
                  lineOptions
                }
              />
            </div>
          </div>
        </div>

        {/* ==================================================
            OPERATIONAL SUMMARY
        ================================================== */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiWifi />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Active
                </p>

                <p className="text-xl font-bold text-slate-900">
                  {analytics.activeVehicles}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <FiClock />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Idle
                </p>

                <p className="text-xl font-bold text-slate-900">
                  {analytics.idleVehicles}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <FiWifiOff />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Offline
                </p>

                <p className="text-xl font-bold text-slate-900">
                  {analytics.offlineVehicles}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <FiCheckCircle />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Health
                </p>

                <p className="text-xl font-bold text-slate-900">
                  {analytics.fleetHealth}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-xs text-slate-400 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <span>
            FleetDash analytics monitoring is active.
          </span>

          <span className="inline-flex items-center gap-2">
            <FiRefreshCw />

            Data loaded directly from the analytics API.
          </span>
        </div>

      </div>
    </div>
  );
};

export default Analytics;