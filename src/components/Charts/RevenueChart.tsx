import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
  type TooltipItem,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { useMemo } from "react";

import {
  FaArrowTrendUp,
  FaChartLine,
  FaMoneyBillWave,
  FaRoute,
} from "react-icons/fa6";

// ======================================================
// CHART.JS REGISTRATION
// ======================================================

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

// ======================================================
// TYPES
// ======================================================

interface RevenueChartProps {
  labels?: string[];
  values?: number[];
  title?: string;
  subtitle?: string;
}

// ======================================================
// COMPONENT
// ======================================================

const RevenueChart = ({
  labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  values = [
    50000,
    75000,
    95000,
    120000,
    145000,
    170000,
  ],
  title = "Monthly Revenue Analytics",
  subtitle = "Fleet business revenue growth and performance",
}: RevenueChartProps) => {
  // ====================================================
  // SAFE DATA
  // ====================================================

  const safeValues = useMemo(
    () =>
      values.map((value) => {
        const numberValue = Number(value);

        return Number.isFinite(numberValue)
          ? Math.max(0, numberValue)
          : 0;
      }),
    [values]
  );

  // ====================================================
  // REVENUE CALCULATIONS
  // ====================================================

  const totalRevenue = useMemo(
    () =>
      safeValues.reduce(
        (total, value) => total + value,
        0
      ),
    [safeValues]
  );

  const latestRevenue =
    safeValues.length > 0
      ? safeValues[safeValues.length - 1]
      : 0;

  const previousRevenue =
    safeValues.length > 1
      ? safeValues[safeValues.length - 2]
      : 0;

  const averageRevenue =
    safeValues.length > 0
      ? totalRevenue / safeValues.length
      : 0;

  const revenueGrowth =
    previousRevenue > 0
      ? ((latestRevenue - previousRevenue) /
          previousRevenue) *
        100
      : 0;

  // ====================================================
  // FORMATTERS
  // ====================================================

  const formatCurrency = (value: number) =>
    `₹${value.toLocaleString("en-IN")}`;

  const formatCompactCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)}Cr`;
    }

    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)}L`;
    }

    if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`;
    }

    return `₹${Math.round(value).toLocaleString(
      "en-IN"
    )}`;
  };

  const formattedGrowth =
    `${revenueGrowth >= 0 ? "+" : ""}${revenueGrowth.toFixed(
      1
    )}%`;

  // ====================================================
  // CHART DATA
  // ====================================================

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Monthly Revenue",
          data: safeValues,

          fill: true,

          tension: 0.4,

          borderWidth: 3,

          borderColor: "#2563eb",

          backgroundColor:
            "rgba(37, 99, 235, 0.12)",

          pointRadius: 5,

          pointHoverRadius: 8,

          pointBackgroundColor: "#2563eb",

          pointBorderColor: "#ffffff",

          pointBorderWidth: 2,

          pointHitRadius: 20,
        },
      ],
    }),
    [labels, safeValues]
  );

  // ====================================================
  // CHART OPTIONS
  // ====================================================

  const options: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,

      maintainAspectRatio: false,

      interaction: {
        mode: "index",
        intersect: false,
      },

      plugins: {
        legend: {
          display: true,

          position: "top",

          align: "end",

          labels: {
            boxWidth: 12,

            boxHeight: 12,

            padding: 16,

            usePointStyle: true,

            pointStyle: "circle",

            font: {
              size: 12,

              weight: "bold",
            },
          },
        },

        tooltip: {
          enabled: true,

          padding: 12,

          displayColors: true,

          callbacks: {
            label: (
              context: TooltipItem<"line">
            ) =>
              ` Revenue: ${formatCurrency(
                Number(context.raw)
              )}`,
          },
        },
      },

      scales: {
        y: {
          beginAtZero: true,

          border: {
            display: false,
          },

          ticks: {
            padding: 8,

            callback: (value) =>
              formatCompactCurrency(
                Number(value)
              ),

            font: {
              size: 11,
            },
          },

          grid: {
            color: "#e5e7eb",
          },
        },

        x: {
          border: {
            display: false,
          },

          grid: {
            display: false,
          },

          ticks: {
            padding: 8,

            font: {
              size: 11,
            },
          },
        },
      },
    }),
    []
  );

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-lg sm:p-6">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FaChartLine size={20} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
                {title}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
          <FaArrowTrendUp size={13} />

          {revenueGrowth >= 0
            ? "Revenue Growing"
            : "Revenue Declining"}
        </div>
      </div>

      {/* ==================================================
          KPI CARDS
      ================================================== */}

      <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Total Revenue */}

        <div className="group rounded-xl border border-blue-100 bg-blue-50/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Revenue
              </p>

              <h3 className="mt-2 text-2xl font-bold text-blue-700 sm:text-3xl">
                {formatCompactCurrency(
                  totalRevenue
                )}
              </h3>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <FaMoneyBillWave />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span
              className={`font-semibold ${
                revenueGrowth >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formattedGrowth}
            </span>

            <span className="text-xs text-gray-400">
              vs previous month
            </span>
          </div>
        </div>

        {/* Latest Month */}

        <div className="group rounded-xl border border-green-100 bg-green-50/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Latest Month
              </p>

              <h3 className="mt-2 text-2xl font-bold text-green-700 sm:text-3xl">
                {formatCompactCurrency(
                  latestRevenue
                )}
              </h3>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <FaArrowTrendUp />
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            {labels[labels.length - 1] ??
              "Current period"}{" "}
            revenue
          </p>
        </div>

        {/* Average */}

        <div className="group rounded-xl border border-orange-100 bg-orange-50/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Average / Month
              </p>

              <h3 className="mt-2 text-2xl font-bold text-orange-600 sm:text-3xl">
                {formatCompactCurrency(
                  averageRevenue
                )}
              </h3>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <FaRoute />
            </div>
          </div>

          <p className="mt-3 text-xs font-medium text-orange-600">
            Based on {safeValues.length}{" "}
            reporting periods
          </p>
        </div>
      </div>

      {/* ==================================================
          CHART
      ================================================== */}

      <div className="mt-7 rounded-xl border border-gray-100 bg-slate-50/50 p-3 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Revenue Trend
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Monthly fleet business performance
            </p>
          </div>

          <div className="hidden items-center gap-2 text-xs font-semibold text-blue-600 sm:flex">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            Revenue
          </div>
        </div>

        <div className="h-[280px] sm:h-[350px]">
          <Line
            data={data}
            options={options}
          />
        </div>
      </div>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <div className="mt-5 flex flex-col gap-2 border-t border-gray-100 pt-4 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Revenue data is updated with the latest
          available fleet records.
        </span>

        <span className="font-semibold text-blue-600">
          Live Analytics
        </span>
      </div>
    </section>
  );
};

export default RevenueChart;