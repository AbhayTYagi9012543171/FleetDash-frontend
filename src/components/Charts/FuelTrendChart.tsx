
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

import {
  Line,
} from "react-chartjs-2";

import {
  useMemo,
} from "react";

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

interface FuelTrendChartProps {
  labels?: string[];
  values?: number[];
}

// ======================================================
// COMPONENT
// ======================================================

const FuelTrendChart = ({
  labels,
  values,
}: FuelTrendChartProps) => {
  // ====================================================
  // SAFE DATA
  // ====================================================

  const chartLabels = useMemo(
    () =>
      labels?.length
        ? labels
        : [
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
          ],
    [labels]
  );

  const fuelData = useMemo(
    () =>
      values?.length
        ? values.map((value) =>
            Math.max(0, Number(value) || 0)
          )
        : [450, 520, 480, 600],
    [values]
  );

  // ====================================================
  // STATISTICS
  // ====================================================

  const statistics = useMemo(() => {
    const total = fuelData.reduce(
      (sum, value) => sum + value,
      0
    );

    const average =
      fuelData.length > 0
        ? Math.round(total / fuelData.length)
        : 0;

    const highest =
      fuelData.length > 0
        ? Math.max(...fuelData)
        : 0;

    const lowest =
      fuelData.length > 0
        ? Math.min(...fuelData)
        : 0;

    return {
      total,
      average,
      highest,
      lowest,
    };
  }, [fuelData]);

  // ====================================================
  // CHART DATA
  // ====================================================

  const data = useMemo(
    () => ({
      labels: chartLabels,

      datasets: [
        {
          label: "Fuel Consumption",

          data: fuelData,

          fill: true,

          tension: 0.4,

          borderWidth: 3,

          pointRadius: 5,

          pointHoverRadius: 8,

          pointBorderWidth: 2,

          pointBackgroundColor: "#ffffff",

          pointBorderColor: "#16a34a",

          borderColor: "#16a34a",

          backgroundColor:
            "rgba(22, 163, 74, 0.14)",

          cubicInterpolationMode: "monotone" as const,
        },
      ],
    }),
    [
      chartLabels,
      fuelData,
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
              usePointStyle: true,

              pointStyle: "circle",

              padding: 18,

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
              title: (tooltipItems) => {
                return (
                  tooltipItems[0]?.label ??
                  "Fuel Usage"
                );
              },

              label: (context) => {
                const value =
                  Number(context.raw) || 0;

                return ` Fuel Consumed: ${value.toLocaleString()} L`;
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
                return `${Number(value).toLocaleString()} L`;
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
      []
    );

  // ====================================================
  // EMPTY STATE
  // ====================================================

  if (
    !fuelData.length ||
    !chartLabels.length
  ) {
    return (
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">

        <h2 className="text-2xl font-bold text-slate-800">
          Fuel Consumption Trend
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Weekly fuel usage monitoring
        </p>

        <div className="flex h-96 flex-col items-center justify-center text-center">

          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-green-50 text-3xl text-green-600">
            ⛽
          </div>

          <h3 className="mt-5 text-lg font-bold text-slate-800">
            No fuel data available
          </h3>

          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Fuel consumption information will
            appear here once data is available.
          </p>

        </div>
      </div>
    );
  }

  // ====================================================
  // MAIN
  // ====================================================

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl text-green-600">
              ⛽
            </div>

            <div>

              <h2 className="text-2xl font-bold text-slate-800">
                Fuel Consumption Trend
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Weekly fuel usage monitoring
              </p>

            </div>

          </div>

        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">

          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />

          Live Monitoring

        </div>

      </div>

      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* Total */}

        <div className="rounded-xl border border-green-100 bg-green-50 p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-green-700">
                Total Fuel Used
              </p>

              <p className="mt-2 text-3xl font-bold text-green-700">
                {statistics.total.toLocaleString()} L
              </p>

            </div>

            <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-green-600 shadow-sm">
              +6.8%
            </span>

          </div>

          <p className="mt-3 text-xs text-green-600">
            Total consumption for selected period
          </p>

        </div>

        {/* Average */}

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-blue-700">
                Average / Week
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-700">
                {statistics.average.toLocaleString()} L
              </p>

            </div>

            <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-blue-600 shadow-sm">
              Stable
            </span>

          </div>

          <p className="mt-3 text-xs text-blue-600">
            Average weekly fuel consumption
          </p>

        </div>

        {/* Efficiency */}

        <div className="rounded-xl border border-orange-100 bg-orange-50 p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-orange-700">
                Fuel Efficiency
              </p>

              <p className="mt-2 text-3xl font-bold text-orange-600">
                14.8 km/L
              </p>

            </div>

            <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-orange-600 shadow-sm">
              Excellent
            </span>

          </div>

          <p className="mt-3 text-xs text-orange-600">
            Current fleet efficiency
          </p>

        </div>

      </div>

      {/* ==================================================
          MINI INSIGHTS
      ================================================== */}

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">

        <div className="rounded-xl bg-slate-50 p-4">

          <p className="text-xs font-medium text-gray-500">
            Highest Usage
          </p>

          <p className="mt-1 text-lg font-bold text-slate-800">
            {statistics.highest.toLocaleString()} L
          </p>

        </div>

        <div className="rounded-xl bg-slate-50 p-4">

          <p className="text-xs font-medium text-gray-500">
            Lowest Usage
          </p>

          <p className="mt-1 text-lg font-bold text-slate-800">
            {statistics.lowest.toLocaleString()} L
          </p>

        </div>

        <div className="col-span-2 rounded-xl bg-slate-50 p-4 sm:col-span-1">

          <p className="text-xs font-medium text-gray-500">
            Data Points
          </p>

          <p className="mt-1 text-lg font-bold text-slate-800">
            {fuelData.length}
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
              Consumption Overview
            </h3>

            <p className="mt-1 text-xs text-gray-400">
              Fuel consumed across the selected
              period
            </p>

          </div>

          <span className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
            Liters
          </span>

        </div>

        <div className="h-96 w-full">

          <Line
            data={data}
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
            Fuel monitoring active
          </span>

        </div>

        <span className="text-xs font-semibold text-blue-600">
          Updated just now
        </span>

      </div>

    </div>
  );
};

export default FuelTrendChart;

