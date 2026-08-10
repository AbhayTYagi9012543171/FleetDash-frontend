
import {
  FaUserCheck,
  FaUserClock,
  FaUserAltSlash,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaUsers,
} from "react-icons/fa";
import type { ReactNode } from "react";

// ======================================================
// TYPES
// ======================================================

interface DriverStat {
  id: number;
  title: string;
  value: string;
  percentage: string;
  progress: number;
  icon: ReactNode;
  color: string;
  bg: string;
  progressColor: string;
  status: string;
}

// ======================================================
// COMPONENT
// ======================================================

const DriverStatus = () => {
  // ====================================================
  // DATA
  // ====================================================

  const stats: DriverStat[] = [
    {
      id: 1,
      title: "Active Drivers",
      value: "48",
      percentage: "+8%",
      progress: 90,
      icon: <FaUserCheck />,
      color: "text-green-600",
      bg: "bg-green-100",
      progressColor: "bg-green-500",
      status: "Healthy",
    },
    {
      id: 2,
      title: "On Duty",
      value: "36",
      percentage: "+5%",
      progress: 75,
      icon: <FaUserClock />,
      color: "text-blue-600",
      bg: "bg-blue-100",
      progressColor: "bg-blue-500",
      status: "Working",
    },
    {
      id: 3,
      title: "On Leave",
      value: "7",
      percentage: "-2%",
      progress: 30,
      icon: <FaUserAltSlash />,
      color: "text-red-600",
      bg: "bg-red-100",
      progressColor: "bg-red-500",
      status: "Low Impact",
    },
    {
      id: 4,
      title: "Safety Score",
      value: "96%",
      percentage: "+3%",
      progress: 96,
      icon: <FaStar />,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      progressColor: "bg-yellow-500",
      status: "Excellent",
    },
  ];

  // ====================================================
  // CALCULATIONS
  // ====================================================

  const totalDrivers = 48 + 7;
  const activePercentage = Math.round(
    (48 / totalDrivers) * 100
  );

  // ====================================================
  // MAIN UI
  // ====================================================

  return (
    <section className="w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="flex flex-wrap items-center gap-3">

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Driver Status
            </h2>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">

              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />

              Live

            </span>

          </div>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Monitor driver availability, duty status and
            overall safety performance.
          </p>

        </div>

        {/* Driver Summary */}

        <div className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 sm:px-5">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-lg shadow-blue-200">
            <FaUsers />
          </div>

          <div>

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Active Workforce
            </p>

            <div className="mt-1 flex items-end gap-2">

              <h3 className="text-2xl font-bold text-blue-600">
                {activePercentage}%
              </h3>

              <span className="mb-1 text-xs font-medium text-slate-400">
                available
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          DRIVER OVERVIEW BANNER
      ================================================== */}

      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 text-white shadow-lg shadow-blue-100 sm:p-7">

        {/* Decorative Elements */}

        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />

        <div className="pointer-events-none absolute -bottom-20 right-24 h-52 w-52 rounded-full bg-white/5" />

        <div className="relative">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                  <FaUserCheck size={14} />
                </span>

                <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
                  Workforce Overview
                </span>

              </div>

              <h3 className="mt-3 text-2xl font-bold sm:text-3xl">
                Driver Operations Running Smoothly
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                Most drivers are currently active or on duty,
                keeping your fleet operations running efficiently.
              </p>

            </div>

            {/* Active Drivers */}

            <div className="shrink-0 rounded-2xl bg-white/15 px-6 py-4 text-center backdrop-blur-sm">

              <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">
                Active Drivers
              </p>

              <p className="mt-1 text-4xl font-black">
                48
              </p>

              <p className="mt-1 text-xs text-blue-100">
                of {totalDrivers} registered
              </p>

            </div>

          </div>

          {/* Workforce Progress */}

          <div className="mt-7">

            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-blue-100">

              <span>Driver Availability</span>

              <span>{activePercentage}%</span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/20">

              <div
                className="h-full rounded-full bg-white transition-all duration-700"
                style={{
                  width: `${activePercentage}%`,
                }}
              />

            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          DRIVER STAT CARDS
      ================================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((item) => {

          const isNegative =
            item.percentage.startsWith("-");

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

              {/* Background */}

              <div
                className={`
                  pointer-events-none
                  absolute
                  -right-8
                  -top-8
                  h-24
                  w-24
                  rounded-full
                  opacity-50
                  blur-2xl
                  ${item.bg}
                `}
              />

              <div className="relative">

                {/* Top */}

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm font-medium text-slate-500">
                      {item.title}
                    </p>

                    <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                      {item.value}
                    </h3>

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
                      text-xl
                      transition-transform
                      duration-300
                      group-hover:scale-110
                      ${item.bg}
                      ${item.color}
                    `}
                  >
                    {item.icon}
                  </div>

                </div>

                {/* Status */}

                <div className="mt-4 flex items-center justify-between">

                  <span
                    className={`
                      rounded-full
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      ${item.bg}
                      ${item.color}
                    `}
                  >
                    {item.status}
                  </span>

                  <span
                    className={`
                      flex
                      items-center
                      gap-1
                      text-xs
                      font-bold
                      ${
                        isNegative
                          ? "text-red-600"
                          : "text-green-600"
                      }
                    `}
                  >

                    {isNegative ? (
                      <FaArrowDown size={9} />
                    ) : (
                      <FaArrowUp size={9} />
                    )}

                    {item.percentage}

                  </span>

                </div>

                {/* Progress */}

                <div className="mt-5">

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-[11px] font-medium text-slate-400">
                      Performance
                    </span>

                    <span className="text-[11px] font-bold text-slate-600">
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

                {/* Footer */}

                <div className="mt-4 flex items-center justify-between">

                  <span className="text-[11px] text-slate-400">
                    Compared to last month
                  </span>

                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />

                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* ==================================================
          FOOTER SUMMARY
      ================================================== */}

      <div className="mt-7 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <FaUserCheck size={16} />
          </div>

          <div>

            <p className="text-sm font-bold text-slate-800">
              Driver availability is healthy
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {48} drivers are active and available
              for current fleet operations.
            </p>

          </div>

        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">

          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />

          Live driver data

        </div>

      </div>

    </section>
  );
};

export default DriverStatus;
