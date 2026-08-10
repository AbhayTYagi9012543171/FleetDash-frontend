
import {
  FaRoad,
  FaGasPump,
  FaRoute,
  FaBell,
  FaArrowUp,
  FaArrowDown,
  FaChartLine,
} from "react-icons/fa";

import type { ReactNode } from "react";

// ======================================================
// TYPES
// ======================================================

interface SummaryCard {
  id: number;
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  bg: string;
  iconColor: string;
  progress: number;
  trend: "up" | "down";
  percentage: string;
  progressColor: string;
}

// ======================================================
// COMPONENT
// ======================================================

const FleetSummary = () => {
  // ====================================================
  // DATA
  // ====================================================

  const summary: SummaryCard[] = [
    {
      id: 1,
      title: "Distance Today",
      value: "2,340 km",
      subtitle: "Compared to yesterday",
      icon: <FaRoad />,
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
      progress: 82,
      trend: "up",
      percentage: "+12%",
      progressColor: "bg-blue-500",
    },

    {
      id: 2,
      title: "Fuel Used",
      value: "178 L",
      subtitle: "Fuel efficiency improved",
      icon: <FaGasPump />,
      bg: "bg-green-100",
      iconColor: "text-green-600",
      progress: 68,
      trend: "down",
      percentage: "-4%",
      progressColor: "bg-green-500",
    },

    {
      id: 3,
      title: "Trips Today",
      value: "36",
      subtitle: "Trips completed",
      icon: <FaRoute />,
      bg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      progress: 90,
      trend: "up",
      percentage: "+18%",
      progressColor: "bg-yellow-500",
    },

    {
      id: 4,
      title: "Active Alerts",
      value: "5",
      subtitle: "Fewer than yesterday",
      icon: <FaBell />,
      bg: "bg-red-100",
      iconColor: "text-red-600",
      progress: 25,
      trend: "down",
      percentage: "-10%",
      progressColor: "bg-red-500",
    },
  ];

  // ====================================================
  // MAIN UI
  // ====================================================

  return (
    <section className="w-full">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <div className="flex flex-wrap items-center gap-3">

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Fleet Summary
            </h2>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-green-700">

              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />

              Live

            </span>

          </div>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Real-time overview of your fleet's daily
            operational performance.
          </p>

        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">

          <FaChartLine className="text-blue-500" />

          Today's Performance

        </div>

      </div>

      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {summary.map((item) => {

          const isPositive = item.trend === "up";

          return (
            <div
              key={item.id}
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
            >

              {/* ==================================================
                  DECORATIVE BACKGROUND
              ================================================== */}

              <div
                className={`
                  pointer-events-none
                  absolute
                  -right-10
                  -top-10
                  h-28
                  w-28
                  rounded-full
                  opacity-50
                  blur-2xl
                  ${item.bg}
                `}
              />

              {/* ==================================================
                  CARD CONTENT
              ================================================== */}

              <div className="relative">

                {/* Header */}

                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0">

                    <p className="truncate text-sm font-medium text-slate-500">
                      {item.title}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      {item.value}
                    </h3>

                    <p className="mt-2 text-xs text-slate-400">
                      {item.subtitle}
                    </p>

                  </div>

                  {/* Icon */}

                  <div
                    className={`
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      text-xl
                      shadow-sm
                      transition-transform
                      duration-300
                      group-hover:scale-110
                      ${item.bg}
                      ${item.iconColor}
                    `}
                  >
                    {item.icon}
                  </div>

                </div>

                {/* ==================================================
                    TREND
                ================================================== */}

                <div className="mt-6 flex items-center justify-between">

                  <span
                    className={`
                      flex
                      items-center
                      gap-1.5
                      text-sm
                      font-bold
                      ${
                        isPositive
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    `}
                  >

                    {isPositive ? (
                      <FaArrowUp size={10} />
                    ) : (
                      <FaArrowDown size={10} />
                    )}

                    {item.percentage}

                  </span>

                  <span className="text-xs font-medium text-slate-400">
                    Today
                  </span>

                </div>

                {/* ==================================================
                    PROGRESS
                ================================================== */}

                <div className="mt-5">

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-xs font-medium text-slate-500">
                      Performance
                    </span>

                    <span className="text-xs font-bold text-slate-700">
                      {item.progress}%
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className={`
                        h-full
                        rounded-full
                        transition-all
                        duration-700
                        ${item.progressColor}
                      `}
                      style={{
                        width: `${item.progress}%`,
                      }}
                    />

                  </div>

                </div>

                {/* ==================================================
                    FOOTER
                ================================================== */}

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                  <span className="text-[11px] font-medium text-slate-400">
                    Updated just now
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600">

                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />

                    Live Data

                  </span>

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
};

export default FleetSummary;
