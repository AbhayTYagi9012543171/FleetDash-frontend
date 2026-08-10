
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import type {
  ChartData,
  ChartOptions,
} from "chart.js";

import { Bar } from "react-chartjs-2";

// ======================================================
// CHART.JS REGISTRATION
// ======================================================

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

// ======================================================
// TYPES
// ======================================================

interface BarChartProps {
  labels?: string[];
  values?: number[];
  title?: string;
  label?: string;
  height?: number;
}

// ======================================================
// COMPONENT
// ======================================================

const BarChart = ({
  labels,
  values,
  title = "Monthly Trips",
  label = "Trips",
  height = 300,
}: BarChartProps) => {
  // ====================================================
  // DEFAULT DATA
  // ====================================================

  const chartLabels =
    labels ?? [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
    ];

  const chartValues =
    values ?? [
      120,
      150,
      180,
      210,
      240,
      280,
    ];

  // ====================================================
  // TOTAL
  // ====================================================

  const totalValue = chartValues.reduce(
    (total, value) => total + value,
    0
  );

  // ====================================================
  // CHART DATA
  // ====================================================

  const data: ChartData<"bar"> = {
    labels: chartLabels,

    datasets: [
      {
        label,

        data: chartValues,

        backgroundColor: [
          "#2563eb",
          "#16a34a",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#0ea5e9",
          "#14b8a6",
          "#f97316",
          "#6366f1",
          "#10b981",
          "#eab308",
          "#ec4899",
        ],

        borderColor: "#ffffff",

        borderWidth: 1,

        borderRadius: 8,

        borderSkipped: false,

        maxBarThickness: 42,

        hoverBackgroundColor: [
          "#1d4ed8",
          "#15803d",
          "#d97706",
          "#dc2626",
          "#7c3aed",
          "#0284c7",
          "#0f766e",
          "#ea580c",
          "#4f46e5",
          "#059669",
          "#ca8a04",
          "#db2777",
        ],
      },
    ],
  };

  // ====================================================
  // CHART OPTIONS
  // ====================================================

  const options: ChartOptions<"bar"> = {
    responsive: true,

    maintainAspectRatio: false,

    animation: {
      duration: 900,
      easing: "easeOutQuart",
    },

    interaction: {
      mode: "index",
      intersect: false,
    },

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        enabled: true,

        backgroundColor: "#0f172a",

        titleColor: "#ffffff",

        bodyColor: "#e2e8f0",

        borderColor: "#334155",

        borderWidth: 1,

        padding: 12,

        displayColors: true,

        cornerRadius: 10,

        callbacks: {
          label: (context) => {
            const value = context.parsed.y ?? 0;

            return ` ${label}: ${value}`;
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

          color: "#64748b",

          font: {
            size: 11,
          },

          padding: 8,
        },

        grid: {
          color: "#e2e8f0",

          drawTicks: false,
        },
      },

      x: {
        border: {
          display: false,
        },

        ticks: {
          color: "#64748b",

          font: {
            size: 11,

            weight: 600,
          },

          padding: 8,
        },

        grid: {
          display: false,
        },
      },
    },
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <section
      className="
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-300
        hover:shadow-lg
        sm:p-6
      "
    >
      {/* ================================================
          HEADER
      ================================================ */}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              {title}
            </h2>

            <span className="hidden rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-600 sm:inline-flex">
              Analytics
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Monthly trip performance analytics
          </p>
        </div>

        {/* Total */}

        <div className="rounded-xl bg-slate-50 px-4 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Total
          </p>

          <p className="mt-0.5 text-lg font-bold text-slate-900">
            {totalValue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* ================================================
          CHART
      ================================================ */}

      <div
        className="relative w-full"
        style={{
          height: `${height}px`,
        }}
      >
        <Bar
          data={data}
          options={options}
        />
      </div>
    </section>
  );
};

export default BarChart;
