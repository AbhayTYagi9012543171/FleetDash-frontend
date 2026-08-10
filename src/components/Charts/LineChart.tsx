
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

import { useMemo } from "react";

import type {
  ChartOptions,
} from "chart.js";

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

interface LineChartProps {
  labels?: string[];
  values?: number[];
  title?: string;
  label?: string;
}

// ======================================================
// COMPONENT
// ======================================================

const LineChart = ({
  labels,
  values,
  title = "Vehicle Activity",
  label = "Running Vehicles",
}: LineChartProps) => {
  // ====================================================
  // SAFE LABELS
  // ====================================================

  const chartLabels = useMemo(
    () =>
      labels?.length
        ? labels
        : [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
          ],
    [labels]
  );

  // ====================================================
  // SAFE VALUES
  // ====================================================

  const chartValues = useMemo(
    () =>
      values?.length
        ? values.map((value) =>
            Math.max(
              0,
              Number(value) || 0
            )
          )
        : [
            80,
            92,
            88,
            105,
            95,
            115,
            98,
          ],
    [values]
  );

  // ====================================================
  // STATISTICS
  // ====================================================

  const statistics = useMemo(() => {
    const total = chartValues.reduce(
      (sum, value) => sum + value,
      0
    );

    const average =
      chartValues.length > 0
        ? Math.round(
            total / chartValues.length
          )
        : 0;

    const highest =
      chartValues.length > 0
        ? Math.max(...chartValues)
        : 0;

    const lowest =
      chartValues.length > 0
        ? Math.min(...chartValues)
        : 0;

    const latest =
      chartValues.length > 0
        ? chartValues[
            chartValues.length - 1
          ]
        : 0;

    return {
      total,
      average,
      highest,
      lowest,
      latest,
    };
  }, [chartValues]);

  // ====================================================
  // CHART DATA
  // ====================================================

  const chartData = useMemo(
    () => ({
      labels: chartLabels,

      datasets: [
        {
          label,

          data: chartValues,

          borderColor: "#2563eb",

          backgroundColor:
            "rgba(37, 99, 235, 0.12)",

          fill: true,

          tension: 0.4,

          borderWidth: 3,

          pointRadius: 5,

          pointHoverRadius: 8,

          pointBackgroundColor: "#2563eb",

          pointBorderColor: "#ffffff",

          pointBorderWidth: 2,

          cubicInterpolationMode:
            "monotone" as const,
        },
      ],
    }),
    [
      chartLabels,
      chartValues,
      label,
    ]
  );

  // ====================================================
  // CHART OPTIONS
  // ====================================================

  const options: ChartOptions<"line"> =
    useMemo(
      () => ({
        responsive: true,

        maintainAspectRatio: false,

        interaction: {
          mode: "index",
          intersect: false,
        },

        animation: {
          duration: 900,
        },

        plugins: {
          legend: {
            display: true,

            position: "bottom",

            labels: {
              boxWidth: 12,

              boxHeight: 12,

              padding: 18,

              usePointStyle: true,

              pointStyle: "circle",

              font: {
                size: 12,

                weight: 600,
              },
            },
          },

          tooltip: {
            enabled: true,

            padding: 12,

            displayColors: false,

            callbacks: {
              title: (
                tooltipItems
              ) => {
                return (
                  tooltipItems[0]?.label ??
                  "Activity"
                );
              },

              label: (context) => {
                const value =
                  Number(context.raw) || 0;

                return ` ${label}: ${value.toLocaleString()}`;
              },
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
              precision: 0,

              padding: 8,

              font: {
                size: 11,
              },

              callback: (value) => {
                return Number(
                  value
                ).toLocaleString();
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

            ticks: {
              padding: 8,

              font: {
                size: 11,
              },
            },

            grid: {
              display: false,
            },
          },
        },
      }),
      [label]
    );

  // ====================================================
  // EMPTY STATE
  // ====================================================

  if (
    !chartValues.length ||
    !chartLabels.length
  ) {
    return (
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-lg">

        <h2 className="text-xl font-bold text-slate-800">
          {title}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Weekly fleet performance monitoring
        </p>

        <div className="flex h-[260px] flex-col items-center justify-center text-center">

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
            📈
          </div>

          <h3 className="mt-4 text-lg font-bold text-slate-800">
            No activity data
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Vehicle activity data is currently
            unavailable.
          </p>

        </div>
      </div>
    );
  }

  // ====================================================
  // MAIN
  // ====================================================

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
              📈
            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-800">
                {title}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Weekly fleet performance monitoring
              </p>

            </div>

          </div>

        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">

          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />

          Live

        </div>

      </div>

      {/* ==================================================
          SUMMARY
      ================================================== */}

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">

        {/* Current */}

        <div className="rounded-xl bg-blue-50 p-4">

          <p className="text-xs font-medium text-blue-600">
            Current
          </p>

          <p className="mt-1 text-2xl font-bold text-blue-700">
            {statistics.latest}
          </p>

          <p className="mt-1 text-[11px] text-blue-500">
            Latest activity
          </p>

        </div>

        {/* Average */}

        <div className="rounded-xl bg-indigo-50 p-4">

          <p className="text-xs font-medium text-indigo-600">
            Average
          </p>

          <p className="mt-1 text-2xl font-bold text-indigo-700">
            {statistics.average}
          </p>

          <p className="mt-1 text-[11px] text-indigo-500">
            Per period
          </p>

        </div>

        {/* Highest */}

        <div className="rounded-xl bg-green-50 p-4">

          <p className="text-xs font-medium text-green-600">
            Peak
          </p>

          <p className="mt-1 text-2xl font-bold text-green-700">
            {statistics.highest}
          </p>

          <p className="mt-1 text-[11px] text-green-500">
            Highest activity
          </p>

        </div>

        {/* Data Points */}

        <div className="rounded-xl bg-slate-50 p-4">

          <p className="text-xs font-medium text-slate-500">
            Data Points
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-700">
            {chartValues.length}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            Recorded periods
          </p>

        </div>

      </div>

      {/* ==================================================
          CHART
      ================================================== */}

      <div className="mt-6 border-t border-gray-100 pt-6">

        <div className="mb-4 flex items-center justify-between">

          <div>

            <h3 className="text-sm font-bold text-slate-800">
              Activity Overview
            </h3>

            <p className="mt-1 text-xs text-gray-400">
              Vehicle activity across the selected
              period
            </p>

          </div>

          <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
            {label}
          </span>

        </div>

        <div className="h-[260px] w-full">

          <Line
            data={chartData}
            options={options}
          />

        </div>

      </div>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <div className="mt-5 flex flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-2">

          <span className="h-2 w-2 rounded-full bg-green-500" />

          <span className="text-xs font-medium text-gray-500">
            Fleet activity monitoring active
          </span>

        </div>

        <span className="text-xs font-semibold text-blue-600">
          Updated just now
        </span>

      </div>

    </div>
  );
};

export default LineChart;

