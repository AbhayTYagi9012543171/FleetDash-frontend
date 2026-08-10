
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type TooltipItem,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

import type { Vehicle } from "../../types/vehicle";

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

interface Props {
  vehicles?: Vehicle[];
}

interface StatusCardProps {
  title: string;
  value: number;
  percentage: number;
  className: string;
}

interface InfoCardProps {
  title: string;
  value: string;
  description: string;
  color: string;
}

// ======================================================
// COMPONENT
// ======================================================

const VehicleUtilizationChart = ({
  vehicles = [],
}: Props) => {
  // ====================================================
  // VEHICLE STATUS CALCULATIONS
  // ====================================================

  const active = vehicles.filter(
    (vehicle) =>
      vehicle.status?.toLowerCase() === "active"
  ).length;

  const idle = vehicles.filter(
    (vehicle) =>
      vehicle.status?.toLowerCase() === "idle"
  ).length;

  const maintenance = vehicles.filter(
    (vehicle) =>
      vehicle.status?.toLowerCase() === "maintenance"
  ).length;

  const offline = vehicles.filter(
    (vehicle) =>
      vehicle.status?.toLowerCase() === "offline"
  ).length;

  const total = vehicles.length;

  // ====================================================
  // PERCENTAGES
  // ====================================================

  const getPercentage = (value: number) => {
    if (total === 0) {
      return 0;
    }

    return Math.round((value / total) * 100);
  };

  const activePercentage = getPercentage(active);

  const idlePercentage = getPercentage(idle);

  const maintenancePercentage =
    getPercentage(maintenance);

  const offlinePercentage =
    getPercentage(offline);

  // Available = Active + Idle
  const availableVehicles = active + idle;

  const availability =
    total > 0
      ? Math.round(
          (availableVehicles / total) * 100
        )
      : 0;

  // Utilization = Active vehicles / total fleet
  const utilizationRate =
    total > 0
      ? Math.round((active / total) * 100)
      : 0;

  // ====================================================
  // CHART DATA
  // ====================================================

  const data = {
    labels: [
      "Active",
      "Idle",
      "Maintenance",
      "Offline",
    ],

    datasets: [
      {
        label: "Vehicle Status",

        data: [
          active,
          idle,
          maintenance,
          offline,
        ],

        backgroundColor: [
          "#22c55e",
          "#facc15",
          "#f97316",
          "#ef4444",
        ],

        borderColor: "#ffffff",

        borderWidth: 3,

        hoverOffset: 12,

        hoverBorderWidth: 3,
      },
    ],
  };

  // ====================================================
  // CHART OPTIONS
  // ====================================================

  const options: ChartOptions<"doughnut"> = {
    responsive: true,

    maintainAspectRatio: false,

    cutout: "72%",

    animation: {
      duration: 800,
    },

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          usePointStyle: true,

          pointStyle: "circle",

          padding: 20,

          boxWidth: 10,

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
            context: TooltipItem<"doughnut">
          ) => {
            const value = Number(
              context.raw ?? 0
            );

            const percentage =
              total > 0
                ? Math.round(
                    (value / total) * 100
                  )
                : 0;

            return ` ${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  // ====================================================
  // EMPTY STATE
  // ====================================================

  if (total === 0) {
    return (
      <section className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
        {/* Header */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
              Vehicle Utilization
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Fleet availability and operational
              status
            </p>
          </div>

          <div className="w-fit rounded-xl bg-slate-50 px-5 py-3">
            <p className="text-xs font-medium text-gray-500">
              Availability
            </p>

            <p className="text-2xl font-bold text-slate-400">
              0%
            </p>
          </div>
        </div>

        {/* Empty */}

        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17h6m-7 4h8m-9-8h10m-9-4h8m-9-5h10a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z"
              />
            </svg>
          </div>

          <h3 className="mt-5 text-lg font-bold text-slate-800">
            No Vehicle Data Available
          </h3>

          <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
            Vehicle status information will appear
            here once vehicles are available in the
            fleet.
          </p>
        </div>
      </section>
    );
  }

  // ====================================================
  // MAIN
  // ====================================================

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-lg sm:p-6">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17h6m-7 4h8m-9-8h10m-9-4h8m-9-5h10a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z"
                />
              </svg>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
                Vehicle Utilization
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Fleet availability and operational
                status
              </p>
            </div>
          </div>
        </div>

        {/* Availability */}

        <div className="w-fit rounded-xl border border-green-100 bg-green-50 px-5 py-3">
          <p className="text-xs font-medium text-gray-500">
            Availability
          </p>

          <p className="text-2xl font-bold text-green-600">
            {availability}%
          </p>

          <p className="mt-0.5 text-[11px] text-green-600">
            {availableVehicles} vehicles available
          </p>
        </div>
      </div>

      {/* ==================================================
          STATUS CARDS
      ================================================== */}

      <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatusCard
          title="Active"
          value={active}
          percentage={activePercentage}
          className="border-green-100 bg-green-50 text-green-600"
        />

        <StatusCard
          title="Idle"
          value={idle}
          percentage={idlePercentage}
          className="border-yellow-100 bg-yellow-50 text-yellow-600"
        />

        <StatusCard
          title="Maintenance"
          value={maintenance}
          percentage={maintenancePercentage}
          className="border-orange-100 bg-orange-50 text-orange-600"
        />

        <StatusCard
          title="Offline"
          value={offline}
          percentage={offlinePercentage}
          className="border-red-100 bg-red-50 text-red-600"
        />
      </div>

      {/* ==================================================
          CHART
      ================================================== */}

      <div className="mt-7 rounded-xl border border-gray-100 bg-slate-50/50 p-3 sm:p-5">
        <div className="relative h-[330px] sm:h-[390px]">
          <Doughnut
            data={data}
            options={options}
          />

          {/* Center Value */}

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Total Fleet
            </span>

            <span className="mt-1 text-4xl font-bold text-slate-800 sm:text-5xl">
              {total}
            </span>

            <span className="mt-1 text-sm font-semibold text-green-600">
              {availability}% Available
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================
          FOOTER STATISTICS
      ================================================== */}

      <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">
        <InfoCard
          title="Utilization Rate"
          value={`${utilizationRate}%`}
          description="Currently active vehicles"
          color="text-blue-600"
        />

        <InfoCard
          title="Running Vehicles"
          value={String(active)}
          description={`${activePercentage}% of total fleet`}
          color="text-green-600"
        />

        <InfoCard
          title="Service Due"
          value={String(maintenance)}
          description={`${maintenancePercentage}% of total fleet`}
          color="text-orange-600"
        />
      </div>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <div className="mt-6 flex flex-col gap-2 border-t border-gray-100 pt-4 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Vehicle status is calculated from the
          current fleet records.
        </span>

        <span className="font-semibold text-blue-600">
          Live Fleet Data
        </span>
      </div>
    </section>
  );
};

// ======================================================
// STATUS CARD
// ======================================================

const StatusCard = ({
  title,
  value,
  percentage,
  className,
}: StatusCardProps) => {
  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">
          {title}
        </p>

        <span className="text-xs font-semibold opacity-70">
          {percentage}%
        </span>
      </div>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/70">
        <div
          className="h-full rounded-full bg-current transition-all duration-700"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};

// ======================================================
// INFO CARD
// ======================================================

const InfoCard = ({
  title,
  value,
  description,
  color,
}: InfoCardProps) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-5 transition-all duration-300 hover:bg-white hover:shadow-md">
      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <p
        className={`mt-2 text-3xl font-bold ${color}`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        {description}
      </p>
    </div>
  );
};

export default VehicleUtilizationChart;

