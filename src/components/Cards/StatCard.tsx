
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaChartLine,
} from "react-icons/fa";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;

  percentage?: string;
  trend?: "up" | "down";
  progress?: number;
  subtitle?: string;
  lastUpdated?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  color,
  percentage = "+12%",
  trend = "up",
  progress = 75,
  subtitle = "Compared to last month",
  lastUpdated = "Updated just now",
}: StatCardProps) => {
  const [displayValue, setDisplayValue] = useState(
    typeof value === "number" ? 0 : value
  );

  // ============================================
  // NUMBER ANIMATION
  // ============================================

  useEffect(() => {
    if (typeof value !== "number") {
      setDisplayValue(value);
      return;
    }

    let current = 0;
    const duration = 1000;
    const intervalTime = 20;
    const steps = duration / intervalTime;
    const increment = Math.max(value / steps, 1);

    const timer = window.setInterval(() => {
      current += increment;

      if (current >= value) {
        current = value;
        window.clearInterval(timer);
      }

      setDisplayValue(Math.floor(current));
    }, intervalTime);

    return () => {
      window.clearInterval(timer);
    };
  }, [value]);

  // ============================================
  // SAFE PROGRESS
  // ============================================

  const safeProgress = Math.min(
    100,
    Math.max(0, progress)
  );

  const isPositive = trend === "up";

  // ============================================
  // RENDER
  // ============================================

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-200
        hover:shadow-xl
        hover:shadow-blue-100/40
      "
    >
      {/* ========================================
          DECORATIVE BACKGROUND
      ======================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-10
          -top-10
          h-32
          w-32
          rounded-full
          bg-blue-50
          opacity-70
          transition-transform
          duration-500
          group-hover:scale-125
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          h-20
          w-20
          rounded-full
          bg-slate-50
          opacity-60
        "
      />

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-slate-500">
              {title}
            </p>

            <span className="hidden rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-600 sm:inline-flex">
              Live
            </span>
          </div>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {displayValue}
          </h2>

          <p className="mt-2 text-xs leading-5 text-slate-400 sm:text-sm">
            {subtitle}
          </p>
        </div>

        {/* Icon */}

        <div
          className={`
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-2xl
            text-2xl
            shadow-md
            transition-all
            duration-300
            group-hover:scale-105
            group-hover:rotate-2
            sm:h-16
            sm:w-16
            sm:text-3xl
            ${color}
          `}
        >
          {icon}
        </div>
      </div>

      {/* ========================================
          TREND
      ======================================== */}

      <div className="relative mt-6 flex items-center justify-between gap-3">
        <div
          className={`
            inline-flex
            items-center
            gap-2
            rounded-full
            px-3
            py-1.5
            text-sm
            font-bold
            ${
              isPositive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600"
            }
          `}
        >
          {isPositive ? (
            <FaArrowUp size={11} />
          ) : (
            <FaArrowDown size={11} />
          )}

          {percentage}
        </div>

        <span className="text-xs font-medium text-slate-400">
          This Month
        </span>
      </div>

      {/* ========================================
          PROGRESS
      ======================================== */}

      <div className="relative mt-5">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaChartLine
              size={12}
              className="text-slate-400"
            />

            <span className="text-xs font-semibold text-slate-500">
              Performance
            </span>
          </div>

          <span className="text-xs font-bold text-slate-700">
            {safeProgress}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="
              h-full
              rounded-full
              bg-blue-600
              transition-all
              duration-1000
              ease-out
            "
            style={{
              width: `${safeProgress}%`,
            }}
          />
        </div>
      </div>

      {/* ========================================
          FOOTER
      ======================================== */}

      <div className="relative mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>

          <span className="truncate text-[11px] font-medium text-slate-400">
            {lastUpdated}
          </span>
        </div>

        <span className="shrink-0 text-[11px] font-bold text-blue-600">
          Live Data
        </span>
      </div>
    </div>
  );
};

export default StatCard;
