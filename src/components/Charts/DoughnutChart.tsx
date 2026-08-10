
import { useMemo } from "react";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import { Doughnut } from "react-chartjs-2";

// ======================================================
// CHART.JS REGISTRATION
// ======================================================

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

// ======================================================
// TYPES
// ======================================================

interface DoughnutChartProps {
  running?: number;
  offline?: number;
  maintenance?: number;
  title?: string;
}

// ======================================================
// COMPONENT
// ======================================================

const DoughnutChart = ({
  running = 98,
  offline = 22,
  maintenance = 10,
  title = "Vehicle Status",
}: DoughnutChartProps) => {
  // ====================================================
  // SAFE VALUES
  // ====================================================

  const safeRunning = Math.max(
    0,
    Number(running) || 0
  );

  const safeOffline = Math.max(
    0,
    Number(offline) || 0
  );

  const safeMaintenance = Math.max(
    0,
    Number(maintenance) || 0
  );

  const total =
    safeRunning +
    safeOffline +
    safeMaintenance;

  // ====================================================
  // PERCENTAGES
  // ====================================================

  const percentages = useMemo(() => {
    if (total === 0) {
      return {
        running: 0,
        offline: 0,
        maintenance: 0,
      };
    }

    return {
      running: Math.round(
        (safeRunning / total) * 100
      ),
      offline: Math.round(
        (safeOffline / total) * 100
      ),
      maintenance: Math.round(
        (safeMaintenance / total) * 100
      ),
    };
  }, [
    safeRunning,
    safeOffline,
    safeMaintenance,
    total,
  ]);

  // ====================================================
  // CHART DATA
  // ====================================================

  const data = useMemo(
    () => ({
      labels: [
        "Running",
        "Offline",
        "Maintenance",
      ],

      datasets: [
        {
          label: "Vehicle Status",

          data: [
            safeRunning,
            safeOffline,
            safeMaintenance,
          ],

          backgroundColor: [
            "#22c55e",
            "#ef4444",
            "#f59e0b",
          ],

          borderColor: "#ffffff",

          borderWidth: 3,

          hoverBorderWidth: 3,

          hoverOffset: 8,

          spacing: 2,

          borderRadius: 4,
        },
      ],
    }),
    [
      safeRunning,
      safeOffline,
      safeMaintenance,
    ]
  );

  // ====================================================
  // CHART OPTIONS
  // ====================================================

  const options: ChartOptions<"doughnut"> =
    useMemo(
      () => ({
        responsive: true,

        maintainAspectRatio: false,

        cutout: "70%",

        animation: {
          duration: 900,
        },

        plugins: {
          legend: {
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

            displayColors: true,

            callbacks: {
              label: (context) => {
                const value =
                  Number(context.raw) || 0;

                const label =
                  context.label ?? "";

                let percentage = 0;

                if (total > 0) {
                  percentage = Math.round(
                    (value / total) * 100
                  );
                }

                return ` ${label}: ${value} (${percentage}%)`;
              },
            },
          },
        },
      }),
      [total]
    );

  // ====================================================
  // EMPTY STATE
  // ====================================================

  if (total === 0) {
    return (
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {title}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Real-time vehicle availability
          </p>
        </div>

        <div className="flex h-[300px] flex-col items-center justify-center">

          <div className="flex h-36 w-36 items-center justify-center rounded-full border-[20px] border-slate-100">

            <div className="text-center">
              <p className="text-3xl font-bold text-slate-700">
                0
              </p>

              <p className="text-xs text-gray-400">
                Vehicles
              </p>
            </div>

          </div>

          <p className="mt-5 text-sm font-medium text-gray-500">
            No vehicle status data available
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

      {/* Header */}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {title}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Real-time vehicle availability
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600">

          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />

          Live
        </div>

      </div>

      {/* Chart */}

      <div className="relative mt-5 h-[300px]">

        <Doughnut
          data={data}
          options={options}
        />

        {/* Center Value */}

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">

          <div className="text-center">

            <p className="text-3xl font-bold tracking-tight text-slate-800">
              {total}
            </p>

            <p className="mt-1 text-xs font-medium text-gray-500">
              Vehicles
            </p>

          </div>

        </div>

      </div>

      {/* Status Summary */}

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

        {/* Running */}

        <div className="rounded-xl bg-green-50 p-3">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

              <span className="text-xs font-semibold text-slate-600">
                Running
              </span>

            </div>

            <span className="text-xs font-bold text-green-600">
              {percentages.running}%
            </span>

          </div>

          <p className="mt-2 text-xl font-bold text-slate-800">
            {safeRunning}
          </p>

        </div>

        {/* Offline */}

        <div className="rounded-xl bg-red-50 p-3">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />

              <span className="text-xs font-semibold text-slate-600">
                Offline
              </span>

            </div>

            <span className="text-xs font-bold text-red-600">
              {percentages.offline}%
            </span>

          </div>

          <p className="mt-2 text-xl font-bold text-slate-800">
            {safeOffline}
          </p>

        </div>

        {/* Maintenance */}

        <div className="rounded-xl bg-amber-50 p-3">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />

              <span className="text-xs font-semibold text-slate-600">
                Maintenance
              </span>

            </div>

            <span className="text-xs font-bold text-amber-600">
              {percentages.maintenance}%
            </span>

          </div>

          <p className="mt-2 text-xl font-bold text-slate-800">
            {safeMaintenance}
          </p>

        </div>

      </div>

      {/* Footer */}

      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">

        <div className="flex items-center gap-2">

          <span className="h-2 w-2 rounded-full bg-green-500" />

          <span className="text-xs font-medium text-gray-500">
            Fleet monitoring active
          </span>

        </div>

        <span className="text-xs font-semibold text-blue-600">
          Live Data
        </span>

      </div>

    </div>
  );
};

export default DoughnutChart;

