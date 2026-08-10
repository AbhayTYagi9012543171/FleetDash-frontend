
import {
  FaHeartbeat,
  FaTruck,
  FaGasPump,
  FaTools,
  FaShieldAlt,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import type { ReactNode } from "react";

// ======================================================
// TYPES
// ======================================================

interface HealthMetric {
  id: number;
  title: string;
  value: string;
  progress: number;
  color: string;
  bg: string;
  progressColor: string;
  icon: ReactNode;
  status: string;
  trend: string;
  trendDirection: "up" | "down";
}

// ======================================================
// COMPONENT
// ======================================================

const FleetHealthCard = () => {
  // ====================================================
  // DATA
  // ====================================================

  const metrics: HealthMetric[] = [
    {
      id: 1,
      title: "Vehicle Health",
      value: "96%",
      progress: 96,
      color: "text-green-600",
      bg: "bg-green-100",
      progressColor: "bg-green-500",
      icon: <FaTruck />,
      status: "Excellent",
      trend: "+4.2%",
      trendDirection: "up",
    },
    {
      id: 2,
      title: "Fuel Efficiency",
      value: "18.2 km/L",
      progress: 88,
      color: "text-blue-600",
      bg: "bg-blue-100",
      progressColor: "bg-blue-500",
      icon: <FaGasPump />,
      status: "Efficient",
      trend: "+2.8%",
      trendDirection: "up",
    },
    {
      id: 3,
      title: "Maintenance",
      value: "12 Due",
      progress: 65,
      color: "text-orange-600",
      bg: "bg-orange-100",
      progressColor: "bg-orange-500",
      icon: <FaTools />,
      status: "Attention",
      trend: "-1.5%",
      trendDirection: "down",
    },
    {
      id: 4,
      title: "Safety Score",
      value: "98%",
      progress: 98,
      color: "text-purple-600",
      bg: "bg-purple-100",
      progressColor: "bg-purple-500",
      icon: <FaShieldAlt />,
      status: "Excellent",
      trend: "+3.6%",
      trendDirection: "up",
    },
  ];

  const overallScore = 94;

  // ====================================================
  // MAIN UI
  // ====================================================

  return (
    <section className="w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        {/* Title */}

        <div>
          <div className="flex flex-wrap items-center gap-3">

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Fleet Health
            </h2>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">

              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />

              Healthy

            </span>

          </div>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Overall fleet performance, vehicle condition,
            fuel efficiency and operational safety.
          </p>
        </div>

        {/* Overall Score */}

        <div className="flex items-center gap-4 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 sm:px-5">

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-600 text-xl text-white shadow-lg shadow-green-200 sm:h-16 sm:w-16 sm:text-2xl">
            <FaHeartbeat />
          </div>

          <div>

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Overall Score
            </p>

            <div className="mt-1 flex items-end gap-2">

              <h3 className="text-3xl font-bold tracking-tight text-green-600">
                {overallScore}%
              </h3>

              <span className="mb-1 flex items-center gap-1 text-xs font-bold text-green-600">
                <FaArrowUp size={9} />
                2.4%
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          MAIN HEALTH BANNER
      ================================================== */}

      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-6 text-white shadow-lg shadow-green-100 sm:p-7">

        {/* Decorative circles */}

        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />

        <div className="pointer-events-none absolute -bottom-16 right-20 h-48 w-48 rounded-full bg-white/5" />

        <div className="relative">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                  <FaHeartbeat size={15} />
                </span>

                <span className="text-xs font-bold uppercase tracking-wider text-green-50">
                  Fleet Performance
                </span>

              </div>

              <h3 className="mt-3 text-2xl font-bold sm:text-3xl">
                Excellent Fleet Condition
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-green-50 sm:text-base">
                Your fleet is performing efficiently with
                minimal maintenance issues and a strong
                safety record.
              </p>

            </div>

            {/* Score */}

            <div className="shrink-0 rounded-2xl bg-white/15 px-6 py-4 text-center backdrop-blur-sm">

              <p className="text-xs font-semibold uppercase tracking-wide text-green-50">
                Health Score
              </p>

              <p className="mt-1 text-4xl font-black">
                {overallScore}%
              </p>

            </div>

          </div>

          {/* Progress */}

          <div className="mt-7">

            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-green-50">

              <span>Fleet Health</span>

              <span>{overallScore}%</span>

            </div>

            <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">

              <div
                className="h-full rounded-full bg-white shadow-sm transition-all duration-700"
                style={{
                  width: `${overallScore}%`,
                }}
              />

            </div>

            <div className="mt-2 flex justify-between text-[11px] font-medium text-green-100">

              <span>0%</span>

              <span>Needs Attention</span>

              <span>100%</span>

            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          METRIC CARDS
      ================================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {metrics.map((metric) => (

          <div
            key={metric.id}
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

            {/* Decorative background */}

            <div
              className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-60 blur-2xl ${metric.bg}`}
            />

            <div className="relative">

              {/* Top */}

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    {metric.title}
                  </p>

                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {metric.value}
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
                    ${metric.bg}
                    ${metric.color}
                  `}
                >
                  {metric.icon}
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
                    ${metric.bg}
                    ${metric.color}
                  `}
                >
                  {metric.status}
                </span>

                <span
                  className={`
                    flex
                    items-center
                    gap-1
                    text-xs
                    font-bold
                    ${
                      metric.trendDirection === "up"
                        ? "text-green-600"
                        : "text-orange-600"
                    }
                  `}
                >
                  {metric.trendDirection === "up" ? (
                    <FaArrowUp size={9} />
                  ) : (
                    <FaArrowDown size={9} />
                  )}

                  {metric.trend}
                </span>

              </div>

              {/* Progress */}

              <div className="mt-5">

                <div className="mb-2 flex items-center justify-between">

                  <span className="text-[11px] font-medium text-slate-400">
                    Performance
                  </span>

                  <span className="text-[11px] font-bold text-slate-600">
                    {metric.progress}%
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className={`h-full rounded-full transition-all duration-700 ${metric.progressColor}`}
                    style={{
                      width: `${metric.progress}%`,
                    }}
                  />

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* ==================================================
          FOOTER SUMMARY
      ================================================== */}

      <div className="mt-7 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
            <FaHeartbeat size={17} />
          </div>

          <div>

            <p className="text-sm font-bold text-slate-800">
              Fleet health is above target
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Current health score is {overallScore}%,
              which indicates strong operational performance.
            </p>

          </div>

        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">

          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />

          Updated just now

        </div>

      </div>

    </section>
  );
};

export default FleetHealthCard;
